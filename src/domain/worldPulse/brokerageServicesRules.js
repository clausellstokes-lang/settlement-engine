/**
 * domain/worldPulse/brokerageServicesRules.js — [W-I INFORMATION BROKERAGES] I3 + I4, THE
 * KNOWLEDGE LANE'S INSTITUTIONAL GENERATORS (docs/DESIGN_INFORMATION_BROKERAGES.md §6, the
 * knowledge-lane clause).
 *
 * WHAT THIS FIXES, AND IT IS A MEASURED PROBLEM. The behavioural certification's
 * `knowledge` mover family is a RESIDUAL BUCKET: the estate's own audit found that exactly
 * one impactKind reaches it on its own vocabulary and fifteen more fall into it through
 * the bare word `news` in their wizard-news id (src/domain/certification/
 * knowledgeLaneEvidence.js, measured 2026-07-31). The lane looked populated and was empty.
 * Nothing in the realm ever DID anything that was, in itself, a movement of knowledge.
 *
 * The brokerages are that missing verb. Four acts, minted here, each classified into
 * `knowledge` on its OWN vocabulary rather than on an id prefix:
 *
 *   brokerage_query      a power pays its house for an answer.
 *   brokerage_feed       the standing contract delivers.
 *   brokerage_plant      a patron commissions a lie through the market (I4).
 *   brokerage_intercept  a rival power takes the feed for itself (the espionage-target
 *                        surface a visible patron edge creates).
 *
 * ── HOW THE FILING IS EARNED, AND WHY IT COST A ONE-LINE FIX ELSEWHERE ──
 *
 * `moverFamilyOf` joins ruleFamily, candidateType, ruleId, impactKind, type, kind and id
 * and returns the FIRST family whose token list matches, with `politics` checked before
 * `knowledge` and the bare token `faction` in politics's list. So a candidate typed
 * 'faction' — which is what the applier used to require before it would apply a
 * factionPatch — could never file as knowledge, and a brokerage act that charged its
 * patron would have certified the politics lane instead of the one it belongs to. The cure
 * was to make the applier key on the PAYLOAD (applyWorldPulse.js, one line, byte-identical
 * by census), so these acts can both charge a real price and file where they belong.
 * tests/domain/brokerageServices.test.js executes `moverFamilyOf` over every act and
 * requires 'knowledge' from all four, so the filing is measured and not hoped for.
 *
 * ── ONE ACT PER SETTLEMENT PER TICK, DELIBERATELY ──
 *
 * A house does one piece of business a week in the world's telling, chosen by a
 * deterministic rotation over what it can actually do. Not because more would be wrong,
 * but because the alternative is a realm whose chronicle is nothing but brokers, and
 * because a per-settlement flood would eat the candidate budget every other lane shares.
 * The rotation consumes no rng; only the ordinary per-candidate probability roll does.
 *
 * DORMANT ⇒ an immediate empty array: no roster walk, no binding derivation, no draw.
 */

import { fnv1a32 } from '../../kernel/proseHash.js';
import { brokerageEffectsActive } from './brokerageStamps.js';
import { brokeragePatronBindings, eligiblePatrons } from './brokeragePatronage.js';
import { patronFeedEdges } from './brokerageServicesFeed.js';
import { answerBrokerageQuery, interceptOutboundRecord } from './brokerageServices.js';
import { commissionPlant, marketHouseOf } from './brokerageServicesPlant.js';

/**
 * The closed act vocabulary, in ROTATION ORDER. Also the exact `eventTypes` the
 * informationBrokeragesEnabled certification row declares, which is why it lives in one
 * frozen array a test can read rather than in four string literals.
 * @type {readonly string[]}
 */
export const BROKERAGE_ACTS = Object.freeze([
  'brokerage_query', 'brokerage_feed', 'brokerage_intercept', 'brokerage_plant',
]);

