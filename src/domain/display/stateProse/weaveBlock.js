/**
 * domain/display/stateProse/weaveBlock.js — THE BLOCK WEAVE: several drawn sentences
 * arranged as ONE paragraph, with the repeated opening name stood down to the tier noun.
 *
 * ── THE DEFECT THIS EXISTS FOR (owner finding, 2026-09-18) ───────────────────────────
 * Every dossier position that draws more than one lens renders ONE `<p>` PER SENTENCE with
 * no joiner, and 72% of the corpus's variants name `{settlement}` while 25% of them OPEN on
 * it. A three-lens position therefore reads
 *
 *   Vallepagus sits in country that offers no argument against it…
 *   Vallepagus keeps no market worth the name…
 *   Vallepagus pays for its own defense in wages…
 *
 * — three paragraphs, three identical openings, one thought. The town is introduced three
 * times to a reader who has not looked away.
 *
 * ⛔ AND THE CURE IS NOT THE COMPOSER'S. `composeStateProse` already owns a joiner (its
 * spine + modifier arrangement, and `src/data/dossierConnectives.generated.js`), and it is
 * the WRONG instrument here twice over: it is authored for 0 of the 708 pools, and it is
 * BLOCK-LOCAL — it can join a spine to its own modifier and can never see the sibling block
 * rendered an inch below it. Authoring modifiers or connectives to reach across blocks would
 * also put new reader-facing copy in the tree, and the connective copy is the owner's to
 * sign. So this is a RENDER-TIME ARRANGEMENT of sentences the corpus already wrote, it adds
 * not one authored word, and no composer, pool, candidate leaf or mount row moves for it.
 *
 * ── WHAT IT DOES, AND THE LINE IT WILL NOT CROSS ─────────────────────────────────────
 * 1. The sentences join with ONE SPACE into one paragraph.
 * 2. From the SECOND sentence on, a sentence that OPENS on the settlement's name has that
 *    opening — and only that opening — stood down to the tier noun: "The village", "The
 *    town", carrying a possessive across when it finds one ("Vallepagus's" ⇒ "The
 *    village's").
 * 3. A name anywhere BUT the first character is left exactly as the corpus wrote it, and the
 *    FIRST sentence always keeps its name: the paragraph must still say who it is about.
 *    "Market day is Vallepagus at its truest…" is untouched at any index, because the name
 *    is doing work there that "the village" cannot do.
 *
 * It changes no other character, draws no variant, reads no seed, and calls no locale API —
 * so THE PROMISE is untouched: same seed + same state ⇒ same sentences, and now the same
 * arrangement of them.
 *
 * ⚠ THE SUBSTITUTION IS NOT A SYNONYM TABLE AND MUST NOT BECOME ONE. The tier noun is the
 * canonical tier token itself (`TIER_ORDER`), so the vocabulary cannot drift from the tier a
 * settlement actually carries, and a tier this build does not know substitutes NOTHING
 * rather than guessing a word. That is FINITE-SEMANTICS held at the display layer: the
 * finite set is the engine's own.
 *
 * ⭐⭐ THE PRONOUN BRANCH (the chair's ruling, 2026-09-18), and the measurement that bought it.
 * Over 48 generated settlements (6 tiers x 4 cultures x 2 seeds) and the seven woven positions
 * of the general desk: 760 sentences, 218 of them stood down (28.7%) — and in a measured
 * minority of those the SAME tier noun appeared AGAIN later in the same line, because the
 * corpus writes "the town" generically about a settlement of any size. The worst reading was
 *
 *   "The town is a town, in the ordinary sense, and the ordinariness is accurate."
 *
 * So the stand-in is CHOSEN rather than fixed. Where the line already names A SETTLEMENT TIER
 * as a whole word — any of them, not only this settlement's own, which is the chair's second
 * ruling and the reason `namesAnyTierNoun` reads `TIER_ORDER` whole — the opening becomes "It",
 * or "Its" for a possessive. That sentence now reads "It is a town, in the ordinary sense".
 * Everywhere else it is still "The <noun>". Sentence 0 is untouched by either branch, and no
 * other character moves under either.
 *
 * ⚠ TWO THINGS THE NEXT READER SHOULD KNOW ABOUT THIS BRANCH. (1) It tests the WHOLE LINE's
 * remainder rather than one grammatical sentence: a composed unit is ONE entry here and may
 * carry several sentences, and the conservative direction is the pronoun, which can never
 * repeat a noun. (2) A pronoun takes its referent from what precedes it, so on a line whose
 * predecessor ended on some other noun, "It" can be read as that noun. That is a real cost of
 * the ruling and it is written down rather than left to be discovered; what it was weighed
 * against is a sentence that tells the reader a town is a town.
 *
 * ⭐⭐ AND SINCE ODQ §934.22 item 3, ONE MORE THING HAPPENS HERE, TO EVERY LINE. The weave's
 * stand-down only ever touched an opening NAME. The browser pass found the other half of the
 * same defect: the corpus writes 'the town' about a settlement of any size (1,101 whole-word
 * `town` against 3 `hamlet` and 2 `village` across the whole pool document), so a village
 * read "The town's plan for an army…" in its own dossier. `tierVoice.js` speaks those
 * definite and demonstrative references in the settlement's own noun; its docblock carries
 * the measurement, the three classes it refuses, and the residual risk.
 *
 * ⛔ THE RULE'S HOME IS NOW THE DESK, AND THIS CALL IS THE BACKSTOP UNDER IT (§934.22
 * addendum). Speaking the noun HERE — at the renderer, after the desk had returned — meant
 * the screen and the desk that drew it disagreed about what to call a metropolis, which is
 * what `tests/ui/defenseTabFlow.test.js` reddens on: the tab printed "The metropolis
 * believes…" where `defenseThreatProse` had returned "The town believes…". So the
 * substitution moved UP, into `composeStateProse`, driven by the `tierNoun` the reader-facing
 * option bags now carry — and every surface renders the sentence the desk returned.
 * `speakTierNoun` STAYS here because it is IDEMPOTENT and TOTAL: a line the desk already
 * spoke carries no generic `the town` left to match and comes back by identity, so this costs
 * a scan and changes not one byte of a migrated caller's paragraph. What it still buys is a
 * caller whose bag has not moved yet (PowerTab's, at the time of writing) — that surface
 * keeps its reader's noun instead of silently regressing to the corpus's generic one. Remove
 * it only when every desk bag carries `tierNoun`, and red the tab-flow suites deliberately.
 *
 * ⛔ THE ONE-LINE CONTRACT BELOW IS THEREFORE NARROWED, DELIBERATELY AND IN THE OPEN. It used
 * to read "a position that drew a single lens renders exactly what it rendered before,
 * character for character". A position that draws one lens is exactly as entitled to its own
 * tier noun as one that draws three, so the guarantee is now: a single line is not WOVEN, and
 * on a TOWN it is returned by identity. That second half is what keeps every town in the
 * estate byte-identical, and it is why the suite proves the cure on a PAIR.
 *
 * PURE HEADLESS LEAF: no React, no store, two imports — the canonical tier list and the noun.
 *
 * @enforced-by tests/domain/display/stateProse/weaveBlock.test.js
 */
