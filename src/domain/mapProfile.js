/**
 * domain/mapProfile.js — Map ↔ simulator interface.
 *
 * Tier 4.14 of the roadmap. Map features (terrain, biome, rivers,
 * roads, regional danger) are already simulation inputs via
 * `config.*`. Phase 31 makes the interface explicit in BOTH
 * directions:
 *
 *   inputs:  what the simulator reads from map-derived config
 *   outputs: what the map should render from simulator state
 *
 *   deriveMapProfile(settlement) -> {
 *     inputs: { terrain, biome, riverAccess, roadAccess, tradeRouteAccess,
 *               monsterThreat, region },
 *     outputs: {
 *       roadImportance,           low | moderate | major | critical
 *       defensiveTerrain,         exposed | open | mixed | sheltered | fortified
 *       regionalAuthority[],      neighbour ids this settlement defers to
 *       hazardMarkers[],          structured pins the map should render
 *       suggestedFeatures[],      features the map should add
 *     },
 *     contributors[]
 *   }
 *
 * Pure read-only. Composes Phase 17 substrate (trade_connectivity,
 * defense_readiness), Phase 20 threats (hazard markers), and Phase 30
 * regional graph (authority hubs).
 *
 * No active map mutation here — this is the interface SHAPE map
 * renderers and the simulator both consume. Real bidirectional
 * mutation belongs to a UI/runtime layer that consumes this profile.
 */

import { deriveCausalState } from './causalState.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import { deriveRegionalGraph } from './regionalGraph.js';
import { resolveTerrain } from './resolveTerrain.js';

/** @typedef {import('./causalState.js').CausalState} CausalState */

/**
 * Settlement view this module reads. Config keys are declared broadly so
 * the object stays structurally assignable to the source shapes that
 * {@link deriveRegionalGraph} and {@link deriveAllThreatProfiles} accept.
 * @typedef {Object} MapSettlement
 * @property {string} [id]
 * @property {string} [name]
 * @property {{ terrain?: string, biome?: string, riverAccess?: string, river?: string,
 *   roadAccess?: string, road?: string, tradeRouteAccess?: string, monsterThreat?: string,
 *   region?: string, magicLevel?: string, priorityMagic?: number, magicExists?: boolean }} [config]
 * @property {Object} [defenseProfile]
 * @property {Array<{ name?: string }>} [institutions]
 */

/**
 * One provenance entry appended to the contributors list.
 * @typedef {Object} MapContributor
 * @property {string} source
 * @property {string} effect
 * @property {string} reason
 */

/**
 * @typedef {Object} MapProfileInputs
 * @property {string|null} terrain
 * @property {string|null} biome
 * @property {string|null} riverAccess
 * @property {string|null} roadAccess
 * @property {string|null} tradeRouteAccess
 * @property {string|null} monsterThreat
 * @property {string|null} region
 */

/**
 * @typedef {Object} RegionalAuthorityEntry
 * @property {string} id
 * @property {string} name
 * @property {string} relationshipType
 */

/**
 * @typedef {Object} HazardMarker
 * @property {string} id
 * @property {string} label
 * @property {string} kind
 * @property {number} severity
 * @property {string} severityBand
 * @property {string} visibility
 */

/**
 * @typedef {Object} SuggestedFeature
 * @property {string} feature
 * @property {string} reason
 */

/**
 * @typedef {Object} MapProfileOutputs
 * @property {string} roadImportance
 * @property {string} defensiveTerrain
 * @property {RegionalAuthorityEntry[]} regionalAuthority
 * @property {HazardMarker[]} hazardMarkers
 * @property {SuggestedFeature[]} suggestedFeatures
 */

/**
 * @typedef {Object} MapProfile
 * @property {MapProfileInputs} inputs
 * @property {MapProfileOutputs} outputs
 * @property {MapContributor[]} contributors
 */

// ── Output bands ─────────────────────────────────────────────────────────

const ROAD_IMPORTANCE_BANDS = Object.freeze(['low', 'moderate', 'major', 'critical']);
const DEFENSIVE_TERRAIN_BANDS = Object.freeze([
  'exposed', 'open', 'mixed', 'sheltered', 'fortified',
]);

// ── Input envelope ───────────────────────────────────────────────────────

/**
 * @param {MapSettlement} settlement
 * @returns {MapProfileInputs}
 */
function deriveInputs(settlement) {
  const cfg = settlement.config || {};
  return {
    terrain:          resolveTerrain(cfg),
    biome:            cfg.biome            || null,
    riverAccess:      cfg.riverAccess      || cfg.river || null,
    roadAccess:       cfg.roadAccess       || cfg.road  || null,
    tradeRouteAccess: cfg.tradeRouteAccess || null,
    monsterThreat:    cfg.monsterThreat    || null,
    region:           cfg.region           || null,
  };
}

