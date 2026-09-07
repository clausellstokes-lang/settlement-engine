import fs from 'node:fs';
const rows=JSON.parse(fs.readFileSync('r15-rows.json','utf8'));
const leaf=(p)=>{ const s=String(p||''); const m=s.match(/\.([A-Za-z_$][A-Za-z0-9_$]*)$/); if(m) return '.'+m[1]; if(/\]$/.test(s)) return '[idx]'; return '(other)'; };
const m={}; for(const r of rows){ const k=leaf(r.p); m[k]=(m[k]||0)+1; }
const e=Object.entries(m).sort((a,b)=>b[1]-a[1]);
console.log('distinct leaf keys', e.length);
for(const [k,n] of e.slice(0,60)) console.log(String(n).padStart(5), k);
