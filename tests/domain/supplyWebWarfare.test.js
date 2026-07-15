/**
 * supplyWebWarfare.test.js — W-DOCTRINE-1: SUPPLY-WEB WARFARE
 * (DESIGN_SUPPLY_WEB_WARFARE.md) — the pin battery.
 *
 * Pins the pure decision layer + the direct-mover state machine WITHOUT a full
 * campaign drive (the dormancy/byte-identity proof lives in
 * tests/property/supplyWebWarfareDormancyGolden.test.js). Covered here:
 *   - the GATE (dark / partial / lit)                                    §8
 *   - the BELIEF-GATED WEB READ (true read + fragility + fog 'unknown')  §2
 *   - the STRATEGIC CHOICE EV (who chooses indirect + the time discount) §3
 *   - the ATROCITY BRAKE (a lawful-good aggressor prices razing highest) §7
 *   - PER-INSTRUMENT selection (archetype/alignment fit + determinism)   §4
 *   - the CAMPAIGN-PLAN mover: MINT (anti-vacuity) / ABANDON on adaptation §6
 *   - the RAID atrocity + the WRONG-VILLAGE (fog) strike                 §2/§7
 *   - the economic_strangulation PEACE-REASON FEED                       §5
 *   - the FORCEABLE VERBS + VETO_PROSE (the counterpart criterion)       §4
 */

import { describe, it, expect } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  supplyWebWarfareActive, readSupplyWeb, scoreCampaignEV, atrocityBrakeFor,
  instrumentFit, expectedBloodyShare, strangulationFelt01, advanceSupplyWebWarfare,
  orderSupplyRaid, declareTradeEmbargo, WEBWAR_VETO_PROSE, WEBWAR_TUNING, INSTRUMENTS,
} from '../../src/domain/worldPulse/supplyWebWarfare.js';
import { scoreEconomicStrangulation } from '../../src/domain/worldPulse/peaceReasons.js';
import { buildProducerIndex } from '../../src/domain/worldPulse/supplyKernel.js';

const IRON = 'Wrought iron';
const IDS = ['aggressor', 'crownhold', 'irondell', 'oldford'];

/** A digest placing the four ids on a grid — all mapped + mutually reachable. */
function digestFor() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

/** The governing faction category the seat archetype maps through (governingCoalition
 *  reads the faction roster — category → archetype: economy→merchant, military→military). */
const ARCHETYPE_CATEGORY = { merchant: 'economy', military: 'military', religious: 'religious' };

/** A settlement item ({ id, name, settlement, causal }) with controllable strength +
 *  governing archetype + supply role. The archetype is expressed as a GOVERNING FACTION
 *  (what governingCoalition actually reads), not a bare field. */
function item(id, name, {
  tier = 'town', population = 3000, exports = [], imports = [], archetype = '',
  institutions = [], activeChains = [], inputStockpiles,
} = {}) {
  const cat = ARCHETYPE_CATEGORY[archetype];
  const factions = cat
    ? [{ faction: `${name} Seat`, category: cat, power: 70, isGoverning: true }]
    : [{ faction: `${name} Council`, category: 'civic', power: 50, isGoverning: true }];
  return {
    id,
    name,
    settlement: {
      name, tier, population,
      config: { tradeRouteAccess: 'road' },
      institutions,
      economicState: {
        primaryExports: exports,
        primaryImports: imports,
        activeChains,
        ...(inputStockpiles ? { inputStockpiles } : {}),
      },
      powerStructure: { publicLegitimacy: { score: 50 }, factions, conflicts: [] },
      npcs: [],
      activeConditions: [],
    },
  };
}

/** The shared war world: a weaker aggressor hostile to a strong city (crownhold) whose
 *  ONE outside iron supplier is the fragile village irondell. oldford is an unrelated
 *  neutral. Beliefs DORMANT (omniscient) ⇒ the aggressor reads the true web. */
