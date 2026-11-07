/**
 * domain/institutions/institutionCategory.js — WHAT KIND OF HOUSE AN INSTITUTION IS, read once.
 *
 * CENSUS-4c (the chair's answer 3 to CENSUS-4b, 2026-11-05): "`guild.js` re-reading the guild
 * word is NOT acceptable — it is a second reader of one fact. Move `isCommerceGuild` into the
 * domain, one definition, and have the generator import it from there." The guild detector stood
 * in `generators/roleCategory.js` on two generator helpers (`computeActiveChains.js ::
 * institutionMatchesKeyword` and the category detectors), and the domain may not import a
 * generator, so the census's `guild` home re-read the word with a regex of its own. The chain
 * moves here VERBATIM; the generators re-export it (the dependency runs generators → domain), and
 * `facts/guild.js` delegates to `isCommerceGuild`.
 *
 * Catalog institutions carry a `category` (the catalog GROUP — 'Criminal', 'Magic', 'Religious',
 * …), `tags`, and `catalogId` (assembleInstitutions stamps these). Categorize by that metadata
 * instead of name substrings: the old `name.includes('thieves'|'church'|'wizard')` tests missed
 * entire institution families ('Street gang', 'Wayside shrine', 'Teleportation circle', …) and
 * could false-hit on coincidental substrings. The catalog GROUP plus a small set of clean tags is
 * the precise signal; `institutionMatchesKeyword` (id-first, substring fallback) backstops
 * unstamped / custom / legacy institutions by name.
 *
 * PURE and DETERMINISTIC — no rng, no Date, no locale-dependent ordering.
 */
import { institutionalCatalog, catalogIdForName } from '../../data/institutionalCatalog.js';
import { isMaterializedCustomContent } from '../content/customContentSemanticAuthority.js';

/** Every native catalog institution name, every tier, first-seen order. */
export const ALL_CATALOG_NAMES = Object.freeze((() => {
  const names = new Set();
  for (const tierCatalog of Object.values(institutionalCatalog)) {
    for (const group of Object.values(tierCatalog)) {
      for (const name of Object.keys(group)) names.add(name);
    }
  }
  return [...names];
})());

// ── Keyword (substring) id-set — the tradition / magic-transit twin of the processor id-set
// (A+ generators.4). The tradition + _hasInst gates match by raw `name.includes(keyword)`, so
// they need their own keyword→catalog-id resolution built from that exact rule. Built once per
// keyword: id-match === name-includes-match for an unrenamed catalog institution BY
// CONSTRUCTION, so generation output is byte-identical; a DM-renamed-but-stamped institution
// stays matched (rename-proof), a bare-renamed (unstamped) one falls to the fuzzy substring path.
/** @type {Map<string, Set<string>>} */
const _keywordIdSets = new Map();
/** @param {string} keyword @returns {Set<string>} */
function keywordIdSet(keyword) {
  const key = String(keyword || '').toLowerCase();
  let set = _keywordIdSets.get(key);
  if (!set) {
    set = new Set();
    for (const name of ALL_CATALOG_NAMES) {
      if (name.toLowerCase().includes(key)) {
        const id = catalogIdForName(name);
        if (id) set.add(id);
      }
    }
    _keywordIdSets.set(key, set);
  }
  return set;
}

/**
 * The institution fields the category readers consult: a catalog row (`catalogId`, `category`,
 * `tags`, stamped by assembleInstitutions) or an unstamped custom / legacy / DM row (its `name`).
 * @typedef {{ catalogId?: string | null, name?: unknown, category?: unknown, tags?: unknown }} InstitutionLike
 */

/**
 * Does this institution match a keyword? Id-first for stamped, substring fallback.
 * @param {InstitutionLike | null | undefined} inst @param {string} keyword @returns {boolean}
 */
export function institutionMatchesKeyword(inst, keyword) {
  if (inst?.catalogId) return keywordIdSet(keyword).has(inst.catalogId);
  if (isMaterializedCustomContent(inst)) return false;
  return String(/** @type {InstitutionLike | null | undefined} */ (inst)?.name || '').toLowerCase().includes(String(keyword).toLowerCase());
}

/** Lowercased catalog group of an institution, '' when absent. @param {InstitutionLike | null | undefined} inst */
const groupOf = (inst) => String(inst?.category || '').toLowerCase();
/** Lowercased tag set of an institution. @param {InstitutionLike | null | undefined} inst @returns {string[]} */
const tagsOf = (inst) => (Array.isArray(inst?.tags) ? inst.tags : []).map((/** @type {unknown} */ t) => String(t).toLowerCase());

// Per-category detector: clean GROUP + clean TAGS, with name-keyword fallbacks
// (via institutionMatchesKeyword) for unstamped institutions that carry neither.
/** @type {Readonly<Record<string, { groups: string[], tags: string[], nameKeywords: string[] }>>} */
const CATEGORY_DETECTORS = Object.freeze({
  criminal: {
    groups: ['criminal'],
    tags: ['criminal', 'smuggling'],
    nameKeywords: ['thieves', 'black market', 'smuggl', 'fence', 'gang', 'outlaw', 'assassin'],
  },
  magic: {
    groups: ['magic', 'exotic'],
    tags: ['arcane', 'alchemy', 'planar'],
    nameKeywords: ['wizard', 'mage', 'alchemist', 'enchant', 'arcane', 'teleportation'],
  },
  religion: {
    groups: ['religious'],
    tags: ['religious', 'church', 'monastery'],
    nameKeywords: ['church', 'cathedral', 'monastery', 'temple', 'shrine', 'priest', 'friary'],
  },
});

/**
 * Does a single institution belong to the given metadata category
 * ('criminal' | 'magic' | 'religion')? GROUP + tags first, name keywords as the
 * unstamped/custom fallback.
 *
 * @param {InstitutionLike | null | undefined} inst
 * @param {'criminal'|'magic'|'religion'} category
 * @returns {boolean}
 */
export function institutionInCategory(inst, category) {
  const det = CATEGORY_DETECTORS[category];
  if (!det || !inst) return false;
  // Current custom metadata is presentation-only in the manifest. Custom
  // mechanics must enter through registered fields, never by borrowing native
  // category/tag/name classification.
  if (isMaterializedCustomContent(inst)) return false;
  const group = groupOf(inst);
  if (det.groups.includes(group)) return true;
  const tags = tagsOf(inst);
  if (det.tags.some((t) => tags.includes(t))) return true;
  // Fallback for institutions with no usable metadata (custom / legacy / DM):
  // match by name keyword (id-first when stamped, substring otherwise).
  if (!/** @type {InstitutionLike} */ (inst).category && tags.length === 0) {
    return det.nameKeywords.some((kw) => institutionMatchesKeyword(inst, kw));
  }
  return false;
}

/**
 * THE ONE GUILD READER. Is this institution a (non-criminal) guild? Drives the guild-master NPC
 * and the census's `guild` presence atom (`facts/guild.js`). Metadata-first: a 'guild' tag is the
 * catalog's own guild marker; criminal guilds (Thieves' guild, Assassins' guild) are excluded via
 * the criminal detector. Name substring ('guild') backstops unstamped institutions.
 *
 * @param {InstitutionLike | null | undefined} inst
 * @returns {boolean}
 */
export function isCommerceGuild(inst) {
  if (!inst) return false;
  if (isMaterializedCustomContent(inst)) return false;
  if (institutionInCategory(inst, 'criminal')) return false;
  const tags = tagsOf(inst);
  if (tags.includes('guild')) return true;
  return institutionMatchesKeyword(inst, 'guild');
}
