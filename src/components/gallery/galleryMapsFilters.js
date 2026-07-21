// The maps-tab FILTER MODEL — the dependency-free half of what was
// galleryMapsUtils.js, split out when the T5 orphaned-components ruling wired
// GalleryMapsSidebar into GalleryMaps (2026-07-21).
//
// WHY A SEPARATE FILE (chunk-graph, not taste): galleryMapsUtils also carries
// the campaign-facet derivations (TIER_ORDER / warStatus / resolveTerrain /
// galleryAliveness imports) consumed by MapShareEditor, which rides the
// MapShareEditorOverlay chunk. When the gallery chunk started importing the
// module too, Rollup extracted it into a NEW shared chunk — whose filename in
// the entry's dep map alone cost +42 eager bytes and broke the first-paint
// closure budget (the known shared-across-two-lazy-chunks rebalance). Keeping
// the filter model here, imported ONLY by the gallery tab, and the campaign
// facets there, imported ONLY by the share editor, gives every module a single
// chunk home and holds the closure at its pinned byte count.
// @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).

// backdrop_kind facet — an uploaded image vs procedurally generated terrain.
export const BACKDROP_OPTIONS = Object.freeze([
  ['image', 'Image backdrop'],
  ['fmg', 'Generated terrain'],
]);

// The empty maps-filters shape — the single source of truth for "no narrowing"
// (the GalleryMaps initial state + its Clear reset). `importable` is the owner
// import opt-in facet (saved_maps.gallery_importable, migration 072). kind and
// hasSettlements stay in the shape for normalizeMapFilters even though the
// narrowed maps tab never sets them (GALLERY-2 phase 2). A fresh copy each
// call so callers can mutate freely without sharing array refs.
export function emptyMapFilters() {
  return { kind: [], backdrop: [], tags: [], hasSettlements: false, importable: false };
}

/**
 * The union of tags across the fetched items, lowercased and de-duped, sorted
 * for a stable chip order. The maps vocabulary is dynamic (owner-authored), not
 * a fixed catalog, so it is derived from the batch rather than declared.
 */
export function deriveTagVocabulary(items = []) {
  const seen = new Set();
  for (const item of Array.isArray(items) ? items : []) {
    const tags = Array.isArray(item?.tags) ? item.tags : [];
    for (const tag of tags) {
      const norm = String(tag || '').trim().toLowerCase();
      if (norm) seen.add(norm);
    }
  }
  return Array.from(seen).sort();
}

/** Count of active facets — drives the "Clear" affordance and section badges. */
export function activeMapFilterCount(filters = {}) {
  let sum = 0;
  sum += Array.isArray(filters.kind) ? filters.kind.length : 0;
  sum += Array.isArray(filters.backdrop) ? filters.backdrop.length : 0;
  sum += Array.isArray(filters.tags) ? filters.tags.length : 0;
  sum += filters.hasSettlements ? 1 : 0;
  sum += filters.importable ? 1 : 0;
  return sum;
}
