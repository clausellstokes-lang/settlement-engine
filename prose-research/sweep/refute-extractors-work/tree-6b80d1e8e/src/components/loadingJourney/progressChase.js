/**
 * progressChase.js — THE PROGRESS-SCRUB CHASE LAW (owner order, 2026-07-22:
 * the realm journey video must "move only with the progress of the load").
 *
 * The owner-supplied master (public/videos/realm-journey.mp4, 15.042 s) is NOT
 * all-keyframe — it ships an `stss` sync-sample table — so HARD-SEEKING it every
 * frame would thrash the decoder and flash. Instead the video PLAYS FORWARD at a
 * modulated playbackRate that CHASES the load's real progress: runtime condensation
 * over the shipped file, never a re-encode (no ffmpeg on this machine). Forward
 * decode is smooth at any rate; a hard seek is reserved for LARGE jumps only.
 *
 * THE LAW, per animation frame, given real load progress p∈[0,1] and duration d:
 *   target = clamp(p·d, 0, d − EPS)
 *   gap    = target − currentTime
 *     • gap > SNAP        → SEEK to target. A big jump — a fresh mount catching up to
 *                            in-flight progress, or a coarse phase snap. One hard seek.
 *     • gap ≤ BACK_DEAD   → HOLD (pause). Caught up, stalled, or (defensively) a
 *                            backward request. NEVER seek backward — progress is
 *                            monotone by contract; a glitch must not rewind the film.
 *     • otherwise         → PLAY forward at rate = clamp(targetVel + gap·KP, MIN, MAX).
 *                            targetVel (video-seconds advanced per real-second) is the
 *                            FEEDFORWARD so a SLOW load glides in slow-motion instead
 *                            of stutter-stepping; gap·KP is the FEEDBACK that closes
 *                            the residual. A stall falls out for free: the target
 *                            stops, the video catches up, gap→0, and it pauses.
 *
 * Pure + deterministic (no timers, no DOM) so the monotone / no-backward-seek / snap
 * / stall properties are unit-tested directly, and a full scrub can be simulated
 * against the real asset duration with no decode (the computeJourneyFrame idiom:
 * pure core + a thin rAF shell in ProgressJourneyOverlay).
 */

export const CHASE = Object.freeze({
  // Keep off the exact end — seeking to `duration` stalls some decoders on a blank
  // final range; the last EPS is imperceptible and the fade covers it.
  EPS: 0.05,
  // gap beyond this ⇒ one hard seek (catch-up / coarse phase jump) rather than a
  // multi-second fast-forward that would overrun the decode buffer.
  SNAP: 1.5,
  // sub-frame gap ⇒ hold; this bound is also the "never go backward" guard.
  BACK_DEAD: 0.02,
  // feedback gain (per second) closing the residual gap.
  KP: 1.5,
  // slowest smooth forward rate (a muted slow-motion glide reads clean).
  MIN_RATE: 0.1,
  // fastest catch-up before a snap would be cleaner.
  MAX_RATE: 6,
});

/**
 * computeChaseStep — resolve ONE frame's action for the scrub controller.
 *
 * @param progress    real load progress in [0,1] (already monotone by contract)
 * @param duration    video duration (s); ≤0 / NaN ⇒ metadata not ready yet
 * @param currentTime the video element's current time (s)
 * @param targetVel   feedforward: video-seconds the target advances per real-second
 * @returns { target, seekTo, play, playbackRate }
 *   seekTo: number ⇒ perform a hard seek to it; null ⇒ no seek.
 *   play:   true ⇒ ensure playing at playbackRate; false ⇒ pause/hold.
 */
export function computeChaseStep({ progress, duration, currentTime, targetVel = 0 }, cfg = CHASE) {
  // No usable duration yet (metadata not loaded / the 20 MB file still arriving):
  // HOLD. The overlay shows its opaque floor and the chase begins the instant
  // duration lands — starting from WHEREVER the load has reached by then (the first
  // real step then snaps forward). The overlay serves the load, never blocks it.
  if (!(duration > 0) || Number.isNaN(duration)) {
    return { target: 0, seekTo: null, play: false, playbackRate: 1 };
  }

  const p = progress < 0 ? 0 : progress > 1 ? 1 : progress;
  const target = Math.max(0, Math.min(p * duration, duration - cfg.EPS));
  const cur = Number.isFinite(currentTime) ? currentTime : 0;
  const gap = target - cur;

  if (gap > cfg.SNAP) {
    return { target, seekTo: target, play: false, playbackRate: 1 };
  }
  if (gap <= cfg.BACK_DEAD) {
    // Caught up, stalled, or a would-be-backward request — hold. Never rewind.
    return { target, seekTo: null, play: false, playbackRate: 1 };
  }
  const vel = targetVel > 0 ? targetVel : 0;
  const rate = Math.max(cfg.MIN_RATE, Math.min(cfg.MAX_RATE, vel + gap * cfg.KP));
  return { target, seekTo: null, play: true, playbackRate: rate };
}
