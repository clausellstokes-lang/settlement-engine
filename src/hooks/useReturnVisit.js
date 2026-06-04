/**
 * useReturnVisit.js - Detect a return-visit and surface the prior settlement.
 *
 * The critique's X-9: when a free user comes back 24+ hours after their
 * last visit, the hero today is identical to the first-visit hero. They
 * get no acknowledgment of what they last did, no welcome-back, no
 * follow-up. A free user who came back is a future paying user - treat
 * them like one.
 *
 * This hook computes:
 *   - isReturn         - true if a previous visit was recorded and >24h ago
 *   - daysSinceLastVisit
 *   - lastSettlement   - the most-recently-touched saved settlement (or null)
 *
 * Implementation:
 *   - Last-visit timestamp lives in localStorage `sf:last_visit_at`,
 *     stamped on every page load. We compare to the previous value
 *     before we overwrite it, so the first-load-after-a-day returns the
 *     gap correctly.
 *   - lastSettlement is derived from the savedSettlements slice - the
 *     entry with the most recent `savedAt` or `campaignState.editedAt`.
 *
 * On first mount of a return-visit, fires RETURN_VISIT_DETECTED analytics.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store/index.js';
import { Funnel, EVENTS } from '../lib/analytics.js';

const STORAGE_KEY = 'sf:last_visit_at';
const RETURN_THRESHOLD_MS = 24 * 60 * 60 * 1000;

function readPriorVisit() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? Number(raw) || null : null;
  } catch {
    return null;
  }
}

function stampVisit() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }
  } catch { /* private mode - accept the loss */ }
}

export function useReturnVisit() {
  const savedSettlements = useStore(s => s.savedSettlements || []);
  const tier = useStore(s => s.auth.tier);
  // firedRef is event-handler-only (the analytics effect reads + writes
  // it), so the purity rule doesn't apply.
  const firedRef = useRef(false);

  // Lazy-initialized state for the prior visit timestamp + the current
  // wall-clock at hook mount. useState's lazy initializer is the
  // sanctioned escape hatch from the purity rule - it runs at mount
  // time exactly once and doesn't violate render purity on subsequent
  // calls.
  const [prior] = useState(() => readPriorVisit());
  const [nowAtMount] = useState(() => Date.now());

  // Stamp on mount. We do this in an effect so SSR / test envs without
  // localStorage don't trip.
  useEffect(() => {
    stampVisit();
  }, []);

  const lastSettlement = useMemo(() => {
    if (!Array.isArray(savedSettlements) || savedSettlements.length === 0) return null;
    const ranked = [...savedSettlements].sort((a, b) => {
      const aTs = Number(a.campaignState?.editedAt || a.savedAt || 0);
      const bTs = Number(b.campaignState?.editedAt || b.savedAt || 0);
      return bTs - aTs;
    });
    return ranked[0] || null;
  }, [savedSettlements]);

  const result = useMemo(() => {
    if (!prior || tier === 'anon') {
      return { isReturn: false, daysSinceLastVisit: 0, lastSettlement };
    }
    const gapMs = nowAtMount - prior;
    const isReturn = gapMs >= RETURN_THRESHOLD_MS;
    const days = Math.floor(gapMs / (24 * 60 * 60 * 1000));
    return { isReturn, daysSinceLastVisit: days, lastSettlement };
  }, [prior, nowAtMount, tier, lastSettlement]);

  // Fire RETURN_VISIT_DETECTED once per session on the first return-visit
  // render. Subsequent renders within the same session don't re-fire.
  useEffect(() => {
    if (!result.isReturn || firedRef.current) return;
    firedRef.current = true;
    Funnel.track(EVENTS.RETURN_VISIT_DETECTED, {
      daysSinceLastVisit: result.daysSinceLastVisit,
      hasLastSettlement: !!result.lastSettlement,
    });
  }, [result.isReturn, result.daysSinceLastVisit, result.lastSettlement]);

  return result;
}
