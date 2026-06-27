/**
 * domain/qualitativeBands.js — Unified band accessor + display labels.
 *
 * The substrate, capacities, conditions, threats, and chain
 * states all use canonical bands internally. This module
 * exposes a single accessor consumers can use to read the band for
 * any reference, plus a display-label mapping so UI surfaces show
 * "Legitimacy: Contested" instead of "public_legitimacy: 37".
 *
 *   bandFor(ref, settlement) -> string | null
 *   displayBandLabel(domain, band) -> string
 *   displayValueFor(ref, settlement) -> string  ("Contested" not 37)
 *
 * Pure read-only. Composes causalState, capacities, supply chains,
 * conditions, threats, and districts.
 */

import { deriveCausalState, SYSTEM_VARIABLES } from './causalState.js';
import { deriveCapacityProfile, CAPACITY_NAMES } from './capacityModel.js';
import { deriveAllSupplyChainStates } from './supplyChainState.js';
import { findActiveCondition } from './activeConditions.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import { deriveAllDistricts } from './districtProfile.js';

// ── Display label maps ──────────────────────────────────────────────────
//
// One per "domain" (substrate / capacity / chain / condition / threat /
// district-wealth / district-safety). The internal band names stay
// canonical; consumers can opt into the display labels for user-facing
// surfaces.

const DISPLAY_LABELS = Object.freeze({
  // substrate / capacities share the same 5-band
  // vocabulary. The roadmap example "Legitimacy: Contested" implies
  // a band-name remap for user-facing display; the table below picks
  // labels that read well across substrate variables and capacities.
  substrate: {
    surplus:   'Abundant',
    adequate:  'Steady',
    strained:  'Contested',
    critical:  'Failing',
    collapsed: 'Collapsed',
  },
  capacity: {
    surplus:   'Abundant',
    adequate:  'Steady',
    strained:  'Stretched',
    critical:  'Overwhelmed',
    collapsed: 'Collapsed',
  },
  // supply chain statuses.
  chain: {
    stable:      'Stable',
    strained:    'Strained',
    scarce:      'Scarce',
    blocked:     'Blocked',
    captured:    'Captured',
    substituted: 'Substituted',
    collapsing:  'Collapsing',
  },
  // condition severity bands.
  condition: {
    low:      'Minor',
    medium:   'Notable',
    high:     'Severe',
    critical: 'Critical',
  },
  // threat severity bands.
  threat: {
    low:      'Distant',
    medium:   'Present',
    high:     'Acute',
    critical: 'Imminent',
  },
  // district wealth.
  district_wealth: {
    destitute:   'Destitute',
    poor:        'Poor',
    modest:      'Modest',
    comfortable: 'Comfortable',
    wealthy:     'Wealthy',
    opulent:     'Opulent',
  },
  // district safety.
  district_safety: {
    lawless:    'Lawless',
    unsafe:     'Unsafe',
    watched:    'Watched',
    orderly:    'Orderly',
    fortified:  'Fortified',
  },
});

/**
 * Convert an internal band string to its user-facing display label
 * within a given domain. Returns the band unchanged when the mapping
 * is unknown.
 *
 * @param {string} domain  One of substrate | capacity | chain |
 *                         condition | threat | district_wealth |
 *                         district_safety.
 * @param {string} band
 * @returns {string}
 */
export function displayBandLabel(domain, band) {
  const map = /** @type {Record<string, Record<string, string>>} */ (DISPLAY_LABELS)[domain];
  if (!map || typeof band !== 'string') return band || '';
  return map[band] || band;
}

// ── Reference parsing ───────────────────────────────────────────────────

/** @param {any} ref */
function parseRef(ref) {
  if (typeof ref === 'string') return { id: ref };
  if (ref && typeof ref === 'object') return ref;
  return { id: null };
}

// ── bandFor ──────────────────────────────────────────────────────────────

/**
 * Look up the canonical band for any reference. Accepts:
 *   - 'var.food_security' or bare 'food_security' (substrate)
 *   - 'capacity.labor' or bare 'labor' (capacity)
 *   - 'chain.<id>' (supply chain status)
 *   - 'condition.<id>' (severity band)
 *   - 'threat.<id>' (severity band)
 *   - 'district.<id>' with { domain: 'wealth' | 'safety' } modifier
 *
 * @param {string | {id: string, domain?: string}} ref
 * @param {any} settlement
 * @returns {string | null}
 */
export function bandFor(ref, settlement) {
  if (!settlement) return null;
  const { id, domain } = parseRef(ref);
  if (typeof id !== 'string') return null;

  // Substrate
  if (id.startsWith('var.')) {
    const name = id.slice('var.'.length);
    if (!SYSTEM_VARIABLES.includes(name)) return null;
    return deriveCausalState(settlement).bands?.[name] || null;
  }
  if (SYSTEM_VARIABLES.includes(id)) {
    return deriveCausalState(settlement).bands?.[id] || null;
  }

  // Capacity
  if (id.startsWith('capacity.')) {
    const name = id.slice('capacity.'.length);
    if (!CAPACITY_NAMES.includes(name)) return null;
    const p = /** @type {any} */ (deriveCapacityProfile(name, settlement));
    return p?.band || null;
  }
  if (CAPACITY_NAMES.includes(id)) {
    const p = /** @type {any} */ (deriveCapacityProfile(id, settlement));
    return p?.band || null;
  }

  // Chain
  if (id.startsWith('chain.')) {
    const c = deriveAllSupplyChainStates(settlement).find((/** @type {any} */ x) => x.id === id);
    return c?.status || null;
  }

  // Condition
  if (id.startsWith('condition.')) {
    const c = findActiveCondition(settlement, id);
    return c?.severityBand || null;
  }

  // Threat
  if (id.startsWith('threat.')) {
    const t = deriveAllThreatProfiles(settlement).find((/** @type {any} */ x) => x.id === id);
    return t?.severityBand || null;
  }

  // District — needs a domain modifier (wealth | safety).
  if (id.startsWith('district.')) {
    const d = deriveAllDistricts(settlement).find((/** @type {any} */ x) => x.id === id);
    if (!d) return null;
    if (domain === 'safety') return d.safety;
    return d.wealth;  // default
  }

  return null;
}

/**
 * Convenience: return the user-facing display value for any reference.
 * Routes the right domain to displayBandLabel automatically.
 * @param {any} ref
 * @param {any} settlement
 */
export function displayValueFor(ref, settlement) {
  const { id, domain } = parseRef(ref);
  const band = bandFor(ref, settlement);
  if (!band || typeof id !== 'string') return band || '';

  if (id.startsWith('var.') || SYSTEM_VARIABLES.includes(id)) {
    return displayBandLabel('substrate', band);
  }
  if (id.startsWith('capacity.') || CAPACITY_NAMES.includes(id)) {
    return displayBandLabel('capacity', band);
  }
  if (id.startsWith('chain.'))     return displayBandLabel('chain', band);
  if (id.startsWith('condition.')) return displayBandLabel('condition', band);
  if (id.startsWith('threat.'))    return displayBandLabel('threat', band);
  if (id.startsWith('district.')) {
    return displayBandLabel(domain === 'safety' ? 'district_safety' : 'district_wealth', band);
  }
  return band;
}

// ── Catalog accessors ───────────────────────────────────────────────────

export function supportedBandDomains() {
  return Object.keys(DISPLAY_LABELS);
}

/** @param {string} domain */
export function displayLabelsFor(domain) {
  const m = /** @type {Record<string, Record<string, string>>} */ (DISPLAY_LABELS)[domain];
  return m ? { ...m } : null;
}
