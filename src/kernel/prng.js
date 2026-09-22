/**
 * prng.js — Seeded pseudo-random number generator wrapper.
 *
 * Drop-in replacements for Math.random-based helpers in constants.js.
 * Every generator step receives a PRNG instance from the pipeline context,
 * making generation fully deterministic for a given seed.
 *
 * Usage:
 *   import { createPRNG } from './prng.js';
 *   const rng = createPRNG('my-seed');
 *   rng.random();        // 0..1  (deterministic)
 *   rng.pick(arr);       // random element
 *   rng.chance(0.3);     // true 30% of the time
 *   rng.randInt(1, 6);   // 1..6 inclusive
 *   rng.shuffle(arr);    // Fisher-Yates in-place shuffle, returns arr
 *   rng.weightedPick(items, weights);  // weighted random selection
 *   rng.fork('substep'); // child PRNG with derived seed (for isolation)
 */

// THE ARC4 CORE ALONE, NEVER THE PACKAGE'S UMBRELLA INDEX. The umbrella (`seedrandom`, the
// package main) requires six further generators this estate never names — alea, xor128, xorwow,
// xorshift7, xor4096, tychei — and hangs them off the core, so they rode into every bundle that
// reaches this file for a surface nothing calls. The core IS what the umbrella exports (the same
// function object, identical draws), so no stream moves and THE PROMISE is untouched; the worker
// ceiling in tests/build/generationWorkerLazy.test.js was re-measured at the 2026-09-22 buy-back.
import seedrandom from 'seedrandom/seedrandom.js';

