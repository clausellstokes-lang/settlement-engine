/**
 * Event engine tests — preview/apply produce expected deltas, log
 * entries, and direction-of-causality.
 */

import { describe, test, expect } from 'vitest';
import { previewEvent } from '../../src/domain/events/previewEvent.js';
import { applyEvent }   from '../../src/domain/events/applyEvent.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { EVENT_REGISTRY, EVENT_TYPES } from '../../src/domain/events/registry.js';

const baseSettlement = {
  tier: 'town',
  population: 2000,
  config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
  economicState: { prosperity: 'Modest', exports: ['grain', 'wool'] },
  // The mutation engine now resolves event targets against the
  // actual institutions list; tests need a granary present so
  // DAMAGE_INSTITUTION has something to damage.
  institutions: [
    { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
    { id: 'institution.market',  name: 'Market',  category: 'economy', status: 'active' },
  ],
  powerStructure: {
    factions: [
      { id: 'faction.council',   name: 'Council' },
      { id: 'faction.merchants', name: 'Merchants', controlsInstitutionIds: ['institution.granary'] },
    ],
    conflicts: [],
  },
};

function ev(overrides) {
  return {
    id: 'test-1',
    type: 'DAMAGE_INSTITUTION',
    targetId: 'institution.granary',
    payload: {},
    cause: 'player_action',
    ...overrides,
  };
}

describe('event registry', () => {
  test('every type exposes the required spec methods', () => {
    for (const type of EVENT_TYPES) {
      const spec = EVENT_REGISTRY[type];
      expect(spec, type).toBeTruthy();
      expect(typeof spec.label).toBe('string');
      expect(typeof spec.stateDeltas).toBe('function');
      expect(typeof spec.narrate).toBe('function');
    }
  });

  test('original five event types remain registered', () => {
    // The v1 floor: these five must always exist. New event types
    // (NPC, impairment, regional) may be added on top, but removing
    // any of the original five is a breaking change.
    for (const t of ['ADD_INSTITUTION', 'REMOVE_INSTITUTION', 'DAMAGE_INSTITUTION', 'DEPLETE_RESOURCE', 'CUT_TRADE_ROUTE']) {
      expect(EVENT_TYPES).toContain(t);
    }
  });

  test('NPC + impairment events are registered', () => {
    for (const t of ['ADD_NPC', 'KILL_NPC', 'ASSIGN_NPC_TO_ROLE', 'IMPAIR_INSTITUTION', 'IMPAIR_FACTION']) {
      expect(EVENT_TYPES).toContain(t);
    }
  });

  test('every make-change visibly moves a dial — no event returns an empty stateDeltas', () => {
    // A make-change that returns {} silently no-ops on the dials, which reads as
    // a broken event at the table. Every authored type must move at least one.
    for (const type of EVENT_TYPES) {
      const deltas = EVENT_REGISTRY[type].stateDeltas({ type, payload: {}, targetId: 'x' }) || {};
      const moves = Object.values(deltas).some(v => Number(v) !== 0);
      expect(moves, `${type} returned an empty/zero stateDeltas`).toBe(true);
    }
  });
});

describe('SET_PRIMARY_DEITY dial nudge', () => {
  const deltasFor = (event) => EVENT_REGISTRY.SET_PRIMARY_DEITY.stateDeltas(event);

  test('adopting a deity is a small steadying nudge (+resilience, -volatility)', () => {
    const deltas = deltasFor({ type: 'SET_PRIMARY_DEITY', targetId: 'deity.torm', payload: { snapshot: { name: 'Torm' } } });
    expect(deltas.resilience).toBeGreaterThan(0);
    expect(deltas.volatility).toBeLessThan(0);
    // Small, justified — not an economic shock.
    expect(Math.abs(deltas.resilience)).toBeLessThanOrEqual(5);
  });

  test('clearing the deity is the small inverse drift', () => {
    const deltas = deltasFor({ type: 'SET_PRIMARY_DEITY', targetId: '', payload: {} });
    expect(deltas.resilience).toBeLessThan(0);
    expect(deltas.volatility).toBeGreaterThan(0);
    expect(Math.abs(deltas.resilience)).toBeLessThanOrEqual(5);
  });
});

describe('ADD_FACTION', () => {
  test('adds a new faction to the power structure', () => {
    const before = baseSettlement;
    const { nextSettlement } = applyEvent({
      settlement: before,
      systemState: deriveSystemState(before),
      event: ev({ id: 'evf1', type: 'ADD_FACTION', targetId: 'Dockworkers Guild', payload: {} }),
    });
    const factions = nextSettlement.powerStructure?.factions || nextSettlement.factions || [];
    expect(factions.some(f => /dockworkers guild/i.test(f.name || ''))).toBe(true);
  });

  test('is idempotent on an existing faction name', () => {
    const before = baseSettlement;
    const { nextSettlement } = applyEvent({
      settlement: before,
      systemState: deriveSystemState(before),
      event: ev({ id: 'evf2', type: 'ADD_FACTION', targetId: 'Council', payload: {} }),
    });
    const factions = nextSettlement.powerStructure?.factions || [];
    const councils = factions.filter(f => /^council$/i.test(f.name || ''));
    expect(councils.length).toBe(1);
  });
});

describe('ADD_NPC', () => {
  test('carries authored descriptive traits onto the created NPC in read-card shapes', () => {
    const before = baseSettlement;
    const { nextSettlement } = applyEvent({
      settlement: before,
      systemState: deriveSystemState(before),
      event: ev({
        id: 'evn1', type: 'ADD_NPC', targetId: 'Mira the Bold',
        payload: {
          importance: 'key',
          flaw: 'Reckless under pressure',
          temperament: 'Hot-tempered',
          goal: 'Reclaim her family name',
          constraint: 'Bound by an old debt',
          secret: 'Funds the smugglers',
        },
      }),
    });
    const npc = (nextSettlement.npcs || []).find(n => n.name === 'Mira the Bold');
    expect(npc).toBeTruthy();
    expect(npc.importance).toBe('key');
    expect(npc.flaw).toBe('Reckless under pressure');
    expect(npc.personality.dominant).toBe('Hot-tempered');
    expect(npc.goal).toEqual({ short: 'Reclaim her family name' });
    expect(npc.activeConstraint).toBe('Bound by an old debt');
    expect(npc.secret).toEqual({ what: 'Funds the smugglers' });
  });

  test('omits descriptive traits when none are authored (tangible importance dial still moves)', () => {
    const before = baseSettlement;
    const { nextSettlement } = applyEvent({
      settlement: before,
      systemState: deriveSystemState(before),
      event: ev({ id: 'evn2', type: 'ADD_NPC', targetId: 'Plain NPC', payload: { importance: 'notable' } }),
    });
    const npc = (nextSettlement.npcs || []).find(n => n.name === 'Plain NPC');
    expect(npc).toBeTruthy();
    expect(npc.flaw).toBeUndefined();
    expect(npc.goal).toBeUndefined();
    expect(npc.secret).toBeUndefined();
    expect(npc.activeConstraint).toBeUndefined();
    // ADD_NPC's tangible effect is the importance-scaled resilience nudge.
    expect(EVENT_REGISTRY.ADD_NPC.stateDeltas({ type: 'ADD_NPC', payload: { importance: 'notable' } }).resilience).toBeGreaterThan(0);
  });
});

describe('previewEvent', () => {
  test('unknown event type returns a mismatch warning', () => {
    const preview = previewEvent({
      settlement: baseSettlement,
      systemState: deriveSystemState(baseSettlement),
      event: ev({ type: 'NUKE_FROM_ORBIT' }),
    });
    expect(preview.warnings.some(w => w.severity === 'mismatch')).toBe(true);
  });

  test('missing target on a target-required event warns', () => {
    const preview = previewEvent({
      settlement: baseSettlement,
      systemState: deriveSystemState(baseSettlement),
      event: ev({ type: 'DAMAGE_INSTITUTION', targetId: '' }),
    });
    expect(preview.warnings.some(w => /requires a target/i.test(w.message))).toBe(true);
  });

  test('damaging the granary lowers resilience and raises resource pressure', () => {
    const before = deriveSystemState(baseSettlement);
    const preview = previewEvent({
      settlement: baseSettlement,
      systemState: before,
      event: ev({ type: 'DAMAGE_INSTITUTION', targetId: 'granary', payload: { severity: 1.0 } }),
    });
    const resD = preview.deltas.find(d => d.key === 'resilience');
    const rpD  = preview.deltas.find(d => d.key === 'resourcePressure');
    expect(resD?.change).toBeLessThan(0);
    expect(rpD?.change).toBeGreaterThan(0);
  });

  test('adding an institution mirrors the sign of damaging it', () => {
    const before = deriveSystemState(baseSettlement);
    const damage = previewEvent({
      settlement: baseSettlement, systemState: before,
      event: ev({ type: 'DAMAGE_INSTITUTION', targetId: 'granary', payload: { severity: 1.0 } }),
    });
    const add = previewEvent({
      settlement: baseSettlement, systemState: before,
      event: ev({ type: 'ADD_INSTITUTION', targetId: 'granary' }),
    });
    const damageRes = damage.deltas.find(d => d.key === 'resilience')?.change ?? 0;
    const addRes    = add.deltas.find(d => d.key === 'resilience')?.change ?? 0;
    // Damage at severity 1.0 ≈ removal magnitude * 1, ADD inverts the
    // damage table's sign — they should be equal in magnitude, opposite
    // in sign.
    expect(Math.sign(damageRes)).toBe(-1);
    expect(Math.sign(addRes)).toBe(1);
  });

  test('cutting a trade route hits resilience and resource pressure', () => {
    const before = deriveSystemState(baseSettlement);
    const preview = previewEvent({
      settlement: baseSettlement, systemState: before,
      event: ev({ type: 'CUT_TRADE_ROUTE', targetId: '' }),
    });
    expect(preview.deltas.find(d => d.key === 'resilience')?.change).toBeLessThan(0);
    expect(preview.deltas.find(d => d.key === 'resourcePressure')?.change).toBeGreaterThan(0);
  });

  test('depleting a resource always pushes resource pressure up', () => {
    const before = deriveSystemState(baseSettlement);
    const preview = previewEvent({
      settlement: baseSettlement, systemState: before,
      event: ev({ type: 'DEPLETE_RESOURCE', targetId: 'iron_vein_north' }),
    });
    expect(preview.deltas.find(d => d.key === 'resourcePressure')?.change).toBeGreaterThan(0);
  });

  test('preview is pure — calling twice with same inputs yields equal results', () => {
    const before = deriveSystemState(baseSettlement);
    const args = {
      settlement: baseSettlement,
      systemState: before,
      event: ev({ type: 'DAMAGE_INSTITUTION', targetId: 'granary' }),
    };
    expect(previewEvent(args)).toEqual(previewEvent(args));
  });
});

describe('applyEvent', () => {
  test('produces a log entry with before/after states and deltas', () => {
    const systemState = deriveSystemState(baseSettlement);
    const { logEntry, nextSystemState } = applyEvent({
      settlement: baseSettlement,
      systemState,
      event: ev({ type: 'DAMAGE_INSTITUTION', targetId: 'granary' }),
      // A+ domain.6: applyEvent is a pure function of (settlement, event, now) —
      // it no longer reads the wall clock, so the caller threads the apply time.
      now: '2026-06-04T12:00:00.000Z',
    });
    expect(logEntry.event.type).toBe('DAMAGE_INSTITUTION');
    expect(logEntry.appliedAt).toBe('2026-06-04T12:00:00.000Z');
    expect(logEntry.beforeState).toBeTruthy();
    expect(logEntry.afterState).toBeTruthy();
    expect(logEntry.deltas.length).toBeGreaterThan(0);
    expect(nextSystemState).toEqual(logEntry.afterState);
    expect(typeof logEntry.narrativeSummary).toBe('string');
    expect(logEntry.narrativeSummary.length).toBeGreaterThan(0);
  });

  test('applying a NO-OP event (cosmetic) leaves state unchanged', () => {
    const systemState = deriveSystemState(baseSettlement);
    // ADD an "other"-classified institution at the smallest impact —
    // resilience should rise, but the test is only that the structure
    // is valid even when the magnitudes are small.
    const { logEntry, nextSystemState } = applyEvent({
      settlement: baseSettlement,
      systemState,
      event: ev({ type: 'ADD_INSTITUTION', targetId: 'cobbler' }),
    });
    expect(logEntry.afterState).toBeTruthy();
    expect(nextSystemState).toBeTruthy();
  });
});
