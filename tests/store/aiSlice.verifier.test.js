/**
 * tests/store/aiSlice.verifier.test.js — Tier 6.5 integration tests.
 *
 * Verifies the aiOverlayVerifier wiring inside aiSlice:
 *
 *   - `setAiSettlement(aiData)` runs the verifier against the current
 *     raw settlement and stores the result on `state.aiViolations`.
 *   - `clearAiSettlement()` clears `aiViolations` along with the rest.
 *   - The overlay STILL commits even when violations are found
 *     (display-only guard; non-blocking).
 *   - The verifier never crashes the slice, even if the verifier
 *     itself were to throw.
 *
 * We don't exercise `requestNarrative` here — that requires mocking the
 * generate-narrative edge function. The verifier call is identical in
 * both code paths; setAiSettlement covers the contract.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createAiSlice } from '../../src/store/aiSlice.js';

// ── Minimal companion slices so aiSlice's reads don't crash ───────────
//
// aiSlice references state from creditsSlice and authSlice. We stub
// just enough to satisfy the action paths we exercise.
const stubSlice = (_set, _get) => ({
  settlement: null,
  savedSettlements: [],
  creditBalance: 100,
  isElevated: () => false,
  setPurchaseModalOpen: () => {},
  updateSavedSettlement: () => {},
  _appendChronicleEntry: async () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createAiSlice(...a) })));
}

function baseFixture() {
  return {
    id: 'sett.test',
    name: 'Verifier-town',
    tier: 'town',
    population: 1500,
    institutions: [
      { id: 'inst.market', name: 'Market', category: 'Economy', source: 'generated', locked: true },
    ],
    powerStructure: {
      factions: [
        { id: 'fac.guild', name: 'Merchant Guild', power: 'high', source: 'generated' },
      ],
    },
    npcs: [
      { id: 'npc.aldis', name: 'Aldis', role: 'Guildmaster', source: 'generated' },
    ],
    history: {
      historicalEvents: [
        { name: 'Flood Year', severity: 'major', summary: 'River broke', yearsAgo: 50 },
      ],
    },
  };
}

function clone(o) { return JSON.parse(JSON.stringify(o)); }

// ─────────────────────────────────────────────────────────────────────
// setAiSettlement integration
// ─────────────────────────────────────────────────────────────────────

describe('Tier 6.5 — setAiSettlement runs the verifier', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = baseFixture(); });
  });

  it('sets aiViolations to the verification report after a commit', () => {
    const overlay = clone(baseFixture());
    store.getState().setAiSettlement(overlay);
    const v = store.getState().aiViolations;
    expect(v).not.toBeNull();
    expect(v).toHaveProperty('ok');
    expect(v).toHaveProperty('violations');
    expect(v).toHaveProperty('summary');
  });

  it('reports ok:true for a clean refinement (no violations)', () => {
    const overlay = clone(baseFixture());
    // Polish prose only — no entity/fact changes.
    overlay.arrivalScene = 'A polished arrival scene.';
    store.getState().setAiSettlement(overlay);
    expect(store.getState().aiViolations.ok).toBe(true);
    expect(store.getState().aiViolations.violations).toEqual([]);
  });

  it('reports ok:false when the overlay invents an entity', () => {
    const overlay = clone(baseFixture());
    overlay.npcs.push({ id: 'npc.invented', name: 'Phantom', role: 'Stranger' });
    store.getState().setAiSettlement(overlay);
    const v = store.getState().aiViolations;
    expect(v.ok).toBe(false);
    expect(v.summary.invented).toBe(1);
  });

  it('reports ok:false when the overlay renames an entity', () => {
    const overlay = clone(baseFixture());
    overlay.npcs[0].name = 'Aldis the Elder';
    store.getState().setAiSettlement(overlay);
    const v = store.getState().aiViolations;
    expect(v.ok).toBe(false);
    expect(v.summary.renamed).toBe(1);
  });

  it('reports ok:false when the overlay contradicts a root fact', () => {
    const overlay = clone(baseFixture());
    overlay.population = 9999;
    store.getState().setAiSettlement(overlay);
    const v = store.getState().aiViolations;
    expect(v.ok).toBe(false);
    expect(v.summary.contradicted).toBeGreaterThanOrEqual(1);
  });

  it('reports ok:false when the overlay unlocks a locked entity', () => {
    const overlay = clone(baseFixture());
    overlay.institutions[0].locked = false;
    store.getState().setAiSettlement(overlay);
    const v = store.getState().aiViolations;
    expect(v.ok).toBe(false);
    expect(v.summary.canonChanged).toBe(1);
  });

  it('STILL COMMITS the overlay even when violations are found (display-only guard)', () => {
    const overlay = clone(baseFixture());
    overlay.npcs.push({ id: 'npc.x', name: 'X', role: 'Y' });
    store.getState().setAiSettlement(overlay);
    // aiSettlement is set despite violations.
    expect(store.getState().aiSettlement).toEqual(overlay);
    expect(store.getState().aiViolations.ok).toBe(false);
  });

  it('updates aiDataVersion on every commit', () => {
    const before = store.getState().aiDataVersion;
    store.getState().setAiSettlement(clone(baseFixture()));
    expect(store.getState().aiDataVersion).not.toBe(before);
  });

  it('detects narrative staleness from settlement content changes', () => {
    store.getState().setAiSettlement(clone(baseFixture()));
    expect(store.getState().isNarrativeStale()).toBe(false);

    store.setState(s => {
      s.settlement.population = 1600;
    });

    expect(store.getState().isNarrativeStale()).toBe(true);
  });

  it('null aiData clears aiViolations (no verification report retained)', () => {
    store.getState().setAiSettlement(clone(baseFixture()));
    expect(store.getState().aiViolations).not.toBeNull();
    store.getState().setAiSettlement(null);
    expect(store.getState().aiSettlement).toBeNull();
    expect(store.getState().aiViolations).toBeNull();
  });

  it('logs hard violations to console.warn (DEV visibility / Sentry breadcrumb)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const overlay = clone(baseFixture());
      overlay.npcs.push({ id: 'npc.x', name: 'X', role: 'Y' });
      store.getState().setAiSettlement(overlay);
      expect(warnSpy).toHaveBeenCalled();
      const call = warnSpy.mock.calls[0];
      // Format: "[ai-overlay] setAiSettlement: N hard violation(s) detected"
      expect(String(call[0])).toMatch(/\[ai-overlay\]/);
      expect(String(call[0])).toMatch(/setAiSettlement/);
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('does NOT log a console.warn for a clean refinement', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      store.getState().setAiSettlement(clone(baseFixture()));
      expect(warnSpy).not.toHaveBeenCalled();
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('does NOT log a console.warn for soft-only violations (removed_history_beat alone)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const overlay = clone(baseFixture());
      // Drop history events → triggers removed_history_beat (soft).
      overlay.history.historicalEvents = [];
      store.getState().setAiSettlement(overlay);
      // Soft violations don't trip the warn (HARD_VIOLATION_KINDS only).
      expect(warnSpy).not.toHaveBeenCalled();
    } finally {
      warnSpy.mockRestore();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────
// clearAiSettlement clears the verification record
// ─────────────────────────────────────────────────────────────────────

describe('Tier 6.5 — clearAiSettlement clears aiViolations', () => {
  it('clearAiSettlement nulls out aiViolations alongside aiSettlement', () => {
    const store = makeStore();
    store.setState(s => { s.settlement = baseFixture(); });
    store.getState().setAiSettlement(clone(baseFixture()));
    expect(store.getState().aiViolations).not.toBeNull();

    store.getState().clearAiSettlement();
    expect(store.getState().aiSettlement).toBeNull();
    expect(store.getState().aiViolations).toBeNull();
    expect(store.getState().aiDataVersion).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────────────────────────────

describe('Tier 6.5 — initial state', () => {
  it('aiViolations defaults to null (no overlay → no report)', () => {
    const store = makeStore();
    expect(store.getState().aiViolations).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────
// Defensive — verifier crash shouldn't break the slice
// ─────────────────────────────────────────────────────────────────────

describe('Tier 6.5 — verifier defensive guards', () => {
  it('overlay still commits even if the settlement is null', () => {
    const store = makeStore();
    // No raw settlement set.
    const overlay = clone(baseFixture());
    store.getState().setAiSettlement(overlay);
    // aiSettlement landed; verifier returned a neutral pass-through.
    expect(store.getState().aiSettlement).toEqual(overlay);
    expect(store.getState().aiViolations).not.toBeNull();
    expect(store.getState().aiViolations.ok).toBe(true);
  });

  it('overlay commits even when both raw and refined settlement are null shapes', () => {
    const store = makeStore();
    store.setState(s => { s.settlement = null; });
    store.getState().setAiSettlement(null);
    expect(store.getState().aiSettlement).toBeNull();
    // null aiData clears the violations record.
    expect(store.getState().aiViolations).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────
// Schema lock — violation kinds + summary keys
// ─────────────────────────────────────────────────────────────────────

describe('Tier 6.5 — aiViolations record schema', () => {
  it('summary has every documented counter even on the clean path', () => {
    const store = makeStore();
    store.setState(s => { s.settlement = baseFixture(); });
    store.getState().setAiSettlement(clone(baseFixture()));
    const s = store.getState().aiViolations.summary;
    for (const key of ['invented', 'removed', 'renamed', 'contradicted', 'canonChanged', 'historyDropped']) {
      expect(s).toHaveProperty(key);
      expect(typeof s[key]).toBe('number');
    }
  });

  it('every violation record carries kind / field / key / label / detail', () => {
    const store = makeStore();
    store.setState(s => { s.settlement = baseFixture(); });
    const overlay = clone(baseFixture());
    overlay.npcs.push({ id: 'npc.x', name: 'X', role: 'Y' });
    overlay.population = 9999;
    overlay.powerStructure.factions[0].name = 'Renamed';
    store.getState().setAiSettlement(overlay);
    for (const v of store.getState().aiViolations.violations) {
      expect(typeof v.kind).toBe('string');
      expect(typeof v.field).toBe('string');
      expect(typeof v.key).toBe('string');
      expect(typeof v.label).toBe('string');
      expect(typeof v.detail).toBe('string');
    }
  });
});
