#!/usr/bin/env node
/**
 * whole-world-soak.mjs — the MAINTAINED whole-kernel soak (Phase 5.5 W0 Lane B).
 *
 * The multi-decade composed-engine evidence used to rest on an ad-hoc harness
 * (the 2026-07-11 empirical assessment); this promotes it to a repeatable audit
 * artifact. It generates a real 4-settlement region with the SEEDED generator,
 * turns the FULL SIMULATION preset on (war stack at depth — the eight W0-A3
 * sub-flags included), and advances 30 years through the production orchestrator
 * (`simulateCampaignWorldInterval`, one pinned `now`, year by year, threading
 * state exactly as the store does). Then it PROVES:
 *
 *   1. NO CRASH / NO NaN-or-Infinity anywhere in worldState/graph/settlements
 *      (scanned every year, fail-fast);
 *   2. BYTE-IDENTICAL RE-RUN — the same seed replays the identical composite
 *      hash every year (run B == run A, all N years);
 *   3. DIVERGENCE on a different seed (run C forks from run A within the
 *      comparison window — the determinism is seed-derived, not degenerate);
 *   4. POPULATION BOUNDED — every settlement stays finite and > 0; the realm
 *      total stays within a generous envelope of its start (attractors, not
 *      runaways or death-spirals);
 *   5. BEHAVIORAL OBSERVATION — selected outcomes, mover families, event
 *      diversity, arc polarity, state motion, succession, causal composition,
 *      attention, and a bounded Chronicle sample are recorded for the
 *      predeclared realm-scale oracle. This cell does not choose its own bands.
 *   6. ISOLATED WORKER EXECUTION — one real Node worker_threads isolate imports
 *      the product Web Worker module, advances the same initial realm through
 *      the same domain entry, and must return the same output hash as run A.
 *      Its timings are real for that Node host, but explicitly NOT represented
 *      as browser Web Worker or field-device measurements.
 *
 * Deterministic: seeded generation (options THIRD — the second argument is
 * importedNeighbour and now fail-closes on an options bag), pinned `now`,
 * pure kernel. Pure measurement; tunes nothing.
 *
 *   node scripts/audit/whole-world-soak.mjs [--years 30] [--seed w0-soak]
 *                                           [--divergence-years 5] [--json]
 *                                           [--seasons on|off]
 *                                           [--neighbor-control-years 30]
 *                                           [--dark-control]
 *
 * SEASONS-A: full_simulation now lights seasonsEnabled, so the default soak
 * runs the food year. `--seasons off` restores the pre-seasons variant for
 * A/B comparison; `--seasons on` is explicit. (One soak, flag-varied — never
 * a second soak script.)
 */

import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { measureIsolatedAdvanceWorker } from './advance-worker-evidence.mjs';
import {
  buildBehavioralObservation,
  buildDarkControl,
  buildNeighborControl,
  observeBehavioralYear,
} from './behavioral-observation.mjs';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceInterval.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] != null ? process.argv[i + 1] : dflt;
};
const YEARS = Math.max(1, Number(arg('years', 30)));
const SEED = String(arg('seed', 'w0-soak'));
const DIVERGENCE_YEARS = Math.max(1, Math.min(YEARS, Number(arg('divergence-years', 5))));
const AS_JSON = process.argv.includes('--json');
const RECEIPT_PATH = arg('receipt', '');
const CASE_ID = String(arg('case-id', ''));
const SEASONS = String(arg('seasons', 'preset')); // 'on' | 'off' | preset default
const NEIGHBOR_CONTROL_YEARS = Math.max(
  0,
  Math.min(YEARS, Number(arg('neighbor-control-years', 0)) || 0),
);
const RUN_DARK_CONTROL = process.argv.includes('--dark-control');
// performance-scale-6: parameterize the fixture up to the 30-settlement envelope so
// the soak can exercise the cost axis at the product's headline scale. Default stays
// 4 (the historical fixture — byte-identical archetypes for the first four ids).
const SETTLEMENTS = Math.max(1, Math.min(30, Number(arg('settlements', 4))));
const NOW = '2026-07-12T00:00:00.000Z'; // pinned — one instant for the whole soak

