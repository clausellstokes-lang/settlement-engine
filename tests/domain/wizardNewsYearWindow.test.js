/**
 * wizardNewsYearWindow.test.js — FP-21 U2 under ruling FP-31 (the chair, 2026-09-24, vetoable by
 * the owner): THE NEWS FEED KEEPS THE LAST YEAR WHOLE.
 *
 * THE DEFECT, MEASURED BY THE READS. The feed was capped at MAX_ENTRIES (240) on EVERY append,
 * and the kernel appends once per weekly tick, so at the year grain the news of the advance in
 * progress was evicted before any surface could show it: FP EXPERIENCE READ 2 §3 S4 (year one
 * minted 426 receipts, the feed kept 240, and the four war-termination lines never surfaced);
 * this lane's re-measure at 82e41adbd (434 minted in year one, 240 kept).
 *
 * THE CURE (src/domain/region/wizardNews.js capEntries): every entry inside the newest
 * INTERVAL_WEEKS.one_year ticks of the feed survives; the policy of record (recency plus the
 * major-arc rescue) runs unchanged and decides only what survives BEYOND that window. It is a
 * STATED behaviour change: the engine now remembers at least a year of news. The window is
 * anchored on the newest entry and knows nothing of the advance grain, so a one-year advance
 * still composes the same feed as fifty-two one-week advances.
 *
 * Every feed here goes through the public ensureWizardNewsFeed / appendWizardNewsEntries, and the
 * year is appended week by week, which is exactly how the kernel feeds the cap.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';
import { RETENTION_WINDOW_TICKS, appendWizardNewsEntries, ensureWizardNewsFeed } from '../../src/domain/region/wizardNews.js';
import { buildHeraldFeed } from '../../src/components/map/heraldFeed.js';
import { INTERVAL_WEEKS } from '../../src/domain/worldPulse/intervalWeeks.js';

const NOW = '2026-09-24T00:00:00.000Z';
const YEAR = INTERVAL_WEEKS.one_year;
const CAP = 240;

/**
 * One raw feed entry, each on its OWN arc (a unique place), so no rescue applies unless a
 * test asks for a major one. `slot` keeps ids unique within a tick.
 */
function entry(tick, slot, { significance = 'notable', score = 10 } = {}) {
  return {
    id: `wizard_news.${tick}.year_window.${slot}`,
    tick,
    scope: 'settlement',
    significance,
    score,
    headline: `a week's report ${tick}.${slot}`,
    summary: '',
    kind: 'applied',
    impactKind: 'drift',
    severity: 0.2,
    settlementIds: [`place.${tick}.${slot}`],
    sourceEventId: `year_window_event.${tick}.${slot}`,
  };
}

/** `count` entries at `tick`. */
const week = (tick, count) => Array.from({ length: count }, (_, slot) => entry(tick, slot));

/** A feed already AT the cap: 240 older entries, five a week, weeks 1..48. */
function feedAtTheCap() {
  const older = [];
  for (let tick = 1; tick <= 48; tick += 1) older.push(...week(tick, 5));
  const feed = ensureWizardNewsFeed({ entries: older }, { now: NOW });
  expect(feed.entries).toHaveLength(CAP);
  return feed;
}

/**
 * The year of 400 entries after `start`: weeks start+1..start+YEAR, eight a week for the first
 * thirty-six weeks and seven for the last sixteen (36 x 8 + 16 x 7 = 400), APPENDED WEEK BY
 * WEEK through the real cap, as the kernel's weekly ticks append them.
 */
function appendABusyYear(feed, start) {
  let next = feed;
  for (let i = 1; i <= YEAR; i += 1) {
    next = appendWizardNewsEntries(next, week(start + i, i <= 36 ? 8 : 7), { now: NOW });
  }
  return next;
}

const ticksOf = (feed) => feed.entries.map((e) => e.tick);

