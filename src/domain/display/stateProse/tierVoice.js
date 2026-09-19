/**
 * domain/display/stateProse/tierVoice.js — THE SETTLEMENT'S OWN NOUN, IN THE CORPUS'S OWN
 * SENTENCES (ODQ §934.22 item 3).
 *
 * ── THE DEFECT (the second browser pass, 2026-09-19) ─────────────────────────────────
 * Kolstad is a VILLAGE of 633 people. Its Defense tab read:
 *
 *   "The town's plan for an army is to not be interesting to one, and everybody here can
 *    state the plan."
 *
 * The sentence is the corpus's (`defense.generated.js`, DS-DEF-2). It is a good sentence.
 * It calls a village a town, and it is not alone: MEASURED over
 * docs/content/RECEIPT_POOLS_DOSSIER_STATE.md, the word `town` stands as a whole word 1,101
 * times against 3 `thorp`, 3 `hamlet`, 2 `village`, 6 `city` and 4 `metropolis`. The corpus
 * was written with 'town' as the estate's generic word for a settlement of ANY size — which
 * `weaveBlock`'s own pronoun branch already had to work around, and which its docblock states
 * outright: "the corpus writes 'the town' generically about a settlement of any size".
 *
 * ⛔ SO THE CURE IS NOT 960 CORPUS EDITS, AND THAT IS A MEASUREMENT RATHER THAN A PREFERENCE.
 * Re-authoring those lines would move the projection, the wiring census, the prose leaf, the
 * prose-numerics register, the dossier-prose manifest (525 towns x 2 audiences = 72,240
 * cells) and the PDF corpus golden — for a change of ONE WORD PER SENTENCE that is already
 * derivable from the settlement the sentence is about. It is also the owner's copy. This is
 * `weaveBlock`'s own ruling one step further out: a RENDER-TIME ARRANGEMENT of words the
 * corpus already wrote, adding not one authored word, moving not one corpus byte.
 *
 * ── THE LINE IT WILL NOT CROSS, AND HOW THE LINE WAS DRAWN ───────────────────────────
 * ONLY A DEFINITE OR DEMONSTRATIVE REFERENCE MOVES: 'the town', 'The town', 'this town',
 * 'This town', with a possessive riding across. Counted over the corpus: 907 `the town` and
 * 53 `this town`.
 *
 * ⛔ 'A TOWN' IS DELIBERATELY UNTOUCHED — all 87 of them, and the 3 `every town` beside them.
 * An indefinite article in this corpus is a COMPARISON, not a reference: "what a larger town
 * does with buildings, this one does with acquaintance" is a sentence about somewhere else,
 * and "It is a town, in the ordinary sense" is the very line `weaveBlock`'s pronoun branch
 * exists to keep readable. Standing those down would rewrite the comparison into nonsense.
 *
 * ⛔ AND NO COMPOUND MOVES, WHICH WAS CHECKED RATHER THAN ASSUMED. 'The town watch', 'the
 * town walls', 'the town gates', 'the town hall', 'the town council', 'the town square', 'the
 * town crier', 'the town militia', 'the town charter' and 'the town market' were each grepped
 * over the whole corpus: ZERO occurrences of any of them. The matcher additionally requires
 * the determiner IMMEDIATELY before the noun, so an adjective ('the whole town', 2
 * occurrences) refuses the substitution rather than producing 'the whole village' on a guess.
 *
 * ⚠ THE RESIDUAL RISK, NAMED RATHER THAN LEFT TO BE FOUND: a corpus line that says 'the town'
 * about a NEIGHBOUR would be re-pointed at this settlement. Every definite occurrence in the
 * shipped corpus was sampled and all of them refer to the settlement the sentence is about —
 * the dossier's state prose is written about ONE settlement by construction — but the risk is
 * real and this is where it is written down. A line that means somewhere else should name it.
 *
 * ⛔ A TOWN IS A NO-OP, BY CONSTRUCTION. When the settlement's tier noun IS 'town', nothing
 * is substituted and the line is returned by identity, so every town in the estate renders
 * byte-identically to the day before this file existed — which is also what makes the arm
 * that proves the cure non-vacuous a PAIR (a village and a town) rather than a single read.
 *
 * ⭐ WHERE IT IS APPLIED (§934.22 addendum). At `composeStateProse`, on the finished unit,
 * for a caller whose option bag carries `tierNoun` — so the sentence the DESK returns is the
 * sentence the screen and the printed dossier render, and the three can never disagree. A
 * caller that carries no noun gets the corpus's own word back, which is what keeps every
 * committed register pinned to what the corpus wrote. `weaveBlock` still calls this leaf as
 * the backstop under a bag that has not moved yet; the substitution is idempotent, so a line
 * the desk already spoke returns by identity there.
 *
 * PURE HEADLESS LEAF: no React, no store, no seed, no locale API, ZERO IMPORTS. THE PROMISE
 * is untouched — same seed and same state give the same sentences, and now the same noun.
 *
 * @enforced-by tests/domain/display/stateProse/weaveBlock.test.js
 */

/**
 * The corpus's generic settlement noun, definite or demonstrative, with an optional
 * possessive captured so it can ride across the substitution.
 *
 * ⚠ EVERY LOOKAROUND IS POSITIVE — `(?=…)`, never `(?!…)` — and the reason is a register
 * rather than taste, exactly as `weaveBlock.js` records at its own matcher:
 * `tests/copy/voiceMechanics.test.js` is a shrink-only ratchet on exclamation points in
 * `src/domain` string literals, and a negative lookahead puts a bare `!` inside this pattern.
 * The boundary forms are equivalent, end of string included: the `|$` alternative carries the
 * case a negative lookahead would.
 *
 * ⚠ THE BOUNDARIES ARE SPELLED IN UNICODE LETTER CLASSES rather than `\b`, for the same
 * reason `weaveBlock` gives: `\b` is ASCII-only, so a diacritic reads as a word boundary that
 * is not one. The leading char is CAPTURED and re-emitted rather than asserted, so two
 * references in one line both match.
 */
const GENERIC_NOUN = /(^|[^\p{L}\p{N}_])(The|the|This|this) town(['’]s)?(?=[^\p{L}\p{N}_]|$)/gu;

/**
 * Speak one drawn line in the settlement's own tier noun.
 *
 * @param {unknown} line one sentence (or one composed unit) as the corpus wrote it
 * @param {unknown} tierNoun the settlement's tier noun, already resolved by
 *   `tierNounFor` at the call site — `null` for a tier this build does not know, in which
 *   case NOTHING is substituted rather than something being guessed.
 * @returns {string} the line, in the settlement's noun
 */
export function speakTierNoun(line, tierNoun) {
  if (typeof line !== 'string' || line === '') return typeof line === 'string' ? line : '';
  const noun = typeof tierNoun === 'string' ? tierNoun.trim() : '';
  // NO NOUN, OR THE CORPUS'S OWN NOUN ⇒ the line by identity. A town is the corpus's voice
  // already, so it is not merely equal to what it was: it is the same string.
  if (!noun || noun === 'town') return line;
  return line.replace(
    GENERIC_NOUN,
    /**
     * @param {string} _match @param {string} before @param {string} determiner
     * @param {string|undefined} possessive
     */
    (_match, before, determiner, possessive) => `${before}${determiner} ${noun}${possessive || ''}`,
  );
}

export default speakTierNoun;
