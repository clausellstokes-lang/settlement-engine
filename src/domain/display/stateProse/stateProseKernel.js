/**
 * domain/display/stateProse/stateProseKernel.js — LANE P: the state-prose reader.
 *
 * WHAT THIS IS. The dossier's own voice. The corpus (docs/content/
 * RECEIPT_POOLS_DOSSIER_STATE.md, projected into src/data/dossierStateProse/*) holds,
 * for every closed band, status, posture and tier the town page renders, three to five
 * angle-distinct sentences written as the settlement explaining its own condition.
 * This module is the only thing that turns one of those pools into one sentence.
 *
 * It is a PURE, HEADLESS LEAF: no imports, no state, no clock, no RNG. Composition
 * lives display-side and nothing here is persisted — dark, the page is byte-identical.
 *
 * ── THE SIX LAWS THIS FILE ENFORCES ─────────────────────────────────────────────────
 *
 * 1. ANCHORED LIVENESS (the spec's item 3, and the reason this is a kernel rather than
 *    a lookup). A variant renders ONLY when every slot it names has a real fill. A
 *    sentence about {counterpart} cannot appear on a town with no counterpart; a
 *    sentence about {season} cannot appear with seasons off. No pool key, no eligible
 *    variant, or no fill ⇒ `null`, and `null` means the composer renders NOTHING —
 *    never a stub, never a gap, never "no data". R-DST-K: the absence of a surface is
 *    the absence of a sentence.
 *
 * 2. FAIL-CLOSED AUDIENCE (§0e, J-CPL-5) — ⭐⭐ RE-CUT AT CAR 8b-W-18o-r, AND THE RE-CUT
 *    NARROWS IT ON PURPOSE. A variant marked `dm-only` is covert, and the player projection
 *    truncates it to SILENCE, never to a hint.
 *
 *    THE LAW IS: **THE PLAYER PAGE NEVER STATES A COVERT FACT.**
 *
 *    ⛔ IT USED TO BE STATED AS "a page over a state with a covert seam must be
 *    BYTE-IDENTICAL to a page over a state that genuinely lacks one", and that sentence is
 *    now FALSE — not because the law weakened, but because ADDENDUM 18 ruling 26 (the
 *    owner's) made it impossible to keep and still obey. A compromised source SPEAKS, and
 *    speaks to reassure: the player page over a captured hall is DIFFERENT from the page
 *    over an honest one, and that difference is the whole point — *"it shows the compromised
 *    power BEHAVING, and the notebook beside it carries the fact"*. A byte-equality arm
 *    would have refused the ruling.
 *
 *    ⛔ SO THE ARM THAT ENFORCES THIS IS NO LONGER A BYTE COMPARISON BETWEEN TWO TOWNS. It
 *    is the AUDIENCE GATE, which car 8b-W-18m already added and which is the thing that was
 *    always doing the work: no `compromised` face may carry a `dm-only` mark, and the
 *    player's text never contains the covert field's name or value. What a covert fact may
 *    change is WHICH LAWFUL SENTENCE is drawn; what it may never do is put the fact on the
 *    page. An unrecognised audience is still treated as the player's — the restrictive read
 *    is the safe one when the caller is wrong.
 *
 *    ⚠ AND THE OLD FORM STILL BINDS WHEREVER NO RULING HAS LICENSED A DIFFERENCE: a covert
 *    VARIANT is truncated to silence and a rung never goes blank for want of one, which is
 *    why `compromisedDraw` refuses to empty an eligible list. A silence that blanked a rung
 *    would be the covert fact visible AS AN ABSENCE, which is the leak the narrow form still
 *    forbids.
 *
 * 3. THE AVALANCHE-MIXED DRAW, never a raw FNV modulo. FNV-1a's low bit is a PARITY,
 *    not a hash: bit 0 of the digest is the XOR of bit 0 of every input character, so a
 *    seed family whose varying token repeats holds it constant and `% poolLength` on a
 *    power-of-two pool leaves half the pool unreachable (measured on wizard_news: a
 *    `% 8` draw reached four residues of eight). The finalizer is murmur3's fmix32, the
 *    same cure settlementRumors.js's `whatPhrase` carries.
 *
 * 4. SEEDLESS IS CANONICAL-AT-ZERO. No seed ⇒ index 0 of the eligible list, so a
 *    walker, a census or a print path that has no telling to key on reads a stable
 *    sentence rather than an arbitrary one.
 *
 * 5. THE DEMOTED STATE DIMENSION, FAIL-CLOSED. Some blocks carry a STATE-KEY with more
 *    dimensions than a pool key can hold, and the projection demotes the surplus into
 *    per-variant channels. A pool that partitions itself by such a dimension is
 *    UNREADABLE until the caller answers it, not "readable with everything": half its
 *    sentences are false about this town and nothing here can tell which half. See
 *    STATE_MARK_DIMENSIONS. This is the only law in the file that protects a TRUTH
 *    CLAIM rather than a surface, and it is the reason `marks` is read twice.
 *
 * 6. THE INDEX-STABLE DRAW (ARCH §13 row 22, SIGNED at SITTING §N.2). The variant draw is
 *    the ARGMAX of a per-variant key over the eligible set, keyed on the annex-frozen `vid`
 *    rather than `% eligible.length`, so that appending a wording moves about a quarter of
 *    a pool's reads and every one of them moves TO the new wording rather than between two
 *    old ones. See `drawVariant`, which carries the measurement, the tie rule, and the
 *    reason the modulus survives for a corpus that carries no stable ids.
 *
 * ⚠ `marks` IS AN UNTYPED BAG CARRYING THREE DISTINCT SEMANTICS, and a reader that
 * knows only one of them fails silently rather than loudly. They are: the AUDIENCE mark
 * (`dm-only`, law 2); the STATE DIMENSION words (law 5); and, in the causal register
 * only, the family-local CAUSAL ARM names, which are open and family-scoped and so are
 * filtered by causalDossierProse.js rather than here. The three vocabularies are
 * disjoint over the shipped corpus, and the contract test is what keeps them that way.
 *
 * THE PROMISE holds: same seed + same state ⇒ same sentence, forever. Eligibility is a
 * function of the state alone, and the draw is a function of the seed and the pool
 * identity alone.
 *
 * @enforced-by tests/domain/stateProseKernel.test.js
 */

/**
 * One authored sentence, as the corpus projection emits it.
 * @typedef {object} StateProseVariant
 * @property {string} [angle] the standpoint tag (`ledger`, `street`, `visitor`, …)
 * @property {ReadonlyArray<string>} [marks] inline marks — `dm-only`, a STATE DIMENSION
 *   word (see STATE_MARK_DIMENSIONS), or a causal arm name
 * @property {string} text the sentence, slots unfilled — FACE 0, canonical-at-zero
 * @property {ReadonlyArray<string>} [slots] every `{slot}` the sentence names
 * @property {ReadonlyArray<string>} [wordings] FACES 1..n — the same marks and a SUBSET of
 *   the same `{slot}` set BY CONSTRUCTION (ARCH §2.3 as amended by ADDENDUM 18 rulings 2 and
 *   12, 2026-09-12): a face need not restate its key, may not contradict it, and never names
 *   `{settlement}`. Absent on every variant the corpus shipped before the REWRITE wave, which
 *   is why `drawFace` below takes no hash at all on such a variant.
 * @property {ReadonlyArray<string|null>} [sources] ONE FACE PER POWER (ADDENDUM 18 ruling 15,
 *   car 8b-W-18c): the SOURCE of each face, parallel to `[text, ...wordings]` — index 0 is the
 *   spine's (null today: a spine row carries no tag), index i the i-th wording's. A word of
 *   `FACE_SOURCES` or `null`; `null` and `stranger` resolve on every town. Absent on every
 *   shipped variant, and absent means every face is the stranger's.
 * @property {ReadonlyArray<{id: number, kind: string}|null>} [pairs] the PAIR mark, parallel
 *   to `sources`: two faces sharing a pair `id` are presented TOGETHER on a town where both
 *   resolve (ruling 15's "two where they differ", widened by the owner's refinement of
 *   2026-09-13 to four KINDS — see `PAIR_KINDS`). `null` on an unpaired face; absent when no
 *   face is paired. A FIFTH kind, `weigh`, marks the ARCHIVER'S ROW on the same pair id as the
 *   two halves it closes (ADDENDUM 18 ruling 22; car 8b-W-18i): a pair id is therefore carried
 *   by exactly two halves and AT MOST ONE weigh, never by three halves.
 * @property {number} [vid] THE STABLE ID — the annex row number, frozen at SEAM car 4 and
 *   pinned on `docs/content/prose-shift-register.json`. It is what law 6's draw hashes on,
 *   and it is OPTIONAL on this type because the causal register (R2) carries none: §13 row
 *   14 keeps `vid` in the STATE schema alone, and `drawVariant` falls back to the modulus
 *   exactly where this property is absent.
 */
/**
 * One corpus block — a dossier surface or a closed ladder.
 * @typedef {object} StateProseBlock
 * @property {string} [title]
 * @property {ReadonlyArray<string>} [sectionTarget]
 * @property {ReadonlyArray<string>} [arms]
 * @property {ReadonlyArray<string>} [slots]
 * @property {Record<string, ReadonlyArray<StateProseVariant>>} pools
 */
/**
 * A desk leaf: block id → block.
 * @typedef {Record<string, StateProseBlock>} StateProseCorpus
 */

/**
 * FNV-1a 32-bit. A LOCAL copy of the eight-line helper, per the display-sidecar
 * precedent (newsVoice.js, settlementRumors.js): a display leaf keeps its own fold
 * rather than importing a sibling's content module and dragging it into this chunk.
 * @param {string} str
 * @returns {number}
 */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * murmur3's fmix32 — the avalanche finalizer that makes every bit of the digest a
 * hash rather than a parity. See law 3 above.
 * @param {number} h
 * @returns {number}
 */
function avalanche32(h) {
  let x = h >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return x >>> 0;
}

/** The audience whose page truncates covert content to silence. */
export const AUDIENCE_DM = 'dm';
/** Every other audience string, including a wrong one, reads as this. */
export const AUDIENCE_PLAYER = 'player';

/** The inline mark §0e puts on a covert variant. */
const COVERT_MARK = 'dm-only';

/** The reserved pool key of a block whose variants carry no pool label. */
export const SOLE_POOL = '*';

/**
 * Is this slot value a real fill? A fill must be a non-empty string. A number is
 * REJECTED on purpose: §0d bans digits from dossier-state prose outright, so a numeric
 * fill is a caller bug, and rendering it would put a figure in a sentence whose whole
 * job is to band one.
 * @param {unknown} value
 * @returns {boolean}
 */
function isFilled(value) {
  return typeof value === 'string' && value.trim() !== '';
}

/**
 * Can this variant speak over this state? Every slot it names must have a fill.
 * @param {StateProseVariant|undefined} variant
 * @param {Record<string, unknown>} slots
 * @returns {boolean}
 */
export function variantIsAnchored(variant, slots) {
  const named = variant?.slots;
  if (!Array.isArray(named) || named.length === 0) return true;
  if (!slots || typeof slots !== 'object') return false;
  return named.every((slot) => isFilled(slots[slot]));
}

/**
 * Is this variant readable by this audience?
 * @param {StateProseVariant|undefined} variant
 * @param {string} audience
 * @returns {boolean}
 */
