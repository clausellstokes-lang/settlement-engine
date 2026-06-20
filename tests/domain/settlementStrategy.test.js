import { describe, expect, test } from 'vitest';

import { evaluateSettlementStrategyRules } from '../../src/domain/worldPulse/settlementStrategy.js';
import { evaluateWorldPulseRules, resolveCandidateConflicts } from '../../src/domain/worldPulse/candidateEvents.js';
import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// Feature C (C2) — the settlement strategy chooser. Test gates:
//   - OFF byte-identical (no candidate, no rng draw).
//   - softmax order-independent (reversing saves/edges → identical chosen moves).
//   - HARD-OVERRIDE return-home always fires AND suppresses the reactive escalation
//     for S (exactly one admitted candidate for S — no double-fire).
//   - no budget-starve (other families still fire with the chooser ON).
//   - sample-once: the emitted candidate is probability 1 (not re-rolled).
//
// Determinism contract under test: gated behind settlementStrategyEnabled,
// codepoint-sorted settlement loop + move enumeration, fork on
// `strategy:<S>:<tick>`, probability-1 emit (no double-randomize).
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { prosperity: patch.prosperity || 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [
        { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
        { faction: 'Merchant League', category: 'economy', power: 52 },
      ],
      conflicts: [],
    },
    npcs: patch.npcs || [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: settlement(name, patch),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function strongSave(id, name) {
  return save(id, name, { tier: 'city', population: 45000 });
}
function weakSave(id, name) {
  return save(id, name, {
    tier: 'village',
    population: 280,
    legitimacy: 24,
    factions: [
      { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
      { faction: 'Hedge Wardens', category: 'military', power: 22 },
    ],
  });
}

function strategyCampaign(rulesPatch = {}, { settlementIds, edges = [], relationshipStates = {}, channels = [], extraState = {} } = {}) {
  return {
    id: 'strategy-fixture',
    name: 'Strategy Fixture',
    settlementIds,
    worldState: {
      rngSeed: 'strategy-seed',
      tick: 6,
      relationshipStates,
      simulationRules: { settlementStrategyEnabled: true, ...rulesPatch },
      ...extraState,
    },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: 6, entries: [] },
  };
}

function snapshotFor(campaign, saves) {
  const snap = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
  const pIdx = pressureIndex(deriveSettlementPressures(snap));
  return { snap, pIdx };
}

// A hostile pair (strong vs weak), the canonical fixture.
const HOSTILE_PAIR = {
  settlementIds: ['strong', 'weak'],
  edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }],
  relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
};

describe('C2 strategy chooser — OFF byte-identity', () => {
  test('settlementStrategyEnabled:false emits NO strategy candidates and draws no rng', () => {
    const saves = [strongSave('strong', 'Ironhold'), weakSave('weak', 'Thornmere')];
    const { snap, pIdx } = snapshotFor(strategyCampaign({ settlementStrategyEnabled: false }, HOSTILE_PAIR), saves);

    let forkCalled = false;
    const rng = { random: () => 0.5, fork: () => { forkCalled = true; return { random: () => 0.5, fork: () => ({ random: () => 0.5 }) }; } };

    const out = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: false }, rng });
    expect(out).toEqual([]);
    expect(forkCalled).toBe(false); // no rng draw when OFF
  });

  test('a representative pulse with the chooser OFF is order-independent (legacy invariant intact)', () => {
    const saves = [strongSave('strong', 'Ironhold'), weakSave('weak', 'Thornmere')];
    const a = previewCampaignWorldPulse({ campaign: strategyCampaign({ settlementStrategyEnabled: false }, HOSTILE_PAIR), saves, interval: 'one_month', now: NOW });
    const b = previewCampaignWorldPulse({ campaign: strategyCampaign({ settlementStrategyEnabled: false }, HOSTILE_PAIR), saves: [...saves].reverse(), interval: 'one_month', now: NOW });

    expect(a.selected.some(o => String(o.candidateType || '').startsWith('strategy_'))).toBe(false);
    const ids = r => r.selected.map(o => o.id).sort();
    expect(ids(b)).toEqual(ids(a));
  });
});

