import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T]=process.argv.slice(2); const { tradeStoppedHere } = await import(T+'/src/domain/display/chainStateShown.js'); const t=await import(T+'/src/domain/display/tradeListDisplay.js');
let n=0; for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l); if(!tradeStoppedHere(s)) continue; n++;
 if(/^r2s-under_siege-(thorp|metropolis)-/.test(seed)) console.log(seed, '| stopped', tradeStoppedHere(s), '| needs', t.importsAsPrinted(s).needed.length, '| note:', (s.stress?.viabilityNote||s.stresses?.[0]?.viabilityNote||'').slice(0,50)); }
console.log('towns where the row is left out:', n);
