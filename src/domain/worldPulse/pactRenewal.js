/**
 * pactRenewal.js — GR-5b and GR-5c. THE RENEWAL WINDOW, AND RENEGOTIATION FROM STRENGTH
 * (GR-5A's flag, read ONLY through its one by-name gate `pactAmendment.js ::
 * treatyRenewalActive`; this file never spells the key).
 *
 * A peace runs out. Until this leaf the only thing that could happen at the end of a treaty
 * was the end: every clause lapsed on its own day and the record pruned in silence. In the
 * last weeks of an instrument's LONGEST live clause either court may now ask to renew it, the
 * other court answers by the same threshold every pact answer uses, and the two outcomes are
 * the whole of GR-5b:
 *
 *   ACCEPTED ⇒ a `renewed` LINEAGE ACT on the LIVING record, never a re-mint at the pair key.
 *     The superseded clauses close, the same clauses are re-issued at their own spans from the
 *     signing, and the instrument keeps its key, its provenance, its compliance memory
 *     (`worstObservedEver`) and every earlier act. The new holders swear: a renewed peace is a
 *     new oath (GR-1 re-stamps at the act).
 *   REFUSED ⇒ A CLEAN LAPSE, and that is GR-5's hardest pin. No trust moves, no turning point
 *     is written, no strain and no grievance is invented: the question closes and the
 *     instrument runs out on its own day exactly as it would have without the asking. Renewal
 *     is never forced (law L).
 *
 * ── GR-5c: RENEGOTIATION FROM STRENGTH (Meiji: rebuilt first, then re-tabled) ─────
 * Mid-term, a court whose BELIEVED lead over its counterpart has swung past the band since
 * the signing may DEMAND new terms: a `renegotiation` row through the ledger's one writer,
 * the answer the same threshold, and two outcomes of its own:
 *
 *   ACCEPTED ⇒ a `renegotiated` lineage act through the same one amendment writer: the
 *     clauses the demander OWES close and return lighter, on their own remaining term (a
 *     renegotiation reopens the weight, never the calendar; the window's renewal is the act
 *     that extends), and the new holders swear exactly as at a renewal.
 *   REFUSED ⇒ the treaty stands, and the demander carries a STRAIN FACT through the existing
 *     strain idiom (`peaceTermsOverlay.js :: accrueStrainResentment`, the tribute strain
 *     revanchism already reads): a grievance seed, never a casus. The war road stays the war
 *     road.
 *
 * THE SWING IS A BELIEF ON THE COUNTERPART'S SIDE AND KNOWLEDGE ON ITS OWN. The counterpart's
 * strength is read ONLY from the demander's own picture (`beliefMap.js :: beliefRecord`, its
 * banded strength at the band's own midpoint): no picture, no demand, and never truth or the
 * neutral guess, the pact grammar's own belief law (`pactFormation.js`'s composer reads a
 * neighbour through the record alone). The court's own strength is its ground truth, which is
 * knowledge and not belief: at the tick the stage injects its pressure-aware reader, and off the
 * tick (the DM's verb and the editor's seal) it is the one derivation with no pressure index,
 * the `opportunism.js` idiom. The baseline is the lead the war door RECORDED
 * (`believedMarginAtSignature`, read from the demander's side), so an instrument that recorded
 * none (a peace between equals) offers no swing and is renewed, never renegotiated.
 *
 * THE ASK IS CAPPED. A demand asks back the swing itself as a fraction of each owed clause's
 * weight: never more than the believed ratio moved, and never more than the cap (a demand past
 * the cap drafts AT the cap). ONE RENEGOTIATION PER INSTRUMENT: the record carries the signing's
 * lead and no other, so a second demand would spend the same swing twice, the ratchet the cap
 * exists to stop.
 *
 * THE COURT'S OWN DEMAND IS COLOURED BY ITS POSTURE, and raised on its instrument's year-turn.
 * `strategicPosture.js :: courtPostureOf` composes the court's standing and its learned risk
 * appetite into one bounded factor, which scales the band: a timid rebuilt court sits on its
 * strength, which is legal. The year-turn (the signing's anniversary on the treaty's own clock)
 * is when a court reckons its accounts, so a refused demand is raised again a year later rather
 * than at every answer. The DM's verb is the table's hand and waits for neither.
 *
 * ── ONE HOME FOR THE FAMILY'S LOGIC (the chair's ruling FP-15) ─────────────────────
 * The window, the demand, the sheets, the supersession, the acts, the re-stamp, the clean lapse
 * and the strain all live HERE. The landed modules carry fold calls and nothing else: the tick's
 * answer step (`pactFormation.js :: advancePeacetimePacts`) hands a renewal or renegotiation row
 * to `settleRenewalProposal` and writes the ledger it is handed back, the same step asks
 * `openRenegotiationDemands` for the court's own demands, and the DM's verb (`realmVerbExecution.js`,
 * PROPOSE_PACT) drafts both words through `renewalClauseSheet`.
 *
 * ⚠ THIS LEAF WRITES NO TREATY LEDGER, AND THAT IS DELIBERATE. The oath-stamp totality
 * walker makes every module that writes `treaties` either a registered signing door or a
 * declared rewriter, and `pactAmendment.js` is declared a rewriter that must never stamp.
 * A renewal DOES stamp. So the renewed record is composed here, and it is written by the
 * answer step in `pactFormation.js`, which is already the registered door that stamps what
 * it writes. No registry row moves, and no stamp is laundered through a rewriter.
 *
 * ── THE STACKING BYPASS IS THE SUPERSESSION, AND ONLY THIS FAMILY GETS IT ─────────
 * §13 stacking refuses a second clause in an occupied family-by-beneficiary cell, which is
 * exactly why a renewal cannot ride the ordinary signing (measured at the base: both
 * re-offered clauses refused, the lineage untouched). A renewal first CLOSES the live
 * clauses its sheet re-offers, and only then runs the one amendment writer, so the stacking
 * law itself is never weakened: a non-renewal sheet that re-offers standing clauses still
 * collides and is still refused, because it never reaches this leaf.
 *
 * ── THE WINDOW IS A DRAFT BAND, MEASURED ──────────────────────────────────────────
 * `RENEWAL_WINDOW_TUNING.WINDOW_WEEKS` (DRAFT; tests/lint/.tuning-register.json). Its floor
 * is the far court's answer: two legs of the real road plus the deliberation, measured at
 * the build over real digests of four realm sizes (the longest answer 8, 12, 18 and 22 weeks
 * at nine, twenty, forty and eighty seats), so a renewal asked for on the window's first day
 * is answered while the instrument still lives. Its ceiling is the shortest clause the
 * drafters mint (one year: the war door's shortest affordable span, measured over sixty
 * mints), so no clause is renewable on the day it is signed. A band that is absent or not a
 * number compares false, so the window is closed rather than open by absence (U105).
 *
 * ── THE CAST READS THE ONE PARTICIPATION CHOKEPOINT (R-20) ────────────────────────
 * The re-stamp picks through `roads/state.js :: isOffStage`, paired with the consumers' own
 * `dead` test, so a holder who is exiled, jailed, removed, shelved, held hostage or dead
 * does not swear the new oath. The landed stamp doors are NOT retrofitted (R-20).
 *
 * ── WHAT THIS FAMILY DOES NOT DO, NAMED ───────────────────────────────────────────
 * No organic renewal opener and no re-draft of a renewal at the believed ratio (a renewal is
 * AS IS). No renegotiation evaluator of the answering court's own ratio (the answer is the one
 * threshold every pact answer uses). No conversion (GR-5d). No news kind (GR-5e is the voice;
 * the verb's two registered pools already speak the order). No provenance write (`provenance`
 * records how an instrument BEGAN; the lineage says what happened since). No new top-level
 * key and no new ledger.
 *
 * THE EDITOR (L10): `RENEWAL_WORLD_CONDITIONS.renewalWindowOpen` and
 * `RENEGOTIATION_WORLD_CONDITIONS.renegotiationOpen` are DEFINED here in `worldConditions.js`'s
 * live-row shape and composed by the chair; their seals' consumers are the slots "GR-5b-c" and
 * "GR-5c-c: the consumer lands at U123". The act is PROPOSE_PACT with the family's two words on
 * its clause dial (a realm verb, applied by the realm lane at the tick). Real-only: phantoms
 * never enter a campaign's courts.
 *
 * PURE: no rng, no clock, no store. It reads the ledgers and the rows it is handed, and every
 * write goes back to its caller.
 *
 * @enforced-by tests/domain/pactRenewalGr5b.test.js, tests/domain/pactRenegotiationGr5c.test.js
 */
