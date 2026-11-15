// BAR2-CORPUS (REVIEW-BAR-2, 2026-11-15): the cures of the corpus's defence, power, economy and general pools
// (docs/content/RECEIPT_POOLS_DOSSIER_STATE.md, DS-DEF / DS-POW / DS-ECO / DS-SUP / DS-GEN), ONE collected guard a
// batch, in the form of tests/domain/tailCorpusDefGuards.test.js. The towns are the census's own (CENSUS-3 ::
// seedcfg.mjs, the r2r-/r2s- arms of the 720), born as that census births them, and each row is read through the
// kernel's one rule against the town's own record:
//   DECLARED: a cured line is NOT admitted in the fixed town that made it false, and a sibling line of the same
//     pool IS admitted there (what prints instead), so no row can pass because its town drifted out of the case;
//   KEEP: the cured line is still admitted in a town where it is true;
//   REWORDED: a line whose claim no printing town could bear is gone from its pool, and its new words are there.
// Each row's measure (towns that printed it, towns whose record denied it, on the 720 at f8042b61a) is in
// docs/chair/2026-11-15/bar2/BAR2-CORPUS-HANDBACK.md.
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
  { batch: 1, seed: 'r2s-wartime-town-0', pool: 'DS-GEN-13::MARKET-OPEN', vid: 2, instead: 4, why: 'a war that cuts the trade: "lives off through-traffic" (C7740)' },
  { batch: 1, seed: 'r2s-wartime-town-0', pool: 'DS-GEN-13::MARKET-OPEN', vid: 1, instead: 4, why: 'a war that cuts the trade: "the roads bring buyers" (C7740\'s class)' },
  { batch: 1, seed: 'r2s-under_siege-town-0', pool: 'DS-SUP-3::ONE EXPECTED CATEGORY MISSING', vid: 2, instead: 1, why: 'a siege: "everything a traveller expects is here" with the gates shut (C2273)' },
  { batch: 1, seed: 'r2r-village-24', pool: 'DS-ECO-10::POSTURE: established', vid: 5, instead: 8, why: 'a famine: "buyers from outside come for more than one thing" beside "No significant exports" (C33095)' },
];
/** the KEEP row's member in its own live words, read through tests/helpers/drawnProse.js, so a rewrite moves the title with it */
const ECO10_ESTABLISHED_V5 = variantByVid({ leaf: 'economy', blockId: 'DS-ECO-10', poolKey: 'POSTURE: established', vid: 5, slots: { settlement: '{settlement}' } });
/** @type {ReadonlyArray<{batch: number, seed: string, pool: string, vid: number, why: string}>} */
const KEEP = [
  { batch: 1, seed: 'r2r-town-0', pool: 'DS-GEN-13::MARKET-OPEN', vid: 2, why: 'a market town with no war: it sells to the road' },
  { batch: 1, seed: 'r2r-town-0', pool: 'DS-SUP-3::ONE EXPECTED CATEGORY MISSING', vid: 2, why: 'no siege: a traveller finds all but one' },
  { batch: 1, seed: 'r2r-town-0', pool: 'DS-ECO-10::POSTURE: established', vid: 5, why: `no famine, no siege, no plague: "${ECO10_ESTABLISHED_V5}"` },
];
/**
 * The REWORDED rows name the member by its STABLE id (`vid`) and the OLD claim (`gone`) that must be out of its words; the
 * member's new words are read through tests/helpers/drawnProse.js (`variantByVid`), as tailCorpusDefGuards does.
 * @type {ReadonlyArray<{batch: number, pool: string, vid: number, gone: RegExp, rows: string}>}
 */
