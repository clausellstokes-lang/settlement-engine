// CENSUS-3 fall table: a run's towns a kind (hits.json) beside CENSUS-2's headline at the line on 2026-11-13
// (9e57f5023, the same 720 seeds), by surface when the dump has more than the tabs.
//   node fall.mjs <run-dir> [label]   -> prints a markdown table; writes <run-dir>/fall.json
import fs from 'node:fs';
const [OUT, label = 'now'] = process.argv.slice(2);
const THEN = { a: 712, b: 70, c: 301, d: 382, e: 60, f: 720, g: 720, h: 20 };
const H = JSON.parse(fs.readFileSync(OUT + '/hits.json', 'utf8'));
const N = new Set(fs.readdirSync(OUT + '/dumps').map((f) => f.replace(/\.txt$/, ''))).size;
const by = {}; for (const h of H) { const s = h.surface || 'tab'; const b = (by[h.pattern] ||= { all: new Set(), tab: new Set(), tonight: new Set(), pdf: new Set(), journal: new Set(), lines: new Set() }); b.all.add(h.seed); b[s].add(h.seed); b.lines.add(h.norm); }
const kinds = [...new Set([...Object.keys(THEN), ...Object.keys(by)])].sort((x, y) => (x.length - y.length) || (x < y ? -1 : 1)).sort((x, y) => (/^L/.test(x) ? 1 : 0) - (/^L/.test(y) ? 1 : 0) || (/^L/.test(x) ? +x.slice(1) - +y.slice(1) : 0));
const surf = H.some((h) => h.surface && h.surface !== 'tab');
const rows = [`| kind | towns of ${N}, 2026-11-13 (CENSUS-2, 9e57f5023, the tabs) | towns ${label}${surf ? ' (any surface)' : ''} | ${surf ? 'tabs | Tonight | PDF | journal | ' : ''}distinct lines |`, `|---|---|---|${surf ? '---|---|---|---|' : ''}---|`];
const out = {};
for (const k of kinds) { const b = by[k]; const t = THEN[k]; out[k] = { then: t ?? null, now: b ? b.all.size : 0, tab: b?.tab.size || 0, tonight: b?.tonight.size || 0, pdf: b?.pdf.size || 0, journal: b?.journal.size || 0, lines: b?.lines.size || 0 };
  rows.push(`| ${k} | ${t ?? '(new)'} | ${b ? b.all.size : 0} | ${surf ? `${out[k].tab} | ${out[k].tonight} | ${out[k].pdf} | ${out[k].journal} | ` : ''}${out[k].lines} |`); }
fs.writeFileSync(OUT + '/fall.json', JSON.stringify({ towns: N, kinds: out }, null, 1)); console.log(rows.join('\n'));
