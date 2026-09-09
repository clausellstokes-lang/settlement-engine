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
 * 2. FAIL-CLOSED AUDIENCE (§0e, J-CPL-5). A variant marked `dm-only` is covert. The
 *    player projection truncates to SILENCE, never to a hint: a page over a state with
 *    a covert seam must be byte-identical to a page over a state that genuinely lacks
 *    one. An unrecognised audience is treated as the player's — the restrictive read is
 *    the safe one when the caller is wrong.
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
 * @property {ReadonlyArray<string>} [wordings] FACES 1..n — the same claim set, the same
 *   `{slot}` set and the same marks BY CONSTRUCTION (ARCH §2.3). Absent on every variant
 *   the corpus ships today, which is why `drawFace` below takes no hash at all.
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
 * same claim set, a different member of it.
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
 * THE WORDING FACE (ARCH §2.6, car 3a). A variant carries one authored sentence today and,
 * after the rewrite wave, up to four SURFACES of the same claim set. This picks the surface.
 *
 * ── THE THREE THINGS THIS FUNCTION IS ────────────────────────────────────────────────
 *
 * 1. A NO-HASH SHORT-CIRCUIT ON TODAY'S CORPUS. Every one of the 2,266 shipped variants has
 *    exactly one face, so `faces === 1` and the function returns before touching either half
 *    of the hash pair. That is not an optimisation: it is what makes the seam provably
 *    byte-identical on the corpus that ships, and it is asserted by COUNTING the hash pair's
 *    own multiplications rather than by reading this paragraph.
 *
 * 2. A SUFFIX OF THE VARIANT KEY, NEVER A NEW ONE. The key is
 *    `${seed}::${blockId}::${poolKey}::w` — key 1 of ARCH §2.4 with `::w` appended — so the
 *    parent string never changes and appending faces cannot re-roll the variant draw. The
 *    suffix is spelled `::w` and nothing else: the migration script that first measured this
 *    spelled it `::wording`, and a key that disagrees with the shipped one measures a
 *    different world (P-F10).
 *
 * 3. CANONICAL-AT-ZERO, like every other draw here (law 4). A seedless read — the gallery
 *    import nulls `_seed` — takes face 0, the authored text.
 *
 * @param {StateProseVariant|null|undefined} variant
 * @param {string} blockId
 * @param {string} poolKey
 * @param {string} seed
 * @returns {number} the face index: 0 for the authored text, 1..n into `wordings`
 */
export function drawFace(variant, blockId, poolKey, seed) {
  const wordings = variant ? variant.wordings : undefined;
  const faces = 1 + (Array.isArray(wordings) ? wordings.length : 0);
  if (faces === 1) return 0;
  if (!seed) return 0;
  return hashKey(`${seed}::${blockId}::${poolKey}::w`) % faces;
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
