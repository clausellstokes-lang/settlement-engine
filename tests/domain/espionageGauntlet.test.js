/**
 * espionageGauntlet.test.js — ES-2: the stay-detection gauntlet, its two ransom arms, and
 * the captor's disposition.
 *
 * WHAT THIS FILE REFUSES TO DO, each because it is a recorded way a pin ships vacuous here:
 *
 *   1. IT NEVER DRIVES A HAND-BUILT ERRAND. Every dwell, roll and worth pin below runs on a
 *      row minted through `mintEnvoyErrand` — the production writer — and read back out of
 *      the ledger. A hand-shaped object would let the DTO drift out from under the whole
 *      file silently.
 *   2. IT NEVER PROVES A FACTOR LIVE BY ITS PRESENCE IN THE SOURCE, AND THE DROPS RUN
 *      THROUGH THE REAL GATHERING FUNCTION. Each of the TEN catch factors is dropped one at
 *      a time by moving the WORLD that `gauntletCatchFactors` reads, and BOTH the gathered
 *      term AND the resulting chance must move. A conjunction of ten multipliers is the
 *      shape in which one dead term hides behind nine live ones (the conjunction-coverage
 *      law) — but the shape that actually bit here was subtler, and is written down so
 *      nobody re-derives it: this file used to drop the terms on a HAND-WRITTEN LITERAL fed
 *      straight to `catchChance01`, which is ES-0's arithmetic leaf and was already ES-0's
 *      job (tests/domain/espionageMath.test.js, "EVERY factor is individually live"). It
 *      never routed through the gathering at all — so EIGHT of the ten world reads could be
 *      replaced with CONSTANTS while this whole battery stayed green. Measured: eight
 *      mutants, eight greens. Asserting that the GATHERED TERM moved, and not only that the
 *      chance moved, is what kills a constant — a world edit that shifts two terms at once
 *      would otherwise leave the one that was constant-ised still covered by the other.
 *   3. IT NEVER SPLITS A COMPOSITE ID. Errand ids contain dots and colons, so attribution
 *      from a roll key is BY RECONSTRUCTION — rebuild the key from the detection's own
 *      fields and compare — never by parsing. WR-8 recorded that lesson the expensive way,
 *      and this layer's key would break on the very first real id.
 */
import { describe, expect, test } from 'vitest';

import {
  COVERT_HOLD_CAUSE,
  GAUNTLET_TUNING,
  advanceEspionageGauntlet,
  captorLeniencyRead,
  covertDwellRead,
  gatherOrGovernRead,
  gauntletCatchFactors,
  recentCovertHolds,
  stayDetectionKey,
  stayDetectionRoll,
} from '../../src/domain/worldPulse/espionage/espionageGauntlet.js';
import {
  ESPIONAGE_TUNING,
  catchChance01,
  dwellRamp,
} from '../../src/domain/worldPulse/espionage/espionageMath.js';
import { readEspionageDoctrine } from '../../src/domain/worldPulse/espionage/espionageDoctrine.js';
import { TELL_TERMS_ABSENT } from '../../src/domain/worldPulse/espionage/espionageWariness.js';
import { PATRONAGE_TUNING } from '../../src/domain/corruption.js';
import {
  FOREIGN_GUEST_HOLD_CAUSES,
  FOREIGN_GUEST_HOLD_COVERT_CAUSE,
  foreignGuestHoldsOf,
  normalizeForeignGuestHold,
  openForeignGuestHold,
} from '../../src/domain/worldPulse/foreignGuestHold.js';
import {
  RANSOM_COVERT_HOLD_CAUSE,
  RANSOM_TUNING,
  ransomDwellRead,
} from '../../src/domain/worldPulse/ransomClaim.js';
import { ransomWorthBandFromErrand } from '../../src/domain/worldPulse/envoyRansomStage.js';
import { scheduledEnvoyPosition } from '../../src/domain/worldPulse/envoyErrandTransit.js';
import {
  ENVOY_REQUIRED_RULES,
  envoyErrandsOf,
  mintEnvoyErrand,
  normalizeEnvoyPeaceOffer,
} from '../../src/domain/worldPulse/envoyErrand.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const WAR_RULES = Object.freeze(Object.fromEntries(ENVOY_REQUIRED_RULES.map((k) => [k, true])));

function litWorld(rules = {}) {
  return {
    tick: 10,
    spatialCanonVersion: 1,
    simulationRules: {
      ...WAR_RULES,
      infoMode: 'unreliable',
      errandSpineEnabled: true,
      espionageEnabled: true,
      ...rules,
    },
    relationshipStates: { untouched: { relationshipType: 'hostile' } },
  };
}

const SNAPSHOT_BANDS = Object.freeze({
  storesBand: 'thin',
  strengthBand: 'ready',
  moraleExhaustionBand: 'present',
  foundingCauseStatus: 'live',
  believedRatioBand: 'matched',
});

function peaceOffer(from = 'ashford', to = 'irontown') {
  const relationshipKey = `${from}::${to}`;
  return {
    id: 'peace.offer.1',
    generatedAtTick: 10,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleId: 'settlement_strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: from,
    severity: 0.91,
    reasons: ['Engine prose does not ride with the envoy.'],
    relationshipKey,
    relationshipPatch: {
      proposedRelationshipType: 'neutral', trajectory: 'transitioning', privateScalar: 0.75,
    },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey,
      fromType: 'hostile',
      toType: 'neutral',
      peaceOffer: true,
      offererId: from,
      targetId: to,
      peaceFrontOwnerId: from,
      peaceFrontSinceTick: 4,
      reason: 'Engine prose is deliberately excluded.',
    },
  };
}

