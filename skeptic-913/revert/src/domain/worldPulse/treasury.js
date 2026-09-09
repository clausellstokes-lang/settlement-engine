/**
 * domain/worldPulse/treasury.js — THE STATE TREASURY: the estate's first conserved
 * COIN stock (W-COIN-1a — the stock, the flag, the lifecycle; W-COIN-1b — taxation).
 *
 * Until this leaf there was no money in the world. `incomeSources` narrates taxation
 * in prose, prosperity is an OPINION whose smallest transactable unit is one band, and
 * the only conserved material stock is the granary's `storageMonths`. The peace
 * engine's own executor says so in its header: "There is NO treasury and NO
 * conserved-coin primitive anywhere in the estate." This leaf is that primitive, and
 * the ruling that forbade it (f3cf639e, no-conserved-coin) was REVERSED by owner order
 * (ODQ §731.1, Q-W8 GRANTED). The architecture is docs/DESIGN_W_COIN.md as amended by
 * AMENDMENT A1, which outranks the body; Q10/A1.21 and Q11/A1.23 (ODQ §763.2) are the
 * two ratifications this car ships under.
 *
 * ── WHAT THIS CAR CONTAINS, AND WHAT IT DELIBERATELY DOES NOT ─────────────────
 * 1a landed the STOCK and its lifecycle: the record, the accessors, the derived
 * capacity, the ONE transfer primitive, the ONE cross-settlement applicator, the ONE
 * governing-power resolution law, and the ONE pulse writer behind the ONE flag door.
 * 1b adds TAXATION — the writer's ONE mint kind — with eight closed TAX_FORMS, five
 * ordered TAX_RATE_BANDS, a frozen 6×8 profile keyed on RULING_POWERS, and the
 * legitimacy price of extraction.
 *
 * W-COIN-2 adds the first SINK — deployment upkeep — and with it the two receipt kinds a
 * cost that can fail to be met needs (`upkeep_paid`, `treasury_shortfall`), the closed
 * COIN_FLOW_TERMS ledger, and the conservation identity as a function this module owns
 * rather than as a sentence a test restates.
 *
 * STILL DELIBERATELY DORMANT: no caller of the transfer primitive ships — the first are
 * the eight enumerated coin flows, which are behind their own observation-window fork —
 * so it stays fully unit-tested and unreached, which a later reader must not mistake for
 * "unfinished".
 *
 * NEVER, in any car (design §4.3 + A1.3, and these are design violations rather than
 * judgment calls): negative coin — an unpayable cost becomes a typed SHORTFALL receipt,
 * because debt is a genuinely new capability class and is owner-gated; coin from RNG;
 * coin written anywhere outside the writer + applicator pair; any exchange rate between
 * coin and grain, in either direction.
 *
 * ── THE UNIT, DECLARED AT BIRTH (the §711.6 law) ──────────────────────────────
 * `treasury.coin` is ABSOLUTE INTEGER STATE-COIN. Never per-capita, never re-expressed
 * in months or bands at rest; bands are DISPLAY derivations only, and they arrive in a
 * later car. Four sightings in this program's memory say what happens to a numeric
 * field with no declared unit: it acquires a DIFFERENT unit at every consumer and
 * nothing ever reds, because each consumer is internally consistent. So the unit is
 * declared in three places that a reader cannot miss — this header, the
 * `SimEconomicState` typedef, and the fieldManifest row's `displayRule` — and every
 * consumer reads through `coinOf()` / `treasuryCapacity()` rather than touching the
 * raw field. INTEGER, not the granary's tenth-month float, so the conservation
 * property is exact by construction: the §713.3 incident moved 1 leaf in 29 on nothing
 * but float associativity, and 28 of 29 rounded identically, so a smaller corpus would
 * have shipped the drift.
 *
 * ── STAGE-ORDER IS LAW, NOT LUCK (A1.4) ──────────────────────────────────────
 * EVERY COIN-DELTA EMITTER RUNS AT A PULSE STAGE AFTER `settlement_clock`. The writer
 * runs INSIDE `settlement_clock` (pulseKernel's per-settlement loop, beside
 * `advanceFoodStockpile`), so the vault a mover draws on later in the same tick is the
 * vault this pass left behind — and `computeCoinTransfer`'s committed-debit/credit
 * contract is what keeps two draws in one tick honest with each other. The law is
 * asserted in tests/domain/treasury.test.js, not merely written here.
 *
 * ── WHY THE SUMMARY KEY IS `coinFlows` AND NOT `flows` (measured, not preferred) ──
 * The design's record literal names it `flows`. It ships as `coinFlows`, and the reason is
 * a LEAF-NAME COLLISION that was measured rather than guessed. `routeNetworkFlows.js` and
 * `routeNetworkLedger.js` already mint a per-edge usage record `{ a, b, flows, tally,
 * receipts }` whose `flows` carries `goods`, and `sovereigntyReach.js` reads
 * `usage.flows.goods`. The observed-shape instrument keys shapes BY LEAF NAME, so a second
 * unrelated `flows` record makes the corpus's `flows` shape ambiguous — and when this leaf
 * was briefly made corpus-visible, that instrument immediately reported
 * `sovereigntyReach.js: goods on flows — read of a key no writer produces`. An innocent,
 * correct module was accused because of THIS module's field name.
 * That is the estate's own recorded `eventLog` hazard, verbatim: "TWO UNRELATED RECORDS
 * SHARE THE LEAF NAME, AND THAT IS THE WHOLE FINDING." The ruled CONTENT is untouched —
 * the same five integer terms, the same last-tick-only law, no history array ever — and
 * only the key name moves, so the collision cannot be re-created by a later car.
 *
 * PURE + DETERMINISTIC: no rng, no wall clock, no mutation (every function returns a
 * new object or the input unchanged). Lazy leaf — imported only by the pulse kernel's
 * settlement_clock loop and by tests, so it adds zero eager first-paint bytes.
 */

import { governingFactionOf } from '../rulingPower.js';
import { factionArchetype } from '../factionArchetypes.js';
import { rulingPowerFromArchetype, RULING_POWERS } from '../spatial/cohesionWeave.js';
import { nativeSemanticNames } from '../content/customContentSemanticAuthority.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { prosperityRank } from '../../data/constants.js';
import { applyLegitimacyDeltasToUpdates } from './generosityUpdates.js';

/**
 * TREASURY_TUNING — every constant this subsystem owns, in one frozen export.
 *
 * ⚠ TUNING-SIGNATURE-ADJACENT, EVERY VALUE. W-COIN ships PROVISIONAL numbers; the
 * owner signs real values at the endgame tuning pass (the TIME-IS-NOT-THE-CONSTRAINT
 * law — these are declared inputs to that pass, never silently final). A 300-year soak
 * must not show monotone coin explosion, and that trajectory is a tuning-pass input in
 * its own right.
 */
