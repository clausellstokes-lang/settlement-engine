/**
 * domain/districtProfile.js — Promote quarters to structured districts.
 *
 * Tier 4.9 of the roadmap. The generator already produces
 * `settlement.spatialLayout.quarters[]` with light fields (name,
 * location, desc, landmarks). Phase 29 keeps that shape and enriches
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
 * Pure read-only. Composes Phase 9 factions, Phase 10 chains,
 * Phase 16 conditions, Phase 17 substrate, Phase 20 threats.
 * Doesn't rewrite the generator — it derives.
 */

import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveCausalState } from './causalState.js';
import { deriveAllActiveConditions } from './activeConditions.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import { factionArchetype } from './factionArchetypes.js';

// ── Catalog ──────────────────────────────────────────────────────────────

export const DISTRICT_CATEGORIES = Object.freeze([
  'religious', 'merchant', 'military', 'craft',
  'residential', 'noble', 'civic', 'arcane',
  'criminal', 'foreign', 'industrial', 'other',
]);

const WEALTH_BANDS = Object.freeze(['destitute', 'poor', 'modest', 'comfortable', 'wealthy', 'opulent']);
const SAFETY_BANDS = Object.freeze(['lawless', 'unsafe', 'watched', 'orderly', 'fortified']);

// ── Helpers ──────────────────────────────────────────────────────────────

/** @typedef {import('./factionProfile.js').FactionProfile} FactionProfile */
/** @typedef {import('./threatProfile.js').ThreatProfile} ThreatProfile */
/**
 * The raw faction record, imported from the module this file joins against rather
 * than re-declared here: `canonicalArchetypesById` keys its map by the id
 * `deriveFactionProfile` will mint, so the two must read one contract, not two
 * that agree today.
 * @typedef {import('./factionProfile.js').FactionLike} FactionLike
 */

/**
 * @typedef {Object} Quarter
 * @property {string} [name]
 * @property {string} [desc]
 * @property {string} [location]
 * @property {string[]} [landmarks]
 */

/**
 * @typedef {{ source: string, effect: string, reason: string }} Contributor
 */

/**
 * @typedef {{ archetype?: string, label?: string }} ConditionLike
 */

/**
 * @typedef {Object} DistrictSettlement
 * @property {{ prosperity?: any, [key: string]: unknown }} [economicState]
 * @property {unknown} [institutions]
 * @property {{ quarters?: Quarter[] }} [spatialLayout]
 * @property {{ factions?: FactionLike[] }|null} [powerStructure]
 * @property {FactionLike[]} [factions]
 */

/**
 * @typedef {Object} DistrictProfile
 * @property {string} id
 * @property {string} name
 * @property {(string|null)} origin
 * @property {string} category
 * @property {string} wealth
 * @property {string} safety
 * @property {({ id: string, name: string, archetype: string } | null)} dominantFaction
 * @property {Array<{ id: string, label: string }>} institutions
 * @property {string[]} services
 * @property {string} sensoryIdentity
 * @property {string} currentTension
 * @property {string} hook
 * @property {string[]} connectedDistricts
 * @property {Contributor[]} contributors
 */

/**
 * @param {unknown} s
 * @returns {string}
 */
function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

/**
 * @param {{ length: number }} arr
 * @param {number} idx
 * @returns {number}
 */
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
  // `den` is ANCHORED (\bdens?\b). Unanchored it matched the SUBSTRING in
  // "Dense timber tenements" — the Common Residential quarter's own description —
  // and classified every common residential district in every city as `criminal`
  // (measured: 168 of 168 city/metropolis settlements). A quarter is a criminal
  // den, not a dense one.
  { pattern: /slum|thieves|criminal|seedy|\bdens?\b|underground/i, category: 'criminal' },
  { pattern: /foreign|expatriate|enclave|immigrant|exotic/i,       category: 'foreign' },
  { pattern: /industrial|tannery|smelter|warehouse|dock|port/i,    category: 'industrial' },
  { pattern: /residential|commoner|tenement|homestead|district/i,  category: 'residential' },
]);

