import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const roots=[join(DOCK,'src')];
const hits=new Map();
function walk(d){for(const e of readdirSync(d)){const p=join(d,e);const st=statSync(p);if(st.isDirectory()){if(e==='node_modules')continue;walk(p);}else if(/\.(js|jsx|json|ts)$/.test(e)){
 const src=readFileSync(p,'utf8');
 for(const ch of src){const cp=ch.codePointAt(0);
   // report codepoints that the jsPDF sanitiser strips but that are letters
   if(cp>0x7e && !(cp>=0xa0&&cp<=0xff)){
     if(cp>=0x2000&&cp<=0x206f) continue; // punctuation, counted separately
     const k='U+'+cp.toString(16).toUpperCase().padStart(4,'0')+' '+ch;
     const rec=hits.get(k)||{n:0,files:new Set()}; rec.n++; rec.files.add(p.slice(DOCK.length+1)); hits.set(k,rec);
   }
 }
}}}
for(const r of roots) walk(r);
const rows=[...hits.entries()].sort((a,b)=>b[1].n-a[1].n);
console.log('distinct non-Latin1 non-ASCII (excl U+2000-206F) codepoints in src/:', rows.length);
for(const [k,v] of rows.slice(0,60)) console.log(String(v.n).padStart(6), k, '|', [...v.files].slice(0,3).join(' '), v.files.size>3?`(+${v.files.size-3} files)`:'');
