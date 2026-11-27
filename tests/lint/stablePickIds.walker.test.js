/**
 * stablePickIds.walker.test.js — THE ID GUARD of point 120 (D13 STABLE-PICKS): an id names ONE line, for good.
 *
 * Point 120 prints the admitted line with the highest hash of (the slot's key, the line's own id), so an id that moves
 * moves towns between lines. This walker holds every Daily Life pool line (`src/data/dailyLife/`) and every viability
 * row (`src/domain/display/dossierViewModel.js :: deriveViability`) to `tests/lint/stablePickIds.baseline.json`: the id
 * with the fingerprint of its words as banked, and the retired ids. The reader, the findings and the door's plan live in
 * `./stablePickIds.shared.mjs`, whose head says what the guard is FOR and what it DOES NOT CATCH. The one door is
 * `node scripts/stable-pick-ids-door.mjs` (`--write` to add, retire, or re-bank a re-wording; it never makes a baseline).
 *
 * The tree arms below read the real tree; the guard-the-guard arms plant each fault in memory, through the SAME
 * functions, and hold the verdicts to it.
 */
import { describe, expect, test, beforeAll } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  BASELINE_REL, DAILY_LIFE_EXPORTS, IMPORTED_POOLS, ROOT, VIABILITY_SCOPE, baselineProblems, dailyLifeTreeOf, doorPlan,
  findings, fingerprintOf, importedPoolsTreeOf, readBaseline, readTree, viabilityRowsIn, viabilityTreeOf,
} from './stablePickIds.shared.mjs';

/** @typedef {import('./stablePickIds.shared.mjs').Tree} Tree */
/** @typedef {import('./stablePickIds.shared.mjs').Baseline} Baseline */

/** @type {Tree} */ let tree;
/** @type {Baseline | null} */ let baseline;
beforeAll(async () => { tree = await readTree(ROOT); baseline = readBaseline(ROOT); });

/** @param {string} kind */
const ofKind = (kind) => (baseline ? findings(tree, baseline).filter((f) => f.kind === kind).map((f) => `${f.scope} ${f.id}: ${f.detail}`) : ['the baseline is absent']);

