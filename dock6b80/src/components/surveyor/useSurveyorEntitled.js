/**
 * useSurveyorEntitled.js — the Surveyor AI gate for the DOOR, resolved LAZILY.
 *
 * Rides only the door's lazy chunk, so it adds ZERO eager bytes. Founders +
 * elevated roles are read synchronously from the eager auth store and
 * short-circuit the async fetch (they see the door immediately); an
 * entitlement-only user sees it once the has_surveyor_entitlement() RPC resolves.
 * The decision routes through the ONE isSurveyorTier chokepoint (surveyorGate.js).
 *
 * The RPC fetch is duplicated (not shared) with the account's gate on purpose:
 * a module SHARED across the door + account lazy chunks forms a shared chunk that
 * rebalances the first-paint closure. Only the pure, import-free predicate is
 * shared (inlined) — the mechanical fetch is per-chunk.
 */
import { useEffect, useState } from 'react';
import { useStore } from '../../store/index.js';
import { supabase } from '../../lib/supabase.js';
import { isSurveyorTier } from './surveyorGate.js';

/** @type {Map<string, boolean>} */
const cache = new Map();

/** Memoized has_surveyor_entitlement() read; fail-closed to false. */
async function fetchEntitled(userId) {
  if (!userId || !supabase) return false;
  if (cache.has(userId)) return cache.get(userId);
  try {
    const { data, error } = await supabase.rpc('has_surveyor_entitlement');
    const v = !error && data === true;
    cache.set(userId, v);
    return v;
  } catch {
    cache.set(userId, false);
    return false;
  }
}

/** @returns {boolean} whether the current user may reach the Surveyor AI surface. */
export function useSurveyorEntitled() {
  const userId = useStore((s) => s.auth.user?.id || null);
  const isFounder = useStore((s) => s.auth.isFounder);
  const role = useStore((s) => s.auth.role);
  const [fetched, setFetched] = useState({ userId: null, entitled: false });

  useEffect(() => {
    let alive = true;
    fetchEntitled(userId).then((v) => { if (alive) setFetched({ userId, entitled: v }); });
    return () => { alive = false; };
  }, [userId]);

  const hasSurveyorEntitlement = fetched.userId === userId && fetched.entitled;
  return isSurveyorTier({ hasSurveyorEntitlement, isFounder, role });
}
