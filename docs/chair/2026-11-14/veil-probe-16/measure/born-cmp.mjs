// VEIL-16 (V8-3): two runs of REVIEW-VEIL-13's born probe (veil-probe-13/measure/r5-born.probe.jsx, R5_OUT), one on a chain of
// the base's migrations and one of the tree's: every row's fingerprint `h` (the whole read) compared, row for row.
//   node born-cmp.mjs <base.json> <tree.json>
import { readFileSync } from 'node:fs';
const [fa, fb] = process.argv.slice(2);
const a = JSON.parse(readFileSync(fa, 'utf8')); const b = JSON.parse(readFileSync(fb, 'utf8'));
const key = (r) => `${r.town} ${r.shape} ${r.share} ${r.read}`;
const mb = new Map(b.rows.map((r) => [key(r), r]));
let differ = 0; let missing = 0; const ex = [];
for (const r of a.rows) { const s = mb.get(key(r)); if (!s) { missing += 1; continue; } if (s.h !== r.h) { differ += 1; if (ex.length < 5) ex.push(key(r)); } }
const err = (x) => x.rows.filter((r) => r.error).length;
const twin = (x) => x.rows.filter((r) => r.read === 'gallery' && r.twinDiffers).length;
console.log(`towns ${a.towns} | ${b.towns}; rows ${a.rows.length} | ${b.rows.length}; rows whose fingerprint differs ${differ}; missing ${missing}${ex.length ? `; e.g. ${ex.join(', ')}` : ''}`);
console.log(`reads that raise: ${err(a)} | ${err(b)}; gallery reads where server and twin differ: ${twin(a)} | ${twin(b)}`);
