/**
 * useJourneyConductor.js — THE CONDUCTOR (Slice C2L).
 *
 * A progress-scrubbed film conductor with TWO MODES, unified behind one clock and
 * one arrival gate. It maps a single monotonic `progress ∈ [0,1]` onto the growth
 * film's per-leg scrub positions, and enforces THE UNIFYING LAW: the film may
 * never reach its final frame before the real artifact exists — arrival is the
 * only thing that ends it.
 *
 * THE TWO MODES (owner amendment, THE PERFORMANCE FALLBACK):
 *   • THEATER MODE (generation, default): generation is actually <50ms, so the
 *     wait is deliberate psychological pacing. A rAF clock advances progress
 *     0→1 over `scriptWindowMs` (the SAME window PipelineReveal uses, so the film
 *     lands on the ordered tier exactly as the dossier arrives). Because the
 *     artifact already exists at mount (`arrived` true), the arrival gate is open
 *     and the scripted cadence is the sole driver.
 *   • REALITY MODE (realm/FMG boot, network-bound): `arrived` is false at mount.
 *     The same clock crawls the film up to the last chapter boundary short of
 *     arrival, then HOLDS there — the film slows/holds and plays its final leg
 *     ONLY on true completion. This is not a separate code path: it is what the
 *     one clock does when the arrival gate is still closed when the script ends.
 *
 * THE ARRIVAL GATE (the unifying-law chokepoint), a single clamp:
 *     ceiling = arrived ? 1 : holdBoundary
 *     effectiveProgress = min(scriptedProgress, ceiling)
 * `holdBoundary` defaults to the mouth of the final leg ((legsToPlay-1)/legsToPlay)
 * so a stalled film freezes on the penultimate stop and only the final leg awaits
 * arrival. When `arrived` flips true mid-hold, the final leg eases boundary→1 over
 * `finalLegMs` (no snap), then `onFinished` fires exactly once.
 *
 * The frame math is the PURE `computeJourneyFrame` below (unit-tested directly,
 * no timers); the hook is a thin rAF shell around it and owns the ONE stateful
 * decision — detecting the held→arrived edge to stamp the final-leg start. Purity
 * in render is kept the PipelineReveal way: timestamps stamped inside effects,
 * never during render.
 */

import { useEffect, useRef, useState } from 'react';
import { clamp01 } from '../../kernel/math.js';

export const JOURNEY_PHASE = Object.freeze({
  idle: 'idle',
  traveling: 'traveling',
  holding: 'holding',
  final: 'final',
  finished: 'finished',
});

const hasRaf = typeof requestAnimationFrame === 'function';

/**
 * defaultHoldBoundary(legsToPlay) — the progress at which a not-yet-arrived film
 * freezes: the mouth of the final leg. legsToPlay ≤ 1 → 0 (a single-leg film
 * holds furled at the start until arrival).
 */
export function defaultHoldBoundary(legsToPlay) {
  return legsToPlay <= 1 ? 0 : (legsToPlay - 1) / legsToPlay;
}

/**
 * scriptedProgressAt — the raw theater clock fraction [0,1] (pre-gate).
 */
export function scriptedProgressAt(now, startedAt, scriptWindowMs) {
  return scriptWindowMs > 0 ? clamp01((now - startedAt) / scriptWindowMs) : 1;
}

/**
 * boundaryFor — the hold boundary for a leg count / explicit override.
 */
export function boundaryFor(legsToPlay, holdBoundary) {
  return clamp01(
    typeof holdBoundary === 'number' ? holdBoundary : defaultHoldBoundary(Math.max(1, legsToPlay | 0)),
  );
}

/**
 * computeJourneyFrame — THE PURE CORE. Given the wall-clock inputs and the caller-
 * owned `finalStart` (null until the held→arrived edge is detected), resolve the
 * effective progress through the arrival gate, the phase, and the leg-scrub state.
 * No side effects, no time reads — deterministic and fully unit-testable.
 *
 * The three branches ARE the mode machine:
 *   • finalStart set  → FINAL: a held film unlocked by arrival, easing boundary→1.
 *   • arrived         → THEATER: the scripted clock drives progress 0→1.
 *   • not arrived     → REALITY: travel, then FREEZE at the boundary (never finish).
 */