function acceptedRuling(outcome) {
  const offer = normalizeEnvoyPeaceOffer(outcome);
  const { offererId, targetId } = offer.proposalPayload;
  return {
    accepted: true,
    offererId,
    targetId,
    receipt: {
      id: `decision.${offererId}.${targetId}`,
      kind: 'war_peace_acceptance_read',
      tick: 10,
      offerId: offer.id,
      offererId,
      targetId,
      decision: 'accept',
      actualAction: 'peace',
      decidingTerm: 'cost_to_continue',
      bands: {
        cause: 'present', cost_to_continue: 'pressing', cost_to_stop: 'present', momentum: 'quiet',
      },
      reason: 'Both courts accept the carried peace.',
    },
    offererRead: {
      id: `termination.${offererId}.${targetId}`,
      kind: 'war_termination_read',
      tick: 10,
      attackerId: offererId,
      targetId,
      settlementIds: [offererId, targetId],
      booksDirection: 'peace',
      booksInterest: 'realm',
    },
    termination: {
      receipt: {
        id: `termination.${targetId}.${offererId}`,
        kind: 'war_termination_read',
        tick: 10,
        attackerId: targetId,
        targetId: offererId,
        settlementIds: [targetId, offererId],
        booksDirection: 'peace',
        booksInterest: 'realm',
      },
    },
    inheritedDemand: null,
    coalitionPeaceExpenditures: [],
  };
}

/** The mission's own schedule: arrive westmarch at 12, leave for irontown at 20. */
const DEFAULT_LEGS = Object.freeze([
  { fromId: 'ashford', toId: 'westmarch', departTick: 10, arrivalTick: 12 },
  { fromId: 'westmarch', toId: 'irontown', departTick: 20, arrivalTick: 22 },
]);

/** THE SAME MISSION WITH A LONG SECOND LEG. The default plan's dwell window closes at tick
 *  20, which reaches interval 3 — so it can never say anything about a cap of 6. This one
 *  waits at westmarch until tick 40, which outruns the cap and makes the clamp measurable
 *  on the read that produces the index. */
const LONG_DWELL_LEGS = Object.freeze([
  { fromId: 'ashford', toId: 'westmarch', departTick: 10, arrivalTick: 12 },
  { fromId: 'westmarch', toId: 'irontown', departTick: 40, arrivalTick: 42 },
]);

/** A REAL two-leg covert mission: ashford → westmarch (the dwell) → irontown (the target). */
function mintMission(worldState, { covert = true, legs = DEFAULT_LEGS } = {}) {
  const outcome = peaceOffer();
  const minted = mintEnvoyErrand({
    worldState,
    outcome,
    acceptance: acceptedRuling(outcome),
    npcId: 'npc.reeve',
    npcName: 'Reeve Mara',
    snapshot: SNAPSHOT_BANDS,
    purpose: 'sue',
    ...(covert
      ? {
        purposeClass: 'covert',
        covert: {
          demand: 'confirm',
          product: 'confirm',
          subjectId: 'irontown',
          itinerary: [
            { face: 'covert', settlementId: 'westmarch', stayTicks: 2 },
            { face: 'declared', settlementId: 'irontown', stayTicks: 2 },
          ],
        },
      }
      : {}),
    routePlan: {
      legs: legs.map((leg) => ({ ...leg })),
      // DERIVED, not restated: eighteen ticks after the last arrival, which is the 40 the
      // default plan carried before this became a parameter.
      expectedReturnTick: legs[legs.length - 1].arrivalTick + 18,
      routeRef: { id: 'road.north', name: 'North Road' },
    },
    tick: 10,
  });
  return { worldState: minted.worldState, errand: envoyErrandsOf(minted.worldState)[0] };
}

const SNAPSHOT = Object.freeze({
  settlements: [
    {
      id: 'ashford', name: 'Ashford', crimeRate: 'moderate', safety: 'guarded', wealth: 'moderate', population: 4000,
    },
    {
      id: 'westmarch',
      name: 'Westmarch',
      crimeRate: 'rampant',
      safety: 'lawless',
      wealth: 'poor',
      population: 2500,
      activeConditions: [{ id: 'c1' }, { id: 'c2' }],
    },
  ],
});

const HOSTILE_GRAPH = Object.freeze({
  edges: [{ from: 'ashford', to: 'westmarch', relationshipType: 'hostile' }],
});
const FRIENDLY_GRAPH = Object.freeze({
  edges: [{ from: 'ashford', to: 'westmarch', relationshipType: 'allied' }],
});
const RIVAL_GRAPH = Object.freeze({
  edges: [{ from: 'ashford', to: 'westmarch', relationshipType: 'rival' }],
});

/** Westmarch with ONE compromised watch-house, in the shape `corruption.js` actually reads:
 *  a security-named institution carrying a `corruption`-typed IMPAIRMENT. */
const BOUGHT_WATCH_TOWN = Object.freeze({
  ...SNAPSHOT.settlements[1],
  institutions: [{ name: 'Town Watch', type: 'guard', impairments: [{ type: 'corruption' }] }],
});

/** An institution DECLARING the clandestine facet (the facet law's custom-content parity),
 *  which is what `settlementHasUnderways` resolves — never an English name. */
const UNDERWAYS_INSTITUTION = Object.freeze({
  name: 'The Warren', facets: { institutionFunction: 'clandestine' },
});

