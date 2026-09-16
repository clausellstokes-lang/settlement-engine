/**
 * envoyErrand/transit — the envoy family's ONE contact point with named-person physics.
 *
 * A PURE LEAF OF THE ENVOY-ERRAND WRITER FAMILY (ruling R-BLD-4). Every place the errand
 * lifecycle touches the shared transit kernel now lives here and nowhere else:
 *
 *   THE INJECTED PLAN — `normalizeRoutePlan` proves a caller-supplied journey is
 *     contiguous, correctly directed, and no faster than the shared leg law allows. No
 *     route is SOLVED here; the transit owner prices it and this leaf refuses it if the
 *     price is impossible.
 *   THE SCHEDULED CURSOR — `scheduledEnvoyPosition` reads where a traveller stands at one
 *     cut by evaluating the shared leg law ONCE, so a boundary arrival cannot also hop
 *     onto a later leg.
 *
 * WHY THE SEAM IS ONE FILE (WR-7a law M). `NAMED_PERSON_TRANSIT_TUNING.MIN_LEG_TICKS` and
 * `namedPersonLegPosition` are the two spellings by which envoy travel could acquire a
 * SECOND speed floor or a second position fraction. Collecting them here makes the family
 * head a declared DELEGATE in the movement-site manifest: the head can no longer grow a
 * local clock fraction, because it no longer imports the kernel that would make one look
 * legitimate.
 *
 * K3 (NOBODY IS EVER CURRENT): this leaf reaches the vocabulary and the transit kernel and
 * nothing else. Neither can hand it a settlement, a strength, or a stock.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/lint/namedPersonTransitTotality.walker.test.js
 *   + tests/domain/envoyK3BeliefSeam.test.js
 */
import {
  NAMED_PERSON_TRANSIT_TUNING,
  namedPersonLegPosition,
} from './namedPersonTransit.js';
import {
  JOURNEY_SET,
  POSITION_BAND_SET,
  asObject,
  hasExactKeys,
  strictText,
  text,
  wholeTick,
} from './envoyErrandVocabulary.js';

export function normalizeHistoricalPosition(raw, forcedJourney) {
  const row = asObject(raw);
  if (!hasExactKeys(row, ['journey', 'legIndex', 'fromId', 'toId', 'progressBand'])) return null;
  const journey = strictText(row.journey);
  const legIndex = wholeTick(row.legIndex);
  const fromId = strictText(row.fromId);
  const toId = strictText(row.toId);
  const progressBand = strictText(row.progressBand);
  if (journey !== forcedJourney || !JOURNEY_SET.has(journey) || legIndex == null
    || !fromId || !toId || fromId === toId || !POSITION_BAND_SET.has(progressBand)) return null;
  return { journey, legIndex, fromId, toId, progressBand };
}

/** A route reference requires truthful identity; its authored name is optional. */
export function normalizeRouteRef(raw) {
  const row = asObject(raw);
  const id = text(row.id);
  const name = text(row.name);
  return id ? { id, ...(name ? { name } : {}) } : null;
}

/** @param {unknown} raw @param {'outbound'|'return'|null} [forcedJourney] @param {unknown} [fallbackRouteRef] */
export function normalizeLeg(raw, forcedJourney = null, fallbackRouteRef = null) {
  const row = asObject(raw);
  const fromId = text(row.fromId);
  const toId = text(row.toId);
  const departTick = wholeTick(row.departTick);
  const arrivalTick = wholeTick(row.arrivalTick);
  const journey = forcedJourney || text(row.journey);
  if (!fromId || !toId || fromId === toId || departTick == null || arrivalTick == null
    || arrivalTick < departTick + NAMED_PERSON_TRANSIT_TUNING.MIN_LEG_TICKS
    || !JOURNEY_SET.has(journey)) return null;
  const routeRef = normalizeRouteRef(row.routeRef) || normalizeRouteRef(fallbackRouteRef);
  return {
    fromId,
    toId,
    departTick,
    arrivalTick,
    journey,
    ...(routeRef ? { routeRef } : {}),
  };
}

/** @param {unknown} raw @param {ReadonlyArray<Record<string, unknown>>} legs @param {string|null} [forcedJourney] */
export function normalizePositionRef(raw, legs, forcedJourney = null) {
  const row = asObject(raw);
  const journey = forcedJourney || text(row.journey);
  const legIndex = wholeTick(row.legIndex);
  const fromId = text(row.fromId);
  const toId = text(row.toId);
  const progressBand = text(row.progressBand);
  const journeyLegs = legs.filter((leg) => leg.journey === journey);
  const leg = legIndex == null ? null : journeyLegs[legIndex];
  if (!JOURNEY_SET.has(journey) || legIndex == null || !leg
    || fromId !== leg.fromId || toId !== leg.toId || !POSITION_BAND_SET.has(progressBand)) return null;
  return { journey, legIndex, fromId, toId, progressBand };
}

