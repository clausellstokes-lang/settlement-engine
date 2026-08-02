/**
 * dispositionChannelsDormancyGolden.test.js — WR-2's PRE-WIRING dormancy fence.
 *
 * This manifest is captured before dispositionChannelsEnabled is wired anywhere.
 * The fixture is intentionally non-trivial: it starts with populated LEGACY
 * dispositionStats ({wins, losses, score}), a live siege, a two-supplier trade
 * contest, a long-lived treaty, the settlement strategy chooser, and WR-1's
 * termination reader. If WR-2 later leaks while dark, the full mechanical,
 * decision, news, strategy, or termination trace below changes.
 *
 * Two dark configurations are constitutional equivalents:
 *   - dispositionChannelsEnabled ABSENT
 *   - dispositionChannelsEnabled explicitly false
 *
 * Their projections are compared through the shared structural dormancy oracle.
 * The flag itself is removed from the projected rules (configuration spelling is
 * not behavior); every other world byte is retained. Dark runs must also preserve
 * the legacy disposition entry shape and emit none of WR-2's eight receipt kinds.
 *
 * Capture (once, before production wiring):
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/dispositionChannelsDormancyGolden.test.js
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'disposition-channels-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const GRAIN = 'Bulk grain and foodstuffs';
const IDS = ['iron', 'weak', 'granary', 'river', 'market'];

const WR2_RECEIPT_KINDS = Object.freeze([
  'disposition_martial_crossed',
  'disposition_mercantile_crossed',
  'disposition_diplomatic_crossed',
  'disposition_insular_crossed',
  'disposition_reversal',
  'deity_war_pressure',
  'deity_peace_pressure',
  'war_culture_suppressed',
]);

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population ?? 2400,
    config: {
      tradeRouteAccess: 'road',
      priorityEconomy: patch.priorityEconomy ?? 30,
      priorityMilitary: patch.priorityMilitary ?? 30,
    },
    institutions: patch.institutions || [{ name: 'Market' }],
    economicState: {
      prosperity: patch.prosperity || 'Prosperous',
      primaryExports: patch.exports || [],
      primaryImports: patch.imports || [],
      activeChains: patch.activeChains || [],
      foodSecurity: patch.foodSecurity || { storageMonths: 6, resilienceScore: 65 },
    },
    powerStructure: {
      publicLegitimacy: {
        score: patch.legitimacy ?? 60,
        label: (patch.legitimacy ?? 60) < 40 ? 'Contested' : 'Stable',
      },
      factions: patch.factions || [
        { faction: `${name} Council`, category: 'civic', power: 58, isGoverning: true },
        { faction: `${name} Guild`, category: 'economy', power: 46 },
      ],
      conflicts: [],
    },
    npcs: [{
      id: `reeve_${name.toLowerCase()}`,
      name: `Reeve ${name}`,
      importance: 'key',
      personality: patch.personality || { dominant: 'pragmatic', flaw: 'proud' },
    }],
    activeConditions: [],
  };
}

const save = (id, name, patch = {}) => ({
  id,
  name,
  phase: 'canon',
  settlement: settlement(name, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

function siegeRecord() {
  return {
    targetId: 'weak',
    sinceTick: 2,
    role: 'siege',
    maxStartStrength: 82,
    currentEffectiveStrength: 78,
    accumulatedAttrition: 4,
    reinforcementFlow: 0,
    deploymentAge: 2,
    manpower: 0.82,
    supplyIntegrity: 0.78,
    morale: 0.76,
    equipmentCondition: 0.84,
    magicSupport: 0.35,
    commandQuality: 0.86,
    foodReserve: 0.8,
    logisticsBurden: 0.12,
    objective: 'conquest',
    returnCondition: 'pending',
    casusReasons: [{
      type: 'grievance',
      score: 0.8,
      receipt: 'An old border wrong still stands.',
      atTick: 2,
    }],
  };
}

/** A current-clock, long-lived treaty whose enforcement remains active throughout the corpus. */
function liveTreaty() {
  return {
    parties: ['granary', 'river'],
    victorId: 'granary',
    loserId: 'river',
    victorName: 'Granary',
    loserName: 'Rivermill',
    mintedTick: 1,
    believedMarginAtSignature: 0.3,
    budgetGranted: 1,
    budgetSpent: 0.4,
    complianceState: 'honored',
    treatyTicksPerYear: 52,
    terms: [{
      type: 'non_aggression',
      family: 'security',
      magnitude: 1,
      mintedTick: 1,
      expiresTick: 521,
      weightSpent: 0.4,
      complianceState: 'honored',
      trueState: 'honored',
      burden01: 0,
      receipt: 'The two market courts swore to keep the peace.',
    }],
    receipts: ['The Market Peace.'],
  };
}

