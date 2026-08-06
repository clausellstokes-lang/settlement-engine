/**
 * espionageProductStage.js — ES-3: THE GRADIENT ACCRUES AND THE PRODUCTS LAND.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.4 (the standoff), §3.4b (the rooted re-sample), §3.6 (the
 * three products), §3.7 (the gradient and its two landing worlds), §3.14 (the grade). The
 * arithmetic lives in `espionageTap.js` and `espionageProducts.js`; this file is the walk.
 *
 * ⭐ THIS IS §1's ONE AMENDER. The covert sub-record has exactly one writer (SP-D's mint
 * leaf) and exactly one amender, and this is it: `gathered` and `standoff` are written HERE
 * and nowhere else, through the errand family's own `writeErrands` transaction, so the
 * ledger's single-writer law is honoured rather than worked around. A second amender would
 * be a second answer to "what did this mission learn", and the source scan in
 * tests/domain/espionageProducts.test.js reds one.
 *
 * ── THE TWO LANDING WORLDS, AND THE ONE ASYMMETRY THAT IS THE JEWEL ─────────────────────
 * MAGIC (the ES-0 pair gate TRUE at home AND at the stop): the read is SENT at the moment
 *   it is taken. The partial is stamped `sentHome` and the product lands that tick. A
 *   capture afterwards loses the SPY, not the intel.
 * MUNDANE: nothing leaves the agent's head until `markEnvoyHome`. The whole gradient folds
 *   at the home mouth, and a capture on the road loses the man AND everything he gathered.
 * `landableGatherings` states that asymmetry ONCE, and both arms are executed.
 *
 * ── ⚠ JUDGMENT J-ES3-A (vetoable): THE MUNDANE FOLD RE-READS AT THE LANDING TICK ────────
 * A gathered partial carries the five fields §1 signed off — subject, cap, tap, tick and
 * the sent mark — and NOT the observed values. That is the canonical model's choice, not
 * this wave's: the gradient is a FIDELITY record. So the mundane fold reconstructs what the
 * agent reports by reading the same sources again at the home tick, carrying the accuracy
 * cap he earned at the stop. What this costs is stated rather than hidden: where a slow
 * fact moved while he walked, the court writes the NEWER value at the OLDER fidelity. For
 * the legs this program exists to fill — a town's size, its granary, its place on the roads
 * — that drift is small, and the alternative (persisting observed values on every partial)
 * is a new key family per leg, which §1's zero-new-keys fight forbids. Say "veto" to
 * persist the values; the cost is the canonical model reopened.
 *
 * ── ⚠ A DECLARED RESIDUAL, NOT A SILENT ONE: THE STANDOFF MARKS, IT DOES NOT REROUTE ────
 * §3.4's standoff has two consequences: the mission plateaus INFORMATIONALLY (it never taps
 * deeper than `performance`) and it never physically enters the target. This wave lands the
 * first, which is the one §3.7 makes arithmetic — the mark is written, `tapLevelFor` reads
 * it, and every later read at every later stop caps at the performance rung. The routing
 * consequence needs the errand's route plan re-solved mid-journey, which is the transit
 * seam's business and not an information wave's. Recorded here so it is owed, not lost.
 *
 * ── ⚠ A SECOND DECLARED RESIDUAL: THE SOFT BOUND ON A ROOTED STAY IS STILL UNWIRED ─────
 * §3.4b's `gatherOrGovernRead` was built at ES-2 and STILL HAS NO CALLER. This stage accrues
 * a re-sample every dwell interval and stops only at the DTO's hard cap or when the leg
 * schedule moves the traveller on — the SOFT bound (a spy weighing the climbing odds against
 * his own nerve) is not consulted, because consulting it without also RE-TIMING his departure
 * would let him refuse a risk and then stand in it anyway, which reads worse than not asking.
 * The re-timing is route surgery on a live journey, the same class as the standoff's reroute
 * above. Recorded here so it is owed, not lost: ES-2's read is a dark instrument and this is
 * the wave that could have wired it and deliberately did not.
 *
 * ── WHAT IS DECLARED ABSENT (the SP-C idiom) ────────────────────────────────────────────
 * `desperation01` (into `perfPoison01`) and `homeDesperation01` (into the standoff bar) are
 * DECLARED ABSENT rather than folded as a silent zero. The estate's one desperation read is
 * computed inside `processLies` from believed strength bands and is not exported; minting a
 * second spelling is what J-WR-10 forbids. Every gathering receipt names them, exactly as
 * ES-2's detections name `overdueForeignNotables`.
 *
 * PURE apart from the two writes it owns: no Date, no Math.random, no React, no I/O. The
 * whole layer's stochastic surface is the gauntlet's keyed hash (L1) and none of it is here.
 *
 * @enforced-by tests/domain/espionageProducts.test.js,
 *   tests/property/espionageProductsDormancyFence.test.js
 */
