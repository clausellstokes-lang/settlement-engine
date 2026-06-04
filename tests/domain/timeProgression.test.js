/**
 * tests/domain/timeProgression.test.js - Tier 4.12 composing-tier contract.
 *
 * Pins advanceTime / forecastTime / summarizeForecast behavior:
 *   - Pure: no mutation of input settlement, event, or previousTickState.
 *   - Interval scaling: per-week is ¼ as intense as per-month for the
 *     same condition; per-year compounds further but sub-linearly.
 *   - Power clamping: factions never go below 0 or above 100.
 *   - Legitimacy re-banding: governing faction's publicLegitimacy
 *     re-bands (label, flags, multipliers) when the score crosses a
 *     band boundary.
 *   - Clock threading: previous-state clockStages → next-state
 *     clockStages, advancing one stage per tick per active clock.
 *   - Clock resolution: clocks that drop off (no longer triggered)
 *     appear in resolutions.
 *   - forecastTime: multi-tick projection, max 24 ticks, accumulated
 *     report; never mutates input.
 *   - Composition: against a real city-tier settlement, advancing
 *     under ['plague'] produces measurable faction-power changes AND a
 *     non-empty tick.summary.
 */

import { describe, it, expect } from 'vitest';
import {
  advanceTime,
  forecastTime,
  summarizeForecast,
  supportedIntervals,
} from '../../src/domain/timeProgression.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// ── Sample settlements ─────────────────────────────────────────────────

function multiFactionSettlement(over = {}) {
  return {
    name: 'Greycairn',
    powerStructure: {
      governingName: 'Town Council',
      publicLegitimacy: {
        score: 60,
        label: 'Approved',
        color: '#4a7a2a',
        govMultiplier: 1.15,
        crimMultiplier: 0.90,
        isApproved: true,
        isTolerated: false,
        isContested: false,
        isEndorsed: false,
        isLegitimacyCrisis: false,
        governanceFractured: false,
      },
      factions: [
        { faction: 'Town Council',           power: 35, desc: '' },
        { faction: 'Merchant Guilds',        power: 30, desc: '' },
        { faction: 'Religious Authorities',  power: 25, desc: '' },
        { faction: "Thieves' Guild",         power: 18, desc: '' },
        { faction: 'Military/Guard',         power: 28, desc: '' },
      ],
    },
    ...over,
  };
}

// ── Single-tick contract ───────────────────────────────────────────────

describe('advanceTime() - basic contract', () => {
  it('returns the canonical { newSettlement, tick, nextTickState } shape', () => {
    const result = advanceTime(multiFactionSettlement(), {
      interval: 'one_month',
      activeConditions: ['plague'],
    });
    expect(result).toHaveProperty('newSettlement');
    expect(result).toHaveProperty('tick');
    expect(result).toHaveProperty('nextTickState');
    expect(result.tick).toHaveProperty('interval');
    expect(result.tick).toHaveProperty('appliedConditions');
    expect(result.tick).toHaveProperty('factionDeltas');
    expect(result.tick).toHaveProperty('clockAdvancements');
    expect(result.tick).toHaveProperty('clockResolutions');
    expect(result.tick).toHaveProperty('summary');
  });

  it('defaults to one_month interval when none specified', () => {
    const result = advanceTime(multiFactionSettlement(), {
      activeConditions: ['plague'],
    });
    expect(result.tick.interval).toBe('one_month');
  });

  it('coerces unknown interval values to one_month', () => {
    const result = advanceTime(multiFactionSettlement(), {
      interval: 'one_decade',
      activeConditions: ['plague'],
    });
    expect(result.tick.interval).toBe('one_month');
  });

  it('returns empty deltas when no active conditions are given', () => {
    const result = advanceTime(multiFactionSettlement(), {
      interval: 'one_month',
      activeConditions: [],
    });
    expect(result.tick.factionDeltas).toEqual([]);
    expect(result.tick.summary[0]).toMatch(/no active conditions/);
  });

  it('returns input settlement when nullish settlement is passed', () => {
    const result = advanceTime(null, { activeConditions: ['plague'] });
    expect(result.newSettlement).toBeNull();
    expect(result.tick.factionDeltas).toEqual([]);
  });
});