const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// ── Fixture: a generated region (mixed tiers, real economies). The first four ids
//    are the historical archetypes (byte-stable for the default 4-settlement soak);
//    beyond that the archetypes cycle with fresh ids so --settlements up to 30 builds
//    a larger realm without changing the small-N output. ─────────────────────────
const REGION_ARCHETYPES = [
  { settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'crossroads' },
  { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  { settType: 'town', culture: 'celtic', terrain: 'coastal', tradeRouteAccess: 'port' },
  { settType: 'village', culture: 'norse', terrain: 'mountains', tradeRouteAccess: 'road' },
];
const SEQ_IDS = ['soak-a', 'soak-b', 'soak-c', 'soak-d'];
const REGION = Array.from({ length: SETTLEMENTS }, (_, i) => ({
  id: i < SEQ_IDS.length ? SEQ_IDS[i] : `soak-${i}`,
  ...REGION_ARCHETYPES[i % REGION_ARCHETYPES.length],
}));

function buildFixture(seed, { variant = 'baseline' } = {}) {
  const saves = REGION.map(({ id, ...config }, i) => {
    // Options are the THIRD argument (the second is importedNeighbour; passing
    // an options bag there now throws — the 85bb8c51 fail-closed contract).
    const settlement = generateSettlementPipeline(config, null, { seed: `${seed}-${i}`, customContent: {} });
    return {
      id,
      name: settlement.name || id,
      phase: 'canon',
      settlement,
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    };
  });

  if (variant === 'neighbor_perturbed' && saves[0]?.settlement) {
    const settlement = saves[0].settlement;
    saves[0] = {
      ...saves[0],
      settlement: {
        ...settlement,
        population: Math.max(
          1,
          Math.round((Number(settlement.population) || 1) * 1.10),
        ),
      },
    };
  }

  if (variant === 'dark') {
    for (let index = 0; index < saves.length; index += 1) {
      const settlement = saves[index].settlement;
      const config = { ...(settlement?.config || {}) };
      delete config.primaryDeityRef;
      delete config.primaryDeitySnapshot;
      delete config.cultDeitySnapshots;
      delete config.latentPantheon;
      saves[index] = {
        ...saves[index],
        settlement: { ...settlement, config },
      };
    }
  }

  const firstExport = (save) => {
    const list = save.settlement?.economicState?.primaryExports || [];
    const label = typeof list[0] === 'string' ? list[0] : list[0]?.label;
    return label ? [{ id: String(label).toLowerCase().replace(/[^a-z0-9]+/g, '_'), label }] : [];
  };
  const channel = (from, to) => ({
    type: 'trade_dependency',
    from: from.id,
    to: to.id,
    status: 'confirmed',
    strength: 0.55,
    goods: firstExport(from),
  });

  // The historical 4-settlement edges/channels (byte-stable for the default soak),
  // guarded to endpoints that exist, plus a trade chain wiring any settlements beyond
  // the fourth into the realm so a larger --settlements fixture is fully connected.
  const has = new Set(REGION.slice(0, saves.length).map((r) => r.id));
  const baseEdges = [
    { id: 'edge.soak-a.soak-b', from: 'soak-a', to: 'soak-b', relationshipType: 'trade_partner' },
    { id: 'edge.soak-b.soak-c', from: 'soak-b', to: 'soak-c', relationshipType: 'rival' },
    { id: 'edge.soak-a.soak-c', from: 'soak-a', to: 'soak-c', relationshipType: 'neutral' },
    { id: 'edge.soak-c.soak-d', from: 'soak-c', to: 'soak-d', relationshipType: 'trade_partner' },
  ].filter((e) => has.has(e.from) && has.has(e.to));
  const baseChannels = [];
  if (saves[0] && saves[1]) baseChannels.push(channel(saves[0], saves[1]));
  if (saves[2] && saves[1]) baseChannels.push(channel(saves[2], saves[1]));
  if (saves[1] && saves[3]) baseChannels.push(channel(saves[1], saves[3]));
  for (let i = 4; i < saves.length; i++) {
    baseEdges.push({ id: `edge.${saves[i - 1].id}.${saves[i].id}`, from: saves[i - 1].id, to: saves[i].id, relationshipType: i % 2 ? 'trade_partner' : 'rival' });
    baseChannels.push(channel(saves[i - 1], saves[i]));
    if (i % 3 === 0) baseChannels.push(channel(saves[i], saves[i - 3]));
  }

  const fullRules = {
    ...SIMULATION_RULE_PRESETS.full_simulation.rules,
    ...(SEASONS === 'on' ? { seasonsEnabled: true } : SEASONS === 'off' ? { seasonsEnabled: false } : {}),
  };
  const darkRules = Object.fromEntries(Object.entries(fullRules).map(([key, value]) => (
    [key, typeof value === 'boolean' ? false : value]
  )));
  Object.assign(darkRules, {
    presetId: 'behavioral_dark_control',
    propagationMode: 'off',
    migrationMode: 'void',
    worldProgression: 'dm_advanced',
    politicalAutonomy: 'dm_only',
  });

  const campaign = {
    id: 'whole-world-soak',
    name: 'Whole-World Soak Realm',
    settlementIds: REGION.map((r) => r.id),
    regionalGraph: ensureRegionalGraph({ edges: baseEdges, channels: baseChannels }, { now: NOW }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: {
      rngSeed: seed,
      tick: 0,
      canonizedAt: NOW,
      // FULL SIMULATION — the §11 ceiling preset: war layer + strategy + faith
      // spread + (W0-A3) the eight war-depth sub-flags. The soak exercises the
      // deepest composed stack the control layer can turn on.
      simulationRules: variant === 'dark' ? darkRules : fullRules,
      stressors: [],
    },
  };
  return { campaign, saves };
}

// ── NaN / Infinity deep scan (fail-fast every year) ──────────────────────────
function findBadNumber(value, path = '$', out = [], seen = new Set()) {
  if (out.length >= 5) return out;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) out.push(`${path} = ${value}`);
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  if (seen.has(value)) return out;
  seen.add(value);
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) findBadNumber(value[i], `${path}[${i}]`, out, seen);
    return out;
  }
  for (const key of Object.keys(value)) findBadNumber(value[key], `${path}.${key}`, out, seen);
  return out;
}

