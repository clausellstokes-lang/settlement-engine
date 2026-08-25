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
 *   2. A mutation performed by an action defined OUTSIDE a *Slice.js and spread
 *      in. No slice does this today (verified: every `...spread` inside a slice
 *      is an in-body object spread, never an action-object spread); if one is
 *      added, this scan will not see it — covered by code review.
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
  registeredActionNames,
  exemptActionNames,
  EXEMPT_CEILING,
} from '../../src/store/operationRegistry.js';

const STORE_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../src/store');

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
 * Handles both `(set, get) => ({ … })` and `(set, get) => { …; return { … } }`
 * (the two forms in use). For a block body, the returned object is the FIRST
 * top-level `return {` — the module-init `set(...)` reporters some slices call
 * before `return` are correctly outside it.
 */
function findSliceObjectStart(code) {
  const sig = /export const create[A-Za-z]+Slice\s*=\s*\(set,\s*get\)\s*=>\s*/g;
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
 * { key, isFn, usesSet } per property. `...spread` elements are skipped (no
 * slice spreads an action object; see CANNOT-CATCH #2).
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
        i += 3;
        while (i < n && depth >= 1) {
          const cc = code[i];
          if (cc === '{' || cc === '(' || cc === '[') depth++;
          else if (cc === '}' || cc === ')' || cc === ']') { depth--; if (depth === 0) break; }
          else if (cc === ',' && depth === 1) break;
          i++;
        }
        if (code[i] === ',') i++;
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

/** The census: { name → sliceFile } for every mutating action across the store. */
function censusMutatingActions() {
  const out = new Map();
  for (const file of composedSliceFiles()) {
    const code = stripCode(readFileSync(join(STORE_DIR, file), 'utf8'));
    const objStart = findSliceObjectStart(code);
    if (objStart === -1) throw new Error(`walker: could not locate slice object in ${file}`);
    for (const p of scanProps(code, objStart)) {
      if (p.isFn && p.usesSet) out.set(p.key, file);
    }
  }
  return out;
}

describe('Track K COMPLETION — operation registry completeness walker', () => {
  const census = censusMutatingActions();
  const denominator = [...census.keys()].sort();
  const registered = registeredActionNames();
  const exempt = exemptActionNames();
  const covered = new Set([...registered, ...exempt]);

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