import { clamp01 } from '../../kernel/math.js';
import { NPC_UNAVAILABLE_STATUSES } from '../entities/npcs.js';
import { OFF_STAGE_STATUSES, isOffStage } from '../roads/state.js';
import { beliefRecord, strengthOfBand } from './beliefMap.js';
import { oathHolderActive, stampSworn } from './oathHolder.js';
import {
  PACT_LINEAGE_ACTS, amendPactInstrument, lineageOf, stackingCellOf, termIdOf, treatyRenewalActive,
} from './pactAmendment.js';
import { openPactProposal, pactCounterpartiesFor, settlePactProposal } from './pactProposals.js';
import { PACT_TRIGGERS } from './pactTriggers.js';
import { accrueStrainResentment } from './peaceTermsOverlay.js';
import { round4, treatyPairKey } from './peaceTermsPrimitives.js';
import { settlementStrength } from './relationshipEvolution.js';
import { courtPostureOf } from './strategicPosture.js';
import { treatyTicksPerYearOf } from './treatyClock.js';
import { treatyLedgerOf } from './treatyEnforcement.js';
import { termObligationOf, treatyOrientationOf } from './treatyOrientation.js';

/**
 * ⚠ DRAFT — the owner signs it at the tuning sitting (tests/lint/.tuning-register.json).
 * The measurement that places it lives in the module header and in GR-5b's commit body.
 */
export const RENEWAL_WINDOW_TUNING = Object.freeze({
  /** The last weeks of an instrument's longest live clause in which either court may ask
   *  to renew it, on the fifty-two-week clock. */
  WINDOW_WEEKS: 26,
});

/**
 * ⚠ DRAFT — GR-5c's two bands, signed by the owner at the tuning sitting
 * (tests/lint/.tuning-register.json). The measurement that places each lives in GR-5c's commit
 * body and its acceptance arm.
 */
export const RENEGOTIATION_TUNING = Object.freeze({
  /** How far the demander's believed lead over its counterpart must have moved since the
   *  signing, on the belief map's strength scale, before it may demand. Above the swing two
   *  fresh pictures read on the signing day (the band quantizer's own error) and within the
   *  swing a court's recovery from a war's pressure produces. */
  DEMAND_SWING: 0.25,
  /** The most of an owed clause's weight one demand may ask back, as a fraction of its
   *  magnitude. At or above the ask a typical recovery makes, and below the relief the war
   *  door's own drafter grants a crushing victory at believed parity. */
  ASK_CAP: 0.5,
});

/**
 * THE TRIGGER WORD, read OUT of the closed trigger vocabulary rather than typed here, so an
 * upstream rename empties it and every renewal road refuses instead of pointing at nothing.
 */
export const RENEWAL_TRIGGER = PACT_TRIGGERS.filter((trigger) => trigger === 'renewal')[0] || '';

/** GR-5c's word, read out of the same vocabulary for the same reason. */
export const RENEGOTIATION_TRIGGER = PACT_TRIGGERS.filter((trigger) => trigger === 'renegotiation')[0] || '';

