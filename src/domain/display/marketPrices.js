/**
 * domain/display/marketPrices.js — THE MARKET-PRICE READ-MODEL
 * (Phase 5.5 round-21 Wave 7, "the market speaks in real coin").
 *
 * A pure DISPLAY read-model that surfaces believable in-world PRICES derived
 * from the live economy WITHOUT touching it. GENERATION IS SACRED (the M6d
 * ruling, verbatim precedent): prices are a LAZY DISPLAY READ over
 * `economicState` (the seeded trade profile) + the M6a commodity BANDS
 * (`commodityStocks`) + the M6d flow DRIFT — read-only, zero engine feedback
 * (prices never feed sim math — the endogeneity law), zero persistence, zero
 * eager bytes. No numeric prices exist in the engine BY DESIGN (M6a froze
 * that); this module is the fiction layer those qualitative bands always
 * intended. Same-seed byte-identity is preserved BY CONSTRUCTION: nothing here
 * is ever written back, so no golden can shift.
 *
 * THE DERIVATION (deterministic, rng-free):
 *   1. BASE PRICE per good — derived (never authored) from the goodsCatalog's
 *      classifying field (`category`, the catalog's bulk/rarity CLASS) via the
 *      documented BASE_PRICE_BY_CLASS table; an unknown class falls back to
 *      DEFAULT_BASE_COPPERS. Every catalog good resolves (the walker pin).
 *   2. SCARCITY MULTIPLIER from the M6a band (absent ⇒ adequate): shortage ×1.8,
 *      adequate ×1.0, surplus ×0.7. Band MONOTONICITY (shortage > adequate >
 *      surplus) is the load-bearing property and is pinned.
 *   3. LOCAL COLOR — a ±10% deterministic jitter via fnv1a32(`${sid}:${good}`):
 *      the newsVoice.js idiom, NO rng, so the same market always quotes the same
 *      price for the same world-state.
 *   4. DRIFT NUDGE (optional) — the M6d flowDerivedDependency band shades EVERY
 *      quote one step (±5%) when present (the roads choked ⇒ everything a touch
 *      dearer); absent ⇒ nothing (the dormancy shape).
 *   5. FORMATTER — `denominate()` renders coarse period coin ("four silver the
 *      bushel", "a copper the sack"), never a spreadsheet decimal. The raw
 *      coppers ride the tooltip only (the register rule).
 *
 * THE M6a BAND, READ LOCALLY. The per-good band is read straight off the
 * `commodityStocks` ledger with a LOCAL mirror of commodityFlow.js's band
 * thresholds — the EXACT newsVoice.js precedent (a local fnv1a32 copy rather
 * than importing the heavy conjunction module "which drags large content tables
 * into the news chunk"). Importing commodityFlow.js would drag its embattlement
 * / smuggle / dispatchEV / supplyShipments graph into this lazy display chunk;
 * the mirror keeps this a light leaf. The three mirrored constants
 * (STOCKPILE_TARGET / SHORTAGE_FRAC / SURPLUS_FRAC) are documented against their
 * COMMODITY_TUNING sources so a retune stays findable.
 *
 * PLAYER-VISIBLE. Bands are public economy (no DM truth), so prices need no
 * publicSafe scrub — free/anon see the same quotes.
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; INERT-NOT-CRASH on
 * absent / garbage ledgers (an aspatial world prices from generation-time bands,
 * i.e. adequate, and never throws). Strict-clean; zero any-casts. Imported ONLY
 * by the lazy EconomicsTab chunk — NEVER by generation or the world-pulse kernel
 * (the SAME-SEED / GOLDEN laws), and no eager module may import it.
 */

import { getSpatialLedger } from '../spatial/distanceRead.js';
import { normalizeGood } from '../region/goodsCatalog.js';
import { compareCodepoint } from '../deterministicSort.js';
import { formatCount } from '../formatNumber.js';

/** @typedef {'shortage'|'adequate'|'surplus'} Band */

// ── Coin system (D&D 5e): 1 gold = 100 copper, 1 silver = 10 copper ───────────
export const COIN = Object.freeze({ GOLD: 100, SILVER: 10, COPPER: 1 });

// ── BASE PRICE, in COPPERS per unit, keyed by the catalog CLASS (`category`) ──
// The catalog's `category` is its bulk/rarity class; these anchors are chosen so
// a staple bushel reads in single silver and a luxury in gold. Retunable; the
// only pinned property is that every catalog good resolves to a finite positive
// base (see DEFAULT_BASE_COPPERS + the walker pin). NB: the food anchor (24) is
// calibrated so grain at the shortage band (×1.8) lands near "four silver" — the
// design's flagship crier line.
export const BASE_PRICE_BY_CLASS = Object.freeze({
  food: 24,
  raw_material: 40,
  fuel: 20,
  finished_good: 120,
  luxury: 700,
  service: 200,
  arcane: 900,
  military: 260,
  transport: 160,
  other: 55,
});