/** The gathering under test, on one fixed world. Every drop below is a PATCH to this. */
function gatherFactors(patch = {}) {
  return gauntletCatchFactors({
    worldState: litWorld(),
    regionalGraph: HOSTILE_GRAPH,
    homeId: 'ashford',
    homeItem: SNAPSHOT.settlements[0],
    targetItem: SNAPSHOT.settlements[1],
    tick: 13,
    dwell: { settlementId: 'westmarch', stopIndex: 1, intervalIdx: 0 },
    hasInsideAsset: false,
    ...patch,
  });
}

function stage(worldState, tick, graph = HOSTILE_GRAPH, extra = {}) {
  return advanceEspionageGauntlet({
    worldState, tick, snapshot: SNAPSHOT, regionalGraph: graph, ...extra,
  });
}

describe('ES-2 — the dwell window is read off the schedule, never off a second clock', () => {
  test('a covert traveller dwells between the legs and departs when the plan says so', () => {
    const { errand } = mintMission(litWorld());
    // Executed against the REAL transit cursor: arrival 12, next departure 20.
    const window = [11, 12, 13, 14, 15, 17, 19, 20]
      .map((tick) => ({ tick, ...covertDwellRead({ errand, tick }) }));
    expect(window.map((row) => [row.tick, row.dwelling])).toEqual([
      [11, false], [12, true], [13, true], [14, true], [15, true], [17, true], [19, true], [20, false],
    ]);
    expect(window.filter((row) => row.dwelling).map((row) => row.settlementId))
      .toEqual(['westmarch', 'westmarch', 'westmarch', 'westmarch', 'westmarch', 'westmarch']);
    expect(window.filter((row) => row.dwelling).map((row) => row.stopIndex))
      .toEqual([1, 1, 1, 1, 1, 1]);
  });

  test('interval 0 is the MINTED stay and the rooted intervals climb from it', () => {
    const { errand } = mintMission(litWorld());
    // stayTicks 2 from arrival 12 ⇒ ticks 12,13 are in-plan; 14+ is rooted.
    expect([12, 13, 14, 15, 16, 17, 18, 19].map((tick) => covertDwellRead({ errand, tick }).intervalIdx))
      .toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
    expect([12, 13, 14, 19].map((tick) => covertDwellRead({ errand, tick }).rooted))
      .toEqual([false, false, true, true]);
  });

  test('every non-mission row is refused BY REASON rather than by a shared boolean', () => {
    const { errand } = mintMission(litWorld());
    const { errand: plain } = mintMission(litWorld(), { covert: false });
    expect(covertDwellRead({ errand: plain, tick: 13 }).reason).toBe('not_a_mission');
    expect(covertDwellRead({ errand, tick: 'x' }).reason).toBe('invalid_tick');
    expect(covertDwellRead({ errand, tick: 11 }).reason).toBe('not_dwelling');
    expect(covertDwellRead({ errand: { ...errand, state: 'home' }, tick: 13 }).reason)
      .toBe('not_dwelling');
    // A stop the ITINERARY does not name is a waypoint, not a stay anybody chose.
    const strayPlan = {
      ...errand,
      covert: { ...errand.covert, itinerary: [{ face: 'declared', settlementId: 'irontown', stayTicks: 2 }] },
    };
    expect(covertDwellRead({ errand: strayPlan, tick: 13 }).reason).toBe('unplanned_stop');
  });

  // ── TWO GUARDS OVER ONE JOB, PINNED SEPARATELY ────────────────────────────────────
  // `covertDwellRead` refuses twice: once on the SCHEDULE's own word (`progressBand` must
  // read 'arrived') and once on the LEG's raw `arrivalTick` (a whole tick that has passed).
  // On an ordinary itinerary the two agree on every row, so each is invisible behind the
  // other: deleting EITHER one alone left the whole ES-2 battery green, and only deleting
  // BOTH reddened anything (measured — three tests). Two guards over one job can only be
  // pinned JOINTLY unless each gets a row where the OTHER one does not fire, so each pin
  // below is exactly that row, and each states the disagreement it rests on rather than
  // asserting a bare `false`.
  test('GUARD 1 alone: the SCHEDULE says he is still moving, though the raw arrival has passed', () => {
    const { errand } = mintMission(litWorld());
    // A leg claiming it ARRIVES BEFORE IT DEPARTS. The transit reader clamps every leg to a
    // minimum length, so at tick 10 it still calls him departed-and-moving, while the raw
    // `arrivalTick` this leaf reads is already ten ticks behind. Guard 2 is satisfied here;
    // only guard 1 refuses.
    const inverted = {
      ...errand,
      legs: [{ ...errand.legs[0], departTick: 10, arrivalTick: 5 }, ...errand.legs.slice(1)],
    };
    const position = scheduledEnvoyPosition(inverted, 10)?.positionRef;
    expect(position.progressBand, 'the premise: the schedule does NOT say arrived').toBe('departed');
    expect(position.legIndex).toBe(0);
    expect(inverted.legs[0].arrivalTick, 'the premise: the raw arrival has already passed').toBeLessThan(10);
    expect(covertDwellRead({ errand: inverted, tick: 10 }).dwelling).toBe(false);
    expect(covertDwellRead({ errand: inverted, tick: 10 }).reason).toBe('not_dwelling');
  });

  test('GUARD 2 alone: the SCHEDULE says arrived, on a leg whose arrival is not a whole tick', () => {
    const { errand } = mintMission(litWorld());
    // `scheduledEnvoyPosition` compares raw numbers, so 12.5 is past at tick 13 and it
    // reports 'arrived'. This leaf reads WHOLE ticks and gets null, which is the half of
    // guard 2 that a real producer can reach. Guard 1 is satisfied here; only guard 2 refuses.
    const fractional = {
      ...errand,
      legs: [{ ...errand.legs[0], arrivalTick: 12.5 }, ...errand.legs.slice(1)],
    };
    const position = scheduledEnvoyPosition(fractional, 13)?.positionRef;
    expect(position.progressBand, 'the premise: the schedule DOES say arrived').toBe('arrived');
    expect(position.legIndex).toBe(0);
    expect(Number.isInteger(fractional.legs[0].arrivalTick), 'the premise: not a whole tick').toBe(false);
    expect(covertDwellRead({ errand: fractional, tick: 13 }).dwelling).toBe(false);
    expect(covertDwellRead({ errand: fractional, tick: 13 }).reason).toBe('not_dwelling');
    // ⚠ RECORDED, NOT PAPERED OVER: guard 2 reads `arrivalTick == null || now < arrivalTick`
    // and only the FIRST half is reachable from this producer. `scheduledEnvoyPosition`
    // reports 'arrived' at a leg index precisely because `tick >= that leg's arrivalTick`,
    // so a row that is 'arrived' BEFORE its own arrival cannot be built through it. The
    // `now < arrivalTick` clause is defence against a future second producer, deliberately
    // kept, and deliberately not pinned — pinning it would take a fixture no caller can
    // make, which is how a vacuous pin gets authored.
  });

  test('MEASURED: the resample cap CLAMPS the dwell index, on a stay long enough to reach it', () => {
    // R-ES2-2 declares `DWELL_RESAMPLE_CAP` LOAD-BEARING at ES-2 rather than a backstop,
    // and until now it was pinned only inside `gatherOrGovernRead` — never on the read that
    // PRODUCES the index. The default plan's window closes at tick 20 and reaches interval
    // 3, so raising the cap from 6 to 999 left the whole battery green (measured). This
    // mission waits at westmarch until tick 40, which outruns the cap.
    const { errand } = mintMission(litWorld(), { legs: LONG_DWELL_LEGS });
    const at = (tick) => covertDwellRead({ errand, tick });
    // It still CLIMBS below saturation — a flat index would satisfy a saturation pin alone.
    expect([12, 14, 16, 18, 20, 22].map((tick) => at(tick).intervalIdx)).toEqual([0, 1, 2, 3, 4, 5]);
    // …and then it STOPS, at the cap, and stays there for the rest of the window. This is
    // the arm the raised-cap mutant cannot survive: without the clamp tick 38 would read 13.
    expect(at(24).intervalIdx).toBe(ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP);
    expect(at(38).intervalIdx).toBe(ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP);
    expect(at(38).intervalIdx, 'saturated: eight more ticks buy no further interval')
      .toBe(at(24).intervalIdx);
    expect(at(38).dwelling, 'the premise: he is still dwelling at the far end of the window').toBe(true);
  });
});

