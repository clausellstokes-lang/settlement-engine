// F4 measure: does each banked row (file, thing, first 120) map to exactly ONE whole literal at this tree?
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = process.cwd();
const sh = await import(join(ROOT, 'tests/lint/presumedThings.shared.mjs'));
const old = (f, t, x) => `${f}\t${t}\t${String(x).slice(0, 120)}`;
const hits = sh.scanTree(ROOT);
const byOld = new Map();
for (const h of hits) { const k = old(h.file, h.thing, h.text); (byOld.get(k) || byOld.set(k, new Set()).get(k)).add(h.text); }
let rows = 0, one = 0, many = 0, none = 0; const manyList = [];
for (const rel of ['tests/lint/presumedThings.register.json', 'tests/lint/presumedThings.widened.register.json']) {
  const r = JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
  for (const [f, rs] of Object.entries(r.arm1)) for (const row of rs) {
    rows += 1; const s = byOld.get(old(f, row[0], row[2]));
    if (!s) none += 1; else if (s.size === 1) one += 1; else { many += 1; manyList.push(`${f}\t${row[0]}\t${s.size}\t${row[2].slice(0, 60)}`); }
  }
}
console.log(JSON.stringify({ hits: hits.length, rows, one, many, none, maxHitLen: Math.max(...hits.map((h) => h.text.length)) }));
for (const l of manyList) console.log('MANY\t' + l);
