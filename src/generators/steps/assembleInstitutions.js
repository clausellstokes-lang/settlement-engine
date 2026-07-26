/**
 * Step 5: assembleInstitutions
 *
 * Iterates the institutional catalog, applies toggles, exclusive groups,
 * probabilistic generation, out-of-tier forced institutions, and upgrade
 * chain deduplication.
 *
 * Institution assembly step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { TIER_ORDER } from '../../data/constants.js';
import { institutionalCatalog, catalogIdForName } from '../../data/institutionalCatalog.js';
import { INSTITUTION_DESC_VARIANTS } from '../../data/institutionDescVariants.js';
import { pickVariant } from '../../kernel/proseHash.js';
import { TERRAIN_DATA } from '../../data/geographyData.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { getBaseChance } from '../structuralValidator.js';
import { getTerrainType } from '../terrainHelpers.js';
import { recordTrace } from '../../domain/trace.js';
import { customDeps } from '../../lib/dependencyEngine.js';
import { passesTierGate } from '../../domain/customContentSchema.js';
import { byCustomIdentityCodepoint } from '../../domain/deterministicSort.js';
import { projectCustomInstitutionSceneFields } from '../../domain/townScene/customBuildingPresentation.js';
import {
  projectCustomDefinitionIdentity,
} from '../../domain/content/customDefinitionIdentityProjection.js';
import {
  isMaterializedCustomContent,
  nativeSemanticResourceKeys,
} from '../../domain/content/customContentSemanticAuthority.js';
import {
  isProtectedFromCustomSubsumption,
  isProtectedGenerationEntity,
} from '../../domain/generationOwnership.js';
import { isCategoryEnabled as sharedIsCategoryEnabled } from '../categoryToggleReader.js';
import { threatDefensePlan } from '../threatDefensePolicy.js';

// ── Trace helpers (Tier 2.1) ────────────────────────────────────────────────
// Each successful institution selection emits a structured trace so the
// PipelineRail / AI overlay / future faction-profile readers can answer
// "why does this institution exist on this settlement?"

function instId(name) {
  return `institution.${String(name).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`;
}

/** Format the probabilistic roll as a human-readable cause entry. */
function chanceCause(baseChance, resourceMult) {
  const finalChance = Math.min(1, baseChance * resourceMult);
  const pct = Math.round(finalChance * 100);
  if (Math.abs(resourceMult - 1) < 0.01) {
    return {
      source: 'baseChance',
      effect: `${pct}% likelihood`,
      reason: `Base chance for this tier/category was ${Math.round(baseChance * 100)}%.`,
    };
  }
  const lift = resourceMult > 1 ? 'lifted' : 'reduced';
  return {
    source: 'baseChance',
    effect: `${pct}% final likelihood`,
    reason: `Base chance ${Math.round(baseChance * 100)}% ${lift} by ×${resourceMult.toFixed(2)} from nearby resources + terrain.`,
  };
}

/** Downstream effect inferred from institution tags. Light heuristic;
 *  the real version of this lives in Tier 2.4's unified causal state. */
function tagsToDownstream(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return [];
  const effects = [];
  const has = (t) => tags.includes(t);
  if (has('security') || has('law') || has('public_order') || has('military'))
    effects.push({ target: 'publicOrder', effect: 'reinforced' });
  if (has('welfare') || has('healing') || has('religious'))
    effects.push({ target: 'welfareCapacity', effect: 'reinforced' });
  if (has('trade') || has('market') || has('economic'))
    effects.push({ target: 'tradeConnectivity', effect: 'reinforced' });
  if (has('craft') || has('industry'))
    effects.push({ target: 'craftCapacity', effect: 'reinforced' });
  if (has('arcane') || has('magic'))
    effects.push({ target: 'magicCapacity', effect: 'reinforced' });
  if (has('criminal') || has('smuggling') || has('illicit'))
    effects.push({ target: 'publicOrder', effect: 'eroded' });
  return effects;
}