export function computeJourneyFrame({
  now,
  startedAt,
  scriptWindowMs,
  arrived,
  legsToPlay,
  holdBoundary,
  finalLegMs,
  finalStart = null,
}) {
  const legs = Math.max(1, legsToPlay | 0);
  const boundary = boundaryFor(legs, holdBoundary);
  const scriptedProgress = scriptedProgressAt(now, startedAt, scriptWindowMs);

  let phase;
  let effective;

  if (finalStart != null) {
    // FINAL: arrival unlocked a held film — ease the last leg boundary→1 (no snap).
    const f = finalLegMs > 0 ? clamp01((now - finalStart) / finalLegMs) : 1;
    effective = boundary + (1 - boundary) * f;
    phase = f >= 1 ? JOURNEY_PHASE.finished : JOURNEY_PHASE.final;
  } else if (arrived) {
    // THEATER: the artifact already exists, so the scripted cadence runs 0→1.
    effective = scriptedProgress;
    phase = effective >= 1 ? JOURNEY_PHASE.finished : JOURNEY_PHASE.traveling;
  } else if (scriptedProgress >= boundary) {
    // REALITY hold: crawled to the boundary and frozen — arrival is the only end.
    effective = boundary;
    phase = JOURNEY_PHASE.holding;
  } else {
    effective = scriptedProgress;
    phase = JOURNEY_PHASE.traveling;
  }

  // Project the effective progress onto the leg-scrub state.
  const p = clamp01(effective);
  const frac = p * legs;
  let currentLeg = Math.floor(frac);
  let legT = frac - currentLeg;
  if (currentLeg >= legs) { currentLeg = legs - 1; legT = 1; }
  if (currentLeg < 0) { currentLeg = 0; legT = 0; }
  // The crisp stop still under the video: the near stop for the first half of a
  // leg, the far stop for the second half; the ordered-tier still once finished.
  const floorStill = p >= 1 ? legs : (legT < 0.5 ? currentLeg : currentLeg + 1);

  return {
    progress: p,
    phase,
    currentLeg,
    legT,
    floorStill,
    holding: phase === JOURNEY_PHASE.holding,
    finished: phase === JOURNEY_PHASE.finished,
  };
}

const IDLE_FRAME = Object.freeze({
  progress: 0, phase: JOURNEY_PHASE.idle, currentLeg: 0, legT: 0,
  floorStill: 0, holding: false, finished: false,
});

export function useJourneyConductor({
  active = true,
  legsToPlay = 6,
  arrived = false,
  scriptWindowMs = 6000,
  // Optional shared start timestamp (ms epoch). When omitted the conductor stamps
  // its own on the first active frame. Generation passes PipelineReveal's start so
  // the film and the dossier reveal share one timeline.
  startedAtMs = null,
  finalLegMs = 900,
  holdBoundary,
  onFinished,
} = {}) {
  const [frame, setFrame] = useState(IDLE_FRAME);

  const startRef = useRef(null);
  const finalStartRef = useRef(null);
  const wasHoldingRef = useRef(false);
  const finishedFiredRef = useRef(false);
  const arrivedRef = useRef(arrived);
  arrivedRef.current = arrived;
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  useEffect(() => {
    if (!active) {
      setFrame((f) => (f.phase === JOURNEY_PHASE.idle ? f : IDLE_FRAME));
      return undefined;
    }

    const stampNow = () => (typeof Date !== 'undefined' ? Date.now() : 0);
    if (startRef.current == null) startRef.current = startedAtMs ?? stampNow();

    let raf = 0;
    const tick = () => {
      const now = stampNow();
      // THE ONE STATEFUL DECISION: did the film reach the hold boundary while the
      // artifact was still absent (a real REALITY hold), and has arrival now come?
      // If so, stamp the final-leg start once so it eases boundary→1 (no snap).
      // A film that was arrived BEFORE the boundary never sets wasHolding, so pure
      // theater keeps its scripted final-leg timing and lands with the dossier.
      const boundary = boundaryFor(legsToPlay, holdBoundary);
      const scripted = scriptedProgressAt(now, startRef.current, scriptWindowMs);
      if (!arrivedRef.current && scripted >= boundary) wasHoldingRef.current = true;
      if (arrivedRef.current && wasHoldingRef.current && finalStartRef.current == null) {
        finalStartRef.current = now;
      }

      const next = computeJourneyFrame({
        now,
        startedAt: startRef.current,
        scriptWindowMs,
        arrived: arrivedRef.current,
        legsToPlay,
        holdBoundary,
        finalLegMs,
        finalStart: finalStartRef.current,
      });

      setFrame((prev) => (
        prev.progress === next.progress && prev.phase === next.phase ? prev : {
          progress: next.progress, phase: next.phase, currentLeg: next.currentLeg,
          legT: next.legT, floorStill: next.floorStill,
          holding: next.holding, finished: next.finished,
        }
      ));

      if (next.phase === JOURNEY_PHASE.finished) {
        if (!finishedFiredRef.current) {
          finishedFiredRef.current = true;
          onFinishedRef.current?.();
        }
        return; // stop the loop at the final frame
      }
      if (hasRaf) raf = requestAnimationFrame(tick);
    };

    if (hasRaf) raf = requestAnimationFrame(tick);
    else tick();

    return () => { if (raf) cancelAnimationFrame(raf); };
    // `arrived` is read via ref so its flip is picked up by the running loop
    // without re-mounting the clock; re-arm only on structural inputs.
  }, [active, legsToPlay, scriptWindowMs, startedAtMs, finalLegMs, holdBoundary]);

  return frame;
}
