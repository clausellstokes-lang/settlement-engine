/**
 * ProgressJourneyOverlay.jsx — THE PROGRESS-SCRUBBED REALM JOURNEY (owner order,
 * 2026-07-21 + re-issued 2026-07-22, verbatim: "the video of 'settlementforge map
 * loading …' should change to the video of the map moving that move only with the
 * progress of the load").
 *
 * ONE shared overlay, TWO mount points (the Realm map shell + the map-generation
 * reveal). It covers the loading region with the owner-supplied journey video,
 * scrubbed by the surface's REAL load progress via the chase law in progressChase.js
 * (play forward at a modulated rate that tracks progress·duration; snap only on big
 * jumps; never rewind; pause on stall) — runtime condensation over the shipped file,
 * NEVER a re-encode (no ffmpeg on this machine).
 *
 * THE ASSET CONTRACT (dormant-safe socket):
 *   • Path       public/videos/realm-journey.mp4  (served at /videos/realm-journey.mp4)
 *                — present since 2026-07-22 (owner-supplied, 15.042 s, ~20 MB).
 *   • Encoding   all-keyframe H.264 is IDEAL for scrub smoothness (advisory only —
 *                the chase law reads a non-all-keyframe file smoothly regardless;
 *                the shipped master carries an stss table and still scrubs cleanly).
 *   • Duration   IRRELEVANT to wiring — runtime condensation tracks whatever real
 *                progress the surface reports, so any duration fits any load speed.
 *   • Absent     → the overlay renders `fallback` (the CURRENT loading presentation).
 *                A cheap cached HEAD probe detects presence with no console spew.
 *
 * TIER-SPEED LAW: no per-tier constants. Condensation is inherently tier-matched
 * because the video tracks real progress — a larger settlement simply reports slower
 * step progress and the chase glides to fit.
 *
 * THE OVERLAY SERVES THE LOAD, NEVER THE REVERSE: the 20 MB file downloads WHILE the
 * map/pipeline loads; nothing awaits the video. If it is not decodable yet when
 * progress starts, the chase HOLDS on the opaque floor and begins from wherever
 * progress has reached the instant duration lands (the first step snaps forward).
 * On readiness the overlay fades briefly, unmounts, and tears the <video> down so no
 * decode lingers.
 *
 * a11y: decorative (aria-hidden). The a11y wait floor is the surface's own status
 * line (the map toolbar's boot status / PipelineReveal's role=status step list), left
 * untouched. Reduced-motion OR coarse-pointer ⇒ no video: the fallback renders
 * instead (loadingJourney law #4 — protects reduced-motion users and mobile from a
 * 20 MB scrub pull; matches JourneyFilm / RealmUnfurlLoading exactly).
 *
 * Lazy leaf: React.lazy at both mount points; the fingerprint below stays OFF first
 * paint (the loadingJourney lazy ratchet, tests/build/loadingJourneyLazy.test.js).
 */

import { useEffect, useRef, useState } from 'react';
import { INK_DEEP } from '../theme.js';
import { JOURNEY_VIDEO_SRC } from './journeyProgress.js';
import { useJourneyVideoAsset, probeJourneyVideo } from './useJourneyVideoAsset.js';
import { computeChaseStep, CHASE } from './progressChase.js';

// Lazy-ratchet fingerprint (rendered as a data-attr so it survives minification):
// tests/build/loadingJourneyLazy.test.js asserts this is ABSENT from first paint.
export const PROGRESS_JOURNEY_FINGERPRINT = '::progress-journey:v1:';

const FADE_MS = 450;

const hasRaf = () => typeof requestAnimationFrame === 'function';

/** Desktop fine-pointer + motion-allowed gate (loadingJourney law #4). */
function useMotionOk() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setOk(fine.matches && !motion.matches);
    update();
    fine.addEventListener?.('change', update);
    motion.addEventListener?.('change', update);
    return () => {
      fine.removeEventListener?.('change', update);
      motion.removeEventListener?.('change', update);
    };
  }, []);
  return ok;
}

/**
 * VideoScrubLayer — the <video> + the rAF chase shell. Mounted ONLY while scrubbing,
 * so its hooks (and the 20 MB fetch) never run when the asset is absent, on
 * reduced-motion, or on a coarse pointer. Tears the decode down on unmount.
 */
