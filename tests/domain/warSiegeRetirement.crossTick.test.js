import { describe, expect, test } from 'vitest';

import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { evaluateOccupations } from '../../src/domain/worldPulse/occupation.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import {
  ensureRegionalGraph,
  addRegionalChannels,
  setRegionalChannelStatus,
} from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// B01 — siege RESOLUTION retires the war_front channel (cross-tick).
//
// The existing war/occupation tests rebuild the regional graph from a CONST array
// every tick, so a "the front never retires → conquest re-fires every tick" bug is
// invisible to them. These tests THREAD pulse.regionalGraph forward unchanged and
// apply the producer-side `war.retiredChannels` (the caller drops each to 'dormant'
// via setRegionalChannelStatus) — so a resolved siege fires conquest EXACTLY ONCE
// and the war_front is no longer confirmed afterward (findings 1, 2, 4, 5).
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [
        { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
        { faction: 'Merchant League', category: 'economy', power: 52 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

const attacker = (id, name) => save(id, name, { tier: 'city', population: 45000 });
const victim = (id, name) => save(id, name, {
  tier: 'village', population: 280, legitimacy: 24,
  factions: [
    { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
    { faction: 'Hedge Wardens', category: 'military', power: 22 },
  ],
});

const EDGES = [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }];
const RELATIONSHIP_STATES = { 'edge.strong.weak': { relationshipType: 'hostile' } };

const warFront = (graph) => (graph.channels || []).find(c => c.type === 'war_front' && c.from === 'strong' && c.to === 'weak');

// Drive the war layer across ticks, THREADING the graph forward. When `applyRetire`
// is true the caller-side wiring (setRegionalChannelStatus → 'dormant') is simulated,
// so the test exercises the producer contract end-to-end.
function runWar({ applyRetire }) {
  const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
  let graph = ensureRegionalGraph({ edges: EDGES, channels: [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }] });
  let deployments = { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } };
  let conquests = 0;
  const retiredEver = [];
  for (let tick = 5; tick < 25; tick += 1) {
    const worldState = { rngSeed: 'war-seed', tick, relationshipStates: RELATIONSHIP_STATES, deployments, simulationRules: { warLayerEnabled: true } };
    const campaign = { id: 'siege-retire', name: 'Siege Retire', settlementIds: ['strong', 'weak'], worldState, regionalGraph: graph, wizardNews: { currentTick: tick, entries: [] } };
    const snap = buildWorldSnapshot({ campaign, saves, worldState });
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('war-seed'), tick, now: NOW, rules: { warLayerEnabled: true } });
    if (war.outcomes.some(o => o.candidateType === 'conquest')) conquests += 1;
    deployments = war.deployments;
    if (war.graphChannels.length) graph = addRegionalChannels(graph, war.graphChannels, { now: NOW });
    if (applyRetire) {
      for (const channelId of war.retiredChannels) {
        retiredEver.push(channelId);
        graph = setRegionalChannelStatus(graph, channelId, 'dormant', { now: NOW });
      }
    }
  }
  return { conquests, finalStatus: warFront(graph)?.status ?? '(gone)', retiredEver };
}

