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
 *   DS-ECO-12 Economics › the commercial profile — how the town earns, and what it trades
 *   DS-ECO-6  Economics › the shadow economy, by capture tier
 *   DS-ECO-3  Economics › the LIVE trade-flow drift, read against trade dependency
 *
 * ── DS-ECO-12: THREE LENSES AT ONE POSITION (the DS-POW-1 shape, not an exception) ────
 * DS-ECO-12 is one block over one record — `economicState`'s commercial identity — read
 * through three lenses: the INCOME CONCENTRATION, the CRIMINAL LINE, and the OUTWARD /
 * INWARD trade read. One position draws all three, because the C3 law is one SENTENCE
 * RUNG per block per page-set and a second mount would be the same block speaking twice.
 * `power.criminalUnderside` already draws three lenses at one position for exactly this
 * reason; this is that shape, not a new one.
 *
 * ⚠ THE CRIMINAL LENS IS `dm-only` IN THE CORPUS, ALL FIVE VARIANTS. It therefore draws
 * NOTHING on a player's page, by law 2 of the kernel, and that is the intended reading
 * rather than a dead lens: a player's dossier must be byte-identical over a town with an
 * underworld and a town without one. It reaches a reader through the DM's own audience,
 * which the caller supplies — so a desk called with no audience can never draw it.
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
const CORPUS = /** @type {import('./stateProseKernel.js').StateProseCorpus} */ (
  /** @type {unknown} */ (DOSSIER_STATE_PROSE_ECONOMY)
);

/**
 * The narrow slice of a settlement this desk reads. Declared rather than cast: the
 * any-cast ratchet is right that a desk which types its input `any` has given up the
 * one check that would catch a renamed field, and every field below is a real read.
 * @typedef {object} FoodSecurityView
 * @property {string} [label]
 * @property {{blockaded?: unknown, blockadeBypass?: unknown}|null} [stockpile]
 */
/**
 * @typedef {object} IncomeSourceView
 * @property {unknown} [percentage]
 * @property {unknown} [isCriminal]
 */
/**
 * @typedef {object} EconomicStateView
 * @property {string|{tier?: string}} [prosperity]
 * @property {string} [tradeAccess]
 * @property {string} [economicComplexity]
 * @property {FoodSecurityView|null} [foodSecurity]
 * @property {ReadonlyArray<IncomeSourceView>} [incomeSources]
 * @property {ReadonlyArray<unknown>} [primaryExports]
 * @property {ReadonlyArray<unknown>} [primaryImports]
 * @property {ReadonlyArray<unknown>} [localProduction]
 * @property {unknown} [isEntrepot]
 * @property {{blackMarketCapture?: unknown}|null} [safetyProfile]
 */
/**
 * @typedef {object} EconomyDeskSettlement
 * @property {string} [name]
 * @property {EconomicStateView|null} [economicState]
 * @property {{metrics?: {tradeAccess?: string}|null}|null} [economicViability]
 */
/**
 * The two canonical derived readings, as the view model returns them.
 * @typedef {object} FoodBalanceView
 * @property {unknown} [available]
 * @property {unknown} [deficit]
 * @property {unknown} [surplus]
 * @property {string} [display]
 * @property {string} [detail]
 */
/**
 * @typedef {object} GranaryOutlookView
 * @property {unknown} [available]
 * @property {string|null} [band]
 * @property {string|null} [season]
 */

/**
 * `tradeAccess` → the `{access}` fill: a BARE noun, the shape §0c declares for this slot.
 *
 * `isolated` HAS NO FILL, deliberately and per the annex: a town nothing reaches has no
 * approach to name, so every variant needing `{access}` becomes ineligible on it and the
 * pool degrades to the variants that never needed one. This is the anchored-liveness law
 * doing its work on a real enum rather than on a missing record.
 * @type {Readonly<Record<string, string>>}
 */
export const ACCESS_NOUN = Object.freeze({
  road: 'road',
  river: 'river',
  port: 'port',
  crossroads: 'crossroads',
  mountain_pass: 'pass',
});

