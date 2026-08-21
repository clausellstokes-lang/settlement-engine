/**
 * espionageGauntlet.js — ES-2: THE GAUNTLET. What happens to a covert traveller who stops
 * somewhere that does not like the realm he came from.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.3(b), §3.4, §3.4b, §3.9's captor arm, §3.10. The WAYFARE
 * volume's §4 encounter-pairs table carries this resolver as row **E15 — spy-dwell
 * detection (covert operative x host settlement watch)**, admitted by chair ruling CR-ES-6.
 * ⚠ THAT ROW WAS ALREADY IN `docs/DESIGN_FP_ARCH_WY.md` WHEN THIS WAVE OPENED (verified at
 * build; it names this file by name a phase before WY-6 exists), so this commit CONFIRMS it
 * rather than adding a second copy of it. CR-ES-6's same-commit obligation is discharged by
 * that verification, and the verification is recorded here because a duplicate row would be
 * worse than a missing one: WY-6's walker counts rows.
 *
 * ── ⛔ THE ONE ARM THIS WAVE COULD NOT BUILD, MEASURED RATHER THAN ASSUMED ───────────────
 * The charter's capture arm reads "capture -> `openForeignGuestHold` cause `caught_spying`".
 * Against the LIVE tree that is not reachable, and the refusal is executed, not inferred:
 *
 *   1. `envoyErrandRecords.normalizeErrand` REFUSES a row in state `held` that carries no
 *      errand-side ENCOUNTER — the clause reads
 *      `} else if (interceptedTick != null || heldTick != null || releasedTick != null
 *          || ['intercepted','held'].includes(state)) return null;`
 *      so custody is welded to an encounter by the PERSISTENCE DTO, not merely by a writer.
 *   2. ⏱ EP-q MOVED THIS ONE, AND THE BLOCKER SURVIVED THE MOVE — recorded rather than
 *      deleted, because a sentence that merely disappears cannot be checked. It USED TO
 *      read: `normalizeEnvoyEncounter` requires a non-empty `armyId` AND an
 *      `interceptorPicture` whose `carrier.kind === 'army'`, so a settlement WATCH — which
 *      has no army — could not be described by any lawful encounter row. The owner's
 *      Option-A ruling made both clauses CARRIER-CONDITIONAL: a `court`-carried picture
 *      with a null `armyId` at the new `host_settlement` venue is now a lawful PERSISTED
 *      row. What EP-q deliberately did NOT move is the WRITER. `openEnvoyInterception` —
 *      the only genesis of an encounter anywhere in the tree — still demands an army
 *      carrier at its own gate, so the SHAPE now exists and nothing can mint it. ES-2b
 *      opens that gate; until it does, blockers 1 and 3 stand untouched and this stage
 *      still computes the capture, receipts it, and hands it back.
 *   3. `resumeEnvoyJourney` — the only release road in the tree, reached by the DM pardon
 *      verb through `releaseHeldEnvoy` — refuses `stale_encounter` without that same row.
 *      A hold opened here would therefore be a hold that could only ever end in `death`.
 *
 * Relaxing either DTO is a PERSISTED-SCHEMA change and this estate gates those on the
 * owner. So the gauntlet does what `envoyRansomStage.js` already does with the ransom claim
 * for exactly the same reason: it COMPUTES the capture, RECEIPTS it, and HANDS IT BACK.
 * Nothing here writes custody, and no arm of this file is silently absent — every detection
 * carries `custodyWritten: false` and the reason, so a reader of the stage's output can
 * never mistake a computed capture for a persisted one. ES-2b lands the write behind the
 * owner ruling on the encounter shape.
 *
 * ── THE DWELL WINDOW, MEASURED ──────────────────────────────────────────────────────────
 * A covert itinerary is expressed as multi-leg outbound routing (ES §1), so a STOP is the
 * gap between one leg's `arrivalTick` and the next's `departTick`. Executed on a real
 * two-leg mission (ashford -> westmarch -> irontown, arrivals 12 and 18, second departure
 * 16), `scheduledEnvoyPosition` answers `{complete:false, progressBand:'arrived',
 * legIndex:0}` at every tick from 12 through 15 and moves on at 16. That arrived-but-not-
 * complete cursor IS the dwell, and this leaf reads it rather than minting a second clock.
 * The FINAL stop is the `complete:true` cursor, which the errand advance turns into
 * `parlaying`; a covert row dwelling there is dwelling at its target, so both states count.
 *
 * ── EXACTLY ONCE PER INTERVAL, BY IDEMPOTENCE RATHER THAN BY A FLAG ─────────────────────
 * The roll is `hash01('es.stay.<errandId>.<stopIdx>.<intervalIdx>')` — a PURE function of
 * the interval's identity. Every tick inside one interval therefore yields the BYTE-
 * IDENTICAL decision, so re-evaluating an interval cannot produce a second outcome and no
 * "already rolled" byte has to be stored (ES §1's zero-new-state fight). The alternative —
 * firing only on the interval's first tick — silently skips an interval whenever a pulse
 * advances more than one tick, which is a hole nobody would watch.
 *
 * ── WHAT IS DEGRADED, DECLARED, AND WHY (the SP-C idiom) ───────────────────────────────
 * ⏱ ES-5 CLOSED THE FIRST HALF OF THIS BLOCK, and the record of what it said is kept
 * because the shape of the fence is the interesting part. `wariness01` (§3.8) has two
 * terms. `recentCovertHolds` is LAWFULLY OBSERVABLE — a court's own holds are its own state
 * — and has been live here since ES-2. `overdueForeignNotables` was declared absent at ES-2
 * because it "needs ES-5's visibility predicate, which must count only what a target can
 * lawfully see, and deriving it from bare covert rows would leak a mission's existence into
 * a foreign court's state". That predicate is now `espionageWariness.js`, a leaf with ZERO
 * IMPORTS — it cannot resolve a true purpose because there is no reader in it that could —
 * and both terms are folded below.
 *
 * ONE TERM REMAINS DECLARED ABSENT AND IT IS A DIFFERENT ONE: §3.8's
 * `believedNotorietyWeighting`. The measured reason is a GRAIN MISMATCH written out in
 * espionageWariness.js's header — `believedNotorietyRank` is a wandering-NPC circulation
 * read and errand travellers are roster people — and the name travels on every detection
 * exactly as its predecessor did, so nothing here narrates a tell no machinery delivers.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation. The one
 * stochastic choice is a keyed hash (L1 — zero new PRNG streams).
 *
 * @enforced-by tests/domain/espionageGauntlet.test.js,
 *   tests/property/espionageGauntletDormancyFence.test.js
 */
