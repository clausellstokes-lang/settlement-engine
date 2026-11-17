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
  // BAR7-ORDER (LAW 9's 9a.order, C5430; vetoable by the owner): the siege's order clause (`safetyProfile.js`, the siege
  // branch's `milRef`, the head of a sentence of the SAFETY line, read by `safetyLineAsPrinted` through `SIEGE_ORDER_CLAUSES`).
  // Each subject keeps its own twin; a small place has no command and no streets (the profile's own rule), and the garrison
  // stands in small places too, so neither of their twins names the streets.
  'The garrison keeps order, and more harshly as the food runs down': declaredSet(
    'The garrison keeps order, and more harshly as the food runs down',
    'The garrison holds the defences, but order among the people has gone, and things get worse as the food runs down'),
  'Those holding the place keep order, and more harshly as the food runs down': declaredSet(
    'Those holding the place keep order, and more harshly as the food runs down',
    'Those holding the place see to its defence, but order among the people has gone, and things get worse as the food runs down'),
  'The military command has taken charge of the streets, and more harshly as the food runs down': declaredSet(
    'The military command has taken charge of the streets, and more harshly as the food runs down',
    'The military command holds the defences, but order in the streets has gone, and things get worse as the food runs down'),
});

/** BAR7-ORDER: the keys of `GUARD_LAW_SIBLINGS` that are the siege's order clause (the safety line's, not the guard line's). */
export const SIEGE_ORDER_CLAUSES = Object.freeze([
  'The garrison keeps order, and more harshly as the food runs down',
  'Those holding the place keep order, and more harshly as the food runs down',
  'The military command has taken charge of the streets, and more harshly as the food runs down',
]);

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
  return familiesUnheld(guardLineUnderTheBand(text, record), record); // BAR7-ORDER (low.hook-party): the party, after the band
}

/** @param {string} text @param {unknown} record @returns {string} */
function guardLineUnderTheBand(text, record) {
  const held = Object.keys(GUARD_LAW_SIBLINGS).filter((k) => text.includes(k));
  const framed = GUARD_LAW_FRAMES.filter((f) => f.frame.test(text));
  if (!held.length && !framed.length) return text;
  if (atomHolds(LAW_ANSWERS_ATOM, { lawBand: lawBandOf(record) }) !== false) return text;
  return twinsUnderCollapse(text, held, framed);
}

/**
 * Each declared line the text holds gives way to its twin (the band is Collapsed: the caller has read it).
 * @param {string} text @param {string[]} held keys of `GUARD_LAW_SIBLINGS` @param {typeof GUARD_LAW_FRAMES[number][]} framed
 * @returns {string}
 */
function twinsUnderCollapse(text, held, framed) {
  let out = text;
  for (const k of held) {
    const twin = /** @type {Readonly<Record<string, ReadonlyArray<{ text: string, twinOf?: string }>>>} */ (GUARD_LAW_SIBLINGS)[k].find((l) => typeof l.twinOf === 'string');
    if (twin) out = out.split(k).join(twin.text);
  }
  for (const f of framed) out = out.replace(f.frame, f.twin);
  return out;
}

// ─── BAR6-CRIME (BRIEF-BAR6 (a) (c) (d) (h); LAW 9's 9a.structure, 9a.contested, 9a.watch, 9a.militia, 9a.pay; LAW 6's 6d-paid;
// vetoable by the owner): the safety lines read the town's FINAL crime and force where they print. At the END: no line above
// moves. Each reader leaves the stored line as drawn (a DM's own line is the caller's to keep: `defenseDisplay.js`). ───
import { criminalStructureKeyOf } from '../facts/criminalStructureKey.js';
import { crimeWaveCoordinated } from '../facts/lawBand.js';
import { orderForceOf } from '../facts/orderForce.js';
import { rowMarkText } from './crisisStoppedRow.js';
import { lineText } from '../facts/drawDeclared.js';

/** The foothold clause the safety profile's Safe line draws (`safetyLineTruth.js :: footholdWord`). */
const FOOTHOLD = /organized crime has (a limited foothold|found no foothold)\./;
/** (a): the clause each crime key makes true (`criminalStructureKeyOf`, the key the Defense tab prints). */
const FOOTHOLD_BY_KEY = Object.freeze({
  organized: 'organized crime answers to one ring.',
  'semi-organized': 'organized crime has a limited foothold.',
  diffuse: 'organized crime has found no foothold.',
  none: 'organized crime has found no foothold.',
});
/** (c), the chair's HK1: beside the hook "The crime wave is coordinated", no line says nobody runs the crime: it speaks of appearances. */
const FOOTHOLD_COORDINATED = 'organized crime seems to have found no foothold, though someone may be directing the trouble.';

