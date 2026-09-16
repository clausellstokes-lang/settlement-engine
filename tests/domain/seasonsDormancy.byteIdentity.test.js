/**
 * seasonsDormancy.byteIdentity.test.js — THE SEASONS-A CONSTITUTIONAL PIN.
 *
 * seasonsEnabled DEFAULT OFF ⇒ byte-identical: the off path adds no fields,
 * forks no rng, reads nothing seasonal. Proven at the KERNEL level:
 *
 *   (a) a multi-tick pulse run with the flag ABSENT and with the flag
 *       EXPLICITLY false produce RAW-byte-identical composed output
 *       (worldState + settlements + news), and the settlements carry NO
 *       seasonal field anywhere;
 *   (b) anti-vacuity: the SAME fixture with the flag ON diverges (the food
 *       year actually does something) and stamps the seasonal record;
 *   (c) the flag-on run never leaks a seasonal key back onto the flag-off
 *       path (fresh fixtures per run — no shared mutable state).
 *
 * The cross-build flag-off bytes are pinned by the two committed goldens
 * (generator + worldpulse deity); this file pins absent === false and the
 * no-new-fields law directly.
 */
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-02-02T00:00:00.000Z';

function makeFixture(rulesPatch = {}) {
  const settlement = (name, terrainType, foodSecurity) => ({
    name,
    tier: 'town',
    population: 1400,
    config: { tradeRouteAccess: 'road', terrainType },
    institutions: [{ name: 'Granary', status: 'active' }],
    economicState: {
      primaryExports: [],
      primaryImports: ['Bulk grain and foodstuffs'],
      foodSecurity: { dailyNeed: 2800, dailyProduction: 2800, ...foodSecurity },
    },
    powerStructure: { publicLegitimacy: { score: 55, label: 'Accepted' }, factions: [], conflicts: [] },
    npcs: [],
    activeConditions: [],
  });
  const saves = [
    {
      id: 'a',
      name: 'Ashford',
      phase: 'canon',
      settlement: settlement('Ashford', 'plains', { surplusPct: 10, deficitPct: 0, storageMonths: 1.5, importDependency: 0.1, resilienceScore: 60 }),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
    {
      id: 'b',
      name: 'Bleakstone',
      phase: 'canon',
      settlement: settlement('Bleakstone', 'mountain', { surplusPct: 0, deficitPct: 0, storageMonths: 0.4, importDependency: 0.2, resilienceScore: 45 }),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
  ];
  const campaign = {
    id: 'seasons-dormancy',
    name: 'Seasons Dormancy',
    settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: 'seasons-dormancy-seed',
      tick: 0,
      // Start at week 38 so the run crosses the autumn→winter boundary window
      // (the seasonal machinery would be busiest here if it leaked).
      calendar: { elapsedWeeks: 38, elapsedMonths: (38 * 3) / 13, month: 9, year: 1, season: 'autumn' },
      simulationRules: rulesPatch,
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }],
    }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  return { campaign, saves };
}

/** Run N weekly ticks, threading state, and return the composed final state.
 *  12 ticks from week 38 cross BOTH the winter boundary (week 40) and the
 *  hungry-gap window (week 48) and end mid-winter (week 50). */
function run(rulesPatch, ticks = 12) {
  let { campaign, saves } = makeFixture(rulesPatch);
  let wizardNews = campaign.wizardNews;
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign: { ...campaign, wizardNews }, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph };
    wizardNews = r.wizardNews;
  }
  return { worldState: campaign.worldState, settlements: saves.map((s) => s.settlement), wizardNews };
}

/** Collect every key path that smells seasonal. */
function seasonalKeyPaths(value, path = '$', out = []) {
  if (!value || typeof value !== 'object') return out;
  if (Array.isArray(value)) {
    value.forEach((v, i) => seasonalKeyPaths(v, `${path}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(value)) {
    if (/^(seasonWeek|seasonalSwingPct|seasonalEvent)$/.test(k)) out.push(`${path}.${k}`);
    // `season` appears legitimately on worldState.calendar (legacy law); only
    // flag it inside a foodSecurity stockpile record.
    if (k === 'season' && /stockpile/.test(path)) out.push(`${path}.${k}`);
    seasonalKeyPaths(v, `${path}.${k}`, out);
  }
  return out;
}

describe('SEASONS-A dormancy — default off is byte-identical', () => {
  it('flag ABSENT === flag FALSE, raw bytes, over 12 weekly ticks crossing a season boundary', () => {
    const absent = run({});
    const explicitFalse = run({ seasonsEnabled: false });
    expect(JSON.stringify(absent)).toBe(JSON.stringify(explicitFalse));
  });

  it('the off path writes NO seasonal field anywhere (no fields, the constitutional law)', () => {
    const absent = run({});
    expect(seasonalKeyPaths(absent)).toEqual([]);
    // and no season_marker entry ever reaches the feed
    expect((absent.wizardNews?.entries || []).filter((e) => e.kind === 'season_marker')).toEqual([]);
  });

  it('anti-vacuity: the flag ON diverges and stamps the seasonal record + boundary marker', () => {
    const off = run({});
    const on = run({ seasonsEnabled: true });
    expect(JSON.stringify(on)).not.toBe(JSON.stringify(off));
    // the seasonal bookkeeping exists on-path…
    expect(seasonalKeyPaths(on).length).toBeGreaterThan(0);
    // …the window (weeks 39→52) crossed month 12 (week 47): the hungry-gap marker fired
    const markers = (on.wizardNews?.entries || []).filter((e) => e.kind === 'season_marker');
    expect(markers.map((e) => e.impactKind)).toContain('hungry_gap');
    // …and Bleakstone (mountain, 0.4 months of stores) reads as winter in drawdown
    const bleak = on.settlements.find((s) => s.name === 'Bleakstone');
    expect(bleak.economicState.foodSecurity.stockpile.season).toBe('winter');
  });

  it('two flag-on runs are deterministic (same seed ⇒ same bytes)', () => {
    expect(JSON.stringify(run({ seasonsEnabled: true }))).toBe(JSON.stringify(run({ seasonsEnabled: true })));
  });
});
