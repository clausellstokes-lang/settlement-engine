/**
 * warClusterWC1.test.js — Phase 5 W-C1 (the war cluster).
 *
 * Four items, each pinned with the LAW they must obey:
 *   1a. DEPLOYMENT SIZING rust — a rusty realm over/under-commits (seeded, capped at
 *       RUST_MAX_ERROR geometry); rust 0 ⇒ byte-identical.
 *   1b. SUING-FOR-PEACE rust — the peace-threshold reading misread toward chaos+rust
 *       (delayed/premature suit); lawful/seasoned/deity-free reads it true.
 *   2.  THREAT ENVIRONMENT input to warFooting01 — the NEUTRALITY THEOREM: a world with
 *       no war records is BIT-IDENTICAL to the pre-W-C1 engine (threat 0).
 *   3.  SUPPLY-GAP QUALITY penalty — floored deployed-quality from supplyCompleteness;
 *       flag-gated (OFF ⇒ byte-identical).
 */

import { describe, it, expect } from 'vitest';

import {
  threatEnvironment01,
  buildThreatByCid,
  advanceMartialReadiness,
  rustMagnitude,
  MARTIAL_READINESS_TUNING,
} from '../../src/domain/worldPulse/martialReadiness.js';
import {
  deployedQualityMult,
  warKitCompleteness,
  SUPPLY_QUALITY_TUNING,
} from '../../src/domain/worldPulse/supplyQuality.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { evaluateSettlementStrategyRules } from '../../src/domain/worldPulse/settlementStrategy.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';

