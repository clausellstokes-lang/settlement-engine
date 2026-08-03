/**
 * domain/display/stateProse/economyStateProse.js — LANE P: THE ECONOMY DESK.
 *
 * The reference desk. Four corpus blocks, four rendered surfaces, and the shape every
 * other desk copies:
 *
 *   DS-ECO-1  Economics › Prosperity header — the rung read AGAINST the approach
 *   DS-ECO-8  LADDER › the prosperity rung read on its own
 *   DS-ECO-2  Economics › the food and season tiles
 *   DS-ECO-9  LADDER › the food-security rung, and the two blockade states
 *
 * ── WHAT A DESK IS RESPONSIBLE FOR ───────────────────────────────────────────────────
 *
 * A desk maps LIVE STATE to a POOL KEY, and nothing else. It does not select prose (the
 * kernel draws), it does not compose sections (the panel does), and it never derives a
 * number a canonical reader already owns — `deriveFoodBalance` and `deriveGranaryOutlook`
 * stay the view model's, and their readings arrive here as arguments. A second
 * derivation of the same fact is a fork that drifts, and this file would be the place it
 * started.
 *
 * ── R-DST-A, HELD ────────────────────────────────────────────────────────────────────
 * A SURFACE block frames a section; a LADDER block reads a band value. A composed page
 * draws at most one of each and never both about the same fact. So the prosperity HEADER
 * takes DS-ECO-1 (rung × approach) and the economy TILE takes DS-ECO-8 (the rung alone) —
 * the census's own pairing, and the reason the two blocks are non-redundant.
 *
 * ── R-DST-B, THE FILE'S CENTRAL LAW, HELD BY THE CORPUS AND NOT BY THIS FILE ──────────
 * A prosperity rung is a DERIVED READING with no provenance trail, so no variant in
 * these pools carries a historical clause and this desk supplies no cause. Where a cause
 * exists it belongs to a JOIN family and comes through causalDossierProse.js, which
 * renders only joins with records behind them.
 *
 * ── §0d, THE DIGIT BAN ───────────────────────────────────────────────────────────────
 * The tile keeps its `Deficit 12% of need`; the prose bands the same fact. Nothing this
 * desk puts in a slot is ever a figure, and the kernel rejects a numeric fill outright.
 *
 * @enforced-by tests/domain/economyStateProseDesk.test.js
 */
import { prosperityRank } from '../../../data/constants.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../../data/dossierStateProse/economy.generated.js';
import { readStateProse } from './stateProseKernel.js';
import { legibilityRung } from './legibilityRung.js';

/**
 * The desk's corpus, typed at the import boundary. The generated leaves stay PURE DATA
 * with no import of any kind — including a JSDoc type import, which would couple
 * src/data to a domain module path — so the shape assertion lives here, once, where the
 * reader that depends on it can be read beside it.
 * @type {import('./stateProseKernel.js').StateProseCorpus}
 */
const CORPUS = /** @type {any} */ (DOSSIER_STATE_PROSE_ECONOMY);

/**
 * `tradeAccess` → the `{access}` fill, in the prose form §0c specifies.
 *
 * `isolated` HAS NO FILL, deliberately and per the annex: a town nothing reaches has no
 * approach to name, so every variant needing `{access}` becomes ineligible on it and the
 * pool degrades to the variants that never needed one. This is the anchored-liveness law
 * doing its work on a real enum rather than on a missing record.
 * @type {Readonly<Record<string, string>>}
 */
const ACCESS_PROSE = Object.freeze({
  road: 'the road',
  river: 'the river',
  port: 'the port',
  crossroads: 'the crossroads',
  mountain_pass: 'the pass',
});

/** The two approaches DS-ECO-1 calls narrow. */
const NARROW_ACCESS = Object.freeze(['isolated', 'mountain_pass']);

/**
 * DS-ECO-1's five combinations, by rung band and approach width.
 *
 * JUDGMENT (vetoable): the annex names the bands — "a high rung", "the middle rungs", "a
 * low rung" — and leaves the cut to the implementer. The cut here is
 * low = Subsistence/Struggling/Poor · middle = Moderate/Comfortable · high =
 * Prosperous/Wealthy, chosen because the annex says "the middle rungs" in the plural and
 * because C3's variants ("manages", "a thin margin", "nothing striking in either
 * direction") read as Moderate and Comfortable rather than as Moderate alone. Say
 * "veto" to move it.
 */
const HIGH_RUNG_FROM = 5;
const LOW_RUNG_TO = 2;

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * The DS-ECO-1 pool key for a rung and an approach, or null when the rung is unknown —
 * an unrecognised prosperity spelling must render NOTHING rather than fall into a band.
 * @param {number} rank
 * @param {string} access
 * @returns {string|null}
 */
export function prosperityHeaderPoolKey(rank, access) {
  if (rank < 0) return null;
  const narrow = NARROW_ACCESS.includes(access);
  if (rank >= HIGH_RUNG_FROM) {
    return narrow
      ? 'COMBINATION C2 — a high rung on a narrow approach (isolated / mountain_pass)'
      : 'COMBINATION C1 — a high rung on a working approach';
  }
  if (rank <= LOW_RUNG_TO) {
    return narrow
      ? 'COMBINATION C5 — a low rung on a narrow approach'
      : 'COMBINATION C4 — a low rung on a working approach';
  }
  return 'COMBINATION C3 — the middle rungs';
}

