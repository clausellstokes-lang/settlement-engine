/**
 * domain/display/guardLineUnderTheLaw.js — A LINE THAT SAYS HOW A WRONG IS ANSWERED READS THE LAW'S BAND (BAR5-SAFETY,
 * LAW 2's `L2.law.collapsed` of BRIEF-BAR5; the audit's C42116: 29 towns of the census's 720 and 13 of the fresh 300 at
 * 600b7683a; vetoable by the owner).
 *
 * The guard assessment's no-watch lines (`safetyProfile.js :: NO_WATCH_SMALL`, drawn on the watch alone: "A thief is
 * known by name within a day, and everyone shuns them until they make it right") and the court's line ("Thieves here know
 * that the court sits and the cells are real") say that a wrong is answered. They printed beside the Foundations row's
 * `Law & order · Collapsed`. The safety profile is written at the economy step, before anything the band reads, so the
 * draw cannot read it: each such line is DECLARED here (`law: > collapsed`, the band the page prints:
 * `facts/lawBand.js`) with its twin, and the guard assessment's one reader (`defenseDisplay.js ::
 * deriveGuardAssessment`, read by the Defense tab and the printed export alike) prints the twin where the page prints the
 * band Collapsed. The draw is not moved and the record is not written: the stored line stays as drawn, and a DM's own
 * line (an edited field) is never touched.
 *
 * Keyed by the printed text, as `SAFETY_LINE_SIBLINGS` is; enrolled in `scripts/lib/table-pools.mjs ::
 * DECLARATION_CHANNELS`. Pure: no draw, no clock, no write.
 */
import { lawBandOf } from '../facts/lawBand.js';
import { atomHolds } from '../facts/factVocabulary.js';

/** The atom every line of this table presumes: the page's `Law & order` band above Collapsed. */
export const LAW_ANSWERS_ATOM = 'law: > collapsed';

/**
 * One declared sibling set (the safety writer's `declaredSet` form): the original needs the atom; its twin excludes it.
 * @param {string} text @param {string} twin
 */
const declaredSet = (text, twin) => Object.freeze([
  Object.freeze({ text, needs: Object.freeze([LAW_ANSWERS_ATOM]) }),
  Object.freeze({ text: twin, twinOf: text, excludes: Object.freeze([LAW_ANSWERS_ATOM]) }),
]);

/** The twin of the court's lines where a court and a prison stand (`safetyProfile.js :: COURT_AND_PRISON`). */
const COURT_AND_PRISON_UNDER_COLLAPSE = ' A court and a prison stand, but few offenders are ever brought to either.';
/** The twin where a court stands and no prison (`safetyProfile.js :: COURT_NO_PRISON`). */
const COURT_ONLY_UNDER_COLLAPSE = ' A court stands, though few offenders are ever brought before it, and there is nowhere to hold them.';
/** The twin of the quarrel line, its plain and its violent telling alike (`safetyLineTruth.js :: quarrelUnderViolence`). */
const QUARREL_UNDER_COLLAPSE = 'Nobody here is paid to keep order. A quarrel no longer goes to the heads of the oldest families; it is settled by whoever is stronger.';

/**
 * THE LINES THAT SAY HOW A WRONG IS ANSWERED, and each one's twin true where the law has collapsed. Every original is a
 * line the safety writer prints whole (the no-watch lines) or as the guard assessment's tail (the court's lines, with their
 * leading space); `tests/domain/bar5SafetyLawBand.test.js` holds each to its source. The court's lines that only say what
 * stands ("A court exists, though there is nowhere to hold the guilty"; "The court can try a case …") are true in every band
 * and are not here.
 */
