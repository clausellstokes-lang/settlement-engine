// TAIL-CORPUS-DEF (READ-ALL's tail, 2026-11-14): the cures of the corpus's defence, power, conditions and faith
// pools (docs/content/RECEIPT_POOLS_DOSSIER_STATE.md, DS-DEF / DS-POW / DS-CND / DS-FTH), ONE collected guard a
// batch. The towns are the census's own (CENSUS-3 :: seedcfg.mjs, the r2r-/r2s- arms of the 720), born as that
// census births them, and each row is read through the kernel's one rule against the town's own record:
//   DECLARED: a cured line is NOT admitted in the fixed town that made it false, and a sibling line of the same
//     pool IS admitted there (what prints instead), so no row can pass because its town drifted out of the case;
//   KEEP: the cured line is still admitted in a town where it is true;
//   REWORDED: a line whose claim no printing town could bear is gone from its pool, and its new words are there.
import { beforeAll, describe, expect, it } from 'vitest';

/** the census's dials (CENSUS-3 :: seedcfg.mjs, verbatim) */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** @param {string} seed */
function configOf(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`)); if (m) return { ...DIALS, settType: m[1] };
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`)); if (m) return { ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  throw new Error(`a census seed (r2r-<size>-<i> or r2s-<crisis>-<size>-<i>): ${seed}`);
}

/**
 * One row a cure. `vid` the cured line; `instead` the sibling that is admitted in its place.
 * @type {ReadonlyArray<{batch: number, seed: string, pool: string, vid: number, instead: number, why: string}>}
 */
