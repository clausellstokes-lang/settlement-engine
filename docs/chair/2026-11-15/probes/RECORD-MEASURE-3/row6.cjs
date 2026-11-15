// row 6a: the entrepôt flag where no entrepôt chain stands, by tier
const L=require('./load.cjs')(process.argv[2]);const o={};
for(const {seed,s} of L){const e=s.economicState;if(!e.isEntrepot)continue;const ent=(e.activeChains||[]).some(c=>c&&c.entrepot);if(ent)continue;o[s.tier]=(o[s.tier]||0)+1}
console.log('flag without an entrepot chain',JSON.stringify(o));
