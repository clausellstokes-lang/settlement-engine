/**
 * scripts/prose-duplicate-units.mjs — THE VARIETY CORPUS, THE DUPLICATE-UNIT BASELINE, AND
 * THE REPEAT CENSUS (ARCH §3.4, §7).
 *
 * WHAT THE OWNER'S QUESTION IS. "Does the prose go stale" has two halves, and only one of them
 * is measurable by a reader. WITHIN a town the answer is THE PROMISE — the same seed reads the
 * same words forever, by design — and a report of that is a promise report, answered and
 * closed. ACROSS towns is the real question, and a beta reader cannot see it: they meet a
 * handful of towns and almost never two in one state cell. The instrument that carries the
 * question is the DUPLICATE-UNIT RATE on the VARIETY corpus, printed with its N and its seed
 * count before any text moves, so every later car's claim is a measured delta.
 *
 * ⛔ THE BASELINE IS NOT A FLOOR AND NOT A DEFECT RATE. Two towns in one state cell SHOULD
 * read the same fact. Whether they read the same WORDS is what faces and pieces change, and
 * this number is what that change will be measured against.
 *
 * ── THE REPEAT CENSUS, AND WHY MOST OF IT IS NOT-EXECUTABLE HERE ────────────────────
 * §7's repeat census compares the DISTINCT texts a position shows against the chance floor
 * given the piece counts. At this tip the draw is `hash(seed::block::pool) % variants`, so the
 * number of INDEPENDENT draws at a position is the number of distinct SEEDS, never the number
 * of towns: 4,200 towns carrying 8 seeds give 8 draws. The census therefore declares itself
 * NOT-EXECUTABLE wherever the seed count is below the stated minimum, prints N, expected,
 * observed and the seed count on every row it does answer, and never reports a pass it did
 * not earn.
 *
 * READ-ONLY except the `--out` file it is asked for. A per-car instrument, never per-CI.
 *
 *   node scripts/prose-duplicate-units.mjs [--seeds 8] [--configs 525] [--out <file>]
 */
import { writeFileSync } from 'node:fs';

import { AUDIENCES, driftRun, goldenCorpus, poolIndex } from '../tests/helpers/dossierManifest.js';
import { variantIsAudible } from '../src/domain/display/stateProse/stateProseKernel.js';
import { duplicateUnits, positionOf, varietyConfigs, VARIETY_SEEDS } from '../tests/helpers/proseVarietyCorpus.js';

/** The fewest independent draws a repeat-census row may rest on. Below it the row refuses. */
export const MIN_DRAWS = 8;

/**
 * THE REPEAT CENSUS, per (position, pool). `expectedDistinct` is the chance floor: over `s`
 * independent draws from `k` variants a position is EXPECTED to show
 * `k * (1 - (1 - 1/k)^s)` distinct texts, and a position showing materially fewer is a pool
 * too thin for its cell's frequency — an authoring row, never a draw change.
 * @param {Map<string, {seeds: Set<string>, texts: Set<string>, variants: number, towns: number}>} groups
 * @returns {{executable: Array<object>, notExecutable: number, findings: Array<object>}}
 */
export function repeatCensus(groups) {
  /** @type {Array<object>} */
  const executable = [];
  let notExecutable = 0;
  for (const [key, seat] of groups) {
    const draws = seat.seeds.size;
    const k = seat.variants;
    if (draws < MIN_DRAWS || k < 2) { notExecutable += 1; continue; }
    // Integers only: the estate's prose-numerics register counts a float interpolation, and a
    // statistic that formats has decided a presentation for a reader it cannot see.
    const expectedBp = Math.round(k * (1 - ((k - 1) / k) ** draws) * 10000);
    executable.push({
      key,
      towns: seat.towns,
      draws,
      variants: k,
      distinct: seat.texts.size,
      expectedDistinctBp: expectedBp,
    });
  }
  const findings = executable
    .filter((row) => row.distinct * 10000 * 2 < row.expectedDistinctBp)
    .sort((a, b) => a.distinct - b.distinct || b.towns - a.towns);
  return { executable, notExecutable, findings };
}

