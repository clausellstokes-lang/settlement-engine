// BIRTH-1: node leafcheck.mjs <before.jsonl> <after.jsonl> <from> <to>  (rows from measure-whole.mjs): per birth, every leaf that
// differs must be equal once <from> is read as <to> on BOTH sides (and its sentence-start form). Prints the leaves that are not.
import { readFileSync } from 'node:fs';
const [a, b, from, to] = process.argv.slice(2);
const rd = (f) => readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const norm = (v) => (typeof v === 'string' ? v.split(from).join(to).split(cap(from)).join(cap(to)) : v);
const B = new Map(rd(b).map((r) => [r.seed, r]));
let births = 0, moved = 0, bad = 0, leaves = 0;
const walk = (x, y, p, out) => {
  if (JSON.stringify(x) === JSON.stringify(y)) return;
  if (x && y && typeof x === 'object' && typeof y === 'object') { for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) walk(x[k], y[k], `${p}.${k}`, out); return; }
  leaves++; if (norm(x) !== norm(y)) out.push(`${p}: ${JSON.stringify(x)} -> ${JSON.stringify(y)}`);
};
for (const r of rd(a)) {
  births++; const s = B.get(r.seed); const out = [];
  if (JSON.stringify(r.town) === JSON.stringify(s.town)) continue;
  moved++; walk(r.town, s.town, '', out);
  if (out.length) { bad++; console.log(`${r.seed}\n  ${out.slice(0, 6).join('\n  ')}`); }
}
console.log(`leafcheck: ${births} births, ${moved} moved, ${leaves} leaves differ, ${bad} births with a leaf that differs beyond "${from}" -> "${to}"`);
process.exit(bad ? 1 : 0);