// ── One N-year run: thread state year over year like the store does ──────────
async function runYears(seed, years, label, { variant = 'baseline' } = {}) {
  const fixture = buildFixture(seed, { variant });
  const { campaign, saves } = fixture;
  let runningCampaign = campaign;
  let runningSaves = saves;
  const yearlyHashes = [];
  const yearlyStressorCounts = [];
  const yearlyPopulations = [];
  // performance-scale-6: the cost axis — serialized worldState+regionalGraph bytes and
  // per-year wall-time, so a size/cost regression trends visibly and can be asserted.
  const yearlyBytes = [];
  const yearlyRealmBytes = [];
  const yearlyMs = [];
  const yearlyBehavior = [];
  let firstResultSha256 = null;
  let peakHeapUsedBytes = process.memoryUsage().heapUsed;
  const t0 = Date.now();

  for (let year = 1; year <= years; year++) {
    const beforeSaves = runningSaves;
    const rawWizardNewsById = new Map();
    const y0 = Date.now();
    const result = await simulateCampaignWorldInterval({
      campaign: runningCampaign,
      saves: runningSaves,
      interval: 'one_year',
      commit: true,
      now: NOW,
      autoResolve: true,
      onTickObservation: ({ rawWizardNewsEntries }) => {
        for (const entry of rawWizardNewsEntries || []) {
          if (!entry || typeof entry !== 'object' || !entry.id) continue;
          rawWizardNewsById.set(String(entry.id), entry);
        }
      },
    });
    if (year === 1) firstResultSha256 = sha(result);
    yearlyMs.push(Date.now() - y0);
    if (result.status === 'paused') {
      throw new Error(`[soak:${label}] year ${year} PAUSED under autoResolve:true — orchestrator contract broken`);
    }
    // Thread state forward (the store's carry-over).
    runningCampaign = {
      ...runningCampaign,
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      wizardNews: result.wizardNews,
    };
    if (Array.isArray(result.settlementUpdates) && result.settlementUpdates.length) {
      const byId = new Map(result.settlementUpdates.map((u) => [String(u.saveId), u.settlement]));
      runningSaves = runningSaves.map((s) => (byId.has(String(s.id)) ? { ...s, settlement: byId.get(String(s.id)) } : s));
    }
    yearlyBehavior.push(observeBehavioralYear({
      year,
      result,
      beforeSaves,
      afterSaves: runningSaves,
      rawWizardNewsEntries: [...rawWizardNewsById.values()],
    }));

    // 1. NaN/Infinity scan — fail fast with paths.
    const bad = findBadNumber({
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      settlements: runningSaves.map((s) => s.settlement),
    });
    if (bad.length) {
      throw new Error(`[soak:${label}] non-finite numbers at year ${year}:\n  ${bad.join('\n  ')}`);
    }

    yearlyHashes.push(sha({
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      settlements: runningSaves.map((s) => s.settlement),
    }));
    const stressors = Array.isArray(result.worldState?.stressors) ? result.worldState.stressors : [];
    yearlyStressorCounts.push(stressors.length);
    yearlyPopulations.push(runningSaves.map((s) => Number(s.settlement?.population) || 0));
    yearlyBytes.push(JSON.stringify(result.worldState).length + JSON.stringify(result.regionalGraph).length);
    yearlyRealmBytes.push(JSON.stringify({
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      settlements: runningSaves.map((save) => save.settlement),
    }).length);
    peakHeapUsedBytes = Math.max(peakHeapUsedBytes, process.memoryUsage().heapUsed);
  }

  // This isolated structuredClone call measures only cloning the final realm on
  // the current Node thread. It is NOT worker duration or exact postMessage cost;
  // the actual worker_threads round trip below supplies separate evidence for
  // those combined effects. Clone and heap timings remain observational because
  // they vary by host, while the deterministic byte envelope is the regression
  // wall.
  const finalRealm = { campaign: runningCampaign, saves: runningSaves };
  const cloneStartedAt = performance.now();
  structuredClone(finalRealm);
  const structuredCloneMs = performance.now() - cloneStartedAt;

  return {
    label,
    seed,
    years,
    ms: Date.now() - t0,
    finalTick: runningCampaign.worldState.tick,
    yearlyHashes,
    yearlyStressorCounts,
    yearlyPopulations,
    yearlyBytes,
    yearlyRealmBytes,
    yearlyMs,
    finalRealmBytes: JSON.stringify(finalRealm).length,
    structuredCloneMs,
    firstResultSha256,
    heapUsedBytes: process.memoryUsage().heapUsed,
    peakHeapUsedBytes,
    startPopulations: fixture.saves.map((s) => Number(s.settlement?.population) || 0),
    yearlyBehavior,
    finalWorldState: runningCampaign.worldState,
  };
}

