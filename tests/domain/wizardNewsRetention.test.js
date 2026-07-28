/**
 * tests/domain/wizardNewsRetention.test.js — arc-aware 240-cap retention.
 *
 * wizardNews.js caps the feed at MAX_ENTRIES (240) via capEntries. The cap keeps
 * the RECENCY window intact (so recent low-volume notables — e.g. a season marker
 * — always survive) and additionally RESCUES the heads of major arcs that recency
 * would flush: one slot per story, so a high-volume major arc (a 100-entry crime
 * churn) can contribute at most its single newest entry and never dominate. This
 * suite pins that contract:
 *
 *  - AT/BELOW the cap the retention is a NO-OP — the output is exactly the recency
 *    slice, byte-identical. This keeps every golden (whose feeds are < 240) unchanged.
 *  - ABOVE the cap, recent notables are preserved AND an orphaned major-arc head
 *    (its whole arc fell out of the recency window) is rescued — but only its head,
 *    never the whole arc, and never a non-major arc.
 *
 * Feeds are built directly and pushed through the public ensureWizardNewsFeed /
 * appendWizardNewsEntries. Every entry is given a UNIQUE tick, so recency order is
 * fully determined by tick (desc) and the in-test comparator mirrors sortEntries
 * without depending on the score/createdAt tiebreaks.
 */

import { describe, expect, test } from 'vitest';

import {
  appendObservedWizardNewsEntries,
  ensureWizardNewsFeed,
  appendWizardNewsEntries,
  applyPulseMover,
  WIZARD_NEWS_SIGNIFICANCE,
} from '../../src/domain/region/wizardNews.js';

const MAX = 240;

/**
 * Build a fully-shaped raw feed entry. `tick` is unique per entry across a feed,
 * so recency (tick desc) is unambiguous. Each entry is its OWN arc by default
 * (unique impactId); pass a shared impactId to thread entries into one arc.
 */
function mk(id, { tick, significance = WIZARD_NEWS_SIGNIFICANCE.NOTABLE, impactId = null, kind = 'queued', impactKind = null } = {}) {
  return {
    id,
    createdAt: '2026-01-01T00:00:00.000Z',
    tick,
    scope: 'regional',
    significance,
    score: 50,
    headline: `H:${id}`,
    summary: `S:${id}`,
    kind,
    impactKind,
    channelType: null,
    severity: 0.5,
    settlementIds: [],
    impactIds: [impactId || id],
    channelIds: [],
    sourceEventId: null,
    tags: [],
    reasons: [],
  };
}

/** Mirror of sortEntries' primary key: newest-first by tick (ticks are unique here). */
function recencyIds(entries) {
  return [...entries].sort((a, b) => b.tick - a.tick).map(e => String(e.id));
}

/** True iff `sub` appears in `full` in the same relative order (a subsequence). */
function isSubsequence(sub, full) {
  let i = 0;
  for (const x of full) if (i < sub.length && sub[i] === x) i += 1;
  return i === sub.length;
}

