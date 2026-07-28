/**
 * configDirectWriterExemptions.scan.test.js — Wave R-4 lane P-4.
 *
 * WHY THIS EXISTS. R-3 gave `updateConfig` a validated door: every patch key is
 * checked against isAllowedConfigKey, unknown keys are dropped with a typed
 * report, and tests/generators/configPatchAllowlistWalker.test.js keeps the
 * admitted surface a superset of everything source reads or writes. That story
 * is only true while updateConfig is the ONLY way `state.config` changes — and
 * when this scan was written it was not: four store actions wrote the config draft
 * directly. Unenumerated, those side doors made the one-validated-door claim
 * quietly false, and a FUTURE direct writer could plant an unadmitted key that
 * updateConfig would never have accepted, that isAllowedConfigKey therefore never
 * vets, and that no reader can rely on.
 *
 * AS OF R-5b (owner queue #21) ALL FOUR EXEMPTIONS ARE RETIRED — every one of them
 * turned out to be a DEAD op, so each bypass was a door nobody walked through. The
 * claim is now unqualified: updateConfig is the only writer of state.config in src.
 * This scan's job shifts from ENUMERATING bypasses to REFUSING the first new one.
 *
 * WHAT IT DOES. It scans src for assignments to an immer draft's `.config`
 * (whole-object, dotted key, or computed key) and asserts the EXACT SET equals
 * the enumeration below: the door, and today nothing else. Any other direct writer
 * reds here. It also asserts each exemption — should one ever be admitted again —
 * writes a key isAllowedConfigKey admits, so "it bypasses the door but writes an
 * admitted key" stays a fact rather than a claim.
 *
 * KNOWN EDGES (deliberate, reviewed):
 *   - Draft receivers are matched by name (state / s / draft / st). Those names
 *     appear as an assignment target's receiver only inside immer `set` callbacks;
 *     a writer naming its draft something else would escape, so the scan also
 *     asserts no draft-named config assignment exists OUTSIDE src/store, which is
 *     where every such callback lives.
 *   - Config objects that are NOT the store draft are out of scope and are not
 *     asserted on, because they are a different record: `out.config` in
 *     lib/gallery.js, `row.config` / `updates.config` in lib/saves.js,
 *     `snapshot.config` in domain/events/undoEvent.js, `next.config` in
 *     domain/events/mutateWorld.js (measured 2026-07-27). None of them can reach
 *     store state without passing a store action.
 *   - The enclosing-action label anchors on the two-space `  name: (` shape every
 *     slice uses. A writer nested deeper than one action level would be labelled
 *     "(top level)" rather than missed, so it still reds the exact-set assertion.
 *   - CONSTRUCTION of the config object is a separate seam from mutation and is
 *     not scanned: configSlice's initial `config: { ...DEFAULT_CONFIG }` and
 *     persistMerge's rehydrate merge `{ ...DEFAULT_CONFIG, ...persisted.config }`
 *     both build a fresh object rather than assign into the draft. The rehydrate
 *     merge admits whatever a persisted blob carries; that legacy-key seam is the
 *     one R-3 documented at updateConfig (legacy saves replay retired keys) and it
 *     is deliberately left to that lane, not silently claimed closed here.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { isAllowedConfigKey } from '../../src/store/configSlice.js';

const ROOT = process.cwd();

/** Identifiers used as the immer draft inside `set(...)` callbacks. */
const DRAFT_RECEIVERS = ['state', 's', 'draft', 'st'];

/**
 * THE EXACT SET. `role: 'door'` is updateConfig itself; every other row is a
 * reviewed exemption that bypasses the door on purpose. `key` is the config key
 * written (null for the whole-object reset).
 */
