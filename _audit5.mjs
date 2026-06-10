import { generateAvailableServices } from './src/generators/servicesGenerator.js';
// Two institutions that both offer 'Message relay' — Inn/Tavern and ... or both offer similar.
// Demonstrate dedup-by-name: Inn/Tavern + Post relay station both have message services.
const insts = [{name:'Post relay station'},{name:'Inn/Tavern'}];
const config={tier:'town',settType:'town',priorityMagic:50,magicExists:true,priorityEconomy:50};
const seen={};
for(let i=0;i<80;i++){
  const r=generateAvailableServices('town',insts,{},{...config});
  for(const k of Object.keys(r)) for(const s of r[k]){
    const key=s.name;
    seen[key]=seen[key]||{}; seen[key][s.institution]=(seen[key][s.institution]||0)+1;
  }
}
for(const n of Object.keys(seen)){
  const provs=Object.keys(seen[n]);
  if(provs.length>1) console.log(`SHARED NAME "${n}" attributed to: ${JSON.stringify(seen[n])}`);
}
console.log('--- all service names + sole attribution ---');
for(const n of Object.keys(seen)) if(Object.keys(seen[n]).length===1) console.log(`  ${n} <- ${Object.keys(seen[n])[0]}`);
