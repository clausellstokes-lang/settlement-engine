/**
 * creditsSlice — AI credit balance and transaction tracking.
 *
 * AI features are pay-per-use regardless of account tier.
 * Credits are purchased in packs and spent on:
 *   - Narrative synthesis (~X credits per settlement)
 *   - Daily life generation (~Y credits per generation)
 *
 * The actual credit costs are defined server-side.
 * This slice tracks the client-side balance and provides
 * pre-flight checks before AI requests.
 */

// Estimated credit costs (mirrored from server config).
// All MUST match the CREDIT_COSTS map in supabase/functions/generate-narrative/index.ts.
export const CREDIT_COSTS = {
  narrative:   8,    // Opus thesis + 13 Haiku refinement passes
  dailyLife:   10,   // 5 parallel Opus paragraphs (dawn -> night)
  // Progression (AI-4): diff-aware evolution of an existing narrative.
  // Priced above narrative because the Opus thesis sees the prior thesis +
  // the new state + the change diff; the continuity guarantee is the value.
  progression: 12,
};

export const createCreditsSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  creditBalance:     0,         // current credit balance
  transactions:      [],        // recent transactions for display
  purchaseModalOpen: false,     // whether the purchase modal is showing

  // ── Actions ────────────────────────────────────────────────────────────────
  setCreditBalance: (balance) =>
    set(state => { state.creditBalance = balance; }),

  addCredits: (amount, source) =>
    set(state => {
      state.creditBalance += amount;
      state.transactions.unshift({
        type: 'purchase',
        amount,
        source,
        timestamp: Date.now(),
      });
    }),

  spendCredits: (amount, feature) => {
    if (get().isElevated()) return true; // elevated roles have unlimited credits
    const { creditBalance } = get();
    if (creditBalance < amount) return false;

    set(state => {
      state.creditBalance -= amount;
      state.transactions.unshift({
        type: 'spend',
        amount: -amount,
        feature,
        timestamp: Date.now(),
      });
    });
    return true;
  },

  /** Pre-flight check: can the user afford this AI feature? */
  canAfford: (feature) => {
    if (get().isElevated()) return true;
    const cost = CREDIT_COSTS[feature] || 0;
    return get().creditBalance >= cost;
  },

  /** Get the cost for a specific feature. */
  getCost: (feature) => CREDIT_COSTS[feature] || 0,

  setPurchaseModalOpen: (open) =>
    set(state => { state.purchaseModalOpen = open; }),
});
