/**
 * beliefAxisSubjects.js — SP-B: THE BELIEVED-WORLD AXES (scarcity, conditions, devotion).
 *
 * THE SEAM RULING THAT SHAPES THIS FILE (SP architecture seam ruling 1, J-SP-1). There is
 * NO believed-world module and NO second decay law. The three subject families are new
 * ARMS of the EXISTING beliefAxes fold: a ground-truth derivation joining
 * `axisGroundTruth`, a fold arm joining `foldBeliefAxes`, and conditional
 * drop-when-absent fields on the EXISTING beliefRecord rows. They ride BELIEF_TUNING's
 * decay and forgetting, and the infoMode gate, for free. A parallel believed-scarcity
 * ledger, a second fold, or a second decay law anywhere would be a design defect.
 *
 * THIS LEAF IS PURE AND FLAGLESS. It reads no rule key; `beliefAxes.js` owns the one gate
 * door (`subjectAxesActive`) and hands the resolved family gates down as data. That keeps
 * the strict conjunction — each family flag AND `beliefAxesEnabled` — in ONE place, and it
 * keeps this file free of the flag-polarity surface the dormancy fences census.
 *
 * ── THE VOCABULARY CONTRACT (SP seam contract 6), AND THE BORROW CENSUS ─────────────
 *
 * J-WR-10-B requires a mint to record what it looked for. Measured against the live tree
 * on 2026-08-05; FOUR of the five ladders below are BORROWS and only one is a mint:
 *
 *   tierBand            IMPORTED verbatim — `TIER_ORDER` (src/data/constants.js). No
 *                       second spelling exists here at all.
 *   storesBand          BORROWED BY SPELLING from `ENVOY_STORES_BANDS`
 *                       (envoyErrandVocabulary.js) — the ladder the negotiation picture
 *                       and the WR-10 appraisal already speak.
 *   routePositionBand   BORROWED BY SPELLING from `ROUTE_FLOW_BANDS`
 *                       (routeNetworkFlows.js) — the ladder the appraisal's route leg
 *                       already speaks.
 *   devotionBand        BORROWED BY SPELLING from `pietyBandLabel`
 *                       (components/settlement/faithPanelModel.js) — the five words the
 *                       faith surfaces already show a player.
 *   pullBand            MINTED. The census: `OVERFLOW_BANDS` is a pressure LEVEL and
 *                       J-FP-2 forbids reading it as anything else; `PROSPERITY_TIERS`
 *                       grades wealth, not desirability; `destinationScore` is a float
 *                       with no ladder at all. Nothing grades "would people go there",
 *                       so four words that appear as quoted literals ZERO times anywhere
 *                       under src/ were chosen — the bandFamilies.js discipline, applied
 *                       again: a ladder whose words no other ladder speaks cannot be read
 *                       by mistake.
 *   scarcityBands       MINTED, and this one had a near miss worth recording.
 *                       `FOOD_FLOW_BANDS` (demographicsPushPull.js) is a live four-rung
 *                       scarcity ladder — but it grades the FOOD flow ratio and its
 *                       bottom rung is `famished`, which does not generalise to iron or
 *                       to arcane reagents. `capacityModel.CapacityBand` grades an
 *                       institution's SERVICE capacity, a different subject. The
 *                       state-prose corpus speaks SCARCITY shortage/adequate/surplus, but
 *                       those are authored prose KEYS, not a code ladder, and `adequate`
 *                       and `surplus` are each spoken by a dozen unrelated modules. So a
 *                       zero-collision ladder is minted here.
 *
 * WHY THE TWO BORROWED-BY-SPELLING LADDERS ARE NOT IMPORTED. `envoyErrandVocabulary.js`
 * is the GRAMMAR port and `routeNetworkFlows.js` is the TRADE port; importing either from
 * this INFO leaf would mint an unlicensed cross-layer pair, and licensing one is a chair
 * declaration (a coupling-registry row), not an implementer's move. The estate's own
 * recorded answer to exactly this is `AXIS_TUNING.CAT_ADOPT_ACCURACY` in beliefAxes.js —
 * a local mirror kept local to avoid an import, one file over. The drift that a mirror
 * invites is killed MECHANICALLY here instead of by discipline:
 * tests/lint/spAxisVocabulary.walker.test.js imports BOTH sides and asserts them verbatim
 * equal in both directions, and executes `pietyBandLabel` across its own rungs rather
 * than comparing a transcription. A source that re-spells a rung reds the day it lands.
 *
 * BELIEFS ARE NEVER TRUTH (law 3). Every value here is a BELIEVED state. The ground-truth
 * reads below are the cold-start seed and the re-anchor TARGET only; nothing in this file
 * writes an economicState, a religion state, or a settlement field.
 *
 * DROP-WHEN-ABSENT AT EVERY LEVEL (T4: a key is a byte). A family whose ground truth
 * cannot be resolved contributes NO key — never a null, never a midpoint. A dark family
 * contributes nothing at all, which is what makes a dark world byte-identical.
 *
 * PURE + lazy: no Date, no Math.random, no store, no React, no import of beliefMap or
 * beliefAxes (one-way — beliefAxes imports this). Zero first-paint bytes.
 */

