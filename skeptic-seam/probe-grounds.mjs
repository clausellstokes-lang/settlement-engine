import { readFileSync } from 'node:fs';
import { rateGrid } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/scripts/prose-rate-corpus.mjs';
import { generateSettlementPipeline } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/src/generators/generateSettlementPipeline.js';
import { compromisedSecurityInstitutions, npcHomeInstitution, SECURITY_INSTITUTION_RE } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/src/domain/corruption.js';
import { HOLDER_KINDS, holdersOf, standingOf } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/src/domain/prose/holderTable.js';
const census = JSON.parse(readFileSync('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/docs/content/wiring-census.json','utf8'));
const licensed = census.rows.filter((r) => r.source && r.source.standing === 'LICENSED');
const t0=Date.now();
let towns=0, throws=0;
const cap=new Map(); const byTier=new Map();
let impairAny=0, impairCorrupt=0, corruptNpcTowns=0, corruptNpcs=0, homed=0, homedSec=0;
let townsAnyInterestCar=0, townsAnyInterestCF=0;
let pairsCar=0, pairsCF=0, pairsTotal=0, heldTotal=0;
let govCaptureTowns=0;
const homes=new Map();
for (const spec of rateGrid()) {
  let s; try { s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }); } catch { throws++; continue; }
  towns++;
  const tier=String(spec.config.settType);
  if(!byTier.has(tier)) byTier.set(tier,{towns:0,pairs:0,held:0,car:0,cf:0});
  const cell=byTier.get(tier); cell.towns++;
  const ccs = String(s?.powerStructure?.criminalCaptureState ?? '(absent)');
  cap.set(ccs,(cap.get(ccs)||0)+1);
  const facs = s?.powerStructure?.factions || [];
  if (facs.some(f=>f && typeof f.captureState==='string' && f.captureState!=='none')) govCaptureTowns++;
  const insts = Array.isArray(s.institutions)?s.institutions:[];
  if (insts.some(i=>(i.impairments||[]).length)) impairAny++;
  if (insts.some(i=>(i.impairments||[]).some(m=>m?.type==='corruption'))) impairCorrupt++;
  let hasCorruptNpc=false;
  const sec = insts.filter(i=>SECURITY_INSTITUTION_RE.test(String(i?.name||'')));
  for (const npc of s.npcs||[]) { if(npc?.corrupt!==true||npc?.ousted) continue; corruptNpcs++; hasCorruptNpc=true;
    const home=npcHomeInstitution(npc); if(home){homed++; homes.set(String(home),(homes.get(String(home))||0)+1);
      if (sec.some(i=>String(i.name).toLowerCase().includes(String(home).toLowerCase())||String(home).toLowerCase().includes(String(i.name).toLowerCase()))) homedSec++; } }
  if(hasCorruptNpc) corruptNpcTowns++;
  const compromised = compromisedSecurityInstitutions(s);
  const perKindCar=new Map(), perKindCF=new Map();
  for (const kind of HOLDER_KINDS) {
    const hs = holdersOf(kind, s);
    let iCar=false, iCF=false;
    for (const h of hs) {
      if (standingOf(h, s, { compromised }).interested) iCar=true;
      if (standingOf(h, s, { compromised, captureState: ccs }).interested) iCF=true;
    }
    perKindCar.set(kind,{n:hs.length,i:iCar}); perKindCF.set(kind,{i:iCF});
  }
  let anyCar=false, anyCF=false;
  for (const row of licensed) {
    pairsTotal++; cell.pairs++;
    const kinds=row.source.kinds;
    if (kinds.some(k=>perKindCar.get(k).n>0)) { heldTotal++; cell.held++; }
    if (kinds.some(k=>perKindCar.get(k).i)) { pairsCar++; cell.car++; anyCar=true; }
    if (kinds.some(k=>perKindCF.get(k).i)) { pairsCF++; cell.cf++; anyCF=true; }
  }
  if(anyCar) townsAnyInterestCar++; if(anyCF) townsAnyInterestCF++;
}
console.log('towns',towns,'throws',throws,'secs',Math.round((Date.now()-t0)/1000));
console.log('LICENSED rows walked per town', licensed.length);
console.log('criminalCaptureState:', [...cap].sort((a,b)=>b[1]-a[1]).map(([k,n])=>k+' '+n).join(' · '));
console.log('towns whose powerStructure.factions carry a non-none captureState:', govCaptureTowns);
console.log('GROUND 2 · towns with ANY institution impairment', impairAny, '· corruption-typed', impairCorrupt);
console.log('GROUND 3 · corrupt un-ousted NPCs', corruptNpcs, '· homed', homed, '· homed to a SECURITY institution', homedSec, '· towns with a corrupt NPC', corruptNpcTowns);
console.log('  home values:', [...homes].sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,n])=>k+' '+n).join(' · '));
console.log('(row,town) pairs', pairsTotal, 'holder named', heldTotal);
console.log("CAR's reading   INTERESTED pairs", pairsCar, '· towns with any', townsAnyInterestCar);
console.log('COUNTERFACTUAL (captureState = the town own criminalCaptureState) INTERESTED pairs', pairsCF, '· towns with any', townsAnyInterestCF);
console.log('tier        towns   pairs   held    car   counterfactual');
for (const t of ['thorp','hamlet','village','town','city','metropolis']) { const c=byTier.get(t); if(!c) continue;
  console.log(t.padEnd(11), String(c.towns).padStart(5), String(c.pairs).padStart(7), String(c.held).padStart(6), String(c.car).padStart(6), String(c.cf).padStart(10)); }
