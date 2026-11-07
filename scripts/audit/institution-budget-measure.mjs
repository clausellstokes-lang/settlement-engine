/**
 * scripts/audit/institution-budget-measure.mjs — X-46 car 3's measurement (docs/DESIGN_X46_SCALE_TRAIN.md §4,
 * "What it is measured to do"): the house count against the population, before and after the
 * institution budget.
 *
 *   node scripts/audit/institution-budget-measure.mjs [--out <file.json>] [--seeds 40] [--matrix 120] [--matrix-only]
 *   X46_FORCE_D=1 node --import ./scripts/audit/institution-budget-force-d.mjs \
 *     scripts/audit/institution-budget-measure.mjs --calibrate 200 [--tiers a,b] [--ds 0,3,4] [--out <file.json>]
 *   (`--calibrate N`: the calibration of `INSTITUTION_BUDGET_REALISED` (the chair's rulings of
 *   2026-11-04). At each band's geometric midpoint, N settlements at each forced d in
 *   CALIBRATION_DS (0, 0.25, 0.5, 1, 1.5, 2, 3, 4; `--ds` measures a subset — the points are
 *   deterministic per seed, so a subset run reproduces its rows of the full run), the mean SCALABLE house
 *   count (RUNG1B-F6: rows drawn at a scaled chance, not required, fabric or density-exempt): realised(d). The force-d hook
 *   must be loaded (the script refuses to calibrate unforced). The first calibration (U5) was one
 *   point, d = 1, taken at d0a3202.)
 *   (`--matrix 1000 --matrix-only` reads the soak's 1,000 corpus: the same seeds and configs as soak-review)
 *
 * It reads, all from the app's own birth path (`scripts/audit/soak-review/corpus.mjs :: birth` for the
 * matrix; `birthConfig` → `generateSettlementPipeline` for the forced-population cells):
 *   1. the certification matrix (indices 0..matrix-1): per tier the median and p10–p90 of the house
 *      count and the within-tier Spearman ρ(population, houses);
 *   2. the band ends: each tier at its POPULATION_RANGES min and max, `seeds` settlements each, the
 *      p10–p90 against the budget (1–3 / 2–6 / 5–14 / 12–35 / 30–75 / 70+);
 *   3. the overlap agreement: 100 (hamlet/village), 400 (village/town), 2,500 (town/city), 15,000
 *      (city/metropolis), `seeds` settlements per side, the mean houses and their relative gap;
 *   4. the catalogue's R_tier and E_tier, and the largest roster per tier (the
 *      CARTOGRAPHY_CALIBRATION.MAX_INSTITUTIONS analogue over this corpus — a reading, never a re-record).
 *
 * A HOUSE is a roster row that is not fabric (`institutionalCatalog.js :: isFabricInstitution`).
 * The forced population is a MEASUREMENT device only: the script narrows the module's own
 * POPULATION_RANGES row to [P, P] for the cell, so the tier's roll returns P on the same one draw.
 */
import { writeFileSync } from 'node:fs';

import { birth, ensureLaws } from './soak-review/corpus.mjs';
import { configForIndex } from './generation-certification-soak.mjs';
import { POPULATION_RANGES, TIER_ORDER } from '../../src/data/constants.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import * as catalog from '../../src/data/institutionalCatalog.js';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = opt('--out', null);
const SEEDS = Number(opt('--seeds', 40));
const MATRIX = Number(opt('--matrix', 120));
const MATRIX_ONLY = args.includes('--matrix-only');
const CALIBRATE = opt('--calibrate', null) === null ? null : Number(opt('--calibrate', 200));

// Before the fabric tag exists the measurement uses the same list by name (the "before" run).
const FALLBACK_FABRIC = new Set(['Dwellings (4-16)', 'Dwellings (17-80)', 'Dwellings (80-180)',
  'Housing (180-1000 structures)', 'Housing (1000-5000 structures)', 'Housing (5000+ structures)',
  'Water source', 'Multiple water sources', 'Access to parish church']);
const isFabric = typeof catalog.isFabricInstitution === 'function'
  ? (inst) => catalog.isFabricInstitution(inst)
  : (inst) => !inst?.isCustom && FALLBACK_FABRIC.has(inst?.name);

