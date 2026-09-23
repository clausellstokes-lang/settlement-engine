/**
 * domain/display/stateProse/decreeProse.js — THE CHRONICLE'S VOICE FOR A DECREE
 * (EM-E2, wave 3; design §11 "The chronicle's voice", §13, §16, §19 ruling 2, §20.3;
 * ARCH §1's row `decreeProse.js | the chronicle's sentences for decrees (§11) from
 * authored pools | decreeChronicleLine(entry, world)`).
 *
 * WHAT THIS IS. One decree entry in, one chronicle line out. The sentences are
 * `decreeProsePools.js`'s and only ever its; this module chooses among them from the
 * entry's own typed facts and joins what it drew. It writes no word of its own, and the
 * cause walker holds it to that by scanning this source rather than by trusting it.
 *
 * ── THE THREE THINGS THAT WOULD GO WRONG, AND WHAT STOPS THEM ───────────────────────
 *
 * 1. A SECOND TIMELINE. The realm already has one — `chronicleTimeline` merges the
 *    campaign's prose `chronicles[]` with its `pulseHistory[]` into one tick-indexed
 *    scrollback — and a decree line that arrived in its own list would put the town's
 *    history in two places that can disagree. So this returns an ENTRY OF THAT LIST:
 *    the `{ id, tick, prose, createdAt }` shape `chronicleTimeline` already groups, plus
 *    the decree's own address. Nothing here imports the timeline, because the join is a
 *    SHAPE rather than a call, and an import would make a display leaf depend on the
 *    causal engine to say one sentence. `tests/domain/decreeProse.test.js` drives the
 *    real `chronicleTimeline` over these lines, so the claim is executed and not written.
 *
 * 2. A SENTENCE ABOUT A FACT THE REGISTRY CANNOT TYPE. Every pool key here is a closed
 *    vocabulary somebody else measured: the three statuses of design §20.3, the three
 *    authors of EM-C1 §6, design §13's home / phantom / real forms, and the five
 *    `GUARD_KINDS` landed by EM-C2. A word outside one of them has NO pool, so it draws
 *    nothing and the clause is dropped. The line refuses to render at all unless BOTH
 *    the hand and the standing clause spoke: half a sentence about a decree is worse
 *    than no sentence about it, and R-DST-K already means silence.
 *
 * 3. THE CALLER'S TEXT REACHING THE READER. Slots are filled with names and with one
 *    line reference, never with prose: `{settlement}` is the town's own name off the
 *    world it is handed, `{counterpart}` is the off-stage party's name, `{prerequisite}`
 *    is the chronicle reference of the decree this one follows from. The kernel's
 *    anchored liveness drops any sentence whose slot has no fill, so a missing
 *    counterpart is a shorter line rather than a rendered `{counterpart}`.
 *
 * ── THE SIGNATURE, EXTENDED BY ONE, BECAUSE MEASUREMENT FORCED IT ───────────────────
 * ARCH §1 spells `decreeChronicleLine(entry, world)`. Two of the four things design §11
 * asks the voice to say cannot be recovered from those two arguments, and both were
 * measured rather than assumed:
 *
 *   - THE OVERRIDE LINE names the guard the table proceeded past by its `GUARD_KINDS`
 *     word. `entry.overrode` carries guard IDS, and EM-C2's id grammar is
 *     `<ruleId>:<entryId>:<relatedEntryId or ->:<facet or ->` — it carries a RULE id and
 *     no kind. The map from rule id to kind lives on EM-C3's rule set, which is not in
 *     this tree; there is no other reader of it anywhere in `src/`. So the caller hands
 *     the guards it showed the DM, and this leaf keeps the ones the entry overrode.
 *   - THE FOLLOWS-FROM JOIN names the prerequisite's LINE, and a line reference lives on
 *     the prerequisite ENTRY (`chronicleRef`), not on this one. So the caller hands the
 *     registry it is already holding, and this leaf resolves the ids against it.
 *
 * Everything else the options bag carries is a fill or a stamp the caller owns, never a
 * sentence, and an absent bag renders the shortest true line rather than nothing.
 *
 * ── AND EM-E6'S TWO CLAUSES, SPLICED RATHER THAN DRAWN HERE (U5) ────────────────────
 * The event a decree schedules and the deed the party did are EM-E6's, drawn by
 * `src/domain/edit/eventCatalogue.js` out of this same corpus's `DEC-EVENT` and
 * `DEC-PARTY` blocks, in this leaf's own part shape. They are drawn THERE because the
 * catalogue read is a catalogue fact — a type's family, a kind's spec — and this leaf
 * would have to import `partyImpact.js`'s whole apply pipeline to reach it, which is the
 * same closure measurement the paragraph below makes about `OP_STAGES`. So the caller
 * hands the clause it already drew and this leaf SPLICES it, exactly as it is handed the
 * guards and the registry it cannot recover from an entry alone.
 *
 * ⛔ A HANDED CLAUSE IS ADMITTED ONLY IF THIS CORPUS REALLY HOLDS IT. A splice is the one
 * door through which failure 3 above could walk in wearing a part's shape: a sentence
 * nobody authored, addressed to a pool that exists. So the clause is looked up by its own
 * `blockId`, `poolKey` and `vid`, and its text must be what THIS line's slots render that
 * variant to under THIS line's cause. A hand-written clause with a true address is refused,
 * and so is one filled with another town's name or spoken under the other hand.
 *
 * ⛔ WHAT THIS LEAF DOES NOT IMPORT, AND WHY THAT IS A MEASUREMENT. `GUARD_KINDS` comes
 * from `src/domain/edit/guards.js`, whose whole static closure is itself plus
 * `deterministicSort.js`. `OP_STAGES` would come from `src/domain/edit/operations.js`,
 * which pulls the npc entity table, the relationship-compatibility leaf and the field
 * declarations behind it: a display leaf would drag the edit volume into every chunk that
 * ever renders a chronicle. So the stage word is read off the entry's own op and the
 * FORM ROSTER is pinned against `OP_STAGES` in the walker, where an import costs the
 * bundle nothing. Invert, do not widen (design §22.3 item 6).
 *
 * PURE HEADLESS LEAF. No React, no store, no clock, no locale, no PRNG: the draw is the
 * kernel's seeded argmax (`createPRNG` site count 0, and no second hash is minted). Dark
 * at this wave by having zero importers, which is stronger than a flag.
 *
 * @enforced-by tests/domain/decreeProse.test.js + tests/lint/decreeCause.walker.test.js
 */
