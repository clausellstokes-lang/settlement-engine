/**
 * scripts/audit/institution-budget-floor-measure.mjs — RUNG1B-F6 unit 1 (docs/RUNG1B_F6_BUDGET_FLOOR_2026-11-04.md):
 * per tier, the populations where the density factor reads 0, the exempt (route-required, terrain-required,
 * rare) rows, and, at d forced to 0 at the band's geometric midpoint (the calibration's cells and seeds),
 * every non-required house that still stands, by row and source, classed exempt / scalable-name / other.
 *
 *   X46_FORCE_D= node --import ./scripts/audit/institution-budget-force-d.mjs scripts/audit/institution-budget-floor-measure.mjs [seeds=200]
 */
import { ensureLaws } from './soak-review/corpus.mjs';
import { configForIndex } from './generation-certification-soak.mjs';
import { POPULATION_RANGES, TIER_ORDER } from '../../src/data/constants.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import * as catalog from '../../src/data/institutionalCatalog.js';
import * as budget from '../../src/data/institutionBudget.js';
await ensureLaws();
const N = Number(process.argv[2] || 200);
const ORIGINAL = Object.fromEntries(TIER_ORDER.map((t) => [t, { ...POPULATION_RANGES[t] }]));
const out = {};
for (const tier of TIER_ORDER) {
  const { min, max } = ORIGINAL[tier];
  const terms = budget.tierBudgetTerms(tier);
  const top = tier === 'metropolis' ? 60000 : max;
  const zero = [];
  for (let P = min; P <= top; P += (P < 1000 ? 1 : P < 20000 ? 10 : 100)) if (budget.densityFactor(tier, P) === 0) zero.push(P);
  // catalogue rows
  const rows = {};
  for (const group of Object.values(catalog.institutionalCatalog[tier])) for (const [name, row] of Object.entries(group)) {
    if (catalog.isFabricRow(tier, name)) continue;
    rows[name] = { required: !!row.required, exempt: budget.isDensityExempt(tier, name), baseChance: row.baseChance, rare: catalog.isRareRow(tier, name), route: row.tradeRouteRequired, terrain: row.terrainRequired, terrainAccess: row.terrainAccess };
  }
  const exemptRows = Object.fromEntries(Object.entries(rows).filter(([, r]) => r.exempt && !r.required));
  // births at d = 0 at the midpoint (same cells/seeds as the calibration)
  process.env.X46_FORCE_D = '0';
  const midpoint = Math.round(Math.sqrt(min * max));
  POPULATION_RANGES[tier] = { min: midpoint, max: midpoint };
  const tally = { exempt: {}, scalable: {}, other: {} }; let houses = 0; const bySource = {};
  for (let k = 0; k < N; k += 1) {
    const cell = configForIndex(k * TIER_ORDER.length + TIER_ORDER.indexOf(tier));
    const config = tier === 'metropolis' ? birthConfig({ ...DEFAULT_CONFIG, ...cell, settType: 'custom', population: midpoint }) : birthConfig({ ...DEFAULT_CONFIG, ...cell, settType: tier });
    const s = generateSettlementPipeline(config, null, { seed: `x46b-cal-${tier}-${midpoint}-${k}` });
    for (const i of s.institutions) {
      if (catalog.isFabricInstitution(i)) continue;
      const r = rows[i.name];
      if (r?.required) continue;
      houses += 1;
      bySource[i.source] = (bySource[i.source] || 0) + 1;
      const cls = !r ? 'other' : r.exempt ? 'exempt' : 'scalable';
      const key = `${i.name} [${i.source}]`;
      tally[cls][key] = (tally[cls][key] || 0) + 1;
    }
  }
  POPULATION_RANGES[tier] = { ...ORIGINAL[tier] };
  delete process.env.X46_FORCE_D;
  out[tier] = { R: terms.R, realised0: terms.points[0][1], zeroPopulations: zero.length ? [zero[0], zero[zero.length - 1], zero.length] : [], targetAtMin: budget.expectedHousesAt(min) - terms.R, exemptRows, atD0: { midpoint, seeds: N, nonRequiredHousesPerSettlement: houses / N, bySource, perSettlement: Object.fromEntries(Object.entries(tally).map(([c, t]) => [c, Object.fromEntries(Object.entries(t).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v / N]))])) } };
}
process.stdout.write(JSON.stringify(out, null, 1) + '\n');
