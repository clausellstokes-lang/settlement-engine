import fs from 'node:fs';
const P='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/';
const list=[['600y-4s LIT',P+'capacity-horizon/artifacts/horizon-600y-4s-lit.json'],
['300y-4s LIT (907)',P+'capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json'],
['30y-4s LIT (909)',P+'soak909/fresh-30y-4s-lit.json'],
['30y-4s LIT c3(909)',P+'soak909/fresh-30y-4s-lit-AFTER-car3.json'],
['30y-12s LIT',P+'capacity-horizon/artifacts/probe-30y-12s-lit.json']];
console.log('run'.padEnd(20),'yrs  setts  meanRealmPop  ms/settYear   µs per soul-year');
for(const [k,f] of list){const j=JSON.parse(fs.readFileSync(f,'utf8'));
 let mean=null;
 if(Array.isArray(j.yearlyPopulations)&&j.yearlyPopulations.length){
   mean=j.yearlyPopulations.reduce((a,r)=>a+r.reduce((x,y)=>x+y,0),0)/j.yearlyPopulations.length;
 } else {
   const sv=(j.behavioral?.yearly||[]).map(e=>(e?.stateVectors||[]).reduce((a,s)=>a+(Number(s?.population)||0),0));
   if(sv.length&&sv.some(v=>v>0)) mean=sv.reduce((a,b)=>a+b,0)/sv.length;
 }
 const mspsy=j.runDurationsMs.primary/(j.years*j.settlements);
 const perSoul= mean? (j.runDurationsMs.primary*1000/(j.years*mean)) : null;
 console.log(k.padEnd(20),String(j.years).padStart(4),String(j.settlements).padStart(5),String(mean?mean.toFixed(0):'n/a').padStart(12),mspsy.toFixed(1).padStart(11),(perSoul?perSoul.toFixed(2):'n/a').padStart(14));
}
