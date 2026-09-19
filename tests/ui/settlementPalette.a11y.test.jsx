/**
 * @vitest-environment jsdom
 *
 * tests/ui/settlementPalette.a11y.test.jsx — F28 slice 2 guard.
 *
 * The palette card advertised role="button" + tabIndex=0 + aria-label
 * "Drag NAME onto the map" but wired only onDragStart — so a keyboard user
 * was promised an action they could not perform (the map is an untabbable
 * iframe; placement is a pointer drag resolved at a screen coordinate).
 *
 * The honest fix: the card's aria-label no longer commands an impossible
 * drag, and Enter/Space performs a REAL action — it selects the settlement
 * and announces placement guidance into an aria-live region.
 *
 * E-I (bar 9) upgraded the contract this file pins: on a PLACEABLE card
 * (active campaign, not yet placed) Enter now ARMS the keyboard placement
 * session (onKeyboardPlace → the stage's lazy overlay; arrows steer, Enter
 * commits through the store gate). The blocked cases keep announcing their
 * honest reason — "already placed" / "select a campaign" — and an isolated
 * mount without the stage keeps the pointer guidance.
 */

import React from 'react';
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, act } from '@testing-library/react';

// SettlementPalette pulls setSelectedBurgId / hover setters off the store; the
// locked gate reads setActivePricingMoment off getState when a control is used.
const storeState = {
  setSelectedBurgId: vi.fn(),
  setHoveredSettlementId: vi.fn(),
  clearHoveredSettlementId: vi.fn(),
  setActivePricingMoment: vi.fn(),
};
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeState);
  useStore.getState = () => storeState;
  return { useStore };
});

// The post-launch (open) behaviour of the gate's tier door. Its pre-launch
// closed state is pinned in tests/components/launchLock.upsells.test.jsx.
vi.mock('../../src/lib/launchGate.js', async (importOriginal) => ({
  ...(await importOriginal()), purchasesOpen: () => true,
}));

import SettlementPalette from '../../src/components/map/SettlementPalette.jsx';
import { REALM_GATE_HEADING, REALM_GATE_VALUE_LINES } from '../../src/components/map/RealmLockedGate.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

afterEach(cleanup);

const SAVES = [{ id: 's1', name: 'Springhaven', tier: 'Town', settlement: { population: 1200, tier: 'Town' } }];