import { TIER_ORDER } from '../../../data/constants.js';
import { speakTierNoun } from './tierVoice.js';

/**
 * The noun a tier is called by in a sentence, or null for a tier this build does not know.
 *
 * ⛔ DERIVED FROM `TIER_ORDER`, NEVER FORKED FROM IT. The estate's existing tier
 * vocabularies are DISPLAY LABELS — `components/new/design.js` and `pdf/lib/viewModel.js`
 * both map the tier to a Title-Case badge word ("Village") — and a badge is not a noun in a
 * sentence. Both also live outside the domain, and a headless leaf reaching into
 * `src/components` for a word would invert the layer it belongs to. The tier TOKENS are
 * already the nouns, so the canonical list is the vocabulary and there is nothing to keep in
 * step with anything.
 * @param {unknown} tier
 * @returns {string|null} the lower-case noun ('village'), or null
 */
export function tierNounFor(tier) {
  const token = typeof tier === 'string' ? tier : '';
  return TIER_ORDER.includes(token) ? token : null;
}

/**
 * Escape a settlement name for use inside a `u`-mode RegExp.
 *
 * ⚠ ONLY THE SYNTAX CHARACTERS, and that is a correctness requirement rather than economy:
 * unicode mode REFUSES an identity escape of an ordinary character, so the belt-and-braces
 * `\-`/`\/` spelling would throw on construction for every name in the estate. Names carry
 * apostrophes and diacritics (Qutlugh Olqunu'ud, Edznaxochitl), and none of those are syntax
 * characters — they pass through as themselves.
 * @param {string} text
 * @returns {string}
 */
function escapeForRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * The matcher for "this sentence OPENS on the town's name".
 *
 * Anchored at index 0, the name escaped, an OPTIONAL possessive captured so it can ride
 * across the substitution, and a lookahead that refuses a longer word. The lookahead is
 * spelled in UNICODE LETTER CLASSES rather than `\w` on purpose: `\w` is ASCII-only, so a
 * town called Ford inside a sentence opening "Fordé…" would read as a word boundary that is
 * not one, and the estate's name generators emit diacritics freely.
 *
 * ⚠ EVERY LOOKAHEAD HERE IS POSITIVE — `(?=…)`, never `(?!…)` — and the reason is a register
 * rather than taste. `tests/copy/voiceMechanics.test.js` is an exact, per-file, shrink-only
 * ratchet on exclamation points in `src/domain` string literals, and a negative lookahead puts
 * a bare `!` inside this template. The ratchet's own instruction for a file that grew is
 * REWRITE, never bank, so the construct is spelled the other way round. The boundary forms are
 * exactly equivalent, end of string included: `(?!X)` succeeds where no character matches X,
 * and the `|$` alternative is what carries that same case here.
 *
 * ⛔ ONLY APOSTROPHE-PLUS-S IS A POSSESSIVE HERE, AND A BARE APOSTROPHE IS DELIBERATELY NOT
 * ONE (second review, 2026-09-18). A bare possessive on a name already ending in s —
 * "Kilcross' market lives off through-traffic" — is indistinguishable, without parsing the
 * sentence, from a line where the apostrophe is simply a typo: "Kilcross' is a town in name
 * only". Read as a possessive, the second becomes "Its is a town in name only" — a wreck, and
 * a SILENT one, because nothing downstream can tell that a pronoun was substituted for a
 * subject. So the matcher leaves a bare apostrophe alone, `weaveBlock` degrades that line to
 * the plain "The <noun>" form with the apostrophe still visible where the line put it, and
 * the case is refused AT AUTHORING instead — see the arm in
 * tests/data/dossierStateProseProjection.contract.test.js, which forbids `{settlement}` (or
 * any slot) followed by a bare apostrophe and a space. A fault a reader can see, on a line a
 * walker will not let into the corpus, beats a repair this leaf has to guess at.
 * @param {string} name
 * @returns {RegExp}
 */
function openingNameMatcher(name) {
  return new RegExp(`^${escapeForRegExp(name)}(['’]s)?(?=[^\\p{L}\\p{N}_]|$)`, 'u');
}

/**
 * Does this remainder OPEN on a bare possessive apostrophe — one a space or the line's end
 * follows? The weave uses it to refuse BOTH the possessive reading and the pronoun on such a
 * line, so the apostrophe stays where the corpus put it and the fault stays visible.
 *
 * ⚠ A PLAIN ANCHORED MATCH, no lookaround at all: the whitespace is CONSUMED by the pattern
 * rather than asserted beside it, because this predicate only answers a question and never
 * decides a replacement span.
 *
 * ⛔ WHAT IT DOES NOT DO, said plainly because the comment it replaces claimed otherwise and
 * the suite pinned the opposite: an apostrophe with a LETTER after it — a contraction, or any
 * mid-word mark — is not matched here, so such a line takes the ORDINARY path and its opening
 * name IS still stood down. "Kilcross'n the road are one argument" becomes "The village'n the
 * road are one argument", which the test pins. This predicate decides which of the weave's
 * three endings a line gets; it has never decided WHETHER a name at index 0 is replaced, and
 * nothing in this leaf declines to rename a town on the strength of an apostrophe alone.
 */
