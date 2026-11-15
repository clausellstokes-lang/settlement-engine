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
import { powerNameAfterArticle, powerSentenceName } from '../../src/domain/display/powerSentenceName.js';
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

// [seed, the sentence that must not print, what prints instead]
const CURED = [
  ['r2r-city-44', 'The Military/Guard takes its orders no longer.', 'The Guard takes its orders no longer.'],
  ['r2r-hamlet-18', 'The Military/Guard is at odds with it.', 'The Guard is at odds with it.'],
  ['r2r-city-37', 'The hall is at odds with the Military/Guard.', 'The hall is at odds with the Guard.'],
  ['r2r-village-50', 'The hall is at odds with the Military/Guard and the Religious Authorities.', 'The hall is at odds with the Guard and the Religious Authorities.'],
  ['r2r-town-27', 'goes ahead if Military/Guard refuses it', 'goes ahead if The Guard refuses it, and whoever can win The Guard over can steer the place.'],
  ['r2r-city-37', 'stay polite to Military/Guard as well as to', 'stay polite to The Guard as well as to Merchant Guild Council'],
  ['r2r-metropolis-50', 'Military/Guard has the strength', 'The Guard has the strength, and the Grand Council has only the office.'],
  ['r2r-hamlet-27', 'Military/Guard answers to the Elder Council', 'The Guard answers to the Elder Council'],
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
  test.each(CURED)('%s: "%s" does not print; "%s" does', (seed, gone, instead) => {
    const t = TEXT.get(seed);
    expectAbsentWithAnchor(t, gone, instead, seed);
    // anchored: the helper call above shows the cured sentence prints in this text
    expect(t).not.toMatch(/\bthe The\b/i);
  });
  test.each(KEPT)('%s: "%s" still prints', (seed, kept) => {
    expect(TEXT.get(seed)).toContain(kept);
  });
});