import { compareCodepoint } from '../../deterministicSort.js';
import { GUARD_KINDS } from '../../edit/guards.js';
import {
  DECREE_EVENT_POOLS, DECREE_FOLLOWS_FROM_POOL, DECREE_FORM_POOLS, DECREE_HAND_POOLS,
  DECREE_LINE_CAUSES, DECREE_OVERRIDE_POOLS, DECREE_PARTY_DEED_POOLS, DECREE_STANDING_POOLS,
} from './decreeProsePools.js';
import { drawVariant, eligibleVariants, fillSlots, speakTierNoun, stableVid } from './stateProseKernel.js';

/** @typedef {import('./decreeProsePools.js').DecreeProseVariant} DecreeProseVariant */
/** @typedef {import('./decreeProsePools.js').DecreeProseBlock} DecreeProseBlock */

/**
 * The off-stage forms of design §13, which are also this leaf's FORM pool keys. `home`
 * is an op that lands on the town's own ground; the two off-stage keys are the PHANTOM
 * and REAL badges the design rules are shown rather than hidden.
 * @type {ReadonlyArray<string>}
 */
export const DECREE_FORMS = Object.freeze(['home', 'off-stage-phantom', 'off-stage-real']);

/** The op stage that leaves the town. Read off the entry's own op; see the docblock. */
const OFF_STAGE = 'off-stage';
/** The entity kind design §13 gives the PHANTOM badge. */
const PHANTOM = 'phantom';
/** The cause the tick hook records for a decree nobody else moved (ARCH's `cause`). */
const CAUSE_TABLE = 'table';

