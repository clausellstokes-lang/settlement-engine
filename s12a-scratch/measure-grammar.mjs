import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D = process.argv[2];
const gdir = path.join(D, 'src/data/dossierStateProse');
const blocks = [];
for (const f of readdirSync(gdir).filter(x => x.endsWith('.generated.js'))) {
  const mod = await import(pathToFileURL(path.join(gdir, f)).href); const t = Object.values(mod)[0];
  for (const [block, b] of Object.entries(t)) blocks.push({ f, block, pools: Object.entries(b.pools || {}) });
}
// grammar classes
let colon = 0, lowRun = 0, bare = 0, total = 0; const bareEx = [], lowEx = [];
const axisOf = k => { const i = k.indexOf(':'); if (i > 0) return k.slice(0, i).trim().toLowerCase();
  const w = k.split(/\s+/); const run = []; for (const x of w) { if (/^[a-z][a-z0-9_'-]*$/.test(x)) run.push(x); else break; }
  if (!run.length) return ''; return (w.every(x => /^[a-z][a-z0-9_'’-]*$/.test(x)) ? w[0] : run.join(' ')).toLowerCase(); };
for (const b of blocks) for (const [k] of b.pools) { total++; const a = axisOf(k);
  if (k.includes(':')) colon++; else if (a) { lowRun++; if (lowEx.length < 6) lowEx.push(`${k}  ->  axis "${a}"`); }
  else { bare++; if (bareEx.length < 6) bareEx.push(k); } }
console.log(`KEY GRAMMAR over ${total} pool keys in ${blocks.length} blocks:`);
console.log(`  colon form  "<AXIS>: <band>"      ${colon}`);
console.log(`  axis-run    "<axis words> <BAND>" ${lowRun}`);
console.log(`  bare label  (no derivable axis)   ${bare}`);
console.log('  axis-run examples: ' + lowEx.join(' | '));
console.log('  bare examples: ' + bareEx.join(' | '));
// blocks with exactly one pool
const one = blocks.filter(b => b.pools.length === 1);
console.log(`\nblocks with exactly ONE pool (no siblings at all): ${one.length}` + (one.length ? ' -> ' + one.map(b => b.block).join(', ') : ''));
// same-axis sibling availability
let withSameAxis = 0, withAnySib = 0, keys = 0;
for (const b of blocks) { const ax = b.pools.map(([k]) => axisOf(k));
  b.pools.forEach(([k], i) => { keys++; const sibs = b.pools.filter((_, j) => j !== i);
    if (sibs.length) withAnySib++;
    if (ax[i] && sibs.some((_, j) => ax[b.pools.findIndex(p => p[0] === sibs[j][0])] === ax[i])) withSameAxis++; }); }
console.log(`pool keys with >=1 sibling key in the block: ${withAnySib}/${keys}`);
console.log(`pool keys with >=1 SAME-AXIS sibling:        ${withSameAxis}/${keys}`);
// does the existing R4 sibWords set already cover the band tokens?
const STOP = ['quantity','candidate','kind'];
let bandTokensTotal = 0, bandTokensCovered = 0; const uncovered = new Set();
for (const b of blocks) b.pools.forEach(([k], i) => {
  const sibs = b.pools.filter((_, j) => j !== i).map(p => p[0]);
  const sibWords = new Set(sibs.flatMap(s => s.toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/)).filter(w => w.length > 3 && !STOP.includes(w)));
  for (const s of sibs) { const a = axisOf(s); const band = a ? s.toLowerCase().replace(a, ' ') : s.toLowerCase();
    for (const w of band.replace(/[^a-z ]/g, ' ').split(/\s+/).filter(Boolean)) { bandTokensTotal++; if (sibWords.has(w)) bandTokensCovered++; else uncovered.add(w); } } });
console.log(`\nBAND TOKENS of sibling keys already inside the v1 R4 sibWords set: ${bandTokensCovered}/${bandTokensTotal}`);
console.log(`  band-token word types the v1 arm CANNOT see (len<=3 or stoplisted): ${[...uncovered].sort().join(' ')}`);
// corpus-wide: how many state variants carry a contrast shape, and how many of those sit in a pool with siblings
const shape = t => (t.toLowerCase().match(/\brather than\b|\bnot [^.,;]{1,40}, but\b|\bnot [^.,;]{1,40} but\b|, not [a-z][^.,;]{0,40}[.;]|\bnot [^.,;]{1,30}, (it|this|that) is\b|\bless [^.,;]{1,30} than\b/g) || []).length;
let nv = 0, withShape = 0, shapeInSibPool = 0;
for (const b of blocks) b.pools.forEach(([k, vs], i) => { const hasSib = b.pools.length > 1;
  for (const v of vs) { nv++; if (shape(v.text)) { withShape++; if (hasSib) shapeInSibPool++; } } });
console.log(`\nstate variants: ${nv}; carrying a contrast SHAPE: ${withShape}; of those, in a pool WITH sibling keys: ${shapeInSibPool}`);
