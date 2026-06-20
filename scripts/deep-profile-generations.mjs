#!/usr/bin/env node
/**
 * deep-profile-generations.mjs — EXHAUSTIVE auto-profiler.
 *
 * Walks the ENTIRE settlement object for N seeded generations and records the
 * distribution of EVERY leaf path automatically (no hand-picked metrics):
 *   - numbers → n/min/max/mean/std/histogram
 *   - strings → frequency table (enum/short values verbatim; prose/long values
 *     bucketed by length-band so distinct-cardinality is captured without dumping
 *     content), distinct count, overflow
 *   - booleans → true/false counts
 *   - arrays → length distribution, plus elements profiled under `path[]`
 *   - presence → present / null / explicit-undefined counts per path (coverage)
 * Aggregated overall AND per tier. Parallel workers; associative merge.
 *
 *   node scripts/deep-profile-generations.mjs [N]            # default 50000
 *   node scripts/deep-profile-generations.mjs --worker <start> <count> <out>
 */

import { fork } from 'node:child_process';
import { writeFileSync, readFileSync, rmSync, mkdtempSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import os from 'node:os';
import { tmpdir } from 'node:os';
import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SELF = join(__dirname, 'deep-profile-generations.mjs');

// Config sweep — faithful to the generator's real contract (resolveConfig.js,
// resolveStress.js, terrainHelpers.js). The first version of this harness froze
// all five priority sliders at 50 and passed keys the engine ignores (magicLevel,
// a flavour `terrain`, a synthetic 'none' route, non-canonical threats), leaving
// the entire magic/religion/criminal/stress-gated half of the engine unexercised.
const TIERS    = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic','latin','celtic','arabic','norse','slavic','east_asian','mesoamerican','south_asian','steppe','greek']; // canonical 11 (resolveConfig)
const TERRAINS = ['plains','hills','forest','riverside','coastal','mountain','desert'];     // canonical 7 (terrainOverride values)
const ROUTES   = ['road','river','port','crossroads','isolated','mountain_pass'];            // real UI trade routes (ConfigurationPanel)
const THREATS  = ['heartland','frontier','plagued'];                                         // canonical (resolveConfig normalizes to these)
const STRESSES = ['under_siege','famine','occupied','politically_fractured','indebted','recently_betrayed','infiltrated','plague_onset','succession_void','monster_pressure','insurgency','religious_conversion','slave_revolt','wartime','mass_migration']; // STRESS_TYPE_MAP keys

const MAX_DEPTH = 9;
const MAX_KEYS = 500;     // per-string-path frequency cardinality cap
const STR_VERBATIM_MAX = 48; // strings longer than this are length-banded, not stored

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function configForIndex(i) {
  const r = mulberry32((i * 2654435761) >>> 0);
  const pick = (arr) => arr[Math.floor(r() * arr.length)];
  const cfg = {
    settType: TIERS[i % TIERS.length],
    culture: pick(CULTURES),
    monsterThreat: r() < 0.15 ? 'random_threat' : pick(THREATS),
    _randomizePriorities: true, // engine rolls each priority slider randInt(5,95) per seed (the UI "random" path)
  };
  // Terrain + route. 60%: let the engine weighted-roll terrain (all 7, incl.
  // mountain/desert/hills) and a terrain-appropriate route. 40%: pin an explicit
  // terrain + route so coverage is even and the mountain_pass route is exercised.
  if (r() < 0.6) {
    cfg.tradeRouteAccess = 'random_trade';
    cfg.terrainOverride  = 'auto';
  } else {
    cfg.terrainOverride  = pick(TERRAINS);
    cfg.tradeRouteAccess = pick(ROUTES);
  }
  // Stress. 30%: force a specific crisis so all 15 stress types + their gated
  // content (crime types, food_anchor_lost, severity bands, faction flags) are
  // exercised; else let generateStress roll (the realistic emergent distribution).
  if (r() < 0.3) cfg.stressTypes = [STRESSES[i % STRESSES.length]];
  return cfg;
}

// ── numeric accumulator ──
function newNum() { return { n: 0, sum: 0, sumSq: 0, min: Infinity, max: -Infinity, hist: {} }; }
function bucket(v) {
  if (Number.isInteger(v) && Math.abs(v) <= 64) return String(v);
  const a = Math.abs(v);
  if (a < 1) return String(Math.round(v * 10) / 10);
  if (a < 1000) return String(Math.floor(v / 10) * 10);
  const e = Math.floor(Math.log10(a));
  return (v < 0 ? '-' : '') + '1e' + e;
}
function addNum(s, v) { if (typeof v !== 'number' || !isFinite(v)) return; s.n++; s.sum += v; s.sumSq += v * v; if (v < s.min) s.min = v; if (v > s.max) s.max = v; const b = bucket(v); s.hist[b] = (s.hist[b] || 0) + 1; }
function lenBand(L) { if (L <= 80) return '49-80'; if (L <= 160) return '81-160'; if (L <= 400) return '161-400'; return '400+'; }

// ── recursive profiler ──
function profileValue(map, path, v, depth) {
  if (depth > MAX_DEPTH) return;
  let node = map[path]; if (!node) node = map[path] = { present: 0, nulls: 0, absent: 0, types: {} };
  if (v === undefined) { node.absent++; return; }
  node.present++;
  if (v === null) { node.nulls++; return; }
  if (Array.isArray(v)) {
    node.types.array = (node.types.array || 0) + 1;
    if (!node.arrLen) node.arrLen = newNum();
    addNum(node.arrLen, v.length);
    for (const el of v) profileValue(map, path + '[]', el, depth + 1);
    return;
  }
  const t = typeof v;
  node.types[t] = (node.types[t] || 0) + 1;
  if (t === 'number') { if (!node.num) node.num = newNum(); addNum(node.num, v); }
  else if (t === 'string') {
    if (!node.str) node.str = { freq: {}, overflow: 0 };
    const key = v.length > STR_VERBATIM_MAX ? `__len:${lenBand(v.length)}__` : v;
    if (node.str.freq[key] === undefined && Object.keys(node.str.freq).length >= MAX_KEYS) node.str.overflow++;
    else node.str.freq[key] = (node.str.freq[key] || 0) + 1;
  } else if (t === 'boolean') { if (!node.bool) node.bool = { true: 0, false: 0 }; node.bool[v ? 'true' : 'false']++; }
  else if (t === 'object') { for (const [k, val] of Object.entries(v)) profileValue(map, path + '.' + k, val, depth + 1); }
}

// ── worker ──
function runWorker(start, count, outfile) {
  const overall = {};
  const perTier = {}; for (const t of TIERS) perTier[t] = {};
  const errors = { count: 0, byType: {}, examples: [] };
  let warns = 0;
  const ow = console.warn, oe = console.error; console.warn = () => { warns++; }; console.error = () => { warns++; };
  for (let k = 0; k < count; k++) {
    const i = start + k;
    const config = configForIndex(i);
    try {
      const s = generateSettlementPipeline({ ...config }, null, { seed: 'dp-' + i, customContent: {} });
      profileValue(overall, '$', s, 0);
      const tm = perTier[s.tier] || (perTier[s.tier] = {});
      profileValue(tm, '$', s, 0);
    } catch (e) {
      errors.count++;
      const key = (e && e.message ? e.message : String(e)).slice(0, 140);
      errors.byType[key] = (errors.byType[key] || 0) + 1;
      if (errors.examples.length < 10) errors.examples.push({ config, seed: 'dp-' + i, error: key });
    }
  }
  console.warn = ow; console.error = oe;
  writeFileSync(outfile, JSON.stringify({ overall, perTier, errors, warns }));
}

// ── merge ──
function mergeNum(a, b) { if (!b) return a; if (!a) return JSON.parse(JSON.stringify(b)); a.n += b.n; a.sum += b.sum; a.sumSq += b.sumSq; a.min = Math.min(a.min, b.min); a.max = Math.max(a.max, b.max); for (const [k, c] of Object.entries(b.hist)) a.hist[k] = (a.hist[k] || 0) + c; return a; }
function mergeNode(a, b) {
  a.present += b.present; a.nulls += b.nulls; a.absent += b.absent;
  for (const [k, c] of Object.entries(b.types)) a.types[k] = (a.types[k] || 0) + c;
  if (b.num) a.num = mergeNum(a.num, b.num);
  if (b.arrLen) a.arrLen = mergeNum(a.arrLen, b.arrLen);
  if (b.bool) { a.bool = a.bool || { true: 0, false: 0 }; a.bool.true += b.bool.true; a.bool.false += b.bool.false; }
  if (b.str) {
    a.str = a.str || { freq: {}, overflow: 0 };
    for (const [k, c] of Object.entries(b.str.freq)) { if (a.str.freq[k] === undefined && Object.keys(a.str.freq).length >= MAX_KEYS) a.str.overflow += c; else a.str.freq[k] = (a.str.freq[k] || 0) + c; }
    a.str.overflow += b.str.overflow;
  }
}
function mergeMap(into, from) { for (const [path, node] of Object.entries(from)) { if (!into[path]) into[path] = { present: 0, nulls: 0, absent: 0, types: {} }; mergeNode(into[path], node); } }

// ── finalize: numeric stats + top-K string freqs ──
function finNum(s) { if (!s) return null; const mean = s.n ? s.sum / s.n : 0; const v = s.n ? Math.max(0, s.sumSq / s.n - mean * mean) : 0; return { n: s.n, min: s.min === Infinity ? null : s.min, max: s.max === -Infinity ? null : s.max, mean: +mean.toFixed(3), std: +Math.sqrt(v).toFixed(3), hist: s.hist }; }
function finNode(n) {
  const out = { present: n.present, nulls: n.nulls, absent: n.absent, types: n.types };
  if (n.num) out.num = finNum(n.num);
  if (n.arrLen) out.arrLen = finNum(n.arrLen);
  if (n.bool) out.bool = n.bool;
  if (n.str) {
    const entries = Object.entries(n.str.freq).sort((a, b) => b[1] - a[1]);
    out.str = { distinct: entries.length + (n.str.overflow > 0 ? 1 : 0), overflow: n.str.overflow, top: Object.fromEntries(entries.slice(0, 60)) };
  }
  return out;
}
function finMap(m) { const o = {}; for (const [p, n] of Object.entries(m)) o[p] = finNode(n); return o; }

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--worker') { runWorker(parseInt(args[1], 10), parseInt(args[2], 10), args[3]); return; }
  const TOTAL = parseInt(args[0], 10) || 50000;
  const WORKERS = Math.max(1, Math.min(os.cpus().length - 1, 10));
  const chunk = Math.ceil(TOTAL / WORKERS);
  const dir = mkdtempSync(join(tmpdir(), 'sfdp-'));
  console.log(`Deep-profiling ${TOTAL} generations across ${WORKERS} workers…`);
  const t0 = Date.now();
  await Promise.all(Array.from({ length: WORKERS }, (_, w) => new Promise((res, rej) => {
    const start = w * chunk, count = Math.min(chunk, TOTAL - start);
    if (count <= 0) return res();
    const out = join(dir, `p-${w}.json`);
    fork(SELF, ['--worker', String(start), String(count), out], { stdio: 'inherit' }).on('exit', c => c === 0 ? res() : rej(new Error('worker ' + w + ' exit ' + c)));
  })));
  const overall = {}; const perTier = {}; const errors = { count: 0, byType: {}, examples: [] }; let warns = 0;
  for (let w = 0; w < WORKERS; w++) {
    let part; try { part = JSON.parse(readFileSync(join(dir, `p-${w}.json`), 'utf8')); } catch { continue; }
    mergeMap(overall, part.overall);
    for (const [t, m] of Object.entries(part.perTier)) { perTier[t] = perTier[t] || {}; mergeMap(perTier[t], m); }
    errors.count += part.errors.count; for (const [k, c] of Object.entries(part.errors.byType)) errors.byType[k] = (errors.byType[k] || 0) + c;
    for (const ex of part.errors.examples) if (errors.examples.length < 20) errors.examples.push(ex);
    warns += part.warns;
  }
  rmSync(dir, { recursive: true, force: true });
  const report = { total: TOTAL, durationSec: +((Date.now() - t0) / 1000).toFixed(1), errors, warns, pathCount: Object.keys(overall).length, overall: finMap(overall), perTier: Object.fromEntries(Object.entries(perTier).map(([t, m]) => [t, finMap(m)])) };
  const outPath = join(__dirname, '..', 'deep-profile.json');
  writeFileSync(outPath, JSON.stringify(report, null, 1));
  console.log(`\nDONE: ${TOTAL} gens in ${report.durationSec}s | paths: ${report.pathCount} | errors: ${errors.count} | warns: ${warns}`);
  console.log(`Report → ${outPath} (${(JSON.stringify(report).length / 1024 / 1024).toFixed(1)} MB)`);
}
main().catch(e => { console.error('FAILED:', e); process.exit(1); });
