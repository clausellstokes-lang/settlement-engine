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
// BAR8-K-WATCH-2 (the chair's BR29 (2)): the atom reads the one partition's houses (`orderForce.js :: orderForceOf(record).houses`,
// the Defense tab's "Standing forces") through `factsOf`, never a name table of its own: a Warden's Lodge is no force, a
// Household levy or Multiple garrisons is one (bar0-town-calm-rand-437: the by-day line beside a night-only watch, held true
// only by a Warden's Lodge).
// THE DETECTORS read the record (the drawn rows and the roster), never the table the cure changed.
// The counts before and after over the thirty, the 150 and the 720 are in docs/chair/2026-11-17/bar8/BAR8-K-WATCH-HANDBACK.md.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { courtHoldersOf, defenceOf } from '../../src/domain/facts/defence.js';
import { nightOnlyText } from '../../src/domain/facts/forceHours.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';

/** The towns of each rule: the base's instances (positives) and a town that keeps the line truly (negatives). */
const TOWNS = Object.freeze({
  'bar0-town-occupied-rand-47': ['13a'], // C39616: "The court sits" under "Prison only / Detention without process."
  'bar0-town-occupied-rand-28': ['13a-keep'], // a court sits and a gaol holds: the line stays
  'bar0-village-calm-rand-46': ['13e'], // C42053: the household rota walks "after dark"
  'bar0-town-calm-rand-31': ['13e'], // the 150's instances
  'bar0-town-calm-rand-41': ['13e'],
  // FAULTS-WATCH item 2 (2026-11-18; FR9: a gate held is a post, not a round): rand-36's Town watch walks the night and holds
  // the gates, so it no longer keeps the day; RE-KEYED BY IDENTITY to rand-39, whose Barracks keep the day beside its watch
  'bar0-town-calm-rand-39': ['13e-keep'], // a force that keeps the day: the line stays
  'bar0-town-calm-rand-437': ['13e'], // BR29 (2): a night-only Town watch; the atom held only by a Warden's Lodge
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
/** the atom `force walks by day`, read through the facts' home. @param {any} town */
const walksByDay = (town) => factsOf(town).forceWalksByDay;

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
    // FAULTS-WATCH item 2 (2026-11-18; FR9): a gate held is a post, not a round by day; RE-KEYED BY IDENTITY to a text that
    // walks the night and keeps the day (the claim kept: a night-walking text that keeps the day walks by day)
    const gates = { name: 'Town watch', desc: 'Part-time guards who walk the night and keep the market by day.' };
    const garrison = { name: 'Garrison', desc: 'Soldiers quartered in the keep.' };
    /** @param {Array<Record<string, unknown>>} institutions */
    const atom = (institutions) => factsOf({ institutions }).forceWalksByDay;
    expect(atom([rota])).toBe(false);
    expect(atom([night])).toBe(false);
    expect(atom([gates])).toBe(true); // the day is kept
    expect(atom([rota, garrison])).toBe(true);
    expect(atom([{ ...garrison, status: 'ruined' }, rota])).toBe(false); // a ruin walks no rounds
    expect(atom([])).toBe(false);
    expect(factsOf({}).forceWalksByDay).toBe(undefined); // no roster: unanswered
    expect(nightOnlyText(rota.desc)).toBe(true);
    expect(nightOnlyText(garrison.desc)).toBe(false);
  });
  // BAR8-K-WATCH-2 (BR29 (2)): the houses are the one partition's, as the Defense tab prints them under "Standing forces"
  it('the atom reads the one partition: a Warden\'s Lodge is no force; a Household levy or Multiple garrisons is one', () => {
    const night = { name: 'Town watch', desc: 'Part-time guards who walk the night and keep the peace.' };
    const rota = { name: 'Village watch', desc: 'Each household takes its turn walking the lanes after dark.' };
    const warden = { name: "Warden's Lodge", desc: 'Rangers keep this lodge, minding the wilderness about the town.' };
    /** @param {Array<Record<string, unknown>>} institutions */
    const atom = (institutions) => factsOf({ institutions }).forceWalksByDay;
    const failures = collectSeedFailures([
      { roster: [warden, night], want: false, why: "a Warden's Lodge beside a night-only watch is refused" },
      { roster: [{ name: 'Household levy', desc: 'Every household owes a spear when the call goes out.' }, rota], want: true, why: 'a Household levy is read' },
      { roster: [{ name: 'Multiple garrisons', desc: 'Soldiers quartered across the districts.' }, night], want: true, why: 'Multiple garrisons is read' },
    ], ({ roster, want, why }) => { expect(atom(roster), why).toBe(want); });
    expectNoSeedFailures(failures, 'the one partition');
  });
  it('the line\'s declaration is the atom, read through the facts\' home', () => {
    const decl = declarationOf({ text: 'You will see the watch on the rounds most hours of the day.', needs: ['force walks by day'] });
    expect(declarationAdmits(decl, factsOf({ institutions: [{ name: 'Village watch', desc: 'Walks the lanes after dark.' }] })).admitted).toBe(false);
    expect(declarationAdmits(decl, factsOf({ institutions: [{ name: 'Town watch', desc: 'Keeps the market by day.' }] })).admitted).toBe(true);
  });
  it('every town of the guard: "most hours of the day" only where the force walks by day', () => {
    const failures = collectSeedFailures(Object.keys(TOWNS), (seed) => {
      const t = BORN.get(seed);
      if (BY_DAY.test(guardLine(t)) && walksByDay(t) !== true) throw new Error(`prints "${guardLine(t).slice(0, 90)}" where every force walks the night`);
    });
    expectNoSeedFailures(failures, '13e');
  });
  it('POSITIVE: the night-walking towns keep a patrol line of the pool (#18) in its place', () => {
    const failures = collectSeedFailures(seedsOf('13e'), (seed) => {
      const t = BORN.get(seed);
      expect(walksByDay(t), seed).toBe(false);
      expect(guardLine(t), seed).toMatch(/\b(?:maintains? standard patrol coverage|walks? the usual rounds|patrols? on a regular round)\b/);
    });
    expectNoSeedFailures(failures, '13e positives');
  });
  // BAR8-K-WATCH-2 (BR29 (2)): the reader's town, where the old name table held the atom true by a Warden's Lodge alone
  it('bar0-town-calm-rand-437: a Warden\'s Lodge beside a night-only Town watch does not put the watch on its rounds by day', () => {
    const t = BORN.get('bar0-town-calm-rand-437');
    const names = (t.institutions || []).map((/** @type {any} */ i) => String(i?.name));
    expect(names, 'premise: the lodge stands').toContain("Warden's Lodge");
    expect(names, 'premise: the night-only watch stands').toContain('Town watch');
    expect(walksByDay(t)).toBe(false);
    expectAbsentWithAnchor(guardLine(t), 'on the rounds most hours of the day', 'maintains standard patrol coverage', 'the guard line of the reader\'s town');
  });
  it('NEGATIVE: a town whose force keeps the day still prints the line', () => {
    for (const seed of seedsOf('13e-keep')) {
      const t = BORN.get(seed);
      expect(walksByDay(t), seed).toBe(true);
      expect(guardLine(t), seed).toMatch(BY_DAY);
    }
  });
});
