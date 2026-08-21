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
 * This slice therefore MIRRORS a balance and prices a pre-flight check; it does
 * not move money. Do not reintroduce a client decrement on the generation path:
 * it would double-count against the server-set balance.
 *
 * RETIRED (R-5b, owner queue #21): `addCredits` and `spendCredits`, plus the
 * `transactions` array they were the only writers of and the CREDITS_SPENT
 * analytics call spendCredits was the only producer of. They were a second,
 * client-side ledger sitting next to a server-authoritative one — uncalled, kept
 * "as a balance API", and one careless wiring away from double-counting a paid
 * balance. Their registry rows advertised recovery through
 * 'external:server-rebalance', which is not a recovery a player can reach. This
 * changes NO paid behavior: no purchase, spend, refund, or balance read went
 * through them (the live paths are aiSlice → setCreditBalance from the server's
 * `creditsRemaining`, and the durable history UI reads lib/creditLedger.js from
 * the server). The credits SQL, the edge functions, and pricing.js are untouched.
 * `transactions` was session-only — absent from the persist partialize in
 * store/index.js — so nothing durable referred to it and no migration is owed.
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
  creditBalance:     0,         // current credit balance (mirrors the server)
  purchaseModalOpen: false,     // whether the purchase modal is showing

  // ── Actions ────────────────────────────────────────────────────────────────
  // THE ONLY WRITER of creditBalance, and it writes what the server said. See the
  // retirement note in the slice docstring for why there is no local debit/credit.
  setCreditBalance: (balance) =>
    set(state => { state.creditBalance = balance; }),

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
