import fs from 'node:fs'; import path from 'node:path';
const T=process.env.T;
const g=JSON.parse(fs.readFileSync('graph.json','utf8'));
const importedBy=g.importedBy; const reach=new Set(g.reachFromUI); const jreach=new Set(g.jreach); const aiReach=new Set(g.aiReach);
const rows=JSON.parse(fs.readFileSync('r15-rows.json','utf8'));
const hits=JSON.parse(fs.readFileSync('ident-hits.json','utf8'));
const topOf=(p)=>{const m=String(p||'').match(/^[^.\[]+/);return m?m[0]:'(none)';};
const leaf=(p)=>{const s=String(p||'');const m=s.match(/\.([A-Za-z_$][A-Za-z0-9_$]*)$/);return m?'.'+m[1]:(/\]$/.test(s)?'[idx]':'(other)');};
// per file
const byFile=new Map();
for(const r of rows){ if(!byFile.has(r.file)) byFile.set(r.file,[]); byFile.get(r.file).push(r); }
// jsx ancestors (BFS up importedBy)
function jsxAncestors(f, cap=6){
  const seen=new Set([f]); const q=[f]; const out=[];
  while(q.length && out.length<cap){ const cur=q.shift();
    for(const p of (importedBy[cur]||[])){ if(seen.has(p)) continue; seen.add(p);
      if(p.endsWith('.jsx')||p.startsWith('src/pdf/')){ out.push(p); if(out.length>=cap) break; } else q.push(p); } }
  return out;
}
const out=[];
const ents=[...byFile.entries()].sort((a,b)=>b[1].length-a[1].length);
for(const [file,rs] of ents){
  let head=''; try{ head=fs.readFileSync(path.join(T,file),'utf8').split('\n').slice(0,14).filter(l=>l.trim()).join(' ⏎ ').slice(0,600);}catch{}
  const flags=[reach.has(file)?'PROD':'no-prod', jreach.has(file)?'JSX':'no-jsx', aiReach.has(file)?'AI':''].filter(Boolean).join(',');
  out.push(`\n@@@@ FILE ${file}   n=${rs.length}   [${flags}]`);
  out.push(`  HEAD: ${head}`);
  out.push(`  jsxAnc: ${jsxAncestors(file).join(' , ')||'(none)'}`);
  out.push(`  directImporters: ${(importedBy[file]||[]).slice(0,8).join(' , ')||'(none in src)'}`);
  // groups within file
  const gm=new Map();
  for(const r of rs){ const k=topOf(r.p); if(!gm.has(k))gm.set(k,[]); gm.get(k).push(r); }
  for(const [k,v] of [...gm.entries()].sort((a,b)=>b[1].length-a[1].length)){
    const lk={}; for(const r of v){ const L=leaf(r.p); lk[L]=(lk[L]||0)+1; }
    const id=k.replace(/\(\)$/,'');
    const ext=(hits[id]||[]).filter(h=>!h.startsWith(file+':')).map(h=>h.split(':')[0]);
    const extF=[...new Set(ext)];
    const nonTest=extF.filter(f=>!f.startsWith('tests/')&&!f.startsWith('docs/'));
    out.push(`  -- EXPORT ${k}  n=${v.length}  leafkeys=${JSON.stringify(lk).slice(0,200)}`);
    out.push(`     paths: ${[...new Set(v.slice(0,4).map(r=>r.p))].join(' | ').slice(0,240)}`);
    for(const s of v.slice(0,3)) out.push(`     ex: ${JSON.stringify(s.text.slice(0,150))}`);
    out.push(`     usedIn(nonTest): ${nonTest.slice(0,8).join(' , ')||'(NONE)'}   testsOnly=${nonTest.length===0}`);
  }
}
fs.writeFileSync('worksheet2.txt', out.join('\n'));
console.log('lines', out.length);