describe('ES-2 — the stay roll', () => {
  test('A FRIENDLY HOST ROLLS NOTHING (the anchored negative)', () => {
    const { worldState } = mintMission(litWorld());
    const hostile = stage(worldState, 13, HOSTILE_GRAPH).detections;
    const friendly = stage(worldState, 13, FRIENDLY_GRAPH).detections;
    // THE ANCHOR: the same mission, the same tick, the same stage — only the rung moved. A
    // bare "the friendly run caught nobody" would pass with the whole gauntlet deleted, so
    // the hostile run is asserted to produce a REAL non-zero chance first.
    expect(hostile).toHaveLength(1);
    expect(hostile[0].hostRung).toBe(3);
    expect(hostile[0].catch01).toBeGreaterThan(0);
    expect(friendly).toHaveLength(1);
    expect(friendly[0].hostRung).toBe(0);
    expect(friendly[0].catch01).toBe(0);
    expect(friendly[0].caught).toBe(false);
    // And the ZERO is arithmetic rather than a caller-side condition: the leaf itself
    // answers 0 for a rung outside the closed hostile-class table.
    expect(catchChance01({ ...hostile[0], hostRung: 0, securityEff01: 1, orderBand: 'surplus' })).toBe(0);
  });

  test('the roll is IDEMPOTENT inside one interval and moves between intervals', () => {
    const { worldState } = mintMission(litWorld());
    const rows = [12, 13, 14, 15, 16, 17, 18, 19]
      .map((tick) => stage(worldState, tick).detections[0]);
    // Exactly-once is IDEMPOTENCE, not a stored flag: two ticks in one interval are one
    // decision, byte for byte, so re-evaluating an interval cannot mint a second outcome.
    expect(JSON.stringify(rows[0])).toBe(JSON.stringify(rows[1]));
    expect(JSON.stringify(rows[2])).toBe(JSON.stringify(rows[3]));
    expect(JSON.stringify(rows[4])).toBe(JSON.stringify(rows[5]));
    expect(JSON.stringify(rows[6])).toBe(JSON.stringify(rows[7]));
    // Four intervals, four distinct keys, four distinct draws — the enumeration is real.
    const keys = [...new Set(rows.map((row) => row.rollKey))];
    expect(keys).toHaveLength(4);
    expect(new Set(rows.map((row) => row.roll01)).size).toBe(4);
  });

  test('the ramp is LIVE: a rooted stay costs more every interval', () => {
    const { worldState } = mintMission(litWorld());
    const chances = [12, 14, 16, 18].map((tick) => stage(worldState, tick).detections[0].catch01);
    const ramps = [12, 14, 16, 18].map((tick) => stage(worldState, tick).detections[0].ramp);
    expect(ramps).toEqual([...ESPIONAGE_TUNING.DWELL_RAMP]);
    for (let index = 1; index < chances.length; index += 1) {
      expect(chances[index]).toBeGreaterThan(chances[index - 1]);
    }
    // THE RAMP-LIVE MUTANT, executed rather than described: flattening the band table to
    // all-ones must collapse the climb. Running it through `catchChance01` with a fixed
    // factor record is the same arithmetic the stage runs, minus the world gathering.
    const base = stage(worldState, 12).detections[0];
    const factors = {
      hostRung: base.hostRung,
      securityEff01: 0.5,
      orderBand: 'adequate',
      stressLoad01: 0,
      hasUnderways: false,
      hasInsideAsset: false,
      wariness01: 0,
      competence01: 0,
      stops: 1,
    };
    const live = [0, 1, 2, 3].map((intervalIdx) => catchChance01({ ...factors, intervalIdx }));
    const flattened = [0, 1, 2, 3].map(() => catchChance01({ ...factors, intervalIdx: 0 }));
    expect(new Set(live).size).toBe(4);
    expect(new Set(flattened).size).toBe(1);
    expect(dwellRamp(99)).toBe(ESPIONAGE_TUNING.DWELL_RAMP[ESPIONAGE_TUNING.DWELL_RAMP.length - 1]);
  });

  test('a capture is REACHABLE on a real mission, and it is attributed BY RECONSTRUCTION', () => {
    const { worldState } = mintMission(litWorld());
    const caught = [12, 14, 16, 18]
      .map((tick) => stage(worldState, tick).detections[0])
      .filter((row) => row.caught);
    // The wave's jewel: a real minted mission, rooted at a hostile market, is really taken.
    expect(caught.length).toBeGreaterThan(0);
    const row = caught[0];
    // ⚠ ATTRIBUTION IS BY RECONSTRUCTION. The real minted id is already full of separators
    // (`envoy_errand:17:ashford::irontown|…`), and settlement ids elsewhere in this estate
    // carry dots outright — so the key is re-BUILT from the detection's own fields and
    // compared, never parsed back apart. WR-8 paid for that lesson once.
    expect(row.errandId).toMatch(/[:|]/);
    expect(row.rollKey).toBe(stayDetectionKey(row.errandId, row.stopIndex, row.intervalIdx));
    // And the naive road is proven WRONG rather than merely avoided: with a dotted id the
    // last-two-segments parse recovers neither the stop nor the id.
    const dotted = stayDetectionKey('shire.westmarch', row.stopIndex, row.intervalIdx);
    expect(dotted.split('.').slice(2, -2).join('.')).toBe('shire.westmarch');
    expect(dotted.split('.')[2]).not.toBe('shire.westmarch');
  });

  test('every catch factor is INDIVIDUALLY live THROUGH THE GATHERING — ten world drops', () => {
    // Each patch moves the WORLD, not a literal, so a gathering expression replaced by a
    // constant reds HERE. See the file header for the eight-mutant measurement that made
    // this pin necessary; the arithmetic-only drop battery is ES-0's and stays there.
    const { worldState: held } = openForeignGuestHold({
      worldState: mintMission(litWorld()).worldState,
      hold: covertHold(12),
    });
    const drops = {
      hostRung: ['a rival host instead of a hostile one', { regionalGraph: RIVAL_GRAPH }],
      securityEff01: ['a bought watch (the J-ES-3 drag)', { targetItem: BOUGHT_WATCH_TOWN }],
      orderBand: ['a commune whose rule of law is looser', {
        targetItem: { ...SNAPSHOT.settlements[1], powerStructure: { government: 'Free city commune' } },
      }],
      stressLoad01: ['a town under no active conditions', {
        targetItem: { ...SNAPSHOT.settlements[1], activeConditions: [] },
      }],
      hasUnderways: ['a clandestine institution to shelter him', {
        targetItem: { ...SNAPSHOT.settlements[1], institutions: [UNDERWAYS_INSTITUTION] },
      }],
      hasInsideAsset: ['a live asset inside the target', { hasInsideAsset: true }],
      wariness01: ['a court that has just caught a spy', { worldState: held }],
      competence01: ['a home with a real guild to train him', {
        homeItem: { ...SNAPSHOT.settlements[0], thievesGuildStrength: 0.9 },
      }],
      stops: ['a third stop on the itinerary', {
        dwell: { settlementId: 'westmarch', stopIndex: 3, intervalIdx: 0 },
      }],
      intervalIdx: ['a rooted fourth interval', {
        dwell: { settlementId: 'westmarch', stopIndex: 1, intervalIdx: 3 },
      }],
    };
    const reference = gatherFactors();
    expect(catchChance01(reference)).toBeGreaterThan(0);
    for (const [term, [why, patch]] of Object.entries(drops)) {
      const moved = gatherFactors(patch);
      // (a) THE GATHERED TERM MOVED. This is the arm a constant cannot survive.
      expect(moved[term], `${term} is a DEAD TERM: ${why} did not move the gathered value`)
        .not.toBe(reference[term]);
      // (b) …and it REACHES THE CHANCE. A term gathered and then ignored is dead too.
      expect(catchChance01(moved), `${term} moves in the record but not in the chance`)
        .not.toBe(catchChance01(reference));
    }
  });

  test('the single dip (J-ES-3) is real: the patronage drag moves a fixture chance', () => {
    const clean = gatherFactors();
    // THE MUTANT: the same town with a BOUGHT WATCH. `patronageSecurityDrag` counts
    // compromised security institutions, so a captured watch-house must lower effective
    // security — and it must do so through the ONE dragged read, never twice.
    //
    // ⚠ THE SHAPE IS `impairments`, AND IT IS THE WHOLE PIN. This fixture used to carry
    // `corruption: { compromised: true, revealed: true }`, which `compromisedSecurityInstitutions`
    // NEVER READS — it filters `inst.impairments` on `imp.type === 'corruption'`. Both sides
    // therefore gathered the identical record, and with `toBeLessThanOrEqual` on both
    // comparisons the pin was a function compared against itself: deleting the entire single
    // dip left the whole battery green (measured). The values below are EXACT and the
    // inequalities are STRICT, so equality can never read as a pass again.
    const bought = gatherFactors({ targetItem: BOUGHT_WATCH_TOWN });
    expect(clean.securityEff01, 'undragged effective security').toBe(0.4);
    expect(bought.securityEff01, 'one compromised watch-house, dragged exactly once').toBe(0.34);
    expect(bought.securityEff01).toBeLessThan(clean.securityEff01);
    expect(catchChance01(bought)).toBe(0.0402);
    expect(catchChance01(clean)).toBe(0.0473);
    expect(catchChance01(bought)).toBeLessThan(catchChance01(clean));
    // The dip is applied ONCE: the bought town's security is the clean town's times the one
    // patronage drag, and the catch leaf adds no second criminal discount of its own.
    expect(bought.securityEff01).toBe(clean.securityEff01 * (1 - PATRONAGE_TUNING.dragPerInstitution));
  });

  test("the tell's absent term is DECLARED on every reading, never folded as a silent zero", () => {
    const { worldState } = mintMission(litWorld());
    const row = stage(worldState, 13).detections[0];
    // ⏱ ES-5 MOVED THIS ASSERTION, and the move is the point rather than a maintenance
    // edit. ES-2 shipped with `overdueForeignNotables` absent because the visibility
    // predicate did not exist; it does now (espionageWariness.js) and the term is live —
    // `overdueNotables` on the same factor record is its receipt. What remains absent are
    // DIFFERENT things of §3.8 — the union ARM (b) and the weight over it — both named in
    // that leaf's own register for one measured reason, the grain mismatch written out in
    // its header. The declaration never emptied.
    // POINT, DON'T RESTATE: this asserts the LEAF'S OWN export travelled here intact rather
    // than re-typing its members, so a term added or dropped there cannot leave this
    // detection receipt pinned against a set nobody produces any more.
    expect(row.warinessTermsAbsent).toBe(TELL_TERMS_ABSENT);
    expect(TELL_TERMS_ABSENT.length).toBeGreaterThan(0);
    expect(row).toHaveProperty('overdueNotables');
    // The half that IS lawful is live: a court that just caught a spy checks harder.
    expect(recentCovertHolds({ worldState, targetId: 'westmarch', tick: 13 })).toBe(0);
    const held = openForeignGuestHold({ worldState, hold: covertHold(12) });
    expect(held.reason).toBe('opened');
    expect(recentCovertHolds({ worldState: held.worldState, targetId: 'westmarch', tick: 13 })).toBe(1);
    // …and only within the lookback, so an ancient arrest is not a standing alarm.
    expect(recentCovertHolds({
      worldState: held.worldState,
      targetId: 'westmarch',
      tick: 13 + GAUNTLET_TUNING.COVERT_HOLD_LOOKBACK_TICKS + 1,
    })).toBe(0);
  });
});

