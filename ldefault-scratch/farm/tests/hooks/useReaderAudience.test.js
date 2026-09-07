/**
 * useReaderAudience.test.js — Behavior-signal → audience archetype contract.
 *
 * Verifies the pure `computeReaderAudience` over a fixture matrix. Tests
 * the rules directly so a future refactor of the hook plumbing (selectors,
 * memoization) can't silently shift the audience boundaries.
 */

import { describe, it, expect } from 'vitest';
import {
  computeReaderAudience,
  readerAudienceEvidence,
  READER_AUDIENCE_REASONS,
} from '../../src/hooks/useReaderAudience.js';

const base = {
  savedCount: 0, exportCount: 0, narrateCount: 0,
  hasUsedNeighbours: false, hasUsedLocks: false, tier: 'free',
};

describe('computeReaderAudience', () => {
  it('anonymous → new regardless of behavior', () => {
    expect(computeReaderAudience({ ...base, tier: 'anon' })).toBe('new');
    expect(computeReaderAudience({ ...base, tier: 'anon', savedCount: 999 })).toBe('new');
  });

  it('default empty → new', () => {
    expect(computeReaderAudience(base)).toBe('new');
    expect(computeReaderAudience({})).toBe('new');
    expect(computeReaderAudience(null)).toBe('new');
  });

  it('first save bumps to intermediate', () => {
    expect(computeReaderAudience({ ...base, savedCount: 2 })).toBe('intermediate');
    expect(computeReaderAudience({ ...base, savedCount: 1 })).toBe('new'); // not yet
  });

  it('first export bumps to intermediate', () => {
    expect(computeReaderAudience({ ...base, exportCount: 1 })).toBe('intermediate');
  });

  it('first narrate spend bumps to intermediate', () => {
    expect(computeReaderAudience({ ...base, narrateCount: 1 })).toBe('intermediate');
  });

  it('5 saves alone → still intermediate (no campaign signal yet)', () => {
    expect(computeReaderAudience({ ...base, savedCount: 5 })).toBe('intermediate');
  });

  it('5 saves + neighbours → worldbuilder', () => {
    expect(computeReaderAudience({ ...base, savedCount: 5, hasUsedNeighbours: true })).toBe('worldbuilder');
  });

  it('5 saves + locks → worldbuilder', () => {
    expect(computeReaderAudience({ ...base, savedCount: 5, hasUsedLocks: true })).toBe('worldbuilder');
  });

  it('5 saves + 3 exports → worldbuilder', () => {
    expect(computeReaderAudience({ ...base, savedCount: 5, exportCount: 3 })).toBe('worldbuilder');
  });

  it('4 saves + locks → not yet worldbuilder (save threshold matters)', () => {
    expect(computeReaderAudience({ ...base, savedCount: 4, hasUsedLocks: true })).toBe('intermediate');
  });

  it('premium tier with new-DM behavior → still new (tier ≠ audience)', () => {
    // Tier is paid-or-not; audience is reader archetype. A new DM who
    // bought Cartographer on day one still gets the new-DM teaching.
    expect(computeReaderAudience({ ...base, tier: 'premium' })).toBe('new');
  });
});

// ── ROW O-16: THE VERDICT TRAVELS WITH ITS GROUNDS ──────────────────────────
//
// The archetype gates a recognition surface that tells a reader the Founders'
// Hall should know their name. A gate that can only say 'worldbuilder' asserts
// an entitlement; one that can say WHICH signals earned it is accountable. These
// arms hold three properties the downstream receipt depends on: the ladder has
// ONE spelling, the evidence vocabulary is CLOSED, and no verdict is groundless.
describe('readerAudienceEvidence — the grounds behind the verdict', () => {
  const MATRIX = [
    base,
    {},
    { ...base, tier: 'anon' },
    { ...base, savedCount: 2 },
    { ...base, exportCount: 1 },
    { ...base, narrateCount: 1 },
    { ...base, savedCount: 5 },
    { ...base, savedCount: 5, hasUsedNeighbours: true },
    { ...base, savedCount: 5, hasUsedLocks: true },
    { ...base, savedCount: 5, exportCount: 3 },
    { ...base, savedCount: 4, hasUsedLocks: true },
    { ...base, tier: 'premium' },
  ];

  it('is the ONE spelling of the ladder — computeReaderAudience is derived from it', () => {
    // Anti-vacuity: the matrix actually reaches all three archetypes, so this
    // is not twelve rows of the same trivially-equal verdict.
    const reached = new Set(MATRIX.map(s => readerAudienceEvidence(s).audience));
    expect([...reached].sort()).toEqual(['intermediate', 'new', 'worldbuilder']);
    for (const signals of MATRIX) {
      expect(computeReaderAudience(signals)).toBe(readerAudienceEvidence(signals).audience);
    }
  });

  it('every verdict carries at least one reason, drawn from the CLOSED vocabulary', () => {
    const vocabulary = new Set(Object.values(READER_AUDIENCE_REASONS));
    expect(vocabulary.size).toBeGreaterThan(5);
    for (const signals of MATRIX) {
      const { reasons } = readerAudienceEvidence(signals);
      expect(reasons.length, `groundless verdict for ${JSON.stringify(signals)}`).toBeGreaterThan(0);
      for (const reason of reasons) {
        expect(vocabulary, `${reason} is free text, not a typed code`).toContain(reason);
      }
    }
  });

  it('names EVERY campaign signal that fired, not just the first', () => {
    const { audience, reasons } = readerAudienceEvidence({
      ...base, savedCount: 5, hasUsedNeighbours: true, hasUsedLocks: true, exportCount: 3,
    });
    expect(audience).toBe('worldbuilder');
    expect([...reasons]).toEqual([
      READER_AUDIENCE_REASONS.SAVES_AT_LEAST_FIVE,
      READER_AUDIENCE_REASONS.NEIGHBOUR_NETWORK_USED,
      READER_AUDIENCE_REASONS.SECTION_LOCKS_USED,
      READER_AUDIENCE_REASONS.EXPORTS_AT_LEAST_THREE,
    ]);
  });

  it('an anonymous reader is refused on the no-signal ground, never on behaviour', () => {
    const { audience, reasons } = readerAudienceEvidence({ ...base, tier: 'anon', savedCount: 999, hasUsedLocks: true });
    expect(audience).toBe('new');
    expect([...reasons]).toEqual([READER_AUDIENCE_REASONS.ANON_NO_SIGNAL]);
  });

  it('the evidence is frozen — a consumer cannot edit the grounds it was handed', () => {
    const evidence = readerAudienceEvidence({ ...base, savedCount: 5, hasUsedLocks: true });
    expect(Object.isFrozen(evidence)).toBe(true);
    expect(Object.isFrozen(evidence.reasons)).toBe(true);
  });
});
