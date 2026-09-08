/**
 * domain/arcaneIdentity.js — THE ONE ARCANE-IDENTITY DETECTOR (chair ruling R-BLD-5).
 *
 * THE PROBLEM (leak register L10-L12, and the W-K2 incident before it). Four independent
 * classifiers each answered "is this thing arcane?" from a NAME REGEX, and every one of
 * those regexes mixed UNAMBIGUOUS tokens (mage, arcane, wizard, sorcerer) with AMBIGUOUS
 * ones (tower, academy, college, sage). A tower is masonry; a college is scholars. So the
 * cobblers' guild in the tower district read as an arcane faction — and, the half the
 * register did not see, a REAL magic-catalog faction whose authored name carries no token
 * at all ("The Enlightened") read as `other`. The regex was wrong in BOTH directions, and
 * a fifth classifier would have been wrong in both directions differently.
 *
 * THE LAW (R-BLD-5, binding):
 *   1. THE CATALOG'S AUTHORED TAG IS CANONICAL. Where an entity has a catalog identity —
 *      a faction name in FACTION_DESCRIPTORS / FACTION_DESCRIPTORS_EXTRA, an institution
 *      in institutionalCatalog — the human who authored it already said what it is. That
 *      answer wins, positively AND negatively: a name filed under `magic` is arcane even
 *      with no token in it, and a name filed under `crafts` is mundane even if it contains
 *      "tower".
 *   2. NAME PATTERNS ARE A FALLBACK, AND ONLY FOR NON-CATALOG ENTITIES — DM-authored
 *      factions, imported rosters, custom content. There they run in two tiers: CERTAIN
 *      tokens classify alone (MG-LAW-4: a faction literally named "Mages' Guild" in a
 *      mundane realm is an authored oddity and the classifier is right to call it arcane),
 *      while AMBIGUOUS tokens classify only when the text ALSO asserts functional magic.
 *   3. THE FALLBACK APPLIES THE WORLD LAW'S OWN DENIAL CLAUSES. NEGATED_MAGIC_PATTERNS is
 *      struck from the text before either tier reads it, so "a non-magical college of
 *      letters" is a college of letters. That predicate now lives in
 *      domain/magicAssertionText.js precisely so the world law and this detector cannot
 *      drift into two readings of the same sentence.
 *
 * WHY THIS AND NOT A WORLD-LAW PARAMETER. The rejected design threaded each settlement's
 * magicLedger into `factionArchetype()` through an options bag. That makes arcane-ness a
 * property of the WORLD, which forces a 10+ site consumer census across src/domain and
 * src/generators — and most of those sites hold a faction row with no settlement in scope,
 * so they would have stayed unconverted: the N-1 sweep that reads as a fix and is not one.
 * Reading the catalog makes arcane-ness a property of the ENTITY, which every consumer
 * already has in hand. No signature changes; every consumer is correct by inheritance.
 *
 * CANNOT-CATCH (this guard's stated evasion gaps — see adversarial-verify's meta-rule):
 *   - An entity whose name is neither in a catalog nor carries a certain token nor asserts
 *     magic is read MUNDANE. That is the intended posture (silence is not a magic claim),
 *     but it means a DM's "The Silent Spire" is mundane to every classifier here.
 *   - `magicLedger.ARCANE_INSTITUTION_PATTERN` is a FIFTH name regex and is deliberately
 *     NOT folded in. It answers a different question — "how much arcane infrastructure
 *     stands in this roster?", a census over already-generated institutions with one home
 *     already — and converting it moves magicProfile/capacityModel output. Recorded as a
 *     deferral in DESIGN_REALM_MAGIC_TOGGLE.md's MG-3h block, not as an oversight.
 *   - `magicFilter.ARCANE_INST_KW` remains the fallback vocabulary for institutions (it is
 *     REUSED here, not re-spelled). Where the catalog tag and that keyword list disagree —
 *     'Great library' is keyword-arcane but authored `education` — the TAG wins here while
 *     magicFilter's own strip still uses the keyword. Unobservable in the live pipeline
 *     (filterCatalogForMagic runs upstream of every consumer of this module), pinned below.
 *
 * Pure; tolerant of partial/string inputs; never throws. No store, no React, no I/O.
 */

