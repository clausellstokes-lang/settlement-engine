/**
 * peaceTermsSale.js — THE VICTOR-FREE MINT (WR-10 amendment S; chair rulings CR-WR10-D
 * and CR-WR10-E). A member of the peaceTerms WRITER FAMILY: the third transport into the
 * one instrument, beside the live-appraisal mint and the carried-sheet mint.
 *
 * ── CR-WR10-E, ANSWERED BY MEASUREMENT ──────────────────────────────────────────
 *
 * The ruling asked whether `peaceTerms.js`'s mint machinery can be reached without a
 * victor/loser resolution, and ordered a STOP-and-report if it could not. Measured at
 * implementation depth, the answer is a SPLIT one and it is recorded here rather than
 * inferred:
 *
 *   • THE MINT FUNCTIONS THEMSELVES ARE ALREADY VICTOR-FREE in the sense that matters:
 *     `mintTreatyFromCarriedSheet` never runs `resolveVictor` — it reads two named
 *     parties off an artifact. Only `mintTreaty` (the live-appraisal road) resolves one.
 *   • THEIR REACHABILITY IS NOT. Both are module-private, and the ONLY road to either is
 *     `advanceTreaties`' PASS 1 loop, which iterates relationship edges looking for a
 *     fresh `sue_for_peace` incident on a de-escalated hostile edge. A peacetime sale
 *     has no war to end, so it can never enter that loop.
 *
 * Forking a second treaty writer was the named design defect and synthesizing a fake war
 * record would have been worse, so this file takes the third road the ruling leaves open:
 * a mint that lives INSIDE the peaceTerms writer family, composes the SAME catalog, the
 * same primitives and the same clock the head does, and is the only place a sale treaty
 * is ever authored. `peaceTerms.js` carries a pointer comment to it and does not
 * re-export it — deliberately: a re-export would draw this file into the head's 35-module
 * import cycle for nothing, and the composer that calls it must stay outside that cycle
 * (see satellitesLedger.js's header for what that cycle costs).
 *
 * ── CR-WR10-D: A SWAP IS TWO TREATIES, MINTED ATOMICALLY ────────────────────────
 *
 * §13 stacking is one-term-per-family per document, and `sovereignty_transfer` is its own
 * family, so two conveyances CANNOT share one document. The ruling's shape: two treaties,
 * each carrying one conveyance with the counter-settlement as a bundle component, bound by
 * one shared `swapId`, and NEITHER mints unless BOTH clear. This module therefore takes a
 * LIST of sales and is all-or-nothing: every treaty is built first, and only a complete
 * build folds anything onto the world. A partial swap — one town conveyed and one not — is
 * unrepresentable rather than merely avoided.
 *
 * ZERO NEW PERSISTED KEYS beyond the two the §4 clause declares (`sellerId`/`buyerId`,
 * drop-when-absent) and the shared `swapId`, itself conditional and present only on a
 * paired swap. The treaty rides the SAME `spatialLedgers.treaties` ledger, so persistence,
 * undo, regeneration and the veil are the ones the war settlement already had.
 *
 * PURE-ISH: no rng, no wall-clock. It writes exactly one ledger, through the accessor the
 * head uses, and returns everything else for its caller to fold.
 */
import { setSpatialLedger } from '../spatial/distanceRead.js';
import { TERM_CATALOG, PEACE_TERMS_TUNING, termLabel } from './peaceTermsCatalog.js';
import { round4, treatyPairKey } from './peaceTermsPrimitives.js';
import { treatyLedgerOf } from './treatyEnforcement.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from './treatyClock.js';
import { executeTreatyConveyances } from './sovereigntyTransfer.js';
// GR-1 — the one writer of `sworn`, shared with the head's mint loop so the third door
// stamps by the SAME law rather than by a second spelling of it.
import { stampSworn } from './oathHolder.js';
import { stablePart } from './stablePart.js';

/**
 * THE CONSIDERATION'S TERM TYPE FOR A COMPONENT FAMILY — derived, never tabled.
 *
 * The bundle stacker speaks FAMILIES (that is the §13 stacking axis and the unit a
 * court's needs are expressed in); a treaty carries TYPES. Rather than author a
 * family → type table that would go stale the day GR-3 mints the trade-rights rows, the
 * mapping is computed from the live catalog and resolved codepoint-first, which is
 * deterministic, self-updating, and honest about being a choice: the lightest thing a
 * court can promise in that family is the one it promises.
 *
 * `sovereignty_transfer` is excluded because the conveyance is the ASSET side, never the
 * consideration — a document may carry exactly one, and this function never supplies it.
 * @param {string} family @returns {string}
 */