/**
 * DS-ECO-9's pool key. The blockade states OVERRIDE the ladder: a blockaded town's food
 * story is the blockade, and the rung underneath it is the wrong sentence to tell.
 * @param {unknown} foodSecurityLabel
 * @param {{blockaded?: unknown, blockadeBypass?: unknown}|null|undefined} stockpile
 * @returns {string|null}
 */
export function foodSecurityPoolKey(foodSecurityLabel, stockpile) {
  if (stockpile?.blockadeBypass) return 'BLOCKADE BYPASSED';
  if (stockpile?.blockaded) return 'BLOCKADED';
  const label = text(foodSecurityLabel);
  if (!label) return null;
  const key = label.toUpperCase();
  return CORPUS['DS-ECO-9'].pools[key] ? key : null;
}

/**
 * DS-ECO-2's food-tile key from the canonical food balance. `available: false` means the
 * tile itself does not render, and R-DST-K says the absence of a surface is the absence
 * of a sentence.
 * @param {{available?: unknown, deficit?: unknown, surplus?: unknown}|null|undefined} foodBalance
 * @returns {string|null}
 */
export function foodTilePoolKey(foodBalance) {
  if (!foodBalance?.available) return null;
  if (Number(foodBalance.deficit) > 0) return 'FOOD — deficit';
  if (Number(foodBalance.surplus) > 0) return 'FOOD — surplus';
  return 'FOOD — balanced';
}

/**
 * DS-ECO-2's granary key. Seasons off ⇒ no tile ⇒ no sentence (R-DST-K).
 * @param {{available?: unknown, band?: unknown}|null|undefined} granaryOutlook
 * @returns {string|null}
 */
export function granaryPoolKey(granaryOutlook) {
  if (!granaryOutlook?.available) return null;
  const band = text(granaryOutlook.band);
  return band ? `GRANARY — ${band}` : null;
}

/**
 * THE DESK. Returns one legibility rung per surface, or null where the surface itself
 * does not render.
 *
 * @param {object} settlement
 * @param {object} [readings] the canonical derived readings the Economics tab already has
 * @param {object} [readings.foodBalance] from deriveFoodBalance
 * @param {object} [readings.granaryOutlook] from deriveGranaryOutlook
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{prosperityHeader: object|null, prosperityRung: object|null, foodTile: object|null, granaryTile: object|null, foodSecurity: object|null}>}
 */
export function economyStateProse(settlement, readings = {}, options = {}) {
  const eco = /** @type {any} */ (settlement)?.economicState || {};
  const name = text(/** @type {any} */ (settlement)?.name);
  const prosperity = typeof eco.prosperity === 'string' ? eco.prosperity : text(eco.prosperity?.tier);
  // The CANONICAL ladder reader, never a hand-rolled band match: a second spelling of
  // the rung ladder in this file is exactly the fork that drifts.
  const rank = prosperityRank(eco.prosperity);
  const access = text(eco.tradeAccess)
    || text(/** @type {any} */ (settlement)?.economicViability?.metrics?.tradeAccess);
  const granary = readings.granaryOutlook;
  const foodBalance = readings.foodBalance;

  const slots = {
    settlement: name,
    // `isolated` deliberately contributes no fill — see ACCESS_PROSE.
    access: ACCESS_PROSE[access],
    complexity: text(eco.economicComplexity),
    season: text(/** @type {any} */ (granary)?.season),
  };

  /** @param {string} blockId @param {string|null} poolKey */
  const line = (blockId, poolKey) => (poolKey
    ? readStateProse(CORPUS, blockId, poolKey, { ...options, slots })
    : null);

  const accessRow = access
    ? { label: 'Approach', value: ACCESS_PROSE[access] || 'nothing that reaches it easily' }
    : null;

  /** @type {Array<{label: string, value: string}>} */
  const headerDetail = [];
  if (accessRow) headerDetail.push(accessRow);
  if (slots.complexity) headerDetail.push({ label: 'Economy', value: slots.complexity });

  const headerKey = prosperityHeaderPoolKey(rank, access);
  const foodKey = foodTilePoolKey(foodBalance);
  const granaryKey = granaryPoolKey(granary);
  const securityKey = foodSecurityPoolKey(/** @type {any} */ (eco.foodSecurity)?.label, /** @type {any} */ (eco.foodSecurity)?.stockpile);

  return Object.freeze({
    prosperityHeader: headerKey
      ? legibilityRung(prosperity, line('DS-ECO-1', headerKey), headerDetail)
      : null,
    prosperityRung: rank >= 0
      ? legibilityRung(prosperity, line('DS-ECO-8', prosperity.toUpperCase()), [])
      : null,
    foodTile: foodKey
      ? legibilityRung(text(/** @type {any} */ (foodBalance)?.display),
        line('DS-ECO-2', foodKey),
        [{ label: 'Produced against need', value: text(/** @type {any} */ (foodBalance)?.detail) }])
      : null,
    granaryTile: granaryKey
      ? legibilityRung(text(/** @type {any} */ (granary)?.band), line('DS-ECO-2', granaryKey),
        [{ label: 'Season', value: slots.season }])
      : null,
    foodSecurity: securityKey
      ? legibilityRung(text(/** @type {any} */ (eco.foodSecurity)?.label) || securityKey,
        line('DS-ECO-9', securityKey), [])
      : null,
  });
}
