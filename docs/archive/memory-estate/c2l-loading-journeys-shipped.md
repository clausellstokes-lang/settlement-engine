---
name: c2l-loading-journeys-shipped
description: "Slice C2L THE LOADING JOURNEYS (owner-commissioned) BUILT on claude/deep-craft-c2l (side-branch off claude/deep-craft, base 67586c86, NOT folded — manager folds). Three lettered commits: C2L-a eedb67bf (generation film = PipelineReveal backdrop, both media sets shipped), C2L-b fbfa3c0b (realm/FMG reality-mode unfurl in WorldMapStage), C2L-c a8b5d313 (reuse shared clamp01). One progress-scrubbed conductor with a theater/reality mode machine + arrival gate (THE UNIFYING LAW). Taste-gated (loadingJourneyFilm default OFF); eager delta 0 B (both fingerprints in lazy chunks only). Full-suite reds = exactly the 5 known parked goldens. ⚠ NO realm unfurl master exists → parchment floor + video drop-in seam, deferred to the walk."
metadata: 
  node_type: memory
  type: project
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T05:57:57.909Z
---

Slice **C2L — THE LOADING JOURNEYS** (owner-commissioned 2026-07-18; spec on the
ledger branch review-fixes-2026-07-08 at docs/THE_REMAINING_ARCHITECTURE.md §2 Slice
C2L + the ⬛ PERFORMANCE FALLBACK amendment; six engineering laws inherited from
Slice C2). BUILT on **claude/deep-craft-c2l**, a SIDE-BRANCH off claude/deep-craft
(the miniatures precedent), base **67586c86**. NOT folded — the manager folds.

## The three commits
- **C2L-a eedb67bf** — THE GENERATION LOADING JOURNEY. The desk→ordered-tier growth
  film as PipelineReveal's z0 backdrop (behind the reveal card), progress-scrubbed
  by the reveal's own {startedAt,targetMs} so it lands on the tier exactly as the
  dossier arrives. arrived=!!settlement (synchronous ⇒ pure theater). Both media
  sets copied to `public/media/journey-legs/{bg,journey}/` (bg = 6×5.04s ~42 MB,
  journey = 6×2.5s ~10 MB; 26 files, ~53 MB total).
- **C2L-b fbfa3c0b** — THE REALM/FMG LOADING JOURNEY. Reality-mode unfurl over the
  booting FMG iframe, mounted in **WorldMapStage.jsx** (NOT WorldMap — it is a
  hard-600 max-lines hot file; WorldMapStage has headroom and already receives
  bridgeReady). arrived=bridgeReady. Also switched both surfaces from useFlag→`flag()`
  (map-layer house pattern + existing flags mocks lack useFlag).
- **C2L-c a8b5d313** — reuse `clamp01` from src/kernel/math.js (the local one tripped
  tests/lint/clampPrimitiveBaseline.test.js, a burn-DOWN ratchet).

## The architecture (reusable)
- `src/components/loadingJourney/useJourneyConductor.js` — the MODE MACHINE. Pure core
  `computeJourneyFrame` (unit-tested, no timers) maps progress→leg/legT/floorStill;
  the rAF hook owns the single stateful decision (held→arrived edge stamps finalStart).
  THREE BRANCHES = the machine: finalStart set → FINAL ease boundary→1; arrived →
  THEATER scripted 0→1; not-arrived → REALITY crawl-then-FREEZE at the hold boundary.
  THE UNIFYING LAW: the film can never finish before the artifact exists; arrival is
  the only end. Also exports scriptedProgressAt / boundaryFor / defaultHoldBoundary.
- `JourneyFilm.jsx` — 3 layers (z0 still FLOOR always-on / z1 scrubbed per-leg
  `<video>` desktop-fine-pointer-only / z2 ink scrim via opacity, NO rgba). Per-leg
  chapter-split; leg N+1 prefetched. `journeyManifest.js` derives URLs/legs from
  TIER_ORDER (legsForTier=index+1; thorp=1…metropolis=6); only literal is ORIGIN='desk'.
- `RealmUnfurlLoading.jsx` — parchment clip-path unfurl (existing /textures paper-grain,
  no new asset) + a `<video>` DROP-IN SEAM (REALM_UNFURL_VIDEO=null).

## Hazards / gotchas hit (durable)
- ⚠ **NO realm scroll-unfurl master exists.** The masters (~/Desktop/settlementforge-
  marketing-masters) hold only the JOURNEY growth film (already derived to derived-legs/)
  + static gated map plates (world-map-crossroads.png, settlements-mappa.png). The brief
  author assumed an unfurl master in videos/ — it is not there. C2L-b ships the reality
  machine + parchment floor + seam; producing/choosing the unfurl film is DEFERRED to
  the walk (creative/taste + media-production call, vetoable).
- ⚠ **WorldMap.jsx is a hard-600 max-lines hot file** (skipComments+skipBlankLines).
  Adding ~8 code lines tripped it → relocate map-body logic to WorldMapStage.jsx.
- ⚠ **deepCraftKillList is tolerance-0** (`toBe(ceiling)`) AND cross-lane un-editable:
  new src/components code must add ZERO lines matching borderRadius|boxShadow|rgba(|
  the tinted-callout tokens. Scrims = solid token + `opacity`, never rgba. Achieved 0.
- ⚠ **clampPrimitiveBaseline ratchet**: a new local clamp/clamp01 in src/components
  fails it — import from src/kernel/math.js (exports clamp + clamp01).
- ⚠ **flags mocks lack useFlag**: worldMapShellMemo.test mocks flags.js with only
  `flag`. Loading surfaces read `flag('loadingJourneyFilm')` (re-reads each render;
  fine for the URL/reload taste-gate) — not useFlag.
- Lazy-ratchet fingerprints: `::loading-journey:v1:` (JourneyFilm) + `::realm-unfurl:v1:`
  (RealmUnfurl) — both asserted ABSENT from the entry static closure by
  tests/build/loadingJourneyLazy.test.js; empirically only in PipelineReveal-*.js /
  RealmUnfurlLoading-*.js, NOT index-*.js. Eager delta 0 B.

## Flags + walk actions
- `loadingJourneyFilm` (default **false** — stills floor ships; walk flips on) +
  `loadingJourneySetBg` (default true = bg set). BOTH sets ship so the walk compares
  runtime without a rebuild. **The LOSING media set is DELETED at the walk ruling**
  (recorded deferral, owner's call — not the implementer's).
- ⚠ owner taste call at the walk: the thorp segment's playback rate; the realm
  unfurl film choice.

## Verification
Full focused gate green per commit (eslint 0 err, tsc, domain:strict 0, build,
verify:dist 153). Full suite (13,244 tests): reds = exactly the 5 known parked goldens
(generatorGoldenMaster / beliefMapGolden / worldpulseDeityGolden / pdf goldenViewModel
/ aiGroundingBundle.freshness) — the clamp red was the only new one, fixed in C2L-c.
⚠ Under concurrent full-suite load, tests/security/accountStatusDirectWrites.pglite
(hook timeout) and tests/store/advancePauseResume (concurrency re-entrancy) FLAKED;
both GREEN on isolation re-run (49/49). Isolation-re-run those two before trusting a
red on this branch.