/** A lawful `caught_spying` custody row at westmarch. Used by the round-trip and the tell. */
function covertHold(heldSinceTick) {
  return {
    schemaVersion: 1,
    id: 'foreign_guest_hold:es2',
    npcId: 'npc.reeve',
    errandId: 'errand.es2',
    encounterId: 'encounter.es2',
    captorId: 'westmarch',
    venueId: 'westmarch',
    venueRef: { kind: 'settlement', settlementId: 'westmarch' },
    heldSinceTick,
    cause: COVERT_HOLD_CAUSE,
    continuation: {
      schemaVersion: 1,
      resumeState: 'travelling',
      journey: 'outbound',
      destinationId: 'irontown',
      interruptedTick: heldSinceTick,
      positionRef: {
        journey: 'outbound', legIndex: 0, fromId: 'ashford', toId: 'westmarch', progressBand: 'arrived',
      },
      journeyLegs: [{
        fromId: 'ashford',
        toId: 'westmarch',
        departTick: 10,
        arrivalTick: 12,
        journey: 'outbound',
        routeRef: { id: 'road.north', name: 'North Road' },
      }, {
        fromId: 'westmarch',
        toId: 'irontown',
        departTick: 20,
        arrivalTick: 22,
        journey: 'outbound',
        routeRef: { id: 'road.north', name: 'North Road' },
      }],
      expectedReturnTick: 40,
    },
  };
}

