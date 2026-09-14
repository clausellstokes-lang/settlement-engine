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
 *   6  the face draw — over the faces whose SOURCE resolves on this town, and its PAIR
 *      partner where one is marked (ADDENDUM 18 ruling 15, car 8b-W-18c) — and the
 *      connective draw.
 *   7  the fill, per piece, from the block's bag.
 *
 * ⚠ TWO DECLARED DEPARTURES FROM §4.2 AS WRITTEN, BOTH HARMLESS AND BOTH MEASURED (the seam
 * fold's P1 and P2; SITTING §R.3 records them here rather than leaving the docblock to assert
 * an order the code does not keep).
 *   • STEPS 5 AND 6 RUN 6-THEN-5. `drawConnective` is called at :766, a null phrase
 *     `continue`s at :769, and `drawPiece` follows at :770 — the connective before the piece.
 *     It costs nothing because EVERY KEY IS CONTENT-ADDRESSED: a draw that is not spent moves
 *     no modulus and no later index, so the composed bytes are identical either way. It is
 *     also unreachable at this tip, since no shipped pool is a modifier. Written down because
 *     a reader checking the file against §4.2 would otherwise find the deviation and not know
 *     whether it was intended.
 *   • STEP 2 NAMES A `RESOLVED` METADATA FILTER THAT DOES NOT EXIST. `admissibleCandidates`
 *     implements the audience filter, `role`, `attach` and block membership, and `PoolMeta`
 *     carries no `resolved` key at all, so there is nothing to filter on. Unreachable today
 *     for the same reason (0 modifier pools). The ARCH sentence is the one that needs the
 *     amendment; this file states what it does.
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
  facePairOf,
  facePartner,
  faceSourceOf,
  faceWeigh,
  fillSlots,
  hashKey,
  compromisedDraw,
  compromisedSpeaks,
  eligibleFaces,
  fillRoleSlots,
  joinPairFaces,
  pairJoint,
  variantIsAudible,
  // ⭐ THE SCRIBE'S CANDIDATE-SET SWITCH (design §5 READ; W2 commit 4). It lives in the KERNEL
  // because the composer's import list is fenced to exactly two specifiers and a fence is not
  // moved to make room for a feature — and because substituting words into variants is what this
  // kernel already is: pure, import-free, about words rather than about a town.
  scribeVariantPool,
  openerClassOf,
  faceSentenceCount,
  UNIT_SENTENCE_CAP,
  WEIGH_KIND,
} from './stateProseKernel.js';
// ⭐ THE FIRST OF ARCH §4.1's THREE FROZEN LEAVES, WIRED (REWRITE car 8a-11, SITTING §U c-5).
// It is not a lexicon and it is not `src/domain/prose/`: it is this composer's own data leaf,
// named in `CAR_4_LEAF_SPECIFIERS` below since car 3a. MEASURED before it landed with
// `scripts/lib/module-closure.mjs`: the closure moves 2 files / 74,847 B to 3 files / 76,893 B,
// so the edge costs ONE file and 2,046 bytes, against the four files and 150,231 bytes a
// lexicon import was priced at and refused at car 8a-4. The leaf imports nothing itself.
import { DOSSIER_CONNECTIVES } from '../../../data/dossierConnectives.generated.js';

/**
 * The Scribe's rendered words, by block and pool key, as `faceSources.js` puts them on the read.
 * Each entry is one pool's rendered units; the kernel's `scribeVariantPool` decides, per variant,
 * whether a unit fits the variant it claims to be for.
 * @typedef {Record<string, Record<string, ReadonlyArray<object>>>} ScribeBlocks
 */

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
 * @property {string} [source] THE POWER THAT SPEAKS this face (ADDENDUM 18 ruling 15; car
 *   8b-W-18c) — a word of the kernel's `FACE_SOURCES`; absent where the face carries none,
 *   which is every face of every shipped variant
 * @property {number} [pairOf] the PARTNER half of a pair: the face index of the drawn face
 *   this piece was rendered beside. Absent on the drawn face and on every unpaired piece
 * @property {string} [pairKind] with `pairOf` — the pair's KIND (`PAIR_KINDS`): `disagree`,
 *   `reinforce`, `aside` or `view`. Carried so a later car can vary the joint by kind; the
 *   composer renders all four the same way at this car
 */
