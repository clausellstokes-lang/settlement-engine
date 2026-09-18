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
