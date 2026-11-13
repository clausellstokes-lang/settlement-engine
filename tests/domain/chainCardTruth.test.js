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
