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
});
