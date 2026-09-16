/**
 * domain/display/marketPrices.js — THE MARKET-MOVEMENT READ-MODEL
 * (Phase 5.5 round-21 Wave 7, rebuilt under the PRICE-HEURISTICS LAW,
 * ODQ §776: "we do not have absolute prices — the DM's mandate").
 *
 * A pure DISPLAY read-model that surfaces how the market has MOVED against the
 * settlement's own norm — never a coin figure. The owner's law (§776.1,
 * verbatim intent): no in-world economic surface ever states an ABSOLUTE price
 * or monetary value; surfaces speak relative heuristics only — "nearly double
 * its usual price", dear/cheap bands, a shade above or under. Final coin is the
 * DM's to set at the table, exactly as the finite-semantics constitution
 * intends. (The earlier form of this module derived "believable in-world coin"
 * — four silver the bushel — from class anchors × band multipliers; the coin
 * machinery is deleted, not hidden: the movement is now derived DIRECTLY from
 * the typed bands, with no numeric price substrate left to leak.)
 *
 * GENERATION IS SACRED (the M6d ruling, verbatim precedent): this is a LAZY
 * DISPLAY READ over `economicState` (the seeded trade profile) + the M6a
 * commodity BANDS (`commodityStocks`) + the M6d flow DRIFT — read-only, zero
 * engine feedback, zero persistence, zero eager bytes. Same-seed byte-identity
 * is preserved BY CONSTRUCTION: nothing here is ever written back.
 *
 * THE DERIVATION (deterministic, rng-free, and HONEST — every relative is a
 * derivation from the settlement's own state, never flavor):
 *   1. THE NORM is the settlement's own usual price for the good — the thing
 *      the M6a 'adequate' band means. It is never numbered; it is the anchor
 *      every movement phrase measures against.
 *   2. MOVEMENT from the M6a band (absent ⇒ adequate): shortage reads as
 *      'nearly double its usual price' (dear), surplus as 'a third under its
 *      usual price' (cheap) — the same magnitudes the old multipliers (×1.8,
 *      ×0.7) encoded, spoken instead of computed.
 *   3. DRIFT SHADE (optional) — the M6d flowDerivedDependency band shades a
 *      steady good one step ('a shade above/under its usual price') when the
 *      roads choke or run thick; a good already dear or cheap keeps its own
 *      class (a ±5% nudge never moved a quote a whole class in the old math,
 *      and a movement vocabulary should not either). Absent ⇒ nothing (the
 *      dormancy shape).
 *   4. The vocabulary is a CLOSED, TYPED enum (MOVEMENTS) — finite semantics;
 *      no free-text assembly, no digits, no coin words anywhere in the render.
 *
 * THE M6a BAND, READ LOCALLY. The per-good band is read straight off the
 * `commodityStocks` ledger with a LOCAL mirror of commodityFlow.js's band
 * thresholds — the EXACT newsVoice.js precedent (importing commodityFlow would
 * drag its embattlement / smuggle / dispatchEV / supplyShipments graph into
 * this lazy display chunk). The three mirrored constants are parity-pinned
 * test-side against COMMODITY_TUNING so a retune REDS instead of drifting.
 *
 * PLAYER-VISIBLE. Bands are public economy (no DM truth) — free/anon see the
 * same movements.
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; INERT-NOT-CRASH on
 * absent / garbage ledgers (an aspatial world reads from generation-time bands,
 * i.e. adequate, and never throws). Strict-clean; zero any-casts. Imported ONLY
 * by the lazy EconomicsTab chunk — NEVER by generation or the world-pulse
 * kernel (the SAME-SEED / GOLDEN laws), and no eager module may import it.
 */

import { getSpatialLedger } from '../spatial/distanceRead.js';
import { normalizeGood } from '../region/goodsCatalog.js';
import { compareCodepoint } from '../deterministicSort.js';

/** @typedef {'shortage'|'adequate'|'surplus'} Band */
/** @typedef {'near_double'|'shade_above'|'usual'|'shade_under'|'third_under'} Movement */

