/**
 * useAccountSurveyorGate.js — the Surveyor AI gate for the ACCOUNT surfaces
 * (the AI-keys nav row + section), resolved LAZILY.
 *
 * A separate copy of the door's useSurveyorEntitled that rides the account's lazy
 * chunk, so the account never SHARES an entitlement module with the door chunk (a
 * shared module across the two chunks rebalances the first-paint closure). Only
 * the pure, import-free isSurveyorTier predicate (surveyorGate.js) is shared —
 * the ONE chokepoint — so the account and the door can never disagree on WHO is
 * entitled; the mechanical RPC fetch is intentionally per-chunk. Fail-closed.
 */
import { useEffect, useState } from 'react';
import { useStore } from '../../store/index.js';
import { supabase } from '../../lib/supabase.js';

// The isSurveyorTier predicate is INLINED here (not imported from surveyorGate.js)
// on purpose: a module shared across the door + account lazy chunks forms a shared
// chunk that rebalances the first-paint budget (+42 B, measured). This copy MUST
// stay byte-identical to surveyor/surveyorGate.js#isSurveyorTier — the pin
// tests/components/surveyorGateParity.test.js fails if the two ever diverge.
export const surveyorEntitled = (auth) =>
  !!auth && (auth.hasSurveyorEntitlement === true
    || auth.isFounder === true
    || auth.role === 'admin'
    || auth.role === 'developer');

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

/** @returns {boolean} whether the current account may reach the Surveyor AI surface. */
export function useAccountSurveyorGate() {
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
  return surveyorEntitled({ hasSurveyorEntitlement, isFounder, role });
}