/**
 * THE SHAPES THIS DESK BELIEVES ITS SLOTS HAVE, mirroring §0c's Shape column.
 *
 * The ANNEX is the authority and this is a checked mirror, not a second home: the
 * projection contract test asserts this map equals the register parsed out of the annexes,
 * slot for slot, so a desk that drifts from the corpus reds rather than rendering. A
 * runtime module cannot read markdown, and the alternative — no declaration at all — is
 * exactly the hole `{access}` fell through.
 * @type {Readonly<Record<string, string>>}
 */
export const SLOT_FILL_SHAPES = Object.freeze({
  settlement: 'proper',
  access: 'bare-common',
  complexity: 'bare-common',
  season: 'bare-common',
  good: 'bare-common',
});

/**
 * Every LITERAL fill table this desk owns, by the slot it fills. The guard walks this
 * directory, treats every exported string map as a candidate fill table, and refuses one
 * that is not declared here — so the next desk cannot land a table the shape check has
 * never seen, which is how a one-table check becomes a one-of-six check.
 * @type {Readonly<Record<string, Readonly<Record<string, string>>>>}
 */
export const SLOT_FILL_TABLES = Object.freeze({ access: ACCESS_NOUN });

/**
 * A `bare-common` fill, or `undefined` — the desk's own half of the shape contract.
 *
 * The refusal is scoped to the BARE-COMMON class on purpose. That is the class whose
 * violation produces broken English at every seam that carries it ("the Highly diversified
 * — multiple major revenue streams keeps more hands busy"), and refusing is the correct
 * behaviour under R-DST-K: the kernel's anchored liveness drops the variants that name the
 * slot and the pool degrades to the ones that never needed it. A `proper` fill is NOT
 * refused — a name is a name, an odd one still reads, and blanking a whole page over a
 * generator quirk would trade a small wrong for a large silence.
 *
 * The rules mirror `fillShapeViolation` in scripts/lib/dossier-slot-shapes.mjs, and the
 * contract test proves the two agree over a probe corpus rather than trusting that they do.
 * @param {string} value
 * @returns {string|undefined}
 */
function bareCommonFill(value) {
  if (!value) return undefined;
  if (/^(?:the|a|an|its|his|her|their|our|this|that|these|those)\b/i.test(value)) return undefined;
  if (/[—–]/.test(value)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(value)) return undefined;
  if (/[0-9]/.test(value)) return undefined;
  if (/[a-z]+_[a-z]+/.test(value)) return undefined;
  return /^[a-z]/.test(value) ? value : undefined;
}

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
      ? 'COMBINATION C2: a high rung on a narrow approach (isolated / mountain_pass)'
      : 'COMBINATION C1: a high rung on a working approach';
  }
  if (rank <= LOW_RUNG_TO) {
    return narrow
      ? 'COMBINATION C5: a low rung on a narrow approach'
      : 'COMBINATION C4: a low rung on a working approach';
  }
  return 'COMBINATION C3: the middle rungs';
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
  if (Number(foodBalance.deficit) > 0) return 'FOOD: deficit';
  if (Number(foodBalance.surplus) > 0) return 'FOOD: surplus';
  return 'FOOD: balanced';
}

/**
 * DS-ECO-2's granary key. Seasons off ⇒ no tile ⇒ no sentence (R-DST-K).
 * @param {{available?: unknown, band?: unknown}|null|undefined} granaryOutlook
 * @returns {string|null}
 */
export function granaryPoolKey(granaryOutlook) {
  if (!granaryOutlook?.available) return null;
  const band = text(granaryOutlook.band);
  return band ? `GRANARY: ${band}` : null;
}

/**
 * DS-ECO-12's income-concentration bands.
 *
 * JUDGMENT (vetoable). The annex names the three states in words — "one source carries
 * the town", "two or three sources between them", "a broad spread, no leader" — and
 * leaves the cut to the implementer. The cut here reads the LEADER'S SHARE, because that
 * is what every variant in the three pools is actually about: C1's ledger line says "well
 * past half", C2's says "no one of them could carry the town alone", C3's says "nothing
 * earns a real portion of the whole". Say "veto" to move either number.
 */
