import { describe, expect, test } from 'vitest';

import {
  FACTION_STATE_PRUNE_GRACE_TICKS,
  advanceWorldCalendar,
  createDefaultWorldState,
  previewCampaignWorldPulse,
  pruneFactionStates,
  weeksPerInterval,
} from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';

// R4 pin (audit "calendar contradiction"): campaigns seed {month:1,
// season:'spring'} — that seeded default is the documented intent — but the
// SEASONS array used to map months 1-3 to winter, so the very first tick
// flipped a fresh world spring->winter and the +0.08 winter food-pressure bias
// skewed early famines.
describe('world calendar — month/season agreement', () => {
  test('tick 1 from a fresh world stays spring', () => {
    const fresh = createDefaultWorldState({ id: 'cal' });
    expect(fresh.calendar).toMatchObject({ month: 1, season: 'spring' });

    const afterOneMonth = advanceWorldCalendar(fresh.calendar, 'one_month');
    expect(afterOneMonth.month).toBe(2);
    expect(afterOneMonth.season).toBe('spring');

    // Integration: a real first pulse agrees.
    const result = previewCampaignWorldPulse({
      campaign: { id: 'cal-pin', name: 'Calendar', settlementIds: [] },
      saves: [],
      interval: 'one_month',
      now: NOW,
    });
    expect(result.tick).toBe(1);
    expect(result.calendar.season).toBe('spring');
  });

  // Calendar unification (Option A): weeks are canonical — 13 four-week months
  // to the 52-week year, seasons as four 13-week quarters of the WEEK grid.
  test('seasons are four 13-week quarters of the 52-week year (weekly walk + wrap)', () => {
    let calendar = createDefaultWorldState({ id: 'cal' }).calendar;
    for (let week = 1; week <= 52; week++) {
      calendar = advanceWorldCalendar(calendar, 'one_week');
      // Week-of-year after this tick (week 52 wraps to week 0 of year 2).
      const weekOfYear = week % 52;
      const expected = ['spring', 'summer', 'autumn', 'winter'][Math.floor(weekOfYear / 13)];
      expect(`${week}:${calendar.season}`).toBe(`${week}:${expected}`);
    }
    // Full wrap: 52 weeks later it is month 1 of year 2, week-of-year 0 — spring
    // again, agreeing with the seeded default for a year's opening.
    expect(calendar).toMatchObject({ elapsedMonths: 13, month: 1, year: 2, season: 'spring' });
  });

  test('month-boundary seasons across the 13-month year (4/3/3/3 quarters at month starts)', () => {
    // Sampled at whole-month boundaries (one_month steps). Months and seasons
    // live on different grids: month 4 OPENS in spring (week 12) and turns
    // summer mid-month (week 13) — the label at a month boundary is the season
    // of that month's first week.
    const expectedAtMonthStart = {
      1: 'spring', 2: 'spring', 3: 'spring', 4: 'spring',
      5: 'summer', 6: 'summer', 7: 'summer',
      8: 'autumn', 9: 'autumn', 10: 'autumn',
      11: 'winter', 12: 'winter', 13: 'winter',
    };
    let calendar = createDefaultWorldState({ id: 'cal' }).calendar;
    for (let i = 0; i < 13; i++) {
      calendar = advanceWorldCalendar(calendar, 'one_month');
      expect(`${calendar.month}:${calendar.season}`).toBe(`${calendar.month}:${expectedAtMonthStart[calendar.month]}`);
    }
    // Full wrap: thirteen months later it is month 1 of year 2 — spring again.
    expect(calendar).toMatchObject({ elapsedMonths: 13, month: 1, year: 2, season: 'spring' });
  });

  test('COARSE == WEEKLY: every DM interval lands the byte-identical calendar either way', () => {
    // The unification invariant: one coarse advanceWorldCalendar(interval) call
    // equals its decomposed one-week walk — same elapsedMonths, month, year,
    // season. Checked from a fresh year AND from a mid-year offset (catches
    // boundary-anchored derivations that only agree at week 0).
    const starts = [];
    starts.push(createDefaultWorldState({ id: 'cal' }).calendar);
    let mid = createDefaultWorldState({ id: 'cal' }).calendar;
    for (let i = 0; i < 7; i++) mid = advanceWorldCalendar(mid, 'one_week');
    starts.push(mid);

    for (const start of starts) {
      for (const [interval, weeks] of Object.entries(weeksPerInterval)) {
        const coarse = advanceWorldCalendar(start, interval);
        let weekly = start;
        for (let i = 0; i < weeks; i++) weekly = advanceWorldCalendar(weekly, 'one_week');
        expect(weekly).toEqual(coarse);
      }
    }

    // The headline landing: a one_year advance is year+1, month 1, week-of-year
    // 0 (the new year's opening week) — identical on BOTH paths per the loop
    // above; this pins the absolute values too.
    const year = advanceWorldCalendar(createDefaultWorldState({ id: 'cal' }).calendar, 'one_year');
    expect(year).toEqual({ elapsedMonths: 13, month: 1, year: 2, season: 'spring' });
  });

  test('kernel integration: one coarse one_year preview and 52 threaded one_week previews land the identical calendar', () => {
    // Same invariant one level up — through the pulse kernel's calendar wiring,
    // not just the pure helper. (Tick counts differ by design: the coarse call
    // is ONE kernel tick of one_year duration — a legacy preview shape — while
    // the real Advance path runs 52 one-week ticks. The CALENDAR must agree.)
    const base = { id: 'cal-eq', name: 'Calendar', settlementIds: [] };
    const coarse = previewCampaignWorldPulse({ campaign: base, saves: [], interval: 'one_year', now: NOW });
    let campaign = base;
    let last = null;
    for (let i = 0; i < 52; i++) {
      last = previewCampaignWorldPulse({ campaign, saves: [], interval: 'one_week', now: NOW });
      campaign = { ...campaign, worldState: last.worldState };
    }
    expect(last.calendar).toEqual(coarse.calendar);
    expect(coarse.calendar).toMatchObject({ month: 1, year: 2, season: 'spring' });
  });
});