/** The entry point. */
async function main() {
  const argv = process.argv.slice(2);
  const at = (flag, fallback) => {
    const i = argv.indexOf(flag);
    return i >= 0 && argv[i + 1] ? Number(argv[i + 1]) : fallback;
  };
  const seeds = at('--seeds', VARIETY_SEEDS);
  const configCount = at('--configs', goldenCorpus().length);
  const configs = varietyConfigs({ seeds, configs: goldenCorpus().slice(0, configCount) });
  console.log(`VARIETY CORPUS · ${configCount} configurations x ${seeds} seeds = ${configs.length} towns`
    + ` x ${AUDIENCES.length} audiences`);
  /** @type {Map<string, {seeds: Set<string>, texts: Set<string>, variants: number, towns: number}>} */
  const groups = new Map();
  /** @type {Array<{cell: string, textSha: string}>} */
  const slim = [];
  // The POOL SIZE is read from the leaves rather than inferred from a drawn index: a census
  // whose denominator is the largest index it happened to SEE reports a floor it invented.
  const pools = await poolIndex();
  /** @param {string} block @param {string} pool @param {string} audience @returns {number} */
  const audibleSize = (block, pool, audience) => (pools.get(`${block} :: ${pool}`) || [])
    .filter((v) => variantIsAudible(v, audience)).length;
  const run = await driftRun({
    configs,
    onCells: (cells) => {
      for (const cell of cells) {
        slim.push({ cell: cell.cell, textSha: cell.textSha });
        const seed = String(cell.cell).split('|').pop().split('::')[0];
        const key = `${positionOf(cell.cell)} @@ ${cell.block} :: ${cell.pool}`;
        let seat = groups.get(key);
        if (!seat) { seat = { seeds: new Set(), texts: new Set(), variants: 0, towns: 0 }; groups.set(key, seat); }
        seat.seeds.add(seed);
        seat.texts.add(cell.textSha);
        seat.towns += 1;
        seat.variants = audibleSize(cell.block, cell.pool, String(cell.cell).split('::')[1]);
      }
    },
  });
  console.log(`  towns ${run.towns} · cells ${slim.length} · ${run.seconds} s`
    + ` · ${Math.round((run.seconds * 1000) / Math.max(1, run.towns))} ms per town`);
  console.log(`  cells the rendered sentence did not identify ${run.unresolved}`
    + ` · identified ambiguously ${run.ambiguous}`);
  const duplicates = duplicateUnits(slim);
  console.log('  ── THE DUPLICATE-UNIT BASELINE ───────────────────────────────────');
  console.log(`    unit instances ${duplicates.units} · instances whose (position, text) pair is`
    + ` seen on more than one town ${duplicates.duplicateUnits}`);
  console.log(`    DUPLICATE-UNIT RATE ${duplicates.rateBp} bp`
    + ` at N = ${run.towns} towns over ${seeds} seeds and ${configCount} configurations`);
  console.log(`    distinct (position, text) pairs ${duplicates.distinctPairs}`
    + ` · pairs seen on more than one town ${duplicates.pairsSeenTwice}`);
  console.log('    the ten positions carrying the most unit instances:');
  for (const [position, seat] of duplicates.byPosition.slice(0, 10)) {
    console.log(`      ${position.slice(0, 54).padEnd(54)} units ${String(seat.units).padStart(6)}`
      + ` · duplicated ${String(seat.duplicates).padStart(6)}`);
  }
  const census = repeatCensus(groups);
  console.log('  ── THE REPEAT CENSUS, per (position, pool) ───────────────────────');
  console.log(`    groups ${groups.size} · EXECUTABLE ${census.executable.length}`
    + ` · NOT-EXECUTABLE ${census.notExecutable} (fewer than ${MIN_DRAWS} independent draws, or a one-variant pool)`);
  console.log(`    groups showing fewer than half the distinct texts the chance floor expects: ${census.findings.length}`);
  for (const row of census.findings.slice(0, 10)) {
    console.log(`      ${row.key.slice(0, 60).padEnd(60)} distinct ${row.distinct}`
      + ` of ${row.variants} · expected ${row.expectedDistinctBp} bp · draws ${row.draws} · towns ${row.towns}`);
  }
  const outAt = argv.indexOf('--out');
  if (outAt >= 0 && argv[outAt + 1]) {
    writeFileSync(argv[outAt + 1], `${JSON.stringify({
      corpus: {
        kind: 'VARIETY', configs: configCount, seeds, towns: run.towns, seconds: run.seconds,
      },
      duplicates: { ...duplicates, byPosition: duplicates.byPosition.slice(0, 50) },
      repeatCensus: {
        groups: groups.size,
        executable: census.executable.length,
        notExecutable: census.notExecutable,
        findings: census.findings.slice(0, 50),
      },
    }, null, 2)}\n`);
    console.log(`  wrote ${argv[outAt + 1]}`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('prose-duplicate-units.mjs')) await main();
