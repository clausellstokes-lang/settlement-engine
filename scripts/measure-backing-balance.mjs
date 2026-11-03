#!/usr/bin/env node
/**
 * scripts/measure-backing-balance.mjs — THE BALANCE MEASUREMENT (X-45, the owner 2026-11-02:
 * "make sure that it still balances out to the power ranking and influences").
 *
 * Generates a sample of settlements across every tier and reads, for each, the backing
 * ledger (`domain/dossier/powerSupport.js :: backingLedger`): what the backing catalogue
 * implies for each power's share against what generation decided. Prints, per tier and
 * overall, the mean gap (half the summed absolute difference of the two percentage
 * distributions, 0 to 100), the mean rank agreement (Spearman, 1 is the same order), the
 * share of house weight that found no power to land on, and the houses the catalogue does
 * not place; then the mean bias per archetype (implied minus generated, in points) and the
 * widest-gap settlements. Read-only: no file is written unless `--json <path>` is given.
 *
 *   node scripts/measure-backing-balance.mjs            # the default sample
 *   node scripts/measure-backing-balance.mjs --seeds 12 # more seeds per cell
 *   node scripts/measure-backing-balance.mjs --json out.json
 */
import { writeFileSync } from 'node:fs';
import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';
import { backingLedger, houseBacksOf } from '../src/domain/dossier/powerSupport.js';
import { backingRowFor } from '../src/data/institutionBacking.js';

