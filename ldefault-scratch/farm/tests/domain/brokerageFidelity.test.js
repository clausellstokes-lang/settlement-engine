/**
 * brokerageFidelity.test.js — [W-I INFORMATION BROKERAGES] I2, the belief-derivation
 * fidelity term (docs/DESIGN_INFORMATION_BROKERAGES.md §5 secondary, constitutional Law 1,
 * §10 divergence envelope).
 *
 * FOUR CLAIMS, and the first is constitutional:
 *
 *   1. DISTANCE IS NEVER ABOLISHED. The floor is bounded by the authored ceiling AND
 *      attenuated by news distance, so no arrangement of houses reaches certainty and a
 *      far subject is always read less sharply than a near one. Both halves are swept over
 *      every house and a range of distances rather than asserted at one point.
 *   2. THE TERM REACHES THE BELIEF ENGINE. A lit world and a dark world reconcile the SAME
 *      reports differently through the real advanceBeliefMaps, so the floor is wired and
 *      not merely exported.
 *   3. THE DIVERGENCE ENVELOPE. Over a seeded corpus of matched reconciliations, the
 *      brokerage observer's belief is closer to the truth than the matched observer's, on
 *      the mean, and never further away in any individual case.
 *   4. THE DARK PATH IS BYTE-IDENTICAL BY OBJECT IDENTITY, not merely by equal values.
 */
import { describe, expect, it } from 'vitest';

import {
  BELIEF_FIDELITY_CHANNELS,
  BROKERAGE_FIDELITY_TUNING,
  beliefChannelCompetence,
  brokerageAccuracyFloor01,
  composeBrokerageSight,
  makeBrokerageFloorFn,
} from '../../src/domain/worldPulse/brokerageFidelity.js';
import { brokerageHousesOf, houseChannelCompetence } from '../../src/domain/worldPulse/brokerageStamps.js';
import { INFORMATION_BROKERAGE_TUNING, INFORMATION_CHANNELS } from '../../src/data/informationBrokerageTuning.js';
import { advanceBeliefMaps, reconcileBelief, GOVERNING_SEAT_KEY, BELIEF_TUNING } from '../../src/domain/worldPulse/beliefMap.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const EXCHANGE = Object.freeze({
  name: "Chroniclers' exchange", tags: ['legal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed'],
});
const POST = Object.freeze({
  name: 'Listening post', tags: ['legal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query'],
});
const MARKET = Object.freeze({
  name: 'Whisper market', tags: ['criminal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'],
});
const ROOKERY = Object.freeze({
  name: 'Rookery', tags: ['criminal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query'],
});
const SMITH = Object.freeze({ name: 'Blacksmith', tags: ['crafts'] });

const ROSTERS = Object.freeze([[POST], [EXCHANGE], [ROOKERY], [MARKET], [EXCHANGE, MARKET]]);
const DISTANCES = Object.freeze([0, 1, 2, 3, 5, 8, 13, 40]);

// ── Law 1 ───────────────────────────────────────────────────────────────────

