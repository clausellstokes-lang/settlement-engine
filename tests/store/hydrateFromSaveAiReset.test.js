/**
 * tests/store/hydrateFromSaveAiReset.test.js — B11-store finding #6.
 *
 * hydrateFromSave previously set only `aiSettlement`, so a caller that opens a
 * settlement via hydrateFromSave alone (e.g. the deity-from-map picker, which
 * does NOT also call hydrateAiFromSave) carried the previously-open
 * settlement's aiDailyLife / showNarrative / aiDataVersion / aiSourceFingerprint.
 * That leaked another town's daily-life prose into the dossier, opened it in
 * narrative mode unexpectedly, and skewed isNarrativeStale.
 *
 * The fix resets the FULL AI session from the opened save's aiData blob. These
 * tests pin that single-call safety.
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town' },
  // AI session slots normally owned by aiSlice — present so hydrateFromSave can
  // reset them on the shared store.
  aiSettlement: null,
  aiDailyLife: null,
  aiDataVersion: null,
  aiSourceFingerprint: null,
  showNarrative: false,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

function bareSettlement(name) {
  return { name, tier: 'town', population: 1000, institutions: [], powerStructure: { factions: [] }, npcs: [] };
}

// Save A — fully narrated with daily-life prose.
const saveA = {
  id: 'save-a',
  settlement: bareSettlement('Mossbridge'),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
  aiData: {
    aiSettlement: { overview: 'A-narrative' },
    aiDailyLife: { dawn: 'A-dawn', night: 'A-night' },
    narrativeMode: 'narrated',
    narrativeGeneratedAt: '2026-02-01T00:00:00.000Z',
    narrativeSourceFingerprint: 'fp-A',
  },
};

// Save B — no AI data at all (never narrated).
const saveB = {
  id: 'save-b',
  settlement: bareSettlement('Stoneford'),
  campaignState: { phase: 'draft', eventLog: [], locks: {} },
};

describe('hydrateFromSave resets the full AI session (finding #6)', () => {
  let store;
  beforeEach(() => { store = makeStore(); });

  test('opening a non-narrated save after a narrated one does not leak AI prose/mode', () => {
    store.getState().hydrateFromSave(saveA);
    // Sanity: save A's AI session is loaded.
    expect(store.getState().aiSettlement).toEqual({ overview: 'A-narrative' });
    expect(store.getState().aiDailyLife).toEqual({ dawn: 'A-dawn', night: 'A-night' });
    expect(store.getState().showNarrative).toBe(true);
    expect(store.getState().aiSourceFingerprint).toBe('fp-A');
    expect(store.getState().aiDataVersion).toBe(new Date('2026-02-01T00:00:00.000Z').getTime());

    // Now open save B via hydrateFromSave ALONE (the deity-from-map path).
    store.getState().hydrateFromSave(saveB);

    // The previously-open AI session must be fully cleared, not carried over.
    expect(store.getState().aiSettlement).toBeNull();
    expect(store.getState().aiDailyLife).toBeNull();
    expect(store.getState().showNarrative).toBe(false);
    expect(store.getState().aiSourceFingerprint).toBeNull();
    expect(store.getState().aiDataVersion).toBeNull();
  });

  test('opening a narrated save populates the full AI session from its aiData', () => {
    store.getState().hydrateFromSave(saveB);   // start clean
    store.getState().hydrateFromSave(saveA);   // single call, no hydrateAiFromSave

    expect(store.getState().aiSettlement).toEqual({ overview: 'A-narrative' });
    expect(store.getState().aiDailyLife).toEqual({ dawn: 'A-dawn', night: 'A-night' });
    expect(store.getState().showNarrative).toBe(true);
    expect(store.getState().aiSourceFingerprint).toBe('fp-A');
  });

  test('a save with aiData but mode "raw" loads the narrative without forcing narrative mode', () => {
    const rawModeSave = {
      ...saveA,
      id: 'save-raw',
      aiData: { ...saveA.aiData, narrativeMode: 'raw' },
    };
    store.getState().hydrateFromSave(rawModeSave);
    expect(store.getState().aiSettlement).toEqual({ overview: 'A-narrative' });
    expect(store.getState().showNarrative).toBe(false);
  });
});
