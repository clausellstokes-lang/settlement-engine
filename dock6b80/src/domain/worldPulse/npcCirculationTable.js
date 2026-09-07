/**
 * domain/worldPulse/npcCirculationTable.js — W-H3: THE AUTHORED, CLOSED CIRCULATION
 * TABLES (rejection compatibility, turncoat capacity, faction capacity).
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §6 admission / rejection / turncoat flow, §6d the
 * criminal destination generalization; laws 3 TOTALITY, 4 FINITE SEMANTICS.)
 *
 * WHAT THIS IS. Three authored tables and the predicates that read them. They are
 * separated from the circulation FLOW (npcCirculation.js) for the same reason the
 * verdict table is separate from the verdict apply: a table is data the owner retunes
 * by reading it, and a flow is control that the tables must not be tangled into.
 *
 * ── EVERY TABLE IS TOTAL OVER ITS VOCABULARY, AND THE WALK PROVES IT ─────────
 * A rejection table with a hole does not throw; it silently ADMITS, which is the worst
 * possible failure for a compatibility check because the missing cell looks like
 * tolerance. So the tables are keyed on closed vocabularies the estate already owns
 * (factionArchetypes.FACTION_ARCHETYPES, npcLedgerFacets.SCANDAL_CLASSES /
 * ALIGNMENT_READS, npcFacetContract.NPC_ROLE_ARCHETYPES) and each one is enumerable
 * from this module, so the pin WALKS the vocabulary rather than sampling fixtures.
 *
 * ── THE UNDERWORLD REFUSES NOBODY, AND THAT IS THE POINT (§6d) ───────────────
 * The criminal archetype's aversion row is deliberately EMPTY. Design §6d generalizes
 * criminal destinations across the whole realm precisely so a disgraced official always
 * has one door left; a criminal syndicate that turned people away for venality would
 * close it. This is the single most consequential authored cell in the file, so it is
 * named here rather than left to be inferred from an empty array.
 *
 * ── CAPACITY IS AUTHORED, NOT INFERRED ──────────────────────────────────────
 * The estate has never had a faction member cap. Deriving one from the current roster
 * (say, "a faction is full at its median size") would make capacity a function of who
 * already joined, which is a feedback loop wearing a formula. It is authored by
 * settlement tier in NPC_CONSEQUENCES_TUNING instead: a thorp's council seats fewer
 * people than a city's, and nothing about who is already seated changes that.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/npcCirculation.test.js
 */

import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { NPC_ROLE_ARCHETYPES } from '../npc/npcFacetContract.js';
import { SCANDAL_CLASSES, ALIGNMENT_READS, closedValue, notorietyRank } from './npcLedgerFacets.js';
import { NPC_CONSEQUENCES_TUNING } from './npcConsequencesTuning.js';

/**
 * THE CLOSED REJECTION VOCABULARY (design §6: authored, closed). A refusal names one of
 * these and nothing else, so the rejection news item and the cooldown edge both key on
 * a bank rather than on prose.
 * @type {ReadonlyArray<string>}
 */
export const REJECTION_REASONS = Object.freeze([
  'banished_from_here',
  'scandal_class_unacceptable',
  'alignment_opposed',
  'notoriety_too_loud',
]);

/**
 * THE CLOSED ADMISSION OUTCOME VOCABULARY (design §6). Four outcomes and no fifth:
 * a door opens at the bottom rung, a sibling faction is founded under the same power,
 * the person is refused, or there was no compatible power to ask.
 * @type {ReadonlyArray<string>}
 */
export const ADMISSION_OUTCOMES = Object.freeze([
  'admitted_lowest',
  'founded_sibling',
  'rejected',
  'remained_roaming',
]);

/**
 * THE TURNCOAT CAPACITY VOCABULARY (design §6, J-D8b iv). Exactly these five words.
 * @type {ReadonlyArray<string>}
 */
export const TURNCOAT_CAPACITIES = Object.freeze([
  'advisor',
  'agent',
  'quartermaster',
  'envoy',
  'enforcer',
]);

