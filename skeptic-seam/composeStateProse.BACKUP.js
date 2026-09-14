/**
 * domain/display/stateProse/composeStateProse.js — THE COMPOSER (ARCH-COMPOSED-PROSE §4).
 *
 * WHAT THIS IS. The kernel turns ONE pool into ONE sentence. This turns a spine pool, a
 * ranked list of modifier pools and any turn the engine names into ONE UNIT — the string a
 * rung renders, plus the `pieces` that say what it is made of. It is the seam the composed
 * model needs before there is any composed content to put through it.
 *
 * ⛔ AT THIS CAR IT IS REACHABLE FROM NOTHING. No desk imports it; `tests/lint/
 * composeStateProseFence.test.js` asserts that in both directions — nothing in `src/`
 * imports this module, and this module imports nothing but the kernel. Cars 3b–3g route the
 * desks through it one at a time, each ending on its own zero-drift manifest run, so a drift
 * is diagnosed against one desk's diff rather than six. Until then the ONLY thing that runs
 * this code is its own suite, and the point of the car is that the corpus cannot move.
 *
 * ── WHAT IT IS, AS A LEAF (ARCH §4.1) ───────────────────────────────────────────────
 * PURE and HEADLESS: no clock, no RNG, no settlement access, no lexicon detector, and no
 * locale API — no `localeCompare`, no `Intl`, no `toLocale*`. Ordering is by 32-bit digest
 * with a CODE-UNIT tie-break, because a collation that consults the host's ICU tables orders
 * non-ASCII keys differently on two devices and the promise is same-seed, every device,
 * every locale. The ban is machine-checked beside the import fence.
 *
 * THE THREE-WAY DIVISION OF LABOUR, which is the ruling this file is built on: the DESK
 * supplies KEYS and typed flags, the CORPUS supplies RELATIONS and roles, the COMPOSER
 * supplies everything else. A desk hands over an ORDERED array of the modifier keys whose
 * predicates fired, built by explicit calls in its own `*StateProseCandidates.js` sibling —
 * never by iterating `pools`, because a pool key is not a predicate. Notability is read off
 * the norm leaf HERE and is never derived in a desk.
 *
 * ── THE TEN STEPS (ARCH §4.2), EACH A PURE FUNCTION ─────────────────────────────────
 *   1  readings -> spine key (the desk's; `null` means silence, R-DST-K), and a TURN whose
 *      registry id holds REPLACES the spine and the modifiers it covers.
 *   2  candidates, AUDIENCE-FILTERED FIRST, then by frozen metadata only.
 *   3  salience: three integer signals, a band, then a seeded order under a written law.
 *   4  the bound: the fact budget, the seats, the capacity.
 *   5  the per-piece draw; an unfillable fill DROPS that candidate and the walk continues.
 *   6  the face draw and the connective draw.
 *   7  the fill, per piece, from the block's bag.
 *   8  the arrangement — sentence seat, or (under S2) the clause seat.
 *   9  the frozen unit.
 *  10  coherence is the FREEZE's and the GATE's, NEVER the draw's: a runtime refusal would
 *      change `eligible.length` and move every later index (CLERK-LAWS §2.5 / R-DA-20).
 *      Nothing here filters a candidate for what it SAYS, and a suite arm holds it to that.
 *
 * ── WHY EVERY DRAW IS SAFE TO ADD (ARCH §2.4) ───────────────────────────────────────
 * The spine's key is `${seed}::${blockId}::${poolKey}` and this file does not touch it. The
 * face key is that string plus `::w`; the joint and the salience keys are new keys on new
 * material. So an empty candidate list composes to the kernel's own draw, byte for byte,
 * which is what makes cars 3b–3g provable by a manifest that cannot move.
 *
 * @enforced-by tests/domain/composeStateProse.test.js
 * @enforced-by tests/lint/composeStateProseFence.test.js
 */
import {
  AUDIENCE_DM,
  AUDIENCE_PLAYER,
  drawFace,
  drawVariant,
  eligibleVariants,
  fillSlots,
  hashKey,
  variantIsAudible,
} from './stateProseKernel.js';

/**
 * One piece of a composed unit — the provenance row a manifest cell carries.
 * @typedef {object} ComposedPiece
 * @property {'spine'|'modifier'|'turn'} role
 * @property {string} key the pool key inside the block
 * @property {number} vid the variant's position in its pool AS AUTHORED
 * @property {number} index its position within the AUDIENCE-FILTERED pool
 * @property {number} face the wording face (0 today, on every shipped variant)
 * @property {string} [relation] modifier only — the EFFECTIVE relation the joint was drawn
 *   from, which is `addition` when a declared `consequence` could not take the clause seat
 * @property {'sentence'|'clause'} [seat] modifier only
 */
/**
 * One composed unit — what a rung renders and what it is made of.
 * @typedef {object} ComposedUnit
 * @property {string} blockId
 * @property {string} poolKey the SPINE's key, even when a turn replaced the spine
 * @property {string} angle
 * @property {string} text
 * @property {ReadonlyArray<ComposedPiece>} pieces
 */
