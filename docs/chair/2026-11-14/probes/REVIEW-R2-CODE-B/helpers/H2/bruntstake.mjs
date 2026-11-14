import {towns,entries} from './load.mjs';
const c={}; const ex={};
for await (const {seed,s} of towns()){
  for(const e of entries(s)) for(const r of e.cast?.roles||[]){
    if(r.role!=='brunt'||r.kind!=='npc') continue;
    const k0=r.reason.startsWith('the only one')?'only':r.reason.startsWith('the one with the least')?'least':r.reason.startsWith('one of the house')?'mem':null; if(!k0) continue;
    const n=s.npcs.find(x=>(x.id||x.name)===r.id);
    const st=Object.fromEntries(e.cast.stakes.map(x=>[x.factionId,x]));
    const states=(n.memberships||[]).map(m=>st[m.power]?.reason==='it could side with either camp'?'untouched':st[m.power]?.stake||'none');
    const k=k0+' '+[...new Set(states)].sort().join('+');
    c[k]=(c[k]||0)+1; (ex[k]??=[]).push(seed+"/"+s.tier);
  }
}
for(const k in c) console.log(c[k],k,ex[k].slice(0,5).join(','));
