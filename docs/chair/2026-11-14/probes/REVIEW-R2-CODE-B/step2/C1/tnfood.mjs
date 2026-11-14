import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births, out] = process.argv.slice(2);
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { composeTonightSheet } = await import(tree + '/src/domain/summary/tonightSheet.js');
const r={}; for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  r[seed]=(composeTonightSheet(s).facts||[]).find(f=>f.id==='food')?.text||''; }
fs.writeFileSync(out, JSON.stringify(r));
