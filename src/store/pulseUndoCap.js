/**
 * pulseUndoCap.js — THE REWIND'S REACH, IN ONE PLACE, REACHABLE FROM BOTH SIDES (U73; the
 * verifier's FIX-5; design §12's rewind and §12's registry page).
 *
 * ⛔ WHY IT IS A LEAF OF ITS OWN RATHER THAN A LINE IN THE ADVANCE SESSION. The number is
 * ONE fact with TWO readers: `campaignAdvanceSession.js`, which evicts past it, and the
 * decree registry page, which must tell the DM how far back a rewind reaches ("available
 * for the last ten advances of this session"). Lane C's U8 exported it from the advance
 * session so the page could stop parsing that file's source — and the page still could not
 * read it, because `EditModeShell.jsx` is mounted from `src/App.jsx` OUTSIDE every
 * campaignLazy boundary and a static edge from that mount into the advance session would
 * put every runtime-gated campaign action in its transitive graph.
 * `tests/store/campaignRuntimeCallerCoverage.test.js` derives those boundaries and convicts
 * exactly that, and it is right to: the edit register is the dossier's surface, not the
 * realm's, and it has no business arming the campaign runtime.
 *
 * So the fact moves DOWN to a leaf that both sides may reach and that reaches nothing
 * itself. THIS FILE IMPORTS NOTHING AND MUST GO ON IMPORTING NOTHING: its whole value is
 * that a UI module can name it without dragging a graph behind it. The advance session
 * re-exports it, so every reader that already imports the cap from there is untouched.
 *
 * ⛔ AND THE NUMBER LIVES HERE ONCE. Nothing else in `src/` may declare a second one — a
 * surface that advertises the cap reads this value, and the pin on that reading is the
 * registry page's own A7 arm plus the mount's M7.
 */

/**
 * How many advance snapshots one session retains for the rewind. Ten: far enough that a DM
 * can undo a mistaken advance several sittings into an evening, short enough that the stack
 * cannot grow without bound in a tab that is never reloaded. The eviction is oldest-first.
 */
export const PULSE_UNDO_CAP = 10;
