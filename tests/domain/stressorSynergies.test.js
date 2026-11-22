/**
 * tests/domain/stressorSynergies.test.js — co-located stressor interaction
 * and compound-signature pins.
 *
 * Pins:
 *   • famine under siege CANNOT resolve (blocksResolution) — the blockade
 *     is a hard causal dependency, not a probability nudge.
 *   • famine + disease drag each other's decay (the hungry sicken faster).
 *   • synergies require CO-LOCATION — the same pair in different settlements
 *     does not interact.
 *   • compound signatures name the combination once: God's Abandonment
 *     consumes its member types so The Wasting doesn't double-report.
 *   • The Shadow Court additionally requires a captured faction ladder.
 */

import { describe, expect, test } from 'vitest';
import { synergyAssessment } from '../../src/domain/worldPulse/stressorDynamics.js';
import { ageRoamingStressors } from '../../src/domain/worldPulse/stressors.js';
import { synthesizeCompoundSignatures, synthesizeRealmEvents } from '../../src/domain/worldPulse/realmEvents.js';

const NOW = '2026-01-01T00:00:00.000Z';

function stressor(type, patch = {}) {
  return {
    id: `world_stressor.${type}.${patch.origin || 'a'}`,
    type,
    severity: 0.6,
    age: 1,
    affectedSettlementIds: ['a'],
    ...patch,
  };
}

const EMPTY_SNAPSHOT = { byId: new Map() };

describe('synergyAssessment()', () => {
  test('famine + co-located disease: dragged decay and resolution', () => {
    const famine = stressor('famine');
    const disease = stressor('disease_outbreak');
    const syn = synergyAssessment(famine, [famine, disease]);
    expect(syn).toBeTruthy();
    expect(syn.decayMult).toBeLessThan(1);
    expect(syn.resolutionDelta).toBeLessThan(0);
    expect(syn.companions).toContain('disease_outbreak');
  });

  test('the same pair in DIFFERENT settlements does not interact', () => {
    const famine = stressor('famine', { affectedSettlementIds: ['a'] });
    const disease = stressor('disease_outbreak', { affectedSettlementIds: ['b'], origin: 'b' });
    expect(synergyAssessment(famine, [famine, disease])).toBeNull();
  });

  test('famine under siege is resolution-blocked', () => {
    const famine = stressor('famine');
    const siege = stressor('siege');
    const syn = synergyAssessment(famine, [famine, siege]);
    expect(syn.blocksResolution).toBe(true);
  });

  test('unlisted pairs keep today\'s behavior (no interaction)', () => {
    const siege = stressor('siege');
    const magic = stressor('magical_instability');
    expect(synergyAssessment(siege, [siege, magic])).toBeNull();
  });
});

describe('synergies through ageRoamingStressors()', () => {
  test('a blockade famine cannot resolve even at rock-bottom severity', () => {
    // severity at the auto-resolve floor + a roll of 0: without the siege this
    // famine resolves instantly; with it, the blockade holds.
    const famine = stressor('famine', { severity: 0.07, age: 30 });
    const siege = stressor('siege', { severity: 0.9 });
    const result = ageRoamingStressors([famine, siege], EMPTY_SNAPSHOT, { random: () => 0 }, { tick: 1, now: NOW });
    const survivingFamine = result.stressors.find(s => s.type === 'famine');
    expect(survivingFamine).toBeTruthy();
    expect(result.resolved.some(s => s.type === 'famine')).toBe(false);
    expect(survivingFamine.synergy?.blocksResolution).toBe(true);
  });

  test('the same famine WITHOUT the siege resolves on that roll', () => {
    const famine = stressor('famine', { severity: 0.07, age: 30 });
    const result = ageRoamingStressors([famine], EMPTY_SNAPSHOT, { random: () => 0 }, { tick: 1, now: NOW });
    expect(result.resolved.some(s => s.type === 'famine')).toBe(true);
  });

  test('disease decays slower alongside a famine than alone', () => {
    const alone = ageRoamingStressors(
      [stressor('disease_outbreak', { severity: 0.6 })],
      EMPTY_SNAPSHOT, { random: () => 0.99 }, { tick: 1, now: NOW },
    ).stressors[0];
    const together = ageRoamingStressors(
      [stressor('disease_outbreak', { severity: 0.6 }), stressor('famine', { severity: 0.6 })],
      EMPTY_SNAPSHOT, { random: () => 0.99 }, { tick: 1, now: NOW },
    ).stressors.find(s => s.type === 'disease_outbreak');
    expect(together.severity).toBeGreaterThan(alone.severity);
  });
});

describe('compound signatures', () => {
  test('famine + disease on one settlement names The Wasting', () => {
    const worldState = { stressors: [stressor('famine'), stressor('disease_outbreak')] };
    const entries = synthesizeCompoundSignatures({ worldState, tick: 3, now: NOW });
    expect(entries).toHaveLength(1);
    expect(entries[0].headline).toMatch(/The Wasting/);
    expect(entries[0].settlementIds).toEqual(['a']);
    expect(entries[0].kind).toBe('compound');
  });

  test("adding the schism upgrades to God's Abandonment and suppresses The Wasting", () => {
    const worldState = {
      stressors: [
        stressor('famine'),
        stressor('disease_outbreak'),
        stressor('religious_conversion_fracture'),
      ],
    };
    const entries = synthesizeCompoundSignatures({ worldState, tick: 3, now: NOW });
    expect(entries.some(e => /God's Abandonment/.test(e.headline))).toBe(true);
    expect(entries.some(e => /The Wasting/.test(e.headline))).toBe(false);
  });

  test('The Shadow Court requires a captured faction ladder', () => {
    const stressors = [stressor('criminal_corridor'), stressor('infiltration')];
    const without = synthesizeCompoundSignatures({ worldState: { stressors }, tick: 3, now: NOW });
    expect(without.some(e => /Shadow Court/.test(e.headline))).toBe(false);
    const withCapture = synthesizeCompoundSignatures({
      worldState: {
        stressors,
        factionStates: { 'a:guild': { settlementId: 'a', captureState: 'capture' } },
      },
      tick: 3,
      now: NOW,
    });
    expect(withCapture.some(e => /Shadow Court/.test(e.headline))).toBe(true);
  });

  test('resolved stressors do not feed signatures', () => {
    const worldState = {
      stressors: [
        stressor('famine'),
        { ...stressor('disease_outbreak'), lifecycleStage: 'resolved', status: 'resolved' },
      ],
    };
    expect(synthesizeCompoundSignatures({ worldState, tick: 3, now: NOW })).toHaveLength(0);
  });

  test('realm synthesis carries compound entries alongside same-type arcs', () => {
    const worldState = {
      stressors: [
        stressor('famine', { affectedSettlementIds: ['a', 'b', 'c'] }),
        stressor('disease_outbreak'),
      ],
    };
    const entries = synthesizeRealmEvents({ worldState, tick: 3, now: NOW });
    expect(entries.some(e => e.kind === 'compound')).toBe(true);
    expect(entries.some(e => /Great Hunger/.test(e.headline))).toBe(true);
  });
});
