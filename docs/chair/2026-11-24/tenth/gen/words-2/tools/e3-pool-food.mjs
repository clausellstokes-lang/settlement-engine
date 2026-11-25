#!/usr/bin/env node
/**
 * WORDS-2 · E3, RULING G13 (3): THE POOL THE OVERVIEW FALLS TO. For every birth whose stored tension line
 * (`pressureSentence`) is a line of the small-place subsistence pool (`generators/narrativeGenerator.js ::
 * generatePressureSentence`'s `thorpPressures`), the line is classed, and the food word the page prints
 * (`domain/display/foodWordShown.js :: foodWordShown`) is read beside it. Counted: the pages that print a thin-harvest or a
 * late-frost line beside a food word of Secure or better. Also every pool line's count by size. A MEASURE.
 * Usage: node e3-pool-food.mjs [--tree=<dir>] <records dir> [...]
 */
import { readdirSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const treeArg = process.argv.find((a) => a.startsWith('--tree='));
const TREE = treeArg ? treeArg.slice(7) : '/home/user/wt/base';
const { foodWordShown } = await import(pathToFileURL(join(TREE, 'src/domain/display/foodWordShown.js')).href);
/** The pool's lines, by a word of each (the pool as written at 0ec96f13d8). */
const POOL = [
  ['grazing', /^A dispute over grazing rights and water access has been running/],
  ['thin harvest', /^The harvest was thin this year/],
  ['family moved', /^A family moved away last spring/],
  ['shared fields', /^The question of who tends the shared fields/],
  ['boundary feud', /^Two families have been in a quiet feud over a boundary marker/],
  ['late frost', /^The last frost came late and damaged the seedstock/],
  ['stranger', /^A stranger passed through a month ago/],
];
const FOOD_TALK = new Set(['thin harvest', 'late frost']);
const GOOD = new Set(['Secure', 'Surplus', 'Abundant']);
for (const dir of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
  const lines = {}; const words = {}; const against = []; let n = 0;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json.gz')).sort()) {
    const { seed, size, record: s } = JSON.parse(gunzipSync(readFileSync(join(dir, f))).toString());
    const p = String(s?.pressureSentence ?? '');
    const hit = POOL.find(([, re]) => re.test(p));
    if (!hit) continue;
    n++;
    const k = `${size}:${hit[0]}`; lines[k] = (lines[k] || 0) + 1;
    if (!FOOD_TALK.has(hit[0])) continue;
    const w = foodWordShown(s)?.label ?? '(none)';
    words[w] = (words[w] || 0) + 1;
    if (GOOD.has(w)) against.push(`${seed}:${hit[0]}:${w}`);
  }
  console.log(`== ${dir.split('/').pop()}: ${n} births print a subsistence-pool line`);
  console.log('  by size and line:', JSON.stringify(lines));
  console.log('  food word beside a thin-harvest or late-frost line:', JSON.stringify(words));
  console.log(`  AGAINST (Secure or better): ${against.length}${against.length ? ` e.g. ${against.slice(0, 6).join(' ')}` : ''}`);
}
