#!/usr/bin/env node
/**
 * eager-probe.mjs — THE FIRST HALF OF POSITION 1's STOP: "the preset catalog measures EAGER".
 *
 * usage: node eager-probe.mjs --tree <TREE> --out <FILE.json> [--dry]
 *
 * ⭐⭐ THE FINDING THAT MAKES THIS FILE CHEAP, AND IT CORRECTS THE BRIEF.
 * The brief and PLAN §6 POSITION 1 bundle this STOP with the listing diff and say both need
 * a build ("⛔ The listing diff needs a build — a chair act, not a lane's"). Half of that is
 * wrong. THE EAGERNESS OF THE PRESET CATALOG IS A SOURCE-LEVEL PROPERTY AND NEEDS NO BUILD:
 * `tests/build/campaignRuntimeLazy.test.js:145` already pins
 * `src/domain/worldPulse/simulationRules.js` as ABSENT from `sourceStaticClosure('src/main.jsx')`,
 * a pure static-import BFS over `src/`. So the chair can take this STOP reading before the
 * PROSE consist even lands, and can re-take it after every lighting car for free.
 *
 * THE METHOD. The closure walker and its helpers (`resolveSourceImport`, `staticSpecifiers`,
 * `sourceStaticClosure`, `entryChunkClosure`, `chunksContaining`) all sit in that test file's
 * PURE REGION — everything above its first column-0 `describe(`, which is at `:129`. So this
 * probe extracts that region, stubs `vitest`, and calls the estate's OWN walker inside a farm.
 * Nothing is re-implemented, and a change to the walker changes this probe's answer too.
 *
 * ⛔⛔ THE DIST ARM IS INFORMATIONAL AND SAYS SO, BECAUSE NO STRING SENTINEL IDENTIFIES THE
 * CATALOG IN A BUILT CHUNK. Measured across `src/`: every one of the seven preset LABELS
 * ("Quiet Local", "Realistic Regional", "Static Campaign", "Narrative Campaign",
 * "Living Realm", "Dramatic Campaign", "Full Simulation") also appears in
 * `src/domain/compendium/generated/compendiumData.generated.js`, and three of them appear in
 * four further domain files besides. A chunk that carries "Quiet Local" may be the
 * compendium's chunk, not the catalog's. This probe therefore reports the carriers per
 * literal and NAMES the ambiguity; it does not resolve it into a verdict it cannot support.
 * ⭐ The SOURCE arm is the verdict.
 *
 * ANTI-VACUITY, the estate's own idiom (`vendorPdfLazy.test.js:947`): a literal with ZERO
 * carriers has been tree-shaken out and its absence proves nothing. Reported as VACUOUS.
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
const REL = 'tests/build/campaignRuntimeLazy.test.js';
const CATALOG = 'src/domain/worldPulse/simulationRules.js';
const LABELS = ['Quiet Local', 'Realistic Regional', 'Dramatic Campaign', 'Static Campaign',
  'Narrative Campaign', 'Living Realm', 'Full Simulation'];

if (!TREE || !OUT) {
  console.error('usage: node eager-probe.mjs --tree <TREE> --out <FILE.json> [--dry]');
  process.exit(2);
}
const tree = resolve(TREE);
const out = resolve(OUT);

if (DRY) {
  console.log(JSON.stringify({
    dry: true, tree, out,
    reads: [join(tree, REL)],
    sourceArm: `sourceStaticClosure('src/main.jsx') contains ${CATALOG}?  -> the VERDICT`,
    distArm: 'entryChunkClosure() + chunksContaining(<label>) — INFORMATIONAL only; skipped when dist/ is absent',
    stop: `EAGER (the catalog IS in the entry's source closure) => the wave STOPs`,
    writes: [out],
  }, null, 2));
  process.exit(0);
}

const sha256 = (v) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');

const testPath = join(tree, REL);
if (!existsSync(testPath)) {
  console.error(`eager-probe: ${REL} is absent from ${tree}. REFUSING.`);
  process.exit(2);
}
const src = readFileSync(testPath, 'utf8');
const cut = src.search(/^describe\(/m);
if (cut < 0) {
  console.error('eager-probe: the lazy test has no column-0 `describe(` — its shape has changed. REFUSING.');
  process.exit(2);
}
const pure = src.slice(0, cut).replace(
  /^import \{[^}]*\} from 'vitest';$/m,
  "const describe = () => {}; const test = () => {}; const it = () => {};\n"
  + "const expect = () => { throw new Error('probe: expect() called in the pure region'); };\n"
  + 'expect.soft = expect; expect.extend = () => {};',
);

const driver = `
${pure}
const CATALOG = ${JSON.stringify(CATALOG)};
const LABELS = ${JSON.stringify(LABELS)};
const closure = sourceStaticClosure('src/main.jsx');
const result = {
  sourceClosureSize: closure.length,
  catalogInSourceClosure: closure.includes(CATALOG),
  storeEntriesInClosure: closure.filter((m) => /^src\\/store\\//.test(m)),
  distPresent: DIST_EXISTS,
  dist: null,
};
if (DIST_EXISTS) {
  const entryClosure = entryChunkClosure();
  result.dist = {
    entryChunkClosure: entryClosure,
    entryChunkClosureSize: entryClosure.length,
    labelCarriers: Object.fromEntries(LABELS.map((l) => {
      const carriers = chunksContaining(l);
      return [l, { carriers, vacuous: carriers.length === 0, inEntryClosure: carriers.filter((c) => entryClosure.includes(c)) }];
    })),
  };
}
console.log(JSON.stringify(result));
`;

const farm = mkdtempSync(join(tmpdir(), `lprobe-eager-farm.${process.pid}.`));
let raw;
try {
  for (const e of readdirSync(tree)) {
    if (e === '.git') continue;
    if (e === 'tests') cpSync(join(tree, 'tests'), join(farm, 'tests'), { recursive: true, dereference: false });
    else symlinkSync(join(tree, e), join(farm, e));
  }
  const tmp = join(farm, 'tests', 'build', `.lprobe-eager.${process.pid}.mjs`);
  writeFileSync(tmp, driver, 'utf8');
  raw = execFileSync(process.execPath, [tmp], { cwd: farm, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (error) {
  console.error(`eager-probe: the probe FAILED: ${error?.stderr || error?.message || String(error)}`);
  rmSync(farm, { recursive: true, force: true });
  process.exit(1);
} finally {
  try { rmSync(farm, { recursive: true, force: true }); } catch { /* already gone */ }
}
if (existsSync(farm)) {
  console.error(`eager-probe: the farm was not removed: ${farm}`);
  process.exit(1);
}