// ── The soak ──────────────────────────────────────────────────────────────────
const failures = [];
const check = (ok, name, detail) => {
  const line = `${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`;
  console.log(`  ${line}`);
  if (!ok) failures.push(name);
};

console.log(`# whole-world soak — ${YEARS} years × ${REGION.length} settlements, seed "${SEED}", full_simulation preset (seasons ${SEASONS}), now pinned ${NOW}\n`);

console.log('## run A (primary)');
const runA = await runYears(SEED, YEARS, 'A');
console.log(`  ${runA.years} years in ${(runA.ms / 1000).toFixed(1)}s — final tick ${runA.finalTick} (${runA.years * 52} expected)\n`);

console.log('## isolated worker evidence (actual Node worker_threads; not browser timing)');
let isolatedWorker = null;
let isolatedWorkerError = null;
try {
  const fixture = buildFixture(SEED);
  const measured = await measureIsolatedAdvanceWorker({
    campaign: fixture.campaign,
    saves: fixture.saves,
    interval: 'one_year',
    commit: true,
    now: NOW,
    autoResolve: true,
  }, { customContent: {} });
  isolatedWorker = measured.evidence;
  console.log(
    `  cold ${isolatedWorker.timingsMs.coldStartToTerminal}ms · `
    + `request ${isolatedWorker.timingsMs.requestToTerminal}ms · `
    + `worker handler ${isolatedWorker.timingsMs.workerHandlerToTerminalPost}ms`,
  );
  console.log(
    `  transport ${isolatedWorker.runtime.transport} · `
    + `thread ${isolatedWorker.runtime.workerThreadId} · `
    + `${isolatedWorker.response.progressMessages} progress messages\n`,
  );
} catch (error) {
  isolatedWorkerError = error instanceof Error ? error.message : String(error);
  console.log(`  FAILED — ${isolatedWorkerError}\n`);
}

