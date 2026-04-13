/**
 * aiSlice — AI narrative layer and daily-life generation state.
 *
 * The narrative layer is a DISPLAY enhancement, not a data mutation.
 * settlement.data is always the source of truth. The narrative is a
 * parallel rendering stored separately with a toggle to switch views.
 *
 * AI features are gated by credits (creditsSlice), not account tier.
 */

import { generateNarrative } from '../lib/ai.js';
import { CREDIT_COSTS } from './creditsSlice.js';

export const createAiSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  aiSettlement:     null,   // AI-narrated version of settlement (display only)
  aiDailyLife:      null,   // AI-generated daily life prose
  aiLoading:        false,  // true while an AI request is in-flight
  aiError:          null,   // error message from last failed request
  showNarrative:    false,  // toggle: true = show AI narrative, false = show raw data
  aiDataVersion:    null,   // timestamp of settlement data the narrative was built from

  // ── Actions ────────────────────────────────────────────────────────────────
  setAiSettlement: (aiData) =>
    set(state => {
      state.aiSettlement = aiData;
      state.aiDataVersion = Date.now();
    }),

  clearAiSettlement: () =>
    set(state => {
      state.aiSettlement = null;
      state.aiDailyLife = null;
      state.aiDataVersion = null;
    }),

  setAiDailyLife: (prose) =>
    set(state => { state.aiDailyLife = prose; }),

  setAiLoading: (loading) =>
    set(state => { state.aiLoading = loading; }),

  setAiError: (error) =>
    set(state => { state.aiError = error; }),

  toggleNarrativeView: () =>
    set(state => { state.showNarrative = !state.showNarrative; }),

  setShowNarrative: (show) =>
    set(state => { state.showNarrative = show; }),

  /**
   * Check if the current narrative is stale (settlement changed since generation).
   */
  isNarrativeStale: () => {
    const { aiDataVersion, settlement } = get();
    if (!aiDataVersion || !settlement) return true;
    return false;
  },

  // ── AI generation actions ─────────────────────────────────────────────────

  /**
   * Generate an AI narrative synthesis for the current settlement.
   * Deducts credits via the edge function (server-side).
   */
  requestNarrative: async () => {
    const { settlement, aiLoading, creditBalance } = get();
    if (!settlement || aiLoading) return;

    const cost = CREDIT_COSTS.narrative;
    if (creditBalance < cost) {
      set(state => { state.aiError = `Insufficient credits (need ${cost}, have ${state.creditBalance})`; });
      get().setPurchaseModalOpen(true);
      return;
    }

    set(state => { state.aiLoading = true; state.aiError = null; });

    try {
      const { result, creditsRemaining } = await generateNarrative('narrative', settlement);
      set(state => {
        state.aiSettlement = result;
        state.aiDataVersion = Date.now();
        state.aiLoading = false;
        state.showNarrative = true;
        state.creditBalance = creditsRemaining;
      });
    } catch (e) {
      set(state => {
        state.aiError = e.message || 'Narrative generation failed';
        state.aiLoading = false;
      });
    }
  },

  /**
   * Generate AI daily-life prose for the current settlement.
   */
  requestDailyLife: async () => {
    const { settlement, aiLoading, creditBalance } = get();
    if (!settlement || aiLoading) return;

    const cost = CREDIT_COSTS.dailyLife;
    if (creditBalance < cost) {
      set(state => { state.aiError = `Insufficient credits (need ${cost}, have ${state.creditBalance})`; });
      get().setPurchaseModalOpen(true);
      return;
    }

    set(state => { state.aiLoading = true; state.aiError = null; });

    try {
      const { result, creditsRemaining } = await generateNarrative('dailyLife', settlement);
      set(state => {
        state.aiDailyLife = result;
        state.aiLoading = false;
        state.creditBalance = creditsRemaining;
      });
    } catch (e) {
      set(state => {
        state.aiError = e.message || 'Daily life generation failed';
        state.aiLoading = false;
      });
    }
  },
});
