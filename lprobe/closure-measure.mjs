#!/usr/bin/env node
/**
 * closure-measure.mjs — the hashed-chunk LISTING and the ENTRY STATIC CLOSURE total for one
 * built `dist/`. The measuring half of OUTPUT (h); `listing.sh` owns the building half.
 *
 * usage: node closure-measure.mjs --dist <DIST> --tree <TREE> --out <FILE.json>
 *                                 [--against <BASE-measure.json>] [--dry]
 *
 * ⛔⛔ THE BRIEF AND PLAN §8 NAME THE WRONG INSTRUMENT FOR THIS STOP, AND IT MATTERS.
 * Both point at `scripts/.size-baseline.json` + `tests/lint/sizeBaseline.test.js` and call
 * the measuring act "the build". That file is an **eslint `max-lines` ratchet**: its test
 * measures effective LINE COUNTS of `src/**` with eslint's own `Linter`, and `npm run build`
 * cannot move a single number in it. It has nothing to do with bytes, chunks or first paint.
 *
 * THE REAL MARGIN is `CLOSURE_BUDGET_BYTES` in `tests/build/vendorPdfLazy.test.js:565`,
 * asserted against the ENTRY'S TRANSITIVE STATIC IMPORT CLOSURE and gated on `VERIFY_DIST=1`.
 * This script reads that constant OUT OF THE TEST SOURCE rather than carrying its own copy —
 * PLAN §8's own standing order is that every published closure figure is at least six
 * landings stale and none may be quoted, so a hardcoded budget here would be the same sin
 * one level down.
 *
 * THE WALKER IS THE ESTATE'S. `staticImportSpecifiers`, `findEntryChunk` and
 * `entryStaticClosure` all sit in that test's PURE REGION (first column-0 `describe(` is at
 * `:677`), so the region is extracted, `vitest` is stubbed, and the estate's own BFS runs.
 * Nothing is re-implemented; if the walker changes, this changes with it.
 *
 * OUTPUT: the full sorted `dist/assets` listing (name, bytes, sha256), the entry closure's
 * member list and byte total, and `marginBytes = CLOSURE_BUDGET_BYTES - closureBytes`.
 *
 * ⛔ `--against <BASE>` ADDS THE DIFF AND THE STOP. PLAN §6 POSITION 1: the wave STOPs when
 * "any listing diff exceeds `(margin − 100 B)`". The margin is the BASE's — the headroom the
 * tree had BEFORE the wave — because a tip that has already eaten the headroom would
 * otherwise measure its own reduced margin and pass. The 100 B is the plan's reserve, kept
 * as a named constant rather than folded into the comparison, so a reader can see it.
 * The diff is reported by NAME (chunks added / removed) and by BYTES (the closure delta),
 * because a rename with identical bytes is still a listing change worth a chair's eye.
 */
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i !== -1 && argv[i + 1] != null && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);

const DIST = flag('dist');
const TREE = flag('tree');
const OUT = flag('out');
const DRY = has('dry');
const AGAINST = flag('against');
const REL = 'tests/build/vendorPdfLazy.test.js';

if (!DIST || !TREE || !OUT) {
  console.error('usage: node closure-measure.mjs --dist <DIST> --tree <TREE> --out <FILE.json> [--dry]');
  process.exit(2);
}
const dist = resolve(DIST);
const tree = resolve(TREE);
const out = resolve(OUT);

if (DRY) {
  console.log(JSON.stringify({
    dry: true, dist, tree, out, against: AGAINST,
    reads: [join(tree, REL), join(dist, 'index.html'), join(dist, 'assets')],
    budgetSource: `${REL} :: CLOSURE_BUDGET_BYTES (read from source, never hardcoded)`,
    emits: ['the sorted dist/assets listing (name, bytes, sha256)', 'the entry static closure and its byte total', 'marginBytes',
      ...(AGAINST ? ['the listing diff vs the base, and the (margin - 100 B) STOP'] : [])],
    writes: [out],
  }, null, 2));
  process.exit(0);
}

const sha256 = (v) => createHash('sha256').update(v).digest('hex');