console.log('## assertions');
check(runA.finalTick === runA.years * 52, 'tick arithmetic', `finalTick ${runA.finalTick} == years×52`);
check(
  isolatedWorker?.nonVacuous === true,
  'actual isolated Node worker execution',
  isolatedWorker
    ? `worker thread ${isolatedWorker.runtime.workerThreadId} != main thread ${isolatedWorker.runtime.parentThreadId}`
    : isolatedWorkerError,
);
check(
  isolatedWorker?.response?.jsonSha256 === runA.firstResultSha256,
  'isolated worker output equals the direct domain path',
  isolatedWorker
    ? `${String(isolatedWorker.response.jsonSha256).slice(0, 12)} == ${String(runA.firstResultSha256).slice(0, 12)}`
    : 'no isolated-worker result',
);
check(
  isolatedWorker?.response?.progressMessages === 52
    && isolatedWorker?.response?.lastProgress?.ticksDone === 52,
  'isolated worker completed a non-vacuous one-year advance',
  isolatedWorker
    ? `${isolatedWorker.response.progressMessages} progress messages; final tick ${isolatedWorker.response.lastProgress?.ticksDone}/52`
    : 'no isolated-worker progress',
);

// 2. Byte-identical re-run (every year, not just the end state).
const runB = await runYears(SEED, YEARS, 'B');
const firstMismatch = runA.yearlyHashes.findIndex((h, i) => runB.yearlyHashes[i] !== h);
check(firstMismatch === -1, 'byte-identical re-run (same seed)',
  firstMismatch === -1 ? `all ${YEARS} yearly composite hashes equal` : `diverged at year ${firstMismatch + 1}`);

// 3. Divergence on a different seed (compared inside the window).
const runC = await runYears(`${SEED}-divergent`, DIVERGENCE_YEARS, 'C');
const diverged = runC.yearlyHashes.some((h, i) => h !== runA.yearlyHashes[i]);
check(diverged, 'divergence on a different seed', `within ${DIVERGENCE_YEARS} years`);

// Behavioral controls are deliberately sparse matrix probes, selected by the
// realm-scale plan. They are not hidden inside every cell: three release probes
// across two seed families and two scale bands are enough to test the control
// oracle without roughly doubling the long release soak.
let neighborControl = null;
if (NEIGHBOR_CONTROL_YEARS > 0) {
  console.log(`\n## neighbor perturbation control (${NEIGHBOR_CONTROL_YEARS} years)`);
  const perturbed = await runYears(
    SEED,
    NEIGHBOR_CONTROL_YEARS,
    'neighbor-perturbed',
    { variant: 'neighbor_perturbed' },
  );
  neighborControl = buildNeighborControl({
    baselineYearly: runA.yearlyBehavior.slice(0, NEIGHBOR_CONTROL_YEARS),
    perturbedYearly: perturbed.yearlyBehavior,
    sourceSettlementId: REGION[0].id,
  });
  const finalCheckpoint = neighborControl.checkpoints.at(-1);
  console.log(
    `  source ${REGION[0].id} +10% population; non-source distance `
    + `${Number(finalCheckpoint?.targetDistance || 0).toFixed(6)} at year `
    + `${finalCheckpoint?.year || 0}`,
  );
}