/**
 * The frozen render half of a pool's metadata (ARCH §2.3), projected by car 4 and 4d.
 *
 * ⛔ EVERY FIELD HERE IS ONE THE LEAF ACTUALLY CARRIES. The authoring half — `tests`, `reads`,
 * `predicate`, `rate` — lives in the wiring census JSON and NEVER ships (ARCH §16), so this
 * typedef may not name it and this module may not read it. Car 4d deleted the two readers
 * that did (`seatFor`'s primary field and `factBudget`'s array) and replaced them with the
 * two keys the projector resolves from the census in their place: `seat` and `readsCount`.
 * @typedef {object} PoolMeta
 * @property {'spine'|'modifier'|'turn'} [role]
 * @property {'addition'|'consequence'|'tension'|'contrast'} [relation] the DECLARED relation
 * @property {'sentence'|'clause'} [seat] modifier only — the seat the LICENCE resolved at
 *   projection; absent is the sentence
 * @property {string} [seatReason] why a sentence, from the resolver's closed vocabulary
 * @property {ReadonlyArray<string>} [seatRow] the relation row ids that licensed a clause
 * @property {number} [readsCount] how many fields the pool's SELECTING BRANCH evaluates, read
 *   from the census; absent where the census recovered no reading
 * @property {'fragment'|'sentence'} [form]
 * @property {ReadonlyArray<string>} [attach]
 * @property {ReadonlyArray<string>} [spines] turn only
 * @property {ReadonlyArray<string>} [covers] turn only
 */
/**
 * A modifier candidate as a desk hands it over.
 * @typedef {object} StateProseCandidate
 * @property {string} key the modifier pool key, in the same block
 * @property {0|1} [change] the typed CHANGE flag, from a PERSISTED band only
 */

/** The four relations, and the only four (ARCH §4.5). A fifth is a projector error. */
export const RELATIONS = Object.freeze(['addition', 'consequence', 'tension', 'contrast']);

/** The two seats. The clause seat is `consequence`-only and needs a relation row. */
export const SENTENCE_SEAT = 'sentence';
/** @see SENTENCE_SEAT */
export const CLAUSE_SEAT = 'clause';

/**
 * THE TWO WALLS ARCH §4.4 PUTS ON A COMPOSED UNIT AND ON A MOUNT.
 *
 * ⚠ WHY ONE FROZEN RECORD RATHER THAN TWO TOP-LEVEL CONSTANTS, said plainly because the shape
 * is not the obvious one. `tests/lint/tuningRegister.walker.test.js` counts a module-top-level
 * `const UPPER_SNAKE = <numeric>` as UNREGISTERED NAMED DEBT, shrink-only, with new files held
 * at zero — and its own header records the finding that the register "scores naming a magic
 * number as debt in one population while crediting it as a win in the other" (§883.8, the
 * chair's, owner-visible). Raising that ceiling is not a lane's act, and neither is minting a
 * tuning-register row: these are not tunable values, they are architectural walls the owner
 * has already ruled. So the two numbers stay NAMED and stay together, in the one record the
 * paragraph they come from describes, rather than being inlined as magic numbers to satisfy
 * an instrument that would then have counted nothing at all.
 */
export const COMPOSITION_BOUNDS = Object.freeze({
  /** A unit states at most this many facts, the spine's own `reads` included. */
  facts: 3,
  /** At most this many rungs of one mount carry modifiers (the POSITION BUDGET). */
  modifierBearingRungs: 2,
});

/**
 * ⭐ THE THREE FROZEN LEAVES THIS COMPOSER WILL IMPORT, AND WHY IT IMPORTS NONE OF THEM YET.
 *
 * ARCH §4.1 gives the composer exactly four dependencies: the kernel, and the three
 * generated leaves — the connective phrase lists, the notability bits and the relation
 * table. Car 4 projects all three. This car lands ahead of car 4 on purpose (the sequence is
 * 3a then 4, so the seam can be proven byte-identical BEFORE the schema moves), so the three
 * files do not exist in the tree yet and an `import` of one would not resolve.
 *
 * They are therefore carried here as their own FLOOR VALUES — the exact shapes ARCH §2.3
 * says the leaves ship with: four connective lists of which two hold the empty opener, no
 * norm bits, no relation rows. Car 4 replaces each constant with its import and deletes
 * nothing else, because every reader below already reads the leaf's shape rather than a
 * literal.
 *
 * ⛔ THE SPECIFIERS ARE NAMED HERE RATHER THAN IN THE FENCE TEST so the allowlist and the
 * code cannot drift apart: the fence asserts this module's import list is a subset of the
 * kernel plus THIS roster, and the roster is frozen at three. A fourth dependency is a chair
 * conversation, not an edit.
 * @type {ReadonlyArray<string>}
 */
export const CAR_4_LEAF_SPECIFIERS = Object.freeze([
  '../../../data/dossierConnectives.generated.js',
  '../../../data/proseNorms.generated.js',
  '../../../data/dossierRelations.generated.js',
]);

/**
 * The connective lists, at their floor. FOUR REACHABLE (relation, seat) pairs and no others:
 * `contrast` and `addition` are the empty opener — adjacency itself, adding no claim — and
 * `tension` and the clause `consequence` are empty until the annex authors them, which means
 * a `tension` modifier cannot seat at all today and says so out loud rather than borrowing
 * somebody else's phrase.
 * @type {Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>>>>}
 */
export const CONNECTIVES = Object.freeze({
  addition: Object.freeze({ sentence: Object.freeze(['']) }),
  contrast: Object.freeze({ sentence: Object.freeze(['']) }),
  tension: Object.freeze({ sentence: Object.freeze([]) }),
  consequence: Object.freeze({ clause: Object.freeze([]) }),
});

/**
 * `${blockId}::${poolKey}` -> the DEPARTURE bit, frozen at the pool's birth car (P-F4). A
 * bit and not a rate: a rate re-measured by an unrelated car would re-order installed worlds
 * without anyone intending it.
 * @type {Readonly<Record<string, {departure: 0|1}>>}
 */
export const PROSE_NORMS = Object.freeze({});

