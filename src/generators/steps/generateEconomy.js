/**
 * Step 9: generateEconomy
 *
 * Generates the PROVISIONAL economic state (chains, income, exports/imports,
 * prosperity) from the pre-faction-pull roster, and threads neighbour
 * economic bias into config.
 *
 * Economy step for the settlement generation pipeline.
 *
 * Ordering note (Wave 4b): generatePower consumes economicState (prosperity
 * drives merchant-faction naming/caps and public legitimacy), and the
 * faction-institution pull consumes powerStructure — so the economy MUST be
 * computed once before factions exist. When factionCorrelationPass later
 * changes the roster, economyReconcilePass re-runs computeEconomyState on
 * the FINAL roster and replaces ctx.economicState (a damped one-iteration
 * fixpoint: power keeps the provisional economy it was derived from).
 * Services, spatial layout, and supply-chain traces are derived in
 * economyReconcilePass so they always describe the final roster.
 *
 * Tier 4.3: emits structured supply-chain traces after the legacy
 * economic generator finishes (now from economyReconcilePass). Traces are
 * layered on top via deriveSupplyChainState — same Strangler Fig pattern
 * Phase 7 + 9 established. The generator itself is not refactored.
 */

import { registerStep } from '../pipeline.js';
import { generateEconomicState } from '../economicGenerator.js';
import { recordTrace } from '../../domain/trace.js';
import { deriveSupplyChainState } from '../../domain/supplyChainState.js';
import { customDeps } from '../../lib/dependencyEngine.js';
import { deriveTradeLinks } from '../../domain/region/tradeLinks.js';
import {
  projectOwnedCustomTradeDirection,
  resolveCustomTradeEndpointSemantics,
} from '../../domain/content/customTradeEndpointProjection.js';

/**
 * applyCustomTradeGoodsConfig — fold the EDITOR-authored trade-good input
 * (config.customTradeGoods, written by ADD/REMOVE_TRADE_GOOD in
 * domain/events/mutate.js alongside their live economicState writes) into
 * the derived lists, so authored goods survive a full regeneration.
 *
 *   { exports, imports }  plain labels appended with case-insensitive dedupe;
 *   { transit }           entrepôt goods — the literal '<label> (transit)'
 *                         export form AND the un-suffixed transit entry
 *                         (getTradeModifiers' shape), matching the event's
 *                         live write;
 *   { removed }           suppression list — base labels stripped from every
 *                         list, with or without the '(transit)' suffix, so a
 *                         removal of a GENERATOR-derived good stays gone too.
 *
 * Removals run first and win over adds (the events keep the two in
 * agreement; this is the defensive order). Labels this call actually
 * APPENDS are merged into customTradeLabels so the dossier gold-tints them
 * and finalizeTradeLists treats them as opaque (never merged/renamed) — a
 * label the generator already derived keeps its vanilla treatment.
 * Idempotent, and a strict no-op (lists untouched) when the config carries
 * no entries — vanilla generations stay byte-identical. Re-applied by
 * finalizeTradeLists because demand imports can reintroduce a removed label
 * and the 10-import cap can cut an authored one.
 */
