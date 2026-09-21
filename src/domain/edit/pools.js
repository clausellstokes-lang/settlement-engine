/**
 * pools.js — THE POOL MACHINERY AND THE ELEVEN TABLE POOLS (EM-A2a, wave 1).
 *
 * WHAT THIS IS. The settlement editor offers a DM a closed list wherever a field is
 * typed rather than free text, and it offers a dice button beside that list. This leaf
 * is both: `poolValues` answers the exact vocabulary a pool holds for one world, and
 * `rollFrom` picks one member deterministically. It lands DARK — nothing imports it at
 * this landing — and the card that will is EM-D2's.
 *
 * ⛔ EVERY VOCABULARY IS READ AT ITS SOURCE, NEVER COPIED (design section 12.7). A pool
 *    reads the GENERATOR'S own catalogue through its lawful domain address; it never
 *    reads a display seam (which relabels and passes unknowns through), never mirrors a
 *    union as a literal, and never mints a second tier gate. That is the whole point of
 *    the leaf: a forked copy would drift silently, and the acceptance file holds every
 *    table pool against its live source so a fork reds instead of shipping.
 *
 * ⛔ ELEVEN IMPORTS AND NOT ONE MORE, and no `src/generators` specifier among them. The
 *    domain-to-generators edge set is a shrink-only ratchet whose own message forbids
 *    widening it, and the institution readers live one layer down with a stable domain
 *    address (EM-P4) precisely so this leaf can read the catalogue without that edge.
 *
 * ⭐ THE PROMISE IS UNTOUCHED, STRUCTURALLY. `rollFrom` takes its seed as a PARAMETER,
 *    composes ONE root stream from it and draws exactly once. It never forks (so the
 *    delimiter families and the reserved `epoch` head cannot move), never reaches for
 *    the ambient generation RNG, never calls the host clock, and never takes a world
 *    draw — so no generated settlement can shift by one byte because a DM opened a
 *    dropdown. `n` rides IN the key rather than as a number of advances, which is what
 *    makes roll three reproducible without replaying rolls zero through two.
 *
 * ⛔ NO NUMBER HERE IS A SIMULATION DIAL. There is no weight, probability or ratio in
 *    this file, no fractional decimal literal anywhere in its code, and no module-level
 *    named numeric constant: under `src/domain` the tuning inventory counts both as
 *    unregistered dials and banks a new file at zero. The one integer is the literal
 *    zero of the roll-index clamp, which bounds an input and shapes no world.
 *
 * EM-A2b appends its world-derived rows to `POOLS` below and imports this machinery
 * unchanged; the table is authored so that an appended row needs no other edit here.
 */