/** THE ACT, read out of the closed lineage vocabulary for the same reason. */
const RENEWAL_ACT = PACT_LINEAGE_ACTS.filter((act) => act === 'renewed')[0] || '';

/** GR-5c's act, read out of the same vocabulary. */
const RENEGOTIATION_ACT = PACT_LINEAGE_ACTS.filter((act) => act === 'renegotiated')[0] || '';

/**
 * THE UNAVAILABLE STATUSES THE CHOKEPOINT LEAVES TO EACH CONSUMER (today, `dead`), DERIVED
 * from the availability vocabulary minus what `isOffStage` already reads, never spelled here:
 * the houseLedger.js idiom (TR-2), so the two casts can never disagree about who is gone.
 * @type {readonly string[]}
 */
const CONSUMER_PAIRED_STATUSES = Object.freeze(NPC_UNAVAILABLE_STATUSES
  .filter((status) => !(/** @type {readonly string[]} */ (OFF_STAGE_STATUSES)).includes(status)));

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value) : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {unknown} value @returns {Array<Record<string, unknown>>} */
function listOfRecords(value) {
  return Array.isArray(value) ? value.map(recordOf) : [];
}

/** @param {unknown} value @returns {number} a whole tick, or 0 */
function wholeTick(value) {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : 0;
}

