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
import { render, screen, cleanup } from '@testing-library/react';

const flagMock = vi.fn(() => true);
vi.mock('../../src/lib/flags.js', () => ({ flag: (...a) => flagMock(...a) }));

vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { track: vi.fn() },
  EVENTS: { LOCKED_DESTINATION_SHOWN: 'locked_destination_shown' },
}));

vi.mock('../../src/store/index.js', () => {
  const data = { auth: { tier: 'wanderer' }, setPurchaseModalOpen: vi.fn() };
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  return { useStore };
});

import VersionsTab from '../../src/components/settlement/VersionsTab.jsx';
import { useStore } from '../../src/store/index.js';

describe('VersionsTab — X-7 locked-destination fold-in', () => {
  beforeEach(() => {
    flagMock.mockReturnValue(true);
    useStore.__set({ auth: { tier: 'wanderer' }, setPurchaseModalOpen: vi.fn() });
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
});