describe('ES-2 — the covert custody cause and the two ransom arms', () => {
  test('the one covert cause has ONE meaning across all three of its spellings', () => {
    // `ransomClaim.js` re-declares the word rather than importing it, for the reason its own
    // header gives about `RANSOM_CLAIM_KIND`: a leaf that promises no world state may not
    // import a world reader for one string. This is the pin that recorded exception owes —
    // it imports BOTH and asserts they cannot fork, and the gauntlet's borrow joins it.
    expect(RANSOM_COVERT_HOLD_CAUSE).toBe(FOREIGN_GUEST_HOLD_COVERT_CAUSE);
    expect(COVERT_HOLD_CAUSE).toBe(FOREIGN_GUEST_HOLD_COVERT_CAUSE);
    expect(FOREIGN_GUEST_HOLD_CAUSES).toContain(FOREIGN_GUEST_HOLD_COVERT_CAUSE);
    // …and the cause the DWELL ARM actually branches on is that same word, proven by
    // driving the branch rather than by reading the source.
    const spyBand = (cause) => ransomDwellRead({
      hold: { npcId: 'n', captorId: 'c', heldSinceTick: 0, cause }, tick: 3,
    }).band;
    expect(spyBand(RANSOM_COVERT_HOLD_CAUSE)).toBe('fresh');
    expect(spyBand('parlay_refused')).toBe('settled');
  });

  test('`caught_spying` joins the closed cause vocabulary and ROUND-TRIPS through real serialization', () => {
    expect(FOREIGN_GUEST_HOLD_CAUSES).toContain(COVERT_HOLD_CAUSE);
    const opened = openForeignGuestHold({ worldState: litWorld(), hold: covertHold(12) });
    expect(opened.reason).toBe('opened');
    // THROUGH REAL JSON, never an in-memory probe: a shared reference and a copy are
    // indistinguishable in memory, and the alias trap has bitten this estate before.
    const reloaded = JSON.parse(JSON.stringify(opened.worldState));
    const rows = foreignGuestHoldsOf(reloaded);
    expect(rows).toHaveLength(1);
    expect(rows[0].cause).toBe(COVERT_HOLD_CAUSE);
    expect(JSON.stringify(rows[0])).toBe(JSON.stringify(opened.hold));
    // A cause the vocabulary does not carry still nulls the whole row — the set stayed CLOSED.
    expect(normalizeForeignGuestHold({ ...covertHold(12), cause: 'caught_snooping' })).toBe(null);
    // anchored: the same builder one line above produced a NON-null row, so a null here
    // measures the closed set rather than a broken fixture.
    expect(normalizeForeignGuestHold(covertHold(12))).not.toBe(null);
  });

  test('J-ES-15b — a caught spy sits twice as long before the ransom gate opens', () => {
    const spy = (tick) => ransomDwellRead({
      hold: { npcId: 'n', captorId: 'c', heldSinceTick: 0, cause: COVERT_HOLD_CAUSE }, tick,
    });
    const guest = (tick) => ransomDwellRead({
      hold: { npcId: 'n', captorId: 'c', heldSinceTick: 0, cause: 'parlay_refused' }, tick,
    });
    expect(RANSOM_TUNING.DWELL_CUTS_COVERT).toEqual([4, 16]);
    // ALL THREE BANDS REACHABLE UNDER THE SHIFTED CUTS — the dead-band law, executed.
    expect([3, 4, 15, 16].map((t) => spy(t).band)).toEqual(['fresh', 'settled', 'settled', 'protracted']);
    expect([1, 2, 7, 8].map((t) => guest(t).band)).toEqual(['fresh', 'settled', 'settled', 'protracted']);
    // The gate itself moves, which is the arm's whole point.
    expect(spy(2).open).toBe(false);
    expect(guest(2).open).toBe(true);
    expect(spy(4).open).toBe(true);
  });

  test('J-ES-15a — the covert lift is ONE band, capped, and readable off the row alone', () => {
    const { errand } = mintMission(litWorld());
    const { errand: plain } = mintMission(litWorld(), { covert: false });
    expect(ransomWorthBandFromErrand(plain)).toBe('notable');
    expect(ransomWorthBandFromErrand(errand)).toBe('principal');
    // A common traveller lifts to notable; a principal cannot lift past the ceiling.
    expect(ransomWorthBandFromErrand({ purpose: 'self_parlay' })).toBe('common');
    expect(ransomWorthBandFromErrand({ purpose: 'self_parlay', covert: { product: 'confirm' } }))
      .toBe('notable');
    expect(ransomWorthBandFromErrand({ termSheet: { id: 't' }, covert: { product: 'confirm' } }))
      .toBe('principal');
    // THE SIGNATURE IS THE ENFORCEMENT (CR-WIRE-A): one argument, no world to reach into.
    expect(ransomWorthBandFromErrand.length).toBe(1);
  });
});

