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
 * ── THE FIVE LAWS THIS FILE ENFORCES ────────────────────────────────────────────────
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
 * @property {string} text the sentence, slots unfilled
 * @property {ReadonlyArray<string>} [slots] every `{slot}` the sentence names
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
 * The deterministic draw. The key binds the seed to the POOL IDENTITY, so two pools
 * read on one page with one seed do not draw the same index, and the same pool read
 * twice in one render draws the same sentence.
 * @param {ReadonlyArray<StateProseVariant>} eligible
 * @param {string} blockId
 * @param {string} poolKey
 * @param {string} seed
 * @returns {StateProseVariant|null}
 */
export function drawVariant(eligible, blockId, poolKey, seed) {
  if (!Array.isArray(eligible) || eligible.length === 0) return null;
  if (!seed) return eligible[0];
  return eligible[avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}`)) % eligible.length];
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
