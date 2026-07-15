/**
 * convergence.test.js — W-CONVERGENCE Stage 1 pins (DESIGN_CONVERGENCE.md §6).
 *
 * The pure mechanics of foreign intervention in a live coup contest: the gate, the typed
 * motive catalog (positive + negative controls), the loaded-dice initiation, the coup
 * TILT (interventionAdj — directionality both bounded), the invited/uninvited legitimacy
 * asymmetry, the installed-regime obligation mint (leverage-weighted), and proxy-stays-
 * proxy foreign_clash detection. The dormancy byte-identity pin is the fenced golden
 * (interventionDormancyGolden.test.js); the interventionAdj=0⇒byte-identical-verdict pin
 * lives in rulingPowerCoup.intervention.test.js.
 */

import { describe, it, expect } from 'vitest';
import {
  interventionActive,
  scorePreserveOrder, scoreInstallFriendlier, scoreProtectInvestment, scoreKinship, scoreDenial,
  scoreMotives, MOTIVE_TYPES, INTERVENTION_SIDES,
  interventionFeasibility, initiationPull, shouldInitiateIntervention,
  interventionLegitimacy, interventionTilt, interventionObligationMint,
  foreignClashes, foreignClashIntensityOf,
  interventionLedger, recordsForTarget, interventionAdjFor,
  orderInterventionVerbFactory, CONVERGENCE_TUNING,
  deriveSides, engagementOptions, resolveSideBattle, reliefFlipsSiege,
  prizeRivalryCasus, overstayOccupation, canReEngage,
  INTERVENTION_STATES,
  reactiveResponse, REACTIVE_RELATIONS, contestSideLookup,
  reinforceVerbFactory, interceptVerbFactory,
  mercenaryReinforcement, mercenaryReinforcementOf,
} from '../../src/domain/worldPulse/convergence.js';
import { hostilePairFor } from '../../src/domain/worldPulse/armyTransitKernel.js';

const litRules = { simulationRules: { warLayerEnabled: true, interventionEnabled: true } };
const withLedger = (recs) => ({
  simulationRules: { warLayerEnabled: true, interventionEnabled: true },
  spatialLedgers: { interventions: recs },
});

describe('W-CONVERGENCE §6 — the gate (dormancy)', () => {
  it('is dark absent the flags, and needs BOTH warLayerEnabled and interventionEnabled', () => {
    expect(interventionActive(null)).toBe(false);
    expect(interventionActive({})).toBe(false);
    expect(interventionActive({ simulationRules: {} })).toBe(false);
    expect(interventionActive({ simulationRules: { warLayerEnabled: true } })).toBe(false);
    expect(interventionActive({ simulationRules: { interventionEnabled: true } })).toBe(false);
    expect(interventionActive(litRules)).toBe(true);
  });
});