if (!existsSync(join(dist, 'index.html'))) {
  console.error(`closure-measure: ${dist}/index.html is absent — nothing was built here. REFUSING.`);
  process.exit(2);
}
const assetsDir = join(dist, 'assets');
if (!existsSync(assetsDir)) {
  console.error(`closure-measure: ${assetsDir} is absent. REFUSING.`);
  process.exit(2);
}

const src = readFileSync(join(tree, REL), 'utf8');
const cut = src.search(/^describe\(/m);
if (cut < 0) {
  console.error(`closure-measure: ${REL} has no column-0 \`describe(\` — its shape has changed. REFUSING.`);
  process.exit(2);
}
const budgetMatch = src.match(/const\s+CLOSURE_BUDGET_BYTES\s*=\s*([\d_]+)\s*;/);
if (!budgetMatch) {
  console.error(`closure-measure: could not read CLOSURE_BUDGET_BYTES out of ${REL}.`
    + ' REFUSING rather than substituting a remembered figure — PLAN §8 forbids quoting a'
    + ' closure number from any record.');
  process.exit(3);
}
const CLOSURE_BUDGET_BYTES = Number(budgetMatch[1].replace(/_/g, ''));

const pure = src.slice(0, cut).replace(
  /^import \{ describe, it, expect \} from 'vitest';$/m,
  "const describe = () => {}; const test = () => {}; const it = () => {};\n"
  + "const expect = () => { throw new Error('probe: expect() called in the pure region'); };\n"
  + 'expect.soft = expect; expect.extend = () => {};',
);

// The pure region resolves `distDir` from `process.cwd()`, so the driver runs with cwd set
// to the farm and the farm's `dist` symlinked at the measured build.
const driver = `${pure}
const closure = entryStaticClosure();
console.log(JSON.stringify({ entry: closure.entry, files: closure.files }));
`;

const farm = mkdtempSync(join(tmpdir(), `lprobe-closure-farm.${process.pid}.`));
let raw;
try {
  for (const e of readdirSync(tree)) {
    if (e === '.git' || e === 'dist') continue;
    if (e === 'tests') cpSync(join(tree, 'tests'), join(farm, 'tests'), { recursive: true, dereference: false });
    else symlinkSync(join(tree, e), join(farm, e));
  }
  symlinkSync(dist, join(farm, 'dist'));
  const tmp = join(farm, 'tests', 'build', `.lprobe-closure.${process.pid}.mjs`);
  writeFileSync(tmp, driver, 'utf8');
  raw = execFileSync(process.execPath, [tmp], { cwd: farm, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (error) {
  console.error(`closure-measure: the closure walk FAILED: ${error?.stderr || error?.message || String(error)}`);
  rmSync(farm, { recursive: true, force: true });
  process.exit(1);
} finally {
  try { rmSync(farm, { recursive: true, force: true }); } catch { /* already gone */ }
}
const walk = JSON.parse(raw.trim().split('\n').pop());

// THE LISTING — every asset, not only the closure, because the class-C diff is a LISTING diff.
const listing = readdirSync(assetsDir).sort().map((name) => {
  const bytes = readFileSync(join(assetsDir, name));
  return { name, bytes: statSync(join(assetsDir, name)).size, sha256: sha256(bytes) };
});
if (!listing.length) {
  console.error('closure-measure: dist/assets is EMPTY — a listing of nothing would diff clean against anything. REFUSING.');
  process.exit(1);
}

const closureFiles = [...walk.files].sort();
let closureBytes = 0;
const closureRows = closureFiles.map((name) => {
  const row = listing.find((l) => l.name === name);
  if (!row) {
    console.error(`closure-measure: the entry closure names ${name}, which is not in dist/assets. REFUSING.`);
    process.exit(1);
  }
  closureBytes += row.bytes;
  return row;
});

const payload = {
  instrument: 'lprobe/closure-measure.mjs',
  output: '(h) the class-C hashed-chunk listing + the entry static closure',
  dist,
  tree,
  takenAt: new Date().toISOString(),
  budget: { CLOSURE_BUDGET_BYTES, source: `${REL}:${src.slice(0, budgetMatch.index).split('\n').length}` },
  entryChunk: walk.entry,
  closureFileCount: closureRows.length,
  closureBytes,
  marginBytes: CLOSURE_BUDGET_BYTES - closureBytes,
  closure: closureRows,
  assetCount: listing.length,
  assetBytesTotal: listing.reduce((n, l) => n + l.bytes, 0),
  listing,
};
payload.listingDigest = sha256(Buffer.from(listing.map((l) => `${l.name}\t${l.bytes}\t${l.sha256}`).join('\n')));

const MARGIN_RESERVE_BYTES = 100; // PLAN §6 POSITION 1's reserve, named rather than folded in.
if (AGAINST) {
  let base;
  try {
    base = JSON.parse(readFileSync(resolve(AGAINST), 'utf8'));
  } catch (error) {
    console.error(`closure-measure: could not read the base measurement ${AGAINST}:`
      + ` ${error instanceof Error ? error.message : String(error)}. REFUSING — a diff against nothing`
      + ' would report "clean".');
    process.exit(2);
  }
  if (!Array.isArray(base.listing) || !base.listing.length || !Number.isFinite(base.marginBytes)) {
    console.error('closure-measure: the base measurement carries no listing or no marginBytes. REFUSING.');
    process.exit(2);
  }
  if (base.budget?.CLOSURE_BUDGET_BYTES !== CLOSURE_BUDGET_BYTES) {
    console.error(`closure-measure: the base was measured against budget ${base.budget?.CLOSURE_BUDGET_BYTES}`
      + ` and the tip against ${CLOSURE_BUDGET_BYTES}. The budget itself moved; the arithmetic below`
      + ' would compare two different laws. REFUSING.');
    process.exit(3);
  }
  const baseNames = new Set(base.listing.map((l) => l.name));
  const tipNames = new Set(listing.map((l) => l.name));
  const added = [...tipNames].filter((n) => !baseNames.has(n)).sort();
  const removed = [...baseNames].filter((n) => !tipNames.has(n)).sort();
  const closureDeltaBytes = closureBytes - base.closureBytes;
  const allowance = base.marginBytes - MARGIN_RESERVE_BYTES;
  payload.diff = {
    base: base.dist,
    baseClosureBytes: base.closureBytes,
    baseMarginBytes: base.marginBytes,
    marginReserveBytes: MARGIN_RESERVE_BYTES,
    allowanceBytes: allowance,
    tipClosureBytes: closureBytes,
    closureDeltaBytes,
    assetsAdded: added,
    assetsRemoved: removed,
    assetBytesDelta: payload.assetBytesTotal - base.assetBytesTotal,
    listingChanged: base.listingDigest !== payload.listingDigest,
    stopTriggered: closureDeltaBytes > allowance,
    verdict: closureDeltaBytes > allowance
      ? `STOP — the closure grew ${closureDeltaBytes} B, past the base margin ${base.marginBytes} B less the`
        + ` ${MARGIN_RESERVE_BYTES} B reserve (allowance ${allowance} B). PLAN §6 POSITION 1: the wave halts and`
        + " LGT-O-CLOSURE's two-option re-ask goes to the desk WITH THESE FIGURES."
      : `clear — the closure moved ${closureDeltaBytes} B against an allowance of ${allowance} B`,
  };
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
const back = JSON.parse(readFileSync(out, 'utf8'));
if (back.listingDigest !== payload.listingDigest) {
  console.error('closure-measure: the written file does not read back to its own listing digest.');
  process.exit(1);
}
console.log(`closure-measure OK  assets=${back.assetCount} closureFiles=${back.closureFileCount}`
  + ` closureBytes=${back.closureBytes} budget=${CLOSURE_BUDGET_BYTES} margin=${back.marginBytes}`
  + ` listingDigest=${back.listingDigest.slice(0, 12)} -> ${out}`);
if (back.diff) {
  console.log(`  diff: closure ${back.diff.closureDeltaBytes >= 0 ? '+' : ''}${back.diff.closureDeltaBytes} B`
    + ` vs allowance ${back.diff.allowanceBytes} B; added=${back.diff.assetsAdded.length} removed=${back.diff.assetsRemoved.length}`);
  console.log(`  VERDICT: ${back.diff.verdict}`);
  process.exit(back.diff.stopTriggered ? 1 : 0);
}