/**
 * One composed unit — what a rung renders and what it is made of.
 * @typedef {object} ComposedUnit
 * @property {string} blockId
 * @property {string} poolKey the SPINE's key, even when a turn replaced the spine
 * @property {string} angle
 * @property {string} text
 * @property {ReadonlyArray<ComposedPiece>} pieces
 * @property {string} [source] the head piece's source, beside `angle` (car 8b-W-18c); absent
 *   where the drawn face carries none
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
 * @property {string} [seatReason] RESERVED — why a sentence, from the resolver's closed
 *   vocabulary. Emitted on a MODIFIER only, so it ships on no pool, and READ BY NO MODULE:
 *   it is a WAVE diagnostic, named RESERVED on the SHIFT REGISTER beside `seat` (SEAM car 5c,
 *   SITTING §R cure 5) so that the chair's `a reader or a named reserved` rule has no gap. The
 *   projection contract's stray-key arm reads that list and holds it at zero shipped pools.
 * @property {ReadonlyArray<string>} [seatRow] RESERVED — the relation row ids that licensed a
 *   clause. Same disposition as `seatReason`: modifier-only, unread, reserved, held at zero.
 * @property {number} [readsCount] how many fields the pool's SELECTING BRANCH evaluates, read
 *   from the census; absent where the census recovered no reading
 * @property {'fragment'|'sentence'} [form]
 * @property {ReadonlyArray<string>} [attach]
 * @property {ReadonlyArray<string>} [kin] modifier only — the subset of `attach` this pool
 *   THREADS with, resolved at projection (`kinSpines`, scripts/lib/dossier-annex-grammar.mjs)
 *   and frozen. A spine in this list shares a content word with every face of every variant of
 *   this pool, so a reader who has just read that spine meets a familiar noun. It ships on no
 *   pool at this tip because only a modifier has an attach set; an ABSENT list reads in the
 *   comparator as KIN (fail-open), so a corpus that never carried the signal orders exactly as
 *   it did before this car.
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
 * ⭐ THE THREE FROZEN LEAVES THIS COMPOSER MAY IMPORT — ONE OF THEM WIRED, TWO NOT.
 *
 * ARCH §4.1 gives the composer exactly four dependencies: the kernel, and the three
 * generated leaves — the connective phrase lists, the notability bits and the relation
 * table. Car 3a landed ahead of car 4 on purpose (the sequence is 3a then 4, so the seam can
 * be proven byte-identical BEFORE the schema moves), so all three were carried as their own
 * FLOOR VALUES and each was to be swapped for its import at ONE site, deleting nothing else,
 * because every reader below already reads a leaf's shape rather than a literal.
 *
 * ⭐ CONNECTIVES IS NOW THAT SWAP (REWRITE car 8a-11, SITTING §U c-5): `CONNECTIVES` is the
 * leaf. The other two are STILL floors and each for its own measured reason, not for want of a
 * car: `proseNorms.generated.js` carries no departure bit, and `dossierRelations.generated.js`
 * is empty because none of the engine's 165 relation rows joins a desk read root (car 0's F1),
 * which is also why car 4d left this composer reading two of the three at all.
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
 * ⭐⭐ THE CONNECTIVE LISTS — READ FROM THE LEAF, ONE HOME (REWRITE car 8a-11, SITTING §U c-5).
 *
 * ⛔ THE DEFECT THIS ENDS, AND IT LASTED ONE CAR. Until this cure the composer carried the
 * lists as its own FLOOR VALUES, which is what car 3a landed them as because the leaf did not
 * exist yet. Car 8a-9 then authored the leaf to its floors of three and the constant stayed
 * where it was, so the estate held the four lists in TWO HOMES that disagreed —
 * `addition.sentence` 1 against 3, `contrast.sentence` 1 against 3, `tension.sentence` 0
 * against 3, `consequence.clause` 0 against 3 — with no instrument saying so, and every
 * sentence written about "the leaf" by the readers of this constant became false about the
 * leaf inside the same car that wrote it. `scripts/prose-shape-report.mjs` printed one such
 * refusal 408 times on the taste corpus.
 *
 * FOUR REACHABLE (relation, seat) pairs and no others; a fifth is a projector error. The
 * EMPTY OPENER keeps its place at the head of the two lists that assert adjacency itself.
 *
 * ⛔ NOTHING RENDERED MOVES BY THIS READ, and that is a measurement rather than an argument:
 * no shipped pool declares `role: modifier`, so the composer draws no joint on any town, the
 * attach set is empty on all 708, and the classifier prints every one of the 73,284 cells
 * UNCHANGED. The list LENGTH is the modulus of the joint draw and it is already a DECLARED
 * mechanism on the SHIFT REGISTER (`connective-list-length`, pinned 3/3/3/3 over this leaf), so
 * the day a modifier attaches the draw is the mechanism the register already names.
 *
 * ⚠ THE NARROWING, AND WHY IT IS A CAST RATHER THAN A WIDER TYPE HERE. The projector emits
 * every generated leaf under one generic annotation (`Record<string, object>`), so the leaf
 * cannot state the nested shape and this module must. It is NOT an `any` cast — the estate's
 * `domainAnyCastBaseline` walker holds those at zero — and the shape it asserts is the one the
 * projection contract MEASURES on the leaf itself: four relation keys, one seat key each, a
 * list of strings under it, checked in `tests/data/dossierStateProseProjection.contract.test.js`
 * against `RELATIONS` and the four pinned floors.
 */
export const CONNECTIVES = /** @type {Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>>>>} */ (
  DOSSIER_CONNECTIVES
);

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
 * The town's roster of powers as the kernel reads it (car 8b-W-18c). A Set or an array is
 * handed through; anything else is NO roster, which the kernel reads as the stranger alone —
 * the fail-closed reading, so a caller that forgot the roster hears the universal face and
 * never a hall it cannot vouch for.
 * @param {unknown} sources
 * @returns {ReadonlySet<string>|ReadonlyArray<string>|null}
 */
function rosterOf(sources) {
  if (sources instanceof Set) return sources;
  if (Array.isArray(sources)) return sources;
  return null;
}

/**
 * The town's roles, typed at the boundary the same way the roster is: a `Map` from a source
 * word to its roster on this town (`faceSources.js` `rolesOf`), or `null`. Anything else is
 * not a roles table and is refused here rather than crashing a draw.
 * @param {unknown} roles
 * @returns {Map<string, Array<{role: string, n: string}>>|null}
 */
