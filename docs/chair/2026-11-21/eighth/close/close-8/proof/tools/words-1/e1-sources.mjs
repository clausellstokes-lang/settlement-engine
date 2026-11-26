#!/usr/bin/env node
/**
 * E1: the hits of `e1-measure.mjs --out` (gap 1) classed by SOURCE (read in the code; see HANDBACK / reports/E1.md), counted by
 * size, with three seeds and one sentence each. "one road's report against another's" is not a double possessive and is dropped.
 * Usage: node e1-sources.mjs <hits.tsv>
 */
import { readFileSync } from 'node:fs';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SOURCES = [
  ['power-name', /(Authority|Guild)['’]s$/],
  ['house-fill', /^lord['’]s (steward|reeve|appointee)['’]s$/],
  ['settlement-institution', /\s\p{Ll}+s['’]$/u],
  ['role-rung', /./],
];
const by = {};
for (const line of readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean)) {
  const [seed, size, view, sent, span] = line.split('\t');
  if (/another['’]s$/.test(span)) continue;
  const src = SOURCES.find(([, re]) => re.test(span))[0];
  const e = (by[src] ||= { n: 0, size: {}, places: new Set(), ex: [] });
  e.n++; e.size[size] = (e.size[size] || 0) + 1; e.places.add(seed);
  if (e.ex.length < 3 && !e.ex.some((x) => x.seed === seed)) e.ex.push({ seed, view, sent });
}
for (const [src, e] of Object.entries(by)) {
  console.log(`${src}: ${e.n} hits in ${e.places.size} places [${SIZES.map((z) => e.size[z] || 0).join(' ')}]`);
  for (const x of e.ex) console.log(`  ${x.seed} (${x.view}): ${x.sent.slice(0, 200)}`);
}
