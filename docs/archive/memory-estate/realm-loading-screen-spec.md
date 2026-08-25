---
name: realm-loading-screen-spec
description: "Owner order 2026-07-21 — the Realm's loading screen (first open + map generation) is the desk→map-travel→scroll-arrival video, runtime-condensed, replacing the Azgaar still"
metadata: 
  node_type: memory
  type: project
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T16:52:07.218Z
---

# Realm loading screen = the map-travel video (owner order, 2026-07-21)

When the Realm is FIRST OPENED, and when a map is GENERATING, the loading
screen must be the video of going from the desk to traveling over a map and
arriving at a scroll — "condensed to the appropriate length" — instead of the
Azgaar still that currently shows. The owner states the video already exists
"somewhere in the folder" (search public/media/** first; it is NOT the
settlement-growth journey-legs set, which is desk→thorp→…→metropolis).

**Why:** the walk's immersion doctrine ([[owner-marketing-doctrine]]) — loading
moments are experience surfaces; the realm's loader should travel, not sit.

**How to apply:**
- Locate the asset by content, not name guesses; if it is genuinely absent
  from the repo, STOP and report (it may live only in the Desktop archive —
  and [[no-ffmpeg-on-manager-machine]] means media re-encode lanes BLOCK).
- "Condensed" = RUNTIME condensation (playbackRate increase or currentTime
  windowing over the all-keyframe file, the JourneyFilm idiom), never
  re-encoding on this machine.
- Reuse the loadingJourney discipline: lazy-only (zero eager bytes,
  loadingJourneyLazy-style pin), reduced-motion + coarse-pointer fallback =
  the current still, conductor-style sync to actual load duration.
- First assigned: W1 amendment 4 (2026-07-21). If W1 lands without it,
  this spec is the standing order for the next lane.
