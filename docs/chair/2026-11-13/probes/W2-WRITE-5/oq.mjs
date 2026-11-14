// oq.mjs <dumpsDir> <pool substring> [vid] : on the OWNER's page, per vid: towns eligible / drawn, by crisis; with vid, the drawn seeds
import fs from 'node:fs'; import path from 'node:path';
const [D, sub, vid] = process.argv.slice(2);
const per = {}; let reached = 0;
for (const f of fs.readdirSync(D).filter((f) => f.endsWith('.draws.json'))) {
  const seed = f.replace('.draws.json', ''); const d = JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
  for (const [id, o] of Object.entries(d)) { if (!id.includes(sub)) continue; const p = per[id] ||= { reached: 0, empty: 0, v: {} }; p.reached++; if (!o.e.length) p.empty++;
    for (const v of o.e) { const x = p.v[v] ||= { e: 0, d: 0, cr: {}, ds: [] }; x.e++; const c = seed.split('-').slice(1, 3).join('-').replace(/^[a-z]+-/, ''); x.cr[c] = (x.cr[c] || 0) + 1; if (o.d.includes(v)) { x.d++; x.ds.push(seed); } } } }
for (const [id, p] of Object.entries(per)) { console.log(`== ${id}  reached ${p.reached}, nothing eligible ${p.empty}`);
  for (const [v, x] of Object.entries(p.v)) { if (vid && v !== vid) continue; console.log(`  v${v}: elig ${x.e} drawn ${x.d}  ${Object.entries(x.cr).map(([c, n]) => c + ':' + n).join(' ')}`); if (vid) console.log('   drawn:', x.ds.join(' ')); } }
