/**
 * Step 12b: economyReconcilePass
 *
 * Joins the FINAL institution roster back into the economy after the last
 * roster mutation (factionCorrelationPass). Closes the Wave-4b ordering gap
 * where faction-pulled institutions existed in the dossier but provided no
 * services, joined no supply chains, and had no spatial placement.
 *
 * What it does, in order:
 *   1. If factionCorrelationPass changed the roster (pull additions,
 *      post-pull subsumption/ladder collapses, arcane strip), RE-RUN the
 *      shared computeEconomyState on the final roster and replace
 *      ctx.economicState. generatePower keeps the PROVISIONAL economy it
 *      was derived from — a deliberate damped one-iteration fixpoint of the
 *      institutions → economy → factions → institutions feedback loop (the
 *      legacy power generator's faction powers cannot be derived before the
 *      economy exists). When the roster did not change, the provisional
 *      economicState passes through untouched.
 *   2. Demand imports (faction purchasing power × culture) — moved here
 *      from factionCorrelationPass so they append to the FINAL import list
 *      and are suppressed by the FINAL active chains.
 *   3. Spatial layout + available services (+ §14 custom services) — moved
 *      here from generateEconomy so every roster member, including
 *      faction-pulled institutions, is placed and provides services.
 *   4. Supply-chain traces (Tier 4.3) — emitted here so the receipts
 *      describe the final chains, not the provisional ones.
 */

import { registerStep } from '../pipeline.js';
import { computeEconomyState, emitChainTraces } from './generateEconomy.js';
import { computeDemandImports } from '../demandProfile.js';
import { subsumeTradeGoods, reconcileTradeLists } from '../../domain/region/goodsCatalog.js';
import { generateSpatialLayout } from '../spatialGenerator.js';
import { generateAvailableServices } from '../servicesGenerator.js';
import { getTerrainType } from '../terrainHelpers.js';
import { customDeps } from '../../lib/dependencyEngine.js';
import { passesTierGate } from '../../domain/customContentSchema.js';
import { serviceTypeKeyFromCategory } from '../../domain/customCategories.js';

/**
 * Final trade-list normalization (exported for focused tests). Re-applies
 * trade-goods subsumption: demand imports carry faction-flavoured labels that
 * can re-introduce a canonical duplicate past the pass inside
 * generateEconomicState, and the §14 custom merge (step 9) appends raw user
 * labels. Custom labels stay opaque — renaming them would orphan the
 * dossier's gold tint, which matches them by exact label; customTradeLabels
 * is the §14 {exports, imports} OBJECT, flattened into one opaque set.
 * Then re-runs export/import reconciliation so a demand import that
 * canonicalizes to a surviving export cannot reinstate the contradiction the
 * generator already resolved ("(transit)" re-exports stay spared inside
 * reconcileTradeLists). Mutates economicState in place.
 */
export function finalizeTradeLists(economicState) {
  const _customLabels = economicState.customTradeLabels || {};
  const _opaqueLabels = new Set(
    [...(_customLabels.exports || []), ...(_customLabels.imports || [])]
      .map((l) => String(l).toLowerCase())
  );
  economicState.primaryImports = subsumeTradeGoods(
    economicState.primaryImports || [], { opaque: _opaqueLabels }
  );
  economicState.primaryExports = reconcileTradeLists(
    subsumeTradeGoods(economicState.primaryExports || [], { opaque: _opaqueLabels }),
    economicState.primaryImports
  );
}

registerStep('economyReconcilePass', {
  deps: ['factionCorrelationPass'],
  provides: ['economicState', 'spatialLayout', 'availableServices'],
  phase: 'economy',
}, (ctx, rng) => {
  const {
    tier, institutions, tradeRoute, effectiveConfig,
    servicesToggles, powerStructure,
  } = ctx;

  // ── 1. Re-derive the economy when the roster changed after step 9 ───────
  let economicState = ctx.economicState;
  if (ctx._rosterChangedAfterEconomy) {
    economicState = computeEconomyState(ctx);
  }

  // ── 2. Demand imports — faction purchasing power + culture shapes imports
  const _hasMagicTrade = institutions.some(i => /teleport|airship|planar/i.test(i.name));
  if (effectiveConfig.tradeRouteAccess !== 'isolated' || _hasMagicTrade) {
    const demandImports = computeDemandImports(
      powerStructure?.factions || [],
      effectiveConfig.culture,
      economicState.activeChains || [],
      tier,
      economicState.primaryImports || []
    );
    if (demandImports.length > 0) {
      economicState.primaryImports = [
        ...(economicState.primaryImports || []),
        ...demandImports,
      ].slice(0, 10);
    }
  }

  // Re-apply subsumption + export/import reconciliation to the final lists
  // (see finalizeTradeLists above for why both are needed here).
  finalizeTradeLists(economicState);

  // ── 3. Spatial layout + services from the FINAL roster ──────────────────
  const terrainType = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);
  const spatialLayout = generateSpatialLayout(tier, institutions, tradeRoute, terrainType);
  const availableServices = generateAvailableServices(
    tier, institutions, servicesToggles,
    { ...effectiveConfig, _tradeRoute: tradeRoute }
  );

  // §14 — inject the user's CUSTOM services into the buyable-services map.
  // Mirrors the custom-institution injection (assembleInstitutions): the list is
  // tier-filtered upstream, we honour each item's gate again defensively;
  // essential/critical ones always appear, the rest roll a modest chance. A
  // service is GROUPED by its service TYPE (category → availableServices key) and
  // PRESENTED BY its provider institution (providedBy refId → name), matching how
  // generated services are attributed. Marked custom so the dossier tints it
  // gold. Stable name order keeps rng deterministic; a no-op consuming zero rng
  // when the user has no custom services.
  const customServices = (customDeps.registry().listCustom?.('services') || [])
    .slice()
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  for (const entry of customServices) {
    const item = entry.raw || {};
    const name = entry.name;
    if (!name) continue;
    if (!passesTierGate(item, tier)) continue;
    const essential = item.essential === true || item.criticality === 'critical';
    if (!essential && !rng.chance(0.3)) continue;
    const typeKey = serviceTypeKeyFromCategory(item.category || entry.category) || 'equipment';
    const bucket = (availableServices[typeKey] = availableServices[typeKey] || []);
    if (bucket.some(s => (typeof s === 'string' ? s : s?.name) === name)) continue;
    const providerRef = Array.isArray(item.providedBy) ? item.providedBy[0] : item.providedBy;
    const institution = providerRef ? customDeps.resolveInstitutionRequirement(providerRef) : '';
    bucket.push({
      name,
      desc: item.description || '',
      institution: institution || '',
      custom: true,
      source: 'custom',
    });
  }

  // ── 4. Supply-chain receipts from the final economy ─────────────────────
  emitChainTraces(ctx, economicState, tier);

  return { economicState, spatialLayout, availableServices };
});
