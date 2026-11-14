import {towns,entries} from './load.mjs';
const rows=[]; const byRole={}; const bySet={};
for await (const {seed,s} of towns()){
  const temps=(s.npcs||[]).filter(n=>n.temporary);
  if(!temps.length) continue;
  const set=seed.split('-')[0]; bySet[set]=(bySet[set]||0)+1;
  for(const p of temps){
    byRole[p.role+'/'+p.temporaryKind]=(byRole[p.role+'/'+p.temporaryKind]||0)+1;
    const inst=(s.institutions||[]).map(i=>i.name);
    const rel = inst.filter(n=>/granar|grain|store|mill|heal|hospit|apothec|physic|temple|shrine|church|watch|guard|warden|militia|garrison/i.test(n));
    rows.push([seed,s.tier,s.population,p.name,p.role,p.temporaryKind,p.crisisIds.join('+'),entries(s).map(e=>e.type).join('+'),s.config?.culture, JSON.stringify(Object.keys(p).filter(k=>!['id','name','gender','role','category','power','influence','memberships','importance','structuralRank','temporary','temporaryKind','crisisIds'].includes(k))), rel.join('; ')].join(' | '));
  }
}
console.log(bySet, byRole);
console.log(rows.join('\n'));
