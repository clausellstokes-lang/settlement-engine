/**
 * warReasonsPredationFaith.test.js — the two motive-gap closures and their mirrors.
 *
 *   opportunism  ↔ hopelessness   (§14.1 OPPORTUNISM / §14.3's own named pairing)
 *   sacred_claim ↔ common_rite    (§14.1 IDEOLOGY/FAITH, §14.2 MORAL/FAITH)
 *
 * Every reason here carries a POSITIVE control (the state that should mint it does), a
 * NEGATIVE control (the OPPOSITE fixture reads exactly zero), and a DARK control (its own
 * substrate absent ⇒ byte-identical). The headline pin is the epistemic one: a court
 * covets a neighbour it WRONGLY believes weak, and the receipt says so out loud.
 *
 * The file closes with THE DIVERSITY WALKER the taxonomy review asked for — every reason
 * in both catalogs must have a witness proving it CAN fire, so a reason that can never
 * win reds here instead of quietly becoming decoration.
 */

import { describe, it, expect } from 'vitest';

import {
  WAR_REASON_TYPES, PEACE_REASON_TYPES, REASON_MIRRORS, REASON_TUNING,
  advanceWarReasons, warReasonsFor,
  scoreGrievance, scoreRevanchism, scoreResourcePressure, scoreTreatyDefault,
  scoreEncirclement, scoreLegitimacyHunger, scoreCorruptionExposed, scoreForeignClash,
  scoreIngratitudeDebt, scoreDependencyByDesign,
} from '../../src/domain/worldPulse/warReasons.js';
import {
  advancePeaceReasons, peaceReasonsFor,
  scoreExhaustion, scoreBeliefConvergence, scoreEconomicStrangulation,
  scoreCoalitionFracture, scoreMediation, scoreHarvestPressure, scoreRealignment,
  scoreSpheresUnderstanding, scoreDebtForgiven, scoreBondsOfCommerce,
} from '../../src/domain/worldPulse/peaceReasons.js';
import {
  scoreOpportunism, scoreHopelessness, vulnerabilityTruthOf, perceivedVulnerabilityOf,
  liveStrengthContradictsOpportunism,
} from '../../src/domain/worldPulse/opportunism.js';
import {
  scoreSacredClaim, scoreCommonRite, faithStandingBetween,
} from '../../src/domain/worldPulse/sacredClaim.js';
import { scoreFearOfDominance, scoreBalanceRestored } from '../../src/domain/worldPulse/hegemonyFear.js';
import {
  buildPatronCounterforceIndex, patronCounterforceFor,
} from '../../src/domain/worldPulse/patronCounterforce.js';
import { isWarReasonType } from '../../src/domain/worldPulse/warReasonTaxonomy.js';

// ── Fixture kit ──────────────────────────────────────────────────────────────

const LIT = { warLayerEnabled: true, peaceEngineEnabled: true };
// isFaithSpreadEnabled reads the LEGACY key first when it is an explicit boolean, so a
// faith-lit world must set BOTH (the simulationRules lockstep the presets also observe).
const FAITH_LIT = { ...LIT, faithSpreadEnabled: true, religionDynamicsEnabled: true };
// infoModeOf defaults to 'omniscient', which is a beliefsActive OFF switch — a fogged
// world must say so explicitly, or every belief read falls back to truth verbatim.
const FOG = { ...LIT, infoMode: 'full' };
const FAITH_FOG = { ...FAITH_LIT, infoMode: 'full' };
const WR1_LIT = { ...LIT, warTerminationEnabled: true };
const WR1_FOG = { ...FOG, warTerminationEnabled: true };

/** A snapshot member with exactly the substrates a case needs, and no others. */
function town(id, opts = {}) {
  const { tier = 'town', population = 1500, readiness, legitimacy, patron, patronSecurity } = opts;
  /** @type {Record<string, unknown>} */
  const config = {};
  if (patron) config.primaryDeitySnapshot = { _deityRef: patron.ref, alignmentAxis: patron.align };
  /** @type {Record<string, unknown>} */
  const faithProfile = {};
  if (readiness != null) faithProfile.martial = { readiness01: readiness, experience01: 1, footing: 0, causes: [] };
  if (patronSecurity != null) faithProfile.patronSecurity = patronSecurity;
  if (Object.keys(faithProfile).length) config.faithProfile = faithProfile;
  return {
    id,
    name: id,
    settlement: { name: id, tier, population, config },
    ...(legitimacy != null ? { causal: { scores: { public_legitimacy: legitimacy } } } : {}),
  };
}

const EDGES = [{ id: 'edge.wolf.lamb', from: 'wolf', to: 'lamb', relationshipType: 'trade_partner' }];

