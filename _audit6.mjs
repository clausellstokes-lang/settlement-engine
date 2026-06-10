// Compare getServiceTierInfo domain vs display bucket h() for a sample of services.
// getServiceTierInfo isn't exported; reconstruct the key divergence risk by checking
// the no-magic skip: services classified 'magic' by h() are skipped in no-magic worlds.
// But getServiceTierInfo may still gate a service by magicInfluence even if h() buckets it elsewhere.
import { generateAvailableServices } from './src/generators/servicesGenerator.js';
// Wizard Tower in a NO-MAGIC world: should produce nothing magical.
const config={tier:'city',settType:'city',priorityMagic:0,magicExists:false,priorityEconomy:60};
const r=generateAvailableServices('city',[{name:"Wizard's tower",category:'Magic',tags:['arcane']},{name:'Market'}],{},{...config});
console.log('NO-MAGIC world, Wizard tower + Market:');
for(const k of Object.keys(r)) if(r[k].length) console.log('  '+k+': '+r[k].map(s=>s.name).join(', '));
