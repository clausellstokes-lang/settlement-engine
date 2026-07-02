/**
 * @vitest-environment jsdom
 *
 * tests/ui/cascadePreviewLinkedSaves.test.jsx — CascadePreviewPanel "Linked
 * saves" count regression.
 *
 * The panel warns when other saved settlements link to the one being edited.
 * The count previously read `save.neighbourLinks` — a top-level field that
 * never exists — so it was always 0 and the warning never rendered. The real
 * neighbour list lives at `save.settlement.neighbourNetwork` (mirrored to the
 * Supabase row's `save.neighbour_links`), and each entry carries the linked
 * save's id as `id` (with `targetId` as an alternate key).
 *
 * This test drives the panel with saves that link via each real shape and
 * asserts the warning renders with the right count. Against the old code it
 * counts 0 and the warning is absent → the test fails.
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// previewCascade is pure; stub it to a minimal, warning-free delta so the
// only rendered warning-ish block under test is the "Linked saves" row.
vi.mock('../../src/domain/pendingEdits.js', () => ({
  previewCascade: () => ({
    summaryLines: [],
    downstreamCounts: { npcs: 0, factions: 0, hooks: 0 },
    narrativeImpact: 'none',
    warnings: [],
  }),
}));

// Store mock — a mutable singleton drives the three selectors the panel reads.
const storeState = {
  settlement: null,
  pendingEditsQueue: [],
  savedSettlements: [],
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

import CascadePreviewPanel from '../../src/components/dossier/CascadePreviewPanel.jsx';

beforeEach(() => {
  cleanup();
  storeState.settlement = null;
  storeState.pendingEditsQueue = [];
  storeState.savedSettlements = [];
});

describe('CascadePreviewPanel — linked-saves count', () => {
  test('counts saves that link via settlement.neighbourNetwork (id key)', () => {
    storeState.settlement = { id: 'town-A' };
    storeState.savedSettlements = [
      { id: 'save-1', settlement: { neighbourNetwork: [{ id: 'town-A', name: 'A' }] } },
      { id: 'save-2', settlement: { neighbourNetwork: [{ id: 'town-Z' }] } },
      { id: 'save-3', settlement: { neighbourNetwork: [{ targetId: 'town-A' }] } },
    ];

    render(<CascadePreviewPanel onClose={() => {}} onCommit={() => {}} />);

    // Two saves link to town-A (via id and via targetId).
    expect(screen.getByText(/2 saves link to this settlement/i)).toBeTruthy();
  });

  test('counts saves that link via the row-level neighbour_links mirror', () => {
    storeState.settlement = { id: 'town-A' };
    storeState.savedSettlements = [
      { id: 'save-1', neighbour_links: [{ id: 'town-A' }] },
    ];

    render(<CascadePreviewPanel onClose={() => {}} onCommit={() => {}} />);

    expect(screen.getByText(/1 save links to this settlement/i)).toBeTruthy();
  });

  test('renders no linked-saves warning when nothing links', () => {
    storeState.settlement = { id: 'town-A' };
    storeState.savedSettlements = [
      { id: 'save-1', settlement: { neighbourNetwork: [{ id: 'town-other' }] } },
    ];

    render(<CascadePreviewPanel onClose={() => {}} onCommit={() => {}} />);

    expect(screen.queryByText(/link to this settlement/i)).toBeNull();
  });
});
