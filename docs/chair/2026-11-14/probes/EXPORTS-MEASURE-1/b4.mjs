// node b4.mjs <out>: towns whose journal Defense page prints a stored provenance key in brackets after a force row, by key
import fs from 'node:fs';
const out = process.argv[2]; const by = {}; const any = new Set();
for (const f of fs.readdirSync(out + '/dumps')) { const t = fs.readFileSync(`${out}/dumps/${f}`, 'utf8'); const i = t.indexOf('== Journal/Defense'); if (i < 0) continue; const j = t.indexOf('\n== ', i + 5); const sec = t.slice(i, j < 0 ? undefined : j);
  for (const m of sec.matchAll(/([a-z_]+(?:\.[a-z_]+)?)\)\s*$/gm)) { (by[m[1]] ||= new Set()).add(f); any.add(f); } }
console.log('towns', any.size, Object.entries(by).map(([k, v]) => `${k} ${v.size}`).join(' · '));
