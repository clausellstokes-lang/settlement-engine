/**
 * Step 2: resolveResources
 *
 * Resolves nearby resources from config — random terrain-compatible selection
 * or manual state map with tier-weighted depletion.
 *
 * Resource-resolution step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { getCompatibleResources, getDefaultResources } from '../terrainHelpers.js';
import { recordTrace } from '../../domain/trace.js';
import { customDeps } from '../../lib/dependencyEngine.js';
import { slugify } from '../../lib/customRegistry.js';
import { passesTierGate } from '../../domain/customContentSchema.js';

const DEPLETION_PROB = {
  thorp: 0.05, hamlet: 0.10, village: 0.20,
  town: 0.35, city: 0.55, metropolis: 0.70,
};

const RESOURCE_COUNT_RANGE = {
  thorp: [1,3], hamlet: [2,4], village: [3,5],
  town: [4,6], city: [5,7], metropolis: [6,8],
};

const RARE_RESOURCES = { 'ancient_ruins': 0.15, 'magical_node': 0.15 };

registerStep('resolveResources', {
  deps: ['resolveConfig'],
  provides: ['nearbyResources', 'nearbyResourcesDepleted', 'nearbyResourcesCustom'],
  mutates: ['effectiveConfig'], // stamps derived resource keys onto effectiveConfig (A+ P1.7)
  phase: 'config',
}, (ctx, rng) => {
  const { tier, tradeRoute, resolvedTerrain, effectiveConfig } = ctx;
  const config = ctx.config || {};
  const depletionProb = DEPLETION_PROB[tier] ?? 0.25;

  // Editor event deltas (config.resourceEdits — ADD/REMOVE/DEPLETE/
  // RECOVERED_RESOURCE in domain/events/mutate.js record them alongside
  // their live config writes, dual-written into _config so applyChange
  // feeds them back here). Parsed up front; applied as an overlay AFTER the
  // mode rolls and the §14 injection below. Slug-equivalent matching is the
  // events' own tolerance: catalog keys are slugs already, custom names are
  // verbatim ('Moonpetal grove').
  const resourceEdits = config.resourceEdits || {};
  const editsAdded = Array.isArray(resourceEdits.added) ? resourceEdits.added : [];
  const editsRemoved = Array.isArray(resourceEdits.removed) ? resourceEdits.removed : [];
  const editsDepleted = Array.isArray(resourceEdits.depleted) ? resourceEdits.depleted : [];
  const editsRecovered = Array.isArray(resourceEdits.recovered) ? resourceEdits.recovered : [];
  const slugOf = k => slugify(String(k || ''));
  const editsDepletedSlugs = new Set(editsDepleted.map(slugOf).filter(Boolean));
  const eventAddedKeys = new Set();

  let nearbyResources;
  let nearbyResourcesDepleted = config.nearbyResourcesDepleted || [];

  if (config.nearbyResourcesRandom !== false) {
    // Random mode
    const terrainOverride = resolvedTerrain
      || (config.terrainOverride && config.terrainOverride !== 'auto' ? config.terrainOverride : null);
    const compatible = getCompatibleResources(tradeRoute, terrainOverride)
      .filter(r => r.compatible).map(r => r.key);

    const terrainSpecific = compatible.filter(k => RESOURCE_DATA[k]?.terrain === terrainOverride);
    const universal = compatible.filter(k => !RESOURCE_DATA[k]?.terrain);

    // One per category from universal
    const byCategory = {};
    universal.forEach(k => {
      const cat = (RESOURCE_DATA[k]?.category) || 'land';
      (byCategory[cat] = byCategory[cat] || []).push(k);
    });

    const selected = new Set();

    // Terrain-specific first
    const shuffledTerrain = rng.shuffle([...terrainSpecific]);
    const terrainSlots = Math.min(shuffledTerrain.length, terrainOverride ? 2 : 0);
    shuffledTerrain.slice(0, terrainSlots).forEach(k => selected.add(k));

    // One per category (exclude rare from category pools)
    Object.values(byCategory).forEach(arr => {
      if (arr.length === 0) return;
      const nonRare = arr.filter(k => RARE_RESOURCES[k] === undefined);
      const pool = nonRare.length > 0 ? nonRare : arr;
      selected.add(rng.pick(pool));
    });

    // Fill to target count
    const [rcMin, rcMax] = RESOURCE_COUNT_RANGE[tier] || [3, 6];
    const targetCount = rng.randInt(rcMin, rcMax);

    rng.shuffle([...universal]).forEach(k => {
      if (selected.size >= targetCount) return;
      const rarity = RARE_RESOURCES[k];
      if (rarity !== undefined && !rng.chance(rarity)) return;
      selected.add(k);
    });

    nearbyResources = [...selected];

    // Suppress magical resources in no-magic worlds
    if (config.magicExists === false) {
      nearbyResources = nearbyResources.filter(r => r !== 'magical_node');
    }

    // Tier-weighted random depletion
    nearbyResourcesDepleted = nearbyResources.filter(() => rng.chance(depletionProb));
  } else {
    // Manual mode
    const resourceState = config.nearbyResourcesState || {};
    const allCompatible = getCompatibleResources(tradeRoute).filter(r => r.compatible).map(r => r.key);
    const legacyList = config.nearbyResources ?? getDefaultResources(tradeRoute);

    if (Object.keys(resourceState).length > 0) {
      nearbyResources = allCompatible.filter(k => {
        const st = resourceState[k];
        return st === 'allow' || st === 'abundant' || st === 'depleted';
      });
      const forceAbundant = new Set(allCompatible.filter(k => resourceState[k] === 'abundant'));
      const forceDepleted = new Set(allCompatible.filter(k => resourceState[k] === 'depleted'));
      const allowState = nearbyResources.filter(k => !forceAbundant.has(k) && !forceDepleted.has(k));
      nearbyResourcesDepleted = [
        ...forceDepleted,
        ...allowState.filter(() => rng.chance(depletionProb)),
      ];
    } else {
      nearbyResources = legacyList;
    }
  }

  // §14 — inject the user's CUSTOM resources into the nearby-resource list.
  // Mirrors the custom-institution/service injection: tier-gated, essential ones
  // always appear, the rest roll a modest chance. Custom resources are authored
  // as present, so they join the abundant set (never auto-depleted). Tracked in
  // nearbyResourcesCustom so the dossier (web + PDF) can tint them gold. Stable
  // name order keeps rng deterministic; a no-op consuming zero rng when the user
  // has no custom resources.
  let nearbyResourcesCustom = [];
  const customResources = (customDeps.registry().listCustom?.('resources') || [])
    .slice()
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  for (const entry of customResources) {
    const item = entry.raw || {};
    const name = entry.name;
    if (!name || nearbyResources.includes(name)) continue;
    if (!passesTierGate(item, tier)) continue;
    const essential = item.essential === true || item.criticality === 'critical';
    if (!essential && !rng.chance(0.3)) continue;
    nearbyResources = [...nearbyResources, name];
    nearbyResourcesCustom.push(name);
    recordTrace(ctx, {
      targetType: 'resource',
      targetId:   `resource.${name}`,
      step:       'resolveResources',
      result:     'present',
      causes: [{ source: 'custom', effect: 'authored by you',
                 reason: `"${name}" is a custom resource you added to the compendium.` }],
      downstreamEffects: [],
    });
  }

  // ── Editor event overlay (config.resourceEdits) ──────────────────────────
  // Re-apply the authored roster deltas on top of whatever the mode above
  // produced — this is what lets a resource edit survive a full regeneration:
  // random mode re-rolls the roster and depletion from the same seed
  // (resurrecting whatever the event changed), and manual mode re-rolls
  // 'allow' depletion. Runs after the rolls and the §14 injection, consuming
  // NO rng — a config without edits generates byte-identically.
  if (editsAdded.length || editsRemoved.length || editsDepleted.length || editsRecovered.length) {
    const toSlugSet = list => new Set(list.map(slugOf).filter(Boolean));
    const removedSet = toSlugSet(editsRemoved);
    const addedSet = toSlugSet(editsAdded.map(e => e?.key));
    const recoveredSet = toSlugSet(editsRecovered);

    // 1. Removals suppress rolled/injected nodes (and their gold tint).
    nearbyResources = nearbyResources.filter(k => !removedSet.has(slugOf(k)));
    nearbyResourcesCustom = nearbyResourcesCustom.filter(k => !removedSet.has(slugOf(k)));

    // 2. Authored adds re-join the roster; custom ones re-tint gold. A key
    // the mode already produced keeps its natural presence (and trace).
    for (const entry of editsAdded) {
      const key = String(entry?.key || '');
      if (!key || removedSet.has(slugOf(key))) continue;
      if (!nearbyResources.some(k => k === key || slugOf(k) === slugOf(key))) {
        nearbyResources = [...nearbyResources, key];
        eventAddedKeys.add(key);
        recordTrace(ctx, {
          targetType: 'resource',
          targetId:   `resource.${key}`,
          step:       'resolveResources',
          result:     'present',
          causes: [{ source: 'event', effect: 'added by editor event',
                     reason: `"${key}" was opened with an ADD_RESOURCE event.` }],
          downstreamEffects: [],
        });
      }
      if (entry?.custom && !nearbyResourcesCustom.includes(key)) {
        nearbyResourcesCustom.push(key);
      }
    }

    // 3. Depletion overlay: an added/re-opened node starts open, recovered
    // nodes are forced out, then event-depleted nodes forced in — in that
    // order, so a DEPLETE recorded after a re-ADD still lands. (The mutate
    // handlers keep the four lists mutually agreeing; the order here is the
    // defensive mirror.)
    const rosterKeyFor = k => nearbyResources.find(r => r === k || slugOf(r) === slugOf(k)) || k;
    nearbyResourcesDepleted = nearbyResourcesDepleted.filter(k =>
      !removedSet.has(slugOf(k)) && !addedSet.has(slugOf(k)) && !recoveredSet.has(slugOf(k)));
    for (const k of editsDepleted) {
      const key = rosterKeyFor(String(k || ''));
      if (!key || removedSet.has(slugOf(key))) continue;
      if (!nearbyResourcesDepleted.some(d => d === key || slugOf(d) === slugOf(key))) {
        nearbyResourcesDepleted = [...nearbyResourcesDepleted, key];
      }
    }
  }

  // Write back into effectiveConfig for downstream steps
  effectiveConfig.nearbyResources = nearbyResources;
  effectiveConfig.nearbyResourcesDepleted = nearbyResourcesDepleted;
  effectiveConfig.nearbyResourcesCustom = nearbyResourcesCustom;

  // Tier 2.1 — emit one trace per nearby resource so downstream
  // consumers (assembleInstitutions reads these to bias institution
  // selection) and human readers can answer "why is this a fishing
  // town?" / "why does this town have a mine?"
  const depletedSet = new Set(nearbyResourcesDepleted);
  const customResourceSet = new Set(nearbyResourcesCustom);
  for (const resourceKey of nearbyResources) {
    if (customResourceSet.has(resourceKey)) continue; // §14: custom resources traced at injection
    if (eventAddedKeys.has(resourceKey)) continue;    // edit overlay: traced at re-add
    const meta = RESOURCE_DATA[resourceKey] || {};
    const depleted = depletedSet.has(resourceKey);
    recordTrace(ctx, {
      targetType: 'resource',
      targetId:   `resource.${resourceKey}`,
      step:       'resolveResources',
      result:     depleted ? 'present_but_depleted' : 'present',
      causes: [
        meta.terrain
          ? { source: `terrain.${meta.terrain}`, effect: 'enables',
              reason: `"${resourceKey}" is terrain-specific to ${meta.terrain}, which this settlement borders.` }
          : { source: 'terrainCompatibility', effect: 'permitted',
              reason: `"${resourceKey}" is compatible with this settlement's trade route + terrain combination.` },
        depleted
          ? (editsDepletedSlugs.has(slugOf(resourceKey))
            ? { source: 'event', effect: 'depleted by editor event',
                reason: `A DEPLETE_RESOURCE event marked "${resourceKey}" as depleted.` }
            : { source: `tier.${tier}`, effect: 'depletion roll passed',
                reason: `Tier-weighted depletion (${Math.round((DEPLETION_PROB[tier] ?? 0.25) * 100)}%) marked this resource as depleted.` })
          : null,
      ].filter(Boolean),
      downstreamEffects: Array.isArray(meta.instBoosts) || (meta.instBoosts && typeof meta.instBoosts === 'object')
        ? Object.keys(meta.instBoosts).slice(0, 3).map(name => ({
            target: `institution.${name.replace(/\s+/g, '_')}`,
            effect: 'biased toward selection',
          }))
        : [],
    });
  }

  return { nearbyResources, nearbyResourcesDepleted, nearbyResourcesCustom };
});