/**
 * A pre-WR2 world that exercises every legacy seam WR2 will later touch:
 * war outcome memory, strategy, WR1 termination, trade competition, and treaty state.
 * @param {string} seed
 * @param {'absent'|'false'} flagMode
 */
function makeCampaignAndSaves(seed, flagMode) {
  const saves = [
    save('iron', 'Ironhold', {
      tier: 'city', population: 9000, priorityMilitary: 38, legitimacy: 58,
      institutions: [{ name: 'City Garrison' }, { name: 'Stone Walls' }],
      exports: [{ name: 'Forged Weapons' }],
      foodSecurity: { storageMonths: 8, resilienceScore: 80 },
      factions: [{ faction: 'High Command', category: 'military', power: 72, isGoverning: true }],
      personality: { dominant: 'proud', flaw: 'stubborn' },
    }),
    save('weak', 'Weakmoor', {
      tier: 'city', population: 7000, priorityMilitary: 34, legitimacy: 55,
      exports: [GRAIN],
      institutions: [{ name: 'City Garrison' }, { name: 'Stone Walls' }, { name: 'Granary' }],
      factions: [{ faction: 'Weakmoor Council', category: 'military', power: 68, isGoverning: true }],
      personality: { dominant: 'cautious', flaw: 'anxious' },
    }),
    save('granary', 'Granary', {
      exports: [GRAIN],
      institutions: [{ name: 'Grand Market' }, { name: 'Granary' }],
      activeChains: [{
        needKey: 'food', chainId: 'grain', resource: GRAIN,
        processingInstitutions: ['Granary'], outputs: [GRAIN],
      }],
    }),
    save('river', 'Rivermill', {
      exports: [GRAIN],
      institutions: [{ name: 'River Market' }, { name: 'Watermill' }],
      activeChains: [{
        needKey: 'food', chainId: 'grain', resource: GRAIN,
        processingInstitutions: ['Watermill'], outputs: [GRAIN],
      }],
    }),
    save('market', 'Marketcross', {
      tier: 'city', population: 18000, imports: [GRAIN],
      institutions: [{ name: 'Grand Bazaar' }],
    }),
  ];

  const simulationRules = {
    warLayerEnabled: true,
    settlementStrategyEnabled: true,
    peaceEngineEnabled: true,
    warTerminationEnabled: true,
    tradeFlowsEnabled: true,
    ...(flagMode === 'false' ? { dispositionChannelsEnabled: false } : {}),
  };

  const campaign = {
    id: 'wr2-dormancy',
    name: 'WR-2 Dormancy',
    settlementIds: [...IDS],
    worldState: {
      rngSeed: seed,
      tick: 4,
      calendar: { elapsedWeeks: 30 },
      simulationRules,
      // Load-bearing legacy shape: WR2 must not migrate or decorate it while dark.
      dispositionStats: {
        iron: { wins: 7, losses: 2, score: 5 },
        weak: { wins: 1, losses: 6, score: -5 },
        granary: { wins: 4, losses: 1, score: 3 },
        river: { wins: 2, losses: 4, score: -2 },
        market: { wins: 3, losses: 3, score: 0 },
      },
      deployments: { iron: siegeRecord() },
      warExhaustion: { iron: 0.28, weak: 0.62 },
      relationshipStates: {
        'edge.iron.weak': {
          relationshipType: 'hostile', resentment: 0.8, trust: 0.08,
          recentIncidents: [{ type: 'war_raid', tick: -4, description: 'The burning of the mill road' }],
        },
        'edge.granary.market': { relationshipType: 'trade_partner', trust: 0.62, resentment: 0.08 },
        'edge.river.market': { relationshipType: 'trade_partner', trust: 0.48, resentment: 0.12 },
        'edge.granary.river': { relationshipType: 'trade_partner', trust: 0.4, resentment: 0.18 },
      },
      spatialLedgers: {
        warReasons: {
          'iron>weak': {
            updatedTick: 4,
            reasons: {
              grievance: {
                type: 'grievance', score: 0.8, sinceTick: 1, tick: 4,
                receipt: 'An old border wrong still stands.',
              },
            },
          },
        },
        peaceReasons: {
          'iron>weak': {
            updatedTick: 4,
            reasons: {
              exhaustion: {
                type: 'exhaustion', score: 0.55, sinceTick: 3, tick: 4,
                receipt: 'The campaign has worn the court thin.',
              },
            },
          },
        },
        treaties: { 'granary>river': liveTreaty() },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.iron.weak', from: 'iron', to: 'weak', relationshipType: 'hostile' },
        { id: 'edge.granary.market', from: 'granary', to: 'market', relationshipType: 'trade_partner' },
        { id: 'edge.river.market', from: 'river', to: 'market', relationshipType: 'trade_partner' },
        { id: 'edge.granary.river', from: 'granary', to: 'river', relationshipType: 'trade_partner' },
      ],
      channels: [
        {
          id: 'channel.trade.granary.market.grain', type: 'trade_dependency',
          from: 'granary', to: 'market', goods: [{ id: 'grain', label: GRAIN }],
          strength: 0.72, confidence: 0.9, status: 'confirmed', source: 'fixture',
        },
        {
          id: 'channel.trade.river.market.grain', type: 'trade_route',
          from: 'river', to: 'market', goods: [{ id: 'grain', label: GRAIN }],
          strength: 0.61, confidence: 0.85, status: 'confirmed', source: 'fixture',
        },
        {
          id: 'channel.war.iron.weak', type: 'war_front',
          from: 'iron', to: 'weak', status: 'confirmed', source: 'war_layer_deploy',
        },
      ],
    }, { now: NOW }),
    wizardNews: { currentTick: 4, entries: [] },
  };
  return { campaign, saves };
}

