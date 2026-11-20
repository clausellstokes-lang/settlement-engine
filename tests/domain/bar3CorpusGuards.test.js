// BAR3-CORPUS (REVIEW-BAR-3 and the wide read beside it, 2026-11-15): the cures of the corpus's defence and economy
// pools (docs/content/RECEIPT_POOLS_DOSSIER_STATE.md, DS-DEF / DS-ECO), ONE collected guard a batch, in the form of
// tests/domain/bar2CorpusGuards.test.js's REWORDED arm: a line whose claim a printing town's record denies is gone
// from its pool (`gone`), and its new words (`now`) are the member drawnProse.js reads by its stable vid; a cured-by-declaration row is not admitted in the fixed town that made it false while its sibling
// is (DECLARED), and still admitted where true (KEEP). Each row's
// measure (towns that printed it, towns whose record denied it, on the 720 at 59185b62a) is in
// docs/chair/2026-11-15/bar3/BAR3-CORPUS-HANDBACK.md.
import { beforeAll, describe, expect, it } from 'vitest';
import { variantByVid } from '../helpers/drawnProse.js';

/** the census's dials (CENSUS-3 :: seedcfg.mjs, verbatim, as bar2CorpusGuards reads them) */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** @param {string} seed */
function configOf(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`)); if (m) return { ...DIALS, settType: m[1] };
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`)); if (m) return { ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  throw new Error(`a census seed (r2r-<size>-<i> or r2s-<crisis>-<size>-<i>): ${seed}`);
}

/**
 * One row a cure by declaration. `vid` the cured line; `instead` the sibling (or the twin) admitted in its place.
 * @type {ReadonlyArray<{batch: number, seed: string, pool: string, vid: number, instead: number, why: string}>}
 */
const DECLARED = [
  // C4: crime and order against the crime key and the famine
  { batch: 1, seed: 'r2s-famine-town-2', pool: 'DS-DEF-4::structure organized', vid: 4, instead: 2, why: 'a famine: "very little street violence" (C12393)' },
  { batch: 1, seed: 'r2s-famine-town-2', pool: 'DS-DEF-4::structure organized', vid: 1, instead: 2, why: 'a famine: "random violence is put down" (C12393\'s class)' },
  { batch: 1, seed: 'r2s-famine-town-2', pool: 'DS-DEF-4::structure organized', vid: 3, instead: 2, why: 'a famine: "visitors are not robbed" (C12393\'s class)' },
  // C3/C4's commerce lines under the crisis that stops the trade they claim
  { batch: 1, seed: 'r2s-famine-village-0', pool: 'DS-GEN-13::MARKET-OPEN', vid: 1, instead: 4, why: 'a famine: "the roads bring buyers" (C35244)' },
  // BAR4-SCENES-2 (2026-11-16, re-keyed by identity): under a siege the sibling admitted in v1's and v2's place is now the siege twin v6 (BAR4-SCENES
  // 187c46f61, REVIEW-BAR-4 C19497: v3 "done face to face at the market" declares `no crisis: under_siege`); v6 declares `market`, so v1's row
  // moves to a town of the case (r2s-under_siege-hamlet-0 holds no market, and the pool is drawn only where one stands); the cured lines are unchanged.
  { batch: 1, seed: 'r2s-under_siege-village-0', pool: 'DS-GEN-13::COMMERCE: a market, no guild', vid: 1, instead: 6, why: 'a siege: "anyone can sell at the market" (C13783)' },
  { batch: 1, seed: 'r2s-occupied-town-0', pool: 'DS-GEN-13::COMMERCE: a merchant guild, no bank', vid: 2, instead: 3, why: 'an occupation: "the merchant guild sets the terms of trade" (C31881)' },
  // BAR3-CORPUS-2 · C7's class: the stall-fee sibling under a siege (2 of its 5 printing towns besieged)
  { batch: 2, seed: 'r2s-under_siege-village-0', pool: 'DS-GEN-13::COMMERCE: a market, no guild', vid: 2, instead: 6, why: 'a siege: "the town\'s own hold on trade there is the stall fee" (C7\'s class)' },
];
/** @type {ReadonlyArray<{batch: number, seed: string, pool: string, vid: number, why: string}>} */
const KEEP = [
  { batch: 1, seed: 'r2r-village-0', pool: 'DS-GEN-13::MARKET-OPEN', vid: 1, why: 'no famine, no siege, no war: market day fills' },
  { batch: 1, seed: 'r2r-town-0', pool: 'DS-GEN-13::COMMERCE: a merchant guild, no bank', vid: 2, why: 'no siege, no occupation: the guild sets the terms' },
  { batch: 1, seed: 'r2r-town-0', pool: 'DS-DEF-4::structure organized', vid: 4, why: 'organised crime, no famine: the crime keeps the streets quiet' },
  { batch: 2, seed: 'r2r-hamlet-4', pool: 'DS-GEN-13::COMMERCE: a market, no guild', vid: 2, why: 'no siege: the stall fee is the town\'s hold on its market' },
];