/**
 * The seven parts of a line, in the order a reader meets them: who moved it, where it
 * lands, how it stands, what the party did, what is set for the coming turn, the warnings
 * set aside, and the decree it stands on. The two middle names are EM-E6's own, spelled
 * the way its reader spells them so a spliced clause keeps the name it was drawn under.
 */
const PART_HAND = 'hand';
const PART_FORM = 'form';
const PART_STANDING = 'standing';
const PART_PARTY = 'party-deed';
const PART_EVENT = 'event';
const PART_OVERRIDE = 'override';
const PART_FOLLOWS = 'follows-from';

/** The block ids the draw is keyed on, so two parts of one line never draw in lockstep. */
const BLOCK_HAND = 'DEC-HAND';
const BLOCK_FORM = 'DEC-FORM';
const BLOCK_STANDING = 'DEC-STANDING';
const BLOCK_EVENT = 'DEC-EVENT';
const BLOCK_PARTY = 'DEC-PARTY';
const BLOCK_OVERRIDE = 'DEC-OVERRIDE';
const BLOCK_FOLLOWS = 'DEC-FOLLOWS';

/**
 * THE TWO BLOCKS A CLAUSE MAY BE SPLICED FROM, and the part name each one carries. A Map
 * rather than an object because the block id arrives from the caller and a lookup by a
 * word the caller supplied must not be able to reach a prototype member.
 * @type {Map<string, { part: string, block: DecreeProseBlock }>}
 */
const SPLICEABLE_BLOCKS = new Map([
  [BLOCK_PARTY, { part: PART_PARTY, block: DECREE_PARTY_DEED_POOLS }],
  [BLOCK_EVENT, { part: PART_EVENT, block: DECREE_EVENT_POOLS }],
]);

/** The reserved pool key of the follows-from block, which carries one unlabelled pool. */
const SOLE = '*';

/** @param {unknown} value @returns {value is string} */
const isText = (value) => typeof value === 'string' && value.trim() !== '';

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * ONE DRAWN PART of a line: which clause it is, where it came from, and what it says.
 * The walker and the battery both read this, so a part that cannot name its pool is a
 * part nothing can hold to the corpus.
 * @typedef {object} DecreeLinePart
 * @property {string} part one of the five clause names
 * @property {string} blockId the corpus block it was drawn from
 * @property {string} poolKey the pool inside that block
 * @property {number|null} vid the drawn variant's stable id
 * @property {string} angle the drawn variant's standpoint tag
 * @property {string} text the filled sentence
 */

/**
 * ONE CHRONICLE LINE. The first four fields are `chronicleTimeline`'s own
 * `chronicles[]` shape — it groups by `tick` and renders anything carrying `prose` — and
 * the rest is the decree's address chain, which the registry page and the cause walker
 * read and the timeline ignores.
 * @typedef {object} DecreeChronicleLine
 * @property {string} id this line's own reference, which the entry stores as `chronicleRef`
 * @property {number} tick the tick this line is recorded at
 * @property {string} prose the joined sentences
 * @property {string|null} createdAt the caller's stamp, or null when the entry carries none
 * @property {string} decreeId the entry this line speaks for
 * @property {string} cause the closed-vocabulary cause this line was drawn for
 * @property {ReadonlyArray<string>} followsFrom the line references this one stands on
 */

/**
 * The options the two arguments of ARCH's signature cannot carry. Every key is optional
 * and an absent one is an absence rather than a default with an opinion.
 * @typedef {object} DecreeLineOptions
 * @property {string} [seed] the settlement seed; absent means canonical-at-zero
 * @property {string} [audience] the kernel's audience; an unknown one reads as the player's
 * @property {string} [cause] a member of `DECREE_LINE_CAUSES`; absent reads as the table's
 * @property {number} [tick] the tick this line is recorded at, which wins over `when.tick`
 * @property {string} [counterpart] the off-stage party's display name
 * @property {string|null} [tierNoun] the settlement's own noun, already resolved by the caller
 * @property {ReadonlyArray<{id?: unknown, kind?: unknown}>} [overrodeGuards] the guards the DM was shown
 * @property {ReadonlyArray<unknown>} [registry] the decrees this one may follow from
 * @property {unknown} [partyDeed] EM-E6's `partyDeedClause`, for what the party did
 * @property {unknown} [scheduledEvent] EM-E6's `scheduledEventClause`, for the event this
 *   decree sets for a coming turn
 */

