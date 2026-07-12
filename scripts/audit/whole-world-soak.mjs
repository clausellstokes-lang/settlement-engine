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
 *   5. STRESSOR RHYTHM — yearly active-stressor counts are REPORTED, and the
 *      known EQUILIBRIUM TENDENCY (the composed world winding down to stasis
 *      under autoresolve — the strategic argument FOR the spatial engine) is
 *      DOCUMENTED rather than failed: a frozen tail prints as a finding.
 *
 * Deterministic: seeded generation (options THIRD — the second argument is
 * importedNeighbour and now fail-closes on an options bag), pinned `now`,
 * pure kernel. Pure measurement; tunes nothing.
 *
 *   node scripts/audit/whole-world-soak.mjs [--years 30] [--seed w0-soak]
 *                                           [--divergence-years 5] [--json]
 *                                           [--seasons on|off]
 *
 * SEASONS-A: full_simulation now lights seasonsEnabled, so the default soak
 * runs the food year. `--seasons off` restores the pre-seasons variant for
 * A/B comparison; `--seasons on` is explicit. (One soak, flag-varied — never
 * a second soak script.)
 */

import { createHash } from 'node:crypto';
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
const SEASONS = String(arg('seasons', 'preset')); // 'on' | 'off' | preset default
const NOW = '2026-07-12T00:00:00.000Z'; // pinned — one instant for the whole soak

const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// ── Fixture: a generated 4-settlement region (mixed tiers, real economies) ───
const REGION = [
  { id: 'soak-a', settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'crossroads' },
  { id: 'soak-b', settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  { id: 'soak-c', settType: 'town', culture: 'celtic', terrain: 'coastal', tradeRouteAccess: 'port' },
  { id: 'soak-d', settType: 'village', culture: 'norse', terrain: 'mountains', tradeRouteAccess: 'road' },
];

function buildFixture(seed) {
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

  const campaign = {
    id: 'whole-world-soak',
    name: 'Whole-World Soak Realm',
    settlementIds: REGION.map((r) => r.id),
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.soak-a.soak-b', from: 'soak-a', to: 'soak-b', relationshipType: 'trade_partner' },
        { id: 'edge.soak-b.soak-c', from: 'soak-b', to: 'soak-c', relationshipType: 'rival' },
        { id: 'edge.soak-a.soak-c', from: 'soak-a', to: 'soak-c', relationshipType: 'neutral' },
        { id: 'edge.soak-c.soak-d', from: 'soak-c', to: 'soak-d', relationshipType: 'trade_partner' },
      ],
      channels: [
        channel(saves[0], saves[1]),
        channel(saves[2], saves[1]),
        channel(saves[1], saves[3]),
      ],
    }, { now: NOW }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: {
      rngSeed: seed,
      tick: 0,
      canonizedAt: NOW,
      // FULL SIMULATION — the §11 ceiling preset: war layer + strategy + faith
      // spread + (W0-A3) the eight war-depth sub-flags. The soak exercises the
      // deepest composed stack the control layer can turn on.
      simulationRules: {
        ...SIMULATION_RULE_PRESETS.full_simulation.rules,
        ...(SEASONS === 'on' ? { seasonsEnabled: true } : SEASONS === 'off' ? { seasonsEnabled: false } : {}),
      },
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
async function runYears(seed, years, label) {
  const { campaign, saves } = buildFixture(seed);
  let runningCampaign = campaign;
  let runningSaves = saves;
  const yearlyHashes = [];
  const yearlyStressorCounts = [];
  const yearlyPopulations = [];
  const t0 = Date.now();

  for (let year = 1; year <= years; year++) {
    const result = await simulateCampaignWorldInterval({
      campaign: runningCampaign,
      saves: runningSaves,
      interval: 'one_year',
      commit: true,
      now: NOW,
      autoResolve: true,
    });
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
  }

  return {
    label,
    seed,
    years,
    ms: Date.now() - t0,
    finalTick: runningCampaign.worldState.tick,
    yearlyHashes,
    yearlyStressorCounts,
    yearlyPopulations,
    startPopulations: buildFixture(seed).saves.map((s) => Number(s.settlement?.population) || 0),
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

console.log('## assertions');
check(runA.finalTick === runA.years * 52, 'tick arithmetic', `finalTick ${runA.finalTick} == years×52`);

// 2. Byte-identical re-run (every year, not just the end state).
const runB = await runYears(SEED, YEARS, 'B');
const firstMismatch = runA.yearlyHashes.findIndex((h, i) => runB.yearlyHashes[i] !== h);
check(firstMismatch === -1, 'byte-identical re-run (same seed)',
  firstMismatch === -1 ? `all ${YEARS} yearly composite hashes equal` : `diverged at year ${firstMismatch + 1}`);

// 3. Divergence on a different seed (compared inside the window).
const runC = await runYears(`${SEED}-divergent`, DIVERGENCE_YEARS, 'C');
const diverged = runC.yearlyHashes.some((h, i) => h !== runA.yearlyHashes[i]);
check(diverged, 'divergence on a different seed', `within ${DIVERGENCE_YEARS} years`);

// 4. Population bounded.
const startTotal = runA.startPopulations.reduce((a, b) => a + b, 0);
const finalPops = runA.yearlyPopulations[runA.yearlyPopulations.length - 1];
const finalTotal = finalPops.reduce((a, b) => a + b, 0);
const everyAlive = runA.yearlyPopulations.every((pops) => pops.every((p) => Number.isFinite(p) && p > 0));
const ratio = startTotal > 0 ? finalTotal / startTotal : 0;
check(everyAlive, 'every settlement population finite and > 0, every year');
check(ratio > 0.05 && ratio < 20, 'realm population bounded',
  `${startTotal} → ${finalTotal} (×${ratio.toFixed(2)}; envelope 0.05–20)`);

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

if (AS_JSON) {
  console.log(`\n${JSON.stringify({
    seed: SEED, years: YEARS, now: NOW,
    finalHash: runA.yearlyHashes[runA.yearlyHashes.length - 1],
    stressorCounts: counts,
    startPopulations: runA.startPopulations,
    finalPopulations: finalPops,
    frozenTail,
    failures,
  }, null, 2)}`);
}

console.log(`\n${failures.length ? `FAILED: ${failures.join(', ')}` : `OK — all assertions green (${YEARS}y × 3 runs)`}`);
process.exit(failures.length ? 1 : 0);