import { TIER_ORDER, prosperityRank } from '../../data/constants.js';
import { normalizeGoodsList, REGIONAL_GOOD_CATEGORIES } from '../region/goodsCatalog.js';

// ── The band vocabularies (the SP seam-6 closed contract) ─────────────────────

/**
 * SP-B SCARCITY, ascending abundance. MINTED (see the header census). The believed
 * plenty of ONE good class at ONE settlement.
 * @type {readonly string[]}
 */
export const SCARCITY_BANDS = Object.freeze(['scant', 'pinched', 'sufficient', 'plentiful']);

/**
 * SP-B STORES, ascending. BORROWED BY SPELLING from `ENVOY_STORES_BANDS`; the walker
 * proves the two lists identical rather than trusting this comment.
 * @type {readonly string[]}
 */
export const STORES_BANDS = Object.freeze(['bare', 'thin', 'stocked', 'deep']);

/**
 * SP-B ROUTE POSITION, ascending. BORROWED BY SPELLING from `ROUTE_FLOW_BANDS`; same
 * walker, same both-ways equality.
 * @type {readonly string[]}
 */
export const ROUTE_POSITION_BANDS = Object.freeze(['none', 'trace', 'stirring', 'steady', 'established']);

/**
 * SP-B PULL, ascending. MINTED. How strongly a place is believed to DRAW people to it —
 * a desirability, not a fullness (J-FP-2: `OVERFLOW_BANDS` is the fullness ladder and
 * reading it here would be the silent semantic error the ladder law exists to kill).
 * @type {readonly string[]}
 */
export const PULL_BANDS = Object.freeze(['shunned', 'overlooked', 'sought', 'coveted']);

/**
 * SP-B DEVOTION, ascending. BORROWED BY SPELLING from `pietyBandLabel`. How the
 * neighbours' gods are believed to FARE — never which god, and never whether it is real
 * (the deity doctrine: the engine confirms nothing).
 * @type {readonly string[]}
 */
export const DEVOTION_BANDS = Object.freeze(['secular', 'lukewarm', 'observant', 'faithful', 'devout']);

/**
 * The FOUR conditions keys, codepoint-ordered — the closed set of `conditionsBands`.
 * ES products may fill the first three; `pullBand` is SP-B's own populations road and no
 * ES product may name it (ES architecture, amendment F5).
 * @type {readonly string[]}
 */
export const CONDITIONS_KEYS = Object.freeze(['pullBand', 'routePositionBand', 'storesBand', 'tierBand']);

/**
 * The THREE beliefRecord field names this wave adds, codepoint-ordered. The
 * closed-vocabulary seam every consumer volume joins against.
 * @type {readonly string[]}
 */
