/**
 * heraldFilter.test.js — THE FOCUS / SEARCH / SORT LAW pins (Phase 4).
 *
 * Pure logic: focus scopes every door to one settlement (primary OR membership),
 * search is structured over resolved names + the recorded headline (never blind deep
 * fields), needs-attention triages, and THE SORT LAW floats cross-realm crises above
 * the alphabet then clusters the rest alphabetically by settlement.
 */
import { describe, test, expect } from 'vitest';
import {
  matchesFocus,
  matchesQuery,
  needsAttention,
  severityBand,
  filterFeed,
  partitionUrgent,
  sortGroupsAlphabetical,
  needsAttentionDigest,
  URGENT_SEVERITY,
} from '../../src/components/map/heraldFilter.js';
import { groupBySettlement } from '../../src/components/map/heraldGrammar.js';

const nameById = new Map([['s1', 'Ashford'], ['s2', 'Bram'], ['s3', 'Cinder']]);

const W1 = { id: 'w1', section: 'war', headline: 'Siege at Ashford', severity: 0.9, major: true, tick: 7, subject: { settlementId: 's1' }, affectedIds: ['s1', 's2'], kind: 'siege', provenance: 'canon' };
const W2 = { id: 'w2', section: 'war', headline: 'A skirmish', severity: 0.3, major: false, tick: 6, subject: { settlementId: 's2' }, affectedIds: ['s2'], kind: 'raid', provenance: 'canon' };
const T1 = { id: 't1', section: 'trade', headline: 'An embargo', severity: 0.5, major: false, tick: 7, subject: { settlementId: 's3' }, affectedIds: ['s3'], kind: 'embargo', provenance: 'amendable' };
const feed = { bySection: { war: [W1, W2], faith: [], trade: [T1], events: [], divination: [], adjudication: [] } };

describe('focus + query + attention (composable narrowing)', () => {
  test('matchesFocus: primary settlement OR a membership touch', () => {
    expect(matchesFocus(W1, 's1')).toBe(true);  // primary
    expect(matchesFocus(W1, 's2')).toBe(true);  // affected membership
    expect(matchesFocus(W2, 's1')).toBe(false);
    expect(matchesFocus(W1, null)).toBe(true);  // no focus ⇒ everything
  });

  test('matchesQuery is structured — over the resolved names + headline, not deep fields', () => {
    expect(matchesQuery(W1, 'ashford', nameById)).toBe(true);   // headline + name
    expect(matchesQuery(W2, 'bram', nameById)).toBe(true);      // resolved name of s2
    expect(matchesQuery(W2, 'siege', nameById)).toBe(false);    // not this item's headline/kind
    expect(matchesQuery(W1, '', nameById)).toBe(true);          // empty ⇒ all
  });

  test('needsAttention triages major / critical / pending / covert', () => {
    expect(needsAttention(W1)).toBe(true);  // major
    expect(needsAttention(W2)).toBe(false); // routine
    expect(needsAttention(T1)).toBe(true);  // amendable (pending)
  });

  test('severityBand mirrors the >=0.72 critical threshold', () => {
    expect(severityBand(W1)).toBe('critical');
    expect(severityBand(T1)).toBe('strained');
    expect(severityBand(W2)).toBe('routine');
  });

  test('filterFeed narrows every section together and reports counts', () => {
    const focused = filterFeed(feed, { focusId: 's1', nameById });
    expect(focused.bySection.war.map(i => i.id)).toEqual(['w1']); // only w1 touches s1
    expect(focused.counts.trade).toBe(0);                         // nothing at s1 in trade

    const attention = filterFeed(feed, { attention: true, nameById });
    expect(attention.bySection.war.map(i => i.id)).toEqual(['w1']);
    expect(attention.bySection.trade.map(i => i.id)).toEqual(['t1']);

    const strained = filterFeed(feed, { band: 'strained', nameById });
    expect(strained.bySection.trade.map(i => i.id)).toEqual(['t1']);
    expect(strained.bySection.war).toEqual([]);
  });
});

describe('THE SORT LAW', () => {
  test('partitionUrgent floats cross-realm crises above the alphabet', () => {
    const { urgent, rest } = partitionUrgent([W1, W2, T1]);
    expect(urgent.map(i => i.id)).toEqual(['w1']); // 0.9 >= URGENT_SEVERITY
    expect(rest.map(i => i.id)).toEqual(['w2', 't1']);
    expect(URGENT_SEVERITY).toBeGreaterThan(0.72);
  });

  test('sortGroupsAlphabetical orders by settlement name, realm-wide last', () => {
    const items = [
      { id: 'a', subject: { settlementId: 's3' }, affectedIds: ['s3'] }, // Cinder
      { id: 'b', subject: { settlementId: 's1' }, affectedIds: ['s1'] }, // Ashford
      { id: 'c', subject: {}, affectedIds: [] },                          // realm-wide
    ];
    const groups = sortGroupsAlphabetical(groupBySettlement(items, nameById));
    expect(groups.map(g => g.name)).toEqual(['Ashford', 'Cinder', 'Across the realm']);
  });

  test('needsAttentionDigest returns the K most-severe attention items, severity-first', () => {
    const digest = needsAttentionDigest(feed, 4);
    expect(digest.map(i => i.id)).toEqual(['w1', 't1']); // w2 is routine (excluded)
    expect(digest[0].id).toBe('w1'); // highest severity first
  });
});