const SOLE_EARNER_FROM = 50;
const LEADER_FROM = 20;

/** @param {unknown} value @returns {number} */
function share(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * DS-ECO-12 lens A — how concentrated the town's earnings are. Null on a settlement with
 * no income roster at all: an unrecorded income mix is silence, not "a broad spread",
 * which would be a fail-soft default wearing a reading's clothes.
 * @param {ReadonlyArray<{percentage?: unknown, isCriminal?: unknown}>|null|undefined} incomeSources
 * @returns {string|null}
 */
export function incomeMixPoolKey(incomeSources) {
  if (!Array.isArray(incomeSources) || incomeSources.length === 0) return null;
  const leader = incomeSources.reduce((best, row) => Math.max(best, share(row?.percentage)), 0);
  if (leader >= SOLE_EARNER_FROM) return 'INCOME MIX: one source carries the town';
  if (leader >= LEADER_FROM) return 'INCOME MIX: two or three sources between them';
  return 'INCOME MIX: a broad spread, no leader';
}

/**
 * DS-ECO-12 lens B — the criminal line, when the roster carries one.
 *
 * Keyed on the record's own `isCriminal` FLAG, never on the source LABEL. The generator
 * spells that line five different ways ("Criminal Syndicate Revenue", "Thieves' Guild
 * Revenue", "Smuggling Network Revenue", "Shadow Economy (untaxed)", "Black Market
 * Revenue"), so a label route would drop four of five and do it without an error
 * anywhere — the label trap, one layer up from the value.
 *
 * "LEADS" means the criminal line is the largest single earner, which is what the pool's
 * own variants say ("The largest single earner at {settlement} is the one that is not
 * written down"). A tie is NOT a lead: the strict comparison is deliberate, because a
 * criminal line level with a lawful one is the "present" reading, not the "leads" one.
 * @param {ReadonlyArray<{percentage?: unknown, isCriminal?: unknown}>|null|undefined} incomeSources
 * @returns {string|null}
 */
export function criminalIncomePoolKey(incomeSources) {
  if (!Array.isArray(incomeSources)) return null;
  const criminal = incomeSources.filter((row) => row?.isCriminal);
  if (criminal.length === 0) return null;
  const dirtiest = criminal.reduce((best, row) => Math.max(best, share(row?.percentage)), 0);
  const cleanest = incomeSources
    .filter((row) => !row?.isCriminal)
    .reduce((best, row) => Math.max(best, share(row?.percentage)), 0);
  return dirtiest > cleanest
    ? 'INCOME MIX: the criminal line leads'
    : 'INCOME MIX: a criminal line is present';
}

/**
 * DS-ECO-12 lens C — the OUTWARD / INWARD read, as a total partition of the
 * (exports, imports) cross with the entrepôt override on top.
 *
 *   entrepôt with transit goods marked   → the transit pool
 *   nothing out, something in            → imports only, nothing outward
 *   nothing out, nothing in              → no significant exports
 *   something out, something in          → both present
 *   something out, nothing in            → local production listed, IF there is local
 *                                          production to point at
 *
 * THE ONE HOLE, DECLARED RATHER THAN FILLED. A town that exports, imports nothing and
 * lists no local production has NO pool in this block, and this returns null. The corpus
 * authored five states and that is the sixth; routing it into "local production listed"
 * would print "a good portion of what the town consumes is made inside its own walls"
 * over a settlement with no recorded local production, which is a sentence with no
 * evidence under it. Silence is R-DST-K and is the true statement here.
 *
 * The transit marker is the generator's own ` (transit)` suffix
 * (`economicState.js` builds it), not a re-derivation of entrepôt status from the route.
 * @param {{primaryExports?: unknown, primaryImports?: unknown, localProduction?: unknown,
 *   isEntrepot?: unknown}|null|undefined} eco
 * @returns {string|null}
 */
export function tradeProfilePoolKey(eco) {
  // NO RECORD IS NOT AN EMPTY RECORD, and the difference is the whole of law 2. A
  // settlement whose economicState carries none of the three trade rosters has not been
  // measured as trading nothing — it has not been measured. Reading that as "no
  // significant exports" would print a confident sentence about a town off the back of an
  // absent field, which is the fail-soft default this subsystem exists to refuse. An
  // EMPTY array is a real reading and keeps its pool.
  if (!Array.isArray(eco?.primaryExports) && !Array.isArray(eco?.primaryImports)
    && !Array.isArray(eco?.localProduction)) return null;
  const exports_ = Array.isArray(eco?.primaryExports) ? eco.primaryExports : [];
  const imports_ = Array.isArray(eco?.primaryImports) ? eco.primaryImports : [];
  const local = Array.isArray(eco?.localProduction) ? eco.localProduction : [];
  const transit = exports_.some((good) => typeof good === 'string' && good.includes('(transit)'));
  if (eco?.isEntrepot && transit) {
    return 'TRADE PROFILE: isEntrepot, transit goods marked among the exports';
  }
  if (exports_.length === 0) {
    return imports_.length > 0
      ? 'TRADE PROFILE: imports only, nothing outward'
      : 'TRADE PROFILE: no significant exports';
  }
  if (imports_.length > 0) return 'TRADE PROFILE: exports and imports both present';
  return local.length > 0 ? 'TRADE PROFILE: local production listed' : null;
}

/**
 * DS-ECO-6's capture tiers. THE NUMBERS ARE THE ANNEX'S OWN, spelled in the pool keys
 * themselves (`≥30`, `≥15`, `≥3`), so there is no implementer's cut to veto here — only a
 * transcription, and the desk test walks 0..100 against the corpus to prove it is faithful.
 *
 * BELOW THREE IS NOT A TIER, IT IS NO SURFACE. `EconomicsTab` renders no Shadow Economy
 * section under 3 % capture, and R-DST-K says the absence of a surface is the absence of a
 * sentence — so this returns null there rather than reaching for the minor pool.
 *
 * A MISSING `blackMarketCapture` IS ALSO NULL, and that is the sharper of the two. A
 * settlement with no safety profile has not been measured as having no shadow economy; it
 * has not been measured. `Number(undefined)` is NaN and every comparison against it is
 * false, so a bare ladder would have fallen through to null by luck rather than by
 * decision — this says it out loud so a later `|| 0` cannot quietly turn "unmeasured" into
 * "clean".
 * @param {{blackMarketCapture?: unknown}|null|undefined} safetyProfile
 * @returns {string|null}
 */
export function shadowEconomyPoolKey(safetyProfile) {
  const capture = Number(safetyProfile?.blackMarketCapture);
  if (!Number.isFinite(capture)) return null;
  if (capture >= 30) return 'TIER: a large share off the books (≥30)';
  if (capture >= 15) return 'TIER: significant off-book activity (≥15)';
  if (capture >= 3) return 'TIER: minor shadow activity (≥3)';
  return null;
}

/**
 * DS-ECO-3's pool key, from the canonical live-flow reading.
 *
 * A DRIFT IS A MEASUREMENT OR IT IS NOTHING. `flowDerivedDependency` returns null on
 * every world with no measured throughput — dormant, isolated, decayed away, or below the
 * kernel's own epsilon — and this returns null with it. There is deliberately no "assume
 * adequate" arm: a town whose roads were never measured has not been measured as busy,
 * and "Caravans keep to their rounds" over an unmeasured world is a default wearing a
 * reading's clothes. `LiveTradeFlowSection` does not render there either, so R-DST-K makes
 * the same answer twice.
 *
 * KEYED ON THE PRODUCER'S OWN BAND TOKEN, never on its `label` ("Trade choked", "Trade
 * steady", "Trade brisk"), which is the display word and not the datum — the label trap.
 * An unrecognised band is null rather than a fall into `ADEQUATE`, on the same reasoning
 * `prosperityHeaderPoolKey` refuses an unknown rung.
 *
 * ⛔ ONE OF THE FIVE POOLS IS UNREACHABLE IN EVERY WORLD THE ENGINE CAN BUILD, and this
 * is a FINDING declared here rather than a hole papered over. `throughputBand`'s
 * non-dependent branch is `throughput > ABUNDANT_CEIL ? SURPLUS : ADEQUATE` — it has no
 * shortage arm at all — so `SHORTAGE × not trade-dependent` can never be keyed. MEASURED
 * by exhaustion over the producer: of 361 (inflow, outflow) points, 63 reach a shortage
 * band WITH dependency and 0 reach one without.
 *
 * THE CORPUS IS NOT WRONG, AND NEITHER IS THE PRODUCER — they disagree about one word.
 * The corpus wrote for empty roads on a town that does not need them ("in a town that
 * lives off its own fields, quiet roads are a matter of company rather than supply"); the
 * producer folds that state into `ADEQUATE` alongside ordinary traffic. THE ONE ACT THAT
 * LIGHTS IT is a shortage arm on the non-dependent branch of `throughputBand`, which
 * moves a shipped band distribution and is a tuning call, not a desk's. It is pinned in
 * the desk test as an EXPOSURE of the producer's shape, so the day that arm lands the pin
 * reds and someone reads this paragraph instead of rediscovering it.
 *
 * ONLY THE TWO EXTREME BANDS SPLIT BY DEPENDENCY. That is the corpus's shape, not a
 * simplification: a town's dependency changes what quiet roads MEAN and does not change
 * what ordinary ones mean, so `ADEQUATE` is one pool and the other two are two each.
 * @param {{band?: unknown, tradeDependent?: unknown}|null|undefined} drift
 * @returns {string|null}
 */
export function tradeFlowPoolKey(drift) {
  const band = text(drift?.band);
  if (band === 'adequate') return 'ADEQUATE';
  if (band !== 'shortage' && band !== 'surplus') return null;
  return drift?.tradeDependent
    ? `${band.toUpperCase()} \u00d7 trade-dependent`
    : `${band.toUpperCase()} \u00d7 not trade-dependent`;
}

/**
 * One DS-ECO-12 lens as a rung, or NOTHING.
 *
 * A sentence-less rung is NULL here, and that is a departure from the file's other four
 * surfaces rather than an inconsistency. `legibilityRung`'s asymmetry — "a rung with no
 * sentence is still a rung" — is earned by the glance and the detail standing on their
 * own, and the prosperity header has both. These three lenses have NEITHER: the position
 * is a paragraph under a heading the page already prints, so a rung whose corpus went
 * silent has nothing at any depth, and handing the component an object that renders
 * nothing invites it to render an empty paragraph. Silence is R-DST-K, and `null` is how
 * this subsystem spells it.
 *
 * This is also what keeps the criminal lens honest on a player's page: the pool's five
 * variants are all `dm-only`, the kernel returns null for the player audience, and this
 * returns null rather than a hollow rung a caller could mistake for a covert seam.
 * @param {{blockId: string, poolKey: string, angle: string, text: string}|null} line
 * @returns {object|null}
 */
function commercialRung(line) {
  return line ? legibilityRung('', line, []) : null;
}

/**
 * The `{good}` fill: the town's own leading export as a BARE noun.
 *
 * The transit suffix is stripped because a transit good is not the town's own trade, and
 * the seam says "sends {good} out" — so the fill is taken from the first export the
 * generator did NOT mark as passing through. Everything else is the shared bare-common
 * refusal: an export the generator spelled with a capital, a digit, an em dash or a
 * snake_case token is not a noun phrase, so the slot goes unfilled and anchored liveness
 * drops the one variant that names it rather than rendering broken English.
 * @param {unknown} exports_
 * @returns {string|undefined}
 */
export function leadingGoodNoun(exports_) {
  if (!Array.isArray(exports_)) return undefined;
  const own = exports_.find((good) => typeof good === 'string' && good !== ''
    && !good.includes('(transit)'));
  return typeof own === 'string' ? bareCommonFill(own.trim()) : undefined;
}

/**
 * THE DESK. Returns one legibility rung per surface, or null where the surface itself
 * does not render.
 *
 * @param {EconomyDeskSettlement|null|undefined} settlement
 * @param {{foodBalance?: FoodBalanceView|null, granaryOutlook?: GranaryOutlookView|null,
 *   flowDrift?: {band?: unknown, tradeDependent?: unknown}|null}} [readings] the canonical
 *   derived readings, as their own owners return them — this desk derives none of them.
 * @param {{seed?: string, audience?: string}} [options]
 * The last key is `foodSecurityRung`, NOT `foodSecurity`, and the difference is load
 * bearing rather than cosmetic. Every other key here names a SURFACE or a RUNG; that one
 * named an ENGINE RECORD — `economicState.foodSecurity`, a real container with `label`
 * and `stockpile` and no `sentence` anywhere on it. The reader-with-no-writer walker
 * binds a shape by member-access name and follows it through a function's return into
 * its callers, so the old spelling handed every consumer of this desk a value whose NAME
 * promised a record it is not, and the first consumer to read `.sentence` off it was
 * convicted for it. A key that lies about its own shape is a defect at the seam, not at
 * the call site.
 * @returns {Readonly<{prosperityHeader: object|null, prosperityRung: object|null, foodTile: object|null, granaryTile: object|null, foodSecurityRung: object|null, incomeMix: object|null, criminalLine: object|null, tradeProfile: object|null, shadowEconomy: object|null, tradeFlow: object|null}>}
 */
export function economyStateProse(settlement, readings = {}, options = {}) {
  const eco = settlement?.economicState || {};
  const name = text(settlement?.name);
  const prosperity = typeof eco.prosperity === 'string' ? eco.prosperity : text(eco.prosperity?.tier);
  // The CANONICAL ladder reader, never a hand-rolled band match: a second spelling of
  // the rung ladder in this file is exactly the fork that drifts.
  const rank = prosperityRank(eco.prosperity);
  const access = text(eco.tradeAccess)
    || text(settlement?.economicViability?.metrics?.tradeAccess);
  const granary = readings.granaryOutlook;
  const foodBalance = readings.foodBalance;

  // The generator's display string is the right thing for a LABEL ROW and the wrong thing
  // for a SEAM: its eleven values are title-cased and five carry an em-dashed gloss. The
  // row keeps the datum; the seam takes only what conforms to the slot's declared shape.
  const complexityDisplay = text(eco.economicComplexity);

  const slots = {
    settlement: name,
    // `isolated` deliberately contributes no fill — see ACCESS_NOUN.
    access: ACCESS_NOUN[access],
    complexity: bareCommonFill(complexityDisplay),
    season: bareCommonFill(text(granary?.season)),
    good: leadingGoodNoun(eco.primaryExports),
    // `{faction}` IS DELIBERATELY UNFILLED, and this is the finding rather than an
    // omission. DS-ECO-12's one criminal `counterforce` variant names it, and the acting
    // party there is a criminal organisation — but the raw settlement's factions carry
    // `{faction, power, desc}` and NO archetype: `archetype` exists only on the DERIVED
    // FactionProfile that `deriveFactionProfile` builds. A desk never derives what a
    // canonical reader owns, and reading `.archetype` off the raw roster would be a read
    // of a key no writer produces — the reader-with-no-writer defect, which is removed
    // rather than shipped. Filling it from the income LABEL instead ("Thieves' Guild
    // Revenue") would name a revenue LINE where the sentence names a HOUSE: the label
    // trap, one layer up. So the slot stays empty, anchored liveness drops that single
    // variant, and its pool keeps 2 of 3 — MEASURED in the desk test, not assumed.
  };

  /** @param {string} blockId @param {string|null} poolKey */
  const line = (blockId, poolKey) => (poolKey
    ? readStateProse(CORPUS, blockId, poolKey, { ...options, slots })
    : null);

  // The ROW composes its own article from the one noun table rather than a second table
  // carrying its own. Byte-identical to what this row has always rendered: the SEAM form
  // and the LABEL-ROW form are different facts and one table was serving both.
  const accessRow = access
    ? {
      label: 'Approach',
      value: ACCESS_NOUN[access] ? `the ${ACCESS_NOUN[access]}` : 'nothing that reaches it easily',
    }
    : null;

  /** @type {Array<{label: string, value: string}>} */
  const headerDetail = [];
  if (accessRow) headerDetail.push(accessRow);
  if (complexityDisplay) headerDetail.push({ label: 'Economy', value: complexityDisplay });

  const headerKey = prosperityHeaderPoolKey(rank, access);
  const foodKey = foodTilePoolKey(foodBalance);
  const granaryKey = granaryPoolKey(granary);
  const securityKey = foodSecurityPoolKey(eco.foodSecurity?.label, eco.foodSecurity?.stockpile);
  const mixKey = incomeMixPoolKey(eco.incomeSources);
  const crimeKey = criminalIncomePoolKey(eco.incomeSources);
  const tradeKey = tradeProfilePoolKey(eco);
  const shadowKey = shadowEconomyPoolKey(eco.safetyProfile);
  const flowKey = tradeFlowPoolKey(readings.flowDrift);

  return Object.freeze({
    prosperityHeader: headerKey
      ? legibilityRung(prosperity, line('DS-ECO-1', headerKey), headerDetail)
      : null,
    prosperityRung: rank >= 0
      ? legibilityRung(prosperity, line('DS-ECO-8', prosperity.toUpperCase()), [])
      : null,
    foodTile: foodKey
      ? legibilityRung(text(foodBalance?.display), line('DS-ECO-2', foodKey),
        [{ label: 'Produced against need', value: text(foodBalance?.detail) }])
      : null,
    granaryTile: granaryKey
      ? legibilityRung(text(granary?.band), line('DS-ECO-2', granaryKey),
        [{ label: 'Season', value: text(slots.season) }])
      : null,
    foodSecurityRung: securityKey
      ? legibilityRung(text(eco.foodSecurity?.label) || securityKey,
        line('DS-ECO-9', securityKey), [])
      : null,
    // THE COMMERCIAL PROFILE — three lenses over one record, drawn at ONE position. The
    // GLANCE is empty on all three on purpose: the position is a paragraph under a
    // section heading the page already prints, not a band tile, and `rungSpeaks` is
    // satisfied by the sentence. The detail rows stay with the bars and the chips the
    // section already renders; a rung that repeated them would be the page saying one
    // fact twice at one position.
    incomeMix: commercialRung(line('DS-ECO-12', mixKey)),
    criminalLine: commercialRung(line('DS-ECO-12', crimeKey)),
    tradeProfile: commercialRung(line('DS-ECO-12', tradeKey)),
    // THE SHADOW ECONOMY. Same shape as the three above and for the same reason: the
    // position is a paragraph inside a section that already prints the capture figure and
    // its band, so the rung has no glance and no detail of its own to stand on.
    //
    // ⚠ THE `canonical` ANGLE IS THE LIVE STRING. Two of this block's variants are
    // byte-identical hand copies of EconomicsTab's own `scaleNote`, which is why the tab
    // draws this sentence INSTEAD OF that one rather than under it — a corpus line and its
    // own twin an inch apart is the page saying one thing twice. The tab keeps `scaleNote`
    // as the standing text for every reader this desk does not draw for, so the public
    // dossier is byte-identical.
    shadowEconomy: commercialRung(line('DS-ECO-6', shadowKey)),
    // THE LIVE FLOW. Same `canonical`-angle hazard as the shadow economy above: three of
    // this block's variants are copies of tradeFlowEconomics.js's own BAND_COPY headlines,
    // and they have ALREADY drifted (the corpus spells a period where the live string has
    // an em dash). The section draws this line instead of that one, never under it.
    tradeFlow: commercialRung(line('DS-ECO-3', flowKey)),
  });
}
