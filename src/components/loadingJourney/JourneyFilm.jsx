/**
 * JourneyFilm.jsx — THE LOADING JOURNEY film layer (Slice C2L).
 *
 * A progress-scrubbed backdrop that renders the growth film as three stacked
 * layers, exactly the microsite architecture translated to React:
 *   z0  THE FLOOR — the crisp stop still, ALWAYS present. The complete journey
 *       renders from stills alone with the film entirely absent (engineering
 *       law #1); the film is a progressive enhancement, never a dependency.
 *   z1  THE FILM — the current travel leg's <video>, kept PAUSED and scrubbed
 *       (currentTime = legT * duration) by the conductor's progress. It fades in
 *       only when the bytes are ready (videoReady) and fades at each leg's mouth
 *       and end so the still shows through at the stops. Desktop fine-pointer +
 *       motion-allowed only (law #4); touch / reduced-motion get the stills floor.
 *   z2  THE SCRIM — a solid ink layer dimmed with `opacity` (never rgba — the
 *       deep-craft kill-list forbids translucent washes) so overlaid UI stays
 *       legible: the film is the theater's BACKDROP, not the content.
 *
 * Per-leg CHAPTER-SPLIT media (law #3): the current leg mounts as its own file;
 * leg N+1 is prefetched (a hidden warm-the-cache <video>) while leg N plays.
 * Media is referenced by URL string, never imported into JS (law #6).
 *
 * The conductor (useJourneyConductor) owns the theater/reality mode machine and
 * the arrival gate; this component is the presentation of its per-frame output.
 */

import { useEffect, useRef, useState } from 'react';
import { INK_DEEP } from '../theme.js';
import { legVideoUrl, stopStillUrl, JOURNEY_FILM_FINGERPRINT } from './journeyManifest.js';
import { useJourneyConductor } from './useJourneyConductor.js';

// The window at each leg's mouth/end (as a fraction of the leg) over which the
// film fades to the stop still. Matches the microsite conductor's 0.08 edge.
const EDGE = 0.08;

export default function JourneyFilm({
  set = 'bg',
  legsToPlay = 6,
  arrived = false,
  scriptWindowMs = 6000,
  startedAtMs = null,
  holdBoundary,
  onFinished,
  active = true,
  // Dim the film so overlaid UI stays legible. Solid token + opacity (no rgba).
  scrimOpacity = 0.5,
}) {
  const { currentLeg, legT, floorStill } = useJourneyConductor({
    active, legsToPlay, arrived, scriptWindowMs, startedAtMs, holdBoundary, onFinished,
  });

  // ── Law #4: desktop fine-pointer + motion-allowed gate ──────────────────────
  // Default false (SSR, touch, reduced-motion) → the stills floor alone renders,
  // which is also the guaranteed floor. One code path serves both.
  const [filmLive, setFilmLive] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setFilmLive(fine.matches && !motion.matches);
    update();
    fine.addEventListener?.('change', update);
    motion.addEventListener?.('change', update);
    return () => {
      fine.removeEventListener?.('change', update);
      motion.removeEventListener?.('change', update);
    };
  }, []);

  const currentLegN = currentLeg + 1;                                   // 1-based video number
  const nextLegN = currentLegN + 1 <= legsToPlay ? currentLegN + 1 : null;

  // ── The scrub: keep the current leg paused, seek to legT * duration ─────────
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  // Reset readiness whenever the leg (or media set) changes — the fresh <video>
  // must re-report metadata before we trust its duration; the still covers the gap.
  useEffect(() => { setVideoReady(false); }, [currentLegN, set]);
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoReady) return;
    const d = v.duration;
    if (!d || Number.isNaN(d)) return;
    const t = Math.min(d - 0.05, Math.max(0, legT * d));
    if (Math.abs((v.currentTime || 0) - t) > 0.01) {
      try { v.currentTime = t; } catch { /* seek on an unbuffered range — the still is the floor */ }
    }
  }, [legT, videoReady]);

  const floorUrl = stopStillUrl(set, floorStill);
  const videoOpacity = filmLive && videoReady
    ? Math.max(0, Math.min(1, Math.min(legT / EDGE, (1 - legT) / EDGE, 1)))
    : 0;

  const fill = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' };

  return (
    <div
      aria-hidden="true"
      data-journey-film={JOURNEY_FILM_FINGERPRINT}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', background: INK_DEEP }}
    >
      {/* z0 — THE FLOOR: the crisp stop still, always rendered (film-independent). */}
      <img
        key={`still-${set}-${floorStill}`}
        src={floorUrl}
        alt=""
        style={{ ...fill, animation: 'sf-fadeIn 0.4s ease-out' }}
      />

      {/* z1 — THE FILM: current leg, scrubbed. Fades in only when bytes are ready,
              and fades at the leg's mouth/end so the still is the stop frame. */}
      {filmLive && (
        <video
          key={`leg-${set}-${currentLegN}`}
          ref={videoRef}
          src={legVideoUrl(set, currentLegN)}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
          style={{ ...fill, opacity: videoOpacity, transition: 'opacity 0.12s linear' }}
        />
      )}

      {/* Law #3 — prefetch leg N+1 while leg N plays (a hidden warm-the-cache
          element; 1px so it never paints). */}
      {filmLive && nextLegN && (
        <video
          key={`prefetch-${set}-${nextLegN}`}
          src={legVideoUrl(set, nextLegN)}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        />
      )}

      {/* z2 — THE SCRIM: solid ink dimmed with opacity (no rgba wash). */}
      <div style={{ position: 'absolute', inset: 0, background: INK_DEEP, opacity: scrimOpacity }} />
    </div>
  );
}
