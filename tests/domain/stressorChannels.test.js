import { describe, expect, test } from 'vitest';

import {
  STRESSOR_CATALOG,
  ageRoamingStressors,
  canonicalSpreadChannel,
  effectiveStressorSeverity,
  evaluateStressorRules,
  normalizeStressor,
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

  test('spread persists per-target attenuation — and the news reports the attenuated number', () => {
    // H8 pin, R3 semantics. Reconciles the R1 "no cosmetic decay" pin: R1
    // banned the 0.72× number because it was display-only; R3 PERSISTS it
    // (severityBySettlement, the decided design), so every surface now
    // reports the attenuated severity the target truly experiences.
    const emptyPressures = pressureIndex([]);
    const spreadAt = (severity) => evaluateStressorRules({
      worldState: {
        tick: 1,
        stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity, affectedSettlementIds: ['a'] }],
      },
      regionalGraph: ensureRegionalGraph({ channels: [{ type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed' }] }),
    }, emptyPressures, { tick: 1, pressures: [] })
      .find(c => c.candidateType?.startsWith('stressor_spread') && c.targetSaveId === 'b');

    const spread = spreadAt(0.8);
    expect(spread).toBeTruthy();
    // The candidate reports the severity the TARGET will actually experience…
    expect(spread.severity).toBeCloseTo(0.8 * 0.72, 10);
    // …the shared record keeps its origin-driven severity…
    expect(spread.stressor.severity).toBeCloseTo(0.8, 10);
    // …and the upserted payload persists the attenuated value for the target.
    expect(spread.stressor.severityBySettlement.b).toBeCloseTo(0.8 * 0.72, 10);
    expect(Object.keys(spread.stressor.severityBySettlement)).toEqual(['b']);
    // DM-facing prose tells the truth: it spreads attenuated, with the number.
    const text = JSON.stringify([spread.headline, spread.summary, spread.reasons]);
    expect(text).not.toMatch(/full strength|undiminished/i);
    expect(text).toContain('0.58');
    expect(text).toContain('0.80');
    // The proposal gate still runs against the RECORD severity (a 0.78+
    // crisis spreading is major; gating on the attenuated number would make
    // the gate unreachable — 0.78 / 0.72 > 1).
    expect(spread.applyMode).toBe('proposal');
    expect(spreadAt(0.7).applyMode).toBe('auto');
  });
});

describe('per-target spread attenuation (H8 — the map is real)', () => {
  const emptyPressures = pressureIndex([]);
  const spreadFrom = (stressor, channels) => evaluateStressorRules({
    worldState: { tick: 2, stressors: [stressor] },
    regionalGraph: ensureRegionalGraph({ channels }),
  }, emptyPressures, { tick: 2, pressures: [] })
    .find(c => c.candidateType?.startsWith('stressor_spread') && c.targetSaveId === 'c');

  test('effectiveStressorSeverity: full severity at the origin, attenuated at spread targets', () => {
    const stressor = normalizeStressor({
      id: 'world_stressor.famine.a',
      type: 'famine',
      severity: 0.8,
      originSettlementId: 'a',
      affectedSettlementIds: ['a', 'b'],
      severityBySettlement: { b: 0.576 },
    });
    expect(effectiveStressorSeverity(stressor, 'a')).toBeCloseTo(0.8, 10);
    expect(effectiveStressorSeverity(stressor, 'b')).toBeCloseTo(0.576, 10);
    // Settlements absent from the map read the record severity.
    expect(effectiveStressorSeverity(stressor, 'z')).toBeCloseTo(0.8, 10);
    // A stamped entry never bites harder than the record currently does:
    // the origin's decay caps every spread target.
    expect(effectiveStressorSeverity({ ...stressor, severity: 0.3 }, 'b')).toBeCloseTo(0.3, 10);
  });

  test('a recursive spread attenuates twice — from the SOURCE\'s effective severity', () => {
    // a (origin, 0.8) already spread to b (0.576); only b reaches c.
    const spread = spreadFrom({
      id: 'world_stressor.famine.a',
      type: 'famine',
      severity: 0.8,
      affectedSettlementIds: ['a', 'b'],
      severityBySettlement: { b: 0.576 },
    }, [{ type: 'trade_dependency', from: 'b', to: 'c', status: 'confirmed' }]);
    expect(spread).toBeTruthy();
    expect(spread.severity).toBeCloseTo(0.576 * 0.72, 10);
    expect(spread.stressor.severityBySettlement.c).toBeCloseTo(0.576 * 0.72, 10);
    // The earlier hop's stamp survives on the same shared record.
    expect(spread.stressor.severityBySettlement.b).toBeCloseTo(0.576, 10);
  });

  test('when origin and a spread target both reach a settlement, the strongest source wins', () => {
    const spread = spreadFrom({
      id: 'world_stressor.famine.a',
      type: 'famine',
      severity: 0.8,
      affectedSettlementIds: ['a', 'b'],
      severityBySettlement: { b: 0.576 },
    }, [
      { type: 'trade_dependency', from: 'b', to: 'c', status: 'confirmed' },
      { type: 'trade_dependency', from: 'a', to: 'c', status: 'confirmed' },
    ]);
    expect(spread.severity).toBeCloseTo(0.8 * 0.72, 10);
  });

  test('attenuation floors at 0.2 so spreads stay meaningful', () => {
    // The record is loud at the origin, but the spreading SOURCE only
    // experiences 0.25 — 0.25 × 0.72 = 0.18 floors up to 0.2.
    const spread = spreadFrom({
      id: 'world_stressor.famine.a',
      type: 'famine',
      severity: 0.8,
      affectedSettlementIds: ['a', 'b'],
      severityBySettlement: { b: 0.25 },
    }, [{ type: 'trade_dependency', from: 'b', to: 'c', status: 'confirmed' }]);
    expect(spread.severity).toBeCloseTo(0.2, 10);
    expect(spread.stressor.severityBySettlement.c).toBeCloseTo(0.2, 10);
  });

  test('the map survives normalizeStressor and aging; lifecycle stays origin-driven', () => {
    const normalized = normalizeStressor({
      id: 'world_stressor.famine.a',
      type: 'famine',
      severity: 0.8,
      affectedSettlementIds: ['a', 'b'],
      severityBySettlement: { b: 0.576 },
    });
    expect(normalized.severityBySettlement).toEqual({ b: 0.576 });
    // Re-normalization (every upsert path round-trips through it) is a no-op.
    expect(normalizeStressor(normalized).severityBySettlement).toEqual({ b: 0.576 });
    // Aging decays the RECORD severity but never re-ages the stamped map.
    const aged = ageRoamingStressors([normalized], { byId: new Map() }, { random: () => 0.99 }, { tick: 3 })
      .stressors.find(s => s.id === normalized.id);
    expect(aged.severity).toBeLessThan(0.8);
    expect(aged.severityBySettlement).toEqual({ b: 0.576 });
  });
});
