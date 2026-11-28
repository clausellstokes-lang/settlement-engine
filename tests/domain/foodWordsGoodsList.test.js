/**
 * tests/domain/foodWordsGoodsList.test.js — F3 FOOD-WORDS unit 2a (the chair's ruling,
 * 2026-11-04): an export list is a list of GOODS, not a sentence about the table, so the
 * food-words check does not read it; and "Game meat" names the game source, not livestock.
 * soak1k-20 (a secure village that hunts) printed "… Game meat … Preserved foods Meals and drink"
 * and the check read it as a livestock claim. Hand-built records only.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { foodWordsFindings } from '../../src/domain/coherence/foodWordsFindings.js';
import { composeFoodwaysLine, sourcesNamedIn } from '../../src/domain/foodways.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const EXPORTS = ['Furs and pelts', 'Game meat', 'Hunting trophies', 'Leather goods', 'Preserved foods', 'Meals and drink'];
/** @param {object} foodRecord @param {string[]} [primaryExports] */
const place = (foodRecord, primaryExports = EXPORTS) => ({ economicState: { primaryExports, foodSecurity: { foodRecord } } });
const SECURE_HUNTERS = { band: 'secure', growsMoreThanEats: true, storageMonths: 2.1, foodSources: ['game'] };
const FAMINE = { band: 'famine', growsMoreThanEats: false, storageMonths: 0.2, foodSources: ['grain'] };

describe('an export list is goods, not a sentence', () => {
  it('the Economics tab list (goods run together) does not flag on a secure place', () => {
    expect(foodWordsFindings(place(SECURE_HUNTERS), EXPORTS.join(' '))).toEqual([]);
  });
  it('the Foundry row ("- **Exports:** a, b") does not flag on a secure place', () => {
    expect(foodWordsFindings(place(SECURE_HUNTERS), `- **Exports:** ${EXPORTS.join(', ')}`)).toEqual([]);
  });
  it('a list with one word that is not an export is still read', () => {
    const text = `${EXPORTS.join(' ')} and cheese for every table`;
    expect(foodWordsFindings(place(SECURE_HUNTERS), text).map((f) => f.code)).toEqual(['source_not_held']);
  });
  it('prose that claims plenty on a famine place still flags', () => {
    const codes = foodWordsFindings(place(FAMINE), 'The fields bring in a grain surplus and the table never wants for meat.').map((f) => f.code);
    expect(codes).toEqual(['surplus_without_surplus', 'source_not_held']);
  });
});

describe('"Game meat" is game', () => {
  it('names the game source, not livestock', () => {
    expect(sourcesNamedIn('Game meat')).toEqual(['game']);
    expect(sourcesNamedIn('salted meat and milk')).toEqual(['livestock']);
  });
  it('a sentence about game meat on the table does not flag a hunting place', () => {
    expect(foodWordsFindings(place(SECURE_HUNTERS), 'Game meat is the mainstay of the table.')).toEqual([]);
  });
});

// R3-CODE-C-3 (ROUND-3-CUT-INCREMENT #ww-707, rww-thorp-monster_pressure-1, Systems/Economics): the culture's flavour
// "Public ovens, neighborhood vendors, and shared dining customs make food distribution visibly civic." printed in a
// thorp of 28 whose Overview says "No market or fair stands". Its sellers are a market's people: the line stands only
// where the market home says a market does.
describe('a culture line naming sellers stands only where a market does', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const OVENS = 'Public ovens, neighborhood vendors, and shared dining customs make food distribution visibly civic.';
  it('no market: the sellers line is refused, a line naming no source or seller is kept', () => {
    const line = composeFoodwaysLine({ sources: ['livestock'], cultureLines: [OVENS], identity: 'thorp|28', market: false });
    const withMarket = composeFoodwaysLine({ sources: ['livestock'], cultureLines: [OVENS], identity: 'thorp|28', market: true });
    expectPresentThenAbsent(withMarket, line, 'vendors', 'the sellers line stands with a market and is refused without one');
    expect(composeFoodwaysLine({ sources: [], cultureLines: [OVENS], identity: 'thorp|28', market: false })).toBe('Meals follow the season and what the household has put by.');
  });
  it('THE GUARD TOWN rww-thorp-monster_pressure-1 (no market): its foodways line names no vendor', () => {
    const seed = 'rww-thorp-monster_pressure-1';
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'thorp', selectedStressesRandom: false, selectedStresses: ['monster_pressure'], _randomizePriorities: true }), null, { seed, customContent: {} });
    const foodways = s.economicState?.foodSecurity?.foodRecord?.foodwaysLine;
    expect(typeof foodways === 'string' && foodways.trim().length > 0, 'the guard town prints a foodways line').toBe(true);
    // anchored: the town's foodways line is asserted a printed, non-empty string on the line above, so an absent line reds there
    expect(foodways).not.toMatch(/vendors|Public ovens/);
  });
});
