/**
 * phantoms.js — THE PHANTOM COUNTERPARTY AS A HIDDEN SAVE, AND THE OFF-STAGE RESOLVER
 * (EM-F1, wave 5; design §2.8 and §13, ODQ §934.43, the chair's judgment 261).
 *
 * WHAT THIS IS. A DM may name a settlement that does not exist — a neighbour to declare
 * war on, a partner to open trade with — and the estate answers with a MINIMAL SAVE
 * RECORD rather than a second entity class. `mintPhantom` writes that record; the shelf
 * keeps it off the library; the neighbour back-link resolves it exactly as it resolves a
 * real save; and `consequenceFor` is the apply-time resolver EM-B1b's off-stage rows
 * point at when they carry `consequence: 'by-target-reality'`.
 *
 * ⛔ THIS MODULE IMPORTS NOTHING AT RUN TIME, AND THAT IS MEASURED RATHER THAN CHOSEN.
 * The deterministic id minter lives beside the DM layer and the pool roller beside the
 * pool table, and BOTH of those leaves carry an EXACT importer roster asserted set-equal
 * in both directions by a landed arm — the pool leaf's names one importer and one only
 * (EM-A2a's own acceptance), EM-A1's and EM-B1a's name three and one. A runtime edge
 * from here would red an arm this packet does not own. So `mintId` and `roll` are
 * INJECTED, exactly as the DM layer takes its declaration consult and the decree registry
 * takes its catalogues (judgment 77; EM-C1's §5 clause). Two further things follow, and
 * they are the reason the shape is right rather than merely permitted: the LIBRARY SHELF
 * may import this leaf for one predicate without dragging a pool catalogue into the
 * library's chunk, and every acceptance below is provable against a frozen stub.
 *
 * ⛔ NO PRNG, NO CLOCK, NO LOCALE, NO STORE, NO COMPONENTS, NO GENERATORS. The seed is a
 * PARAMETER and the draw belongs to the injected roller, so no generated settlement can
 * shift by one byte because a DM founded a phantom. Nothing here throws and nothing here
 * mutates an argument.
 *
 * ⭐ THE RECORD RIDES THE BLOB, AND THAT IS WHY IT NEEDS NO COLUMN (judgment 261). The
 * save path assigns the settlement object WHOLE to the `data` column, and EM-B3a's landed
 * persistence acceptance proves an opaque editor key byte-exact through save → list →
 * writeAll → list. So a phantom is a save whose BLOB is this record: the envelope beside
 * it keeps the columns it always had, and no SQL change is owed. The envelope is NOT this
 * leaf's to write — an envelope key is a column, and a column is the owner's keystrokes.
 *
 * ⭐ THE DISCRIMINANT IS `kind: 'phantom'`, AND THE COLLISION WITH DESIGN §2.8 IS RESOLVED
 * RATHER THAN INHERITED. Design §2.8 spells a phantom's place-type as a pool field also
 * called `kind`; judgment 261, the charter row and this packet's acceptance all spell the
 * RECORD's discriminant `kind: 'phantom'`. The later and more specific word wins at the
 * top level, and §2.8's pooled words live inside `traits`, where nothing shadows them.
 *
 * ⛔ THE POOLED TRAITS ARE THE POOLS THAT EXIST, READ AT THEIR SOURCE. `size` is the tier
 * pool, `culture` and `terrain` the wizard's own option sets — three live pool ids, joined
 * to the live table by the acceptance rather than spelled twice. Design §2.8's `kind` and
 * `stance` are NOT rolled here, and that is a measurement: neither word has a pool at its
 * source, so rolling one would MINT a vocabulary in a file this packet does not own. The
 * stance is already carried where it belongs — the neighbour link's own
 * `relationshipType`, written by the back-link when the phantom resolves — and the
 * place-type in this estate IS the tier.
 *
 * ⛔ THE CONSEQUENCE RULE IS STRUCTURAL, NOT POLICED. `applyOffStage` returns the world it
 * was handed BY IDENTITY, for a phantom target and a real one alike: design §13 gives a
 * phantom act exactly two products, the home procedures and the record, and gives a REAL
 * counterparty to the simulator, which "the editor only hands the decree". So the editor
 * writes no world fact on either path and the arm that proves it is an identity check
 * rather than a diff. The home procedures are the estate's own muster, casualty, upkeep
 * and readiness mechanics; EM-E1's tick hook runs them, and this leaf names the policy
 * that hook applies and nothing else.
 *
 * ⭐ THE BADGE AND THE POLICY ARE ONE FACT READ TWICE. Both come from `isRealCounterparty`,
 * so a registry row badged REAL can never be resolved as record-only, and a row badged
 * PHANTOM can never reach world state. The acceptance asserts the biconditional.
 *
 * ⛔ FAIL CLOSED MEANS FAIL TOWARD THE PHANTOM. An absent, malformed or merely REFERENCED
 * counterparty is not a PROVEN saved settlement, so it reads PHANTOM and record-only. The
 * safe direction is the one that writes no world state; the costly error would be the
 * other one.
 */

