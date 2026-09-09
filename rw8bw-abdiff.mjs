/**
 * REWRITE car 8b-W — the A/B differ (lane instrument, never committed).
 *   node rw8bw-abdiff.mjs before.json after.json
 * Prints, per corpus, how many ROWS differ and the first few that do.
 */
import { readFileSync } from 'node:fs';

const a = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const b = JSON.parse(readFileSync(process.argv[3], 'utf8'));

/** @param {string} name @param {string[]} x @param {string[]} y */
function diffLines(name, x, y) {
  const n = Math.max(x.length, y.length);
  const bad = [];
  for (let i = 0; i < n; i += 1) if (x[i] !== y[i]) bad.push(`${x[i]}   =>   ${y[i]}`);
  console.log(`FINAL A/B — ${name} rows differing ${bad.length} of ${n}`);
  for (const line of bad.slice(0, 12)) console.log(`    ${line}`);
}

/** @param {string} name @param {Array<string[]>} x @param {Array<string[]>} y @param {number} col */
function diffRows(name, x, y, col) {
  const map = new Map(y.map((r) => [r[0], r]));
  const bad = [];
  for (const row of x) {
    const other = map.get(row[0]);
    if (!other || other[col] !== row[col]) bad.push(`${row[0]}\n      ${row[col]}\n      ${other ? other[col] : '(missing)'}`);
  }
  console.log(`FINAL A/B — ${name} rows differing ${bad.length} of ${x.length}`);
  for (const line of bad.slice(0, 6)) console.log(`    ${line}`);
}

diffLines('exhaustive', a.exhaustive, b.exhaustive);
diffRows('RATE keys', a.rate, b.rate, 2);
diffRows('RATE desk-output', a.rate, b.rate, 3);
diffRows('DRIFT keys', a.drift, b.drift, 2);
diffRows('DRIFT desk-output', a.drift, b.drift, 3);
