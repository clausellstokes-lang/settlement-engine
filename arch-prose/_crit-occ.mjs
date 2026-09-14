import { readFileSync } from 'node:fs'; import { pathToFileURL } from 'node:url';
const o=JSON.parse(readFileSync('_c-occ200.out.json','utf8'));
console.log('cells listed:',o.cells.length,'N',o.N);
const m=new Map(o.cells.map(([k,v])=>[k,v]));
const B='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneB6';
const mod=await import(pathToFileURL(`${B}/src/data/dossierStateProse/general.generated.js`).href);
const T=Object.values(mod)[0];
for(const blk of ['DS-GEN-3']){
  const dead=[],live=[];
  for(const k of Object.keys(T[blk].pools)){const key=`${blk}::${k}`; (m.has(key)?live:dead).push([k,m.get(key)||0]);}
  console.log(blk,'pools',live.length+dead.length,'fired',live.length,'never-fired',dead.length);
  dead.forEach(d=>console.log('   NEVER FIRED:',d[0]));
}
// group by fact family for DS-GEN-3
const fam={};
for(const [k,v] of o.cells){ if(!k.startsWith('DS-GEN-3::')) continue; const f=k.slice(10).split(':')[0]; fam[f]=(fam[f]||0)+v; }
console.log('DS-GEN-3 per-fact firing totals (should be ~200 each):',JSON.stringify(fam,null,1));
// distribution stats of the 56 cells
const rates=o.cells.map(c=>c[1]/o.N).sort((a,b)=>a-b);
const q=(p)=>rates[Math.floor(p*(rates.length-1))];
console.log('rate quantiles: min',q(0).toFixed(3),'p25',q(.25).toFixed(3),'median',q(.5).toFixed(3),'p75',q(.75).toFixed(3),'max',q(1).toFixed(3));
console.log('cells <=0.05:',rates.filter(r=>r<=0.05).length,'<=0.10:',rates.filter(r=>r<=0.10).length,'>=0.05:',rates.filter(r=>r>=0.05).length);
