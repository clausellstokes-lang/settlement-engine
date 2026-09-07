/** @vitest-environment jsdom */
/**
 * versionDiffView.test.jsx — the side-by-side snapshot comparison (atlas queue
 * #18 BUILD).
 *
 * The comparison is only worth anything if it reads what the STORE actually
 * writes, so the load-bearing test here does not hand-roll a snapshot fixture:
 * it boots the real settlement slice, calls the real `recordSnapshot` twice
 * across a real edit, feeds the resulting saved entry through the real
 * `buildVersionTimeline`, and renders the view on what comes out. That path is
 * exactly where the payload-spelling defect lived (the store writes
 * `settlement`, the builder only read `snapshot`), and a fixture would have
 * agreed with the bug.
 *
 * The pure half (diffSnapshotFields) is tested directly on both registers it
 * covers: identity/scale fields and the authored prose paths.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

import VersionDiffView, { diffSnapshotFields, fieldText } from '../../src/components/settlement/VersionDiffView.jsx';
import { buildVersionTimeline } from '../../src/components/settlement/VersionsTab.jsx';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const SAVE_ID = 'save-1';

function makeStore() {
  const useStore = create(immer((set, get, store) => createSettlementSlice(set, get, store)));
  useStore.setState({
    activeSaveId: SAVE_ID,
    settlement: {
      name: 'Hollowmere',
      tier: 'town',
      population: 2000,
      arrivalScene: 'Mud to the ankle and a bell that will not stop.',
    },
    savedSettlements: [{ id: SAVE_ID, settlement: { name: 'Hollowmere' } }],
  });
  return useStore;
}

describe('diffSnapshotFields — the table half', () => {
  it('returns no rows for identical payloads', () => {
    const s = { name: 'Hollowmere', tier: 'town', population: 2000 };
    expect(diffSnapshotFields(s, { ...s })).toEqual([]);
  });

  it('returns no rows when either side is missing', () => {
    expect(diffSnapshotFields(null, { name: 'A' })).toEqual([]);
    expect(diffSnapshotFields({ name: 'A' }, null)).toEqual([]);
  });

  it('names an identity change in plain words', () => {
    const rows = diffSnapshotFields(
      { name: 'Hollowmere', population: 2000 },
      { name: 'Hollowmere', population: 2400 },
    );
    expect(rows).toEqual([
      { path: 'population', label: 'Population', before: '2000', after: '2400' },
    ]);
  });

  it('reaches a nested authored-prose path and labels it', () => {
    const rows = diffSnapshotFields(
      { history: { founding: { reason: 'A ford worth taxing.' } } },
      { history: { founding: { reason: 'A ford worth defending.' } } },
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].label).toBe('Founding reason');
    expect(rows[0].before).toBe('A ford worth taxing.');
    expect(rows[0].after).toBe('A ford worth defending.');
  });

  it('treats absent and empty as the same value, so no phantom row appears', () => {
    expect(diffSnapshotFields({ name: 'A' }, { name: 'A', arrivalScene: undefined })).toEqual([]);
    expect(fieldText(undefined)).toBe('');
    expect(fieldText(null)).toBe('');
  });

  it('flattens the array-valued origin note (settlementReason) into text', () => {
    const rows = diffSnapshotFields(
      { settlementReason: ['A ford.', 'A shrine.'] },
      { settlementReason: ['A ford.'] },
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].label).toBe('Origin note');
    expect(rows[0].before).toBe('A ford.\n\nA shrine.');
  });
});

describe('VersionDiffView — rendering', () => {
  afterEach(() => cleanup());

  const earlier = { id: 'a', ts: '2024-03-01T00:00:00Z', label: 'Before session 3', snapshot: { name: 'Hollowmere', population: 2000 } };
  const later = { id: 'b', ts: '2024-03-10T00:00:00Z', label: 'After session 3', snapshot: { name: 'Hollowmere', population: 2400 } };

  it('renders a table row for a known-different field, in both directions', () => {
    render(<VersionDiffView earlier={earlier} later={later} />);
    expect(screen.getByText('Population')).toBeTruthy();
    expect(screen.getByText('2000')).toBeTruthy();
    expect(screen.getByText('2400')).toBeTruthy();
  });

  it('names both endpoints so the reader knows which way the comparison runs', () => {
    render(<VersionDiffView earlier={earlier} later={later} />);
    expect(screen.getByText(/Before session 3.*to.*After session 3/s)).toBeTruthy();
  });

  it('says so plainly when two snapshots read the same', () => {
    render(<VersionDiffView earlier={earlier} later={{ ...later, snapshot: earlier.snapshot }} />);
    expect(screen.getByText(/These two snapshots read the same/i)).toBeTruthy();
  });

  it('refuses rather than half-renders when an entry carries no payload', () => {
    render(<VersionDiffView earlier={{ id: 'a', ts: earlier.ts }} later={later} />);
    expect(screen.getByText(/nothing to compare/i)).toBeTruthy();
    expect(screen.queryByText('Population')).toBeNull();
  });
});

describe('VersionDiffView — against the REAL recordSnapshot payload shape', () => {
  let useStore;
  beforeEach(() => { useStore = makeStore(); });
  afterEach(() => cleanup());

  it('diffs two snapshots the store actually wrote, routed through buildVersionTimeline', () => {
    useStore.getState().recordSnapshot({ saveId: SAVE_ID, kind: 'manual', label: 'Before the siege' });

    // A real edit between the two checkpoints.
    useStore.setState(s => { s.settlement.population = 1500; });

    useStore.getState().recordSnapshot({ saveId: SAVE_ID, kind: 'manual', label: 'After the siege' });

    const saveEntry = useStore.getState().savedSettlements.find(e => e.id === SAVE_ID);
    expect(saveEntry.versionHistory).toHaveLength(2);

    const entries = buildVersionTimeline(saveEntry);
    const snaps = entries.filter(e => e.kind === 'snapshot');
    expect(snaps).toHaveLength(2);
    // The payload-spelling repair: the builder must surface the store's
    // `settlement` payload, and must mark the entries comparable.
    for (const s of snaps) {
      expect(s.snapshot).toBeTruthy();
      expect(s.comparable).toBe(true);
    }

    const before = snaps.find(s => s.label === 'Before the siege');
    const after = snaps.find(s => s.label === 'After the siege');
    expect(diffSnapshotFields(before.snapshot, after.snapshot)).toEqual([
      { path: 'population', label: 'Population', before: '2000', after: '1500' },
    ]);

    render(<VersionDiffView earlier={before} later={after} />);
    expect(screen.getByText('Population')).toBeTruthy();
    expect(screen.getByText('1500')).toBeTruthy();
  });
});
