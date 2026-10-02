/**
 * heraldLensAdvanceSpan.test.js — FP-21 U1: THE HERALD'S "THIS ADVANCE" LENS FOLLOWS THE
 * ADVANCE'S SPAN (the chair's ruling of 2026-09-24, taken under the owner's word "Again, I
 * leave all judgment to you").
 *
 * THE DEFECT, MEASURED BY THE READS. FP EXPERIENCE READ 1 §3 S1 (year grain: advance 19 showed
 * 4 items of the 206 its year minted) and READ 2 §6 (month grain: the lens filed 134 of the 661
 * receipts over 24 months, every one from the month's final week). The cause: the lens kept
 * `tick >= latestPulse.tick`, and the interval orchestrator collapses a composed advance to ONE
 * pulse record at its final tick (advanceInterval.js collapseIntervalHistory), so the rule that
 * was exact for a one-week advance kept only the last week of a month or a year. The
 * validation pass recorded exactly this as R-57 (docs/COMPREHENSIVE_REVIEW_2026-08-01.md:
 * "a semantics note, NOT a bug ... If whole-interval semantics are ever wanted, the filter is
 * `entry.tick > previousSurvivingPulse.tick`"); FP-21 is that want, on the reads' evidence.
 *
 * THE CURE (heraldFeed.js advanceLensFloorTick): the lens files every recorded beat whose tick
 * is ABOVE the advance's floor, the clock the advance began from. These pins drive the pure
 * selector the Realm Inspector and the phone companion both read (buildHeraldFeed).
 *
 * @enforced-by this file (the selector) and tests/ui/heraldLensAdvanceSpan.surface.test.jsx (the door)
 */
import { describe, expect, test } from 'vitest';
import { advanceLensFloorTick, buildHeraldFeed } from '../../src/components/map/heraldFeed.js';
import { appendWizardNewsEntries } from '../../src/domain/region/wizardNews.js';
import { INTERVAL_WEEKS } from '../../src/domain/worldPulse/worldState.js';

const NOW = '2026-09-24T00:00:00.000Z';

/** One war-desk beat minted at `tick` (the house id shape, unique per tick and slot). */
function raid(tick, slot = 0) {
  return {
    id: `wizard_news.${tick}.webwar_raid.a.v.b.${slot}`,
    kind: 'webwar_raid',
    significance: 'notable',
    severity: 0.4,
    score: 40,
    tick,
    headline: `Aldermoor raids Irondell (week ${tick}, slot ${slot})`,
    summary: 'x',
    settlementIds: ['a', 'v', 'b'],
  };
}

/** A pulse record as the collapse leaves it: one per advance, at the advance's final tick. */
function pulse(tick) {
  return { tick, selectedOutcomes: [], impactDigest: [], resolvedStressors: [] };
}

/** A campaign whose durable history holds `recordTicks` and whose feed holds `entries`. */
function campaignWith(recordTicks, entries, extraWorld = {}) {
  return {
    worldState: { pulseHistory: recordTicks.map(pulse), stressors: [], ...extraWorld },
    wizardNews: appendWizardNewsEntries({}, entries, { now: NOW }),
  };
}

/** The ticks of the war desk's items under a lens, ascending (the desk every raid files to). */
function warTicks(campaign, lens) {
  return buildHeraldFeed(campaign, { lens }).bySection.war.map((item) => item.tick).sort((a, b) => a - b);
}

/** [from..to] inclusive. */
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

