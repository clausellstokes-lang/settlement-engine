// printdiff.mjs TREE IN OUT: the PDF's print prose (buildPrintProse) per town, every string leaf with its path (jsonl).
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { buildPrintProse } = await import(R+'/domain/display/stateProse/printProse.js');
const { loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const out=fs.createWriteStream(process.env.OUT); let err=0;
for await (const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); const leaves={};
  try{ const p=buildPrintProse(s,{}); (function w(x,path){ if(typeof x==='string'){ leaves[path]=x; return;} if(x&&typeof x==='object') for(const [k,v] of Object.entries(x)) w(v,path+'.'+k); })(p,''); }catch(e){ err++; leaves.ERR=e.message; }
  out.write(JSON.stringify({seed,leaves})+'\n'); }
out.end(); console.error('errors',err);