/**
 * Per-act tempo (PROPOSED, soak-vetoable). Reactive, not a hum: a house does business when
 * there is business, and the realm hears about it rarely enough that hearing about it
 * means something.
 *
 * ── WHY THE MINT IS DYNAMIC, AND WHERE THE CENSUS FOR IT LIVES ──
 *
 * The act is chosen at runtime, so the candidateType is assigned from a variable rather
 * than written as a `candidateType: '<literal>'`. That is the estate's own idiom for a
 * TEMPLATE FAMILY (strategy_${move}, npc_${family}, tier_${direction}, ${kind}_pressure),
 * and both display walkers say in their own headers that a dynamic mint is out of a
 * literal scan's reach. The compliance path for a template family is a family PREFIX rule
 * in src/domain/realm/heraldRouting.js.
 *
 * ── THAT REGISTRATION IS NOW MADE (IN-0b, 2026-08-06) ──
 *
 * I3/I4 REPORTED the one-line entry `['brokerage_', 'events']` rather than making it,
 * because heraldRouting.js belonged to a concurrent session that wave. IN-0b makes it, in
 * the commit that turns the intercept into a real act. The SECTION is unchanged — all four
 * acts already landed on 'events' through the declared catch-all — so nothing routes
 * differently; what changed is that they land there by DECISION rather than by
 * fall-through, which is the difference `isExplicitlyRouted` measures.
 *
 * The census is not skipped in the meantime. tests/domain/brokerageServices.test.js
 * enforces, over BROKERAGE_ACTS itself, the same three invariants the shared walkers
 * enforce over their literal scans: the act phrases to readable words rather than a raw
 * slug, it borrows no town crier's voice, and it routes to a real Herald section. The
 * ONLY thing the prefix rule adds is that the routing becomes EXPLICIT instead of riding
 * the declared catch-all, which for a brokerage act lands on the same section either way.
 * @type {Readonly<Record<string, { probability: number, severity: number }>>}
 */
export const BROKERAGE_ACT_TEMPO = Object.freeze({
  brokerage_query: Object.freeze({ probability: 0.18, severity: 0.30 }),
  brokerage_feed: Object.freeze({ probability: 0.12, severity: 0.22 }),
  brokerage_intercept: Object.freeze({ probability: 0.07, severity: 0.44 }),
  brokerage_plant: Object.freeze({ probability: 0.06, severity: 0.52 }),
});

/**
 * WHAT THE WATCHER GOT, IN WORDS (IN-0b). The intercept's second reason sentence, one per
 * vagueness band — prose, never the scalar and never the band slug (the legibility law and
 * the game-grade doctrine's "translate formulas").
 *
 * TOTAL over INTERCEPT_VAGUENESS_BANDS, and pinned so; a band added upstream without a
 * sentence here reds rather than rendering `undefined` into a chronicle. The `opaque` entry
 * is total-for-totality and is never SELECTED: at that band the read refuses above and the
 * act mints nothing at all. It is present so the table cannot be half-widened, not because
 * the mint can reach it.
 * @type {Readonly<Record<string, string>>}
 */
export const INTERCEPT_BAND_REASONS = Object.freeze({
  legible: 'The town keeps no secrets worth the name, so the whole of the traffic read plainly.',
  clouded: 'Gates half-raised cost the watcher the subtlest of it, and left the rest standing.',
  fogged: 'Behind closed gates only the bare shape survived: that a contract exists at all.',
  opaque: 'Nothing survived the gates.',
});

/** The relationship labels the seat reads as hostile (beliefMap's own set, local copy). */
const HOSTILE_LABELS = new Set(['hostile', 'cold_war', 'rival']);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return typeof v === 'string' ? v : String(v == null ? '' : v);
}

/** Codepoint order. @param {string} a @param {string} b @returns {number} */
function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The seat belief slot of one observer. @param {unknown} worldState @param {string} id
 *  @returns {Record<string, unknown>} */
