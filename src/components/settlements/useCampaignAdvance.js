/**
 * useCampaignAdvance.js — the Library "Advance Time" handler + its refusal surface
 * (experience-product-fit-2). Extracted from SettlementsPanel so a typed refusal
 * SPEAKS instead of silently no-opping, and so the panel stays under its line ceiling.
 *
 * The store's advanceCampaignWorld returns { ok:false, reason } for a refused advance
 * (world_not_canonized / world_frozen / advance_in_flight / advance_paused /
 * not_entitled …). This hook maps the reason to plain GM-facing language for an inline
 * alert, logs the raw code to the console (never the alert, P10/P11), and treats a
 * PAUSED advance as a navigation — not an error — so the DM lands in the Realm to
 * resume or undo the parked decision.
 *
 * ⚠️ ADVANCE_REFUSAL_TEXT is a DELIBERATE TWIN of useRealmInspector.ADVANCE_ERROR_TEXT
 * (the map route's copy). It is duplicated — NOT imported — on purpose: importing the
 * map's hook into the lazy Library route would add useRealmInspector's chunk to the
 * entry's dynamic-import preload manifest (~40 first-paint bytes). The twin keeps the
 * Library route's dependency set unchanged (ZERO eager bytes). The pin
 * (useCampaignAdvance.test.jsx) asserts the two maps stay identical.
 */

import { useCallback, useState } from 'react';

import { ADVANCE_TIME_NAV_TARGET } from './advanceTimeTarget.js';

/** Plain-language advance-refusal text — the twin of useRealmInspector.ADVANCE_ERROR_TEXT. */
export const ADVANCE_REFUSAL_TEXT = Object.freeze({
  world_not_canonized: 'The realm advances only after you canonize this campaign world.',
  no_settlements: 'Add at least one settlement to this campaign before advancing.',
  busy: 'The realm is already advancing. Give it a moment.',
  advance_in_flight: 'The realm is already advancing. Give it a moment.',
  advance_paused: 'This realm has a paused advance. Resume it (or undo it) before advancing again.',
  world_frozen: 'Time is frozen in this world — nothing moves until you unfreeze it. Change World progression in Simulation rules to advance.',
});

/**
 * @param {Object} deps
 * @param {(campaignId: string, interval?: string) => Promise<any>} deps.advanceCampaignWorld
 * @param {(campaignId: string) => void} deps.setActiveCampaign
 * @param {(view: string) => void} [deps.onNavigate]
 * @returns {{ advanceError: string | null, setAdvanceError: (v: string | null) => void,
 *   handleAdvanceCampaignTime: (campaignId: string, interval?: string) => Promise<void> }}
 */
export function useCampaignAdvance({ advanceCampaignWorld, setActiveCampaign, onNavigate }) {
  const [advanceError, setAdvanceError] = useState(null);
  const handleAdvanceCampaignTime = useCallback(async (campaignId, interval = 'one_month') => {
    setAdvanceError(null);
    const result = await advanceCampaignWorld(campaignId, interval);
    const reason = result?.ok === false ? String(result.reason || result.code || '') : '';
    // A paused advance is not an error — it parks a decision; fall through to the
    // Realm nav so the DM can resume/undo it (mirrors the success path).
    if (reason && reason !== 'advance_paused') {
      console.warn(`[advance] refused: ${reason}`);
      setAdvanceError(ADVANCE_REFUSAL_TEXT[reason] || 'The realm could not advance right now.');
      return;
    }
    setActiveCampaign(campaignId);
    onNavigate?.(ADVANCE_TIME_NAV_TARGET.view);
  }, [advanceCampaignWorld, setActiveCampaign, onNavigate]);
  return { advanceError, setAdvanceError, handleAdvanceCampaignTime };
}
