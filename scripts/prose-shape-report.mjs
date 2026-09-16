/**
 * scripts/prose-shape-report.mjs — THE PASSAGE-SHAPE DISTRIBUTION TABLE (REWRITE car 8a-2;
 * the owner's ruling (c) of 2026-09-08 ~22:4x; SITTING §T.4 deferring the RULING to 8a's fold).
 *
 * WHY A TABLE AND NOT A RATE. The owner's ruling (c) is one sentence long and it is the whole
 * design of this script: "the sitting sees a DISTRIBUTION TABLE beside the duplicate-unit rate,
 * BECAUSE THE DUPLICATE RATE CAN FALL WHILE A NEW TIC FORMS". A variation mechanism that is
 * judged on one number can be gamed by that number. So every column below is a distribution,
 * and two of them are printed twice — MARGINAL and CONDITIONAL on the lawful set — because a
 * shape that dominates only because it is the only lawful one is not a tic, and a table that
 * could not tell those apart would convict the mechanism for doing its job.
 *
 *   node scripts/prose-shape-report.mjs                  the shipped corpus
 *   node scripts/prose-shape-report.mjs --corpus <file>  a corpus exported as JSON
 *   node scripts/prose-shape-report.mjs --json <file>    write the table as JSON too
 *
 * ⛔ WHAT THIS SCRIPT REPORTS AND WHAT IT DECIDES: NOTHING. Car 8a moves no reader-facing byte
 * and ships no second shape. `composeStateProse.js` is not a caller of `passageShapes.js` and
 * the shipped arrangement stays shape 1 until the sitting rules on this print. The script is
 * the evidence, not the act.
 *
 * READ-ONLY except the `--json` file it is asked for.
 */
import { writeFileSync } from 'node:fs';
import { readFileSync } from 'node:fs';

import {
  PASSAGE_SHAPES, arrangeUnderShape, drawPassageShape, lawfulPassageShapes,
} from '../src/domain/prose/passageShapes.js';
import { composedOrderOf } from '../src/domain/prose/composedWalker.js';
import { CONNECTIVES } from '../src/domain/display/stateProse/composeStateProse.js';
import { attachBearingPools, unitsOfPool } from './lib/prose-composed-units.mjs';

/** The six shipped state leaves, loaded live. */
async function shippedCorpus() {
  const names = ['economy', 'power', 'defense', 'warFaith', 'stressors', 'general'];
  /** @type {Record<string, object>} */
  const corpus = {};
  for (const name of names) {
    const mod = await import(`../src/data/dossierStateProse/${name}.generated.js`);
    Object.assign(corpus, Object.values(mod)[0]);
  }
  return corpus;
}

/** The seeds each unit's shape is drawn on. Fixed, so the table is a pin and not a sample. */
const SEEDS = Object.freeze(Array.from({ length: 64 }, (_, i) => `shape-report-${i}`));

/** @param {number} n @param {number} d */
const pct = (n, d) => (d === 0 ? '   n/a' : `${((n / d) * 100).toFixed(2)} %`);

/**
 * The whole table for one corpus.
 * @param {Record<string, object>} corpus
 * @returns {object}
 */
