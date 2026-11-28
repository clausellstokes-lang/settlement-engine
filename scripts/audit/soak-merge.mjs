#!/usr/bin/env node
/**
 * scripts/audit/soak-merge.mjs — THE MERGE DRIVER FOR SHARDED SOAK RUNS (lane SOAK-MERGE, 2026-11-07).
 *
 * A rung too large for one container runs as N shard runs of `scripts/audit/soak-review.mjs`
 * (`--from a --count b`: `--count` is the END index, exclusive), each on its own session. The
 * shards directory (≈ 71 MB per 1,000 settlements) never moves, so each shard PACKS what the
 * aggregate needs from it into a small, movable directory, and the chair MERGES the packs:
 *
 *   node scripts/audit/soak-merge.mjs --pack <shard-out>              (each shard, after its run)
 *   node scripts/audit/soak-merge.mjs --out <merged-out> <shard-out>... (the chair)
 *
 * The pack (`<shard-out>/merge-facts/`): per settlement the field walk's scalars, the chain
 * facts, the houses reading, the reader distributions and (where the run carries it) the
 * presumption share — every input of `aggregate.mjs` except the categorical counts and the
 * repetition payload — as gzipped JSON lines, one file set per worker residue (i mod W); and
 * the categorical counts summed per residue. Findings and the settlement facts are read from
 * the shard's own `findings.jsonl` and `settlements.jsonl`.
 *
 * The merge rebuilds every row and feeds `aggregate()` itself in the order ONE run of the
 * whole range on W workers reads its shards (worker files by name, each ascending), so every
 * table the aggregate computes from rows comes out as that run's: findings.jsonl,
 * settlements.jsonl, finding-classes, reader-observations, fields, field-bands, chains,
 * dependence-strong, dependence-residual and the STOP / CLIMB line. Then:
 *   - inner-categories: the residue counts summed in that same order, filtered as aggregate does;
 *   - declared-share (where the shards carry it): drawn and declared summed, the share recomputed;
 *   - repetition, repetition-prose: NOT mergeable from moved files (the per-town shares and the
 *     pairwise figure need every town's sentence hashes, which live only in the shards
 *     directory); each is written per shard, with the note, and run.json says so;
 *   - sample/: the union of the shards' dossiers.
 * Refuses: shards on different tips, different worker counts, overlapping or gapped ranges,
 * a shard not packed.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, gunzipSync } from 'node:zlib';

const SELF = fileURLToPath(import.meta.url);
const PACK_DIR = 'merge-facts';
const PART_ROWS = 1000;
const r3 = (x) => (x == null || !Number.isFinite(x) ? x : Math.round(x * 1000) / 1000);

export const REPETITION_NOTE = 'not mergeable from the moved files: the per-town shares and the pairwise figures need every town\'s sentence hashes, which live only in each shard\'s shards/ directory; reported per shard';

/** The order one run on `workers` workers reads its shard files: `shard-<w>.jsonl` sorted by name. */
export function residueOrder(workers) {
  return Array.from({ length: workers }, (_, w) => w).sort((a, b) => `shard-${a}.jsonl`.localeCompare(`shard-${b}.jsonl`));
}

const readJson = (p) => JSON.parse(readFileSync(p, 'utf-8'));
const lines = (p) => readFileSync(p, 'utf-8').split('\n').filter(Boolean);

/** A shard run's rows from its shards/ directory, as aggregate.mjs reads them (first copy of an index wins). */
function* shardRows(out) {
  const dir = join(out, 'shards'); const seen = new Set();
  for (const f of readdirSync(dir).sort()) {
    for (const l of readFileSync(join(dir, f), 'utf-8').split('\n')) {
      if (!l) continue;
      let row; try { row = JSON.parse(l); } catch { continue; }
      if (seen.has(row.i)) continue;
      seen.add(row.i); yield row;
    }
  }
}

/**
 * Pack one shard run for the merge.
 * @param {string} shardOut a complete soak-review output directory (shards/ present)
 * @returns {{ rows: number, bytes: number, workers: number }}
 */