export const SUBJECT_AXIS_FIELDS = Object.freeze(['conditionsBands', 'devotionBand', 'scarcityBands']);

/**
 * SP-B's tuning (the volume's §7 rows; owner-signed at the soak redo, raw-authored until
 * then and in `proposedSoakBands` never).
 *
 * THE PER-FAMILY ADOPTION BARS are the one genuinely new number set: commercial detail
 * travels worst (a rumour about someone else's granary is the first thing a telling gets
 * wrong), a town's SIZE and ROADS are the easiest thing in the world to see, and how
 * loudly a place prays sits between them.
 */
export const SUBJECT_AXIS_TUNING = Object.freeze({
  // Fresh-report accuracy at/above which a family ADOPTS the current truth; below it the
  // stale prior survives, which is the fog-of-war feature the existing axes already ship.
  SCARCITY_ADOPT: 0.7,
  CONDITIONS_ADOPT: 0.5,
  DEVOTION_ADOPT: 0.6,
  // storageMonths -> STORES_BANDS. Measured over 72 really-generated settlements
  // (min 1.3, median 6.3, max 12): the four rungs land 12 / 24 / 24 / 12.
  STORES_THIN_MONTHS: 1.5,
  STORES_STOCKED_MONTHS: 4,
  STORES_DEEP_MONTHS: 8,
  // foodSecurity.foodRatio edges. Measured spread 0.51 .. 1.24, so both arms fire.
  FOOD_DEFICIT_RATIO: 0.95,
  FOOD_SURPLUS_RATIO: 1.10,
  // prosperityRank (0..6) -> PULL_BANDS. Measured ranks 1..5 over the same corpus, and
  // the four rungs are reachable inside that range before the food shift is applied.
  PULL_OVERLOOKED_RANK: 2,
  PULL_SOUGHT_RANK: 4,
  PULL_COVETED_RANK: 5,
});

/**
 * The trade-route class a settlement was generated with -> its route-position rung.
 * Every one of the six classes the configuration panel offers was driven through the
 * pipeline and observed arriving verbatim on `economicState.tradeAccess`, so no arm here
 * is a guess. `isEntrepot` lifts one rung, which is why `port` sits at `steady`: an
 * entrepot port is the reachable path to `established` alongside a crossroads.
 * @type {Readonly<Record<string, string>>}
 */
const ROUTE_CLASS_RUNG = Object.freeze({
  isolated: 'none',
  mountain_pass: 'trace',
  road: 'stirring',
  river: 'steady',
  port: 'steady',
  crossroads: 'established',
});

/**
 * A deity's STANDING (religionState's own hysteresis-guarded word) plus whether it holds
 * the patron seat -> the devotion rung. Deliberately NOT a share-threshold table: the
 * standing thresholds are already owner tuning inside religionState, and minting a second
 * set of edges over the same quantity is exactly the fourteen-drift class.
 * @type {Readonly<Record<string, string>>}
 */
const STANDING_RUNG = Object.freeze({ cult: 'lukewarm', established: 'observant', ascendant: 'faithful' });

// ── Small pure helpers ────────────────────────────────────────────────────────

/** @param {unknown} v @returns {Record<string, unknown>} */
function asRecord(v) { return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {}; }

/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) { return typeof v === 'number' && Number.isFinite(v) ? v : fallback; }

/** @param {unknown} v @returns {unknown[]} */
function asArray(v) { return Array.isArray(v) ? v : []; }

