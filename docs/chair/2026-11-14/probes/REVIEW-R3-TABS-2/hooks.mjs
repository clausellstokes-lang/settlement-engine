// hooks.mjs TREE IN OUT: every plot hook whose source is a History event, with its event's type, name and text (jsonl).
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { collectPlotHooks } = await import(R+'/domain/dossier/plotHooks.js');
const { loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const out=fs.createWriteStream(process.env.OUT); let n=0;
for await (const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); const st=(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type);
  const ev=s.history?.historicalEvents||[]; const hooks=collectPlotHooks(s);
  for(const h of hooks) if(h.category==='history'){ const e=ev.find(x=>(x.plotHooks||[]).some(()=>true)&&h.source.startsWith('')); n++;
    out.write(JSON.stringify({seed,name:s.name,tier:s.tier,stress:st,source:h.source,role:h.role,text:h.text,events:ev.map(x=>({type:x.type,name:x.name,yearsAgo:x.yearsAgo,desc:(x.description||'').slice(0,300)}))})+'\n'); } }
out.end(); console.error('history hooks',n);
