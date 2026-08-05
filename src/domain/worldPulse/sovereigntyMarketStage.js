/**
 * sovereigntyMarketStage.js — WR-10 amendment S: THE PLAN-LANE TRIGGER AND THE MARKET
 * COMPOSER. A court under pressure looks at what it holds and asks whether it should sell.
 *
 * IT IS A SIBLING OF THE DEMOGRAPHIC PLAN LANE, NOT AN EXTENSION OF IT. demographicsPlans'
 * header is law here — "this is not a general planning system and must not become one" —
 * so this stage widens neither the closed RESPONSES vocabulary nor the plan ledger. It
 * shares the ONE pressure ladder (`overflowBandOf` / `bandDemandsResponse` — J-WR-10-B
 * forbids a rival) and the ONE set of bound readers, and it stores nothing.
 *
 * ── THE CROSSING, NEVER THE LEVEL ───────────────────────────────────────────────
 * A settlement that merely SITS in a demanding band draws nothing; it drew when it
 * arrived there. The prior band is read from the demographic plan ledger's own `band`
 * cell — a READ, never a write — which is why the mount sits BEFORE `advanceDemographics`
 * in the host: after it, that cell already holds THIS tick's band and every crossing
 * would read as a non-crossing, forever. Zero new keys, and the level-instead-of-crossing
 * mutant has a real pin to red.
 *
 * ── THE TREATY IS THE COOLDOWN ──────────────────────────────────────────────────
 * A seller that has conveyed a holding recently does not re-offer, and the memory of that
 * is the TREATY ITSELF: a live `sovereignty_transfer` document minted inside the cooldown
 * band silences its giver. No cooldown cell, no plan record, no second ledger — the
 * instrument the market already mints is the instrument that remembers.
 *
 * ── ZERO PRNG, DARK AND LIT ─────────────────────────────────────────────────────
 * Every stochastic choice is a keyed `hash01`, and the weighted race is `w * u`
 * multiplication — never `u ** (1/w)`, which THE PROMISE's correctly-rounded law
 * forbids. The kernel's fork sites and their call order are untouched in BOTH
 * configurations, so stream identity is preserved by construction rather than by fencing.
 *
 * ── THE RACE IS A RACE, AND ITS BAND IS ALIVE ───────────────────────────────────
 * Every (buyer, asset) candidate a seller's episode assembles draws `w * hash01(key)`
 * and the HIGHEST draw wins; exact ties break on the codepoint order of the key. The
 * first candidate that clears closes the episode, so the winner is decided by the draw
 * rather than by enumeration order — which is the whole difference between a market and
 * a queue. `BASE_OFFER_WEIGHT` is the BAR under every candidate's weight and intent's
 * score is what lifts it (`offerWeightOf`): a weight that merely multiplied every
 * candidate alike would cancel out of an ordering entirely and the band would be dead —
 * a constant nobody could retune into a different world, which is the shape of tuning
 * surface this estate has watched go quietly dead twice. Both sides of the band are
 * reachable and pinned: at 1 the race is intent-blind, at 0 it is intent alone.
 *
 * ── K3, AND THE HONEST NO-TRADE (chair ruling CR-WR10-H) ────────────────────────
 * The appraisal leaf is pinned at ZERO IMPORTS and takes already-banded words; assembling
 * those words from a court's belief map is the CALLER's job, which is this file. So this
 * module is outside the K3 zero-import set and its OWN import list is pinned instead (the
 * P4 no-hidden-governor pattern): the four sovereignty leaves, the intent reader, the
 * belief readers, the shared ladder, and the terms vocabulary — never a raw true-state
 * module for the counterpart's legs.
 *
 * AND THE LEGS THAT EXIST TODAY ARE ONE OF FOUR. Measured against the tree rather than
 * assumed: `beliefRecord` carries a believed `populationTrendBand` (−2 … +2, present only
 * when `beliefAxesEnabled`), which maps EXACTLY onto the appraisal's five real trajectory
 * words. It carries no believed tier, no believed stores and no believed route position —
 * the negotiation picture's `storesBand` lives inside an ERRAND, so it exists only while
 * two courts are already negotiating and not for an arbitrary (court, holding) pair.
 * Three legs missing ⇒ `appraiseSettlementAsset` returns `known: false` ⇒ this stage emits
 * an HONEST receipted no-trade on the `sovereignty_no_trade` road. It NEVER backfills a
 * counterpart's leg from true state — that is the one translation K3 exists to forbid, and
 * doing it here would make the belief seam a decoration.
 *
 * That is a DEAD-LIGHTING TRAP unless it is written down, so it is: §9 of the war volume
 * now records that `sovereigntyTradeEnabled` lights only after the belief surfaces carry
 * the appraisal's four legs (the belief-legs wave, queued). `beliefLegsFor` is injectable
 * precisely so that wave can supply them without touching this file, and the
 * lit-with-legs contract fixture drives synthetic banded legs through this composer to
 * prove the whole clearing works end to end the moment they arrive.
 *
 * ── THREE INJECTED READERS, AND WHY THEY ARE READERS RATHER THAN HOLES ──────────
 * `beliefLegsFor`, `reachFor` and `intentFor` default to the production reads and exist
 * as arguments for the reason `sovereigntyIntent`'s believed-razing reader does: each is
 * a READ whose own correctness is pinned in its own battery (`sovereigntyMarketReadsWr10`
 * proves the three-legged geographic bound on a REAL digest, both arms;
 * `sovereigntyIntentWr10` proves the §1b-B scorer), and standing a frozen spatial digest
 * plus a lived route network plus a goods-flow ledger up inside every composer pin would
 * turn this file into a geography fixture measuring geography. `intentFor` carries one
 * more reason: the character gate below refuses on `suppressed` OR on a score of zero,
 * and the production reader FLOORS an unsuppressed score at `UNSUPPRESSED_FLOOR01`, so
 * the second arm is unreachable from outside and would be an unproven branch forever —
 * the seam is how the pin proves it is live. No seam widens what the composer may reach:
 * the default IS the production reader, and the K3 import row pins the module's whole
 * reach either way.
 *
 * DARK ⇒ A COMPLETE NO-OP: the same worldState and settlementUpdates REFERENCES, zero
 * reads below the gate, zero receipts, zero draws.
 */
