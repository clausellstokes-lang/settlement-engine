/**
 * brokerageServices.test.js — [W-I INFORMATION BROKERAGES] I3 §6, THE SERVICES.
 *
 * THE PINS, each with an executed negative control:
 *   1. TOTALITY — the service menu is total over legality x form x channel, and the
 *      illegal-major plant key exists in exactly one cell family.
 *   2. THE PRICE IS BANDED, monotone in distance and falling in competence, and bounded.
 *   3. A QUERY MINTS NO NEW FACTS — every claim resolves back into the exact record it
 *      names, with the record removed as the control.
 *   4. THE PRICE IS CHARGED and the REFUSAL IS HONEST — the same world, a rich patron and
 *      a poor one.
 *   5. THE FEED IMPROVES THE PATRON'S CALIBRATION ON ITS CHANNELS AND NOT OTHERS, measured
 *      through the REAL advanceBeliefMaps, with a dark run as the control.
 *   6. THE KNOWLEDGE LANE NOW GENERATES CANDIDATES — the audit classifier itself is run
 *      over every act, with a politics-typed twin proving the classifier discriminates.
 *   7. DORMANCY IS BYTE-IDENTICAL, by object identity on the belief maps and by an empty
 *      candidate list.
 *
 * Plus the display-invariant census this slice owes: the four acts are minted DYNAMICALLY
 * (the estate's template-family idiom), so the two shared literal-scanning walkers cannot
 * see them; the same three invariants they enforce are enforced here instead.
 */