function makeWorld({ aggressorArchetype = 'merchant', aggressorMalice = 45, aggressorLawful = 60, lit = true } = {}) {
  const items = [
    item('aggressor', 'Marchmont', { tier: 'town', population: 3000, archetype: aggressorArchetype, malice: aggressorMalice, lawfulness: aggressorLawful }),
    item('crownhold', 'Crownhold', {
      tier: 'city', population: 60000, imports: [IRON],
      institutions: [{ name: 'War College' }, { name: 'Royal Armory' }],
      activeChains: [{ needKey: 'manufacturing', chainId: 'arms', resource: IRON, processingInstitutions: ['War College'], outputs: ['Forged Weapons'] }],
    }),
    item('irondell', 'Irondell', { tier: 'village', population: 400, exports: [IRON], malice: 12, lawfulness: 55 }),
    item('oldford', 'Oldford', { tier: 'town', population: 2500 }),
  ];
  const byId = new Map(items.map((it) => [it.id, it]));
  const relationshipStates = {
    'edge.aggressor.crownhold': { relationshipType: 'hostile', resentment: 0.6, trust: 0.1 },
  };
  const regionalGraph = ensureRegionalGraph({
    edges: [
      { id: 'edge.aggressor.crownhold', from: 'aggressor', to: 'crownhold', relationshipType: 'hostile' },
      { id: 'edge.crownhold.irondell', from: 'crownhold', to: 'irondell', relationshipType: 'trade_partner' },
    ],
  });
  const worldState = {
    tick: 5,
    simulationRules: lit ? { warLayerEnabled: true, supplyWebWarfareEnabled: true } : { warLayerEnabled: true },
    relationshipStates,
    spatialDigest: digestFor(),
  };
  const snapshot = { byId, settlements: items, regionalGraph, worldState };
  return { snapshot, worldState, items, byId };
}

// ── §8 THE GATE ────────────────────────────────────────────────────────────────

describe('W-DOCTRINE-1 §8 — the gate', () => {
  it('is DARK by default and with only one flag lit', () => {
    expect(supplyWebWarfareActive(undefined)).toBe(false);
    expect(supplyWebWarfareActive({ simulationRules: {} })).toBe(false);
    expect(supplyWebWarfareActive({ simulationRules: { warLayerEnabled: true } })).toBe(false);
    expect(supplyWebWarfareActive({ simulationRules: { supplyWebWarfareEnabled: true } })).toBe(false);
  });
  it('is LIT only when BOTH warLayerEnabled and the virtual supplyWebWarfareEnabled are true', () => {
    expect(supplyWebWarfareActive({ simulationRules: { warLayerEnabled: true, supplyWebWarfareEnabled: true } })).toBe(true);
  });
});

// ── §2 THE BELIEF-GATED WEB READ ─────────────────────────────────────────────────

describe('W-DOCTRINE-1 §2 — the belief-gated web read', () => {
  it('reads the target inbound web from the M2/M6a graph: the single iron supplier is FRAGILE, INFORMED (truth)', () => {
    const { snapshot, worldState } = makeWorld();
    const web = readSupplyWeb('aggressor', 'crownhold', snapshot, worldState, worldState.spatialDigest, buildProducerIndex(snapshot));
    expect(web.satellites.length).toBeGreaterThan(0);
    const sat = web.satellites.find((s) => s.satelliteId === 'irondell');
    expect(sat, 'irondell is read as a supplier of crownhold').toBeTruthy();
    expect(sat.fragile, 'the single-source iron web is fragile').toBe(true);
    expect(sat.source, 'beliefs dormant ⇒ the informed (truth) read').toBe('truth');
    expect(sat.confidence01).toBe(1);
    expect(web.fragility01).toBeGreaterThan(0);
  });

  it('FOG: with beliefs live and no record of the supplier, the read is UNKNOWN (confidence 0) — the wrong-village origin', () => {
    const { snapshot, worldState } = makeWorld();
    // Light beliefs: a spatial marker + a non-omniscient infoMode, and NO belief record.
    const foggy = { ...worldState, spatialCanonVersion: 1, simulationRules: { ...worldState.simulationRules, infoMode: 'unreliable' } };
    const web = readSupplyWeb('aggressor', 'crownhold', { ...snapshot, worldState: foggy }, foggy, foggy.spatialDigest, buildProducerIndex(snapshot));
    const sat = web.satellites.find((s) => s.satelliteId === 'irondell');
    expect(sat.source, 'no belief record ⇒ the aggressor does not truly know this supplier').toBe('unknown');
    expect(sat.confidence01).toBe(0);
    expect(web.confidence01, 'a fog-blind aggregate read').toBeLessThan(WEBWAR_TUNING.FOG_BLIND_CONFIDENCE);
  });
});

