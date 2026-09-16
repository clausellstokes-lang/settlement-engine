/**
 * foreignPrimacy.js — W-SEAT D2's PRIMACY AXIS: which decisions force can reach.
 *
 * The owner's §735.2 directive says an occupier's influence is "always just
 * greater" than the legitimate ruler's. Law §2.3 says how that promise is kept:
 * **PRIMACY IS ORDERING, WEIGHT IS SCALAR.** Occupation grants structural rights
 * over a TYPED list of decision classes; it never depends on a tuned number
 * staying bigger than another tuned number. A tuning pass can move every float in
 * `SEAT_TUNING` and cannot invert the directive, because the directive does not
 * live in a float. That is the whole reason this file exists as a REGISTER rather
 * than as a bonus term somewhere.
 *
 * ── WHY IT IS NOT IN `authorityFor`, MEASURED ────────────────────────────────
 * The volume first put the axis there ("one edit serving ~30 families").
 * `authorityFor(rules, changeType, legacyMode)` sees ONLY `rules` — no settlement,
 * no snapshot, no worldState (changeAuthorityPolicy.js:366) — so it cannot know
 * whether the deciding town is occupied. A1.1.6 struck the claim; this is where
 * the axis actually lands, at the `candidateEvents` choke where the context is.
 *
 * ── WHY IT IS ITS OWN LEAF ───────────────────────────────────────────────────
 * `rulingPowerSeat.js` answers "WHO looms over the ruler". This answers "WHICH
 * decisions that reach". They are different questions over different vocabularies,
 * and §711.6's lesson is that one home for two questions is exactly how a shared
 * name acquires two meanings with every consumer internally consistent and nothing
 * ever red. JUDGMENT — vetoable.
 *
 * ── THE TYPED CONTRACT IS DISTINCT FROM `applyMode` (A1.1.6) ─────────────────
 * `applyMode` answers "may this apply without approval". Primacy answers "whose
 * decision is this at all". Those are two facts and one string cannot hold both:
 * a candidate marked `proposal` because the campaign runs `dm_only` and one marked
 * `proposal` because a foreign army holds the town are indistinguishable if the
 * routing is the only record. So the RULING is the contract — a typed record
 * naming the seat, the regime, the rung, the band and the decision class — and the
 * routing is one of its dispositions, never its identity.
 *
 * PURE: no rng, no wall clock, no writes, no mutation of any input. Returns the
 * SAME ARRAY REFERENCE when dark or when nothing is ruled, so the choke's
 * reference-preserving discipline (and its byte-identity pin) survives by
 * construction rather than by arithmetic.
 */

import { foreignSeatOf } from '../rulingPowerSeat.js';

/**
 * THE TYPED DISPOSITIONS. Closed, and both members are live.
 *
 * `referred` — the decision belongs to the power that holds the town, so it leaves
 *   the local court's autonomous lane and routes to the authority lane carrying its
 *   ruling. The occupied court still PROPOSES; it no longer DECIDES.
 * `vetoed`   — the local court may not take this decision at all while a foreign
 *   seat holds primacy, and the candidate is refused.
 */
export const FOREIGN_PRIMACY_DISPOSITIONS = Object.freeze(['referred', 'vetoed']);

/**
 * ⛔ THE OVERRIDE CLASS — A CANDIDATE REGISTER, KEYED ON `candidateType`, AND EVERY
 * ROW TRACES TO A NUMBERED LINE OF THE CAR-0 COVERAGE TABLE.
 *
 * ⚠ IT IS KEYED ON `candidateType` AND NOT ON `ruleFamily`, AND THAT IS MEASURED,
 * NOT STYLISTIC. The choke one line above keys `authorityFor` on
 * `ruleFamily || candidateType`, and `ruleFamily` is COARSE: every tier candidate
 * carries `ruleFamily: 'tier'` and every resource candidate `'resource'`, while the
 * whole `'relationship'` family is PRESSURED-ONLY in the coverage table. Keying on
 * the family would have swept in decisions the table explicitly rules OUT of force's
 * reach — the imposed-cult ceiling, internal justice, culture — and it would have
 * done so silently, because a coarser match never reds.
 *
 * ⚠ AND EVERY SPELLING HERE WAS MEASURED AGAINST THE EMITTERS, not copied from the
 * policy table. `CHANGE_AUTHORITY_POLICY` names `tier_change`; no producer ever
 * emits that string — `tierResourceDynamics.js:205` emits `` `tier_${drift.direction}` ``,
 * i.e. `tier_promotion` / `tier_demotion`. A register built from the policy names
 * would have matched NOTHING and passed every existence census while doing nothing
 * at all: the recorded hazard that a shape the corpus never produces looks clean.
 * The pin in tests/domain/foreignPrimacyAxis.test.js asserts every key here is
 * reachable from a real emitter.
 *
 * @type {Readonly<Record<string, { disposition: string, decisionClass: string }>>}
 */