describe('ES-2 — gather or govern, and the captor', () => {
  test('every rooted stay TERMINATES — and MEASURED, the hard cap is load-bearing at ES-2', () => {
    const factors = {
      hostRung: 1,
      securityEff01: 0.5,
      orderBand: 'adequate',
      stressLoad01: 0,
      hasUnderways: false,
      hasInsideAsset: false,
      wariness01: 0,
      competence01: 0,
      stops: 1,
    };
    const lastGathered = (appetite01) => {
      let last = -1;
      for (let intervalIdx = 0; intervalIdx <= ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP; intervalIdx += 1) {
        const read = gatherOrGovernRead({
          dwell: { intervalIdx }, appetite01, demandMet: false, factors,
        });
        if (read.choice !== 'gather') break;
        last = intervalIdx;
      }
      return last;
    };
    // THE SOFT BOUND IS REAL: a timid operative walks earlier than a bold one, because the
    // ramp raises the NEXT interval's odds past his appetite sooner.
    const timid = lastGathered(0.035);
    const bold = lastGathered(0.05);
    expect(timid).toBeLessThan(bold);
    expect(bold).toBeLessThan(ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP);

    // ⚠⚠ MEASURED, AND RECORDED RATHER THAN PAPERED OVER (R-ES2-2). §3.4b argues the stay
    // is self-limiting because "the ramp and the register both climb monotonically while
    // appetite is fixed". At ES-2 only ONE of those two exists: the promotion register is
    // Q1-gated to ES-5 and declared absent above. And `dwellRamp` PLATEAUS at its top band,
    // so past interval 3 the risk stops climbing — which means an operative whose appetite
    // clears the plateau gathers until `DWELL_RESAMPLE_CAP` stops him. The cap is therefore
    // LOAD-BEARING today, not a backstop, and it is the reachable arm below rather than a
    // dead band. ES-5's register is what makes the soft bound total.
    const plateau = catchChance01({ ...factors, intervalIdx: ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP });
    expect(plateau).toBe(catchChance01({ ...factors, intervalIdx: ESPIONAGE_TUNING.DWELL_RAMP.length - 1 }));
    expect(lastGathered(plateau + 0.01)).toBe(ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP - 1);
    expect(gatherOrGovernRead({
      dwell: { intervalIdx: ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP },
      appetite01: 1,
      demandMet: false,
      factors,
    }).reason).toBe('resample_cap');

    // The risk it decides on is the NEXT interval's, so a spy never stays one band past the
    // odds he actually refused.
    const read = gatherOrGovernRead({
      dwell: { intervalIdx: 1 }, appetite01: 1, demandMet: false, factors,
    });
    expect(read.dwellRisk01).toBe(catchChance01({ ...factors, intervalIdx: 2 }));
    expect(read.termsAbsent).toEqual(['promotionRisk']);
  });

  test('a met demand and the hard cap are both first-class reasons', () => {
    expect(gatherOrGovernRead({ dwell: { intervalIdx: 0 }, appetite01: 1, demandMet: true }).reason)
      .toBe('demand_met');
    expect(gatherOrGovernRead({
      dwell: { intervalIdx: ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP }, appetite01: 1, demandMet: false,
    }).reason).toBe('resample_cap');
  });

  test('the captor arm is LIVE (CR-ES-3 landed at ES-0) and every rung is reachable', () => {
    const read = (orderWord, natureWord) => captorLeniencyRead({
      doctrine: readEspionageDoctrine({ courtId: 'westmarch', orderWord, natureWord }),
    }).leniency;
    expect(read('lawful', 'benevolent')).toBe('clean');
    expect(read('lawless', 'malicious')).toBe('swings');
    expect(read('balanced', 'malicious')).toBe('hard');
    expect(read('balanced', 'balanced')).toBe('ordinary');
    expect(captorLeniencyRead({ doctrine: null }).leniency).toBe('ordinary');
    // Every receipt is WORDS. A doctrine receipt that spoke a coefficient would breach L5.
    for (const pair of [['lawful', 'benevolent'], ['lawless', 'malicious'], ['balanced', 'malicious']]) {
      const { receipt } = captorLeniencyRead({
        doctrine: readEspionageDoctrine({ courtId: 'x', orderWord: pair[0], natureWord: pair[1] }),
      });
      // THE LIVENESS ANCHOR, and it is not decoration: an absent or empty receipt carries no
      // digit either, so the no-digit assertion below would outlive the very regression it
      // exists to catch. This says the receipt is a real finished sentence FIRST.
      expect(receipt, `${pair.join('/')} must receipt in words`).toMatch(/^[A-Z][^]{20,}\.$/);
      // The reason has to sit on the line the reader of the assertion sees — the walker's
      // lookback is exactly one line, and a two-line comment silently fails to exempt.
      // anchored: the sentence-shape pin two lines up reds first if the receipt drifts away.
      expect(receipt).not.toMatch(/\d/);
    }
  });
});

