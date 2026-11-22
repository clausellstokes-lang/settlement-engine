#!/usr/bin/env node
// FORTUNE-7 unit 3: each state's two band tables (all places, calm places) against BANDS.md's state of the same letter,
// row for row (md5 over the twelve size rows, as BANDS-LIT.md compared). usage: node lit-compare.mjs <BANDS.md> <report.md>
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const [bandsPath, reportPath] = process.argv.slice(2);
/** the twelve size rows of each `## State X` section, by letter @param {string} text */
const rowsByState = (text) => {
  const out = {};
  let cur = null;
  for (const line of text.split('\n')) {
    const m = line.match(/^## State ([A-D])\b/);
    if (m) { cur = m[1]; out[cur] = []; continue; }
    if (/^#/.test(line)) { cur = null; continue; }
    if (cur && /^\| (thorp|hamlet|village|town|city|metropolis) \|/.test(line)) out[cur].push(line.trim());
  }
  return out;
};
const md5 = (rows) => createHash('md5').update(rows.join('\n')).digest('hex').slice(0, 12);
const want = rowsByState(readFileSync(bandsPath, 'utf8'));
const got = rowsByState(readFileSync(reportPath, 'utf8'));
for (const s of Object.keys(got)) {
  const w = want[s] ?? [];
  const differ = got[s].filter((r, i) => r !== w[i]);
  console.log(`state ${s}: ${got[s].length} rows; BANDS.md ${w.length}; md5 ${md5(got[s])} vs ${md5(w)}; ${differ.length ? 'DIFFERS on ' + differ.length : 'IDENTICAL'}`);
  for (const r of differ) console.log(`  now:  ${r}\n  was:  ${w[got[s].indexOf(r)] ?? '(none)'}`);
}
