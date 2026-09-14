import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const B='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneB6';
const gdir=path.join(B,'src/data/dossierStateProse');
const tables={};
for (const f of readdirSync(gdir).filter(f=>f.endsWith('.generated.js'))) {
  const mod=await import(pathToFileURL(path.join(gdir,f)).href); Object.assign(tables, Object.values(mod)[0]);
}
const show=(id)=>{const b=tables[id];const rows=Object.entries(b.pools).map(([k,v])=>[k,v.length]);
  const n=rows.reduce((a,r)=>a+r[1],0);
  const h={}; rows.forEach(r=>h[r[1]]=(h[r[1]]||0)+1);
  console.log(`${id}: pools=${rows.length} variants=${n} hist=${JSON.stringify(h)}`);
  if(id!=='DS-GEN-3') rows.forEach(r=>console.log('   ',JSON.stringify(r[0]),r[1]));
};
show('DS-DEF-11'); show('DS-DEF-2'); show('DS-GEN-3');
// estate-wide: variants per pool, total text bytes
let tot=0,bytes=0,pools=0,mults=0;
for (const [id,b] of Object.entries(tables)) for (const [k,vs] of Object.entries(b.pools||{})) {
  pools++; tot+=vs.length; for(const v of vs) bytes+=Buffer.byteLength(v.text,'utf8');
}
console.log('ESTATE pools',pools,'variants',tot,'textBytes',bytes,'meanTextBytes',(bytes/tot).toFixed(1));
