/**
 * brokeragePlant.test.js — [W-I INFORMATION BROKERAGES] I4 §6 PLANT, THE MARKET.
 *
 * THE CENTRAL CLAIM, and it is executed rather than asserted: a commissioned plant is
 * consumed by the ALREADY-BUILT LIE verb. These tests hand a commission to the REAL
 * `processLies` and watch the real contradict, expose and blowback triple fire on it, so
 * "the market gives the lie verb a seller" is a measured composition and not a design note.
 *
 * The pins:
 *   1. only the Whisper market sells a plant, by DECLARED SERVICE KEY and never by name;
 *   2. the commissioned record is byte-compatible with the verb's own DisinfoRecord, and
 *      the verb carries it forward untouched while it is still afield;
 *   3. the exposure charges the MARKET (the seller wears the failure) and banks the same
 *      grievance a court's own bluff would, with a still-afield tick as the control;
 *   4. the market's CREDIBILITY backs the lie: a discredited house plants a less believed
 *      story and is charged more for the placement;
 *   5. PLANTS ARE DM TRUTH UNTIL EXPOSED — the player projection is empty while the lie
 *      stands and full once it has collapsed;
 *   6. `plantIsExposed` agrees with the real mover, over a table;
 *   7. refusals are honest and named, and dormancy yields nothing at all.
 */
import { describe, expect, test } from 'vitest';
import {
  PLANT_INTENTS,
  PLANT_REFUSALS,
  PLANT_WIRING,
  commissionPlant,
  marketHouseOf,
  plantIsExposed,
  plantPrice,
  projectPlants,
} from '../../src/domain/worldPulse/brokerageServicesPlant.js';
import { LIE_TUNING, processLies } from '../../src/domain/worldPulse/informationStatecraft.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const MARKET = Object.freeze({
  name: 'Whisper market',
  tags: ['criminal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'],
});
const ROOKERY = Object.freeze({
  name: 'Rookery',
  tags: ['criminal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query'],
});
const EXCHANGE = Object.freeze({
  name: "Chroniclers' exchange",
  tags: ['legal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed'],
});
// A custom illegal-major brokerage under an invented name, declaring the same closed keys.
const CUSTOM = Object.freeze({
  name: 'The Quiet Counting House',
  tags: ['criminal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'],
});

const FACTIONS = Object.freeze([
  { name: 'The Grey Council', category: 'government', power: 60, isGoverning: true },
  { name: 'Ashwater Syndicate', category: 'criminal', power: 40 },
]);

/** @param {string} id @param {readonly unknown[]} institutions */
function itemOf(id, institutions) {
  return {
    id,
    settlement: {
      name: id,
      institutions: [...institutions],
      powerStructure: { factions: FACTIONS.map((f) => ({ ...f })) },
    },
  };
}

const LIT_RULES = Object.freeze({
  infoMode: 'unreliable', infoStatecraftEnabled: true, informationBrokeragesEnabled: true,
});
const DARK_RULES = Object.freeze({ infoMode: 'unreliable', infoStatecraftEnabled: true });

/** @param {number} band @param {string} [label] */
function belief(band, label = 'neutral') {
  return {
    readiness: 0.3, strengthBand: band, allianceLabel: label,
    faithLabel: 'devout', confidence01: 0.5, lastUpdateTick: 0,
  };
}

/** @param {Record<string, unknown>} rules @param {number} [purse] @param {Record<string, unknown>} [ledgers] */
function worldOf(rules, purse = 0.9, ledgers = {}) {
  return {
    tick: 3,
    spatialCanonVersion: 1,
    simulationRules: rules,
    factionStates: {
      'aaa:ashwater_syndicate': {
        factionId: 'aaa:ashwater_syndicate', settlementId: 'aaa', name: 'Ashwater Syndicate',
        archetype: 'criminal', momentum: purse, exhaustion: 0.1, controlledInstitutions: [],
      },
    },
    spatialLedgers: { ...ledgers },
  };
}

const A = itemOf('aaa', [MARKET]);
const B = { id: 'bbb', settlement: { name: 'bbb', institutions: [] } };
const C = { id: 'ccc', settlement: { name: 'ccc', institutions: [] } };
const SNAPSHOT = {
  settlements: [A, B, C],
  byId: new Map([['aaa', A], ['bbb', B], ['ccc', C]]),
};