/**
 * @type {ReadonlyArray<{batch: number, pool: string, vid: number, gone: RegExp, now: RegExp, rows: string}>}
 */
const REWORDED = [
  // C1: the gates where a house moves goods beneath the walls, or the town is not its own master
  { batch: 1, pool: 'DS-DEF-5::FIXTURE: gates', vid: 1, gone: /anyone arriving is first seen/, now: /anyone arriving by road/, rows: 'C1 class: smugglers beneath the walls' },
  { batch: 1, pool: 'DS-DEF-5::FIXTURE: gates', vid: 3, gone: /^You come into \{settlement\} by a gate/, now: /^Come to \{settlement\} by the road/, rows: 'C20265: smugglers beneath the walls, a port' },
  { batch: 1, pool: 'DS-DEF-5::FIXTURE: gates', vid: 4, gone: /the town can close them/, now: /the gates can be closed/, rows: 'C31292: an occupied town' },
  { batch: 1, pool: 'DS-DEF-5::walls PRESENT', vid: 2, gone: /every arrival goes through a gate|trouble can only get in/, now: /every arrival by road/, rows: 'C51362: smugglers beneath the walls' },
  { batch: 1, pool: 'DS-DEF-5::walls PRESENT', vid: 1, gone: /a stranger enters where the town intends him/, now: /a stranger who comes by the road/, rows: 'C51362\'s class' },
  // C2: the supply clauses claim the chain's own state (vulnerable or worse), never "failing" where only vulnerable
  { batch: 1, pool: 'DS-DEF-2::CHAIN: defence short', vid: 1, gone: /runs short|are failing/, now: /not on a sure footing/, rows: 'C20202: vulnerable chains only' },
  { batch: 1, pool: 'DS-DEF-2::CHAIN: defence short', vid: 2, gone: /are struggling/, now: /are not secure/, rows: 'C20202\'s class' },
  { batch: 1, pool: 'DS-DEF-2::CHAIN: defence short', vid: 3, gone: /are failing/, now: /not on a sure footing/, rows: 'C17450: vulnerable chains only' },
  { batch: 1, pool: 'DS-DEF-2::CHAIN: defence short', vid: 4, gone: /keep failing/, now: /not on a sure footing/, rows: 'C17450\'s class' },
  // CLOSE-DOORS-1A (2026-11-18, re-keyed by identity, by its TEXT): vid 3 -> 4. BAR6-DEFDESK (be3585040, LAWS 6, 7, 9; JOIN-17 point 4)
  // placed the stores-deep ledger twin at v2, so the guarded `[unfolding]` line ("… would miss if it were cut off") now holds v4.
  { batch: 1, pool: 'DS-DEF-2::CHAIN: food trades failing', vid: 4, gone: /each season they fail/, now: /would miss if it were cut off/, rows: 'C23072 C31251: stores secure and deep' },
  // C3: the income lines read the income record, not a count or an influence score
  { batch: 1, pool: 'DS-ECO-12::INCOME MIX: two or three sources between them', vid: 1, gone: /two or three trades/, now: /biggest trade earns a real portion/, rows: 'C40450 C47266: twelve or thirteen sources' },
  { batch: 1, pool: 'DS-ECO-12::INCOME MIX: two or three sources between them', vid: 2, gone: /two or three trades/, now: /more than one trade named/, rows: 'C40450\'s class' },
  { batch: 1, pool: 'DS-ECO-12::INCOME WEIGHT: the religious houses', vid: 1, gone: /in \{settlement\}'s money|large part of the town's business/, now: /whatever their own share of its money/, rows: 'C3145 C30428: tithes at four to six in a hundred' },
  { batch: 1, pool: 'DS-ECO-12::INCOME WEIGHT: the religious houses', vid: 2, gone: /biggest buyers and employers/, now: /heard in its dealings/, rows: 'C3145\'s class' },
  { batch: 1, pool: 'DS-ECO-12::INCOME WEIGHT: the practice of magic', vid: 1, gone: /in \{settlement\}'s money|large part of its business/, now: /whatever its own share of the town's money/, rows: 'C0943 C21200: magic at two to five in a hundred' },
  // C4: the Dangerous rung claims the crime's weight, never its organisation (a mark there would read the crime key above the pool's layer)
  { batch: 1, pool: 'DS-DEF-3::Dangerous', vid: 2, gone: /Organized criminals/, now: /^Crime at \{settlement\} now outweighs the law outright/, rows: 'C25344: unorganised crime' },
  // C5: one voice of government: the seat's lines claim the speed of the seat, never one person or no appeal
  { batch: 1, pool: 'DS-POW-5::autocrat', vid: 1, gone: /^One person decides/, now: /^Decisions at \{settlement\} come quickly/, rows: 'C29755\'s class: a ruling body of three (4 of 7 printing towns)' },
  { batch: 1, pool: 'DS-POW-5::autocrat', vid: 2, gone: /one person gives the answer|nobody to ask/, now: /asking again seldom gets a different one/, rows: 'C29755: a ruling body (8 of 10)' },
  { batch: 1, pool: 'DS-POW-5::autocrat', vid: 3, gone: /answers to one person/, now: /^If the \{seat\} at \{settlement\} falls/, rows: 'C29755\'s class (4 of 7)' },
  { batch: 1, pool: 'DS-POW-5::autocrat', vid: 4, gone: /nobody to appeal to/, now: /and it comes quickly/, rows: 'C31154: an occupier who vetoes; a ruling body (8 of 10)' },
  // C3: what the town lives on, read by the rung and the hall it names
  { batch: 1, pool: 'DS-ECO-8::MODERATE', vid: 2, gone: /^Things are fine/, now: /^Money at \{settlement\} is neither comfortable nor tight/, rows: 'C25445: a Dangerous, tense thorp (the rung is the purse\'s, not the town\'s)' },
  { batch: 1, pool: 'DS-ECO-12::INCOME WEIGHT: the practice of magic', vid: 2, gone: /biggest buyers and employers/, now: /^Magic is reckoned with in/, rows: 'C0943\'s class' },
  // BAR3-CORPUS-2 · C6: the money line speaks of money only (the Defense tab's finding law reads "nothing put by" as an empty store)
  { batch: 2, pool: 'DS-DEF-2::Economic Survival: WEAK', vid: 1, gone: /nothing put by/, now: /no money is laid by to pay for a long one/, rows: 'C6: defenseWordsFindings\' term "no food stored"' },
  // BAR3-CORPUS-2 · the predecessor's left items: each line claims what its pool's key bears, never a figure another record denies
  { batch: 2, pool: 'DS-DEF-9::magicDependency true, with a NAMED dependent chain', vid: 1, gone: /part of the shortfall is made up/, now: /the trade that makes it now leans on help beyond ordinary work/, rows: 'C23179 C31319: the chain leans on magic, the food record\'s magic share is 0' },
  { batch: 2, pool: 'DS-DEF-9::magicDependency true, with a NAMED dependent chain', vid: 2, gone: /would fall further short than it already does/, now: /would yield less than it does now/, rows: 'C23179\'s class: imports close the gap' },
  { batch: 2, pool: 'DS-FTH-4::FLAG: crusaderSynthesis', vid: 1, gone: /act as one/, now: /the church has the garrison at its side/, rows: 'C8630: the garrison and the clergy each wish the other quieter (factionStanding)' },
  { batch: 2, pool: 'DS-DEF-2::Beasts & Monsters: frontier, force without a perimeter', vid: 3, gone: /can drive off what attacks/, now: /cannot stop what attacks from arriving/, rows: 'C37257: a watch alone under a critical monster bar' },
  { batch: 2, pool: 'DS-GEN-13::COMMERCE: a market, no guild', vid: 5, gone: /none keeps a house at its market/, now: /anyone trading at its market reckons with them/, rows: 'C54259: the Merchant Guilds list the market among their houses' },
  // BAR3-CORPUS-3 · C4: the organised-crime lines claim what the crime key bears, never a quiet street or an unrobbed visitor under a crime wave
  { batch: 3, pool: 'DS-DEF-4::structure organized', vid: 4, gone: /very little street violence/, now: /what is allowed in the town is theirs to say first/, rows: 'C12393\'s class: organised crime under a crime-wave tension ("Crime is rising faster than those in charge can answer it")' },
  { batch: 3, pool: 'DS-DEF-4::structure organized', vid: 3, gone: /are not robbed/, now: /soon has someone quietly explain/, rows: 'C12393\'s class: a crime wave beside "visitors are not robbed"' },
];

