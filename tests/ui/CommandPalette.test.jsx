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
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

let mockState;
vi.mock('../../src/store/index.js', () => ({ useStore: (sel) => sel(mockState) }));
vi.mock('../../src/hooks/useRoute.js', () => ({ navigate: vi.fn() }));
vi.mock('../../src/lib/saves.js', () => ({ saves: { list: vi.fn().mockResolvedValue([]) } }));

import CommandPalette from '../../src/components/CommandPalette.jsx';
import { navigate } from '../../src/hooks/useRoute.js';

afterEach(cleanup);
beforeEach(() => {
  navigate.mockClear();
  mockState = {
    savedSettlements: [
      { id: 's1', settlement: { name: 'Ironhold', npcs: [{ id: 'n1', name: 'Mayor Brandt' }] } },
      { id: 's2', settlement: { name: 'Elmspire', npcs: [] } },
    ],
    savedSettlementsLoaded: true,
    setSavedSettlements: vi.fn(),
  };
});

describe('CommandPalette — the jump bar', () => {
  it('opens as a combobox dialog and lists page destinations on an empty query', () => {
    render(<CommandPalette onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeTruthy();
    expect(screen.getByRole('combobox')).toBeTruthy();
    // A primary route surfaces as a jump target with no query typed.
    expect(screen.getByRole('button', { name: 'Go to Realm' })).toBeTruthy();
  });

  it('filters to a settlement by typed text', () => {
    render(<CommandPalette onClose={() => {}} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Iron' } });
    expect(screen.getByRole('button', { name: 'Ironhold' })).toBeTruthy();
    // A non-matching page drops out of the results.
    expect(screen.queryByRole('button', { name: 'Go to Realm' })).toBeNull();
  });

  it('finds a figure and jumps to its owning settlement on select', () => {
    render(<CommandPalette onClose={() => {}} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Brandt' } });
    const opt = screen.getByRole('button', { name: 'Mayor Brandt' });
    fireEvent.click(opt);
    expect(navigate).toHaveBeenCalledWith('settlements', { params: { id: 's1' } });
  });

  it('navigates to a page on select', () => {
    const onClose = vi.fn();
    render(<CommandPalette onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Go to Compendium' }));
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
});
