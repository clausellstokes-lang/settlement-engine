import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
const ROOT = process.argv[2]; const START = process.argv[3]; const TARGET = process.argv[4];
const prev = new Map(); const seen = new Set(); const q = [resolve(ROOT,START)];
while(q.length){
  const f = q.shift(); if(seen.has(f)||!existsSync(f)) continue; seen.add(f);
  let src; try{ src = readFileSync(f,'utf8'); }catch{ continue; }
  const re = /(?:^|[\s;{(=])(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]/g; let m;
  while((m=re.exec(src))){ const s=m[1]; if(!s||!s.startsWith('.')) continue;
    let t=resolve(dirname(f),s); if(!existsSync(t)&&existsSync(t+'.js')) t=t+'.js'; if(!existsSync(t)) continue;
    if(!prev.has(t)) prev.set(t,f); q.push(t); } }
let cur = resolve(ROOT,TARGET); const path=[];
while(cur){ path.unshift(relative(ROOT,cur)); cur = prev.get(cur); }
console.log(path.join('\n  -> '));
