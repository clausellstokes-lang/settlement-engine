#!/usr/bin/env node
// BIRTH-1 D2: the check over EVERY birth of a corpus, and the before-and-after. node check-d2.mjs <before.jsonl> <after.jsonl> [label]
// Rows come from births.mjs with measure-d2.mjs. Prints the fault counts by size on each side, and the births moved by
// record hash with their kinds (prominent tie changed / gone / pressure sentence changed / neither). Exit 1 if AFTER holds a fault.
import { readFileSync } from 'node:fs';
const SZ = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const [a, b, label = ''] = process.argv.slice(2);
const read = (f) => readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const A = read(a), B = new Map(read(b).map((r) => [r.seed, r]));
const faults = { 'prominent is a covert tie': (r) => r.prCovert, 'prominent joins a covert pair': (r) => r.prPair, 'pressure names a covert tie\'s two ends': (r) => r.psBoth > 0 };
for (const [name, f] of Object.entries(faults)) {
  const by = (rows) => SZ.map((s) => rows.filter((r) => r.size === s && f(r)).length);
  const x = by(A), y = by([...B.values()]);
  console.log(`${label} ${name.padEnd(40)} before ${x.join('/')} = ${x.reduce((p, q) => p + q, 0)}   after ${y.join('/')} = ${y.reduce((p, q) => p + q, 0)}`);
}
const kinds = {}; const moved = [];
for (const r of A) {
  const s = B.get(r.seed); if (!s) { console.log(`${r.seed} MISSING AFTER`); continue; }
  if (r.recordHash === s.recordHash) continue;
  const k = [];
  if (r.prHash !== s.prHash) k.push(s.prHash === null ? 'prominent gone' : r.prHash === null ? 'prominent new' : 'prominent changed');
  if (r.psHash !== s.psHash) k.push('pressure changed');
  if (r.restHash !== s.restHash) k.push('OTHER FIELDS');
  if (!k.length) k.push('OTHER');
  const key = k.join(' + '); (kinds[key] ||= []).push(r.seed); moved.push(r.seed);
}
console.log(`${label} records moved ${moved.length} of ${A.length}`);
for (const [k, v] of Object.entries(kinds)) console.log(`${label}   ${k}: ${v.length}  (${v.slice(0, 6).join(' ')})`);
const bad = [...B.values()].filter((r) => Object.values(faults).some((f) => f(r)));
process.exit(bad.length ? 1 : 0);
