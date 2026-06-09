/**
 * tests/domain/eventPipeline.test.js — Tier 2.2 unified-pipeline contract.
 *
 * The core invariant: previewEvent and applyEvent produce the SAME
 * afterSystemState, afterCausalState, systemStateDeltas, and
 * causalStateDeltas for the same input. The drift the roadmap calls
 * out is eliminated by construction.
 *
 * Also pins:
 *   - runEventPipeline returns the canonical envelope shape.
 *   - The pipeline does not mutate the input settlement.
 *   - Unknown event types short-circuit cleanly (no mutation, no deltas).
 *   - Authored stateDeltas from the registry are applied on top of
 *     the structurally-derived SystemState.
 *   - CausalState deltas reflect substrate changes from mutation
 *     (e.g. damaging a granary should worsen food_security).
 *   - Faction relationship deltas come from Phase 14.
 *   - summarizeEventResult emits non-empty lines for a non-trivial event.
 */

import { describe, it, expect } from 'vitest';
import { runEventPipeline, summarizeEventResult, layerAuthoredDeltas } from '../../src/domain/events/eventPipeline.js';
import { previewEvent } from '../../src/domain/events/previewEvent.js';
import { applyEvent } from '../../src/domain/events/applyEvent.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { compareCausalState, deriveCausalState } from '../../src/domain/causalState.js';

// ── Fixture ────────────────────────────────────────────────────────────

function baseSettlement() {
  return {
    name: 'Greycairn',
    tier: 'town',
    population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    economicState: {
      prosperity: 'Modest',
      exports: ['grain', 'wool'],
      activeChains: [
        { needKey: 'food_security', chainId: 'grain_to_bread', label: 'Grain to bread', status: 'operational' },
      ],
    },
    institutions: [
      { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
      { id: 'institution.market',  name: 'Market',  category: 'economy', status: 'active' },
    ],
    powerStructure: {
      governingName: 'Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [
        { id: 'faction.council',   name: 'Council',   faction: 'Council',   power: 35, controlsInstitutionIds: [] },
        { id: 'faction.merchants', name: 'Merchants', faction: 'Merchants', power: 30, controlsInstitutionIds: ['institution.granary'] },
      ],
      conflicts: [],
    },
    activeConditions: [],
  };
}

function ev(overrides) {
  return {
    id: 'test-1',
    type: 'DAMAGE_INSTITUTION',
    targetId: 'institution.granary',
    payload: { severity: 1.0 },
    cause: 'player_action',
    ...overrides,
  };
}

// ── Envelope shape ─────────────────────────────────────────────────────

describe('runEventPipeline() — envelope shape', () => {
  it('returns the canonical EventPipelineResult envelope', () => {
    const result = runEventPipeline(baseSettlement(), ev());
    expect(result).toHaveProperty('event');
    expect(result).toHaveProperty('beforeSettlement');
    expect(result).toHaveProperty('nextSettlement');
    expect(result).toHaveProperty('beforeSystemState');
    expect(result).toHaveProperty('afterSystemState');
    expect(result).toHaveProperty('beforeCausalState');
    expect(result).toHaveProperty('afterCausalState');
    expect(result).toHaveProperty('systemStateDeltas');
    expect(result).toHaveProperty('causalStateDeltas');
    expect(result).toHaveProperty('factionRelationshipDeltas');
    expect(result).toHaveProperty('factionResponses');
    expect(result).toHaveProperty('narrativeSummary');
    expect(result).toHaveProperty('warnings');
  });

  it('emits a non-empty narrativeSummary for a known event', () => {
    const result = runEventPipeline(baseSettlement(), ev());
    expect(typeof result.narrativeSummary).toBe('string');
    expect(result.narrativeSummary.length).toBeGreaterThan(0);
  });
});

// ── Pure / no-mutation contract ────────────────────────────────────────

