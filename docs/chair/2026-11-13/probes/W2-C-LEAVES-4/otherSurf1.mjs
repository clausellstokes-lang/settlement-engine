import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T]=process.argv.slice(2);
const { chainStateShown, tradeStoppedHere } = await import(T+'/src/domain/display/chainStateShown.js');
const W=new Set(['running','operational','entrepot']); let towns=0,n=0;
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {s}=JSON.parse(l);
  if(!tradeStoppedHere(s)) continue; let k=0; for(const c of s.economicState?.activeChains||[]) if(W.has(c.status)&&!W.has(chainStateShown(c,s))) k++; if(k){towns++;n+=k;} }
console.log('siege towns whose record (PDF colour, Foundry "(running)") still holds a working state the tab does not print:',towns,'chains',n);
