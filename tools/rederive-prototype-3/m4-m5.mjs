/**
 * M4 — does a provided key REACH the assembled settlement, and under what path.
 * M5 — entropy the step stream does NOT carry (executed, not argued).
 * M3b — the steps that draw but move no declared key: what do they write undeclared?
 *
 * usage: node --import ./hook.mjs m4-m5.mjs
 */
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve as pres, relative } from 'node:path';

// ── M5 runtime probes, installed BEFORE the tree is imported ────────────────
const probe = { mathRandom: 0, dateNow: 0, dateCtor: 0, perfNow: 0, stacks: [] };
const RealMath = Math.random;
Math.random = function () { probe.mathRandom += 1; if (probe.stacks.length < 5) probe.stacks.push(`Math.random ${new Error().stack.split('\n')[2]}`); return RealMath(); };
const RealDate = Date;
const RealDateNow = Date.now;
globalThis.Date = new Proxy(RealDate, {
  construct(t, a, nt) { probe.dateCtor += 1; if (probe.stacks.length < 10) probe.stacks.push(`new Date ${new Error().stack.split('\n')[2]}`); return Reflect.construct(t, a, nt); },
  get(t, p, r) { if (p === 'now') return (...a) => { probe.dateNow += 1; if (probe.stacks.length < 15) probe.stacks.push(`Date.now ${new Error().stack.split('\n')[2]}`); return RealDateNow.apply(t, a); }; return Reflect.get(t, p, r); },
});
if (globalThis.performance) {
  const rp = globalThis.performance.now.bind(globalThis.performance);
  globalThis.performance.now = (...a) => { probe.perfNow += 1; return rp(...a); };
}

const { instrumentedRoot, runHeadless, getStepMeta, getStepOrder, TREE } = await import('./instrument.mjs');
const census = globalThis.__PRNG_CENSUS__;
const order = getStepOrder();
const meta = new Map(getStepMeta().map(m => [m.name, m]));

const ROWS = [
  { settType: 'village', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized', _seed: 'golden-master-v3' },
  { settType: 'town', culture: 'germanic', terrainOverride: 'riverside', tradeRouteAccess: 'river', monsterThreat: 'civilized', _seed: 'golden-master-v3' },
  { settType: 'city', culture: 'nordic', terrainOverride: 'coastal', tradeRouteAccess: 'port', monsterThreat: 'frontier', _seed: 'gm-seed-a' },
];

const h = (v) => { let s; try { s = JSON.stringify(v); } catch { s = String(v); } return createHash('sha1').update(String(s)).digest('hex').slice(0, 16); };
const size = (v) => { try { return JSON.stringify(v)?.length ?? 0; } catch { return 0; } };

/** Every path in the record, with its value hash. */
function paths(node, base, out, depth) {
  if (depth > 6) return;
  if (node === null || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length && i < 60; i += 1) {
      const p = `${base}[${i}]`;
      out.push([p, h(node[i]), size(node[i])]);
      paths(node[i], p, out, depth + 1);
    }
    return;
  }
  for (const k of Object.keys(node)) {
    const p = base ? `${base}.${k}` : k;
    out.push([p, h(node[k]), size(node[k])]);
    paths(node[k], p, out, depth + 1);
  }
}

// ── M3b: undeclared writes, over the three probe rows ───────────────────────
console.log('=== M3b — STRICT-MODE UNDECLARED WRITES (onStrictViolation), the whole pipeline ===');
const violations = new Map();
for (const row of ROWS) {
  runHeadless(row, instrumentedRoot(row._seed).root, {
    onStrictViolation: (v) => {
      const key = `${v.step}\t${v.kind || 'write'}`;
      const set = violations.get(key) || new Set();
      for (const k of v.keys) set.add(k);
      violations.set(key, set);
    },
  });
}
if (!violations.size) console.log('NONE — no step writes or reads a key it did not declare, on any probe row.');
for (const [k, set] of violations) console.log(`  ${k}\tkeys=[${[...set].join('|')}]`);

// ── M4 ──────────────────────────────────────────────────────────────────────
console.log('\n=== M4 — does a PROVIDED key reach the assembled settlement? ===');
const providedKeys = [];
for (const m of getStepMeta()) for (const k of m.provides) providedKeys.push([m.name, k]);
const distinct = [...new Set(providedKeys.map(([, k]) => k))];
console.log(`provides entries=${providedKeys.length}  distinct keys=${distinct.length}  (duplicates: ${providedKeys.length - distinct.length})`);

