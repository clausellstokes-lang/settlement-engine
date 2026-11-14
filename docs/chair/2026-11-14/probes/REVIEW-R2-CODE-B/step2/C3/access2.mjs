import {towns} from './iter.mjs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const Tq=(await import(S+'/q/src/domain/display/chainHouses.js')).chainHousesOf, Tt=(await import(S+'/tip/src/domain/display/chainHouses.js')).chainHousesOf;
const esc=(s)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
let n=0; const t=new Set(), sz={}; const pairs={}; const ex=[]; let r720=0; const t720=new Set();
for await (const {seed,s} of towns(process.argv[2])) { const names=(s.institutions||[]).map(i=>i.name);
  for(const c of s.economicState?.activeChains||[]){ let hit=false;
    for(const p0 of c.processingInstitutions||[]){ const p=String(p0).toLowerCase(); if(p.startsWith('access to')) { if(names.some(n=>n.toLowerCase()===p)) hit=true; continue; }
      const re=new RegExp(`(?:^|[\\s'"(-])${esc(p.slice(0,12))}`,'i'); const of=names.filter(n=>re.test(n)); if(of.length && of.every(n=>n.toLowerCase().startsWith('access to'))) hit=true; }
    if(!hit) continue; n++; t.add(seed); const z=seed.split('-')[1]; if(/^r2s-/.test(seed)) {} const size=s.config.settType; sz[size]=(sz[size]||0)+1; if(/^r2[rs]-/.test(seed)){r720++;t720.add(seed);}
    const q=Tq(c.processingInstitutions,names).map(h=>h.name).join(' · '), tt=Tt(c.processingInstitutions,names).map(h=>h.name).join(' · ');
    const k=q+'  =>  '+tt; pairs[k]=(pairs[k]||0)+1; if(ex.length<40 && !ex.some(e=>e.includes(k))) ex.push(seed+' ['+size+'] '+c.chainId+': '+k); } }
console.log({chains:n,towns:t.size,sz,r720,t720:t720.size}); console.log(Object.entries(pairs).sort((a,b)=>b[1]-a[1]).slice(0,25).map(x=>x[1]+'  '+x[0]).join('\n')); console.log(ex.slice(0,10).join('\n'));