describe('W-CONVERGENCE §2 — the typed motive catalog (positive + negative controls)', () => {
  it('preserve_order fires on grip OR treaty, backs the INCUMBENT; silent otherwise', () => {
    expect(scorePreserveOrder({ foreignGrip01: 0.5 }).score).toBeGreaterThan(0);
    expect(scorePreserveOrder({ treatyWithIncumbent: true }).score).toBeGreaterThan(0);
    // Below the grip threshold with no treaty ⇒ silent.
    expect(scorePreserveOrder({ foreignGrip01: 0.1 }).score).toBe(0);
    expect(scorePreserveOrder({}).score).toBe(0);
  });

  it('install_friendlier_regime fires on hostility+affinity OR a leash, backs the CHALLENGER', () => {
    expect(scoreInstallFriendlier({ hostile01: 1, challengerAffinity01: 0.6 }).score).toBeGreaterThan(0);
    expect(scoreInstallFriendlier({ leashOnChallenger01: 0.5 }).score).toBeGreaterThan(0);
    // No hostility and no leash ⇒ silent even with affinity.
    expect(scoreInstallFriendlier({ challengerAffinity01: 0.9 }).score).toBe(0);
    expect(scoreInstallFriendlier({}).score).toBe(0);
  });

  it('protect_investment fires on debt OR trade dependence, backs the INCUMBENT', () => {
    expect(scoreProtectInvestment({ obligationDebt01: 0.6 }).score).toBeGreaterThan(0);
    expect(scoreProtectInvestment({ tradeDependence01: 0.8 }).score).toBeGreaterThan(0);
    expect(scoreProtectInvestment({}).score).toBe(0);
  });

  it('kinship backs the stronger-tied side, and stays silent below the floor', () => {
    expect(scoreKinship({ kinshipChallenger01: 0.8, kinshipIncumbent01: 0.1 }).side).toBe(INTERVENTION_SIDES.CHALLENGER);
    expect(scoreKinship({ kinshipIncumbent01: 0.8, kinshipChallenger01: 0.1 }).side).toBe(INTERVENTION_SIDES.INCUMBENT);
    expect(scoreKinship({ kinshipIncumbent01: 0.05 }).score).toBe(0);
    expect(scoreKinship({}).side).toBe(null);
  });

  it('denial backs the OPPOSITE of a committed rival; silent with no rival', () => {
    expect(scoreDenial({ rivalSide: INTERVENTION_SIDES.INCUMBENT, rivalStrength01: 0.5 }).side).toBe(INTERVENTION_SIDES.CHALLENGER);
    expect(scoreDenial({ rivalSide: INTERVENTION_SIDES.CHALLENGER, rivalStrength01: 0.5 }).side).toBe(INTERVENTION_SIDES.INCUMBENT);
    expect(scoreDenial({ rivalSide: null, rivalStrength01: 0.5 }).score).toBe(0);
    expect(scoreDenial({ rivalSide: INTERVENTION_SIDES.INCUMBENT, rivalStrength01: 0 }).score).toBe(0);
  });

  it('scoreMotives picks the strongest motive with its side, and every motive is receipted', () => {
    // A strong leash (install_friendlier) beats a weak treaty (preserve_order).
    const chosen = scoreMotives({ leashOnChallenger01: 0.9, treatyWithIncumbent: true, hostile01: 1 });
    expect(chosen.motive).toBe('install_friendlier_regime');
    expect(chosen.side).toBe(INTERVENTION_SIDES.CHALLENGER);
    expect(chosen.receipt).toBeTruthy();
    // Every motive in the catalog appears in the breakdown.
    expect(chosen.breakdown.map((b) => b.motive).sort()).toEqual([...MOTIVE_TYPES].sort());
    // No motive at all ⇒ null.
    expect(scoreMotives({}).motive).toBe(null);
  });
});

describe('W-CONVERGENCE §H — feasibility + the loaded-dice initiation', () => {
  it('feasibility falls with opposition and stays bounded [0,1]', () => {
    const unopposed = interventionFeasibility({ patronStrength01: 0.9, opposingStrength01: 0 });
    const opposed = interventionFeasibility({ patronStrength01: 0.9, opposingStrength01: 1 });
    expect(unopposed).toBeGreaterThan(opposed);
    expect(opposed).toBeGreaterThanOrEqual(0);
    expect(unopposed).toBeLessThanOrEqual(1);
  });

  it('initiationPull = motive×feasibility, zeroed below the motive/feasibility floors', () => {
    expect(initiationPull({ motiveScore01: 0.8, feasibility01: 0.5 })).toBeCloseTo(0.4, 5);
    expect(initiationPull({ motiveScore01: 0.1, feasibility01: 1 })).toBe(0); // below MOTIVE_FLOOR
    expect(initiationPull({ motiveScore01: 0.9, feasibility01: 0.05 })).toBe(0); // below FEASIBILITY_FLOOR
  });

  it('the loaded dice fire iff u < INITIATE_BASE × pull² — a rare, ramped event', () => {
    const pull = 1;
    const threshold = CONVERGENCE_TUNING.INITIATE_BASE * pull * pull;
    expect(shouldInitiateIntervention(pull, threshold - 1e-6)).toBe(true);
    expect(shouldInitiateIntervention(pull, threshold + 1e-6)).toBe(false);
    // Ramped: half the pull ⇒ a quarter the chance (pull²).
    expect(shouldInitiateIntervention(0.5, CONVERGENCE_TUNING.INITIATE_BASE * 0.25 - 1e-6)).toBe(true);
    expect(shouldInitiateIntervention(0.5, CONVERGENCE_TUNING.INITIATE_BASE * 0.25 + 1e-6)).toBe(false);
  });
});

