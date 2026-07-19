/**
 * store/deitySnapshot.js — the pure deity-snapshot builder, extracted from
 * settlementDeityHelpers.js (de-eager lane, 2026-07-19).
 *
 * WHY A LEAF: settlementDeityHelpers is now reached ONLY by dynamic import
 * (the async setPrimaryDeity/imposeCult store actions) so its customRegistry +
 * religionState imports ride a lazy chunk. EventComposerDeityField needs ONLY
 * this snapshot builder — a static import of the whole helpers module would
 * re-create the mixed static/dynamic chunk Vite warns about and couple the
 * composer to the registry chunk. Zero imports; settlementDeityHelpers
 * re-exports it verbatim so the "byte-identical to the store actions" mirror
 * contract keeps a single source of truth.
 */

/** Build the self-contained deity snapshot from an authored deity record. */
export function deitySnapshotFrom(raw) {
  return {
    name: raw.name,
    alignmentAxis: raw.alignmentAxis,
    temperamentAxis: raw.temperamentAxis,
    rankAxis: raw.rankAxis,
    // lawAxis (B5) — a legacy 3-axis deity has none; mutate.js defaults it to
    // 'neutral' in the embed, so the snapshot stays self-contained either way.
    lawAxis: raw.lawAxis,
    ...(raw.domain ? { domain: raw.domain } : {}),
  };
}