describe('[W-I I2] Law 1: a brokerage bends the distance curve and never abolishes it', () => {
  it('never reaches the authored ceiling, and never reaches certainty, at any distance', () => {
    const ceiling = INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING;
    expect(ceiling).toBeLessThan(1);
    const cases = ROSTERS.flatMap((roster) => DISTANCES.map((delay) => ({ roster, delay })));
    const failures = collectSeedFailures(cases, ({ roster, delay }) => {
      const floor = brokerageAccuracyFloor01(beliefChannelCompetence(brokerageHousesOf(roster)), delay);
      expect(floor, `${roster.map((r) => r.name).join('+')} at ${delay}`).toBeLessThanOrEqual(ceiling);
      expect(floor).toBeLessThan(1);
      expect(floor).toBeGreaterThanOrEqual(0);
    });
    expectNoSeedFailures(failures, 'no house at any distance reaches the ceiling');
  });

  it('is monotone non-increasing in distance, and STRICTLY lower far away than near', () => {
    const failures = collectSeedFailures(ROSTERS, (roster) => {
      const competence = beliefChannelCompetence(brokerageHousesOf(roster));
      const floors = DISTANCES.map((delay) => brokerageAccuracyFloor01(competence, delay));
      for (let i = 1; i < floors.length; i += 1) {
        expect(floors[i], `${roster.map((r) => r.name).join('+')} rose with distance`).toBeLessThanOrEqual(floors[i - 1]);
      }
      // The STRICT half is what "never abolished" actually means: a house that read every
      // distance equally would pass monotonicity and still be omniscient in practice.
      expect(floors[floors.length - 1], 'the far read is no sharper than the near one')
        .toBeLessThan(floors[0]);
    });
    expectNoSeedFailures(failures, 'every house reads a far subject less sharply than a near one');
  });

  it('grants no floor at all where no house stands', () => {
    expect(beliefChannelCompetence(brokerageHousesOf([SMITH]))).toBe(0);
    expect(brokerageAccuracyFloor01(0, 0)).toBe(0);
    expect(brokerageAccuracyFloor01(beliefChannelCompetence(brokerageHousesOf([])), 0)).toBe(0);
  });

  it('fails closed on unreadable inputs rather than inventing a floor', () => {
    for (const bad of [undefined, null, NaN, 'high', {}]) expect(brokerageAccuracyFloor01(bad, 0)).toBe(0);
    // An unreadable DISTANCE prices as zero distance, which is the near read, never a
    // higher-than-ceiling one.
    const competence = beliefChannelCompetence(brokerageHousesOf([EXCHANGE]));
    for (const bad of [undefined, null, NaN, 'far']) {
      expect(brokerageAccuracyFloor01(competence, bad)).toBe(brokerageAccuracyFloor01(competence, 0));
    }
  });
});

// ── The term reads only the channels a belief actually carries ─────────────

describe('[W-I I2] the belief term reads only the channels a belief carries', () => {
  it('is the mean over war, politics and faith, and ignores trade, crime and persons', () => {
    expect([...BELIEF_FIDELITY_CHANNELS]).toEqual(['war', 'politics', 'faith']);
    const houses = brokerageHousesOf([MARKET]);
    const mean = BELIEF_FIDELITY_CHANNELS.reduce((sum, c) => sum + houseChannelCompetence(houses, c), 0)
      / BELIEF_FIDELITY_CHANNELS.length;
    expect(beliefChannelCompetence(houses)).toBeCloseTo(mean, 10);
    // The covert guild's crime reach is the estate's highest competence, and it must NOT
    // launder into a sharper read of a neighbour's army. This is the anchored contrast:
    // its crime number is the biggest on the table, its belief term is the smaller of the
    // two guilds.
    expect(houseChannelCompetence(houses, 'crime')).toBeGreaterThan(
      houseChannelCompetence(brokerageHousesOf([EXCHANGE]), 'trade'),
    );
    expect(beliefChannelCompetence(houses)).toBeLessThan(beliefChannelCompetence(brokerageHousesOf([EXCHANGE])));
  });

  it('the guild form reads a belief more sharply than the house it subsumes', () => {
    expect(beliefChannelCompetence(brokerageHousesOf([EXCHANGE])))
      .toBeGreaterThan(beliefChannelCompetence(brokerageHousesOf([POST])));
    expect(beliefChannelCompetence(brokerageHousesOf([MARKET])))
      .toBeGreaterThan(beliefChannelCompetence(brokerageHousesOf([ROOKERY])));
  });

  it('every channel in the belief term is a member of the closed channel vocabulary', () => {
    for (const channel of BELIEF_FIDELITY_CHANNELS) expect(INFORMATION_CHANNELS).toContain(channel);
    expect(BROKERAGE_FIDELITY_TUNING.FIDELITY_CEILING).toBe(INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING);
  });
});

// ── The composition (object identity is the dormancy anchor) ───────────────

