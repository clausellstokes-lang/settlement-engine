#!/usr/bin/env node
// failnames.mjs — the failing tests of one or more vitest JSON reports, BY NAME (the sixth chair, 2026-11-17).
// stdout: one line per failing test `<file> :: <full name>`, and one per file that failed outside a test
// (`<file> :: [FILE] <message's first line>`), sorted and unique. stderr: the counts.
import fs from 'node:fs';
import path from 'node:path';
const out = new Set(); let files = 0, tests = 0, failedFiles = 0, failedTests = 0, skipped = 0;
for (const p of process.argv.slice(2)) {
  const report = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root = process.cwd();
  for (const f of report.testResults || []) {
    files++;
    const rel = path.relative(root, f.name).split(path.sep).join('/').replace(/^.*?(tests\/)/, '$1');
    let any = false;
    for (const t of f.assertionResults || []) {
      tests++;
      if (t.status === 'failed') { failedTests++; any = true; out.add(`${rel} :: ${t.fullName || t.title}`); }
      else if (t.status !== 'passed') skipped++;
    }
    if (f.status === 'failed') { failedFiles++; if (!any) out.add(`${rel} :: [FILE] ${String(f.message || '').split('\n')[0].slice(0, 200)}`); }
  }
}
process.stdout.write([...out].sort().join('\n') + (out.size ? '\n' : ''));
process.stderr.write(`files ${files} · tests ${tests} · failed files ${failedFiles} · failed tests ${failedTests} · not run ${skipped} · names ${out.size}\n`);