export function packShard(shardOut) {
  const run = readJson(join(shardOut, 'run.json'));
  const workers = Number(run.args?.workers);
  if (!(workers > 0)) throw new Error(`${shardOut}/run.json names no worker count`);
  const dir = join(shardOut, PACK_DIR);
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) if (/^r\d+-/.test(f)) throw new Error(`${dir} already packed: pack into a fresh run`);
  const parts = new Map(); const cats = new Map(); const counts = new Map();
  let rows = 0; let bytes = 0;
  const flush = (w, force) => {
    const p = parts.get(w); if (!p || !p.buf.length || (!force && p.buf.length < PART_ROWS)) return;
    const gz = gzipSync(p.buf.join('')); bytes += gz.length;
    writeFileSync(join(dir, `r${w}-part-${String(p.n).padStart(4, '0')}.jsonl.gz`), gz);
    p.n += 1; p.buf = [];
  };
  for (const row of shardRows(shardOut)) {
    const w = row.i % workers;
    const fact = { i: row.i };
    if (row.features?.scalars !== undefined) fact.scalars = row.features.scalars;
    for (const k of ['chains', 'houses', 'reader', 'presumptions']) if (row[k] !== undefined) fact[k] = row[k];
    const p = parts.get(w) ?? { n: 0, buf: [] }; parts.set(w, p);
    p.buf.push(`${JSON.stringify(fact)}\n`); flush(w, false);
    counts.set(w, (counts.get(w) || 0) + 1); rows += 1;
    // The categorical counts, summed per residue in this shard's row order (aggregate.mjs, `cats`).
    const c = cats.get(w) ?? new Map(); cats.set(w, c);
    for (const [path, vs] of Object.entries(row.features?.cats || {})) { const byT = c.get(path) ?? {}; const t = (byT[row.tier] ??= {}); for (const [v, n] of Object.entries(vs)) t[v] = (t[v] || 0) + n; c.set(path, byT); }
  }
  for (const w of parts.keys()) flush(w, true);
  for (const [w, c] of cats) { const gz = gzipSync(JSON.stringify([...c])); bytes += gz.length; writeFileSync(join(dir, `r${w}-categories.json.gz`), gz); }
  writeFileSync(join(dir, 'pack.json'), `${JSON.stringify({ workers, rows, byResidue: Object.fromEntries([...counts].sort((a, b) => a[0] - b[0])), tip: run.tip, from: run.args?.from ?? 0, end: run.count }, null, 1)}\n`);
  return { rows, bytes, workers };
}

/** A shard's index range: [from, end). */
function rangeOf(run) { return [Number(run.args?.from ?? 0), Number(run.count)]; }

/**
 * Read and check the shards. Refuses on different tips or worker counts, overlap, a gap, a missing pack.
 * @param {string[]} shardDirs
 */
export function readShards(shardDirs) {
  if (!shardDirs.length) throw new Error('no shards');
  const shards = shardDirs.map((d) => {
    const dir = resolve(d); const run = readJson(join(dir, 'run.json'));
    if (!existsSync(join(dir, PACK_DIR, 'pack.json'))) throw new Error(`${d} is not packed: run soak-merge.mjs --pack ${d} first`);
    const pack = readJson(join(dir, PACK_DIR, 'pack.json'));
    const [from, end] = rangeOf(run);
    return { dir, run, pack, from, end };
  }).sort((a, b) => a.from - b.from);
  const tips = [...new Set(shards.map((s) => s.run.tip))];
  if (tips.length !== 1) throw new Error(`the shards ran on different tips: ${tips.join(', ')}`);
  const workers = [...new Set(shards.map((s) => s.pack.workers))];
  if (workers.length !== 1) throw new Error(`the shards ran on different worker counts: ${workers.join(', ')}`);
  for (let k = 0; k < shards.length; k += 1) {
    const s = shards[k];
    if (s.pack.rows !== s.end - s.from) throw new Error(`${s.dir}: ${s.pack.rows} rows packed for the range ${s.from}–${s.end}`);
    if (k === 0 && s.from !== 0) throw new Error(`the first shard starts at ${s.from}, not 0`);
    if (k > 0 && s.from !== shards[k - 1].end) throw new Error(`${s.from < shards[k - 1].end ? 'overlap' : 'gap'} between ${shards[k - 1].end} and ${s.from}`);
  }
  return { shards, tip: tips[0], workers: workers[0] };
}