import { getSpatialLedger } from '../../spatial/distanceRead.js';
import { relationshipTypeBetween } from '../../roads/embassyHazard.js';
import { beliefRecord } from '../beliefMap.js';
import { conditionsGroundTruth } from '../beliefAxisSubjects.js';
import { subjectAxesActive } from '../beliefAxes.js';
import { envoyErrandsOf } from '../envoyErrandRecords.js';
import { errandIndex, writeErrands } from '../envoyErrandLedger.js';
import { magicWorksAt } from '../magicWorksAt.js';
import { settlementAlignment } from '../settlementAlignment.js';
import { espionageActive } from './espionageGate.js';
import {
  GAUNTLET_TUNING,
  covertDwellRead,
  gauntletCatchFactors,
} from './espionageGauntlet.js';
import { catchChance01 } from './espionageMath.js';
import {
  accuracyCapFor,
  hostileRung01,
  perfPoison01,
  recordStaleness01,
  standoffRead,
  tapLevelFor,
  tapReceiptFor,
} from './espionageTap.js';
import {
  buildProductReport,
  freshMissionGradeFor,
  gatheringAnchorTick,
  landEspionageProduct,
  landableGatherings,
  observedReadAt,
  productGroundTruth,
} from './espionageProducts.js';

/** The two terms this wave folds without an input, named on every receipt. */
const DESPERATION_ABSENT = Object.freeze(['desperation01']);

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

/** @param {unknown} value @param {number} fallback @returns {number} */
function num(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** @param {unknown} value @returns {number} */
function round4(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 10000) / 10000 : 0;
}

/**
 * §3.7 — THE HOST'S LIVE LIE ABOUT THE SUBJECT, if it holds one. Read from the disinfo
 * ledger by (liar, subject); the audience is deliberately NOT matched, because a court that
 * is telling ANYBODY this story is a court whose markets tell it.
 *
 * @param {{worldState?: unknown, hostId?: unknown, subjectId?: unknown}} args
 * @returns {Record<string, unknown>|null}
 */
export function hostLieAbout({ worldState, hostId, subjectId } = {}) {
  const host = text(hostId);
  const subject = text(subjectId);
  if (!host || !subject) return null;
  const ledger = recordOf(getSpatialLedger(
    /** @type {Parameters<typeof getSpatialLedger>[0]} */ (worldState), 'disinfo',
  ));
  for (const key of Object.keys(ledger).sort()) {
    const row = recordOf(ledger[key]);
    if (text(row.liarId) === host && text(row.subjectId) === subject) return row;
  }
  return null;
}

/**
 * §3.4 — THE APPROACH'S OWN HOSTILITY, from the stop after this one to the end of the
 * itinerary. THE CLUSTER, NOT JUST THE GATE: a target reached through two cold-war
 * neighbours is a different journey from the same target reached through friends, and the
 * volume's word for that is the whole reason this is not simply the gate's rung.
 *
 * Zero when nothing remains — a mission at its last stop has no approach left to assess,
 * which makes `assessedRisk` zero and the standoff impossible. That is correct: there is
 * nothing left to stand off from.
 *
 * @param {{worldState?: unknown, regionalGraph?: unknown, homeId?: unknown,
 *   itinerary?: unknown, fromIndex?: unknown}} args
 * @returns {number} 0..1
 */
export function approachHostility01({
  worldState, regionalGraph, homeId, itinerary, fromIndex,
} = {}) {
  const stops = (Array.isArray(itinerary) ? itinerary : []).map(recordOf);
  const start = Math.max(0, Math.trunc(Number(fromIndex) || 0));
  const ahead = stops.slice(start);
  if (!ahead.length) return 0;
  let sum = 0;
  for (const stop of ahead) {
    sum += hostileRung01(relationshipTypeBetween(
      recordOf(regionalGraph), recordOf(worldState), text(homeId), text(stop.settlementId),
    ));
  }
  return round4(sum / ahead.length);
}

