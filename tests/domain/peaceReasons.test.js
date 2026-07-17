/**
 * peaceReasons.test.js — W-PEACE-1 peace-side reason pins (DESIGN_PEACE_ENGINE.md
 * §14.2), THE BLAINEY PIN (§1), and the §14.4 irony read-model pin.
 *
 * THE BLAINEY PIN: a war between courts whose beliefs converge measurably seeks
 * peace (belief_convergence materializes and lifts the peace factor); a war
 * where fog keeps beliefs apart grinds on (both courts believing the foe weak
 * ⇒ divergence ⇒ the reason stays silent and the factor stays at baseline).
 * The margins are composed through readBeliefStrength — the fog case seeds the
 * EXISTING beliefMaps ledger + spatialCanonVersion marker; no truth read, no
 * new belief write.
 */

import { describe, it, expect } from 'vitest';

import {
  advancePeaceReasons, peaceReasonFactor, peaceReasonsFor, warCausalBrief,
  scoreExhaustion, scoreBeliefConvergence, scoreEconomicStrangulation,
  scoreCoalitionFracture, scoreMediation, scoreHarvestPressure, scoreRealignment,
  scoreSpheresUnderstanding, PEACE_REASON_TUNING,
} from '../../src/domain/worldPulse/peaceReasons.js';
import { REASON_TUNING, PEACE_REASON_TYPES, reasonPairKey } from '../../src/domain/worldPulse/warReasons.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';

// ── Fixture helpers ──────────────────────────────────────────────────────────

const LIT_RULES = { warLayerEnabled: true, peaceEngineEnabled: true };

/** A snapshot item with enough texture for settlementStrength (~0.79). */
function item(id, { patron = null } = {}) {
  return {
    id, name: id.charAt(0).toUpperCase() + id.slice(1),
    settlement: {
      name: id, tier: 'town', population: 1800,
      config: {
        tradeRouteAccess: 'road', priorityMilitary: 35,
        ...(patron ? { primaryDeitySnapshot: patron } : {}),
      },
      institutions: [],
      economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: 'Military Council', category: 'military', power: 78, isGoverning: true }],
        conflicts: [],
      },
      npcs: [], activeConditions: [],
    },
  };
}

const deity = (ref, align) => ({ _deityRef: ref, name: ref, alignmentAxis: align, lawAxis: 'neutral', rankAxis: 'major' });

function snapshotFor(items, edges = []) {
  return { byId: new Map(items.map((i) => [String(i.id), i])), regionalGraph: { edges } };
}

/** A minimal live-war world: a besieges b. */
function warWorld(extra = {}) {
  return {
    simulationRules: { ...LIT_RULES },
    deployments: { a: { targetId: 'b', sinceTick: 1, role: 'siege' } },
    calendar: { elapsedWeeks: 30 },
    ...extra,
  };
}

// ── The typed scorers: positive + negative controls ─────────────────────────

