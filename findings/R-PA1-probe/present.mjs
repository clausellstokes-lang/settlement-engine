const { generateSettlementPipeline } = await import('./mcr/src/generators/generateSettlementPipeline.js');
const govs = {}; const stressT = {}; let shown = false;
for (const tier of ['thorp','hamlet','village','town','city','metropolis']) for (let i = 0; i < 20; i++) {
  const s = generateSettlementPipeline({ settType: tier }, null, { seed: `pa1p-${tier}-${i}` });
  const ps = s.powerStructure;
  const g = ps.governingLabel || ps.government || ps.govBody || '?';
  govs[tier + ':' + g] = (govs[tier + ':' + g] || 0) + 1;
  (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).forEach(x => stressT[x.type] = (stressT[x.type]||0)+1);
  if (!shown && tier === 'city') { shown = true;
    console.log('powerStructure keys', Object.keys(ps));
    console.log('ps scalar', JSON.stringify(Object.fromEntries(Object.entries(ps).filter(([k,v]) => typeof v !== 'object' || v === null))).slice(0, 800));
    console.log('faction0', JSON.stringify(ps.factions[0]).slice(0, 500));
    console.log('defenseProfile keys', Object.keys(s.defenseProfile||{}), JSON.stringify(s.defenseProfile).slice(0, 600));
    console.log('economicState keys', Object.keys(s.economicState||{}));
    console.log('isolationSupport', JSON.stringify(s.isolationSupport).slice(0,300));
    console.log('config keys', Object.keys(s.config||{}).join(','));
    console.log('stress', JSON.stringify(s.stress).slice(0,300));
    console.log('culturalIdentity', JSON.stringify(s.culturalIdentity).slice(0,300));
  }
}
console.log(JSON.stringify(govs, null, 0));
console.log('stress types', JSON.stringify(stressT));