/** One shard's rows of residue w, rebuilt as the soak worker wrote them (less the repetition payload). */
function* residueRows(shard, w) {
  const dir = join(shard.dir, PACK_DIR);
  const parts = readdirSync(dir).filter((f) => f.startsWith(`r${w}-part-`)).sort();
  if (!shard.byI) {
    // The settlement facts and the findings, once per shard (both are in this shard's run order).
    shard.byI = new Map(); for (const l of lines(join(shard.dir, 'settlements.jsonl'))) { const s = JSON.parse(l); shard.byI.set(s.i, s); }
    shard.findings = new Map();
    for (const l of lines(join(shard.dir, 'findings.jsonl'))) { const { seed, ...f } = JSON.parse(l); const a = shard.findings.get(seed) ?? []; a.push(f); shard.findings.set(seed, a); }
  }
  for (const part of parts) {
    for (const l of gunzipSync(readFileSync(join(dir, part))).toString('utf-8').split('\n')) {
      if (!l) continue;
      const fact = JSON.parse(l); const s = shard.byI.get(fact.i);
      if (!s) throw new Error(`${shard.dir}: index ${fact.i} packed but not in settlements.jsonl`);
      const row = {};
      for (const k of ['i', 'seed', 'tier', 'population', 'stressCell', 'matrix', 'hashes', 'rendered', 'replay', 'error']) if (s[k] !== undefined) row[k] = s[k];
      row.findings = shard.findings.get(s.seed) ?? [];
      if (fact.scalars !== undefined) row.features = { scalars: fact.scalars, cats: {} };
      for (const k of ['chains', 'houses', 'reader', 'presumptions']) if (fact[k] !== undefined) row[k] = fact[k];
      yield row;
    }
  }
}

/** Every row of the union, in the order one run of the whole range would read them. */
export function* mergedRows(shards, workers) {
  for (const w of residueOrder(workers)) for (const s of shards) yield* residueRows(s, w);
}

/** aggregate.mjs's inner-categories, over the residue counts summed in run order. */
export function mergedCategories(shards, workers) {
  const cats = new Map();
  for (const w of residueOrder(workers)) {
    for (const s of shards) {
      const p = join(s.dir, PACK_DIR, `r${w}-categories.json.gz`);
      if (!existsSync(p)) continue;
      for (const [path, byTs] of JSON.parse(gunzipSync(readFileSync(p)).toString('utf-8'))) {
        const byT = cats.get(path) ?? {};
        for (const [tier, vs] of Object.entries(byTs)) { const t = (byT[tier] ??= {}); for (const [v, n] of Object.entries(vs)) t[v] = (t[v] || 0) + n; }
        cats.set(path, byT);
      }
    }
  }
  return Object.fromEntries([...cats].filter(([, byT]) => Object.values(byT).some((t) => Object.keys(t).length <= 60)));
}

/** declared-share summed over the shards (null when any shard does not carry the table). */
export function mergedDeclaredShare(shards) {
  const files = shards.map((s) => join(s.dir, 'aggregates', 'declared-share.json'));
  if (!files.every((f) => existsSync(f))) return null;
  const out = {};
  for (const f of files) for (const [surface, v] of Object.entries(readJson(f))) { const t = (out[surface] ||= { drawn: 0, declared: 0, share: null }); t.drawn += v.drawn; t.declared += v.declared; }
  for (const t of Object.values(out)) t.share = t.drawn ? r3(t.declared / t.drawn) : null;
  return out;
}

/**
 * Merge packed shard runs into one output of a single run's shape.
 * @param {string[]} shardDirs
 * @param {string} outDir
 */
