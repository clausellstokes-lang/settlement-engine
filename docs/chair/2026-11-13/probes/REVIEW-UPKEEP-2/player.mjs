// Overview and Summary in the DM, public-dossier and player views, for each seed: the two-label line and every
// other mention of the crisis noun, so a reader can see what a public copy otherwise hides.
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const H = await import(T+'/scripts/audit/soak-review/renderHarness.mjs');
await loadGenerationLawPayloads(); const h=await H.bootHarness(); const {React,RDS}=h;
const OV=await h.load('src/components/new/tabs/OverviewTab.jsx'); const SU=await h.load('src/components/new/SummaryTab.jsx');
const norm=await h.load('src/domain/display/../normalizeSettlement.js').catch(()=>null);
const N=(await h.load('src/domain/normalizeSettlement.js')).normalizeSettlement;
h.m.stub.setReaderStoreState({});
const NOUN={under_siege:'siege',famine:'famine',occupied:'occupation',politically_fractured:'split between the powers',indebted:'debt',recently_betrayed:'betray',infiltrated:'infiltrat',plague_onset:'outbreak',succession_void:'succession',monster_pressure:'raid',insurgency:'insurgen',religious_conversion:'conver',slave_revolt:'revolt',wartime:'war',mass_migration:'migra'};
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){ const m=seed.match(/^rv[23]-([a-z_+]+)-(\w+)-(\d+)$/);
  const s=N(generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false}),null,{seed,customContent:{}}));
  const out=[];
  for(const [v,p] of [['dm',{}],['public',{publicDossier:true}],['player',{playerView:true}]]){
    const t=H.htmlToText(RDS.renderToStaticMarkup(React.createElement(OV.OverviewTab||OV.default,{settlement:s,onNavigateTab:()=>{},worldState:null,...p})));
    const lines=t.split('\n'); const two=lines.filter(l=>/ before the .*while (it lasts|they last)/.test(l));
    const other=m[1].split('+').map(c=>NOUN[c]).filter(Boolean).flatMap(n=>lines.filter(l=>l.toLowerCase().includes(n)&&!/ before the .*while (it lasts|they last)/.test(l)));
    out.push(`${v}: two-label=${JSON.stringify(two)} other-mentions=${other.length}${other.length?' e.g. '+JSON.stringify(other[0].slice(0,120)):''}`);
  }
  try{ const t=H.htmlToText(RDS.renderToStaticMarkup(React.createElement(SU.default,{settlement:s}))); out.push('summary: '+JSON.stringify(t.split('\n').filter(l=>/ before the /.test(l))));}catch(e){out.push('summary ERR '+String(e).slice(0,100));}
  console.log('##',seed,'|',s.economicState.prosperity,'/',s.economicState.prosperityStanding); for(const o of out) console.log('   ',o);
}
await h.server.close();
