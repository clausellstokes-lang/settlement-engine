/**
 * conquestIntentWr8.test.js — WR-8 amendment N3, CAPABILITY NEVER IMPLIES INTENT.
 *
 * Four claims, each pinned by the case that would break a plausible-looking
 * implementation:
 *
 *   CAPABILITY IS NOT AN INPUT. Not "is weighted lightly" — not an input. The
 *   pin is structural (the read's own argument list) and behavioural (two
 *   identical intent rows under opposite feasibilities decide alike).
 *
 *   THE MORAL DISCRIMINATOR. A good realm presses conquest against believed evil
 *   and refuses it against the decent; a cruel one does not ask. Proved on ONE
 *   court whose only changing field is what it believes the other side to be.
 *
 *   THE I4 DECEPTION ROAD REACHES CONQUEST AND STOPS. A plant that moves the
 *   believed nature flips a righteous court into a war it would otherwise have
 *   refused — and an EXHAUSTIVE WALK of the whole intent table proves the
 *   punitive intent is unreachable from every one of the 768 input rows, which
 *   is R2's scoping ruling held as machinery rather than as prose.
 *
 *   MERCY IS PUBLISHED. A court that could have taken everything and did not
 *   says so, and a court that merely lacked the appetite does not get the line.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  CONQUEST_HISTORY_BANDS,
  CONQUEST_INTENTS,
  CONQUEST_INTENT_TUNING,
  CONQUEST_MARTIAL_BANDS,
  CONQUEST_NATURE_BANDS,
  CONQUEST_PATRON_BANDS,
  DECEPTION_REACHABLE_INTENTS,
  conquestMercyReceipt,
  intentIsDeceptionReachable,
  readConquestIntent,
} from '../../src/domain/worldPulse/conquestIntent.js';
import { readConquestFeasibility } from '../../src/domain/worldPulse/conquestFeasibility.js';

/** A hard, war-tempered realm with a cruel patron. */
const WARLORD = Object.freeze({
  partyId: 'ironhold',
  counterpartId: 'thornwall',
  martialBand: 'decisive',
  conquestHistoryBand: 'repeated',
  ownNatureBand: 'malicious',
  patronNatureBand: 'malicious',
  believedEnemyNatureBand: 'balanced',
});

/** A righteous realm, equally war-tempered, under a good god. */
const CRUSADER = Object.freeze({
  partyId: 'everdeep',
  counterpartId: 'thornwall',
  martialBand: 'decisive',
  conquestHistoryBand: 'repeated',
  ownNatureBand: 'benevolent',
  patronNatureBand: 'benevolent',
  believedEnemyNatureBand: 'balanced',
});

describe('WR-8 N3 — capability never implies intent', () => {
  test('the read takes no capability, structurally', () => {
    // The signature IS the guarantee: there is no argument through which a
    // feasibility could enter, so the claim cannot rot into a weighting.
    expect(readConquestIntent.length).toBe(1);
    const source = readConquestIntent.toString();
    for (const forbidden of ['conquestReach', 'beingConquered', 'feasibility', 'strengthBand']) {
      expect(source, `intent must not name ${forbidden}`).not.toContain(forbidden);
    }
    // Anti-vacuity for the four absences above: the function body demonstrably
    // reads the inputs it IS given.
    expect(source).toContain('martialBand');
    expect(source).toContain('believedEnemyNatureBand');
  });

  test('the same character decides alike under opposite capabilities', () => {
    const canWin = readConquestFeasibility({
      partyId: 'ironhold', counterpartId: 'thornwall',
      ownStrengthBand: 'dominant', rivalStrengthBand: 'spent',
      ownAllyStrengthBand: 'pressing', rivalAllyStrengthBand: 'quiet',
      ownStoresBand: 'deep', ownWarExhaustionBand: 'quiet',
    });
    const cannot = readConquestFeasibility({
      partyId: 'ironhold', counterpartId: 'thornwall',
      ownStrengthBand: 'spent', rivalStrengthBand: 'dominant',
      ownAllyStrengthBand: 'quiet', rivalAllyStrengthBand: 'decisive',
      ownStoresBand: 'bare', ownWarExhaustionBand: 'decisive',
    });
    expect(canWin.conquestReachBand).not.toBe(cannot.conquestReachBand);
    // One intent read, two worlds. The intent is a fact about the court.
    const intent = readConquestIntent(WARLORD);
    expect(intent.intent).toBe('conquer');
    // And the mercy composition — the only place the two ever meet — reports
    // nothing for a court that took what it wanted.
    expect(conquestMercyReceipt(intent, canWin)).toBeNull();
    expect(conquestMercyReceipt(intent, cannot)).toBeNull();
  });

  test('an unread character is no intent at all, never a peaceful one', () => {
    for (const field of ['martialBand', 'conquestHistoryBand', 'ownNatureBand',
      'patronNatureBand', 'believedEnemyNatureBand']) {
      const read = readConquestIntent({ ...WARLORD, [field]: 'unknown' });
      expect(read.known, field).toBe(false);
      expect(read.intent, field).toBe('none');
      expect(read.wanted01, field).toBeNull();
      expect(read.receipt, field).toContain('no conquest intent can be read');
    }
    // The known control: the same row, complete, does produce a judgement.
    expect(readConquestIntent(WARLORD).known).toBe(true);
  });

  test('appetite alone can refuse: a permitted conquest below the floor takes terms', () => {
    const idle = readConquestIntent({ ...WARLORD, martialBand: 'quiet', conquestHistoryBand: 'never' });
    expect(idle.permitted).toBe(true);
    expect(Number(idle.wanted01)).toBeLessThan(CONQUEST_INTENT_TUNING.WANT_FLOOR);
    expect(idle.intent).toBe('terms');
    expect(idle.receipt).toContain('means to treat with');
  });
});

