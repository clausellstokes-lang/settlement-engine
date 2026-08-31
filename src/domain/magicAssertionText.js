/**
 * domain/magicAssertionText.js — THE ONE READING OF "does this text claim magic works?".
 *
 * These three constants were born inside `generators/generationContext.js`, where the
 * generation world law uses them to decide whether a generated line asserts functional
 * magic. MG-3h needed the identical reading one layer down — the arcane-identity detector's
 * name fallback must strip the SAME negations before it tests the SAME assertion vocabulary,
 * because two spellings of "this text claims magic" is precisely the drift the leak register
 * kept finding (L10-L12 are all one class: a second spelling of the magic gate).
 *
 * So the reading moved here, to a leaf src/domain can import, and generationContext now
 * re-exports it. NOTHING about the patterns changed in the move — the world law's answers
 * are byte-identical, which `tests/generators/generationWorldLaw.test.js` still pins.
 *
 * Pure; no imports; never throws.
 */

/**
 * The affirmative vocabulary. A line matching this claims magic FUNCTIONS — it is not a
 * list of fantasy-flavoured words, it is the set of claims a mundane world must not make.
 *
 * ── DEITY-LIVE-CHECK (ODQ §708.6): THE SUPERNATURAL EFFECT DOES NOT HAVE TO BE ARCANE ──
 * The list above was arcane-only, so a magic-free world shipped the sentence §708.6 quoted:
 * *"More advanced divine healing from senior clerics."* That is a claim that a supernatural
 * effect FUNCTIONS, and a world whose magic does not function must not make it — whatever
 * the claimed source.
 *
 * ⛔⛔ AND THE DOCTRINE DECIDES THE TOKENS, WHICH IS WHY THEY ARE PHRASES AND NOT WORDS.
 * THE DEITY DOCTRINE is constitutional here: faith is CULTURE, never theology. A temple, a
 * priest, a blessing for travellers, consecrated ground, a reliquary, an ecclesiastical
 * court and a claimed miracle all belong to a magic-free world — they are what a people
 * believes and how it organises around that belief. Adding `divine`, `bless`, `holy`,
 * `sacred`, `relic`, `cleric`, `consecrat*`, `saint` or `miracle` as bare words would delete
 * exactly those from every mundane world, which is the same violation TE-CH-6 cured one
 * field over when it took the six faith words out of `ARCANE_INST_KW`.
 *
 * ⚠ TWO WORDS WERE TRIED AND REFUSED BY MEASUREMENT, not by taste. `miracle` reaches
 * `historyData.js`'s *"A claimed miracle or relic drew pilgrims…"* and *"Someone is staging
 * miracles"* — belief and fraud, the two most doctrine-correct shapes a miracle can have.
 * `divination` reaches the charlatan rows that are AUTHORED mundane — *"'Divination' with no
 * magic in it, worked by Deception"* and *"Non-magical 'divination' using Deception"* — and
 * both survive `stripNegatedMagic` with the word intact, so a bare token would have convicted
 * two rows written specifically to prove magic is not needed.
 *
 * EVERY TOKEN BELOW HAS A LIVE RECEIPT in the shipped corpora — this vocabulary was derived
 * from the data, never invented:
 *   `divine healing`     — `institutionServices.js` "More advanced divine healing from senior
 *                          clerics." and "Basic divine healing. Closes cuts, reduces fever…"
 *                          (both escaped the arcane-only list; this is §708.6's own leak)
 *   `divine intervention`— "Treat common illnesses through divine intervention."
 *   `divine blessing`    — "Remove contamination from food and water through divine blessing."
 *                          and "Divine blessing for journeys, battles, or important
 *                          undertakings." Both are services of `Healer (divine, 1st level)`,
 *                          the row the estate has already ruled is a first-level SPELLCASTER
 *                          filed under faith rather than a cultural healer. ⚠ It does NOT
 *                          reach "Nature blessing", "Wayside blessing" or "Daily prayers,
 *                          blessings, and religious counsel" — measured, all three survive.
 *   `divine visions`     — moved here from `generationContext.js`'s secret-only local regex,
 *                          which was a SECOND spelling of this question living at one call
 *                          site (the L10-L12 class this module exists to end).
 *   `raise dead`         — "Resurrection services … Raise dead. Expensive, not guaranteed"
 *   `cure … wounds`      — ⚠⚠ RECEIPTLESS SINCE TE-AGNOSTIC-1 (ODQ §857). Its two receipts
 *                          were the Druid Circle's "Cure Wounds, Lesser Restoration…" and
 *                          the service NAME "Cure light wounds"; the setting-agnostic wave
 *                          spent both. The severity words remain ENUMERATED rather than
 *                          `\w+` so an apothecary that cures infected wounds is not
 *                          convicted by a wildcard.
 *   `lesser restoration` — ⚠⚠ RECEIPTLESS SINCE TE-AGNOSTIC-1 for the same reason. Both
 *                          rows still assert: the desc became "Wounds closed and sickness
 *                          lifted by magic." and asserts through `magic`, and the renamed
 *                          service `Wound closing` is gated on its NAME PLUS DESC, where
 *                          "Basic divine healing." carries `divine healing`. Measured, not
 *                          argued: 4,609 authored strings answer identically across the
 *                          rewrite, and the gate itself (generationContext.allowsService)
 *                          reads `name + desc`, never a name alone.
 *
 * ⛔⛔ SO THE HEADING'S CLAIM IS NOW NARROWER THAN IT READS, AND DELETING A RECEIPTLESS TOKEN
 * WOULD BE A REAL REGRESSION. This predicate does not only read THIS repo's corpus:
 * `customContent.js` and `arcaneIdentity.js` run it over USER-AUTHORED names and prose, which
 * no wave here controls, and a player writing "Lesser Restoration" on a custom institution is
 * exactly the claim a magic-free world must not make. A token whose corpus receipt a content
 * wave spends therefore stays; what must be re-derived is this LIST, not the pattern. Re-derive
 * by scanning the shipped corpora for each alternative, never by reasoning about which rows
 * "probably" still say it.
 *   `prophetic dreams`   — "Prophetic dreams … Divination through induced vision states" and
 *                          "Induce prophetic dream states. Visions are real…". The second
 *                          says the visions ARE REAL, which is the functional claim itself.
 */
