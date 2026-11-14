import {towns} from './iter.mjs';
const [B]=process.argv.slice(2); const k={}; const sub={}; let subTowns=new Set(), r720=0, r720t=new Set();
for await (const {seed,s} of towns(B)){ const near=new Set(s.config.nearbyResources||[]);
  for(const c of s.economicState?.activeChains||[]){ if(c.resourceCondition!=='absent') continue;
    const kind = c.substituteActive && c.resourceInputAvailable && c.resourceInputKey!==c.resourceKey ? 'substitute:'+c.resourceInputKey : (c.entrepot?'entrepot':'other:'+c.status+':in='+c.resourceInputKey+':'+c.resourceInputCondition);
    const kk=kind.startsWith('substitute')?'substitute':kind; k[kk]=(k[kk]||0)+1; if(kind.startsWith('substitute')){ sub[c.resource+' <- '+c.resourceInputKey]=(sub[c.resource+' <- '+c.resourceInputKey]||0)+1; subTowns.add(seed);} 
    if(/^r2[rs]-/.test(seed)){r720++; r720t.add(seed);} } }
console.log(k, 'subTowns', subTowns.size, '720:', r720, r720t.size); console.log(Object.entries(sub).sort((a,b)=>b[1]-a[1]).map(x=>x[1]+' '+x[0]).join('\n'));
