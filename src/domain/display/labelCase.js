/**
 * domain/display/labelCase.js — THE CASE OF A RENDERED LABEL, FOR BOTH SURFACES.
 *
 * ── WHY THIS IS NOT IN `components/new/labelLadder.js` ───────────────────────────────
 * The three-rung ladder (review, 2026-09-18) was cut on screen first, and its two case
 * functions lived beside the rung they served. But `labelLadder.js` imports the SCREEN's
 * type scale (`FS`, `serif_` from `components/theme.js`) for the literary-title style, and
 * `src/pdf` may not reach into `src/components` — the paid document renders in its own
 * worker off its own theme. So the PDF could not call the very functions that decide what
 * a word looks like, and for one day the DM read "Strong" on screen and "STRONG" in the
 * document they paid for. Two surfaces, one model, two spellings of one word.
 *
 * The cure is the ordinary one: the pure part comes DOWN to the layer both surfaces
 * already share. `src/pdf` reads `domain/display/*` in a dozen places already
 * (`warStatus.js`, `humanizeEngineTokens.js`, `mobilizationStatus.js`, …), so this module
 * sits on an edge that exists rather than opening a new one. `labelLadder.js` re-exports
 * both names, so every screen call site is unchanged and the ladder's docblock remains the
 * place the rungs are explained.
 *
 * ⛔ WHAT STAYED BEHIND, AND WHY. `literaryTitle` / `LITERARY_TITLE` did NOT move. They are
 * not case functions at all: they are a STYLE OBJECT keyed to the screen's px type scale,
 * and the PDF's equivalent rung is its own serif at its own point sizes. Lifting them would
 * have carried a screen stylesheet into the shared layer to serve no second caller.
 *
 * ── THE LAW THESE TWO CARRY (unchanged by the move) ──────────────────────────────────
 * THE FROZEN BAND VOCABULARIES ARE RE-CASED AT THE RUNG THAT RENDERS THEM, NEVER AT THE
 * SOURCE. `defenseScoreBands.js` says of its four "the frozen four; never extend", and
 * `MILITARY_POSTURE` carries fifteen more; the public projection and the engine read those
 * same constants. Re-casing them where they are DECLARED would change what every other
 * reader prints. Re-casing them where a human reads them changes exactly what the ruling
 * asked to change — and nothing else.
 *
 * APPLIED DELIBERATELY, NEVER SWEPT: an initialism ('NPC') comes back wrong from a blind
 * transform, which is why these are named calls at known sites and not a regex over every
 * label.
 */

/**
 * A frozen band word as a rung-3 status value: 'STRONG' reads 'Strong', 'ACTIVE CRISIS'
 * reads 'Active crisis'.
 *
 * @param {unknown} word a band word from a frozen display vocabulary
 * @returns {unknown} the same word in sentence case, or the input unchanged
 */
export function statusCase(word) {
  if (typeof word !== 'string' || !word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * The estate's initialisms, for the one job sentence-casing cannot do by rule.
 * @type {Readonly<Record<string, string>>}
 */
const INITIALISMS = Object.freeze({ npc: 'NPC', npcs: 'NPCs', dm: 'DM', ai: 'AI', pdf: 'PDF' });

/**
 * A MACHINE TOKEN as a rung-2/3 value: 'blockade' reads 'Blockade', 'criminal_opportunity'
 * reads 'Criminal opportunity', 'npc' reads 'NPC'.
 *
 * ⛔ WHY THIS EXISTS BESIDE `statusCase`. Both sentence-case a word, and for most inputs
 * they agree. They differ on the one input that matters: a token vocabulary may contain an
 * INITIALISM, and `statusCase('npc')` is 'Npc'. That is exactly the failure the docblock
 * above warns about, which is why the swept case gets its own function rather than a caveat
 * nobody reads at the call site.
 *
 * THE REASON EITHER IS NEEDED (review, 2026-09-18): several pills rendered a raw engine
 * token and relied on `textTransform` to make it look like a word. 'attacking', 'surplus',
 * 'dear', 'defaulted' and 'blockade' all read as English in capitals and as debug output in
 * sentence case, so removing the transform exposed the token underneath. The token is still
 * the token — nothing is renamed, no `data-*` hook moves, and the machine vocabulary in
 * `data-band` and friends is untouched. Only the word the reader sees is cased.
 *
 * @param {unknown} token a machine token from a finite vocabulary
 * @returns {unknown} the same token as a displayable word, or the input unchanged
 */
export function tokenCase(token) {
  if (typeof token !== 'string' || !token) return token;
  // WORD-WISE, not whole-string. A whole-string guard only catches a token that IS an
  // initialism, so the moment one appears inside a phrase — 'NPC contacts', 'AI notes',
  // and every user-authored custom-content category that reaches an institution or
  // viability row — sentence case flattened it to 'Npc contacts'. Sentence-case first,
  // then lift each word the estate knows.
  return String(statusCase(token.replace(/_/g, ' ')))
    .replace(/[A-Za-z]+/g, (word) => INITIALISMS[word.toLowerCase()] || word);
}
