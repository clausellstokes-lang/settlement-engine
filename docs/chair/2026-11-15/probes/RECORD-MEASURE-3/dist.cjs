const L=require('./load.cjs')(process.argv[2]); const c={};
const get=(o,p)=>p.split('.').reduce((a,k)=>a?.[k],o);
for(const {s} of L){const v=String(get(s,process.argv[3])); c[v]=(c[v]||0)+1}
console.log(JSON.stringify(c));
