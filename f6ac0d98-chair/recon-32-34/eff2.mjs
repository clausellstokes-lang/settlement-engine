import fs from 'fs';
const files = process.argv.slice(2);
for (const f of files) {
  if (!fs.existsSync(f)) { console.log(f.padEnd(58), 'ABSENT'); continue; }
  const src = fs.readFileSync(f,'utf8');
  const s = src.replace(/\/\*[\s\S]*?\*\//g, m => m.split('\n').map(()=> 'ZZCOMMENTZZ').join('\n'));
  let n = 0;
  for (const l of s.split('\n')) {
    const t = l.trim();
    if (!t) continue;
    if (t === 'ZZCOMMENTZZ') continue;
    if (t.startsWith('//')) continue;
    n++;
  }
  console.log(f.padEnd(58), String(n).padStart(5), 'eff / raw', src.split('\n').length);
}