describe('ES-2 — the stage refuses rather than inventing', () => {
  test('a stop the snapshot cannot name is SKIPPED, receipted, and never rolled', () => {
    const { worldState } = mintMission(litWorld());
    const blind = advanceEspionageGauntlet({
      worldState, tick: 13, snapshot: { settlements: [] }, regionalGraph: HOSTILE_GRAPH,
    });
    expect(blind.detections).toEqual([]);
    expect(blind.skipped).toEqual([
      { errandId: envoyErrandsOf(worldState)[0].id, stopId: 'westmarch', reason: 'unreadable_stop' },
    ]);
  });

  test('every detection carries the custody STOP-REPORT rather than a silent absence', () => {
    const { worldState } = mintMission(litWorld());
    const row = stage(worldState, 18).detections[0];
    expect(row.caught).toBe(true);
    expect(row.custodyWritten).toBe(false);
    expect(row.custodyCause).toBe(COVERT_HOLD_CAUSE);
    expect(row.custodyBlockedReason).toBe('encounter_required_by_errand_dto');
    // The capture is COMPUTED and the world is untouched: no hold appeared anywhere.
    expect(foreignGuestHoldsOf(worldState)).toEqual([]);
    // anchored: the same accessor returns a ONE-row array in the round-trip pin above, so an
    // empty array here measures "the stage wrote nothing", not a broken reader.
    expectAbsentWithAnchor(
      Object.keys(row),
      'holdId',
      'custodyBlockedReason',
      'a detection must not carry a custody id it did not open',
    );
  });

  test('the roll key is built by CONCATENATION and survives an id full of separators', () => {
    expect(stayDetectionKey('a.b:c|d', 2, 3)).toBe('es.stay.a.b:c|d.2.3');
    expect(stayDetectionRoll({
      errandId: 'a.b:c|d',
      dwell: { stopIndex: 2, intervalIdx: 3 },
      factors: { hostRung: 0 },
    })).toMatchObject({ caught: false, catch01: 0, key: 'es.stay.a.b:c|d.2.3' });
  });
});
