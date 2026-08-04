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
 * ── TWO INJECTED READERS, AND WHY THEY ARE READERS RATHER THAN HOLES ────────────
 * `beliefLegsFor` and `reachFor` default to the production reads and exist as arguments
 * for the reason `sovereigntyIntent`'s believed-razing reader does: each is a READ whose
 * own correctness is pinned in its own battery (`sovereigntyMarketReadsWr10` proves the
 * three-legged geographic bound on a REAL digest, both arms), and standing a frozen
 * spatial digest plus a lived route network plus a goods-flow ledger up inside every
 * composer pin would turn this file into a geography fixture measuring geography. Neither
 * seam widens what the composer may reach: the default IS the production reader, and the
 * K3 import row pins the module's whole reach either way.
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
   *  A bar, never a selector (E3): it scales the draw, it does not pick the buyer. */
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
 * @param {{ worldState?: unknown, courtId?: string, assetId?: string }} input
 * @returns {{ tierBand?: string, storesBand?: string, routeBand?: string, trajectoryBand?: string }}
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
 *   reachFor?: (input: Record<string, unknown>) => ReadonlyArray<string> }} args
 * @returns {MarketAdvanceResult}
 */
export function advanceSovereigntyMarket({
  snapshot, worldState, settlementUpdates = [], edges = [], digest = null,
  season = null, tick, now = null, beliefLegsFor = beliefLegsOf, reachFor = reachableAssetsFor,
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

    for (const buyerId of ids) {
      if (buyerId === sellerId) continue;
      // ── 3. THE GEOGRAPHIC BOUND SHAPES THE SET: what cannot be held is ABSENT. ──
      const reachable = reachFor({
        worldState: state, digest, buyerId, assetIds: assets, season,
      });
      if (reachable.length === 0) continue;
      // ── 4. THE CHARACTER GATE (§1b-B): a suppressed sale scores 0 and SAYS WHY. ──
      const intent = readSovereigntySaleIntent({
        worldState: state, snapshot, sellerId, buyerId, assetId: reachable[0],
      });
      if (intent.suppressed || intent.score01 <= 0) {
        receipts.push({
          kind: 'sovereignty_sale_suppressed', tick, episode, sellerId, buyerId,
          assetId: reachable[0], suppressionKind: intent.suppressionKind, receipt: intent.receipt,
        });
        evidence.push({
          kind: 'kinship_opposes_the_sale', tick, assetId: reachable[0],
          fromId: sellerId, toId: buyerId, reasons: [intent.receipt],
        });
        continue;
      }
      // ── 5. THE RACE, keyed hash01 and `w * u` (never u ** (1/w)). ──
      for (const assetId of reachable) {
        const u = hash01(`sovereignty.offer.${realmId}.${sellerId}.${buyerId}.${assetId}.${episode}`);
        if (T.BASE_OFFER_WEIGHT * intent.score01 * u <= 0) continue;

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
        // a treaty by hand, and WW-A's conveyance writer executes it at the signing. ──
        const mint = mintSovereigntySaleTreaties({
          sales: [{
            assetId, sellerId, buyerId, components, reasons: [String(clearing.receipt), intent.receipt],
          }],
          worldState: state, settlementUpdates: updates, edges: graphEdges, tick, now,
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
        break;                                    // a cleared sale closes the episode
      }
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
