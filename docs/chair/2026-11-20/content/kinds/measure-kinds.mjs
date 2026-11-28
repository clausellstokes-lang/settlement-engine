#!/usr/bin/env node
/**
 * measure-kinds.mjs — lane KINDS-1, unit K0: THE INSTRUMENT AND THE BASELINE (a measure only; nothing under src/ or
 * tests/ is touched). Brief: docs/chair/2026-11-20/content/kinds/briefs/K0.md.
 *
 *   birth  <tree> <out.jsonl> [--force '<json>'] [--sizes a,b]
 *          Births THE VISITOR'S POOL from <tree>: 150 a size x (thorp hamlet village town city metropolis), seed
 *          `visitor-<size>-<i>`, each born exactly as measure-lit.mjs :: visitorJob births it (lane seat-7, copied, not
 *          imported): config `{ ...DEFAULT_CONFIG, settType, four toggle bags {}, _randomizePriorities: true }`, the
 *          content runtime options from the real custom-content slice, `loadGenerationLawPayloads()` first, then
 *          `generateSettlementPipeline({ ...birthConfig(config), ...FORCE }, null, { seed, ...runtimeOptions, onStep })`.
 *          `onStep` is the pipeline's own observer hook (generators/pipeline.js :: runPipeline calls it after each step;
 *          it returns nothing and is never read by a step): it snapshots the candidate reads at the history step
 *          (after `generatePopulation`, i.e. the ctx `generateNarratives` hands to `generateHistory`, and again after
 *          `generateNarratives`). The record's sha256-16 is checked unchanged by the hook (see `--nohook`).
 *          `--sizes` only splits the run across processes; concatenate the rows after the one meta row.
 *          `--plant '<json>'` (KINDS-1 K1, the chair's ruling of 21:33 UTC: THE TABLE IS A PARAMETER OF THE INSTRUMENT):
 *          births from a SCRATCH COPY of the tree's commit (`git archive <--rev, default the tree's HEAD>` into a dir
 *          under $TMPDIR, node_modules symlinked from the tree), with the named rows of `TROUBLE_WEIGHT_TUNING` in
 *          `src/domain/trouble/troubleLaw.js` rewritten IN THAT COPY ONLY (each row's text must be found exactly once;
 *          a receipt of the planted line is printed and kept in the meta row). Never a change under src/ of any
 *          checkout. Shape: `{"crimeWave":{"floor":0.05,"ceiling":0.55,"readLow":20,"readHigh":90}}` (any subset of
 *          a row's floor / ceiling / readLow / readHigh). The scratch copy is removed at the end.
 *   report <out.jsonl> [<other.jsonl>] [--table '<json>']
 *          Writes <name>.md and <name>.json beside the first jsonl; prints a short summary (<= 25 lines).
 *   compare <base.jsonl> <label>=<arm.jsonl> ... --out <out.md>
 *          (KINDS-1 K1) baseline | arm | arm ... side by side, six sizes: each kind over or near the bar (>= 30% of a
 *          size), the commonest first trouble and its share, crime_wave as FIRST trouble, crime_wave's rate in the
 *          bottom and top quarter of the crime read, guild_conflict's in the bottom and top quarter of the economy-power
 *          read (g2, pre-trim), troubles a place 0/1/2/3+, distinct kinds, and places whose count moved against the
 *          base (down / up, seeds for any up). Writes <out.md> and <out.json>; prints a short summary.
 */
import { mkdtempSync, rmSync, symlinkSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, resolve, dirname, basename } from 'node:path';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PER_SIZE = 150;
const fail = (m) => { console.error(`measure-kinds: ${m}`); process.exit(2); };
const flag = (args, name) => { const i = args.indexOf(name); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };

// ── the candidate reads, taken off a record-shaped object (ctx at the history step, or the final record) ────────────
const NAME_RULE = (n) => { n = (n || '').toLowerCase(); return n.includes('fence') || n.includes('smuggl') || n.includes('bandit') || n.includes('outlaw'); };
function readsOf(institutions, economicState, factions) {
  const insts = Array.isArray(institutions) ? institutions : [];
  const facs = Array.isArray(factions) ? factions : [];
  const ce = economicState?.compound?.criminalEffective;
  return {
    crime: typeof ce === 'number' && Number.isFinite(ce) ? ce : null,
    hasCriminal: insts.some((i) => i.priorityCategory === 'criminal'),
    nameRule: insts.some((i) => NAME_RULE(i.name)),
    g1: insts.filter((i) => (i.tags || []).includes('guild')).length,
    g2: facs.filter((f) => f.category === 'economy').length,
    factions: facs.length,
    institutions: insts.length,
  };
}