export function variantIsAudible(variant, audience) {
  if (audience === AUDIENCE_DM) return true;
  const marks = variant?.marks;
  return !Array.isArray(marks) || !marks.includes(COVERT_MARK);
}

/**
 * The second STATE dimensions the projection demotes into `marks`.
 *
 * WHY THIS EXISTS. Three blocks carry a STATE-KEY the pool key cannot hold: DS-GEN-1 is
 * `type` by `severity` by `factions.length`, DS-GEN-6 is `route` by `hasFoodDeficit` by
 * `tier`, DS-GEN-9 is `type` by `severity` by `anchored` by `yearsAgo`. The projection
 * demotes the surplus dimensions into two per-variant channels, `slots` and `marks`.
 * `variantIsAnchored` enforces the first. Nothing enforced the second, so a MINOR crime
 * wave could draw the variant marked CATASTROPHIC and the page would state something
 * false about the town. A wrong sentence is worse than no sentence.
 *
 * DERIVED FROM THE POOL, NEVER DECLARED BY THE CALLER. A registry a desk author must
 * remember to fill is a guard against a defect of ignorance, written by someone who
 * already knows. And the derivation is per POOL, not per block, because the corpus is
 * mixed at the block grain: DS-GEN-9's `founding` pool carries no marks at all while its
 * `event type: *` pools are fully marked, and DS-GEN-6's `tier overlay: city` pool holds
 * a marked and an unmarked variant side by side. A block-level rule would demand an
 * answer from a surface that has no business knowing one.
 *
 * FROZEN HERE RATHER THAN EMITTED BY THE GENERATOR. The alternative is a `dimension`
 * field on every variant, which is tidier by layer and costs a regeneration to buy
 * nothing: the words are already in the corpus, and the contract test refuses drift
 * between this constant and what the corpus actually spells.
 *
 * @enforced-by tests/data/dossierStateProseProjection.contract.test.js
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const STATE_MARK_DIMENSIONS = Object.freeze({
  severity: Object.freeze(['minor', 'major', 'catastrophic']),
  deficit: Object.freeze(['deficit', 'no deficit']),
  anchor: Object.freeze(['anchored', 'not anchored']),
});

/**
 * mark word → the one dimension it belongs to. Derived, so the vocabulary is written
 * once above and a word cannot drift into two dimensions without the contract noticing.
 * @type {Readonly<Record<string, string>>}
 */
const DIMENSION_OF_MARK = Object.freeze(Object.fromEntries(
  Object.entries(STATE_MARK_DIMENSIONS)
    .flatMap(([dimension, words]) => words.map((word) => [word, dimension])),
));

/**
 * Which dimensions does THIS POOL partition itself by? Empty for every pool the
 * projection did not demote a dimension into — which is most of them, and is what makes
 * law 5 free for the rest of the corpus and for the whole causal register.
 * @param {ReadonlyArray<StateProseVariant>|undefined} pool
 * @returns {string[]} dimension names, sorted
 */
export function poolDimensions(pool) {
  const found = new Set();
  for (const variant of pool || []) {
    for (const mark of variant?.marks || []) {
      const dimension = DIMENSION_OF_MARK[mark];
      if (dimension) found.add(dimension);
    }
  }
  return [...found].sort();
}

/**
 * A variant carrying marks from a dimension speaks ONLY over the value it names. One
 * carrying none is dimension-neutral and speaks over every value, which is what lets a
 * mixed pool hold a general sentence beside two specific ones.
 * @param {StateProseVariant|undefined} variant
 * @param {string} dimension
 * @param {string} value
 * @returns {boolean}
 */
function variantSpeaksOver(variant, dimension, value) {
  const own = (variant?.marks || []).filter((mark) => DIMENSION_OF_MARK[mark] === dimension);
  return own.length === 0 || own.includes(value);
}

/**
 * The variants of one pool that this state and this audience can actually carry.
 * @param {ReadonlyArray<StateProseVariant>|undefined} pool
 * @param {{slots?: Record<string, unknown>, audience?: string,
 *   dimensions?: Record<string, string>}} [options]
 * @returns {ReadonlyArray<StateProseVariant>}
 */
export function eligibleVariants(pool, options = {}) {
  if (!Array.isArray(pool) || pool.length === 0) return [];
  // Read on the RAW pool, before any filter: the audience or a missing slot could remove
  // the last variant carrying a dimension word and turn a partitioned pool into one that
  // looks unpartitioned, which is the fail-OPEN reading wearing the gate's coat.
  const dimensions = poolDimensions(pool);
  const given = options.dimensions || {};
  // FAIL-CLOSED (law 5). A pool that partitions itself by a dimension the caller did not
  // answer is UNREADABLE, and silence is the safe failure: R-DST-K already means silence
  // and a contradiction has no safe reading. Not a throw — this is a display path, and a
  // blank surface beats a crashed one.
  for (const dimension of dimensions) {
    const value = given[dimension];
    if (typeof value !== 'string' || !STATE_MARK_DIMENSIONS[dimension].includes(value)) return [];
  }
  const slots = options.slots || {};
  const audience = options.audience === AUDIENCE_DM ? AUDIENCE_DM : AUDIENCE_PLAYER;
  return pool.filter(
    (variant) => variantIsAudible(variant, audience)
      && variantIsAnchored(variant, slots)
      && dimensions.every((dimension) => variantSpeaksOver(variant, dimension, given[dimension])),
  );
}

/**
 * Substitute every `{slot}` in a sentence. Returns `null` when any named slot lacks a
 * fill — a rendered `{counterpart}` is worse than no sentence, and this is the second
 * gate on the same invariant `variantIsAnchored` checks, kept because the composer and
 * the renderer are different call sites and only one of them is obliged to filter.
 * @param {string} text
 * @param {Record<string, unknown>} slots
 * @returns {string|null}
 */
export function fillSlots(text, slots) {
  if (typeof text !== 'string' || text === '') return null;
  let unfilled = false;
  const out = text.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (whole, name) => {
    const value = slots ? slots[name] : undefined;
    if (!isFilled(value)) { unfilled = true; return whole; }
    return String(value).trim();
  });
  return unfilled ? null : out;
}

/**
 * THE STABLE ID OF ONE VARIANT, or `null` where it carries none. The `vid` is the annex row
 * number frozen at SEAM car 4 (`docs/content/prose-shift-register.json`, row `vids`): a new
 * variant takes the NEXT number, nothing is renumbered and nothing is deleted, and the
 * projector throws on a renumbering. It is the only field of a variant that names it across a
 * rewrite, which is what makes it the draw key below.
 *
 * ⛔ ZERO IS A REAL ID AND THE TEST FOR IT IS `>= 0`. Seven shipped pools lead with a
 * `canonical` row numbered 0 (DS-ECO-3 x3, DS-ECO-6 x2, DS-ECO-7 x2 — the same seven ARCH
 * §16 item 5 names as single-faced by refusal), so those pools number 0..n-1 while the other
 * 701 number 1..n. A truthiness test, or a `> 0` test, reads those seven ids as ABSENT and
 * drops exactly those seven pools back onto the modulus draw while the other 701 move — a
 * silent split of the corpus into two draw regimes, which is the failure this comment is
 * here to stop somebody re-introducing. Driven: the sweep in the kernel's test names all
 * seven by block and pool.
 *
 * ⛔ WHY THIS IS AN EXPORT AND NOT A PRIVATE HELPER (REWRITE car 8a-11, SITTING §U c-4). The
 * sweep that names the seven RE-DERIVES the id-less predicate over the leaves; it pins the
 * CORPUS's ids and never calls this function, so a `vid <= 0` planted right here left both
 * named acceptances green while seven pools reverted to the modulus. An instrument that
 * cannot see the guard is not standing over it. The kernel's own predicate is therefore
 * reachable, and the test asserts it on `vid: 0` and drives `drawVariant` on a synthetic
 * vid-0 pool whose draw must differ from the modulus. Exported for that arm and for no
 * product caller: `tests/lint/composeStateProseFence.test.js` holds the composer's import
 * list, and no `src/` file outside this module names it.
 * @param {StateProseVariant|null|undefined} variant
 * @returns {number|null}
 */
export function stableVid(variant) {
  const vid = variant ? variant.vid : undefined;
  // ⛔ THE NARROWING IS WRITTEN OUT rather than left to `Number.isInteger`, which the strict
  // domain typecheck does not read as a type guard: `typeof vid === 'number'` is what tells it
  // the value is no longer `undefined`, and `Number.isInteger` still carries the integer half
  // of the test. `>= 0` and never `> 0` — vid 0 is a real id on seven shipped pools (car 8a-1).
  if (typeof vid !== 'number' || !Number.isInteger(vid) || vid < 0) return null;
  return vid;
}

/**
 * The deterministic draw. The key binds the seed to the POOL IDENTITY, so two pools
 * read on one page with one seed do not draw the same index, and the same pool read
 * twice in one render draws the same sentence.
 *
 * ── LAW 6: THE INDEX-STABLE DRAW (ARCH §13 row 22, SIGNED at SITTING §N.2) ────────────
 *
 * The draw is the ARGMAX of `hashKey(${seed}::${blockId}::${poolKey}::v${vid})` over the
 * eligible set, NOT `hash(parent) % eligible.length`. The two differ only in what an
 * APPENDED wording costs, and that difference is the whole reason the rewrite wave can
 * grow the corpus at all:
 *
 *   under `% length`   appending a fourth wording to a three-wording pool re-rolls about
 *                      three quarters of that pool's reads on every world, and a read that
 *                      moves usually moves BETWEEN TWO OLD WORDINGS, which no reader can
 *                      tell from a rewrite of the sentence they had.
 *   under the argmax   about one quarter moves, and EVERY read that moves moves TO THE NEW
 *                      wording. Nothing already drawn is disturbed by the arrival of a
 *                      sibling it did not lose to.
 *
 * The owner's standing rule is NEVER TRIM, quadruple everything: a pool must be able to
 * grow forever, one wording at a time, at the minimum disturbance. The price is one extra
 * one-time re-index, taken at Shift 1 where every sentence is being rewritten anyway; the
 * classifier prints RE-INDEXED per cell and the owner's veto stands on that record.
 *
 * ⛔ A FACT NEVER MOVES. The eligible SET is untouched by this function: the audience
 * filter, the anchoring filter and the state-dimension filter have already run, and the
 * argmax only chooses among members the old draw could equally have chosen. Same pool,
 * same eligible set, a different member of it.
 *
 * ⛔ WHY THE MODULUS SURVIVES AS A FALLBACK, AND WHY THAT IS NOT TWO REGIMES. A pool
 * whose members carry no `vid` has NO stable id, so there is nothing append-safe to hash
 * on; keying such a pool on a position inside the already-filtered `eligible` array would
 * be exactly as unstable as the modulus while looking stable, which is worse than the
 * modulus. The causal register (`dossierCausalProse.generated.js`) is that corpus today:
 * it carries no `vid` on any variant, and it draws through this same function, so the
 * fallback is what keeps this car's promise of ZERO moved reads there. The six STATE
 * leaves carry a `vid` on all 2,266 variants, the shift register's `vids` digest is the
 * door that keeps them, and `tests/domain/stateProseKernel.test.js` asserts by sweep that
 * the shipped state corpus never reaches the fallback line, so a leaf that silently lost
 * its ids would red rather than quietly revert to the unstable draw.
 *
 * Ties are broken by the LOWER vid, so a 32-bit collision is decided by the annex and not
 * by the order the audience filter happened to leave behind.
 *
 * @param {ReadonlyArray<StateProseVariant>} eligible
 * @param {string} blockId
 * @param {string} poolKey
 * @param {string} seed
 * @returns {StateProseVariant|null}
 */