export const TREASURY_TUNING = Object.freeze({
  /** The payer's untouchable vault floor, in absolute coin. A crown may be beggared by
   *  a treaty; it may not be emptied to the last penny by one, because a court at zero
   *  cannot pay a garrison and the shortfall receipt is the honest signal instead. The
   *  coin twin of TREATY_TRANSFER_TUNING.RESERVE_MONTHS (1.5 storage-months).
   *  TUNING-SIGNATURE-ADJACENT. */
  COIN_RESERVE: 25,
  /** The share of a transferred load that reaches the payee; the remainder is destroyed
   *  on the road (spoilage, escort, graft). Strictly < 1 so the channel is a SINK:
   *  absolute coin is reduced by a transfer, never created. Mirrors the sack path's
   *  capture band. TUNING-SIGNATURE-ADJACENT. */
  TRANSFER_CAPTURE: 0.6,
  /** Vault capacity by settlement tier, in absolute coin — what the settlement's civic
   *  infrastructure could ever hold at once. Mirrors the granary's tier table idiom
   *  (foodStockpile.storageCapacityMonths): capacity is DERIVED on every read and
   *  NEVER persisted, so a re-tiered settlement re-derives instead of carrying a stale
   *  ceiling. TUNING-SIGNATURE-ADJACENT. */
  CAPACITY_BASE_BY_TIER: Object.freeze({
    thorp: 120, hamlet: 240, village: 600, town: 2400, city: 9000, metropolis: 24000,
  }),
  /** Capacity for a tier this table does not name (a custom or legacy tier string).
   *  Fail-neutral at the village rung rather than zero: a zero ceiling would make every
   *  mint a phantom mint-and-burn. TUNING-SIGNATURE-ADJACENT. */
  CAPACITY_BASE_DEFAULT: 600,
  /** Fiscal-institution capacity multipliers, applied over the tier base. The sniffing
   *  family is the one economicState's income generator already uses for the same four
   *  institutions, so the vault and the income prose agree about what a banking house
   *  is. Multiplicative and stacked; a settlement with none keeps its tier base.
   *  TUNING-SIGNATURE-ADJACENT. */
  CAPACITY_INSTITUTION_MULTIPLIERS: Object.freeze({
    /** A banking district or a stock exchange — the deepest fiscal infrastructure. */
    majorFinance: 1.6,
    /** A banking house or a money changer — the shallower rung. Never stacked with
     *  majorFinance; the generator's own income table treats them as an either/or. */
    minorFinance: 1.3,
    /** A city hall / civic treasury / strongroom — the vault itself. Stacks. */
    civicVault: 1.15,
  }),
  /** W-COIN-1b — the taxation mint's base yield per tick, by tier, in absolute coin
   *  BEFORE form shares, band multipliers and the prosperity scalar. Scaled to the
   *  capacity table above so a full year of customary taxation is a meaningful fraction
   *  of a vault rather than a rounding error or an instant overflow.
   *  TUNING-SIGNATURE-ADJACENT. */
  BASE_YIELD_BY_TIER: Object.freeze({
    thorp: 2, hamlet: 4, village: 10, town: 40, city: 150, metropolis: 400,
  }),
  /** Fail-neutral base for an unnamed tier, at the village rung (the capacity idiom). */
  BASE_YIELD_DEFAULT: 10,
  /** Band → multiplier on a form's share of the base yield. `none` is a real zero: a
   *  crown that does not levy a form collects nothing from it. TUNING-SIGNATURE-ADJACENT. */
  BAND_MULTIPLIERS: Object.freeze({
    none: 0, light: 0.5, customary: 1, heavy: 1.6, extractive: 2.2,
  }),
  /** Prosperity rank (0 Subsistence … 6 Wealthy) → scalar on the base. The OPINION feeds
   *  the base ONE-WAY; the stock never writes back to it. An unreadable band resolves to
   *  the `customary` middle rather than to zero. TUNING-SIGNATURE-ADJACENT. */
  PROSPERITY_SCALARS: Object.freeze([0.45, 0.6, 0.75, 1, 1.2, 1.45, 1.7]),
  PROSPERITY_SCALAR_DEFAULT: 1,
  /** The legitimacy price of extraction, per PRESENT coercive form at each band, and the
   *  per-tick cap on their sum. Integer, negative, clamped — the deltas ride the ONE
   *  existing legitimacy applicator, which re-clamps to [0,100] itself.
   *  TUNING-SIGNATURE-ADJACENT. */
  LEGITIMACY_PRICE_BY_BAND: Object.freeze({ heavy: 1, extractive: 3 }),
  LEGITIMACY_PRICE_CAP: 6,
  /**
   * W-COIN-2 — THE UPKEEP SINK's band table: how big the host in the field is, and what
   * keeping it costs the crown for one tick. Ordered lightest-first; the LAST row is the
   * catch-all and carries no threshold, so the table is total over every finite strength
   * without an `Infinity` that a serializer would have to have an opinion about.
   *
   * ⚠⚠ THE UNIT IS CAPACITY POINTS ON THE 0..100 MILITARY-CAPACITY SCALE (§711.6, declared
   * at birth like every other number this module owns) — `deployment.currentEffectiveStrength`,
   * which `warArmyRecord.seedDeploymentState` mints from `capacityFor(id).offensive` and the
   * attrition kernel then erodes. A bled army is a cheaper army, which is the honest reading:
   * the crown pays for the force it still has in the field, not the one it sent.
   *
   * ⛔ IT IS DELIBERATELY *NOT* `deployment.deployedPopulation`, WHICH THE CHARTER NAMED, AND
   * THE REASON WAS MEASURED RATHER THAN PREFERRED — see `upkeepBandFor` for the receipt.
   *
   * SCALE, stated so the provisional numbers can be argued with: a town yields ~40 coin a
   * tick at customary rates and fields a `host`, so a town at war spends most of its revenue
   * on its army and feels it; a city yields ~150 and fields a `great_host`, so a city can
   * campaign; a hamlet yields ~4 and cannot fund a company for a single tick, which is why
   * the shortfall receipt exists and why it never blocks the deployment. TUNING-SIGNATURE-ADJACENT.
   */
  UPKEEP_BY_STRENGTH_BAND: Object.freeze([
    Object.freeze({ band: 'token', upToStrength: 20, coin: 2 }),
    Object.freeze({ band: 'company', upToStrength: 35, coin: 8 }),
    Object.freeze({ band: 'host', upToStrength: 55, coin: 25 }),
    Object.freeze({ band: 'great_host', upToStrength: null, coin: 55 }),
  ]),
  /**
   * W-COIN-2 — THE DISPLAY BANDS, over `coin / treasuryCapacity(settlement)`. Ordered
   * emptiest-first; the last row is the catch-all, the same total-by-construction shape
   * the upkeep table uses.
   *
   * `empty` is EXACTLY zero coin rather than a low fraction, deliberately: a crown with
   * nothing at all is a different sentence from a crown that is merely short, and the
   * band words are the only thing a reader ever sees. TUNING-SIGNATURE-ADJACENT.
   */
  BAND_BY_FILL: Object.freeze([
    Object.freeze({ band: 'lean', upToFill: 0.25 }),
    Object.freeze({ band: 'adequate', upToFill: 0.6 }),
    Object.freeze({ band: 'full', upToFill: 0.95 }),
    Object.freeze({ band: 'overflowing', upToFill: null }),
  ]),
  /** W-COIN-3 — THE COFFERS READ's horizon: the number of ticks of army wages a crown
   *  must be able to cover before the war reads stop counting money as a pressure at all.
   *  A court that can pay for this long scores zero; one that cannot pay for a single tick
   *  scores one. TUNING-SIGNATURE-ADJACENT. */
  COVERAGE_FULL_AT: 12,
  /** How many ticks a ledger must have been OPEN before the coffers read is admitted.
   *  A treasury that opened last tick is empty because it is NEW, not because the crown
   *  is broke, and a war read that could not tell those apart would manufacture decisive
   *  pressure out of the act of lighting a flag. TUNING-SIGNATURE-ADJACENT. */
  COVERAGE_OBSERVED_AFTER: 4,
});

/**
 * TREASURY_RECEIPT_KINDS — the closed receipt vocabulary this car can actually EMIT.
 *
 * FINITE-SEMANTICS: typed buckets, no free-text keys, ever. The list holds exactly the
 * kinds 1a emits and not one more. Declaring 1b's `tax_receipt` or W-COIN-2's
 * `upkeep_paid` here would be dead arms — a mark that passes every existence census
 * while nothing can ever draw it — which is the failure mode this program has already
 * measured twice. Each car adds its kinds in the same act as its emitter.
 *
 * @type {ReadonlyArray<string>}
 */
export const TREASURY_RECEIPT_KINDS = Object.freeze([
  /** The ledger began counting. Minted once, at the first lit tick, at coin 0. */
  'treasury_opened',
  /** Revenue is suspended because an occupying authority holds the settlement. */
  'suspended_by_occupation',
  /** Revenue is suspended because the settlement is under siege. */
  'suspended_by_siege',
  /** W-COIN-2 — the crown paid its army for this tick, in whole or in part. Carries the
   *  strength BAND resolved at flow time, never re-derived from a later reading of an army
   *  that has since bled or been reinforced. */
  'upkeep_paid',
  // ⭐ `treasury_shortfall` RETURNS HERE, AND ITS ROUND TRIP IS THE ROSTER'S OWN PROOF.
  // 1a declared it on the reasoning that `computeCoinTransfer` "receipts a shortfall" — but
  // the primitive is PURE and reports its shortfall as a FIELD on its return value, not as
  // a summary receipt kind, and 1a shipped no caller to convert one into the other. The
  // reachability arm convicted it and it was STRUCK. The upkeep sink below is the first
  // thing in the design that can genuinely fail to pay, so the kind is drawn now by a real
  // emitter, in the same act — which is the law this roster exists to enforce, observed
  // working in both directions on one field.
  /** W-COIN-2 — a cost the vault could not meet in full. NEVER a negative balance and
   *  NEVER a blocked deployment: debt is a genuinely new capability class and is
   *  owner-gated, so the honest signal is a receipt and a pressure read, not an overdraft. */
  'treasury_shortfall',
  /** W-COIN-1b — a lit tick's taxation mint, carrying the per-form band and amount
   *  RESOLVED AT FLOW TIME. History is never re-derived from current rates: a receipt
   *  that said only "taxed 40" would silently re-price itself the day a coup retypes the
   *  seat. (The one FMG steal — the deal records its own tax.) */
  'tax_receipt',
  /** W-COIN-1b — the legitimacy price of extraction, the stock's ONLY opinion write. */
  'legitimacy_price',
]);

/**
 * TAX_FORMS — the closed vocabulary of what a state can tax (W-COIN-1b, design §5.2).
 *
 * FINITE-SEMANTICS: eight typed buckets, no free-text keys. Each is grounded in the
 * `incomeSources` families the generator ALREADY narrates, so taxation taxes the economy
 * the settlement actually has rather than an invented one. `misc_trade` is the catchall
 * that keeps the vocabulary CLOSED against open-vocabulary custom-content labels: an
 * unmatched row lands there rather than minting a ninth form.
 * @type {ReadonlyArray<string>}
 */
export const TAX_FORMS = Object.freeze([
  'land_rents', 'market_tolls', 'port_customs', 'licensing',
  'justice_fees', 'tithe_share', 'levy_extraction', 'misc_trade',
]);

/**
 * TAX_RATE_BANDS — closed and ORDERED, lightest first. Rates are BANDS, never free
 * floats: a float is a number nobody can argue with, and the whole point of a typed rate
 * is that a reader can see a crown is squeezing without reading a decimal.
 * @type {ReadonlyArray<string>}
 */
export const TAX_RATE_BANDS = Object.freeze(['none', 'light', 'customary', 'heavy', 'extractive']);

