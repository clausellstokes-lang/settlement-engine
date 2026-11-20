/**
 * domain/display/safetyShown.js — THE SAFETY LABEL AS THE PAGE PRINTS IT, AND, ON THE OWNER'S PAGE ONLY, WHAT IT COULD NOT
 * SEE (PAGE-1's SAFETY unit, F3a; BUILD.md §SAFETY of 2026-11-20, widened by the chair's ruling of 11:24 to both
 * directions; vetoable by the owner).
 *
 * TWO HONEST MEASURES, BOTH KEPT AS COMPUTED. The Overview's Safety label (`economicState.safetyProfile.safetyLabel`,
 * `generators/safetyProfile.js`) is the watch against the criminals, written at the economy step and held up by a size
 * or court floor in three calm towns of four. Foundations' Law & order (`facts/lawBand.js :: lawBandOf`, the row's one
 * home over `causalState.js :: deriveLawOrder`) adds the law's houses and the ruler's standing. They sit two or more steps
 * apart in 18% of towns (city 42%, metropolis 52%; PAGE-1 measure B, f3.out.txt §a), in either direction ("Moderate |
 * surplus" is the commonest pair). Neither is wrong, so neither moves: the owner's page says, in one line beside the
 * label, what the other measure holds, in the shape of `prosperityInCrisis.js`:
 *
 *     "Moderate day to day; the law is strong."
 *
 * WHAT THE LINE SAYS, each clause read from the record, none a new fact:
 *   (1) Law & order two or more steps from the label, either way: the law's own band in plain words (LAW_CLAUSE).
 *   (2) The ruling seat in criminal hands (`powerStructure.criminalCaptureState` 'corrupted' or 'capture', the rungs the
 *       Power tab prints "Partly in criminal hands" and "Run by the criminals") where the label reads Moderate or better.
 *   (3) A live crime wave (`facts/lawBand.js :: crimeWaveStands`, the History tab's "Crime is rising faster than those in
 *       charge can answer it") where the label reads Moderate or better.
 * The label is written before the powers and the tensions exist, so (2) and (3) are what it could not see.
 *
 * ⛔ THE AUDIENCE FAILS CLOSED. 'owner' is the one audience that gets a line; anything else (missing, 'reader', a typo)
 * reads the born label alone, BYTE FOR BYTE what every surface printed before this leaf, and the reader path reads no
 * field but the label: the capture rung is a DM fact the gallery veil strips (`galleryVeil.js`, `publicSafe.js`), and a
 * shared, public or player page must never learn it from this line. THIS IS A NEW SURFACE THAT READS CAPTURE.
 *
 * Pure: no store, no React, no rng, no write.
 */
import { safetyBandOf } from './labelBands.js';
import { statusCase } from './labelCase.js';
import { lawBandOf, crimeWaveStands } from '../facts/lawBand.js';

/** The two audiences. Only 'owner' is ever given a line. */
export const SAFETY_AUDIENCES = Object.freeze(/** @type {const} */ (['owner', 'reader']));

/**
 * The Safety band words on the 0..4 scale PAGE-1's measure B used (f3.out.txt, MAPS.SAFETY), which is the scale of the
 * law's own five bands (collapsed 0 .. surplus 4). Total over `labelBands.js :: SAFETY_BANDS` (the test holds it so).
 * @type {Readonly<Record<string, number>>}
 */
export const SAFETY_RUNG = Object.freeze({
  'Very Safe': 4, Safe: 3, Moderate: 2, Controlled: 2, Tense: 2, Quarantined: 2,
  Unsafe: 1, Strained: 1, Restricted: 1, Suspicious: 1, Dangerous: 0, Desperate: 0, Volatile: 0, Critical: 0,
});

/** The law's bands, lowest first (`facts/factVocabulary.js :: LAW_ORDER_RUNGS`, the row's own order). */
const LAW_RUNGS = Object.freeze(['collapsed', 'critical', 'strained', 'adequate', 'surplus']);

/** THE AUTHORED WORDS (PAGE-1's SAFETY builder, for the chair's read and the owner's veto): the law's band, said plainly. */
const LAW_CLAUSE = Object.freeze({
  collapsed: 'the law has broken down',
  critical: 'the law is weak',
  strained: 'the law is stretched but standing',
  adequate: 'the law holds',
  surplus: 'the law is strong',
});
/** The ruling seat's rungs that are in criminal hands (`people/hallCapture.js :: CAPTURE_LADDER`), in the Power tab's words. */
const SEAT_CLAUSE = Object.freeze(/** @type {Record<string, string>} */ ({
  corrupted: 'the ruling seat is partly in criminal hands',
  capture: 'the ruling seat is run by the criminals',
}));
/** The crime-wave tension's own reading (the History tab's and the crisis panel's). */
const WAVE_CLAUSE = 'crime is rising faster than those in charge can answer it';
/**
 * The steps apart at which the two measures need a word between them: two (BUILD.md §SAFETY), the distance from the law's
 * `strained` down to its `collapsed`, stated in the law's own ladder rather than as a dial.
 */