function rolesMapOf(roles) {
  return roles instanceof Map ? /** @type {never} */ (roles) : null;
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
 *   relation?: string, seat?: string, source?: string|null, pairOf?: number|null,
 *   pairKind?: string|null}} options
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
  // THE SPEAKER AND THE PAIR (car 8b-W-18c) ride only where the face carries them, so the
  // one-piece unit every shipped rung is today keeps its five keys exactly — the manifest's
  // base-side synthesis reproduces `pieces` key for key.
  if (typeof options.source === 'string' && options.source !== '') piece.source = options.source;
  if (typeof options.pairOf === 'number') {
    piece.pairOf = options.pairOf;
    if (typeof options.pairKind === 'string') piece.pairKind = options.pairKind;
  }
  return Object.freeze(piece);
}

/**
 * The raw text of one face of a variant — the spine's for face 0, else the wording.
 * @param {import('./stateProseKernel.js').StateProseVariant} variant
 * @param {number} face
 * @returns {string}
 */
function faceRawOf(variant, face) {
  const wordings = variant.wordings;
  return face === 0 || !Array.isArray(wordings) ? variant.text : wordings[face - 1];
}

/**
 * ⭐⭐ THE SYMPTOM POOLS (ADDENDUM 18 ruling 26 edge (i), the chair's refinement).
 *
 * THE FORCING IS SCOPED, AND THE SCOPE IS THE WHOLE REASON THE ROLL MEANS ANYTHING. A
 * compromised source is forced only into the units of pools whose SYMPTOM its covert field
 * marks — one or two on a page. Forced everywhere, the page would print the same voice five
 * times and the pattern would identify the secret to an attentive reader, which is the defect
 * edge (f) exists to prevent. On every other pool the compromised source draws as any source.
 *
 * ⛔ AN ARRAY OF ROWS, NEVER AN OBJECT KEYED ON A SOURCE WORD: `watch` and `court` are fields
 * the desks READ and the wiring census reads an object-literal key under `src/domain/**` as a
 * WRITE of world state. The discipline `faceSources.js` records at its head.
 *
 * SMALL AND RECORDED, per the brief. DS-DEF-2 only, because DS-DEF-2 is the only block with a
 * v3 pool today:
 *   the HALL's symptom is THE PURSE — the `Economic Survival` rows are where a captured
 *     council's accounts show, and `Invasion & War: walls with NO force` is where the military
 *     purse is argued over by name (it is the pool whose pair is about who pays).
 *   the WATCH's and the COURT's symptom is THE WAY IN AND THE LAW — the `Internal Security`
 *     rows, where enforcement and the legal chain are the subject.
 * @type {ReadonlyArray<{block: string, source: string, pools: ReadonlyArray<string>}>}
 */
export const COMPROMISED_SYMPTOM_POOLS = Object.freeze([
  Object.freeze({
    block: 'DS-DEF-2',
    source: 'hall',
    pools: Object.freeze([
      'Invasion & War: walls with NO force',
      'Economic Survival: STRONG',
      'Economic Survival: ADEQUATE',
      'Economic Survival: WEAK',
    ]),
  }),
  Object.freeze({
    block: 'DS-DEF-2',
    source: 'watch',
    pools: Object.freeze([
      'Internal Security: full legal chain (court AND prison)',
      'Internal Security: detention without process',
      'Internal Security: no legal infrastructure',
    ]),
  }),
  Object.freeze({
    block: 'DS-DEF-2',
    source: 'court',
    pools: Object.freeze([
      'Internal Security: full legal chain (court AND prison)',
      'Internal Security: court without detention',
    ]),
  }),
]);

/**
 * Which compromised source of this town, if any, this pool's SYMPTOM marks. At most one: the
 * table gives a source at most one row per block, and the first match wins so the page can
 * never print two forced voices in one unit.
 * @param {string} blockId
 * @param {string} poolKey
 * @param {ReadonlySet<string>|ReadonlyArray<string>|null} compromised
 * @returns {string|null}
 */
function symptomSourceOf(blockId, poolKey, compromised) {
  if (!compromised) return null;
  const held = compromised instanceof Set ? compromised : new Set(compromised);
  if (held.size === 0) return null;
  for (const row of COMPROMISED_SYMPTOM_POOLS) {
    if (row.block !== blockId || !held.has(row.source)) continue;
    if (row.pools.includes(poolKey)) return row.source;
  }
  return null;
}

/**
 * ⭐⭐ THE OPENER ADJACENCY PREFERENCE (ADDENDUM 18 ruling 29 (II), the owner's, AS RATE-BANDED
 * BY RULING 36; car 8b-W-18o).
 *
 * THE OWNER: *"can you also have some sentence structure variation as well?"* — and the page is
 * where the repetition is VISIBLE, because a page carries several pools and each draws a unit.
 * Measured over the corpus this car classifies, 2,114 of 2,275 faces open on the SUBJECT: the
 * complaint is real and it is 93 per cent.
 *
 * SO THE DRAW PREFERS A FACE THAT DOES NOT OPEN THE WAY THE LAST DRAWN UNIT DID. A PREFERENCE
 * AND NEVER A BAN, which is ruling 36 in one line: *"the draw's preference and the selector's
 * veto on a RUN of three, never on every repeat (no exemplar's same-opener rate is zero)"*. If
 * every eligible face opens the way the last one did, the list comes back UNTOUCHED and the
 * repeat stands — a page never goes silent, and never loses a face, for want of variety.
 *
 * ⛔ IT NEVER OVERRIDES THE COMPROMISED FORCING. A forced face is the behaviour of a power the
 * engine holds a secret about (ruling 26); a preference about sentence shape may not decide who
 * speaks on a page where a secret is being kept. The caller applies this only where nothing is
 * forced, and the order is asserted by the suite rather than left to reading order.
 *
 * ⛔ AND IT ANSWERS `null` WHEN IT NARROWS NOTHING, which is the whole zero-shift argument and
 * is why it is spelled this way rather than returning the list unchanged. "The preference did
 * nothing" is then a NAMED BRANCH at the call site, and that branch calls `drawFace` — the same
 * function, on the same key, that drew before this car existed. On 707 of the corpus's 708
 * pools a one-face list cannot narrow; on the first unit of every page there is no previous
 * class to differ from; so the shipped draw is not merely equal to the old one, it IS the old
 * one, taken through the same door.
 * @param {import('./stateProseKernel.js').StateProseVariant} variant
 * @param {ReadonlyArray<number>} eligible
 * @param {string|null} lastOpener the opener class of the previous unit drawn on this page
 * @returns {number[]|null} the narrowed list, or `null` where the preference changes nothing
 */
