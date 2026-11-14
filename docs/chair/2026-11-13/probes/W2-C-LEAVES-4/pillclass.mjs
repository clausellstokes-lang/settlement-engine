import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,A,B]=process.argv.slice(2);
const ta=await import(A+'/src/domain/display/tradeListDisplay.js'), tb=await import(B+'/src/domain/display/tradeListDisplay.js');
const {chainStateShown}=await import(B+'/src/domain/display/chainStateShown.js'); const {chainCarrierOf}=await import(B+'/src/domain/facts/chainCarrier.js');
const W=['running','operational','entrepot','vulnerable','magically_sustained'];
const NG=new Set(['trade access','maritime trade access','toll income','market taxes','date export','maritime trade revenue']);
const cls={}, ex={}, all=[]; let towns=new Set(), transit=0, transitTowns=new Set(), needsBefore=0, needsAfter=0, needTowns=0;
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l); const eco=s.economicState||{};
  const nb=ta.importsAsPrinted(s).needed.length, na=tb.importsAsPrinted(s).needed.length; needsBefore+=nb; needsAfter+=na; if(na!==nb) needTowns++;
  const bought=new Set(tb.importsAsPrinted(s).arriving.map(x=>tb.tradeMarkOf(x).label.toLowerCase()));
  const sides={local:[ta.localProductionAsPrinted(s),tb.localProductionAsPrinted(s)],exports:[ta.displayTradeList(eco.primaryExports,s,{side:'exports'}),tb.exportsAsPrinted(s)]};
  for(const [sd,[a,b]] of Object.entries(sides)){ const bl=new Map(b.map(x=>[tb.tradeMarkOf(x).label.toLowerCase(),x]));
    for(const raw of a){ const g=ta.tradeMarkOf(raw).label; const lo=g.toLowerCase(); if(bl.has(lo)){ if(bl.get(lo)!==raw){transit++;transitTowns.add(seed);} continue; }
      const mk=(eco.activeChains||[]).filter(c=>(c.outputs||[]).some(o=>String(o).toLowerCase()===lo));
      let r; if(NG.has(lo.replace(/_/g,' '))) r='(iv) not a good';
      else if(sd==='local'&&bought.has(lo)) r='(v) bought in, not worked';
      else if(mk.length&&mk.some(c=>W.includes(c.status))&&!mk.some(c=>W.includes(chainStateShown(c,s)))) r='(ii)/(vi) its chain shown impaired (crisis)';
      else if(mk.length&&mk.every(c=>c.entrepot&&['transit','none'].includes(chainCarrierOf(c,s).kind))) r='(ii) carried by an entrepôt, not made';
      else if(mk.length&&!mk.some(c=>W.includes(c.status))) r='(vi) its chain impaired or broken in the record';
      else r='(ii)/(iii) the house its making needs is not on the roster';
      const k=sd+' · '+r; cls[k]=(cls[k]||0)+1; (ex[k]=ex[k]||[]).push(`${seed}: ${g}`); towns.add(seed);
      if(process.env.READ){ all.push(`${seed} [${sd}] ${g} :: ${r} :: makers ${mk.map(c=>c.chainId+':'+c.status+'>'+(chainStateShown(c,s)||'none')+':['+(c.processingInstitutions||[]).join('/')+']').join('; ')||'-'} :: roster ${(s.institutions||[]).map(i=>i.name).join('; ').slice(0,240)}`); }
    } } }
for(const [k,n] of Object.entries(cls).sort((a,b)=>b[1]-a[1])) console.log(n,k,'e.g.',[...new Set(ex[k])].filter((_,i)=>i%Math.max(1,Math.floor(ex[k].length/3))===0).slice(0,3).join(' | '));
console.log('towns with a pill gone',towns.size,'; exports re-marked transit',transit,'in',transitTowns.size,'towns; "Needed, and not brought in" items',needsBefore,'->',needsAfter,'(towns changed',needTowns+')');
if(process.env.READ){ const st=Math.max(1,Math.floor(all.length/+process.env.READ)); console.log(all.filter((_,i)=>i%st===0).slice(0,+process.env.READ).join('\n')); }