import { causalBand, deriveSystemVariable } from '../../causalState.js';
import {
  guildEffectiveSecurity,
  patronageSecurityDrag,
  readCorruptionClimate,
} from '../../corruption.js';
import { hash01 } from '../../region/contestMath.js';
import { ROADS_TUNING } from '../../roads/state.js';
import { relationshipTypeBetween } from '../../roads/embassyHazard.js';
import { settlementHasUnderways } from '../clandestineFacet.js';
import { criminalStrength01Of } from '../supplyKernel.js';
import { envoyErrandsOf } from '../envoyErrandRecords.js';
import { FOREIGN_GUEST_HOLD_COVERT_CAUSE, foreignGuestHoldsOf } from '../foreignGuestHold.js';
import { scheduledEnvoyPosition } from '../envoyErrandTransit.js';
import { espionageActive } from './espionageGate.js';
import {
  ESPIONAGE_TUNING,
  catchChance01,
  covertCompetence01,
  dwellRamp,
  round4,
  wariness01Core,
} from './espionageMath.js';
// ES-5 — THE TELL'S OTHER HALF. The predicate arrives from a leaf with no imports at all,
// and the errand rows go IN as an argument rather than being fetched there: the visibility
// fence is the module's own emptiness, so this file's `covert` reads cannot reach it.
import { observerClusterIds, overdueForeignNotables } from './espionageWariness.js';