function matchesSubsumptionTarget(institution, target) {
  if (target.source === 'custom') {
    if (!isMaterializedCustomContent(institution)) return false;
    const expected = projectCustomDefinitionIdentity(target.raw);
    const actual = projectCustomDefinitionIdentity(institution);
    if (expected.customDefinitionId) {
      return actual.customDefinitionId === expected.customDefinitionId;
    }
    return Boolean(
      target.raw?.localUid
      && institution.localUid === target.raw.localUid,
    );
  }
  if (target.source === 'prebuilt') {
    return (
      !isMaterializedCustomContent(institution)
      && institution.name === target.name
    );
  }
  return institution.name === target.name;
}

// Merge city+metropolis catalogs
function mergeCatalogs(base, override) {
  const merged = {};
  Object.entries(base).forEach(([cat, insts]) => { merged[cat] = { ...insts }; });
  Object.entries(override).forEach(([cat, insts]) => {
    merged[cat] = merged[cat] ? { ...merged[cat], ...insts } : { ...insts };
  });
  return merged;
}

// Resource multiplier for institution base chances
function getResourceMultiplier(instTags, instName, nearbyResources, instModifiers, tier) {
  let multiplier = 1;
  const name = instName.toLowerCase();

  for (const mod of instModifiers) {
    if ((mod.tags && instTags && mod.tags.some(t => instTags.includes(t))) ||
        (mod.name && name.includes(mod.name.toLowerCase()))) {
      multiplier *= mod.modifier;
    }
  }

  const TIER_SCALE = { thorp: 0.6, hamlet: 0.75, village: 0.9, town: 1.0, city: 1.15, metropolis: 1.3 };
  const tierScale = TIER_SCALE[tier] || 1.0;

  const res = nearbyResources || [];
  res.forEach(resourceKey => {
    const rd = RESOURCE_DATA[resourceKey];
    if (!rd?.instBoosts) return;
    Object.entries(rd.instBoosts).forEach(([boostKey, boostVal]) => {
      if (!name.includes(boostKey)) return;
      const scaledBoost = 1 + (boostVal - 1) * tierScale;
      multiplier *= scaledBoost;
    });
  });

  const EXTRACTION_BOOSTS = {
    'iron_deposits':     { 'mine (open cast)': 2.5, 'mine': 2.0 },
    'stone_quarry':      { 'stone quarry': 2.5, 'stonemason': 1.8 },
    'coal_deposits':     { 'peat cutter': 2.0, 'charcoal burner': 1.8 },
    'precious_metals':   { 'mine (open cast)': 2.2, 'mint': 2.5 },
    'gemstone_deposits': { 'mine (open cast)': 2.0 },
    'fishing_grounds':   { "fisher's landing": 2.0, 'fish market': 1.8, 'fishmonger': 1.8 },
    'river_fish':        { "fisher's landing": 1.8, 'fish market': 1.6, 'fishmonger': 1.5 },
    'managed_forest':    { "woodcutter's camp": 2.0, 'charcoal burner': 1.8 },
    'hunting_grounds':   { "hunter's lodge": 2.5 },
    'deep_harbour':      { 'docks/port': 2.0, 'harbour master': 1.8 },
    'ancient_ruins':     { "adventurers' charter": 1.8, "adventurers' guild": 1.6 },
    'hot_springs':       { 'healer (divine': 1.8 },
    'mountain_timber':   { "woodcutter's camp": 1.8, 'charcoal burner': 1.6 },
  };
  res.forEach(resourceKey => {
    const exactBoosts = EXTRACTION_BOOSTS[resourceKey];
    if (!exactBoosts) return;
    Object.entries(exactBoosts).forEach(([fragment, boost]) => {
      if (name.includes(fragment)) {
        multiplier *= 1 + (boost - 1) * tierScale;
      }
    });
  });

  return Math.min(multiplier, 5);
}