/**
 * The COERCIVE form. `extractive` is reachable ONLY on a coercive row — either this form,
 * or any row of a `criminal` seat, whose whole economy IS the racket the estate already
 * narrates. Asserted structurally in the tests, not left as a convention, because a
 * profile cell that could quietly become extractive is a tuning knob nobody voted on.
 */
export const COERCIVE_TAX_FORMS = Object.freeze(['levy_extraction']);

/**
 * THE PROFILE — RULING_POWERS × TAX_FORMS, frozen, every cell a TAX_RATE_BANDS member.
 *
 * ⚠ PROVISIONAL VALUES, TUNING-SIGNATURE-ADJACENT, like every constant this module owns.
 * The SHAPE is the ruling; the numbers behind the bands are the owner's at the endgame
 * tuning pass. What the table encodes is character, and it is meant to be readable as
 * such: a merchant league taxes trade and spares land; a theocracy takes its tithe and
 * little else; a council spreads the load flat and stays off the coercive rows; an
 * autocrat leans on land and the levy; a criminal seat runs the town as a racket.
 * @type {Readonly<Record<string, Readonly<Record<string, string>>>>}
 */
export const TAX_PROFILE = Object.freeze({
  autocrat: Object.freeze({
    land_rents: 'heavy', market_tolls: 'customary', port_customs: 'customary', licensing: 'light',
    justice_fees: 'customary', tithe_share: 'light', levy_extraction: 'heavy', misc_trade: 'customary',
  }),
  council: Object.freeze({
    land_rents: 'customary', market_tolls: 'customary', port_customs: 'customary', licensing: 'customary',
    justice_fees: 'customary', tithe_share: 'light', levy_extraction: 'light', misc_trade: 'customary',
  }),
  theocracy: Object.freeze({
    land_rents: 'customary', market_tolls: 'light', port_customs: 'light', licensing: 'light',
    justice_fees: 'customary', tithe_share: 'heavy', levy_extraction: 'light', misc_trade: 'light',
  }),
  merchant_league: Object.freeze({
    land_rents: 'light', market_tolls: 'heavy', port_customs: 'heavy', licensing: 'heavy',
    justice_fees: 'customary', tithe_share: 'none', levy_extraction: 'light', misc_trade: 'heavy',
  }),
  criminal: Object.freeze({
    land_rents: 'light', market_tolls: 'extractive', port_customs: 'customary', licensing: 'extractive',
    justice_fees: 'none', tithe_share: 'none', levy_extraction: 'extractive', misc_trade: 'customary',
  }),
  mixed: Object.freeze({
    land_rents: 'customary', market_tolls: 'customary', port_customs: 'customary', licensing: 'customary',
    justice_fees: 'customary', tithe_share: 'light', levy_extraction: 'light', misc_trade: 'customary',
  }),
});

/**
 * THE LABEL → FORM TABLE, over the literals the generator can actually emit.
 *
 * ⚠⚠ THE DENOMINATOR SPANS TWO FILES, AND THE BRIEF'S DID NOT. The charter specified a
 * source scan over `economicState.js`'s pushed `source:` strings. That file is indeed the
 * ONE writer of `economicState.incomeSources` — but two of the literals it pushes are
 * built in `generators/economy/tradeGoods.js` and handed over as `incomeBonuses`
 * (`Entrepôt Trade`, `International Commerce`), so a one-file scan would have declared
 * totality over a set missing two rows it could never see. The totality test scans BOTH.
 *
 * Unmatched ⇒ `misc_trade`, by `taxFormFor`. Criminal rows never reach this table at all.
 * @type {Readonly<Record<string, string>>}
 */
export const INCOME_SOURCE_FORMS = Object.freeze({
  'Agricultural Rents': 'land_rents',
  'Property Rents': 'land_rents',
  'Toll Revenue': 'market_tolls',
  'Gate Tolls': 'market_tolls',
  'Port Duties': 'port_customs',
  'River Tolls': 'port_customs',
  'Guild Licensing': 'licensing',
  'Guild Fees': 'licensing',
  'Financial Services': 'licensing',
  'Banking Fees': 'licensing',
  'Spellcasting Services': 'licensing',
  'Court Fees & Fines': 'justice_fees',
  'Church Tithes': 'tithe_share',
  'Church Tithes & Rents': 'tithe_share',
  'Pilgrim Trade': 'tithe_share',
  'Military Levy': 'levy_extraction',
  'Military Extraction': 'levy_extraction',
  'Enchanted Goods Premium': 'misc_trade',
  'Grain Sales': 'misc_trade',
  'Iron & Metalwork': 'misc_trade',
  'Security Contracts': 'misc_trade',
  'Stone Quarrying': 'misc_trade',
  'Subsistence Production': 'misc_trade',
  'Timber Trade': 'misc_trade',
  'Wool & Textile Trade': 'misc_trade',
  'Entrepôt Trade': 'misc_trade',
  'International Commerce': 'misc_trade',
});

/**
 * The typed cause the legitimacy price carries. The stock's ONLY write to any opinion,
 * anywhere (§4.4 direction-of-read law): opinions feed the stock's flows as inputs, and
 * the stock never writes an opinion EXCEPT this one declared price.
 */
export const TREASURY_LEGITIMACY_CAUSE = 'treasury_extraction_price';

/**
 * THE CLOSED CRIMINAL-INCOME VOCABULARY — the five labels the generator's black-market
 * branch can author, verbatim (`economicState.js`, the `label` ternary above its push).
 *
 * ⚠⚠ WHY THIS EXISTS BESIDE THE `isCriminal` FLAG, AND IT IS NOT BELT-AND-BRACES FUSS.
 * MEASURED: the observed-shape corpus saw **3,068** `incomeSources` rows across its whole
 * seed × config matrix and NOT ONE carried `isCriminal` — the shape's observed keys are
 * `desc, percentage, priorityNote, source, weight`. The generator really does write the
 * flag, but only down a branch the corpus's worlds never take, so an exclusion resting on
 * the flag ALONE would be dead on every world anyone has ever generated: the racket would
 * be taxed as if it paid tax, and no test built on generated data could see it.
 *
 * So the LABEL set is the live detector — `source` is a key with 3,068 observations — and
 * the flag stays as the honest catch for a custom-content row that marks itself criminal
 * without wearing one of these names. Both are asserted; the label set carries a totality
 * test against the generator's own ternary, so a sixth label cannot be added upstream
 * without this list reddening.
 * @type {ReadonlyArray<string>}
 */
export const CRIMINAL_INCOME_LABELS = Object.freeze([
  'Criminal Syndicate Revenue',
  "Thieves' Guild Revenue",
  'Smuggling Network Revenue',
  'Shadow Economy (untaxed)',
  'Black Market Revenue',
]);

/**
 * Is this income row the RACKET rather than the economy? The generator's own committed
 * sentence — "This income stays in the settlement but flows to criminal actors, not the
 * public treasury" — turned into a predicate, and read two ways so neither blind spot
 * bites: by the closed label set (alive on generated worlds) and by the explicit flag
 * (alive on authored/custom ones).
 * @param {Record<string, unknown> | null | undefined} row
 * @returns {boolean}
 */
export function isCriminalIncome(row) {
  if (!row || typeof row !== 'object') return false;
  if (row.isCriminal === true) return true;
  return CRIMINAL_INCOME_LABELS.includes(String(row.source ?? ''));
}

/**
 * The tax form a generator-authored income label belongs to. Matched at derive time
 * against the authored literals; anything unrecognised — a custom `_good_` row, a
 * renamed label, a future family — lands in `misc_trade` so the vocabulary stays CLOSED.
 * @param {unknown} source @returns {string} a TAX_FORMS member
 */
export function taxFormFor(source) {
  const label = String(source ?? '').trim();
  return /** @type {Record<string, string>} */ (INCOME_SOURCE_FORMS)[label] || 'misc_trade';
}

/**
 * TREASURY_SUSPENSIONS — why revenue is suspended, closed and ordered by precedence.
 *
 * A1.14, ruled in car 1 so 1b's mint runs under machinery that already exists. Siege
 * outranks occupation because the generator's own committed sentence is absolute:
 * under siege "all normal economic activity is suspended. Markets are closed"
 * (generators/economy/prosperity.js). Occupation is narrower and directional —
 * "revenue flows outward to the occupying authority" — so it zeroes the OWN vault's
 * yield without pretending the economy stopped.
 *
 * @type {ReadonlyArray<string>}
 */
export const TREASURY_SUSPENSIONS = Object.freeze(['siege', 'occupation']);

/**
 * COIN_FLOW_TERMS — the closed accounting vocabulary of `treasury.coinFlows`, and the
 * ledger THE CONSERVATION WALKER balances (W-COIN-2, the new invariant class).
 *
 * ⭐ WHY FIVE TERMS ARE THE RIGHT CLOSED ENUM AND A ROSTER OF *FLOWS* WOULD NOT BE.
 * The widened Q4 enumeration (A1.9 + A1.15 + the two coin flows §746.1's political
 * amendment adds) names EIGHT owner-visible coin flows by name. Minting those eight as a
 * code vocabulary today would be eight dead arms — a roster naming things no emitter can
 * draw, which is the exact class that struck `treasury_shortfall` out of the receipt
 * roster one car ago. So the eight are enumerated where the owner reads them (this car's
 * landing act) and the CODE's closed enum is the one that is fully alive: every coin
 * movement any of the eight will ever make lands in exactly ONE of these five terms, and
 * the walker proves no sixth key can appear.
 *
 * ⛔ `shortfall` IS NOT A MOVEMENT and must never enter the balance. It is coin that was
 * demanded and NOT paid — the receipt that exists instead of an overdraft. Summing it
 * would leak in the opposite direction from the leak everyone looks for, so the walker
 * asserts its exclusion rather than leaving it to a reader's care.
 * @type {ReadonlyArray<string>}
 */