describe('C2 strategy chooser — gated (anti-vacuity)', () => {
  test('ON emits a strategy candidate; OFF emits none (the flag does something)', () => {
    const saves = [strongSave('strong', 'Ironhold'), weakSave('weak', 'Thornmere')];
    const { snap, pIdx } = snapshotFor(strategyCampaign({}, HOSTILE_PAIR), saves);
    const on = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG('s') });
    const off = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: false }, rng: createPRNG('s') });

    expect(off).toHaveLength(0);
    expect(on.length).toBeGreaterThan(0);
    // Every emitted candidate is probability-1 (sample-once, no double-randomize)
    // and carries exactly one strategy:<S> exclusive tag.
    for (const c of on) {
      expect(c.probability).toBe(1);
      expect(c.conflictTags.filter(t => /^strategy:/.test(t))).toHaveLength(1);
      expect(c.ruleFamily).toBe('strategy');
    }
  });
});

describe('C2 strategy chooser — softmax order-independence', () => {
  test('reversing the saves/edges array yields identical chosen moves per settlement', () => {
    const saves = [
      strongSave('strong', 'Ironhold'),
      weakSave('weak', 'Thornmere'),
      save('mid', 'Midvale', { tier: 'town', population: 5200 }),
    ];
    const fixture = {
      settlementIds: ['strong', 'weak', 'mid'],
      edges: [
        { id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' },
        { id: 'edge.mid.weak', from: 'mid', to: 'weak', relationshipType: 'rival' },
        { id: 'edge.strong.mid', from: 'strong', to: 'mid', relationshipType: 'cold_war' },
      ],
      relationshipStates: {
        'edge.strong.weak': { relationshipType: 'hostile' },
        'edge.mid.weak': { relationshipType: 'rival' },
        'edge.strong.mid': { relationshipType: 'cold_war' },
      },
    };

    const run = (orderedSaves, orderedEdges) => {
      const fx = { ...fixture, edges: orderedEdges, settlementIds: orderedSaves.map(s => s.id) };
      const campaign = strategyCampaign({}, fx);
      const { snap, pIdx } = snapshotFor(campaign, orderedSaves);
      // A SHARED master rng each run, re-forked per settlement inside the chooser —
      // the per-settlement fork key is what makes the draw order-free.
      const out = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG('order') });
      return out.map(c => `${c.metadata.settlementId}:${c.metadata.strategyMove}`).sort();
    };

    const forward = run(saves, fixture.edges);
    const reversed = run([...saves].reverse(), [...fixture.edges].reverse());

    expect(reversed).toEqual(forward);
    // Anti-vacuity: the chooser actually chose moves.
    expect(forward.length).toBeGreaterThan(0);
  });
});

