const R=process.env.TREE+'/src';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
for (const seed of process.argv.slice(2)) { const m=seed.match(/^r(?:ww|pf)-(\w+)-([a-z_+]+)-(\d+)$/); const st=m[2]==='calm'?[]:m[2].split('+');
  const shapes={ rw3: {...DEFAULT_CONFIG, settType:m[1], selectedStressesRandom:false, selectedStresses:st, _randomizePriorities:true},
    app: {...DEFAULT_CONFIG, settType:m[1], selectedStressesRandom:false, selectedStresses:st, _randomizePriorities:true},
    census: {...DEFAULT_CONFIG,...dials,selectedStresses:st,selectedStressesRandom:false,settType:m[1]} };
  for (const [k,c] of Object.entries(shapes)) { const s=generateSettlementPipeline(birthConfig(c),null,{seed,customContent:{}});
    const F=s.powerStructure.factions.map(f=>`${f.faction}${f.isGoverning?'*':''}:${f.power}`).join(', ');
    const npc=(s.npcs||[]).filter(n=>/Magnate|Li Song/.test((n.role||'')+n.name)).map(n=>n.name+'/'+n.role).join(';');
    console.log(seed,k,s.name,'|',F,'|',npc); } }