import { FACTION_DESCRIPTORS, FACTION_DESCRIPTORS_EXTRA } from '../data/powerData.js';
import { stripNegatedMagic, textAssertsFunctionalMagic } from './magicAssertionText.js';

/**
 * The three answers. UNKNOWN is distinct from MUNDANE on purpose: "the catalog has never
 * heard of this" is not "the author said it is not arcane", and a caller that wants to
 * treat silence differently can.
 */
export const ARCANE_IDENTITY = Object.freeze({
  ARCANE:  'arcane',
  MUNDANE: 'mundane',
  UNKNOWN: 'unknown',
});

/**
 * TIER 1 — tokens that mean arcane wherever they appear. This is the UNAMBIGUOUS half of
 * the old `factionArchetypes` arcane rule, unchanged in membership and unchanged in
 * matching semantics (substring, case-insensitive) so no existing name changes its answer
 * on this tier.
 */
export const ARCANE_CERTAIN_PATTERN = /mage|arcane|wizard|sorcer|alchem|warlock|magister/i;

/**
 * TIER 2 — tokens that are arcane ONLY where the text also claims magic works. This is the
 * AMBIGUOUS half of the same rule. A tower is masonry, an academy is teaching, a college is
 * scholars, and "sage" is a herb and a substring of "message".
 */
export const ARCANE_AMBIGUOUS_PATTERN = /tower|academy|college|sage/i;

/** @param {unknown} value @returns {string} lowercased, `The ` stripped, whitespace collapsed */
function normName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/\s+/g, ' ');
}

/**
 * The authored faction index: normalized base name → its authored category. Built once
 * from BOTH authored pools. Keys are normalized so "The Tower Alliance" and
 * "the  tower alliance" are the same identity.
 * @type {Map<string, string>}
 */
const FACTION_CATEGORY_BY_NAME = (() => {
  /** @type {Map<string,string>} */
  const map = new Map();
  for (const pool of [FACTION_DESCRIPTORS, FACTION_DESCRIPTORS_EXTRA]) {
    for (const [category, names] of Object.entries(pool || {})) {
      for (const name of (names || [])) {
        const key = normName(name);
        // First pool wins on a collision so the answer is order-stable, never last-write.
        if (key && !map.has(key)) map.set(key, category);
      }
    }
  }
  return map;
})();

/**
 * Base names longest-first. The dedup pass may prefix an adjectival modifier ("Greater",
 * "Elder", …) onto a base descriptor, so an exact-match index alone would lose the authored
 * identity of every disambiguated faction in a composed realm. Containment recovers it;
 * longest-first keeps a short base from matching inside a longer one.
 * @type {string[]}
 */
const FACTION_NAME_KEYS_BY_LENGTH = [...FACTION_CATEGORY_BY_NAME.keys()]
  .sort((a, b) => (b.length - a.length) || (a < b ? -1 : a > b ? 1 : 0));

/**
 * The authored category of a faction NAME, or null when the catalogs have never heard of
 * it. Exact match first; then containment, which recovers a dedup-modified name.
 *
 * @param {unknown} name
 * @returns {string|null} an authored FACTION_DESCRIPTORS category key, or null
 */
export function factionCatalogCategory(name) {
  const key = normName(name);
  if (!key) return null;
  const exact = FACTION_CATEGORY_BY_NAME.get(key);
  if (exact) return exact;
  for (const base of FACTION_NAME_KEYS_BY_LENGTH) {
    if (key.includes(base)) return FACTION_CATEGORY_BY_NAME.get(base) || null;
  }
  return null;
}

/**
 * The authored arcane verdict for a faction NAME: ARCANE when the catalogs file it under
 * `magic`, MUNDANE when they file it anywhere else, UNKNOWN when they do not know it.
 *
 * @param {unknown} name
 * @returns {string} an ARCANE_IDENTITY value
 */
export function factionCatalogArcaneTag(name) {
  const category = factionCatalogCategory(name);
  if (category === null) return ARCANE_IDENTITY.UNKNOWN;
  return category === 'magic' ? ARCANE_IDENTITY.ARCANE : ARCANE_IDENTITY.MUNDANE;
}

