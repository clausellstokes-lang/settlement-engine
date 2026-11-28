import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T,goodsArg,n='3',side='']=process.argv.slice(2); const goods=goodsArg.split('|');
const t=await import(T+'/src/domain/display/tradeListDisplay.js'); const {chainStateShown}=await import(T+'/src/domain/display/chainStateShown.js');
const {chainCarrierOf}=await import(T+'/src/domain/facts/chainCarrier.js'); const {liveInstitutionNames}=await import(T+'/src/domain/facts/institutions.js');
const cnt={};
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l); const eco=s.economicState||{};
  for(const [sd,list] of [['local',eco.localProduction||[]],['exports',eco.primaryExports||[]]]) { if(side&&sd!==side) continue; for(const raw of list){ const g=t.tradeMarkOf(raw).label; if(!goods.includes(g)) continue;
    if(t.pillBorneOut(raw,sd,s)) continue; const k=g+sd; cnt[k]=(cnt[k]||0)+1; if(cnt[k]>+n) continue;
    const mk=(eco.activeChains||[]).filter(c=>(c.outputs||[]).some(o=>String(o).toLowerCase()===g.toLowerCase()));
    console.log(seed,sd,JSON.stringify(raw),'| makers:',mk.map(c=>`${c.chainId}:${c.status}>${chainStateShown(c,s)||'∅'}:${chainCarrierOf(c,s).kind}:ent${c.entrepot?1:0}:[${(c.processingInstitutions||[]).join('/')}]`).join(' ; '),'| roster:',liveInstitutionNames(s).filter(x=>/mage|academ|stable|beast|horse|tann|leather|cooper|bak|mill|smith|metal|weav|tailor|dye|fuller|guild|glass|print|church|chapel|shrine|temple/i.test(x)).join('; ').slice(0,300)); } } }
