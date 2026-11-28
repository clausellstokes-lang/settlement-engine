// idiff.mjs <a> <b> — paired by seed; npcs and relationships keyed by id (identity), every other array by index.
// Prints births that differ, cards added/removed, and moved leaf paths by family with the births they touch.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [A, B] = process.argv.slice(2);
const load = async (f) => { const m = new Map(); for await (const l of readline.createInterface({ input: fs.createReadStream(f).pipe(zlib.createGunzip()) })) { if (!l) continue; const r = JSON.parse(l); m.set(r.seed || r.key, r.s || r.rec); } return m; };
const keyed = (s) => ({ ...s, npcs: Object.fromEntries((s.npcs || []).map((c) => [c.id, c])), relationships: Object.fromEntries((s.relationships || []).map((t) => [t.id, t])), _npcOrder: (s.npcs || []).map((c) => c.id) });
const leaves = (v, p, o) => { if (v && typeof v === 'object') { const ks = Object.keys(v); if (!ks.length) o[p] = JSON.stringify(v); for (const k of ks) leaves(v[k], p + (Array.isArray(v) ? `[${k}]` : `.${k}`), o); } else o[p] = v; return o; };
const a = await load(A), b = await load(B); const fam = {}; let diff = 0; const C = { added: 0, removed: 0 }; const addedEx = [];
for (const [k, x0] of a) { const y0 = b.get(k); if (JSON.stringify(x0) === JSON.stringify(y0)) continue; diff++;
  const x = keyed(x0), y = keyed(y0);
  for (const id of Object.keys(y.npcs)) if (!x.npcs[id]) { C.added++; addedEx.length < 6 && addedEx.push(`${k}: +${id} ${y.npcs[id].name}, ${y.npcs[id].title}`); }
  for (const id of Object.keys(x.npcs)) if (!y.npcs[id]) C.removed++;
  const la = leaves(x, '', {}), lb = leaves(y, '', {}); const seen = new Set();
  for (const p of new Set([...Object.keys(la), ...Object.keys(lb)])) { if (la[p] === lb[p]) continue;
    const f = p.replace(/^\.(npcs|relationships)\.[^.[]+/, '.$1{}').replace(/\[\d+\]/g, '[]');
    fam[f] ||= { n: 0, births: 0, ex: '' }; fam[f].n++; if (!seen.has(f)) { seen.add(f); fam[f].births++; if (!fam[f].ex) fam[f].ex = `${k}: ${String(JSON.stringify(la[p])).slice(0, 70)} -> ${String(JSON.stringify(lb[p])).slice(0, 70)}`; } } }
console.log('births', a.size, 'differ', diff, C); addedEx.forEach((e) => console.log('  ', e));
for (const [f, v] of Object.entries(fam).sort((p, q) => q[1].n - p[1].n)) console.log(String(v.n).padStart(7), String(v.births).padStart(5), f, '|', v.ex);
