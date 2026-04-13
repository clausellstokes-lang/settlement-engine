import { useState, useCallback, useMemo } from 'react';
import {
  generateSettlement as engineGenerate,
  regenNPCs        as engineRegenNPCs,
  regenHistory     as engineRegenHistory,
  getInstitutionalCatalog,
  getFullCatalogWithTierMeta,
  getInstitutionsForTier,
  getTierOrder,
  getPopulationRanges,
} from '../generators/engine.js';
import { SERVICE_TIER_DATA } from '../generators/servicesGenerator.js';
import useConfig    from './useConfig.js';
import useToggles   from './useToggles.js';
import { filterCatalogForMagic } from '../components/magicFilter.js';

const TIER_ORDER        = getTierOrder();
const POPULATION_RANGES = getPopulationRanges();

function resolveDisplayTier(config) {
  const t = config.settType;
  if (t === 'custom') {
    const pop = config.population || 1500;
    for (const tier of [...TIER_ORDER].reverse()) {
      if (pop >= POPULATION_RANGES[tier].min) return tier;
    }
    return 'thorp';
  }
  // When random: return 'all' so panels show the full institution/service/goods
  // catalog across all tiers. The generator already handles all::category::name
  // as a fallback override key.
  if (!t || t === 'random' || t === 'custom') return 'all';
  return t;
}