describe('C2 strategy chooser — HARD-OVERRIDE return-home + suppression', () => {
  function besiegedAtHomeWithArmyAbroad() {
    // `strong` has an army deployed against `weak`, but `strong` is ITSELF besieged
    // by `enemy` (a war_front INTO strong). Hard-override → recall.
    const saves = [
      strongSave('strong', 'Ironhold'),
      weakSave('weak', 'Thornmere'),
      strongSave('enemy', 'Grimwall'),
    ];
    const fixture = {
      settlementIds: ['strong', 'weak', 'enemy'],
      edges: [
        { id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' },
        { id: 'edge.enemy.strong', from: 'enemy', to: 'strong', relationshipType: 'hostile' },
      ],
      relationshipStates: {
        'edge.strong.weak': { relationshipType: 'hostile' },
        'edge.enemy.strong': { relationshipType: 'hostile' },
      },
      channels: [{ type: 'war_front', from: 'enemy', to: 'strong', status: 'confirmed' }],
      extraState: { deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } } },
    };
    return { saves, fixture };
  }

  test('a settlement besieged-at-home-with-army-abroad ALWAYS emits return_home (probability 1)', () => {
    const { saves, fixture } = besiegedAtHomeWithArmyAbroad();
    const { snap, pIdx } = snapshotFor(strategyCampaign({}, fixture), saves);

    // Run across many rng seeds — the hard override never depends on the roll.
    for (const seed of ['a', 'b', 'c', 'd', 'e']) {
      const out = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG(seed) });
      const forStrong = out.filter(c => c.metadata.settlementId === 'strong');
      expect(forStrong).toHaveLength(1);
      expect(forStrong[0].candidateType).toBe('strategy_return_home');
      expect(forStrong[0].probability).toBe(1);
    }
  });

  test('return_home suppresses the reactive escalation for S — exactly ONE admitted candidate for S', () => {
    const { saves, fixture } = besiegedAtHomeWithArmyAbroad();
    const { snap, pIdx } = snapshotFor(strategyCampaign({}, fixture), saves);

    // The reactive layer would emit a hostile_raid where `strong` is the aggressor
    // (it out-muscles `weak`). Build BOTH the strategy candidate and a stand-in
    // reactive raid candidate, then run them through the SAME conflict resolver.
    const strategy = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG('a') })
      .filter(c => c.metadata.settlementId === 'strong');
    expect(strategy).toHaveLength(1);

    const reactiveRaidByStrong = {
      id: 'candidate.relationship.hostile_raid.edge.strong.weak.6',
      type: 'condition',
      candidateType: 'hostile_raid',
      ruleFamily: 'relationship',
      targetSaveId: 'weak',
      severity: 0.6,
      probability: 0.4,
      applyMode: 'auto',
      conflictTags: ['relationship:edge.strong.weak'],
      // The reactive raid is driven BY `strong` (the state-decided aggressor).
      metadata: { incidentType: 'raid', aggressorSaveId: 'strong', victimSaveId: 'weak' },
    };

    const resolved = resolveCandidateConflicts([...strategy, reactiveRaidByStrong]);
    const aggressorMoves = resolved.filter(c =>
      c.metadata?.settlementId === 'strong' || c.metadata?.aggressorSaveId === 'strong');
    // Exactly one survives the exclusive tag — and it is the strategy move (it won).
    expect(aggressorMoves).toHaveLength(1);
    expect(aggressorMoves[0].candidateType).toBe('strategy_return_home');
  });
});

describe('C2 strategy chooser — no budget-starve', () => {
  test('with the chooser ON, OTHER families still produce candidates (strategy does not crowd out everything)', () => {
    // A populated mixed fixture: a hostile pair PLUS an unrelated settlement under
    // organic pressure, so non-strategy candidates exist alongside the guaranteed
    // strategy ones. Assert the resolved set carries BOTH.
    const saves = [strongSave('strong', 'Ironhold'), weakSave('weak', 'Thornmere'), save('calm', 'Calmford', { tier: 'town' })];
    const fixture = {
      settlementIds: ['strong', 'weak', 'calm'],
      edges: HOSTILE_PAIR.edges,
      relationshipStates: HOSTILE_PAIR.relationshipStates,
    };
    const pulse = previewCampaignWorldPulse({ campaign: strategyCampaign({}, fixture), saves, interval: 'one_month', now: NOW });

    const all = pulse.selected.concat(pulse.rollExplanations ? [] : []);
    const families = new Set(pulse.selected.map(o => o.ruleFamily));
    const hasStrategy = pulse.selected.some(o => String(o.candidateType || '').startsWith('strategy_'));
    // The chooser fired AND it did not monopolize: there is at least one
    // non-strategy ruleFamily among the resolved candidates.
    expect(hasStrategy).toBe(true);
    const nonStrategy = [...families].filter(f => f && f !== 'strategy');
    expect(nonStrategy.length).toBeGreaterThan(0);
    expect(all).toBeDefined();
  });

  test('the strategy candidate runs ONCE per settlement (not per edge) — at most one per settlement', () => {
    // `strong` sits on THREE hostile edges. If the chooser ran per-edge it would
    // emit 3 candidates for `strong` and starve the per-settlement budget.
    const saves = [
      strongSave('strong', 'Ironhold'),
      weakSave('w1', 'Amere'),
      weakSave('w2', 'Bmere'),
      weakSave('w3', 'Cmere'),
    ];
    const fixture = {
      settlementIds: ['strong', 'w1', 'w2', 'w3'],
      edges: [
        { id: 'edge.strong.w1', from: 'strong', to: 'w1', relationshipType: 'hostile' },
        { id: 'edge.strong.w2', from: 'strong', to: 'w2', relationshipType: 'hostile' },
        { id: 'edge.strong.w3', from: 'strong', to: 'w3', relationshipType: 'hostile' },
      ],
      relationshipStates: {
        'edge.strong.w1': { relationshipType: 'hostile' },
        'edge.strong.w2': { relationshipType: 'hostile' },
        'edge.strong.w3': { relationshipType: 'hostile' },
      },
    };
    const { snap, pIdx } = snapshotFor(strategyCampaign({}, fixture), saves);
    const out = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG('once') });
    const forStrong = out.filter(c => c.metadata.settlementId === 'strong');
    expect(forStrong).toHaveLength(1);
  });
});

