#!/usr/bin/env node
/**
 * presence-dump.mjs — OUTPUT (c): THE OSR PER-PARENT PRESENCE DUMP, taken BEFORE any
 * regeneration. This is `LGT-C0-PROBE`'s OSR arm and the reason L-PROBE must precede
 * L-DEFAULT rather than merely accompany it (PLAN §5.4).
 *
 * usage: node presence-dump.mjs --tree <TREE> --out <FILE.json> [--dry]
 *
 * WHAT IT ANSWERS. `MIN_ROWS = 40` is the reader ratchet's too-thin-to-judge floor. A
 * shape that CROSSES it starts judging every read of it against a union it never had,
 * and one key once detonated 188 growth rows. The lighting wave cannot know how many
 * shapes cross until the lighting code exists — so the wave's obligation is to record
 * the BEFORE side now, key by key and PARENT BY PARENT, and attribute every later
 * crossing against it.
 *
 * ⛔ IT MUST NOT REGENERATE. It calls `buildObservedCorpus()` — the same builder the
 * checker calls — and NOTHING ELSE. It never invokes `check-observed-shape-readers.mjs`,
 * never passes `--write`, `--update` or `--genesis`, never runs
 * `migrate-observed-shape-readers.mjs`, and writes only the file named by `--out`.
 *
 * ⚠⚠ WHAT "PRESENCE" MEANS HERE, AND THE ONE THING THIS DUMP CANNOT SEE.
 * The corpus's own presence test is, verbatim (scripts/lib/observed-shape-corpus.mjs:434,
 * :462 — NOT check-observed-shape-readers.mjs, where the chair's brief placed it):
 *
 *     const presenceOf = (key) => (frequencies.get(key) || 0) / sets.length;
 *     const schemaKeys = keys.filter((key) => presenceOf(key) >= SCHEMA_PRESENCE);   // 0.8
 *
 * `frequencies` and `sets` are CLOSURE STATE inside `planDynamicCollapse` and are not
 * exported. What IS exported, per parent path, is `keys` and `requiredKeys`, and
 * `requiredKeys` is defined as `occurrences === recordInstances` — i.e. EXACTLY the
 * `presenceOf(key) === 1.0` subset. So this dump reports:
 *
 *     keys          every key observed at that parent
 *     requiredKeys  the measured presence == 1.0 subset  (a LOWER BOUND on schemaKeys)
 *     optionalKeys  keys \ requiredKeys — presence is somewhere in (0, 1); the exact
 *                   fraction is NOT DERIVABLE from the exported surface
 *
 * That is stated rather than papered over. `schemaKeys ⊇ requiredKeys` always, and the
 * MIN_ROWS cause read needs `rows`, which IS exported exactly. A dump that silently
 * printed a computed "schemaKeys" would be minting a figure the instrument does not
 * expose. If the chair needs the exact fractions, `--mode exact` below measures them.
 *
 * `--mode exact` — the FARM ARM. Copies the corpus module into a farm, splices ONE
 * line into `origins[path] = {...}` that carries `node.fieldOccurrences` out, and prints
 * the resulting diff so the splice is read rather than trusted. The anchor must match
 * EXACTLY ONCE or the arm REFUSES; it never falls back to the exported arm.
 */
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const flag = (name, dflt = null) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] != null && !argv[i + 1].startsWith('--') ? argv[i + 1] : dflt;
};
const has = (name) => argv.includes(`--${name}`);

const TREE = flag('tree');
const OUT = flag('out');
const MODE = flag('mode', 'exported');
const DRY = has('dry');

if (!TREE || !OUT) {
  console.error('usage: node presence-dump.mjs --tree <TREE> --out <FILE.json> [--mode exported|exact] [--dry]');
  process.exit(2);
}
if (!['exported', 'exact'].includes(MODE)) {
  console.error(`presence-dump: --mode must be 'exported' or 'exact', not ${JSON.stringify(MODE)}`);
  process.exit(2);
}

const tree = resolve(TREE);
const out = resolve(OUT);

