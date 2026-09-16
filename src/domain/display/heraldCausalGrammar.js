/**
 * domain/display/heraldCausalGrammar.js — THE CAUSAL VOICE'S SUBSTRATE (SP-6's
 * CAUSAL GRAMMAR amendment, 2026-08-03; content from
 * docs/content/RECEIPT_POOLS_CAUSAL.md §0c / §0d / §3).
 *
 * This module holds the three closed vocabularies the Herald's causal registers
 * compose FROM, and nothing else:
 *
 *   §0c THE EIGHT TYPED EDGES  — the provenance relation a link actually holds.
 *   §3   THE CONNECTIVE POOLS  — sixteen named inflections under those eight
 *        parents, plus §3.2's two terminals. A connective is the ONLY thing in a
 *        composed sentence that asserts a relationship, and it may assert exactly
 *        the relationship the edge holds. Substituting ACROSS PARENTS is the whole
 *        failure mode the section exists to prevent.
 *   §0d THE TIME-BAND FAMILY   — six bands in four print positions. Durations
 *        render through this vocabulary ONLY. No digits, no numerals of any kind.
 *
 * ── SELECTION IS AVALANCHE-MIXED (the recorded parity hazard) ────────────────
 * FNV-1a's low bit is a PARITY, not a hash: bit 0 of the digest is the XOR of bit
 * 0 of every input character, so any seed family whose varying token appears an
 * even number of times holds it constant and `% pool.length` on a power-of-two
 * pool leaves half the pool unreachable (measured on `wizard_news.${i}.applied.
 * evt${i}`: a `% 8` selection reached residues {1,3,5,7} only). Every draw here
 * therefore runs `avalanche32(fnv1a32(seed))`, never raw `fnv1a32 % pool`.
 *
 * PURE: no store, no React, no Date, no Math.random, no I/O, no mutation. Nothing
 * here reads world state; the composer hands it the tokens.
 *
 * @enforced-by tests/domain/heraldCausalVoice.test.js
 * @enforced-by tests/lint/heraldContaminationFence.test.js
 */