function snapshotOf(items) {
  return { byId: new Map(items.map((i) => [i.id, i])), settlements: items, regionalGraph: { edges: EDGES } };
}

/** Drive the war mover over one edge with the given rules + members. */
function driveWar(items, rules = LIT, extra = {}, edges = EDGES) {
  const ws = {
    simulationRules: { ...rules },
    relationshipStates: { 'edge.wolf.lamb': { relationshipType: 'trade_partner', resentment: 0, trust: 0.5 } },
    ...extra,
  };
  const snapshot = snapshotOf(items);
  snapshot.regionalGraph = { edges };
  return advanceWarReasons({ snapshot, worldState: ws, graph: { edges }, tick: 20 });
}

/** Drive the peace mover over one live war (wolf marching on lamb). */
function drivePeace(items, rules = LIT, extra = {}) {
  const ws = {
    simulationRules: { ...rules },
    deployments: { wolf: { targetId: 'lamb' } },
    ...extra,
  };
  return advancePeaceReasons({ snapshot: snapshotOf(items), worldState: ws, graph: { edges: EDGES }, tick: 20 });
}

/** Belief records making each subject look however we please to its observer.
 *  @param {Array<[string, string, number, number]>} rows [observer, subject, strengthBand, readiness] */
function beliefWorldExtra(rows) {
  /** @type {Record<string, { seat: Record<string, unknown> }>} */
  const beliefMaps = {};
  for (const [observer, subject, strengthBand, readiness] of rows) {
    beliefMaps[observer] = beliefMaps[observer] || { seat: {} };
    beliefMaps[observer].seat[subject] = {
      readiness, strengthBand, allianceLabel: 'neutral', faithLabel: null,
      confidence01: 0.8, lastUpdateTick: 19,
    };
  }
  return { spatialCanonVersion: 1, spatialLedgers: { beliefMaps } };
}

// A fat, peaceful, poorly-defended neighbour, and the strong court beside it.
const WOLF = town('wolf', { tier: 'city', population: 9000, readiness: 0.85, legitimacy: 75 });
const LAMB = town('lamb', { tier: 'hamlet', population: 300, readiness: 0.05, legitimacy: 20 });

// ── GAP 1: OPPORTUNISM — appetite for the weak ───────────────────────────────