// ── THE MOVEMENT VOCABULARY — closed, typed, ordered dear → cheap. ────────────
// Every phrase measures against the settlement's OWN usual price (the norm the
// 'adequate' band defines), so a movement is always an honest derivation. No
// digits, no coin words — the register the §776 law mandates.
/** @type {Readonly<Record<Movement, string>>} */
export const MOVEMENTS = Object.freeze({
  near_double: 'nearly double its usual price',
  shade_above: 'a shade above its usual price',
  usual: 'its usual price',
  shade_under: 'a shade under its usual price',
  third_under: 'a third under its usual price',
});

// The dear→cheap ordering of the vocabulary — the monotonicity axis the tests
// pin (shortage must always read dearer than adequate, adequate than surplus).
/** @type {ReadonlyArray<Movement>} */
export const MOVEMENT_ORDER = Object.freeze(['near_double', 'shade_above', 'usual', 'shade_under', 'third_under']);

// ── The M6a band thresholds, MIRRORED from commodityFlow.js COMMODITY_TUNING
// (STOCKPILE_TARGET 8, SHORTAGE_FRAC 0.35, SURPLUS_FRAC 1.25). Local copies keep
// this a light leaf (the newsVoice fnv1a32 precedent). DRIFT-PROOFED test-side:
// tests/domain/marketPrices.test.js imports the canonical COMMODITY_TUNING and
// asserts these three EQUAL it, and sweeps commodityBandForGood against the real
// commodityBand() — so a future retune REDS the gate instead of silently
// drifting the movement bands. Exported for that pin only. ────────────────────
export const BAND_STOCKPILE_TARGET = 8;
export const BAND_SHORTAGE_FRAC = 0.35;
export const BAND_SURPLUS_FRAC = 1.25;

/** FNV-1a 32-bit — the pure crier-frame selector hash (no rng, no Date). A
 *  LOCAL copy of the 8-line helper (the newsVoice.js precedent — heavy modules
 *  are not imported into a lazy display leaf just to reach a hash).
 *  @param {string} str @returns {number} */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * A resolved catalog good (the fields this read-model consults).
 * @typedef {{ id: string, label: string, kind: string, category: string }} ResolvedGood
 */

/**
 * Resolve any trade label / good bag to a catalog GOOD (kind === 'good'), or
 * null for services / empties. Services are not cried in the market, so they
 * never move.
 * @param {unknown} value
 * @returns {ResolvedGood | null}
 */
export function resolveGood(value) {
  const g = normalizeGood(/** @type {import('../region/goodsCatalog.js').GoodInput} */ (value));
  if (!g || g.kind !== 'good') return null;
  return { id: String(g.id), label: String(g.label), kind: String(g.kind), category: String(g.category || 'other') };
}

/**
 * The M6a stock band for a (settlement, good), read off `commodityStocks`, or
 * null when the ledger / entry is absent (⇒ the caller reads 'adequate').
 * A local mirror of commodityFlow.js#commodityBand (see the module header).
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} settlementId @param {string} goodId
 * @returns {Band | null}
 */
export function commodityBandForGood(worldState, settlementId, goodId) {
  const ledger = asObject(getSpatialLedger(worldState, 'commodityStocks'));
  const bySettlement = asObject(ledger[String(settlementId)]);
  if (!(String(goodId) in bySettlement)) return null;
  const stock = Math.max(0, finiteNumber(bySettlement[String(goodId)], 0));
  if (stock < BAND_SHORTAGE_FRAC * BAND_STOCKPILE_TARGET) return 'shortage';
  if (stock > BAND_SURPLUS_FRAC * BAND_STOCKPILE_TARGET) return 'surplus';
  return 'adequate';
}

/**
 * The MOVEMENT for a (band, driftBand) pair — total over every input shape.
 * Shortage and surplus own their class regardless of drift (a road shade never
 * moved a quote a whole class); a steady good takes the drift's shade.
 * @param {Band | null | undefined} band
 * @param {Band | null | undefined} driftBand
 * @returns {Movement}
 */