export const COIN_FLOW_TERMS = Object.freeze([
  'taxed', 'upkeep', 'transferredIn', 'transferredOut', 'shortfall',
]);

/**
 * The signed coin movement a last-tick summary accounts for: what came in, minus what
 * went out. THE CONSERVATION LAW, as a function rather than as a sentence in a test —
 * so the walker balances the module's own arithmetic instead of a restatement of it.
 *
 * Integer in, integer out, no epsilon anywhere: `Δ coin === coinFlowBalance(coinFlows)`
 * must hold exactly at every settlement on every lit tick.
 * @param {{ taxed?: unknown, upkeep?: unknown, transferredIn?: unknown,
 *           transferredOut?: unknown } | null | undefined} coinFlows
 * @returns {number}
 */
export function coinFlowBalance(coinFlows) {
  const f = asObject(coinFlows);
  const n = (/** @type {unknown} */ v) => Math.floor(Number(v) || 0);
  return (n(f.taxed) + n(f.transferredIn)) - (n(f.upkeep) + n(f.transferredOut));
}

/**
 * UPKEEP_LEDGERS — which standing commitments the crown pays for, closed.
 *
 * ONE UPKEEP LAW, PARAMETERIZED BY LEDGER, and this roster holds exactly the ledgers that
 * ship with a real reader. W-SEAT's SEAT-8 widens it to `civilContests` (the incumbent's
 * vault pays the loyal side; the rising pays nothing — the asymmetry is that charter's)
 * and `interventions` (the D9 repression columns), each conjoined with its own flag; both
 * are named in BOTH charters and NEITHER is declared here, because a ledger with no
 * reader is the dead arm this roster refuses. A widening car adds the member and its call
 * site in the same act — never the member alone.
 * @type {ReadonlyArray<string>}
 */
export const UPKEEP_LEDGERS = Object.freeze(['deployments']);

/**
 * UPKEEP_BANDS — the closed, ordered vocabulary of how large a standing commitment is.
 * `none` is the real answer for a crown with nothing in the field, and it is a member
 * rather than a null so every consumer branches on one closed set.
 * @type {ReadonlyArray<string>}
 */
export const UPKEEP_BANDS = Object.freeze(['none', 'token', 'company', 'host', 'great_host']);

/**
 * TREASURY_BANDS — the closed display vocabulary of how full a vault is (design §4.5,
 * verbatim), and the ONE band derivation in the estate.
 *
 * ⛔⛔ EVERY SURFACE READS THIS ONE FUNCTION, AND THE REASON IS THE PROGRAM'S MOST
 * EXPENSIVE RECORDED CLASS. A numeric field with no single declared reading acquires a
 * DIFFERENT reading at every consumer and NOTHING EVER REDS, because each consumer is
 * internally consistent — measured four times in this program's memory, twice in a single
 * wave. The coin chip and the coin news beats are two consumers of one number, shipping in
 * two different cars, and a second threshold table written for the second of them would be
 * exactly that bug. So the thresholds live in `TREASURY_TUNING.BAND_BY_FILL` and both
 * surfaces come through here.
 *
 * ⚠ THE BAND IS A DISPLAY DERIVATION AND IS NEVER PERSISTED (§4.2): the record holds
 * absolute integer coin, and per §776 the LEDGER keeps the exact number as record while
 * every SURFACE speaks bands. Deriving on read is also what keeps a re-tiered settlement
 * honest, exactly as the derived capacity does.
 *
 * @type {ReadonlyArray<string>}
 */
export const TREASURY_BANDS = Object.freeze(['empty', 'lean', 'adequate', 'full', 'overflowing']);

/**
 * How full is this crown's vault, in one closed word? `empty` for a settlement whose
 * ledger was never opened, too — a court with no ledger and a court with no coin look the
 * same from outside, and inventing a sixth word for the difference would put a mechanism
 * on a surface that should only ever carry the world.
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {string} a TREASURY_BANDS member
 */
export function treasuryBandOf(settlement) {
  const coin = coinOf(settlement);
  if (coin <= 0) return 'empty';
  const capacity = treasuryCapacity(settlement);
  if (capacity <= 0) return 'empty';
  const fill = coin / capacity;
  for (const row of TREASURY_TUNING.BAND_BY_FILL) {
    if (row.upToFill === null || fill <= row.upToFill) return row.band;
  }
  return 'overflowing';
}

/**
 * RULING_POWER_BASES — how a ruling-power reading was arrived at, closed.
 * The resolver NEVER throws and NEVER silently skips; when it falls through to the
 * fail-neutral row the receipt says WHICH fall-through happened, so "everything is
 * mixed" can never hide as a plausible-looking answer.
 * @type {ReadonlyArray<string>}
 */
export const RULING_POWER_BASES = Object.freeze([
  /** A governing faction was found and its archetype is on the ruling-power map. */
  'governing_archetype',
  /** No faction carries the governing seat — fail-neutral to 'mixed'. */
  'no_governing_faction',
  /** A governing faction was found but its archetype is off the map (`outsider` /
   *  `other`, or an unrecognised string) — fail-neutral to 'mixed'. */
  'archetype_off_map',
]);

/** The fail-neutral ruling power, and the one every fall-through resolves to. */
const NEUTRAL_RULING_POWER = 'mixed';

/**
 * THE ONE FLAG DOOR of the treasury layer, and the only `treasuryEnabled === true` in
 * the tree. It is read BY NAME with the strict idiom rather than through a frozen-list
 * `.every()`, because a computed member access attributes to NO key and would be fully
 * wired, genuinely gated, and invisible to the engine-gated-key census that exists to
 * see exactly this. It is read ONCE, at the writer, because two doors on one flag is
 * how a deleted guard hides behind a surviving one.
 *
 * A1.21 / Q10, recorded where a reader will hit it: lighting is the PRESET TABLE's,
 * and the flag is LIT in dramatic_campaign / living_realm / full_simulation ONLY AFTER
 * W-COIN-2's band chip lands. Until then it is dark on every owner-presented surface,
 * so a lit world is never glance-blind about a stock it cannot see.
 *
 * ⚠ THE RECEIVER IS SPELLED `rules`, DELIBERATELY, AND THE SHORT FORM WAS MEASURED RATHER
 * THAN ASSUMED. The observed-shape corpus discovers flags by scanning for a
 * `simulationRules….<x>Enabled` receiver and LIGHTS every flag it finds, so the long form
 * would pull this layer into that corpus. Measured at this base: of eight virtual
 * engine-gated keys, SIX are undiscovered (`undercityHighWater`, `pactFormation`,
 * `espionage`, `habitConditioning`, `errandSpine`, `treatyRenewal`) and two are not —
 * undiscovered is the estate's norm for a virtual key, and matching the norm is what keeps
 * this layer from silently re-shaping a governed, content-addressed instrument.
 *
 * @param {unknown} rules simulation rules (may be absent on a legacy path)
 * @returns {boolean}
 */
export function treasuryActive(rules) {
  return !!rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).treasuryEnabled === true;
}

/** @typedef {{ coin: number, openedTick: number, lastTick: number,
 *   coinFlows: { taxed: number, upkeep: number, transferredIn: number,
 *            transferredOut: number, shortfall: number } }} TreasuryRecord */
/** @typedef {{ tier?: unknown, institutions?: unknown, powerStructure?: unknown,
 *   economicState?: { treasury?: unknown, incomeSources?: unknown, prosperity?: unknown } }}
 *   TreasurySettlement
 * ⚠ `incomeSources` and `prosperity` are DECLARED here rather than reached through an
 * `any` cast at the two sites that read them. They are the taxation mint's only inputs
 * besides the tier, so a cast would have put this module's whole revenue model behind a
 * hole the type checker cannot see — and the any-cast ratchet was right to refuse it. */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * The settlement's treasury record, or null when the ledger was never opened.
 * "Opened" means a finite `coin` — the no-backfill witness. A malformed record (a
 * string balance, a null, an array) reads as ABSENT rather than as zero: fail-inert,
 * the `warCosts` idiom, so a corrupt import can never be handed a fabricated vault.
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {TreasuryRecord | null}
 */
function treasuryRecordOf(settlement) {
  const t = asObject(settlement?.economicState?.treasury);
  return Number.isFinite(Number(t.coin)) ? /** @type {TreasuryRecord} */ (/** @type {unknown} */ (t)) : null;
}

/**
 * Has this settlement's ledger been opened? The null-on-absent guard both legs of the
 * transfer primitive stand on.
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {boolean}
 */
export function hasOpenTreasury(settlement) {
  return treasuryRecordOf(settlement) !== null;
}

/**
 * THE ONE COIN READ. Absolute integer state-coin held; 0 when the ledger was never
 * opened or the record is malformed. No consumer may hand-read
 * `economicState.treasury.coin` — the unit law is enforced by everyone coming through
 * here, and a per-capita or banded reading is a bug this accessor makes visible.
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {number} integer ≥ 0
 */