/** @param {unknown} value @returns {number|null} a finite number, or null */
function finite(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * The clauses still binding at `tick`. A clause at or past its `expiresTick` is spent history
 * and binds nothing, which is the PASS 2 expiry law read the same way.
 * @param {unknown} treaty @param {number} tick @returns {Array<Record<string, unknown>>}
 */
function liveTermsOf(treaty, tick) {
  return listOfRecords(recordOf(treaty).terms).filter((term) => Number(term.expiresTick) > tick);
}

/**
 * THE WEEKS LEFT on an instrument: its LONGEST live clause's end, less the tick. Null when
 * nothing binds any longer, because a spent instrument has no window to open.
 * @param {unknown} treaty @param {number} tick @returns {number|null}
 */
export function renewalWeeksLeftOf(treaty, tick) {
  const ends = liveTermsOf(treaty, tick).map((term) => Number(term.expiresTick));
  return ends.length > 0 ? Math.max(...ends) - tick : null;
}

/**
 * IS THE WINDOW OPEN? True exactly when the longest live clause ends within the band. A band
 * that is absent or not a number makes the comparison false, so the window is closed by
 * absence and never standing open (U105).
 * @param {unknown} treaty @param {number} tick @returns {boolean}
 */
export function renewalWindowOpenFor(treaty, tick) {
  const left = renewalWeeksLeftOf(treaty, tick);
  return left !== null && left <= RENEWAL_WINDOW_TUNING.WINDOW_WEEKS;
}

/**
 * The standing instrument between two courts, under either spelling of the directed pair
 * key, or null. The same both-directions read the formation door takes.
 * @param {unknown} worldState @param {string} a @param {string} b
 * @returns {{key: string, treaty: Record<string, unknown>}|null}
 */
function instrumentBetween(worldState, a, b) {
  const ledger = recordOf(treatyLedgerOf(/** @type {Parameters<typeof treatyLedgerOf>[0]} */ (worldState)));
  const key = ledger[treatyPairKey(a, b)] ? treatyPairKey(a, b)
    : ledger[treatyPairKey(b, a)] ? treatyPairKey(b, a) : '';
  return key ? { key, treaty: recordOf(ledger[key]) } : null;
}

/**
 * THE COURTS `subject` MAY ASK TO RENEW, codepoint-ordered. The pact verb's own four
 * conjuncts first (`pactCounterpartiesFor`: the layer lit, a campaign court, an offer's
 * headroom, no question standing between the pair), then the renewal's own: the layer lit
 * and the pair's instrument inside its window. The empty list whenever any conjunct fails,
 * so a caller's `length > 0` IS the predicate and a seal never opens on a fact its act would
 * refuse (J-EM-3, R-38).
 * @param {unknown} worldState @param {unknown} courtIds @param {unknown} subject @param {number} tick
 * @returns {string[]}
 */
export function renewalCounterpartiesFor(worldState, courtIds, subject, tick) {
  if (!treatyRenewalActive(worldState)) return [];
  const self = text(subject);
  return pactCounterpartiesFor(worldState, courtIds, self)
    .filter((other) => renewalWindowOpenFor(recordOf(instrumentBetween(worldState, self, other)).treaty, tick));
}

/** The courts THIS card's settlement may ask to renew, at the world's own tick.
 *  @param {unknown} record @param {unknown} campaignState @returns {readonly string[]} */
function renewableCounterparties(record, campaignState) {
  const campaign = recordOf(campaignState);
  const world = recordOf(campaign.worldState);
  return renewalCounterpartiesFor(world, campaign.settlementIds, recordOf(record).id, wholeTick(world.tick));
}

/**
 * THE PREDICATE, IN `worldConditions.js`'s LIVE-ROW SHAPE AND NOT SPLICED THERE (the chair
 * composes `WORLD_CONDITIONS` at the merge, as GR-2b's two rows are). Its subjects are the
 * counterparties whose instrument with this court stands inside its window; a dark layer, a
 * spent or distant instrument, or a question already standing answers the empty list.
 * @type {Readonly<Record<string, import('../edit/worldConditions.js').WorldConditionRow>>}
 */
export const RENEWAL_WORLD_CONDITIONS = Object.freeze({
  renewalWindowOpen: Object.freeze({
    predicate: (/** @type {unknown} */ record, /** @type {unknown} */ campaignState) =>
      renewableCounterparties(record, campaignState).length > 0,
    subjects: renewableCounterparties,
    readers: Object.freeze([Object.freeze({
      id: 'treaty-ledger', module: 'src/domain/worldPulse/pactRenewal.js', symbol: 'renewalCounterpartiesFor', gate: null,
    })]),
    source: 'live',
  }),
});

/**
 * ONE CLAUSE, RE-ISSUED AT `tick`. The span is the clause's own and is preserved exactly;
 * only its origin moves, and its compliance and delivery counts start fresh, because a
 * renewed clause is a new promise. A clause with no measurable span cannot be re-issued.
 * @param {Record<string, unknown>} term @param {number} tick @returns {Record<string, unknown>|null}
 */
function reissuedAt(term, tick) {
  const span = Number(term.expiresTick) - Number(term.mintedTick);
  if (!(span > 0)) return null;
  /** @type {Record<string, unknown>} */
  const next = {
    ...term, mintedTick: tick, expiresTick: tick + span, complianceState: 'honored', trueState: 'honored', burden01: 0,
  };
  if (Object.hasOwn(term, 'deliveredToVictor')) next.deliveredToVictor = 0;
  if (Object.hasOwn(term, 'extractedFromLoser')) next.extractedFromLoser = 0;
  return next;
}

/** @param {Array<Record<string, unknown>|null>} rows @returns {Array<Record<string, unknown>>} */
function present(rows) {
  return /** @type {Array<Record<string, unknown>>} */ (rows.filter((row) => row !== null));
}

/**
 * THE RENEWAL SHEET: the instrument's live clauses, re-issued at `tick`. Renewal AS IS: the
 * same clauses on the same spans. A court that has rebuilt asks for lighter terms mid-term,
 * through the renegotiation below, never through the window.
 * @param {unknown} treaty @param {number} tick @returns {Array<Record<string, unknown>>}
 */
export function draftRenewalSheet(treaty, tick) {
  return present(liveTermsOf(treaty, tick).map((term) => reissuedAt(term, tick)));
}

/**
 * THE DEMANDER'S STANDING AT THE SIGNING: the lead the war door recorded
 * (`believedMarginAtSignature`, the victor's over the loser) read from the demander's side,
 * through the ONE orientation reader (CR-WR10-G): the victor's own lead, or the loser's
 * deficit. Null for an instrument that recorded no margin (every peace between equals) and for
 * a court that is neither war party, because a swing needs a signing to swing from.
 * @param {unknown} treaty @param {string} demanderId @returns {number|null}
 */
function signatureLeadOf(treaty, demanderId) {
  const margin = finite(recordOf(treaty).believedMarginAtSignature);
  const orientation = treatyOrientationOf(recordOf(treaty));
  if (margin === null || orientation.kind !== 'wartime' || !demanderId) return null;
  if (demanderId === orientation.receiverId) return margin;
  return demanderId === orientation.giverId ? -margin : null;
}

/**
 * THE SWING: the demander's believed lead over its counterpart now, less its lead at the
 * signing. The counterpart's strength is the demander's OWN picture and nothing else
 * (`beliefRecord`, at the band's own midpoint), so a court that holds no picture cannot swing;
 * its own strength is the caller's knowledge of itself. The lead is the war door's own
 * arithmetic (`peaceTermsAppraisal.js :: believedAdvantageFromInputs`: believed self less
 * believed foe). Null whenever any of the three reads is missing.
 * @param {{worldState: unknown, treaty: unknown, demanderId: string, counterpartId: string,
 *   selfStrength01: unknown}} input
 * @returns {number|null}
 */
export function renegotiationSwingOf({ worldState, treaty, demanderId, counterpartId, selfStrength01 }) {
  const signed = signatureLeadOf(treaty, text(demanderId));
  const band = finite(recordOf(beliefRecord(
    /** @type {Parameters<typeof beliefRecord>[0]} */ (worldState), text(demanderId), text(counterpartId),
  )).strengthBand);
  const own = finite(selfStrength01);
  if (signed === null || band === null || own === null) return null;
  return own - strengthOfBand(band) - signed;
}

/**
 * THE ASK: the swing itself as a fraction of the owed weight, never more than the believed
 * ratio moved and never more than the cap.
 * @param {number} swing @returns {number}
 */
function askOf(swing) {
  return Math.min(RENEGOTIATION_TUNING.ASK_CAP, swing);
}

/**
 * ONE OWED CLAUSE, LIGHTENED BY THE ASK AT `tick`. The weight moves and the calendar does not:
 * the clause keeps its own end (the window's renewal is the act that extends), its origin is
 * the asking, and its compliance and delivery counts start fresh. A clause with no weight or
 * no term left cannot be lightened.
 * @param {Record<string, unknown>} term @param {number} ask01 @param {number} tick
 * @returns {Record<string, unknown>|null}
 */
function relievedAt(term, ask01, tick) {
  const weight = finite(term.magnitude);
  if (weight === null || !(weight > 0) || !(Number(term.expiresTick) > tick)) return null;
  /** @type {Record<string, unknown>} */
  const next = {
    ...term, magnitude: round4(weight * (1 - ask01)), mintedTick: tick,
    complianceState: 'honored', trueState: 'honored', burden01: 0,
  };
  if (Object.hasOwn(term, 'deliveredToVictor')) next.deliveredToVictor = 0;
  if (Object.hasOwn(term, 'extractedFromLoser')) next.extractedFromLoser = 0;
  return next;
}

/**
 * ONE DRAFTED CLAUSE, SIGNED AT `tick`: the renegotiated weight as the sheet carries it, its
 * origin moved to the signing and its own end kept. Spent before the signing, it signs nothing.
 * @param {Record<string, unknown>} term @param {number} tick @returns {Record<string, unknown>|null}
 */
function signedAt(term, tick) {
  return Number(term.expiresTick) > tick ? { ...term, mintedTick: tick } : null;
}

/**
 * THE DEMAND, or null. The layer lit; a standing instrument the war door signed with a lead on
 * record; never renegotiated before (one renegotiation per instrument, the ratchet guard); a
 * live clause the demander OWES (`treatyOrientation.js :: termObligationOf`, the one
 * per-clause obligation read); and the swing at or past `bar`. A bar that is absent or not a
 * number compares false, so no demand stands open by absence (U105).
 * @param {{worldState: unknown, standing: {key: string, treaty: Record<string, unknown>}|null,
 *   demanderId: string, counterpartId: string, selfStrength01: unknown, tick: number, bar: number}} input
 * @returns {{swing: number, ask01: number, terms: Array<Record<string, unknown>>}|null}
 */
function renegotiationDemandOf({ worldState, standing, demanderId, counterpartId, selfStrength01, tick, bar }) {
  if (!treatyRenewalActive(worldState) || standing === null) return null;
  const treaty = standing.treaty;
  if (lineageOf(treaty).some((entry) => entry.act === RENEGOTIATION_ACT)) return null;
  const owed = liveTermsOf(treaty, tick)
    .filter((term) => termObligationOf(treaty, term).obligorId === demanderId);
  const swing = renegotiationSwingOf({ worldState, treaty, demanderId, counterpartId, selfStrength01 });
  if (owed.length === 0 || swing === null || !(swing >= bar)) return null;
  const ask01 = askOf(swing);
  const terms = present(owed.map((term) => relievedAt(term, ask01, tick)));
  return terms.length > 0 ? { swing, ask01, terms } : null;
}

/**
 * THE COURTS `subject` MAY DEMAND NEW TERMS OF, codepoint-ordered: the pact verb's own four
 * conjuncts, then the demand itself against the band (never the posture: the band is the fact
 * the seal names, and the posture colours only the court's own initiative). `selfStrength01`
 * is the subject's knowledge of itself. The empty list whenever any conjunct fails, so a
 * caller's `length > 0` IS the predicate (J-EM-3, R-38).
 * @param {unknown} worldState @param {unknown} courtIds @param {unknown} subject @param {number} tick
 * @param {unknown} selfStrength01
 * @returns {string[]}
 */
export function renegotiationCounterpartiesFor(worldState, courtIds, subject, tick, selfStrength01) {
  if (!treatyRenewalActive(worldState)) return [];
  const self = text(subject);
  return pactCounterpartiesFor(worldState, courtIds, self).filter((other) => renegotiationDemandOf({
    worldState, standing: instrumentBetween(worldState, self, other), demanderId: self, counterpartId: other,
    selfStrength01, tick, bar: RENEGOTIATION_TUNING.DEMAND_SWING,
  }) !== null);
}

/**
 * A COURT'S KNOWLEDGE OF ITSELF OFF THE TICK: the estate's one strength derivation with no
 * pressure index, which it reads as "no pressure known" (the `opportunism.js` idiom). Null for
 * a court the caller could not find, so a missing record never reads as a strength.
 * @param {unknown} settlement @returns {number|null}
 */
function ownStrengthOf(settlement) {
  return settlement && typeof settlement === 'object' ? finite(settlementStrength({ settlement }, {})) : null;
}

/** The courts THIS card's settlement may demand new terms of, at the world's own tick.
 *  @param {unknown} record @param {unknown} campaignState @returns {readonly string[]} */
function demandableCounterparties(record, campaignState) {
  const campaign = recordOf(campaignState);
  const world = recordOf(campaign.worldState);
  return renegotiationCounterpartiesFor(world, campaign.settlementIds, recordOf(record).id, wholeTick(world.tick), ownStrengthOf(record));
}

/**
 * THE PREDICATE, IN `worldConditions.js`'s LIVE-ROW SHAPE AND NOT SPLICED THERE (composed by the
 * chair at the merge). TRUE exactly when the band exists AND this court's believed lead over a
 * counterpart has swung past it since the signing; its subjects are those counterparties. A
 * dark layer, a swing inside the band, a court with no picture of the other, an instrument
 * already renegotiated or a question already standing answers the empty list.
 * @type {Readonly<Record<string, import('../edit/worldConditions.js').WorldConditionRow>>}
 */
export const RENEGOTIATION_WORLD_CONDITIONS = Object.freeze({
  renegotiationOpen: Object.freeze({
    predicate: (/** @type {unknown} */ record, /** @type {unknown} */ campaignState) =>
      demandableCounterparties(record, campaignState).length > 0,
    subjects: demandableCounterparties,
    readers: Object.freeze([
      Object.freeze({
        id: 'treaty-ledger', module: 'src/domain/worldPulse/pactRenewal.js', symbol: 'renegotiationCounterpartiesFor', gate: null,
      }),
      Object.freeze({
        id: 'belief-map', module: 'src/domain/worldPulse/pactRenewal.js', symbol: 'renegotiationSwingOf', gate: null,
      }),
    ]),
    source: 'live',
  }),
});

/**
 * The settlement a snapshot carries for `id`, or null.
 * @param {unknown} snapshot @param {string} id @returns {Record<string, unknown>|null}
 */
function settlementIn(snapshot, id) {
  const item = listOfRecords(recordOf(snapshot).settlements).find((row) => text(row.id) === id);
  const settlement = item ? item.settlement : null;
  return settlement && typeof settlement === 'object' && !Array.isArray(settlement) ? recordOf(settlement) : null;
}

/**
 * THE VERB'S TWO FAMILY WORDS (GR-2b's PROPOSE_PACT, the clause dial). Null for any other
 * clause, so the verb's own drafter runs exactly as before. For the renewal word, the trigger
 * and the standing instrument's renewal sheet, or an EMPTY sheet when the layer is dark or the
 * pair holds no instrument inside its window. For the renegotiation word, the trigger and the
 * asking court's demand against the band (its own strength read off the snapshot the verb
 * carries), or an EMPTY sheet when there is no demand to make. The ledger's one writer refuses
 * an empty sheet as a sheet that drafts nothing.
 * @param {{worldState: unknown, termType: string, fromId: string, toId: string, tick: number,
 *   snapshot?: unknown}} input
 * @returns {{trigger: string, terms: Array<Record<string, unknown>>}|null}
 */
export function renewalClauseSheet({ worldState, termType, fromId, toId, tick, snapshot = null }) {
  if (RENEGOTIATION_TRIGGER && termType === RENEGOTIATION_TRIGGER) {
    const self = text(fromId);
    const other = text(toId);
    const demand = renegotiationDemandOf({
      worldState, standing: instrumentBetween(worldState, self, other), demanderId: self, counterpartId: other,
      selfStrength01: ownStrengthOf(settlementIn(snapshot, self)), tick: wholeTick(tick), bar: RENEGOTIATION_TUNING.DEMAND_SWING,
    });
    return { trigger: RENEGOTIATION_TRIGGER, terms: demand ? demand.terms : [] };
  }
  if (termType !== RENEWAL_TRIGGER) return null;
  const at = wholeTick(tick);
  const standing = treatyRenewalActive(worldState) ? instrumentBetween(worldState, text(fromId), text(toId)) : null;
  const open = standing !== null && renewalWindowOpenFor(standing.treaty, at);
  return { trigger: RENEWAL_TRIGGER, terms: standing !== null && open ? draftRenewalSheet(standing.treaty, at) : [] };
}

/**
 * THE CAST THROUGH THE ONE PARTICIPATION CHOKEPOINT (R-20): the settlement as the stamp's
 * pick should see it, its roster stripped of everyone off stage and everyone dead. In the
 * live pulse the answer step hands this the master gate's participation view, so the
 * `isOffStage` half filters the same people twice and never differently; the consumer-paired
 * half is the one the gate leaves to its consumers. The view is built per call and stored
 * nowhere (the roads §8 census carries this reader's disposition).
 * @param {(id: string) => unknown} settlementOf @returns {(id: string) => unknown}
 */
function onStageSettlementOf(settlementOf) {
  return (id) => {
    const settlement = recordOf(settlementOf(id));
    const roster = settlement.npcs;
    if (!Array.isArray(roster)) return settlement;
    return {
      ...settlement,
      npcs: roster.filter((npc) => !isOffStage(npc)
        && !CONSUMER_PAIRED_STATUSES.includes(String(recordOf(npc).status ?? '').toLowerCase())),
    };
  };
}

/**
 * SUPERSEDE AND RECORD: close the live clauses the sheet re-offers, issue the sheet at the
 * signing (`reissue`), and record `act` through the ONE amendment writer. The implied single act
 * of a record that carries no lineage is materialized from the record AS IT STOOD, before any
 * clause is closed, so the history of a legacy instrument lists the clauses it was really made
 * with. A sheet that writes nothing leaves the record exactly as it was.
 *
 * THE NEW OATH: while the oath layer is lit the prior signature is cleared and the pair
 * re-stamped at the signing through the on-stage cast, so a court whose seat nobody can speak
 * for swears in the seat's voice, exactly as at a mint. Dark, the record's signature is left as
 * it stands (GR-1's own dormancy).
 *
 * @param {{treaty: Record<string, unknown>, terms: ReadonlyArray<unknown>, tick: number,
 *   worldState: unknown, ids: ReadonlyArray<string>, settlementOf: (id: string) => unknown,
 *   act: string, reissue: (term: Record<string, unknown>, tick: number) => Record<string, unknown>|null}} input
 * @returns {{treaty: Record<string, unknown>, added: Array<Record<string, unknown>>,
 *   refused: Array<{cell: string, type: string, receipt: string}>,
 *   superseded: Array<Record<string, unknown>>}}
 */
function supersedeWith({ treaty, terms, tick, worldState, ids, settlementOf, act, reissue }) {
  const at = wholeTick(tick);
  const sheet = present(listOfRecords(terms).map((term) => reissue(term, at)));
  const cells = new Set(sheet.map(stackingCellOf));
  const standing = listOfRecords(recordOf(treaty).terms);
  const superseded = standing.filter((term) => Number(term.expiresTick) > at && cells.has(stackingCellOf(term)));
  const base = { ...treaty, lineage: lineageOf(treaty), terms: standing.filter((term) => !superseded.includes(term)) };
  const amended = amendPactInstrument({ treaty: base, terms: sheet, tick: at, act });
  if (amended.added.length === 0) return { treaty, added: [], refused: amended.refused, superseded: [] };
  /** @type {Record<string, unknown>} */
  const next = { ...amended.treaty };
  if (oathHolderActive(worldState)) {
    delete next.sworn;
    stampSworn(next, { worldState, tick: at, ids, settlementOf: onStageSettlementOf(settlementOf) });
  }
  return { treaty: next, added: amended.added, refused: amended.refused, superseded };
}

/**
 * RENEW A STANDING INSTRUMENT: close the live clauses the sheet re-offers, re-issue the sheet
 * from the signing on the clauses' own spans, and record the `renewed` act through the ONE
 * amendment writer, re-stamping the pair (see `supersedeWith`).
 *
 * @param {{treaty: Record<string, unknown>, terms: ReadonlyArray<unknown>, tick: number,
 *   worldState: unknown, ids: ReadonlyArray<string>, settlementOf?: (id: string) => unknown}} input
 * @returns {{treaty: Record<string, unknown>, added: Array<Record<string, unknown>>,
 *   refused: Array<{cell: string, type: string, receipt: string}>,
 *   superseded: Array<Record<string, unknown>>}}
 */
export function renewPactInstrument({ treaty, terms, tick, worldState, ids, settlementOf = () => null }) {
  return supersedeWith({ treaty, terms, tick, worldState, ids, settlementOf, act: RENEWAL_ACT, reissue: reissuedAt });
}

/** The graph edges a snapshot carries. @param {unknown} snapshot @returns {Array<Record<string, unknown>>} */
function edgesOf(snapshot) {
  return listOfRecords(recordOf(recordOf(snapshot).regionalGraph).edges);
}

/**
 * THE WEIGHT A DEMAND ASKED BACK, read off its own sheet against the standing clause in the same
 * stacking cell: the relief it carried, or zero when nothing on the sheet can be matched.
 * @param {unknown} treaty @param {ReadonlyArray<Record<string, unknown>>} sheet @param {number} tick
 * @returns {number}
 */
function askedOf(treaty, sheet, tick) {
  for (const drafted of sheet) {
    const held = liveTermsOf(treaty, tick).find((term) => stackingCellOf(term) === stackingCellOf(drafted));
    const was = finite(recordOf(held).magnitude);
    const asked = finite(drafted.magnitude);
    if (was !== null && was > 0 && asked !== null) return clamp01(1 - asked / was);
  }
  return 0;
}

/**
 * GR-5c's ANSWER, SETTLED. `signed` over an instrument that still binds renegotiates it and hands
 * back the treaties ledger; a `signed` answer that finds nothing left to lighten closes the
 * question `expired`. Any other verdict over a binding instrument is a REFUSAL: the treaty
 * stands untouched and the demander carries ONE strain fact through the existing idiom, on the
 * real graph edge between the pair (no edge, no fact, never a synthesized key), weighted by the
 * relief it asked for. An instrument that ran out before the answer closes the question
 * `expired` and strains nobody.
 * @param {{worldState: Record<string, unknown>, row: Record<string, unknown>,
 *   answer: {verdict: string, receipt: string, offer01: number, reserve01: number},
 *   tick: number, settlementOf: (id: string) => unknown, snapshot: unknown}} input
 * @returns {{worldState: Record<string, unknown>, ledger: Record<string, unknown>|null,
 *   receipt: Record<string, unknown>}}
 */
function settleRenegotiation({ worldState, row, answer, tick, settlementOf, snapshot }) {
  const at = wholeTick(tick);
  const id = text(row.id);
  const fromId = text(row.from);
  const toId = text(row.to);
  const standing = instrumentBetween(worldState, fromId, toId);
  const binding = standing !== null && liveTermsOf(standing.treaty, at).length > 0;
  const sheet = listOfRecords(recordOf(row.sheet).terms);
  const heard = {
    tick: at, id, fromId, toId, offer01: answer.offer01, reserve01: answer.reserve01,
  };
  if (answer.verdict === 'signed' && standing !== null && binding) {
    const renegotiation = supersedeWith({
      treaty: standing.treaty, terms: sheet, tick: at, worldState, ids: [fromId, toId], settlementOf,
      act: RENEGOTIATION_ACT, reissue: signedAt,
    });
    if (renegotiation.added.length > 0) {
      return {
        worldState: settlePactProposal({ worldState, id, state: 'signed' }).worldState,
        ledger: { ...recordOf(treatyLedgerOf(/** @type {Parameters<typeof treatyLedgerOf>[0]} */ (worldState))), [standing.key]: renegotiation.treaty },
        receipt: {
          kind: 'pact_renegotiated', ending: 'signed', ...heard,
          renegotiated: renegotiation.added.map(termIdOf).sort(), superseded: renegotiation.superseded.map(termIdOf).sort(),
          receipt: `${answer.receipt} ${toId} has given ground to ${fromId}: the terms were reopened mid-term and cut toward the present balance.`,
        },
      };
    }
  }
  const refused = binding && answer.verdict !== 'signed';
  const strained = refused && standing !== null
    ? accrueStrainResentment(worldState, edgesOf(snapshot), fromId, toId, askedOf(standing.treaty, sheet, at), null, standing.treaty)
    : worldState;
  return {
    worldState: settlePactProposal({ worldState: strained, id, state: refused ? 'refused' : 'expired' }).worldState,
    ledger: null,
    receipt: {
      kind: refused ? 'pact_renegotiation_refused' : 'pact_renegotiation_lapsed',
      ending: !refused ? 'expired_unanswered' : answer.verdict === 'no_overlap' ? 'no_overlap' : 'refused',
      ...heard,
      receipt: refused
        ? `${answer.receipt} ${toId} has told ${fromId} the old terms stand. Nothing is broken by the asking, and ${fromId} will remember it.`
        : `There was nothing left between ${fromId} and ${toId} for new terms to reopen.`,
    },
  };
}

/**
 * THE FAMILY'S ANSWER, SETTLED — the one fold `advancePeacetimePacts` makes into this leaf.
 *
 * Null for everything that is not a renewal or renegotiation row in a lit world, so the answer
 * step's own roads run exactly as they did. For a renewal: the court's verdict is the threshold
 * every pact answer uses (`answerPactProposal`, handed in); `signed` over an instrument that
 * still binds renews it and hands back the treaties ledger for the answer step to write;
 * anything else closes the question and hands back NO ledger, and the row settles `refused`,
 * or `expired` when the instrument ran out before the answer came. A renegotiation settles in
 * `settleRenegotiation` above.
 *
 * THE CLEAN LAPSE, RESTATED BECAUSE IT IS THE PIN: nothing on the renewal's refusing path
 * touches the relationship record. No trust delta, no turning point, no strain, no grievance:
 * the only write is the proposal row's own settled state, and the queue prunes it.
 *
 * @param {{worldState: Record<string, unknown>, proposal: Record<string, unknown>,
 *   answer: {verdict: string, receipt: string, offer01: number, reserve01: number},
 *   tick: number, settlementOf?: (id: string) => unknown, snapshot?: unknown}} input
 * @returns {{worldState: Record<string, unknown>, ledger: Record<string, unknown>|null,
 *   receipt: Record<string, unknown>}|null}
 */
export function settleRenewalProposal({ worldState, proposal, answer, tick, settlementOf = () => null, snapshot = null }) {
  const row = recordOf(proposal);
  if (RENEGOTIATION_TRIGGER && text(row.trigger) === RENEGOTIATION_TRIGGER) {
    return treatyRenewalActive(worldState) ? settleRenegotiation({ worldState, row, answer, tick, settlementOf, snapshot }) : null;
  }
  if (text(row.trigger) !== RENEWAL_TRIGGER || !treatyRenewalActive(worldState)) return null;
  const at = wholeTick(tick);
  const id = text(row.id);
  const fromId = text(row.from);
  const toId = text(row.to);
  const standing = instrumentBetween(worldState, fromId, toId);
  const binding = standing !== null && liveTermsOf(standing.treaty, at).length > 0;
  const heard = {
    tick: at, id, fromId, toId, offer01: answer.offer01, reserve01: answer.reserve01,
  };
  if (answer.verdict === 'signed' && standing !== null && binding) {
    const renewal = renewPactInstrument({
      treaty: standing.treaty, terms: listOfRecords(recordOf(row.sheet).terms), tick: at, worldState,
      ids: [fromId, toId], settlementOf,
    });
    if (renewal.added.length > 0) {
      return {
        worldState: settlePactProposal({ worldState, id, state: 'signed' }).worldState,
        ledger: { ...recordOf(treatyLedgerOf(/** @type {Parameters<typeof treatyLedgerOf>[0]} */ (worldState))), [standing.key]: renewal.treaty },
        receipt: {
          kind: 'pact_renewed', ending: 'signed', ...heard,
          renewed: renewal.added.map(termIdOf).sort(), superseded: renewal.superseded.map(termIdOf).sort(),
          receipt: `${answer.receipt} ${fromId} and ${toId} have renewed the instrument that stood between them, and its clauses run again from this signing.`,
        },
      };
    }
  }
  return {
    worldState: settlePactProposal({ worldState, id, state: binding ? 'refused' : 'expired' }).worldState,
    ledger: null,
    receipt: {
      kind: 'pact_renewal_lapsed',
      ending: !binding ? 'expired_unanswered' : answer.verdict === 'no_overlap' ? 'no_overlap' : 'refused',
      ...heard,
      receipt: binding
        ? `${answer.receipt} The instrument between ${fromId} and ${toId} was not renewed. It runs out on its own day, and nothing is held against either court for the asking.`
        : `The instrument between ${fromId} and ${toId} ran out before the answer came, and there was nothing left to renew.`,
    },
  };
}

/**
 * IS `tick` THIS INSTRUMENT'S YEAR-TURN? The signing's anniversary on the treaty's OWN clock
 * (`treatyClock.js :: treatyTicksPerYearOf`, so a legacy record keeps its own year), never the
 * signing day itself.
 * @param {unknown} treaty @param {number} tick @returns {boolean}
 */
function onYearTurn(treaty, tick) {
  const since = tick - wholeTick(recordOf(treaty).mintedTick);
  return since > 0 && since % treatyTicksPerYearOf(recordOf(treaty)) === 0;
}

/**
 * THE COURT'S OWN DEMANDS — the second fold `advancePeacetimePacts` makes into this leaf, after
 * the crossings. On its instrument's year-turn, a court whose believed lead has swung past the
 * band COLOURED BY ITS POSTURE (`courtPostureOf`'s one bounded factor, which already weighs its
 * learned risk appetite) demands new terms through the ledger's one writer. `strengthFor` is
 * the stage's own knowledge of each court. Dark, it hands both references back and reads
 * nothing else.
 * @param {{worldState: Record<string, unknown>, ids: ReadonlyArray<string>,
 *   strengthFor: (id: string) => number, tick: number, digest?: unknown, season?: unknown}} input
 * @returns {{worldState: Record<string, unknown>, receipts: Array<Record<string, unknown>>}}
 */
export function openRenegotiationDemands({ worldState, ids, strengthFor, tick, digest = null, season = null }) {
  /** @type {Array<Record<string, unknown>>} */
  const receipts = [];
  if (!treatyRenewalActive(worldState)) return { worldState, receipts };
  const at = wholeTick(tick);
  let state = worldState;
  for (const demanderId of ids) {
    for (const counterpartId of pactCounterpartiesFor(state, ids, demanderId)) {
      const standing = instrumentBetween(state, demanderId, counterpartId);
      if (standing === null || !onYearTurn(standing.treaty, at)) continue;
      const posture = courtPostureOf({ kind: 'settlement', id: demanderId },
        recordOf(recordOf(state).dispositionStats)[demanderId] || null, { rules: recordOf(state).simulationRules });
      const demand = renegotiationDemandOf({
        worldState: state, standing, demanderId, counterpartId, selfStrength01: strengthFor(demanderId), tick: at,
        bar: RENEGOTIATION_TUNING.DEMAND_SWING * posture.factor,
      });
      if (demand === null) continue;
      const opened = openPactProposal({
        worldState: state, from: demanderId, to: counterpartId, trigger: RENEGOTIATION_TRIGGER,
        sheet: { terms: demand.terms }, tick: at, digest, season,
      });
      state = opened.worldState;
      receipts.push({
        kind: opened.proposal ? 'pact_renegotiation_demanded' : 'pact_not_proposed', tick: at, fromId: demanderId, toId: counterpartId,
        trigger: RENEGOTIATION_TRIGGER, refusal: opened.refusal, transport: opened.proposal ? opened.proposal.transport : '',
        swing: round4(demand.swing), ask01: round4(demand.ask01),
        receipt: `${posture.receipt} ${demanderId} believes the balance has moved since the signing, and asks ${counterpartId} for new terms. ${opened.receipt}`,
      });
    }
  }
  return { worldState: state, receipts };
}
