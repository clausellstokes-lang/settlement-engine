/**
 * domain/districtProfile.js — Promote quarters to structured districts.
 *
 * The generator already produces
 * `settlement.spatialLayout.quarters[]` with light fields (name,
 * location, desc, landmarks). This module keeps that shape and enriches
 * it with structural fields by reading the rest of the settlement:
 *
 *   deriveDistrictProfile(quarter, settlement) -> {
 *     id, name, origin, category,
 *     wealth, safety,
 *     dominantFaction,
 *     institutions[], services[],
 *     sensoryIdentity,
 *     currentTension,
 *     hook,
 *     connectedDistricts[],
 *     contributors[]
 *   }
 *
 * Pure read-only. Composes factions, chains,
 * conditions, substrate, threats.
 * Doesn't rewrite the generator — it derives.
 */

import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveCausalState } from './causalState.js';
import { deriveAllActiveConditions } from './activeConditions.js';
import { deriveAllThreatProfiles } from './threatProfile.js';

// ── Catalog ──────────────────────────────────────────────────────────────

export const DISTRICT_CATEGORIES = Object.freeze([
  'religious', 'merchant', 'military', 'craft',
  'residential', 'noble', 'civic', 'arcane',
  'criminal', 'foreign', 'industrial', 'other',
]);

const WEALTH_BANDS = Object.freeze(['destitute', 'poor', 'modest', 'comfortable', 'wealthy', 'opulent']);
const SAFETY_BANDS = Object.freeze(['lawless', 'unsafe', 'watched', 'orderly', 'fortified']);

// ── Helpers ──────────────────────────────────────────────────────────────

function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

function clampIdx(arr, idx) {
  return Math.max(0, Math.min(arr.length - 1, idx));
}

const CATEGORY_PATTERNS = Object.freeze([
  { pattern: /religious|temple|cathedral|cleric|monastic|shrine/i, category: 'religious' },
  { pattern: /merchant|market|bazaar|trade|exchange/i,             category: 'merchant' },
  { pattern: /military|garrison|barracks|watch|guard|fortress/i,   category: 'military' },
  { pattern: /craft|artisan|smith|forge|workshop|guild/i,          category: 'craft' },
  { pattern: /noble|patrician|aristo|estate|manor|highborn/i,      category: 'noble' },
  { pattern: /civic|council|court|hall|government|chancery/i,      category: 'civic' },
  { pattern: /arcane|magic|tower|college|enclave|conclave/i,       category: 'arcane' },
  { pattern: /slum|thieves|criminal|seedy|den|underground/i,       category: 'criminal' },
  { pattern: /foreign|expatriate|enclave|immigrant|exotic/i,       category: 'foreign' },
  { pattern: /industrial|tannery|smelter|warehouse|dock|port/i,    category: 'industrial' },
  { pattern: /residential|commoner|tenement|homestead|district/i,  category: 'residential' },
]);

function inferCategory(quarter) {
  const blob = `${quarter.name || ''} ${quarter.desc || ''} ${(quarter.landmarks || []).join(' ')}`;
  for (const { pattern, category } of CATEGORY_PATTERNS) {
    if (pattern.test(blob)) return category;
  }
  return 'other';
}

// Category → likely dominant-faction archetype.
const CATEGORY_TO_ARCHETYPE = Object.freeze({
  religious:    'religious',
  merchant:     'merchant',
  military:     'military',
  craft:        'craft',
  civic:        'government',
  arcane:       'arcane',
  criminal:     'criminal',
  noble:        'government',
  foreign:      'merchant',
  industrial:   'craft',
  residential:  null,
  other:        null,
});

function inferDominantFaction(category, profiles) {
  const archetype = CATEGORY_TO_ARCHETYPE[category];
  if (!archetype) return null;
  const matching = profiles.filter(p => p.archetype === archetype);
  if (matching.length === 0) return null;
  // Pick the highest-power matching faction.
  return matching.sort((a, b) => (b.power || 0) - (a.power || 0))[0];
}

// Category → base wealth band (settlement prosperity nudges from there).
function inferWealth(category, settlement, contributors) {
  const base = {
    noble:      5,
    arcane:     4,
    merchant:   4,
    religious:  3,
    civic:      3,
    foreign:    3,
    craft:      2,
    industrial: 2,
    military:   2,
    residential:1,
    criminal:   1,
    other:      2,
  };
  let idx = base[category] ?? 2;
  contributors.push({
    source: 'category',
    effect: 'wealth_baseline',
    reason: `${category} districts skew to ${WEALTH_BANDS[idx]}.`,
  });

  const prosperity = settlement.economicState?.prosperity?.tier
                  || settlement.economicState?.prosperity;
  if (prosperity === 'Wealthy' || prosperity === 'Prosperous') {
    idx += 1;
    contributors.push({ source: 'economicState.prosperity', effect: 'prosperity_lift', reason: `Settlement is ${prosperity}; district wealth nudged up.` });
  } else if (prosperity === 'Subsistence' || prosperity === 'Struggling') {
    idx -= 1;
    contributors.push({ source: 'economicState.prosperity', effect: 'prosperity_drag', reason: `Settlement is ${prosperity}; district wealth nudged down.` });
  }
  return WEALTH_BANDS[clampIdx(WEALTH_BANDS, idx)];
}

