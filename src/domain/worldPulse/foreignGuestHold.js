/**
 * foreignGuestHold.js — WR-7b's one writer for travelling foreign guests held
 * away from home.
 *
 * The ledger is active-only and conditional.  It records custody, not a local
 * H2 jail verdict and not a second envoy state machine.  The envoy writer owns
 * movement; this leaf merely preserves the exact interrupted continuation that
 * writer must be handed on release, escape, pardon, or an authorized undo.
 *
 * Opening is gated by the WR-7 integration caller.  Reads and lifecycle cleanup
 * deliberately are not: an extant hold must remain releasable after a rule is
 * switched off.  All writes are pure, codepoint-stable, alias-resistant, and
 * drop the conditional spatial-ledger key when the last guest leaves custody.
 */

import {
  dropSpatialLedger,
  getSpatialLedger,
  setSpatialLedger,
} from '../spatial/distanceRead.js';

export const FOREIGN_GUEST_HOLD_LEDGER_KEY = 'foreignGuestHolds';
export const FOREIGN_GUEST_HOLD_SCHEMA_VERSION = 1;
export const MAX_ACTIVE_FOREIGN_GUEST_HOLDS = 64;
export const MAX_HOLD_CONTINUATION_LEGS = 32;

/**
 * WHY A TRAVELLER IS IN SOMEBODY ELSE'S CUSTODY. Closed, and appended-to rather than
 * re-ordered, because two built consumers key behaviour off the WORD.
 *
 * ES-2 — `caught_spying` is the FIFTH member and the espionage layer's one covert custody
 * cause (ES §1's vocabulary clause; seam row 3 keeps it the ONE spelling that TR-8's capture
 * will also use). It is the signal `ransomDwellRead` reads to shift its dwell cuts, which is
 * the whole of J-ES-15b's "a spy sits twice as long before the ransom gate opens" — and
 * reading it off the HOLD ROW is what keeps that arm one-argument-readable.
 */
export const FOREIGN_GUEST_HOLD_CAUSES = Object.freeze([
  'war_continuation',
  'private_imprisonment',
  'terms_shopping',
  'parlay_refused',
  'caught_spying',
]);

/**
 * THE COVERT CAUSE, NAMED ONCE. Two modules outside this file branch on this exact word —
 * `ransomClaim.ransomDwellRead` stretches its dwell cuts for it and the espionage gauntlet
 * would open custody under it — and a branch keyed on a LITERAL is a second spelling of a
 * closed-vocabulary member: the day the word moved, the branch would keep compiling and
 * quietly stop firing. Seam row 3's one-spelling clause, made structural.
 */
export const FOREIGN_GUEST_HOLD_COVERT_CAUSE = FOREIGN_GUEST_HOLD_CAUSES[4];

export const FOREIGN_GUEST_HOLD_CLOSE_REASONS = Object.freeze([
  'release',
  'escape',
  'death',
  'pardon',
]);

const HOLD_CAUSE_SET = new Set(FOREIGN_GUEST_HOLD_CAUSES);
const CLOSE_REASON_SET = new Set(FOREIGN_GUEST_HOLD_CLOSE_REASONS);
const RESUME_STATE_SET = new Set(['travelling', 'parlaying', 'returning']);
const JOURNEY_SET = new Set(['outbound', 'return']);
const POSITION_BAND_SET = new Set(['departed', 'underway', 'near', 'arrived']);
const ROW_KEYS = Object.freeze([
  'schemaVersion',
  'id',
  'npcId',
  'errandId',
  'encounterId',
  'captorId',
  'venueId',
  'venueRef',
  'heldSinceTick',
  'cause',
  'continuation',
]);
const CONTINUATION_KEYS = Object.freeze([
  'schemaVersion',
  'resumeState',
  'journey',
  'destinationId',
  'interruptedTick',
  'positionRef',
  'journeyLegs',
  'expectedReturnTick',
]);
const CONTINUATION_RETURN_KEYS = Object.freeze([
  ...CONTINUATION_KEYS,
  'scheduledHomeTick',
]);
const POSITION_KEYS = Object.freeze([
  'journey',
  'legIndex',
  'fromId',
  'toId',
  'progressBand',
]);
const LEG_KEYS = Object.freeze([
  'fromId',
  'toId',
  'departTick',
  'arrivalTick',
  'journey',
  'routeRef',
]);
const CLOSURE_KEYS = Object.freeze([
  'schemaVersion',
  'hold',
  'closedTick',
  'closeReason',
  'postCloseSignature',
]);

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function asRecord(value) {
  return isRecord(value) ? /** @type {Record<string, unknown>} */ (value) : {};
}

