import fs from 'node:fs'; import path from 'node:path';
const T = process.env.T;
const groups = JSON.parse(fs.readFileSync('r15-groups.json','utf8'));
const idents = new Set();
const byIdent = new Map();
for (const g of groups){ const id = g.exp.replace(/\(\)$/,''); if(!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(id)) continue; idents.add(id); if(!byIdent.has(id)) byIdent.set(id,[]); byIdent.get(id).push(g.key); }
console.log('identifiers', idents.size);
const roots = ['src','tests','api','scripts','docs'];
const exts = new Set(['.js','.jsx','.mjs','.cjs','.ts','.tsx','.json','.md']);
const files=[];
function walk(d){ let ents; try{ents=fs.readdirSync(d,{withFileTypes:true});}catch{return;} for(const e of ents){ if(e.name==='node_modules'||e.name==='.git') continue; const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(exts.has(path.extname(e.name))) files.push(p); } }
for(const r of roots) walk(path.join(T,r));
console.log('files scanned', files.length);
const hits = new Map(); for(const id of idents) hits.set(id, []);
const re = /[A-Za-z_$][A-Za-z0-9_$]*/g;
for(const f of files){
  let src; try{src=fs.readFileSync(f,'utf8');}catch{continue;}
  const rel = path.relative(T,f);
  const lines = src.split('\n');
  for(let i=0;i<lines.length;i++){
    const L=lines[i]; re.lastIndex=0; let m; let seen=null;
    while((m=re.exec(L))){ if(idents.has(m[0])){ if(!seen) seen=new Set(); if(seen.has(m[0])) continue; seen.add(m[0]); hits.get(m[0]).push(rel+':'+(i+1)+'|'+L.trim().slice(0,180)); } }
  }
}
const out={};
for(const [id,arr] of hits) out[id]=arr;
fs.writeFileSync('ident-hits.json', JSON.stringify(out));
// summary
let none=0; for(const [id,arr] of hits){ if(arr.length===0) none++; }
console.log('identifiers with zero hits (incl. own defn?):', none);
