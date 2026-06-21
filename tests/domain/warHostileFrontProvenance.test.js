import { describe, expect, test } from 'vitest';

import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph, relationshipChannelBundle, mintDirectedChannel } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// WAR-FRONT PROVENANCE READ-GATE (security-completeness — phantom-siege class).
//
// channelIdFor keys a channel on (type, from, to) ONLY, so a hostile RELATIONSHIP
// bundle (relationshipChannelBundle §hostile) and a war-layer SIEGE
// (mintDirectedChannel source 'war_layer_deploy') collide on the SAME war_front id
// (`channel.war_front.<from>.<to>.general`). The two are distinguished by their
// evidence provenance: a relationship front carries `source: 'relationship_label'`;
// a war-layer front carries `source: 'war_layer*'` (the sticky ownership tag).
//
// THE BUG (closed here): warDeployment.js's siege-DETECTION reads (warFrontsInto /
// warFrontsFrom / the target-set scan) used to treat ANY confirmed war_front as a
// live siege. So a hostile relationship — which mints a confirmed war_front with NO
// army behind it and which NEVER passed the mobilization/feasibility gates — was read
// as a siege: it emitted phantom war_pressure (harassment) on the "besieged" target
// and counted toward war_drain on the "besieger", a war that does not exist.
//
// THE GATE: the reads now skip a pure relationship-minted front (relationship_label,
// no war-layer tag). These tests prove a hostile-relationship front produces NO war
// activity, and an ANTI-VACUITY SENTINEL proves a war-layer front at the SAME id IS
// still read as a siege — so the first assertion is load-bearing (it fails if the
// gate is reverted, because the reverted reads treat both the same).
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
    activeConditions: [],
  };
}
function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}
// Strong attacker vs weak victim — the SAME asymmetry the real deploy/siege math
// would resolve, so the only reason no siege fires is the provenance gate.
function attacker(id, name) { return save(id, name, { tier: 'city', population: 45000 }); }
function victim(id, name) {
  return save(id, name, {
    tier: 'village', population: 280, legitimacy: 24,
    factions: [
      { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
      { faction: 'Hedge Wardens', category: 'military', power: 22 },
    ],
  });
}

const EDGES = [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }];
const RELATIONSHIP_STATES = { 'edge.strong.weak': { relationshipType: 'hostile' } };

// The REAL hostile-relationship war_front bundle — exactly what
// syncRelationshipChannelBundle mints when a relationship becomes hostile. Both
// directions carry `source: 'relationship_label'` and NO war-layer tag.
function hostileBundleFronts() {
  return relationshipChannelBundle({ id: 'edge.strong.weak', from: 'strong', to: 'weak' }, 'hostile', { now: NOW })
    .filter(c => c.type === 'war_front');
}

// A war-layer-minted front (source 'war_layer_deploy') at the SAME from→to id.
function warLayerFront(from, to) {
  return mintDirectedChannel({
    type: 'war_front', from, to, source: 'war_layer_deploy',
    relationshipKey: `war_front.${from}.${to}`, explanation: `${from} marches on ${to}.`, now: NOW,
  });
}

function snapFor(saves, { channels = [], deployments = {}, extraState = {} } = {}) {
  const worldState = {
    rngSeed: 'provenance', tick: 4,
    relationshipStates: RELATIONSHIP_STATES,
    deployments, simulationRules: { warLayerEnabled: true }, ...extraState,
  };
  const campaign = {
    id: 'provenance', settlementIds: saves.map(s => s.id), worldState,
    regionalGraph: ensureRegionalGraph({ edges: EDGES, channels }),
    wizardNews: { currentTick: 4, entries: [] },
  };
  return buildWorldSnapshot({ campaign, saves, worldState });
}

