import {towns,entries} from './load.mjs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const H=await import(S+'/tip/src/domain/crisis/crisisHooks.js');
const paren=[], castInst=[], lev=new Set(), cst=new Set(), plural=[];
for await (const {seed,s} of towns()){
  for(const e of entries(s)){ if(!e.cast) continue; let hs; try{hs=H.crisisHooksOf(s,e);}catch(err){console.log('ERR',seed,err.message);continue;}
    for(const h of hs){ (h.bound==='lever'?lev:cst).add(seed);
      if(/\(/.test(h.text)) paren.push(seed+'/'+s.tier+' :: '+h.text);
      if(h.bound==='cast'&&h.link?.kind==='institution') castInst.push(seed+'/'+s.tier+' :: '+h.text);
    }
    const holder=H.lineRoleHolderOf(e.type,e.cast);
    if(holder?.kind==='institution' && !hs.some(h=>h.bound==='cast')) plural.push(seed+' suppressed cast hook for '+holder.name+' ('+holder.role+')');
  }
}
console.log('lever towns',lev.size,'cast towns',cst.size);
console.log('PAREN\n'+paren.join('\n')); console.log('CASTINST\n'+castInst.join('\n')); console.log('SUPPRESSED\n'+plural.join('\n'));
