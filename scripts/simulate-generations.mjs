#!/usr/bin/env node
/**
 * simulate-generations.mjs — large-scale generation distribution + invariant probe.
 *
 * Runs N seeded generations across the full config space, stream-aggregating the
 * distribution of every meaningful aspect (numerics → n/min/max/mean/std/hist;
 * categoricals → frequency tables; list fields → element histograms), checking
 * HARD invariants (ranges, required fields, config echo, causal bands), and
 * capturing the engine's own self-reports (structuralViolations / coherenceNotes
 * / structuralSuggestions) plus runtime errors and console warnings.
 *
 * Parallel: the main process forks one worker per core; each worker handles a
 * contiguous index slice and writes a partial aggregate JSON. Aggregates are
 * associative, so the main merges them exactly. Memory-bounded (no settlement is
 * retained — only running stats).
 *
 *   node scripts/simulate-generations.mjs [N]            # default 100000
 *   node scripts/simulate-generations.mjs --worker <start> <count> <outfile> <total>
 */

import { fork } from 'node:child_process';
import { writeFileSync, readFileSync, rmSync, mkdtempSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import os from 'node:os';
import { tmpdir } from 'node:os';
import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';
import { deriveCausalState, SYSTEM_VARIABLES, CAUSAL_BANDS } from '../src/domain/causalState.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SELF = join(__dirname, 'simulate-generations.mjs');

// ── Config space ─────────────────────────────────────────────────────────────
const TIERS    = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'celtic', 'norse', 'mediterranean'];
const TERRAINS = ['grassland', 'forest', 'river', 'coastal', 'mountains', 'swamp'];
const TRADE    = ['road', 'river', 'port', 'crossroads', 'isolated', 'none'];
const THREAT   = ['safe', 'civilized', 'frontier', 'plagued'];
const MAGIC    = ['none', 'low', 'moderate', 'high'];
const CAUSAL_BAND_SET = new Set(CAUSAL_BANDS);

// Deterministic per-index config: round-robin tier (balanced coverage) + a tiny
// hash PRNG over the index for the other dimensions. seed varies per index so
// outputs vary (distribution), and the whole run is reproducible.
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function configForIndex(i) {
  const r = mulberry32(i * 2654435761 >>> 0);
  const pick = (arr) => arr[Math.floor(r() * arr.length)];
  return {
    settType: TIERS[i % TIERS.length],
    culture: pick(CULTURES),
    terrain: pick(TERRAINS),
    tradeRouteAccess: pick(TRADE),
    monsterThreat: pick(THREAT),
    magicLevel: pick(MAGIC),
  };
}

// ── Aggregator (mergeable) ───────────────────────────────────────────────────
function newAgg() {
  return {
    count: 0,
    numerics: {},     // key -> { n, sum, sumSq, min, max, hist:{bucket:count}, kind }
    categoricals: {},  // key -> { value: count }
    perTier: {},       // tier -> { numerics, categoricals }
    invariantFails: {},// name -> { count, examples:[{config,seed,detail}] }
    engine: { structuralViolationCounts: {}, structuralViolationSamples: {}, coherenceNoteCounts: {}, suggestionCounts: {} },
    errors: { count: 0, byType: {}, examples: [] },
    warnings: { count: 0, byType: {}, examples: [] },
    determinism: { checked: 0, mismatches: 0, examples: [] },
  };
}
function bucketFor(kind, v) {
  if (kind === 'score') return String(Math.min(100, Math.max(0, Math.floor(v / 10) * 10))); // 0,10,..,100
  if (kind === 'population') { if (v <= 0) return '0'; const e = Math.floor(Math.log10(v)); return `1e${e}`; }
  if (kind === 'count') return v <= 30 ? String(v) : '30+';
  // raw
  const f = Math.floor(v / 10) * 10; return String(f);
}
function addNumeric(agg, key, kind, v) {
  if (typeof v !== 'number' || !isFinite(v)) return;
  let m = agg.numerics[key];
  if (!m) m = agg.numerics[key] = { n: 0, sum: 0, sumSq: 0, min: Infinity, max: -Infinity, hist: {}, kind };
  m.n++; m.sum += v; m.sumSq += v * v; if (v < m.min) m.min = v; if (v > m.max) m.max = v;
  const b = bucketFor(kind, v); m.hist[b] = (m.hist[b] || 0) + 1;
}
function addCat(map, key, val) {
  if (val == null) val = '∅';
  const k = String(val);
  let m = map[key]; if (!m) m = map[key] = {}; m[k] = (m[k] || 0) + 1;
}
function tierBucket(agg, tier) {
  let t = agg.perTier[tier]; if (!t) t = agg.perTier[tier] = { numerics: {}, categoricals: {} }; return t;
}
function recordFail(agg, name, config, seed, detail) {
  let f = agg.invariantFails[name]; if (!f) f = agg.invariantFails[name] = { count: 0, examples: [] };
  f.count++; if (f.examples.length < 5) f.examples.push({ config, seed, detail });
}