const EXPECTED_WRITERS = [
  {
    file: 'src/store/configSlice.js',
    action: 'updateConfig',
    key: null,
    role: 'door',
    why: 'THE validated door: writes only keys isAllowedConfigKey admits, drops the rest with a typed report.',
  },
  // ── THE EXEMPTIONS ARE GONE — all four, and none by weakening this scan ──────
  // EXEMPTION RETIRED (R-5b, owner queue #21): `setSettlementType`. Its exemption
  // was earned by the tier clamp in its body — and the op turned out to have no
  // caller anywhere, so that clamp had never run. Retiring the op shrinks this
  // exact-set by one, which is the direction this scan is meant to move: fewer
  // doors onto the config draft, not more. The tier gate itself is unaffected and
  // was proven to live at the generation commit (settlementSlice.generateSettlement
  // refuses an over-cap settType and re-gates the resolved tier) before the op was
  // removed — see the retirement note in configSlice.js.
  //
  // EXEMPTIONS RETIRED (R-5b, owner queue #21), the remaining three: `resetConfig`
  // (configSlice) and `setNeighbourRelType` + `handleImportDirect` (neighbourSlice).
  // All three were dead ops — no caller anywhere in src — so all three side doors
  // onto state.config were doors nobody walked through. With them gone, R-3's
  // "updateConfig is the one validated door" claim is no longer a claim WITH
  // EXEMPTIONS; it is simply true, and this file now enumerates a door and nothing
  // else. That is the terminal state this scan was built to drive toward, reached
  // by deleting bypasses rather than by blessing them.
  //
  // A new exemption is still ADMISSIBLE — add a row with the reason it cannot route
  // through updateConfig — but it now has to argue against a clean sheet.
];

function walkFiles(dir, exts, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkFiles(full, exts, acc);
    else if (exts.some(ext => name.endsWith(ext))) acc.push(full);
  }
  return acc;
}

export function stripComments(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') { out += src[i] === '\n' ? '\n' : ' '; i++; }
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) { out += src[i] === '\n' ? '\n' : ' '; i++; }
      out += '  ';
      i += 2;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      const q = c;
      out += c;
      i++;
      while (i < src.length) {
        if (src[i] === '\\') { out += '  '; i += 2; continue; }
        out += src[i];
        const done = src[i] === q;
        i++;
        if (done) break;
      }
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

export const WRITE_RE = new RegExp(
  `\\b(?:${DRAFT_RECEIVERS.join('|')})\\.config(\\.[A-Za-z_$][\\w$]*|\\[[^\\]]+\\])?\\s*=(?!=)`,
  'g',
);