/** @typedef {import('./types.js').Op} Op */
/** @typedef {import('./types.js').EntityRef} EntityRef */

/**
 * @typedef {{ culture: string, size: string, terrain: string }} PhantomTraits
 * @typedef {{ id: string, kind: string, name: string, seed: string,
 *   traits: PhantomTraits }} PhantomRecord
 * @typedef {'home-procedures+record'|'world'} ConsequencePolicy
 * @typedef {'PHANTOM'|'REAL'} CounterpartyBadge
 *
 * The two producers a caller binds. `mintId` mirrors BY SHAPE the DM layer's own
 * deterministic id mint (seed, kind, index) and `roll` the pool table's own roller
 * (pool id, world bag, seed, entry id, roll index); this leaf calls both defensively and
 * imports neither.
 * @typedef {{ mintId: (seed: string, kind: string, n: number) => unknown,
 *   roll: (poolId: string, world: null, seed: string, entryId: string,
 *     n: number) => unknown }} PhantomTools
 */

/** The discriminant, spelled ONCE. It is also the DM layer's own identity class word. */
export const PHANTOM_KIND = 'phantom';

/**
 * The trait names and the LIVE pool id each one is rolled from, in codepoint order. The
 * acceptance joins every value here to the live pool table, so a renamed pool reds rather
 * than silently rolling nothing.
 * @type {Readonly<Record<string, string>>}
 */
export const PHANTOM_TRAIT_POOLS = Object.freeze({
  culture: 'worldFact.culture',
  size: 'tier',
  terrain: 'worldFact.terrain',
});

/**
 * EVERY key the minted record carries, codepoint order — the minimality claim AS DATA, so
 * the acceptance asserts it set-equal in both directions instead of re-typing a shape.
 * @type {readonly string[]}
 */
export const PHANTOM_RECORD_KEYS = Object.freeze(['id', 'kind', 'name', 'seed', 'traits']);

/**
 * The resolved consequence policies of design §13, codepoint order. These are the words
 * `consequence: 'by-target-reality'` RESOLVES TO at apply time; the declaration's own two
 * policies are the op catalogue's and are a different vocabulary.
 * @type {readonly ConsequencePolicy[]}
 */
export const PHANTOM_CONSEQUENCE_POLICIES = Object.freeze(
  /** @type {const} */ (['home-procedures+record', 'world']),
);

/** The registry's two badges (design §13), codepoint order. */
export const COUNTERPARTY_BADGES = Object.freeze(/** @type {const} */ (['PHANTOM', 'REAL']));

/** The declaration-level policy this resolver answers for. Spelled, never imported. */
const BY_TARGET_REALITY = 'by-target-reality';

const RECORD_ONLY = PHANTOM_CONSEQUENCE_POLICIES[0];
const WORLD = PHANTOM_CONSEQUENCE_POLICIES[1];
const BADGE_PHANTOM = COUNTERPARTY_BADGES[0];
const BADGE_REAL = COUNTERPARTY_BADGES[1];

