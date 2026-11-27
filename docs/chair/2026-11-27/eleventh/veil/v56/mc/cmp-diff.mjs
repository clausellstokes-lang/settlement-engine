// MC (VEIL-56): compare two diff.mjs outputs, read for read.   node cmp-diff.mjs <base json> <trial json>
import { readFileSync } from 'node:fs';
const [A, B] = process.argv.slice(2).map((p) => JSON.parse(readFileSync(p, 'utf8')));
const key = (r) => `${r.seed}|${r.mk}|${r.dm}|${r.door}`;
const bm = new Map(B.rows.map((r) => [key(r), r]));
let same = 0; const differ = []; const missing = [];
for (const r of A.rows) { const s = bm.get(key(r)); if (!s) { missing.push(key(r)); continue; } if (s.md5 === r.md5 && s.len === r.len) same += 1; else differ.push({ k: key(r), a: r.len, b: s.len }); }
const byDoor = {}; for (const d of differ) { const door = d.k.split('|')[3]; byDoor[door] = (byDoor[door] || 0) + 1; }
console.log(JSON.stringify({ base: A.db, trial: B.db, reads: A.rows.length, same, differing: differ.length, missing: missing.length, byDoor, first: differ.slice(0, 5), baseNull: A.rows.filter((r) => r.md5 == null).length, trialNull: B.rows.filter((r) => r.md5 == null).length }));
process.exit(differ.length || missing.length || A.rows.length !== B.rows.length ? 1 : 0);