describe('wizard news retention — arc-aware 240-cap', () => {
  // ── DORMANCY: at/below the cap the retention is a pure recency no-op ────────
  // This is the byte-identity guarantee for every golden (all feeds < 240).
  test('at the cap boundary the output is exactly the recency slice (no reordering)', () => {
    // 240 entries, oldest MAJOR + newest NOTABLE — if the cap wrongly reordered
    // or rescued at/below the cap, this ordering would betray it. It must not.
    const entries = [];
    for (let i = 0; i < MAX; i++) {
      const significance = i < 20 ? WIZARD_NEWS_SIGNIFICANCE.MAJOR : WIZARD_NEWS_SIGNIFICANCE.NOTABLE;
      entries.push(mk(`e${i}`, { tick: i + 1, significance })); // tick 1..240; low tick = oldest = major
    }
    const feed = ensureWizardNewsFeed({ currentTick: 0, entries });
    expect(feed.entries).toHaveLength(MAX);
    expect(feed.entries.map(e => e.id)).toEqual(recencyIds(entries));
  });

  test('below the cap every entry is retained in recency order', () => {
    const entries = [];
    for (let i = 0; i < 100; i++) {
      const significance = i < 10 ? WIZARD_NEWS_SIGNIFICANCE.MAJOR : WIZARD_NEWS_SIGNIFICANCE.NOTABLE;
      entries.push(mk(`e${i}`, { tick: i + 1, significance }));
    }
    const feed = ensureWizardNewsFeed({ currentTick: 0, entries });
    expect(feed.entries).toHaveLength(100);
    expect(feed.entries.map(e => e.id)).toEqual(recencyIds(entries));
  });

  // ── RECENCY PRESERVED: a high-volume major arc cannot flush recent notables ─
  test('recent notables survive and a high-volume major arc contributes at most one slot', () => {
    // 300 recent NOTABLEs (distinct arcs), ticks 200..499 — the newest (tick 499)
    // is a season-marker-like low-volume notable. Plus a 100-entry MAJOR crime
    // arc (one arcId), ticks 1..100, entirely OLDER than the recency window.
    const entries = [];
    for (let i = 0; i < 300; i++) {
      entries.push(mk(`note${i}`, { tick: 200 + i, significance: WIZARD_NEWS_SIGNIFICANCE.NOTABLE }));
    }
    const seasonId = 'note299'; // tick 499, the newest — the low-volume story we must keep
    for (let i = 0; i < 100; i++) {
      entries.push(mk(`crime${i}`, { tick: 1 + i, significance: WIZARD_NEWS_SIGNIFICANCE.MAJOR, impactId: 'imp_crime' }));
    }
    const feed = ensureWizardNewsFeed({ currentTick: 0, entries });
    const keptIds = new Set(feed.entries.map(e => e.id));

    expect(feed.entries).toHaveLength(MAX);
    // the recent low-volume notable survives (recency window is preserved)
    expect(keptIds.has(seasonId)).toBe(true);
    // the 100-entry major arc contributes AT MOST one pinned slot (its head), so
    // high-volume churn cannot dominate the feed
    const crimeKept = feed.entries.filter(e => (e.impactIds || [])[0] === 'imp_crime');
    expect(crimeKept.length).toBeLessThanOrEqual(1);
    // and it is exactly one here (the arc's head is orphaned by the recency cut)
    expect(crimeKept.length).toBe(1);
  });

  // ── ORPHAN-HEAD RESCUE: an old major-arc head recency would flush survives ──
  test('an orphaned major-arc head is rescued (head only); non-head + non-major olds are not', () => {
    // 300 recent NOTABLEs fill the recency window (ticks 100..399). Then two OLD
    // arcs, both entirely outside the window: a MAJOR arc (ticks 5,6,7) and a
    // NOTABLE arc (ticks 1,2,3). Only the MAJOR arc's HEAD (its newest, tick 7)
    // is rescued.
    const entries = [];
    for (let i = 0; i < 300; i++) {
      entries.push(mk(`n${i}`, { tick: 100 + i, significance: WIZARD_NEWS_SIGNIFICANCE.NOTABLE }));
    }
    entries.push(mk('major.old.5', { tick: 5, significance: WIZARD_NEWS_SIGNIFICANCE.MAJOR, impactId: 'imp_major_old' }));
    entries.push(mk('major.old.6', { tick: 6, significance: WIZARD_NEWS_SIGNIFICANCE.MAJOR, impactId: 'imp_major_old' }));
    entries.push(mk('major.old.7', { tick: 7, significance: WIZARD_NEWS_SIGNIFICANCE.MAJOR, impactId: 'imp_major_old' }));
    entries.push(mk('notable.old.1', { tick: 1, significance: WIZARD_NEWS_SIGNIFICANCE.NOTABLE, impactId: 'imp_notable_old' }));
    entries.push(mk('notable.old.2', { tick: 2, significance: WIZARD_NEWS_SIGNIFICANCE.NOTABLE, impactId: 'imp_notable_old' }));
    entries.push(mk('notable.old.3', { tick: 3, significance: WIZARD_NEWS_SIGNIFICANCE.NOTABLE, impactId: 'imp_notable_old' }));

    const feed = ensureWizardNewsFeed({ currentTick: 0, entries });
    const keptIds = new Set(feed.entries.map(e => e.id));

    expect(feed.entries).toHaveLength(MAX);
    // the major arc's HEAD (newest stage, tick 7) is rescued...
    expect(keptIds.has('major.old.7')).toBe(true);
    // ...but ONLY the head — its older stages are not
    expect(keptIds.has('major.old.6')).toBe(false);
    expect(keptIds.has('major.old.5')).toBe(false);
    // a NON-major old arc is not rescued at all (no stage survives)
    expect(keptIds.has('notable.old.3')).toBe(false);
    expect(keptIds.has('notable.old.2')).toBe(false);
    expect(keptIds.has('notable.old.1')).toBe(false);
    // a pure recency cut would have flushed the rescued head — prove it
    const recencyKept = new Set(recencyIds(entries).slice(0, MAX));
    expect(recencyKept.has('major.old.7')).toBe(false);
  });

  // ── BOUNDED: never exceed max, for inputs at/over the cap ────────────────────
  test('output length is always <= max (240, 241, 500 inputs)', () => {
    for (const n of [MAX, MAX + 1, 500]) {
      const entries = [];
      for (let i = 0; i < n; i++) {
        // mix majors in so both the recency and rescue paths are exercised
        const significance = i % 7 === 0 ? WIZARD_NEWS_SIGNIFICANCE.MAJOR : WIZARD_NEWS_SIGNIFICANCE.NOTABLE;
        entries.push(mk(`e${i}`, { tick: i + 1, significance }));
      }
      const feed = ensureWizardNewsFeed({ currentTick: 0, entries });
      expect(feed.entries.length).toBeLessThanOrEqual(MAX);
      // at/over the cap the feed fills exactly to the cap
      expect(feed.entries.length).toBe(Math.min(n, MAX));
    }
  });

  // ── DETERMINISM: same input → identical output, repeatedly ──────────────────
  test('same input yields identical output ids across repeated calls', () => {
    const entries = [];
    for (let i = 0; i < 400; i++) {
      // a mix of single-entry major arcs and one big shared major arc
      const significance = i % 5 === 0 ? WIZARD_NEWS_SIGNIFICANCE.MAJOR : WIZARD_NEWS_SIGNIFICANCE.NOTABLE;
      const impactId = i < 80 ? 'imp_bulk' : null; // first 80 (oldest) share one arc
      entries.push(mk(`e${i}`, { tick: i + 1, significance, impactId }));
    }
    const a = ensureWizardNewsFeed({ currentTick: 0, entries }).entries.map(e => e.id);
    const b = ensureWizardNewsFeed({ currentTick: 0, entries }).entries.map(e => e.id);
    const c = appendWizardNewsEntries({ currentTick: 0, entries: [] }, entries).entries.map(e => e.id);
    expect(b).toEqual(a);
    expect(c).toEqual(a);
  });

  // ── ORDER PRESERVED: output is a subsequence of the recency-sorted input ─────
  test('the capped output is a subsequence of the recency-sorted input', () => {
    const entries = [];
    for (let i = 0; i < 350; i++) {
      const significance = i % 6 === 0 ? WIZARD_NEWS_SIGNIFICANCE.MAJOR : WIZARD_NEWS_SIGNIFICANCE.NOTABLE;
      // a couple of shared old major arcs so rescued heads must still slot into order
      const impactId = i < 40 ? `imp_shared_${i % 3}` : null;
      entries.push(mk(`e${i}`, { tick: i + 1, significance, impactId }));
    }
    const feed = ensureWizardNewsFeed({ currentTick: 0, entries });
    const out = feed.entries.map(e => e.id);
    const recency = recencyIds(entries);
    expect(isSubsequence(out, recency)).toBe(true);
  });

  test('the audit sink receives every valid raw receipt before the 240-entry cap', () => {
    const entries = Array.from(
      { length: 300 },
      (_, i) => mk(`raw${i}`, { tick: i + 1 }),
    );
    const receiptSink = [];
    const feed = appendObservedWizardNewsEntries(
      { currentTick: 0, entries: [] },
      entries,
      { now: '2026-01-01T00:00:00.000Z' },
      receiptSink,
    );

    expect(feed.entries).toHaveLength(MAX);
    expect(receiptSink).toHaveLength(300);
    expect(receiptSink.map((entry) => entry.id)).toEqual(entries.map((entry) => entry.id));
  });

  test('a late pulse mover is captured even when feed retention evicts its receipt', () => {
    const fullFeed = ensureWizardNewsFeed({
      currentTick: 340,
      entries: Array.from(
        { length: MAX },
        (_, i) => mk(`kept${i}`, { tick: 100 + i }),
      ),
    });
    const lateReceipt = mk('late-mover', { tick: 1 });
    const receiptSink = [];
    const moved = applyPulseMover(
      {
        changed: true,
        worldState: { tick: 340 },
        settlementUpdates: [],
        newsEntries: [lateReceipt],
      },
      {},
      [],
      fullFeed,
      '2026-01-01T00:00:00.000Z',
      receiptSink,
    );

    expect(moved.wizardNews.entries).toHaveLength(MAX);
    expect(moved.wizardNews.entries.some((entry) => entry.id === lateReceipt.id)).toBe(false);
    expect(receiptSink).toEqual([lateReceipt]);
  });
});