/**
 * THE FALLBACK — the only place a name pattern is allowed to decide, and only for an
 * entity the catalogs do not know. Denial clauses are struck first (law 3); a CERTAIN token
 * then classifies alone; an AMBIGUOUS token classifies only with a functional-magic
 * assertion standing beside it.
 *
 * THE VOCABULARIES ARE PARAMETERS, THE PROCEDURE IS THE LAW. Each adopting classifier
 * passes the certain/ambiguous split of ITS OWN existing token list rather than inheriting
 * a merged one. That is deliberate: unifying the four vocabularies would silently
 * reclassify names on surfaces this ruling never named — a live same-seed behaviour change
 * dressed as a refactor. What is unified is the DECISION: catalog first, denials struck,
 * certain alone, ambiguous only with corroboration. (The residual — four vocabularies still
 * differ in membership — is recorded in DESIGN_REALM_MAGIC_TOGGLE.md's MG-3h block as a
 * deliberate deferral, not an oversight.)
 *
 * @param {unknown} text  name, label, description — whatever the caller has
 * @param {{ certain?: RegExp, ambiguous?: RegExp|null }} [vocabulary]
 * @returns {boolean}
 */
export function arcaneNameFallback(text, vocabulary = {}) {
  const certain = vocabulary.certain || ARCANE_CERTAIN_PATTERN;
  const ambiguous = vocabulary.ambiguous === undefined
    ? ARCANE_AMBIGUOUS_PATTERN
    : vocabulary.ambiguous;
  const clean = stripNegatedMagic(text);
  if (!clean.trim()) return false;
  if (certain.test(clean)) return true;
  if (ambiguous && ambiguous.test(clean)) return textAssertsFunctionalMagic(clean);
  return false;
}

/**
 * THE COMPOSED READING. Catalog tag if there is one; the fallback otherwise.
 *
 * `catalogTag` is passed in rather than looked up so this one procedure serves both the
 * faction catalog (indexed above) and the institution catalog (indexed in
 * domain/arcaneInstitutionIdentity.js, which holds the 2,500-line data module away from
 * this leaf's import closure). One law, two catalog adapters — not two laws.
 *
 * @param {string} catalogTag  an ARCANE_IDENTITY value from a catalog adapter
 * @param {unknown} text       the entity's name/description, for the fallback
 * @param {{ certain?: RegExp, ambiguous?: RegExp|null }} [vocabulary]
 * @returns {boolean}
 */
export function resolveArcaneIdentity(catalogTag, text, vocabulary) {
  if (catalogTag === ARCANE_IDENTITY.ARCANE) return true;
  if (catalogTag === ARCANE_IDENTITY.MUNDANE) return false;
  return arcaneNameFallback(text, vocabulary);
}

/**
 * Is this FACTION arcane? The whole law applied to a faction row, string, or name.
 *
 * The name read is `.faction || .name` — rulingPower.nameOf's precedence, the house law
 * (`.name` is the legacy alias addFaction also mints). Spelled inline rather than through
 * `nameOf` itself because rulingPower imports factionArchetypes, which imports this
 * module: routing through the accessor would close an import cycle.
 *
 * @typedef {{ faction?: unknown, name?: unknown, label?: unknown, type?: unknown, description?: unknown }} FactionNameCarrier
 * @param {FactionNameCarrier|string|null|undefined} faction
 * @returns {boolean}
 */
export function isArcaneFaction(faction) {
  if (!faction) return false;
  if (typeof faction === 'string') {
    return resolveArcaneIdentity(factionCatalogArcaneTag(faction), faction);
  }
  const name = faction.faction || faction.name || faction.label || '';
  const tag = factionCatalogArcaneTag(name);
  if (tag !== ARCANE_IDENTITY.UNKNOWN) return tag === ARCANE_IDENTITY.ARCANE;
  const text = [faction.name, faction.faction, faction.label, faction.type, faction.description]
    .map((x) => String(x || '')).join(' ');
  return arcaneNameFallback(text);
}

/** Every authored faction name the index knows — for tests and drift detection. */
export function catalogFactionNames() {
  return [...FACTION_CATEGORY_BY_NAME.keys()];
}
