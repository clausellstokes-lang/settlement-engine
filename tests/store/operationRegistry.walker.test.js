/**
 * operationRegistry.walker.test.js — Track K COMPLETION §3: the STRUCTURAL-
 * PREVENTION walker (the point of the wave).
 *
 * The North Star (docs/DESIGN_TRACK_K_COMPLETION.md §0/§3): ONE typed operation
 * surface over every state-mutating store action, enforced so that *a NEW
 * mutating action cannot ship outside the operation surface*. This walker is the
 * enforcement: it runs a set()-usage CENSUS over every store slice (the clamp-
 * baseline source-scan idiom, tests/lint/clampPrimitiveBaseline.test.js) and
 * asserts that every mutating action is EITHER registered with an opType in
 * operationRegistry.js OR listed exempt-with-reason. The exempt list is
 * shrink-only.
 *
 * WHAT COUNTS AS A "MUTATING ACTION" (the census denominator): a function-valued
 * property of a store slice whose body REFERENCES the slice's `set` capability —
 * either a direct producer call `set(state => …)` OR the `set` identifier passed
 * to a lazily-loaded session helper (e.g. `runSpatialCanonize({ set, get, … })`,
 * the world-pulse macro-ops' first-paint-budget pattern). A getter (references
 * only `get`) is not mutating and is not in the denominator.
 *
 * WHY THIS SHAPE. The runtime EMISSION of operation envelopes at action
 * boundaries is deliberately deferred to the Surveyor build (its only consumer);
 * see operationRegistry.js's header for the budget + sequencing rationale. So
 * this wave's guarantee is a COMPLETENESS INVARIANT over the vocabulary, not a
 * runtime behavior — exactly what a structural-prevention guard should be: the
 * registry is the manifest, this walker is the manifest's walker.
 *
 * CANNOT-CATCH (documented evasion gaps, mirroring the clamp ratchet's honesty
 * clause):
 *   1. A get()-DELEGATING orchestrator — an action that mutates ONLY by calling
 *      another registered action through `get().subAction()` (e.g. authSignOut →
 *      get().clearAuth; applyAllQueuedRegionalImpacts → loops
 *      get().applyQueuedRegionalImpact; setPrimaryDeity/imposeCult → *Impl(get,…))
 *      references `get`, never `set`, so it is NOT in the denominator. Its effect
 *      is the sum of the registered sub-ops it invokes — covered transitively,
 *      not a new primitive verb. Such compositions are intentionally out of the
 *      registry (registering them would break the exact-match invariant below).
 *   2. A mutation hidden behind a computed or nested spread. Direct
 *      `...create*Actions(...)` calls imported by a composed slice ARE followed
 *      into the factory's returned object. A computed spread or a factory that
 *      returns another spread still requires code review.
 *   3. A `set` reference hidden by aliasing (`const s = set; s(...)`). None
 *      exists; the convention is to call `set` directly or pass it by name.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  OPERATIONS,
  registeredActionNames,
  exemptActionNames,
  EXEMPT_CEILING,
} from '../../src/store/operationRegistry.js';
import { buildCompendiumDataObject } from '../../scripts/generate-compendium-data.mjs';

const STORE_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../src/store');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ── Compendium legibility (this lane) ────────────────────────────────────────
// A LEGIBLE label carries a real, human, spaced name — never a raw camelCase id.
// The [a-z][A-Z] test catches an unspaced camelCase run (generateSettlement) while
// leaving acronyms (NPC growth) and single words (Food) alone. Every rendered
// vocabulary entry must ALSO carry a non-empty description. The fix for a red:
// author label + description at the source (operationRegistry.js OPERATIONS, or the
// gen script's ENDGAME_SYSTEMS / CAUSAL_VARIABLE_DESC / PRESSURE_GLOSSARY, or the
// engine's VARIABLE_LABEL) — never a per-surface camelCase splitter.
/** @param {unknown} label @returns {boolean} */
function isLegibleLabel(label) {
  // Non-empty, no unspaced camelCase run (generateSettlement), and no raw
  // snake_case id (food_security) leaking through as a "label".
  return typeof label === 'string' && label.trim().length > 0
    && !/[a-z][A-Z]/.test(label) && !label.includes('_');
}
/** @param {unknown} desc @returns {boolean} */
function isNonEmptyText(desc) {
  return typeof desc === 'string' && desc.trim().length > 0;
}

