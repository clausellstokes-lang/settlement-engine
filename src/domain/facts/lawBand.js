/**
 * domain/facts/lawBand.js — THE LAW'S OWN STATE, ONCE (BAR5-SAFETY, LAW 2's `L2.law.collapsed` of BRIEF-BAR5; the audit's
 * C42116; the chair's ruling LB2 of 2026-11-16, vetoable by the owner). THE ONE HOME of the band the page prints on its
 * Foundations row, `Law & order · <band>`: the causal model's `law_order` band (`causalState.js :: deriveLawOrder`, read
 * off the FINISHED record: the governance and defence ledgers, the law's houses on the live roster, the black market, a
 * criminal power, the conditions in force, the patron's law axis) under the row's cap (where the live tensions hold a
 * crime wave the row prints at most `strained`: BAR3-LABELS L2, moved here from `display/foundationBandShown.js ::
 * foundationCapOf`, which keeps it for the criminal-opportunity row). The row reads THIS (`foundationBandShown.js`, its
 * `law_order` branch); any further rule on the row's band (the chair's LB1 floor, BAR5-BAND's) is written HERE.
 *
 * WHY HERE AND NOT AT THE DRAW. The safety profile is written at the economy step, before the powers, the defence ledger
 * and the conditions the stressors promote exist, so the generator cannot know the band its guard line will print beside.
 * Every line that says how a wrong is answered reads THIS fact where it prints (`display/guardLineUnderTheLaw.js`), and the
 * vocabulary's `law` band reads it too (`factVocabulary.js`), so the line and the row cannot part.
 *
 * NO DISPLAY IMPORT, ON PURPOSE: `factsOf` reads this leaf, and the Defense display reads `factsOf`; a display module
 * imported here would close an import cycle (`tests/architecture/layerBoundaries.test.js` freezes the cycle set).
 *
 * Pure: no draw, no clock, no write; the model's score does not move.
 */
import { bandForVariable } from '../causalState.js';
import { LAW_ORDER_RUNGS } from './factVocabulary.js';
import { canonStressors } from '../canonicalAccessors.js'; // BAR5-BAND LB1 (b): crisisKind.js's carrier (a), read eagerly (crisisKind is lazily pinned)
import { liveInstitutions } from '../institutions/institutionRoster.js'; // LB1 (a): the roster deriveLawOrder reads
import { institutionIsLawOrder } from '../institutionClassify.js';

/** The row's cap under a crime wave (BAR3-LABELS L2; the criminal-opportunity row keeps its own in `foundationBandShown.js`). */
const CRIME_WAVE_CAP = 'strained';

/** THE FLOOR of a quiet place (BAR5-BAND, the chair's ruling LB1 of 2026-11-16; vetoable by the owner). */
const QUIET_PLACE_FLOOR = 'strained';
/**
 * The Overview's Safety word is Moderate or better: the ladder's top three rungs, read off the label as
 * `display/labelBands.js :: safetyBandOf` reads it (the longest rung the label starts with, not run on into a letter).
 * Kept here because this leaf takes no display import; `tests/domain/bar5LawBandFloor.test.js` holds the two readings equal.
 */
const QUIET_SAFETY_WORD = /^(?:Very Safe|Safe|Moderate)(?![A-Za-z])/;

/**
 * THE CRIME WAVE, ONCE (BAR6-CRIME, LAW 9's `9a.wave` of BRIEF-BAR6 (b); vetoable by the owner): the town's live tensions
 * hold a crime wave (`history.currentTensions` type `crime_wave`; the History tab's and the crisis panel's own reading,
 * "Crime is rising faster than those in charge can answer it"). THE ONE EXPORTED READING: `display/foundationBandShown.js`
 * re-exports it under its old name, the row's cap above reads it, and every line that says crime is kept down reads it
 * through the vocabulary's `crime wave` atom (`factsOf(record).crimeWave`).
 * @param {unknown} record @returns {boolean}
 */
export function crimeWaveStands(record) {
  return crimeWaveTensions(record).length > 0;
}
const crimeWave = crimeWaveStands;

/** @param {unknown} record @returns {Array<{ type?: unknown, plotHooks?: unknown }>} */
function crimeWaveTensions(record) {
  const t = /** @type {{ history?: { currentTensions?: unknown } | null } | null} */ (record)?.history?.currentTensions;
  return /** @type {Array<{ type?: unknown, plotHooks?: unknown }>} */ ((Array.isArray(t) ? t : t ? [t] : [])
    .filter((x) => x && typeof x === 'object' && /** @type {{ type?: unknown }} */ (x).type === 'crime_wave'));
}

