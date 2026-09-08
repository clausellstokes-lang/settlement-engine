import { describe, expect, test } from 'vitest';

import {
  STRESSOR_CATALOG,
  ageRoamingStressors,
  evaluateStressorRules,
  normalizeStressor,
} from '../../src/domain/worldPulse/stressors.js';
import {
  counterforceAssessment,
  synergyAssessment,
  interpretStressorOrigin,
} from '../../src/domain/worldPulse/stressorDynamics.js';
import { pressureIndex } from '../../src/domain/worldPulse/index.js';

// The magic deadzone: the inverse of magical_instability (absence, not
// wildness), hard-gated to settlements where magic is load-bearing, and the
// engine's first WANDERING stressor — it moves instead of merely spreading.

const arcaneTown = id => ({
  name: id,
  tier: 'town',
  config: { magicExists: true, priorityMagic: 70 },
  institutions: [{ name: 'Arcane College', category: 'Magic' }],
});

function deadzone(at, extra = {}) {
  return normalizeStressor({
    type: 'magic_deadzone',
    originSettlementId: at[0],
    severity: 0.6,
    affectedSettlementIds: at,
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...extra,
  });
}

// rng stub: wander rolls succeed, resolution rolls fail — the zone survives
// and moves. fork labels keep the two streams separable.
const wanderingRng = {
  fork: label => ({ random: () => (label.startsWith('wander:') ? 0.1 : 0.99) }),
  random: () => 0.99,
};