/**
 * THE AVERSION TABLE: which scandal classes each faction archetype will not seat.
 *
 * Keyed on the canonical FACTION_ARCHETYPES vocabulary, TOTAL over it (every archetype
 * has a row, including the empty ones), and read only through rejectionFor below.
 *
 * The authored logic is a court's, not a formula's: a state cannot seat a proven
 * traitor, a merchant house that trades on trust cannot seat a proven thief, a temple
 * cannot seat a heretic, and the underworld (§6d) refuses nobody at all.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const ARCHETYPE_SCANDAL_AVERSIONS = Object.freeze({
  [FACTION_ARCHETYPES.GOVERNMENT]: Object.freeze(['betrayal', 'conspiracy']),
  [FACTION_ARCHETYPES.CIVIC]: Object.freeze(['venality', 'conspiracy']),
  [FACTION_ARCHETYPES.NOBLE]: Object.freeze(['betrayal', 'brutality']),
  [FACTION_ARCHETYPES.MILITARY]: Object.freeze(['betrayal', 'conspiracy']),
  [FACTION_ARCHETYPES.MERCHANT]: Object.freeze(['venality']),
  [FACTION_ARCHETYPES.RELIGIOUS]: Object.freeze(['heresy', 'brutality']),
  // §6d: EMPTY ON PURPOSE. The underworld is the realm-wide door that never shuts.
  [FACTION_ARCHETYPES.CRIMINAL]: Object.freeze([]),
  [FACTION_ARCHETYPES.ARCANE]: Object.freeze(['heresy']),
  [FACTION_ARCHETYPES.CRAFT]: Object.freeze(['venality']),
  [FACTION_ARCHETYPES.LABOR]: Object.freeze(['brutality']),
  // An outsider band and an occupying garrison both take who they can get; the garrison
  // draws the one line its own survival depends on.
  [FACTION_ARCHETYPES.OUTSIDER]: Object.freeze([]),
  [FACTION_ARCHETYPES.OCCUPATION]: Object.freeze(['betrayal']),
  [FACTION_ARCHETYPES.OTHER]: Object.freeze([]),
});

/**
 * THE TURNCOAT CAPACITY MAP: an NPC's role archetype to the capacity a rival power
 * gives them. TOTAL over NPC_ROLE_ARCHETYPES.
 *
 * NO PROSE INFERENCE. npcAgency.js carries a private role-label matcher over free text,
 * and re-deriving a capacity from a display title here would fork it. This table reads
 * the ARCHETYPE TOKEN only (from npcStates, or from the NPC's declared role facet), and
 * an absent or unknown token takes the documented default rather than a guess.
 * @type {Readonly<Record<string, string>>}
 */
export const TURNCOAT_CAPACITY_BY_ROLE = Object.freeze({
  ruler: 'advisor',
  heir: 'advisor',
  civic: 'advisor',
  religious: 'advisor',
  military: 'enforcer',
  criminal: 'enforcer',
  merchant: 'quartermaster',
  labor_resource: 'quartermaster',
  healer: 'quartermaster',
  diplomat_outsider: 'envoy',
  arcane: 'agent',
  dissident: 'agent',
});

/**
 * The capacity for a role the map does not name. 'agent' is the honest default: a rival
 * power that does not know what to do with somebody uses them as an asset, which is the
 * least specific of the five words and the one that presumes the least.
 */