/**
 * §3.4 — REACH OR STAND OFF, priced against the NEXT stop rather than this one.
 *
 * The catch chance is the one the gauntlet's own arithmetic would roll at the stop ahead,
 * built from the SAME factor gatherer, at dwell interval 0 — deciding on the risk he is
 * already inside would let a man refuse a gate he has already walked through.
 *
 * ⚠ THE INTEGRITY AXIS IS GATHERED HERE, NOT PASSED IN, AND THAT IS THE FIX FOR A DEAD ARM.
 * An earlier spelling of this function took `poison01` as a parameter and its ONE production
 * caller passed 0 — so addition H's third axis was live in the pure leaf, pinned in the
 * battery, and STRUCTURALLY DEAD in the world. The poison of THE STOP HE IS STANDING AT is
 * the right quantity (what he would keep hearing if he stayed outside), and it is measured
 * from that host's own alignment toward home rather than handed in.
 *
 * @param {{worldState?: unknown, snapshotById?: unknown, regionalGraph?: unknown,
 *   homeId?: unknown, homeItem?: unknown, hostItem?: unknown, npc?: unknown,
 *   itinerary?: unknown, stopIndex?: unknown, tick?: unknown, hostId?: unknown}} args
 * @returns {{standoff: boolean, assessedRisk: number, bar: number, receipt: string,
 *   nextStopId: string, poison01: number, termsAbsent: ReadonlyArray<string>}}
 */
export function standoffDecisionFor({
  worldState, snapshotById, regionalGraph, homeId, homeItem, hostItem, hostId, npc, itinerary,
  stopIndex, tick,
} = {}) {
  const stops = (Array.isArray(itinerary) ? itinerary : []).map(recordOf);
  const nextIndex = Math.max(0, Math.trunc(Number(stopIndex) || 0));
  const next = stops[nextIndex] || null;
  const byId = snapshotById instanceof Map ? snapshotById : new Map();
  const nextStopId = next ? text(next.settlementId) : '';
  const nextItem = nextStopId ? byId.get(nextStopId) || null : null;
  const catch01 = nextItem
    ? catchChance01(gauntletCatchFactors({
      worldState,
      regionalGraph,
      homeId: text(homeId),
      homeItem,
      targetItem: nextItem,
      npc,
      tick,
      dwell: { settlementId: nextStopId, stopIndex: nextIndex + 1, intervalIdx: 0 },
    }))
    : 0;
  const alignment = settlementAlignment(
    /** @type {Parameters<typeof settlementAlignment>[0]} */ (hostItem),
    /** @type {Parameters<typeof settlementAlignment>[1]} */ (worldState),
  );
  const poison01 = perfPoison01({
    malice01: alignment.malice01,
    lawfulness01: alignment.lawfulness01,
    // DECLARED ABSENT, not folded silently — see the file header.
    desperation01: 0,
    relationship: relationshipTypeBetween(
      recordOf(regionalGraph), recordOf(worldState), text(homeId), text(hostId),
    ),
  });
  const read = standoffRead({
    catch01,
    clusterHostility01: approachHostility01({
      worldState, regionalGraph, homeId, itinerary, fromIndex: nextIndex,
    }),
    npc,
    // DECLARED ABSENT, not folded silently — see the file header.
    homeDesperation01: 0,
    poison01,
  });
  return { ...read, nextStopId, poison01, termsAbsent: DESPERATION_ABSENT };
}

/**
 * §3.7 — ONE READ AT ONE STOP: the tap, the cap, and what the agent actually heard.
 *
 * Returns null for the honesty negative (a waypoint host holding no belief about the
 * subject yields nothing) so the caller appends no partial rather than a zero-fidelity one.
 *
 * @param {{worldState?: unknown, regionalGraph?: unknown, homeId?: unknown,
 *   hostId?: unknown, hostItem?: unknown, subjectId?: unknown, face?: unknown,
 *   standoff?: unknown, hasInsideAsset?: unknown, tick?: unknown,
 *   conditionsLit?: unknown}} args
 * @returns {{tap: string, accuracyCap01: number, read: Record<string, unknown>,
 *   poison01: number, isTarget: boolean, receipt: string,
 *   termsAbsent: ReadonlyArray<string>}|null}
 */