/**
 * `${fieldA}|${fieldB}` -> the typed provenance edges between them, each with a DIRECTION.
 *
 * ⛔ EMPTY AT THIS TIP, AND THAT IS A MEASUREMENT RATHER THAN A PLACEHOLDER. Car 0 walked
 * the engine's own tables and found that none of the 165 relation rows joins a desk read
 * root, with source (d) empty (ARCH §16 item 9, F1). So there is no authorable `consequence`
 * or `tension` joint anywhere on the shipped corpus, every joint stands at the `addition`
 * floor, and NO CLAUSE CAN SEAT — which the suite asserts on the shipped corpus rather than
 * leaving as a claim.
 *
 * ⚠⚠ AND AFTER CAR 4d THIS COMPOSER DOES NOT READ IT, WHICH IS A ROW FOR THE CHAIR RATHER
 * THAN A LANE'S CLEANUP. The licence the table answers is now resolved at projection, where
 * the census makes the spine's primary field visible at all, and arrives as `poolMeta.seat`;
 * so of ARCH §4.1's three leaves the composer reads two. The constant, the `ProseLeaves`
 * member and the frozen three-specifier roster are KEPT because §4.1's dependency roster is
 * the architecture's and "a fourth dependency is a chair conversation, not an edit" cuts both
 * ways. The independence is not left as this paragraph: `composeStateProse.test.js` composes
 * every fixture twice — once with an empty table and once with a table that would license
 * every joint in it — and asserts the two units are identical, so a re-added read reds.
 * @type {Readonly<Record<string, ReadonlyArray<{relation: string, source: string,
 *   direction: 'a→b'|'b→a'}>>>}
 */
export const PROSE_RELATIONS = Object.freeze({});

/**
 * The three leaves, read as ONE INPUT rather than as three hidden module reads.
 * @typedef {object} ProseLeaves
 * @property {Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>>>>} [connectives]
 * @property {Readonly<Record<string, {departure: 0|1}>>} [norms]
 * @property {Readonly<Record<string, ReadonlyArray<{relation: string, source: string,
 *   direction: string}>>>} [relations]
 */

/** The leaves at their floors, which is what the tree carries until car 4 projects them. */
const FLOOR_LEAVES = Object.freeze({
  connectives: CONNECTIVES, norms: PROSE_NORMS, relations: PROSE_RELATIONS,
});

/**
 * ⭐ THE LEAF SEAM. The three frozen leaves are an INPUT with a default, not a hidden read.
 *
 * ⛔ WHY, AND IT IS NOT A TEST HOOK BOLTED ON. Two things need it, and the second is the
 * reason it is here rather than in car 4. (i) Car 4 swaps each floor constant for its import
 * at ONE site and every reader below is unchanged, because they already read a leaf's shape
 * rather than a literal. (ii) At THIS car the shipped leaves are empty by measurement — no
 * norm bit, and no relation row at all, because none of the engine's 165 rows joins a desk
 * read root (§16 item 9) — so the DEPARTURE signal, the `tension` seat and the whole clause
 * arrangement would ship as branches nothing could execute. A branch that no arm can reach
 * is a claim, not code, and this estate has already paid for shipping those. With the leaves
 * as an input, every limb this car lands is DRIVEN, and the shipped-corpus statement ("no
 * clause can seat today") becomes an assertion over the real leaves rather than a paragraph.
 *
 * @param {ProseLeaves|undefined} given
 * @returns {{connectives: Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>>>>,
 *   norms: Readonly<Record<string, {departure: 0|1}>>,
 *   relations: Readonly<Record<string, ReadonlyArray<{relation: string, source: string,
 *     direction: string}>>>}}
 */
function leavesOf(given) {
  if (!given || typeof given !== 'object') return FLOOR_LEAVES;
  return {
    connectives: given.connectives || CONNECTIVES,
    norms: given.norms || PROSE_NORMS,
    relations: given.relations || PROSE_RELATIONS,
  };
}

/** Absent metadata reads as a spine, which is what every pool is today (ARCH §2.3). */
const DEFAULT_POOL_META = Object.freeze({ role: 'spine' });

/**
 * A pool's frozen metadata, or the default. Read from the block's SIBLING map, never from
 * the pool array: `drawVariant` reads `blockId` and `poolKey` and never a pool's fields, so
 * a `poolMeta` edit cannot move a draw BY CONSTRUCTION (ARCH §2.1).
 * @param {{poolMeta?: Record<string, PoolMeta>}|undefined} block
 * @param {string} poolKey
 * @returns {PoolMeta}
 */
function poolMetaOf(block, poolKey) {
  const map = block ? block.poolMeta : undefined;
  const meta = map && typeof map === 'object' ? map[poolKey] : undefined;
  return meta && typeof meta === 'object' ? meta : DEFAULT_POOL_META;
}

/**
 * The audience the kernel would read. An unrecognised one is the PLAYER's: the restrictive
 * read is the safe one when the caller is wrong (law 2).
 * @param {unknown} audience
 * @returns {string}
 */
function audienceOf(audience) {
  return audience === AUDIENCE_DM ? AUDIENCE_DM : AUDIENCE_PLAYER;
}

