import { useState, useCallback } from 'react';

// Key format: "tier::category::name"
// Used consistently in this hook, InstitutionalGrid, and generateSettlement.
const instKey  = (tier, cat, name) => `${tier}::${cat}::${name}`;
const catKey   = (tier, cat)       => `${tier}::${cat}`;

export default function useToggles() {
  const [institutionToggles, setInstitutionToggles] = useState({});
  const [categoryToggles,    setCategoryToggles]    = useState({});
  const [goodsToggles,       setGoodsToggles]       = useState({});
  const [servicesToggles,    setServiceToggles]      = useState({});

  // ── Institution toggles ────────────────────────────────────────────────────
  // mode: 'require' | 'exclude' | 'allow' (cycles: optional → forced → excluded → optional)
  const toggleInstitution = useCallback((tier, category, name, mode) => {
    const key = instKey(tier, category, name);
    setInstitutionToggles(prev => {
      const cur = prev[key] || { allow: true, require: false, forceExclude: false };
      let next;
      if (mode === 'require') {
        next = { allow: true, require: !cur.require, forceExclude: false };
      } else if (mode === 'exclude') {
        next = { allow: false, require: false, forceExclude: true };
      } else if (mode === 'clear') {
        // Remove explicit toggle — revert to default (used for out-of-tier un-forcing)
        const newToggles = { ...prev };
        delete newToggles[key];
        return newToggles;
      } else {
        // 'allow' — toggle back to default
        next = { allow: !cur.allow, require: false, forceExclude: cur.allow };
      }
      return { ...prev, [key]: next };
    });
  }, []);

  const bulkSetInstitutions = useCallback((newToggles) => {
    setInstitutionToggles(prev => ({ ...prev, ...newToggles }));
  }, []);

  // ── Category toggles ───────────────────────────────────────────────────────
  const toggleCategory = useCallback((tier, category) => {
    const key = catKey(tier, category);
    setCategoryToggles(prev => ({ ...prev, [key]: !(prev[key] !== false) }));
  }, []);

  const isCategoryEnabled = useCallback((tier, category) => {
    return categoryToggles[catKey(tier, category)] !== false;
  }, [categoryToggles]);

  // ── Goods toggles ──────────────────────────────────────────────────────────
  const toggleGood = useCallback((key, value) => {
    setGoodsToggles(prev => ({
      ...prev, [key]: value ?? !(prev[key] !== false),
    }));
  }, []);

  const bulkSetGoods = useCallback((newToggles) => {
    setGoodsToggles(prev => ({ ...prev, ...newToggles }));
  }, []);

  // ── Service toggles ────────────────────────────────────────────────────────
  const toggleService = useCallback((key, value) => {
    setServiceToggles(prev => ({
      ...prev, [key]: value ?? !(prev[key] !== false),
    }));
  }, []);

  const bulkSetServices = useCallback((newToggles) => {
    setServiceToggles(prev => ({ ...prev, ...newToggles }));
  }, []);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetToggles = useCallback(() => {
    setInstitutionToggles({});
    setCategoryToggles({});
  }, []);

  const resetGoodsServices = useCallback(() => {
    setGoodsToggles({});
    setServiceToggles({});
  }, []);

  return {
    // State (read-only for consumers)
    institutionToggles,
    categoryToggles,
    goodsToggles,
    servicesToggles,
    // Raw setters (for composed hooks to override bulk behavior)
    setInstitutionToggles,
    setCategoryToggles,
    setServiceToggles,
    setGoodsToggles,
    // Institution
    toggleInstitution,
    bulkSetInstitutions,
    // Category
    toggleCategory,
    isCategoryEnabled,
    // Goods
    toggleGood,
    bulkSetGoods,
    // Service
    toggleService,
    bulkSetServices,
    // Reset
    resetToggles,
    resetGoodsServices,
  };
}
