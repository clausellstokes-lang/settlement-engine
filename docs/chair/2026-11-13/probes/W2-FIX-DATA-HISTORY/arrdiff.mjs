import { loadCorpus } from './load.mjs';
const A=new Map(loadCorpus(process.argv[2]).map(x=>[x.seed,x.s])); const B=loadCorpus(process.argv[3]); const hist={}; const ex=[];
for(const {seed,s} of B){ const a=String(A.get(seed).arrivalScene||''), b=String(s.arrivalScene||''); if(a===b) continue; const sa=a.split(/(?<=[.?])\s+/), sb=b.split(/(?<=[.?])\s+/);
 const gone=sa.filter(x=>!sb.includes(x)), came=sb.filter(x=>!sa.includes(x)); const k=Math.max(gone.length,came.length); hist[k]=(hist[k]||0)+1; if(k>1&&ex.length<6) ex.push(seed+' | - '+gone.join(' / ')+' | + '+came.join(' / ')); }
console.log('arrivals moved by sentences changed:', JSON.stringify(hist)); ex.forEach(e=>console.log(e.slice(0,600)));