/** @param {string} a @param {string} b @returns {number} */
function compareCodepoint(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

/**
 * Shift a rung within its ladder, clamped at both ends.
 * @param {readonly string[]} ladder @param {string} rung @param {number} step @returns {string}
 */
function shiftRung(ladder, rung, step) {
  const i = ladder.indexOf(rung);
  if (i < 0) return rung;
  const next = i + step;
  return ladder[next < 0 ? 0 : next >= ladder.length ? ladder.length - 1 : next];
}

/**
 * THE GOODS-BY-CATEGORY DERIVATION CACHE, keyed on the settlement OBJECT identity (the
 * worldSnapshot participation-view idiom). `normalizeGoodsList` fuzzy-matches every label
 * against the catalog, and the belief fold visits each subject once per OBSERVER — without
 * this the cost would be quadratic in a realm's size for a value that depends on the
 * settlement alone. Referentially transparent: same identity, same derivation, and a
 * WeakMap holds nothing alive.
 * @type {WeakMap<object, { produced: Set<string>, imported: Set<string>, needed: Set<string> }>}
 */
const goodsByCategoryCache = new WeakMap();

/**
 * Which good CATEGORIES a settlement makes, buys, and cannot do without.
 * @param {Record<string, unknown>} settlement
 * @returns {{ produced: Set<string>, imported: Set<string>, needed: Set<string> }}
 */
function goodsByCategory(settlement) {
  const cached = goodsByCategoryCache.get(settlement);
  if (cached) return cached;
  const economy = asRecord(settlement.economicState);
  const collect = (/** @type {unknown[]} */ lists) => {
    /** @type {Set<string>} */
    const out = new Set();
    // The catalog takes labels, objects or ids and normalises all three; the domain-strict
    // cast is the honest spelling of "these are whatever the generator wrote".
    for (const good of normalizeGoodsList(/** @type {Parameters<typeof normalizeGoodsList>[0]} */ (lists))) {
      const category = String(asRecord(good).category || 'other');
      out.add(category);
    }
    return out;
  };
  const derived = {
    produced: collect([...asArray(economy.localProduction), ...asArray(economy.primaryExports)]),
    imported: collect([...asArray(economy.primaryImports)]),
    needed: collect([...asArray(economy.necessityImports)]),
  };
  goodsByCategoryCache.set(settlement, derived);
  return derived;
}

// ── Ground truth, family by family ────────────────────────────────────────────

/**
 * THE BELIEVED-SCARCITY GROUND TRUTH: one rung per good class the settlement has any
 * evidence about. A class it neither makes nor buys yields NO KEY — silence is not a
 * band, and inventing `sufficient` for a class nobody trades would be a fabricated
 * opinion the observer never had.
 *
 * `food` carries one extra term and only one: the generator MEASURES a food ratio, so a
 * town that produces grain and still cannot feed itself is not `plentiful`. No other
 * class has a measured ratio anywhere in the tree, which is why no other class has a
 * shift — a per-class modifier with no per-class input would be a dead arm.
 *
 * @param {Record<string, unknown>} settlement
 * @returns {Record<string, string> | null} codepoint-ordered, or null when empty
 */
export function scarcityGroundTruth(settlement) {
  const { produced, imported, needed } = goodsByCategory(settlement);
  /** @type {Record<string, string>} */
  const bands = {};
  for (const category of [...REGIONAL_GOOD_CATEGORIES].sort(compareCodepoint)) {
    const makes = produced.has(category);
    const buys = imported.has(category);
    const mustBuy = needed.has(category);
    let rung = null;
    if (mustBuy && !makes) rung = 'scant';        // it cannot do without, and cannot make it
    else if (buys && !makes) rung = 'pinched';    // it buys what it lacks
    else if (makes && !buys && !mustBuy) rung = 'plentiful'; // it makes it and buys none
    else if (makes) rung = 'sufficient';          // it makes it and still buys some
    if (rung) bands[category] = rung;
  }
  const ratio = finiteNumber(asRecord(asRecord(settlement.economicState).foodSecurity).foodRatio, NaN);
  if (bands.food && Number.isFinite(ratio)) {
    const T = SUBJECT_AXIS_TUNING;
    if (ratio < T.FOOD_DEFICIT_RATIO) bands.food = shiftRung(SCARCITY_BANDS, bands.food, -1);
    else if (ratio > T.FOOD_SURPLUS_RATIO) bands.food = shiftRung(SCARCITY_BANDS, bands.food, 1);
  }
  return Object.keys(bands).length ? bands : null;
}

/**
 * THE BELIEVED-CONDITIONS GROUND TRUTH: the four keys of `conditionsBands`, each present
 * only where its own read resolves.
 *   tierBand          the settlement's size class, verbatim from TIER_ORDER.
 *   storesBand        the granary, banded off `economicState.foodSecurity.storageMonths`.
 *   routePositionBand where it sits on the roads, from its trade-route class + entrepot.
 *   pullBand          how strongly it draws people, from prosperity softened by hunger.
 * @param {Record<string, unknown>} settlement
 * @returns {Record<string, string> | null} codepoint-ordered, or null when empty
 */
export function conditionsGroundTruth(settlement) {
  const T = SUBJECT_AXIS_TUNING;
  const economy = asRecord(settlement.economicState);
  const food = asRecord(economy.foodSecurity);
  /** @type {Record<string, string>} */
  const bands = {};

  const tier = String(settlement.tier || '');
  if (TIER_ORDER.includes(tier)) bands.tierBand = tier;

  const months = finiteNumber(food.storageMonths, NaN);
  if (Number.isFinite(months)) {
    bands.storesBand = months < T.STORES_THIN_MONTHS ? 'bare'
      : months < T.STORES_STOCKED_MONTHS ? 'thin'
        : months < T.STORES_DEEP_MONTHS ? 'stocked' : 'deep';
  }

  const rung = ROUTE_CLASS_RUNG[String(economy.tradeAccess || '')];
  if (rung) bands.routePositionBand = economy.isEntrepot === true ? shiftRung(ROUTE_POSITION_BANDS, rung, 1) : rung;

  const rank = prosperityRank(economy.prosperity);
  if (Number.isFinite(rank) && rank >= 0) {
    let pull = rank >= T.PULL_COVETED_RANK ? 'coveted'
      : rank >= T.PULL_SOUGHT_RANK ? 'sought'
        : rank >= T.PULL_OVERLOOKED_RANK ? 'overlooked' : 'shunned';
    // A hungry place draws nobody, however rich its ledgers read.
    const ratio = finiteNumber(food.foodRatio, NaN);
    if (Number.isFinite(ratio) && ratio < T.FOOD_DEFICIT_RATIO) pull = shiftRung(PULL_BANDS, pull, -1);
    bands.pullBand = pull;
  }

  if (!Object.keys(bands).length) return null;
  /** @type {Record<string, string>} */
  const ordered = {};
  for (const key of CONDITIONS_KEYS) if (bands[key]) ordered[key] = bands[key];
  return ordered;
}

/**
 * THE BELIEVED-DEVOTION GROUND TRUTH: how the town's gods are believed to fare, as ONE
 * word. Read off the religion state's TOP unsuppressed deity — its `standing` (which
 * religionState already computes with hysteresis against owner-signed thresholds) lifted
 * one rung when that deity also holds the patron seat.
 *
 * A settlement with a religion state but no unsuppressed deity is `secular`, which is a
 * real reading rather than an absence. NO religion state at all yields null: the observer
 * has nothing to have an opinion about.
 *
 * LAW ONE holds: the band says how loudly a place prays, never which god is real.
 *
 * @param {unknown} religionState  worldState.religionStates[subjectId]
 * @returns {string | null}
 */
export function devotionGroundTruth(religionState) {
  const state = asRecord(religionState);
  if (!Object.keys(state).length) return null;
  const deities = asRecord(state.deities);
  const patronRef = typeof state.patronRef === 'string' ? state.patronRef : null;
  let best = null;
  let bestShare = -Infinity;
  for (const ref of Object.keys(deities).sort(compareCodepoint)) {
    const row = asRecord(deities[ref]);
    if (row.suppressed === true) continue;
    const share = finiteNumber(row.share, 0);
    if (share > bestShare) { bestShare = share; best = { ref, standing: String(row.standing || '') }; }
  }
  if (!best) return 'secular';
  const rung = STANDING_RUNG[best.standing];
  if (!rung) return 'secular';
  return best.ref === patronRef ? shiftRung(DEVOTION_BANDS, rung, 1) : rung;
}

/**
 * The three subject families' ground truth for one snapshot item, as a PARTIAL record —
 * only the families whose gate is lit and whose read resolved.
 * @param {{ settlement?: unknown } | null | undefined} item
 * @param {{ religionState?: unknown } | null | undefined} sources
 * @param {{ scarcity?: boolean, conditions?: boolean, devotion?: boolean } | null | undefined} gates
 * @returns {Record<string, unknown>}
 */
export function subjectGroundTruth(item, sources, gates) {
  /** @type {Record<string, unknown>} */
  const out = {};
  if (!gates) return out;
  const settlement = asRecord(asRecord(item).settlement);
  if (gates.scarcity) {
    const bands = scarcityGroundTruth(settlement);
    if (bands) out.scarcityBands = bands;
  }
  if (gates.conditions) {
    const bands = conditionsGroundTruth(settlement);
    if (bands) out.conditionsBands = bands;
  }
  if (gates.devotion) {
    const band = devotionGroundTruth(asRecord(sources).religionState);
    if (band) out.devotionBand = band;
  }
  return out;
}

// ── The fold ──────────────────────────────────────────────────────────────────

/**
 * The best fresh-report fidelity in this window. The families are CATEGORICAL, so they
 * follow the estate's existing categorical rule (reconcileBelief's own `adopt`): a
 * faithful enough telling ADOPTS the current truth, and anything less leaves the stale
 * prior standing. The MAXIMUM rather than the aggregate, because one clear-eyed witness
 * is what changes a court's mind about a granary.
 * @param {ReadonlyArray<{ accuracy01?: unknown }> | null | undefined} reports
 * @returns {number}
 */
function bestFidelity(reports) {
  let best = 0;
  for (const report of asArray(reports)) {
    const accuracy = finiteNumber(asRecord(report).accuracy01, 0);
    if (accuracy > best) best = accuracy;
  }
  return best;
}

/**
 * Fold the three subject families for one (observer, subject) belief. Pure and
 * deterministic; runs AFTER the base reconcile so the base fields are settled.
 *
 * Per family: at/above its adoption bar the observer takes the CURRENT ground truth;
 * below it the prior it already held survives — including a prior that is now WRONG,
 * which is the point. A family with neither a prior nor a resolved ground truth
 * contributes no key at all.
 *
 * @param {Object} args
 * @param {Record<string, unknown> | null} args.prior  the DECAYED prior record (or null)
 * @param {Record<string, unknown>} args.groundTruth  the current ground-truth record
 * @param {ReadonlyArray<{ accuracy01?: unknown }>} args.reports  this window's fresh reports
 * @param {{ scarcity?: boolean, conditions?: boolean, devotion?: boolean } | null | undefined} args.gates
 * @returns {Record<string, unknown>}
 */
export function foldSubjectAxes({ prior, groundTruth, reports, gates }) {
  /** @type {Record<string, unknown>} */
  const out = {};
  if (!gates) return out;
  const T = SUBJECT_AXIS_TUNING;
  const fidelity = bestFidelity(reports);
  const priorRec = asRecord(prior);
  const truthRec = asRecord(groundTruth);
  /** @type {Array<[boolean, string, number]>} */
  const arms = [
    [gates.scarcity === true, 'scarcityBands', T.SCARCITY_ADOPT],
    [gates.conditions === true, 'conditionsBands', T.CONDITIONS_ADOPT],
    [gates.devotion === true, 'devotionBand', T.DEVOTION_ADOPT],
  ];
  for (const [lit, field, bar] of arms) {
    if (!lit) continue;
    const adopt = fidelity >= bar;
    const held = priorRec[field];
    const truth = truthRec[field];
    const next = adopt || held === undefined ? truth : held;
    if (next !== undefined) out[field] = next;
  }
  return out;
}
