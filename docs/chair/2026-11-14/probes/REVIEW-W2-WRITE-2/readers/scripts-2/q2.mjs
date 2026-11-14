import * as L from './lib.mjs';
const town=process.argv[2]; const f=L.facts(town); const b=f.t.defenseProfile.institutions;
console.log(town,f.tier,f.pop,f.name,'crisis',f.crisis.types,'monster',f.monster,'d',JSON.stringify(f.d),'guard',f.guard,'soldiers',f.soldiers);
for(const k of Object.keys(b)) console.log('  bucket',k, b[k].map(i=>i.name).join(' | '));
console.log('  insts with Defense/Adventuring/Military:', f.t.institutions.filter(i=>/Defen|Advent|Milit/.test(i.category)).map(i=>i.name+'['+(i.status||'')+']').join(' | '));
console.log('  gov',f.gov,'prosperity',f.prosperity,'econScore',f.econScore,'chainMod',JSON.stringify(f.chainMod),'fp',f.chains.food_processing,'stores',f.stores,'famine',f.famine.band);
const pg=L.page(town); const s=L.sec(pg,'Systems/Defense'); const lines=s.split('\n'); const i=lines.findIndex(x=>/^Threat Assessment/.test(x)); console.log(lines.slice(0,Math.min(lines.length,i+16)).map(x=>'   | '+x.slice(0,330)).join('\n'));
