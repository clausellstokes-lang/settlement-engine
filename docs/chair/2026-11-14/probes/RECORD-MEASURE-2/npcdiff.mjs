// RECORD-MEASURE-2 · which card fields moved, and the title moves: node npcdiff.mjs <before corpus> <after corpus>
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const L = require('./load.cjs'); const [A, B] = process.argv.slice(2);
const a = Object.fromEntries(L(A).map((r) => [r.seed, r.s]));
const fields = {}, moves = {}, rel = {}, other = {};
for (const { seed, s } of L(B)) {
  const x = a[seed];
  (s.npcs || []).forEach((n, i) => { const o = x.npcs[i] || {}; for (const k of new Set([...Object.keys(o), ...Object.keys(n)])) if (JSON.stringify(o[k]) !== JSON.stringify(n[k])) { (fields[k] ??= new Set()).add(seed); if (k === 'title') { const m = `${n.gender} ${o.title} -> ${n.title}`; moves[m] = (moves[m] || 0) + 1; } } });
  (s.relationships || []).forEach((r, i) => { const o = x.relationships[i] || {}; for (const k of new Set([...Object.keys(o), ...Object.keys(r)])) if (JSON.stringify(o[k]) !== JSON.stringify(r[k])) (rel[k] ??= new Set()).add(seed); });
  for (const k of ['stress', 'stressors', 'pressureSentence']) if (JSON.stringify(x[k]) !== JSON.stringify(s[k])) { const A1 = JSON.stringify(x[k]), B1 = JSON.stringify(s[k]); let j = 0; while (A1[j] === B1[j]) j++; (other[k] ??= []).push(seed + ': ' + A1.slice(Math.max(0, j - 40), j + 40) + ' => ' + B1.slice(Math.max(0, j - 40), j + 40)); }
}
console.log('npc fields moved (towns):', Object.entries(fields).map(([k, v]) => `${k} ${v.size}`).join(', '));
console.log('relationship fields moved (towns):', Object.entries(rel).map(([k, v]) => `${k} ${v.size}`).join(', '));
console.log('title moves (cards):'); for (const [m, v] of Object.entries(moves).sort((p, q) => q[1] - p[1])) console.log('  ' + v + '\t' + m);
for (const [k, v] of Object.entries(other)) { console.log(k, v.length); v.slice(0, 2).forEach((l) => console.log('   ' + l)); }
