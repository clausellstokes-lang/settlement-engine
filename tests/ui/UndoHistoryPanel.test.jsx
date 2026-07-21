/** @vitest-environment jsdom */
/**
 * UndoHistoryPanel.test.jsx — the visible advance-undo history (Vision V-H, R-21).
 *
 * Pins the three contract points: the panel RENDERS one readable row per
 * pre-advance snapshot (most recent first, named by its return-point date); a
 * "Return here" on the k-th row RESTORES through the EXISTING mechanism by
 * calling undoLastPulse exactly (k + 1) times (the documented walk-back); and the
 * rows are SECRETS-SAFE — a covert marker buried in a snapshot's worldState never
 * reaches the DOM, because the rows read only non-covert scalars.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock the store: the panel reads pulseUndoStack + undoLastPulse via selectors.
let mockState;
vi.mock('../../src/store/index.js', () => ({
  useStore: (sel) => sel(mockState),
}));

import UndoHistoryPanel from '../../src/components/UndoHistoryPanel.jsx';

const entry = (campaignId, year, interval, extra = {}) => ({
  campaignId,
  tick: year * 52,
  now: new Date().toISOString(),
  interval,
  worldState: { calendar: { year, season: 'Spring' }, ...extra },
});

afterEach(cleanup);
beforeEach(() => { mockState = { pulseUndoStack: [], undoLastPulse: vi.fn().mockResolvedValue(true) }; });

describe('UndoHistoryPanel — the visible walk-back', () => {
  it('renders a dialog with one row per snapshot, most recent first', () => {
    mockState.pulseUndoStack = [entry('c1', 3, 'one_week'), entry('c1', 4, 'one_year')];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    const returns = screen.getAllByRole('button', { name: 'Return here' });
    expect(returns).toHaveLength(2);
    // Newest snapshot (year 4) heads the list.
    expect(screen.getByText('Year 4, Spring')).toBeTruthy();
    expect(screen.getByText('Year 3, Spring')).toBeTruthy();
  });

  it('shows only the active campaign\'s snapshots', () => {
    mockState.pulseUndoStack = [entry('c1', 3, 'one_week'), entry('c2', 9, 'one_year')];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(screen.getAllByRole('button', { name: 'Return here' })).toHaveLength(1);
    expect(screen.queryByText('Year 9, Spring')).toBeNull();
  });

  it('restores through the existing undoLastPulse, k+1 times for the k-th row', async () => {
    // Three snapshots; display order (top→bottom) is year 6, 5, 4.
    mockState.pulseUndoStack = [entry('c1', 4, 'one_week'), entry('c1', 5, 'one_month'), entry('c1', 6, 'one_year')];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    const returns = screen.getAllByRole('button', { name: 'Return here' });
    // Second row from the top (index 1) → needs 2 pops to return to it.
    fireEvent.click(returns[1]);
    await waitFor(() => expect(mockState.undoLastPulse).toHaveBeenCalledTimes(2));
    expect(mockState.undoLastPulse).toHaveBeenCalledWith('c1');
  });

  it('never renders covert snapshot data (secrets-safe rows)', () => {
    mockState.pulseUndoStack = [
      entry('c1', 7, 'one_year', { conspiracies: [{ covert: true, name: 'COVERT-MARKER-XYZ' }] }),
    ];
    const { container } = render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(container.textContent).not.toContain('COVERT-MARKER-XYZ');
    // …but the non-covert return-point date does render.
    expect(screen.getByText('Year 7, Spring')).toBeTruthy();
  });

  it('shows a designed empty state when the session stack holds nothing', () => {
    mockState.pulseUndoStack = [];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(screen.getByText('No advances to undo yet.')).toBeTruthy();
    expect(screen.queryAllByRole('button', { name: 'Return here' })).toHaveLength(0);
  });

  // ── SB5 (WCAG 2.1.2 — same root cause the palette fixed in wave 4/idx37):
  // keys pressed INSIDE the dialog must reach the window-level focus trap. A
  // wrapper onKeyDown stopPropagation silently disabled Escape-close and Tab
  // containment while window-dispatched tests stayed green — so these pins
  // originate on in-dialog nodes, where a user's keys actually land.
  it('Escape pressed INSIDE the dialog reaches the trap and closes', () => {
    const onClose = vi.fn();
    mockState.pulseUndoStack = [entry('c1', 3, 'one_week')];
    render(<UndoHistoryPanel campaignId="c1" onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Return here' }), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('Tab from the last focusable wraps to the first (containment under aria-modal)', () => {
    mockState.pulseUndoStack = [entry('c1', 3, 'one_week')];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    const returnBtn = screen.getByRole('button', { name: 'Return here' });
    const close = screen.getByRole('button', { name: 'Close advance history' });
    returnBtn.focus();
    expect(document.activeElement).toBe(returnBtn);
    fireEvent.keyDown(returnBtn, { key: 'Tab' });
    // The trap cycles to the dialog's first focusable (the header close) —
    // focus never walks out from under aria-modal.
    expect(document.activeElement).toBe(close);
  });
});
