import { readFileSync } from 'node:fs';
const W = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-prose-weave';
const { generateSettlementPipeline } = await import(`${W}/src/generators/generateSettlementPipeline.js`);
const { advanceCampaignWorld } = await import(`${W}/src/domain/worldPulse/index.js`);
const { ensureRegionalGraph } = await import(`${W}/src/domain/region/index.js`);
const { DEFAULT_CONFIG } = await import(`${W}/src/store/configSlice.js`);
const WEEKS = 12, seed='lf-033';
const STORE_CONFIG = Object.freeze({ ...DEFAULT_CONFIG, settType: 'village' });
const FORGE_CONFIG = Object.freeze({ ...STORE_CONFIG, _randomizePriorities: true });
const DEITIES = [
  { _deityRef: 'custom:lf_vael', name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major' },
  { _deityRef: 'custom:lf_korl', name: 'Korl', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major' },
];
const town = generateSettlementPipeline(FORGE_CONFIG, null, { seed, customContent: {} });
const neighbors = ['town','city','town','village'].map((tier,i)=>{
  const s = generateSettlementPipeline({ ...DEFAULT_CONFIG, settType: tier }, null, { seed:`${seed}-n${i}`, customContent:{} });
  if (i<2) { s.config={...s.config, primaryDeityRef:DEITIES[i]._deityRef, primaryDeitySnapshot:DEITIES[i]}; s.powerStructure={...s.powerStructure, publicLegitimacy:{score:28,label:'Contested'}}; }
  return s;
});
const ids=['t','n0','n1','n2','n3'];
let saves=[town,...neighbors].map((s,i)=>({id:ids[i],name:s.name,phase:'canon',settlement:s,campaignState:{phase:'canon',eventLog:[],locks:{}}}));
let campaign={id:`landing-${seed}`,name:'landing-fixture',settlementIds:ids,
  worldState:{rngSeed:`landing-${seed}`,tick:0,simulationRules:{religionDynamicsEnabled:true}},
  regionalGraph:ensureRegionalGraph({edges:[
   {id:'edge.t.n0',from:'t',to:'n0',relationshipType:'trade_partner'},
   {id:'edge.t.n2',from:'t',to:'n2',relationshipType:'trade_partner'},
   {id:'edge.t.n3',from:'t',to:'n3',relationshipType:'allied'},
   {id:'edge.n0.n1',from:'n0',to:'n1',relationshipType:'trade_partner'},
   {id:'edge.n1.n2',from:'n1',to:'n2',relationshipType:'trade_partner'}]}),
  wizardNews:{currentTick:0,entries:[]}};
for(let t=0;t<WEEKS;t++){
  const r=advanceCampaignWorld({campaign,saves,interval:'one_week',now:'2026-01-01T00:00:00.000Z'});
  if(!r) break;
  campaign={...campaign,worldState:r.worldState,regionalGraph:r.regionalGraph,wizardNews:r.wizardNews};
  saves=saves.map(s=>{const u=r.settlementUpdates?.find(x=>String(x.saveId)===String(s.id));return u?{...s,settlement:u.settlement}:s;});
}
const news=(campaign.wizardNews?.entries||[]).filter(e=>e.kind==='applied');
const mine=news.filter(e=>(e.settlementIds||[]).includes('t')).sort((a,b)=>(a.tick||0)-(b.tick||0));
console.log('APPLIED entries whose settlementIds include t:', mine.length);
for(const e of mine) console.log(`t${String(e.tick).padStart(2)} sig=${e.significance} score=${e.score} sev=${e.severity} kindImpact=${e.impactKind} scope=${e.scope}\n      HL: ${e.headline}\n      SUM: ${e.summary}`);
console.log('\n--- distinct headlines ---');
const seen=new Map(); for(const e of mine) if(!seen.has(e.headline)) seen.set(e.headline,e);
console.log([...seen.keys()].length);
for(const [h,e] of seen) console.log(`t${e.tick} | score ${e.score} | ${h} :: ${e.summary}`);
