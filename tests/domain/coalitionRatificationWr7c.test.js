/**
 * coalitionRatificationWr7c.test.js — WR-7c's two-level authority.
 *
 * K.6 gives a carried sheet two gates: the member's own book, and the
 * coalition's weighted majority of legitimate powers — which may VETO a
 * member's own ruler. K4 forbids any merged estimate: each member votes on its
 * own picture, and the prohibition is structural (one picture per ballot, never
 * the same picture twice, no signature anywhere that takes two).
 *
 * THE FIXTURES ARE REAL. Every term sheet in this file is drafted by
 * `negotiateFromPictures` — the actual WR-7b producer — so the ballots are cast
 * against an artifact the engine really mints, not a hand-written stand-in.
 *
 * The jewel is `unanimousInJudgment && splitInFact`: three courts all wanting
 * peace, voting three different ways, because each heard from its own envoy.
 *
 * RULING R-BLD-7 is pinned in the competing-offers block: a rival sheet is
 * measured against the UNION coalition's weight, so a unanimous sub-tally of
 * three cannot outrank a coalition of thirty that refused.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  BALLOT_DECISIONS,
  RATIFICATION_TUNING,
  RATIFICATION_VERDICTS,
  castRatificationBallot,
  chooseAmongCompetingOffers,
  normalizeRatificationBallot,
  ratificationPowerWeight,
  ratifyTermSheet,
} from '../../src/domain/worldPulse/coalitionRatification.js';
import {
  createNegotiationPicture,
  negotiateFromPictures,
} from '../../src/domain/worldPulse/negotiationPictures.js';
import { TESTIMONY_DESIRED_OUTCOMES } from '../../src/domain/worldPulse/envoyTestimony.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

function subject(settlementId, patch = {}) {
  return {
    settlementId,
    strengthBand: 'ready',
    storesBand: 'stocked',
    foodPressureBand: 'present',
    economyPressureBand: 'present',
    tradePressureBand: 'present',
    threatBand: 'present',
    allyStrengthBand: 'present',
    restitutionClaimBand: 'quiet',
    warExhaustionBand: 'present',
    governingArchetype: 'other',
    alignmentPressBand: 'measured',
    exportKnowledge: 'known',
    exports: [],
    ...patch,
  };
}

/**
 * One court's frozen picture of the SAME bilateral war. What varies between
 * members is only how strong each believes the victor to be — which is exactly
 * what differs when each court heard from its own envoy.
 */
function picture({ id, partyId, counterpartId, carrier, ironBand = 'dominant', reedBand = 'strained' }) {
  return createNegotiationPicture({
    id,
    carrier,
    partyId,
    counterpartId,
    relationshipKey: 'edge.iron.reed',
    episodeKey: 'war.iron.reed.4',
    frontOwnerId: 'iron',
    frontSinceTick: 4,
    capturedTick: 10,
    causeStatus: 'live',
    subjects: [
      subject('iron', { strengthBand: ironBand, governingArchetype: 'merchant', alignmentPressBand: 'hard' }),
      subject('reed', { strengthBand: reedBand, storesBand: 'thin', exports: ['Silver'] }),
    ],
    evidenceIds: ['decision.peace.iron.10'],
  });
}

const ironPicture = () => picture({
  id: 'picture.iron', partyId: 'iron', counterpartId: 'reed', carrier: { kind: 'envoy', id: 'npc.envoy.iron' },
});

/** The sheet the two principals actually agreed at the parlay. */
function agreedSheet(termSheetId = 'term_sheet.iron.reed.12') {
  const drafted = negotiateFromPictures({
    termSheetId,
    errandId: 'envoy_errand.iron.reed.10',
    encounterId: 'encounter.field.iron.reed.12',
    episodeKey: 'war.iron.reed.4',
    relationshipKey: 'edge.iron.reed',
    proposerId: 'iron',
    responderId: 'reed',
    victorId: 'iron',
    loserId: 'reed',
    agreedTick: 12,
    proposerPicture: ironPicture(),
    responderPicture: picture({
      id: 'picture.reed.principal', partyId: 'reed', counterpartId: 'iron', carrier: { kind: 'army', id: 'army.reed' },
    }),
  });
  expect(drafted.agreed).toBe(true);
  return drafted.termSheet;
}

