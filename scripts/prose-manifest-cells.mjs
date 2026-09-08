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
 *   node scripts/prose-manifest-cells.mjs --record           re-record the committed fixture
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

import {
  AUDIENCES, driftRun, goldenCorpus, manifestBytes, recorderShas,
} from '../tests/helpers/dossierManifest.js';
import { ROOT } from '../tests/helpers/dossierCorpus.js';

/** The committed roll-up the drift arm reads. */
export const MANIFEST_REL = 'tests/fixtures/dossier-prose-manifest-golden.json';

/**
 * THE DECLARED SHIFT THE RE-RECORD CARRIES (SITTING §P.2-29). It is an INSTRUMENT shift and
 * never a prose shift: no composer, no pool leaf and no seed input moved in the car that
 * re-recorded it. What moved is the RECIPE the recorder composes through.
 * @type {Readonly<Record<string, string>>}
 */
export const MANIFEST_PROVENANCE = Object.freeze({
  shift: 'INSTRUMENT',
  ruling: 'SITTING §P.2-29 — cure 1 changes the recorder\'s own coordinate on the player face;'
    + ' a declared INSTRUMENT shift, re-recorded by the recorder before SEAM car 3a pins'
    + ' `pieces` against it.',
  car: 'MEASURE car 3 (the fold\'s cures)',
  recordedOverSha: 'fcd98a3dbb3178adccb37b6f3f103bb5dc03af63',
  note: 'The economy desk is now called by its shipped recipe with every caller reading and'
    + ' `playerView` from the audience (scripts/prose-rate-corpus.mjs `economyDeskOptions`).'
    + ' Before it, 309 player cells carried `index: -1` and DM-only prose, the two faces were'
    + ' identical by construction on 16.3 % of cells, and two registered economy mounts'
    + ' recorded nothing. `recordedOverSha` is DECLARATIVE — a recorder cannot know the sha of'
    + ' the commit it is about to land in — and `recorder` is the executable half: the bytes'
    + ' of the three files that decide what this fixture says.',
});

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
    // ⛔ THE ONE WRITE PATH, AND IT IS NOT THE GOLDEN DOOR. `recordGolden` is refused for this
    // surface while the register is UNFROZEN (car 1 §1.5, ratified SITTING §O.8): a door write
    // fills `sha256`/`rows`/`ownerRow`, which the register's own arms forbid until the freeze
    // act. Until then the honest cure for "the fixture is updated by hand and nothing refuses
    // it" (the fold's P12) is a RECORDER plus a provenance the suite recomputes from the tree.
    if (seeds > 0 || limit > 0) throw new Error('--record writes the DRIFT corpus whole: drop --limit and --seeds');
    writeFileSync(join(ROOT, MANIFEST_REL), manifestBytes(run.rows, {
      ...MANIFEST_PROVENANCE, recorder: recorderShas(),
    }));
    console.log(`  RE-RECORDED ${MANIFEST_REL} — ${run.rows.size} rows, shift ${MANIFEST_PROVENANCE.shift}`);
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
