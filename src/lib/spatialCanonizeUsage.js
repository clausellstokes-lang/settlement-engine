/**
 * spatialCanonizeUsage.js — coarse, id-free summary of a SPATIAL CANONIZE for product
 * usage telemetry: distinguishes the entitled spatial canon from a plain world
 * canonize, and records which map features the canon lit + its digest-size band.
 *
 * ── Why this is its own file (do NOT merge into spatialUsage.js) ──────────────
 * See spatialUsage.js's header: a single telemetry module imported by BOTH lazy
 * bodies (advance + canonize) becomes a SHARED Rollup chunk whose filename leaks a
 * ~44-byte string into the eager entry's modulepreload manifest (the FP-R hazard,
 * measured against the CLOSURE_BUDGET_BYTES ratchet). This file is imported ONLY by
 * the lazy campaignSpatialCanonize.js, so it folds into that consumer's chunk →
 * zero eager bytes. Keep it dependency-free and single-importer.
 *
 * ── Determinism / prop hygiene ───────────────────────────────────────────────
 * Pure read of the frozen digest (already built); no mutation, no engine feedback.
 * Emits only enums / bands / booleans / small ints — never a settlement id or name.
 */

const isObj = (v) => !!v && typeof v === 'object';

// Frozen-digest size band (canon geometry weight — 5/15/30-settlement maps land
// ~47 / 61 / 87 KB per the keystone receipts; the hard ceiling is 400 KB).
function digestBytesBand(bytes) {
  const n = Number(bytes) || 0;
  if (n < 20_000) return 'lt_20k';
  if (n < 60_000) return '20_60k';
  if (n < 120_000) return '60_120k';
  if (n < 250_000) return '120_250k';
  return 'gt_250k';
}

/**
 * Coarse spatial-CANONIZE usage from the frozen digest. A plain world canonize
 * carries no `spatial` prop (absence = not-spatial); this marks the spatial path
 * and records the version, the lit map features, and the size band.
 * @param {any} digest - the frozen spatial digest
 * @param {number} spatialCanonVersion - post-bump version (1 = first canonize)
 * @param {number} digestBytes - JSON byte size of the digest
 */
export function extractCanonizeUsage(digest, spatialCanonVersion, digestBytes) {
  const d = isObj(digest) ? digest : {};
  const reserved = isObj(d.reserved) ? d.reserved : {};
  const version = Number.isInteger(spatialCanonVersion) ? spatialCanonVersion : 1;
  return {
    spatial: true,
    spatial_canon_version: version,
    is_recanonize: version > 1,
    geometry_version: Number.isInteger(d.spatialGeometryVersion) ? d.spatialGeometryVersion : undefined,
    cost_law_version: Number.isInteger(d.costLawVersion) ? d.costLawVersion : undefined,
    overlay_version: Number.isInteger(d.overlayVersion) ? d.overlayVersion : undefined,
    has_sea_lanes: reserved.seaLanes != null,
    has_teleport: reserved.teleportEdges != null,
    has_seasonal: reserved.seasonalOverlay != null,
    digest_bytes_band: digestBytesBand(digestBytes),
  };
}
