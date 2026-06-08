/**
 * Step 9: generateEconomy
 *
 * Generates economic state, spatial layout, and available services.
 * Threads neighbour economic bias into config.
 *
 * Economy step for the settlement generation pipeline.
 *
 * Tier 4.3: emits structured supply-chain traces after the legacy
 * economic generator finishes. Traces are layered on top via
 * deriveSupplyChainState — same Strangler Fig pattern Phase 7 + 9
 * established. The generator itself is not refactored.
 */

import { registerStep } from '../pipeline.js';
import { generateEconomicState } from '../economicGenerator.js';
import { generateSpatialLayout } from '../spatialGenerator.js';
import { generateAvailableServices } from '../servicesGenerator.js';
import { getTerrainType } from '../terrainHelpers.js';
import { recordTrace } from '../../domain/trace.js';
import { deriveSupplyChainState } from '../../domain/supplyChainState.js';
import { customDeps } from '../../lib/dependencyEngine.js';
import { passesTierGate } from '../../domain/customContentSchema.js';
import { serviceTypeKeyFromCategory } from '../../domain/customCategories.js';

registerStep('generateEconomy', {
  deps: ['isolationPass', 'resolveNeighbour'],
  provides: ['economicState', 'spatialLayout', 'availableServices'],
  phase: 'economy',
}, (ctx, rng) => {
  const {
    tier, institutions, tradeRoute, effectiveConfig,
    goodsToggles, servicesToggles,
    neighbourEconBias, neighbourProfile,
  } = ctx;

  const terrainType = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);

  // Thread neighbour economic bias
  if (neighbourEconBias && Object.keys(neighbourEconBias).length > 0) {
    effectiveConfig._neighbourEconBias = neighbourEconBias;
    effectiveConfig._neighbourEconMode = neighbourProfile?.dynamics?.economyMode || 'independent';
  }

  const economicState = generateEconomicState(tier, institutions, tradeRoute, goodsToggles, effectiveConfig);

  // §14 — surface the user's CONFIRMED custom supply chains (reviewed + named in
  // the Compendium) in the dossier Economics/Trade section. Kept in a SEPARATE
  // economicState.customChains field — display-only, NOT merged into
  // activeChains — so they never perturb chain-impairment / depth math. A no-op
  // (field left unset) when the user has confirmed none.
  const confirmedChains = customDeps.confirmedSupplyChains?.() || [];
  if (confirmedChains.length) {
    economicState.customChains = confirmedChains
      .slice()
      .sort((a, b) => String(a.label || a.chainId || '').localeCompare(String(b.label || b.chainId || '')))
      .map((c) => ({
        chainId: c.chainId || null,
        label: c.label || c.chainId || 'Custom chain',
        status: c.status || 'running',
        resource: c.resource || null,
        processingInstitutions: Array.isArray(c.processingInstitutions) ? c.processingInstitutions : [],
        outputs: Array.isArray(c.outputs) ? c.outputs : [],
        isCustom: true,
        source: 'custom',
      }));

    // §14 Phase 2 — promote each confirmed chain's trade endpoints into the
    // REAL export/import lists: a chain output nobody locally consumes is an
    // export; a required input nobody locally produces is an import. The labels
    // are tracked in customTradeLabels so the dossier gold-tints those pills.
    const labelOf = (e) => (typeof e === 'string' ? e : e?.label) || '';
    const exp = new Set((economicState.primaryExports || []).map((x) => String(x).toLowerCase()));
    const imp = new Set((economicState.primaryImports || []).map((x) => String(x).toLowerCase()));
    const customExports = [];
    const customImports = [];
    for (const c of confirmedChains) {
      const te = c.discovered?.tradeEndpoints || {};
      const exports = Array.isArray(te.exports) ? te.exports.map(labelOf) : (Array.isArray(c.outputs) ? c.outputs : []);
      const imports = Array.isArray(te.imports) ? te.imports.map(labelOf) : (Array.isArray(c.upstreamMissing) ? c.upstreamMissing : []);
      for (const l of exports) {
        const k = String(l || '').toLowerCase();
        if (l && !exp.has(k)) { exp.add(k); customExports.push(l); }
      }
      for (const l of imports) {
        const k = String(l || '').toLowerCase();
        if (l && !imp.has(k)) { imp.add(k); customImports.push(l); }
      }
    }
    if (customExports.length) economicState.primaryExports = [...(economicState.primaryExports || []), ...customExports];
    if (customImports.length) economicState.primaryImports = [...(economicState.primaryImports || []), ...customImports];
    if (customExports.length || customImports.length) {
      economicState.customTradeLabels = { exports: customExports, imports: customImports };
    }
  }

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

  // ── Trace recording (Tier 4.3) ────────────────────────────────────────
  // Emit one trace per active supply chain. Causes describe what
  // activated the chain (resource availability, processing institution,
  // upstream chain); downstream describes which subsystems the chain
  // status feeds into. Status remap (operational → stable, vulnerable
  // → strained, impaired → scarce) happens in deriveSupplyChainState.
  //
  // Disrupted chains (anything except 'stable') emit different
  // downstream targets — stable chains reinforce trade/food/etc.;
  // disrupted chains erode the same subsystems. This is the seed of
  // Tier 2.4's unified causal state model.

  const chains = economicState?.activeChains || [];
  for (const chain of chains) {
    const state = deriveSupplyChainState(chain);
    if (!state) continue;

    const causes = [];
    // Tier baseline — same shape as other traces.
    causes.push({
      source: `tier.${tier}`,
      effect: 'chain candidate',
      reason: `Settlements of size ${tier} qualify for this chain when the inputs are present.`,
    });
    if (state.dependency?.institution) {
      causes.push({
        source: `dependency.${state.dependency.institution}`,
        effect: state.dependency.severity || 'dependency',
        reason: state.dependency.impact || `Chain depends on ${state.dependency.institution} (${state.dependency.severity || 'unspecified'}).`,
      });
    }
    if (Array.isArray(chain.processingInstitutions) && chain.processingInstitutions.length) {
      causes.push({
        source: `processor.${chain.processingInstitutions[0]}`,
        effect: 'processes the chain',
        reason: `${chain.processingInstitutions[0]} converts raw inputs into chain output.`,
      });
    }
    if (chain.resource) {
      causes.push({
        source: `resource.${chain.resource}`,
        effect: chain.activatedByResource ? 'activates the chain' : 'enables the chain',
        reason: chain.activatedByResource
          ? `${chain.resource} is the proximate cause of this chain running here.`
          : `${chain.resource} is the input the chain depends on.`,
      });
    }
    if (state.substituteActive) {
      causes.push({
        source: 'substitute',
        effect: 'fallback path active',
        reason: 'Chain is running on a magical / alternative substitute rather than the canonical input.',
      });
    }

    // Downstream effects per need category + status interaction.
    // Stable chains reinforce; strained / worse erode.
    const isStable = state.status === 'stable';
    const downstreamEffects = [];
    switch (chain.needKey) {
      case 'food_security':
        downstreamEffects.push({ target: 'foodSecurity', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      case 'manufacturing':
        downstreamEffects.push({ target: 'craftCapacity', effect: isStable ? 'reinforced' : 'eroded' });
        downstreamEffects.push({ target: 'exportRevenue', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      case 'raw_extraction':
        downstreamEffects.push({ target: 'rawInputs', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      case 'trade':
        downstreamEffects.push({ target: 'tradeConnectivity', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      case 'energy':
        downstreamEffects.push({ target: 'fuelSupply', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      case 'arcane':
        downstreamEffects.push({ target: 'magicCapacity', effect: isStable ? 'reinforced' : 'eroded' });
        break;
      default:
        downstreamEffects.push({ target: 'economy', effect: isStable ? 'reinforced' : 'eroded' });
        break;
    }

    recordTrace(ctx, {
      targetType: 'supply_chain',
      targetId:   state.id,
      step:       'generateEconomy',
      result:     state.status,
      causes,
      downstreamEffects,
    });
  }

  return { economicState, spatialLayout, availableServices };
});
