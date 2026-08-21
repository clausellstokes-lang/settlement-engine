// applyWorldPulseStressorMerge — the commutative stressor upsert the apply pass uses to
// fold an incoming stressor into a standing one. Split verbatim out of applyWorldPulse.js
// by THE DECOMPOSITION WAVE (war tranche, file 4); the body is byte-identical to its
// pre-split declaration.
import { clamp01 } from '../../kernel/math.js';

/**
 * The stressor upsert merge. Birth time is sacred (FIRST createdAt wins). For the
 * legacy single-write path (a fresh birth, or an escalation/spread re-upsert of a
 * PRE-TICK record), this is byte-identical to the prior behavior: take the
 * incoming stressor wholesale, preserve createdAt, stamp updatedAt.
 *
 * The COMMUTATIVE branch fires when the prior record was minted THIS SAME tick
 * (prior.createdAt === now) OR the caller flags `forceCommutative` — i.e. two
 * outcomes collided on the same stressor id within one apply pass. That covers
 * Feature D's same-tick multi-seat religious conversions seeding one fresh
 * `religious_conversion_fracture` record (createdAt === now), AND — via the
 * caller's this-pass write tracking — multiple spread/escalate outcomes of a
 * PRE-TICK record colliding in one tick: without forceCommutative the second
 * write would clobber the first as order-dependent last-write-wins,
 * silently dropping spread targets and reverting escalate↔spread effects. The
 * merge is a FIELD-MERGE that cannot depend on apply order: UNION of
 * affectedSettlementIds, MAX of severity, MAX of per-settlement
 * severityBySettlement, MAX peakSeverity. So reversing the outcome order yields a
 * byte-identical record.
 */
export function mergeStressorUpsert(/** @type {any} */ prior, /** @type {any} */ incoming, /** @type {any} */ now, /** @type {boolean} */ forceCommutative = false, /** @type {number} */ tick = NaN) {
  // Wind-down ceiling: a war stressor that wound down THIS tick (its sponsoring
  // hostility ended) must not be re-raised by a same-tick escalate/spread of the
  // same record —
  // that would defeat the wind-down's purpose of letting the next aging tick end
  // the war. When the prior carries a this-tick windDown stamp, the wound-down
  // severity is a hard ceiling for the merged result.
  const windDownCeiling = prior?.originContext?.windDown?.tick === tick
    ? clamp01(prior.severity ?? 0)
    : null;
  const capSeverity = (/** @type {number} */ s) => (windDownCeiling == null ? s : Math.min(s, windDownCeiling));
  const base = { ...incoming, createdAt: prior?.createdAt || now, updatedAt: now };
  // The commutative path fires for a SAME-TICK collision (prior born this tick)
  // or when the caller has already written this id earlier in the same pass.
  //
  // KNOWN-DEFERRED ([worldpulse-core-4], OWNER-GATED — Wave-5 bornTick piggyback):
  // `createdAt === now` is a same-tick BIRTH PROXY. advanceInterval threads ONE
  // pinned `now` across every synchronous tick of a composed advance, so a stressor
  // born at interval-tick 3 still satisfies createdAt===now when tick 9 re-upserts
  // it — taking the commutative max/union branch meant for same-apply-pass
  // collisions, so within one advance a re-upsert can only ratchet up, while the
  // same world advanced week-by-week (distinct `now`) gets legacy replace semantics.
  // The clean fix — switch the collision test to a per-record bornTick===tick stamp
  // (the `tick` param is already threaded for this) — REQUIRES stamping bornTick on
  // every persisted stressor: a persistence-SHAPE change that shifts same-seed
  // stressor goldens, so it is parked for the owner-signed UPDATE_GOLDEN regen
  // (TEMPORAL_AUDIT §3c / backlog Wave-5). No non-shifting interim exists — threading
  // `tick` as the collision key shifts the same goldens. See the G1c deferral ledger.
  if (!prior || (prior.createdAt !== now && !forceCommutative)) {
    if (windDownCeiling == null) return base;
    // A this-tick wind-down: cap severity AND preserve the prior's windDown
    // stamp (the incoming escalate/spread snapshot carries no originContext, so
    // a wholesale take would erase the wind-down record the aging tick relies on).
    return {
      ...base,
      severity: capSeverity(clamp01(incoming.severity ?? 0)),
      originContext: prior.originContext ?? base.originContext,
    };
  }
  const affected = [...new Set([
    ...(prior.affectedSettlementIds || []),
    ...(incoming.affectedSettlementIds || []),
  ].map(String))].sort();
  // Codepoint-sort the severityBySettlement keys so the merged object is
  // order-INDEPENDENT under JSON.stringify (object key order is otherwise
  // insertion-dependent and would make the merge non-commutative byte-wise).
  /** @type {Record<string, any>} */
  const mergedSev = {};
  for (const [id, sev] of Object.entries(prior.severityBySettlement || {})) mergedSev[id] = sev;
  for (const [id, sev] of Object.entries(incoming.severityBySettlement || {})) {
    mergedSev[id] = Math.max(mergedSev[id] ?? 0, sev);
  }
  /** @type {Record<string, any>} */
  const severityBySettlement = {};
  for (const id of Object.keys(mergedSev).sort()) severityBySettlement[id] = mergedSev[id];
  const severity = capSeverity(Math.max(prior.severity ?? 0, incoming.severity ?? 0));
  return {
    ...base,
    severity,
    peakSeverity: Math.max(prior.peakSeverity ?? 0, incoming.peakSeverity ?? 0, severity),
    affectedSettlementIds: affected,
    severityBySettlement,
    // Preserve the prior's windDown stamp when capping (incoming carries none).
    // Only on the wind-down path so the existing same-tick commutative merge
    // stays byte-identical.
    ...(windDownCeiling == null ? {} : { originContext: prior.originContext ?? base.originContext }),
  };
}
