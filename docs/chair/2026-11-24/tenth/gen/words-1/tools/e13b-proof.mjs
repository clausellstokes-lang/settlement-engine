#!/usr/bin/env node
/**
 * E13b PROOF (WORDS-1; the tenth chair's G39): two page-battery runs made WITH `--strings` (before = the E8b tree, after = the
 * E13b tree) on one plan. Reports: the strings moved (every one must be a card's `presentation.behaviour`, from a pair's first
 * line to another line of that pair; anything else moved is listed); per town and pair (the pair read from the BEFORE line,
 * which is the shipped draw's), the cards and the lines they hold after, and two cards sharing a line only where the pool is
 * exhausted (the residual, by pair size); a town with no doubled pair byte-equal in every string. A MEASURE.
 * Usage: node e13b-proof.mjs <treeAfter> <dirBefore> <dirAfter>    exit 1 on a fault.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const [T, A, B] = process.argv.slice(2);
const { DEALING_POOL_OF_FIRST_LINE } = await import(`${T}/src/data/people/dealingLines.js`);
const read = (d) => Object.fromEntries(readdirSync(join(d, 'rows')).filter((f) => f.endsWith('.json')).map((f) => { const r = JSON.parse(readFileSync(join(d, 'rows', f), 'utf8')); return [r.seed, r]; }));
const X = read(A); const Y = read(B);
const BEH = /^record\.npcs\[(\d+)\]\.presentation\.behaviour$/;
let moved = 0; const places = new Set(); const other = []; const wrongMove = []; const residual = {}; const early = []; let undoubled = 0; let undoubledMoved = 0;
for (const seed of Object.keys(X)) {
  const x = X[seed].strings || {}; const y = Y[seed]?.strings || {};
  /** @type {Map<string, Array<{ k: string, after: string }>>} */ const groups = new Map();
  for (const k of Object.keys(x)) { const m = BEH.exec(k); if (!m || !DEALING_POOL_OF_FIRST_LINE.has(x[k])) continue; const g = groups.get(x[k]) || []; g.push({ k, after: y[k] }); groups.set(x[k], g); }
  const doubled = [...groups.values()].some((g) => g.length > 1);
  let townMoved = false;
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
    if (x[k] === y[k]) continue;
    townMoved = true;
    if (BEH.test(k) && DEALING_POOL_OF_FIRST_LINE.has(x[k]) && DEALING_POOL_OF_FIRST_LINE.get(x[k]).includes(y[k])) { moved++; places.add(seed); }
    else if (BEH.test(k)) wrongMove.push(`${seed} ${k}: ${x[k]} → ${y[k]}`);
    else other.push(`${seed} ${k}: ${String(x[k]).slice(0, 80)} → ${String(y[k]).slice(0, 80)}`);
  }
  if (!doubled) { undoubled++; if (townMoved) undoubledMoved++; }
  for (const [first, cards] of groups) {
    const pool = DEALING_POOL_OF_FIRST_LINE.get(first); const held = new Set(cards.map((c) => c.after));
    if (held.size < Math.min(cards.length, pool.length)) early.push(`${seed}: ${cards.length} cards, pool ${pool.length}, held ${held.size}: ${first}`);
    if (!cards.some((c) => c.after === first)) early.push(`${seed}: no card keeps the first line: ${first}`);
    if (cards.length > pool.length) { const key = `${cards.length} cards on a pool of ${pool.length}`; residual[key] = (residual[key] || 0) + 1; }
  }
}
const resCards = Object.entries(residual).reduce((s, [k, n]) => { const m = /^(\d+) cards on a pool of (\d+)$/.exec(k); return s + n * (Number(m[1]) - Number(m[2])); }, 0);
console.log(`e13b-proof: births ${Object.keys(X).length}; behaviour strings moved ${moved} in ${places.size} places; moved wrongly ${wrongMove.length}; OTHER strings moved ${other.length}`);
console.log(`  two cards of one pair sharing a line while the pool allowed: ${early.length}; residual (pool exhausted): ${Object.entries(residual).map(([k, n]) => `${k}: ${n}`).join(', ') || 'none'} — ${resCards} cards repeat a line`);
console.log(`  towns with no doubled pair: ${undoubled}; of them with any string moved: ${undoubledMoved}`);
for (const l of [...wrongMove.slice(0, 5), ...other.slice(0, 10), ...early.slice(0, 5)]) console.log(`  ${l}`);
process.exit(wrongMove.length || other.length || early.length || undoubledMoved ? 1 : 0);