describe('[W-I I2] the sight composition is a no-op by object identity when dark', () => {
  const base = (/** @type {string} */ o, /** @type {string} */ s) => ({ decayKeep01: 0.4, accuracyFloor01: o === s ? 0.9 : 0.2 });

  it('returns the caller own closure BY REFERENCE with no floor function', () => {
    expect(composeBrokerageSight(base, null)).toBe(base);
    expect(composeBrokerageSight(base, undefined)).toBe(base);
    expect(composeBrokerageSight(null, null)).toBeNull();
  });

  it('takes the BETTER floor and leaves the decay modifier alone', () => {
    const composed = composeBrokerageSight(base, () => 0.7);
    const out = composed('a', 'b');
    expect(out.accuracyFloor01).toBe(0.7);
    expect(out.decayKeep01).toBe(0.4);
    // A weaker brokerage floor never lowers a paid-eyes floor.
    const weaker = composeBrokerageSight(base, () => 0.05);
    expect(weaker('a', 'b')).toEqual({ decayKeep01: 0.4, accuracyFloor01: 0.2 });
  });

  it('works with no base closure at all (a brokerage without any posture ledger)', () => {
    const composed = composeBrokerageSight(null, () => 0.33);
    expect(composed('a', 'b')).toEqual({ decayKeep01: 0, accuracyFloor01: 0.33 });
  });

  it('makeBrokerageFloorFn is null while the flag is dark, and live when it is lit', () => {
    const byId = new Map([['a', { id: 'a', settlement: { institutions: [EXCHANGE] } }]]);
    const dark = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable', infoStatecraftEnabled: true } };
    expect(makeBrokerageFloorFn({ worldState: dark, byId })).toBeNull();
    const lit = { ...dark, simulationRules: { ...dark.simulationRules, informationBrokeragesEnabled: true } };
    const floorOf = makeBrokerageFloorFn({ worldState: lit, byId });
    expect(typeof floorOf).toBe('function');
    expect(floorOf('a', 'b')).toBeGreaterThan(0);
    // A settlement with no house reads zero even while the flag is lit.
    expect(floorOf('z', 'b')).toBe(0);
  });

  it('a RUINED house sharpens nothing (the roster is read through the ruin filter)', () => {
    // END TO END, over both layers that hold it: this call site reads the observer's roster
    // through liveInstitutions(), and the presence gate re-applies isLiveInstitution to
    // whatever it is handed. A house the realm has lost cannot go on bending the distance
    // curve for the town it stood in. EXECUTED NEGATIVE CONTROL (2026-08-01): disabling
    // EITHER layer alone leaves this green — disabling BOTH reds it with 0.653 ≠ 0 — so the
    // pin is a claim about the SUBSYSTEM's answer, not about which layer supplies it.
    // ANCHORED on the identical fixture minus the ruin mark: if the floor read zero for
    // both, the pin would be proving nothing.
    const lit = {
      spatialCanonVersion: 1,
      simulationRules: { infoMode: 'unreliable', infoStatecraftEnabled: true, informationBrokeragesEnabled: true },
    };
    const standing = new Map([['a', { id: 'a', settlement: { institutions: [EXCHANGE] } }]]);
    const ruined = new Map([['a', { id: 'a', settlement: { institutions: [{ ...EXCHANGE, status: 'ruined', _worldPulseInactive: true }] } }]]);
    expect(makeBrokerageFloorFn({ worldState: lit, byId: standing })('a', 'b')).toBeGreaterThan(0);
    expect(makeBrokerageFloorFn({ worldState: lit, byId: ruined })('a', 'b')).toBe(0);
  });
});

// ── The wiring: the term reaches the real reconciliation ───────────────────

const ITEM = (/** @type {string} */ id, /** @type {unknown[]} */ institutions) => ({
  id,
  name: id.toUpperCase(),
  settlement: { name: id, tier: 'city', population: 20000, institutions, config: { primaryDeitySnapshot: { name: 'Sol' } } },
});

/** A garbled telling about `b` sitting in `a`'s ledger. */
const GARBLED_LEDGER = Object.freeze({
  a: {
    'trade:evt1': {
      eventRef: 'evt1', arrivalTick: 8, hopCount: 2, corroborationRoots: ['t0:evt1@b'],
      completeness01: 1, accuracy01: 0.05, score: 80, framing: [],
      provenance: { originId: 'b', relayIds: [] },
      content: { what: 'siege_begun', whereId: 'b', scope: 'regional', magnitude: 2, partyIds: ['b'] },
    },
  },
});