describe('peace-reason scorers — each typed reason has a positive and a negative control', () => {
  it('exhaustion: the scar mints verbatim; a fresh belligerent stays silent', () => {
    const worn = scoreExhaustion({ scar01: 0.6 });
    expect(worn.score).toBeCloseTo(0.6, 5);
    expect(worn.receipt).toMatch(/exhaustion/i);
    expect(scoreExhaustion({ scar01: 0 }).score).toBe(0);
  });

  it('BLAINEY (scorer): consistent beliefs converge; both-believe-winning diverges and blocks', () => {
    // Consistent world model: A believes it leads by what B believes it trails.
    const converged = scoreBeliefConvergence({ marginA: 0.2, marginB: -0.2 });
    expect(converged.score).toBe(1);
    expect(converged.receipt).toMatch(/same truth/i);
    // Both courts believe they are winning — every offer insults; the war grinds on.
    expect(scoreBeliefConvergence({ marginA: 0.3, marginB: 0.3 }).score).toBe(0);
    // Part-way convergence reads part-way.
    const drifting = scoreBeliefConvergence({ marginA: 0.15, marginB: 0.05 });
    expect(drifting.score).toBeGreaterThan(0);
    expect(drifting.score).toBeLessThan(1);
  });

  it('economic strangulation: severed trade + drained treasury mint; a healthy economy stays silent', () => {
    expect(scoreEconomicStrangulation({ trade01: 0.8, economy01: 0.7 }).score).toBeGreaterThan(0.5);
    expect(scoreEconomicStrangulation({ trade01: 0, economy01: 0 }).score).toBe(0);
  });

  it('W-MOMENTUM Stage 0(a): a naval blockade elevates strangulation with its own receipt; absent ⇒ byte-identical', () => {
    // Byte-identity: blockade01 absent/0 reproduces the exact prior score AND receipt.
    const dry = scoreEconomicStrangulation({ trade01: 0.3, economy01: 0.2 });
    const dryExplicitZero = scoreEconomicStrangulation({ trade01: 0.3, economy01: 0.2, blockade01: 0 });
    expect(dryExplicitZero).toEqual(dry);
    // A blockade above the trade/economy baseline elevates the felt strangulation and names the harbour.
    const blockaded = scoreEconomicStrangulation({ trade01: 0.1, economy01: 0.1, blockade01: 0.75 });
    expect(blockaded.score).toBeGreaterThan(dry.score);
    expect(blockaded.score).toBeCloseTo(0.75, 5);
    expect(blockaded.receipt).toContain('blockaded');
    // The supply-web receipt still wins when the supply-web pressure is the tighter of the two.
    const web = scoreEconomicStrangulation({ trade01: 0.1, economy01: 0.1, strangulation01: 0.8, blockade01: 0.4 });
    expect(web.receipt).toContain('supply web');
  });

  it('coalition fracture: a peeled ally mints with evidence; an intact (or never-had) coalition stays silent', () => {
    const peeled = scoreCoalitionFracture({ peakAllies: 2, nowAllies: 1 });
    expect(peeled.score).toBeCloseTo(0.5, 5);
    expect(peeled.evidence).toEqual({ peakAllies: 2, nowAllies: 1 });
    expect(scoreCoalitionFracture({ peakAllies: 2, nowAllies: 2 }).score).toBe(0);
    expect(scoreCoalitionFracture({ peakAllies: 0, nowAllies: 0 }).score).toBe(0);
  });

  it('mediation: a cross-pressured broker mints (named); no broker stays silent', () => {
    const brokered = scoreMediation({ impulse: 1, mediatorName: 'Midwater' });
    expect(brokered.score).toBeCloseTo(PEACE_REASON_TUNING.MEDIATION_PRESENT, 5);
    expect(brokered.receipt).toMatch(/Midwater/);
    expect(scoreMediation({ impulse: 0, mediatorName: '' }).score).toBe(0);
  });

  it('harvest pressure: autumn mints; every other season stays silent', () => {
    expect(scoreHarvestPressure({ season: 'autumn' }).score).toBeCloseTo(PEACE_REASON_TUNING.HARVEST_PRESENT, 5);
    for (const season of ['spring', 'summer', 'winter']) {
      expect(scoreHarvestPressure({ season }).score).toBe(0);
    }
  });

  it('realignment: a COMMON third attacker mints hardest; distinct thirds soften; a private war stays silent', () => {
    const common = scoreRealignment({ commonThird: 'horde', bothBesetByThirds: true });
    expect(common.score).toBeCloseTo(PEACE_REASON_TUNING.REALIGNMENT_COMMON_THIRD, 5);
    expect(common.receipt).toMatch(/horde|passes/i);
    const distinct = scoreRealignment({ commonThird: null, bothBesetByThirds: true });
    expect(distinct.score).toBeCloseTo(PEACE_REASON_TUNING.REALIGNMENT_DISTINCT_THIRDS, 5);
    expect(scoreRealignment({ commonThird: null, bothBesetByThirds: false }).score).toBe(0);
  });

  it('W-CONVERGENCE spheres_understanding: clash pressure mints; no clash stays silent', () => {
    expect(PEACE_REASON_TYPES).toContain('spheres_understanding');
    expect(scoreSpheresUnderstanding({ clash01: 0.6 }).score).toBeGreaterThan(0);
    expect(scoreSpheresUnderstanding({ clash01: 0.6 }).receipt).toBeTruthy();
    expect(scoreSpheresUnderstanding({ clash01: 0 }).score).toBe(0);
    expect(scoreSpheresUnderstanding({ clash01: 0 }).receipt).toBe('');
  });
});

// ── THE BLAINEY PIN (mover level: fighting is information, never a truth read) ──

