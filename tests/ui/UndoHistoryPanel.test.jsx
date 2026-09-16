/** @vitest-environment jsdom */
/**
 * UndoHistoryPanel.test.jsx — the visible session undo history (Vision V-H,
 * R-21; proposal rows added by R-1).
 *
 * Pins the contract points: the panel RENDERS one readable row per session
 * snapshot from BOTH stores (advance stack + proposal ring), most recent first,
 * each row NAMING which act it reverts (an advance row is a calendar
 * return-point; a proposal row leads with "Proposal applied" and never renders
 * as a calendar step); a "Return here" on the k-th row RESTORES through the
 * EXISTING mechanisms by calling the row-matching verb once per row 0..k
 * (undoLastPulse for advance rows, undoLastProposalApply for proposal rows);
 * and the rows are SECRETS-SAFE — a covert marker buried in a snapshot's
 * worldState never reaches the DOM, because the rows read only non-covert
 * scalars (calendar, interval, capture time, the proposal's public headline).
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock the store: the panel reads pulseUndoStack + proposalUndoStack +
// undoLastPulse + undoLastProposalApply via selectors.
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

// A proposal-ring entry: advanceDepth places it in the merged order (after the
// advanceDepth-th advance snapshot), the headline is the public desk copy.
const proposalEntry = (campaignId, advanceDepth, headline, extra = {}) => ({
  campaignId,
  kind: 'proposal',
  proposalId: `p-${advanceDepth}-${headline}`,
  headline,
  advanceDepth,
  tick: 999,
  now: new Date().toISOString(),
  worldState: { calendar: { year: 999, season: 'Spring' }, ...extra },
});

afterEach(cleanup);
beforeEach(() => {
  mockState = {
    pulseUndoStack: [],
    proposalUndoStack: [],
    undoLastPulse: vi.fn().mockResolvedValue(true),
    undoLastProposalApply: vi.fn().mockResolvedValue(true),
  };
});

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

  it('names the full multi-week catch-up span, not its delegated one-week interval', () => {
    const beforeCatchUp = entry('c1', 4, 'one_week');
    mockState.pulseUndoStack = [beforeCatchUp];
    mockState.campaigns = [{
      id: 'c1',
      worldState: { tick: beforeCatchUp.tick + 6 },
    }];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(screen.getByText(/Undoes 6 weeks/)).toBeTruthy();
    expect(screen.queryByText(/Undoes a week/)).toBeNull();
  });

  it('shows only the active campaign\'s snapshots', () => {
    mockState.pulseUndoStack = [entry('c1', 3, 'one_week'), entry('c2', 9, 'one_year')];
    mockState.proposalUndoStack = [proposalEntry('c2', 1, 'Foreign famine')];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(screen.getAllByRole('button', { name: 'Return here' })).toHaveLength(1);
    expect(screen.queryByText('Year 9, Spring')).toBeNull();
    expect(screen.queryByText('Proposal applied')).toBeNull();
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
    expect(mockState.undoLastProposalApply).not.toHaveBeenCalled();
  });

  // ── R-1: proposal rows — labeled by ACT, never as a calendar step ──────────
  it('renders a proposal row labeled "Proposal applied" with its headline, never as a calendar step', () => {
    mockState.proposalUndoStack = [proposalEntry('c1', 0, 'Famine pressure may take hold')];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(screen.getByText('Proposal applied')).toBeTruthy();
    // The act body names what one undo reverts + carries the desk headline…
    expect(screen.getByText(/Famine pressure may take hold · Undoes one proposal apply/)).toBeTruthy();
    // …and the row never leads with the snapshot's calendar (tick 999 / Year 999
    // would read as a new calendar step the apply never took).
    expect(screen.queryByText('Year 999, Spring')).toBeNull();
    expect(screen.queryByText(/Tick 999/)).toBeNull();
  });

  it('interleaves proposal rows by their stamped advance depth (newest first)', () => {
    // One advance, then a proposal applied AFTER it (depth 1), plus a proposal
    // applied BEFORE it (depth 0): display order is proposal(1), advance, proposal(0).
    mockState.pulseUndoStack = [entry('c1', 4, 'one_month')];
    mockState.proposalUndoStack = [
      proposalEntry('c1', 0, 'Old grain pact'),
      proposalEntry('c1', 1, 'New famine order'),
    ];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    const bold = [...document.querySelectorAll('li > div > div:first-child')]
      .map((n) => n.textContent);
    expect(bold).toEqual(['Proposal applied', 'Year 4, Spring', 'Proposal applied']);
    const bodies = [...document.querySelectorAll('li > div > div:nth-child(2)')]
      .map((n) => n.textContent);
    expect(bodies[0]).toContain('New famine order');
    expect(bodies[2]).toContain('Old grain pact');
  });

  it('walks back through BOTH verbs, one call per row, newest first', async () => {
    mockState.pulseUndoStack = [entry('c1', 4, 'one_month')];
    mockState.proposalUndoStack = [proposalEntry('c1', 1, 'New famine order')];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    const returns = screen.getAllByRole('button', { name: 'Return here' });
    // Bottom row (the advance) → pops the proposal first, then the advance.
    fireEvent.click(returns[1]);
    await waitFor(() => expect(mockState.undoLastPulse).toHaveBeenCalledTimes(1));
    expect(mockState.undoLastProposalApply).toHaveBeenCalledTimes(1);
    expect(mockState.undoLastProposalApply).toHaveBeenCalledWith('c1');
  });

  it('stops the walk-back when a verb refuses (returns false)', async () => {
    mockState.pulseUndoStack = [entry('c1', 4, 'one_month')];
    mockState.proposalUndoStack = [proposalEntry('c1', 1, 'New famine order')];
    mockState.undoLastProposalApply = vi.fn().mockResolvedValue(false);
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Return here' })[1]);
    await waitFor(() => expect(mockState.undoLastProposalApply).toHaveBeenCalledTimes(1));
    expect(mockState.undoLastPulse).not.toHaveBeenCalled();
  });

  it('never renders covert snapshot data (secrets-safe rows, both kinds)', () => {
    mockState.pulseUndoStack = [
      entry('c1', 7, 'one_year', { conspiracies: [{ covert: true, name: 'COVERT-MARKER-XYZ' }] }),
    ];
    mockState.proposalUndoStack = [
      proposalEntry('c1', 1, 'Public headline', { conspiracies: [{ covert: true, name: 'COVERT-MARKER-ABC' }] }),
    ];
    const { container } = render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(container.textContent).not.toContain('COVERT-MARKER-XYZ');
    expect(container.textContent).not.toContain('COVERT-MARKER-ABC');
    // …but the non-covert return-point date and public headline do render.
    expect(screen.getByText('Year 7, Spring')).toBeTruthy();
    expect(screen.getByText(/Public headline/)).toBeTruthy();
  });

  it('shows a designed empty state when the session stores hold nothing', () => {
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(screen.getByText('Nothing to undo yet.')).toBeTruthy();
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
    const close = screen.getByRole('button', { name: 'Close undo history' });
    returnBtn.focus();
    expect(document.activeElement).toBe(returnBtn);
    fireEvent.keyDown(returnBtn, { key: 'Tab' });
    // The trap cycles to the dialog's first focusable (the header close) —
    // focus never walks out from under aria-modal.
    expect(document.activeElement).toBe(close);
  });

  // ── R-5b: the reload-into-paused row ───────────────────────────────────────
  // A paused advance parks its pre-interval return point on the campaign record,
  // so it OUTLIVES the session the toolbar chip is armed from. The panel has to
  // show that one row, or the DM sees an enabled "Undo Advance" beside a panel
  // that says there is nothing to undo.
  const parkedCampaign = (campaignId, year, interval) => ({
    id: campaignId,
    worldState: {
      pausedAdvance: { interval, preIntervalUndo: entry(campaignId, year, interval) },
    },
  });

  it('after a reload into a paused advance, the parked return point is listed and the copy says it survived', () => {
    mockState.campaigns = [parkedCampaign('c1', 6, 'one_year')];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(screen.getAllByRole('button', { name: 'Return here' })).toHaveLength(1);
    expect(screen.getByText('Year 6, Spring')).toBeTruthy();
    expect(screen.getByText(/its return point survived the reload/)).toBeTruthy();
    // Not the session-only line, which would now be false for this row.
    expect(screen.queryByText(/Kept for this session only/)).toBeNull();
  });

  it('IN SESSION the parked copy never doubles the row it duplicates', () => {
    // Same campaign, same advance: the session stack already holds the snapshot.
    mockState.pulseUndoStack = [entry('c1', 6, 'one_year')];
    mockState.campaigns = [parkedCampaign('c1', 6, 'one_year')];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(screen.getAllByRole('button', { name: 'Return here' })).toHaveLength(1);
    // And the session-only line is back, because this return point IS session-scoped.
    expect(screen.getByText(/Kept for this session only/)).toBeTruthy();
  });

  it('a parked cursor with NO snapshot (a save written before R-5b) lists nothing', () => {
    mockState.campaigns = [{ id: 'c1', worldState: { pausedAdvance: { interval: 'one_year' } } }];
    render(<UndoHistoryPanel campaignId="c1" onClose={() => {}} />);
    expect(screen.queryAllByRole('button', { name: 'Return here' })).toHaveLength(0);
    expect(screen.getByText('Nothing to undo yet.')).toBeTruthy();
  });
});
