/**
 * espionageWariness.js — ES-5: THE MISSING-NPC TELL's VISIBILITY PREDICATE. What a court
 * can lawfully notice about other people's travellers, and nothing whatsoever beyond it.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.8 (⟨F3⟩), J-ES-8. ES-0 landed the arithmetic
 * (`wariness01Core`, counts in and a number out) and left THIS half — the dangerous half —
 * to a wave that could fence it properly. The gauntlet folded the holds term alone and
 * named `overdueForeignNotables` absent on every detection receipt; this leaf is that term,
 * and the gauntlet stops declaring it missing in the same commit.
 *
 * ── ⭐ ZERO IMPORTS, AND THAT IS THE FENCE ITSELF ────────────────────────────────────────
 * The law this file exists to keep is one sentence: A COVERT MISSION'S EXISTENCE MUST NOT
 * LEAK INTO A FOREIGN COURT'S DERIVED STATE. Every leak this estate could have shipped runs
 * through a read of the `covert` sub-record, of `truePurpose`, or of a reader that resolves
 * either. So this module reaches for NOTHING: the errand rows arrive as an ARGUMENT (the
 * ES-0 discipline — a function that gathers its own inputs cannot have a single factor
 * mutated out), and with no import at all there is no reader here that COULD resolve a true
 * purpose. `tests/domain/espionageWariness.test.js` asserts the import set is EMPTY and runs
 * that scan against a planted import, because an absence nobody can watch being violated is
 * not a fence.
 *
 * The consequence is worth stating positively rather than as a prohibition. The predicate
 * reads exactly three things off a row — its ORIGIN, its DECLARED ROUTE, and its STATE —
 * and every one of them is a fact the receiving town already has: somebody announced a
 * party from another realm, said when it would arrive, and it did not. A court that notices
 * that has noticed nothing it was not told.
 *
 * ── THE TWO LAPSES, VERBATIM THE VOLUME'S OWN EXAMPLES ──────────────────────────────────
 *   `never_arrived` — an announced visit that never arrived. The last OUTBOUND leg's
 *     `arrivalTick` has passed and the row is still `travelling`.
 *   `never_left`    — an announced guest who never left on time. The row is `parlaying`
 *     past its `expectedReturnTick`, which is a REQUIRED field on every errand row
 *     (`normalizeErrand` refuses a row without one) and is the announced departure.
 * A row inside either window is IN SCHEDULE and contributes ZERO. That single fact is what
 * makes ⟨F3⟩'s law hold WITHOUT this file ever knowing which missions are covert: an
 * in-schedule fully-covert mission is silent because it is in schedule, and the same
 * mission one tick past its declared face's own clock is loud — which is exactly the
 * owner's design, and exactly §3.8's "an absence with a declared face raises no tell until
 * the face's clock also runs out".
 *
 * ── ⛔ WHAT §3.8 ASKS FOR THAT THIS WAVE COULD NOT BUILD — AN ARM AND A WEIGHT ───────────
 * §3.8 defines "reason to believe" as EXACTLY THE UNION of two arms, weighted by a third
 * thing. This module implements ARM (a) — declared-face schedules — and the other two are
 * DECLARED ABSENT BY NAME on every read rather than left to be discovered by the next
 * reader of the volume. Both absences have the SAME measured cause.
 *
 *   ARM (a) — declared-face schedules it can see. BUILT, and it is the whole of the
 *     arithmetic below.
 *   ARM (b) — `heldAbsenceBeliefs`: "absence-beliefs it already holds through the
 *     npcCirculation observer-side belief surfaces (the `believedNotorietyRank` family)".
 *     ABSENT. Not implemented, and it is a UNION arm rather than a refinement, so the count
 *     this leaf answers is a LOWER BOUND on §3.8's count — never an equal.
 *   THE WEIGHT — `believedNotorietyWeighting`: "weighted by `believedNotorietyRank` (the
 *     notable are missed loudly)". ABSENT; every lapsed row weighs exactly ONE.
 *
 * ⚠ THE MEASURED CAUSE, WHICH IS ONE CAUSE FOR BOTH. `believedNotorietyRank({worldState,
 * observerId, wnpcId, roamer, tick})` (npcCirculation.js:714) is a read over the
 * WANDERING-NPC CIRCULATION POOL. It takes a `roamer` RECORD and reads
 * `roamer.originRef.settlementId`, `roamer.reputation` and `roamer.sinceTick` through
 * `believedReputation`; `wnpcId` is a circulation id. An errand carries a ROSTER `npcId` and
 * NO circulation record exists for a roster envoy. So the family §3.8 names is not a
 * spelling this leaf could look up differently — it is a different POPULATION. Arm (b)'s
 * absence-beliefs and the weight are both reads of that family about people it does not
 * contain, which is why one grain mismatch takes out both.
 *
 * ⚠⚠ AND THE ARM IS DECLARED, NOT ONLY THE WEIGHT. ES-5a shipped the weight in the register
 * and left the ARM undeclared, which reads — to anything downstream and to any reader —
 * as "the union is built, one multiplier is missing". It is not: half the union is missing.
 * An undeclared missing arm is the defect whether or not the arm can be built, and this is
 * the second time this estate has had to learn that a folded term and a folded ARM are
 * different sizes of silence. STOP-ES5-1 (chair) carries the grain mismatch itself.
 *
 * Neither is folded as a silent 1.0 or a silent zero that a reader would mistake for a
 * measured term. The alternative — calling the roamer read with a roster id and taking
 * whatever it answers for a person it has never heard of — would have been a live-looking
 * term that is structurally dead, which is the class this estate has now been bitten by
 * three times.
 *
 * PURE: no rng, no clock, no store, no world read, no I/O, no mutation.
 *
 * @enforced-by tests/domain/espionageWariness.test.js,
 *   tests/property/espionageDoctrineDormancyFence.test.js
 */

