/**
 * domain/contradictions.js — Structured anomaly detection + classification.
 *
 * Detects places where the settlement has
 * structural mismatches — outsized institutions for tier, missing
 * enforcement, factional power without supporting institutions, etc.
 * Each contradiction gets a classification + a structured
 * justification consumers can render.
 *
 *   detectContradictions(settlement) -> Contradiction[]
 *
 * Classifications:
 *   invalid                  — broken state, shouldn't happen
 *   rare_but_justified       — unusual but explicable
 *   interesting_tension      — narrative-worthy contradiction
 *   user_authored_exception  — user explicitly added this
 *
 * Pure read-only. Composes factions, substrate,
 * threats, capacities.
 */

import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveCausalState } from './causalState.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import { deriveAllCapacities } from './capacityModel.js';

export const CONTRADICTION_CLASSIFICATIONS = Object.freeze([
  'invalid',
  'rare_but_justified',
  'interesting_tension',
  'user_authored_exception',
]);

export const CONTRADICTION_TYPES = Object.freeze([
  'oversized_institution_for_tier',
  'missing_enforcement_for_tier',
  'legitimacy_vs_crime_mismatch',
  'orphaned_faction_power',
  'surplus_but_capacity_critical',
  'threat_without_response',
]);

// ── Helpers ──────────────────────────────────────────────────────────────

/** @param {any} s */
function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

/**
 * @param {any} type
 * @param {any} suffix
 */
function contradictionId(type, suffix) {
  return `contradiction.${type}.${snakeCase(suffix || 'unknown')}`;
}

/**
 * @param {{ type: any, classification: any, description: any, explanation: any, consequences?: any, references?: any }} args
 */
function contradiction({ type, classification, description, explanation, consequences, references }) {
  return {
    id: contradictionId(type, description || ''),
    type,
    classification,
    description,
    explanation,
    consequences: consequences || [],
    references: references || [],
  };
}

// ── Detectors ────────────────────────────────────────────────────────────

const OVERSIZED_PATTERN = /(cathedral|grand|college|conclave|fortress|citadel|palace|university)/i;
const ENFORCEMENT_PATTERN = /(watch|garrison|barracks|militia|guard|constabulary|sheriff)/i;

/** @param {any} settlement */
function detectOversizedInstitutions(settlement) {
  const tier = settlement.tier;
  if (tier !== 'village' && tier !== 'hamlet') return [];
  const out = [];
  for (const inst of (settlement.institutions || [])) {
    if (!inst || !OVERSIZED_PATTERN.test(String(inst.name || ''))) continue;
    out.push(contradiction({
      type: 'oversized_institution_for_tier',
      classification: 'interesting_tension',
      description: `${tier} contains ${inst.name}`,
      explanation: `${inst.name} is an outsized institution for a ${tier}; it is likely sustained by external patronage, pilgrimage, or distant resources rather than local economy.`,
      consequences: [
        `${inst.name} dominates the local economy`,
        'authority structure tilts toward the institution\'s patrons',
        'visitors and pilgrims outnumber locals in season',
      ],
      references: [{ id: inst.id || `institution.${snakeCase(inst.name)}`, label: inst.name, type: 'institution' }],
    }));
  }
  return out;
}

/** @param {any} settlement */
function detectMissingEnforcement(settlement) {
  const tier = settlement.tier;
  if (tier !== 'town' && tier !== 'city') return [];
  const inst = settlement.institutions || [];
  const hasEnforcement = inst.some((/** @type {any} */ i) => ENFORCEMENT_PATTERN.test(String(i?.name || '')));
  if (hasEnforcement) return [];
  return [contradiction({
    type: 'missing_enforcement_for_tier',
    classification: 'rare_but_justified',
    description: `${tier} without an enforcement institution`,
    explanation: `A ${tier} normally maintains some form of watch, militia, or garrison. Its absence implies either a non-coercive governance model (religious peace, council mediation) or hidden enforcement (informal violence, patronage networks).`,
    consequences: [
      'order is maintained informally: by faction patronage, religious authority, or fear',
      'outside intervention is the only response to organized violence',
      'criminal opportunity rises silently',
    ],
    references: [],
  })];
}