/**
 * DECLARED quarter categories — the registry (Shape D).
 *
 * WHY A REGISTRY AT ALL. `CATEGORY_PATTERNS` is a first-match-wins regex sweep
 * over a quarter's name + desc + landmarks. The generator's fourteen quarters are
 * fixed, authored strings, so the sweep's misfires are not hypothetical — every
 * one below was MEASURED over a 504-settlement corpus (6 tiers x 84 seeds):
 *
 *   Noxious Trades Quarter  -> merchant   (164)  "Trades" hits /trade/
 *   Shadows District        -> merchant   (168)  "hidden markets" hits /market/
 *   Wealthy Residential     -> merchant   (168)  landmark "Merchant Estates"
 *   Common Residential      -> criminal   (168)  "Dense" hit the unanchored /den/
 *   Mages' Quarter          -> craft      ( 45)  a `guild` landmark beats /arcane/
 *
 * The criminal quarter and the common residential quarter were EXACTLY SWAPPED.
 *
 * The registry declares what the generator already knows. It is read as
 * `declared ?? inferred`: the regex sweep remains the fallback for authored,
 * imported and legacy quarters whose names are not in this table, so no saved
 * settlement loses its classification. The generator's fourteen name literals
 * have been byte-identical since 2026-04-13, which is exactly why a declared
 * registry — rather than a rewrite of the generator — covers legacy saves too.
 *
 * TOTALITY is enforced both ways by the registry walker in
 * tests/domain/districtProfile.test.js, which parses the generator's own
 * `quarters.push({ name: ... })` literals: a new quarter with no row here, or a
 * row here naming no quarter, reds.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const QUARTER_CATEGORY = Object.freeze({
  'Market Quarter':         'merchant',
  'Religious Quarter':      'religious',
  'Roadside Shrine':        'religious',
  'Noxious Trades Quarter': 'industrial',
  'Waterfront District':    'industrial',
  'Alehouse & Common':      'residential',
  'Fishing Landing':        'industrial',
  "Woodcutters' Ground":    'industrial',
  'Artisan Quarter':        'craft',
  'Government Quarter':     'civic',
  "Mages' Quarter":         'arcane',
  'Shadows District':       'criminal',
  // NOT `residential`: the residential wealth baseline is 1, which renders the
  // stone-townhouse, private-garden quarter POOR on 168 of 168 city and
  // metropolis settlements. `noble` is what the quarter describes.
  'Wealthy Residential':    'noble',
  'Common Residential':     'residential',
});

/**
 * @param {Quarter} quarter
 * @returns {string}
 */
function inferCategory(quarter) {
  const declared = QUARTER_CATEGORY[String(quarter.name || '')];
  if (declared) return declared;
  const blob = `${quarter.name || ''} ${quarter.desc || ''} ${(quarter.landmarks || []).join(' ')}`;
  for (const { pattern, category } of CATEGORY_PATTERNS) {
    if (pattern.test(blob)) return category;
  }
  return 'other';
}

/**
 * Category → dominant-faction archetypes, in PREFERENCE order, expressed in the
 * CANONICAL faction vocabulary (domain/factionArchetypes), not factionProfile's
 * folded one.
 *
 * WHY CANONICAL. `deriveFactionProfile` reports its archetype through
 * factionProfile's local `CANONICAL_TO_PROFILE`, which folds NOBLE and CIVIC into
 * `government`. Matching on that folded value means a district can NEVER see a
 * noble faction — measured over the 504-settlement corpus, canonical `government`
 * (411) + `noble` (359) = 770 = the folded `government` total exactly. A noble
 * quarter asking for its dominant house was being handed the city council.
 *
 * WHY PREFERENCE LISTS. A single archetype per category silently DELETES the
 * card's dominant-faction row whenever that archetype does not occur. Two of the
 * shipped single values name archetypes the engine never produces at all: over
 * 3,038 faction instances the canonical vocabulary yields ZERO `craft` and ZERO
 * `civic`. `industrial -> 'craft'` and `craft -> 'craft'` were therefore
 * unconditional nulls, and declaring the Noxious Trades quarter `industrial`
 * would have removed its faction row from 164 cards while the change advertised
 * additions. Each list ends in an archetype that actually occurs, so a row is
 * dropped only when the settlement genuinely holds no plausible claimant.
 *
 * `residential` and `other` are deliberately EMPTY: no faction dominates a
 * common residential ward, and inventing one is the fabrication this module's
 * contributors ledger exists to prevent.
 *
 * @type {Readonly<Record<string, readonly string[]>>}
 */