import { describe, expect, test } from 'vitest';
import {
  BROKERAGE_SERVICE_MENU_KEYS,
  CHANNEL_BELIEF_AXES,
  QUERY_PRICE_BANDS,
  QUERY_PRICE_TUNING,
  QUERY_REFUSALS,
  answerBrokerageQuery,
  brokerageQueryPrice,
  localBeliefRecord,
  patronPurse01,
  servicesAvailable,
} from '../../src/domain/worldPulse/brokerageServices.js';
import {
  CARRIER_FED_ARCHETYPES,
  applyPatronFeeds,
  feedPull01,
  patronFeedEdges,
  patronFeedSlot,
} from '../../src/domain/worldPulse/brokerageServicesFeed.js';
import {
  BROKERAGE_ACTS,
  evaluateBrokerageServiceRules,
} from '../../src/domain/worldPulse/brokerageServicesRules.js';
import { INFORMATION_CHANNELS, INFORMATION_BROKERAGE_TUNING } from '../../src/data/informationBrokerageTuning.js';
import { BROKERAGE_STAMP_TUNING } from '../../src/domain/worldPulse/brokerageStamps.js';
import { FACTION_CARRIER_FRAMING, GOVERNING_SEAT_KEY, advanceBeliefMaps, beliefRecord } from '../../src/domain/worldPulse/beliefMap.js';
import { moverFamilyOf } from '../../scripts/audit/behavioral-observation.mjs';
import { whatPhrase } from '../../src/domain/display/settlementRumors.js';
import { newsVoiceCategory } from '../../src/domain/display/newsVoice.js';
import { HERALD_SECTIONS, SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const EXCHANGE = Object.freeze({
  name: "Chroniclers' exchange",
  tags: ['legal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed'],
});
const MARKET = Object.freeze({
  name: 'Whisper market',
  tags: ['criminal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'],
});
const FACTIONS = Object.freeze([
  { name: 'The Grey Council', category: 'government', power: 60, isGoverning: true },
  { name: 'Ashwater Syndicate', category: 'criminal', power: 40 },
  // A SECOND legal power, deliberately: the intercept act needs a RIVAL eligible to keep
  // the same kind of house, and a settlement with exactly one licensed power has none.
  { name: 'Coin Guild', category: 'merchant', power: 30 },
]);

/** @param {string} id @param {readonly unknown[]} institutions */
function itemOf(id, institutions) {
  return {
    id,
    settlement: {
      name: id,
      tier: 'city',
      institutions: [...institutions],
      factions: FACTIONS.map((f) => ({ ...f })),
      powerStructure: { factions: FACTIONS.map((f) => ({ ...f })) },
    },
  };
}

const LIT_RULES = Object.freeze({
  infoMode: 'unreliable', infoStatecraftEnabled: true, informationBrokeragesEnabled: true,
});
const DARK_RULES = Object.freeze({ infoMode: 'unreliable', infoStatecraftEnabled: true });

/** A belief record shaped exactly as the belief engine writes them.
 *  @param {number} band @param {string} label @param {string} [faith] */
function belief(band, label, faith = 'secular') {
  return {
    readiness: 0.1, strengthBand: band, allianceLabel: label,
    faithLabel: faith, confidence01: 0.2, lastUpdateTick: 0,
  };
}

/** @param {Record<string, unknown>} rules @param {number} [purse] */
function worldOf(rules, purse = 0.9) {
  return {
    tick: 5,
    spatialCanonVersion: 1,
    simulationRules: rules,
    relationshipStates: {},
    factionStates: {
      'aaa:the_grey_council': {
        factionId: 'aaa:the_grey_council', settlementId: 'aaa', name: 'The Grey Council',
        archetype: 'civic', momentum: purse, exhaustion: 0.1, controlledInstitutions: [],
      },
      'aaa:ashwater_syndicate': {
        factionId: 'aaa:ashwater_syndicate', settlementId: 'aaa', name: 'Ashwater Syndicate',
        archetype: 'criminal', momentum: purse, exhaustion: 0.1, controlledInstitutions: [],
      },
      'aaa:coin_guild': {
        factionId: 'aaa:coin_guild', settlementId: 'aaa', name: 'Coin Guild',
        archetype: 'merchant', momentum: purse, exhaustion: 0.1, controlledInstitutions: [],
      },
    },
    spatialLedgers: {
      beliefMaps: {
        aaa: {
          [GOVERNING_SEAT_KEY]: { bbb: belief(0, 'friendly') },
          criminal: { bbb: belief(0, 'friendly') },
        },
      },
    },
  };
}

describe('W-I I3 — the brokerage service menu and price', () => {
  test('TOTALITY — every legality x form x channel cell answers, and no cell falls through', () => {
    const cells = [];
    for (const legality of ['legal', 'illegal']) {
      for (const form of ['minor', 'major']) {
        for (const channel of INFORMATION_CHANNELS) {
          const menu = servicesAvailable(legality, form, channel);
          expect(Array.isArray(menu)).toBe(true);
          // Calibration is unconditional: presence alone grades the news (I2).
          expect(menu).toContain('info_calibration');
          for (const key of menu) expect(BROKERAGE_SERVICE_MENU_KEYS).toContain(key);
          cells.push([legality, form, channel, menu.join('|')]);
        }
      }
    }
    expect(cells.length).toBe(2 * 2 * INFORMATION_CHANNELS.length);

    // The plant is the illegal MAJOR's alone (design §6). Anchored by the positive
    // assertion that the illegal-major cells DO carry it.
    const planters = cells.filter(([, , , menu]) => menu.includes('info_plant'));
    expect(planters.length).toBe(INFORMATION_CHANNELS.length);
    expect(planters.every(([legality, form]) => legality === 'illegal' && form === 'major')).toBe(true);
    expectAbsentWithAnchor(servicesAvailable('legal', 'major', 'crime'), 'info_plant', 'info_feed', 'legal major');
    expectAbsentWithAnchor(servicesAvailable('illegal', 'minor', 'crime'), 'info_feed', 'info_query', 'illegal minor');

    // Outside the closed vocabularies the menu is EMPTY, never a default. The lit cell
    // above is the liveness anchor for these empties.
    expect(servicesAvailable('legal', 'major', 'weather')).toEqual([]);
    expect(servicesAvailable('municipal', 'major', 'war')).toEqual([]);
    expect(servicesAvailable('legal', 'grand', 'war')).toEqual([]);
  });

  test('a house sells a query only where it will VOUCH on the Herald, at the same floor', () => {
    for (const legality of ['legal', 'illegal']) {
      for (const form of ['minor', 'major']) {
        for (const channel of INFORMATION_CHANNELS) {
          const competence = INFORMATION_BROKERAGE_TUNING
            .CHANNEL_COMPETENCE[legality][form][channel];
          const sells = servicesAvailable(legality, form, channel).includes('info_query');
          expect(sells).toBe(competence >= BROKERAGE_STAMP_TUNING.CHANNEL_VOUCH_FLOOR);
        }
      }
    }
    // Non-vacuity: both sides of the predicate actually occur in the authored table.
    // anchored: the SAME menu is asserted to carry info_calibration two lines below, so a collapsed or renamed menu reds there instead of passing this absence silently.
    expect(servicesAvailable('illegal', 'major', 'faith')).not.toContain('info_query');
    expect(servicesAvailable('illegal', 'major', 'faith')).toContain('info_calibration');
    expect(servicesAvailable('illegal', 'major', 'crime')).toContain('info_query');
  });

  test('the price is banded, rises with distance, falls with competence, and is bounded', () => {
    const near = brokerageQueryPrice({ legality: 'legal', form: 'major', channel: 'war', delayTicks: 0 });
    const far = brokerageQueryPrice({ legality: 'legal', form: 'major', channel: 'war', delayTicks: 6 });
    expect(far.cost01).toBeGreaterThan(near.cost01);
    let previous = -1;
    for (let delay = 0; delay <= 20; delay += 1) {
      const price = brokerageQueryPrice({ legality: 'legal', form: 'major', channel: 'war', delayTicks: delay });
      expect(price.cost01).toBeGreaterThanOrEqual(previous);
      expect(price.cost01).toBeLessThanOrEqual(QUERY_PRICE_TUNING.MAX_PRICE01);
      expect(QUERY_PRICE_BANDS).toContain(price.band);
      // Legibility law: the reader-facing strings carry no digits at all.
      // anchored: both strings are asserted non-empty two and three lines below, so a producer returning '' reds there instead of passing these digit checks vacuously.
      expect(price.label).not.toMatch(/[0-9]/);
      // anchored: see the non-empty assertions below; an empty detail cannot pass them.
      expect(price.detail).not.toMatch(/[0-9]/);
      expect(price.label.length).toBeGreaterThan(0);
      expect(price.detail.length).toBeGreaterThan(0);
      previous = price.cost01;
    }
    // A channel the house masters is CHEAPER than one it barely reads, same house.
    const mastered = brokerageQueryPrice({ legality: 'legal', form: 'major', channel: 'trade', delayTicks: 0 });
    const ignorant = brokerageQueryPrice({ legality: 'legal', form: 'major', channel: 'persons', delayTicks: 0 });
    expect(mastered.cost01).toBeLessThan(ignorant.cost01);
    // A guild charges more than a small house for the same question.
    expect(brokerageQueryPrice({ legality: 'legal', form: 'major', channel: 'trade', delayTicks: 0 }).cost01)
      .toBeGreaterThan(brokerageQueryPrice({ legality: 'legal', form: 'minor', channel: 'trade', delayTicks: 0 }).cost01);
  });

  test('the local belief read is equal to the canonical beliefRecord', () => {
    const world = worldOf(LIT_RULES);
    for (const [observer, subject] of [['aaa', 'bbb'], ['aaa', 'zzz'], ['zzz', 'bbb'], ['', '']]) {
      const local = localBeliefRecord(world, observer, subject);
      const canonical = beliefRecord(world, observer, subject);
      expect(JSON.stringify(local)).toBe(JSON.stringify(canonical ?? null));
    }
    // Non-vacuity: at least one of the pairs above resolves to a real record.
    expect(localBeliefRecord(world, 'aaa', 'bbb')).toBeTruthy();
  });
});

describe('W-I I3 — THE QUERY MINTS NO NEW FACTS', () => {
  test('every claim resolves back into the record it names', () => {
    const world = worldOf(LIT_RULES);
    const item = itemOf('aaa', [EXCHANGE]);
    const result = answerBrokerageQuery({
      worldState: world, item, subjectId: 'bbb', channel: 'war',
      patronId: 'aaa:the_grey_council', tick: 5, delayTicks: 0,
    });
    expect(result.refused).toBe(false);
    expect(result.answer.claims.length).toBeGreaterThan(0);
    const stored = world.spatialLedgers.beliefMaps.aaa[GOVERNING_SEAT_KEY].bbb;
    for (const claim of result.answer.claims) {
      expect(['belief', 'truth']).toContain(claim.from);
      if (claim.from === 'belief') {
        expect(claim.ref).toBe(`spatialLedgers.beliefMaps.aaa.seat.bbb.${claim.axis}`);
        // THE ANCHORED NEGATIVE MADE POSITIVE: the value is not merely plausible, it is
        // the identical value already sitting in the ledger the ref names.
        expect(claim.value).toEqual(stored[claim.axis]);
      }
    }
  });

  test('NEGATIVE CONTROL — remove the record and the claim vanishes rather than being invented', () => {
    const world = worldOf(LIT_RULES);
    const item = itemOf('aaa', [EXCHANGE]);
    const before = answerBrokerageQuery({
      worldState: world, item, subjectId: 'bbb', channel: 'war',
      patronId: 'aaa:the_grey_council', tick: 5,
    });
    expect(before.answer.claims.map((claim) => claim.axis)).toContain('strengthBand');

    const blind = { ...world, spatialLedgers: { beliefMaps: { aaa: { [GOVERNING_SEAT_KEY]: {} } } } };
    const after = answerBrokerageQuery({
      worldState: blind, item, subjectId: 'bbb', channel: 'war',
      patronId: 'aaa:the_grey_council', tick: 5,
    });
    expect(after.refused).toBe(true);
    expect(after.refusal.reason).toBe('no_record');
    expect(QUERY_REFUSALS).toContain(after.refusal.reason);
  });

  test('ground truth is admitted only where the house has EARNED it (Law 1 at the counter)', () => {
    const world = worldOf(LIT_RULES);
    const item = itemOf('aaa', [EXCHANGE]);
    const args = {
      worldState: world, item, subjectId: 'bbb', channel: 'politics',
      patronId: 'aaa:the_grey_council', tick: 5,
      groundTruth: { allianceLabel: 'hostile' },
    };
    const near = answerBrokerageQuery({ ...args, delayTicks: 0 });
    const far = answerBrokerageQuery({ ...args, delayTicks: 6 });
    const nearClaim = near.answer.claims.find((claim) => claim.axis === 'allianceLabel');
    const farClaim = far.answer.claims.find((claim) => claim.axis === 'allianceLabel');
    expect(nearClaim.from).toBe('truth');
    expect(nearClaim.value).toBe('hostile');
    // FAR AWAY THE SAME HOUSE HANDS BACK THE BELIEF, which is the distance law: the
    // ceiling-bounded, distance-attenuated floor never reaches the sharp vouch floor.
    expect(farClaim.from).toBe('belief');
    expect(farClaim.value).toBe('friendly');
    expect(near.answer.floor01).toBeGreaterThan(far.answer.floor01);
    expect(near.answer.floor01).toBeLessThan(1);
  });

  test('the channel decides which axes the house will answer on, and the table is total', () => {
    expect(Object.keys(CHANNEL_BELIEF_AXES).sort()).toEqual([...INFORMATION_CHANNELS].sort());
    const world = worldOf(LIT_RULES);
    const item = itemOf('aaa', [EXCHANGE]);
    const politics = answerBrokerageQuery({
      worldState: world, item, subjectId: 'bbb', channel: 'politics',
      patronId: 'aaa:the_grey_council', tick: 5,
    });
    expect(politics.answer.claims.map((claim) => claim.axis)).toEqual(['allianceLabel']);
    // A channel the belief ledger cannot carry answers with a grade and no axis reading,
    // and NEVER with an invented trade fact.
    const trade = answerBrokerageQuery({
      worldState: world, item, subjectId: 'bbb', channel: 'trade',
      patronId: 'aaa:the_grey_council', tick: 5,
    });
    expect(trade.refused).toBe(false);
    expect(trade.answer.claims).toEqual([]);
    expect(trade.answer.stamp).toBeTruthy();
  });
});

describe('W-I I3 — THE PRICE IS CHARGED AND THE REFUSAL IS HONEST', () => {
  test('a patron who can pay is charged; a patron who cannot is refused and charged nothing', () => {
    const rich = worldOf(LIT_RULES, 0.9);
    const poor = worldOf(LIT_RULES, 0.01);
    const item = itemOf('aaa', [EXCHANGE]);
    const args = { item, subjectId: 'bbb', channel: 'war', patronId: 'aaa:the_grey_council', tick: 5 };

    const paid = answerBrokerageQuery({ ...args, worldState: rich });
    expect(paid.refused).toBe(false);
    expect(paid.charge.patronId).toBe('aaa:the_grey_council');
    expect(paid.charge.factionPatch.momentum).toBeCloseTo(0.9 - paid.price.cost01, 10);
    expect(paid.charge.factionPatch.exhaustion).toBeGreaterThan(0.1);
    expect(paid.charge.factionPatch.recentAction).toBe('brokerage_query');

    const refused = answerBrokerageQuery({ ...args, worldState: poor });
    expect(refused.refused).toBe(true);
    expect(refused.refusal.reason).toBe('cannot_pay');
    expect(refused.answer).toBeNull();
    expect(refused.charge).toBeNull();
    // THE CONTROL: the poor patron's purse is untouched by the refusal, so the refusal
    // costs nothing rather than charging for a service not rendered.
    expect(patronPurse01(poor, 'aaa:the_grey_council')).toBe(0.01);
  });

  test('every refusal names a reason from the closed vocabulary', () => {
    const item = itemOf('aaa', [EXCHANGE]);
    const base = { item, subjectId: 'bbb', patronId: 'aaa:the_grey_council', tick: 5 };
    const seen = new Set();
    seen.add(answerBrokerageQuery({ ...base, worldState: worldOf(DARK_RULES), channel: 'war' }).refusal.reason);
    seen.add(answerBrokerageQuery({ ...base, worldState: worldOf(LIT_RULES), channel: 'weather' }).refusal.reason);
    seen.add(answerBrokerageQuery({
      ...base, item: itemOf('aaa', []), worldState: worldOf(LIT_RULES), channel: 'war',
    }).refusal.reason);
    seen.add(answerBrokerageQuery({ ...base, worldState: worldOf(LIT_RULES, 0), channel: 'war' }).refusal.reason);
    // A licensed house declining the persons channel outright: silence, never a guess.
    // (`crime` is deliberately NOT the example: a legal guild sits exactly ON the vouch
    // floor there and will answer, which is a real property of the authored table.)
    seen.add(answerBrokerageQuery({ ...base, worldState: worldOf(LIT_RULES), channel: 'persons' }).refusal.reason);
    expect([...seen].sort()).toEqual(['cannot_pay', 'channel_declined', 'dormant', 'no_house'].sort());
    for (const reason of seen) expect(QUERY_REFUSALS).toContain(reason);
  });
});

describe('W-I I3 — THE FEED CALIBRATES ITS PATRON, ON ITS CHANNELS AND NOT OTHERS', () => {
  const A = itemOf('aaa', [MARKET]);
  const B = { id: 'bbb', settlement: { name: 'bbb', tier: 'town', institutions: [], factions: [], powerStructure: { factions: [] } } };
  const snapshot = {
    settlements: [A, B],
    byId: new Map([['aaa', A], ['bbb', B]]),
    regionalGraph: { edges: [{ from: 'aaa', to: 'bbb', type: 'hostile', relationshipType: 'hostile' }] },
  };

  /** @param {Record<string, unknown>} rules */
  function advance(rules) {
    return advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: worldOf(rules), tick: 5 });
  }

  test('the slot map matches the belief engine\'s own carrier partition', () => {
    expect([...CARRIER_FED_ARCHETYPES].sort()).toEqual(Object.keys(FACTION_CARRIER_FRAMING).sort());
    expect(patronFeedSlot('criminal')).toBe('criminal');
    // A power with no carrier partition is fed through the seat, because it IS the seat.
    expect(patronFeedSlot('government')).toBe(GOVERNING_SEAT_KEY);
    expect(patronFeedSlot('nonsense')).toBe(GOVERNING_SEAT_KEY);
  });

  test('the feed pull is zero below the vouch floor and bounded above by the ceiling', () => {
    expect(feedPull01(0)).toBe(0);
    expect(feedPull01(BROKERAGE_STAMP_TUNING.CHANNEL_VOUCH_FLOOR - 0.001)).toBe(0);
    expect(feedPull01(BROKERAGE_STAMP_TUNING.CHANNEL_VOUCH_FLOOR)).toBeGreaterThan(0);
    expect(feedPull01(INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING)).toBeLessThan(1);
  });

  test('the market feeds the channels it vouches for and DECLINES the one it does not', () => {
    const edges = patronFeedEdges({ worldState: worldOf(LIT_RULES), item: A });
    expect(edges.length).toBe(1);
    const channels = Object.keys(edges[0].pullByChannel).sort();
    // A covert house has no seat in any congregation: faith is BELOW its vouch floor, so
    // the channel is absent from the edge entirely (drop-when-empty), while war and
    // politics are present. The two positives anchor the negative.
    expect(channels).toEqual(['politics', 'war']);
    expectAbsentWithAnchor(channels, 'faith', 'war', 'whisper market feed channels');
    expect(edges[0].slot).toBe('criminal');
    expect(edges[0].covert).toBe(true);
  });

  test('MEASURED — the patron slot moves toward truth and the seat does not', () => {
    const dark = advance(DARK_RULES);
    const lit = advance(LIT_RULES);
    const darkPatron = dark.next.aaa.criminal.bbb;
    const litPatron = lit.next.aaa.criminal.bbb;

    // The truth is a strong, hostile neighbour; the stale belief said weak and friendly.
    expect(darkPatron.strengthBand).toBe(0);
    expect(litPatron.strengthBand).toBeGreaterThan(darkPatron.strengthBand);
    expect(litPatron.confidence01).toBeGreaterThan(darkPatron.confidence01);
    // CALIBRATION, not omniscience: confidence rises to the pull and stops well short of
    // certainty, and the band is pulled part of the way rather than assigned.
    expect(litPatron.confidence01).toBeLessThan(INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING);

    // AND NOT OTHERS: the faith axis is untouched (a declined channel), and the SEAT slot
    // is untouched entirely (the feed goes to the patron, not to the council).
    expect(litPatron.faithLabel).toBe(darkPatron.faithLabel);
    expect(JSON.stringify(lit.next.aaa[GOVERNING_SEAT_KEY]))
      .toBe(JSON.stringify(dark.next.aaa[GOVERNING_SEAT_KEY]));
  });

  test('DORMANCY — a dark advance hands the belief engine its own object, by identity', () => {
    const maps = { aaa: { criminal: { bbb: belief(0, 'friendly') } } };
    const same = applyPatronFeeds({
      maps, worldState: worldOf(DARK_RULES), byId: new Map([['aaa', A]]),
      truthFor: () => belief(4, 'hostile'), now: 5,
    });
    expect(same).toBe(maps);
    // LIVENESS ANCHOR: the identical call with the flag lit returns a DIFFERENT object,
    // so the identity above measures the gate rather than a no-op function.
    const moved = applyPatronFeeds({
      maps, worldState: worldOf(LIT_RULES), byId: new Map([['aaa', A]]),
      truthFor: () => belief(4, 'hostile'), now: 5,
    });
    expect(moved).not.toBe(maps);
    expect(JSON.stringify(advance(DARK_RULES).next)).toBe(JSON.stringify(advance(DARK_RULES).next));
  });
});