describe('FP-21 U2 / FP-31 — the feed keeps the last year whole', () => {
  test('a year advance keeps every week\'s items: 400 entries minted across fifty-two weekly appends all survive', () => {
    expect(YEAR).toBe(52);
    // FP-34: the feed's local window constant IS the year, pinned here so the two can never drift apart.
    expect(RETENTION_WINDOW_TICKS).toBe(INTERVAL_WEEKS.one_year);
    const feed = appendABusyYear(feedAtTheCap(), 52);
    expect(feed.entries).toHaveLength(400);
    // Every week of the year is present, and every entry is the year's own (the older 240 fell
    // out of the window and under the cap).
    expect(new Set(ticksOf(feed)).size).toBe(YEAR);
    expect(Math.min(...ticksOf(feed))).toBe(53);
    expect(Math.max(...ticksOf(feed))).toBe(104);
  });

  test('the Herald\'s "This advance" lens shows the whole year advance, every item once', () => {
    const feed = appendABusyYear(feedAtTheCap(), 52);
    const campaign = {
      worldState: {
        pulseHistory: [52, 104].map((tick) => ({ tick, selectedOutcomes: [], impactDigest: [], resolvedStressors: [] })),
        stressors: [],
      },
      wizardNews: feed,
    };
    const { bySection } = buildHeraldFeed(campaign, { lens: 'advance' });
    const ids = Object.values(bySection).flat().map((item) => item.id);
    expect(ids).toHaveLength(400);
    expect(new Set(ids).size).toBe(400);
  });

  test('entries older than fifty-two weeks still fall under the cap', () => {
    // After the busy year, a quiet one: two a week for fifty-two weeks (104 entries). The
    // window now holds 104, so the cap of record applies beyond it: the newest 240 survive,
    // which is the quiet year whole plus the newest 136 of the busy year (its last sixteen
    // weeks at seven, then weeks 88, 87 and 86 at eight).
    let feed = appendABusyYear(feedAtTheCap(), 52);
    for (let tick = 105; tick <= 104 + YEAR; tick += 1) {
      feed = appendWizardNewsEntries(feed, week(tick, 2), { now: NOW });
    }
    expect(feed.entries).toHaveLength(CAP);
    const olderSurvivors = ticksOf(feed).filter((tick) => tick <= 104);
    expect(olderSurvivors).toHaveLength(136);
    expect(Math.min(...olderSurvivors)).toBe(86);
  });

  test('below the window the policy of record is unchanged: one entry a week over 300 weeks keeps the newest 240', () => {
    const entries = Array.from({ length: 300 }, (_, i) => entry(i + 1, 0));
    const feed = ensureWizardNewsFeed({ entries }, { now: NOW });
    expect(feed.entries).toHaveLength(CAP);
    expect(Math.min(...ticksOf(feed))).toBe(61);
    // At or below the cap nothing is evicted at all.
    const small = ensureWizardNewsFeed({ entries: entries.slice(0, CAP) }, { now: NOW });
    expect(small.entries).toHaveLength(CAP);
  });

  test('the cap still applies beyond a full window, arc rescue included: an older MAJOR arc outlives the year', () => {
    // A full window (six a week over the newest fifty-two weeks: 312 entries) above an older
    // flood, with one MAJOR beat at week 20. The policy of record rescues the major arc's head;
    // the window keeps the year whole; both survive together.
    const entries = [];
    for (let tick = 101; tick <= 100 + YEAR; tick += 1) entries.push(...week(tick, 6));
    for (let tick = 21; tick <= 60; tick += 1) entries.push(...week(tick, 3));
    const major = entry(20, 0, { significance: 'major', score: 90 });
    entries.push(major);
    const feed = ensureWizardNewsFeed({ entries }, { now: NOW });
    const ids = new Set(feed.entries.map((e) => e.id));
    expect(feed.entries).toHaveLength(312 + 1);
    expect(ids.has(major.id)).toBe(true);
    expect(feed.entries.filter((e) => e.tick > 100)).toHaveLength(312);
  });

  test('the window is exactly one year: the week fifty-one weeks back is kept, the week fifty-two back is not', () => {
    // A full window above its own edge: newest week 100 + YEAR, five a week inside it.
    const newest = 100 + YEAR;
    const entries = [];
    for (let tick = newest - YEAR + 2; tick <= newest; tick += 1) entries.push(...week(tick, 5));
    const inside = entry(newest - (YEAR - 1), 0);
    const outside = entry(newest - YEAR, 0);
    entries.push(inside, outside);
    expect(entries.length).toBeGreaterThan(CAP);
    const ids = new Set(ensureWizardNewsFeed({ entries }, { now: NOW }).entries.map((e) => e.id));
    expect(ids.has(inside.id)).toBe(true);
    // anchored: the positive arm on the line above proves this feed is live and holds the window's own edge
    expect(ids.has(outside.id)).toBe(false);
  });

  test('re-capping a capped feed changes nothing (every load and every tick re-caps)', () => {
    const entries = [];
    for (let tick = 101; tick <= 100 + YEAR; tick += 1) entries.push(...week(tick, 6));
    for (let tick = 21; tick <= 60; tick += 1) entries.push(...week(tick, 3));
    entries.push(entry(20, 0, { significance: 'major', score: 90 }));
    const once = ensureWizardNewsFeed({ entries }, { now: NOW });
    const twice = ensureWizardNewsFeed(once, { now: NOW });
    expect(twice.entries).toEqual(once.entries);
    const busy = appendABusyYear(feedAtTheCap(), 52);
    expect(ensureWizardNewsFeed(busy, { now: NOW }).entries).toEqual(busy.entries);
  });
});