const REWORDED = [
  { batch: 1, pool: 'DS-DEF-2::Invasion & War: neither walls nor force', vid: 2, gone: /nobody wanting it|Nothing has come for|nobody having wanted it/, rows: 'C12533 C23558: a past siege or occupation (38 of 77)' },
  { batch: 1, pool: 'DS-DEF-6::Naval Defense: Port only', vid: 2, gone: /has come through it yet/, rows: 'C17168: a past siege or occupation (9 of 11)' },
  { batch: 1, pool: 'DS-DEF-2::Internal Security: full legal chain (court AND prison)', vid: 3, gone: /not a favour/, rows: 'C17087: a hall the criminals hold (6 of 83)' },
  { batch: 1, pool: 'DS-DEF-2::Internal Security: court without detention', vid: 3, gone: /cannot be enforced/, rows: 'C27208: a Safe or Very Safe town (7 of 54)' },
  { batch: 1, pool: 'DS-DEF-2::Economic Survival: WEAK', vid: 3, gone: /^\{settlement\} has been short of money/, rows: 'C13594: the town\'s purse, not the defence\'s (16 of 74)' },
  { batch: 1, pool: 'DS-DEF-2::Economic Survival: WEAK', vid: 1, gone: /paid late or not at all/, rows: 'the defenders\' pay is the safety profile\'s (C6914\'s class)' },
  { batch: 1, pool: 'DS-DEF-2::Economic Survival: STRONG', vid: 1, gone: /defenders paid/, rows: 'C27210: irregular pay (4 of 78)' },
  { batch: 1, pool: 'DS-DEF-2::Economic Survival: STRONG', vid: 3, gone: /defenders are still paid/, rows: 'irregular pay (1 of 26)' },
  { batch: 1, pool: 'DS-DEF-2::Economic Survival: STRONG', vid: 12, gone: /paid on time/, rows: 'C6914: irregular pay (2 of 29)' },
  { batch: 1, pool: 'DS-DEF-11::WALLED-STRAINED', vid: 1, gone: /watch's wages/, rows: 'C25170: a well-paid watch (1 of 22)' },
  { batch: 1, pool: 'DS-DEF-2::CHAIN: defence short', vid: 3, gone: /make do: the town's workshops cannot/, rows: 'C25150: well paid, well equipped (5 of 36)' },
  { batch: 1, pool: 'DS-DEF-2::CHAIN: defence short', vid: 2, gone: /defenders go short of food or gear/, rows: 'C25150\'s class (6 of 27)' },
  { batch: 1, pool: 'DS-DEF-3::Moderate', vid: 2, gone: /neither short nor growing|close to even/, rows: 'C17097: a crime wave (11 of 22)' },
  { batch: 1, pool: 'DS-DEF-3::Moderate', vid: 1, gone: /neither has the upper hand/, rows: 'C17097\'s class: a crime wave' },
  { batch: 1, pool: 'DS-DEF-3::Moderate', vid: 6, gone: /has nobody to keep the peace/, rows: 'C23568: the old families keep the peace (9 of 34)' },
  { batch: 1, pool: 'DS-DEF-9::magicDependency false', vid: 3, gone: /more slowly and less comfortably/, rows: 'C7002: no practitioner, no reliance' },
  { batch: 1, pool: 'DS-DEF-12::CAPACITY: enough', vid: 2, gone: /covers an ordinary year/, rows: 'C31855: grows less than it eats (3 of 5)' },
  { batch: 1, pool: 'DS-DEF-12::CAPACITY: enough', vid: 1, gone: /enough for an ordinary year/, rows: 'C31855\'s class (3 of 5)' },
  { batch: 1, pool: 'DS-DEF-12::CAPACITY: enough', vid: 3, gone: /a good year is comfortable/, rows: 'C31855\'s class (8 of 13)' },
  { batch: 1, pool: 'DS-POW-4::riskLabel: Holding', vid: 2, gone: /\. They cannot,/, rows: 'C8932: "a single shift could swap their positions" (6 of 87)' },
  { batch: 1, pool: 'DS-ECO-9::SECURE', vid: 3, gone: /is not deep/, rows: 'C8653: a granary and six months or more (54 of 140)' },
  { batch: 1, pool: 'DS-ECO-11::STRATEGIC VALUE: the generator\'s assessment, framed', vid: 3, gone: /could not keep it/, rows: 'C4528: Defensible, Well-Defended or Fortress (53 of 125)' },
  { batch: 1, pool: 'DS-ECO-8::MODERATE', vid: 3, gone: /supports itself/, rows: 'C23226: half its food brought in' },
  { batch: 1, pool: 'DS-GEN-13::COMMERCE: craft guilds, no merchant guild', vid: 1, gone: /no merchant guild above/, rows: 'C25594: a power named Merchant Guilds (5 of 12)' },
  { batch: 1, pool: 'DS-ECO-1::COMBINATION C1: a high rung on a working approach', vid: 2, gone: /traffic/, rows: 'C23849 (WORKLIST-DISPLAY-ECON): a thorp with no trade and a harvest-only income' },
  { batch: 1, pool: 'DS-ECO-1::COMBINATION C1: a high rung on a working approach', vid: 1, gone: /[Tt]raffic/, rows: 'C23849\'s class: the approach\'s traffic' },
  { batch: 1, pool: 'DS-ECO-1::COMBINATION C1: a high rung on a working approach', vid: 3, gone: /keeps it that way/, rows: 'C23849\'s class: the approach keeps it so' },
  { batch: 1, pool: 'DS-ECO-1::COMBINATION C1: a high rung on a working approach', vid: 4, gone: /Trade on/, rows: 'C23849\'s class: the trade on the approach' },
  { batch: 2, pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', vid: 6, gone: /trade that passes by|goes on its way/, rows: 'r2r-thorp-43 (named by BAR2-LABELS): a port thorp with no exports, imports or transit (1 of 68)' },
  { batch: 2, pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', vid: 1, gone: /Trade comes and goes/, rows: 'r2r-thorp-43\'s class: trade through the approach' },
  { batch: 2, pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', vid: 2, gone: /Some trade comes past/, rows: 'r2r-thorp-43\'s class: trade past the town' },
  { batch: 1, pool: 'DS-ECO-6::TIER: minor shadow activity (≥3)', vid: 1, gone: /too little to change/, rows: 'C14631: a shadow income of a seventh or more (3 of 10)' },
];

/** @type {Record<string, any>} */
const CORPUS = {};
/** @type {Record<string, string>} */
const LEAF_OF_BLOCK = {};
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
    for (const [blockId, block] of Object.entries(leaf)) { CORPUS[blockId] = block; LEAF_OF_BLOCK[blockId] = desk; }
  }
  await boundary.loadGenerationLawPayloads();
  for (const seed of new Set([...DECLARED, ...KEEP].map((g) => g.seed))) {
    const town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} });
    FACTS.set(seed, factsOf(town));
  }
}, 300000);

