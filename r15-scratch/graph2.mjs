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
  if(base.endsWith('.js')){ const b=base.slice(0,-3); for(const c of [b+'.ts',b+'.tsx',b+'.jsx']) if(set.has(c)) return c; }
  return null;
}
const imports=new Map(); const importedBy=new Map();
const res=[
 /(?:^|\n)\s*(?:import[\s\S]*?from|export[\s\S]*?from)\s*['"]([^'"]+)['"]/g,
 /import\(\s*['"]([^'"]+)['"]\s*\)/g,
 /require\(\s*['"]([^'"]+)['"]\s*\)/g,
 /new\s+URL\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url/g,
 /(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g,
];
for(const f of files){
  const r=rel(f); const src=fs.readFileSync(f,'utf8'); const s=new Set();
  for(const re of res){ re.lastIndex=0; let m; while((m=re.exec(src))){ const t=resolve(r,m[1]); if(t) s.add(t); } }
  imports.set(r,s);
  for(const t of s){ if(!importedBy.has(t)) importedBy.set(t,new Set()); importedBy.get(t).add(r); }
}
const uiRoots=[...set].filter(r=>r.endsWith('.jsx')||r.startsWith('src/pdf/')||r.startsWith('src/workers/')||r.startsWith('src/foundry/'));
const reach=new Set(uiRoots); const stack=[...uiRoots];
while(stack.length){ const cur=stack.pop(); for(const t of (imports.get(cur)||[])){ if(!reach.has(t)){reach.add(t);stack.push(t);} } }
// pure-JSX reach (rendered surfaces only, no workers/foundry)
const jsxRoots=[...set].filter(r=>r.endsWith('.jsx')||r.startsWith('src/pdf/'));
const jreach=new Set(jsxRoots); const st3=[...jsxRoots];
while(st3.length){ const cur=st3.pop(); for(const t of (imports.get(cur)||[])){ if(!jreach.has(t)){jreach.add(t);st3.push(t);} } }
const aiRoots=[...set].filter(r=>/^src\/domain\/ai\//.test(r)||/ai(Charter|Grounding|OutputSchema|OverlayVerifier)\.js$/.test(r));
const aiReach=new Set(aiRoots); const st2=[...aiRoots];
while(st2.length){ const cur=st2.pop(); for(const t of (imports.get(cur)||[])){ if(!aiReach.has(t)){aiReach.add(t);st2.push(t);} } }
fs.writeFileSync('graph.json', JSON.stringify({uiRoots,reachFromUI:[...reach],jreach:[...jreach],aiRoots,aiReach:[...aiReach],
  importedBy:Object.fromEntries([...importedBy].map(([k,v])=>[k,[...v]])), imports:Object.fromEntries([...imports].map(([k,v])=>[k,[...v]]))}));
console.log('src',set.size,'uiRoots',uiRoots.length,'reach',reach.size,'jsxReach',jreach.size,'aiReach',aiReach.size);
const groups=JSON.parse(fs.readFileSync('r15-groups.json','utf8'));
const r15files=[...new Set(groups.map(g=>g.file))];
const rowsByFile={}; for(const g of groups) rowsByFile[g.file]=(rowsByFile[g.file]||0)+g.n;
const notReach=r15files.filter(f=>!reach.has(f));
console.log('R15 files',r15files.length,'NOT product-reachable:',notReach.length, 'rows in them:', notReach.reduce((a,f)=>a+rowsByFile[f],0));
for(const f of notReach) console.log('  ', rowsByFile[f], f, '<= importedBy:', (JSON.parse(fs.readFileSync('/dev/null','utf8').length?'{}':'{}')));
