/**
 * domain/factionArchetypes.js — the single canonical faction-archetype detector.
 *
 * THE PROBLEM: four independent layers each infer "what kind of faction is this?"
 * from the faction's name/category, with their OWN regex vocabulary and their OWN
 * output keys:
 *   - worldPulse/factionCompetition.inferFactionArchetype → noble/merchant/military/…/civic
 *   - generators/factionRoles.matchFactionArchetype       → thieves/temple/watch/… (NPC-role keys)
 *   - domain/factionProfile (ARCHETYPE_RULES)             → occupation/criminal/…/government/other
 *   - domain/events/factionResponses.matchArchetype       → thieves_guild/temple/…/merchant_guild
 *
 * They drift: a faction can read as 'criminal' in one layer and 'civic' in another,
 * and a rename silently reclassifies it differently in each. This module is the ONE
 * place that detects the canonical archetype. Each consumer keeps its own output
 * vocabulary but maps FROM this canonical value instead of re-deriving the regexes —
 * so the signal detection lives once and the layers stop diverging.
 *
 * Pure; tolerant of partial/string inputs; never throws. Category (when present and
 * recognized) wins over name inference; name/description inference is the fallback.
 *
 * MG-3h (chair ruling R-BLD-5): the ARCANE axis specifically is no longer decided by this
 * module's own regex. domain/arcaneIdentity.js is the canonical detector — the authored
 * faction catalog's category key is the tag, and name patterns are a fallback for
 * non-catalog entities only. Every other axis is untouched.
 */

import {
  ARCANE_IDENTITY,
  factionCatalogArcaneTag,
  resolveArcaneIdentity,
} from './arcaneIdentity.js';

/** Canonical faction archetypes. Frozen so a typo'd key is `undefined`, not a silent miss. */
export const FACTION_ARCHETYPES = Object.freeze({
  GOVERNMENT: 'government',
  NOBLE:      'noble',
  MILITARY:   'military',
  MERCHANT:   'merchant',
  RELIGIOUS:  'religious',
  CRIMINAL:   'criminal',
  ARCANE:     'arcane',
  CRAFT:      'craft',
  LABOR:      'labor',
  OUTSIDER:   'outsider',
  OCCUPATION: 'occupation',
  CIVIC:      'civic',
  OTHER:      'other',
});

const A = FACTION_ARCHETYPES;

// Direct category → canonical archetype. Categories are authoritative when present.
const CATEGORY_MAP = Object.freeze({
  government: A.GOVERNMENT, civic: A.CIVIC, noble: A.NOBLE, nobility: A.NOBLE,
  military: A.MILITARY, watch: A.MILITARY, law: A.MILITARY,
  merchant: A.MERCHANT, economy: A.MERCHANT, trade: A.MERCHANT,
  religious: A.RELIGIOUS, temple: A.RELIGIOUS, faith: A.RELIGIOUS,
  criminal: A.CRIMINAL, arcane: A.ARCANE, magic: A.ARCANE,
  craft: A.CRAFT, labor: A.LABOR, outsider: A.OUTSIDER, occupation: A.OCCUPATION,
});

