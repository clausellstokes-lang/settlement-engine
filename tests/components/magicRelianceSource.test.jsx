/** @vitest-environment jsdom */
/**
 * magicRelianceSource.test.jsx — the Magic tab's reliance line names where the magic comes from (W2-A-LEAVES,
 * 2026-11-12; census row 3, the chair's ruling: "read from the leaf; where nothing supplies it, the reliance line
 * does not print").
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';

const WORLD = { magicExists: true, priorityMagic: 66, magicLevel: 'high' };
/** @param {object} over */
const town = (over) => ({ id: 't', name: 'Ashby', tier: 'city', population: 9000, config: WORLD, npcs: [], powerStructure: { factions: [] }, ...over });
const HEALING = { chainId: 'divine_healing', label: 'Divine & Magical Healing', processingInstitutions: ['Parish church', 'Multiple monasteries'] };
/** @param {object} settlement */
const relianceOf = (settlement) => render(<MagicTab settlement={settlement} />).container.querySelector('[data-testid="magic-reliance"]');

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((query) => ({ media: query, matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} }));
});
afterEach(cleanup);

describe('row 3: the reliance line names its source, or does not print', () => {
  test('relied upon with no practitioner: the houses that supply the dependent chain are named', () => {
    const line = relianceOf(town({ institutions: [{ name: 'Parish churches (10-30)' }, { name: 'Multiple monasteries' }], economicState: { activeChains: [HEALING] } }));
    // re-keyed (W2-A-LEAVES-2, REVIEW-W2A F2): each house is the ROSTER's ("Parish churches (10-30)") through the
    // display seam, its count struck — no longer the chain's catalogue pattern ("Parish church")
    expect(line?.textContent).toBe('Reliance on magic: Relied upon · supplied by Houses of worship and Multiple monasteries');
  });
  test('nothing on the record supplies it: the reliance line does not print, and the roles still do', () => {
    const settlement = town({ institutions: [{ name: 'Subsistence farming' }], economicState: { activeChains: [{ chainId: 'spellcasting', label: 'Spellcasting Services' }] } });
    expect(relianceOf(settlement)).toBeNull();
    cleanup();
    expect(render(<MagicTab settlement={settlement} />).container.textContent).toContain('Economic role');
  });
  test('the people who practise: one by name, more than one counted; every house by name', () => {
    const chain = { chainId: 'spellcasting', label: 'Spellcasting Services' };
    const npcs = ['Ada', 'Bram', 'Cora', 'Dov'].map((name) => ({ name, role: 'Hedge Witch' }));
    expect(relianceOf(town({ npcs, institutions: [], economicState: { activeChains: [chain] } }))?.querySelector('[data-testid="magic-reliance-source"]')?.textContent)
      .toBe(' · supplied by 4 practitioners');
    cleanup();
    expect(relianceOf(town({ npcs: npcs.slice(0, 1), institutions: [{ name: 'Parish churches (10-30)' }], economicState: { activeChains: [HEALING, chain] } }))?.querySelector('[data-testid="magic-reliance-source"]')?.textContent)
      // re-keyed (W2-A-LEAVES-2, REVIEW-W2A F2): this roster has no monastery, and the chain's catalogue pattern
      // "Multiple monasteries" is no longer printed as if it stood here; the roster's house through the display seam
      .toBe(' · supplied by Houses of worship and Ada');
  });
  test('no reliance: the word alone, no source clause', () => {
    const line = relianceOf(town({ institutions: [], npcs: [{ name: 'Ada', role: 'Hedge Witch' }], economicState: { activeChains: [] } }));
    expect(line?.textContent).toBe('Reliance on magic: Present');
  });
});