function preferOpener(variant, eligible, lastOpener) {
  const all = Array.isArray(eligible) ? eligible : [];
  if (!variant || all.length < 2 || typeof lastOpener !== 'string' || lastOpener === '') return null;
  const different = all.filter((face) => openerClassOf(faceRawOf(variant, face)) !== lastOpener);
  return different.length > 0 && different.length < all.length ? different : null;
}

/**
 * ⭐⭐ THE FACE DRAW, WITH THE COMPROMISED PATH (ADDENDUM 18 ruling 26; car 8b-W-18m).
 *
 * On a pool no covert field marks — which is every pool of every town with no secret, and
 * every pool but one or two of a town with one — this is `drawFace` and nothing else, so the
 * whole mechanism is inert wherever the engine holds no secret.
 *
 * On a marked pool the year-seeded roll decides. SPEAKS: the compromised source is forced into
 * the unit and its `compromised` candidate preferred. SILENT: the source is dropped from the
 * draw entirely and the other sources speak.
 *
 * ⛔ THE ROLL DECIDES WHO SPEAKS, NEVER WHAT IS TRUE (ruling 26 edge (j)). It chooses between
 * two lawful pages and can make no sentence true that was false.
 * @param {import('./stateProseKernel.js').StateProseVariant} variant
 * @param {string} blockId
 * @param {string} poolKey
 * @param {{seed: string, sources: unknown, compromised?: unknown, settlementId?: unknown,
 *   year?: unknown}} read
 * @returns {number}
 */
function compromisedFace(variant, blockId, poolKey, read) {
  const last = Array.isArray(read.drawnOpeners) && read.drawnOpeners.length > 0
    ? read.drawnOpeners[read.drawnOpeners.length - 1] : null;
  const source = symptomSourceOf(blockId, poolKey, /** @type {never} */ (read.compromised));
  if (source === null) {
    // ⭐ THE ORDINARY PATH. The preference narrows the eligible list BEFORE the modulus, on the
    // UNCHANGED key; where it narrows nothing it says so, and the draw is `drawFace` itself.
    const narrowed = preferOpener(
      variant, eligibleFaces(variant, /** @type {never} */ (read.sources)), last,
    );
    if (narrowed === null) return drawFace(variant, blockId, poolKey, read.seed, read.sources);
    if (narrowed.length === 1 || !read.seed) return narrowed[0];
    return narrowed[hashKey(`${read.seed}::${blockId}::${poolKey}::w`) % narrowed.length];
  }
  const speaks = compromisedSpeaks(
    read.seed, poolKey,
    typeof read.settlementId === 'string' ? read.settlementId : '',
    typeof read.year === 'number' || typeof read.year === 'string' ? read.year : 0,
  );
  const { eligible, forced } = compromisedDraw(
    variant, eligibleFaces(variant, /** @type {never} */ (read.sources)), source, speaks,
  );
  // ⛔ THE FORCING WINS. A preference about sentence shape may not decide who speaks on a town
  // where the engine holds a secret — the return is BEFORE the narrowing, and the suite asserts
  // that order rather than trusting it to reading order.
  if (forced !== null) return forced;
  const preferred = preferOpener(variant, eligible, last) || eligible;
  if (preferred.length === 1) return preferred[0];
  if (!read.seed) return preferred[0];
  return preferred[hashKey(`${read.seed}::${blockId}::${poolKey}::w`) % preferred.length];
}

/**
 * ⭐⭐ ONE FACE'S TEXT WITH ITS ROLE AND VERB SLOTS FILLED (ADDENDUM 18 ruling 25; car
 * 8b-W-18l) — or its raw text unchanged when it names neither, which is every face of the
 * shipped corpus this car does not re-cut, and is why the car moves no byte it did not mean to.
 *
 * ⛔ THE PAGE'S EXCLUSION IS THE `read`'s, NOT THIS FUNCTION'S. `read.printedRoles` is one Set
 * per desk entry (`withFaceSources` mints it, and an inner entry that reuses the outer's
 * options reuses the Set), so one role is not printed twice across the faces of one tab.
 * ⚠ THE LIMIT, RECORDED RATHER THAN IMPLIED: the set spans a DESK ENTRY, not the whole
 * dossier, so two tabs of one settlement may each print 'a clerk in the hall'. Widening it to
 * the page needs the page's caller to hand ONE options object to every desk, which is a
 * surface above this car and is reported OPEN.
 *
 * @param {import('./stateProseKernel.js').StateProseVariant} variant
 * @param {number} at the face index
 * @param {{seed: string, roles?: unknown, printedRoles?: unknown}} read
 * @param {string} blockId
 * @param {string} poolKey
 * @returns {string} the role-filled text, or `''` when the face cannot be spoken — which
 *   `fillSlots` then turns into the same silence an unfilled slot gives
 */
