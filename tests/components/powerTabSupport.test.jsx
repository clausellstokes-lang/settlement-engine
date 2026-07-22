/**
 * @vitest-environment jsdom
 *
 * tests/components/powerTabSupport.test.jsx
 *
 * ORDER A (owner 2026-07-22): clicking a power in the Power tab reveals the
 * institutions that stand behind it.
 *
 * THREE-STRATA REWORK (owner order 2026-07-22, "there are powers, there are
 * factions, and there are the relationships between several ... it needs a
 * rework"): the institution-support disclosure now lives on THE POWERS card (the
 * dominant stratum), not on the flat faction row — a faction's roster row carries
 * a compact "holds power" marker instead, so the web is never duplicated. These
 * pins were updated to target the power card accordingly. The two fixture
 * factions carry no `isGoverning`, so both are coup contenders → both are powers.
 * The disclosure is still keyboard-operable end to end:
 *   - the support list is hidden until the POWER CARD is expanded;
 *   - the card is a keyboard-operable disclosure (Enter / Space toggles it, and
 *     aria-expanded tracks state);
 *   - once open, each supporting institution renders with its typed basis line;
 *   - the institution name is itself an interactive link (per ORDER B: institutions
 *     link to their in-context profile, which surfaces the compendium identity).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { SUPPORT_BASIS } from '../../src/domain/dossier/powerSupport.js';

afterEach(cleanup);

// A minimal settlement whose institutions map to two different powers:
//  - Grand Market (economy)  -> aligned under Merchant Guild (top economy faction)
//  - City Barracks (military, factionSource) -> founded under the Watch
// Neither faction is the governing seat, so both present as coup contenders in
// THE POWERS stratum (each gets a power card).
function makeSettlement() {
  return {
    id: 'settlement.testburg',
    name: 'Testburg',
    powerStructure: {
      factions: [
        { faction: 'Merchant Guild', power: 60, category: 'economy', desc: 'The traders who hold the market.' },
        { faction: 'The Watch', power: 40, category: 'military', desc: 'The guards who hold the walls.' },
      ],
    },
    institutions: [
      { name: 'Grand Market', priorityCategory: 'economy' },
      { name: 'City Barracks', priorityCategory: 'military', factionSource: 'The Watch' },
    ],
  };
}

const render_ = () => {
  const s = makeSettlement();
  return render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
};

describe('PowerTab — the institution-support web (on THE POWERS card)', () => {
  it('hides the support list until the power card is expanded', () => {
    render_();
    // The support heading is not present while every power card is collapsed.
    expect(screen.queryByText(/Institutions behind this power/i)).toBeNull();
    expect(screen.queryByText('Grand Market')).toBeNull();
  });

  it('expands on Enter and reveals the supporting institutions with their basis', () => {
    render_();
    const card = screen.getByRole('button', { name: 'Merchant Guild power details' });
    expect(card.getAttribute('aria-expanded')).toBe('false');

    fireEvent.keyDown(card, { key: 'Enter' });

    expect(card.getAttribute('aria-expanded')).toBe('true');
    const detail = document.getElementById(card.getAttribute('aria-controls'));
    expect(detail).toBeTruthy();
    // The aligned institution + its typed basis phrase are shown.
    expect(within(detail).getByText('Grand Market')).toBeTruthy();
    expect(within(detail).getByText(SUPPORT_BASIS.aligned.merchant)).toBeTruthy();
    // Its name is an interactive link (opens the institution's in-context profile,
    // which surfaces the compendium-authored identity). The accessible name is the
    // institution name; the "View ... profile" hint rides the button title.
    const instLink = within(detail).getByRole('button', { name: 'Grand Market' });
    expect(instLink.getAttribute('title')).toMatch(/Grand Market profile/i);
  });

  it('toggles closed on a second Space press', () => {
    render_();
    const card = screen.getByRole('button', { name: 'Merchant Guild power details' });
    fireEvent.keyDown(card, { key: ' ' });
    expect(card.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(card, { key: ' ' });
    expect(card.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('Grand Market')).toBeNull();
  });

  it('lists a founded institution under the faction that raised it', () => {
    render_();
    const card = screen.getByRole('button', { name: 'The Watch power details' });
    fireEvent.click(card);
    const detail = document.getElementById(card.getAttribute('aria-controls'));
    expect(within(detail).getByText('City Barracks')).toBeTruthy();
    expect(within(detail).getByText(SUPPORT_BASIS.founded)).toBeTruthy();
  });
});
