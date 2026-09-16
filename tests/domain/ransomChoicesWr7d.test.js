/**
 * ransomChoicesWr7d.test.js — WR-7d's two courts, and the man they leave behind.
 *
 * Amendment O runs BOTH ends of a ransom through character and books. The pin
 * that matters most here is the negative one: POVERTY IS NOT BETRAYAL. A realm
 * that cannot raise the price is REFUSING, and minting an abandonment grievance
 * against it would make every poor court a traitor to its own people.
 *
 * The temperament pin is the other load-bearing one — the same claim, the same
 * treasury, two tempers, two answers. Without it, disposition is decoration.
 *
 * @enforced-by this file
 */
import { describe, expect, it } from 'vitest';

import {
  ABANDONMENT_GRIEVANCE_KIND,
  CAPTOR_CHOICES,
  HOME_ANSWERS,
  abandonmentGrievance,
  captorRansomChoice,
  homeRansomAnswer,
  normalizeCaptorCourt,
  normalizeHomeCourt,
} from '../../src/domain/worldPulse/ransomChoices.js';

const captor = (patch = {}) => ({
  settlementId: 'iron',
  rulerPresent: true,
  lawfulnessBand: 'balanced',
  moralityBand: 'balanced',
  securityBand: 'holding',
  leverageBand: 'useful',
  ...patch,
});

const home = (patch = {}) => ({
  settlementId: 'reed',
  rulerPresent: true,
  lawfulnessBand: 'balanced',
  moralityBand: 'balanced',
  securityBand: 'holding',
  meansBand: 'comfortable',
  regardBand: 'valued',
  ...patch,
});

const claim = (claim01 = 0.18) => ({
  kind: 'coalition_reimbursement',
  claimantId: 'iron',
  debtorId: 'reed',
  claim01,
  atTick: 20,
  subject: { kind: 'person', npcId: 'npc.envoy.reed.ilsa' },
});

const heldRow = {
  npcId: 'npc.envoy.reed.ilsa', captorId: 'iron', heldSinceTick: 10,
};

describe('WR-7d — the courts are closed records or they are nothing', () => {
  it('rejects a court whose bands are not the closed vocabulary', () => {
    expect(normalizeCaptorCourt(captor())).toMatchObject({ settlementId: 'iron' });
    expect(normalizeHomeCourt(home())).toMatchObject({ settlementId: 'reed' });
    expect(normalizeCaptorCourt(captor({ leverageBand: 'total' }))).toBeNull();
    expect(normalizeHomeCourt(home({ meansBand: 'rich' }))).toBeNull();
    expect(normalizeHomeCourt(home({ regardBand: 'adored' }))).toBeNull();
    // Every field is load-bearing, so a stray one is a rejection.
    expect(normalizeCaptorCourt({ ...captor(), extra: 1 })).toBeNull();
    expect(normalizeHomeCourt(home({ rulerPresent: 'yes' }))).toBeNull();
  });
});

describe('WR-7d — the captor chooses', () => {
  it('will not sell a man whose captivity IS the campaign', () => {
    const decisive = captorRansomChoice({
      captor: captor({ leverageBand: 'decisive' }), dwellBand: 'protracted', claimOpen: true,
    });
    expect(decisive).toMatchObject({ choice: 'hold', basis: 'war_leverage' });
    // Not even a merciful captor sells him: the war book outranks the temper.
    expect(captorRansomChoice({
      captor: captor({ leverageBand: 'decisive', moralityBand: 'merciful' }),
      dwellBand: 'protracted',
      claimOpen: true,
    }).choice).toBe('hold');
  });

  it('lets character decide when the war book is quiet — both directions', () => {
    // TEMPERAMENT IS LOAD-BEARING: identical leverage, identical dwell, two
    // tempers, two different men walking out of that hall or not.
    const merciful = captorRansomChoice({
      captor: captor({ moralityBand: 'merciful', leverageBand: 'none' }),
      dwellBand: 'protracted',
      claimOpen: true,
    });
    const malicious = captorRansomChoice({
      captor: captor({ moralityBand: 'malicious', leverageBand: 'useful' }),
      dwellBand: 'protracted',
      claimOpen: true,
    });
    expect(merciful).toMatchObject({ choice: 'release', basis: 'character' });
    expect(malicious).toMatchObject({ choice: 'hold', basis: 'character' });
    expect(merciful.choice).not.toBe(malicious.choice);
  });

  it('holds rather than prices while the dwell gate is still shut', () => {
    const early = captorRansomChoice({
      captor: captor(), dwellBand: 'fresh', claimOpen: false,
    });
    expect(early).toMatchObject({ choice: 'hold', basis: 'dwell_gate_shut' });
    const open = captorRansomChoice({
      captor: captor(), dwellBand: 'settled', claimOpen: true,
    });
    expect(open).toMatchObject({ choice: 'ransom', basis: 'books' });
    expect(CAPTOR_CHOICES).toContain(open.choice);
  });

  it('refuses an unreadable captor rather than choosing on its behalf', () => {
    expect(captorRansomChoice({ captor: {}, dwellBand: 'settled' }).reason).toBe('invalid_captor');
    expect(captorRansomChoice({ captor: captor(), dwellBand: '' }).reason).toBe('invalid_dwell');
    expect(captorRansomChoice({ captor: captor(), dwellBand: 'settled' }).choice).toBe('hold');
  });
});