const verdicts = new Map();
for (const row of ROWS) {
  const ctx = runHeadless(row, instrumentedRoot(row._seed).root);
  const settlement = ctx.settlement;
  const idx = [];
  paths(settlement, '', idx, 0);
  const byHash = new Map();
  for (const [p, hh, sz] of idx) { if (!byHash.has(hh)) byHash.set(hh, []); byHash.get(hh).push([p, sz]); }
  const nameMatches = new Map();
  for (const [p] of idx) {
    const last = p.replace(/\[\d+\]$/, '').split('.').pop();
    if (!nameMatches.has(last)) nameMatches.set(last, []);
    nameMatches.get(last).push(p);
  }
  for (const key of distinct) {
    const val = ctx[key];
    const hv = h(val);
    const sv = size(val);
    let verdict; let where = '';
    if (key === 'settlement') { verdict = 'IS THE RECORD'; where = '(root)'; }
    else if (Object.prototype.hasOwnProperty.call(settlement, key) && h(settlement[key]) === hv) { verdict = 'SAME NAME, SAME VALUE'; where = key; }
    else if (byHash.has(hv) && sv >= 12) { const c = byHash.get(hv).sort((a, b) => a[0].length - b[0].length)[0]; verdict = 'VALUE MATCH (nested/renamed)'; where = c[0]; }
    else if (Object.prototype.hasOwnProperty.call(settlement, key)) { verdict = 'SAME NAME, VALUE DIFFERS'; where = key; }
    else if (nameMatches.has(key)) { verdict = 'NAME ELSEWHERE, VALUE DIFFERS'; where = nameMatches.get(key).slice(0, 2).join(' , '); }
    else if (byHash.has(hv) && sv > 0) { const c = byHash.get(hv).sort((a, b) => a[0].length - b[0].length)[0]; verdict = 'VALUE MATCH (scalar — weak)'; where = c[0]; }
    else { verdict = 'ABSENT'; where = '-'; }
    const cur = verdicts.get(key) || [];
    cur.push({ tier: row.settType, verdict, where, bytes: sv });
    verdicts.set(key, cur);
  }
}
console.log('\nkey\tprovidedBy\tverdict(village|town|city)\tpath\tbytes(town)');
const m4dump = [];
for (const key of distinct) {
  const by = providedKeys.filter(([, k]) => k === key).map(([s]) => s).join('+');
  const v = verdicts.get(key);
  const vs = v.map(x => x.verdict);
  const uniform = new Set(vs).size === 1 ? vs[0] : vs.join(' | ');
  console.log(`${key}\t${by}\t${uniform}\t${v[1].where}\t${v[1].bytes}`);
  m4dump.push({ key, by, verdicts: v });
}

// ── M5 ──────────────────────────────────────────────────────────────────────
console.log('\n=== M5 — the transitive import closure of generateSettlementPipeline.js ===');
const ENTRY = `${TREE}/src/generators/generateSettlementPipeline.js`;
const seen = new Set(); const bare = new Set(); const queue = [ENTRY];
const IMPORT_RE = /(?:^|\s)(?:import|export)\s*(?:[\s\S]*?\sfrom\s*)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
while (queue.length) {
  const f = queue.pop();
  if (seen.has(f)) continue;
  if (!existsSync(f)) continue;
  seen.add(f);
  const src = readFileSync(f, 'utf-8');
  IMPORT_RE.lastIndex = 0;
  let m;
  while ((m = IMPORT_RE.exec(src))) {
    const spec = m[1] || m[2];
    if (!spec) continue;
    if (!spec.startsWith('.')) { bare.add(spec); continue; }
    let target = pres(dirname(f), spec);
    if (!existsSync(target)) { for (const ext of ['.js', '.jsx', '.mjs', '/index.js']) if (existsSync(target + ext)) { target += ext; break; } }
    queue.push(target);
  }
}
console.log(`closure files (relative specifiers, resolved) = ${seen.size}`);
console.log(`bare specifiers reached = ${[...bare].join(', ')}`);

const PATTERNS = [
  ['createPRNG(', /createPRNG\s*\(/g],
  ['hash01', /\bhash01\b/g],
  ['fnv1a32', /\bfnv1a32\b/g],
  ['Math.random', /Math\s*\.\s*random\s*\(/g],
  ['Date.now', /Date\s*\.\s*now\s*\(/g],
  ['new Date', /new\s+Date\s*\(/g],
  ['performance.', /performance\s*\.\s*(now|timeOrigin)/g],
  ['unseededRandom', /\bunseededRandom\b/g],
];
const hits = new Map(PATTERNS.map(([n]) => [n, []]));
for (const f of seen) {
  const src = readFileSync(f, 'utf-8');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, (mm) => mm.replace(/[^\n]/g, ' ')).replace(/(^|[^:])\/\/[^\n]*/g, (mm) => mm.replace(/[^\n]/g, ' '));
  for (const [name, re] of PATTERNS) {
    re.lastIndex = 0; let m;
    while ((m = re.exec(code))) {
      const line = code.slice(0, m.index).split('\n').length;
      hits.get(name).push(`${relative(TREE, f)}:${line}`);
    }
  }
}
console.log('\nstatic hits inside the closure (comments and block comments blanked):');
for (const [name, list] of hits) {
  console.log(`  ${name}: ${list.length}${list.length ? ` — ${list.join(' , ')}` : ''}`);
}

console.log('\nRUNTIME (executed during three generateSettlementPipeline runs above):');
console.log(`  Math.random calls = ${probe.mathRandom}`);
console.log(`  Date.now calls    = ${probe.dateNow}`);
console.log(`  new Date calls    = ${probe.dateCtor}`);
console.log(`  performance.now   = ${probe.perfNow}`);
for (const s of probe.stacks) console.log(`    ${s.trim()}`);

// every mint observed during the last run, by seed prefix
census.reset();
runHeadless(ROWS[1], instrumentedRoot(ROWS[1]._seed).root);
const mints = census.all();
const rootSeed = ROWS[1]._seed;
const foreign = mints.filter(m => m.seed !== rootSeed && !m.seed.startsWith(`${rootSeed}::`));
console.log(`\n  createPRNG mints during ONE run = ${mints.length}; of which FOREIGN-seeded (not derived from the root) = ${foreign.length}`);
for (const f of foreign) console.log(`    foreign="${f.seed}" calls=${f.calls}`);
const detached = mints.filter(m => mints.filter(x => x.seed === m.seed).length > 1);
console.log(`  mints sharing a seed string with another mint (a stream RE-MINTED from a copied seed) = ${detached.length}`);
for (const d of [...new Set(detached.map(x => x.seed))]) console.log(`    seed="${d}" minted ${mints.filter(x => x.seed === d).length}x, total calls=${mints.filter(x => x.seed === d).reduce((s, x) => s + x.calls, 0)}`);

writeFileSync(new URL('./m4-m5-result.json', import.meta.url), JSON.stringify({ m4dump, closure: seen.size, hits: Object.fromEntries(hits), probe }, null, 2));
