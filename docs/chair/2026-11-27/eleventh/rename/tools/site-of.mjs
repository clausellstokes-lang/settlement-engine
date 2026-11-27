// node site-of.mjs <jsonl> <regex on key> : the call sites of the picks whose key matches
import { readFileSync } from 'node:fs';
const B = readFileSync('/tmp/rename/work/bundle.mjs', 'utf8').split('\n'); const MM = JSON.parse(readFileSync('/tmp/rename/work/modmap.json', 'utf8'));
const mod = (l) => { let m = '?'; for (const [a, b] of MM) { if (a <= l) m = b; else break; } return m.replace(/^.*?src\//, 'src/'); };
const re = new RegExp(process.argv[3]); const seen = new Map();
for (const ln of readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).slice(0, 30)) { const j = JSON.parse(ln); if (j.error) continue;
  for (const p of j.picks) { const [k, fr, key] = p.split('\t'); if (!re.test(key)) continue; const s = fr.split(',').map((l) => `${mod(+l)}:${B[+l - 1].trim().slice(0, 90)}`).join(' <- '); seen.set(`${k} ${s}`, key); } }
for (const [s, k] of seen) console.log(k, '|', s);
