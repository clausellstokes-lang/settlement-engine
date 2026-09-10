#!/usr/bin/env node
/**
 * census-probe.mjs — OUTPUT (d): THE LIGHTING-CENSUS TUPLE, derived read-only.
 *
 * usage: node census-probe.mjs --tree <TREE> --out <FILE.json> [--dry]
 *
 * ⚠ THIS IS A SECOND HOME OF THE CHAIR'S OWN `$SC/chair-tools/lighting-probe.mjs` IDIOM,
 * AND THAT IS DELIBERATE, NAMED, AND HAS A COST. The battery must survive the loss of the
 * chair's scratch directory — a sibling scratchpad was deleted with eight live docks inside
 * — so the kit carries its own copy rather than reaching into a sibling's tools. It does
 * NOT probe for the chair's file and silently prefer it: a silently substituted instrument
 * is how a stale copy gets reported as a fresh measurement. One home, always this one.
 *
 * THE METHOD (the chair's, term for term). Extract the walker's PURE REGION — everything
 * above the first column-0 `describe(` — stub `vitest` so no runner is needed, and call
 * `measureCensus()`. It runs inside a FARM: a scratch root where `tests/` is a real COPY
 * (the census walks it, and Dirent-type checks do not follow symlinks) and every other
 * top-level entry is a symlink into the tree. THE TREE RECEIVES ZERO WRITES.
 *
 * ⛔ THE COHERENCE GUARD IS NOT DECORATION. `parked + credited !== files` is INCOHERENCE,
 * not drift (the walker's own law at `:733`), so this refuses rather than reporting a tuple
 * that cannot be true.
 *
 * ⛔ IT TAKES NO REGISTER ACT. `LIGHTING_CENSUS_REFREEZE` is never set here, and the whole
 * point of a probe is that it reads. The refreeze is the CHAIR's, at the landing, and it
 * exits non-zero by design — a green only comes from a plain re-run afterwards.
 */
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i !== -1 && argv[i + 1] != null && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);

const TREE = flag('tree');
const OUT = flag('out');
const DRY = has('dry');
const REL = 'tests/lint/sovereigntyLightingContract.walker.test.js';
const BASELINE_REL = 'tests/lint/.lighting-census-baseline.json';

if (!TREE || !OUT) {
  console.error('usage: node census-probe.mjs --tree <TREE> --out <FILE.json> [--dry]');
  process.exit(2);
}
const tree = resolve(TREE);
const out = resolve(OUT);

if (DRY) {
  console.log(JSON.stringify({
    dry: true,
    tree,
    out,
    reads: [join(tree, REL), join(tree, BASELINE_REL)],
    method: 'pure-region extraction + vitest stub, executed inside a farm (tests/ copied, everything else symlinked)',
    refusesWhen: ['no column-0 describe( in the walker', 'parked + credited !== files', 'the farm cannot be removed'],
    neverSets: ['LIGHTING_CENSUS_REFREEZE', 'LIGHTING_CENSUS_NOTE'],
    writes: [out],
  }, null, 2));
  process.exit(0);
}

const sha256 = (v) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');

const walkerPath = join(tree, REL);
if (!existsSync(walkerPath)) {
  console.error(`census-probe: ${REL} is absent from ${tree}. REFUSING.`);
  process.exit(2);
}
const src = readFileSync(walkerPath, 'utf8');
const cut = src.search(/^describe\(/m);
if (cut < 0) {
  console.error('census-probe: the walker has no column-0 `describe(` — its shape has changed. REFUSING.');
  process.exit(2);
}
const pure = src.slice(0, cut).replace(
  /^import \{[^}]*\} from 'vitest';$/m,
  "const describe = () => {}; const test = () => {}; const it = () => {};\n"
  + "const expect = () => { throw new Error('probe: expect() called in the pure region'); };\n"
  + 'expect.soft = expect; expect.extend = () => {};',
);

const farm = mkdtempSync(join(tmpdir(), `lprobe-census-farm.${process.pid}.`));
let raw;
try {
  for (const e of readdirSync(tree)) {
    if (e === '.git') continue;
    if (e === 'tests') cpSync(join(tree, 'tests'), join(farm, 'tests'), { recursive: true, dereference: false });
    else symlinkSync(join(tree, e), join(farm, e));
  }
  const tmp = join(farm, 'tests', 'lint', `.lprobe-census.${process.pid}.mjs`);
  writeFileSync(tmp, `${pure}\nconsole.log(JSON.stringify(measureCensus()));\n`, 'utf8');
  raw = execFileSync(process.execPath, [tmp], { cwd: farm, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (error) {
  console.error(`census-probe: the probe FAILED: ${error?.stderr || error?.message || String(error)}`);
  rmSync(farm, { recursive: true, force: true });
  process.exit(1);
} finally {
  try { rmSync(farm, { recursive: true, force: true }); } catch { /* already gone */ }
}
if (existsSync(farm)) {
  console.error(`census-probe: the farm was not removed: ${farm}`);
  process.exit(1);
}

const measured = JSON.parse(raw.trim().split('\n').pop());
const f = measured.figures ?? measured;
if (f.parked + f.credited !== f.files) {
  console.error(`census-probe: INCOHERENT — parked ${f.parked} + credited ${f.credited} !== files ${f.files}.`
    + ' The walker\'s own law calls this incoherence, not drift. REFUSING to report a tuple that cannot be true.');
  process.exit(1);
}

let frozen = null;
if (existsSync(join(tree, BASELINE_REL))) {
  const banked = JSON.parse(readFileSync(join(tree, BASELINE_REL), 'utf8'));
  frozen = Object.fromEntries(Object.entries(banked).filter(([k]) => !k.startsWith('_') && typeof banked[k] === 'number'));
}
const drift = frozen
  ? Object.keys(f).filter((k) => Object.hasOwn(frozen, k) && frozen[k] !== f[k])
    .map((k) => ({ figure: k, frozen: frozen[k], live: f[k], delta: f[k] - frozen[k] }))
  : null;

const payload = {
  instrument: 'lprobe/census-probe.mjs',
  output: '(d) the lighting-census tuple',
  tree,
  takenAt: new Date().toISOString(),
  live: f,
  frozen,
  drift,
  verdict: frozen == null
    ? 'NO FROZEN TUPLE FOUND — the live figures are MEASURED but not compared'
    : drift.length === 0
      ? 'LIVE == FROZEN (no refreeze owed at this tree)'
      : `LIVE DIFFERS from FROZEN on ${drift.length} figure(s) — the chair owes a refreeze at the landing`,
  registerAct: "NOT TAKEN. LIGHTING_CENSUS_REFREEZE is a chair act at the landing; it exits non-zero BY DESIGN,"
    + ' and the proof is a PLAIN re-run of the walker afterwards.',
};
payload.digest = sha256(f);

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
const back = JSON.parse(readFileSync(out, 'utf8'));
if (back.digest !== payload.digest) {
  console.error('census-probe: the written file does not read back to its own digest.');
  process.exit(1);
}
console.log(`census-probe OK  ${JSON.stringify(back.live)}`);
console.log(`  verdict: ${back.verdict}`);
process.exit(back.drift && back.drift.length ? 1 : 0);
