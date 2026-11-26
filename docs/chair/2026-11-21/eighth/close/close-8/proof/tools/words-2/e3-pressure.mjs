#!/usr/bin/env node
/**
 * WORDS-2 · E3 (intake 10): THE STORED PRESSURE LINE (`powerStructure.recentConflict`) BY SIZE, over a records dump
 * (`records-dump.sh`). Each place's line is classed by the line that wrote it (its words); the table gives each class's
 * share by size, with three seeds. Changes nothing. Usage: node e3-pressure.mjs <records dir> [<records dir> ...]
 */
import { readdirSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const NAME = (/** @type {string} */ t) => {
  if (/grazing rights and water access/.test(t)) return 'GRAZING: the cascade\'s last fall-through (deriveBaselineConflict)';
  if (/field rotation and grazing rights/.test(t)) return 'GRAZING: the market-house branch (field rotation)';
  if (/^A dispute over (?:rights on|water access)/.test(t)) return 'no-grazing twin (noGrazingQuarrelOf)';
  return t.replace(/\b[A-Z][a-zà-ÿ'’-]+(?:\s[A-Z][a-zà-ÿ'’-]+)*/g, 'X').slice(0, 110);
};
for (const dir of process.argv.slice(2)) {
  /** @type {Record<string, Record<string, number>>} */ const by = {}; /** @type {Record<string, string[]>} */ const seeds = {};
  const tot = {};
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json.gz'))) {
    const { seed, size, record } = JSON.parse(gunzipSync(readFileSync(join(dir, f))).toString());
    tot[size] = (tot[size] || 0) + 1;
    const line = record?.powerStructure?.recentConflict;
    const k = typeof line === 'string' && line ? NAME(line) : '(none)';
    (by[k] ||= {})[size] = (by[k][size] || 0) + 1; (seeds[k] ||= []).length < 3 && seeds[k].push(seed);
  }
  console.log(`== ${dir}: births ${SIZES.map((z) => tot[z] || 0).join('/')}`);
  console.log(`share by size (${SIZES.join('/')}), then the line class and three seeds`);
  const rows = Object.entries(by).sort((a, b) => (b[1].thorp || 0) - (a[1].thorp || 0) || Object.values(b[1]).reduce((x, y) => x + y, 0) - Object.values(a[1]).reduce((x, y) => x + y, 0));
  for (const [k, c] of rows.slice(0, 25)) console.log(`${SIZES.map((z) => `${Math.round(100 * (c[z] || 0) / (tot[z] || 1))}%`.padStart(4)).join(' ')}  ${k}  (${seeds[k].join(' ')})`);
}
