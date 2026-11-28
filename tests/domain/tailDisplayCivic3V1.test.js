/**
 * TAIL-DISPLAY-CIVIC-3 · V1 (the chair's ruling of 2026-11-15): A POWER NAMED IN A SENTENCE TAKES ITS FORM FROM THE ONE
 * LEAF (`src/domain/display/powerSentenceName.js`: "Military/Guard" reads "The Guard"). The power desk's pools
 * (stateProse/powerStateProse.js), the general and faith desks' {faction} slots, and the Power tab's governance account
 * (display/governanceAccount.js :: powerNameInProse) printed the roster's label raw: by the census's 720 at cb4ae58f0, 80
 * distinct tab sentences in 168 printings held a slashed label. A slot after the pool's own article ("the {seat}", "the
 * {faction}") takes the form with its "The" struck (powerNameAfterArticle): "the Guard", never "the The Guard". A chip or a
 * rank line keeps the roster's label (the leaf's contract): the kept pairs below include the Ladder's chip rows.
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs :: cfgFor); every cured pair red at the base.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { powerDeskRead, powerDeskReadings, governanceAccountRead, powerLadderRead } from '../../src/components/new/powerDeskRead.js';
import { powerNameAfterArticle, powerNameWithArticle, powerSentenceName } from '../../src/domain/display/powerSentenceName.js';
import { variantByVid } from '../helpers/drawnProse.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed the census's seed: r2r-<size>-<n> or r2s-<stress>-<size>-<n> */
const cfgFor = (seed) => {
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (s) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [s[1]], selectedStressesRandom: false, settType: s[2] });
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] });
};
/** @param {unknown} v @param {string[]} out @returns {string[]} every string the reading holds */
const strings = (v, out = []) => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
  return out;
};
/** @param {string} seed @returns {string} the power desk's, the ladder's and the governance account's text, joined */
const textOf = (seed) => {
  const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
  const ladders = (s.powerStructure?.factions || []).map((f) => powerLadderRead(s, { factionName: f.faction }));
  return strings([powerDeskRead(s, { readings: powerDeskReadings(s) }), governanceAccountRead(s), ladders]).join('\n');
};

/**
 * Two of the pairs are drawn power-desk sentences: COMPUTED through tests/helpers/drawnProse.js (TAIL-CLOSE-TESTS-C), each
 * vid filled once with the roster's raw label (what must not print) and once with the leaf's form (what prints), so a
 * rewording moves the member and the anchor together. The slots ahead of the named power are a sentinel and the anchor is
 * the clause after it: the pair's claim is the power's form, not the town's name or seat.
 * @param {string} blockId @param {string} poolKey @param {number} vid @param {Record<string, string>} slots
 */
