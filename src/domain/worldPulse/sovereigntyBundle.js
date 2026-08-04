/**
 * sovereigntyBundle.js — WR-10 amendment S: THE CONSIDERATION, AND WHETHER IT CLEARS.
 *
 * A town is not bought with money. It is bought with a BUNDLE — tribute streams, a
 * compelled banner, another town, the peace itself — and amendment S's whole opinion
 * is that whether such a bundle is "enough" is not a fact about the bundle. It is two
 * opinions, held by two courts, each valuing every component through ITS OWN needs,
 * and a trade exists only in the gap where both are satisfied at once.
 *
 * THE BINDING RULE IS THE RECONCILED TWO-SIDED CONJUNCTION (amendment S's own
 * correction of 2026-08-02, and the correction matters):
 *
 *   (i)  the SELLER's own-lens value of the bundle  ≥  the SELLER's reserve, AND
 *   (ii) the BUYER's own-lens value of the ASSET    ≥  the BUYER's cost of the bundle.
 *
 * Read literally, the earlier seller-reserve-only phrasing would make every offered
 * trade clear and overpayment the guaranteed outcome. Arm (ii) is what makes a court
 * able to want something and still not buy it, and "ceiling reached before reserve
 * met" is arm (ii) failing — a NAMED no-trade outcome that carries a receipt, on the
 * whitePeace precedent: the machinery ran and produced nothing, which is a result.
 *
 * APPROPRIATENESS IS EMERGENT, NEVER A RULE TABLE. There is no list here of which
 * components suit which trade. A component is worth what the valuing court's NEEDS
 * make it worth, so a granary offered to a court drowning in grain contributes ~zero
 * without any rule saying grain is inappropriate — and the same granary offered to a
 * starving one carries the deal. The §15.1 prize-ranking lens, run in both
 * directions.
 *
 * ── THE TR-5 GRACEFUL-DEGRADATION CONTRACT (declared in BOTH programs) ───────────
 *
 * Amendment S names trade rights (exclusivity / market access / toll exemption) as
 * composable components. THEY DO NOT EXIST IN THIS TREE: their catalog rows are minted
 * by FP-GRAMMAR's GR-3 and their executors land at FP-TRADE's TR-5, and until then the
 * bundle composes streams/stores/allyship/settlements/peace only. Both volumes declare
 * that; NEITHER pinned it, and this module is where it becomes mechanical:
 *
 *   • The component family set is DERIVED from `TERM_FAMILIES` at call time. It is
 *     never a hardcoded list, so a family that does not exist cannot be named, and a
 *     family that arrives is composable the moment it lands.
 *   • NO trade-rights literal is spelled anywhere in this module — spelling one would
 *     pre-empt chair ruling R3, which makes GRAMMAR §4 canonical for their spelling,
 *     and would force a rename sweep across three volumes when R3 rules.
 *   • The degraded arm is a LIVE arm, not a disabled one: clearing is reachable on the
 *     families that do exist, and the wave pins a real cleared trade to prove it.
 *   • An absent component reads as ABSENT, never as a zero-valued one. `offered` names
 *     what was on the table and `available` names what the catalog could have offered;
 *     collapsing the two would destroy the one signal that says TR-5 is still owed.
 *
 * `catalogGrewSinceWr10()` is the tripwire, in the shrink-only inventory-ratchet
 * idiom: when TERM_FAMILIES grows past the set that existed when this wave landed,
 * it returns true and the pin that asserts otherwise goes RED — and that red is not a
 * bug, it is the message "a new term family landed; re-read this degradation note,
 * widen the bundle, and delete the arm".
 *
 * ── THE PEACE COMPONENT, AND A DIVERGENCE REPORTED RATHER THAN RULED ─────────────
 *
 * `peace` is a component here and it is NOT a TERM_CATALOG family — the cession rider
 * is the trade being carried IN an envoy term-sheet, which is why WR-10 sequences
 * after WR-7 at all. The war volume's degradation note lists "streams/stores/allyship/
 * settlements/peace"; FP-TRADE §3 Seam One lists the same set WITHOUT `peace`. The two
 * are declared twins and are not twins. This module follows its OWN volume (peace is
 * WR-10's named rider) and the divergence is reported to the validation chair rather
 * than silently resolved; if the chair rules the other way, delete the one member of
 * `SOVEREIGNTY_NON_CATALOG_COMPONENTS` below and the pin that names it will say so.
 *
 * PURE: no rng, no wall-clock, no mutation, no state. K3/K4 safe — it reaches only the
 * term vocabulary and the appraisal leaf, neither of which can return true world
 * state, and it never merges two courts' numbers into a third.
 */
