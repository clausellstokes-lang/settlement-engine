import {readFileSync} from 'node:fs';
for(const f of process.argv.slice(2)){
  const src=readFileSync(f,'utf8');
  // strip block comments
  let s=src.replace(/\/\*[\s\S]*?\*\//g, m=>m.replace(/[^\n]/g,''));
  const lines=s.split('\n');
  let eff=0;
  for(const l of lines){ const t=l.trim(); if(!t) continue; if(t.startsWith('//')) continue; eff++; }
  console.log(`${f}  raw=${lines.length}  eff~=${eff}`);
}
