// q.mjs <elig.ndjson> <pool id substring> [vid] : per variant, towns eligible / drawn, by crisis; with vid, the seeds
import fs from 'node:fs';
const [F, sub, vid] = process.argv.slice(2);
const rows = fs.readFileSync(F, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => r.p);
const crisisOf = (s) => s.split('-')[2];
const pools = new Set(); for (const r of rows) for (const id of Object.keys(r.p)) if (id.includes(sub)) pools.add(id);
for (const id of pools) {
  const per = {}; let reached = 0, empty = 0;
  for (const r of rows) { const o = r.p[id]; if (!o) continue; reached++; if (!o.e.length) empty++;
    for (const v of o.e) { const x = per[v] ||= { e: 0, d: 0, cr: {}, seeds: [], dseeds: [] }; x.e++; x.cr[crisisOf(r.seed)] = (x.cr[crisisOf(r.seed)] || 0) + 1; x.seeds.push(r.seed); if (o.d.includes(v)) { x.d++; x.dseeds.push(r.seed); } } }
  console.log(`== ${id}  reached ${reached}, nothing eligible ${empty}`);
  for (const [v, x] of Object.entries(per).sort((a, b) => a[0] - b[0])) {
    if (vid && v !== vid) continue;
    console.log(`  v${v}: elig ${x.e} drawn ${x.d}  ${Object.entries(x.cr).map(([c, n]) => c + ':' + n).join(' ')}`);
    if (vid) console.log('   elig:', x.seeds.join(' '), '\n   drawn:', x.dseeds.join(' '));
  }
}