// ── Per-settlement extraction + checks ──────────────────────────────────────
const num = (v) => (typeof v === 'number' && isFinite(v) ? v : undefined);
const arr = (v) => (Array.isArray(v) ? v : []);

function processSettlement(agg, s, config, seed) {
  agg.count++;
  const tier = s?.tier;
  const tAgg = tierBucket(agg, tier || 'unknown');

  // ── numerics (overall + per-tier) ──
  const N = (key, kind, v) => { addNumeric(agg, key, kind, v); addNumeric(tAgg, key, kind, v); };
  N('population', 'population', num(s.population));
  N('name_length', 'count', typeof s.name === 'string' ? s.name.length : undefined);
  const ds = s.defenseProfile?.scores || {};
  for (const k of ['military', 'monster', 'internal', 'economic', 'magical', 'disaster']) N(`defense.${k}`, 'score', num(ds[k]));
  N('legitimacy', 'score', num(s.powerStructure?.publicLegitimacy?.score));
  N('stability', 'raw', num(s.powerStructure?.stability));
  N('food_resilience', 'score', num(s.economicState?.foodSecurity?.resilienceScore));
  N('economic_complexity', 'raw', num(s.economicState?.economicComplexity));
  N('viability', 'raw', num(typeof s.economicViability === 'number' ? s.economicViability : s.economicViability?.score));
  // counts
  const counts = {
    npcs: arr(s.npcs).length,
    institutions: arr(s.institutions).length,
    factions_power: arr(s.powerStructure?.factions).length,
    factions_legacy: arr(s.factions).length,
    conditions: arr(s.activeConditions).length,
    stressors: arr(s.stressors).length || arr(s.stress).length,
    relationships: arr(s.relationships).length,
    history_events: arr(s.history?.historicalEvents).length,
    history_tensions: arr(s.history?.currentTensions).length,
    services: Object.values(s.availableServices || {}).reduce((a, v) => a + (Array.isArray(v) ? v.length : 0), 0),
    conflicts: arr(s.conflicts).length || arr(s.powerStructure?.conflicts).length,
    suggestions: arr(s.structuralSuggestions).length,
    violations: arr(s.structuralViolations).length,
    coherence_notes: arr(s.coherenceNotes).length,
    primary_exports: arr(s.economicState?.primaryExports).length,
    primary_imports: arr(s.economicState?.primaryImports).length,
    active_chains: arr(s.economicState?.activeChains).length,
  };
  for (const [k, v] of Object.entries(counts)) N(`count.${k}`, 'count', v);

  // ── categoricals (overall + per-tier) ──
  const C = (key, v) => { addCat(agg.categoricals, key, v); addCat(tAgg.categoricals, key, v); };
  C('tier', tier);
  C('culture', s.config?.culture);
  C('terrain', s.config?.terrain ?? s.config?.terrainType);
  C('trade', s.config?.tradeRouteAccess);
  C('threat', s.config?.monsterThreat);
  C('magic', s.config?.magicLevel);
  C('prosperity', s.economicState?.prosperity);
  C('legitimacy_label', s.powerStructure?.publicLegitimacy?.label);
  C('defense_readiness', s.defenseProfile?.readiness?.label ?? s.defenseProfile?.readiness);
  C('government', s.powerStructure?.government);

  // list-element histograms (overall only — bounded vocabularies)
  for (const inst of arr(s.institutions)) addCat(agg.categoricals, 'institution_category', inst?.category);
  for (const n of arr(s.npcs)) addCat(agg.categoricals, 'npc_importance', n?.importance);
  for (const c of arr(s.activeConditions)) addCat(agg.categoricals, 'condition_archetype', c?.archetype);
  for (const f of arr(s.powerStructure?.factions)) addCat(agg.categoricals, 'faction_category', f?.category);

  // causal state (14 vars: scores + bands)
  let causal = null;
  try { causal = deriveCausalState(s); } catch { /* recorded below */ }
  if (causal) {
    const vars = causal.variables || causal;
    for (const name of SYSTEM_VARIABLES) {
      const v = vars[name];
      if (v) {
        N(`causal.${name}`, 'score', num(v.score));
        C(`causal_band.${name}`, v.band);
        if (v.band && !CAUSAL_BAND_SET.has(v.band)) recordFail(agg, 'causal_band_unknown', config, seed, `${name}=${v.band}`);
      }
    }
  } else {
    recordFail(agg, 'causal_derive_threw', config, seed, '');
  }

  // ── engine self-reports ──
  for (const v of arr(s.structuralViolations)) {
    const key = typeof v === 'string' ? v.slice(0, 60) : (v?.type || v?.code || v?.rule || JSON.stringify(v).slice(0, 60));
    agg.engine.structuralViolationCounts[key] = (agg.engine.structuralViolationCounts[key] || 0) + 1;
    if (!agg.engine.structuralViolationSamples[key]) agg.engine.structuralViolationSamples[key] = { config, seed, value: typeof v === 'string' ? v : v };
    addCat(tAgg.categoricals, 'structural_violation', key); // per-tier breakdown to judge legitimacy vs bug
  }
  const sevKey = String(arr(s.structuralViolations).length);
  agg.engine.suggestionCounts[String(arr(s.structuralSuggestions).length)] = (agg.engine.suggestionCounts[String(arr(s.structuralSuggestions).length)] || 0) + 1;
  agg.engine.coherenceNoteCounts[String(arr(s.coherenceNotes).length)] = (agg.engine.coherenceNoteCounts[String(arr(s.coherenceNotes).length)] || 0) + 1;
  void sevKey;

  // ── HARD invariants ──
  if (!(num(s.population) > 0)) recordFail(agg, 'population_not_positive', config, seed, String(s.population));
  if (typeof s.name !== 'string' || !s.name.trim()) recordFail(agg, 'name_missing', config, seed, JSON.stringify(s.name));
  if (!TIERS.includes(tier)) recordFail(agg, 'tier_unknown', config, seed, String(tier));
  if (tier !== config.settType) recordFail(agg, 'tier_echo_mismatch', config, seed, `${tier}!=${config.settType}`);
  if (s.config?.culture && s.config.culture !== config.culture) recordFail(agg, 'culture_echo_mismatch', config, seed, `${s.config.culture}!=${config.culture}`);
  if (!s.economicState || typeof s.economicState !== 'object') recordFail(agg, 'economicState_missing', config, seed, '');
  if (!s.powerStructure || typeof s.powerStructure !== 'object') recordFail(agg, 'powerStructure_missing', config, seed, '');
  if (tier !== 'thorp' && arr(s.powerStructure?.factions).length < 1) recordFail(agg, 'nonthorp_no_factions', config, seed, tier);
  if (!s.economicState?.prosperity) recordFail(agg, 'prosperity_missing', config, seed, '');
  for (const k of ['military', 'monster', 'internal', 'economic', 'magical']) {
    const v = ds[k]; if (v != null && (typeof v !== 'number' || !isFinite(v) || v < 0 || v > 100)) recordFail(agg, `defense_${k}_out_of_range`, config, seed, String(v));
  }
  const lg = s.powerStructure?.publicLegitimacy?.score;
  if (lg != null && (!isFinite(lg) || lg < 0 || lg > 100)) recordFail(agg, 'legitimacy_out_of_range', config, seed, String(lg));
  const fr = s.economicState?.foodSecurity?.resilienceScore;
  if (fr != null && (!isFinite(fr) || fr < 0 || fr > 100)) recordFail(agg, 'food_resilience_out_of_range', config, seed, String(fr));
}

