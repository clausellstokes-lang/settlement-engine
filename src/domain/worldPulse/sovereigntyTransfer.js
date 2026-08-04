/**
 * sovereigntyTransfer.js — WR-10 amendment S: THE ONE CONVEYANCE WRITER.
 *
 * A settlement changes hands. This leaf is the only place in the engine where that
 * sentence becomes state, and it is deliberately ONE writer for BOTH asset kinds and
 * BOTH roads: the wartime cession an envoy carries home and ratifies, and the
 * peacetime sale a market clearing composes, reach the SAME treaty mint and execute
 * here. Two transports, one executor — the seam ruling's shape, and the reason a
 * future third road (the DM verb) needs no arm of its own.
 *
 * IT FIRES ONCE, AT MINT. `sovereignty_transfer` is `stream: false` — sovereignty is
 * not delivered in installments — so the conveyance rides the mint-time execution
 * point beside the compelled-alliance nudge rather than the per-tick treaty walk.
 *
 * ZERO NEW PERSISTED KEYS, and that is the architecture rather than a boast. A
 * conveyance REWRITES records that already exist, in the homes they already live in:
 * a steading's row moves between parents inside `spatialLedgers.satellites`, and a
 * vassalage's `occupierId` is rewritten in place inside `worldState.occupations`.
 * Nothing here mints a ledger, a top-level key, or a second copy of a fact.
 *
 * THE WRITER IS TRUTH-SIDE, AND MUST BE. K3 forbids reality-checking the NEGOTIATION —
 * an absurd term may be drafted, argued for and signed, because a court's picture of
 * the world is allowed to be wrong. It says nothing about the moment of execution. A
 * clause that promises a town its signatory no longer holds is not a fiction to be
 * honored; it is a promise that has already been broken by events. So eligibility is
 * RE-READ against live truth here, and a failed re-read LAPSES with a receipt naming
 * what the world actually says (the white-peace idiom: the machinery ran and produced
 * nothing). The broken promise is then the Herald's story and the next grievance —
 * which is a better outcome than a silent write of a lie.
 *
 * WHAT IS NEVER WRITTEN. `settlement.parentRef` (the immutable founding receipt: an
 * import, a sale, or a severance must never rewrite history) and the regionalGraph
 * lineage edge (the live political bond, which is the graph's to sever, not the
 * market's). WR-3's reclaim and independence claims keep reading both, untouched, so
 * the market cause and the lineage cause compose for free. Also never written:
 * population — people do not move because a deed did — and any new key at all.
 *
 * ZERO PRNG. Every choice here is deterministic; the wave takes no draw from any fork
 * in either configuration, so the kernel's stream identity is preserved by
 * construction rather than by fencing.
 *
 * DARK ⇒ A COMPLETE NO-OP: the same worldState reference, zero writes, zero receipts.
 * The gate is the whole `SOVEREIGNTY_REQUIRED_RULES` conjunction, strict `=== true`,
 * so ABSENT and explicit FALSE are identical by construction.
 *
 * THE NEWS SEAM IS DECLARED, NOT WIRED (the puppet_seat/disclosure precedent). This
 * writer returns typed `newsSeeds` — facts with an address chain and no prose. The
 * fifteen authored Herald kinds that render them are lane WW-C's; until they land the
 * seeds are carried and dropped by the caller rather than pushed as unregistered
 * entries, because a beat with no registry row reaches the feed addressed to nowhere.
 */
import { clamp01 } from '../../kernel/math.js';
import { readSovereigntyAsset, sovereigntyTradeActive } from './sovereigntyAssets.js';
import { conveySteading } from './settlementLifecycleKernel.js';
import { conveyOccupationRecord } from './occupation.js';
// THE SANCTIONED RELATIONSHIP APPLICATOR, reached DIRECTLY rather than through
// peaceTermsOverlay.js — which owns the PEACE ENGINE's five overlay writes and would
// have been the tidy home for a sixth. The sale's grudge is not one of them: it is the
// MARKET's write, and the DM-verb road executes the same conveyance with no treaty
// anywhere in it, so filing it under the treaty machinery would misname it and then
// strand it. Writing the overlay through this applicator from outside the peace-engine
// family is the estate's established pattern (traditionsKernel, eliteBleed and
// informationStatecraft all do it), and going direct keeps this leaf's reach to the two
// smallest modules that can do the job instead of the whole peaceTerms family.
//   IMPORT-CYCLE NOTE, measured rather than assumed: `peaceTerms.js` importing this
// file does put it in a cycle, but not a NEW one — `worldState.js → envoyErrand.js →
// … → negotiationPictures.js → peaceTerms.js` already makes most of this layer cyclic
// with the treaty head, including peaceTerms' own direct import of peaceTermsOverlay.
// The reach argument above is what decides the filing; the cycle is a wash either way.
import { applyRelationshipPatch, edgeBetween } from './relationshipEvolution.js';
import { relationshipKeyFromEdge } from './relationshipState.js';
// The estate's ONE publicLegitimacy applicator over pending settlement writes.
import { applyLegitimacyDeltasToUpdates } from './generosityUpdates.js';

