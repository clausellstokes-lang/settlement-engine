/**
 * crisisPrint — the two print rules the crisis page obeys in BOTH exports (the PDF's Tonight
 * chapter, src/pdf/sections/CrisisSections.jsx, and the Foundry journal's crisis page,
 * src/foundry/journalPages.js), so the two cannot drift. Display only: the composer
 * (domain/crisis/crisisPage.js) and the record are untouched.
 */
/**
 * ⛔ THE STAKES ROWS, ONE ROW PER HOUSE (veto 3; STYLE-0 §3, approved STYLE-RULINGS §1(c)
 * 2026-11-07, applied by STYLE-RULINGS-2 B4 2026-11-09): every house the crisis has not touched printed
 * its own row with the same words ("{house}: split. not touched yet; it could side with either camp."),
 * four to six times on a town or city page. B4 named the untouched ones together in one sentence; the
 * owner vetoed that connective line (veto 3) and every house keeps its own row. tests/pdf/restoredSubsections.test.js
 * @param {Array<{ factionId: string, stake: string, reason: string }>} stakes
 * @returns {{ rows: Array<{ factionId: string, stake: string, reason: string }>, untouched: string | null }}
 */
export function stakeLines(stakes) {
  // THE OWNER'S VETO 3 (2026-11-09, "No." to the connective lines; the chair's ruling of 08:1x, applied by
  // STYLE-2-MERGE at SW-B4's point): the joined sentence for the untouched houses is struck and the prior
  // state returns — every house keeps its own row. The shape { rows, untouched } stays for both exports.
  return { rows: stakes, untouched: null };
}

/**
 * The crisis's "what the players see first" facts less the ones the Tonight sheet above already
 * printed word for word (B4: the two facts print once on the chapter).
 * @param {Array<{ id: string, label: string, text: string }>} seeFirst
 * @param {Array<{ id: string, text: string }>} printed
 */
export function unprintedFacts(seeFirst, printed) {
  return seeFirst.filter((f) => !(printed || []).some((p) => p.id === f.id && p.text === f.text));
}
