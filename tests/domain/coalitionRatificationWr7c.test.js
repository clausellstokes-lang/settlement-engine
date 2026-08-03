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
  const tallyFor = (termSheetId, decisions) => ({
    verdict: '', reason: 'tallied', episodeKey: 'war.iron.reed.4', termSheetId,
    acceptWeight: decisions.accept, refuseWeight: decisions.refuse,
    totalWeight: decisions.accept + decisions.refuse,
    margin01: 0, closeBand01: 0.15,
    ...(decisions.verdict ? { verdict: decisions.verdict } : {}),
  });

  it('lets one sheet win only when it alone carries the coalition', () => {
    const chosen = chooseAmongCompetingOffers({
      tallies: [
        tallyFor('term_sheet.a', { accept: 5, refuse: 1, verdict: 'ratified' }),
        tallyFor('term_sheet.b', { accept: 1, refuse: 5, verdict: 'refused' }),
      ],
    });
    expect(chosen).toMatchObject({
      verdict: 'ratified', reason: 'one_sheet_holds', chosenTermSheetId: 'term_sheet.a',
    });
  });

  it('treats failure to choose between rival sheets AS the close-vote case', () => {
    // Two envoys came home from two counterparties with two different sheets and
    // neither carried the coalition. The design's rule is explicit: failure to
    // choose IS the close vote, so the compromise round opens on it.
    const stalemate = chooseAmongCompetingOffers({
      tallies: [
        tallyFor('term_sheet.a', { accept: 3, refuse: 3, verdict: 'close' }),
        tallyFor('term_sheet.b', { accept: 2, refuse: 4, verdict: 'refused' }),
      ],
    });
    expect(stalemate).toMatchObject({
      verdict: 'close', reason: 'no_sheet_holds_a_majority', chosenTermSheetId: null,
    });
    // Two sheets both holding is equally undecided — the coalition would be
    // ratifying two incompatible peaces at once.
    const both = chooseAmongCompetingOffers({
      tallies: [
        tallyFor('term_sheet.a', { accept: 5, refuse: 1, verdict: 'ratified' }),
        tallyFor('term_sheet.b', { accept: 5, refuse: 1, verdict: 'ratified' }),
      ],
    });
    expect(both).toMatchObject({ verdict: 'close', reason: 'rival_sheets_both_hold' });
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