const measured = JSON.parse(raw.trim().split('\n').pop());
// VACUITY GUARD: an empty closure would make `catalogInSourceClosure === false` mean nothing.
if (!measured.sourceClosureSize || !measured.storeEntriesInClosure.length) {
  console.error(`eager-probe: the source closure came back with ${measured.sourceClosureSize} module(s) and`
    + ` ${measured.storeEntriesInClosure.length} store module(s). An empty or store-less closure makes the`
    + ' absence verdict vacuous. REFUSING.');
  process.exit(1);
}

const payload = {
  instrument: 'lprobe/eager-probe.mjs',
  output: "POSITION 1 STOP arm 1 — does the preset catalog measure EAGER?",
  tree,
  takenAt: new Date().toISOString(),
  catalog: CATALOG,
  verdict: measured.catalogInSourceClosure ? 'EAGER — STOP' : 'LAZY — clear',
  stopTriggered: measured.catalogInSourceClosure === true,
  sourceArm: {
    entry: 'src/main.jsx',
    closureSize: measured.sourceClosureSize,
    catalogInSourceClosure: measured.catalogInSourceClosure,
    storeModulesInClosure: measured.storeEntriesInClosure,
    authority: 'tests/build/campaignRuntimeLazy.test.js asserts this same absence at :145',
  },
  distArm: measured.dist
    ? {
      note: 'INFORMATIONAL ONLY. No string sentinel identifies the preset catalog in a built chunk:'
        + ' every preset label also lives in src/domain/compendium/generated/compendiumData.generated.js.',
      ...measured.dist,
    }
    : { note: 'dist/ absent — the dist arm did not run. This does NOT weaken the source verdict.' },
};
payload.digest = sha256(payload.sourceArm);

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
const back = JSON.parse(readFileSync(out, 'utf8'));
if (back.digest !== payload.digest) {
  console.error('eager-probe: the written file does not read back to its own digest.');
  process.exit(1);
}
console.log(`eager-probe  VERDICT: ${back.verdict}`);
console.log(`  source closure = ${back.sourceArm.closureSize} modules; catalog present = ${back.sourceArm.catalogInSourceClosure}`);
console.log(`  dist arm: ${back.distArm.note.slice(0, 60)}...`);
process.exit(back.stopTriggered ? 1 : 0);
