/**
 * domain/worldPulse/patronFall.js — WF-1a, THE TYPED PATRON FALL.
 *
 * Today a settlement's patron seat changes hands and NOTHING records that it happened,
 * or why: `advanceReligionStates` mints a conversion outcome whose `cause` is a
 * two-token `occupation | contest` literal, and that outcome is discarded at the end of
 * the tick. This leaf is the persisted half — a capped ring of typed fall records on
 * `worldState.religionStates[cid].patronFalls`, written by ONE function.
 *
 * ⛔ THE DEITY DOCTRINE BINDS EVERY TOKEN BELOW. Faith is CULTURAL, never theological.
 * Each of the four causes names a BELIEVER-SIDE or POLITICAL act — a garrison, an
 * eviction, a contest, a share flip. No token, field or record asserts anything about a
 * god: `imposed` records what the garrison did, never what the god failed to do. There
 * is no premade deity pool here, no deity catalogue read, and no free text anywhere in
 * the record — `cause` is a closed frozen vocabulary, `atTick` an integer, `ref` an
 * existing deity ref (FINITE-SEMANTICS: typed buckets only).
 *
 * PURE: no `worldState` in any signature, no snapshot, no RNG, no wall clock. The fold
 * computes the four booleans; this module turns them into one token and one record.
 *
 * ⛔ THE FILE NAME IS LOAD-BEARING. It sits under `src/domain/worldPulse/` beside its
 * only importer (`religiousContest.js`) precisely so `scanCrossLayerPairs` yields zero
 * pairs and both coupling-registry ceilings stand still. Renaming it into a spelling no
 * `LAYER_PATTERNS` entry claims would mint a cross-layer pair against a baseline that
 * has zero headroom.
 *
 * @enforced-by tests/domain/patronFall.test.js
 */

/**
 * One recorded fall. Every field is a typed bucket per FINITE-SEMANTICS: no free text.
 * @typedef {Object} PatronFall
 * @property {string} ref     the OUTGOING patron's deity ref
 * @property {string} cause   exactly one member of PATRON_FALL_CAUSES
 * @property {number} atTick  the tick the seat changed hands
 */

/**
 * The NARROW view of a per-settlement religion state this leaf needs — the ring, and
 * nothing else. Deliberately not the full state shape: structural typing lets the fold
 * hand over its own much richer object, and naming only what is touched keeps this leaf
 * honest about its reach and keeps `any` out of the domain-strict surface.
 * @typedef {{ patronFalls?: PatronFall[] }} FallBearingState
 */

/**
 * THE CLOSED FALL VOCABULARY — FOUR tokens, in codepoint order.
 *
 * ⛔ `abandoned` IS DELIBERATELY ABSENT, AND THE ABSENCE IS A MEASUREMENT RATHER THAN AN
 * OVERSIGHT. It was chartered as "the sink crossing" — share lost to `none` with nobody
 * taking the seat — and `applyUnaffiliatedSink` cannot produce it: the function renorms
 * the faithful into `100 - noneInt` and recomputes standings, it touches
 * `state.patronRef` on NO path, it suppresses nothing, `'none'` is a scalar accumulator
 * that its own module header declares can never rank, contest or hold the seat, and the
 * fold invokes it AFTER the patron seat is decided. A settlement can secularize all the
 * way to the `SINK_MAX` ceiling of 45 with its patron still seated. A fifth token would
 * therefore be a vocabulary member with zero producers, which the estate's standing law
 * forbids: a member lands in the same commit as its producer or it does not land.
 *
 * @type {ReadonlyArray<string>}
 */
export const PATRON_FALL_CAUSES = Object.freeze(['discredited', 'displaced', 'imposed', 'suppressed']);

/**
 * The ring depth. This is NOT a tuning band and is not a chair-signed value: it is the
 * `pruneSuppressed` `KEEP = 3` idiom (religionState.js), quoted here so the two latent
 * memories a settlement keeps — suppressed cults and fallen patrons — are the same depth.
 */
export const FALL_RING_CAP = 3;

