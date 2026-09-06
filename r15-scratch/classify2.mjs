import fs from 'node:fs'; import path from 'node:path';
import { FILE_RULES, PATTERN_RULES } from './rules.mjs';
import { FILE_RULES2, PATTERN_RULES2, DEFAULTS } from './rules2.mjs';
const T=process.env.T;
const g=JSON.parse(fs.readFileSync('graph.json','utf8'));
const reach=new Set(g.reachFromUI); const importedBy=g.importedBy;
const rows=JSON.parse(fs.readFileSync('r15-rows.json','utf8'));
const topOf=(p)=>{const m=String(p||'').match(/^[^.\[]+/);return m?m[0]:'(none)';};
const leafOf=(p)=>{const s=String(p||'');const m=s.match(/\.([A-Za-z_$][A-Za-z0-9_$]*)$/);return m?'.'+m[1]:(/\]$/.test(s)?'[idx]':'(other)');};
const ancCache=new Map();
function jsxAnc(f){ if(ancCache.has(f)) return ancCache.get(f);
  const seen=new Set([f]); const q=[f]; let out=null;
  while(q.length && !out){ const cur=q.shift();
    for(const p of (importedBy[cur]||[])){ if(seen.has(p)) continue; seen.add(p);
      if(p.endsWith('.jsx')||p.startsWith('src/pdf/')){ out=p; break; } q.push(p); } }
  ancCache.set(f,out); return out; }
// line lookup: find the first line of the source file containing the literal text (or its first 60 chars)
const srcCache=new Map();
function lineOf(file, text){
  if(!srcCache.has(file)){ let s=''; try{s=fs.readFileSync(path.join(T,file),'utf8');}catch{} srcCache.set(file, s.split('\n')); }
  const lines=srcCache.get(file); if(!lines.length) return null;
  const needle=String(text).slice(0,60);
  for(let i=0;i<lines.length;i++) if(lines[i].includes(needle)) return i+1;
  const n2=String(text).slice(0,30);
  for(let i=0;i<lines.length;i++) if(lines[i].includes(n2)) return i+1;
  return null;
}
const out=[];
for(const r of rows){
  const exp=topOf(r.p), leaf=leafOf(r.p);
  const ctx={file:r.file, exp, leaf, path:r.p, text:r.text, prod:reach.has(r.file), jsxAnc:jsxAnc(r.file)};
  let hit=null;
  const tryFile=(list)=>{ for(const fr of list){ if(fr.f!==r.file) continue; if(fr.e&&fr.e!==exp) continue; if(fr.leaf&&fr.leaf!==leaf) continue; return {cls:fr.cls,cp:fr.cp,n:fr.n,ev:fr.ev||'render-site-read'}; } return null; };
  hit = tryFile(FILE_RULES) || tryFile(FILE_RULES2);
  if(!hit) for(const pr of PATTERN_RULES){ if(pr.test(ctx)){ hit={cls:pr.cls,cp:pr.cp,n:pr.n,ev:pr.ev||'declaration'}; break; } }
  if(!hit) for(const pr of PATTERN_RULES2){ if(pr.test(ctx)){ hit={cls:pr.cls,cp:pr.cp,n:pr.n,ev:pr.ev||'declaration'}; break; } }
  if(!hit){ const d=DEFAULTS(ctx); hit={cls:d.cls,cp:d.cp,n:d.n,ev:d.ev}; }
  out.push({ file:r.file, line:lineOf(r.file,r.text), text:String(r.text).slice(0,80),
    class:hit.cls, consumerPath:hit.cp, note:hit.n, evidence:hit.ev, export:exp, leaf });
}
const K=['reader','dm-only','dev','ai-prompt','ambiguous'];
const tot={}; for(const k of K) tot[k]=0;
const perFile={};
for(const o of out){ tot[o.class]++;
  const key=o.file; perFile[key]=perFile[key]||{total:0,reader:0,dm_only:0,dev:0,ai_prompt:0,ambiguous:0};
  perFile[key].total++;
  perFile[key][{reader:'reader','dm-only':'dm_only',dev:'dev','ai-prompt':'ai_prompt',ambiguous:'ambiguous'}[o.class]]++;
}
const ev={}; for(const o of out) ev[o.evidence]=(ev[o.evidence]||0)+1;
const nullLines=out.filter(o=>o.line===null).length;
console.log('rows', out.length, JSON.stringify(tot));
console.log('reader share', (tot.reader/out.length).toFixed(4));
console.log('evidence', JSON.stringify(ev));
console.log('rows with no line located', nullLines);
fs.writeFileSync('final-rows.json', JSON.stringify(out));
fs.writeFileSync('final-perfile.json', JSON.stringify(perFile));
