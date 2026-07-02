/**
 * domain/mapProfile.js — Map ↔ simulator interface.
 *
 * Map features (terrain, biome, rivers,
 * roads, regional danger) are already simulation inputs via
 * `config.*`. This module makes the interface explicit in BOTH
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
 * Pure read-only. Composes substrate (trade_connectivity,
 * defense_readiness), threats (hazard markers), and the
 * regional graph (authority hubs).
 *
 * No active map mutation here — this is the interface SHAPE map
 * renderers and the simulator both consume. Real bidirectional
 * mutation belongs to a UI/runtime layer that consumes this profile.
 */

import { deriveCausalState, defenseProfileHasWalls } from './causalState.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import { deriveRegionalGraph } from './regionalGraph.js';

// ── Output bands ─────────────────────────────────────────────────────────

const ROAD_IMPORTANCE_BANDS = Object.freeze(['low', 'moderate', 'major', 'critical']);
const DEFENSIVE_TERRAIN_BANDS = Object.freeze([
  'exposed', 'open', 'mixed', 'sheltered', 'fortified',
]);

// ── Input envelope ───────────────────────────────────────────────────────

/** @param {import('./settlement.schema.js').SimSettlement} settlement */
function deriveInputs(settlement) {
  const cfg = settlement.config || {};
  return {
    terrain:          cfg.terrain          || null,
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
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any} causal
 * @param {any[]} contributors
 */
function deriveRoadImportance(settlement, causal, contributors) {
  const trade = causal.scores?.trade_connectivity ?? 50;
  const access = settlement.config?.tradeRouteAccess;
  let band = 'low';
  if (access === 'major' || trade >= 70) {
    band = 'critical';
    contributors.push({ source: 'config.tradeRouteAccess+trade_connectivity', effect: 'critical', reason: 'Major trade route and high trade connectivity. Roads are critical.' });
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
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any} causal
 * @param {any[]} contributors
 */
function deriveDefensiveTerrain(settlement, causal, contributors) {
  const defense = causal.scores?.defense_readiness ?? 50;
  const terrain = settlement.config?.terrain || '';
  // Real walls only: read the classified walls DATA (or real institution names),
  // never a stringify regex — the profile always contains the literal key
  // "walls", so the old regex banded every settlement as walled.
  const hasWalls = defenseProfileHasWalls(settlement.defenseProfile)
                || (settlement.institutions || []).some((/** @type {any} */ i) => /wall|gate|fortress|citadel/i.test(String(i?.name || '')));

  let idx = 1; // 'open' baseline
  if (/mountain|highland|peak|cliff/i.test(terrain))  { idx = 3; contributors.push({ source: 'config.terrain', effect: 'highland', reason: 'Mountain / cliff terrain is sheltered.' }); }
  else if (/forest|wood|jungle/i.test(terrain))       { idx = 2; contributors.push({ source: 'config.terrain', effect: 'forest', reason: 'Forest terrain is mixed defensively.' }); }
  else if (/swamp|marsh|bog/i.test(terrain))          { idx = 2; contributors.push({ source: 'config.terrain', effect: 'wetland', reason: 'Swamp impedes attackers.' }); }
  else if (/plain|steppe|desert/i.test(terrain))      { idx = 0; contributors.push({ source: 'config.terrain', effect: 'open', reason: 'Plain / steppe / desert is exposed.' }); }
  else if (/coast|island|harbor|port/i.test(terrain)) { idx = 2; contributors.push({ source: 'config.terrain', effect: 'coast', reason: 'Coast / port is mixed.' }); }

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
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any[]} contributors
 */
function deriveRegionalAuthority(settlement, contributors) {
  /** @type {any} */
  const graph = deriveRegionalGraph(settlement);
  /** @type {any[]} */
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
      reason: `${authorities.length} authority link(s). Map should render hierarchy.`,
    });
  }
  return authorities;
}

// ── Output: hazardMarkers ───────────────────────────────────────────────

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any[]} contributors
 */
function deriveHazardMarkers(settlement, contributors) {
  const threats = deriveAllThreatProfiles(settlement);
  /** @type {any[]} */
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
      reason: `${out.length} threat(s) above moderate severity. Map should pin them.`,
    });
  }
  return out;
}

// ── Output: suggestedFeatures ───────────────────────────────────────────

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any} causal
 * @param {any[]} contributors
 */
function deriveSuggestedFeatures(settlement, causal, contributors) {
  /** @type {any[]} */
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
 * @param {Object} settlement
 * @returns {Object} MapProfile
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
  /** @type {any[]} */
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
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 */
export function summarizeMap(settlement) {
  /** @type {any} */
  const m = deriveMapProfile(settlement);
  return [
    `Inputs: terrain: ${m.inputs.terrain || 'unset'}; biome: ${m.inputs.biome || 'unset'}; trade access: ${m.inputs.tradeRouteAccess || 'unset'}; monster threat: ${m.inputs.monsterThreat || 'unset'}.`,
    `Roads: ${m.outputs.roadImportance} importance.`,
    `Terrain defense: ${m.outputs.defensiveTerrain}.`,
    `Regional authorities: ${m.outputs.regionalAuthority.length}.`,
    `Hazards pinned: ${m.outputs.hazardMarkers.length}.`,
    `Suggested features: ${m.outputs.suggestedFeatures.map((/** @type {any} */ f) => f.feature).join(', ') || 'none'}.`,
  ];
}