let darkControl = null;
if (RUN_DARK_CONTROL) {
  console.log('\n## all-dark control (one year)');
  const dark = await runYears(SEED, 1, 'dark-control', { variant: 'dark' });
  darkControl = buildDarkControl({
    litBaselineYear: runA.yearlyBehavior[0],
    darkYearly: dark.yearlyBehavior,
    finalWorldState: dark.finalWorldState,
  });
  console.log(
    `  lit activity ${darkControl.litBaselineActivityCount}; dark activity `
    + `${darkControl.darkActivityCount}; conditional leaks `
    + `${darkControl.conditionalStateLeaks.length}`,
  );
}

// 4. Population bounded.
const startTotal = runA.startPopulations.reduce((a, b) => a + b, 0);
const finalPops = runA.yearlyPopulations[runA.yearlyPopulations.length - 1];
const finalTotal = finalPops.reduce((a, b) => a + b, 0);
const everyAlive = runA.yearlyPopulations.every((pops) => pops.every((p) => Number.isFinite(p) && p > 0));
const ratio = startTotal > 0 ? finalTotal / startTotal : 0;
check(everyAlive, 'every settlement population finite and > 0, every year');
check(ratio > 0.05 && ratio < 20, 'realm population bounded',
  `${startTotal} → ${finalTotal} (×${ratio.toFixed(2)}; envelope 0.05–20)`);

// 4b. performance-scale-6 — the COST ENVELOPE. Serialized worldState+regionalGraph
// bytes are REPORTED per year and asserted under a documented per-settlement ceiling
// (the deterministic gate: a regression that reintroduces age-linear growth — an
// uncapped ledger, the queuedImpacts retention removed — blows through it). Wall-time
// is machine-tolerant: a generous per-year trend only, guarding against a cost
// explosion. NOTE: this whole-world soak advances by the ONE-YEAR interval, whose
// orchestrator collapses each year to a single pulseHistory record, so the history
// ring never saturates here and per-year growth stays broadly linear — the plateau /
// deceleration signature is asserted at WEEKLY granularity by the committed test
// tests/simulation/worldTickCostEnvelope.test.js, where the bounded ledgers engage.
const bytes = runA.yearlyBytes;
if (bytes.length >= 2) {
  const maxBytes = Math.max(...bytes);
  // Generous ceiling: the composed worldState is dominated by the per-year records +
  // the accumulating (retention-capped) impact/relationship ledgers; ~900KB/settlement
  // is a wide envelope over the measured ~150KB/settlement at 6y (≈385KB/settlement
  // extrapolated to 30y).
  const ceiling = 900_000 * SETTLEMENTS;
  check(maxBytes < ceiling, 'serialized state under the house envelope',
    `max ${(maxBytes / 1e6).toFixed(2)}MB < ${(ceiling / 1e6).toFixed(2)}MB (${SETTLEMENTS} settlements)`);
  // Wall-time trend (machine-tolerant — reported, generously bounded).
  const ms = runA.yearlyMs;
  const meanOf = (a, x, y) => { const s = a.slice(Math.floor(a.length * x), Math.floor(a.length * y)); return s.reduce((p, q) => p + q, 0) / Math.max(1, s.length); };
  const q1 = meanOf(ms, 0, 0.25);
  const q4 = meanOf(ms, 0.75, 1);
  check(q4 <= q1 * 8 + 50, 'per-year wall-time trend not age-linear',
    `Q1 ${q1.toFixed(1)}ms → Q4 ${q4.toFixed(1)}ms/year`);
  console.log(`\n## cost envelope (serialized worldState+regionalGraph bytes per year)`);
  console.log(`  ${bytes.map((b) => (b / 1e3).toFixed(0) + 'KB').join(' ')}`);
  console.log(`  max ${(maxBytes / 1e6).toFixed(2)}MB · final ${(bytes[bytes.length - 1] / 1e6).toFixed(2)}MB · ${(maxBytes / SETTLEMENTS / 1e3).toFixed(0)}KB/settlement`);
}