function member(memberId, patch = {}) {
  return {
    memberId,
    sideId: 'reed',
    counterpartId: 'iron',
    powerBand: 'ordinary',
    seatPresent: false,
    seatDecision: null,
    desiredOutcome: 'peace',
    ...patch,
  };
}

/** The three pictures the three allied courts hold of the same war. */
const memberPicture = (id, ironBand, carrierId) => picture({
  id, partyId: 'reed', counterpartId: 'iron', carrier: { kind: 'envoy', id: carrierId }, ironBand,
});

function ballotsOfThreeCourts(sheet, patches = {}) {
  const rows = [
    // ACCEPTS: this court's envoy reported a crushing iron, so iron's demand is
    // exactly what this court would itself have conceded.
    ['reed', 'picture.reed.a', 'dominant', 'npc.envoy.a'],
    // REFUSES ON PRICE: a slightly staler picture prices the war closer, so the
    // same sheet now costs more than this court believes it owes.
    ['ash', 'picture.ash.b', 'strong', 'npc.envoy.b'],
    // REFUSES ON ORIENTATION: this court's envoy came home believing the two
    // sides are spent alike, and an even war owes nothing at all.
    ['thorn', 'picture.thorn.c', 'strained', 'npc.envoy.c'],
  ];
  return rows.map(([memberId, pictureId, ironBand, carrierId]) => {
    const cast = castRatificationBallot({
      member: member(memberId, patches[memberId] || {}),
      picture: memberPicture(pictureId, ironBand, carrierId),
      termSheet: sheet,
    });
    expect(cast.reason, memberId).toBe('cast');
    return cast.ballot;
  });
}

describe('WR-7c — level one: the member reads the sheet through its own picture', () => {
  it('casts a ballot naming exactly one picture, and records which book decided', () => {
    const sheet = agreedSheet();
    const cast = castRatificationBallot({
      member: member('reed'),
      picture: memberPicture('picture.reed.a', 'dominant', 'npc.envoy.a'),
      termSheet: sheet,
    });
    expect(cast.reason).toBe('cast');
    expect(cast.ballot).toMatchObject({
      memberId: 'reed',
      sideId: 'reed',
      pictureId: 'picture.reed.a',
      decision: 'accept',
      authority: 'realm',
      seatDecision: null,
      realmDecision: 'accept',
    });
    expect(Object.keys(cast.ballot)).toContain('reason');
  });

  it('lets a living seat overrule its own realm, and says which book cast the vote', () => {
    const sheet = agreedSheet();
    const cast = castRatificationBallot({
      // The realm's own picture says this sheet is bearable; the ruler refuses
      // anyway. Amendment G: two books, and the seat holds the pen.
      member: member('reed', { seatPresent: true, seatDecision: 'refuse' }),
      picture: memberPicture('picture.reed.a', 'dominant', 'npc.envoy.a'),
      termSheet: sheet,
    });
    expect(cast.ballot).toMatchObject({
      decision: 'refuse', authority: 'seat', seatDecision: 'refuse', realmDecision: 'accept',
    });
  });

  it('will not invent a ruler, borrow another edge, or read another side\'s picture', () => {
    const sheet = agreedSheet();
    // An absent seat carrying a decision is a ruler nobody seated.
    expect(castRatificationBallot({
      member: member('reed', { seatPresent: false, seatDecision: 'accept' }),
      picture: memberPicture('picture.reed.a', 'dominant', 'npc.envoy.a'),
      termSheet: sheet,
    }).reason).toBe('invalid_member');
    // A member standing on an edge this sheet does not cover cannot ratify it.
    expect(castRatificationBallot({
      member: member('reed', { sideId: 'reed', counterpartId: 'gale' }),
      picture: memberPicture('picture.reed.a', 'dominant', 'npc.envoy.a'),
      termSheet: sheet,
    }).reason).toBe('foreign_edge');
    // The victor's own picture is not this coalition's to vote with.
    expect(castRatificationBallot({
      member: member('reed'),
      picture: ironPicture(),
      termSheet: sheet,
    }).reason).toBe('foreign_picture');
  });

  it('reads desiredOutcome from the ONE court-desire vocabulary, case and all', () => {
    // FINITE SEMANTICS. `desiredOutcome` decides `unanimousInJudgment`, which is
    // an EQUALITY over strings — so a second spelling of peace would not read as
    // a disagreement, it would read as a coalition that never agreed at all.
    // The vocabulary is declared once, in envoyTestimony.js, and imported here
    // from there: this loop proves the ratification module accepts exactly it.
    const sheet = agreedSheet();
    expect(TESTIMONY_DESIRED_OUTCOMES.length).toBeGreaterThan(1);
    for (const outcome of TESTIMONY_DESIRED_OUTCOMES) {
      const cast = castRatificationBallot({
        member: member('reed', { desiredOutcome: outcome }),
        picture: memberPicture('picture.reed.a', 'dominant', 'npc.envoy.a'),
        termSheet: sheet,
      });
      expect(cast.reason, outcome).toBe('cast');
      expect(cast.ballot.desiredOutcome).toBe(outcome);
    }
    // Case drift, whitespace drift, and a plausible synonym are all rejected
    // rather than silently carried onto the tally as a fourth wish.
    for (const drift of ['Peace', 'PEACE', ' peace', 'peace ', 'make_peace', 'ceasefire', '']) {
      expect(castRatificationBallot({
        member: member('reed', { desiredOutcome: drift }),
        picture: memberPicture('picture.reed.a', 'dominant', 'npc.envoy.a'),
        termSheet: sheet,
      }).reason, JSON.stringify(drift)).toBe('invalid_member');
    }
  });

  it('rejects a ballot whose recorded decision does not follow from its own authority', () => {
    const honest = normalizeRatificationBallot({
      memberId: 'reed',
      sideId: 'reed',
      counterpartId: 'iron',
      episodeKey: 'war.iron.reed.4',
      termSheetId: 'term_sheet.iron.reed.12',
      pictureId: 'picture.reed.a',
      powerBand: 'ordinary',
      decision: 'accept',
      authority: 'realm',
      seatDecision: null,
      realmDecision: 'accept',
      desiredOutcome: 'peace',
      reason: 'bounded',
    });
    expect(honest).toBeTruthy();
    for (const patch of [
      { decision: 'refuse' },
      { authority: 'seat' },
      { authority: 'realm', seatDecision: 'accept' },
      { powerBand: 'imperial' },
      { desiredOutcome: 'Peace' },
      { desiredOutcome: 'glory' },
    ]) {
      expect(normalizeRatificationBallot({ ...honest, ...patch }), JSON.stringify(patch)).toBeNull();
    }
  });
});

