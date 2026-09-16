---
name: ""
metadata: 
  node_type: memory
  type: lane-completion
  program: comprehensive-review-fix / VISION WAVE
  lane: V-M — display & creative follow-ons (V-25a..f)
  branch: claude/vision-m
  base: 5d9218c6 (freshly folded composite tip)
  tip: 8816db97
  folded: NO (owner-gated fold)
  date: 2026-07-20
  closure: 1036399 (Δ0 from base; headroom 3601)
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T18:42:29.219Z
---

# VISION LANE V-M shipped — display & creative follow-ons

Six lettered commits on `claude/vision-m` (base 5d9218c6, NOT folded). Every item is a
LAZY leaf → **eager closure Δ = 0** (1,036,399 byte-identical to base; headroom 3,601).

## What shipped (commit / thesis / pin)
- **V-25a be757eb1 — PLAYER-SAFE ROAD SCENE.** New `composeRoadScenePlayerBrief` in
  `src/domain/briefs/roadScene.js`: the inhabitant view — legs + coarse condition WORD (no
  embattlement number/tolls) + PUBLIC gate facts (public-visibility siege by name, foreign
  garrison, festival). Drops the whole ON-THE-ROAD movement layer; a covert (visibility:'gm')
  war front is NEVER named. New player-safe `SOURCE.ROADS_PUBLIC` (citations.js); assembleBrief
  (audience:'player') is the structural backstop. RoadScenePanel gained a **View as DM|Players**
  toggle (AI-dressing stays DM-only). PIN `tests/domain/roadScenePlayerSafe.test.js` — deep-scan
  of the serialized player brief vs an EVERY-SECRET world (the V-11 payload-assertion idiom).
- **V-25b bec8f4bc — THE CAMPAIGN PLAYER VIEW.** Wired the previously-unmounted `get_unlisted_map`
  read path: `adaptUnlistedCampaign` (pure, FAIL-CLOSED, in `galleryUnlisted.js`) reshapes the flat
  RPC payload → `{world:{snapshot,sections}}` ONLY for a real map_with_campaign share with an
  opted-in world; `fetchUnlistedCampaign` = fetch+adapt; `useGalleryPageState` resolves it after a
  settlement miss (`unlistedCampaign`); `GalleryPage` renders new store-free `CampaignPlayerView`
  (CampaignStatePanel + party header). NO migration (get_unlisted_map is a pre-sanitized artifact).
  PIN `tests/lib/unlistedCampaignAdapter.test.js` — reshape + top-level-junk-never-rides + the
  fail-closed gates.
- **V-25c e4517c9f — AGED-MAP FOLLOW-ON (street-level wear).** New `streetWearOps` in
  `ageOverlay.js` — a SEPARATE emitter laying ruts along `model.frame.roads` (most-travelled first,
  fractional offsets, codepoint order). Shares the dormancy wall + V-3 scrub seam. **ageOverlayOps
  and its golden stay byte-identical** (no re-record). Wired into `SettlementMapAgeOverlay`. PIN in
  `ageOverlay.test.js`. **DEFERRED: district renaming echoes** — no per-district name history is
  recorded anywhere in sim state; needs a NEW persisted signal (schema change, owner-gated) — noted
  in ageOverlay.js header.
- **V-25d d6327789 — TIMELAPSE FOLLOW-ONS.** In `timelineTrack.js`: `settlementTimeline` (per-
  settlement drill slice), `serializeTimelapseClip` (deterministic **encode-free JSON frame
  sequence** — NO ffmpeg/raster), `trackSettlementIds`. TimelapsePanel gained a **Drill into**
  picker + **Export clip** button (downloadBlob dynamic-imported at click). buildTimelineTrack
  untouched → timelineTrackGolden byte-identical. PIN in `timelineTrack.test.js`.