describe('W-CONVERGENCE §6 PIN — invited-vs-uninvited legitimacy asymmetry', () => {
  it('an invited incumbent-prop is legitimacy-cheap and not casus-generative', () => {
    const invited = interventionLegitimacy({ side: INTERVENTION_SIDES.INCUMBENT, invited: true });
    expect(invited.casusGenerative).toBe(false);
    expect(invited.legitimacyCost).toBe(CONVERGENCE_TUNING.LEGIT_COST_INVITED);
  });

  it('backing rebels (or an UNINVITED incumbent-prop) is dear and casus-generative', () => {
    const rebels = interventionLegitimacy({ side: INTERVENTION_SIDES.CHALLENGER, invited: false });
    expect(rebels.casusGenerative).toBe(true);
    expect(rebels.legitimacyCost).toBe(CONVERGENCE_TUNING.LEGIT_COST_UNINVITED);
    expect(rebels.legitimacyCost).toBeGreaterThan(interventionLegitimacy({ side: INTERVENTION_SIDES.INCUMBENT, invited: true }).legitimacyCost);
    // A challenger-backer can never be "invited" (the seat did not call them).
    const fakeInvited = interventionLegitimacy({ side: INTERVENTION_SIDES.CHALLENGER, invited: true });
    expect(fakeInvited.casusGenerative).toBe(true);
  });
});

describe('W-CONVERGENCE §6 PIN — coup-tilt directionality both bounded', () => {
  it('an incumbent-backer RAISES pHold; a challenger-backer LOWERS it; net zero cancels', () => {
    const raise = interventionTilt([{ side: INTERVENTION_SIDES.INCUMBENT, strengthShare01: 1 }]);
    const lower = interventionTilt([{ side: INTERVENTION_SIDES.CHALLENGER, strengthShare01: 1 }]);
    expect(raise).toBeGreaterThan(0);
    expect(lower).toBeLessThan(0);
    expect(raise).toBe(-lower);
    expect(interventionTilt([
      { side: INTERVENTION_SIDES.INCUMBENT, strengthShare01: 0.5 },
      { side: INTERVENTION_SIDES.CHALLENGER, strengthShare01: 0.5 },
    ])).toBe(0);
  });

  it('the term is bounded to ±PHOLD_WEIGHT no matter how many token columns pile on', () => {
    const swarm = Array.from({ length: 20 }, () => ({ side: INTERVENTION_SIDES.CHALLENGER, strengthShare01: 1 }));
    const tilt = interventionTilt(swarm);
    expect(tilt).toBe(-CONVERGENCE_TUNING.PHOLD_WEIGHT);
    expect(Math.abs(tilt)).toBeLessThanOrEqual(CONVERGENCE_TUNING.PHOLD_WEIGHT);
    expect(interventionTilt([])).toBe(0);
    expect(interventionTilt(null)).toBe(0);
  });
});

describe('W-CONVERGENCE §6 PIN — installed-regime-owes (leverage-weighted mint)', () => {
  it('mints an intervention obligation FROM the installed target TO the patron', () => {
    const mint = interventionObligationMint({ patronId: 'crown', targetId: 'ford', leverage01: 0 });
    expect(mint.from).toBe('ford');
    expect(mint.to).toBe('crown');
    expect(mint.kind).toBe('intervention');
    expect(mint.magnitude).toBeGreaterThan(0);
  });

  it('leverage inflates the recorded debt (the predatory patron) and flags it', () => {
    const plain = interventionObligationMint({ patronId: 'crown', targetId: 'ford', leverage01: 0 });
    const predatory = interventionObligationMint({ patronId: 'crown', targetId: 'ford', leverage01: 1 });
    expect(predatory.magnitude).toBeGreaterThan(plain.magnitude);
    expect(predatory.predatory).toBe(true);
    expect(plain.predatory).toBe(false);
  });
});