describe('opportunism — the vulture war (the appetite the taxonomy was missing)', () => {
  it('POSITIVE: a fat, peaceful, poorly-defended neighbour now generates a typed, receipted motive', () => {
    const entry = warReasonsFor(driveWar([WOLF, LAMB]).worldState, 'wolf', 'lamb');
    expect(entry, 'the strong court holds a case against the weak neighbour').toBeTruthy();
    expect(entry.reasons.opportunism, 'harmlessness is no longer free').toBeTruthy();
    expect(entry.reasons.opportunism.score).toBeGreaterThan(REASON_TUNING.MIN_SCORE);
    expect(entry.reasons.opportunism.receipt).toMatch(/weaker/i);
  });

  it('NEGATIVE: the OPPOSITE direction reads exactly zero (the lamb covets nothing)', () => {
    const entry = warReasonsFor(driveWar([WOLF, LAMB]).worldState, 'lamb', 'wolf');
    expect(entry?.reasons?.opportunism, 'the weak hold no appetite for the strong').toBeUndefined();
  });

  it('NEGATIVE: two evenly matched towns mint no appetite in either direction', () => {
    const a = town('wolf', { tier: 'town', population: 1500, readiness: 0.5, legitimacy: 50 });
    const b = town('lamb', { tier: 'town', population: 1500, readiness: 0.5, legitimacy: 50 });
    const ws = driveWar([a, b]).worldState;
    expect(warReasonsFor(ws, 'wolf', 'lamb')?.reasons?.opportunism).toBeUndefined();
    expect(warReasonsFor(ws, 'lamb', 'wolf')?.reasons?.opportunism).toBeUndefined();
  });

  it('DARK SUBSTRATE: a pair that publishes no vulnerability reading at all stays byte-identical', () => {
    // Neither member is in the snapshot, so nothing is published about either side.
    const lit = driveWar([]);
    expect(lit.worldState.spatialLedgers?.warReasons, 'no substrate ⇒ no ledger key').toBeUndefined();
    expect(lit.changed).toBe(false);
  });

  it('the score is bounded 0..1 and the OWN-SIDE CAPABILITY damper is P4\'s, not a new one', () => {
    expect(scoreOpportunism({ gradient: 5 }).score).toBe(1);
    expect(scoreOpportunism({ gradient: -5 }).score).toBe(0);
    // Absent or null capability ⇒ 1 ⇒ the pre-P4 reading, full receipt included.
    const omitted = scoreOpportunism({ gradient: 0.8 }, 'pair');
    expect(omitted.score).toBeGreaterThan(0);
    expect(scoreOpportunism({ gradient: 0.8, capability01: undefined }, 'pair')).toEqual(omitted);
    expect(scoreOpportunism({ gradient: 0.8, capability01: 1 }, 'pair')).toEqual(omitted);
    expect(scoreOpportunism({ gradient: 0.8, capability01: null }, 'pair')).toEqual(omitted);
    // Do not default by truthiness: a real zero must still disable action.
    expect(scoreOpportunism({ gradient: 0.8, capability01: 0 }, 'pair'))
      .toEqual({ score: 0, receipt: '' });
    // A realm that cannot feed a march wants the same and can do less about it.
    expect(scoreOpportunism({ gradient: 0.8, capability01: 0.25 }).score)
      .toBeLessThan(scoreOpportunism({ gradient: 0.8, capability01: 1 }).score);
  });

  it('WR-1 PATRON COUNTERFORCE WINS: protection suppresses a case that otherwise opens', () => {
    const patronEdge = {
      id: 'edge.guardian.lamb', from: 'guardian', to: 'lamb', relationshipType: 'patron',
    };
    const edges = [...EDGES, patronEdge];
    const items = [WOLF, LAMB, town('guardian', { tier: 'city', population: 8000, readiness: 0.8 })];

    const unprotected = warReasonsFor(driveWar(items, WR1_LIT).worldState, 'wolf', 'lamb');
    expect(unprotected?.reasons?.opportunism, 'anti-vacuity: this exact predation opens without protection')
      .toBeTruthy();

    const protectedWorld = driveWar(items, WR1_LIT, {
      relationshipStates: {
        'edge.wolf.lamb': { relationshipType: 'trade_partner', resentment: 0, trust: 0.5 },
        'edge.guardian.lamb': { relationshipType: 'patron', patronSaveId: 'guardian' },
      },
    }, edges).worldState;
    expect(warReasonsFor(protectedWorld, 'wolf', 'lamb')?.reasons?.opportunism,
      'the patron is a winning counterforce, not a decorative discount').toBeUndefined();

    const suppressed = scoreOpportunism({
      gradient: 0.8,
      patronCounterforce: { patronId: 'guardian', patronIds: ['guardian'] },
    });
    expect(suppressed.score).toBe(0);
    expect(suppressed.receipt).toMatch(/patron.*stays its hand/i);
    // anchored: the positive semantic receipt assertion above proves prose is present
    expect(suppressed.receipt).not.toMatch(/\d/);
  });

  it('the patron read is directional, legacy-aware, multi-patron deterministic, and dark when WR-1 is dark', () => {
    const edges = [
      { id: 'z', from: 'zeta', to: 'lamb', relationshipType: 'patron' },
      // Legacy client orientation is junior -> senior; normalization reverses it.
      { id: 'a', from: 'lamb', to: 'alpha', relationshipType: 'client' },
      // State direction wins over authored orientation for a born-in-simulation tie.
      { id: 'm', from: 'lamb', to: 'mu', relationshipType: 'neutral' },
    ];
    const ws = {
      relationshipStates: {
        z: { relationshipType: 'patron' },
        a: { relationshipType: 'client' },
        m: { relationshipType: 'patron', patronSaveId: 'mu', clientSaveId: 'lamb' },
      },
    };
    const forward = buildPatronCounterforceIndex({ edges }, ws);
    const reversed = buildPatronCounterforceIndex({ edges: [...edges].reverse() }, ws);
    expect([...forward.entries()]).toEqual([...reversed.entries()]);
    expect(patronCounterforceFor(forward, 'lamb')).toEqual({
      patronId: 'alpha', patronIds: ['alpha', 'mu', 'zeta'],
    });
    expect(patronCounterforceFor(forward, 'alpha')).toBeNull();

    const protectedEdges = [...EDGES, edges[0]];
    const dark = driveWar([WOLF, LAMB], LIT, {
      relationshipStates: {
        'edge.wolf.lamb': { relationshipType: 'trade_partner', resentment: 0, trust: 0.5 },
        z: { relationshipType: 'patron' },
      },
    }, protectedEdges).worldState;
    expect(warReasonsFor(dark, 'wolf', 'lamb')?.reasons?.opportunism,
      'the absent WR-1 flag preserves the pre-counterforce result').toBeTruthy();
  });
});

