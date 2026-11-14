import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births] = process.argv.slice(2);
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { composeTonightSheet } = await import(tree + '/src/domain/summary/tonightSheet.js');
let sk=null; try { sk = await import(tree + '/src/domain/people/seatKeeper.js'); } catch {}
const out=[];
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const k = sk?.seatKeeperOf(s); if (!k) continue; const form = sk.keeperFormOf(s); const j = composeTonightSheet(s);
  const p = (j.people||[]).find(x=>x.name===k.name); out.push({seed, keeper:k.name, stored:k.role||k.title, form, onSheet: !!p, sheetRole: p?.role, why:p?.why, castLabel:p?.castLabel, line:p?.line}); }
fs.writeFileSync(process.argv[4], JSON.stringify(out,null,1)); console.log('vacant seats with keeper', out.length, 'keeper on sheet', out.filter(o=>o.onSheet).length, 'styled Acting', out.filter(o=>o.onSheet&&/^Acting /.test(o.sheetRole)).length, 'bare stored role', out.filter(o=>o.onSheet&&o.sheetRole===o.stored).length);