export const GUARD_LAW_SIBLINGS = Object.freeze({
  'There is no watch. The old families keep the peace, and anyone who breaks it answers to all the neighbours at once; when the families fall out among themselves, nobody keeps it.': declaredSet(
    'There is no watch. The old families keep the peace, and anyone who breaks it answers to all the neighbours at once; when the families fall out among themselves, nobody keeps it.',
    'There is no watch. The old families once kept the peace; they have fallen out among themselves, and nobody keeps it now.'),
  'There is no watch. When someone does wrong, the neighbours deal with it themselves, and the oldest families have the last word.': declaredSet(
    'There is no watch. When someone does wrong, the neighbours deal with it themselves, and the oldest families have the last word.',
    'There is no watch. When someone does wrong, nobody makes them answer for it, and the oldest families no longer have the last word.'),
  'Nobody here is paid to keep order. A quarrel goes to the heads of the oldest families, and most are settled before they come to blows.': declaredSet(
    'Nobody here is paid to keep order. A quarrel goes to the heads of the oldest families, and most are settled before they come to blows.',
    QUARREL_UNDER_COLLAPSE),
  'Nobody here is paid to keep order. A quarrel goes to the heads of the oldest families, though many come to blows first.': declaredSet(
    'Nobody here is paid to keep order. A quarrel goes to the heads of the oldest families, though many come to blows first.',
    QUARREL_UNDER_COLLAPSE),
  'There is no watch here. A thief is known by name within a day, and everyone shuns them until they make it right.': declaredSet(
    'There is no watch here. A thief is known by name within a day, and everyone shuns them until they make it right.',
    'There is no watch here. Everyone knows who the thieves are, and nobody can make them give anything back.'),
  ' A functioning court and prison mean crimes carry real consequences.': declaredSet(
    ' A functioning court and prison mean crimes carry real consequences.', COURT_AND_PRISON_UNDER_COLLAPSE),
  ' A wrong done here goes before the court, and the guilty can be locked up for it.': declaredSet(
    ' A wrong done here goes before the court, and the guilty can be locked up for it.', COURT_AND_PRISON_UNDER_COLLAPSE),
  ' Thieves here know that the court sits and the cells are real.': declaredSet(
    ' Thieves here know that the court sits and the cells are real.', COURT_AND_PRISON_UNDER_COLLAPSE),
});

/**
 * THE COURT'S LINES THAT NAME THE FORCE (`safetyProfile.js :: COURT_AND_PRISON(lawRef)[2]`, `COURT_NO_PRISON(lawRef)[2]`):
 * the same claim, the branch's force noun in its slot, so each is read by its frame (the force noun is the writer's own,
 * never this table's); each twin names no force.
 */
export const GUARD_LAW_FRAMES = Object.freeze([
  Object.freeze({ frame: / Offenders the [^.]+? catches are tried at the court and held in the prison\./, needs: Object.freeze([LAW_ANSWERS_ATOM]), twin: COURT_AND_PRISON_UNDER_COLLAPSE }),
  Object.freeze({ frame: / Offenders the [^.]+? catches go before the court; there is little room to hold them after\./, needs: Object.freeze([LAW_ANSWERS_ATOM]), twin: COURT_ONLY_UNDER_COLLAPSE }),
]);

/**
 * The guard line as the page prints it: each declared line it holds gives way to its twin where the record refuses the
 * line's atom (the page prints `Law & order · Collapsed`). A line with no declared part comes back by identity.
 * @param {string} text the stored guard assessment
 * @param {unknown} record the settlement
 * @returns {string}
 */
export function guardLineUnderTheLaw(text, record) {
  const held = Object.keys(GUARD_LAW_SIBLINGS).filter((k) => text.includes(k));
  const framed = GUARD_LAW_FRAMES.filter((f) => f.frame.test(text));
  if (!held.length && !framed.length) return text;
  if (atomHolds(LAW_ANSWERS_ATOM, { lawBand: lawBandOf(record) }) !== false) return text;
  let out = text;
  for (const k of held) {
    const twin = /** @type {Readonly<Record<string, ReadonlyArray<{ text: string, twinOf?: string }>>>} */ (GUARD_LAW_SIBLINGS)[k].find((l) => typeof l.twinOf === 'string');
    if (twin) out = out.split(k).join(twin.text);
  }
  for (const f of framed) out = out.replace(f.frame, f.twin);
  return out;
}