describe('PREDATION IS EPISTEMIC — the headline property', () => {
  // A genuinely strong, stable town. On the ground there is nothing to covet.
  const STRONG = town('lamb', { tier: 'city', population: 9000, readiness: 0.9, legitimacy: 80 });
  const RIVAL = town('wolf', { tier: 'city', population: 9000, readiness: 0.9, legitimacy: 80 });

  it('the ground truth offers NO appetite between two strong equals', () => {
    expect(warReasonsFor(driveWar([RIVAL, STRONG]).worldState, 'wolf', 'lamb')?.reasons?.opportunism)
      .toBeUndefined();
  });

  it('a court that WRONGLY believes the neighbour weak covets it anyway, and the receipt says so', () => {
    const fogged = driveWar([RIVAL, STRONG], FOG, beliefWorldExtra([['wolf', 'lamb', 0, 0.05]]));
    const rec = warReasonsFor(fogged.worldState, 'wolf', 'lamb')?.reasons?.opportunism;
    expect(rec, 'the belief, not the ground, produced the motive').toBeTruthy();
    expect(rec.score).toBeGreaterThan(REASON_TUNING.MIN_SCORE);
    expect(rec.receipt, 'the §14.4 bar: the receipt names the error in the house voice')
      .toMatch(/the court is wrong about it/);
    expect(rec.receipt).toMatch(/thinly held/);
  });

  it('WR-1 LIVE RESTRAINT WINS when fog reverses the live strength sign', () => {
    const extra = beliefWorldExtra([['wolf', 'lamb', 0, 0.05]]);
    const prior = warReasonsFor(driveWar([RIVAL, STRONG], FOG, extra).worldState, 'wolf', 'lamb');
    expect(prior?.reasons?.opportunism,
      'anti-vacuity: the same fogged picture opens the pre-WR-1 case').toBeTruthy();

    const restrained = warReasonsFor(
      driveWar([RIVAL, STRONG], WR1_FOG, extra).worldState, 'wolf', 'lamb',
    );
    expect(restrained?.reasons?.opportunism,
      'equal live hosts contradict the weak-victim story').toBeUndefined();
    expect(liveStrengthContradictsOpportunism(RIVAL, STRONG)).toBe(true);

    const receipt = scoreOpportunism({ gradient: 0.7, liveStrengthContradicted: true });
    expect(receipt.score).toBe(0);
    expect(receipt.receipt).toMatch(/live muster.*stays its hand/i);
    // anchored: the positive semantic receipt assertion above proves prose is present
    expect(receipt.receipt).not.toMatch(/\d/);
  });

  it('WR-1 restraint preserves a live advantage: fog may colour degree without reversing sign', () => {
    expect(liveStrengthContradictsOpportunism(WOLF, LAMB)).toBe(false);
    const rec = warReasonsFor(driveWar([WOLF, LAMB], WR1_LIT).worldState, 'wolf', 'lamb')
      ?.reasons?.opportunism;
    expect(rec, 'the coherence arm does not silence a true weak-victim gradient').toBeTruthy();
  });

  it('the SAME fogged world with beliefs dormant falls back to truth verbatim (no appetite)', () => {
    // Identical belief ledger, but no spatialCanonVersion ⇒ beliefsActive false.
    const extra = beliefWorldExtra([['wolf', 'lamb', 0, 0.05]]);
    delete extra.spatialCanonVersion;
    expect(warReasonsFor(driveWar([RIVAL, STRONG], FOG, extra).worldState, 'wolf', 'lamb')?.reasons?.opportunism)
      .toBeUndefined();
    // And the same ledger under an OMNISCIENT world is equally silent.
    expect(warReasonsFor(
      driveWar([RIVAL, STRONG], LIT, beliefWorldExtra([['wolf', 'lamb', 0, 0.05]])).worldState,
      'wolf', 'lamb',
    )?.reasons?.opportunism).toBeUndefined();
  });

  it('the SELF CARVE-OUT, the OMNISCIENT fallback and ABSENCE-AS-INFORMATION all arrive for free', () => {
    const ws = { ...beliefWorldExtra([['wolf', 'lamb', 0, 0.05]]), simulationRules: { ...FOG } };
    // Self: truth, never a belief record.
    expect(perceivedVulnerabilityOf({ observerId: 'wolf', subjectId: 'wolf', worldState: ws, item: RIVAL }).source)
      .toBe('truth');
    // Omniscient: truth.
    expect(perceivedVulnerabilityOf({
      observerId: 'wolf', subjectId: 'lamb', item: STRONG,
      worldState: { ...ws, simulationRules: { ...FOG, infoMode: 'omniscient' } },
    }).source).toBe('truth');
    // Marked world, NO record for this pair ⇒ the court knows it is guessing.
    expect(perceivedVulnerabilityOf({ observerId: 'wolf', subjectId: 'stranger', worldState: ws, item: STRONG }).source)
      .toBe('unknown');
    // And the believed read genuinely diverges from the truth it is carried beside.
    const seen = perceivedVulnerabilityOf({ observerId: 'wolf', subjectId: 'lamb', worldState: ws, item: STRONG });
    expect(seen.source).toBe('belief');
    expect(seen.mistaken).toBe(true);
    expect(seen.value01).toBeGreaterThan(seen.truth01);
  });

  it('ABSENCE OF A READING IS NOT A READING OF WEAKNESS (the inversion that would feed a frenzy)', () => {
    // A member the snapshot does not carry at all yields no reading whatsoever.
    expect(vulnerabilityTruthOf(null).value01).toBe(0);
    expect(vulnerabilityTruthOf(null).terms).toBe(0);
    // A town that publishes NO martial record must not read as an undrilled one.
    // `readinessOf` returns 0 for "absent" and for "utterly unready" alike, so this is
    // the structural-presence guard doing its job: the silent town contributes no
    // readiness term at all, and reads STRICTLY LESS vulnerable than the open gate.
    const silent = town('silent', { tier: 'town', population: 1500 });
    const undrilled = town('undrilled', { tier: 'town', population: 1500, readiness: 0 });
    expect(vulnerabilityTruthOf(silent).terms).toBe(1);
    expect(vulnerabilityTruthOf(undrilled).terms).toBe(2);
    expect(vulnerabilityTruthOf(silent).value01)
      .toBeLessThan(vulnerabilityTruthOf(undrilled).value01);
    // The same for a missing legitimacy score against a collapsing seat.
    const shaky = town('shaky', { tier: 'town', population: 1500, legitimacy: 0 });
    expect(vulnerabilityTruthOf(silent).value01).toBeLessThan(vulnerabilityTruthOf(shaky).value01);
  });

  it('a pair NEITHER of whose members the snapshot carries reads a flat zero', () => {
    const lit = driveWar([]);
    expect(lit.worldState.spatialLedgers?.warReasons).toBeUndefined();
    expect(lit.changed).toBe(false);
  });
});

