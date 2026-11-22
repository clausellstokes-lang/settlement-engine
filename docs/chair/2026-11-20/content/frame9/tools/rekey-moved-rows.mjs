#!/usr/bin/env node
/**
 * frame9/tools/rekey-moved-rows.mjs — FRAME-9 · unit 1: SR1 moved six banked literals from
 * src/domain/crisis/crisisCast.js to src/data/crisis/stakeReasonLines.js (same text, same hash). Neither register's
 * door has a move mode, so the rows are re-keyed here BY HAND (the chair, 22:10 UTC 2026-11-20): each row named by its
 * hash is taken from the old file key and put under the new one, unchanged; every other row stays; nothing is added or
 * dropped. Each register is written in its door's own format (the classes door's `write`, the presumed-things door's
 * widened `write`). Run from the tree root: node <this> classes|widened
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FROM = 'src/domain/crisis/crisisCast.js';
const TO = 'src/data/crisis/stakeReasonLines.js';
const which = process.argv[2];
const SPEC = {
  classes: { path: 'tests/lint/presumptionClasses.register.json', key: 'rows', hashes: ['1b6ce4bda88a0124', 'e2d354fb58d85754', 'f752da5c98cfa973'] },
  widened: { path: 'tests/lint/presumedThings.widened.register.json', key: 'arm1', hashes: ['c9dfc07fb36b9cc3', '6362016ab7cd7eab', '735fba0c13964804'] },
}[which];
if (!SPEC) { console.error('usage: classes|widened'); process.exit(2); }
const reg = JSON.parse(readFileSync(SPEC.path, 'utf8'));
const rows = reg[SPEC.key];
const before = Object.values(rows).reduce((n, rs) => n + rs.length, 0);
const moved = (rows[FROM] || []).filter((r) => SPEC.hashes.includes(r[r.length - 1]));
if (moved.length !== SPEC.hashes.length) { console.error(`expected ${SPEC.hashes.length} rows under ${FROM}, found ${moved.length}`); process.exit(1); }
if ((rows[TO] || []).some((r) => SPEC.hashes.includes(r[r.length - 1]))) { console.error('already moved'); process.exit(1); }
rows[FROM] = rows[FROM].filter((r) => !moved.includes(r));
rows[TO] = [...(rows[TO] || []), ...moved];
const after = Object.values(rows).reduce((n, rs) => n + rs.length, 0);
if (after !== before) { console.error(`row count ${before} -> ${after}`); process.exit(1); }
if (which === 'classes') {
  // scripts/presumption-classes-door.mjs :: write, verbatim
  const out = {};
  for (const f of Object.keys(reg.rows).sort()) if (reg.rows[f].length) out[f] = [...reg.rows[f]].sort((a, b) => (a[0] + a[3] < b[0] + b[3] ? -1 : 1));
  reg.rows = out;
  const body = Object.keys(out).map((f) => `  ${JSON.stringify(f)}: [\n${out[f].map((r) => `   ${JSON.stringify(r)}`).join(',\n')}\n  ]`).join(',\n');
  const head = { ...reg }; delete head.rows;
  const headText = JSON.stringify(head, null, 1);
  writeFileSync(SPEC.path, `${headText.slice(0, -2)},\n "rows": {\n${body}\n }\n}\n`);
} else {
  // scripts/presumed-things-door.mjs :: write, verbatim
  const arm1 = {};
  for (const f of Object.keys(reg.arm1).sort()) if (reg.arm1[f].length) arm1[f] = reg.arm1[f];
  reg.arm1 = arm1;
  writeFileSync(SPEC.path, `${JSON.stringify(reg, null, 1)}\n`);
}
for (const r of moved) console.log(`moved\t${r[0]}\t${r[r.length - 1]}\t${JSON.stringify(r[2])}`);
console.log(`${SPEC.path}: ${before} rows before, ${after} after; ${moved.length} re-keyed ${FROM} -> ${TO}`);
