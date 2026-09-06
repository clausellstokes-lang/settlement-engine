/**
 * generosityKernel.refuge.test.js — E1c: the REFUGE instrument goes live (design §4).
 *
 * "Generosity in people, not goods." The refuge PASS weighs each distressed qualifying pair
 * by the give-side motive alone (bond/history/conscience/strategy/faith; the domestic cost of
 * hospitality is priced downstream by M4's congestion brakes) and, on an OPEN, writes a
 * drop-when-empty refugePostures sub-ledger ('host:origin' → { phase:'open', …, weight01 })
 * that migrationKernel.buildDestinationCandidate reads as the refugePosture01 destination axis.
 *
 * These pins cover the WRITE side: the ledger populates when lit (a host opens toward a
 * famine ally), the key/shape match the M4 read, a refuge_granted incident + a succor beat
 * fire on the open transition, and — the constitutional core — the pass is DORMANT (no
 * refugePostures key) when the constructive-flows gate is absent.
 */
import { describe, it, expect } from 'vitest';
import { advanceGenerosity } from '../../src/domain/worldPulse/generosityKernel.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';
const deity = (ref, align, law) => ({ _deityRef: ref, name: ref, alignmentAxis: align, lawAxis: law, rankAxis: 'major' });

/** A settlement; a temple roster + a lawful-good patron make it a willing host. */
function town({ storageMonths, patron, temple = false, factions } = {}) {
  return {
    tier: 'town', population: 1600,
    config: { economicBase: 'agrarian', primaryDeitySnapshot: patron || null },
    institutions: temple ? [{ name: 'Temple of the Dawn', category: 'religious' }] : [],
    economicState: {
      economicBase: 'agrarian',
      foodSecurity: { storageMonths, deficitPct: storageMonths < 1 ? 60 : 0, surplusPct: 0 },
    },
    powerStructure: { publicLegitimacy: { score: 44, label: 'Contested' }, factions: factions || [{ faction: 'Gentry', category: 'noble', power: 60 }] },
  };
}

