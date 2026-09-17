/**
 * scripts/prose-manifest-cells.mjs — THE PER-CELL TABLE, ON DEMAND (ARCH §3.7).
 *
 * WHAT IT IS. The DRIFT corpus composed through the six desks at both audiences, written out
 * one row per CELL — `${keyOf(config)}::${audience}::${mount}::${rungIndex}` with the pool,
 * the variant, the drawn index, the face, the angle, the pieces and a text digest. ~72,000
 * rows at this tip.
 *
 * ⛔ NEVER COMMITTED, AND THAT IS THE DESIGN. The committed artefact is the per-ROW roll-up
 * (`tests/fixtures/dossier-prose-manifest-golden.json`, 1,050 rows), which is what a gate can
 * afford to carry and what the drift arm reads. The per-cell table is regenerated at any sha
 * by this command and handed to `scripts/prose-manifest-diff.mjs`, which is how a signed car
 * answers "what KIND of movement was that" instead of "a row moved".
 *
 * ⛔ IT RE-SPELLS NOTHING. Every cell comes from `tests/helpers/dossierManifest.js`, the same
 * module the suite asserts through, so the recorded world and the asserted world cannot
 * diverge — the estate's own `presetLightingWitnessRun.js` law.
 *
 * READ-ONLY except the `--out` file it is asked for.
 *
 *   node scripts/prose-manifest-cells.mjs --out <file>       the DRIFT corpus, both audiences
 *   node scripts/prose-manifest-cells.mjs --out <file> --limit 20    a cheap slice for a plant
 *   node scripts/prose-manifest-cells.mjs --out <file> --limit 8 --seeds 60
 *                                                           the RE-INDEXED plant's corpus
 *   GOLDEN_SHIFT_SIGNED=docs/shift-records/<record>.json \
 *     node scripts/prose-manifest-cells.mjs --record         re-record the committed fixture,
 *                                                           THROUGH THE SIGNED DOOR (see below)
 *
 * ⛔ WHY `--seeds` EXISTS (the MEASURE fold's U4, cure 7). Car 1's second classifier plant —
 * a third variant appended to a two-variant pool, RE-INDEXED on ≈ 2/3 of that pool's cells —
 * was measured on 8 configurations x 60 SEEDS, and no committed command produced that corpus:
 * the DRIFT corpus is 516 rows at one seed, where a pool has one hash and one drawn variant,
 * so the plant cannot fire on it at all. A plant nobody but its author can re-run is a
 * measurement the estate has to take on trust. `--seeds N` re-seeds each configuration N
 * times (`--seed-prefix` names the family), and `keyOf` folds the seed into the row key, so
 * the corpus is exactly the plant's and every cell is addressed distinctly.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { recordGolden } from '../tests/helpers/goldenRecordDoor.js';

import {
  AUDIENCES, driftRun, goldenCorpus, manifestBytes, recorderShas,
} from '../tests/helpers/dossierManifest.js';
import { ROOT } from '../tests/helpers/dossierCorpus.js';

/** The committed roll-up the drift arm reads. */
export const MANIFEST_REL = 'tests/fixtures/dossier-prose-manifest-golden.json';

/**
 * THE DECLARED SHIFT THE RE-RECORD CARRIES. It is written INTO the fixture's bytes, so the
 * drift arm compares it and a fixture cannot carry one declaration while its rows carry another.
 *
 * ⭐ A PROSE SHIFT, SIGNED (owner orders 2026-09-17). The declaration before this one was an
 * INSTRUMENT shift (SITTING §P.2-29, MEASURE car 3: the economy desk called by its shipped
 * recipe; recorded over `fcd98a3dbb3178adccb37b6f3f103bb5dc03af63`). This one moves composed
 * PROSE, under the owner's own words, so it names the orders and the signed record rather than
 * a sitting row.
 */