// ── Output: roadImportance ──────────────────────────────────────────────

/**
 * @param {MapSettlement} settlement
 * @param {CausalState} causal
 * @param {MapContributor[]} contributors
 * @returns {string}
 */
function deriveRoadImportance(settlement, causal, contributors) {
  const trade = causal.scores?.trade_connectivity ?? 50;
  const access = settlement.config?.tradeRouteAccess;
  let band = 'low';
  if (access === 'major' || trade >= 70) {
    band = 'critical';
    contributors.push({ source: 'config.tradeRouteAccess+trade_connectivity', effect: 'critical', reason: 'Major trade route AND high trade connectivity — roads are critical.' });
  } else if (access === 'minor' || access === 'standard' || access === 'road' || trade >= 55) {
    band = 'major';
    contributors.push({ source: 'config.tradeRouteAccess+trade_connectivity', effect: 'major', reason: 'Settled trade route presence; roads are major.' });
  } else if (trade >= 35) {
    band = 'moderate';
    contributors.push({ source: 'var.trade_connectivity', effect: 'moderate', reason: 'Some trade connectivity; roads are moderate.' });
  } else {
    contributors.push({ source: 'var.trade_connectivity', effect: 'low', reason: 'Limited trade connectivity; roads are low importance.' });
  }
  return band;
}

// ── Output: defensiveTerrain ────────────────────────────────────────────

/**
 * @param {MapSettlement} settlement
 * @param {CausalState} causal
 * @param {MapContributor[]} contributors
 * @returns {string}
 */
function deriveDefensiveTerrain(settlement, causal, contributors) {
  const defense = causal.scores?.defense_readiness ?? 50;
  const terrain = resolveTerrain(settlement.config) || '';
  const hasWalls = /\bwall|\brampart|\bpalisade/i.test(JSON.stringify(settlement.defenseProfile || {}))
                || (settlement.institutions || []).some(i => /wall|gate|fortress|citadel/i.test(String(i?.name || '')));

  let idx = 1; // 'open' baseline
  if (/mountain|highland|peak|cliff/i.test(terrain))  { idx = 3; contributors.push({ source: 'config.terrainType', effect: 'highland', reason: 'Mountain / cliff terrain is sheltered.' }); }
  else if (/hill/i.test(terrain))                     { idx = 2; contributors.push({ source: 'config.terrainType', effect: 'highland', reason: 'Hill country favours the defender; mixed.' }); }
  else if (/forest|wood|jungle/i.test(terrain))       { idx = 2; contributors.push({ source: 'config.terrainType', effect: 'forest', reason: 'Forest terrain is mixed defensively.' }); }
  else if (/swamp|marsh|bog/i.test(terrain))          { idx = 2; contributors.push({ source: 'config.terrainType', effect: 'wetland', reason: 'Swamp impedes attackers.' }); }
  else if (/plain|steppe|desert|grass/i.test(terrain)){ idx = 0; contributors.push({ source: 'config.terrainType', effect: 'open', reason: 'Plain / steppe / desert is exposed.' }); }
  else if (/coast|island|harbor|port/i.test(terrain)) { idx = 2; contributors.push({ source: 'config.terrainType', effect: 'coast', reason: 'Coast / port is mixed.' }); }
  else if (/river|lake|fjord/i.test(terrain))         { idx = 2; contributors.push({ source: 'config.terrainType', effect: 'riverside', reason: 'A river guards a flank; mixed.' }); }

  if (hasWalls && defense >= 55) {
    idx = Math.max(idx, 4);
    contributors.push({ source: 'institutions+defense_readiness', effect: 'fortified', reason: 'Walls plus high readiness yields fortified terrain.' });
  } else if (hasWalls) {
    idx = Math.max(idx, 3);
    contributors.push({ source: 'institutions.walls', effect: 'sheltered', reason: 'Walls present; sheltered.' });
  }

  return DEFENSIVE_TERRAIN_BANDS[Math.max(0, Math.min(DEFENSIVE_TERRAIN_BANDS.length - 1, idx))];
}

// ── Output: regionalAuthority ───────────────────────────────────────────

/**
 * @param {MapSettlement} settlement
 * @param {MapContributor[]} contributors
 * @returns {RegionalAuthorityEntry[]}
 */