describe('magic_deadzone', () => {
  test('catalog entry: episodic, wandering, and a proposal-grade (major) birth', () => {
    const entry = STRESSOR_CATALOG.magic_deadzone;
    expect(entry.durationPolicy).toBe('episodic');
    expect(entry.wander).toMatchObject({ maxFootprint: 2 });
    // Review fix: a deadzone MOVES, it does not also spread — spread would
    // grow the footprint past the wander cap at attenuated severity.
    expect(entry.spreadChannels).toEqual([]);

    const pressures = [{
      settlementId: 'oak', settlementName: 'Oak', kind: 'legitimacy',
      label: 'Legitimacy pressure', score: 0.65, reasons: ['unrest'],
    }];
    const snapshot = {
      worldState: { tick: 2, stressors: [] },
      regionalGraph: { edges: [], channels: [] },
      byId: new Map([['oak', { settlement: arcaneTown('Oak'), causal: { scores: {} } }]]),
    };
    const birth = evaluateStressorRules(snapshot, pressureIndex(pressures), { tick: 2, pressures })
      .find(c => c.candidateType === 'stressor_birth_magic_deadzone');
    expect(birth).toBeTruthy();
    // A region losing its magic is a major change: always a proposal.
    expect(birth.applyMode).toBe('proposal');
    expect(birth.reasons.join(' ')).toMatch(/Why it matters here/);
  });

  test('the zone wanders: creeps to a connected neighbour, then vacates its oldest ground past the footprint cap', () => {
    const graph = {
      channels: [
        { type: 'information_flow', from: 'a', to: 'b', status: 'confirmed' },
        { type: 'information_flow', from: 'b', to: 'c', status: 'confirmed' },
      ],
      edges: [],
    };
    const snapshot = { worldState: { tick: 1, stressors: [] }, regionalGraph: graph, byId: new Map() };

    // Tick 1: footprint a -> a,b (cap 2, nothing vacated).
    const first = ageRoamingStressors([deadzone(['a'])], snapshot, wanderingRng, {
      tick: 1, now: '2026-02-01T00:00:00.000Z',
    });
    const moved = first.stressors.find(s => s.type === 'magic_deadzone');
    expect(moved.affectedSettlementIds).toEqual(['a', 'b']);
    expect(first.residualOutcomes).toHaveLength(0);

    // Tick 2: a,b -> b,c — the zone moves on and 'a' gets its departure
    // residual ("the silence lifts; recovery comes slowly").
    const second = ageRoamingStressors([moved], snapshot, wanderingRng, {
      tick: 2, now: '2026-03-01T00:00:00.000Z',
    });
    const movedAgain = second.stressors.find(s => s.type === 'magic_deadzone');
    expect(movedAgain.affectedSettlementIds).toEqual(['b', 'c']);
    const departure = second.residualOutcomes.find(o => o.ruleId === 'stressor_magic_deadzone_wander_departure');
    expect(departure).toBeTruthy();
    expect(departure.targetSaveId).toBe('a');
    expect(departure.condition.archetype).toBe('stressor_residual');
  });

  test('wander is order-independent: the move forks on the stressor id, not list position', () => {
    const graph = {
      channels: [{ type: 'information_flow', from: 'a', to: 'b', status: 'confirmed' }],
      edges: [],
    };
    const snapshot = { worldState: { tick: 1, stressors: [] }, regionalGraph: graph, byId: new Map() };
    const other = normalizeStressor({
      type: 'famine', originSettlementId: 'z', severity: 0.9,
      affectedSettlementIds: ['z'], updatedAt: '2026-01-01T00:00:00.000Z',
    });
    const run = list => ageRoamingStressors(list, snapshot, wanderingRng, { tick: 1, now: '2026-02-01T00:00:00.000Z' })
      .stressors.find(s => s.type === 'magic_deadzone').affectedSettlementIds;
    expect(run([deadzone(['a']), other])).toEqual(run([other, deadzone(['a'])]));
  });

  test('a rebirth at the vacated origin cannot clobber the wandered record (stable-id collision block)', () => {
    // Review fix: the wandered zone's id still embeds its BIRTH origin; a
    // fresh birth there would mint the SAME id and the byId upsert would
    // silently replace the live record at its new footprint.
    const wandered = {
      id: 'world_stressor.magic_deadzone.oak',
      type: 'magic_deadzone',
      status: 'active',
      severity: 0.6,
      originSettlementId: 'oak',
      affectedSettlementIds: ['b', 'c'], // drifted off its origin
    };
    const pressures = [{
      settlementId: 'oak', settlementName: 'Oak', kind: 'legitimacy',
      label: 'Legitimacy pressure', score: 0.7, reasons: ['unrest'],
    }];
    const snapshot = {
      worldState: { tick: 6, stressors: [wandered] },
      regionalGraph: { edges: [], channels: [] },
      byId: new Map([['oak', { settlement: arcaneTown('Oak'), causal: { scores: {} } }]]),
    };
    const births = evaluateStressorRules(snapshot, pressureIndex(pressures), { tick: 6, pressures })
      .filter(c => c.candidateType === 'stressor_birth_magic_deadzone');
    expect(births).toHaveLength(0);
  });

  test('no graph, no movement — and a footprint with no outgoing channels stays put', () => {
    const bare = { worldState: { tick: 1, stressors: [] }, regionalGraph: { channels: [], edges: [] }, byId: new Map() };
    const result = ageRoamingStressors([deadzone(['a'])], bare, wanderingRng, { tick: 1, now: '2026-02-01T00:00:00.000Z' });
    expect(result.stressors.find(s => s.type === 'magic_deadzone').affectedSettlementIds).toEqual(['a']);
  });

  test('resolution leans on the OUTSIDE: external arcane relief lifts the counterforce score', () => {
    const smothered = { name: 'Smothered', tier: 'town', institutions: [] };
    const base = {
      byId: new Map([['x', { settlement: smothered, causal: { scores: {} } }]]),
      regionalGraph: { channels: [], edges: [] },
    };
    const alone = counterforceAssessment(deadzone(['x']), base);

    const helped = {
      byId: new Map([
        ['x', { settlement: smothered, causal: { scores: {} } }],
        ['y', { settlement: arcaneTown('Helper'), causal: { scores: {} } }],
      ]),
      regionalGraph: {
        channels: [{ type: 'information_flow', from: 'y', to: 'x', status: 'confirmed' }],
        edges: [],
      },
    };
    const relieved = counterforceAssessment(deadzone(['x']), helped);
    expect(relieved.score).toBeGreaterThan(alone.score);
    const relief = relieved.sourceBreakdown.find(s => s.key === 'arcane_relief');
    expect(relief.value).toBe(1);
    expect(relief.label).toBe('external arcane relief');
  });

  test('the deadzone drags magic-dependent recoveries: disease and market shocks heal slower inside it', () => {
    const all = [
      normalizeStressor({ type: 'disease_outbreak', originSettlementId: 'x', severity: 0.6, affectedSettlementIds: ['x'] }),
      deadzone(['x']),
    ];
    const drag = synergyAssessment(all[0], all);
    expect(drag.companions).toContain('magic_deadzone');
    expect(drag.decayMult).toBeLessThan(1);
  });

  test('origin variants: arcane_burnout after an instability echo, leyline_silence out of nowhere', () => {
    const echoSnapshot = {
      worldState: {
        stressors: [{
          id: 'world_stressor.magical_instability.x',
          type: 'magical_instability',
          status: 'residual',
          memoryStrength: 0.4,
          affectedSettlementIds: ['x'],
        }],
      },
      byId: new Map(),
    };
    const burnout = interpretStressorOrigin('magic_deadzone', 'x', echoSnapshot, 9);
    expect(burnout.variant).toBe('arcane_burnout');
    expect(burnout.hooks.length).toBeGreaterThan(0);

    const quiet = interpretStressorOrigin('magic_deadzone', 'x', { worldState: { stressors: [] }, byId: new Map() }, 9);
    expect(quiet.variant).toBe('leyline_silence');
    expect(quiet.reason).toMatch(/leylines have simply gone quiet/);
  });
});