// ── Pure / no-mutation contract ────────────────────────────────────────

describe('advanceTime() does not mutate input', () => {
  it('does not modify the settlement', () => {
    const s = multiFactionSettlement();
    const before = JSON.stringify(s);
    advanceTime(s, { activeConditions: ['plague'], interval: 'one_month' });
    expect(JSON.stringify(s)).toBe(before);
  });

  it('does not modify previousTickState', () => {
    const previousTickState = { clockStages: { 'clock.bread_riot.test': 2 } };
    const before = JSON.stringify(previousTickState);
    advanceTime(multiFactionSettlement(), {
      activeConditions: ['plague'],
      previousTickState,
    });
    expect(JSON.stringify(previousTickState)).toBe(before);
  });

  it('returned newSettlement is a different object reference for mutated branches', () => {
    const s = multiFactionSettlement();
    const result = advanceTime(s, { activeConditions: ['plague'] });
    // The powerStructure must be a fresh object (cloned), since faction
    // power values changed.
    expect(result.newSettlement).not.toBe(s);
    expect(result.newSettlement.powerStructure).not.toBe(s.powerStructure);
    expect(result.newSettlement.powerStructure.factions).not.toBe(s.powerStructure.factions);
  });
});

// ── Faction-delta application ──────────────────────────────────────────

describe('advanceTime() - applies faction deltas to settlement', () => {
  it('plague: criminal faction power increases', () => {
    const s = multiFactionSettlement();
    const before = s.powerStructure.factions.find(f => f.faction === "Thieves' Guild").power;
    const result = advanceTime(s, {
      activeConditions: ['plague'],
      interval: 'one_month',
    });
    const after = result.newSettlement.powerStructure.factions
      .find(f => f.faction === "Thieves' Guild").power;
    expect(after).toBeGreaterThan(before);
  });

  it('clamps power below 100 even under aggressive scaling', () => {
    const s = multiFactionSettlement({
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 60, label: 'Approved' },
        factions: [
          { faction: 'Town Council',     power: 99, desc: '' },
          { faction: 'Merchant Guilds',  power: 30, desc: '' },
          { faction: "Thieves' Guild",   power: 98, desc: '' },
        ],
      },
    });
    const result = advanceTime(s, {
      activeConditions: ['plague'],
      interval: 'one_year',
    });
    for (const f of result.newSettlement.powerStructure.factions) {
      expect(f.power).toBeGreaterThanOrEqual(0);
      expect(f.power).toBeLessThanOrEqual(100);
    }
  });

  it('clamps power above 0 even under aggressive scaling', () => {
    const s = multiFactionSettlement({
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 60, label: 'Approved' },
        factions: [
          { faction: 'Town Council',         power: 2, desc: '' },
          { faction: 'Merchant Guilds',      power: 1, desc: '' },
          { faction: "Thieves' Guild",       power: 80, desc: '' },
        ],
      },
    });
    // Multi-tick trade-route-cut for years should crater merchant power.
    const result = advanceTime(s, {
      activeConditions: ['trade_route_cut'],
      interval: 'one_year',
    });
    for (const f of result.newSettlement.powerStructure.factions) {
      expect(f.power).toBeGreaterThanOrEqual(0);
    }
  });

  it('stores wealth/publicTrust/manpower deltas on faction._timePressure', () => {
    const s = multiFactionSettlement();
    const result = advanceTime(s, {
      activeConditions: ['plague'],
      interval: 'one_month',
    });
    const merchant = result.newSettlement.powerStructure.factions
      .find(f => f.faction === 'Merchant Guilds');
    // Plague gives merchant a +wealth delta and -publicTrust delta.
    expect(merchant._timePressure).toBeDefined();
    expect(typeof merchant._timePressure.wealth).toBe('number');
    expect(typeof merchant._timePressure.publicTrust).toBe('number');
  });
});

// ── Interval scaling ───────────────────────────────────────────────────

