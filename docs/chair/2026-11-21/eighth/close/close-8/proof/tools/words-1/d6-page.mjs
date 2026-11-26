#!/usr/bin/env node
/**
 * D6 (WORDS-1): a candidate wording's reach and one page read whole with it. A MEASURE on a base render made WITH `--views`
 * and `d6-measure.mjs`'s output; it changes nothing in any tree.
 * The wording is applied to every printed contender whose tie with the printed ruler is in the scope set: the card's label
 * ("Contender") and the roster row's marker ("Contests the seat").
 * Usage: node d6-page.mjs --render=<dir> --d6=<d6.json> --card="<label>" --row="<marker>" [--scope=N|W] [--first] [--seed=<seed>]
 *   prints the pages changed (by size) and, with --seed, that place's Power tab whole with the wording, changed lines marked ">>".
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (n, f) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : f; };
const RENDER = arg('render'); const D6 = arg('d6'); const CARD = arg('card'); const ROW = arg('row'); const SEED = arg('seed');
const SCOPE = arg('scope', 'N') === 'W' ? new Set(['dependent', 'symbiotic', 'subordinate']) : new Set(['dependent', 'symbiotic']);
const FIRST = process.argv.includes('--first');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

const rows = JSON.parse(readFileSync(D6, 'utf8'));
/** @param {any} r @returns {string[]} the contenders this wording re-labels */
const softened = (r) => r.contenders.filter((c, i) => (!FIRST || i === 0) && c.ties.some((t) => SCOPE.has(t))).map((c) => c.name);
/** @param {string[]} lines @param {string[]} names */
function apply(lines, names) {
  return lines.map((l, i) => {
    let s = String(l);
    for (const n of names) {
      if (s.startsWith(`Contender${n}`)) s = `${CARD}${s.slice('Contender'.length)}`;
      if (s.startsWith('Contests the seat') && String(lines[i - 1]) === n) s = `${ROW}${s.slice('Contests the seat'.length)}`;
    }
    return s;
  });
}
const by = {}; let all = 0; let unmatched = 0;
for (const r of rows) {
  const names = softened(r);
  if (!names.length) continue;
  const p = JSON.parse(readFileSync(join(RENDER, 'rows', `${r.seed}.json`), 'utf8')).printed['Systems/Power'];
  const after = apply(p, names);
  const moved = after.filter((s, i) => s !== String(p[i])).length;
  if (moved < 2 * names.length) unmatched++;
  if (moved) { by[r.size] = (by[r.size] || 0) + 1; all++; }
}
console.log(`card "${CARD}" · row "${ROW}" · scope ${[...SCOPE].join('+')}${FIRST ? ' · first contender only' : ' · every tied contender'}: pages changed ${all} [${SIZES.map((z) => by[z] || 0).join(' ')}]; places where a label was not found ${unmatched}`);
if (SEED) {
  const r = rows.find((x) => x.seed === SEED);
  const p = JSON.parse(readFileSync(join(RENDER, 'rows', `${SEED}.json`), 'utf8')).printed['Systems/Power'];
  const after = apply(p, softened(r));
  console.log(`\n${SEED}: ruler ${r.ruler}; contenders ${r.contenders.map((c) => `${c.name} [${c.ties.join(',') || 'no tie'}]`).join('; ')}\n`);
  after.forEach((s, i) => console.log(`${s !== String(p[i]) ? '>>' : '  '} ${s}`));
}