const CATEGORY_TO_ARCHETYPE = Object.freeze({
  religious:    Object.freeze(['religious']),
  merchant:     Object.freeze(['merchant']),
  military:     Object.freeze(['military']),
  craft:        Object.freeze(['craft', 'merchant']),
  civic:        Object.freeze(['government', 'civic', 'noble']),
  arcane:       Object.freeze(['arcane']),
  criminal:     Object.freeze(['criminal']),
  noble:        Object.freeze(['noble', 'government']),
  foreign:      Object.freeze(['merchant']),
  industrial:   Object.freeze(['craft', 'merchant']),
  residential:  Object.freeze([]),
  other:        Object.freeze([]),
});

/**
 * Canonical archetype for every faction the settlement carries, keyed by the id
 * its FactionProfile will report. `deriveFactionProfile` derives that id from the
 * same name (`faction.faction || faction.name`) through the same snakeCase, so
 * the join is exact — measured over the corpus, every faction profile joined.
 *
 * THE READ IS THE TWO SHAPES A WRITER ACTUALLY PRODUCES, and no more.
 * `deriveAllFactionProfiles` reads a THIRD alternate between these two —
 * `settlement.power?.factions` — and this function deliberately does not. The
 * reader-with-no-writer ratchet's executed corpus observes no `power` key on a
 * settlement in any seed, so that arm is dead: it is banked as pre-existing debt
 * where it already lives, and copying it here would have added a fresh row to a
 * shrink-only inventory. Dropping it is behaviour-identical for the same reason
 * it is dead — nothing ever writes the key it reads.
 *
 * @param {DistrictSettlement} settlement
 * @returns {Map<string, string>}
 */
function canonicalArchetypesById(settlement) {
  const factions = settlement?.powerStructure?.factions || settlement?.factions || [];
  /** @type {Map<string, string>} */
  const out = new Map();
  if (!Array.isArray(factions)) return out;
  for (const f of factions) {
    // The bare-string arm is load-bearing: a settlement's TOP-LEVEL `factions`
    // is a different record type from `powerStructure.factions` and may hold
    // plain names. `factionArchetype` accepts either.
    const name = typeof f === 'string' ? f : (f?.faction || f?.name);
    if (!name) continue;
    out.set(`faction.${snakeCase(name)}`, factionArchetype(f));
  }
  return out;
}

/**
 * @param {string} category
 * @param {FactionProfile[]} profiles
 * @param {Map<string, string>} canonicalById
 * @returns {FactionProfile | null}
 */
function inferDominantFaction(category, profiles, canonicalById) {
  const preferences = CATEGORY_TO_ARCHETYPE[category] || [];
  for (const archetype of preferences) {
    // The canonical archetype when the faction joined, else the profile's own
    // folded value — a faction the join cannot reach keeps today's behaviour
    // rather than silently losing its row.
    const matching = profiles.filter(
      p => (canonicalById.get(p.id) ?? p.archetype) === archetype,
    );
    // Pick the highest-power matching faction.
    if (matching.length > 0) return matching.slice().sort((a, b) => (b.power || 0) - (a.power || 0))[0];
  }
  return null;
}

// Category → base wealth band (settlement prosperity nudges from there).
/**
 * @param {string} category
 * @param {DistrictSettlement} settlement
 * @param {Contributor[]} contributors
 * @returns {string}
 */