describe('B01 — siege resolution retires the war_front (cross-tick, threaded graph)', () => {
  test('evaluateWarLayer returns the resolved siege\'s war_front in retiredChannels on conquest', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const graph = ensureRegionalGraph({ edges: EDGES, channels: [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }] });
    const channelId = warFront(graph).id;
    const worldState = { rngSeed: 'war-seed', tick: 5, relationshipStates: RELATIONSHIP_STATES, deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } }, simulationRules: { warLayerEnabled: true } };
    const campaign = { id: 'siege-retire-one', settlementIds: ['strong', 'weak'], worldState, regionalGraph: graph, wizardNews: { currentTick: 5, entries: [] } };

    // Find a tick on which the siege actually falls, then assert the front is retired.
    let sawConquestWithRetire = false;
    for (let tick = 5; tick < 60; tick += 1) {
      const ws = { ...worldState, tick };
      const snap = buildWorldSnapshot({ campaign: { ...campaign, worldState: ws }, saves, worldState: ws });
      const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('war-seed'), tick, now: NOW, rules: { warLayerEnabled: true } });
      if (war.outcomes.some(o => o.candidateType === 'conquest')) {
        expect(war.retiredChannels).toContain(channelId);
        sawConquestWithRetire = true;
        break;
      }
      // Until it falls, a still-feasible held siege retires nothing.
      expect(war.retiredChannels).toEqual([]);
    }
    expect(sawConquestWithRetire).toBe(true);
  });

  test('with retiredChannels applied: a resolved siege fires conquest EXACTLY ONCE and the front goes dormant', () => {
    const { conquests, finalStatus, retiredEver } = runWar({ applyRetire: true });
    expect(conquests).toBe(1);
    expect(finalStatus).toBe('dormant'); // the war_front is no longer confirmed
    expect(retiredEver.length).toBeGreaterThan(0);
  });

  test('control: WITHOUT retiring the front (the bug), the resolved siege re-fires conquest every tick', () => {
    // This is the pathology findings 1/4 describe — the const-array tests cannot see it
    // because they rebuild the graph each tick. Here the threaded confirmed front persists.
    const { conquests, finalStatus } = runWar({ applyRetire: false });
    expect(conquests).toBeGreaterThan(1); // re-conquered repeatedly
    expect(finalStatus).toBe('confirmed'); // the stale front never retires
  });

  test('retiredChannels is deduped + codepoint-sorted (order-independent)', () => {
    // A coalition lists the same target front once per besieger; the output must dedup.
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const graph = ensureRegionalGraph({ edges: EDGES, channels: [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }] });
    const worldState = { rngSeed: 'war-seed', tick: 5, relationshipStates: RELATIONSHIP_STATES, deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } }, simulationRules: { warLayerEnabled: true } };
    const campaign = { id: 'siege-dedup', settlementIds: ['strong', 'weak'], worldState, regionalGraph: graph, wizardNews: { currentTick: 5, entries: [] } };
    for (let tick = 5; tick < 60; tick += 1) {
      const ws = { ...worldState, tick };
      const snap = buildWorldSnapshot({ campaign: { ...campaign, worldState: ws }, saves, worldState: ws });
      const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('war-seed'), tick, now: NOW, rules: { warLayerEnabled: true } });
      if (war.retiredChannels.length) {
        const sorted = [...war.retiredChannels].sort();
        expect(war.retiredChannels).toEqual(sorted);
        expect(new Set(war.retiredChannels).size).toBe(war.retiredChannels.length);
        break;
      }
    }
  });
});

