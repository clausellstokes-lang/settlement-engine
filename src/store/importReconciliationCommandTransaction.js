/**
 * Store projection and local fallback for structured-import commands.
 *
 * Configured mode has one writer: migration 184's RPC. Local-only development
 * uses a recoverable two-key saga and labels it as such; it never claims cloud
 * atomicity. In both modes Zustand changes only after persistence confirms, and
 * an auth/campaign generation or concurrent campaign projection change defers
 * the local projection instead of writing into a replacement session.
 */

import {
  IMPORT_COMMAND_BACKEND,
  commitImportReconciliationCommand,
  importReconciliationCommandBackend,
} from '../lib/importReconciliationCommandPersistence.js';
import { campaigns as campaignService, admitSupabaseCampaignRows } from '../lib/campaigns.js';
import { admitSupabaseSavedSettlementRows, saves as savesService } from '../lib/saves.js';
import {
  captureCampaignSession,
  cloneJson,
  isCurrentCampaignSession,
} from './campaignSliceShared.js';
import {
  captureSavedSettlementsHydration,
  isCurrentSavedSettlementsHydration,
} from './savedSettlementsHydration.js';
import { hydratePersistedCampaignWorld } from './campaignHydration.js';

const CREATE_KIND = 'import.settlement.create-and-attach';
const ATTACH_KIND = 'import.campaign.attach-existing';

function id(value) {
  return value == null ? null : String(value);
}

function activeCampaign(campaign) {
  return (campaign?.accessState || 'active') === 'active';
}

function currentMembershipCampaignIds(campaigns, saveId) {
  return (campaigns || [])
    .filter(campaign => (
      activeCampaign(campaign)
      && Array.isArray(campaign.settlementIds)
      && campaign.settlementIds.some(memberId => id(memberId) === id(saveId))
    ))
    .map(campaign => id(campaign.id))
    .filter(Boolean)
    .sort();
}

function sameIds(left, right) {
  const leftIds = [...new Set((left || []).map(id).filter(Boolean))].sort();
  const rightIds = [...new Set((right || []).map(id).filter(Boolean))].sort();
  return (
    leftIds.length === rightIds.length
    && leftIds.every((value, index) => value === rightIds[index])
  );
}

function rehomeCampaignSnapshot(campaigns, targetCampaignId, saveId, changedAt) {
  const targetId = id(targetCampaignId);
  const memberId = id(saveId);
  return (campaigns || []).map((campaign) => {
    if (!activeCampaign(campaign)) return campaign;
    const campaignId = id(campaign.id);
    const members = Array.isArray(campaign.settlementIds)
      ? campaign.settlementIds
      : [];
    const held = members.some(value => id(value) === memberId);
    const target = campaignId === targetId;
    if (!held && !target) return campaign;

    const settlementIds = members.filter(value => id(value) !== memberId);
    if (target) settlementIds.push(saveId);
    let worldState = campaign.worldState;
    if (!target && Array.isArray(worldState?.pendingEvents)) {
      worldState = {
        ...worldState,
        pendingEvents: worldState.pendingEvents.filter(
          event => id(event?.saveId) !== memberId,
        ),
      };
    }
    return {
      ...campaign,
      settlementIds,
      ...(worldState === campaign.worldState ? {} : { worldState }),
      updatedAt: changedAt,
      pendingSync: false,
    };
  });
}

/**
 * Describe only the campaign envelopes changed by an exclusive rehome.
 *
 * Local persistence supports coordinated per-campaign upserts. Retaining the
 * original envelope alongside its replacement gives the local saga both a
 * narrow write set and an exact compensation value if a later upsert fails.
 */
function changedCampaignTransitions(previousCampaigns, nextCampaigns) {
  return nextCampaigns.flatMap((nextCampaign, index) => {
    const previousCampaign = previousCampaigns[index];
    if (nextCampaign === previousCampaign) return [];
    return [{
      id: id(nextCampaign?.id),
      previous: cloneJson(previousCampaign),
      next: cloneJson(nextCampaign),
      previousFingerprint: JSON.stringify(previousCampaign),
    }];
  });
}

function affectedCampaignsAreCurrent(campaigns, transitions) {
  return transitions.every((transition) => {
    const current = (campaigns || []).find(
      campaign => id(campaign?.id) === transition.id,
    );
    return (
      current != null
      && JSON.stringify(current) === transition.previousFingerprint
    );
  });
}

