import fs from 'node:fs'; import path from 'node:path';
const T=process.env.T;
const g=JSON.parse(fs.readFileSync('graph.json','utf8'));
const importedBy=g.importedBy; const reach=new Set(g.reachFromUI); const jreach=new Set(g.jreach); const aiReach=new Set(g.aiReach);
const rows=JSON.parse(fs.readFileSync('r15-rows.json','utf8'));
const hits=JSON.parse(fs.readFileSync('ident-hits.json','utf8'));
const topOf=(p)=>{const m=String(p||'').match(/^[^.\[]+/);return m?m[0]:'(none)';};
const leaf=(p)=>{const s=String(p||'');const m=s.match(/\.([A-Za-z_$][A-Za-z0-9_$]*)$/);return m?'.'+m[1]:(/\]$/.test(s)?'[idx]':'(other)');};
const byFile=new Map();
for(const r of rows){ if(!byFile.has(r.file)) byFile.set(r.file,[]); byFile.get(r.file).push(r); }
function jsxAncestors(f, cap=5){ const seen=new Set([f]); const q=[f]; const out=[];
  while(q.length && out.length<cap){ const cur=q.shift();
    for(const p of (importedBy[cur]||[])){ if(seen.has(p)) continue; seen.add(p);
      if(p.endsWith('.jsx')||p.startsWith('src/pdf/')){ out.push(p); if(out.length>=cap) break; } else q.push(p); } }
  return out; }
const out=[];
const ents=[...byFile.entries()].sort((a,b)=>b[1].length-a[1].length);
for(const [file,rs] of ents){
  let srcTxt=''; try{ srcTxt=fs.readFileSync(path.join(T,file),'utf8'); }catch{}
  const lines=srcTxt.split('\n');
  const head=lines.slice(0,10).filter(l=>l.trim()).join(' ⏎ ').slice(0,420);
  const flags=[reach.has(file)?'PROD':'NO-PROD', jreach.has(file)?'JSX':'no-jsx', aiReach.has(file)?'AI':''].filter(Boolean).join(',');
  out.push(`\n@@@@ ${file}  n=${rs.length}  [${flags}]`);
  out.push(`  HEAD: ${head}`);
  out.push(`  jsxAnc: ${jsxAncestors(file).join(' , ')||'(none)'}`);
  const gm=new Map();
  for(const r of rs){ const k=topOf(r.p); if(!gm.has(k))gm.set(k,[]); gm.get(k).push(r); }
  for(const [k,v] of [...gm.entries()].sort((a,b)=>b[1].length-a[1].length)){
    const lk={}; for(const r of v){ const L=leaf(r.p); lk[L]=(lk[L]||0)+1; }
    const id=k.replace(/\(\)$/,'');
    const ext=[...new Set((hits[id]||[]).filter(h=>!h.startsWith(file+':')).map(h=>h.split(':')[0]))];
    const nonTest=ext.filter(f=>!f.startsWith('tests/')&&!f.startsWith('docs/'));
    // same-file uses
    const same=[]; const re=new RegExp('\\b'+id.replace(/[$]/g,'\\$')+'\\b');
    for(let i=0;i<lines.length;i++){ const L=lines[i]; if(!re.test(L)) continue;
      if(/^\s*(\*|\/\/)/.test(L)) continue;
      if(new RegExp('(export\\s+)?(const|function|let|var|class)\\s+'+id+'\\b').test(L)) continue;
      same.push((i+1)+': '+L.trim().slice(0,120)); if(same.length>=4) break; }
    out.push(`  -- ${k} n=${v.length} leaf=${JSON.stringify(lk).slice(0,170)}`);
    out.push(`     path: ${v[0].p.slice(0,120)}`);
    for(const s of v.slice(0,3)) out.push(`     ex: ${JSON.stringify(s.text.slice(0,140))}`);
    out.push(`     ext: ${nonTest.slice(0,6).join(' , ')||'(none-nontest)'}`);
    out.push(`     self: ${same.join('  ||  ').slice(0,400)||'(none)'}`);
  }
}
fs.writeFileSync('worksheet3.txt', out.join('\n'));
console.log('lines', out.length);