/** Commission the canonical plant used across the lifecycle tests. */
function commission(world = worldOf(LIT_RULES)) {
  return commissionPlant({
    worldState: world,
    item: A,
    patronId: 'aaa:ashwater_syndicate',
    audienceId: 'ccc',
    subjectId: 'bbb',
    subjectTrueBand: 2,
    audienceBelief: belief(2),
    intent: 'inflate',
    tick: 3,
  });
}

/** Run the REAL lie mover over a world holding the commissioned plant.
 *  @param {Record<string, unknown>} record @param {string} key
 *  @param {Record<string, unknown>} audienceBelief @param {number} tick */
function runMover(record, key, audienceBelief, tick) {
  const world = worldOf(LIT_RULES, 0.9, { disinfo: { [key]: record } });
  const beliefMaps = { ccc: { seat: { bbb: audienceBelief } } };
  return processLies({
    snapshot: SNAPSHOT,
    worldState: world,
    beliefMaps,
    rng: null,
    tick,
    strengthOf: () => 0.4,
    alignmentOf: () => ({ malice01: 0, lawfulness01: 1 }),
    nameFor: (/** @type {string} */ id) => id,
  });
}

describe('W-I I4 — only the market sells a plant', () => {
  test('the seller is chosen by DECLARED SERVICE KEY, never by name', () => {
    expect(marketHouseOf(itemOf('aaa', [MARKET])).institutionId).toBe('whisper_market');
    // A CUSTOM illegal-major brokerage declaring the same closed keys sells exactly as the
    // native one does (design §3's custom-content clause).
    expect(marketHouseOf(itemOf('aaa', [CUSTOM])).name).toBe('The Quiet Counting House');
    // The lesser covert form and the licensed guild do not sell lies.
    expect(marketHouseOf(itemOf('aaa', [ROOKERY]))).toBeNull();
    expect(marketHouseOf(itemOf('aaa', [EXCHANGE]))).toBeNull();
    // A RUINED market sells nothing either: the ruin filter runs before the key read.
    expect(marketHouseOf(itemOf('aaa', [{ ...MARKET, status: 'ruined' }]))).toBeNull();
  });

  test('the closed vocabularies hold and the wiring note names its own seam', () => {
    expect(PLANT_INTENTS).toEqual(['inflate', 'deflate']);
    expect(PLANT_REFUSALS).toEqual(['dormant', 'no_market', 'bad_intent', 'cannot_pay', 'no_channel']);
    expect(PLANT_WIRING).toMatch(/processLies/);
  });
});

