#!/usr/bin/env node
/**
 * WORDS-2 · E4: "NO MARKET" SAID MORE THAN ONCE ON ONE PAGE. A MEASURE over a page battery's `--views` rows: every sentence
 * of every section that says the place has no market, classed by the line that wrote it (by its words), and the pages
 * where two such sentences stand, by the pair, by size, with seeds. Changes nothing.
 * Usage: node e4-nomarket.mjs <rows dir> [<rows dir> ...]
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CLASSES = [
  ['ECO-1 C4 v6', /There is no market at .* to hold whatever its/],
  ['ECO efficiency "held back by having no market"', /held back by having no market/],
  ['GEN-13 NO-MARKET v3', /No market or fair stands in/],
  ['GEN-13 NO-MARKET v4-v6 (siege)', /keeps no market or fair|did with no market of its own|which has no market to come to/],
  ['GEN-13 NO-MARKET v7', /keeps no market of any kind/],
  ['GEN-13 NO-MARKET v8', /no stall to take and no market day/],
  ['GEN-13 NO-MARKET v9', /keeps no market and no market day/],
  ['GEN-13 NO-MARKET v10', /There is no market at .* to gather its trade/],
  ['GEN-13 NO-MARKET v11', /keeps no market(?:,|\.)/],
  ['GEN-13 NO-MARKET v12', /has no market(?:,|\.)/],
  ['other', /no market/i],
];
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
for (const dir of process.argv.slice(2)) {
  const pairs = {}; let pagesAny = 0; let pagesTwo = 0; const n = { all: 0 }; const others = {};
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const r = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    n.all += 1;
    /** @type {Map<string, string>} class -> section */ const got = new Map();
    for (const [view, lines] of Object.entries(r.printed || {})) {
      if (!Array.isArray(lines) || view === 'World/History') continue;
      for (const line of lines) for (const s of String(line).split(/(?<=[.;!?])\s+/)) {
        if (!/no market/i.test(s)) continue;
        const cls = CLASSES.find(([, re]) => re.test(s))[0];
        if (cls === 'other') others[s.replace(/\b[A-Z][a-zà-ÿ'-]+\b/g, 'X').slice(0, 120)] = (others[s.replace(/\b[A-Z][a-zà-ÿ'-]+\b/g, 'X').slice(0, 120)] || 0) + 1;
        if (!got.has(cls)) got.set(cls, view);
      }
    }
    if (got.size) pagesAny += 1;
    if (got.size >= 2) pagesTwo += 1;
    const ks = [...got.keys()].sort();
    for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) {
      const k = `${ks[i]} [${got.get(ks[i])}]  +  ${ks[j]} [${got.get(ks[j])}]`;
      const e = (pairs[k] ||= { n: 0, by: {}, seeds: [] }); e.n += 1; e.by[r.size] = (e.by[r.size] || 0) + 1; if (e.seeds.length < 3) e.seeds.push(r.seed);
    }
  }
  console.log(`== ${dir}: pages ${n.all}; a no-market sentence on ${pagesAny}; two or more on ${pagesTwo}`);
  for (const [k, e] of Object.entries(pairs).sort((a, b) => b[1].n - a[1].n)) console.log(`${String(e.n).padStart(4)}  ${SIZES.map((z) => e.by[z] || 0).join('/')}  ${k}  (${e.seeds.join(' ')})`);
  for (const [k, c] of Object.entries(others).sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`  other x${c}: ${k}`);
}