/**
 * ONE shared frozen empty array, returned BY IDENTITY for every world answer, so a caller
 * may compare with `===` and this leaf allocates nothing on the rule's hot half.
 * @type {readonly never[]}
 */
const NO_WORLD_FACTS = Object.freeze(/** @type {never[]} */ ([]));

/** @param {unknown} value @returns {value is Record<string, unknown>} a plain object, never an array and never null */
function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {value is string} a non-empty string */
function isName(value) {
  return typeof value === 'string' && value.length > 0;
}

/**
 * (1) THE MINT. Deterministic from the seed, total, THROWS NEVER.
 *
 * The id is the injected minter's, under this leaf's own identity class, so the same
 * (seed, index) pair names the same phantom forever and no second hash is spelled here.
 * Every trait is one roll of one live pool keyed by the id, so trait three is reproducible
 * without replaying traits one and two.
 *
 * @param {unknown} seed the settlement's seed, PASSED IN; this leaf reads no world root
 * @param {unknown} name the free name the found-phantom op's payload carries
 * @param {unknown} n the mint index, a non-negative safe integer
 * @param {unknown} tools the INJECTED `PhantomTools`, read defensively
 * @returns {PhantomRecord|null} a DEEPLY FROZEN record carrying EXACTLY
 *   `PHANTOM_RECORD_KEYS`, or `null`. `null` means the record could not be minted
 *   minimally — a malformed argument, an unusable tool bag, a producer that threw, or a
 *   pool that answered nothing. ⛔ A PARTIAL RECORD IS NEVER RETURNED, because a partial
 *   record is a persisted shape with a hole in it.
 */
export function mintPhantom(seed, name, n, tools) {
  if (!isName(seed) || !isName(name)) return null;
  if (typeof n !== 'number' || !Number.isSafeInteger(n) || n < 0) return null;
  if (!isPlainObject(tools)) return null;
  const { mintId, roll } = /** @type {PhantomTools} */ (
    /** @type {unknown} */ (tools));
  if (typeof mintId !== 'function' || typeof roll !== 'function') return null;

  /** @type {unknown} */
  let id;
  /** @type {Record<string, string>} */
  const traits = {};
  try {
    id = mintId(seed, PHANTOM_KIND, n);
    if (!isName(id)) return null;
    // Codepoint order, from the frozen table, so the record's bytes are stable and the
    // roll index is the trait's own position rather than a running count.
    let index = 0;
    for (const trait of Object.keys(PHANTOM_TRAIT_POOLS)) {
      const value = roll(PHANTOM_TRAIT_POOLS[trait], null, seed, id, index);
      if (!isName(value)) return null;
      traits[trait] = value;
      index += 1;
    }
  } catch {
    // A hostile or merely broken producer must not take the editor down with it; the DM
    // is told the phantom could not be founded, which is a state the door can open on.
    return null;
  }

  return /** @type {PhantomRecord} */ (Object.freeze({
    id, kind: PHANTOM_KIND, name, seed, traits: Object.freeze(traits),
  }));
}

/**
 * (2) THE DISCRIMINANT, READ ONCE. Own-property only: a value inheriting `kind` from a
 * prototype is not a phantom record.
 * @param {unknown} value @returns {boolean}
 */
export function isPhantomRecord(value) {
  return isPlainObject(value)
    && Object.hasOwn(value, 'kind')
    && value.kind === PHANTOM_KIND;
}

/**
 * (3) THE SHELF'S PREDICATE. A save row is a phantom iff its BLOB is a phantom record —
 * the envelope is columns and says nothing about the world inside it.
 * @param {unknown} save a library save row @returns {boolean}
 */
export function isPhantomSave(save) {
  return isPlainObject(save) && isPhantomRecord(save.settlement);
}

/**
 * THE ONE READING OF A COUNTERPARTY'S REALITY, so the badge and the policy can never
 * disagree. A counterparty is REAL only when it is POSITIVELY a saved settlement: a row
 * carrying an id and a settlement blob that is not itself a phantom record. A phantom
 * record, a phantom save, a bare entity reference, a malformed row and an absent target
 * all read UNREAL — see the fail-closed clause in this file's header.
 * @param {unknown} target @returns {boolean}
 */
