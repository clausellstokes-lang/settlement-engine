/**
 * pactRenewal.js — GR-5b. THE RENEWAL WINDOW (GR-5A's flag, read ONLY through its one by-name
 * gate `pactAmendment.js :: treatyRenewalActive`; this file never spells the key).
 *
 * A peace runs out. Until this leaf the only thing that could happen at the end of a treaty
 * was the end: every clause lapsed on its own day and the record pruned in silence. In the
 * last weeks of an instrument's LONGEST live clause either court may now ask to renew it, the
 * other court answers by the same threshold every pact answer uses, and the two outcomes are
 * the whole of this wave:
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
 * ── ONE HOME FOR THE RENEWAL'S LOGIC (the chair's ruling FP-15) ───────────────────
 * The window, the renewal sheet, the supersession, the act, the re-stamp and the clean lapse
 * all live HERE. The two landed modules this wave touches carry a FOLD CALL each and nothing
 * else: the tick's answer step (`pactFormation.js :: advancePeacetimePacts`) hands a renewal
 * row to `settleRenewalProposal` and writes the ledger it is handed back, and the DM's verb
 * (`realmVerbExecution.js`, PROPOSE_PACT) drafts the renewal word through
 * `renewalClauseSheet`. Every other road through both files is byte-identical to the base.
 *
 * ⚠ THIS LEAF WRITES NO TREATY LEDGER, AND THAT IS DELIBERATE. The oath-stamp totality
 * walker makes every module that writes `treaties` either a registered signing door or a
 * declared rewriter, and `pactAmendment.js` is declared a rewriter that must never stamp.
 * A renewal DOES stamp. So the renewed record is composed here, and it is written by the
 * answer step in `pactFormation.js`, which is already the registered door that stamps what
 * it writes. No registry row moves, and no stamp is laundered through a rewriter.
 *
 * ── THE STACKING BYPASS IS THE SUPERSESSION, AND ONLY A RENEWAL GETS IT ───────────
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
 * ── WHAT THIS WAVE DOES NOT DO, NAMED ─────────────────────────────────────────────
 * No organic opener (the brief routes the renewal through GR-2b's verb). No re-draft at the
 * believed ratio and no renewal evaluator in the K3 set (GR-5c). No conversion (GR-5d). No
 * news kind (GR-5e is the voice; the verb's two registered pools already speak the order).
 * No provenance write (`provenance` records how an instrument BEGAN; the lineage says what
 * happened since). No new top-level key and no new ledger.
 *
 * THE EDITOR (L10): `RENEWAL_WORLD_CONDITIONS.renewalWindowOpen` is DEFINED here in
 * `worldConditions.js`'s live-row shape and composed by the chair; its seal's consumer is the
 * slot "GR-5b-c: the seal's consumer lands when U123 composes the direction transport". The
 * act is PROPOSE_PACT with the renewal word on its clause dial (a realm verb, applied by the
 * realm lane at the tick). Real-only: phantoms never enter a campaign's courts.
 *
 * PURE: no rng, no clock, no store. It reads the treaty ledger and the proposal row it is
 * handed, and every write goes back to its caller.
 *
 * @enforced-by tests/domain/pactRenewalGr5b.test.js
 */
import { NPC_UNAVAILABLE_STATUSES } from '../entities/npcs.js';
import { OFF_STAGE_STATUSES, isOffStage } from '../roads/state.js';
import { oathHolderActive, stampSworn } from './oathHolder.js';
import {
  PACT_LINEAGE_ACTS, amendPactInstrument, lineageOf, stackingCellOf, termIdOf, treatyRenewalActive,
} from './pactAmendment.js';
import { pactCounterpartiesFor, settlePactProposal } from './pactProposals.js';
import { PACT_TRIGGERS } from './pactTriggers.js';
import { treatyPairKey } from './peaceTermsPrimitives.js';
import { treatyLedgerOf } from './treatyEnforcement.js';

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
 * THE TRIGGER WORD, read OUT of the closed trigger vocabulary rather than typed here, so an
 * upstream rename empties it and every renewal road refuses instead of pointing at nothing.
 */
export const RENEWAL_TRIGGER = PACT_TRIGGERS.filter((trigger) => trigger === 'renewal')[0] || '';

/** THE ACT, read out of the closed lineage vocabulary for the same reason. */
const RENEWAL_ACT = PACT_LINEAGE_ACTS.filter((act) => act === 'renewed')[0] || '';

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
 * same clauses on the same spans. The re-draft at the believed ratio, the rebuilt court that
 * asks for lighter terms, is GR-5c's.
 * @param {unknown} treaty @param {number} tick @returns {Array<Record<string, unknown>>}
 */