/** FNV-1a 32-bit. The estate idiom (proseHash.js / settlementRumors.js). */
export function fnv1a32(str) {
  let h = 0x811c9dc5;
  const s = String(str);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Murmur3's fmix32 finalizer — the avalanche that kills the low-bit parity. */
export function avalanche32(h) {
  let x = h >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return x >>> 0;
}

/**
 * Deterministically draw one member of a pool. Same seed ⇒ same member, forever.
 * An empty/absent pool returns null (the caller drops the link rather than
 * printing a hole).
 * @template T
 * @param {ReadonlyArray<T>|undefined|null} pool
 * @param {string} seed
 * @returns {T|null}
 */
export function pickCausal(pool, seed) {
  if (!Array.isArray(pool) || pool.length === 0) return null;
  if (pool.length === 1) return pool[0];
  return pool[avalanche32(fnv1a32(String(seed))) % pool.length];
}

// ── §0c THE EIGHT TYPED EDGES ────────────────────────────────────────────────

/** The eight provenance edge types. Law 1 is checked against these and nothing else. */
export const CAUSAL_EDGES = Object.freeze([
  'succession',
  'origination',
  'answer',
  'charge',
  'belief',
  'gate',
  'instrument',
  'carriage',
]);

/**
 * §3.1's sixteen named inflections, each filed under the §0c parent whose relation
 * it renders. A composer selects the PARENT from the provenance edge and then the
 * POOL from the receipt class; a checker only ever has to ask whether the parent
 * matches.
 * @type {Readonly<Record<string, typeof CAUSAL_EDGES[number]>>}
 */
export const POOL_PARENT = Object.freeze({
  followed: 'succession',
  remembered: 'succession',
  exposed: 'succession',
  caused: 'origination',
  answered: 'answer',
  priced: 'charge',
  believed: 'belief',
  planted: 'belief',
  judged: 'belief',
  refused: 'gate',
  dissolved: 'gate',
  enforced: 'instrument',
  breached: 'instrument',
  inherited: 'instrument',
  buried: 'instrument',
  carried: 'carriage',
});

/**
 * One connective line.
 * @typedef {Object} Connective
 * @property {string} text
 * @property {'back'|'fwd'} dir   back = after the CHILD pointing at the PARENT.
 * @property {'N'|'F'|'V'|'A'} arg  N noun phrase · F finite clause · V bare verb
 *   phrase · A absolute (carries its own parent, takes no argument).
 */

/** @param {string} text @param {'back'|'fwd'} dir @param {'N'|'F'|'V'|'A'} arg @returns {Connective} */
function c(text, dir, arg) {
  return Object.freeze({ text, dir, arg });
}

/**
 * §3.1 — THE SIXTEEN CONNECTIVE POOLS, verbatim from the annex.
 *
 * `planted` is the DM arm: on a player surface it degrades to `believed` by
 * connective SWAP (R-W5-F) — the sentence keeps its shape, the reader keeps the
 * irony, and the planter is not leaked, not as a name, not as a stub, not as a
 * hole where a name would sit. `playerPoolFor` below is that swap.
 * @type {Readonly<Record<string, ReadonlyArray<Connective>>>}
 */
export const CONNECTIVE_POOLS = Object.freeze({
  // succession ────────────────────────────────────────────────────────────────
  followed: Object.freeze([
    c('following', 'back', 'N'),
    c('in the wake of', 'back', 'N'),
    c('on the heels of', 'back', 'N'),
    c('and it came after', 'back', 'N'),
    c('the year after', 'back', 'N'),
    c('and after it', 'fwd', 'N'),
    c('and then', 'fwd', 'F'),
  ]),
  remembered: Object.freeze([
    c('on a grudge as old as', 'back', 'N'),
    c('not forgotten since', 'back', 'N'),
    c('remembered from', 'back', 'N'),
    c('out of a memory of', 'back', 'N'),
    c('and it is remembered still that', 'fwd', 'F'),
    c('and the town has not let go of', 'fwd', 'N'),
  ]),
  exposed: Object.freeze([
    c('when it came out that', 'back', 'F'),
    c('once it was known that', 'back', 'F'),
    c('after it was shown that', 'back', 'F'),
    c('on the naming of', 'back', 'N'),
    c('on the exposure of', 'back', 'N'),
    c('and then it was said aloud that', 'fwd', 'F'),
    c('and what came out was', 'fwd', 'N'),
  ]),
  // origination ───────────────────────────────────────────────────────────────
  caused: Object.freeze([
    c('born of', 'back', 'N'),
    c('out of', 'back', 'N'),
    c('the work of', 'back', 'N'),
    c('which came of', 'back', 'N'),
    c('because', 'back', 'F'),
    c('and the cause entered against it is', 'back', 'N'),
    c('and out of it came', 'fwd', 'N'),
    c('and so', 'fwd', 'F'),
  ]),
  // answer ────────────────────────────────────────────────────────────────────
  answered: Object.freeze([
    c('in answer to', 'back', 'N'),
    c('in reply to', 'back', 'N'),
    c('which answered', 'back', 'N'),
    c('and the answer to it was', 'fwd', 'N'),
    c('and they answered it with', 'fwd', 'N'),
    c('and the answer came back', 'fwd', 'F'),
    c('which was answered when', 'fwd', 'F'),
  ]),
  // charge ────────────────────────────────────────────────────────────────────
  priced: Object.freeze([
    c('the bill for', 'back', 'N'),
    c('the price of', 'back', 'N'),
    c('paid for', 'back', 'N'),
    c('the reckoning for', 'back', 'N'),
    c('and the bill came to', 'fwd', 'N'),
    c('and it was paid for when', 'fwd', 'F'),
  ]),
  // belief ────────────────────────────────────────────────────────────────────
  believed: Object.freeze([
    c('believing', 'back', 'F'),
    c('on a report that', 'back', 'F'),
    c('on the word that', 'back', 'F'),
    c('because the court took it for', 'back', 'N'),
    c('on a report of', 'back', 'N'),
    c('and the court held it for', 'fwd', 'N'),
    c('and it was taken for', 'fwd', 'N'),
  ]),
  planted: Object.freeze([
    c('planted on them by', 'back', 'N'),
    c('on a lie sold to them by', 'back', 'N'),
    c('on a story bought out of', 'back', 'N'),
    c('believing exactly what', 'back', 'F'),
    c('on a picture furnished by', 'back', 'N'),
    c('and the furnishing of it was', 'fwd', 'N'),
  ]),
  judged: Object.freeze([
    c('for which the world holds them', 'back', 'A'),
    c('as the neighbours reckon it', 'back', 'A'),
    c('in the reckoning of', 'back', 'N'),
    c('and it was called', 'fwd', 'N'),
    c('and the courts have named it', 'fwd', 'N'),
    c('and it is held against them as', 'fwd', 'N'),
  ]),
  // gate ──────────────────────────────────────────────────────────────────────
  refused: Object.freeze([
    c('for the refusal of', 'back', 'N'),
    c('when they would not', 'back', 'V'),
    c('against the refusal of', 'back', 'N'),
    c('and the answer was no', 'back', 'A'),
    c('and the refusal entered against it is', 'fwd', 'N'),
    c('and nobody would', 'fwd', 'V'),
  ]),
  dissolved: Object.freeze([
    c('once it no longer stood', 'back', 'A'),
    c('the cause being gone', 'back', 'A'),
    c('and nothing was left to hold it', 'back', 'A'),
    c('with the end of', 'back', 'N'),
    c('after the dissolution of', 'back', 'N'),
    c('and there was nothing left to answer for', 'fwd', 'A'),
  ]),
  // instrument ────────────────────────────────────────────────────────────────
  enforced: Object.freeze([
    c('under the terms of', 'back', 'N'),
    c('by the letter of', 'back', 'N'),
    c('as required by', 'back', 'N'),
    c('the {term} forbidding it', 'back', 'A'),
    c('because the terms said so', 'back', 'A'),
    c('and the instrument would not allow', 'fwd', 'N'),
  ]),
  breached: Object.freeze([
    c('after the breach of', 'back', 'N'),
    c('on the default of', 'back', 'N'),
    c('when the wagons stopped coming', 'back', 'A'),
    c('the promise being broken', 'back', 'A'),
    c('once the terms were not kept', 'back', 'A'),
    c('and what was broken was', 'fwd', 'N'),
  ]),
  inherited: Object.freeze([
    c('left them by', 'back', 'N'),
    c('come down from', 'back', 'N'),
    c('inherited with the seat from', 'back', 'N'),
    c('sworn by the father in', 'back', 'N'),
    c('and it came down to', 'fwd', 'N'),
    c('and the son holds what', 'fwd', 'F'),
  ]),
  buried: Object.freeze([
    c('set aside at a price', 'back', 'A'),
    c('under a burial decree', 'back', 'N'),
    c('after the seat set aside', 'back', 'N'),
    c('buried, and then not', 'back', 'A'),
    c('and it was dug up again after', 'fwd', 'N'),
    c('and the seat set it aside at', 'fwd', 'N'),
  ]),
  // carriage ──────────────────────────────────────────────────────────────────
  carried: Object.freeze([
    c('carried down the road by', 'back', 'N'),
    c('brought by', 'back', 'N'),
    c('which came with', 'back', 'N'),
    c('which arrived with', 'back', 'N'),
    c('and it travelled at the speed of', 'fwd', 'N'),
    c('and the roads carried it to', 'fwd', 'N'),
    c('and it came in with', 'fwd', 'N'),
  ]),
});

/**
 * The `followed` pool's FORBIDDEN list (§3.1). A composer that falls back to the
 * `caused` pool when a `followed` connective does not fit has manufactured the
 * causality the corpus promises never to manufacture; the correct fallback is to
 * DROP THE LINK, not to re-label it. Exported so the pin can assert it.
 */
export const FOLLOWED_FORBIDDEN = Object.freeze([
  'because', 'so', 'out of', 'born of', 'the work of', 'which came of',
]);

/**
 * §3.2 — THE TWO TERMINALS. A terminal closes the walk, takes no argument, and is
 * the last thing in a telling.
 *
 * `chain_end` serves BOTH the genuine origin AND the covert truncation, seeded on
 * the VISIBLE chain only: two pools would leak the covert seam through wording,
 * and a shared pool seeded on the hidden link would leak it through variant
 * selection. `horizon` fires on RETENTION ONLY and may NEVER render at a covert
 * seam — using it there would be both a lie and a tell.
 */
export const TERMINALS = Object.freeze({
  chain_end: Object.freeze([
    'the walk stops here',
    'the record goes back this far and no further',
    'what stands before this, the record does not say',
    'the account carries nothing behind this',
    'the trail ends here',
    'behind this the page is blank',
  ]),
  horizon: Object.freeze([
    'the trail runs past living memory',
    'there is no one still keeping the account that far back',
    'the older books were not kept',
    'that far back, the town keeps no account',
    'the years before that are out of reach of the record',
    'it goes back past anything anyone kept',
  ]),
});

/** §3.2's STANDING BAN on `chain_end` — false-at-a-covert-seam words, and tells. */
export const CHAIN_END_BANNED = Object.freeze([
  'began', 'beginning', 'origin', 'first', 'started', 'where it all comes from',
  'hidden', 'kept back', 'withheld', 'not shown', 'sealed', 'someone has seen to it',
]);

// ── §0d THE TIME-BAND FAMILY ─────────────────────────────────────────────────

/**
 * The six canonical bands in four print positions. "Older than its bearers" is
 * PREDICATE-ONLY: it is a comparison, not a quantity, and it cannot be made to sit
 * before a noun, after a preposition, or alone — the other three columns are null
 * and a mold needing one of them falls back to §3's bare connective rather than
 * printing a broken phrase.
 */
export const TIME_BANDS = Object.freeze([
  Object.freeze({ id: 'this_season', maxWeeks: 13, attributive: "this season's", span: 'this season', since: 'this season', predicate: 'of this season' }),
  Object.freeze({ id: 'within_the_year', maxWeeks: 52, attributive: "the year's", span: 'the year', since: 'within the year', predicate: 'not yet a year old' }),
  Object.freeze({ id: 'years_on', maxWeeks: 52 * 10, attributive: "years'", span: 'years', since: 'years on', predicate: 'years old' }),
  Object.freeze({ id: 'a_decade', maxWeeks: 52 * 25, attributive: "a decade's", span: 'a decade', since: 'a decade on', predicate: 'a decade old' }),
  Object.freeze({ id: 'a_generation', maxWeeks: 52 * 60, attributive: "a generation's", span: 'a generation', since: 'a generation on', predicate: 'a generation old' }),
  Object.freeze({ id: 'older_than_bearers', maxWeeks: Infinity, attributive: null, span: null, since: null, predicate: 'older than its bearers' }),
]);

/** The four print positions a time band may occupy. */
export const TIME_BAND_POSITIONS = Object.freeze(['attributive', 'span', 'since', 'predicate']);

/**
 * Select the band ONCE from elapsed ticks; the SLOT decides which column prints.
 * A non-finite or negative span reads as the nearest band rather than inventing a
 * duration. `intervalWeeks` is the world's own tick length (SP-7's assertion).
 *
 * @param {number} sinceTicks
 * @param {number} [intervalWeeks]
 * @returns {typeof TIME_BANDS[number]}
 */
export function timeBandOf(sinceTicks, intervalWeeks = 1) {
  const ticks = Number.isFinite(sinceTicks) ? Math.max(0, Number(sinceTicks)) : 0;
  const per = Number.isFinite(intervalWeeks) && Number(intervalWeeks) > 0 ? Number(intervalWeeks) : 1;
  const weeks = ticks * per;
  for (const band of TIME_BANDS) if (weeks <= band.maxWeeks) return band;
  return TIME_BANDS[TIME_BANDS.length - 1];
}

/**
 * The band's word in one print position, or null when the band cannot occupy it
 * (the predicate-only sixth band). A null is the composer's signal to fall back to
 * the bare connective — never to print a broken phrase.
 * @param {typeof TIME_BANDS[number]} band
 * @param {'attributive'|'span'|'since'|'predicate'} position
 * @returns {string|null}
 */
export function timeBandWord(band, position) {
  if (!band || !TIME_BAND_POSITIONS.includes(position)) return null;
  const word = /** @type {Record<string, string|null>} */ (/** @type {unknown} */ (band))[position];
  return typeof word === 'string' && word ? word : null;
}

/**
 * The connective pool a link should draw from for a given audience. On a player
 * surface the DM-only `planted` arm degrades to `believed` — the sentence keeps
 * its shape and the planter is never leaked.
 * @param {string} pool
 * @param {boolean} seesSecrets
 * @returns {string}
 */
export function audiencePoolFor(pool, seesSecrets) {
  if (pool === 'planted' && !seesSecrets) return 'believed';
  return pool;
}

/**
 * Draw the connective for one link. Deterministic on `seed`; `direction` filters
 * the pool so a telling holds ONE direction for its whole chain (mixing them
 * mid-sentence is how a reader loses which end is the cause). Returns null when
 * the pool is unknown or holds nothing in that direction — the link is dropped.
 *
 * @param {Object} args
 * @param {string} args.pool
 * @param {string} args.seed
 * @param {'back'|'fwd'} [args.direction]
 * @param {boolean} [args.seesSecrets]
 * @returns {(Connective & { pool: string, edge: string })|null}
 */
export function connectiveFor({ pool, seed, direction = 'back', seesSecrets = false }) {
  const key = audiencePoolFor(String(pool), !!seesSecrets);
  const lines = CONNECTIVE_POOLS[key];
  if (!Array.isArray(lines)) return null;
  const inDirection = lines.filter((line) => line.dir === direction);
  const drawn = pickCausal(inDirection, `${seed}::conn::${key}::${direction}`);
  if (!drawn) return null;
  return Object.freeze({ ...drawn, pool: key, edge: POOL_PARENT[key] });
}

/**
 * Draw a terminal line. `truncated` forces `chain_end`, and it names the two cuts
 * the terminal may not describe:
 *
 *   A COVERT SEAM — `horizon` would distinguish the covert case from the genuine
 *   end, which is exactly what `chain_end` exists to prevent. Both a lie and a
 *   tell.
 *   A CLAUSELESS HOP (lane HR) — the walk cannot tell a root `sourceEventId` from
 *   a receipt aged past MAX_HISTORY, so "the trail runs past living memory" is a
 *   claim about retention that is false half the time it would be drawn.
 *
 * `chain_end` is true of both, and of the genuine origin, which is why one pool
 * serves all three.
 * @param {Object} args
 * @param {'chain_end'|'horizon'} args.terminal
 * @param {string} args.seed
 * @param {boolean} [args.truncated]
 * @returns {string}
 */
export function terminalLine({ terminal, seed, truncated = false }) {
  const key = truncated ? 'chain_end' : (terminal === 'horizon' ? 'horizon' : 'chain_end');
  return pickCausal(TERMINALS[key], `${seed}::terminal::${key}`) || TERMINALS.chain_end[0];
}
