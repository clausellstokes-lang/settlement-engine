/** @vitest-environment jsdom */
/**
 * autoSaveChip.test.jsx - Contract over P136 / M-5 save-state pill.
 *
 * Pins:
 *   • Hidden when no active campaign (chip would be misleading).
 *   • Renders "Saved <relative>" when the campaign mapState matches
 *     the live mapState (clean).
 *   • Renders "Unsaved changes" when placements diverge.
 *   • Renders "Saving..." when the saving prop is true.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import AutoSaveChip from '../../src/components/map/AutoSaveChip.jsx';

const NOW = 1_700_000_000_000; // arbitrary fixed timestamp

vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => true),
  __setFlag: vi.fn(),
}));

// Mock the store; each test replaces what useStore returns.
vi.mock('../../src/store', () => {
  const data = {
    activeCampaignId: null,
    campaigns: [],
    mapState: {},
  };
  function useStore(selector) {
    return selector(data);
  }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => Object.assign(data, {
    activeCampaignId: null,
    campaigns: [],
    mapState: {},
  });
  return { useStore };
});

import { useStore } from '../../src/store';

describe('AutoSaveChip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    useStore.__reset();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders nothing when there is no active campaign', () => {
    useStore.__set({ activeCampaignId: null });
    const { container } = render(<AutoSaveChip />);
    expect(container.firstChild).toBeNull();
  });

  it('renders "Saved <relative>" when live matches persisted', () => {
    const savedAt = new Date(NOW - 5 * 60_000).toISOString(); // 5 min ago
    useStore.__set({
      activeCampaignId: 'c1',
      campaigns: [{
        id: 'c1',
        mapState: {
          savedAt,
          placements: { b1: { settlementId: 's1' } },
          labels: [], markers: [], forests: [],
        },
      }],
      mapState: {
        placements: { b1: { settlementId: 's1' } },
        labels: [], markers: [], forests: [],
      },
    });
    render(<AutoSaveChip />);
    expect(screen.getByText(/Saved 5 min ago/)).toBeTruthy();
  });

  it('renders "Unsaved changes" when placements diverge', () => {
    const savedAt = new Date(NOW - 60_000).toISOString();
    useStore.__set({
      activeCampaignId: 'c1',
      campaigns: [{
        id: 'c1',
        mapState: {
          savedAt,
          placements: { b1: { settlementId: 's1' } },
          labels: [], markers: [], forests: [],
        },
      }],
      mapState: {
        // b2 added since the last save
        placements: { b1: { settlementId: 's1' }, b2: { settlementId: 's2' } },
        labels: [], markers: [], forests: [],
      },
    });
    render(<AutoSaveChip />);
    expect(screen.getByText('Unsaved changes')).toBeTruthy();
  });

  it('renders "Saving..." when saving=true', () => {
    const savedAt = new Date(NOW - 60_000).toISOString();
    useStore.__set({
      activeCampaignId: 'c1',
      campaigns: [{
        id: 'c1',
        mapState: {
          savedAt,
          placements: {},
          labels: [], markers: [], forests: [],
        },
      }],
      mapState: { placements: {}, labels: [], markers: [], forests: [] },
    });
    render(<AutoSaveChip saving />);
    expect(screen.getByText('Saving...')).toBeTruthy();
  });

  it('renders "just now" when saved in the last 60 seconds', () => {
    const savedAt = new Date(NOW - 10_000).toISOString();
    useStore.__set({
      activeCampaignId: 'c1',
      campaigns: [{
        id: 'c1',
        mapState: {
          savedAt,
          placements: {},
          labels: [], markers: [], forests: [],
        },
      }],
      mapState: { placements: {}, labels: [], markers: [], forests: [] },
    });
    render(<AutoSaveChip />);
    expect(screen.getByText(/just now/)).toBeTruthy();
  });
});