export const FOREIGN_PRIMACY_CLASS = Object.freeze({
  // Car 0 row 1 — war initiation. The occupier decides whether the town it holds
  // marches; it does not merely lobby about it.
  strategy_deploy: Object.freeze({ disposition: 'referred', decisionClass: 'war_initiation' }),
  // Car 0 row 6 — the treaty half of the diplomacy lane. A court under a foreign
  // seat does not repudiate a compact on its own initiative; that is the sovereign
  // act primacy denies, so this one is a VETO rather than a referral.
  treaty_breached: Object.freeze({ disposition: 'vetoed', decisionClass: 'compact_repudiation' }),
  // Car 0 row 6 — conveyance. REFERRED and deliberately not vetoed: the estate's
  // sale machinery can be driven by the occupier THROUGH the court it crowned
  // (conquest relabels the old governing row rather than seating a separate one),
  // so a veto here could refuse the occupier its own act. Routing it to the
  // authority lane is the reading that cannot be wrong in either direction.
  sovereignty_conveyed: Object.freeze({ disposition: 'referred', decisionClass: 'sovereignty_conveyance' }),
  // Car 0 row 7d — A1.2.16 folds tier and resource into the override REACH.
  tier_promotion: Object.freeze({ disposition: 'referred', decisionClass: 'tier_posture' }),
  tier_demotion: Object.freeze({ disposition: 'referred', decisionClass: 'tier_posture' }),
  resource_depletion: Object.freeze({ disposition: 'referred', decisionClass: 'resource_posture' }),
  resource_recovery: Object.freeze({ disposition: 'referred', decisionClass: 'resource_posture' }),
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * ⛔ THE POSITIVE `=== true` SPELLING IS LOAD-BEARING, NOT STYLE. The engine-gated
 * key census (tests/lint/engineGatedRuleKeys.walker.test.js) discovers virtual
 * flags by scanning for exactly this form; a negative-polarity early return reads
 * identically at runtime and is INVISIBLE to it, which leaves the key manifested
 * with no measured gate. SEAT-1 paid a red for that and the scar is recorded here.
 * The flag is read off the RAW worldState because a virtual key has no
 * `DEFAULT_SIMULATION_RULES` entry and the normalizer would strip it.
 * @param {unknown} worldState
 */
function primacyLit(worldState) {
  return asObject(asObject(worldState).simulationRules).foreignSeatEnabled === true;
}

/**
 * THE PRIMACY PASS — a second, flag-gated map after the choke's autonomy routing.
 *
 * @param {unknown[]} candidates the choke's `routed` list
 * @param {unknown} snapshot carries `worldState` and the settlement index
 * @returns {unknown[]} the same reference when nothing is ruled
 */
export function applyForeignPrimacy(candidates, snapshot) {
  if (!Array.isArray(candidates) || candidates.length === 0) return candidates;
  const shaped = asObject(snapshot);
  const worldState = shaped.worldState;
  if (!primacyLit(worldState)) return candidates;

  /** @type {Map<string, ReturnType<typeof foreignSeatOf>>} */
  const seats = new Map();
  /** Resolve once per settlement, not once per candidate — the pass sees hundreds. */
  const seatFor = (/** @type {string} */ sid) => {
    if (!seats.has(sid)) seats.set(sid, foreignSeatOf(worldState, snapshot, sid));
    return seats.get(sid) || null;
  };

  let ruledAny = false;
  /** @type {unknown[]} */
  const ruled = [];
  for (const candidate of candidates) {
    const row = asObject(candidate);
    // The state-only bypass the choke installs one line above must survive this
    // pass. A mechanical condition refresh is reducer bookkeeping, not a political
    // choice, and turning one into a proposal-budget casualty is the exact failure
    // that comment was written to prevent. Undoing it here would have been silent.
    const rule = candidate && row.recordMode !== 'state_only'
      ? FOREIGN_PRIMACY_CLASS[String(row.candidateType ?? '')]
      : null;
    const sid = rule ? String(row.targetSaveId ?? asObject(row.metadata).settlementId ?? '') : '';
    // ⛔ PRIMACY, NOT PRESENCE. A vassal overlord has a real book and NO primacy —
    // law §2.3 gives it a scalar that competes honestly in the seat books and no
    // ordering rights at all. Reading mere seat existence here would have handed
    // every matured vassal the occupier's powers, which is A1.1.8's inversion
    // arriving through a second door.
    const seat = sid ? seatFor(sid) : null;
    if (!rule || !seat || seat.primacy !== true) {
      ruled.push(candidate);
      continue;
    }
    ruledAny = true;
    if (rule.disposition === 'vetoed') continue;
    ruled.push({
      ...row,
      applyMode: 'proposal',
      foreignPrimacy: Object.freeze({
        disposition: rule.disposition,
        decisionClass: rule.decisionClass,
        seatId: seat.patronSettlementId,
        regime: seat.regime,
        band: seat.band,
        rung: seat.rung,
      }),
    });
  }
  return ruledAny ? ruled : candidates;
}
