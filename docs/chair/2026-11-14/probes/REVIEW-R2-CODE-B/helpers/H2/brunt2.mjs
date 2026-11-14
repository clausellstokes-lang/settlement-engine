import {towns,entries} from './load.mjs';
const only='the only one in the house the crisis hits', least='the one with the least say in the house the crisis hits', mem='one of the house the crisis hits';
const bad=[]; const seen={only:new Set(),least:new Set(),mem:new Set()}; const ex={only:[],least:[],mem:[]};
for await (const {seed,s} of towns()){
  const npcs=s.npcs||[];
  const membersOf=(P)=>npcs.filter(n=>(n.memberships||[]).some(m=>m.power===P));
  for(const e of entries(s)) for(const r of e.cast?.roles||[]){
    if(r.role!=='brunt'||r.kind!=='npc') continue;
    const k=r.reason.startsWith(only)?'only':r.reason.startsWith(least)?'least':r.reason.startsWith(mem)?'mem':null; if(!k) continue;
    seen[k].add(seed); ex[k].push(seed+'/'+s.tier+'/'+e.type);
    const n=npcs.find(x=>(x.id||x.name)===r.id);
    const ms=(n?.memberships||[]);
    const stake=Object.fromEntries((e.cast.stakes||[]).map(x=>[x.factionId,x.stake]));
    const hitPw=ms.filter(m=>stake[m.power] && stake[m.power]!=='gains');
    let f=[];
    if(!hitPw.length) f.push('no-hit-power:'+ms.map(m=>m.power+'='+stake[m.power]).join(','));
    const cnt=hitPw.map(m=>membersOf(m.power).length);
    if(k==='only'&&hitPw.length&&!cnt.includes(1)) f.push('only-but-'+cnt);
    if(k==='least'&&hitPw.length){ if(!cnt.some(c=>c>1)) f.push('least-but-'+cnt);
       const isLeast=hitPw.some(m=>Math.max(...membersOf(m.power).map(x=>(x.memberships.find(y=>y.power===m.power).rank ?? 99)))===(m.rank ?? 99));
       if(!isLeast) f.push('not-lowest-rank'+(r.reason.includes('next in line')?'(nextInLine)':'')); }
    const lever=(e.cast.roles||[]).some(x=>x.role==='lever'&&x.id===r.id);
    if(k==='least'&&lever) f.push('least-but-lever'); if(k==='mem'&&!lever) f.push('mem-not-lever');
    if(f.length) bad.push([seed,s.tier,e.type,r.name,JSON.stringify(r.reason),f.join(';')].join(' | '));
  }
}
for(const k in seen) console.log(k, seen[k].size, ex[k].length);
console.log(bad.join('\n'));