describe('F28 slice 2 — SettlementPalette keyboard honesty', () => {
  test('an unplaced card no longer promises a keyboard-impossible drag', () => {
    render(<SettlementPalette saves={SAVES} placements={{}} />);
    const card = screen.getByRole('button', { name: /Springhaven/i });
    expect(card.getAttribute('aria-label')).toMatch(/Press Enter for placement options/i);
    expect(card.getAttribute('aria-label')).not.toMatch(/Drag .* onto the map/i);
  });

  test('the card is keyboard-focusable (tabIndex 0) and draggable for pointer users', () => {
    render(<SettlementPalette saves={SAVES} placements={{}} />);
    const card = screen.getByRole('button', { name: /Springhaven/i });
    expect(card.getAttribute('tabindex')).toBe('0');
    expect(card.getAttribute('draggable')).toBe('true');
  });

  test('with no campaign, Enter announces the honest blocker in the live region', () => {
    const { container } = render(<SettlementPalette saves={SAVES} placements={{}} />);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live.textContent).toMatch(/Drag a card onto the map/i); // default hint
    fireEvent.keyDown(screen.getByRole('button', { name: /Springhaven/i }), { key: 'Enter' });
    expect(live.textContent).toMatch(/Springhaven selected/i);
    // Fix wave 4 (idx28): the hint leads with the real keyboard outcome (the
    // overview peek) and never dead-ends on "isn't available".
    expect(live.textContent).toMatch(/overview is showing beside the map/i);
    expect(live.textContent).toMatch(/Select a campaign to place it/i);
    expect(live.textContent).not.toMatch(/isn't available/i);
  });

  test('E-I: on a placeable card, Enter ARMS the keyboard placement session', () => {
    const onKeyboardPlace = vi.fn();
    const { container } = render(
      <SettlementPalette
        saves={SAVES} placements={{}}
        activeCampaign={{ id: 'camp-1', name: 'The March' }}
        onKeyboardPlace={onKeyboardPlace}
      />,
    );
    fireEvent.keyDown(screen.getByRole('button', { name: /Springhaven/i }), { key: 'Enter' });
    expect(onKeyboardPlace).toHaveBeenCalledTimes(1);
    expect(onKeyboardPlace.mock.calls[0][0]).toMatchObject({ id: 's1', name: 'Springhaven' });
    // The session owns the follow-up announcements; the palette must not
    // simultaneously announce the stale pointer dead-end.
    expect(container.querySelector('[aria-live="polite"]').textContent)
      .not.toMatch(/mouse or touch/i);
  });

  test('an isolated mount (no stage wiring) keeps honest pointer guidance on Space', () => {
    const { container } = render(
      <SettlementPalette saves={SAVES} placements={{}} activeCampaign={{ id: 'camp-1', name: 'The March' }} />,
    );
    fireEvent.keyDown(screen.getByRole('button', { name: /Springhaven/i }), { key: ' ' });
    const live = container.querySelector('[aria-live="polite"]');
    expect(live.textContent).toMatch(/Springhaven selected/i);
    expect(live.textContent).toMatch(/mouse or touch/i);
  });

  test('E-I: the palette exposes its live region as the placement announcer (announcerRef)', () => {
    const announcerRef = { current: null };
    const { container, unmount } = render(
      <SettlementPalette saves={SAVES} placements={{}} announcerRef={announcerRef} />,
    );
    expect(typeof announcerRef.current).toBe('function');
    act(() => announcerRef.current('Springhaven placed on the map.'));
    expect(container.querySelector('[aria-live="polite"]').textContent)
      .toMatch(/Springhaven placed on the map/i);
    unmount();
    expect(announcerRef.current).toBeNull();
  });

  test('an already-placed card labels its state instead of a drag command', () => {
    render(<SettlementPalette saves={SAVES} placements={{ b1: { settlementId: 's1' } }} />);
    const card = screen.getByRole('button', { name: /Springhaven/i });
    expect(card.getAttribute('aria-label')).toMatch(/already placed on the map/i);
  });
});

