/**
 * worldpulseSeasonsGolden.test.js — the SEASONS-A flag-ON golden
 * (tests/fixtures/worldpulse-seasons-golden.json).
 *
 * The two committed goldens pin the FLAG-OFF world (generation + the deity
 * pulse); neither pins the FOOD YEAR in motion. This is that pin: a
 * seasons-enabled campaign (mixed biomes, a granary-rich town, a thin-stored
 * mountain village) driven through real weekly pulse ticks across season
 * boundaries, projected to a MECHANICAL seasonal summary (per-settlement
 * granary trajectory + seasonal record, the season-marker news kinds, and a
 * candidate histogram — never prose), oracle-normalized and hashed. A tuning
 * nudge in SEASONS_TUNING, a swing-shape change, a variance re-band, or an
 * rng seed-derivation change trips this without false-positiving on copy.
 *
 * Inputs fully deterministic (fixed rngSeed + fixed `now`). Two-run
 * determinism is asserted in-suite (the wave's gate).
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/worldpulseSeasonsGolden.test.js
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../domain/religionDormancy.byteIdentity.test.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'worldpulse-seasons-golden.json');
const NOW = '2026-03-03T00:00:00.000Z';

function seasonsSettlement(name, terrainType, foodSecurity, institutions) {
  return {
    name,
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road', terrainType, priorityEconomy: 30 },
    institutions,
    economicState: {
      primaryExports: [],
      primaryImports: ['Bulk grain and foodstuffs'],
      foodSecurity: { dailyNeed: 3600, dailyProduction: 3600, ...foodSecurity },
    },
    powerStructure: { publicLegitimacy: { score: 52, label: 'Accepted' }, factions: [], conflicts: [] },
    npcs: [],
    activeConditions: [],
  };
}

function makeCampaignAndSaves(seed, startWeek) {
  const saves = [
    {
      id: 'grainhall',
      name: 'Grainhall',
      phase: 'canon',
      settlement: seasonsSettlement('Grainhall', 'plains',
        { surplusPct: 14, deficitPct: 0, storageMonths: 2.5, importDependency: 0.1, resilienceScore: 62 },
        [{ name: 'State Granary', status: 'active' }, { name: 'Mill', status: 'active' }]),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
    {
      id: 'bleakstone',
      name: 'Bleakstone',
      phase: 'canon',
      settlement: seasonsSettlement('Bleakstone', 'mountain',
        { surplusPct: 0, deficitPct: 0, storageMonths: 0.5, importDependency: 0.25, resilienceScore: 44 },
        [{ name: 'Granary', status: 'active' }]),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
    {
      id: 'netherharbor',
      name: 'Netherharbor',
      phase: 'canon',
      settlement: seasonsSettlement('Netherharbor', 'coastal',
        { surplusPct: 6, deficitPct: 0, storageMonths: 1.2, importDependency: 0.3, resilienceScore: 55 },
        [{ name: 'Fishery', status: 'active' }]),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
  ];
  const campaign = {
    id: 'seasons-golden',
    name: 'Seasons Golden',
    settlementIds: saves.map((s) => s.id),
    worldState: {
      rngSeed: seed,
      tick: 0,
      calendar: { elapsedWeeks: startWeek, elapsedMonths: (startWeek * 3) / 13, month: 1, year: 1, season: 'spring' },
      simulationRules: { seasonsEnabled: true },
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.grainhall.bleakstone', from: 'grainhall', to: 'bleakstone', relationshipType: 'trade_partner' },
        { id: 'edge.grainhall.netherharbor', from: 'grainhall', to: 'netherharbor', relationshipType: 'trade_partner' },
      ],
    }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  return { campaign, saves };
}

/** The corpus: (seed, startWeek, ticks) windows covering harvest + hungry gap. */
function corpus() {
  return [
    { seed: 'seasons-golden-a', startWeek: 22, ticks: 20 },  // summer → harvest boundary → deep autumn
    { seed: 'seasons-golden-a', startWeek: 38, ticks: 20 },  // autumn end → winter → hungry gap → spring
    { seed: 'seasons-golden-b', startWeek: 0, ticks: 26 },   // spring → summer, a different year-seed
  ];
}
const keyOf = (c) => [c.seed, c.startWeek, c.ticks].join('|');

/** Hash the oracle-normalized MECHANICAL seasonal projection after N weekly ticks. */
function seasonsHashFor({ seed, startWeek, ticks }) {
  let { campaign, saves } = makeCampaignAndSaves(seed, startWeek);
  let wizardNews = campaign.wizardNews;
  /** @type {Record<string, number>} */
  const candidateTypes = {};
  /** @type {Record<string, Array<{ w: number, s: number, d: number }>>} */
  const trajectory = { grainhall: [], bleakstone: [], netherharbor: [] };
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign: { ...campaign, wizardNews }, saves, interval: 'one_week', now: NOW });
    for (const o of [...(r.selected || []), ...(r.autoApplied || [])]) {
      const type = String(o?.candidateType || o?.type || 'unknown');
      candidateTypes[type] = (candidateTypes[type] || 0) + 1;
    }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph };
    wizardNews = r.wizardNews;
    for (const s of saves) {
      const fs = s.settlement?.economicState?.foodSecurity || {};
      trajectory[s.id].push({
        w: r.worldState?.calendar?.elapsedWeeks ?? -1,
        s: Number(fs.storageMonths) || 0,
        d: Number(fs.deficitPct) || 0,
      });
    }
  }
  /** @type {Record<string, unknown>} */
  const finalStockpiles = {};
  for (const s of saves) {
    const sp = s.settlement?.economicState?.foodSecurity?.stockpile || {};
    finalStockpiles[s.id] = {
      season: sp.season ?? null,
      seasonWeek: sp.seasonWeek ?? null,
      seasonalSwingPct: sp.seasonalSwingPct ?? null,
      seasonalEvent: sp.seasonalEvent ?? null,
      capacityMonths: sp.capacityMonths ?? null,
    };
  }
  const projection = {
    tick: campaign.worldState?.tick ?? null,
    trajectory,
    finalStockpiles,
    seasonMarkers: (wizardNews?.entries || [])
      .filter((e) => e.kind === 'season_marker')
      .map((e) => ({ id: e.id, impactKind: e.impactKind, significance: e.significance, settlementIds: e.settlementIds })),
    candidateTypes,
  };
  return createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex');
}

describe('worldPulse seasons golden master (flag-ON mechanical stability)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the seasons golden manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = seasonsHashFor(c);
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    });
    return;
  }

  it('the seasons manifest exists (run UPDATE_GOLDEN=1 to capture it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('two-run determinism: every corpus row hashes identically across two fresh runs', () => {
    for (const c of rows) {
      expect(seasonsHashFor(c), keyOf(c)).toBe(seasonsHashFor(c));
    }
  }, 60_000);

  it('every corpus row matches the golden projection', () => {
    const drift = [];
    for (const c of rows) {
      const k = keyOf(c);
      if (manifest[k] !== seasonsHashFor(c)) drift.push(k);
    }
    expect(drift).toEqual([]);
  }, 60_000);
});
