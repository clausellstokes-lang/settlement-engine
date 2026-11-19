// TAIL-TITLES: the lines kprint counts, by section and by face, sampled: node klines.mjs <before> <after> <dumps>
import fs from 'node:fs'; import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const L = require('./load.cjs'); const [A, B, D] = process.argv.slice(2);
const a = Object.fromEntries(L(A).map((r) => [r.seed, r.s])); const by = {};
const word = (t) => String(t).replace(/^the /, '').toLowerCase();
for (const { seed, s } of L(B)) {
  const moved = s.npcs.map((n, i) => [a[seed].npcs[i], n]).filter(([o, n]) => o && o.title !== n.title);
  if (!moved.length) continue; let cur = '';
  for (const l of fs.readFileSync(`${D}/${seed}.txt`, 'utf8').split('\n')) { const m = /^== (.+) ==$/.exec(l); if (m) { cur = m[1]; continue; } const ll = l.toLowerCase();
    for (const [o] of moved) if (ll.includes(o.name.toLowerCase()) && ll.includes(word(o.title))) (by[cur + ' · ' + o.title] ??= []).push(`${seed}: ${l.trim().slice(0, 230)}`); }
}
for (const [k, v] of Object.entries(by).sort((x, y) => y[1].length - x[1].length)) { console.log(`== ${v.length} ${k}`); v.slice(0, Number(process.env.N || 2)).forEach((x) => console.log('   ' + x)); }