/** (d): the Safe line's "is present and responsive" for a militia alone (C199950: "musters when needed but cannot maintain consistent patrol"). */
const MILITIA_PRESENT = /The militia is present and responsive\./;
export const MILITIA_TURNS_OUT = lineText({ text: 'The militia turns out when called, but it keeps no regular patrol.', needs: ['militia'] });

/**
 * THE SAFETY LINE AS PRINTED (`safetyProfile.safetyDesc`, the Defense tab's public-order paragraph): the foothold clause
 * reads the crime structure's key and, where the crime wave is coordinated, speaks of appearances (HK1); a militia alone is
 * not "present and responsive" to routine crime.
 * @param {string} text the stored line @param {unknown} record the settlement @returns {string}
 */
export function safetyLineAsPrinted(text, record) {
  let out = String(text ?? '');
  const m = FOOTHOLD.exec(out);
  if (m) {
    const key = criminalStructureKeyOf(/** @type {never} */ (record)) ?? 'none';
    const clause = key !== 'organized' && key !== 'semi-organized' && crimeWaveCoordinated(record) ? FOOTHOLD_COORDINATED
      : FOOTHOLD_BY_KEY[/** @type {keyof typeof FOOTHOLD_BY_KEY} */ (key)] ?? m[0];
    out = out.replace(m[0], clause);
  }
  // the force's one reading (`orderForce.js`), not a word of the line, decides; a line without the claim is left as it is
  const f = orderForceOf(record);
  if (f.count.militia > 0 && f.count.garrison === 0 && f.count.watch === 0) out = out.replace(MILITIA_PRESENT, MILITIA_TURNS_OUT);
  // BAR7-ORDER (9a.order, C5430): the siege's order clause reads the band the page prints, as the guard line does
  const clauses = SIEGE_ORDER_CLAUSES.filter((k) => out.includes(k));
  if (clauses.length && atomHolds(LAW_ANSWERS_ATOM, { lawBand: lawBandOf(record) }) === false) out = twinsUnderCollapse(out, clauses, []);
  return out;
}

// ─── BAR7-ORDER (BRIEF-BAR7's BAR7-ORDER item 2, the audit's low.hook-party; vetoable by the owner): "the old families"
// name a party. Where no power, conflict, tension or crisis of the finished record names the families (the powers are drawn
// after the safety profile, so the draw cannot know), the no-watch line names no party: the neighbours keep the peace. The
// stored line and the table's key stay as drawn. ───

/** The words that name the families as a party on the record (the audit's own reading, `lowFamiliesI.mjs`). */
const FAMILIES_NAMED = /famil|noble|clan|elder/i;
/** The old families' lines (the drawn line, `GUARD_LAW_SIBLINGS`'s first key, and its twin under Collapsed) and their twins naming no party. */
const FAMILIES_UNHELD = Object.freeze([
  Object.freeze(['There is no watch. The old families keep the peace, and anyone who breaks it answers to all the neighbours at once; when the families fall out among themselves, nobody keeps it.',
    'There is no watch. The neighbours keep the peace, and anyone who breaks it answers to all of them at once; when they fall out among themselves, nobody keeps it.']),
  Object.freeze(['There is no watch. The old families once kept the peace; they have fallen out among themselves, and nobody keeps it now.',
    'There is no watch. The neighbours once kept the peace together; they have fallen out among themselves, and nobody keeps it now.']),
]);

/**
 * Whether the finished record holds the families as a party: a power's name, a conflict, a tension or a crisis names them.
 * @param {unknown} record @returns {boolean}
 */
function familiesHeldOf(record) {
  const r = /** @type {{ powerStructure?: { factions?: unknown[], recentConflict?: unknown }, conflicts?: unknown, history?: { currentTensions?: unknown }, stress?: unknown } | null | undefined} */ (record);
  const factions = Array.isArray(r?.powerStructure?.factions) ? r.powerStructure.factions : [];
  const held = JSON.stringify([factions.map((f) => /** @type {{ faction?: unknown } | null} */ (f)?.faction), r?.conflicts, r?.history?.currentTensions, r?.stress, r?.powerStructure?.recentConflict]);
  return FAMILIES_NAMED.test(held ?? '');
}

/** @param {string} text @param {unknown} record @returns {string} */
function familiesUnheld(text, record) {
  const hits = FAMILIES_UNHELD.filter(([line]) => text.includes(line));
  if (!hits.length || familiesHeldOf(record)) return text;
  let out = text;
  for (const [line, twin] of hits) out = out.split(line).join(twin);
  return out;
}

