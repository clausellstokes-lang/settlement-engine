import { createReadStream } from 'node:fs'; import { createInterface } from 'node:readline';
const [, , A, B] = process.argv; const REV = 1 << 16; const idx = (v) => (v >= REV ? v - REV : v);
const read = async (f) => { const m = new Map(); for await (const l of createInterface({ input: createReadStream(f) })) { if (!l.trim()) continue; const r = JSON.parse(l); m.set(r.key, { rels: r.doc.relationships || [], prom: r.doc.prominentRelationship }); } return m; };
for (const c of ['golden', 'census']) { const a = await read(`${A}/${c}.jsonl`), b = await read(`${B}/${c}.jsonl`);
  let changed = 0, notRep = 0, otherField = 0, promMoved = 0, promNotFromMoved = 0;
  for (const [k, x] of a) { const y = b.get(k); const seen = new Set(); const moved = new Set();
    x.rels.forEach((r, i) => { const key = `${r.archetypeKey}#${idx(r.proseVariant)}`; const rep = seen.has(key); seen.add(key); const s = y.rels[i];
      const diff = Object.keys({ ...r, ...s }).filter((f) => JSON.stringify(r[f]) !== JSON.stringify(s[f]));
      if (diff.length) { changed++; moved.add(r.description); if (!rep) notRep++; if (diff.some((f) => !['description', 'tension', 'proseVariant'].includes(f))) otherField++; } });
    if (JSON.stringify(x.prom) !== JSON.stringify(y.prom)) { promMoved++; const txt = JSON.stringify(x.prom); if (![...moved].some((d) => txt.includes(String(d).slice(0, 25)))) promNotFromMoved++; } }
  console.log(`${c}: ties changed ${changed} · of them NOT a base repeat ${notRep} · with a field other than description/tension/proseVariant ${otherField} · prominentRelationship moved ${promMoved} (not traceable to a moved tie: ${promNotFromMoved})`); }