export function shapeReport(corpus) {
  const pools = attachBearingPools(corpus);
  // ⭐ READ FROM THE COMPOSER, WHICH SINCE REWRITE car 8a-11 IS THE LEAF ITSELF (SITTING §U
  // c-5). Until that cure the composer carried its own floor constant at 0 while the leaf
  // stood at three, so this line answered NO and the refusal printed below named "the leaf"
  // for a condition that was true only of the constant — 408 times on the taste corpus, in the
  // report the sitting reads when it rules on shape 3. One home now, and the answer is yes.
  const clauseJointsExist = (CONNECTIVES.consequence.clause || []).length > 0;
  /** @type {Record<string, number>} */
  const marginal = Object.fromEntries(PASSAGE_SHAPES.map((s) => [s, 0]));
  /** @type {Map<string, {n: number, drawn: Record<string, number>}>} */
  const conditional = new Map();
  /** @type {Record<string, number>} */
  const refusals = {};
  /** @type {Record<string, number>} */
  const relations = {};
  /** @type {Record<string, number>} */
  const constructions = {};
  /** @type {Record<string, number>} */
  const faces = {};
  const fixedTexts = new Set();
  const drawnTexts = new Set();
  let units = 0;
  let applicable = 0;
  let draws = 0;
  let fixedUnits = 0;
  let drawnUnits = 0;

  for (const { blockId, poolKey } of pools) {
    for (const unit of unitsOfPool(corpus, blockId, poolKey)) {
      units += 1;
      const modifier = unit.pieces[1];
      relations[modifier.relation] = (relations[modifier.relation] || 0) + 1;
      constructions[composedOrderOf(unit).id] = (constructions[composedOrderOf(unit).id] || 0) + 1;
      faces[`${unit.blockId} :: ${unit.modifierKey}`] = (faces[`${unit.blockId} :: ${unit.modifierKey}`] || 0) + 1;
      const verdict = lawfulPassageShapes(unit, {
        spineText: unit.spineText,
        modifierText: unit.modifierText,
        jointPhrase: '',
        clauseJointsExist,
      });
      for (const row of verdict.refused) {
        const key = `${row.shape} :: ${row.why}`;
        refusals[key] = (refusals[key] || 0) + 1;
      }
      if (!verdict.applicable) continue;
      applicable += 1;
      const setKey = verdict.lawful.join('+') || '(none lawful)';
      const seat = conditional.get(setKey)
        || { n: 0, drawn: Object.fromEntries(PASSAGE_SHAPES.map((s) => [s, 0])) };
      // THE DUPLICATE-UNIT RATE PER SHAPE POLICY, which is the pair ruling (c) asks for: the
      // FIXED policy is what ships (shape 1 always), the LICENSED-DRAW policy is what the
      // fourth draw would produce. Both over the same units and the same seeds, or the
      // comparison is between two populations rather than between two policies.
      for (const seed of SEEDS) {
        draws += 1;
        seat.n += 1;
        const shape = drawPassageShape(verdict.lawful, unit.blockId, unit.poolKey, seed);
        seat.drawn[shape] += 1;
        marginal[shape] += 1;
        fixedUnits += 1;
        drawnUnits += 1;
        fixedTexts.add(arrangeUnderShape('spine-then-sentence', unit));
        drawnTexts.add(arrangeUnderShape(shape, unit));
      }
      conditional.set(setKey, seat);
    }
  }
  return {
    poolsWithAttach: pools.length,
    units,
    applicable,
    draws,
    clauseJointsExist,
    clauseJoints: (CONNECTIVES.consequence.clause || []).length,
    marginal,
    conditional: [...conditional].map(([lawfulSet, seat]) => ({ lawfulSet, ...seat })),
    refusals,
    relations,
    constructions,
    faceBearingPools: Object.keys(faces).length,
    duplicateUnitRateBp: {
      fixed: fixedUnits === 0 ? null : Math.round(((fixedUnits - fixedTexts.size) * 10000) / fixedUnits),
      licensedDraw: drawnUnits === 0 ? null : Math.round(((drawnUnits - drawnTexts.size) * 10000) / drawnUnits),
    },
  };
}

