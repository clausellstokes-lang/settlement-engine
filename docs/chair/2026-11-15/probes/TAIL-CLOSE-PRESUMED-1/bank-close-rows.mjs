#!/usr/bin/env node
/**
 * TAIL-CLOSE-PRESUMED-1's HAND BANK (the chair's ruling PT1 of 2026-11-15, case (B)): writes into the widened register
 * the rows of ONE verdict of the measure (`measure-fresh-rows.mjs --out <json>`), under that verdict's `after-base:`
 * reason, in the register's own form (`bankRow`: thing, reason, the first 120 characters, the hash of the whole literal),
 * and only for a hit that is STILL fresh in the tree now (re-scanned) and whose whole literal did NOT stand at the base
 * (case (A) goes through the door) — unless --at-base: the hits whose whole literal stood at the base and for which NO
 * widening of the walker exists (the hand-back's table: 3 rows dropped by a shrink, 16 whose line or declaration the round
 * re-shaped; PT1 (A)'s last clause and (B)), banked by (B) in their own commit. Writes the file as the door writes it (`presumed-things-door.mjs :: write`).
 *
 * Usage (from the tree root): node docs/chair/2026-11-15/probes/TAIL-CLOSE-PRESUMED-1/bank-close-rows.mjs
 *   <measure.json> <close-true|close-unprinted|close-false> [--at-base] [--dry]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { REGISTER_REL, WIDENED_REGISTER_REL, bankRow, bankedKeys, hitKey, scanTree } from '../../../../../tests/lint/presumedThings.shared.mjs';

const ROOT = process.cwd();
const [measurePath, verdict] = process.argv.slice(2);
const dry = process.argv.includes('--dry');
const atBaseOnly = process.argv.includes('--at-base');
const reason = `after-base: ${verdict}`;
const reg = JSON.parse(readFileSync(join(ROOT, WIDENED_REGISTER_REL), 'utf8'));
const main = JSON.parse(readFileSync(join(ROOT, REGISTER_REL), 'utf8'));
if (!['close-true', 'close-unprinted', 'close-false'].includes(verdict) || !reg.reasons[reason]) {
  console.error(`needs a measure file and one of close-true | close-unprinted | close-false, whose reason the register names (${reason})`);
  process.exit(2);
}
const measure = JSON.parse(readFileSync(measurePath, 'utf8'));
const banked = new Set([...bankedKeys(main), ...bankedKeys(reg)]);
const freshNow = new Map(scanTree(ROOT).filter((h) => !banked.has(hitKey(h.file, h.thing, h.text))).map((h) => [hitKey(h.file, h.thing, h.text), h]));
const mine = measure.rows.filter((r) => r.verdict === verdict && (atBaseOnly ? r.wholeAtBase : !r.wholeAtBase));
const notFresh = mine.filter((r) => !freshNow.has(hitKey(r.file, r.thing, r.text)));
if (notFresh.length) { for (const r of notFresh) console.error(`NOT FRESH NOW (re-measure): ${hitKey(r.file, r.thing, r.text)}`); process.exit(1); }
for (const r of mine) {
  const h = freshNow.get(hitKey(r.file, r.thing, r.text));
  (reg.arm1[h.file] ||= []).push(bankRow(h, reason));
  console.log(`bank\t${hitKey(h.file, h.thing, h.text)}\t${JSON.stringify(h.text.slice(0, 100))}`);
}
if (!dry) {
  const arm1 = {};
  for (const f of Object.keys(reg.arm1).sort()) if (reg.arm1[f].length) arm1[f] = reg.arm1[f];
  reg.arm1 = arm1;
  writeFileSync(join(ROOT, WIDENED_REGISTER_REL), `${JSON.stringify(reg, null, 1)}\n`);
}
console.log(`${dry ? 'would bank' : 'banked'} ${mine.length} rows under '${reason}'`);