/**
 * @param {any} settlement
 * @param {any} causal
 */
function detectLegitimacyVsCrime(settlement, causal) {
  const legBand = causal.bands.public_legitimacy;
  const crimScore = causal.scores.criminal_opportunity ?? 50;
  // High legitimacy AND high criminal opportunity is the contradiction.
  if ((legBand === 'surplus' || legBand === 'adequate') && crimScore >= 65) {
    return [contradiction({
      type: 'legitimacy_vs_crime_mismatch',
      classification: 'interesting_tension',
      description: 'High public legitimacy alongside high criminal opportunity',
      explanation: 'The governing order enjoys public approval, yet criminal networks operate openly. The two coexist because crime serves the order, not against it: smuggling pays taxes, the watch takes a share, the council looks elsewhere.',
      consequences: [
        'corruption ties governance to crime',
        'reform attempts threaten both',
        'outsiders who expect either rule-of-law or open vice find neither',
      ],
      references: [
        { id: 'var.public_legitimacy', label: 'Public legitimacy', type: 'system_variable' },
        { id: 'var.criminal_opportunity', label: 'Criminal opportunity', type: 'system_variable' },
      ],
    })];
  }
  return [];
}

/**
 * @param {any} settlement
 * @param {any[]} profiles
 */
function detectOrphanedFactionPower(settlement, profiles) {
  const out = [];
  const inst = settlement.institutions || [];
  const RELIGIOUS_INST = /(temple|chapel|monastery|abbey|cathedral|shrine|sanctum)/i;
  const MILITARY_INST = /(watch|garrison|barracks|militia|guard|fortress|citadel)/i;
  const ARCANE_INST = /(tower|college|conclave|circle|enclave|atheneum)/i;

  for (const p of profiles) {
    const power = p.power || 0;
    if (power < 35) continue;
    let pattern = null, label = null;
    if (p.archetype === 'religious') { pattern = RELIGIOUS_INST; label = 'religious institution'; }
    else if (p.archetype === 'military') { pattern = MILITARY_INST; label = 'military institution'; }
    else if (p.archetype === 'arcane') { pattern = ARCANE_INST; label = 'arcane institution'; }
    if (!pattern) continue;
    const supporting = inst.some((/** @type {any} */ i) => pattern.test(String(i?.name || '')));
    if (supporting) continue;
    out.push(contradiction({
      type: 'orphaned_faction_power',
      classification: 'rare_but_justified',
      description: `${p.name} holds power ${power} without a supporting ${label}`,
      explanation: `${p.name} commands ${p.archetype} influence at ${power}/100, yet no ${label} appears on the settlement roster. Power is sustained by traveling clergy / mercenary contracts / external sponsorship rather than local infrastructure.`,
      consequences: [
        `${p.name} depends on outside support to maintain its position`,
        'a disruption of that support would collapse the faction\'s standing rapidly',
      ],
      references: [{ id: p.id, label: p.name, type: 'faction' }],
    }));
  }
  return out;
}

/**
 * @param {any} settlement
 * @param {any} causal
 * @param {any} capacities
 */
