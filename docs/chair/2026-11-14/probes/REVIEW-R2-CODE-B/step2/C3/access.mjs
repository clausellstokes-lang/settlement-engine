import {towns} from './iter.mjs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const Tq=(await import(S+'/q/src/domain/display/chainHouses.js')).chainHousesOf, Tt=(await import(S+'/tip/src/domain/display/chainHouses.js')).chainHousesOf;
const [Bq,Bt]=process.argv.slice(2); const qmap=new Map();
for await (const {seed,s} of towns(Bq)) { const names=(s.institutions||[]).map(i=>i.name); const m={}; for(const c of s.economicState?.activeChains||[]) m[c.chainId]=Tq(c.processingInstitutions,names).map(h=>h.name); qmap.set(seed,{m,names}); }
let changed=0,ct=new Set(); const removed={}, added={}; const ex=[]; let accessChains=0, accessOnlyOK=0;
for await (const {seed,s} of towns(Bt)) { const names=(s.institutions||[]).map(i=>i.name); const q=qmap.get(seed); if(!q) continue; const roster=new Set(names);
  for(const c of s.economicState?.activeChains||[]){ const t=Tt(c.processingInstitutions,names).map(h=>h.name); const qq=q.m[c.chainId]||[];
    if((c.processingInstitutions||[]).some(p=>/^access to/i.test(p))) accessChains++;
    if(JSON.stringify(t)!==JSON.stringify(qq)){ changed++; ct.add(seed); for(const r of qq.filter(x=>!t.includes(x))){ const onRoster=names.some(n=>n===r||n.startsWith(r)); const k=r+(onRoster?' [ON ROSTER]':' [not on roster]'); removed[k]=(removed[k]||0)+1; if(onRoster&&ex.length<15) ex.push(seed+' '+c.chainId+' Q:'+qq.join(' · ')+' -> tip:'+t.join(' · ')); }
      for(const a of t.filter(x=>!qq.includes(x))) added[a]=(added[a]||0)+1; } } }
console.log({changed,towns:ct.size,accessChains}); console.log('REMOVED', Object.entries(removed).sort((a,b)=>b[1]-a[1]).slice(0,30)); console.log('ADDED',Object.entries(added).sort((a,b)=>b[1]-a[1]).slice(0,15)); console.log(ex.join('\n'));
