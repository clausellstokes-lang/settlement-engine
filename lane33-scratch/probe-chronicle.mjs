const W = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-prose-weave';
const { generateSettlementPipeline } = await import(`${W}/src/generators/generateSettlementPipeline.js`);
const { advanceCampaignWorld } = await import(`${W}/src/domain/worldPulse/index.js`);
const { ensureRegionalGraph } = await import(`${W}/src/domain/region/index.js`);
const { DEFAULT_CONFIG } = await import(`${W}/src/store/configSlice.js`);
const { chronicleTimeline } = await import(`${W}/src/domain/display/chronicleTimeline.js`);

const WEEKS = parseInt(process.env.WEEKS || '12', 10);
const seed = 'lf-033';
const STORE_CONFIG = Object.freeze({ ...DEFAULT_CONFIG, settType: 'village' });
const FORGE_CONFIG = Object.freeze({ ...STORE_CONFIG, _randomizePriorities: true });
const DEITIES = [
  { _deityRef: 'custom:lf_vael', name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major' },
  { _deityRef: 'custom:lf_korl', name: 'Korl', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major' },
];
const town = generateSettlementPipeline(FORGE_CONFIG, null, { seed, customContent: {} });
const nTiers = ['town', 'city', 'town', 'village'];
const neighbors = nTiers.map((tier, i) => {
  const s = generateSettlementPipeline({ ...DEFAULT_CONFIG, settType: tier }, null, { seed: `${seed}-n${i}`, customContent: {} });
  if (i < 2) {
    s.config = { ...s.config, primaryDeityRef: DEITIES[i]._deityRef, primaryDeitySnapshot: DEITIES[i] };
    s.powerStructure = { ...s.powerStructure, publicLegitimacy: { score: 28, label: 'Contested' } };
  }
  return s;
});
const ids = ['t','n0','n1','n2','n3'];
const all = [town, ...neighbors];
let saves = all.map((s,i)=>({ id: ids[i], name: s.name, phase:'canon', settlement: s, campaignState:{ phase:'canon', eventLog:[], locks:{} } }));
const edges = [
  { id:'edge.t.n0', from:'t', to:'n0', relationshipType:'trade_partner' },
  { id:'edge.t.n2', from:'t', to:'n2', relationshipType:'trade_partner' },
  { id:'edge.t.n3', from:'t', to:'n3', relationshipType:'allied' },
  { id:'edge.n0.n1', from:'n0', to:'n1', relationshipType:'trade_partner' },
  { id:'edge.n1.n2', from:'n1', to:'n2', relationshipType:'trade_partner' },
];
let campaign = {
  id:`landing-${seed}`, name:'landing-fixture', settlementIds: saves.map(s=>s.id),
  worldState:{ rngSeed:`landing-${seed}`, tick:0, simulationRules:{ religionDynamicsEnabled:true } },
  regionalGraph: ensureRegionalGraph({ edges }),
  wizardNews:{ currentTick:0, entries:[] },
};
for (let t=0;t<WEEKS;t++) {
  const r = advanceCampaignWorld({ campaign, saves, interval:'one_week', now:'2026-01-01T00:00:00.000Z' });
  if (!r) break;
  campaign = { ...campaign, worldState:r.worldState, regionalGraph:r.regionalGraph, wizardNews:r.wizardNews };
  saves = saves.map(s=>{ const u=r.settlementUpdates?.find(x=>String(x.saveId)===String(s.id)); return u?{...s, settlement:u.settlement}:s; });
}
const nameOf = Object.fromEntries(saves.map(s=>[s.id,s.name]));
console.log('names', JSON.stringify(nameOf));
const news = campaign.wizardNews?.entries || [];
console.log('wizardNews total', news.length, 'kinds', JSON.stringify(news.reduce((a,e)=>((a[e.kind]=(a[e.kind]||0)+1),a),{})));
const applied = news.filter(e=>e.kind==='applied');
console.log('=== APPLIED ENTRIES (' + applied.length + ') ===');
for (const e of applied.sort((a,b)=>(a.tick||0)-(b.tick||0))) {
  console.log(`t${String(e.tick).padStart(2)} | ${e.id} | HL: ${e.headline} | SUM: ${e.summary || ''}`);
}
console.log('\n=== APPLIED, TOWN-TOUCHING (id contains .t. or ends .t) ===');
for (const e of applied.sort((a,b)=>(a.tick||0)-(b.tick||0))) {
  if (/\.t\b/.test(e.id||'')) console.log(`t${String(e.tick).padStart(2)} | ${e.id} | ${e.headline} | ${e.summary||''}`);
}
console.log('\n=== wizardNews entry sample (full shape) ===');
console.log(JSON.stringify(applied[0], null, 1));
// selectedOutcomes per pulse (the APPLIED outcomes the pulse record holds)
const hist = campaign.worldState?.pulseHistory || [];
console.log('\npulseHistory ticks', hist.length);
const tl = chronicleTimeline({ pulseHistory: hist });
console.log('timeline ticks', tl.length);
let appliedOutcomes = 0;
for (const tk of [...tl].sort((a,b)=>a.tick-b.tick)) {
  const real = (tk.headlines||[]).filter(h=>!/^candidate\./.test(h.id||''));
  appliedOutcomes += real.length;
}
console.log('non-candidate timeline headlines total', appliedOutcomes);
console.log('\n=== NON-CANDIDATE TIMELINE HEADLINES (chronological) ===');
for (const tk of [...tl].sort((a,b)=>a.tick-b.tick)) {
  for (const h of (tk.headlines||[])) {
    if (/^candidate\./.test(h.id||'')) continue;
    const who = (h.settlementIds||[]).map(i=>nameOf[i]||i).join(',');
    console.log(`t${String(tk.tick).padStart(2)} | ${h.id} | [${who}] | ${h.headline} | ${h.summary||''}`);
  }
}
