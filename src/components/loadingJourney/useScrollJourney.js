/**
 * useScrollJourney.js — THE SCROLL DRIVER (Slice C2, THE WELCOME).
 *
 * The microsite's travel-and-stop mechanic, translated to React over the SAME
 * shared core the loading conductor uses (projectLegFrame in useJourneyConductor).
 * Where the loading conductor's playhead is a clock/progress signal, THIS one's
 * playhead is SCROLL POSITION: a tall `.leg` travel spacer sits between each pair
 * of stops; scrolling through a leg SCRUBS the film between its two tiers, and the
 * gaps between legs are the STOPS where the film freezes on the crisp stop still
 * and the existing Welcome section presents.
 *
 * The projection is identical to the loading film — extend the core, never fork
 * it (C2 law). This module adds only the scroll→progress mapping (the reference
 * marketing/website/src/main.js `apply()` logic, made pure and testable) plus a
 * rAF-throttled listener shell. No smooth-scroll dependency is added: the app has
 * none and the microsite's own conductor is dependency-free rAF + scroll position
 * (a library here would be an owner-adjacent call, not this slice's to make).
 */

import { useEffect, useRef, useState } from 'react';
import { projectLegFrame } from './useJourneyConductor.js';

const IDLE_FRAME = Object.freeze({ progress: 0, currentLeg: 0, legT: 0, floorStill: 0 });

/**
 * computeScrollProgress — THE PURE SCROLL→PROGRESS MAP (the reference `apply()`,
 * made deterministic and side-effect-free). `ranges` are the measured leg
 * spacers ({ i, top, bottom } in document coordinates, i the 0-based leg index);
 * `legs` is the leg count (the progress denominator). The playhead is judged by
 * the viewport CENTRE (scrollY + viewportH/2), exactly as the microsite does, so
 * a leg is "active" while its middle is on screen.
 *
 *   • inside leg i        → progress = (i + legFraction) / legs  (the film scrubs)
 *   • between legs (stop) → progress = stopsPassed / legs        (frozen on still)
 *
 * At a stop the fraction is 0 or 1, so projectLegFrame lands the floor exactly on
 * that stop's still with the video edge-faded out — the freeze is free (a stop
 * costs no film time), which is why content height can never desync the film.
 */
export function computeScrollProgress(ranges, legs, scrollY, viewportH) {
  const denom = Math.max(1, legs | 0);
  const y = scrollY + viewportH * 0.5;
  let inLeg = -1;
  let legP = 0;
  let stopsPassed = 0;
  for (const r of ranges) {
    if (y >= r.bottom) {
      stopsPassed = r.i + 1;
    } else if (y >= r.top) {
      inLeg = r.i;
      const span = r.bottom - r.top;
      legP = span > 0 ? (y - r.top) / span : 0;
      break;
    } else {
      break;
    }
  }
  const clampedLegP = Math.min(1, Math.max(0, legP));
  const p = inLeg >= 0 ? (inLeg + clampedLegP) / denom : stopsPassed / denom;
  return Math.min(1, Math.max(0, p));
}

/**
 * measureLegs — read the leg spacers' document-space geometry from a root node.
 * Legs mark themselves with `data-welcome-leg` (their 0-based index as the value)
 * so the DOM order and the leg index can never disagree.
 */
function measureLegs(root) {
  if (!root || typeof root.querySelectorAll !== 'function') return [];
  const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  return [...root.querySelectorAll('[data-welcome-leg]')].map((el, i) => {
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    return { i, top, bottom: top + rect.height };
  });
}

/**
 * useScrollJourney — drive a JourneyFilmView frame from scroll position.
 *
 * @param {object}  opts
 * @param {object}  opts.rootRef  ref to the container holding the `.leg` spacers.
 * @param {number}  opts.legs     leg count (default 6).
 * @param {boolean} opts.active   run the listener (default true).
 * @returns {{progress:number, currentLeg:number, legT:number, floorStill:number}}
 */
export function useScrollJourney({ rootRef, legs = 6, active = true } = {}) {
  const [frame, setFrame] = useState(IDLE_FRAME);
  const rangesRef = useRef([]);
  const lastRef = useRef(IDLE_FRAME);

  useEffect(() => {
    if (!active) return undefined;
    if (typeof window === 'undefined') return undefined;
    const root = rootRef?.current;

    const recompute = () => {
      const viewportH = window.innerHeight || 0;
      const p = computeScrollProgress(rangesRef.current, legs, window.scrollY || 0, viewportH);
      const next = projectLegFrame(p, legs);
      const prev = lastRef.current;
      // Redundant-frame guard: a sub-perceptual scrub delta on the same leg/still
      // is not worth a re-render (the microsite's |Δ| > ~0.008 idiom, applied to
      // state rather than the raw seek — the seek keeps its own guard downstream).
      if (
        next.currentLeg === prev.currentLeg
        && next.floorStill === prev.floorStill
        && Math.abs(next.legT - prev.legT) < 0.008
      ) return;
      lastRef.current = next;
      setFrame(next);
    };

    const measure = () => { rangesRef.current = measureLegs(root); recompute(); };

    let rafPending = false;
    const onScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => { rafPending = false; recompute(); });
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    // Content below the fold changes height as fixtures/gallery land; a
    // ResizeObserver on the root re-measures the leg geometry when it does.
    let ro = null;
    if (root && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(root);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [rootRef, legs, active]);

  return frame;
}
