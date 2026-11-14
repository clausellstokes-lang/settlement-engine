import fs from 'node:fs'; import {towns} from './iter.mjs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const {chainPrintName}=await import(S+'/tip/src/domain/display/chainPrintName.js'); const {chainSourceOf}=await import(S+'/tip/src/domain/display/chainHouses.js');
const [B,DUMPS,SURF]=process.argv.slice(2); const tally={}; let pageOK=0,pageBad=0,pdfOK=0,pdfBad=0,crossPrintedOff=0; const ex=[]; const seeds={};
for await (const {seed,s} of towns(B)){ const route=s.config.tradeRouteAccess;
  const page=fs.existsSync(`${DUMPS}/${seed}.txt`)?fs.readFileSync(`${DUMPS}/${seed}.txt`,'utf8'):null; const eco=page?(page.split(/^== /m).find(x=>x.startsWith('Systems/Economics'))||''):'';
  const pdf=SURF&&fs.existsSync(`${SURF}/${seed}.pdf-canon_dossier.txt`)?fs.readFileSync(`${SURF}/${seed}.pdf-canon_dossier.txt`,'utf8'):'';
  if(route!=='crossroads' && /Strategic Crossroads/.test(eco+pdf)) {crossPrintedOff++; if(ex.length<5) ex.push('CROSS '+seed+' '+route);}
  for(const c of s.economicState?.activeChains||[]){ const pr=chainPrintName(c,s); if(pr.resource===c.resource) continue; const src=chainSourceOf(c,pr);
    const k=route+': '+c.chainId+' '+c.resource+'('+c.resourceCondition+') -> '+src; tally[k]=(tally[k]||0)+1; (seeds[k]=seeds[k]||[]).push(seed+'['+s.config.settType+']');
    if(page){ if(eco.split('\n').includes(src)) pageOK++; else {pageBad++; if(ex.length<10) ex.push('PAGE-MISS '+seed+' '+src);} }
    if(pdf){ if(pdf.split('\n').some(l=>l.startsWith(src+' » ')||l===src)) pdfOK++; else {pdfBad++; if(ex.length<10) ex.push('PDF-MISS '+seed+' '+src);} } } }
console.log(tally,{pageOK,pageBad,pdfOK,pdfBad,crossPrintedOff}); console.log(ex.join('\n')); for(const [k,v] of Object.entries(seeds)) console.log(k, v.slice(0,8).join(' '));
