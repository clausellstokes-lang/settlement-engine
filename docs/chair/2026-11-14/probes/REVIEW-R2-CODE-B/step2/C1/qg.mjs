import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births] = process.argv.slice(2);
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const qg = await import(tree + '/src/domain/summary/settlementQuickGuide.js'); const ts = await import(tree + '/src/domain/summary/tonightSheet.js');
let n=0, agree=0, ovAgree=0, ex=[]; const forms={};
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const g = qg.composeSettlementQuickGuide(s); const txt = JSON.stringify(g); const band = ts.foodBandOf?.(s.economicState?.foodSecurity?.foodRecord)?.label; const lab = s.economicState?.foodSecurity?.label;
  const m = txt.match(/food (?:security )?(?:is |reads )?([^",.]*)/i); n++;
  const k = (band && txt.toLowerCase().includes(band.toLowerCase())) ? 'band' : (lab && txt.toLowerCase().includes(lab.toLowerCase())) ? 'stored' : 'neither'; forms[k]=(forms[k]||0)+1; if(k==='neither'&&ex.length<2) ex.push(seed+' '+txt.slice(0,300)); }
console.log(n, forms); console.log(ex.join('\n'));
