// TAIL-TITLES: the non-word moves of K-C: node kcdiff.mjs <before> <after>
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const L = require('./load.cjs'); const [A, B] = process.argv.slice(2);
const a = Object.fromEntries(L(A).map((r) => [r.seed, r.s]));
const out = {};
const show = (k, seed, o, n) => (out[k] ??= []).push(`${seed}: ${JSON.stringify(o)?.slice(0, 160)} => ${JSON.stringify(n)?.slice(0, 160)}`);
for (const { seed, s } of L(B)) {
  const x = a[seed];
  (s.npcs || []).forEach((n, i) => { const o = x.npcs[i] || {};
    for (const k of ['goal', 'name', 'stressNote']) if (JSON.stringify(o[k]) !== JSON.stringify(n[k])) show(k, seed + ' ' + n.gender + ' ' + n.role, o[k], n[k]);
    if (JSON.stringify(o.structuralPosition) !== JSON.stringify(n.structuralPosition)) { const w = (v) => JSON.stringify(v).split(String(o.title)).join('§').split(String(n.title)).join('§'); if (w(o.structuralPosition) !== w(n.structuralPosition)) show('structuralPosition(non-word)', seed, o.structuralPosition, n.structuralPosition); }
  });
  (s.relationships || []).forEach((r, i) => { const o = x.relationships[i] || {}; for (const k of ['description', 'tension', 'npc1Name', 'npc2Name']) if (JSON.stringify(o[k]) !== JSON.stringify(r[k])) show('rel.' + k, seed, o[k], r[k]); });
  const ord = (t) => (t.npcs || []).map((n) => n.id).join(','); if (ord(x) !== ord(s)) show('npc order', seed, '', '');
}
for (const [k, v] of Object.entries(out)) { console.log(`== ${k} ${v.length}`); v.slice(0, Number(process.env.N || 6)).forEach((l) => console.log('  ' + l)); }
