#!/usr/bin/env node
/**
 * TAIL-CLOSE-PRESUMED-1's CORRECTION: the first measure missed a multi-sentence literal's sentences (its one fragment spans
 * them, so no sentence "held" it, and the line could never read as against its thing). Re-measured with the fix
 * (`measure-fresh-rows.mjs --rows`), each row this seat banked under an `after-base: close-*` reason whose verdict changed
 * has its reason moved to the corrected one, in place (thing, label and hash untouched). Never adds or drops a row.
 * Prints each move. Usage (from the tree root): node docs/chair/2026-11-15/probes/TAIL-CLOSE-PRESUMED-1/rebank-verdicts.mjs
 *   <remeasure.json> [--dry]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { WIDENED_REGISTER_REL, literalHash } from '../../../../../tests/lint/presumedThings.shared.mjs';

const ROOT = process.cwd();
const [path] = process.argv.slice(2);
const dry = process.argv.includes('--dry');
const reg = JSON.parse(readFileSync(join(ROOT, WIDENED_REGISTER_REL), 'utf8'));
const m = JSON.parse(readFileSync(path, 'utf8'));
const verdictOf = new Map(m.rows.map((r) => [`${r.file}\t${r.thing}\t${literalHash(r.text)}`, r.verdict]));
const before = Object.values(reg.arm1).reduce((n, rows) => n + rows.length, 0);
let moved = 0;
for (const [file, rows] of Object.entries(reg.arm1)) {
  for (const row of rows) {
    if (!/^after-base: close-(?:true|unprinted|false)$/.test(row[1]) || typeof row[3] !== 'string') continue;
    const v = verdictOf.get(`${file}\t${row[0]}\t${row[3]}`);
    if (!v || `after-base: ${v}` === row[1]) continue;
    console.log(`move\t${file}\t${row[0]}\t${row[3]}\t${row[1]} -> after-base: ${v}\t${JSON.stringify(String(row[2]).slice(0, 80))}`);
    row[1] = `after-base: ${v}`; moved += 1;
  }
}
const after = Object.values(reg.arm1).reduce((n, rows) => n + rows.length, 0);
if (before !== after) { console.error(`REFUSED: rows ${before} != ${after}`); process.exit(1); }
if (!dry) writeFileSync(join(ROOT, WIDENED_REGISTER_REL), `${JSON.stringify(reg, null, 1)}\n`);
console.log(`${dry ? 'would move' : 'moved'} ${moved} rows`);
