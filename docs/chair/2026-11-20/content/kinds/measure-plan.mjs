#!/usr/bin/env node
/**
 * measure-plan.mjs — lane KINDS-2, units 4 and 5: THE DARK PROOF ON TWO CORPORA, AND THE MEASURE FOR THE OWNER (a measure
 * only; nothing under src/ or tests/ is touched). Brief: docs/chair/2026-11-20/content/kinds/briefs/K5-PROOF.md.
 * Plain `node`, as measure-kinds.mjs is; its plant and read code is COPIED here, not imported.
 *
 *   plan census|visitor <out.json> [--lit <rev:path>]
 *          census:  900 rows `{ seed: "dp-<size>-<i>", size, config: { settType: size } }`, i 0..149, six sizes (the close's
 *                   census, close-7 read24/measure.census.jsx).
 *          visitor: the same 900 seeds, each with the config of its size's row of the chair's plan-lit.json (default
 *                   `origin/lane/chair-2026-11-08:docs/chair/2026-11-24/tenth/read/plan-lit.json`, read once by `git show`
 *                   from this file's checkout into the plan), as close-7 read24/make-visitor-plan.mjs makes it.
 *   birth <tree> <plan.json> <out.jsonl> [--force '<json>'] [--plant '<json>'] [--rev <rev>] [--limit n]
 *          For each row, after `loadGenerationLawPayloads()`:
 *          `generateSettlementPipeline({ ...birthConfig(row.config), ...FORCE }, null, { seed: row.seed, customContent: {} })`
 *          (with FORCE absent the call is exactly the close's census birth). One JSON line a place: seed, size, hash
 *          (sha256 hex of `JSON.stringify(record)`), cfgHash (the same of `record.config`), restHash (the same of the record
 *          without `history` and without `config._troubleLawVersion`), keys (sha256-16 of each top-level key's value, for
 *          naming a differing key), restHash2 / cfgRest / rawCfgRest (the record also carries the RAW config as `_config`,
 *          so restHash2 sets the key aside there too; cfgRest / rawCfgRest are the two configs without it), tensions (`history.currentTensions` types in order), and the reads K0's instrument
 *          takes, here off the FINAL record (no `onStep` hook, so the call stays the close's): crime =
 *          `economicState.compound.criminalEffective`, hasCriminal, nameRule, g2 = economy powers (final roster, i.e.
 *          post-trim). `--plant` as in measure-kinds.mjs (a scratch `git archive` copy, the row rewritten there only).
 *   equal <a.jsonl> <b.jsonl> [--out <md>]
 *          Places matched by seed: the count equal by hash, by cfgHash; every unequal seed listed with its first differing
 *          top-level key.
 *   report <dark.jsonl> <lit.jsonl> [--table '<json>'] --out <md>
 *          By size, dark | lit: guild_conflict and crime_wave share (any position); every other kind at >= 10% of a size
 *          (either side); places with no trouble; troubles a place 0/1/2/3+; distinct kinds; commonest FIRST trouble and
 *          share; places changed at all (hash) and in their trouble list; count down / up (seeds for up); THE CALM CHECK
 *          (dark no trouble, lit gains one: must be 0); places differing in anything other than `history` and
 *          `config._troubleLawVersion` (restHash; keys named). Writes <md> and a .json beside it; prints <= 25 lines.
 */
