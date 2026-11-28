// PG M2: the cause by key. node c2-an.mjs <c2-<pool>.json>
import { readFileSync } from 'node:fs';
const M = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const rows = {}; const E = {}; const laws = {}; let prose = 0; let errs = 0;
for (const t of M.towns) {
  for (const [k, v] of Object.entries(t.keys)) {
    const r = (rows[k] ??= { A: 0, B: 0, C: 0, Dsame: 0, Dn: 0, ex: null });
    if (!v.A) r.A += 1; if (!v.B) r.B += 1; if (!v.C) { r.C += 1; r.ex ??= `${t.seed}: stored ${v.ex.stored} today's engine ${v.ex.C}`; }
    if (v.D !== null) { r.Dn += 1; if (v.D) r.Dsame += 1; }
  }
  for (const [g, v] of Object.entries(t.E)) { const e = (E[g] ??= { same: 0, defense: 0, overview: 0, summary: 0, anyDiff: 0 }); if (v === 'same values') { e.same += 1; continue; } if (v[0] === 'differs') e.defense += 1; if (v[1] === 'differs') e.overview += 1; if (v[2] === 'differs') e.summary += 1; if (v.includes('differs')) e.anyDiff += 1; }
  const lk = JSON.stringify(t.lawsServed) + (JSON.stringify(t.lawsServed) === JSON.stringify(t.lawsStored) ? ' (= stored)' : ' (!= stored)'); laws[lk] = (laws[lk] || 0) + 1;
  if (t.proseServed) prose += 1; if (Object.keys(t.errs).length) errs += 1;
}
console.log(`POOL ${M.pool} towns ${M.towns.length}; master writers loaded: ${M.masterLoaded}; towns with a master-writer error: ${errs}`);
console.log('key | A page differs | B with the record\'s own config | C today\'s engine over the FULL record | D master\'s engine equals stored');
for (const [k, r] of Object.entries(rows)) console.log(`${k} | ${r.A} | ${r.B} | ${r.C} | ${r.Dsame}/${r.Dn}`);
console.log('examples (C):'); for (const [k, r] of Object.entries(rows)) if (r.ex) console.log(`  ${k}: ${r.ex}`);
console.log('E, the owner\'s page with today\'s values in place of the stored ones (towns whose tab text changes):'); for (const [g, e] of Object.entries(E)) console.log(`  ${g}: values equal on ${e.same}; changes Defense ${e.defense}, Overview ${e.overview}, Summary ${e.summary}; any ${e.anyDiff}`);
console.log('F, the law markers on the SERVED config:'); for (const [k, n] of Object.entries(laws)) console.log(`  ${n}x ${k}`);
console.log(`F, publicProse served: ${prose} of ${M.towns.length}`);
