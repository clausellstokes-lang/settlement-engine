import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T]=process.argv.slice(2); const {chainStateShown,tradeStoppedHere}=await import(T+'/src/domain/display/chainStateShown.js');
const by={}; let towns=0;
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l); if(!tradeStoppedHere(s)||s.economicState?.tradeAccess!=='port') continue; towns++;
  for(const c of s.economicState.activeChains||[]) if(chainStateShown(c,s)!==c.status){ const k=c.resourceInputKey+'|'+c.chainId; (by[k]=by[k]||[]).push(seed);} }
console.log('port sieges',towns); for(const [k,v] of Object.entries(by)) console.log(v.length,k,v.slice(0,3).join(' '));
