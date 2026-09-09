# W4c Implementer Brief — Gallery Import (+ share opt-in)

Opus implementer, Phase 5 Reunification W4c, /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; manager reviews + commits. BINDING:
docs/PHASE5_REUNIFICATION.md + memory/feature-parity-ledger.md §6 (Gallery). REFERENCE
(read-only): /Users/cstokes/Desktop/settlement-generator/settlement-engine.

FENCE: src/components/gallery/**, src/store/campaignSlice.js, src/lib/gallery.js. NOT
yours: settlements/**, map/**, account/**, OutputContainer. NO git add/commit/stash.

## Items

1. IMPORT A SHARED SETTLEMENT (ledger §6, ranked #3 — single largest gallery gap). ABSENT
   end-to-end in OURS. Adopt: the import button/flow on GalleryDetail (their
   GalleryDetail.jsx:244-276), the `importDossier` hook action (their :304-324), and the
   store action `importGallerySettlement` (their campaignSlice.js:628). VERIFY FIRST that a
   shared gallery entry persists enough data to reconstruct a saved settlement (grep OUR
   gallery share/publish path + the gallery row shape). If the shared payload is a snapshot
   sufficient to import → wire it. If it only stores facets/preview (not the full settlement)
   → the import needs a server change (an RPC to fetch the full shared dossier) which is an
   ABSENT dep: wire the client path against whatever OUR share persists, and STOP+report the
   server gap precisely. Premium note: importing INTO a campaign is Cartographer (their
   ledger: "fork one into your own Library with Cartographer"); sharing stays free. Gate it.

2. SHARE FLOW: "Allow others to import" opt-in + facet snapshot (ledger §6). ShareToGallery:
   add the import opt-in toggle (data layer already persists `gallery_importable`/`allowImport`
   per the RQ report) + capture the culture/prosperity/deity/atWar facet snapshot +
   realmArcSummary (their ShareToGallery.jsx:121,136-167). OURS `suggestedTagsFor` reads
   unpersisted paths and drops terrain/government/stability tags — fix the tag source.

3. PER-MEMBER IMPORT TOGGLE (ledger §6 — RQ deferred this to here). Now that import exists,
   un-hardcode `importable={false}` in ShareToGallery (~:319-325) so the per-member override
   works via GalleryMemberVisibility.

4. FACET RECONCILIATION (ledger §6). OURS facets = government/stability; THEIRS =
   culture/prosperity/hasDeity/importable. Reconcile the facet set (add the missing facets;
   keep OUR working ones) + facet-count badges. Don't regress OUR `setSharedDossierMeta` SEO
   on detail (OURS-BETTER).

NOT in this wave (absent backend = Phase 6 / separate): the Gallery MAPS orphans
(GalleryMapsSidebar/MapGalleryDetail) need an absent `list_gallery_maps` filter RPC —
leave them for a data-layer wave.

## Laws + gates
Preserve OUR gallery logic; premium-gate import; free share unchanged; no deity NAMES to
anon via facets (hasDeity is a boolean facet, not a name). eslint clean; targeted gallery
tests + a new test pinning import is premium-gated and share-opt-in persists; typecheck +
strict; build + verify:dist (budget); goldens byte-identical. Report per-item status, the
share-payload-sufficiency finding (can OUR share reconstruct a settlement?), any server gap,
files + line counts, gate results.