const APART = LAW_RUNGS.indexOf('strained') - LAW_RUNGS.indexOf('collapsed');
/** The label's lowest rung at which a hidden wrong is something it could not see: Moderate's (with Controlled, Tense, Quarantined). */
const SEEN_CALM = SAFETY_RUNG.Moderate;

/** @param {string[]} items @returns {string} "a", "a, and b", "a, b, and c" */
const listOf = (items) => (items.length < 2 ? items.join('')
  : items.length === 2 ? `${items[0]}, and ${items[1]}` : `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`);

/**
 * The page's audience from the two props every dossier tab already takes (OutputContainer.jsx: `publicDossier` is a
 * gallery or shared read with no owning save; `playerView` is the players' share). The owner's only where BOTH are
 * said and false, the same gate the DM-only Crisis tab uses.
 * @param {{ publicDossier?: unknown, playerView?: unknown } | null | undefined} props
 * @returns {'owner' | 'reader'}
 */
export function safetyAudienceOf(props) {
  return props?.publicDossier === false && props?.playerView === false ? 'owner' : 'reader';
}

/**
 * The owner's line from what it reads, or null where it has nothing to say. Pure over its four inputs.
 * @param {{ label?: unknown, lawBand?: unknown, capture?: unknown, crimeWave?: unknown }} read
 * @returns {string | null}
 */
export function safetyQualifierOf({ label, lawBand, capture, crimeWave }) {
  const band = safetyBandOf(typeof label === 'string' ? label : null);
  if (!band || !(band in SAFETY_RUNG)) return null;
  const rung = SAFETY_RUNG[band];
  const law = LAW_RUNGS.indexOf(/** @type {string} */ (lawBand));
  /** @type {string[]} */
  const clauses = [];
  if (law >= 0 && Math.abs(rung - law) >= APART) clauses.push(LAW_CLAUSE[/** @type {keyof typeof LAW_CLAUSE} */ (lawBand)]);
  if (rung >= SEEN_CALM && typeof capture === 'string' && SEAT_CLAUSE[capture]) clauses.push(SEAT_CLAUSE[capture]);
  if (rung >= SEEN_CALM && crimeWave === true) clauses.push(WAVE_CLAUSE);
  return clauses.length ? `${statusCase(band)} day to day; ${listOf(clauses)}.` : null;
}

/**
 * THE ONE READER every surface calls. `label` is the record's string (the Defense banner, the PDF and the Foundry pages
 * print it); `band` is the Overview tag's word (`safetyBandOf`, else the label, as it printed before). `qualifier` is the
 * owner's line or null, and always null for any audience but 'owner'.
 * @param {unknown} record the settlement
 * @param {unknown} [audience] 'owner' | 'reader'; missing or unknown is 'reader'
 * @returns {{ label: string | null, band: string | null, qualifier: string | null }}
 */
export function safetyShownOf(record, audience) {
  const raw = /** @type {{ economicState?: { safetyProfile?: { safetyLabel?: unknown } | null } | null } | null | undefined} */ (record)
    ?.economicState?.safetyProfile?.safetyLabel;
  const label = typeof raw === 'string' && raw ? raw : null;
  const band = label ? (safetyBandOf(label) ?? label) : null;
  if (audience !== 'owner' || !label) return { label, band, qualifier: null };
  const ps = /** @type {{ powerStructure?: { criminalCaptureState?: unknown } | null }} */ (record).powerStructure;
  return {
    label, band,
    qualifier: safetyQualifierOf({ label, lawBand: lawBandOf(record), capture: ps?.criminalCaptureState, crimeWave: crimeWaveStands(record) }),
  };
}

/**
 * The line led by the word it explains, for a page where it sits apart from its tile (the PDF's strips), as
 * `prosperityInCrisis.js :: prosperityInCrisisLed` leads its own. Null where there is no line.
 * @param {string | null | undefined} line @returns {string | null}
 */
export function safetyQualifierLed(line) {
  return line ? `Safety: ${line}` : null;
}