import { createPRNG } from '../../kernel/prng.js';
import { compareCodepoint } from '../deterministicSort.js';
import { getInstitutionsForTier } from '../institutionLookups.js';
import { FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { NPC_STATUS_VALUES } from '../entities/npcs.js';
import { ENTITY_STATUS_VALUES } from '../entities/status.js';
import { TERRAIN_WEIGHTS, CULTURES } from '../worldFactOptions.js';
import { RESOURCE_DATA, SPECIAL_RESOURCES } from '../../data/resourceData.js';
import { TIER_ORDER } from '../../data/constants.js';
import { MONSTER_THREAT_TIERS } from '../../data/monsterThreat.js';
import { STRESS_TYPE_MAP } from '../../data/stressTypes.js';

/**
 * The read bag a pool is offered. EVERY field is optional and every absence is answered
 * with the empty list rather than a throw: the editor opens on whatever the save holds,
 * including a legacy record that predates a field.
 *
 * @typedef {object} PoolWorld
 * @property {string} [tier] the settlement's resolved tier. A STORED tier is always a
 *   concrete catalogue tier: the wizard's `random` and `custom` are resolved away at
 *   generation and never reach a record.
 * @property {Array<{name?: string, role?: string}>} [institutions]
 * @property {object} [pantheon]
 * @property {object} [namingData]
 * @property {string} [culture]
 * @property {string} [terrain]
 * @property {string} [tradeRoute]
 */

/**
 * Where one pool's members come from: a closed vocabulary that needs no world, or a
 * reader over the world bag. Exactly one of the two is spelled per row.
 *
 * @typedef {object} PoolSource
 * @property {readonly string[]} [values] a vocabulary the engine already holds frozen
 * @property {(world: PoolWorld) => readonly unknown[]} [read] a live read of a catalogue
 */

/**
 * ONE shared frozen empty array, returned BY IDENTITY for every unanswerable question,
 * so a caller may compare with `===` and a reader never allocates.
 * @type {readonly string[]}
 */
const EMPTY = Object.freeze([]);

/**
 * The owner's five causes for removing a record (ODQ section 934.36 addendum). This is
 * the ONE vocabulary in this file spelled as a literal, and it is lawful here because
 * the engine holds it nowhere else: no member is a member of either status union, so it
 * claims no word the union walker's derived trigger depends on.
 * @type {readonly string[]}
 */
const CAUSE_REMOVE = Object.freeze(['burned', 'died', 'dissolved', 'left', 'seized']);

/**
 * THE ELEVEN TABLE POOLS. Each row names its source and nothing else; the normalization,
 * the order and the freeze are `poolValues`' business, once, for every row.
 *
 * ⛔ A row reads THE ENGINE'S OWN TABLE. `institution.class` reads the tier-gated
 *    catalogue through the domain address EM-P4 publishes, whose exports are the same
 *    function objects the data home exposes; terrain and culture read the wizard's own
 *    option sets at EM-P3's domain address, so a drift between the menu and the table is
 *    caught by the acceptance rather than shipped; the two state pools read the frozen
 *    vocabulary each union keeps in its OWN home file, imported and never re-spelled.
 *
 * ⭐ AN ABSENT `tier` READS THE VILLAGE CATALOGUE. That default is this module's
 *    contract decision and not an inherited one: the tier reader has no special case and
 *    answers an empty set for anything outside the ladder.
 *
 * ⭐ EM-A2b APPENDS HERE. Its world-derived rows go at the foot of this table.
 *
 * @type {Readonly<Record<string, PoolSource>>}
 */
export const POOLS = Object.freeze({
  'institution.class': { read: (world) => [...getInstitutionsForTier(world.tier ?? 'village')] },
  'faction.category': { read: () => Object.values(FACTION_ARCHETYPES) },
  'cause.remove': { values: CAUSE_REMOVE },
  commodity: {
    read: () => [
      ...Object.values(RESOURCE_DATA).flatMap((row) => row.commodities ?? []),
      ...Object.keys(SPECIAL_RESOURCES),
    ],
  },
  tier: { values: TIER_ORDER },
  'npc.status': { values: NPC_STATUS_VALUES },
  'institution.state': { values: ENTITY_STATUS_VALUES },
  'worldFact.terrain': { read: () => TERRAIN_WEIGHTS.map(([terrain]) => terrain) },
  'worldFact.culture': { values: CULTURES },
  'worldFact.monsterThreat': { values: MONSTER_THREAT_TIERS },
  'worldFact.stressors': { read: () => Object.keys(STRESS_TYPE_MAP) },
});

/**
 * Every value a pool offers for one world: normalized, de-duplicated, ordered and frozen.
 *
 * NORMALIZATION NEVER REPAIRS AND NEVER THROWS. A legacy or malformed member is coerced
 * with `String`, trimmed, and dropped if it is blank or already seen; the first
 * occurrence wins. An unknown pool id, an absent world and an unanswerable read all
 * return the shared frozen empty array, because membership is the declaration walker's
 * business and a missing field is a state the editor must open on, not a failure.
 *
 * ORDER IS CODEPOINT, WITH ONE STATED EXCEPTION. `compareCodepoint` is the estate's one
 * locale-free string order. `tier` keeps `TIER_ORDER`'s sequence verbatim because there
 * the order IS the meaning (smallest settlement to largest), and the acceptance pins that
 * exemption in both directions so nobody can quietly sort it.
 *
 * @param {string} poolId
 * @param {PoolWorld | null} [world]
 * @returns {readonly string[]} frozen; never null, never undefined, never a throw
 */
export function poolValues(poolId, world) {
  const source = POOLS[poolId];
  if (!source) return EMPTY;
  const raw = source.values ?? source.read?.(world ?? {});
  if (!Array.isArray(raw)) return EMPTY;
  /** @type {Set<string>} */
  const seen = new Set();
  /** @type {string[]} */
  const out = [];
  for (const value of raw) {
    const text = String(value).trim();
    if (text !== '' && !seen.has(text)) {
      seen.add(text);
      out.push(text);
    }
  }
  if (poolId !== 'tier') out.sort(compareCodepoint);
  return Object.freeze(out);
}

/**
 * Pick one member of a pool, deterministically, on a stream of this leaf's own.
 *
 * THE KEY IS A ROOT COMPOSITION, NEVER A FORK: single-colon segments under the head
 * `edit-pool`, which is neither a reserved head nor a member of any frozen delimiter
 * family, so the fork-label contract cannot move for this leaf. `n` is a SEGMENT of the
 * key rather than a count of advances, so roll three is reproducible on its own.
 *
 * @param {string} poolId
 * @param {PoolWorld | null} world
 * @param {string} seed the settlement's seed, PASSED IN; this leaf reads no world root
 * @param {string} entryId the record the roll belongs to
 * @param {number} n the roll index
 * @returns {string | null} a member, or null for an empty pool. Never undefined.
 */
export function rollFrom(poolId, world, seed, entryId, n) {
  const values = poolValues(poolId, world);
  if (values.length === 0) return null;
  // `n` after the clamp of the contract's step 3: a bad index is answered with the first
  // roll rather than a throw. The bound is the integer literal zero, deliberately not a
  // named numeric constant.
  const rollIndex = Number.isInteger(n) && n >= 0 ? n : 0;
  const rng = createPRNG(`edit-pool:${poolId}:${String(seed)}:${entryId}:${rollIndex}`);
  const picked = rng.pick(values);
  // Step two above makes this unreachable; it is kept because `pick`'s own contract
  // answers undefined for an empty array, and this function's does not.
  return picked === undefined ? null : picked;
}