describe('W-I I4 — the commission is the LIE verb\'s own record', () => {
  test('the record is byte-compatible with DisinfoRecord and borrows the verb\'s tuning', () => {
    const result = commission();
    expect(result.refused).toBe(false);
    const { record, override, key } = result.plant;
    expect(Object.keys(record).sort()).toEqual(
      ['assertedBand', 'audienceId', 'liarId', 'lineageId', 'seededTick', 'subjectId', 'trueBand'],
    );
    // THE SELLER IS THE LIAR OF RECORD: the market's own host settlement, which is what
    // makes its credibility stock a real stake.
    expect(record.liarId).toBe('aaa');
    expect(record.subjectId).toBe('bbb');
    expect(record.audienceId).toBe('ccc');
    // The exaggeration is the VERB's authored size, not a second copy of it.
    expect(record.assertedBand - record.trueBand).toBe(LIE_TUNING.INFLATE_BANDS);
    expect(override.confidence01).toBeCloseTo(LIE_TUNING.BASE_CONFIDENCE, 4);
    // The key namespace is disjoint from the verb's own `lie:` keys, so neither can
    // silently overwrite the other.
    expect(key.startsWith('plant:')).toBe(true);
    expect(key.startsWith('lie:')).toBe(false);
  });

  test('a deflating commission is the mirror, and both directions are bounded to the band range', () => {
    const world = worldOf(LIT_RULES);
    const down = commissionPlant({
      worldState: world, item: A, patronId: 'aaa:ashwater_syndicate', audienceId: 'ccc',
      subjectId: 'bbb', subjectTrueBand: 3, audienceBelief: belief(3), intent: 'deflate', tick: 3,
    });
    expect(down.plant.record.assertedBand).toBe(3 - LIE_TUNING.INFLATE_BANDS);
    const floor = commissionPlant({
      worldState: world, item: A, patronId: 'aaa:ashwater_syndicate', audienceId: 'ccc',
      subjectId: 'bbb', subjectTrueBand: 0, audienceBelief: belief(0), intent: 'deflate', tick: 3,
    });
    expect(floor.plant.record.assertedBand).toBe(0);
    const ceiling = commissionPlant({
      worldState: world, item: A, patronId: 'aaa:ashwater_syndicate', audienceId: 'ccc',
      subjectId: 'bbb', subjectTrueBand: 4, audienceBelief: belief(4), intent: 'inflate', tick: 3,
    });
    expect(ceiling.plant.record.assertedBand).toBe(4);
  });

  test('THE REAL MOVER CARRIES THE PLANT FORWARD while it is still afield', () => {
    const { plant } = commission();
    const afield = runMover(plant.record, plant.key, plant.override, 4);
    expect(Object.keys(afield.disinfo)).toEqual([plant.key]);
    expect(afield.disinfo[plant.key]).toEqual(plant.record);
    expect(afield.deltas).toEqual([]);
    expect(afield.newsEntries).toEqual([]);
  });

  test('THE REAL MOVER EXPOSES IT, charges the MARKET, and banks the grievance', () => {
    const { plant } = commission();
    const afield = runMover(plant.record, plant.key, plant.override, 4);
    // The audience re-anchors back toward the truth: the verb's own contradiction rule.
    const exposed = runMover(plant.record, plant.key, belief(2), 5);

    // PRESENT-THEN-ABSENT on the ledger itself: the record was carried on tick 4 and is
    // gone on tick 5, so the empty reading measures EXPOSURE and not a mover that never
    // saw the record.
    expectPresentThenAbsent(
      Object.keys(afield.disinfo), Object.keys(exposed.disinfo || {}), plant.key, 'disinfo ledger',
    );
    expect(exposed.deltas).toEqual([
      { id: 'aaa', kind: 'deception', magnitude01: LIE_TUNING.EXPOSE_CHARGE01 },
    ]);
    expect(exposed.grievances).toEqual([
      { a: 'ccc', b: 'aaa', magnitude01: LIE_TUNING.EXPOSE_GRIEVANCE_W, incidentType: 'deception_betrayal' },
    ]);
    expect(exposed.newsEntries.length).toBe(1);
    expect(exposed.newsEntries[0].kind).toBe('infowar_lie_exposed');
  });

  test('a plant also ages out, on the verb\'s own shelf life', () => {
    const { plant } = commission();
    const stillAfield = runMover(plant.record, plant.key, plant.override, 3 + LIE_TUNING.EXPOSE_MAX_AGE_TICKS - 1);
    expect(Object.keys(stillAfield.disinfo)).toEqual([plant.key]);
    const aged = runMover(plant.record, plant.key, plant.override, 3 + LIE_TUNING.EXPOSE_MAX_AGE_TICKS);
    expect(aged.disinfo).toBeNull();
    expect(aged.deltas.length).toBe(1);
  });
});

describe('W-I I4 — the market\'s credibility backs the lie and prices it', () => {
  test('a discredited house plants a less believed story and charges more to place it', () => {
    const trusted = worldOf(LIT_RULES);
    const discredited = worldOf(LIT_RULES);
    // The statecraft credibility stock, in its own ledger shape, with the market's host
    // carrying a heavy deception history.
    discredited.spatialLedgers.credibility = { aaa: { score: -3, lastTick: 3 } };
    const good = commission(trusted);
    const bad = commission(discredited);
    expect(bad.plant.override.confidence01).toBeLessThan(good.plant.override.confidence01);
    expect(bad.price.cost01).toBeGreaterThan(good.price.cost01);
  });

  test('the price rises with the size of the lie and is bounded', () => {
    const small = plantPrice({ bands: 0, credibility01: 1 });
    const large = plantPrice({ bands: 4, credibility01: 1 });
    expect(large.cost01).toBeGreaterThan(small.cost01);
    for (let bands = 0; bands <= 8; bands += 1) {
      expect(plantPrice({ bands, credibility01: 0 }).cost01).toBeLessThanOrEqual(0.45);
    }
  });

  test('the commission is CHARGED to the patron, and an unpayable one is refused', () => {
    const paid = commission(worldOf(LIT_RULES, 0.9));
    expect(paid.charge.patronId).toBe('aaa:ashwater_syndicate');
    expect(paid.charge.factionPatch.momentum).toBeCloseTo(0.9 - paid.price.cost01, 10);
    expect(paid.charge.factionPatch.recentAction).toBe('brokerage_plant');

    const broke = commission(worldOf(LIT_RULES, 0.01));
    expect(broke.refused).toBe(true);
    expect(broke.refusal.reason).toBe('cannot_pay');
    expect(broke.plant).toBeNull();
    expect(broke.charge).toBeNull();
  });
});