// ── THE DESKTOP REALM GATE (2026-09-18) ──────────────────────────────────────
// An anon or free viewer can hold no campaign at all (useWorldMapCampaignModel
// hands them an empty list), yet the palette invited them to "Start a campaign"
// behind a button whose only outcome was a toast naming an upgrade with no way
// to reach one. The phone had been honest about this since the mobile gate
// landed. Now the desk shows the SAME card — literally the same component.
describe('the desktop Realm gate for a non-entitled viewer', () => {
  test('an anonymous viewer gets the honest gate, not a campaign invitation', () => {
    const onNavigate = vi.fn();
    render(
      <SettlementPalette
        saves={[]} placements={{}}
        canManageCampaigns={false} tier="anon"
        onNavigate={onNavigate}
        onCreateCampaign={vi.fn()}
      />,
    );

    expect(screen.getByTestId('realm-palette-locked')).toBeTruthy();
    expect(screen.getByText(REALM_GATE_HEADING)).toBeTruthy();
    // anchored: the gate above IS on screen, so a missing invitation is a withheld one rather than an empty palette
    expect(screen.queryByText(/Start a campaign to place settlements/i)).toBeNull();
    // anchored: same live gate; the dead-end control is gone, not merely unfound
    expect(screen.queryByRole('button', { name: /Create a campaign/i })).toBeNull();
    // It never claims that signing in unlocks the Realm.
    expect(screen.queryByRole('button', { name: /unlock the Realm/i })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /^See Cartographer$/ }));
    expect(onNavigate).toHaveBeenCalledWith('pricing');
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/ }));
    expect(onNavigate).toHaveBeenCalledWith('signin');
  });

  test('a free viewer gets the tier door and no sign-in door', () => {
    const onNavigate = vi.fn();
    render(
      <SettlementPalette
        saves={[]} placements={{}}
        canManageCampaigns={false} tier="free"
        onNavigate={onNavigate}
        onCreateCampaign={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /^See Cartographer$/ })).toBeTruthy();
    // anchored: the tier door above proves the gate rendered, so the absent sign-in door is a tier decision
    expect(screen.queryByRole('button', { name: /^Sign in$/ })).toBeNull();
  });

  /**
   * ⛔ THE GATE'S VALUE LINES (the owner, 2026-09-19). Two bullets — "The self-ending war
   * layer: sieges, coalitions, conquest" and "The living pantheon: deities contest
   * converts and rise" — became ONE line in the owner's own words and punctuation. The
   * words are read from REALM_GATE_VALUE_LINES so this pin cannot go on asserting a
   * sentence that has left the screen, and the two retired ones are named as LITERALS
   * here on purpose: that is the only way to prove they are really gone.
   */
  test('the gate says the new line once, and neither retired bullet', () => {
    render(
      <SettlementPalette
        saves={[]} placements={{}}
        canManageCampaigns={false} tier="anon"
        onNavigate={vi.fn()}
        onCreateCampaign={vi.fn()}
      />,
    );
    const items = [...screen.getByTestId('realm-palette-locked').querySelectorAll('li')]
      .map((li) => li.textContent.trim());
    expect(items).toEqual([...REALM_GATE_VALUE_LINES]);
    expect(items.filter((line) => line === 'Access wars, religion, trade, the world!')).toHaveLength(1);
    // ANCHORED on the surviving first bullet, which is asserted present in the same
    // collection — so "the old bullets are gone" cannot pass on an empty list.
    for (const retired of [
      'The self-ending war layer: sieges, coalitions, conquest',
      'The living pantheon: deities contest converts and rise',
    ]) {
      expectAbsentWithAnchor(items, retired, REALM_GATE_VALUE_LINES[0], 'the locked-Realm gate');
    }
  });

  /**
   * ⛔ EVERY CONTROL IN THE PALETTE IS INSIDE ITS ONE SCROLLER (the owner, 2026-09-19:
   * "note how the See Cartographer and the button for instant generate settlements are
   * cut off and can't be scrolled down to").
   *
   * The column has a fixed height inside an `overflow: hidden` ancestor, so a control
   * that is a SIBLING of the scrolling region rather than a child of it cannot be
   * reached at all when the column is short. jsdom computes no layout, so this cannot
   * measure the clipping — what it CAN prove is the structural property that makes the
   * clipping impossible: one scroller, and every control inside it.
   */
  test('the palette has exactly one scrolling region, and every control is inside it', () => {
    const { container } = render(
      <SettlementPalette
        saves={[]} placements={{}}
        canManageCampaigns={false} tier="anon"
        onNavigate={vi.fn()}
        onCreateCampaign={vi.fn()}
      />,
    );
    const scrollers = [...container.querySelectorAll('div')]
      .filter((el) => /auto|scroll/.test(el.style.overflowY || ''));
    expect(scrollers, 'the palette should have exactly one scrolling region').toHaveLength(1);
    const buttons = [...container.querySelectorAll('button')];
    expect(buttons.length, 'presence control: the palette drew its controls').toBeGreaterThanOrEqual(2);
    const stranded = buttons
      .filter((b) => !scrollers[0].contains(b))
      .map((b) => b.textContent.trim());
    expect(
      stranded,
      '\nA palette control sits OUTSIDE the one scrolling region. In a fixed-height column '
      + 'inside an `overflow: hidden` ancestor that control cannot be scrolled to — which is '
      + 'exactly how "See Cartographer" and the instant-world entry were cut off.\n',
    ).toEqual([]);
  });

  test('an entitled viewer keeps the campaign invitation and sees no gate', () => {
    render(
      <SettlementPalette
        saves={[]} placements={{}}
        canManageCampaigns tier="premium"
        onCreateCampaign={vi.fn()}
      />,
    );
    expect(screen.getByText(/Start a campaign to place settlements/i)).toBeTruthy();
    // anchored: the invitation above is live, so the absent gate is a real branch and not an unmounted palette
    expect(screen.queryByTestId('realm-palette-locked')).toBeNull();
  });
});