describe('advanceTime() - interval scaling', () => {
  it('per-week is less intense than per-month for the same condition', () => {
    const baseline = multiFactionSettlement();
    const weekly = advanceTime(baseline, {
      activeConditions: ['plague'],
      interval: 'one_week',
    });
    const monthly = advanceTime(baseline, {
      activeConditions: ['plague'],
      interval: 'one_month',
    });
    // Criminal power gains are the headline plague signal; weekly < monthly.
    const wThief = weekly.newSettlement.powerStructure.factions
      .find(f => f.faction === "Thieves' Guild").power;
    const mThief = monthly.newSettlement.powerStructure.factions
      .find(f => f.faction === "Thieves' Guild").power;
    expect(mThief - 18).toBeGreaterThan(wThief - 18);
  });

  it('per-year compounds further than per-month', () => {
    const baseline = multiFactionSettlement();
    const monthly = advanceTime(baseline, {
      activeConditions: ['plague'],
      interval: 'one_month',
    });
    const yearly = advanceTime(baseline, {
      activeConditions: ['plague'],
      interval: 'one_year',
    });
    const mThief = monthly.newSettlement.powerStructure.factions
      .find(f => f.faction === "Thieves' Guild").power;
    const yThief = yearly.newSettlement.powerStructure.factions
      .find(f => f.faction === "Thieves' Guild").power;
    expect(yThief).toBeGreaterThan(mThief);
  });

  it('records the scaled magnitude in factionDeltas[].delta', () => {
    const monthlyResult = advanceTime(multiFactionSettlement(), {
      activeConditions: ['plague'],
      interval: 'one_month',
    });
    const weeklyResult = advanceTime(multiFactionSettlement(), {
      activeConditions: ['plague'],
      interval: 'one_week',
    });
    const mThief = monthlyResult.tick.factionDeltas
      .find(d => d.archetype === 'criminal' && d.field === 'power');
    const wThief = weeklyResult.tick.factionDeltas
      .find(d => d.archetype === 'criminal' && d.field === 'power');
    expect(Math.abs(mThief.delta)).toBeGreaterThan(Math.abs(wThief.delta));
  });
});

// ── Legitimacy re-banding ──────────────────────────────────────────────

describe('advanceTime() - governing legitimacy re-bands', () => {
  it('plague drops Town Council legitimacy and updates the band label/flags', () => {
    // Start in 'Tolerated' band (45-59). Plague hits governing for -5
    // per month; over a year (6.0x scale) the hit is -30, plunging the
    // governing faction into 'Contested' / 'Legitimacy Crisis'.
    const s = multiFactionSettlement({
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: {
          score: 50,
          label: 'Tolerated',
          color: '#a0762a',
          govMultiplier: 1.00,
          crimMultiplier: 1.00,
          isTolerated: true,
          isApproved: false,
          isContested: false,
          isEndorsed: false,
          isLegitimacyCrisis: false,
          governanceFractured: false,
        },
        factions: [
          { faction: 'Town Council',           power: 35, desc: '' },
          { faction: 'Merchant Guilds',        power: 30, desc: '' },
          { faction: 'Religious Authorities',  power: 25, desc: '' },
          { faction: "Thieves' Guild",         power: 18, desc: '' },
          { faction: 'Military/Guard',         power: 28, desc: '' },
        ],
      },
    });
    const result = advanceTime(s, {
      activeConditions: ['plague'],
      interval: 'one_year',
    });
    const updated = result.newSettlement.powerStructure.publicLegitimacy;
    expect(updated.score).toBeLessThan(50);
    // Score after -30 = 20 → Legitimacy Crisis (< 30).
    expect(updated.label).toBe('Legitimacy Crisis');
    expect(updated.isLegitimacyCrisis).toBe(true);
    expect(updated.governanceFractured).toBe(true);
    expect(updated.isTolerated).toBe(false);
    expect(updated.govMultiplier).toBe(0.60);
  });

  it('keeps legitimacy score within 0-100 even with large drops', () => {
    const s = multiFactionSettlement({
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 3, label: 'Legitimacy Crisis', isLegitimacyCrisis: true },
        factions: [
          { faction: 'Town Council',         power: 35, desc: '' },
          { faction: 'Religious Authorities', power: 25, desc: '' },
          { faction: 'Merchant Guilds',      power: 30, desc: '' },
        ],
      },
    });
    const result = advanceTime(s, {
      activeConditions: ['plague', 'corruption_exposed'],
      interval: 'one_year',
    });
    const score = result.newSettlement.powerStructure.publicLegitimacy.score;
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('siege_lifted lifts governing legitimacy and re-bands upward', () => {
    const s = multiFactionSettlement({
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 50, label: 'Tolerated', isTolerated: true },
        factions: [
          { faction: 'Town Council', power: 35, desc: '' },
          { faction: 'Military/Guard', power: 28, desc: '' },
          { faction: 'Religious Authorities', power: 25, desc: '' },
          { faction: 'Merchant Guilds', power: 30, desc: '' },
        ],
      },
    });
    const result = advanceTime(s, {
      activeConditions: ['siege_lifted'],
      interval: 'one_month',
    });
    const updated = result.newSettlement.powerStructure.publicLegitimacy;
    // +5 on government's legitimacy → score 55 → still Tolerated, but
    // higher. The reband must still produce a valid band envelope.
    expect(updated.score).toBeGreaterThan(50);
    expect(['Tolerated', 'Approved'].includes(updated.label)).toBe(true);
    expect(typeof updated.govMultiplier).toBe('number');
  });
});