describe('WR-8 N3 — the moral discriminator', () => {
  test('a good realm presses against believed evil and refuses the decent', () => {
    // ONE court. One field moves.
    const againstEvil = readConquestIntent({ ...CRUSADER, believedEnemyNatureBand: 'malicious' });
    expect(againstEvil.moralVerdict).toBe('sanctioned_against_evil');
    expect(againstEvil.intent).toBe('conquer');
    expect(againstEvil.receipt).toContain('holds the conquest righteous');

    for (const decent of ['benevolent', 'balanced']) {
      const refused = readConquestIntent({ ...CRUSADER, believedEnemyNatureBand: decent });
      expect(refused.moralVerdict, decent).toBe('refused_the_decent');
      expect(refused.permitted, decent).toBe(false);
      expect(refused.intent, decent).toBe('terms');
      expect(refused.receipt, decent).toContain('will not make war of conquest');
    }
  });

  test('a cruel realm does not ask what the other side is', () => {
    const verdicts = CONQUEST_NATURE_BANDS
      .filter((band) => band !== 'unknown')
      .map((band) => readConquestIntent({ ...WARLORD, believedEnemyNatureBand: band }));
    expect(verdicts.every((read) => read.permitted)).toBe(true);
    expect(verdicts.every((read) => read.intent === 'conquer')).toBe(true);
    expect(verdicts.every((read) => read.moralVerdict === 'indifferent')).toBe(true);
  });

  test('a good patron restrains a merely balanced realm', () => {
    // Conscience is the STRONGER of the two books, so the god's restraint is
    // real rather than advisory: same realm, same appetite, patron swapped.
    const godless = readConquestIntent({
      ...WARLORD, ownNatureBand: 'balanced', patronNatureBand: 'none',
      believedEnemyNatureBand: 'balanced',
    });
    expect(godless.intent).toBe('conquer');
    const restrained = readConquestIntent({
      ...WARLORD, ownNatureBand: 'balanced', patronNatureBand: 'benevolent',
      believedEnemyNatureBand: 'balanced',
    });
    expect(restrained.moralVerdict).toBe('refused_the_decent');
    expect(restrained.intent).toBe('terms');
  });
});

