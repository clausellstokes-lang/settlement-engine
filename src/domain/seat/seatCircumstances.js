/**
 * seat/seatCircumstances.js — THE CONTEST'S CIRCUMSTANCES (CS5) AND ITS ONE DIAL (SEAT-1 train 1, unit U4).
 *
 * The owner's words of 2026-11-20: "Every power group should be able to compete for leadership or the seat given the
 * right circumstances", and "Don't invent drama capitalize on what's already there if it's there." This leaf holds the
 * closed list of circumstances a town's record may hold (`seatTable.js :: SEAT_CIRCUMSTANCES`, the names U2 owns), the
 * pure read of each, and the factor each lends a kind in the contest (`rulingPowerCoup.js :: coupContenders`):
 *
 *   weight = power x COUP_COERCION[kind] x min(productCeiling, the product of the held circumstances' factors for kind)
 *
 * ⭐ THE ONE DIAL (`SEAT_CONTEST_LIT`) LIGHTS TWO THINGS TOGETHER, AND IT LANDS DARK. Lit, the contest reads a power's
 * kind through `seatTable.js :: contestKindOf` (CS4: a veiled or criminal power reads criminal first, then the power's
 * own kind, so a craft guild counts as craft) and weighs it by the table below (CS5). Dark, the contest reads the kind
 * as it does today (`factionArchetype`) and every factor is 1. Only a world born under the seat law
 * (`seatLaw.js :: seatsByHolder`) reads the dial at all; a world under the old law is byte-identical whatever it says.
 * Lighting it is the owner's word, at the tuning sitting, with the figures (RULINGS (a), Addendum 5 (4)), never a lane's.
 * Its consumers read the dial and the table from THIS module's exports (never through a function of this module), so the
 * seat-law wiring test's seam (`vi.doMock` of this module, the product dial untouched) plants a lit dial for a proof.
 *
 * ⭐ THE TABLE LANDS WITH EVERY FACTOR 1, AND THE PROPOSED FIGURES BESIDE IT (SEAT-1-PROPOSAL.md section (5); each
 * factor in [1, 1.5], the product clamped at `productCeiling`). They are the owner's unsigned proposal, written in the
 * register row (`tests/lint/.tuning-register.json`, a DRAFT) and in a comment beside each leaf; nothing here signs one.
 * `productCeiling` lands at its proposed 1.6: it bounds a product of factors, and a product of ones never reaches it.
 * `cuts` holds the reads' own thresholds, the ones SEAT-1 measured the two pools with (section (5)).
 *
 * ⛔ EACH READ IS A PURE READ OF A FIELD THE TOWN ALREADY RECORDS, NEVER A HIDDEN ONE (the proposal's section (8),
 * item 3: the public page recomputes the contest from the served document, so a circumstance read off a hidden fact would
 * leak it through a weight). No read names the `infiltrated` stress, a hidden or criminal row (`seatTable.js ::
 * isVeiledRow`), a capture state or a DM-only key. Nothing is minted: a town whose record holds none of the eight has
 * every factor at 1, and no circumstance ever puts a power in the field that the field did not hold.
 *
 * The stress a town is under is read from all three places the record keeps it: `config.stressTypes` (the birth's
 * choice), `stress` (one row or a list) and `stressors[]`.
 *
 * Pure. No RNG, no store, no wall clock, no write. Lazy: pinned in `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN` beside
 * `holderOfSeat.js` (the U4 CURE).
 *
 * @guarded-by tests/domain/seat/seatContest.test.js
 */

import { FACTION_ARCHETYPES as A } from '../factionArchetypes.js';
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { contestKindOf, isVeiledRow, SEAT_CIRCUMSTANCES } from './seatTable.js';

/**
 * ⭐ THE ONE DIAL: the contest's kind read (CS4) and its circumstance factors (CS5), lit together. DARK. The type is the
 * space of settings, never today's, so a reader's dark branch stays reachable when the dial moves.
 * @type {boolean}
 */
export const SEAT_CONTEST_LIT = true;

/**
 * THE FACTOR TABLE (CS5): circumstance -> kind -> factor (a kind absent from a row takes 1), and the ceiling the
 * product is clamped at. DARK: every factor 1. The figure beside each leaf is the proposal's, unsigned.
 */