// ── Worker mode ──────────────────────────────────────────────────────────────
function runWorker(start, count, outfile) {
  const agg = newAgg();
  // capture console warnings/errors during generation
  const origWarn = console.warn, origError = console.error;
  let capturing = false;
  const cap = (level) => (...a) => {
    if (capturing) {
      const msg = a.map(x => (typeof x === 'string' ? x : (x && x.message) || JSON.stringify(x))).join(' ').slice(0, 200);
      agg.warnings.count++;
      const key = (level + ':' + msg).slice(0, 120);
      agg.warnings.byType[key] = (agg.warnings.byType[key] || 0) + 1;
      if (agg.warnings.examples.length < 10) agg.warnings.examples.push(key);
    }
  };
  console.warn = cap('warn'); console.error = cap('error');

  for (let k = 0; k < count; k++) {
    const i = start + k;
    const config = configForIndex(i);
    const seed = 'sim-' + i;
    capturing = true;
    try {
      const s = generateSettlementPipeline({ ...config }, null, { seed, customContent: {} });
      capturing = false;
      processSettlement(agg, s, config, seed);
      // light determinism probe: every 2000th, regenerate + compare JSON
      if (i % 2000 === 0) {
        const s2 = generateSettlementPipeline({ ...config }, null, { seed, customContent: {} });
        agg.determinism.checked++;
        if (JSON.stringify(s) !== JSON.stringify(s2)) {
          agg.determinism.mismatches++;
          if (agg.determinism.examples.length < 5) agg.determinism.examples.push({ config, seed });
        }
      }
    } catch (e) {
      capturing = false;
      agg.errors.count++;
      const key = (e && e.message ? e.message : String(e)).slice(0, 140);
      agg.errors.byType[key] = (agg.errors.byType[key] || 0) + 1;
      if (agg.errors.examples.length < 10) agg.errors.examples.push({ config, seed, error: key });
    }
  }
  console.warn = origWarn; console.error = origError;
  writeFileSync(outfile, JSON.stringify(agg));
}