// ── The mirror: hopelessness ─────────────────────────────────────────────────

describe('hopelessness — the SAME gradient read from the losing end (a mirror, not a stub)', () => {
  it('POSITIVE: the weaker belligerent accumulates a typed reason to stop', () => {
    const rec = peaceReasonsFor(drivePeace([WOLF, LAMB]).worldState, 'lamb', 'wolf')?.reasons?.hopelessness;
    expect(rec, 'the outmatched party can see it').toBeTruthy();
    expect(rec.score).toBeGreaterThan(REASON_TUNING.MIN_SCORE);
    expect(rec.receipt).toMatch(/bear this longer|outlast/i);
  });

  it('NEGATIVE: the STRONGER belligerent holds no hopelessness (it holds the appetite instead)', () => {
    const ws = drivePeace([WOLF, LAMB]).worldState;
    expect(peaceReasonsFor(ws, 'wolf', 'lamb')?.reasons?.hopelessness).toBeUndefined();
  });

  it('THE MIRROR IS ONE MEASUREMENT: the two sides are the two signs of a single gradient', () => {
    for (const gradient of [0.9, 0.4, 0, -0.4, -0.9]) {
      const war = scoreOpportunism({ gradient }).score;
      const peace = scoreHopelessness({ gradient }).score;
      expect(war === 0 || peace === 0, `gradient ${gradient}: only one sign may score`).toBe(true);
      expect(war + peace).toBeCloseTo(Math.abs(gradient), 10);
    }
  });

  it('THE MIRROR CAN WIN: hopelessness LEADS the case on a hopeless pair', () => {
    // NOTE the fixture: belief_convergence SATURATES at 1.0 in any belief-dormant world
    // (both margins read truth, so their sum is exactly 0 — Blainey-correct, and
    // documented in peaceReasons.js). To ask whether another reason can LEAD, the world
    // has to be fogged, so both courts here believe the other a giant.
    const ws = drivePeace([WOLF, LAMB], FOG,
      beliefWorldExtra([['lamb', 'wolf', 4, 0.95], ['wolf', 'lamb', 4, 0.95]])).worldState;
    const ranked = Object.values(peaceReasonsFor(ws, 'lamb', 'wolf').reasons)
      .sort((a, b) => b.score - a.score);
    expect(ranked[0].type, 'not a decorative kind — it actually leads the case').toBe('hopelessness');
    expect(ranked[0].score).toBeGreaterThan(0.4);
  });
});

// ── GAP 2: SACRED CLAIM — the religious casus ────────────────────────────────

const DAWN = { ref: 'custom:dawn', align: 'good' };
const MAW = { ref: 'custom:maw', align: 'evil' };
const DUSK = { ref: 'custom:dusk', align: 'good' };