export const MANIFEST_PROVENANCE = Object.freeze({
  shift: 'PROSE',
  ruling: 'OWNER ORDERS 2026-09-17: "Fix the contradiction." and "fix the remaining contradictions";'
    + ' the owner signed the re-record ("I approve"); docs/shift-records/2026-09-17-dossier-contradictions.json.',
  car: 'DOSSIER AND REALM POLISH, parts 1 and 3 (docs/FIRST_CONTACT_BACKLOG.md)',
  recordedOverSha: 'a62dcbb907a14daa4e2555f638ad7a7e82883d22',
  note: 'Three predicates now read the same truth as the surface beside them. DS-STR-1\'s no-banner'
    + ' rung composes on a town with NO crisis banner instead of on every town with one (all 1,050'
    + ' rows: 516 golden-master-v3 towns lose the cell, the three calm gm-seed towns gain it);'
    + ' DS-GEN-16\'s UNMARKED ("No great blow stands on the record") no longer composes over a record'
    + ' carrying a major or catastrophic row (15 towns, 30 rows lose that cell); and DS-POW-2\'s'
    + ' stability header follows the label beneath it now that an infiltrated town no longer reads'
    + ' `Stable` beside its own ACTIVE CRISIS card (958 cells = 479 towns x 2 audiences, all in'
    + ' `power.stabilityHeader`, leaving the `stable matched` pool for the plain-description floor;'
    + ' the CELL COUNT does not move for this one, only the content). 73,284 cells become 72,240.'
    + ' `recordedOverSha` is DECLARATIVE (the base the change was built on); `recorder` is the'
    + ' executable half.',
});

/** This surface's identity in tests/fixtures/.golden-freeze-register.json. */
export const MANIFEST_SURFACE = 'dossier-prose-manifest';

/** The entry point. */
async function main() {
  const argv = process.argv.slice(2);
  const outAt = argv.indexOf('--out');
  const limitAt = argv.indexOf('--limit');
  const seedsAt = argv.indexOf('--seeds');
  const prefixAt = argv.indexOf('--seed-prefix');
  const record = argv.includes('--record');
  const limit = limitAt >= 0 ? Number(argv[limitAt + 1]) : 0;
  const seeds = seedsAt >= 0 ? Number(argv[seedsAt + 1]) : 0;
  const prefix = prefixAt >= 0 ? String(argv[prefixAt + 1]) : 'manifest-seed';
  const base = limit > 0 ? goldenCorpus().slice(0, limit) : goldenCorpus();
  const configs = seeds > 0
    ? base.flatMap((config) => Array.from({ length: seeds }, (_, i) => ({ ...config, _seed: `${prefix}-${i}` })))
    : base;
  console.log(`PROSE MANIFEST CELLS · ${configs.length} configurations x ${AUDIENCES.length} audiences`
    + (seeds > 0 ? ` (${base.length} configurations x ${seeds} seeds, family ${prefix})` : ''));
  const run = await driftRun({ configs });
  console.log(`  towns ${run.towns} · rows ${run.rows.size} · cells ${run.cells.length} · ${run.seconds} s`);
  console.log(`  cells whose variant the rendered sentence did not identify: ${run.unresolved}`
    + ` · identified ambiguously: ${run.ambiguous}`);
  console.log('  cells where a recomputation over the AUDIBLE pool would have drawn a different'
    + ` variant (the slot-anchoring filter's own footprint, not a defect): ${run.drawDisagrees}`);
  if (record) {
    // ⛔ THE ONE WRITE PATH IS THE SIGNED GOLDEN DOOR. This surface was written here directly
    // while the register was UNFROZEN (the door's own arms forbade a recorded value then). The
    // genesis freeze (2026-09-16) armed the register, and from it a plain write is an unsigned
    // move of a frozen golden, so `--record` now goes through `recordGolden`: it REFUSES without
    // `GOLDEN_SHIFT_SIGNED` naming a signed record for this surface, refuses a dirty tree beyond
    // the fixture, the register and the record, writes the fixture and its register row in one
    // act, and THROWS on success by design. Re-run the manifest suite and
    // tests/lint/goldenFreeze.walker.test.js plainly afterwards; that green is the receipt.
    if (seeds > 0 || limit > 0) throw new Error('--record writes the DRIFT corpus whole: drop --limit and --seeds');
    const bytes = manifestBytes(run.rows, { ...MANIFEST_PROVENANCE, recorder: recorderShas() });
    recordGolden({ surface: MANIFEST_SURFACE, path: join(ROOT, MANIFEST_REL), produce: () => bytes, root: ROOT });
  }
  if (outAt >= 0 && argv[outAt + 1]) {
    writeFileSync(argv[outAt + 1], `${JSON.stringify({
      corpus: { kind: 'DRIFT', configs: configs.length, audiences: [...AUDIENCES] },
      rows: Object.fromEntries([...run.rows].sort((a, b) => (a[0] < b[0] ? -1 : 1))),
      cells: run.cells,
    }, null, 1)}\n`);
    console.log(`  wrote ${argv[outAt + 1]}`);
  } else {
    console.log('  (no --out given: nothing written)');
  }
}

if (process.argv[1] && process.argv[1].endsWith('prose-manifest-cells.mjs')) await main();
