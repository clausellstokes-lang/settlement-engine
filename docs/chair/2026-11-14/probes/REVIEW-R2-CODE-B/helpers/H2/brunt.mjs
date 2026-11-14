import {towns,entries} from './load.mjs';
const only='the only one in the house the crisis hits', least='the one with the least say in the house the crisis hits', mem='one of the house the crisis hits';
const tally={}; const bad=[];
for await (const {seed,s} of towns()){
  const npcs=s.npcs||[];
  const membersOf=(P)=>npcs.filter(n=>(n.memberships||[]).some(m=>m.power===P));
  for(const e of entries(s)) for(const r of e.cast?.roles||[]){
    if(r.role!=='brunt'||r.kind!=='npc') continue;
    const k=r.reason.startsWith(only)?'only':r.reason.startsWith(least)?'least':r.reason.startsWith(mem)?'mem':null; if(!k) continue;
    tally[k]=(tally[k]||0)+1;
    const n=npcs.find(x=>(x.id||x.name)===r.id);
    const pw=(n?.memberships||[]).map(m=>m.power);
    const hit=new Set((e.cast.stakes||[]).filter(x=>x.stake!=='gains').map(x=>x.factionId));
    const pwHit=pw.filter(p=>hit.has(p));
    const counts=pwHit.map(p=>membersOf(p).length);
    const lever=(e.cast.roles||[]).some(x=>x.role==='lever'&&x.id===r.id);
    let fault='';
    if(k==='only' && !counts.includes(1)) fault='only-but-counts='+counts;
    if(k==='least' && !counts.some(c=>c>1)) fault='least-but-counts='+counts;
    if(k==='least' && lever) fault='least-but-lever';
    if(k==='mem' && !lever) fault='mem-not-lever';
    if(k==='least'){ // is the person least powerful in a hit power?
      const ok=pwHit.some(p=>{const ms=membersOf(p); const minP=Math.min(...ms.map(x=>x.power??0)); return (n.power??0)<=minP;});
      if(!ok && !r.reason.includes('next in line')) fault+=' least-not-min';
    }
    if(fault) bad.push([seed,e.type,r.name,JSON.stringify(r.reason),fault,pw.join('/')].join(' | '));
    if(k!=='least'||fault) tally[k+':seeds']=(tally[k+':seeds']||[]); 
  }
}
console.log(tally.only,tally.least,tally.mem); console.log(bad.join('\n'));
