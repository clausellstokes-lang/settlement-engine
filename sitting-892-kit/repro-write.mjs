// repro-write.mjs — reproduce `check-writer-reach.mjs --write` at the dock tip WITHOUT touching
// the dock: readBaseline = the COMMITTED blob, writeBaseline = a scratch path.
// node repro-write.mjs <dockRoot> <committedBaselineJsonPath> <outPath>
import { join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

const root = process.argv[2];
const committedPath = process.argv[3];
const out = process.argv[4];
const { run } = await import(join(root, 'scripts/check-writer-reach.mjs'));
const committed = JSON.parse(readFileSync(committedPath, 'utf8'));
const lines = [];
const t0 = Date.now();
const result = await run(['--write'], {
  root,
  log: (l) => { lines.push(l); console.log(l); },
  baselineExists: () => true,
  readBaseline: () => committed,
  writeBaseline: (value) => { writeFileSync(out, `${JSON.stringify(value, null, 1)}\n`, 'utf8'); return out; },
});
console.log(JSON.stringify({ ok: result.ok, action: result.action, ms: Date.now() - t0,
  cohortBefore: committed.darkUnregistered.length, cohortAfter: result.baseline.darkUnregistered.length,
  stale: result.comparison.stale.length, struck: result.comparison.struck.length, violations: result.comparison.violations.length,
  frozenAtSha: result.baseline.frozenAtSha }));
