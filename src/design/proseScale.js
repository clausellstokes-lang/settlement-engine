/**
 * design/proseScale.js — THE PHONE PROSE FLOOR.
 *
 * Measured on a 375px phone (2026-09-18): the dossier's reading text — the NPC
 * card's wants, secrets and constraints, the quick guide's defining truths and
 * pressure, the table-night card bodies, Session mode's tells and hook bodies,
 * the Services tab's absence notes — sat at 10, 11, 12 and 13px. Those steps were
 * chosen against a wide screen, where a paragraph has 600px of measure and 12px
 * still scans; in a 343px column the same step is the size the reader has to
 * bring the phone closer for, and the dossier IS the read-at-the-table surface.
 *
 * The floor applies to PROSE and to nothing else. Labels, eyebrows, badges,
 * counts, chips and names keep their own scale: raising them would flatten the
 * hierarchy that makes the prose findable in the first place, and they are
 * glanced at rather than read.
 *
 * ⭐ AMENDED 2026-09-18 — CHROME HAS A FLOOR OF ITS OWN (chair ruling, recorded
 * owner-vetoable). "Keeps its own scale" was read as "is exempt", and the
 * whole-dossier sweep then had only two moves for a long piece of furniture:
 * leave it at 10px, or promote it to prose at 14px. Both are wrong. A chip whose
 * goods name runs to a line, and a role line under a name, are still read on a
 * 375px screen — but raising them to the prose step flattened them into the
 * sentences around them, and in one case made a 600-weight chip louder than its
 * 700-weight gold sibling beside it.
 *
 * So the phone carries TWO floors, and the difference between them IS the
 * hierarchy:
 *
 *   PROSE  >= 14px   a passage the reader reads
 *   CHROME >= 12px   a pill, a legend, a role or label line under a name
 *
 * ⚠ BOTH ARE FLOORS AND NEITHER IS A CAP. Chrome that already reads at 14px is
 * not pulled down to 12 — `chromeFontSize` is a max exactly as `proseFontSize`
 * is — so this amendment can only ever RAISE a phone size, never lower one, and
 * desktop stays the identity at both.
 *
 * ⛔ WHY THIS IS ITS OWN MODULE AND NOT AN EXPORT ON `hooks/useIsMobile.js`,
 * WHERE IT WOULD OTHERWISE BELONG. It lived there for one commit and broke four
 * tests instantly. Nineteen test files mock that module as
 * `vi.mock('.../useIsMobile.js', () => ({ default: () => flag }))` — a
 * DEFAULT-ONLY factory — and vitest throws on any named export such a factory
 * does not return. Every one of those files that renders a dossier component
 * would have had to learn about this helper, and the next one written would
 * break again. A zero-import leaf that nobody has a reason to mock ends the
 * class rather than paying it down nineteen times.
 *
 * Zero imports on purpose, for a second reason: dozens of components pull this
 * in, and importing the token module from here would drag it into every one of
 * their typecheck and bundle surfaces.
 */

/** The smallest a dossier prose paragraph may render below the mobile breakpoint (px). */
export const PHONE_PROSE_FLOOR = 14;

/**
 * A prose size for the width the reader is actually at. Pure, so a surface can
 * call it once per paragraph without a hook per call site, and so it can be
 * tested without a viewport.
 *
 * Takes the DESKTOP size (an FS token) rather than returning one size for
 * everything, so a surface keeps its own typographic steps wherever they already
 * clear the floor — the ladder is preserved, only its bottom rungs lift.
 *
 * @param {number} desktopSize the size this prose renders at on a wide screen
 * @param {boolean} mobile     the viewport flag, from `useIsMobile()`
 * @returns {number} the size to render at now
 */
export function proseFontSize(desktopSize, mobile) {
  if (!mobile) return desktopSize;
  return desktopSize < PHONE_PROSE_FLOOR ? PHONE_PROSE_FLOOR : desktopSize;
}

/** The smallest a dossier CHROME line may render below the mobile breakpoint (px). */
export const PHONE_CHROME_FLOOR = 12;

/**
 * A chrome size for the width the reader is actually at — the sibling of
 * `proseFontSize`, two steps lower, for the furniture the amendment above
 * describes: a pill, a legend, a role or label line beneath a name.
 *
 * ⚠ REACH FOR THIS ONLY WHERE THE LINE IS LONG ENOUGH TO BE READ. A nine-pixel
 * badge of four characters is glanced at and takes neither floor; raising every
 * badge in the dossier by three pixels would be the flattening this module
 * exists to prevent. The test that measures the floors uses the same bound —
 * forty-five characters of text — so what is asserted and what is applied are
 * the same set.
 *
 * @param {number} desktopSize the size this chrome renders at on a wide screen
 * @param {boolean} mobile     the viewport flag, from `useIsMobile()`
 * @returns {number} the size to render at now
 */
export function chromeFontSize(desktopSize, mobile) {
  if (!mobile) return desktopSize;
  return desktopSize < PHONE_CHROME_FLOOR ? PHONE_CHROME_FLOOR : desktopSize;
}
