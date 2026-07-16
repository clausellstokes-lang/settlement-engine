/**
 * useCampaignAdvance.js — the Library "Advance Time" handler + its refusal surface
 * (experience-product-fit-2). Extracted from SettlementsPanel so a typed refusal
 * SPEAKS instead of silently no-opping, and so the panel stays under its line
 * ceiling.
 *
 * The store's advanceCampaignWorld returns { ok:false, reason } for a refused
 * advance (world_not_canonized / world_frozen / advance_in_flight / advance_paused
 * / not_entitled …). This hook maps the reason to plain GM-facing language
 * (ADVANCE_ERROR_TEXT) for an inline alert, logs the raw code to the console (never
 * the alert, P10/P11), and treats a PAUSED advance as a navigation — not an error —
 * so the DM lands in the Realm to resume or undo the parked decision.
 */

import { useCallback, useState } from 'react';

import { ADVANCE_TIME_NAV_TARGET } from './advanceTimeTarget.js';
import { ADVANCE_ERROR_TEXT } from '../../hooks/useRealmInspector.js';

/**
 * @param {Object} deps
 * @param {(campaignId: string, interval?: string) => Promise<any>} deps.advanceCampaignWorld
 * @param {(campaignId: string) => void} deps.setActiveCampaign
 * @param {(view: string) => void} [deps.onNavigate]
 * @returns {{ advanceError: string, setAdvanceError: (v: string) => void,
 *   handleAdvanceCampaignTime: (campaignId: string, interval?: string) => Promise<void> }}
 */
export function useCampaignAdvance({ advanceCampaignWorld, setActiveCampaign, onNavigate }) {
  const [advanceError, setAdvanceError] = useState('');
  const handleAdvanceCampaignTime = useCallback(async (campaignId, interval = 'one_month') => {
    setAdvanceError('');
    const result = await advanceCampaignWorld(campaignId, interval);
    const reason = result?.ok === false ? String(result.reason || result.code || '') : '';
    // A paused advance is not an error — it parks a decision; fall through to the
    // Realm nav so the DM can resume/undo it (mirrors the success path).
    if (reason && reason !== 'advance_paused') {
      console.warn(`[advance] refused: ${reason}`);
      setAdvanceError(ADVANCE_ERROR_TEXT[reason] || 'The realm could not advance right now.');
      return;
    }
    setActiveCampaign(campaignId);
    onNavigate?.(ADVANCE_TIME_NAV_TARGET.view);
  }, [advanceCampaignWorld, setActiveCampaign, onNavigate]);
  return { advanceError, setAdvanceError, handleAdvanceCampaignTime };
}