import { mkdtempSync, rmSync, symlinkSync, realpathSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PER_SIZE = 150;
const HERE = dirname(fileURLToPath(import.meta.url));
const fail = (m) => { console.error(`measure-plan: ${m}`); process.exit(2); };
const flag = (args, name) => { const i = args.indexOf(name); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const sha = (s) => createHash('sha256').update(s).digest('hex');

// ── plan ────────────────────────────────────────────────────────────────────────────────────────────────────────────
const LIT_DEFAULT = 'origin/lane/chair-2026-11-08:docs/chair/2026-11-24/tenth/read/plan-lit.json';
function plan(args) {
  const lit = flag(args, '--lit') ?? LIT_DEFAULT;
  const [kind, out] = args;
  if (!['census', 'visitor'].includes(kind) || !out) fail('usage: plan census|visitor <out.json> [--lit rev:path]');
  let by = null;
  if (kind === 'visitor') {
    const rows = JSON.parse(execSync(`git show ${JSON.stringify(lit)}`, { cwd: HERE, stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 1 << 26 }).toString());
    by = {}; for (const r of rows) by[r.size] ||= r.config;
    for (const s of SIZES) if (!by[s]) fail(`plan visitor: ${lit} has no row for ${s}`);
  }
  const rows = SIZES.flatMap((size) => Array.from({ length: PER_SIZE }, (_, i) => ({ seed: `dp-${size}-${i}`, size, config: kind === 'census' ? { settType: size } : by[size] })));
  writeFileSync(out, JSON.stringify(rows) + '\n');
  console.log(`measure-plan plan ${kind}: ${rows.length} rows -> ${out}${kind === 'visitor' ? ` (configs from ${lit})` : ''}`);
}

// ── the reads (copied from measure-kinds.mjs :: readsOf; here off the final record) ────────────────────────────────
const NAME_RULE = (n) => { n = (n || '').toLowerCase(); return n.includes('fence') || n.includes('smuggl') || n.includes('bandit') || n.includes('outlaw'); };
function readsOf(institutions, economicState, factions) {
  const insts = Array.isArray(institutions) ? institutions : [];
  const facs = Array.isArray(factions) ? factions : [];
  const ce = economicState?.compound?.criminalEffective;
  return {
    crime: typeof ce === 'number' && Number.isFinite(ce) ? ce : null,
    hasCriminal: insts.some((i) => i.priorityCategory === 'criminal'),
    nameRule: insts.some((i) => NAME_RULE(i.name)),
    g2: facs.filter((f) => f.category === 'economy').length,
  };
}

// ── --plant (copied from measure-kinds.mjs :: plantedTree) ──────────────────────────────────────────────────────────
const LEAF_REL = 'src/domain/trouble/troubleLaw.js';
const PLANT_FIELDS = ['floor', 'ceiling', 'readLow', 'readHigh'];
function plantedTree(tree, rev, plantSpec) {
  const commit = execSync(`git rev-parse --verify ${JSON.stringify(`${rev}^{commit}`)}`, { cwd: tree, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  const dir = mkdtempSync(join(tmpdir(), 'measure-plan-plant-'));
  execSync(`git archive ${commit} | tar -x -C ${JSON.stringify(dir)}`, { cwd: tree, stdio: ['ignore', 'ignore', 'inherit'], shell: '/bin/sh' });
  symlinkSync(realpathSync(join(tree, 'node_modules')), join(dir, 'node_modules'));
  const leafPath = join(dir, LEAF_REL);
  let text = readFileSync(leafPath, 'utf8');
  const receipt = [];
  for (const [name, values] of Object.entries(plantSpec)) {
    const re = new RegExp(`^(\\s*${name}: Object\\.freeze\\(\\{[^\\n]*\\}\\),)$`, 'gm');
    const hits = text.match(re) || [];
    if (hits.length !== 1) { rmSync(dir, { recursive: true, force: true }); fail(`--plant: the row ${name} was found ${hits.length} times in ${LEAF_REL} at ${commit} (want exactly 1)`); }
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
  for (const r of receipt) console.log(`measure-plan plant @${commit.slice(0, 9)}: ${r.row}\n  before: ${r.before}\n  after:  ${r.after}`);
  return { dir, sha: commit, receipt };
}

// ── birth ───────────────────────────────────────────────────────────────────────────────────────────────────────────
async function birth(args) {
  const forceJson = flag(args, '--force');
  const plantJson = flag(args, '--plant');
  const revArg = flag(args, '--rev') ?? 'HEAD';
  const limit = Number(flag(args, '--limit') ?? Infinity);
  const [treeArg, planPath, outPath] = args;
  if (!treeArg || !planPath || !outPath) fail('usage: birth <tree> <plan.json> <out.jsonl> [--force json] [--plant json]');
  const TREE = resolve(treeArg);
  const rows = JSON.parse(readFileSync(planPath, 'utf8')).slice(0, limit);
  const planted = plantJson ? plantedTree(TREE, revArg, JSON.parse(plantJson)) : null;
  const T = planted ? planted.dir : TREE;
  const imp = (p) => import(join(T, p));
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
  const FORCE = forceJson ? JSON.parse(forceJson) : null;
  await loadGenerationLawPayloads();
  let commit = planted ? planted.sha : null;
  if (!planted) try { commit = execSync('git rev-parse HEAD', { cwd: T, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { /* not a checkout */ }
  const lines = [JSON.stringify({ meta: { tree: planted ? `${TREE} @${commit} (git archive, planted copy)` : T, sha: commit, plan: planPath, planSha256: sha(readFileSync(planPath)), force: FORCE, rows: rows.length, ...(planted ? { plant: JSON.parse(plantJson), plantReceipt: planted.receipt } : {}) } })];
  const t0 = Date.now();
  let errors = 0;
  for (const row of rows) {
    const rec = { seed: row.seed, size: row.size };
    let t;
    try {
      const config = FORCE ? { ...birthConfig(row.config), ...FORCE } : birthConfig(row.config);
      t = generateSettlementPipeline(config, null, { seed: row.seed, customContent: {} });
    } catch (e) { errors++; rec.error = String(e?.stack || e).split('\n').slice(0, 3).join(' | '); lines.push(JSON.stringify(rec)); continue; }
    rec.hash = sha(JSON.stringify(t));
    rec.cfgHash = sha(JSON.stringify(t.config));
    const strip = (c) => { if (!c || typeof c !== 'object') return c; const { _troubleLawVersion: _v, ...o } = c; return o; };
    const { history: _h, ...rest } = t;
    rest.config = strip(rest.config);
    rec.restHash = sha(JSON.stringify(rest));
    rec.cfgRest = sha(String(JSON.stringify(strip(t.config)))).slice(0, 16);
    if ('_config' in t) { rest._config = strip(rest._config); rec.restHash2 = sha(JSON.stringify(rest)); rec.rawCfgRest = sha(String(JSON.stringify(strip(t._config)))).slice(0, 16); }
    rec.keys = Object.fromEntries(Object.keys(t).map((k) => [k, sha(String(JSON.stringify(t[k]))).slice(0, 16)]));
    rec.tensions = (t.history?.currentTensions || []).map((x) => x.type);
    rec.reads = readsOf(t.institutions, t.economicState, t.powerStructure?.factions);
    lines.push(JSON.stringify(rec));
  }
  writeFileSync(outPath, lines.join('\n') + '\n');
  if (planted) rmSync(planted.dir, { recursive: true, force: true });
  console.log(`measure-plan birth: ${lines.length - 1} places (${errors} errors) in ${((Date.now() - t0) / 1000).toFixed(1)} s wall -> ${outPath}`);
}

// ── equal ───────────────────────────────────────────────────────────────────────────────────────────────────────────
function load(path) {
  const rows = readFileSync(path, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  return { path, metas: rows.filter((r) => r.meta).map((r) => r.meta), places: rows.filter((r) => !r.meta) };
}
const firstDiffKey = (p, q) => {
  const ks = [...new Set([...Object.keys(p.keys || {}), ...Object.keys(q.keys || {})])];
  return ks.find((k) => (p.keys || {})[k] !== (q.keys || {})[k]) ?? null;
};
function equal(args) {
  const out = flag(args, '--out');
  const [aPath, bPath] = args;
  if (!aPath || !bPath) fail('usage: equal <a.jsonl> <b.jsonl> [--out md]');
  const A = load(aPath); const B = load(bPath);
  const bySeed = new Map(B.places.map((p) => [p.seed, p]));
  let byHash = 0; let byCfg = 0; let matched = 0; const unequal = []; const missing = [];
  for (const p of A.places) {
    const q = bySeed.get(p.seed); if (!q) { missing.push(p.seed); continue; }
    matched++;
    if (p.hash && p.hash === q.hash) byHash++; else unequal.push({ seed: p.seed, firstKey: p.error || q.error ? `error: ${p.error || q.error}` : firstDiffKey(p, q), cfgEqual: p.cfgHash === q.cfgHash });
    if (p.cfgHash && p.cfgHash === q.cfgHash) byCfg++;
  }
  for (const q of B.places) if (!A.places.some((p) => p.seed === q.seed)) missing.push(`${q.seed} (b only)`);
  const L = ['# measure-plan equal', '',
    `- a: \`${aPath}\` — ${A.metas.map((m) => `tree \`${m.tree}\` sha \`${m.sha}\` force \`${JSON.stringify(m.force)}\` plan sha256 \`${m.planSha256}\``).join('; ')}`,
    `- b: \`${bPath}\` — ${B.metas.map((m) => `tree \`${m.tree}\` sha \`${m.sha}\` force \`${JSON.stringify(m.force)}\` plan sha256 \`${m.planSha256}\``).join('; ')}`, '',
    `Places: a ${A.places.length}, b ${B.places.length}, matched by seed ${matched}, unmatched ${missing.length}.`, '',
    `**Equal by hash: ${byHash} / ${matched}. Equal by cfgHash: ${byCfg} / ${matched}.**`, '',
    `Unequal by hash (${unequal.length}): ${unequal.length ? '' : 'none'}`];
  for (const u of unequal) L.push(`- ${u.seed}: first differing top-level key \`${u.firstKey}\`; config ${u.cfgEqual ? 'equal' : 'differs'}`);
  if (missing.length) L.push('', `Unmatched: ${missing.join(', ')}`);
  if (out) writeFileSync(out, L.join('\n') + '\n');
  const S = [`measure-plan equal: hash ${byHash}/${matched}, cfgHash ${byCfg}/${matched}, unequal ${unequal.length}, unmatched ${missing.length}${out ? ` -> ${out}` : ''}`];
  for (const u of unequal.slice(0, 20)) S.push(`  ${u.seed}: ${u.firstKey}`);
  console.log(S.join('\n'));
}

// ── report ──────────────────────────────────────────────────────────────────────────────────────────────────────────
const pct = (n, d) => (d ? (100 * n / d) : NaN);
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : '—');
const OTHER_BAR = 10;
function summarize(P) {
  const n = P.length;
  const cnt = [0, 0, 0, 0]; for (const p of P) cnt[Math.min(3, p.tensions.length)]++;
  const any = new Map(); const first = new Map();
  for (const p of P) { for (const t of new Set(p.tensions)) any.set(t, (any.get(t) || 0) + 1); if (p.tensions[0]) first.set(p.tensions[0], (first.get(p.tensions[0]) || 0) + 1); }
  let topFirst = null; let topFirstN = 0; for (const [t, c] of first) if (c > topFirstN || (c === topFirstN && t < topFirst)) { topFirst = t; topFirstN = c; }
  return { n, count: cnt, none: cnt[0], kindsAny: Object.fromEntries(any), distinct: any.size, topFirst, topFirstN };
}
function report(args) {
  const tableJson = flag(args, '--table');
  const out = flag(args, '--out');
  const [dPath, lPath] = args;
  if (!dPath || !lPath || !out) fail('usage: report <dark.jsonl> <lit.jsonl> [--table json] --out <md>');
  const D = load(dPath); const Lt = load(lPath);
  const litBySeed = new Map(Lt.places.map((p) => [p.seed, p]));
  const errors = D.places.filter((p) => p.error).length + Lt.places.filter((p) => p.error).length;
  const res = {}; const calmBreaks = []; const otherKeys = {}; let otherN = 0; const otherKeys2 = {}; let otherN2 = 0;
  for (const size of SIZES) {
    const Pd = D.places.filter((p) => p.size === size && !p.error); const Pl = Lt.places.filter((p) => p.size === size && !p.error);
    if (!Pd.length) continue;
    const sd = summarize(Pd); const sl = summarize(Pl);
    const others = [...new Set([...Object.keys(sd.kindsAny), ...Object.keys(sl.kindsAny)])]
      .filter((k) => k !== 'guild_conflict' && k !== 'crime_wave' && (pct(sd.kindsAny[k] || 0, sd.n) >= OTHER_BAR || pct(sl.kindsAny[k] || 0, sl.n) >= OTHER_BAR))
      .sort((a, b) => (sd.kindsAny[b] || 0) - (sd.kindsAny[a] || 0) || a.localeCompare(b));
    const m = { matched: 0, changedHash: 0, changedKinds: 0, down: 0, up: 0, same: 0, upSeeds: [], otherThanHistory: 0, otherThanHistory2: 0 };
    for (const p of Pd) {
      const q = litBySeed.get(p.seed); if (!q || q.error) continue;
      m.matched++;
      if (q.hash !== p.hash) m.changedHash++;
      if (JSON.stringify(q.tensions) !== JSON.stringify(p.tensions)) m.changedKinds++;
      if (q.tensions.length < p.tensions.length) m.down++; else if (q.tensions.length > p.tensions.length) { m.up++; m.upSeeds.push(`${p.seed} (${p.tensions.length}->${q.tensions.length})`); } else m.same++;
      if (p.tensions.length === 0 && q.tensions.length > 0) calmBreaks.push(`${p.seed} (lit: ${q.tensions.join(', ')})`);
      if (q.restHash !== p.restHash) {
        m.otherThanHistory++; otherN++;
        for (const k of Object.keys({ ...p.keys, ...q.keys })) if (k !== 'history' && k !== 'config' && p.keys[k] !== q.keys[k]) otherKeys[k] = (otherKeys[k] || 0) + 1;
        if (p.cfgRest !== q.cfgRest) otherKeys['config (beyond _troubleLawVersion)'] = (otherKeys['config (beyond _troubleLawVersion)'] || 0) + 1;
      }
      if ((q.restHash2 ?? q.restHash) !== (p.restHash2 ?? p.restHash)) {
        m.otherThanHistory2++; otherN2++;
        for (const k of Object.keys({ ...p.keys, ...q.keys })) if (!['history', 'config', '_config'].includes(k) && p.keys[k] !== q.keys[k]) otherKeys2[k] = (otherKeys2[k] || 0) + 1;
        if (p.cfgRest !== q.cfgRest) otherKeys2['config (beyond _troubleLawVersion)'] = (otherKeys2['config (beyond _troubleLawVersion)'] || 0) + 1;
        if (p.rawCfgRest !== q.rawCfgRest) otherKeys2['_config (beyond _troubleLawVersion)'] = (otherKeys2['_config (beyond _troubleLawVersion)'] || 0) + 1;
      }
    }
    res[size] = { dark: sd, lit: sl, others, moved: m };
  }
  const sizes = SIZES.filter((s) => res[s]);
  const share = (x, k) => f1(pct(x.kindsAny[k] || 0, x.n));
  const dl = (a, b) => `${a} → ${b}`;
  const L = ['# KINDS-2 K5 — the trouble law dark vs lit (the measure for the owner)', ''];
  L.push(`- **dark**: \`${dPath}\` — ${D.metas.map((m) => `tree \`${m.tree}\` sha \`${m.sha}\` force \`${JSON.stringify(m.force)}\` plan \`${m.plan}\` (sha256 \`${m.planSha256}\`)`).join('; ')}`);
  L.push(`- **lit**: \`${lPath}\` — ${Lt.metas.map((m) => `tree \`${m.tree}\` sha \`${m.sha}\` force \`${JSON.stringify(m.force)}\` plan \`${m.plan}\` (sha256 \`${m.planSha256}\`)${m.plant ? ` plant \`${JSON.stringify(m.plant)}\`` : ''}`).join('; ')}`);
  if (tableJson) L.push(`- **table measured**: \`${tableJson}\``);
  L.push('', 'Every cell is dark → lit, by size (150 places each). Shares are of places (a kind counted once a place, any position).', '');
  L.push('## guild_conflict and crime_wave (% of places)', '', '| size | guild_conflict | crime_wave |', '|---|---|---|');
  for (const s of sizes) { const r = res[s]; L.push(`| ${s} | ${dl(share(r.dark, 'guild_conflict'), share(r.lit, 'guild_conflict'))} | ${dl(share(r.dark, 'crime_wave'), share(r.lit, 'crime_wave'))} |`); }
  L.push('', `## Every other kind at ${OTHER_BAR}% or more of a size (either side)`, '', '| size | kinds (% dark → lit) |', '|---|---|');
  for (const s of sizes) { const r = res[s]; L.push(`| ${s} | ${r.others.map((k) => `${k} ${dl(share(r.dark, k), share(r.lit, k))}`).join('; ') || '—'} |`); }
  L.push('', '## Troubles a place', '', '| size | no trouble | 0/1/2/3+ | distinct kinds | commonest FIRST trouble (share) |', '|---|---|---|---|---|');
  for (const s of sizes) { const r = res[s]; const tf = (x) => `${x.topFirst} ${f1(pct(x.topFirstN, x.n))}%`; L.push(`| ${s} | ${dl(r.dark.none, r.lit.none)} | ${dl(r.dark.count.join('/'), r.lit.count.join('/'))} | ${dl(r.dark.distinct, r.lit.distinct)} | ${dl(tf(r.dark), tf(r.lit))} |`); }
  L.push('', '## What changed, by seed', '', '| size | matched | record changed at all (hash) | trouble list changed | count down | count up | differs beyond history & the key (config / config+_config) | UP seeds |', '|---|---|---|---|---|---|---|---|');
  for (const s of sizes) { const m = res[s].moved; L.push(`| ${s} | ${m.matched} | ${m.changedHash} | ${m.changedKinds} | ${m.down} | ${m.up} | ${m.otherThanHistory} / ${m.otherThanHistory2} | ${m.upSeeds.join('; ') || '—'} |`); }
  L.push('', `## THE CALM CHECK (born with no trouble dark, gains one lit; must be 0): **${calmBreaks.length}**`, '', ...(calmBreaks.length ? calmBreaks.map((x) => `- ${x}`) : ['none']), '');
  L.push(`## Lit places differing from dark in anything OTHER than \`history\` and \`config._troubleLawVersion\`: **${otherN}**`, '', ...(otherN ? Object.entries(otherKeys).map(([k, n]) => `- \`${k}\`: ${n}`) : ['none (the law touches only the troubles)']), '');
  L.push(`The record also carries the RAW config as \`_config\` (\`steps/assembleSettlement.js\`: \`_config: { ...config }\`), so the forced key appears there too. With \`_config._troubleLawVersion\` ALSO set aside: **${otherN2}**`, '', ...(otherN2 ? Object.entries(otherKeys2).map(([k, n]) => `- \`${k}\`: ${n}`) : ['none (the law touches only the troubles)']), '');
  L.push(`Errors: ${errors}.`);
  writeFileSync(out, L.join('\n') + '\n');
  writeFileSync(out.replace(/\.md$/, '') + '.json', JSON.stringify({ dark: D.metas, lit: Lt.metas, table: tableJson ? JSON.parse(tableJson) : null, bySize: res, calmBreaks, otherThanHistory: { count: otherN, keys: otherKeys }, otherThanHistoryAndRawConfigKey: { count: otherN2, keys: otherKeys2 }, errors }, null, 1) + '\n');
  const S = [`measure-plan report: dark ${D.places.length} vs lit ${Lt.places.length}, ${errors} errors -> ${out}`];
  S.push('size: guild% crime% none | changed hash/list | down/up | beyond-history (config / +_config)');
  for (const s of sizes) { const r = res[s]; const m = r.moved; S.push(`${s}: g ${share(r.dark, 'guild_conflict')}->${share(r.lit, 'guild_conflict')} c ${share(r.dark, 'crime_wave')}->${share(r.lit, 'crime_wave')} none ${r.dark.none}->${r.lit.none} | ${m.changedHash}/${m.changedKinds} | ${m.down}/${m.up} | ${m.otherThanHistory}/${m.otherThanHistory2}`); }
  S.push(`calm check: ${calmBreaks.length}${calmBreaks.length ? ` (${calmBreaks.slice(0, 5).join('; ')})` : ''}`);
  S.push(`other than history: ${otherN}${otherN ? ` (${Object.entries(otherKeys).map(([k, n]) => `${k} ${n}`).join(', ')})` : ''}`);
  S.push(`other than history and the key (in _config too): ${otherN2}${otherN2 ? ` (${Object.entries(otherKeys2).map(([k, n]) => `${k} ${n}`).join(', ')})` : ''}`);
  console.log(S.slice(0, 25).join('\n'));
}

const [mode, ...rest] = process.argv.slice(2);
if (mode === 'plan') plan(rest);
else if (mode === 'birth') await birth(rest);
else if (mode === 'equal') equal(rest);
else if (mode === 'report') report(rest);
else fail('usage: measure-plan.mjs plan|birth|equal|report ...');
