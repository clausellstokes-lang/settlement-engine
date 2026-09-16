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
import { byCustomIdentityCodepoint } from '../../domain/deterministicSort.js';
import {
  projectCustomDefinitionIdentity,
} from '../../domain/content/customDefinitionIdentityProjection.js';
import {
  isRandomlyDepletableResource,
  resourceSemanticsFor,
} from '../../domain/resourceSemantics.js';

// Chance a randomly-selected nearby resource is born already worked out.
// Rises with settlement size — bigger places have extracted for longer. The
// UI states that claim in plain language (ConfigurationPanel "pressure rising
// as settlement size grows"), so this table must stay non-decreasing.
//
// OWNER RULING 2026-07-26 — "tune depletion down": city 0.55 → 0.35. Once
// depleted-input chains began reading 'impaired' (honest semantics, kept), a
// freshly generated city was born ~45% worked out and its stable-chain share
// fell to the floor of the distribution contract. The world was tuned, not the
// test. Measured city stable-chain share (tests/domain/distribution.test.js
// metric, N=400): 0.55 → 0.4986/0.5021 across two disjoint seed prefixes;
// 0.35 → 0.5477/0.5461. At the test's own N=40 'dist' sample: 0.4888 (red)
// → 0.5383 against its >= 0.50 floor. 0.35 is the lowest value that does not
// invert town-vs-city, and city is deliberately NOT taken below town.
// See docs/GOLDEN_SHIFT_LEDGER.md, "2026-07-26 — city resource-depletion
// tuning" for the full candidate table and the rejected 0.30 option.
const DEPLETION_PROB = {
  thorp: 0.05, hamlet: 0.10, village: 0.20,
  town: 0.35, city: 0.35, metropolis: 0.70,
};

const RESOURCE_COUNT_RANGE = {
  thorp: [1,3], hamlet: [2,4], village: [3,5],
  town: [4,6], city: [5,7], metropolis: [6,8],
};

const RARE_RESOURCES = { 'ancient_ruins': 0.15, 'magical_node': 0.15 };

/**
 * Identity-bearing projection of one materialized custom resource.
 *
 * @typedef {{
 *   name: string,
 *   localUid: string,
 *   refId: string,
 *   custom: true,
 *   source: 'custom',
 *   customDefinitionCategory: 'resources',
 *   customDefinitionId?: string,
 *   customDefinitionRevisionId?: string,
 *   customDefinitionContentHash?: string,
 *   customDefinitionVersion?: string|number,
 *   customDefinitionFingerprint?: string
 * }} MaterializedCustomResource
 */