/**
 * ⭐ THE SPINE PIECE — the composer's own coordinate rule, and the one the composed-prose
 * manifest's base-side synthesis is pinned against on every recorded cell.
 *
 * ⛔ WHY `index` IS TAKEN OVER THE AUDIBLE POOL AND NOT OVER THE ELIGIBLE LIST, which is the
 * natural mistake and the one this export exists to keep honest. `eligibleVariants` filters
 * by audience, by slot ANCHORING and by state DIMENSIONS; only the first is a property of
 * the PAGE rather than of the call site's slot bag. The manifest records `index` as the
 * variant's position in the AUDIENCE-FILTERED pool because that is the coordinate the two
 * faces can differ on and the mixed-pool control reads. A composer that recorded the
 * position within its own eligible list would disagree with the recorder on every pool where
 * anchoring narrows the list — 6,275 of 72,160 cells at this tip — and the manifest would
 * classify a car's cells against a coordinate nothing else in the estate uses.
 *
 * `vid` is the position AS AUTHORED, which the two audiences cannot differ on, and which car
 * 4's minted `vid` must reproduce on an unchanged corpus.
 *
 * @param {ReadonlyArray<import('./stateProseKernel.js').StateProseVariant>} pool
 * @param {import('./stateProseKernel.js').StateProseVariant} variant
 * @param {string} poolKey
 * @param {{role: 'spine'|'modifier'|'turn', face: number, audience?: string,
 *   relation?: string, seat?: string}} options
 * @returns {ComposedPiece}
 */
export function composedPieceOf(pool, variant, poolKey, options) {
  const audience = audienceOf(options.audience);
  const audible = pool.filter((candidate) => variantIsAudible(candidate, audience));
  /** @type {ComposedPiece} */
  const piece = {
    role: options.role,
    key: poolKey,
    vid: pool.indexOf(variant),
    index: audible.indexOf(variant),
    face: options.face,
  };
  if (options.relation) piece.relation = /** @type {string} */ (options.relation);
  if (options.seat) piece.seat = /** @type {'sentence'|'clause'} */ (options.seat);
  return Object.freeze(piece);
}

/**
 * Draw one pool: the variant, its face, its filled text and its piece. `null` when the pool
 * is absent, when nothing is eligible, or when the fill fails — the caller DROPS a candidate
 * that answers `null` and walks on, which changes no modulus of any pool it already drew.
 * @param {{pools?: Record<string, ReadonlyArray<import('./stateProseKernel.js').StateProseVariant>>}} block
 * @param {string} blockId
 * @param {string} poolKey
 * @param {'spine'|'modifier'|'turn'} role
 * @param {{slots: Record<string, unknown>, seed: string, audience: string,
 *   dimensions: Record<string, string>}} read
 * @param {{relation?: string, seat?: string}} [typing]
 * @returns {{variant: import('./stateProseKernel.js').StateProseVariant, source: string,
 *   text: string, piece: ComposedPiece}|null}
 */
function drawPiece(block, blockId, poolKey, role, read, typing = {}) {
  const pool = block.pools ? block.pools[poolKey] : undefined;
  if (!Array.isArray(pool) || pool.length === 0) return null;
  const eligible = eligibleVariants(pool, read);
  const variant = drawVariant(eligible, blockId, poolKey, read.seed);
  if (!variant) return null;
  const face = drawFace(variant, blockId, poolKey, read.seed);
  const wordings = variant.wordings;
  const source = face === 0 || !Array.isArray(wordings) ? variant.text : wordings[face - 1];
  const text = fillSlots(source, read.slots);
  if (text === null) return null;
  return {
    variant,
    source,
    text,
    piece: composedPieceOf(pool, variant, poolKey, {
      role, face, audience: read.audience, relation: typing.relation, seat: typing.seat,
    }),
  };
}

/**
 * THE TURN THAT SEATS, if any (ARCH §4.2 step 1, §5.3). A turn is a whole unit for a
 * combination the ENGINE names; it REPLACES the spine and the modifiers it `covers`.
 *
 * The audience filter runs HERE too, and it is not decoration: a turn keyed on a covert
 * source carries `dm-only` on every variant by the covert-source refusal, so on the player
 * face it is not a candidate at all and the composition falls back to spine plus modifiers.
 * @param {{pools?: Record<string, ReadonlyArray<import('./stateProseKernel.js').StateProseVariant>>,
 *   poolMeta?: Record<string, PoolMeta>}} block
 * @param {string} spineKey
 * @param {ReadonlyArray<{key: string}>|undefined} turns
 * @param {{slots: Record<string, unknown>, seed: string, audience: string,
 *   dimensions: Record<string, string>}} read
 * @returns {{key: string, covers: ReadonlyArray<string>}|null}
 */
function seatedTurn(block, spineKey, turns, read) {
  for (const row of Array.isArray(turns) ? turns : []) {
    const key = row && typeof row.key === 'string' ? row.key : '';
    if (!key) continue;
    const meta = poolMetaOf(block, key);
    if (meta.role !== 'turn') continue;
    if (!Array.isArray(meta.spines) || !meta.spines.includes(spineKey)) continue;
    const pool = block.pools ? block.pools[key] : undefined;
    if (!Array.isArray(pool) || pool.length === 0) continue;
    if (eligibleVariants(pool, read).length === 0) continue;
    return { key, covers: Array.isArray(meta.covers) ? meta.covers : [] };
  }
  return null;
}

/**
 * THE CANDIDATE STAGE (ARCH §4.2 step 2) — AUDIENCE FIRST, then frozen metadata only.
 *
 * ⛔ THE ORDER IS THE LAW, not a convenience. A covert pool must not be a candidate on the
 * player face, because a candidate that is filtered LATER has already consumed a seat, a
 * budget slot or a position-budget withdrawal — and nothing a covert piece does may be
 * observable on the player face, INCLUDING WHAT IT PREVENTED. Filtering by `eligibleVariants`
 * first also takes the other two kernel filters at the right moment: a pool that partitions
 * itself by a dimension the caller has not answered is silent BY ITSELF, which is `poolDimensions`
 * being per pool rather than per block.
 * @param {{pools?: Record<string, ReadonlyArray<import('./stateProseKernel.js').StateProseVariant>>,
 *   poolMeta?: Record<string, PoolMeta>}} block
 * @param {string} spineKey
 * @param {ReadonlyArray<StateProseCandidate>|undefined} candidates
 * @param {ReadonlyArray<string>} covered keys a seated turn already states
 * @param {{slots: Record<string, unknown>, seed: string, audience: string,
 *   dimensions: Record<string, string>}} read
 * @returns {Array<{key: string, meta: PoolMeta, change: 0|1}>}
 */