function VideoScrubLayer({ videoSrc, progress, onError }) {
  const videoRef = useRef(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!videoReady || !hasRaf()) return undefined;
    const v = videoRef.current;
    if (!v) return undefined;
    let raf = 0;
    let prevTarget = null;
    let prevTs = null;
    const loop = (ts) => {
      const d = v.duration;
      const p = progressRef.current;
      const target = (d > 0 && !Number.isNaN(d)) ? Math.max(0, Math.min(p * d, d - CHASE.EPS)) : 0;
      let targetVel = 0;
      if (prevTarget != null && prevTs != null && ts > prevTs) {
        targetVel = (target - prevTarget) / ((ts - prevTs) / 1000);
      }
      prevTarget = target;
      prevTs = ts;
      const step = computeChaseStep({ progress: p, duration: d, currentTime: v.currentTime, targetVel });
      if (step.seekTo != null) {
        try { v.currentTime = step.seekTo; } catch { /* seek into an unbuffered range — the floor covers it */ }
      }
      if (step.play) {
        if (v.paused) { const r = v.play?.(); if (r && typeof r.catch === 'function') r.catch(() => {}); }
        try { v.playbackRate = step.playbackRate; } catch { /* ignore */ }
      } else if (!v.paused) {
        try { v.pause(); } catch { /* ignore */ }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [videoReady]);

  // Teardown — stop the decode when the layer unmounts (no lingering 20 MB decode).
  // Capture the element at mount: React detaches a host ref during commit, so the
  // passive cleanup would otherwise read a null videoRef.current and no-op.
  useEffect(() => {
    const v = videoRef.current;
    return () => {
      if (!v) return;
      try { v.pause(); v.removeAttribute('src'); v.load?.(); } catch { /* ignore */ }
    };
  }, []);

  const fill = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' };
  return (
    <video
      ref={videoRef}
      src={videoSrc}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      onLoadedMetadata={() => setVideoReady(true)}
      onCanPlay={() => setVideoReady(true)}
      onError={onError}
      style={{ ...fill, opacity: videoReady ? 1 : 0, transition: 'opacity 0.2s linear' }}
    />
  );
}

/**
 * ProgressJourneyOverlay
 * @param progress   real load progress 0..1 (monotone — the surface's own mapping)
 * @param videoSrc   asset URL (default the contract path)
 * @param probe      injectable asset probe (tests)
 * @param fallback   the CURRENT loading presentation, rendered when absent / reduced-motion
 * @param onDismiss  called once after the completion fade (the realm surface)
 * @param holdAtEnd  true ⇒ hold the last frame at progress 1 (map-gen owns its own dismissal)
 * @param zIndex     stacking of the video layer (realm covers the iframe; map-gen sits behind the card)
 */
export default function ProgressJourneyOverlay({
  progress = 0,
  videoSrc = JOURNEY_VIDEO_SRC,
  probe = probeJourneyVideo,
  fallback = null,
  onDismiss,
  holdAtEnd = false,
  zIndex = 4,
}) {
  const present = useJourneyVideoAsset(videoSrc, probe);
  const motionOk = useMotionOk();
  const [videoFailed, setVideoFailed] = useState(false);
  const [phase, setPhase] = useState('scrub'); // 'scrub' | 'fading' | 'gone'
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const scrubbing = present === true && motionOk && !videoFailed;

  // Completion → brief fade → dismiss (realm). holdAtEnd keeps the last frame so the
  // map-generation reveal (which owns its own dwell + dismissal) is undisturbed.
  useEffect(() => {
    if (!scrubbing || holdAtEnd) return undefined;
    if (progress >= 1 && phase === 'scrub') {
      setPhase('fading');
      const t = setTimeout(() => {
        setPhase('gone');
        onDismissRef.current?.();
      }, FADE_MS);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [progress, scrubbing, holdAtEnd, phase]);

  // Absent / probing / reduced-motion / coarse-pointer / decode failed → the current
  // presentation. `null` while probing means the fallback shows with no gap.
  if (!scrubbing) return fallback;
  if (phase === 'gone') return null;

  return (
    <div
      aria-hidden="true"
      data-progress-journey={PROGRESS_JOURNEY_FINGERPRINT}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: INK_DEEP,
        zIndex,
        opacity: phase === 'fading' ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      <VideoScrubLayer videoSrc={videoSrc} progress={progress} onError={() => setVideoFailed(true)} />
    </div>
  );
}