import { clamp01 } from '../../kernel/math.js';
import { TERM_FAMILIES } from './peaceTermsCatalog.js';
import { sovereigntyBandPhrase, sovereigntyValueBand } from './sovereigntyAppraisal.js';

/**
 * Components a bundle may carry that are NOT term families. Exactly one today: the
 * peace itself (amendment S's cession rider). See the header's divergence note.
 */
export const SOVEREIGNTY_NON_CATALOG_COMPONENTS = Object.freeze(['peace']);

/**
 * The term families that existed when WR-10 landed. This is a LANDING RECORD, not a
 * policy: nothing reads it to decide what may compose. It exists so
 * `catalogGrewSinceWr10()` can tell a builder that the catalog moved.
 */
export const WR10_FAMILIES_AT_LANDING = Object.freeze([
  'economic', 'informational', 'political', 'relational',
  'security', 'sovereignty', 'sovereignty_transfer', 'territorial',
]);

/** The closed verdict vocabulary. Every way of not trading has a word. */
export const SOVEREIGNTY_TRADE_VERDICTS = Object.freeze([
  'cleared', 'reserve_unmet', 'ceiling_reached', 'unpriced',
]);

export const SOVEREIGNTY_BUNDLE_TUNING = Object.freeze({
  /** A need weight a caller did not author. NOT a midpoint by accident: a court that
   *  has expressed no need for a thing is told, honestly, that it wants it a little —
   *  the alternative (zero) would make an unauthored need indistinguishable from a
   *  measured refusal, which is the absent-vs-zero collapse this wave exists to avoid.
   *  ⚠ UNSOAKED BAND — §7 THE TUNING SURFACE, owner-signed at the soak redo. */
  UNSTATED_NEED: 0.25,
});

// THE CLAMP IS THE KERNEL'S (chair ruling CR-WR10-A(a), 2026-08-04). This module used
// to hand-roll the PASSTHROUGH variant, which made it a new row on a shrink-only
// ratchet. The swap is byte-neutral by construction, not by hope: the kernel's policy
// differs from the passthrough one ONLY on a non-finite argument, and neither call site
// can produce one — `num01` guards with `Number.isFinite` before it clamps, and the
// bundle total is a sum of already-finite `round4` products. Unlike its sibling
// `sovereigntyAppraisal.js`, this module is NOT pinned at zero imports, so it can pay
// the honest price of the one primitive; the K3 row in `envoyK3BeliefSeam.test.js`
// gains `../../kernel/math.js` and nothing else, and the kernel is a determinism
// primitive that reaches no settlement state.

/** @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {unknown} value @returns {number} */
function num01(value) {
  const n = Number(value);
  return Number.isFinite(n) ? clamp01(n) : 0;
}

/**
 * EVERY COMPONENT FAMILY A BUNDLE MAY CARRY, derived at call time from the live term
 * catalog plus the non-catalog components amendment S names. Codepoint-sorted, so two
 * calls in one tick cannot disagree about order.
 *
 * DERIVATION IS THE DEGRADATION CONTRACT. There is no literal list of families here:
 * a trade-rights family that does not exist cannot be named, and one that lands is
 * composable the same day without touching this function.
 * @returns {ReadonlyArray<string>}
 */
export function bundleComponentFamilies() {
  return Object.freeze(
    [...new Set([...TERM_FAMILIES, ...SOVEREIGNTY_NON_CATALOG_COMPONENTS])].sort(),
  );
}

/**
 * HAS THE TERM CATALOG GROWN SINCE WR-10 LANDED? True once GR-3 mints the trade-rights
 * rows (or any other family arrives). The pin that asserts this is false is the wave's
 * tripwire, and its red message is an instruction, not a defect report.
 * @returns {boolean}
 */
export function catalogGrewSinceWr10() {
  return TERM_FAMILIES.some((family) => !WR10_FAMILIES_AT_LANDING.includes(family));
}

/**
 * @typedef {Object} BundleComponentLine
 * @property {string} family
 * @property {number} magnitude01  how much of the thing is on the table
 * @property {number} need01       what THIS court's needs make that family worth
 * @property {number} value01      the component's contribution, through this lens
 * @property {boolean} needStated  false ⇒ the caller authored no need for this family
 */

/**
 * @typedef {Object} SovereigntyBundleValuation
 * @property {string} partyId
 * @property {boolean} known
 * @property {number|null} total01
 * @property {string} valueBand
 * @property {ReadonlyArray<BundleComponentLine>} offered   what was ON THE TABLE
 * @property {ReadonlyArray<string>} available              what the catalog COULD offer
 * @property {string} receipt
 */

