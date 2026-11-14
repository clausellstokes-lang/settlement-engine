import {towns,entries} from './load.mjs';
const T={}; const add=(k,seed,msg)=>{(T[k]??={n:new Set(),bad:[],ex:[]}); T[k].n.add(seed); if(msg) T[k].bad.push(seed+' | '+msg);};
const ex=(k,v)=>{T[k].ex.length<200&&T[k].ex.push(v)};
for await (const {seed,s} of towns()){
  const npcs=s.npcs||[]; const byId=Object.fromEntries(npcs.map(n=>[n.id||n.name,n]));
  const inst=s.institutions||[];
  for(const e of entries(s)){ const c=e.cast; if(!c) continue;
    for(const l of c.levers||[]) if(/^access to/i.test(l.institution)) add('leverAccess',seed,l.institution);
    for(const r of c.roles){
      if(r.role==='lever'&&r.kind==='institution'&&/^access to/i.test(r.name)) add('leverAccess',seed,r.name);
      if(r.role==='defender'&&r.kind==='institution'){ add('defInst:'+r.reason,seed); ex('defInst:'+r.reason, seed+'/'+s.tier+'/'+e.type+'/'+r.name);
        const big=['town','city','metropolis'].includes(s.tier); if(r.reason.startsWith('the defence of the place')&&big) add('defInstBad',seed,'place-in-'+s.tier);
        const i=inst.find(x=>x.name===r.name); if(!i) add('defInstBad',seed,'no inst '+r.name);
        // someone on the roster leads it?
        const face=npcs.find(n=>n.institution?.key===r.name); if(face) add('defInstBad',seed,`face ${face.name} (${face.role}) of ${r.name} on roster`);
      }
      if(r.role==='treater'&&r.kind==='npc'&&/merchant/.test(r.reason)){ const n=byId[r.id]; add('treat:'+r.reason,seed); ex('treat:'+r.reason, seed+'/'+n?.role+'/'+(n?.memberships||[]).map(m=>m.power).join('+'));}
      if(r.role==='instigator' && r.reason==='its power gains from the crisis'){ add('instGains',seed); ex('instGains', seed+'/'+e.type+'/'+r.kind+':'+r.name);
        // check the person's/faction's power stake is gains
        const pw = r.kind==='faction'? [r.name] : (byId[r.id]?.memberships||[]).map(m=>m.power);
        const st=Object.fromEntries(c.stakes.map(x=>[x.factionId,x.stake]));
        if(!pw.some(p=>st[p]==='gains')) add('instGainsBad',seed,`${r.name} powers ${pw.map(p=>p+'='+st[p])}`);
      }
      if(r.role==='instigator' && r.reason.startsWith('already carries more weight')){ add('instRival',seed); }
    }
    for(const k of c.stakes||[]){
      if(k.reason==='holds what the crisis makes scarce'){ add('gainsHolds',seed); ex('gainsHolds',seed+'/'+e.type+'/'+k.factionId);
        const scarce = e.type==='famine'? /grain|food|granar|harvest/i : /heal|apothec|physic/i;
        const faces=npcs.filter(n=>(n.memberships||[]).some(m=>m.power===k.factionId)&&n.institution?.kind==='house'&&scarce.test(n.institution.key||''));
        if(!faces.length) add('gainsHoldsBad',seed,k.factionId);
        else ex('gainsHolds', '   faces '+faces.map(f=>f.name+':'+f.institution.key).join(','));
      }
      if(k.reason==='a rival claim to govern gains by it'){ add('gainsClaim',seed); ex('gainsClaim',seed+'/'+e.type+'/'+k.factionId+'/seatHolder?'+JSON.stringify(s.powerStructure?.seat||s.powerStructure?.seatHolder||null).slice(0,80));}
      if(k.reason==='already carries more weight than whoever holds the seat') add('gainsRival',seed);
    }
  }
}
for(const [k,v] of Object.entries(T)) console.log(k, v.n.size, v.bad.length?'\n  BAD '+v.bad.join('\n  BAD '):'', v.ex.length? '\n  ex '+v.ex.slice(0,12).join('\n  ex '):'');
