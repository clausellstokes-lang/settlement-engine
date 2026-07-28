/**
 * JourneyFilm.jsx — THE JOURNEY film layer (Slice C2L + C2).
 *
 * A progress-scrubbed backdrop that renders the growth film as three stacked
 * layers, exactly the microsite architecture translated to React:
 *   z0  THE FLOOR — the crisp stop still, ALWAYS present. The complete journey
 *       renders from stills alone with the film entirely absent (engineering
 *       law #1); the film is a progressive enhancement, never a dependency.
 *   z1  THE FILM — the current travel leg's <video>, kept PAUSED and scrubbed
 *       (currentTime = legT * duration) by the driver's frame. It fades in only
 *       when the bytes are ready (videoReady) and fades at each leg's mouth and
 *       end so the still shows through at the stops. Desktop fine-pointer +
 *       motion-allowed only (law #4); touch / reduced-motion get the stills floor.
 *   z2  THE SCRIM — a solid ink layer dimmed with `opacity` (never rgba — the
 *       deep-craft kill-list forbids translucent washes) so overlaid UI stays
 *       legible: the film is the theater's BACKDROP, not the content.
 *
 * TWO DRIVERS, ONE PRESENTATION (the C2 "extend, don't fork" law): the pure
 * `JourneyFilmView` renders a driver-supplied frame ({currentLeg, legT,
 * floorStill}); the default `JourneyFilm` wrapper is the CLOCK/PROGRESS driver
 * (useJourneyConductor — generation + realm loading), and the scroll-driven
 * Welcome backdrop (home/WelcomeJourneyBackdrop) renders the SAME view from a
 * scroll-derived frame. The projection math both share is projectLegFrame.
 *
 * Per-leg CHAPTER-SPLIT media (law #3): the current leg mounts as its own file;
 * leg N+1 is prefetched (a hidden warm-the-cache <video>) while leg N plays.
 * Media is referenced by URL string, never imported into JS (law #6).
 */

import { useEffect, useRef, useState } from 'react';
import { INK_DEEP } from '../theme.js';
import { legVideoUrl, stopStillUrl, JOURNEY_FILM_FINGERPRINT } from './journeyManifest.js';
import { useJourneyConductor } from './useJourneyConductor.js';

// The window at each leg's mouth/end (as a fraction of the leg) over which the
// film fades to the stop still. Matches the microsite conductor's 0.08 edge.
const EDGE = 0.08;

/**
 * JourneyFilmView — THE PURE PRESENTATION. Renders one driver frame; owns no
 * timeline. `frame` is { currentLeg, legT, floorStill }; `filmEnabled` is the
 * taste-gate (the clock wrapper leaves it true — PipelineReveal gates upstream;
 * the Welcome backdrop passes flag('welcomeJourneyFilm') so film-off ships zero
 * network weight while the stills floor still renders). Desktop fine-pointer +
 * motion-allowed AND filmEnabled must all hold before one video byte is fetched.
 */
export function JourneyFilmView({
  frame,
  legsToPlay = 6,
  scrimOpacity = 0.5,
  filmEnabled = true,
}) {
  const { currentLeg = 0, legT = 0, floorStill = 0 } = frame || {};

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

  // The film mounts only when the taste-gate is on AND the device qualifies.
  const showVideo = filmEnabled && filmLive;

  const currentLegN = currentLeg + 1;                                   // 1-based video number
  const nextLegN = currentLegN + 1 <= legsToPlay ? currentLegN + 1 : null;

  // ── The scrub: keep the current leg paused, seek to legT * duration ─────────
  const videoRef = useRef(null);
  // Readiness belongs to one numbered leg. Deriving the boolean from that id
  // resets it immediately on a leg change without a synchronous state-writing
  // effect; the fresh video must report readiness for its own number.
  const [readyLeg, setReadyLeg] = useState(null);
  const videoReady = readyLeg === currentLegN;
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoReady) return;
    const d = v.duration;
    if (!d || Number.isNaN(d)) return;
    const t = Math.min(d - 0.05, Math.max(0, legT * d));
    // Redundant-seek guard (the microsite idiom): skip sub-0.008s deltas.
    if (Math.abs((v.currentTime || 0) - t) > 0.008) {
      try { v.currentTime = t; } catch { /* seek on an unbuffered range — the still is the floor */ }
    }
  }, [legT, videoReady]);

  const floorUrl = stopStillUrl(floorStill);
  const videoOpacity = showVideo && videoReady
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
        key={`still-${floorStill}`}
        src={floorUrl}
        alt=""
        style={{ ...fill, animation: 'sf-fadeIn 0.4s ease-out' }}
      />

      {/* z1 — THE FILM: current leg, scrubbed. Fades in only when bytes are ready,
              and fades at the leg's mouth/end so the still is the stop frame. */}
      {showVideo && (
        <video
          key={`leg-${currentLegN}`}
          ref={videoRef}
          src={legVideoUrl(currentLegN)}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={() => setReadyLeg(currentLegN)}
          onCanPlay={() => setReadyLeg(currentLegN)}
          onError={() => setReadyLeg(null)}
          style={{ ...fill, opacity: videoOpacity, transition: 'opacity 0.12s linear' }}
        />
      )}

      {/* Law #3 — prefetch leg N+1 while leg N plays (a hidden warm-the-cache
          element; 1px so it never paints). */}
      {showVideo && nextLegN && (
        <video
          key={`prefetch-${nextLegN}`}
          src={legVideoUrl(nextLegN)}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        />
      )}

      {/* z2 — THE SCRIM: solid ink dimmed with opacity (no rgba wash). */}
      {scrimOpacity > 0 && (
        <div style={{ position: 'absolute', inset: 0, background: INK_DEEP, opacity: scrimOpacity }} />
      )}
    </div>
  );
}

/**
 * JourneyFilm — THE CLOCK/PROGRESS DRIVER (generation + realm loading). Owns the
 * theater/reality mode machine and the arrival gate via useJourneyConductor, and
 * renders the shared JourneyFilmView from its per-frame output. Public signature
 * and rendered DOM are unchanged from Slice C2L (its tests bind to both).
 */
export default function JourneyFilm({
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
  const frame = useJourneyConductor({
    active, legsToPlay, arrived, scriptWindowMs, startedAtMs, holdBoundary, onFinished,
  });
  return (
    <JourneyFilmView
      frame={frame}
      legsToPlay={legsToPlay}
      scrimOpacity={scrimOpacity}
    />
  );
}
