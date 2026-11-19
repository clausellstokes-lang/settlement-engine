import fs from 'node:fs'; import zlib from 'node:zlib';
export function loadCorpus(f){ const t=zlib.gunzipSync(fs.readFileSync(f||process.env.CORPUS)).toString(); return t.trim().split('\n').map(l=>JSON.parse(l)); }
export function dump(seed){ try{ return fs.readFileSync(`${process.env.DUMPS}/${seed}.txt`,'utf8'); }catch{ return null; } }
export function views(txt){ const o={}; let cur='_'; for(const l of txt.split('\n')){ const m=l.match(/^== (.*) ==/); if(m){cur=m[1]; o[cur]=[]; continue;} (o[cur]||(o[cur]=[])).push(l);} return o; }
export const sizeOf=(seed)=>seed.match(/(thorp|hamlet|village|town|city|metropolis)/)[1];
const RC=new Set(['thorp-3','thorp-4','hamlet-3','hamlet-4','village-3','village-4','town-3','town-4','city-3','metropolis-3']); export const armOf=(seed)=>seed.startsWith('r2s-')?'crisis':seed.startsWith('r2read-')&&RC.has(seed.replace('r2read-',''))?'crisis':'calm';
