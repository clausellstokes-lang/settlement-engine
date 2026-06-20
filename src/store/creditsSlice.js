/**
 * creditsSlice — AI credit balance and transaction tracking.
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
 * has its own CREDIT_COSTS — the contract test guards against drift.
 *
 * Spend model: the SERVER is the sole authority on credit burn. The AI
 * generation success paths in aiSlice set `creditBalance` directly from the
 * server's returned `creditsRemaining`; the client never decrements locally.
 * `spendCredits`/`addCredits` below are therefore NOT on the live spend path —
 * they remain as a self-contained balance API (and to keep `setCreditBalance`/
 * `canAfford` company) but are currently uncalled. Do not reintroduce a client
 * decrement on the generation path: it would double-count against the
 * server-set balance.
 */

import { getActiveAiCosts, getAiCost, getAiCostForModel } from '../config/pricing.js';
import { track, EVENTS } from '../lib/analytics.js';

/** Coarse band for a credit balance (analytics only — never a control-flow input). */
const creditsRemainingBand = (n) =>
  n <= 0 ? 'zero' : n <= 5 ? '1_5' : n <= 20 ? '6_20' : 'gt_20';

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

  // NOTE: not on the live purchase path (a completed purchase refreshes the
  // balance from the server via setCreditBalance). Kept as a balance API.
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

  // NOTE: not on the live spend path (the server decrements and returns the
  // new balance, which aiSlice writes via setCreditBalance). Kept as a
  // self-contained balance API; see the slice docstring.
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

    // Analytics: credit-burn shape if a local spend is ever performed
    // (fire-and-forget). The live spend chokepoint is server-side.
    track(EVENTS.CREDITS_SPENT, {
      action_type: feature,
      cost: amount,
      remaining_band: creditsRemainingBand(creditBalance - amount),
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