// Exported: cascadePass must apply the SAME collapse after its additions, or the
// cascade re-adds the lesser member of a ladder assembly just collapsed (a city
// listing both "Town hall" and "City hall").
// Pairs must be scale tiers of the SAME function. Complementary infrastructure
// (e.g. Docks/port facilities vs Warehouse district) must never be paired:
// 'Warehouse district' is required:true at city tier, so such a pair would
// deterministically delete the other member from every city roster.
export const UPGRADE_CHAINS = [
  ["Parish church","Parish churches (2-5)"],["Parish church","Parish churches (10-30)"],
  ["Parish churches (2-5)","Parish churches (10-30)"],["Wayside shrine","Parish church"],
  ["Water source","Multiple water sources"],["Citizen militia","Town watch"],
  ["Citizen militia","Professional city watch"],["Town watch","Professional city watch"],
  ["Palisade or earthworks","Town walls"],["Town walls","City walls and gates"],
  ["Barracks","Garrison"],["Street gang","Multiple criminal factions"],
  ["Gambling den","Gambling halls"],["Gambling halls","Gambling district"],
  ["Gambling den","Gambling district"],["Traveling performers","Theaters"],
  ["Theaters","Multiple theaters"],["Traveling performers","Multiple theaters"],
  ["River boatyard","Shipyard"],["Hedge wizard","Wizard's tower"],
  ["Traveling hedge wizard","Hedge wizard"],["Alchemist shop","Alchemist quarter"],
  ["Wizard's tower","Mages' guild"],["Town granary","City granaries"],
  ["Town hall","City hall"],["Blacksmith","Blacksmiths (3-10)"],
  ["Carpenter","Carpenters (5-15)"],
  ["Carriers' hiring hall","Carriers' guild"],["Carriers' guild","Caravan masters' exchange"],
  ["Carriers' hiring hall","Caravan masters' exchange"],["Small prison/stocks","Large prison"],
  ["Courthouse","Multiple courthouses"],["Craft guilds (5-15)","Craft guilds (30-80)"],
  ["Merchant guilds (3-8)","Merchant guilds (15-40)"],
  ["Adventurers' charter hall","Multiple adventurers' guilds"],
  ["Bowyers & fletchers (guild)","Dungeon delving supply district"],
  ["Apothecary","Apothecary (established)"],["Apothecary (established)","Apothecary district"],
  ["Apothecary","Apothecary district"],["Cartographer's workshop","Cartographer's guild"],
  ["Bowyer & fletcher","Bowyers & fletchers (guild)"],["Small hospital","Major hospital"],
  ["Slave market","Slave market district"],
];

/**
 * Collapse upgrade ladders in place: when both members of an UPGRADE_CHAINS pair
 * are present, the lesser is removed when generation owns it. Required,
 * forced, custom, event-authored, locked, and pinned institutions are protected
 * by the shared generation-ownership law. Used by the main assembly AND by
 * every later addition pass so all rosters obey the same rule.
 *
 * @returns {string[]} the names removed (for trace emission by callers that trace).
 */
export function collapseUpgradeChains(institutions) {
  const removed = [];
  const presentNames = new Set(
    institutions
      .filter(institution => !isMaterializedCustomContent(institution))
      .map(institution => institution.name),
  );
  UPGRADE_CHAINS.forEach(([lesser, greater]) => {
    if (presentNames.has(lesser) && presentNames.has(greater)) {
      const idx = institutions.findIndex(institution => (
        !isMaterializedCustomContent(institution)
        && institution.name === lesser
        && !isProtectedGenerationEntity(institution)
      ));
      if (idx >= 0) {
        institutions.splice(idx, 1);
        presentNames.delete(lesser);
        removed.push(lesser);
      }
    }
  });
  return removed;
}

