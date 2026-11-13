// REVIEW-VEIL-6: node cold-summary.mjs <out json...> [--examples] [--by-share]
// Sums the shards of a cold run. One line per (chain, what was hidden -> where it arrived), with the towns, the
// shares it arrived on and the reads; `marker` rows are my planted markers, `text` rows the hidden string's own
// sentences (a marker may be lost to a truncation), `house` rows the name of a house the response no longer lists.
import { readFileSync } from 'node:fs';
const files = process.argv.slice(2).filter((a) => !a.startsWith('--')); const EX = process.argv.includes('--examples'); const BY = process.argv.includes('--by-share');
const tot = { towns: 0, planted: 0, propagated: 0, shares: 0, reads: 0, handHides: 0, clamped: 0, housesHiddenWhole: 0, frozenSkips: 0 }; const rows = {}; const raised = []; const threw = []; const lists = {}; const readsByName = {}; const propagatedTo = {}; const plantedByOrigin = {};
for (const f of files) { const o = JSON.parse(readFileSync(f, 'utf8'));
  for (const k of Object.keys(tot)) tot[k] += o[k] || 0; raised.push(...o.raised); threw.push(...o.birthsThatThrew);
  for (const [k, v] of Object.entries(o.listReads || {})) { lists[k] = lists[k] || { rows: 0, markers: 0 }; if (typeof v === 'string') lists[k].raised = v; else { lists[k].rows += v.rows; lists[k].markers += v.markers; } }
  for (const [k, v] of Object.entries(o.readsByName || {})) readsByName[k] = (readsByName[k] || 0) + v;
  for (const [k, v] of Object.entries(o.propagatedTo || {})) propagatedTo[k] = (propagatedTo[k] || 0) + v;
  for (const [k, v] of Object.entries(o.plantedByOrigin || {})) plantedByOrigin[k] = (plantedByOrigin[k] || 0) + v;
  for (const [kind, src, towns] of [['marker', o.sent, o.sentTowns], ['text', o.text, o.textTowns], ['house', o.houseNames, o.houseNameTowns]]) for (const [kk, reads] of Object.entries(src || {})) {
    const [chain, ...rest] = kk.split(' | '); const what = rest[rest.length - 1]; const share = rest.slice(0, -1).join(' | ');
    const key = BY ? `${chain} | ${kind} | ${what} | ${share}` : `${chain} | ${kind} | ${what}`;
    const r = rows[key] = rows[key] || { towns: 0, shares: new Set(), reads: {}, ex: o.examples[kk] };
    r.towns = Math.max(r.towns, 0) + (BY ? towns[kk] : 0); r.maxTowns = Math.max(r.maxTowns || 0, towns[kk]); r.shares.add(share); for (const [rd, c] of Object.entries(reads)) r.reads[rd] = (r.reads[rd] || 0) + c; } }
console.log(JSON.stringify(tot)); console.log('births that threw:', threw.length, threw.slice(0, 3)); console.log('raised:', raised.length, raised.slice(0, 5));
console.log('reads:'); for (const k of Object.keys(readsByName).sort()) console.log('  ', k, readsByName[k]);
console.log('lists:'); for (const k of Object.keys(lists).sort()) console.log('  ', k, JSON.stringify(lists[k]));
if (process.argv.includes('--planted')) { console.log('planted by origin:', JSON.stringify(plantedByOrigin)); console.log('propagated to:'); for (const k of Object.keys(propagatedTo).sort()) console.log('  ', k, propagatedTo[k]); }
console.log(`ARRIVED: ${Object.keys(rows).length} rows`);
for (const k of Object.keys(rows).sort()) { const r = rows[k]; console.log(`${k} | towns<=${BY ? r.towns : r.maxTowns + '/shard'} | shares: ${[...r.shares].length} | ${Object.entries(r.reads).map(([a, b]) => `${a}:${b}`).join(' ')}`); if (!BY && [...r.shares].length <= 12) console.log(`      on: ${[...r.shares].sort().join(' ; ')}`); if (EX) console.log(`      e.g. ${r.ex}`); }
