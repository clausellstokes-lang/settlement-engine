/**
 * useSectionDwell.js — fire a one-shot "dwell" callback when a dossier tab's
 * content has been genuinely on screen for long enough to count as reading.
 *
 * "Genuinely on screen" is the conjunction of two signals, so a click-through
 * (tab selected but immediately swapped, or the page backgrounded) never counts:
 *   - the content wrapper is ≥50% visible in the viewport (IntersectionObserver);
 *   - the document is foreground (`document.visibilityState === 'visible'`).
 *
 * Dwell time accrues only while BOTH hold. When the accrued time for the current
 * tab crosses the threshold (default 2 s) the callback fires EXACTLY ONCE per
 * tab activation. Switching tabs (the `tabId` dep changing) resets the timer and
 * arms a fresh one-shot for the new tab. Backgrounding/scrolling-away pauses the
 * accrual rather than discarding it, so a reader who glances away and back still
 * trips the threshold at the right cumulative moment.
 *
 * Fire-and-forget by contract: the callback is analytics-only. The hook never
 * throws into the render tree — observer setup and the rAF/interval loop are
 * guarded, and a missing IntersectionObserver (SSR / very old browsers) simply
 * means no dwell events, never a crash.
 *
 * Usage:
 *   const ref = useRef(null);
 *   useSectionDwell(ref, activeTab, (dwellMs) => {
 *     track(EVENTS.DOSSIER_SECTION_DWELL, { tab_id: activeTab, dwell_ms_band: band(dwellMs) });
 *   });
 *   // ...
 *   React.createElement('div', { ref }, content)
 *
 * @param {{ current: Element | null }} targetRef  ref to the observed content wrapper
 * @param {string} tabId                        the currently active tab id; a change re-arms the one-shot
 * @param {(dwellMs:number) => void} onDwell     fired once per tab activation when dwell ≥ thresholdMs
 * @param {Object} [opts]
 * @param {number} [opts.thresholdMs=2000]      dwell required before firing
 * @param {number} [opts.ratio=0.5]             IntersectionObserver visibility ratio (≥50%)
 */
import { useEffect, useRef } from 'react';

export function useSectionDwell(targetRef, tabId, onDwell, opts = {}) {
  const { thresholdMs = 2000, ratio = 0.5 } = opts;

  // Keep the latest callback without re-arming the observer on every render.
  // Updated in an effect (not during render) so the ref write is side-effect-safe.
  const onDwellRef = useRef(onDwell);
  useEffect(() => { onDwellRef.current = onDwell; }, [onDwell]);

  useEffect(() => {
    const el = targetRef?.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;

    let accruedMs = 0;          // dwell banked for THIS tab activation
    let runningSince = null;    // timestamp accrual (re)started, or null when paused
    let visibleEnough = false;  // ≥ ratio in viewport
    let fired = false;          // one-shot guard for this tab activation
    let tickId = null;

    const now = () =>
      (typeof performance !== 'undefined' && typeof performance.now === 'function')
        ? performance.now()
        : Date.now();

    const docVisible = () =>
      typeof document === 'undefined' || document.visibilityState !== 'hidden';

    // Dwell counts only while visible-enough AND foreground.
    const active = () => visibleEnough && docVisible();

    const settle = () => {
      // Bank any time that has elapsed since accrual started, then re-evaluate.
      if (runningSince != null) {
        accruedMs += now() - runningSince;
        runningSince = null;
      }
      if (active()) {
        runningSince = now();
        ensureTick();
        maybeFire();
      } else {
        stopTick();
      }
    };

    const maybeFire = () => {
      if (fired) return;
      const total = accruedMs + (runningSince != null ? now() - runningSince : 0);
      if (total >= thresholdMs) {
        fired = true;
        stopTick();
        try { onDwellRef.current?.(Math.round(total)); } catch { /* analytics never throws */ }
      }
    };

    const ensureTick = () => {
      if (tickId != null) return;
      // Light poll — we only need to notice the threshold crossing, not animate.
      tickId = setInterval(maybeFire, 250);
    };
    const stopTick = () => {
      if (tickId != null) { clearInterval(tickId); tickId = null; }
    };

    let observer = null;
    try {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          visibleEnough = entry.isIntersecting && entry.intersectionRatio >= ratio;
        }
        settle();
      }, { threshold: [0, ratio, 1] });
      observer.observe(el);
    } catch {
      return undefined; // observer unavailable — no dwell tracking, no crash
    }

    const onVisibilityChange = () => settle();
    try {
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', onVisibilityChange);
      }
    } catch { /* no-op */ }

    return () => {
      stopTick();
      try { observer?.disconnect(); } catch { /* no-op */ }
      try {
        if (typeof document !== 'undefined') {
          document.removeEventListener('visibilitychange', onVisibilityChange);
        }
      } catch { /* no-op */ }
    };
  // Re-arm whenever the active tab changes: each tab activation is its own
  // one-shot dwell window.
  }, [targetRef, tabId, thresholdMs, ratio]);
}

export default useSectionDwell;
