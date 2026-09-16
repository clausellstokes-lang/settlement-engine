/**
 * ransomClaimWr7d.test.js — WR-7d's ransom claim, its dwell gate, and K.7.
 *
 * Amendment O: captivity becomes a price, the price is gated on how long the
 * man has been held, the claim rides I2's reparations shape with a PERSON
 * subject, and BOTH the demand and the answer travel under law M.
 *
 * THE HOLD FIXTURES ARE REAL. Every hold row in this file is produced by
 * `foreignGuestHold.js`'s own normalizer — WR-7b's one hold writer — so the
 * dwell gate is reading `heldSinceTick` off the artifact the engine really
 * persists, not a hand-written stand-in that might have the wrong shape.
 *
 * The three K.7 shapes are pinned here, all three reachable, including the
 * cruellest: a demand that was killed on the road, so a living man stays dead
 * in his own court's belief.
 *
 * @enforced-by this file
 */
import { describe, expect, it } from 'vitest';

import {
  RANSOM_CLAIM_KIND,
  RANSOM_DWELL_BANDS,
  RANSOM_SILENCE_SHAPES,
  RANSOM_SUBJECT_KIND,
  RANSOM_TUNING,
  mintRansomClaim,
  ransomAgainstSilence,
  ransomDwellRead,
  ransomMessageLegs,
} from '../../src/domain/worldPulse/ransomClaim.js';
import { normalizeForeignGuestHold } from '../../src/domain/worldPulse/foreignGuestHold.js';
import { COALITION_REIMBURSEMENT_KIND } from '../../src/domain/worldPulse/warCoalitionExpenditure.js';
import { NAMED_PERSON_TRANSIT_TUNING } from '../../src/domain/worldPulse/namedPersonTransit.js';

/**
 * A real hold row, through WR-7b's own normalizer — including the full
 * interruption capsule, because a hold row that would not survive the writer
 * is not a hold and would prove nothing about a gate that reads one.
 */
function hold(patch = {}) {
  const row = normalizeForeignGuestHold({
    schemaVersion: 1,
    id: 'foreign_guest_hold.iron.envoy.10',
    npcId: 'npc.envoy.reed.ilsa',
    errandId: 'envoy_errand.reed.iron.10',
    encounterId: 'encounter.field.iron.reed.12',
    captorId: 'iron',
    venueId: 'iron',
    venueRef: { kind: 'settlement', settlementId: 'iron' },
    heldSinceTick: 10,
    cause: 'war_continuation',
    continuation: {
      schemaVersion: 1,
      resumeState: 'returning',
      journey: 'return',
      destinationId: 'reed',
      interruptedTick: 9,
      positionRef: {
        journey: 'return', legIndex: 0, fromId: 'iron', toId: 'reed', progressBand: 'underway',
      },
      journeyLegs: [{
        fromId: 'iron',
        toId: 'reed',
        departTick: 8,
        arrivalTick: 14,
        journey: 'return',
        routeRef: { id: 'road.iron.reed' },
      }],
      expectedReturnTick: 30,
      scheduledHomeTick: 30,
    },
    ...patch,
  });
  expect(row, 'the hold fixture must survive WR-7b\'s own normalizer').toBeTruthy();
  return row;
}

describe('WR-7d — the dwell gate reads the hold ledger and nothing else', () => {
  it('will not price a man the day he is taken, and opens once he has settled', () => {
    const row = hold();
    // Taken this tick: there is no ransom yet, because there is no captivity yet.
    expect(ransomDwellRead({ hold: row, tick: 10 }))
      .toMatchObject({ open: false, dwellTicks: 0, band: 'fresh', reason: 'dwell_too_short' });
    const [firstCut, secondCut] = RANSOM_TUNING.DWELL_CUTS;
    expect(ransomDwellRead({ hold: row, tick: 10 + firstCut }))
      .toMatchObject({ open: true, band: 'settled', reason: 'dwell_met' });
    expect(ransomDwellRead({ hold: row, tick: 10 + secondCut }))
      .toMatchObject({ open: true, band: 'protracted' });
    // The dwell is DERIVED on every read; nothing stores it.
    expect(ransomDwellRead({ hold: row, tick: 31 }).dwellTicks).toBe(21);
    expect(RANSOM_DWELL_BANDS).toEqual(['fresh', 'settled', 'protracted']);
  });

  it('FAILS CLOSED on an unreadable hold rather than guessing a captivity', () => {
    // A price on a person nobody can prove is held is the one thing this gate
    // must never mint, so every unreadable shape shuts it.
    for (const bad of [
      undefined, null, {}, { heldSinceTick: 10 },
      { npcId: 'npc.a', captorId: 'iron' },
      { npcId: 'npc.a', captorId: 'iron', heldSinceTick: -1 },
      { npcId: 'npc.a', captorId: 'iron', heldSinceTick: 1.5 },
    ]) {
      const read = ransomDwellRead({ hold: bad, tick: 40 });
      expect(read.open, JSON.stringify(bad)).toBe(false);
      expect(read.reason).toBe('unreadable_hold');
    }
    // A tick before the hold opened is a clock running backwards, not a dwell.
    expect(ransomDwellRead({ hold: hold(), tick: 9 }).reason).toBe('hold_not_yet_open');
  });
});