describe('WR-8 N3 — the I4 deception road, and where it stops', () => {
  test('a planted lie about whom the neighbour serves buys a righteous war', () => {
    // Before: a good realm refuses a decent neighbour.
    const honest = readConquestIntent({ ...CRUSADER, believedEnemyNatureBand: 'benevolent' });
    expect(honest.intent).toBe('terms');
    expect(intentIsDeceptionReachable(honest)).toBe(false);

    // After: the ONLY thing that changed is what the court believes, and the
    // receipt names the belief rather than the fact. This is the righteous
    // atrocity the amendment describes, with its own paper trail.
    const deceived = readConquestIntent({ ...CRUSADER, believedEnemyNatureBand: 'malicious' });
    expect(deceived.intent).toBe('conquer');
    expect(deceived.moralVerdict).toBe('sanctioned_against_evil');
    expect(deceived.receipt).toContain('believes thornwall malicious');
    expect(intentIsDeceptionReachable(deceived)).toBe(true);
  });

  test('EXHAUSTIVE: no row of the intent table returns the punitive intent', () => {
    // R2 closed the deception road for the razing. Rather than trust that, walk
    // every combination of every closed band — including the `unknown` members —
    // and prove `punish` never appears. 5 x 5 x 4 x 5 x 4 = 2,000 rows.
    const seen = new Set();
    let rows = 0;
    for (const martialBand of CONQUEST_MARTIAL_BANDS) {
      for (const conquestHistoryBand of CONQUEST_HISTORY_BANDS) {
        for (const ownNatureBand of CONQUEST_NATURE_BANDS) {
          for (const patronNatureBand of CONQUEST_PATRON_BANDS) {
            for (const believedEnemyNatureBand of CONQUEST_NATURE_BANDS) {
              rows += 1;
              seen.add(readConquestIntent({
                partyId: 'a',
                counterpartId: 'b',
                martialBand,
                conquestHistoryBand,
                ownNatureBand,
                patronNatureBand,
                believedEnemyNatureBand,
              }).intent);
            }
          }
        }
      }
    }
    // Anti-vacuity: the walk really ran, and it really reached more than one
    // answer — so the absence below is a live exclusion, not an empty loop.
    expect(rows).toBe(
      CONQUEST_MARTIAL_BANDS.length * CONQUEST_HISTORY_BANDS.length
      * CONQUEST_NATURE_BANDS.length * CONQUEST_PATRON_BANDS.length
      * CONQUEST_NATURE_BANDS.length,
    );
    expect([...seen].sort()).toEqual(['conquer', 'none', 'terms']);
    expect(seen.has('punish')).toBe(false);
    // …and `punish` is nonetheless a member of the closed vocabulary, so the
    // exclusion is a decision on the record rather than a word nobody wrote.
    expect(CONQUEST_INTENTS).toContain('punish');
    expect(DECEPTION_REACHABLE_INTENTS).toEqual(['conquer']);
  });
});

describe('WR-8 N3 — mercy is a receipt, not a gap', () => {
  const inReach = readConquestFeasibility({
    partyId: 'everdeep', counterpartId: 'thornwall',
    ownStrengthBand: 'dominant', rivalStrengthBand: 'spent',
    ownAllyStrengthBand: 'pressing', rivalAllyStrengthBand: 'quiet',
    ownStoresBand: 'deep', ownWarExhaustionBand: 'quiet',
  });

  test('a court that could have taken everything and did not says so', () => {
    const refused = readConquestIntent({ ...CRUSADER, believedEnemyNatureBand: 'benevolent' });
    const mercy = conquestMercyReceipt(refused, inReach);
    expect(mercy && mercy.merciful).toBe(true);
    expect(mercy && mercy.receipt)
      .toBe('everdeep could have taken everything from thornwall and did not.');
  });

  test('a court that merely lacked the appetite gets no such line', () => {
    // Terms, yes — but from indifference, not from conscience. Publishing mercy
    // here would flatter a realm that simply could not be bothered.
    const listless = readConquestIntent({
      ...WARLORD, partyId: 'everdeep', martialBand: 'quiet', conquestHistoryBand: 'never',
    });
    expect(listless.intent).toBe('terms');
    expect(listless.moralVerdict).toBe('indifferent');
    expect(conquestMercyReceipt(listless, inReach)).toBeNull();
    // And no mercy where there was never anything to take.
    const outOfReach = readConquestFeasibility({
      partyId: 'everdeep', counterpartId: 'thornwall',
      ownStrengthBand: 'spent', rivalStrengthBand: 'dominant',
      ownAllyStrengthBand: 'quiet', rivalAllyStrengthBand: 'decisive',
      ownStoresBand: 'bare', ownWarExhaustionBand: 'decisive',
    });
    const refused = readConquestIntent({ ...CRUSADER, believedEnemyNatureBand: 'benevolent' });
    expect(conquestMercyReceipt(refused, outOfReach)).toBeNull();
    expect(conquestMercyReceipt(refused, null)).toBeNull();
  });
});
