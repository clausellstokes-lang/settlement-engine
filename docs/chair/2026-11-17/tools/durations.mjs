#!/usr/bin/env node
// durations.mjs <checks-outdir> [floor-ms=2000]  (the sixth chair, 2026-11-19, for the last close's whole check)
//
// Reads every vitest JSON report a whole.sh run wrote in <checks-outdir> (vitest-<i>-of-<n>.json, vitest-dist.json) and
// writes two small files there for the chair, who cannot read the multi-megabyte reports themselves:
//   durations.tsv      every test that ran <floor-ms> ms or more: file <TAB> full name <TAB> ms <TAB> status, slowest first
//   durations.sum.txt  per report: tests, files, the sum of every test's ms (the chair scales a runner's time by it)
// Read-only over the reports; writes only those two files.
import fs from 'node:fs';
import path from 'node:path';

const [, , out, floorArg] = process.argv;
if (!out) { console.error('usage: durations.mjs <checks-outdir> [floor-ms=2000]'); process.exit(2); }
const FLOOR = Number(floorArg || 2000);
const reports = fs.readdirSync(out).filter((f) => /^vitest-.*\.json$/.test(f)).sort();
const rows = []; const sums = [];
for (const f of reports) {
  let rep;
  try { rep = JSON.parse(fs.readFileSync(path.join(out, f), 'utf8')); } catch (e) { sums.push(`${f}\tUNREADABLE\t${String(e).slice(0, 80)}`); continue; }
  let tests = 0; let ms = 0; const files = (rep.testResults || []).length;
  for (const file of rep.testResults || []) {
    const rel = String(file.name || '').replace(/^.*?\/(tests|src)\//, '$1/');
    for (const t of file.assertionResults || []) {
      const d = Number(t.duration) || 0; tests += 1; ms += d;
      if (d >= FLOOR) rows.push([rel, String(t.fullName || t.title || '').replace(/\s+/g, ' '), Math.round(d), t.status]);
    }
  }
  sums.push(`${f}\ttests ${tests}\tfiles ${files}\tsum_ms ${Math.round(ms)}`);
}
rows.sort((a, b) => b[2] - a[2]);
fs.writeFileSync(path.join(out, 'durations.tsv'), rows.map((r) => r.join('\t')).join('\n') + '\n');
fs.writeFileSync(path.join(out, 'durations.sum.txt'), sums.join('\n') + '\n');
console.log(`reports ${reports.length} · tests at or over ${FLOOR} ms: ${rows.length}`);
