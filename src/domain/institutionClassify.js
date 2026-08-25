/**
 * domain/institutionClassify.js — id-first institution classifiers.
 *
 * Several consequence-bearing classifiers (food-anchor, law-and-order) resolve an
 * institution's ROLE by lowercased substring-matching its display name. That works
 * for a canonically-named catalog institution but silently misclassifies a
 * DM-renamed one — "Old Pete's grain hoard" contains no "granar", so the /granar/
 * rule drops the food-anchor role and the food-crisis consequence with it.
 *
 * This module mirrors the id-first pattern already used for the chain-processor /
 * keyword / export-gate joins (institutionMatches* in generators/computeActiveChains),
 * but is deliberately LIGHT — it depends ONLY on `data/` (the catalog + the stable
 * `catalogIdForName` slug index), so a pure derivation module like domain/causalState
 * can use it without pulling the heavy chain engine (and its transitive src/lib
 * dependency) into its import graph.
 *
 * The id-set is built from the SAME predicate as the name rule, so id-match ===
 * name-match for every UNRENAMED catalog institution — generation + event output
 * stay byte-identical (proven by tests/domain/institutionClassify.parity.test.js).
 * The win is purely additive: a DM-renamed-but-STAMPED institution keeps its
 * generation-time `catalogId` and stays classified; an unstamped custom institution
 * falls to the same name predicate as before.
 */

import { institutionalCatalog, catalogIdForName } from '../data/institutionalCatalog.js';

// Flat list of every canonical catalog institution name (across tiers/groups).
const ALL_CATALOG_NAMES = (() => {
  /** @type {Set<string>} */
  const names = new Set();
  for (const tierCatalog of Object.values(institutionalCatalog)) {
    for (const group of Object.values(/** @type {Record<string, Record<string, unknown>>} */ (tierCatalog))) {
      for (const name of Object.keys(group)) names.add(name);
    }
  }
  return [...names];
})();

/** Build the catalog-id set for a name predicate (lazily, once per predicate).
 * @param {(name: string) => boolean} predicate @returns {Set<string>} */
function idSetFor(predicate) {
  /** @type {Set<string>} */
  const set = new Set();
  for (const name of ALL_CATALOG_NAMES) {
    if (predicate(name)) {
      const id = catalogIdForName(name);
      if (id) set.add(id);
    }
  }
  return set;
}

// Generic id-first matcher for an ARBITRARY name regex (used by domain classifiers
// that pass a bespoke pattern rather than a fixed keyword — capacityModel, npcProfile).
// The id-set is memoized per regex source+flags. `re.lastIndex = 0` guards against a
// /g regex's stateful .test corrupting the set build (the patterns are non-/g, so it's
// a no-op today, but it keeps the helper correct for any caller).
/** @type {Map<string, Set<string>>} */
const _regexIdSets = new Map();
/** @param {RegExp} re @returns {Set<string>} */
function regexIdSet(re) {
  const key = `${re.source} ${re.flags}`;
  let set = _regexIdSets.get(key);
  if (!set) {
    set = idSetFor((name) => { re.lastIndex = 0; return re.test(name); });
    _regexIdSets.set(key, set);
  }
  return set;
}
/** Does this institution's name match a regex? Id-first for stamped, regex fallback.
 * @param {{ catalogId?: string, name?: string } | null | undefined} inst @param {RegExp} re @returns {boolean} */
export function institutionMatchesRegex(inst, re) {
  if (inst?.catalogId) return regexIdSet(re).has(inst.catalogId);
  re.lastIndex = 0;
  return re.test(String(inst?.name || ''));
}

// ── Food anchor: a settlement-level food PRODUCER (granary / silo / fishery /
// LOCAL mill) whose loss is a food crisis. Deliberately NOT retail —
// "fisher|fishing" catches Fisher's landing + Fishing community (production) but
// not Fish market / Fishmonger (a shop); a mill is an anchor unless it's a
// sawmill / lumber mill. This predicate is the EXACT legacy rule from mutateEntities.
/** @param {string} name @returns {boolean} */
function foodAnchorPredicate(name) {
  const n = String(name).toLowerCase();
  return /(granar|fisher|fishing|silo)/.test(n)
    || (n.includes('mill') && !n.includes('sawmill') && !n.includes('lumber'));
}

// ── Law and order: institutions that embody the rule of law (courts, the watch,
// magistrates, gaols). The EXACT regex that previously lived in causalState.deriveLawOrder.
const LAW_ORDER_INSTITUTION_RE = /court|magistrat|tribunal|watch|constab|gaol|jail|prison|assize|sheriff|marshal|justice/i;
/** @param {string} name @returns {boolean} */
function lawOrderPredicate(name) {
  return LAW_ORDER_INSTITUTION_RE.test(String(name));
}

/** @type {Set<string>|null} */
let _foodAnchorIds = null;
/** @type {Set<string>|null} */
let _lawOrderIds = null;

/** Is this institution a settlement-level food anchor? Id-first for stamped, name fallback.
 * @param {{ catalogId?: string, name?: string } | null | undefined} inst @returns {boolean} */
export function institutionIsFoodAnchor(inst) {
  if (inst?.catalogId) return (_foodAnchorIds ??= idSetFor(foodAnchorPredicate)).has(inst.catalogId);
  return foodAnchorPredicate(inst?.name || '');
}

/** Does this institution embody law & order? Id-first for stamped, name fallback.
 * @param {{ catalogId?: string, name?: string } | null | undefined} inst @returns {boolean} */
export function institutionIsLawOrder(inst) {
  if (inst?.catalogId) return (_lawOrderIds ??= idSetFor(lawOrderPredicate)).has(inst.catalogId);
  return lawOrderPredicate(inst?.name || '');
}

// Exported for the parity test (id-match === name-match for the current corpus).
export const _testing = { ALL_CATALOG_NAMES, foodAnchorPredicate, lawOrderPredicate };
