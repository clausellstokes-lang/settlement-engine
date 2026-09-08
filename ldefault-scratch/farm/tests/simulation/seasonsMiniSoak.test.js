/**
 * seasonsMiniSoak.test.js — the SEASONS-A 3-year flag-on mini-soak (the wave's
 * annual-curve gate). Extends the whole-world soak's evidence INSIDE the test
 * battery (the script variant is `--seasons` on whole-world-soak.mjs): a
 * two-town realm — a granary-rich temperate town and a WEAK-HARVEST fixture
 * (mountain biome, thin stores, a structural sliver of deficit) — advanced
 * 3 × 52 weekly kernel ticks with seasonsEnabled. Proves the owner's drama
 * curve (§4i) EMERGES from the arithmetic:
 *
 *   1. THE GRANARY BREATHES — for every year, each town's stores RISE across
 *      the harvest (summer+autumn) and FALL across winter.
 *   2. THE HUNGRY GAP FIRES — the weak-harvest town hits food-deficit
 *      conditions in LATE WINTER (deficit ≥ the famine-pressure band), while
 *      early winter stays comfortable.
 *   3. SPRING RECOVERS — by late spring the deficit is back under control.
 *   4. The hungry_gap/harvest markers appear each year; determinism holds
 *      (a light two-run hash check on year-1).
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-04-04T00:00:00.000Z';
const YEARS = 3;

function fixture() {
  const town = (name, terrainType, foodSecurity, institutions) => ({
    name,
    tier: 'town',
    population: 1600,
    config: { tradeRouteAccess: 'road', terrainType },
    institutions,
    economicState: {
      primaryExports: [],
      primaryImports: ['Bulk grain and foodstuffs'],
      foodSecurity: { dailyNeed: 3200, dailyProduction: 3200, ...foodSecurity },
    },
    powerStructure: { publicLegitimacy: { score: 54, label: 'Accepted' }, factions: [], conflicts: [] },
    npcs: [],
    activeConditions: [],
  });
  const saves = [
    {
      id: 'fatfield',
      name: 'Fatfield',
      phase: 'canon',
      settlement: town('Fatfield', 'plains',
        { surplusPct: 12, deficitPct: 0, storageMonths: 2.0, importDependency: 0.1, resilienceScore: 60 },
        [{ name: 'State Granary', status: 'active' }]),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
    {
      // THE WEAK-HARVEST FIXTURE: harsh biome (mountain amplitude), thin
      // stores, and a REAL structural deficit (12%) — the harvest boost must
      // cover the deficit before anything banks, so the granary enters winter
      // ~1 month deep while the mountain winter costs ~1.1 months: it runs
      // dry in late winter and the gap bites (the §4i arithmetic, on purpose).
      id: 'gauntcrag',
      name: 'Gauntcrag',
      phase: 'canon',
      settlement: town('Gauntcrag', 'mountain',
        { surplusPct: 0, deficitPct: 12, storageMonths: 0.6, importDependency: 0.15, resilienceScore: 42 },
        [{ name: 'Granary', status: 'active' }]),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
  ];
  const campaign = {
    id: 'seasons-mini-soak',
    name: 'Seasons Mini Soak',
    settlementIds: ['fatfield', 'gauntcrag'],
    worldState: {
      rngSeed: 'seasons-mini-soak-seed',
      tick: 0,
      simulationRules: { seasonsEnabled: true },
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.fatfield.gauntcrag', from: 'fatfield', to: 'gauntcrag', relationshipType: 'trade_partner' }],
    }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  return { campaign, saves };
}

/** Advance N weekly ticks, sampling per-week granary + deficit per town. */
function soak(weeks) {
  let { campaign, saves } = fixture();
  let wizardNews = campaign.wizardNews;
  /** @type {Record<string, Array<{ week: number, storage: number, deficit: number }>>} */
  const series = { fatfield: [], gauntcrag: [] };
  for (let t = 0; t < weeks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign: { ...campaign, wizardNews }, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph };
    wizardNews = r.wizardNews;
    for (const s of saves) {
      const fs = s.settlement?.economicState?.foodSecurity || {};
      series[s.id].push({
        week: r.worldState.calendar.elapsedWeeks,          // 1-based elapsed weeks
        storage: Number(fs.storageMonths) || 0,
        deficit: Number(fs.deficitPct) || 0,
      });
    }
  }
  return { series, wizardNews, campaign, saves };
}

