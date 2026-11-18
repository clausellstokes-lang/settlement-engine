// TAIL-CORPUS-DEF (READ-ALL's tail, 2026-11-14): the cures of the corpus's defence, power, conditions and faith
// pools (docs/content/RECEIPT_POOLS_DOSSIER_STATE.md, DS-DEF / DS-POW / DS-CND / DS-FTH), ONE collected guard a
// batch. The towns are the census's own (CENSUS-3 :: seedcfg.mjs, the r2r-/r2s- arms of the 720), born as that
// census births them, and each row is read through the kernel's one rule against the town's own record:
//   DECLARED: a cured line is NOT admitted in the fixed town that made it false, and a sibling line of the same
//     pool IS admitted there (what prints instead), so no row can pass because its town drifted out of the case;
//   KEEP: the cured line is still admitted in a town where it is true;
//   REWORDED: a line whose claim no printing town could bear is gone from its pool, and its new words are there.
import { beforeAll, describe, expect, it } from 'vitest';
import { variantByVid } from '../helpers/drawnProse.js';

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
  { batch: 4, seed: 'r2s-under_siege-town-1', pool: 'DS-DEF-2::Internal Security: court without detention', vid: 1, instead: 3, why: 'a siege: "money and exile" where nobody goes out (row 26310)' },
  { batch: 4, seed: 'r2s-under_siege-town-0', pool: 'DS-DEF-2::Internal Security: court without detention', vid: 2, instead: 3, why: 'a siege: "the purse or the road" where no road is open (row 26310\'s sibling)' },
  { batch: 4, seed: 'r2s-insurgency-thorp-1', pool: 'DS-CND-1::DIRECTION: worsening · CRISIS: insurgency', vid: 3, instead: 2, why: 'no market: "fewer merchants pay what the government asks" (row 07715)' },
  { batch: 4, seed: 'r2s-occupied-hamlet-1', pool: 'DS-CND-1::DIRECTION: stable · CRISIS: occupied', vid: 4, instead: 1, why: 'no market: "merchants pay the occupiers the same share of every sale" (row 13414)' },
  { batch: 4, seed: 'r2s-succession_void-thorp-3', pool: 'DS-CND-1::DIRECTION: stable · CRISIS: succession_void', vid: 3, instead: 1, why: 'no market: "merchants deal season to season" (row 15102)' },
  { batch: 5, seed: 'r2s-wartime-town-0', pool: 'DS-DEF-2::Beasts & Monsters: plagued, perimeter AND organized force', vid: 2, instead: 1, why: 'a war: "not an emergency arrangement … nobody treats any of it as unusual" (row B06130)' },
  { batch: 5, seed: 'r2s-monster_pressure-city-0', pool: 'DS-DEF-2::Beasts & Monsters: plagued, perimeter AND organized force', vid: 2, instead: 4, why: 'a monster crisis: "not an emergency arrangement" (row B06130\'s class)' },
  { batch: 5, seed: 'r2r-town-42', pool: 'DS-DEF-2::Economic Survival: STRONG', vid: 8, instead: 1, why: 'a food deficit even now (pressured): "nobody lies awake over a lean year" (row 14935)' },
  { batch: 6, seed: 'r2s-wartime-thorp-0', pool: 'DS-DEF-11::UNWALLED-SMALL', vid: 4, instead: 1, why: 'a war: "nothing threatens it now that a wall would keep out" (C18, UNWALLED)' },
  // RE-KEYED BY IDENTITY (DEBT-1, 2026-11-17): BAR6-DEFDESK (be35850406) put a crime-wave twin at Safe v3, so the pool's
  // later members moved up one: "plain that somebody keeps it that way" is v4 (was v3) and the neighbours' line is v5 (was
  // v4). The same rows, the same towns, the same lines, by their new vids.
  // RE-KEYED BY IDENTITY (FAULTS-DESKS, 2026-11-18; the chair's FR6, R8): the neighbours' line (v5 of both pools) is a
  // "record of crimes" line and now declares `court or gaol`, which none of these three towns keeps (no court sits, no gaol
  // stands), so it is refused there too. The same rows, the same towns, the same cured lines; "instead" is the sibling each
  // town now prints: Safe v1 ("Crime … stays small"), Very Safe v2 ("You can walk {settlement} at any hour").
  { batch: 6, seed: 'r2s-infiltrated-village-2', pool: 'DS-DEF-3::Safe', vid: 2, instead: 1, why: 'nobody under arms: "enforcement keeps it down" (C18, Safe v2)' },
  { batch: 6, seed: 'r2r-thorp-28', pool: 'DS-DEF-3::Safe', vid: 4, instead: 1, why: 'nobody under arms: "plain that somebody keeps it that way" (Safe v2\'s sibling)' },
  { batch: 6, seed: 'r2r-village-49', pool: 'DS-DEF-3::Very Safe', vid: 3, instead: 2, why: 'nobody under arms: "enforcement far outweighs the criminals" (Safe v2\'s class)' },
];
/** @type {ReadonlyArray<{batch: number, seed: string, pool: string, vid: number, why: string}>} */
const KEEP = [
  { batch: 1, seed: 'r2r-hamlet-1', pool: 'DS-DEF-5::walls ABSENT', vid: 2, why: 'no wall, no siege, no occupation: anyone walks in' },
  { batch: 1, seed: 'r2r-city-0', pool: 'DS-DEF-5::walls PRESENT', vid: 2, why: 'a walled road town with a gate and a watch: every arrival is at a gate' },
  { batch: 1, seed: 'r2r-city-10', pool: 'DS-DEF-8::override active, viability intact', vid: 2, why: 'a town with defenders: the defence makes do' },
  // RE-KEYED BY IDENTITY (BAR7-DESKS, 2026-11-17; BRIEF-BAR7 R8): the same claim on a town that still bears it. r2r-town-54's
  // record is Secure but the page prints its food word as Pressured (`foodWordShown.js`, a daily gap), the state the sixth
  // read's C41011 stood on: the line now declares `food: ≥ secure · no hunger` and is refused there, as it should be.
  { batch: 2, seed: 'r2s-politically_fractured-town-2', pool: 'DS-DEF-12::CAPACITY: ample', vid: 3, why: 'an isolated town with ample paths and a secure food record: more than enough for a hard year' },
  { batch: 2, seed: 'r2r-town-17', pool: 'DS-POW-5::autocrat', vid: 1, why: 'a Feudal Appointee at peace, its seat settled: one person decides' },
  { batch: 3, seed: 'r2r-village-23', pool: 'DS-POW-4::riskLabel: Contested', vid: 4, why: 'a contested seat, no siege: visitors are warned to stay polite to the challenger' },
  { batch: 3, seed: 'r2r-city-44', pool: 'DS-POW-4::riskLabel: Critical. The seat could fall', vid: 3, why: 'an ungated seat, no occupation: no move on the hall yet' }, // title reworded (TAIL-CLOSE-TESTS-C): it quoted DS-POW-4's own words
  { batch: 4, seed: 'r2r-town-17', pool: 'DS-DEF-2::Internal Security: court without detention', vid: 1, why: 'a court and no gaol, no siege: money and exile' },
  { batch: 4, seed: 'r2s-insurgency-city-0', pool: 'DS-CND-1::DIRECTION: worsening · CRISIS: insurgency', vid: 3, why: 'an insurgency in a city with a market: merchants pay the rivals' },
  { batch: 4, seed: 'r2s-occupied-city-3', pool: 'DS-CND-1::DIRECTION: stable · CRISIS: occupied', vid: 4, why: 'an occupied city with a market: merchants pay the occupiers their share' },
  { batch: 4, seed: 'r2s-succession_void-city-0', pool: 'DS-CND-1::DIRECTION: stable · CRISIS: succession_void', vid: 3, why: 'a succession void in a city with a market: merchants deal season to season' },
  { batch: 5, seed: 'r2r-city-34', pool: 'DS-DEF-2::Beasts & Monsters: plagued, perimeter AND organized force', vid: 2, why: 'a plagued walled city at peace: the defence is the week\'s work' },
  { batch: 5, seed: 'r2r-town-16', pool: 'DS-DEF-2::Economic Survival: STRONG', vid: 8, why: 'a secure food record, no crisis: a lean year would not frighten it' },
  { batch: 6, seed: 'r2r-hamlet-1', pool: 'DS-DEF-11::UNWALLED-SMALL', vid: 4, why: 'an unwalled hamlet at peace, no threat and no war' },
  { batch: 6, seed: 'r2r-town-10', pool: 'DS-DEF-3::Safe', vid: 2, why: 'a Safe town with a watch: enforcement keeps crime down' },
  { batch: 6, seed: 'r2r-town-6', pool: 'DS-DEF-3::Very Safe', vid: 3, why: 'a Very Safe town with its defenders: enforcement outweighs the criminals' },
];
/**
 * The REWORDED rows name the member by its STABLE id (`vid`) and the OLD claim (`gone`) that must be out of its words. The
 * member's new words are not spelled here: they are read through tests/helpers/drawnProse.js (`variantByVid`, below), so
 * a later rewording of the same member moves the anchor with it, and only a return of the old claim reds (TAIL-CLOSE-
 * TESTS-C: the rows' literal `now` fragments were state-prose anchors, which proseDrawnAnchors.walker forbids).
 * @type {ReadonlyArray<{batch: number, pool: string, vid: number, gone: RegExp, rows: string}>}
 */
