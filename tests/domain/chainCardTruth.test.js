/**
 * THE CHAIN CARD SAYS ONLY WHAT ITS ONE READ CAN MAKE TRUE (R2-CODE-B-SIDE; the round-three cut's #1375 HIGH,
 * #791, #1256, #448, #630, #793, #800, #1255, #367, #703 and the increment's rww-metropolis-under_siege-1).
 *
 * The card (SupplyChainsPanel.jsx :: chainFlowFacts on Economics and in the Compendium; SupplyChainFlow.jsx in
 * the PDF) is handed one chain and the roster's names. The generator's upstream note
 * (generators/computeActiveChains.js) is written from the OTHER chains' states and from which chain ids are
 * active, never from the town's grounds or its houses, and the card cannot read either back: on the census's
 * 720 births, 337 of 432 "Needs imported X: no local source" notes stand beside the town's own source of X
 * (its quarry, its hunting grounds, its potter), 149 of 175 "Upstream X chain is impaired" name a chain that is
 * only vulnerable, 47 of 55 "… disrupted" and 5 of 24 "Dependent on stressed upstream" name a chain that is
 * neither. No one read the card holds makes them true, so the note leaves the card (the chair's ruling).
 * The chain rows below are the births' own rows.
 */
import { describe, expect, test } from 'vitest';
import { chainFlowFacts } from '../../src/components/new/SupplyChainsPanel.jsx';
import { chainHousesOf } from '../../src/domain/display/chainHouses.js';

// r2r-metropolis-29 :: News & Public Information (cartography is Vulnerable on the same tab).
const NEWS = {
  chainId: 'news_information', label: 'News & Public Information', status: 'vulnerable',
  upstreamChains: ['cartography'], resource: null, processingInstitutions: ['Message Network'],
  outputs: ['News and information'], upstreamNote: 'Upstream cartography chain is impaired', upstreamWeak: ['cartography'],
};
// r2r-hamlet-16 :: Fortifications, beside the hamlet's own Stone quarry.
const WALLS = {
  chainId: 'fortification', label: 'Fortifications', upstreamChains: ['stone'], resource: 'Stone quarry',
  resourceKey: 'stone_quarry', resourceCondition: 'available', resourceInputAvailable: true,
  processingInstitutions: ['Palisade'], outputs: [], status: 'vulnerable',
  upstreamNote: 'Needs imported stone: no local source', upstreamMissing: ['stone'],
};

describe('the upstream note leaves the card (item 1)', () => {
  test('"Upstream cartography chain is impaired" beside a cartography chain that is only vulnerable', () => {
    expect(chainFlowFacts(NEWS, ['Message Network']).upstreamNote).toBeNull();
  });
  test('"Needs imported stone: no local source" beside the hamlet\'s own Stone quarry', () => {
    expect(chainFlowFacts(WALLS, ['Palisade']).upstreamNote).toBeNull();
  });
  test('the guard: the card keeps its ground and its house', () => {
    const facts = chainFlowFacts(WALLS, ['Palisade']);
    expect(facts.resource).toBe('Stone quarry');
    expect(facts.institutions.map((h) => h.name)).toEqual(['Palisade']);
  });
});

// r2r-city-51 :: Glass & Print (the From line read "Import: Clay & Ceramics"; the record buys in "Clay and raw materials").
const GLASS = {
  chainId: 'glass_print', label: 'Glass & Print', status: 'vulnerable', upstreamChains: ['clay'], resource: null,
  processingInstitutions: ['Glassblower'], outputs: ['Glassware'],
  upstreamNote: 'Needs imported clay: no local source', upstreamMissing: ['clay'],
};

describe('a chain\'s category is not a good on the From line (item 2)', () => {
  test('no "Import: <a chain\'s label>": the card is not handed the goods the town buys in', () => {
    expect(chainFlowFacts(GLASS, ['Glassblower']).importedUpstream).toEqual([]);
    expect(chainFlowFacts(WALLS, ['Palisade']).importedUpstream).toEqual([]);
  });
  test('the guard: a ground the town holds stays the From line', () => {
    expect(chainFlowFacts(WALLS, ['Palisade']).resource).toBe('Stone quarry');
  });
});

describe('the card names the roster\'s houses that do the work, never a template name (item 3)', () => {
  test('#506 HIGH / #1370 HIGH: two catalogue ranks the town lacks read as the one house it holds', () => {
    // rr2s-metropolis-plague_onset-port-1's Spices & Dyes over a roster of Merchant guilds (50-100+) and Major annual fairs.
    expect(chainHousesOf(['Merchant guilds (3-8)', 'Merchant guilds (15-40)', 'Luxury goods quarter', 'Annual fair'],
      ['Merchant guilds (50-100+)', 'Luxury goods quarter', 'Major annual fairs']).map((h) => h.name))
      .toEqual(['Merchant guilds', 'Luxury goods quarter', 'Major annual fairs']);
  });
  test('#368: the town\'s one charter hall is named once, and no "Adventurers\' guild" it lacks', () => {
    expect(chainHousesOf(["Adventurers' charter hall", "Adventurers' guild"], ["Adventurers' charter hall"]).map((h) => h.name))
      .toEqual(["Adventurers' charter hall"]);
  });
  test('the increment: a house of the same trade under another name is the house named', () => {
    expect(chainHousesOf(['Great library', "Cartographer's guild", 'Message Network'], ["Cartographer's workshop"]).map((h) => h.name))
      .toEqual(["Cartographer's workshop"]);
  });
  test('a trade is read from the start of a word: "Mill" is not the sawmill', () => {
    expect(chainHousesOf(['Maltster', 'Mills (2-5)', 'Mill', 'Access to external mill'], ['Mills (2-5)', 'Sawmill (commercial)']).map((h) => h.name))
      .toEqual(['Mills']);
  });
  test('the guard (ruling (e)): a hamlet that only reaches a mill elsewhere is named by its own row', () => {
    expect(chainHousesOf(['Maltster', 'Mills (2-5)', 'Mill', 'Access to external mill'], ['Access to external mill', 'Dwellings']).map((h) => h.name))
      .toEqual(['Access to external mill']);
  });
  test('every house named is on the roster, so none is marked missing', () => {
    expect(chainHousesOf(['Smelter', 'Foundry'], ['Smelter'])).toEqual([{ name: 'Smelter', present: true }]);
  });
});
