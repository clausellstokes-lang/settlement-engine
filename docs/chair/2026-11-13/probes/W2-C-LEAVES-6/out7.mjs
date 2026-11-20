import { load } from './load.mjs';
const A=await import(process.env.BEFORE+'/src/domain/display/tradeListDisplay.js');
const B=await import(process.env.TREE+'/src/domain/display/tradeListDisplay.js');
const cnt={}; const inc=(k,n=1)=>cnt[k]=(cnt[k]||0)+n; const by=new Map(); const towns=new Set(); const ex=[];
for (const f of process.argv.slice(2)) for(const {seed,s} of load(f)){
 for(const k of ['localProductionAsPrinted','exportsAsPrinted']){ const a=A[k](s).join('|'), b=B[k](s).join('|'); if(a!==b) { inc('pills moved '+k); ex.push(seed+' '+k+': '+a+'  =>  '+b);} }
 for(const c of s.economicState?.activeChains||[]){ const before=(c.outputs||[]).slice(0,3), after=B.chainOutputsShown(c,s).slice(0,3); inc('cards'); inc('pills before',before.length); inc('pills after',after.length);
  const gone=before.filter(o=>!after.includes(o)); if(gone.length){ towns.add(seed); inc('cards moved'); for(const g of gone){ const k=c.chainId+': '+g; by.set(k,(by.get(k)||0)+1);} if(after.length===0) inc('cards left with no outputs'); } } }
console.log(cnt, 'towns', towns.size); console.log([...by].sort((a,b)=>b[1]-a[1]).map(([k,n])=>n+' '+k).join('\n')); console.log(ex.slice(0,10).join('\n'));