export function movementFor(band, driftBand) {
  const b = band === 'shortage' || band === 'surplus' ? band : 'adequate';
  if (b === 'shortage') return 'near_double';
  if (b === 'surplus') return 'third_under';
  if (driftBand === 'shortage') return 'shade_above';
  if (driftBand === 'surplus') return 'shade_under';
  return 'usual';
}

/**
 * A single market movement — the typed movement, its spoken phrase, and the
 * band tag (dear / steady / cheap). No coin field exists on this shape.
 * @typedef {Object} MarketQuote
 * @property {string} id
 * @property {string} label
 * @property {Band} band
 * @property {Movement} movement
 * @property {string} phrase       the spoken movement ("nearly double its usual price")
 * @property {'dear'|'steady'|'cheap'} tag
 */

/** @param {Band} band @returns {'dear'|'steady'|'cheap'} */
function tagFor(band) {
  return band === 'shortage' ? 'dear' : band === 'surplus' ? 'cheap' : 'steady';
}

/**
 * Derive one good's market movement.
 * @param {Object} args
 * @param {ResolvedGood} args.good
 * @param {string} args.settlementId  (kept for signature stability; the movement
 *   itself is a pure function of the bands — nothing per-market is numbered)
 * @param {Band | null | undefined} [args.band]        the M6a band (absent ⇒ adequate)
 * @param {Band | null | undefined} [args.driftBand]   the M6d flow band (absent ⇒ no shade)
 * @returns {MarketQuote}
 */
export function deriveMarketQuote({ good, settlementId: _settlementId, band, driftBand }) {
  const useBand = /** @type {Band} */ (band === 'shortage' || band === 'surplus' ? band : 'adequate');
  const movement = movementFor(useBand, driftBand);
  return {
    id: good.id,
    label: good.label,
    band: useBand,
    movement,
    phrase: MOVEMENTS[movement],
    tag: tagFor(useBand),
  };
}

/** The causal receipt clause for a highlighted deviation — the "why". Sourced
 *  from the M6d flow band when it explains the good's band, else a generic
 *  seasonal reason. @param {'dear'|'cheap'} tag @param {Band | null | undefined} driftBand @returns {string} */
function causalReceipt(tag, driftBand) {
  if (tag === 'dear') {
    return driftBand === 'shortage' ? 'for the roads are cut' : 'for it comes scarce this season';
  }
  return driftBand === 'surplus' ? 'for the roads run thick with wagons' : 'for the season has been generous';
}

// ── The CRIER-LINE frame pools (content-vt-2, re-voiced for movements) ───────
// Each tag (dear/cheap) is a small pool of interchangeable frames; the FACTS —
// the good {label}, the spoken {phrase} movement, and the causal {receipt} —
// ride every frame unchanged (mirror-not-rederive), and only the crier's
// phrasing varies. Selection is a pure FNV of the good's id, so a given good is
// always cried the same way and different goods generally read differently.
// CANONICAL-AT-ZERO: index 0 of each pool is the pool's plainest line.
/** @type {Readonly<Record<'dear'|'cheap', ReadonlyArray<string>>>} */
export const CRIER_FRAMES = Object.freeze({
  dear: Object.freeze([
    '{label} runs {phrase}: dear, {receipt}.',
    '{label} is dear now, {phrase}, {receipt}.',
    "They're asking {phrase} for {label}: dear, {receipt}.",
    '{label} fetches {phrase} these days: dear, {receipt}.',
  ]),
  cheap: Object.freeze([
    '{label} runs {phrase}: cheap, {receipt}.',
    '{label} is cheap now, {phrase}, {receipt}.',
    "There's {label} going for {phrase}: cheap, {receipt}.",
    '{label} fetches {phrase} these days: cheap, {receipt}.',
  ]),
});

/** Fill a crier frame for a tag, seeded on the good id (index 0 when seedless).
 *  @param {'dear'|'cheap'} tag @param {string} seed
 *  @param {{ label: string, phrase: string, receipt: string }} slots @returns {string} */
