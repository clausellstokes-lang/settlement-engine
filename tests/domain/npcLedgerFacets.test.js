/**
 * npcLedgerFacets.test.js — W-H1 THE FACET LAW applied to reputation.
 *
 * Pins the CLOSURE of every reputation vocabulary (law 4 FINITE SEMANTICS: no free
 * prose in mechanics), the totality of the normalizers on garbage, the neutral
 * byte-identity anchor, and the exclusion-edge variant discipline.
 *
 * ANTI-VACUITY: every closure test first proves a LEGAL token survives, so a normalizer
 * that returned the fallback unconditionally would fail rather than pass.
 */
import { describe, expect, test } from 'vitest';

import {
  NOTORIETY_BANDS,
  SCANDAL_CLASSES,
  EDICT_MARKS,
  ALIGNMENT_READS,
  COMPETENCE_READS,
  VERDICT_CAUSES,
  COMPROMISE_SOURCES,
  EXCLUSION_KINDS,
  NEUTRAL_REPUTATION_FACETS,
  REPUTATION_FACET_KEYS,
  closedValue,
  normalizeReputationFacets,
  reputationFacetsAreNeutral,
  notorietyRank,
  competenceRank,
  normalizeExclusionEdge,
  normalizeExclusionEdges,
  exclusionActiveAt,
} from '../../src/domain/worldPulse/npcLedgerFacets.js';

const VOCABULARIES = {
  NOTORIETY_BANDS,
  SCANDAL_CLASSES,
  EDICT_MARKS,
  ALIGNMENT_READS,
  COMPETENCE_READS,
  VERDICT_CAUSES,
  COMPROMISE_SOURCES,
  EXCLUSION_KINDS,
};

describe('reputation facets — the closed vocabularies (law 4)', () => {
  test('every vocabulary is frozen, non-empty, and free of duplicates', () => {
    for (const [name, vocab] of Object.entries(VOCABULARIES)) {
      expect(Object.isFrozen(vocab), `${name} must be frozen`).toBe(true);
      expect(vocab.length, `${name} must be non-empty (an empty vocabulary makes every closure test vacuous)`).toBeGreaterThan(0);
      expect(new Set(vocab).size, `${name} carries a duplicate token`).toBe(vocab.length);
      for (const token of vocab) expect(typeof token).toBe('string');
    }
  });

  test('the alignment read conforms to the estate alignment axis rather than forking it', () => {
    // deityAxes.js EVIL01 keys verbatim, plus the one rung a stranger needs and a
    // deity does not. If someone re-spells these, the cross-read against a patron
    // deity silently stops matching, which is why this is pinned rather than assumed.
    expect([...ALIGNMENT_READS]).toEqual(['unknown', 'good', 'neutral', 'evil']);
  });

  test('closedValue keeps a legal token and fails closed to the first rung on anything else', () => {
    // ANTI-VACUITY FIRST: a legal token must survive, or the fallback assertions below
    // would pass for a function that always returned the fallback.
    expect(closedValue('notorious', NOTORIETY_BANDS)).toBe('notorious');
    expect(closedValue('infamous', NOTORIETY_BANDS)).toBe('infamous');
    for (const garbage of ['', 'INVENTED', 'Notorious', null, undefined, 7, {}, [], true]) {
      expect(closedValue(garbage, NOTORIETY_BANDS)).toBe(NOTORIETY_BANDS[0]);
    }
  });
});