// R4 pin (audit "factionStates never pruned"): faction ids are name-keyed, so
// a coup-renamed governing faction leaves a permanent ghost that
// settlementCaptureState keeps scanning and rivals[] keeps referencing.
describe('faction state hygiene — ghost pruning', () => {
  const rosterSnapshot = (ids = ['a']) => ({
    settlements: ids.map(id => ({
      id,
      settlement: {
        powerStructure: {
          factions: [{ faction: 'Merchant League', category: 'economy', power: 70 }],
        },
      },
    })),
  });

  const ghost = (patch = {}) => ({
    factionId: 'a:old_regime',
    settlementId: 'a',
    name: 'Old Regime',
    archetype: 'noble',
    rivals: [],
    captureState: 'none',
    ...patch,
  });

  const live = (patch = {}) => ({
    factionId: 'a:merchant_league',
    settlementId: 'a',
    name: 'Merchant League',
    archetype: 'merchant',
    rivals: [],
    captureState: 'none',
    ...patch,
  });

  test('a roster-absent state is stamped, survives the grace window, then prunes', () => {
    let worldState = { factionStates: { 'a:merchant_league': live(), 'a:old_regime': ghost() } };

    // First absent tick: stamped, not pruned.
    worldState = pruneFactionStates(worldState, rosterSnapshot(), { tick: 10 });
    expect(worldState.factionStates['a:old_regime'].missingSinceTick).toBe(10);

    // Still inside the grace window.
    worldState = pruneFactionStates(worldState, rosterSnapshot(), { tick: 10 + FACTION_STATE_PRUNE_GRACE_TICKS - 1 });
    expect(worldState.factionStates['a:old_regime']).toBeTruthy();

    // Grace lapsed: the ghost is gone; the live state is untouched.
    worldState = pruneFactionStates(worldState, rosterSnapshot(), { tick: 10 + FACTION_STATE_PRUNE_GRACE_TICKS });
    expect(worldState.factionStates['a:old_regime']).toBeUndefined();
    expect(worldState.factionStates['a:merchant_league']).toBeTruthy();
    expect(worldState.factionStates['a:merchant_league'].missingSinceTick).toBeUndefined();
  });

  test('an active-capture ghost survives the grace window; its rivals references do not', () => {
    let worldState = {
      factionStates: {
        'a:merchant_league': live({ rivals: ['a:old_regime', 'a:captured_arm'] }),
        'a:old_regime': ghost(),
        'a:captured_arm': ghost({ factionId: 'a:captured_arm', name: 'Captured Arm', captureState: 'corrupted' }),
      },
    };

    worldState = pruneFactionStates(worldState, rosterSnapshot(), { tick: 20 });
    worldState = pruneFactionStates(worldState, rosterSnapshot(), { tick: 20 + FACTION_STATE_PRUNE_GRACE_TICKS });

    // The plain ghost pruned; the capture arc above the 'none' floor survives.
    expect(worldState.factionStates['a:old_regime']).toBeUndefined();
    expect(worldState.factionStates['a:captured_arm']).toBeTruthy();
    expect(worldState.factionStates['a:captured_arm'].captureState).toBe('corrupted');
    // Surviving states no longer point at the pruned ghost.
    expect(worldState.factionStates['a:merchant_league'].rivals).toEqual(['a:captured_arm']);
  });

  test('a ghost whose settlement left the campaign prunes even mid-capture (no inherited arcs)', () => {
    let worldState = {
      factionStates: {
        'z:dead_guild': ghost({ factionId: 'z:dead_guild', settlementId: 'z', name: 'Dead Guild', captureState: 'capture' }),
      },
    };
    worldState = pruneFactionStates(worldState, rosterSnapshot(['a']), { tick: 30 });
    worldState = pruneFactionStates(worldState, rosterSnapshot(['a']), { tick: 30 + FACTION_STATE_PRUNE_GRACE_TICKS });
    expect(worldState.factionStates['z:dead_guild']).toBeUndefined();
  });

  test('identity no-op when every state is on the roster', () => {
    const worldState = { factionStates: { 'a:merchant_league': live() } };
    expect(pruneFactionStates(worldState, rosterSnapshot(), { tick: 40 })).toBe(worldState);
  });

  test('a returning faction clears its absence stamp', () => {
    let worldState = { factionStates: { 'a:merchant_league': live({ missingSinceTick: 9 }) } };
    worldState = pruneFactionStates(worldState, rosterSnapshot(), { tick: 10 });
    expect(worldState.factionStates['a:merchant_league'].missingSinceTick).toBeUndefined();
  });
});