import { hash01 } from '../region/contestMath.js';
import { beliefRecord } from './beliefMap.js';
import {
  densityCeilingOf, effectiveBoundOf, foodCapacityOf, pressureOf,
} from './demographicsRates.js';
import { bandDemandsResponse, overflowBandOf } from './demographicsResponses.js';
import { plansLedgerOf } from './demographicsPlans.js';
import { sovereigntyTradeActive, tradeableAssetsOf } from './sovereigntyAssets.js';
import {
  SOVEREIGNTY_TRAJECTORY_BANDS, appraiseSettlementAsset,
} from './sovereigntyAppraisal.js';
import { bundleComponentFamilies, clearSovereigntyTrade, valueBundleThroughNeeds } from './sovereigntyBundle.js';
import { reachableAssetsFor } from './sovereigntyReach.js';
import { readSovereigntySaleIntent } from './sovereigntyIntent.js';
import { sovereigntyNewsEntries } from './sovereigntyNews.js';
import { mintSovereigntySaleTreaties } from './peaceTermsSale.js';
import { treatyLedgerOf } from './treatyEnforcement.js';
import { treatyOrientationOf } from './treatyOrientation.js';

/**
 * ⚠ EVERY BAND HERE IS UNSOAKED — §7 THE TUNING SURFACE owns them and the owner signs
 * them at the soak redo under THE PROMISE. They are authored raw and deliberately NOT in
 * proposedSoakBands.js, whose gate requires a status this wave has no authority to grant.
 */