export function coinOf(settlement) {
  const record = treasuryRecordOf(settlement);
  return record ? Math.max(0, Math.floor(Number(record.coin))) : 0;
}

/**
 * THE ONE CAPACITY READ — DERIVED on every call, never persisted (the
 * `storageCapacityMonths` idiom). Tier base × fiscal-institution multipliers, floored
 * to integer coin. A settlement whose tier or institutions change re-derives its
 * ceiling instead of carrying a stale one, which is the whole reason the granary's
 * capacity is derived too.
 *
 * Institution names come through `nativeSemanticNames` — the custom-content semantic
 * authority — so an authored institution is read by what it IS, not by whatever a
 * player typed.
 *
 * ⛔ THE ROSTER IS RUIN-FILTERED, through the canonical `liveInstitutions` accessor.
 * This is a CREDITING read — a banking district raises the ceiling by 60% — and a
 * crediting read over the raw roster gives a flattened building its full function, so a
 * town whose banking district burned down in a calamity would keep a vault ceiling it no
 * longer has any means to hold. The granary's sibling capacity derivation carries the
 * same guard in its own spelling; this one uses the shared accessor.
 *
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {number} integer ≥ 0
 */
export function treasuryCapacity(settlement) {
  const standing = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement));
  const names = nativeSemanticNames(/** @type {Parameters<typeof nativeSemanticNames>[0]} */ (standing))
    .map((/** @type {string} */ name) => String(name).toLowerCase());
  const has = (/** @type {string[]} */ ...fragments) => names
    .some((/** @type {string} */ n) => fragments.some(f => n.includes(f)));
  const tier = String(settlement?.tier || '');
  const bases = /** @type {Record<string, number>} */ (TREASURY_TUNING.CAPACITY_BASE_BY_TIER);
  const base = Number.isFinite(bases[tier]) ? bases[tier] : TREASURY_TUNING.CAPACITY_BASE_DEFAULT;
  const mult = TREASURY_TUNING.CAPACITY_INSTITUTION_MULTIPLIERS;
  // Either/or on the finance rung — the income generator treats a banking district and
  // a banking house as alternatives, not as a stack, and the vault agrees with it.
  const finance = has('banking district', 'stock exchange') ? mult.majorFinance
    : has('banking house', 'money changer') ? mult.minorFinance
      : 1;
  const vault = has('city hall', 'civic treasury', 'strongroom') ? mult.civicVault : 1;
  return Math.max(0, Math.floor(base * finance * vault));
}

/**
 * THE ONE GOVERNING RESOLUTION LAW (A1.12 part 1, ratified as Q11/A1.23).
 *
 * Every W-COIN read of "who rules here" comes through this function, and it is shared
 * with W-SEAT. It composes the three pieces the estate already has —
 * `governingFactionOf` (which faction holds the seat), `factionArchetype` (the closed
 * 13-value archetype enum) and `rulingPowerFromArchetype` (the closed 6-value
 * RULING_POWERS enum) — and it is the ONLY composition of them a treasury read may use.
 *
 * ⛔ IT NEVER READS `powerStructure.government`. That field is FREE TEXT with four
 * writers and no normalizer, and every existing consumer branches on it by REGEX with
 * the recorded consequence that ordinary labels like `Town Council` match nothing and
 * silently score zero. Adding a ninth regex consumer is precisely the open-vocabulary
 * disease this program exists to refuse; normalizing the field itself is a real but
 * separate cross-cutting migration, docketed rather than smuggled in here.
 *
 * FAIL-NEUTRAL, NEVER THROWING, NEVER SILENTLY SKIPPING: both fall-throughs resolve to
 * `'mixed'` and the returned `basis` says which one happened, so a world that is all
 * `mixed` for a structural reason is distinguishable from one that is all `mixed`
 * because it genuinely is.
 *
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {{ power: string, basis: string }} `power` ∈ RULING_POWERS, `basis` ∈ RULING_POWER_BASES
 */
export function resolveRulingPower(settlement) {
  const governing = governingFactionOf(/** @type {Parameters<typeof governingFactionOf>[0]} */ (settlement));
  if (!governing) return { power: NEUTRAL_RULING_POWER, basis: 'no_governing_faction' };
  const power = rulingPowerFromArchetype(factionArchetype(governing));
  // `rulingPowerFromArchetype` already fails soft to 'mixed' for `outsider` / `other`
  // and for anything unrecognised, so the off-map case is detected by the RESULT
  // rather than by re-listing the archetype map here — one map, one place.
  const onMap = RULING_POWERS.includes(power) && power !== NEUTRAL_RULING_POWER;
  return { power, basis: onMap ? 'governing_archetype' : 'archetype_off_map' };
}

/**
 * THE ONE TRANSFER PRIMITIVE — every settlement→settlement coin movement in every car
 * goes through here. Inherited clause by clause from the grain executor's TRUE
 * contract (A1.1 restated the body's summary, which had the reserve clause wrong):
 *
 *  1. RESERVE FLOOR, ALL-OR-NOTHING. The payer may only spend what stands above
 *     `COIN_RESERVE`, and it pays the demanded amount IN FULL or it pays nothing at
 *     all — receipted as a shortfall for the whole amount. Nothing is ever scraped off
 *     the floor, and no leg ever half-executes.
 *  2. NULL ON ABSENT, BOTH LEGS. When EITHER party's ledger was never opened the
 *     primitive returns null and nothing happens — no fabricated vault on either side.
 *  3. CAPTURE ≤ 1. The road/graft sink. The remainder is DESTROYED, receipted by the
 *     out/in asymmetry rather than by a second bookkeeping field.
 *  4. INTEGER FLOOR-ROUNDING, SINK-BIASED. Both legs floor, so
 *     `credited ≤ debited × capture` always holds and rounding can only ever
 *     under-credit. Coin is never minted by arithmetic.
 *  5. PAYEE HEADROOM. Credit is clamped to the payee's derived capacity headroom and
 *     the clamped remainder is destroyed too — the payer still loses what it paid, the
 *     way a sacked granary's overflow is lost rather than refunded.
 *  6. SAME-TICK COMPOSITION. `committedDebit` / `committedCredit` carry what THIS
 *     tick's earlier movements already reserved, so a second draw sees the vault the
 *     first one left behind. Without them two terms would price against the same
 *     untouched stock and could jointly drive a payer past its reserve floor.
 *
 * CONSERVATION, exactly: `credited − debited === −destroyed`, in integers, with no
 * epsilon anywhere.
 *
 * NO CALLER SHIPS IN 1a — the first callers are W-COIN-3's movers. This is deliberate
 * and is why the primitive lands fully unit-tested and dormant.
 *
 * @param {{ payer?: TreasurySettlement | null, payee?: TreasurySettlement | null,
 *           amount?: number, captureFraction?: number,
 *           committedDebit?: number, committedCredit?: number }} args
 * @returns {{ debited: number, credited: number, destroyed: number, shortfall: number } | null}
 */
export function computeCoinTransfer({
  payer, payee, amount = 0, captureFraction = TREASURY_TUNING.TRANSFER_CAPTURE,
  committedDebit = 0, committedCredit = 0,
} = {}) {
  const want = Math.floor(Math.max(0, Number(amount) || 0));
  if (want <= 0) return null;
  // Clause 2 — either ledger unopened ⇒ nothing half-executes, and nothing is invented.
  if (!hasOpenTreasury(payer) || !hasOpenTreasury(payee)) return null;
  const owed = Math.max(0, Math.floor(Number(committedDebit) || 0));
  const held = Math.max(0, Math.floor(Number(committedCredit) || 0));
  // Clause 1 + 6 — spendable is what stands above the floor AFTER this tick's earlier draws.
  const spareable = coinOf(payer) - TREASURY_TUNING.COIN_RESERVE - owed;
  if (spareable < want) return { debited: 0, credited: 0, destroyed: 0, shortfall: want };
  // Clauses 3 + 4 — capture is a sink, and flooring keeps it one under both roundings.
  const capture = Math.max(0, Math.min(1, Number(captureFraction)));
  const grossCredit = Math.floor(want * capture);
  // Clause 5 — the payee's headroom, over the vault this tick's earlier credits left.
  const headroom = Math.max(0, treasuryCapacity(payee) - (coinOf(payee) + held));
  const credited = Math.max(0, Math.min(grossCredit, headroom));
  return { debited: want, credited, destroyed: want - credited, shortfall: 0 };
}

/**
 * THE ONE APPLICATOR for cross-settlement coin deltas — the `applyFoodDeltasToUpdates`
 * shape, in integers. Movers that later grow a coin leg emit deltas into here; none of
 * them ever becomes a second writer.
 *
 * Clamped to [0, derived capacity] so a credit can never push a vault past a ceiling
 * the writer also stops mints at (the clamp is a SAFETY NET, never the mechanism), and
 * never below zero because negative coin does not exist. A settlement whose ledger was
 * never opened is SKIPPED rather than opened here: only the writer opens a ledger, and
 * only at a lit tick, so the no-backfill law has exactly one gatekeeper.
 *
 * Returns the INPUT ARRAY BY REFERENCE when nothing moved — the unchanged-tick identity
 * every applicator in this family keeps.
 *
 * @param {Array<{ saveId?: unknown, settlement?: unknown }>} updates
 * @param {Map<string, number>} updateIndex
 * @param {Map<string, number>} coinDeltas
 * @returns {Array<{ saveId?: unknown, settlement?: unknown }>}
 */
