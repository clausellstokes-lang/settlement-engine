// C item 2: the "No one here works the X" lines at C's base and tip on the census's 720, by the one writer
// (validationOnPage.js :: resourceGapLines), and for each removed line the chains the leaf says work it.
import fs from 'node:fs'; import zlib from 'node:zlib';
const rd=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const o=JSON.parse(l); m.set(o.seed,o.s);} return m; };
const [BT,TT,bg,tg,out]=process.argv.slice(2);
const base=await import(BT+'/src/domain/display/validationOnPage.js'); const tip=await import(TT+'/src/domain/display/validationOnPage.js');
const leaf=await import(TT+'/src/domain/facts/chainWorking.js');
const B=rd(bg), T=rd(tg); const rem=[]; let nb=0, nt=0;
for(const [k,s] of B){ const lb=base.resourceGapLines(s).map(g=>g.impact).filter(t=>/^No one here works/.test(t)); const lt=tip.resourceGapLines(T.get(k)).map(g=>g.impact).filter(t=>/^No one here works/.test(t)); nb+=lb.length; nt+=lt.length;
  for(const l of lb) if(!lt.includes(l)){ const s2=T.get(k); const chains=(s2.economicState?.activeChains||[]).map(c=>`${c.label||c.chainId}[${c.status}] key=${c.resourceInputKey} via=${(c.processingInstitutions||[]).join('+')}`);
    const res=l.match(/works the (.+?) near/)?.[1]; rem.push({seed:k,line:l,res,chains:chains.filter(c=>true),cfg:(s2.config?.nearbyResources||[]).join(','),depl:(s2.config?.nearbyResourcesDepleted||[]).join(',')}); } }
console.log('base lines',nb,'tip lines',nt,'removed',rem.length,'towns',new Set(rem.map(r=>r.seed)).size);
fs.writeFileSync(out, JSON.stringify(rem,null,1));