/** @type {Record<string, any>} */ const CORPUS = {};
/** @type {Record<string, string>} */ const LEAF_OF_BLOCK = {};
/** @type {Map<string, object>} */ const FACTS = new Map();
/** @type {{ variantFactDeclaration?: Function, declarationAdmits?: Function }} */ const RULE = {};

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { factsOf } = await import('../../src/domain/facts/factsOf.js');
  const kernel = await import('../../src/domain/display/stateProse/stateProseKernel.js');
  const vocabulary = await import('../../src/domain/facts/factVocabulary.js');
  RULE.variantFactDeclaration = kernel.variantFactDeclaration;
  RULE.declarationAdmits = vocabulary.declarationAdmits;
  for (const desk of ['defense', 'economy', 'power', 'general', 'warFaith']) {
    const leaf = Object.values(await import(`../../src/data/dossierStateProse/${desk}.generated.js`)).find((v) => v && typeof v === 'object');
    for (const [blockId, block] of Object.entries(leaf)) { CORPUS[blockId] = block; LEAF_OF_BLOCK[blockId] = desk; }
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
  const v = pool.find((/** @type {any} */ x) => x.vid === vid);
  expect(v, `${poolKey} has no v${vid}`).toBeTruthy();
  return RULE.declarationAdmits?.(RULE.variantFactDeclaration?.(v), FACTS.get(seed), { crisisScoped }).admitted;
}

