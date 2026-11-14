// desk.mjs: TREE=<tree> IN=<births.gz> OUT=<out.jsonl> [ONE=seed]: the Defense desk's eight lenses per town, by the
// tab's own caller (defenseDeskRead, owner's view: not public, not player), every sentence with its lens/key, and
// the pool/vid the rung reports where it does.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { defenseDeskRead } = await import(R+'/components/new/defenseDeskRead.js');
const { loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const out=process.env.OUT?fs.createWriteStream(process.env.OUT):null; let n=0,err=0;
for await (const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); if(process.env.ONE&&seed!==process.env.ONE) continue;
  const o={seed}; try{ const d=defenseDeskRead(s,{tier:s.tier}); const lines={};
    for(const [lens,ks] of Object.entries(d)) for(const [k,v] of Object.entries(ks||{})){ if(!v) continue; const r=v.rung||v; const sent=r?.sentence ?? null; lines[lens+'.'+k]={sentence:sent, beside:v.beside??undefined, pool:r?.spineKey??r?.poolKey??r?.key??undefined, vid:r?.vid??undefined}; }
    o.lines=lines; }catch(e){ o.err=e.message; err++; }
  if(process.env.ONE) console.log(JSON.stringify(o,null,1)); else out.write(JSON.stringify(o)+'\n'); n++; }
out?.end(); console.error('towns',n,'errors',err);
