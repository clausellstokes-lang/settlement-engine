/**
 * components/new/labelLadder.js — THE DOSSIER'S THREE-RUNG LABEL LADDER.
 *
 * ── THE FINDING (review, 2026-09-18) ─────────────────────────────────────────────────
 * "Too many uppercase micro-labels competing on one screen." Measured on a forged
 * village's Power tab at 1440x900: TWENTY-EIGHT tracked-uppercase labels, at seven
 * different sizes between 9 and 11 px and five different trackings, all shouting at the
 * same volume — the card's own title, the name of a field, the value in that field, and
 * the prose heading that opens a paragraph. When everything is capitalised nothing is
 * emphasised, and the reader has no way to tell a section from a datum.
 *
 * ── THE LADDER ───────────────────────────────────────────────────────────────────────
 * Three rungs, and one thing that is not a rung at all.
 *
 *   RUNG 1 · THE SECTION EYEBROW — tracked uppercase, small, muted. ONE per card or
 *     section ("STATE AT A GLANCE", "TONIGHT AT THE TABLE", "INSTITUTIONS"). This rung
 *     is UNCHANGED by the ruling; the module names it so the next author can see what
 *     the capitals are reserved for, and so a second eyebrow on one card reads as the
 *     mistake it is.
 *
 *   RUNG 2 · THE FIELD LABEL — sentence case, muted, inline before its value ("The
 *     power", "Public legitimacy", "Prosperity"). It is the NAME of a fact, not a
 *     section, so it does not get the section's capitals.
 *
 *   RUNG 3 · THE STATUS VALUE — sentence case, in the pill or badge it already had
 *     ("Strong", "Critical", "Active crisis"). COLOUR AND WEIGHT CARRY THE MEANING
 *     HERE, not case: the shape, the tint and the accent are untouched, only the
 *     shouting stops.
 *
 *   NOT A RUNG · THE LITERARY SECTION TITLE — "The ground and the company it keeps",
 *     "Rule and succession", "Who runs this place?". These are prose headings, not
 *     chrome: they open a paragraph the desks wrote, so they are set in the SERIF the
 *     dossier's prose uses, in sentence case, one step above body prose, with no
 *     tracking at all. They should read "a story starts here", which is the one thing a
 *     9 px tracked capital cannot do.
 *
 * Provenance and meta tags ("seed · lf-033", "derived · npcs") are none of these: they
 * stay tiny and lowercase, as they already are. Tier chips ("HAMLET · POP. 130") and tab
 * labels are chrome rather than labels and keep their own voice.
 *
 * ── WHY THE TITLE STYLE IS AN OBJECT AND THE OTHER RUNGS ARE NOT ─────────────────────
 * Rungs 2 and 3 are already written at each call site with the size, colour, tint and
 * accent that site needs; the ruling takes ONE declaration away from them
 * (`textTransform`, and the tracking that existed only to serve it) and leaves the rest
 * alone, so a shared object there would be a rewrite pretending to be a fix. The
 * literary title is the opposite: every one of its sites is making the SAME four
 * typographic decisions, they were all making them identically in the wrong register,
 * and the next one written would copy whichever neighbour was nearest. That one belongs
 * in a named export.
 *
 * Zero imports beyond the token shim, and no React: the dossier's tab files all reach
 * this, and a heavier leaf would follow them into the first-paint closure.
 *
 * ── WHERE RUNGS 2 AND 3 ACTUALLY LIVE NOW (the PDF lane, 2026-09-18) ─────────────────
 * `statusCase` and `tokenCase` were lifted to `domain/display/labelCase.js` and are
 * RE-EXPORTED here, so every screen call site below and in the tabs is unchanged and this
 * docblock is still where the ladder is explained. They had to move because this file
 * imports the screen's type scale (`../theme.js`) for the literary title, `src/pdf` may not
 * reach into `src/components`, and the paid document was therefore still shouting the words
 * the screen had learned to speak. The style object stayed: it is keyed to the screen's px
 * scale and the PDF's rung is its own serif at its own point sizes.
 */
import { FS, serif_ } from '../theme.js';

export { statusCase, tokenCase, nameOrTokenCase } from '../../domain/display/labelCase.js';

/**
 * THE LITERARY SECTION TITLE. Spread it, then add the site's own colour and margin:
 *
 *   <div style={{ ...LITERARY_TITLE, color: swatch.inkMag, marginBottom: 5 }}>
 *
 * FS.lg is one step above the FS.md the dossier's prose blocks read at, so the title
 * out-ranks the paragraph it opens at every width. `letterSpacing: 'normal'` is written
 * rather than omitted because these sites are spread INTO an existing style object and
 * a stale tracking would otherwise survive the change.
 */
export const LITERARY_TITLE = Object.freeze({
  fontFamily: serif_,
  fontSize: FS.lg,
  fontWeight: 600,
  letterSpacing: 'normal',
  lineHeight: 1.3,
});

/**
 * The dossier's type steps, ascending. `literaryTitle` walks this to find "one step above".
 * @type {ReadonlyArray<number>}
 */
const STEPS = Object.freeze([7, 8, 9, 10, 11, 12, 13, 15, 17, 20, 24]);

/**
 * The literary title for a body of a GIVEN size — one step above it on the scale above.
 *
 * ⛔ WHY THIS IS A FUNCTION AND NOT JUST THE CONSTANT (review, 2026-09-18). The constant
 * below is one step above FS.md, the size the dossier's prose blocks read at, and that is
 * right wherever the body IS FS.md. It was spread over two bodies that are not: the quick
 * guide's defining truths read at FS.xs and its pressure line at FS.sm, so a 15 px title
 * stood four steps over an 11 px body and broke the very rule it was named for. A title
 * that does not know its body cannot be one step above it.
 *
 * @param {number} [bodySize] the size of the prose this title opens
 * @returns {import('react').CSSProperties}
 */
export function literaryTitle(bodySize = 13) {
  const next = STEPS.find((s) => s > bodySize);
  return { ...LITERARY_TITLE, fontSize: next === undefined ? bodySize : next };
}

/**
 * RUNGS 2 AND 3 — `statusCase` and `tokenCase` — ARE RE-EXPORTED AT THE TOP OF THIS FILE
 * from `domain/display/labelCase.js`, which is where their docblocks and the frozen-
 * vocabulary law now live. Import them from here or from there; they are the same two
 * functions, and the screen and the paid PDF both call them so that one word has one
 * spelling on both surfaces.
 *
 * `nameOrTokenCase` rides with them for the one field that holds a token OR a generated
 * NAME (the Plot Hooks card's source). It is not a fourth rung: it is rung 3 with the
 * proper names spared, and its docblock is beside the other two.
 */