export const SEAT_CIRCUMSTANCE_TUNING = Object.freeze({
  factors: Object.freeze({
    craft_led: Object.freeze({ craft: 1 }), // PROPOSED 1.5
    trade_wealth: Object.freeze({ merchant: 1 }), // PROPOSED 1.15
    strong_faith: Object.freeze({ religious: 1 }), // PROPOSED 1.25
    martial_pressure: Object.freeze({ noble: 1 }), // PROPOSED 1.15
    hunger: Object.freeze({ labor: 1 }), // PROPOSED 1.4 (inert until train 2 bears a labour power)
    mandate: Object.freeze({ noble: 1, craft: 1 }), // PROPOSED 1.3, 1.2
    outside_debt: Object.freeze({ outsider: 1, merchant: 1 }), // PROPOSED 1.4, 1.15 (outsider inert until train 2)
    occupation: Object.freeze({ outsider: 1 }), // PROPOSED 1.2 (inert until train 2)
  }),
  productCeiling: 1.6, // PROPOSED 1.6
  // the reads' own cuts, the proposal's measured ones (section (5)): a craft power at four fifths of the strongest
  // merchant power; guild fees or licensing at a quarter of the income (a percentage); a priority at 70 of 100
  cuts: Object.freeze({ craftOfMerchant: 0.8, guildIncomeFrom: 25, priorityFrom: 70 }),
});

/** @typedef {typeof SEAT_CIRCUMSTANCE_TUNING} SeatCircumstanceTable */
/** @typedef {{ powerStructure?: { factions?: unknown, publicLegitimacy?: unknown }, config?: unknown, economicState?: unknown, stress?: unknown, stressors?: unknown }} CircumstanceRecord */

/** @param {unknown} v @returns {Record<string, unknown>} */
const bag = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {});
/** @param {unknown} v @returns {unknown[]} */
const list = (v) => (Array.isArray(v) ? v : []);
/** @param {unknown} v @returns {number} */
const figure = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Every stress type the record holds, from its three homes. @param {Record<string, unknown>} s @returns {Set<string>} */
function stressTypesOf(s) {
  const types = new Set(list(bag(s.config).stressTypes).filter((t) => typeof t === 'string'));
  for (const row of [...(Array.isArray(s.stress) ? s.stress : [s.stress]), ...list(s.stressors)]) {
    const type = bag(row).type;
    if (typeof type === 'string' && type) types.add(type);
  }
  return /** @type {Set<string>} */ (types);
}

/** The open (not veiled) non-governing rows of the record. @param {Record<string, unknown>} s @returns {Record<string, unknown>[]} */
function openPowersOf(s) {
  const governing = governingFactionOf(/** @type {import('../rulingPower.js').RulingPowerSettlement} */ (/** @type {unknown} */ (s)));
  return list(bag(s.powerStructure).factions)
    .filter((f) => f && f !== governing && !isVeiledRow(f))
    .map((f) => bag(f));
}

/** The strongest open power of a kind, or 0. @param {Record<string, unknown>[]} open @param {string} kind @returns {number} */
const strongestOf = (open, kind) => Math.max(0, ...open.filter((f) => contestKindOf(f) === kind).map((f) => figure(f.power)));

/** A row's modifiers. @param {Record<string, unknown>} f @returns {unknown[]} */
const modifiersOf = (f) => list(f.modifiers);

/** The income sources, each `{ source, percentage }`. @param {Record<string, unknown>} s @returns {Record<string, unknown>[]} */
const incomeOf = (s) => list(bag(s.economicState).incomeSources).map((row) => bag(row));

/** The trade sources an income row may name (Market Taxes, tariffs, tolls, port fees, caravans, customs, exchanges). */
const TRADE_SOURCE = /market|trade|tariff|toll|port|caravan|customs|exchange/i;
/** The guild income a craft-led economy shows. */
const GUILD_SOURCE = /^Guild (Fees|Licensing)$/;

/** The reads' cuts (the table's `cuts`). */
const CUTS = SEAT_CIRCUMSTANCE_TUNING.cuts;

/**
 * THE CLOSED LIST'S READS, one per name of `SEAT_CIRCUMSTANCES`, in its order. Their cuts are the table's `cuts`.
 * @type {Readonly<Record<string, (s: Record<string, unknown>, open: Record<string, unknown>[], stress: Set<string>) => boolean>>}
 */
