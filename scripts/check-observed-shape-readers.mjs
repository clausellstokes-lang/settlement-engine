#!/usr/bin/env node
/**
 * check-observed-shape-readers.mjs — THE READER-WITH-NO-WRITER RATCHET.
 *
 * THE CLASS. A reader asks a record for a key NO WRITER EVER PRODUCES. Because
 * the read is defensively guarded (`x?.id`, `String(x.foo || '')`,
 * `containers.find(r => Array.isArray(r.exports))`), it does not throw — it
 * degrades to a default, and the arm behind it is structurally dead forever.
 * Nothing reds. Three were found by accident in one week
 * (TCD-1 `.id` on a RulingFaction, TCD-2 `exports` on economicState/economy/
 * trade, TCD-3 `satellite.foundingTier`), plus the recorded
 * `faction-key-defect-class`. Nobody knew how many more there were. This is the
 * machinery that answers that question and keeps answering it.
 *
 * HOW IT DECIDES. Two halves, both derived, neither transcribed:
 *   scripts/lib/observed-shape-corpus.mjs  EXECUTES the real producers across a
 *     multi-seed corpus and histograms the keys each record shape ACTUALLY
 *     carries. Types are not consulted: they were wrong or silent on all three.
 *   scripts/lib/reader-shape-scan.mjs      resolves each property read in `src/`
 *     to the shape its receiver holds and reports reads whose key appears in NO
 *     run.
 *
 * ⚠ UNION, NEVER INTERSECTION. A key present in ANY seed is written. Only a key
 * present in NO seed is a finding. Situational keys (`modifier`, `isGoverning`,
 * `modifiers`, `legitimacyCrisis`) appear in some seeds only; treating absence
 * in one run as evidence would flood the report and get this turned off.
 *
 * SHRINK-ONLY. The estate has pre-existing violations beyond the three, and
 * fixing them is a separate wave. The frozen inventory below is a per-file
 * CEILING: a file over its number fails, a file with no row has ceiling 0, and
 * a fixed site is banked by LOWERING its number. Never raise one.
 *
 * USAGE
 *   node scripts/check-observed-shape-readers.mjs            gate (exit 1 on growth)
 *   node scripts/check-observed-shape-readers.mjs --report   list every finding
 *   node scripts/check-observed-shape-readers.mjs --write    re-freeze (deliberate)
 *   node scripts/check-observed-shape-readers.mjs --json=<p> dump corpus+findings
 * Env: OSR_CORPUS=<path> reuses a dumped corpus instead of re-executing the
 * producers (the walker test uses it so one 40s run serves every assertion).
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { buildObservedCorpus } from './lib/observed-shape-corpus.mjs';
import { scanReaders } from './lib/reader-shape-scan.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE = join(ROOT, 'scripts/.observed-shape-readers-baseline.json');

/**
 * A shape seen fewer times than this is too thin to judge a read against.
 * MEASURED, not guessed (at eca65c8a, the pre-fix sha where all three ground
 * truths still exist): 8 → 4,969 findings; 40 → 3,221; 120 → 3,084; 400 →
 * 2,604 but TCD-3 ESCAPES, because the SatelliteRecord shape carries 222 rows
 * and a threshold above that blinds the walker to the defect that motivated it.
 * 40 keeps a 5.5× margin under the thinnest ground truth while dropping a third
 * of the noise — the trade this number exists to make.
 */
export const MIN_ROWS = 40;

/** Every `.js`/`.jsx` under `src/` — the whole app, not just `src/domain`: the
 *  recorded SP-D repair proved a law scoped to one subtree leaves the UI layer,
 *  where a defect actually reaches a player, entirely unscanned. */
export function sourceFiles(root = ROOT) {
  const out = [];
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(js|jsx)$/.test(p) && !p.endsWith('.generated.js')) out.push(p);
    }
  }(join(root, 'src')));
  return out.sort();
}

/** Per-file counts, forward-slash normalized so the ratchet reads the same on
 *  every platform. */
export function inventoryOf(findings) {
  /** @type {Record<string, number>} */
  const inv = {};
  for (const f of findings) inv[f.file] = (inv[f.file] || 0) + 1;
  return Object.fromEntries(Object.entries(inv).sort(([a], [b]) => a.localeCompare(b)));
}

/** The failure message IS the documentation — see "ratchet kindness". */
export function ratchetMessage(file, count, ceiling, keys) {
  return `${file}: ${count} read(s) of a key no writer produces; frozen ceiling is ${ceiling}`
    + `${keys.length ? ` (${keys.join(', ')})` : ''}.\n`
    + '  A guarded read of a key the real generator never writes cannot throw — it\n'
    + '  degrades to a default, and the arm behind it is dead on every generated world.\n'
    + '  TO COMPLY: read a key the producer actually writes, or delete the dead arm.\n'
    + '    The authority is a real run, not a typedef: `node scripts/check-observed-shape-readers.mjs --report`\n'
    + '    prints the shape and the keys it was observed carrying.\n'
    + '  TO SHRINK: fixed a site? LOWER this file\'s number in\n'
    + '    scripts/.observed-shape-readers-baseline.json. Never raise a number, never add a file.';
}

/** The measurement that makes every green here mean something. */
export function sentinelOf(corpus, stats) {
  const usable = Object.values(corpus.shapes).filter((s) => s.rows >= MIN_ROWS);
  return {
    usableShapes: usable.length,
    totalKeys: usable.reduce((n, s) => n + s.keys.length, 0),
    resolvedReads: stats.resolved,
  };
}