function admissibleCandidates(block, spineKey, candidates, covered, read) {
  /** @type {Array<{key: string, meta: PoolMeta, change: 0|1}>} */
  const rows = [];
  const seen = new Set();
  for (const row of Array.isArray(candidates) ? candidates : []) {
    const key = row && typeof row.key === 'string' ? row.key : '';
    if (!key || key === spineKey || seen.has(key) || covered.includes(key)) continue;
    seen.add(key);
    const pool = block.pools ? block.pools[key] : undefined;
    if (!Array.isArray(pool) || pool.length === 0) continue;
    if (eligibleVariants(pool, read).length === 0) continue;
    const meta = poolMetaOf(block, key);
    if (meta.role !== 'modifier') continue;
    if (!Array.isArray(meta.attach) || !meta.attach.includes(spineKey)) continue;
    rows.push({ key, meta, change: row.change === 1 ? 1 : 0 });
  }
  return rows;
}

/**
 * THE DEPARTURE BIT (ARCH §4.3): is this fact's value uncommon on the estate? Read off the
 * norm leaf, frozen at the pool's birth car; absent means not a departure, which is the
 * reading every pool takes until car 4 mints the leaf.
 * @param {Readonly<Record<string, {departure: 0|1}>>} norms
 * @param {string} blockId
 * @param {string} poolKey
 * @returns {0|1}
 */
function departureBit(norms, blockId, poolKey) {
  const row = norms[`${blockId}::${poolKey}`];
  return row && row.departure === 1 ? 1 : 0;
}

/**
 * THE BAND — the count of the three signals present, 0 to 3 (ARCH §4.3). Three integers, no
 * float and no transcendental: `src/domain/**` bans both, and a weighted score would need a
 * calibration nobody has measured.
 * @param {Readonly<Record<string, {departure: 0|1}>>} norms
 * @param {string} blockId
 * @param {{key: string, meta: PoolMeta, change: 0|1}} row
 * @returns {number}
 */
function bandOf(norms, blockId, row) {
  const tension = row.meta.relation === 'tension' || row.meta.relation === 'contrast' ? 1 : 0;
  return departureBit(norms, blockId, row.key) + tension + row.change;
}

/**
 * ⭐ THE COMPARATOR LAW (ARCH §4.3, P-F7), written once so it can be pointed at.
 *
 * Band descending; within a band the SEEDED PERMUTATION, ascending by the digest of key 5;
 * equal digests broken by ascending CODE-UNIT comparison of the candidate key. The input
 * array's order is NEVER consulted — the desk's call order is a fact about the desk's source
 * file, not about the town — and a suite arm shuffles the input to prove it.
 *
 * ⛔ `a < b`, NEVER `localeCompare` AND NEVER `Intl`. A locale collation reads the host's
 * ICU tables, so two devices order the same two non-ASCII keys differently and the same seed
 * composes two different units. The ban is enforced from three sides: eslint over
 * `src/domain/**`, the estate's own source scan, and this module's fence test.
 * @param {{band: number, order: number, key: string}} a
 * @param {{band: number, order: number, key: string}} b
 * @returns {number}
 */
function compareSalience(a, b) {
  if (a.band !== b.band) return b.band - a.band;
  if (a.order !== b.order) return a.order - b.order;
  if (a.key === b.key) return 0;
  return a.key < b.key ? -1 : 1;
}

/**
 * Rank the admissible candidates (ARCH §4.2 step 3).
 *
 * SEEDLESS IS CANONICAL-AT-ZERO HERE TOO (law 4). With no seed there is no permutation to
 * take, so every digest is 0 and the code-unit tie-break decides outright — a stable,
 * readable order for the imported town whose `_seed` the gallery nulls, rather than a
 * permutation of the empty string.
 * @param {Array<{key: string, meta: PoolMeta, change: 0|1}>} rows
 * @param {Readonly<Record<string, {departure: 0|1}>>} norms
 * @param {string} blockId
 * @param {string} spineKey
 * @param {string} seed
 * @returns {Array<{key: string, meta: PoolMeta, change: 0|1, band: number, order: number}>}
 */
function rankCandidates(rows, norms, blockId, spineKey, seed) {
  return rows
    .map((row) => ({
      ...row,
      band: bandOf(norms, blockId, row),
      order: seed ? hashKey(`${seed}::${blockId}::${spineKey}::salience::${row.key}`) : 0,
    }))
    .sort(compareSalience);
}