// ── Clock advancement ──────────────────────────────────────────────────

describe('advanceTime() - clock advancement', () => {
  function settlementWithFoodChainDisruption() {
    return {
      name: 'Disrupted',
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 60, label: 'Approved', isApproved: true },
        factions: [
          { faction: 'Town Council',         power: 35, desc: '' },
          { faction: 'Religious Authorities', power: 25, desc: '' },
          { faction: 'Merchant Guilds',      power: 30, desc: '' },
        ],
      },
      economicState: {
        activeChains: [{
          needKey: 'food_security',
          needLabel: 'Food security',
          chainId: 'grain_to_bread',
          label: 'Grain to bread',
          processingInstitutions: ['Town Granary'],
          status: 'impaired',
          resource: 'wheat',
          outputs: ['bread'],
        }],
      },
    };
  }

  it('threads clock state across consecutive ticks', () => {
    const s = settlementWithFoodChainDisruption();
    const tick1 = advanceTime(s, {
      activeConditions: ['food_anchor_lost'],
      interval: 'one_month',
    });
    expect(tick1.tick.clockAdvancements.length).toBeGreaterThan(0);
    const bread = tick1.tick.clockAdvancements.find(c => c.label === 'Bread Riot Clock');
    expect(bread).toBeTruthy();
    expect(bread.stage).toBe(1);

    const tick2 = advanceTime(tick1.newSettlement, {
      activeConditions: ['food_anchor_lost'],
      interval: 'one_month',
      previousTickState: tick1.nextTickState,
    });
    const breadAfter = tick2.tick.clockAdvancements.find(c => c.label === 'Bread Riot Clock');
    expect(breadAfter).toBeTruthy();
    expect(breadAfter.stage).toBe(2);
    expect(breadAfter.previousStage).toBe(1);
  });

  it('completes a clock at its final stage with completed=true', () => {
    let current = settlementWithFoodChainDisruption();
    let state = null;
    let lastBread = null;
    // 6 ticks reaches stage 6 (the bread riot clock has 6 stages).
    for (let i = 0; i < 6; i++) {
      const result = advanceTime(current, {
        activeConditions: ['food_anchor_lost'],
        interval: 'one_month',
        previousTickState: state,
      });
      current = result.newSettlement;
      state = result.nextTickState;
      lastBread = result.tick.clockAdvancements.find(c => c.label === 'Bread Riot Clock');
    }
    expect(lastBread).toBeTruthy();
    expect(lastBread.stage).toBe(6);
    expect(lastBread.completed).toBe(true);
  });

  it('holds at final stage past completion (does not advance past 6)', () => {
    let current = settlementWithFoodChainDisruption();
    let state = null;
    let lastBread = null;
    for (let i = 0; i < 10; i++) {
      const result = advanceTime(current, {
        activeConditions: ['food_anchor_lost'],
        interval: 'one_month',
        previousTickState: state,
      });
      current = result.newSettlement;
      state = result.nextTickState;
      lastBread = result.tick.clockAdvancements.find(c => c.label === 'Bread Riot Clock');
    }
    expect(lastBread.stage).toBe(6);
    expect(lastBread.completed).toBe(true);
  });

  it('emits a resolution when a previously-active clock falls off', () => {
    const s = settlementWithFoodChainDisruption();
    // Tick 1: bread riot clock advances.
    const tick1 = advanceTime(s, {
      activeConditions: ['food_anchor_lost'],
      interval: 'one_month',
    });
    expect(tick1.nextTickState.clockStages).toBeDefined();
    const firstKey = Object.keys(tick1.nextTickState.clockStages)[0];
    expect(firstKey).toMatch(/^clock\.bread_riot/);

    // Tick 2: pass a settlement WITHOUT the food disruption (chain
    // recovered to stable). The clock should resolve.
    const recovered = {
      ...s,
      economicState: {
        activeChains: [{
          ...s.economicState.activeChains[0],
          status: 'operational',
        }],
      },
    };
    const tick2 = advanceTime(recovered, {
      activeConditions: [],
      interval: 'one_month',
      previousTickState: tick1.nextTickState,
    });
    expect(tick2.tick.clockResolutions.length).toBeGreaterThan(0);
    const resolution = tick2.tick.clockResolutions.find(r => r.clockId === firstKey);
    expect(resolution).toBeTruthy();
    expect(resolution.resolved).toBe(true);
    expect(resolution.previousStage).toBe(1);
  });
});

