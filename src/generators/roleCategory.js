/**
 * roleCategory.js
 * Shared role-keyword → category classification + institution-metadata category
 * detection. ONE source of truth imported by npcGenerator.js and
 * narrativeGenerator.js so the two stop maintaining divergent copies of the
 * same role/keyword tables.
 *
 * Three concerns live here:
 *  1. roleToCategory(role)        — classify an NPC role string into a category.
 *  2. factionPoolCategory(npc, r) — the category the NPC→faction gate reads, which
 *                                   falls back to the ROLE when the role catalog
 *                                   filed the NPC under its generalist bucket.
 *  3. institutionCategoryFlags()  — derive criminal/magic/religion presence from
 *                                   institution catalog metadata (group category +
 *                                   tags), not brittle name substrings.
 *
 * Both are PURE and DETERMINISTIC — no rng, no Date, no locale-dependent ordering.
 */

import {
  institutionInCategory,
  isCommerceGuild,
} from '../domain/institutions/institutionCategory.js';

// The institution-category chain and the ONE guild reader live in the domain (CENSUS-4c, the
// chair's answer 3): re-exported here so every generator import keeps its path.
export { institutionInCategory, isCommerceGuild };

// ─── Role → category keyword map ──────────────────────────────────────────────
// Each category lists the role-name keywords that imply it. The map is grouped by
// category for readability, but matching is LONGEST-KEYWORD-FIRST (see
// buildRoleKeywordIndex) so a generic substring never shadows a specific role —
// e.g. 'lord' (government) must not swallow 'crime lord' (criminal) or 'lord of
// the manor' (noble), and 'official' must not swallow 'corrupt official'.
//
// Keep these in sync with the ROLE_FACTION_MAP keyword grouping in npcGenerator's
// mergeNPCLists: this module classifies a role into a CATEGORY; that map binds a
// role into a concrete settlement FACTION. They share the same vocabulary.
export const ROLE_CATEGORY_KEYWORDS = Object.freeze({
  government: [
    'elder', 'mayor', 'reeve', 'steward', 'magistrate', 'council', 'governor',
    'chancellor', 'judge', 'sheriff', 'official', 'chamberlain',
  ],
  military: [
    'captain', 'commander', 'constable', 'warden', 'marshal', 'quartermaster',
    'garrison', 'sergeant', 'watch chief', 'city watch', 'guard',
  ],
  religious: [
    'priest', 'cleric', 'bishop', 'abbot', 'monk', 'friar', 'inquisitor',
    'prelate', 'healer', 'chaplain', 'deacon', 'archivist', 'priestess',
  ],
  magic: [
    'wizard', 'mage', 'archmage', 'alchemist', 'enchant', 'druid', 'sage',
    'scholar', 'sorcerer', 'magister',
  ],
  economy: [
    'merchant', 'guild master', 'guildmaster', 'factor', 'overseer',
    'moneylender', 'banker', 'tradesman', 'broker', 'harbour master',
  ],
  criminal: [
    'thief', 'smuggler', 'fence', 'crime lord', 'assassin', 'bandit',
    'racketeer', 'corrupt official', 'kingpin',
  ],
  noble: [
    'baron', 'baroness', 'duke', 'duchess', 'lord', 'lady', 'manor',
    'noble', 'dame', 'knight', 'land agent',
  ],
  crafts: [
    'blacksmith', 'carpenter', 'weaver', 'tanner', 'brewer', 'potter',
    'glassblower', 'mason', 'craft', 'journeyman',
  ],
});

// Flattened [keyword, category] pairs, sorted longest-keyword-first so the most
// specific role substring wins. Built once at module load (pure data → stable).
const ROLE_KEYWORD_INDEX = (() => {
  const pairs = [];
  for (const [category, keywords] of Object.entries(ROLE_CATEGORY_KEYWORDS)) {
    for (const kw of keywords) pairs.push([kw, category]);
  }
  return pairs.sort((a, b) => b[0].length - a[0].length);
})();

/**
 * Classify an NPC role string into a category via longest-keyword-first match.
 * Returns the supplied fallback (default 'other') when no keyword matches.
 *
 * @param {string} role
 * @param {string} [fallback='other']
 * @returns {string} category
 */
export function roleToCategory(role, fallback = 'other') {
  const r = String(role || '').toLowerCase();
  if (!r) return fallback;
  for (const [keyword, category] of ROLE_KEYWORD_INDEX) {
    if (r.includes(keyword)) return category;
  }
  return fallback;
}