/**
 * ES-5's own constants. Kept OUT of `ESPIONAGE_TUNING` for the reason `GAUNTLET_TUNING` and
 * `TAP_TUNING` both record: that export is ES-0's frozen arithmetic surface and its key set
 * is pinned as a totality, so a wave that appended to it would move a pinned totality for a
 * number that belongs to a stage rather than to a formula. Raw-authored proposals until the
 * owner signs them (L5, THE PROMISE).
 */
export const TELL_TUNING = Object.freeze({
  /**
   * §3.8's LOOKBACK for the declared-face arm. A court forgets an old disappointment: a
   * schedule that lapsed longer ago than this stops being a reason to search the next
   * caravan. Deliberately the same window ES-2's `COVERT_HOLD_LOOKBACK_TICKS` uses for the
   * holds term, because the two terms are the same court's memory measured two ways and a
   * second window would make one half of one tell forget faster than the other.
   */
  LAPSE_LOOKBACK_TICKS: 26,
});

/**
 * Everything §3.8 asks for that this read does NOT contain, named on every read — a UNION
 * ARM and a WEIGHT, in codepoint order. See the header's measured block: one grain mismatch
 * takes out both, and the arm's absence means this count is a LOWER BOUND on §3.8's.
 * @type {ReadonlyArray<string>}
 */
export const TELL_TERMS_ABSENT = Object.freeze([
  'believedNotorietyWeighting',
  'heldAbsenceBeliefs',
]);

/** The two lapse kinds, codepoint-sorted totality export. @type {ReadonlyArray<string>} */
export const LAPSE_KINDS = Object.freeze(['never_arrived', 'never_left']);

/**
 * §3.8(a) — THE STATES THAT CARRY A DECLARED SCHEDULE, and can therefore lapse. Sorted.
 * @type {ReadonlyArray<string>}
 */
export const LAPSE_STATES = Object.freeze(['parlaying', 'travelling']);