describe('war-front provenance read-gate — a hostile relationship is NOT a siege', () => {
  test('sanity: the seeded hostile bundle really is a confirmed war_front with relationship (not war-layer) provenance', () => {
    const fronts = hostileBundleFronts();
    expect(fronts.length).toBe(2); // two-way
    const fwd = fronts.find(c => c.from === 'strong' && c.to === 'weak');
    expect(fwd.status).toBe('confirmed');
    expect((fwd.evidence || []).some(e => e.source === 'relationship_label')).toBe(true);
    expect((fwd.evidence || []).some(e => typeof e.source === 'string' && e.source.startsWith('war_layer'))).toBe(false);
    // And it collides on id with what a war-layer deploy would mint — the whole reason
    // a provenance gate (not an id check) is required.
    expect(fwd.id).toBe(warLayerFront('strong', 'weak').id);
  });

  test('a hostile-relationship war_front (no army) produces NO siege activity', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    // The hostile bundle front exists, but NO deployment and NO war-ready posture — so
    // the only thing that could read this as a siege is the (now-gated) channel read.
    // The SENTINEL below proves a war-layer front at this SAME id/seed/tick conquers,
    // so the emptiness here is the gate working, not an inert engine.
    const snap = snapFor(saves, { channels: hostileBundleFronts() });
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('war-seed'), tick: 5, now: NOW, rules: { warLayerEnabled: true } });

    // No phantom war_pressure / harassment on the "besieged" target.
    expect(war.outcomes.some(o => o.candidateType === 'war_pressure')).toBe(false);
    // No phantom home-bleed on the "besieger".
    expect(war.outcomes.some(o => o.candidateType === 'war_drain' || o.candidateType === 'army_deployed')).toBe(false);
    // No conquest, and the relationship front does not get treated as a resolvable siege.
    expect(war.outcomes.some(o => o.candidateType === 'conquest')).toBe(false);
    expect(war.outcomes).toEqual([]);
    // The relationship front is NOT a siege, so it is never retired by the war layer.
    expect(war.retiredChannels).toEqual([]);
    expect(war.resolvedDeployments).toEqual([]);
  });

  test('the gate is targeted: war_drain reads (warFrontsFrom) ignore the relationship front', () => {
    // Give `strong` a REAL war-layer siege of a THIRD settlement (so it is a legit
    // deployer) while ALSO carrying a hostile-relationship front toward `weak`. The
    // home war_drain must reflect the ONE real front, not be inflated by the phantom.
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere'), victim('other', 'Brackmoor')];
    const edges = [
      { id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' },
      { id: 'edge.strong.other', from: 'strong', to: 'other', relationshipType: 'hostile' },
    ];
    const channels = [
      ...hostileBundleFronts(),               // relationship_label, strong↔weak — phantom
      warLayerFront('strong', 'other'),       // war_layer_deploy, strong→other — REAL siege
    ];
    const worldState = {
      rngSeed: 'mixed', tick: 4,
      relationshipStates: {
        'edge.strong.weak': { relationshipType: 'hostile' },
        'edge.strong.other': { relationshipType: 'hostile' },
      },
      deployments: { strong: { targetId: 'other', sinceTick: 1, role: 'siege' } },
      simulationRules: { warLayerEnabled: true },
    };
    const campaign = {
      id: 'mixed', settlementIds: ['strong', 'weak', 'other'], worldState,
      regionalGraph: ensureRegionalGraph({ edges, channels }),
      wizardNews: { currentTick: 4, entries: [] },
    };
    const snap = buildWorldSnapshot({ campaign, saves, worldState });
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('mixed'), tick: 5, now: NOW, rules: { warLayerEnabled: true } });

    // war_drain fires for the ONE real siege only (strong→other), never for weak.
    const drain = war.outcomes.filter(o => o.candidateType === 'war_drain');
    expect(drain.map(o => o.targetSaveId)).toEqual(['strong']);
    // `weak` is never read as a target/besieged settlement (no war_pressure on it).
    expect(war.outcomes.some(o => o.targetSaveId === 'weak')).toBe(false);
  });

  // ── ANTI-VACUITY SENTINEL ─────────────────────────────────────────────────────
  // The EXACT same fixture (same saves, same id, same seed 'war-seed', same tick 5),
  // but the front is WAR-LAYER-minted (source 'war_layer_deploy') instead of
  // relationship-minted. The gate MUST still read this as a siege: the channel-read
  // besieger union surfaces `strong` against `weak`, and the plausible matchup resolves
  // to a CONQUEST (the front is then retired). So the "empty outcomes" assertion above
  // is load-bearing — under a reverted gate BOTH fronts would conquer here, and the
  // hostile-relationship test would fail.
  test('SENTINEL: a war-layer-minted front at the SAME id IS read as a live siege (conquers + retires)', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const snap = snapFor(saves, { channels: [warLayerFront('strong', 'weak')] });
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('war-seed'), tick: 5, now: NOW, rules: { warLayerEnabled: true } });
    const conquest = war.outcomes.find(o => o.candidateType === 'conquest');
    expect(conquest).toBeTruthy();
    expect(conquest.targetSaveId).toBe('weak');
    // The resolved siege retired its (war-layer) front.
    expect(war.retiredChannels).toContain('channel.war_front.strong.weak.general');
  });
});