// ── §3 THE STRATEGIC CHOICE (direct vs indirect, time-discounted) ────────────────

describe('W-DOCTRINE-1 §3 — the strategic choice EV', () => {
  const fragileWeb = {
    targetId: 'T', satellites: [{ satelliteId: 'v1', input: 'iron', share01: 1, cost: 100, fragile: true, source: 'truth', confidence01: 1, believedOnly: false }],
    fragility01: 1, bufferThinness01: 0.8, confidence01: 1, truePathCount: 1,
  };

  it('WHO CHOOSES INDIRECT: a WEAKER aggressor with a fragile, known web prefers the indirect path', () => {
    const ev = scoreCampaignEV({ believedSelf: 0.55, believedTarget: 0.8, web: fragileWeb, atrocityBrake01: 0 });
    expect(ev.directEV, 'the direct assault is a losing bet').toBeLessThan(0.5);
    expect(ev.indirectEV, 'the indirect path beats the direct one').toBeGreaterThan(ev.directEV);
  });

  it('a BOLD STRONG aggressor just attacks — the indirect path is not worth the time cost', () => {
    const ev = scoreCampaignEV({ believedSelf: 0.9, believedTarget: 0.4, web: fragileWeb, atrocityBrake01: 0 });
    expect(ev.directEV, 'the direct assault dominates').toBeGreaterThan(0.9);
    expect(ev.indirectEV).toBeLessThanOrEqual(ev.directEV);
  });

  it('THE TIME DISCOUNT: a redundant (adapting) web and a fog-blind read both lower the indirect EV', () => {
    const base = scoreCampaignEV({ believedSelf: 0.55, believedTarget: 0.8, web: fragileWeb, atrocityBrake01: 0 });
    // Adaptation: the same web with redundant paths (M2 failover re-sources faster).
    const redundantWeb = { ...fragileWeb, truePathCount: 4, fragility01: 0.5,
      satellites: [{ ...fragileWeb.satellites[0], fragile: false }] };
    const adapting = scoreCampaignEV({ believedSelf: 0.55, believedTarget: 0.8, web: redundantWeb, atrocityBrake01: 0 });
    expect(adapting.indirectEV, 'a re-sourcing web is worth less to strangle').toBeLessThan(base.indirectEV);
    // Fog: the same fragile web read at low confidence buys a weaker strangulation.
    const foggyWeb = { ...fragileWeb, confidence01: 0.2 };
    const foggy = scoreCampaignEV({ believedSelf: 0.55, believedTarget: 0.8, web: foggyWeb, atrocityBrake01: 0 });
    expect(foggy.weakenReduction, 'a fog-blind read cannot reliably strangle').toBeLessThan(base.weakenReduction);
  });
});

// ── §7 THE ATROCITY BRAKE ────────────────────────────────────────────────────────

describe('W-DOCTRINE-1 §7 — the atrocity brake', () => {
  it('a LAWFUL-GOOD aggressor prices razing innocents highest; an already-evil one barely feels it', () => {
    const lawfulGood = atrocityBrakeFor({ actorLawfulness01: 0.95, actorMalice01: 0.05, avgVictimInnocence01: 0.9, bloodyShare01: 1 });
    const chaoticEvil = atrocityBrakeFor({ actorLawfulness01: 0.1, actorMalice01: 0.95, avgVictimInnocence01: 0.9, bloodyShare01: 1 });
    expect(lawfulGood).toBeGreaterThan(chaoticEvil);
    // A bloodless campaign (embargo) incurs no atrocity brake.
    expect(atrocityBrakeFor({ actorLawfulness01: 0.95, actorMalice01: 0.05, avgVictimInnocence01: 0.9, bloodyShare01: 0 })).toBe(0);
  });
});

