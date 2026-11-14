import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T]=process.argv.slice(2); const t=await import(T+'/src/domain/display/tradeListDisplay.js');
let n=0,towns=new Set(),pdfTowns=0; const ex=[];
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l); const eco=s.economicState||{};
  const bought=new Set(t.importsAsPrinted(s).arriving.map(x=>t.tradeMarkOf(x).label.toLowerCase()));
  for(const p of t.localProductionAsPrinted(s)) if(bought.has(p.toLowerCase())){n++;towns.add(seed); if(ex.length<4) ex.push(seed+': '+p);}
  const tab=new Set([...t.exportsAsPrinted(s),...t.localProductionAsPrinted(s)]); const pdf=[...(eco.primaryExports||[]),...(eco.localProduction||[])].filter(x=>typeof x==='string');
  const jr=t.displayTradeList(eco.primaryExports,s,{side:'exports'}); if(jr.some(x=>!tab.has(x))||pdf.some(x=>!tab.has(x)&&!tab.has(x+' (transit)'))) pdfTowns++; }
console.log('local pills bought in AND worked by the leaf (kept; named):',n,'in',towns.size,'towns e.g.',ex.join(' | '));
console.log('towns whose PDF chapter or Foundry journal lists a pill the tab does not print:',pdfTowns);