/** The nearest enclosing `  <name>: (` slice-action declaration above `index`. */
export function enclosingAction(src, index) {
  const declRe = /^ {2}([A-Za-z_$][\w$]*):\s*(?:async\s*)?\(/gm;
  let m;
  let name = '(top level)';
  while ((m = declRe.exec(src)) && m.index < index) name = m[1];
  return name;
}

function scanDirectWriters() {
  const found = [];
  for (const file of walkFiles(resolve(ROOT, 'src'), ['.js', '.jsx'])) {
    const raw = readFileSync(file, 'utf-8');
    if (!raw.includes('.config')) continue;
    const src = stripComments(raw);
    const label = relative(ROOT, file).replace(/\\/g, '/');
    let m;
    WRITE_RE.lastIndex = 0;
    while ((m = WRITE_RE.exec(src))) {
      const suffix = m[1] || '';
      const key = suffix.startsWith('.') ? suffix.slice(1) : null;
      found.push({
        file: label,
        action: enclosingAction(src, m.index),
        key,
        computed: suffix.startsWith('['),
        line: src.slice(0, m.index).split('\n').length,
      });
    }
  }
  return found;
}

const signature = w => `${w.file}::${w.action}::${w.key ?? (w.computed ? '[computed]' : '(whole)')}`;

describe('R-4 — the config draft has ONE validated door plus enumerated exemptions', () => {
  it('self-check: the scan finds writers (not vacuous)', () => {
    const found = scanDirectWriters();
    // Floor 5 → 4 → 1 as the R-5b retirements removed all four exemptions. It
    // tracks the enumeration DOWNWARD, which is the direction the R-4 single-door
    // law wants, and 1 is the floor's terminal value: the door itself can never
    // leave. The scan's catching POWER is no longer carried by this number at all —
    // it is proven directly by the planted-fifth-writer negative control at the
    // bottom of this file, which is why shrinking to 1 costs no rigor.
    expect(found.length, JSON.stringify(found, null, 2)).toBeGreaterThanOrEqual(1);
  });

  it('the direct-writer set is EXACTLY the door plus its enumerated exemptions', () => {
    const found = scanDirectWriters();
    // The door writes a computed key (`state.config[key] = partial[key]`); the
    // enumeration records it once by action, not once per key form.
    const actual = [...new Set(found.map(w => `${w.file}::${w.action}`))].sort();
    const expected = [...new Set(EXPECTED_WRITERS.map(w => `${w.file}::${w.action}`))].sort();
    expect(
      actual,
      'A store action writes the config draft directly. If that is deliberate, add it to '
        + "EXPECTED_WRITERS here with the reason it cannot route through updateConfig; if it "
        + 'is not, route the write through updateConfig so isAllowedConfigKey vets the key. '
        + `Found:\n${found.map(w => `  ${signature(w)} (line ${w.line})`).join('\n')}`,
    ).toEqual(expected);
  });

  it('every enumerated writer is still present at the file and action claimed', () => {
    const found = scanDirectWriters().map(w => `${w.file}::${w.action}`);
    for (const w of EXPECTED_WRITERS) {
      expect(found, `${w.file}::${w.action} is enumerated but no longer writes the config draft`)
        .toContain(`${w.file}::${w.action}`);
    }
  });

  it('every exemption writes a key isAllowedConfigKey admits (the bypass is safe, not lucky)', () => {
    for (const w of EXPECTED_WRITERS) {
      if (w.role !== 'exemption' || !w.key) continue;
      expect(isAllowedConfigKey(w.key), `${w.action} writes ${w.key}, which updateConfig would refuse`)
        .toBe(true);
    }
  });

  it('every exemption carries a real reason', () => {
    for (const w of EXPECTED_WRITERS) {
      expect(w.why.length, `${w.action} needs a recorded reason`).toBeGreaterThan(40);
    }
  });

  it('no draft-named config assignment lives outside src/store', () => {
    const strays = scanDirectWriters().filter(w => !w.file.startsWith('src/store/'));
    expect(
      strays.map(signature),
      'immer draft callbacks live in src/store; a config draft write elsewhere means either '
        + 'a new store surface or a non-store object shadowing a draft receiver name.',
    ).toEqual([]);
  });

  // --- adversarial self-test: the scan's catching power, executed --------------

  it('negative control: the scanner sees a planted fifth writer and skips prose about one', () => {
    // Indented like a real slice: action declarations sit at two spaces, which is
    // what enclosingAction anchors on (see KNOWN EDGES).
    const planted = [
      'export const createRogueSlice = (set) => ({',
      '  setSomething: (v) =>',
      '    set(state => {',
      '      state.config.rogueKey = v;',
      '    }),',
      '  // state.config.commentedKey = v;  <- prose, not a writer',
      '  readOnly: (draft) => {',
      '    const x = draft.config.rogueKey;',
      '    return x;',
      '  },',
      '});',
    ].join('\n');
    const src = stripComments(planted);
    const hits = [];
    WRITE_RE.lastIndex = 0;
    let m;
    while ((m = WRITE_RE.exec(src))) hits.push({ suffix: m[1], action: enclosingAction(src, m.index) });
    expect(hits).toHaveLength(1);
    expect(hits[0].suffix).toBe('.rogueKey');
    expect(hits[0].action).toBe('setSomething');
    // ...and the planted key is exactly what the exemption assertion would catch:
    expect(isAllowedConfigKey('rogueKey')).toBe(false);
  });
});
