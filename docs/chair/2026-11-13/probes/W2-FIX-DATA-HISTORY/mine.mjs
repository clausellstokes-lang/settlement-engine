// node mine.mjs <hits.json> [seedsFilterFile] : hits whose writer is in this seat's six files, by kind and writer line (towns)
import fs from 'node:fs';
const MINE=['src/data/historyData.js','src/data/historyDescVariants.js','src/generators/historyGenerator.js','src/data/cultureProfiles.js','src/data/arrivalProse.js','src/data/inlandDescriptions.js'];
const raw=JSON.parse(fs.readFileSync(process.argv[2])); const hits=Array.isArray(raw)?raw:(raw.hits||[]);
const only=process.argv[3]?new Set(fs.readFileSync(process.argv[3],'utf8').trim().split('\n')):null;
const mine=hits.filter(h=>h.writer&&MINE.some(m=>String(h.writer.file||h.writer).includes(m))&&(!only||only.has(h.seed)));
const kinds={}; for(const h of mine){ (kinds[h.pattern]=kinds[h.pattern]||new Set()).add(h.seed+'|'+h.line); }
console.log('hits in the six files', mine.length, 'towns', new Set(mine.map(h=>h.seed)).size, 'by kind (town+line):', Object.entries(kinds).map(([k,v])=>k+' '+v.size).join(', '));
const by=new Map(); for(const h of mine){ const k=String(h.writer.file).split('/').pop()+' :: '+h.writer.fn+' '+h.pattern+'/'+h.sub+' :: '+String(h.line).replace(/\s+/g,' ').slice(0,120); (by.get(k)||by.set(k,new Set()).get(k)).add(h.seed); }
for(const [k,v] of [...by].sort((a,b)=>b[1].size-a[1].size).slice(0,+(process.argv[4]||80))) console.log(v.size+'\t'+k+'\t'+[...v][0]);