describe('C2 strategy chooser — sue-for-peace gate', () => {
  test('an exhausted settlement in conflict (and not besieged) can sue for peace via the existing de-escalation lever', () => {
    // Give `strong` a heavy war_drain so its economic_capacity tanks → high
    // exhaustion → sue_for_peace is weighted up. It is NOT besieged (no war_front
    // into it) and has no vassals, so the peace gate is open.
    const drained = save('strong', 'Ironhold', {
      tier: 'city',
      population: 45000,
      activeConditions: [
        { archetype: 'war_drain', severity: 0.95, label: 'War drain' },
        { archetype: 'war_drain', severity: 0.95, label: 'War drain 2' },
      ],
    });
    const saves = [drained, weakSave('weak', 'Thornmere')];
    const { snap, pIdx } = snapshotFor(strategyCampaign({}, HOSTILE_PAIR), saves);

    // Sweep seeds; assert sue_for_peace is REACHABLE and, when chosen, it is a
    // relationship_label_change proposal pulling the existing hostile→cold_war path.
    let sawPeace = false;
    for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      const out = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG(seed) });
      const peace = out.find(c => c.metadata.settlementId === 'strong' && c.candidateType === 'strategy_sue_for_peace');
      if (peace) {
        sawPeace = true;
        expect(peace.proposalPayload.kind).toBe('relationship_label_change');
        expect(peace.proposalPayload.toType).toBe('cold_war');
        expect(peace.probability).toBe(1);
      }
    }
    expect(sawPeace).toBe(true);
  });

  test('a besieged settlement does NOT sue for peace (gate closed)', () => {
    const saves = [strongSave('strong', 'Ironhold'), weakSave('weak', 'Thornmere')];
    const fixture = {
      ...HOSTILE_PAIR,
      channels: [{ type: 'war_front', from: 'weak', to: 'strong', status: 'confirmed' }],
    };
    const { snap, pIdx } = snapshotFor(strategyCampaign({}, fixture), saves);
    for (const seed of ['a', 'b', 'c', 'd', 'e']) {
      const out = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG(seed) });
      const peace = out.find(c => c.metadata.settlementId === 'strong' && c.candidateType === 'strategy_sue_for_peace');
      expect(peace).toBeUndefined();
    }
  });
});

describe('C2 strategy chooser — integration through evaluateWorldPulseRules', () => {
  test('the chooser threads its rng and its probability-1 candidate flows through conflict resolution', () => {
    const saves = [strongSave('strong', 'Ironhold'), weakSave('weak', 'Thornmere')];
    const campaign = strategyCampaign({}, HOSTILE_PAIR);
    const snap = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
    const pressures = deriveSettlementPressures(snap);
    const resolved = evaluateWorldPulseRules(snap, {
      pressures,
      pressureIndex: pressureIndex(pressures),
      tick: 6,
      simulationRules: { settlementStrategyEnabled: true, relationshipDynamicsEnabled: true, stressorsEnabled: true },
      rng: createPRNG('integration'),
    });
    const strategyCandidates = resolved.filter(o => String(o.candidateType || '').startsWith('strategy_'));
    expect(strategyCandidates.length).toBeGreaterThan(0);
    for (const c of strategyCandidates) expect(c.probability).toBe(1);
  });
});
