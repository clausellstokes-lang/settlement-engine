// entityVocabulary.js — THE canonical entity-name vocabulary layer.
//
// WHY THIS EXISTS. The engine's deepest structural fragility is exact-string
// coupling between parallel data maps: institution / resource / good names are
// defined in one map and referenced by literal string in many others
// (GATE_FEATURES requires, requiredInstitution on trade goods and services,
// RESOURCE_CHAINS rawResource vs terrain allowedResources, instBoosts keys,
// GOVERNMENT_INSTITUTIONS groups…). Every one of those joins fails SILENTLY on
// drift — a rename or typo on either side disables a gate, a classification, or
// a cross-link with no error. Two full review cycles kept surfacing the same
// class ("Bakers' guild" vs "Bakers (5-15)", "copper ore" vs "copper",
// 'University' vs 'Academy of magic').
//
// THE FIX has two halves:
//   1. THIS MODULE — one place that builds each entity family's canonical
//      vocabulary, memoized, so every consumer (runtime and tests) shares the
//      SAME definition of "what names exist" instead of re-deriving it with
//      subtle differences (the old test-local builder, for instance, added
//      GOVERNMENT_INSTITUTIONS' category KEYS instead of its institution-name
//      VALUES — the guard itself had drifted).
//   2. tests/data/stringCouplingRegistry.test.js — a registry of EVERY
//      cross-map string join, each asserting its references resolve in the
//      vocabulary here (with a pinned, documented exception set), plus a
//      self-enforcing site sweep so a NEW joining field cannot ship
//      unregistered.
//
// LAYERING. This lives in src/data and imports ONLY sibling data modules, so
// domain, generators, lib, and tests can all import it without creating a new
// domain→generators edge (that baseline is frozen by
// tests/build/domainGeneratorsBoundary.test.js and may only shrink).
// SPATIAL_FEATURES (a generators export) is therefore NOT imported here — the
// callers that need it (tests) pass it in via the `extraNames` parameter.
//
// SEMANTICS. This module does NOT change how any join matches — generation
// joins stay byte-identical. It provides the vocabularies and exact-resolution
// checks; normalizing/synonym matching remains owned by the consumers that
// already do it (instMatchesProcessor, goodsCatalog's normalizeGood).

import { institutionalCatalog } from './institutionalCatalog.js';
import { GATE_FEATURES, INSTITUTION_SPATIAL, GOVERNMENT_INSTITUTIONS } from './spatialData.js';
import { TERRAIN_DATA } from './geographyData.js';

// ── Institutions ─────────────────────────────────────────────────────────────

let _catalogNames = null;
/**
 * The EMITTABLE institution vocabulary: names assembleInstitutions can actually
 * place on a settlement. Only institutionalCatalog produces these during
 * generation (custom user content is arbitrary and deliberately NOT included).
 * @returns {Set<string>}
 */
export function catalogInstitutionNames() {
  if (_catalogNames) return _catalogNames;
  const names = new Set();
  for (const tier of Object.values(institutionalCatalog)) {
    for (const category of Object.values(tier)) {
      for (const name of Object.keys(category)) names.add(name);
    }
  }
  _catalogNames = names;
  return names;
}

let _governmentNames = null;
/**
 * Every institution NAME in GOVERNMENT_INSTITUTIONS — the VALUES of its
 * group→names map ("Village reeve", "Weekly market", …), not the group keys.
 * structuralValidator joins these against settlement institutions by exact
 * string (the government-selection check), so they are part of the defined
 * vocabulary.
 * @returns {Set<string>}
 */
export function governmentInstitutionNames() {
  if (_governmentNames) return _governmentNames;
  const names = new Set();
  const groups = Array.isArray(GOVERNMENT_INSTITUTIONS)
    ? { all: GOVERNMENT_INSTITUTIONS }
    : (GOVERNMENT_INSTITUTIONS || {});
  for (const options of Object.values(groups)) {
    for (const name of options || []) names.add(name);
  }
  _governmentNames = names;
  return names;
}

/**
 * The DEFINED institution vocabulary: every name the validation layer treats as
 * a real institution reference target. This is deliberately a SUPERSET of the
 * emittable catalog — GATE_FEATURES keys include dormant gates for custom /
 * aspirational institutions ("University", "Curse breaking"), a tested design
 * (see SUPERSET_GATE_KEYS in tests/data/institutionNameIntegrity.test.js).
 *
 * @param {Iterable<string>} [extraNames] additional names from layers this
 *   module must not import (e.g. structuralValidator's SPATIAL_FEATURES keys —
 *   a generators export; the data layer cannot depend on generators).
 * @returns {Set<string>}
 */
export function definedInstitutionNames(extraNames = []) {
  const defined = new Set(catalogInstitutionNames());
  for (const key of Object.keys(GATE_FEATURES)) defined.add(key);
  for (const entry of INSTITUTION_SPATIAL) {
    if (entry?.institution) defined.add(entry.institution);
  }
  for (const name of governmentInstitutionNames()) defined.add(name);
  for (const name of extraNames) defined.add(name);
  return defined;
}

// ── Resources ────────────────────────────────────────────────────────────────

let _terrainResources = null;
/**
 * The terrain resource vocabulary: the union of every terrain's
 * allowedResources. A RESOURCE_CHAINS.rawResource that resolves in NO terrain
 * can never be classified exploited/exported/gapped (the join in
 * evaluateEconomicActivity is membership against this vocabulary).
 * @returns {Set<string>}
 */
export function terrainResourceNames() {
  if (_terrainResources) return _terrainResources;
  const names = new Set();
  for (const terrain of Object.values(TERRAIN_DATA)) {
    for (const r of terrain?.allowedResources || []) names.add(r);
  }
  _terrainResources = names;
  return names;
}

// ── Resolution checks ────────────────────────────────────────────────────────

/**
 * Exact-resolution check: does `name` exist in `vocabulary`? Exists as a named
 * helper (rather than bare Set.has at call sites) so registry entries and
 * consumers read uniformly and the join style is greppable.
 * @param {string} name @param {Set<string>} vocabulary
 */
export function resolvesIn(name, vocabulary) {
  return vocabulary.has(name);
}

/**
 * Report every string in `names` that does NOT resolve in `vocabulary` —
 * the primitive the string-coupling registry is built on.
 * @param {Iterable<string>} names @param {Set<string>} vocabulary
 * @returns {string[]} sorted orphans
 */
export function unresolvedIn(names, vocabulary) {
  const orphans = new Set();
  for (const name of names) {
    if (name && !vocabulary.has(name)) orphans.add(name);
  }
  return [...orphans].sort();
}
