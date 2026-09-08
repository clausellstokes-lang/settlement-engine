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
 */
import { writeFileSync } from 'node:fs';

import { AUDIENCES, driftRun, goldenCorpus } from '../tests/helpers/dossierManifest.js';

/** The entry point. */
async function main() {
  const argv = process.argv.slice(2);
  const outAt = argv.indexOf('--out');
  const limitAt = argv.indexOf('--limit');
  const limit = limitAt >= 0 ? Number(argv[limitAt + 1]) : 0;
  const configs = limit > 0 ? goldenCorpus().slice(0, limit) : goldenCorpus();
  console.log(`PROSE MANIFEST CELLS · ${configs.length} configurations x ${AUDIENCES.length} audiences`);
  const run = await driftRun({ configs });
  console.log(`  towns ${run.towns} · rows ${run.rows.size} · cells ${run.cells.length} · ${run.seconds} s`);
  console.log(`  cells whose variant the rendered sentence did not identify: ${run.unresolved}`
    + ` · identified ambiguously: ${run.ambiguous}`);
  console.log('  cells where a recomputation over the AUDIBLE pool would have drawn a different'
    + ` variant (the slot-anchoring filter's own footprint, not a defect): ${run.drawDisagrees}`);
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
