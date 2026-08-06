---
name: gallery-phase2-shipped
description: "GALLERY-2 phase 2 FOLDED into claude/w7-prep @ d17bc07f — five signed deliverables; migrations RENUMBERED 145–148 at fold; hazards: net-current fixture extraction, clampAliveness, hub-route ordering, tsc components pull-in"
metadata: 
  node_type: memory
  created: 2026-07-17
  type: milestone
  scope: "gallery, migrations, seo"
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
---

# GALLERY-2 PHASE 2 — FOLDED into claude/w7-prep @ d17bc07f (2026-07-17)

All five owner-signed deliverables built on `claude/gallery-p2` (base c1d3f6eb, tip
126c95f6, 6 commits) and FOLDED into claude/w7-prep @ d17bc07f. Migrations
**RENUMBERED AT FOLD 146–149 → 145–148** (145 was freed by the BYOK renumber; head
validator: 148 files contiguous; all internal refs updated — test constants, DEPLOY.md
head, migration headers, vocab comment). Lane pins 301 green on the merged tree.
⚠️ claude/surveyor-s3's migrations 145/146 now COLLIDE — renumber to 149/150 at S3's
fold. NOT pushed (the very end).

⚠️ EXTRA HAZARD (bit this wave): pglite suites extract NET-CURRENT function
bodies from migration files — a NEW migration redefining a gallery RPC silently
becomes those tests' fixture, and their table MIRRORS must gain any new columns
(galleryMapMemberCount needed the 147 pair). When adding migrations, grep
tests/security for netCurrentFn of every function you redefine.

## Why
The phase-2 sign-off list (docs/COMPREHENSIVE_REVIEW_PROGRAM.md "GALLERY-2
(PHASE 1)") granted all five on 2026-07-17. This memory carries the mechanisms a
successor needs to extend or fold the wave.

## How to apply
- **Aliveness formula (vetoable JUDGMENT, pinned in tests/lib/galleryAliveness.test.js):**
  `round(100·(0.7·min(pulses,80)/80 + 0.3·ageBandScore))`, band ladder
  .15/.35/.60/.85/1.0 over AGE_BANDS. Snapshot-at-publish exactly like
  gallery_facet_at_war (client Path-A for settlements via galleryMetadataPatch;
  p_facets Path-B for saved_maps via publish_map 149). NULL = unknown ≠ 0.
- **⚠️ Number(null)===0 habitat**: three same-shape bugs during the build
  ("unknown" smeared to score 0). THE fix: `clampAliveness` in
  src/lib/galleryAliveness.js is the ONE null-safe clamp — every new
  read/write/render site must route through it.
- **Tile-chain recreate precedent extended**: 148 = the third 063/071-style
  drop-recreate (helper + 4 dependents; net-current forks: helper←071,
  lists←076, get_gallery_dossier←093). The gallery_title fallback lives ONLY in
  the helper (`coalesce(nullif(btrim(gallery_title),''), name)`) — never add
  per-surface fallbacks.
- **Reactions**: gallery_reactions mirrors gallery_votes posture exactly
  (019 PK-shape + 059 active-account INSERT + 125 shared velocity counter at
  120/h key 'gallery_reaction' + 131 search_path). The six keys live in THREE
  pinned places: table CHECK, RPC guard (both 146), REACTION_VOCAB
  (src/data/galleryReactionVocab.js) — tests/data/galleryReactionVocab.test.js
  locks all three; labels are owner-verbatim, do not copy-edit.
- **Sitemap semantics CHANGED**: per-slug gallery fan-out is now DEFAULT-ON
  keyed on Supabase creds presence (opt-out SITEMAP_INCLUDE_GALLERY=0);
  committed public/sitemap.xml = static 16 + 15 hubs = 31 URLs, byte-pinned
  with the flag forced '0' in tests/build/sitemap.test.js. The 15 hubs derive
  from galleryUtils vocabularies via src/lib/galleryHubs.js — a vocabulary
  change reshapes the hub set AND requires sitemap regeneration.
- **⚠️ Hub routing ordering trap**: the hub PARAM_ROUTES entries must stay
  BEFORE the dossier slug matcher in src/lib/routes.js (/gallery/at-war matches
  the slug pattern) — pinned in tests/lib/galleryHubs.test.js.
- **⚠️ tsc-graph gotcha**: tsconfig.full excludes src/components, but a
  src/lib file importing a components module pulls it into the checked program
  (bit via galleryHubs→galleryUtils; fixed by typing shareGalleryDossier).
- **Isolation artifact RESOLVED**: the branch's 145-gap red dissolved at fold via
  the renumber (no stub needed post-fold).
- Deferral: map/campaign shares have NO gallery_title lane (settlements only —
  the signed scope); seam noted in the final report. Dossier/hub bodies stay
  client-rendered (the standing phase-1 crawlability item, untouched).
