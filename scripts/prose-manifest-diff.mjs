/**
 * scripts/prose-manifest-diff.mjs — THE CLASSIFIER (ARCH §3.7).
 *
 * WHAT IT ANSWERS. The DRIFT fixture can say a ROW moved and nothing else, which is the
 * generator golden master's own shape and the reason ARCH asks for a second instrument. This
 * script takes two per-cell tables — the same command run at two shas — and says, for every
 * one of ~52,500 cells, WHICH KIND of movement happened:
 *
 *   UNCHANGED     the cell reads the same variant, the same wording, the same pieces
 *   WORDING-ONLY  same pool, same variant (`vid`), the TEXT moved
 *   ADDITIVE      a piece was added beside a spine that did not move
 *   RE-INDEXED    same pool, a DIFFERENT variant was drawn
 *   REPLACED      a different pool, or a turn arrived or left
 *   ADDED/REMOVED the cell exists on one side only
 *
 * ⛔ WHY THE ORDER OF THE TESTS IS THE SPECIFICATION. A cell whose pool changed also has a
 * different text and usually a different vid; classifying it as WORDING-ONLY would let a
 * signed car report "only wording moved" about a cell that now speaks a different fact. So
 * the strongest claim is tested first and the weakest last, and each verdict is the FIRST one
 * that fits — never a set.
 *
 * ⚠ AN INDEX-ONLY MOVE READS AS UNCHANGED, AND IS COUNTED SEPARATELY. `index` is the drawn
 * variant's position within the AUDIENCE-FILTERED pool; it can move while `vid` does not (a
 * `dm-only` variant added earlier in the pool shifts it). No reader sees that, so it is not a
 * class of change — but it does move the per-row roll-up sha, so the count is PRINTED, or a
 * reader of a red drift arm would have a class table that explains nothing.
 *
 * READ-ONLY. Writes no file; prints and exits.
 */
import { readFileSync } from 'node:fs';

/** The verdicts, in the order they are tested. The order IS the specification. */
export const VERDICTS = Object.freeze([
  'REPLACED', 'RE-INDEXED', 'ADDITIVE', 'WORDING-ONLY', 'UNCHANGED',
]);

/** @param {ReadonlyArray<object>} pieces @returns {boolean} */
const hasTurn = (pieces) => (pieces || []).some((p) => p && p.role === 'turn');

/**
 * The spine piece of a unit, which is the piece every other piece is added BESIDE.
 * @param {ReadonlyArray<object>} pieces
 * @returns {object|null}
 */
const spineOf = (pieces) => (pieces || []).find((p) => p && p.role === 'spine') || null;

/**
 * ONE CELL, CLASSIFIED. Pure, and the whole rule set is here rather than spread over the
 * caller: a classifier whose rules live in its caller cannot be driven by a fixture.
 * @param {object} base
 * @param {object} tip
 * @returns {string}
 */
export function classifyCell(base, tip) {
  if (base.pool !== tip.pool) return 'REPLACED';
  if (hasTurn(base.pieces) !== hasTurn(tip.pieces)) return 'REPLACED';
  if (base.vid !== tip.vid) return 'RE-INDEXED';
  const baseSpine = spineOf(base.pieces);
  const tipSpine = spineOf(tip.pieces);
  const spineHeld = JSON.stringify(baseSpine) === JSON.stringify(tipSpine);
  // ⛔ ADDITIVE DOES NOT REQUIRE THE TEXT TO HOLD, AND REQUIRING IT MADE THE VERDICT
  // UNREACHABLE (the MEASURE fold's M-2/R9, cure 5). A modifier added beside a spine adds
  // WORDS, so the cell's single `textSha` necessarily moves; the conjunct `base.textSha ===
  // tip.textSha` therefore admitted only a state the cell shape cannot produce — a piece
  // added that changed nothing a reader can see. Driven before the cure: a real addition read
  // ADDITIVE 0 / WORDING-ONLY 1. ARCH §12 accepts the taste (car 6) and the AUTHORING wave
  // (car 9) on "every affected cell ADDITIVE", so the criterion those cars are signed against
  // could not be met by any car that actually added a piece.
  //
  // WHAT ADDITIVE MEANS NOW: the unit grew a piece and the SPINE did not move — same pool,
  // same variant, same drawn index, same face. That is exactly "a piece added beside an
  // unchanged spine", and the ORDER above still keeps it honest: a cell whose pool or variant
  // moved is REPLACED or RE-INDEXED before this line is ever read.
  if ((tip.pieces || []).length > (base.pieces || []).length && spineHeld) return 'ADDITIVE';
  if (base.textSha !== tip.textSha) return 'WORDING-ONLY';
  return 'UNCHANGED';
}

