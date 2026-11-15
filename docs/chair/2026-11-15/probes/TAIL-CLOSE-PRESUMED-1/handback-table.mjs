#!/usr/bin/env node
/**
 * TAIL-CLOSE-PRESUMED-1's TABLE: the hand-back's per-row table, written from one or more measure files
 * (`measure-fresh-rows.mjs --out <json>`), in the order given. Prints Markdown to stdout.
 *
 * Usage: node docs/chair/2026-11-15/probes/TAIL-CLOSE-PRESUMED-1/handback-table.mjs <measure.json>... [--dropped <hash,hash,...>]
 */
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const dropped = new Set((args.includes('--dropped') ? args[args.indexOf('--dropped') + 1] : '').split(',').filter(Boolean));
const files = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--dropped');
const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const reading = (r) => {
  if (r.thing.startsWith('house: ')) return 'the record: the live roster or a power, by the house\'s stem';
  if (r.thing.startsWith('resource: ')) return 'the record: config.nearbyResources less the depleted';
  return `the word's reader: ${r.leaf}`.slice(0, 90);
};
for (const f of files) {
  const m = JSON.parse(readFileSync(f, 'utf8'));
  console.log(`\nMeasured at \`${m.measuredAt.slice(0, 9)}\` over ${m.births} births (base for "stood at": \`${m.base}\`).\n`);
  console.log('| # | file | thing | side | the line\'s first words | case | printed in | against in | towns against (first three) | reading | reason |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|');
  m.rows.forEach((r, i) => {
    const kase = r.wholeAtBase ? (dropped.has(r.hash) ? 'B (stood at master; its row dropped by a shrink)' : 'B (stood at master; no widening: the round re-shaped the line or its declaration)') : 'B (the round wrote or reworded it)';
    console.log(`| ${i + 1} | ${cell(r.file.replace(/^src\//, ''))} | ${cell(r.thing)} | ${r.side} | ${cell(JSON.stringify(r.text.slice(0, 60)))} | ${kase} | ${r.printed} | ${r.againstN} | ${cell(r.againstSeeds.join(', '))} | ${cell(reading(r))} | after-base: ${r.verdict} |`);
  });
}