// The floor for an unrecognized class (a future category, or a malformed entry).
export const DEFAULT_BASE_COPPERS = 55;

// ── SCARCITY MULTIPLIER per M6a band. MONOTONE by construction (pinned). ──────
export const SCARCITY_MULTIPLIER = Object.freeze({ shortage: 1.8, adequate: 1.0, surplus: 0.7 });

// ── DRIFT NUDGE per M6d flow band: the roads' live throughput shades every
// quote one step. adequate / absent ⇒ 1.0 (dormancy). ─────────────────────────
export const DRIFT_STEP = 0.05;
export const DRIFT_NUDGE = Object.freeze({ shortage: 1 + DRIFT_STEP, adequate: 1.0, surplus: 1 - DRIFT_STEP });

// ── LOCAL COLOR — the ±10% per-market jitter range. ───────────────────────────
export const LOCAL_COLOR_RANGE = 0.10;

// ── The M6a band thresholds, MIRRORED from commodityFlow.js COMMODITY_TUNING
// (STOCKPILE_TARGET 8, SHORTAGE_FRAC 0.35, SURPLUS_FRAC 1.25). Local copies keep
// this a light leaf (the newsVoice fnv1a32 precedent — importing commodityFlow
// would drag its embattlement/smuggle/dispatchEV graph into this lazy display
// chunk). DRIFT-PROOFED test-side (the parity-proof pattern, kernel-clamp/slugify
// precedent): tests/domain/marketPrices.test.js imports the canonical
// COMMODITY_TUNING and asserts these three EQUAL it, and sweeps
// commodityBandForGood against the real commodityBand() — so a future retune
// REDS the gate instead of silently drifting the price bands. Exported for that
// pin only; no runtime consumer reads them off the module surface. ─────────────
export const BAND_STOCKPILE_TARGET = 8;
export const BAND_SHORTAGE_FRAC = 0.35;
export const BAND_SURPLUS_FRAC = 1.25;

// ── UNIT vocabulary — what the crier prices the good BY. Specific per good,
// with a per-class fallback so custom / unknown goods still get a unit word. ───
/** @type {Readonly<Record<string, string>>} */
const UNIT_BY_GOOD = Object.freeze({
  grain: 'bushel', flour: 'sack', fish: 'barrel', livestock: 'head',
  provisions: 'cask', salt: 'measure', timber: 'load', stone: 'block',
  clay: 'batch', iron: 'bar', fuel: 'load', textiles: 'bolt',
  leather: 'hide', arms: 'piece', luxury_goods: 'piece', furs: 'pelt',
  raw_materials: 'load', arcane_reagents: 'dram', alchemical_goods: 'vial',
});
/** @type {Readonly<Record<string, string>>} */
const UNIT_BY_CLASS = Object.freeze({
  food: 'measure', raw_material: 'load', fuel: 'load', finished_good: 'piece',
  luxury: 'piece', service: 'service', arcane: 'dram', military: 'piece',
  transport: 'load', other: 'lot',
});
const DEFAULT_UNIT = 'lot';

// ── Number words for the crier's coarse count (1..12; larger falls to digits). ─
/** @type {ReadonlyArray<string>} */
const NUMBER_WORDS = Object.freeze([
  'zero', 'a', 'two', 'three', 'four', 'five', 'six',
  'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
]);

/** FNV-1a 32-bit — the pure jitter hash (no rng, no Date). A LOCAL copy of the
 *  8-line helper (the newsVoice.js precedent — heavy modules are not imported
 *  into a lazy display leaf just to reach a hash).
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
 * null for services / empties. Services are not cried by the bushel, so they
 * never price.
 * @param {unknown} value
 * @returns {ResolvedGood | null}
 */
export function resolveGood(value) {
  const g = normalizeGood(/** @type {import('../region/goodsCatalog.js').GoodInput} */ (value));
  if (!g || g.kind !== 'good') return null;
  return { id: String(g.id), label: String(g.label), kind: String(g.kind), category: String(g.category || 'other') };
}

/**
 * BASE PRICE in coppers for a good, derived from its catalog CLASS (`category`).
 * Total: an unknown / missing class falls back to DEFAULT_BASE_COPPERS, so every
 * good — catalog or custom — resolves to a finite positive base.
 * @param {ResolvedGood | { category?: string } | string | null | undefined} goodOrClass
 * @returns {number} integer coppers ≥ 1
 */