/**
 * Normalize an injected shared-transit plan and prove continuity, direction,
 * one-week-per-leg, and a future return window.  No route is solved here.
 *
 * @param {unknown} raw
 * @param {{fromId:string,toId:string,journey:'outbound'|'return',notBeforeTick:number}} contract
 * @returns {{legs:Array<Record<string,unknown>>,positionRef:Record<string,unknown>,expectedReturnTick:number}|null}
 */
export function normalizeRoutePlan(raw, contract) {
  const row = asObject(raw);
  if (!Array.isArray(row.legs) || !row.legs.length) return null;
  const legs = row.legs.map((leg) => normalizeLeg(leg, contract.journey, row.routeRef));
  if (legs.some((leg) => !leg)) return null;
  const normalized = /** @type {Array<Record<string, unknown>>} */ (legs);
  if (normalized[0].fromId !== contract.fromId
    || normalized[normalized.length - 1].toId !== contract.toId
    || Number(normalized[0].departTick) < contract.notBeforeTick) return null;
  for (let index = 1; index < normalized.length; index += 1) {
    const prior = normalized[index - 1];
    const current = normalized[index];
    if (current.fromId !== prior.toId
      || Number(current.departTick) < Number(prior.arrivalTick) + 1) return null;
  }
  const expectedReturnTick = wholeTick(row.expectedReturnTick);
  if (expectedReturnTick == null
    || expectedReturnTick < Number(normalized[normalized.length - 1].arrivalTick)) return null;
  const initial = row.positionRef || {
    journey: contract.journey,
    legIndex: 0,
    fromId: normalized[0].fromId,
    toId: normalized[0].toId,
    progressBand: 'departed',
  };
  const positionRef = normalizePositionRef(initial, normalized, contract.journey);
  if (!positionRef) return null;
  return { legs: normalized, positionRef, expectedReturnTick };
}

/** Prove a persisted journey still has the same directed, contiguous route. */
export function validJourneyRoute(legs, journey, fromId, toId) {
  const route = legs.filter((leg) => leg.journey === journey);
  if (!route.length || route[0].fromId !== fromId || route[route.length - 1].toId !== toId) {
    return false;
  }
  for (let index = 1; index < route.length; index += 1) {
    const prior = route[index - 1];
    const current = route[index];
    if (current.fromId !== prior.toId
      || Number(current.departTick) < Number(prior.arrivalTick) + 1) {
      return false;
    }
  }
  return true;
}

/** @param {Record<string, unknown>} errand @param {number} tick */
export function scheduledEnvoyPosition(errand, tick) {
  const journey = errand.state === 'returning' ? 'return' : 'outbound';
  const legs = Array.isArray(errand.legs)
    ? errand.legs.filter((leg) => asObject(leg).journey === journey).map(asObject)
    : [];
  if (!legs.length) return null;
  const currentIndex = legs.findIndex((leg) => Number(tick) >= Number(leg.departTick)
    && !namedPersonLegPosition(
      /** @type {import('./namedPersonTransit.js').NamedPersonLeg} */ (leg),
      tick,
    ).arrived);
  let completedIndex = -1;
  for (let index = 0; index < legs.length; index += 1) {
    if (Number(tick) >= Number(legs[index].arrivalTick)) completedIndex = index;
  }
  if (currentIndex < 0 && completedIndex === legs.length - 1) {
    const lastIndex = legs.length - 1;
    const last = legs[lastIndex];
    return {
      complete: true,
      positionRef: {
        journey,
        legIndex: lastIndex,
        fromId: last.fromId,
        toId: last.toId,
        progressBand: 'arrived',
      },
    };
  }
  if (currentIndex < 0 && completedIndex >= 0) {
    const completed = legs[completedIndex];
    return {
      complete: false,
      positionRef: {
        journey,
        legIndex: completedIndex,
        fromId: completed.fromId,
        toId: completed.toId,
        progressBand: 'arrived',
      },
    };
  }
  // Before the first scheduled departure the traveler still stands at its
  // authored origin; the persisted cursor uses the first leg's departed band.
  if (currentIndex < 0) {
    const first = legs[0];
    return {
      complete: false,
      positionRef: {
        journey,
        legIndex: 0,
        fromId: first.fromId,
        toId: first.toId,
        progressBand: 'departed',
      },
    };
  }
  const leg = legs[currentIndex];
  const { progress01: progress } = namedPersonLegPosition(
    /** @type {import('./namedPersonTransit.js').NamedPersonLeg} */ (leg),
    tick,
  );
  const progressBand = progress <= 0 ? 'departed' : progress < 0.67 ? 'underway' : 'near';
  return {
    complete: false,
    positionRef: {
      journey,
      legIndex: currentIndex,
      fromId: leg.fromId,
      toId: leg.toId,
      progressBand,
    },
  };
}