describe('WR-7c — level two: the coalition rules, and may veto a member\'s ruler', () => {
  it('weighs the legitimate powers rather than counting heads', () => {
    expect(RATIFICATION_POWERS_ARE_ORDERED()).toBe(true);
    const sheet = agreedSheet();
    const [reed, ash, thorn] = ballotsOfThreeCourts(sheet);
    // One principal accepting outweighs two minor powers refusing.
    const tally = ratifyTermSheet({
      ballots: [
        { ...reed, powerBand: 'principal' },
        { ...ash, powerBand: 'minor' },
        { ...thorn, powerBand: 'minor' },
      ],
      closeBand01: 0,
    });
    expect(tally.reason).toBe('tallied');
    expect({ accept: tally.acceptWeight, refuse: tally.refuseWeight }).toEqual({ accept: 3, refuse: 2 });
    expect(tally.verdict).toBe('ratified');
    expect(RATIFICATION_VERDICTS).toContain(tally.verdict);
  });

  function RATIFICATION_POWERS_ARE_ORDERED() {
    return ratificationPowerWeight('minor') < ratificationPowerWeight('ordinary')
      && ratificationPowerWeight('ordinary') < ratificationPowerWeight('principal')
      && ratificationPowerWeight('imperial') === 0;
  }

  it('overrules a member\'s own ruler when the coalition rules against that seat', () => {
    const sheet = agreedSheet();
    const ballots = ballotsOfThreeCourts(sheet, {
      // Two seated rulers refuse; a third principal court accepts and carries it.
      ash: { seatPresent: true, seatDecision: 'refuse' },
      thorn: { seatPresent: true, seatDecision: 'refuse' },
    });
    const tally = ratifyTermSheet({
      ballots: [
        { ...ballots[0], powerBand: 'principal' },
        { ...ballots[1], powerBand: 'minor' },
        { ...ballots[2], powerBand: 'minor' },
      ],
      closeBand01: 0,
    });
    expect(tally.verdict).toBe('ratified');
    // THE COALITION VETO: both seats are bound to a peace they refused, and the
    // record names them, because being overruled is a fact their own powers read.
    expect(tally.overruled).toEqual([
      { memberId: 'ash', seatDecision: 'refuse', boundTo: 'accept' },
      { memberId: 'thorn', seatDecision: 'refuse', boundTo: 'accept' },
    ]);
  });

  it('overrules nobody on a close vote, because a close vote has no ruling to impose', () => {
    const sheet = agreedSheet();
    const ballots = ballotsOfThreeCourts(sheet, {
      ash: { seatPresent: true, seatDecision: 'refuse' },
    });
    const tally = ratifyTermSheet({ ballots, closeBand01: RATIFICATION_TUNING.CLOSE_BAND_01 });
    // 2 accept-weight against 4: a one-third margin is decisive, so widen the
    // close band far enough to make the same tally close and watch the veto stop.
    expect(tally.verdict).toBe('refused');
    expect(tally.overruled).toHaveLength(0); // the refusing seat agrees with the ruling
    const close = ratifyTermSheet({ ballots, closeBand01: 0.9 });
    expect(close.verdict).toBe('close');
    expect(close.overruled).toEqual([]);
  });

  it('reports a genuine deadlock as close rather than breaking the tie itself', () => {
    const sheet = agreedSheet();
    const [reed, ash] = ballotsOfThreeCourts(sheet);
    const tally = ratifyTermSheet({ ballots: [reed, ash], closeBand01: 0 });
    expect({ accept: tally.acceptWeight, refuse: tally.refuseWeight }).toEqual({ accept: 2, refuse: 2 });
    expect(tally.margin01).toBe(0);
    expect(tally.verdict).toBe('close');
  });

  it('refuses a tally that mixes edges, sides, sheets, or reuses one picture twice', () => {
    const sheet = agreedSheet();
    const [reed, ash] = ballotsOfThreeCourts(sheet);
    expect(ratifyTermSheet({ ballots: [] }).reason).toBe('no_ballots');
    expect(ratifyTermSheet({ ballots: [reed, reed] }).reason).toBe('duplicate_member');
    expect(ratifyTermSheet({
      ballots: [reed, { ...ash, termSheetId: 'term_sheet.other' }],
    }).reason).toBe('sheet_mismatch');
    expect(ratifyTermSheet({
      ballots: [reed, { ...ash, sideId: 'gale' }],
    }).reason).toBe('side_mismatch');
    // K4, STRUCTURAL: two members voting on one picture is one observation
    // voting twice — the merged estimate arriving through the back door.
    expect(ratifyTermSheet({
      ballots: [reed, { ...ash, pictureId: reed.pictureId }],
    }).reason).toBe('shared_picture');
  });
});