// ── Merge ────────────────────────────────────────────────────────────────────
function mergeNumerics(into, from) {
  for (const [k, m] of Object.entries(from)) {
    let t = into[k]; if (!t) t = into[k] = { n: 0, sum: 0, sumSq: 0, min: Infinity, max: -Infinity, hist: {}, kind: m.kind };
    t.n += m.n; t.sum += m.sum; t.sumSq += m.sumSq; t.min = Math.min(t.min, m.min); t.max = Math.max(t.max, m.max);
    for (const [b, c] of Object.entries(m.hist)) t.hist[b] = (t.hist[b] || 0) + c;
  }
}
function mergeCats(into, from) {
  for (const [k, m] of Object.entries(from)) { let t = into[k] || (into[k] = {}); for (const [v, c] of Object.entries(m)) t[v] = (t[v] || 0) + c; }
}
function mergeCountMap(into, from) { for (const [k, c] of Object.entries(from)) into[k] = (into[k] || 0) + c; }
function mergeAgg(into, from) {
  into.count += from.count;
  mergeNumerics(into.numerics, from.numerics);
  mergeCats(into.categoricals, from.categoricals);
  for (const [tier, t] of Object.entries(from.perTier)) {
    const tt = into.perTier[tier] || (into.perTier[tier] = { numerics: {}, categoricals: {} });
    mergeNumerics(tt.numerics, t.numerics); mergeCats(tt.categoricals, t.categoricals);
  }
  for (const [name, f] of Object.entries(from.invariantFails)) {
    const t = into.invariantFails[name] || (into.invariantFails[name] = { count: 0, examples: [] });
    t.count += f.count; for (const ex of f.examples) if (t.examples.length < 5) t.examples.push(ex);
  }
  mergeCountMap(into.engine.structuralViolationCounts, from.engine.structuralViolationCounts);
  Object.assign(into.engine.structuralViolationSamples, from.engine.structuralViolationSamples);
  mergeCountMap(into.engine.coherenceNoteCounts, from.engine.coherenceNoteCounts);
  mergeCountMap(into.engine.suggestionCounts, from.engine.suggestionCounts);
  into.errors.count += from.errors.count; mergeCountMap(into.errors.byType, from.errors.byType);
  for (const ex of from.errors.examples) if (into.errors.examples.length < 20) into.errors.examples.push(ex);
  into.warnings.count += from.warnings.count; mergeCountMap(into.warnings.byType, from.warnings.byType);
  for (const ex of from.warnings.examples) if (into.warnings.examples.length < 20) into.warnings.examples.push(ex);
  into.determinism.checked += from.determinism.checked; into.determinism.mismatches += from.determinism.mismatches;
  for (const ex of from.determinism.examples) if (into.determinism.examples.length < 5) into.determinism.examples.push(ex);
}

