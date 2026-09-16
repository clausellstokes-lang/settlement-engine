/**
 * envoyRatificationStage.js — WR-7c's ratification stage, at the home mouth.
 *
 * `coalitionRatification.js` holds the law; this leaf is the only place that law
 * meets a live pulse. `envoyPulse.js` composes it and owns none of it, exactly
 * as it composes `envoyInterceptionStage.js`.
 *
 * THE ONE FACT THIS STAGE EXISTS TO ENFORCE: a term sheet an envoy carried home
 * BINDS NOTHING until it is ratified. Before this stage, a terms-bearing return
 * handed its carried sheet straight to the outcome mouth and the clauses landed
 * because the envoy survived the road. Now the sheet must also survive a vote.
 *
 * THE THREE CHAIR RULINGS THIS STAGE IS BUILT UNDER (CR-WIRE-A/B/C, vetoable):
 *
 *   CR-WIRE-A — THE POWER BAND IS PICTURE-DERIVED. A member's weight in the
 *     tally comes from ITS OWN FROZEN PICTURE and from nothing else.
 *     `ratificationPowerBandFromPicture` takes a picture and no world, so there
 *     is no argument through which truth could enter, and K3's import pin over
 *     the negotiation modules stays CLOSED: this file reaches the terms math
 *     only through `negotiationPictures.js`, by way of `coalitionRatification`.
 *     A coalition weighted by what its members ACTUALLY are, rather than by what
 *     each believes itself to be, would be the merged truth-read K3 forbids —
 *     the vote is a belief act end to end, including the arithmetic of who
 *     counts for how much.
 *
 *   CR-WIRE-B — A COALITION-LESS EPISODE RATIFIES THROUGH THE SOLE-OFFER ARM.
 *     The bilateral episode this tree actually mints has one home side and one
 *     picture of the pair, so its tally is a coalition of one and its contest is
 *     `chooseAmongCompetingOffers`' `sole_offer` arm. That is a real ratification
 *     and not a bypass: a single member can and does refuse, and a refused sheet
 *     binds nothing. Two envoys of one side home in one pulse with DIFFERENT
 *     sheets are rival offers, and a side that cannot choose between them has
 *     failed to choose — which is the close-vote case, not a tie to be broken.
 *
 *   CR-WIRE-C is enforced where capacity is actually counted, in
 *     `envoyErrand.js`'s mint head, not here.
 *
 * WHAT THIS STAGE DELIBERATELY DOES NOT DO — recorded, not forgotten:
 *
 *   IT DOES NOT MINT THE COMPROMISE ROUND'S ERRANDS. On a close verdict it
 *     COMPUTES the round through `openCompromiseRound` and hands both mandates
 *     back, because the mandate pair is the shape that keeps the two sides
 *     inseparable. It does not re-mint them, and the reason is a measured gap
 *     rather than a preference: minting the counterpart's mandate needs an
 *     authored bilateral offer with the COUNTERPART as offerer, and no such
 *     offer exists anywhere in the pulse's reach — the returning errand carries
 *     the home side's offer only. Sending one side and holding the other is the
 *     precise failure `openCompromiseRound`'s return shape was built to make
 *     impossible, so this stage stops at the mandates rather than committing
 *     half a round.
 *
 *   IT DOES NOT RUN THE SEAT ARM. Every ballot is cast on the realm's book
 *     (`seatPresent: false`). The seat arm is real and unit-proven in
 *     `coalitionRatification.js`, but a SEAT's decision is a character act —
 *     which envoy the ruler chose to believe, through `selectBelievedAccount` —
 *     and the pulse builds no account corpus for it to choose from. Wiring a
 *     seat decision today would mean inventing the ruler's judgment, so the
 *     realm arm carries the stage and the seat arm waits for the testimony half.
 *
 * PURE OF WRITES: no ledger is assigned here. The stage reads frozen pictures
 * and carried sheets, and returns verdicts the pulse gates on.
 */

