/**
 * text.test.js — pins for the shared word-boundary truncation helper.
 *
 * truncateAtWord backs every surviving display snippet (services, institutions,
 * crime patterns, PDF prose, relationship memory summaries). The contract:
 *   • short input passes through untouched — ellipsis ONLY when text was cut
 *   • a cut never ends mid-word: the kept text is a word-boundary prefix
 *   • the result (ellipsis included) never exceeds maxChars
 */
import { describe, expect, test } from 'vitest';

import { truncateAtWord } from '../../src/lib/text.js';

describe('truncateAtWord', () => {
  test('input at or under the limit passes through untouched, no ellipsis', () => {
    expect(truncateAtWord('short prose', 55)).toBe('short prose');
    expect(truncateAtWord('exactly ten', 11)).toBe('exactly ten');
    expect(truncateAtWord('', 10)).toBe('');
  });

  test('null/undefined coerce to empty string', () => {
    expect(truncateAtWord(null, 10)).toBe('');
    expect(truncateAtWord(undefined, 10)).toBe('');
  });

  test('a cut lands on a word boundary, never mid-word', () => {
    const text = 'The quick brown fox jumps over the lazy dog';
    // Budget of 13 chars lands inside 'brown' — the partial word must drop.
    expect(truncateAtWord(text, 14)).toBe('The quick…');
    // Budget that ends exactly at a word end keeps the whole word.
    expect(truncateAtWord(text, 16)).toBe('The quick brown…');
  });

  test('kept text is always a word-boundary prefix of the source', () => {
    const text = 'Merchants resist investigation into the missing ledgers';
    // Start where the budget covers the first word — budgets smaller than
    // that take the documented hard-cut fallback (pinned separately below).
    for (let max = 'Merchants'.length + 1; max <= text.length + 5; max++) {
      const out = truncateAtWord(text, max);
      if (out === text) continue; // passthrough — no cut
      expect(out.endsWith('…')).toBe(true);
      const body = out.slice(0, -1);
      expect(text.startsWith(body)).toBe(true);
      // The next source character is whitespace — body never ends mid-word.
      expect(text[body.length]).toBe(' ');
    }
  });

  test('result including the ellipsis never exceeds maxChars', () => {
    const text = 'one two three four five six seven eight nine ten';
    for (let max = 4; max <= 60; max++) {
      expect(truncateAtWord(text, max).length).toBeLessThanOrEqual(max);
      expect(truncateAtWord(text, max, '...').length).toBeLessThanOrEqual(max);
    }
  });

  test('custom ellipsis (PDF/domain call sites use ASCII dots)', () => {
    expect(truncateAtWord('The quick brown fox', 13, '...')).toBe('The quick...');
    expect(truncateAtWord('fits fine', 20, '...')).toBe('fits fine');
  });

  test('a single overlong word is hard-cut so something readable survives', () => {
    expect(truncateAtWord('Antidisestablishmentarianism', 10)).toBe('Antidises…');
  });

  test('whitespace before the boundary is trimmed, not kept', () => {
    expect(truncateAtWord('hello   world again', 9)).toBe('hello…');
  });
});