export function applyCustomTradeGoodsConfig(economicState, customTradeGoods) {
  const ctg = customTradeGoods || {};
  const exportsIn = Array.isArray(ctg.exports) ? ctg.exports : [];
  const importsIn = Array.isArray(ctg.imports) ? ctg.imports : [];
  const transitIn = Array.isArray(ctg.transit) ? ctg.transit : [];
  const removedIn = Array.isArray(ctg.removed) ? ctg.removed : [];
  if (!exportsIn.length && !importsIn.length && !transitIn.length && !removedIn.length) return;

  const labelOf = (e) => (typeof e === 'string' ? e : String(e?.name || e?.good || e?.label || ''));
  const baseOf = (l) => String(l).replace(/\s*\(transit\)\s*$/i, '').trim().toLowerCase();
  const removed = new Set(removedIn.map(baseOf));

  if (removed.size) {
    const keep = (list) => list.filter((e) => !removed.has(baseOf(labelOf(e))));
    economicState.primaryExports = keep(economicState.primaryExports || []);
    economicState.primaryImports = keep(economicState.primaryImports || []);
    if (Array.isArray(economicState.transit)) economicState.transit = keep(economicState.transit);
  }

  const customExp = [];
  const customImp = [];
  const ensure = (listKey, written, custom) => {
    const list = Array.isArray(economicState[listKey]) ? economicState[listKey] : [];
    const k = String(written).toLowerCase();
    if (list.some((e) => labelOf(e).toLowerCase() === k)) return;
    economicState[listKey] = [...list, written];
    if (custom) custom.push(written);
  };
  for (const l of exportsIn) {
    if (l && !removed.has(baseOf(l))) ensure('primaryExports', String(l), customExp);
  }
  for (const l of importsIn) {
    if (l && !removed.has(baseOf(l))) ensure('primaryImports', String(l), customImp);
  }
  for (const l of transitIn) {
    if (!l || removed.has(baseOf(l))) continue;
    ensure('primaryExports', `${l} (transit)`, customExp);
    ensure('transit', String(l), null);
  }

  if (customExp.length || customImp.length) {
    const cur = economicState.customTradeLabels || {};
    const merge = (a, b) => {
      const seen = new Set((a || []).map((x) => String(x).toLowerCase()));
      return [...(a || []), ...b.filter((x) => !seen.has(String(x).toLowerCase()))];
    };
    economicState.customTradeLabels = {
      exports: merge(cur.exports, customExp),
      imports: merge(cur.imports, customImp),
    };
  }
}

/**
 * Apply custom-good neighbour links and category folding to the CURRENT trade
 * lists. Exported because reviewed custom-chain endpoints are not eligible for
 * promotion until economyReconcilePass has the final service roster.
 *
 * The merge is deliberately incremental: computeEconomyState may already have
 * projected editor-authored custom goods before final custom-chain endpoints
 * arrive. Re-projecting must retain those links/member lists rather than
 * replacing them with the later subset.
 */