/** @param {string} cell @returns {string} the town key a cell belongs to */
export const townOfCell = (cell) => String(cell).split('::')[0];

/**
 * THE WHOLE DIFF: per class, the cells and the towns; plus the two roster classes and the
 * index-only count.
 * @param {ReadonlyArray<object>} baseCells
 * @param {ReadonlyArray<object>} tipCells
 * @returns {{byClass: Map<string, {cells: string[], towns: Set<string>}>, indexOnly: number,
 *   added: string[], removed: string[], total: number}}
 */
export function classifyCells(baseCells, tipCells) {
  const base = new Map((baseCells || []).map((c) => [c.cell, c]));
  const tip = new Map((tipCells || []).map((c) => [c.cell, c]));
  /** @type {Map<string, {cells: string[], towns: Set<string>}>} */
  const byClass = new Map(VERDICTS.map((v) => [v, { cells: [], towns: new Set() }]));
  let indexOnly = 0;
  for (const [key, tipCell] of tip) {
    const baseCell = base.get(key);
    if (!baseCell) continue;
    const verdict = classifyCell(baseCell, tipCell);
    const seat = byClass.get(verdict);
    if (seat) { seat.cells.push(key); seat.towns.add(townOfCell(key)); }
    if (verdict === 'UNCHANGED' && baseCell.index !== tipCell.index) indexOnly += 1;
  }
  return {
    byClass,
    indexOnly,
    added: [...tip.keys()].filter((k) => !base.has(k)).sort(),
    removed: [...base.keys()].filter((k) => !tip.has(k)).sort(),
    total: tip.size,
  };
}

/**
 * The print. Every class with its count and its town count, the roster classes, and the
 * index-only figure beside them.
 * @param {ReturnType<classifyCells>} diff
 * @returns {string[]}
 */
export function diffLines(diff) {
  const lines = [
    `PROSE MANIFEST DIFF · ${diff.total} cells on the tip side`,
  ];
  for (const verdict of VERDICTS) {
    const seat = diff.byClass.get(verdict) || { cells: [], towns: new Set() };
    lines.push(`  ${verdict.padEnd(14)} cells ${String(seat.cells.length).padStart(7)}`
      + ` · towns ${String(seat.towns.size).padStart(5)}`);
  }
  lines.push(`  ADDED          cells ${String(diff.added.length).padStart(7)}`);
  lines.push(`  REMOVED        cells ${String(diff.removed.length).padStart(7)}`);
  lines.push(`  (of the UNCHANGED, cells whose audience-filtered INDEX moved with no reader-visible`
    + ` change: ${diff.indexOnly})`);
  return lines;
}

/** The entry point. */
function main() {
  const [basePath, tipPath] = process.argv.slice(2);
  if (!basePath || !tipPath) {
    throw new Error('usage: node scripts/prose-manifest-diff.mjs <base.json> <tip.json>');
  }
  const base = JSON.parse(readFileSync(basePath, 'utf8'));
  const tip = JSON.parse(readFileSync(tipPath, 'utf8'));
  const diff = classifyCells(base.cells || base, tip.cells || tip);
  for (const line of diffLines(diff)) console.log(line);
  // THE CELLS THEMSELVES, capped, because a class count with no example is a number a reader
  // cannot check. Every class prints its first ten and says how many it did not print.
  for (const verdict of VERDICTS) {
    const seat = diff.byClass.get(verdict);
    if (!seat || seat.cells.length === 0 || verdict === 'UNCHANGED') continue;
    console.log(`  ── ${verdict} ──`);
    for (const cell of seat.cells.slice(0, 10)) console.log(`    ${cell}`);
    if (seat.cells.length > 10) console.log(`    … and ${seat.cells.length - 10} more`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('prose-manifest-diff.mjs')) main();
