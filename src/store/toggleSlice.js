/**
 * toggleSlice — Institution, category, service, and goods toggles.
 *
 * Key formats:
 *   Institution: "tier::category::name"  →  { allow, require, forceExclude }
 *   Category:    "tier::category"        →  boolean
 *   Service:     arbitrary string key    →  { allow, force, forceExclude }
 *   Good:        "tier_good_name"        →  { allow, force, forceExclude }
 */

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
