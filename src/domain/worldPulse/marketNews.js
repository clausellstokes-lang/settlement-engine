/**
 * marketNews.js — THE FP-TRADE TR-3 GOVERNED KIND REGISTRY (believed markets: the wrong-market
 * arrival, the T-1 tellable).
 *
 * The WW-C split, copied from TR-1 and WF-8a: `marketReceiptPools.js` holds the annex-verbatim
 * corpus, THIS file holds the registry row, the eligibility declaration, the seeded picker and
 * the news-entry projector, and the dispatch composer (spatial/dispatchDestination.js) holds the
 * evidence. Nothing here decides that a caravan came to the wrong market; it voices evidence the
 * composer already returned, and a projector handed incomplete evidence answers null.
 *
 * THE ESTATE'S THIRTEENTH PHRASED-KIND REGISTRY FAMILY, AND ONE ROW. The TRADE
 * annex authors eight TR-3 kinds; this wave registers the one whose producer exists (the
 * composer's wrong-market evidence), and the other seven wait for theirs — the sequencing WF-8a
 * and ENC-4 recorded for their own one-row families, not a preference. Admitting a small family
 * is the reviewed act tests/helpers/kindRegistryRoster.js exists to force, and the SHRINK-BACK IS
 * A RECORDED OBLIGATION of the member that takes this family to five rows or more.
 *
 * L6's FIVE JOINS, all in the mint commit: the annex-verbatim pool (marketReceiptPools.js), this
 * registry row with its requiredSlots and a wholly slotless fallback, the WHAT_PHRASES phrase
 * (settlementRumors.js), the EXACT_SECTION row (heraldRouting.js: the trade desk), and the full
 * address chain on the projected entry below: the id, both settlement ids and names, the typed
 * action (`kind` and `impactKind` are this token), the recorded reason naming both bands, and the
 * audience. tests/lint/marketKindPools.walker.test.js is this family's own walker.
 *
 * ⛔ THE REASON NAMES BOTH BANDS AND COMBINES NEITHER. The belief that sent the caravan and the
 * glut it found are two words from two ladders, printed side by side (L5: every comparison in
 * words, one band per clause); no scalar reaches the reader.
 *
 * DETERMINISM. Selection is a keyed FNV-1a hash of the entry's own source id over the ELIGIBLE
 * pool, TR-1's picker verbatim in shape: no rng draw, no Date, no locale. The same world at the
 * same tick picks the same sentence forever.
 *
 * PURE: frozen data, one keyed hash, no store, no Date, no Math.random, no I/O.
 *
 * @enforced-by tests/lint/marketKindPools.walker.test.js
 */

import { commercialReaderText } from './commercialReasonsNews.js';
import { MARKET_RECEIPTS, MARKET_RECEIPT_SLOTS } from './marketReceiptPools.js';
import { fnv1a32 } from './proseSelection.js';
import { stablePart } from './stablePart.js';

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/**
 * @typedef {{kind:string, significance:'major'|'notable'|'routine', audience:'public'|'dm-only',
 *   section:'trade', pool:readonly ProseVariant[], requiredSlots:ReadonlyArray<readonly string[]>}}
 *   MarketRegistryEntry
 */

/** The T-1 token: the wrong-market arrival. ONE spelling, and every reader below takes it. */
export const WRONG_MARKET_ARRIVAL_KIND = 'market_wrong_market_arrival';

/**
 * @param {string} kind @param {'major'|'notable'|'routine'} significance
 * @param {'public'|'dm-only'} audience
 * @returns {Readonly<MarketRegistryEntry>}
 */
function marketKindRow(kind, significance, audience) {
  const pool = MARKET_RECEIPTS[kind];
  const slots = MARKET_RECEIPT_SLOTS[kind];
  if (!pool || !slots || pool.length !== slots.length) {
    throw new Error(`marketNews: ${kind} has no annex pool of matching arity`);
  }
  return Object.freeze({
    kind,
    significance,
    audience,
    section: /** @type {'trade'} */ ('trade'),
    pool,
    requiredSlots: Object.freeze(slots.map((entry) => Object.freeze([...entry]))),
  });
}

/**
 * The governed TR-3 rows. ONE today: the annex declares the beat notable, public, on the market
 * desk, which files at the trade desk.
 * @type {ReadonlyArray<Readonly<MarketRegistryEntry>>}
 */
export const MARKET_KIND_REGISTRY = Object.freeze([
  marketKindRow(WRONG_MARKET_ARRIVAL_KIND, 'notable', 'public'),
]);

