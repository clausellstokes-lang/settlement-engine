/**
 * Step 9: generateEconomy
 *
 * Generates the PROVISIONAL economic state (chains, income, exports/imports,
 * prosperity) from the pre-faction-pull roster, and threads neighbour
 * economic bias into config.
 *
 * Economy step for the settlement generation pipeline.
 *
 * Ordering note: generatePower consumes economicState (prosperity
 * drives merchant-faction naming/caps and public legitimacy), and the
 * faction-institution pull consumes powerStructure — so the economy MUST be
 * computed once before factions exist. When factionCorrelationPass later
 * changes the roster, economyReconcilePass re-runs computeEconomyState on
 * the FINAL roster and replaces ctx.economicState (a damped one-iteration
 * fixpoint: power keeps the provisional economy it was derived from).
 * Services, spatial layout, and supply-chain traces are derived in
 * economyReconcilePass so they always describe the final roster.
 *
 * Emits structured supply-chain traces after the legacy
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
import { foldTradeCategories } from '../../domain/region/foldTradeCategories.js';

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
 * computeEconomyState — the full economicState derivation (legacy generator
 * + §14 custom-chain promotion + neighbour trade links + category folding).
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

  // §14 — surface the user's CONFIRMED custom supply chains (reviewed + named in
  // the Compendium) in the dossier Economics/Trade section. Kept in a SEPARATE
  // economicState.customChains field — display-only, NOT merged into
  // activeChains — so they never perturb chain-impairment / depth math. A no-op
  // (field left unset) when the user has confirmed none.
  const confirmedChains = customDeps.confirmedSupplyChains?.() || [];
  if (confirmedChains.length) {
    // Codepoint-stable order, NOT localeCompare: customChains is part of the
    // deterministic settlement output, so its array order must not vary by
    // locale/ICU build for a given seed.
    economicState.customChains = confirmedChains
      .slice()
      .sort((a, b) => {
        const al = String(a.label || a.chainId || ''), bl = String(b.label || b.chainId || '');
        return al < bl ? -1 : al > bl ? 1 : 0;
      })
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

  // Editor-authored trade goods (config.customTradeGoods — ADD/REMOVE_TRADE_GOOD
  // write it alongside their live economicState edits) join the lists HERE:
  // after the chain-derived trade endpoints, before neighbour links + category
  // folding, so authored goods participate in both and removals suppress
  // derived labels before anything downstream can see them.
  applyCustomTradeGoodsConfig(economicState, effectiveConfig.customTradeGoods);

  // §14 Phase 3b — good-level cross-settlement trade with the imported neighbour:
  // record which of this settlement's exports/imports actually flow to/from the
  // neighbour (canonical good matching) so the dossier can annotate them
  // ("Raw dragonbone — from Stonehaven"). No-op when there's no neighbour, the
  // relationship is hostile, or there's no overlap.
  // Our custom goods/institutions' declared `satisfies` category, so the matcher
  // can bridge a specific custom good to a neighbour's category-level demand.
  const satisfiesIndex = new Map();
  for (const regCat of ['institutions', 'tradeGoods']) {
    for (const e of (customDeps.registry().listCustom?.(regCat) || [])) {
      if (e.raw?.satisfies && e.name) satisfiesIndex.set(String(e.name).toLowerCase(), e.raw.satisfies);
    }
  }
  const tradeLinks = deriveTradeLinks(economicState.primaryExports, economicState.primaryImports, neighbourProfile, {
    satisfiesOf: (label) => satisfiesIndex.get(String(label).toLowerCase()) || null,
  });
  if (tradeLinks.length) economicState.tradeLinks = tradeLinks;

  // §14 — fold custom-good export/import NAMES into their declared trade category
  // so the Trade Profile shows one bucket ("Weapons & armour", incl. the good)
  // rather than a pill per custom good. A good with no `satisfies` stays named;
  // built-in trade labels are never folded (not in satisfiesIndex). Members ride
  // along in customCategoryExports/Imports for the dossier "incl. …" + PDF. This
  // runs AFTER deriveTradeLinks so neighbour bridging still sees the raw names.
  const priorExp = new Set(((economicState.customTradeLabels?.exports) || []).map((s) => String(s).toLowerCase()));
  const priorImp = new Set(((economicState.customTradeLabels?.imports) || []).map((s) => String(s).toLowerCase()));
  const fExp = foldTradeCategories(economicState.primaryExports, satisfiesIndex, priorExp);
  const fImp = foldTradeCategories(economicState.primaryImports, satisfiesIndex, priorImp);
  // Only rewrite a list when a good actually folded into a category — keeps vanilla
  // generations (no custom content) byte-identical (no incidental re-dedupe of
  // built-in labels). customTradeLabels still tracks any custom labels for tinting.
  if (Object.keys(fExp.members).length) {
    economicState.primaryExports = fExp.labels;
    economicState.customCategoryExports = fExp.members;
  }
  if (Object.keys(fImp.members).length) {
    economicState.primaryImports = fImp.labels;
    economicState.customCategoryImports = fImp.members;
  }
  if (fExp.custom.length || fImp.custom.length) {
    economicState.customTradeLabels = { exports: fExp.custom, imports: fImp.custom };
  }

  return economicState;
}

/**
 * emitChainTraces — one structured trace per active supply chain.
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
  reads: ['effectiveConfig', 'goodsToggles', 'institutions', 'neighbourEconBias', 'neighbourProfile', 'tier', 'tradeRoute'], // ctx keys this step consumes that another step produces
  provides: ['economicState'],
  mutates: ['effectiveConfig'], // threads _neighbourEconBias/_neighbourEconMode onto effectiveConfig in place when a neighbour is bound
  phase: 'economy',
}, (ctx) => {
  return { economicState: computeEconomyState(ctx) };
});