describe('B01 — occupation does not re-seed to contested when the front is retired (findings 1+2)', () => {
  // Thread the war layer + occupation layer together across ticks, applying retiredChannels.
  // Once the front is retired, no fresh conquest re-fires, so the occupation is free to
  // climb out of `contested` instead of being rewound every tick.
  // Run the war + occupation layers threaded across ticks. Returns the conquest count
  // and the per-tick resistance trace for the 'weak' occupation, with the front-retire
  // wiring toggleable so the test can contrast the fix against the bug.
  function runWarPlusOccupation({ applyRetire }) {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    let graph = ensureRegionalGraph({ edges: EDGES, channels: [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }] });
    let deployments = { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } };
    let occupations = {};
    let conquests = 0;
    const resistanceTrace = [];

    for (let tick = 5; tick < 30; tick += 1) {
      const worldState = { rngSeed: 'war-seed', tick, relationshipStates: RELATIONSHIP_STATES, deployments, occupations, simulationRules: { warLayerEnabled: true } };
      const campaign = { id: 'occ-cross', settlementIds: ['strong', 'weak'], worldState, regionalGraph: graph, wizardNews: { currentTick: tick, entries: [] } };
      const snap = buildWorldSnapshot({ campaign, saves, worldState });
      const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('war-seed'), tick, now: NOW, rules: { warLayerEnabled: true } });
      if (war.outcomes.some(o => o.candidateType === 'conquest')) conquests += 1;
      deployments = war.deployments;
      if (war.graphChannels.length) graph = addRegionalChannels(graph, war.graphChannels, { now: NOW });
      if (applyRetire) {
        for (const channelId of war.retiredChannels) graph = setRegionalChannelStatus(graph, channelId, 'dormant', { now: NOW });
      }

      // Rebuild the snapshot off the (possibly retired) graph so the occupation layer reads it.
      const postSnap = buildWorldSnapshot({ campaign: { ...campaign, regionalGraph: graph, worldState: { ...worldState, deployments } }, saves, worldState: { ...worldState, deployments } });
      const occ = evaluateOccupations({
        snapshot: postSnap, worldState: { ...worldState, deployments, occupations }, graph,
        deployments, warOutcomes: war.outcomes, returnOutcomes: [], tick, rules: { warLayerEnabled: true },
      });
      occupations = occ.occupations;
      if (occupations.weak) resistanceTrace.push(occupations.weak.resistance);
    }
    return { conquests, resistanceTrace };
  }

  test('with the front retired the siege fires conquest ONCE; without it the conquest re-fires (findings 1+4)', () => {
    const fixed = runWarPlusOccupation({ applyRetire: true });
    // The siege resolved EXACTLY ONCE (the front was retired, no phantom re-conquest).
    expect(fixed.conquests).toBe(1);

    // CONTRAST (the primary bug, finding 1/4): without retiring the front, the SAME siege
    // re-fires the conquest every tick the matchup stays plausible — a perpetual phantom
    // siege that never ends.
    const buggy = runWarPlusOccupation({ applyRetire: false });
    expect(buggy.conquests).toBeGreaterThan(1);
  });

  test('the occupation resistance is NOT rewound to the fresh-conquest seed each tick (finding 2 defends both paths)', () => {
    // Finding 2 makes a same-occupier re-conquest a no-op, so even the front-not-retired
    // path no longer resets the occupation to the 0.35 createOccupationRecord seed. The
    // resistance evolves once and then holds steady in BOTH cases.
    for (const applyRetire of [true, false]) {
      const { resistanceTrace } = runWarPlusOccupation({ applyRetire });
      expect(resistanceTrace.length).toBeGreaterThan(5);
      const last = resistanceTrace[resistanceTrace.length - 1];
      const prev = resistanceTrace[resistanceTrace.length - 2];
      expect(last).not.toBe(0.35);                        // moved off the seed
      expect(Math.abs(last - prev)).toBeLessThan(1e-9);   // stable, not re-seeded each tick
    }
  });

  test('a same-occupier re-conquest is a NO-OP (does not rewind stabilization) — finding 2', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const snap = buildWorldSnapshot({
      campaign: { id: 'occ-reconq', settlementIds: ['strong', 'weak'], worldState: { rngSeed: 's', tick: 9, relationshipStates: RELATIONSHIP_STATES, simulationRules: { warLayerEnabled: true } }, regionalGraph: ensureRegionalGraph({ edges: EDGES }), wizardNews: { currentTick: 9, entries: [] } },
      saves,
      worldState: { rngSeed: 's', tick: 9, relationshipStates: RELATIONSHIP_STATES, simulationRules: { warLayerEnabled: true } },
    });
    // An occupation that has already advanced past contested, held by 'strong'.
    const existing = { weak: { occupierId: 'strong', state: 'extractive', stateHeld: 0, resistance: 0.2, sinceTick: 1, lastTick: 8, benefitYield: 0 } };
    // A stale duplicate conquest signal from the SAME occupier (the phantom re-conquest).
    const warOutcomes = [{ type: 'power_transfer', targetSaveId: 'weak', powerTransfer: { cause: 'conquest' }, condition: { causes: [{ source: 'strong' }] } }];
    const out = evaluateOccupations({
      snapshot: snap, worldState: { occupations: existing }, graph: snap.regionalGraph, deployments: {},
      warOutcomes, returnOutcomes: [], tick: 9, rules: { warLayerEnabled: true },
    });
    // It was NOT reset to contested/0.35 — the re-conquest by the same occupier no-ops the seed.
    expect(out.occupations.weak.occupierId).toBe('strong');
    expect(out.occupations.weak.state).not.toBe('contested');
  });
});