// 5. Stressor rhythm — REPORTED; the equilibrium tendency is a documented
// finding (the 2026-07-11 assessment), never a failure.
const counts = runA.yearlyStressorCounts;
const minC = Math.min(...counts);
const maxC = Math.max(...counts);
console.log(`\n## stressor rhythm (active stressors at each year end)`);
console.log(`  ${counts.join(' ')}`);
console.log(`  min ${minC} · max ${maxC} · final ${counts[counts.length - 1]}`);
const tail = 10;
const frozenTail = counts.length > tail
  && runA.yearlyHashes.slice(-tail).every((h) => h === runA.yearlyHashes[runA.yearlyHashes.length - 1]);
if (frozenTail) {
  console.log(`  FINDING (documented, not a failure): the composite state is FROZEN over the last ${tail} years —`);
  console.log('  the known equilibrium tendency under autoresolve (whole-sim assessment 2026-07-11). The world is a');
  console.log('  bounded deterministic clock that winds down; endogenous re-drama is precisely the Phase 5.5 spatial mandate.');
} else if (minC === maxC) {
  console.log(`  FINDING: stressor count held constant at ${minC} (rhythm flat, state still moving — check hashes).`);
} else {
  console.log('  stressors oscillated across the run (no permanent freeze at this horizon).');
}

console.log(`\n## population trajectory (per settlement, year 1 → ${YEARS})`);
REGION.forEach((r, i) => {
  const series = runA.yearlyPopulations.map((pops) => pops[i]);
  console.log(`  ${r.id} (${r.settType}): ${runA.startPopulations[i]} → ${series[series.length - 1]} (min ${Math.min(...series)}, max ${Math.max(...series)})`);
});

const receipt = {
  schemaVersion: 4,
  kind: 'whole_world_soak',
  ...(CASE_ID ? { caseId: CASE_ID } : {}),
  seed: SEED,
  years: YEARS,
  settlements: SETTLEMENTS,
  now: NOW,
  passed: failures.length === 0,
  properties: failures.length === 0
    ? [
        'no_crash',
        'rerun_identical',
        'seed_divergent',
        'population_bounded',
        'isolated_worker_executed',
        'isolated_worker_output_identical',
      ]
    : [],
  finalHash: runA.yearlyHashes[runA.yearlyHashes.length - 1],
  directFirstResultSha256: runA.firstResultSha256,
  stressorCounts: counts,
  startPopulations: runA.startPopulations,
  finalPopulations: finalPops,
  // performance-scale-6 cost series (the sim-report artifact for the tick axis).
  yearlyBytes: runA.yearlyBytes,
  yearlyRealmBytes: runA.yearlyRealmBytes,
  yearlyMs: runA.yearlyMs,
  finalRealmBytes: runA.finalRealmBytes,
  structuredCloneMs: runA.structuredCloneMs,
  isolatedWorker,
  isolatedWorkerError,
  heapUsedBytes: runA.heapUsedBytes,
  peakHeapUsedBytes: runA.peakHeapUsedBytes,
  realmScalingExercised: SETTLEMENTS === 30,
  behavioral: buildBehavioralObservation({
    settlementIds: REGION.map((settlement) => settlement.id),
    yearly: runA.yearlyBehavior,
    controls: {
      ...(neighborControl ? { neighbor: neighborControl } : {}),
      ...(darkControl ? { dark: darkControl } : {}),
    },
  }),
  runDurationsMs: {
    primary: runA.ms,
    replay: runB.ms,
    divergent: runC.ms,
  },
  ticksAdvanced: (
    (YEARS * 2)
    + DIVERGENCE_YEARS
    + (neighborControl ? NEIGHBOR_CONTROL_YEARS : 0)
    + (darkControl ? 1 : 0)
  ) * 52,
  frozenTail,
  failures,
  completedAt: new Date().toISOString(),
};

if (RECEIPT_PATH) {
  const file = resolve(String(RECEIPT_PATH));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(`\nreceipt: ${file}`);
}

if (AS_JSON) {
  console.log(`\n${JSON.stringify(receipt, null, 2)}`);
}

console.log(`\n${failures.length ? `FAILED: ${failures.join(', ')}` : `OK — all assertions green (${YEARS}y × 3 runs)`}`);
process.exit(failures.length ? 1 : 0);
