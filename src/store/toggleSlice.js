/**
 * toggleSlice — Institution, category, service, and goods toggles.
 *
 * Key formats:
 *   Institution: "tier::category::name"  →  { allow, require, forceExclude }
 *   Category:    "tier::category"        →  boolean
 *   Service:     "svcKey_service_name"   →  { allow, force, forceExclude }
 *   Good:        "tier_good_name"        →  { allow, force, forceExclude }
 *
 * SCOPE CONTRACT — store-GLOBAL, and that is INTENDED (Wave R-3 Lane C
 * investigation of owner-queue #9; verdict recorded 2026-07-27, vetoable).
 * The four bags are GENERATION SETTINGS, the same class as `config`: they
 * shape the NEXT settlement generated, not any existing one. Four layers
 * already agree on that semantics, and the scope pin test walks them:
 *
 *   1. operationRegistry declares every toggle op targetScope:'global'
 *      with "…in the generation settings" descriptions.
 *   2. Persistence: the zustand partialize (store/index.js) persists the
 *      bags beside `config` as user preferences, deep-merge-healed on
 *      rehydrate (persistMerge.js).
 *   3. Per-settlement capture: generateSettlement snapshots the live bags
 *      into the pipeline config as _institutionToggles/_categoryToggles/
 *      _goodsToggles/_servicesToggles (consumed by resolveConfig), so each
 *      settlement's generation inputs are immutable provenance — changing
 *      a global bag NEVER rewrites an existing settlement.
 *   4. Round-trip: save entries carry copies of the bags (saves.js
 *      `toggles` bundling) and the Library load path restores them into
 *      the global bags (SettlementsPanel onLoad), so re-generation from a
 *      loaded save reproduces its settings.
 *
 * Cross-settlement carry-over between generations is therefore the same
 * behavior config sliders have, not a scoping bug. Per-save LIVE scoping
 * would require reshaping persisted state (persistence-shape change) and
 * is owner-gated if ever wanted.
 * @enforced-by tests/store/toggleSlice.scope.test.js
 */

import {
  INSTITUTION_SERVICE_KEYS,
} from '../data/institutionServiceKeys.generated.js';

const INSTITUTION_SERVICE_KEY_SET = new Set(INSTITUTION_SERVICE_KEYS);

