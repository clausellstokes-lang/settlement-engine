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
 *   3. STORY-MIX DIVERGENCE on a different seed (run C's aggregate selected-
 *      event distribution differs materially from run A within the comparison
 *      window; composite hashes remain diagnostic and earn no claim);
 *   4. POPULATION BOUNDED — every settlement stays finite and > 0; the realm
 *      total stays within a generous envelope of its start (attractors, not
 *      runaways or death-spirals);
 *   5. BEHAVIORAL OBSERVATION — selected outcomes, mover families, event
 *      diversity, arc polarity, state motion, succession, causal composition,
 *      attention, and a bounded Chronicle sample are recorded for the
 *      predeclared realm-scale oracle. This cell does not choose its own bands.
 *   5b. WAR CONVERGENCE (WR-9d) — the deployment ledger is walked year over year
 *      as a war census, every close is classified through warEndingClassifier and
 *      banded through warDurationBandFor, and the result fills the WR-9 observation
 *      on the receipt. Only the instrument's own ARITHMETIC is asserted here (every
 *      counted war in exactly one duration cell, every close in exactly one ending
 *      cell); the envelopes themselves are unratified and are graded by the
 *      behavioral oracle, where they honestly fail at HEAD's flag state.
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
 *                                           [--rules-json <path>] [--lighting k=v,k=v]
 *                                           [--skip-divergence]
 *                                           [--checkpoint-every <years> --checkpoint-dir <dir>]
 *                                           [--restore-from <checkpoint.json>]
 *                                           [--source-sha <sha>]
 *
 * SEASONS-A: full_simulation now lights seasonsEnabled, so the default soak
 * runs the food year. `--seasons off` restores the pre-seasons variant for
 * A/B comparison; `--seasons on` is explicit. (One soak, flag-varied — never
 * a second soak script.)
 *
 * ── sk-a / SK-0 — THE HARNESS SEAMS (ODQ §141, §143; the soak-harness charter) ──
 * The one-soak law ("One soak, flag-varied — never a second soak script") means the
 * grid runner, the combinatorial flag sweep and the fix loop all reach the world
 * through THIS file. Four seams were added for them, and every decision each one
 * makes is a PURE FUNCTION in ./soakRules.mjs — this script runs on import, so a test
 * that imported it to pin a rule would execute a soak, which ODQ §145.2 forbids.
 *
 *   --rules-json / --lighting   a rules overlay, spread into `fullRules` ABOVE the
 *                               `darkRules` derivation (the charter's highest-risk law).
 *   --skip-divergence           run C is skipped; `properties` is COMPUTED so
 *                               `seed_divergent` is not claimed, the receipt records
 *                               the absence positively, and combining it with
 *                               --case-id is REFUSED.
 *   --checkpoint-every/-dir     year-boundary checkpoints for the fix loop.
 *   --restore-from              resume from one. A restored run is structurally
 *                               fix-loop-only: different receipt kind, empty
 *                               properties, no run B/C, no behavioral grading.
 *
 * ⛔ THIS FILE IS INSIDE `REALM_SCALE_SOURCE_PATHS`, so editing it MOVES the
 * certification aggregate's `sourceFingerprint` and `sourceIdentityMatches` will
 * refuse to rebind any pre-existing realm-scale evidence. That is DECLARED, not
 * silent, and it is why the §180.3a address-chain observation rides the same change.
 */

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { measureIsolatedAdvanceWorker } from './advance-worker-evidence.mjs';
import {
  buildCheckpoint,
  checkpointIdentity,
  checkpointIdentityMismatch,
  collectUndefinedKeyPaths,
  composeSoakRules,
  deepKeyCensus,
  parseLightingOverlay,
  replantUndefinedKeys,
  soakAdvanceEpoch,
  soakInvocationRefusals,
  soakProperties,
} from './soakRules.mjs';
import {
  buildBehavioralObservation,
  buildDarkControl,
  buildNeighborControl,
  buildSubsystemConfiguration,
  censusWorldStateKeys,
  observeBehavioralYear,
} from './behavioral-observation.mjs';
import {
  SOAK_RECEIPT_SCHEMA_VERSION,
} from '../../src/domain/certification/behavioralContract.js';
import {
  WAR_CONVERGENCE_SAMPLING,
  buildWarConvergenceObservation,
  observeWarConvergenceYear,
} from './war-convergence-collector.mjs';
import { buildWholeWorldSoakSpatialCanon } from './whole-world-soak-spatial-fixture.mjs';
import {
  buildStoryMixDivergenceEvidence,
  compareStoryMixDistributions,
} from './story-mix-divergence.mjs';
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

// ── sk-a / SK-0: THE HARNESS SEAMS (ODQ §141, §143; charter §0) ──────────────
// The one-soak law forbids a second soak script, so the grid, the flag sweep and
// the fix loop reach the world through THIS file. Every decision these seams make
// is a pure function in ./soakRules.mjs, because this script runs on import and a
// test that imported it to pin a rule would execute a soak.
const RULES_JSON = String(arg('rules-json', ''));
const LIGHTING = String(arg('lighting', ''));
const SKIP_DIVERGENCE = process.argv.includes('--skip-divergence');
const CHECKPOINT_EVERY_RAW = arg('checkpoint-every', null);
const CHECKPOINT_DIR = String(arg('checkpoint-dir', ''));
const RESTORE_FROM = String(arg('restore-from', ''));
// Source identity is CALLER-SUPPLIED, never read from git here: a soak runs inside
// a `git archive` extraction with no `.git`, where `git rev-parse` either throws or —
// if the archive was extracted inside some other repository — answers about the WRONG
// one at exit 0. The runner passes the archived tip sha it created.
const SOURCE_SHA = String(arg('source-sha', ''));

const lighting = parseLightingOverlay(LIGHTING);
const invocationRefusals = [
  ...soakInvocationRefusals({
    skipDivergence: SKIP_DIVERGENCE,
    caseId: CASE_ID,
    checkpointEvery: CHECKPOINT_EVERY_RAW,
    restoreFrom: RESTORE_FROM,
  }),
  ...lighting.refusals,
];
if (invocationRefusals.length) {
  for (const line of invocationRefusals) console.error(line);
  process.exit(2);
}

const CHECKPOINT_EVERY = CHECKPOINT_EVERY_RAW == null ? 0 : Number(CHECKPOINT_EVERY_RAW);
const RULES_OVERLAY = {
  ...(RULES_JSON ? JSON.parse(readFileSync(resolve(RULES_JSON), 'utf8')) : {}),
  ...lighting.overlay,
};

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

  // ⛔ THE OVERLAY APPLIES INTO `fullRules`, ABOVE the `darkRules` derivation — the
  // charter's highest-risk law, extracted whole into composeSoakRules so a test can
  // pin it without executing a soak. `darkRules` is derived FROM `fullRules`, so its
  // key set is `fullRules`'s key set; an overlay applied below would leave the new
  // keys ABSENT from the dark control, and absence is not falseness.
  const { fullRules, darkRules } = composeSoakRules({
    preset: SIMULATION_RULE_PRESETS.full_simulation.rules,
    seasons: SEASONS,
    overlay: RULES_OVERLAY,
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
      // The lit fixture is a real spatial canon: deterministic FMG-shaped capture
      // data authored through buildSpatialDigest. The explicit dark control strips
      // both marker and digest so its constitutional aspatial path remains honest.
      ...buildWholeWorldSoakSpatialCanon(saves, { enabled: variant !== 'dark' }),
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
async function runYears(seed, years, label, {
  variant = 'baseline',
  restore = null,
  checkpointEvery = 0,
  checkpointDir = '',
} = {}) {
  const fixture = buildFixture(seed, { variant });
  const { campaign, saves } = fixture;
  let runningCampaign = campaign;
  let runningSaves = saves;
  // ⛔ THE RESTORE SEAM. A checkpoint replaces the threaded state and the loop
  // resumes at the NEXT year boundary — the only checkpoint-complete seam the engine
  // exposes (SK.M6: PRNG stream position is closure state, interior-tick state lives
  // inside simulateCampaignWorldInterval, so a sub-year resume is unbuildable without
  // an engine edit, which would flip this family's no-src classification).
  let firstYear = 1;
  if (restore) {
    runningCampaign = restore.campaign;
    runningSaves = restore.saves;
    firstYear = Number(restore.identity.year) + 1;
  }
  const yearlyHashes = [];
  const yearlyStressorCounts = [];
  const yearlyPopulations = [];
  const yearlyDiedFlags = []; // remnant law 2026-07-31: a properly-died settlement legitimately holds zero
  // performance-scale-6: the cost axis — serialized worldState+regionalGraph bytes and
  // per-year wall-time, so a size/cost regression trends visibly and can be asserted.
  const yearlyBytes = [];
  const yearlyRealmBytes = [];
  const yearlyMs = [];
  const yearlyBehavior = [];
  // Envelope v5: the per-year worldState container census. A subsystem whose only
  // observable output is a sidecar ledger (the satellite lane, the one-regen
  // sidecars) leaves no candidate in `selected`, so without this census its
  // certification row could only ever read UNOBSERVED.
  const yearlyStateKeyCensus = [];
  // WR-9d: the war census, one record per year. The collector reads the composed
  // year result advanceInterval already returns — no engine surface changes and no
  // persisted state, which WR-9's lifecycle clause forbids.
  const yearlyWarConvergence = [];
  let firstResultSha256 = null;
  let peakHeapUsedBytes = process.memoryUsage().heapUsed;
  const t0 = Date.now();

  // ⛔ THE ADVANCE-EPOCH TERM, THREADED LIKE THE STORE THREADS IT (F1; soakRules.mjs's
  //    soakAdvanceEpoch carries the whole derivation and its rationale). The gate is read
  //    from the LIVE campaign's rules on every advance — exactly what
  //    `runAdvanceCampaignWorld` does — so a dark or legacy world threads null and composes
  //    the pre-wave seed character-for-character, while a LIT row can finally run at all.
  const advanceEpochs = [];
  for (let year = firstYear; year <= years; year++) {
    const beforeSaves = runningSaves;
    const rawWizardNewsById = new Map();
    const y0 = Date.now();
    const advanceEpoch = soakAdvanceEpoch({
      simulationRules: runningCampaign?.worldState?.simulationRules,
      seed,
      year,
    });
    advanceEpochs.push(advanceEpoch);
    const result = await simulateCampaignWorldInterval({
      campaign: runningCampaign,
      saves: runningSaves,
      interval: 'one_year',
      commit: true,
      now: NOW,
      autoResolve: true,
      advanceEpoch,
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
    yearlyStateKeyCensus.push(censusWorldStateKeys(result.worldState));
    yearlyWarConvergence.push(observeWarConvergenceYear({
      year,
      tick: result.worldState?.tick,
      result,
      saves: runningSaves,
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
    yearlyDiedFlags.push(runningSaves.map((s) => Number.isFinite(Number(s.settlement?.config?.lifecycleDiedAtTick))));
    yearlyBytes.push(JSON.stringify(result.worldState).length + JSON.stringify(result.regionalGraph).length);
    yearlyRealmBytes.push(JSON.stringify({
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      settlements: runningSaves.map((save) => save.settlement),
    }).length);
    peakHeapUsedBytes = Math.max(peakHeapUsedBytes, process.memoryUsage().heapUsed);

    // ── THE CHECKPOINT WRITER (§141.2). Year boundary only, and written AFTER the
    //    year's state is threaded, so the file is a complete year-N realm.
    //
    //    ⚠ THE KEY CENSUS IS TAKEN ON THE LIVE OBJECT, BEFORE `JSON.stringify`.
    //    That ordering is the whole anti-vacuity of the restore proof: the composite
    //    hash is itself JSON.stringify-based and is therefore BLIND to exactly the
    //    loss a JSON round trip causes (an `undefined`-valued key vanishes, hashes
    //    identically, and still changes `'k' in obj` inside the engine). Censusing
    //    after serialization on both sides would compare the instrument with itself.
    if (checkpointEvery > 0 && checkpointDir && year % checkpointEvery === 0) {
      const payload = { campaign: runningCampaign, saves: runningSaves };
      const identity = checkpointIdentity({
        year,
        seed,
        years,
        settlements: SETTLEMENTS,
        sourceSha: SOURCE_SHA,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        schemaVersion: SOAK_RECEIPT_SCHEMA_VERSION,
      });
      const file = resolve(join(checkpointDir, `checkpoint-year-${year}.json`));
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, `${JSON.stringify({
        ...buildCheckpoint({ identity, ...payload }),
        keyCensus: deepKeyCensus(payload),
        // The SK.U1 cure: the exact paths `JSON.stringify` is about to drop, so the
        // reader can re-plant them and the restored realm is the SAME realm rather
        // than one whose objects quietly lost keys.
        undefinedKeyPaths: collectUndefinedKeyPaths(payload),
      }, null, 2)}\n`);
      console.log(`  checkpoint year ${year}: ${file}`);
    }
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
    firstYear,
    ms: Date.now() - t0,
    finalTick: runningCampaign.worldState.tick,
    yearlyHashes,
    yearlyStressorCounts,
    yearlyPopulations,
    yearlyDiedFlags,
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
    yearlyStateKeyCensus,
    yearlyWarConvergence,
    // The per-advance epochs this run actually threaded, in year order. Reported so a
    // reader can see the flag was lit LAWFULLY rather than having to infer it from the
    // absence of a crash, and so the determinism comparison covers the stream identity
    // itself (the comparison surface is an EXCLUSION list, so this field is compared).
    advanceEpochs,
    // The EFFECTIVE rules this run carried (the preset spread plus any --seasons
    // override), recorded so the receipt states its configuration instead of
    // leaving a reader to infer it from the script.
    simulationRules: fixture.campaign.worldState.simulationRules,
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
// ⛔⛔ THE THIRD STATUS (§206.2b). An assertion whose PRECONDITION did not hold has not
//    failed — it did not run. Recording that as a FAIL is what put three dark-control
//    capsules on every rolling soak (RS-1 F2, RS-2 F2), each one a finding about the
//    instrument wearing a finding about the world.
//
//    ⭐ IT IS NOT A SOFTENED PASS, AND THE TWO LEDGERS ARE WHAT KEEPS IT HONEST: a
//    NOT-EXECUTABLE row goes on `notExecutable` and NEVER on `failures`, so it cannot red
//    the run — and it also never reaches `soakProperties`' executed input, so the property
//    the assertion would have EARNED is withheld. Silence and a claim are different
//    things, and the receipt states which one this is.
const notExecutables = [];
const notExecutable = (name, reason) => {
  console.log(`  NOT-EXECUTABLE  ${name}${reason ? ` — ${reason}` : ''}`);
  notExecutables.push({ name, reason: String(reason || '') });
};

console.log(`# whole-world soak — ${YEARS} years × ${REGION.length} settlements, seed "${SEED}", full_simulation preset (seasons ${SEASONS}), now pinned ${NOW}\n`);

// ── THE RESTORE PROBE (§141.2), STRUCTURALLY FIX-LOOP-ONLY ───────────────────
// A restored run may NEVER compute an official verdict (§141's refused-by-name list,
// generalized; SK.L4). That is enforced here by SHAPE rather than by discipline: this
// branch runs only the restored segment, writes a receipt of a different `kind` with
// an EMPTY properties array and a stated reason, and never reaches run B, run C, the
// isolated-worker evidence or the behavioral grading below.
if (RESTORE_FROM) {
  const checkpoint = JSON.parse(readFileSync(resolve(RESTORE_FROM), 'utf8'));
  const mismatches = checkpointIdentityMismatch(checkpoint.identity, {
    seed: SEED, settlements: SETTLEMENTS, sourceSha: SOURCE_SHA,
  });
  if (mismatches.length) {
    console.error('REFUSED: --restore-from names a checkpoint from a different world.');
    for (const line of mismatches) console.error(`  ${line}`);
    process.exit(2);
  }
  // ⛔ SK.U1's DIRECT SETTLEMENT. The census on the left was taken on the LIVE object
  // before serialization; this one is taken after `JSON.parse`. A difference is real
  // round-trip loss — the class the composite hash cannot see.
  const restoredPayload = { campaign: checkpoint.campaign, saves: checkpoint.saves };
  const replant = replantUndefinedKeys(restoredPayload, checkpoint.undefinedKeyPaths);
  const afterCensus = deepKeyCensus(restoredPayload);
  const beforeCensus = Array.isArray(checkpoint.keyCensus) ? checkpoint.keyCensus : [];
  const lost = beforeCensus.filter((key) => !afterCensus.includes(key));
  const gained = afterCensus.filter((key) => !beforeCensus.includes(key));
  console.log(`## restore probe — checkpoint year ${checkpoint.identity.year}, resuming to ${YEARS}`);
  console.log(`  undefined-key replant: ${replant.planted} planted, ${replant.unreachable.length} unreachable`);
  console.log(`  deep key census: ${beforeCensus.length} before, ${afterCensus.length} after; lost ${lost.length}, gained ${gained.length}`);
  for (const key of lost.slice(0, 10)) console.log(`  LOST   ${key}`);
  for (const key of gained.slice(0, 10)) console.log(`  GAINED ${key}`);
  const restored = await runYears(SEED, YEARS, 'restored', { restore: { ...checkpoint, ...restoredPayload } });
  console.log(`  years ${restored.firstYear}..${YEARS} in ${(restored.ms / 1000).toFixed(1)}s — final tick ${restored.finalTick}`);
  const probeBody = {
    schemaVersion: SOAK_RECEIPT_SCHEMA_VERSION,
    kind: 'whole_world_soak_restore_probe',
    seed: SEED,
    years: YEARS,
    settlements: SETTLEMENTS,
    now: NOW,
    restoredFromYear: checkpoint.identity.year,
    firstYear: restored.firstYear,
    yearlyHashes: restored.yearlyHashes,
    finalTick: restored.finalTick,
    keyCensusBefore: beforeCensus.length,
    keyCensusAfter: afterCensus.length,
    keyCensusLost: lost,
    keyCensusGained: gained,
    undefinedKeysReplanted: replant.planted,
    undefinedKeysUnreachable: replant.unreachable.length,
    properties: [],
    propertiesWithheld:
      'a restored run serves the FIX LOOP only — no official soak verdict, rung or '
      + 'phase-boundary run is ever computed from one (§141, generalized)',
    completedAt: new Date().toISOString(),
  };
  // The writer-side non-finite census, on the RESTORE path too — see the long note at the
  // main receipt. A probe receipt is read back from disk by exactly the same registry, so
  // leaving it uncensused would re-open the vacuity on one lifecycle path while closing it
  // on the other.
  const probeReceipt = { ...probeBody, nonFiniteFigures: findBadNumber(probeBody) };
  if (RECEIPT_PATH) {
    const file = resolve(String(RECEIPT_PATH));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `${JSON.stringify(probeReceipt, null, 2)}\n`);
    console.log(`\nreceipt: ${file}`);
  }
  if (AS_JSON) console.log(`\n${JSON.stringify(probeReceipt, null, 2)}`);
  const faithful = lost.length === 0 && gained.length === 0 && replant.unreachable.length === 0;
  console.log(`\n${faithful ? 'OK — the year-boundary JSON round trip is key-faithful' : 'ROUND-TRIP LOSS — see the census above'}`);
  process.exit(faithful ? 0 : 1);
}

console.log('## run A (primary)');
const runA = await runYears(SEED, YEARS, 'A', {
  checkpointEvery: CHECKPOINT_EVERY,
  checkpointDir: CHECKPOINT_DIR,
});
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
    // ⛔ THE SAME YEAR-1 EPOCH runA THREADED, and it must be the same one or the arm
    //    below is not the arm it claims to be. The isolate exists to prove the worker
    //    path and the direct domain path compose the IDENTICAL output hash; the epoch is
    //    a segment on the root seed, so an isolate carrying a different nonce would
    //    diverge for a reason that has nothing to do with isolation. (Without any epoch
    //    it would not diverge — it would throw, exactly as the direct path did.)
    advanceEpoch: soakAdvanceEpoch({
      simulationRules: fixture.campaign.worldState.simulationRules,
      seed: SEED,
      year: 1,
    }),
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

// 3. Different seeds must produce materially different STORY MIXES. A composite
// hash difference remains useful diagnostics, but it cannot earn seed_divergent:
// one altered draw anywhere in the world used to satisfy that weaker proof.
// ⛔ `--skip-divergence` MAKES THIS RUN CONDITIONAL, and the absence becomes a
// POSITIVE STATEMENT on the receipt rather than a gap a reader has to infer. The
// property array below is computed from what executed, so a skipped run cannot
// publish `seed_divergent` — the customer-facing clause certificationSchema.js reads
// as "told a different tale on a different seed". Combining the flag with --case-id
// is refused outright at parse time, so no realm-scale case receipt can exist without
// the property.
let runC = null;
let seedDivergence = {
  executed: false,
  reason: 'harness --skip-divergence',
  windowYears: DIVERGENCE_YEARS,
  baselineSeed: SEED,
  comparisonSeed: `${SEED}-divergent`,
};
if (!SKIP_DIVERGENCE) {
  runC = await runYears(`${SEED}-divergent`, DIVERGENCE_YEARS, 'C');
  const hashDiverged = runC.yearlyHashes.some((h, i) => h !== runA.yearlyHashes[i]);
  const storyMixDivergence = compareStoryMixDistributions(
    runA.yearlyBehavior.slice(0, DIVERGENCE_YEARS),
    runC.yearlyBehavior,
  );
  seedDivergence = {
    executed: true,
    ...buildStoryMixDivergenceEvidence({
      comparison: storyMixDivergence,
      windowYears: DIVERGENCE_YEARS,
      baselineSeed: SEED,
      comparisonSeed: `${SEED}-divergent`,
      hashDiverged,
    }),
  };
  const largestMixShift = storyMixDivergence.typeShifts[0];
  const mixEvidenceIssue = storyMixDivergence.invalidEntries[0];
  const mixDetail = `TV ${storyMixDivergence.totalVariationDistance.toFixed(3)} `
    + `(min ${storyMixDivergence.thresholds.minTotalVariationDistance.toFixed(2)}); `
    + `${storyMixDivergence.shiftedEventEquivalents.toFixed(2)} shifted event-equivalents `
    + `(min ${storyMixDivergence.thresholds.minShiftedEventEquivalents}); `
    + `largest shift ${largestMixShift?.type || 'none'} `
    + `(${Number(largestMixShift?.absoluteShareShift || 0).toFixed(3)}); `
    + `composite hash ${hashDiverged ? 'also differed' : 'did not differ'}`
    + (mixEvidenceIssue ? `; invalid evidence ${mixEvidenceIssue}` : '');
  // ⛔ §206.2b — THE PRECONDITION IS STATED BEFORE THE VERDICT IS READ. Below the sample
  // floor no world could pass this instrument, so the answer carries no information about
  // seeds; it is reported as NOT-EXECUTABLE and `seed_divergent` is withheld, rather than
  // banked as a failure and a capsule on every all-dark cell forever.
  if (!storyMixDivergence.executable) {
    notExecutable(
      'different seeds produce a divergent event-type mix',
      `${storyMixDivergence.notExecutableReason}; ${mixDetail}`,
    );
  } else {
    check(
      storyMixDivergence.passed,
      'different seeds produce a divergent event-type mix',
      mixDetail,
    );
  }
} else {
  console.log('  SKIPPED  divergence run C — --skip-divergence; seed_divergent is NOT claimed');
}

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
const everyAlive = runA.yearlyPopulations.every((pops, y) => pops.every((p, i) => Number.isFinite(p) && (p > 0 || Boolean(runA.yearlyDiedFlags?.[y]?.[i]))));
const ratio = startTotal > 0 ? finalTotal / startTotal : 0;
check(everyAlive, 'every settlement population finite and > 0 every year (remnants excepted: a properly-died settlement holds zero by law)');
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

// ── 6. WR-9 war convergence — the collector folds the per-year census into the
//    observation the behavioral oracle grades. The ENVELOPES are not asserted here
//    (they are unratified and honestly fail at HEAD's flag state); what IS asserted
//    is the instrument's own arithmetic: ruling N3 says every counted war lands in
//    exactly one duration cell and every closed war in exactly one ending cell, so
//    a collector that quietly dropped a war it could not read would red right here.
const warConvergenceCollected = buildWarConvergenceObservation({
  yearly: runA.yearlyWarConvergence,
});
const warCensus = warConvergenceCollected.census;
console.log('\n## war convergence (WR-9 instrument — envelopes graded by the behavioral oracle, not here)');
console.log(`  counted wars ${warCensus.countedWars} = closed ${warCensus.closedWars} + alive at horizon ${warCensus.aliveAtHorizonWars}`);
console.log(`  duration histogram ${JSON.stringify(warConvergenceCollected.observation.warDurationHistogram)} (sum ${warCensus.histogramSum})`);
console.log(`  endings mix ${JSON.stringify(warConvergenceCollected.observation.endingsMix)}`);
console.log(`  endings unclassified ${JSON.stringify(warCensus.unclassifiedReasons)} (${warCensus.unclassifiedEndings} of ${warCensus.closedWars} closes)`);
console.log(`  deciding terms ${JSON.stringify(warConvergenceCollected.observation.terminationDecidingTermHistogram)} — ${warCensus.decidingTermSamples} samples, ${WAR_CONVERGENCE_SAMPLING.decidingTermSample}`);
console.log(`  declared resolution: close ticks are ${WAR_CONVERGENCE_SAMPLING.closeTickResolution}-resolved from the ${WAR_CONVERGENCE_SAMPLING.censusSource}`);
console.log(`  wars ended by a road this collector does not observe: ${warCensus.unmeasuredFromUnobservedRoad} (counted, duration ${WAR_CONVERGENCE_SAMPLING.unobservedRoadDurationsAre}); ambiguous pairings: ${warCensus.unmeasuredFromAmbiguousPair}`);
check(warCensus.durationTotalityHolds, 'every counted war lands in exactly one duration band',
  `sum ${warCensus.histogramSum} === counted ${warCensus.countedWars}`);
check(warCensus.endingsTotalityHolds, 'every closed war lands in exactly one ending or one unclassified reason',
  `classified ${warCensus.classifiedEndings} + unclassified ${warCensus.unclassifiedEndings} === closes ${warCensus.closedWars}`);

const receiptBody = {
  // Envelope v5 ADDS the `subsystems` section below. Every v4 field keeps its
  // exact v4 meaning; consumers accept both versions
  // (SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS).
  schemaVersion: SOAK_RECEIPT_SCHEMA_VERSION,
  kind: 'whole_world_soak',
  ...(CASE_ID ? { caseId: CASE_ID } : {}),
  seed: SEED,
  years: YEARS,
  settlements: SETTLEMENTS,
  now: NOW,
  passed: failures.length === 0,
  // COMPUTED, never literal (annex SK.M3). `seed_divergent` is present only when the
  // divergence run actually executed — AND, since §206.2b, only when the instrument it
  // ran could have produced any answer at all. A run whose sample sat below the floor did
  // not measure seed coupling, so it does not publish the customer-facing clause
  // certificationSchema.js reads as "told a different tale on a different seed".
  properties: soakProperties({
    failures,
    seedDivergenceExecuted: seedDivergence.executed === true
      && seedDivergence.instrumentExecutable === true,
  }),
  // A-4 evidence, not just an earned-property label. The state-hash comparison
  // is retained here only to diagnose whether state also diverged; the verdict
  // comes exclusively from the selected-event distribution instrument above.
  seedDivergence,
  // WR-9's address-complete section, now MEASURED (WR-9d). The flag certification
  // rows stay unknown/UNOBSERVED — that arm is owner-held and is not this wave's —
  // so the oracle still honestly refuses the flag-coverage claim. The census beside
  // it publishes the instrument's own resolution and its two totality identities,
  // because a reading whose sampling nobody stated will be quoted at a precision it
  // does not have.
  warConvergence: warConvergenceCollected.observation,
  warConvergenceCensus: warCensus,
  finalHash: runA.yearlyHashes[runA.yearlyHashes.length - 1],
  // ⭐ THE PER-YEAR SEQUENCE, not only the end state. SK-1's determinism-under-workers
  // proof compares the full sequence because a mid-run divergence that RECONVERGES by
  // the horizon hides completely from a final-hash-only comparison. Two rows in
  // src/domain/certification/subsystemRowsPlace.js already ask for exactly this
  // ("must agree on finalHash and on every yearly composite hash") and could not have
  // it. ADDITIVE, and deliberately not a schema bump — the beliefDivergence precedent.
  yearlyHashes: runA.yearlyHashes,
  directFirstResultSha256: runA.firstResultSha256,
  // ⭐ F1 — THE ARGS-BORNE ADVANCE EPOCHS THIS RUN THREADED, one per composed advance, in
  // year order. A row lighting `advanceEpochEnabled` is now RUNNABLE, and the receipt
  // states that positively rather than leaving a reader to infer it from the absence of a
  // crash. Every entry is null on a dark or legacy world — the same flag-gated term the
  // store parks on its own pause cursor.
  advanceEpochs: runA.advanceEpochs,
  stressorCounts: counts,
  startPopulations: runA.startPopulations,
  finalPopulations: finalPops,
  // ⚠ THE REMNANT LAW, ON THE RECEIPT. A properly-died settlement legitimately holds
  // zero (the 2026-07-31 law this script's own `everyAlive` check already honours), so
  // any downstream population-collapse tripwire needs the died flags or it reports every
  // lawful death as a finding. They were computed and then discarded; now they ship.
  finalDiedFlags: (runA.yearlyDiedFlags[runA.yearlyDiedFlags.length - 1] || []).map(Boolean),
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
  // The per-subsystem certification input: which of the 46 boolean switches this
  // run carried, and which worldState containers it ever populated. Graded by
  // src/domain/certification/subsystemCertification.js.
  subsystems: buildSubsystemConfiguration({
    presetId: runA.simulationRules?.presetId,
    rules: runA.simulationRules,
    yearlyCensuses: runA.yearlyStateKeyCensus,
  }),
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
    divergent: runC ? runC.ms : null,
  },
  ticksAdvanced: (
    (YEARS * 2)
    + (runC ? DIVERGENCE_YEARS : 0)
    + (neighborControl ? NEIGHBOR_CONTROL_YEARS : 0)
    + (darkControl ? 1 : 0)
  ) * 52,
  frozenTail,
  failures,
  // §206.2b — the assertions whose PRECONDITION did not hold, stated POSITIVELY with the
  // reason on their face. A silent omission would read exactly like a pass; this reads
  // like what it is. Empty on every run where every instrument could execute.
  notExecutable: notExecutables,
  completedAt: new Date().toISOString(),
};

// ⛔⛔ THE NON-FINITE CENSUS IS TAKEN HERE, ON THE LIVE OBJECT, BECAUSE THIS IS THE LAST
//    MOMENT AT WHICH IT CAN BE TAKEN AT ALL (ODQ §213.3 member 3; RS-1 §7.4).
//
//    `JSON.stringify` writes `null` for `NaN` and for both infinities. The tripwire
//    registry's `non_finite_ledger_figure` row re-scanned a receipt READ BACK FROM DISK,
//    where every such figure had already become `null` — so the row could not fire on the
//    class it names, and its zero across 177 measured cells was a WEAK zero: not evidence
//    that no figure went non-finite, but evidence that nothing had been asked.
//
//    Moving the scan to the WRITER side makes it a real measurement. The figures are still
//    native numbers here, the paths are recorded as STRINGS, and strings survive the round
//    trip intact — so the registry reads a census that was taken where the truth was, and
//    a downstream reader gets the dotted path rather than an untraceable `null`.
//
//    ⚠ THE SOAK'S OWN PER-YEAR SCAN IS A DIFFERENT NET AND NEITHER REPLACES THE OTHER. It
//    walks worldState / regionalGraph / settlements and THROWS, so it never produces a
//    receipt at all; this one walks the RECEIPT — the aggregates, the cost series, the
//    behavioural fold, the worker timings — which that scan never sees.
const receipt = {
  ...receiptBody,
  nonFiniteFigures: findBadNumber(receiptBody),
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
// The not-executable ledger is printed BESIDE the verdict, never folded into it: a run
// that could not measure something is green AND has said so, which is a different report
// from a run where everything executed.
if (notExecutables.length) {
  console.log(`NOT EXECUTABLE (${notExecutables.length}): ${notExecutables.map((row) => row.name).join(', ')}`);
}
process.exit(failures.length ? 1 : 0);