describe('W-I I4 — PLANTS ARE DM TRUTH UNTIL EXPOSED', () => {
  test('a live plant is invisible to a player and a collapsed one is not', () => {
    const { plant } = commission();
    const live = (/** @type {Record<string, unknown>} */ record) => plantIsExposed(record, plant.override, 4);
    const collapsed = (/** @type {Record<string, unknown>} */ record) => plantIsExposed(record, belief(2), 5);

    const dm = projectPlants([plant.record], { audience: 'dm', isExposed: live });
    expect(dm.length).toBe(1);
    expect(dm[0]).toEqual(plant.record);

    // THE PLAYER SEES NOTHING, not a redacted row: the table experiences the plant as a
    // belief the world holds, and a row saying "this was bought" would give away the
    // mystery the plant IS.
    const hidden = projectPlants([plant.record], { audience: 'player', isExposed: live });
    expect(hidden).toEqual([]);
    // ONCE EXPOSED IT PROJECTS IN FULL, which is the control proving the hiding is
    // conditional rather than a projection that always returns nothing.
    const revealed = projectPlants([plant.record], { audience: 'player', isExposed: collapsed });
    expect(revealed.length).toBe(1);
    expect(revealed[0]).toEqual(plant.record);
  });

  test('plantIsExposed agrees with the REAL mover over a table', () => {
    const { plant } = commission();
    /** @type {Array<[string, Record<string, unknown>, number]>} */
    const cases = [
      ['still planted, fresh', plant.override, 4],
      ['re-anchored to truth', belief(2), 5],
      ['half re-anchored', belief(3), 5],
      ['aged out', plant.override, 3 + LIE_TUNING.EXPOSE_MAX_AGE_TICKS],
      ['one tick short of aged out', plant.override, 3 + LIE_TUNING.EXPOSE_MAX_AGE_TICKS - 1],
    ];
    const disagreements = [];
    for (const [label, audienceBelief, tick] of cases) {
      const moverExposed = runMover(plant.record, plant.key, audienceBelief, tick).disinfo === null;
      const readerExposed = plantIsExposed(plant.record, audienceBelief, tick);
      if (moverExposed !== readerExposed) disagreements.push(`${label}: mover ${moverExposed}, reader ${readerExposed}`);
    }
    expect(disagreements).toEqual([]);
    // NON-VACUITY: the table contains both outcomes, so agreement is not agreement on a
    // single constant.
    const outcomes = new Set(cases.map(([, b, t]) => plantIsExposed(plant.record, b, t)));
    expect([...outcomes].sort()).toEqual([false, true]);
  });
});

describe('W-I I4 — honest refusals and dormancy', () => {
  test('every refusal path names a reason from the closed vocabulary', () => {
    const base = {
      item: A, patronId: 'aaa:ashwater_syndicate', audienceId: 'ccc', subjectId: 'bbb',
      subjectTrueBand: 2, audienceBelief: belief(2), intent: 'inflate', tick: 3,
    };
    const seen = new Set();
    seen.add(commissionPlant({ ...base, worldState: worldOf(DARK_RULES) }).refusal.reason);
    seen.add(commissionPlant({ ...base, worldState: worldOf(LIT_RULES), intent: 'muddle' }).refusal.reason);
    seen.add(commissionPlant({
      ...base, worldState: worldOf(LIT_RULES), item: itemOf('aaa', [EXCHANGE]),
    }).refusal.reason);
    // NO CHANNEL: a court that has never heard of the subject has no ear the lie can land
    // in. That is the LIE verb's own rule applied at the counter.
    seen.add(commissionPlant({ ...base, worldState: worldOf(LIT_RULES), audienceBelief: null }).refusal.reason);
    seen.add(commissionPlant({ ...base, worldState: worldOf(LIT_RULES, 0) }).refusal.reason);
    expect([...seen].sort()).toEqual([...PLANT_REFUSALS].sort());
  });

  test('DORMANCY — a dark flag commissions nothing', () => {
    const dark = commission(worldOf(DARK_RULES));
    expect(dark.refused).toBe(true);
    expect(dark.plant).toBeNull();
    // LIVENESS ANCHOR: the identical commission lit produces a plant, so the null above
    // measures the gate rather than a commission that never works.
    expect(commission(worldOf(LIT_RULES)).plant).toBeTruthy();
  });
});
