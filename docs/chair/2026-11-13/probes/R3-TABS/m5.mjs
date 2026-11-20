// m5: the Defense threat rows and posture on the defence reader's 1,440 seeds (rv2/rv3/rv4, the app's shape).
import fs from 'node:fs';
const T=process.env.TREE+'/src';
const { generateSettlementPipeline } = await import(T+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/store/configSlice.js');
const D = await import(T+'/domain/display/stateProse/defenseStateProse.js');
const { scoreBand } = await import(T+'/domain/display/defenseScoreBands.js');
const { standingDefenseForces } = await import(T+'/domain/institutions/defenseInstitutionBuckets.js');
await loadGenerationLawPayloads();
const cfgFor=(seed)=>{ const m=seed.match(/^rv[234]-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); return birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false}); };
const out=fs.createWriteStream(process.argv[3]);
const sen=(r)=>r?.sentence??null; const key=(r)=>r?.provenance?.poolKey??null; const vid=(r)=>r?.provenance?.pieces?.[0]?.vid??null;
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  const o={seed,audience:'dm',tierNoun:s.tier};
  const th=D.defenseThreatProse(s,o); const po=D.defensePostureProse(s,o); const F=standingDefenseForces(s); const sc=s.defenseProfile?.scores||{};
  out.write(JSON.stringify({seed, badge:s.defenseProfile?.readiness?.label, rs:s.defenseProfile?.readiness?.score,
    bands:{mil:scoreBand(sc.military??0),mon:scoreBand(sc.monster??0),eco:scoreBand(sc.economic??0)}, eco:sc.economic,
    forces:Object.fromEntries(Object.entries(F).map(([k,v])=>[k,v.present])), stress:[].concat(s.stress||[]).map(x=>x?.type).filter(Boolean),
    inv:{k:key(th.invasion),v:vid(th.invasion),s:sen(th.invasion)}, bea:{k:key(th.beasts),v:vid(th.beasts),s:sen(th.beasts)},
    ecoRow:{k:key(th.economic),v:vid(th.economic),s:sen(th.economic), want:D.economicRowPoolKey(sc.economic)},
    post:{k:key(po.posture?.rung),s:po.posture?.beside??null} })+'\n');
}
out.end();