/**
 * VALUE A BUNDLE THROUGH ONE COURT'S OWN NEEDS (§15.1, both directions).
 *
 * `needs` is a family → 0..1 record: how badly this court wants that kind of thing. A
 * component's contribution is its magnitude times that need, so appropriateness falls
 * out of the arithmetic instead of a table. Components naming a family the live
 * catalog does not carry are DROPPED and named in the receipt, which is what keeps an
 * absent trade-rights component from being silently priced at zero.
 *
 * @param {{ partyId?: unknown, components?: unknown, needs?: unknown }} input
 * @returns {SovereigntyBundleValuation}
 */
export function valueBundleThroughNeeds(input) {
  const row = recordOf(input);
  const partyId = text(row.partyId);
  const available = bundleComponentFamilies();
  const needs = recordOf(row.needs);
  const rawComponents = Array.isArray(row.components) ? row.components : [];

  /** @type {BundleComponentLine[]} */
  const offered = [];
  /** @type {string[]} */
  const unknownFamilies = [];
  for (const raw of rawComponents) {
    const component = recordOf(raw);
    const family = text(component.family);
    if (!family) continue;
    if (!available.includes(family)) { unknownFamilies.push(family); continue; }
    const needStated = Object.prototype.hasOwnProperty.call(needs, family);
    const need01 = needStated ? num01(needs[family]) : SOVEREIGNTY_BUNDLE_TUNING.UNSTATED_NEED;
    const magnitude01 = num01(component.magnitude01);
    offered.push({
      family,
      magnitude01: round4(magnitude01),
      need01: round4(need01),
      value01: round4(magnitude01 * need01),
      needStated,
    });
  }
  offered.sort((a, b) => (a.family < b.family ? -1 : a.family > b.family ? 1 : 0));

  if (!partyId) {
    return {
      partyId,
      known: false,
      total01: null,
      valueBand: 'unknown',
      offered: Object.freeze(offered),
      available,
      receipt: 'no court was named, so the bundle has no valuer and no value.',
    };
  }

  const total01 = round4(clamp01(offered.reduce((sum, line) => sum + line.value01, 0)));
  const valueBand = sovereigntyValueBand(total01);
  const dropped = unknownFamilies.length
    ? ` It could not weigh ${unknownFamilies.length} offered component(s) whose family the catalog does not carry.`
    : '';
  // THE RECEIPT SPEAKS BANDS, THE FIELDS CARRY THE SCALARS (addendum A-1). The count of
  // dropped components stays a WHOLE COUNT — that is a thing a court can hold up on its
  // fingers, not the engine's notation — while every 0..1 weight is spoken as its band.
  // `line.value01` survives untouched on each offered line, so a consumer that needs the
  // arithmetic still has it; what is gone is the reader being handed `0.1875`.
  const named = offered.length
    ? offered.map((line) => `${line.family} weighing ${sovereigntyBandPhrase(sovereigntyValueBand(line.value01))}`).join(', ')
    : 'nothing at all';
  return {
    partyId,
    known: true,
    total01,
    valueBand,
    offered: Object.freeze(offered),
    available,
    receipt: `${partyId} weighs the bundle as ${sovereigntyBandPhrase(valueBand)} through its own needs: ${named}.${dropped}`,
  };
}

/**
 * @typedef {Object} SovereigntyClearing
 * @property {string} assetId
 * @property {string} sellerId
 * @property {string} buyerId
 * @property {string} verdict          a SOVEREIGNTY_TRADE_VERDICTS member
 * @property {boolean} cleared
 * @property {boolean|null} reserveMet     arm (i)
 * @property {boolean|null} withinCeiling  arm (ii)
 * @property {number|null} reserve01       the seller's own price for its own town
 * @property {number|null} ceiling01       the buyer's own price for that same town
 * @property {number|null} sellerSees01    what the seller thinks the bundle is worth
 * @property {number|null} buyerSpends01   what the buyer thinks the bundle costs it
 * @property {ReadonlyArray<string>} componentsHad
 * @property {ReadonlyArray<string>} componentsAvailable
 * @property {string} receipt
 */

/**
 * DOES THE TRADE CLEAR? Four independently-produced numbers, compared and never
 * merged (K4): two appraisals of the SAME town through two different courts' eyes,
 * and two valuations of the SAME bundle through two different courts' needs.
 *
 * NON-CLEARING IS NOT AN ERROR. `reserve_unmet` is a seller who will not sell that
 * cheap; `ceiling_reached` is a buyer who wants the town and will not pay that much —
 * amendment S's named outcome, and the one that stops overpayment being the guaranteed
 * result. Both carry a receipt naming the numbers that produced them and the
 * components that were actually on the table.
 *
 * @param {{
 *   assetId?: unknown,
 *   sellerAppraisal?: unknown, buyerAppraisal?: unknown,
 *   sellerValuation?: unknown, buyerValuation?: unknown,
 * }} input
 * @returns {SovereigntyClearing}
 */