export function applyCoinDeltasToUpdates(updates, updateIndex, coinDeltas) {
  const input = Array.isArray(updates) ? updates : [];
  if (!coinDeltas || coinDeltas.size === 0) return updates;
  let next = input;
  let cloned = false;
  for (const [id, delta] of coinDeltas) {
    if (!delta) continue;
    const ui = updateIndex.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = /** @type {TreasurySettlement | undefined} */ (entry?.settlement);
    const record = treasuryRecordOf(settlement);
    if (!record) continue;                              // never opened here — the writer's job alone
    const cap = treasuryCapacity(settlement);
    const current = coinOf(settlement);
    const nextCoin = Math.max(0, Math.min(cap, Math.floor(current + Number(delta))));
    if (nextCoin === current) continue;
    if (!cloned) { next = input.slice(); cloned = true; }
    const economicState = asObject(settlement?.economicState);
    next[ui] = {
      ...entry,
      settlement: {
        .../** @type {Record<string, unknown>} */ (/** @type {unknown} */ (settlement)),
        economicState: { ...economicState, treasury: { ...record, coin: nextCoin } },
      },
    };
  }
  return next;
}

/**
 * Which suspension, if any, grips this settlement — A1.14, ruled in car 1.
 *
 * The blockade record is the one the granary pass ALREADY derived for this settlement
 * this tick (`foodStockpile.blockadeFor`), threaded in rather than re-detected here.
 * That is deliberate and it is the §711.6 discipline applied to a boolean: a second,
 * independently-written occupied-detector would be internally consistent, disagree with
 * the granary about the same siege, and never red. The vault and the granary answer to
 * ONE reading of what is happening to the town.
 *
 * @param {{ type?: unknown } | null | undefined} blockade
 * @returns {string | null} a TREASURY_SUSPENSIONS member, or null
 */
function suspensionFor(blockade) {
  const type = String(blockade?.type || '');
  if (type === 'siege') return 'siege';
  if (type === 'occupation') return 'occupation';
  return null;
}

/**
 * THE FORM SHARES a settlement actually has — its mapped `incomeSources` percentages,
 * normalised to fractions of the whole ledger.
 *
 * ⛔ `isCriminal: true` ROWS ARE NEVER A TAX BASE, and that is the generator's own
 * committed sentence turned into an assertion: "This income stays in the settlement but
 * flows to criminal actors, not the public treasury." A criminal SEAT taxes the lawful
 * economy harder (its profile row does that); it does not get to tax the racket as if
 * the racket paid tax.
 *
 * Route- and institution-gated forms need no special case: `port_customs` is zero where
 * generation put no port, because no row maps there. Structure decides, by construction.
 *
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {Record<string, number>} form → share of the ledger, each ≥ 0
 */
export function taxFormShares(settlement) {
  const declared = settlement?.economicState?.incomeSources;
  const rows = /** @type {Array<Record<string, unknown>>} */ (Array.isArray(declared) ? declared : []);
  /** @type {Record<string, number>} */
  const byForm = {};
  let total = 0;
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    if (isCriminalIncome(row)) continue;          // the racket is never a tax base
    const pct = Number(row.percentage);
    if (!Number.isFinite(pct) || pct <= 0) continue;
    const form = taxFormFor(row.source);
    byForm[form] = (byForm[form] || 0) + pct;
    total += pct;
  }
  if (total <= 0) return {};
  for (const form of Object.keys(byForm)) byForm[form] /= total;
  return byForm;
}

/** The prosperity scalar for a settlement's band. Opinion feeds the base, ONE WAY.
 *  @param {TreasurySettlement | null | undefined} settlement @returns {number} */
function prosperityScalarOf(settlement) {
  const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (
    settlement?.economicState?.prosperity));
  const scalars = TREASURY_TUNING.PROSPERITY_SCALARS;
  return rank >= 0 && rank < scalars.length ? scalars[rank] : TREASURY_TUNING.PROSPERITY_SCALAR_DEFAULT;
}

/** Is this (power, form) cell allowed to be coercive — and so to carry a price?
 *  @param {string} rulingPower @param {string} form @returns {boolean} */
export function isCoerciveCell(rulingPower, form) {
  return COERCIVE_TAX_FORMS.includes(form) || rulingPower === 'criminal';
}

/**
 * THE TAXATION MINT — the writer's ONE mint kind, and the only place coin is created.
 *
 * ```
 * yield = Σ over forms f PRESENT in the settlement:
 *           baseYield(tier) × formShare(f) × bandMultiplier(profile[rulingPower][f])
 *           × prosperityScalar(prosperityRank) × stressGate(suspension)
 * ```
 * floored to integer coin, then CAPACITY-STOPPED.
 *
 * ⛔⛔ THE CAPACITY STOP IS THE MINT'S ONLY STOCK READ, AND IT DAMPS (A1.16). This is the
 * §11.1 anti-loop answer and it is the reason the formula is worth reading closely: every
 * input is either generation-frozen STRUCTURE (tier, the incomeSources ledger) or an
 * OPINION (prosperity), and not one of them is the vault. So no tax → transfer → tax
 * feedback can exist, and a rich crown does not tax harder for being rich. The tests
 * assert the mint's inputs, not merely its outputs.
 *
 * THE PRICE IS EMITTED EVEN WHEN THE MINT IS STOPPED (A1.16, both halves): the crown that
 * squeezes and cannot even bank the coin still pays the resentment.
 *
 * @param {TreasurySettlement | null | undefined} settlement
 * @param {{ rulingPower?: string, suspension?: string | null }} [options]
 * @returns {{ minted: number, stopped: number, legitimacyDelta: number,
 *   entries: Array<{ form: string, band: string, amount: number }> }}
 */
export function computeTaxYield(settlement, { rulingPower = NEUTRAL_RULING_POWER, suspension = null } = {}) {
  const profile = /** @type {Record<string, Record<string, string>>} */ (TAX_PROFILE)[rulingPower]
    || TAX_PROFILE[NEUTRAL_RULING_POWER];
  const shares = taxFormShares(settlement);
  const tier = String(settlement?.tier || '');
  const bases = /** @type {Record<string, number>} */ (TREASURY_TUNING.BASE_YIELD_BY_TIER);
  const base = Number.isFinite(bases[tier]) ? bases[tier] : TREASURY_TUNING.BASE_YIELD_DEFAULT;
  const prosperity = prosperityScalarOf(settlement);
  // A1.14 — siege suspends EVERY form; occupation yields ZERO into the OWN vault. Both
  // gate the whole mint to nothing, and they differ only in the receipt they carry.
  const gate = suspension ? 0 : 1;
  /** @type {Array<{ form: string, band: string, amount: number }>} */
  const entries = [];
  let gross = 0;
  let price = 0;
  for (const form of TAX_FORMS) {
    const share = shares[form];
    if (!(share > 0)) continue;                        // the structure is not there
    const band = profile[form];
    const multipliers = /** @type {Record<string, number>} */ (TREASURY_TUNING.BAND_MULTIPLIERS);
    const amount = Math.floor(base * share * multipliers[band] * prosperity * gate);
    if (amount > 0) gross += amount;
    // RECORDED AT FLOW TIME, band and all — never re-derived from a later rate.
    entries.push({ form, band, amount });
    // …and the price follows the BAND, not the coin: a present coercive form at heavy or
    // extractive costs legitimacy even on a tick that banked nothing.
    if (isCoerciveCell(rulingPower, form)) {
      price += /** @type {Record<string, number>} */ (TREASURY_TUNING.LEGITIMACY_PRICE_BY_BAND)[band] || 0;
    }
  }
  const headroom = Math.max(0, treasuryCapacity(settlement) - coinOf(settlement));
  const minted = Math.max(0, Math.min(gross, headroom));
  // Normalised so a priceless tick is 0 and never −0: negative zero compares equal to 0
  // but serializes as `-0`, and a persisted or asserted `-0` is a trap nobody enjoys.
  const owed = Math.min(TREASURY_TUNING.LEGITIMACY_PRICE_CAP, Math.round(price));
  return {
    minted,
    stopped: gross - minted,
    legitimacyDelta: owed > 0 ? -owed : 0,
    entries,
  };
}

