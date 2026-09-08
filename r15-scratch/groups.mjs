import fs from 'node:fs';
const rows = JSON.parse(fs.readFileSync('r15-rows.json','utf8'));
const topOf = (p)=>{ if(!p) return '(none)'; const m = String(p).match(/^[^.\[]+/); return m?m[0]:String(p); };
const g = new Map();
for (const r of rows){ const k = r.file+'::'+topOf(r.p); if(!g.has(k)) g.set(k,[]); g.get(k).push(r); }
console.log('groups', g.size);
const ents=[...g.entries()].sort((a,b)=>b[1].length-a[1].length);
console.log('top 60 groups:');
for (const [k,v] of ents.slice(0,60)) console.log('  ', v.length, k, '|| ex:', JSON.stringify(v[0].text.slice(0,90)));
fs.writeFileSync('r15-groups.json', JSON.stringify(ents.map(([k,v])=>({key:k,file:v[0].file,exp:k.split('::')[1],n:v.length,samples:v.slice(0,3).map(r=>r.text.slice(0,120)),paths:[...new Set(v.slice(0,6).map(r=>r.p))]})),null,1));