/** @param {object} r */
function print(r) {
  const lines = [];
  lines.push('PASSAGE-SHAPE DISTRIBUTION (REWRITE car 8a-2; owner ruling (c) of 2026-09-08)');
  lines.push(`  attach-bearing pools ${r.poolsWithAttach} · composable units ${r.units}`
    + ` · units WITH a shape question ${r.applicable} · draws ${r.draws}`);
  lines.push(`  consequence.clause joints exist: ${r.clauseJointsExist
    ? `yes, ${r.clauseJoints} of them — shape 3 waits on a CLAUSE SEAT, not on a joint`
    : 'NO — shape 3 is WITHHELD for want of a joint'}`);
  if (r.units === 0) {
    lines.push('');
    lines.push('  ⛔ THE TABLE IS EMPTY, AND THE EMPTINESS IS THE MEASUREMENT.');
    lines.push('     Not one pool of this corpus carries a non-empty `attach` set, so not one');
    lines.push('     composed unit has a modifier, so not one unit has a shape question. This is');
    lines.push('     not a defect and it is not a gap in this script: the SHIFT REGISTER pins');
    lines.push('     `attach-set` at 0 with the idiom "EMPTY on every pool at this tip, BY');
    lines.push('     CONSTRUCTION: every shipped pool is a spine and a spine\'s attach set is');
    lines.push('     empty". The composed-prose model is wired and DARK.');
    lines.push('     The shape distribution therefore cannot be ruled on at 8a and the sitting');
    lines.push('     reads it when a desk section lands attach rows (8b, the defense section).');
    lines.push('     Run this script with --corpus over such a corpus to get the full table.');
    return lines;
  }
  lines.push('');
  lines.push('  MARGINAL (every draw, over every unit that had a shape question)');
  for (const shape of PASSAGE_SHAPES) {
    lines.push(`    ${shape.padEnd(20)} ${String(r.marginal[shape]).padStart(8)}  ${pct(r.marginal[shape], r.draws)}`);
  }
  lines.push('');
  lines.push('  CONDITIONAL on the lawful set — a shape that dominates only because it is the');
  lines.push('  only lawful one is NOT a tic, and this is the column that says which it is');
  for (const row of r.conditional) {
    lines.push(`    lawful = ${row.lawfulSet}  (n ${row.n})`);
    for (const shape of PASSAGE_SHAPES) {
      if (row.drawn[shape] === 0) continue;
      lines.push(`        ${shape.padEnd(20)} ${String(row.drawn[shape]).padStart(8)}  ${pct(row.drawn[shape], row.n)}`);
    }
  }
  lines.push('');
  lines.push('  DUPLICATE-UNIT RATE per shape policy, in basis points (ruling (c)\'s pairing)');
  lines.push(`    fixed (shape 1 always, what ships)  ${r.duplicateUnitRateBp.fixed}`);
  lines.push(`    the licensed draw                   ${r.duplicateUnitRateBp.licensedDraw}`);
  lines.push('');
  lines.push('  RELATION distribution over the units');
  for (const [k, n] of Object.entries(r.relations).sort((a, b) => b[1] - a[1])) {
    lines.push(`    ${k.padEnd(20)} ${String(n).padStart(8)}  ${pct(n, r.units)}`);
  }
  lines.push('');
  lines.push('  CONSTRUCTION distribution via composedOrderIdOf (the move-order classifier as');
  lines.push('  the proxy for dominant sentence constructions, ruling (c))');
  for (const [k, n] of Object.entries(r.constructions).sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    lines.push(`    ${k.padEnd(28)} ${String(n).padStart(8)}  ${pct(n, r.units)}`);
  }
  lines.push('');
  lines.push('  REFUSALS, with their reasons — the licence half of "licensed, never rescued"');
  for (const [k, n] of Object.entries(r.refusals).sort((a, b) => b[1] - a[1])) {
    lines.push(`    ${String(n).padStart(8)}  ${k}`);
  }
  return lines;
}

/**
 * ⛔ THE COLUMNS RULING (c) ASKS FOR THAT THIS CAR CANNOT SUPPLY, NAMED RATHER THAN OMITTED.
 * A table that quietly lacks a column the owner asked for is a table that has answered a
 * different question. Each is owed to a named car of this same train.
 */
const OWED = Object.freeze([
  ['the THREAD verdicts', 'car 8a item 4 — `armThread` is chartered REPORTED until 8b\'s first batch'],
  ['the BAND figures at the corrected grain', 'car 8a item 5 — the gate (scripts/prose-wave-gate.mjs) carries the two grains and this report does not: the THIRTEEN text-level metrics are a property of a pool\'s RENDERED CORPUS and the EIGHT word-level ones of the face, so a band column here would need a corpus this table is not handed. The old line said the band position is a CONSTANT at the face grain; car 8a-5 refuted that by execution — two faces of one lexicon read 0 exceeded / mean 0.259 alike, and the same face carrying an em dash reads 1 exceeded / 0.125 / mean 1.410, so the face grain MOVES on lexicon and the corpus grain on length'],
  ['the read-aloud assessment', 'the sitting\'s own act, on the strings this table prints'],
  ['the claim/wiring census (A0b) after variation', 'car 8a item 5, which lands the gate that carries A0b over a section'],
]);

async function main() {
  const argv = process.argv.slice(2);
  const corpusAt = argv.indexOf('--corpus');
  const jsonAt = argv.indexOf('--json');
  const corpus = corpusAt >= 0 && argv[corpusAt + 1]
    ? JSON.parse(readFileSync(argv[corpusAt + 1], 'utf8'))
    : await shippedCorpus();
  const report = shapeReport(corpus);
  for (const line of print(report)) console.log(line);
  console.log('');
  console.log('  OWED to a named car, never silently omitted:');
  for (const [what, why] of OWED) console.log(`    ${what}\n        ${why}`);
  if (jsonAt >= 0 && argv[jsonAt + 1]) {
    writeFileSync(argv[jsonAt + 1], `${JSON.stringify(report, null, 1)}\n`);
    console.log(`\n  wrote ${argv[jsonAt + 1]}`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('prose-shape-report.mjs')) await main();
