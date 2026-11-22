// V33-JOINPROBE step 3's preface: WHAT MOVED IN THE POOL ITSELF (a new birth set, the line's generator), before anything is attributed.
//   node pool-compare.mjs <lane pooldir> <join pooldir>   (reads pool-shard*.json, poolb-shard*.json; prints a table; exit 0)
// The pool records per birth: seed, size, crisis, dial, (part B) the hideable houses it holds; per shard: rejections by step and tries.
// It records no trouble: the troubles of this tree's births are step 5's (hookgap.probe.jsx).
import { readFileSync, readdirSync } from 'node:fs';
const [A, B] = process.argv.slice(2);
const load = (dir, re) => readdirSync(dir).filter((f) => re.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
const sum = (shards) => {
  const births = shards.flatMap((s) => s.births);
  const by = {}; const rej = {}; const tried = {}; const held = {}; const heldN = {};
  for (const b of births) {
    by[b.size] = (by[b.size] || 0) + 1;
    for (const h of b.held || []) { held[`${b.size}|${h}`] = (held[`${b.size}|${h}`] || 0) + 1; }
    if (b.held) heldN[b.size] = (heldN[b.size] || 0) + b.held.length;
  }
  for (const s of shards) {
    for (const [size, r] of Object.entries(s.rejected || {})) { rej[size] = rej[size] || { n: 0, at: {} }; rej[size].n += r.n; for (const [k, v] of Object.entries(r.at || {})) rej[size].at[k] = (rej[size].at[k] || 0) + v; }
    for (const [size, c] of Object.entries(s.cost || {})) tried[size] = (tried[size] || 0) + c.tried;
  }
  return { births, by, rej, tried, held, heldN, seeds: new Set(births.map((b) => b.seed)), dial: Object.fromEntries(births.map((b) => [b.seed, b.dial])) };
};
for (const [part, re] of [['PART A (nothing hidden)', /^pool-shard\d+\.json$/], ['PART B (a hideable house held)', /^poolb-shard\d+\.json$/]]) {
  const a = sum(load(A, re)); const b = sum(load(B, re));
  console.log(`\n${part}: lane ${a.births.length} births, join ${b.births.length}`);
  for (const size of ['village', 'town', 'city', 'metropolis']) {
    const sa = [...a.seeds].filter((s) => s.includes(`-${size}-`)); const sb = [...b.seeds].filter((s) => s.includes(`-${size}-`));
    const both = sa.filter((s) => b.seeds.has(s));
    const dialSame = both.filter((s) => a.dial[s] === b.dial[s]).length;
    console.log(`  ${size.padEnd(10)} births ${a.by[size] ?? 0} -> ${b.by[size] ?? 0}; tried ${a.tried[size] ?? 0} -> ${b.tried[size] ?? 0}; rejected ${a.rej[size]?.n ?? 0} -> ${b.rej[size]?.n ?? 0} (${JSON.stringify(a.rej[size]?.at ?? {})} -> ${JSON.stringify(b.rej[size]?.at ?? {})}); seeds in both ${both.length} (dial equal on ${dialSame}); only lane ${sa.length - both.length}, only join ${sb.length - both.length}${a.heldN[size] !== undefined ? `; houses held ${a.heldN[size]} -> ${b.heldN[size]}` : ''}`);
  }
  const kinds = [...new Set([...Object.keys(a.held), ...Object.keys(b.held)])].sort();
  if (kinds.length) {
    console.log('  hideable houses held, by size|house: lane -> join (moved only)');
    for (const k of kinds) if ((a.held[k] || 0) !== (b.held[k] || 0)) console.log(`    ${k}: ${a.held[k] || 0} -> ${b.held[k] || 0}`);
  }
}