/**
 * ANTI-VACUITY. This walker's real failure mode is not a false finding — it is a
 * corpus that quietly stops observing. A renamed simulation flag, a producer
 * that throws and is swallowed, a shape that stops being reached: every one of
 * them EMPTIES the observed key sets, and an empty corpus makes the ratchet
 * green while proving nothing. So the frozen figures are floored at 90%, the
 * `fullTypecheckRatchet` scope-sentinel idiom one layer up.
 */
export function sentinelFailures(sentinel, frozen) {
  if (!frozen) return [];
  const out = [];
  for (const [k, floorPct] of [['usableShapes', 0.9], ['totalKeys', 0.9], ['resolvedReads', 0.9]]) {
    const floor = Math.floor((frozen[k] || 0) * floorPct);
    if (frozen[k] && sentinel[k] < floor) {
      out.push(`${k}: ${sentinel[k]} < ${floor} (90% of the frozen ${frozen[k]}) — the corpus or the resolver`
        + ' collapsed, so a pass here would be VACUOUS. Fix the producer/scan before touching the inventory.');
    }
  }
  return out;
}

/** Compare a fresh scan against the frozen inventory. */
export function compare(findings, baseline) {
  const inv = inventoryOf(findings);
  const violations = [];
  for (const [file, count] of Object.entries(inv)) {
    const ceiling = baseline.inventory[file] ?? 0;
    if (count > ceiling) {
      const keys = [...new Set(findings.filter((f) => f.file === file).map((f) => `${f.key} on ${f.shapes.join('|')}`))];
      violations.push(ratchetMessage(file, count, ceiling, keys));
    }
  }
  // STALE = a row that can no longer be true. A row whose file is GONE is fatal
  // (the ceiling has become unlimited headroom for a rename). A row whose count
  // merely FELL is reported as a banking opportunity, never a failure: a second
  // build lane is repairing these very files in this very tree, and a ratchet
  // that reds because someone else's fix landed is a ratchet people delete.
  const stale = [];
  const bankable = [];
  for (const [file, ceiling] of Object.entries(baseline.inventory)) {
    if (!existsSync(join(ROOT, file))) stale.push(`${file}: deleted or moved — remove its row from the baseline.`);
    else if (ceiling > 0 && !(inv[file] > 0)) bankable.push(`${file}: 0 findings against a ceiling of ${ceiling} — delete the row (or pin it at 0).`);
    else if (ceiling > 0 && inv[file] < ceiling) bankable.push(`${file}: ${inv[file]} against a ceiling of ${ceiling} — lower the row to bank the win.`);
  }
  return { inventory: inv, violations, stale, bankable };
}

async function corpusFor() {
  const cached = process.env.OSR_CORPUS;
  if (cached && existsSync(cached)) return JSON.parse(readFileSync(cached, 'utf8'));
  return buildObservedCorpus();
}

export async function run(argv = []) {
  const corpus = await corpusFor();
  const files = sourceFiles();
  const { findings, stats } = scanReaders({
    files, shapes: corpus.shapes, arrayShapes: corpus.arrayShapes, singleHome: corpus.singleHome, rootShapes: corpus.rootShapes, minRows: MIN_ROWS, root: ROOT,
  });
  const jsonArg = argv.find((a) => a.startsWith('--json='));
  if (jsonArg) {
    writeFileSync(jsonArg.slice('--json='.length), JSON.stringify({ ...corpus, findings, stats }, null, 1));
  }
  if (argv.includes('--write')) {
    const next = {
      _doc: [
        'READER-WITH-NO-WRITER INVENTORY — per-file ceilings, SHRINK-ONLY.',
        'Frozen from an EXECUTED multi-seed run of the real producers; see',
        'scripts/check-observed-shape-readers.mjs and tests/lint/observedShapeReaders.walker.test.js.',
        'Lower a number when a site is fixed. NEVER raise one; never add a file.',
      ],
      frozen: new Date().toISOString().slice(0, 10),
      frozenAtSha: process.env.OSR_FREEZE_SHA || null,
      minRows: MIN_ROWS,
      corpusMeta: corpus.meta,
      scanStats: stats,
      sentinel: sentinelOf(corpus, stats),
      total: findings.length,
      inventory: inventoryOf(findings),
    };
    writeFileSync(BASELINE, `${JSON.stringify(next, null, 1)}\n`);
    console.log(`froze ${findings.length} finding(s) across ${Object.keys(next.inventory).length} file(s)`);
    return 0;
  }
  const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
  const { violations, stale, bankable } = compare(findings, baseline);
  const vacuity = sentinelFailures(sentinelOf(corpus, stats), baseline.sentinel);
  if (argv.includes('--report')) {
    for (const f of findings) console.log(`${f.file}:${f.line}  ${f.key}  on ${f.shapes.join('|')}   ${f.text}`);
    console.log(`\n${findings.length} finding(s); scan reached ${stats.resolved}/${stats.reads} reads across ${stats.files} files`);
    for (const b of bankable) console.log(`BANKABLE — ${b}`);
  }
  if (!violations.length && !stale.length && !vacuity.length) {
    console.log(`observed-shape readers: ${findings.length} finding(s), all within the frozen inventory`
      + `${bankable.length ? `; ${bankable.length} row(s) bankable` : ''}.`);
    return 0;
  }
  for (const v of vacuity) console.error(`ANTI-VACUITY — ${v}`);
  for (const v of violations) console.error(v);
  for (const s of stale) console.error(`STALE ROW — ${s}`);
  return 1;
}

const invokedDirectly = process.argv[1] && relative(process.argv[1], fileURLToPath(import.meta.url)) === '';
if (invokedDirectly) process.exit(await run(process.argv.slice(2)));
