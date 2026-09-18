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
 */
import { FS, serif_ } from '../theme.js';

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
 * A frozen band word as a rung-3 status value: 'STRONG' reads 'Strong', 'ACTIVE CRISIS'
 * reads 'Active crisis'.
 *
 * ⛔ THE WORDS ARE NOT TOUCHED, ONLY THE CASE, AND ONLY HERE. Several of these
 * vocabularies are frozen all-caps constants in `domain/display/*` that the PDF and the
 * public projection read as well (`defenseScoreBands.js` says of its own four: "the
 * frozen four; never extend"). Re-casing them at the source would change what those
 * other surfaces print; re-casing them at the one rung that renders them to a DM on
 * screen changes exactly what the ruling asked to change.
 *
 * Applied deliberately, never swept: an initialism ('NPC') would come back wrong, which
 * is why this is a named call at a known site and not a transform over every label.
 *
 * @param {unknown} word a band word from a frozen display vocabulary
 * @returns {unknown} the same word in sentence case, or the input unchanged
 */
export function statusCase(word) {
  if (typeof word !== 'string' || !word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
