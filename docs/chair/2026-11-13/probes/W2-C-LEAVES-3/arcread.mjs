import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T]=process.argv.slice(2); const d=await import(T+'/src/domain/display/defenseDisplay.js'); const want=['r2r-hamlet-27','r2r-village-26','r2r-town-48'];
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  const caps=d.deriveSupportingCapabilities(s); const a=caps.find(c=>c.label==='Arcane Support');
  if(want.includes(seed)||/^r2s-(under_siege|famine|occupied)-(thorp|metropolis)-[01]$/.test(seed)) console.log(seed,'| hasArcane',s.defenseProfile?.traditions?.hasArcane,'| Arcane row:',a?`${a.status}: ${a.note.slice(0,70)}`:'(not printed)'); }