/**
 * R-3 (R-1 deferral): an import rewrites campaign content (membership rehome,
 * pending-event prune), so pulse/proposal undo snapshots captured BEFORE it
 * hold pre-import worlds — restoring one would resurrect the old membership.
 * Drop both stacks' entries for exactly the campaigns this command changed,
 * the campaign-delete sweep pattern (campaignDeletionSession.js). The
 * advance-depth counter is deliberately untouched: the campaigns still exist
 * and their logical advance history is unchanged.
 *
 * @param {Object} state       the store draft inside set()
 * @param {Map<string, *>} changedById campaign ids the import rewrote
 */
function dropUndoSnapshotsForCampaigns(state, changedById) {
  if (state.pulseUndoStack?.length) {
    state.pulseUndoStack = state.pulseUndoStack.filter(
      snapshot => !changedById.has(id(snapshot.campaignId)),
    );
  }
  if (state.proposalUndoStack?.length) {
    state.proposalUndoStack = state.proposalUndoStack.filter(
      snapshot => !changedById.has(id(snapshot.campaignId)),
    );
  }
}

function commandRefusal(reason, status = 'failed', result = null) {
  return {
    ok: false,
    status,
    reason,
    result,
    persistenceState: 'not-committed',
  };
}

function sessionSnapshot(state, ownerId) {
  return {
    campaign: captureCampaignSession(state, ownerId),
    saves: captureSavedSettlementsHydration(state, ownerId),
    campaignsRef: state.campaigns,
    savesRef: state.savedSettlements,
  };
}

function sessionIsCurrent(state, snapshot) {
  return (
    isCurrentCampaignSession(state, snapshot.campaign)
    && Boolean(snapshot.saves)
    && isCurrentSavedSettlementsHydration(state, snapshot.saves)
  );
}

function resultForApplied(command, remote, mode, projection) {
  return {
    ok: projection === 'applied',
    status: projection === 'applied' ? 'applied' : 'reconcile-required',
    reason: projection === 'applied'
      ? null
      : 'local_projection_changed_after_commit',
    persistenceState: mode === 'server-atomic' ? 'confirmed' : 'local-confirmed',
    result: {
      mode,
      projection,
      replayed: remote?.replayed === true,
      fingerprint: remote?.fingerprint || null,
      saveId: command.targets.saveId,
      campaignId: command.targets.campaignId,
      membershipPolicy: 'exclusive-rehome',
      receipt: remote?.receipt || null,
    },
  };
}

async function admittedRemoteProjection(remote, command) {
  const campaignAdmission = admitSupabaseCampaignRows(remote.campaignRows);
  if (
    campaignAdmission.diagnostics.rejected > 0
    || campaignAdmission.entries.length !== remote.campaignRows.length
  ) {
    throw Object.assign(
      new Error('The server returned an unreadable campaign projection.'),
      { code: 'import_campaign_projection_invalid' },
    );
  }

  let save = null;
  if (command.kind === CREATE_KIND && remote.saveRow) {
    const saveAdmission = await admitSupabaseSavedSettlementRows([remote.saveRow]);
    if (
      saveAdmission.diagnostics.rejected > 0
      || saveAdmission.entries.length !== 1
    ) {
      throw Object.assign(
        new Error('The server returned an unreadable settlement projection.'),
        { code: 'import_save_projection_invalid' },
      );
    }
    [save] = saveAdmission.entries;
  }
  return {
    campaigns: campaignAdmission.entries.map(hydratePersistedCampaignWorld),
    save,
  };
}

function applyRemoteProjection(set, get, snapshot, projection, command) {
  const current = get();
  const alreadyDesired = sameIds(
    currentMembershipCampaignIds(current.campaigns, command.targets.saveId),
    [command.targets.campaignId],
  );
  if (
    !sessionIsCurrent(current, snapshot)
    || (
      current.campaigns !== snapshot.campaignsRef
      && !alreadyDesired
    )
    || (
      command.kind === CREATE_KIND
      && current.savedSettlements !== snapshot.savesRef
      && !current.savedSettlements.some(
        save => id(save?.id) === id(command.targets.saveId),
      )
    )
  ) {
    return 'deferred';
  }

  const byCampaignId = new Map(
    projection.campaigns.map(campaign => [id(campaign.id), campaign]),
  );
  set((state) => {
    state.campaigns = state.campaigns.map(campaign => (
      byCampaignId.get(id(campaign.id)) || campaign
    ));
    dropUndoSnapshotsForCampaigns(state, byCampaignId);
    if (
      projection.save
      && !state.savedSettlements.some(
        save => id(save?.id) === id(projection.save.id),
      )
    ) {
      state.savedSettlements.unshift(projection.save);
    }
  });
  try {
    campaignService.cache(cloneJson(get().campaigns), snapshot.campaign.ownerId);
  } catch {
    // Cloud remains authoritative. A local cache quota failure must not
    // reinterpret the confirmed server transaction.
  }
  return 'applied';
}

