const {rec,page}=require('./facts.js');const fs=require('fs');
const L=JSON.parse(fs.readFileSync(process.argv[2]));const l=L[+process.argv[3]];const rre=new RegExp(process.argv[4],'i');const pre=process.argv[5]?new RegExp(process.argv[5],'i'):null;
let flagged=0;
for(const p of l.prints){const t=rec(p.town);const names=(t.institutions||[]).map(i=>i.name+(i.status?`[${i.status}]`:'')).filter(n=>rre.test(n));
 const ph=pre?page(p.town).split('\n').filter(x=>pre.test(x)).map(x=>{const m=x.match(pre);const k=x.indexOf(m[0]);return x.slice(Math.max(0,k-90),k+110);}):[];
 if(names.length||ph.length){flagged++;console.log(p.town,t.tier,t.population,'|',names.join(';'));ph.slice(0,4).forEach(x=>console.log('    >',x));}}
console.log('n',l.prints.length,'flagged',flagged);