describe('W-CONVERGENCE §6 PIN — proxy-stays-proxy (foreign_clash, no auto-war)', () => {
  it('two sponsors on OPPOSING sides of one target clash; same-side sponsors do NOT', () => {
    const opposing = foreignClashes([
      { interId: 'crown', side: INTERVENTION_SIDES.INCUMBENT },
      { interId: 'delve', side: INTERVENTION_SIDES.CHALLENGER },
    ]);
    expect(opposing).toEqual([{ a: 'crown', b: 'delve' }]);
    // Same side ⇒ allies, never a clash.
    expect(foreignClashes([
      { interId: 'crown', side: INTERVENTION_SIDES.INCUMBENT },
      { interId: 'delve', side: INTERVENTION_SIDES.INCUMBENT },
    ])).toEqual([]);
    // foreignClashes returns DESCRIPTORS only — no war outcome, no mutation (proxy stays proxy).
  });

  it('foreignClashIntensityOf reads the live ledger; 0 when dormant', () => {
    const ws = withLedger({
      'crown:ford': { interId: 'crown', target: 'ford', side: INTERVENTION_SIDES.INCUMBENT, strength: 80 },
      'delve:ford': { interId: 'delve', target: 'ford', side: INTERVENTION_SIDES.CHALLENGER, strength: 60 },
    });
    expect(foreignClashIntensityOf(ws, 'crown', 'delve')).toBeGreaterThan(0);
    // Symmetric.
    expect(foreignClashIntensityOf(ws, 'delve', 'crown')).toBe(foreignClashIntensityOf(ws, 'crown', 'delve'));
    // Dark ⇒ 0 even with a ledger present.
    const dark = { simulationRules: {}, spatialLedgers: ws.spatialLedgers };
    expect(foreignClashIntensityOf(dark, 'crown', 'delve')).toBe(0);
  });
});

describe('W-CONVERGENCE — the ledger read + interventionAdjFor', () => {
  it('interventionLedger round-trips records; recordsForTarget filters by target', () => {
    const ws = withLedger({
      'crown:ford': { interId: 'crown', target: 'ford', side: INTERVENTION_SIDES.INCUMBENT, motive: 'preserve_order', strength: 80, sinceTick: 3, lastTick: 3 },
      'delve:mire': { interId: 'delve', target: 'mire', side: INTERVENTION_SIDES.CHALLENGER, motive: 'kinship', strength: 40, sinceTick: 2, lastTick: 2 },
    });
    const ledger = interventionLedger(ws);
    expect(Object.keys(ledger).sort()).toEqual(['crown:ford', 'delve:mire']);
    expect(recordsForTarget(ledger, 'ford').map((r) => r.interId)).toEqual(['crown']);
  });

  it('interventionAdjFor is 0 when dark (byte-identical) and signed by side when lit', () => {
    const recs = {
      'crown:ford': { interId: 'crown', target: 'ford', side: INTERVENTION_SIDES.INCUMBENT, strength: 100 },
    };
    // Dark ⇒ 0 (the resolveCoupVerdict term vanishes).
    expect(interventionAdjFor({ simulationRules: {}, spatialLedgers: { interventions: recs } }, 'ford')).toBe(0);
    // Lit, a lone incumbent-backer ⇒ +PHOLD_WEIGHT (full share).
    expect(interventionAdjFor(withLedger(recs), 'ford')).toBe(CONVERGENCE_TUNING.PHOLD_WEIGHT);
    // A target with no records ⇒ 0.
    expect(interventionAdjFor(withLedger(recs), 'elsewhere')).toBe(0);
  });
});

// ════════════════ Stage 2 — THE MULTI-SIDED LAW (§1) ════════════════

describe('W-CONVERGENCE §6 PIN — rivals-never-merge (aim-group sides)', () => {
  const hostilePair = (x, y) => [x, y].sort().join('|') === 'crown|delve';
  it('two mutually-hostile same-pole besiegers stay SEPARATE sides', () => {
    const sides = deriveSides([
      { interId: 'crown', side: INTERVENTION_SIDES.CHALLENGER, strength: 60 },
      { interId: 'delve', side: INTERVENTION_SIDES.CHALLENGER, strength: 60 },
    ], hostilePair);
    expect(sides.length).toBe(2);
    expect(sides.every((s) => s.members.length === 1)).toBe(true);
  });

  it('two ALLIED same-pole backers MERGE into one aggregated side', () => {
    const sides = deriveSides([
      { interId: 'crown', side: INTERVENTION_SIDES.CHALLENGER, strength: 60 },
      { interId: 'ashford', side: INTERVENTION_SIDES.CHALLENGER, strength: 40 },
    ], () => false);
    expect(sides.length).toBe(1);
    expect(sides[0].members.sort()).toEqual(['ashford', 'crown']);
    expect(sides[0].strength).toBe(100);
  });

  it('opposing poles are always distinct sides', () => {
    const sides = deriveSides([
      { interId: 'crown', side: INTERVENTION_SIDES.INCUMBENT, strength: 50 },
      { interId: 'delve', side: INTERVENTION_SIDES.CHALLENGER, strength: 50 },
    ], () => false);
    expect(sides.length).toBe(2);
    expect(sides.map((s) => s.pole).sort()).toEqual([INTERVENTION_SIDES.CHALLENGER, INTERVENTION_SIDES.INCUMBENT]);
  });
});

