/**
 * crisisPrint — the two print rules the crisis page obeys in BOTH exports (the PDF's Tonight
 * chapter, src/pdf/sections/CrisisSections.jsx, and the Foundry journal's crisis page,
 * src/foundry/journalPages.js), so the two cannot drift. Display only: the composer
 * (domain/crisis/crisisPage.js) and the record are untouched.
 */
import { STAKE_REASONS } from '../../domain/crisis/crisisCast.js';

/**
 * ⛔ THE STAKES ROWS, ONE SENTENCE FOR ALL UNTOUCHED HOUSES (STYLE-0 §3, approved STYLE-RULINGS §1(c)
 * 2026-11-07, applied by STYLE-RULINGS-2 B4 2026-11-09): every house the crisis has not touched printed
 * its own row with the same words ("{house}: split. not touched yet; it could side with either camp."),
 * four to six times on a town or city page. The houses with a stake keep their rows; the untouched
 * ones are named together in one sentence, the same fact. tests/pdf/restoredSubsections.test.js (B4)
 * @param {Array<{ factionId: string, stake: string, reason: string }>} stakes
 * @returns {{ rows: typeof stakes, untouched: string | null }}
 */
export function stakeLines(stakes) {
  const isUntouched = (k) => k.reason === STAKE_REASONS.untouched;
  const names = stakes.filter(isUntouched).map((k) => k.factionId);
  const rows = stakes.filter((k) => !isUntouched(k));
  if (!names.length) return { rows, untouched: null };
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  const untouched = names.length === 1
    ? `${list} is not touched yet; it could side with either camp.`
    : `${list} are not touched yet; ${names.length === 2 ? 'either of them' : 'any of them'} could side with either camp.`;
  return { rows, untouched };
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