export function projectCustomTradeSemantics(economicState, neighbourProfile) {
  const registry = customDeps.registry();

  // Name lookup remains a compatibility path for editor-authored labels and
  // older saves. It is consulted only for labels already declared custom.
  // Current reviewed-chain endpoints use immutable identity below.
  const satisfiesCandidates = new Map();
  for (const regCat of ['institutions', 'tradeGoods']) {
    for (const entry of (registry.listCustom?.(regCat) || [])) {
      if (entry.raw?.satisfies && entry.name) {
        const key = String(entry.name).toLowerCase();
        const candidates = satisfiesCandidates.get(key) || [];
        candidates.push(entry.raw.satisfies);
        satisfiesCandidates.set(key, candidates);
      }
    }
  }
  const satisfiesIndex = new Map(
    [...satisfiesCandidates.entries()]
      .filter(([, candidates]) => candidates.length === 1)
      .map(([name, candidates]) => [name, candidates[0]]),
  );

  const priorLabels = economicState.customTradeLabels || {};
  const priorExp = new Set(
    (priorLabels.exports || [])
      .map(label => String(label).toLowerCase()),
  );
  const priorImp = new Set(
    (priorLabels.imports || [])
      .map(label => String(label).toLowerCase()),
  );
  const endpointSidecars = economicState.customTradeEndpoints || {};
  const nativeSidecars = economicState.nativeTradeLabels || {};
  const exactExports = resolveCustomTradeEndpointSemantics(
    endpointSidecars.exports,
    registry,
  );
  const exactImports = resolveCustomTradeEndpointSemantics(
    endpointSidecars.imports,
    registry,
  );
  const foldedExports = projectOwnedCustomTradeDirection(
    economicState.primaryExports,
    {
      endpoints: exactExports,
      nativeLabels: Array.isArray(nativeSidecars.exports)
        ? nativeSidecars.exports
        : null,
      priorCustom: priorExp,
      legacySatisfies: satisfiesIndex,
    },
  );
  const foldedImports = projectOwnedCustomTradeDirection(
    economicState.primaryImports,
    {
      endpoints: exactImports,
      nativeLabels: Array.isArray(nativeSidecars.imports)
        ? nativeSidecars.imports
        : null,
      priorCustom: priorImp,
      legacySatisfies: satisfiesIndex,
    },
  );

  // Native reconciliation gets no authored override. Custom category bridges
  // are evaluated separately from proven custom endpoint claims, so a native
  // namesake can never inherit the custom definition's `satisfies` value.
  /**
   * @param {string[]} list
   * @param {'exports'|'imports'} direction
   * @param {Set<string>} priorCustom
   */
  const nativeTradeList = (list, direction, priorCustom) => {
    const nativeLabels = nativeSidecars[direction];
    if (Array.isArray(nativeLabels)) {
      const nativeKeys = new Set(
        nativeLabels.map(label => String(label).toLowerCase()),
      );
      return (list || []).filter(label => (
        nativeKeys.has(String(label).toLowerCase())
      ));
    }
    const customEndpointKeys = new Set(
      (endpointSidecars[direction] || [])
        .map(endpoint => String(endpoint?.label || '').toLowerCase())
        .filter(Boolean),
    );
    return (list || []).filter(label => {
      const key = String(label).toLowerCase();
      return !priorCustom.has(key) && !customEndpointKeys.has(key);
    });
  };
  const links = deriveTradeLinks(
    nativeTradeList(
      economicState.primaryExports,
      'exports',
      priorExp,
    ),
    nativeTradeList(
      economicState.primaryImports,
      'imports',
      priorImp,
    ),
    neighbourProfile,
  );
  const customLinks = [];
  for (const claim of foldedExports.semanticClaims) {
    customLinks.push(...deriveTradeLinks(
      [claim.label],
      [],
      neighbourProfile,
      { satisfiesOf: () => claim.satisfies },
    ));
  }
  for (const claim of foldedImports.semanticClaims) {
    customLinks.push(...deriveTradeLinks(
      [],
      [claim.label],
      neighbourProfile,
      { satisfiesOf: () => claim.satisfies },
    ));
  }
  const projectedLinks = [...links, ...customLinks];
  if (projectedLinks.length) {
    const seen = new Set();
    economicState.tradeLinks = [
      ...(economicState.tradeLinks || []),
      ...projectedLinks,
    ].filter(link => {
      const key = [
        link?.direction,
        String(link?.good || '').toLowerCase(),
        String(link?.partner || '').toLowerCase(),
        String(link?.goodId || '').toLowerCase(),
      ].join('|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  const mergeMembers = (before, added) => {
    const merged = { ...(before || {}) };
    for (const [category, members] of Object.entries(added || {})) {
      const seen = new Set((merged[category] || []).map(value => String(value).toLowerCase()));
      merged[category] = [
        ...(merged[category] || []),
        ...members.filter(value => {
          const key = String(value).toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }),
      ];
    }
    return merged;
  };
  const mergeLabels = (before, added) => {
    const seen = new Set((before || []).map(value => String(value).toLowerCase()));
    return [
      ...(before || []),
      ...added.filter(value => {
        const key = String(value).toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }),
    ];
  };
  const withoutFoldedMembers = (before, members) => {
    const folded = new Set(
      Object.values(members || {})
        .flat()
        .map(value => String(value).toLowerCase()),
    );
    return (before || []).filter(value => !folded.has(String(value).toLowerCase()));
  };

  if (Object.keys(foldedExports.members).length) {
    economicState.primaryExports = foldedExports.labels;
    economicState.customCategoryExports = mergeMembers(
      economicState.customCategoryExports,
      foldedExports.members,
    );
  }
  if (Object.keys(foldedImports.members).length) {
    economicState.primaryImports = foldedImports.labels;
    economicState.customCategoryImports = mergeMembers(
      economicState.customCategoryImports,
      foldedImports.members,
    );
  }
  if (foldedExports.custom.length || foldedImports.custom.length) {
    economicState.customTradeLabels = {
      exports: mergeLabels(
        withoutFoldedMembers(priorLabels.exports, foldedExports.members),
        foldedExports.custom,
      ),
      imports: mergeLabels(
        withoutFoldedMembers(priorLabels.imports, foldedImports.members),
        foldedImports.custom,
      ),
    };
  }
}

/**
 * computeEconomyState — the full economicState derivation (legacy generator
 * + neighbour trade links + category folding).
 *
 * Pure w.r.t. ctx except: threads neighbour bias into effectiveConfig
 * (idempotent) and consumes the ACTIVE step rng (via rngContext) inside
 * generateEconomicState. Exported so economyReconcilePass can re-derive the
 * economy from the post-faction-pull roster with identical semantics.
 */
export function computeEconomyState(ctx) {
  const {
    tier, institutions, tradeRoute, effectiveConfig,
    goodsToggles, neighbourEconBias, neighbourProfile,
  } = ctx;

  // Thread neighbour economic bias
  if (neighbourEconBias && Object.keys(neighbourEconBias).length > 0) {
    effectiveConfig._neighbourEconBias = neighbourEconBias;
    effectiveConfig._neighbourEconMode = neighbourProfile?.dynamics?.economyMode || 'independent';
  }

  const economicState = generateEconomicState(tier, institutions, tradeRoute, goodsToggles, effectiveConfig);

  // Reviewed custom chains are evaluated later in economyReconcilePass, after
  // the FINAL institution, resource, and service rosters all exist. Confirmation
  // is authorial review, not evidence that this settlement can run the chain.

  // Editor-authored trade goods (config.customTradeGoods — ADD/REMOVE_TRADE_GOOD
  // write it alongside their live economicState edits) join the lists HERE:
  // before neighbour links + category folding, so authored goods participate
  // in both. Active reviewed-chain endpoints join at the final-roster boundary;
  // editor removals are re-applied there and retain the final say.
  applyCustomTradeGoodsConfig(economicState, effectiveConfig.customTradeGoods);

  // Custom labels participate in neighbour reconciliation before category
  // folding. The same function runs once more for active reviewed-chain
  // endpoints at the final-roster boundary.
  projectCustomTradeSemantics(economicState, neighbourProfile);

  return economicState;
}

/**
 * emitChainTraces — one structured trace per active supply chain (Tier 4.3).
 *
 * Causes describe what activated the chain (resource availability,
 * processing institution, upstream chain); downstream describes which
 * subsystems the chain status feeds into. Status remap (operational →
 * stable, vulnerable → strained, impaired → scarce) happens in
 * deriveSupplyChainState.
 *
 * Disrupted chains (anything except 'stable') emit different downstream
 * targets — stable chains reinforce trade/food/etc.; disrupted chains erode
 * the same subsystems. Called from economyReconcilePass so the receipts
 * describe the FINAL economy, not the provisional pre-faction-pull one.
 */
export function emitChainTraces(ctx, economicState, tier, step = 'economyReconcilePass') {
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
      step,
      result:     state.status,
      causes,
      downstreamEffects,
    });
  }
}

registerStep('generateEconomy', {
  deps: ['stressConfirmPass', 'resolveNeighbour'],
  reads: ['effectiveConfig', 'goodsToggles', 'institutions', 'neighbourEconBias', 'neighbourProfile', 'tier', 'tradeRoute'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  provides: ['economicState'],
  mutates: ['effectiveConfig'], // threads _neighbourEconBias/_neighbourEconMode onto effectiveConfig in place when a neighbour is bound (A+ P1.7)
  phase: 'economy',
}, (ctx) => {
  return { economicState: computeEconomyState(ctx) };
});