/**
 * WHERE AN ACT LANDS (design §13). An op that never leaves is `home`; one that does wears
 * the badge of what it is aimed at, and the target's own `kind` is what says which — a
 * phantom is a minimal save record by §12.6, so the reference already carries the answer
 * and no library lookup is needed to render a sentence.
 *
 * ⛔ FAIL-CLOSED TO `home`: an op whose stage the registry cannot type is the town's own
 * business until something proves otherwise, and claiming a town acted abroad on a
 * malformed record is the one error here that would be read as history.
 * @param {unknown} op one staged operation
 * @returns {string} a member of `DECREE_FORMS`
 */
export function decreeForm(op) {
  if (!isPlainObject(op) || op.stage !== OFF_STAGE) return DECREE_FORMS[0];
  const target = op.target;
  const kind = isPlainObject(target) ? target.kind : undefined;
  return kind === PHANTOM ? DECREE_FORMS[1] : DECREE_FORMS[2];
}

/**
 * Draw ONE clause from one pool, or nothing at all.
 * @param {ReadonlyArray<DecreeProseVariant>|undefined} pool
 * @param {string} part @param {string} blockId @param {string} poolKey
 * @param {string} cause @param {string} seed @param {string|undefined} audience
 * @param {Record<string, unknown>} slots
 * @returns {DecreeLinePart|null}
 */
function drawPart(pool, part, blockId, poolKey, cause, seed, audience, slots) {
  if (!Array.isArray(pool)) return null;
  // The cause is this corpus's own arm, filtered here rather than in the kernel for the
  // reason `causalDossierProse` filters its arms here: it is a family-local channel, and
  // the kernel's `marks` bag is already carrying three semantics that a fourth would hide.
  const spoken = pool.filter((variant) => variant.causes.includes(cause));
  const eligible = eligibleVariants(spoken, { slots, audience });
  const variant = drawVariant(eligible, blockId, poolKey, seed);
  if (!variant) return null;
  const text = fillSlots(variant.text, slots);
  if (text === null) return null;
  return Object.freeze({
    part, blockId, poolKey, vid: stableVid(variant), angle: variant.angle || '', text,
  });
}

/**
 * THE GUARD KINDS THIS ENTRY WAS PROCEEDED PAST, in one stable order. A guard the caller
 * did not show, or one whose kind is outside `GUARD_KINDS`, names no pool and is dropped:
 * design §9's tie-break is that a false warning costs more trust than a missing one, and
 * a chronicle line inventing a warning is the same trade one step further on.
 * @param {unknown} overrode @param {ReadonlyArray<{id?: unknown, kind?: unknown}>|undefined} guards
 * @returns {string[]}
 */
function overriddenKinds(overrode, guards) {
  if (!Array.isArray(overrode) || overrode.length === 0) return [];
  if (!Array.isArray(guards) || guards.length === 0) return [];
  const ids = new Set(overrode.filter(isText));
  const kinds = new Set();
  for (const guard of guards) {
    if (!isPlainObject(guard)) continue;
    const { id, kind } = guard;
    if (!isText(id) || !ids.has(id)) continue;
    if (isText(kind) && GUARD_KINDS.includes(kind)) kinds.add(kind);
  }
  return [...kinds].sort(compareCodepoint);
}

/**
 * THE LINE REFERENCES THIS DECREE STANDS ON. `followsFrom` holds entry ids; the reference
 * a reader can follow is the prerequisite's own `chronicleRef`, so an id that names no
 * entry, or one whose entry has no line yet, contributes NOTHING — there is nothing to
 * point at, and pointing anyway would mint a reference that resolves to nowhere.
 * @param {unknown} followsFrom @param {ReadonlyArray<unknown>|undefined} registry
 * @returns {string[]}
 */