import {
  COMPROMISE_DRAIN_BANDS,
  compromiseRoundIndex,
  openCompromiseRound,
} from './compromiseRound.js';
import {
  RATIFICATION_TUNING,
  castRatificationBallot,
  chooseAmongCompetingOffers,
  ratifyTermSheet,
} from './coalitionRatification.js';
import { TESTIMONY_DESIRED_OUTCOMES } from './envoyTestimony.js';
import { envoyErrandsOf, envoyOfferEpisodeKey } from './envoyErrand.js';

/**
 * CR-WIRE-A's derivation table, from a picture's own strength band to a power
 * band. A court that believes itself dominant votes as a principal power; one
 * that believes itself spent votes as a minor one. Both may be wrong, and being
 * wrong is the point.
 */
const POWER_BAND_FROM_STRENGTH = Object.freeze({
  dominant: 'principal',
  strong: 'principal',
  ready: 'ordinary',
  strained: 'ordinary',
  spent: 'minor',
  unknown: 'minor',
});

/**
 * The cause a picture believes is still live is a court that wants the war;
 * a cause it believes dissolved is a court that wants out. `unknown` is the
 * honest middle and is not rounded toward either.
 */
const DESIRED_OUTCOME_FROM_CAUSE = Object.freeze({
  live: 'war',
  dissolved: 'peace',
  anchor_unavailable: 'peace',
  unknown: 'undecided',
});

/**
 * WR-4's home-front drain, read off the party's OWN believed war exhaustion.
 * `unknown` reads as `quiet` because a court that cannot see its own bleeding
 * does not act on it.
 */
