import fs from 'node:fs';
const all=[]; for(let n=1;n<=7;n++){ for(const x of JSON.parse(fs.readFileSync(`reader-${n}.json`,'utf8'))) all.push({...x,reader:n}); }
// verify verbatim
const dumps={}; let miss=0;
for(const x of all){ const d=dumps[x.town]??=fs.readFileSync(`/home/user/wt/r-tip/dumps/${x.town}.txt`,'utf8'); if(!d.includes(x.sentence)) { miss++; x.verbatim=false; } }
console.log('total',all.length,'not verbatim',miss);
// group by town+sentence
const g=new Map(); for(const x of all){ const k=x.town+'||'+x.sentence; if(!g.has(k)) g.set(k,{...x,tabs:[x.tab]}); else g.get(k).tabs.push(x.tab); }
console.log('distinct town+sentence',g.size);
fs.writeFileSync('m/merged.json',JSON.stringify([...g.values()],null,1));
const by={}; for(const x of g.values()){ by[x.severity]=(by[x.severity]||0)+1;} console.log(by);
const mech={}; for(const x of g.values()){ mech[x.mechanism]=(mech[x.mechanism]||0)+1;} console.log(Object.entries(mech).sort((a,b)=>b[1]-a[1]).slice(0,25));
