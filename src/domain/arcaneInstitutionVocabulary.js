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
 *
 * ── TWO LISTS, TWO QUESTIONS (TE-CH-5, 2026-08-24, ODQ §541) ────────────────
 * `ARCANE_INST_TAGS` answers ONE question and must never be asked another:
 *
 *     "Does this institution NEED MAGIC TO EXIST?"
 *
 * It is a MAGIC-DEPENDENCE list. Every reader of it (the world law's
 * `carriesExplicitMagicMetadata`, `magicFilter`'s catalog/service filters, the
 * faction-boost eligibility filter, the authored-arcane verdict) is deciding
 * whether a candidate may stand in a MAGIC-FREE world. A member that names a
 * mundane craft therefore does not merely mis-label — it DELETES that craft from
 * every magic-free world.
 *
 * `alchemy` was such a member. It named a chemical trade, and four independent
 * authorities in this estate already said so, none of them consulted by the
 * other three:
 *   - `textAssertsFunctionalMagic('alchemy')` is FALSE, where `arcane`,
 *     `planar` and `enchanting` are all true (domain/magicAssertionText.js);
 *   - the `arcane` row of `INSTITUTION_KEYWORD_TAGS` carries an `enchant` stem
 *     and no `alchem` stem at all (lib/entities.js);
 *   - both alchemy-carrying catalog rows declare `magicLicense: 'none'`, where
 *     the planar and enchanting rows declare `'high'`;
 *   - `entityTags.js` files ALCHEMY in the A+ P1.6 trade block beside METALWORK,
 *     LEATHER, TEXTILE, TIMBER and SHIPBUILDING — not in "Knowledge + magic".
 *
 * So `alchemy` moved to `TRADE_INST_TAGS`, which answers the OTHER question —
 * "what craft is practised here?" — and which NO magic gate reads. The split is
 * exactly one member wide: `planar` and `enchanting` name practices that cannot
 * exist without magic, and both of their rows are licensed `high`.
 *
 * ⚠ A NEW MEMBER GOES IN THE LIST WHOSE QUESTION IT ANSWERS. If you cannot say
 * "a world with no magic cannot contain this" without qualification, it is a
 * trade tag. Tags that describe a craft, a material or a clientele are trade
 * tags even when the craft is practised by mages.
 *
 * ⚠ THIS FILE IS NOT THE ONLY HOME OF THE FOUR-MEMBER LIST'S CONTENT.
 * `domain/npcProfile.js`'s `POWER_DOMAIN_TAGS.arcane` needs the UNION of both
 * lists — power-domain affinity is a third question ("which power does this
 * institution belong to?"), and an alchemist genuinely does belong to the arcane
 * power. It used to hand-type all four members; it now spreads both lists, so a
 * member moved here cannot silently diverge there.
 */

/**
 * Catalog `tags:` values that mark an institution MAGIC-DEPENDENT — it cannot
 * exist in a world without magic. See the header: this list is a dependence
 * claim, not a subject-matter one.
 */
export const ARCANE_INST_TAGS = ['arcane', 'planar', 'enchanting'];

/**
 * Catalog `tags:` values that name a MUNDANE CRAFT which the arcane vocabulary
 * used to claim. No magic gate reads this list; it exists so the craft has a
 * home that is not a dependence claim. See the header for why `alchemy` is here.
 */
export const TRADE_INST_TAGS  = ['alchemy'];

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
