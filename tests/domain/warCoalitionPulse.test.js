import { describe, expect, test } from 'vitest';

import {
  coalitionStandingTransitionEvidence,
  mergeWarCoalitionEvidence,
} from '../../src/domain/worldPulse/warCoalitionPulse.js';

const expenditure = (tick, band = 'present', joinedTick = 4) => ({
  id: `expenditure.${tick}`,
  kind: 'coalition_expenditure_read',
  tick,
  settlementId: 'member',
  counterpartId: 'caller',
  targetId: 'enemy',
  joinedTick,
  band,
});

const stayed = (tick, joinedTick = 4) => ({
  id: `stayed.${tick}`,
  kind: 'coalition_stayed',
  tick,
  settlementId: 'member',
  counterpartId: 'caller',
  thirdPartyId: 'enemy',
  targetId: 'enemy',
  joinedTick,
});

describe('WR-6 pulse evidence admission', () => {
  test('canonical union is order-free, deduped, and drops malformed facts', () => {
    expect(mergeWarCoalitionEvidence(
      [stayed(5), expenditure(5)],
      [expenditure(5), { kind: 'coalition_stayed', tick: 5 }],
    ).map((row) => row.kind)).toEqual([
      'coalition_expenditure_read',
      'coalition_stayed',
    ]);
  });

  test('cost speaks first above quiet and only when its band worsens', () => {
    const worldState = {
      pulseHistory: [{
        tick: 5,
        warCoalitionEvidence: [expenditure(5, 'present')],
      }],
    };
    expect(coalitionStandingTransitionEvidence({}, [expenditure(4, 'quiet')])).toEqual([]);
    expect(coalitionStandingTransitionEvidence({}, [expenditure(5, 'present')]))
      .toEqual([expenditure(5, 'present')]);
    expect(coalitionStandingTransitionEvidence(worldState, [expenditure(6, 'present')])).toEqual([]);
    expect(coalitionStandingTransitionEvidence(worldState, [expenditure(6, 'pressing')]))
      .toEqual([expenditure(6, 'pressing')]);
  });

  test('stay speaks once per exact joined episode and can speak in a later episode', () => {
    const worldState = {
      pulseHistory: [{ tick: 5, warCoalitionEvidence: [stayed(5, 4)] }],
    };
    expect(coalitionStandingTransitionEvidence(worldState, [stayed(6, 4)])).toEqual([]);
    expect(coalitionStandingTransitionEvidence(worldState, [stayed(9, 8)]))
      .toEqual([stayed(9, 8)]);
  });
});