if (DRY) {
  console.log(JSON.stringify({
    dry: true,
    mode: MODE,
    tree,
    out,
    wouldImport: [
      join(tree, 'scripts/lib/observed-shape-corpus.mjs'),
      join(tree, 'scripts/lib/observed-shape-baseline.mjs'),
    ],
    wouldCall: ['buildObservedCorpus({ quiet: true })'],
    wouldNeverCall: [
      'check-observed-shape-readers.mjs (any flag)',
      'migrate-observed-shape-readers.mjs',
      '--write / --update / --genesis / --rebank',
    ],
    writes: [out],
  }, null, 2));
  process.exit(0);
}

const sha256 = (v) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');

// ── the exact arm's farm ────────────────────────────────────────────────────────
const CORPUS_REL = 'scripts/lib/observed-shape-corpus.mjs';
// ⚠ THE INDENTATION IS PART OF THE ANCHOR, and getting it wrong is how this arm dies
// quietly. Measured at the tree: `scripts/lib/observed-shape-corpus.mjs:662` carries EIGHT
// leading spaces, not six. The count guard below caught the wrong constant on the first
// pass — an anchor that matches 0 times REFUSES rather than splicing nothing and reporting
// success, which is the only reason this was a five-minute fix and not a silent dead arm.
const ANCHOR = '        requiredKeys: [...node.fieldOccurrences]';
const SPLICE = '        occurrences: Object.fromEntries(node.fieldOccurrences),\n'
  + '        recordInstances: node.recordInstances,\n';

let farm = null;
function makeExactFarm() {
  const src = readFileSync(join(tree, CORPUS_REL), 'utf8');
  const hits = src.split(ANCHOR).length - 1;
  if (hits !== 1) {
    console.error(`presence-dump --mode exact: the splice anchor matched ${hits} times, not exactly 1.`
      + ' The corpus module has changed shape. REFUSING — this arm does not guess, and it does'
      + ' NOT fall back to the exported arm, because a silently substituted instrument is how a'
      + ' stale copy gets reported as a fresh measurement.');
    process.exit(3);
  }
  farm = mkdtempSync(join(tmpdir(), `lprobe-presence-farm.${process.pid}.`));
  for (const e of readdirSync(tree)) {
    if (e === '.git') continue;
    symlinkSync(join(tree, e), join(farm, e));
  }
  // Replace the symlinked scripts/ with a real dir carrying ONE patched file.
  rmSync(join(farm, 'scripts'), { force: true });
  cpSync(join(tree, 'scripts'), join(farm, 'scripts'), { recursive: true, dereference: false });
  const patched = src.replace(ANCHOR, SPLICE + ANCHOR);
  writeFileSync(join(farm, CORPUS_REL), patched, 'utf8');
  const before = src.split('\n');
  const after = patched.split('\n');
  const diff = [];
  for (let i = 0, j = 0; i < before.length || j < after.length;) {
    if (before[i] === after[j]) { i += 1; j += 1; continue; }
    diff.push(`+ ${after[j]}`);
    j += 1;
    if (diff.length > 8) break;
  }
  console.error('presence-dump --mode exact: the ONE splice, printed so it is read rather than trusted:');
  for (const line of diff) console.error(`    ${line}`);
  return join(farm, CORPUS_REL);
}

const corpusPath = MODE === 'exact' ? makeExactFarm() : join(tree, CORPUS_REL);

let corpus;
let baseline;
try {
  const mod = await import(pathToFileURL(corpusPath).href);
  baseline = await import(pathToFileURL(join(tree, 'scripts/lib/observed-shape-baseline.mjs')).href);
  process.stderr.write('presence-dump: driving buildObservedCorpus() — 4 seeds x 4 configs + 12 pulse intervals.\n');
  const t0 = Date.now();
  corpus = await mod.buildObservedCorpus({ quiet: true });
  process.stderr.write(`presence-dump: corpus built in ${Math.round((Date.now() - t0) / 1000)}s\n`);
} catch (error) {
  console.error(`presence-dump: the corpus build FAILED: ${error?.stack ?? String(error)}`);
  if (farm) rmSync(farm, { recursive: true, force: true });
  process.exit(1);
}
if (farm) rmSync(farm, { recursive: true, force: true });

const MIN_ROWS = baseline.MIN_ROWS;
const ORIGIN_MIN_ROWS = baseline.ORIGIN_MIN_ROWS;
const SCHEMA = baseline.BASELINE_SCHEMA;
if (!Number.isFinite(MIN_ROWS)) {
  console.error('presence-dump: the tree exports no finite MIN_ROWS — refusing to invent one.');
  process.exit(1);
}