export function stopReadFor({
  worldState, regionalGraph, homeId, hostId, hostItem, subjectId, face, standoff,
  hasInsideAsset, tick, conditionsLit,
} = {}) {
  const host = text(hostId);
  const subject = text(subjectId);
  const isTarget = host === subject && !!host;
  const tap = tapLevelFor({ face, standoff, hasInsideAsset });
  const relationship = relationshipTypeBetween(
    recordOf(regionalGraph), recordOf(worldState), text(homeId), host,
  );
  const alignment = settlementAlignment(
    /** @type {Parameters<typeof settlementAlignment>[0]} */ (hostItem),
    /** @type {Parameters<typeof settlementAlignment>[1]} */ (worldState),
  );
  const poison01 = perfPoison01({
    malice01: alignment.malice01,
    lawfulness01: alignment.lawfulness01,
    // DECLARED ABSENT — see the header. The term is live through malice and restraint.
    desperation01: 0,
    relationship,
  });
  const settlement = recordOf(recordOf(hostItem).settlement);
  const read = observedReadAt({
    tap,
    isTarget,
    hostRecord: isTarget ? null : beliefRecord(
      /** @type {Parameters<typeof beliefRecord>[0]} */ (worldState), host, subject,
    ),
    hostLie: isTarget ? null : hostLieAbout({ worldState, hostId: host, subjectId: subject }),
    targetFacts: isTarget
      ? {
        allianceLabel: relationship,
        // THE FAITH SLOT IS DELIBERATELY NOT READ HERE. `groundTruthFaith` is
        // beliefMap-private, and re-spelling a truth-side faith read in this file would
        // mint the second spelling J-WR-10 forbids. A faith correction reaches this
        // program through a HOST's belief row, which already carries `faithLabel`.
        ...(conditionsLit === true
          ? { conditionsBands: conditionsGroundTruth(settlement) || {} }
          : {}),
      }
      : null,
  });
  if (!read) return null;
  const accuracyCap01 = accuracyCapFor({
    tap,
    isTarget,
    hostConfidence01: read.hostConfidence01,
    staleness01: isTarget ? 1 : recordStaleness01(read.hostUpdatedTick, tick),
    poison01,
  });
  return {
    tap,
    accuracyCap01: round4(accuracyCap01),
    read: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (read)),
    poison01,
    isTarget,
    receipt: tapReceiptFor(tap, recordOf(hostItem).name || host),
    termsAbsent: DESPERATION_ABSENT,
  };
}

/**
 * THE ONE AMENDER'S WRITE. Replaces one errand row's covert sub-record through the errand
 * family's own transaction, so `normalizeEnvoyErrands` bounds, de-duplicates and sorts both
 * sides and a no-op returns the caller's own world BY REFERENCE.
 *
 * @param {{worldState?: unknown, errandId?: unknown, covert?: unknown}} args
 * @returns {{worldState: unknown, changed: boolean}}
 */
function amendCovert({ worldState, errandId, covert } = {}) {
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, text(errandId));
  if (index < 0) return { worldState, changed: false };
  const next = [...errands];
  next[index] = { ...recordOf(errands[index]), covert };
  const nextWorldState = writeErrands(worldState, next);
  return { worldState: nextWorldState, changed: nextWorldState !== worldState };
}

/**
 * @typedef {Object} MissionWalk
 * @property {Record<string, unknown>} errand    the ledger row, as the ledger holds it
 * @property {Record<string, unknown>} mission   its covert sub-record
 * @property {Array<Record<string, unknown>>} itinerary
 * @property {string} errandId
 * @property {string} homeId
 * @property {string} subjectId
 * @property {string} sourceId  the agent's composite credibility address
 * @property {unknown} homeItem
 * @property {unknown} npc
 */

/**
 * @typedef {Object} StageContext
 * @property {number} now
 * @property {unknown} regionalGraph
 * @property {Map<string, Record<string, unknown>>} byId
 * @property {Set<string>} caught
 * @property {boolean} conditionsLit
 * @property {((targetId: string, homeId: string) => boolean)|null} insideAssetAt
 * @property {((sourceId: string) => number)|null} credibilityOf
 */

/**
 * §3.7 ARM (A) — THE READ AT A STOP, and the magic send that may follow it.
 *
 * Returns the new world plus the two receipt rows the stage hands back. A stop that cannot
 * be read yields a SKIP with its reason rather than a silent nothing: the difference
 * between "no mission was standing there" and "the host holds no belief" is the difference
 * between a stage that ran and a stage that could not.
 *
 * @param {unknown} worldState @param {MissionWalk} walk @param {StageContext} ctx
 * @returns {{worldState: unknown, changed: boolean,
 *   gatherings: Array<Record<string, unknown>>, landings: Array<Record<string, unknown>>,
 *   skipped: Array<Record<string, unknown>>}}
 */
