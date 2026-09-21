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

// ⛔ THE TRANSFORM LIVES IN THE KERNEL. `speakTierNoun` is a pure operation on a composed
// line — the generic "the town" spoken as the settlement's own noun — and the composer
// applies it on the finished unit. The composer's import fence (ARCH §4.1, car 3a) licenses
// the kernel and the three generated leaves and nothing else, and a fourth leaf is a chair
// conversation; the chair's answer (2026-09-19) is that this is not a leaf at all but a
// kernel operation, so it moved there and this module keeps its name as the re-export every
// desk-side caller already imports.
export { speakTierNoun } from './stateProseKernel.js';
export { speakTierNoun as default } from './stateProseKernel.js';