const origins = corpus.graph?.origins ?? {};
const parents = Object.entries(origins).map(([path, o]) => {
  const required = new Set(o.requiredKeys || []);
  const optional = (o.keys || []).filter((k) => !required.has(k));
  return {
    path,
    label: o.label,
    rows: o.rows,
    instances: o.instances,
    keyCount: (o.keys || []).length,
    keys: o.keys || [],
    requiredKeys: o.requiredKeys || [],
    optionalKeys: optional,
    // presence == 1.0 share of the parent's key population. `schemaKeys` (>= 0.8) is a
    // SUPERSET of requiredKeys, so this is the measured LOWER BOUND on the schema share.
    requiredShare: (o.keys || []).length ? required.size / o.keys.length : null,
    ...(o.occurrences
      ? {
        exactPresence: Object.fromEntries(
          Object.entries(o.occurrences).map(([k, n]) => [k, n / o.recordInstances]),
        ),
        exactSchemaKeys: Object.entries(o.occurrences)
          .filter(([, n]) => n / o.recordInstances >= 0.8)
          .map(([k]) => k)
          .sort(),
      }
      : {}),
  };
}).sort((a, b) => a.path.localeCompare(b.path));

const shapes = Object.entries(corpus.shapes || {}).map(([name, s]) => ({
  name,
  rows: s.rows,
  keyCount: (s.keys || []).length,
  keys: s.keys || [],
  // THE MIN_ROWS CAUSE READ. `crossed` shapes are ALREADY judged; `headroom` is how many
  // rows a shape may still gain before it crosses and starts judging.
  crossesMinRows: s.rows >= MIN_ROWS,
  rowsToMinRows: s.rows >= MIN_ROWS ? 0 : MIN_ROWS - s.rows,
})).sort((a, b) => a.name.localeCompare(b.name));

const below = shapes.filter((s) => !s.crossesMinRows);
const payload = {
  instrument: 'lprobe/presence-dump.mjs',
  output: '(c) the OSR per-parent presence dump — taken BEFORE any regeneration',
  mode: MODE,
  tree,
  takenAt: new Date().toISOString(),
  thresholds: { MIN_ROWS, ORIGIN_MIN_ROWS, BASELINE_SCHEMA: SCHEMA, SCHEMA_PRESENCE: 0.8 },
  presenceSemantics: MODE === 'exact'
    ? 'exactPresence/exactSchemaKeys are MEASURED from the spliced fieldOccurrences; requiredKeys is presence == 1.0'
    : 'requiredKeys is the measured presence == 1.0 subset and a LOWER BOUND on schemaKeys (>= 0.8); the exact fractions are NOT exported',
  counts: {
    parents: parents.length,
    shapes: shapes.length,
    shapesAtOrAboveMinRows: shapes.length - below.length,
    shapesBelowMinRows: below.length,
  },
  // The wave's watch list: what a single lit key could push over the floor.
  nearestToMinRows: below
    .slice()
    .sort((a, b) => a.rowsToMinRows - b.rowsToMinRows)
    .slice(0, 40)
    .map((s) => ({ name: s.name, rows: s.rows, rowsToMinRows: s.rowsToMinRows })),
  shapes,
  parents,
  corpusMeta: corpus.meta ?? null,
  graphMeta: corpus.graph?.meta ?? null,
};
payload.digest = sha256({ shapes: payload.shapes, parents: payload.parents });

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

// READ-BACK. Never let a success message be a separate statement from the thing that
// succeeded: re-read the file and report from the re-read, not from the in-memory value.
const back = JSON.parse(readFileSync(out, 'utf8'));
if (back.digest !== payload.digest) {
  console.error('presence-dump: the written file does not read back to the digest it was written with.');
  process.exit(1);
}
console.log(`presence-dump OK  parents=${back.counts.parents} shapes=${back.counts.shapes}`
  + ` atOrAbove(MIN_ROWS=${MIN_ROWS})=${back.counts.shapesAtOrAboveMinRows}`
  + ` below=${back.counts.shapesBelowMinRows} digest=${back.digest.slice(0, 12)} -> ${out}`);