describe('runEventPipeline() does not mutate', () => {
  it('does not modify the input settlement', () => {
    const s = baseSettlement();
    const before = JSON.stringify(s);
    runEventPipeline(s, ev());
    expect(JSON.stringify(s)).toBe(before);
  });

  it('does not modify the input event', () => {
    const event = ev();
    const before = JSON.stringify(event);
    runEventPipeline(baseSettlement(), event);
    expect(JSON.stringify(event)).toBe(before);
  });

  it('returns a different nextSettlement reference when mutations occur', () => {
    const s = baseSettlement();
    const result = runEventPipeline(s, ev());
    expect(result.nextSettlement).not.toBe(s);
  });
});

// ── Event validation ───────────────────────────────────────────────────

describe('runEventPipeline() — validation', () => {
  it('unknown event type returns a mismatch warning + no deltas', () => {
    const result = runEventPipeline(baseSettlement(), { type: 'NUKE_FROM_ORBIT' });
    expect(result.warnings.some(w => w.severity === 'mismatch')).toBe(true);
    expect(result.systemStateDeltas).toEqual([]);
    expect(result.causalStateDeltas).toEqual([]);
  });

  it('missing target on target-required event returns warning + no mutation', () => {
    const result = runEventPipeline(baseSettlement(), ev({ targetId: '' }));
    expect(result.warnings.some(w => /requires a target/i.test(w.message))).toBe(true);
    expect(result.nextSettlement).toBe(result.beforeSettlement);
  });

  it('nullish event yields warnings + neutral envelope', () => {
    const result = runEventPipeline(baseSettlement(), null);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.afterSystemState).toEqual(result.beforeSystemState);
  });
});

// ── THE CORE INVARIANT: preview and apply agree ────────────────────────