function advanceWith({ institutions, lit }) {
  const settlements = [ITEM('a', institutions), ITEM('b', [])];
  const snapshot = {
    settlements,
    byId: new Map(settlements.map((s) => [s.id, s])),
    regionalGraph: { edges: [{ id: 'e.ab', from: 'a', to: 'b', relationshipType: 'hostile' }] },
  };
  const rules = {
    infoMode: 'unreliable',
    infoStatecraftEnabled: true,
    ...(lit ? { informationBrokeragesEnabled: true } : {}),
  };
  const worldState = {
    spatialCanonVersion: 1,
    simulationRules: rules,
    warPosture: { b: { state: 'mobilized' } },
    spatialLedgers: {
      rumorLedgers: GARBLED_LEDGER,
      beliefMaps: { a: { [GOVERNING_SEAT_KEY]: { b: { readiness: 0, strengthBand: 0, allianceLabel: 'allied', faithLabel: null, confidence01: 0.5, lastUpdateTick: 2 } } } },
    },
  };
  return advanceBeliefMaps({ snapshot, pressureIdx: null, worldState, tick: 9 });
}

describe('[W-I I2] the fidelity term reaches the real belief reconciliation', () => {
  it('a lit brokerage world reconciles the SAME garbled telling differently from a dark one', () => {
    const dark = advanceWith({ institutions: [SMITH], lit: false });
    const litNoHouse = advanceWith({ institutions: [SMITH], lit: true });
    const litHouse = advanceWith({ institutions: [EXCHANGE], lit: true });
    const seatOf = (r) => r.next?.a?.[GOVERNING_SEAT_KEY]?.b;
    expect(seatOf(dark), 'the fixture must produce a belief at all').toBeTruthy();
    // The flag alone changes nothing: a lit world with no house is byte-identical to dark.
    expect(JSON.stringify(seatOf(litNoHouse))).toBe(JSON.stringify(seatOf(dark)));
    // The house is what moves it, and it moves it TOWARD the truth (band 4 readiness 1).
    expect(JSON.stringify(seatOf(litHouse))).not.toBe(JSON.stringify(seatOf(dark)));
    expect(seatOf(litHouse).strengthBand).toBeGreaterThanOrEqual(seatOf(dark).strengthBand);
    expect(seatOf(litHouse).readiness).toBeGreaterThan(seatOf(dark).readiness);
  });
});

// ── THE DIVERGENCE ENVELOPE ────────────────────────────────────────────────

const TRUTH_BANDS = [0, 1, 2, 3, 4];
const PRIOR_BANDS = [0, 2, 4];
const ACCURACIES = [0.02, 0.1, 0.25, 0.45, 0.7, 0.95];

/** The matched corpus: one row per (truth, prior, telling fidelity, distance). */
const MATCHED_CORPUS = TRUTH_BANDS.flatMap((truthBand) => PRIOR_BANDS.flatMap(
  (priorBand) => ACCURACIES.flatMap((accuracy01) => DISTANCES.slice(0, 4).map(
    (delay) => ({ truthBand, priorBand, accuracy01, delay }),
  )),
));

function reconcileAt({ truthBand, priorBand, accuracy01, floor }) {
  const groundTruth = {
    readiness: 1, strengthBand: truthBand, allianceLabel: 'hostile', faithLabel: 'Vorn',
    confidence01: 1, lastUpdateTick: 10,
  };
  const prior = {
    readiness: 0, strengthBand: priorBand, allianceLabel: 'allied', faithLabel: 'Sol',
    confidence01: 0.5, lastUpdateTick: 2,
  };
  const reports = [{
    hopCount: 2, ageTicks: 1, independentSources: 1, completeness01: 1,
    accuracy01, score: 80, sortKey: 'trade:evt1',
  }];
  return reconcileBelief({ prior, groundTruth, reports, now: 10, sightFloor01: floor });
}

