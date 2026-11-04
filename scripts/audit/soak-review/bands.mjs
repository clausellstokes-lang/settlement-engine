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
 *   institutions the house budget on the ledger (2026-11-02, not vetoed): 1–3 … 70+ — counted
 *                there WITHOUT the fabric rows (dwellings, water, church access); the record's
 *                count today includes them, so a reading above the band is partly that;
 *   named NPCs   the ledger's figures: 1–2 … 18+.
 * No other field has a band of the owner's; the dry run's §3 key figures are reported, unbanded.
 * Pure.
 */
import { OWNER_BANDS } from './checks.mjs';

export const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

export const FIELD_BANDS = Object.freeze({
  population: Object.freeze({
    source: "the owner's table, docs/DESIGN_X46_SCALE_TRAIN.md §1 (checks.mjs :: OWNER_BANDS)",
    paths: Object.freeze(['population', 'chain.population']),
    bands: OWNER_BANDS,
  }),
  institutions: Object.freeze({
    source: 'the institution budget on the ledger, docs/DESIGN_X46_SCALE_TRAIN.md §1 (fabric rows excluded there, included in the record today)',
    paths: Object.freeze(['chain.institutionCount', 'institutions.#']),
    bands: Object.freeze({ thorp: [1, 3], hamlet: [2, 6], village: [5, 14], town: [12, 35], city: [30, 75], metropolis: [70, Infinity] }),
  }),
  npcs: Object.freeze({
    source: 'the named-NPC band on the ledger, docs/DESIGN_X46_SCALE_TRAIN.md §1',
    paths: Object.freeze(['chain.npcCount', 'npcs.#']),
    bands: Object.freeze({ thorp: [1, 2], hamlet: [2, 4], village: [4, 7], town: [6, 12], city: [12, 18], metropolis: [18, Infinity] }),
  }),
});

const r3 = (x) => Math.round(x * 1000) / 1000;

/**
 * @param {Array<{ path: string, kind: string, byTier: Record<string, { median?: number, p10?: number, p90?: number }> }>} fields
 * @param {(path: string) => Array<number|undefined>} valuesOf per-settlement values, index-aligned with tierOf
 * @param {string[]} tierOf
 */
export function bandReadings(fields, valuesOf, tierOf) {
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
  return { rows, outside };
}
