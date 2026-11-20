import { loadCorpus } from './load.mjs';
const C=loadCorpus(process.argv[2]); const KW={timber:/^Timber Trade$/,grain:/^Grain Sales$/,fish:/^Fish & /,wool:/^Wool & Textile Trade$/,iron:/^Iron & Metalwork$/,stone:/^Stone Quarrying$/,alchemy:/^Apothecary & Alchemy$/,'medicinal herbs':/^Herbalist & Apothecary$/};
const st={}; const ex={};
for(const {seed,s} of C){ const inc=s.economicState?.incomeSources||[]; const top=Math.max(...inc.map(i=>i.percentage));
 for(const t of s.history.currentTensions||[]){ const d=String(t.description); let m, k=null;
  if((m=d.match(/Life here runs mostly on the (.+?) trade/))){ const r=inc.filter(i=>KW[m[1]]&&KW[m[1]].test(i.source)); k = r.length&&Math.max(...r.map(x=>x.percentage))===top&&top>50 ? 'mostly TRUE' : 'mostly FALSE'; }
  else if((m=d.match(/Among the trades the place lives by, the (.+?) trade/))) k='among';
  else if((m=d.match(/The (.+?) trade is the largest the place lives by/))) k='largest';
  if(k){ st[k]=(st[k]||0)+1; (ex[k]=ex[k]||[]).push(seed); } } }
console.log(st); for(const k in ex) console.log(k, ex[k].slice(0,8).join(' '));
