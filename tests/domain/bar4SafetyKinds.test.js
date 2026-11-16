/**
 * bar4SafetyKinds.test.js — BAR4-SAFETY (BRIEF-BAR4 amendment K4; vetoable by the owner): THE THREE KINDS' DETECTORS KEPT
 * AS A GUARD (`tests/helpers/safetyKindDetectors.js`), each read against its ONE settled fact over births of the census's
 * own seeds (CENSUS-3 seedcfg.mjs: the r2r-, r2s- and bar0- arms):
 *   F1 · how the guard is paid (`facts/guardPay.js :: guardPayOf`) against the guard assessment (C44796);
 *   F2 · whether the besiegers move (`facts/siegeMotion.js :: siegeMotionOf`) against the Tonight sheet (C2020 C20892);
 *   F3 · whether crime has a structure (`facts/criminalStructureKey.js`) against the crime patterns (C46446).
 * The sample: every siege town of the census's 720 (r2s-under_siege-*), the 720's towns where a detector fired at the
 * base (a71788851), and the read towns of REVIEW-BAR-4. Each kind reads ZERO over it, and each detector FIRES on a
 * POSITIVE CONTROL (the base's own line in the state that makes it false), so it cannot go blind.
 * The lines this seat's files do not write are NOT read here (named in the hand-back for their seats): the quarrel's
 * hook (`power/conflicts.js` draws it before it can read the funded gate), the PDF Overview's enforcement line
 * (`shadowEconomyShown.js :: criminalsStandHere`) and the religious power's "organised crime has crowded out"
 * (`power/rulingStructure.js`).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { guardPayInstances, siegeMotionInstances, crimeStructureInstances, crimeReadingsOf } from '../helpers/safetyKindDetectors.js';
import { guardPayOf } from '../../src/domain/facts/guardPay.js';
import { siegeMotionOf, SIEGE_ARCHETYPE } from '../../src/domain/facts/siegeMotion.js';
import { archetypeForStressor } from '../../src/domain/conditionPromotion.js';
import { criminalStructureKeyOf } from '../../src/domain/facts/criminalStructureKey.js';
import { composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';
import { CRISIS_SUMMARY_POOLS } from '../../src/domain/crisis/crisisSummaryVantage.js';
import { keptGuardLine } from '../../src/generators/safetyProfile.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs, its three arms verbatim. @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return towns.get(seed);
};
/** @param {unknown} text @returns {string[]} */
const sentences = (text) => String(text ?? '').split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);
/** @param {unknown} v @returns {string[]} every string inside v, split to sentences */
const stringsIn = (v) => (typeof v === 'string' ? sentences(v) : Array.isArray(v) ? v.flatMap(stringsIn) : v && typeof v === 'object' ? Object.values(v).flatMap(stringsIn) : []);

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const STRESSES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset', 'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** THE CENSUS'S 720 (CENSUS-3 seeds.txt): r2r-<size>-0..59 and r2s-<stress>-<size>-0..3. */
const CENSUS_720 = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...STRESSES.flatMap((st) => SIZES.flatMap((size) => [0, 1, 2, 3].map((i) => `r2s-${st}-${size}-${i}`))),
];
/** The read towns of REVIEW-BAR-4's six rows (not among the 720). */
const READ = ['bar0-village-calm-rand-22', 'bar0-city-under_siege+famine-rand-21', 'bar0-hamlet-under_siege-rand-23', 'bar0-village-famine-rand-21', 'bar0-city-under_siege+famine-rand-23'];
const SAMPLE = [...CENSUS_720, ...READ];
/**
 * OWED, NOT EXCLUDED (named for the chair: `steps/assembleSettlement.js` is no seat's): the survival-crime line is settled
 * where the services are not handed (`settleCrimeLinesToSignal`'s lists carry no `services`), so a town whose ONLY criminal
 * reading is a covert service ("Fencing stolen goods", no criminal income row, no house) still prints "No criminal
 * infrastructure" beside its fence. Measured at this tip: 1 town of the 720 (r2r-village-12). A ceiling that only shrinks.
 */
const OWED_COVERT_ONLY = 1;

/** @param {any} t the lines this seat's files print, by kind */
const linesOf = (t) => ({
  guard: sentences(t.economicState?.safetyProfile?.guardEffectivenessDesc),
  tonight: stringsIn(composeTonightSheet(t)),
  crime: (t.economicState?.safetyProfile?.crimeTypes || []).flatMap((/** @type {any} */ c) => sentences(c?.desc)),
});

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

