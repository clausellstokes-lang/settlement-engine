/**
 * dispositionChannelsDormancyGolden.test.js — WR-2's dormancy fence, RE-SCOPED.
 *
 * ─── WHY THIS FILE WAS RE-SCOPED (chair ruling, LANE DG, vetoable) ────────────
 * The cycle-22 OV verifier found this golden's three `wr2-*` rows red and ruled:
 *
 *   "cycle-22's OV verifier CONFIRMED tests/property/dispositionChannelsDormancy
 *    Golden.test.js's three red wr2-* rows are a MIS-SCOPED GOLDEN, not a WR-2
 *    dormancy leak — the fixture was captured once @ 7796954e and never re-recorded,
 *    and the flag's dormancy is genuinely clean. RULED: re-scope the golden lawfully."
 *
 * THE MIS-SCOPING MECHANISM. The original manifest froze a sha256 over the ENTIRE
 * evolved world of a dark run — every byte of worldState, regionalGraph, wizardNews,
 * saves, and the full per-tick trace. That projection is moved by ANY war-engine
 * change whatsoever, so the pin could never distinguish "WR-2 leaked while dark"
 * from "WR-3..WR-8 shipped". It was a whole-engine snapshot wearing a flag-dormancy
 * name, and after 162 commits it had become a pure false-positive generator.
 *
 * THE RE-DERIVATION (executed, not assumed). The capture-era tree @ 7796954e was
 * checked out and driven through a byte-identical copy of this harness; it
 * reproduced all three stored hashes EXACTLY, proving the manifest was honestly
 * captured and the drift is engine evolution. A path-level diff of the two
 * projections then showed, for all three rows:
 *
 *   - 578 differing leaves (389 changed / 175 added / 14 removed), of which
 *     ZERO lie on a disposition-named path;
 *   - `worldState.dispositionStats` BYTE-IDENTICAL capture-era vs HEAD, still
 *     exactly {losses, score, wins} — no channel extension, no decoration;
 *   - none of WR-2's eight receipt kinds present in either tree.
 *
 * The drift is WR-4/WR-5 and the news desk: `warTerminationReads` gained
 * trajectory/books/homeFront/ruler bands, and pulse news gained beats such as
 * `war_trajectory_losing`. All are ungated by `dispositionChannelsEnabled`.
 *
 * ─── THE CORRECTED SCOPE ──────────────────────────────────────────────────────
 * Dormancy is a claim about the DIFFERENCE the flag makes, not about the absolute
 * state of a world 162 commits ago. This file now fences it four ways, and only
 * the first stores a fixture:
 *
 *   1. STATE GOLDEN, narrowed to WR-2's OWN footprint — the dispositionStats
 *      ledger (its only persisted state) plus any WR-2-kind news. Unrelated
 *      engine evolution cannot move it (measured: byte-identical across the 162
 *      commits above); a channel extension, migration, or value drift while dark
 *      moves it immediately.
 *   2. DIFFERENTIAL byte-identity — ABSENT vs explicit-false over the WHOLE
 *      projection. No fixture, so it never rots.
 *   3. CODE-PATH DORMANCY — WR-2's cross-module entry points are proven not to
 *      fire while dark. This replaces the one thing the frozen whole-world hash
 *      uniquely covered (a feature that runs regardless of its flag) with a fence
 *      that unrelated engine evolution cannot move.
 *   4. GATE-POLARITY CENSUS — every production read of the flag is the strict
 *      `=== true` form, so ABSENT and FALSE are identical BY CONSTRUCTION at the
 *      decision sites (strategy, deployment, termination, coalition, treaty) that
 *      no state pin can reach.
 *
 * Re-record (scope change only — see the ruling above):
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/dispositionChannelsDormancyGolden.test.js
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

/**
 * Fence 3's recorder. Hoisted because `vi.mock` factories are hoisted above the
 * imports; every wrapper below is a strict pass-through (rest-args in, original
 * out), so instrumenting the modules cannot perturb a single byte of the runs the
 * other fences measure.
 */
const wr2Calls = vi.hoisted(() => ({ litLedgerAdvances: 0, channelDeltaCollections: 0, transitionNewsWithWork: 0 }));

vi.mock('../../src/domain/worldPulse/dispositionLedger.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    advanceDispositionChannels: (/** @type {any[]} */ ...args) => {
      if (args[2]?.enabled === true) wr2Calls.litLedgerAdvances += 1;
      return actual.advanceDispositionChannels(...args);
    },
  };
});