// Ordered name/description rules — first match wins. Ordering matters where terms
// overlap: occupation before military ('garrison'); criminal before merchant
// ('thieves guild' contains 'guild'); arcane before academic; noble before
// government ('lord' vs 'council'). Term sets are the UNION of all four legacy
// matchers, so the canonical detector recognizes at least what any one of them did.
const NAME_RULES = Object.freeze([
  { archetype: A.OCCUPATION, re: /occupation|garrison\s+rule|imperial\s+presence|annex/i },
  { archetype: A.CRIMINAL,   re: /thieves|criminal|smuggl|gang|bandit|syndicate|assassin|shadow|underworld|black\s*market|racket|fence|crime/i },
  { archetype: A.RELIGIOUS,  re: /temple|church|cathedral|chapel|shrine|monaster|cleric|clerg|priest|cult|holy|faith|abbey|monk|order\s+of\s+the|religious/i },
  // MG-3h / R-BLD-5: the arcane rule is no longer a flat regex. Its UNAMBIGUOUS half
  // (ARCANE_CERTAIN_PATTERN) and its AMBIGUOUS half (ARCANE_AMBIGUOUS_PATTERN — tower,
  // academy, college, sage) are the same tokens as before, now read through the canonical
  // detector: the authored catalog tag decides first, and the ambiguous half only fires
  // for a non-catalog name whose text also asserts that magic works. `re` here is the
  // UNION, kept only so this rule still claims its slot in the first-match ordering
  // (arcane before academic, before military); `arcaneRule` is what actually decides.
  { archetype: A.ARCANE,     re: /mage|arcane|wizard|sorcer|alchem|warlock|magister|tower|academy|college|sage/i, arcaneRule: true },
  { archetype: A.MILITARY,   re: /military|militia|guard|watch|soldier|garrison|knight|army|sheriff|sentinel|ranger|warden|war\s+council|captain/i },
  { archetype: A.CRAFT,      re: /craft\s*guild|artisan|crafter/i },
  { archetype: A.MERCHANT,   re: /merchant|trade|caravan|bazaar|market|broker|oligarch|bank|guild/i },
  // `house\s+[a-z]` catches "House of …" AND "House Valeric"; merchant/military
  // rules run earlier, so a "Trade House"/"Guild House" lands there first, not here.
  { archetype: A.NOBLE,      re: /noble|lord|baron|duke|royal|aristocrat|arist|feudal|\bhouse\s+[a-z]/i },
  { archetype: A.LABOR,      re: /labor|labour|worker|farmer|miner|dock|teamster|mill/i },
  { archetype: A.OUTSIDER,   re: /foreign|outsider|envoy|embassy|patron/i },
  { archetype: A.GOVERNMENT, re: /council|government|reeve|steward|appointee|democratic|elder/i },
]);

/** @param {*} value @returns {string} */
function normCategory(value) {
  return String(value || '').trim().toLowerCase();
}

/**
 * The canonical archetype for a faction. Category (if recognized) wins; otherwise
 * infer from the name/label/type/description text. Returns FACTION_ARCHETYPES.OTHER
 * when nothing matches.
 *
 * @param {Object|string|null|undefined} faction
 * @returns {string} one of FACTION_ARCHETYPES.*
 */
export function factionArchetype(faction) {
  if (!faction) return A.OTHER;
  if (typeof faction === 'string') {
    return inferFromText(faction, factionCatalogArcaneTag(faction));
  }
  const f = /** @type {any} */ (faction);

  const cat = /** @type {keyof typeof CATEGORY_MAP} */ (normCategory(f.category));
  if (cat && CATEGORY_MAP[cat]) return CATEGORY_MAP[cat];

  const text = [f.name, f.faction, f.label, f.type, f.description]
    .map((x) => String(x || '')).join(' ');
  // The catalog identity is keyed on the NAME alone — a description is prose, not an
  // authored identity, and letting it reach the index would let one word of flavour
  // borrow another faction's authored tag. Read in rulingPower.nameOf's precedence
  // (`.faction` first; `.name` is the legacy alias addFaction also mints).
  const catalogTag = factionCatalogArcaneTag(f.faction || f.name || f.label || '');
  return inferFromText(text, catalogTag);
}

/**
 * @param {*} text
 * @param {string} [catalogArcaneTag]  an ARCANE_IDENTITY value for the entity's NAME
 * @returns {string}
 */
function inferFromText(text, catalogArcaneTag = ARCANE_IDENTITY.UNKNOWN) {
  const t = String(text || '').toLowerCase();
  if (!t.trim()) return A.OTHER;
  for (const rule of NAME_RULES) {
    // The arcane slot keeps its ORDERING (arcane before academic, before military) but no
    // longer decides by raw regex: the authored catalog tag answers first, and only a
    // non-catalog name falls through to the certain/ambiguous name law. A name that is
    // merely AMBIGUOUS — a tower, an academy — continues down the list instead of
    // claiming the arcane slot, which is how the cobblers' guild in the tower district
    // stops being a wizards' order (the W-K2 incident's recorded cure).
    if (rule.arcaneRule) {
      if (resolveArcaneIdentity(catalogArcaneTag, t)) return A.ARCANE;
      continue;
    }
    if (rule.re.test(t)) return rule.archetype;
  }
  return A.OTHER;
}

/** All canonical archetype values — for tests + drift detection. */
export function supportedFactionArchetypes() {
  return Object.values(FACTION_ARCHETYPES);
}