describe('W-CONVERGENCE §6 PIN — THE VULTURE (hold-EV beats engage-EV while rivals grind)', () => {
  it('a strong THIRD side with two grinding rivals chooses HOLD, and it is receipted', () => {
    const strong = engagementOptions({ myStrength: 100, rivalStrengths: [60, 60], exhaustion01: 0, patience01: 1 });
    expect(strong.move).toBe('hold');
    expect(strong.byMove.hold).toBeGreaterThan(strong.byMove.engage);
    expect(strong.receipt).toMatch(/bleed|held/i);
  });

  it('with a SINGLE rival (no grinding to exploit) the vulture stands down and engages', () => {
    const lone = engagementOptions({ myStrength: 100, rivalStrengths: [60], exhaustion01: 0, patience01: 1 });
    expect(lone.byMove.hold).toBe(0); // no ≥2-rival grind to feast on
    expect(lone.move).toBe('engage');
  });

  it('an exhausted, impatient side withdraws (cuts its losses)', () => {
    const spent = engagementOptions({ myStrength: 40, rivalStrengths: [90], exhaustion01: 1, patience01: 0 });
    expect(spent.move).toBe('withdraw');
  });
});

describe('W-CONVERGENCE §6 PIN — counterforce resolves first + loser retreats', () => {
  it('resolveSideBattle resolves through the field-battle machinery; the loser routes home recalled', () => {
    const r = resolveSideBattle({ aId: 'crown', aStrength: 100, bId: 'delve', bStrength: 25, rng: null, tick: 5 });
    // 100 vs 25 is past the CLAMP_RATIO edge ⇒ deterministic: crown wins.
    expect(r.winnerId).toBe('crown');
    expect(r.loserId).toBe('delve');
    expect(r.loserRetreats).toBe(true);
    expect(r.recalled).toEqual({ cause: 'field_battle_retreat', tick: 5 });
    // Conserved: the loser is mauled, never annihilated (a floor survives to route home).
    expect(r.strengthDelta.delve).toBeGreaterThan(0);
    expect(r.strengthDelta.delve).toBeLessThan(25);
  });
});

describe('W-CONVERGENCE §6 PIN — relief-lifts-siege', () => {
  it('a reinforced defense flips a marginal siege the bare defense would have lost', () => {
    // Besieger edges the bare defender, but the relief column tips it back.
    const flip = reliefFlipsSiege({ besiegerStrength: 62, defenderStrength: 50, reliefStrength: 40 });
    expect(flip.tookWithoutRelief).toBe(true);
    expect(flip.tookWithRelief).toBe(false);
    expect(flip.lifted).toBe(true);
  });
});

describe('W-CONVERGENCE §6 PIN — prize-rivalry casus (between conquerors, no auto-war)', () => {
  it('two conquerors racing for one prize mint a typed rivalry descriptor', () => {
    const casus = prizeRivalryCasus('delve', 'crown', 0.7);
    expect(casus).toEqual({ a: 'crown', b: 'delve', reason: expect.any(String), intensity: 0.7 });
    expect(prizeRivalryCasus('crown', 'crown')).toBe(null);
  });
});

describe('W-CONVERGENCE §6 PIN — occupation-on-overstay', () => {
  it('a prevailed column lingering past OVERSTAY_TICKS yields a conquest-shaped occupation outcome', () => {
    const early = overstayOccupation({ interId: 'crown', target: 'ford', resolvedTick: 10, nowTick: 12, prevailed: true });
    expect(early.occupies).toBe(false);
    const over = overstayOccupation({ interId: 'crown', target: 'ford', resolvedTick: 10, nowTick: 10 + CONVERGENCE_TUNING.OVERSTAY_TICKS, prevailed: true });
    expect(over.occupies).toBe(true);
    // freshConquestsFrom keys on type/powerTransfer.cause + condition.causes[0].source (occupier).
    expect(over.outcome.type).toBe('power_transfer');
    expect(over.outcome.targetSaveId).toBe('ford');
    expect(over.outcome.condition.causes[0].source).toBe('crown');
    // A losing column never occupies.
    expect(overstayOccupation({ interId: 'crown', target: 'ford', resolvedTick: 10, nowTick: 30, prevailed: false }).occupies).toBe(false);
  });
});