// ── Summary lines ──────────────────────────────────────────────────────

describe('advanceTime() - narrative summary', () => {
  it('always produces a non-empty summary', () => {
    const result = advanceTime(multiFactionSettlement(), {
      activeConditions: ['plague'],
      interval: 'one_month',
    });
    expect(Array.isArray(result.tick.summary)).toBe(true);
    expect(result.tick.summary.length).toBeGreaterThan(0);
  });

  it('summary lists active conditions when present', () => {
    const result = advanceTime(multiFactionSettlement(), {
      activeConditions: ['plague', 'trade_route_cut'],
      interval: 'one_month',
    });
    expect(result.tick.summary[0]).toMatch(/plague/);
    expect(result.tick.summary[0]).toMatch(/trade_route_cut/);
  });

  it('summary calls out clock completions explicitly', () => {
    let current = {
      name: 'TestCity',
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 60, label: 'Approved' },
        factions: [
          { faction: 'Town Council', power: 35, desc: '' },
          { faction: 'Religious Authorities', power: 25, desc: '' },
          { faction: 'Merchant Guilds', power: 30, desc: '' },
        ],
      },
      economicState: {
        activeChains: [{
          needKey: 'food_security',
          chainId: 'grain_to_bread',
          label: 'Grain to bread',
          status: 'impaired',
        }],
      },
    };
    let state = null;
    let lastSummary = [];
    for (let i = 0; i < 6; i++) {
      const result = advanceTime(current, {
        activeConditions: ['food_anchor_lost'],
        interval: 'one_month',
        previousTickState: state,
      });
      current = result.newSettlement;
      state = result.nextTickState;
      lastSummary = result.tick.summary;
    }
    const finalStageLine = lastSummary.find(line => line.includes('final stage'));
    expect(finalStageLine).toBeTruthy();
  });
});

// ── forecastTime ───────────────────────────────────────────────────────