/**
 * ⭐⭐ THE SEAT A POOL TAKES, AND THE RELATION IT ACTUALLY SEATS AS (ARCH §4.4, §4.5, S2).
 *
 * The sentence seat takes `addition`, `tension` and `contrast` — each its own sentence, the
 * register card to the letter. The CLAUSE seat takes `consequence` ALONE, and only where the
 * relation table carries a row from the spine's PRIMARY field to the modifier's field: a
 * consequence is the standing cost of the first fact.
 *
 * ⛔ THE LICENCE IS READ, NEVER RE-ASKED HERE, AND THAT IS CAR 4d's WHOLE RULING. ARCH §5.2
 * fixes the licence on the spine's PRIMARY FIELD — the first entry of its `reads` — and ARCH
 * §16 keeps `reads` in the wiring census, which never ships. Until car 4d this function read
 * `spineMeta.reads[0]` on a `PoolMeta` that has no `reads` key: it got `undefined` on every
 * pool that will ever exist and degraded INTO the correct answer only because the relation
 * table joins nothing today. A module may not carry a field name it cannot license. The
 * licence is resolved at PROJECTION, where the census, the relation rows and the ratified
 * aliases are all visible (`scripts/lib/dossier-annex-grammar.mjs` `seatOf`), and arrives
 * here as one frozen key.
 *
 * ⛔ AND A CONSEQUENCE THAT DID NOT TAKE THE CLAUSE SEATS AS AN `addition`, WHICH IS A CHANGE
 * OF RELATION AND NOT ONLY OF SEAT. §4.5: a row running modifier→spine is a CAUSE, and a
 * cause "seats here — the edge licenses the adjacency, the empty opener adds no claim". So
 * the effective relation is what the CONNECTIVE is drawn from, and it must be `addition`:
 * `consequence` has one list and it is the CLAUSE list, so a consequence that kept its own
 * relation at the sentence seat would look for a list that does not exist and silently fail
 * to seat at all. That is exactly what happened the first time this ran, on the fixture, and
 * it is why the pair is returned together rather than the seat alone.
 *
 * ⛔ AN ABSENT `seat` IS THE SENTENCE, which is what every pool that ships today reads: the
 * projector emits the key only on a `role: 'modifier'` pool and there are none (car 4d's
 * tally: 708 sentence / 0 clause, every one `not-a-modifier`).
 * @param {PoolMeta} meta
 * @returns {{seat: 'sentence'|'clause', relation: string}}
 */
function seatFor(meta) {
  const declared = meta.relation || 'addition';
  if (meta.seat === CLAUSE_SEAT) return { seat: CLAUSE_SEAT, relation: 'consequence' };
  return {
    seat: SENTENCE_SEAT,
    relation: declared === 'consequence' ? 'addition' : declared,
  };
}

/**
 * How many sentences does this text state? Counted on terminal stops.
 *
 * MEASURED RATHER THAN ASSUMED (this tip): of the corpus's 2,266 variants, ZERO carry `!`
 * and ZERO carry `?`, so a count over `.` is total over everything that ships; `?` is read
 * anyway so the count does not silently under-read the day a question is authored. The
 * corpus bans a digit outright (§0d), so a decimal point cannot pose as a stop.
 * @param {string} text
 * @returns {number}
 */
function sentenceCount(text) {
  const stops = String(text).match(/[.?](?:\s|$)/g);
  return stops ? stops.length : 1;
}

/**
 * THE CAPACITY (ARCH §4.4). The unit is at most TWO SENTENCES with at most ONE JOINT, so the
 * two seats answer two different questions and neither implies the other:
 *
 *   SENTENCE seat — open only when the spine states ONE sentence, because a second sentence
 *     of its own would make the unit three.
 *   CLAUSE seat — open only when the text's FINAL sentence carries no `;` and no `:`, because
 *     a joint onto a sentence that already ranks two clauses is the third rank wall 6 refuses.
 *
 * ⛔ THEY ARE MEASURED APART, and the corpus says so: on DS-DEF-11 the sentence seat is open
 * on 12 of 12 spines and the clause seat on 3 of 12; on DS-DEF-2, 65 of 78 against 59 of 78.
 * A clause test written as "and the spine is one sentence" would refuse 56 lawful joints on
 * one block alone.
 *
 * The clause limb is re-asked against the CURRENT text rather than the spine's, because
 * §4.2 step 8 puts the joint on the FINAL sentence — which a sentence-seat modifier has by
 * then become — so the unit closes on the standing cost.
 * @param {string} text
 * @returns {boolean} whether a joint may attach to this text's final sentence
 */
function clauseFits(text) {
  const sentences = String(text).split(/(?<=[.?])\s+/);
  const last = sentences.length ? sentences[sentences.length - 1] : String(text);
  return !last.includes(';') && !last.includes(':');
}

/**
 * THE FACT BUDGET (ARCH §4.4): `k <= 3 - |spine.reads|`, every field the SELECTING BRANCH
 * evaluates. A one-fact spine takes two modifiers, a two-fact spine one, a three-fact spine
 * none — which is how the hand-paid conjunction explosion is never re-paid through modifiers.
 *
 * ⛔ IT SPENDS `readsCount`, THE PROJECTED INTEGER, AND NOT A `reads` ARRAY (car 4d). This is
 * the second reader of the same phantom: `PoolMeta` has no `reads` key — the authoring half
 * lives in the wiring census and never ships (ARCH §16) — so until car 4d this function read
 * `undefined` on every pool and answered TWO for all 708, including the 49 whose branch reads
 * three fields or more. Car 4 landed `readsCount` from the census for exactly this and no
 * reader was wired to it; car 4d wires it. The measured spread over the 340 pools the census
 * resolved: 212 read one, 79 two, 26 three, 12 four, 11 five.
 *
 * AN ABSENT COUNT IS ONE FACT, which is the modal spine (91 of 118 key functions read one)
 * and the reading that leaves the budget at its documented default of two. It is the reading
 * the 368 WIRING-UNRESOLVED pools take, and it is ABSENT rather than zero on purpose.
 * @param {PoolMeta} spineMeta
 * @returns {number}
 */
function factBudget(spineMeta) {
  const reads = typeof spineMeta.readsCount === 'number' ? spineMeta.readsCount : 1;
  return Math.max(0, COMPOSITION_BOUNDS.facts - reads);
}

