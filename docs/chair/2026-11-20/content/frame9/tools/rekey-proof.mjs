#!/usr/bin/env node
/**
 * frame9/tools/rekey-proof.mjs — FRAME-9 · unit 1: the proof the chair asked for (2026-11-22 08:54 UTC) of the six rows
 * re-keyed by hand in a019eae28 and ea7d49a8a. For each register, read at <before> and <after> by git: every row as
 * (file key, row JSON); print each row whose key changed, before and after; and count every other row that is in one
 * revision and not the other (must be 0). Usage: node <this> <before> <after>
 */
import { execFileSync } from 'node:child_process';
const [A, B] = process.argv.slice(2);
const REGS = [['tests/lint/presumptionClasses.register.json', 'rows'], ['tests/lint/presumedThings.widened.register.json', 'arm1']];
const at = (rev, path) => JSON.parse(execFileSync('git', ['show', `${rev}:${path}`], { encoding: 'utf8', maxBuffer: 1 << 28 }));
let bad = 0;
for (const [path, key] of REGS) {
  const rows = (rev) => { const r = at(rev, path)[key]; return Object.entries(r).flatMap(([f, rs]) => rs.map((x) => [f, JSON.stringify(x)])); };
  const a = rows(A), b = rows(B);
  const byRow = (list) => { const m = new Map(); for (const [f, x] of list) m.set(x, [...(m.get(x) || []), f]); return m; };
  const ma = byRow(a), mb = byRow(b);
  const moved = [], other = [];
  for (const [x, fa] of ma) { const fb = mb.get(x) || []; if (JSON.stringify(fa.sort()) !== JSON.stringify(fb.sort())) { if (fa.length === fb.length) moved.push([x, fa, fb]); else other.push(x); } }
  for (const x of mb.keys()) if (!ma.has(x)) other.push(x);
  const headA = { ...at(A, path) }, headB = { ...at(B, path) }; delete headA[key]; delete headB[key];
  const headSame = JSON.stringify(headA) === JSON.stringify(headB);
  console.log(`${path}: rows ${a.length} at ${A}, ${b.length} at ${B}; re-keyed ${moved.length}; any other row differing ${other.length}; header (every field but ${key}) identical: ${headSame}`);
  for (const [x, fa, fb] of moved) console.log(`  BEFORE ${fa.join(',')} ${x}\n  AFTER  ${fb.join(',')} ${x}`);
  if (other.length || !headSame) bad++;
}
process.exit(bad ? 1 : 0);
