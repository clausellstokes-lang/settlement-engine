/**
 * resourceGenerator.js
 * Resource chain analysis and availability reporting.
 */

import {getPriorities} from './helpers.js';
import {priorityToCategory} from './economicGenerator.js';
import {TERRAIN_DATA} from '../data/geographyData.js';
import {RESOURCE_DATA, RESOURCE_CHAINS, SPECIAL_RESOURCES} from '../data/resourceData.js';
import {institutionHasAnyTag} from '../lib/entities.js';

// ─── resolveNearbyCommodities ─────────────────────────────────────────────────
// Turn the settlement's ACTUALLY-rolled nearby resources into the commodity/
// resource-key tokens the chain matcher reconciles against. This is what couples
// the resource analysis to the specific settlement: config.nearbyResources holds
// RESOURCE_DATA *keys* (e.g. 'iron_deposits'), each mapping to commodity tokens
// (RESOURCE_DATA[key].commodities, e.g. ['iron','metalwork']). A depleted node
// puts nothing on the table — a worked-out mine is not "iron present."
//
// The resolved list carries BOTH the commodity tokens AND the resource keys,
// because the two chain families key off different vocabularies: generic chains
// match commodity tokens ('iron' reconciles with rawResource 'iron ore'), while
// terrain-specific chains match the resource KEY itself (rawResource
// 'alpine_pasture'). evaluateEconomicActivity's normalized matcher bridges both.
//
// Falls back to the terrain's allowedResources when the config roster is empty or
// unresolvable — preserving the terrain-driven default for settlements that never
// rolled an explicit roster.

export const resolveNearbyCommodities = (config = {}, terrainType) => {
  const keys = Array.isArray(config.nearbyResources) ? config.nearbyResources : [];
  const stateMap = config.nearbyResourcesState || {};
  const depletedList = Array.isArray(config.nearbyResourcesDepleted) ? config.nearbyResourcesDepleted : [];
  // A resource is depleted per the resolved roster (nearbyResourcesDepleted, the
  // canonical output of resolveResources) OR the raw manual state map.
  const depleted = new Set([
    ...depletedList,
    ...Object.keys(stateMap).filter(k => stateMap[k] === 'depleted'),
  ]);

  const out = new Set();
  for (const key of keys) {
    if (depleted.has(key)) continue;
    const meta = RESOURCE_DATA[key];
    if (!meta) continue;
    out.add(key); // terrain-specific chains match on the resource key
    for (const c of (meta.commodities || [])) out.add(c); // generic chains match on the commodity token
  }
  if (out.size > 0) return [...out];
  return TERRAIN_DATA[terrainType]?.allowedResources?.slice() || [];
};

// ─── evaluateEconomicActivity ─────────────────────────────────────────────────
// Return resource chains that are active given the terrain and present resources.

