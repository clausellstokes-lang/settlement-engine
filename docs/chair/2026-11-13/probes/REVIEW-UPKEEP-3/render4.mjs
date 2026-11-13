// REVIEW-UPKEEP-3: every rendered surface of each seed, one text file per seed, sections "== <surface> ==".
// The earlier reader's render3.mjs (same births, same shape) plus: the realm register's row (player and owner),
// and the WHOLE world-export dossier (player and DM), not only its defenseProfile.
// Seeds rv2-/rv3-/rv4-<crisis[+crisis]>-<size>-<i>; 'calm' = no stress; born in the app's own shape.
// Usage: TREE=<tree> node render4.mjs <seedfile> <outdir>
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const H = await import(T+'/scripts/audit/soak-review/renderHarness.mjs');
const AI = await import(T+'/src/generators/aiLayer.js');
const G = await import(T+'/src/domain/aiGrounding.js');
const WX = await import(T+'/src/lib/worldExport.js');
const HR = await import(T+'/src/components/map/heraldRegister.js');
await loadGenerationLawPayloads();
export function cfgFor(seed){
  const m=seed.match(/^rv[234]-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false});
}
const h = await H.bootHarness();
fs.mkdirSync(process.argv[3],{recursive:true});
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  const r=H.renderSurfaces(h,s);
  const parts=[];
  for(const [k,v] of Object.entries(r.tabs)) parts.push(`== tab:${k} ==\n${v}`);
  parts.push(`== tonight ==\n${r.tonight}`);
  parts.push(`== pdf ==\n${r.pdf}`);
  parts.push(`== foundry ==\n${r.foundry}`);
  try{ parts.push(`== ai-layer-prompt ==\n${AI.buildAiLayerPrompt(AI.extractFullContext(s))}`);}catch(e){parts.push(`== ai-layer-prompt ==\nERROR ${e}`);}
  try{ const p=G.buildAiGroundingPayload(s); const sec=G.assemblePromptSections(p); const dz=(sec&&typeof sec.dossier==="string")?sec.dossier:""; parts.push(`== ai-grounding ==\n${JSON.stringify({...sec,dossier:undefined},null,1)}\n${dz}`);}catch(e){parts.push(`== ai-grounding ==\nERROR ${e}`);}
  for(const sees of [false,true]){ try{ const save={id:'x1',name:s.name,settlement:s}; const campaign={id:'c1',settlementIds:['x1'],worldState:{}};
    const rows=HR.gazetteerRows({campaign,saves:[save],seesSecrets:sees}); parts.push(`== register-${sees?'owner':'player'} ==\n${JSON.stringify(rows,null,1)}`);}catch(e){parts.push(`== register-${sees?'owner':'player'} ==\nERROR ${e}`);} }
  for(const v of ['player','dm']){ try{ const x=WX.buildWorldExport({settlements:[{settlement:s,name:s.name}]},{variant:v}); parts.push(`== world-export-${v} ==\n${JSON.stringify(x.settlements[0],null,1)}`);}catch(e){parts.push(`== world-export-${v} ==\nERROR ${e}`);} }
  if(Object.keys(r.errors).length) parts.push(`== errors ==\n${JSON.stringify(r.errors)}`);
  fs.writeFileSync(`${process.argv[3]}/${seed}.txt`, parts.join('\n')+'\n');
}
await h.server.close();
