/**
 * domain/worldPulse/foundingCatalog.js — the MORAL FOUNDING catalog (W-C3 item 1).
 *
 * The institutions the moral founding lane can raise POST-GENERATION, weighted by a
 * settlement's patron plane: good/merciful planes found the BENEVOLENT set, cruel/
 * disorderly planes the EXPLOITATIVE set. These are LIFECYCLE-ONLY entries.
 *
 * WHY A SEPARATE LEAF, NOT src/data/institutionalCatalog.js (the GOLDEN TRAP).
 * Generation spreads institutionalCatalog defs onto instances and the generator
 * golden hashes JSON.stringify(settlement) WHOLE, so any entry reachable by the
 * selection tables would flip the manifest. This catalog is authored HERE, in a
 * worldPulse leaf that GENERATION NEVER IMPORTS (assembleInstitutions / cascade /
 * factionCorrelation / economy-viability all read institutionalCatalog only) — so
 * these entries are golden-inert BY CONSTRUCTION, like the W1 display side-car.
 * (src/data/* would also blow the first-paint byte budget: vite routes it into the
 * eager `data` chunk. This leaf rides the LAZY worldPulse sim chunk instead.)
 *
 * SINGLE SOURCE + DRIFT PIN. The `lean` here is the ENGINE source of the moral
 * coding for founded institutions — the analogue of moralMartialLean.js for
 * GENERATED institutions. The display side-car (domain/display/institutionVocabulary.js)
 * carries the IDENTICAL lean as part of INSTITUTION_MORAL_LEAN, pinned equal by
 * tests/data/institutionVocabulary.test.js (side-car ⊇ founding-catalog seed), and
 * an authored identity one-liner per name. Codings are CONSISTENT with the existing
 * vocabulary (cruelty/disorder coords): where a name matches the frozen leaf regex
 * (Almshouse, Hospice, Fighting pit) the value is IDENTICAL to it, so a founded
 * institution downstream reads the same lean whether by name or by stamp.
 *
 * Leans are SIGNED, −1..+1 per axis (moralMartialLean.js convention):
 *   • cruelty  +1 cruel (evil) · −1 merciful (good)
 *   • disorder +1 disorderly (chaos) · −1 orderly (law)
 *
 * PURE: imports NOTHING (headless leaf; no cycle). Generation never reaches it.
 */

/** @typedef {{ cruelty: number, disorder: number }} PlaneLean signed −1..+1 per axis */
/**
 * @typedef {Object} FoundingEntry
 * @property {string} name        EXACT institution name (the founded instance carries it verbatim)
 * @property {string} category    dossier section (mirrors the generation catalog's group names)
 * @property {'benevolent'|'exploitative'} set   which moral pole this belongs to (evidence bucketing)
 * @property {PlaneLean} lean     the moral coding that both weights emergence AND stamps the instance
 * @property {string[]} tags      instance tags
 * @property {string} desc        instance description
 */

/**
 * The founding set. Benevolent (cruelty−) first, then exploitative (cruelty/disorder+),
 * each ordered by descending mercy / ascending cruelty so the list reads as a moral
 * gradient. The founding lane never relies on this order (it sorts by fit), but a
 * stable authored order keeps diffs and evidence readable.
 * @type {ReadonlyArray<FoundingEntry>}
 */
export const FOUNDING_INSTITUTIONS = Object.freeze(/** @type {ReadonlyArray<FoundingEntry>} */ ([
  // ── benevolent pole (good/merciful planes raise these) ───────────────────────
  {
    name: 'Hospice',
    category: 'Religious',
    set: 'benevolent',
    lean: { cruelty: -0.8, disorder: -0.1 }, // == frozen leaf `hospice` regex
    tags: ['religious', 'healing', 'charity'],
    desc: 'A house of care for the dying and the incurably ill poor, kept by the faithful. No one is turned away for want of coin.',
  },
  {
    name: 'Almshouse',
    category: 'Religious',
    set: 'benevolent',
    lean: { cruelty: -0.7, disorder: -0.2 }, // == frozen leaf `almshouse` regex + town catalog
    tags: ['religious', 'healing', 'charity'],
    desc: 'A charitable house feeding and sheltering the destitute poor, the aged, and the disabled who cannot work. Endowed by the patron and its wealthy devout.',
  },
  {
    name: 'Orphanage',
    category: 'Religious',
    set: 'benevolent',
    lean: { cruelty: -0.7, disorder: -0.2 }, // consistent with orderly charity (almshouse coding)
    tags: ['religious', 'charity', 'children'],
    desc: 'A house that takes in parentless children and raises them until they can be apprenticed or placed. Order and mercy, kept by the temple.',
  },
  {
    name: 'House of healing',
    category: 'Religious',
    set: 'benevolent',
    lean: { cruelty: -0.6, disorder: -0.1 }, // consistent with sanctuary/hospice mercy pole
    tags: ['religious', 'healing', 'charity'],
    desc: 'A free infirmary that tends the sick and injured poor without fee, staffed by the patron\'s healers. Mercy made into a standing institution.',
  },
  // ── exploitative pole (cruel/disorderly planes raise these) ──────────────────
  {
    name: "Debtors' yard",
    category: 'Economy',
    set: 'exploitative',
    lean: { cruelty: 0.6, disorder: -0.6 }, // consistent with frozen leaf debtor's-prison (harsh + ordered)
    tags: ['economy', 'law_enforcement'],
    desc: 'A walled yard where those who cannot pay are set to labour until their debt is cleared. Sanctioned harshness, orderly and profitable.',
  },
  {
    name: 'Fighting pit',
    category: 'Entertainment',
    set: 'exploitative',
    lean: { cruelty: 0.55, disorder: 0.85 }, // == frozen leaf `fighting\s*pit` regex
    tags: ['entertainment', 'military'],
    desc: 'A ring where the desperate and the enslaved fight for a paying crowd. Blood for coin, rowdy and cruel.',
  },
]));

/** Name → entry (case-insensitive), memoized. @type {Map<string, FoundingEntry>} */
const BY_LOWER = new Map(FOUNDING_INSTITUTIONS.map((e) => [e.name.toLowerCase(), e]));

/** The founding entry for an exact (case-insensitive) name, or null.
 *  @param {string|null|undefined} name @returns {FoundingEntry | null} */
export function foundingEntryByName(name) {
  return BY_LOWER.get(String(name || '').toLowerCase()) || null;
}

/** True iff the name is one the founding lane can raise. @param {string|null|undefined} name @returns {boolean} */
export function isFoundingInstitution(name) {
  return BY_LOWER.has(String(name || '').toLowerCase());
}