describe('WR-7c — THE UNANIMOUS-IN-JUDGMENT, SPLIT-IN-FACT PIN (K4\'s best consequence)', () => {
  it('has three courts all wanting peace vote three different ways on one sheet', () => {
    const sheet = agreedSheet();
    const ballots = ballotsOfThreeCourts(sheet);
    // Every court wants the SAME outcome. Not one of them is arguing for war.
    expect(new Set(ballots.map((row) => row.desiredOutcome))).toEqual(new Set(['peace']));
    // And every court holds a DIFFERENT picture, because each heard from its own
    // envoy. Nothing about the world differs — only what each was told about it.
    expect(ballots.map((row) => row.pictureId))
      .toEqual(['picture.reed.a', 'picture.ash.b', 'picture.thorn.c']);
    // The votes split, and they split for three different reasons, each of them
    // an honest reading of the sheet under the picture that court actually has.
    expect(ballots.map((row) => `${row.memberId}:${row.decision}:${row.reason}`)).toEqual([
      'reed:accept:bounded',
      'ash:refuse:budget_refused',
      'thorn:refuse:orientation_refused',
    ]);

    const tally = ratifyTermSheet({ ballots, closeBand01: RATIFICATION_TUNING.CLOSE_BAND_01 });
    expect(tally.unanimousInJudgment).toBe(true);
    expect(tally.splitInFact).toBe(true);
    expect(tally.verdict).toBe('refused');
    // The receipt carries every court's own picture id, so the Herald can say
    // WHY a coalition that agreed about peace could not agree about this peace.
    expect(tally.ballots.map((row) => [row.memberId, row.pictureId, row.decision])).toEqual([
      ['ash', 'picture.ash.b', 'refuse'],
      ['reed', 'picture.reed.a', 'accept'],
      ['thorn', 'picture.thorn.c', 'refuse'],
    ]);
  });

  it('shows the same three courts agreeing the moment they share one picture', () => {
    // THE NEGATIVE CONTROL for the pin above: the split is caused by the divergent
    // pictures and nothing else. Give all three the same reading of the war and
    // the disagreement disappears — which is exactly why K4 forbids merging them.
    const sheet = agreedSheet();
    const ballots = [
      ['reed', 'picture.same.a', 'npc.envoy.a'],
      ['ash', 'picture.same.b', 'npc.envoy.b'],
      ['thorn', 'picture.same.c', 'npc.envoy.c'],
    ].map(([memberId, pictureId, carrierId]) => castRatificationBallot({
      member: member(memberId),
      picture: memberPicture(pictureId, 'dominant', carrierId),
      termSheet: sheet,
    }).ballot);
    expect(ballots.every(Boolean)).toBe(true);
    const tally = ratifyTermSheet({ ballots, closeBand01: RATIFICATION_TUNING.CLOSE_BAND_01 });
    expect(tally.splitInFact).toBe(false);
    expect(tally.verdict).toBe('ratified');
  });
});

