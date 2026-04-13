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

// Estimated credit costs (mirrored from server config)
export const CREDIT_COSTS = {
  narrative: 5,    // credits per narrative synthesis
  dailyLife: 3,    // credits per daily life generation
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
    const cost = CREDIT_COSTS[feature] || 0;
    return get().creditBalance >= cost;
  },

  /** Get the cost for a specific feature. */
  getCost: (feature) => CREDIT_COSTS[feature] || 0,

  setPurchaseModalOpen: (open) =>
    set(state => { state.purchaseModalOpen = open; }),
});