function followsFromRefs(followsFrom, registry) {
  if (!Array.isArray(followsFrom) || followsFrom.length === 0) return [];
  if (!Array.isArray(registry) || registry.length === 0) return [];
  const wanted = new Set(followsFrom.filter(isText));
  const refs = new Set();
  for (const row of registry) {
    if (!isPlainObject(row)) continue;
    const { id, chronicleRef } = row;
    if (!isText(id) || !wanted.has(id)) continue;
    if (isText(chronicleRef)) refs.add(chronicleRef);
  }
  return [...refs].sort(compareCodepoint);
}

/**
 * ONE CLAUSE EM-E6'S READER DREW, RE-PROVED AGAINST THE CORPUS BEFORE IT JOINS THE LINE.
 * The clause names the pool it came out of, so this resolves that address and re-renders
 * the variant it names under THIS line's slots and THIS line's cause: a text that is not
 * what the corpus says there is not a clause of this corpus, whoever assembled it.
 *
 * Returns `null` — the same silence the rest of this leaf keeps — for an absent clause, a
 * block outside EM-E6's two, a pool the block does not hold, a `vid` no variant carries, a
 * variant that cannot speak for this line's cause, and a text the fill does not produce.
 *
 * @param {unknown} clause @param {string} cause @param {Record<string, unknown>} slots
 * @returns {DecreeLinePart|null}
 */
function splicedPart(clause, cause, slots) {
  if (!isPlainObject(clause)) return null;
  const blockId = isText(clause.blockId) ? clause.blockId : '';
  const home = SPLICEABLE_BLOCKS.get(blockId);
  if (!home) return null;
  const poolKey = isText(clause.poolKey) ? clause.poolKey : '';
  const pool = home.block[poolKey];
  if (!Array.isArray(pool)) return null;
  const vid = typeof clause.vid === 'number' ? clause.vid : null;
  const variant = vid === null ? undefined : pool.find((row) => stableVid(row) === vid);
  if (!variant || !variant.causes.includes(cause)) return null;
  const text = fillSlots(variant.text, slots);
  if (text === null || !isText(clause.text) || text !== clause.text) return null;
  return Object.freeze({
    part: home.part, blockId, poolKey, vid, angle: variant.angle || '', text,
  });
}

/**
 * EVERY CLAUSE OF ONE LINE, in the order a reader meets them, or an empty list when the
 * entry has nothing sayable. Exported because the battery and the cause walker both need
 * to see WHICH pool each sentence came from: a line proved only as a joined string cannot
 * be held to the corpus it was supposed to come out of.
 * @param {unknown} entry one decree registry entry (EM-C1 §6's shape)
 * @param {unknown} world the settlement the chronicle belongs to; only `name` is read
 * @param {DecreeLineOptions} [options]
 * @returns {ReadonlyArray<DecreeLinePart>}
 */
export function decreeLineParts(entry, world, options = {}) {
  if (!isPlainObject(entry)) return Object.freeze([]);
  const id = entry.id;
  if (!isText(id)) return Object.freeze([]);
  const op = entry.op;
  if (!isPlainObject(op) || !isText(op.type)) return Object.freeze([]);

  const cause = isText(options.cause) && DECREE_LINE_CAUSES.includes(options.cause)
    ? options.cause : CAUSE_TABLE;
  // The entry's own id joins the seed, so two decrees of one sitting on one settlement do
  // not read as the same sentence copied twice. Seedless stays canonical-at-zero.
  const seed = isText(options.seed) ? `${options.seed}::${id}` : '';
  const audience = isText(options.audience) ? options.audience : undefined;

  const name = isPlainObject(world) ? world.name : undefined;
  /** @type {Record<string, unknown>} */
  const slots = {};
  if (isText(name)) slots.settlement = name;
  if (isText(options.counterpart)) slots.counterpart = options.counterpart;

  const status = isText(entry.status) ? entry.status : '';
  const addedBy = isText(entry.addedBy) ? entry.addedBy : '';
  const hand = drawPart(DECREE_HAND_POOLS[addedBy], PART_HAND, BLOCK_HAND, addedBy, cause, seed, audience, slots);
  const standing = drawPart(DECREE_STANDING_POOLS[status], PART_STANDING, BLOCK_STANDING, status, cause, seed, audience, slots);
  // BOTH OR NEITHER. Who moved and how it stands are the two facts a decree line exists to
  // carry; a line missing one of them would read as a complete sentence about a decree
  // nobody can place, which is the failure silence is preferable to.
  if (!hand || !standing) return Object.freeze([]);

  const formKey = decreeForm(op);
  const form = drawPart(DECREE_FORM_POOLS[formKey], PART_FORM, BLOCK_FORM, formKey, cause, seed, audience, slots);
  /** @type {DecreeLinePart[]} */
  const parts = [hand];
  if (form) parts.push(form);
  parts.push(standing);

  // EM-E6'S TWO, in the reader's own order: what the party already did, then what is set
  // for a turn still to come. Each is admitted only if the corpus holds it (U5).
  for (const clause of [options.partyDeed, options.scheduledEvent]) {
    const spliced = splicedPart(clause, cause, slots);
    if (spliced) parts.push(spliced);
  }

  for (const kind of overriddenKinds(entry.overrode, options.overrodeGuards)) {
    const clause = drawPart(DECREE_OVERRIDE_POOLS[kind], PART_OVERRIDE, BLOCK_OVERRIDE, kind, cause, seed, audience, slots);
    if (clause) parts.push(clause);
  }

  const refs = followsFromRefs(entry.followsFrom, options.registry);
  if (refs.length > 0) {
    const clause = drawPart(
      DECREE_FOLLOWS_FROM_POOL, PART_FOLLOWS, BLOCK_FOLLOWS, SOLE, cause, seed, audience,
      { ...slots, prerequisite: refs.join(', ') },
    );
    if (clause) parts.push(clause);
  }
  return Object.freeze(parts);
}