export function drawVariant(eligible, blockId, poolKey, seed) {
  if (!Array.isArray(eligible) || eligible.length === 0) return null;
  if (!seed) return eligible[0];
  const parent = `${seed}::${blockId}::${poolKey}`;
  let best = eligible[0];
  let bestVid = stableVid(best);
  if (bestVid === null) return eligible[avalanche32(fnv1a32(parent)) % eligible.length];
  let bestHash = avalanche32(fnv1a32(`${parent}::v${bestVid}`));
  for (let i = 1; i < eligible.length; i += 1) {
    const variant = eligible[i];
    const vid = stableVid(variant);
    if (vid === null) return eligible[avalanche32(fnv1a32(parent)) % eligible.length];
    const digest = avalanche32(fnv1a32(`${parent}::v${vid}`));
    if (digest > bestHash || (digest === bestHash && vid < bestVid)) {
      best = variant; bestHash = digest; bestVid = vid;
    }
  }
  return best;
}

/**
 * THE KEY DIGEST — the kernel's ONE hash pair, named once so the composer can mint a key
 * without minting a second fold.
 *
 * ⛔ WHY THIS IS AN EXPORT AND NOT A COPY IN THE COMPOSER. ARCH §2.4 rules that every key
 * the composed model mints — the wording face, the connective joint, the salience order —
 * "uses the kernel's one hash pair; no second hash is introduced". The estate enforces the
 * same thing from the other side: `tests/lint/fnv1a32Identity.walker.test.js` holds the
 * tree at TWENTY-TWO `fnv1a32` definitions, SHRINK-ONLY, and a twenty-third reds by name
 * the day it lands. A composer that re-spelled the fold would break both at once, and the
 * hashes are golden-bound — a divergence is same-seed history moving, not a style question.
 *
 * @param {string} key the full key material, already assembled by the caller
 * @returns {number} a 32-bit unsigned digest, avalanche-finalised (law 3)
 */
export function hashKey(key) {
  return avalanche32(fnv1a32(String(key)));
}

/**
 * ⭐ THE SOURCE VOCABULARY — ONE FACE PER POWER (ADDENDUM 18 ruling 15; car 8b-W-18c).
 *
 * The powers of a town that can read a state, each a word a `[face]` row may carry in its
 * second bracket (`- \`[face]\` \`[hall]\` …`). CLOSED: the projector refuses a word outside
 * this list by name, so a writer cannot mint a new power with a typo. The seating is
 * ADDENDUM 18 ruling 13b's, measured on the holder table: the stranger everywhere; the elders
 * below town; the hall, the tavern, the guilds and the register where the catalogue row
 * stands; the muster, the watch, the garrison and the gate where the force bucket or the
 * `hasGates` flag resolves; the market and the court likewise. WHICH of these a given town
 * has is answered OUTSIDE this leaf (`faceSources.js` `sourcesOf`, the only reader of the
 * institution roster on this path) and handed to `drawFace` as a set: this kernel imports
 * nothing and reads no settlement, so it names the words and never the town.
 *
 * ⛔ THE THIRTEENTH WORD IS NOT A POWER. `archiver` (car 8b-W-18i) is in this list because it
 * is a word a `[face]` tag may carry, and for no other reason: it seats nowhere, `sourcesOf`
 * never emits it, and `eligibleFaces` refuses to draw it unless it is marked `observed`
 * (ADDENDUM 18 ruling 27; car 8b-W-18n). See `ARCHIVER_SOURCE` and `OBSERVED_MARK`.
 *
 * ⭐ THE FOURTEENTH WORD IS A POWER OF NOBODY. `public` (ADDENDUM 18 ruling 28, the owner's;
 * car 8b-W-18n) is the town's people as a whole, *"owed to no singular group"*: it is seated by
 * no institution row and by no tier, so it resolves EVERYWHERE, exactly as the stranger does.
 * It is a source in every other respect — it takes a role slot, its roles are drawn from the
 * town's own tier, and it may be half of a pair — and it is the one source NOTHING can capture
 * (`NEVER_COMPROMISABLE`), because nothing backs it.
 * @type {ReadonlyArray<string>}
 */
export const FACE_SOURCES = Object.freeze([
  'stranger', 'elders', 'hall', 'tavern', 'guild', 'register',
  'muster', 'watch', 'garrison', 'gate', 'market', 'court',
  'public', 'archiver',
]);

/** The one source that resolves on EVERY town — a face with no tag is this source's. */
export const UNIVERSAL_SOURCE = 'stranger';

/** The town's people as a whole (ADDENDUM 18 ruling 28). Seated by nothing, so seated everywhere. */
export const PUBLIC_SOURCE = 'public';

/**
 * ⭐ THE SOURCES THAT RESOLVE ON EVERY TOWN, WHATEVER IT HOLDS (ruling 28 edge (f): *"like the
 * stranger it draws on every town"*). `eligibleFaces` admits these without consulting a roster,
 * so a reader that cannot say what a town has still hears them — which is the SAME fail-closed
 * reading the untagged face has always taken, widened by exactly one word.
 * @type {ReadonlyArray<string>}
 */
export const UNIVERSAL_SOURCES = Object.freeze([UNIVERSAL_SOURCE, PUBLIC_SOURCE]);

/**
 * ⭐ THE ARCHIVER — A WORD OF THE FACE VOCABULARY THAT IS NOT A POWER OF THE TOWN (ADDENDUM 18
 * ruling 22, the owner's; car 8b-W-18i).
 *
 * The twelve words above are SOURCES: places where talk is collected, seated by the town's own
 * roster (`faceSources.js` `sourcesOf`, which never emits this thirteenth word). The archiver
 * is the hand the whole dossier is written in, and the archiver's row is not a reading of the
 * state at all: it is ONE SENTENCE THAT CLOSES A PAIR — a conjecture, a plain "a matter of
 * debate", or a reasoned confidence.
 *
 * ⛔ SO IT NEVER DRAWS ALONE — WITH ONE MARKED EXCEPTION. `eligibleFaces` excludes it outright,
 * which means the face draw can never land on it and `facePartner` can never return it; it
 * reaches the page only through `faceWeigh` below, beside the pair it weighs. That is the
 * mechanical form of the ruling's "it opens and never closes": nothing the archiver adds may
 * stand as a town's account. The exception is `OBSERVED_MARK` (ruling 27), under which the
 * archiver is not adding to an account at all but making one of its own.
 */
export const ARCHIVER_SOURCE = 'archiver';

/**
 * ── ⭐⭐ THE ARCHIVER AS WITNESS (ADDENDUM 18 ruling 27, the owner's; car 8b-W-18n) ─────
 *
 * THE OWNER'S WORD, 2026-09-13 ~10:4x: *"an additional alternative to attribution, it can
 * simply be observations … the archiver, themselves being a witness can plainly state"*.
 *
 * A face tagged `[archiver · observed]` is THE ARCHIVER'S OWN OBSERVATION, and it is the one
 * archiver row that DRAWS ALONE. Three mechanical consequences, each of them a refusal
 * somewhere else in this file or in the grammar:
 *
 *   1. IT IS ELIGIBLE ON EVERY TOWN. The archiver is the hand the dossier is written in, so
 *      there is no institution whose absence could silence it — the same argument `faceWeigh`
 *      already takes for the weighing row, applied to a row that stands by itself.
 *   2. IT IS NEVER HALF OF A PAIR. A pair is two POWERS reading one state (ruling 15) and the
 *      archiver is not a power: the grammar refuses a pair mark beside `observed`, and
 *      `facePartner` skips an observed face so a leaf projected by something else cannot make
 *      one a partner either.
 *   3. IT CARRIES NO ROLE SLOT. The archiver is not a source, so it has no roster to draw a
 *      person from: it prints in the archiver's own frame, which the writer writes literally
 *      ("In the survey's time here…", "It is observed that…"). `ROLE_SLOTS` excludes the
 *      archiver by construction and `assertFaces` refuses any other source's slot on it, so
 *      this needs no third rule — it is what the two that exist already say.
 *
 * ⛔ AT MOST ONE PER VARIANT (edge (e): *"so the sources do not vanish behind the witness"*),
 * refused in the grammar where the whole variant is in hand.
 */
export const OBSERVED_MARK = 'observed';

/**
 * ⭐ THE SOURCES NOTHING CAN CAPTURE (ADDENDUM 18 rulings 27 and 28; car 8b-W-18n). The
 * `compromised` tag of ruling 26 is refused on both by name, and for two different reasons:
 *   `archiver`  is not a power of the town and holds no secret of its own (ruling 22).
 *   `public`    *"is still the one voice nothing captures, since nothing backs it"* (ruling 28
 *               edge (a)). A conspiracy captures an institution; there is no institution here.
 * ⛔ THE TWO TABLES ARE HELD DISJOINT BY A PIN, not by care: a word that entered both would let
 * the grammar accept a tag the composer could never honour.
 * @type {ReadonlyArray<string>}
 */
export const NEVER_COMPROMISABLE = Object.freeze([ARCHIVER_SOURCE, PUBLIC_SOURCE]);

/**
 * Is this face the archiver's own observation? Reads the leaf's `observed` list, which the
 * projector emits ONLY where a variant carries one — so every shipped variant answers `false`
 * with no list at all.
 * @param {StateProseVariant|null|undefined} variant
 * @param {number} face
 * @returns {boolean}
 */
export function faceIsObserved(variant, face) {
  const marks = variant ? variant.observed : undefined;
  return Array.isArray(marks) && marks[face] === true;
}

/**
 * ⭐ THE PAIR KINDS (the owner's refinement of ruling 15, 2026-09-13, received at car
 * 8b-W-18c): a pair is not only a disagreement. CLOSED, refused by name at the projector.
 *   `disagree`   two sources read the state against each other
 *   `reinforce`  a second source says the same from its own stake
 *   `aside`      an unrelated notice from another source on the same state
 *   `view`       a second view of the same subject
 * The composer's pair draw is the same for all four — the partner renders when it resolves —
 * and the kind rides on the partner piece as `pairKind`, so a later car can vary the joint
 * by kind without re-cutting the leaf. Not this car.
 * @type {ReadonlyArray<string>}
 */
export const PAIR_KINDS = Object.freeze(['disagree', 'reinforce', 'aside', 'view', 'weigh']);

/**
 * ⭐ THE ARCHIVER'S ATTACHMENT KIND (ADDENDUM 18 ruling 22; car 8b-W-18i). A face marked
 * `weigh` is the archiver's one sentence on a pair that already stands, and it rides on the
 * SAME pair id as the two halves it closes.
 *
 * ⛔ WHY IT IS A FIFTH PAIR KIND AND NOT A SEPARATE `weigh` FIELD ON THE VARIANT — the brief's
 * open choice, decided here and recorded. A separate field would be a FOURTH list the leaf
 * must keep parallel to `[text, ...wordings]`, a fourth thing `assertFaces` must check the
 * length of, and a second grammar in the annex tag. Riding on `pairs` costs nothing: the row
 * is already a face, so the face-count ratchet counts it with no change (a weigh row is a
 * wording like any other, which is what makes 8b-W-18j's ceiling the thing that lets it fit),
 * the tag parses under the existing `SOURCE · pair N · KIND` shape, and the ONE invariant that
 * had to move — "a pair id is carried by exactly two faces" — becomes "exactly two HALVES and
 * at most one WEIGH", which is a single named split inside `assertFaces`.
 */