export function clearSovereigntyTrade(input) {
  const row = recordOf(input);
  const sellerAppraisal = recordOf(row.sellerAppraisal);
  const buyerAppraisal = recordOf(row.buyerAppraisal);
  const sellerValuation = recordOf(row.sellerValuation);
  const buyerValuation = recordOf(row.buyerValuation);

  const assetId = text(row.assetId) || text(sellerAppraisal.assetId) || text(buyerAppraisal.assetId);
  const sellerId = text(sellerAppraisal.appraiserId) || text(sellerValuation.partyId);
  const buyerId = text(buyerAppraisal.appraiserId) || text(buyerValuation.partyId);

  const offeredLines = Array.isArray(sellerValuation.offered) ? sellerValuation.offered : [];
  const componentsHad = Object.freeze(
    offeredLines.map((line) => text(recordOf(line).family)).filter(Boolean).sort(),
  );
  const componentsAvailable = Array.isArray(sellerValuation.available)
    ? Object.freeze([...sellerValuation.available].map(String))
    : bundleComponentFamilies();

  const priced = sellerAppraisal.known === true && buyerAppraisal.known === true
    && sellerValuation.known === true && buyerValuation.known === true;
  if (!priced || !assetId || !sellerId || !buyerId || sellerId === buyerId) {
    return {
      assetId,
      sellerId,
      buyerId,
      verdict: 'unpriced',
      cleared: false,
      reserveMet: null,
      withinCeiling: null,
      reserve01: null,
      ceiling01: null,
      sellerSees01: null,
      buyerSpends01: null,
      componentsHad,
      componentsAvailable,
      receipt: `no trade can be judged for ${assetId || 'the holding'}:`
        + ' one of the two courts has not priced the town or the bundle.',
    };
  }

  const reserve01 = round4(num01(sellerAppraisal.value01));
  const ceiling01 = round4(num01(buyerAppraisal.value01));
  const sellerSees01 = round4(num01(sellerValuation.total01));
  const buyerSpends01 = round4(num01(buyerValuation.total01));

  const reserveMet = sellerSees01 >= reserve01;
  const withinCeiling = ceiling01 >= buyerSpends01;
  // Amendment S's search procedure stops at whichever bound binds FIRST, and the
  // buyer's ceiling is the one that ends the stacking — so when both arms fail the
  // verdict names the ceiling, and the receipt still names both.
  const verdict = reserveMet && withinCeiling
    ? 'cleared'
    : (!withinCeiling ? 'ceiling_reached' : 'reserve_unmet');

  const had = componentsHad.length ? componentsHad.join(', ') : 'nothing';
  // EACH CLAUSE NAMES **ONE** BAND AND STATES THE COMPARISON IN WORDS, and that shape is
  // load-bearing rather than stylistic. Banding is lossy: two numbers on either side of a
  // threshold routinely land in the SAME band, so the naive translation of the old
  // sentence — "prices the town great but the bundle would cost it great" — would read as
  // a self-contradiction on a perfectly correct verdict. Naming one band and saying which
  // way the other fell is both honest and never contradictory. The four scalars remain on
  // the returned read (`reserve01` / `ceiling01` / `sellerSees01` / `buyerSpends01`), so
  // nothing that needs the arithmetic has lost it.
  const reason = verdict === 'cleared'
    ? `the bundle meets ${sellerId}'s ${sovereigntyBandPhrase(sovereigntyValueBand(reserve01))} reserve,`
      + ` and ${buyerId} prices the town ${sovereigntyBandPhrase(sovereigntyValueBand(ceiling01))} and spends under that`
    : verdict === 'ceiling_reached'
      ? `${buyerId} prices the town ${sovereigntyBandPhrase(sovereigntyValueBand(ceiling01))} and the bundle asks more than that:`
        + ' the ceiling was reached before the reserve was met'
      : `${sellerId} holds a ${sovereigntyBandPhrase(sovereigntyValueBand(reserve01))} reserve the bundle does not reach:`
        + ' the offer does not reach what the town is worth to the court that holds it';
  return {
    assetId,
    sellerId,
    buyerId,
    verdict,
    cleared: verdict === 'cleared',
    reserveMet,
    withinCeiling,
    reserve01,
    ceiling01,
    sellerSees01,
    buyerSpends01,
    componentsHad,
    componentsAvailable,
    receipt: `${assetId}: ${reason}. The table carried ${had}`
      + ` of ${componentsAvailable.length} component families the catalog can offer.`,
  };
}
