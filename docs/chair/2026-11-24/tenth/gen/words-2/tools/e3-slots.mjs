#!/usr/bin/env node
/**
 * WORDS-2 · E3, THE CHAIR'S MEASURE (2026-11-25): how the two places the cascade's quarrel prints spread, by size. A MEASURE.
 *   POWER: the Power paragraph's last sentence, `governanceAccountOf(record).text` (domain/display/governanceAccount.js), its
 *     closing vignette where it prints one, else its last sentence;
 *   OVERVIEW: the Overview's tension line, the stored `pressureSentence`.
 * Per size: the births with a line, the TOP line's share of the size's births, the number of distinct lines. The place's name
 * is masked to {S} and numbers to {N}. Run once per state's records dump.
 * Usage: node e3-slots.mjs --tree=<dir> <records dir> [...]
 */
import { readdirSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const treeArg = process.argv.find((a) => a.startsWith('--tree='));
const TREE = treeArg ? treeArg.slice(7) : '/home/user/wt/base';
const { governanceAccountOf } = await import(pathToFileURL(join(TREE, 'src/domain/display/governanceAccount.js')).href);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** @param {unknown} s @param {string} name */
const mask = (s, name) => {
  let t = String(s ?? '').trim();
  if (name) t = t.split(name).join('{S}');
  return t.replace(/\d[\d,.]*/g, '{N}');
};
/** @param {string} t */
const lastSentence = (t) => { const parts = t.split(/(?<=[.!?])\s+(?=[A-Z"“])/); return parts[parts.length - 1] || ''; };
for (const dir of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
  /** @type {Record<string, Record<string, Map<string, number>>>} */
  const tally = { power: {}, overview: {} };
  /** @type {Record<string, number>} */
  const births = {};
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json.gz')).sort()) {
    const { size, record: s } = JSON.parse(gunzipSync(readFileSync(join(dir, f))).toString());
    births[size] = (births[size] || 0) + 1;
    const name = String(s?.name ?? '');
    const acc = governanceAccountOf(s);
    const text = String(acc?.text ?? '');
    const vignette = String(s?.powerStructure?.recentConflict ?? '').trim();
    const power = vignette && text.endsWith(vignette) ? vignette : lastSentence(text);
    for (const [slot, line] of [['power', power], ['overview', s?.pressureSentence]]) {
      const m = mask(line, name);
      if (!m) continue;
      ((tally[slot][size] ||= new Map())).set(m, ((tally[slot][size].get(m)) || 0) + 1);
    }
  }
  const rows = [];
  for (const slot of ['power', 'overview']) for (const size of SIZES) {
    const t = tally[slot][size] || new Map();
    const top = [...t].sort((a, b) => b[1] - a[1])[0] || ['', 0];
    const held = [...t.values()].reduce((a, b) => a + b, 0);
    rows.push({ slot, size, births: births[size] || 0, withLine: held, topShare: births[size] ? +(top[1] / births[size]).toFixed(3) : 0, distinct: t.size, top: top[0].slice(0, 90) });
  }
  console.log(`== ${dir.split('/').pop()}`);
  for (const r of rows) console.log([r.slot, r.size, r.births, r.withLine, r.topShare, r.distinct, r.top].join('\t'));
}
