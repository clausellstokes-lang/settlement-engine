import fs from 'node:fs';
import path from 'node:path';
const dir = '../laneB6/src/domain/display/stateProse';
const rows = [];
for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(dir,f),'utf8');
  const lines = src.split('\n');
  lines.forEach((ln,i)=>{
    const m = ln.match(/^export function ([A-Za-z0-9_]*PoolKey)\(([^)]*)\)/);
    if (!m) return;
    const args = m[2].trim() ? m[2].split(',').map(s=>s.trim()) : [];
    rows.push({file:f, line:i+1, fn:m[1], n:args.length, args});
  });
}
rows.sort((a,b)=> b.n-a.n || a.file.localeCompare(b.file) || a.line-b.line);
const hist={};
for (const r of rows) hist[r.n]=(hist[r.n]||0)+1;
console.log('TOTAL *PoolKey exported functions:', rows.length);
console.log('arity histogram:', JSON.stringify(hist));
console.log('--- arity >= 2 ---');
for (const r of rows.filter(r=>r.n>=2)) console.log(`${r.n}  ${r.file}:${r.line}  ${r.fn}(${r.args.join(', ')})`);