describe('W-CONVERGENCE §6 PIN — aftermath dwell (attrited sides regroup before re-engaging)', () => {
  it('an attrited side cannot re-engage until the dwell window elapses; others always can', () => {
    const fresh = { state: INTERVENTION_STATES.BESIEGING, lastTick: 5 };
    expect(canReEngage(fresh, 6)).toBe(true);
    const bloodied = { state: INTERVENTION_STATES.ATTRITED, lastTick: 5 };
    expect(canReEngage(bloodied, 5 + CONVERGENCE_TUNING.ATTRITED_DWELL_TICKS - 1)).toBe(false);
    expect(canReEngage(bloodied, 5 + CONVERGENCE_TUNING.ATTRITED_DWELL_TICKS)).toBe(true);
  });
});

// ════════════════ Stage 3 — THE REACTIVE ART OF WAR (§3) ════════════════

describe('W-CONVERGENCE §6 PIN — phantom-column reactivity (a FALSE belief is priced)', () => {
  it('a believed-but-FALSE enemy column still triggers a real, priced INTERCEPT muster', () => {
    const phantom = reactiveResponse({
      believed: { present: true, real: false, strength01: 0.5 },
      relation: REACTIVE_RELATIONS.ENEMY_COLUMN, myStrength01: 0.7,
    });
    expect(phantom.move).toBe('intercept');
    expect(phantom.priced).toBe(true);             // the reaction commits real force
    expect(phantom.believedReal).toBe(false);       // ...to a column that isn't there
    expect(phantom.receipt).toMatch(/rumor/i);
  });

  it('no believed column ⇒ the muster stands down (no priced reaction)', () => {
    const quiet = reactiveResponse({ believed: { present: false }, relation: REACTIVE_RELATIONS.ENEMY_COLUMN });
    expect(quiet.move).toBe('stand');
    expect(quiet.priced).toBe(false);
  });
});

describe('W-CONVERGENCE §3 — the three reactive moves (REINFORCE / INTERCEPT / COUNTER-INTERVENE)', () => {
  it('an ally under siege ⇒ REINFORCE (the relief column, kinetic teeth for the treaty)', () => {
    const r = reactiveResponse({ believed: { present: true, strength01: 0.6 }, relation: REACTIVE_RELATIONS.ALLY_UNDER_SIEGE, myStrength01: 0.8 });
    expect(r.move).toBe('reinforce');
    expect(r.ev).toBeGreaterThan(0);
  });
  it('a believed rival intervener ⇒ COUNTER-INTERVENE (the denial motive made reactive)', () => {
    const r = reactiveResponse({ believed: { present: true, strength01: 0.6 }, relation: REACTIVE_RELATIONS.ENEMY_INTERVENER });
    expect(r.move).toBe('counter_intervene');
  });
});

describe('W-CONVERGENCE §3/§4 — the INTERCEPT hostilePair extension (byte-identical seam)', () => {
  it('the transit predicate is UNCHANGED without the contestSideOf lookup (byte-identity)', () => {
    // Two columns NOT marching against each other's home and with no contest data ⇒ not hostile.
    const records = {
      x: { armyId: 'x', role: 'march', originId: 'x', destId: 'z' },
      y: { armyId: 'y', role: 'march', originId: 'y', destId: 'z' },
    };
    const bare = hostilePairFor(records);
    expect(bare('x', 'y')).toBe(false); // co-marchers on the same target are allies (unchanged)
  });

  it('WITH the contestSideOf lookup, opposing sides of the SAME contest become hostile', () => {
    const records = {
      x: { armyId: 'x', role: 'march', originId: 'x', destId: 'z' },
      y: { armyId: 'y', role: 'march', originId: 'y', destId: 'z' },
    };
    const ledger = {
      'x:ford': { interId: 'x', target: 'ford', side: INTERVENTION_SIDES.INCUMBENT, strength: 50 },
      'y:ford': { interId: 'y', target: 'ford', side: INTERVENTION_SIDES.CHALLENGER, strength: 50 },
    };
    const withContest = hostilePairFor(records, contestSideLookup(ledger));
    expect(withContest('x', 'y')).toBe(true);   // opposing sides of ford's contest → intercept
    // Same side of the same contest stays allied.
    const alliedLedger = {
      'x:ford': { interId: 'x', target: 'ford', side: INTERVENTION_SIDES.INCUMBENT, strength: 50 },
      'y:ford': { interId: 'y', target: 'ford', side: INTERVENTION_SIDES.INCUMBENT, strength: 50 },
    };
    expect(hostilePairFor(records, contestSideLookup(alliedLedger))('x', 'y')).toBe(false);
  });
});