// Normalized symmetric substring test: a nearby token 'iron' reconciles with a
// chain rawResource 'iron ore', and the resource key 'alpine_pasture' reconciles
// with rawResource 'alpine_pasture' — bridging the commodity- and key-keyed chain
// families. Underscores/whitespace collapse so 'stone_quarry' matches 'stone'.
const normalizeToken = (s) => String(s || '').toLowerCase().replace(/[_\s]+/g, ' ').trim();
const tokensReconcile = (a, b) => {
  const na = normalizeToken(a), nb = normalizeToken(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
};

const evaluateEconomicActivity = (terrainType, nearbyResources) => {
  const terrain = TERRAIN_DATA[terrainType];
  if (!terrain) return [];
  const active = [];
  Object.entries(RESOURCE_CHAINS).forEach(([chainKey, chain]) => {
    const terrainAllows  = terrain.allowedResources.some(r => r.toLowerCase().includes(chain.rawResource.toLowerCase()));
    const resourcePresent = nearbyResources.some(r => tokensReconcile(r, chain.rawResource));
    if (terrainAllows && resourcePresent) {
      active.push({ ...chain, chainKey });
    }
  });
  return active;
};

// ─── institutionSupportsChain ─────────────────────────────────────────────────
// Does this institution process this chain? Tag-first (real capability): anything
// carrying one of the chain's processingTags processes it, regardless of whether
// its NAME string matches a listed processor — "Weavers/Textile workers" processes
// the wool chain because it carries TAG.TEXTILE. The exact-name clause is the
// transitional fallback for chains with no distinct catalog capability tag (stone
// masonry, desert salt), matched against real catalog names — never the old
// phantom labels ('granar' etc.) that could match nothing.

export const institutionSupportsChain = (inst, chain) =>
  institutionHasAnyTag(inst, chain.processingTags || []) ||
  (chain.processingInstitutions || []).some(name => name === inst.name);

// ─── evaluateInstitutions ─────────────────────────────────────────────────────
// Classify each active resource chain by how well it is institutionally supported.

const evaluateInstitutions = (institutions, activeChains) => {
  const result = { fullyExploited: [], partiallyExploited: [], unexploited: [], warnings: [] };

  activeChains.forEach(chain => {
    // Count the institutions that can process this chain. ≥2 processors ⇒ the
    // chain runs end-to-end (raw → final goods); exactly 1 ⇒ a lone processor
    // (raw reaches an intermediate, not final goods); 0 ⇒ untapped.
    const supporters = institutions.filter(i => institutionSupportsChain(i, chain)).length;

    if (supporters === 0)     result.unexploited.push(chain);
    else if (supporters >= 2) result.fullyExploited.push(chain);
    else                      result.partiallyExploited.push(chain);
  });

  return result;
};

// ─── buildViabilityReport ─────────────────────────────────────────────────────
// Identify critical imports (things terrain cannot produce) and institution-resource mismatches.

const buildViabilityReport = (terrainType, institutions) => {
  const terrain = TERRAIN_DATA[terrainType];
  if (!terrain) return { critical: [], recommended: [], reasons: {} };

  const report = { critical: [], recommended: [], reasons: {} };

  // Terrain hard constraints: things this terrain type must import
  terrain.mustImport?.forEach(resource => {
    report.critical.push(resource);
    report.reasons[resource] = `${terrain.name} terrain cannot produce this locally`;
  });

  // Institution → resource mismatches: processing inst exists but terrain lacks the input
  Object.entries(RESOURCE_CHAINS).forEach(([, chain]) => {
    const hasProcessingInst = chain.processingInstitutions.some(name =>
      institutions.some(i => i.name === name));
    const terrainHasResource = terrain.allowedResources.some(r =>
      r.toLowerCase().includes(chain.rawResource.toLowerCase()));

    if (hasProcessingInst && !terrainHasResource) {
      report.critical.push(chain.rawResource);
      report.reasons[chain.rawResource] =
        `Required by ${chain.processingInstitutions[0]} but not available in ${terrain.name} terrain`;
    }
  });

  return report;
};

// ─── evaluateInstitutionDeps ──────────────────────────────────────────────────
// Build the list of export products based on exploitation level.

const evaluateInstitutionDeps = (exploitation, terrain) => {
  const exports = [];

  exploitation.fullyExploited?.forEach(chain => {
    exports.push({
      product: chain.finalProducts.join(', '),
      chain:   chain.rawResource,
      value:   chain.exportValue,
      reason:  'Complete production chain in place',
    });
  });

  exploitation.partiallyExploited?.forEach(chain => {
    exports.push({
      product: chain.intermediateGoods.join(', '),
      chain:   chain.rawResource,
      value:   'medium',
      reason:  'Partial processing - exports semi-finished goods',
    });
  });

  // Add terrain-specific economic strengths
  terrain.economicStrengths?.forEach(strength => {
    if (!exports.some(e => e.product.toLowerCase().includes(strength.toLowerCase()))) {
      exports.push({
        product: strength,
        chain:   'terrain-based',
        value:   'medium',
        reason:  `${terrain.name} terrain specialty`,
      });
    }
  });

  return exports;
};

// ─── evaluateInstitutionChain ─────────────────────────────────────────────────
// Identify gaps: missing processing links and institutions lacking their inputs.

const evaluateInstitutionChain = (exploitation, institutions) => {
  const gaps = [];

  exploitation.partiallyExploited?.forEach(chain => {
    const missingInsts = chain.processingInstitutions.filter(name =>
      !institutions.some(i => i.name === name));
    if (missingInsts.length > 0) {
      gaps.push({
        chain:   chain.rawResource,
        missing: missingInsts,
        impact:  'Cannot produce final goods, limited to intermediate products',
        severity: 'medium',
      });
    }
  });

  exploitation.unexploited?.forEach(chain => {
    gaps.push({
      chain:    chain.rawResource,
      missing:  chain.processingInstitutions,
      impact:   'Raw resource available but not being processed',
      severity: 'low',
    });
  });

  // Institutions that exist but whose resource inputs are missing
  institutions.forEach(institution => {
    Object.values(RESOURCE_CHAINS || {}).forEach(chain => {
      if (!chain.processingInstitutions?.includes(institution.name)) return;
      const alreadyInGaps =
        exploitation.fullyExploited?.some(c => c.rawResource === chain.rawResource) ||
        exploitation.partiallyExploited?.some(c => c.rawResource === chain.rawResource);
      if (!alreadyInGaps) {
        gaps.push({
          chain:       chain.rawResource,
          institution: institution.name,
          impact:      `${institution.name} exists but lacks access to ${chain.rawResource}`,
          severity:    'high',
        });
      }
    });
  });

  return gaps;
};

// ─── evaluateResourceChain ────────────────────────────────────────────────────
// Return enriched special resource feature data.

const evaluateResourceChain = (specialResourceKeys) => {
  if (!specialResourceKeys || specialResourceKeys.length === 0) return [];
  const result = [];
  specialResourceKeys.forEach(key => {
    const data = SPECIAL_RESOURCES[key];
    if (!data) return;
    result.push({
      feature:             data.name,
      description:         data.description,
      resources:           data.effects.resources || [],
      economicBoost:       data.effects.economicBoost,
      strategicImportance: data.effects.strategicImportance,
      special: {
        tourism:    data.effects.tourism,
        pilgrimage: data.effects.pilgrimage,
      },
    });
  });
  return result;
};

// ─── generateResourceAnalysis ─────────────────────────────────────────────────

/**
 * Generate the full resource analysis for a settlement.
 *
 * @param {string} terrainType      - e.g. 'crossroads', 'river', 'mountain'
 * @param {Array}  nearbyResources  - Resource keys present nearby
 * @param {Array}  specialResources - Special resource feature keys
 * @param {Array}  institutions     - Institution objects
 * @param {Object} config           - Settlement config with priorities
 * @returns {Object} Full resource analysis
 */
export const generateResourceAnalysis = (
  terrainType,
  nearbyResources,
  specialResources,
  institutions,
  config = {},
) => {
  const terrain = TERRAIN_DATA[terrainType];
  if (!terrain) {
    return {
      error:              'Invalid terrain type',
      availableResources: [],
      resourceChains:     [],
      exploitation:       {},
      imports:            {},
      exports:            [],
    };
  }

  const activeChains   = evaluateEconomicActivity(terrainType, nearbyResources);
  const exploitation   = evaluateInstitutions(institutions, activeChains);
  const imports        = buildViabilityReport(terrainType, institutions);
  const exports        = evaluateInstitutionDeps(exploitation, terrain);
  const gaps           = evaluateInstitutionChain(exploitation, institutions);
  const featureEffects = evaluateResourceChain(specialResources);

  const pri            = getPriorities(config);
  const priorityNotes  = [];

  // High economy priority + unexploited resources = trade opportunity note
  if (priorityToCategory(pri.economy) === 'very_high' || priorityToCategory(pri.economy) === 'high') {
    const unexploited = exploitation.unexploited || [];
    if (unexploited.length > 0) {
      priorityNotes.push(
        `Strong economic focus creates pressure to develop untapped ${unexploited[0].rawResource || 'resources'} — significant trade opportunity.`
      );
    }
  }

  // Low economy + partially exploited = underperformance note
  if ((priorityToCategory(pri.economy) === 'low' || priorityToCategory(pri.economy) === 'very_low') &&
      (exploitation.partiallyExploited?.length || 0) > 0) {
    priorityNotes.push(
      'Weak economic focus leaves several resource chains underdeveloped — production capacity exists but is not being realised.'
    );
  }

  // High military + missing strategic resources = vulnerability note
  if (priorityToCategory(pri.military) === 'high' || priorityToCategory(pri.military) === 'very_high') {
    const strategicGaps = (gaps || []).filter(g =>
      ['iron ore', 'timber', 'stone'].some(kw => g.rawResource?.toLowerCase().includes(kw))
    );
    if (strategicGaps.length > 0) {
      priorityNotes.push(
        `Military focus highlights gap: ${strategicGaps[0].rawResource} processing is incomplete — strategic vulnerability.`
      );
    }
  }

  return {
    terrain:          terrain.name,
    availableResources: nearbyResources,
    resourceChains:   activeChains,
    exploitation,
    imports,
    exports,
    gaps,
    featureEffects,
    economicStrengths: terrain.economicStrengths,
    strategicValue:   terrain.strategicValue,
    priorityNotes,
  };
};