export const SOVEREIGNTY_MARKET_TUNING = Object.freeze({
  /** Ticks after a conveyance during which its giver does not offer again. Anchored
   *  BETWEEN the demographic plan lane's own COOLDOWN_COMPLETED and the treaty's 10-year
   *  minimum term, so a court that sold last season is quiet and one that sold a
   *  generation ago is not. Read off the treaty, never stored. */
  RESALE_COOLDOWN_TICKS: 52,
  /** The offer weight a candidate carries into the keyed race, before intent colours it.
   *  A BAR, never a selector (E3): every candidate stands on it and intent's score lifts
   *  it toward 1 (`offerWeightOf`), so the band decides HOW MUCH the seller's appetite is
   *  allowed to reorder the field — at 1 the race is intent-blind, at 0 it is intent
   *  alone — and it still cannot pick a buyer, because it moves every candidate's floor
   *  by the same amount. It is deliberately NOT a common multiplier: a factor shared by
   *  every candidate cancels out of an ordering and leaves a band that no retuning could
   *  ever change (the dead-band law — both sides reachable, proven). */
  BASE_OFFER_WEIGHT: 0.5,
  /** How much of the bundle a pressed seller asks for per available family. The bundle
   *  stacker prices it through each court's OWN needs; this is only how much is offered. */
  COMPONENT_MAGNITUDE: 0.5,
});

const T = SOVEREIGNTY_MARKET_TUNING;

