import * as L from './lib.mjs';
for(const town of process.argv.slice(2)){ const f=L.facts(town); const b=f.t.defenseProfile.institutions;
console.log('##',town,f.tier,f.pop,f.name,'crisis',f.crisis.types.join('+'),'monster',f.monster,'walls',f.d.walls,f.d.wallKind,'gate',f.d.gate,'watch',f.d.watch,'gar',f.d.garrison,'mil',f.d.militia,'merc',f.d.mercenary,'guard',f.guard,'soldiers',f.soldiers);
console.log('  buckets:',Object.keys(b).map(k=>k+'='+b[k].map(i=>i.name).join('/')).filter(x=>!/=$/.test(x)).join(' ; '));
console.log('  gov',f.gov,'| prosperity',f.prosperity,'| econ',f.econScore,'| chainMod',JSON.stringify(f.chainMod),'| fp',f.chains.food_processing,'| stores',f.stores,'| famine',f.famine.band);}