// ── §4 PER-INSTRUMENT SELECTION ──────────────────────────────────────────────────

describe('W-DOCTRINE-1 §4 — instrument fit (alignment/archetype-flavored)', () => {
  it('a MERCHANT leans bloodless (embargo/toll/purchase-denial); a WARLORD leans raid/occupy', () => {
    const merchant = { archetype: 'merchant', evilLean01: 0.4, lawfulLean01: 0.7 };
    const warlord = { archetype: 'military', evilLean01: 0.7, lawfulLean01: 0.3 };
    expect(instrumentFit('embargo', merchant)).toBeGreaterThan(instrumentFit('raid', merchant));
    expect(instrumentFit('raid', warlord)).toBeGreaterThan(instrumentFit('embargo', warlord));
    // The expected bloody share reflects the lean (§7 mint brake).
    expect(expectedBloodyShare(merchant), 'a merchant is mostly bloodless').toBeLessThan(0.4);
    expect(expectedBloodyShare(warlord), 'a warlord leans bloody').toBeGreaterThan(expectedBloodyShare(merchant));
  });
});

// ── §6 THE CAMPAIGN-PLAN MOVER ───────────────────────────────────────────────────

describe('W-DOCTRINE-1 §6 — the campaign-plan mover', () => {
  it('ANTI-VACUITY: a weaker MERCHANT aggressor MINTS a bloodless indirect campaign against the strong city', () => {
    const { snapshot, worldState } = makeWorld({ aggressorArchetype: 'merchant', aggressorMalice: 40, aggressorLawful: 70 });
    const rng = createPRNG('webwar-test');
    const out = advanceSupplyWebWarfare({ snapshot, worldState, pIndex: null, digest: worldState.spatialDigest, rng, tick: 5 });
    expect(out.changed, 'the lit mover moved state (anti-vacuity)').toBe(true);
    const plans = out.worldState.spatialLedgers?.campaignPlans;
    expect(plans, 'the campaignPlans ledger materialized').toBeTruthy();
    expect(plans.aggressor, 'the aggressor holds a plan').toBeTruthy();
    expect(plans.aggressor.targetId).toBe('crownhold');
    expect(plans.aggressor.stages.length).toBeGreaterThan(0);
    expect(plans.aggressor.stages.length).toBeLessThanOrEqual(WEBWAR_TUNING.STAGE_CAP);
    // A merchant's mint is bloodless (no raid stage) most of the time — but always a
    // real supply-web instrument targeting the fragile satellite.
    expect(plans.aggressor.stages[0].satelliteId).toBe('irondell');
    expect(Object.keys(INSTRUMENTS)).toContain(plans.aggressor.stages[0].mode);
  });

  it('DORMANT: the same world with the gate dark is a complete no-op (no ledger)', () => {
    const { snapshot, worldState } = makeWorld({ lit: false });
    const out = advanceSupplyWebWarfare({ snapshot, worldState, pIndex: null, digest: worldState.spatialDigest, rng: createPRNG('x'), tick: 5 });
    expect(out.changed).toBe(false);
    expect(out.worldState.spatialLedgers?.campaignPlans).toBeUndefined();
    expect(out.atrocities).toEqual([]);
  });

  it('ABANDON on adaptation: a plan whose target re-sourced (fragility recovered) is abandoned, receipted', () => {
    const { snapshot, worldState } = makeWorld({ aggressorArchetype: 'merchant' });
    // Seed a live plan minted when the web was fully fragile; now the web is NOT fragile
    // (mintFragility high, current fragility low ⇒ adaptation ratio tripped).
    const seeded = {
      ...worldState,
      spatialLedgers: {
        campaignPlans: {
          aggressor: {
            targetId: 'crownhold',
            stages: [{ mode: 'embargo', satelliteId: 'irondell', input: 'wrought_iron', status: 'pending' }],
            mintedTick: 1, lastScoredTick: 1, ev01: 0.5, mintFragility01: 1, strangle01: 0.2,
          },
        },
      },
    };
    // Give crownhold a SECOND iron source so its web is no longer fragile (M2 failover).
    const s2 = { ...snapshot };
    const oldfordIt = snapshot.byId.get('oldford');
    oldfordIt.settlement.economicState.primaryExports = [IRON];
    const out = advanceSupplyWebWarfare({ snapshot: s2, worldState: seeded, pIndex: null, digest: seeded.spatialDigest, rng: createPRNG('y'), tick: 6 });
    expect(out.worldState.spatialLedgers?.campaignPlans, 'the abandoned plan drops (drop-when-empty)').toBeUndefined();
    expect(out.newsEntries.some((n) => n.kind === 'webwar_campaign_abandoned'), 'the abandonment is receipted').toBe(true);
  });
});