/** @param {unknown} v @returns {Record<string, unknown>} */
function recordOf(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @returns {string} */
function text(v) {
  return typeof v === 'string' && v.length > 0 ? v : '';
}
/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * THE BELIEF LEGS ONE COURT HOLDS ABOUT ONE HOLDING (CR-WR10-H).
 *
 * Returns only the words the belief surfaces ACTUALLY carry. An absent leg is ABSENT —
 * never a midpoint, never a truth-side read — so the appraisal it feeds comes back
 * `known: false` and the trade is refused with a receipt that says which sense the court
 * is missing. `populationTrendBand` is a believed −2 … +2 and indexes the trajectory
 * ladder directly (its member 0 is `unknown`, so +2 shifts the −2 floor onto `emptying`).
 *
 * WHAT IT RETURNS TODAY, AND WHAT IT DOES NOT (corrected 2026-08-05, SP-B repair R8;
 * RE-CORRECTED the same day by the settling lane, which measured the consumer instead of
 * reasoning about it). This `@returns` declared FOUR optional legs while the body has only
 * ever produced ONE: `{}` when the believed trend is non-finite, and otherwise
 * `{ trajectoryBand }`. Three of the four names were a statement of the CR-WR10-H TARGET
 * shape written in the tense of a contract, so the declaration is cut back to the truth and
 * SP-B2 is the wave that widens BOTH the body and this line together.
 *
 * THE FIRST CORRECTION OVERSHOT, AND ITS REPLACEMENT SENTENCE IS MEASURED. R8 wrote that a
 * wave built from the old declaration "would have supplied legs no consumer reads", and told
 * SP-B2 to carry the SUPPLYING surface's spelling of the route rung across. Both claims are
 * false, and the second one is load-bearing. The legs' consumer is `appraiseSettlementAsset`
 * (sovereigntyAppraisal.js), which this stage feeds by SPREADING `beliefLegsFor({ … })`
 * straight into it at both clearing call sites in the market loop below. It reads
 * `row.tierBand`, `row.storesBand`, `row.routeBand` and `row.trajectoryBand` — by PROPERTY
 * ACCESS, which is exactly why "no consumer DESTRUCTURES the four names" was literally true
 * and was the wrong test. All four names ARE read, by precisely the old declaration's
 * spellings. Three of them simply arrive `undefined` today, and the appraisal's `wordOf`
 * maps an absent key onto `'unknown'` rather than failing — a silent degrade, never a crash,
 * which is why nothing in the estate ever complained.
 *
 * SO SP-B2 MUST EMIT THE CONSUMER'S OWN KEYS: `{ tierBand, storesBand, routeBand,
 * trajectoryBand }`. The route leg is the trap. The belief surface that will supply its
 * VALUE spells that rung with a longer name of its own, and `SOVEREIGNTY_ROUTE_BANDS` is
 * that same ladder with `'unknown'` prefixed — so the VALUES already align and ONLY THE KEY
 * differs. A wave that emits the supply side's key instead reaches an appraisal that asks
 * for `routeBand`, receives `undefined`, and reports `'unknown'` with every gate green: the
 * precise silent-leg defect this paragraph exists to prevent, arrived at by obeying the
 * instruction it replaces. SP-B2's four-leg totality pin (each leg present ⇒ named in the
 * appraisal receipt; each absent ⇒ `known:false`) is what makes that failure loud, and it
 * must be written against these four keys. (This header still deliberately does NOT spell
 * the supplying record's own field names: naming one admits this module to
 * spAxisVocabulary's ARGUED_FIELD_SPELLERS, and that admission belongs to the commit that
 * starts READING the field — SP-B2's — not to a comment.)
 *
 * @param {{ worldState?: unknown, courtId?: string, assetId?: string }} input
 * @returns {{ trajectoryBand?: string }} the ONE leg that exists — absent entirely when the
 *   court holds no finite believed population trend for the holding
 */
export function beliefLegsOf({ worldState, courtId, assetId }) {
  const record = beliefRecord(
    /** @type {Parameters<typeof beliefRecord>[0]} */ (recordOf(worldState)),
    String(courtId || ''), String(assetId || ''),
  );
  const trend = Number(recordOf(record).populationTrendBand);
  if (!Number.isFinite(trend)) return {};
  const index = Math.round(trend) + 2 + 1;
  const band = SOVEREIGNTY_TRAJECTORY_BANDS[index];
  return band ? { trajectoryBand: band } : {};
}

/**
 * HAS THIS COURT CONVEYED RECENTLY? The treaty IS the memory (see the header): any live
 * document carrying a `sovereignty_transfer` clause whose GIVER is this court and whose
 * mint falls inside the cooldown band silences it. Read through the one orientation
 * reader, so a wartime cession quiets a court exactly as a sale does.
 * @param {unknown} worldState @param {string} sellerId @param {number} tick @returns {boolean}
 */
function conveyedWithinCooldown(worldState, sellerId, tick) {
  const ledger = treatyLedgerOf(/** @type {Parameters<typeof treatyLedgerOf>[0]} */ (worldState));
  if (!ledger) return false;
  for (const key of Object.keys(ledger).sort(codepoint)) {
    const treaty = recordOf(ledger[key]);
    const terms = Array.isArray(treaty.terms) ? treaty.terms : [];
    if (!terms.some((term) => text(recordOf(term).type) === 'sovereignty_transfer')) continue;
    if (treatyOrientationOf(treaty).giverId !== sellerId) continue;
    const minted = Number(treaty.mintedTick);
    if (!Number.isFinite(minted) || tick - minted <= T.RESALE_COOLDOWN_TICKS) return true;
  }
  return false;
}

/** Every family the buyer could actually put on the table, codepoint-ordered. `peace` and
 *  every unlanded trade-rights family are simply not produced, which is the
 *  graceful-degradation contract holding rather than being restated: an absent component
 *  is ABSENT, never a zero-valued one. @returns {ReadonlyArray<string>} */
function offerableFamilies() {
  return bundleComponentFamilies()
    .filter((family) => family !== 'sovereignty_transfer' && family !== 'peace');
}

/**
 * THE STACKING SEARCH (amendment S's own procedure, inside the two-sided rule).
 *
 * The buyer stacks term families one at a time until the SELLER's own-lens value of the
 * bundle meets its reserve (arm i clears) OR the BUYER's own-lens value of the asset is
 * exceeded by what the bundle costs it (arm ii fails) — WHICHEVER COMES FIRST. That
 * "whichever first" is the whole mechanism: a search that kept stacking past the ceiling
 * would make overpayment the guaranteed outcome, which is exactly the misreading the
 * volume's 2026-08-02 correction exists to refuse.
 *
 * The gap it searches is the gap between two PICTURES. Two courts with identical beliefs
 * price the town identically, and then arm (i) and arm (ii) can only be satisfied together
 * by an exact tie — so a symmetric world clears nothing, correctly. The market lives in
 * the disagreement.
 *
 * @param {{ assetId: string, sellerId: string, buyerId: string, sellerAppraisal: unknown,
 *   buyerAppraisal: unknown }} input
 * @returns {{ clearing: Record<string, unknown>, components: Array<{ family: string, magnitude01: number }> }}
 */
function stackUntilItClears({ assetId, sellerId, buyerId, sellerAppraisal, buyerAppraisal }) {
  const families = offerableFamilies();
  /** @type {Array<{ family: string, magnitude01: number }>} */
  const components = [];
  /** @type {Record<string, unknown>} */
  let clearing = clearSovereigntyTrade({
    assetId, sellerAppraisal, buyerAppraisal,
    sellerValuation: valueBundleThroughNeeds({ partyId: sellerId, components, needs: {} }),
    buyerValuation: valueBundleThroughNeeds({ partyId: buyerId, components, needs: {} }),
  });
  for (const family of families) {
    if (clearing.cleared === true) break;
    // ARM (ii) HAS FAILED — the ceiling was reached before the reserve was met. Stacking
    // one more family can only make it worse, so the search STOPS and the last verdict
    // stands as the named no-trade outcome.
    if (clearing.withinCeiling === false) break;
    components.push({ family, magnitude01: T.COMPONENT_MAGNITUDE });
    clearing = clearSovereigntyTrade({
      assetId, sellerAppraisal, buyerAppraisal,
      sellerValuation: valueBundleThroughNeeds({ partyId: sellerId, components, needs: {} }),
      buyerValuation: valueBundleThroughNeeds({ partyId: buyerId, components, needs: {} }),
    });
  }
  return { clearing, components };
}

/**
 * THE WEIGHT ONE CANDIDATE CARRIES INTO THE RACE — the bar, lifted by intent.
 *
 * `base` is the floor every candidate stands on and `score01` lifts it the rest of the
 * way to 1. Exported with the base as an ARGUMENT so both sides of the band can be
 * driven in a pin without mutating a frozen constant: at `base` 1 every candidate weighs
 * the same and the race is intent-blind; at 0 the weight IS the intent. The production
 * call passes the tuned band and nothing else.
 *
 * @param {number} score01 @param {number} [base] @returns {number}
 */
export function offerWeightOf(score01, base = T.BASE_OFFER_WEIGHT) {
  const bar = Math.min(1, Math.max(0, Number(base) || 0));
  const colour = Math.min(1, Math.max(0, Number(score01) || 0));
  return bar + (1 - bar) * colour;
}

/**
 * THE KEYED RACE (spec §3.2): every candidate draws `w * hash01(key)` and the field is
 * ordered by that draw, highest first. `w * u` multiplication, never `u ** (1/w)` — THE
 * PROMISE's correctly-rounded law. An exact tie breaks on the codepoint order of the
 * key, so the ordering is total and reproducible rather than dependent on the sort's
 * stability. Pure: it reads nothing, writes nothing, and takes no stream.
 *
 * @param {ReadonlyArray<{ buyerId: string, assetId: string, key: string, weight: number }>} candidates
 * @returns {Array<{ buyerId: string, assetId: string, key: string, weight: number, draw: number }>}
 */
export function raceOrder(candidates) {
  return candidates
    .map((candidate) => ({ ...candidate, draw: candidate.weight * hash01(candidate.key) }))
    .sort((a, b) => (b.draw - a.draw) || codepoint(a.key, b.key));
}

/** This tick's pressure band for one settlement, through the SHARED ladder and the SHARED
 *  bound readers (never a rival).
 *  @param {Record<string, unknown>} settlement @param {Record<string, unknown>} worldState
 *  @param {string} settlementId @returns {string} */
function bandOf(settlement, worldState, settlementId) {
  const population = Math.max(0, Math.round(Number(recordOf(settlement).population) || 0));
  const bound = effectiveBoundOf(
    foodCapacityOf(/** @type {never} */ (settlement), /** @type {never} */ (worldState), settlementId),
    densityCeilingOf(/** @type {never} */ (settlement), /** @type {never} */ (worldState), settlementId),
  );
  return overflowBandOf(pressureOf(population, bound.bound));
}

/**
 * @typedef {Object} MarketAdvanceResult
 * @property {Record<string, unknown>} worldState  the SAME reference when nothing cleared
 * @property {Array<Record<string, unknown>>} settlementUpdates  likewise
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 * @property {Array<Record<string, unknown>>} receipts
 */

/**
 * ADVANCE THE SOVEREIGNTY MARKET ONE TICK.
 *
 * @param {{ snapshot?: unknown, worldState: Record<string, unknown>,
 *   settlementUpdates?: Array<Record<string, unknown>>, edges?: ReadonlyArray<Record<string, unknown>>,
 *   digest?: unknown, season?: unknown, tick: number, now?: unknown,
 *   beliefLegsFor?: (input: { worldState: unknown, courtId: string, assetId: string }) => Record<string, unknown>,
 *   reachFor?: (input: Record<string, unknown>) => ReadonlyArray<string>,
 *   intentFor?: (input: Record<string, unknown>) => ReturnType<typeof readSovereigntySaleIntent> }} args
 * @returns {MarketAdvanceResult}
 */
export function advanceSovereigntyMarket({
  snapshot, worldState, settlementUpdates = [], edges = [], digest = null,
  season = null, tick, now = null, beliefLegsFor = beliefLegsOf, reachFor = reachableAssetsFor,
  intentFor = readSovereigntySaleIntent,
}) {
  const inert = {
    worldState, settlementUpdates, changed: false, newsEntries: [], receipts: [],
  };
  // ── THE GATE. Dark ⇒ both references back, and not one read below runs. ──
  if (!sovereigntyTradeActive(worldState)) return inert;

  // THE GRAPH EDGES COME OFF THE SNAPSHOT WHEN THE HOST DOES NOT HAND THEM OVER, which
  // is what keeps the host mount to one call block: the lifecycle kernel's own signature
  // carries no edges, and the sale's grievance rides a REAL edge or no edge at all (the
  // conveyance writer's own byte-safe no-op).
  const graphEdges = edges.length ? edges
    : (Array.isArray(recordOf(recordOf(snapshot).regionalGraph).edges)
      ? /** @type {ReadonlyArray<Record<string, unknown>>} */ (recordOf(recordOf(snapshot).regionalGraph).edges)
      : []);
  const items = /** @type {Array<Record<string, unknown>>} */ (
    Array.isArray(recordOf(snapshot).settlements) ? recordOf(snapshot).settlements : []);
  if (items.length < 2) return inert;
  const freshest = new Map(settlementUpdates.map((u) => [String(u.saveId), recordOf(u.settlement)]));
  /** @param {string} id */
  const settlementOf = (id) => freshest.get(id)
    || recordOf(recordOf(items.find((it) => String(recordOf(it).id) === id)).settlement);
  const ids = items.map((it) => String(recordOf(it).id)).filter(Boolean).sort(codepoint);
  const plans = plansLedgerOf(worldState);
  const realmId = text(worldState.rngSeed) || 'realm';

  /** @type {Array<Record<string, unknown>>} */
  const evidence = [];
  /** @type {Array<Record<string, unknown>>} */
  const receipts = [];
  let state = worldState;
  let updates = settlementUpdates;

  for (const sellerId of ids) {
    const seller = settlementOf(sellerId);
    if (!seller) continue;
    // ── 1. THE EPISODE GATE: a CROSSING into a demanding band, never a level. ──
    const band = bandOf(seller, state, sellerId);
    const priorBand = text(recordOf(plans[sellerId]).band) || 'easy';
    if (band === priorBand || !bandDemandsResponse(band)) continue;
    // ── 2. THE TREATY IS THE COOLDOWN. ──
    if (conveyedWithinCooldown(state, sellerId, tick)) continue;

    const assets = tradeableAssetsOf(state, sellerId).map((read) => read.assetId);
    if (assets.length === 0) continue;
    const episode = `${tick}:${band}`;

    // ── 3+4. THE CANDIDATE FIELD, ASSEMBLED BEFORE ANYTHING IS PRICED. ──
    /** @type {Array<{ buyerId: string, assetId: string, key: string, weight: number }>} */
    const field = [];
    for (const buyerId of ids) {
      if (buyerId === sellerId) continue;
      // THE GEOGRAPHIC BOUND SHAPES THE SET: what cannot be held is ABSENT — and so is
      // A COURT'S OWN SEAT. A settlement is both a party and a holding in this world, so
      // the buyer loop hands `X` its own id as an asset unless it is excluded here; the
      // appraisal leaf then refuses to price it (a court cannot price itself) and the
      // refusal travels all the way to the Herald as an honest no-trade about a sale
      // nobody ever proposed. Absent at assembly, exactly as the unreachable buyer is.
      const reachable = reachFor({
        worldState: state, digest, buyerId, assetIds: assets, season,
      }).filter((assetId) => assetId !== buyerId);
      if (reachable.length === 0) continue;
      // THE CHARACTER GATE (§1b-B): a suppressed sale scores 0 and SAYS WHY. It is
      // HOISTED above the assets deliberately and by measurement, not by assumption:
      // `readSovereigntySaleIntent` resolves suppression and score from the PAIR and the
      // seller's own memory, and the asset enters only the receipt sentence. The receipt
      // that rides a document is re-read per asset at the clearing below.
      const gate = intentFor({
        worldState: state, snapshot, sellerId, buyerId, assetId: reachable[0],
      });
      if (gate.suppressed || gate.score01 <= 0) {
        receipts.push({
          kind: 'sovereignty_sale_suppressed', tick, episode, sellerId, buyerId,
          assetId: reachable[0], suppressionKind: gate.suppressionKind, receipt: gate.receipt,
        });
        evidence.push({
          kind: 'kinship_opposes_the_sale', tick, assetId: reachable[0],
          fromId: sellerId, toId: buyerId, reasons: [gate.receipt],
        });
        continue;
      }
      const weight = offerWeightOf(gate.score01);
      for (const assetId of reachable) {
        field.push({
          buyerId,
          assetId,
          key: `sovereignty.offer.${realmId}.${sellerId}.${buyerId}.${assetId}.${episode}`,
          weight,
        });
      }
    }

    // ── 5. THE RACE, keyed hash01 and `w * u` (never u ** (1/w)). The field is tried in
    // DRAW ORDER, so the buyer who wins is the one the draw favoured rather than the one
    // whose id sorts first — the difference between a market and a queue. ──
    for (const { buyerId, assetId } of raceOrder(field)) {
      // ── 6. THE CLEARING. Two appraisals, two bundle valuations, never merged (K4),
      // and the bundle SEARCHED rather than fixed (see stackUntilItClears). ──
      const sellerAppraisal = appraiseSettlementAsset({
        assetId, appraiserId: sellerId, ...beliefLegsFor({ worldState: state, courtId: sellerId, assetId }),
      });
      const buyerAppraisal = appraiseSettlementAsset({
        assetId, appraiserId: buyerId, ...beliefLegsFor({ worldState: state, courtId: buyerId, assetId }),
      });
      const { clearing, components } = stackUntilItClears({
        assetId, sellerId, buyerId, sellerAppraisal, buyerAppraisal,
      });
      if (!clearing.cleared) {
        // THE HONEST NO-TRADE. `unpriced` is the belief-legs road; the other two are a
        // court that will not sell that cheap and a court that will not pay that much.
        receipts.push({
          kind: 'sovereignty_no_trade', tick, episode, sellerId, buyerId, assetId,
          verdict: clearing.verdict, receipt: clearing.receipt,
          // HOW FAR THE SEARCH GOT before it stopped. The "whichever comes FIRST" rule
          // is only observable as a COUNT — a search that kept stacking past the buyer's
          // ceiling reaches the same verdict by a different road, and the difference
          // between a court that offered three families and one that emptied its whole
          // catalogue into a refusal is the difference between a bargain and a farce.
          componentsOffered: components.length,
          componentsAvailable: /** @type {ReadonlyArray<string>} */ (clearing.componentsAvailable).length,
          sellerReceipt: sellerAppraisal.receipt, buyerReceipt: buyerAppraisal.receipt,
        });
        evidence.push({
          kind: 'sovereignty_no_trade', tick, assetId, fromId: sellerId, toId: buyerId,
          reasons: [clearing.receipt],
        });
        continue;
      }
      // ── 7. THE DOCUMENT. peaceTerms' family mints it; this composer never assembles
      // a treaty by hand, and WW-A's conveyance writer executes it at the signing.
      // THE INTENT IS RE-READ FOR THE ASSET ACTUALLY SOLD: the gate above is hoisted
      // because suppression and score do not move with the asset, but the receipt does —
      // it names the holding in words — and a document that quoted the reason a court
      // weighed selling its OTHER town would be a lie in the artifact's own voice. ──
      const intent = intentFor({ worldState: state, snapshot, sellerId, buyerId, assetId });
      const mint = mintSovereigntySaleTreaties({
        sales: [{
          assetId, sellerId, buyerId, components, reasons: [String(clearing.receipt), intent.receipt],
        }],
        worldState: state, settlementUpdates: updates, edges: graphEdges, tick, now,
        // GR-1: this composer already resolves the freshest roster-bearing record for
        // every court it prices, so the deed's signature line is read from the same
        // settlement the sale was priced against rather than from a second lookup.
        settlementOf,
      });
      if (!mint.minted) {
        // A REFUSED MINT IS RECEIPTED, never silent. The clearing said yes and the
        // instrument said no — a pair already bound by a live document, or a clause the
        // catalog cannot represent — and a reader who is told the trade cleared and then
        // sees no deed has been lied to by omission.
        receipts.push({
          kind: 'sovereignty_no_trade', tick, episode, sellerId, buyerId, assetId,
          verdict: mint.refusal, receipt: `${sellerId} and ${buyerId} agreed on ${assetId},`
            + ` and the instrument refused: ${String(mint.refusal).replace(/_/g, ' ')}.`,
          sellerReceipt: sellerAppraisal.receipt, buyerReceipt: buyerAppraisal.receipt,
        });
        continue;
      }
      state = mint.worldState;
      updates = mint.settlementUpdates;
      evidence.push(...mint.newsSeeds, ...mint.beats);
      receipts.push({
        kind: 'sovereignty_sale_cleared', tick, episode, sellerId, buyerId, assetId,
        receipt: clearing.receipt,
      });
      break;                                      // a cleared sale closes the episode
    }
  }

  const changed = state !== worldState;
  return {
    worldState: state,
    settlementUpdates: updates,
    changed,
    newsEntries: sovereigntyNewsEntries({ evidence, snapshot, now: /** @type {never} */ (now) }),
    receipts,
  };
}