function seatBeliefs(worldState, id) {
  const maps = asObject(asObject(asObject(worldState).spatialLedgers).beliefMaps);
  return asObject(asObject(maps[text(id)]).seat);
}

/**
 * The subject a house's patron most wants to know about: the codepoint-first believed
 * HOSTILE, falling back to the codepoint-first subject the seat holds any belief about.
 * Null when the seat believes nothing, which is a settlement with no question to ask.
 * @param {Record<string, unknown>} seat @returns {string|null}
 */
function subjectOfInterest(seat) {
  const ids = Object.keys(seat).sort(compareCodepoint);
  for (const id of ids) {
    const record = asObject(seat[id]);
    if (HOSTILE_LABELS.has(text(record.allianceLabel))) return id;
  }
  return ids.length ? ids[0] : null;
}

/**
 * The declared relationship on the regional graph edge between two settlements, which is
 * the GROUND TRUTH for the politics channel. Null when no edge stands, in which case the
 * query answers from belief alone and says so in the claim's provenance.
 * @param {unknown} graph @param {string} a @param {string} b @returns {string|null}
 */
function edgeRelationship(graph, a, b) {
  const edges = Array.isArray(asObject(graph).edges) ? asObject(graph).edges : [];
  for (const raw of /** @type {unknown[]} */ (edges)) {
    const edge = asObject(raw);
    const from = text(edge.from);
    const to = text(edge.to);
    if ((from === a && to === b) || (from === b && to === a)) {
      const label = text(edge.relationshipType || edge.type);
      return label || null;
    }
  }
  return null;
}

/**
 * Build one brokerage candidate. The shape mirrors the estate's other stochastic
 * producers; the two fields that carry this slice's whole argument are `ruleFamily`
 * ('information', a knowledge token) and `type` ('information' likewise), because the two
 * of them are what put the act in the lane it belongs to.
 *
 * @param {Object} args
 * @param {string} args.act one of BROKERAGE_ACTS
 * @param {string} args.settlementId
 * @param {number} args.tick
 * @param {string} args.headline @param {string} args.summary
 * @param {readonly string[]} args.reasons
 * @param {Record<string, unknown>} args.metadata
 * @param {string} [args.factionId] the power charged, when the act is paid for
 * @param {Record<string, unknown>|null} [args.factionPatch] the charge itself
 * @returns {Record<string, unknown>}
 */
function brokerageCandidate({
  act, settlementId, tick, headline, summary, reasons, metadata, factionId, factionPatch = null,
}) {
  const tempo = /** @type {Record<string, { probability: number, severity: number }>} */
    (BROKERAGE_ACT_TEMPO)[act];
  return {
    id: `candidate.brokerage.${act}.${settlementId}.${tick}`,
    type: 'information',
    candidateType: act,
    ruleId: act,
    ruleFamily: 'information',
    targetSaveId: settlementId,
    severity: tempo.severity,
    probability: tempo.probability,
    applyMode: 'auto',
    headline,
    summary,
    reasons: [...reasons],
    metadata: { settlementId, ...metadata },
    ...(factionId ? { factionId } : {}),
    ...(factionPatch ? { factionPatch } : {}),
    conflictTags: [`brokerage:${settlementId}`],
    generatedAtTick: tick,
  };
}

/**
 * THE PRODUCER. One act per settlement per tick, chosen by rotation over what the houses
 * standing there can actually do right now.
 *
 * @param {Object} snapshot the pulse snapshot
 * @param {unknown} pressureIdx unused here (the acts read belief and roster, not pressure)
 * @param {Object} context
 * @returns {Array<Record<string, unknown>>}
 */