vi.mock('../../src/domain/worldPulse/dispositionDeltas.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    collectDispositionChannelDeltas: (/** @type {any[]} */ ...args) => {
      wr2Calls.channelDeltaCollections += 1;
      return actual.collectDispositionChannelDeltas(...args);
    },
  };
});

vi.mock('../../src/domain/worldPulse/dispositionNews.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    dispositionTransitionNewsEntries: (/** @type {any[]} */ ...args) => {
      // realmVerbExecution calls this composer unconditionally and relies on an
      // EMPTY transition list for its dormancy, so "never called" would be false.
      // The true invariant is that it is never handed WR-2 work while dark.
      if (Array.isArray(args[0]?.transitions) && args[0].transitions.length > 0) {
        wr2Calls.transitionNewsWithWork += 1;
      }
      return actual.dispositionTransitionNewsEntries(...args);
    },
  };
});

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'disposition-channels-dormancy-golden.json');
const SRC_ROOT = resolve(process.cwd(), 'src');
const SCOPE = 'wr2-owned-surface-v2';
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
 * A world that exercises every legacy seam WR2 touches: war outcome memory,
 * strategy, WR1 termination, trade competition, and treaty state.
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

/**
 * FENCE 2's projection: the whole evolved world, minus only the spelling of the
 * flag under test. Correct for a DIFFERENTIAL comparison (both sides run on the
 * same engine); it is precisely what must NOT be frozen into a fixture.
 */
function projectionFor(run) {
  const worldState = run.campaign.worldState || {};
  return normalizeForDormancy({
    worldState: { ...worldState, simulationRules: withoutWR2Flag(worldState.simulationRules) },
    regionalGraph: run.campaign.regionalGraph,
    wizardNews: run.campaign.wizardNews,
    saves: run.saves,
    traces: run.traces,
  });
}

const isWR2Kind = (entry) => WR2_RECEIPT_KINDS.includes(entry?.kind) || WR2_RECEIPT_KINDS.includes(entry?.impactKind);

/**
 * FENCE 1's projection: WR-2's OWN footprint and nothing else — the dispositionStats
 * ledger it is the sole writer of, and any news carrying one of its receipt kinds.
 * Deliberately excludes the war engine's own evolving output, which is what made the
 * superseded whole-world manifest unmaintainable.
 */