function deriveRegionalAuthority(settlement, contributors) {
  const graph = deriveRegionalGraph(settlement);
  const authorities = [];
  for (const link of graph.links) {
    if (link.relationshipType === 'tax_authority'
     || link.relationshipType === 'religious_superior'
     || link.relationshipType === 'protector') {
      authorities.push({
        id: link.to,
        name: link.toName,
        relationshipType: link.relationshipType,
      });
    }
  }
  if (authorities.length) {
    contributors.push({
      source: 'regionalGraph',
      effect: 'authority_detected',
      reason: `${authorities.length} authority link(s) — map should render hierarchy.`,
    });
  }
  return authorities;
}

// ── Output: hazardMarkers ───────────────────────────────────────────────

/**
 * @param {MapSettlement} settlement
 * @param {MapContributor[]} contributors
 * @returns {HazardMarker[]}
 */
function deriveHazardMarkers(settlement, contributors) {
  const threats = deriveAllThreatProfiles(settlement);
  const out = [];
  for (const t of threats) {
    if (t.severity < 0.4) continue;
    out.push({
      id: t.id,
      label: t.label,
      kind: t.type,
      severity: t.severity,
      severityBand: t.severityBand,
      visibility: t.visibility,
    });
  }
  if (out.length) {
    contributors.push({
      source: 'threatProfile',
      effect: 'hazards_present',
      reason: `${out.length} threat(s) above moderate severity — map should pin them.`,
    });
  }
  return out;
}

// ── Output: suggestedFeatures ───────────────────────────────────────────

/**
 * @param {MapSettlement} settlement
 * @param {CausalState} causal
 * @param {MapContributor[]} contributors
 * @returns {SuggestedFeature[]}
 */
function deriveSuggestedFeatures(settlement, causal, contributors) {
  const out = [];
  // Walls suggested for fortified-ish defense bands
  const def = causal.scores?.defense_readiness ?? 50;
  if (def >= 60) {
    out.push({ feature: 'walls', reason: 'High defense readiness suggests walls / fortifications worth rendering prominently.' });
  }
  // Trade roads
  const trade = causal.scores?.trade_connectivity ?? 50;
  if (trade >= 60) {
    out.push({ feature: 'major_road', reason: 'High trade connectivity suggests major road / route to a hub.' });
  }
  // Religious procession routes if religious authority high
  const rel = causal.scores?.religious_authority ?? 50;
  if (rel >= 60) {
    out.push({ feature: 'shrine_path', reason: 'High religious authority suggests procession / shrine path features.' });
  }
  if (out.length) {
    contributors.push({
      source: 'causalState',
      effect: 'features_suggested',
      reason: `${out.length} map feature(s) suggested by substrate.`,
    });
  }
  return out;
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Derive the structured MapProfile.
 *
 * @param {MapSettlement} settlement
 * @returns {MapProfile}
 */
export function deriveMapProfile(settlement) {
  if (!settlement) {
    return {
      inputs:  { terrain: null, biome: null, riverAccess: null, roadAccess: null, tradeRouteAccess: null, monsterThreat: null, region: null },
      outputs: { roadImportance: 'low', defensiveTerrain: 'open', regionalAuthority: [], hazardMarkers: [], suggestedFeatures: [] },
      contributors: [],
    };
  }

  const causal = deriveCausalState(settlement);
  /** @type {MapContributor[]} */
  const contributors = [];

  return {
    inputs: deriveInputs(settlement),
    outputs: {
      roadImportance:    deriveRoadImportance(settlement, causal, contributors),
      defensiveTerrain:  deriveDefensiveTerrain(settlement, causal, contributors),
      regionalAuthority: deriveRegionalAuthority(settlement, contributors),
      hazardMarkers:     deriveHazardMarkers(settlement, contributors),
      suggestedFeatures: deriveSuggestedFeatures(settlement, causal, contributors),
    },
    contributors,
  };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

export function roadImportanceBands()    { return [...ROAD_IMPORTANCE_BANDS]; }
export function defensiveTerrainBands()  { return [...DEFENSIVE_TERRAIN_BANDS]; }

/**
 * Human-readable summary.
 * @param {MapSettlement} settlement
 * @returns {string[]}
 */
export function summarizeMap(settlement) {
  const m = deriveMapProfile(settlement);
  return [
    `Inputs — terrain: ${m.inputs.terrain || 'unset'}; biome: ${m.inputs.biome || 'unset'}; trade access: ${m.inputs.tradeRouteAccess || 'unset'}; monster threat: ${m.inputs.monsterThreat || 'unset'}.`,
    `Roads — ${m.outputs.roadImportance} importance.`,
    `Terrain defense — ${m.outputs.defensiveTerrain}.`,
    `Regional authorities — ${m.outputs.regionalAuthority.length}.`,
    `Hazards pinned — ${m.outputs.hazardMarkers.length}.`,
    `Suggested features — ${m.outputs.suggestedFeatures.map(f => f.feature).join(', ') || 'none'}.`,
  ];
}
