/**
 * store/index.js — Unified Zustand store with 14 slices.
 *
 * Slices:
 *   auth              – user session, tier (anon / free / premium), permissions
 *   config            – settlement configuration, tier-gated by auth
 *   toggles           – institution / service / goods toggles
 *   settlement        – current + saved settlements, reactive-update state
 *   ai                – narrative layer, daily-life, generation state
 *   neighbour         – neighbour links, imported neighbour, cross-settlement effects
 *   map               – Fantasy World Map bridge state, selected burg, supply-chain overlays
 *   credits           – credit balance, transaction history
 *   campaign          – campaign folders + per-settlement campaign state, settlement-clock bridge
 *   campaignRegional  – campaign regional graph + channels + cross-settlement impacts/stressors
 *   campaignWorldPulse– campaign world-pulse simulation (preview/advance/proposals/undo)
 *   customContent     – user-authored institutions / resources / trade routes
 *   onboarding        – first-run coaching + nudge state
 *   ui                – cross-cutting UI flags (modals, wizard step / mode)
 *
 * Usage:
 *   import { useStore } from '../store';
 *   const config = useStore(s => s.config);
 *   const updateConfig = useStore(s => s.updateConfig);
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { createAuthSlice }       from './authSlice.js';
import { createConfigSlice, DEFAULT_CONFIG } from './configSlice.js';
import { createToggleSlice }     from './toggleSlice.js';
import { createSettlementSlice } from './settlementSlice.js';
import { createAiSlice }         from './aiSlice.js';
import { createNeighbourSlice }  from './neighbourSlice.js';
import { createMapSlice }        from './mapSlice.js';
import { createCreditsSlice }      from './creditsSlice.js';
import { createCampaignSlice }     from './campaignSlice.js';
import { createCampaignRegionalSlice } from './campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from './campaignWorldPulseSlice.js';
import { createCustomContentSlice } from './customContentSlice.js';
import { createOnboardingSlice }    from './onboardingSlice.js';
import { createUiSlice }            from './uiSlice.js';
import { setCustomContentSource }   from '../lib/dependencyEngine.js';
import { saves as savesService }    from '../lib/saves.js';

/**
 * Persist-rehydration merge. Exported (not just inlined in the persist config)
 * so it can be unit-tested without importing the full store + its side effects.
 *
 * Deep-merges the durable bags (config / userPrefs / productPrefs) over the
 * slice defaults instead of zustand's shallow replace. Critically, `config` is
 * overlaid on DEFAULT_CONFIG so a key ADDED to DEFAULT_CONFIG after a user last
 * persisted reads back its default rather than `undefined` (a missing boolean
 * would otherwise be treated as falsy and silently mis-resolve generation). The
 * persisted user values still win over the defaults for keys they DID persist.
 */
export function mergePersistedState(persisted, current) {
  const c = /** @type {any} */ (current) || {};
  const p = /** @type {any} */ (persisted) || {};
  return {
    ...c,
    ...p,
    config: { ...DEFAULT_CONFIG, ...(p.config || {}) },
    userPrefs: { ...c.userPrefs, ...(p.userPrefs || {}) },
    productPrefs: { ...c.productPrefs, ...(p.productPrefs || {}) },
  };
}

export const useStore = create(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          ...createAuthSlice(set, get),
          ...createConfigSlice(set, get),
          ...createToggleSlice(set, get),
          ...createSettlementSlice(set, get),
          ...createAiSlice(set, get),
          ...createNeighbourSlice(set, get),
          ...createMapSlice(set, get),
          ...createCreditsSlice(set, get),
          ...createCampaignSlice(set, get),
          ...createCampaignRegionalSlice(set, get),
          ...createCampaignWorldPulseSlice(set, get),
          ...createCustomContentSlice(set, get),
          ...createOnboardingSlice(set, get),
          ...createUiSlice(set, get),
        })),
        {
          name: 'settlementforge',
          partialize: (state) => ({
            // Persist only lightweight, user-owned data.
            // Never persist the massive generated settlement object.
            // wizardStep / wizardMode are intentionally NOT persisted — users
            // expect to land on the mode picker on every visit, not get
            // dumped straight into whatever flow they used last session.
            config: state.config,
            institutionToggles: state.institutionToggles,
            categoryToggles:    state.categoryToggles,
            goodsToggles:       state.goodsToggles,
            servicesToggles:    state.servicesToggles,
            // The progressive-disclosure altitude is a durable, user-owned pref
            // (a returning power user should stay at Engine). ONLY detailLevel is
            // persisted from userPrefs — the other keys (tableViewOpen) stay
            // transient. Persist-merge re-applies this over the slice default.
            userPrefs: { detailLevel: state.userPrefs?.detailLevel },
            // Durable Account → Product Preferences. Persist the whole bag so a
            // returning user keeps their default detail level, PDF style,
            // player-view/AI-polish defaults, etc.
            productPrefs: state.productPrefs,
            // Lifetime narrate-spend count (P104 / X-4) feeds useReaderAudience's
            // anonymous → intermediate progression. Persist it so the signal
            // survives reloads instead of resetting to 0 every session.
            lifetimeNarrateCount: state.lifetimeNarrateCount,
          }),
          // Deep-merge the durable bags (config / userPrefs / productPrefs) so a
          // persisted value overlays the slice defaults WITHOUT clobbering keys
          // it predates. zustand's default merge is shallow — it would replace
          // each whole object, dropping the rest (the userPrefs/tableViewOpen
          // bug, and the config-key-undefined bug for returning users). See
          // mergePersistedState for the rationale.
          merge: mergePersistedState,
          // On rehydrate: always start the Create page at the mode picker.
          // (Also wipes any stale wizardMode persisted by older builds.)
          onRehydrateStorage: () => (state) => {
            if (!state) return;
            state.wizardStep = 0;
            state.wizardMode = null;
          },
        },
      ),
    ),
    { name: 'SettlementForge' },
  ),
);

