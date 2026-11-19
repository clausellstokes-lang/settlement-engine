import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T]=process.argv.slice(2); const d=await import(T+'/src/domain/display/defenseDisplay.js');
let n=0,pres=0,lose=0; const ex=[];
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l); n++;
  const row=d.deriveSupportingCapabilities(s).find(c=>c.label==='Arcane Support'); if(row?.status==='Present') pres++;
  if(row?.status==='Present' && s.defenseProfile?.traditions?.hasArcane!==true){ lose++; if(ex.length<6) ex.push(`${seed} | ${row.note.slice(0,70)} | ${JSON.stringify(s.defenseProfile?.traditions)}`); } }
console.log(`towns ${n}; Arcane Support Present ${pres}; of them the profile's hasArcane not true ${lose}`); console.log(ex.join('\n'));
