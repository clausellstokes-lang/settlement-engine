---
name: w3-gallery-parity-shipped
description: Walk-lane W3 — the Gallery Maps + Campaigns tabs got the full Settlements-tab layout (filter rail/search/sort/count/empty states); facets bounded to what the list_gallery_maps RPC honors; closure held EXACT.
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-21T17:03:16.122Z
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
---

**Shipped @ 3fb7134b** on branch `claude/w3-gallery-parity` (off composite-r4 `5e23db2d`). The owner's gallery order row 13da1e95: the Maps and Campaigns gallery tabs must carry the full Settlements-tab browse layout, facets adapted per content type. NOT yet folded into the composite — the manager folds per-lane after W1/W2/W3/W4.

## The honesty gate (decisive — do NOT re-derive facets from the card, derive from the RPC)
Both the Maps and Campaigns tabs fetch through the SAME `list_gallery_maps` RPC (net-current = **migration 090**, preserving 065's filter/sort/search body). That function's WHERE/ORDER is the only honest filterable surface:
- **filters** (`normalizeMapFilters` → `p_filters`): `kind`, `backdrop` (image|fmg), `tags`, `hasSettlements` (member_count>0), `importable`. Nothing else.
- **sort** (`p_sort_key`): `most_viewed`, `most_imported`, else `newest`. NO relevance/population/aliveness/name sort for maps (those are settlement-feed keys the maps RPC does not implement).
- **search** (`p_search_query`): ilike over name + gallery_description + tags.

⚠️ **at-war / world-age / aliveness are NOT filterable** — migration 088/147/149 added those facet COLUMNS but the list RPC's WHERE has no arm for them. They stay CARD anatomy only. Adding chips for them would recreate the dead-chip class this program already excised (see `FILTER_ARRAY_KEYS` comment in lib/gallery.js — governmentType/stability were dropped for exactly this).

## Facets chosen per tab (data-shape receipts)
- **Maps tab** (kind pinned `['map']`): backdrop / importable / tags rail (already wired @ c3ae63df) + ADDED search box, sort dropdown (MAP_SORT_OPTIONS), result-count chip. has-settlements STAYS struck (a blank map's member_count is always 0).
- **Campaigns tab** (kind pinned `['map_with_campaign']`): gained the whole layout it lacked — filter rail **backdrop / has-settlements / importable / tags**, search, sort, count, filtered-empty + Clear. ⭐ has-settlements IS shown here (the exact facet struck for blank maps) because a map_with_campaign tile carries a real `member_count` (>0 is meaningful) — this is the "adapted per type" the order asked for.

## Chunk-graph cure held (the +42 B class lives EXACTLY here)
- **MAP_SORT_OPTIONS relocated** `galleryMapsUtils.js` → `galleryMapsFilters.js`. It was test-only in galleryMapsUtils (the share-editor chunk's home); the sort dropdown is rendered by the gallery-chunk tabs, so the catalog MUST live in the gallery-only module or it drags galleryMapsUtils into the gallery chunk → the +42 B rebalance. galleryMapsUtils.test.js's import moved with it.
- **GalleryTopbar generalized** (added `noun` / `countQualifier` / `sortOptions` props; Settlements defaults keep its output byte-identical) and reused by all three tabs. All three tabs + both filter modules are gallery-chunk residents → NO new shared chunk minted.
- **GalleryMapsSidebar** gained a `showHasSettlements` prop (default false → Maps struck; Campaigns passes it true).
- ⭐ **CLOSURE PROVEN EXACT**: two `npm run build`s → first-paint static closure **1,039,974 B / 7 files, byte-identical to the 5e23db2d baseline**. The rebalance did not fire.

## Test change (declared)
`galleryCampaignsTab.test.jsx`: the kind pin `filters: { kind:['map_with_campaign'] }` (exact) relaxed to `expect.objectContaining({ kind:['map_with_campaign'] })` — the campaigns fetch now carries the full `emptyMapFilters` shape (the Maps-tab idiom). +8 new pins (maps search/sort/count; campaigns facets/has-settlements/filtered-empty+clear/sort/search).

## Gate (all executed on the tree, CONFIRMED)
gallery focused + settlements-path + hook = **111 pass / 16 files**; tests/design + tests/lint = **339 pass**; tsc `-p tsconfig.full.json` = 0; domain-strict = 0/ceiling 0; eslint on the 9 touched files = 0 errors (4 PRE-EXISTING set-state-in-effect warnings, 0 new — the debounce effects carry the `useGalleryPageState` disable comment); NUL 0; build + VERIFY_DIST=1 tests/build/ = **220 pass / closure 1,039,974 EXACT**. Routes: bare `/gallery` NOT prerendered (only hub subdirs under dist/gallery/; the ?slug= dynamic seam is unshadowed — prerenderRoutes.test.js "bare /gallery stays dynamic" green under VERIFY_DIST); GalleryPage + useGalleryPageState routing UNTOUCHED.

Related: [[t3b-orphans-wrong-lineage-and-archaeology]] (the +42 B cure origin + galleryMapsFilters.js split), [[cycle2-tranches-complete-halt]] (the closure margin), [[vision-j-lane-complete]] (/gallery never-prerendered law).