describe('WR-7d — the home answers, and abandonment is not refusal', () => {
  it('POVERTY IS NOT BETRAYAL: a destitute realm refuses without abandoning', () => {
    const broke = homeRansomAnswer({ home: home({ meansBand: 'destitute' }), claim: claim() });
    expect(broke).toMatchObject({ answer: 'refuse', basis: 'means', abandoned: false });
    // Even a court that had forgotten him is only refusing when it is destitute:
    // it never had the choice that abandonment requires.
    const brokeAndCold = homeRansomAnswer({
      home: home({ meansBand: 'destitute', regardBand: 'forgotten' }), claim: claim(),
    });
    expect(brokeAndCold.abandoned).toBe(false);
    expect(brokeAndCold.answer).toBe('refuse');
  });

  it('ABANDONS a man it could have bought back and did not want', () => {
    const forgotten = homeRansomAnswer({
      home: home({ regardBand: 'forgotten' }), claim: claim(),
    });
    expect(forgotten).toMatchObject({
      answer: 'abandon', basis: 'seat_writes_him_off', abandoned: true,
    });
    // A malicious seated ruler writes off a merely valued man too.
    expect(homeRansomAnswer({
      home: home({ moralityBand: 'malicious' }), claim: claim(),
    }).answer).toBe('abandon');
    // But nobody abandons the beloved.
    expect(homeRansomAnswer({
      home: home({ moralityBand: 'malicious', regardBand: 'beloved' }), claim: claim(),
    })).toMatchObject({ answer: 'pay', abandoned: false });
    expect(HOME_ANSWERS).toEqual(['pay', 'refuse', 'abandon']);
  });

  it('lets the price decide for a strained court, and the temper decide for two alike', () => {
    const cheap = homeRansomAnswer({ home: home({ meansBand: 'strained' }), claim: claim(0.1) });
    const dear = homeRansomAnswer({ home: home({ meansBand: 'strained' }), claim: claim(0.4) });
    expect(cheap.answer).toBe('pay');
    expect(dear.answer).toBe('refuse');
    expect(dear.abandoned).toBe(false);
    // THE TEMPERAMENT PIN: same means, same claim, two courts, two answers —
    // and the difference is not the money.
    const kind = homeRansomAnswer({ home: home(), claim: claim(0.4) });
    const cold = homeRansomAnswer({ home: home({ moralityBand: 'malicious' }), claim: claim(0.4) });
    expect(kind.answer).toBe('pay');
    expect(cold.answer).toBe('abandon');
  });

  it('refuses an unreadable court or an empty claim', () => {
    expect(homeRansomAnswer({ home: {}, claim: claim() }).reason).toBe('invalid_home');
    expect(homeRansomAnswer({ home: home(), claim: claim(0) }).reason).toBe('invalid_claim');
    expect(homeRansomAnswer({ home: home() }).answer).toBe('');
  });
});

describe('WR-7d — the abandoned soul comes home carrying it PERSONALLY', () => {
  it('mints a grievance whose holder is the man, not his realm', () => {
    const answer = homeRansomAnswer({ home: home({ regardBand: 'forgotten' }), claim: claim() });
    const minted = abandonmentGrievance({
      answer, hold: heldRow, homeId: 'reed', returnedTick: 44,
    });
    expect(minted.reason).toBe('minted');
    expect(minted.grievance).toMatchObject({
      kind: ABANDONMENT_GRIEVANCE_KIND,
      // THE POINT: a realm cannot settle this by settling with another realm,
      // because the party holding it is a person with a name.
      holderNpcId: 'npc.envoy.reed.ilsa',
      againstSettlementId: 'reed',
      captorId: 'iron',
      heldSinceTick: 10,
      returnedTick: 44,
    });
  });

  it('mints NOTHING for a refusal, a payment, or a return nobody can date', () => {
    for (const court of [home(), home({ meansBand: 'destitute' }), home({ regardBand: 'beloved' })]) {
      const answer = homeRansomAnswer({ home: court, claim: claim(0.4) });
      expect(answer.abandoned, JSON.stringify(court.meansBand)).toBe(false);
      expect(abandonmentGrievance({
        answer, hold: heldRow, homeId: 'reed', returnedTick: 44,
      })).toMatchObject({ grievance: null, reason: 'not_abandoned' });
    }
    // An abandonment nobody can place in time is not a record.
    const abandoned = homeRansomAnswer({ home: home({ regardBand: 'forgotten' }), claim: claim() });
    expect(abandonmentGrievance({ answer: abandoned, hold: heldRow, homeId: 'reed' }).reason)
      .toBe('invalid_return');
    expect(abandonmentGrievance({
      answer: abandoned, hold: {}, homeId: 'reed', returnedTick: 44,
    }).grievance).toBeNull();
    // And a forged answer claiming abandonment without the flag mints nothing.
    expect(abandonmentGrievance({
      answer: { answer: 'abandon', abandoned: false }, hold: heldRow, homeId: 'reed', returnedTick: 44,
    }).reason).toBe('not_abandoned');
  });
});
