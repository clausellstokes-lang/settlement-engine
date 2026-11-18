// THE GUARD OF BAR8-K-WATCH (BRIEF-BAR8, the seat's section, 2026-11-17): THE WATCH, THE COURT AND THE WAR BAR SAY WHAT
// THE TOWN'S OWN FORCE AND ROW SAY. The rules of BAR8-AUDIT-K's hand-back (`docs/chair/2026-11-17/bar8/AUDIT/
// BAR8-AUDIT-K-HANDBACK.md`), each held over fixed seeds (the towns its instances printed in at the base, and a negative
// beside each positive):
//   13a  the service line "The court sits and the gaol holds" prints only where the Legal row's court sits (the atom
//        `court sits`, `defence.js :: courtHoldersOf`) and a gaol stands (C39616; its negative: a town whose court sits);
//   13e  "on the rounds most hours of the day" prints only where the town's force walks by day by its own text (the new
//        atom `force walks by day`, `forceHours.js`; C42053; its negative: a town whose watch keeps the day);
// (15d, the war bar's word, is LEFT BY NAME in the hand-back: the owner's chart-proportion guard holds the PDF bar's label
// to the band of the score it is drawn from, ODQ §934.20, so a roster reading of the word alone parts the run and its label.)
// THE DETECTORS read the record (the drawn rows and the roster), never the table the cure changed.
// The counts before and after over the thirty, the 150 and the 720 are in docs/chair/2026-11-17/bar8/BAR8-K-WATCH-HANDBACK.md.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { courtHoldersOf, defenceOf } from '../../src/domain/facts/defence.js';
import { forceWalksByDayOf, nightOnlyText } from '../../src/domain/facts/forceHours.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';

