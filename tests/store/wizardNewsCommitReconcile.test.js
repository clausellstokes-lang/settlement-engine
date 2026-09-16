/**
 * wizardNewsCommitReconcile.test.js — fix wave 2 #2 (deposit-and-consume race).
 *
 * The multi-tick world advance derives result.wizardNews from a clone lifted BEFORE
 * its in-flight yield, then commits it WHOLESALE (applyWorldPulseResultToState). A
 * confirmed table-event import (importTableEvents — the one ungated wizardNews writer)
 * that lands DURING that yield is therefore absent from the result and used to be
 * silently clobbered. reconcileWizardNewsForCommit folds those during-flight entries
 * back in at the pre-commit point of BOTH commit paths (advance + paused-resume),
 * WITHOUT resurrecting the pre-existing entries the advance's own cap intentionally
 * evicted — so a non-concurrent advance stays byte-identical.
 */
import { describe, expect, test } from 'vitest';
import { reconcileWizardNewsForCommit } from '../../src/store/campaignAdvanceSession.js';
import { appendWizardNewsEntries } from '../../src/domain/region/index.js';

const NOW = '2026-02-01T00:00:00.000Z';
const EMPTY = { schemaVersion: 1, currentTick: 0, entries: [] };
const feedOf = (raws) => appendWizardNewsEntries(EMPTY, raws, { now: NOW });
const raw = (id, tick, extra = {}) => ({ id, tick, headline: `H-${id}`, summary: `S-${id}`, significance: 'notable', ...extra });
const ids = (feed) => feed.entries.map(e => e.id).sort();

describe('reconcileWizardNewsForCommit (fix wave 2 #2)', () => {
  test('an import that landed DURING flight survives the wholesale commit', () => {
    const preIds = new Set(['w1']);                                   // pre-advance feed had w1
    const result = feedOf([raw('w1', 10), raw('w2', 11)]);            // advance kept w1, added w2
    const live = feedOf([raw('w1', 10), raw('t1', 8, { source: 'table' })]); // import t1 landed during flight
    const merged = reconcileWizardNewsForCommit(result, live, preIds, NOW);
    expect(ids(merged)).toEqual(['t1', 'w1', 'w2']);                  // import preserved alongside the advance's entries
    expect(merged.entries.find(e => e.id === 't1').source).toBe('table');
  });

  test('a non-concurrent advance is BYTE-IDENTICAL (nothing landed ⇒ same feed by reference)', () => {
    const preIds = new Set(['w1']);
    const result = feedOf([raw('w1', 10), raw('w2', 11)]);
    const live = feedOf([raw('w1', 10)]);                             // live == pre-advance feed, no import
    const merged = reconcileWizardNewsForCommit(result, live, preIds, NOW);
    expect(merged).toBe(result);                                      // untouched reference — no re-append, no re-sort
  });

  test('an entry the advance intentionally EVICTED is NOT resurrected', () => {
    const preIds = new Set(['w1', 'wOld']);                           // wOld existed pre-advance…
    const result = feedOf([raw('w1', 10), raw('w2', 11)]);           // …and the advance's cap dropped it
    const live = feedOf([raw('w1', 10), raw('wOld', 2)]);            // live still carries wOld (no import)
    const merged = reconcileWizardNewsForCommit(result, live, preIds, NOW);
    expect(merged).toBe(result);                                      // wOld's id is in preIds ⇒ excluded ⇒ untouched
    expect(ids(merged)).toEqual(['w1', 'w2']);
  });

  test('preserves an import EVEN WHEN the advance also evicted an old entry', () => {
    const preIds = new Set(['w1', 'wOld']);
    const result = feedOf([raw('w1', 10), raw('w2', 11)]);           // wOld evicted, w2 added
    const live = feedOf([raw('w1', 10), raw('wOld', 2), raw('t1', 9, { source: 'table' })]);
    const merged = reconcileWizardNewsForCommit(result, live, preIds, NOW);
    expect(ids(merged)).toEqual(['t1', 'w1', 'w2']);                 // t1 folded in; wOld stays evicted
  });

  test('idempotent: an already-committed import is not duplicated', () => {
    const preIds = new Set(['w1']);
    const result = feedOf([raw('w1', 10), raw('t1', 8, { source: 'table' })]); // t1 already in result
    const live = feedOf([raw('w1', 10), raw('t1', 8, { source: 'table' })]);
    const merged = reconcileWizardNewsForCommit(result, live, preIds, NOW);
    expect(merged.entries.filter(e => e.id === 't1')).toHaveLength(1);
  });

  test('tolerates a null result feed and a non-Set guard (returns input unchanged)', () => {
    expect(reconcileWizardNewsForCommit(null, feedOf([raw('x', 1)]), new Set(), NOW)).toBeNull();
    const result = feedOf([raw('w1', 10)]);
    // A non-Set guard degrades to "everything on the live feed is new" — but with an
    // identical live feed the appended ids dedupe, so the entry set is unchanged.
    const merged = reconcileWizardNewsForCommit(result, result, /** @type {any} */ (undefined), NOW);
    expect(ids(merged)).toEqual(['w1']);
  });
});
