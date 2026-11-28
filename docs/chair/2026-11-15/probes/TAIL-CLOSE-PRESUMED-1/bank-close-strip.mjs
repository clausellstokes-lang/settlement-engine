#!/usr/bin/env node
/**
 * TAIL-CLOSE-PRESUMED-1's HAND BANK OF ONE STRIP (the chair's ruling PT2 of 2026-11-15): adds the widened register's
 * reason `after-base: close-strip` (the chair's text) and the fresh strip rows of ONE file under it, in the register's own
 * form ([file, receiver, reason], the receiver exactly as `stripTree` keys it), sorted and written as the door writes them.
 * Usage (from the tree root): node docs/chair/2026-11-15/probes/TAIL-CLOSE-PRESUMED-1/bank-close-strip.mjs <file>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { WIDENED_REGISTER_REL, stripKey, stripTree } from '../../../../../tests/lint/presumedThings.shared.mjs';

const ROOT = process.cwd();
const file = process.argv[2];
const REASON = 'after-base: close-strip';
const TEXT = 'a strip site the round of 2026-11-14/15 wrote after the instrument\'s base: the pool passes the declared filter first and its lines are unwrapped only to be printed (not a draw); banked BY HAND under the chair\'s ruling PT2 of 2026-11-15, against the letter of the door\'s base rule, as record 405\'s row; owed after the release: the site reads the door\'s own text field and the row leaves';
const reg = JSON.parse(readFileSync(join(ROOT, WIDENED_REGISTER_REL), 'utf8'));
reg.reasons[REASON] = TEXT;
const banked = new Set((reg.strips || []).map((r) => stripKey(r[0], r[1])));
const mine = stripTree(ROOT).filter((x) => x.file === file && !banked.has(stripKey(x.file, x.receiver)));
if (!mine.length) { console.error(`no fresh strip in ${file}`); process.exit(1); }
for (const x of mine) { reg.strips.push([x.file, x.receiver, REASON]); console.log(`bank strip\t${stripKey(x.file, x.receiver)}`); }
reg.strips.sort((p, q) => stripKey(p[0], p[1]).localeCompare(stripKey(q[0], q[1])));
writeFileSync(join(ROOT, WIDENED_REGISTER_REL), `${JSON.stringify(reg, null, 1)}\n`);
console.log(`banked ${mine.length} strip sites of ${file} under '${REASON}'`);
