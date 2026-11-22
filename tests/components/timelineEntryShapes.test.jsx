/** @vitest-environment jsdom */
/**
 * timelineEntryShapes.test.jsx — the active-session Timeline tolerates BOTH
 * eventLog entry shapes.
 *
 * Canonical applyEvent entries nest the authored event under `.event` and stamp
 * `appliedAt`. The library-row flavor entries written by renameSettlement
 * (RENAME_SETTLEMENT) and destroySavedSettlement (DESTROY_SETTLEMENT) use a flat
 * `timestamp` + flat `type` and carry NO `event` object. The component also
 * shares the store's undo plan: flavor rows are display-only, non-undoable
 * mechanical rows are barriers, and typed refusals are visible to the user.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';

const initialEventLog = [
    // Canonical applyEvent entry — nested `.event`, `appliedAt`.
    {
      event: { type: 'RAID', description: 'Bandits struck the granary.' },
      appliedAt: '2026-06-20T10:00:00.000Z',
      narrativeSummary: 'The granary was raided.',
      beforeState: { resilience: { value: 2 } },
      deltas: [],
      factionResponses: [],
    },
    // Flat DESTROY_SETTLEMENT flavor entry — `type` + `timestamp`, no `.event`.
    {
      id: 'destroy.save-1.1',
      type: 'DESTROY_SETTLEMENT',
      timestamp: '2026-06-21T12:00:00.000Z',
      narrativeSummary: 'Stoneford was destroyed: razed by fire.',
    },
    // Flat RENAME_SETTLEMENT flavor entry — `type` + `timestamp`, no `.event`.
    {
      id: 'rename.save-1.1',
      type: 'RENAME_SETTLEMENT',
      timestamp: '2026-06-22T09:30:00.000Z',
      narrativeSummary: 'Stoneford is now known as Ironford.',
      flavor: true,
    },
];

const baseState = {
  phase: 'canon',
  activeSaveId: 'save-1',
  undoLastEvent: vi.fn(),
  isSettlementClockBound: () => false,
  eventLog: initialEventLog,
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(baseState); }
  useStore.getState = () => baseState;
  return { useStore };
});

import Timeline from '../../src/components/settlement/Timeline.jsx';

describe('Timeline — flat vs nested eventLog entry shapes', () => {
  beforeEach(() => {
    baseState.eventLog = initialEventLog;
    baseState.undoLastEvent.mockReset();
  });
  afterEach(() => cleanup());

  it('renders flat RENAME/DESTROY entries without "Invalid Date" or a crash', () => {
    render(<Timeline />);

    // The flat entries' narrative summaries render (no crash on entry.event.description).
    expect(screen.getByText('Stoneford was destroyed: razed by fire.')).toBeTruthy();
    expect(screen.getByText('Stoneford is now known as Ironford.')).toBeTruthy();
    expect(screen.getByText('The granary was raided.')).toBeTruthy();

    // No entry — flat or nested — renders an invalid timestamp.
    expect(screen.queryByText(/Invalid Date/)).toBeNull();
  });

  it('renders one Undo on the newest mechanical entry beneath flavor rows', () => {
    baseState.eventLog = [
      {
        event: { type: 'PLAGUE' },
        appliedAt: '2026-06-19T10:00:00.000Z',
        narrativeSummary: 'The old plague passed.',
        beforeState: { resilience: { value: 1 } },
      },
      {
        event: { type: 'RAID' },
        appliedAt: '2026-06-20T10:00:00.000Z',
        narrativeSummary: 'The granary was raided.',
        beforeState: { resilience: { value: 2 } },
      },
      {
        type: 'RENAME_SETTLEMENT',
        timestamp: '2026-06-22T09:30:00.000Z',
        narrativeSummary: 'Stoneford is now known as Ironford.',
        flavor: true,
      },
    ];

    render(<Timeline />);

    expect(screen.getAllByRole('button', { name: 'Undo' })).toHaveLength(1);
    expect(within(screen.getByText('The granary was raided.').parentElement).getByRole('button', { name: 'Undo' })).toBeTruthy();
    expect(within(screen.getByText('Stoneford is now known as Ironford.').parentElement).queryByRole('button', { name: 'Undo' })).toBeNull();
    expect(within(screen.getByText('The old plague passed.').parentElement).queryByRole('button', { name: 'Undo' })).toBeNull();
  });

  it('does not advertise Undo through a non-undoable mechanical barrier', () => {
    baseState.eventLog = [
      {
        event: { type: 'RAID' },
        appliedAt: '2026-06-20T10:00:00.000Z',
        narrativeSummary: 'The granary was raided.',
        beforeState: { resilience: { value: 2 } },
      },
      {
        type: 'DESTROY_SETTLEMENT',
        timestamp: '2026-06-21T12:00:00.000Z',
        narrativeSummary: 'Stoneford was destroyed.',
      },
      {
        type: 'OMEN',
        timestamp: '2026-06-22T09:30:00.000Z',
        narrativeSummary: 'A comet crossed the sky.',
        flavor: true,
      },
    ];

    render(<Timeline />);

    expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull();
  });

  it('surfaces a typed ok:false result instead of swallowing the refusal', () => {
    baseState.eventLog = [{
      event: { type: 'RAID' },
      appliedAt: '2026-06-20T10:00:00.000Z',
      narrativeSummary: 'The granary was raided.',
      beforeState: { resilience: { value: 2 } },
    }];
    baseState.undoLastEvent.mockReturnValue({
      ok: false,
      before: { reason: 'entry_not_undoable' },
    });

    render(<Timeline />);
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));

    expect(baseState.undoLastEvent).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert').textContent).toContain('cannot be undone');
  });
});