// ── Finalize stats ───────────────────────────────────────────────────────────
function statify(m) {
  const mean = m.n ? m.sum / m.n : 0;
  const variance = m.n ? Math.max(0, m.sumSq / m.n - mean * mean) : 0;
  // approximate p5/p50/p95 from histogram cumulative (bucket lower edge)
  const buckets = Object.entries(m.hist).map(([b, c]) => [b, c]).sort((a, b2) => {
    const pa = parseFloat(a[0]); const pb = parseFloat(b2[0]); return (isNaN(pa) ? 0 : pa) - (isNaN(pb) ? 0 : pb);
  });
  const pct = (q) => { let acc = 0; const target = m.n * q; for (const [b, c] of buckets) { acc += c; if (acc >= target) return b; } return buckets.length ? buckets[buckets.length - 1][0] : null; };
  return { n: m.n, min: m.min === Infinity ? null : m.min, max: m.max === -Infinity ? null : m.max, mean: +mean.toFixed(2), std: +Math.sqrt(variance).toFixed(2), p5: pct(0.05), p50: pct(0.5), p95: pct(0.95), hist: m.hist, kind: m.kind };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--worker') {
    runWorker(parseInt(args[1], 10), parseInt(args[2], 10), args[3]);
    return;
  }
  const TOTAL = parseInt(args[0], 10) || 100000;
  const WORKERS = Math.max(1, Math.min(os.cpus().length - 1, 10));
  const chunk = Math.ceil(TOTAL / WORKERS);
  const dir = mkdtempSync(join(tmpdir(), 'sfsim-'));
  console.log(`Simulating ${TOTAL} generations across ${WORKERS} workers (chunk ${chunk})…`);
  const t0 = Date.now();

  await Promise.all(Array.from({ length: WORKERS }, (_, w) => new Promise((resolve, reject) => {
    const start = w * chunk;
    const count = Math.min(chunk, TOTAL - start);
    if (count <= 0) return resolve();
    const out = join(dir, `part-${w}.json`);
    const child = fork(SELF, ['--worker', String(start), String(count), out], { stdio: 'inherit' });
    child.on('exit', (code) => code === 0 ? resolve(out) : reject(new Error(`worker ${w} exited ${code}`)));
  })));

  const merged = newAgg();
  for (let w = 0; w < WORKERS; w++) {
    const out = join(dir, `part-${w}.json`);
    try { mergeAgg(merged, JSON.parse(readFileSync(out, 'utf8'))); } catch { /* worker produced nothing */ }
  }
  rmSync(dir, { recursive: true, force: true });

  // finalize
  const numerics = {}; for (const [k, m] of Object.entries(merged.numerics)) numerics[k] = statify(m);
  const perTier = {};
  for (const [tier, t] of Object.entries(merged.perTier)) {
    perTier[tier] = { numerics: {}, categoricals: t.categoricals };
    for (const [k, m] of Object.entries(t.numerics)) perTier[tier].numerics[k] = statify(m);
  }
  const report = {
    total: merged.count,
    durationSec: +((Date.now() - t0) / 1000).toFixed(1),
    errors: merged.errors,
    warnings: merged.warnings,
    determinism: merged.determinism,
    invariantFails: merged.invariantFails,
    engine: {
      structuralViolationCounts: merged.engine.structuralViolationCounts,
      structuralViolationSamples: merged.engine.structuralViolationSamples,
      suggestionCounts: merged.engine.suggestionCounts,
      coherenceNoteCounts: merged.engine.coherenceNoteCounts,
    },
    numerics,
    categoricals: merged.categoricals,
    perTier,
  };
  const outPath = join(__dirname, '..', 'sim-report.json');
  writeFileSync(outPath, JSON.stringify(report, null, 2));

  // console summary
  const fails = Object.entries(merged.invariantFails).sort((a, b) => b[1].count - a[1].count);
  console.log(`\n=== DONE: ${merged.count} generations in ${report.durationSec}s ===`);
  console.log(`errors: ${merged.errors.count} | warnings: ${merged.warnings.count} | determinism: ${merged.determinism.mismatches}/${merged.determinism.checked} mismatches`);
  console.log(`invariant failures: ${fails.length ? '' : 'NONE ✓'}`);
  for (const [name, f] of fails) console.log(`  ✗ ${name}: ${f.count}  e.g. ${JSON.stringify(f.examples[0])}`);
  const sv = Object.entries(merged.engine.structuralViolationCounts).sort((a, b) => b[1] - a[1]);
  console.log(`engine structuralViolations distinct: ${sv.length}`);
  for (const [k, c] of sv.slice(0, 15)) console.log(`  • ${k}: ${c}`);
  console.log(`\nFull report → ${outPath}`);
}

main().catch(e => { console.error('SIM FAILED:', e); process.exit(1); });
