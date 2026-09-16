import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const ROOT = process.argv[2];
const START = process.argv.slice(3);
const seen = new Set();
const q = START.map(s => resolve(ROOT, s));
const IMP = /(?:^|\s)(?:import|export)[\s\S]*?from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;
while (q.length) {
  const f = q.shift();
  if (seen.has(f) || !existsSync(f)) continue;
  seen.add(f);
  const src = readFileSync(f, 'utf8');
  let m;
  IMP.lastIndex = 0;
  while ((m = IMP.exec(src))) {
    const spec = m[1] || m[2];
    if (!spec || !spec.startsWith('.')) continue;
    let p = resolve(dirname(f), spec);
    if (!existsSync(p)) { for (const ext of ['.js', '.jsx', '/index.js']) { if (existsSync(p + ext)) { p = p + ext; break; } } }
    if (existsSync(p)) q.push(p);
  }
}
const rel = [...seen].map(p => p.slice(ROOT.length + 1)).sort();
console.log('TOTAL', rel.length);
console.log(rel.filter(p => /spatial\/|worldPulse\//.test(p)).join('\n') || '(no spatial/worldPulse modules)');
