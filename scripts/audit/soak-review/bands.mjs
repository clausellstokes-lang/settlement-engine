/**
 * scripts/audit/soak-review/bands.mjs — THE PER-FIELD DISTRIBUTIONS WITH THE OWNER'S BANDS MARKED
 * (lane SOAK-2, 2026-11-04; the owner, 2026-11-03: "look at the distribution of every aspect in
 * each of these both individually and in relationship to other facts of the dossier").
 *
 * Every field the walk reports (`aggregate.mjs`, fields.json) already carries its per-tier
 * quantiles. This marks the fields a band of the owner's covers and reads each tier against it:
 * the median inside or not, and the share of settlements outside. The bands are the owner's
 * and the ledger's, as docs/DESIGN_X46_SCALE_TRAIN.md §1 quotes them:
 *   population   the owner's table (2026-11-02): thorp 5–30 … metropolis 15,000+;
 *   institutions the ruled I4 reading (rung 1B §3, 2026-11-04; lane F5 replaced the superseded
 *                1–3 / 2–6 / 5–14 count proposal): each settlement's non-fabric houses
 *                (`src/data/institutionalCatalog.js :: isFabricInstitution`) divided by
 *                `src/data/institutionBudget.js :: expectedHousesAt` at its OWN population; the
 *                band is that ratio within ±40% (0.6–1.4) at every tier, read per tier as the
 *                median ratio and the share of settlements outside (`housesReading`);
 *   named NPCs   the ledger's figures: 1–2 … 18+.
 * No other field has a band of the owner's; the dry run's §3 key figures are reported, unbanded.
 * Pure.
 */
import { OWNER_BANDS } from './checks.mjs';
import { isFabricInstitution } from '../../../src/data/institutionalCatalog.js';
import { expectedHousesAt } from '../../../src/data/institutionBudget.js';

export const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

export const FIELD_BANDS = Object.freeze({
  population: Object.freeze({
    source: "the owner's table, docs/DESIGN_X46_SCALE_TRAIN.md §1 (checks.mjs :: OWNER_BANDS)",
    paths: Object.freeze(['population', 'chain.population']),
    bands: OWNER_BANDS,
  }),
  npcs: Object.freeze({
    source: 'the named-NPC band on the ledger, docs/DESIGN_X46_SCALE_TRAIN.md §1',
    paths: Object.freeze(['chain.npcCount', 'npcs.#']),
    bands: Object.freeze({ thorp: [1, 2], hamlet: [2, 4], village: [4, 7], town: [6, 12], city: [12, 18], metropolis: [18, Infinity] }),
  }),
});

const r3 = (x) => Math.round(x * 1000) / 1000;

/** I4's tolerance: a settlement is outside when its houses sit beyond ±40% of its anchor. */
export const HOUSES_TOLERANCE = 0.4;
const HOUSES_BAND = Object.freeze([r3(1 - HOUSES_TOLERANCE), r3(1 + HOUSES_TOLERANCE)]);
const HOUSES_PATH = 'houses ÷ anchor';
const HOUSES_SOURCE = 'ruling I4 (rung 1B §3): non-fabric houses ÷ institutionBudget.js :: expectedHousesAt(own population), outside beyond ±40%';

/**
 * One settlement's houses against its anchor (ruling I4).
 * @param {{ population?: number, institutions?: Array<{ name?: string, isCustom?: boolean, source?: string }> }} s
 * @returns {{ houses: number, anchor: number, ratio: number }}
 */
export function housesReading(s) {
  const houses = (s?.institutions || []).filter((i) => !isFabricInstitution(i)).length;
  const anchor = expectedHousesAt(Number(s?.population));
  return { houses, anchor: r3(anchor), ratio: anchor > 0 ? r3(houses / anchor) : 0 };
}

/** @param {number[]} sorted @param {number} p */
const quantile = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))))];

/**
 * The institutions band, per tier: the median of houses ÷ anchor, p10–p90, and the share outside.
 * @param {Array<{ ratio: number }|undefined>} houses index-aligned with tierOf
 * @param {string[]} tierOf
 */
function housesBand(houses, tierOf) {
  const [low, high] = HOUSES_BAND;
  const byTier = {}; const outside = [];
  for (const t of TIERS) {
    const v = []; for (let k = 0; k < tierOf.length; k += 1) if (tierOf[k] === t && typeof houses[k]?.ratio === 'number') v.push(houses[k].ratio);
    if (!v.length) continue;
    const sorted = v.slice().sort((a, b) => a - b);
    const median = r3(quantile(sorted, 0.5));
    const over = v.filter((x) => x > high).length; const under = v.filter((x) => x < low).length;
    const medianInside = median >= low && median <= high;
    byTier[t] = { median, p10: r3(quantile(sorted, 0.1)), p90: r3(quantile(sorted, 0.9)), band: [low, high], medianInside, outsideShare: r3((over + under) / v.length), over, under, n: v.length };
    if (!medianInside) outside.push({ path: HOUSES_PATH, band: 'institutions', tier: t, median, low, high, outsideShare: byTier[t].outsideShare });
  }
  return { row: { path: HOUSES_PATH, band: 'institutions', source: HOUSES_SOURCE, byTier }, outside };
}

/**
 * @param {Array<{ path: string, kind: string, byTier: Record<string, { median?: number, p10?: number, p90?: number }> }>} fields
 * @param {(path: string) => Array<number|undefined>} valuesOf per-settlement values, index-aligned with tierOf
 * @param {string[]} tierOf
 * @param {Array<{ ratio: number }|undefined>} [houses] `housesReading` per settlement, index-aligned with tierOf
 */
export function bandReadings(fields, valuesOf, tierOf, houses = []) {
  const rows = []; const outside = [];
  for (const [name, spec] of Object.entries(FIELD_BANDS)) {
    for (const path of spec.paths) {
      const f = fields.find((x) => x.path === path && x.kind === 'numeric');
      if (!f) continue;
      const vals = valuesOf(path) || [];
      const byTier = {};
      for (const t of TIERS) {
        const q = f.byTier[t]; const band = spec.bands[t];
        if (!q || q.median == null || !band) continue;
        const [low, high] = band;
        const inT = []; for (let k = 0; k < tierOf.length; k += 1) if (tierOf[k] === t && typeof vals[k] === 'number') inT.push(vals[k]);
        const out = inT.filter((v) => v < low || v > high).length;
        const medianInside = q.median >= low && q.median <= high;
        byTier[t] = { median: q.median, p10: q.p10, p90: q.p90, band: [low, high], medianInside, outsideShare: inT.length ? r3(out / inT.length) : 0, n: inT.length };
        if (!medianInside) outside.push({ path, band: name, tier: t, median: q.median, low, high, outsideShare: byTier[t].outsideShare });
      }
      rows.push({ path, band: name, source: spec.source, byTier });
    }
  }
  if (houses.some(Boolean)) { const h = housesBand(houses, tierOf); rows.push(h.row); outside.push(...h.outside); }
  return { rows, outside };
}