export const WEIGH_KIND = 'weigh';

/**
 * The pair kinds a weigh may close (ruling 22: "after a `disagree` or `reinforce` pair"). An
 * `aside` is two unrelated facts and a `view` is two takes neither of which denies the other:
 * there is nothing for the archiver to weigh, so the grammar refuses a weigh on either.
 * @type {ReadonlyArray<string>}
 */
export const WEIGHABLE_KINDS = Object.freeze(['disagree', 'reinforce']);

/**
 * The full stop, which is always among a pair's joints and is the only joint an `aside`, a
 * `view` or a two-sentence half can take. The trailing space is part of it: the first half
 * keeps its own terminal stop and the two are set side by side.
 */
export const FULL_STOP_JOINT = '. ';

/**
 * ⭐⭐ THE PAIR'S JOINTS (ADDENDUM 18 ruling 23, the owner's; car 8b-W-18i). A pair whose two
 * faces are ONE SENTENCE EACH may render as ONE COMPOUND SENTENCE, so the second attribution
 * rides inside the sentence rather than starting a new one.
 *
 * ⛔ NEVER A SEMICOLON (the ruling says so outright), and never an em dash, which §0d bans from
 * the corpus anyway. The lists are CLOSED and the full stop is a member of every one of them,
 * which is what the law means by "the joint is chosen at render, seeded, or the full stop, so
 * a page mixes both": on a disagree pair the stop wins one read in five, on a reinforce pair
 * one in three, and the same seed always chooses the same joint.
 *
 * ⛔ A KIND WITH NO COMPOUND FORM READS AS THE FULL STOP ALONE, which is `aside`, `view` and
 * `weigh` — and an unknown kind too, fail-closed: the stop is the arrangement the corpus has
 * always rendered, so an unrecognised kind falls back to what the page already did.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const PAIR_JOINTS = Object.freeze({
  disagree: Object.freeze([', though ', ', but ', ', while ', ', and yet ', FULL_STOP_JOINT]),
  reinforce: Object.freeze([', and ', ', as ', FULL_STOP_JOINT]),
  aside: Object.freeze([FULL_STOP_JOINT]),
  view: Object.freeze([FULL_STOP_JOINT]),
  weigh: Object.freeze([FULL_STOP_JOINT]),
});

/**
 * The source of one face of a variant, or `null` where the face carries none (which is every
 * face of every shipped variant, and the spine of every variant that carries any).
 * @param {StateProseVariant|null|undefined} variant
 * @param {number} face the face index: 0 the spine, 1..n into `wordings`
 * @returns {string|null}
 */
export function faceSourceOf(variant, face) {
  const sources = variant ? variant.sources : undefined;
  if (!Array.isArray(sources)) return null;
  const source = sources[face];
  return typeof source === 'string' && source !== '' ? source : null;
}

/**
 * The pair mark of one face — its id and its kind — or `null` where the face is unpaired or
 * the mark is malformed (a display path: a blank pairing beats a crashed page; the projector
 * is what refuses a malformed mark).
 * @param {StateProseVariant|null|undefined} variant
 * @param {number} face
 * @returns {{id: number, kind: string}|null}
 */
export function facePairOf(variant, face) {
  const pairs = variant ? variant.pairs : undefined;
  if (!Array.isArray(pairs)) return null;
  const pair = pairs[face];
  if (!pair || typeof pair !== 'object') return null;
  const id = /** @type {{id?: unknown}} */ (pair).id;
  const kind = /** @type {{kind?: unknown}} */ (pair).kind;
  if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) return null;
  if (typeof kind !== 'string' || !PAIR_KINDS.includes(kind)) return null;
  return { id, kind };
}

/**
 * ⭐ THE ELIGIBLE FACES OF A VARIANT ON THIS TOWN (ruling 15's "among the faces whose source
 * exists on that town"). A face is eligible when it carries no source, when its source is
 * the universal one, or when its source is in the town's roster.
 *
 * ⛔ NO ROSTER READS AS THE EMPTY ROSTER, NEVER AS "EVERYTHING". A caller that hands no set —
 * a walker, a census, a print path with no settlement in hand — hears the stranger and the
 * untagged faces only. That is floor 1 fail-closed: a face attributed to the hall may not be
 * drawn by a reader that cannot say whether a hall stands. (Kernel law 2's own shape, applied
 * to a power instead of an audience.)
 *
 * ⛔ AND NONE ELIGIBLE FALLS BACK TO THE FULL SET, so a rung never goes silent for want of a
 * source: the fallback is the spine and every face, which is exactly what the reader heard
 * before any face carried a source at all. The projector keeps this line unreachable on a
 * lawful corpus (a variant's spine carries no source, so index 0 is always eligible); it is
 * here for a leaf that was not projected by it.
 *
 * ⛔ ALL ELIGIBLE IS THE IDENTITY. When every face is eligible the list is `[0..n-1]`, so
 * `eligible[hash % n]` is `hash % n` — the shipped draw, byte for byte. That is the whole
 * zero-shift argument for a corpus with no sourced face, and the kernel's test drives it
 * rather than reading it here.
 * @param {StateProseVariant|null|undefined} variant
 * @param {ReadonlySet<string>|ReadonlyArray<string>|null|undefined} sources the town's roster
 * @returns {number[]} face indices, ascending
 */
export function eligibleFaces(variant, sources) {
  const wordings = variant ? variant.wordings : undefined;
  const faces = 1 + (Array.isArray(wordings) ? wordings.length : 0);
  /** @type {number[]} */
  const all = [];
  for (let face = 0; face < faces; face += 1) all.push(face);
  if (!variant || !Array.isArray(variant.sources)) return all;
  const roster = sources instanceof Set ? sources : new Set(Array.isArray(sources) ? sources : []);
  /** @type {number[]} */
  const eligible = [];
  for (const face of all) {
    const source = faceSourceOf(variant, face);
    // ⭐ THE ARCHIVER NEVER DRAWS ALONE (ADDENDUM 18 ruling 22; car 8b-W-18i). A weigh row is
    // not a reading of the state — it is the archiver closing a pair — so it is never a
    // candidate for the draw and never a partner. `faceWeigh` is the only door it has, and it
    // opens only where the pair it weighs has already been drawn whole.
    // ⭐⭐ UNLESS IT IS THE ARCHIVER'S OWN OBSERVATION (ruling 27; car 8b-W-18n), which is not
    // an addition to an account but an account of its own, and which is eligible on EVERY town
    // because no institution's absence could silence the hand that writes the page.
    if (source === ARCHIVER_SOURCE) {
      if (faceIsObserved(variant, face)) eligible.push(face);
      continue;
    }
    if (source === null || UNIVERSAL_SOURCES.includes(source) || roster.has(source)) eligible.push(face);
  }
  return eligible.length === 0 ? all : eligible;
}

/**
 * THE WORDING FACE (ARCH §2.6, car 3a; the SOURCE FILTER added at car 8b-W-18c). A variant
 * carries one authored sentence today and, after the rewrite wave, one FACE PER POWER sharing
 * its slots (a subset) and marks — never a claim set (ADDENDUM 18 ruling 2). This picks the
 * face — among the faces whose source exists on this town (ruling 15).
 *
 * ── THE FOUR THINGS THIS FUNCTION IS ─────────────────────────────────────────────────
 *
 * 1. A NO-HASH SHORT-CIRCUIT ON TODAY'S CORPUS. Every one of the 2,266 shipped variants has
 *    exactly one face, so ONE face is eligible and the function returns before touching
 *    either half of the hash pair. That is not an optimisation: it is what makes the seam
 *    provably byte-identical on the corpus that ships, and it is asserted by COUNTING the
 *    hash pair's own multiplications rather than by reading this paragraph. The same
 *    short-circuit covers a town on which only one face resolves.
 *
 * 2. A SUFFIX OF THE VARIANT KEY, NEVER A NEW ONE. The key is
 *    `${seed}::${blockId}::${poolKey}::w` — key 1 of ARCH §2.4 with `::w` appended — so the
 *    parent string never changes and appending faces cannot re-roll the variant draw. The
 *    suffix is spelled `::w` and nothing else: the migration script that first measured this
 *    spelled it `::wording`, and a key that disagrees with the shipped one measures a
 *    different world (P-F10).
 *
 * 3. THE MODULUS IS THE ELIGIBLE COUNT, NOT THE FACE COUNT (car 8b-W-18c). The digest is
 *    taken modulo the number of faces THIS TOWN can hear, and indexes the ascending eligible
 *    list, so neighbouring towns with different rosters hear different halls on the same
 *    seed — ruling 15's "organic variance" — and a town whose roster admits every face draws
 *    exactly as the shipped modulus did (`eligibleFaces` above, the identity case). This is
 *    a DECLARED TEXT SHIFT on the register's `face-draw-key` row: on a corpus that carries
 *    a sourced face, the same seed and the same eligible SET can yield a different face than
 *    the unfiltered modulus would. The corpus that ships carries none, and moves nothing.
 *
 * 4. CANONICAL-AT-ZERO, like every other draw here (law 4). A seedless read — the gallery
 *    import nulls `_seed` — takes the FIRST ELIGIBLE face, which is face 0, the authored
 *    text, on every lawful variant (a spine row carries no source).
 *
 * @param {StateProseVariant|null|undefined} variant
 * @param {string} blockId
 * @param {string} poolKey
 * @param {string} seed
 * @param {ReadonlySet<string>|ReadonlyArray<string>|null} [sources] the town's roster
 *   (`faceSources.js` `sourcesOf`); absent reads as the empty roster (see `eligibleFaces`)
 * @returns {number} the face index: 0 for the authored text, 1..n into `wordings`
 */
export function drawFace(variant, blockId, poolKey, seed, sources = null) {
  const eligible = eligibleFaces(variant, sources);
  if (eligible.length === 1) return eligible[0];
  if (!seed) return eligible[0];
  return eligible[hashKey(`${seed}::${blockId}::${poolKey}::w`) % eligible.length];
}

/**
 * THE PARTNER OF A DRAWN FACE (ruling 15's PAIR draw; car 8b-W-18c). Where the drawn face
 * carries a pair id, the OTHER eligible face of the same variant carrying the same id — the
 * source that reads the state differently — is returned so the composer renders both. `null`
 * when the face is unpaired, when its partner does not resolve on this town (then the drawn
 * face renders alone), or when the variant is malformed. The lowest such index, so a
 * projector that let three faces share an id would still draw deterministically; the
 * projector refuses that shape upstream.
 * @param {StateProseVariant|null|undefined} variant
 * @param {number} face the drawn face
 * @param {ReadonlySet<string>|ReadonlyArray<string>|null} [sources]
 * @returns {number|null}
 */
