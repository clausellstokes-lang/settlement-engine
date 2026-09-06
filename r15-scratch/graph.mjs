import fs from 'node:fs'; import path from 'node:path';
const T = process.env.T;
const exts=['.js','.jsx','.mjs','.ts','.tsx'];
const files=[];
function walk(d){ let e; try{e=fs.readdirSync(d,{withFileTypes:true});}catch{return;} for(const x of e){ if(x.name==='node_modules'||x.name==='.git')continue; const p=path.join(d,x.name); if(x.isDirectory())walk(p); else if(exts.includes(path.extname(x.name)))files.push(p);} }
walk(path.join(T,'src'));
const rel=f=>path.relative(T,f);
const set=new Set(files.map(rel));
function resolve(fromRel, spec){
  if(!spec.startsWith('.')) return null;
  const base=path.posix.join(path.posix.dirname(fromRel), spec);
  const cands=[base, base+'.js', base+'.jsx', base+'.mjs', base+'.ts', base+'.tsx', base+'/index.js', base+'/index.jsx'];
  for(const c of cands) if(set.has(c)) return c;
  // strip .js and retry (ts)
  if(base.endsWith('.js')){ const b=base.slice(0,-3); for(const c of [b+'.ts',b+'.tsx',b+'.jsx']) if(set.has(c)) return c; }
  return null;
}
const imports=new Map(); // file -> Set of imported files
const importedBy=new Map();
const impRe=/(?:^|\n)\s*(?:import[\s\S]*?from|export[\s\S]*?from)\s*['"]([^'"]+)['"]/g;
const dynRe=/import\(\s*['"]([^'"]+)['"]\s*\)/g;
const reqRe=/require\(\s*['"]([^'"]+)['"]\s*\)/g;
for(const f of files){
  const r=rel(f); const src=fs.readFileSync(f,'utf8');
  const s=new Set();
  for(const re of [impRe,dynRe,reqRe]){ re.lastIndex=0; let m; while((m=re.exec(src))){ const t=resolve(r,m[1]); if(t) s.add(t); } }
  imports.set(r,s);
  for(const t of s){ if(!importedBy.has(t)) importedBy.set(t,new Set()); importedBy.get(t).add(r); }
}
// UI roots: any .jsx under src/, plus src/pdf/**
const uiRoots=[...set].filter(r=>r.endsWith('.jsx')||r.startsWith('src/pdf/'));
// reachable-from-UI = files transitively imported by a UI root
const reach=new Set(); const stack=[...uiRoots];
for(const r of uiRoots) reach.add(r);
while(stack.length){ const cur=stack.pop(); for(const t of (imports.get(cur)||[])){ if(!reach.has(t)){reach.add(t);stack.push(t);} } }
// AI roots
const aiRoots=[...set].filter(r=>/^src\/domain\/ai\//.test(r)||/ai(Charter|Grounding|OutputSchema|OverlayVerifier)/.test(r)||/prompt/i.test(r));
const aiReach=new Set(); const st2=[...aiRoots]; for(const r of aiRoots) aiReach.add(r);
while(st2.length){ const cur=st2.pop(); for(const t of (imports.get(cur)||[])){ if(!aiReach.has(t)){aiReach.add(t);st2.push(t);} } }
fs.writeFileSync('graph.json', JSON.stringify({
  files:[...set], uiRoots, reachFromUI:[...reach], aiRoots, aiReach:[...aiReach],
  importedBy:Object.fromEntries([...importedBy].map(([k,v])=>[k,[...v]])),
  imports:Object.fromEntries([...imports].map(([k,v])=>[k,[...v]]))
}));
console.log('src files', set.size, 'uiRoots', uiRoots.length, 'reachFromUI', reach.size, 'aiRoots', aiRoots.length, 'aiReach', aiReach.size);
// R15 files
const groups=JSON.parse(fs.readFileSync('r15-groups.json','utf8'));
const r15files=[...new Set(groups.map(g=>g.file))];
const notReach=r15files.filter(f=>!reach.has(f));
console.log('R15 files', r15files.length, 'NOT reachable from UI:', notReach.length);
console.log(notReach.join('\n'));