describe('FP-21 U1 — the advance lens files the span of the advance just taken', () => {
  test('a month advance files the month: a beat in each of its four weeks shows, and the previous advance\'s beat does not', () => {
    // The previous advance ended at tick 4; this one-month advance ran ticks 5..8 and
    // collapsed to one record at 8. One beat per week, plus one from the previous advance.
    const month = INTERVAL_WEEKS.one_month;
    const campaign = campaignWith([4, 4 + month], [raid(4), ...range(5, 4 + month).map((t) => raid(t))]);
    expect(month).toBe(4);
    expect(warTicks(campaign, 'advance')).toEqual([5, 6, 7, 8]);
    // CONTROL: the previous advance's beat is in the feed, so its absence above measures the lens.
    expect(warTicks(campaign, 'campaign')).toEqual([4, 5, 6, 7, 8]);
  });

  test('a year advance files the year: all fifty-two weekly beats show', () => {
    const year = INTERVAL_WEEKS.one_year;
    const campaign = campaignWith([year, 2 * year], [raid(year), ...range(year + 1, 2 * year).map((t) => raid(t))]);
    const shown = warTicks(campaign, 'advance');
    expect(shown).toHaveLength(year);
    expect(shown).toEqual(range(year + 1, 2 * year));
  });

  test('a week advance files the week alone, exactly the window the lens always kept', () => {
    const campaign = campaignWith([13, 14], [raid(12), raid(13), raid(14), raid(14, 1)]);
    expect(warTicks(campaign, 'advance')).toEqual([14, 14]);
  });

  test('a season advance files its thirteen weeks', () => {
    const season = INTERVAL_WEEKS.one_season;
    const campaign = campaignWith([26, 26 + season], range(26, 26 + season).map((t) => raid(t)));
    expect(warTicks(campaign, 'advance')).toEqual(range(27, 26 + season));
  });

  test('the first advance runs from the birth clock: a beat on the table before it stays off the lens', () => {
    // A fresh world is born at tick 0 (ensureWorldState floors the clock there); the first
    // one-month advance runs 1..4. A tick-0 beat (a DM act before any advance) is not this advance's.
    const campaign = campaignWith([4], [raid(0), raid(1), raid(2), raid(3), raid(4)]);
    expect(warTicks(campaign, 'advance')).toEqual([1, 2, 3, 4]);
  });

  test('a paused interval files the weeks it has run so far, not only the week it paused on', () => {
    // A one-year advance from tick 10 paused on its third week (Stage 3): its three interior
    // records have not collapsed, and the cursor counts three weeks done at tick 13.
    const campaign = campaignWith(
      [10, 11, 12, 13],
      [raid(10), raid(11), raid(12), raid(13)],
      { pausedAdvance: { interval: 'one_year', ticksTotal: 52, ticksDone: 3, atTick: 13, resumeTick: 2 } },
    );
    expect(warTicks(campaign, 'advance')).toEqual([11, 12, 13]);
  });

  test('with no recorded pulse the whole feed is current (unchanged)', () => {
    const campaign = campaignWith([], [raid(0), raid(0, 1)]);
    expect(warTicks(campaign, 'advance')).toEqual([0, 0]);
  });

  test('the campaign lens is unchanged: every recorded beat, whatever the grain', () => {
    const campaign = campaignWith([4, 8], range(1, 8).map((t) => raid(t)));
    expect(warTicks(campaign, 'campaign')).toEqual(range(1, 8));
  });

  test('a beat the DM mints between advances files at once, at the clock the advance ended on', () => {
    // After the month ending at 8 the world clock reads 8; a DM act mints at that clock and
    // belongs on the lens now (it did under the old rule too).
    const campaign = campaignWith([4, 8], [raid(6), raid(8), raid(8, 1)]);
    expect(warTicks(campaign, 'advance')).toEqual([6, 8, 8]);
  });

  test('the span lens is never narrower than the final week the old lens kept (a degenerate history)', () => {
    // Two records at one tick cannot come from the kernel (every pass bumps the clock), but a
    // hand-edited or legacy save could carry them. The floor clamps to the latest tick minus
    // one, so the final week still shows rather than an empty desk.
    const campaign = campaignWith([9, 9], [raid(8), raid(9)]);
    expect(warTicks(campaign, 'advance')).toEqual([9]);
  });

  test('the pulse sources follow the same floor: a paused interval files each run week\'s record', () => {
    const record = (tick, id) => ({ tick, selectedOutcomes: [], impactDigest: [{ id, kind: 'webwar_raid', headline: `digest ${tick}`, summary: '', tick, severity: 0.3, settlementIds: ['a'] }], resolvedStressors: [] });
    const campaign = {
      worldState: {
        pulseHistory: [record(10, 'd10'), record(11, 'd11'), record(12, 'd12')],
        stressors: [],
        pausedAdvance: { ticksDone: 2, atTick: 12 },
      },
      wizardNews: { entries: [] },
    };
    const ids = buildHeraldFeed(campaign, { lens: 'advance' }).bySection.war.map((item) => item.id).sort();
    expect(ids).toEqual(['d11', 'd12']);
  });
});

describe('FP-21 U1 — advanceLensFloorTick, the floor on every lifecycle path', () => {
  test('no recorded pulse: null (the whole feed is current)', () => {
    expect(advanceLensFloorTick({ pulseHistory: [] })).toBeNull();
    expect(advanceLensFloorTick({})).toBeNull();
    expect(advanceLensFloorTick(null)).toBeNull();
  });

  test('a completed advance of any grain: the previous record\'s tick', () => {
    expect(advanceLensFloorTick({ pulseHistory: [pulse(3), pulse(4)] })).toBe(3);
    expect(advanceLensFloorTick({ pulseHistory: [pulse(4), pulse(8)] })).toBe(4);
    expect(advanceLensFloorTick({ pulseHistory: [pulse(52), pulse(104)] })).toBe(52);
  });

  test('the first advance: the birth clock, zero', () => {
    expect(advanceLensFloorTick({ pulseHistory: [pulse(52)] })).toBe(0);
  });

  test('a paused interval: the cursor\'s tick less the weeks it has run', () => {
    expect(advanceLensFloorTick({
      pulseHistory: [pulse(10), pulse(11), pulse(12), pulse(13)],
      pausedAdvance: { atTick: 13, ticksDone: 3 },
    })).toBe(10);
    // A legacy cursor without the counts falls back to the record rule.
    expect(advanceLensFloorTick({
      pulseHistory: [pulse(10), pulse(11)],
      pausedAdvance: { interval: 'one_month' },
    })).toBe(10);
  });

  test('clamped to the latest tick minus one', () => {
    expect(advanceLensFloorTick({ pulseHistory: [pulse(9), pulse(9)] })).toBe(8);
  });
});