/** The diffuse structure's note (`defenseDisplay.js :: CRIM_STRUCTURE_DATA.diffuse`) and its twin beside a coordinated wave (HK1). */
export const DIFFUSE_NOTE_COORDINATED = 'Thieves, fences and bandits each seem to work for themselves; if there is a boss behind them, nobody has found one.';

/**
 * (c) HK1: the diffuse note where the crime-wave hook "is coordinated" stands. @param {string} note @param {unknown} record @returns {string}
 */
export function diffuseNoteAsPrinted(note, record) {
  return crimeWaveCoordinated(record) ? DIFFUSE_NOTE_COORDINATED : note;
}

/** (d) "exists on paper" with the pay or kit clause `paperTruth`, `rotaTruth` and `payTruth` may leave after it. */
const PAPER = /^The (.+?) exists? on paper\.(?: (Chronically underpaid and poorly equipped|Unpaid|Paid, but poorly equipped|Poorly equipped)(: these are volunteers with day jobs, not soldiers)?\.)?/;
/** (h) the well-paid claims (`payTruth`, `patrolTwin(…, true)`, `PAID_IN_FULL`) and each one's twin where the pay is being cut. */
const PAY_CUT_TWINS = Object.freeze([
  [/^The (.+?) (is|are) well paid, well equipped and (patrols?) properly\./, (/** @type {string[]} */ g) => `The ${g[1]} ${g[2]} well equipped and ${g[3]} properly, though the pay for keeping order is being cut.`],
  [/^The (.+?) (is|are) well paid and well equipped, but /, (/** @type {string[]} */ g) => `The ${g[1]} ${g[2]} well equipped, though short of pay, and `],
  [/^The (.+?) (is|are) disciplined, paid in full and properly equipped\./, (/** @type {string[]} */ g) => `The ${g[1]} ${g[2]} disciplined and properly equipped, though the pay for keeping order is being cut.`],
]);

/**
 * THE GUARD LINE READS THE FORCE THAT KEEPS ORDER (`facts/orderForce.js`): "exists on paper" only where every house of the
 * force carries a mark on the page (the card of a force that works prints none: C200637 C187260); a well-paid claim gives way
 * where a person under arms says the pay of those keeping order is cut (C51048).
 * @param {string} text @param {unknown} record @returns {string}
 */
export function guardLineUnderTheForce(text, record) {
  let out = String(text ?? '');
  const p = PAPER.exec(out);
  if (p) {
    const f = orderForceOf(record);
    const working = f.houses.some((h) => !rowMarkText(/** @type {never} */ (record), 'house', /** @type {never} */ (h)));
    if (f.kept && working) {
      const many = / and /.test(p[1]);
      const kit = p[2] ? `${/ and |,/.test(p[2]) ? ',' : ' and'} ${p[2].charAt(0).toLowerCase()}${p[2].slice(1)}` : '';
      out = `The ${p[1]} ${many ? 'are' : 'is'} thinly kept${kit}${p[3] || ''}.${out.slice(p[0].length)}`;
    }
  }
  if (orderForceOf(record).payCut) {
    for (const [re, to] of PAY_CUT_TWINS) {
      const g = /** @type {RegExp} */ (re).exec(out);
      if (g) { out = /** @type {(g: string[]) => string} */ (to)(g) + out.slice(g[0].length); break; }
    }
  }
  return out;
}

/** (d) 6d-paid: the funded reason (`structuralValidator.js :: FUNDED_EMBATTLED`) and its twins where nobody of the force is paid. */
export const FUNDED_EMBATTLED_SHOWN = lineText({ text: 'Embattled region. Fortification and forces are present and paid, but the pressure on them never lets up.', needs: ['force: paid'] });
export const FUNDED_EMBATTLED_VOLUNTEERS = lineText({ text: 'Embattled region. Fortification is kept and volunteers turn out, but the pressure on them never lets up.', needs: ['force: volunteers'] });
export const FUNDED_EMBATTLED_NO_FORCE = lineText({ text: 'Embattled region. Fortification is kept in repair, but the pressure on it never lets up.', excludes: ['force: kept'] });

/**
 * A defence vulnerability's reason as printed: "forces are present and paid" only where a paid force stands.
 * @param {string} reason @param {unknown} record @returns {string}
 */
export function fundingReasonAsPrinted(reason, record) {
  if (!String(reason).startsWith(FUNDED_EMBATTLED_SHOWN)) return reason;
  const f = orderForceOf(record);
  if (f.paid) return reason;
  return (f.kept ? FUNDED_EMBATTLED_VOLUNTEERS : FUNDED_EMBATTLED_NO_FORCE) + String(reason).slice(FUNDED_EMBATTLED_SHOWN.length);
}
