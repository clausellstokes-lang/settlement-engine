import fs from 'node:fs';
const SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad';
const L=p=>{const j=JSON.parse(fs.readFileSync(p,'utf8'));return j.receipt??j;};
const c907=L(`${SC}/capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json`);
const d600=L(`${SC}/capacity-horizon/artifacts/horizon-600y-4s-lit.json`);
const s=(a,n)=>a.slice(0,n).reduce((x,y)=>x+y,0);
const r30_907=s(c907.yearlyMs,30)/120/1000, r30_600=s(d600.yearlyMs,30)/120/1000;
console.log('rate(4,30) from 907 world (same fixture family, first 30 y):', r30_907.toFixed(4),'s/sy');
console.log('rate(4,30) from 600y world (same family, first 30 y):     ', r30_600.toFixed(4),'s/sy');
console.log('rate(4,30) w0-soak (what the lane used):                  0.4585 s/sy');
console.log('rate(12,30) this lane:                                    0.6795 s/sy');
console.log('f_S(12) as the lane computed (w0-soak denominator):', (0.6795/0.4585).toFixed(4));
console.log('f_S(12) with 907-family denominator:               ', (0.6795/r30_907).toFixed(4));
console.log('f_S(12) with 600y-family denominator:              ', (0.6795/r30_600).toFixed(4));
const rate4_300_A=762290/1200/1000, rate4_300_B=s(d600.yearlyMs,300)/1200/1000;
console.log('rate(4,300) seedA',rate4_300_A.toFixed(4),' seedB',rate4_300_B.toFixed(4),' spread %',(100*(rate4_300_B/rate4_300_A-1)).toFixed(1));
for(const [lbl,fs_] of [['lane 1.4820',1.4820],['907-fam',0.6795/r30_907],['600-fam',0.6795/r30_600]]){
  const lo=rate4_300_A*fs_, hi=rate4_300_B*fs_;
  const aLo=3600*lo, aHi=3600*hi;
  console.log(`  ${lbl}: rate(12,300) ${lo.toFixed(4)}..${hi.toFixed(4)}  A+B ${(2*aLo).toFixed(0)}..${(2*aHi).toFixed(0)} s = ${(2*aLo/3600).toFixed(2)}..${(2*aHi/3600).toFixed(2)} h  darktwin*1.1094 ${(2*aLo*1.1094/3600).toFixed(2)}..${(2*aHi*1.1094/3600).toFixed(2)} h  TOTAL ${((2*aLo*2.1094)/3600).toFixed(2)}..${((2*aHi*2.1094)/3600).toFixed(2)} h`);
}
