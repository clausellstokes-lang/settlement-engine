/**
 * Batch event tests — the produces/consumes contract, cross-reference
 * validation (forward refs resolve; dangling refs block), and threaded
 * multi-event application with a single combined SystemState derive.
 */

import { describe, test, expect } from 'vitest';
import {
  validateBatch, applyEventBatch, eventProduces, eventConsumes,
} from '../../src/domain/events/batch.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';

const base = {
  tier: 'town',
  population: 2000,
  config: { monsterThreat: 'safe', tradeRouteAccess: 'road', nearbyResources: ['iron vein'] },
  economicState: { prosperity: 'Modest', exports: ['grain'] },
  institutions: [
    { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
  ],
  powerStructure: { factions: [{ id: 'faction.council', name: 'Council' }], conflicts: [] },
  npcs: [
    { id: 'npc.miller', name: 'The Miller', importance: 'key', linkedInstitutionIds: ['institution.granary'] },
  ],
};

function ev(type, overrides = {}) {
  return {
    id: `ev_${type}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    targetId: '',
    payload: {},
    cause: 'authoring',
    ...overrides,
  };
}

describe('batch dependency contract', () => {
  test('eventProduces declares created entities with deterministic ids', () => {
    expect(eventProduces(ev('ADD_INSTITUTION', { targetId: 'Shrine of Dawn' }))).toEqual([
      { kind: 'institution', id: 'institution.shrine_of_dawn', name: 'Shrine of Dawn' },
    ]);
    expect(eventProduces(ev('ADD_FACTION', { targetId: 'Dockhands' }))[0].kind).toBe('faction');
    // Non-creating events produce nothing.
    expect(eventProduces(ev('DAMAGE_INSTITUTION', { targetId: 'institution.granary' }))).toEqual([]);
  });

  test('eventConsumes lists hard references, not create-if-missing subjects', () => {
    expect(eventConsumes(ev('KILL_NPC', { targetId: 'npc.miller' }))).toEqual([
      { kind: 'npc', ref: 'npc.miller' },
    ]);
    // ASSIGN: the NPC subject is created if missing, so only the institution is a hard ref.
    expect(eventConsumes(ev('ASSIGN_NPC_TO_ROLE', {
      targetId: 'npc.brand_new',
      payload: { institutionId: 'institution.granary' },
    }))).toEqual([{ kind: 'institution', ref: 'institution.granary' }]);
  });
});

describe('validateBatch', () => {
  test('passes when references already exist in the settlement', () => {
    const { ok, warnings } = validateBatch(base, [ev('KILL_NPC', { targetId: 'npc.miller' })]);
    expect(ok).toBe(true);
    expect(warnings).toHaveLength(0);
  });

  test('resolves a forward reference produced earlier in the same batch', () => {
    const batch = [
      ev('ADD_INSTITUTION', { targetId: 'Shrine of Dawn' }),
      ev('ADD_NPC', { targetId: 'Sister Wren', payload: { importance: 'key', linkedInstitutionIds: ['institution.shrine_of_dawn'] } }),
    ];
    expect(validateBatch(base, batch).ok).toBe(true);
  });

  test('blocks a dangling reference (neither in settlement nor batch)', () => {
    const batch = [
      ev('ADD_NPC', { targetId: 'Sister Wren', payload: { linkedInstitutionIds: ['institution.nonexistent'] } }),
    ];
    const { ok, warnings } = validateBatch(base, batch);
    expect(ok).toBe(false);
    expect(warnings.some(w => w.severity === 'block')).toBe(true);
  });

  test('order matters: a reference produced LATER in the batch does not resolve', () => {
    const batch = [
      ev('ADD_NPC', { targetId: 'Sister Wren', payload: { linkedInstitutionIds: ['institution.shrine_of_dawn'] } }),
      ev('ADD_INSTITUTION', { targetId: 'Shrine of Dawn' }),
    ];
    expect(validateBatch(base, batch).ok).toBe(false);
  });

  test('CHANGE_RULING_POWER: the faction taking power is a hard ref', () => {
    expect(eventConsumes(ev('CHANGE_RULING_POWER', { targetId: 'Council' }))).toEqual([
      { kind: 'faction', ref: 'Council' },
    ]);
    // An existing faction passes; a transfer to a nonexistent faction blocks
    // (the underlying transferRulingPower would silently no-op while the
    // registry deltas still landed).
    expect(validateBatch(base, [
      ev('CHANGE_RULING_POWER', { targetId: 'Council', payload: { cause: 'coup' } }),
    ]).ok).toBe(true);
    const { ok, warnings } = validateBatch(base, [
      ev('CHANGE_RULING_POWER', { targetId: 'No Such Power', payload: { cause: 'coup' } }),
    ]);
    expect(ok).toBe(false);
    expect(warnings.some(w => w.severity === 'block')).toBe(true);
  });

  test('CHANGE_RULING_POWER resolves a faction added earlier in the same batch', () => {
    const batch = [
      ev('ADD_FACTION', { targetId: 'Dockhands' }),
      ev('CHANGE_RULING_POWER', { targetId: 'Dockhands', payload: { cause: 'coup' } }),
    ];
    expect(validateBatch(base, batch).ok).toBe(true);
  });

  test('PROMOTE_NPC / DEMOTE_NPC: BOTH sides of the standing swap are hard refs', () => {
    expect(eventConsumes(ev('PROMOTE_NPC', {
      targetId: 'npc.miller',
      payload: { swapWithNpcId: 'npc.reeve' },
    }))).toEqual([
      { kind: 'npc', ref: 'npc.miller' },
      { kind: 'npc', ref: 'npc.reeve' },
    ]);
    // The mutation silently no-ops on a missing counterpart while the
    // registry deltas still land — staging must block it.
    const { ok, warnings } = validateBatch(base, [
      ev('DEMOTE_NPC', { targetId: 'npc.miller', payload: { swapWithNpcId: 'npc.reeve' } }),
    ]);
    expect(ok).toBe(false);
    expect(warnings.some(w => w.severity === 'block')).toBe(true);
    // A counterpart added earlier in the batch resolves.
    expect(validateBatch(base, [
      ev('ADD_NPC', { targetId: 'The Reeve', payload: { importance: 'notable' } }),
      ev('PROMOTE_NPC', { targetId: 'The Reeve', payload: { swapWithNpcId: 'npc.miller' } }),
    ]).ok).toBe(true);
  });

  test('REMOVE_RESOURCE consumes the resource; ADD_RESOURCE earlier in the batch satisfies it', () => {
    expect(eventConsumes(ev('REMOVE_RESOURCE', { targetId: 'iron vein' }))).toEqual([
      { kind: 'resource', ref: 'iron vein' },
    ]);
    // Present in config.nearbyResources → passes.
    expect(validateBatch(base, [ev('REMOVE_RESOURCE', { targetId: 'iron vein' })]).ok).toBe(true);
    // Unknown node blocks.
    expect(validateBatch(base, [ev('REMOVE_RESOURCE', { targetId: 'silver_lode' })]).ok).toBe(false);
    // ADD_RESOURCE produces the node for later events in the same batch.
    expect(validateBatch(base, [
      ev('ADD_RESOURCE', { targetId: 'silver_lode' }),
      ev('REMOVE_RESOURCE', { targetId: 'silver_lode' }),
    ]).ok).toBe(true);
  });
});

describe('applyEventBatch', () => {
  test('threads mutations: add an institution then damage it in one batch', () => {
    const batch = [
      ev('ADD_INSTITUTION', { targetId: 'Shrine of Dawn' }),
      ev('DAMAGE_INSTITUTION', { targetId: 'institution.shrine_of_dawn', payload: { severity: 0.8 } }),
    ];
    const result = applyEventBatch({ settlement: base, events: batch });
    const shrine = (result.nextSettlement.institutions || []).find(i => /shrine of dawn/i.test(i.name));
    expect(shrine).toBeTruthy();
    expect((shrine.impairments || []).length).toBeGreaterThan(0);
  });

  test('applies multiple independent changes and unions rerun keys', () => {
    const batch = [
      ev('KILL_NPC', { targetId: 'npc.miller', payload: { importance: 'key' } }),
      ev('ADD_FACTION', { targetId: 'Dockhands' }),
    ];
    const result = applyEventBatch({ settlement: base, events: batch });
    const miller = (result.nextSettlement.npcs || []).find(n => /miller/i.test(n.name));
    expect(miller.status).toBe('dead');
    const factions = result.nextSettlement.powerStructure?.factions || [];
    expect(factions.some(f => /dockhands/i.test(f.name))).toBe(true);
    expect(result.rerunKeys).toEqual(expect.arrayContaining(['powerStructure', 'narrative']));
  });

  test('derives a single combined SystemState delta for the batch', () => {
    const batch = [ev('DAMAGE_INSTITUTION', { targetId: 'institution.granary', payload: { severity: 1 } })];
    const result = applyEventBatch({ settlement: base, systemState: deriveSystemState(base), events: batch });
    expect(Array.isArray(result.systemStateDeltas)).toBe(true);
    expect(result.afterSystemState).toBeTruthy();
  });
});