// ── Service-key normalization ────────────────────────────────────────────────
// The Stage-2b ServicesTogglePanel fix moved the servicesToggles WRITE key from
// the display institution name (`${instName}_service_${svcName}`) to the catalog
// service-key form (`${svcKey}_service_${svcName}`, where svcKey ∈ keys of
// INSTITUTION_SERVICES). Toggles a user persisted under the OLD form are now
// orphaned — `getToggle` reads the svcKey-keyed value and never finds them.
//
// `matchServiceName` is a verbatim mirror of the panel's derivation (the panel
// does not export it), so an old display-name key maps to exactly the svcKey the
// panel now writes/reads.
function matchServiceName(instName) {
  const lower = instName.toLowerCase().split(/[\s'(),\-/]+/).filter(w => w.length > 2);
  let best = null, bestScore = 0;
  for (const key of INSTITUTION_SERVICE_KEYS) {
    const kw = key.toLowerCase().split(/[\s'(),\-/]+/).filter(w => w.length > 2);
    let score = 0;
    for (const kp of kw) for (const lp of lower) {
      if (kp === lp) score += 2;
      else if (kp.length > 3 && lp.startsWith(kp)) score += 1;
      else if (lp.length > 4 && kp.startsWith(lp)) score += 1;
    }
    const norm = kw.length > 0 ? score / (kw.length * 2) : 0;
    if (score > bestScore || (score === bestScore && score > 0 && norm > (bestScore / (kw.length * 2 || 1)))) {
      bestScore = score; best = key;
    }
  }
  return bestScore > 0 ? best : null;
}

/**
 * One-time hydrate migration: normalize a persisted servicesToggles bag keyed in
 * the OLD display-name form into the new svcKey form. Pure + idempotent.
 *
 * Rules:
 *  - Keys are `<instName>_service_<svcName>`. Service names in INSTITUTION_SERVICES
 *    never contain "_service_" (verified), so the split isolates svcName off the
 *    LAST "_service_" occurrence — robust even if instName itself contains one.
 *  - If the leading segment is ALREADY a valid INSTITUTION_SERVICES key, the entry
 *    is already in the new form → keep it verbatim. This is what makes the pass
 *    idempotent AND collision-safe: matchServiceName is NOT a fixed point on all
 *    of its own outputs (e.g. "Brothel" ↦ "Brothel (red light district)"), so
 *    re-mapping an already-migrated key would corrupt it.
 *  - Otherwise derive svcKey = matchServiceName(instName). If null (unmappable),
 *    DROP the entry rather than mis-apply it.
 *  - A genuine new-format entry always wins a key collision with a remapped one
 *    (never overwrite already-correct data).
 *  - Keys that don't contain "_service_" are left untouched (not ours to judge).
 */
export function normalizeServicesToggles(bag) {
  if (!bag || typeof bag !== 'object') return {};
  const out = {};
  const remapped = []; // defer remapped writes so real new-format entries win collisions
  for (const [key, val] of Object.entries(bag)) {
    const sep = key.lastIndexOf('_service_');
    if (sep === -1) { out[key] = val; continue; }
    const instName = key.slice(0, sep);
    const svcName  = key.slice(sep + '_service_'.length);
    // Already new-format (leading segment is a real service key) → passthrough.
    if (INSTITUTION_SERVICE_KEY_SET.has(instName)) {
      out[key] = val;
      continue;
    }
    const svcKey = matchServiceName(instName);
    if (!svcKey) continue; // unmappable → drop rather than mis-apply
    remapped.push([`${svcKey}_service_${svcName}`, val]);
  }
  for (const [newKey, val] of remapped) {
    if (!Object.prototype.hasOwnProperty.call(out, newKey)) out[newKey] = val;
  }
  return out;
}

export const createToggleSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  institutionToggles: {},
  categoryToggles:    {},
  goodsToggles:       {},
  servicesToggles:    {},

  // ── Institution toggles ────────────────────────────────────────────────────
  toggleInstitution: (tier, category, name, mode) =>
    set(state => {
      const key = `${tier}::${category}::${name}`;
      const cur = state.institutionToggles[key] || { allow: true, require: false, forceExclude: false };

      if (mode === 'require') {
        state.institutionToggles[key] = { allow: true, require: !cur.require, forceExclude: false };
      } else if (mode === 'exclude') {
        state.institutionToggles[key] = { allow: false, require: false, forceExclude: true };
      } else if (mode === 'clear') {
        delete state.institutionToggles[key];
      } else {
        state.institutionToggles[key] = { allow: !cur.allow, require: false, forceExclude: cur.allow };
      }
    }),

  setInstitutionToggles: (toggles) =>
    set(state => { state.institutionToggles = toggles; }),

  mergeInstitutionToggles: (partial) =>
    set(state => { Object.assign(state.institutionToggles, partial); }),

  // ── Category toggles ──────────────────────────────────────────────────────
  toggleCategory: (tier, category) =>
    set(state => {
      const key = `${tier}::${category}`;
      state.categoryToggles[key] = !(state.categoryToggles[key] !== false);
    }),

  isCategoryEnabled: (tier, category) => {
    return get().categoryToggles[`${tier}::${category}`] !== false;
  },

  setCategoryToggles: (toggles) =>
    set(state => { state.categoryToggles = toggles; }),

  // ── Goods toggles ─────────────────────────────────────────────────────────
  toggleGood: (key, value) =>
    set(state => {
      state.goodsToggles[key] = value ?? !(state.goodsToggles[key] !== false);
    }),

  setGoodsToggles: (toggles) =>
    set(state => { state.goodsToggles = toggles; }),

  // ── Service toggles ────────────────────────────────────────────────────────
  toggleService: (key, value) =>
    set(state => {
      state.servicesToggles[key] = value ?? !(state.servicesToggles[key] !== false);
    }),

  setServiceToggles: (toggles) =>
    set(state => { state.servicesToggles = toggles; }),

  // One-time on-load migration: rewrite any servicesToggles persisted under the
  // pre-Stage-2b display-name key into the current svcKey form. Idempotent — a
  // bag already in the new form normalizes to itself, so re-running is a no-op.
  // The store's onRehydrateStorage (store/index.js) runs this normalization at
  // rehydrate (via the shared normalizeServicesToggles) so orphaned toggles are
  // recovered before the panel reads them; this action is the explicit seam.
  hydrateServicesToggles: () =>
    set(state => { state.servicesToggles = normalizeServicesToggles(state.servicesToggles); }),

  // ── Resets ─────────────────────────────────────────────────────────────────
  resetToggles: () =>
    set(state => {
      state.institutionToggles = {};
      state.categoryToggles = {};
    }),

  resetGoodsServices: () =>
    set(state => {
      state.goodsToggles = {};
      state.servicesToggles = {};
    }),

  resetAllToggles: () =>
    set(state => {
      state.institutionToggles = {};
      state.categoryToggles = {};
      state.goodsToggles = {};
      state.servicesToggles = {};
    }),

  // ── Bulk operations ────────────────────────────────────────────────────────
  bulkSetInstitutions: (catalogGetter, tierForGrid, mode) =>
    set(state => {
      const catalog = catalogGetter(tierForGrid);
      Object.entries(catalog).forEach(([category, insts]) => {
        Object.entries(insts).forEach(([name, def]) => {
          if (def.required) return;
          const key = `${tierForGrid}::${category}::${name}`;
          if (mode === 'force') {
            state.institutionToggles[key] = { allow: true, require: true, forceExclude: false };
          } else if (mode === 'exclude') {
            state.institutionToggles[key] = { allow: false, require: false, forceExclude: true };
          } else {
            // 'reset'
            delete state.institutionToggles[key];
          }
        });
      });
    }),

  bulkSetServices: (mode) =>
    set(state => {
      if (mode === 'reset') {
        state.servicesToggles = {};
      } else if (mode === 'force') {
        for (const k of Object.keys(state.servicesToggles)) {
          state.servicesToggles[k] = { allow: true, force: true, forceExclude: false };
        }
      } else if (mode === 'exclude') {
        for (const k of Object.keys(state.servicesToggles)) {
          state.servicesToggles[k] = { allow: false, force: false, forceExclude: true };
        }
      }
    }),

  bulkSetGoods: (mode, tierData) =>
    set(state => {
      if (mode === 'reset') { state.goodsToggles = {}; return; }
      const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
      tiers.forEach(t => {
        const goods = tierData?.[t] || {};
        Object.keys(goods).forEach(name => {
          const key = `${t}_good_${name}`;
          if (mode === 'force') {
            state.goodsToggles[key] = { allow: true, force: true, forceExclude: false };
          } else if (mode === 'exclude') {
            state.goodsToggles[key] = { allow: false, force: false, forceExclude: true };
          }
        });
      });
    }),
});