// Category → base safety band (substrate + threats nudge).
function inferSafety(category, settlement, causal, threats, contributors) {
  const base = {
    military:    4,
    civic:       3,
    religious:   3,
    noble:       3,
    arcane:      3,
    merchant:    2,
    craft:       2,
    residential: 2,
    foreign:     2,
    industrial:  1,
    criminal:    0,
    other:       2,
  };
  let idx = base[category] ?? 2;
  contributors.push({
    source: 'category',
    effect: 'safety_baseline',
    reason: `${category} districts skew to ${SAFETY_BANDS[idx]}.`,
  });

  const crimScore = causal.scores?.criminal_opportunity ?? 50;
  if (crimScore >= 70) {
    idx -= 1;
    contributors.push({ source: 'var.criminal_opportunity', effect: 'crime_drag', reason: `High criminal opportunity (${crimScore}) drags safety down.` });
  }
  // Acute defense-relevant threats pull non-military districts down.
  if (category !== 'military') {
    const acute = threats.some(t => t.severity >= 0.7
      && ['siege', 'bandit_raids', 'monster_pressure', 'unrest'].includes(t.type));
    if (acute) {
      idx -= 1;
      contributors.push({ source: 'threats', effect: 'acute_threat_drag', reason: 'Acute external threat pulls district safety down.' });
    }
  }
  return SAFETY_BANDS[clampIdx(SAFETY_BANDS, idx)];
}

// Match institutions by name overlap with the quarter's name / landmarks.
function inferInstitutions(quarter, settlement) {
  const inst = Array.isArray(settlement.institutions) ? settlement.institutions : [];
  const haystack = `${quarter.name || ''} ${(quarter.landmarks || []).join(' ')}`.toLowerCase();
  const matched = [];
  for (const i of inst) {
    if (!i?.name) continue;
    const stem = String(i.name).toLowerCase().split(/\s+/).find(w => w.length > 4);
    if (stem && haystack.includes(stem)) {
      matched.push({ id: i.id || `institution.${snakeCase(i.name)}`, label: i.name });
    }
  }
  return matched;
}

function inferServices(category) {
  const map = {
    religious:   ['ritual services', 'sanctuary', 'almsgiving'],
    merchant:    ['markets', 'moneylending', 'porter and warehousing'],
    military:    ['watch patrols', 'mustering ground', 'arms storage'],
    craft:       ['guild halls', 'apprenticeship', 'workshops'],
    civic:       ['records', 'magistrates', 'public assemblies'],
    arcane:      ['enchantment', 'training', 'identification'],
    criminal:    ['fencing', 'protection', 'illicit markets'],
    noble:       ['private salons', 'gardens', 'kept guards'],
    foreign:     ['translation', 'consular services', 'exotic goods'],
    industrial:  ['warehousing', 'haulage', 'rough labor'],
    residential: ['informal trade', 'baked goods', 'water sellers'],
    other:       [],
  };
  return [...(map[category] || [])];
}

function inferSensoryIdentity(quarter) {
  const parts = [];
  if (quarter.desc) parts.push(String(quarter.desc));
  if (Array.isArray(quarter.landmarks) && quarter.landmarks.length) {
    parts.push(`Landmarks: ${quarter.landmarks.join(', ')}`);
  }
  return parts.join('. ') || 'No specific sensory notes recorded.';
}

function inferCurrentTension(category, conditions, threats) {
  // Category-relevant active conditions become the headline tension.
  for (const cond of conditions) {
    if (category === 'religious' && cond.archetype === 'plague') return `${cond.label} drives crowds to temple steps.`;
    if (category === 'merchant' && cond.archetype === 'trade_route_cut') return `${cond.label} sees stalls empty and tempers short.`;
    if (category === 'noble' && cond.archetype === 'corruption_exposed') return `${cond.label} chills the salons; carriages stop calling.`;
    if (category === 'civic' && cond.archetype === 'corruption_exposed') return `${cond.label} freezes routine business while the inquiry runs.`;
    if (category === 'industrial' && cond.archetype === 'food_anchor_lost') return `${cond.label} drives porters to thinner work and shorter tempers.`;
  }
  // Relevant threats become the tension when no condition fits.
  for (const t of threats) {
    if (t.severity < 0.5) continue;
    if (category === 'military' && (t.type === 'siege' || t.type === 'monster_pressure')) return `${t.label} keeps the watch on edge.`;
    if (category === 'merchant' && t.type === 'bandit_raids') return `${t.label} forces armed escorts onto every cart.`;
    if (category === 'foreign' && t.type === 'rival_neighbor') return `${t.label} thins the foreign quarter; some have already left.`;
  }
  return 'No acute tension noted.';
}