// ── The census scanner ──────────────────────────────────────────────────────
// A comment/string-aware, brace-matched source scan. Kept self-contained here
// (the clamp ratchet's idiom) — it is a build-time census tool, never runtime.

/**
 * Replace the contents of comments and string/template literals with spaces so a
 * `set` mentioned in prose or a string can never false-match. Length-preserving
 * is unnecessary here (we only test the result), so we simply drop them.
 */
function stripCode(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  let state = 'code'; // code | line | block | sq | dq | tpl
  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];
    if (state === 'code') {
      if (c === '/' && c2 === '/') { state = 'line'; i += 2; continue; }
      if (c === '/' && c2 === '*') { state = 'block'; i += 2; continue; }
      if (c === "'") { state = 'sq'; i++; continue; }
      if (c === '"') { state = 'dq'; i++; continue; }
      if (c === '`') { state = 'tpl'; i++; continue; }
      out += c; i++; continue;
    }
    if (state === 'line') { if (c === '\n') { state = 'code'; out += c; } i++; continue; }
    if (state === 'block') { if (c === '*' && c2 === '/') { state = 'code'; i += 2; } else i++; continue; }
    if (state === 'sq') { if (c === '\\') { i += 2; continue; } if (c === "'") state = 'code'; i++; continue; }
    if (state === 'dq') { if (c === '\\') { i += 2; continue; } if (c === '"') state = 'code'; i++; continue; }
    if (state === 'tpl') { if (c === '\\') { i += 2; continue; } if (c === '`') state = 'code'; i++; continue; }
  }
  return out;
}

/**
 * Locate the opening `{` of the object a slice factory contributes to the store.
 * Handles both `(set, …) => ({ … })` and `(set, …) => { …; return { … } }`
 * (the two forms in use). For a block body, the returned object is the FIRST
 * top-level `return {` — the module-init `set(...)` reporters some slices call
 * before `return` are correctly outside it.
 *
 * Parameter tolerance is DELIBERATELY asymmetric: the first parameter must be
 * literally `set` — the census keys on that identifier (referencesSet), so a
 * renamed `set` would silently empty a slice's share of the denominator — while
 * later parameters (get, _get, api, or none) may carry any name: the walker
 * never reads them, so renaming an unused `get` must not break the census.
 * The shape pins at the bottom of this file hold both halves.
 */
function findSliceObjectStart(code) {
  const sig = /export const create[A-Za-z]+Slice\s*=\s*\(\s*set\s*(?:,\s*[A-Za-z_$][\w$]*\s*)*\)\s*=>\s*/g;
  const m = sig.exec(code);
  if (!m) return -1;
  let i = m.index + m[0].length;
  while (/\s/.test(code[i])) i++;
  if (code[i] === '(') {
    i++;
    while (/\s/.test(code[i])) i++;
    return code[i] === '{' ? i : -1;
  }
  if (code[i] === '{') {
    let depth = 0;
    for (let j = i; j < code.length; j++) {
      const ch = code[j];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (depth === 1 && code.startsWith('return', j) && /[^\w$]/.test(code[j - 1] || ' ')) {
        let k = j + 6;
        while (/\s/.test(code[k])) k++;
        if (code[k] === '{') return k;
      }
    }
  }
  return -1;
}

/** True when the value span references the `set` identifier (a direct call
 *  `set(` or `set` passed to a helper) — never `.set(`, `reset`, `settlement`, … */
function referencesSet(valText) {
  return /(?<![\w.$])set(?![\w$])/.test(valText);
}