/** The towns of each rule: the base's instances (positives) and a town that keeps the line truly (negatives). */
const TOWNS = Object.freeze({
  'bar0-town-occupied-rand-47': ['13a'], // C39616: "The court sits" under "Prison only / Detention without process."
  'bar0-town-occupied-rand-28': ['13a-keep'], // a court sits and a gaol holds: the line stays
  'bar0-village-calm-rand-46': ['13e'], // C42053: the household rota walks "after dark"
  'bar0-town-calm-rand-31': ['13e'], // the 150's instances
  'bar0-town-calm-rand-41': ['13e'],
  'bar0-town-calm-rand-36': ['13e-keep'], // a force that keeps the day: the line stays
});

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** CENSUS-3 seedcfg.mjs's bar0- arm, verbatim in shape. @param {string} seed */
function configOf(seed) {
  const m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (!m) throw new Error(`a guard seed is a read seed: ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return { ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true };
}

const SLOW_LAW = /^The court sits and the gaol holds\b/;
const BY_DAY = /\bon the rounds most hours of the day\b/;
/** @param {any} town */
const lawlessRows = (town) => (town?.availableServices?.criminal || []).filter((/** @type {any} */ x) => x?.name === 'Weak law, bring coin');
/** @param {any} town */
const guardLine = (town) => String(town?.economicState?.safetyProfile?.guardEffectivenessDesc || '');

/** @type {Map<string, any>} */
const BORN = new Map();
beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of Object.keys(TOWNS)) BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
}, 120_000);

/** @param {string} rule */
const seedsOf = (rule) => Object.entries(TOWNS).filter(([, rs]) => rs.includes(rule)).map(([s]) => s);

describe('13a · the slow-law service line says the court the Legal row prints', () => {
  it('every town of the guard: "The court sits and the gaol holds" only where a court sits on the live roster and a gaol stands', () => {
    const failures = collectSeedFailures(Object.keys(TOWNS), (seed) => {
      const t = BORN.get(seed);
      for (const r of lawlessRows(t)) if (SLOW_LAW.test(String(r.desc)) && !(courtHoldersOf(t).length > 0 && defenceOf(t).prison)) throw new Error(`prints "${r.desc}" with no court sitting (court sits ${courtHoldersOf(t).length > 0}, gaol ${defenceOf(t).prison})`);
    });
    expectNoSeedFailures(failures, '13a');
  });
  it('POSITIVE: C39616\'s town keeps its lawless row, in its other description (no court sits there)', () => {
    for (const seed of seedsOf('13a')) {
      const t = BORN.get(seed); const rows = lawlessRows(t);
      expect(rows.length, seed).toBe(1);
      expect(courtHoldersOf(t).length, seed).toBe(0);
      expect(String(rows[0].desc), seed).toMatch(/^The law here is slow and easily outbid\b/);
    }
  });
  it('NEGATIVE: where a court sits and a gaol holds, the slow-law line still prints', () => {
    for (const seed of seedsOf('13a-keep')) {
      const t = BORN.get(seed);
      expect(courtHoldersOf(t).length > 0 && defenceOf(t).prison, seed).toBe(true);
      expect(lawlessRows(t).map((r) => String(r.desc)).some((d) => SLOW_LAW.test(d)), seed).toBe(true);
    }
  });
});

describe('13e · the watch on its rounds by day only where the force walks by day', () => {
  it('the atom `force walks by day` reads the force\'s own text (constructed rosters)', () => {
    const rota = { name: 'Village watch', desc: 'Each household takes its turn walking the lanes after dark, a lantern kept burning at the crossroads.' };
    const night = { name: 'Town watch', desc: 'Part-time guards who walk the night and keep the peace.' };
    const gates = { name: 'Town watch', desc: 'Part-time guards who walk the night and hold the gates.' };
    const garrison = { name: 'Garrison', desc: 'Soldiers quartered in the keep.' };
    expect(forceWalksByDayOf({ institutions: [rota] })).toBe(false);
    expect(forceWalksByDayOf({ institutions: [night] })).toBe(false);
    expect(forceWalksByDayOf({ institutions: [gates] })).toBe(true); // a gate is held by day
    expect(forceWalksByDayOf({ institutions: [rota, garrison] })).toBe(true);
    expect(forceWalksByDayOf({ institutions: [{ ...garrison, status: 'ruined' }, rota] })).toBe(false); // a ruin walks no rounds
    expect(forceWalksByDayOf({ institutions: [{ name: 'Access to town watch', desc: 'A day away.' }, rota] })).toBe(false);
    expect(forceWalksByDayOf({ institutions: [] })).toBe(false);
    expect(forceWalksByDayOf({})).toBe(undefined);
    expect(nightOnlyText(rota.desc)).toBe(true);
    expect(nightOnlyText(garrison.desc)).toBe(false);
  });
  it('the line\'s declaration is the atom, read through the facts\' home', () => {
    const decl = declarationOf({ text: 'You will see the watch on the rounds most hours of the day.', needs: ['force walks by day'] });
    expect(declarationAdmits(decl, factsOf({ institutions: [{ name: 'Village watch', desc: 'Walks the lanes after dark.' }] })).admitted).toBe(false);
    expect(declarationAdmits(decl, factsOf({ institutions: [{ name: 'Town watch', desc: 'Keeps the market by day.' }] })).admitted).toBe(true);
  });
  it('every town of the guard: "most hours of the day" only where the force walks by day', () => {
    const failures = collectSeedFailures(Object.keys(TOWNS), (seed) => {
      const t = BORN.get(seed);
      if (BY_DAY.test(guardLine(t)) && forceWalksByDayOf(t) !== true) throw new Error(`prints "${guardLine(t).slice(0, 90)}" where every force walks the night`);
    });
    expectNoSeedFailures(failures, '13e');
  });
  it('POSITIVE: the night-walking towns keep a patrol line of the pool (#18) in its place', () => {
    for (const seed of seedsOf('13e')) {
      const t = BORN.get(seed);
      expect(forceWalksByDayOf(t), seed).toBe(false);
      expect(guardLine(t), seed).toMatch(/\b(?:maintains? standard patrol coverage|walks? the usual rounds|patrols? on a regular round)\b/);
    }
  });
  it('NEGATIVE: a town whose force keeps the day still prints the line', () => {
    for (const seed of seedsOf('13e-keep')) {
      const t = BORN.get(seed);
      expect(forceWalksByDayOf(t), seed).toBe(true);
      expect(guardLine(t), seed).toMatch(BY_DAY);
    }
  });
});
