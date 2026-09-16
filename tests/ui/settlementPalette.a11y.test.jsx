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

// SettlementPalette pulls setSelectedBurgId / hover setters off the store.
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector({
    setSelectedBurgId: vi.fn(),
    setHoveredSettlementId: vi.fn(),
    clearHoveredSettlementId: vi.fn(),
  }),
}));

import SettlementPalette from '../../src/components/map/SettlementPalette.jsx';

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