describe('forecastTime() - multi-tick projection', () => {
  it('returns { projectedSettlement, ticks[], finalState } with N ticks', () => {
    const result = forecastTime(multiFactionSettlement(), {
      ticks: 3,
      activeConditions: ['plague'],
      interval: 'one_month',
    });
    expect(result).toHaveProperty('projectedSettlement');
    expect(result).toHaveProperty('ticks');
    expect(result).toHaveProperty('finalState');
    expect(result.ticks).toHaveLength(3);
  });

  it('clamps ticks to a maximum of 24', () => {
    const result = forecastTime(multiFactionSettlement(), {
      ticks: 100,
      activeConditions: ['plague'],
    });
    expect(result.ticks).toHaveLength(24);
  });

  it('clamps ticks to a minimum of 1', () => {
    const result = forecastTime(multiFactionSettlement(), {
      ticks: 0,
      activeConditions: ['plague'],
    });
    expect(result.ticks).toHaveLength(1);
  });

  it('rounds non-integer tick counts', () => {
    const result = forecastTime(multiFactionSettlement(), {
      ticks: 2.7,
      activeConditions: ['plague'],
    });
    expect(result.ticks).toHaveLength(3);
  });

  it('does not mutate the input settlement', () => {
    const s = multiFactionSettlement();
    const before = JSON.stringify(s);
    forecastTime(s, { ticks: 5, activeConditions: ['plague'] });
    expect(JSON.stringify(s)).toBe(before);
  });

  it('compounds deltas across ticks', () => {
    const s = multiFactionSettlement();
    const beforeThief = s.powerStructure.factions
      .find(f => f.faction === "Thieves' Guild").power;
    const result = forecastTime(s, {
      ticks: 4,
      activeConditions: ['plague'],
      interval: 'one_month',
    });
    const afterThief = result.projectedSettlement.powerStructure.factions
      .find(f => f.faction === "Thieves' Guild").power;
    // Each tick adds criminal power; after 4 ticks the gain should be
    // bigger than a single tick.
    expect(afterThief - beforeThief).toBeGreaterThan(4);
  });

  it('threads clock state automatically across its own ticks', () => {
    const s = {
      name: 'ClockedCity',
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 60, label: 'Approved' },
        factions: [
          { faction: 'Town Council', power: 35, desc: '' },
          { faction: 'Religious Authorities', power: 25, desc: '' },
          { faction: 'Merchant Guilds', power: 30, desc: '' },
        ],
      },
      economicState: {
        activeChains: [{
          needKey: 'food_security',
          chainId: 'grain_to_bread',
          status: 'impaired',
        }],
      },
    };
    const result = forecastTime(s, {
      ticks: 3,
      activeConditions: ['food_anchor_lost'],
      interval: 'one_month',
    });
    // After 3 ticks, the bread-riot clock should be at stage 3.
    const finalStage = Object.values(result.finalState.clockStages)[0];
    expect(finalStage).toBe(3);
    // Each tick's advancement should track the running stage.
    expect(result.ticks[0].clockAdvancements[0].stage).toBe(1);
    expect(result.ticks[1].clockAdvancements[0].stage).toBe(2);
    expect(result.ticks[2].clockAdvancements[0].stage).toBe(3);
  });
});

// ── summarizeForecast ──────────────────────────────────────────────────

describe('summarizeForecast()', () => {
  it('aggregates per-faction deltas across all ticks', () => {
    const forecast = forecastTime(multiFactionSettlement(), {
      ticks: 3,
      activeConditions: ['plague'],
      interval: 'one_month',
    });
    const summary = summarizeForecast(forecast);
    expect(summary).toHaveProperty('totalDeltas');
    expect(summary).toHaveProperty('summaryLines');
    expect(summary).toHaveProperty('clocksAtFinal');
    // At least one faction should have an accumulated delta.
    expect(Object.keys(summary.totalDeltas).length).toBeGreaterThan(0);
    // summaryLines should include lines from every tick.
    expect(summary.summaryLines.length).toBeGreaterThanOrEqual(3);
  });

  it('returns sane defaults for nullish forecast', () => {
    expect(summarizeForecast(null)).toEqual({
      totalDeltas: {},
      summaryLines: [],
      clocksAtFinal: {},
    });
    expect(summarizeForecast({})).toEqual({
      totalDeltas: {},
      summaryLines: [],
      clocksAtFinal: {},
    });
  });

  it('exposes the final clock stages map', () => {
    const s = {
      name: 'ClockedCity',
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 60, label: 'Approved' },
        factions: [
          { faction: 'Town Council', power: 35, desc: '' },
          { faction: 'Religious Authorities', power: 25, desc: '' },
          { faction: 'Merchant Guilds', power: 30, desc: '' },
        ],
      },
      economicState: {
        activeChains: [{
          needKey: 'food_security',
          chainId: 'grain_to_bread',
          status: 'impaired',
        }],
      },
    };
    const forecast = forecastTime(s, {
      ticks: 2,
      activeConditions: ['food_anchor_lost'],
    });
    const summary = summarizeForecast(forecast);
    expect(Object.values(summary.clocksAtFinal)[0]).toBe(2);
  });
});

