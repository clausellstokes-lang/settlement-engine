import { readFileSync } from 'node:fs';
const d = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const ids = process.argv.slice(3);
for (const id of ids) {
  const p = d[id]; if (!p) { console.log('NO POOL', id); continue; }
  console.log('=== ' + id + '  meta=' + JSON.stringify(p.meta));
  for (const v of p.variants) console.log(`  v${v.vid} [${(v.marks||[]).join(' · ')}] ${v.text}`);
  for (const [ck, c] of Object.entries(p.cases).sort((a,b)=>b[1].towns-a[1].towns)) {
    console.log(`  CASE ${ck} towns=${c.towns} seeds=${c.seeds.slice(0,3).join(',')} aud=${JSON.stringify(c.audience)}`);
    console.log(`    slots=${JSON.stringify(c.slotsFilled)} dims=${JSON.stringify(c.dims)}`);
    console.log('    ' + Object.entries(c.variants).map(([vid, r]) => `v${vid}:p${r.player}/d${r.dm}/a${r.anchored}${r.wordsFalse?'/W'+r.wordsFalse:''}`).join(' '));
  }
}
