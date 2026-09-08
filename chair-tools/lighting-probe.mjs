// lighting-probe.mjs <tree> — READ-ONLY derivation of the lighting census tuple.
// Extracts the walker's PURE REGION (everything above the first column-0 `describe(`), stubs
// vitest so no runner is needed, and calls measureCensus(). ⭐ Since 2026-09-05 it runs inside a
// FARM: a scratch root where `tests/` is a real COPY (the census walks it and Dirent-type checks
// do not follow symlinks) and every other top-level entry is a symlink into the tree. The tree
// itself receives ZERO writes — two lanes measured the old probe writing a temp file into a tree
// that was about to be gated. A probe IS a derivation (E4); a guess is not.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, symlinkSync, cpSync, rmSync, existsSync } from 'node:fs';
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
const SC = process.env.PROBE_FARM_ROOT || resolve(process.env.HOME || '/tmp', '.lighting-probe-farms');
const farm = join(SC, `farm.${process.pid}`);
let out;
try {
  mkdirSync(farm, { recursive: true });
  for (const e of readdirSync(tree)) {
    if (e === '.git') continue;
    if (e === 'tests') cpSync(join(tree, 'tests'), join(farm, 'tests'), { recursive: true, dereference: false });
    else symlinkSync(join(tree, e), join(farm, e));
  }
  const tmp = join(farm, 'tests', 'lint', `.lighting-probe.${process.pid}.mjs`);
  writeFileSync(tmp, `${pure}\nconsole.log(JSON.stringify(measureCensus().figures));\n`, 'utf8');
  out = execFileSync(process.execPath, [tmp], { cwd: farm, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (e) { console.error('probe failed:', e.stderr || e.message); process.exit(1); }
finally { try { rmSync(farm, { recursive: true, force: true }); } catch { /* gone */ } }
if (existsSync(farm)) { console.error('farm not removed: ' + farm); process.exit(1); }
const f = JSON.parse(out.trim().split('\n').pop());
if (f.parked + f.credited !== f.files) {
  console.error(`INCOHERENT: ${f.parked} + ${f.credited} !== ${f.files}`); process.exit(1);
}
console.log(JSON.stringify(f));