export function facePartner(variant, face, sources = null) {
  const pair = facePairOf(variant, face);
  if (pair === null) return null;
  // ⛔ A WEIGH ROW HAS NO PARTNER, it has a pair it closes (car 8b-W-18i). The line is
  // unreachable through `drawFace`, which cannot land on an archiver face at all, and it
  // stands so that a caller holding a face index of its own cannot turn the archiver into
  // half of a pair by asking the wrong question.
  if (pair.kind === WEIGH_KIND) return null;
  // ⛔ AND AN OBSERVED FACE IS NEVER HALF OF A PAIR (ruling 27; car 8b-W-18n). The grammar
  // refuses a pair mark beside `observed` at the annex row and again from the leaf's side, so
  // this line is unreachable on a lawful corpus; it stands for the same reason the weigh guard
  // above it does — a leaf projected by something else must not be able to pair the archiver.
  if (faceIsObserved(variant, face)) return null;
  for (const other of eligibleFaces(variant, sources)) {
    if (other === face || faceIsObserved(variant, other)) continue;
    const mark = facePairOf(variant, other);
    if (mark !== null && mark.id === pair.id && mark.kind !== WEIGH_KIND) return other;
  }
  return null;
}

/**
 * ⭐ THE ARCHIVER'S WEIGHING ROW FOR THIS PAIR (ADDENDUM 18 ruling 22; car 8b-W-18i), or `null`
 * where the pair carries none, where the face is unpaired, or where the pair's kind cannot be
 * weighed (`aside` and `view` — the grammar refuses those upstream, and this reads the same
 * refusal from the leaf's own side so a leaf projected by something else cannot smuggle one
 * onto the page).
 *
 * ⛔ IT TAKES NO ROSTER. The archiver is not a power of the town (`ARCHIVER_SOURCE`), so there
 * is no institution whose absence could silence the row: wherever the pair renders whole, the
 * hand that wrote the page may close it. The row is nonetheless gated on the PAIR, so a town
 * that hears only one of the two halves hears no weighing either — which is the ruling's
 * "after a disagree or reinforce pair", read strictly.
 * @param {StateProseVariant|null|undefined} variant
 * @param {number} face either half of the pair
 * @returns {number|null} the weigh row's face index
 */
export function faceWeigh(variant, face) {
  const pair = facePairOf(variant, face);
  if (pair === null || pair.kind === WEIGH_KIND) return null;
  if (!WEIGHABLE_KINDS.includes(pair.kind)) return null;
  const wordings = variant ? variant.wordings : undefined;
  const faces = 1 + (Array.isArray(wordings) ? wordings.length : 0);
  for (let other = 0; other < faces; other += 1) {
    if (other === face) continue;
    const mark = facePairOf(variant, other);
    if (mark === null || mark.id !== pair.id || mark.kind !== WEIGH_KIND) continue;
    if (faceSourceOf(variant, other) !== ARCHIVER_SOURCE) continue;
    return other;
  }
  return null;
}

/**
 * HOW MANY SENTENCES THIS FACE STATES — the test ruling 23 gates the compound joint on.
 *
 * ⛔ AN ELLIPSIS DOES NOT END A SENTENCE, and that is the whole reason this counter exists
 * beside the composer's own. The notebook's devices include the ellipsis (§7 of the law), so a
 * DM face may carry `…` or `...` mid-thought; counting its dots as stops would read a
 * one-sentence face as two or four and silently refuse it the joint it is entitled to. Both
 * spellings are struck before the stops are counted.
 *
 * ⛔ AND THE BANG IS NOT READ, because §0d bans it from the corpus outright: a face carrying
 * one is refused at `tests/copy/voiceMechanics.test.js` long before it reaches here.
 * @param {string} text
 * @returns {number}
 */
export function faceSentenceCount(text) {
  const body = String(text).replace(/…/g, ' ').replace(/\.\.\./g, ' ');
  const stops = body.match(/[.?](?:\s|$)/g);
  return stops ? stops.length : 1;
}

/**
 * Can this face take a COMPOUND joint? Exactly one sentence, and that sentence closes on a
 * full stop — a question is left to stand on its own, because ", though" after a question mark
 * is not a sentence in any hand.
 * @param {string} text
 * @returns {boolean}
 */
export function faceIsCompoundable(text) {
  return faceSentenceCount(text) === 1 && /\.\s*$/.test(String(text));
}

/**
 * ⭐⭐ THE JOINT OF ONE PAIR (ADDENDUM 18 ruling 23; car 8b-W-18i) — drawn, seeded, from the
 * kind's own closed list.
 *
 * ⛔ A KEY OF ITS OWN, ON NEW MATERIAL (ARCH §2.4). The key is `${seed}::${blockId}::${poolKey}
 * ::pairjoint` — a NEW suffix, not a variant of `::w` and not the modifier joint's
 * `::joint::${modifierKey}` — so the variant draw, the face draw and the connective draw are
 * all untouched by a joint arriving, and a pair that was rendering on the full stop before
 * this car can only move to a compound form, never to a different face.
 *
 * ⛔ SEEDLESS IS CANONICAL-AT-ZERO (kernel law 4), and index 0 of every list is the kind's
 * FIRST COMPOUND JOINT rather than the stop — a walker or a print path with no telling to key
 * on reads the compound form, which is the form the ruling is about. The full stop sits LAST
 * in each list so that appending a joint to a kind never moves the stop's own index.
 * @param {string} kind a word of `PAIR_KINDS`
 * @param {string} blockId
 * @param {string} poolKey
 * @param {string} seed
 * @returns {string} one joint, including its trailing space
 */
export function pairJoint(kind, blockId, poolKey, seed) {
  const joints = PAIR_JOINTS[kind];
  if (!Array.isArray(joints) || joints.length === 0) return FULL_STOP_JOINT;
  if (joints.length === 1 || !seed) return joints[0];
  return joints[hashKey(`${seed}::${blockId}::${poolKey}::pairjoint`) % joints.length];
}

/**
 * ⭐ THE SECOND HALF'S OPENING CHARACTER, lowercased where ruling 23 allows it: "only when it
 * is a common word (never a `{slot}`, never a capitalised name)".
 *
 * THREE BRANCHES, EACH MECHANICAL AND EACH DRIVEN BY A TEST:
 *   1. THE SLOT. The RAW face — the text before the fills — opening on `{` means the first
 *      word on the page is a fill, and a fill's case is the fill's own business. Left alone.
 *      (`assertFaces` already refuses a sentence face that opens on a `proper`-typed slot, so
 *      this branch is a second wall on the same hazard rather than the only one.)
 *   2. THE NAME. A first word carrying an INTERIOR capital is a name or an initialism
 *      ("McGrath", "Gate Duty"), never a common word. Left alone.
 *   3. THE COMMON WORD. Everything else is lowercased at its first character and nowhere else.
 *
 * ⛔ WHAT THIS CANNOT SEE, SAID PLAINLY RATHER THAN LEFT AS A SILENCE: a LITERAL proper noun
 * with no interior capital, typed into the head of a face by a writer, would be lowercased.
 * The law closes that from the other side — floor 3 refuses a named singular office as a
 * person and the scope rule refuses a named world — so a face may not carry one at all. A
 * mechanical name test does not exist in a setting-agnostic engine; this is the honest edge.
 * @param {string} raw the face's text BEFORE its fills
 * @param {string} text the face's text AFTER its fills
 * @returns {string}
 */
