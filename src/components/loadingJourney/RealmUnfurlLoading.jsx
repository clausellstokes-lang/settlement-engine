/**
 * RealmUnfurlLoading.jsx — THE REALM/FMG LOADING JOURNEY (Slice C2L, surface 2).
 *
 * The scroll-unfurl loading backdrop that plays while the FMG iframe boots. Unlike
 * generation (a <50ms artifact ⇒ deliberate theater), the realm boot is genuinely
 * network-bound, so this runs the conductor in its REALITY-NATIVE mode: the unfurl
 * crawls toward — then FREEZES at — the hold boundary while the iframe boots, and
 * completes ONLY when the bridge is truly ready (`arrived = bridgeReady`). THE
 * UNIFYING LAW: the unfurl can never finish before the map exists; arrival ends it.
 *
 * ⚠ MEDIA DEFERRAL (vetoable, recorded for the walk): the masters library ships NO
 * scroll-unfurl master video — only static map plates in the gated ~460 MB masters.
 * So the FLOOR here is a parchment scroll that UNROLLS (a clip-path wipe over the
 * app's existing paper-grain texture — a mechanical reveal, no new creative asset),
 * and the <video> layer is a documented DROP-IN SEAM (REALM_UNFURL_VIDEO): the day
 * an unfurl master is produced under public/media/realm-unfurl/, set that URL and
 * the film scrubs the same conductor progress. Until then the parchment IS the
 * complete, functional loading surface (engineering law #1, stills/floor-first).
 *
 * Gated by the loadingJourneyFilm taste-gate at the call site; lazy (rides
 * WorldMap's route chunk, zero eager). Decorative (aria-hidden) — the toolbar's
 * "Loading…" status line remains the a11y floor and is left untouched.
 */

import { useEffect, useState } from 'react';
import { INK_DEEP } from '../theme.js';
import { useJourneyConductor } from './useJourneyConductor.js';

// Lazy-ratchet fingerprint (rendered as a data-attr so it survives minification):
// tests/build/loadingJourneyLazy.test.js asserts this is ABSENT from first paint.
export const REALM_UNFURL_FINGERPRINT = '::realm-unfurl:v1:';

// THE DROP-IN SEAM. null until a scroll-unfurl master is produced + optimized to
// public/media/realm-unfurl/ (all-keyframe, 720p, ≤~8 MB, per the C2L media recipe).
// Set to that URL and the film layer scrubs the same conductor progress.
const REALM_UNFURL_VIDEO = null;

// The app's shipped parchment texture — the floor's material (no new asset).
const PARCHMENT_TEXTURE = '/textures/paper-grain-dim.png';

// Reality-mode pacing: crawl most of the way, then wait for the iframe. holdBoundary
// 0.9 keeps a sliver of unfurl reserved for the arrival moment; finalLegMs eases it.
const REALM_HOLD_BOUNDARY = 0.9;
const REALM_SCRIPT_MS = 2600;
const REALM_FINAL_MS = 650;

export default function RealmUnfurlLoading({ bridgeReady = false }) {
  const [dismissed, setDismissed] = useState(false);
  const { progress } = useJourneyConductor({
    active: !dismissed,
    legsToPlay: 1,
    holdBoundary: REALM_HOLD_BOUNDARY,
    arrived: bridgeReady,
    scriptWindowMs: REALM_SCRIPT_MS,
    finalLegMs: REALM_FINAL_MS,
    onFinished: () => setDismissed(true),
  });

  // Desktop fine-pointer + motion-allowed gate (law #4) — governs the video seam
  // only; the parchment floor renders on every posture (it IS the floor).
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

  if (dismissed) return null;

  // The scroll unrolls left→right as progress climbs; a furled scroll reveals more
  // parchment. clip-path is a mechanical wipe (no rgba, no radius, no shadow).
  const unrolled = Math.max(0, Math.min(1, progress));
  const clip = `inset(0 ${((1 - unrolled) * 100).toFixed(2)}% 0 0)`;
  const fill = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

  return (
    <div
      aria-hidden="true"
      data-realm-unfurl={REALM_UNFURL_FINGERPRINT}
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        pointerEvents: 'none', background: INK_DEEP,
        // Fade the whole backdrop out as the final unfurl completes.
        opacity: dismissed ? 0 : 1, transition: 'opacity 0.5s ease-out',
      }}
    >
      {/* z0 — THE FLOOR: the parchment scroll, unrolling by progress. */}
      <div
        style={{
          ...fill,
          backgroundImage: `url('${PARCHMENT_TEXTURE}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          clipPath: clip,
          WebkitClipPath: clip,
        }}
      />

      {/* z1 — THE FILM (drop-in seam): only when a master exists AND the film is
              live. Scrubbed by the same conductor progress. Absent today. */}
      {filmLive && REALM_UNFURL_VIDEO && (
        <video
          src={REALM_UNFURL_VIDEO}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{ ...fill, objectFit: 'cover', clipPath: clip, WebkitClipPath: clip }}
        />
      )}

      {/* z2 — THE SCRIM: solid ink dimmed by opacity (no rgba wash). */}
      <div style={{ ...fill, background: INK_DEEP, opacity: 0.35 }} />
    </div>
  );
}
