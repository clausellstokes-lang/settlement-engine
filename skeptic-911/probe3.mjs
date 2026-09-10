import fs from 'node:fs';
const SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad';
const b=JSON.parse(fs.readFileSync(`${SC}/capacity-horizon/artifacts/horizon-600y-4s-lit.json`,'utf8'));
const ym=b.yearlyMs; let c=0;
// which prefix length gives 0.8051 s/sy on its own settlement-years?
for(let n=1;n<=600;n++){ c+=ym[n-1]; const r=c/(n*4)/1000; if(Math.abs(r-0.8051)<0.0006) console.log('prefix',n,'rate',r.toFixed(4),'cum s',(c/1000).toFixed(1)); }
// target cumulative 966.1s
let c2=0; for(let n=1;n<=600;n++){c2+=ym[n-1]; if(Math.abs(c2/1000-966.1)<3) console.log('cum~966.1 at year',n,(c2/1000).toFixed(1));}
console.log('--- exact through-y300:', (ym.slice(0,300).reduce((s,v)=>s+v,0)/1000).toFixed(2),'s ; /1200 =', (ym.slice(0,300).reduce((s,v)=>s+v,0)/1200/1000).toFixed(4));
// AFTER-car3 seed
for(const f of ['fresh-30y-4s-lit-AFTER-car3.json','fresh-30y-4s-lit.json','fresh-30y-4s.json']){
  const j=JSON.parse(fs.readFileSync(`${SC}/soak909/${f}`,'utf8')); const r=j.receipt??j;
  console.log(f,'seed=',r.seed,'years',r.years,'settlements',r.settlements,'demog',r.subsystems?.rules?.demographicsEnabled,'runA',r.runDurationsMs.primary);
}
