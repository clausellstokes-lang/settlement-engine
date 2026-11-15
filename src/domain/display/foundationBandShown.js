/**
 * domain/display/foundationBandShown.js — A FOUNDATIONS ROW IS NOT PRINTED ABOVE WHAT THE SAME PAGE SAYS OF THE SAME
 * THING (BAR3-LABELS L2 and the healing row of L1, the chair's directions of 2026-11-15; vetoable by the owner;
 * REVIEW-BAR-3 C12975 C53812 C15810 C21298 C39624).
 *
 * The Foundations rows band the causal model's scores (`causalState.js`), which read the institutions and the conditions
 * but not the town's live tensions, its crisis text, or the defence's own medical row. So the rows printed:
 *   - "Healing capacity: Adequate" beside the defence's "Medical Readiness: None" ("No healer is kept here; the sick are
 *     tended by their own families"): 55 of the census's 720 at 59185b62a;
 *   - "Law & order: Surplus" or "Adequate" (121), and "Criminal opportunity: Contained" (34), beside the crime-wave
 *     tension's own words, "Crime is rising faster than those in charge can answer it";
 *   - "Labor capacity: Adequate" under a crisis whose summary says conscription has taken the working hands (3).
 * THE CAP, in the row's own scale (surplus > adequate > strained > critical > collapsed; no new word), as
 * `rulingAuthorityShown.js` caps its row: in each state above the row prints at most "strained" (for the lower-is-better
 * criminal opportunity, the word the ladder gives that band: "Elevated"). A band at or below the cap is left as it is.
 * Pure: no draw, no write; the model's score does not move.
 */
import { deriveSupportingCapabilities } from './defenseDisplay.js';

/** The row's scale, worst first (SubstrateTab.jsx's BAND_RANK). */
const RANK = Object.freeze({ collapsed: 0, critical: 1, strained: 2, adequate: 3, surplus: 4 });

/** @param {unknown} v @returns {Array<Record<string, unknown>>} */
function rows(v) {
  return (Array.isArray(v) ? v : v ? [v] : []).filter((x) => x && typeof x === 'object');
}

/**
 * The town's live tensions hold a crime wave (`history.currentTensions`, the History tab's and the crisis panel's own
 * reading: "Crime is rising faster than those in charge can answer it").
 * @param {unknown} settlement @returns {boolean}
 */
export function crimeWaveStands(settlement) {
  const t = /** @type {{ history?: { currentTensions?: unknown } | null } | null} */ (settlement)?.history?.currentTensions;
  return rows(t).some((x) => x.type === 'crime_wave');
}

/**
 * A crisis in force whose own summary (the text the Summary prints) says conscription has taken the working hands.
 * @param {unknown} settlement @returns {boolean}
 */
export function conscriptionTookHands(settlement) {
  return rows(/** @type {{ stress?: unknown } | null} */ (settlement)?.stress)
    .some((x) => typeof x.summary === 'string' && /\bconscription\b/i.test(x.summary));
}

/**
 * The defence's medical row reads None: no hospital, no healer, no clergy who live here (`defenseDisplay.js ::
 * deriveSupportingCapabilities`, the row the Defense tab prints; one home).
 * @param {unknown} settlement @returns {boolean}
 */
export function noHealingKept(settlement) {
  try {
    const row = (deriveSupportingCapabilities(/** @type {never} */ (settlement)) || []).find((r) => r?.label === 'Medical Readiness');
    return row?.status === 'None';
  } catch { return false; }
}

/**
 * The cap the record sets on a Foundations row, or null where it sets none.
 * @param {unknown} settlement @param {string} key the row's variable
 * @returns {'strained' | null}
 */
export function foundationCapOf(settlement, key) {
  if (key === 'healing_capacity') return noHealingKept(settlement) ? 'strained' : null;
  if (key === 'law_order' || key === 'criminal_opportunity') return crimeWaveStands(settlement) ? 'strained' : null;
  if (key === 'labor_capacity') return conscriptionTookHands(settlement) ? 'strained' : null;
  return null;
}

/**
 * THE ONE READER: the band a Foundations row prints for these rows. Both polarities are banded on one scale (the
 * lower-is-better rows on the inverted score, `causalState.js :: finalizeVariable`), so one cap serves both.
 * @param {unknown} settlement @param {string} key @param {string} band the model's band
 * @returns {string}
 */
export function foundationBandShown(settlement, key, band) {
  const cap = foundationCapOf(settlement, key);
  if (!cap || !Object.hasOwn(RANK, band)) return band;
  return RANK[/** @type {keyof typeof RANK} */ (band)] > RANK[cap] ? cap : band;
}
