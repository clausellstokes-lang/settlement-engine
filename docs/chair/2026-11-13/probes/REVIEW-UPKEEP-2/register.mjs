// The realm register's living line (heraldRegister.js :: gazetteerRows), player and owner, for each seed.
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const HR = await import(T+'/src/components/map/heraldRegister.js');
await loadGenerationLawPayloads();
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){ const m=seed.match(/^rv[23]-([a-z_+]+)-(\w+)-(\d+)$/);
  const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false}),null,{seed,customContent:{}});
  const save={id:'x1',name:s.name,settlement:s}; const campaign={id:'c1',settlementIds:['x1'],worldState:{}};
  let rows; try{ rows=HR.gazetteerRows({campaign,saves:[save],seesSecrets:false}); }catch(e){ rows=[{line:'ERR '+e}]; }
  console.log(seed,'|',rows[0]?.line ?? '(no row)'); }