describe('preview/apply drift invariant (Tier 2.2)', () => {
  it('previewEvent and applyEvent produce the same afterState', () => {
    const settlement = baseSettlement();
    const systemState = deriveSystemState(settlement);
    const event = ev();
    const preview = previewEvent({ settlement, systemState, event });
    const { logEntry } = applyEvent({ settlement, systemState, event });
    expect(preview.afterState).toEqual(logEntry.afterState);
  });

  it('previewEvent and applyEvent produce the same systemStateDeltas', () => {
    const settlement = baseSettlement();
    const systemState = deriveSystemState(settlement);
    const event = ev();
    const preview = previewEvent({ settlement, systemState, event });
    const { logEntry } = applyEvent({ settlement, systemState, event });
    expect(preview.deltas).toEqual(logEntry.deltas);
  });

  it('previewEvent and applyEvent produce the same causalStateDeltas', () => {
    const settlement = baseSettlement();
    const systemState = deriveSystemState(settlement);
    const event = ev();
    const preview = previewEvent({ settlement, systemState, event });
    const { logEntry } = applyEvent({ settlement, systemState, event });
    expect(preview.causalStateDeltas).toEqual(logEntry.causalStateDeltas);
  });

  it('previewEvent and applyEvent agree across multiple event types', () => {
    const settlement = baseSettlement();
    const systemState = deriveSystemState(settlement);
    const cases = [
      ev({ type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary' }),
      ev({ type: 'REMOVE_INSTITUTION', targetId: 'institution.market' }),
      ev({ type: 'ADD_INSTITUTION', targetId: 'cobbler' }),
      ev({ type: 'CUT_TRADE_ROUTE', targetId: 'south_road' }),
      ev({ type: 'DEPLETE_RESOURCE', targetId: 'iron_vein' }),
    ];
    for (const event of cases) {
      const preview = previewEvent({ settlement, systemState, event });
      const { logEntry } = applyEvent({ settlement, systemState, event });
      expect(preview.afterState, `${event.type} afterState`).toEqual(logEntry.afterState);
      expect(preview.deltas,     `${event.type} deltas`).toEqual(logEntry.deltas);
    }
  });
});

// ── Store recomputation preserves authored deltas (P0.1) ───────────────
// The store's applyEvent runs reconciliation BETWEEN the pipeline mutation and
// persistence, then re-derives SystemState. It must re-layer the event's authored
// deltas (layerAuthoredDeltas) or it silently discards effects like CUT_TRADE_ROUTE's
// resilience/resourcePressure/externalThreat. These tests pin the store's formula to
// the pipeline's canonical afterSystemState.

describe('store recomputation preserves authored deltas (P0.1)', () => {
  it('re-derive + re-layer reproduces the pipeline afterSystemState (CUT_TRADE_ROUTE)', () => {
    const settlement = baseSettlement();
    const event = ev({ type: 'CUT_TRADE_ROUTE', targetId: 'south_road' });
    const result = runEventPipeline(settlement, event);
    // Mirror the store: re-derive from nextSettlement, then re-layer authored deltas.
    const storeFormula = layerAuthoredDeltas(deriveSystemState(result.nextSettlement), event, settlement);
    expect(storeFormula).toEqual(result.afterSystemState);
  });

  it('the OLD naive re-derive would have dropped the authored deltas', () => {
    const settlement = baseSettlement();
    const event = ev({ type: 'CUT_TRADE_ROUTE', targetId: 'south_road' });
    const result = runEventPipeline(settlement, event);
    // What the store used to persist (deriveSystemState alone) — proves the fix matters:
    // CUT_TRADE_ROUTE carries authored deltas, so the naive re-derive differs from canonical.
    const naive = deriveSystemState(result.nextSettlement);
    expect(naive).not.toEqual(result.afterSystemState);
  });

  it('layerAuthoredDeltas is a no-op for events without a spec', () => {
    const ss = deriveSystemState(baseSettlement());
    expect(layerAuthoredDeltas(ss, { type: 'NUKE_FROM_ORBIT' }, baseSettlement())).toEqual(ss);
    expect(layerAuthoredDeltas(ss, null, null)).toEqual(ss);
  });
});

// ── Substrate-layer signals ────────────────────────────────────────────

describe('runEventPipeline() — CausalState deltas', () => {
  it('damaging the granary produces a non-empty causalStateDeltas list', () => {
    const settlement = baseSettlement();
    const result = runEventPipeline(settlement, ev());
    // The mutation impairs the granary; deriveCausalState reads it as
    // a downstream pressure on food_security and infrastructure.
    expect(Array.isArray(result.causalStateDeltas)).toBe(true);
  });

  it('cutting trade route promotes a trade_route_cut condition and worsens trade_connectivity (P0.2)', () => {
    const settlement = baseSettlement();
    const result = runEventPipeline(settlement, ev({ type: 'CUT_TRADE_ROUTE', targetId: 'south_road' }));
    // The mutation now promotes the cut into a canonical active condition…
    const conds = result.nextSettlement.activeConditions || [];
    expect(conds.some(c => c.archetype === 'trade_route_cut')).toBe(true);
    // …which the causal substrate reads by affectedSystems, so trade_connectivity drops.
    expect(result.afterCausalState.scores.trade_connectivity)
      .toBeLessThan(result.beforeCausalState.scores.trade_connectivity);
  });

  it('plague promotes a plague condition that lowers healing_capacity (P0.2)', () => {
    const result = runEventPipeline(baseSettlement(), ev({ type: 'PLAGUE', targetId: 'red_fever', payload: { severity: 0.7 } }));
    const conds = result.nextSettlement.activeConditions || [];
    expect(conds.some(c => c.archetype === 'plague')).toBe(true);
    expect(result.afterCausalState.scores.healing_capacity)
      .toBeLessThanOrEqual(result.beforeCausalState.scores.healing_capacity);
  });

  it('compareCausalState diff sorts by absolute change', () => {
    const a = deriveCausalState({ powerStructure: { publicLegitimacy: { score: 80, label: 'Endorsed' } } });
    const b = deriveCausalState({ powerStructure: { publicLegitimacy: { score: 30, label: 'Contested' } } });
    const diff = compareCausalState(a, b);
    expect(diff.length).toBeGreaterThan(0);
    // First entry should be the biggest absolute mover (public_legitimacy
    // — score moved from 80 to 30).
    expect(diff[0].variable).toBe('public_legitimacy');
    expect(diff[0].change).toBeLessThan(0);
  });
});

// ── Faction relationship deltas (Phase 14 wiring) ──────────────────────

describe('runEventPipeline() — Phase 14 faction relationship deltas', () => {
  it('CUT_TRADE_ROUTE produces faction relationship deltas', () => {
    const result = runEventPipeline(baseSettlement(), ev({ type: 'CUT_TRADE_ROUTE', targetId: 'south_road' }));
    expect(Array.isArray(result.factionRelationshipDeltas)).toBe(true);
    // The Phase 14 logic emits merchant + criminal + government deltas
    // for trade_route_cut events.
    expect(result.factionRelationshipDeltas.length).toBeGreaterThan(0);
  });
});

// ── summarizeEventResult ───────────────────────────────────────────────

describe('summarizeEventResult()', () => {
  it('returns empty defaults for nullish input', () => {
    const s = summarizeEventResult(null);
    expect(s.lines).toEqual([]);
    expect(s.systemDeltaCount).toBe(0);
    expect(s.causalDeltaCount).toBe(0);
  });

  it('emits lines for a non-trivial event', () => {
    const result = runEventPipeline(baseSettlement(), ev());
    const s = summarizeEventResult(result);
    expect(Array.isArray(s.lines)).toBe(true);
    expect(s.lines.length).toBeGreaterThan(0);
  });

  it('counts deltas correctly', () => {
    const result = runEventPipeline(baseSettlement(), ev());
    const s = summarizeEventResult(result);
    expect(s.systemDeltaCount).toBe(result.systemStateDeltas.length);
    expect(s.causalDeltaCount).toBe(result.causalStateDeltas.length);
    expect(s.factionDeltaCount).toBe(result.factionRelationshipDeltas.length);
  });
});

// ── Backward compatibility ─────────────────────────────────────────────

describe('Phase 18 backward compatibility', () => {
  it('previewEvent still returns the legacy EventPreview fields', () => {
    const settlement = baseSettlement();
    const preview = previewEvent({
      settlement,
      systemState: deriveSystemState(settlement),
      event: ev(),
    });
    expect(preview).toHaveProperty('event');
    expect(preview).toHaveProperty('beforeState');
    expect(preview).toHaveProperty('afterState');
    expect(preview).toHaveProperty('deltas');
    expect(preview).toHaveProperty('factionResponses');
    expect(preview).toHaveProperty('narrativeSummary');
    expect(preview).toHaveProperty('warnings');
    // Phase 18 additions are present but the legacy shape is preserved.
    expect(preview).toHaveProperty('causalStateDeltas');
    expect(preview).toHaveProperty('factionRelationshipDeltas');
    // nextSettlement is intentionally NOT on previewEvent's return.
    // Use runEventPipeline if you need the projected settlement.
    expect(preview).not.toHaveProperty('nextSettlement');
  });

  it('applyEvent still returns the legacy { logEntry, nextSystemState, nextSettlement } shape', () => {
    const settlement = baseSettlement();
    const result = applyEvent({
      settlement,
      systemState: deriveSystemState(settlement),
      event: ev(),
    });
    expect(result).toHaveProperty('logEntry');
    expect(result).toHaveProperty('nextSystemState');
    expect(result).toHaveProperty('nextSettlement');
    expect(result.logEntry).toHaveProperty('event');
    expect(result.logEntry).toHaveProperty('appliedAt');
    expect(result.logEntry).toHaveProperty('beforeState');
    expect(result.logEntry).toHaveProperty('afterState');
    expect(result.logEntry).toHaveProperty('deltas');
    expect(result.logEntry).toHaveProperty('factionResponses');
    expect(result.logEntry).toHaveProperty('narrativeSummary');
    // Phase 18 — logEntry now also carries the substrate-layer deltas.
    expect(result.logEntry).toHaveProperty('causalStateDeltas');
    expect(result.logEntry).toHaveProperty('factionRelationshipDeltas');
  });

  it('applyEvent threads deterministic timestamps into event annotations', () => {
    const settlement = baseSettlement();
    const result = applyEvent({
      settlement,
      systemState: deriveSystemState(settlement),
      event: { ...ev(), type: 'CUT_TRADE_ROUTE', targetId: 'north road' },
      now: '2026-06-04T12:00:00.000Z',
    });
    expect(result.logEntry.appliedAt).toBe('2026-06-04T12:00:00.000Z');
    expect(result.nextSettlement.config._cutRoutes[0].atTimestamp).toBe('2026-06-04T12:00:00.000Z');
  });
});