export function draftRenewalSheet(treaty, tick) {
  return present(liveTermsOf(treaty, tick).map((term) => reissuedAt(term, tick)));
}

/**
 * THE VERB'S RENEWAL WORD (GR-2b's PROPOSE_PACT, the clause dial). Null for any other clause,
 * so the verb's own drafter runs exactly as before; for the renewal word, the trigger and the
 * standing instrument's renewal sheet, or an EMPTY sheet when the layer is dark or the pair
 * holds no instrument inside its window, which the ledger's one writer refuses as a sheet
 * that drafts nothing.
 * @param {{worldState: unknown, termType: string, fromId: string, toId: string, tick: number}} input
 * @returns {{trigger: string, terms: Array<Record<string, unknown>>}|null}
 */
export function renewalClauseSheet({ worldState, termType, fromId, toId, tick }) {
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
 * RENEW A STANDING INSTRUMENT: close the live clauses the sheet re-offers, re-issue the
 * sheet from the signing, and record the act through the ONE amendment writer.
 *
 * The implied single act of a record that carries no lineage is materialized from the
 * record AS IT STOOD, before any clause is closed, so the history of a legacy instrument
 * lists the clauses it was really made with. A sheet that renews nothing leaves the record
 * exactly as it was.
 *
 * THE NEW OATH: while the oath layer is lit the prior signature is cleared and the pair
 * re-stamped at the signing through the on-stage cast, so a court whose seat nobody can
 * speak for swears in the seat's voice, exactly as at a mint. Dark, the record's signature
 * is left as it stands (GR-1's own dormancy).
 *
 * @param {{treaty: Record<string, unknown>, terms: ReadonlyArray<unknown>, tick: number,
 *   worldState: unknown, ids: ReadonlyArray<string>, settlementOf?: (id: string) => unknown}} input
 * @returns {{treaty: Record<string, unknown>, added: Array<Record<string, unknown>>,
 *   refused: Array<{cell: string, type: string, receipt: string}>,
 *   superseded: Array<Record<string, unknown>>}}
 */
export function renewPactInstrument({ treaty, terms, tick, worldState, ids, settlementOf = () => null }) {
  const at = wholeTick(tick);
  const sheet = present(listOfRecords(terms).map((term) => reissuedAt(term, at)));
  const cells = new Set(sheet.map(stackingCellOf));
  const standing = listOfRecords(recordOf(treaty).terms);
  const superseded = standing.filter((term) => Number(term.expiresTick) > at && cells.has(stackingCellOf(term)));
  const base = { ...treaty, lineage: lineageOf(treaty), terms: standing.filter((term) => !superseded.includes(term)) };
  const amended = amendPactInstrument({ treaty: base, terms: sheet, tick: at, act: RENEWAL_ACT });
  if (amended.added.length === 0) return { treaty, added: [], refused: amended.refused, superseded: [] };
  /** @type {Record<string, unknown>} */
  const renewed = { ...amended.treaty };
  if (oathHolderActive(worldState)) {
    delete renewed.sworn;
    stampSworn(renewed, { worldState, tick: at, ids, settlementOf: onStageSettlementOf(settlementOf) });
  }
  return { treaty: renewed, added: amended.added, refused: amended.refused, superseded };
}

/**
 * THE RENEWAL'S ANSWER, SETTLED — the one fold `advancePeacetimePacts` makes into this leaf.
 *
 * Null for everything that is not a renewal row in a lit world, so the answer step's own
 * roads run exactly as they did. For a renewal: the court's verdict is the threshold every
 * pact answer uses (`answerPactProposal`, handed in); `signed` over an instrument that still
 * binds renews it and hands back the treaties ledger for the answer step to write; anything
 * else closes the question and hands back NO ledger, and the row settles `refused`, or
 * `expired` when the instrument ran out before the answer came.
 *
 * THE CLEAN LAPSE, RESTATED BECAUSE IT IS THE PIN: nothing on this path touches the
 * relationship record. No trust delta, no turning point, no strain, no grievance: the only
 * write is the proposal row's own settled state, and the queue prunes it.
 *
 * @param {{worldState: Record<string, unknown>, proposal: Record<string, unknown>,
 *   answer: {verdict: string, receipt: string, offer01: number, reserve01: number},
 *   tick: number, settlementOf?: (id: string) => unknown}} input
 * @returns {{worldState: Record<string, unknown>, ledger: Record<string, unknown>|null,
 *   receipt: Record<string, unknown>}|null}
 */
export function settleRenewalProposal({ worldState, proposal, answer, tick, settlementOf = () => null }) {
  const row = recordOf(proposal);
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
