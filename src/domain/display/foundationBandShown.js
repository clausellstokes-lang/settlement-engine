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
 * THE FLOOR (BAR5-BAND, ruling LB1): the law-and-order row of a quiet place that keeps no office of the law prints at
 * least "strained" (`foundationFloorOf`). Every place that prints or reads the row's band reads it here: the Foundations
 * (SubstrateTab.jsx), the Outlook (`dossierViewModel.js :: outlookFactsOf`), the printed Campaign-State grid
 * (`pdf/sections/SystemStateSnapshot.jsx`).
 * Pure: no draw, no write; the model's score does not move.
 */
import { deriveSupportingCapabilities } from './defenseDisplay.js';
import { tradeListsAsPrinted } from './tradeListDisplay.js'; // BAR3-LABELS-2 item 4: what the Economics tab prints as arriving
import { safetyBandOf } from './labelBands.js'; // BAR5-BAND LB1: the Overview's Safety word
import { activeCrisisTypes } from '../facts/crisisKind.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { institutionIsLawOrder } from '../institutionClassify.js';

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
  if (!Object.hasOwn(RANK, band)) return band;
  const floor = foundationFloorOf(settlement, key);
  if (floor && RANK[/** @type {keyof typeof RANK} */ (band)] < RANK[floor]) return floor;
  if (!cap) return band;
  return RANK[/** @type {keyof typeof RANK} */ (band)] > RANK[cap] ? cap : band;
}

/**
 * A QUIET PLACE'S LAW HAS NOT FAILED (BAR5-BAND, the chair's ruling LB1 of 2026-11-16; vetoable by the owner; the wide
 * read's rows in bar0-hamlet-calm-rand-33, -34, -36 and bar0-thorp-calm-rand-32). `causalState.js :: deriveLawOrder`
 * starts at 50 and a small place loses by construction (its internal-security score, "no court and no watch", an elder
 * council or a commune), so "Law & order · Critical" or "· Collapsed" printed beside Safety "Moderate" with nothing wrong
 * in the place. THE FLOOR, beside the cap, in the row's own scale (no new word): where (a) the town keeps no office of
 * the law (`institutionIsLawOrder` over the live roster, the reading `deriveLawOrder` itself uses), (b) no crisis is in
 * force (`facts/crisisKind.js :: activeCrisisTypes`), (c) no crime wave stands (`crimeWaveStands`) and (d) the page's own
 * Safety word (the Overview's: `labelBands.js :: safetyBandOf`) is Moderate or better, the row prints at least
 * "strained". The model's score does not move. Pure: no draw, no write.
 * @param {unknown} settlement @returns {boolean}
 */
export function quietPlaceKeepsLaw(settlement) {
  if (activeCrisisTypes(/** @type {object} */ (settlement)).length > 0 || crimeWaveStands(settlement)) return false;
  const safety = safetyBandOf(/** @type {{ economicState?: { safetyProfile?: { safetyLabel?: string } } } | null} */ (settlement)?.economicState?.safetyProfile?.safetyLabel);
  if (!safety || !QUIET_SAFETY.has(safety)) return false;
  return !liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))
    .some((i) => institutionIsLawOrder(/** @type {{ catalogId?: string, name?: string }} */ (i)));
}

/** The Safety words that say daily life is safe enough (the ladder's top three: `compendium/bandLadders.js`). */
const QUIET_SAFETY = new Set(['Very Safe', 'Safe', 'Moderate']);

/**
 * The floor the record sets under a Foundations row, or null where it sets none.
 * @param {unknown} settlement @param {string} key the row's variable
 * @returns {'strained' | null}
 */
export function foundationFloorOf(settlement, key) {
  return key === 'law_order' && quietPlaceKeepsLaw(settlement) ? 'strained' : null;
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
import { lawBandOf } from '../facts/lawBand.js'; // BAR5-SAFETY (ruling LB2): at the END, no line above moves