// Wire the dependencyEngine to read customContent from this store.
// This is the only edge that connects the (store-agnostic) generator's
// custom-content lookup back to the live app state. Done here, at the
// store, rather than inside dependencyEngine itself — that keeps the
// generator side free of any zustand/react import and makes it
// runnable headlessly (snapshot tests, scripts, server jobs).
setCustomContentSource(() => useStore.getState().customContent);

// ── P101 / X-3 — Auth intent handlers ───────────────────────────────────
// Register handlers for post-auth pending intents. Keep authIntents itself
// lazy so GenerateWizard/authSlice do not create a mixed static/dynamic
// chunk that Vite has to warn about.
function registerAuthIntentHandlers({ registerHandler, INTENTS }) {
  registerHandler(INTENTS.SAVE_SETTLEMENT, async (payload, ctx) => {
    if (!payload || !payload.settlement) return null;
    try {
      const result = await savesService.save({
        name: payload.name || 'Untitled Settlement',
        tier: payload.tier || 'unknown',
        settlement: payload.settlement,
        config: payload.config || null,
      });
      // Refresh savedSettlements so the count is accurate, then fire the
      // real-save instrumentation (first_save/third_save pricing moments +
      // 'saved' fingerprint) for post-login saves too. Fire-and-forget.
      try {
        const refreshed = await savesService.list();
        useStore.getState().setSavedSettlements?.(refreshed);
      } catch { /* count may be stale; instrumentation still safe */ }
      try {
        useStore.getState().notePersistedSave?.(payload.settlement, result);
      } catch { /* instrumentation must never throw */ }
      // Fire analytics + a toast via the store so the user sees the result.
      const { Funnel, EVENTS } = await import('../lib/analytics.js');
      Funnel.track(EVENTS.SAVE_SIGNUP_INTENT_FULFILLED, {
        tier: payload.tier,
        userId: ctx?.user?.id,
      });
      // Surface a toast through the existing onboardingNudge channel so we
      // don't add another notification mechanism. The user sees this on
      // their first signed-in dashboard load.
      try {
        const setOnboardingNudge = useStore.getState().setOnboardingNudge;
        if (typeof setOnboardingNudge === 'function') {
          setOnboardingNudge(`Saved as ${payload.name} — view it in Settlements.`);
        }
      } catch { /* nudge slice might not be initialized in tests */ }
      return result;
    } catch (e) {
      console.warn('[authIntent.save-settlement] failed:', e);
      return null;
    }
  });
}

import('../lib/authIntents.js')
  .then(registerAuthIntentHandlers)
  .catch(e => {
    console.warn('[store] auth intent registration failed:', e);
  });

// ── Convenience selectors ────────────────────────────────────────────────────
// Thin wrappers so components don't repeat selector boilerplate.

export const useAuth       = ()  => useStore(s => s.auth);
export const useConfig     = ()  => useStore(s => s.config);
export const useSettlement = ()  => useStore(s => s.settlement);
export const useAi         = ()  => useStore(s => s.aiSettlement);
export const useCredits    = ()  => useStore(s => s.creditBalance);

// Permission helpers
export const useCanSave       = () => useStore(s => s.canSave());
export const useCanUseNeighbour = () => useStore(s => s.canUseNeighbour());
export const useCanExport     = () => useStore(s => s.canExport());
export const useMaxTier       = () => useStore(s => s.maxAllowedTier());

// Role helpers
export const useIsDeveloper   = () => useStore(s => s.isDeveloper());
export const useIsAdmin       = () => useStore(s => s.isAdmin());
export const useIsElevated    = () => useStore(s => s.isElevated());