function detectSurplusButCritical(settlement, causal, capacities) {
  const out = [];
  // food_security surplus but food_production capacity critical/collapsed — the
  // two layers tell different stories. Surface as a tension worth telling.
  for (const [substrate, capacity, pair] of [
    ['food_security',     'food_production', 'food'],
    ['healing_capacity',  'healing',         'healing'],
    ['defense_readiness', 'defense',         'defense'],
  ]) {
    const substrateBand = causal.bands[substrate];
    const capacityBand  = capacities.bands[capacity];
    if (substrateBand === 'surplus' && (capacityBand === 'critical' || capacityBand === 'collapsed')) {
      out.push(contradiction({
        type: 'surplus_but_capacity_critical',
        classification: 'interesting_tension',
        description: `${substrate} reads surplus while ${capacity} capacity is ${capacityBand}`,
        explanation: `The substrate shows abundance in ${pair}, but the underlying capacity model says supply is overwhelmed by demand. The surplus is being consumed in real time. What's measured is the flow, not the reserve.`,
        consequences: [
          `${pair} surplus is fragile. Any shock removes the buffer immediately`,
          `the ${pair} system has no slack to absorb the next surprise`,
        ],
        references: [
          { id: `var.${substrate}`, label: substrate.replace(/_/g, ' '), type: 'system_variable' },
          { id: `capacity.${capacity}`, label: capacity.replace(/_/g, ' '), type: 'capacity' },
        ],
      }));
    }
  }
  return out;
}

/**
 * @param {any} settlement
 * @param {any[]} threats
 * @param {any} capacities
 */
function detectThreatWithoutResponse(settlement, threats, capacities) {
  const out = [];
  for (const threat of threats) {
    if (threat.severity < 0.6) continue;  // only acute threats
    // Match the threat to its expected response capacity
    let neededCapacity = null;
    if (['monster_pressure', 'siege', 'bandit_raids', 'rival_neighbor'].includes(threat.type)) {
      neededCapacity = 'defense';
    } else if (threat.type === 'plague') {
      neededCapacity = 'healing';
    } else if (threat.type === 'famine') {
      neededCapacity = 'food_production';
    } else if (['arcane_instability', 'cult'].includes(threat.type)) {
      neededCapacity = 'magical';
    }
    if (!neededCapacity) continue;
    const band = capacities.bands[neededCapacity];
    if (band !== 'critical' && band !== 'collapsed') continue;
    out.push(contradiction({
      type: 'threat_without_response',
      classification: 'interesting_tension',
      description: `${threat.label} threatens at ${threat.severityBand} but ${neededCapacity} capacity is ${band}`,
      explanation: `${threat.label} demands a ${neededCapacity} response the settlement cannot mount. The threat will not wait for the capacity to recover.`,
      consequences: [
        `${threat.label} will likely worsen unless outside support arrives`,
        `improvised responses (volunteers, militia, ad-hoc relief) carry their own risks`,
      ],
      references: [
        { id: threat.id, label: threat.label, type: 'threat' },
        { id: `capacity.${neededCapacity}`, label: neededCapacity, type: 'capacity' },
      ],
    }));
  }
  return out;
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Detect every contradiction on a settlement. Pure read-only.
 *
 * @param {Object} settlement
 * @returns {Object[]} Contradiction[]
 */
export function detectContradictions(settlement) {
  if (!settlement) return [];
  const profiles   = deriveAllFactionProfiles(settlement);
  const causal     = deriveCausalState(settlement);
  const threats    = deriveAllThreatProfiles(settlement);
  const capacities = deriveAllCapacities(settlement);
  return [
    ...detectOversizedInstitutions(settlement),
    ...detectMissingEnforcement(settlement),
    ...detectLegitimacyVsCrime(settlement, causal),
    ...detectOrphanedFactionPower(settlement, profiles),
    ...detectSurplusButCritical(settlement, causal, capacities),
    ...detectThreatWithoutResponse(settlement, threats, capacities),
  ];
}

/**
 * Group by classification.
 * @param {any} settlement
 */
export function contradictionBreakdown(settlement) {
  /** @type {Record<string, number>} */
  const out = { invalid: 0, rare_but_justified: 0, interesting_tension: 0, user_authored_exception: 0 };
  for (const c of /** @type {any[]} */ (detectContradictions(settlement))) {
    if (out[c.classification] !== undefined) out[c.classification] += 1;
  }
  return out;
}

/** Catalog accessors. */
export function supportedContradictionTypes() {
  return [...CONTRADICTION_TYPES];
}
export function supportedClassifications() {
  return [...CONTRADICTION_CLASSIFICATIONS];
}
