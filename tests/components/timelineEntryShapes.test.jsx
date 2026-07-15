/** @vitest-environment jsdom */
/**
 * timelineEntryShapes.test.jsx — the active-session Timeline tolerates BOTH
 * eventLog entry shapes.
 *
 * Canonical applyEvent entries nest the authored event under `.event` and stamp
 * `appliedAt`. The library-row flavor entries written by renameSettlement
 * (RENAME_SETTLEMENT) and destroySavedSettlement (DESTROY_SETTLEMENT) use a flat
 * `timestamp` + flat `type` and carry NO `event` object. When those flat entries
 * are mirrored into the live `state.eventLog` for the active canon settlement,
 * the Timeline must render a valid date (not "Invalid Date") and must not crash
 * on `entry.event.description`.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

const baseState = {
  phase: 'canon',
  activeSaveId: 'save-1',
  undoLastEvent: vi.fn(),
  isSettlementClockBound: () => false,
  eventLog: [
    // Canonical applyEvent entry — nested `.event`, `appliedAt`.
    {
      event: { type: 'RAID', description: 'Bandits struck the granary.' },
      appliedAt: '2026-06-20T10:00:00.000Z',
      narrativeSummary: 'The granary was raided.',
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
    },
  ],
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(baseState); }
  useStore.getState = () => baseState;
  return { useStore };
});

import Timeline from '../../src/components/settlement/Timeline.jsx';

describe('Timeline — flat vs nested eventLog entry shapes', () => {
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
});