/** Two towns with chosen patrons, otherwise identical (so ONLY faith can move a score). */
function faithPair(patronA, patronB, security = 0.9) {
  return [
    town('wolf', { patron: patronA, patronSecurity: security }),
    town('lamb', { patron: patronB, patronSecurity: security }),
  ];
}

describe('sacred_claim — the religious casus belli, off the CLOSED faith quadrant', () => {
  it('POSITIVE (schism): the same god read oppositely is the strongest claim', () => {
    const rec = warReasonsFor(driveWar(faithPair(DAWN, { ...DAWN, align: 'evil' }), FAITH_LIT).worldState, 'wolf', 'lamb')
      ?.reasons?.sacred_claim;
    expect(rec).toBeTruthy();
    expect(rec.receipt).toMatch(/heres/i);
  });

  it('POSITIVE (natural enemy): opposed rites under different gods also mint a claim', () => {
    const rec = warReasonsFor(driveWar(faithPair(DAWN, MAW), FAITH_LIT).worldState, 'wolf', 'lamb')
      ?.reasons?.sacred_claim;
    expect(rec).toBeTruthy();
    expect(rec.receipt).toMatch(/altars/i);
  });

  it('the heretic outranks the stranger (schism scores above natural enemy)', () => {
    const schism = warReasonsFor(driveWar(faithPair(DAWN, { ...DAWN, align: 'evil' }), FAITH_LIT).worldState, 'wolf', 'lamb');
    const stranger = warReasonsFor(driveWar(faithPair(DAWN, MAW), FAITH_LIT).worldState, 'wolf', 'lamb');
    expect(schism.reasons.sacred_claim.score).toBeGreaterThan(stranger.reasons.sacred_claim.score);
  });

  it('NEGATIVE: the OPPOSITE fixture (shared god, shared reading) reads exactly zero', () => {
    const entry = warReasonsFor(driveWar(faithPair(DAWN, DAWN), FAITH_LIT).worldState, 'wolf', 'lamb');
    expect(entry?.reasons?.sacred_claim, 'brothers press no claim').toBeUndefined();
  });

  it('NEGATIVE: a rival god whose people want the same things is a neighbour, not a heretic', () => {
    const entry = warReasonsFor(driveWar(faithPair(DAWN, DUSK), FAITH_LIT).worldState, 'wolf', 'lamb');
    expect(entry?.reasons?.sacred_claim).toBeUndefined();
  });

  it('DARK FLAG: the same opposed-rite world with faith unlit is byte-identical', () => {
    const lit = driveWar(faithPair(DAWN, MAW), FAITH_LIT).worldState.spatialLedgers?.warReasons;
    const dark = driveWar(faithPair(DAWN, MAW), LIT).worldState.spatialLedgers?.warReasons;
    expect(lit, 'anti-vacuity: the lit world really did mint something').toBeTruthy();
    expect(dark, 'the faith flag dark ⇒ no faith reason, and here nothing else fires either').toBeUndefined();
  });

  it('DARK SUBSTRATE: a patronless town mints nothing — absence of a faith is not a shared faith', () => {
    // The guard that matters: faithAlignmentQuadrant treats a no-signal pair as KINDRED,
    // so without this both towns would read `respectable_rival` and mint a common_rite.
    const nobody = [town('wolf', { patronSecurity: 0.9 }), town('lamb', { patronSecurity: 0.9 })];
    expect(faithStandingBetween(nobody[0], nobody[1])).toBeNull();
    expect(driveWar(nobody, FAITH_LIT).worldState.spatialLedgers?.warReasons).toBeUndefined();
    // The peace ledger is NOT empty here (belief_convergence saturates on any live war in
    // a belief-dormant world), so the claim under test is the TYPED one: no faith reason.
    const peace = drivePeace(nobody, FAITH_LIT).worldState.spatialLedgers?.peaceReasons || {};
    for (const key of Object.keys(peace)) {
      expect(peace[key].reasons.common_rite, `${key} must not mint a rite from two absent faiths`)
        .toBeUndefined();
    }
  });

  it('a discredited church presses no claim (patronSecurity is the standing to speak)', () => {
    const shaky = [
      town('wolf', { patron: DAWN, patronSecurity: 0.02 }),
      town('lamb', { patron: MAW, patronSecurity: 0.9 }),
    ];
    expect(warReasonsFor(driveWar(shaky, FAITH_LIT).worldState, 'wolf', 'lamb')?.reasons?.sacred_claim)
      .toBeUndefined();
  });
});

