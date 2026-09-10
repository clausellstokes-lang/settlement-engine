/** @vitest-environment jsdom */
/**
 * versionsTab.test.jsx — P143 / X-7 fold-in contract.
 *
 * Pins that the locked state of the Cartographer-gated Versions tab now
 * routes through the shared LockedDestination primitive (not the old
 * hand-rolled card), while paid users still get the timeline.
 *
 *   • Free tier + flag on → the LockedDestination pitch renders, not the
 *     timeline.
 *   • Paid tier + flag on → the timeline renders, not the locked pitch.
 *   • Flag off → the dev "flip the flag" notice.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';

const flagMock = vi.fn(() => true);
vi.mock('../../src/lib/flags.js', () => ({ flag: (...a) => flagMock(...a) }));

vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { track: vi.fn() },
  EVENTS: { LOCKED_DESTINATION_SHOWN: 'locked_destination_shown' },
}));

vi.mock('../../src/store/index.js', () => {
  const data = {
    auth: { tier: 'wanderer' },
    setPurchaseModalOpen: vi.fn(),
    revertToSnapshot: vi.fn(() => true),
    recordSnapshot: vi.fn(() => ({ ok: true, after: { snapshotId: 'snap-new' } })),
  };
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  return { useStore };
});

import VersionsTab from '../../src/components/settlement/VersionsTab.jsx';
import { useStore } from '../../src/store/index.js';

describe('VersionsTab — X-7 locked-destination fold-in', () => {
  beforeEach(() => {
    flagMock.mockReturnValue(true);
    useStore.__set({
      auth: { tier: 'wanderer' },
      setPurchaseModalOpen: vi.fn(),
      revertToSnapshot: vi.fn(() => true),
      recordSnapshot: vi.fn(() => ({ ok: true, after: { snapshotId: 'snap-new' } })),
    });
    try { sessionStorage.clear(); } catch { /* ignore */ }
  });
  afterEach(() => cleanup());

  it('renders the LockedDestination pitch (not the timeline) for free users', () => {
    render(<VersionsTab save={{ name: 'Hollowmere', savedAt: Date.now() }} />);
    expect(screen.getByText('Cartographer · Version history')).toBeTruthy();
    expect(screen.getByText('Every change, on a timeline you can roll back.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'See Cartographer' })).toBeTruthy();
    expect(screen.queryByText('Timeline')).toBeNull();
  });

  it('renders the timeline (not the pitch) for paid users', () => {
    useStore.__set({ auth: { tier: 'premium' }, setPurchaseModalOpen: vi.fn() });
    render(<VersionsTab save={{ name: 'Hollowmere', savedAt: Date.now() }} />);
    expect(screen.getByText('Timeline')).toBeTruthy();
    expect(screen.queryByText('Cartographer · Version history')).toBeNull();
  });

  it('shows the flag-off notice when the feature flag is off', () => {
    flagMock.mockReturnValue(false);
    render(<VersionsTab save={{ name: 'Hollowmere' }} />);
    expect(screen.getByText(/Flip the flag to preview/i)).toBeTruthy();
  });

  it('reverts a paid user to a confirmed saved snapshot', () => {
    const revertToSnapshot = vi.fn(() => true);
    useStore.__set({
      auth: { tier: 'premium' },
      setPurchaseModalOpen: vi.fn(),
      revertToSnapshot,
    });

    render(<VersionsTab save={{
      id: 'save-1',
      name: 'Hollowmere',
      versionHistory: [
        {
          id: 'snap-1',
          ts: '2024-03-10T12:00:00Z',
          label: 'Before the siege',
          settlement: { name: 'Hollowmere' },
        },
      ],
    }} />);

    fireEvent.click(screen.getByRole('button', { name: /Revert to this snapshot/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Revert' }));

    expect(revertToSnapshot).toHaveBeenCalledWith({ saveId: 'save-1', snapshotId: 'snap-1' });
  });
});

// ── Queue #18 BUILD: the manual snapshot lever + the side-by-side comparison ──
//
// Both features were sold by the locked pitch and did not exist (Wave R-1
// un-promised them; the owner then ruled BUILD). These pins hold the shipped
// behavior so the pitch can never outrun the surface again.
//
// The snapshot payloads below use the shape the REAL store writer emits
// (`{ id, ts, kind, label, settlement }`, settlementSlice.js#recordSnapshot),
// not the legacy `snapshot` spelling the timeline builder used to read.
// tests/components/versionDiffView.test.jsx proves that shape against the live
// store rather than trusting this fixture.

const paidStore = (over = {}) => ({
  auth: { tier: 'premium' },
  setPurchaseModalOpen: vi.fn(),
  revertToSnapshot: vi.fn(() => true),
  recordSnapshot: vi.fn(() => ({ ok: true, after: { snapshotId: 'snap-new' } })),
  ...over,
});

const savedWith = (versionHistory) => ({
  id: 'save-1',
  name: 'Hollowmere',
  versionHistory,
});

const SNAP_EARLY = {
  id: 'snap-1',
  ts: '2024-03-01T12:00:00Z',
  kind: 'manual',
  label: 'Before the siege',
  settlement: { name: 'Hollowmere', population: 2000 },
};
const SNAP_LATE = {
  id: 'snap-2',
  ts: '2024-03-10T12:00:00Z',
  kind: 'manual',
  label: 'After the siege',
  settlement: { name: 'Hollowmere', population: 1500 },
};

describe('VersionsTab — manual snapshot on demand (queue #18)', () => {
  beforeEach(() => { flagMock.mockReturnValue(true); });
  afterEach(() => cleanup());

  it('dispatches recordSnapshot against the active save with the manual kind', () => {
    const recordSnapshot = vi.fn(() => ({ ok: true, after: { snapshotId: 'snap-new' } }));
    useStore.__set(paidStore({ recordSnapshot }));

    render(<VersionsTab save={savedWith([])} />);
    fireEvent.click(screen.getByRole('button', { name: 'Take a snapshot' }));

    expect(recordSnapshot).toHaveBeenCalledWith({
      saveId: 'save-1',
      kind: 'manual',
      label: 'Manual snapshot',
    });
  });

  it('passes the typed label through and clears the field', () => {
    const recordSnapshot = vi.fn(() => ({ ok: true, after: { snapshotId: 'snap-new' } }));
    useStore.__set(paidStore({ recordSnapshot }));

    render(<VersionsTab save={savedWith([])} />);
    const input = screen.getByLabelText(/Name this moment/i);
    fireEvent.change(input, { target: { value: '  Before session 4  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Take a snapshot' }));

    expect(recordSnapshot).toHaveBeenCalledWith({
      saveId: 'save-1',
      kind: 'manual',
      label: 'Before session 4',
    });
    expect(input.value).toBe('');
  });

  it('the recorded snapshot appears as a timeline row that can be reverted to and compared', () => {
    useStore.__set(paidStore());
    const { rerender } = render(<VersionsTab save={savedWith([])} />);
    expect(screen.queryByText('Before the siege')).toBeNull();

    // What the store hands back after the write.
    rerender(<VersionsTab save={savedWith([SNAP_EARLY])} />);
    expect(screen.getByText('Before the siege')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Revert to this snapshot/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Compare' })).toBeTruthy();
  });

  it('surfaces the failure copy and takes no snapshot when the action refuses', () => {
    useStore.__set(paidStore({ recordSnapshot: vi.fn(() => null) }));
    render(<VersionsTab save={savedWith([])} />);
    fireEvent.click(screen.getByRole('button', { name: 'Take a snapshot' }));
    expect(screen.getByText(/could not be recorded/i)).toBeTruthy();
  });

  it('withholds the lever on an unsaved settlement rather than writing where the tab cannot read', () => {
    // recordSnapshot with no saveId appends to the DRAFT sibling, which this
    // tab never reads. Offering the button there would look like a silent
    // no-op, so the tab says what to do instead.
    useStore.__set(paidStore());
    render(<VersionsTab save={null} />);
    expect(screen.queryByRole('button', { name: 'Take a snapshot' })).toBeNull();
    expect(screen.getByText(/Save this settlement to start taking snapshots/i)).toBeTruthy();
  });

  it('free tier gets neither lever, only the locked pitch', () => {
    useStore.__set({ auth: { tier: 'wanderer' }, setPurchaseModalOpen: vi.fn() });
    render(<VersionsTab save={savedWith([SNAP_EARLY, SNAP_LATE])} />);
    expect(screen.getByText('Cartographer · Version history')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Take a snapshot' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Compare' })).toBeNull();
  });
});

describe('VersionsTab — side-by-side comparison (queue #18)', () => {
  beforeEach(() => { flagMock.mockReturnValue(true); });
  afterEach(() => cleanup());

  it('asks for a second pick, then renders the comparison of the two chosen snapshots', async () => {
    useStore.__set(paidStore());
    render(<VersionsTab save={savedWith([SNAP_EARLY, SNAP_LATE])} />);

    const compareButtons = screen.getAllByRole('button', { name: 'Compare' });
    expect(compareButtons).toHaveLength(2);

    fireEvent.click(compareButtons[0]);
    expect(screen.getByText(/Pick a second snapshot to compare/i)).toBeTruthy();

    fireEvent.click(screen.getAllByRole('button', { name: 'Compare' })[0]);
    // The view is a lazy leaf, so it resolves asynchronously.
    expect(await screen.findByText('Comparing two snapshots')).toBeTruthy();
    // Known-different fixtures: population moved 2000 to 1500.
    expect(await screen.findByText('Population')).toBeTruthy();
    expect(screen.getByText('2000')).toBeTruthy();
    expect(screen.getByText('1500')).toBeTruthy();
  });

  it('orders the pair oldest-first no matter which was picked first', async () => {
    useStore.__set(paidStore());
    render(<VersionsTab save={savedWith([SNAP_EARLY, SNAP_LATE])} />);

    // Timeline is newest-first, so index 0 is the LATER snapshot; pick it first.
    fireEvent.click(screen.getAllByRole('button', { name: 'Compare' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Compare' })[0]);

    expect(await screen.findByText(/Before the siege.*to.*After the siege/s)).toBeTruthy();
  });

  it('closing the comparison clears both picks', async () => {
    useStore.__set(paidStore());
    render(<VersionsTab save={savedWith([SNAP_EARLY, SNAP_LATE])} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Compare' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Compare' })[0]);
    fireEvent.click(await screen.findByRole('button', { name: 'Close comparison' }));

    expect(screen.queryByText('Comparing two snapshots')).toBeNull();
    expect(screen.getAllByRole('button', { name: 'Compare' })).toHaveLength(2);
  });

  it('offers no comparison for a legacy entry that carries no stored settlement', () => {
    useStore.__set(paidStore());
    render(<VersionsTab save={savedWith([
      { id: 'snap-bare', ts: '2024-03-02T00:00:00Z', label: 'Payload-free' },
      SNAP_LATE,
    ])} />);
    // Both rows revert (revert addresses by id); only the one with content compares.
    expect(screen.getAllByRole('button', { name: /Revert to this snapshot/i })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Compare' })).toHaveLength(1);
  });
});
