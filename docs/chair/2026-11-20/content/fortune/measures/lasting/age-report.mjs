#!/usr/bin/env node
// FORTUNE-7 unit 0(a): the p90 of history.age by size (nearest rank, index ceil(0.9*n)-1, as BANDS.md), per state file,
// beside E32's six ages; and whether the states' ages agree birth by birth. usage: node age-report.mjs A.jsonl C.jsonl
import { readFileSync } from 'node:fs';
const E32 = { thorp: 269, hamlet: 108, village: 225, town: 276, city: 441, metropolis: 731 };
const SIZES = Object.keys(E32);
const load = (f) => readFileSync(f, 'utf8').trim().split('\n').slice(1).map((l) => JSON.parse(l));
const states = process.argv.slice(2).map((f) => ({ f, rows: load(f) }));
for (const { f, rows } of states) {
  const errs = rows.filter((r) => r.error).length;
  const badFound = rows.filter((r) => r.age !== r.foundingAge).length;
  console.log(`## ${f}: ${rows.length} births, ${errs} errors, age != founding.age on ${badFound}`);
  console.log('| size | n | p90 | E32 | at or above p90 | min | max |');
  console.log('|---|---|---|---|---|---|---|');
  for (const s of SIZES) {
    const ages = rows.filter((r) => r.size === s && typeof r.age === 'number').map((r) => r.age).sort((a, b) => a - b);
    const p90 = ages[Math.ceil(0.9 * ages.length) - 1];
    console.log(`| ${s} | ${ages.length} | ${p90} | ${E32[s]}${p90 === E32[s] ? '' : ' DIFFERS'} | ${ages.filter((a) => a >= p90).length} | ${ages[0]} | ${ages.at(-1)} |`);
  }
}
if (states.length > 1) {
  const [a, ...rest] = states;
  for (const b of rest) {
    const m = new Map(b.rows.map((r) => [r.seed, r]));
    const diff = a.rows.filter((r) => m.get(r.seed)?.age !== r.age).length;
    console.log(`ages differing ${a.f} vs ${b.f}: ${diff} of ${a.rows.length}`);
  }
}
