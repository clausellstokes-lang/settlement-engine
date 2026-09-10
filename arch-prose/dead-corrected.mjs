// READ-ONLY. Unreachable-variant census against the CORRECTED per-block bags (nearest-
// preceding declaration + the per-lens overrides read from source at laneB6).
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const DIR = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/src/data/dossierStateProse';
const S = 'settlement';
const ECO = ['access','complexity','good','season',S];
const BAG = {
  'DS-GEN-3':[S],'DS-GEN-5':[S],'DS-GEN-6':[S],'DS-GEN-11':[S],'DS-GEN-12':[S],'DS-GEN-13':[S],
  'DS-GEN-17':[S],'DS-POP-3':[S],'DS-REL-2':[S],'DS-GEN-14':[S],
  'DS-GEN-2':['faction','faction2','issue',S,'stakes'],
  'DS-GEN-7':['govFaction',S],
  'DS-GEN-9':['event',S,'timeband_age','timeband_since'],
  'DS-GEN-18':['good','institution','resource',S],
  'DS-GEN-8':['ruin',S,'steading','timeband_age','timeband_since'],
  'DS-REL-1':['counterpart','faction','npc',S],
  'DS-HK-1':['governing',S],
  'DS-GEN-16':['calamity',S,'timeband_age'],
  'DS-POW-1':['seat',S],'DS-POW-2':['faction',S],'DS-POW-3':['faction','npc',S],
  'DS-POW-4':['counterpart','faction','seat',S],'DS-POW-5':['seat',S],
  'DS-POW-6':['faction','seat',S],'DS-POW-7':['counterpart','faction','seat',S],
  'DS-ECO-1':ECO,'DS-ECO-2':ECO,'DS-ECO-3':ECO,'DS-ECO-6':ECO,'DS-ECO-8':ECO,'DS-ECO-9':ECO,
  'DS-ECO-10':ECO,'DS-ECO-12':ECO,
  'DS-ECO-11':[...ECO,'institution','resource'],
  'DS-SUP-3':[...ECO,'institution'],
  'DS-DEF-1':[S],'DS-DEF-2':[S],'DS-DEF-3':[S],'DS-DEF-5':[S],'DS-DEF-6':[S],'DS-DEF-8':[S],
  'DS-DEF-4':['seat',S],'DS-DEF-11':['defwork',S],'DS-DEF-9':['good',S],
  'DS-STR-1':[S],'DS-STR-2':[S],'DS-CND-1':[S],
  'DS-WAR-1':['counterpart','creed','rival_creed',S,'term'],
  'DS-WAR-2':['counterpart','creed','rival_creed',S,'term'],
  'DS-WAR-3':['counterpart','creed','rival_creed',S,'term'],
  'DS-FTH-1':['counterpart','creed','rival_creed',S,'term'],
  'DS-FTH-2':['counterpart','creed','rival_creed',S,'term'],
  'DS-FTH-3':['counterpart','creed','rival_creed',S,'term'],
};
let dead = 0, live = 0, noSite = 0; const rows = [];
const onlyS = [];
for (const f of readdirSync(DIR).filter((x)=>x.endsWith('.generated.js')).sort()) {
  const mod = await import(`file://${join(DIR,f)}`);
  for (const [block,b] of Object.entries(Object.values(mod)[0])) {
    const bag = BAG[block];
    let d=0,l=0,n=0; const miss=new Set();
    for (const list of Object.values(b.pools||{})) for (const v of list) {
      n++; if(!bag){noSite++;continue;}
      const bad=(v.slots||[]).filter((s)=>!bag.includes(s));
      if(bad.length){d++;bad.forEach((s)=>miss.add(s));} else l++;
    }
    if(!bag){rows.push(`${block} · ${n} variants · NO CALL SITE`);continue;}
    if (bag.length===1 && bag[0]===S) onlyS.push(block);
    dead+=d; live+=l;
    if(d) rows.push(`${block} · ${n} variants · ${d} UNREACHABLE · bag=[${bag.join(',')}] · never offered: ${[...miss].sort().join(',')}`);
  }
}
rows.sort().forEach((r)=>console.log(r));
console.log(`\nCORRECTED: wired blocks 53 · reachable ${live} · UNREACHABLE ${dead} · in the 15 unwired blocks ${noSite} · total ${live+dead+noSite}`);
console.log(`settlement-ONLY bag, corrected (${onlyS.length}): ${onlyS.sort().join(' · ')}`);