async function runServerTransaction(set, get, snapshot, command) {
  const remote = await commitImportReconciliationCommand({
    ownerId: snapshot.campaign.ownerId,
    commandId: command.commandId,
    kind: command.kind,
    campaignId: command.targets.campaignId,
    saveId: command.targets.saveId,
    sourceChecksum: command.expected.sourceFingerprint,
    importSessionId: command.correlation.importSessionId,
    expectedMembershipCampaignIds:
      command.expected.membershipCampaignIds,
    entry: command.kind === CREATE_KIND ? command.params.entry : null,
  });
  if (remote.status !== 'applied') {
    return commandRefusal(
      remote.reason || remote.status,
      remote.status === 'stale' ? 'stale' : (
        remote.status === 'reconcile-required'
          ? 'reconcile-required'
          : 'failed'
      ),
      { replayed: remote.replayed, receipt: remote.receipt },
    );
  }

  const projection = await admittedRemoteProjection(remote, command);
  const projectionResult = applyRemoteProjection(
    set,
    get,
    snapshot,
    projection,
    command,
  );
  return resultForApplied(
    command,
    remote,
    'server-atomic',
    projectionResult,
  );
}

function importedSaveMatches(save, command) {
  return (
    id(save?.id) === id(command.targets.saveId)
    && save?.settlement?.importedFrom?.source === 'account-export'
    && save?.settlement?.importedFrom?.sourceChecksum
      === command.expected.sourceFingerprint
    && id(save?.settlement?.importedFrom?.sourceId)
      === id(command.params?.entry?.settlement?.importedFrom?.sourceId)
  );
}

