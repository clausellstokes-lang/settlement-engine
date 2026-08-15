/**
 * domain/arcaneInstitutionIdentity.js — the INSTITUTION adapter for the canonical arcane
 * detector (chair ruling R-BLD-5). The law lives once in domain/arcaneIdentity.js; this
 * module only supplies the institution catalog's authored tag to it.
 *
 * WHY A SECOND FILE AND NOT A SECOND FUNCTION. `institutionalCatalog.js` is a 2,500-line
 * data module. `arcaneIdentity.js` is imported (through factionArchetypes) by ~30 domain
 * and worldPulse modules that sit in the eager pulse closure, and pulling the institution
 * catalog into that closure re-parents 2,500 lines of data for the sake of a faction
 * question that never needs it. Splitting the ADAPTER keeps the catalog beside its own
 * consumers (generators, custom content) while the LAW stays single. Two adapters, one law.
 *
 * THE AUTHORED TAG. An institution is arcane when the catalog author tagged it so —
 * `tags: ['arcane' | 'planar' | 'alchemy' | 'enchanting']`, the list magicFilter has always
 * owned — or when the entity carries explicit magic metadata. It is NOT arcane merely for
 * sitting in the `Magic` or `Exotic` display bucket: 'Great library' is filed under Magic
 * and authored `tags: ['education']`, and a repository of books is not a spellbook. That
 * asymmetry IS the ruling: the tag is the authored semantics, the bucket is a shelf.
 *
 * Pure; tolerant of partial inputs; never throws.
 */

import { institutionalCatalog } from '../data/institutionalCatalog.js';
// The VOCABULARY leaf, not magicFilter.js itself. Same two lists (magicFilter
// re-exports them), but magicFilter is routed to the LAZY generation bundle while this
// adapter sits in EAGER engine-core — importing it from here pointed an eager chunk at a
// lazy one and closed the chunk cycle that made dist un-bootable (lane BT, 2026-08-03).
// See domain/arcaneInstitutionVocabulary.js's header for the whole account.
import { ARCANE_INST_KW, ARCANE_INST_TAGS } from './arcaneInstitutionVocabulary.js';
import { ARCANE_IDENTITY, arcaneNameFallback } from './arcaneIdentity.js';

/** @param {unknown} value @returns {string} */
function normName(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/** @param {unknown} tags @returns {string[]} */
function normTags(tags) {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim().toLowerCase());
  if (typeof tags === 'string') {
    return tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
  }
  return [];
}

/** @param {string[]} tags @returns {boolean} */
function tagsAreArcane(tags) {
  return tags.some((t) => t === 'magic' || t === 'magical' || ARCANE_INST_TAGS.includes(t));
}

/**
 * The authored institution index: normalized catalog name → true when the author tagged it
 * arcane. Built once over every tier. The catalog repeats names across tiers; a name whose
 * tiers disagree would be an authoring defect, so the index records the OR and
 * `conflictingArcaneCatalogNames()` exposes any disagreement for a pin to fail on.
 * @type {Map<string, boolean>}
 */
const ARCANE_BY_CATALOG_NAME = new Map();
/** @type {Set<string>} */
const CONFLICTS = new Set();

for (const tiers of Object.values(institutionalCatalog || {})) {
  for (const insts of Object.values(tiers || {})) {
    for (const [name, def] of Object.entries(insts || {})) {
      const key = normName(name);
      if (!key) continue;
      const arcane = tagsAreArcane(normTags(def?.tags)) || def?.magical === true;
      if (ARCANE_BY_CATALOG_NAME.has(key)) {
        if (ARCANE_BY_CATALOG_NAME.get(key) !== arcane) CONFLICTS.add(key);
        if (arcane) ARCANE_BY_CATALOG_NAME.set(key, true);
      } else {
        ARCANE_BY_CATALOG_NAME.set(key, arcane);
      }
    }
  }
}

/**
 * The authored arcane verdict for an institution NAME: ARCANE / MUNDANE when the catalog
 * knows it, UNKNOWN otherwise.
 * @param {unknown} name
 * @returns {string} an ARCANE_IDENTITY value
 */
export function institutionCatalogArcaneTag(name) {
  const key = normName(name);
  if (!key) return ARCANE_IDENTITY.UNKNOWN;
  if (!ARCANE_BY_CATALOG_NAME.has(key)) return ARCANE_IDENTITY.UNKNOWN;
  return ARCANE_BY_CATALOG_NAME.get(key)
    ? ARCANE_IDENTITY.ARCANE
    : ARCANE_IDENTITY.MUNDANE;
}