export function basePriceFor(goodOrClass) {
  const cls = typeof goodOrClass === 'string'
    ? goodOrClass
    : String((goodOrClass && goodOrClass.category) || 'other');
  const table = /** @type {Record<string, number>} */ (BASE_PRICE_BY_CLASS);
  const base = finiteNumber(table[cls], DEFAULT_BASE_COPPERS);
  return Math.max(1, Math.round(base > 0 ? base : DEFAULT_BASE_COPPERS));
}

/** The crier's unit word for a good. @param {ResolvedGood} good @returns {string} */
export function unitFor(good) {
  return UNIT_BY_GOOD[good.id]
    || /** @type {Record<string, string>} */ (UNIT_BY_CLASS)[good.category]
    || DEFAULT_UNIT;
}

/**
 * The ±LOCAL_COLOR_RANGE deterministic jitter multiplier for one (settlement,
 * good): a pure fnv1a32 of the composite key, mapped to [1 − range, 1 + range].
 * @param {string} settlementId @param {string} goodId @returns {number}
 */
function localColor(settlementId, goodId) {
  const h = fnv1a32(`${settlementId}:${goodId}`);
  const frac = (h % 1000) / 999; // [0, 1]
  return 1 + (frac * 2 - 1) * LOCAL_COLOR_RANGE;
}

/**
 * The M6a stock band for a (settlement, good), read off `commodityStocks`, or
 * null when the ledger / entry is absent (⇒ the caller prices at 'adequate').
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
 * A single market quote — the coarse spoken price plus the raw coppers (tooltip)
 * and the band tag (dear / steady / cheap).
 * @typedef {Object} MarketQuote
 * @property {string} id
 * @property {string} label
 * @property {string} unit
 * @property {number} coppers      the raw integer price (tooltip only)
 * @property {string} spoken       the coarse period-coin phrase ("four silver")
 * @property {string} priced       "<spoken> the <unit>" (the market-crier quote)
 * @property {Band} band
 * @property {'dear'|'steady'|'cheap'} tag
 * @property {string} raw          "<coppers> cp" (the spreadsheet tooltip)
 */

/** @param {Band} band @returns {'dear'|'steady'|'cheap'} */
function tagFor(band) {
  return band === 'shortage' ? 'dear' : band === 'surplus' ? 'cheap' : 'steady';
}

/**
 * Render coarse period coin from raw coppers — the dominant coin, snapped to the
 * nearest half with vulgar-fraction words ("four silver", "a copper", "half a
 * silver", "two gold and a half"). NEVER a bare decimal (the register guard). A
 * count above twelve falls to grouped digits ("15 gold") — still no decimal.
 * @param {number} coppers @returns {string}
 */
export function denominate(coppers) {
  const cp = Math.max(1, Math.round(finiteNumber(coppers, 1)));
  const [coin, divisor] = cp >= COIN.GOLD ? ['gold', COIN.GOLD]
    : cp >= COIN.SILVER ? ['silver', COIN.SILVER]
    : ['copper', COIN.COPPER];
  // Snap the scaled value to the nearest half — a crier's coarse quote.
  const halves = Math.max(1, Math.round((cp / divisor) * 2));
  const whole = Math.floor(halves / 2);
  const hasHalf = halves % 2 === 1;
  const countWord = whole >= 1 && whole < NUMBER_WORDS.length ? NUMBER_WORDS[whole] : formatCount(whole);

  if (whole >= 1 && hasHalf) return `${countWord} ${coin} and a half`;
  if (whole >= 1) return `${countWord} ${coin}`;
  if (hasHalf) return `half a ${coin}`;
  return `a ${coin}`; // unreachable (cp ≥ 1 ⇒ halves ≥ 1) — total-function guard
}

/**
 * Derive one good's full market quote.
 * @param {Object} args
 * @param {ResolvedGood} args.good
 * @param {string} args.settlementId
 * @param {Band | null | undefined} [args.band]        the M6a band (absent ⇒ adequate)
 * @param {Band | null | undefined} [args.driftBand]   the M6d flow band (absent ⇒ no nudge)
 * @returns {MarketQuote}
 */