/**
 * Classify ONE patron displacement into exactly one token of the closed vocabulary.
 *
 * PRECEDENCE IS TOTAL AND FIRST-MATCH-WINS: `imposed` > `suppressed` > `discredited` >
 * `displaced`. It is settled here rather than at the call site because the arms genuinely
 * overlap — a garrison flip is also an eviction, and a contest resolution under occupation
 * is both — and an implementer left to order them would order them differently each wave.
 * The function is TOTAL: it returns a token for every real transition and never null.
 *
 * @param {Object} args
 * @param {boolean} [args.occupied]      a garrison holds the settlement at the flip
 * @param {boolean} [args.dmReassigned]  `ensureReligionState`'s DM RE-ASSIGN branch moved the seat
 * @param {string|null} [args.evictedRef] the ref `attemptEntry` reported evicting this tick
 * @param {string|null} [args.priorPatron] the OUTGOING patron, captured before the ensure call
 * @param {boolean} [args.contestOwned]  `resolvePatronContest` owned the seat this tick
 * @returns {string} one member of PATRON_FALL_CAUSES
 */
export function classifyPatronFall({
  occupied = false, dmReassigned = false, evictedRef = null, priorPatron = null, contestOwned = false,
} = {}) {
  // IMPOSED — the seat changed hands by external authority, not by belief. Two producers:
  // the garrison flip (an occupier's creed taking the seat under arms) and the DM's
  // SET_PRIMARY_DEITY re-assign. Both are political acts on the believers, so they share
  // one token; neither says anything about a god.
  if (occupied || dmReassigned) return 'imposed';
  // SUPPRESSED — the outgoing patron was evicted by force at the entry gate: attemptEntry
  // named it in `evicted` (same-niche push-out or capacity-full cross-niche eviction).
  if (evictedRef && priorPatron && evictedRef === priorPatron) return 'suppressed';
  // DISCREDITED — the schism / legitimacy-floor road: resolvePatronContest owned the seat
  // this tick, which is the branch a patron whose rightful claim collapsed loses on.
  if (contestOwned) return 'discredited';
  // DISPLACED — everything else, and the organic majority: a share flip sustained past
  // PATRON_FLIP_MARGIN for PATRON_FLIP_TICKS. The believers simply changed their minds.
  return 'displaced';
}

/**
 * THE ONE WRITER of `state.patronFalls`. Appends one typed record and truncates to the
 * newest FALL_RING_CAP entries, NEWEST FIRST.
 *
 * ⛔ CONDITIONAL MATERIALIZATION, and it is a byte claim rather than a style preference:
 * the key is created only by a REAL fall. A settlement that never lost a patron carries
 * NO `patronFalls` key at all — absent, never `null`, never `[]` — because an empty array
 * is a key and a key is a byte in every save, undo snapshot and same-seed hash.
 *
 * Refuses (returns null, writes nothing) on a missing state, a blank ref, or a cause
 * outside the closed vocabulary, so a caller cannot widen the vocabulary by passing a
 * string. Mutates `state` in place, on the fold's own idiom.
 *
 * @param {FallBearingState|null|undefined} state the per-settlement religion state
 * @param {{ ref?: string|null, cause?: string, atTick?: number }} fall
 * @returns {PatronFall|null} the record written, or null
 */
export function recordPatronFall(state, { ref = null, cause = '', atTick = 0 } = {}) {
  if (!state || typeof state !== 'object') return null;
  const key = ref === null || ref === undefined ? '' : String(ref);
  if (!key || !PATRON_FALL_CAUSES.includes(cause)) return null;
  const raw = Number(atTick);
  const record = { ref: key, cause, atTick: Number.isFinite(raw) ? Math.max(0, Math.trunc(raw)) : 0 };
  const prior = Array.isArray(state.patronFalls) ? state.patronFalls : [];
  state.patronFalls = [record, ...prior].slice(0, FALL_RING_CAP);
  return record;
}

/**
 * The pure read WF-1d's war-dissolution join consumes: why did THIS faith lose the seat?
 * Returns the cause of the identity's most recent recorded fall, or null when the ring
 * carries none. NEVER THROWS on any input — the Herald-desk law, because the consumer is
 * a narrative renderer and a throw there takes a beat down with it.
 *
 * Deliberately has NO production caller in WF-1a. That is the producer-first shape of
 * this wave, recorded rather than omitted.
 *
 * @param {FallBearingState|null|undefined} religionState @param {unknown} ref @returns {string|null}
 */
export function fallCauseFor(religionState, ref) {
  const falls = religionState && typeof religionState === 'object' ? religionState.patronFalls : null;
  if (!Array.isArray(falls) || ref === null || ref === undefined) return null;
  const key = String(ref);
  if (!key) return null;
  const hit = falls.find((row) => row && typeof row === 'object' && String(row.ref) === key);
  return hit && typeof hit.cause === 'string' ? hit.cause : null;
}
