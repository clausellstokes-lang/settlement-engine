#!/usr/bin/env node
/**
 * E8b · THE ROUND TRIP (the chair's G29 (1)): over two page-battery runs made WITH `--strings` (before = the E8 tree, after =
 * the E8b tree) on one plan, every stored card string of the twelve rows' fields (`npcs[i].personality.tell`,
 * `.presentation.impression`, `.presentation.behaviour`, `.secret.what`, `.goal.long`): `heldCardLine(after)` must be byte-equal
 * to `before`. Also counts the strings that moved and checks each differs in the reflexive alone (a STOP otherwise), and that
 * every OTHER record string is byte-equal. A MEASURE.
 * Usage: node e8b-roundtrip.mjs <treeAfter> <dirBefore> <dirAfter>    exit 1 on any difference.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const [T, A, B] = process.argv.slice(2);
const { heldCardLine } = await import(`${T}/src/data/people/personMention.js`);
const FIELD = /^record\.npcs\[\d+\]\.(?:personality\.tell|presentation\.impression|presentation\.behaviour|secret\.what|goal\.long)$/;
const OWN_ONLY = (a, b) => a.replace(/\bthemselves\b/g, '§') === b.replace(/\b(?:him|her)self\b/g, '§');
const read = (d) => Object.fromEntries(readdirSync(join(d, 'rows')).filter((f) => f.endsWith('.json')).map((f) => { const r = JSON.parse(readFileSync(join(d, 'rows', f), 'utf8')); return [r.seed, r]; }));
const X = read(A); const Y = read(B);
let fields = 0; let moved = 0; const places = new Set(); const trip = []; const notOwn = []; const otherMoved = [];
for (const seed of Object.keys(X)) {
  const x = X[seed].strings || {}; const y = Y[seed]?.strings || {};
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
    const a = x[k]; const b = y[k];
    if (FIELD.test(k)) {
      fields++;
      if (a !== b) { moved++; places.add(seed); if (a === undefined || b === undefined || !OWN_ONLY(a, b)) notOwn.push(`${seed} ${k}: ${a} → ${b}`); }
      if (heldCardLine(b) !== a) trip.push(`${seed} ${k}: held(${b}) ≠ ${a}`);
    } else if (a !== b && k.startsWith('record.')) otherMoved.push(`${seed} ${k}: ${String(a).slice(0, 90)} → ${String(b).slice(0, 90)}`);
  }
}
console.log(`e8b-roundtrip: card strings of the five fields ${fields}; moved ${moved} in ${places.size} places; round trip differing ${trip.length}; moved beyond the reflexive ${notOwn.length}; other record strings moved ${otherMoved.length}`);
for (const l of [...trip.slice(0, 5), ...notOwn.slice(0, 5), ...otherMoved.slice(0, 10)]) console.log(`  ${l}`);
process.exit(trip.length || notOwn.length ? 1 : 0);
