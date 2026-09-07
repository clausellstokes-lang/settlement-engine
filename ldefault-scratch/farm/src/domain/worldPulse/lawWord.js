/**
 * lawWord.js — THE ESTATE'S ONE LAW-BAND SPELLING (CR-ES-3, chair 2026-08-05).
 *
 * The sibling of `natureWordFor` (conquestDoctrineStage.js — the one MORAL ladder,
 * exported for exactly this reason). Before this mint the estate carried the ladder
 * TWICE: `natureWordFor` for morality, and a module-PRIVATE `lawfulnessBand` inside
 * `warSeatBooks.js` for law. Worse, the private copy emitted `chaotic|balanced|lawful`
 * while the two BUILT consumers of its output froze `lawless|balanced|lawful`:
 * `RANSOM_SEAT_LAWFULNESS` (ransomChoices.js) and `TESTIMONY_SEAT_LAWFULNESS`
 * (envoyTestimony.js). Those consumers normalize through `closedValue`, which returns
 * null for a non-member and then nulls the WHOLE ROW — so a wired producer-to-consumer
 * row would not have been mis-graded, it would have VANISHED. `envoyTestimony`'s
 * credibility-first arm already tested `court.lawfulnessBand === 'lawless'`, a value the
 * producer could not emit: a dead arm, shipped, latent only because nothing in src had
 * yet wired the two together. CR-ES-3 unified on the CONSUMER vocabulary.
 *
 * ⭐ WHY THIS IS ITS OWN NEUTRAL LEAF, AND NOT A MEMBER OF THE PROGRAM THAT NEEDED IT.
 * The ES-0 charter named `espionage/espionageDoctrine.js` as the mint site. Measured
 * against the live tree that is the wrong home, for the reason
 * tests/lint/couplingInclusion.walker.test.js states about its own two SP substrate
 * leaves, verbatim: they are "the shared band/severity/decay VOCABULARY every layer
 * spells against, not a port that owns a subject. Giving them a family would make every
 * layer's reading of a band word a cross-layer coupling, which is hosting by another
 * name." A law word is spelled by WAR (`warSeatBooks`), by INFORMATION (the espionage
 * doctrine), by GRAMMAR (the testimony and ransom consumer sets) and, on the queue, by
 * INTERIOR (INT-1). Homing it in an espionage module would have made `warSeatBooks`
 * import an INFO leaf to say the word "lawful" — a cross-layer coupling minted for a
 * four-line ladder. It lives here instead, beside `bandFamilies.js` and
 * `bandedStock.js`, on their argument and with their standing.
 *
 * ⚠ ZERO IMPORTS, DELIBERATELY. A shared vocabulary leaf that reaches for anything
 * re-parents every module that spells a band word into whatever it reached for.
 *
 * ⚠ THE EDGES ARE THE ESTATE'S, AND A PROGRAM MAY BRING ITS OWN — one vocabulary, one
 * function, an optional frozen edge pair. `LAW_WORD_EDGES` (0.67 / 0.33) is the DEFAULT
 * and is `natureWordFor`'s pair and the retired `lawfulnessBand`'s pair, to the digit:
 * CR-ES-3 is a VOCABULARY unification, and moving the war lane's band EDGES under cover
 * of a word change would be an undeclared behavioural shift on a frozen surface. The
 * espionage doctrine passes its own vetoable pair (J-ES-10) for its own read, which is
 * a local TUNING of one axis rather than a second spelling of it.
 *
 * PURE: no rng, no clock, no store, no world read.
 */

/**
 * The law ladder, codepoint-sorted. The totality-export discipline: a consumer proves
 * its coverage against THIS, never against a transcription of it.
 * @type {ReadonlyArray<string>}
 */
export const LAW_WORDS = Object.freeze(['balanced', 'lawful', 'lawless']);

/**
 * The ESTATE's law-band edges — `natureWordFor`'s pair, and the pair the retired
 * `warSeatBooks.lawfulnessBand` used. Changing these moves war-lane bands.
 */
export const LAW_WORD_EDGES = Object.freeze({ lawful: 0.67, lawless: 0.33 });

/**
 * The estate's one law-band word.
 *
 * TOTAL ON GARBAGE, AND `balanced` IS THE HONEST ANSWER FOR IT: `computeLawfulness`
 * documents EXACTLY 0.5 as "no signal", so an unreadable axis reads as the no-signal
 * rung rather than as a fourth word. This function NEVER returns `unknown` — the
 * alignment axes are total and finite, so an axis-side unknown would be vacuous, and
 * both frozen consumer sets would reject the word and drop the row anyway.
 *
 * @param {unknown} lawfulness01 0 lawless … 1 lawful-bureaucratic.
 * @param {{ lawful: number, lawless: number }} [edges] defaults to the estate pair.
 * @returns {'lawless'|'balanced'|'lawful'}
 */
export function lawWordFor(lawfulness01, edges = LAW_WORD_EDGES) {
  const value = Number(lawfulness01);
  if (!Number.isFinite(value)) return 'balanced';
  if (value >= edges.lawful) return 'lawful';
  if (value <= edges.lawless) return 'lawless';
  return 'balanced';
}
