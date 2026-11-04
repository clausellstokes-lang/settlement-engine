/**
 * DESIGNED INLAND TEXT (chair ruling, round 4 final, 1, 2026-11-04): a Fishmonger description that
 * says in its own words "inland, dried or salted" is designed inland text, so the battery licenses
 * each of its sentences.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { seaWordSentence, sentencesOf } from '../../scripts/audit/soak-review/checks.mjs';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

describe('designed inland text, on its seeds', () => {
  beforeAll(async () => { await ensureLaws(); });

  it.each([968, 266])('soak1k-%i: the Fishmonger\'s designed inland text gives 0 findings', (i) => {
    const s = birth(i).settlement;
    const monger = s.institutions.find((x) => x.name === 'Fishmonger');
    expect(monger?.desc).toMatch(/inland/i);
    expect(seaWordSentence(sentencesOf(monger.desc), s)).toBeUndefined();
  });

  it('a fish sentence outside such a text still counts', () => {
    expect(seaWordSentence(['Buys, salts, and sells fish.'], {})).toBe('Buys, salts, and sells fish.');
  });
});
