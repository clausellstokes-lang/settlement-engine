import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births] = process.argv.slice(2);
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const qg = await import(tree + '/src/domain/summary/settlementQuickGuide.js');
const forms={};
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const g = qg.composeSettlementQuickGuide(s); const f = (g.definingTruths||[]).find(x=>/live|material/i.test(x.id+x.label)); const t=(f?.text||'(none)');
  const m = t.match(/food[^.;,]*/i); const k=(m?m[0]:'(no food clause)')+' || label='+s.economicState?.foodSecurity?.label+' gap>0='+(s.economicState?.foodSecurity?.foodRecord?.gapPct>0); forms[k]=(forms[k]||0)+1; }
for(const [k,v] of Object.entries(forms).sort((a,b)=>b[1]-a[1]).slice(0,14)) console.log(v,k);