/** A member's own authored text, its {slots} unfilled, read through drawnProse.js. @param {string} poolKey @param {any} v */
function memberText(poolKey, v) {
  const [blockId, ...rest] = poolKey.split('::');
  const slots = Object.fromEntries((v.slots || []).map((/** @type {string} */ name) => [name, `{${name}}`]));
  return variantByVid({ leaf: LEAF_OF_BLOCK[blockId], blockId, poolKey: rest.join('::'), vid: v.vid, slots });
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

describe('BAR2-CORPUS: a cured line is not admitted in the town that made it false', () => {
  for (const g of DECLARED) {
    it(`batch ${g.batch} · ${g.pool} v${g.vid} at ${g.seed}: ${g.why} (v${g.instead} instead)`, () => {
      expect(admitted(g.pool, g.instead, g.seed), `${g.seed} admits no v${g.instead}: re-key the row to a town of the case`).toBe(true);
      expect(admitted(g.pool, g.vid, g.seed), `${g.pool} v${g.vid} is admitted at ${g.seed}`).toBe(false);
    });
  }
});

describe('BAR2-CORPUS: a cured line still prints where it is true', () => {
  for (const g of KEEP) {
    it(`batch ${g.batch} · ${g.pool} v${g.vid} at ${g.seed}: ${g.why}`, () => {
      expect(admitted(g.pool, g.vid, g.seed)).toBe(true);
    });
  }
});

describe('BAR2-CORPUS: a reworded line claims no more than every printing town bears', () => {
  for (const g of REWORDED) {
    it(`batch ${g.batch} · ${g.pool} v${g.vid}: ${g.rows}`, () => {
      const v = poolOf(g.pool).pool.find((x) => x.vid === g.vid);
      expect(v, `${g.pool} has no v${g.vid}`).toBeTruthy();
      expect(v.text, `${g.pool} v${g.vid}: the leaf's member is the one drawnProse.js reads by its vid`).toBe(memberText(g.pool, v));
      expect(v.text).not.toMatch(g.gone); // anchored: the line above shows v.text is the named member's own live text
    });
  }
});