// ── supportedIntervals ─────────────────────────────────────────────────

describe('supportedIntervals()', () => {
  it('returns the canonical interval set', () => {
    const intervals = supportedIntervals();
    expect(intervals).toContain('one_week');
    expect(intervals).toContain('one_month');
    expect(intervals).toContain('one_season');
    expect(intervals).toContain('one_year');
  });
});

// ── Integration: real generated settlement ─────────────────────────────

describe('advanceTime() - real generated settlement', () => {
  it('advances a real city under plague without throwing', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'timeProgression-integration-2026-05-19', customContent: {} },
    );
    const result = advanceTime(settlement, {
      activeConditions: ['plague'],
      interval: 'one_month',
    });
    expect(result.newSettlement).toBeTruthy();
    expect(result.tick.factionDeltas.length).toBeGreaterThan(0);
    expect(result.tick.summary.length).toBeGreaterThan(0);
  });

  it('produces measurable faction-power changes against a real city', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'timeProgression-real-city-A', customContent: {} },
    );
    const beforeByName = {};
    for (const f of settlement.powerStructure.factions) {
      beforeByName[f.faction] = f.power;
    }
    const result = advanceTime(settlement, {
      activeConditions: ['plague'],
      interval: 'one_year',
    });
    let changedCount = 0;
    for (const f of result.newSettlement.powerStructure.factions) {
      if (typeof beforeByName[f.faction] === 'number' && f.power !== beforeByName[f.faction]) {
        changedCount += 1;
      }
    }
    expect(changedCount).toBeGreaterThan(0);
  });

  it('does not mutate the real generated settlement', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'timeProgression-real-city-B', customContent: {} },
    );
    const before = JSON.stringify(settlement);
    advanceTime(settlement, {
      activeConditions: ['plague', 'corruption_exposed'],
      interval: 'one_season',
    });
    expect(JSON.stringify(settlement)).toBe(before);
  });

  it('forecastTime: multi-tick projection against a real city compounds', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'timeProgression-forecast-city', customContent: {} },
    );
    const forecast = forecastTime(settlement, {
      ticks: 4,
      activeConditions: ['plague'],
      interval: 'one_month',
    });
    expect(forecast.ticks).toHaveLength(4);
    const summary = summarizeForecast(forecast);
    expect(summary.summaryLines.length).toBeGreaterThanOrEqual(4);
    // After plague-ticks, at least one faction's wealth/publicTrust
    // pressure should be tracked on _timePressure.
    const pressured = forecast.projectedSettlement.powerStructure.factions
      .filter(f => f._timePressure && Object.keys(f._timePressure).length > 0);
    expect(pressured.length).toBeGreaterThan(0);
  });
});

// ── Phase 16: canonical activeConditions integration ───────────────────

