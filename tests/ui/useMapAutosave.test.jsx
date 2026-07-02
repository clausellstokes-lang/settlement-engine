/**
 * @vitest-environment jsdom
 *
 * tests/ui/useMapAutosave.test.jsx — lock-in for the extracted map-autosave
 * hook (src/hooks/useMapAutosave.js).
 *
 * The hook was lifted byte-for-byte out of WorldMap.jsx. Its contract:
 *   • gated on flag('mapAutosave') AND an activeCampaignId — neither → no save;
 *   • only fires when the live mapState fingerprint ("dirty key") differs from
 *     the campaign's persisted mapState;
 *   • the save is debounced by 3500ms.
 *
 * We mock useStore (the selector returns the live mapState's dirty key; the
 * effect reads useStore.getState().mapState at fire time) and flag, then drive
 * the debounce with vitest fake timers.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';

afterEach(cleanup);

// ── flag mock — a mutable holder so each test sets the gate it needs. ──
let flagValue = true;
vi.mock('../../src/lib/flags.js', () => ({
  flag: (name) => (name === 'mapAutosave' ? flagValue : false),
}));

// ── store mock — `liveMapState` is what the selector + getState() see. ──
let liveMapState = { placements: {}, labels: [], markers: [], forests: [] };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector({ mapState: liveMapState });
  }
  useStore.getState = () => ({ mapState: liveMapState });
  return { useStore };
});

import { useMapAutosave, mapFingerprint } from '../../src/hooks/useMapAutosave.js';

beforeEach(() => {
  vi.useFakeTimers();
  flagValue = true;
  liveMapState = { placements: {}, labels: [], markers: [], forests: [] };
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('useMapAutosave', () => {
  test('does not save when the flag is off', () => {
    flagValue = false;
    liveMapState = { placements: { 1: { x: 1, y: 1 } }, labels: [], markers: [], forests: [] };
    const saveCampaignMap = vi.fn();
    // dirty key differs from the (empty) persisted map, but flag is off.
    renderHook(() => useMapAutosave('camp-1', { mapState: { placements: {} } }, saveCampaignMap));
    vi.advanceTimersByTime(4000);
    expect(saveCampaignMap).not.toHaveBeenCalled();
  });

  test('does not save when there is no active campaign', () => {
    liveMapState = { placements: { 1: { x: 1, y: 1 } }, labels: [], markers: [], forests: [] };
    const saveCampaignMap = vi.fn();
    renderHook(() => useMapAutosave(null, null, saveCampaignMap));
    vi.advanceTimersByTime(4000);
    expect(saveCampaignMap).not.toHaveBeenCalled();
  });

  test('does not save when the live map matches the persisted map', () => {
    // Both live and persisted have identical fingerprints → no dirty diff.
    const sameState = { placements: {}, labels: [], markers: [], forests: [] };
    liveMapState = sameState;
    const saveCampaignMap = vi.fn();
    renderHook(() => useMapAutosave('camp-1', { mapState: sameState }, saveCampaignMap));
    vi.advanceTimersByTime(4000);
    expect(saveCampaignMap).not.toHaveBeenCalled();
  });

  test('saves after the 3500ms debounce when flag on + campaign active + dirty', () => {
    // Live map has a placement; persisted map is empty → keys differ.
    liveMapState = { placements: { 7: { x: 1, y: 2 } }, labels: [], markers: [], forests: [] };
    const saveCampaignMap = vi.fn();
    renderHook(() => useMapAutosave('camp-1', { mapState: { placements: {} } }, saveCampaignMap));

    // Before the debounce elapses, nothing has fired.
    vi.advanceTimersByTime(3499);
    expect(saveCampaignMap).not.toHaveBeenCalled();

    // Crossing 3500ms fires the save with (campaignId, live mapState).
    vi.advanceTimersByTime(1);
    expect(saveCampaignMap).toHaveBeenCalledTimes(1);
    expect(saveCampaignMap).toHaveBeenCalledWith('camp-1', liveMapState);
  });

  // ── Regression: drag-moves / annotation edits must be observed. ──────────
  // The old fingerprint keyed only on placement *ids* + layer *counts*, so a
  // drag-move (same id set, same counts, different x/y) left the key unchanged
  // → no autosave, while the chip showed "Saved". These lock in that content
  // and coordinates now participate in the dirty diff.

  test('saves when a placement is drag-moved (same id, different coordinates)', () => {
    // Same burg id "7", moved from (1,2) to (99,42): id set + count unchanged.
    liveMapState = { placements: { 7: { x: 99, y: 42, cellId: 3 } }, labels: [], markers: [], forests: [] };
    const persisted = { placements: { 7: { x: 1, y: 2, cellId: 3 } }, labels: [], markers: [], forests: [] };
    const saveCampaignMap = vi.fn();
    renderHook(() => useMapAutosave('camp-1', { mapState: persisted }, saveCampaignMap));
    vi.advanceTimersByTime(3500);
    expect(saveCampaignMap).toHaveBeenCalledTimes(1);
    expect(saveCampaignMap).toHaveBeenCalledWith('camp-1', liveMapState);
  });

  test('saves when a label is renamed / moved (same id + count, different content)', () => {
    liveMapState = {
      placements: {},
      labels: [{ id: 'lbl_1', x: 10, y: 20, text: 'Renamed', rotation: 90 }],
      markers: [], forests: [],
    };
    const persisted = {
      placements: {},
      labels: [{ id: 'lbl_1', x: 5, y: 5, text: 'Original', rotation: 0 }],
      markers: [], forests: [],
    };
    const saveCampaignMap = vi.fn();
    renderHook(() => useMapAutosave('camp-1', { mapState: persisted }, saveCampaignMap));
    vi.advanceTimersByTime(3500);
    expect(saveCampaignMap).toHaveBeenCalledTimes(1);
  });

  test('mapFingerprint distinguishes coordinate and content edits across all layers', () => {
    const base = {
      placements: { 7: { x: 1, y: 2, cellId: 3, settlementId: 's1' } },
      labels: [{ id: 'l1', x: 0, y: 0, text: 'A', rotation: 0, fontSize: 12, color: '#000', fontFamily: 'serif' }],
      markers: [{ id: 'm1', x: 0, y: 0, icon: 'pin', color: '#f00', title: 'T', note: 'N' }],
      forests: [{ id: 'f1', x: 0, y: 0, radius: 5, density: 3, treeStyle: 'oak' }],
    };
    const same = JSON.parse(JSON.stringify(base));
    expect(mapFingerprint(base)).toBe(mapFingerprint(same));

    const movedPlacement = JSON.parse(JSON.stringify(base));
    movedPlacement.placements[7].x = 999;
    expect(mapFingerprint(movedPlacement)).not.toBe(mapFingerprint(base));

    const renamedLabel = JSON.parse(JSON.stringify(base));
    renamedLabel.labels[0].text = 'B';
    expect(mapFingerprint(renamedLabel)).not.toBe(mapFingerprint(base));

    const editedMarker = JSON.parse(JSON.stringify(base));
    editedMarker.markers[0].note = 'changed';
    expect(mapFingerprint(editedMarker)).not.toBe(mapFingerprint(base));

    const grownForest = JSON.parse(JSON.stringify(base));
    grownForest.forests[0].radius = 50;
    expect(mapFingerprint(grownForest)).not.toBe(mapFingerprint(base));
  });
});