describe('common_rite — the SAME quadrant read the other way (a mirror, not a stub)', () => {
  it('POSITIVE: two courts on one floor accumulate a typed reason to stop', () => {
    const rec = peaceReasonsFor(drivePeace(faithPair(DAWN, DAWN), FAITH_LIT).worldState, 'wolf', 'lamb')
      ?.reasons?.common_rite;
    expect(rec).toBeTruthy();
    expect(rec.score).toBeGreaterThan(REASON_TUNING.MIN_SCORE);
    // The semantic token every brothers variant carries (framing varies, meaning does not).
    expect(rec.receipt).toMatch(/god/i);
  });

  it('NEGATIVE: the schism fixture that mints the CLAIM reads exactly zero here', () => {
    const entry = peaceReasonsFor(
      drivePeace(faithPair(DAWN, { ...DAWN, align: 'evil' }), FAITH_LIT).worldState, 'wolf', 'lamb');
    expect(entry?.reasons?.common_rite).toBeUndefined();
  });

  it('NO QUADRANT SCORES ON BOTH SIDES (one reading, two exclusive columns)', () => {
    for (const [a, b] of [[DAWN, DAWN], [DAWN, DUSK], [DAWN, { ...DAWN, align: 'evil' }], [DAWN, MAW]]) {
      const standing = faithStandingBetween(...faithPair(a, b));
      const claim = scoreSacredClaim({ standing }).score;
      const rite = scoreCommonRite({ standing }).score;
      expect(claim === 0 || rite === 0, `${standing.quadrant} may not score both ways`).toBe(true);
    }
  });

  it('THE MIRROR CAN WIN: common_rite LEADS the case on a brothers pair', () => {
    // Fogged for the same reason as the hopelessness can-win pin: belief_convergence
    // saturates at 1.0 whenever beliefs are dormant. Here both courts believe the other
    // weak, so the Blainey read collapses and the shared rite is what is left standing.
    const ws = drivePeace(faithPair(DAWN, DAWN), FAITH_FOG,
      beliefWorldExtra([['wolf', 'lamb', 0, 0.05], ['lamb', 'wolf', 0, 0.05]])).worldState;
    const ranked = Object.values(peaceReasonsFor(ws, 'wolf', 'lamb').reasons)
      .sort((a, b) => b.score - a.score);
    expect(ranked[0].type).toBe('common_rite');
    expect(ranked[0].score).toBeGreaterThan(0.4);
  });
});

// ── Determinism (reasons are READS, not rolls) ───────────────────────────────

describe('the new reasons are deterministic reads', () => {
  it('same world ⇒ byte-identical ledgers, both sides, across repeated folds', () => {
    const items = [WOLF, town('lamb', { tier: 'hamlet', population: 300, readiness: 0.05, legitimacy: 20, patron: MAW, patronSecurity: 0.8 })];
    const w1 = driveWar(items, FAITH_LIT).worldState.spatialLedgers.warReasons;
    const w2 = driveWar(items, FAITH_LIT).worldState.spatialLedgers.warReasons;
    expect(JSON.stringify(w1)).toBe(JSON.stringify(w2));
    const p1 = drivePeace(items, FAITH_LIT).worldState.spatialLedgers.peaceReasons;
    const p2 = drivePeace(items, FAITH_LIT).worldState.spatialLedgers.peaceReasons;
    expect(JSON.stringify(p1)).toBe(JSON.stringify(p2));
  });
});

// ── THE DIVERSITY WALKER (what the taxonomy review asked for) ────────────────
//
// A reason that can never fire is decoration. This walker holds a WITNESS for every
// member of both catalogs — an input under which that reason clears MIN_SCORE — and
// asserts the witness set is EXACTLY the catalog. A new reason added without a witness
// reds; a witness that stops firing reds; a retired reason's stale witness reds.
//
// Witnesses run the pure scorers, which is how this suite already treats the ledger-fed
// registration seams (treaty_default / corruption_exposed and the reframe casus): their
// upstream feeds are whole engines, and a fixture that stood one up would be testing the
// feed, not the reason. The four reasons this wave adds are ALSO proven end-to-end
// through the real movers above, including that each can be the TOP reason on a pair.

const HOSTILE = { resentment: 0.85, memoryScore: 0.7, recentIncidents: [{ type: 'war_raid', tick: 1 }] };
const SCHISM_STANDING = faithStandingBetween(...faithPair(DAWN, { ...DAWN, align: 'evil' }));
const BROTHERS_STANDING = faithStandingBetween(...faithPair(DAWN, DAWN));
const SPHERE = [{
  centerId: 'lamb', centerName: 'lamb', strengthShare: 0.9, memberCount: 4,
  members: [{ id: 'x' }], strain: { strainedCount: 3 },
}];