async function runLocalTransaction(set, get, snapshot, command) {
  const state = get();
  const expectedIds = command.expected.membershipCampaignIds;
  const actualIds = currentMembershipCampaignIds(
    state.campaigns,
    command.targets.saveId,
  );
  const desiredIds = [command.targets.campaignId];
  const existingSave = state.savedSettlements.find(
    save => id(save?.id) === id(command.targets.saveId),
  );

  if (sameIds(actualIds, desiredIds)) {
    if (command.kind === ATTACH_KIND || importedSaveMatches(existingSave, command)) {
      return resultForApplied(
        command,
        { replayed: true, receipt: { recoveredFrom: 'local-projection' } },
        'local-recoverable-saga',
        'applied',
      );
    }
    return commandRefusal('save_id_unavailable', 'stale');
  }
  if (!sameIds(actualIds, expectedIds)) {
    return commandRefusal('membership_topology_changed', 'stale');
  }
  if (command.kind === ATTACH_KIND && !existingSave) {
    return commandRefusal('save_unavailable', 'stale');
  }
  if (command.kind === CREATE_KIND && existingSave && !importedSaveMatches(existingSave, command)) {
    return commandRefusal('save_id_unavailable', 'stale');
  }

  const changedAt = command.requestedAt || new Date().toISOString();
  const nextCampaigns = rehomeCampaignSnapshot(
    state.campaigns,
    command.targets.campaignId,
    command.targets.saveId,
    changedAt,
  );
  const campaignTransitions = changedCampaignTransitions(
    state.campaigns,
    nextCampaigns,
  );
  const isSessionCurrent = () => sessionIsCurrent(get(), snapshot);
  let saveCreated = false;
  if (command.kind === CREATE_KIND && !existingSave) {
    await savesService.mutateBatch({
      creates: [{
        ...cloneJson(command.params.entry),
        id: command.targets.saveId,
      }],
    }, {
      expectedOwnerId: snapshot.campaign.ownerId,
      isSessionCurrent,
    });
    saveCreated = true;
  }

  const rollbackLocalChanges = async (attemptedTransitions, originalError) => {
    const rollbackFailures = [];
    for (const transition of [...attemptedTransitions].reverse()) {
      try {
        await campaignService.upsert(
          cloneJson(transition.previous),
          snapshot.campaign.ownerId,
          isSessionCurrent,
        );
      } catch (error) {
        rollbackFailures.push(error);
      }
    }
    if (saveCreated) {
      try {
        await savesService.mutateBatch({
          deletes: [command.targets.saveId],
        }, {
          expectedOwnerId: snapshot.campaign.ownerId,
          isSessionCurrent,
        });
      } catch (error) {
        rollbackFailures.push(error);
      }
    }
    if (rollbackFailures.length > 0) {
      throw Object.assign(
        new Error('Local import rollback could not confirm every compensating write.'),
        {
          code: 'local_import_rollback_unconfirmed',
          cause: originalError,
          rollbackFailures,
        },
      );
    }
  };

  if (!affectedCampaignsAreCurrent(get().campaigns, campaignTransitions)) {
    const changedError = Object.assign(
      new Error('An affected campaign changed before local import persistence.'),
      { code: 'local_import_campaign_changed' },
    );
    await rollbackLocalChanges([], changedError);
    return commandRefusal('campaign_projection_changed', 'stale');
  }

  const attemptedTransitions = [];
  try {
    for (const transition of campaignTransitions) {
      if (!affectedCampaignsAreCurrent(get().campaigns, campaignTransitions)) {
        throw Object.assign(
          new Error('An affected campaign changed during local import persistence.'),
          { code: 'local_import_campaign_changed' },
        );
      }
      attemptedTransitions.push(transition);
      await campaignService.upsert(
        cloneJson(transition.next),
        snapshot.campaign.ownerId,
        isSessionCurrent,
      );
    }
  } catch (error) {
    await rollbackLocalChanges(attemptedTransitions, error);
    if (error?.code === 'local_import_campaign_changed') {
      return commandRefusal('campaign_projection_changed', 'stale');
    }
    throw error;
  }

  if (
    !sessionIsCurrent(get(), snapshot)
    || !affectedCampaignsAreCurrent(get().campaigns, campaignTransitions)
  ) {
    return resultForApplied(
      command,
      { receipt: { localSaga: true } },
      'local-recoverable-saga',
      'deferred',
    );
  }
  const changedCampaignsById = new Map(
    campaignTransitions.map(transition => [transition.id, transition.next]),
  );
  set((draft) => {
    draft.campaigns = draft.campaigns.map(campaign => (
      changedCampaignsById.get(id(campaign?.id)) || campaign
    ));
    dropUndoSnapshotsForCampaigns(draft, changedCampaignsById);
    if (command.kind === CREATE_KIND && !existingSave) {
      draft.savedSettlements.unshift({
        ...cloneJson(command.params.entry),
        id: command.targets.saveId,
        savedAt: Date.now(),
        timestamp: changedAt,
        accessState: 'active',
      });
    }
  });
  return resultForApplied(
    command,
    { receipt: { localSaga: true } },
    'local-recoverable-saga',
    'applied',
  );
}

/**
 * Run one admitted command after the campaign-slice entry lock is installed.
 */
export async function runImportReconciliationCommandTransaction({
  set,
  get,
  command,
}) {
  const state = get();
  const ownerId = id(state.auth?.user?.id);
  if (!ownerId) return commandRefusal('owner_context_missing', 'stale');
  const snapshot = sessionSnapshot(state, ownerId);
  if (!snapshot.campaign || !sessionIsCurrent(state, snapshot)) {
    return commandRefusal('owner_session_changed', 'stale');
  }
  const target = state.campaigns.find(
    campaign => id(campaign?.id) === id(command.targets.campaignId),
  );
  if (!target || !activeCampaign(target)) {
    return commandRefusal('target_campaign_unavailable', 'stale');
  }

  const backend = importReconciliationCommandBackend();
  if (backend === IMPORT_COMMAND_BACKEND.OFFLINE) {
    return commandRefusal('offline_authoritative_commit_required');
  }
  if (backend === IMPORT_COMMAND_BACKEND.LOCAL_ONLY) {
    return runLocalTransaction(set, get, snapshot, command);
  }
  return runServerTransaction(set, get, snapshot, command);
}