function inferHook(category, quarter, conditions, threats) {
  // Prefer condition-driven > threat-driven > category-driven hook.
  for (const cond of conditions) {
    if (category === 'religious' && cond.archetype === 'plague') {
      return `A processional plea has been organized; rivals accuse the priests of profiteering on relief.`;
    }
    if (category === 'merchant' && cond.archetype === 'trade_route_cut') {
      return `A consortium quietly pools coin to fund armed riders that will reopen the road.`;
    }
    if (category === 'criminal' && cond.archetype === 'food_anchor_lost') {
      return `Smugglers offer grain at twice the price, and the watch is looking elsewhere.`;
    }
  }
  for (const t of threats) {
    if (t.severity < 0.6) continue;
    if (category === 'military' && t.type === 'siege') {
      return `An old veteran offers private training to those who can pay, fearing the walls will not hold.`;
    }
    if (category === 'arcane' && t.type === 'arcane_instability') {
      return `Apprentices whisper of unauthorized experiments running through the night.`;
    }
  }
  // Category-default hooks (light).
  const defaults = {
    religious:   'A junior priest is gathering names of those the senior clergy refuse to bury.',
    merchant:    'A coster captain seeks discreet investors for a route most merchants call closed.',
    military:    'A muster of veterans drinks together more often than they used to.',
    craft:       'A guild master is selling tools cheap to clear a debt no one will name.',
    civic:       'A clerk\'s ledger appears to be missing a quarter of its entries.',
    arcane:      'An apprentice is selling spell components their master swore they had destroyed.',
    criminal:    'A new fence accepts coin few quarters will exchange.',
    noble:       'A sealed letter is changing hands faster than any messenger walks.',
    foreign:     'Strangers from across the border arrive without baggage or invitations.',
    industrial:  'A foreman keeps assigning workers to night shifts that produce nothing visible.',
    residential: 'Children are warned away from a particular row of houses no one will name.',
    other:       'Something quiet is shifting in the district\'s usual routine.',
  };
  return defaults[category] || defaults.other;
}

function inferConnectedDistricts(quarter, settlement) {
  const all = settlement.spatialLayout?.quarters || [];
  const out = [];
  for (const other of all) {
    if (other === quarter) continue;
    if (!other?.name) continue;
    out.push(other.name);
  }
  return out;
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Build a structured DistrictProfile for one quarter.
 */
export function deriveDistrictProfile(quarter, settlement) {
  if (!quarter || !quarter.name || !settlement) return null;
  const profiles = deriveAllFactionProfiles(settlement);
  const causal = deriveCausalState(settlement);
  const conditions = deriveAllActiveConditions(settlement);
  const threats = deriveAllThreatProfiles(settlement);
  const contributors = [];

  const category = inferCategory(quarter);
  contributors.push({ source: 'category_inference', effect: 'matched', reason: `Quarter "${quarter.name}" classified as ${category}.` });

  const dominantFaction = inferDominantFaction(category, profiles);
  const wealth = inferWealth(category, settlement, contributors);
  const safety = inferSafety(category, settlement, causal, threats, contributors);
  const institutions = inferInstitutions(quarter, settlement);
  const services = inferServices(category);
  const sensoryIdentity = inferSensoryIdentity(quarter);
  const currentTension = inferCurrentTension(category, conditions, threats);
  const hook = inferHook(category, quarter, conditions, threats);
  const connected = inferConnectedDistricts(quarter, settlement);

  return {
    id: `district.${snakeCase(quarter.name)}`,
    name: quarter.name,
    origin: quarter.location || null,
    category,
    wealth,
    safety,
    dominantFaction: dominantFaction ? { id: dominantFaction.id, name: dominantFaction.name, archetype: dominantFaction.archetype } : null,
    institutions,
    services,
    sensoryIdentity,
    currentTension,
    hook,
    connectedDistricts: connected,
    contributors,
  };
}

/** Derive every district. */
export function deriveAllDistricts(settlement) {
  if (!settlement) return [];
  const quarters = settlement.spatialLayout?.quarters;
  if (!Array.isArray(quarters)) return [];
  return quarters
    .map(q => deriveDistrictProfile(q, settlement))
    .filter(Boolean);
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

export function districtBands() {
  return { wealth: [...WEALTH_BANDS], safety: [...SAFETY_BANDS] };
}

export function supportedDistrictCategories() {
  return [...DISTRICT_CATEGORIES];
}

export function summarizeDistricts(settlement) {
  return deriveAllDistricts(settlement)
    .map(d => `${d.name} (${d.category}): ${d.wealth}, ${d.safety}. ${d.currentTension}`);
}
