#!/usr/bin/env node
/**
 * scripts/audit/shift-rows.mjs — THE DATED ROWS A SIGNED RE-RECORD OWES ITS SUITES, WRITTEN IN A STAGE.
 *
 * Two suites carry a row per re-record beside the bytes the door writes:
 *   --golden   tests/property/generatorGoldenMaster.test.js's SHIFT RECORD header ("Re-recording without adding a row is
 *              a deleted alarm"): the newest row goes on top, in LANDING-3's form.
 *   --herald   tests/property/heraldKnowledgeDeskGolden.test.js's item-count pin: the length re-keyed to the manifest's
 *              measured key count, with its dated history line.
 * It reads the produced bytes from the tree (after the door wrote them) and adds no authority.
 *
 *   node scripts/audit/shift-rows.mjs <tree> --golden --label <L> --record <rel> --n <n> --step <sha9> --moved "<text>"
 *       --cause "<the cause after the label>" --from <sha8> --to <sha8>
 *   node scripts/audit/shift-rows.mjs <tree> --herald --label <L> --record <rel> --because "<clause>"
 */
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const tree = args[0];
const flag = (name) => { const i = args.indexOf(name); return i === -1 ? null : args[i + 1]; };
const label = flag('--label');
const record = flag('--record');

if (args.includes('--golden')) {
  const path = `${tree}/tests/property/generatorGoldenMaster.test.js`;
  const text = readFileSync(path, 'utf8');
  const anchor = ' * A hash manifest cannot show WHY it moved, so every re-record is written down\n * here. Re-recording without adding a row is a deleted alarm.\n *\n';
  if (text.split(anchor).length !== 2) { console.error('refused: the SHIFT RECORD anchor does not occur once'); process.exit(1); }
  const row = [
    ` * 2026-11-04 — ${label.toUpperCase()}, THROUGH THE SIGNED DOOR (ODQ §934.105, RUNG 1 OF THE SOAK LADDER;`,
    ` *   record ${record}; the cloud chair signs under the owner's delegation, vetoable).`,
    ` *   ${flag('--moved')}. THE CAUSE, ONE (first-parent`,
    ` *   step ${flag('--step')}): ${flag('--cause')}. ATTRIBUTION, ZERO RESIDUE BY`,
    ` *   CONSTRUCTION: written from the staged tree S${flag('--n')} (the tree of ${flag('--step')} with the door paths carried from`,
    ` *   the branch, the previous record's writes committed). ${flag('--from')}.. -> ${flag('--to')}..`,
    ' *',
  ].join('\n');
  writeFileSync(path, text.replace(anchor, `${anchor}${row}\n`), 'utf8');
  console.log('golden row written');
} else if (args.includes('--herald')) {
  const path = `${tree}/tests/property/heraldKnowledgeDeskGolden.test.js`;
  const text = readFileSync(path, 'utf8');
  const rows = Object.keys(JSON.parse(readFileSync(`${tree}/tests/fixtures/herald-knowledge-desk-golden.json`, 'utf8'))).length;
  const re = /(\n)( {4}expect\(Object\.keys\(manifest\)\)\.toHaveLength\()(\d+)(\);)/;
  const m = text.match(re);
  if (!m) { console.error('refused: the length pin is not found'); process.exit(1); }
  const from = Number(m[3]);
  if (from === rows) { console.log(`herald length stays ${rows}`); process.exit(0); }
  const delta = rows > from ? `${rows - from} more items` : `${from - rows} fewer items`;
  const line = `    // ${from} → ${rows} at ${label.toUpperCase()} (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record ${record}): ${flag('--because')}`
    + `\n    // ${delta} (${from} → ${rows}).`;
  writeFileSync(path, text.replace(re, `$1${line}\n$2${rows}$4`), 'utf8');
  console.log(`herald length ${from} -> ${rows}`);
} else {
  console.error('usage: shift-rows.mjs <tree> --golden|--herald ...');
  process.exit(2);
}