registerStep('resolveResources', {
  deps: ['buildGenerationContext'],
  reads: ['generationContext', 'resolvedTerrain', 'tier', 'tradeRoute'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  provides: [
    'nearbyResources',
    'nearbyResourcesNative',
    'nearbyResourcesDepleted',
    'nearbyResourcesNativeDepleted',
    'nearbyResourcesCustom',
    'nearbyResourceDefinitions',
    'nearbyResourceDefinitionsDepleted',
  ],
  mutates: ['effectiveConfig'], // stamps derived resource keys onto effectiveConfig (A+ P1.7)
  phase: 'config',
}, (ctx, rng) => {
  const {
    tier,
    tradeRoute,
    resolvedTerrain,
    effectiveConfig,
    generationContext,
  } = ctx;
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
  const editsRemovedNative = Array.isArray(resourceEdits.removedNative)
    ? resourceEdits.removedNative
    : [];
  const editsDepleted = Array.isArray(resourceEdits.depleted) ? resourceEdits.depleted : [];
  const editsDepletedCustomDefinitionIds = Array.isArray(
    resourceEdits.depletedCustomDefinitionIds,
  )
    ? resourceEdits.depletedCustomDefinitionIds
    : [];
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

    // Random resources are generator-owned and obey the same resolved magic
    // law as institutions, services, histories, and NPCs. In particular,
    // priorityMagic:0 disables a magical node even when a stale
    // magicExists:true flag remains. Manual resources are authored premises and
    // stay visible for the validator/receipt to classify rather than being
    // silently erased.
    if (!generationContext.worldLaw.magicFunctions()) {
      nearbyResources = nearbyResources.filter(r => r !== 'magical_node');
    }

    // Preserve one depletion draw per selected resource so downstream RNG remains
    // stable, but only material/ecological resources may accept that draw.
    // Positions and infrastructure can still be explicitly disabled by an
    // authored state/event; settlement size alone cannot "consume" a harbour,
    // crossroads, mountain pass, mill site, oasis, or hot spring.
    nearbyResourcesDepleted = nearbyResources.filter((resourceKey) => {
      const depletionRolled = rng.chance(depletionProb);
      return (
        isRandomlyDepletableResource(resourceKey)
        && depletionRolled
      );
    });
  } else {
    // Manual mode
    const resourceState = config.nearbyResourcesState || {};
    // pipeline-2: compute compatibility WITH the terrain override, exactly as the
    // random branch does (terrainOverride derivation above) — otherwise every
    // terrain-specific resource the UI offered (desert/mountain, water unlocks) is
    // incompatible when terrain is null and silently dropped at generation.
    const manualTerrain = resolvedTerrain
      || (config.terrainOverride && config.terrainOverride !== 'auto' ? config.terrainOverride : null);
    const allCompatible = getCompatibleResources(tradeRoute, manualTerrain).filter(r => r.compatible).map(r => r.key);
    const legacyList = config.nearbyResources ?? getDefaultResources(tradeRoute);

    if (Object.keys(resourceState).length > 0) {
      nearbyResources = allCompatible.filter(k => {
        const st = resourceState[k];
        // pipeline-1: the UI writes list membership as the 'allow' selection
        // (config.nearbyResources) and only abundant/depleted overrides into the
        // state map. Treat a list member as 'allow' so plain selections survive
        // instead of being dropped the moment any resource is marked
        // abundant/depleted.
        return config.nearbyResources?.includes(k)
          || st === 'allow' || st === 'abundant' || st === 'depleted';
      });
      const forceAbundant = new Set(allCompatible.filter(k => resourceState[k] === 'abundant'));
      const forceDepleted = new Set(allCompatible.filter(k => resourceState[k] === 'depleted'));
      const allowState = nearbyResources.filter(k => !forceAbundant.has(k) && !forceDepleted.has(k));
      nearbyResourcesDepleted = [
        ...forceDepleted,
        ...allowState.filter((resourceKey) => {
          const depletionRolled = rng.chance(depletionProb);
          return (
            isRandomlyDepletableResource(resourceKey)
            && depletionRolled
          );
        }),
      ];
    } else {
      nearbyResources = legacyList;
    }
  }

  // Preserve native membership before custom injection. The public roster is
  // still a flat compatibility/display list, so two identity-distinct
  // resources with the same label occupy one visible slot. These source
  // sidecars retain the canonical dual membership without duplicate UI rows.
  const configuredCustomKeys = new Set(
    (Array.isArray(config.nearbyResourcesCustom)
      ? config.nearbyResourcesCustom
      : [])
      .map(key => slugOf(key))
      .filter(Boolean),
  );
  const configuredNativeKeys = Array.isArray(config.nearbyResourcesNative)
    ? new Set(config.nearbyResourcesNative.map(key => slugOf(key)))
    : null;
  let nearbyResourcesNative = config.nearbyResourcesRandom !== false
    ? [...nearbyResources]
    : nearbyResources.filter((key) => {
        const slug = slugOf(key);
        if (configuredNativeKeys) return configuredNativeKeys.has(slug);
        return !configuredCustomKeys.has(slug);
      });
  let nearbyResourcesNativeDepleted = config.nearbyResourcesRandom !== false
    ? nearbyResourcesDepleted.filter(key => (
        nearbyResourcesNative.some(nativeKey => slugOf(nativeKey) === slugOf(key))
      ))
    : (Array.isArray(config.nearbyResourcesNativeDepleted)
        ? config.nearbyResourcesNativeDepleted.filter(key => (
            nearbyResourcesNative.some(nativeKey => slugOf(nativeKey) === slugOf(key))
          ))
        : nearbyResourcesDepleted.filter(key => (
            nearbyResourcesNative.some(nativeKey => slugOf(nativeKey) === slugOf(key))
            && !configuredCustomKeys.has(slugOf(key))
          )));

  // §14 — inject the user's CUSTOM resources into the nearby-resource list.
  // Mirrors the custom-institution/service injection: tier-gated, essential ones
  // always appear, the rest roll a modest chance. Custom resources are authored
  // as present, so they join the abundant set (never auto-depleted). Tracked in
  // nearbyResourcesCustom so the dossier (web + PDF) can tint them gold.
  // Definition-identity order keeps cosmetic renames on the same RNG draw;
  // codepoint comparison keeps that order stable across devices/locales.
  let nearbyResourcesCustom = [];
  let nearbyResourceDefinitions = [];
  const customResources = (customDeps.registry().listCustom?.('resources') || [])
    .slice()
    .sort(byCustomIdentityCodepoint);
  /** @returns {MaterializedCustomResource} */
  const materializedResource = entry => ({
    name: entry.name,
    localUid: entry.raw?.localUid || entry.refId,
    refId: entry.refId,
    custom: true,
    source: 'custom',
    customDefinitionCategory: 'resources',
    ...projectCustomDefinitionIdentity(entry.raw),
  });
  for (const entry of customResources) {
    const item = entry.raw || {};
    const name = entry.name;
    if (!name) continue;
    if (!passesTierGate(item, tier)) continue;
    const essential = item.essential === true || item.criticality === 'critical';
    if (!essential && !rng.chance(0.3)) continue;
    // The legacy roster is name-only, so a custom definition can collide with
    // a selected native key. Retain the one display entry while stamping both
    // source sidecars: native mechanics continue from native membership and
    // exact custom mechanics continue from immutable definition identity.
    if (!nearbyResources.includes(name)) {
      nearbyResources = [...nearbyResources, name];
    }
    if (!nearbyResourcesCustom.includes(name)) {
      nearbyResourcesCustom.push(name);
    }
    nearbyResourceDefinitions.push(materializedResource(entry));
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
  if (
    editsAdded.length
    || editsRemoved.length
    || editsRemovedNative.length
    || editsDepleted.length
    || editsRecovered.length
  ) {
    const toSlugSet = list => new Set(list.map(slugOf).filter(Boolean));
    const removedSet = toSlugSet(editsRemoved);
    const removedNativeSet = toSlugSet(editsRemovedNative);
    const addedSet = toSlugSet(editsAdded.map(e => e?.key));
    const recoveredSet = toSlugSet(editsRecovered);

    // 1. Removals suppress rolled/injected nodes (and their gold tint).
    nearbyResources = nearbyResources.filter(k => !removedSet.has(slugOf(k)));
    nearbyResourcesNative = nearbyResourcesNative.filter(
      k => (
        !removedSet.has(slugOf(k))
        && !removedNativeSet.has(slugOf(k))
      ),
    );
    nearbyResourcesNativeDepleted = nearbyResourcesNativeDepleted.filter(
      key => (
        !removedSet.has(slugOf(key))
        && !removedNativeSet.has(slugOf(key))
        && !recoveredSet.has(slugOf(key))
      ),
    );
    nearbyResourcesCustom = nearbyResourcesCustom.filter(k => !removedSet.has(slugOf(k)));
    nearbyResourceDefinitions = nearbyResourceDefinitions.filter(
      definition => !removedSet.has(slugOf(definition.name)),
    );
    // A source-specific native removal must leave a same-name custom resource
    // visible. Drop the flat key only when no custom definition still owns it.
    const survivingCustomSlugs = new Set(
      nearbyResourcesCustom.map(key => slugOf(key)),
    );
    nearbyResources = nearbyResources.filter((key) => {
      const slug = slugOf(key);
      return (
        !removedNativeSet.has(slug)
        || survivingCustomSlugs.has(slug)
      );
    });

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
      if (entry?.custom) {
        const matchingDefinitions = customResources.filter(candidate => (
          passesTierGate(candidate.raw || {}, tier)
          && slugOf(candidate.name) === slugOf(key)
        ));
        // A name-only event cannot choose between two authored definitions.
        // Materialize exact identity only when the address is unambiguous.
        if (matchingDefinitions.length === 1) {
          const projected = materializedResource(matchingDefinitions[0]);
          const projectedId = projected.customDefinitionId
            || projected.localUid;
          if (!nearbyResourceDefinitions.some(definition => (
            (definition.customDefinitionId || definition.localUid)
              === projectedId
          ))) {
            nearbyResourceDefinitions.push(projected);
          }
        }
      }
      if (
        !entry?.custom
        && !nearbyResourcesNative.some(
          nativeKey => nativeKey === key || slugOf(nativeKey) === slugOf(key),
        )
      ) {
        nearbyResourcesNative.push(key);
      }
      if (!entry?.custom) {
        nearbyResourcesNativeDepleted = nearbyResourcesNativeDepleted.filter(
          depletedKey => slugOf(depletedKey) !== slugOf(key),
        );
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
      const nativeKey = nearbyResourcesNative.find(
        candidate => slugOf(candidate) === slugOf(key),
      );
      if (
        nativeKey
        && !nearbyResourcesNativeDepleted.some(
          candidate => slugOf(candidate) === slugOf(nativeKey),
        )
      ) {
        nearbyResourcesNativeDepleted.push(nativeKey);
      }
    }
  }

  const exactDepletedIds = new Set(
    [
      ...(Array.isArray(config.nearbyResourceDefinitionsDepleted)
        ? config.nearbyResourceDefinitionsDepleted.map(definition => (
            definition?.customDefinitionId
            || definition?.localUid
            || ''
          ))
        : []),
      ...editsDepletedCustomDefinitionIds,
    ].filter(Boolean),
  );
  const nativeSlugs = new Set(nearbyResourcesNative.map(slugOf));
  const customDepletedSlugs = new Set(editsDepletedSlugs);
  for (const [key, state] of Object.entries(
    config.nearbyResourcesState || {},
  )) {
    const slug = slugOf(key);
    if (
      state === 'depleted'
      && (
        !nativeSlugs.has(slug)
        || editsDepletedSlugs.has(slug)
      )
    ) {
      customDepletedSlugs.add(slug);
    }
  }
  const nearbyResourceDefinitionsDepleted =
    nearbyResourceDefinitions.filter(definition => (
      exactDepletedIds.has(
        definition.customDefinitionId || definition.localUid,
      )
      || customDepletedSlugs.has(slugOf(definition.name))
    ));
  const flatDepletedBySlug = new Map();
  for (const key of nearbyResourcesNativeDepleted) {
    flatDepletedBySlug.set(slugOf(key), key);
  }
  for (const definition of nearbyResourceDefinitionsDepleted) {
    const slug = slugOf(definition.name);
    if (!flatDepletedBySlug.has(slug)) {
      flatDepletedBySlug.set(slug, definition.name);
    }
  }
  for (const key of nearbyResourcesCustom) {
    const slug = slugOf(key);
    if (customDepletedSlugs.has(slug) && !flatDepletedBySlug.has(slug)) {
      flatDepletedBySlug.set(slug, key);
    }
  }
  nearbyResourcesDepleted = [...flatDepletedBySlug.values()];

  // Write back into effectiveConfig for downstream steps
  effectiveConfig.nearbyResources = nearbyResources;
  effectiveConfig.nearbyResourcesNative = nearbyResourcesNative;
  effectiveConfig.nearbyResourcesDepleted = nearbyResourcesDepleted;
  effectiveConfig.nearbyResourcesNativeDepleted =
    nearbyResourcesNativeDepleted;
  effectiveConfig.nearbyResourcesCustom = nearbyResourcesCustom;
  effectiveConfig.nearbyResourceDefinitions = nearbyResourceDefinitions;
  effectiveConfig.nearbyResourceDefinitionsDepleted =
    nearbyResourceDefinitionsDepleted;

  // Tier 2.1 — emit one trace per nearby resource so downstream
  // consumers (assembleInstitutions reads these to bias institution
  // selection) and human readers can answer "why is this a fishing
  // town?" / "why does this town have a mine?"
  const nativeDepletedSet = new Set(nearbyResourcesNativeDepleted);
  const nativeResourceSet = new Set(nearbyResourcesNative);
  const customResourceSet = new Set(nearbyResourcesCustom);
  for (const resourceKey of nearbyResources) {
    // Custom-only resources were traced at injection. A same-name native and
    // custom pair retains both causal receipts.
    if (
      customResourceSet.has(resourceKey)
      && !nativeResourceSet.has(resourceKey)
    ) continue;
    if (eventAddedKeys.has(resourceKey)) continue;    // edit overlay: traced at re-add
    const meta = RESOURCE_DATA[resourceKey] || {};
    const semantics = resourceSemanticsFor(resourceKey);
    const depleted = nativeDepletedSet.has(resourceKey);
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
            : config.nearbyResourcesState?.[resourceKey] === 'depleted'
              ? { source: 'config.nearbyResourcesState', effect: 'explicitly unavailable',
                  reason: semantics?.depletedDescription
                    || `The configured resource state marks "${resourceKey}" as depleted.` }
              : { source: `tier.${tier}`, effect: 'eligible depletion roll passed',
                  reason: semantics?.depletedDescription
                    || `Tier-weighted depletion (${Math.round((DEPLETION_PROB[tier] ?? 0.25) * 100)}%) marked this resource as depleted.` })
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

  return {
    nearbyResources,
    nearbyResourcesNative,
    nearbyResourcesDepleted,
    nearbyResourcesNativeDepleted,
    nearbyResourcesCustom,
    nearbyResourceDefinitions,
    nearbyResourceDefinitionsDepleted,
  };
});