function withoutWR2Flag(rules) {
  if (!rules || typeof rules !== 'object') return rules;
  const { dispositionChannelsEnabled: _ignored, ...rest } = rules;
  return rest;
}

/** Drive real pulses and retain the broad serialized trace WR2 could perturb. */
function driveTicks(seed, flagMode, ticks, interval) {
  let { campaign, saves } = makeCampaignAndSaves(seed, flagMode);
  const traces = [];
  for (let i = 0; i < ticks; i += 1) {
    const result = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    traces.push({
      pulseRecord: result.pulseRecord,
      selected: result.selected || [],
      autoApplied: result.autoApplied || [],
      rollExplanations: result.rollExplanations || [],
      news: result.wizardNews?.entries || [],
    });
    const updates = new Map((result.settlementUpdates || []).map((entry) => [String(entry.saveId), entry.settlement]));
    saves = saves.map((entry) => (updates.has(entry.id) ? { ...entry, settlement: updates.get(entry.id) } : entry));
    campaign = {
      ...campaign,
      worldState: result.worldState,
      regionalGraph: result.regionalGraph || campaign.regionalGraph,
      wizardNews: result.wizardNews || campaign.wizardNews,
    };
  }
  return { campaign, saves, traces };
}

function projectionFor(run) {
  const worldState = run.campaign.worldState || {};
  return normalizeForDormancy({
    // Keep the whole evolved state, excluding only the spelling of the flag under test.
    worldState: { ...worldState, simulationRules: withoutWR2Flag(worldState.simulationRules) },
    regionalGraph: run.campaign.regionalGraph,
    wizardNews: run.campaign.wizardNews,
    saves: run.saves,
    traces: run.traces,
  });
}

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

