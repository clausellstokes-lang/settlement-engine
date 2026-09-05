// lighting-probe.mjs <tree> — READ-ONLY derivation of the lighting census tuple.
// Extracts the walker's PURE REGION (everything above the first column-0 `describe(`),
// stubs vitest so no runner is needed, and calls measureCensus(). Writes nothing.
// A probe IS a derivation (E4); a guess is not.
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
const REL = 'tests/lint/sovereigntyLightingContract.walker.test.js';
const tree = resolve(process.argv[2] || (() => { console.error('usage: <tree>'); process.exit(2); })());
const src = readFileSync(join(tree, REL), 'utf8');
const cut = src.search(/^describe\(/m);
if (cut < 0) { console.error('no top-level describe( — walker changed shape'); process.exit(2); }
const pure = src.slice(0, cut).replace(
  /^import \{[^}]*\} from 'vitest';$/m,
  "const describe = () => {}; const test = () => {}; const it = () => {};\n"
  + "const expect = () => { throw new Error('probe: expect() called in the pure region'); };\n"
  + 'expect.soft = expect; expect.extend = () => {};',
);
const tmp = join(tree, 'tests', 'lint', `.lighting-probe.${process.pid}.mjs`);
let out;
try {
  writeFileSync(tmp, `${pure}\nconsole.log(JSON.stringify(measureCensus().figures));\n`, 'utf8');
  out = execFileSync(process.execPath, [tmp], { cwd: tree, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (e) { console.error('probe failed:', e.stderr || e.message); process.exit(1); }
finally { try { unlinkSync(tmp); } catch { /* gone */ } }
const f = JSON.parse(out.trim().split('\n').pop());
if (f.parked + f.credited !== f.files) {
  console.error(`INCOHERENT: ${f.parked} + ${f.credited} !== ${f.files}`); process.exit(1);
}
console.log(JSON.stringify(f));