function inferWealth(category, settlement, contributors) {
  /** @type {Record<string, number>} */
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
/**
 * @param {string} category
 * @param {DistrictSettlement} settlement
 * @param {{ scores?: Record<string, number> }} causal
 * @param {ThreatProfile[]} threats
 * @param {Contributor[]} contributors
 * @returns {string}
 */
function inferSafety(category, settlement, causal, threats, contributors) {
  /** @type {Record<string, number>} */
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
/**
 * @param {Quarter} quarter
 * @param {DistrictSettlement} settlement
 * @returns {Array<{ id: string, label: string }>}
 */
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

/**
 * @param {string} category
 * @returns {string[]}
 */
function inferServices(category) {
  /** @type {Record<string, string[]>} */
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

/**
 * @param {Quarter} quarter
 * @returns {string}
 */
function inferSensoryIdentity(quarter) {
  const parts = [];
  if (quarter.desc) parts.push(String(quarter.desc));
  if (Array.isArray(quarter.landmarks) && quarter.landmarks.length) {
    parts.push(`landmarks: ${quarter.landmarks.join(', ')}`);
  }
  return parts.join(' — ') || 'No specific sensory notes recorded.';
}

/**
 * @param {string} category
 * @param {ConditionLike[]} conditions
 * @param {ThreatProfile[]} threats
 * @returns {string}
 */
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

/**
 * @param {string} category
 * @param {Quarter} quarter
 * @param {ConditionLike[]} conditions
 * @param {ThreatProfile[]} threats
 * @returns {string}
 */
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
  /** @type {Record<string, string>} */
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

/**
 * @param {Quarter} quarter
 * @param {DistrictSettlement} settlement
 * @returns {string[]}
 */
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
 *
 * @param {Quarter | null | undefined} quarter
 * @param {DistrictSettlement | null | undefined} settlement
 * @returns {DistrictProfile | null}
 */
export function deriveDistrictProfile(quarter, settlement) {
  if (!quarter || !quarter.name || !settlement) return null;
  const profiles = deriveAllFactionProfiles(/** @type {any} */ (settlement));
  const causal = deriveCausalState(/** @type {any} */ (settlement));
  const conditions = deriveAllActiveConditions(/** @type {any} */ (settlement));
  const threats = deriveAllThreatProfiles(/** @type {any} */ (settlement));
  const contributors = [];

  const category = inferCategory(quarter);
  contributors.push({ source: 'category_inference', effect: 'matched', reason: `Quarter "${quarter.name}" classified as ${category}.` });

  const canonicalById = canonicalArchetypesById(settlement);
  const dominantFaction = inferDominantFaction(category, profiles, canonicalById);
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
    // The archetype REPORTED is the one the district was matched ON. Reporting
    // factionProfile's folded value here would have the card select a noble
    // house for a noble quarter and then label it `government` — which
    // explanation.js prints verbatim as "<house> (government) dominates this
    // district."
    dominantFaction: dominantFaction
      ? {
        id: dominantFaction.id,
        name: dominantFaction.name,
        archetype: canonicalById.get(dominantFaction.id) ?? dominantFaction.archetype,
      }
      : null,
    institutions,
    services,
    sensoryIdentity,
    currentTension,
    hook,
    connectedDistricts: connected,
    contributors,
  };
}

/**
 * Derive every district.
 * @param {DistrictSettlement | null | undefined} settlement
 * @returns {DistrictProfile[]}
 */
export function deriveAllDistricts(settlement) {
  if (!settlement) return [];
  const quarters = settlement.spatialLayout?.quarters;
  if (!Array.isArray(quarters)) return [];
  return /** @type {DistrictProfile[]} */ (quarters
    .map(q => deriveDistrictProfile(q, settlement))
    .filter(Boolean));
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

export function districtBands() {
  return { wealth: [...WEALTH_BANDS], safety: [...SAFETY_BANDS] };
}

export function supportedDistrictCategories() {
  return [...DISTRICT_CATEGORIES];
}

/**
 * @param {DistrictSettlement | null | undefined} settlement
 * @returns {string[]}
 */
export function summarizeDistricts(settlement) {
  return deriveAllDistricts(settlement)
    .map(d => `${d.name} (${d.category}): ${d.wealth}, ${d.safety}. ${d.currentTension}`);
}