/**
 * THE CONNECTIVE DRAW (ARCH §2.4 key 4, §4.5). A phrase list per REACHABLE (relation, seat)
 * pair, in the leaf and nowhere else — the comma and the word live there and never in a
 * variant's own text.
 *
 * NO HASH AT ALL WHEN THE LIST HOLDS ONE PHRASE, which is the shape both floor lists have
 * today, and seedless takes the first phrase like every other draw here.
 * @param {Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>>>>} connectives
 * @param {string} relation
 * @param {'sentence'|'clause'} seat
 * @param {string} blockId
 * @param {string} spineKey
 * @param {string} modifierKey
 * @param {string} seed
 * @returns {string|null} the phrase (possibly the empty opener), or null when the list is empty
 */
function drawConnective(connectives, relation, seat, blockId, spineKey, modifierKey, seed) {
  const bySeat = connectives[relation];
  const list = bySeat ? bySeat[seat] : undefined;
  if (!Array.isArray(list) || list.length === 0) return null;
  if (list.length === 1) return list[0];
  if (!seed) return list[0];
  return list[hashKey(`${seed}::${blockId}::${spineKey}::joint::${modifierKey}`) % list.length];
}

/**
 * Capitalise a connective phrase that opens a sentence. The leaf authors joints in their
 * clause spelling, and the sentence seat is where one becomes an opener.
 * @param {string} phrase
 * @returns {string}
 */
