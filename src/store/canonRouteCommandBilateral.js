/**
 * canonRouteCommandBilateral.js — the partner half of a user-route command.
 *
 * The canon-event transaction is otherwise single-save by construction: it reads
 * the active save, prepares one projection, and swaps one row. A user route needs
 * a second row, and that second row is NOT a second command — it rides the same
 * journal identity and the same PostgreSQL transaction. This module holds the two
 * things that are genuinely different about it: resolving the partner save from
 * the event, and projecting the partner row back after the server confirms.
 *
 * The partner's half is authored by the SAME domain writer the initiating half
 * uses (domain/events/mutateUserRoute.js withUserRouteHalf). That shared writer is
 * why the two rows cannot drift into disagreeing about the road between them, and
 * it is the client-side twin of the server's own both-halves-one-identity proof.
 */

import { withUserRouteHalf } from '../domain/events/mutateUserRoute.js';

function savedEntry(state, saveId) {
  return (state.savedSettlements || []).find(
    (entry) => String(entry?.id) === String(saveId),
  ) || null;
}

/**
 * Resolve and author the partner endpoint for one CREATE_ROUTE command.
 *
 * @param {{state:object, event:object, saveId:string}} input
 * @returns {{ok:true, partnerSaveId:string, partnerBefore:object, partnerNext:object}
 *   | {ok:false, reason:string}}
 */
export function prepareRoutePartner(input) {
  const payload = /** @type {any} */ (input.event)?.payload || {};
  const partnerSaveId = String(payload.partnerSaveId || '');
  if (!partnerSaveId) return { ok: false, reason: 'route_partner_missing' };
  if (partnerSaveId === String(input.saveId)) {
    return { ok: false, reason: 'route_endpoints_not_distinct' };
  }
  const partnerBefore = savedEntry(input.state, partnerSaveId);
  if (!partnerBefore || !partnerBefore.settlement) {
    return { ok: false, reason: 'route_partner_unavailable' };
  }
  const partnerNext = withUserRouteHalf(partnerBefore.settlement, input.event, {
    selfId: partnerSaveId,
    otherId: String(input.saveId),
    otherName: String(payload.selfName || ''),
    otherTier: payload.selfTier ?? null,
  });
  return { ok: true, partnerSaveId, partnerBefore, partnerNext };
}

/**
 * Has the partner's cached row moved since this command read it?
 *
 * MUST be asked of live state, never inside an Immer producer: a draft proxy is
 * not reference-equal to the base object it stands for, so an identity check made
 * against a draft answers "moved" every single time and the projection silently
 * never lands. The initiating save's twin of this question is asked the same way,
 * on `get()` output, immediately before the producer runs.
 *
 * @param {{state:object, partnerSaveId:string, partnerBefore:object}} input
 */
export function routePartnerProjectionChanged(input) {
  const current = savedEntry(input.state, input.partnerSaveId);
  if (!current) return true;
  if (current === input.partnerBefore) return false;
  return JSON.stringify(current.settlement)
    !== JSON.stringify(input.partnerBefore?.settlement);
}

/**
 * Fold the server-confirmed partner row back into the cached save list.
 *
 * The initiating save is projected by the caller alongside the active slice; this
 * one has no active-slice twin, so it only ever updates the cache. Freshness was
 * decided above, before the producer opened.
 *
 * @param {{draft:object, partnerSaveId:string, settlement:object|null}} input
 * @returns {boolean} whether the cached row was replaced
 */
export function projectRoutePartner(input) {
  if (!input.settlement) return false;
  const saves = input.draft?.savedSettlements;
  if (!Array.isArray(saves)) return false;
  const index = saves.findIndex(
    (entry) => String(entry?.id) === String(input.partnerSaveId),
  );
  if (index < 0) return false;
  saves[index] = { ...saves[index], settlement: input.settlement };
  return true;
}