describe('W-I I3/I4 — THE KNOWLEDGE LANE GAINS ITS INSTITUTIONAL GENERATORS', () => {
  const A = itemOf('aaa', [EXCHANGE, MARKET]);
  const B = { id: 'bbb', settlement: { name: 'bbb', institutions: [], factions: [], powerStructure: { factions: [] } } };
  const C = { id: 'ccc', settlement: { name: 'ccc', institutions: [], factions: [], powerStructure: { factions: [] } } };

  /** @param {Record<string, unknown>} rules */
  function snapshotOf(rules) {
    const world = worldOf(rules);
    world.spatialLedgers.beliefMaps.aaa[GOVERNING_SEAT_KEY] = { bbb: belief(2, 'hostile') };
    world.spatialLedgers.beliefMaps.ccc = { [GOVERNING_SEAT_KEY]: { bbb: belief(2, 'neutral') } };
    return {
      settlements: [A, B, C],
      byId: new Map([['aaa', A], ['bbb', B], ['ccc', C]]),
      worldState: world,
      regionalGraph: { edges: [{ from: 'aaa', to: 'bbb', type: 'hostile', relationshipType: 'hostile' }] },
    };
  }

  test('all four acts are generated, one per settlement per tick, over a rotation', () => {
    const seen = new Set();
    for (let tick = 0; tick < 8; tick += 1) {
      const candidates = evaluateBrokerageServiceRules(snapshotOf(LIT_RULES), null, { tick });
      expect(candidates.length).toBeLessThanOrEqual(1);
      for (const candidate of candidates) seen.add(candidate.candidateType);
    }
    expect([...seen].sort()).toEqual([...BROKERAGE_ACTS].sort());
  });

  test('EVERY act classifies into the knowledge family, on its own vocabulary', () => {
    const classified = [];
    for (let tick = 0; tick < 8; tick += 1) {
      for (const candidate of evaluateBrokerageServiceRules(snapshotOf(LIT_RULES), null, { tick })) {
        classified.push([candidate.candidateType, moverFamilyOf(candidate)]);
      }
    }
    expect(classified.length).toBeGreaterThan(0);
    for (const [act, family] of classified) expect([act, family]).toEqual([act, 'knowledge']);

    // THE CLASSIFIER DISCRIMINATES: the identical record typed the way the applier used
    // to require would file under politics instead, which is the whole reason the applier
    // now keys on the payload. Without this control the assertion above proves nothing
    // about the classifier.
    const paid = evaluateBrokerageServiceRules(snapshotOf(LIT_RULES), null, { tick: 2 })[0];
    expect(paid.factionPatch).toBeTruthy();
    expect(moverFamilyOf({ ...paid, type: 'faction' })).toBe('politics');
  });

  test('a paid act carries a real charge; the free acts carry none', () => {
    const byAct = new Map();
    for (let tick = 0; tick < 8; tick += 1) {
      for (const candidate of evaluateBrokerageServiceRules(snapshotOf(LIT_RULES), null, { tick })) {
        byAct.set(candidate.candidateType, candidate);
      }
    }
    for (const act of ['brokerage_query', 'brokerage_plant']) {
      const candidate = byAct.get(act);
      expect(candidate.factionId).toBeTruthy();
      expect(candidate.factionPatch.momentum).toBeLessThan(0.9);
    }
    for (const act of ['brokerage_feed', 'brokerage_intercept']) {
      expect(byAct.get(act).factionPatch).toBeUndefined();
    }
  });

  test('DORMANCY — a dark flag yields no candidate at all', () => {
    for (let tick = 0; tick < 8; tick += 1) {
      expect(evaluateBrokerageServiceRules(snapshotOf(DARK_RULES), null, { tick })).toEqual([]);
    }
    // LIVENESS ANCHOR for those empties: the same ticks lit produce acts.
    expect(evaluateBrokerageServiceRules(snapshotOf(LIT_RULES), null, { tick: 0 }).length).toBe(1);
  });

  test('THE DISPLAY CENSUS the shared literal walkers cannot see (dynamic mint idiom)', () => {
    // The two shared walkers scan for `candidateType: '<literal>'` and disclaim dynamic
    // mints; this producer mints from a variable, as strategy_${move} and npc_${family}
    // already do. The same three invariants are therefore enforced HERE, over the closed
    // act list itself, so the acts are inside a census rather than through a hole in one.
    for (const act of BROKERAGE_ACTS) {
      const phrase = whatPhrase(act);
      expect(phrase).toBeTruthy();
      // anchored: phrase is asserted truthy above and asserted to contain the act's own stem below, so an empty or unrelated phrase reds there instead of passing this underscore check.
      expect(phrase).not.toMatch(/_/); // never a raw slug in prose
      expect(phrase).toContain('brokerage');
      expect(newsVoiceCategory({ impactKind: act })).toBeNull(); // borrows no crier's voice
      expect(HERALD_SECTIONS).toContain(SECTION_OF(act)); // routes to a real section
    }
    // RECORDED GAP (deliberate, not a defect): the routing above is the declared
    // catch-all rather than an explicit entry, because the explicit registration is a
    // one-line PREFIX_RULES addition in src/domain/realm/heraldRouting.js and that file
    // belongs to another session this wave. The section it lands on is the same either way.
    expect(SECTION_OF('brokerage_query')).toBe('events');
  });
});
