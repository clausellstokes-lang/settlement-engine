import { describe, expect, test } from 'vitest';

import { synthesizeRealmEvents } from '../../src/domain/worldPulse/index.js';

describe('realm-event synthesis', () => {
  test('promotes a stressor shared by >=3 settlements to a named realm arc', () => {
    const worldState = {
      stressors: [
        { type: 'famine', lifecycleStage: 'active', affectedSettlementIds: ['a'] },
        { type: 'famine', lifecycleStage: 'active', affectedSettlementIds: ['b'] },
        { type: 'famine', lifecycleStage: 'peaking', affectedSettlementIds: ['c'] },
        { type: 'siege', lifecycleStage: 'active', affectedSettlementIds: ['a'] },
      ],
    };
    const entries = synthesizeRealmEvents({ worldState, tick: 4, now: 'X' });
    const famine = entries.find(e => e.impactKind === 'realm_famine');
    expect(famine).toBeTruthy();
    expect(famine.scope).toBe('realm');
    expect(famine.significance).toBe('major');
    expect(famine.settlementIds).toEqual(['a', 'b', 'c']);
    expect(famine.headline).toMatch(/Hunger/i);
    // siege only touches one settlement → no realm arc.
    expect(entries.some(e => e.impactKind === 'realm_siege')).toBe(false);
  });

  test('below the threshold yields nothing', () => {
    const worldState = {
      stressors: [
        { type: 'plague', lifecycleStage: 'active', affectedSettlementIds: ['a'] },
        { type: 'plague', lifecycleStage: 'active', affectedSettlementIds: ['b'] },
      ],
    };
    expect(synthesizeRealmEvents({ worldState, tick: 1 })).toEqual([]);
  });

  // §S4 — "The War" must count the INSTIGATORS + supporters (the coalition), not
  // just the besieged victim. A 4-attacker-vs-1 coalition touches ONE victim, so
  // the old victim-only count never crossed the realm threshold (3). The coalition
  // comes from the regional graph's war_front channels INTO the besieged.
  test('a 4-vs-1 coalition siege promotes to "The War" (victim-count logic would FAIL)', () => {
    const worldState = {
      stressors: [
        // ONE besieged victim — victim-count = 1, below the threshold.
        { type: 'siege', lifecycleStage: 'active', affectedSettlementIds: ['victim'] },
      ],
    };
    const regionalGraph = {
      channels: [
        { type: 'war_front', status: 'confirmed', from: 'atk1', to: 'victim' },
        { type: 'war_front', status: 'confirmed', from: 'atk2', to: 'victim' },
        { type: 'war_front', status: 'confirmed', from: 'atk3', to: 'victim' },
        { type: 'war_front', status: 'confirmed', from: 'atk4', to: 'victim' },
      ],
    };
    // Without the graph (legacy victim-count) the siege does NOT promote — proving
    // the OLD logic fails this case.
    expect(synthesizeRealmEvents({ worldState, tick: 5 }).some(e => e.impactKind === 'realm_siege')).toBe(false);
    // WITH the coalition graph, 4 besiegers + 1 victim = 5 belligerents ⇒ promotes.
    const entries = synthesizeRealmEvents({ worldState, tick: 5, regionalGraph });
    const war = entries.find(e => e.impactKind === 'realm_siege');
    expect(war).toBeTruthy();
    expect(war.headline).toMatch(/The War/);
    expect(war.scope).toBe('realm');
    expect(war.settlementIds).toEqual(['atk1', 'atk2', 'atk3', 'atk4', 'victim']);
  });

  test('a single-besieger siege does NOT promote (one attacker + one victim = 2)', () => {
    const worldState = {
      stressors: [{ type: 'siege', lifecycleStage: 'active', affectedSettlementIds: ['victim'] }],
    };
    const regionalGraph = {
      channels: [{ type: 'war_front', status: 'confirmed', from: 'atk1', to: 'victim' }],
    };
    expect(synthesizeRealmEvents({ worldState, tick: 5, regionalGraph }).some(e => e.impactKind === 'realm_siege')).toBe(false);
  });
});