/**
 * THE UPKEEP BAND of a standing commitment — how big is the thing the crown is paying for?
 *
 * ⛔⛔ WHY THIS READS `currentEffectiveStrength` AND NOT THE CHARTER'S NAMED
 * `deployedPopulation`. MEASURED AT THIS BASE, not preferred:
 *
 *   `deployment.deployedPopulation` is written in exactly two places, `warHomeCosts.js`'s
 *   conscription branch and its levy branch, and BOTH sit behind sub-flags —
 *   `warEconomyDrainEnabled` and `warLevyEnabled` — which are `false` in
 *   DEFAULT_SIMULATION_RULES and are lit in `full_simulation` AND NOWHERE ELSE.
 *   `seedDeploymentState` does not mint the field at all. So on `dramatic_campaign` — the
 *   one preset besides full_simulation that lights `warLayerEnabled`, i.e. the flagship
 *   preset on which wars actually happen — every deployment record carries NO
 *   `deployedPopulation`, and an upkeep keyed on it would have been IDENTICALLY ZERO on
 *   every world anyone plays. An army would march, the granary would drain, and the vault
 *   would pay nothing, with every existence census green.
 *
 *   That is the same failure mode this lane already measured once, one car ago: the
 *   criminal-income exclusion rested on an `isCriminal` flag that 3,068 corpus rows never
 *   carried. Second sighting, different field, same shape — an input that is real in the
 *   source and absent in the worlds.
 *
 *   `currentEffectiveStrength` is on EVERY stateful record by construction: the aging pass
 *   makes every committed deployment stateful before any later stage reads it, and the
 *   field is seeded from `capacityFor(id).offensive` with no sub-flag anywhere in its
 *   path. Its unit is CAPACITY POINTS on the 0..100 military-capacity scale — declared
 *   here, in the tuning table, and asserted against the real producer in the tests, so
 *   this reading cannot quietly become a headcount at some later consumer.
 *
 * FAIL-INERT: a record with no readable strength bands to `none` and is charged nothing.
 * A charge invented for an army nobody can measure would be worse than a missing one, and
 * the tests drive a REAL `seedDeploymentState` record through here so a silent `none`
 * cannot become the answer for every world without something reddening.
 *
 * @param {{ currentEffectiveStrength?: unknown, maxStartStrength?: unknown,
 *           targetId?: unknown } | null | undefined} record
 * @returns {string} an UPKEEP_BANDS member
 */
export function upkeepBandFor(record) {
  if (!record || typeof record !== 'object' || !record.targetId) return 'none';
  const live = Number(record.currentEffectiveStrength);
  const start = Number(record.maxStartStrength);
  const strength = Number.isFinite(live) ? live : (Number.isFinite(start) ? start : NaN);
  if (!Number.isFinite(strength) || strength <= 0) return 'none';
  for (const row of TREASURY_TUNING.UPKEEP_BY_STRENGTH_BAND) {
    if (row.upToStrength === null || strength <= row.upToStrength) return row.band;
  }
  // Unreachable while the table's last row is the catch-all; the totality test pins that
  // it is, so this is the fail-neutral answer rather than an exception nobody could act on.
  return 'none';
}

/** The coin one tick of a band costs. `none` costs nothing, by construction.
 *  @param {string} band @returns {number} integer ≥ 0 */
export function upkeepCostOfBand(band) {
  const row = TREASURY_TUNING.UPKEEP_BY_STRENGTH_BAND.find((r) => r.band === band);
  return row ? Math.max(0, Math.floor(row.coin)) : 0;
}

/**
 * THE UPKEEP SINK — the writer's first destroying flow, and ONE LAW PARAMETERIZED BY LEDGER.
 *
 * Charges are `{ ledger, record }` pairs; today the writer passes exactly one, the
 * `deployments` one-army ledger the granary pass already reads for the same settlement on
 * the same tick. The shape is the parameterization W-SEAT's SEAT-8 widens (`civilContests`,
 * `interventions`) by adding a member to UPKEEP_LEDGERS and a caller in the same act — so
 * the widening is new call sites, never a second upkeep law.
 *
 * ⛔ THE RESERVE FLOOR DOES NOT APPLY HERE, and the distinction is the whole reason
 * `COIN_RESERVE` exists. The reserve protects the vault from being emptied by a TREATY, in
 * its own words, *because* "a court at zero cannot pay a garrison". Upkeep is the garrison.
 * It spends the vault to the last coin and floors at zero; what it cannot meet becomes a
 * shortfall receipt. All-or-nothing is likewise a TRANSFER clause and is deliberately not
 * inherited: upkeep pays what it can and receipts the remainder, which is why the design's
 * receipt carries both `owed` and `paid` — under all-or-nothing, `paid` would be noise.
 *
 * NEVER blocks the commitment it prices. W-COIN does not gate war on money; money pressures
 * the war reads (that is car 3's `coffers`), and an unaffordable army is a crown in trouble
 * rather than an army that fails to exist.
 *
 * @param {number} available the coin on hand THIS tick, after the mint — integer ≥ 0
 * @param {Array<{ ledger?: string, record?: unknown }>} charges
 * @returns {{ owed: number, paid: number, shortfall: number,
 *             entries: Array<{ ledger: string, band: string, owed: number }> }}
 */
export function computeUpkeep(available, charges) {
  const purse = Math.max(0, Math.floor(Number(available) || 0));
  /** @type {Array<{ ledger: string, band: string, owed: number }>} */
  const entries = [];
  let owed = 0;
  for (const charge of Array.isArray(charges) ? charges : []) {
    const ledger = String(charge?.ledger || '');
    if (!UPKEEP_LEDGERS.includes(ledger)) continue;   // closed vocabulary, no free keys
    const band = upkeepBandFor(/** @type {Parameters<typeof upkeepBandFor>[0]} */ (charge?.record));
    const cost = upkeepCostOfBand(band);
    if (cost <= 0) continue;
    // RECORDED AT FLOW TIME, band and all — the one FMG steal, applied to the sink side:
    // a receipt that said only "paid 25" would re-price itself the day the table moves.
    entries.push({ ledger, band, owed: cost });
    owed += cost;
  }
  const paid = Math.min(purse, owed);
  return { owed, paid, shortfall: owed - paid, entries };
}

/**
 * THE COFFERS READ — "how long can this crown pay the army it has in the field?" — and it
 * is ONE reading serving TWO war surfaces (W-COIN-3: `readWarHomeFront`'s sixth component
 * and `readCoalitionExpenditure`'s sixth weighted term).
 *
 * ⛔⛔ IT LIVES HERE, AND NOT IN EITHER CONSUMER, FOR THE REASON THIS PROGRAM HAS PAID FOR
 * FOUR TIMES. A numeric field with no single declared reading acquires a different reading
 * at every consumer and NOTHING EVER REDS, because each consumer is internally consistent.
 * Two war surfaces scoring "can the crown pay?" from two independently-written expressions
 * is that bug with the ink still wet. So the coverage, the observed gate, and the 0..1
 * pressure are computed once, here, beside the unit they are computed from.
 *
 * ⛔ `observed: false` IS NOT A ZERO SCORE — the distinction is load-bearing and it is the
 * §11.2 dilution hazard. `readWarHomeFront` averages `sum / length` over its components,
 * so a sixth component present at score 0 would DILUTE the other five and change a war
 * pressure read on a world where the treasury has nothing to say. An unobserved coffers
 * read must therefore be ABSENT from the component set, never present-and-zero, and the
 * caller is what enforces that; this function only ever reports which case it is.
 *
 * THREE THINGS MUST HOLD before a crown's purse may speak (A1.2 applies the third to BOTH
 * reads): the ledger is OPEN, a real army is in the field, and the ledger has been open
 * for at least `COVERAGE_OBSERVED_AFTER` ticks — because a treasury that opened last tick
 * is empty for a reason that has nothing to do with the crown's finances.
 *
 * @param {TreasurySettlement | null | undefined} settlement
 * @param {{ targetId?: unknown, currentEffectiveStrength?: unknown, maxStartStrength?: unknown } | null | undefined} record
 * @param {unknown} tick the tick the read is taken at
 * @returns {{ observed: boolean, score01: number, coverageTicks: number, upkeepPerTick: number }}
 */
export function coffersRead(settlement, record, tick) {
  const unobserved = { observed: false, score01: 0, coverageTicks: 0, upkeepPerTick: 0 };
  const upkeepPerTick = upkeepCostOfBand(upkeepBandFor(/** @type {Parameters<typeof upkeepBandFor>[0]} */ (record)));
  if (upkeepPerTick <= 0) return unobserved;             // no army in the field — nothing to price
  const ledger = treasuryRecordOf(settlement);
  if (!ledger) return unobserved;                        // the ledger was never opened
  const now = Number(tick);
  const openedTick = Number(ledger.openedTick);
  if (!Number.isFinite(now) || !Number.isFinite(openedTick)
    || now - openedTick < TREASURY_TUNING.COVERAGE_OBSERVED_AFTER) return unobserved;
  const coverageTicks = coinOf(settlement) / upkeepPerTick;
  // Pressure is the INVERSE of coverage: a crown that can pay for the full horizon feels
  // none, and one that cannot pay for a single tick feels all of it.
  const score01 = Math.max(0, Math.min(1, 1 - (coverageTicks / TREASURY_TUNING.COVERAGE_FULL_AT)));
  return { observed: true, score01, coverageTicks, upkeepPerTick };
}

/**
 * Fold the accumulated per-settlement legitimacy prices onto settlementUpdates through
 * the EXISTING single applicator (`generosityUpdates.applyLegitimacyDeltasToUpdates` —
 * bounded, integer, clamped [0,100], legacy-shape-tolerant). Builds the saveId index the
 * applicator wants, exactly as `treatyTransfer.applyTreatyFoodDeltas` does for grain.
 *
 * ⛔ THIS IS NOT A SECOND APPLICATOR AND MUST NEVER BECOME ONE. It is a call-shape
 * adapter over the one that already exists; the clamping, the [0,100] domain and the
 * skip-a-legacy-bare-number rule all stay where they were. A1.16: the stock's only
 * opinion write is this price, through this one door.
 *
 * ⚠ A1.4 — IT MUST BE CALLED AT A PULSE STAGE AFTER `settlement_clock`, because
 * `settlementUpdates` does not exist until `consequence_fold`. The mint runs at the
 * writer; the PRICE rides the writer's summary and lands here. That split is §768.2's
 * amendment, and it is the whole reason this function exists.
 *
 * Empty deltas ⇒ the input array, by reference (the unchanged-tick identity).
 * @param {Array<{ saveId?: unknown }>} settlementUpdates @param {Map<string, number>} legitimacyDeltas
 * @returns {Array<{ saveId?: unknown }>}
 */
