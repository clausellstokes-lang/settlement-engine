import fs from 'node:fs';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const {evaluateReceipt}=await import(`${DOCK}/scripts/soak/evaluate.mjs`);
const {TRIPWIRES}=await import(`${DOCK}/scripts/soak/tripwires.mjs`);
const f=process.argv[2];
const r=JSON.parse(fs.readFileSync(f,'utf8'));
const ev=evaluateReceipt(r);
console.log('FILE',f);
console.log('years',r.years,'settlements',r.settlements,'seed',r.seed,'schema',r.schemaVersion);
console.log('deterministicFirings',ev.deterministicFirings);
console.log('fullInstrument',ev.annotated.fullInstrument);
console.log('notExecutable',JSON.stringify(ev.notExecutable),'annotated.notExecutable',JSON.stringify(ev.annotated.notExecutable));
console.log('observability',JSON.stringify(ev.observability));
for(const fi of ev.findings) console.log('FINDING',fi.id,JSON.stringify(fi).slice(0,600));
for(const row of TRIPWIRES.filter(t=>t.id.startsWith('capacity_'))){
  const gated = typeof row.gate==='function'?row.gate(r):true;
  console.log('ROW',row.id,'gate',gated,'requires',JSON.stringify(row.requires),'horizonReq',row.horizon?.required,'obs',typeof row.horizon?.observed==='function'?row.horizon.observed(r):null,'fired',ev.findings.filter(x=>x.id===row.id).length);
}
const y=r.behavioral?.yearly||[];
const lr=y.map((e,i)=>[i+1,e?.realmDemography?.loadRatio01]).filter(x=>typeof x[1]==='number');
if(lr.length){console.log('loadRatio01 count',lr.length,'last',JSON.stringify(lr[lr.length-1]));
 for(const yr of [10,100,200,230,300,350,400,450,470,500,550,600]) {const e=lr.find(x=>x[0]===yr); if(e) console.log('  y'+yr, e[1].toFixed(4));}
 const outside=lr.filter(x=>x[1]<0.6||x[1]>1.05);
 console.log('  outside-window years count',outside.length,'last outside', outside.length?outside[outside.length-1][0]:null,'min',Math.min(...lr.map(x=>x[1])).toFixed(4),'argmin',lr[lr.map(x=>x[1]).indexOf(Math.min(...lr.map(x=>x[1])))][0]);
 const first=lr.find(x=>x[1]>=0.6&&x[1]<=1.05); console.log('  first inside year',first&&first[0],first&&first[1].toFixed(4));
}