/**
 * Authored control characters are the hazard this guards, not an accident of
 * the pattern: a NUL smuggled into an authored id has corrupted records before,
 * and the repo's controlBytes scan exists because of it. The lint rule that
 * forbids control characters in a regex is the one thing standing between this
 * file and the check it must perform, so it is disabled once, here, with its
 * reason — rather than twice, unexplained, at the call sites.
 */
// eslint-disable-next-line no-control-regex
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;

/** IDs are authored strings.  Trimming or coercing would manufacture identity. */
function strictId(value) {
  if (typeof value !== 'string' || value.length < 1 || value.length > 256
    || value !== value.trim() || CONTROL_CHARACTERS.test(value)) return '';
  return value;
}

/** Optional authored labels obey the same no-coercion/no-control rule. */
function strictLabel(value) {
  if (typeof value !== 'string' || value.length < 1 || value.length > 256
    || value !== value.trim() || CONTROL_CHARACTERS.test(value)) return '';
  return value;
}

/** @param {unknown} value @returns {number|null} */
function wholeTick(value) {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
    ? value
    : null;
}

/** @param {string} left @param {string} right */
function compareCodepoint(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** A versioned DTO is exact: unknown fields fail closed instead of hitchhiking. */
function hasExactKeys(value, keys) {
  if (!isRecord(value)) return false;
  const actual = Object.keys(value).sort(compareCodepoint);
  const expected = [...keys].sort(compareCodepoint);
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

/** @param {unknown} raw @returns {Record<string, string>|null} */
function normalizeRouteRef(raw) {
  if (!isRecord(raw)) return null;
  const keys = Object.keys(raw).sort(compareCodepoint);
  if (keys.length !== 1 && keys.length !== 2) return null;
  if (keys[0] !== 'id' || (keys.length === 2 && keys[1] !== 'name')) return null;
  const row = asRecord(raw);
  const id = strictId(row.id);
  const name = row.name === undefined ? '' : strictLabel(row.name);
  if (!id || (row.name !== undefined && !name)) return null;
  return { id, ...(name ? { name } : {}) };
}

/**
 * An occupied/allied hall is a settlement venue; a road meeting is a typed
 * route-node venue.  `venueId` is cross-checked rather than synthesized.
 * @param {unknown} raw @param {string} venueId
 * @returns {Record<string, string>|null}
 */
function normalizeVenueRef(raw, venueId) {
  if (!isRecord(raw)) return null;
  const row = asRecord(raw);
  const kind = row.kind;
  if (kind === 'settlement') {
    if (!hasExactKeys(row, ['kind', 'settlementId'])) return null;
    const settlementId = strictId(row.settlementId);
    return settlementId && venueId === settlementId
      ? { kind: 'settlement', settlementId }
      : null;
  }
  if (kind === 'route_node') {
    if (!hasExactKeys(row, ['kind', 'nodeId', 'routeId'])) return null;
    const nodeId = strictId(row.nodeId);
    const routeId = strictId(row.routeId);
    return nodeId && routeId && venueId === nodeId
      ? { kind: 'route_node', nodeId, routeId }
      : null;
  }
  return null;
}

/** @param {unknown} raw @param {string} journey @returns {Record<string, unknown>|null} */
function normalizeLeg(raw, journey) {
  if (!hasExactKeys(raw, LEG_KEYS)) return null;
  const row = asRecord(raw);
  const fromId = strictId(row.fromId);
  const toId = strictId(row.toId);
  const departTick = wholeTick(row.departTick);
  const arrivalTick = wholeTick(row.arrivalTick);
  const routeRef = normalizeRouteRef(row.routeRef);
  if (!fromId || !toId || fromId === toId || row.journey !== journey
    || departTick == null || arrivalTick == null || arrivalTick < departTick + 1
    || !routeRef) return null;
  return { fromId, toId, departTick, arrivalTick, journey, routeRef };
}

/**
 * Strict, detached interruption capsule.  It carries the complete active
 * journey rather than an opaque object, so the envoy writer can prove the old
 * cursor and reprice from the venue to the exact destination without importing
 * truth or accepting arbitrary resume authority.
 *
 * @param {unknown} raw @param {number} heldSinceTick
 * @returns {Record<string, unknown>|null}
 */
function normalizeContinuation(raw, heldSinceTick) {
  if (!isRecord(raw)) return null;
  const row = asRecord(raw);
  const resumeState = row.resumeState;
  const journey = row.journey;
  const keys = journey === 'return' ? CONTINUATION_RETURN_KEYS : CONTINUATION_KEYS;
  if (!hasExactKeys(row, keys)
    || row.schemaVersion !== FOREIGN_GUEST_HOLD_SCHEMA_VERSION
    || typeof resumeState !== 'string' || !RESUME_STATE_SET.has(resumeState)
    || typeof journey !== 'string' || !JOURNEY_SET.has(journey)
    || (resumeState === 'returning') !== (journey === 'return')
    || (resumeState === 'parlaying' && journey !== 'outbound')) return null;

  const destinationId = strictId(row.destinationId);
  const interruptedTick = wholeTick(row.interruptedTick);
  const expectedReturnTick = wholeTick(row.expectedReturnTick);
  const scheduledHomeTick = wholeTick(row.scheduledHomeTick);
  if (!destinationId || interruptedTick == null || interruptedTick > heldSinceTick
    || expectedReturnTick == null
    || (journey === 'return' && scheduledHomeTick == null)
    || (journey !== 'return' && row.scheduledHomeTick !== undefined)) return null;

  if (!Array.isArray(row.journeyLegs) || row.journeyLegs.length < 1
    || row.journeyLegs.length > MAX_HOLD_CONTINUATION_LEGS) return null;
  const legs = row.journeyLegs.map((leg) => normalizeLeg(leg, journey));
  if (legs.some((leg) => !leg)) return null;
  const journeyLegs = /** @type {Array<Record<string, unknown>>} */ (legs);
  for (let index = 1; index < journeyLegs.length; index += 1) {
    const prior = journeyLegs[index - 1];
    const current = journeyLegs[index];
    if (current.fromId !== prior.toId
      || Number(current.departTick) < Number(prior.arrivalTick) + 1) return null;
  }
  const first = journeyLegs[0];
  const final = journeyLegs[journeyLegs.length - 1];
  if (final.toId !== destinationId || interruptedTick < Number(first.departTick)
    || expectedReturnTick < Number(final.arrivalTick)
    || expectedReturnTick < interruptedTick
    || (scheduledHomeTick != null && scheduledHomeTick < Number(final.arrivalTick))) return null;

  if (!hasExactKeys(row.positionRef, POSITION_KEYS)) return null;
  const position = asRecord(row.positionRef);
  const legIndex = wholeTick(position.legIndex);
  const positionJourney = position.journey;
  const fromId = strictId(position.fromId);
  const toId = strictId(position.toId);
  const progressBand = position.progressBand;
  const currentLeg = legIndex == null ? null : journeyLegs[legIndex];
  if (positionJourney !== journey || !currentLeg || !fromId || !toId
    || fromId !== currentLeg.fromId || toId !== currentLeg.toId
    || typeof progressBand !== 'string' || !POSITION_BAND_SET.has(progressBand)) return null;
  if (resumeState === 'parlaying'
    && (legIndex !== journeyLegs.length - 1 || progressBand !== 'arrived'
      || interruptedTick < Number(final.arrivalTick))) return null;

  return {
    schemaVersion: FOREIGN_GUEST_HOLD_SCHEMA_VERSION,
    resumeState,
    journey,
    destinationId,
    interruptedTick,
    positionRef: { journey, legIndex, fromId, toId, progressBand },
    journeyLegs,
    expectedReturnTick,
    ...(scheduledHomeTick != null ? { scheduledHomeTick } : {}),
  };
}

/** @param {unknown} raw @returns {Record<string, unknown>|null} */
export function normalizeForeignGuestHold(raw) {
  if (!hasExactKeys(raw, ROW_KEYS)) return null;
  const row = asRecord(raw);
  if (row.schemaVersion !== FOREIGN_GUEST_HOLD_SCHEMA_VERSION) return null;
  const id = strictId(row.id);
  const npcId = strictId(row.npcId);
  const errandId = strictId(row.errandId);
  const encounterId = strictId(row.encounterId);
  const captorId = strictId(row.captorId);
  const venueId = strictId(row.venueId);
  const heldSinceTick = wholeTick(row.heldSinceTick);
  const cause = row.cause;
  if (!id || !npcId || !errandId || !encounterId || !captorId || !venueId
    || heldSinceTick == null || typeof cause !== 'string' || !HOLD_CAUSE_SET.has(cause)) return null;
  const venueRef = normalizeVenueRef(row.venueRef, venueId);
  const continuation = normalizeContinuation(row.continuation, heldSinceTick);
  if (!venueRef || !continuation) return null;
  return {
    schemaVersion: FOREIGN_GUEST_HOLD_SCHEMA_VERSION,
    id,
    npcId,
    errandId,
    encounterId,
    captorId,
    venueId,
    venueRef,
    heldSinceTick,
    cause,
    continuation,
  };
}

/**
 * Normalize the active row set.  Imported duplicates are ambiguous authority:
 * every row participating in an id, npc, or errand collision is dropped, never
 * picked by insertion order.  `usable=false` only for an over-cap ledger; writes
 * then refuse rather than silently evicting a living guest.
 */
function parsedHolds(worldState) {
  const raw = getSpatialLedger(worldState, FOREIGN_GUEST_HOLD_LEDGER_KEY);
  if (raw === undefined) return { rows: [], usable: true, pristine: true };
  if (!Array.isArray(raw)) return { rows: [], usable: true, pristine: false };
  const normalized = raw.map(normalizeForeignGuestHold);
  const rows = normalized.filter(Boolean);
  const counts = {
    id: new Map(),
    npcId: new Map(),
    errandId: new Map(),
  };
  for (const row of /** @type {Array<Record<string, unknown>>} */ (rows)) {
    for (const key of Object.keys(counts)) {
      const value = String(row[key]);
      const map = counts[/** @type {'id'|'npcId'|'errandId'} */ (key)];
      map.set(value, (map.get(value) || 0) + 1);
    }
  }
  const unique = /** @type {Array<Record<string, unknown>>} */ (rows).filter((row) => (
    counts.id.get(String(row.id)) === 1
    && counts.npcId.get(String(row.npcId)) === 1
    && counts.errandId.get(String(row.errandId)) === 1
  )).sort((left, right) => compareCodepoint(String(left.id), String(right.id)));
  const hadDuplicate = unique.length !== rows.length;
  const hadMalformed = normalized.some((row) => !row);
  if (unique.length > MAX_ACTIVE_FOREIGN_GUEST_HOLDS) {
    return { rows: [], usable: false, pristine: false };
  }
  return {
    rows: unique,
    usable: true,
    pristine: !hadMalformed && !hadDuplicate && raw.length === unique.length,
  };
}

/** Persist a canonical active set, dropping both conditional containers at zero. */
function writeHolds(worldState, rows) {
  const sorted = rows
    .map(normalizeForeignGuestHold)
    .filter(Boolean)
    .sort((left, right) => compareCodepoint(String(left.id), String(right.id)));
  return sorted.length
    ? setSpatialLedger(worldState, FOREIGN_GUEST_HOLD_LEDGER_KEY, sorted)
    : dropSpatialLedger(worldState, FOREIGN_GUEST_HOLD_LEDGER_KEY);
}

/** Read-only, normalized, detached projection of all active holds. */
export function foreignGuestHoldsOf(worldState) {
  return parsedHolds(worldState).rows;
}

/** Exact active hold for one durable person, or null. */
export function foreignGuestHoldForNpc(worldState, npcId) {
  const id = strictId(npcId);
  return id ? foreignGuestHoldsOf(worldState).find((hold) => hold.npcId === id) || null : null;
}

/** Exact active hold for one envoy errand, or null. */
export function foreignGuestHoldForErrand(worldState, errandId) {
  const id = strictId(errandId);
  return id ? foreignGuestHoldsOf(worldState).find((hold) => hold.errandId === id) || null : null;
}

/**
 * Open one active hold.  Integration must prove the six-rule WR-7 conjunction
 * and venue legality before calling; this writer proves only its own authority.
 */
export function openForeignGuestHold({ worldState, hold } = {}) {
  if (!isRecord(worldState)) {
    return { worldState, changed: false, hold: null, reason: 'invalid_world' };
  }
  const candidate = normalizeForeignGuestHold(hold);
  if (!candidate) {
    return { worldState, changed: false, hold: null, reason: 'invalid_hold' };
  }
  const parsed = parsedHolds(worldState);
  if (!parsed.usable) {
    return { worldState, changed: false, hold: null, reason: 'capacity' };
  }
  const collision = parsed.rows.find((row) => row.id === candidate.id
    || row.npcId === candidate.npcId || row.errandId === candidate.errandId);
  if (collision) {
    const exact = JSON.stringify(collision) === JSON.stringify(candidate);
    return {
      worldState,
      changed: false,
      hold: exact ? candidate : null,
      reason: exact ? 'already_open' : 'authority_conflict',
    };
  }
  if (parsed.rows.length >= MAX_ACTIVE_FOREIGN_GUEST_HOLDS) {
    return { worldState, changed: false, hold: null, reason: 'capacity' };
  }
  const nextWorldState = writeHolds(worldState, [...parsed.rows, candidate]);
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    hold: normalizeForeignGuestHold(candidate),
    reason: 'opened',
  };
}

/** @param {unknown} raw @returns {Record<string, unknown>|null} */
function normalizeClosure(raw) {
  if (!hasExactKeys(raw, CLOSURE_KEYS)) return null;
  const row = asRecord(raw);
  const hold = normalizeForeignGuestHold(row.hold);
  const closedTick = wholeTick(row.closedTick);
  const closeReason = row.closeReason;
  const postCloseSignature = typeof row.postCloseSignature === 'string'
    ? row.postCloseSignature
    : null;
  if (row.schemaVersion !== FOREIGN_GUEST_HOLD_SCHEMA_VERSION || !hold
    || closedTick == null || closedTick < Number(hold.heldSinceTick)
    || typeof closeReason !== 'string' || !CLOSE_REASON_SET.has(closeReason)
    || postCloseSignature == null) return null;
  return {
    schemaVersion: FOREIGN_GUEST_HOLD_SCHEMA_VERSION,
    hold,
    closedTick,
    closeReason,
    postCloseSignature,
  };
}

/**
 * Close one exact active hold.  `expectedHold` is the stale-authority token: an
 * id alone may not release a later custody episode that reused the same label.
 */
export function closeForeignGuestHold({ worldState, expectedHold, tick, reason } = {}) {
  if (!isRecord(worldState)) {
    return { worldState, changed: false, hold: null, closure: null, reason: 'invalid_world' };
  }
  const expected = normalizeForeignGuestHold(expectedHold);
  const closedTick = wholeTick(tick);
  if (!expected || closedTick == null || closedTick < Number(expected.heldSinceTick)
    || typeof reason !== 'string' || !CLOSE_REASON_SET.has(reason)) {
    return { worldState, changed: false, hold: null, closure: null, reason: 'invalid_close' };
  }
  const parsed = parsedHolds(worldState);
  if (!parsed.usable) {
    return { worldState, changed: false, hold: null, closure: null, reason: 'capacity' };
  }
  const current = parsed.rows.find((hold) => hold.id === expected.id);
  if (!current || JSON.stringify(current) !== JSON.stringify(expected)) {
    return { worldState, changed: false, hold: null, closure: null, reason: 'stale_authority' };
  }
  const remaining = parsed.rows.filter((hold) => hold.id !== expected.id);
  const nextWorldState = writeHolds(worldState, remaining);
  const closure = normalizeClosure({
    schemaVersion: FOREIGN_GUEST_HOLD_SCHEMA_VERSION,
    hold: current,
    closedTick,
    closeReason: reason,
    // Exact canonical post-state: restore refuses after any intervening hold
    // mutation, without retaining a second terminal ledger in worldState.
    postCloseSignature: JSON.stringify(remaining),
  });
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    hold: normalizeForeignGuestHold(current),
    closure,
    reason: 'closed',
  };
}