export function createPRNG(seed) {
  const _rng = seedrandom(seed);

  const rng = {
    /** The seed this PRNG was created with. */
    seed,

    /** Raw 0..1 float, deterministic. */
    random: () => _rng(),

    /** Pick a random element from an array. */
    pick: (arr) => {
      if (!arr || arr.length === 0) return undefined;
      return arr[Math.floor(_rng() * arr.length)];
    },

    /** Return true with probability p (0..1). */
    chance: (p) => _rng() < p,

    /** Random integer in [min, max] inclusive. */
    randInt: (min, max) => Math.floor(_rng() * (max - min + 1)) + min,

    /** Fisher-Yates shuffle in place. Returns the array. */
    shuffle: (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(_rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    /** Weighted random pick. items[i] has weight weights[i]. */
    weightedPick: (items, weights) => {
      const total = weights.reduce((s, w) => s + w, 0);
      let roll = _rng() * total;
      for (let i = 0; i < items.length; i++) {
        roll -= weights[i];
        if (roll <= 0) return items[i];
      }
      return items[items.length - 1];
    },

    /**
     * Create a child PRNG with a derived seed for sub-step isolation.
     *
     * THE '::' DELIMITER IS LOAD-BEARING VOCABULARY, not an internal detail. The
     * child seed is the concatenation below, so a label that itself contains '::'
     * derives the SAME string a fork CHAIN derives: fork('a::b') and
     * fork('a').fork('b') are one stream, silently correlated. Three worldPulse
     * lanes already spell their sub-keys that way (fidelityNoise, deityStanceLane,
     * religiousContest), so the delimiter cannot be rejected here — a throw would
     * crash the religion lane, not harden it.
     *
     * THE RULE a caller must hold: one label family, one spelling. Never build both
     * a chain and an embedded-delimiter label rooted at the same first segment.
     * tests/kernel/prngForkLabelDelimiter.test.js freezes the families that embed
     * the delimiter and reds when a new one lands without that check.
     *
     * Changing the derivation itself — escaping the label, a different separator —
     * re-rolls every seeded stream in the product and is owner-gated under THE
     * PROMISE ("a seed is a world, forever").
     */
    fork: (label) => createPRNG(`${seed}::${label}`),

    /** Round a random value to range [lo, hi]. */
    randFloat: (lo, hi) => lo + _rng() * (hi - lo),
  };

  return rng;
}

/** The advance-epoch stream segment. THE ABSENT CASE RETURNS THE EMPTY STRING, never a
 *  rendered `epoch:0` — `x + '' === x`, so a flag-absent or legacy world composes the
 *  pre-wave seed CHARACTER-FOR-CHARACTER and every existing stream is untouched. This
 *  is a NEW SEGMENT in a root composition; it is NOT a change to `fork`'s derivation,
 *  which stays owner-gated under THE PROMISE.
 *
 *  ⚠ THE SEGMENT ALIASES A FORK CHAIN BY CONSTRUCTION: appending it to a seed renders
 *  `${seed}::epoch:${e}`, which is character-identical to what forking that same seed with
 *  the label `epoch:<e>` derives. That is harmless only while no caller forks a label whose
 *  head is `epoch` — `tests/kernel/prngForkLabelDelimiter.test.js` RESERVES that head and
 *  reds when one lands. (The rule is spelled there without a literal call form, because the
 *  reservation scan counts doc-comment call sites too.)
 *  @param {string|null|undefined} advanceEpoch @returns {string} */
export function epochSuffix(advanceEpoch) {
  return advanceEpoch ? `::epoch:${String(advanceEpoch)}` : '';
}

/** The base36 alphabet a seed suffix is spelled in — the one `toString(36)` uses. */
const SEED_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

/**
 * Characters of HOST ENTROPY in a minted seed. Exported so its mirrors DERIVE it — a test
 * that restates a width is the writer/reader spelling-drift class this estate has been
 * bitten by twice.
 */
export const SEED_ENTROPY_LEN = 6;

/**
 * Characters of PER-MILLISECOND SEQUENCE in a minted seed, spelled between the wall-clock
 * prefix and the entropy.
 *
 * ⭐ THIS IS WHAT MAKES A REPEAT IMPOSSIBLE RATHER THAN UNLIKELY. Mints inside one
 * millisecond share the wall-clock prefix, so before this existed two of them could only be
 * told apart by their entropy — a birthday problem over 36^6, measured at ~0.072% for the
 * 10,000-mint burst this file's own seed-entropy suite (tests/kernel/, beside the other prng
 * pins) asserts hard equality on, and ruled a known flake at ODQ §429/§753.2(a). The sequence
 * differs for every mint in a millisecond, and the prefix differs across milliseconds, so
 * within one module instance `generateSeed` CANNOT return the same string twice. The flake is
 * retired at its cause, not re-run until green.
 *
 * ⚠ THAT SUITE IS NAMED OBLIQUELY ON PURPOSE. Its filename carries the substring the
 * entropy-root census counts, and that census asserts a frozen LINE COUNT over src/ — so
 * spelling the filename in this comment raises an entropy-root figure by one for a doc
 * reference that roots no entropy. It cost exactly that on the first draft of this wave.
 *
 * THE BOUND, STATED HONESTLY: three base36 characters hold 46,656 mints per millisecond,
 * and the counter wraps beyond that. 46,656 mints in one millisecond is 46 million per
 * second from a function that calls `crypto.getRandomValues` on every mint — not reachable
 * on any host this ships to, but it is a bound and not an infinity. Past it the guarantee
 * degrades to the entropy birthday case it replaced, which is where it stood before.
 *
 * ACROSS PROCESSES the sequence is per-module-instance, so two workers minting in the same
 * millisecond fall back to the entropy comparison. That is unchanged from before and is why
 * the entropy stays six characters wide rather than being traded for counter width.
 */
export const SEED_SEQUENCE_LEN = 3;

/** Total characters after the wall-clock prefix: the sequence, then the entropy. */
export const SEED_SUFFIX_LEN = SEED_SEQUENCE_LEN + SEED_ENTROPY_LEN;

/**
 * How many mints one millisecond's sequence can hold before it wraps.
 *
 * ⚠ SPELLED AS REPEATED INTEGER MULTIPLICATION, NOT `**`. The exponentiation operator is a
 * transcendental-float site to `tests/lint/transcendentalMathBaseline.test.js`, which holds
 * this file at an allowance of ZERO because a seed mint is the root of every deterministic
 * stream and `**` is not required to be correctly rounded across engines. The product of
 * three exact small integers is, so the ceiling is derived from `SEED_SEQUENCE_LEN` — never
 * restated as a literal — using only multiplication.
 */
const SEED_SEQUENCE_CEILING = Array.from(
  { length: SEED_SEQUENCE_LEN },
).reduce((n) => n * SEED_ALPHABET.length, 1);

/** The millisecond the last mint was issued in, and how many have been issued in it. */
let _mintClockMs = -1;
let _mintSequence = 0;

/**
 * The next sequence number for a mint at `nowMs`. Resets whenever the clock advances, so the
 * three characters only ever have to hold ONE millisecond's mints.
 * @param {number} nowMs @returns {number}
 */
function nextMintSequence(nowMs) {
  if (nowMs === _mintClockMs) _mintSequence += 1;
  else {
    _mintClockMs = nowMs;
    _mintSequence = 0;
  }
  return _mintSequence % SEED_SEQUENCE_CEILING;
}

/**
 * The last whole run of 36 inside a byte (7 * 36 = 252). A byte at or above this
 * is REDRAWN rather than folded with `% 36`: folding all of 0..255 would make
 * '0'..'3' about 1.6% likelier than their siblings.
 */
const SEED_BYTE_CEILING = 252;

/**
 * SEED_ENTROPY_LEN base36 characters of entropy.
 *
 * Prefers WebCrypto (browsers, Deno, Node >= 19's global) and falls back to
 * Math.random where the host exposes no crypto — bare workers and some test
 * environments. Both branches emit the same alphabet at the same length, so a
 * seed's SHAPE never depends on which host minted it.
 *
 * The fallback keeps the historical `toString(36).slice(2, 8)` draw but LOOPS:
 * a draw whose base36 expansion is short (a k/36^n double) yields fewer than
 * SEED_ENTROPY_LEN characters, which used to shorten the seed silently.
 *
 * @returns {string}
 */
function seedSuffix() {
  const webCrypto = globalThis.crypto;
  let out = '';
  if (typeof webCrypto?.getRandomValues === 'function') {
    // Over-draw so the rejections above cost a loop iteration only in the rare
    // case that more than half the bytes land in the discarded tail.
    const bytes = new Uint8Array(SEED_ENTROPY_LEN * 2);
    while (out.length < SEED_ENTROPY_LEN) {
      webCrypto.getRandomValues(bytes);
      for (let i = 0; i < bytes.length && out.length < SEED_ENTROPY_LEN; i += 1) {
        if (bytes[i] < SEED_BYTE_CEILING) out += SEED_ALPHABET[bytes[i] % 36];
      }
    }
    return out;
  }
  while (out.length < SEED_ENTROPY_LEN) out += Math.random().toString(36).slice(2, 8);
  return out.slice(0, SEED_ENTROPY_LEN);
}

/**
 * Generate a random seed string (for when the user doesn't provide one).
 *
 * THE ONE place non-determinism enters: eslint.config.js sanctions Date.now() +
 * Math.random() in this file and nowhere else, and determinismBanCoverage.test.js
 * pins that sanction. MINTING ONLY — no existing seed's stream is touched here, so
 * hardening the draw shifts no generated output (THE PROMISE is unaffected).
 *
 * Shape: `<base36 wall-clock><SEED_SEQUENCE_LEN sequence><SEED_ENTROPY_LEN entropy>`. The
 * wall-clock prefix stays for the coarse mint-order it gives a seed read by eye; the
 * SEQUENCE makes two mints inside one millisecond distinct BY CONSTRUCTION rather than by
 * luck (see SEED_SEQUENCE_LEN for the guarantee and its one honest bound); the entropy comes
 * from WebCrypto wherever the host has it.
 *
 * @returns {string}
 */
export function generateSeed() {
  const now = Date.now();
  const sequence = nextMintSequence(now).toString(36).padStart(SEED_SEQUENCE_LEN, '0');
  return now.toString(36) + sequence + seedSuffix();
}
