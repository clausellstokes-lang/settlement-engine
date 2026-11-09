/**
 * @vitest-environment jsdom
 *
 * tests/components/powerGovernanceAccount.test.jsx — OWNER-WORDS-DOSSIER item 3 on the page: under "Who
 * runs this place?" the governance block is ONE paragraph (domain/display/governanceAccount.js), the
 * legitimacy figure and its chips stay as data, and the three disconnected pieces are gone — the DS-POW-1
 * reading, the DS-POW-2 hall line and the standalone vignette.
 */
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup, within } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { governanceAccountOf } from '../../src/domain/display/governanceAccount.js';
import { powerStateProse } from '../../src/domain/display/stateProse/powerStateProse.js';

afterEach(cleanup);
beforeAll(() => {
  if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  }
});

const COUNCIL = 'Corrupt Council';
const VIGNETTE = 'Two powers have stopped coming to Corrupt Council meetings. Each makes its own decisions now, and the others overturn them within days.';
const town = (relationships) => ({
  id: 'settlement.polaovo', name: 'Polaovo', tier: 'town', _seed: 'polaovo',
  npcs: [{ id: 'npc_seat', name: 'Boleslav Davydov', role: 'the first councillor', category: 'government', memberships: [{ power: COUNCIL, rank: 1 }] }],
  powerStructure: {
    governingName: COUNCIL,
    factions: [
      { faction: COUNCIL, power: 30, category: 'criminal', isGoverning: true },
      { faction: "Thieves' Guild", power: 25, category: 'criminal' },
      { faction: 'Religious Authorities', power: 20, category: 'religious' },
    ],
    factionRelationships: relationships,
    publicLegitimacy: { score: 16, label: 'Legitimacy Crisis', breakdown: { prosperity: -20, safety: -12, defense: -1, food: 0 }, governanceFractured: true },
    stability: 'Fractured — no stable governing authority',
    recentConflict: VIGNETTE,
  },
});
const tab = (s) => render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);

describe('the governance block is one paragraph', () => {
  it('two estranged powers: the paragraph names them, and no DS-POW-1/2 sentence or standalone vignette prints', () => {
    const s = town([
      { pair: [COUNCIL, "Thieves' Guild"], type: 'corrupted', captureState: 'corrupted' },
      { pair: [COUNCIL, 'Religious Authorities'], type: 'tense' },
    ]);
    const { getByTestId, container } = tab(s);
    const block = getByTestId('power-governance-account');
    expect(block.textContent).toBe(governanceAccountOf(s).text);
    expect(block.textContent).toContain("The Thieves' Guild has bought people inside the hall.");
    const page = container.textContent || '';
    // The figure stays as data: the score, the band and the breakdown chips.
    expect(page).toContain('Public legitimacy');
    expect(page).toContain('Legitimacy Crisis');
    expect(page).toContain('Prosperity -20');
    // The three pieces are gone: the desk's own legitimacy and hall readings, and the vignette.
    const desk = powerStateProse(s, {}, { seed: 'polaovo', audience: 'dm' });
    for (const rung of [desk.legitimacyBanner, desk.legitimacyLens, desk.stabilityHeader]) {
      if (rung?.sentence) expect(page, 'a DS-POW-1/2 sentence still prints').not.toContain(rung.sentence);
    }
    expect(desk.legitimacyBanner?.sentence, 'non-vacuity: the desk still draws its reading').toBeTruthy();
    expect(page.split(VIGNETTE).length - 1, 'the vignette is not the fallback here').toBe(0);
    expect(page).not.toMatch(/two of the three|the gap widens|does not occupy/i);
  });

  it('no estranged power: the vignette closes the paragraph, once', () => {
    const s = town([]);
    const { getByTestId, container } = tab(s);
    const block = getByTestId('power-governance-account');
    expect(block.textContent.endsWith(VIGNETTE)).toBe(true);
    expect((container.textContent || '').split(VIGNETTE).length - 1).toBe(1);
    expect(within(block).queryByText(/faction/i)).toBeNull();
  });
});