const DECLARED = [
  { batch: 1, seed: 'r2r-hamlet-0', pool: 'DS-DEF-5::walls ABSENT', vid: 2, instead: 1, why: 'a siege: "pass nobody on the way in" past a besieging force (row 29118)' },
  { batch: 1, seed: 'r2s-occupied-hamlet-1', pool: 'DS-DEF-5::walls ABSENT', vid: 2, instead: 1, why: 'an occupation: "pass nobody on the way in" past the occupiers (row 29118)' },
  { batch: 1, seed: 'r2r-city-19', pool: 'DS-DEF-5::walls PRESENT', vid: 2, instead: 3, why: 'a port: "every arrival goes through a gate" where ships land (row 01111)' },
  { batch: 1, seed: 'r2r-town-37', pool: 'DS-DEF-5::walls PRESENT', vid: 2, instead: 3, why: 'a port: "every arrival goes through a gate" with the sea approaches open (row 01113)' },
  { batch: 1, seed: 'r2s-indebted-village-3', pool: 'DS-DEF-8::override active, viability intact', vid: 2, instead: 3, why: 'nobody under arms: "the defence makes do with what is left over" (row B11985)' },
  { batch: 2, seed: 'r2s-famine-village-3', pool: 'DS-DEF-12::CAPACITY: ample', vid: 3, instead: 4, why: 'a famine: "more than enough to get through a hard year" (row 23220)' },
  { batch: 2, seed: 'r2s-under_siege-town-2', pool: 'DS-DEF-12::CAPACITY: ample', vid: 3, instead: 4, why: 'a siege with a food deficit: "more than enough to get through a hard year" (row 23219)' },
  { batch: 2, seed: 'r2s-succession_void-town-0', pool: 'DS-POW-5::autocrat', vid: 1, instead: 5, why: 'a succession void: "one person decides … and decides quickly" (row 00333)' },
  { batch: 2, seed: 'r2s-politically_fractured-town-2', pool: 'DS-POW-5::autocrat', vid: 1, instead: 5, why: 'a fractured town with no stable governing authority: "one person decides" (row 00333\'s class)' },
  { batch: 3, seed: 'r2s-under_siege-village-2', pool: 'DS-POW-4::riskLabel: Contested', vid: 4, instead: 1, why: 'a siege: "visitors … are quietly told to stay polite" where no visitor arrives (row B22476)' },
  { batch: 3, seed: 'r2s-occupied-city-0', pool: 'DS-POW-4::riskLabel: Critical. The seat could fall', vid: 3, instead: 2, why: 'an occupation: the occupier "has not yet moved to take" the hall it already rules (row 07358)' },
];
/** @type {ReadonlyArray<{batch: number, seed: string, pool: string, vid: number, why: string}>} */
const KEEP = [
  { batch: 1, seed: 'r2r-hamlet-1', pool: 'DS-DEF-5::walls ABSENT', vid: 2, why: 'no wall, no siege, no occupation: anyone walks in' },
  { batch: 1, seed: 'r2r-city-0', pool: 'DS-DEF-5::walls PRESENT', vid: 2, why: 'a walled road town with a gate and a watch: every arrival is at a gate' },
  { batch: 1, seed: 'r2r-city-10', pool: 'DS-DEF-8::override active, viability intact', vid: 2, why: 'a town with defenders: the defence makes do' },
  { batch: 2, seed: 'r2r-town-54', pool: 'DS-DEF-12::CAPACITY: ample', vid: 3, why: 'an isolated town with ample paths and a secure food record: more than enough for a hard year' },
  { batch: 2, seed: 'r2r-town-17', pool: 'DS-POW-5::autocrat', vid: 1, why: 'a Feudal Appointee at peace, its seat settled: one person decides' },
  { batch: 3, seed: 'r2r-village-23', pool: 'DS-POW-4::riskLabel: Contested', vid: 4, why: 'a contested seat, no siege: visitors are warned to stay polite to the challenger' },
  { batch: 3, seed: 'r2r-city-44', pool: 'DS-POW-4::riskLabel: Critical. The seat could fall', vid: 3, why: 'an ungated seat, no occupation: the challenger has not yet moved' },
];
/** @type {ReadonlyArray<{batch: number, pool: string, vid: number, gone: RegExp, now: string, rows: string}>} */
const REWORDED = [
  { batch: 1, pool: 'DS-DEF-5::arcane defense ABSENT', vid: 1, gone: /conventional throughout/, now: 'has no arcane defense', rows: '20784 22421: "conventional" of a town with no wall and no force' },
  { batch: 1, pool: 'DS-DEF-5::arcane defense ABSENT', vid: 3, gone: /Nothing unseen is known to have come/, now: 'would find nothing to meet it', rows: 'B14309 B14310: a past purge or arcane incident' },
  { batch: 1, pool: 'DS-DEF-2::Invasion & War: neither walls nor force', vid: 2, gone: /Nothing has come for|nobody having wanted it/, now: 'nobody wanting it enough to try', rows: 'B14258 B14259 B14260 B11532: a past siege, occupation or purge' },
  { batch: 1, pool: 'DS-DEF-8::override active, viability intact', vid: 3, gone: /would not guess at the trouble/, now: 'is shaken by this trouble', rows: '03156-03161 B03075: a plague, a war or a revolt shows in the streets' },
  { batch: 1, pool: 'DS-DEF-8::override active, viability intact', vid: 1, gone: /its defence has had to change/, now: 'change its ways', rows: 'the inheritor of v2 in a town with nobody under arms' },
  { batch: 1, pool: 'DS-DEF-8::override: SECURITY COMPROMISED', vid: 2, gone: /^The guards at/, now: 'Those who keep watch at', rows: '20690: a citizen militia keeps no guards' },
  { batch: 3, pool: 'DS-POW-4::riskLabel: Stable (no challengers)', vid: 1, gone: /nobody in the town is asking who comes next/, now: 'no contender stands ready to try', rows: '14859 14856 14852 14857 14854 B14026: a Legitimacy Crisis or a contested legitimacy (41 of 52 towns)' },
  { batch: 3, pool: 'DS-POW-4::riskLabel: Stable (no challengers)', vid: 2, gone: /does not come up/, now: 'the town would have no contender to name', rows: '21584 21590 21587 21595: a Legitimacy Crisis or a contested legitimacy (39 of 53)' },
  { batch: 3, pool: 'DS-POW-4::riskLabel: Stable (no challengers)', vid: 3, gone: /is safe in the hall/, now: 'stands ready to lead them against the', rows: '15533 15536 15531 B14699 B14695 B14704: a Legitimacy Crisis, a Desperate town (27 of 49)' },
  { batch: 3, pool: 'DS-POW-4::riskLabel: Stable (no challengers)', vid: 6, gone: /the fighting across the town/, now: 'what threatens it now is the fighting itself', rows: '14648 14646 14639: the kingdom\'s war, fought elsewhere (13 of 31)' },
  { batch: 3, pool: 'DS-POW-4::riskLabel: Critical. The seat could fall', vid: 1, gone: /^Nothing at .* protects the/, now: 'The office no longer shields the', rows: '15073 B14249 (C10): the seat is the strongest power or has a symbiotic guard; the office is what fails it' },
];

