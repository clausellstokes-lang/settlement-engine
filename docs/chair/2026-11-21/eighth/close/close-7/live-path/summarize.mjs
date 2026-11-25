#!/usr/bin/env node
// LIVE-PATH: the by-size table from rows.jsonl (live-path.census.jsx); MASTER-REDERIVE's summarize.mjs plus the new columns.
// node summarize.mjs <rows.jsonl> [label]
// "moved at all" counts a place where any column below moved OTHER THAN the newcomer's own arrival (people gained = the newcomer).
import { readFileSync } from 'node:fs';
const rows = readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const label = process.argv[3] || '';
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const NEWCOMER = 'Aldous Newcombe';
const moved = (d) => (d ? d.lost.length + d.gained.length : 0);
const dims = {
  houses: (r) => moved(r.houses),
  'people (newcomer excluded)': (r) => r.people.lost.length + r.people.gained.filter((n) => n !== NEWCOMER).length,
  powers: (r) => moved(r.powers),
  'government name': (r) => (r.government && r.government[0] !== r.government[1] ? 1 : 0),
  'events (by name)': (r) => moved(r.events),
  'events (year and kind)': (r) => moved(r.eventYears),
  'kept people rewritten in place': (r) => r.peopleChangedInPlace,
  'people orphaned by the tick (house or power gone)': (r) => Math.max(0, r.orphansAfter.either - r.orphansLoaded.either),
};
const errs = rows.filter((r) => r.err);
const newcomerOnce = rows.filter((r) => r.newcomer?.count === 1).length;
console.log(`${label}: ${rows.length} places; errors ${errs.length}${errs.length ? ` (${errs[0].seed}: ${errs[0].err})` : ''}; newcomer present exactly once ${newcomerOnce}/${rows.length}`);
console.log(`| size | moved at all | ${Object.keys(dims).map((d) => `${d}: places · mean · max`).join(' | ')} | people keep name | people orphaned after (house · power) |`);
console.log(`|---|---|${Object.keys(dims).map(() => '---').join('|')}|---|---|`);
for (const size of [...SIZES, 'all']) {
  const rs = rows.filter((r) => size === 'all' || r.size === size);
  const any = rs.filter((r) => Object.values(dims).some((f) => f(r) > 0)).length;
  const cells = Object.values(dims).map((f) => { const v = rs.map(f); const n = v.filter((x) => x > 0).length; return `${n} · ${(v.reduce((a, b) => a + b, 0) / rs.length).toFixed(1)} · ${Math.max(...v)}`; });
  const keep = rs.reduce((a, r) => a + r.peopleKeepName, 0); const before = rs.reduce((a, r) => a + r.counts.peopleBefore, 0);
  const oh = rs.reduce((a, r) => a + r.orphansAfter.house, 0); const op = rs.reduce((a, r) => a + r.orphansAfter.power, 0);
  const oe = rs.reduce((a, r) => a + r.orphansAfter.either, 0);
  console.log(`| ${size} | ${any}/${rs.length} | ${cells.join(' | ')} | ${keep}/${before} | ${oe} (${oh} · ${op}) |`);
}
// top-level record keys the tick moved (decrees, dmLayer excluded), places per key
const keyCount = new Map(); for (const r of rows) for (const k of r.tickMoved || []) keyCount.set(k, (keyCount.get(k) || 0) + 1);
console.log(`\nrecord keys the tick moved (places): ${[...keyCount].sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c}`).join(', ')}`);
const loadCount = new Map(); for (const r of rows) for (const k of r.loadMoved || []) loadCount.set(k, (loadCount.get(k) || 0) + 1);
console.log(`record keys the LOAD moved (places): ${[...loadCount].sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c}`).join(', ') || 'none'}`);