const BUDGET = { thorp: [1, 3], hamlet: [2, 6], village: [5, 14], town: [12, 35], city: [30, 75], metropolis: [70, Infinity] };

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
// THE SCALABLE ROWS (the chair's ruling, 2026-11-04, RUNG1B-F6): the houses the density factor can
// move — a row DRAWN at a scaled chance (source generated, cascade or faction_boost) whose catalogue row
// is not required, fabric or density-exempt. Required, route-required, rare, coherence-repair and
// toggle-forced rows stand whatever d is, so realised_scalable(0) = 0 by construction.
const DRAWN_SOURCES = new Set(['generated', 'cascade', 'faction_boost']);
let budgetModule = null;
const isScalable = (inst, tier) => !isFabric(inst) && DRAWN_SOURCES.has(inst?.source) && !inst?.required
  && !(budgetModule && budgetModule.isDensityExempt(inst.tier || tier, inst.name));
const read = (s) => {
  const roster = Array.isArray(s.institutions) ? s.institutions : [];
  return {
    houses: roster.filter((i) => !isFabric(i)).length,
    scalable: roster.filter((i) => isScalable(i, s.tier)).length,
    roster: roster.length,
    required: roster.filter((i) => i.source === 'required' && !isFabric(i)).length,
  };
};

await ensureLaws();

const ORIGINAL = Object.fromEntries(TIER_ORDER.map((t) => [t, { ...POPULATION_RANGES[t] }]));
const CALIBRATION_DS = opt('--ds', null) ? opt('--ds', null).split(',').map(Number) : [0, 0.25, 0.5, 1, 1.5, 2, 3, 4];
if (CALIBRATE !== null) {
  const budget = await import('../../src/data/institutionBudget.js');
  budgetModule = budget;
  const forced = (d) => { process.env.X46_FORCE_D = String(d); return budget.densityFactor('town', 1000) === d; };
  if (!forced(0.5)) throw new Error('--calibrate needs the force-d hook: node --import ./scripts/audit/institution-budget-force-d.mjs');
  const calibration = {};
  const only = opt('--tiers', null);
  for (const tier of only ? only.split(',') : TIER_ORDER) {
    let R = 0;
    for (const group of Object.values(catalog.institutionalCatalog[tier])) {
      for (const [name, row] of Object.entries(group)) if (row.required && !catalog.isFabricRow(tier, name)) R += 1;
    }
    const midpoint = Math.round(Math.sqrt(ORIGINAL[tier].min * ORIGINAL[tier].max));
    // realised_scalable(d): the mean SCALABLE house count (RUNG1B-F6; before it, all houses − R).
    const points = CALIBRATION_DS.map((d) => {
      forced(d);
      return [d, mean(cell(tier, midpoint, CALIBRATE, 'cal', 'scalable'))];
    });
    calibration[tier] = { midpoint, seeds: CALIBRATE, R, points };
  }
  delete process.env.X46_FORCE_D;
  const text = JSON.stringify({ calibrate: CALIBRATE, calibration }, null, 1);
  if (OUT) writeFileSync(OUT, text);
  process.stdout.write(`${text}\n`);
  process.exit(0);
}

// 1. the matrix
const matrix = [];
for (let i = 0; i < MATRIX; i += 1) {
  const b = birth(i);
  matrix.push({ seed: b.seed, tier: b.settlement.tier, population: b.settlement.population, ...read(b.settlement) });
}
const perTier = {};
for (const tier of TIER_ORDER) {
  const rows = matrix.filter((r) => r.tier === tier);
  perTier[tier] = {
    n: rows.length,
    rho: spearman(rows.map((r) => r.population), rows.map((r) => r.houses)),
    median: q(rows.map((r) => r.houses), 0.5), p10: q(rows.map((r) => r.houses), 0.1), p90: q(rows.map((r) => r.houses), 0.9),
    maxRoster: Math.max(...rows.map((r) => r.roster)),
    requiredMedian: q(rows.map((r) => r.required), 0.5),
  };
}