describe('THE BLAINEY PIN — convergence seeks peace; fog grinds on', () => {
  it('truth-consistent courts (belief layer dormant ⇒ both read the same reality): belief_convergence PRESENT and the peace factor lifts', () => {
    const snapshot = snapshotFor([item('a'), item('b')]);
    const ws = warWorld({ warExhaustion: { a: 0.4, b: 0.4 } });
    const r = advancePeaceReasons({ snapshot, worldState: ws, graph: { edges: [] }, tick: 10 });
    expect(r.changed).toBe(true);
    const entry = peaceReasonsFor(r.worldState, 'a', 'b');
    expect(entry.reasons.belief_convergence, 'convergence materialized').toBeTruthy();
    expect(entry.reasons.belief_convergence.score).toBeGreaterThan(0.9);
    const factor = peaceReasonFactor(r.worldState, 'a', 'b');
    expect(factor, 'the converged war seeks peace').toBeGreaterThan(1);
    expect(factor).toBeLessThanOrEqual(1 + REASON_TUNING.PEACE_FACTOR_W);
  });

  it('fog-divergent courts (both believe the foe WEAK through the existing beliefMaps ledger): belief_convergence ABSENT — the war grinds on', () => {
    const snapshot = snapshotFor([item('a'), item('b')]);
    const believedWeak = { readiness: 0.2, strengthBand: 0, allianceLabel: 'hostile', faithLabel: null, confidence01: 0.8, lastUpdateTick: 9 };
    const ws = warWorld({
      simulationRules: { ...LIT_RULES, infoMode: 'full' }, // beliefs live: marker + non-omniscient
      spatialCanonVersion: 1, // the belief layer's liveness marker
      warExhaustion: { a: 0.4, b: 0.4 },
      spatialLedgers: {
        beliefMaps: {
          a: { [GOVERNING_SEAT_KEY]: { b: { ...believedWeak } } },
          b: { [GOVERNING_SEAT_KEY]: { a: { ...believedWeak } } },
        },
      },
    });
    const r = advancePeaceReasons({ snapshot, worldState: ws, graph: { edges: [] }, tick: 10 });
    const entry = peaceReasonsFor(r.worldState, 'a', 'b');
    expect(entry, 'other reasons (exhaustion) still accumulate').toBeTruthy();
    expect(entry.reasons.belief_convergence, 'both courts believe they are winning — no offer clears').toBeUndefined();
    // The fog war still carries SOME case (exhaustion), but strictly less than
    // the converged twin: fighting-as-information is what closes the gap.
    const fogFactor = peaceReasonFactor(r.worldState, 'a', 'b');
    const truthTwin = advancePeaceReasons({
      snapshot: snapshotFor([item('a'), item('b')]),
      worldState: warWorld({ warExhaustion: { a: 0.4, b: 0.4 } }),
      graph: { edges: [] }, tick: 10,
    });
    const truthFactor = peaceReasonFactor(truthTwin.worldState, 'a', 'b');
    expect(fogFactor).toBeLessThan(truthFactor);
  });
});

// ── The mover ────────────────────────────────────────────────────────────────

