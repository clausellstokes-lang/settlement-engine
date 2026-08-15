/**
 * domain/contradictions.js — Structured anomaly detection + classification.
 *
 * Tier 4.18 of the roadmap. Detects places where the settlement has
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
 * Pure read-only. Composes Phase 9 factions, Phase 17 substrate,
 * Phase 20 threats, Phase 21 capacities.
 */

import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveCausalState } from './causalState.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import { deriveAllCapacities } from './capacityModel.js';

/** @typedef {import('./causalState.js').CausalState} CausalState */
/** @typedef {import('./capacityModel.js').CapacityState} CapacityState */
/** @typedef {import('./threatProfile.js').ThreatProfile} ThreatProfile */
/** @typedef {import('./factionProfile.js').FactionProfile} FactionProfile */

/** @typedef {'invalid'|'rare_but_justified'|'interesting_tension'|'user_authored_exception'} ContradictionClassification */

/**
 * @typedef {Object} ContradictionReference
 * @property {string} id
 * @property {string} label
 * @property {string} type
 */

/**
 * @typedef {Object} Contradiction
 * @property {string} id
 * @property {string} type
 * @property {ContradictionClassification} classification
 * @property {string} description
 * @property {string} explanation
 * @property {string[]} consequences
 * @property {ContradictionReference[]} references
 */

/**
 * The slice of a settlement the detectors read.
 * @typedef {Object} ContradictionSettlement
 * @property {string} [tier]
 * @property {Array<{ id?: string, name?: string }|null>} [institutions]
 */

/**
 * The full input the composer accepts: the local slice plus the slices the
 * composed derivations (threats, capacities) declare for themselves.
 * @typedef {ContradictionSettlement
 *   & import('./threatProfile.js').ThreatSurfaceSettlement
 *   & import('./capacityModel.js').SettlementLike
 *   & import('./causalState.js').CausalSettlementSource} ContradictionSettlementInput
 */

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

/**
 * @param {string} s
 * @returns {string}
 */
function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

/**
 * @param {string} type
 * @param {string} suffix
 * @returns {string}
 */
function contradictionId(type, suffix) {
  return `contradiction.${type}.${snakeCase(suffix || 'unknown')}`;
}

/**
 * @param {Object} args
 * @param {string} args.type
 * @param {ContradictionClassification} args.classification
 * @param {string} args.description
 * @param {string} args.explanation
 * @param {string[]} [args.consequences]
 * @param {ContradictionReference[]} [args.references]
 * @returns {Contradiction}
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

/**
 * @param {ContradictionSettlement} settlement
 * @returns {Contradiction[]}
 */
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
      // @ts-ignore -- inst.name is non-empty here: the OVERSIZED_PATTERN guard
      // above only passes named institutions, which TS cannot see through test().
      references: [{ id: inst.id || `institution.${snakeCase(inst.name)}`, label: inst.name, type: 'institution' }],
    }));
  }
  return out;
}

/**
 * @param {ContradictionSettlement} settlement
 * @returns {Contradiction[]}
 */
function detectMissingEnforcement(settlement) {
  const tier = settlement.tier;
  if (tier !== 'town' && tier !== 'city') return [];
  const inst = settlement.institutions || [];
  const hasEnforcement = inst.some(i => ENFORCEMENT_PATTERN.test(String(i?.name || '')));
  if (hasEnforcement) return [];
  return [contradiction({
    type: 'missing_enforcement_for_tier',
    classification: 'rare_but_justified',
    description: `${tier} without an enforcement institution`,
    explanation: `A ${tier} normally maintains some form of watch, militia, or garrison. Its absence implies either a non-coercive governance model (religious peace, council mediation) or hidden enforcement (informal violence, patronage networks).`,
    consequences: [
      'order is maintained informally — by faction patronage, religious authority, or fear',
      'outside intervention is the only response to organized violence',
      'criminal opportunity rises silently',
    ],
    references: [],
  })];
}

/**
 * @param {ContradictionSettlement} settlement
 * @param {CausalState} causal
 * @returns {Contradiction[]}
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
      explanation: 'The governing order enjoys public approval, yet criminal networks operate openly. The two coexist because crime serves the order, not against it — smuggling pays taxes, the watch takes a share, the council looks elsewhere.',
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
 * @param {ContradictionSettlement} settlement
 * @param {FactionProfile[]} profiles
 * @returns {Contradiction[]}
 */
function detectOrphanedFactionPower(settlement, profiles) {
  /** @type {Contradiction[]} */
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
    const supporting = inst.some(i => pattern.test(String(i?.name || '')));
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
 * @param {ContradictionSettlement} settlement
 * @param {CausalState} causal
 * @param {CapacityState} capacities
 * @returns {Contradiction[]}
 */
function detectSurplusButCritical(settlement, causal, capacities) {
  /** @type {Contradiction[]} */
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
        explanation: `The substrate shows abundance in ${pair}, but the underlying capacity model says supply is overwhelmed by demand. The surplus is being consumed in real time — what's measured is the flow, not the reserve.`,
        consequences: [
          `${pair} surplus is fragile — any shock removes the buffer immediately`,
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
 * @param {ContradictionSettlement} settlement
 * @param {ThreatProfile[]} threats
 * @param {CapacityState} capacities
 * @returns {Contradiction[]}
 */
function detectThreatWithoutResponse(settlement, threats, capacities) {
  /** @type {Contradiction[]} */
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
 * @param {ContradictionSettlementInput|null|undefined} settlement
 * @returns {Contradiction[]}
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
 * @param {ContradictionSettlementInput|null|undefined} settlement
 * @returns {Record<ContradictionClassification, number>}
 */
export function contradictionBreakdown(settlement) {
  const out = { invalid: 0, rare_but_justified: 0, interesting_tension: 0, user_authored_exception: 0 };
  for (const c of detectContradictions(settlement)) {
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