describe('BAR3-CORPUS: a cured line is not admitted in the town that made it false', () => {
  for (const g of DECLARED) {
    it(`batch ${g.batch} · ${g.pool} v${g.vid} at ${g.seed}: ${g.why} (v${g.instead} instead)`, () => {
      expect(admitted(g.pool, g.instead, g.seed), `${g.seed} admits no v${g.instead}: re-key the row to a town of the case`).toBe(true);
      expect(admitted(g.pool, g.vid, g.seed), `${g.pool} v${g.vid} is admitted at ${g.seed}`).toBe(false);
    });
  }
});

describe('BAR3-CORPUS: a cured line still prints where it is true', () => {
  for (const g of KEEP) {
    it(`batch ${g.batch} · ${g.pool} v${g.vid} at ${g.seed}: ${g.why}`, () => {
      expect(admitted(g.pool, g.vid, g.seed)).toBe(true);
    });
  }
});

/** A member's own authored text, its {slots} unfilled, read through drawnProse.js. @param {string} poolKey @param {any} v */
function memberText(poolKey, v) {
  const [blockId, ...rest] = poolKey.split('::');
  const slots = Object.fromEntries((v.slots || []).map((/** @type {string} */ name) => [name, `{${name}}`]));
  return variantByVid({ leaf: LEAF_OF_BLOCK[blockId], blockId, poolKey: rest.join('::'), vid: v.vid, slots });
}

describe('BAR3-CORPUS: a reworded line claims no more than every printing town bears', () => {
  for (const g of REWORDED) {
    it(`batch ${g.batch} · ${g.pool} v${g.vid}: ${g.rows}`, () => {
      const [blockId, ...rest] = g.pool.split('::');
      const v = (CORPUS[blockId]?.pools?.[rest.join('::')] || []).find((/** @type {any} */ x) => x.vid === g.vid);
      expect(v, `${g.pool} has no v${g.vid}`).toBeTruthy();
      expect(v.text, `${g.pool} v${g.vid}: the leaf's member is the one drawnProse.js reads by its vid`).toBe(memberText(g.pool, v));
      expect(v.text).toMatch(g.now); // the line is reworded, not removed: it still prints where its pool is drawn
      // anchored: v.text is the live member just matched to its new words and pinned to drawnProse.js above, so a drifted pool reds first
      expect(v.text).not.toMatch(g.gone);
    });
  }
});