- **V-25e becdd38a — RADAR LENSES v1.** New `src/domain/display/trendLens.js`: `buildTrendLenses`
  derives a RETROSPECTIVE population trend reading from the populationHistory ring, band over the
  **population SERIES** (coherent with the arc, robust to plain-number OR {population} formats),
  same AXIS_TUNING thresholds. WhatChangedPanel renders a trend-lens strip. **TREND, NEVER
  PROPHECY** — PIN `tests/domain/trendLensClaimsParity.test.js` (forecast-vocab scan never matches
  + claim↔computation parity + arc-coherence on the plain-number format).
- **V-25f 8816db97 — WORLDMAPTOOLBAR TEACHING TRANCHE.** Brought `WorldMapTourSteps.js` current:
  stale **"Wizard News" → "Realm Inspector"**, advance step teaches interval+Undo, new steps for
  **History** and the **"?" control reference** (added `data-tour="history"` / `data-tour="controls"`
  anchors). PIN `tests/components/worldMapTourSteps.test.js` — every step's anchor must exist in a
  real map component (anti-drift structural guard) + the Wizard-News regression guard.

## Lane-end gate (VERBATIM)
- CLOSURE = **1,036,399** ≤ 1,040,000 (Δ0, headroom 3,601). verify:dist **174/174**.
- full tsc (`tsc -p tsconfig.full.json`) **0 errors**; `check-domain-strict.mjs` **0 (ceiling 0)**.
- Ratchets: anyCast / rawColor / mapPalette / deepCraftKillList / errorCopy / sizeBaseline = **34/34**;
  **zero `title=` attributes added** across the lane (census safe).
- Lint clean on every touched file; python NUL scan = 0 on every created/edited file.

## Hazards banked (durable)
- ⚠️ **townMap domain lint bans `localeCompare`** — a new sort in a townMap/domain file must use
  `compareCodepoint`/`byNameCodepoint` from `domain/deterministicSort.js` (bit me in streetWearOps).
- ⚠️ **`trendBandFromHistory` is DELTA-based** (reads `.delta`); some populationHistory fixtures are
  plain numbers (no delta) → it reads 0/"steady" and CONTRADICTS the visible arc. For any DISPLAY
  trend, band over the POPULATION SERIES (last−first), not the delta sum — see trendLens.js.
- ⚠️ **WhatChangedPanel test forbids "held steady"** in the no-prior case (a causal-substrate lie
  guard, `/held steady/i`) — a population-trend reading of "held steady" collides. trendLens uses
  "has held level" for band 0.
- ⚠️ **new src/domain/display file needs typed index casts** (`/** @type {Record<string,string>} */`
  on lookup objects indexed by `String(x)`) or it trips domain-strict TS7053 (2 errors in trendLens
  until cast).
- ⚠️ **`warFrontsInto` does NOT filter visibility** — it returns covert (visibility:'gm') fronts too.
  Any PLAYER-facing siege read must filter to `visibility==='public'` (fail-closed) itself.
- ⚠️ **assembleBrief(audience:'player') THROWS on any non-player-safe SOURCE** — a player composer
  must tag sections with a source in `PLAYER_SAFE_SOURCES` (I added `ROADS_PUBLIC`); the throw is the
  structural backstop, complementing the every-secret deep-scan pin.
- ⚠️ **get_unlisted_map returns FLAT snake_case** (`world_snapshot`/`world_sections`/`image_url`, no
  `members`/`mapState`) — CampaignStatePanel wants nested camelCase (`world.snapshot`). Adapt
  client-side (adaptUnlistedCampaign); do NOT edit the RPC (it's a pre-sanitized publish-time
  artifact, migration comment forbids a live read).
- ⚠️ **pre-commit hook runs lint-staged `eslint --fix` + a transient `git stash`** on every commit
  (own the tree = safe; it restores). The worktree's `gc.log` warns "too many unreachable loose
  objects" on every commit — cosmetic, NOT mine to `git prune` on a shared tree.

## Not done / deferred (documented)
- V-25c **district renaming echoes** — deferred, no backing data (needs new persisted signal /
  schema change, owner-gated). Documented in ageOverlay.js header.
- Fold + push are owner-gated (lane NOT folded).