export const TURNCOAT_CAPACITY_DEFAULT = 'agent';

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {unknown[]} */
function asArray(v) {
  return Array.isArray(v) ? v : [];
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/**
 * The turncoat capacity for a role archetype token. Total: every vocabulary member
 * resolves, and anything else takes TURNCOAT_CAPACITY_DEFAULT.
 * @param {unknown} roleArchetype an NPC_ROLE_ARCHETYPES member
 * @returns {string} a TURNCOAT_CAPACITIES member
 */
export function turncoatCapacityFor(roleArchetype) {
  const token = text(roleArchetype);
  const mapped = NPC_ROLE_ARCHETYPES.includes(token)
    ? TURNCOAT_CAPACITY_BY_ROLE[token]
    : null;
  return mapped && TURNCOAT_CAPACITIES.includes(mapped) ? mapped : TURNCOAT_CAPACITY_DEFAULT;
}

/**
 * How many seats a faction in this settlement holds. Authored by tier (see the module
 * header for why it is not inferred), total on an unknown or absent tier.
 * @param {unknown} settlement
 * @returns {number} a positive integer
 */
export function factionSeatsFor(settlement) {
  const tier = text(asObject(settlement).tier).toLowerCase();
  const seats = /** @type {Record<string, number>} */ (
    NPC_CONSEQUENCES_TUNING.FACTION_SEATS_BY_TIER
  )[tier];
  return Number.isFinite(seats) && seats > 0 ? seats : NPC_CONSEQUENCES_TUNING.FACTION_SEATS_DEFAULT;
}

/**
 * Does this faction have an open seat? A faction with no members list reads as EMPTY
 * rather than as full: the power roster (`powerStructure.factions[]`) carries no
 * members at all on real pipeline output, and treating that as a full house would make
 * every power-roster faction permanently closed for a reason that has nothing to do
 * with the fiction.
 * @param {unknown} faction @param {unknown} settlement
 * @returns {boolean}
 */
export function factionHasOpenSeat(faction, settlement) {
  return asArray(asObject(faction).members).length < factionSeatsFor(settlement);
}

/**
 * Are these two alignment reads STRICT OPPOSITES? Only good-versus-evil counts: a
 * neutral read and an unknown read oppose nothing, because a faction that turned away
 * everybody it had formed no opinion of would turn away almost everybody.
 * @param {unknown} a @param {unknown} b @returns {boolean}
 */
export function alignmentReadsOppose(a, b) {
  const left = closedValue(a, ALIGNMENT_READS);
  const right = closedValue(b, ALIGNMENT_READS);
  return (left === 'good' && right === 'evil') || (left === 'evil' && right === 'good');
}

/**
 * @typedef {Object} RejectionVerdict
 * @property {boolean} rejected
 * @property {string|null} reason        a REJECTION_REASONS member, null when admitted
 * @property {string} archetype          the faction archetype the check ran against
 */

/**
 * THE COMPATIBILITY CHECK (design §6): does this faction refuse this person?
 *
 * The inputs are (roamer facets AS BELIEVED HERE x faction archetype x alignment x
 * reputation marks x past-history flags), exactly as the design lists them. The
 * BELIEF is the caller's business (npcCirculationBelief.js derives it); this function
 * is deliberately blind to whether it was handed truth or a rumour, so the same table
 * governs both and neither can drift from the other.
 *
 * ORDER IS AUTHORED, and the first refusal wins so the reason a reader is given is the
 * most legally significant one: an edict outranks a scandal, a scandal outranks an
 * alignment quarrel, and volume is the last thing anybody objects to.
 *
 * @param {Object} args
 * @param {unknown} args.faction              the faction record (either home)
 * @param {{ notorietyBand?: unknown, scandalClass?: unknown, alignmentRead?: unknown, edictMark?: unknown }} args.believed
 * @param {unknown} [args.factionAlignmentRead]  an ALIGNMENT_READS member, when known
 * @param {{ banishedFromHere?: boolean }} [args.history]
 * @returns {RejectionVerdict}
 */
export function rejectionFor({ faction, believed, factionAlignmentRead = 'unknown', history = {} }) {
  const archetype = factionArchetype(/** @type {Parameters<typeof factionArchetype>[0]} */ (
    /** @type {unknown} */ (asObject(faction))
  ));
  const marks = asObject(believed);
  const scandal = closedValue(marks.scandalClass, SCANDAL_CLASSES);
  const loudness = notorietyRank(marks.notorietyBand);
  const strict = loudness >= NPC_CONSEQUENCES_TUNING.REJECTION_NOTORIETY_RANK;

  if (asObject(history).banishedFromHere === true) {
    return { rejected: true, reason: 'banished_from_here', archetype };
  }
  const aversions = ARCHETYPE_SCANDAL_AVERSIONS[archetype] || ARCHETYPE_SCANDAL_AVERSIONS[FACTION_ARCHETYPES.OTHER];
  // A scandal only bites once the story is LOUD ENOUGH to have reached the gate. This is
  // the seam that makes belief load-bearing: the same person is refused where the tale
  // arrived and admitted where it did not, through one table and one strictness band.
  if (strict && scandal !== 'none' && aversions.includes(scandal)) {
    return { rejected: true, reason: 'scandal_class_unacceptable', archetype };
  }
  if (alignmentReadsOppose(marks.alignmentRead, factionAlignmentRead)) {
    return { rejected: true, reason: 'alignment_opposed', archetype };
  }
  // The last bar: a person spoken of at the top of the band is too loud for anybody who
  // has to answer for who they seat, whatever the story was about.
  if (loudness >= notorietyRank('infamous') && aversions.length > 0) {
    return { rejected: true, reason: 'notoriety_too_loud', archetype };
  }
  return { rejected: false, reason: null, archetype };
}

/**
 * Every faction record on a settlement, from BOTH homes, tagged with which home it came
 * from. The two lists are not the same list (the power roster versus the NPC grouping
 * roster), and admission cares which: only the grouping home carries members, so only it
 * can answer a capacity question truthfully.
 * @param {unknown} settlement
 * @returns {Array<{ faction: Record<string, unknown>, home: string }>}
 */
export function circulationFactions(settlement) {
  const s = asObject(settlement);
  /** @type {Array<{ faction: Record<string, unknown>, home: string }>} */
  const out = [];
  for (const f of asArray(s.factions)) out.push({ faction: asObject(f), home: 'grouping' });
  for (const f of asArray(asObject(s.powerStructure).factions)) out.push({ faction: asObject(f), home: 'power' });
  return out;
}
