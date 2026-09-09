import fs from 'node:fs';
import { FILE_RULES, PATTERN_RULES } from './rules.mjs';
const g=JSON.parse(fs.readFileSync('graph.json','utf8'));
const reach=new Set(g.reachFromUI);
const rows=JSON.parse(fs.readFileSync('r15-rows.json','utf8'));
const topOf=(p)=>{const m=String(p||'').match(/^[^.\[]+/);return m?m[0]:'(none)';};
const leafOf=(p)=>{const s=String(p||'');const m=s.match(/\.([A-Za-z_$][A-Za-z0-9_$]*)$/);return m?'.'+m[1]:(/\]$/.test(s)?'[idx]':'(other)');};
const out=[]; const unmatched=new Map();
for(const r of rows){
  const exp=topOf(r.p), leaf=leafOf(r.p);
  const ctx={file:r.file, exp, leaf, path:r.p, text:r.text, prod:reach.has(r.file)};
  let hit=null;
  for(const fr of FILE_RULES){
    if(fr.f!==r.file) continue;
    if(fr.e && fr.e!==exp) continue;
    if(fr.leaf && fr.leaf!==leaf) continue;
    hit={cls:fr.cls, cp:fr.cp, n:fr.n}; break;
  }
  if(!hit) for(const pr of PATTERN_RULES){ if(pr.test(ctx)){ hit={cls:pr.cls, cp:pr.cp, n:pr.n}; break; } }
  if(!hit){ const k=r.file+'::'+exp+'::'+leaf; if(!unmatched.has(k)) unmatched.set(k,{file:r.file,exp,leaf,n:0,ex:[],prod:ctx.prod}); const u=unmatched.get(k); u.n++; if(u.ex.length<2) u.ex.push(r.text.slice(0,90)); continue; }
  out.push({...r, exp, leaf, cls:hit.cls, cp:hit.cp, note:hit.n});
}
console.log('classified', out.length, 'unmatched rows', rows.length-out.length, 'unmatched groups', unmatched.size);
const ents=[...unmatched.values()].sort((a,b)=>b.n-a.n);
fs.writeFileSync('unmatched.json', JSON.stringify(ents,null,1));
fs.writeFileSync('classified.json', JSON.stringify(out));
const lines=[];
for(const u of ents) lines.push(`${String(u.n).padStart(4)} ${u.prod?'PROD':'DARK'} ${u.file} :: ${u.exp} :: ${u.leaf} || ${JSON.stringify(u.ex[0]||'')}`);
fs.writeFileSync('unmatched.txt', lines.join('\n'));
console.log('top unmatched:'); for(const l of lines.slice(0,25)) console.log('  '+l);