/**
 * Restore an exact closure during transactional undo.  The supplied tick must
 * still be the close tick, the world's clock (when present) must not have moved,
 * and the entire active hold set must still equal the post-close signature.
 */
export function restoreForeignGuestHold({ worldState, closure, tick } = {}) {
  if (!isRecord(worldState)) {
    return { worldState, changed: false, hold: null, reason: 'invalid_world' };
  }
  const token = normalizeClosure(closure);
  const restoreTick = wholeTick(tick);
  const worldTick = wholeTick(worldState.tick);
  if (!token || restoreTick == null || restoreTick !== token.closedTick
    || (worldState.tick !== undefined && (worldTick == null || worldTick !== restoreTick))) {
    return { worldState, changed: false, hold: null, reason: 'stale_authority' };
  }
  const parsed = parsedHolds(worldState);
  if (!parsed.usable || !parsed.pristine
    || JSON.stringify(parsed.rows) !== token.postCloseSignature) {
    return { worldState, changed: false, hold: null, reason: 'stale_authority' };
  }
  const candidate = /** @type {Record<string, unknown>} */ (token.hold);
  if (parsed.rows.length >= MAX_ACTIVE_FOREIGN_GUEST_HOLDS
    || parsed.rows.some((hold) => hold.id === candidate.id
      || hold.npcId === candidate.npcId || hold.errandId === candidate.errandId)) {
    return { worldState, changed: false, hold: null, reason: 'authority_conflict' };
  }
  const nextWorldState = writeHolds(worldState, [...parsed.rows, candidate]);
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    hold: normalizeForeignGuestHold(candidate),
    reason: 'restored',
  };
}