function gatherArm(worldState, walk, ctx) {
  const empty = { worldState, changed: false, gatherings: [], landings: [], skipped: [] };
  const dwell = covertDwellRead({ errand: walk.errand, tick: ctx.now });
  if (!dwell.dwelling) return empty;
  const hostItem = ctx.byId.get(dwell.settlementId) || null;
  const skip = (/** @type {string} */ reason) => ({
    ...empty,
    skipped: [{ errandId: walk.errandId, stopId: dwell.settlementId, reason }],
  });
  // A stop the snapshot cannot produce is skipped rather than read from defaults: a read
  // composed against a settlement nobody can name is an invention.
  if (!hostItem) return skip('unreadable_stop');
  const anchor = gatheringAnchorTick({
    arrivalTick: dwell.arrivalTick,
    plannedStayTicks: dwell.plannedStayTicks,
    intervalIdx: dwell.intervalIdx,
    intervalTicks: GAUNTLET_TUNING.DWELL_INTERVAL_TICKS,
  });
  const gathered = Array.isArray(walk.mission.gathered) ? walk.mission.gathered.map(recordOf) : [];
  if (gathered.some((row) => row.subjectId === walk.subjectId && Number(row.atTick) === anchor)) {
    return skip('interval_already_read');
  }
  const stop = walk.itinerary.find((entry) => text(entry.settlementId) === dwell.settlementId)
    || {};
  // The standoff is decided BEFORE the read, so the mark caps this stop's own read too —
  // addition H's ruling that every standoff read is `performance`.
  const standoff = standoffMarkFor(worldState, walk, ctx, dwell);
  const stopRead = stopReadFor({
    worldState,
    regionalGraph: ctx.regionalGraph,
    homeId: walk.homeId,
    hostId: dwell.settlementId,
    hostItem,
    subjectId: walk.subjectId,
    face: stop.face,
    standoff: standoff.mark,
    hasInsideAsset: typeof ctx.insideAssetAt === 'function'
      ? ctx.insideAssetAt(dwell.settlementId, walk.homeId) === true
      : false,
    tick: ctx.now,
    conditionsLit: ctx.conditionsLit,
  });
  // THE HONESTY NEGATIVE: a host with no belief about the subject yields nothing at all.
  if (!stopRead) return skip('host_holds_no_belief');
  const magic = magicWorksAt(
    /** @type {Parameters<typeof magicWorksAt>[0]} */ (walk.homeItem),
  ) && magicWorksAt(/** @type {Parameters<typeof magicWorksAt>[0]} */ (hostItem));
  const partial = {
    accuracyCap01: stopRead.accuracyCap01,
    atTick: anchor,
    subjectId: walk.subjectId,
    tap: stopRead.tap,
    ...(magic ? { sentHome: /** @type {true} */ (true) } : {}),
  };
  const amended = amendCovert({
    worldState,
    errandId: walk.errandId,
    covert: {
      ...walk.mission,
      gathered: [...gathered, partial],
      ...(standoff.mark ? { standoff: /** @type {true} */ (true) } : {}),
    },
  });
  const gathering = {
    errandId: walk.errandId,
    stopId: dwell.settlementId,
    stopIndex: dwell.stopIndex,
    intervalIdx: dwell.intervalIdx,
    subjectId: walk.subjectId,
    tap: stopRead.tap,
    accuracyCap01: stopRead.accuracyCap01,
    atTick: anchor,
    isTarget: stopRead.isTarget,
    poison01: stopRead.poison01,
    sentHome: magic,
    written: amended.changed,
    receipt: stopRead.receipt,
    termsAbsent: stopRead.termsAbsent,
    ...(standoff.receipt ? { standoff: standoff.receipt } : {}),
  };
  if (!magic) {
    return {
      worldState: amended.worldState,
      changed: amended.changed,
      gatherings: [gathering],
      landings: [],
      skipped: [],
    };
  }
  const landed = landOne({
    worldState: amended.worldState,
    errand: walk.errand,
    mission: walk.mission,
    partials: [partial],
    read: stopRead.read,
    homeId: walk.homeId,
    subjectId: walk.subjectId,
    sourceId: walk.sourceId,
    tick: ctx.now,
    conditionsLit: ctx.conditionsLit,
    credibilityOf: ctx.credibilityOf,
    world: 'magic',
    // A send is a COMPLETE telling of the one read it carries; the mission's other stops
    // are other tellings on other ticks, with the estate's own silence decay between them.
    coverage01: 1,
  });
  return {
    worldState: landed.worldState,
    changed: amended.changed || landed.changed,
    gatherings: [gathering],
    landings: [landed.receipt],
    skipped: [],
  };
}