/**
 * The cause a stay-detection custody row would carry — IMPORTED from the vocabulary's own
 * home, never re-typed. This leaf already reaches `foreignGuestHold.js` for the tell's
 * holds term, so borrowing the word costs nothing and removes a spelling; `ransomClaim.js`
 * is the one module that re-declares it, and its header records why (a pure leaf may not
 * import a world reader for one string) alongside the equality pin that keeps the two
 * honest. Seam row 3's one-spelling clause.
 */
export const COVERT_HOLD_CAUSE = FOREIGN_GUEST_HOLD_COVERT_CAUSE;

// ES-5c §3.4b — the two declared-absence states of `gatherOrGovernRead`, frozen at MODULE
// level so the read returns the SAME array identity every call and cannot be mutated by a
// consumer. Which one is returned is decided by whether a carrier really supplied the term.
// ⚠ BOTH ARE ANNOTATED: an un-annotated `Object.freeze([])` infers `readonly never[]`, which
// the domain-strict checker refuses as an implicit `any[]` (TS7005/TS4104).
/** @type {ReadonlyArray<string>} */
const PROMOTION_ABSENT = Object.freeze(['promotionRisk']);
/** @type {ReadonlyArray<string>} */
const EMPTY_TERMS = Object.freeze([]);

/**
 * ES-2's own constants. Kept OUT of `ESPIONAGE_TUNING` deliberately: that export is ES-0's
 * frozen arithmetic surface and its keys are pinned as a set, so a wave that appended to it
 * would move a pinned totality for two numbers that belong to a stage rather than to a
 * formula. Raw-authored proposals until the owner signs them (L5, THE PROMISE).
 */