describe('WR-7d — the claim rides I2\'s shape with a PERSON subject', () => {
  it('mints the reparations kind itself, not a second ransom vocabulary', () => {
    // THE ONE-SPELLING PIN. `warCoalitionExpenditure` owns this kind and reads
    // world state to do its work, so the leaf re-declares rather than imports.
    // This test imports BOTH and asserts they are the same string, which is
    // what makes refusing the import cost nothing.
    expect(RANSOM_CLAIM_KIND).toBe(COALITION_REIMBURSEMENT_KIND);
    const minted = mintRansomClaim({
      hold: hold(), tick: 20, homeId: 'reed', worthBand: 'notable',
    });
    expect(minted.reason).toBe('claimed');
    expect(minted.claim).toMatchObject({
      kind: COALITION_REIMBURSEMENT_KIND,
      claimantId: 'iron',
      debtorId: 'reed',
      atTick: 20,
    });
    // The subject is the entire difference between this and a season's
    // reparations: the thing owed for is a man, and he is named.
    expect(minted.claim.subject).toMatchObject({
      kind: RANSOM_SUBJECT_KIND,
      npcId: 'npc.envoy.reed.ilsa',
      errandId: 'envoy_errand.reed.iron.10',
      holdCause: 'war_continuation',
      dwellBand: 'protracted',
      worthBand: 'notable',
    });
    expect(minted.claim.claim01).toBeGreaterThan(0);
  });

  it('prices a longer captivity higher, and never above the ceiling', () => {
    const at = (tick, worthBand) => mintRansomClaim({
      hold: hold(), tick, homeId: 'reed', worthBand,
    }).claim.claim01;
    // The same man is worth more after a season than after a fortnight.
    expect(at(20, 'notable')).toBeGreaterThan(at(12, 'notable'));
    expect(at(20, 'principal')).toBeGreaterThan(at(20, 'common'));
    for (const worth of ['common', 'notable', 'principal']) {
      expect(at(500, worth), worth).toBeLessThanOrEqual(RANSOM_TUNING.CLAIM_CEILING_01);
    }
  });

  it('refuses to mint before the gate, to a captor\'s own self, or on a broken demand', () => {
    expect(mintRansomClaim({ hold: hold(), tick: 10, homeId: 'reed', worthBand: 'notable' }).reason)
      .toBe('dwell_too_short');
    // A captor ransoming a man to himself is a release wearing a price tag.
    expect(mintRansomClaim({ hold: hold(), tick: 20, homeId: 'iron', worthBand: 'notable' }).reason)
      .toBe('captor_is_home');
    expect(mintRansomClaim({ hold: hold(), tick: 20, homeId: 'reed', worthBand: 'priceless' }).reason)
      .toBe('invalid_demand');
    expect(mintRansomClaim({ hold: hold(), tick: 20, homeId: '', worthBand: 'notable' }).claim)
      .toBeNull();
  });
});