const clauseAfterSentinel = (blockId, poolKey, vid, slots) => {
  const text = variantByVid({ leaf: 'power', blockId, poolKey, vid, slots });
  return text.slice(text.lastIndexOf('\u0000') + 1).trim();
};
const S0 = '\u0000';
const POW6 = /** @param {string} f */ (f) => clauseAfterSentinel('DS-POW-6', 'GM ADVISORY: the commander is a political actor', 4, { seat: S0, settlement: S0, faction: f });
const POW4 = /** @param {string} c */ (c) => clauseAfterSentinel('DS-POW-4', 'riskLabel: Contested', 4, { settlement: S0, counterpart: c, faction: 'the Merchant Guild Council' }); // NAMES-1 (CN1): the article
// Re-keyed BY IDENTITY (TAIL-CLOSE-DISPLAY-2, red 9): r2r-metropolis-50's pair is DS-POW-4 Critical v1, which
// TAIL-CORPUS-DEF-2 reworded (51217c0e, DECLARED: "the office no longer shields the seat; no slot as a verb's subject")
// on the joined line before this guard joined it: the same town, the same vid, computed as the two above.
const POW4C = /** @param {string} c */ (c) => clauseAfterSentinel('DS-POW-4', 'riskLabel: Critical. The seat could fall', 1, { seat: S0, settlement: S0, counterpart: c });
// THE FLIP (CLOSE-6 F-FORTUNE-2, 2026-11-23): the sentence-start "answers to" pair is DS-POW-6's GM ADVISORY v3, a drawn sentence
// whose named power LEADS it: the anchor is the clause BEFORE the sentinel (the power and the hall it answers to), computed as
// the three above. @param {string} c the power @param {string} seat the hall
const POW6A = (/** @type {string} */ c, /** @type {string} */ seat) => {
  const text = variantByVid({ leaf: 'power', blockId: 'DS-POW-6', poolKey: 'GM ADVISORY: the commander is a political actor', vid: 3, slots: { faction: c, seat, settlement: S0 } });
  return text.slice(0, text.indexOf(S0)).replace(/ at$/, '').trim();
};
// [seed, the sentence that must not print, what prints instead]
const CURED = [
  ['r2r-city-44', 'The Military/Guard takes its orders no longer.', 'The Guard takes its orders no longer.'],
  // RE-PICKED BY THE PREMISE (THE FLIP, CLOSE-6 F-FORTUNE, 2026-11-23): lit, r2r-hamlet-18 holds its Military/Guard on the roster
  // and no sentence names it; r2r-hamlet-10 is the lowest r2r-hamlet of the census's 60 whose text names the Guard in a
  // sentence (10, 27), and it prints the row's own pair (was r2r-hamlet-18)
  ['r2r-hamlet-10', 'The Military/Guard is at odds with it.', 'The Guard is at odds with it.'],
  // RE-PICKED BY THE PREMISE (THE FLIP, CLOSE-6 F-FORTUNE-2, 2026-11-23; CLOSE-6's ruling): the case is the hall-as-subject form.
  // Lit, r2r-city-37 no longer prints it, nor any r2r-city of 200; r2r-town-7 is the lowest census r2r seed that prints the
  // pair (town 7, 111, 188; metropolis 69 ...). The original pair kept (was r2r-city-37)
  ['r2r-town-7', 'The hall is at odds with the Military/Guard.', 'The hall is at odds with the Guard.'],
  // point 124 (the arrangement keys on the town's id): r2r-village-50 now names its two estranged powers as the subject; the pair
  // in that arrangement (was 'The hall is at odds with the Military/Guard and the Religious Authorities.' / '... the Guard and ...')
  ['r2r-village-50', 'The Military/Guard and the Religious Authorities are at odds with it.', 'The Guard and the Religious Authorities are at odds with it.'],
  // point 124: r2r-town-27 and r2r-hamlet-128 swapped DS-POW-6's two forms under the id key; each row keeps its own form and moves
  // to the town that prints it (was r2r-town-27 here, r2r-hamlet-128 in the "answers to" row below)
  ['r2r-hamlet-128', POW6('Military/Guard'), POW6(powerNameWithArticle('Military/Guard'))], // NAMES-1 (CN1): the article
  ['r2r-city-37', POW4('Military/Guard'), POW4(powerNameWithArticle('Military/Guard'))], // NAMES-1 (CN1): the article
  ['r2r-metropolis-50', POW4C('Military/Guard'), POW4C(powerNameWithArticle('Military/Guard'))], // NAMES-1 (CN1): the article
  // RE-PICKED BY THE PREMISE (THE FLIP, CLOSE-6 F-FORTUNE-2, 2026-11-23; CLOSE-6's ruling): the case is the sentence-start
  // "answers to" form. Lit, r2r-hamlet-27's Guard no longer answers to the hall; r2r-hamlet-128 is the lowest r2r-hamlet of 200
  // that prints it (128, 143), its hall the Feudal Stewardship (was r2r-hamlet-27, 'Military/Guard answers to the Elder Council')
  ['r2r-town-27', POW6A('Military/Guard', 'Feudal Appointee'), POW6A(powerSentenceName('Military/Guard'), 'Feudal Appointee')], // the leaf's sentence-start form: the power leads (point 124: was r2r-hamlet-128, its hall the Feudal Stewardship)
  ['r2r-metropolis-8', 'Noble Claimant (Senior Line) and Noble Claimant (Reform Line) contend for it.', 'The Senior Line and the Reform Line contend for it.'],
  ['r2r-metropolis-39', 'Bloc will back whichever side meets its price.', 'The Neutrals will back whichever side meets their price.'],
];
// [seed, a true sibling that must still print]
const KEPT = [
  ['r2r-town-27', 'Feudal Appointee'],
  ['r2r-city-37', 'Merchant Guild Council'],
];
const TEXT = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...CURED, ...KEPT].map((r) => r[0]))) TEXT.set(seed, textOf(seed));
}, 900000);

describe('V1: a power named in a sentence takes the one leaf\'s form', () => {
  test('the leaf: the article-led form strikes its own "The"; a name without one is unchanged', () => {
    expect(powerNameAfterArticle('Military/Guard')).toBe('Guard');
    expect(powerNameAfterArticle('The Peerage')).toBe('Peerage');
    expect(powerNameAfterArticle('Monster Hunters / Adventurers')).toBe('Monster Hunters');
    expect(powerNameAfterArticle('Elder Council')).toBe('Elder Council');
    expect(powerSentenceName('Military/Guard')).toBe('The Guard');
  });
  test('CURED (every row) seed: the slashed sentence does not print; what prints instead does', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([seed, gone, instead]) => {
      const t = TEXT.get(seed);
      expectAbsentWithAnchor(t, gone, instead, seed);
      // anchored: the helper call above shows the cured sentence prints in this text
      expect(t).not.toMatch(/\bthe The\b/i);
    }), 'CURED: each seed prints the leaf\'s form, never the slashed label nor "the The"');
  });
  test('KEPT (every row) seed: the true sibling still prints', () => {
    expectNoSeedFailures(collectSeedFailures(KEPT, ([seed, kept]) => {
      expect(TEXT.get(seed)).toContain(kept);
    }), 'KEPT: each seed still prints its true sibling');
  });
});