function corpus() {
  return [
    { seed: 'wr2-a', ticks: 2, interval: 'one_week' },
    { seed: 'wr2-b', ticks: 5, interval: 'one_month' },
    { seed: 'wr2-c', ticks: 7, interval: 'one_week' },
  ];
}

const keyOf = (row) => [row.seed, row.ticks, row.interval].join('|');
const absentProjectionFor = (row) => projectionFor(driveTicks(row.seed, 'absent', row.ticks, row.interval));

function collectKindStrings(value, out = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectKindStrings(item, out);
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  for (const [key, child] of Object.entries(value)) {
    if ((key === 'kind' || key === 'impactKind') && typeof child === 'string') out.add(child);
    collectKindStrings(child, out);
  }
  return out;
}

function assertLegacyDispositionShape(run) {
  const stats = run.campaign.worldState?.dispositionStats;
  expect(stats, 'the populated legacy ledger survives the run').toBeTruthy();
  for (const [id, entry] of Object.entries(stats)) {
    expect(Object.keys(entry).sort(), `${id} remains exactly {losses,score,wins} while WR2 is dark`)
      .toEqual(['losses', 'score', 'wins']);
    expect(Number.isFinite(entry.wins), `${id}.wins remains numeric`).toBe(true);
    expect(Number.isFinite(entry.losses), `${id}.losses remains numeric`).toBe(true);
    expect(Number.isFinite(entry.score), `${id}.score remains numeric`).toBe(true);
  }
}

describe('WR-2 disposition channels — pre-wiring dormancy golden', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN === '1') {
    it('captures the pre-WR2 manifest from the current engine', () => {
      const manifest = {};
      for (const row of rows) manifest[keyOf(row)] = hashOf(absentProjectionFor(row));
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, `${JSON.stringify(manifest, Object.keys(manifest).sort(), 2)}\n`);
      expect(Object.keys(manifest)).toHaveLength(rows.length);
    }, 120_000);
    return;
  }

  it('the pre-wiring manifest exists', () => {
    expect(existsSync(MANIFEST), 'run the documented UPDATE_GOLDEN capture before WR2 wiring').toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};

  it('covers the complete seed/tick/interval corpus', () => {
    expect(Object.keys(manifest).sort()).toEqual(rows.map(keyOf).sort());
  });

  it('reproduces every pre-wiring mechanical, decision, news, strategy, and termination trace', () => {
    const drift = [];
    for (const row of rows) {
      if (manifest[keyOf(row)] !== hashOf(absentProjectionFor(row))) drift.push(keyOf(row));
    }
    expect(drift).toEqual([]);
  }, 120_000);

  it('ABSENT and explicit false are oracle-normalized exact equivalents across the corpus', () => {
    for (const row of rows) {
      const absent = absentProjectionFor(row);
      const explicitFalse = projectionFor(driveTicks(row.seed, 'false', row.ticks, row.interval));
      expect(explicitFalse, keyOf(row)).toEqual(absent);
    }
  }, 120_000);

  it('dark contract: legacy entries stay unextended and no WR2 receipt kind escapes', () => {
    for (const flagMode of ['absent', 'false']) {
      const run = driveTicks('wr2-contract', flagMode, 5, 'one_week');
      assertLegacyDispositionShape(run);
      const kinds = collectKindStrings(projectionFor(run));
      expect(WR2_RECEIPT_KINDS.filter((kind) => kinds.has(kind)), flagMode).toEqual([]);
      expect(run.traces.some((trace) => trace.pulseRecord?.warTerminationReads?.length),
        `${flagMode}: WR1 termination read is genuinely live in the fixture`).toBe(true);
      expect(run.campaign.worldState?.spatialLedgers?.treaties?.['granary>river'],
        `${flagMode}: the live treaty substrate survives the drive`).toBeTruthy();
    }
  }, 120_000);
});