// R4 pin (audit "write-only posture fields"): the posture family is stamped
// ONCE per pulse (inside applyWorldPulseOutcomes) — removing the two duplicate
// refreshes must not stop the stamp from landing.
describe('relationship memory stamp — single refresh per pulse', () => {
  test('a pulse stamps posture/memoryScore/relationshipMemory at the current tick', () => {
    const campaign = {
      id: 'stamp-pin',
      name: 'Stamp',
      settlementIds: ['a', 'b'],
      worldState: { rngSeed: 'stamp-seed', tick: 2 },
      regionalGraph: ensureRegionalGraph({
        edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }],
      }),
      wizardNews: { currentTick: 2, entries: [] },
    };
    const saves = [
      { id: 'a', name: 'Ashford', phase: 'canon', settlement: { name: 'Ashford', tier: 'town', population: 1500, institutions: [], activeConditions: [], npcs: [] }, campaignState: { phase: 'canon', eventLog: [], locks: {} } },
      { id: 'b', name: 'Briar', phase: 'canon', settlement: { name: 'Briar', tier: 'town', population: 1200, institutions: [], activeConditions: [], npcs: [] }, campaignState: { phase: 'canon', eventLog: [], locks: {} } },
    ];

    const result = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    const state = result.worldState.relationshipStates['edge.a.b'];
    expect(state).toBeTruthy();
    expect(state.posture).toBeTruthy();
    expect(state.relationshipMemory).toBeTruthy();
    expect(state.relationshipMemory.updatedAtTick).toBe(result.tick);
  });
});