// ── §2/§7 THE RAID: atrocity + the wrong-village strike ──────────────────────────

describe('W-DOCTRINE-1 §2/§7 — the raid atrocity + wrong-village strike', () => {
  it('a RAID stage queues an atrocity instigation against the raided village', () => {
    const { snapshot, worldState } = makeWorld();
    // Force a raid campaign by decree (bypasses the EV gate — deterministic).
    const minted = orderSupplyRaid(worldState, { aggressorId: 'aggressor', targetId: 'crownhold', snapshot, digest: worldState.spatialDigest, tick: 5 });
    expect(minted.ok).toBe(true);
    // Coerce the first stage to a RAID so a bloody strike fires this tick.
    const plans = minted.worldState.spatialLedgers.campaignPlans;
    plans.aggressor.stages[0].mode = 'raid';
    const out = advanceSupplyWebWarfare({ snapshot, worldState: minted.worldState, pIndex: null, digest: worldState.spatialDigest, rng: createPRNG('z'), tick: 6 });
    expect(out.atrocities.length, 'a raid queues a moral-drift instigation').toBeGreaterThan(0);
    expect(out.atrocities[0].actorId).toBe('aggressor');
    expect(out.atrocities[0].victimId).toBe('irondell');
    expect(out.newsEntries.some((n) => n.kind === 'webwar_raid' || n.kind === 'webwar_wrong_village')).toBe(true);
  });

  it('WRONG-VILLAGE: a raid on a satellite NOT in the true web is flagged believedOnly + receipted', () => {
    const { snapshot, worldState } = makeWorld();
    const minted = orderSupplyRaid(worldState, { aggressorId: 'aggressor', targetId: 'crownhold', snapshot, digest: worldState.spatialDigest, tick: 5 });
    const plans = minted.worldState.spatialLedgers.campaignPlans;
    // Retarget the raid stage at oldford — a village that does NOT feed crownhold.
    plans.aggressor.stages[0] = { mode: 'raid', satelliteId: 'oldford', input: 'wrought_iron', status: 'pending' };
    const out = advanceSupplyWebWarfare({ snapshot, worldState: minted.worldState, pIndex: null, digest: worldState.spatialDigest, rng: createPRNG('w'), tick: 6 });
    expect(out.atrocities[0].believedOnly, 'the strike hit a village outside the true web').toBe(true);
    expect(out.newsEntries.some((n) => n.kind === 'webwar_wrong_village'), 'the wrong-village strike is receipted').toBe(true);
  });
});

// ── §5 THE PEACE-REASON FEED (economic_strangulation) ────────────────────────────

