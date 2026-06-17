/**
 * data/entityTags.js — Canonical tag vocabulary for mechanical entities.
 *
 * Why this exists:
 *   Today, mechanics across the codebase check institution / faction /
 *   service / resource types via name-pattern matching:
 *
 *     name.toLowerCase().includes('watch')
 *     /temple|shrine|church/.test(institution.name)
 *
 *   That works until someone renames "Town Watch" to "Civic Guard" and
 *   silently breaks the security/legitimacy/defense calculations. The
 *   long-term fix is for every mechanical entity to carry a stable id
 *   and a set of canonical tags — mechanics then query by tag, not name.
 *
 * What this file declares:
 *   - TAG: an object of constants. Use TAG.SECURITY, not 'security', so
 *     a typo becomes a build error rather than a silent miss.
 *   - TAG_GROUPS: documented bundles for common queries
 *     (e.g. "any law-and-order institution").
 *   - validateTag: dev-mode helper that warns on unknown tags.
 *
 * What this file deliberately does NOT do:
 *   - Modify existing data files. Institutions already have a `tags` field;
 *     this vocabulary documents the canonical values without forcing a
 *     rename. Old data with non-canonical tags (e.g. `'civic'` instead of
 *     `'public_authority'`) keeps working; future cleanup migrations can
 *     normalize them.
 *   - Provide the institution catalog with IDs. That's a separate registry
 *     step; the catalog uses names as keys today, and stable IDs would
 *     require coordinating with every catalog consumer.
 *
 * Consumers query through `src/lib/entities.js`, not this file directly.
 */

// ── Canonical tag vocabulary ───────────────────────────────────────────────
// Frozen object so a typo'd `TAG.SECRITY` becomes `undefined` at runtime,
// not a silent string mismatch.

export const TAG = Object.freeze({
  // Authority + governance
  PUBLIC_AUTHORITY: 'public_authority',
  CIVIC:            'civic',
  LEGAL:            'legal',

  // Force + protection
  SECURITY:    'security',
  LAW:         'law',
  DEFENSE:     'defense',
  PUBLIC_ORDER: 'public_order',
  MILITARY:    'military',

  // Welfare + community
  WELFARE:    'welfare',
  HEALING:    'healing',
  EDUCATION:  'education',
  RELIGIOUS:  'religious',

  // Economy + trade
  ECONOMIC:   'economic',
  TRADE:      'trade',
  CRAFT:      'craft',
  AGRICULTURE: 'agriculture',
  MARKET:     'market',
  FOOD:       'food',

  // Knowledge + magic
  ARCANE:     'arcane',
  SCHOLARLY:  'scholarly',
  MAGIC:      'magic',

  // Civic infrastructure
  INFRASTRUCTURE: 'infrastructure',
  TRANSPORT:     'transport',
  // (A+ data-schema.5 removed COMMUNICATION — it was an orphan: no catalog
  // entry declared it, no TAG_GROUPS bundle held it, and no keyword-backfill
  // rule produced it, so no query could ever select it. Dead vocabulary that
  // implied a capability the engine never had. A TAG.* becoming unreachable
  // like this again fails the gate.
  // @enforced-by tests/data/dataVocabularyCoverage.test.js)

  // Underground / illicit
  CRIMINAL:   'criminal',
  SMUGGLING:  'smuggling',
  ILLICIT:    'illicit',

  // Production
  RESOURCE_EXTRACTION: 'resource_extraction',
  INDUSTRY:            'industry',

  // ── A+ P1.6 — the 27 tags the institutionalCatalog actually uses that were
  // previously ungoverned (validateTag/isKnownTag silently passed them). Adding
  // them as canonical constants brings catalog coverage to 42/42 WITHOUT editing
  // the catalog data (zero behavior change). Some are synonyms of the tags above
  // (economy≈economic, church/divine/monastery≈religious, law_enforcement≈law,
  // fortification≈defense, underground≈illicit) — folding/normalizing those in the
  // catalog data is a deliberate follow-on; governing them is the safe first step.
  LAW_ENFORCEMENT: 'law_enforcement',
  FORTIFICATION:   'fortification',
  CHURCH:          'church',
  DIVINE:          'divine',
  MONASTERY:       'monastery',
  ECONOMY:         'economy',
  BANKING:         'banking',
  GUILD:           'guild',
  LUXURY:          'luxury',
  EXOTIC:          'exotic',
  WAREHOUSE:       'warehouse',
  PORT:            'port',
  ALCHEMY:         'alchemy',
  ENCHANTING:      'enchanting',
  METALWORK:       'metalwork',
  LEATHER:         'leather',
  TEXTILE:         'textile',
  TIMBER:          'timber',
  SHIPBUILDING:    'shipbuilding',
  PLANAR:          'planar',
  HOUSING:         'housing',
  LODGING:         'lodging',
  SANITATION:      'sanitation',
  WATER:           'water',
  ADVENTURING:     'adventuring',
  ESSENTIAL:       'essential',
  UNDERGROUND:     'underground',
});

// ── Tag groups ─────────────────────────────────────────────────────────────
// Reusable bundles for common "is this institution any kind of X?" queries.
// Centralizing means a future addition to a category (e.g. adding a new
// security tag) updates every consumer of the group in one place.

export const TAG_GROUPS = Object.freeze({
  // "Any institution that enforces order"
  ENFORCEMENT:  [TAG.SECURITY, TAG.LAW, TAG.PUBLIC_ORDER, TAG.MILITARY],

  // "Any institution where a sick / hungry / displaced person could
  // expect help" — drives welfare-capacity computations.
  WELFARE_PROVIDER: [TAG.WELFARE, TAG.HEALING, TAG.RELIGIOUS],

  // "Any institution that participates in trade-route economics"
  TRADE_PARTICIPANT: [TAG.TRADE, TAG.MARKET, TAG.ECONOMIC, TAG.CRAFT],

  // "Any institution that produces or stores food"
  FOOD_SYSTEM: [TAG.FOOD, TAG.AGRICULTURE, TAG.MARKET],

  // "Any institution with magical / arcane competency"
  MAGIC_SYSTEM: [TAG.ARCANE, TAG.MAGIC, TAG.SCHOLARLY],

  // "Any underground actor"
  UNDERGROUND: [TAG.CRIMINAL, TAG.SMUGGLING, TAG.ILLICIT],
});

// ── Dev-mode validation ────────────────────────────────────────────────────

const VALID_TAGS = new Set(Object.values(TAG));

/**
 * Returns true if `t` is a known canonical tag. Used by `hasTag` and
 * `tagsOf` in dev mode to surface unknown values without crashing.
 *
 * Today, many existing entities use non-canonical tags ('civic',
 * 'commercial', etc.). Those will resolve as valid string tags via
 * `hasTag` but won't appear in `TAG`. The mismatch is allowed — this
 * helper is for tooling that wants to detect drift, not for runtime
 * filtering.
 */
export function isKnownTag(t) {
  return typeof t === 'string' && VALID_TAGS.has(/** @type {any} */ (t));
}