/** @type {Record<string, any>} */
const CORPUS = {};
/** @type {Map<string, object>} */
const FACTS = new Map();
/** @type {{ variantFactDeclaration?: Function, declarationAdmits?: Function }} */
const RULE = {};

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { factsOf } = await import('../../src/domain/facts/factsOf.js');
  const kernel = await import('../../src/domain/display/stateProse/stateProseKernel.js');
  const vocabulary = await import('../../src/domain/facts/factVocabulary.js');
  RULE.variantFactDeclaration = kernel.variantFactDeclaration;
  RULE.declarationAdmits = vocabulary.declarationAdmits;
  for (const desk of ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith']) {
    const leaf = Object.values(await import(`../../src/data/dossierStateProse/${desk}.generated.js`)).find((v) => v && typeof v === 'object');
    for (const [blockId, block] of Object.entries(leaf)) CORPUS[blockId] = block;
  }
  await boundary.loadGenerationLawPayloads();
  for (const seed of new Set([...DECLARED, ...KEEP].map((g) => g.seed))) {
    const town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} });
    FACTS.set(seed, factsOf(town));
  }
}, 300000);

/** @param {string} poolKey */
function poolOf(poolKey) {
  const [blockId, ...rest] = poolKey.split('::'); const key = rest.join('::');
  const block = CORPUS[blockId];
  return { pool: block?.pools?.[key] || [], crisisScoped: block?.poolMeta?.[key]?.crisisScoped === true };
}
/** @param {string} poolKey @param {number} vid @param {string} seed */
function admitted(poolKey, vid, seed) {
  const { pool, crisisScoped } = poolOf(poolKey);
  const v = pool.find((x) => x.vid === vid);
  expect(v, `${poolKey} has no v${vid}`).toBeTruthy();
  return RULE.declarationAdmits?.(RULE.variantFactDeclaration?.(v), FACTS.get(seed), { crisisScoped }).admitted;
}

describe('TAIL-CORPUS-DEF: a cured line is not admitted in the town that made it false', () => {
  for (const g of DECLARED) {
    it(`batch ${g.batch} · ${g.pool} v${g.vid} at ${g.seed}: ${g.why} (v${g.instead} instead)`, () => {
      expect(admitted(g.pool, g.instead, g.seed), `${g.seed} admits no v${g.instead}: re-key the row to a town of the case`).toBe(true);
      expect(admitted(g.pool, g.vid, g.seed), `${g.pool} v${g.vid} is admitted at ${g.seed}`).toBe(false);
    });
  }
});

describe('TAIL-CORPUS-DEF: a cured line still prints where it is true', () => {
  for (const g of KEEP) {
    it(`batch ${g.batch} · ${g.pool} v${g.vid} at ${g.seed}: ${g.why}`, () => {
      expect(admitted(g.pool, g.vid, g.seed)).toBe(true);
    });
  }
});

describe('TAIL-CORPUS-DEF: a reworded line claims no more than every printing town bears', () => {
  for (const g of REWORDED) {
    it(`batch ${g.batch} · ${g.pool} v${g.vid}: ${g.rows}`, () => {
      const v = poolOf(g.pool).pool.find((x) => x.vid === g.vid);
      expect(v, `${g.pool} has no v${g.vid}`).toBeTruthy();
      expect(v.text).not.toMatch(g.gone);
      expect(v.text).toContain(g.now);
    });
  }
});