/**
 * §3.8(a) — EVERY OTHER ERRAND STATE, ROUTED EXPLICITLY AND ARGUED ONE AT A TIME.
 *
 * ⚠⚠ THIS REPLACES A CATCH-ALL, AND THE CATCH-ALL WAS THE DEFECT. ES-5a routed five of the
 * seven live states into one trailing `return` whose comment argued three of them. Two
 * (`intercepted`, `lost`) were never argued at all, and — worse than the missing prose — a
 * catch-all over a FROZEN VOCABULARY is how an eighth state silently joins the no-tell
 * bucket the day somebody mints one. A state this map does not name now lands in its own
 * `unrecognized_state` arm instead, which the census below reds on.
 *
 * ⭐ MIRROR, NEVER IMPORT. `ENVOY_ERRAND_STATES` is the vocabulary's own totality export and
 * this map deliberately does not import it — the whole of ⟨F3⟩'s structural guarantee is
 * that this module imports NOTHING (see the header). So the set is declared locally and
 * `tests/domain/espionageWariness.test.js` runs the EQUALITY WALKER against the real export:
 * `LAPSE_STATES ∪ keys(NO_TELL_BY_STATE) === ENVOY_ERRAND_STATES`. A local mirror with no
 * walker is a copy that rots; a walker without a local mirror is an import that breaks the
 * fence. The estate's answer to that pair is both.
 *
 * THE ARGUMENT, PER STATE:
 *   `returning`, `home`   — the announced schedule was KEPT. He arrived, and a lapse is a
 *     story about a broken promise, not about a person who is elsewhere.
 *   `held`, `intercepted` — his fate is a thing the world can SEE. A court that is holding
 *     him, or watched him taken, has an account of where he is; an unexplained absence is
 *     precisely what these states are not. (`held` is also ES-2's own holds term, counted
 *     once there — routing it here too would double-count the same custody row.)
 *   `lost`                — the absence is already ACCOUNTED. The row was closed as lost by
 *     the home-side silence inference (`advanceEnvoySilence`, J-ES-14), which is the
 *     HOME-side read; counting it again here would generalize a home-side conclusion across
 *     courts, which is the one thing §3.8 names as forbidden.
 * @type {Readonly<Record<string, string>>}
 */
const NO_TELL_BY_STATE = Object.freeze({
  held: 'fate_is_visible',
  home: 'schedule_kept',
  intercepted: 'fate_is_visible',
  lost: 'absence_already_accounted',
  returning: 'schedule_kept',
});

/** The no-tell states, codepoint-sorted, so the census reads one export rather than a map's
 *  key order. @type {ReadonlyArray<string>} */
export const NO_TELL_STATES = Object.freeze(Object.keys(NO_TELL_BY_STATE).sort());

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
 * §3.8(a) — THE OBSERVER'S CLUSTER: itself, plus every settlement sharing a regional-graph
 * edge with it. "the observer or a settlement in its cluster" is the volume's own scope for
 * a schedule a court can see, and it is the right one: a town hears about the embassy that
 * failed to reach its neighbour, because the neighbour says so.
 *
 * Reads the SAME `{from, to}` edge shape `relationshipTypeBetween` walks, on the same
 * argument-not-import discipline — a graph the caller already holds, never fetched here.
 * Codepoint-sorted and de-duplicated, so the set is order-free at every call site.
 *
 * @param {unknown} regionalGraph @param {unknown} observerId @returns {string[]}
 */
export function observerClusterIds(regionalGraph, observerId) {
  const observer = text(observerId);
  if (!observer) return [];
  const ids = new Set([observer]);
  const edges = Array.isArray(recordOf(regionalGraph).edges)
    ? /** @type {unknown[]} */ (recordOf(regionalGraph).edges)
    : [];
  for (const raw of edges) {
    const edge = recordOf(raw);
    const from = text(edge.from);
    const to = text(edge.to);
    if (from === observer && to) ids.add(to);
    else if (to === observer && from) ids.add(from);
  }
  return [...ids].sort();
}

/**
 * §3.8(a) — HAS ONE ROW'S DECLARED SCHEDULE LAPSED, and where.
 *
 * `placeId` is the announced DESTINATION in both arms — the last outbound leg's `toId` —
 * because both stories are told at the same table: the town that was expecting him, and the
 * town he is still sitting in. A row with no outbound route announces nothing and lapses
 * nowhere.
 *
 * ⚠ THE COMPARISON IS STRICTLY `>`, WHICH IS THE ARRIVAL TICK ITSELF BEING IN SCHEDULE. A
 * traveller who is due today has not failed to arrive today, and a `>=` here would make
 * every mission overdue at the exact moment it is on time — the fence-post that would have
 * turned "in schedule" into a state no row can hold.
 *
 * @param {{errand?: unknown, tick?: unknown}} [args]
 * @returns {{lapsed: boolean, kind: string, placeId: string, dueTick: number, reason: string}}
 */