describe('WR-7d — both halves travel (law M)', () => {
  const claimFor = () => mintRansomClaim({
    hold: hold(), tick: 20, homeId: 'reed', worthBand: 'notable',
  }).claim;

  it('mints the demand and the answer TOGETHER, each at the one-week floor', () => {
    const legs = ransomMessageLegs({ claim: claimFor(), departTick: 20, venueId: 'iron' });
    expect(legs.minted).toBe(true);
    // The shape itself forbids a court that hears instantly: there is no way to
    // get a demand leg out of this function without the answer leg beside it.
    expect(legs.demandLeg).toMatchObject({ fromId: 'iron', toId: 'reed', departTick: 20 });
    expect(legs.answerLeg).toMatchObject({ fromId: 'reed', toId: 'iron' });
    // Law M's floor, through the ONE transit kernel — a message cannot outrun
    // the person carrying it however cheaply the caller prices the road.
    const floor = NAMED_PERSON_TRANSIT_TUNING.MIN_LEG_TICKS;
    expect(legs.demandLeg.arrivalTick - legs.demandLeg.departTick).toBeGreaterThanOrEqual(floor);
    expect(legs.answerLeg.arrivalTick - legs.answerLeg.departTick).toBeGreaterThanOrEqual(floor);
    // The answer cannot start before the demand lands.
    expect(legs.answerLeg.departTick).toBe(legs.demandLeg.arrivalTick);
    expect(legs.answerDueTick).toBe(legs.answerLeg.arrivalTick);
    // A zero-week road still costs a week.
    const free = ransomMessageLegs({
      claim: claimFor(), departTick: 20, venueId: 'iron', outboundWeeks: 0, returnWeeks: 0,
    });
    expect(free.demandLeg.arrivalTick).toBe(21);
    expect(free.answerLeg.arrivalTick).toBe(22);
  });

  it('prices a hard road longer, and refuses a route it cannot read', () => {
    const easy = ransomMessageLegs({
      claim: claimFor(), departTick: 20, venueId: 'iron', outboundWeeks: 2,
    });
    const hard = ransomMessageLegs({
      claim: claimFor(), departTick: 20, venueId: 'iron', outboundWeeks: 2, gradeMultiplier: 3,
    });
    expect(hard.demandLeg.arrivalTick).toBeGreaterThan(easy.demandLeg.arrivalTick);
    expect(ransomMessageLegs({ claim: claimFor(), departTick: 20, venueId: 'reed' }).reason)
      .toBe('invalid_route');
    expect(ransomMessageLegs({ claim: { kind: 'tribute' }, departTick: 20, venueId: 'iron' }).reason)
      .toBe('not_a_ransom_claim');
    expect(ransomMessageLegs({ claim: claimFor(), departTick: -1, venueId: 'iron' }).minted)
      .toBe(false);
  });
});

describe('WR-7d — K.7, all three shapes, and the jewel among them', () => {
  const window = { expectedReturnTick: 30, heldAlive: true };
  const arriving = (arrivalTick) => ({ fromId: 'iron', toId: 'reed', departTick: 25, arrivalTick });

  it('says nothing at all while the window is still open', () => {
    // A court whose envoy is not yet late has inferred nothing, so there is no
    // shape here to report — silence before the window is just travel.
    expect(ransomAgainstSilence({ ...window, tick: 30, demandLeg: arriving(40), demandLost: false }))
      .toMatchObject({ shape: '', reason: 'window_still_open' });
  });

  it('SILENCE MISREAD: the man is alive, the demand is on the road, the court mourns', () => {
    // THE JEWEL. Nobody has lied. The road is simply longer than the court's
    // patience, and a war escalates on a belief that is false and honest.
    const read = ransomAgainstSilence({
      ...window, tick: 34, demandLeg: arriving(40), demandLost: false,
    });
    expect(read).toMatchObject({
      shape: 'silence_misread',
      reason: 'demand_still_travelling',
      inferenceStands: true,
      demandArrived: false,
      subjectAlive: true,
    });
    expect(read.silentTicks).toBe(4);
  });

  it('THE DEMAND CORRECTS THE INFERENCE, by existing at all', () => {
    // A captor's demand is proof of life he never meant as a kindness.
    const read = ransomAgainstSilence({
      ...window, tick: 41, demandLeg: arriving(40), demandLost: false,
    });
    expect(read).toMatchObject({
      shape: 'demand_corrects_inference',
      inferenceStands: false,
      demandArrived: true,
      correctedBy: 'iron',
      subjectAlive: true,
    });
  });

  it('THE DEMAND IS LOST AND THE MISREADING STANDS — the cruellest arm', () => {
    // The correction existed and never arrived. The court goes on believing its
    // living man dead, and that is a first-class result rather than a failure.
    const read = ransomAgainstSilence({
      ...window, tick: 99, demandLeg: arriving(40), demandLost: true,
    });
    expect(read).toMatchObject({
      shape: 'demand_lost_misreading_stands',
      reason: 'demand_never_came',
      inferenceStands: true,
      demandArrived: false,
      subjectAlive: true,
    });
    // Every one of the three shapes this module can produce is reachable above.
    expect(new Set(RANSOM_SILENCE_SHAPES)).toEqual(new Set([
      'silence_misread', 'demand_corrects_inference', 'demand_lost_misreading_stands',
    ]));
  });

  it('refuses to read a window it cannot understand', () => {
    // No window at all.
    expect(ransomAgainstSilence({ tick: 40, heldAlive: true, demandLost: false }).reason)
      .toBe('invalid_window');
    // An unstated fate is not a fate: "we do not know whether he lives" may not
    // default to either answer, so the read refuses.
    expect(ransomAgainstSilence({
      expectedReturnTick: 30, tick: 40, demandLost: false,
    }).reason).toBe('invalid_window');
    expect(ransomAgainstSilence({ ...window, tick: 40, demandLost: 'yes' }).shape).toBe('');
  });
});
