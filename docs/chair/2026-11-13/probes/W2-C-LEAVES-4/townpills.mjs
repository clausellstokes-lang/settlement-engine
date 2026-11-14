import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,A,B,...want]=process.argv.slice(2);
const ta=await import(A+'/src/domain/display/tradeListDisplay.js'), tb=await import(B+'/src/domain/display/tradeListDisplay.js');
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l); if(!want.includes(seed)) continue; const eco=s.economicState||{};
  const d=(a,b)=>{const B=new Set(b); const A=new Set(a); return `out [${a.filter(x=>!B.has(x)).join(', ')}] in [${b.filter(x=>!A.has(x)).join(', ')}]`;};
  console.log(seed,'LOCAL',d(ta.localProductionAsPrinted(s),tb.localProductionAsPrinted(s)),'| EXPORTS',d(ta.displayTradeList(eco.primaryExports,s,{side:'exports'}),tb.exportsAsPrinted(s))); }
