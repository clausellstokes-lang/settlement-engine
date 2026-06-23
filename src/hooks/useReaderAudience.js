/**
 * useReaderAudience.js — Derive the current user's reader archetype.
 *
 * The UX/UI critique frames every fix around three readers:
 *   - 'new'           — first-time DM, has never run a settlement at the
 *                       table; needs reassurance and worked examples.
 *   - 'intermediate'  — runs a session a week; needs speed and the
 *                       printable cheat-sheet path.
 *   - 'worldbuilder'  — running a multi-settlement arc; needs the
 *                       engine surfaced as a prep instrument.
 *
 * The audience is computed from behavior signals already on the store —
 * saved settlements count, export count, narrate spend, neighbour usage,
 * regenerate-with-locks usage. Anonymous users default to 'new' since
 * they haven't given us any signal yet.
 *
 * Memoization: the hook returns the same value across renders as long as
 * the underlying signal inputs are stable. Components calling it 100×
 * per render pay nothing.
 *
 * Why a hook (vs. a derived selector): some surfaces need to read the
 * audience outside React (e.g. analytics tagging, edge functions). For
 * those, `computeReaderAudience(state)` is the pure function this hook
 * wraps. Keep them in sync — both consult the same signal set.
 */

import { useMemo } from 'react';
import { useStore } from '../store/index.js';

/** @typedef {'new' | 'intermediate' | 'worldbuilder'} ReaderAudience */

/**
 * Pure computation of the reader archetype from a snapshot of the store.
 * Safe to call from non-React code (analytics tagging, edge-function
 * payloads, server-side rendering).
 *
 * @param {Object} signals
 * @param {number} signals.savedCount         — `savedSettlements.length`
 * @param {number} signals.exportCount        — cumulative PDF exports this user has done
 * @param {number} signals.narrateCount       — cumulative narrate credits the user has spent
 * @param {boolean} signals.hasUsedNeighbours — any save with neighbourLinks present
 * @param {boolean} signals.hasUsedLocks      — any save with locked sections
 * @param {string} signals.tier               — 'anon' | 'free' | 'premium' | …
 * @returns {ReaderAudience}
 */
export function computeReaderAudience(signals) {
  const {
    savedCount = 0,
    exportCount = 0,
    narrateCount = 0,
    hasUsedNeighbours = false,
    hasUsedLocks = false,
    tier = 'anon',
  } = signals || {};

  // Anonymous users are always 'new' — we have no behavior signal yet.
  if (tier === 'anon') return 'new';

  // Worldbuilder: 5+ saves AND at least one campaign-tier behavior
  // (neighbour network, locks, or 3+ exports).
  if (savedCount >= 5 && (hasUsedNeighbours || hasUsedLocks || exportCount >= 3)) {
    return 'worldbuilder';
  }

  // Intermediate: 2+ saves, or first export, or first narrate spend.
  // These signal "I'm coming back to use this" — not exploring.
  if (savedCount >= 2 || exportCount >= 1 || narrateCount >= 1) {
    return 'intermediate';
  }

  // Default: brand-new account, hasn't done anything yet.
  return 'new';
}

/**
 * React hook — current reader archetype, memoized over the inputs.
 *
 * Components use this for audience-aware affordances:
 *
 *   const audience = useReaderAudience();
 *   if (audience === 'worldbuilder') return <FounderTile />;
 *
 * The hook subscribes to the relevant store slices via individual
 * selectors so it doesn't re-render on unrelated state changes (config,
 * UI tab, etc.).
 */
export function useReaderAudience() {
  const tier = useStore(s => s.auth.tier);
  const savedCount = useStore(s => s.savedSettlements?.length || 0);
  // Behavior-signal aggregates — read derived counters from the store.
  // lifetimeNarrateCount is bumped on the aiSlice AI-generation success paths
  // (requestNarrative/requestDailyLife/requestProgression), a session-resilient
  // counter held in the store. exportCount is the
  // sum of `lastExportAt` markers across saved settlements; locks is
  // any save with a non-empty `locks` array; neighbours is any save
  // with neighbourLinks.
  const exportCount = useStore(s => {
    const saves = s.savedSettlements || [];
    return saves.reduce((acc, x) => acc + (x.campaignState?.lastExportAt ? 1 : 0), 0);
  });
  const narrateCount = useStore(s => s.lifetimeNarrateCount || 0);
  const hasUsedNeighbours = useStore(s => {
    const saves = s.savedSettlements || [];
    // neighbours live at settlement.neighbourNetwork, not a top-level save field.
    return saves.some(x => x.settlement?.neighbourNetwork?.length > 0);
  });
  const hasUsedLocks = useStore(s => {
    const saves = s.savedSettlements || [];
    // locks are a campaignState map, not a root-level array.
    return saves.some(x => x.campaignState?.locks
      && Object.values(x.campaignState.locks).some(Boolean));
  });

  return useMemo(
    () => computeReaderAudience({
      savedCount, exportCount, narrateCount,
      hasUsedNeighbours, hasUsedLocks, tier,
    }),
    [savedCount, exportCount, narrateCount, hasUsedNeighbours, hasUsedLocks, tier],
  );
}
