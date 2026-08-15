/**
 * pactTriggers.test.js — GR-2's four occasions, at the arithmetic level.
 *
 * The stage battery drives these through a world; this one drives them directly, because a
 * scorer proved only through a composer is a scorer whose bands were never pushed to their
 * ends. Every band here is asserted LIVE ON BOTH SIDES — the recorded dead-band law, which
 * this estate has watched a tuning surface quietly fail twice.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  PACT_TRIGGERS,
  PACT_TRIGGERS_PRODUCED,
  PACT_TRIGGER_TUNING,
  dependencyFearOf,
  rungGap,
  rungOf,
  scoreFaithCommunion,
  scoreMigrationPressure,
  scoreSharedThreat,
  scoreTradeDemand,
} from '../../src/domain/worldPulse/pactTriggers.js';
import {
  DEVOTION_BANDS, PULL_BANDS, SCARCITY_BANDS,
} from '../../src/domain/worldPulse/beliefAxisSubjects.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const T = PACT_TRIGGER_TUNING;

describe('the closed trigger vocabulary', () => {
  test('is exactly five words, codepoint-frozen', () => {
    expect(PACT_TRIGGERS).toEqual([
      'faith_communion', 'migration_pressure', 'renewal', 'shared_threat', 'trade_demand',
    ]);
    expect(Object.isFrozen(PACT_TRIGGERS)).toBe(true);
  });

  test('`renewal` is a TOMBSTONE — in the vocabulary, out of the produced set', () => {
    // The no-orphan-vocabulary law's shape: a word may exist ahead of its producer, but
    // the two lists must DIFFER by exactly that word, so a reachability pin quantifying
    // over the produced set cannot absorb a vocabulary word that nothing mints, and a
    // vocabulary pin cannot absorb a producer that was never written.
    expect(PACT_TRIGGERS_PRODUCED).toEqual(PACT_TRIGGERS.filter((t) => t !== 'renewal'));
    expect(PACT_TRIGGERS_PRODUCED).toHaveLength(4);
    expect(PACT_TRIGGERS).toContain('renewal');
    // `trade_demand` is the anchor because it travels the SAME list: an emptied, renamed or
    // re-shaped produced set takes it with it, so the exclusion below cannot go vacuous.
    expectAbsentWithAnchor(PACT_TRIGGERS_PRODUCED, 'renewal', 'trade_demand', 'the produced set');
  });
});

describe('rung arithmetic — the ladder is an argument, never a local copy', () => {
  test('an unresolved word is rung MINUS ONE, never rung zero', () => {
    // Rung 0 is a real rung on every ladder this leaf is handed. Reading absence as the
    // bottom rung would manufacture a certainty no court ever held — a `scant` belief
    // where the court simply has none.
    expect(rungOf(SCARCITY_BANDS, 'scant')).toBe(0);
    expect(rungOf(SCARCITY_BANDS, '')).toBe(-1);
    expect(rungOf(SCARCITY_BANDS, undefined)).toBe(-1);
    expect(rungOf(SCARCITY_BANDS, 'not_a_rung')).toBe(-1);
  });

  test('a gap with either end unresolved is NULL, and null is not zero', () => {
    expect(rungGap(SCARCITY_BANDS, 'scant', 'plentiful')).toBe(3);
    expect(rungGap(SCARCITY_BANDS, 'plentiful', 'scant')).toBe(-3);
    expect(rungGap(SCARCITY_BANDS, 'scant', '')).toBeNull();
    expect(rungGap(SCARCITY_BANDS, '', 'scant')).toBeNull();
  });
});

describe('THE DEMAND — trade_demand', () => {
  const demand = (mine, theirs) => scoreTradeDemand({
    ladder: SCARCITY_BANDS, proposerBands: mine, counterpartyBands: theirs,
  });

  test('a court short of what it believes its neighbour holds has an occasion', () => {
    const crossing = demand({ food: 'scant' }, { food: 'plentiful' });
    expect(crossing.trigger).toBe('trade_demand');
    expect(crossing.crossed).toBe(true);
    expect(crossing.score01).toBe(1);
    expect(crossing.subject).toBe('food');
    // Banded WORDS in the prose, never the scalar (L5).
    expect(crossing.receipt).toContain('scant');
    expect(crossing.receipt).toContain('plentiful');
    // The subject is a STRING, so the toContain helpers do not apply; the structural
    // anchor is the pair of positives immediately above.
    // anchored: both toContain lines prove this receipt is live composed prose carrying BOTH band words, so "no digit" measures the L5 rule rather than an empty string
    expect(crossing.receipt).not.toMatch(/\d/);
  });

  test('a gap under the band is NOT an occasion, and says why', () => {
    const crossing = demand({ food: 'sufficient' }, { food: 'plentiful' });
    expect(crossing.crossed).toBe(false);
    expect(crossing.score01).toBe(0);
    expect(crossing.receipt).toContain('nothing it believes itself short of');
  });

  test('the gap is DIRECTED — a richer court does not demand from a poorer one', () => {
    expect(demand({ food: 'plentiful' }, { food: 'scant' }).crossed).toBe(false);
  });

  test('the WIDEST gap wins, over every category the court holds a belief about', () => {
    const crossing = demand(
      { food: 'pinched', raw_material: 'scant' },
      { food: 'plentiful', raw_material: 'plentiful' },
    );
    // food gaps 2, raw_material gaps 3 — the search is total rather than first-key.
    expect(crossing.subject).toBe('raw_material');
  });

  test('a belief the counterparty side does not carry contributes nothing', () => {
    expect(demand({ food: 'scant' }, {}).crossed).toBe(false);
    expect(demand({}, { food: 'plentiful' }).crossed).toBe(false);
  });

  test('an empty ladder refuses rather than dividing by zero', () => {
    const crossing = scoreTradeDemand({ ladder: [], proposerBands: { food: 'scant' }, counterpartyBands: {} });
    expect(crossing.crossed).toBe(false);
    expect(Number.isFinite(crossing.score01)).toBe(true);
  });
});

describe('THE COMMUNION — faith_communion', () => {
  const communion = (mine, theirs) => scoreFaithCommunion({
    ladder: DEVOTION_BANDS, proposerWord: mine, counterpartyWord: theirs,
  });

  test('two courts believed observant, and believed observant alike, recognise each other', () => {
    const crossing = communion('devout', 'faithful');
    expect(crossing.trigger).toBe('faith_communion');
    expect(crossing.crossed).toBe(true);
  });

  test('THE SPREAD is live: a devout court and a lukewarm one have no communion', () => {
    const crossing = communion('devout', 'lukewarm');
    expect(crossing.crossed).toBe(false);
    expect(crossing.receipt).toContain('too differently');
  });

  test('THE FLOOR is live: two equally secular courts have no rite to share', () => {
    const crossing = communion('secular', 'secular');
    expect(crossing.crossed).toBe(false);
    expect(crossing.receipt).toContain('observant enough');
  });

  test('an unresolved belief on either side is an absence, not a zero', () => {
    expect(communion('devout', '').receipt).toContain('holds no belief');
    expect(communion('', 'devout').receipt).toContain('holds no belief');
  });
});

describe('THE PRESSURE — migration_pressure', () => {
  const pressure = (mine, theirs) => scoreMigrationPressure({
    ladder: PULL_BANDS, proposerWord: mine, counterpartyWord: theirs,
  });

  test('a shunned court beside a coveted one is losing people', () => {
    const crossing = pressure('shunned', 'coveted');
    expect(crossing.crossed).toBe(true);
    expect(crossing.score01).toBe(1);
  });

  test('the gap is DIRECTED and banded — a coveted court feels no pressure outward', () => {
    expect(pressure('coveted', 'shunned').crossed).toBe(false);
    expect(pressure('sought', 'coveted').crossed).toBe(false); // one rung, under the band
  });
});

describe('THE THREAT — shared_threat', () => {
  test('the FLOOR band is the whole gate, and it is the read\'s own word', () => {
    expect(T.SHARED_THREAT_FLOOR_BAND).toBe('quiet');
    expect(scoreSharedThreat({ band: 'quiet', risk01: 0.9, threatId: 'C' }).crossed).toBe(false);
    expect(scoreSharedThreat({ band: '', risk01: 0.9, threatId: 'C' }).crossed).toBe(false);
  });

  test('a graded web above the floor crosses, at the read\'s OWN magnitude', () => {
    const crossing = scoreSharedThreat({ band: 'decisive', risk01: 0.8, threatId: 'C' });
    expect(crossing.crossed).toBe(true);
    expect(crossing.score01).toBe(0.8);
    expect(crossing.subject).toBe('C');
    expect(crossing.receipt).toContain('decisive');
  });
});

describe('THE COUNTERFORCE — and both sides of its band are reachable', () => {
  const fear = (over) => dependencyFearOf({
    demand01: 0.625, dependency01: 0.1, leverage01: 0.9, insularity01: 0, ...over,
  });

  test('at low reliance the fear never beats the demand that raised it', () => {
    const quiet = fear({});
    expect(quiet.refuses).toBe(false);
    expect(quiet.fear01).toBeLessThan(0.625);
    expect(quiet.receipt).toContain('can carry');
  });

  test('at high reliance it DOES — the same demand, refused by its own evidence', () => {
    const bound = fear({ dependency01: 0.95, leverage01: 0.05 });
    expect(bound.refuses).toBe(true);
    expect(bound.fear01).toBeGreaterThan(0.625);
    expect(bound.receipt).toContain('leans on this neighbour further than it can lean back');
  });

  test('THE DEAD-BAND LAW: the gain is what makes winning possible at all', () => {
    // A gain of 1 or less bounds `fear01` at `demand01 * reliance01 <= demand01`, so the
    // counterforce could never win any fixture and the whole axis would be decoration —
    // the exact shape of tuning surface this estate has watched go quietly dead. The
    // tuned value is asserted ABOVE one, and the two tests above prove both outcomes
    // really occur rather than merely being permitted by arithmetic.
    expect(T.FEAR_GAIN).toBeGreaterThan(1);
    expect(T.RELIANCE_DEPENDENCY_WEIGHT).toBeGreaterThan(0);
    expect(T.RELIANCE_DEPENDENCY_WEIGHT).toBeLessThan(1);
  });

  test('insularity lifts the fear independently of the pair\'s reliance', () => {
    const open = fear({ insularity01: 0 });
    const walled = fear({ insularity01: 1 });
    expect(walled.fear01).toBeGreaterThan(open.fear01);
    // …and it is bounded, so no combination of terms can saturate the answer.
    expect(walled.fear01).toBeLessThanOrEqual(1);
  });

  test('every output is bounded to 0..1 under hostile input', () => {
    const wild = dependencyFearOf({
      demand01: 99, dependency01: -3, leverage01: NaN, insularity01: 'nonsense',
    });
    expect(wild.fear01).toBeGreaterThanOrEqual(0);
    expect(wild.fear01).toBeLessThanOrEqual(1);
    expect(wild.reliance01).toBeGreaterThanOrEqual(0);
    expect(wild.reliance01).toBeLessThanOrEqual(1);
  });
});