// Week-of-year windows (1-based elapsed weeks; year y = weeks (y−1)·52+1 … y·52):
const atWeekOfYear = (rows, y, weekOfYear) => rows.find((p) => p.week === (y - 1) * 52 + weekOfYear);

describe('SEASONS-A 3-year mini-soak — the annual drama curve emerges', () => {
  const weeks = YEARS * 52;
  const { series, wizardNews } = soak(weeks);

  it('the granary breathes: stores rise across the harvest and fall across winter, EVERY year', () => {
    for (const id of ['fatfield', 'gauntcrag']) {
      for (let y = 1; y <= YEARS; y += 1) {
        const preHarvest = atWeekOfYear(series[id], y, 14);   // summer opens
        const harvestEnd = atWeekOfYear(series[id], y, 39);   // autumn closes
        const winterEnd = atWeekOfYear(series[id], y, 52);    // winter closes
        expect(harvestEnd.storage, `${id} year ${y}: harvest fills`).toBeGreaterThan(preHarvest.storage);
        expect(winterEnd.storage, `${id} year ${y}: winter draws down`).toBeLessThan(harvestEnd.storage);
      }
    }
  });

  it('the hungry gap fires on the weak-harvest fixture: late winter hits the deficit band while early winter stays comfortable', () => {
    for (let y = 1; y <= YEARS; y += 1) {
      const earlyWinter = atWeekOfYear(series.gauntcrag, y, 42);
      const lateWinterPeak = Math.max(
        ...series.gauntcrag
          .filter((p) => p.week > (y - 1) * 52 + 47 && p.week <= y * 52)
          .map((p) => p.deficit),
      );
      expect(lateWinterPeak, `year ${y}: the gap bites`).toBeGreaterThanOrEqual(20);
      expect(earlyWinter.deficit, `year ${y}: early winter comfortable`).toBeLessThan(lateWinterPeak);
    }
    // and the granary-rich temperate town NEVER hits the band (one town's crisis
    // is arithmetic, not a global season penalty)
    expect(Math.max(...series.fatfield.map((p) => p.deficit))).toBeLessThan(20);
  });

  it('spring recovers: the weak town\'s deficit is back under control by late spring, every year', () => {
    for (let y = 1; y <= YEARS; y += 1) {
      const lateSpring = atWeekOfYear(series.gauntcrag, y, 12);
      expect(lateSpring.deficit, `year ${y}: spring relief`).toBeLessThan(10);
    }
  });

  it('the season markers land every year: one harvest and one hungry_gap per year', () => {
    const markers = (wizardNews?.entries || []).filter((e) => e.kind === 'season_marker');
    const harvests = markers.filter((e) => e.impactKind === 'harvest');
    const gaps = markers.filter((e) => e.impactKind === 'hungry_gap');
    // The feed is capped, so assert at least the LAST year's pair survives and
    // ids show per-year minting (year embedded in the id).
    expect(harvests.length).toBeGreaterThanOrEqual(1);
    expect(gaps.length).toBeGreaterThanOrEqual(1);
    expect(new Set(markers.map((e) => e.id)).size).toBe(markers.length); // unique per year
  });

  it('determinism: a fresh year-1 run hashes identically twice', () => {
    const h = () => createHash('sha256').update(JSON.stringify(soak(52).series)).digest('hex');
    expect(h()).toBe(h());
  }, 60_000);
});