export function applyTreasuryLegitimacyDeltas(settlementUpdates, legitimacyDeltas) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  if (!legitimacyDeltas || legitimacyDeltas.size === 0) return settlementUpdates;
  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(u?.saveId), i));
  return /** @type {Array<{ saveId?: unknown }>} */ (
    applyLegitimacyDeltasToUpdates(
      /** @type {Parameters<typeof applyLegitimacyDeltasToUpdates>[0]} */ (updates),
      updateIndex, legitimacyDeltas));
}

/**
 * THE ONE PULSE WRITER. Advance the settlement's treasury one tick.
 *
 * DARK (the flag absent or anything but exactly `true`): returns the INPUT SETTLEMENT
 * BY REFERENCE with a null summary, before reading anything else. No key is created, no
 * field is touched, and a dark world's serialized bytes are identical to a world built
 * before this leaf existed. A key is a byte.
 *
 * LIT, first tick: the ledger OPENS at `{ coin: 0, openedTick: tick }` with a
 * `treasury_opened` receipt. Opening EMPTY is the no-backfill law — no fabricated
 * balance, so every coin that ever exists is traceable to a receipted mint. It is
 * deliberately MORE conservative than its own precedent: the granary regenerates to a
 * generated NONZERO stock, and the treasury does not.
 *
 * LIT, thereafter: `lastTick` advances (bookkeeping, by definition every tick), the
 * suspension verdict is receipted, taxation MINTS (1b) and upkeep SINKS (W-COIN-2) — in
 * that order, revenue then payroll. `transferredIn` / `transferredOut` stay at their zero
 * row because no mover has a coin leg yet; that is the design's own sequencing and not an
 * omission, and saying it here stops a later reader from reading the zero row as a bug.
 *
 * ⭐ THE CONSERVATION LAW HOLDS AT THIS WRITER, EXACTLY AND IN INTEGERS:
 * `Δ coin === coinFlowBalance(coinFlows)` on every lit tick at every settlement, with
 * `shortfall` deliberately outside the sum because it is coin that did NOT move. The
 * conservation walker balances that identity against real drives rather than against a
 * restatement of it, and carries a planted leak that proves it can convict.
 *
 * The receipts are on the RETURNED SUMMARY and are EPHEMERAL. Nothing about them is
 * persisted: `treasury.coinFlows` is a last-tick integer summary and there is no per-tick
 * history array, ever, in any car (the save-size discipline; the pulse news feed is the
 * history surface and it is already capped).
 *
 * @param {TreasurySettlement | null | undefined} settlement
 * @param {{ interval?: unknown, tick?: unknown, deployment?: unknown,
 *           blockade?: { type?: unknown } | null, rules?: unknown }} [options]
 * @returns {{ settlement: TreasurySettlement | null | undefined,
 *             summary: {
 *               tick: number, opened: boolean, coin: number, capacity: number,
 *               band: string, previousBand: string, bandCrossed: boolean,
 *               suspension: string | null,
 *               receipts: Array<{ kind: string, tick: number }>,
 *               rulingPower: string, rulingBasis: string,
 *               taxed: number, taxStopped: number,
 *               taxEntries: Array<{ form: string, band: string, amount: number }>,
 *               upkeepOwed: number, upkeepPaid: number, shortfall: number,
 *               upkeepEntries: Array<{ ledger: string, band: string, owed: number }>,
 *               legitimacyDelta: number, legitimacyCause: string | null,
 *             } | null }}
 */
export function advanceTreasury(settlement, options = {}) {
  // THE DOOR. Everything below this line is unreachable in a dark world.
  if (!treasuryActive(options.rules)) return { settlement, summary: null };
  if (!settlement || typeof settlement !== 'object') return { settlement, summary: null };
  const tick = Number.isFinite(Number(options.tick)) ? Math.floor(Number(options.tick)) : 0;
  const existing = treasuryRecordOf(settlement);
  const suspension = suspensionFor(options.blockade);
  /** @type {Array<{ kind: string, tick: number }>} */
  const receipts = [];
  const opened = !existing;
  if (opened) receipts.push({ kind: 'treasury_opened', tick });
  if (suspension === 'siege') receipts.push({ kind: 'suspended_by_siege', tick });
  if (suspension === 'occupation') receipts.push({ kind: 'suspended_by_occupation', tick });
  const record = existing || {
    coin: 0,
    openedTick: tick,
    lastTick: tick,
    coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 },
  };
  const coin = Math.max(0, Math.floor(Number(record.coin)));
  const economicState = asObject(settlement.economicState);
  // ── W-COIN-1b — THE TAXATION MINT, the writer's ONE mint kind ──────────────────
  // Priced against the vault AS IT STANDS THIS TICK, so the capacity stop reads what the
  // last tick left behind. The ruling power comes from the ONE resolver and nowhere else,
  // so a coup retypes taxation the moment it lands (A1.12 stamps the seat).
  const { power: rulingPower, basis: rulingBasis } = resolveRulingPower(settlement);
  const priced = /** @type {TreasurySettlement} */ ({
    .../** @type {Record<string, unknown>} */ (/** @type {unknown} */ (settlement)),
    economicState: { ...economicState, treasury: { ...record, coin } },
  });
  const taxed = computeTaxYield(priced, { rulingPower, suspension });
  if (taxed.entries.length) receipts.push({ kind: 'tax_receipt', tick });
  if (taxed.legitimacyDelta < 0) receipts.push({ kind: 'legitimacy_price', tick });
  // ── W-COIN-2 — THE UPKEEP SINK, charged AFTER the mint ─────────────────────────
  // Revenue comes in, then the army is paid: the mint prices against the vault the LAST
  // tick left behind (its capacity stop is its only stock read, and it damps), and the
  // sink then spends what that tick actually holds. Charging the sink first would let a
  // court be beggared on a tick its own taxes could have covered, which is neither the
  // order the design states nor the order a treasurer would use.
  // The `deployment` record is the SAME one the granary pass read for this settlement on
  // this tick, and it is already `warLayerEnabled`-gated at the one call site — so upkeep
  // is gated on the war layer AND the treasury flag with no second gate written here,
  // which is the guard-behind-a-guard this layer refuses.
  const upkeep = computeUpkeep(coin + taxed.minted, [{ ledger: 'deployments', record: options.deployment }]);
  if (upkeep.paid > 0) receipts.push({ kind: 'upkeep_paid', tick });
  if (upkeep.shortfall > 0) receipts.push({ kind: 'treasury_shortfall', tick });
  const nextRecord = {
    ...record,
    coin: coin + taxed.minted - upkeep.paid,
    lastTick: tick,
    coinFlows: { ...record.coinFlows, taxed: taxed.minted, upkeep: upkeep.paid, shortfall: upkeep.shortfall },
  };
  const nextSettlement = /** @type {TreasurySettlement} */ ({
    .../** @type {Record<string, unknown>} */ (/** @type {unknown} */ (settlement)),
    economicState: { ...economicState, treasury: nextRecord },
  });
  // W-COIN-2 — THE BAND CROSSING, derived on both sides of the tick through the ONE band
  // reading. Capacity is a function of tier and institutions, neither of which moves
  // inside a tick, so the two readings differ only by the coin the writer just moved.
  //
  // ⛔ AN OPENING IS NOT A CROSSING. On the tick a ledger opens, the "previous" band is
  // `empty` by construction, so the first taxed tick of every settlement in the world
  // would cross `empty → lean` on the SAME tick and the feed would carry one beat per
  // settlement for a bookkeeping event nobody in the world experienced. Suppressed here,
  // at the source, rather than filtered downstream where the reason would be invisible.
  const previousBand = treasuryBandOf(priced);
  const band = treasuryBandOf(nextSettlement);
  return {
    settlement: nextSettlement,
    summary: {
      tick,
      opened,
      coin: nextRecord.coin,
      capacity: treasuryCapacity(nextSettlement),
      band,
      previousBand,
      bandCrossed: !opened && band !== previousBand,
      suspension,
      receipts,
      // W-COIN-1b — the mint's own account of itself. EPHEMERAL, like every receipt:
      // `taxed` is the only part that persists, as a last-tick integer.
      rulingPower,
      rulingBasis,
      taxed: taxed.minted,
      taxStopped: taxed.stopped,
      taxEntries: taxed.entries,
      // W-COIN-2 — the sink's own account of itself, EPHEMERAL like every receipt except
      // the two integers `coinFlows` persists. `upkeepEntries` carries the band each
      // ledger was charged at, resolved at flow time.
      upkeepOwed: upkeep.owed,
      upkeepPaid: upkeep.paid,
      shortfall: upkeep.shortfall,
      upkeepEntries: upkeep.entries,
      // The price RIDES THE SUMMARY and is applied at a later pulse stage through the ONE
      // existing legitimacy applicator (A1.4 / §768.2). The writer never writes an opinion.
      legitimacyDelta: taxed.legitimacyDelta,
      legitimacyCause: taxed.legitimacyDelta < 0 ? TREASURY_LEGITIMACY_CAUSE : null,
    },
  };
}