/**
 * §3.4 — THE STANDOFF MARK, decided once per mission and never re-decided. A mission that
 * already carries the mark keeps it; a ROOTED stay is past the decision; and the last stop
 * has no approach left to stand off from.
 *
 * @param {unknown} worldState @param {MissionWalk} walk @param {StageContext} ctx
 * @param {{rooted: boolean, stopIndex: number, settlementId: string}} dwell
 * @returns {{mark: boolean, receipt: Record<string, unknown>|null}}
 */
function standoffMarkFor(worldState, walk, ctx, dwell) {
  if (walk.mission.standoff === true) return { mark: true, receipt: null };
  if (dwell.rooted || dwell.stopIndex >= walk.itinerary.length) return { mark: false, receipt: null };
  const decision = standoffDecisionFor({
    worldState,
    snapshotById: ctx.byId,
    regionalGraph: ctx.regionalGraph,
    homeId: walk.homeId,
    homeItem: walk.homeItem,
    hostId: dwell.settlementId,
    hostItem: ctx.byId.get(dwell.settlementId) || null,
    npc: walk.npc,
    itinerary: walk.itinerary,
    stopIndex: dwell.stopIndex,
    tick: ctx.now,
  });
  if (!decision.standoff) return { mark: false, receipt: null };
  return {
    mark: true,
    receipt: {
      nextStopId: decision.nextStopId,
      assessedRisk: decision.assessedRisk,
      bar: decision.bar,
      poison01: decision.poison01,
      receipt: decision.receipt,
      termsAbsent: decision.termsAbsent,
    },
  };
}

/**
 * §3.7 ARM (B) — THE HOME MOUTH. A mundane mission's whole gradient folds here, and a
 * captured one's dies here.
 *
 * Fires ONLY on the tick the row came home, which is what makes it exactly-once with no new
 * state: `markEnvoyHome` moves a row to `home` once and never back.
 *
 * @param {unknown} worldState @param {MissionWalk} walk @param {StageContext} ctx
 * @returns {{worldState: unknown, changed: boolean,
 *   landings: Array<Record<string, unknown>>, skipped: Array<Record<string, unknown>>}}
 */
function homeMouthArm(worldState, walk, ctx) {
  const empty = { worldState, changed: false, landings: [], skipped: [] };
  if (walk.errand.state !== 'home' || Number(walk.errand.homeTick) !== ctx.now) return empty;
  // The row is re-read from the CURRENT world because arm (A) may have appended to it on
  // this same tick — a mission that reached home the tick it took its last read.
  const current = envoyErrandsOf(worldState)
    .map(recordOf)
    .find((row) => text(row.id) === walk.errandId) || {};
  const mission = recordOf(current.covert);
  const gathered = Array.isArray(mission.gathered) ? mission.gathered.map(recordOf) : [];
  const lastStop = walk.itinerary[walk.itinerary.length - 1] || {};
  const lastStopId = text(lastStop.settlementId);
  const hostItem = ctx.byId.get(lastStopId) || null;
  const fold = landableGatherings({
    gathered,
    captured: ctx.caught.has(walk.errandId),
    magic: magicWorksAt(/** @type {Parameters<typeof magicWorksAt>[0]} */ (walk.homeItem))
      && magicWorksAt(/** @type {Parameters<typeof magicWorksAt>[0]} */ (hostItem)),
  });
  // Everything a magic world already sent is landed; folding it again would charge the same
  // telling twice.
  const unsent = fold.landable.filter((row) => row.sentHome !== true);
  const skip = (/** @type {string} */ reason) => ({
    ...empty,
    skipped: [{ errandId: walk.errandId, reason, lost: fold.lost.length }],
  });
  if (!unsent.length) return skip(`home_${fold.reason}`);
  const stopRead = hostItem
    ? stopReadFor({
      worldState,
      regionalGraph: ctx.regionalGraph,
      homeId: walk.homeId,
      hostId: lastStopId,
      hostItem,
      subjectId: walk.subjectId,
      face: lastStop.face,
      standoff: mission.standoff,
      hasInsideAsset: false,
      tick: ctx.now,
      conditionsLit: ctx.conditionsLit,
    })
    : null;
  if (!stopRead) return skip('home_read_unavailable');
  const landed = landOne({
    worldState,
    errand: walk.errand,
    mission,
    partials: unsent,
    read: stopRead.read,
    homeId: walk.homeId,
    subjectId: walk.subjectId,
    sourceId: walk.sourceId,
    tick: ctx.now,
    conditionsLit: ctx.conditionsLit,
    credibilityOf: ctx.credibilityOf,
    world: 'mundane',
    coverage01: gathered.length ? unsent.length / gathered.length : 1,
  });
  return {
    worldState: landed.worldState,
    changed: landed.changed,
    landings: [{ ...landed.receipt, lost: fold.lost.length, foldReason: fold.reason }],
    skipped: [],
  };
}