/**
 * magicFilter's keyword list expressed as one alternation, so the shared procedure in
 * arcaneIdentity can run it as its CERTAIN tier. DERIVED from the list, never re-typed —
 * a keyword added there is honoured here with no second edit, which is the whole point of
 * reusing the estate's existing vocabulary instead of spelling a fifth one.
 *
 * ⚠️ ONE DELIBERATE DIVERGENCE: each keyword is anchored at a WORD BOUNDARY here, and
 * magicFilter's own `isArcaneInst` uses bare `includes()`. The reason is 'mage' inside
 * 'PILGRIMAGE'. MG-4's realm-scope census caught it live: a mundane metropolis's
 * "Pilgrimage destination" and "Pilgrimage services" — a CATHEDRAL's services — read as
 * arcane content. magicFilter never trips on it because both of its callers key strictly
 * on catalog INSTITUTION names, and no catalog institution name contains the substring
 * (verified by scan; only two DESCRIPTIONS do). This detector is also asked about free
 * text, where the substring is reachable, so it anchors. `archmage` is restored
 * explicitly, since a leading boundary would otherwise lose it.
 *
 * The residual — magicFilter's own unanchored list, latent for the catalog and live for
 * any future caller that passes it free text — is recorded in DESIGN_REALM_MAGIC_TOGGLE.md
 * (MG-4 block) rather than fixed here: changing it moves filterCatalogForMagic and
 * filterServicesForMagic, which is a live behaviour change outside this ruling's four sites.
 */
const ARCANE_INSTITUTION_CERTAIN = new RegExp(
  ['archmage', ...ARCANE_INST_KW]
    .map((kw) => `\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
    .join('|'),
  'i',
);

/**
 * THE FALLBACK for a non-catalog institution — custom content, an imported roster, a
 * neighbour's invented org. Strikes the world law's denial clauses first (R-BLD-5), then
 * runs magicFilter's vocabulary as the certain tier. There is no ambiguous tier: every
 * keyword on that list names a practice ("scroll scribe", "teleportation circle"), not a
 * building material.
 *
 * ⚠️ THAT LIST IS BROAD AND CATALOG-SHAPED. It carries 'dragon', 'undead', 'warden' and
 * 'great library' because it was authored to strip CATALOG institutions from a magic-off
 * world, where those names mean what the catalog says they mean. It is a poor classifier
 * for free-text user content — 'Dragonbone Foundry' is a smithy — so a surface that
 * classifies user-authored names must NOT reach for this fallback. domain/customContent.js
 * deliberately keeps its own name pattern for exactly that reason.
 *
 * @param {unknown} name
 * @returns {boolean}
 */
export function arcaneInstitutionNameFallback(name) {
  return arcaneNameFallback(name, { certain: ARCANE_INSTITUTION_CERTAIN, ambiguous: null });
}

/**
 * Is this INSTITUTION arcane? Catalog tag first; then any tag/metadata the caller's own
 * record carries; then the name fallback.
 *
 * @param {string|{name?:string,label?:string,tags?:unknown,category?:unknown,magical?:boolean}|null|undefined} institution
 * @param {unknown} [category]  the catalog bucket, when the caller has it separately
 * @returns {boolean}
 */
export function isArcaneInstitution(institution, category) {
  const entity = typeof institution === 'string' ? { name: institution } : (institution || {});
  const name = entity.name || entity.label || '';
  const tag = institutionCatalogArcaneTag(name);
  if (tag !== ARCANE_IDENTITY.UNKNOWN) return tag === ARCANE_IDENTITY.ARCANE;

  // No catalog identity. An explicit authored tag on the record itself still outranks the
  // name — this is the custom-content author saying it directly.
  const ownTags = normTags(entity.tags);
  if (ownTags.length && tagsAreArcane(ownTags)) return true;
  if (entity.magical === true) return true;
  const bucket = String(category ?? entity.category ?? '').trim().toLowerCase();
  if (bucket === 'magic') return true;

  return arcaneInstitutionNameFallback(name);
}

/** Catalog names whose tiers disagree about arcane-ness — must stay empty. */
export function conflictingArcaneCatalogNames() {
  return [...CONFLICTS];
}

/** Every catalog institution name the index knows — for tests and drift detection. */
export function catalogInstitutionNames() {
  return [...ARCANE_BY_CATALOG_NAME.keys()];
}
