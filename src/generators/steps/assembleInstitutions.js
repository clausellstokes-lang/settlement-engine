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
import { TERRAIN_DATA } from '../../data/geographyData.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { getBaseChance } from '../structuralValidator.js';
import { getTerrainType } from '../terrainHelpers.js';
import { recordTrace } from '../../domain/trace.js';
import { customDeps } from '../../lib/dependencyEngine.js';
import { passesTierGate } from '../../domain/customContentSchema.js';

// ── Trace helpers ────────────────────────────────────────────────────────────
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
 *  the real version of this lives in the unified causal state. */
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
 * are present, the lesser is removed (required institutions protected). Used by
 * the main assembly AND by cascadePass after cascade additions — both rosters
 * must obey the same ladder or the dossier lists contradictory scale tiers.
 *
 * @returns {string[]} the names removed (for trace emission by callers that trace).
 */
export function collapseUpgradeChains(institutions) {
  const removed = [];
  const presentNames = new Set(institutions.map(i => i.name));
  UPGRADE_CHAINS.forEach(([lesser, greater]) => {
    if (presentNames.has(lesser) && presentNames.has(greater)) {
      const idx = institutions.findIndex(i => i.name === lesser && i.source !== 'required');
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
  deps: ['resolveConfig', 'resolveResources', 'resolveStress', 'resolveNeighbour'],
  reads: ['categoryToggles', 'effectiveConfig', 'goodsToggles', 'institutionToggles', 'nearbyResources', 'neighbourProfile', 'tier', 'tradeRoute'], // ctx keys this step consumes that another step produces
  provides: ['institutions', 'catalogForTier'],
  phase: 'institutions',
}, (ctx, rng) => {
  const {
    tier, tradeRoute, effectiveConfig, nearbyResources,
    institutionToggles, categoryToggles, goodsToggles,
    neighbourProfile,
  } = ctx;
  const config = ctx.config || {};
  const importedNeighbor = ctx.importedNeighbour || null;

  const isCategoryEnabled = (cat) => {
    const t = config.settType || 'all';
    return categoryToggles[`${t}::${cat}`] !== false
        && categoryToggles[`${t}_${cat}`]  !== false;
  };

  // Build catalog for tier
  const catalogForTier = tier === 'metropolis'
    ? mergeCatalogs(institutionalCatalog['city'] || {}, institutionalCatalog['metropolis'] || {})
    : institutionalCatalog[tier] || {};

  const institutions = [];
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

      const catEnabled = isCategoryEnabled(category);
      const forceExclude = inst.required && toggle.forceExclude === true;

      // Required or explicitly forced
      if ((inst.required && !forceExclude) || (catEnabled && (toggle.require ?? false))) {
        if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) {
          const existingName = exclusiveGroups[inst.exclusiveGroup];
          const existingIdx = institutions.findIndex(i => i.name === existingName);
          if (existingIdx >= 0 && institutions[existingIdx].source !== 'required') {
            institutions.splice(existingIdx, 1);
          } else if (existingIdx >= 0) {
            return;
          }
        }
        if (toggle.require && !inst.required && inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) {
          const existingName = exclusiveGroups[inst.exclusiveGroup];
          const existingIdx = institutions.findIndex(i => i.name === existingName);
          if (existingIdx >= 0 && institutions[existingIdx].source !== 'required') {
            institutions.splice(existingIdx, 1);
          } else if (existingIdx >= 0) {
            return;
          }
        }
        if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = name;
        institutions.push({ category, name, ...inst, source: inst.required ? 'required' : 'forced' });

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

        const baseChance = getBaseChance(
          inst.baseChance, category, name, effectiveConfig, neighbourProfile || importedNeighbor, goodsToggles
        );
        const resourceMult = getResourceMultiplier(inst.tags || [], name, nearbyResources, instModifiers, tier);

        if (rng.chance(baseChance * resourceMult)) {
          if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = name;
          institutions.push({ category, name, ...inst, source: 'generated' });

          // Trace: the most informative case — the engine actually
          // *decided* to select this one based on probabilistic roll.
          // Cause records the base chance + resource multiplier so a
          // reader can see why it was likely. Downstream records what
          // subsystems this institution feeds back into.
          const causes = [chanceCause(baseChance, resourceMult)];
          if (Array.isArray(nearbyResources) && nearbyResources.length && resourceMult > 1) {
            causes.push({
              source: 'nearbyResources',
              effect: `×${resourceMult.toFixed(2)}`,
              reason: `Nearby resources (${nearbyResources.slice(0, 3).join(', ')}${nearbyResources.length > 3 ? '…' : ''}) shifted the selection odds.`,
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
    // Scope legacy underscore toggles to THIS settlement's tier (or the
    // tier-agnostic 'all' bucket), mirroring the '::' sweep's gate below.
    // Without it a persisted `town_Economy_Bakers` force leaked onto an
    // unrelated village, since toggles survive across builds. The `::` keys
    // contain no bare '_' in the tier slot, so they never match `parts[0]`
    // here and are correctly ignored by this legacy pass.
    if (parts[0] !== tier && parts[0] !== 'all') return;
    const instName = parts.slice(2).join('_');
    if (institutions.some(i => i.name === instName)) return;
    for (const [cat, catInsts] of Object.entries(catalogForTier)) {
      if (catInsts[instName]) {
        const inst = catInsts[instName];
        if (inst.exclusiveGroup) {
          if (exclusiveGroups[inst.exclusiveGroup]) {
            const existIdx = institutions.findIndex(i => i.name === exclusiveGroups[inst.exclusiveGroup]);
            if (existIdx >= 0 && institutions[existIdx].source !== 'required') institutions.splice(existIdx, 1);
            else if (existIdx >= 0) return;
          }
          exclusiveGroups[inst.exclusiveGroup] = instName;
        }
        institutions.push({ category: cat, name: instName, ...inst, source: 'forced' });
        break;
      }
    }
  });

  // Out-of-tier forced institutions
  const fullCatalogAllTiers = (() => {
    const all = {};
    // Include 'metropolis' so metropolis-native forced institutions resolve here
    // (and carry nativeTier 'metropolis') instead of being silently dropped. The
    // `if (!all[cat][name])` first-wins keeps every lower-tier institution's
    // existing nativeTier, so this is purely additive — only previously-missing
    // metropolis-only entries are added.
    ['thorp','hamlet','village','town','city','metropolis'].forEach(t => {
      const tc = institutionalCatalog[t] || {};
      Object.entries(tc).forEach(([cat, insts]) => {
        if (!all[cat]) all[cat] = {};
        Object.entries(insts).forEach(([name, def]) => {
          if (!all[cat][name]) {
            // nativeTier is the tier at which an institution genuinely belongs and
            // drives the out-of-tier override label. A handful of names are
            // duplicated across tiers where the LOWER-tier definition carries a
            // higher `minTier` (e.g. 'Smuggling network' is defined under village
            // but gated minTier:'city'). Plain first-wins would mislabel those as
            // their (lower) definition tier; honor minTier so the override warning
            // reports the true scale (the long-standing "Smuggling" mislabel).
            const minRank = def.minTier ? TIER_ORDER.indexOf(def.minTier) : -1;
            const nativeTier = minRank > TIER_ORDER.indexOf(t) ? def.minTier : t;
            all[cat][name] = { ...def, nativeTier };
          }
        });
      });
    });
    return all;
  })();

  Object.entries(institutionToggles).forEach(([key, toggle]) => {
    if (!toggle?.require) return;
    const parts = key.split('::');
    if (parts.length < 3) return;
    const [keyTier, category, instName] = parts;
    // Scope the override to THIS settlement's tier (or the tier-agnostic 'all'
    // bucket random/custom mode uses) — mirroring the in-tier loop's toggle
    // contract above. Without this gate the tier prefix was discarded, so a
    // forced toggle authored against a DIFFERENT tier in a prior build — e.g.
    // `town::Economy::Bakers (5-15)` set while building a town — leaked into an
    // unrelated hamlet and surfaced as a phantom "deliberate override" the user
    // never made for that settlement. Toggles persist across builds, so stale
    // cross-tier forces could pile up; this is the load-bearing fix (the
    // new-build toggle reset is the complementary hygiene pass).
    if (keyTier !== tier && keyTier !== 'all') return;
    if (institutions.some(i => i.name === instName)) return;
    const catInsts = fullCatalogAllTiers[category];
    if (!catInsts || !catInsts[instName]) return;
    const inst = catInsts[instName];
    const isInTier = !!((catalogForTier[category] || {})[instName]);
    if (isInTier) return;

    if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) {
      const existIdx = institutions.findIndex(i => i.name === exclusiveGroups[inst.exclusiveGroup]);
      if (existIdx >= 0 && institutions[existIdx].source === 'required') {
        // Both co-exist
      } else if (existIdx >= 0) {
        institutions.splice(existIdx, 1);
      }
    }
    if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = instName;
    // outOfTier means the institution is ABOVE the settlement's scale (genuine
    // override — "infrastructure beyond its normal scale"). A metropolis naturally
    // contains lower-tier institutions, so a forced inst whose native tier is at or
    // below the settlement tier is NOT out-of-tier. Compare on TIER_ORDER; an
    // unknown native tier (indexOf === -1) is treated conservatively as NOT above.
    const nativeTier = inst.nativeTier || 'unknown';
    const nativeRank = TIER_ORDER.indexOf(nativeTier);
    const settlementRank = TIER_ORDER.indexOf(tier);
    const aboveTier = nativeRank > settlementRank;
    institutions.push({
      category, name: instName, ...inst, source: 'forced',
      outOfTier: aboveTier, nativeTier,
    });
  });

  // §14 — inject the user's CUSTOM institutions into generation. The list is
  // tier-filtered upstream (eligibleCustomContent), but we honour each item's own
  // gate again defensively. Essential ones always appear; the rest roll a modest
  // chance. Marked source:'custom' (the dossier tints these gold) and carrying the
  // real `category` so they land in the right dossier section. Iterated in a
  // stable name order so the rng rolls are deterministic; when the user has no
  // custom institutions this loop is a no-op and consumes no rng (zero change to
  // existing generation). The order MUST be codepoint-stable, NOT localeCompare:
  // the loop below consumes rng per item, so a locale-/ICU-dependent sort would
  // make the SAME seed pick a DIFFERENT set of custom institutions across
  // machines — a direct 'same seed => same settlement' violation.
  const customInstitutions = (customDeps.registry().listCustom?.('institutions') || [])
    .slice()
    .sort((a, b) => {
      const an = String(a.name), bn = String(b.name);
      return an < bn ? -1 : an > bn ? 1 : 0;
    });
  for (const entry of customInstitutions) {
    const item = entry.raw || {};
    const name = entry.name;
    if (!name || institutions.some(i => i.name === name)) continue;
    if (!passesTierGate(item, tier)) continue;
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
      localUid: item.localUid || entry.refId,
    });
  }

  // Dedup upgrade chains
  collapseUpgradeChains(institutions);
  const presentNames = new Set(institutions.map(i => i.name));

  // §14 — custom subsumption: a custom institution can declare it `subsumes`
  // others; when both are present the absorbed one isn't listed separately
  // (mirrors the UPGRADE_CHAINS de-dup; required institutions are protected).
  for (const inst of [...institutions]) {
    for (const absorbedName of customDeps.subsumedBy?.(inst.name) || []) {
      const idx = institutions.findIndex(i => i.name === absorbedName && i.source !== 'required');
      if (idx >= 0) { institutions.splice(idx, 1); presentNames.delete(absorbedName); }
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

  // Stamp catalog identity on every catalog-derived institution.
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

  // Structural validation moved to structuralValidationPass: it
  // must run AFTER the last roster mutation (subsumption / cascade /
  // isolation / factionCorrelation) or the coherence receipt describes a
  // roster that no longer exists.
  return { institutions, catalogForTier };
});