// Merchant-stress keywords. The wartime/migration/slave-revolt goal overrides in
// npcGenerator key a 'merchant' bucket that must catch economically-oriented
// roles even when roleToCategory resolves them to a NON-economy category because
// a longer keyword wins under longest-keyword-first matching. Concretely:
// 'Journeyman Overseer' resolves to crafts ('journeyman' > 'overseer') and
// 'Craft Guild Representative' resolves to crafts ('craft'), yet both are guild/
// trade leadership that should take the merchant stress goal — exactly as the
// pre-unification hand-rolled merchant test (merchant|guild|factor|overseer) did.
// gov/mil/rel still win via the override selector's branch precedence.
const MERCHANT_STRESS_KEYWORDS = Object.freeze(['merchant', 'guild', 'factor', 'overseer']);

/**
 * Does this role take the merchant/economic stress-goal override? True for the
 * economy category and for any role carrying a merchant-economic keyword (so
 * guild/overseer crafts roles are not silently dropped). Pure and deterministic.
 *
 * @param {string} role
 * @returns {boolean}
 */
export function roleTakesMerchantStress(role) {
  const r = String(role || '').toLowerCase();
  if (!r) return false;
  if (roleToCategory(r) === 'economy') return true;
  return MERCHANT_STRESS_KEYWORDS.some(kw => r.includes(kw));
}

// ─── The faction-pool gate ────────────────────────────────────────────────────

/** The one word the gate below needs and the shared map above must not gain. */
const GATE_MERCENARY_ROLE = /\b(?:mercenar(?:y|ies)|sellsword)\b/;

/**
 * THE FACTION-POOL CATEGORY — the category npcGenerator's NPC→faction gate should
 * read, which is NOT always the one the role catalog filed the NPC under.
 *
 * POWER_ROLES_BY_CATEGORY files roughly a third of its rows under the generalist
 * `other` bucket, and getUpgradeOpportunities stamps that BUCKET key onto every row
 * it emits. mergeNPCLists' CATEGORY_COMPAT reads `other` as `null`, and `null` there
 * means "any faction at all" — so the one role table that says least about its
 * holders was the one the compatibility gate stopped reading, and a steppe village
 * printed the result: "Khurelbaatar Mangghud — Kheshig — Mercenary-for-Hire ·
 * Religious Authorities". A generalist row still SAYS what its holder does, so when
 * the catalog declines to classify the NPC this classifies the ROLE instead. A role
 * the keyword map cannot place either returns 'other', and the pool stays
 * unrestricted exactly as before.
 *
 * ⚠ 'mercenary' IS READ HERE AND DELIBERATELY NOT ADDED TO ROLE_CATEGORY_KEYWORDS
 * ABOVE — which is why the gate lives in this file and not somewhere a future editor
 * would have to guess. That map also selects npcGenerator's stress-goal overrides,
 * whose `mil` arm is a garrison officer's goal ("keep unit cohesion as conscription
 * pulls away experienced soldiers") — a sentence a sword who sells himself by the
 * season must not inherit. Widening the shared map would have cured the faction and
 * broken the goal in the same edit.
 *
 * ⛔ IT NARROWS A POOL, IT DOES NOT DRAW. Pure and deterministic; npcGenerator's
 * single capacity-weighted roll keeps its count and its position in the stream, and
 * the existing relax cascade still catches a pool this empties.
 *
 * @param {{ category?: unknown }} npc
 * @param {string} roleLower the NPC's role, lowercased
 * @returns {string} category
 */
export function factionPoolCategory(npc, roleLower) {
  const bucket = String(npc?.category || 'other').toLowerCase();
  if (bucket !== 'other') return bucket;
  if (GATE_MERCENARY_ROLE.test(roleLower)) return 'military';
  return roleToCategory(roleLower);
}

// ─── Institution-metadata category detection ──────────────────────────────────
// `institutionInCategory` and its detectors moved to `domain/institutions/institutionCategory.js`
// (CENSUS-4c), re-exported above.

/**
 * Derive criminal / magic / religion presence flags for a settlement's
 * institution list using catalog metadata. Replaces the ad-hoc
 * `names.some(n => n.includes(...))` triple in NPC secret-type weighting.
 *
 * @param {Array<Object>} institutions
 * @returns {{hasCriminal:boolean, hasMagic:boolean, hasReligion:boolean}}
 */
export function institutionCategoryFlags(institutions = []) {
  const insts = (institutions || []).filter(Boolean);
  return {
    hasCriminal: insts.some(i => institutionInCategory(i, 'criminal')),
    hasMagic: insts.some(i => institutionInCategory(i, 'magic')),
    hasReligion: insts.some(i => institutionInCategory(i, 'religion')),
  };
}