describe('the id guard of point 120: the tree against its baseline', () => {
  test('THE BASELINE EXISTS (it is never re-made: restore it from git)', () => {
    expect(existsSync(join(ROOT, BASELINE_REL)), `${BASELINE_REL} is absent: restore it from git; the door never makes one`).toBe(true);
    expect(baseline && baselineProblems(baseline)).toEqual([]);
  });

  test('THE READER reads both families, fail-closed (no unread row, no unmapped pool)', () => {
    expect(tree.problems).toEqual([]);
  });

  // TRUE FLOORS (RULING 120R-2, cure 1 (a)): a little over half the first baseline's counts (144 scopes; 615 + 22 ids), so a
  // reader that reads nothing or half reds, while honest retirements (any one scope: the largest holds 33 lines; several
  // lines) leave room: 80 scopes, 350 Daily Life ids, 12 viability rows. THE IMPORTED POOLS (RULING 121G-1 (4)): the
  // same rule over point 121's first banking (16 scopes, 182 ids; the largest, ELEMENT_GLOSS, holds 50): 9 scopes read,
  // 100 ids.
  test('guard-the-guard: the reader is not vacuous (true floors: 80 scopes, 350 Daily Life ids, 12 viability rows, 9 imported pools, 100 imported ids)', () => {
    expect(tree.scopes.size).toBeGreaterThanOrEqual(80);
    const daily = [...tree.scopes].filter(([s]) => s.includes('|')).reduce((n, [, l]) => n + l.length, 0);
    expect(daily).toBeGreaterThanOrEqual(350);
    expect(tree.scopes.get(VIABILITY_SCOPE)?.length ?? 0).toBeGreaterThanOrEqual(12);
    const imported = IMPORTED_POOLS.map((p) => tree.scopes.get(p.scope)?.length ?? 0);
    expect(imported.filter((n) => n > 0).length).toBeGreaterThanOrEqual(9);
    expect(imported.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(100);
  });

  test('NO SILENT REMOVAL: every banked present id is in the tree (a removed line is retired by the door)', () => {
    expect(ofKind('removed')).toEqual([]);
  });
  test('NO REUSE: no retired id is in the tree again', () => {
    expect(ofKind('reused')).toEqual([]);
  });
  test('NO DUPLICATE: no id is written twice in its scope', () => {
    expect(ofKind('duplicate')).toEqual([]);
  });
  test('NO MOVE: no banked fingerprint is found under a different present id (a shifted insertion, a swap)', () => {
    expect(ofKind('moved')).toEqual([]);
  });
  test('NOTHING UNBANKED: every id of the tree is in the baseline (the door adds a new one)', () => {
    expect(ofKind('unbanked')).toEqual([]);
  });
  test('NOTHING RE-WORDED UNBANKED: every present id holds the words banked for it (the door re-banks a re-wording)', () => {
    expect(ofKind('reworded')).toEqual([]);
  });
});

// ── GUARD-THE-GUARD: each fault planted in memory, through the same functions ─────────────────────────────────────────

const LINES = ['Alpha line.', 'Beta line.', 'Gamma line.', 'Delta line.'];
/** @param {Array<[string, string]>} rows @returns {Tree} */
const dailyTree = (rows) => dailyLifeTreeOf({ 'x.js': { GATHERING_PLAIN: rows.map(([id, text]) => ({ id, text, needs: [] })) } });
/** @param {Array<[string, string]>} rows @param {string[]} [retired] @returns {Baseline} */
const bankOf = (rows, retired = []) => ({ scopes: { 'gathering_places|plain': { present: Object.fromEntries(rows.map(([id, t]) => [id, fingerprintOf(t)])), retired } } });
/** @type {Array<[string, string]>} */ const BANKED = LINES.map((t, i) => [`P${i}`, t]);
/** @param {Tree} t @param {Baseline} b */
const kinds = (t, b) => findings(t, b).map((f) => `${f.kind} ${f.id}`).sort();

describe('guard-the-guard: the Daily Life faults', () => {
  test('the banked tree is green, and the door finds nothing to do', () => {
    expect(kinds(dailyTree(BANKED), bankOf(BANKED))).toEqual([]);
    const plan = doorPlan(dailyTree(BANKED), bankOf(BANKED));
    expect([plan.refusals, plan.added, plan.retired, plan.reworded]).toEqual([[], [], [], []]);
  });

  test('an insertion that shifts the later ids is a MOVE, red and refused (and with a trailing space too)', () => {
    for (const pad of ['', ' ']) {
      /** @type {Array<[string, string]>} */ const shifted = [['P0', LINES[0]], ['P1', 'A new line.'], ...LINES.slice(1).map((t, i) => /** @type {[string, string]} */ ([`P${i + 2}`, t + pad]))];
      expect(kinds(dailyTree(shifted), bankOf(BANKED))).toEqual(expect.arrayContaining(['moved P2', 'moved P3', 'moved P4']));
      expect(doorPlan(dailyTree(shifted), bankOf(BANKED)).refusals.length).toBeGreaterThan(0);
    }
  });

  test('a swap is a MOVE, red and refused (and with a trailing space, or another letter case, too)', () => {
    for (const dress of [(/** @type {string} */ t) => t, (/** @type {string} */ t) => `${t} `, (/** @type {string} */ t) => `  ${t.toUpperCase()}`]) {
      /** @type {Array<[string, string]>} */ const swapped = [['P0', LINES[0]], ['P1', dress(LINES[2])], ['P2', dress(LINES[1])], ['P3', LINES[3]]];
      expect(kinds(dailyTree(swapped), bankOf(BANKED))).toEqual(['moved P1', 'moved P2']);
      expect(doorPlan(dailyTree(swapped), bankOf(BANKED)).refusals).toHaveLength(2);
    }
  });

  test('a retired id reused is red and refused; a retired sentence under a NEW id is added', () => {
    const bank = bankOf(BANKED.filter(([id]) => id !== 'P2'), ['P2']);
    /** @type {Array<[string, string]>} */ const reuse = [...BANKED.filter(([id]) => id !== 'P2'), ['P2', 'Another line.']];
    expect(kinds(dailyTree(reuse), bank)).toEqual(['reused P2']);
    expect(doorPlan(dailyTree(reuse), bank).refusals).toHaveLength(1);
    /** @type {Array<[string, string]>} */ const back = [...BANKED.filter(([id]) => id !== 'P2'), ['P9', LINES[2]]];
    expect(kinds(dailyTree(back), bank)).toEqual(['unbanked P9']);
    const plan = doorPlan(dailyTree(back), bank);
    expect([plan.refusals, plan.added]).toEqual([[], ['gathering_places|plain P9']]);
    expect(plan.next?.scopes['gathering_places|plain'].retired).toEqual(['P2']);
  });

  test('a duplicate id is red and refused; a silent removal is red and the door retires it', () => {
    /** @type {Array<[string, string]>} */ const dup = [...BANKED, ['P1', 'Twice.']];
    expect(kinds(dailyTree(dup), bankOf(BANKED))).toContain('duplicate P1');
    expect(doorPlan(dailyTree(dup), bankOf(BANKED)).refusals.length).toBeGreaterThan(0);
    const gone = BANKED.filter(([id]) => id !== 'P3');
    expect(kinds(dailyTree(gone), bankOf(BANKED))).toEqual(['removed P3']);
    const plan = doorPlan(dailyTree(gone), bankOf(BANKED));
    expect([plan.refusals, plan.retired]).toEqual([[], ['gathering_places|plain P3']]);
    expect(plan.next?.scopes['gathering_places|plain']).toEqual({ ...bankOf(gone).scopes['gathering_places|plain'], retired: ['P3'] });
  });

  test('a re-wording in place is red until the door re-banks it; whitespace and letter case alone are no re-wording', () => {
    /** @type {Array<[string, string]>} */ const reworded = BANKED.map(([id, t]) => [id, id === 'P1' ? 'Beta line, re-worded.' : t]);
    expect(kinds(dailyTree(reworded), bankOf(BANKED))).toEqual(['reworded P1']);
    const plan = doorPlan(dailyTree(reworded), bankOf(BANKED));
    expect([plan.refusals, plan.reworded]).toEqual([[], ['gathering_places|plain P1']]);
    expect(kinds(dailyTree(reworded), /** @type {Baseline} */ (plan.next))).toEqual([]);
    /** @type {Array<[string, string]>} */ const spaced = BANKED.map(([id, t]) => [id, `  ${t.toUpperCase().replace(' ', '\n\t ')} `]);
    expect(kinds(dailyTree(spaced), bankOf(BANKED))).toEqual([]);
  });

  test('a line appended under a new id is added by the door, and green after', () => {
    /** @type {Array<[string, string]>} */ const appended = [...BANKED, ['P4', 'A fifth line.']];
    const plan = doorPlan(dailyTree(appended), bankOf(BANKED));
    expect([plan.refusals, plan.added]).toEqual([[], ['gathering_places|plain P4']]);
    expect(kinds(dailyTree(appended), /** @type {Baseline} */ (plan.next))).toEqual([]);
  });

  test('THE DOOR NEVER MAKES OR REFILLS A BASELINE: absent, emptied to a skeleton, or emptied whole: refused', () => {
    expect(doorPlan(dailyTree(BANKED), null).refusals[0]).toMatch(/restore it from git; the baseline is never re-made/);
    const skeleton = { scopes: { 'gathering_places|plain': { present: {}, retired: [] } } };
    expect(doorPlan(dailyTree(BANKED), skeleton).refusals.join('\n')).toMatch(/restore the baseline from git; it is never refilled/);
    // the emptied skeleton of ONE scope, beside a scope that still banks its ids: refused
    const two = dailyLifeTreeOf({ 'x.js': { GATHERING_PLAIN: [{ id: 'P0', text: 'A.' }], GATHERING_NAMED: [{ id: 'N0', text: 'B.' }] } });
    const oneEmptied = { scopes: { 'gathering_places|plain': { present: {}, retired: [] }, 'gathering_places|named': { present: { N0: fingerprintOf('B.') }, retired: [] } } };
    expect(doorPlan(two, oneEmptied).refusals.join('\n')).toMatch(/gathering_places\|plain: .*never refilled/);
    expect(doorPlan(dailyTree(BANKED), { scopes: {} }).refusals.join('\n')).toMatch(/it is never refilled/);
    expect(baselineProblems(bankOf(BANKED, ['P1']))).toEqual(['gathering_places|plain P1: banked present AND retired']);
  });

  test('A WHOLLY RETIRED SCOPE takes a line under a NEW id (added, green); its retired id coming back is red and refused', () => {
    const named = { 'gathering_places|named': { present: { N0: fingerprintOf('B.') }, retired: [] } };
    const retiredWhole = { scopes: { 'gathering_places|plain': { present: {}, retired: ['K1'] }, ...named } };
    const fresh = dailyLifeTreeOf({ 'x.js': { GATHERING_PLAIN: [{ id: 'ZZ9', text: 'A new line.' }], GATHERING_NAMED: [{ id: 'N0', text: 'B.' }] } });
    const plan = doorPlan(fresh, retiredWhole);
    expect([plan.refusals, plan.added]).toEqual([[], ['gathering_places|plain ZZ9']]);
    expect(findings(fresh, /** @type {Baseline} */ (plan.next))).toEqual([]);
    expect(plan.next?.scopes['gathering_places|plain'].retired).toEqual(['K1']);
    const back = dailyLifeTreeOf({ 'x.js': { GATHERING_PLAIN: [{ id: 'K1', text: 'A new line.' }], GATHERING_NAMED: [{ id: 'N0', text: 'B.' }] } });
    expect(kinds(back, retiredWhole)).toEqual(['reused K1']);
    expect(doorPlan(back, retiredWhole).refusals).toHaveLength(1);
  });

  test('THE DAILY LIFE READER is fail-closed: an id-bearing export it does not name, a line without text', () => {
    expect(dailyLifeTreeOf({ 'y.js': { NEW_POOL: [{ id: 'Q1', text: 'x' }] } }).problems.join('\n')).toMatch(/does not name/);
    expect(dailyLifeTreeOf({ 'y.js': { DAWN_WORK: { food: [{ id: 'F1' }] } } }).problems.join('\n')).toMatch(/without a string id and text/);
    expect(dailyLifeTreeOf({ 'y.js': { DAWN_WORK_DOES: { food: { consequence: true } } } }).problems).toEqual([]);
    const t = dailyLifeTreeOf({ 'y.js': { DAWN_WORK: { food: [{ id: 'F1', text: 'a' }], craft: [{ id: 'F1', text: 'b' }] } } });
    expect([...t.scopes.keys()]).toEqual(['dawn_work|food', 'dawn_work|craft']);
    // read as the WHOLE directory: an emptied pool file, and a named slot read no time, are red
    const whole = dailyLifeTreeOf({ 'y.js': { DAWN_WORK: { food: [{ id: 'F1', text: 'a' }] } }, 'z.js': {} }, { whole: true }).problems.join('\n');
    expect(whole).toMatch(/z\.js: a pool file that holds no line/);
    expect(whole).toMatch(/GATHERING_PLAIN: read 0 times/);
    expect(whole.match(/: read 0 times/g)).toHaveLength(Object.keys(DAILY_LIFE_EXPORTS).length - 1); // DAWN_WORK, read once, is not among them
  });
});

// ── GUARD-THE-GUARD: the viability reader, over a FIXTURE source (never the live words: RULING 120R-2, cure 1 (b)) ──────

/** A small `deriveViability` in the live function's shapes: pairs over pools, a nested template, a regex, a comment. */
const FIXTURE = [
  "import { pickRendezvous } from '../../kernel/proseHash.js';",
  '/** A helper before the function: `[\'XX1\', \'not read\']` in a comment. */',
  'const helper = (x) => x;',
  'export function deriveViability(settlement) {',
  "  const town = settlement?.name || 'The settlement'; const goods = helper('grain');",
  '  const many = / and /.test(goods) || /s$/.test(goods);',
  '  const pick = (pool) => pickRendezvous(pool, town, (r) => r[0])?.[1];',
  '  if (settlement?.lean) {',
  '    return pick([',
  "      ['AA1', `${town} cannot last.`],",
  "      ['AA2', `${town} will not survive ${many ? `the ${'year'}` : 'long'}.`],",
  '    ]);',
  '  }',
  '  return pick([',
  "    ['SS1', `${town} feeds itself.`],",
  "    ['SS2', `${town} owes no one.`], // a comment beside a row",
  '  ]);',
  '}',
  "export const after = [['ZZ1', 'outside the function']];",
  '',
].join('\n');
const ROW = "    ['SS1', `${town} feeds itself.`],\n";
/** @param {string} add @param {string} [needle] @returns {string} the fixture with `add` written after `needle` */
const plant = (add, needle = ROW) => {
  expect(FIXTURE.includes(needle), "the plant's anchor is in the fixture").toBe(true);
  return FIXTURE.replace(needle, `${needle}${add}`);
};
/** @param {string} src @returns {Baseline} the fixture's rows banked */
const bankSrc = (src) => ({ scopes: { [VIABILITY_SCOPE]: { present: Object.fromEntries((viabilityTreeOf(src).scopes.get(VIABILITY_SCOPE) ?? []).map((l) => [l.id, l.fp])), retired: [] } } });

describe('guard-the-guard: the viability reader (fail-closed)', () => {
  test('the fixture: its four rows read, as many id keys as rows; nothing outside the function is read', () => {
    const r = viabilityRowsIn(FIXTURE);
    expect(r.problems).toEqual([]);
    expect(r.rows.map((x) => x.id)).toEqual(['AA1', 'AA2', 'SS1', 'SS2']);
    expect(r.idKeys).toBe(4);
  });

  test('a second SS1 over three source lines, in double quotes, in backticks: each red (twice in its scope) and refused', () => {
    const forms = [
      "    [\n      'SS1',\n      `${town} keeps itself.`,\n    ],\n",
      '    ["SS1", `${town} keeps itself.`],\n',
      '    [`SS1`, `${town} keeps itself.`],\n',
    ];
    for (const add of forms) {
      const t = viabilityTreeOf(plant(add));
      expect(t.problems, add).toEqual([]);
      expect(t.scopes.get(VIABILITY_SCOPE)?.filter((l) => l.id === 'SS1'), add).toHaveLength(2);
      expect(findings(t, bankSrc(FIXTURE)).map((f) => `${f.kind} ${f.id}`), add).toContain('duplicate SS1');
      expect(doorPlan(t, bankSrc(FIXTURE)).refusals.length, add).toBeGreaterThan(0);
    }
  });

  test('A ROW WHOSE ID IS NOT OF THE ID\'S FORM is red and refused (every pair of a plain string and a sentence is a row)', () => {
    for (const add of ["    ['SELFS1', `${town} keeps itself.`],\n", "    ['SS1b', `${town} keeps itself.`],\n", "    ['SS_6', 'plain words'],\n"]) {
      const t = viabilityTreeOf(plant(add));
      expect(t.problems.join('\n'), add).toMatch(/a row whose id is not of the id's form/);
      expect(doorPlan(t, bankSrc(FIXTURE)).refusals.join('\n'), add).toMatch(/the reader cannot read the tree/);
    }
  });

  test('a row form the reader does not recognise, or an id key outside a row, is red', () => {
    expect(viabilityRowsIn(plant("    ['SS9', said],\n")).problems.join('\n')).toMatch(/id keys against/);
    expect(viabilityRowsIn(plant("    { id: 'SS9', text: `x` },\n")).problems.join('\n')).toMatch(/outside a row/);
    expect(viabilityRowsIn(plant("    ['SS9', `a ${'SS8'} b`],\n")).problems.join('\n')).toMatch(/id keys against/);
    expect(viabilityRowsIn(FIXTURE.replace('function deriveViability(', 'function deriveViabilityGone(')).problems.join('\n')).toMatch(/written 0 times/);
    expect(viabilityRowsIn(FIXTURE.slice(0, FIXTURE.indexOf('if (settlement?.lean)'))).problems.join('\n')).toMatch(/cannot read it/);
  });

  test('a comment naming an id is not read (green); a nested template in a sentence is read (green)', () => {
    for (const add of ["    // 'SS4' and \"SS2\" were re-worded here\n", "    /* ['SS4', `x`], */\n"]) {
      const r = viabilityRowsIn(plant(add));
      expect(r.problems, add).toEqual([]);
      expect(r.rows).toHaveLength(4);
    }
    const r = viabilityRowsIn(plant("    ['SS6', `${town} ${settlement.buysIn ? `buys ${'some'} in` : 'keeps'} itself.`],\n"));
    expect(r.problems).toEqual([]);
    expect(r.rows.map((x) => x.id)).toEqual(['AA1', 'AA2', 'SS1', 'SS6', 'SS2']);
  });

  test('the fingerprint reads the sentence source as written, whitespace and letter case aside', () => {
    const fp = (/** @type {string} */ src) => viabilityTreeOf(src).scopes.get(VIABILITY_SCOPE)?.find((l) => l.id === 'SS1')?.fp;
    expect(fp(FIXTURE)).toBe(fingerprintOf('${town} feeds itself.'));
    expect(fp(FIXTURE.replace(ROW, "    ['SS1', `${town}   FEEDS itself. `],\n"))).toBe(fp(FIXTURE));
    expect(fp(FIXTURE.replace(ROW, "    ['SS1', `${town} feeds itself well.`],\n"))).toBe(fingerprintOf('${town} feeds itself well.'));
  });
});

// ── GUARD-THE-GUARD: the imported pools (point 121), over FIXTURE modules and a fixture table ───────────────────────────

/** @typedef {import('./stablePickIds.shared.mjs').ImportedPool} ImportedPool */
/** @type {ReadonlyArray<ImportedPool>} */
const TABLE = [
  { module: 'm/flat.js', export: 'FLAT', scope: 'x.flat', layout: 'flat', words: 'text' },
  { module: 'm/flat.js', export: 'BY_ROLE', scope: 'x.byRole', layout: 'record', words: 'text' },
  { module: 'm/say.js', export: 'FRAMES', scope: 'x.frames', layout: 'flat', words: 'say' },
];
const FRAME_A = (/** @type {string} */ l) => `${l}, plainly`;
const FRAME_B = (/** @type {string} */ l) => `${l}: as you are told`;
/** @param {{ flat?: unknown, byRole?: unknown, frames?: unknown }} [over] @returns {Record<string, import('./stablePickIds.shared.mjs').PoolModule>} */
const mods = (over = {}) => ({
  'm/flat.js': { exports: {
    FLAT: 'flat' in over ? over.flat : [{ id: 'F.1', text: 'One.' }, { id: 'F.2', text: 'Two.' }, { id: 'F.3', text: 'Three.' }],
    BY_ROLE: 'byRole' in over ? over.byRole : { a: [{ id: 'a.1', text: 'Want one.' }], b: [{ id: 'b.1', text: 'Want two.' }] },
  } },
  'm/say.js': { exports: { FRAMES: 'frames' in over ? over.frames : [{ id: 'plain', say: FRAME_A }, { id: 'told', say: FRAME_B }] } },
});
/** @param {Record<string, import('./stablePickIds.shared.mjs').PoolModule>} m */
const poolTree = (m) => importedPoolsTreeOf(m, TABLE);
const BANK = /** @type {Baseline} */ ({ scopes: Object.fromEntries([...poolTree(mods()).scopes].map(([s, l]) => [s, { present: Object.fromEntries(l.map((x) => [x.id, x.fp])), retired: [] }])) });

describe('guard-the-guard: the imported pools (point 121)', () => {
  test('the fixture is read whole: three scopes, the record\'s arrays into one scope, a `say` by its source', () => {
    const t = poolTree(mods());
    expect(t.problems).toEqual([]);
    expect([...t.scopes].map(([s, l]) => `${s}:${l.map((x) => x.id).join(',')}`)).toEqual(['x.flat:F.1,F.2,F.3', 'x.byRole:a.1,b.1', 'x.frames:plain,told']);
    expect(t.scopes.get('x.frames')?.[0].fp).toBe(fingerprintOf(String(FRAME_A)));
    expect(kinds(t, BANK)).toEqual([]);
  });

  test('FAIL-CLOSED: a module that will not import, a missing export, a wrong layout, an empty pool, a row without an id or words, an export named twice', () => {
    const p = (/** @type {Record<string, import('./stablePickIds.shared.mjs').PoolModule>} */ m, t = TABLE) => importedPoolsTreeOf(m, t).problems.join('\n');
    expect(p({ ...mods(), 'm/say.js': { error: 'boom' } })).toMatch(/m\/say\.js: will not import \(boom\)/);
    expect(p({ 'm/flat.js': mods()['m/flat.js'], 'm/say.js': { exports: {} } })).toMatch(/FRAMES: no such export/);
    expect(p(mods({ flat: { a: [] } }))).toMatch(/FLAT: not a flat array/);
    expect(p(mods({ byRole: [{ id: 'a.1', text: 'x' }] }))).toMatch(/BY_ROLE: not a record of arrays/);
    expect(p(mods({ flat: [] }))).toMatch(/FLAT: no row read/);
    expect(p(mods({ flat: [{ text: 'no id' }] }))).toMatch(/FLAT\[0\]: a row without a string id/);
    expect(p(mods({ frames: [{ id: 'plain', text: 'not a function' }] }))).toMatch(/FRAMES\[0\]: a row without a string id and its `say` function/);
    expect(p(mods(), [...TABLE, TABLE[0]])).toMatch(/FLAT: named twice/);
  });

  test('a shifted insertion and a swap are MOVES, red and refused; a duplicate is red; a retired id reused is red and refused', () => {
    const shifted = poolTree(mods({ flat: [{ id: 'F.1', text: 'One.' }, { id: 'F.2', text: 'New.' }, { id: 'F.3', text: 'Two.' }, { id: 'F.4', text: 'Three.' }] }));
    expect(kinds(shifted, BANK)).toEqual(['moved F.3', 'moved F.4', 'reworded F.2']);
    expect(doorPlan(shifted, BANK).refusals.length).toBeGreaterThan(0);
    const swapped = poolTree(mods({ frames: [{ id: 'told', say: FRAME_A }, { id: 'plain', say: FRAME_B }] }));
    expect(kinds(swapped, BANK)).toEqual(['moved plain', 'moved told']);
    expect(doorPlan(swapped, BANK).refusals).toHaveLength(2);
    expect(kinds(poolTree(mods({ byRole: { a: [{ id: 'a.1', text: 'Want one.' }], b: [{ id: 'a.1', text: 'Want two.' }] } })), BANK)).toContain('duplicate a.1');
    const retired = { scopes: { ...BANK.scopes, 'x.flat': { present: { 'F.1': fingerprintOf('One.'), 'F.2': fingerprintOf('Two.') }, retired: ['F.3'] } } };
    const reuse = poolTree(mods({ flat: [{ id: 'F.1', text: 'One.' }, { id: 'F.2', text: 'Two.' }, { id: 'F.3', text: 'Another.' }] }));
    expect(kinds(reuse, retired)).toEqual(['reused F.3']);
    expect(doorPlan(reuse, retired).refusals).toHaveLength(1);
  });

  test('a `say` frame re-worded in place is red until the door re-banks it; a new pool scope is added by the door', () => {
    const reworded = poolTree(mods({ frames: [{ id: 'plain', say: (/** @type {string} */ l) => `${l}, said plainly` }, { id: 'told', say: FRAME_B }] }));
    expect(kinds(reworded, BANK)).toEqual(['reworded plain']);
    const plan = doorPlan(reworded, BANK);
    expect([plan.refusals, plan.reworded]).toEqual([[], ['x.frames plain']]);
    expect(findings(reworded, /** @type {Baseline} */ (plan.next))).toEqual([]);
    const onlyTwo = { scopes: { 'x.flat': BANK.scopes['x.flat'], 'x.byRole': BANK.scopes['x.byRole'] } };
    const added = doorPlan(poolTree(mods()), onlyTwo);
    expect([added.refusals, added.added]).toEqual([[], ['x.frames plain', 'x.frames told']]);
  });
});