/**
 * THE STAGE. Every covert mission is looked at once per pulse and asked two questions: is
 * there a read to take here, and is there anything to land.
 *
 * DORMANCY IS DOUBLE, exactly as ES-2's is. The flag door refuses first
 * (`espionageActive`), and past it a world with no covert sub-records has nothing to walk —
 * so byte-identity rests on a structural fact and not only on a gate.
 *
 * @param {{worldState?: unknown, tick?: unknown, snapshot?: unknown,
 *   regionalGraph?: unknown, detections?: unknown,
 *   insideAssetAt?: ((targetId: string, homeId: string) => boolean)|null,
 *   npcFor?: ((errand: Record<string, unknown>) => unknown)|null,
 *   credibilityOf?: ((sourceId: string) => number)|null}} [args]
 * @returns {{worldState: unknown, changed: boolean,
 *   gatherings: Array<Record<string, unknown>>, landings: Array<Record<string, unknown>>,
 *   skipped: Array<Record<string, unknown>>}}
 */
export function advanceEspionageProducts({
  worldState,
  tick,
  snapshot = null,
  regionalGraph = null,
  detections = [],
  insideAssetAt = null,
  npcFor = null,
  credibilityOf = null,
} = {}) {
  /** @type {Array<Record<string, unknown>>} */
  const gatherings = [];
  /** @type {Array<Record<string, unknown>>} */
  const landings = [];
  /** @type {Array<Record<string, unknown>>} */
  const skipped = [];
  const now = Number.isInteger(tick) && Number(tick) >= 0 ? Number(tick) : null;
  if (now == null || !espionageActive(worldState)) {
    return { worldState, changed: false, gatherings, landings, skipped };
  }
  const gates = subjectAxesActive(
    /** @type {Parameters<typeof subjectAxesActive>[0]} */ (worldState),
  );
  const items = (Array.isArray(recordOf(snapshot).settlements)
    ? /** @type {unknown[]} */ (recordOf(snapshot).settlements)
    : []).map(recordOf);
  /** @type {StageContext} */
  const ctx = {
    now,
    regionalGraph,
    byId: new Map(items.map((item) => [text(item.id), item])),
    caught: new Set((Array.isArray(detections) ? detections : [])
      .map(recordOf)
      .filter((row) => row.caught === true)
      .map((row) => text(row.errandId))),
    conditionsLit: gates?.conditions === true,
    insideAssetAt,
    credibilityOf,
  };
  let state = worldState;
  let changed = false;
  for (const raw of envoyErrandsOf(worldState)) {
    const errand = recordOf(raw);
    const mission = recordOf(errand.covert);
    const itinerary = Array.isArray(mission.itinerary) ? mission.itinerary.map(recordOf) : [];
    // THE COVERT TEST IS THE SUB-RECORD, exactly as the gauntlet reads it: `errandSpineBlock`
    // writes `covert` only onto a row whose RESOLVED class is covert.
    if (!itinerary.length) continue;
    const homeId = text(errand.from);
    /** @type {MissionWalk} */
    const walk = {
      errand,
      mission,
      itinerary,
      errandId: text(errand.id),
      homeId,
      subjectId: text(mission.subjectId),
      sourceId: text(errand.npcId) ? `${homeId}#${text(errand.npcId)}` : homeId,
      homeItem: ctx.byId.get(homeId) || null,
      npc: typeof npcFor === 'function' ? npcFor(errand) : null,
    };
    const gatherStep = gatherArm(state, walk, ctx);
    state = gatherStep.worldState;
    changed = changed || gatherStep.changed;
    gatherings.push(...gatherStep.gatherings);
    landings.push(...gatherStep.landings);
    skipped.push(...gatherStep.skipped);

    const homeStep = homeMouthArm(state, walk, ctx);
    state = homeStep.worldState;
    changed = changed || homeStep.changed;
    landings.push(...homeStep.landings);
    skipped.push(...homeStep.skipped);
  }
  return { worldState: state, changed, gatherings, landings, skipped };
}