export const MAGIC_ASSERTION_PATTERN =
  /\b(?:arcane|artificer|cantrips?|curses?|druid|enchant(?:ed|ing|ment)?|golems?|mage|magic|magical|necromanc(?:er|y|tic)|planar|runes?|scry(?:ing)?|sorcerer|spells?|teleport(?:ation)?|undead|warlock|witch|wizard|divine healing|divine intervention|divine blessing|divine visions?|raise(?:s|d)? dead|cure (?:light |moderate |serious |critical )?wounds|lesser restoration|prophetic dreams?)\b/i;

/**
 * Explicit denials of functional magic. These are clause-shaped instead of
 * deleting broad words such as "no" or "not": "no magic in it" is benign,
 * while "no ward stops the wizard" still retains its affirmative wizard claim.
 * The final certification receipt uses this same predicate as the producers.
 */
export const NEGATED_MAGIC_PATTERNS = Object.freeze([
  /\bnon[- ]magical\b/gi,
  /\bno\s+(?:actual\s+|real\s+|functional\s+)?magic(?:al)?(?:\s+(?:ability|compound|effect|ingredient|power|properties|quality|value)s?)?(?:\s+(?:in|to|within)\s+(?:it|them|this|the\s+[a-z'-]+))?\b/gi,
  /\bnothing\s+magical(?:\s+(?:here|about\s+(?:it|this)))?\b/gi,
  /\brather than (?:any\s+)?(?:actual\s+|real\s+|functional\s+)?magic\b/gi,
  /\bwhere the alchemist deals in magical compounds? and acid, this trade does not\b/gi,
  /\b(?:mere|only|purely)\s+stage magic\b/gi,
  /\bstage magic\b/gi,
]);

/**
 * Remove every explicit denial clause from a line, leaving whatever affirmative claim
 * survives. Exported because a classifier that reads names must strip the SAME denials
 * before it reads them — a faction described as "a non-magical college of letters" is a
 * college of letters.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function stripNegatedMagic(value) {
  let text = String(value || '');
  for (const pattern of NEGATED_MAGIC_PATTERNS) {
    text = text.replace(pattern, '');
  }
  return text;
}

/**
 * True when the text, once its denials are struck out, still claims magic functions.
 * @param {unknown} value
 * @returns {boolean}
 */
export function textAssertsFunctionalMagic(value) {
  return MAGIC_ASSERTION_PATTERN.test(stripNegatedMagic(value));
}