describe('[W-I I2] THE DIVERGENCE ENVELOPE: a brokerage settlement believes closer to the truth', () => {
  it('is never further from the truth in any matched case, and closer on the mean', () => {
    // DIVERGENCE is measured on BOTH attributes a belief carries as a number: the quantized
    // strength band and the continuous readiness. The band alone is a coarse instrument
    // (it rounds, so a real improvement often lands in the same integer), and reporting
    // only the coarse one would understate a term that is in fact moving every case.
    const competence = beliefChannelCompetence(brokerageHousesOf([EXCHANGE]));
    let withHouse = 0;
    let without = 0;
    let bandImproved = 0;
    let anyImproved = 0;
    const failures = collectSeedFailures(MATCHED_CORPUS, (row) => {
      const floor = brokerageAccuracyFloor01(competence, row.delay);
      const brokered = reconcileAt({ ...row, floor });
      const matched = reconcileAt({ ...row, floor: 0 });
      const bandBrokered = Math.abs(brokered.strengthBand - row.truthBand);
      const bandMatched = Math.abs(matched.strengthBand - row.truthBand);
      // Ground-truth readiness in this corpus is 1 (a mobilized subject).
      const readyBrokered = Math.abs(brokered.readiness - 1);
      const readyMatched = Math.abs(matched.readiness - 1);
      withHouse += bandBrokered + readyBrokered;
      without += bandMatched + readyMatched;
      if (bandBrokered < bandMatched) bandImproved += 1;
      if (bandBrokered + readyBrokered < bandMatched + readyMatched) anyImproved += 1;
      // THE HARD HALF: a house may never make a settlement WORSE informed, on either
      // attribute. A floor that could push a belief away from the truth would be a fidelity
      // term in name only.
      const where = `truth ${row.truthBand} prior ${row.priorBand} accuracy ${row.accuracy01} delay ${row.delay}`;
      expect(bandBrokered, `${where} (band)`).toBeLessThanOrEqual(bandMatched);
      expect(readyBrokered, `${where} (readiness)`).toBeLessThanOrEqual(readyMatched + 1e-12);
    });
    expectNoSeedFailures(failures, 'a house never leaves a settlement worse informed');
    expect(without, 'the matched corpus produced no divergence at all to reduce').toBeGreaterThan(0);
    expect(withHouse).toBeLessThan(without);
    // NON-VACUITY: "never worse" is satisfied by a term that does nothing, so a real share
    // of the corpus has to MOVE. Measured 2026-08-01 over this exact corpus: 180 of 360
    // cases move (the other half are tellings already sharper than the floor, where the
    // house correctly adds nothing) and 24 of 360 move a whole quantized band. The floors
    // below sit under both with margin, so ordinary tuning drift does not red this while a
    // term that went inert does.
    expect(anyImproved, 'no matched case improved at all, so the term is inert')
      .toBeGreaterThan(MATCHED_CORPUS.length / 3);
    expect(bandImproved, 'no matched case moved a whole band, so the term is cosmetic')
      .toBeGreaterThan(MATCHED_CORPUS.length / 30);
  });

  it('the improvement DECAYS with distance, which is Law 1 seen from the envelope side', () => {
    const competence = beliefChannelCompetence(brokerageHousesOf([EXCHANGE]));
    const gapAt = (delay) => {
      const floor = brokerageAccuracyFloor01(competence, delay);
      return MATCHED_CORPUS.filter((row) => row.delay === DISTANCES[0]).reduce((sum, row) => {
        const brokered = reconcileAt({ ...row, floor });
        const matched = reconcileAt({ ...row, floor: 0 });
        return sum + (Math.abs(matched.strengthBand - row.truthBand) - Math.abs(brokered.strengthBand - row.truthBand));
      }, 0);
    };
    const near = gapAt(0);
    const far = gapAt(DISTANCES[DISTANCES.length - 1]);
    expect(near, 'the near read gained nothing, so the comparison below is empty').toBeGreaterThan(0);
    expect(far).toBeLessThan(near);
  });

  it('a faithful enough floor lets the observer adopt the TRUE label a garbled telling could not', () => {
    const competence = beliefChannelCompetence(brokerageHousesOf([EXCHANGE]));
    expect(competence).toBeGreaterThan(BELIEF_TUNING.CAT_ADOPT_ACCURACY);
    const row = { truthBand: 4, priorBand: 0, accuracy01: 0.05 };
    expect(reconcileAt({ ...row, floor: 0 }).allianceLabel).toBe('allied');
    expect(reconcileAt({ ...row, floor: brokerageAccuracyFloor01(competence, 0) }).allianceLabel).toBe('hostile');
  });
});