/**
 * ONE DECREE, ONE CHRONICLE LINE, in the realm timeline's own shape (ARCH §1).
 *
 * Returns `null` when the entry has no sayable clause set — a malformed row, a status or
 * an author outside the closed vocabularies, or an op the registry cannot type. The
 * composer then renders NOTHING, which is what `chronicleTimeline` does with a line that
 * carries no prose anyway, so the two silences agree.
 *
 * ⛔ THE CLOCK IS READ WHERE IT IS WRITTEN (HZ-STAMP). This leaf takes no stamp of its
 * own: `createdAt` is the entry's `appliedAt` if it has one and its `orderedAt` otherwise,
 * both of which the registry's caller minted. A display leaf that read `Date.now` would
 * make the same line different on two renders and break THE PROMISE by itself.
 *
 * @param {unknown} entry one decree registry entry
 * @param {unknown} world the settlement the chronicle belongs to; only `name` is read
 * @param {DecreeLineOptions} [options]
 * @returns {DecreeChronicleLine|null}
 */
export function decreeChronicleLine(entry, world, options = {}) {
  const parts = decreeLineParts(entry, world, options);
  // The second test is the type narrowing and not a second guard: `decreeLineParts`
  // already returned empty for anything that is not a well-formed entry, and re-asking
  // here is what lets the reads below stand without a cast (the any-cast floor is zero).
  if (parts.length === 0 || !isPlainObject(entry)) return null;
  const row = entry;
  const decreeId = String(row.id);
  const when = isPlainObject(row.when) ? row.when : undefined;
  const scheduled = when && Number.isFinite(when.tick) ? Number(when.tick) : 0;
  const tick = Number.isFinite(options.tick) ? Number(options.tick) : scheduled;
  const stamp = isText(row.appliedAt) ? row.appliedAt : row.orderedAt;
  const cause = isText(options.cause) && DECREE_LINE_CAUSES.includes(options.cause)
    ? options.cause : CAUSE_TABLE;
  return Object.freeze({
    // An applied entry already carries the reference this line was recorded under; a
    // pending one has none yet, and the id is minted from the entry's own id so it is
    // stable across renders without a counter, a clock or a draw.
    id: isText(row.chronicleRef) ? row.chronicleRef : `decree:${decreeId}`,
    tick,
    prose: speakTierNoun(parts.map((part) => part.text).join(' '), options.tierNoun ?? null),
    createdAt: isText(stamp) ? stamp : null,
    decreeId,
    cause,
    followsFrom: Object.freeze(followsFromRefs(row.followsFrom, options.registry)),
  });
}