const args = process.argv.slice(2);
const argOf = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 && args[i + 1] != null ? args[i + 1] : fallback; };
const SEEDS = Number(argOf('--seeds', 6));
const JSON_OUT = argOf('--json', null);

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CELLS = [
  { terrain: 'grassland', tradeRouteAccess: 'road' },
  { terrain: 'river' },
  { terrain: 'hills', tradeRouteAccess: 'none' },
];

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const median = (xs) => { if (!xs.length) return 0; const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const f1 = (x) => (x == null ? '   –' : x.toFixed(1).padStart(5));
const f2 = (x) => (x == null ? '    –' : x.toFixed(2).padStart(5));

const results = [];
for (const settType of TIERS) {
  for (const cell of CELLS) {
    for (let i = 0; i < SEEDS; i += 1) {
      const seed = `balance-${settType}-${cell.terrain}-${i}`;
      let s;
      try { s = generateSettlementPipeline({ settType, ...cell }, null, { seed, customContent: {} }); }
      catch (e) { console.error(`generation failed: ${seed}: ${e.message}`); continue; }
      const ledger = backingLedger(s);
      const backs = houseBacksOf(s);
      const unplaced = (s.institutions || []).filter((h) => !backingRowFor(h.name)).map((h) => h.name);
      const defaulted = [...backs.values()].filter((l) => l.length && l[0].basis === 'default').length;
      const multi = [...backs.values()].filter((l) => l.filter((b) => b.share > 0).length > 1).length;
      results.push({ settType, terrain: cell.terrain, seed, ledger, unplaced, defaulted, multi, houses: (s.institutions || []).length });
    }
  }
}

console.log(`\nTHE BACKING BALANCE · ${results.length} settlements · ${SEEDS} seeds × ${CELLS.length} cells × ${TIERS.length} tiers\n`);
console.log('tier         n   gap mean  gap med  rank mean  lapsed%  default  multi  unplaced');
const byTier = (t) => results.filter((r) => r.settType === t);
const line = (label, rs) => {
  const gaps = rs.map((r) => r.ledger.distance);
  const ranks = rs.map((r) => r.ledger.rank).filter((x) => x != null);
  const lapsed = rs.map((r) => (r.ledger.weighed ? (100 * r.ledger.lapsed) / r.ledger.weighed : 0));
  const defaulted = rs.reduce((a, r) => a + r.defaulted, 0);
  const multi = rs.reduce((a, r) => a + r.multi, 0);
  const houses = rs.reduce((a, r) => a + r.houses, 0);
  const unplaced = rs.reduce((a, r) => a + r.unplaced.length, 0);
  console.log(`${label.padEnd(11)} ${String(rs.length).padStart(3)}   ${f1(mean(gaps))}    ${f1(median(gaps))}     ${f2(ranks.length ? mean(ranks) : null)}    ${f1(mean(lapsed))}   ${String(defaulted).padStart(5)}/${houses}  ${String(multi).padStart(4)}  ${unplaced}`);
};
for (const t of TIERS) line(t, byTier(t));
line('ALL', results);

// Per-archetype bias: implied minus generated, in points, averaged over the rows that carry it.
const bias = new Map();
for (const r of results) for (const row of r.ledger.rows) {
  const b = bias.get(row.archetype) || [];
  b.push(row.implied - row.generated); bias.set(row.archetype, b);
}
console.log('\narchetype     rows   bias mean (implied − generated, points)   |bias| mean');
for (const [arch, xs] of [...bias.entries()].sort((a, b) => Math.abs(mean(b[1])) - Math.abs(mean(a[1])))) {
  console.log(`${arch.padEnd(12)} ${String(xs.length).padStart(5)}      ${f1(mean(xs))}                                   ${f1(mean(xs.map(Math.abs)))}`);
}

// The widest gaps, with their rows.
console.log('\nthe five widest gaps');
for (const r of [...results].sort((a, b) => b.ledger.distance - a.ledger.distance).slice(0, 5)) {
  console.log(`\n  ${r.settType} · ${r.terrain} · ${r.seed} · gap ${r.ledger.distance.toFixed(1)} · rank ${r.ledger.rank == null ? '–' : r.ledger.rank.toFixed(2)} · lapsed ${r.ledger.weighed ? ((100 * r.ledger.lapsed) / r.ledger.weighed).toFixed(0) : 0}%`);
  for (const row of r.ledger.rows) {
    console.log(`    ${(row.governing ? '*' : ' ') + row.faction.padEnd(28)} ${row.archetype.padEnd(11)} generated ${f1(row.generated)}  implied ${f1(row.implied)}  backed ${row.backed.toFixed(1).padStart(6)}`);
  }
  if (r.unplaced.length) console.log(`    unplaced: ${r.unplaced.join(', ')}`);
}

// The names the catalogue does not place, counted.
const unplacedCount = new Map();
for (const r of results) for (const n of r.unplaced) unplacedCount.set(n, (unplacedCount.get(n) || 0) + 1);
if (unplacedCount.size) {
  console.log('\nhouses the catalogue does not place (name × times seen)');
  for (const [n, c] of [...unplacedCount.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${c.toString().padStart(4)}  ${n}`);
}

// What feeding the catalogue would do (step two, the owner's call): blend the implied
// distribution into the generated one at a weight and read how far each power moves.
for (const b of [0.25, 0.5]) {
  const moves = [];
  let reordered = 0;
  for (const r of results) {
    const rows = r.ledger.rows.filter((row) => !row.governing);
    const before = [...rows].sort((x, y) => y.generated - x.generated).map((row) => row.faction);
    const after = [...rows].sort((x, y) => ((1 - b) * y.generated + b * y.implied) - ((1 - b) * x.generated + b * x.implied)).map((row) => row.faction);
    if (before.slice(0, 2).join('|') !== after.slice(0, 2).join('|')) reordered += 1;
    for (const row of r.ledger.rows) moves.push(Math.abs(b * (row.implied - row.generated)));
  }
  console.log(`\nblend ${b}: mean move ${mean(moves).toFixed(1)} points per power · the top two below the seat reordered in ${reordered}/${results.length} settlements`);
}

if (JSON_OUT) {
  writeFileSync(JSON_OUT, JSON.stringify(results, null, 1));
  console.log(`\nwrote ${JSON_OUT}`);
}