/**
 * ⚠ EVERY BAND HERE IS UNSOAKED. They are authored raw and deliberately NOT in
 * proposedSoakBands.js (that file's status-RATIFIED gate); §7 THE TUNING SURFACE owns
 * them and the owner signs them at the soak redo. Each carries the two live anchors it
 * sits between, so the interval a soak may move it inside is visible rather than
 * inferred — the dead-band law's own remedy.
 */
export const SOVEREIGNTY_TRANSFER_TUNING = Object.freeze({
  // The fragility FLOOR a sale raises the vassalage's resistance to. Anchored BELOW
  // occupation.js's fresh-conquest seed (0.35 — being sold is not being stormed) and
  // ABOVE its RESISTANCE_CONDITION_FLOOR (0.20 — under that the occupation stamps no
  // resistance condition at all, so a band there would be a silent write nobody could
  // see). A floor, never a set: an already-restive vassal is not calmed by being sold.
  RESISTANCE_START: 0.3,
  // The one-shot resentment the sold settlement holds toward the court that sold it.
  // Anchored at the coalition betrayal's CREDIBILITY_HIT (0.3) — half a year of
  // tribute strain (STRAIN_RESENTMENT_PER_YEAR 0.6) — because both are the same kind
  // of fact: a party you were bound to traded you away.
  GRIEVANCE_MAGNITUDE: 0.3,
  // The publicLegitimacy score dent on a BOUGHT seat (0..100 scale). Declared
  // REGEN-VOLATILE in the §4 clause: publicLegitimacy is a generated field and a
  // regeneration recomputes it. The DURABLE half of the sale's fragility is the
  // occupation record's `resistance` above, which is campaign state and survives.
  LEGITIMACY_DELTA: -6,
});

const T = SOVEREIGNTY_TRANSFER_TUNING;

