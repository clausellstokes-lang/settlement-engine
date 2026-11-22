/**
 * scripts/audit/institution-budget-floor-after.mjs — RUNG1B-F6 unit 4 (docs/RUNG1B_F6_BUDGET_FLOOR_2026-11-04.md):
 * the rung-1B §3 institutions reading, re-taken. Births of the soak's 1,000 seeds (`soak-review/corpus.mjs :: birth`);
 * houses = non-fabric rows; anchor = `expectedHousesAt` at the settlement's own population. Per tier: houses ÷ anchor
 * (median), the count outside ±40% (over / under), the lowest- and highest-population tenth (median pop / houses /
 * anchor), the share whose density factor read 0 (the d assembleInstitutions used: the first densityFactor call of the
 * birth with a population), and the within-tier Spearman ρ population → houses and population → all rows. Then 60
 * seeds per tier at the band's geometric midpoint: each record's hash and d, for a base-vs-tip comparison.
 *
 *   node --import ./scripts/audit/institution-budget-floor-record-d.mjs scripts/audit/institution-budget-floor-after.mjs [--count 1000] [--out f.json]
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

import { birth, ensureLaws } from './soak-review/corpus.mjs';
import { configForIndex } from './generation-certification-soak.mjs';
import { POPULATION_RANGES, TIER_ORDER } from '../../src/data/constants.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { isFabricInstitution } from '../../src/data/institutionalCatalog.js';
import { expectedHousesAt } from '../../src/data/institutionBudget.js';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const COUNT = Number(opt('--count', 1000));
const OUT = opt('--out', null);

/** @type {Array<[string, number, number, number]>} */
const calls = [];
/** @type {any} */ (globalThis).__F6_DENSITY_CALLS = calls;
/** The d the birth's assembleInstitutions read: its first densityFactor call with a population. */
const takeD = () => { const hit = calls.find((c) => typeof c[1] === 'number'); const out = hit ? { d: hit[3], X: hit[2] } : { d: null, X: null }; calls.length = 0; return out; };

const q = (xs, p) => { const s = [...xs].sort((a, b) => a - b); if (!s.length) return null; const i = (s.length - 1) * p; const lo = Math.floor(i); return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo); };
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
function ranks(xs) {
  const idx = xs.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(xs.length);
  for (let i = 0; i < idx.length;) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j += 1; for (let k = i; k <= j; k += 1) r[idx[k][1]] = (i + j) / 2; i = j + 1; }
  return r;
}
function spearman(xs, ys) {
  const rx = ranks(xs); const ry = ranks(ys); const mx = mean(rx); const my = mean(ry);
  let n = 0; let dx = 0; let dy = 0;
  for (let i = 0; i < rx.length; i += 1) { n += (rx[i] - mx) * (ry[i] - my); dx += (rx[i] - mx) ** 2; dy += (ry[i] - my) ** 2; }
  return dx && dy ? n / Math.sqrt(dx * dy) : null;
}

await ensureLaws();
calls.length = 0;
const rows = [];
for (let i = 0; i < COUNT; i += 1) {
  calls.length = 0;
  const s = birth(i).settlement;
  const { d, X } = takeD();
  const roster = Array.isArray(s.institutions) ? s.institutions : [];
  rows.push({ i, tier: s.tier, population: s.population, all: roster.length, houses: roster.filter((r) => !isFabricInstitution(r)).length, anchor: expectedHousesAt(s.population), d, X });
}

const perTier = {};
for (const tier of TIER_ORDER) {
  const t = rows.filter((r) => r.tier === tier).sort((a, b) => a.population - b.population);
  const tenth = Math.max(1, Math.round(t.length / 10));
  const slice = (xs) => ({ population: q(xs.map((r) => r.population), 0.5), houses: q(xs.map((r) => r.houses), 0.5), anchor: Number(q(xs.map((r) => r.anchor), 0.5).toFixed(1)) });
  const over = t.filter((r) => r.houses > 1.4 * r.anchor).length;
  const under = t.filter((r) => r.houses < 0.6 * r.anchor).length;
  perTier[tier] = {
    n: t.length,
    allMedian: q(t.map((r) => r.all), 0.5), housesMedian: q(t.map((r) => r.houses), 0.5), anchorMedian: Number(q(t.map((r) => r.anchor), 0.5).toFixed(1)),
    ratioMedian: Number(q(t.map((r) => r.houses / r.anchor), 0.5).toFixed(3)),
    outside: over + under, over, under,
    lowestTenth: slice(t.slice(0, tenth)), highestTenth: slice(t.slice(-tenth)),
    dZero: t.filter((r) => r.d === 0).length,
    dZeroPopulations: [...new Set(t.filter((r) => r.d === 0).map((r) => r.population))].sort((a, b) => a - b),
    rhoHouses: Number(spearman(t.map((r) => r.population), t.map((r) => r.houses)).toFixed(2)),
    rhoAll: Number(spearman(t.map((r) => r.population), t.map((r) => r.all)).toFixed(2)),
    meanX: t.length ? Number(mean(t.map((r) => r.X ?? 0)).toFixed(3)) : null,
  };
}

// 60 seeds per tier at the band's geometric midpoint (the promise's cells, its tier's slots; the app's birth).
const midpoint = {};
for (const tier of TIER_ORDER) {
  const { min, max } = POPULATION_RANGES[tier];
  const P = Math.round(Math.sqrt(min * max));
  const saved = { ...POPULATION_RANGES[tier] };
  POPULATION_RANGES[tier] = { min: P, max: P };
  const out = [];
  try {
    for (let k = 0; k < 60; k += 1) {
      calls.length = 0;
      const cell = configForIndex(k * TIER_ORDER.length + TIER_ORDER.indexOf(tier));
      const config = tier === 'metropolis'
        ? birthConfig({ ...DEFAULT_CONFIG, ...cell, settType: 'custom', population: P })
        : birthConfig({ ...DEFAULT_CONFIG, ...cell, settType: tier });
      const s = generateSettlementPipeline(config, null, { seed: `f6-mid-${tier}-${k}` });
      const { d } = takeD();
      out.push({ k, d, hash: createHash('sha256').update(JSON.stringify(s)).digest('hex').slice(0, 16) });
    }
  } finally { POPULATION_RANGES[tier] = saved; }
  midpoint[tier] = { population: P, cells: out };
}

const total = { outside: Object.values(perTier).reduce((a, t) => a + t.outside, 0), dZero: Object.values(perTier).reduce((a, t) => a + t.dZero, 0) };
const text = JSON.stringify({ count: COUNT, total, perTier, midpoint }, null, 1);
if (OUT) writeFileSync(OUT, text);
process.stdout.write(`${JSON.stringify({ total, perTier }, null, 1)}\n`);