export function deriveMarketQuote({ good, settlementId, band, driftBand }) {
  const useBand = /** @type {Band} */ (band || 'adequate');
  const base = basePriceFor(good);
  const scarcity = finiteNumber(/** @type {Record<string, number>} */ (SCARCITY_MULTIPLIER)[useBand], 1);
  const jitter = localColor(String(settlementId), good.id);
  const drift = driftBand ? finiteNumber(/** @type {Record<string, number>} */ (DRIFT_NUDGE)[driftBand], 1) : 1;
  const coppers = Math.max(1, Math.round(base * scarcity * jitter * drift));
  const unit = unitFor(good);
  const spoken = denominate(coppers);
  return {
    id: good.id,
    label: good.label,
    unit,
    coppers,
    spoken,
    priced: `${spoken} the ${unit}`,
    band: useBand,
    tag: tagFor(useBand),
    raw: `${formatCount(coppers)} cp`,
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

// ── The CRIER-LINE frame pools (content-vt-2) ───────────────────────────────
// The market crier cried ONE fixed frame ("{label} runs {priced} — dear,
// {receipt}."), so every settlement's economics tab read the same shape. Each
// tag (dear/cheap) is now a small pool of interchangeable frames; the FACTS —
// the good {label}, the coarse {priced} quote, and the causal {receipt} — ride
// every frame unchanged (mirror-not-rederive), and only the crier's phrasing
// varies. Selection is a pure FNV of the good's id, so a given good is always
// cried the same way and different goods generally read differently.
// CANONICAL-AT-ZERO: index 0 of each pool is the original line.
/** @type {Readonly<Record<'dear'|'cheap', ReadonlyArray<string>>>} */
export const CRIER_FRAMES = Object.freeze({
  dear: Object.freeze([
    '{label} runs {priced} — dear, {receipt}.',
    '{label} is dear at {priced} now, {receipt}.',
    "They're asking {priced} for {label} — dear, {receipt}.",
    '{label} fetches {priced} these days — dear, {receipt}.',
  ]),
  cheap: Object.freeze([
    '{label} runs {priced} — cheap, {receipt}.',
    '{label} is cheap at {priced} now, {receipt}.',
    "There's {label} going for {priced} — cheap, {receipt}.",
    '{label} fetches only {priced} these days — cheap, {receipt}.',
  ]),
});

/** Fill a crier frame for a tag, seeded on the good id (index 0 when seedless).
 *  @param {'dear'|'cheap'} tag @param {string} seed
 *  @param {{ label: string, priced: string, receipt: string }} slots @returns {string} */
function crierLineFor(tag, seed, { label, priced, receipt }) {
  const pool = CRIER_FRAMES[tag];
  const frame = seed ? pool[fnv1a32(`${seed}::${tag}`) % pool.length] : pool[0];
  return frame.replace('{label}', label).replace('{priced}', priced).replace('{receipt}', receipt);
}

/**
 * The strongest-deviation "dear / cheap this season" highlight over a set of
 * quotes, or null when every good is steady. A shortage (dear) outranks a
 * surplus (cheap) for drama; ties break by dearer/cheaper coppers, then id.
 * @param {MarketQuote[]} quotes @param {Band | null | undefined} driftBand
 * @returns {{ id: string, label: string, tag: 'dear'|'cheap', crierLine: string } | null}
 */
export function strongestDeviation(quotes, driftBand) {
  const dear = quotes.filter(q => q.tag === 'dear');
  const cheap = quotes.filter(q => q.tag === 'cheap');
  /** @type {MarketQuote | null} */
  let pick = null;
  if (dear.length) {
    // Dearest first (highest coppers), then codepoint id for a stable tie-break.
    pick = [...dear].sort((a, b) => (b.coppers - a.coppers) || compareCodepoint(a.id, b.id))[0];
  } else if (cheap.length) {
    // Cheapest first (lowest coppers), then codepoint id.
    pick = [...cheap].sort((a, b) => (a.coppers - b.coppers) || compareCodepoint(a.id, b.id))[0];
  }
  if (!pick) return null;
  const tag = /** @type {'dear'|'cheap'} */ (pick.tag);
  const receipt = causalReceipt(tag, driftBand);
  return {
    id: pick.id,
    label: pick.label,
    tag,
    crierLine: crierLineFor(tag, String(pick.id ?? ''), { label: pick.label, priced: pick.priced, receipt }),
  };
}

/**
 * The whole market-prices view model for a settlement. Resolves the seeded
 * exports / imports to catalog goods, prices each at its M6a band × local color
 * × the M6d drift, and picks the one strongest deviation. INERT-NOT-CRASH:
 * absent economicState / worldState ⇒ an empty (present: false) model.
 *
 * @param {Object} args
 * @param {{ primaryExports?: unknown, primaryImports?: unknown } | null | undefined} args.economicState
 * @param {{ spatialLedgers?: unknown } | null | undefined} [args.worldState]
 * @param {unknown} args.settlementId
 * @param {{ band?: Band } | null | undefined} [args.flowDrift]  the M6d drift (its
 *   settlement-wide band nudges every quote); absent ⇒ no nudge.
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
   * Resolve a seeded label list to priced quotes: goods only, deduped by id,
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