// forced-population cells (hoisted; ORIGINAL is read before the first call)
function cell(tier, P, n, tag, field = 'houses') {
  POPULATION_RANGES[tier] = { min: P, max: P };
  const out = [];
  try {
    for (let k = 0; k < n; k += 1) {
      const matrixCell = configForIndex(k * TIER_ORDER.length + TIER_ORDER.indexOf(tier));
      // The metropolis roll (X-46 car 1b, `rollMetropolisPopulation`) no longer reads POPULATION_RANGES,
      // so a metropolis is forced through the app's own custom-population path (window branch, 2026-11-04).
      const config = tier === 'metropolis'
        ? birthConfig({ ...DEFAULT_CONFIG, ...matrixCell, settType: 'custom', population: P })
        : birthConfig({ ...DEFAULT_CONFIG, ...matrixCell, settType: tier });
      const s = generateSettlementPipeline(config, null, { seed: `x46b-${tag}-${tier}-${P}-${k}` });
      if (s.population !== P || s.tier !== tier) throw new Error(`forced cell missed: ${tier} ${P} → ${s.tier} ${s.population}`);
      out.push(read(s)[field]);
    }
  } finally { POPULATION_RANGES[tier] = { ...ORIGINAL[tier] }; }
  return out;
}

// 2. the band ends
const bandEnds = {};
for (const tier of MATRIX_ONLY ? [] : TIER_ORDER) {
  bandEnds[tier] = {};
  for (const end of ['min', 'max']) {
    const P = ORIGINAL[tier][end];
    const xs = cell(tier, P, SEEDS, 'end');
    const [lo, hi] = BUDGET[tier];
    const p10 = q(xs, 0.1); const p90 = q(xs, 0.9);
    bandEnds[tier][end] = { population: P, p10, median: q(xs, 0.5), p90, budget: [lo, hi === Infinity ? '70+' : hi], inside: p10 >= lo && p90 <= hi };
  }
}

// 3. the overlap agreement
const OVERLAPS = [[100, 'hamlet', 'village'], [400, 'village', 'town'], [2500, 'town', 'city'], [15000, 'city', 'metropolis']];
const overlap = (MATRIX_ONLY ? [] : OVERLAPS).map(([P, a, b]) => {
  const ma = mean(cell(a, P, SEEDS, 'ov')); const mb = mean(cell(b, P, SEEDS, 'ov'));
  return { population: P, lower: a, upper: b, meanLower: ma, meanUpper: mb, relGap: Math.abs(ma - mb) / Math.max(ma, mb), within10: Math.abs(ma - mb) / Math.max(ma, mb) <= 0.1 };
});

// 4. the catalogue
let catalogue;
try {
  const budget = await import('../../src/data/institutionBudget.js');
  // How many optional, non-fabric rows reach a chance of 1.0 at the band's top (authored chance
  // × d, before the priority and resource multipliers): the clamp that caps a large tier.
  const cappedAtMax = (t) => {
    const d = budget.densityFactor(t, ORIGINAL[t].max);
    let n = 0;
    for (const group of Object.values(catalog.institutionalCatalog[t])) {
      for (const [name, row] of Object.entries(group)) if (!row.required && !catalog.isFabricRow(t, name) && (row.baseChance || 0) * d >= 1) n += 1;
    }
    return n;
  };
  catalogue = Object.fromEntries(TIER_ORDER.map((t) => [t, { ...budget.tierBudgetTerms(t), cappedAtMax: cappedAtMax(t), dAtMin: budget.densityFactor(t, ORIGINAL[t].min), dAtMax: budget.densityFactor(t, ORIGINAL[t].max), expectedAtMin: budget.expectedHousesAt(ORIGINAL[t].min), expectedAtMax: budget.expectedHousesAt(ORIGINAL[t].max) }]));
} catch { catalogue = 'institutionBudget.js absent (the before)'; }

const report = { seeds: SEEDS, matrix: MATRIX, perTier, bandEnds, overlap, catalogue };
const text = JSON.stringify(report, null, 1);
if (OUT) writeFileSync(OUT, text);
process.stdout.write(`${text}\n`);
