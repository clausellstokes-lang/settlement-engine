---
name: loading-journey-socket-shipped
description: "The progress-scrubbed realm journey video socket (owner order 2026-07-21/22) — a lazy overlay that scrubs /videos/realm-journey.mp4 by REAL load progress on the realm-boot + map-gen surfaces; asset PRESENT (owner-supplied 2026-07-22), dormant-safe fallback when absent."
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-22T07:24:24.368Z
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
---

# Loading-journey socket — SHIPPED on br claude/loading-journey (2026-07-22)

Built the socket for the owner order (2026-07-21 + re-issued 2026-07-22, verbatim):
"the video of 'settlementforge map loading v1.114.2' should change to the video of
the map moving that move only with the progress of the load." One shared lazy
overlay, two mount points, scrubbed by each surface's REAL load progress.

## The asset — PRESENT (not absent, contrary to the original dispatch)
- Path **public/videos/realm-journey.mp4** (served `/videos/realm-journey.mp4`).
  Owner-supplied + committed on the composite 2026-07-22 (asset commit `8cfcd1c0`
  atop `cafd0c33`; my branch was rebased forward onto it — I never added the binary).
- **Duration 15.042 s**, ~20 MB, mvhd v0, timescale 1000. Carries an `stss`
  sync-sample table ⇒ **NOT all-keyframe** — which is exactly why the scrub must be
  a playbackRate chase, not per-frame hard-seeks (seeks thrash a non-keyframe file).
- The earlier "zero video in repo" claim was about THIS specific asset; the
  journey-legs growth set (public/media/journey-legs/**) is a DIFFERENT video and is
  NOT the realm loader (per realm-loading-screen-spec.md).

## Architecture (src/components/loadingJourney/)
- **ProgressJourneyOverlay.jsx** (LAZY, fingerprint `::progress-journey:v1:`) — the
  video layer + rAF chase + reduced-motion/coarse-pointer fallback + completion fade
  + decode teardown. Feature-detects the asset (cached HEAD probe, no console spew)
  and renders `fallback` (the CURRENT presentation) when absent/reduced-motion.
- **progressChase.js** — pure `computeChaseStep`: play forward at
  `clamp(targetVel + gap·KP, 0.1, 6)`, SNAP-seek only when gap > 1.5 s (catch-up),
  HOLD when gap ≤ 0.02 s (caught up / stalled / never-backward). Feedforward
  `targetVel` makes a slow load glide instead of stutter-step.
- **journeyProgress.js** — `pipelineStepFraction(played,total)` (map-gen) + the
  `JOURNEY_VIDEO_SRC` const. Reached ONLY from lazy chunks.
- **useRealmLoadProgress.js** — realm creep `computeRealmLoadFraction` (pure) + its
  rAF hook. See hazards.
- **useJourneyVideoAsset.js** — cached fetch-HEAD probe + hook.

## Wiring (file:line at ship)
- Realm: **WorldMapStage.jsx** — `useRealmLoadProgress({ready:mapReady, bridgeReady,
  active:!imageMode&&!mapError, runId:mapReloadKey})`; overlay mounted `key=mapReloadKey`,
  zIndex 4 over the FMG iframe, `fallback` = RealmUnfurlLoading (when the
  loadingJourneyFilm taste-gate is on, currently TRUE) else null.
- Map-gen: **PipelineReveal.jsx** — `progress=pipelineStepFraction(activeIndex,
  steps.length)`, `holdAtEnd`, zIndex 0 backdrop, `fallback` = the existing JourneyFilm.

## ⚠ HAZARDS / durable facts
- **bridgeReady and mapReady are COINCIDENT** — both set only in the mapBridge
  'ready' handler (useMapBridge.js), + a 15 s watchdog. So the realm boot exposes NO
  fine-grained progress; the loader TRAVELS on a bounded time-creep (asymptote < 0.9)
  and SNAPS to 1 on ready. The `bridgeReady` milestone in computeRealmLoadFraction is
  forward-compatible only (fires nothing today).
- **⚠ The Wave-B +42 B shared-chunk trap BIT here and is CURED** — putting the realm
  math in journeyProgress.js made that module SHARED between WorldMap's static closure
  (via useRealmLoadProgress) and the lazy overlay/pipeline chunks, so vite emitted it
  as a shared chunk whose filename landed in the eager `__vite__mapDeps` manifest =
  **+41 first-paint bytes** (closure 1,039,997 vs baseline 1,039,956; budget 1,040,000
  has only ~44 B headroom). CURE (inline-to-de-share): realm creep lives in
  useRealmLoadProgress.js (inlines into WorldMap's lazy chunk); journeyProgress.js is
  reached ONLY from lazy chunks. Restored **Δ0 = 1,039,956 exactly**. DO NOT move the
  realm math back into a module shared with WorldMap's static closure.
- **Teardown must capture the <video> at mount**, not read videoRef.current in the
  passive cleanup — React detaches host refs during commit, so the cleanup would see
  null and never stop the 20 MB decode.
- **The overlay serves the load, never blocks it** — the 20 MB file downloads WHILE
  the map/pipeline loads; the chase HOLDS on the opaque floor until `duration` lands,
  then begins from wherever progress has reached (first step snaps forward).
- **Lazy ratchet**: `::progress-journey:v1:` was added to
  tests/build/loadingJourneyLazy.test.js JOURNEY_FINGERPRINTS — VERIFY_DIST confirms
  it stays off first paint.
- **loadingNarrationRatchet** pins bare `/['"`>]Loading\b/` in src/components at
  exactly 34 (comments counted) — my ProgressJourneyOverlay header had to avoid the
  literal `"Loading…"` to stay at 34.

## Gate (all CONFIRMED against fresh build, 2026-07-22)
New/focused tests 31✓ + smoke/UI 31✓ + copy 98✓ + build VERIFY_DIST 227✓; domain-strict
0; tsc 0; eslint 0 errors (my files add no new warnings); closure Δ0 (1,039,956).
Present-state proven in progressJourneyOverlay.test.jsx (probe→true ⇒ video mounts) +
realmJourneyAsset.test.js (runIf-guarded, dormant-safe); absent-state ⇒ fallback.

## Open / deferred
- No feature flag: the overlay lights on asset PRESENCE (owner's standing order, not a
  taste experiment) — JUDGMENT, vetoable. Reduced-motion + coarse-pointer ⇒ fallback
  (law #4; protects mobile from the 20 MB pull) — a one-line change if the owner wants
  video on mobile.
- Branch claude/loading-journey is UNPUSHED, awaiting the manager's fold.
