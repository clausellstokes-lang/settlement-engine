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
 * and announces pointer-drag placement guidance into an aria-live region.
 */

import React from 'react';
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';

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

  test('Enter announces honest pointer-drag placement guidance in the live region', () => {
    const { container } = render(<SettlementPalette saves={SAVES} placements={{}} />);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live.textContent).toMatch(/Drag a card onto the map/i); // default hint
    fireEvent.keyDown(screen.getByRole('button', { name: /Springhaven/i }), { key: 'Enter' });
    expect(live.textContent).toMatch(/Springhaven selected/i);
    expect(live.textContent).toMatch(/mouse or touch/i);
    // Fix wave 4 (idx28): the hint leads with the real keyboard outcome (the
    // overview peek) and never dead-ends on "isn't available".
    expect(live.textContent).toMatch(/overview is showing beside the map/i);
    expect(live.textContent).not.toMatch(/isn't available/i);
  });

  test('Space also triggers selection guidance', () => {
    const { container } = render(<SettlementPalette saves={SAVES} placements={{}} />);
    fireEvent.keyDown(screen.getByRole('button', { name: /Springhaven/i }), { key: ' ' });
    expect(container.querySelector('[aria-live="polite"]').textContent).toMatch(/Springhaven selected/i);
  });

  test('an already-placed card labels its state instead of a drag command', () => {
    render(<SettlementPalette saves={SAVES} placements={{ b1: { settlementId: 's1' } }} />);
    const card = screen.getByRole('button', { name: /Springhaven/i });
    expect(card.getAttribute('aria-label')).toMatch(/already placed on the map/i);
  });
});
