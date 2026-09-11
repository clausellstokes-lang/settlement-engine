// probe-wiring.mjs — feasibility measurement for CAR 8: can the pool-key PREDICATE be
// recovered statically from the six composers? READ-ONLY; prints, writes nothing.
import { readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR';
const COMPOSERS = [
  'src/domain/display/stateProse/generalStateProse.js',
  'src/domain/display/stateProse/powerStateProse.js',
  'src/domain/display/stateProse/economyStateProse.js',
  'src/domain/display/stateProse/defenseStateProse.js',
  'src/domain/display/stateProse/stressorsStateProse.js',
  'src/domain/display/stateProse/warFaithStateProse.js',
];

function balanced(src, open) {
  const pairs = { '(': ')', '{': '}', '[': ']' };
  const close = pairs[src[open]];
  if (!close) throw new Error(`not a bracket at ${open}`);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 1; if (i < 1) break; continue; }
    if (c === '\'' || c === '"' || c === '`') {
      const q = c; i++;
      while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; }
      continue;
    }
    if (c === '(' || c === '{' || c === '[') depth++;
    else if (c === ')' || c === '}' || c === ']') { depth--; if (depth === 0) return { inner: src.slice(open + 1, i), end: i }; }
  }
  throw new Error('unbalanced');
}

// every  function <name>PoolKey(params) { body }
function keyFns(src, file) {
  const out = [];
  const re = /\bfunction\s+([A-Za-z_$][\w$]*[Pp]oolKey)\s*\(/g;
  for (const m of src.matchAll(re)) {
    const open = m.index + m[0].length - 1;
    let args; try { args = balanced(src, open); } catch { continue; }
    const brace = src.indexOf('{', args.end);
    let body; try { body = balanced(src, brace); } catch { continue; }
    out.push({
      file,
      name: m[1],
      params: args.inner.split(',').map((p) => (p.trim().match(/^([A-Za-z_$][\w$]*)/) || ['', ''])[1]).filter(Boolean),
      body: body.inner,
      line: src.slice(0, m.index).split('\n').length,
    });
  }
  return out;
}

const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');

function returns(body) {
  const code = strip(body);
  const out = [];
  const re = /\breturn\s+([^;]+);/g;
  for (const m of code.matchAll(re)) {
    const before = code.slice(0, m.index);
    // the nearest enclosing/preceding `if (...)` on the same or the previous line
    const guard = before.match(/\bif\s*\(([^\n]*)\)\s*(?:\{\s*)?$/);
    out.push({ expr: m[1].trim(), guard: guard ? guard[1] : null });
  }
  return out;
}

let totalFns = 0; const allFns = [];
for (const rel of COMPOSERS) {
  const src = readFileSync(path.join(D, rel), 'utf8');
  const fns = keyFns(src, rel);
  totalFns += fns.length;
  allFns.push(...fns);
  console.log(`${rel.split('/').pop().padEnd(26)} keyFns ${String(fns.length).padStart(3)}`);
}
console.log(`TOTAL pool-key functions: ${totalFns}`);

// how many literal returns, how many guarded
let lit = 0, tmpl = 0, other = 0, guarded = 0, unguarded = 0;
const literalsByFn = new Map();
for (const fn of allFns) {
  const rs = returns(fn.body);
  const set = new Set();
  for (const r of rs) {
    if (/^'[^']*'$/.test(r.expr) || /^"[^"]*"$/.test(r.expr)) { lit++; set.add(r.expr.slice(1, -1)); }
    else if (/^`[^`]*`$/.test(r.expr) && !r.expr.includes('${')) { lit++; set.add(r.expr.slice(1, -1)); }
    else if (r.expr.includes('${') || r.expr.startsWith('`')) tmpl++;
    else other++;
    if (r.guard) guarded++; else unguarded++;
    // ternary literals
    for (const t of r.expr.matchAll(/'([^']+)'/g)) set.add(t[1]);
  }
  literalsByFn.set(fn.name, { fn, literals: [...set] });
}
console.log(`returns: literal ${lit} · template ${tmpl} · other ${other} | guarded ${guarded} unguarded ${unguarded}`);
console.log(`functions returning >=1 literal: ${[...literalsByFn.values()].filter((v) => v.literals.length).length} of ${totalFns}`);

// the leaves
const gdir = path.join(D, 'src/data/dossierStateProse');
const poolsOf = new Map(); let blocks = 0, pools = 0, variants = 0;
for (const f of readdirSync(gdir).filter((f) => f.endsWith('.generated.js')).sort()) {
  const mod = await import(pathToFileURL(path.join(gdir, f)).href);
  const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) {
    blocks++;
    const ks = Object.keys(b.pools || {});
    poolsOf.set(block, ks);
    pools += ks.length;
    for (const k of ks) variants += b.pools[k].length;
  }
}
console.log(`leaves: blocks ${blocks} pools ${pools} variants ${variants}`);

// join: which pool keys are hit by a literal return anywhere?
const allLiterals = new Set();
for (const v of literalsByFn.values()) for (const l of v.literals) allLiterals.add(l);
let hit = 0, miss = 0; const missByBlock = new Map();
for (const [block, ks] of poolsOf) {
  for (const k of ks) {
    if (allLiterals.has(k)) hit++;
    else { miss++; missByBlock.set(block, (missByBlock.get(block) || 0) + 1); }
  }
}
console.log(`pool keys matched by a static literal return: ${hit} of ${pools}  (unmatched ${miss})`);
console.log('top unmatched blocks:');
for (const [b, n] of [...missByBlock].sort((a, b2) => b2[1] - a[1]).slice(0, 15)) console.log(`   ${b.padEnd(12)} ${n}`);