describe('advanceTime() - canonical settlement.activeConditions (Phase 16)', () => {
  function settlementWithCanonicalPlague() {
    return {
      name: 'Plagued',
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 60, label: 'Approved', isApproved: true },
        factions: [
          { faction: 'Town Council',         power: 35, desc: '' },
          { faction: 'Religious Authorities', power: 25, desc: '' },
          { faction: 'Merchant Guilds',      power: 30, desc: '' },
          { faction: "Thieves' Guild",       power: 18, desc: '' },
        ],
      },
      activeConditions: [{
        archetype: 'plague',
        severity: 0.6,
        duration: { elapsedTicks: 0, expiresAtTicks: 12 },
      }],
    };
  }

  it('reads archetypes from settlement.activeConditions when no override is passed', () => {
    const s = settlementWithCanonicalPlague();
    const result = advanceTime(s, { interval: 'one_month' });
    expect(result.tick.appliedConditions).toContain('plague');
    // Plague deltas should land (criminal power up).
    const thief = result.newSettlement.powerStructure.factions
      .find(f => f.faction === "Thieves' Guild");
    expect(thief.power).toBeGreaterThan(18);
  });

  it('applies the same effect with no options object at all', () => {
    const s = settlementWithCanonicalPlague();
    const result = advanceTime(s);
    expect(result.tick.appliedConditions).toContain('plague');
  });

  it('options.activeConditions override wins over settlement state', () => {
    const s = settlementWithCanonicalPlague();
    const result = advanceTime(s, {
      activeConditions: ['siege_lifted'],
      interval: 'one_month',
    });
    expect(result.tick.appliedConditions).toEqual(['siege_lifted']);
    // No plague-style criminal gain.
    const thief = result.newSettlement.powerStructure.factions
      .find(f => f.faction === "Thieves' Guild");
    expect(thief.power).toBe(18);
  });

  it('explicit empty override means "no deltas this tick" even with canonical conditions', () => {
    const s = settlementWithCanonicalPlague();
    const result = advanceTime(s, {
      activeConditions: [],
      interval: 'one_month',
    });
    expect(result.tick.appliedConditions).toEqual([]);
    expect(result.tick.factionDeltas).toEqual([]);
  });

  it('ages settlement conditions even under an external override', () => {
    const s = settlementWithCanonicalPlague();
    const result = advanceTime(s, {
      activeConditions: ['siege_lifted'],
      interval: 'one_month',
    });
    // Plague is still on the settlement but it aged this tick.
    expect(result.newSettlement.activeConditions).toHaveLength(1);
    expect(result.newSettlement.activeConditions[0].archetype).toBe('plague');
    expect(result.newSettlement.activeConditions[0].duration.elapsedTicks).toBe(1);
  });

  it('expires conditions whose elapsedTicks crosses the cap', () => {
    const s = {
      ...settlementWithCanonicalPlague(),
      activeConditions: [{
        archetype: 'plague',
        duration: { elapsedTicks: 11, expiresAtTicks: 12 },
      }],
    };
    const result = advanceTime(s, { interval: 'one_month' });
    // After ticking: elapsed = 12, hits cap, expired this tick.
    expect(result.tick.conditionsExpired).toHaveLength(1);
    expect(result.tick.conditionsExpired[0].archetype).toBe('plague');
    expect(result.newSettlement.activeConditions).toHaveLength(0);
    expect(result.tick.summary.some(line => /Condition expired/.test(line))).toBe(true);
  });

  it('tick.activeConditions reports the live set after aging + expiry', () => {
    const s = settlementWithCanonicalPlague();
    const result = advanceTime(s, { interval: 'one_month' });
    expect(result.tick.activeConditions).toHaveLength(1);
    expect(result.tick.activeConditions[0].duration.elapsedTicks).toBe(1);
  });

  it('does not mutate the input settlement', () => {
    const s = settlementWithCanonicalPlague();
    const before = JSON.stringify(s);
    advanceTime(s, { interval: 'one_month' });
    expect(JSON.stringify(s)).toBe(before);
  });
});

describe('forecastTime() - canonical activeConditions threading', () => {
  it('keeps applying canonical conditions until they expire', () => {
    const s = {
      name: 'LongPlague',
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 60, label: 'Approved' },
        factions: [
          { faction: 'Town Council', power: 35, desc: '' },
          { faction: 'Religious Authorities', power: 25, desc: '' },
          { faction: 'Merchant Guilds', power: 30, desc: '' },
          { faction: "Thieves' Guild", power: 18, desc: '' },
        ],
      },
      activeConditions: [{
        archetype: 'plague',
        duration: { elapsedTicks: 0, expiresAtTicks: 4 },
      }],
    };
    const forecast = forecastTime(s, { ticks: 6, interval: 'one_month' });
    // First 4 ticks apply plague (or up to but not including expiry).
    const tickArchetypes = forecast.ticks.map(t => t.appliedConditions);
    expect(tickArchetypes[0]).toContain('plague');
    // After ~4 ticks the condition expires; later ticks should report
    // no active conditions (the appliedConditions list is empty).
    const expiredTickIndex = forecast.ticks.findIndex(t => t.conditionsExpired.length > 0);
    expect(expiredTickIndex).toBeGreaterThanOrEqual(0);
    // The tick AFTER expiry should have no canonical conditions left.
    const afterExpiry = forecast.ticks[expiredTickIndex + 1];
    if (afterExpiry) {
      expect(afterExpiry.appliedConditions).toEqual([]);
    }
    // The projected settlement should no longer carry the plague.
    expect(forecast.projectedSettlement.activeConditions).toHaveLength(0);
  });
});
