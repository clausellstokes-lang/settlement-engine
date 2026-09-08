import fs from 'node:fs';
const SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad';
const load=(p)=>{const j=JSON.parse(fs.readFileSync(p,'utf8'));return j.receipt??j;};
const A=load(`${SC}/soak909/fresh-30y-4s-lit.json`);
const B=load(`${SC}/capacity-horizon/artifacts/probe-30y-12s-lit.json`);
const C=load(`${SC}/capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json`);
const D=load(`${SC}/capacity-horizon/artifacts/horizon-600y-4s-lit.json`);
for(const [n,r] of [['909-30y-4s-lit',A],['THIS-30y-12s-lit',B],['907-300y-4s',C],['THIS-600y-4s',D]]){
  const y1=r.yearlyPopulations?r.yearlyPopulations[0]:null;
  const rd0=r.behavioral?.yearly?.[0]?.realmDemography;
  const rdL=r.behavioral?.yearly?.[r.behavioral.yearly.length-1]?.realmDemography;
  console.log(n,'seed',r.seed);
  console.log('   year1 pops',JSON.stringify(y1),' sum',y1?y1.reduce((a,b)=>a+b,0):'n/a');
  console.log('   realmDemog y1 pop',rd0?.population,'load',rd0?.loadRatio01?.toFixed(4),'| last pop',rdL?.population,'load',rdL?.loadRatio01?.toFixed(4),'bound',rdL?.bound);
}
