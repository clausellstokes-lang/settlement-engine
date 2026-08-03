/**
 * domain/arcaneInstitutionVocabulary.js — the authored arcane-institution vocabulary,
 * as a ZERO-IMPORT LEAF.
 *
 * These two lists have one home and always did; what changed is where that home sits in
 * the import graph. They used to live in `magicFilter.js` beside the filter functions
 * that consume them, and `magicFilter.js` is deliberately routed to the LAZY generation
 * bundle (vite.config.js excises it from ENGINE_SHARED_DOMAIN — no first-paint module
 * reaches its filters). When `arcaneInstitutionIdentity.js` — which sits in the EAGER
 * engine-core chunk — reached into it for these two constants, that single edge pointed
 * an eager chunk at a lazy one and closed a CHUNK-LEVEL CYCLE:
 *
 *     engine-core ──(ARCANE_INST_KW/TAGS)──▶ engine ──(FACTION_ARCHETYPES)──▶ engine-core
 *
 * ESM gives a cyclic graph no safe evaluation order, so `factionRoles.js`'s module-scope
 * `CANONICAL_TO_ROLE = Object.freeze({ [FA.CRIMINAL]: … })` read `FACTION_ARCHETYPES`
 * before its chunk-mate had initialised and the shipped bundle threw
 * `Cannot access 'Ot' before initialization` on boot — 347 of 471 chunks, the entry among
 * them. (Lane BT, 2026-08-03; introduced by a80c0be4, which first gave factionArchetypes
 * an arcaneIdentity edge. There is no source-level cycle: the cycle exists only between
 * CHUNKS, which is why a source-graph audit found nothing.)
 *
 * THE RULE THIS FILE ENCODES: shared VOCABULARY that both an eager authority and a lazy
 * filter need belongs in a leaf of its own, not inside whichever of the two happens to
 * have declared it first. A zero-import constant module can be co-located anywhere with
 * no ordering obligation at all.
 *
 * `magicFilter.js` re-exports both names, so every existing importer keeps its spelling
 * and no consumer census is owed. Membership and ORDER are byte-identical to the lists
 * that stood in magicFilter.js — `ARCANE_INST_KW` is consumed as an ordered `.some()`
 * scan and joined into an alternation by arcaneInstitutionIdentity, so reordering it
 * would be a live behaviour change dressed as a move.
 *
 * @guarded-by scripts/boot-smoke.mjs stage 1 (the chunk graph must stay acyclic).
 */

/** Catalog `tags:` values that mark an institution arcane. */
export const ARCANE_INST_TAGS = ['arcane', 'planar', 'alchemy', 'enchanting'];

/**
 * Catalog institution-name keywords that mark an institution arcane. Catalog-shaped and
 * deliberately broad ('dragon', 'undead', 'warden', 'great library' all mean what the
 * catalog says they mean); see arcaneInstitutionIdentity.js for why a surface classifying
 * USER-authored names must not reach for this list.
 */
export const ARCANE_INST_KW   = [
  'wizard', 'mage', 'alchemist', 'enchant', 'spell', 'arcane',
  'scroll scribe', 'scroll', 'rune',
  'teleportation', 'planar', 'dream parlor', 'airship',
  'message network', 'academy of magic',
  "mages' guild", "mages' district", 'alchemist quarter', 'enchanter',
  'druid circle', 'elder grove council', 'elder grove',
  'hedge wizard', 'traveling hedge wizard', 'warden',
  'healer (divine', 'wandering healer', 'divine healer',
  'alchemist shop', 'teleportation circle', 'planar embassy', 'great library',
  'golem', 'undead labor', 'undead', 'skeletal',
  'dragon resident', 'dragon',
  'scrying',
];