/**
 * Enumerate the slice object's DEPTH-1 properties. Returns
 * { key, isFn, usesSet, spreadFactory? } per property. A direct factory-call
 * spread records its callee so the census can follow the imported action module.
 */
function scanProps(code, objStart) {
  const props = [];
  const n = code.length;
  let i = objStart + 1;
  let depth = 1;
  let expectKey = true;
  while (i < n && depth > 0) {
    const c = code[i];
    if (/\s/.test(c)) { i++; continue; }
    if (expectKey && depth === 1) {
      if (code.startsWith('...', i)) {
        const valueStart = i + 3;
        let k = valueStart;
        let valueDepth = 0;
        while (k < n) {
          const cc = code[k];
          if (cc === '{' || cc === '(' || cc === '[') valueDepth++;
          else if (cc === '}' || cc === ')' || cc === ']') {
            if (valueDepth === 0) break;
            valueDepth--;
          } else if (cc === ',' && valueDepth === 0) {
            break;
          }
          k++;
        }
        const spreadValue = code.slice(valueStart, k);
        const factory = /^\s*([A-Za-z_$][\w$]*)\s*\(/.exec(spreadValue);
        props.push({
          key: null,
          isFn: false,
          usesSet: false,
          spreadFactory: factory?.[1] || null,
        });
        i = code[k] === ',' ? k + 1 : k;
        continue;
      }
      const km = /^(?:(['"])([^'"]+)\1|([A-Za-z_$][\w$]*))/.exec(code.slice(i));
      if (km) {
        const key = km[2] || km[3];
        let j = i + km[0].length;
        while (/\s/.test(code[j])) j++;
        let isFn = false;
        let valStart;
        if (code[j] === '(') { isFn = true; valStart = j; }           // method shorthand key(...) {
        else if (code[j] === ':') { valStart = j + 1; }
        else { valStart = j; }
        let k = valStart;
        let vdepth = 0;
        let valEnd = -1;
        while (k < n) {
          const cc = code[k];
          if (cc === '{' || cc === '(' || cc === '[') vdepth++;
          else if (cc === '}' || cc === ')' || cc === ']') { if (vdepth === 0) { valEnd = k; break; } vdepth--; }
          else if (cc === ',' && vdepth === 0) { valEnd = k; break; }
          k++;
        }
        if (valEnd === -1) valEnd = n;
        const valText = code.slice(valStart, valEnd);
        if (!isFn) {
          if (/^\s*(async\s+)?(\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/.test(valText) ||
              /^\s*(async\s+)?function\b/.test(valText)) isFn = true;
        }
        props.push({ key, isFn, usesSet: isFn && referencesSet(valText) });
        i = valEnd;
        if (code[i] === ',') i++;
        continue;
      }
    }
    if (c === '{' || c === '(' || c === '[') depth++;
    else if (c === '}' || c === ')' || c === ']') depth--;
    i++;
  }
  return props;
}

/**
 * Map named imports to their sibling store modules. The operation factories are
 * deliberately local modules; following only relative named imports keeps the
 * walker deterministic and prevents it from executing application code.
 */
function importedStoreModules(rawCode) {
  const modules = new Map();
  const importPattern =
    /import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = importPattern.exec(rawCode)) !== null) {
    if (!match[2].startsWith('./')) continue;
    const relativeSource = match[2].slice(2);
    const sourceFile = relativeSource.endsWith('.js')
      ? relativeSource
      : `${relativeSource}.js`;
    for (const specifier of match[1].split(',')) {
      const parts = specifier.trim().split(/\s+as\s+/);
      if (!parts[0]) continue;
      modules.set(parts[1] || parts[0], sourceFile);
    }
  }
  return modules;
}

/**
 * Locate the object returned by an exported function declaration without
 * importing or executing the module. Action factories currently use this
 * explicit form so their structural surface remains auditable.
 */
function findActionFactoryObjectStart(code, factoryName) {
  const escapedName = factoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const declaration = new RegExp(
    `export\\s+function\\s+${escapedName}\\s*\\(`,
  ).exec(code);
  if (!declaration) return -1;

  let i = declaration.index + declaration[0].length - 1;
  let parameterDepth = 0;
  for (; i < code.length; i++) {
    if (code[i] === '(') parameterDepth++;
    else if (code[i] === ')') {
      parameterDepth--;
      if (parameterDepth === 0) {
        i++;
        break;
      }
    }
  }
  while (/\s/.test(code[i])) i++;
  if (code[i] !== '{') return -1;

  let bodyDepth = 0;
  for (let j = i; j < code.length; j++) {
    if (code[j] === '{') bodyDepth++;
    else if (code[j] === '}') bodyDepth--;
    else if (
      bodyDepth === 1
      && code.startsWith('return', j)
      && /[^\w$]/.test(code[j - 1] || ' ')
      && /[^\w$]/.test(code[j + 6] || ' ')
    ) {
      let k = j + 6;
      while (/\s/.test(code[k])) k++;
      if (code[k] === '{') return k;
    }
  }
  return -1;
}

/** The slice files the store actually composes — derived from index.js so the
 *  census scans exactly the live surface even if a slice is renamed. */
function composedSliceFiles() {
  const index = readFileSync(join(STORE_DIR, 'index.js'), 'utf8');
  const re = /import\s*\{\s*create[A-Za-z]+Slice\s*\}\s*from\s*['"]\.\/([\w]+\.js)['"]/g;
  const files = [];
  let m;
  while ((m = re.exec(index)) !== null) files.push(m[1]);
  return files;
}

/**
 * The census: { census: Map(name → sliceFile), failures: string[] } across the
 * store. Shape drift the walker cannot parse is COLLECTED per file and asserted
 * by a dedicated test — never thrown. A collection-time throw is the worst
 * failure mode a guard has: it reads as a broken test file rather than a failed
 * invariant, reports only the first offender, and takes every other assertion
 * in this file down with it (2026-07-27: a `(set, get)` → `(set, _get)` rename
 * in configSlice.js did exactly that).
 */
function censusMutatingActions() {
  const out = new Map();
  const failures = [];
  for (const file of composedSliceFiles()) {
    const rawCode = readFileSync(join(STORE_DIR, file), 'utf8');
    const code = stripCode(rawCode);
    const objStart = findSliceObjectStart(code);
    if (objStart === -1) {
      failures.push(
        `${file}: could not locate the slice object. The walker matches ` +
        '`export const create*Slice = (set, …) => …` where the FIRST parameter ' +
        'is literally `set` (the census keys on that identifier); later ' +
        'parameters may carry any name or be absent. Restore the convention, ' +
        'or extend findSliceObjectStart AND its shape pins in this file.',
      );
      continue;
    }
    const sliceProps = scanProps(code, objStart);
    for (const p of sliceProps) {
      if (p.isFn && p.usesSet) out.set(p.key, file);
    }
    const importedModules = importedStoreModules(rawCode);
    for (const { spreadFactory } of sliceProps) {
      if (!spreadFactory) continue;
      const factoryFile = importedModules.get(spreadFactory);
      if (!factoryFile) {
        failures.push(
          `${file}: action factory ${spreadFactory} is not a relative named ` +
          'import — the walker follows only relative named imports of sibling ' +
          'store modules.',
        );
        continue;
      }
      const factoryCode = stripCode(
        readFileSync(join(STORE_DIR, factoryFile), 'utf8'),
      );
      const factoryStart = findActionFactoryObjectStart(
        factoryCode,
        spreadFactory,
      );
      if (factoryStart === -1) {
        failures.push(
          `${factoryFile}: could not locate the object returned by ` +
          `${spreadFactory} — action factories must keep the explicit ` +
          '`export function name(…) { … return { … } }` form.',
        );
        continue;
      }
      for (const property of scanProps(factoryCode, factoryStart)) {
        if (property.isFn && property.usesSet) {
          out.set(property.key, factoryFile);
        }
      }
    }
  }
  return { census: out, failures };
}

describe('Track K COMPLETION — operation registry completeness walker', () => {
  const { census, failures: walkerFailures } = censusMutatingActions();
  const denominator = [...census.keys()].sort();
  const registered = registeredActionNames();
  const exempt = exemptActionNames();
  const covered = new Set([...registered, ...exempt]);

  test('the walker parsed every composed slice (shape drift fails HERE, not at collection)', () => {
    // A slice-factory signature or action-factory form the walker cannot parse
    // lands here with a per-file message telling you the accepted shapes. When
    // this test is red, the census below is missing that file's actions — treat
    // any other failure in this describe as downstream of this one.
    expect(walkerFailures).toEqual([]);
  });

  test('the census finds a non-trivial denominator (scanner did not silently break)', () => {
    // A floor guard: if a refactor breaks findSliceObjectStart the census would
    // collapse to ~0 and every other assertion would pass vacuously. The store
    // has well over 100 mutating actions; assert we are in that regime.
    expect(denominator.length).toBeGreaterThan(150);
  });

  test('every mutating store action is registered with an opType OR exempt-with-reason', () => {
    const unclassified = denominator.filter((name) => !covered.has(name));
    // A NEW mutating action that ships without a registry entry lands here. Add it
    // to OPERATIONS (with an opType) or EXEMPT_OPERATIONS (with a reason) in
    // src/store/operationRegistry.js.
    expect(unclassified).toEqual([]);
  });

  test('the registry carries NO stale entries — every covered name is a real mutating action', () => {
    // A registered/exempt name whose action was renamed or deleted (so the census
    // no longer finds it) lands here. Remove or rename its registry entry. This is
    // the honest, monotone half of the clamp-ratchet idiom: covered ⊆ denominator.
    const stale = [...covered].filter((name) => !census.has(name)).sort();
    expect(stale).toEqual([]);
  });

  test('no action is BOTH registered and exempt', () => {
    const both = registered.filter((name) => exempt.includes(name)).sort();
    expect(both).toEqual([]);
  });

  test('the exempt list never grows past its committed ceiling (shrink-only)', () => {
    // As actions are adopted into the operation surface the exempt list shrinks and
    // the ceiling is lowered with it; it is never raised without a deliberate,
    // documented reason (the clamp-ratchet monotonicity rule).
    expect(exempt.length).toBeLessThanOrEqual(EXEMPT_CEILING);
  });
});

// ── Locator shape pins (parameter-rename regression, 2026-07-27) ─────────────
// configSlice renamed its unused second parameter — `(set, get)` → `(set, _get)`
// — and the old locator regex stopped matching, erroring the whole file at
// COLLECTION. These pins hold the locator's tolerance contract directly, so a
// locator regression or a new factory shape is caught here without waiting for
// a live slice to drift onto it.
describe('walker locator — slice-factory shape pins', () => {
  const arrow = (params) =>
    stripCode(`export const createFooSlice = ${params} => ({ bump: () => set({ n: 1 }) })`);

  test('tolerates any later-parameter naming or arity (the walker never reads them)', () => {
    expect(findSliceObjectStart(arrow('(set, get)'))).not.toBe(-1);
    expect(findSliceObjectStart(arrow('(set, _get)'))).not.toBe(-1);
    expect(findSliceObjectStart(arrow('(set)'))).not.toBe(-1);
    expect(findSliceObjectStart(arrow('(set, get, api)'))).not.toBe(-1);
  });

  test('block-body factories still resolve to their top-level return object', () => {
    const code = stripCode(
      'export const createFooSlice = (set, _get) => { const seed = 1; return { seed }; }',
    );
    expect(findSliceObjectStart(code)).not.toBe(-1);
  });

  test('a renamed FIRST parameter is rejected — pinned as a decision, not a gap', () => {
    // The census keys on the literal identifier `set` (referencesSet): if `set`
    // were renamed, every action in that slice would silently drop out of the
    // denominator and an unregistered mutating action could ship unseen. So a
    // `set` rename must fail loudly (via the parsed-every-slice test above),
    // never tolerate-and-miscount.
    expect(findSliceObjectStart(arrow('(_set, get)'))).toBe(-1);
    expect(findSliceObjectStart(arrow('(store, get)'))).toBe(-1);
  });
});

// ── R-0 undo-truth: the undoState walker (atlas VI.3 #62) ─────────────────────
// undoToken:null used to conflate three meanings (honest-irreversible /
// recovery-exists-elsewhere / not-built). Every op now declares which, in ONE
// flat field, fail-closed: a NEW op shipped without undoState (or with a value
// outside the grammar) lands here. The grammar mirrors the registry typedef:
//   action | action-partial | irreversible | none | not-applicable
//   | undetermined | external:<ref> | partial:<ref>
// 'action-partial' is the PARTIAL variant of the armed state: undoToken names a
// real registered inverse, but the inverse restores the primary state only
// (canonize/uncanonize: phase + canonizedAt round-trip, the event log does not).
describe('R-0 undo-truth — every operation declares an explicit undoState', () => {
  const ops = Object.values(OPERATIONS);
  const VALID_UNDO_STATE =
    /^(action|action-partial|irreversible|none|not-applicable|undetermined|external:\S+|partial:\S+)$/;
  // Non-null undoToken ⇔ an ARMED undoState ('action' = full restore,
  // 'action-partial' = partial restore). A token-carrying row MAY declare partial
  // restoration but may NEVER claim a null-state such as 'none'; a token-less row
  // may never claim an armed state.
  const ARMED_STATES = new Set(['action', 'action-partial']);
  const tokenStateAgree = (op) =>
    (op.undoToken != null) === ARMED_STATES.has(op.undoState);

  test('every registered operation carries a valid undoState (fail-closed enumeration)', () => {
    const bad = ops
      .filter((op) => !VALID_UNDO_STATE.test(String(op.undoState)))
      .map((op) => `${op.opType} → ${JSON.stringify(op.undoState)}`);
    // A NEW operation shipped without an undoState lands here. Classify it in
    // src/store/operationRegistry.js: 'action' iff it declares an undoToken;
    // otherwise say WHICH null-meaning applies (see the OperationSpec typedef) —
    // and use 'undetermined' rather than guessing.
    expect(bad, `\nOperations missing a valid undoState:\n  ${bad.join('\n  ')}\n`).toEqual([]);
  });

  test('undoToken and undoState agree in BOTH directions (non-null undoToken ⇔ armed state)', () => {
    // The advertised-undo field and its classification can never contradict:
    // an op that names an undo action is 'action' or 'action-partial'; an op
    // classified as armed must name one. This is the fail-closed half of the
    // queue-#5 cure — a row cannot re-grow a token while claiming a null-state,
    // or vice versa.
    const bad = ops
      .filter((op) => !tokenStateAgree(op))
      .map((op) => `${op.opType} (undoToken:${JSON.stringify(op.undoToken)}, undoState:${JSON.stringify(op.undoState)})`);
    expect(bad, `\nundoToken/undoState contradictions:\n  ${bad.join('\n  ')}\n`).toEqual([]);
  });

  test('a token-carrying row MAY be partial — and STILL fails claiming "none" (discrimination pin)', () => {
    // The relaxation is exactly one state wide: partial arming is expressible,
    // the old false binary ('action' or token-less) is not re-imposed, and the
    // walker still rejects a token row that denies its own undo.
    expect(tokenStateAgree({ undoToken: 'x', undoState: 'action' })).toBe(true);
    expect(tokenStateAgree({ undoToken: 'x', undoState: 'action-partial' })).toBe(true);
    expect(tokenStateAgree({ undoToken: 'x', undoState: 'none' })).toBe(false);
    expect(tokenStateAgree({ undoToken: 'x', undoState: 'external:uncanonize' })).toBe(false);
    expect(tokenStateAgree({ undoToken: null, undoState: 'action' })).toBe(false);
    expect(tokenStateAgree({ undoToken: null, undoState: 'action-partial' })).toBe(false);
  });

  test('canonize-family truth pins: the live pair IS partial; saved-by-id has NO inverse', () => {
    // canonize/uncanonize each reset eventLog to [] and the inverse resets it
    // again — phase + canonizedAt round-trip, the event log does not. And
    // uncanonize() takes no id and mutates only the LIVE slice, so a saved-by-id
    // canonization is unreachable by it: 'external:uncanonize' was a false
    // truth-field value; the honest no-inverse value is 'none'.
    expect(OPERATIONS.canonize.undoToken).toBe('uncanonize');
    expect(OPERATIONS.canonize.undoState).toBe('action-partial');
    expect(OPERATIONS.uncanonize.undoToken).toBe('canonize');
    expect(OPERATIONS.uncanonize.undoState).toBe('action-partial');
    expect(OPERATIONS.canonizeSavedSettlement.undoToken).toBeNull();
    expect(OPERATIONS.canonizeSavedSettlement.undoState).toBe('none');
  });

  test('positive control — the undoState grammar discriminates', () => {
    expect(VALID_UNDO_STATE.test('action')).toBe(true);
    expect(VALID_UNDO_STATE.test('action-partial')).toBe(true);
    expect(VALID_UNDO_STATE.test('irreversible')).toBe(true);
    expect(VALID_UNDO_STATE.test('external:cancelQueuedEvent')).toBe(true);
    expect(VALID_UNDO_STATE.test('partial:pushMapUndo')).toBe(true);
    expect(VALID_UNDO_STATE.test('undetermined')).toBe(true);
    expect(VALID_UNDO_STATE.test('external:')).toBe(false);
    expect(VALID_UNDO_STATE.test('partial:')).toBe(false);
    expect(VALID_UNDO_STATE.test('maybe')).toBe(false);
    expect(VALID_UNDO_STATE.test('')).toBe(false);
    expect(VALID_UNDO_STATE.test('undefined')).toBe(false);
  });
});

// ── The compendium-legibility walker (operations-legibility lane) ─────────────
// Every registered operation must carry a legible, spaced label + a plain
// description, and the Living-World tab's other rendered vocabularies (endgame
// systems, causal variables, pressures) must too. No display surface may render a
// bare camelCase/snake_case id as the primary term.
describe('Compendium legibility — operations carry a spaced label + a description', () => {
  const ops = Object.values(OPERATIONS);

  test('every registered operation has a legible, spaced label (no raw camelCase)', () => {
    const bad = ops
      .filter((op) => !isLegibleLabel(op.label))
      .map((op) => `${op.opType} → ${JSON.stringify(op.label)}`);
    // A NEW operation shipped without a legible label lands here. Add a spaced,
    // human `label` in src/store/operationRegistry.js OPERATIONS — never a runtime
    // camelCase splitter (it would mangle acronyms like NPC/AI and invent names).
    expect(bad, `\nOperations with a missing / raw-camelCase label:\n  ${bad.join('\n  ')}\n`).toEqual([]);
  });

  test('every registered operation has a non-empty description', () => {
    const bad = ops.filter((op) => !isNonEmptyText(op.description)).map((op) => op.opType);
    // Add a 1-2 sentence `description` of what the op does in OPERATIONS. Ground it
    // in the real handler/engine effect (never describe an effect the code lacks).
    expect(bad, `\nOperations with no description:\n  ${bad.join('\n  ')}\n`).toEqual([]);
  });

  test('positive control — the legibility check discriminates', () => {
    // Raw camelCase / snake_case ids and blanks fail; real spaced labels + acronyms pass.
    expect(isLegibleLabel('generateSettlement')).toBe(false);
    expect(isLegibleLabel('food_security')).toBe(false);
    expect(isLegibleLabel('')).toBe(false);
    expect(isLegibleLabel('Generate a settlement')).toBe(true);
    expect(isLegibleLabel('NPC growth')).toBe(true);
    expect(isLegibleLabel('Food')).toBe(true);
    expect(isNonEmptyText('')).toBe(false);
    expect(isNonEmptyText('does a thing')).toBe(true);
  });
});

describe('Compendium legibility — Living-World vocabularies carry labels + descriptions', () => {
  // Read the freshly-built compendium object (the source the gen script bakes into
  // the artifact) so this checks the authored copy regardless of regen state.
  const data = buildCompendiumDataObject();

  test('every endgame system has a legible label + a non-empty blurb', () => {
    const bad = data.systems
      .filter((s) => !isLegibleLabel(s.label) || !isNonEmptyText(s.blurb))
      .map((s) => s.id);
    // Author `label` + `blurb` in scripts/generate-compendium-data.mjs ENDGAME_SYSTEMS.
    expect(bad, `\nEndgame systems missing a legible label or blurb:\n  ${bad.join('\n  ')}\n`).toEqual([]);
  });

  test('every causal variable has a legible label + a non-empty description', () => {
    const bad = data.causal.variableEntries
      .filter((v) => !isLegibleLabel(v.label) || !isNonEmptyText(v.description))
      .map((v) => v.id);
    // Label comes from src/domain/causalState.js VARIABLE_LABEL; description from the
    // gen script's CAUSAL_VARIABLE_DESC.
    expect(bad, `\nCausal variables missing a legible label or description:\n  ${bad.join('\n  ')}\n`).toEqual([]);
  });

  test('every pressure has a legible label + a non-empty description', () => {
    const bad = data.pressures.entries
      .filter((p) => !isLegibleLabel(p.label) || !isNonEmptyText(p.description))
      .map((p) => p.id);
    // Author label + description in the gen script's PRESSURE_GLOSSARY.
    expect(bad, `\nPressures missing a legible label or description:\n  ${bad.join('\n  ')}\n`).toEqual([]);
  });
});

describe('Compendium legibility — no display surface renders a bare operation id as the term', () => {
  // The converted display sites must read the authored label / accessor, never the
  // raw opType, as the PRIMARY term. (OperationsHub + the Surveyor still show the
  // opType as a SECONDARY monospace reference, which is intentional and allowed.)
  const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

  test('the A–Z index uses the operation label as its term', () => {
    const src = read('src/components/compendium/CompendiumDashboard.jsx');
    expect(
      /for \(const o of CD\.operations\.entries\)[\s\S]*?term:\s*o\.label/.test(src),
      'CompendiumDashboard A–Z must push { term: o.label } for operations (not o.opType). Use the authored label.',
    ).toBe(true);
    expect(
      /for \(const o of CD\.operations\.entries\)[\s\S]*?term:\s*o\.opType/.test(src),
      'CompendiumDashboard A–Z renders the raw o.opType as the term — use o.label.',
    ).toBe(false);
  });

  test('the global search index uses the operation label as its term', () => {
    const src = read('src/domain/compendium/searchIndex.js');
    expect(
      /OPERATION_ENTRIES[\s\S]*?term:\s*o\.label/.test(src),
      'searchIndex OPERATION_ENTRIES must use term: o.label (raw opType stays only in keywords).',
    ).toBe(true);
  });

  test('the Surveyor apply panel renders the operation label via the accessor', () => {
    const src = read('src/components/surveyor/InterpretApplyPanel.jsx');
    expect(
      src.includes('operationLabel(op.opType)'),
      'InterpretApplyPanel must render operationLabel(op.opType) as the op heading (not a bare {op.opType}).',
    ).toBe(true);
  });
});