const DRAIN_BAND_FROM_EXHAUSTION = Object.freeze({
  unknown: 'quiet',
  quiet: 'quiet',
  present: 'present',
  pressing: 'pressing',
  decisive: 'decisive',
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * The party's own subject row inside its own picture. A picture always carries
 * exactly two subjects and one of them is the holder; anything else is not a
 * picture this stage will read.
 *
 * @param {unknown} picture @returns {Record<string, unknown> | null}
 */
function ownSubjectOf(picture) {
  const row = asObject(picture);
  const partyId = text(row.partyId);
  const subjects = Array.isArray(row.subjects) ? row.subjects : [];
  if (!partyId || subjects.length !== 2) return null;
  const own = subjects.map(asObject).find((subject) => text(subject.settlementId) === partyId);
  return own || null;
}

/**
 * CR-WIRE-A. THE WHOLE DERIVATION, and it takes ONE argument.
 *
 * The signature is the enforcement: there is no world state, no snapshot, and
 * no settlement row in reach, so a later hand cannot quietly weight this vote by
 * a real population or a real garrison. The pin asserts exactly that — the band
 * moves when and only when a picture field moves.
 *
 * @param {unknown} picture @returns {string} a closed power band, or ''
 */
export function ratificationPowerBandFromPicture(picture) {
  const own = ownSubjectOf(picture);
  if (!own) return '';
  const bands = /** @type {Record<string, string>} */ (POWER_BAND_FROM_STRENGTH);
  return bands[text(own.strengthBand)] || '';
}

/**
 * The member's desired outcome, likewise from the picture alone. This is what
 * makes THE UNANIMOUS-IN-JUDGMENT, SPLIT-IN-FACT jewel reachable through the
 * pulse: two courts that both believe the cause dissolved both want peace, and
 * still vote differently, because their pictures of the terms differ.
 *
 * @param {unknown} picture @returns {string} a closed desired outcome, or ''
 */
export function ratificationDesiredOutcomeFromPicture(picture) {
  const row = asObject(picture);
  const table = /** @type {Record<string, string>} */ (DESIRED_OUTCOME_FROM_CAUSE);
  const outcome = table[text(row.causeStatus)] || '';
  return TESTIMONY_DESIRED_OUTCOMES.includes(outcome) ? outcome : '';
}

/**
 * The home-front drain band, from the same picture and nothing else.
 *
 * @param {unknown} picture @returns {string} a closed drain band, or ''
 */
export function ratificationDrainBandFromPicture(picture) {
  const own = ownSubjectOf(picture);
  if (!own) return '';
  const table = /** @type {Record<string, string>} */ (DRAIN_BAND_FROM_EXHAUSTION);
  const band = table[text(own.warExhaustionBand)] || '';
  return COMPROMISE_DRAIN_BANDS.includes(band) ? band : '';
}

/**
 * The errand row backing one home delivery, by exact id.
 * @param {Array<Record<string, unknown>>} errands
 * @param {unknown} delivery
 * @returns {Record<string, unknown> | null}
 */
function errandForDelivery(errands, delivery) {
  const wanted = text(asObject(delivery).errandId);
  if (!wanted) return null;
  return errands.map(asObject).find((/** @type {Record<string, unknown>} */ row) => (
    text(row.id) === wanted
  )) || null;
}

/**
 * One member's ballot on one carried sheet, cast on the errand's OWN frozen
 * envoy picture. The member IS the home side: a bilateral episode has one court
 * behind its envoy, and CR-WIRE-B rules that court a coalition of one rather
 * than a special case that skips the vote.
 *
 * @param {unknown} errand
 * @returns {{ballot:Record<string, unknown>|null, reason:string}}
 */
function ballotForErrand(errand) {
  const row = asObject(errand);
  const picture = row.negotiationPicture;
  const sideId = text(row.from);
  const counterpartId = text(row.to);
  const powerBand = ratificationPowerBandFromPicture(picture);
  const desiredOutcome = ratificationDesiredOutcomeFromPicture(picture);
  if (!sideId || !counterpartId || !powerBand || !desiredOutcome) {
    return { ballot: null, reason: 'unreadable_member' };
  }
  return castRatificationBallot({
    member: {
      memberId: sideId,
      sideId,
      counterpartId,
      powerBand,
      seatPresent: false,
      seatDecision: null,
      desiredOutcome,
    },
    picture,
    termSheet: row.termSheet,
  });
}

/**
 * How many parlays for this episode have already come home without binding.
 * DERIVED from the errand history rather than stored, exactly as
 * `compromiseRoundIndex` requires: a stored counter would be a second source of
 * truth for a fact the ledger already carries.
 *
 * @param {Array<Record<string, unknown>>} errands
 * @param {string} episodeKey @param {string} sideId @param {string} currentErrandId
 * @returns {string[]}
 */
function priorFailedParlays(errands, episodeKey, sideId, currentErrandId) {
  return errands.map(asObject)
    .filter((/** @type {Record<string, unknown>} */ row) => text(row.from) === sideId
      && text(row.id) !== currentErrandId
      && envoyOfferEpisodeKey(row.offer) === episodeKey
      && text(row.state) === 'home')
    .map((/** @type {Record<string, unknown>} */ row) => text(row.id))
    .filter(Boolean);
}

/**
 * The close-vote round. BOTH mandates or none — the pair is the return shape of
 * `openCompromiseRound`, and this stage passes it through whole.
 *
 * @param {{errands:Array<Record<string, unknown>>, errand:Record<string, unknown>,
 *   episodeKey:string, sideId:string, counterpartId:string, verdict:string}} args
 * @returns {Record<string, unknown> | null}
 */
function compromiseFor({ errands, errand, episodeKey, sideId, counterpartId, verdict }) {
  const row = asObject(errand);
  const ownDrain = ratificationDrainBandFromPicture(row.negotiationPicture);
  const foeDrain = ratificationDrainBandFromPicture(row.targetCourtPicture);
  if (!ownDrain || !foeDrain) return null;
  return openCompromiseRound({
    verdict,
    episodeKey,
    sides: [
      { partyId: sideId, drainBand: ownDrain },
      { partyId: counterpartId, drainBand: foeDrain },
    ],
    priorRoundIndex: compromiseRoundIndex({
      failedParlayIds: priorFailedParlays(errands, episodeKey, sideId, text(row.id)),
    }),
  });
}

/**
 * THE STAGE. Every terms-bearing home delivery in this pulse is grouped by the
 * exact episode and side it belongs to, each group's sheets are tallied as
 * rivals, and the contest answers which single sheet — if any — the side
 * actually chose.
 *
 * The return is a Map keyed by errand id so the pulse can gate ONE delivery at
 * a time at the mouth without re-deriving anything. A delivery carrying no
 * sheet is absent from the map and is not gated: an envoy who agreed nothing
 * has nothing to ratify, and his homecoming is unaffected.
 *
 * @param {{worldState?:unknown, homeDeliveries?:unknown, closeBand01?:unknown}} args
 * @returns {{verdicts:Map<string, Record<string, unknown>>,
 *   ratifications:Array<Record<string, unknown>>}}
 */
export function ratifyCarriedSheets({ worldState, homeDeliveries, closeBand01 } = {}) {
  /** @type {Map<string, Record<string, unknown>>} */
  const verdicts = new Map();
  /** @type {Array<Record<string, unknown>>} */
  const ratifications = [];
  const deliveries = (Array.isArray(homeDeliveries) ? homeDeliveries : [])
    .map(asObject)
    .filter((row) => asObject(row.termSheet) && text(asObject(row.termSheet).id));
  if (deliveries.length === 0) return { verdicts, ratifications };
  const errands = envoyErrandsOf(worldState);
  const band = typeof closeBand01 === 'number' ? closeBand01 : RATIFICATION_TUNING.CLOSE_BAND_01;

  /** @type {Map<string, Array<Record<string, unknown>>>} */
  const groups = new Map();
  for (const delivery of deliveries) {
    const sheet = asObject(delivery.termSheet);
    const key = [text(sheet.episodeKey), text(delivery.from), text(delivery.to)]
      .map((part) => `${part.length}:${part}`).join('|');
    const bucket = groups.get(key) || [];
    bucket.push(delivery);
    groups.set(key, bucket);
  }

  for (const [, bucket] of [...groups.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    /** @type {Array<Record<string, unknown>>} */
    const tallies = [];
    /** @type {Map<string, Record<string, unknown>>} */
    const bySheet = new Map();
    for (const delivery of bucket) {
      const errand = errandForDelivery(errands, delivery);
      const cast = ballotForErrand(errand);
      /**
       * A vote that could not be held is still a verdict, and it is RECORDED
       * rather than merely enforced. Publishing the refusal only through the
       * gate would make the commonest unbound case — an unreadable member —
       * invisible on the receipt while it silently stripped a sheet, which is
       * exactly the kind of quiet enforcement this estate does not ship.
       */
      const unheld = (/** @type {string} */ reason) => {
        const record = {
          bound: false,
          reason,
          verdict: '',
          chosenTermSheetId: null,
          termSheetId: text(asObject(delivery.termSheet).id),
          errandId: text(delivery.errandId),
          episodeKey: text(asObject(delivery.termSheet).episodeKey),
          unionWeight: 0,
          compromiseRound: null,
        };
        verdicts.set(text(delivery.errandId), record);
        ratifications.push(record);
      };
      if (!cast.ballot) {
        // An unreadable member cannot vote, and a sheet nobody voted on is a
        // sheet nobody ratified. It binds nothing, which is the safe direction.
        unheld(cast.reason);
        continue;
      }
      const tally = ratifyTermSheet({ ballots: [cast.ballot], closeBand01: band });
      if (tally.reason !== 'tallied') {
        unheld(String(tally.reason));
        continue;
      }
      tallies.push(tally);
      bySheet.set(String(tally.termSheetId), delivery);
    }
    if (tallies.length === 0) continue;
    const contest = chooseAmongCompetingOffers({ tallies, closeBand01: band });
    const chosen = text(contest.chosenTermSheetId);
    for (const [sheetId, delivery] of bySheet.entries()) {
      const errand = errandForDelivery(errands, delivery);
      const bound = chosen !== '' && sheetId === chosen;
      const round = String(contest.verdict) === 'close' && errand
        ? compromiseFor({
          errands,
          errand,
          episodeKey: text(asObject(delivery.termSheet).episodeKey),
          sideId: text(delivery.from),
          counterpartId: text(delivery.to),
          verdict: 'close',
        })
        : null;
      const record = {
        bound,
        reason: String(contest.reason),
        verdict: String(contest.verdict),
        chosenTermSheetId: chosen || null,
        termSheetId: sheetId,
        errandId: text(delivery.errandId),
        episodeKey: text(asObject(delivery.termSheet).episodeKey),
        unionWeight: Number(contest.unionWeight),
        compromiseRound: round,
      };
      verdicts.set(text(delivery.errandId), record);
      ratifications.push(record);
    }
  }
  return { verdicts, ratifications };
}
