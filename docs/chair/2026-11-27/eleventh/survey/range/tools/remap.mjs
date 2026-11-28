// RANGE-MEASURE: re-point the hand sample's keys at the current keys2.json (by path, else by the first line's text)
// node remap.mjs <keys2.json> <sample150.json> <sample150.txt> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
const [K, S, T, OUT] = process.argv.slice(2);
const { keys } = JSON.parse(readFileSync(K, 'utf8')); const s = JSON.parse(readFileSync(S, 'utf8'));
const first = []; let cur = -1;
for (const l of readFileSync(T, 'utf8').split('\n')) { if (l.startsWith('#')) { cur++; continue; } const m = l.match(/^ {3}0. (.*?)(  \{.*)?$/); if (m && first[cur] == null) first[cur] = m[1]; }
const byPath = new Map(); keys.forEach((k, i) => { if (!byPath.has(k.key)) byPath.set(k.key, i); });
const norm = (t) => t.replace(/\u0001|\{[^}]*\}/g, '').replace(/\s+/g, ' ').trim();
const out = s.map((x, i) => {
  let ki = byPath.get(x.key);
  if (ki == null) { const t = norm(first[i]).slice(0, 50); ki = keys.findIndex((k) => k.lines.some((l) => norm(l.text).startsWith(t))); }
  return { ki, key: keys[ki]?.key, was: x.key };
});
writeFileSync(OUT, JSON.stringify(out));
console.log(`unmapped ${out.filter((o) => o.ki < 0).length}; moved ${out.filter((o) => o.was !== o.key).length}`);