export async function mergeShards(shardDirs, outDir) {
  const started = Date.now();
  const { shards, tip, workers } = readShards(shardDirs);
  const out = resolve(outDir);
  if (existsSync(join(out, 'run.json'))) throw new Error(`${out} already holds a run: merge into a fresh --out`);
  // An empty shards/ beside the merge: a reader of `<out>/shards` (any later aggregate pass that
  // reads the directory directly) sees no rows rather than a missing directory.
  for (const d of ['shards', 'sample', 'aggregates']) mkdirSync(join(out, d), { recursive: true });
  const { aggregate } = await import('./soak-review/aggregate.mjs');
  const count = shards[shards.length - 1].end;
  const shardMeta = shards.map((s) => ({ dir: s.dir, from: s.from, end: s.end, tip: s.run.tip, settlements: s.run.settlements, durationMs: s.run.durationMs, verdict: s.run.verdict, reasons: s.run.reasons }));
  const meta = {
    count, tip, durationMs: shards.reduce((a, s) => a + (s.run.durationMs || 0), 0),
    args: { merged: true, workers, shards: shards.map((s) => s.run.args) },
  };
  const summary = aggregate(out, meta, () => mergedRows(shards, workers));
  // Every finding moved is a finding merged: a line whose seed no settlement row carries would
  // otherwise drop silently.
  const moved = shards.reduce((a, s) => a + lines(join(s.dir, 'findings.jsonl')).length, 0);
  const kept = lines(join(out, 'findings.jsonl')).length;
  if (kept !== moved) throw new Error(`${moved} findings in the shards, ${kept} merged`);
  // ── the tables aggregate cannot compute from the moved files, replaced
  writeFileSync(join(out, 'aggregates', 'inner-categories.json'), `${JSON.stringify(mergedCategories(shards, workers))}\n`);
  const perShard = (file) => ({ merged: false, note: REPETITION_NOTE, shards: shards.map((s) => ({ from: s.from, end: s.end, ...readJson(join(s.dir, 'aggregates', file)) })) });
  writeFileSync(join(out, 'aggregates', 'repetition.json'), `${JSON.stringify(perShard('repetition.json'), null, 1)}\n`);
  writeFileSync(join(out, 'aggregates', 'repetition-prose.json'), `${JSON.stringify(perShard('repetition-prose.json'), null, 1)}\n`);
  summary.proseRepetition = { merged: false, note: REPETITION_NOTE, shards: shards.map((s) => ({ from: s.from, end: s.end, ...s.run.proseRepetition })) };
  const declared = mergedDeclaredShare(shards);
  if (declared) { writeFileSync(join(out, 'aggregates', 'declared-share.json'), `${JSON.stringify(declared, null, 1)}\n`); summary.declaredShare = declared; }
  for (const s of shards) {
    const sd = join(s.dir, 'sample');
    if (existsSync(sd)) for (const f of readdirSync(sd)) copyFileSync(join(sd, f), join(out, 'sample', basename(f)));
  }
  summary.merge = { shards: shardMeta, workers, mergeMs: Date.now() - started, note: 'rows fed to aggregate.mjs in the order one run of the whole range on these workers reads them' };
  writeFileSync(join(out, 'run.json'), `${JSON.stringify(summary, null, 1)}\n`);
  return summary;
}

async function main(argv) {
  if (argv[0] === '--pack') {
    if (argv.length !== 2) throw new Error('usage: soak-merge.mjs --pack <shard-out>');
    const t = Date.now(); const r = packShard(resolve(argv[1]));
    console.log(`[soak-merge] packed ${r.rows} rows (${r.workers} residues) in ${Math.round((Date.now() - t) / 1000)}s: ${(r.bytes / 1e6).toFixed(1)} MB`);
    return;
  }
  if (argv[0] !== '--out' || argv.length < 3) throw new Error('usage: soak-merge.mjs --out <merged-out> <shard-out>...');
  const s = await mergeShards(argv.slice(2), argv[1]);
  console.log(`[soak-merge] merged ${s.merge.shards.length} shards in ${Math.round(s.merge.mergeMs / 1000)}s: ${s.settlements} settlements, ${s.findings} findings, ${s.errors} errors · ${s.verdict}`);
}

if (process.argv[1] && resolve(process.argv[1]) === SELF) {
  main(process.argv.slice(2)).catch((e) => { console.error('[soak-merge] fatal:', e.message); process.exitCode = 1; });
}
