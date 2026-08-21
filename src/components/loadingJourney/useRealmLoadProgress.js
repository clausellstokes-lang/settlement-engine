/**
 * useRealmLoadProgress.js — the REALM / FMG-boot progress mapping + its rAF driver
 * (owner order, 2026-07-22).
 *
 * The map iframe exposes NO fine-grained progress — `bridgeReady` and `mapReady` are
 * COINCIDENT (both fire only in the mapBridge 'ready' handler, src/hooks/useMapBridge.js),
 * so the boot is binary ("not ready" → "ready") plus a 15 s load watchdog. With no
 * true signal to read, the loader TRAVELS on a bounded time-creep that asymptotes
 * toward a ceiling < 1 and SNAPS to 1 only when the map is genuinely ready — the
 * owner's "loading should travel, not sit" doctrine kept honest by THE UNIFYING LAW
 * (the film can never complete before the map exists). The `bridgeReady` milestone is
 * retained as a forward-compatible waypoint should the two signals ever be split.
 *
 * The pure `computeRealmLoadFraction` lives HERE (not in journeyProgress.js) on
 * purpose: this module is pulled into WorldMap's (lazy) chunk by WorldMapStage, and
 * co-locating the realm math keeps journeyProgress.js from becoming a chunk shared
 * with WorldMap's static closure — which would push its filename into the eager
 * __vite__mapDeps manifest (the Wave-B +42 B shared-chunk lesson). It imports only
 * clamp01 (already in WorldMap's closure) + React, so it adds zero first-paint bytes.
 *
 * The hook is a thin rAF shell: it stamps the mount / bridge timestamps inside
 * effects (never in render — the purity rule), feeds the elapsed windows to the pure
 * core each frame, and CLAMPS the result to a running maximum so the fraction is
 * monotone even if a timestamp jitters. `runId` (the map reload key) resets the
 * timeline so "Reload map" re-runs the journey from the top.
 */

import { useEffect, useRef, useState } from 'react';
import { clamp01 } from '../../kernel/math.js';

// Realm-boot creep model. Caps are ORDERED (MOUNT_CAP < BRIDGE_AT < BRIDGE_CAP < 1)
// so the fraction is monotone ACROSS the milestone transitions, not only within a
// segment. TAU_MS is the creep time-constant — the felt boot time, comfortably under
// the 15 s watchdog so the creep is still climbing (not flat) when a normal boot ends.
export const REALM_CREEP = Object.freeze({
  MOUNT_CAP: 0.45,
  BRIDGE_AT: 0.5,
  BRIDGE_CAP: 0.9,
  TAU_MS: 6000,
});

/**
 * computeRealmLoadFraction — the pure realm-boot fraction. `ready` (mapReady) snaps
 * to 1; otherwise an asymptotic time-creep toward the active segment's ceiling. No
 * time reads — the caller supplies the elapsed windows so this stays deterministic
 * and unit-testable (the computeJourneyFrame idiom).
 */
export function computeRealmLoadFraction({
  ready = false,
  bridgeReady = false,
  elapsedMs = 0,
  elapsedSinceBridgeMs = 0,
} = {}, cfg = REALM_CREEP) {
  if (ready) return 1;
  const approach = (span, t) => span * (1 - Math.exp(-Math.max(0, t) / cfg.TAU_MS));
  if (bridgeReady) {
    return clamp01(cfg.BRIDGE_AT + approach(cfg.BRIDGE_CAP - cfg.BRIDGE_AT, elapsedSinceBridgeMs));
  }
  return clamp01(approach(cfg.MOUNT_CAP, elapsedMs));
}

const now = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
const hasRaf = typeof requestAnimationFrame === 'function';

export function useRealmLoadProgress({ ready = false, bridgeReady = false, active = true, runId = 0 } = {}) {
  const [frac, setFrac] = useState(0);
  const mountAtRef = useRef(null);
  const bridgeAtRef = useRef(null);
  const maxRef = useRef(0);

  // Fresh run (first mount or a reload): drop the timeline so the creep restarts.
  useEffect(() => {
    mountAtRef.current = null;
    bridgeAtRef.current = null;
    maxRef.current = 0;
    setFrac(0);
  }, [runId]);

  useEffect(() => {
    if (!active) return undefined;

    if (ready) {
      // Snap to the top; the overlay reads 1 and plays out its final fade.
      maxRef.current = 1;
      setFrac(1);
      return undefined;
    }

    if (mountAtRef.current == null) mountAtRef.current = now();

    let raf = 0;
    const tick = () => {
      const t = now();
      if (bridgeReady && bridgeAtRef.current == null) bridgeAtRef.current = t;
      const computed = computeRealmLoadFraction({
        ready: false,
        bridgeReady,
        elapsedMs: t - (mountAtRef.current ?? t),
        elapsedSinceBridgeMs: bridgeAtRef.current != null ? t - bridgeAtRef.current : 0,
      });
      const clamped = computed > maxRef.current ? computed : maxRef.current;
      maxRef.current = clamped;
      setFrac(clamped);
      if (hasRaf) raf = requestAnimationFrame(tick);
    };

    if (hasRaf) raf = requestAnimationFrame(tick);
    else tick();

    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [ready, bridgeReady, active]);

  return frac;
}
