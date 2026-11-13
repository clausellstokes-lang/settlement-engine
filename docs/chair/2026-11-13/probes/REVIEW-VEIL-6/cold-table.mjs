// REVIEW-VEIL-6: node cold-table.mjs <chain> <out json...> [--persons]
// The table of the review: on one chain, for the shares with EVERY EYE SHUT BY HAND (or, with --persons, the shares
// where only the per-person switch is off), each (what was hidden -> the path it arrived at), with the number of
// towns it arrived in, by DM reveal, and the reads it arrived on. Path prefixes of the reads are folded together.
import { readFileSync } from 'node:fs';
const [chain, ...rest] = process.argv.slice(2); const files = rest.filter((a) => !a.startsWith('--')); const PERSONS = rest.includes('--persons');
const rows = {}; let towns = 0;
const fold = (p) => p.replace(/^import_gallery_map\./, '').replace(/^(members\[\]\.settlement|dossier|data)\./, '');
for (const f of files) { const o = JSON.parse(readFileSync(f, 'utf8')); towns += o.towns;
  for (const [kind, src, tw] of [['marker', o.sent, o.sentTowns], ['text', o.text, o.textTowns], ['house', o.houseNames, o.houseNameTowns]]) for (const [kk, reads] of Object.entries(src || {})) {
    const parts = kk.split(' | '); if (parts[0] !== chain) continue; const share = parts.slice(1, -1).join(' | '); const isPersons = share.includes('every person switched off'); if (isPersons !== PERSONS) continue;
    const [what, path] = parts[parts.length - 1].split('  ->  '); const key = `${kind} | ${what} -> ${fold(path)}`;
    const r = rows[key] = rows[key] || { byShare: {}, reads: new Set(), ex: o.examples[kk] };
    const sk = `${f}|${share}|${path}`; r.byShare[share] = r.byShare[share] || {}; r.byShare[share][`${f}|${path}`] = tw[kk]; Object.keys(reads).forEach((x) => r.reads.add(x)); } }
console.log(`chain ${chain}: ${towns} towns; ${PERSONS ? 'shares with only the per-person switch off' : 'shares with every eye shut by hand'}; ${Object.keys(rows).length} rows`);
for (const k of Object.keys(rows).sort()) { const r = rows[k];
  const per = Object.entries(r.byShare).map(([share, m]) => { const byFile = {}; for (const [fp, n] of Object.entries(m)) { const f = fp.split('|')[0]; byFile[f] = Math.max(byFile[f] || 0, n); } return `${share}: ${Object.values(byFile).reduce((a, b) => a + b, 0)}`; });
  console.log(`${k}\n    towns by share: ${per.sort().join(' ; ')}\n    reads: ${[...r.reads].sort().join(' ')}\n    e.g. ${r.ex}`); }
