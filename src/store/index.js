/**
 * store/index.js — Unified Zustand store with 8 slices.
 *
 * Slices:
 *   auth       – user session, tier (anon / free / premium), permissions
 *   config     – settlement configuration, tier-gated by auth
 *   toggles    – institution / service / goods toggles
 *   settlement – current + saved settlements, reactive-update state
 *   ai         – narrative layer, daily-life, generation state
 *   neighbour  – neighbour links, imported neighbour, cross-settlement effects
 *   map        – Azgaar bridge state, selected burg, supply-chain overlays
 *   credits    – credit balance, transaction history
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
import { createSettlementSlice } from './settlementSlice.js';
import { createAiSlice }         from './aiSlice.js';
import { createNeighbourSlice }  from './neighbourSlice.js';
import { createMapSlice }        from './mapSlice.js';
import { createCreditsSlice }    from './creditsSlice.js';

export const useStore = create(
  devtools(
    subscribeWithSelector(
      persist(
        immer((...a) => ({
          ...createAuthSlice(...a),
          ...createConfigSlice(...a),
          ...createToggleSlice(...a),
          ...createSettlementSlice(...a),
          ...createAiSlice(...a),
          ...createNeighbourSlice(...a),
          ...createMapSlice(...a),
          ...createCreditsSlice(...a),
        })),
        {
          name: 'settlement-engine',
          partialize: (state) => ({
            // Persist only lightweight, user-owned data.
            // Never persist the massive generated settlement object.
            config: state.config,
            institutionToggles: state.institutionToggles,
            categoryToggles:    state.categoryToggles,
            goodsToggles:       state.goodsToggles,
            servicesToggles:    state.servicesToggles,
            wizardStep:         state.wizardStep,
            wizardMode:         state.wizardMode,
          }),
        },
      ),
    ),
    { name: 'SettlementEngine' },
  ),
);

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
