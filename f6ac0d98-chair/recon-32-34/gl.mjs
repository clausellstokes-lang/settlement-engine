import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
const ROOT = process.argv[2];
const seen = new Set(); const q = [resolve(ROOT, process.argv[3])];
while(q.length){ const f=q.shift(); if(seen.has(f)||!existsSync(f)) continue; seen.add(f);
 let src; try{src=readFileSync(f,'utf8')}catch{continue}
 const re=/(?:^|[\s;{(=])(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g; let m;
 while((m=re.exec(src))){const s=m[1]||m[2]; if(!s||!s.startsWith('.'))continue; let t=resolve(dirname(f),s);
  if(!existsSync(t)&&existsSync(t+'.js'))t=t+'.js'; if(!existsSync(t)&&existsSync(t+'.jsx'))t=t+'.jsx'; if(!existsSync(t))continue; q.push(t);} }
console.log([...seen].map(f=>relative(ROOT,f)).sort().join('\n'));