describe('BAR4-SAFETY: the three kinds read one settled fact each', () => {
  test('F1 F2 F3: zero instances over the sample', () => {
    /** @type {string[]} */ const owed = [];
    const failures = collectSeedFailures(SAMPLE, (seed) => {
      const t = town(seed);
      const l = linesOf(t);
      expect(guardPayInstances(guardPayOf(t), l.guard), `${seed} F1`).toEqual([]);
      expect(siegeMotionInstances(siegeMotionOf(t), l.tonight), `${seed} F2`).toEqual([]);
      const held = { key: criminalStructureKeyOf(t), ...crimeReadingsOf(t) };
      const f3 = crimeStructureInstances(held, l.crime);
      const covertOnly = f3.length > 0 && held.covertService && !held.criminalIncome && f3.every((i) => i.said === 'none');
      if (covertOnly) owed.push(seed);
      else expect(f3, `${seed} F3`).toEqual([]);
    });
    expectNoSeedFailures(failures);
    expect(owed.length, `the owed covert-only towns (${owed.join(', ')}): a ceiling that only shrinks`).toBeLessThanOrEqual(OWED_COVERT_ONLY);
  }, 600_000);

  test('the read rows: what prints instead', () => {
    const rota = linesOf(town('bar0-village-calm-rand-22')).guard;
    expect(guardPayOf(town('bar0-village-calm-rand-22')), 'C44796: the village watch is an unpaid rota').toBe('unpaid');
    expect(rota.join(' '), 'C44796: the rota twin prints').toContain('disciplined but unpaid: neighbours who keep the rota');
    for (const [seed, name] of [['bar0-city-under_siege+famine-rand-21', 'Qingkou'], ['bar0-hamlet-under_siege-rand-23', 'Darhankul']]) {
      expect(siegeMotionOf(town(seed)), `${seed}: the siege advances`).toBe('advancing');
      expect(linesOf(town(seed)).tonight.join(' '), `${seed}: the advancing twin prints`).toContain(`The besiegers around ${name} tighten their lines each week`);
    }
    const famine = town('bar0-village-famine-rand-21');
    expect(criminalStructureKeyOf(famine), 'C46446: Black Market Revenue and a covert fence are a diffuse presence').toBe('diffuse');
    expect(linesOf(famine).crime.join(' '), 'C46446: the survival line names the theft, not "no infrastructure"').toContain('Hunger-driven theft of food');
  }, 600_000);

  test('KEEP: a siege that holds keeps "have not moved"; a funded guard keeps "well paid"', () => {
    const hold = CRISIS_SUMMARY_POOLS.under_siege.tonight.watch;
    expect(siegeMotionInstances('holding', [hold.replace('{name}', 'X')])).toEqual([]);
    const paid = town('bar0-city-under_siege+famine-rand-23');
    expect(guardPayOf(paid), 'C7336: the gate is 1').toBe('full');
    expect(linesOf(paid).guard.join(' ')).toContain('well paid and well equipped');
  }, 600_000);
});

describe('BAR4-SAFETY: the positive controls (each detector fires on the base line in the state that makes it false)', () => {
  test('F1: "irregular pay" of an unpaid rota fires; the cured line does not', () => {
    const base = 'The local watch is disciplined but resource-constrained: motivated with inadequate equipment and irregular pay. Effective in a fight; vulnerable to sustained corruption.';
    const record = { institutions: [{ name: 'Village watch' }], defenseProfile: { economicGates: { military: 0.8 } } };
    expect(guardPayInstances(guardPayOf(record), sentences(base)).length).toBeGreaterThan(0);
    expect(guardPayInstances(guardPayOf(record), sentences(keptGuardLine(base, record.institutions, 'Poor', { militaryGate: 0.8 })))).toEqual([]);
    expect(guardPayInstances('full', ['The garrison exists on paper.', 'Chronically underpaid and poorly equipped.']).length).toBeGreaterThan(0);
  });
  test('F2: "have not moved" under an advancing siege fires', () => {
    expect(SIEGE_ARCHETYPE, 'the leaf\'s constant is the promotion table\'s own answer').toBe(archetypeForStressor({ type: 'under_siege', label: 'Under Siege' }));
    const line = CRISIS_SUMMARY_POOLS.under_siege.tonight.watch.replace('{name}', 'Qingkou');
    expect(siegeMotionOf({ stress: [{ type: 'under_siege', label: 'Under Siege' }], activeConditions: [{ archetype: 'war_pressure', status: 'worsening' }] })).toBe('advancing');
    expect(siegeMotionInstances('advancing', [line]).length).toBe(1);
  });
  test('F3: "No criminal infrastructure" beside a Black Market Revenue row fires', () => {
    const record = { institutions: [{ name: 'Mill' }], economicState: { incomeSources: [{ source: 'Black Market Revenue', percentage: 18, isCriminal: true }] } };
    expect(criminalStructureKeyOf(record)).toBe('diffuse');
    const line = 'Theft driven by economic desperation rather than organization. No criminal infrastructure: just too many people with too little, doing what they must to survive.';
    expect(crimeStructureInstances({ key: criminalStructureKeyOf(record), ...crimeReadingsOf(record) }, sentences(line)).length).toBe(1);
  });
});
