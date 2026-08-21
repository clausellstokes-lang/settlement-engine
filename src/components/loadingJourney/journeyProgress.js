/**
 * journeyProgress.js — the MAP-GENERATION load→[0,1] mapping + the socket path
 * (owner order, 2026-07-21 + re-issued 2026-07-22, verbatim: "the video of the map
 * moving that move only with the progress of the load").
 *
 * MAP GENERATION (the Create-flow reveal, PipelineReveal): the 17-step pipeline
 * history the engine actually ran. `pipelineStepFraction` = played/total — TRUE
 * per-step progress, monotone because the reveal only advances its step index.
 *
 * ⚠ CHUNK-SHARE DISCIPLINE (the Wave-B +42 B shared-chunk lesson): this module is
 * reached ONLY from lazy chunks (PipelineReveal + the ProgressJourneyOverlay video
 * layer). The REALM-boot creep lives in useRealmLoadProgress.js instead — the realm
 * surface pulls that hook into WorldMap's (lazy) chunk, so if the realm math lived
 * HERE it would make journeyProgress a chunk SHARED with WorldMap's static closure,
 * and its filename would land in the eager __vite__mapDeps manifest (+~41 first-paint
 * bytes). Keeping the two mappings in separate modules keeps this one off first paint.
 *
 * Zero fingerprint, zero DOM. TIER-SPEED LAW: no per-tier constants — runtime
 * condensation is inherently tier-matched because the video tracks whatever real
 * progress the surface reports (more steps ⇒ slower reported progress; the chase fits).
 */

import { clamp01 } from '../../kernel/math.js';

// The socket contract path. The owner-supplied master lands here (present 2026-07-22,
// 15.042 s, ~20 MB). When absent the overlay falls back to the current presentation.
export const JOURNEY_VIDEO_SRC = '/videos/realm-journey.mp4';

/**
 * pipelineStepFraction(playedSteps, totalSteps) — the map-generation surface's real
 * progress: the fraction of recorded pipeline steps the reveal has played. 0 before
 * the first step, 1 when all are marked complete. Monotone by construction (the
 * reveal's active index only increases). total ≤ 0 → 0 (an empty history shows the
 * floor, never NaN).
 */
export function pipelineStepFraction(playedSteps, totalSteps) {
  if (!(totalSteps > 0)) return 0;
  return clamp01(playedSteps / totalSteps);
}
