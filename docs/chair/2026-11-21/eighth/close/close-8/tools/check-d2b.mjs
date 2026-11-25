#!/usr/bin/env node
// BIRTH-1 D2b: the check over EVERY birth (rows from measure-d2b.mjs) and the before-and-after. node check-d2b.mjs <before> <after> [label]
// Exit 1 if AFTER holds a pressure line that shares a sentence with its prominent line.
import { readFileSync } from 'node:fs';
const SZ = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const [a, b, label = ''] = process.argv.slice(2);
const rd = (f) => readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const A = rd(a), B = new Map(rd(b).map((r) => [r.seed, r]));
const by = (rows, f) => SZ.map((s) => rows.filter((r) => r.size === s && f(r)).length);
const x = by(A, (r) => r.shared), y = by([...B.values()], (r) => r.shared);
console.log(`${label} shares a sentence: before ${x.join('/')} = ${x.reduce((p, q) => p + q, 0)}  after ${y.join('/')} = ${y.reduce((p, q) => p + q, 0)}`);
const kinds = {}; let moved = 0;
for (const r of A) {
  const s = B.get(r.seed); if (r.recordHash === s.recordHash) continue; moved++;
  const k = [r.ps !== s.ps ? (s.psNull ? 'pressure gone' : 'pressure changed') : null, r.rest !== s.rest ? 'OTHER FIELDS' : null].filter(Boolean).join(' + ') || 'OTHER';
  (kinds[k] ||= []).push(r.seed);
}
console.log(`${label} records moved ${moved} of ${A.length}`);
for (const [k, v] of Object.entries(kinds)) console.log(`${label}   ${k}: ${v.length} (${v.slice(0, 5).join(' ')})`);
process.exit([...B.values()].some((r) => r.shared) ? 1 : 0);