function asOpener(phrase) {
  if (!phrase) return '';
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

/**
 * Down-case a sentence-form modifier's first token after a NON-EMPTY opener — and only then,
 * and only when the token is not a slot.
 *
 * ⛔ WALL 10 ACROSS THE JOIN (T-F8): a `{settlement}`, `{faction}` or `{institution}` fill is
 * a PROPER noun and down-casing it renames a town. The projector refuses a sentence-form face
 * that opens on a proper-typed slot outright; this reads the RAW text rather than the filled
 * one so that refusal has a second, independent limb here — by the time the text is filled,
 * a proper noun and a common one look the same.
 * @param {string} filled the text after `fillSlots`
 * @param {string} source the variant's raw text, slots unfilled
 * @returns {string}
 */
function downCaseOpening(filled, source) {
  if (String(source).startsWith('{')) return filled;
  return filled.charAt(0).toLowerCase() + filled.slice(1);
}

/**
 * THE ARRANGEMENT (ARCH §4.2 step 8). Sentence seat: the spine, then the opener, then the
 * modifier's own sentence. Clause seat: the spine's FINAL sentence loses its stop, the joint
 * carries its own comma and word, the fragment follows and the unit closes on a stop — so
 * the unit's derived order is literally the spine's order followed by the modifier's move,
 * and the unit closes on the standing cost.
 * @param {string} spineText
 * @param {{text: string, source: string, seat: 'sentence'|'clause', phrase: string}} modifier
 * @returns {string}
 */
function arrange(spineText, modifier) {
  if (modifier.seat === CLAUSE_SEAT) {
    const trimmed = spineText.replace(/[.?]\s*$/, '');
    return `${trimmed}${modifier.phrase} ${modifier.text}.`;
  }
  const opener = asOpener(modifier.phrase);
  if (!opener) return `${spineText} ${modifier.text}`;
  return `${spineText} ${opener} ${downCaseOpening(modifier.text, modifier.source)}`;
}

/**
 * ⭐ THE COMPOSER. One block, one spine key, the modifier keys that fired and any turn the
 * engine named — one unit, or nothing at all.
 *
 * With an EMPTY candidate list and no turn this is the kernel's own read plus the one-piece
 * provenance every rung carries today, which is what cars 3b–3g prove by a manifest that
 * cannot move.
 *
 * @param {Record<string, {pools?: Record<string, ReadonlyArray<import('./stateProseKernel.js').StateProseVariant>>,
 *   poolMeta?: Record<string, PoolMeta>}>} corpus a desk leaf
 * @param {string} blockId
 * @param {{spineKey?: string|null, candidates?: ReadonlyArray<StateProseCandidate>,
 *   turns?: ReadonlyArray<{key: string}>, slots?: Record<string, unknown>,
 *   seed?: string|null, audience?: string, dimensions?: Record<string, string>,
 *   leaves?: ProseLeaves}} [options] `leaves` defaults to the three floors above
 * @returns {ComposedUnit|null}
 */
export function composeStateProse(corpus, blockId, options = {}) {
  const block = corpus ? corpus[blockId] : undefined;
  if (!block) return null;
  const spineKey = typeof options.spineKey === 'string' && options.spineKey !== ''
    ? options.spineKey : null;
  if (spineKey === null) return null;
  const leaves = leavesOf(options.leaves);
  const read = {
    slots: options.slots || {},
    seed: typeof options.seed === 'string' ? options.seed : '',
    audience: audienceOf(options.audience),
    dimensions: options.dimensions || {},
  };

  const turn = seatedTurn(block, spineKey, options.turns, read);
  const head = turn
    ? drawPiece(block, blockId, turn.key, 'turn', read)
    : drawPiece(block, blockId, spineKey, 'spine', read);
  if (!head) return null;

  const spineMeta = poolMetaOf(block, spineKey);
  const ranked = rankCandidates(
    admissibleCandidates(block, spineKey, options.candidates, turn ? turn.covers : [], read),
    leaves.norms, blockId, spineKey, read.seed,
  );

  /** @type {ComposedPiece[]} */
  const pieces = [head.piece];
  let text = head.text;
  let budget = factBudget(spineMeta);
  // ONE JOINT PER UNIT and at most TWO SENTENCES (wall 6, R-DA-03, R-DA-06): each seat opens
  // once and closes when it is taken, so the attached count is 0, 1, or — under S2, as a
  // joint plus a second sentence — 2. Never four, and never a second joint.
  const seats = { sentence: sentenceCount(head.text) === 1, clause: true };

  for (const row of ranked) {
    if (budget <= 0) break;
    if (!seats.sentence && !seats.clause) break;
    const { seat, relation } = seatFor(row.meta);
    if (!seats[seat]) continue;
    if (seat === CLAUSE_SEAT && !clauseFits(text)) continue;
    const phrase = drawConnective(
      leaves.connectives, relation, seat, blockId, spineKey, row.key, read.seed,
    );
    if (phrase === null) continue;
    const drawn = drawPiece(block, blockId, row.key, 'modifier', read, { relation, seat });
    if (!drawn) continue;
    text = arrange(text, {
      text: drawn.text, source: drawn.source, seat, phrase,
    });
    pieces.push(drawn.piece);
    budget -= 1;
    seats[seat] = false;
  }

  return Object.freeze({
    blockId,
    poolKey: spineKey,
    angle: head.variant.angle || '',
    text,
    pieces: Object.freeze(pieces),
  });
}

/**
 * ⭐ THE POSITION BUDGET (ARCH §4.4) — at a mount whose desk returns more than two rungs, at
 * most TWO rungs carry modifiers and the rest render as bare spines.
 *
 * WHY IT EXISTS: `overview.systemsHealth` returns up to ten rungs and `faith.patronSeat`
 * eight. Ten rungs each carrying a modifier is not a dossier, it is a wall, and the reader
 * loses the one thing the composed unit was for.
 *
 * ⛔ AN ARRANGEMENT OVER DRAWS ALREADY MADE, AND THE ORDER OF OPERATIONS IS THE POINT. The
 * rungs are RANKED FIRST — on the band and key 5 of their own top candidate, which needs no
 * draw — and only then composed, each rung once, with its candidates or with an empty list.
 * Composing twice and discarding would be the same text (a dropped candidate changes no
 * modulus) but it would spend the draw twice for nothing.
 *
 * Every rung's candidates are AUDIENCE-FILTERED before they can rank, so a withdrawal can
 * never be a covert artefact: a covert pool cannot be the reason another rung lost its
 * modifier on the player face (P-F3).
 *
 * A pool seated at one rung is WITHDRAWN from the others at this mount, so one fact speaks
 * once per mount however many rungs could have carried it.
 *
 * @param {Record<string, {pools?: Record<string, ReadonlyArray<import('./stateProseKernel.js').StateProseVariant>>,
 *   poolMeta?: Record<string, PoolMeta>}>} corpus
 * @param {string} blockId
 * @param {ReadonlyArray<{spineKey?: string|null, candidates?: ReadonlyArray<StateProseCandidate>,
 *   turns?: ReadonlyArray<{key: string}>}>} rungs in the desk's own order, which is preserved
 * @param {{slots?: Record<string, unknown>, seed?: string|null, audience?: string,
 *   dimensions?: Record<string, string>, limit?: number, leaves?: ProseLeaves}} [options]
 *   `limit` defaults to `COMPOSITION_BOUNDS.modifierBearingRungs`
 * @returns {Array<ComposedUnit|null>} one entry per rung, in the rungs' own order
 */
export function composeStateProseMount(corpus, blockId, rungs, options = {}) {
  const block = corpus ? corpus[blockId] : undefined;
  const rows = Array.isArray(rungs) ? rungs : [];
  const limit = typeof options.limit === 'number'
    ? options.limit : COMPOSITION_BOUNDS.modifierBearingRungs;
  if (!block) return rows.map(() => null);
  const leaves = leavesOf(options.leaves);
  const read = {
    slots: options.slots || {},
    seed: typeof options.seed === 'string' ? options.seed : '',
    audience: audienceOf(options.audience),
    dimensions: options.dimensions || {},
  };

  const ranked = rows.map((rung, at) => {
    const spineKey = typeof rung.spineKey === 'string' ? rung.spineKey : '';
    const top = spineKey
      ? rankCandidates(
        admissibleCandidates(block, spineKey, rung.candidates, [], read),
        leaves.norms, blockId, spineKey, read.seed,
      )[0]
      : undefined;
    return {
      at,
      band: top ? top.band : -1,
      order: top ? top.order : 0,
      key: top ? top.key : '',
    };
  }).filter((row) => row.band >= 0).sort(compareSalience);

  const bearing = new Set(ranked.slice(0, Math.max(0, limit)).map((row) => row.at));
  /** @type {Set<string>} */
  const spent = new Set();
  /** @type {Array<ComposedUnit|null>} */
  const out = new Array(rows.length).fill(null);
  /** @type {Set<number>} */
  const composed = new Set();
  // In RANK order, so the withdrawal is decided by salience rather than by the desk's own
  // call order — the rung that wanted a pool most keeps it.
  for (const row of ranked) {
    const rung = rows[row.at];
    /** @type {ReadonlyArray<StateProseCandidate>} */
    const offered = rung.candidates || [];
    const candidates = bearing.has(row.at)
      ? offered.filter((entry) => Boolean(entry) && !spent.has(entry.key))
      : [];
    const unit = composeStateProse(corpus, blockId, {
      ...read, leaves: options.leaves, spineKey: rung.spineKey, candidates, turns: rung.turns,
    });
    out[row.at] = unit;
    composed.add(row.at);
    if (unit) {
      for (const piece of unit.pieces) if (piece.role === 'modifier') spent.add(piece.key);
    }
  }
  // The rungs that offered no admissible candidate at all still compose, as bare spines.
  for (let at = 0; at < rows.length; at += 1) {
    if (composed.has(at)) continue;
    out[at] = composeStateProse(corpus, blockId, {
      ...read, leaves: options.leaves, spineKey: rows[at].spineKey, candidates: [], turns: rows[at].turns,
    });
  }
  return out;
}
