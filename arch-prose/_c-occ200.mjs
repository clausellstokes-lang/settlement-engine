// READ-ONLY: the OCCURRENCE measure's feasibility probe. Generates N towns with the product
// pipeline at 3b1c0eaa5 and composes the GENERAL desk's prose through generalStateProse with
// the readings bag `generalDeskRead.js:176-210` builds, then counts (block,pool) cell hits.
// Writes nothing outside this directory. Never passes `{}` readings (the known probe artefact).
import { pathToFileURL } from 'node:url'; import { writeFileSync } from 'node:fs';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const imp=(p)=>import(pathToFileURL(D+'/'+p).href);
const {generateSettlementPipeline}=await imp('src/generators/generateSettlementPipeline.js');
const {generalStateProse}=await imp('src/domain/display/stateProse/generalStateProse.js');
const N=Number(process.argv[2]||25);
const TIERS=['thorp','hamlet','village','town','city','metropolis'];
const walk=(o,out,depth=0)=>{if(!o||typeof o!=='object'||depth>12)return;
  if(typeof o.sentence==='string'&&o.sentence&&o.provenance&&typeof o.provenance.blockId==='string'){out.push(o.provenance);return;}
  if(typeof o.blockId==='string'&&typeof o.poolKey==='string'&&typeof o.text==='string'){out.push(o);return;}
  for(const v of Object.values(o)) walk(v,out,depth+1);};
const cells=new Map(); const angles=new Map(); let lines=0; let genMs=0, compMs=0;
const t0=Date.now();
for(let i=0;i<N;i++){
  const g0=Date.now();
  const s=generateSettlementPipeline({settType:TIERS[i%TIERS.length],culture:'germanic',terrain:'grassland',tradeRouteAccess:'road'},null,{seed:`occ-${i}`,customContent:{}});
  genMs+=Date.now()-g0;
  const seed=String(s._seed??s.id??''); const eco=s.economicState||{}, dp=s.defenseProfile||{}, via=s.economicViability||{};
  const readings={ scores:dp.scores, prosperity:eco.prosperity, safetyLabel:eco.safetyProfile?.safetyLabel, viable:via.viable,
    readinessLabel:dp.readiness?.label, foodSecurityLabel:eco.foodSecurity?.label, terrainType:s.config?.terrainType,
    institutions:s.institutions, tradeRouteAccess:s.config?.tradeRouteAccess, isEntrepot:eco.isEntrepot, inst:eco.compound?.inst,
    conflicts:s.conflicts, structuralViolations:s.structuralViolations, structuralSuggestions:s.structuralSuggestions,
    coherenceNotes:s.coherenceNotes, govFaction:(s.powerStructure?.factions||[]).find(f=>f?.isGoverning)?.faction, tier:s.tier };
  const c0=Date.now(); const out=[];
  try{ walk(generalStateProse(s,readings,{seed,audience:'dm'}),out); }catch(e){ console.log('threw',e.message.slice(0,120)); }
  compMs+=Date.now()-c0; lines+=out.length;
  for(const p of out){ const k=`${p.blockId}::${p.poolKey}`; cells.set(k,(cells.get(k)||0)+1); angles.set(p.angle||'-',(angles.get(p.angle||'-')||0)+1); }
}
const total=Date.now()-t0;
console.log(`N=${N} towns (6 tiers round-robin) · ${total} ms total = ${(total/N).toFixed(0)} ms/town (generate ${genMs}, compose ${compMs})`);
console.log(`general-desk rungs with provenance: ${lines} (${(lines/N).toFixed(1)} per town); distinct (block,pool) cells: ${cells.size}`);
const byCount={}; for(const [,v] of cells) byCount[v]=(byCount[v]||0)+1;
console.log('cell occurrence histogram (towns-hit -> cells):', Object.entries(byCount).sort((a,b)=>a[0]-b[0]).map(([k,v])=>`${k}->${v}`).join(' '));
console.log(`cells hit on ONE town only: ${[...cells].filter(([,v])=>v===1).length} of ${cells.size}`);
console.log(`cells hit on EVERY town: ${[...cells].filter(([,v])=>v===N).length}`);
console.log('angles drawn:', [...angles].sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}=${v}`).join(' '));
console.log(`PROJECTED 200-town cost (general desk only): ${(total/N*200/1000).toFixed(1)} s`);
writeFileSync('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/arch-prose/_c-occ200.out.json', JSON.stringify({N,cells:[...cells]},null,1));