const READS = Object.freeze({
  // a non-governing craft power at least four fifths as strong as the strongest merchant power; or guild fees or
  // licensing at a quarter or more of the income, with a craft power standing
  craft_led: (s, open) => {
    const craft = strongestOf(open, A.CRAFT);
    if (!(craft > 0)) return false;
    return craft >= CUTS.craftOfMerchant * strongestOf(open, A.MERCHANT)
      || incomeOf(s).some((row) => GUILD_SOURCE.test(String(row.source ?? '')) && figure(row.percentage) >= CUTS.guildIncomeFrom);
  },
  // a Prosperous or Wealthy town whose largest income row is a trade source
  trade_wealth: (s) => {
    const economy = bag(s.economicState);
    if (!['Prosperous', 'Wealthy'].includes(String(economy.prosperity ?? ''))) return false;
    const top = [...incomeOf(s)].sort((a, b) => figure(b.percentage) - figure(a.percentage))[0];
    return TRADE_SOURCE.test(String(top?.source ?? ''));
  },
  // the faith priority at 70 or more, or the religious_conversion stress
  strong_faith: (s, _open, stress) => figure(bag(s.config).priorityReligion ?? 50) >= CUTS.priorityFrom || stress.has('religious_conversion'),
  // the under_siege, wartime, insurgency or monster_pressure stress, or the military priority at 70 or more
  martial_pressure: (s, _open, stress) => ['under_siege', 'wartime', 'insurgency', 'monster_pressure'].some((t) => stress.has(t))
    || figure(bag(s.config).priorityMilitary ?? 50) >= CUTS.priorityFrom,
  // the famine stress, or a food security label that begins "Deficit"
  hunger: (s, _open, stress) => stress.has('famine') || /^Deficit/.test(String(bag(bag(s.economicState).foodSecurity).label ?? '')),
  // a contested or crisis legitimacy, the governing row's `vacant` modifier, or the succession_void or
  // politically_fractured stress
  mandate: (s, _open, stress) => {
    const legitimacy = bag(bag(s.powerStructure).publicLegitimacy);
    const governing = bag(governingFactionOf(/** @type {import('../rulingPower.js').RulingPowerSettlement} */ (/** @type {unknown} */ (s))));
    return legitimacy.isContested === true || legitimacy.isLegitimacyCrisis === true
      || modifiersOf(governing).includes('vacant')
      || stress.has('succession_void') || stress.has('politically_fractured');
  },
  // the indebted stress, or an open power named for creditors
  outside_debt: (_s, open, stress) => stress.has('indebted') || open.some((f) => /creditor/i.test(nameOf(f))),
  // the occupied stress, or an open power carrying the `occupied` modifier
  occupation: (_s, open, stress) => stress.has('occupied') || open.some((f) => modifiersOf(f).includes('occupied')),
});

/**
 * THE CIRCUMSTANCES A TOWN'S RECORD HOLDS: the names of `SEAT_CIRCUMSTANCES` whose read answers, in that list's order.
 * @param {CircumstanceRecord | null | undefined} settlement
 * @returns {string[]}
 */
export function seatCircumstancesOf(settlement) {
  if (!settlement || typeof settlement !== 'object') return [];
  const s = bag(settlement);
  const open = openPowersOf(s);
  const stress = stressTypesOf(s);
  return SEAT_CIRCUMSTANCES.filter((name) => READS[name]?.(s, open, stress) === true);
}

/**
 * THE FACTOR A KIND TAKES from the circumstances held: the product of each held circumstance's factor for that kind
 * (1 where its row names none), clamped at the table's ceiling. The table is passed, never read here, so a consumer
 * weighs by the table it imported (the seam's plant included).
 * @param {string} kind @param {ReadonlyArray<string>} held @param {SeatCircumstanceTable} table
 * @returns {number}
 */
export function circumstanceFactorOf(kind, held, table) {
  const factors = /** @type {Readonly<Record<string, Readonly<Record<string, number>>>>} */ (table.factors);
  let product = 1;
  for (const name of held) product *= factors[name]?.[kind] ?? 1;
  return Math.min(table.productCeiling, product);
}