export function openLowercased(raw, text) {
  if (/^\s*\{/.test(String(raw))) return text;
  const at = String(text).search(/\S/);
  if (at < 0) return text;
  const first = String(text).slice(at).split(/\s+/)[0] || '';
  if (!/^[A-Z]/.test(first)) return text;
  if (/[A-Z]/.test(first.slice(1))) return text;
  return text.slice(0, at) + text[at].toLowerCase() + text.slice(at + 1);
}

/**
 * ⭐⭐ THE PAIR, RENDERED (ADDENDUM 18 ruling 23; car 8b-W-18i). Two faces in FACE ORDER, joined
 * either as one compound sentence or by the full stop.
 *
 * ⛔ THE FULL STOP IS THE OLD ARRANGEMENT, BYTE FOR BYTE. `${lead} ${trail}` is exactly what
 * car 8b-W-18c rendered, so every pair that draws the stop, and every pair either of whose
 * halves states two sentences, composes as it did before this car existed. That is the
 * zero-shift argument and the reason the stop is a member of every joint list rather than an
 * absence of one.
 * @param {string} lead the lower-indexed face's filled text
 * @param {string} trail the higher-indexed face's filled text
 * @param {string} trailRaw the higher-indexed face's text BEFORE its fills
 * @param {string} joint one joint of `PAIR_JOINTS`
 * @returns {string}
 */
export function joinPairFaces(lead, trail, trailRaw, joint) {
  if (joint === FULL_STOP_JOINT || !faceIsCompoundable(lead) || !faceIsCompoundable(trail)) {
    return `${lead} ${trail}`;
  }
  return `${String(lead).replace(/\.\s*$/, '')}${joint}${openLowercased(trailRaw, trail)}`;
}

/**
 * THE READER. One pool of the corpus, one sentence — or nothing at all.
 *
 * @param {StateProseCorpus} corpus a desk leaf
 * @param {string} blockId e.g. 'DS-ECO-8'
 * @param {string} poolKey e.g. 'SUBSISTENCE' (or SOLE_POOL for an unlabelled block)
 * @param {{slots?: Record<string, unknown>, seed?: string, audience?: string,
 *   dimensions?: Record<string, string>}} [options] `dimensions` answers every dimension
 *   the pool partitions itself by (law 5); an unanswered one reads as `null`
 * @returns {{blockId: string, poolKey: string, angle: string, text: string}|null}
 */
export function readStateProse(corpus, blockId, poolKey, options = {}) {
  const block = corpus ? corpus[blockId] : undefined;
  const pool = block?.pools?.[poolKey];
  const eligible = eligibleVariants(pool, options);
  const variant = drawVariant(eligible, blockId, poolKey, options.seed || '');
  if (!variant) return null;
  const text = fillSlots(variant.text, options.slots || {});
  if (text === null) return null;
  return Object.freeze({
    blockId, poolKey, angle: variant.angle || '', text,
  });
}

/**
 * The same read, returning the sentence alone. Convenience for a composer that has
 * nowhere to put the provenance.
 * @param {StateProseCorpus} corpus
 * @param {string} blockId
 * @param {string} poolKey
 * @param {{slots?: Record<string, unknown>, seed?: string, audience?: string,
 *   dimensions?: Record<string, string>}} [options]
 * @returns {string|null}
 */
export function stateProseSentence(corpus, blockId, poolKey, options = {}) {
  return readStateProse(corpus, blockId, poolKey, options)?.text ?? null;
}

/**
 * Does this block carry a pool for this state at all? Lets a resolver ask before it
 * assembles an expensive slot bag, and lets the coverage walker measure the corpus
 * against the census denominator without rendering anything.
 * @param {StateProseCorpus} corpus
 * @param {string} blockId
 * @param {string} poolKey
 * @returns {boolean}
 */
export function hasStateProsePool(corpus, blockId, poolKey) {
  const pool = corpus?.[blockId]?.pools?.[poolKey];
  return Array.isArray(pool) && pool.length > 0;
}

/**
 * ── ⭐⭐ ATTRIBUTION BY ROLE (ADDENDUM 18 ruling 25, the owner's; car 8b-W-18l) ────────
 *
 * THE SOURCE TAG IS THE MACHINE'S WORD AND THE READER NEVER SEES IT. What the page prints for
 * a source is a ROLE — 'a clerk in the hall', 'dock workers', 'a local priest' — drawn at
 * render, seeded, out of the town's OWN institution rows. The writer therefore writes a typed
 * slot and a number-aware verb:
 *
 *     `[face]` `[hall]` {hall} {v:put} the walls' keeping under the military purse.
 *   → "A clerk in the hall puts the walls' keeping under the military purse."
 *   → "The clerks who keep the hall put the walls' keeping under the military purse."
 *
 * ⛔ WHY THIS LIVES IN THE KERNEL AND TAKES ITS TABLE AS AN ARGUMENT. The kernel imports
 * NOTHING (its fence is asserted by name in composeStateProseFence.test.js) and the composer
 * may import only the kernel. The roles are a fact about the TOWN, so `faceSources.js` builds
 * them once per desk entry (`withFaceSources` → `read.roles`) and this function is handed the
 * finished map. No module gains an import; the fence holds on both sides.
 *
 * ⛔ AND IT FAILS CLOSED. A role slot with no role behind it, or a verb slot with no role
 * before it in its sentence, returns `null` — the same silence `fillSlots` returns for an
 * unfilled slot, and for the same reason: a rendered `{hall}` is worse than no sentence.
 */

/**
 * The SOURCE SLOTS a face may name: the kernel's own vocabulary minus the archiver, whose
 * attributions are its own and never a role (ruling 25 edge (c)).
 * @type {ReadonlyArray<string>}
 */
export const ROLE_SLOTS = Object.freeze(FACE_SOURCES.filter((word) => word !== ARCHIVER_SOURCE));

/**
 * One pass over both slot kinds, IN SOURCE ORDER, because a verb reads the number of the role
 * that precedes it and a second regex would lose the interleaving.
 */
const ROLE_OR_VERB_RE = new RegExp(`\\{(?:(${ROLE_SLOTS.join('|')})|v:([a-z]+))\\}`, 'g');

/**
 * The verbs whose third-person singular is not the `+s` rule. Kept SHORT on purpose: the
 * dossier's attribution verbs are plain by law (§6, "never a period word in the attribution
 * verb"), so the list is the copula, the two auxiliaries and the `-o` verbs the writers use.
 * An ARRAY of entries, not a map: this is `src/domain/**`, where the wiring census reads an
 * object-literal key as a WRITE of world state.
 * @type {ReadonlyArray<{base: string, sg: string, pl: string}>}
 */
export const ROLE_VERB_IRREGULARS = Object.freeze([
  Object.freeze({ base: 'be', sg: 'is', pl: 'are' }),
  Object.freeze({ base: 'is', sg: 'is', pl: 'are' }),
  Object.freeze({ base: 'are', sg: 'is', pl: 'are' }),
  Object.freeze({ base: 'have', sg: 'has', pl: 'have' }),
  Object.freeze({ base: 'has', sg: 'has', pl: 'have' }),
  Object.freeze({ base: 'do', sg: 'does', pl: 'do' }),
  Object.freeze({ base: 'does', sg: 'does', pl: 'do' }),
]);

/** `-es` after a sibilant or an `-o`; `-ies` after a consonant + `y`; `-s` otherwise. */
const SIBILANT_END = /(?:s|sh|ch|x|z|o)$/;
const CONSONANT_Y_END = /[^aeiou]y$/;

/**
 * ⭐ THE VERB, AGREED TO A NUMBER. `say` + `sg` → `says`; `say` + `pl` → `say`; `hold` + `sg`
 * → `holds`; `deny` + `sg` → `denies`; `go` + `sg` → `goes`; `have` + `pl` → `have`.
 * @param {string} base the bare verb the writer named inside `{v:…}`
 * @param {'sg'|'pl'} number the number of the role that precedes it
 * @returns {string}
 */
export function agreeVerb(base, number) {
  const word = String(base || '').toLowerCase();
  if (word === '') return '';
  const irregular = ROLE_VERB_IRREGULARS.find((row) => row.base === word);
  if (irregular) return number === 'pl' ? irregular.pl : irregular.sg;
  if (number === 'pl') return word;
  if (CONSONANT_Y_END.test(word)) return `${word.slice(0, -1)}ies`;
  if (SIBILANT_END.test(word)) return `${word}es`;
  return `${word}s`;
}

/** Is this offset a SENTENCE HEAD — the start of the face, or just past a stop? */
function atSentenceHead(text, at) {
  const before = text.slice(0, at).replace(/\s+$/, '');
  return before === '' || /[.?!]$/.test(before);
}

/**
 * The offset the CURRENT sentence starts at, so "the same sentence" is exact rather than
 * approximate. ⛔ Walked with a regex rather than three `lastIndexOf` calls on `'. '`, `'? '`
 * and `'! '`: the E2 string-literal ratchet counts an exclamation mark inside a STRING as copy
 * debt (`tests/copy/voiceMechanics.test.js`), and a punctuation table is not prose. Found by
 * running that ratchet, not by remembering it.
 */
const STOP_THEN_SPACE = /[.?!]\s/g;
function sentenceStartBefore(text, at) {
  const before = String(text).slice(0, at);
  STOP_THEN_SPACE.lastIndex = 0;
  let start = 0;
  for (let m = STOP_THEN_SPACE.exec(before); m !== null; m = STOP_THEN_SPACE.exec(before)) {
    start = m.index + m[0].length;
  }
  return start;
}

/** First letter up, the rest untouched — 'a clerk in the hall' → 'A clerk in the hall'. */
function capitaliseRole(phrase) {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

/**
 * ⭐ THE SEEDED ROLE DRAW, with the page's own exclusion (ruling 25 edge (e): *"variety is the
 * point … the same role never twice on one page"*).
 *
 * The candidate list is the source's roles MINUS everything this render has already printed;
 * when the exclusion empties the list the FULL list comes back, so an exhausted roster repeats
 * rather than silencing the face. The key carries the face index and the slot's position, so a
 * face naming two different sources draws two different roles on one seed.
 *
 * @param {ReadonlyArray<{role: string, n: string}>} roles the source's roster on this town
 * @param {ReadonlySet<string>|null|undefined} printed roles this render has already printed
 * @param {string} key the seeded draw key
 * @returns {{role: string, n: string}|null} `null` only when the source has no roles at all
 */
export function drawRole(roles, printed, key) {
  if (!Array.isArray(roles) || roles.length === 0) return null;
  const unseen = printed instanceof Set ? roles.filter((row) => !printed.has(row.role)) : roles;
  const pool = unseen.length > 0 ? unseen : roles;
  if (pool.length === 1) return pool[0];
  return pool[hashKey(key) % pool.length];
}

/**
 * ⭐⭐ FILL THE ROLE AND VERB SLOTS OF ONE FACE.
 *
 * Returns the text with every `{<source>}` replaced by a drawn role and every `{v:<verb>}`
 * agreed to the number of the role that precedes it IN THE SAME SENTENCE, or `null` when the
 * face cannot be spoken: no roles for a named source, or a verb slot with no role before it.
 * A text naming neither slot comes back unchanged, which is why every shipped one-face pool
 * passes through untouched and this car moves no byte of the corpus it did not re-cut.
 *
 * ⛔⛔ AND IT NO LONGER MUTATES THE PAGE'S SET (ADDENDUM 18, the research reconciliation's
 * slice E; car 8b-W-18o-r). It used to add each drawn role to `printed` AS IT DREW, which made
 * a role COMMIT before its piece had landed — and a piece is dropped whenever `fillSlots`
 * answers `null` on some other slot of the same face. A dropped piece was therefore CONSUMING a
 * role from the page's roster: the next face, on another desk of the same page, drew a
 * different person because of a sentence the reader never saw. The roles a call draws are now
 * reported through `opts.claimed` and the CALLER commits them when its piece lands.
 *
 * ⛔ THE EXCLUSION STILL COVERS THE FACE'S OWN SLOTS. A face naming two sources must not draw
 * one person twice, so the candidate filter is `printed` UNION what this call has claimed so
 * far — which is what the old mutation gave for free and is the one thing that had to be kept.
 *
 * @param {string} text the face's raw text
 * @param {object} opts
 * @param {ReadonlyMap<string, ReadonlyArray<{role: string, n: string}>>|null} [opts.roles]
 *   source → the roster that source has on THIS town (`faceSources.js` `rolesOf`)
 * @param {ReadonlySet<string>|null} [opts.printed] the roles this PAGE has already printed;
 *   READ ONLY — see above
 * @param {string[]|null} [opts.claimed] appended with each role this call draws, so the caller
 *   can commit them to `printed` when the piece lands; absent is lawful and the roles are lost,
 *   which is the right answer for a caller with no page (a walker, a census)
 * @param {string} [opts.key] the seeded draw key prefix (seed :: blockId :: poolKey :: face)
 * @returns {string|null}
 */
export function fillRoleSlots(text, opts) {
  if (typeof text !== 'string' || text === '') return null;
  ROLE_OR_VERB_RE.lastIndex = 0;
  if (!ROLE_OR_VERB_RE.test(text)) return text;
  const roles = opts && opts.roles instanceof Map ? opts.roles : new Map();
  const printed = opts && opts.printed instanceof Set ? opts.printed : new Set();
  const claimed = opts && Array.isArray(opts.claimed) ? opts.claimed : [];
  const key = opts && typeof opts.key === 'string' ? opts.key : '';
  /** The number of the last role slot filled, and where it sat. */
  let lastNumber = '';
  let lastAt = -1;
  let refused = false;
  ROLE_OR_VERB_RE.lastIndex = 0;
  const out = text.replace(ROLE_OR_VERB_RE, (whole, source, verb, at) => {
    if (refused) return whole;
    if (source) {
      // THE CANDIDATE FILTER IS THE PAGE'S SET UNION THIS CALL'S OWN CLAIMS — see the docblock.
      const seen = claimed.length === 0 ? printed : new Set([...printed, ...claimed]);
      const drawn = drawRole(roles.get(source), seen, `${key}::${source}::${at}`);
      if (drawn === null) { refused = true; return whole; }
      claimed.push(drawn.role);
      lastNumber = drawn.n === 'pl' ? 'pl' : 'sg';
      lastAt = at;
      return atSentenceHead(text, at) ? capitaliseRole(drawn.role) : drawn.role;
    }
    // ⛔ THE VERB READS THE ROLE OF ITS OWN SENTENCE. A `{v:…}` whose nearest role slot sits
    // behind a full stop has no subject to agree with, and guessing one is exactly the class
    // of defect the slot-shape register exists to end. The projector refuses this shape at
    // `assertFaces`; this is the second gate, on the other side of the leaf.
    if (lastAt < sentenceStartBefore(text, at)) { refused = true; return whole; }
    return agreeVerb(verb, lastNumber === 'pl' ? 'pl' : 'sg');
  });
  return refused ? null : out;
}

/**
 * ── ⭐⭐ THE COMPROMISED ROLE (ADDENDUM 18 ruling 26, the owner's; car 8b-W-18m) ────────
 *
 * THE OWNER'S WORD, 2026-09-13 ~09:4x: *"a special rule if one of the roles is compromised,
 * that specific role will be the one or one of the two accounts and they would dismiss anything
 * out of the ordinary or say everything is all right. this would be them being active."*
 *
 * Where the engine holds a COVERT FACT that compromises a source — a captured hall, a watch or
 * court under a covert criminal bloc — the draw on that town FORCES that source into the unit
 * and prefers its `compromised` candidate: the source dismisses what is out of the ordinary or
 * says that all is well. The player page never states the compromise; it shows the compromised
 * power BEHAVING, and the notebook beside it carries the fact.
 *
 * ⛔⛔ AND A YEAR-SEEDED ROLL DECIDES **WHO SPEAKS, NEVER WHAT IS TRUE** (ruling 26 edge (j)).
 * This is the FIRST time-varying draw in the dossier and the principle is written beside it so
 * no later hand rolls a FACT on the year. The roll chooses between two lawful pages — one where
 * the compromised source speaks and one where it is silent — and its silence is a behaviour
 * too. Nothing it decides could make a false sentence true, and nothing downstream of it may
 * ever be a field, a number or a state. THE PROMISE holds: the same seed and the same year
 * always give the same page.
 */

/** The face tag that marks a source's concealing candidate. */
export const COMPROMISED_MARK = 'compromised';

/**
 * ⭐ THE CLOSED TABLE OF WHAT CAN BE COMPROMISED (ruling 26 edge (c) and the grammar's refusal).
 * A `[<source> · compromised]` tag is refused on any source NO covert field of the engine can
 * compromise, so a writer cannot invent a conspiracy the simulation does not hold:
 *   hall   a captured council — `powerStructure.criminalCaptureState` at `corrupted` or `capture`
 *   watch  enforcement under a covert criminal bloc
 *   court  the law under the same covert bloc
 * ⛔ THE REGISTER IS NOT HERE, and the omission is the finding rather than an oversight: ruling
 * 26 names "a register under a cult's hand", and the engine records a creed's settlement
 * standing (`cult` / `established` / `ascendant`) with NO covert flag anywhere beside it. A
 * standing is public. Until a field records that a creed's hand on the register is HIDDEN,
 * admitting `register` here would let a writer tag a conspiracy the engine never held.
 * Reported OPEN.
 *
 * ⛔ AND IT IS DISJOINT FROM `NEVER_COMPROMISABLE` BY PIN (car 8b-W-18n). The archiver holds no
 * secret of its own and the public is backed by nothing, so neither can be captured; a word in
 * both tables would be a tag the grammar accepts and the composer can never honour.
 * @type {ReadonlyArray<string>}
 */
export const COMPROMISABLE_SOURCES = Object.freeze(['hall', 'watch', 'court']);

/**
 * ⭐⭐ `COMPROMISED_SPEAKS` — THE RATE, THE CHAIR'S NUMBER AT THE OWNER'S WORD, VETOABLE.
 *
 * The owner: *"make it so that they only do the face 60% of the time if a compromised shows up
 * … the other 40% they just say nothing"*, then *"you pick the right percentage number then"*.
 *
 * THE CHAIR'S REASONING, written here because a constant with no argument beside it is a
 * constant nobody can veto. The concealment should read as the compromised power's STANDING
 * POSTURE and the silence as the exception a game master NOTICES. Over a three-year run:
 *
 *   rate   falls silent at least once   never speaks at all
 *   0.6            78 %                       6.4 %
 *   0.7            66 %                       2.7 %
 *   0.8            49 %                       0.8 %
 *
 * At 0.6 silence is the more common story and the reassurance is too intermittent to read as a
 * posture. At 0.8 half of all three-year runs never show the silence at all, so the behaviour
 * the owner asked for is invisible to most tables. 0.7 keeps the concealment the norm (seven
 * runs in ten speak every year of the three) while still showing the silence to two thirds of
 * three-year runs. The owner's to tune: change this line and nothing else.
 * @type {number}
 */
export const COMPROMISED_SPEAKS = 0.7;

/**
 * ⭐ THE SPEAKS-OR-SILENT ROLL, seeded on (world seed, pool key, settlement, CURRENT YEAR).
 *
 * Re-rolled at generation and at every advance of time, and never drifting on a re-read of the
 * same year — which is what makes the silence a behaviour rather than a flicker. The year is
 * the LAST component on purpose: two adjacent years of one town are two unrelated draws rather
 * than two neighbouring ones, because `hashKey` avalanches the whole string.
 *
 * ⛔ IT DECIDES WHO SPEAKS AND NEVER WHAT IS TRUE. See the section head.
 * @param {string} seed the world seed
 * @param {string} poolKey
 * @param {string} settlementId
 * @param {string|number} year the current year the render sees
 * @param {number} [rate] the speak share; `COMPROMISED_SPEAKS` unless a caller is measuring
 * @returns {boolean} true when the compromised source speaks this year
 */
export function compromisedSpeaks(seed, poolKey, settlementId, year, rate = COMPROMISED_SPEAKS) {
  const key = `${seed}::${poolKey}::${settlementId}::${year}::compromised`;
  // The hash is a uint32; the share is its position in that range, so the rate is exact to
  // one part in 2^32 rather than to the eight buckets a modulus would give.
  return hashKey(key) / 4294967296 < rate;
}

/**
 * The index of a variant's `compromised` face for one source, or `null`. A variant carries at
 * most ONE per source (the grammar refuses a second), so the first match is the only match.
 * @param {StateProseVariant|null|undefined} variant
 * @param {string} source
 * @returns {number|null}
 */
export function compromisedFaceOf(variant, source) {
  const marks = variant ? variant.compromised : undefined;
  if (!Array.isArray(marks)) return null;
  for (let face = 0; face < marks.length; face += 1) {
    if (marks[face] === true && faceSourceOf(variant, face) === source) return face;
  }
  return null;
}

/**
 * ⭐⭐ THE COMPROMISED DRAW (ruling 26 edges (h) and (i)).
 *
 * On a pool whose SYMPTOM the covert field marks, and only there:
 *   · the roll says SPEAK → the compromised source is FORCED into the unit, and its
 *     `compromised` candidate is preferred over its ordinary face;
 *   · the roll says SILENT → that source is dropped from the unit's draw entirely, and the
 *     other sources speak. Its silence is the behaviour.
 * On every other pool the compromised source draws as any source: this function is not called.
 *
 * ⛔ THE FORCING NEVER EMPTIES THE DRAW. If excluding the silent source would leave nothing
 * eligible, the eligible list comes back untouched — a silence that blanked the rung would be
 * the covert fact deciding whether the town has a defense section, which is exactly the kind
 * of leak ruling 26 (a) forbids.
 *
 * @param {StateProseVariant|null|undefined} variant
 * @param {ReadonlyArray<number>} eligible the faces this town could draw
 * @param {string} source the compromised source on this town
 * @param {boolean} speaks the roll
 * @returns {{eligible: number[], forced: number|null}}
 */
export function compromisedDraw(variant, eligible, source, speaks) {
  const all = Array.isArray(eligible) ? [...eligible] : [];
  if (!variant || typeof source !== 'string' || source === '') return { eligible: all, forced: null };
  if (speaks) {
    const marked = compromisedFaceOf(variant, source);
    if (marked !== null && all.includes(marked)) return { eligible: all, forced: marked };
    const ordinary = all.filter((face) => faceSourceOf(variant, face) === source);
    return { eligible: all, forced: ordinary.length > 0 ? ordinary[0] : null };
  }
  const without = all.filter((face) => faceSourceOf(variant, face) !== source);
  return { eligible: without.length > 0 ? without : all, forced: null };
}

/**
 * ── ⭐⭐ THE OPENER AND THE CLOSE (ADDENDUM 18 rulings 29, 34 and 40; car 8b-W-18o) ─────
 *
 * THE OWNER, 2026-09-13 ~11:1x: *"The survey finds is beginning to be repetitive … can you also
 * have some sentence structure variation as well?"* — and then, ~13:3x, RULING 40: *"the survey
 * should not refer to itself … the survey is self referential. we already have the public to
 * take its place."*
 *
 * ⛔⛔ WHAT RULING 40 STRUCK BEFORE IT LANDED, RECORDED HERE BECAUSE A STRUCK MECHANISM LEAVES
 * NO DIFF AND A LATER SEAT WOULD OTHERWISE BUILD IT AGAIN. Ruling 29 chartered a closed
 * `SURVEY_FRAMES` table and a `{survey}` slot — twelve frames for the engine's own fact, drawn
 * seeded with a page-level no-repeat. Ruling 40 struck BOTH by name: a recorded fact cannot be
 * wrong, so citing it adds nothing, and the exemplars cite nothing. The engine's fact is now a
 * PLAIN STATEMENT in the archiver's hand — *The walls are kept, the garrison is paid, and the
 * council sits* — and ALL of ruling 29's variety is carried by the OPENER CLASSES below, which
 * is the half of ruling 29 that survives intact. Neither the table nor the slot exists in this
 * file, and that absence is the ruling. *Reversal: the survey speaks by name.*
 *
 * ── WHY THESE ARE FUNCTIONS AND NOT FIELDS ON THE LEAF (the chair's call, vetoable) ───
 * The brief chartered the opener class "computed at generation and stored on the leaf". It is
 * computed at RENDER instead, from the same pure function, for three measured reasons:
 *   1. IT IS A PURE FUNCTION OF THE FACE TEXT. Stored, it is a CACHE and not a fact — and a
 *      cache that can drift from its source is exactly the defect class the shift register
 *      exists to end. Computed, it cannot disagree with the sentence it describes.
 *   2. THE BYTES ARE OWNER-SIGNED. A per-face string on all 2,266 variants adds to six
 *      generated leaves measured against three first-paint ceilings nobody has signed a rise
 *      for, and buys no behaviour a call cannot.
 *   3. THE GUARANTEE THAT MATTERED IS KEPT ANYWAY. "Computed at generation" was there so no
 *      face could be UNCLASSIFIABLE. The projector asserts the classifier is TOTAL over every
 *      face it projects, so that guarantee is taken at generation with none of the bytes.
 * *Reversal: emit `openers` and `closes` parallel to the faces, and read them here.*
 */

/**
 * ⭐ THE OPENER CLASSES (ruling 29 (II), the owner's list). CLOSED and TOTAL: `openerClassOf`
 * returns one of these seven for any string whatever, `subject` being the default rather than a
 * failure. `attributed` covers the survey slot's old ground too, now that the fact stands bare.
 * @type {ReadonlyArray<string>}
 */
export const OPENER_CLASSES = Object.freeze([
  'attributed', 'place', 'time', 'fronted', 'expletive', 'entry', 'subject',
]);

/** The heads that make an opener a TIME rather than a place. Checked FIRST: the narrower list. */
const TIME_HEADS = Object.freeze([
  'since', 'after', 'before', 'when', 'while', 'once', 'until', 'whenever', 'each', 'every',
  'lately', 'nowadays', 'afterwards', 'meanwhile',
]);
/** Multi-word time openers, which share their first word with the place prepositions. */
const TIME_PHRASES = Object.freeze([
  'on the night', 'on the nights', 'at night', 'at dusk', 'at dawn', 'at nightfall',
  'in the season', 'in the years', 'in the winter', 'in the summer', 'in living memory',
  'by night', 'by day', 'through the winter', 'through the season', 'on any night',
]);
/** The prepositions of PLACE (ruling 29: "At/In/On/By/Along/Outside…"). */
const PLACE_HEADS = Object.freeze([
  'at', 'in', 'on', 'by', 'along', 'outside', 'inside', 'beyond', 'across', 'under', 'over',
  'behind', 'beside', 'near', 'within', 'above', 'below', 'around', 'through', 'up', 'down',
  'where', 'from',
]);
/** The ENTRY form's heads (ruling 29's "Entered as kept: …"). */
const ENTRY_HEADS = Object.freeze(['entered', 'recorded', 'noted', 'kept,', 'listed', 'filed']);
/**
 * ⭐ AN ATTRIBUTION THAT OPENS ON `By` IS TOLD FROM A PLACE THAT OPENS ON `By` BY ITS NOUN, not
 * by its preposition — "By the tavern's ACCOUNT the watch is paid late" against "By the north
 * gate the stores are stacked". FOUND BY THE SUITE: the first spelling tested `by the` alone
 * and read the north gate as an attribution, which would have made the adjacency preference
 * incoherent wherever a face opens on a place. The list is CLOSED and short, and a `By` with
 * none of these words on it is a PLACE — the safe default, because a place is what the
 * preposition says and an attribution is what the noun says.
 */
const ATTRIBUTION_NOUNS = Object.freeze([
  'account', 'accounts', 'reading', 'reckoning', 'telling', 'showing', 'own account',
]);
// ⛔ THE CLASS IS `[^.?]` AND NOT `[^.?!]`, AND THE BANG'S ABSENCE IS DELIBERATE. This is a
// TEMPLATE literal, and the E2 ratchet counts an exclamation mark inside a string literal as
// copy debt (`tests/copy/voiceMechanics.test.js`) — it reds on this file, which carries none.
// Excluding the bang here would buy nothing anyway: §0d bans it from the corpus outright, so
// no face can contain one for the class to stop at. Found by running that ratchet, which is
// the second time this file has learned the same lesson (see `STOP_THEN_SPACE` above).
const ATTRIBUTION_RE = new RegExp(`^by\\s+[^.?]{0,40}?\\b(?:${ATTRIBUTION_NOUNS.join('|')})\\b`, 'i');
/** Determiners, for the fronted-object approximation. */
const DETERMINERS = Object.freeze(['the', 'a', 'an', 'this', 'that', 'these', 'those']);
/**
 * Finite verb forms common enough that their presence before a comma means the head noun phrase
 * is the SUBJECT and not a fronted object. Short and declared, per the approximation below.
 */
const FINITE_HEADS = Object.freeze([
  'is', 'are', 'was', 'were', 'has', 'have', 'had', 'does', 'do', 'did', 'will', 'would',
  'can', 'could', 'may', 'might', 'must', 'stands', 'stand', 'keeps', 'keep', 'says', 'say',
  'holds', 'hold', 'runs', 'run', 'pays', 'pay', 'sits', 'sit', 'goes', 'go', 'comes', 'come',
]);

/** The face's opening words, lower-cased, punctuation kept where it is part of the head. */
function openerWords(text) {
  return String(text).trim().toLowerCase().split(/\s+/);
}

/**
 * ⭐⭐ THE OPENER CLASS OF ONE FACE — closed, total, and computed on the RAW text so that a
 * `{role}` slot at the head reads as an attribution, which is what it will render as.
 *
 * THE ORDER IS THE RULE, and it is written down because a classifier's order IS its semantics:
 *   1. `attributed`  a role slot at the head, or `By …` / `According to …`. Checked first
 *                    because `by` is also a preposition of place, and an attribution that read
 *                    as a place would make the whole adjacency preference incoherent.
 *   2. `expletive`   `It is` / `There are` — a closed four-word test, never `It` alone, which
 *                    is a pronoun subject.
 *   3. `entry`       `Entered` / `Recorded` / `Kept,` — the record's own form.
 *   4. `time`        the closed TIME head list, then the multi-word TIME phrases. BEFORE
 *                    `place`, because `on`, `at`, `in` and `by` head both and the time list is
 *                    the narrow one: a head that is not on it is a place.
 *   5. `place`       the prepositions of place.
 *   6. `fronted`     ⚠ AN APPROXIMATION, and declared as one (ruling 29's mechanism says
 *                    "approximate"). A determiner-headed noun phrase, a comma inside the first
 *                    eight words, and NO finite verb form before that comma. "The stair to the
 *                    walk, a drover found with stores on it" is fronted; "The walls are kept,
 *                    and nobody stands on them" is not, because `are` precedes the comma.
 *                    THE FALSE NEGATIVE IS THE SAFE ONE and it is the one this takes: a fronted
 *                    object with no comma reads as `subject`, which costs the draw a preference
 *                    and never a refusal, because NOTHING IS REFUSED ON THIS CLASSIFIER.
 *   7. `subject`     everything else, which is most sentences.
 * @param {string} text the face's raw text, slots and all
 * @returns {string} one word of `OPENER_CLASSES`
 */
export function openerClassOf(text) {
  const raw = String(text == null ? '' : text).trim();
  if (raw === '') return 'subject';
  const head = raw.toLowerCase();
  const words = openerWords(raw);
  const slot = raw.match(/^\{([a-zA-Z_][a-zA-Z0-9_]*)\}/);
  if (slot && ROLE_SLOTS.includes(slot[1])) return 'attributed';
  if (/^according to\b/.test(head) || ATTRIBUTION_RE.test(head)) return 'attributed';
  if (/^(it is|it was|there is|there are|there was|there were)\b/.test(head)) return 'expletive';
  if (ENTRY_HEADS.includes(words[0])) return 'entry';
  if (TIME_HEADS.includes(words[0])) return 'time';
  if (TIME_PHRASES.some((phrase) => head.startsWith(phrase))) return 'time';
  if (PLACE_HEADS.includes(words[0])) return 'place';
  if (DETERMINERS.includes(words[0])) {
    const comma = words.findIndex((word) => word.endsWith(','));
    if (comma > 0 && comma < 8) {
      const before = words.slice(0, comma + 1).map((word) => word.replace(/[^a-z]/g, ''));
      if (!before.some((word) => FINITE_HEADS.includes(word))) return 'fronted';
    }
  }
  return 'subject';
}

/**
 * ⭐ THE CLOSE CLASSES (ADDENDUM 18 ruling 34, the chair's, at the research reconciliation:
 * *"a mechanical CLOSE CLASS beside the opener class … reported; the one refusal is
 * `reassurance` on a face not tagged compromised"*).
 *
 * ⛔ WHY THIS EXISTS AT ALL. §6's veto list — the which-clause closer, the summarising close,
 * the antithesis pair, the reassurance, the clever last beat — is ENTIRELY about how a face
 * ENDS, and until this car it had no instrument: a refuter judged it by eye and the block
 * measure could not count it. This names the shapes so they can be COUNTED. It refuses nothing
 * (ruling 1, and ruling 35: no gate returns) with the one exception ruling 34 names.
 * @type {ReadonlyArray<string>}
 */
export const CLOSE_CLASSES = Object.freeze([
  'which-tail', 'summary', 'antithesis', 'reassurance', 'question', 'plain',
]);

/** The reassurance tell, which is lawful ONLY on a face tagged `compromised` (ruling 26 (a)). */
const REASSURANCE_RE = /(?:all is well|nothing to fear|in good order|as it should be|nothing amiss|no cause for alarm)[.?!]?\s*$/i;
/** A final clause opening on ", which" — §6's which-clause closer. */
const WHICH_TAIL_RE = /,\s*which\b[^.?!]*[.?!]?\s*$/i;
/** The summarising close: a final clause that restates rather than adds. */
const SUMMARY_RE = /(?:,\s*(?:and that is|which is to say|so)\b|\.\s+(?:and that is|which is to say)\b)[^.?!]*[.?!]?\s*$/i;
/** The antithesis pair: "…, and not X" / "…, never X". */
const ANTITHESIS_RE = /,\s*(?:and not|but not|never|not)\b[^.?!]*[.?!]?\s*$/i;
/** A question left hanging without its mark (§7's device, counted wherever it stands). */
const QUESTION_RE = /,\s*(?:whether|who|what|where|why|how)\b[^.?!]*\.\s*$/i;

/**
 * ⭐⭐ THE CLOSE CLASS OF ONE FACE — closed, total, and ORDERED, because more than one shape can
 * match one sentence and the order decides which is reported.
 *
 * `reassurance` is FIRST and that is deliberate: it is the only one of the six that is ever
 * REFUSED, so a sentence that is both a reassurance and a which-tail must report as the
 * refusable one or the refusal would be evadable by adding a clause.
 * @param {string} text
 * @returns {string} one word of `CLOSE_CLASSES`
 */
export function closeClassOf(text) {
  const raw = String(text == null ? '' : text).trim();
  if (raw === '') return 'plain';
  if (REASSURANCE_RE.test(raw)) return 'reassurance';
  if (WHICH_TAIL_RE.test(raw)) return 'which-tail';
  if (SUMMARY_RE.test(raw)) return 'summary';
  if (ANTITHESIS_RE.test(raw)) return 'antithesis';
  if (QUESTION_RE.test(raw)) return 'question';
  return 'plain';
}

/**
 * ── ⭐⭐ THE UNIT CAP (ADDENDUM 18 ruling 30, the owner's, AS SOFTENED BY RULING 37) ────
 *
 * THE OWNER, 2026-09-13 ~11:3x: *"for simple descriptions… we would like to cap it at 2-3
 * sentences at most. Think about what we learned from the D&D prose research."*
 *
 * What the page prints for one pool on one town — THE DRAWN UNIT — is at most THREE sentences.
 * Ruling 30 made a pair's halves ONE sentence each as a rule; ruling 37 (the research
 * reconciliation) softened that to a DEFAULT, because the research is right that a two-sentence
 * half sometimes earns its second sentence. The arithmetic below is the softened form, and it
 * is the one the grammar enforces:
 *
 *   a lone face                     1 or 2 sentences
 *   a pair's half                   1 by default, 2 at the ceiling
 *   a pair with a WEIGHING          the two halves total 2 (so 1 + 1) and the weigh is 1 = 3
 *   a pair with NO weighing         the two halves total 3 at most (so 1 + 2 or 2 + 1)
 *   a `simple` pool's face          2 at the ceiling
 *
 * ⛔ AND A 2+1 PAIR IS LAWFUL BUT NOT COMPOUNDABLE, which needed no new code: `joinPairFaces`
 * already falls back to the full stop unless BOTH halves are one sentence, so the compound form
 * is unavailable to a 2+1 pair by construction rather than by a second rule. That is the whole
 * reason ruling 37's softening is safe — a two-sentence half cannot smuggle a four-sentence
 * unit onto the page through the joint.
 * @type {number}
 */
export const UNIT_SENTENCE_CAP = 3;
/** A pair half's ceiling (ruling 37: one by default, two where the selector keeps it). */
export const PAIR_HALF_SENTENCE_CAP = 2;
/** The two halves' total where the archiver also weighs (ruling 30's arithmetic). */
export const WEIGHED_PAIR_HALVES_TOTAL = 2;
/** A `simple` pool's per-face ceiling (ruling 37: two, not one). */
export const SIMPLE_POOL_SENTENCE_CAP = 2;
