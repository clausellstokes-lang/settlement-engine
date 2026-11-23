// 13G: compare two hash13g.mjs outputs. usage: node compare13g.mjs <before.tsv> <after.tsv> [named seeds, comma-separated]
// Prints, per column (lit, dark), the births equal and the births moved; a moved birth outside the named list is a STOP.
import { readFileSync } from 'node:fs';
const read = (p) => new Map(readFileSync(p, 'utf8').split('\n').filter((l) => l && !l.startsWith('#') && !l.startsWith('seed\t')).map((l) => { const [s, lit, dark] = l.split('\t'); return [s, { lit, dark }]; }));
const [a, b, named = ''] = process.argv.slice(2);
const A = read(a); const B = read(b); const NAMED = new Set(named.split(',').filter(Boolean));
if (A.size !== B.size || [...A.keys()].some((k) => !B.has(k))) throw new Error('the two runs do not hold the same births');
for (const col of ['lit', 'dark']) {
  const moved = [...A].filter(([s, h]) => h[col] !== B.get(s)[col]).map(([s]) => s);
  console.log(JSON.stringify({ col, births: A.size, equal: A.size - moved.length, moved, movedOutsideNamed: moved.filter((s) => !NAMED.has(s)) }));
}