describe('W-DOCTRINE-1 §5 — the economic_strangulation peace-reason feed', () => {
  it('strangulationFelt01 is 0 when dark and reads the plan strangulation when lit', () => {
    expect(strangulationFelt01({ simulationRules: {} }, 'crownhold'), 'dark ⇒ 0 (byte-identical feed)').toBe(0);
    const ws = {
      simulationRules: { warLayerEnabled: true, supplyWebWarfareEnabled: true },
      spatialLedgers: { campaignPlans: { aggressor: { targetId: 'crownhold', stages: [], mintedTick: 1, lastScoredTick: 1, ev01: 0.5, mintFragility01: 1, strangle01: 0.44 } } },
    };
    expect(strangulationFelt01(ws, 'crownhold')).toBeCloseTo(0.44, 5);
    expect(strangulationFelt01(ws, 'someone_else')).toBe(0);
  });

  it('scoreEconomicStrangulation is byte-identical at strangulation 0 and ELEVATES under a live campaign', () => {
    const baseline = scoreEconomicStrangulation({ trade01: 0.1, economy01: 0.1 });
    const withDefault = scoreEconomicStrangulation({ trade01: 0.1, economy01: 0.1, strangulation01: 0 });
    expect(withDefault).toEqual(baseline); // the feed absent ⇒ identical reading
    const strangled = scoreEconomicStrangulation({ trade01: 0.1, economy01: 0.1, strangulation01: 0.7 });
    expect(strangled.score, 'a strangled town feels far more peace pressure').toBeGreaterThan(baseline.score);
    expect(strangled.receipt).toMatch(/strangle/i);
  });
});

// ── §4 THE FORCEABLE VERBS (the counterpart criterion) ───────────────────────────

describe('W-DOCTRINE-1 §4 — the forceable verbs + VETO_PROSE', () => {
  it('orderSupplyRaid: gate-dark / self / plan-exists all veto with prose; a valid decree mints', () => {
    const { snapshot, worldState } = makeWorld();
    const dark = orderSupplyRaid({ simulationRules: {} }, { aggressorId: 'a', targetId: 'b', snapshot, tick: 1 });
    expect(dark.ok).toBe(false);
    expect(dark.code).toBe('webwar_gate_dark');
    const self = orderSupplyRaid(worldState, { aggressorId: 'aggressor', targetId: 'aggressor', snapshot, digest: worldState.spatialDigest, tick: 1 });
    expect(self.ok).toBe(false);
    expect(self.code).toBe('webwar_self');
    const ok = orderSupplyRaid(worldState, { aggressorId: 'aggressor', targetId: 'crownhold', snapshot, digest: worldState.spatialDigest, tick: 1 });
    expect(ok.ok).toBe(true);
    expect(ok.worldState.spatialLedgers.campaignPlans.aggressor.targetId).toBe('crownhold');
    // A second decree on the same aggressor is refused (one plan per aggressor).
    const dup = orderSupplyRaid(ok.worldState, { aggressorId: 'aggressor', targetId: 'crownhold', snapshot, digest: worldState.spatialDigest, tick: 1 });
    expect(dup.ok).toBe(false);
    expect(dup.code).toBe('webwar_plan_exists');
    // Every veto code has DM-facing prose.
    for (const code of ['webwar_gate_dark', 'webwar_self', 'webwar_no_web', 'webwar_plan_exists']) {
      expect(typeof WEBWAR_VETO_PROSE[code]).toBe('string');
      expect(WEBWAR_VETO_PROSE[code].length).toBeGreaterThan(10);
    }
  });

  it('declareTradeEmbargo: the bloodless twin mints a single embargo stage on the primary artery', () => {
    const { snapshot, worldState } = makeWorld();
    const out = declareTradeEmbargo(worldState, { aggressorId: 'aggressor', targetId: 'crownhold', snapshot, digest: worldState.spatialDigest, tick: 3 });
    expect(out.ok).toBe(true);
    const plan = out.worldState.spatialLedgers.campaignPlans.aggressor;
    expect(plan.stages.length).toBe(1);
    expect(plan.stages[0].mode).toBe('embargo');
    expect(plan.stages[0].satelliteId).toBe('irondell');
  });

  it('a verb against a target with no readable web is refused', () => {
    const { snapshot, worldState } = makeWorld();
    // oldford imports nothing ⇒ no web.
    const out = orderSupplyRaid(worldState, { aggressorId: 'aggressor', targetId: 'oldford', snapshot, digest: worldState.spatialDigest, tick: 1 });
    expect(out.ok).toBe(false);
    expect(out.code).toBe('webwar_no_web');
  });
});
