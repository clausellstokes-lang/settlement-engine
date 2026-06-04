/**
 * resourceGenerator.js
 * Resource chain analysis and availability reporting.
 */

import {getPriorities} from './helpers.js';
import {priorityToCategory} from './economicGenerator.js';
import {TERRAIN_DATA} from '../data/geographyData.js';
import {RESOURCE_CHAINS, SPECIAL_RESOURCES} from '../data/resourceData.js';

// ─── evaluateEconomicActivity ─────────────────────────────────────────────────
// Return resource chains that are active given the terrain and present resources.

const evaluateEconomicActivity = (terrainType, nearbyResources) => {
  const terrain = TERRAIN_DATA[terrainType];
  if (!terrain) return [];
  const active = [];
  Object.entries(RESOURCE_CHAINS).forEach(([chainKey, chain]) => {
    const terrainAllows  = terrain.allowedResources.some(r => r.toLowerCase().includes(chain.rawResource.toLowerCase()));
    const resourcePresent = nearbyResources.includes(chain.rawResource);
    if (terrainAllows && resourcePresent) {
      active.push({ ...chain, chainKey });
    }
  });
  return active;
};

// ─── evaluateInstitutions ─────────────────────────────────────────────────────
// Classify each active resource chain by how well it is institutionally supported.

const evaluateInstitutions = (institutions, activeChains) => {
  const result = { fullyExploited: [], partiallyExploited: [], unexploited: [], warnings: [] };

  activeChains.forEach(chain => {
    const hasAll  = chain.processingInstitutions.every(name => institutions.some(i => i.name === name));
    const hasSome = chain.processingInstitutions.some(name => institutions.some(i => i.name === name));

    if (hasAll)       result.fullyExploited.push(chain);
    else if (hasSome) result.partiallyExploited.push(chain);
    else              result.unexploited.push(chain);
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
