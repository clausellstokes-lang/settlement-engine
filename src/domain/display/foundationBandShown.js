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
 * The law-and-order row reads `facts/lawBand.js :: lawBandOf` (ruling LB2), which holds its cap and its floor (BAR5-BAND,
 * ruling LB1); every place that prints or reads the row's band reads it through here: the Foundations (SubstrateTab.jsx),
 * the Outlook (`dossierViewModel.js :: outlookFactsOf`), the printed Campaign-State grid (`pdf/sections/SystemStateSnapshot.jsx`).
 * Pure: no draw, no write; the model's score does not move.
 */
import { deriveSupportingCapabilities } from './defenseDisplay.js';
import { tradeListsAsPrinted } from './tradeListDisplay.js'; // BAR3-LABELS-2 item 4: what the Economics tab prints as arriving

/** The row's scale, worst first (SubstrateTab.jsx's BAND_RANK). */
const RANK = Object.freeze({ collapsed: 0, critical: 1, strained: 2, adequate: 3, surplus: 4 });

/** @param {unknown} v @returns {Array<Record<string, unknown>>} */
function rows(v) {
  return (Array.isArray(v) ? v : v ? [v] : []).filter((x) => x && typeof x === 'object');
}

/**
 * The town's live tensions hold a crime wave: ONE exported reading, `facts/lawBand.js :: crimeWaveStands` (BAR6-CRIME (b)),
 * re-exported here under the name its readers import.
 */
export { crimeWaveStands } from '../facts/lawBand.js';

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
  if (key === 'criminal_opportunity') return crimeWaveStands(settlement) ? 'strained' : null; // law_order's cap: `facts/lawBand.js` (ruling LB2)
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
  if (key === 'trade_connectivity') return band === 'collapsed' && tradeArrivesOnPage(settlement) ? 'critical' : band;
  if (key === 'law_order') return lawBandOf(settlement) ?? band; // BAR5-SAFETY (ruling LB2): the law row's band has ONE home, `facts/lawBand.js`
  const cap = foundationCapOf(settlement, key);
  if (!cap || !Object.hasOwn(RANK, band)) return band;
  return RANK[/** @type {keyof typeof RANK} */ (band)] > RANK[cap] ? cap : band;
}

/**
 * TRADE THAT ARRIVES IS NOT COLLAPSED (BAR3-LABELS-2, the chair's direction 4 of 2026-11-15, REVIEW-BAR-3 C6511; vetoable
 * by the owner). "Trade connectivity: Collapsed", the bottom of the row's scale, printed beside an Imports list the
 * Economics tab prints as arriving and a River Toll that runs: the model's score sinks under many strained transit chains
 * (2 of the census's 720 at 8b45191a5, neither at war nor besieged; the read town was at war). Where the tab prints goods
 * arriving by trade (`tradeListDisplay.js :: tradeListsAsPrinted().imports`, empty where a siege has stopped trade, whose
 * row prints the siege's own word), the row reads at its next rung, "Critical", in its own scale (no new word).
 * @param {unknown} settlement @returns {boolean}
 */
export function tradeArrivesOnPage(settlement) {
  try {
    return tradeListsAsPrinted(/** @type {Parameters<typeof tradeListsAsPrinted>[0]} */ (settlement)).imports.length > 0;
  } catch { return false; }
}
import { crimeWaveStands, lawBandOf } from '../facts/lawBand.js'; // BAR5-SAFETY (ruling LB2): at the END, no line above moves; BAR6-CRIME: the crime wave's one reading

/**
 * A FOUNDATIONS ROW WHOSE BAND READS AN ABSENT, ALWAYS-WITHHELD KEY IS NOT PRINTED (VEIL-53's FAIL-CLOSED PAGES, the
 * chair's RULING V6 (b), vetoable by the owner). Three rows band a key every non-owner read withholds: "Criminal
 * opportunity" and "Law & order" read the black market's capture (`causalState.js :: deriveCriminalOpportunity`,
 * `deriveLawOrder`; the law row through `facts/lawBand.js`), "Defense readiness" the readiness score
 * (`deriveDefenseReadiness` through `defenseLedger.js`, which reads 50 where it is absent). Where the page does not hold
 * the key (`failClosedReads.js`), the row's band is read from nothing, so the row is NOT PRINTED: a label without its band
 * would be a new shape (an empty pill), and the tab already steps rows aside (`magicRowsGated`). The owner's record
 * carries both keys, so every row prints there as before. A condition's severity is NOT here: the page re-derives it
 * from the served band on every read (`pageRederive.js`, VR37), so it is never absent on the page.
 * @param {unknown} settlement @param {string} key the row's variable @returns {boolean}
 */
export function foundationRowWithheld(settlement, key) {
  if (key === 'criminal_opportunity' || key === 'law_order') return captureWithheld(settlement);
  if (key === 'defense_readiness') return readinessScoreWithheld(settlement);
  return false;
}
import { captureWithheld, readinessScoreWithheld } from './failClosedReads.js'; // VEIL-53 V6 (b): at the END, no line above moves