const REWORDED = [
  { batch: 1, pool: 'DS-DEF-5::arcane defense ABSENT', vid: 1, gone: /conventional throughout/, rows: '20784 22421: "conventional" of a town with no wall and no force' },
  { batch: 1, pool: 'DS-DEF-5::arcane defense ABSENT', vid: 3, gone: /Nothing unseen is known to have come/, rows: 'B14309 B14310: a past purge or arcane incident' },
  { batch: 1, pool: 'DS-DEF-2::Invasion & War: neither walls nor force', vid: 2, gone: /Nothing has come for|nobody having wanted it/, rows: 'B14258 B14259 B14260 B11532: a past siege, occupation or purge' },
  { batch: 1, pool: 'DS-DEF-8::override active, viability intact', vid: 3, gone: /would not guess at the trouble/, rows: '03156-03161 B03075: a plague, a war or a revolt shows in the streets' },
  { batch: 1, pool: 'DS-DEF-8::override active, viability intact', vid: 1, gone: /its defence has had to change/, rows: 'the inheritor of v2 in a town with nobody under arms' },
  { batch: 1, pool: 'DS-DEF-8::override: SECURITY COMPROMISED', vid: 2, gone: /^The guards at/, rows: '20690: a citizen militia keeps no guards' },
  { batch: 3, pool: 'DS-POW-4::riskLabel: Stable (no challengers)', vid: 1, gone: /nobody in the town is asking who comes next/, rows: '14859 14856 14852 14857 14854 B14026: a Legitimacy Crisis or a contested legitimacy (41 of 52 towns)' },
  { batch: 3, pool: 'DS-POW-4::riskLabel: Stable (no challengers)', vid: 2, gone: /does not come up/, rows: '21584 21590 21587 21595: a Legitimacy Crisis or a contested legitimacy (39 of 53)' },
  { batch: 3, pool: 'DS-POW-4::riskLabel: Stable (no challengers)', vid: 3, gone: /is safe in the hall/, rows: '15533 15536 15531 B14699 B14695 B14704: a Legitimacy Crisis, a Desperate town (27 of 49)' },
  { batch: 3, pool: 'DS-POW-4::riskLabel: Stable (no challengers)', vid: 6, gone: /the fighting across the town/, rows: '14648 14646 14639: the kingdom\'s war, fought elsewhere (13 of 31)' },
  { batch: 3, pool: 'DS-POW-4::riskLabel: Critical. The seat could fall', vid: 1, gone: /^Nothing at .* protects the/, rows: '15073 B14249 (C10): the seat is the strongest power or has a symbiotic guard; the office is what fails it' },
  { batch: 4, pool: 'DS-DEF-3::Safe', vid: 1, gone: /is a quiet town/, rows: 'B00937 (C10): "a quiet town" beside a regional monster threat (6 of 10)' },
  { batch: 4, pool: 'DS-CND-1::DIRECTION: worsening · CRISIS: famine', vid: 3, gone: /less of it comes in/, rows: '09250: an isolated town that imports nothing (3 of 11)' },
  { batch: 4, pool: 'DS-CND-1::DIRECTION: worsening · CRISIS: politically_fractured', vid: 3, gone: /in every street/, rows: '04039: a thorp has no streets (1 of 9)' },
  { batch: 4, pool: 'DS-CND-1::DIRECTION: worsening · CRISIS: politically_fractured', vid: 4, gone: /Fights between/, rows: 'B07294: no fight and no conflict on the record (4 of 13)' },
  { batch: 4, pool: 'DS-CND-1::DIRECTION: worsening · CRISIS: insurgency', vid: 1, gone: /officials stop answering/, rows: '06991: a thorp or hamlet keeps no officials (3 of 8)' },
  { batch: 4, pool: 'DS-CND-1::DIRECTION: worsening · CRISIS: insurgency', vid: 4, gone: /their own officers/, rows: '22986: a thorp or hamlet keeps no officers (6 of 9)' },
  { batch: 4, pool: 'DS-CND-1::DIRECTION: stable · CRISIS: religious_conversion', vid: 1, gone: /settled into habit|neighbours do not ask/, rows: '21580: a Tense town whose faith quarrel the page calls escalating (5)' },
  { batch: 4, pool: 'DS-CND-1::DIRECTION: worsening · CRISIS: slave_revolt', vid: 1, gone: /more work gangs/, rows: '21712: a thorp of 15 has no work gangs (1 of 5)' },
  { batch: 4, pool: 'DS-CND-1::DIRECTION: stable · CRISIS: succession_void', vid: 2, gone: /the old officers/, rows: 'the inheritor of v3 in a thorp or village with no officers' },
  { batch: 5, pool: 'DS-DEF-2::Economic Survival: WEAK', vid: 1, gone: /pay book|people owed wages/, rows: '01607: an unpaid militia or levy is owed no wages (13 of 15)' },
  { batch: 5, pool: 'DS-DEF-2::Economic Survival: WEAK', vid: 2, gone: /are already owed/, rows: 'v1\'s sibling: an unpaid levy is owed nothing' },
  { batch: 5, pool: 'DS-DEF-2::CHAIN: food trades failing', vid: 1, gone: /so little food is being put by/, rows: '01541: stores of 6 to 15 months in every printing town' },
  { batch: 5, pool: 'DS-DEF-2::CHAIN: food trades failing', vid: 2, gone: /little is being put by against/, rows: 'B19529: a granary and 15 months of stores' },
  { batch: 6, pool: 'DS-DEF-11::UNWALLED-SMALL', vid: 4, gone: /nothing has yet come against it/, rows: 'C18 UNWALLED: 27 of 78 towns hold a past Occupation or Siege' },
  { batch: 6, pool: 'DS-DEF-5::garrison PRESENT', vid: 3, gone: /Everyone entering/, rows: 'C18 garrison: 17 of 64 towns keep an underground house reached by passages under the town' },
  { batch: 6, pool: 'DS-DEF-4::structure semi-organized', vid: 1, gone: /not coordinated enough to have a head/, rows: 'C18 structure: 14 of 53 towns hold a criminal power among the powers' },
  { batch: 6, pool: 'DS-DEF-3::Moderate', vid: 5, gone: /keeps order well enough by itself/, rows: 'C18 Moderate: 22 of 36 towns read Law & order Critical or Collapsed' },
  { batch: 6, pool: 'DS-DEF-3::Moderate', vid: 6, gone: /no great need of anyone yet/, rows: 'v5\'s sibling: 23 of 34 towns, the same' },
  { batch: 6, pool: 'DS-DEF-8::override: INTERNAL PRESSURE (famine)', vid: 1, gone: /The guards' rations/, rows: 'C18 DS-DEF-8: a militia only (r2s-famine-village-1)' },
  { batch: 6, pool: 'DS-DEF-11::WALLED-STRAINED', vid: 1, gone: /defences are sound/, rows: 'C18 WALLED: readiness Vulnerable beside "sound"' },
  { batch: 6, pool: 'DS-DEF-11::WALLED-STRAINED', vid: 2, gone: /defences are sound/, rows: 'C18 WALLED: 29 of 49 towns Vulnerable' },
  { batch: 6, pool: 'DS-DEF-11::WALLED-STRAINED', vid: 6, gone: /stand sound/, rows: 'C18 WALLED: 3 of 4 towns Vulnerable' },
  { batch: 6, pool: 'DS-DEF-11::WALLED-STRAINED', vid: 7, gone: /defences are sound/, rows: 'C18 WALLED: 26 of 28 towns Vulnerable' },
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

/** The desk leaf a block id lives in, by its family. */
const LEAF_OF = /** @type {Record<string, string>} */ ({ DEF: 'defense', POW: 'power', CND: 'stressors', FTH: 'warFaith' });
/** A member's own authored text, its {slots} unfilled, read through drawnProse.js. @param {string} poolKey @param {any} v */
function memberText(poolKey, v) {
  const [blockId, ...rest] = poolKey.split('::');
  const slots = Object.fromEntries((v.slots || []).map((/** @type {string} */ name) => [name, `{${name}}`]));
  return variantByVid({ leaf: LEAF_OF[blockId.split('-')[1]], blockId, poolKey: rest.join('::'), vid: v.vid, slots });
}
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
      expect(v.text, `${g.pool} v${g.vid}: the leaf's member is the one drawnProse.js reads by its vid`).toBe(memberText(g.pool, v));
      expect(v.text).not.toMatch(g.gone); // anchored: the line above shows v.text is the named member's own live text
    });
  }
});
