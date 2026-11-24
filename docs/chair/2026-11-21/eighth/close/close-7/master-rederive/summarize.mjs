#!/usr/bin/env node
// MASTER-REDERIVE: the by-size table from rows.jsonl (master-rederive.census.jsx). node summarize.mjs <rows.jsonl> [label]
import { readFileSync } from 'node:fs';
const rows = readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const label = process.argv[3] || '';
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const moved = (d) => (d ? d.lost.length + d.gained.length : 0);
const dims = {
  houses: (r) => moved(r.houses), people: (r) => moved(r.people), powers: (r) => moved(r.powers),
  government: (r) => (r.government && r.government[0] !== r.government[1] ? 1 : 0),
  'events (by name)': (r) => moved(r.events), 'events (by year and kind)': (r) => moved(r.eventYears),
};
const errs = rows.filter((r) => r.err);
console.log(`${label}: ${rows.length} places; errors ${errs.length}${errs.length ? ` (${errs[0].seed}: ${errs[0].err})` : ''}`);
console.log(`| size | moved at all | ${Object.keys(dims).map((d) => `${d}: places · mean · max`).join(' | ')} |`);
console.log(`|---|---|${Object.keys(dims).map(() => '---').join('|')}|`);
for (const size of [...SIZES, 'all']) {
  const rs = rows.filter((r) => size === 'all' || r.size === size);
  const any = rs.filter((r) => Object.values(dims).some((f) => f(r) > 0)).length;
  const cells = Object.values(dims).map((f) => { const v = rs.map(f); const n = v.filter((x) => x > 0).length; return `${n} · ${(v.reduce((a, b) => a + b, 0) / rs.length).toFixed(1)} · ${Math.max(...v)}`; });
  console.log(`| ${size} | ${any}/${rs.length} | ${cells.join(' | ')} |`);
}