/**
 * §3.6 + §3.14 — ONE PRODUCT LANDED AND GRADED. Shared by both worlds so the magic send and
 * the home fold cannot drift into two answers about what a product is.
 *
 * @param {{worldState?: unknown, errand?: unknown, mission?: unknown, partials?: unknown,
 *   read?: unknown, homeId?: unknown, subjectId?: unknown, sourceId?: unknown,
 *   tick?: unknown, conditionsLit?: unknown, world?: unknown, coverage01?: unknown,
 *   credibilityOf?: ((sourceId: string) => number)|null}} args
 * @returns {{worldState: unknown, changed: boolean, receipt: Record<string, unknown>}}
 */
function landOne({
  worldState, errand, mission, partials, read, homeId, subjectId, sourceId, tick,
  conditionsLit, world, coverage01 = 1, credibilityOf = null,
} = {}) {
  const row = recordOf(mission);
  const rows = (Array.isArray(partials) ? partials : []).map(recordOf);
  const product = text(row.product);
  const errandId = text(recordOf(errand).id);
  const prior = beliefRecord(
    /** @type {Parameters<typeof beliefRecord>[0]} */ (worldState), text(homeId), text(subjectId),
  );
  const composed = productGroundTruth({
    product,
    prior,
    read,
    legRefs: row.legRefs,
    conditionsLit,
  });
  if (composed.refusal) {
    // A CONFIRM with nothing to confirm, or a REFUTE with nothing to contradict. The
    // mission still happened and is still graded — `empty`, because it answered nothing —
    // but no belief is materialized out of a court's ignorance.
    return {
      worldState,
      changed: false,
      receipt: {
        errandId,
        product,
        world: text(world),
        subjectId: text(subjectId),
        observerId: text(homeId),
        partials: rows.length,
        crossed: [],
        legsFilled: [],
        legsUnfilled: composed.legsUnfilled,
        familiesAbsent: Object.freeze([]),
        grade: 'empty',
        gradeCapped: false,
        confidence01: null,
        changed: false,
        reason: composed.refusal,
      },
    };
  }
  // ⚠⚠ ONE MAN'S N LOOKS ARE ONE TELLING, NOT N TELLINGS — and this is the single most
  // load-bearing line in the fold. `aggregateReports` SUMS weight across the reports it is
  // handed, and `INDEP_BASE + INDEP_PER x independentSources` exists precisely so that five
  // echoes of one origin count as one. Handing it one report per gathered partial would
  // have let a rooted spy who lingered nine intervals arrive home carrying nine independent
  // witnesses' worth of certainty — the echo chamber, re-opened inside the layer whose
  // whole subject is who knows what. So the gradient folds to ONE report:
  //   ACCURACY is the BEST cap achieved (the clearest look he got — the same MAXIMUM rule
  //     `beliefAxisSubjects.bestFidelity` gives for exactly this reason: one clear-eyed
  //     witness is what changes a court's mind).
  //   COMPLETENESS is COVERAGE — the share of what he gathered that actually came home. A
  //     captured magic mission that kept one partial of five tells a fifth of a story.
  const best = rows.reduce((top, partial) => Math.max(top, num(partial.accuracyCap01, 0)), 0);
  const reports = [buildProductReport({
    product,
    errandId,
    sourceId,
    accuracy01: best,
    completeness01: num(coverage01, 1),
  })];
  const landed = landEspionageProduct({
    worldState,
    observerId: homeId,
    subjectId,
    groundTruth: composed.groundTruth,
    reports,
    tick,
    credibilityOf,
  });
  const grade = freshMissionGradeFor({
    demand: row.demand,
    landedConfidence01: recordOf(landed.record).confidence01,
    legsUnfilled: composed.legsUnfilled,
  });
  return {
    worldState: landed.worldState,
    changed: landed.changed,
    receipt: {
      errandId,
      product,
      world: text(world),
      subjectId: text(subjectId),
      observerId: text(homeId),
      partials: rows.length,
      accuracy01: reports[0].accuracy01,
      completeness01: reports[0].completeness01,
      crossed: composed.crossed,
      legsFilled: composed.legsFilled,
      // ⛔ STOP-ES3-1 travels with the receipt: a leg the belief substrate has no slot for
      // is named on every product rather than dropped, and it caps the grade below.
      legsUnfilled: composed.legsUnfilled,
      familiesAbsent: landed.familiesAbsent,
      grade: grade.grade,
      gradeCapped: grade.capped,
      confidence01: recordOf(landed.record).confidence01 ?? null,
      changed: landed.changed,
      reason: landed.reason,
    },
  };
}
