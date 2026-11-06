#!/usr/bin/env node
/**
 * scripts/audit/witness-stage.mjs — THE PRESET LIGHTING WITNESS RE-MEASURED AT ANY TREE, ITS NEXT BYTES PRODUCED.
 *
 * The witness has no capture arm (its register note). Its rows are measured by the suite's own module,
 * tests/simulation/presetLightingWitnessRun.js :: measureWitness, imported FROM THE NAMED TREE; this script keeps the
 * fixture's every other field, replaces `rows` with the live measurement and `distinctWorldStateHashes` with its
 * live count, and writes the bytes to a SCRATCH path (never the tree). It first proves the committed fixture
 * re-serializes to its own bytes, so the produced bytes differ only where the measurement moved. The bytes reach the
 * tree only through scripts/audit/door-write.mjs and the signed door.
 *
 *   node scripts/audit/witness-stage.mjs <tree> --out <scratch.json>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const tree = args[0];
const outAt = args.indexOf('--out');
const out = outAt === -1 ? null : args[outAt + 1];
if (!tree || !out) { console.error('usage: witness-stage.mjs <tree> --out <scratch.json>'); process.exit(2); }
if (/tests[\\/]/.test(resolve(out))) { console.error('refused: --out must be a scratch path'); process.exit(2); }

const root = resolve(tree);
const fixturePath = `${root}/tests/fixtures/preset-lighting-witness-golden.json`;
const committed = readFileSync(fixturePath, 'utf8');
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const fixture = JSON.parse(committed);
if (serialize(fixture) !== committed) { console.error('refused: the fixture does not re-serialize to its own bytes'); process.exit(1); }

const { measureWitness } = await import(pathToFileURL(`${root}/tests/simulation/presetLightingWitnessRun.js`).href);
const live = await measureWitness();
const liveRows = Array.isArray(live) ? live : live.rows;
const known = new Set(Object.keys(fixture.rows[0] ?? {}));
for (const row of liveRows) {
  for (const key of Object.keys(row)) {
    if (!known.has(key)) { console.error(`refused: the live row carries a new field '${key}'`); process.exit(1); }
  }
}
const moved = liveRows.filter((row, i) => JSON.stringify(row) !== JSON.stringify(fixture.rows[i])).map((row) => row.row);
fixture.rows = liveRows;
fixture.distinctWorldStateHashes = new Set(liveRows.map((row) => row.worldStateSha256)).size;
writeFileSync(out, serialize(fixture), 'utf8');
console.log(JSON.stringify({ tree: root, rows: liveRows.length, moved }));
