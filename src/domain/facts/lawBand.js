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

/** The row's cap under a crime wave (BAR3-LABELS L2; the criminal-opportunity row keeps its own in `foundationBandShown.js`). */
const CRIME_WAVE_CAP = 'strained';

/**
 * The live tensions hold a crime wave (`history.currentTensions`, the field `foundationBandShown.js :: crimeWaveStands` reads).
 * @param {unknown} record @returns {boolean}
 */
function crimeWave(record) {
  const t = /** @type {{ history?: { currentTensions?: unknown } | null } | null} */ (record)?.history?.currentTensions;
  return (Array.isArray(t) ? t : t ? [t] : []).some((x) => x && typeof x === 'object' && /** @type {{ type?: unknown }} */ (x).type === 'crime_wave');
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
  const capped = crimeWave(record) ? Math.min(at, LAW_ORDER_RUNGS.indexOf(CRIME_WAVE_CAP)) : at;
  return /** @type {'collapsed'|'critical'|'strained'|'adequate'|'surplus'} */ (LAW_ORDER_RUNGS[capped]);
}

/**
 * The page prints `Law & order · Collapsed`: nobody answers a wrong.
 * @param {unknown} record @returns {boolean}
 */
export function lawCollapsedOf(record) {
  return lawBandOf(record) === 'collapsed';
}
