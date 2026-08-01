/**
 * store/index.js — Unified Zustand store, one slice per domain (the create*Slice
 * spreads below are the authoritative census; the old "14 slices" header count
 * rotted to 18 unnoticed, so no count is transcribed here).
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
 *   corpusFactory     – generation-time content corpus factory state
 *   instantWorld      – the instant-world (one-click realm) flow state
 *   onboarding        – the session nudge-toast channel (the first-run coach was
 *                       retired 2026-07-27; teaching lives in the guidance registry)
 *   ui                – cross-cutting UI flags (modals, wizard step / mode)
 *   displayPrefs      – PERSISTED device-scoped display preferences (uiSlice's
 *                       persisted counterpart; see that slice's header)
 *   accountImport     – the "Import my data" write pipeline (batch + rollback)
 *   fogEdit           – map fog-of-war editing state
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
import { createConfigSlice }     from './configSlice.js';
import { createToggleSlice }     from './toggleSlice.js';
// normalizeServicesToggles rides a SEPARATE import (not the createToggleSlice
// line) so the operationRegistry census walker — which derives the composed-slice
// file list from the `import { createXSlice }` lines — still recognises this slice.
import { normalizeServicesToggles } from './toggleSlice.js';
import { createSettlementSlice } from './settlementSlice.js';
import { createAiSlice }         from './aiSlice.js';
import { createNeighbourSlice }  from './neighbourSlice.js';
import { createMapSlice }        from './mapSlice.js';
import { createCreditsSlice }      from './creditsSlice.js';
import { createCampaignSlice }     from './campaignSlice.js';
import { createCampaignRegionalSlice } from './campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from './campaignWorldPulseSlice.js';
import { createCustomContentSlice } from './customContentSlice.js';
import { createCorpusFactorySlice } from './corpusFactorySlice.js';
import { createInstantWorldSlice }  from './instantWorldSlice.js';
import { createOnboardingSlice }    from './onboardingSlice.js';
import { createUiSlice }            from './uiSlice.js';
import { createDisplayPrefsSlice }  from './displayPrefsSlice.js';
import { createAccountImportSlice } from './accountImportSlice.js';
import { createFogEditSlice }       from './fogEditSlice.js';
// W-H4 — the DM's three verbs over the world NPC ledger, plus their inverse. Thin and
// eager by construction: the bodies dynamic-import on first use.
import { createNpcVerbsSlice }      from './npcVerbsSlice.js';
import { mergePersistedState }     from './persistMerge.js';
import { setCustomContentSource }   from '../lib/customContentSource.js';
import { setCrashForensics }        from '../lib/errorReporter.js';
import { buildCrashForensics }      from '../lib/crashForensics.js';
import { saves as savesService }    from '../lib/saves.js';

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
          ...createCorpusFactorySlice(set, get),
          ...createInstantWorldSlice(set, get),
          ...createOnboardingSlice(set),
          ...createUiSlice(set, get),
          ...createDisplayPrefsSlice(set, get),
          ...createAccountImportSlice(set, get),
          ...createFogEditSlice(set, get),
          ...createNpcVerbsSlice(set, get),
        })),
        {
          name: 'settlementforge',
          // store-6: an explicit persist version + a migrate hook, so a future
          // persisted-shape change has a real upgrade seam instead of silently
          // forking returning users. v2 adds the JSON-safe, field-level config
          // intent record used by content-environment defaults. Its legacy
          // inference and config-key backfill are handled structurally by
          // `merge` below, which runs on every rehydrate regardless of version.
          version: 2,
          migrate: (persistedState /* , fromVersion */) => persistedState,
          // store-6: zustand's DEFAULT merge is a SHALLOW top-level spread
          // ({ ...current, ...persisted }), so a returning user's persisted `config`
          // object REPLACES DEFAULT_CONFIG wholesale — any key added to DEFAULT_CONFIG
          // after they last saved reads `undefined` for them (a silent config-shape
          // fork between cohorts that reaches the generator as input). mergePersistedState
          // deep-merges config (and the four toggle maps) OVER their defaults so a
          // returning user's missing keys backfill to what a fresh user gets, while the
          // top-level spread still restores every other slice's methods + state.
          merge: mergePersistedState,
          partialize: (state) => ({
            // Persist only lightweight, user-owned data.
            // Never persist the massive generated settlement object.
            // wizardStep / wizardMode are intentionally NOT persisted — users
            // expect to land on the mode picker on every visit, not get
            // dumped straight into whatever flow they used last session.
            config: state.config,
            configExplicitFields: state.configExplicitFields,
            institutionToggles: state.institutionToggles,
            categoryToggles:    state.categoryToggles,
            goodsToggles:       state.goodsToggles,
            servicesToggles:    state.servicesToggles,
            // R-5b (owner queue #17): device-scoped DISPLAY preferences — the 3D
            // portrait's quality ceiling today. Persistence CONTENT, not a schema
            // change: an additive top-level key whose absence rehydrates to the
            // slice defaults (mergePersistedState deep-merges it over them), so no
            // persist `version` bump and no migrate branch is owed. Deliberately
            // NOT uiSlice's userPrefs, which is the session-only bag by contract.
            displayPrefs:       state.displayPrefs,
            // Realm directive 7 (J-D7): the FULL AUTO-RESOLVE play mode. Same
            // additive-top-level-key discipline as displayPrefs above — persistence
            // CONTENT, not a schema change, absent-tolerant (an older blob rehydrates
            // to the slice's `false` default), so no persist `version` bump and no
            // migrate branch. Deliberately NOT folded into displayPrefs: that bag is
            // chartered for preferences about the MACHINE the user is sitting at, and
            // this one is about how the WORLD advances.
            advanceAutoResolve: state.advanceAutoResolve,
          }),
          // On rehydrate: always start the Create page at the mode picker.
          // (Also wipes any stale wizardMode persisted by older builds.) AND heal
          // legacy service toggles keyed under the pre-Stage-2b display-name form
          // into the current svcKey form. store-lifecycle: servicesToggles IS
          // persisted (partialize below), but the normalize migration ran on NO
          // product path — the hydrateServicesToggles action was never invoked and
          // save-load wrote the bag raw — so a returning user's saved service prefs
          // silently stopped applying and never self-healed. This is the single
          // rehydrate chokepoint the migration's own docstring prescribes; the pass
          // is pure + idempotent, so a bag already in the new form normalizes to
          // itself (no churn for the common case).
          onRehydrateStorage: () => (state) => {
            if (!state) return;
            state.wizardStep = 0;
            state.wizardMode = null;
            state.servicesToggles = normalizeServicesToggles(state.servicesToggles);
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
// DE-EAGER (2026-07-19): the wiring goes through the tiny EAGER seam
// (lib/customContentSource.js), NOT dependencyEngine directly — a static
// import of dependencyEngine here dragged the whole registry (~41 KB) into
// the first-paint closure. The lazy registry reads the getter off the seam
// when it loads with its real consumers.
setCustomContentSource(() => useStore.getState().customContent);

// R-14 CRASH FORENSICS: register the reproduction-coordinate provider so any
// client error report carries the active world's seed + tick + flags_on. Reads
// only scalars off the live state; errorReporter whitelists again before send —
// never world state, never PII. (errorReporter stays store-free; the store
// injects the reader, mirroring the custom-content seam above.)
setCrashForensics(() => buildCrashForensics(useStore.getState()));

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
      // F34 — this is the REAL post-signup save chokepoint. Fire the
      // first_save/third_save pricing moment + 'saved' research capture here
      // (the dead store saveSettlement action used to host them). Fire-and-forget.
      import('./saveMoments.js')
        .then(({ recordSaveMomentForActiveSave }) =>
          recordSaveMomentForActiveSave({ saveId: result, settlement: payload.settlement, store: useStore }))
        .catch(() => { /* never block the save */ });
      // Fire analytics + a toast via the store so the user sees the result.
      const { Funnel, EVENTS } = await import('../lib/analytics.js');
      // userId rides the hashed opts lane, never props — this essential-class
      // event mirrors props raw to the third-party provider (W-R2-TRUST: same
      // class as components-dossier-library-1, surfaced by the props privacy scan).
      Funnel.track(EVENTS.SAVE_SIGNUP_INTENT_FULFILLED, {
        tier: payload.tier,
      }, { userId: ctx?.user?.id });
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