export const GAUNTLET_TUNING = Object.freeze({
  /** How long one rooted re-sample interval runs, in whole ticks (ES §3.4b). */
  DWELL_INTERVAL_TICKS: 2,
  /** activeConditions count at which a settlement is fully porous (§3.3, addition C). */
  STRESS_CONDITION_CAP: 4,
  /** How far back a court's own caught spies keep it watchful (§3.8's LOOKBACK). */
  COVERT_HOLD_LOOKBACK_TICKS: 26,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @returns {number | null} */
function wholeTick(value) {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : null;
}

/**
 * §3.3(b)/§3.4b — WHERE A COVERT TRAVELLER IS STANDING STILL, and for how long.
 *
 * PURE over the row and one tick. Answers `dwelling:false` with a reason for every row that
 * is not a covert mission paused at a stop, because a stage that had to ask four questions
 * before it could ask this one would be four places a condition could be forgotten.
 *
 * `intervalIdx` 0 is the MINTED stay — the plan's own dwell, which multiplies the ramp by
 * exactly 1, so a mission that never roots is priced as though the ramp did not exist.
 * Intervals 1+ are ROOTED re-samples and are capped at `DWELL_RESAMPLE_CAP`.
 *
 * @param {{errand?: unknown, tick?: unknown}} args
 * @returns {{dwelling: boolean, stopIndex: number, settlementId: string, arrivalTick: number,
 *   plannedStayTicks: number, intervalIdx: number, rooted: boolean, reason: string}}
 */
export function covertDwellRead({ errand, tick } = {}) {
  /** @param {string} reason */
  const still = (reason) => ({
    dwelling: false,
    stopIndex: 0,
    settlementId: '',
    arrivalTick: 0,
    plannedStayTicks: 0,
    intervalIdx: 0,
    rooted: false,
    reason,
  });
  const row = recordOf(errand);
  const now = wholeTick(tick);
  if (now == null) return still('invalid_tick');
  // THE COVERT TEST IS THE SUB-RECORD, NOT THE CLASS WORD. `errandSpineBlock` writes
  // `covert` only onto a row whose RESOLVED class is covert, so its presence is exactly the
  // class test — and reading it keeps this file from spelling any of the three conditional
  // face fields, which `tests/lint/errandConsumerRegistry.walker.test.js` reserves to the
  // errand family. One read, two laws honoured.
  const mission = recordOf(row.covert);
  const itinerary = Array.isArray(mission.itinerary) ? mission.itinerary.map(recordOf) : [];
  if (!itinerary.length) return still('not_a_mission');
  const state = text(row.state);
  if (state !== 'travelling' && state !== 'parlaying') return still('not_dwelling');
  const legs = (Array.isArray(row.legs) ? row.legs.map(recordOf) : [])
    .filter((leg) => leg.journey === 'outbound');
  // The row goes in UNMODIFIED. `scheduledEnvoyPosition` picks the return journey only for
  // state `returning`, and neither state this leaf admits is that one — an earlier draft
  // rewrote the state to `travelling` first, which read like a normalization and was in
  // fact a no-op that would have hidden the day a third state became admissible.
  const scheduled = scheduledEnvoyPosition(row, now);
  const position = recordOf(scheduled?.positionRef);
  if (!scheduled || position.progressBand !== 'arrived') return still('not_dwelling');
  const legIndex = wholeTick(position.legIndex);
  const leg = legIndex == null ? null : legs[legIndex] || null;
  const arrivalTick = leg ? wholeTick(leg.arrivalTick) : null;
  if (arrivalTick == null || now < arrivalTick) return still('not_dwelling');
  const settlementId = text(position.toId);
  const stop = itinerary.find((entry) => text(entry.settlementId) === settlementId) || null;
  // A stop the itinerary does not name is a waypoint the plan passes through, not a stay
  // anybody chose. It gets no roll: the owner's exposure list is stops and army columns.
  if (!stop) return still('unplanned_stop');
  const plannedStayTicks = wholeTick(stop.stayTicks) ?? 0;
  const past = now - arrivalTick - plannedStayTicks;
  const intervalIdx = past < 0
    ? 0
    : Math.min(
      ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP,
      1 + Math.floor(past / GAUNTLET_TUNING.DWELL_INTERVAL_TICKS),
    );
  return {
    dwelling: true,
    stopIndex: /** @type {number} */ (legIndex) + 1,
    settlementId,
    arrivalTick,
    plannedStayTicks,
    intervalIdx,
    rooted: intervalIdx > 0,
    reason: 'dwelling',
  };
}

/**
 * §3.8's HOLDS TERM, live and lawful: how many spies this court has caught lately. Counts
 * the target's OWN custody rows, which is state it plainly can observe.
 *
 * @param {{worldState?: unknown, targetId?: unknown, tick?: unknown}} args @returns {number}
 */
export function recentCovertHolds({ worldState, targetId, tick } = {}) {
  const at = wholeTick(tick);
  const captor = text(targetId);
  if (at == null || !captor) return 0;
  const since = at - GAUNTLET_TUNING.COVERT_HOLD_LOOKBACK_TICKS;
  return foreignGuestHoldsOf(worldState).map(recordOf).filter((hold) => (
    text(hold.captorId) === captor
    && hold.cause === COVERT_HOLD_CAUSE
    && Number(hold.heldSinceTick) >= since
    && Number(hold.heldSinceTick) <= at
  )).length;
}

/**
 * §3.3 — THE EIGHT WORLD FACTORS, gathered here because ES-0's arithmetic deliberately
 * takes them as ARGUMENTS: a function that gathers its own inputs cannot have any single
 * factor mutated out, which is exactly how a term that looks live turns out to be dead.
 *
 * ⚠ THE SINGLE DIP (J-ES-3) IS SPELLED ONCE, HERE. `securityEff01` is
 * `guildEffectiveSecurity(...)` times `(1 - patronageSecurityDrag(...).drag)` and the catch
 * leaf applies no further criminal discount, because `corruption.js` records in-source that
 * the guild's shielding is ALREADY priced into `exposureChance`'s -guildStrength term and
 * double-dipping is the mistake that comment exists to prevent. Reading RAW security here
 * instead would make a criminally-captured town catch spies as well as a clean one, which
 * inverts the owner's sentence.
 *
 * @param {{worldState?: unknown, regionalGraph?: unknown, homeId?: unknown,
 *   homeItem?: unknown, targetItem?: unknown, npc?: unknown, tick?: unknown,
 *   dwell?: unknown, hasInsideAsset?: unknown}} args
 * @returns {{hostRung: number, securityEff01: number, orderBand: string, stressLoad01: number,
 *   hasUnderways: boolean, hasInsideAsset: boolean, wariness01: number, competence01: number,
 *   stops: number, intervalIdx: number, overdueNotables: number,
 *   warinessTermsAbsent: ReadonlyArray<string>}}
 */
export function gauntletCatchFactors({
  worldState,
  regionalGraph = null,
  homeId = '',
  homeItem = null,
  targetItem = null,
  npc = null,
  tick,
  dwell = null,
  hasInsideAsset = false,
} = {}) {
  const stop = recordOf(dwell);
  const targetId = text(recordOf(targetItem).id) || text(stop.settlementId);
  // Both world arguments are NARROWED through the same record reader the rest of this leaf
  // uses, rather than asserted: the hazard reader takes real objects and a null graph is a
  // lawful input (it answers with no relationship, and no relationship rolls nothing).
  const relationship = relationshipTypeBetween(
    recordOf(regionalGraph), recordOf(worldState), text(homeId), targetId,
  );
  const rung = /** @type {Readonly<Record<string, number>>} */ (ROADS_TUNING.T4_RUNG)[relationship];
  const climate = readCorruptionClimate(
    /** @type {Parameters<typeof readCorruptionClimate>[0]} */ (targetItem),
  );
  const drag = patronageSecurityDrag(
    /** @type {Parameters<typeof patronageSecurityDrag>[0]} */ (targetItem),
  ).drag;
  const securityEff01 = guildEffectiveSecurity(
    Number(climate.security),
    Number(criminalStrength01Of(
      /** @type {Parameters<typeof criminalStrength01Of>[0]} */ (targetItem),
    )),
  ) * (1 - Number(drag));
  const lawOrder = deriveSystemVariable(
    'law_order',
    /** @type {Parameters<typeof deriveSystemVariable>[1]} */ (targetItem),
  );
  const conditions = Array.isArray(recordOf(targetItem).activeConditions)
    ? /** @type {unknown[]} */ (recordOf(targetItem).activeConditions).length
    : 0;
  // ES-5 — BOTH §3.8 TERMS, each gathered on its own road. The tell counts foreign
  // travellers whose DECLARED schedule has lapsed at this town or one of its neighbours;
  // the holds term counts the spies this town has caught lately. Neither reads a covert
  // sub-record: the first cannot (its module imports nothing), and the second reads the
  // captor's own custody rows.
  const tell = overdueForeignNotables({
    errands: envoyErrandsOf(worldState),
    observerId: targetId,
    clusterIds: observerClusterIds(regionalGraph, targetId),
    tick,
  });
  return {
    hostRung: Number.isFinite(rung) ? rung : 0,
    securityEff01,
    orderBand: causalBand(Number(recordOf(lawOrder).score)),
    stressLoad01: Math.min(1, conditions / GAUNTLET_TUNING.STRESS_CONDITION_CAP),
    hasUnderways: settlementHasUnderways(
      /** @type {Parameters<typeof settlementHasUnderways>[0]} */ (targetItem),
    ) === true,
    hasInsideAsset: hasInsideAsset === true,
    wariness01: wariness01Core({
      overdueNotables: tell.count,
      recentCovertHolds: recentCovertHolds({ worldState, targetId, tick }),
    }),
    competence01: covertCompetence01(homeItem, npc),
    stops: Number(stop.stopIndex) || 1,
    intervalIdx: Number(stop.intervalIdx) || 0,
    overdueNotables: tell.count,
    // DECLARED, NOT SILENT — and it is a DIFFERENT term from the one ES-2 named here. See
    // espionageWariness.js's measured block: the notoriety weighting is a circulation-pool
    // read and errand travellers are roster people.
    warinessTermsAbsent: tell.termsAbsent,
  };
}

/**
 * THE INTERVAL'S IDENTITY — the whole of this layer's stochastic surface for a stay.
 * Codepoint-stable, one stream, keyed exactly as ES §3.3(b) spells it.
 *
 * @param {unknown} errandId @param {unknown} stopIndex @param {unknown} intervalIdx
 * @returns {string}
 */
export function stayDetectionKey(errandId, stopIndex, intervalIdx) {
  return `es.stay.${text(errandId)}.${Number(stopIndex) || 0}.${Number(intervalIdx) || 0}`;
}

/**
 * §3.3(b) — ONE STAY RESOLUTION. Pure, idempotent within an interval (see the header), and
 * ZERO for a friendly host by ARITHMETIC rather than by a caller-side condition somebody can
 * forget: `catchChance01` returns 0 for any rung outside `{rival, cold_war, hostile}`, and
 * `0 > u` is false for every `u` in [0,1).
 *
 * @param {{errandId?: unknown, factors?: unknown, dwell?: unknown}} args
 * @returns {{caught: boolean, catch01: number, roll01: number, key: string, ramp: number}}
 */
export function stayDetectionRoll({ errandId, factors, dwell } = {}) {
  const stop = recordOf(dwell);
  const key = stayDetectionKey(errandId, stop.stopIndex, stop.intervalIdx);
  const catch01 = catchChance01(/** @type {Parameters<typeof catchChance01>[0]} */ (factors));
  const roll01 = hash01(key);
  return {
    caught: roll01 < catch01,
    catch01,
    roll01,
    key,
    ramp: dwellRamp(stop.intervalIdx),
  };
}

/**
 * §3.4b — GATHER OR GOVERN. A rooted spy re-decides every interval whether one more week of
 * listening is worth the climbing odds, and the answer is IN CHARACTER: appetite is the
 * operative's temperament, and it is fixed while the risk climbs monotonically, so every
 * rooted stay terminates BY CONSTRUCTION rather than by a cap.
 *
 * ⚠ THE PROMOTION TERM IS DECLARED ABSENT WHENEVER NO CARRIER SUPPLIES IT — NEVER FOLDED AS
 * A SILENT ZERO (ES-5c, CR-ES5B-7, the EP-q carrier-conditional precedent). §3.14's register
 * is the "govern" half of this trade, and ES-5c built it: a rung-holder abroad on a contested
 * rung really does weigh a career risk against his appetite for one more week of listening.
 * But this function still has NO PRODUCTION CALLER — wiring it without also RE-TIMING the
 * spy's departure is route surgery on a live journey, declared out of scope at
 * espionageProductStage.js. So an UNCONDITIONAL flip would leave the parameter permanently
 * `undefined` ⇒ folded as 0, which is exactly the silent zero this paragraph used to forbid,
 * dressed as progress. The term is therefore declared PRESENT only when a finite carrier
 * really arrives, and ABSENT otherwise — the honest reading of both states, and the day the
 * arm is wired is still a visible change.
 *
 * The folded term RAISES the risk weighed against appetite (probabilistic-or, so it is
 * monotone and cannot exceed 1), which makes `govern` strictly more likely and never less:
 * a man about to lose his rung at home goes home.
 *
 * @param {{dwell?: unknown, appetite01?: unknown, demandMet?: unknown, factors?: unknown,
 *   promotionRisk01?: unknown}} args
 * @returns {{choice: 'gather'|'govern', dwellRisk01: number, termsAbsent: ReadonlyArray<string>,
 *   reason: string}}
 */
export function gatherOrGovernRead({ dwell, appetite01, demandMet, factors, promotionRisk01 } = {}) {
  const stop = recordOf(dwell);
  const carriedRisk = Number(promotionRisk01);
  const carried01 = Number.isFinite(carriedRisk) ? Math.max(0, Math.min(1, carriedRisk)) : null;
  const absent = carried01 === null ? PROMOTION_ABSENT : EMPTY_TERMS;
  if (demandMet === true) {
    return { choice: 'govern', dwellRisk01: 0, termsAbsent: absent, reason: 'demand_met' };
  }
  const next = Number(stop.intervalIdx || 0) + 1;
  if (next > ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP) {
    return { choice: 'govern', dwellRisk01: 1, termsAbsent: absent, reason: 'resample_cap' };
  }
  // The risk the NEXT interval would carry — the climbing catch, priced at the ramp band the
  // spy has not reached yet. Deciding on the interval he is already in would let him stay
  // one interval past the odds he actually refused.
  // THE TEN FIELDS ARE NAMED RATHER THAN SPREAD. `catchChance01` takes an exact factor
  // record; spreading a loose object into it would type only because the spread erased the
  // shape, and it would silently carry a stray key past the day the record grows an
  // eleventh term. Naming them is the narrowing, and it is also the reading.
  const carried = recordOf(factors);
  const dwellRisk01 = catchChance01({
    hostRung: carried.hostRung,
    securityEff01: carried.securityEff01,
    orderBand: carried.orderBand,
    stressLoad01: carried.stressLoad01,
    hasUnderways: carried.hasUnderways,
    hasInsideAsset: carried.hasInsideAsset,
    wariness01: carried.wariness01,
    competence01: carried.competence01,
    stops: carried.stops,
    intervalIdx: next,
  });
  const appetite = Number(appetite01);
  const bar = Number.isFinite(appetite) ? Math.max(0, Math.min(1, appetite)) : 0;
  // The career term folds in as a probabilistic OR, so the weighed risk is monotone in both
  // arms, never leaves 0..1, and is EXACTLY `dwellRisk01` when no carrier arrives (or when
  // the carrier reads 0) — which is what keeps the no-carrier path byte-identical to base.
  const weighed = carried01 === null ? dwellRisk01
    : round4(dwellRisk01 + (1 - dwellRisk01) * carried01);
  return weighed < bar
    ? { choice: 'gather', dwellRisk01: weighed, termsAbsent: absent, reason: 'risk_under_appetite' }
    : { choice: 'govern', dwellRisk01: weighed, termsAbsent: absent, reason: 'risk_over_appetite' };
}

/**
 * §3.9's CAPTOR ARM — how the court that caught him is disposed to treat him, in the SEAT
 * vocabulary its two built consumers already accept.
 *
 * ⭐ THIS SHIPS LIVE, NOT DARK. The volume tells an ES-2 implementer to ship this arm dark
 * "until the vocabulary unification lands"; CR-ES-3's retarget LANDED AT ES-0, so the gate
 * the ruling actually named is satisfied and the arm is built. The gate was the RETARGET,
 * never the ruling — and it is verified rather than assumed: `RANSOM_SEAT_LAWFULNESS` and
 * `RANSOM_SEAT_MORALITY` are the words below, and `captorRansomChoice` is the consumer.
 *
 * Returned as INPUT SHAPING rather than as a decision: the choice itself stays
 * `ransomChoices.captorRansomChoice`'s, because a second place that decides a captive's fate
 * is a second answer to one question.
 *
 * @param {{doctrine?: unknown}} args
 * @returns {{leniency: 'clean'|'ordinary'|'hard'|'swings', receipt: string}}
 */
export function captorLeniencyRead({ doctrine } = {}) {
  const read = recordOf(doctrine);
  if (read.known !== true) {
    return { leniency: 'ordinary', receipt: 'The captor court has no readable doctrine, so its caught guest is treated as any other.' };
  }
  const employment = text(read.employment);
  const method = text(read.method);
  const targeting = text(read.targeting);
  if (method === 'lawless') {
    return { leniency: 'swings', receipt: 'A lawless captor keeps no procedure for a caught spy: his fate swings with the week.' };
  }
  if (targeting === 'all_courts') {
    return { leniency: 'hard', receipt: 'A court that watches even its friends holds a caught watcher hard.' };
  }
  return employment === 'strict'
    ? { leniency: 'clean', receipt: 'A court that holds its own agents to account releases or ransoms a caught one cleanly.' }
    : { leniency: 'ordinary', receipt: 'The captor court treats a caught guest by its ordinary custom.' };
}

/**
 * THE STAGE. Every covert mission standing still somewhere is read once per pulse, and the
 * reading is HANDED BACK — see the header's measured stop-report. `openRansomClaims` is the
 * precedent in every particular: computed, receipted, provably reachable, and writing
 * nothing while its persistence shape is owner-gated.
 *
 * DORMANCY IS DOUBLE. The flag door refuses first (`espionageActive`), and past it a world
 * with no covert sub-records has nothing to walk — so the byte-identity claim rests on a
 * structural fact and not only on a gate.
 *
 * @param {{worldState?: unknown, tick?: unknown, snapshot?: unknown, regionalGraph?: unknown,
 *   insideAssetAt?: ((targetId: string, homeId: string) => boolean)|null,
 *   npcFor?: ((errand: Record<string, unknown>) => unknown)|null}} [args]
 * @returns {{detections: Array<Record<string, unknown>>, skipped: Array<Record<string, unknown>>}}
 */
export function advanceEspionageGauntlet({
  worldState,
  tick,
  snapshot = null,
  regionalGraph = null,
  insideAssetAt = null,
  npcFor = null,
} = {}) {
  /** @type {Array<Record<string, unknown>>} */
  const detections = [];
  /** @type {Array<Record<string, unknown>>} */
  const skipped = [];
  const now = wholeTick(tick);
  if (now == null || !espionageActive(worldState)) return { detections, skipped };
  const items = Array.isArray(recordOf(snapshot).settlements)
    ? /** @type {unknown[]} */ (recordOf(snapshot).settlements).map(recordOf)
    : [];
  const byId = new Map(items.map((item) => [text(item.id), item]));
  for (const raw of envoyErrandsOf(worldState)) {
    const errand = recordOf(raw);
    const dwell = covertDwellRead({ errand, tick: now });
    if (!dwell.dwelling) continue;
    const homeId = text(errand.from);
    const targetItem = byId.get(dwell.settlementId) || null;
    if (!targetItem) {
      // A stop the snapshot cannot produce is skipped rather than rolled from defaults: a
      // catch chance computed against a settlement nobody can name is an invention.
      skipped.push({ errandId: text(errand.id), stopId: dwell.settlementId, reason: 'unreadable_stop' });
      continue;
    }
    const factors = gauntletCatchFactors({
      worldState,
      regionalGraph,
      homeId,
      homeItem: byId.get(homeId) || null,
      targetItem,
      npc: typeof npcFor === 'function' ? npcFor(errand) : null,
      tick: now,
      dwell,
      hasInsideAsset: typeof insideAssetAt === 'function'
        ? insideAssetAt(dwell.settlementId, homeId) === true
        : false,
    });
    const roll = stayDetectionRoll({ errandId: errand.id, factors, dwell });
    detections.push({
      errandId: text(errand.id),
      npcId: text(errand.npcId),
      homeId,
      stopId: dwell.settlementId,
      stopIndex: dwell.stopIndex,
      intervalIdx: dwell.intervalIdx,
      rooted: dwell.rooted,
      hostRung: factors.hostRung,
      catch01: roll.catch01,
      roll01: roll.roll01,
      rollKey: roll.key,
      ramp: roll.ramp,
      caught: roll.caught,
      // ⛔ THE STOP-REPORT, ON EVERY ROW. A computed capture must never be mistaken for a
      // persisted one, so the fact travels with the record rather than living only in a doc.
      custodyWritten: false,
      custodyCause: COVERT_HOLD_CAUSE,
      custodyBlockedReason: 'encounter_required_by_errand_dto',
      // ES-5 — THE TELL'S RECEIPT. The count travels with the detection so a reader can see
      // WHY a town was watchful, not merely that it was: a term folded into one multiplier
      // and never reported is a term nobody can audit.
      wariness01: factors.wariness01,
      overdueNotables: factors.overdueNotables,
      warinessTermsAbsent: factors.warinessTermsAbsent,
    });
  }
  return { detections, skipped };
}