function isRealCounterparty(target) {
  if (!isPlainObject(target)) return false;
  if (isPhantomRecord(target)) return false;
  return isName(target.id) && isPlainObject(target.settlement)
    && !isPhantomRecord(target.settlement);
}

/**
 * (4) THE APPLY-TIME RESOLVER EM-B1b's ROWS POINT AT. Answers which of design §13's two
 * consequences a decree against this counterparty admits.
 * @param {unknown} target @returns {ConsequencePolicy} never null, never a throw
 */
export function consequenceFor(target) {
  return isRealCounterparty(target) ? WORLD : RECORD_ONLY;
}

/**
 * (5) THE REGISTRY'S BADGE (design §13, "Reality is shown"). The same reading as
 * `consequenceFor`, named for the reader rather than the engine. It is a RENDERING SEAM:
 * the registry page asks this question and draws the answer; no page edit is owed here.
 * @param {unknown} target @returns {CounterpartyBadge}
 */
export function badgeFor(target) {
  return isRealCounterparty(target) ? BADGE_REAL : BADGE_PHANTOM;
}

/**
 * (6) ONE OFF-STAGE ACT, UNDER THE PHANTOM CONSEQUENCE RULE.
 *
 * ⛔ `world` COMES BACK BY IDENTITY ON EVERY PATH. That is the rule made structural: for a
 * phantom target there is no world consequence at all, and for a REAL one the world
 * consequence is the simulator's, which the editor only hands the decree. Neither branch
 * reads the world, so neither can write it.
 *
 * The record is the chronicle's MARK, not its words: the herald's pools are EM-E2's and
 * this leaf mints no prose. `offStage` is true on every act this resolver answers for,
 * which is what design §13 asks the chronicle to carry.
 *
 * @param {unknown} op an `Op` the op catalogue built; only its own declared fields are read
 * @param {unknown} target the RESOLVED counterparty — a save row, a phantom record, or a
 *   reference the caller could not resolve
 * @param {unknown} world the world state, READ NOWHERE and returned by identity
 * @returns {{ policy: ConsequencePolicy|null, badge: CounterpartyBadge,
 *   world: unknown, worldFacts: readonly never[],
 *   record: { badge: CounterpartyBadge, counterparty: string, offStage: boolean,
 *     op: string, outcome: unknown }|null }}
 *   `policy` and `record` are BOTH null when the op is not one this resolver answers for
 *   (an op whose declared consequence is not `by-target-reality`), and `world` is still
 *   the argument. `worldFacts` is the shared frozen empty array on every path — design
 *   §13's "what it never produces", as an identity a caller may compare.
 */
export function applyOffStage(op, target, world) {
  const badge = badgeFor(target);
  const inert = { policy: /** @type {ConsequencePolicy|null} */ (null), badge, world, worldFacts: NO_WORLD_FACTS, record: null };
  if (!isPlainObject(op) || !isName(op.type)) return inert;
  if (op.consequence !== BY_TARGET_REALITY) return inert;

  const payload = isPlainObject(op.payload) ? op.payload : {};
  const ref = isPlainObject(op.target) ? op.target : {};
  // The counterparty is named by the payload's own ref field when it carries one, and by
  // the op's target otherwise; both are the op's own data and neither is invented here.
  const counterparty = [payload.counterparty, ref.id, target && isPlainObject(target) ? target.id : undefined]
    .find(isName);

  return {
    policy: consequenceFor(target),
    badge,
    world,
    worldFacts: NO_WORLD_FACTS,
    record: {
      badge,
      counterparty: isName(counterparty) ? counterparty : '',
      offStage: true,
      op: op.type,
      // An outcome op carries the DM's word; every other off-stage act carries none, and
      // the absence is the fact rather than a default.
      outcome: Object.hasOwn(payload, 'outcome') ? payload.outcome : null,
    },
  };
}
