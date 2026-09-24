/**
 * beliefScarcity.js — FP TR-3 BELIEVED MARKETS: THE BELIEF-SIDE READ of SP-B's scarcity
 * family (docs/DESIGN_FP_TRADE.md §3 Seam Three and §TR-3; docs/DESIGN_FP_ARCH_TR.md §4 TR-3;
 * the compiled block #25).
 *
 * WHAT IT ANSWERS. "How well supplied does this court BELIEVE that market is, in this class of
 * good?" One word off SP-B's closed ladder, or nothing. The family itself is SP-B's: the ground
 * truth, the fold arm and the conditional field on the belief record all landed with SP-B in
 * beliefAxisSubjects.js and beliefAxes.js, and they ride beliefMap.js's decay, forgetting and
 * infoMode gate. This leaf is the SIBLING the TR volume chartered so that beliefMap.js stays
 * net-zero (J-FP-4): it reads the record through beliefMap's one selector and never writes it.
 *
 * ⛔ BELIEF SIDE ONLY (Seam Three; L3). The import list is pinned to the belief family and the
 * goods catalog's closed class list: no stock, no need premium, no shipment, no commodity band.
 * Truth reaches what this leaf reads only through arrivals, rumour and plants, at news speed,
 * which is the existing belief machinery's business and not this file's. The ONE module that
 * reads this leaf beside a truth-side read is the dispatch composer
 * (spatial/dispatchDestination.js), whitelisted by name in tests/domain/believedMarketsTr3.test.js.
 *
 * ⛔ NOBODY IS EVER CURRENT, AND SILENCE IS NOT A BAND (K3). A court that has heard nothing of
 * the market, a family that is dark, a world whose beliefs are dormant (the omniscient mode) and
 * a self-read all answer `known: false` — never a midpoint, and never the truth backfilled.
 *
 * ⛔ THE LADDER IS SP-B'S AND NO WORD OF IT IS SPELLED HERE. Every rung below is read out of
 * `SCARCITY_BANDS` by position, so a renamed rung reds SP-B's own vocabulary walker instead of
 * this leaf quietly answering a word the family stopped meaning.
 *
 * PURE: no Date, no Math.random, no store, no mutation, zero draws.
 */

import { REGIONAL_GOOD_CATEGORIES, normalizeGood } from '../region/goodsCatalog.js';
import { subjectAxesActive } from './beliefAxes.js';
import { SCARCITY_BANDS } from './beliefAxisSubjects.js';
import { belief } from './beliefMap.js';

/**
 * The rungs a court reads as DEAR: the scarce half of SP-B's ascending-abundance ladder, read
 * out of the ladder by position.
 * @type {readonly string[]}
 */
export const BELIEVED_DEAR_BANDS = Object.freeze(SCARCITY_BANDS.slice(0, SCARCITY_BANDS.length / 2));

/**
 * @typedef {{ known: boolean, band: string | null }} BelievedScarcity
 */

/** The one answer for "no picture at all". @type {Readonly<BelievedScarcity>} */
const UNKNOWN = Object.freeze({ known: false, band: null });

/**
 * The believed-dearness RANK of a band, for ordering markets: the dearest rung first. A band the
 * court does not hold ranks beside the first rung that is not dear, because no word of dearness
 * is no pull: an unheard market is neither chased nor shunned.
 * @param {string | null | undefined} band @returns {number}
 */
export function believedDearnessRank(band) {
  const at = typeof band === 'string' ? SCARCITY_BANDS.indexOf(band) : -1;
  return at >= 0 ? at : BELIEVED_DEAR_BANDS.length;
}

/**
 * The good class SP-B keys a belief by, for one good (a catalog id or a label), or null when the
 * catalog cannot place it in its closed class list.
 * @param {unknown} good @returns {string | null}
 */
export function goodClassOf(good) {
  if (typeof good !== 'string' || !good) return null;
  const entry = normalizeGood(good);
  const category = entry ? String(entry.category) : '';
  return REGIONAL_GOOD_CATEGORIES.includes(category) ? category : null;
}

/**
 * A world as the belief family reads it, or null. A plain object is the only shape the family's
 * doors accept, so anything else answers "no picture" rather than a throw.
 * @param {unknown} worldState @returns {Parameters<typeof belief>[2]}
 */
function beliefWorldOf(worldState) {
  return worldState && typeof worldState === 'object' && !Array.isArray(worldState)
    ? /** @type {Parameters<typeof belief>[2]} */ (worldState)
    : null;
}

/**
 * THE READ. What `observerId` believes about `subjectId`'s plenty in `goodClass`, off the
 * observer's own belief record through beliefMap's one selector. The family's own door
 * (`beliefAxes.subjectAxesActive`) decides whether the family exists at all in this world.
 * @param {string} observerId @param {string} subjectId @param {string | null} goodClass
 * @param {unknown} worldState
 * @returns {Readonly<BelievedScarcity>}
 */
export function believedScarcityOf(observerId, subjectId, goodClass, worldState) {
  const world = beliefWorldOf(worldState);
  if (!goodClass || subjectAxesActive(world)?.scarcity !== true) return UNKNOWN;
  const read = belief(String(observerId), String(subjectId), world);
  if (read.source !== 'belief') return UNKNOWN;
  const bands = read.record.scarcityBands;
  const band = bands && typeof bands === 'object' ? bands[goodClass] : undefined;
  return typeof band === 'string' && SCARCITY_BANDS.includes(band)
    ? Object.freeze({ known: true, band })
    : UNKNOWN;
}