describe('WR-7c — competing offers, and failure to choose', () => {
  /**
   * A REAL tally over REAL ballots. Every row goes through the actual ballot
   * normalizer and the actual weighted tally, so the offers this block decides
   * between are artifacts `ratifyTermSheet` really produces — including their
   * `ballots`, which is where the union coalition's weight is read from.
   */
  const tallyOfSide = (termSheetId, sideId, counterpartId, rows, closeBand01 = 0.15) => {
    const ballots = rows.map(({ memberId, powerBand, decision }) => normalizeRatificationBallot({
      memberId,
      sideId,
      counterpartId,
      episodeKey: 'war.iron.reed.4',
      termSheetId,
      pictureId: `picture.${termSheetId}.${memberId}`,
      powerBand,
      decision,
      authority: 'realm',
      seatDecision: null,
      realmDecision: decision,
      desiredOutcome: 'peace',
      reason: decision === 'accept' ? 'bounded' : 'budget_refused',
    }));
    expect(ballots.every(Boolean), termSheetId).toBe(true);
    const tally = ratifyTermSheet({ ballots, closeBand01 });
    expect(tally.reason, termSheetId).toBe('tallied');
    return tally;
  };

  const tallyOf = (termSheetId, rows, closeBand01 = 0.15) => (
    tallyOfSide(termSheetId, 'reed', 'iron', rows, closeBand01)
  );

  /** The whole coalition: 3 + 2 + 1 = 6 weight, and it never changes below. */
  const coalition = (decisions) => [
    { memberId: 'reed', powerBand: 'principal', decision: decisions[0] },
    { memberId: 'ash', powerBand: 'ordinary', decision: decisions[1] },
    { memberId: 'thorn', powerBand: 'minor', decision: decisions[2] },
  ];

  it('lets one sheet win only when it alone carries the coalition', () => {
    const chosen = chooseAmongCompetingOffers({
      tallies: [
        tallyOf('term_sheet.a', coalition(['accept', 'accept', 'refuse'])),
        tallyOf('term_sheet.b', coalition(['refuse', 'refuse', 'refuse'])),
      ],
    });
    expect(chosen).toMatchObject({
      verdict: 'ratified', reason: 'one_sheet_holds', chosenTermSheetId: 'term_sheet.a',
      unionWeight: 6,
    });
    // 5 of the coalition's 6 weight said yes to this sheet: the surplus over
    // the WHOLE coalition, not over the members who happened to vote on it.
    expect(chosen.offers.find((row) => row.termSheetId === 'term_sheet.a').unionMargin01)
      .toBe(Math.round(((2 * 5 - 6) / 6) * 10000) / 10000);
  });

  it('treats failure to choose between rival sheets AS the close-vote case', () => {
    // Two envoys came home from two counterparties with two different sheets and
    // neither carried the coalition. The design's rule is explicit: failure to
    // choose IS the close vote, so the compromise round opens on it.
    const stalemate = chooseAmongCompetingOffers({
      tallies: [
        // 3 of 6 for one sheet, 2 of 6 for the other: a dead-even coalition and
        // a minority, and neither is a majority of the whole.
        tallyOf('term_sheet.a', coalition(['accept', 'refuse', 'refuse'])),
        tallyOf('term_sheet.b', coalition(['refuse', 'accept', 'refuse'])),
      ],
    });
    expect(stalemate).toMatchObject({
      verdict: 'close', reason: 'no_sheet_holds_a_majority', chosenTermSheetId: null,
    });
    // Two sheets both holding is equally undecided — the coalition would be
    // ratifying two incompatible peaces at once.
    const both = chooseAmongCompetingOffers({
      tallies: [
        tallyOf('term_sheet.a', coalition(['accept', 'accept', 'refuse'])),
        tallyOf('term_sheet.b', coalition(['accept', 'accept', 'refuse'])),
      ],
    });
    expect(both).toMatchObject({ verdict: 'close', reason: 'rival_sheets_both_hold' });
  });

  it('R-BLD-7: a unanimous sub-tally of three does not outrank a coalition of thirty', () => {
    // ONE principal court's envoy came home with sheet A and that court alone
    // ratified it — unanimously, on its own little tally. Nine other principal
    // courts weighed sheet B and refused it. Reading each sheet against its OWN
    // tally would hand the coalition a peace three weight signed for, so the
    // denominator is the union: 3 + 27 = 30, and 3 is not a majority of 30.
    const alone = tallyOf('term_sheet.a', [
      { memberId: 'reed', powerBand: 'principal', decision: 'accept' },
    ]);
    const many = tallyOf('term_sheet.b', Array.from({ length: 9 }, (_, index) => ({
      memberId: `power.${index}`, powerBand: 'principal', decision: 'refuse',
    })));
    // The sub-tally really did ratify itself — that is the whole trap.
    expect({ verdict: alone.verdict, accept: alone.acceptWeight }).toEqual({ verdict: 'ratified', accept: 3 });
    expect({ verdict: many.verdict, refuse: many.refuseWeight }).toEqual({ verdict: 'refused', refuse: 27 });

    const chosen = chooseAmongCompetingOffers({ tallies: [alone, many] });
    expect(chosen).toMatchObject({
      verdict: 'close', reason: 'no_sheet_holds_a_majority', chosenTermSheetId: null,
      unionWeight: 30,
    });
    expect(chosen.offers.map((row) => [row.termSheetId, row.verdict, row.holds])).toEqual([
      ['term_sheet.a', 'ratified', false],
      ['term_sheet.b', 'refused', false],
    ]);
  });

  it('reads the union from the ballots, and fails closed when it cannot', () => {
    const good = tallyOf('term_sheet.a', coalition(['accept', 'accept', 'refuse']));
    const rival = tallyOf('term_sheet.b', coalition(['refuse', 'refuse', 'refuse']));
    // An offer with no ballots carries no coalition to measure against.
    expect(chooseAmongCompetingOffers({
      tallies: [{ ...good, ballots: [] }, rival],
    }).reason).toBe('offer_without_ballots');
    // The same court cannot be a principal on one sheet and a minor on the
    // other: that coalition has two different total weights and neither is real.
    const shifted = tallyOf('term_sheet.b', [
      { memberId: 'reed', powerBand: 'minor', decision: 'refuse' },
      { memberId: 'ash', powerBand: 'ordinary', decision: 'refuse' },
    ]);
    expect(chooseAmongCompetingOffers({ tallies: [good, shifted] }).reason)
      .toBe('member_band_mismatch');
  });

  it('answers a sole offer from its own union math, and lands on the tally\'s verdict', () => {
    // R-BLD-8b: the sole verdict is DERIVED from the signed union margin, not
    // copied off the carried tally. With one tally the union IS that tally, so
    // the derived answer must equal the carried one — that equality is the
    // proof the derivation is the same law, and it is asserted here across a
    // ratified, a refused and a close sole offer rather than assumed.
    const cases = [
      [coalition(['accept', 'accept', 'accept']), 'ratified', 'term_sheet.a'],
      [coalition(['refuse', 'refuse', 'refuse']), 'refused', null],
      [coalition(['accept', 'refuse', 'refuse']), 'close', null],
    ];
    for (const [rows, verdict, chosenTermSheetId] of cases) {
      const tally = tallyOf('term_sheet.a', rows);
      expect(tally.verdict, verdict).toBe(verdict);
      const chosen = chooseAmongCompetingOffers({ tallies: [tally] });
      expect(chosen).toMatchObject({ verdict, reason: 'sole_offer', chosenTermSheetId });
      expect(chosen.offers[0].holds, verdict).toBe(verdict === 'ratified');
    }
  });

  it('R-BLD-8a: refuses a union built from two OPPOSITE sides of the same war', () => {
    // THE VERIFIER'S EXECUTED COUNTEREXAMPLE. Two tallies, one episode, and the
    // enemy on the other end of each: `reed`'s coalition weighed sheet A, and
    // `iron`'s coalition weighed sheet B. Nothing in the old read looked at the
    // side, so the union summed BOTH bodies into a nine-weight "coalition" that
    // never met, and sheet A cleared the band against a denominator that
    // included the very courts it was being imposed on.
    const ours = tallyOfSide('term_sheet.a', 'reed', 'iron', [
      { memberId: 'reed', powerBand: 'principal', decision: 'accept' },
      { memberId: 'ash', powerBand: 'principal', decision: 'accept' },
    ]);
    const theirs = tallyOfSide('term_sheet.b', 'iron', 'reed', [
      { memberId: 'flint', powerBand: 'principal', decision: 'refuse' },
    ]);
    // Both tallies are individually honest — that is what makes the trap a trap.
    expect([ours.verdict, ours.acceptWeight]).toEqual(['ratified', 6]);
    expect([theirs.verdict, theirs.acceptWeight]).toEqual(['refused', 0]);
    // Nine weight, six of it ours: (2·6 − 9)/9 = 0.3333, clear of the 0.15
    // band. The old arm would have answered `ratified` on `term_sheet.a`.
    expect(Math.round(((2 * 6 - 9) / 9) * 10000) / 10000).toBeGreaterThan(0.15);
    const chosen = chooseAmongCompetingOffers({ tallies: [ours, theirs] });
    expect(chosen).toMatchObject({
      verdict: '', reason: 'side_mismatch', chosenTermSheetId: null, unionWeight: 0,
    });
    // And the same two sheets on ONE side still decide normally — the refusal
    // is caused by the crossed edge and by nothing else about this fixture.
    const rival = tallyOfSide('term_sheet.b', 'reed', 'iron', [
      { memberId: 'flint', powerBand: 'principal', decision: 'refuse' },
    ]);
    expect(chooseAmongCompetingOffers({ tallies: [ours, rival] })).toMatchObject({
      verdict: 'ratified', reason: 'one_sheet_holds', chosenTermSheetId: 'term_sheet.a',
      unionWeight: 9,
    });
  });

  it('R-BLD-8b: refuses a band the tallies were not decided at, rather than contradicting itself', () => {
    // THE VERIFIER'S EXECUTED COUNTEREXAMPLE. The tally ratified at the 0.15
    // band; the chooser was called at 0.9. The offer's `holds` was recomputed
    // against 0.9 and came out false, while the arm copied the carried verdict
    // and answered `ratified` with a chosen sheet — a record that says a sheet
    // was ratified and, one field away, that it carries nobody.
    const tally = tallyOf('term_sheet.a', coalition(['accept', 'accept', 'refuse']), 0.15);
    expect([tally.verdict, tally.closeBand01]).toEqual(['ratified', 0.15]);
    const chosen = chooseAmongCompetingOffers({ tallies: [tally], closeBand01: 0.9 });
    expect(chosen).toMatchObject({
      verdict: '', reason: 'band_mismatch', chosenTermSheetId: null, closeBand01: 0.9,
    });
    // The cure for a widening round is to re-tally at the new band, not to
    // re-decide a stale verdict: the members' own votes move with the band too.
    const retallied = tallyOf('term_sheet.a', coalition(['accept', 'accept', 'refuse']), 0.9);
    expect(retallied.verdict).toBe('close');
    expect(chooseAmongCompetingOffers({ tallies: [retallied], closeBand01: 0.9 }))
      .toMatchObject({ verdict: 'close', reason: 'sole_offer', chosenTermSheetId: null });
  });

  it('R-BLD-8b: a sole offer can never say ratified while its own offer row does not hold', () => {
    // THE INVARIANT THE DERIVATION BUYS, walked rather than argued: over every
    // composition of the three courts at three bands, `verdict === 'ratified'`
    // and `offers[0].holds` are the SAME bit, and a chosen sheet exists exactly
    // when it holds. No forged input is needed — the arm is now incapable of
    // the contradiction by construction.
    let ratifiedSeen = 0;
    for (const band of [0, 0.15, 0.34]) {
      for (const a of BALLOT_DECISIONS) {
        for (const b of BALLOT_DECISIONS) {
          for (const c of BALLOT_DECISIONS) {
            const tally = tallyOf('term_sheet.a', coalition([a, b, c]), band);
            const chosen = chooseAmongCompetingOffers({ tallies: [tally], closeBand01: band });
            const label = `${band}:${a}${b}${c}`;
            expect(chosen.reason, label).toBe('sole_offer');
            expect(chosen.verdict === 'ratified', label).toBe(chosen.offers[0].holds);
            expect(chosen.chosenTermSheetId != null, label).toBe(chosen.offers[0].holds);
            // And the derivation still lands on the tally's own verdict.
            expect(chosen.verdict, label).toBe(tally.verdict);
            if (chosen.verdict === 'ratified') ratifiedSeen += 1;
          }
        }
      }
    }
    // The loop is not vacuous: ratified is genuinely reached inside it.
    expect(ratifiedSeen).toBeGreaterThan(0);

    // AND THE DERIVATION IS PROVED INDEPENDENT OF THE CARRIED VERDICT. Every
    // other field of this tally is honest — the ballots refuse, the accept
    // weight is the ballots' own 0, the band is the caller's — and only the
    // `verdict` string lies. A copied verdict would ratify it and name a chosen
    // sheet; a verdict read off the union margin cannot.
    const refused = tallyOf('term_sheet.a', coalition(['refuse', 'refuse', 'refuse']));
    expect(refused.verdict).toBe('refused');
    expect(chooseAmongCompetingOffers({ tallies: [{ ...refused, verdict: 'ratified' }] }))
      .toMatchObject({ verdict: 'refused', reason: 'sole_offer', chosenTermSheetId: null });
  });

  it('R-BLD-8c: recounts each offer\'s accept weight from the ballots and refuses a forged one', () => {
    // THE VERIFIER'S EXECUTED COUNTEREXAMPLE. `unionMargin01` divided a summary
    // field by a denominator the module counted itself, so a single forged
    // number outvoted the ballots: 999 against a union of 6 gives a margin of
    // 332, and the sheet the coalition actually refused would have been chosen.
    const honest = tallyOf('term_sheet.a', coalition(['accept', 'refuse', 'refuse']));
    const rival = tallyOf('term_sheet.b', coalition(['refuse', 'refuse', 'refuse']));
    expect(honest.acceptWeight).toBe(3);
    const forged = { ...honest, acceptWeight: 999 };
    expect(Math.round(((2 * 999 - 6) / 6) * 10000) / 10000).toBeGreaterThan(0.15);
    expect(chooseAmongCompetingOffers({ tallies: [forged, rival] })).toMatchObject({
      verdict: '', reason: 'accept_weight_mismatch', chosenTermSheetId: null, unionWeight: 0,
    });
    // Understating it is refused on the same law — the ballots are the record,
    // and the check is an equality, not a ceiling.
    expect(chooseAmongCompetingOffers({ tallies: [{ ...honest, acceptWeight: 0 }, rival] }).reason)
      .toBe('accept_weight_mismatch');
    // The unforged pair still decides, so the refusal is caused by the forgery.
    expect(chooseAmongCompetingOffers({ tallies: [honest, rival] }).reason)
      .toBe('no_sheet_holds_a_majority');
  });

  it('never averages two offers into a third that nobody signed', () => {
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/coalitionRatification.js'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    expect(source.length).toBeGreaterThan(1000);
    // A blended sheet would have to be constructed. These are the spellings by
    // which one could be, and the file is proven non-empty immediately above.
    for (const token of ['average', 'mergePictures', 'blend', 'midpoint', 'splitTheDifference']) {
      expect(source, `coalitionRatification must not ${token}`).not.toContain(token); // anchored: see above
    }
    // And no exported signature takes two pictures at once.
    expect(source).not.toMatch(/picture[A-Za-z]*\s*,\s*[a-z]*[Pp]icture/); // anchored: see above
    expect(BALLOT_DECISIONS).toEqual(['accept', 'refuse']);
  });
});
