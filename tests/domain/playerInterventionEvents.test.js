/**
 * tests/domain/playerInterventionEvents.test.js — Tier 4.11 catalog.
 *
 * Pins the 5 new player-intervention event types added in Phase 24.
 * Each auto-inherits Phase 18's pipeline, so the tests only need to
 * verify (a) the registry entry exists, (b) stateDeltas direction is
 * correct, (c) the event runs cleanly through runEventPipeline.
 */

import { describe, it, expect } from 'vitest';
import { EVENT_REGISTRY, EVENT_TYPES, RERUN_KEYS_FOR_EVENT } from '../../src/domain/events/registry.js';
import { runEventPipeline } from '../../src/domain/events/eventPipeline.js';

const NEW_EVENTS = [
  'REMOVED_THREAT',
  'BROKERED_ALLIANCE',
  'STARTED_RIOT',
  'OPENED_TRADE_ROUTE',
  'RECOVERED_RESOURCE',
];

function fixture() {
  return {
    name: 'Greycairn',
    population: 2000,
    config: { tradeRouteAccess: 'road' },
    institutions: [
      { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
    ],
    powerStructure: {
      governingName: 'Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [{ id: 'faction.council', name: 'Council', faction: 'Council', power: 35 }],
    },
    economicState: { activeChains: [], exports: ['grain'] },
    activeConditions: [],
  };
}

describe('Phase 24 / Tier 4.11 — player intervention events', () => {
  it('every new event is registered with required fields', () => {
    for (const type of NEW_EVENTS) {
      expect(EVENT_TYPES, type).toContain(type);
      const spec = EVENT_REGISTRY[type];
      expect(spec).toBeTruthy();
      expect(typeof spec.label).toBe('string');
      expect(typeof spec.stateDeltas).toBe('function');
      expect(typeof spec.narrate).toBe('function');
      expect(RERUN_KEYS_FOR_EVENT[type], `RERUN_KEYS_FOR_EVENT missing ${type}`).toBeTruthy();
    }
  });

  // ── Direction assertions ─────────────────────────────────────────────

  it('REMOVED_THREAT lowers externalThreat and raises resilience', () => {
    const d = EVENT_REGISTRY.REMOVED_THREAT.stateDeltas({ payload: { severity: 0.8 } });
    expect(d.externalThreat).toBeLessThan(0);
    expect(d.resilience).toBeGreaterThan(0);
  });

  it('BROKERED_ALLIANCE lowers volatility and raises resilience', () => {
    const d = EVENT_REGISTRY.BROKERED_ALLIANCE.stateDeltas({ payload: { severity: 0.8 } });
    expect(d.volatility).toBeLessThan(0);
    expect(d.resilience).toBeGreaterThan(0);
  });

  it('STARTED_RIOT raises volatility and drops resilience', () => {
    const d = EVENT_REGISTRY.STARTED_RIOT.stateDeltas({ payload: { severity: 0.8 } });
    expect(d.volatility).toBeGreaterThan(0);
    expect(d.resilience).toBeLessThan(0);
  });

  it('OPENED_TRADE_ROUTE lowers resourcePressure and raises resilience', () => {
    const d = EVENT_REGISTRY.OPENED_TRADE_ROUTE.stateDeltas({ payload: { severity: 0.7 }, targetId: 'south_road' });
    expect(d.resourcePressure).toBeLessThan(0);
    expect(d.resilience).toBeGreaterThan(0);
  });

  it('RECOVERED_RESOURCE lowers resourcePressure and raises resilience', () => {
    const d = EVENT_REGISTRY.RECOVERED_RESOURCE.stateDeltas({ payload: { severity: 0.7 }, targetId: 'iron_vein' });
    expect(d.resourcePressure).toBeLessThan(0);
    expect(d.resilience).toBeGreaterThan(0);
  });

  // ── Counter-event symmetry ──────────────────────────────────────────

  it('OPENED_TRADE_ROUTE inverts the sign of CUT_TRADE_ROUTE on resourcePressure', () => {
    const cut = EVENT_REGISTRY.CUT_TRADE_ROUTE.stateDeltas({ targetId: 'x', payload: {} });
    const opened = EVENT_REGISTRY.OPENED_TRADE_ROUTE.stateDeltas({ targetId: 'x', payload: { severity: 0.7 } });
    expect(Math.sign(cut.resourcePressure || 0)).toBe(+1);
    expect(Math.sign(opened.resourcePressure || 0)).toBe(-1);
  });

  it('RECOVERED_RESOURCE inverts the sign of DEPLETE_RESOURCE on resourcePressure', () => {
    const deplete = EVENT_REGISTRY.DEPLETE_RESOURCE.stateDeltas({ targetId: 'iron' });
    const recover = EVENT_REGISTRY.RECOVERED_RESOURCE.stateDeltas({ targetId: 'iron', payload: { severity: 0.7 } });
    expect(Math.sign(deplete.resourcePressure || 0)).toBe(+1);
    expect(Math.sign(recover.resourcePressure || 0)).toBe(-1);
  });

  // ── Smoke through Phase 18 pipeline ─────────────────────────────────

  it('every new event runs through runEventPipeline without warnings', () => {
    const settlement = fixture();
    for (const type of NEW_EVENTS) {
      const event = { type, targetId: 'south_road', payload: {}, cause: 'player_action' };
      const result = runEventPipeline(settlement, event);
      // No mismatch warnings; afterSystemState exists.
      expect(result.warnings.filter(w => w.severity === 'mismatch'), type).toEqual([]);
      expect(result.afterSystemState, type).toBeTruthy();
    }
  });
});