function crierLineFor(tag, seed, { label, phrase, receipt }) {
  const pool = CRIER_FRAMES[tag];
  const frame = seed ? pool[fnv1a32(`${seed}::${tag}`) % pool.length] : pool[0];
  return frame.replace('{label}', label).replace('{phrase}', phrase).replace('{receipt}', receipt);
}

/**
 * The strongest-deviation "dear / cheap this season" highlight over a set of
 * quotes, or null when every good is steady. A shortage (dear) outranks a
 * surplus (cheap) for drama; ties break by codepoint id (every good in a class
 * carries the same movement, so the id is the whole residual order).
 * @param {MarketQuote[]} quotes @param {Band | null | undefined} driftBand
 * @returns {{ id: string, label: string, tag: 'dear'|'cheap', crierLine: string } | null}
 */
export function strongestDeviation(quotes, driftBand) {
  const dear = quotes.filter(q => q.tag === 'dear');
  const cheap = quotes.filter(q => q.tag === 'cheap');
  /** @type {MarketQuote | null} */
  let pick = null;
  if (dear.length) {
    pick = [...dear].sort((a, b) => compareCodepoint(a.id, b.id))[0];
  } else if (cheap.length) {
    pick = [...cheap].sort((a, b) => compareCodepoint(a.id, b.id))[0];
  }
  if (!pick) return null;
  const tag = /** @type {'dear'|'cheap'} */ (pick.tag);
  const receipt = causalReceipt(tag, driftBand);
  return {
    id: pick.id,
    label: pick.label,
    tag,
    crierLine: crierLineFor(tag, String(pick.id ?? ''), { label: pick.label, phrase: pick.phrase, receipt }),
  };
}

/**
 * The whole market-movements view model for a settlement. Resolves the seeded
 * exports / imports to catalog goods, reads each good's M6a band and the M6d
 * drift shade, and picks the one strongest deviation. INERT-NOT-CRASH: absent
 * economicState / worldState ⇒ an empty (present: false) model.
 *
 * @param {Object} args
 * @param {{ primaryExports?: unknown, primaryImports?: unknown } | null | undefined} args.economicState
 * @param {{ spatialLedgers?: unknown } | null | undefined} [args.worldState]
 * @param {unknown} args.settlementId
 * @param {{ band?: Band } | null | undefined} [args.flowDrift]  the M6d drift (its
 *   settlement-wide band shades every steady quote); absent ⇒ no shade.
 * @returns {{ present: boolean, exports: MarketQuote[], imports: MarketQuote[],
 *   highlight: { id: string, label: string, tag: 'dear'|'cheap', crierLine: string } | null }}
 */
export function deriveMarketPrices({ economicState, worldState = null, settlementId, flowDrift = null } = /** @type {never} */ ({})) {
  const empty = { present: false, exports: [], imports: [], highlight: null };
  if (settlementId == null) return empty;
  const sid = String(settlementId);
  const eco = economicState && typeof economicState === 'object' ? economicState : null;
  if (!eco) return empty;
  const driftBand = flowDrift && typeof flowDrift === 'object' ? flowDrift.band : null;

  /**
   * Resolve a seeded label list to movement quotes: goods only, deduped by id,
   * input order preserved (the generation "primary" ordering).
   * @param {unknown} labels @returns {MarketQuote[]}
   */
  const priceList = (labels) => {
    const list = Array.isArray(labels) ? labels : [];
    /** @type {MarketQuote[]} */
    const out = [];
    const seen = new Set();
    for (const label of list) {
      const good = resolveGood(label);
      if (!good || seen.has(good.id)) continue;
      seen.add(good.id);
      const band = commodityBandForGood(worldState, sid, good.id) || 'adequate';
      out.push(deriveMarketQuote({ good, settlementId: sid, band, driftBand }));
    }
    return out;
  };

  const exports = priceList(eco.primaryExports);
  const imports = priceList(eco.primaryImports);
  const highlight = strongestDeviation([...exports, ...imports], driftBand);
  return { present: exports.length > 0 || imports.length > 0, exports, imports, highlight };
}