/** @type {Record<string, () => number>} */
const WAR_WITNESSES = {
  grievance: () => scoreGrievance(HOSTILE).score,
  revanchism: () => scoreRevanchism(HOSTILE, 40).score,
  resource_pressure: () => scoreResourcePressure({ own01: 0.9, foe01: 0.05 }).score,
  treaty_default: () => scoreTreatyDefault({
    treaties: [{ parties: ['a', 'b'], complianceState: 'defaulted', defaultedBy: 'b', defaultSeverity01: 0.8 }],
    fromId: 'a', toId: 'b',
  }).score,
  encirclement: () => scoreEncirclement({ threat01: 0.8, hostile: true }).score,
  legitimacy_hunger: () => scoreLegitimacyHunger({ legitimacyScore: 5, hostile: true }).score,
  corruption_exposed: () => scoreCorruptionExposed({ exposedCorruption01: 0.8 }).score,
  foreign_clash: () => scoreForeignClash({ clash01: 0.8 }).score,
  fear_of_dominance: () => scoreFearOfDominance({
    observerId: 'wolf', centerId: 'lamb', spheres: SPHERE, distanceWeight01: 1,
  }).score,
  ingratitude_debt: () => scoreIngratitudeDebt({ debt01: 0.8 }).score,
  dependency_by_design: () => scoreDependencyByDesign({ design01: 0.8 }).score,
  opportunism: () => scoreOpportunism({ gradient: 0.7, capability01: 1 }).score,
  sacred_claim: () => scoreSacredClaim({ standing: SCHISM_STANDING }).score,
};

/** @type {Record<string, () => number>} */
const PEACE_WITNESSES = {
  exhaustion: () => scoreExhaustion({ scar01: 0.8 }).score,
  belief_convergence: () => scoreBeliefConvergence({ marginA: 0.2, marginB: -0.2 }).score,
  economic_strangulation: () => scoreEconomicStrangulation({ trade01: 0.9, economy01: 0.9 }).score,
  coalition_fracture: () => scoreCoalitionFracture({ peakAllies: 4, nowAllies: 1 }).score,
  mediation: () => scoreMediation({ impulse: 1, mediatorName: 'Brookhaven' }).score,
  harvest_pressure: () => scoreHarvestPressure({ season: 'autumn' }).score,
  realignment: () => scoreRealignment({ commonThird: 'horde', bothBesetByThirds: true }).score,
  spheres_understanding: () => scoreSpheresUnderstanding({ clash01: 0.8 }).score,
  balance_restored: () => scoreBalanceRestored({
    observerId: 'wolf', centerId: 'lamb', spheres: SPHERE, distanceWeight01: 1,
  }).score,
  debt_forgiven: () => scoreDebtForgiven({ forgiven01: 0.8 }).score,
  bonds_of_commerce: () => scoreBondsOfCommerce({ bonds01: 0.8 }).score,
  hopelessness: () => scoreHopelessness({ gradient: -0.7 }).score,
  common_rite: () => scoreCommonRite({ standing: BROTHERS_STANDING }).score,
};

describe('THE DIVERSITY WALKER — every reason CAN win, or this reds', () => {
  it('the dependency-free taxonomy guard accepts every war kind and rejects foreign values', () => {
    expect(WAR_REASON_TYPES.every(isWarReasonType)).toBe(true);
    expect(isWarReasonType('not_a_casus')).toBe(false);
    expect(isWarReasonType(null)).toBe(false);
  });

  it('the war witness table is EXACTLY the war catalog (no gap, no stale entry)', () => {
    expect(Object.keys(WAR_WITNESSES).sort()).toEqual([...WAR_REASON_TYPES].sort());
  });

  it('the peace witness table is EXACTLY the peace catalog (no gap, no stale entry)', () => {
    expect(Object.keys(PEACE_WITNESSES).sort()).toEqual([...PEACE_REASON_TYPES].sort());
  });

  for (const type of WAR_REASON_TYPES) {
    it(`war/${type}: fires above MIN_SCORE under its witness (not decoration)`, () => {
      expect(WAR_WITNESSES[type]()).toBeGreaterThanOrEqual(REASON_TUNING.MIN_SCORE);
    });
  }

  for (const type of PEACE_REASON_TYPES) {
    it(`peace/${type}: fires above MIN_SCORE under its witness (not decoration)`, () => {
      expect(PEACE_WITNESSES[type]()).toBeGreaterThanOrEqual(REASON_TUNING.MIN_SCORE);
    });
  }

  it('and the §14.3 mirror table still pairs the grown catalogs total + bijectively', () => {
    expect(Object.keys(REASON_MIRRORS).sort()).toEqual([...WAR_REASON_TYPES].sort());
    expect(Object.values(REASON_MIRRORS).sort()).toEqual([...PEACE_REASON_TYPES].sort());
    expect(WAR_REASON_TYPES.length).toBe(PEACE_REASON_TYPES.length);
  });
});
