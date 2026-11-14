// pv.mjs <tree> <tsv> <blockRegex> [poolRegex]: each pool with a live sweep row, every variant with marks (once per pool)
import fs from 'node:fs'; import path from 'node:path';
const [tree, tsv, re, pre] = process.argv.slice(2); const R = new RegExp(re); const P = new RegExp(pre || '.');
const C = {};
for (const desk of ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith']) Object.assign(C, Object.values(await import(path.join(tree, `src/data/dossierStateProse/${desk}.generated.js`))).find((v) => v && typeof v === 'object'));
const seen = new Set();
for (const l of fs.readFileSync(tsv, 'utf8').trim().split('\n').slice(1)) { const [b, p, , , , , , f] = l.split('\t'); if (R.test(b) && P.test(p) && +f > 0) seen.add(b + '::' + p); }
for (const k of [...seen].sort()) { const [b, ...r] = k.split('::'); const p = r.join('::'); console.log('## ' + k);
  for (const v of C[b].pools[p]) console.log(` v${v.vid} [${(v.marks || []).filter((m) => m !== 'crisis: any').join('·')}] ${v.text.slice(0, 230)}`); }