export function considerationTypeFor(family) {
  return Object.keys(TERM_CATALOG).sort()
    .find((type) => TERM_CATALOG[type].family === family && type !== 'sovereignty_transfer') || '';
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {unknown} value @returns {number} */
function num01(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
}

/**
 * @typedef {Object} SovereigntySale
 * @property {string} assetId    the conveyed holding
 * @property {string} sellerId   the conveying court
 * @property {string} buyerId    the acquiring court
 * @property {string} [sellerName] @property {string} [buyerName]
 * @property {ReadonlyArray<{ family: string, magnitude01: number }>} components the bundle
 * @property {ReadonlyArray<string>} [reasons] the clearing's receipts, carried onto the document
 */

/**
 * BUILD ONE SALE TREATY. Returns null when the sale cannot be represented — no asset, no
 * two distinct parties, or a bundle that composes no term the catalog carries. A null is
 * what makes the swap atomic: the caller folds nothing when any leg returns one.
 *
 * @param {SovereigntySale} sale @param {number} tick @param {string} swapId
 * @returns {{ key: string, treaty: Record<string, unknown>, beat: Record<string, unknown> } | null}
 */
function buildSaleTreaty(sale, tick, swapId) {
  const assetId = text(sale?.assetId);
  const sellerId = text(sale?.sellerId);
  const buyerId = text(sale?.buyerId);
  if (!assetId || !sellerId || !buyerId || sellerId === buyerId) return null;

  const spec = TERM_CATALOG.sovereignty_transfer;
  const years = spec.baseYears;
  /** @type {Array<Record<string, unknown>>} */
  const terms = [{
    type: 'sovereignty_transfer',
    family: spec.family,
    magnitude: spec.baseMag,
    mintedTick: tick,
    expiresTick: tick + Math.round(years * PEACE_TERMS_TUNING.TICKS_PER_YEAR),
    weightSpent: spec.weight,
    complianceState: 'honored',
    trueState: 'honored',
    burden01: 0,
    // THE OBJECT OF THE CONVEYANCE. A sovereignty_transfer without it is refused by the
    // carried-sheet validator and by the writer; it is never optional in practice.
    assetId,
    seam: spec.executor === 'seam',
    receipt: `${sellerId} conveys ${assetId} to ${buyerId} for the term of ${years} years.`,
  }];

  // THE CONSIDERATION, ONE TERM PER FAMILY (§13 stacking, per document). The bundle's own
  // ordering is codepoint-stable, and a family the catalog does not carry — `peace`, and
  // every trade-rights family until TR-5 lands — contributes NO term rather than a
  // zero-valued one. It stays visible in the clearing's receipts, which is where the
  // graceful-degradation contract says an absent component must remain legible.
  const used = new Set(['sovereignty_transfer']);
  for (const raw of [...(Array.isArray(sale.components) ? sale.components : [])]
    .sort((a, b) => (String(a?.family) < String(b?.family) ? -1 : String(a?.family) > String(b?.family) ? 1 : 0))) {
    const family = text(raw?.family);
    if (!family || used.has(family)) continue;
    const type = considerationTypeFor(family);
    if (!type) continue;
    const componentSpec = TERM_CATALOG[type];
    used.add(family);
    const magnitude = round4(num01(raw?.magnitude01) * componentSpec.baseMag);
    /** @type {Record<string, unknown>} */
    const componentTerm = {
      type,
      family,
      magnitude,
      mintedTick: tick,
      expiresTick: tick + Math.round(componentSpec.baseYears * PEACE_TERMS_TUNING.TICKS_PER_YEAR),
      weightSpent: componentSpec.weight,
      complianceState: 'honored',
      trueState: 'honored',
      burden01: 0,
      receipt: `${buyerId} promises ${termLabel(type)} to ${sellerId} for ${componentSpec.baseYears} years.`,
    };
    if (componentSpec.stream) { componentTerm.deliveredToVictor = 0; componentTerm.extractedFromLoser = 0; }
    if (componentSpec.executor === 'seam') componentTerm.seam = true;
    terms.push(componentTerm);
  }
  terms.sort((x, y) => (String(x.type) < String(y.type) ? -1 : String(x.type) > String(y.type) ? 1 : 0));

  const sellerName = text(sale.sellerName) || sellerId;
  const buyerName = text(sale.buyerName) || buyerId;
  const receipts = [
    `The Conveyance of ${assetId} — ${sellerName} to ${buyerName}, agreed in peace and paid for.`,
    ...(Array.isArray(sale.reasons) ? sale.reasons.map(String) : []),
  ];

  /** @type {Record<string, unknown>} */
  const treaty = {
    // THE PAIR KEY RULE IS THE HEAD'S, VERBATIM: receiver first. On a war settlement that
    // is the victor; here it is the buyer, so `findTreatyByKey`'s directed split and every
    // ledger walk behave identically for both instruments.
    parties: [buyerId, sellerId],
    sellerId,
    buyerId,
    sellerName,
    buyerName,
    mintedTick: tick,
    budgetGranted: 0,
    budgetSpent: round4(terms.reduce((s, t) => s + (Number(t.weightSpent) || 0), 0)),
    treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
    terms,
    complianceState: 'honored',
    receipts,
  };
  // DROP-WHEN-ABSENT (T4): a solitary sale gains no swapId key at all.
  if (swapId) treaty.swapId = swapId;

  const beat = {
    id: `wizard_news.${tick}.sovereignty_sale_cleared.${stablePart(sellerId)}.${stablePart(buyerId)}.${stablePart(assetId)}`,
    kind: 'sovereignty_sale_cleared',
    assetId, fromId: sellerId, toId: buyerId, tick,
    settlementIds: [sellerId, buyerId, assetId],
    reasons: receipts.slice(1),
    ...(swapId ? { swapId } : {}),
  };
  return { key: treatyPairKey(buyerId, sellerId), treaty, beat };
}

/**
 * @typedef {Object} SaleMintResult
 * @property {Record<string, unknown>} worldState  the SAME reference when nothing minted
 * @property {Array<Record<string, unknown>>} settlementUpdates  likewise
 * @property {boolean} minted
 * @property {string} refusal  '' when minted; a closed word otherwise
 * @property {ReadonlyArray<Record<string, unknown>>} treaties
 * @property {ReadonlyArray<Record<string, unknown>>} newsSeeds  the conveyance writer's
 * @property {ReadonlyArray<Record<string, unknown>>} beats      one per minted document
 */

/**
 * MINT A SALE — or a SWAP's two treaties, atomically (CR-WR10-D).
 *
 * Every leg must build AND find its ledger slot free; a single failure mints nothing and
 * returns both inputs by reference, so a refused swap is byte-identical to no swap. The
 * conveyances then execute through `executeTreatyConveyances` — the SAME one-shot writer
 * the war road's mint loop calls, so the peacetime sale gains no executor of its own.
 *
 * GR-1: `settlementOf` is the SIGNATURE LINE's roster resolver. It defaults to "no
 * record", which resolves no oath-holder and stamps nothing — so every existing caller
 * and fixture is byte-unchanged, and the composer that HAS a snapshot hands its own
 * resolver in. A default of `null` rather than a thrown argument is deliberate: a sale
 * minted without roster access is a sale signed by the seat, which is precisely the
 * contract a legacy treaty already has.
 *
 * @param {{ sales?: ReadonlyArray<SovereigntySale>, worldState: Record<string, unknown>,
 *   settlementUpdates?: Array<Record<string, unknown>>, edges?: ReadonlyArray<Record<string, unknown>>,
 *   tick: number, now?: unknown, swapId?: string,
 *   settlementOf?: (id: string) => unknown }} args
 * @returns {SaleMintResult}
 */
export function mintSovereigntySaleTreaties({
  sales = [], worldState, settlementUpdates = [], edges = [], tick, now = null, swapId = '',
  settlementOf = () => null,
}) {
  const nothing = {
    worldState, settlementUpdates, minted: false,
    treaties: Object.freeze([]), newsSeeds: Object.freeze([]), beats: Object.freeze([]),
  };
  const rows = Array.isArray(sales) ? sales : [];
  if (rows.length === 0) return { ...nothing, refusal: 'no_sale' };
  const shared = rows.length > 1 ? (text(swapId) || `swap.${tick}.${rows.map((s) => stablePart(text(s?.assetId))).sort().join('.')}`) : '';

  const ledger = { ...(treatyLedgerOf(worldState) || {}) };
  /** @type {Array<{ key: string, treaty: Record<string, unknown>, beat: Record<string, unknown> }>} */
  const built = [];
  for (const sale of rows) {
    const one = buildSaleTreaty(sale, tick, shared);
    if (!one) return { ...nothing, refusal: 'unrepresentable' };
    // A LIVE TREATY ON THE PAIR REFUSES THE MINT, in either direction — the head's own
    // idempotence rule, and the reason a swap cannot half-land on a pair already bound.
    if (ledger[one.key] || ledger[treatyPairKey(text(sale.sellerId), text(sale.buyerId))]) {
      return { ...nothing, refusal: 'pair_already_bound' };
    }
    if (built.some((b) => b.key === one.key)) return { ...nothing, refusal: 'pair_already_bound' };
    built.push(one);
  }

  // GR-1 THE SIGNATURE LINE, at the THIRD mint door. A sale has no victor, so both the
  // buyer and the seller swear; the stamp lands before the ledger fold so the record
  // that persists is the record that was signed. Dark ⇒ no `sworn` key on any leg.
  for (const one of built) {
    stampSworn(one.treaty, {
      worldState, tick, settlementOf,
      ids: [text(one.treaty.buyerId), text(one.treaty.sellerId)],
    });
  }
  for (const one of built) ledger[one.key] = one.treaty;
  let state = setSpatialLedger(worldState, 'treaties', Object.fromEntries(
    Object.keys(ledger).sort().map((k) => [k, ledger[k]]),
  ));
  let updates = settlementUpdates;
  /** @type {Array<Record<string, unknown>>} */
  const newsSeeds = [];
  for (const one of built) {
    const conveyed = executeTreatyConveyances({
      treaty: one.treaty, worldState: state, settlementUpdates: updates, edges, tick, now,
    });
    state = conveyed.worldState;
    updates = conveyed.settlementUpdates;
    newsSeeds.push(...conveyed.newsSeeds);
  }

  return {
    worldState: state,
    settlementUpdates: updates,
    minted: true,
    refusal: '',
    treaties: Object.freeze(built.map((b) => b.treaty)),
    newsSeeds: Object.freeze(newsSeeds),
    beats: Object.freeze(built.map((b) => b.beat)),
  };
}
