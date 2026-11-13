// REVIEW-POWERS-3 fielddiff.mjs — BASE=<corpus.ndjson.gz> TIP=<corpus.ndjson.gz> OUT=<file.json> node fielddiff.mjs
// A field diff of two census-2 corpora, seed by seed: which families of the settlement record moved, in how many towns,
// with examples. Cards are matched by id, factions by name, relationships by (from,to,archetypeKey) and by position.
import fs from 'node:fs'; import zlib from 'node:zlib';
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const B = load(process.env.BASE), T = load(process.env.TIP);
const C = {}; const hit = (k, seed, ex) => { const c = (C[k] ||= { towns: new Set(), n: 0, ex: [] }); c.towns.add(seed); c.n++; if (c.ex.length < 6 && ex) c.ex.push(`${seed}: ${ex}`.slice(0, 400)); };
const J = (x) => JSON.stringify(x ?? null);
const VOL = new Set(['generationCoherenceReceipt', 'simulationTrace', 'id']);
for (const [seed, t] of T) { const b = B.get(seed); if (!b) { hit('_missing_in_base', seed); continue; }
  const keys = new Set([...Object.keys(b), ...Object.keys(t)]);
  for (const k of keys) { if (!(k in b)) hit(`+key ${k}`, seed); if (!(k in t)) hit(`-key ${k}`, seed); }
  for (const k of keys) {
    if (['npcs', 'relationships', 'powerStructure'].includes(k)) continue;
    if (J(b[k]) !== J(t[k])) hit(`${VOL.has(k) ? '(volatile) ' : ''}${k}`, seed);
  }
  // npcs
  const bn = new Map((b.npcs || []).map((n) => [n.id, n])), tn = new Map((t.npcs || []).map((n) => [n.id, n]));
  for (const id of tn.keys()) if (!bn.has(id)) hit('npcs: card added', seed, `${tn.get(id).name} (${tn.get(id).title})`);
  for (const id of bn.keys()) if (!tn.has(id)) hit('npcs: card removed', seed, `${bn.get(id).name} (${bn.get(id).title})`);
  for (const [id, x] of tn) { const y = bn.get(id); if (!y) continue; const fk = new Set([...Object.keys(x), ...Object.keys(y)]);
    for (const f of fk) { if (!(f in y)) hit(`npcs: +field ${f}`, seed); if (!(f in x)) hit(`npcs: -field ${f}`, seed);
      if (f === 'goal' || f === 'secret' || f === 'presentation' || f === 'personality') { for (const g of new Set([...Object.keys(x[f] || {}), ...Object.keys(y[f] || {})])) if (J(x[f]?.[g]) !== J(y[f]?.[g])) hit(`npcs.${f}.${g}`, seed, `${x.name} (${x.title}): ${J(y[f]?.[g]).slice(0, 150)} -> ${J(x[f]?.[g]).slice(0, 150)}`); continue; }
      if (J(x[f]) !== J(y[f])) hit(`npcs.${f}`, seed, `${x.name} (${x.title}, ${x.category}): ${J(y[f]).slice(0, 150)} -> ${J(x[f]).slice(0, 150)}`); } }
  // relationships
  const br = b.relationships || [], tr = t.relationships || [];
  if (br.length !== tr.length) hit('relationships: count', seed, `${br.length} -> ${tr.length}`);
  const keyR = (r) => `${r.from}>${r.to}`; const bm = new Map(br.map((r) => [keyR(r), r]));
  for (const r of tr) { const o = bm.get(keyR(r)); if (!o) { hit('relationships: pair new', seed); continue; }
    for (const f of new Set([...Object.keys(r), ...Object.keys(o)])) if (J(r[f]) !== J(o[f])) hit(`relationships.${f}`, seed, `${J(o[f]).slice(0, 140)} -> ${J(r[f]).slice(0, 140)}`); }
  // powerStructure
  const bp = b.powerStructure || {}, tp = t.powerStructure || {};
  for (const k of new Set([...Object.keys(bp), ...Object.keys(tp)])) { if (k === 'factions') continue; if (!(k in bp)) hit(`powerStructure +key ${k}`, seed); if (J(bp[k]) !== J(tp[k])) {
    if (k === 'conflicts' && Array.isArray(tp[k])) { (tp[k] || []).forEach((c, i) => { const o = (bp[k] || [])[i] || {}; for (const f of new Set([...Object.keys(c), ...Object.keys(o)])) if (J(c[f]) !== J(o[f])) hit(`powerStructure.conflicts.${f}`, seed, `${J(o[f]).slice(0, 140)} -> ${J(c[f]).slice(0, 140)}`); }); }
    else hit(`powerStructure.${k}`, seed, `${J(bp[k]).slice(0, 120)} -> ${J(tp[k]).slice(0, 120)}`); } }
  const bf = new Map((bp.factions || []).map((f) => [f.faction, f])), tf = new Map((tp.factions || []).map((f) => [f.faction, f]));
  if (J([...bf.keys()]) !== J([...tf.keys()])) hit('powerStructure.factions: roster/order', seed, `${[...bf.keys()]} -> ${[...tf.keys()]}`);
  for (const [n, f] of tf) { const o = bf.get(n); if (!o) continue; for (const k of new Set([...Object.keys(f), ...Object.keys(o)])) { if (!(k in o)) hit(`factions +field ${k}`, seed); if (J(f[k]) !== J(o[k])) hit(`factions.${k}`, seed, `${n} ${f.powerLabel}: ${J(o[k]).slice(0, 200)} -> ${J(f[k]).slice(0, 200)}`); } }
  // top-level conflicts
  if (J(b.conflicts) !== J(t.conflicts)) (t.conflicts || []).forEach((c, i) => { const o = (b.conflicts || [])[i] || {}; for (const f of new Set([...Object.keys(c || {}), ...Object.keys(o)])) if (J(c?.[f]) !== J(o[f])) hit(`conflicts.${f}`, seed, `${J(o[f]).slice(0, 140)} -> ${J(c?.[f]).slice(0, 140)}`); });
}
const out = Object.fromEntries(Object.entries(C).sort().map(([k, c]) => [k, { towns: c.towns.size, n: c.n, ex: c.ex }]));
fs.writeFileSync(process.env.OUT, JSON.stringify(out, null, 1));
for (const [k, c] of Object.entries(out)) console.log(`${k} :: ${c.towns} towns, ${c.n}`);