describe('advancePeaceReasons — the mover', () => {
  it('dormant ⇒ identity no-op even with a live war', () => {
    const ws = { simulationRules: { warLayerEnabled: true }, deployments: { a: { targetId: 'b' } } };
    const r = advancePeaceReasons({ snapshot: snapshotFor([item('a'), item('b')]), worldState: ws, graph: { edges: [] }, tick: 10 });
    expect(r.worldState).toBe(ws);
    expect(r.changed).toBe(false);
  });

  it('lit but PEACEFUL world (no deployments) ⇒ no ledger materializes', () => {
    const ws = { simulationRules: { ...LIT_RULES }, deployments: {}, calendar: { elapsedWeeks: 30 } };
    const r = advancePeaceReasons({ snapshot: snapshotFor([item('a'), item('b')]), worldState: ws, graph: { edges: [] }, tick: 10 });
    expect(r.changed).toBe(false);
    expect(r.worldState).toBe(ws);
  });

  it('BOTH belligerents accumulate their own directed case (attacker and defender)', () => {
    const ws = warWorld({ warExhaustion: { a: 0.3, b: 0.7 } });
    const r = advancePeaceReasons({ snapshot: snapshotFor([item('a'), item('b')]), worldState: ws, graph: { edges: [] }, tick: 10 });
    const attacker = peaceReasonsFor(r.worldState, 'a', 'b');
    const defender = peaceReasonsFor(r.worldState, 'b', 'a');
    expect(attacker.reasons.exhaustion.score).toBeCloseTo(0.3, 5);
    expect(defender.reasons.exhaustion.score).toBeCloseTo(0.7, 5);
  });

  it('mediation: a cross-pressured third (faith-tied to one side, kin-tied to the other) mints, NAMED', () => {
    const X = deity('custom:pc_dawn', 'good');
    const Y = deity('custom:pc_tide', 'good');
    const items = [item('a', { patron: X }), item('b', { patron: Y }), item('m', { patron: X })];
    const edges = [
      { id: 'e.m.a', from: 'm', to: 'a', relationshipType: 'trade_partner' },
      { id: 'e.m.b', from: 'm', to: 'b', relationshipType: 'trade_partner' },
    ];
    const ws = warWorld();
    const r = advancePeaceReasons({ snapshot: snapshotFor(items, edges), worldState: ws, graph: { edges }, tick: 10 });
    const entry = peaceReasonsFor(r.worldState, 'a', 'b');
    expect(entry.reasons.mediation, 'the torn broker stands').toBeTruthy();
    expect(entry.reasons.mediation.receipt).toMatch(/^M/); // named: Midwater-style capitalized name ('M' for m-item)
    // Negative control: the third shares the patron with BOTH (no cross-cut) ⇒ silent.
    const samePatronItems = [item('a', { patron: X }), item('b', { patron: X }), item('m', { patron: X })];
    const r2 = advancePeaceReasons({ snapshot: snapshotFor(samePatronItems, edges), worldState: warWorld(), graph: { edges }, tick: 10 });
    const entry2 = peaceReasonsFor(r2.worldState, 'a', 'b');
    expect(entry2?.reasons?.mediation, 'same-cleavage ties pick a side instead').toBeUndefined();
  });

  it('realignment: a common third attacker on both belligerents mints the strongest peace reason', () => {
    // c besieges a (deployment) AND holds a live war-layer front into b.
    const ws = warWorld({
      deployments: {
        a: { targetId: 'b', sinceTick: 1, role: 'siege' },
        c: { targetId: 'a', sinceTick: 2, role: 'siege' },
      },
    });
    const graph = {
      edges: [],
      channels: [{ type: 'war_front', from: 'c', to: 'b', status: 'confirmed' }],
    };
    const r = advancePeaceReasons({ snapshot: snapshotFor([item('a'), item('b'), item('c')]), worldState: ws, graph, tick: 10 });
    const entry = peaceReasonsFor(r.worldState, 'a', 'b');
    expect(entry.reasons.realignment).toBeTruthy();
    expect(entry.reasons.realignment.score).toBeCloseTo(PEACE_REASON_TUNING.REALIGNMENT_COMMON_THIRD, 5);
  });

  it('coalition fracture: evidence remembers the peak — an ally leaving mints on the NEXT fold', () => {
    // Tick 1: two besiegers of b (a + c) — no fracture, but the peak is banked.
    const ws1 = warWorld({
      deployments: {
        a: { targetId: 'b', sinceTick: 1, role: 'siege' },
        c: { targetId: 'b', sinceTick: 1, role: 'siege' },
      },
    });
    const snap = snapshotFor([item('a'), item('b'), item('c')]);
    const r1 = advancePeaceReasons({ snapshot: snap, worldState: ws1, graph: { edges: [] }, tick: 5 });
    expect(peaceReasonsFor(r1.worldState, 'a', 'b')?.reasons?.coalition_fracture).toBeUndefined();
    // Tick 2: c went home — the fold sees peak 1 (co-besieger count), now 0.
    const ws2 = { ...r1.worldState, deployments: { a: { targetId: 'b', sinceTick: 1, role: 'siege' } } };
    const r2 = advancePeaceReasons({ snapshot: snap, worldState: ws2, graph: { edges: [] }, tick: 6 });
    const frac = peaceReasonsFor(r2.worldState, 'a', 'b')?.reasons?.coalition_fracture;
    expect(frac, 'the peel is felt').toBeTruthy();
    expect(frac.evidence.peakAllies).toBe(1);
    expect(frac.evidence.nowAllies).toBe(0);
  });

  it('harvest: an autumn tick mints on every live war pair; a winter tick stays silent', () => {
    // elapsedWeeks 30 ⇒ autumn (weeks 24-35 of a 48-week year).
    const autumn = advancePeaceReasons({
      snapshot: snapshotFor([item('a'), item('b')]),
      worldState: warWorld({ calendar: { elapsedWeeks: 30 } }), graph: { edges: [] }, tick: 10,
    });
    expect(peaceReasonsFor(autumn.worldState, 'a', 'b').reasons.harvest_pressure).toBeTruthy();
    const winter = advancePeaceReasons({
      snapshot: snapshotFor([item('a'), item('b')]),
      worldState: warWorld({ calendar: { elapsedWeeks: 40 } }), graph: { edges: [] }, tick: 10,
    });
    expect(peaceReasonsFor(winter.worldState, 'a', 'b')?.reasons?.harvest_pressure).toBeUndefined();
  });
});

