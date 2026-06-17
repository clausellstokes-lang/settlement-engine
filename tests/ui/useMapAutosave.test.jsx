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

import { useMapAutosave } from '../../src/hooks/useMapAutosave.js';

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
});
