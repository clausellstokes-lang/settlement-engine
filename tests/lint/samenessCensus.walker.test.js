/**
 * samenessCensus.walker.test.js — THE SAMENESS DOOR (SAME-1 brief 2, 2026-11-20;
 * `docs/chair/2026-11-20/content/same/SAME-1-DOOR-BRIEF.md`).
 *
 * The door (`node scripts/sameness-census.mjs --check`) renders every sentence the owner's page prints over a fixed corpus
 * (hxd, 150 places a size, six sizes), keys each by WHERE the page prints it (surface | printed position) and
 * judges it against `scripts/census/sameness-census.register.json`. TWO LAWS: a printed slot with no row reds; a ceiling
 * only tightens. The render takes minutes, so it is NOT run here: this file holds the judge's planted reds, run on
 * synthetic rows in memory, and the register's shape. It renders nothing.
 *
 * WHAT IT CATCHES: a judge that lets an unregistered slot through; a rise beyond the noise on both readings that does not
 * red; a rise on one reading that reds (it must be a note with both readings); a --write that would raise a ceiling (it
 * must refuse and write nothing); a --tighten that raises a ceiling or fails to lower a loose one; a label-prefixed line
 * ("Constraint: <stored sentence>") that files as composed instead of under its stored path; a pool whose wordings,
 * held by sibling stored paths, split into several slots (each "100%" of the places that drew it), or two mirrored paths
 * that flip the slot's identity between places; a register off its shape (law, corpus, classes, ceilings at or
 * above their meets, reasons cited by line instead of by symbol).
 * WHAT IT DOES NOT: render the page (the door's own `--check` does); judge the live register against a live reading.
 *
 * @enforced-by tests/lint/samenessCensus.walker.test.js
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import {
  CORPUS, LAW1_MEASURE, MIN_PLACES, NOISE_SE, REGISTER_PATH, SIZES, attributionOf, ceil2, confirmRises, emptyRegister,
  incompleteRender, judge, law1RedPlaces, law1WatchPlaces, measureSlots, readRegister, shareError, slotKey, storedHeads, tighten, writeRows,
} from '../../scripts/sameness-census.mjs';

const S = 'web:Summary/Overview';
const POS = 'OverviewTab > Section';
/** n synthetic places, each printing `line(i)` at one position; `stored(i)` is its stored index. */
function places(n, line, stored = () => ({})) {
  return Array.from({ length: n }, (_, i) => ({ seed: `p-${i}`, surfaces: { [S]: [[line(i), '', '', POS]] }, stored: stored(i) }));
}
const sentenceA = 'The river mill has turned since the founding of the town.';
/** A reading where `same` of `n` places print sentenceA and the rest a sentence of their own (one a place: TOP share). */
const reading = (n, same) => ({ thorp: measureSlots(places(n, (i) => (i < same ? sentenceA : `Place number ${'x'.repeat(i + 1)} prints its very own line here.`))) });
const SLOT = slotKey(S, ['', '', '', POS]);
/** A register holding SLOT at thorp with a ceiling. */
const registerAt = (ceiling, places = 50) => ({ ...emptyRegister(), rows: { [SLOT]: { class: 'STATE', reason: 'a planted row', sentence: sentenceA, paths: {}, sizes: { thorp: { places, of: places, distinct: 2, shareAll: ceiling, shareIn: ceiling, seen: 0, by: 'top', meet: ceiling, ceiling } } } } });

describe('law 1, tied to the bar (the chair, 18:52 UTC): an unregistered slot reds by its TOP sentence\'s places', () => {
  test('an unregistered slot whose top sentence prints at 15 of 150 places REDS', () => {
    const f = judge(reading(150, 15), emptyRegister());
    expect(f.unregistered.map((x) => x.slot)).toEqual([SLOT]);
    expect(f.watch).toEqual([]);
  });
  test('at 14 of 150 it is WATCH, not red', () => {
    const f = judge(reading(150, 14), emptyRegister());
    expect(f.unregistered).toEqual([]);
    expect(f.watch.map((x) => x.slot)).toEqual([SLOT]);
  });
  test('at 7 of 150 it is neither red nor watch (a note)', () => {
    const f = judge(reading(150, 7), emptyRegister());
    expect(f.unregistered).toEqual([]);
    expect(f.watch).toEqual([]);
    expect(f.rare.map((x) => x.slot)).toEqual([SLOT]);
  });
  test('a slot printed in 150 of 150 places with 150 distinct sentences is neither (the top sentence, not the slot, is counted)', () => {
    const r = reading(150, 0);
    expect([...r.thorp.values()][0]).toMatchObject({ places: 150, distinct: 150 });
    const f = judge(r, emptyRegister());
    expect(f.unregistered).toEqual([]);
    expect(f.watch).toEqual([]);
    expect(f.rare.map((x) => x.slot)).toEqual([SLOT]);
  });
  test('the two lines are the ruling\'s: 15 and 8 of 150, cited', () => {
    expect([law1RedPlaces(150), law1WatchPlaces(150)]).toEqual([15, 8]);
    expect(LAW1_MEASURE).toMatch(/18:52 UTC/);
  });
  test('--write still registers a slot printed in MIN_PLACES places, though law 1 no longer reds it', () => {
    const at = (/** @type {number} */ k) => ({ thorp: measureSlots(places(150, (i) => (i < k ? sentenceA : ''))) });
    expect(judge(at(MIN_PLACES), emptyRegister()).unregistered).toEqual([]);
    const classify = () => ({ cls: 'STATE', reason: 'planted' });
    expect(Object.keys(writeRows(at(MIN_PLACES), at(MIN_PLACES), emptyRegister(), { classify }).next.rows)).toEqual([SLOT]);
    expect(writeRows(at(MIN_PLACES - 1), at(MIN_PLACES - 1), emptyRegister(), { classify }).next.rows).toEqual({});
  });
  test('a row whose slot is no longer printed is a stale note, never dropped silently', () => {
    const f = judge({ thorp: new Map() }, registerAt(0.4));
    expect(f.stale.map((x) => x.slot)).toEqual([SLOT]);
    expect(f.unregistered).toEqual([]);
  });
});

