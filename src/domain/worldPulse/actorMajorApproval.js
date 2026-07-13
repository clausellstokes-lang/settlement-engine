/**
 * domain/worldPulse/actorMajorApproval.js — Phase 5.5 mover M10a (CL-3, the
 * approval-queue extension). The routing + hold-then-expire toolkit for
 * ACTOR-INITIATED CAMPAIGN-ALTERING MAJORS (a war declaration, a coup) under the
 * §11 routine-autonomy mode.
 *
 * THE §11 PROMISE routine finally keeps: "ordinary auto, MAJORS need approval".
 * M9d already routes the two forcing modes (dm_only / recommendations) — every
 * candidate proposes. M10a completes ROUTINE for the actor-initiated majors: a
 * war declaration and a coup route through the SAME approval queue (worldState.
 * proposals — reusing M9d's siege_initiation proposalPayload seam) instead of
 * auto-applying.
 *
 * THE CONSTITUTIONAL GATE (byte-identity). Routine is the DEFAULT/legacy world —
 * the M9d siege pins run under plain routine and expect the INLINE auto-mint
 * (domainState(routine,'war')==='auto'), and the goldens carry no held major. So
 * the routing is GATED behind an OPT-IN: `simulationRules.routineMajorApproval`.
 * ABSENT (every legacy/default profile, every pin, every golden) ⇒ the routing
 * never fires ⇒ byte-identical, VERBATIM. Set (the realm dials it in) ⇒ routine
 * gains the majors-need-approval behavior. The flag is a TOLERANT READ, DELIBERATELY
 * absent from DEFAULT_SIMULATION_RULES: it costs ZERO first-paint bytes (no eager
 * key, no accessor branch) and off-by-absence is the dormancy law, executed.
 *
 * HOLD-THEN-EXPIRE. A held major is the proposing actor's "defensive posture": it
 * sits pending in the queue while the actor waits on the DM's word. It NEVER
 * blocks the advance (proposals are a side queue — the world advances around
 * them). After ACTOR_MAJOR_HOLD_WEEKS with no approval it EXPIRES TO DECLINE —
 * the actor stands down, the held action simply never lands (it was withheld all
 * along), and the actor is free to try again later. Expiry can NEVER deadlock:
 * it only ever RETIRES a pending record, it never waits on one.
 */

/**
 * ⚠️ OWNER-DECISION DEFAULT (M10a). How many weeks a held actor-initiated major
 * waits for the DM before it EXPIRES TO DECLINE. A best-judgment default in the
 * owner's suggested 4–8 week band: 6 weeks ≈ a month and a half — long enough that
 * a DM who steps away for a session still finds the declaration waiting, short
 * enough that an ignored warlord visibly stands down rather than menacing forever.
 * A NAMED, RETUNABLE constant — the owner reviews the value later. (The catch-up
 * cap, the OTHER M10 owner-decision default, lands with M10b's living/autonomous
 * progression — it is NOT part of this slice.)
 * @type {number}
 */
export const ACTOR_MAJOR_HOLD_WEEKS = 6;

/**
 * The candidateTypes M10a routes through the approval queue under routine-with-
 * major-approval: the two ACTOR-INITIATED majors M9 made autonomous — a war
 * declaration (strategy_deploy, the M9d siege-initiation seam) and a coup
 * (coup_succeeded, the seat changing hands). NOTE these are INITIATIONS, not the
 * bounded CONSEQUENCES of an already-approved premise: conquest and vassalization
 * (the unwinding of an approved siege) stay AUTO by the change-authority
 * philosophy — the DM approved the war, its resolution follows. Kept as a Set for
 * the O(1) routing check authorityFor makes on every candidate.
 * @type {ReadonlySet<string>}
 */
export const ACTOR_INITIATED_MAJOR_TYPES = new Set(['strategy_deploy', 'coup_succeeded']);

/**
 * Is this changeType one of the actor-initiated majors M10a routes under routine?
 * @param {string} changeType
 * @returns {boolean}
 */
export function isActorInitiatedMajorType(changeType) {
  return ACTOR_INITIATED_MAJOR_TYPES.has(changeType);
}

/**
 * The routine major-approval OPT-IN read (tolerant, total on garbage). ABSENT ⇒
 * false ⇒ the routing is dormant ⇒ byte-identical. Only an explicit boolean true
 * arms it. Deliberately NOT in DEFAULT_SIMULATION_RULES (zero eager bytes).
 * @param {Record<string, unknown> | null | undefined} rules
 * @returns {boolean}
 */
export function routineMajorApprovalEnabled(rules) {
  return !!(rules && typeof rules === 'object' && rules.routineMajorApproval === true);
}

/**
 * Is there already a PENDING actor-major proposal of this kind for this actor?
 * The dedup / HOLD guard: a held war-init withholds its deployment, so the
 * mobilized besieger would otherwise re-propose the identical siege every tick,
 * spamming the queue. While its proposal sits pending, the actor HOLDS — no
 * duplicate. Keyed on the outcome's targetSaveId (the acting settlement).
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {string} candidateType
 * @param {string} actorId
 * @returns {boolean}
 */
export function pendingActorMajorFor(worldState, candidateType, actorId) {
  const proposals = worldState && Array.isArray(worldState.proposals) ? worldState.proposals : null;
  if (!proposals) return false;
  const id = String(actorId);
  return proposals.some(p => p
    && p.status === 'pending'
    && p.outcome?.candidateType === candidateType
    && String(p.outcome?.targetSaveId) === id);
}

/**
 * HOLD-THEN-EXPIRE. Retire every PENDING actor-initiated-major proposal that has
 * waited ACTOR_MAJOR_HOLD_WEEKS or longer since it was queued — the actor stands
 * down (status 'expired', an EXPIRE-TO-DECLINE). Pure + total: legacy/default
 * worlds never hold such a proposal (routing is gated off), so nothing matches ⇒
 * the SAME worldState reference is returned ⇒ byte-identical. Never deadlocks: it
 * only ever retires records, it never waits on one.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {number} tick    the current world tick (weeks are ticks on the one-week grid)
 * @param {string} [now]   ISO stamp for the retire (updatedAt/expiredAt)
 * @returns {Record<string, unknown> | null | undefined} worldState, unchanged ref if nothing expired
 */
export function expireStaleActorMajors(worldState, tick, now) {
  const proposals = worldState && Array.isArray(worldState.proposals) ? worldState.proposals : null;
  if (!proposals || !proposals.length) return worldState;
  const nowTick = Math.max(0, Math.floor(Number.isFinite(tick) ? Number(tick) : 0));
  let mutated = false;
  const next = proposals.map(p => {
    if (p
      && p.status === 'pending'
      && ACTOR_INITIATED_MAJOR_TYPES.has(p.outcome?.candidateType)
      && Number.isFinite(p.tick)
      && nowTick - Number(p.tick) >= ACTOR_MAJOR_HOLD_WEEKS) {
      mutated = true;
      return { ...p, status: 'expired', expiredAt: now || p.updatedAt, updatedAt: now || p.updatedAt };
    }
    return p;
  });
  if (!mutated) return worldState;
  return { ...worldState, proposals: next };
}
