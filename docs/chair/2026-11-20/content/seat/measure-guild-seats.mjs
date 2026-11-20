// SEAT-MEASURE (2026-11-20): every guild-named seat against Craft Guilds and Merchant Guilds, both arms (same jobs as measure-kin.mjs). Run: node docs/chair/2026-11-20/content/seat/measure-guild-seats.mjs [--law v1] > guild-seats[-v1].txt
import { generateSettlementPipeline } from '../../../../../src/generators/generateSettlementPipeline.js';
import { coupContenders } from '../../../../../src/domain/rulingPowerCoup.js';
import { ARCHETYPES, archetypePatch } from '../../../../../src/components/generate/characterPresets.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../../../src/domain/density/densityCreateBoundary.js';
// --law birth (default, birthConfig as every app birth) | v1 (the bare config: towns born before Register VII was lit)
const LAW = process.argv.includes('--law') ? process.argv[process.argv.indexOf('--law') + 1] : 'birth';
if (LAW !== 'v1') await loadGenerationLawPayloads();
const lawConfig = (c) => (LAW === 'v1' ? c : birthConfig(c));
const T=['thorp','hamlet','village','town','city','metropolis'];
for (const arm of ['default','presets']) {
  const jobs = arm==='presets' ? T.flatMap(t=>ARCHETYPES.filter(a=>a.key!=='balanced').flatMap(a=>Array.from({length:10},(_,i)=>({seed:`seat-measure-${t}-${a.key}-${i}`,config:{settType:t,...archetypePatch(a.key)}})))) : T.flatMap(t=>Array.from({length:150},(_,i)=>({seed:`seat-measure-${t}-${i}`,config:{settType:t}})));
  const tally={};
  for (const j of jobs) { const s=generateSettlementPipeline(lawConfig(j.config),null,{seed:j.seed,customContent:{}}); const g=s.powerStructure.government||''; if(!/guild/i.test(g)) continue;
    const ch=new Set(coupContenders(s).challengers.map(c=>c.name)); const fs=s.powerStructure.factions.map(f=>f.faction);
    const k=`${g} | Craft Guilds ${fs.includes('Craft Guilds')?(ch.has('Craft Guilds')?'beside, contends':'beside'):'absent'} | Merchant Guilds ${fs.includes('Merchant Guilds')?(ch.has('Merchant Guilds')?'beside, contends':'beside'):'absent'}`; tally[k]=(tally[k]||0)+1; }
  console.log('== '+arm); for (const [k,v] of Object.entries(tally).sort((a,b)=>b[1]-a[1])) console.log(`- ${k}: ${v}`);
}
