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
 *      ctx.economicState. The immediately following
 *      powerEconomyReconcilePass re-projects the ORIGINAL political intent
 *      against this final economy, but does not run factionCorrelationPass
 *      again. That bounded closeout preserves the deliberate one-iteration
 *      institutions -> economy -> factions -> institutions loop without
 *      persisting stale power. When the roster did not change, the provisional
 *      economicState passes through untouched and is still freshness-stamped.
 *   2. Demand imports (faction purchasing power × culture) — moved here
 *      from factionCorrelationPass so they append to the FINAL import list
 *      and are suppressed by the FINAL active chains.
 *   3. Spatial layout + available services (+ §14 custom services) — moved
 *      here from generateEconomy so every roster member, including
 *      faction-pulled institutions, is placed and provides services.
 *   4. Reviewed custom chains are evaluated against the final materialized
 *      roster. Only active chains promote their reviewed trade endpoints.
 *   5. Supply-chain traces (Tier 4.3) — emitted here so the receipts
 *      describe the final chains, not the provisional ones.
 */

import { registerStep } from '../pipeline.js';
import {
  applyCustomTradeGoodsConfig,
  computeEconomyState,
  emitChainTraces,
  projectCustomTradeSemantics,
} from './generateEconomy.js';
import { computeDemandImports } from '../demandProfile.js';
import { subsumeTradeGoods, reconcileTradeLists } from '../../domain/region/goodsCatalog.js';
import { generateSpatialLayout } from '../spatialGenerator.js';
import { generateAvailableServices } from '../servicesGenerator.js';
import { getTerrainType } from '../terrainHelpers.js';
import { customDeps } from '../../lib/dependencyEngine.js';
import { passesTierGate } from '../../domain/customContentSchema.js';
import { serviceTypeKeyFromCategory } from '../../domain/customCategories.js';
import { byCustomIdentityCodepoint } from '../../domain/deterministicSort.js';
import {
  mergeCustomDefinitionIdentity,
  projectCustomDefinitionIdentity,
} from '../../domain/content/customDefinitionIdentityProjection.js';
import {
  evaluateConfirmedCustomSupplyChains,
  promoteActiveCustomChainTrade,
} from '../../domain/content/customSupplyChainActivation.js';
import {
  nativeSemanticDepletedResourceKeys,
  nativeSemanticName,
  nativeSemanticResourceKeys,
} from '../../domain/content/customContentSemanticAuthority.js';
import { hasTradeRouteConnection } from '../../domain/tradeRouteSemantics.js';

/**
 * Final trade-list normalization (exported for focused tests). Re-applies
 * trade-goods subsumption: demand imports carry faction-flavoured labels that
 * can re-introduce a canonical duplicate past the pass inside
 * generateEconomicState, and the §14 custom merges append raw user labels.
 * Custom labels stay opaque — renaming them would orphan the
 * dossier's gold tint, which matches them by exact label; customTradeLabels
 * is the §14 {exports, imports} OBJECT, flattened into one opaque set.
 * Then re-runs export/import reconciliation so a demand import that
 * canonicalizes to a surviving export cannot reinstate the contradiction the
 * generator already resolved ("(transit)" re-exports stay spared inside
 * reconcileTradeLists). When the config carries editor-authored trade goods
 * (config.customTradeGoods), they are re-applied between subsumption and
 * reconciliation: a demand import can reintroduce a removed label, and the
 * 10-import cap can cut an authored one — this is the final say. Authored
 * goods still face reconciliation afterwards, so an authored catalog export
 * loses to a real import contradiction the same way a derived one does.
 * Mutates economicState in place.
 */
export function finalizeTradeLists(economicState, customTradeGoods = null) {
  const _customLabels = economicState.customTradeLabels || {};
  const _opaqueLabels = new Set(
    [...(_customLabels.exports || []), ...(_customLabels.imports || [])]
      .map((l) => String(l).toLowerCase())
  );
  economicState.primaryImports = subsumeTradeGoods(
    economicState.primaryImports || [], { opaque: _opaqueLabels }
  );
  economicState.primaryExports = subsumeTradeGoods(
    economicState.primaryExports || [], { opaque: _opaqueLabels }
  );
  if (customTradeGoods) applyCustomTradeGoodsConfig(economicState, customTradeGoods);
  economicState.primaryExports = reconcileTradeLists(
    economicState.primaryExports,
    economicState.primaryImports
  );
}