const BARE_POSSESSIVE = /^['’](\s|$)/u;

/**
 * Does this text already name A SETTLEMENT TIER as a WHOLE WORD? — the pronoun branch's test.
 *
 * ⭐ ANY TIER, NOT ONLY THIS SETTLEMENT'S (the chair's second ruling, 2026-09-18), and the
 * measurement is the whole argument. The first cut of this branch asked only about the
 * settlement's OWN noun, and on the same 48-settlement corpus that left 69 of 218 stand-downs
 * putting `The <noun>` into a line that names a DIFFERENT tier — because the corpus writes
 * "the town" generically about a settlement of any size, which is five tiers out of six. Most
 * of the sixty-nine read correctly, and read correctly with the pronoun too ("It keeps few
 * institutions because it needs few; what a larger town does with buildings, this one does
 * with acquaintance"). One class did not, and it is the reading this branch exists to
 * prevent, one tier over from where the first cut caught it:
 *
 *   "The village is a town, in the ordinary sense, and the ordinariness is accurate."
 *
 * ⛔ SPLIT RATHER THAN MATCHED, and the reason is the two constraints this predicate sits
 * between. A bordered match wants a lookbehind and a lookahead, the negative forms of which
 * put a bare `!` in a `src/domain` string literal and move the `voiceMechanics` ratchet; and
 * `\b` is ASCII-only, so it reads a boundary inside a diacritic that is not one. Splitting on
 * the same unicode letter/number class the matcher above uses gets whole-word identity by
 * CONSTRUCTION — no boundary to spell, no bang, and "towns" is correctly not "town".
 *
 * `toLowerCase` is the case-insensitive read and NOT a locale API: it is the unconditional
 * Unicode mapping, so it answers the same on every host, which is what THE PROMISE needs.
 * @param {string} text the line's remainder, after the opening name
 * @returns {boolean}
 */
function namesAnyTierNoun(text) {
  const words = new Set(text.toLowerCase().split(/[^\p{L}\p{N}_]+/u));
  return TIER_ORDER.some((tier) => words.has(tier));
}

/**
 * @typedef {object} WovenBlock
 * @property {string} paragraph the sentences as one paragraph, joined by single spaces
 * @property {ReadonlyArray<string>} sentences the same sentences, after the stand-down
 */

/**
 * Weave one position's drawn sentences into one paragraph.
 *
 * @param {ReadonlyArray<string|null|undefined>|null|undefined} lines the drawn sentences,
 *   in the order the desk built them. Blank and absent entries are dropped BEFORE weaving,
 *   so a position whose middle lens was silent still weaves the two that spoke — and the
 *   surviving first line is the one that keeps its name, not the index the desk gave it.
 * @param {{settlementName?: unknown, tierNoun?: unknown}} [options] `tierNoun` is the noun
 *   itself, already resolved by `tierNounFor` at the call site: the caller holds the
 *   settlement and this leaf should not have to decide which of its fields is the tier.
 * @returns {WovenBlock}
 */
export function weaveBlock(lines, options = {}) {
  const noun0 = typeof options.tierNoun === 'string' ? options.tierNoun.trim() : '';
  // THE SETTLEMENT'S OWN NOUN, FIRST AND ON EVERY LINE — index 0 included, single lines
  // included. It runs BEFORE the stand-down on purpose: `namesAnyTierNoun` then reads the
  // text the READER will meet, so a line whose remainder has just become "the village…"
  // takes the pronoun rather than opening "The village … the village's".
  const kept = (Array.isArray(lines) ? lines : [])
    .filter((line) => typeof line === 'string' && line.trim() !== '')
    .map((line) => speakTierNoun(line, noun0));
  // ONE LINE IS NOT A WEAVE. Nothing is joined and no name is stood down, which is what makes
  // this safe to route every position through — and on a TOWN, whose noun is the corpus's own,
  // `speakTierNoun` returned the line by identity, so such a position renders exactly what it
  // rendered before, character for character.
  if (kept.length <= 1) {
    return Object.freeze({
      paragraph: kept.length === 1 ? kept[0] : '',
      sentences: Object.freeze(kept.slice()),
    });
  }
  const name = typeof options.settlementName === 'string' ? options.settlementName.trim() : '';
  const noun = noun0;
  // NO NAME OR NO NOUN ⇒ THE JOIN ALONE, which is the honest half of the fix rather than a
  // fallback: the sentences still read as one paragraph, and nothing is renamed on a guess.
  const opening = name && noun ? openingNameMatcher(name) : null;
  // THE POSSESSIVE RIDES ACROSS VERBATIM rather than being re-spelled. The shipped corpus
  // writes the straight apostrophe (`Kilcross's market lives off through-traffic`, U+0027
  // measured), the typographic one appears elsewhere in the estate's copy, and a weave that
  // normalised either into the other would be changing a character it was told not to.
  const woven = kept.map((line, index) => {
    if (index === 0 || !opening) return line;
    return line.replace(
      opening,
      /** @param {string} match @param {string|undefined} possessive */
      (match, possessive) => {
        const rest = line.slice(match.length);
        // ⛔ A BARE APOSTROPHE TAKES NEITHER BRANCH. It cannot be told from a typo without
        // parsing the sentence, and the pronoun is the dangerous guess: "Kilcross' is a town
        // in name only" would become "Its is a town in name only", which reads as a wreck and
        // hides that a subject was replaced. The plain form leaves the apostrophe visible, so
        // a malformed line degrades to a fault a reader can SEE. The corpus is forbidden to
        // carry one at all (the projection contract's own arm), which is where it is really
        // closed; this is the belt under that brace.
        if (!possessive && BARE_POSSESSIVE.test(rest)) return `The ${noun}`;
        // THE PRONOUN BRANCH (the chair's rulings): a line that already names ANY settlement
        // tier takes "It"/"Its" instead, so the weave can produce neither "The town is a town"
        // nor "The village is a town".
        if (namesAnyTierNoun(rest)) return possessive ? 'Its' : 'It';
        return `The ${noun}${possessive || ''}`;
      },
    );
  });
  return Object.freeze({
    paragraph: woven.join(' '),
    sentences: Object.freeze(woven),
  });
}