/** The exact governed kind set. */
export const MARKET_KINDS = Object.freeze(MARKET_KIND_REGISTRY.map((row) => row.kind));

/** @type {ReadonlyMap<string, Readonly<MarketRegistryEntry>>} */
const KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<MarketRegistryEntry>]>} */ (
    MARKET_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * THE PRESENTATION WEIGHT: the trade desk's notable class, the same severity TR-1's notable
 * commercial kinds carry (commercialReasonsNews.js), so one desk ranks one class one way. Raw
 * authored, owner-signed at the tuning sitting; the feed derives the integer score from it.
 */
export const MARKET_NEWS_TUNING = Object.freeze({ notableSeverity: 0.45 });

/**
 * Pick one authored variant for `kind`, drawing ONLY from the variants whose slots the caller
 * supplied. Null when the kind is unknown or nothing is renderable: silence, never a hole.
 * @param {string} kind @param {string} seed the caller's deterministic key
 * @param {Record<string, string>} [interp]
 * @returns {{kind:string, line:string, familyId:string, templateIndex:number,
 *   significance:string, audience:string, section:string} | null}
 */
export function marketLine(kind, seed, interp = {}) {
  const row = KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const supplied = new Set(Object.keys(interp).filter((slot) => commercialReaderText(interp[slot])));
  /** @type {number[]} */
  const eligible = [];
  for (let index = 0; index < row.pool.length; index += 1) {
    if (row.requiredSlots[index].every((slot) => supplied.has(slot))) eligible.push(index);
  }
  if (eligible.length === 0) return null;
  const templateIndex = eligible[fnv1a32(String(seed)) % eligible.length];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  if (!line) return null;
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * THE T-1 NEWS ENTRY: one wrong-market arrival from the composer's evidence, addressed by the
 * news address law. Missing identity is silence: an arrival whose two towns cannot both be
 * named, or whose two bands are not both present, answers null and never renders a slug.
 * @param {{ arrival?: Record<string, unknown>, originName?: unknown, destinationName?: unknown,
 *   goodLabel?: unknown, tick?: number, now?: string | null }} input
 * @returns {Record<string, unknown> | null}
 */
export function wrongMarketArrivalNewsEntry({
  arrival = {}, originName, destinationName, goodLabel, tick = 0, now = null,
} = {}) {
  const originId = typeof arrival.originId === 'string' ? arrival.originId : '';
  const destinationId = typeof arrival.destinationId === 'string' ? arrival.destinationId : '';
  const settlement = commercialReaderText(originName);
  const counterpart = commercialReaderText(destinationName);
  const believedBand = commercialReaderText(arrival.believedBand);
  const foundBand = commercialReaderText(arrival.foundBand);
  if (!originId || !destinationId || !settlement || !counterpart || !believedBand || !foundBand) return null;
  const good = commercialReaderText(goodLabel);
  /** @type {Record<string, string>} */
  const interp = good ? { settlement, counterpart, good } : { settlement, counterpart };
  const at = Number.isFinite(tick) ? Math.max(0, Math.floor(tick)) : 0;
  const sourceEventId = [WRONG_MARKET_ARRIVAL_KIND, originId, destinationId, stablePart(good || 'goods'), at].join('.');
  const picked = marketLine(WRONG_MARKET_ARRIVAL_KIND, sourceEventId, interp);
  if (!picked) return null;
  const cargo = good || 'goods';
  const reason = `${settlement} sent its ${cargo} to ${counterpart} on word that it was ${believedBand} there; the caravan found the market in ${foundBand}.`;
  return {
    id: `wizard_news.${at}.${stablePart(WRONG_MARKET_ARRIVAL_KIND)}.${stablePart(sourceEventId)}`,
    tick: at,
    createdAt: now,
    scope: 'regional',
    significance: picked.significance,
    severity: MARKET_NEWS_TUNING.notableSeverity,
    headline: `${settlement} caravans reach ${counterpart} and find the market full`,
    summary: picked.line,
    kind: WRONG_MARKET_ARRIVAL_KIND,
    impactKind: WRONG_MARKET_ARRIVAL_KIND,
    channelType: null,
    settlementIds: [originId, destinationId],
    settlementNames: [settlement, counterpart],
    impactIds: [],
    channelIds: [],
    sourceEventId,
    tags: ['world_pulse', 'commerce', picked.section],
    reasons: [reason],
    familyId: picked.familyId,
    audience: picked.audience,
    section: picked.section,
  };
}