function faceRoleRaw(variant, at, read, blockId, poolKey) {
  /** @type {string[]} */
  const claimed = [];
  const filled = fillRoleSlots(faceRawOf(variant, at), {
    roles: read.roles instanceof Map ? read.roles : null,
    printed: read.printedRoles instanceof Set ? read.printedRoles : null,
    claimed,
    key: `${read.seed}::${blockId}::${poolKey}::r${at}`,
  });
  return { text: filled === null ? '' : filled, claimed };
}

/**
 * ⭐⭐ COMMIT A PIECE'S ROLES TO THE PAGE (the research reconciliation's slice E; car
 * 8b-W-18o-r). Called ONLY where the piece has landed — its text filled, its slots resolved,
 * its piece pushed. A piece that is dropped consumes NOTHING, which is the defect this pair of
 * functions exists to end: the reader must never get a different person because of a sentence
 * they did not see.
 * @param {{printedRoles?: unknown}} read
 * @param {ReadonlyArray<string>} claimed
 */
function commitRoles(read, claimed) {
  if (!(read.printedRoles instanceof Set)) return;
  for (const role of claimed) read.printedRoles.add(role);
}

/**
 * Draw one pool: the variant, its face, its filled text and its piece(s). `null` when the
 * pool is absent, when nothing is eligible, or when the fill fails — the caller DROPS a
 * candidate that answers `null` and walks on, which changes no modulus of any pool it
 * already drew.
 *
 * ⭐ THE FACE DRAW FILTERS BY SOURCE AND A MARKED PAIR RENDERS BOTH (ADDENDUM 18 ruling 15;
 * car 8b-W-18c). The face is drawn over the faces whose source resolves on this town
 * (`read.sources`, the desk's roster from `faceSources.js`); where the drawn face carries a
 * pair mark and its partner also resolves, BOTH render, in FACE ORDER, the partner's piece
 * marked `pairOf` the drawn face with the pair's `pairKind`. An ineligible partner leaves the
 * drawn face alone.
 *
 * ⭐⭐ AND THE PAIR MAY BE ONE COMPOUND SENTENCE (ADDENDUM 18 ruling 23; car 8b-W-18i). The
 * joint is drawn, seeded, from the pair KIND's own closed list on a key of its own
 * (`::pairjoint`), and the FULL STOP is a member of every list, so a page mixes both forms.
 * Where the joint is the stop — and wherever either half states two sentences — the render is
 * `${lead} ${trail}`, which is car 8b-W-18c's arrangement byte for byte.
 *
 * ⛔ WHAT A COMPOUND COSTS THE CAPACITY RULE, SAID RATHER THAN LEFT TO BE DISCOVERED. The
 * unit's capacity counts SENTENCES in the composed text, so a pair that compounds states ONE
 * sentence where two stood and the SENTENCE seat is open where it was closed. That is ruling
 * 23 working as written (the second attribution rides inside the sentence, so the unit has
 * spent one sentence and not two), and it is inert at this tip: no shipped pool declares
 * `role: modifier`, so no candidate exists to take the seat that opens.
 *
 * ⭐ THE ARCHIVER'S WEIGHING ROW closes the unit after the pair (ADDENDUM 18 ruling 22), from
 * `faceWeigh` — never from the draw, which cannot land on the archiver at all.
 * @param {{pools?: Record<string, ReadonlyArray<import('./stateProseKernel.js').StateProseVariant>>}} block
 * @param {string} blockId
 * @param {string} poolKey
 * @param {'spine'|'modifier'|'turn'} role
 * @param {{slots: Record<string, unknown>, seed: string, audience: string,
 *   dimensions: Record<string, string>, sources: ReadonlySet<string>|ReadonlyArray<string>|null,
 *   scribe?: ScribeBlocks|null}} read
 * @param {{relation?: string, seat?: string}} [typing]
 * @returns {{variant: import('./stateProseKernel.js').StateProseVariant, raw: string,
 *   text: string, source: string|null, pieces: ComposedPiece[]}|null}
 */