// ── birth ───────────────────────────────────────────────────────────────────────────────────────────────────────────
// ── --plant: the table as a parameter, planted in a scratch copy only ───────────────────────────────────────────────
const LEAF_REL = 'src/domain/trouble/troubleLaw.js';
const PLANT_FIELDS = ['floor', 'ceiling', 'readLow', 'readHigh'];
function plantedTree(tree, rev, plant) {
  const sha = execSync(`git rev-parse --verify ${JSON.stringify(`${rev}^{commit}`)}`, { cwd: tree, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  const dir = mkdtempSync(join(tmpdir(), 'measure-kinds-plant-'));
  execSync(`git archive ${sha} | tar -x -C ${JSON.stringify(dir)}`, { cwd: tree, stdio: ['ignore', 'ignore', 'inherit'], shell: '/bin/sh' });
  symlinkSync(realpathSync(join(tree, 'node_modules')), join(dir, 'node_modules'));
  const leafPath = join(dir, LEAF_REL);
  let text = readFileSync(leafPath, 'utf8');
  const receipt = [];
  for (const [name, values] of Object.entries(plant)) {
    const re = new RegExp(`^(\\s*${name}: Object\\.freeze\\(\\{[^\\n]*\\}\\),)$`, 'gm');
    const hits = text.match(re) || [];
    if (hits.length !== 1) { rmSync(dir, { recursive: true, force: true }); fail(`--plant: the row ${name} was found ${hits.length} times in ${LEAF_REL} at ${sha} (want exactly 1)`); }
    let line = hits[0];
    for (const [field, value] of Object.entries(values)) {
      if (!PLANT_FIELDS.includes(field) || typeof value !== 'number' || !Number.isFinite(value)) { rmSync(dir, { recursive: true, force: true }); fail(`--plant: ${name}.${field} = ${JSON.stringify(value)} is not a plantable figure`); }
      const fre = new RegExp(`(\\b${field}: )(-?[0-9.]+)`);
      if (!fre.test(line)) { rmSync(dir, { recursive: true, force: true }); fail(`--plant: ${name}.${field} not found on its row`); }
      line = line.replace(fre, `$1${value}`);
    }
    text = text.replace(hits[0], line);
    receipt.push({ row: name, before: hits[0].trim(), after: line.trim() });
  }
  writeFileSync(leafPath, text);
  for (const r of receipt) console.log(`measure-kinds plant @${sha.slice(0, 9)}: ${r.row}\n  before: ${r.before}\n  after:  ${r.after}`);
  return { dir, sha, receipt };
}

async function birth(args) {
  const forceJson = flag(args, '--force') ?? '{}';
  const plantJson = flag(args, '--plant');
  const revArg = flag(args, '--rev') ?? 'HEAD';
  const sizesCsv = flag(args, '--sizes');
  const noHook = args.includes('--nohook'); if (noHook) args.splice(args.indexOf('--nohook'), 1);
  const [treeArg, outPath] = args;
  if (!treeArg || !outPath) fail('usage: birth <tree> <out.jsonl> [--force json] [--sizes a,b]');
  const TREE = resolve(treeArg);
  const planted = plantJson ? plantedTree(TREE, revArg, JSON.parse(plantJson)) : null;
  const T = planted ? planted.dir : TREE;
  const imp = (p) => import(join(T, p));
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
  const { createCustomContentSlice } = await imp('src/store/customContentSlice.js');
  const { settlementContentRuntimeOptions } = await imp('src/store/settlementContentRuntime.js');
  const { eligibleCustomContent } = await imp('src/domain/customContentSchema.js');
  const { contentRuntimeFromCampaignBinding } = await imp('src/domain/content/contentEnvironment.js');
  const FORCE = JSON.parse(forceJson);
  await loadGenerationLawPayloads();
  const visitorJob = (size, i) => {
    const config = {
      ...DEFAULT_CONFIG, settType: size,
      _institutionToggles: {}, _categoryToggles: {}, _goodsToggles: {}, _servicesToggles: {},
      _randomizePriorities: true,
    };
    let st;
    const slice = createCustomContentSlice(() => {}, () => st);
    st = { ...slice, activeCampaignId: null, campaigns: [], config: { ...DEFAULT_CONFIG, settType: size }, configExplicitFields: {} };
    const runtime = settlementContentRuntimeOptions(st, contentRuntimeFromCampaignBinding, eligibleCustomContent);
    return { size, seed: `visitor-${size}-${i}`, config, options: runtime };
  };
  let sha = planted ? planted.sha : null;
  if (!planted) try { sha = execSync('git rev-parse HEAD', { cwd: T, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { /* not a checkout */ }
  const sizes = sizesCsv ? sizesCsv.split(',') : SIZES;
  const lines = [JSON.stringify({ meta: { tree: planted ? `${TREE} @${sha} (git archive, planted copy)` : T, sha, force: FORCE, sizes, perSize: PER_SIZE, hook: !noHook, ...(planted ? { plant: JSON.parse(plantJson), plantReceipt: planted.receipt } : {}) } })];
  const t0 = Date.now();
  for (const size of sizes) {
    for (let i = 0; i < PER_SIZE; i++) {
      const job = visitorJob(size, i);
      const rec = { seed: job.seed, size };
      const snap = {};
      const onStep = (name, ctx) => {
        if (name === 'generatePopulation' || name === 'generateNarratives') {
          snap[name] = readsOf(ctx.institutions, ctx.economicState, ctx.powerStructure?.factions);
          if (name === 'generateNarratives') snap.viability = !!ctx.economicViability; // generateNarratives provides it, before generateHistory
        }
      };
      let t;
      try {
        t = generateSettlementPipeline({ ...birthConfig(job.config), ...FORCE }, null, noHook ? { seed: job.seed, ...job.options } : { seed: job.seed, ...job.options, onStep });
      } catch (e) { rec.error = String(e?.stack || e).split('\n').slice(0, 3).join(' | '); lines.push(JSON.stringify(rec)); continue; }
      rec.hash = createHash('sha256').update(JSON.stringify(t)).digest('hex').slice(0, 16);
      rec.calm = !t.stress;
      rec.tensions = (t.history?.currentTensions || []).map((x) => x.type);
      rec.final = readsOf(t.institutions, t.economicState, t.powerStructure?.factions);
      rec.atHistory = snap.generatePopulation ?? null;
      rec.afterNarratives = snap.generateNarratives ?? null;
      rec.viability = snap.viability ?? null;
      lines.push(JSON.stringify(rec));
    }
  }
  writeFileSync(outPath, lines.join('\n') + '\n');
  if (planted) rmSync(planted.dir, { recursive: true, force: true });
  console.log(`measure-kinds birth: ${lines.length - 1} places (${sizes.join(',')}) in ${((Date.now() - t0) / 1000).toFixed(1)} s -> ${outPath}`);
}

// ── report ──────────────────────────────────────────────────────────────────────────────────────────────────────────
function load(path) {
  const rows = readFileSync(path, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const metas = rows.filter((r) => r.meta).map((r) => r.meta);
  return { path, metas, places: rows.filter((r) => !r.meta) };
}
const pct = (n, d) => (d ? (100 * n / d) : NaN);
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : '—');
const f0 = (x) => (Number.isFinite(x) ? x.toFixed(0) : '—');
// percentile: linear interpolation between closest ranks (p in 0..1 over the sorted present values)
function quantile(sorted, p) {
  if (!sorted.length) return NaN;
  const h = (sorted.length - 1) * p; const lo = Math.floor(h); const hi = Math.ceil(h);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (h - lo);
}
const READS = { crime: 'criminalEffective', g1: 'guild-tagged institutions', g2: 'economy-category powers' };
const readOf = (p, k) => p.atHistory?.[k] ?? null; // the reads the law will see: the ctx handed to generateHistory

function spreadOf(places, k) {
  const v = places.map((p) => readOf(p, k)).filter((x) => x !== null).sort((a, b) => a - b);
  const counts = new Map(); for (const x of v) counts.set(x, (counts.get(x) || 0) + 1);
  let mode = null; let modeN = 0; for (const [x, n] of counts) if (n > modeN) { mode = x; modeN = n; }
  return { n: v.length, missing: places.length - v.length, min: v[0], p10: quantile(v, 0.1), p25: quantile(v, 0.25), median: quantile(v, 0.5), p75: quantile(v, 0.75), p90: quantile(v, 0.9), max: v[v.length - 1], iqr: quantile(v, 0.75) - quantile(v, 0.25), mode, modeShare: pct(modeN, v.length) };
}
// quarters by RANK: the present values sorted ascending, ties broken by seed index (i of visitor-<size>-<i>), then cut
// into four equal-count quarters (rank r of n goes to quarter floor(4r/n)); so a run of tied values that straddles a
// cut is split across the two quarters by seed order, and every quarter holds n/4 places.
const seedIdx = (s) => Number(String(s).split('-').pop());
function quartersOf(places, k) {
  const v = places.filter((p) => readOf(p, k) !== null).sort((a, b) => (readOf(a, k) - readOf(b, k)) || (seedIdx(a.seed) - seedIdx(b.seed)));
  const q = [[], [], [], []]; v.forEach((p, r) => q[Math.floor(4 * r / v.length)].push(p));
  return q;
}
function summarize(places) {
  const out = {};
  for (const size of SIZES) {
    const P = places.filter((p) => p.size === size && !p.error);
    if (!P.length) continue;
    const n = P.length;
    const cnt = [0, 0, 0, 0]; for (const p of P) cnt[Math.min(3, p.tensions.length)]++;
    const any = new Map(); const first = new Map();
    for (const p of P) { for (const t of new Set(p.tensions)) any.set(t, (any.get(t) || 0) + 1); if (p.tensions[0]) first.set(p.tensions[0], (first.get(p.tensions[0]) || 0) + 1); }
    const kinds = [...any.keys()].sort((a, b) => any.get(b) - any.get(a) || a.localeCompare(b));
    let topFirst = null; let topFirstN = 0; for (const [t, c] of first) if (c > topFirstN || (c === topFirstN && t < topFirst)) { topFirst = t; topFirstN = c; }
    const byQuarter = {};
    for (const kind of ['crime_wave', 'guild_conflict']) {
      byQuarter[kind] = {};
      for (const k of Object.keys(READS)) {
        const Q = quartersOf(P, k);
        byQuarter[kind][k] = Q.map((qq) => ({ n: qq.length, hit: qq.filter((p) => p.tensions.includes(kind)).length, lo: qq.length ? readOf(qq[0], k) : null, hi: qq.length ? readOf(qq[qq.length - 1], k) : null }));
      }
    }
    // the same, among only the places where the law-1 gate is reached: the crime coin (hasCriminal & viability) for
    // crime_wave x crime; the guild swap (g1 > 0) for guild_conflict x g1 and g2. Quartiles re-taken within that subset.
    const gated = {
      crime_wave: { crime: P.filter((p) => p.atHistory?.hasCriminal && p.viability) },
      guild_conflict: { g1: P.filter((p) => (p.atHistory?.g1 || 0) > 0), g2: P.filter((p) => (p.atHistory?.g1 || 0) > 0) },
    };
    const byQuarterGated = {};
    for (const [kind, o] of Object.entries(gated)) { byQuarterGated[kind] = {}; for (const [k, G] of Object.entries(o)) byQuarterGated[kind][k] = quartersOf(G, k).map((qq) => ({ n: qq.length, hit: qq.filter((p) => p.tensions.includes(kind)).length, lo: qq.length ? readOf(qq[0], k) : null, hi: qq.length ? readOf(qq[qq.length - 1], k) : null })); }
    const spread = {}; for (const k of Object.keys(READS)) spread[k] = spreadOf(P, k);
    out[size] = {
      n, errors: places.filter((p) => p.size === size && p.error).length, calm: P.filter((p) => p.calm).length,
      count: cnt, kindsAny: Object.fromEntries(kinds.map((t) => [t, any.get(t)])), kindsFirst: Object.fromEntries([...first].sort((a, b) => b[1] - a[1])),
      distinct: kinds.length, topFirst, topFirstN,
      hasCriminal: P.filter((p) => p.atHistory?.hasCriminal).length, nameRule: P.filter((p) => p.atHistory?.nameRule).length,
      hasGuild: P.filter((p) => (p.atHistory?.g1 || 0) > 0).length, viability: P.filter((p) => p.viability).length,
      byQuarter, byQuarterGated, spread,
    };
  }
  return out;
}
// does the read at the history step equal the read on the final record? (and the bracket after generateNarratives)
function drift(places) {
  const keys = ['crime', 'hasCriminal', 'nameRule', 'g1', 'g2', 'factions', 'institutions'];
  const res = {};
  for (const k of keys) {
    const atVsFinal = places.filter((p) => !p.error && p.atHistory && p.atHistory[k] !== p.final[k]);
    const atVsAfter = places.filter((p) => !p.error && p.atHistory && p.afterNarratives && p.atHistory[k] !== p.afterNarratives[k]);
    const bySize = {}; for (const p of atVsFinal) bySize[p.size] = (bySize[p.size] || 0) + 1;
    res[k] = { atVsFinal: atVsFinal.length, atVsAfterNarratives: atVsAfter.length, bySize, examples: atVsFinal.slice(0, 3).map((p) => `${p.seed}: ${JSON.stringify(p.atHistory[k])} -> ${JSON.stringify(p.final[k])}`) };
  }
  return res;
}
function chance(row, read) {
  if (read === null || read === undefined) return (row.floor + row.ceiling) / 2;
  const x = Math.min(1, Math.max(0, (read - row.readLow) / (row.readHigh - row.readLow)));
  return row.floor + (row.ceiling - row.floor) * x;
}
function tableArith(places, table) {
  const out = {};
  for (const size of SIZES) {
    const P = places.filter((p) => p.size === size && !p.error); if (!P.length) continue;
    const crimeP = P.filter((p) => p.atHistory?.hasCriminal && p.viability);
    const guildP = P.filter((p) => (p.atHistory?.g1 || 0) > 0);
    const gk = table.guild?.read || 'g1';
    const mean = (A, f) => (A.length ? A.reduce((s, p) => s + f(p), 0) / A.length : NaN);
    const law1Crime = 0.5; const law1Guild = 0.3;
    out[size] = {
      crimeCoinReached: crimeP.length, crimeMeanChance: table.crime ? mean(crimeP, (p) => chance(table.crime, readOf(p, 'crime'))) : NaN, crimeLaw1: law1Crime,
      guildSwapReached: guildP.length, guildMeanChance: table.guild ? mean(guildP, (p) => chance(table.guild, readOf(p, gk))) : NaN, guildLaw1: law1Guild,
      smallRuleFires: ['thorp', 'hamlet', 'village'].includes(size) ? P.filter((p) => p.atHistory?.nameRule && p.calm).length : 0,
      smallPlaceCrime: table.smallPlaceCrime ?? NaN,
    };
  }
  return out;
}

function report(args) {
  const tableJson = flag(args, '--table');
  const [aPath, bPath] = args;
  if (!aPath) fail('usage: report <out.jsonl> [<other.jsonl>] [--table json]');
  const A = load(aPath); const B = bPath ? load(bPath) : null;
  const sa = summarize(A.places); const sb = B ? summarize(B.places) : null;
  const dr = drift(A.places);
  const table = tableJson ? JSON.parse(tableJson) : null;
  const ta = table ? tableArith(A.places, table) : null;
  // the hook check: rows born with --nohook (if any jsonl given carries them) compared by seed
  const moves = {};
  if (B) {
    const bySeed = new Map(B.places.map((p) => [p.seed, p]));
    for (const size of SIZES) {
      const m = { down: 0, up: 0, same: 0, upSeeds: [], changedHash: 0, changedKinds: 0 };
      for (const p of A.places.filter((x) => x.size === size && !x.error)) {
        const q = bySeed.get(p.seed); if (!q || q.error) continue;
        if (q.hash !== p.hash) m.changedHash++;
        if (JSON.stringify(q.tensions) !== JSON.stringify(p.tensions)) m.changedKinds++;
        if (q.tensions.length < p.tensions.length) m.down++; else if (q.tensions.length > p.tensions.length) { m.up++; m.upSeeds.push(`${p.seed} (${p.tensions.length}->${q.tensions.length}${p.calm ? ', calm' : ''})`); } else m.same++;
      }
      moves[size] = m;
    }
  }
  const sizes = SIZES.filter((s) => sa[s]);
  const L = [];
  const lbl = (s) => (B ? `${s} (law 1 | law 2)` : s);
  const both = (fa, fb) => (B ? `${fa} | ${fb}` : fa);
  L.push(`# KINDS-1 K0 — the trouble kinds by size${B ? ' (two pools side by side)' : ''}`, '');
  L.push(`Pool: ${A.metas.map((m) => `tree \`${m.tree}\` sha \`${m.sha}\` force \`${JSON.stringify(m.force)}\` sizes ${m.sizes.join(',')}`).join('; ')}.`);
  if (B) L.push(`Second: ${B.metas.map((m) => `tree \`${m.tree}\` sha \`${m.sha}\` force \`${JSON.stringify(m.force)}\``).join('; ')}.`);
  L.push('', '## Where each candidate read is taken', '');
  L.push('- **crime** = `economicState.compound.criminalEffective` (`generateEconomy` writes `compound`; present on the record at every size, see "lacks" below). **hasCriminal** = any institution with `priorityCategory === \'criminal\'` (`historyGenerator.js :: buildHistoricalEvent`\'s `hasCriminal`). **nameRule** = an institution name holding fence / smuggl / bandit / outlaw (the small-place rule (c)).');
  L.push('- **g1** = institutions whose `tags` include `\'guild\'` (`buildHistoricalEvent`\'s `hasGuild` is g1 > 0). **g2** = `powerStructure.factions` with `category === \'economy\'` (the power\'s category field is `category`, written by `powerGenerator.js`; values economy / military / religion / magic / criminal / ...).');
  L.push('- Every read is taken TWICE: at the history step (the pipeline\'s own `onStep` observer after `generatePopulation`, i.e. the ctx `steps/generateNarratives.js` then hands to `generateHistory` -> `buildHistoricalEvent`; bracketed again after `generateNarratives`) and on the FINAL record. The figures below use the history-step read (what the law will see). The hook leaves the record unchanged (sha256 of the record, checked).', '');
  L.push('| read | places where history-step != final | by size | history-step != after-narratives | examples |', '|---|---|---|---|---|');
  for (const [k, d] of Object.entries(dr)) L.push(`| ${k} | ${d.atVsFinal} | ${Object.entries(d.bySize).map(([s, n]) => `${s} ${n}`).join(', ') || '—'} | ${d.atVsAfterNarratives} | ${d.examples.join('; ') || '—'} |`);
  L.push('', 'Why the roster read moves (read from the pipeline, no src change): `steps/generateNarratives.js` calls `generateHistory` on the ctx as it stands after `generatePopulation` (only `boughtFishRowsInPlace` / the resource analysis write `economicState.primaryImports` and `availableServices` in place first; `compound` and the institutions are untouched, as the bracket column shows). AFTER history, `steps/assembleSettlement.js` runs the density law `resizePoliticalRoster` (ODQ §810 seam 1b) on `powerStructure`: it resizes the faction roster to the tier\'s band, so the FINAL record\'s `powerStructure.factions` (hence g2) can differ from the PRE-TRIM roster `buildHistoricalEvent` was given; the institutions and `economicState.compound` reach the final record as history saw them (0 drift). A law reading g2 must read the pre-trim roster (what it is handed), never the final record\'s.', '');
  L.push('## Troubles a place (0 / 1 / 2 / 3+), count and share', '', '| size | n | calm | 0 | 1 | 2 | 3+ | distinct kinds | commonest first |', '|---|---|---|---|---|---|---|---|---|');
  for (const s of sizes) {
    const row = (x) => { const c = x.count; return [x.n, x.calm, ...c.map((k) => `${k} (${f0(pct(k, x.n))}%)`), x.distinct, `${x.topFirst} ${f1(pct(x.topFirstN, x.n))}%`]; };
    const ra = row(sa[s]); const rb = sb?.[s] ? row(sb[s]) : null;
    L.push(`| ${lbl(s)} | ${ra.map((v, i) => both(v, rb ? rb[i] : '')).join(' | ')} |`);
  }
  if (B) {
    L.push('', '## Trouble COUNT moved (second pool against first, by seed)', '', '| size | down | up | same | record hash changed | kinds list changed | UP (a finding) |', '|---|---|---|---|---|---|---|');
    for (const s of sizes) { const m = moves[s]; L.push(`| ${s} | ${m.down} | ${m.up} | ${m.same} | ${m.changedHash} | ${m.changedKinds} | ${m.upSeeds.join('; ') || '—'} |`); }
  }
  L.push('', '## Each kind\'s share of places (any position) and as FIRST trouble', '');
  for (const s of sizes) {
    const x = sa[s]; const y = sb?.[s];
    const kinds = [...new Set([...Object.keys(x.kindsAny), ...Object.keys(y?.kindsAny || {})])];
    L.push(`**${s}** (n ${x.n}; distinct ${both(x.distinct, y?.distinct ?? '')}): ` + kinds.map((t) => `${t} ${both(f1(pct(x.kindsAny[t] || 0, x.n)), y ? f1(pct(y.kindsAny[t] || 0, y.n)) : '')}% / first ${both(f1(pct(x.kindsFirst[t] || 0, x.n)), y ? f1(pct(y.kindsFirst[t] || 0, y.n)) : '')}%`).join('; '), '');
  }
  L.push('## Rate by QUARTER of each candidate read (crime_wave, guild_conflict)', '');
  L.push('Quarters by RANK within the size: present values sorted ascending, ties broken by seed index, cut into four equal counts (rank r of n -> quarter floor(4r/n)); a run of tied values at a cut is SPLIT by seed order, so the quarters of an integer read (g1, g2) can share a value (the range of each quarter is shown). Places lacking the read are left out.', '');
  for (const kind of ['crime_wave', 'guild_conflict']) {
    L.push(`### ${kind}`, '', '| size | read | Q1 (bottom) | Q2 | Q3 | Q4 (top) |', '|---|---|---|---|---|---|');
    const pooled = {};
    for (const s of sizes) for (const k of Object.keys(READS)) {
      const qa = sa[s].byQuarter[kind][k]; const qb = sb?.[s]?.byQuarter[kind][k];
      pooled[k] ??= { a: [[0, 0], [0, 0], [0, 0], [0, 0]], b: [[0, 0], [0, 0], [0, 0], [0, 0]] };
      qa.forEach((q, i) => { pooled[k].a[i][0] += q.hit; pooled[k].a[i][1] += q.n; });
      qb?.forEach((q, i) => { pooled[k].b[i][0] += q.hit; pooled[k].b[i][1] += q.n; });
      L.push(`| ${s} | ${k} | ${qa.map((q, i) => `${both(f0(pct(q.hit, q.n)), qb ? f0(pct(qb[i].hit, qb[i].n)) : '')}% [${f0(q.lo)}–${f0(q.hi)}]`).join(' | ')} |`);
    }
    for (const k of Object.keys(READS)) { const pa = pooled[k].a; const pb = pooled[k].b; L.push(`| ALL (place-weighted) | ${k} | ${both(f1(pct(pa[0][0], pa[0][1])), B ? f1(pct(pb[0][0], pb[0][1])) : '')}% | | | ${both(f1(pct(pa[3][0], pa[3][1])), B ? f1(pct(pb[3][0], pb[3][1])) : '')}% |`); }
    L.push('');
  }
  L.push('### The same, among the places where the law-1 gate is REACHED (quartiles re-taken within them)', '', 'crime_wave x crime among hasCriminal & viability (the crime coin, (a)); guild_conflict x g1 / g2 among g1 > 0 (the guild swap, (b)).', '', '| size | kind x read | reached | Q1 | Q2 | Q3 | Q4 |', '|---|---|---|---|---|---|---|');
  for (const s of sizes) for (const [kind, o] of Object.entries(sa[s].byQuarterGated)) for (const [k, qa] of Object.entries(o)) { const qb = sb?.[s]?.byQuarterGated[kind][k]; L.push(`| ${s} | ${kind} x ${k} | ${both(qa.reduce((a, q) => a + q.n, 0), qb ? qb.reduce((a, q) => a + q.n, 0) : '')} | ${qa.map((q, i) => `${both(f0(pct(q.hit, q.n)), qb ? f0(pct(qb[i].hit, qb[i].n)) : '')}% [${f0(q.lo)}–${f0(q.hi)}]`).join(' | ')} |`); }
  L.push('');
  L.push('## Each candidate read\'s spread (history-step value)', '', '| size | read | min | p10 | p25 | median | p75 | p90 | max | IQR | modal value (share) | lacks |', '|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const s of sizes) for (const k of Object.keys(READS)) { const v = sa[s].spread[k]; L.push(`| ${s} | ${k} | ${f1(v.min)} | ${f1(v.p10)} | ${f1(v.p25)} | ${f1(v.median)} | ${f1(v.p75)} | ${f1(v.p90)} | ${f1(v.max)} | ${f1(v.iqr)} | ${f1(v.mode)} (${f0(v.modeShare)}%) | ${v.missing} |`); }
  L.push('', 'Percentiles: linear interpolation between closest ranks. Gate reach at the history step (places): ' + sizes.map((s) => `${s} hasCriminal ${sa[s].hasCriminal}, viability ${sa[s].viability}, hasGuild ${sa[s].hasGuild}, nameRule ${sa[s].nameRule}`).join('; ') + '.', '');
  const gWin = {}; for (const s of ['city', 'metropolis']) if (sa[s]) { const a = sa[s].spread.g1; const b = sa[s].spread.g2; gWin[s] = { g1: { iqr: a.iqr, modeShare: a.modeShare }, g2: { iqr: b.iqr, modeShare: b.modeShare }, variesMore: (b.iqr > a.iqr || (b.iqr === a.iqr && b.modeShare < a.modeShare)) ? 'g2' : 'g1' }; }
  L.push('## Which guild read varies more (city, metropolis)', '', ...Object.entries(gWin).map(([s, w]) => `- ${s}: g1 IQR ${f1(w.g1.iqr)}, modal share ${f0(w.g1.modeShare)}% | g2 IQR ${f1(w.g2.iqr)}, modal share ${f0(w.g2.modeShare)}% -> **${w.variesMore}** varies more`), '');
  if (ta) {
    L.push('## `--table` arithmetic (mean chance over the pool\'s own history-step reads; no birth)', '', `Table: \`${JSON.stringify(table)}\``, '', '| size | crime coin reached (hasCriminal & viability) | mean crime chance (law 1 0.5) | guild swap reached (g1>0) | mean guild chance (law 1 0.3) | small rule fires (calm, nameRule) x p |', '|---|---|---|---|---|---|');
    for (const s of sizes) { const r = ta[s]; L.push(`| ${s} | ${r.crimeCoinReached} | ${f1(100 * r.crimeMeanChance)}% | ${r.guildSwapReached} | ${f1(100 * r.guildMeanChance)}% | ${r.smallRuleFires} x ${r.smallPlaceCrime} |`); }
    L.push('');
  }
  const errors = A.places.filter((p) => p.error).length + (B ? B.places.filter((p) => p.error).length : 0);
  L.push(`Errors: ${errors}.`);
  const outBase = join(dirname(resolve(aPath)), basename(aPath, '.jsonl'));
  writeFileSync(`${outBase}.md`, L.join('\n') + '\n');
  writeFileSync(`${outBase}.json`, JSON.stringify({ metas: A.metas, second: B?.metas ?? null, bySize: sa, second_bySize: sb, drift: dr, moves: B ? moves : null, guildVariesMore: gWin, table, tableArith: ta, errors }, null, 1) + '\n');
  // stdout: <= 25 lines
  const S = [`measure-kinds report: ${A.places.length} places${B ? ` vs ${B.places.length}` : ''}, ${errors} errors -> ${outBase}.{md,json}`];
  S.push('size: guild_conflict% crime_wave% | first: kind % | troubles 0/1/2/3+ | distinct');
  for (const s of sizes) {
    const line = (x) => `${f1(pct(x.kindsAny.guild_conflict || 0, x.n))} ${f1(pct(x.kindsAny.crime_wave || 0, x.n))} | ${x.topFirst} ${f1(pct(x.topFirstN, x.n))} | ${x.count.join('/')} | ${x.distinct}`;
    S.push(`${s}: ${line(sa[s])}${sb?.[s] ? `  ||  ${line(sb[s])}` : ''}${B ? `  moved down ${moves[s].down} up ${moves[s].up}` : ''}`);
  }
  S.push('crime read p25/med/p75: ' + sizes.map((s) => { const v = sa[s].spread.crime; return `${s} ${f0(v.p25)}/${f0(v.median)}/${f0(v.p75)}${v.missing ? ` (lacks ${v.missing})` : ''}`; }).join('; '));
  for (const s of Object.keys(gWin)) { const g1 = sa[s].spread.g1; const g2 = sa[s].spread.g2; S.push(`${s} guild g1 p25/med/p75 ${f1(g1.p25)}/${f1(g1.median)}/${f1(g1.p75)} mode ${f0(g1.modeShare)}% | g2 ${f1(g2.p25)}/${f1(g2.median)}/${f1(g2.p75)} mode ${f0(g2.modeShare)}% -> ${gWin[s].variesMore}`); }
  if (sa.city) S.push(`city crime_wave by crime-read quarter: all places ${sa.city.byQuarter.crime_wave.crime.map((q) => f0(pct(q.hit, q.n))).join(' / ')}%; coin reached ${sa.city.byQuarterGated.crime_wave.crime.map((q) => f0(pct(q.hit, q.n))).join(' / ')}%`);
  S.push(`drift history-step -> final: ` + Object.entries(dr).map(([k, d]) => `${k} ${d.atVsFinal}`).join(', '));
  if (ta) for (const s of sizes) S.push(`table ${s}: crime ${f1(100 * ta[s].crimeMeanChance)}% over ${ta[s].crimeCoinReached}; guild ${f1(100 * ta[s].guildMeanChance)}% over ${ta[s].guildSwapReached}`);
  console.log(S.slice(0, 25).join('\n'));
}

// ── compare (KINDS-1 K1): baseline | arm | arm ... ──────────────────────────────────────────────────────────────────
const BAR_KIND = 33; const NEAR_KIND = 30; const BAR_FIRST = 25;
function compare(args) {
  const out = flag(args, '--out');
  const [basePath, ...armArgs] = args;
  if (!basePath || !out || !armArgs.length) fail('usage: compare <base.jsonl> <label>=<arm.jsonl> ... --out <out.md>');
  const arms = [{ label: 'baseline', ...load(basePath) }, ...armArgs.map((a) => { const i = a.indexOf('='); return { label: a.slice(0, i), ...load(a.slice(i + 1)) }; })];
  for (const a of arms) a.sum = summarize(a.places);
  const base = arms[0];
  const baseBySeed = new Map(base.places.map((p) => [p.seed, p]));
  const res = {};
  for (const size of SIZES) {
    res[size] = {};
    for (const a of arms) {
      const x = a.sum[size]; if (!x) continue;
      const share = (k) => pct(x.kindsAny[k] || 0, x.n);
      const kinds = Object.keys(x.kindsAny).filter((k) => share(k) >= NEAR_KIND).map((k) => ({ kind: k, share: share(k), over: share(k) > BAR_KIND }));
      const q = (kind, read) => { const Q = x.byQuarter[kind][read]; return { bottom: pct(Q[0].hit, Q[0].n), top: pct(Q[3].hit, Q[3].n) }; };
      const m = { down: 0, up: 0, upSeeds: [] };
      if (a !== base) for (const p of a.places.filter((r) => r.size === size && !r.error)) { const b = baseBySeed.get(p.seed); if (!b || b.error) continue; if (p.tensions.length < b.tensions.length) m.down++; else if (p.tensions.length > b.tensions.length) { m.up++; m.upSeeds.push(`${p.seed} (${b.tensions.length}->${p.tensions.length}${b.calm ? ', calm' : ''})`); } }
      res[size][a.label] = {
        n: x.n, guild: share('guild_conflict'), crime: share('crime_wave'), kinds, topFirst: x.topFirst, topFirstShare: pct(x.topFirstN, x.n),
        crimeFirst: pct(x.kindsFirst.crime_wave || 0, x.n), distinct: x.distinct, count: x.count,
        crimeQ: q('crime_wave', 'crime'), guildQ: q('guild_conflict', 'g2'), moved: a === base ? null : m,
        breaks: kinds.some((k) => k.over) || pct(x.topFirstN, x.n) > BAR_FIRST,
      };
    }
  }
  const labels = arms.map((a) => a.label);
  const L = ['# KINDS-1 K1 — law 2 compared (the visitor\'s pool, 150 a size)', ''];
  for (const a of arms) L.push(`- **${a.label}**: ${a.metas.map((m) => `sha \`${m.sha}\` force \`${JSON.stringify(m.force)}\`${m.plant ? ` plant \`${JSON.stringify(m.plant)}\`` : ''}`).join('; ')} (${a.path})`);
  L.push('', `The bar (the chair's target): no kind on more than ~${BAR_KIND}% of a size; the commonest FIRST trouble on at most ~${BAR_FIRST}%. "Near" = ${NEAR_KIND}% or more. Quarters by rank of the history-step read within the size (K0's rule); crime = criminalEffective, g2 = economy powers on the pre-trim roster.`, '');
  const head = `| size | ${labels.join(' | ')} |`; const sep = `|---|${labels.map(() => '---').join('|')}|`;
  const sect = (title, f) => { L.push(`## ${title}`, '', head, sep); for (const s of SIZES) if (res[s][labels[0]]) L.push(`| ${s} | ${labels.map((l) => (res[s][l] ? f(res[s][l]) : '—')).join(' | ')} |`); L.push(''); };
  sect('guild_conflict / crime_wave share of places (any position)', (r) => `${f1(r.guild)} / ${f1(r.crime)}`);
  sect('kinds over (**bold**) or near the bar', (r) => r.kinds.map((k) => (k.over ? `**${k.kind} ${f1(k.share)}**` : `${k.kind} ${f1(k.share)}`)).join(', ') || '—');
  sect('commonest FIRST trouble and its share; crime_wave as first', (r) => `${r.topFirst} ${f1(r.topFirstShare)}${r.topFirstShare > BAR_FIRST ? ' (over)' : ''}; crime first ${f1(r.crimeFirst)}`);
  sect('crime_wave rate, bottom / top quarter of the crime read', (r) => `${f0(r.crimeQ.bottom)} / ${f0(r.crimeQ.top)}`);
  sect('guild_conflict rate, bottom / top quarter of the economy-power read (g2)', (r) => `${f0(r.guildQ.bottom)} / ${f0(r.guildQ.top)}`);
  sect('troubles a place 0/1/2/3+ (distinct kinds)', (r) => `${r.count.join('/')} (${r.distinct})`);
  sect('places whose count moved against the baseline (down / up)', (r) => (r.moved ? `${r.moved.down} / ${r.moved.up}` : '—'));
  const ups = []; for (const s of SIZES) for (const l of labels) if (res[s][l]?.moved?.upSeeds.length) ups.push(`- ${l} ${s}: ${res[s][l].moved.upSeeds.join('; ')}`);
  L.push('## Places whose count went UP (a finding, by seed)', '', ...(ups.length ? ups : ['none']), '');
  L.push('## Does an arm break the bar, by size', '');
  for (const l of labels) L.push(`- ${l}: ${SIZES.filter((s) => res[s][l]?.breaks).join(', ') || 'none'}`);
  writeFileSync(out, L.join('\n') + '\n');
  writeFileSync(out.replace(/\.md$/, '') + '.json', JSON.stringify({ arms: arms.map((a) => ({ label: a.label, path: a.path, metas: a.metas })), bySize: res }, null, 1) + '\n');
  const S = [`measure-kinds compare -> ${out}`];
  for (const s of SIZES) if (res[s][labels[0]]) S.push(`${s}: ` + labels.map((l) => { const r = res[s][l]; return r ? `${l} g${f0(r.guild)} c${f0(r.crime)} 1st ${r.topFirst} ${f0(r.topFirstShare)}${r.moved ? ` mv ${r.moved.down}/${r.moved.up}` : ''}` : `${l} —`; }).join(' | '));
  for (const l of labels) S.push(`breaks the bar (${l}): ${SIZES.filter((s) => res[s][l]?.breaks).join(', ') || 'none'}`);
  console.log(S.join('\n'));
}

const [mode, ...rest] = process.argv.slice(2);
if (mode === 'birth') await birth(rest);
else if (mode === 'report') report(rest);
else if (mode === 'compare') compare(rest);
else fail('usage: measure-kinds.mjs birth|report|compare ...');