function customServiceIdentityKey(value, fallbackLocalUid = '') {
  const identity = projectCustomDefinitionIdentity(value);
  if (identity.customDefinitionId) {
    return `definition:${identity.customDefinitionId}`;
  }
  const localUid = String(value?.localUid || fallbackLocalUid || '').trim();
  return localUid ? `local:${localUid}` : '';
}

function normalizedResourceKey(value) {
  return String(value || '').trim().toLowerCase();
}

/**
 * Give the reviewed-chain evaluator exact native resource identity wherever
 * the registry can prove it. This matters when a custom resource intentionally
 * shares the same display label: both definitions must remain independently
 * materialized instead of collapsing into one ambiguous string.
 */
function nativeResourceEntities(config, registry, values) {
  const nativeKeys = nativeSemanticResourceKeys(config, values);
  const catalog = typeof registry?.listAll === 'function'
    ? registry.listAll('resources')
    : [];
  return nativeKeys.map((key) => {
    const normalized = normalizedResourceKey(key);
    const matches = catalog.filter(entry => (
      entry?.source === 'prebuilt'
      && (
        normalizedResourceKey(entry.name) === normalized
        || normalizedResourceKey(entry.key) === normalized
      )
    ));
    if (matches.length !== 1) return key;
    return {
      name: matches[0].name || key,
      key,
      refId: matches[0].refId,
      source: 'prebuilt',
    };
  });
}

