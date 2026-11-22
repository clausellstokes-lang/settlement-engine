/**
 * @vitest-environment jsdom
 *
 * tests/ui/autoSaveChip.dirty.test.jsx — lock-in for AutoSaveChip's
 * CONTENT-AWARE dirty detection (RP-1 §134 data-integrity regression).
 *
 * The old fingerprint folded in only placement IDS + layer COUNTS, so a
 * drag-move (same placement id, new x/y) and a rename (same label count, new
 * text) both left the chip reading "Saved" over a genuinely dirty map — the
 * user trusts "Saved" and loses work. These tests drive those exact mutations
 * and assert the chip flips to "Unsaved changes".
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

afterEach(cleanup);

// Store mock — each test assigns `state`; the chip reads activeCampaignId,
// campaigns, and mapState off it through selectors.
let state = {};
vi.mock('../../src/store', () => {
  function useStore(selector) { return selector(state); }
  useStore.getState = () => state;
  return { useStore };
});

import AutoSaveChip from '../../src/components/map/AutoSaveChip.jsx';

const savedAt = new Date().toISOString();
const PERSISTED = {
  placements: { a: { x: 10, y: 10 }, b: { x: 20, y: 20 } },
  labels: [{ id: 'l1', x: 0, y: 0, text: 'Old Town' }],
  markers: [],
  forests: [],
  savedAt,
};

function mount(live) {
  state = {
    activeCampaignId: 'camp-1',
    campaigns: [{ id: 'camp-1', mapState: PERSISTED }],
    mapState: live,
  };
  render(<AutoSaveChip />);
}

describe('AutoSaveChip — content-aware dirty detection', () => {
  test('identical content reads "Saved", not dirty', () => {
    mount({ ...PERSISTED });
    expect(screen.queryByText('Unsaved changes')).toBeNull();
    expect(screen.getByRole('status').textContent).toMatch(/Saved/);
  });

  test('a drag-move (same placement id, new coords) flips to "Unsaved changes"', () => {
    mount({
      ...PERSISTED,
      placements: { a: { x: 99, y: 42 }, b: { x: 20, y: 20 } }, // "a" moved
    });
    expect(screen.getByText('Unsaved changes')).toBeTruthy();
  });

  test('a rename (same label count, new text) flips to "Unsaved changes"', () => {
    mount({
      ...PERSISTED,
      labels: [{ id: 'l1', x: 0, y: 0, text: 'New Name' }], // same id/count, renamed
    });
    expect(screen.getByText('Unsaved changes')).toBeTruthy();
  });
});