/** @param {unknown} v @returns {Record<string, unknown>} */
function recordOf(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @returns {string} */
function text(v) {
  return typeof v === 'string' && v.length > 0 ? v : '';
}

/** The empty result, shared by the dark path and every refusal so a caller can never
 *  tell them apart by shape — only by the flags and the receipt. Frozen arrays cannot
 *  be pushed into by accident downstream. */
const NOTHING = Object.freeze({
  executed: false,
  receipts: Object.freeze([]),
  newsSeeds: Object.freeze([]),
  legitimacyDeltas: Object.freeze([]),
});

/**
 * THE SALE'S GRIEVANCE: a settlement that was conveyed resents the court that sold it.
 *
 * The wound is FUEL, not a record. It rides the sold settlement's existing edge to its
 * seller, and the reasons layer's `grievance` scorer reads `resentment` directly — so
 * the grudge decays on the ordinary memory half-life without a ledger, a decree, or a
 * clock of its own. A decree would have been the wrong instrument twice over: its ramp
 * reaches zero in eight ticks, so two months after being sold a town would have
 * forgotten it.
 *
 * A ONE-SHOT, not an accrual: unlike §12.3's per-tick tribute strain there is no
 * recurring burden to divide by the treaty year, so the magnitude lands whole, once, at
 * the mint.
 *
 * ⚠ THE INCIDENT TYPE IS DELIBERATELY OUTSIDE THE REVANCHISM WOUND SET, and both halves
 * of that are pinned. `scoreRevanchism` counts only incidents matching
 * /war|betray|tribute|conquest|occupation|sack|raid/ — the decade clock for war wounds.
 * `sovereignty_sale` matches none of them ON PURPOSE: a conveyance is a grudge against a
 * seller, not a war wound, and spelling it to slip into that set (say, as a "tribute"
 * variant) would smuggle a ten-year revanche clause into a clause the volume says rides
 * ordinary grievance decay. If a sold town also carries real war wounds, those still
 * count — this write only refuses to manufacture one.
 *
 * No edge ⇒ a byte-safe no-op: a sold settlement with no graph edge to its seller has
 * nowhere to hold the grudge, and synthesizing a relationship key would invent one.
 *
 * @param {Record<string, unknown>} worldState
 * @param {ReadonlyArray<Record<string, unknown>>} edges
 * @param {string} soldId @param {string} sellerId @param {number} magnitude01 @param {unknown} now
 * @returns {Record<string, unknown>}
 */
function accrueSaleGrievance(worldState, edges, soldId, sellerId, magnitude01, now) {
  const edge = edgeBetween(edges, soldId, sellerId);
  if (!edge) return worldState;
  const key = relationshipKeyFromEdge(edge);
  const current = /** @type {{ relationshipStates?: Record<string, { resentment?: number, trust?: number }> }} */ (
    worldState).relationshipStates?.[key];
  const m = clamp01(magnitude01);
  return applyRelationshipPatch(worldState, {
    relationshipKey: key,
    relationshipPatch: {
      resentment: clamp01((Number(current?.resentment) || 0) + m),
      trust: clamp01((Number(current?.trust) || 0) - m),
    },
    metadata: { incidentType: 'sovereignty_sale' },
    proposalPayload: null,
  }, now == null ? (/** @type {{ updatedAt?: unknown }} */ (worldState).updatedAt ?? null) : now, edge);
}

/**
 * @typedef {Object} SovereigntyTransferResult
 * @property {Record<string, unknown>} worldState the SAME reference when nothing wrote
 * @property {boolean} executed  the conveyance landed
 * @property {boolean} lapsed    the clause was live but the world had moved (receipted)
 * @property {ReadonlyArray<string>} receipts  treaty-voice lines (the treaty IS the artifact)
 * @property {ReadonlyArray<Record<string, unknown>>} newsSeeds  typed facts for WW-C
 * @property {ReadonlyArray<{ id: string, delta: number, reason: string }>} legitimacyDeltas
 */

/**
 * Execute ONE `sovereignty_transfer` clause at its treaty's mint.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {Record<string, unknown>} args.term      the minted TermRecord (carries `assetId`)
 * @param {Record<string, unknown>} [args.treaty]  the document the clause rides (receipt voice)
 * @param {string} args.sellerId  the conveying court — a treaty's LOSER gives
 * @param {string} args.buyerId   the acquiring court — a treaty's VICTOR receives
 * @param {number} args.tick
 * @param {ReadonlyArray<Record<string, unknown>>} [args.edges] the regional graph's edges.
 *   Required for the grievance, which rides the sanctioned relationship applicator on a
 *   REAL edge; absent ⇒ the conveyance still lands and the grudge has nowhere to sit.
 * @param {unknown} [args.now]
 * @returns {SovereigntyTransferResult}
 */
export function executeSovereigntyTransfer({
  worldState, term, treaty = {}, sellerId, buyerId, tick, edges = [], now = null,
}) {
  // ── THE GATE. Dark ⇒ the same reference back, and not one read below runs. ──
  if (!sovereigntyTradeActive(worldState)) return { ...NOTHING, worldState, lapsed: false };

  const assetId = text(recordOf(term).assetId);
  const seller = text(sellerId);
  const buyer = text(buyerId);
  if (text(recordOf(term).type) !== 'sovereignty_transfer' || !assetId || !seller || !buyer
    || seller === buyer) return { ...NOTHING, worldState, lapsed: false };

  // ── 1. ELIGIBILITY, RE-READ AGAINST LIVE TRUTH (see the header). ──
  const asset = readSovereigntyAsset(worldState, assetId);
  if (asset.tradeable !== true || asset.holderId !== seller) {
    return {
      ...NOTHING,
      worldState,
      lapsed: true,
      receipts: Object.freeze([
        `The cession of ${assetId} conveyed nothing: ${asset.receipt}`,
      ]),
      newsSeeds: Object.freeze([Object.freeze({
        kind: 'sovereignty_no_trade',
        assetId, fromId: seller, toId: buyer, tick,
        settlementIds: Object.freeze([seller, buyer, assetId]),
        reasons: Object.freeze([asset.receipt]),
      })]),
    };
  }

  /** @type {string[]} */
  const receipts = [];
  /** @type {Array<Record<string, unknown>>} */
  const newsSeeds = [];
  /** @type {Array<{ id: string, delta: number, reason: string }>} */
  const legitimacyDeltas = [];
  let state = worldState;

  if (asset.kind === 'satellite') {
    // ── 2a. THE SATELLITE ARM: a row-move inside the existing ledger, orbit
    // re-derived at the destination. The steading pen owns the move (see
    // settlementLifecycleKernel.conveySteading) so this file never becomes a second
    // satellites writer. A steading has no relationship object, no seat and no
    // legitimacy score, so its grievance is the `conveyed` provenance the move stamps:
    // it folds into `parentRef` at graduation and matures through the WR-3 seam.
    //   THE TIER CAP IS NOT RE-IMPOSED HERE, deliberately. SATELLITE_CAPS governs who
    // may FOUND a steading (mintSteading enforces it, under force as under growth); it
    // is not a ceiling on how many a court may HOLD. Re-checking it at execution would
    // void a signed treaty after the fact, which is exactly the phantom-refusal the
    // queue-mouth law forbids — filtering unsuitable buyers is the market composer's
    // job, at drafting time, where a refusal is still legible.
    const moved = conveySteading(state, assetId, seller, buyer, tick);
    if (!moved) {
      return {
        ...NOTHING,
        worldState,
        lapsed: true,
        receipts: Object.freeze([`The cession of ${assetId} conveyed nothing: the steading was not where the deed said it was.`]),
      };
    }
    state = moved.worldState;
    receipts.push(`${assetId} passed from ${seller} to ${buyer} — a steading is property, and property changes hands.`);
    newsSeeds.push(Object.freeze({
      kind: 'sovereignty_edge_rewritten',
      assetId, fromId: seller, toId: buyer, tick, assetKind: 'satellite',
      settlementIds: Object.freeze([seller, buyer]),
      reasons: Object.freeze(['The steading answers to a new parent; its people, its ground and its founding line are untouched.']),
    }));
  } else {
    // ── 2b. THE VASSAL ARM: an in-place occupierId rewrite that PRESERVES the rung.
    // Routing this through createOccupationRecord would reset the ladder to
    // `contested` and hand the buyer a fight instead of the holding it bought — see
    // occupation.conveyOccupationRecord for why the rung is carried across.
    const occupations = recordOf(recordOf(state).occupations);
    const prior = recordOf(occupations[assetId]);
    const next = conveyOccupationRecord(prior, buyer, tick, T.RESISTANCE_START);
    state = { ...state, occupations: { ...occupations, [assetId]: next } };
    receipts.push(`The vassalage of ${assetId} passed from ${seller} to ${buyer}, its rung intact and its people less governable for it.`);
    // ── 3. THE GRIEVANCE IS FUEL, NOT A RECORD. It rides the sold settlement's own
    // edge to the court that sold it; the reasons layer's `grievance` scorer reads
    // resentment directly and carries it on the ordinary memory decay. Deliberately
    // NOT typed to match the revanchism wound set: a conveyance is a grudge against a
    // seller, not a war wound, and borrowing the decade clock by spelling would be a
    // semantic smuggle. Both halves of that choice are pinned.
    state = accrueSaleGrievance(
      state, /** @type {Array<Record<string, unknown>>} */ (edges),
      assetId, seller, T.GRIEVANCE_MAGNITUDE, now,
    );
    // ── 4. THE LEGITIMACY ECHO (declared regen-volatile — the durable fragility is
    // the resistance above). Returned rather than written: publicLegitimacy lives on
    // the settlement record, which this worldState writer does not hold.
    legitimacyDeltas.push({
      id: assetId,
      delta: T.LEGITIMACY_DELTA,
      reason: `${assetId} learned it had been sold, and a bought seat is believed less.`,
    });
    newsSeeds.push(Object.freeze({
      kind: 'bought_seat_fragility',
      assetId, fromId: seller, toId: buyer, tick, assetKind: 'vassal',
      resistance: Number(next.resistance) || 0,
      settlementIds: Object.freeze([assetId, seller, buyer]),
      reasons: Object.freeze(['A seat bought from an overlord is obeyed less than one that was never for sale.']),
    }));
    newsSeeds.push(Object.freeze({
      kind: 'sold_settlement_grievance',
      assetId, fromId: seller, toId: buyer, tick,
      settlementIds: Object.freeze([assetId, seller]),
      reasons: Object.freeze(['The town holds the sale against the court that made it, and will go on holding it.']),
    }));
  }

  newsSeeds.push(Object.freeze({
    kind: 'sovereignty_sale_cleared',
    assetId, fromId: seller, toId: buyer, tick,
    treatyId: text(recordOf(treaty).sourceTermSheetId) || `treaty.${seller}.${buyer}.${tick}`,
    settlementIds: Object.freeze([seller, buyer, assetId]),
    reasons: Object.freeze(['The instrument is the treaty; the conveyance executed at its signing.']),
  }));

  return {
    worldState: state,
    executed: true,
    lapsed: false,
    receipts: Object.freeze(receipts),
    newsSeeds: Object.freeze(newsSeeds),
    legitimacyDeltas: Object.freeze(legitimacyDeltas),
  };
}

/**
 * THE MINT-TIME ENTRY POINT: execute every cession clause a freshly-minted treaty
 * carries, and fold the results into the tick's pending writes.
 *
 * It lives here rather than in `peaceTerms.js` for two reasons that are both about
 * keeping one law in one place. First, the treaty head is a hot file near its size
 * ceiling, and a wave that fills it hands the next lane a decomposition it did not ask
 * for. Second, everything this function knows — that a lapse still earns a line on the
 * document, that the legitimacy dent is an echo applied to pending settlement writes,
 * that the news seeds wait for their registry rows — is WR-10's knowledge, not the
 * peace engine's, and the DM-verb road will want the same fold with no treaty at all.
 *
 * The victor RECEIVES and the loser GIVES: the orientation every other term uses.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.treaty the freshly minted document (mutated only
 *   through its own `receipts` array — the artifact records what it did)
 * @param {Record<string, unknown>} args.worldState
 * @param {Array<Record<string, unknown>>} args.settlementUpdates the tick's pending writes
 * @param {ReadonlyArray<Record<string, unknown>>} args.edges
 * @param {number} args.tick @param {unknown} [args.now]
 * @returns {{ worldState: Record<string, unknown>, settlementUpdates: Array<Record<string, unknown>>,
 *             newsSeeds: ReadonlyArray<Record<string, unknown>> }}
 *   Both inputs come back BY REFERENCE when nothing conveyed (dark, or no cession clause).
 */
export function executeTreatyConveyances({ treaty, worldState, settlementUpdates, edges, tick, now = null }) {
  const terms = Array.isArray(recordOf(treaty).terms) ? /** @type {Array<Record<string, unknown>>} */ (treaty.terms) : [];
  let state = worldState;
  let updates = settlementUpdates;
  /** @type {Array<Record<string, unknown>>} */
  const newsSeeds = [];
  for (const term of terms) {
    if (text(recordOf(term).type) !== 'sovereignty_transfer') continue;
    const done = executeSovereigntyTransfer({
      worldState: state, term, treaty,
      sellerId: text(recordOf(treaty).loserId), buyerId: text(recordOf(treaty).victorId),
      tick, edges, now,
    });
    state = done.worldState;
    newsSeeds.push(...done.newsSeeds);
    // A LAPSE EARNS A LINE TOO. A treaty that silently conveyed nothing is a worse
    // artifact than one that says the town had already changed hands.
    if (done.receipts.length && Array.isArray(treaty.receipts)) treaty.receipts.push(...done.receipts);
    if (done.legitimacyDeltas.length) {
      updates = applyLegitimacyDeltasToUpdates(
        /** @type {never} */ (updates),
        new Map(updates.map((entry, index) => [String(entry.saveId), index])),
        /** @type {never} */ (new Map(done.legitimacyDeltas.map((row) => [row.id, row.delta]))),
      );
    }
  }
  // The seeds are typed facts awaiting lane WW-C's fifteen authored Herald kinds. They
  // are deliberately NOT returned as news entries: a beat whose kind has no registry
  // row is refused by normalizeEntry and narrated into a void — the exact defect the
  // treaty_signed beat itself had to be repaired for.
  return { worldState: state, settlementUpdates: updates, newsSeeds: Object.freeze(newsSeeds) };
}
