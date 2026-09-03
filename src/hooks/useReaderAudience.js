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
 * ⭐ THE EVIDENCE VOCABULARY (row O-16). An archetype is a VERDICT, and a verdict
 * that travels without its evidence is an assertion of entitlement. Every audience
 * surface downstream — most sharply the Founder recognition tile, which tells a
 * reader the Hall should know their name — was reading a bare string and had no way
 * to say WHY this reader earned it. These are the typed reasons the ladder actually
 * consulted, in the ladder's own order.
 *
 * ⛔ TYPED BUCKETS, NEVER SENTENCES (FINITE-SEMANTICS). These are codes for
 * receipts, analytics and gates. A reader-facing wording of any of them is the
 * owner's at the voice sitting; nothing here may be rendered as prose.
 *
 * ⚠ Word-spelled thresholds, not digits, on purpose: these literals live in `src/`
 * and the prose-numerics walker's business is engine notation reaching authored
 * strings. Spelling the rung keeps the code out of that argument entirely.
 * @type {Readonly<Record<string, string>>}
 */
export const READER_AUDIENCE_REASONS = Object.freeze({
  ANON_NO_SIGNAL: 'anon_no_signal',
  SAVES_AT_LEAST_FIVE: 'saves_at_least_five',
  NEIGHBOUR_NETWORK_USED: 'neighbour_network_used',
  SECTION_LOCKS_USED: 'section_locks_used',
  EXPORTS_AT_LEAST_THREE: 'exports_at_least_three',
  SAVES_AT_LEAST_TWO: 'saves_at_least_two',
  FIRST_EXPORT: 'first_export',
  FIRST_NARRATE_SPEND: 'first_narrate_spend',
  NO_BEHAVIOUR_YET: 'no_behaviour_yet',
});

/**
 * @typedef {Object} ReaderAudienceEvidence
 * @property {ReaderAudience} audience the verdict
 * @property {readonly string[]} reasons the READER_AUDIENCE_REASONS codes that produced it
 */

/**
 * ⭐ THE ONE SPELLING OF THE LADDER. `computeReaderAudience` below is derived from
 * this rather than duplicating the thresholds: a second copy of a boundary is how
 * an audience gate and its receipt drift into disagreeing about the same reader.
 *
 * Safe to call from non-React code (analytics tagging, edge-function payloads,
 * server-side rendering).
 *
 * @param {Object} signals
 * @param {number} signals.savedCount         — `savedSettlements.length`
 * @param {number} signals.exportCount        — cumulative PDF exports this user has done
 * @param {number} signals.narrateCount       — cumulative narrate credits the user has spent
 * @param {boolean} signals.hasUsedNeighbours — any save with neighbourLinks present
 * @param {boolean} signals.hasUsedLocks      — any save with locked sections
 * @param {string} signals.tier               — 'anon' | 'free' | 'premium' | …
 * @returns {ReaderAudienceEvidence}
 */
export function readerAudienceEvidence(signals) {
  const {
    savedCount = 0,
    exportCount = 0,
    narrateCount = 0,
    hasUsedNeighbours = false,
    hasUsedLocks = false,
    tier = 'anon',
  } = signals || {};
  const R = READER_AUDIENCE_REASONS;
  const verdict = (audience, reasons) =>
    Object.freeze({ audience, reasons: Object.freeze(reasons) });

  // Anonymous users are always 'new' — we have no behavior signal yet.
  if (tier === 'anon') return verdict('new', [R.ANON_NO_SIGNAL]);

  // Worldbuilder: 5+ saves AND at least one campaign-tier behavior
  // (neighbour network, locks, or 3+ exports). The campaign-tier signals are
  // an OR, so the evidence names every one that actually fired rather than the
  // first — a reader with all three earned it three ways and the receipt says so.
  const campaignSignals = [];
  if (hasUsedNeighbours) campaignSignals.push(R.NEIGHBOUR_NETWORK_USED);
  if (hasUsedLocks) campaignSignals.push(R.SECTION_LOCKS_USED);
  if (exportCount >= 3) campaignSignals.push(R.EXPORTS_AT_LEAST_THREE);
  if (savedCount >= 5 && campaignSignals.length > 0) {
    return verdict('worldbuilder', [R.SAVES_AT_LEAST_FIVE, ...campaignSignals]);
  }

  // Intermediate: 2+ saves, or first export, or first narrate spend.
  // These signal "I'm coming back to use this" — not exploring.
  const returningSignals = [];
  if (savedCount >= 2) returningSignals.push(R.SAVES_AT_LEAST_TWO);
  if (exportCount >= 1) returningSignals.push(R.FIRST_EXPORT);
  if (narrateCount >= 1) returningSignals.push(R.FIRST_NARRATE_SPEND);
  if (returningSignals.length > 0) return verdict('intermediate', returningSignals);

  // Default: brand-new account, hasn't done anything yet.
  return verdict('new', [R.NO_BEHAVIOUR_YET]);
}

/**
 * Pure computation of the reader archetype from a snapshot of the store — the
 * verdict alone, for the many callers that only branch on it.
 *
 * @param {Object} signals see `readerAudienceEvidence`
 * @returns {ReaderAudience}
 */
export function computeReaderAudience(signals) {
  return readerAudienceEvidence(signals).audience;
}

/**
 * React hook — the current reader's archetype AND the evidence for it, memoized
 * over the inputs.
 *
 * Components use this for audience-aware affordances:
 *
 *   const { audience, reasons } = useReaderAudienceEvidence();
 *   if (audience === 'worldbuilder') return <FounderTile />;
 *
 * The hook subscribes to the relevant store slices via individual
 * selectors so it doesn't re-render on unrelated state changes (config,
 * UI tab, etc.).
 *
 * @returns {ReaderAudienceEvidence}
 */
export function useReaderAudienceEvidence() {
  const tier = useStore(s => s.auth.tier);
  const savedCount = useStore(s => s.savedSettlements?.length || 0);
  // Behavior-signal aggregates — read derived counters from the store.
  // lifetimeNarrateCount is bumped on the aiSlice AI-generation success paths
  // (requestNarrative/requestProgression), a session-resilient
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
    () => readerAudienceEvidence({
      savedCount, exportCount, narrateCount,
      hasUsedNeighbours, hasUsedLocks, tier,
    }),
    [savedCount, exportCount, narrateCount, hasUsedNeighbours, hasUsedLocks, tier],
  );
}

/**
 * React hook — the archetype alone, for the callers that only branch on it. It is
 * derived from the evidence hook above so a surface can never see a verdict whose
 * evidence it could not also have read.
 *
 * @returns {ReaderAudience}
 */
export function useReaderAudience() {
  return useReaderAudienceEvidence().audience;
}
