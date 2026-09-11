import fs from 'node:fs';
const SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad';
const j=JSON.parse(fs.readFileSync(`${SC}/capacity-horizon/artifacts/horizon-600y-4s-lit.json`,'utf8'));
const b=j.receipt??j;
const ym=b.yearlyMs;
const sum=(a,i,k)=>a.slice(i,k).reduce((s,v)=>s+v,0);
console.log('yearlyMs len',ym.length,'total',sum(ym,0,600).toFixed(1),'ms  runA',b.runDurationsMs.primary);
for(const y of [100,200,300,400,500,600]){
  const s=sum(ym,0,y);
  console.log(` through y${y}: ${(s/1000).toFixed(1)} s   ${(s/(y*4)/1000).toFixed(4)} s/sy`);
}
console.log('century means (ms/y):');
const c1=sum(ym,0,100)/100;
for(let c=0;c<6;c++){const m=sum(ym,c*100,(c+1)*100)/100;console.log(`  c${c+1} ${m.toFixed(1)}  x${(m/c1).toFixed(3)}`);}
// load ratios
const by=b.behavioral?.yearly;
console.log('behavioral.yearly len',by?.length);
const lr=y=>by[y-1]?.realmDemography?.loadRatio01;
const pop=y=>by[y-1]?.realmDemography?.population;
console.log('loadRatio at marks:');
let marks=[50,100,150,200,250,300,350,400,450,500,550,600];
let prev=null;
for(const y of marks){const v=lr(y);console.log(`  y${y} load ${v?.toFixed(4)} pop ${pop(y)} delta ${prev==null?'-':(v-prev).toFixed(4)} inWindow ${v>=0.6&&v<=1.05}`);prev=v;}
console.log('realm 50y changes:');
for(const y of marks.slice(1)){const a=pop(y-50),c=pop(y);console.log(`  y${y}: ${a} -> ${c}  ${(100*(c-a)/a).toFixed(1)}%  |x band| ${(Math.abs((c-a)/a)/0.05).toFixed(1)}`);}
// window membership by decade
let outs=[];for(let y=10;y<=600;y+=10){const v=lr(y);if(!(v>=0.6&&v<=1.05))outs.push([y,+v.toFixed(4)]);}
console.log('decades OUTSIDE window:',JSON.stringify(outs));
// plateau drift
const yp=b.yearlyPopulations;
console.log('yearlyPopulations',yp.length,'x',yp[0].length,'  yearlyDiedFlags',b.yearlyDiedFlags.length);
const mid=Math.floor((yp.length-1)/2);
console.log('last index',yp.length-1,'mid index',mid);
for(let s=0;s<4;s++){
  const a=yp[mid][s],z=yp[yp.length-1][s];
  console.log(`  s${s}: mid(y${mid+1})=${a} last(y${yp.length})=${z} drift=${(Math.abs(z-a)/a).toFixed(4)}`);
}