registerStep('economyReconcilePass', {
  deps: ['coherenceRepairPass'],
  reads: ['economicState', 'generationContext'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  provides: ['economicState', 'spatialLayout', 'availableServices'],
  phase: 'economy',
}, (ctx, rng) => {
  const {
    tier, institutions, tradeRoute, effectiveConfig,
    servicesToggles, powerStructure, generationContext,
  } = ctx;

  // ── 1. Re-derive the economy when the roster changed after step 9 ───────
  let economicState = ctx.economicState;
  if (ctx._rosterChangedAfterEconomy) {
    economicState = computeEconomyState(ctx);
  }

  // ── 2. Demand imports — faction purchasing power + culture shapes imports
  const _hasMagicTrade = institutions.some(
    institution => /teleport|airship|planar/i.test(
      nativeSemanticName(institution),
    ),
  );
  if (
    hasTradeRouteConnection(effectiveConfig.tradeRouteAccess)
    || _hasMagicTrade
  ) {
    const demandImports = computeDemandImports(
      powerStructure?.factions || [],
      effectiveConfig.culture,
      economicState.activeChains || [],
      tier,
      economicState.primaryImports || [],
      effectiveConfig,
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
  finalizeTradeLists(economicState, effectiveConfig.customTradeGoods || null);

  // ── 3. Spatial layout + services from the FINAL roster ──────────────────
  const terrainType = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);
  const spatialLayout = generateSpatialLayout(tier, institutions, tradeRoute, terrainType);
  const availableServices = generateAvailableServices(
    tier, institutions, servicesToggles,
    { ...effectiveConfig, _tradeRoute: tradeRoute },
    generationContext,
  );

  // §14 — inject the user's CUSTOM services into the buyable-services map.
  // Mirrors the custom-institution injection (assembleInstitutions): the list is
  // tier-filtered upstream, we honour each item's gate again defensively;
  // essential/critical ones always appear, the rest roll a modest chance. A
  // service is GROUPED by its service TYPE (category → availableServices key) and
  // PRESENTED BY its provider institution (providedBy refId → name), matching how
  // generated services are attributed. Marked custom so the dossier tints it
  // gold. Definition-identity order keeps cosmetic renames on the same RNG
  // draw; codepoint comparison keeps that order stable across devices/locales.
  const customServices = (customDeps.registry().listCustom?.('services') || [])
    .slice()
    .sort(byCustomIdentityCodepoint);
  for (const entry of customServices) {
    const item = entry.raw || {};
    const name = entry.name;
    if (!name) continue;
    if (!passesTierGate(item, tier)) continue;
    const providerRef = Array.isArray(item.providedBy)
      ? item.providedBy[0]
      : item.providedBy;
    const institution = providerRef
      ? customDeps.resolveInstitutionRequirement(providerRef)
      : '';
    // A declared provider is an activation gate, not merely attribution copy.
    // Resolve it against the same final institution roster that supplies every
    // built-in service. Missing, archived, or non-materialized providers keep
    // the service dormant and consume no preview/generation RNG.
    if (
      providerRef
      && (
        !institution
        || !customDeps.institutionRequirementIsPresent(
          providerRef,
          institutions,
          tier,
        )
      )
    ) continue;
    const typeKey = serviceTypeKeyFromCategory(
      item.category || entry.category,
    ) || 'equipment';
    const serviceCandidate = {
      ...item,
      name,
      desc: item.description || item.desc || '',
      category: typeKey,
      custom: true,
      source: 'custom',
    };
    const providerCandidate = institution
      ? { name: institution, custom: true, source: 'custom' }
      : null;
    // World and content law is evaluated before the probability gate. A service
    // forbidden by the resolved world never consumes RNG or shifts later custom
    // services merely because it was present in the reviewed registry.
    if (!generationContext.worldLaw.allowsService(
      serviceCandidate,
      providerCandidate,
      typeKey,
    )) continue;
    const essential = item.essential === true || item.criticality === 'critical';
    if (!essential && !rng.chance(0.3)) continue;
    const bucket = (availableServices[typeKey] = availableServices[typeKey] || []);
    const identityKey = customServiceIdentityKey(
      item,
      item.localUid || entry.refId,
    );
    const existingEntries = Object.values(availableServices)
      .flatMap(services => (Array.isArray(services) ? services : []))
      .filter(service => (
        service
        && typeof service === 'object'
        && identityKey
        && customServiceIdentityKey(service) === identityKey
      ));
    if (existingEntries.length) {
      // The provider's `produces` path can materialize this definition before
      // the direct custom-service pass. Enrich the existing entity instead of
      // duplicating it. Display-name equality alone never reaches this branch:
      // native/custom and custom/custom namesakes remain separate entities.
      for (const existing of existingEntries) {
        const mergeResult = mergeCustomDefinitionIdentity(existing, item);
        if (mergeResult === 'conflict') {
          delete existing.customDefinitionCategory;
          continue;
        }
        existing.custom = true;
        existing.source = 'custom';
        existing.localUid = item.localUid || entry.refId;
        if (mergeResult !== 'absent') {
          existing.customDefinitionCategory = 'services';
        }
      }
      continue;
    }
    bucket.push({
      name,
      desc: item.description || '',
      institution: institution || '',
      custom: true,
      source: 'custom',
      customDefinitionCategory: 'services',
      localUid: item.localUid || entry.refId,
      ...projectCustomDefinitionIdentity(item),
    });
  }

  // ── 4. Reviewed custom chains against the FINAL materialized roster ─────
  //
  // This must stay after custom-service reconciliation. A confirmed path is a
  // reviewed definition, not a running settlement fact. Evaluating it in the
  // provisional economy used to let town-only chains surface in hamlets and
  // invent exports even though none of their components existed.
  const confirmedCustomChains = customDeps.confirmedSupplyChains?.() || [];
  if (confirmedCustomChains.length) {
    const registry = customDeps.registry();
    const customResourceDefinitions = Array.isArray(
      effectiveConfig.nearbyResourceDefinitions,
    )
      ? effectiveConfig.nearbyResourceDefinitions
      : (effectiveConfig.nearbyResourcesCustom || []);
    const depletedCustomResourceDefinitions = Array.isArray(
      effectiveConfig.nearbyResourceDefinitionsDepleted,
    )
      ? effectiveConfig.nearbyResourceDefinitionsDepleted
      : (effectiveConfig.nearbyResourcesDepleted || []).filter(name => (
          (effectiveConfig.nearbyResourcesCustom || []).includes(name)
        ));
    economicState.customChains = evaluateConfirmedCustomSupplyChains(
      confirmedCustomChains,
      {
        tier,
        institutions,
        resources: [
          ...nativeResourceEntities(effectiveConfig, registry),
          ...customResourceDefinitions,
        ],
        depletedResources: [
          ...nativeResourceEntities(
            effectiveConfig,
            registry,
            nativeSemanticDepletedResourceKeys(effectiveConfig),
          ),
          ...depletedCustomResourceDefinitions,
        ],
        availableServices,
        registry,
      },
    );
    promoteActiveCustomChainTrade(economicState, economicState.customChains);

    // Custom trade-good removals retain the final say, and the same canonical
    // subsumption/reconciliation rules apply to newly promoted endpoints.
    finalizeTradeLists(economicState, effectiveConfig.customTradeGoods || null);
    projectCustomTradeSemantics(economicState, ctx.neighbourProfile);
  }

  // ── 5. Supply-chain receipts from the final economy ─────────────────────
  emitChainTraces(ctx, economicState, tier);

  return { economicState, spatialLayout, availableServices };
});
