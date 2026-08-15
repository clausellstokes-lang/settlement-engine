/**
 * canonEventCommandEntry.js — the small Zustand entry seam for an
 * authoritative canon-event command.
 *
 * The slice owns event semantics and campaign ripple. This helper owns only the
 * synchronous in-flight fence, lazy transaction loading, and post-commit bridge.
 * Keeping those concerns together makes the no-dual-write order visible without
 * forcing settlementSlice's already-large action body to carry transport detail.
 */

import { saveEnvelopeFor } from './settlementSliceHelpers.js';

function campaignForSave(state, activeSaveId) {
  if (!activeSaveId || state.phase !== 'canon') return null;
  return (state.campaigns || []).find((candidate) => (
    (candidate.settlementIds || []).map(String).includes(String(activeSaveId))
  )) || null;
}

/**
 * @param {{
 *   get:Function,
 *   set:Function,
 *   event:object,
 *   command:object,
 *   activeSaveId:string|null,
 *   rippleEventThroughWorld:Function,
 * }} input
 * @returns {Promise<unknown>}
 */
export function runAuthoritativeCanonEventFromSlice(input) {
  const {
    get,
    set,
    event,
    command,
    activeSaveId,
    rippleEventThroughWorld,
  } = input;
  const commandId = String(command.commandId || '');

  // Fence synchronously, before the lazy module boundary. A second event in the
  // same turn can therefore never slip between dispatch and transaction claim.
  set((draft) => {
    draft.canonEventCommandFence = {
      commandId,
      saveId: activeSaveId == null ? null : String(activeSaveId),
    };
  });

  return import('./canonEventCommandTransaction.js')
    .then(({ runCanonEventCommandTransaction }) => (
      runCanonEventCommandTransaction({
        get,
        set,
        event,
        command,
        applyLegacy: () => get().applyEvent(event, {
          bypassCommandFence: commandId,
        }),
        afterCommit: ({
          prepared,
          beforeSave,
          stateBefore,
          afterState,
        }) => {
          const campaign = campaignForSave(stateBefore, activeSaveId);
          const beforeEnvelope = activeSaveId
            ? saveEnvelopeFor(
                activeSaveId,
                beforeSave,
                stateBefore.settlement,
                beforeSave?.campaignState,
              )
            : null;
          rippleEventThroughWorld({
            afterState,
            campaign,
            event,
            beforeEnvelope,
            beforeSave,
            activeSaveId,
            afterCampaignState: prepared.nextEventLog
              ? afterState.savedSettlements?.find(
                  (save) => String(save?.id) === String(activeSaveId),
                )?.campaignState
              : null,
          });
          import('../lib/analytics.js').then(({ track, EVENTS }) => {
            track(EVENTS.EVENT_EDIT_APPLIED, { event_type: event.type });
          }).catch(() => {});
        },
      })
    ))
    .finally(() => {
      set((draft) => {
        if (draft.canonEventCommandFence?.commandId === commandId) {
          draft.canonEventCommandFence = null;
        }
      });
    });
}
