/**
 * Pure preparation contract for the first server-authoritative canon event.
 *
 * The store and RPC deliberately sit outside this test. This pins the reusable
 * domain half: one immutable input produces the reconciled settlement, authored
 * SystemState deltas, and append-only log projection that both local preview and
 * durable commit can reason about.
 */

import { describe, expect, test } from 'vitest';
import { prepareAuthoritativeCanonEvent } from '../../src/domain/events/prepareCanonEvent.js';
import { previewEvent } from '../../src/domain/events/previewEvent.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';

const NOW = '2026-07-24T12:05:00.000Z';

function settlement() {
  return {
    id: 'town.greycairn',
    name: 'Greycairn',
    tier: 'town',
    population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    _config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    economicState: {
      prosperity: 'Modest',
      exports: ['grain'],
      activeChains: [{
        needKey: 'food_security',
        chainId: 'grain_to_bread',
        label: 'Grain to bread',
        status: 'operational',
      }],
    },
    institutions: [{
      id: 'institution.market',
      name: 'Market',
      category: 'economy',
      status: 'active',
    }],
    powerStructure: {
      governingName: 'Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [{
        id: 'faction.merchants',
        name: 'Merchants',
        faction: 'Merchants',
        power: 30,
        controlsInstitutionIds: [],
      }],
      conflicts: [],
    },
    activeConditions: [],
  };
}

function routeEvent() {
  return {
    id: 'event.cut-route.1',
    type: 'CUT_TRADE_ROUTE',
    targetId: 'Old North Road',
    payload: {},
    cause: 'player_action',
  };
}

describe('prepareAuthoritativeCanonEvent', () => {
  test('prepares the full deterministic canon projection without mutating inputs', () => {
    const beforeSettlement = settlement();
    const beforeSystemState = deriveSystemState(beforeSettlement);
    const priorEntry = { event: { id: 'event.prior' }, appliedAt: '2026-07-23T12:00:00.000Z' };
    const eventLog = [priorEntry];
    const frozenInput = structuredClone({
      beforeSettlement,
      beforeSystemState,
      eventLog,
    });

    const prepared = prepareAuthoritativeCanonEvent({
      settlement: beforeSettlement,
      systemState: beforeSystemState,
      phase: 'canon',
      eventLog,
      event: routeEvent(),
      now: NOW,
    });

    expect(prepared.ok).toBe(true);
    expect(prepared.appliedAt).toBe(NOW);
    expect(prepared.nextSettlement).not.toBe(beforeSettlement);
    expect(prepared.nextSettlement.config._cutRoutes).toEqual([{
      name: 'Old North Road',
      atEventId: 'event.cut-route.1',
      atTimestamp: NOW,
    }]);
    expect(prepared.nextSettlement._config._cutRoutes)
      .toEqual(prepared.nextSettlement.config._cutRoutes);
    expect(prepared.nextSettlement.activeConditions)
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ archetype: 'trade_route_cut' }),
      ]));
    expect(prepared.nextEventLog).toHaveLength(2);
    expect(prepared.nextEventLog[0]).toBe(priorEntry);
    expect(prepared.nextEventLog[1]).toBe(prepared.logEntry);
    expect(prepared.logEntry.afterState).toEqual(prepared.nextSystemState);
    expect({
      beforeSettlement,
      beforeSystemState,
      eventLog,
    }).toEqual(frozenInput);
  });

  test('preserves preview-to-commit state and delta parity', () => {
    const beforeSettlement = settlement();
    const beforeSystemState = deriveSystemState(beforeSettlement);
    const event = routeEvent();
    const preview = previewEvent({
      settlement: beforeSettlement,
      systemState: beforeSystemState,
      event,
    });
    const prepared = prepareAuthoritativeCanonEvent({
      settlement: beforeSettlement,
      systemState: beforeSystemState,
      phase: 'canon',
      eventLog: [],
      event,
      now: NOW,
    });

    expect(prepared.ok).toBe(true);
    expect(prepared.nextSystemState).toEqual(preview.afterState);
    expect(prepared.logEntry.deltas).toEqual(preview.deltas);
    expect(prepared.logEntry.causalStateDeltas).toEqual(preview.causalStateDeltas);
    expect(prepared.logEntry.narrativeSummary).toBe(preview.narrativeSummary);
  });

  test.each([
    [
      'unsupported event',
      { event: { ...routeEvent(), type: 'KILL_NPC' }, phase: 'canon' },
      'event_not_server_authoritative',
    ],
    [
      'draft phase',
      { event: routeEvent(), phase: 'draft' },
      'canon_phase_required',
    ],
    [
      'missing settlement',
      { event: routeEvent(), phase: 'canon', settlement: null },
      'no_settlement',
    ],
  ])('refuses %s before producing a projection', (_label, overrides, reason) => {
    const beforeSettlement = settlement();
    const result = prepareAuthoritativeCanonEvent({
      settlement: beforeSettlement,
      systemState: deriveSystemState(beforeSettlement),
      eventLog: [],
      now: NOW,
      ...overrides,
    });
    expect(result).toEqual({ ok: false, reason });
  });
});