const EDGE = { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' };

/**
 * Drive one advance. Host 'a' (granary-rich, lawful-good, temple) is ALLIED to distressed
 * 'b' (famine, high food pressure) — the refuge candidate.
 * @param {{ lit: boolean, tick?: number, seed?: string, priorPostures?: Record<string, unknown> }} o
 */
function drive({ lit, tick = 1, seed = 'refuge', priorPostures }) {
  const host = town({ storageMonths: 8, patron: deity('gen_dawn', 'good', 'lawful'), temple: true });
  const distressed = town({ storageMonths: 0.3, patron: deity('gen_still', 'neutral', 'neutral') });
  const snapshot = {
    settlements: [{ id: 'a', name: 'Ashford', settlement: host }, { id: 'b', name: 'Briarwatch', settlement: distressed }],
  };
  const settlementUpdates = [{ saveId: 'a', settlement: host }, { saveId: 'b', settlement: distressed }];
  const worldState = {
    simulationRules: lit ? { constructiveFlowsEnabled: true, warLayerEnabled: false } : { warLayerEnabled: false },
    calendar: { elapsedWeeks: 30 },
    relationshipStates: { 'edge.a.b': { trust: 0.75, pactStrength: 0.6, recentIncidents: [] } },
    stressors: [{ id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 3 }],
    ...(priorPostures ? { spatialLedgers: { refugePostures: priorPostures } } : {}),
  };
  // High food pressure on b drives the distress/exodus signal.
  const pIndex = { get: (id) => ({ score: id === 'b' ? 0.9 : 0 }) };
  const graph = { edges: [EDGE] };
  return advanceGenerosity({ snapshot, worldState, settlementUpdates, pIndex, graph, rng: createPRNG(seed), tick, now: NOW });
}

describe('REFUGE — the posture goes live (design §4)', () => {
  it('LIT: a willing host OPENS a refuge posture toward the famine ally — ledger keyed host:origin', () => {
    const r = drive({ lit: true });
    expect(r.changed).toBe(true);
    const postures = getSpatialLedger(r.worldState, 'refugePostures') || {};
    // The host (a) opens toward the distressed origin (b): key 'a:b' (host:origin — the M4 read key).
    expect(postures['a:b'], 'a refuge posture a→b was written').toBeTruthy();
    expect(postures['a:b'].phase).toBe('open');
    expect(postures['a:b'].weight01, 'the posture carries a positive weight').toBeGreaterThan(0);
    expect(postures['a:b'].weight01).toBeLessThanOrEqual(1);
    // No spurious reverse posture: the famine town is in no state to host.
    expect(postures['b:a']).toBeUndefined();
  });

  it('LIT: the open transition banks a refuge_granted incident + a succor news beat', () => {
    const r = drive({ lit: true });
    const rel = r.worldState.relationshipStates['edge.a.b'];
    const incs = (rel.recentIncidents || []).map((/** @type {{type?:string}} */ i) => i.type);
    expect(incs, 'a refuge_granted incident was banked (aid changes history)').toContain('refuge_granted');
    expect(r.newsEntries.some((e) => e.impactKind === 'generosity_refuge'), 'a refuge news beat reached the Chronicle').toBe(true);
  });

  it('a HELD posture re-affirms SILENTLY (no repeat news/incident spam on later ticks)', () => {
    const prior = { 'a:b': { phase: 'open', sinceTick: 0, lastTick: 0, weight01: 0.4 } };
    const r = drive({ lit: true, tick: 2, priorPostures: prior });
    // Still open (re-affirmed), but no fresh open-transition beat.
    const postures = getSpatialLedger(r.worldState, 'refugePostures') || {};
    expect(postures['a:b']).toBeTruthy();
    expect(postures['a:b'].sinceTick, 'the dwell clock carried from the prior open').toBe(0);
    expect(r.newsEntries.some((e) => e.impactKind === 'generosity_refuge'), 'no repeat refuge beat for a held posture').toBe(false);
  });

  it('DORMANCY: the gate absent ⇒ NO refugePostures ledger, no refuge incident (byte-identical)', () => {
    const r = drive({ lit: false });
    expect(getSpatialLedger(r.worldState, 'refugePostures'), 'no refuge ledger when dormant').toBeFalsy();
    const rel = r.worldState.relationshipStates?.['edge.a.b'];
    const incs = (rel?.recentIncidents || []).map((/** @type {{type?:string}} */ i) => i.type);
    expect(incs).not.toContain('refuge_granted');
    expect(r.newsEntries.some((e) => e.impactKind === 'generosity_refuge')).toBe(false);
  });

  it('a STALE posture prunes when its distressed ally leaves the candidate set (the crisis passed)', () => {
    // A prior open posture whose lastTick is far behind + the receiver no longer distressed
    // (drop the famine/pressure so the pair is not re-enumerated) ⇒ the posture prunes.
    const prior = { 'a:b': { phase: 'open', sinceTick: 0, lastTick: 0, weight01: 0.4 } };
    const host = town({ storageMonths: 8, patron: deity('gen_dawn', 'good', 'lawful'), temple: true });
    const recovered = town({ storageMonths: 6, patron: deity('gen_still', 'neutral', 'neutral') });
    const snapshot = { settlements: [{ id: 'a', name: 'Ashford', settlement: host }, { id: 'b', name: 'Briarwatch', settlement: recovered }] };
    const worldState = {
      simulationRules: { constructiveFlowsEnabled: true, warLayerEnabled: false },
      calendar: { elapsedWeeks: 30 },
      relationshipStates: { 'edge.a.b': { trust: 0.75, pactStrength: 0.6, recentIncidents: [] } },
      stressors: [],
      spatialLedgers: { refugePostures: prior },
    };
    const r = advanceGenerosity({
      snapshot, worldState, settlementUpdates: [{ saveId: 'a', settlement: host }, { saveId: 'b', settlement: recovered }],
      pIndex: { get: () => ({ score: 0 }) }, graph: { edges: [EDGE] }, rng: createPRNG('stale'), tick: 40, now: NOW,
    });
    expect(getSpatialLedger(r.worldState, 'refugePostures'), 'the stale posture pruned ⇒ drop-when-empty').toBeFalsy();
  });
});
