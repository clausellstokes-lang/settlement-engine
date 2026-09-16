/** @vitest-environment jsdom */
/**
 * CommandPalette.test.jsx — the cmd/ctrl-K jump bar (Vision V-H, R-20).
 *
 * Pins the four contract points from the brief: it OPENS as an aria-combobox
 * dialog; it FILTERS pages, settlements, and figures by typed text; it NAVIGATES
 * through the single navigate() chokepoint on select (a figure jumping to its
 * owning settlement); and it TRAPS focus / closes on Escape via the shared trap.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';

let mockState;
vi.mock('../../src/store/index.js', () => {
  function useStore(sel) {
    return sel(mockState);
  }
  useStore.getState = () => mockState;
  return { useStore };
});
vi.mock('../../src/hooks/useRoute.js', () => ({ navigate: vi.fn() }));
vi.mock('../../src/lib/saves.js', () => ({ saves: { list: vi.fn().mockResolvedValue([]) } }));

import CommandPalette from '../../src/components/CommandPalette.jsx';
import { navigate } from '../../src/hooks/useRoute.js';
import { saves } from '../../src/lib/saves.js';

afterEach(cleanup);
beforeEach(() => {
  navigate.mockClear();
  mockState = {
    savedSettlements: [
      { id: 's1', settlement: { name: 'Ironhold', npcs: [{ id: 'n1', name: 'Mayor Brandt' }] } },
      { id: 's2', settlement: { name: 'Elmspire', npcs: [] } },
    ],
    savedSettlementsLoaded: true,
    savedSettlementsOwnerId: null,
    savedSettlementsHydrationGeneration: 0,
    auth: { user: null },
    setSavedSettlements: vi.fn(),
  };
});

describe('CommandPalette — the jump bar', () => {
  it('opens as a combobox dialog and lists page destinations on an empty query', () => {
    render(<CommandPalette onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeTruthy();
    expect(screen.getByRole('combobox')).toBeTruthy();
    // A primary route surfaces as a jump target with no query typed. (SB5: the
    // rows are role=option — the option IS the interactive element now.)
    expect(screen.getByRole('option', { name: 'Go to Realm' })).toBeTruthy();
  });

  it('filters to a settlement by typed text', () => {
    render(<CommandPalette onClose={() => {}} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Iron' } });
    expect(screen.getByRole('option', { name: 'Ironhold' })).toBeTruthy();
    // A non-matching page drops out of the results.
    expect(screen.queryByRole('option', { name: 'Go to Realm' })).toBeNull();
  });

  it('finds a figure and jumps to its owning settlement on select', () => {
    render(<CommandPalette onClose={() => {}} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Brandt' } });
    const opt = screen.getByRole('option', { name: 'Mayor Brandt' });
    fireEvent.click(opt);
    expect(navigate).toHaveBeenCalledWith('settlements', { params: { id: 's1' } });
  });

  it('navigates to a page on select', () => {
    const onClose = vi.fn();
    render(<CommandPalette onClose={onClose} />);
    fireEvent.click(screen.getByRole('option', { name: 'Go to Compendium' }));
    expect(navigate).toHaveBeenCalledWith('compendium');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows the house-voice empty line when nothing matches', () => {
    render(<CommandPalette onClose={() => {}} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzzznowhere' } });
    expect(screen.getByText(/Nothing by that name in this realm/)).toBeTruthy();
  });

  it('closes on Escape through the shared focus trap', () => {
    const onClose = vi.fn();
    render(<CommandPalette onClose={onClose} />);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).toHaveBeenCalled();
  });

  // ── Fix wave 4 (idx37, WCAG 2.1.2) — the keyboard CLOSE paths must work from
  // INSIDE the dialog. The pin above dispatches on window directly, which is why
  // it stayed green while a wrapper stopPropagation killed the real DOM path:
  // the trap and the cmd-K host both listen on window, and a synthetic keydown
  // stopped at the React root never reaches them. These pins originate on the
  // combobox input — the place a user's keys actually land.
  it('Escape pressed IN the dialog reaches the trap and closes (no keyboard trap)', () => {
    const onClose = vi.fn();
    render(<CommandPalette onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('the cmd/ctrl-K chord pressed IN the dialog bubbles to window (host toggle stays reachable)', () => {
    const seen = vi.fn();
    window.addEventListener('keydown', seen);
    try {
      render(<CommandPalette onClose={() => {}} />);
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'k', metaKey: true });
      expect(seen).toHaveBeenCalled();
    } finally {
      window.removeEventListener('keydown', seen);
    }
  });

  it('Tab is trapped WITHIN the dialog — the combobox is the single tab stop and wraps to itself', () => {
    render(<CommandPalette onClose={() => {}} />);
    const input = screen.getByRole('combobox');
    input.focus();
    expect(document.activeElement).toBe(input);
    fireEvent.keyDown(input, { key: 'Tab' });
    // SB5: the options rove via aria-activedescendant (tabIndex -1), so the
    // input is the dialog's only sequential focusable — the trap wraps it onto
    // itself and focus never leaks behind the overlay.
    expect(document.activeElement).toBe(input);
  });

  // ── SB5 — the combobox model is real: options are single-element role=option
  // rows outside the Tab order, and the active row can never dangle.
  it('options are role=option with tabIndex -1 and no interactive descendants (one tab stop total)', () => {
    render(<CommandPalette onClose={() => {}} />);
    const opts = screen.getAllByRole('option');
    expect(opts.length).toBeGreaterThan(0);
    for (const o of opts) {
      expect(o.getAttribute('tabindex')).toBe('-1');
      // ARIA forbids interactive children inside an option — the option IS the
      // button element itself, nothing nested.
      expect(o.querySelector('button')).toBeNull();
    }
    // No element in the palette competes with the input for Tab.
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('aria-activedescendant is clamped when results hydrate after arrowing on an empty list (Enter stays live)', async () => {
    // The cold-library edge: type an unhydrated name (0 results), ArrowDown
    // (pre-fix this drove active to -1), then the library hydrates. Pre-fix,
    // aria-activedescendant became the dangling 'cmdk-opt--1' and Enter a
    // silent no-op; post-fix the active row clamps into the live range.
    mockState.savedSettlements = [];
    mockState.savedSettlementsLoaded = false;
    mockState.setSavedSettlements = (list) => {
      mockState.savedSettlements = list;
      mockState.savedSettlementsLoaded = true;
    };
    saves.list.mockResolvedValueOnce([
      { id: 's9', settlement: { name: 'Ironhold', npcs: [] } },
    ]);
    const { rerender } = render(<CommandPalette onClose={() => {}} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Iron' } }); // 0 results while cold
    fireEvent.keyDown(input, { key: 'ArrowDown' });          // must not underflow
    await waitFor(() => expect(mockState.savedSettlementsLoaded).toBe(true));
    rerender(<CommandPalette onClose={() => {}} />);         // mock store is not reactive
    expect(screen.getByRole('option', { name: 'Ironhold' })).toBeTruthy();
    expect(input.getAttribute('aria-activedescendant')).toBe('cmdk-opt-0');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(navigate).toHaveBeenCalledWith('settlements', { params: { id: 's9' } });
  });
});
