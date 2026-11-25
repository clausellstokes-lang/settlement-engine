// BIRTH-1: node diff-keys.mjs <before.jsonl> <after.jsonl>: per moved birth, the fields whose hash moved; then the count per field.
import { readFileSync } from 'node:fs';
const rd = (f) => readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const [a, b] = process.argv.slice(2); const B = new Map(rd(b).map((r) => [r.seed, r])); const per = {};
for (const r of rd(a)) {
  const s = B.get(r.seed); if (!s || r.recordHash === s.recordHash) continue;
  const moved = [...new Set([...Object.keys(r.keys), ...Object.keys(s.keys)])].filter((k) => r.keys[k] !== s.keys[k]);
  for (const k of moved) per[k] = (per[k] || 0) + 1;
  console.log(`${r.seed}\t${moved.join(' ')}`);
}
console.log(Object.entries(per).map(([k, n]) => `${k} ${n}`).join(' | '));
