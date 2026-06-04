/**
 * creditsSlice - AI credit balance and transaction tracking.
 *
 * AI features are pay-per-use regardless of account tier.
 * Credits are purchased in packs and spent on narrative synthesis,
 * daily life generation, and progression (diff-aware evolution).
 *
 * The actual credit costs live in `src/config/pricing.js` (single
 * source). This slice reads from there for pre-flight checks and
 * keeps the client balance synced with server-authoritative spends.
 *
 * Server-side cost gates: `supabase/functions/generate-narrative/index.ts`
 * has its own CREDIT_COSTS - the contract test guards against drift.
 */

import { getActiveAiCosts, getAiCost, getAiCostForModel } from '../config/pricing.js';

/**
 * Compatibility export. New code should call `getActiveAiCosts()` from
 * the pricing config; this exists so existing tests + components that
 * imported the constant directly still resolve. The function call gives
 * us the *current* flag-driven schedule, not a snapshot.
 */
export const CREDIT_COSTS = new Proxy({}, {
  get(_, feature) { return getAiCost(feature); },
  ownKeys()       { return Object.keys(getActiveAiCosts()); },
  has(_, feature) { return feature in getActiveAiCosts(); },
  getOwnPropertyDescriptor(_, feature) {
    return { configurable: true, enumerable: true, value: getAiCost(feature) };
  },
});

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
    const cost = getAiCostForModel(feature, get().auth?.modelPreference);
    return get().creditBalance >= cost;
  },

  /** Get the cost for a specific feature. */
  getCost: (feature) => getAiCostForModel(feature, get().auth?.modelPreference),

  setPurchaseModalOpen: (open) =>
    set(state => { state.purchaseModalOpen = open; }),
});