registerStep('assembleInstitutions', {
  deps: ['buildGenerationContext', 'resolveResources', 'resolveStress', 'resolveNeighbour'],
  reads: ['categoryToggles', 'effectiveConfig', 'generationContext', 'goodsToggles', 'institutionToggles', 'nearbyResources', 'neighbourProfile', 'threat', 'tier', 'tradeRoute'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  provides: ['institutions', 'catalogForTier', 'generationRepairs'],
  phase: 'institutions',
}, (ctx, rng) => {
  const {
    tier, tradeRoute, effectiveConfig, nearbyResources,
    institutionToggles, categoryToggles, goodsToggles,
    neighbourProfile, generationContext,
  } = ctx;
  const { worldLaw } = generationContext;
  const config = ctx.config || {};
  const importedNeighbor = ctx.importedNeighbour || null;
  // The resolved roster intentionally mixes native keys with custom display
  // labels for dossier and explicit custom-mechanics consumers. Native catalog
  // selection must see only proven native keys; otherwise naming a custom
  // resource `iron_deposits` silently grants smelter and mine probabilities.
  const nativeNearbyResources = nativeSemanticResourceKeys(
    effectiveConfig,
    nearbyResources,
  );

  // pipeline-4: read the SAME keys the wizard writes. The old reader keyed off the
  // raw settType sentinel ('random::cat'/'custom::cat'), which no writer produces,
  // so category disables were dead for random/custom. Share one predicate with the
  // faction-weighted pass (factionCorrelation) so they can never disagree.
  const isCategoryEnabled = (cat) => sharedIsCategoryEnabled(categoryToggles, config.settType, tier, cat);

  // Build catalog for tier
  const catalogForTier = tier === 'metropolis'
    ? mergeCatalogs(institutionalCatalog['city'] || {}, institutionalCatalog['metropolis'] || {})
    : institutionalCatalog[tier] || {};

  const institutions = [];
  const generationRepairs = [];
  const exclusiveGroups = {};
  const tierIndex = TIER_ORDER.indexOf(tier);
  const terrainType = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);
  const instModifiers = (TERRAIN_DATA[terrainType] || {}).institutionModifiers || [];

  // Main catalog iteration
  Object.entries(catalogForTier).forEach(([category, categoryInsts]) => {
    Object.entries(categoryInsts).forEach(([name, inst]) => {
      if (inst.minTier && tierIndex < TIER_ORDER.indexOf(inst.minTier)) return;
      const toggle = institutionToggles[`${tier}::${category}::${name}`]
                  || institutionToggles[`${tier}_${category}_${name}`]
                  || institutionToggles[`all::${category}::${name}`]
                  || institutionToggles[`all_${category}_${name}`]
                  || { allow: true, require: false };
      // World law precedes required/forced/probability handling. A stale
      // priority, second-chance roll, or toggle is never authority to create an
      // institution whose defining function does not exist in this world.
      // The theme-profile half of WorldLaw needs the toggle provenance at this
      // seam: an explicit requirement is authored content, not a generated
      // suggestion. Hard no-magic law is still evaluated by the same predicate.
      if (!worldLaw.allowsInstitution({
        category,
        name,
        ...inst,
        ...(toggle.require
          ? {
              source: 'forced',
              forcedByToggle: true,
            }
          : {}),
      })) return;

      const catEnabled = isCategoryEnabled(category);
      const forceExclude = inst.required && toggle.forceExclude === true;

      // Required or explicitly forced
      if ((inst.required && !forceExclude) || (catEnabled && (toggle.require ?? false))) {
        if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) {
          const existingName = exclusiveGroups[inst.exclusiveGroup];
          const existingIdx = institutions.findIndex(i => i.name === existingName);
          if (
            existingIdx >= 0
            && !isProtectedGenerationEntity(institutions[existingIdx])
          ) {
            institutions.splice(existingIdx, 1);
          }
        }
        if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = name;
        institutions.push({
          category,
          name,
          ...inst,
          source: inst.required ? 'required' : 'forced',
          ...(!inst.required && toggle.require
            ? { forcedByToggle: true }
            : {}),
        });

        // Trace: required / forced selections still warrant a receipt so
        // the rail can answer "why does this town have a watch?" even
        // when the answer is "every town has one."
        recordTrace(ctx, {
          targetType: 'institution',
          targetId:   instId(name),
          step:       'assembleInstitutions',
          result:     inst.required ? 'required' : 'forced',
          causes: [
            inst.required
              ? { source: `tier.${tier}`, effect: 'required', reason: `Every ${tier}-sized settlement has a ${name.toLowerCase()}.` }
              : { source: 'userConfig',   effect: 'forced',   reason: 'Toggled on by user config.' },
          ],
          downstreamEffects: tagsToDownstream(inst.tags),
        });

      } else if (!forceExclude && catEnabled && (toggle.allow ?? true)) {
        if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) return;
        if (inst.exclusionConditions?.some(ex => institutions.some(i => i.name === ex))) return;

        if (inst.tradeRouteRequired) {
          const routeOk = inst.tradeRouteRequired.includes(tradeRoute);
          const terrainOk = inst.terrainAccess && inst.terrainAccess.includes(terrainType);
          if (!routeOk && !terrainOk) return;
        }
        if (inst.forbiddenTradeRoutes && inst.forbiddenTradeRoutes.includes(tradeRoute)) return;
        if (inst.terrainRequired && !inst.terrainRequired.includes(terrainType)) return;
        // [D6 THE UNDERWAYS] geography-inconsistent-is-impossible: an institution may forbid
        // itself where a named nearby resource makes it physically impossible — the underways
        // cannot exist atop a marsh/floodplain (the tunnels flood). Absent the field ⇒ no-op,
        // byte-identical for every existing institution.
        if (inst.forbiddenResources
            && inst.forbiddenResources.some(
              resource => nativeNearbyResources.includes(resource),
            )) return;

        const baseChance = getBaseChance(
          inst.baseChance, category, name, effectiveConfig, neighbourProfile || importedNeighbor, goodsToggles
        );
        const resourceMult = getResourceMultiplier(
          inst.tags || [],
          name,
          nativeNearbyResources,
          instModifiers,
          tier,
        );

        if (rng.chance(baseChance * resourceMult)) {
          if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = name;
          institutions.push({ category, name, ...inst, source: 'generated' });

          // Trace: the most informative case — the engine actually
          // *decided* to select this one based on probabilistic roll.
          // Cause records the base chance + resource multiplier so a
          // reader can see why it was likely. Downstream records what
          // subsystems this institution feeds back into.
          const causes = [chanceCause(baseChance, resourceMult)];
          if (nativeNearbyResources.length && resourceMult > 1) {
            causes.push({
              source: 'nearbyResources',
              effect: `×${resourceMult.toFixed(2)}`,
              reason: `Nearby resources (${nativeNearbyResources.slice(0, 3).join(', ')}${nativeNearbyResources.length > 3 ? '…' : ''}) shifted the selection odds.`,
            });
          }
          if (terrainType && terrainType !== 'plains') {
            causes.push({
              source: `terrain.${terrainType}`,
              effect: 'context',
              reason: `Selection occurred in a ${terrainType} setting.`,
            });
          }
          recordTrace(ctx, {
            targetType: 'institution',
            targetId:   instId(name),
            step:       'assembleInstitutions',
            result:     'selected',
            causes,
            downstreamEffects: tagsToDownstream(inst.tags),
          });
        }
      }
    });
  });

  // Forced-required from toggles (not in catalog)
  Object.entries(institutionToggles).forEach(([key, toggle]) => {
    if (!toggle?.require) return;
    const parts = key.split('_');
    if (parts.length < 3) return;
    const instName = parts.slice(2).join('_');
    const existing = institutions.find(i => i.name === instName);
    if (existing) {
      // A naturally rolled entity can still be explicitly required. Upgrade
      // its provenance before any collapse pass so the toggle is not lost just
      // because the same seed happened to roll the institution independently.
      if (existing.source !== 'required') {
        existing.source = 'forced';
        existing.forcedByToggle = true;
      }
      return;
    }
    for (const [cat, catInsts] of Object.entries(catalogForTier)) {
      if (catInsts[instName]) {
        const inst = catInsts[instName];
        if (!worldLaw.allowsInstitution({
          category: cat,
          name: instName,
          ...inst,
          source: 'forced',
          forcedByToggle: true,
        })) return;
        if (inst.exclusiveGroup) {
          if (exclusiveGroups[inst.exclusiveGroup]) {
            const existIdx = institutions.findIndex(i => i.name === exclusiveGroups[inst.exclusiveGroup]);
            if (
              existIdx >= 0
              && !isProtectedGenerationEntity(institutions[existIdx])
            ) institutions.splice(existIdx, 1);
          }
          exclusiveGroups[inst.exclusiveGroup] = instName;
        }
        institutions.push({
          category: cat,
          name: instName,
          ...inst,
          source: 'forced',
          forcedByToggle: true,
        });
        break;
      }
    }
  });

  // Out-of-tier forced institutions
  const fullCatalogAllTiers = (() => {
    const all = {};
    // 'metropolis' included: its catalog entries were unreachable for forced
    // out-of-tier overrides (a town could force a city institution but never a
    // metropolis one).
    ['thorp','hamlet','village','town','city','metropolis'].forEach(t => {
      const tc = institutionalCatalog[t] || {};
      Object.entries(tc).forEach(([cat, insts]) => {
        if (!all[cat]) all[cat] = {};
        Object.entries(insts).forEach(([name, def]) => {
          if (!all[cat][name]) all[cat][name] = { ...def, nativeTier: t };
        });
      });
    });
    return all;
  })();

  Object.entries(institutionToggles).forEach(([key, toggle]) => {
    if (!toggle?.require) return;
    const parts = key.split('::');
    if (parts.length < 3) return;
    const [, category, instName] = parts;
    const existing = institutions.find(i => i.name === instName);
    if (existing) {
      if (existing.source !== 'required') {
        existing.source = 'forced';
        existing.forcedByToggle = true;
      }
      return;
    }
    // Toggle category labels are persisted UI vocabulary and may outlive a
    // catalog section rename (for example, legacy "Military" now maps to the
    // "Defense" catalog section). The institution name is the stable authored
    // choice, so fall back to an all-category exact-name lookup.
    const resolvedCategory = fullCatalogAllTiers[category]?.[instName]
      ? category
      : Object.keys(fullCatalogAllTiers).find(
          candidate => fullCatalogAllTiers[candidate]?.[instName],
        );
    const catInsts = resolvedCategory
      ? fullCatalogAllTiers[resolvedCategory]
      : null;
    if (!catInsts || !catInsts[instName]) return;
    const inst = catInsts[instName];
    if (!worldLaw.allowsInstitution({
      category: resolvedCategory,
      name: instName,
      ...inst,
      source: 'forced',
      forcedByToggle: true,
    })) return;
    const isInTier = !!((catalogForTier[resolvedCategory] || {})[instName]);

    if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) {
      const existIdx = institutions.findIndex(i => i.name === exclusiveGroups[inst.exclusiveGroup]);
      if (
        existIdx >= 0
        && !isProtectedGenerationEntity(institutions[existIdx])
      ) {
        institutions.splice(existIdx, 1);
      }
    }
    if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = instName;
    institutions.push({
      category: resolvedCategory,
      name: instName,
      ...inst,
      source: 'forced',
      forcedByToggle: true,
      ...(!isInTier
        ? {
            outOfTier: true,
            nativeTier: inst.nativeTier || 'unknown',
          }
        : {}),
    });
  });

  // §14 — inject the user's CUSTOM institutions into generation. The list is
  // tier-filtered upstream (eligibleCustomContent), but we honour each item's own
  // gate again defensively. Essential ones always appear; the rest roll a modest
  // chance. Marked source:'custom' (the dossier tints these gold) and carrying the
  // real `category` so they land in the right dossier section. Iterated in
  // stable definition-identity order: display names are presentation-only and
  // must not move a definition onto another RNG draw when renamed. The
  // codepoint comparator remains cross-device deterministic. When the user has
  // no custom institutions this loop is a no-op and consumes no rng.
  const customInstitutions = (customDeps.registry().listCustom?.('institutions') || [])
    .slice()
    .sort(byCustomIdentityCodepoint);
  for (const entry of customInstitutions) {
    const item = entry.raw || {};
    const name = entry.name;
    const identity = projectCustomDefinitionIdentity(item);
    const localUid = item.localUid || entry.refId;
    const alreadyMaterialized = institutions.some(institution => (
      isMaterializedCustomContent(institution)
      && (
        identity.customDefinitionId
          ? projectCustomDefinitionIdentity(institution).customDefinitionId
            === identity.customDefinitionId
          : institution.localUid === localUid
      )
    ));
    if (!name || alreadyMaterialized) continue;
    if (!passesTierGate(item, tier)) continue;
    if (!worldLaw.allowsInstitution({
      ...item,
      category: item.category || entry.category || 'Other',
      name,
      source: 'custom',
      isCustom: true,
    })) continue;
    const essential = item.essential === true;
    if (!essential && !rng.chance(0.3)) continue;
    institutions.push({
      category: item.category || entry.category || 'Other',
      name,
      required: essential,
      isCustom: true,
      source: 'custom',
      tags: Array.isArray(item.tags)
        ? item.tags
        : (typeof item.tags === 'string' ? item.tags.split(',').map(s => s.trim()).filter(Boolean) : []),
      description: item.description || '',
      localUid,
      customDefinitionCategory: 'institutions',
      ...identity,
      // Presentation is retained as bounded semantic intent, not raw geometry.
      // TownMap places the institution first; TownScene resolves these registered
      // tokens afterward, so custom visuals cannot perturb the canonical plan.
      ...projectCustomInstitutionSceneFields(item),
    });
  }

  // Dedup upgrade chains
  collapseUpgradeChains(institutions);

  // §14 — custom subsumption: a custom institution can declare it `subsumes`
  // others; when both are present the absorbed one isn't listed separately
  // (mirrors the UPGRADE_CHAINS de-dup; required institutions are protected).
  for (const inst of [...institutions]) {
    const targets = customDeps.subsumptionTargetsFor?.(inst, tier) || [];
    for (const target of targets) {
      const matches = institutions
        .map((candidate, index) => ({ candidate, index }))
        .filter(({ candidate }) => (
          !isProtectedFromCustomSubsumption(candidate, {
            exactTarget: Boolean(target.refId),
          })
          && matchesSubsumptionTarget(candidate, target)
        ));
      // A bare legacy name is not enough authority to choose among multiple
      // identity-distinct entities. Structured targets remain exact.
      if (target.source == null && matches.length !== 1) continue;
      if (matches.length > 0) institutions.splice(matches[0].index, 1);
    }
  }

  // Apply toggle exclusions
  for (let i = institutions.length - 1; i >= 0; i--) {
    const inst = institutions[i];
    const toggle = institutionToggles[`${tier}::${inst.category}::${inst.name}`]
                || institutionToggles[`${tier}_${inst.category}_${inst.name}`]
                || institutionToggles[`all::${inst.category}::${inst.name}`]
                || institutionToggles[`all_${inst.category}_${inst.name}`];
    if (!toggle) continue;
    if (toggle.forceExclude === true || (toggle.allow === false && !inst.required && !toggle.require && inst.source !== 'forced')) {
      institutions.splice(i, 1);
    }
  }

  // Threat defenses are structural inputs to governance, legitimacy, and the
  // economy, not a cosmetic patch. Materialize their deterministic minimum
  // before generatePower reads the institution roster. The final coherence
  // pass applies this same policy again as an idempotent safety net after later
  // faction additions, so both boundaries share one policy table.
  const catalogEntries = Object.entries(catalogForTier)
    .flatMap(([category, group]) => Object.entries(group || {}).map(
      ([name, definition]) => ({ category, name, ...definition }),
    ));
  for (const requirement of threatDefensePlan({
    tier,
    threat: ctx.threat,
    institutions,
  })) {
    const candidate = requirement.names
      .map(name => catalogEntries.find(entry => entry.name === name))
      .find((entry) => {
        if (!entry || !isCategoryEnabled(entry.category)) return false;
        const toggle = institutionToggles[`${tier}::${entry.category}::${entry.name}`]
          || institutionToggles[`${tier}_${entry.category}_${entry.name}`]
          || institutionToggles[`all::${entry.category}::${entry.name}`]
          || institutionToggles[`all_${entry.category}_${entry.name}`];
        if (
          toggle
          && toggle.require !== true
          && (toggle.forceExclude === true || toggle.allow === false)
        ) return false;
        if (entry.tradeRouteRequired?.length) {
          const routeOk = entry.tradeRouteRequired.includes(tradeRoute);
          const terrainOk = entry.terrainAccess?.includes(terrainType);
          if (!routeOk && !terrainOk) return false;
        }
        if (entry.forbiddenTradeRoutes?.includes(tradeRoute)) return false;
        if (
          entry.terrainRequired?.length
          && !entry.terrainRequired.includes(terrainType)
        ) return false;
        return worldLaw.allowsInstitution(entry);
      });
    if (!candidate) continue;

    institutions.push({
      ...candidate,
      source: 'coherence_repair',
      coherenceRepair: requirement.type,
    });
    const repair = Object.freeze({
      id: `repair.${generationRepairs.length + 1}`,
      type: requirement.type,
      action: 'added',
      subject: candidate.name,
      reason: requirement.reason,
    });
    generationRepairs.push(repair);
    recordTrace(ctx, {
      targetType: 'institution',
      targetId: instId(candidate.name),
      step: 'assembleInstitutions',
      result: 'added',
      causes: [{
        source: `coherence.${requirement.type}`,
        effect: 'added',
        reason: requirement.reason,
      }],
      downstreamEffects: tagsToDownstream(candidate.tags),
    });
  }

  // Wave 8 — stamp catalog identity on every catalog-derived institution.
  // Pure name→id lookup: consumes no rng, changes no other field, so
  // same-seed output is byte-identical except the new catalogId fields
  // (pinned by tests/joins/institutionIdentity.test.js). Custom/DM
  // institutions carry no catalogId; every id-first join falls back to the
  // legacy name matcher for them (and for legacy saves).
  for (const inst of /** @type {any[]} */ (institutions)) {
    if (inst.isCustom || inst.source === 'custom') continue;
    const catalogId = catalogIdForName(inst.name);
    if (catalogId) inst.catalogId = catalogId;
  }

  // CONTENT-GT-DOSSIER: draw-free institution-description variety. For institutions with
  // authored variants, select one desc from [canonicalDesc, ...variants] by a PURE fnv hash
  // of (settlement seed : institution name) — ZERO rng draws, so the generation stream stays
  // byte-identical and only the persisted `desc` string varies (canonical-at-zero: a falsy
  // seed or a name with no variants keeps the catalog desc). The chosen string is written
  // back to the existing scalar `desc` field — no persistence-shape change. Skips custom
  // institutions (they carry `description`, never a catalog key).
  for (const inst of /** @type {any[]} */ (institutions)) {
    if (inst.isCustom || inst.source === 'custom' || !inst.desc) continue;
    const variants = INSTITUTION_DESC_VARIANTS[`${tier}|${inst.category}|${inst.name}`];
    if (variants && variants.length) {
      inst.desc = pickVariant([inst.desc, ...variants], `${ctx._seed}:${inst.name}`);
    }
  }

  // Structural validation moved to structuralValidationPass (Wave 4b): it
  // must run AFTER the last roster mutation (subsumption / cascade /
  // isolation / factionCorrelation) or the coherence receipt describes a
  // roster that no longer exists.
  return { institutions, catalogForTier, generationRepairs };
});
