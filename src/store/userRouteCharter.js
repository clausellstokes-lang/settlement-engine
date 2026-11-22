/**
 * userRouteCharter.js — the store verb behind directive 3.
 *
 * One action, three jobs, in this order and no other: derive the route from the
 * frozen map, mint the durable command identity, and hand it to the SAME command
 * runtime every other server-authoritative canon event uses. The only state this
 * verb writes is its own in-flight fence; the settlement rows belong to the
 * canon-event transaction, which writes them only after the database has
 * confirmed BOTH endpoints.
 *
 * Why the derivation happens HERE and not in the picker: the button and the writer
 * must agree about what is legal, and the only way to guarantee that is for both
 * to call the same pure validator. The picker previews with it; this action
 * re-runs it at commit time, because the world can move between a preview and a
 * click (a partner deleted, a realm re-canonized, the same route chartered in
 * another tab).
 */

import { validateUserRoute } from '../domain/roads/userRoutes.js';
import { activeSpatialDigest } from '../domain/spatial/distanceRead.js';
import { canonEventCommand } from '../application/commands/adapters/canonEventApply.js';
import { executeSessionCommand } from '../application/commands/sessionCommandRuntime.js';
import { makeActionResult } from './actionResult.js';

function refusal(reason, fields = {}) {
  return {
    ...makeActionResult('charterUserRoute', {
      ok: false,
      before: { reason, ...fields },
      after: null,
    }),
    reason,
  };
}

function savedEntry(state, saveId) {
  return (state.savedSettlements || []).find(
    (entry) => String(entry?.id) === String(saveId),
  ) || null;
}

function campaignFor(state, saveId) {
  return (state.campaigns || []).find((candidate) => (
    (candidate.settlementIds || []).map(String).includes(String(saveId))
  )) || null;
}

/**
 * Charter a user route from the active save to another settlement of its realm.
 *
 * @param {{
 *   set:Function,
 *   get:Function,
 *   partnerSaveId:string,
 *   now?:string|null,
 *   executeCommand?:typeof executeSessionCommand,
 * }} input
 */
export async function charterUserRouteImpl(input) {
  const state = input.get();
  const saveId = state.activeSaveId == null ? null : String(state.activeSaveId);
  const partnerSaveId = String(input.partnerSaveId || '');
  if (!saveId) return refusal('no_active_save');
  if (state.phase !== 'canon') return refusal('canon_phase_required');
  const self = savedEntry(state, saveId);
  const partner = savedEntry(state, partnerSaveId);
  if (!self || !partner) return refusal('endpoint_missing');

  const campaign = campaignFor(state, saveId);
  if (!campaign) return refusal('realm_missing');
  const digest = activeSpatialDigest(campaign.worldState);
  const validation = validateUserRoute({
    digest,
    fromSaveId: saveId,
    toSaveId: partnerSaveId,
    fromSettlement: state.settlement,
    toSettlement: partner.settlement,
    memberIds: (campaign.settlementIds || []).map(String),
  });
  if (validation.ok === false) return refusal(validation.reason);

  const [a, b] = [saveId, partnerSaveId].sort();
  const event = {
    type: 'CREATE_ROUTE',
    targetId: partner.name || partner.settlement?.name || partnerSaveId,
    payload: {
      routeId: validation.routeId,
      mode: validation.mode,
      cost: validation.cost,
      band: validation.band,
      a,
      b,
      createdTick: Number(campaign.worldState?.tick) || 0,
      selfSaveId: saveId,
      selfName: state.settlement?.name || self.name || '',
      selfTier: self.tier ?? null,
      partnerSaveId,
      partnerName: partner.name || partner.settlement?.name || '',
      partnerTier: partner.tier ?? null,
    },
  };
  const ownerId = state.auth?.user?.id == null
    ? null
    : String(state.auth.user.id);
  // requestedAt is NOT optional here. canonEventCommandRecovery refuses to
  // auto-recover any command without one, because preparation falls back to a
  // wall clock and an attempt whose answer was lost could not then be reproduced
  // byte-for-byte. A charter that cannot be recovered is a charter that can be
  // silently lost, so the verb stamps its own time rather than passing null.
  const requestedAt = input.now ?? new Date().toISOString();
  const command = canonEventCommand(
    { saveId, proposalIndex: 0, event },
    {
      ownerId,
      revision: self.timestamp == null ? null : String(self.timestamp),
      now: requestedAt,
      // The DM pressed a button in their own library: 'manual' is the envelope's
      // word for exactly that, beside 'surveyor' (AI-proposed) and 'system'.
      provenance: 'manual',
    },
  );
  // The picker is not the only surface that can reach this verb, and the command
  // is async: two charters entered before either resolves would race for the same
  // pair. The server refuses the loser (the second command sees a moved base), but
  // a refusal the user never asked for is a worse answer than a disabled control.
  // This fence is the client's half; migration 193's lock order is the real one.
  if (state.userRouteCharterInFlight) return refusal('charter_in_flight');
  input.set((draft) => { draft.userRouteCharterInFlight = validation.routeId; });
  const run = input.executeCommand || executeSessionCommand;
  try {
    return await run(command, {
      ownerId,
      saveId,
      campaignId: campaign.id == null ? null : String(campaign.id),
      revision: self.timestamp == null ? null : String(self.timestamp),
      now: requestedAt,
      journalScope: input.get,
      actions: { applyEvent: state.applyEvent },
    });
  } finally {
    input.set((draft) => {
      if (draft.userRouteCharterInFlight === validation.routeId) {
        draft.userRouteCharterInFlight = null;
      }
    });
  }
}