export default function useSettlementGeneration() {
  // ── Sub-hooks ──────────────────────────────────────────────────────────────
  const { config, updateConfig, resetConfig } = useConfig();
  const toggles = useToggles();
  const {
    institutionToggles, categoryToggles, goodsToggles, servicesToggles,
    setInstitutionToggles, setServiceToggles, setGoodsToggles,
  } = toggles;

  // ── Settlement state ───────────────────────────────────────────────────────
  const [settlement,       setSettlement]       = useState(null);
  const [aiSettlement,     setAiSettlement]     = useState(null);
  const [importedNeighbor, setImportedNeighbor] = useState(null);

  // ── Derived catalog ────────────────────────────────────────────────────────
  const tierForGrid    = useMemo(() => resolveDisplayTier(config), [config]);
  // In manual mode (specific tier chosen), show full cross-tier catalog with native tier tags
  // In random mode, show only the tier-appropriate catalog
  const isManualTier = config.settType && config.settType !== 'random' && config.settType !== 'custom';
  const currentCatalog = useMemo(() => {
    const raw = isManualTier ? getFullCatalogWithTierMeta() : getInstitutionalCatalog(tierForGrid);
    return filterCatalogForMagic(raw, config);
  }, [isManualTier, tierForGrid, config.magicExists, config.priorityMagic]);
  // Set of institution names in the native tier (for UI gating display)
  const tierInstitutionNames = useMemo(() => getInstitutionsForTier(tierForGrid), [tierForGrid]);

  // ── Generation ─────────────────────────────────────────────────────────────
  const generateSettlement = useCallback((neighborOverride = null) => {
    const neighbor = neighborOverride ?? importedNeighbor;
    const result = engineGenerate({
      ...config,
      _institutionToggles: institutionToggles,
      _categoryToggles:    categoryToggles,
      _goodsToggles:       goodsToggles,
      _servicesToggles:    servicesToggles,
      ...(neighbor ? { _importedNeighbor: neighbor } : {}),
    });
    setSettlement(result);
    setAiSettlement(null); // clear AI layer when new settlement generated
    return result;
  }, [config, importedNeighbor, institutionToggles, categoryToggles, goodsToggles, servicesToggles]);

  const regenSection = useCallback((section) => {
    if (!settlement) return;
    const cfg = settlement.config || config;
    if (section === 'npcs') {
      const parts = engineRegenNPCs(settlement, cfg);
      setSettlement(prev => ({ ...prev, ...parts }));
    } else if (section === 'history') {
      const history = engineRegenHistory(settlement, cfg);
      setSettlement(prev => ({ ...prev, history }));
    }
  }, [settlement, config]);

  // ── Bulk set institutions (iterates catalog, allow/disallow all non-required) ─
  const bulkSetInstitutions = useCallback((allow) => {
    const catalog = getInstitutionalCatalog(tierForGrid);
    const tier    = tierForGrid;
    const next    = {};
    Object.entries(catalog).forEach(([category, insts]) => {
      Object.entries(insts).forEach(([name, def]) => {
        if (def.required) return;
        next[`${tier}::${category}::${name}`] = { allow, require: false, forceExclude: !allow };
      });
    });
    setInstitutionToggles(prev => ({ ...prev, ...next }));
  }, [tierForGrid]);

  // ──

  const bulkForceInstitutions = useCallback(() => {
    const catalog = getInstitutionalCatalog(tierForGrid);
    const tier    = tierForGrid;
    const next    = {};
    Object.entries(catalog).forEach(([category, insts]) => {
      Object.entries(insts).forEach(([name, def]) => {
        if (def.required) return;
        next[`${tier}::${category}::${name}`] = { allow: true, require: true, forceExclude: false };
      });
    });
    setInstitutionToggles(prev => ({ ...prev, ...next }));
  }, [tierForGrid]);

  const bulkExcludeInstitutions = useCallback(() => {
    const catalog = getInstitutionalCatalog(tierForGrid);
    const tier    = tierForGrid;
    const next    = {};
    Object.entries(catalog).forEach(([category, insts]) => {
      Object.entries(insts).forEach(([name, def]) => {
        if (def.required) return;
        next[`${tier}::${category}::${name}`] = { allow: false, require: false, forceExclude: true };
      });
    });
    setInstitutionToggles(prev => ({ ...prev, ...next }));
  }, [tierForGrid]);

  // ── Bulk set services (updates existing keys, allow/disallow all) ──────────
  const bulkSetServices = useCallback((mode) => {
    if (mode === 'reset')   { setServiceToggles({}); return; }
    if (mode === 'force')   {
      setServiceToggles(prev => Object.fromEntries(Object.keys(prev).map(k => [k, { allow:true, force:true, forceExclude:false }])));
      return;
    }
    if (mode === 'exclude') {
      setServiceToggles(prev => Object.fromEntries(Object.keys(prev).map(k => [k, { allow:false, force:false, forceExclude:true }])));
      return;
    }
    setServiceToggles({});
  }, []);

  // ── Bulk set goods (iterates tier goods data) ─────────────────────────────
  const bulkSetGoods = useCallback((mode) => {
    if (mode === 'reset') { setGoodsToggles({}); return; }
    const tiers = ['thorp','hamlet','village','town','city','metropolis'];
    if (mode === 'force') {
      const next = {};
      tiers.forEach(t => {
        const goods = SERVICE_TIER_DATA[t] || {};
        Object.keys(goods).forEach(name => { next[`${t}_good_${name}`] = { allow:true, force:true, forceExclude:false }; });
      });
      setGoodsToggles(next);
      return;
    }
    if (mode === 'exclude') {
      const next = {};
      tiers.forEach(t => {
        const goods = SERVICE_TIER_DATA[t] || {};
        Object.keys(goods).forEach(name => { next[`${t}_good_${name}`] = { allow:false, force:false, forceExclude:true }; });
      });
      setGoodsToggles(next);
      return;
    }
    setGoodsToggles({});
  }, []);

  // ── Neighbor management ────────────────────────────────────────────────────
  const importNeighbor = useCallback((neighbor) => setImportedNeighbor(neighbor), []);
  const clearNeighbor  = useCallback(() => setImportedNeighbor(null), []);

  // ── Export ─────────────────────────────────────────────────────────────────
  const exportSettlement = useCallback(
    () => settlement ? JSON.stringify(settlement, null, 2) : null,
    [settlement]
  );

  return {
    // Config
    config, updateConfig, resetConfig,
    // Toggles (spread toggle state + functions)
    ...toggles,
    // Raw toggle state setters (for full restore on load)
    setInstitutionToggles: toggles.setInstitutionToggles,
    setCategoryToggles:    toggles.setCategoryToggles,
    setGoodsToggles:       toggles.setGoodsToggles,
    setServiceToggles:     toggles.setServiceToggles,
    // Bulk overrides (replace the simple versions from useToggles)
    bulkSetInstitutions,
    bulkForceInstitutions,
    bulkExcludeInstitutions,
    bulkSetServices,
    bulkSetGoods,
    // Catalog
    tierForGrid, currentCatalog,
    // Settlement
    settlement, setSettlement,
    tierInstitutionNames,
    isManualTier,
    aiSettlement, setAiSettlement,
    generateSettlement, regenSection,
    // Neighbor
    importedNeighbor, importNeighbor, clearNeighbor,
    // Export
    exportSettlement,
  };
}