function wr2SurfaceProjection(run) {
  const news = [];
  for (const trace of run.traces) for (const entry of trace.news || []) if (isWR2Kind(entry)) news.push(entry);
  for (const entry of run.campaign.wizardNews?.entries || []) if (isWR2Kind(entry)) news.push(entry);
  return normalizeForDormancy({
    dispositionStats: run.campaign.worldState?.dispositionStats || {},
    wr2News: news,
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
const darkRun = (row, flagMode = 'absent') => driveTicks(row.seed, flagMode, row.ticks, row.interval);

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

// ── FENCE 4 — gate-polarity census over the real source tree ──────────────────

/**
 * Strip comments and string literals so an identifier inside PROSE — or inside an
 * inline `/** @type *\/` cast, which is how treatyDisposition.js legitimately names
 * the flag one line above its real gate — is not read as a gate.
 */
function codeResidue(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return '';
  return line
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``')
    .replace(/\/\/.*$/, '');
}

const FLAG = 'dispositionChannelsEnabled';
const STRICT_READ = new RegExp(`${FLAG}\\s*===\\s*true`);
const DECLARATION = new RegExp(`${FLAG}\\s*:\\s*(false|boolean)`);

/** @returns {{strictReads:number, files:Set<string>, violations:string[]}} */
function censusFlagGates(root, relativeTo) {
  const out = { strictReads: 0, files: new Set(), violations: [] };
  const walk = (dir) => {
    for (const name of readdirSync(dir).sort()) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) { walk(full); continue; }
      if (!/\.jsx?$/.test(name)) continue;
      const text = readFileSync(full, 'utf8');
      if (!text.includes(FLAG)) continue;
      const rel = full.slice(relativeTo.length + 1);
      text.split('\n').forEach((line, index) => {
        const residue = codeResidue(line);
        if (!residue.includes(FLAG)) return;
        if (STRICT_READ.test(residue)) {
          out.strictReads += 1;
          out.files.add(rel);
          return;
        }
        if (DECLARATION.test(residue)) return;
        out.violations.push(`${rel}:${index + 1}: ${line.trim()}`);
      });
    }
  };
  walk(root);
  return out;
}

describe('WR-2 disposition channels — dormancy fence (re-scoped, LANE DG)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN === '1') {
    it('re-records the WR-2-owned surface manifest from the current engine', () => {
      const manifestRows = {};
      for (const row of rows) manifestRows[keyOf(row)] = hashOf(wr2SurfaceProjection(darkRun(row)));
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      const payload = { scope: SCOPE, rows: manifestRows };
      writeFileSync(MANIFEST, `${JSON.stringify(payload, null, 2)}\n`);
      expect(Object.keys(manifestRows)).toHaveLength(rows.length);
    }, 120_000);
    return;
  }

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};

  it('the WR-2-surface manifest exists at the re-scoped version', () => {
    expect(existsSync(MANIFEST), 'run the documented UPDATE_GOLDEN re-record').toBe(true);
    expect(manifest.scope, 'a manifest at the superseded whole-world scope must be re-recorded, not compared')
      .toBe(SCOPE);
  });

  it('covers the complete seed/tick/interval corpus', () => {
    expect(Object.keys(manifest.rows || {}).sort()).toEqual(rows.map(keyOf).sort());
  });

  // ── FENCE 1 ────────────────────────────────────────────────────────────────
  it('reproduces the WR-2-owned surface: the ledger stays legacy and no WR-2 news is minted', () => {
    const drift = [];
    for (const row of rows) {
      if (manifest.rows?.[keyOf(row)] !== hashOf(wr2SurfaceProjection(darkRun(row)))) drift.push(keyOf(row));
    }
    expect(drift).toEqual([]);
  }, 120_000);

  // ── FENCE 2 ────────────────────────────────────────────────────────────────
  it('ABSENT and explicit false are byte-identical across the whole projected world', () => {
    for (const row of rows) {
      const absent = projectionFor(darkRun(row, 'absent'));
      const explicitFalse = projectionFor(darkRun(row, 'false'));
      expect(explicitFalse, keyOf(row)).toEqual(absent);
      expect(hashOf(explicitFalse), `${keyOf(row)} canonical-form byte identity`).toBe(hashOf(absent));
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

  // ── FENCE 3 ────────────────────────────────────────────────────────────────
  it('code-path dormancy: no WR-2 channel entry point fires during a dark drive', () => {
    wr2Calls.litLedgerAdvances = 0;
    wr2Calls.channelDeltaCollections = 0;
    wr2Calls.transitionNewsWithWork = 0;
    for (const flagMode of ['absent', 'false']) {
      for (const row of rows) darkRun(row, /** @type {'absent'|'false'} */ (flagMode));
    }
    expect(wr2Calls.litLedgerAdvances, 'dispositionLedger was advanced in LIT mode while the flag is dark').toBe(0);
    expect(wr2Calls.channelDeltaCollections, 'the typed channel collector ran while the flag is dark').toBe(0);
    expect(wr2Calls.transitionNewsWithWork, 'the transition news composer was handed WR-2 work while dark').toBe(0);
  }, 120_000);

  // ── FENCE 4 ────────────────────────────────────────────────────────────────
  it('gate-polarity census: every production read of the flag is strict `=== true`', () => {
    const census = censusFlagGates(SRC_ROOT, SRC_ROOT);
    expect(census.violations, 'a non-strict gate makes ABSENT and FALSE diverge').toEqual([]);
    // Non-vacuity: the census must actually be looking at the wired gates.
    expect(census.strictReads).toBeGreaterThanOrEqual(10);
    expect(census.files.size).toBeGreaterThanOrEqual(5);
  });

  it('the gate census is not vacuous: a loose gate is rejected', () => {
    const loose = ['if (rules.dispositionChannelsEnabled) { lit(); }', `x = a.${FLAG} !== false;`];
    for (const line of loose) {
      const residue = codeResidue(line);
      expect(residue.includes(FLAG) && !STRICT_READ.test(residue) && !DECLARATION.test(residue), line).toBe(true);
    }
    // …and the three NON-gate idioms are correctly not read as gates: docstring
    // prose, a quoted rule name, and an inline JSDoc type cast.
    expect(codeResidue(` * while ${FLAG} is active, the war threshold moves`).includes(FLAG)).toBe(false);
    expect(codeResidue(`  rule: '${FLAG}',`).includes(FLAG)).toBe(false);
    expect(codeResidue(`  const rules = /** @type {{${FLAG}?:unknown}} */ (ws?.simulationRules || {});`)
      .includes(FLAG)).toBe(false);
    // The real gate on the very next line still counts.
    expect(STRICT_READ.test(codeResidue(`  return rules.${FLAG} === true;`))).toBe(true);
  });
});
