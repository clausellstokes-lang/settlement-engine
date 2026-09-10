/**
 * tests/domain/wizardNewsCovert.test.js — the covert marker survives normalization (SB2).
 *
 * The World Book's player face filters covert entries via isCovertEntry, which
 * reads `e.covert === true` and the covert/concealed tags. normalizeEntry used to
 * DROP the top-level `covert` flag, so that branch was dead against any persisted
 * feed — an imported covert entry lost its marker before the filter could see it.
 * The pass-through is the V-17 `source` idiom: conditional, so every entry the
 * generated world writes (which never carries `covert`) serializes byte-identically.
 */
import { describe, expect, it } from 'vitest';
import { ensureWizardNewsFeed } from '../../src/domain/region/wizardNews.js';

const NOW = '2026-01-01T00:00:00.000Z';
const raw = { id: 'e1', tick: 3, headline: 'A quiet season', significance: 'major' };

describe('normalizeEntry covert pass-through (via ensureWizardNewsFeed)', () => {
  it('preserves covert:true through normalization', () => {
    const feed = ensureWizardNewsFeed({ entries: [{ ...raw, covert: true }] }, { now: NOW });
    expect(feed.entries).toHaveLength(1);
    expect(feed.entries[0].covert).toBe(true);
  });

  it('is byte-neutral for a plain entry — no covert key appears', () => {
    const feed = ensureWizardNewsFeed({ entries: [{ ...raw }] }, { now: NOW });
    expect(feed.entries).toHaveLength(1);
    expect('covert' in feed.entries[0]).toBe(false);
  });

  it('a non-boolean / falsy covert never mints the flag (fail closed to absent)', () => {
    for (const junk of [false, 0, 'yes', null]) {
      const feed = ensureWizardNewsFeed({ entries: [{ ...raw, covert: junk }] }, { now: NOW });
      expect('covert' in feed.entries[0]).toBe(false);
    }
  });

  it('covert/concealed TAGS also survive (the other isCovertEntry branch)', () => {
    const feed = ensureWizardNewsFeed({ entries: [{ ...raw, tags: ['covert'] }] }, { now: NOW });
    expect(feed.entries[0].tags).toContain('covert');
  });
});