// ── THE IRONY READ-MODEL PIN (§14.4) ─────────────────────────────────────────

describe('warCausalBrief — the dramatic-irony read-model', () => {
  it('renders "N of M peace reasons now present; this war is dying" straight from the ledgers', () => {
    // Three peace reasons present: exhaustion + convergence (truth path) + harvest.
    const ws = warWorld({ warExhaustion: { a: 0.5 }, calendar: { elapsedWeeks: 30 } });
    const r = advancePeaceReasons({ snapshot: snapshotFor([item('a'), item('b')]), worldState: ws, graph: { edges: [] }, tick: 10 });
    const brief = warCausalBrief(r.worldState, 'a', 'b');
    expect(brief.peacePresent).toBeGreaterThanOrEqual(REASON_TUNING.IRONY_DYING_AT);
    expect(brief.line).toBe(`${brief.peacePresent} of ${PEACE_REASON_TYPES.length} peace reasons now present; this war is dying`);
    // 11 = the wave-1 seven + W-CONVERGENCE's foreign_clash↔spheres_understanding
    //   + D4's fear_of_dominance↔balance_restored + D7's two reframe casus.
    expect(brief.peace.length).toBe(11);
    expect(brief.war.length).toBe(11);
    // Present rows carry their receipts + birth ticks; absent rows read empty.
    const present = brief.peace.find((row) => row.type === 'exhaustion');
    expect(present.present).toBe(true);
    expect(present.receipt.length).toBeGreaterThan(0);
    expect(present.sinceTick).toBe(10);
  });

  it('renders the calm form below the dying threshold and "0 of 11" on a dark world', () => {
    const one = advancePeaceReasons({
      snapshot: snapshotFor([item('a'), item('b')]),
      worldState: warWorld({ simulationRules: { ...LIT_RULES, infoMode: 'full' }, calendar: { elapsedWeeks: 40 }, spatialCanonVersion: 1, spatialLedgers: { beliefMaps: {
        a: { [GOVERNING_SEAT_KEY]: { b: { readiness: 0.2, strengthBand: 0, allianceLabel: 'hostile', faithLabel: null, confidence01: 0.8, lastUpdateTick: 9 } } },
        b: { [GOVERNING_SEAT_KEY]: { a: { readiness: 0.2, strengthBand: 0, allianceLabel: 'hostile', faithLabel: null, confidence01: 0.8, lastUpdateTick: 9 } } },
      } } }),
      graph: { edges: [] }, tick: 10,
    });
    const brief = warCausalBrief(one.worldState, 'a', 'b');
    expect(brief.peacePresent).toBeLessThan(REASON_TUNING.IRONY_DYING_AT);
    expect(brief.line).not.toMatch(/dying/);
    const dark = warCausalBrief({ simulationRules: {} }, 'a', 'b');
    expect(dark.line).toBe('0 of 11 peace reasons now present');
    expect(dark.peacePresent).toBe(0);
    expect(dark.warPresent).toBe(0);
  });

  it('reasonPairKey directionality carries through the brief (each court has its own why)', () => {
    const ws = warWorld({ warExhaustion: { a: 0.6, b: 0 } });
    const r = advancePeaceReasons({ snapshot: snapshotFor([item('a'), item('b')]), worldState: ws, graph: { edges: [] }, tick: 10 });
    const aBrief = warCausalBrief(r.worldState, 'a', 'b');
    const bBrief = warCausalBrief(r.worldState, 'b', 'a');
    const aExhaustion = aBrief.peace.find((row) => row.type === 'exhaustion');
    const bExhaustion = bBrief.peace.find((row) => row.type === 'exhaustion');
    expect(aExhaustion.present).toBe(true);
    expect(bExhaustion.present).toBe(false);
    expect(reasonPairKey('a', 'b')).not.toBe(reasonPairKey('b', 'a'));
  });
});