export function declaredScheduleLapse({ errand, tick } = {}) {
  /** @param {string} reason */
  const inSchedule = (reason) => ({
    lapsed: false, kind: '', placeId: '', dueTick: 0, reason,
  });
  const row = recordOf(errand);
  const now = wholeTick(tick);
  if (now == null) return inSchedule('invalid_tick');
  const outbound = (Array.isArray(row.legs) ? row.legs.map(recordOf) : [])
    .filter((leg) => leg.journey === 'outbound');
  const last = outbound.length ? outbound[outbound.length - 1] : null;
  const placeId = last ? text(last.toId) : '';
  if (!placeId) return inSchedule('no_declared_route');
  const state = text(row.state);
  if (state === 'travelling') {
    const arrival = last ? wholeTick(last.arrivalTick) : null;
    if (arrival == null) return inSchedule('no_declared_arrival');
    return now > arrival
      ? { lapsed: true, kind: 'never_arrived', placeId, dueTick: arrival, reason: 'never_arrived' }
      : inSchedule('arrival_pending');
  }
  if (state === 'parlaying') {
    // The announced departure. `expectedReturnTick` is REQUIRED on every errand row —
    // `normalizeErrand` refuses a row without one — so this arm never needs a fallback and
    // never invents a date nobody announced.
    const due = wholeTick(row.expectedReturnTick);
    if (due == null) return inSchedule('no_declared_return');
    return now > due
      ? { lapsed: true, kind: 'never_left', placeId, dueTick: due, reason: 'never_left' }
      : inSchedule('return_pending');
  }
  // EXPLICIT, PER STATE — see NO_TELL_BY_STATE's block for the argument on each of the five.
  // `Object.hasOwn` rather than a bare lookup, because a bare lookup on a row whose `state`
  // reads `constructor` or `toString` finds a PROTOTYPE member and answers a truthy
  // non-reason; the own-key test is total over every string a save file could carry.
  if (Object.hasOwn(NO_TELL_BY_STATE, state)) return inSchedule(NO_TELL_BY_STATE[state]);
  // A state no arm above names. NOT a lapse — the conservative answer, because inventing a
  // tell for a word this leaf does not understand is the louder failure — but it is reported
  // under its own reason so a newly-minted state reds the census instead of joining a bucket.
  return inSchedule('unrecognized_state');
}

/**
 * §3.8 ⟨F3⟩ — HOW MANY FOREIGN TRAVELLERS THIS COURT HAS REASON TO BELIEVE ARE MISSING.
 *
 * FOREIGN is a real fence and not a formality: a court's own overdue people are its own
 * business and reach it through `advanceEnvoySilence` (the HOME-side inference, J-ES-14).
 * Counting them here would have generalized a home-side read across courts and let a realm
 * be made wary by its own embassy running late.
 *
 * @param {{errands?: unknown, observerId?: unknown, clusterIds?: unknown, tick?: unknown}} [args]
 * @returns {{count: number, rows: ReadonlyArray<Record<string, unknown>>,
 *   termsAbsent: ReadonlyArray<string>}}
 */
export function overdueForeignNotables({
  errands, observerId, clusterIds, tick,
} = {}) {
  /** @type {Array<Record<string, unknown>>} */
  const rows = [];
  const observer = text(observerId);
  const now = wholeTick(tick);
  if (!observer || now == null) {
    return { count: 0, rows: Object.freeze(rows), termsAbsent: TELL_TERMS_ABSENT };
  }
  const cluster = new Set((Array.isArray(clusterIds) ? clusterIds : []).map(text).filter(Boolean));
  cluster.add(observer);
  for (const raw of (Array.isArray(errands) ? errands : [])) {
    const errand = recordOf(raw);
    if (text(errand.from) === observer) continue;
    const lapse = declaredScheduleLapse({ errand, tick: now });
    if (!lapse.lapsed) continue;
    if (!cluster.has(lapse.placeId)) continue;
    if (now - lapse.dueTick > TELL_TUNING.LAPSE_LOOKBACK_TICKS) continue;
    rows.push({
      errandId: text(errand.id),
      kind: lapse.kind,
      placeId: lapse.placeId,
      dueTick: lapse.dueTick,
    });
  }
  return { count: rows.length, rows: Object.freeze(rows), termsAbsent: TELL_TERMS_ABSENT };
}