export function evaluateBrokerageServiceRules(snapshot, pressureIdx, context = {}) {
  const snap = asObject(snapshot);
  const worldState = asObject(snap.worldState);
  if (!brokerageEffectsActive(worldState)) return [];
  const ctx = asObject(context);
  const tick = Math.max(0, Math.floor(typeof ctx.tick === 'number' && Number.isFinite(ctx.tick)
    ? ctx.tick : Number(worldState.tick) || 0));
  const settlements = Array.isArray(snap.settlements) ? snap.settlements : [];
  const byId = snap.byId instanceof Map ? snap.byId : new Map();
  const nameFor = (/** @type {string} */ id) => text(asObject(asObject(byId.get(id)).settlement).name) || id;
  /** @type {Array<Record<string, unknown>>} */
  const out = [];

  for (const raw of [...settlements].sort((a, b) => compareCodepoint(text(asObject(a).id), text(asObject(b).id)))) {
    const item = asObject(raw);
    const settlementId = text(item.id);
    if (!settlementId) continue;
    const bindings = brokeragePatronBindings({ worldState, item });
    if (!bindings.length) continue;
    const edges = patronFeedEdges({ worldState, item });
    const seat = seatBeliefs(worldState, settlementId);
    const subjectId = subjectOfInterest(seat);
    const market = marketHouseOf(item);

    // What this settlement's houses can do THIS tick, in the closed rotation order.
    /** @type {string[]} */
    const available = [];
    if (subjectId) available.push('brokerage_query');
    if (edges.length) available.push('brokerage_feed');
    if (edges.length) available.push('brokerage_intercept');
    if (market && subjectId) available.push('brokerage_plant');
    if (!available.length) continue;
    const act = available[(fnv1a32(settlementId) + tick) % available.length];

    if (act === 'brokerage_query') {
      const asker = bindings[0];
      const truth = edgeRelationship(snap.regionalGraph, settlementId, text(subjectId));
      const result = answerBrokerageQuery({
        worldState,
        item,
        subjectId: text(subjectId),
        channel: truth ? 'politics' : 'war',
        patronId: asker.patronId,
        tick,
        delayTicks: 0,
        groundTruth: truth ? { allianceLabel: truth } : null,
      });
      // A REFUSAL IS NOT AN EVENT. The house declining, or the patron being unable to pay,
      // is the honest outcome and it is SILENT: minting a beat for every question nobody
      // could afford would fill the chronicle with non-events and, worse, would let the
      // knowledge lane certify itself off failures.
      if (result.refused || !result.answer || !result.charge) continue;
      out.push(brokerageCandidate({
        act,
        settlementId,
        tick,
        headline: `${asker.patronName} buys an answer from ${asker.houseName}`,
        summary: `${asker.patronName} paid ${asker.houseName} of ${nameFor(settlementId)} for what it holds on ${nameFor(text(subjectId))}, and was answered at the house's own grade.`,
        reasons: [
          `The house sells what its register already holds; it does not sell certainty.`,
          `${result.price ? result.price.detail : 'The house named its price.'}`,
        ],
        metadata: {
          subjectId: text(subjectId),
          receipt: result.receipt,
          claimSources: result.answer.claims.map((claim) => claim.from),
        },
        factionId: result.charge.patronId,
        factionPatch: result.charge.factionPatch,
      }));
      continue;
    }

    if (act === 'brokerage_feed') {
      const edge = edges[0];
      const channels = Object.keys(asObject(edge.pullByChannel)).sort(compareCodepoint);
      out.push(brokerageCandidate({
        act,
        settlementId,
        tick,
        headline: `The register of ${nameFor(settlementId)} reports to its patron`,
        summary: `A standing contract came due: the house delivered its reading to the power that keeps it, sharpening what that power believes without ever making it certain.`,
        reasons: [
          `A patron pays for a register so that it is less often wrong; that is all it buys.`,
          `The house reports only on what it will put its name to.`,
        ],
        metadata: {
          institutionId: edge.institutionId,
          patronId: edge.patronId,
          channels,
          covert: edge.covert,
        },
      }));
      continue;
    }

    if (act === 'brokerage_intercept') {
      const edge = edges[0];
      // A rival is any power eligible to keep this kind of house that is NOT keeping it.
      const rivals = eligiblePatrons(item, edge.covert ? 'illegal' : 'legal')
        .filter((candidate) => candidate.factionStateId !== edge.patronId);
      if (!rivals.length) continue;
      const rival = rivals[0];
      // IN-0b: the act stopped being narration. The rival now READS the outbound record —
      // the standing contract, what this town couriered out, what its market sold — through
      // the ONE claim constructor, fogged by the host's own HIDE posture.
      const taken = interceptOutboundRecord({ worldState, hostId: settlementId, edge });
      // A REFUSAL IS NOT AN EVENT, exactly as the query arm above: a watcher who made out
      // nothing is silent. Minting a beat for every failed read would fill the chronicle
      // with non-events and let the knowledge lane certify itself off failures.
      if (taken.refused) continue;
      out.push(brokerageCandidate({
        act,
        settlementId,
        tick,
        headline: `${rival.name} reads what was not sent to it`,
        summary: `The contract between a house of ${nameFor(settlementId)} and its patron is a visible thing, and a visible thing can be watched. ${rival.name} has been reading over the patron's shoulder.`,
        reasons: [
          `A standing feed is an edge between two named parties, which makes it a target.`,
          INTERCEPT_BAND_REASONS[taken.band],
        ],
        metadata: {
          institutionId: edge.institutionId,
          patronId: edge.patronId,
          rivalId: rival.factionStateId,
          covert: edge.covert,
          // What was actually made out, and how clearly. Claims carry their own `from`
          // and a resolvable `ref`, so a reader can walk every one of them back into the
          // record it came out of (the module's no-minted-facts law).
          vagueness: taken.band,
          claims: taken.claims,
          ending: taken.ending,
        },
      }));
      continue;
    }

    // brokerage_plant (I4). The market's own patron commissions a story about the subject,
    // placed in a court that already holds a belief about it (the LIE verb's channel rule).
    const patron = bindings.find((binding) => binding.institutionId === market?.institutionId);
    if (!patron) continue;
    /** @type {string|null} */
    let audienceId = null;
    /** @type {Record<string, unknown>|null} */
    let audienceBelief = null;
    for (const other of [...settlements].map((row) => text(asObject(row).id)).sort(compareCodepoint)) {
      if (other === settlementId || other === subjectId) continue;
      const belief = asObject(seatBeliefs(worldState, other)[text(subjectId)]);
      if (!Object.keys(belief).length) continue;
      audienceId = other;
      audienceBelief = belief;
      break;
    }
    if (!audienceId) continue;
    const commission = commissionPlant({
      worldState,
      item,
      patronId: patron.patronId,
      audienceId,
      subjectId: text(subjectId),
      subjectTrueBand: Math.round(Number(asObject(seat[text(subjectId)]).strengthBand) || 2),
      audienceBelief,
      intent: (fnv1a32(`${settlementId}:${audienceId}`) + tick) % 2 === 0 ? 'inflate' : 'deflate',
      tick,
    });
    if (commission.refused || !commission.plant || !commission.charge) continue;
    out.push(brokerageCandidate({
      act,
      settlementId,
      tick,
      headline: `A story is bought in ${nameFor(settlementId)}`,
      summary: `Somebody paid the market to put a telling about ${nameFor(text(subjectId))} into the court of ${nameFor(audienceId)}. It is not true. Nobody there knows that yet.`,
      reasons: [
        `The market sells placement, not truth, and its own name is the collateral.`,
        `A bought story travels exactly as far as the house's credit carries it.`,
      ],
      metadata: {
        subjectId: text(subjectId),
        audienceId,
        // DM TRUTH (design §6, the audience law): the commission receipt and the plant
        // itself are carried for the DM's eyes and for the wiring described in
        // brokerageServicesPlant.PLANT_WIRING; the player-facing projection drops them
        // until the lie is exposed.
        plant: commission.plant,
      },
      factionId: commission.charge.patronId,
      factionPatch: commission.charge.factionPatch,
    }));
  }
  return out;
}