describe('law 2: a rise reds only beyond the noise and only on both readings', () => {
  const reg = registerAt(0.4);
  const over = reading(50, 40); // shareAll 0.8 against 0.4: (0.8 - 0.4) / sqrt(0.24 / 50) = 5.8 SE
  const calm = reading(50, 21); // shareAll 0.42: inside the noise
  test('the planted rise is beyond NOISE_SE on one reading and inside it on the other', () => {
    expect((0.8 - 0.4) / shareError(0.4, 50)).toBeGreaterThan(NOISE_SE);
    expect(judge(over, reg).over).toHaveLength(1);
    expect(judge(calm, reg).over).toHaveLength(0);
  });
  test('over on BOTH readings: red, carrying both', () => {
    const c = confirmRises(judge(over, reg), judge(over, reg));
    expect(c.over).toHaveLength(1);
    expect(c.over[0].text).toContain(CORPUS.confirm);
  });
  test('over on ONE reading only: a note with both readings, not a red', () => {
    const c = confirmRises(judge(over, reg), judge(calm, reg));
    expect(c.over).toEqual([]);
    expect(c.notes.join('\n')).toContain('does not repeat');
  });
});

describe('an incomplete render gives no verdict (SAME-2, fault F)', () => {
  const full = () => Object.fromEntries(SIZES.map((s) => [s, 150]));
  test('a complete render passes', () => {
    expect(incompleteRender(full(), 150, SIZES, [0, 0, 0, 0])).toEqual([]);
  });
  test('a size short by one row is the fault, named', () => {
    const faults = incompleteRender({ ...full(), metropolis: 149 }, 150, SIZES);
    expect(faults).toHaveLength(1);
    expect(faults[0]).toContain('metropolis');
  });
  test('a size with no rows at all, or a fork that exited non-zero, is the fault', () => {
    const { thorp, ...rest } = full();
    expect(thorp).toBe(150);
    expect(incompleteRender(rest, 150, SIZES)).toHaveLength(1);
    expect(incompleteRender(full(), 150, SIZES, [0, 1, 0, 0])[0]).toContain('fork 1');
  });
});

describe('the doors that write', () => {
  test('--write adds the unregistered slot at the HIGHER of the two readings, rounded up to 0.01', () => {
    const r = writeRows(reading(50, 20), reading(50, 23), emptyRegister(), { classify: () => ({ cls: 'STATE', reason: 'planted' }) });
    expect(r.refused).toEqual([]);
    expect(r.next.rows[SLOT].sizes.thorp).toMatchObject({ by: 'top', ceiling: ceil2(23 / 50) });
    expect(r.changed).toHaveLength(1);
  });
  test('--write that would raise a ceiling is REFUSED and writes nothing', () => {
    const reg = registerAt(0.4);
    const r = writeRows(reading(50, 40), reading(50, 41), reg);
    expect(r.refused.length).toBeGreaterThan(0);
    expect(r.next).toBe(reg);
    expect(r.changed).toEqual([]);
  });
  test('--write retires a row printed on neither reading by name, with its last reading', () => {
    const r = writeRows({ thorp: new Map() }, { thorp: new Map() }, registerAt(0.4));
    expect(r.next.rows[SLOT]).toBeUndefined();
    expect(r.next.retired[`${SLOT} @ thorp`].last.ceiling).toBe(0.4);
  });
  test('--tighten lowers a ceiling loose on both readings to the higher reading, and never raises one', () => {
    const loose = registerAt(0.9);
    const t = tighten(reading(50, 20), reading(50, 22), loose);
    expect(t.next.rows[SLOT].sizes.thorp.ceiling).toBe(ceil2(22 / 50));
    expect(t.changed).toHaveLength(1);
    const tight = registerAt(0.3);
    const u = tighten(reading(50, 40), reading(50, 40), tight);
    expect(u.next.rows[SLOT].sizes.thorp.ceiling).toBe(0.3);
    expect(u.changed).toEqual([]);
    const oneSide = tighten(reading(50, 20), reading(50, 44), loose);
    expect(oneSide.next.rows[SLOT].sizes.thorp.ceiling).toBe(0.9);
  });
});