describe('reputation facets — normalization is total and byte-anchored', () => {
  test('the neutral facet set is a single shared frozen reference', () => {
    expect(Object.isFrozen(NEUTRAL_REPUTATION_FACETS)).toBe(true);
    // Independently built neutral inputs must converge on the SAME object, which is
    // what makes a never-marked record serialize identically down every path.
    expect(normalizeReputationFacets(undefined)).toBe(NEUTRAL_REPUTATION_FACETS);
    expect(normalizeReputationFacets({})).toBe(NEUTRAL_REPUTATION_FACETS);
    expect(normalizeReputationFacets({ notorietyBand: 'unknown', scandalClass: 'none' })).toBe(NEUTRAL_REPUTATION_FACETS);
    expect(normalizeReputationFacets({ notorietyBand: 'INVENTED' })).toBe(NEUTRAL_REPUTATION_FACETS);
  });

  test('a marked facet set keeps its legal tokens and drops its illegal ones', () => {
    const facets = normalizeReputationFacets({
      notorietyBand: 'infamous',
      edictMark: 'banishment_edict',
      scandalClass: 'venality',
      alignmentRead: 'evil',
      competenceRead: 'formidable',
      smuggledExtra: 'should not survive',
    });
    expect(facets).toEqual({
      notorietyBand: 'infamous',
      edictMark: 'banishment_edict',
      scandalClass: 'venality',
      alignmentRead: 'evil',
      competenceRead: 'formidable',
    });
    // The allowlist is structural: an un-declared key cannot ride through.
    expect(Object.keys(facets).sort()).toEqual([...REPUTATION_FACET_KEYS].sort());
    expect(reputationFacetsAreNeutral(facets)).toBe(false);
  });

  test('key order is canonical, so two equal facet sets serialize identically', () => {
    const a = normalizeReputationFacets({ competenceRead: 'capable', notorietyBand: 'known' });
    const b = normalizeReputationFacets({ notorietyBand: 'known', competenceRead: 'capable' });
    expect(Object.keys(a)).toEqual([...REPUTATION_FACET_KEYS]);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  test('the ordered bands rank monotonically from their unknown rung', () => {
    expect(notorietyRank('unknown')).toBe(0);
    expect(notorietyRank('infamous')).toBe(NOTORIETY_BANDS.length - 1);
    expect(notorietyRank('notorious')).toBeGreaterThan(notorietyRank('whispered'));
    expect(notorietyRank('INVENTED')).toBe(0);
    expect(competenceRank('formidable')).toBeGreaterThan(competenceRank('inept'));
    expect(competenceRank(null)).toBe(0);
  });
});

describe('exclusion edges — exactly one variant, and the stricter one wins', () => {
  test('a finite non-negative untilTick makes a WINDOWED edge and nothing else', () => {
    const edge = normalizeExclusionEdge({ settlementId: 'aldermoor', kind: 'banishment_edict', untilTick: 40 });
    expect(edge).toEqual({ settlementId: 'aldermoor', kind: 'banishment_edict', untilTick: 40 });
    expect('indefinite' in edge, 'a windowed edge must not also carry the indefinite flag').toBe(false);
  });

  test('an absent, garbage, or explicitly-indefinite window makes an INDEFINITE edge', () => {
    for (const raw of [
      { settlementId: 's' },
      { settlementId: 's', untilTick: null },
      { settlementId: 's', untilTick: Number.NaN },
      { settlementId: 's', untilTick: -3 },
      { settlementId: 's', untilTick: 40, indefinite: true },
    ]) {
      const edge = normalizeExclusionEdge(raw);
      expect(edge.indefinite, `input ${JSON.stringify(raw)} must normalize to an indefinite edge`).toBe(true);
      expect('untilTick' in edge, 'an indefinite edge must not also carry a window').toBe(false);
    }
  });

  test('IT FAILS SHUT: a zero-coercing garbage window never opens the door', () => {
    // THE DEFECT THIS PINS, caught by the totality loop above on 2026-07-31: `Number(null)`
    // is 0, so a coercing normalizer turned an ABSENT window into one that expired at
    // tick zero and silently freed a banished roamer on the first tick. Every value
    // below coerces to 0 through `Number()` and must NOT be read as a window.
    for (const poison of [null, '', false, [], '  ']) {
      expect(Number(poison), 'the fixture must actually be a zero-coercing value, or this pin is vacuous').toBe(0);
      const edge = normalizeExclusionEdge({ settlementId: 's', untilTick: poison });
      expect(edge.indefinite).toBe(true);
      expect(exclusionActiveAt(edge, 0), 'the door must stay shut at tick 0').toBe(true);
      expect(exclusionActiveAt(edge, 9999)).toBe(true);
    }
    // The predicate is equally strict when handed a RAW edge that never met the
    // normalizer, which is what a hand-authored or legacy record looks like.
    expect(exclusionActiveAt({ settlementId: 's', untilTick: null }, 0)).toBe(true);
    expect(exclusionActiveAt({ settlementId: 's', untilTick: '40' }, 0)).toBe(true);
    // ANTI-VACUITY: a genuine numeric window still opens, so "always shut" would fail.
    expect(exclusionActiveAt({ settlementId: 's', untilTick: 40 }, 41)).toBe(false);
  });

  test('activity is a half-open window: untilTick is the first tick the door reopens', () => {
    const windowed = normalizeExclusionEdge({ settlementId: 's', untilTick: 40 });
    expect(exclusionActiveAt(windowed, 39)).toBe(true);
    expect(exclusionActiveAt(windowed, 40)).toBe(false);
    expect(exclusionActiveAt(windowed, 41)).toBe(false);
    const indefinite = normalizeExclusionEdge({ settlementId: 's' });
    expect(exclusionActiveAt(indefinite, 10_000)).toBe(true);
  });

  test('merging the same door keeps the STRICTER sentence and never shortens one', () => {
    const later = normalizeExclusionEdges([
      { settlementId: 's', kind: 'banishment_edict', untilTick: 40 },
      { settlementId: 's', kind: 'banishment_edict', untilTick: 12 },
    ]);
    expect(later).toEqual([{ settlementId: 's', kind: 'banishment_edict', untilTick: 40 }]);

    const indefiniteWins = normalizeExclusionEdges([
      { settlementId: 's', kind: 'banishment_edict', untilTick: 40 },
      { settlementId: 's', kind: 'banishment_edict', indefinite: true },
    ]);
    expect(indefiniteWins).toEqual([{ settlementId: 's', kind: 'banishment_edict', indefinite: true }]);

    // Order-independence: the strict edge wins from either direction, so a persisted
    // list cannot free a roamer by being read in a different order.
    const reversed = normalizeExclusionEdges([
      { settlementId: 's', kind: 'banishment_edict', indefinite: true },
      { settlementId: 's', kind: 'banishment_edict', untilTick: 40 },
    ]);
    expect(reversed).toEqual(indefiniteWins);
  });

  test('the edge list is codepoint-ordered and drops doorless edges', () => {
    const edges = normalizeExclusionEdges([
      { settlementId: 'zephyr', untilTick: 5 },
      { settlementId: '', untilTick: 5 },
      { settlementId: 'aldermoor', untilTick: 5 },
      null,
      'garbage',
    ]);
    expect(edges.map((e) => e.settlementId)).toEqual(['aldermoor', 'zephyr']);
  });

  test('normalization is total on garbage', () => {
    expect(normalizeExclusionEdges(null)).toEqual([]);
    expect(normalizeExclusionEdges('nope')).toEqual([]);
    expect(normalizeExclusionEdges(undefined)).toEqual([]);
  });
});