// ════════════════ THE MERCENARY CLAUSE (owner ruling, §4) ════════════════

describe('W-CONVERGENCE §4 — THE MERCENARY CLAUSE (a bounded reinforcement modifier only)', () => {
  const snapWith = (institutions, econ = 100) => ({
    byId: { get: (id) => (id === 'thornwall'
      ? { name: 'Thornwall', settlement: { name: 'Thornwall', institutions }, causal: { scores: { economic_capacity: econ } } }
      : undefined) },
  });

  it('absent ⇒ factor 0 (prior strength byte-identical: strength × (1+0) = strength)', () => {
    expect(mercenaryReinforcement({ count: 0, prosperity01: 1 })).toBe(0);
    expect(mercenaryReinforcementOf(snapWith([]), 'thornwall').factor).toBe(0);
    // A settlement with only NON-mercenary institutions ⇒ still 0.
    expect(mercenaryReinforcementOf(snapWith([{ name: 'Grand Temple' }, { name: 'Merchant Guild' }]), 'thornwall').factor).toBe(0);
  });

  it('the CAP binds (a bounded modifier, never a snowballing multiplier)', () => {
    const many = mercenaryReinforcement({ count: 20, prosperity01: 1 });
    expect(many).toBe(CONVERGENCE_TUNING.MERC_REINFORCE_CAP);
    // A wealthy town with several halls is still capped.
    const rich = mercenaryReinforcementOf(snapWith([
      { name: 'Free Company Hall' }, { name: 'Sellsword Quarter' }, { name: 'Mercenary Lodge' },
    ], 100), 'thornwall');
    expect(rich.factor).toBeLessThanOrEqual(CONVERGENCE_TUNING.MERC_REINFORCE_CAP);
  });

  it('a DECLARED-facet custom institution counts (the facet law — name need not match)', () => {
    // "The Iron Charter" matches no name pattern, but declares the mercenary facet.
    const custom = mercenaryReinforcementOf(snapWith([
      { name: 'The Iron Charter', facets: { institutionFunction: 'mercenary' } },
    ], 80), 'thornwall');
    expect(custom.count).toBe(1);
    expect(custom.factor).toBeGreaterThan(0);
  });

  it('affordability-scaled: a poor town reinforces LESS than a wealthy one', () => {
    const poor = mercenaryReinforcement({ count: 1, prosperity01: 0.2 });
    const wealthy = mercenaryReinforcement({ count: 1, prosperity01: 1 });
    expect(poor).toBeLessThan(wealthy);
    expect(poor).toBeGreaterThan(0);
  });

  it('the read names the deploying settlement (for the house-voice receipt)', () => {
    const r = mercenaryReinforcementOf(snapWith([{ name: 'Free Company Hall' }]), 'thornwall');
    expect(r.settlementName).toBe('Thornwall');
    expect(r.factor).toBeGreaterThan(0);
  });
});

describe('W-CONVERGENCE §7 — the verbs are REGISTERED (the W-COMPOSER-2 lift landed)', () => {
  it('ORDER_INTERVENTION / REINFORCE / INTERCEPT carry realm scope + candidateType, registered:true', async () => {
    for (const v of [orderInterventionVerbFactory(), reinforceVerbFactory(), interceptVerbFactory()]) {
      expect(v.scope).toBe('realm');
      expect(v.registered).toBe(true);
      expect(typeof v.candidateType).toBe('string');
    }
    // The lift is real: each verb has a realm-manifest entry carrying its candidateType.
    const { realmVerbFor } = await import('../../src/domain/events/realmManifest.js');
    expect(realmVerbFor('ORDER_INTERVENTION')?.candidateType).toBe(orderInterventionVerbFactory().candidateType);
    expect(realmVerbFor('REINFORCE')?.candidateType).toBe(reinforceVerbFactory().candidateType);
    expect(realmVerbFor('INTERCEPT')?.candidateType).toBe(interceptVerbFactory().candidateType);
  });
});