describe('the slot identity', () => {
  test('a label-prefixed line attributes to the stored path of the stored sentence it contains', () => {
    const stored = { 'With nothing to hold the gate, the watch sleeps by the fire.': ['npcs[].activeConstraint'] };
    const printed = 'Constraint: With nothing to hold the gate, the watch sleeps by the fire.';
    expect(attributionOf(printed, stored, storedHeads(stored))).toEqual(['npcs[].activeConstraint']);
    const m = measureSlots(places(6, () => printed, () => stored));
    expect([...m.keys()]).toEqual([SLOT]);
    expect([...m.values()][0]).toMatchObject({ sentence: printed, paths: { 'npcs[].activeConstraint': 6 } });
  });
  test('three wordings of one pool, held by three stored paths and spread across places, are ONE slot holding every place', () => {
    const lines = ['The town keeps no wards against what walks at night.', 'No charter binds a company of arms to this town.', 'A paid garrison holds the gate and walks the wall.'];
    const paths = ['publicProse.blocks.defense:forces.arcane.sentence', 'publicProse.blocks.defense:forces.charter.sentence', 'publicProse.blocks.defense:forces.force.sentence'];
    const rows = [...places(6, () => lines[0], () => ({ [lines[0]]: [paths[0]] })), ...places(3, () => lines[1], () => ({ [lines[1]]: [paths[1]] })),
      ...places(1, () => lines[2], () => ({ [lines[2]]: [paths[2]] })), ...places(10, () => '')];
    const m = measureSlots(rows);
    expect([...m.keys()]).toEqual([SLOT]);
    const r = /** @type {any} */ ([...m.values()][0]);
    expect(r).toMatchObject({ places: 10, of: 20, distinct: 3, shareIn: 0.6, shareAll: 0.3 });
    expect(Object.keys(r.paths).sort()).toEqual([...paths].sort());
  });
  test('two mirrored paths at one position never flip the slot: a sentence co-held or held alone is the same slot', () => {
    const agree = 'Crime is rising faster than those in charge can answer it.';
    const rows = places(10, (i) => (i < 5 ? agree : `The quarrel number ${'y'.repeat(i)} goes on at the mill.`), (i) => (i < 5
      ? { [agree]: ['pressureSentence', 'powerStructure.recentConflict'] }
      : { [`The quarrel number ${'y'.repeat(i)} goes on at the mill.`]: ['powerStructure.recentConflict'] }));
    expect([...measureSlots(rows).keys()]).toEqual([SLOT]);
  });
});

describe('the register', () => {
  const register = readRegister();
  test('its law, its corpus and its identity rule', () => {
    expect(REGISTER_PATH).toMatch(/scripts\/census\/sameness-census\.register\.json$/);
    expect(register._law).toMatch(/A CEILING ONLY TIGHTENS/);
    expect(register._law).toMatch(/TIED TO THE BAR/);
    expect(register.corpus).toEqual({ ...CORPUS, sizes: [...CORPUS.sizes] });
    expect(typeof register.identity._rule).toBe('string');
    expect(Object.keys(register.rows).length).toBeGreaterThan(100);
  });
  test('every row: a class, a reason cited by symbol, and entries whose ceiling bounds its meet', () => {
    const bad = [];
    for (const [slot, row] of Object.entries(register.rows)) {
      if (slot.split(' | ').length !== 2) bad.push(`${slot}: not <surface> | <position>`);
      if (!/^(CATALOGUE|LABEL|STATE|NARRATIVE)\??$/.test(row.class)) bad.push(`${slot}: class ${row.class}`);
      if (!row.reason || /\.(m?jsx?|json):\d/.test(row.reason)) bad.push(`${slot}: reason cites by line or is empty`);
      for (const [size, e] of Object.entries(row.sizes)) {
        if (!CORPUS.sizes.includes(size)) bad.push(`${slot}: size ${size}`);
        if (!['top', 'seen'].includes(e.by) || !(e.meet <= e.ceiling + 1e-9) || e.ceiling > 1 || Math.round(e.ceiling * 100) / 100 !== e.ceiling
          || e.of !== CORPUS.n || !(e.shareAll <= e.shareIn + 1e-9) || (e.by === 'top' && e.meet < e.shareAll - 1e-9)) bad.push(`${slot} ${size}: ${JSON.stringify(e)}`);
      }
    }
    expect(bad).toEqual([]);
  });
  test('the classes file cites by symbol, never by line', () => {
    const classes = readFileSync(new URL('../../scripts/census/sameness-census.classes.json', import.meta.url), 'utf8');
    expect(classes.match(/\.(m?jsx?):\d+/g) || []).toEqual([]);
  });
});
