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
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  BASELINE_REL, ROOT, VIABILITY_FILE_REL, VIABILITY_SCOPE, baselineProblems, dailyLifeTreeOf, doorPlan, findings,
  fingerprintOf, readBaseline, readTree, viabilityRowsIn, viabilityTreeOf,
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

  test('guard-the-guard: the reader is not vacuous (floors from the first baseline: 144 scopes, 615 + 22 ids)', () => {
    expect(tree.scopes.size).toBeGreaterThanOrEqual(144);
    const daily = [...tree.scopes].filter(([s]) => s !== VIABILITY_SCOPE).reduce((n, [, l]) => n + l.length, 0);
    expect(daily).toBeGreaterThanOrEqual(615);
    expect(tree.scopes.get(VIABILITY_SCOPE)?.length ?? 0).toBeGreaterThanOrEqual(22);
    expect(tree.scopes.get('gathering_places|plain')?.map((l) => l.id)).toEqual(expect.arrayContaining(['P0', 'P1', 'P2']));
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
    expect(doorPlan(dailyTree(BANKED), { scopes: {} }).refusals.join('\n')).toMatch(/it is never refilled/);
    expect(baselineProblems(bankOf(BANKED, ['P1']))).toEqual(['gathering_places|plain P1: banked present AND retired']);
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
    expect(whole).not.toMatch(/DAWN_WORK: read/);
  });
});

// ── GUARD-THE-GUARD: the viability reader, over planted source text ───────────────────────────────────────────────────

const SOURCE = readFileSync(join(ROOT, VIABILITY_FILE_REL), 'utf8');
const SS1 = "    ['SS1', `${town} feeds itself and pays its own way.`],\n";
/** @param {string} needle @param {string} add @returns {string} the source with `add` written after `needle` */
const plant = (needle, add) => {
  expect(SOURCE.includes(needle), `the plant's anchor is in ${VIABILITY_FILE_REL}`).toBe(true);
  return SOURCE.replace(needle, `${needle}${add}`);
};

describe('guard-the-guard: the viability reader (fail-closed)', () => {
  test('the real function: every row read, as many id keys as rows', () => {
    const r = viabilityRowsIn(SOURCE);
    expect(r.problems).toEqual([]);
    expect(r.idKeys).toBe(r.rows.length);
    expect(r.rows.map((x) => x.id)).toContain('SS1');
  });

  test('a second SS1 over three source lines, in double quotes, in backticks: each red (twice in its scope)', () => {
    const forms = [
      "    [\n      'SS1',\n      `${town} keeps itself.`,\n    ],\n",
      '    ["SS1", `${town} keeps itself.`],\n',
      '    [`SS1`, `${town} keeps itself.`],\n',
    ];
    for (const add of forms) {
      const t = viabilityTreeOf(plant(SS1, add));
      expect(t.problems, add).toEqual([]);
      const ids = t.scopes.get(VIABILITY_SCOPE)?.map((l) => l.id) ?? [];
      expect(ids.filter((id) => id === 'SS1'), add).toHaveLength(2);
      const bank = { scopes: { [VIABILITY_SCOPE]: { present: Object.fromEntries((viabilityTreeOf(SOURCE).scopes.get(VIABILITY_SCOPE) ?? []).map((l) => [l.id, l.fp])), retired: [] } } };
      expect(findings(t, bank).map((f) => `${f.kind} ${f.id}`), add).toContain('duplicate SS1');
    }
  });

  test('a row form the reader does not recognise, or an id key outside a row, is red', () => {
    expect(viabilityRowsIn(plant(SS1, "    ['SS9', said],\n")).problems.join('\n')).toMatch(/id keys against/);
    expect(viabilityRowsIn(plant(SS1, "    { id: 'SS9', text: `x` },\n")).problems.join('\n')).toMatch(/outside a row/);
    expect(viabilityRowsIn(plant(SS1, "    ['SS9', `a ${'SS8'} b`],\n")).problems.join('\n')).toMatch(/id keys against/);
    expect(viabilityRowsIn(SOURCE.replace(/function deriveViability\(/, 'function deriveViabilityGone(')).problems.join('\n')).toMatch(/written 0 times/);
    const cut = SOURCE.slice(0, SOURCE.indexOf('function deriveViability(') + 400);
    expect(viabilityRowsIn(cut).problems.join('\n')).toMatch(/cannot read it/);
  });

  test('a comment naming an id is not read (green); a nested template in a sentence is read (green)', () => {
    for (const add of ["    // 'SS4' and \"SS2\" were re-worded here\n", "    /* ['SS4', `x`], */\n"]) {
      const r = viabilityRowsIn(plant(SS1, add));
      expect(r.problems, add).toEqual([]);
      expect(r.rows.length).toBe(viabilityRowsIn(SOURCE).rows.length);
    }
    const r = viabilityRowsIn(plant(SS1, "    ['SS6', `${town} ${seen.buysIn ? `buys ${'some'} in` : 'keeps'} itself.`],\n"));
    expect(r.problems).toEqual([]);
    expect(r.rows.map((x) => x.id)).toContain('SS6');
  });

  test('the fingerprint reads the sentence source as written, whitespace and letter case aside', () => {
    const a = viabilityTreeOf(SOURCE).scopes.get(VIABILITY_SCOPE)?.find((l) => l.id === 'SS1');
    expect(a?.fp).toBe(fingerprintOf('${town} feeds itself and pays its own way.'));
    const b = viabilityTreeOf(SOURCE.replace(SS1, "    ['SS1', `${town}   FEEDS itself and pays its own way. `],\n")).scopes.get(VIABILITY_SCOPE)?.find((l) => l.id === 'SS1');
    expect(b?.fp).toBe(a?.fp);
  });
});