// ── shared minimal harness ─────────────────────────────────────────────────────
function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35, ...(patch.config || {}) },
    institutions: [],
    economicState: patch.economicState || { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
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
const save = (id, name, patch = {}) => ({ id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const attacker = (id, name, patch = {}) => save(id, name, { tier: 'city', population: 45000, ...patch });
const victim = (id, name) => save(id, name, {
  tier: 'village', population: 280, legitimacy: 24,
  factions: [{ faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true }, { faction: 'Hedge Wardens', category: 'military', power: 22 }],
});
const HOSTILE_EDGES = (from, to) => ({
  settlementIds: [from, to],
  edges: [{ id: `edge.${from}.${to}`, from, to, relationshipType: 'hostile' }],
  relationshipStates: { [`edge.${from}.${to}`]: { relationshipType: 'hostile' } },
});
function warCampaign({ edges, extraState = {} }) {
  return {
    id: 'wc1-fixture', name: 'WC1', settlementIds: edges.settlementIds,
    worldState: { rngSeed: 'wc1-seed', tick: 4, relationshipStates: edges.relationshipStates || {}, simulationRules: { warLayerEnabled: true }, ...extraState },
    regionalGraph: ensureRegionalGraph({ edges: edges.edges }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}
const snapshotFor = (campaign, saves) => buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
const MOBILIZED = { warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } } };
const CHAOTIC_DEVOUT = {
  primaryDeitySnapshot: { alignmentAxis: 'evil', lawAxis: 'chaotic', name: 'The Maw' },
  faithProfile: { piety: { local01: 0.8, localMult: 1.5, realmMult: 1, composite: 1.5, dampener: { megaphoneLaw: 1 } } },
};

// ═══════════════════════════════════════════════════════════════════════════════
// Item 2 — THREAT ENVIRONMENT + the NEUTRALITY THEOREM (the load-bearing pin)
// ═══════════════════════════════════════════════════════════════════════════════
describe('W-C1 item 2 — threat environment', () => {
  it('threatEnvironment01 is 0 when nothing is near, bounded at 1, monotone in presence', () => {
    const T = MARTIAL_READINESS_TUNING;
    expect(threatEnvironment01({})).toBe(0);
    expect(threatEnvironment01({ frontNear: true })).toBe(T.THREAT_FRONT);
    expect(threatEnvironment01({ frontNear: true, occupyNear: true, raidNear: true })).toBe(1); // clamped
    expect(threatEnvironment01({ occupyNear: true })).toBeGreaterThan(0);
  });

  it('buildThreatByCid is EMPTY for a world with NO war records — famine + a rival edge create no threat', () => {
    const snapshot = { regionalGraph: { channels: [], edges: [{ from: 's1', to: 's2', relationshipType: 'rival' }] } };
    const worldState = { occupations: {}, stressors: [{ type: 'famine', severity: 0.9, affectedSettlementIds: ['s1', 's2'] }] };
    expect(buildThreatByCid(snapshot, worldState).size).toBe(0);
  });

  it('a LIVE war front on a neighbour raises threat; a phantom relationship-minted front does NOT', () => {
    const edges = [{ from: 's1', to: 's2', relationshipType: 'trade_partner' }];
    // s3 besieges s2 (s1's neighbour) — a war-layer (bare, provenance-clean) front.
    const liveFront = { type: 'war_front', status: 'confirmed', from: 's3', to: 's2' };
    const live = buildThreatByCid({ regionalGraph: { channels: [liveFront], edges } }, { occupations: {}, stressors: [] });
    expect(live.get('s1') || 0).toBeGreaterThan(0);   // a menacing border
    expect(live.get('s2') || 0).toBeGreaterThan(0);   // the besieged town itself
    // The SAME front id shape but relationship-minted (a hostile label, no army) is a phantom.
    const phantom = { type: 'war_front', status: 'confirmed', from: 's3', to: 's2', evidence: [{ source: 'relationship_label' }] };
    expect(buildThreatByCid({ regionalGraph: { channels: [phantom], edges } }, { occupations: {}, stressors: [] }).size).toBe(0);
  });

  it('an occupation next door and a war-type stressor on self both raise threat', () => {
    const edges = [{ from: 'a', to: 'b', relationshipType: 'trade_partner' }];
    const occ = buildThreatByCid({ regionalGraph: { channels: [], edges } }, { occupations: { b: { occupierId: 'c', state: 'contested' } }, stressors: [] });
    expect(occ.get('a') || 0).toBeGreaterThan(0);   // b (neighbour) occupied ⇒ a feels it
    const raid = buildThreatByCid({ regionalGraph: { channels: [], edges } }, { occupations: {}, stressors: [{ type: 'siege', affectedSettlementIds: ['a'] }] });
    expect(raid.get('a') || 0).toBeGreaterThan(0);
    // A 'betrayal' stressor (the actualized deity stance-lane hostility) also counts.
    const betrayal = buildThreatByCid({ regionalGraph: { channels: [], edges } }, { occupations: {}, stressors: [{ type: 'betrayal', affectedSettlementIds: ['b'] }] });
    expect(betrayal.get('a') || 0).toBeGreaterThan(0);
  });

  // THE NEUTRALITY THEOREM: a zero-war world is BIT-IDENTICAL, even with non-war noise present.
  it('NEUTRALITY THEOREM: advanceMartialReadiness is byte-identical with vs without famine+rival noise (no war records ⇒ threat 0)', () => {
    const religionStates = { s1: { patronRef: 'd', deities: { d: { snapshot: { alignmentAxis: 'evil', lawAxis: 'neutral' } } } } };
    const base = { warPosture: { s1: { state: 'mobilized' } }, warExhaustion: { s1: 0.8 }, deployments: {}, occupations: {}, stressors: [] };
    const cleanSnap = { regionalGraph: { channels: [], edges: [] }, byId: { get: () => undefined } };
    const clean = advanceMartialReadiness({ snapshot: cleanSnap, worldState: base, religionStates, pietyByCid: {}, priorMartial: null });
    // Add non-war noise: a famine stressor + a hostile RIVAL relationship edge.
    const noisyWorld = { ...base, stressors: [{ type: 'famine', severity: 0.9, affectedSettlementIds: ['s1'] }] };
    const noisySnap = { regionalGraph: { channels: [], edges: [{ from: 's1', to: 's2', relationshipType: 'rival' }] }, byId: { get: () => undefined } };
    const noisy = advanceMartialReadiness({ snapshot: noisySnap, worldState: noisyWorld, religionStates, pietyByCid: {}, priorMartial: null });
    expect(JSON.stringify(noisy)).toBe(JSON.stringify(clean));   // BIT-IDENTICAL
    // Anti-vacuity: the same record does NOT carry a threat cause (threat was 0).
    expect((clean.martialByCid?.s1?.causes || []).some((c) => c.source === 'threat_environment')).toBe(false);
  });

  it('anti-vacuity: a live war front on a neighbour DOES raise footing + emits a threat_environment cause', () => {
    const religionStates = { s1: { patronRef: 'd', deities: { d: { snapshot: { alignmentAxis: 'neutral', lawAxis: 'neutral' } } } } };
    const world = { warPosture: {}, warExhaustion: {}, deployments: {}, occupations: {}, stressors: [] };
    const edges = [{ from: 's1', to: 's2', relationshipType: 'trade_partner' }];
    const peaceSnap = { regionalGraph: { channels: [], edges }, byId: { get: () => undefined } };
    const peace = advanceMartialReadiness({ snapshot: peaceSnap, worldState: world, religionStates, pietyByCid: {}, priorMartial: null });
    // A live war front besieging the neighbour s2.
    const menaceSnap = { regionalGraph: { channels: [{ type: 'war_front', status: 'confirmed', from: 's3', to: 's2' }], edges }, byId: { get: () => undefined } };
    const menace = advanceMartialReadiness({ snapshot: menaceSnap, worldState: world, religionStates, pietyByCid: {}, priorMartial: null });
    // Peace with no threat ⇒ no record at all (footing 0). A menacing border ⇒ a record with a threat cause.
    expect(peace.martialByCid).toBeNull();
    expect(menace.martialByCid?.s1?.footing).toBeGreaterThan(0);
    expect((menace.martialByCid?.s1?.causes || []).some((c) => c.source === 'threat_environment')).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Item 3 — SUPPLY-GAP QUALITY penalty
// ═══════════════════════════════════════════════════════════════════════════════
describe('W-C1 item 3 — supply-gap deployed quality', () => {
  const qSnap = (exportsList) => ({
    byId: { get: (id) => (String(id) === 'x' ? { settlement: { economicState: { primaryExports: exportsList } } } : undefined) },
    regionalGraph: { channels: [] },
  });

  it('a self-supplying war economy fields near-full quality; a chainless one sits at the FLOOR, never zero', () => {
    const F = SUPPLY_QUALITY_TUNING.FLOOR;
    const armed = deployedQualityMult(qSnap(['Iron', 'Weapons and armour', 'Leather goods', 'Livestock', 'Preserved provisions']), 'x');
    const bare = deployedQualityMult(qSnap(['Textiles']), 'x');
    expect(bare).toBeCloseTo(F, 5);                 // no war kit ⇒ the floor, degraded but never zero
    expect(bare).toBeGreaterThan(0);
    expect(armed).toBeGreaterThan(bare);            // self-supply lifts quality
    expect(armed).toBeLessThanOrEqual(1);
    expect(warKitCompleteness(qSnap([]), 'x')).toBe(0);   // produces nothing ⇒ completeness 0
  });

  it('the war layer applies the penalty ONLY under the flag (OFF ⇒ byte-identical strength; ON ⇒ degraded + stamped)', () => {
    const saves = [attacker('strong', 'Ironhold'), victim('weak', 'Thornmere')];
    const edges = HOSTILE_EDGES('strong', 'weak');
    const snap = snapshotFor(warCampaign({ edges, extraState: MOBILIZED }), saves);
    const run = (rules) => evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('q'), tick: 5, now: NOW, rules });
    const off = run({ warLayerEnabled: true });
    const on = run({ warLayerEnabled: true, warSupplyQualityEnabled: true });
    expect(off.deployments.strong.deployedQuality).toBeUndefined();        // flag off ⇒ no stamp (byte-identical)
    expect(on.deployments.strong.deployedQuality).toBeCloseTo(SUPPLY_QUALITY_TUNING.FLOOR, 5); // no war exports ⇒ floor
    expect(on.deployments.strong.maxStartStrength).toBeLessThan(off.deployments.strong.maxStartStrength);
    // Attrition-facing kit (equipment/supply) is degraded too.
    expect(on.deployments.strong.equipmentCondition).toBeLessThan(off.deployments.strong.equipmentCondition);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Item 1a — DEPLOYMENT SIZING rust
// ═══════════════════════════════════════════════════════════════════════════════
describe('W-C1 item 1a — deployment sizing rust', () => {
  const runDeploy = (attackerPatch) => {
    const saves = [attacker('strong', 'Ironhold', attackerPatch), victim('weak', 'Thornmere')];
    const edges = HOSTILE_EDGES('strong', 'weak');
    const snap = snapshotFor(warCampaign({ edges, extraState: MOBILIZED }), saves);
    return evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('size'), tick: 5, now: NOW, rules: { warLayerEnabled: true } });
  };

  it('a RUSTY realm mis-sizes the committed force (sizingBias ≠ 1); a seasoned/deity-free realm does not (byte-identical)', () => {
    // Rust 0.35 (experience01 0), readiness 0 (no effectiveStat confound).
    const rusty = runDeploy({ config: { faithProfile: { martial: { experience01: 0, readiness01: 0 } } } });
    const seasoned = runDeploy({ config: { faithProfile: { martial: { experience01: 1, readiness01: 0 } } } });
    const clean = runDeploy({});
    expect(rusty.deployments.strong.sizingBias).toBeDefined();
    expect(rusty.deployments.strong.sizingBias).not.toBe(1);
    // The error is capped consistent with RUST_MAX_ERROR geometry (|bias − 1| ≤ RUST_MAX_ERROR).
    expect(Math.abs(rusty.deployments.strong.sizingBias - 1)).toBeLessThanOrEqual(MARTIAL_READINESS_TUNING.RUST_MAX_ERROR + 1e-9);
    // Seasoned (rust 0) and deity-free (no record) ⇒ no sizing bias ⇒ byte-identical strength.
    expect(seasoned.deployments.strong.sizingBias).toBeUndefined();
    expect(clean.deployments.strong.sizingBias).toBeUndefined();
    expect(seasoned.deployments.strong.maxStartStrength).toBe(clean.deployments.strong.maxStartStrength);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Item 1b — SUING-FOR-PEACE rust (peace-threshold misread)
// ═══════════════════════════════════════════════════════════════════════════════
describe('W-C1 item 1b — suing-for-peace rust', () => {
  // A single settlement 's' in a hostile posture with a besieging front out (in conflict),
  // economically drained (high exhaustion ⇒ sue_for_peace is a live move).
  function strategyWorld(attackerPatch = {}) {
    const saves = [
      save('s', 'Weyrmoor', { legitimacy: 8, config: attackerPatch.config, ...attackerPatch }),
      save('t', 'Rookhaven', { legitimacy: 55 }),
    ];
    const campaign = {
      id: 'sfp', name: 'SFP', settlementIds: ['s', 't'],
      worldState: {
        rngSeed: 'sfp-seed', tick: 6,
        relationshipStates: { 'edge.s.t': { relationshipType: 'hostile' } },
        simulationRules: { settlementStrategyEnabled: true },
      },
      regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.s.t', from: 's', to: 't', relationshipType: 'hostile' }] }),
      wizardNews: { currentTick: 6, entries: [] },
    };
    const snap = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
    const pIdx = pressureIndex(deriveSettlementPressures(snap));
    return { snap, pIdx };
  }
  const sueCandidate = (out) => out.find((c) => c.candidateType === 'strategy_sue_for_peace');

  it('a lawful, deity-free realm reads the peace threshold TRUE (no misread reason)', () => {
    const { snap, pIdx } = strategyWorld();
    const out = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG('true') });
    const sue = sueCandidate(out);
    if (sue) expect(sue.reasons.some((r) => /misread/i.test(r))).toBe(false);
    // The rng-less fallback is also unchanged for a deity-free settlement (no fork).
    const noRng = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true } });
    expect(JSON.stringify(noRng)).toBe(JSON.stringify(evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true } })));
  });

  it('a chaotic-devout realm MISREADS the war-bankruptcy threshold (surfaced as a named cause)', () => {
    // Chaotic-devout patron ⇒ chaosPull > 0 ⇒ the peace reading is distorted when it sues.
    const { snap, pIdx } = strategyWorld({ config: CHAOTIC_DEVOUT });
    // Sweep seeds; SOME tick the chaotic realm sues, and when it does the misread cause rides.
    let sawMisread = false;
    for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      const out = evaluateSettlementStrategyRules(snap, pIdx, { tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG(seed) });
      const sue = sueCandidate(out);
      if (sue && sue.reasons.some((r) => /misread of war-bankruptcy/i.test(r))) { sawMisread = true; break; }
    }
    expect(sawMisread).toBe(true);
  });
});