function drawPiece(block, blockId, poolKey, role, read, typing = {}) {
  // ⭐ THE SCRIBE'S ONE CHANGE TO THE CHAIN (design §5 READ). The overlay returns the SAME ARRAY
  // REFERENCE unless this town has rendered words for this pool AND they fit the variant they
  // claim, so the corpus path is byte-identical and identity-identical. When they do apply, only
  // the WORDS move: `eligibleVariants` and `drawVariant` below run over the same variants in the
  // same order and return the same vid, which is why the corpus and the Scribe agree on what a
  // seed shows and why every step after this one is untouched.
  const pool = scribeVariantPool(
    block.pools ? block.pools[poolKey] : undefined,
    read.scribe ? read.scribe[blockId]?.[poolKey] : undefined,
  );
  if (!Array.isArray(pool) || pool.length === 0) return null;
  const eligible = eligibleVariants(pool, read);
  const variant = drawVariant(eligible, blockId, poolKey, read.seed);
  if (!variant) return null;
  const face = compromisedFace(variant, blockId, poolKey, read);
  /**
   * ⭐ THE ROLE FILL RUNS FIRST, AND ITS OUTPUT IS THE `raw` EVERY LATER STEP READS (ADDENDUM
   * 18 ruling 25; car 8b-W-18l). Two reasons, both mechanical rather than stylistic:
   *   1. `openLowercased` refuses to lowercase a face whose RAW text opens on a `{slot}`,
   *      because a proper name riding inside a compound sentence keeps its capital. A ROLE is
   *      the opposite case — 'A clerk in the hall' must become 'a clerk in the hall' when it
   *      rides inside one — so the role-FILLED text is what that rule must see. `{settlement}`
   *      still opens on `{`, so the proper-name refusal is untouched.
   *   2. `fillSlots` returns `null` on any unfilled `{slot}`, so a role slot left standing
   *      silences its face. Fail-closed and deliberate: a rendered `{hall}` is worse than no
   *      sentence, and a read carrying no roles is a read that skipped `withFaceSources`.
   * @param {number} at
   * @returns {string}
   */
  // ⭐⭐ A ROLE IS CLAIMED HERE AND COMMITTED WHERE THE PIECE LANDS (the research
  // reconciliation's slice E; car 8b-W-18o-r). `roleRawOf` no longer touches the page's set: it
  // reports what it drew, and every `return` below commits exactly the claims of the pieces it
  // is actually returning. A dropped partner, a dropped weighing and a dropped spine all
  // consume NOTHING, so the reader never gets a different person because of a sentence that was
  // never printed.
  const roleRawOf = (at) => faceRoleRaw(variant, at, read, blockId, poolKey);
  const own = roleRawOf(face);
  const raw = own.text;
  const text = fillSlots(raw, read.slots);
  if (text === null) return null;
  const source = faceSourceOf(variant, face);
  const drawn = composedPieceOf(pool, variant, poolKey, {
    role, face, audience: read.audience, relation: typing.relation, seat: typing.seat, source,
  });
  const partner = facePartner(variant, face, read.sources);
  if (partner === null) {
    commitRoles(read, own.claimed);
    return { variant, raw, text, source, pieces: [drawn] };
  }
  const partnerOwn = roleRawOf(partner);
  const partnerRaw = partnerOwn.text;
  const partnerText = fillSlots(partnerRaw, read.slots);
  if (partnerText === null) {
    commitRoles(read, own.claimed);
    return { variant, raw, text, source, pieces: [drawn] };
  }
  const mark = facePairOf(variant, face);
  const second = composedPieceOf(pool, variant, poolKey, {
    role, face: partner, audience: read.audience, relation: typing.relation, seat: typing.seat,
    source: faceSourceOf(variant, partner), pairOf: face, pairKind: mark ? mark.kind : null,
  });
  // FACE ORDER, for the text and for the pieces alike: the lower index leads, whichever was
  // drawn, so the same pair reads the same way on every town that hears both.
  const first = partner < face;
  // ⭐⭐ THE JOINT (ADDENDUM 18 ruling 23; car 8b-W-18i). The kind's own closed list, drawn on a
  // key of its own, and the full stop is a member of every list — so a pair either becomes ONE
  // COMPOUND SENTENCE with the second attribution riding inside it, or renders exactly as car
  // 8b-W-18c rendered it, `${lead} ${trail}`. `joinPairFaces` takes the second half's RAW text
  // as well as its filled one, because the lowercase rule may not touch a `{slot}`'s fill.
  const joint = pairJoint(mark ? mark.kind : '', blockId, poolKey, read.seed);
  const joined = joinPairFaces(
    first ? partnerText : text,
    first ? text : partnerText,
    first ? raw : partnerRaw,
    joint,
  );
  const pieces = first ? [second, drawn] : [drawn, second];
  // ⭐ THE ARCHIVER'S WEIGHING ROW (ADDENDUM 18 ruling 22), which CLOSES the unit and is never
  // drawn on its own. It rides after the pair whatever the joint was: the ruling's three
  // sentences at most in the unit are the two halves (or one compound) plus this one. An
  // unfilled weigh row silences ITSELF and leaves the pair standing — the same rule the
  // partner takes above, for the same reason: a rendered `{slot}` is worse than no sentence.
  const weigh = faceWeigh(variant, face);
  const weighOwn = weigh === null ? null : roleRawOf(weigh);
  const weighText = weighOwn === null ? null : fillSlots(weighOwn.text, read.slots);
  if (weigh !== null && weighText !== null) {
    pieces.push(composedPieceOf(pool, variant, poolKey, {
      role, face: weigh, audience: read.audience, relation: typing.relation, seat: typing.seat,
      source: faceSourceOf(variant, weigh), pairOf: face, pairKind: WEIGH_KIND,
    }));
  }
  commitRoles(read, own.claimed);
  commitRoles(read, partnerOwn.claimed);
  if (weighOwn !== null && weighText !== null) commitRoles(read, weighOwn.claimed);
  return {
    variant,
    raw: first ? partnerRaw : raw,
    text: weigh !== null && weighText !== null ? `${joined} ${weighText}` : joined,
    source,
    pieces,
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
 * ⭐ THE COMPARATOR LAW (ARCH §4.3, P-F7; the KINSHIP head added at REWRITE car 8a-4 under
 * SITTING §T.4, adopting agenda C″), written once so it can be pointed at.
 *
 * KINSHIP descending; then band descending; within a band the SEEDED PERMUTATION, ascending by
 * the digest of key 5; equal digests broken by ascending CODE-UNIT comparison of the candidate
 * key. The input array's order is NEVER consulted — the desk's call order is a fact about the
 * desk's source file, not about the town — and a suite arm shuffles the input to prove it.
 *
 * ⛔⛔ WHY KINSHIP SITS ABOVE THE BAND AND NOT INSIDE IT, WHICH LOOKS LIKE THE OPPOSITE OF WHAT
 * WAS ADOPTED. C″ asks for two things: "the modifier sharing the spine's subject noun sits
 * nearest the spine" (a tiebreak INSIDE a band) and "a subject shift is forced last REGARDLESS
 * of band". With one bit those are one rule, because a candidate that is not kin is exactly a
 * candidate that shifts the subject: sorting kin first satisfies the second sentence outright
 * and the first as its consequence. Two bits — "kin" and "shifts" — would have been a
 * distinction with no signal behind it, and the register would have carried a mechanism nobody
 * could measure.
 *
 * ⛔ AN ABSENT SIGNAL IS KIN. `kinOf` answers 1 where a pool declares no `kin` list, so a
 * corpus that never carried the field orders exactly as it did before this car — which is why
 * this change moves no cell of the shipped manifest, proven rather than asserted.
 *
 * ⛔ `a < b`, NEVER `localeCompare` AND NEVER `Intl`. A locale collation reads the host's
 * ICU tables, so two devices order the same two non-ASCII keys differently and the same seed
 * composes two different units. The ban is enforced from three sides: eslint over
 * `src/domain/**`, the estate's own source scan, and this module's fence test.
 * @param {{kin?: 0|1, band: number, order: number, key: string}} a
 * @param {{kin?: 0|1, band: number, order: number, key: string}} b
 * @returns {number}
 */
function compareSalience(a, b) {
  const aKin = a.kin === 0 ? 0 : 1;
  const bKin = b.kin === 0 ? 0 : 1;
  if (aKin !== bKin) return bKin - aKin;
  if (a.band !== b.band) return b.band - a.band;
  if (a.order !== b.order) return a.order - b.order;
  if (a.key === b.key) return 0;
  return a.key < b.key ? -1 : 1;
}

/**
 * THE KINSHIP BIT for one candidate against one spine — an array lookup on a FROZEN list, and
 * deliberately nothing more. The lexical work was done once at projection where the estate's
 * one stop list lives; doing it here would need an import ARCH §4.1 refuses (measured at 4
 * files and 150,231 B onto a 70,252 B closure) or a second vocabulary that drifts.
 * @param {PoolMeta} meta
 * @param {string} spineKey
 * @returns {0|1}
 */
function kinOf(meta, spineKey) {
  if (!meta || !Array.isArray(meta.kin)) return 1;
  return meta.kin.includes(spineKey) ? 1 : 0;
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
 * @returns {Array<{key: string, meta: PoolMeta, change: 0|1, kin: 0|1, band: number,
 *   order: number}>}
 */
function rankCandidates(rows, norms, blockId, spineKey, seed) {
  return rows
    .map((row) => ({
      ...row,
      kin: kinOf(row.meta, spineKey),
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
 * @param {string} raw the variant's raw text, slots unfilled
 * @returns {string}
 */
function downCaseOpening(filled, raw) {
  if (String(raw).startsWith('{')) return filled;
  return filled.charAt(0).toLowerCase() + filled.slice(1);
}

/**
 * THE ARRANGEMENT (ARCH §4.2 step 8). Sentence seat: the spine, then the opener, then the
 * modifier's own sentence. Clause seat: the spine's FINAL sentence loses its stop, the joint
 * carries its own comma and word, the fragment follows and the unit closes on a stop — so
 * the unit's derived order is literally the spine's order followed by the modifier's move,
 * and the unit closes on the standing cost.
 * @param {string} spineText
 * @param {{text: string, raw: string, seat: 'sentence'|'clause', phrase: string}} modifier
 * @returns {string}
 */
function arrange(spineText, modifier) {
  if (modifier.seat === CLAUSE_SEAT) {
    const trimmed = spineText.replace(/[.?]\s*$/, '');
    return `${trimmed}${modifier.phrase} ${modifier.text}.`;
  }
  const opener = asOpener(modifier.phrase);
  if (!opener) return `${spineText} ${modifier.text}`;
  return `${spineText} ${opener} ${downCaseOpening(modifier.text, modifier.raw)}`;
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
 *   sources?: ReadonlySet<string>|ReadonlyArray<string>|null, scribe?: ScribeBlocks|null,
 *   leaves?: ProseLeaves}} [options] `leaves` defaults to the three floors above; `sources`
 *   is the town's roster of powers (`faceSources.js` `sourcesOf`, put on by the desk's
 *   `withFaceSources`) — absent reads as the stranger alone (kernel `eligibleFaces`)
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
    sources: rosterOf(options.sources),
    // ⭐ THE ROLES AND THE PAGE'S EXCLUSION SET (ADDENDUM 18 ruling 25; car 8b-W-18l). ⛔ THE
    // READ IS A CLOSED OBJECT, NOT A SPREAD OF `options`, and that is deliberate — but it
    // means a key added to `withFaceSources` and not added HERE is silently dropped. It was:
    // the first render of the re-cut pool silenced every face that drew, because `read.roles`
    // was undefined, `fillRoleSlots` returned null and `fillSlots` turned the empty raw into
    // silence. Fail-closed did its job and hid the defect behind a spine line, which is why
    // this comment names the trap rather than just fixing it.
    roles: rolesMapOf(options.roles),
    printedRoles: options.printedRoles instanceof Set ? options.printedRoles : new Set(),
    // ⭐ THE COVERT HALF (ADDENDUM 18 ruling 26; car 8b-W-18m). Absent on every read that does
    // not come from `withFaceSources`, and absent is the honest default: no secret, no forcing.
    compromised: rosterOf(options.compromised),
    settlementId: typeof options.settlementId === 'string' ? options.settlementId : '',
    year: typeof options.year === 'number' || typeof options.year === 'string' ? options.year : 0,
    // ⭐ THE PAGE'S OPENER TRAIL (ADDENDUM 18 rulings 29 and 36; car 8b-W-18o). An ARRAY the
    // composer PUSHES each drawn unit's opener class onto, never an object keyed on a class
    // word — the wiring census reads an object-literal key under `src/domain/**` as a WRITE of
    // world state, and the discipline `faceSources.js` records at its head holds here too. The
    // preference reads only the LAST entry; the whole trail is kept because ruling 36's "veto
    // on a RUN of three" needs it and because the block measure can count it.
    drawnOpeners: Array.isArray(options.drawnOpeners) ? options.drawnOpeners : [],
    // ⭐ THE SCRIBE'S CANDIDATE WORDS (design §5 READ). Built by `withFaceSources`, carried here
    // because THE READ IS A CLOSED OBJECT and a key added there and not here is silently dropped
    // — the trap the comment above records, which once silenced every face of a re-cut pool.
    // Null on every page today: the draw is off by default and no settlement carries an artefact.
    scribe: options.scribe && typeof options.scribe === 'object' ? options.scribe : null,
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
  const pieces = [...head.pieces];
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
      text: drawn.text, raw: drawn.raw, seat, phrase,
    });
    pieces.push(...drawn.pieces);
    budget -= 1;
    seats[seat] = false;
  }

  // ⭐⭐ THE UNIT CAP, ASSERTED WHERE THE UNIT IS FINISHED (ADDENDUM 18 ruling 30, the owner's;
  // car 8b-W-18o). The grammar caps a pair's halves at projection, where it can see the whole
  // variant; NOTHING at projection can see a spine plus the modifiers a desk seats beside it,
  // because that arrangement exists only here. So this is the one place the DRAWN UNIT — the
  // thing the page actually prints for one pool on one town — can be counted.
  //
  // ⛔ IT IS A REPORT AND NOT A REFUSAL, and that is deliberate. A throw here would blank a
  // rung on a reader's page over a taste rule, which is the trade kernel law 1 refuses
  // everywhere else (the absence of a surface is the absence of a sentence, never a crash).
  // The refusals live at PROJECTION, where a writer can still read them; the estate's suites
  // drive this counter over the corpus and RED there. `unitSentences` rides on the unit so a
  // walker, a gate and the block measure all read one number rather than three counters.
  const unitSentences = faceSentenceCount(text);
  if (Array.isArray(read.drawnOpeners)) read.drawnOpeners.push(openerClassOf(head.raw));
  return Object.freeze({
    blockId,
    poolKey: spineKey,
    angle: head.variant.angle || '',
    ...(head.source ? { source: head.source } : {}),
    text,
    unitSentences,
    opener: openerClassOf(head.raw),
    overCap: unitSentences > UNIT_SENTENCE_CAP,
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
 *   dimensions?: Record<string, string>, sources?: ReadonlySet<string>|ReadonlyArray<string>|null,
 *   scribe?: ScribeBlocks|null, limit?: number, leaves?: ProseLeaves}} [options]
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
    sources: rosterOf(options.sources),
    // ⭐ THE ROLES AND THE PAGE'S EXCLUSION SET (ADDENDUM 18 ruling 25; car 8b-W-18l). ⛔ THE
    // READ IS A CLOSED OBJECT, NOT A SPREAD OF `options`, and that is deliberate — but it
    // means a key added to `withFaceSources` and not added HERE is silently dropped. It was:
    // the first render of the re-cut pool silenced every face that drew, because `read.roles`
    // was undefined, `fillRoleSlots` returned null and `fillSlots` turned the empty raw into
    // silence. Fail-closed did its job and hid the defect behind a spine line, which is why
    // this comment names the trap rather than just fixing it.
    roles: rolesMapOf(options.roles),
    printedRoles: options.printedRoles instanceof Set ? options.printedRoles : new Set(),
    // ⭐ THE COVERT HALF (ADDENDUM 18 ruling 26; car 8b-W-18m). Absent on every read that does
    // not come from `withFaceSources`, and absent is the honest default: no secret, no forcing.
    compromised: rosterOf(options.compromised),
    settlementId: typeof options.settlementId === 'string' ? options.settlementId : '',
    year: typeof options.year === 'number' || typeof options.year === 'string' ? options.year : 0,
    // ⭐ THE PAGE'S OPENER TRAIL (ADDENDUM 18 rulings 29 and 36; car 8b-W-18o). An ARRAY the
    // composer PUSHES each drawn unit's opener class onto, never an object keyed on a class
    // word — the wiring census reads an object-literal key under `src/domain/**` as a WRITE of
    // world state, and the discipline `faceSources.js` records at its head holds here too. The
    // preference reads only the LAST entry; the whole trail is kept because ruling 36's "veto
    // on a RUN of three" needs it and because the block measure can count it.
    drawnOpeners: Array.isArray(options.drawnOpeners) ? options.drawnOpeners : [],
    // ⭐ THE SCRIBE'S CANDIDATE WORDS (design §5 READ). Built by `withFaceSources`, carried here
    // because THE READ IS A CLOSED OBJECT and a key added there and not here is silently dropped
    // — the trap the comment above records, which once silenced every face of a re-cut pool.
    // Null on every page today: the draw is off by default and no settlement carries an artefact.
    scribe: options.scribe && typeof options.scribe === 'object' ? options.scribe : null,
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
      // ⛔ THE RUNG'S OWN KINSHIP IS ITS TOP CANDIDATE'S (REWRITE car 8a-4). A rung whose best
      // modifier threads with its spine outranks one whose best modifier turns outward, which
      // is the position budget spending its two seats where the passage will read as one. A
      // rung with no candidate at all is filtered out below and never compared.
      kin: top ? top.kin : 1,
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
