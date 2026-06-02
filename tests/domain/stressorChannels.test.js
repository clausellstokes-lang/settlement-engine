import { describe, expect, test } from 'vitest';

import {
  STRESSOR_CATALOG,
  canonicalSpreadChannel,
  evaluateStressorRules,
  pressureIndex,
} from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph, REGIONAL_CHANNEL_TYPES } from '../../src/domain/region/index.js';

describe('stressor spread channel vocabulary', () => {
  test('every catalog spreadChannel canonicalizes to a real regional channel type', () => {
    const unmapped = [];
    for (const [type, def] of Object.entries(STRESSOR_CATALOG)) {
      for (const ch of def.spreadChannels || []) {
        if (!canonicalSpreadChannel(ch)) unmapped.push(`${type}:${ch}`);
      }
    }
    expect(unmapped).toEqual([]);
  });

  test('canonicalSpreadChannel maps aliases and rejects unknowns', () => {
    expect(canonicalSpreadChannel('regional_authority')).toBe('political_authority');
    expect(canonicalSpreadChannel('information_network')).toBe('information_flow');
    expect(canonicalSpreadChannel('trade_route')).toBe('trade_route'); // already canonical
    expect(REGIONAL_CHANNEL_TYPES).toContain(canonicalSpreadChannel('labor_dependency'));
    expect(canonicalSpreadChannel('totally_made_up')).toBeNull();
  });

  test('a stressor spreads through a CONFIRMED channel but not a SUGGESTED one', () => {
    const stressor = {
      id: 'world_stressor.famine.a',
      type: 'famine',
      severity: 0.7,
      affectedSettlementIds: ['a'],
    };
    const emptyPressures = pressureIndex([]);

    const confirmed = {
      worldState: { tick: 1, stressors: [stressor] },
      regionalGraph: ensureRegionalGraph({ channels: [{ type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed' }] }),
    };
    const spread = evaluateStressorRules(confirmed, emptyPressures, { tick: 1, pressures: [] });
    expect(spread.some(c => c.candidateType?.startsWith('stressor_spread') && c.targetSaveId === 'b')).toBe(true);

    const suggested = {
      worldState: { tick: 1, stressors: [stressor] },
      regionalGraph: ensureRegionalGraph({ channels: [{ type: 'trade_dependency', from: 'a', to: 'b', status: 'suggested' }] }),
    };
    const noSpread = evaluateStressorRules(suggested, emptyPressures, { tick: 1, pressures: [] });
    expect(noSpread.some(c => c.candidateType?.startsWith('stressor_spread'))).toBe(false);
  });
});