/** The crime-wave tension's own hook that says someone directs it (`historyData.js`, the `crime_wave` row's first hook). */
export const COORDINATED_WAVE_HOOK = /^The crime wave is coordinated\b/;

/**
 * THE HOOK KEEPS ITS TWIST (BAR6-CRIME, the chair's ruling HK1 of 2026-11-16; vetoable by the owner): the crime-wave tension
 * carries the hook "The crime wave is coordinated. Someone is directing it …" (every `crime_wave` row of `historyData.js`
 * draws it first). Where it stands, no line may say that nobody runs the crime: the diffuse lines speak of appearances.
 * @param {unknown} record @returns {boolean}
 */
export function crimeWaveCoordinated(record) {
  return crimeWaveTensions(record).some((t) => (Array.isArray(t.plotHooks) ? t.plotHooks : [])
    .some((h) => typeof h === 'string' && COORDINATED_WAVE_HOOK.test(h))); // the record stores each hook as its text
}

/**
 * The band the page prints for the law, lower-cased, or undefined where the model gives none.
 * @param {unknown} record the settlement
 * @returns {'collapsed'|'critical'|'strained'|'adequate'|'surplus'|undefined}
 */
export function lawBandOf(record) {
  if (!record || typeof record !== 'object') return undefined;
  const band = bandForVariable(/** @type {never} */ (record), 'law_order');
  const at = LAW_ORDER_RUNGS.indexOf(String(band));
  if (at < 0) return undefined;
  const capped = crimeWave(record) ? Math.min(at, LAW_ORDER_RUNGS.indexOf(CRIME_WAVE_CAP))
    : quietPlaceKeepsLaw(record) ? Math.max(at, LAW_ORDER_RUNGS.indexOf(QUIET_PLACE_FLOOR)) : at;
  return /** @type {'collapsed'|'critical'|'strained'|'adequate'|'surplus'} */ (LAW_ORDER_RUNGS[capped]);
}

/**
 * A QUIET PLACE'S LAW HAS NOT FAILED (BAR5-BAND, the chair's ruling LB1; the wide read's rows in bar0-hamlet-calm-rand-33,
 * -34, -36 and bar0-thorp-calm-rand-32). `deriveLawOrder` starts at 50 and a small place loses by construction (its
 * internal-security score, "no court and no watch", an elder council or a commune), so the row printed Critical or
 * Collapsed beside Safety "Moderate" with nothing wrong in the place. THE FLOOR, in the row's own scale (no new word):
 * where (a) the town keeps no office of the law (`institutionIsLawOrder` over the live roster, the reading `deriveLawOrder`
 * itself uses), (b) no crisis is in force (the stress container's typed entries: `crisisKind.js :: activeCrisisTypes`'s
 * carrier (a), read through `canonicalAccessors.js :: canonStressors` because crisisKind is lazily pinned and this leaf is
 * eager), (c) no crime wave stands and (d) the
 * page's own Safety word is Moderate or better, the band is at least `strained`. The model's score does not move.
 * @param {unknown} record @returns {boolean}
 */
export function quietPlaceKeepsLaw(record) {
  if (!record || typeof record !== 'object' || crimeWave(record)) return false;
  if (canonStressors(/** @type {never} */ (record)).some((e) => !!e && typeof e === 'object' && typeof /** @type {{ type?: unknown }} */ (e).type === 'string' && /** @type {{ type: string }} */ (e).type !== '')) return false;
  const label = /** @type {{ economicState?: { safetyProfile?: { safetyLabel?: unknown } } }} */ (record).economicState?.safetyProfile?.safetyLabel;
  if (typeof label !== 'string' || !QUIET_SAFETY_WORD.test(label.trim())) return false;
  return !liveInstitutions(/** @type {never} */ (record)).some((i) => institutionIsLawOrder(/** @type {{ catalogId?: string, name?: string }} */ (i)));
}

/**
 * The page prints `Law & order · Collapsed`: nobody answers a wrong.
 * @param {unknown} record @returns {boolean}
 */
export function lawCollapsedOf(record) {
  return lawBandOf(record) === 'collapsed';
}
