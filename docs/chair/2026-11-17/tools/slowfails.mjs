#!/usr/bin/env node
// slowfails.mjs — the test FILES of a whole check that hold a failed test which ran 19 s or more (the suite's
// per-test limit is 20 s: such a red is a timeout under load until it is seen red alone), one file a line.
// usage: node slowfails.mjs <vitest json>...
import fs from 'node:fs';
const out = new Set();
for (const p of process.argv.slice(2)) {
  for (const f of JSON.parse(fs.readFileSync(p, 'utf8')).testResults || []) {
    if ((f.assertionResults || []).some((t) => t.status === 'failed' && Number(t.duration || 0) >= 19000)) out.add(f.name.replace(/^.*?(tests\/)/, '$1'));
  }
}
process.stdout.write([...out].sort().join('\n') + (out.size ? '\n' : ''));
