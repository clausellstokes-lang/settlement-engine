/**
 * Deterministic existing-campaign reconciliation contract.
 *
 * These tests pin the vertical slice at its important boundaries: hostile
 * source admission, stable proposal identity, explicit decisions, honest
 * preview semantics, and resumable injected execution. Persistence itself is
 * intentionally outside this pure layer.
 */
import { describe, expect, test, vi } from 'vitest';
import { ACCOUNT_EXPORT_VERSION } from '../../src/lib/accountData.js';
import {
  admitExistingCampaignImport,
  admitReconciliationSession,
  applyImportReconciliation,
  decideImportProposal,
  ingestSettlementForgeExport,
  previewImportReconciliation,
  reconciliationDraftToCommandFields,
  reconciliationSourceChecksum,
} from '../../src/lib/importReconciliation.js';
import { MAX_IMPORT_BYTES } from '../../src/lib/accountImport.js';

function sourceSettlement(id, name, settlementPatch = {}, entryPatch = {}) {
  return {
    id,
    name,
    tier: 'town',
    settlement: {
      name,
      tier: 'town',
      config: { terrain: 'plains' },
      ...settlementPatch,
    },
    ...entryPatch,
  };
}

function exportText(patch = {}) {
  return JSON.stringify({
    version: ACCOUNT_EXPORT_VERSION,
    settlements: [],
    campaigns: [],
    ...patch,
  });
}

async function admittedSession(text, options = {}) {
  const ingest = ingestSettlementForgeExport(text, {
    label: 'old-campaign.sf.json',
    ingestedAt: '2026-07-24T12:00:00.000Z',
    storageRef: 'local-file:old-campaign.sf.json',
  });
  expect(ingest.ok).toBe(true);
  const admitted = await admitExistingCampaignImport(ingest.value, {
    targetCampaign: {
      id: 'target-campaign',
      name: 'Current campaign',
      settlementIds: [],
      ...options.targetCampaign,
    },
    existingSettlements: options.existingSettlements || [],
    existingCampaigns: options.existingCampaigns || [],
    sourceCampaignId: options.sourceCampaignId,
  });
  expect(admitted.ok).toBe(true);
  return { ingest: ingest.value, session: admitted.value };
}

function decide(session, index, action, targetSaveId = null) {
  const proposal = session.proposals[index];
  return decideImportProposal(
    session,
    proposal.proposalId,
    targetSaveId ? { action, targetSaveId } : { action },
  );
}

describe('SettlementForge export admission', () => {
  test('source checksums, session ids, proposals, and normalized inputs are stable', async () => {
    const text = exportText({
      settlements: [sourceSettlement('s-1', 'Ashford')],
    });
    const first = await admittedSession(text);
    const second = await admittedSession(text);

    expect(reconciliationSourceChecksum(text)).toBe(first.ingest.source.checksum);
    expect(first.session.sessionId).toBe(second.session.sessionId);
    expect(first.session.proposals).toEqual(second.session.proposals);
    expect(first.session.proposals[0].normalizedInput.settlement.importedFrom)
      .toMatchObject({
        importedAt: null,
        sourceChecksum: first.ingest.source.checksum,
        sourceId: 's-1',
      });

    const changed = exportText({
      settlements: [sourceSettlement('s-1', 'Ashford ')],
    });
    expect(reconciliationSourceChecksum(changed)).not.toBe(first.ingest.source.checksum);
  });

  test('rejects malformed and future envelopes through the account-import wall', () => {
    expect(ingestSettlementForgeExport('not json').ok).toBe(false);
    const future = exportText({ version: ACCOUNT_EXPORT_VERSION + 1 });
    const result = ingestSettlementForgeExport(future);
    expect(result.ok).toBe(false);
    expect(result.diagnostic.message).toMatch(/newer version/i);
  });

  test('enforces the byte cap and rejects blocked JSON keys without throwing', () => {
    const oversized = `{"version":${ACCOUNT_EXPORT_VERSION},"padding":"${
      'x'.repeat(MAX_IMPORT_BYTES)
    }"}`;
    expect(ingestSettlementForgeExport(oversized)).toMatchObject({
      ok: false,
      diagnostic: { code: 'source_too_large' },
    });
    const polluted = `{"version":${ACCOUNT_EXPORT_VERSION},"settlements":[{"settlement":{"__proto__":{"polluted":true}}}],"campaigns":[]}`;
    expect(() => ingestSettlementForgeExport(polluted)).not.toThrow();
    expect(ingestSettlementForgeExport(polluted)).toMatchObject({
      ok: false,
      diagnostic: { code: 'source_json_boundary_invalid' },
    });
  });

  test('isolates bad records and reports unsupported campaign material', async () => {
    const text = exportText({
      settlements: [
        sourceSettlement('good', 'Ashford'),
        { id: 'broken', name: 'Broken row' },
      ],
      campaigns: [{
        id: 'source-campaign',
        name: 'Old realm',
        settlementIds: ['good', 'broken', 'missing'],
        mapState: { placements: [] },
        worldState: { tick: 9 },
      }],
    });
    const { session } = await admittedSession(text);

    expect(session.proposals.map(proposal => proposal.sourceSaveId)).toEqual(['good']);
    expect(session.unsupported.map(issue => issue.code)).toEqual(expect.arrayContaining([
      'settlement_record_unsupported',
      'source_campaign_member_missing',
      'campaign_map_not_imported',
      'world_state_not_imported',
    ]));
  });

  test('requires a source-campaign choice when an export contains several', async () => {
    const text = exportText({
      settlements: [
        sourceSettlement('a', 'Ashford'),
        sourceSettlement('b', 'Bellweather'),
      ],
      campaigns: [
        { id: 'one', name: 'One', settlementIds: ['a'] },
        { id: 'two', name: 'Two', settlementIds: ['b'] },
      ],
    });
    const ingest = ingestSettlementForgeExport(text);
    const missing = await admitExistingCampaignImport(ingest.value, {
      targetCampaign: { id: 'target-campaign', settlementIds: [] },
      existingSettlements: [],
    });
    expect(missing.ok).toBe(false);
    expect(missing.diagnostic.code).toBe('source_campaign_required');

    const selected = await admitExistingCampaignImport(ingest.value, {
      targetCampaign: { id: 'target-campaign', settlementIds: [] },
      existingSettlements: [],
      sourceCampaignId: 'two',
    });
    expect(selected.value.proposals.map(proposal => proposal.sourceSaveId)).toEqual(['b']);
  });
});

describe('candidate evidence and explicit decisions', () => {
  test('ranks stable ids/provenance above names and exposes ambiguous names', async () => {
    const text = exportText({
      settlements: [
        sourceSettlement('stable-id', 'Ashford'),
        sourceSettlement('legacy-id', 'Bellweather'),
        sourceSettlement('name-only', 'Crossing'),
      ],
    });
    const checksum = reconciliationSourceChecksum(text);
    const existingSettlements = [
      { id: 'stable-id', name: 'Renamed Ashford', settlement: {} },
      {
        id: 'copied-before',
        name: 'Renamed Bellweather',
        settlement: {
          importedFrom: { sourceId: 'legacy-id', sourceChecksum: checksum },
        },
      },
      { id: 'crossing-a', name: 'Crossing', settlement: {} },
      { id: 'crossing-b', name: 'Crossing', settlement: {} },
    ];
    const { session } = await admittedSession(text, { existingSettlements });

    expect(session.proposals[0].candidates[0].matchClass).toBe('stable_source_id');
    expect(session.proposals[0].candidates[0].confidence).toBe('exact');
    expect(session.proposals[1].candidates[0].matchClass).toBe('stable_import_provenance');
    expect(session.proposals[2].candidates).toHaveLength(2);
    expect(session.conflicts).toContainEqual(expect.objectContaining({
      proposalId: session.proposals[2].proposalId,
      code: 'multiple_name_matches',
    }));
  });

  test('keeps duplicate source identities visible instead of silently collapsing them', async () => {
    const text = exportText({
      settlements: [
        sourceSettlement('duplicate-id', 'First Ashford'),
        sourceSettlement('duplicate-id', 'Second Ashford'),
      ],
    });
    const { session } = await admittedSession(text);
    expect(session.proposals).toHaveLength(2);
    expect(session.conflicts.filter(conflict => (
      conflict.code === 'duplicate_source_identity'
    ))).toHaveLength(2);
  });

  test('requires every choice and never turns authored prose into mechanics', async () => {
    const text = exportText({
      settlements: [
        sourceSettlement('new', 'Ashford', {
          description: 'The king declared war and the granary burned.',
          neighbourNetwork: [{ id: 'foreign', name: 'Foreign place' }],
        }),
        sourceSettlement('existing', 'Bellweather'),
        sourceSettlement('skip', 'Crossing'),
        sourceSettlement('defer', 'Deepmere'),
      ],
    });
    const { session: initial } = await admittedSession(text, {
      targetCampaign: { settlementIds: ['existing'] },
      existingSettlements: [{ id: 'existing', name: 'Bellweather', settlement: {} }],
    });
    const incomplete = previewImportReconciliation(initial);
    expect(incomplete.ok).toBe(false);
    expect(incomplete.code).toBe('decisions_incomplete');

    let session = decide(initial, 0, 'create');
    session = decide(session, 1, 'match', 'existing');
    session = decide(session, 2, 'skip');
    session = decide(session, 3, 'defer');
    const result = previewImportReconciliation(session);

    expect(result.ok).toBe(true);
    expect(result.preview.decisionCounts).toMatchObject({
      create: 1,
      match: 1,
      skip: 1,
      defer: 1,
      undecided: 0,
    });
    expect(result.preview.effects.membershipsAlreadyPresent).toBe(1);
    expect(result.value.commandDrafts).toHaveLength(2);
    const createDraft = result.value.commandDrafts.find(draft => (
      draft.kind === 'import.settlement.create-and-attach'
    ));
    const matchDraft = result.value.commandDrafts.find(draft => (
      draft.kind === 'import.campaign.attach-existing'
    ));
    expect(createDraft.params.entry.settlement.description).toMatch(/declared war/);
    expect(createDraft.params.relationshipPolicy).toBe('defer');
    expect(createDraft.params.entry.settlement.neighbourNetwork).toEqual([]);
    expect(matchDraft.params).not.toHaveProperty('entry');
    expect(result.value.claims).toHaveLength(4);
    expect(result.value.claims[0].normalizedText).toBe('Ashford');
    expect(result.preview.epistemic.simulatesCommands).toBe(false);
    expect(result.preview.unresolvedConflictCount).toBe(0);
  });

  test('discloses every exclusive-membership removal before rehoming', async () => {
    const text = exportText({
      settlements: [sourceSettlement('source', 'Bellweather')],
    });
    const existingSettlements = [{
      id: 'existing',
      name: 'Bellweather',
      settlement: {},
    }];
    const { session: initial } = await admittedSession(text, {
      existingSettlements,
      existingCampaigns: [
        { id: 'old-a', name: 'Old A', settlementIds: ['existing'] },
        { id: 'old-b', name: 'Old B', settlementIds: ['existing'] },
      ],
    });
    const preview = previewImportReconciliation(
      decide(initial, 0, 'match', 'existing'),
    );

    expect(preview.preview.effects).toMatchObject({
      membershipsToAdd: 1,
      membershipsToRemove: 2,
      settlementsToRehome: 1,
    });
    expect(preview.preview.membershipTransfers).toEqual([{
      proposalId: initial.proposals[0].proposalId,
      saveId: 'existing',
      fromCampaigns: [
        { campaignId: 'old-a', campaignName: 'Old A' },
        { campaignId: 'old-b', campaignName: 'Old B' },
      ],
      toCampaignId: 'target-campaign',
    }]);
    expect(preview.value.commandDrafts[0].expected.membershipCampaignIds)
      .toEqual(['old-a', 'old-b']);
  });

  test('rejects a match target not present in the proposal evidence', async () => {
    const text = exportText({
      settlements: [sourceSettlement('source', 'Ashford')],
    });
    const { session } = await admittedSession(text);
    expect(() => decide(session, 0, 'match', 'invented-target')).toThrow(
      /not a candidate/i,
    );
  });
});

describe('preview execution and recovery receipts', () => {
  async function twoDraftPreview() {
    const text = exportText({
      settlements: [
        sourceSettlement('one', 'Ashford'),
        sourceSettlement('two', 'Bellweather'),
      ],
    });
    const { session: initial } = await admittedSession(text);
    const decided = decide(decide(initial, 0, 'create'), 1, 'create');
    return previewImportReconciliation(decided).value;
  }

  test('keeps partial receipts and retries only an ordinary known failure', async () => {
    const preview = await twoDraftPreview();
    const firstExecutor = vi.fn(async draft => (
      draft.proposalId === preview.proposals[0].proposalId
        ? { status: 'applied', ok: true, result: { saveId: 'created-one' } }
        : { status: 'failed', ok: false, reason: 'temporary_failure' }
    ));
    const partial = await applyImportReconciliation(preview, {
      executeDraft: firstExecutor,
      attemptedAt: '2026-07-24T13:00:00.000Z',
    });

    expect(partial.ok).toBe(false);
    expect(partial.value.stage).toBe('failed_reconcilable');
    expect(partial.receipt.commandReceipts).toHaveLength(2);
    expect(partial.receipt.recovery.pendingDraftIds).toHaveLength(1);

    const retryExecutor = vi.fn(async () => ({ status: 'applied', ok: true }));
    const resumed = await applyImportReconciliation(partial.value, {
      executeDraft: retryExecutor,
      attemptedAt: '2026-07-24T13:01:00.000Z',
    });
    expect(resumed.ok).toBe(true);
    expect(retryExecutor).toHaveBeenCalledTimes(1);
    expect(resumed.receipt.commandReceipts[0].attempt).toBe(1);
    expect(resumed.receipt.commandReceipts[1].attempt).toBe(2);
  });

  test('holds a thrown adapter for reconciliation instead of retrying blindly', async () => {
    const preview = await twoDraftPreview();
    const thrown = await applyImportReconciliation(preview, {
      executeDraft: async () => { throw new Error('transport outcome unknown'); },
    });
    expect(thrown.ok).toBe(false);
    expect(thrown.receipt.failures.every(failure => failure.needsReconciliation))
      .toBe(true);

    const unsafeRetry = vi.fn(async () => ({ status: 'applied', ok: true }));
    const held = await applyImportReconciliation(thrown.value, {
      executeDraft: unsafeRetry,
    });
    expect(held.ok).toBe(false);
    expect(unsafeRetry).not.toHaveBeenCalled();
  });

  test('treats a contradictory reconcile-required receipt as unresolved', async () => {
    const preview = await twoDraftPreview();
    const result = await applyImportReconciliation(preview, {
      executeDraft: async () => ({
        status: 'reconcile_required',
        ok: true,
        needsReconciliation: true,
      }),
    });
    expect(result.ok).toBe(false);
    expect(result.receipt.commandReceipts.every(item => item.ok === false)).toBe(true);
    expect(result.receipt.failures.every(item => item.needsReconciliation)).toBe(true);
  });

  test('locks decisions after application starts and rejects a foreign recovery receipt', async () => {
    const preview = await twoDraftPreview();
    const partial = await applyImportReconciliation(preview, {
      executeDraft: async draft => (
        draft.draftId === preview.commandDrafts[0].draftId
          ? { status: 'applied', ok: true }
          : { status: 'failed', ok: false, reason: 'retry later' }
      ),
    });
    expect(() => decide(
      partial.value,
      0,
      'skip',
    )).toThrow(/cannot be changed/i);
    expect(previewImportReconciliation(partial.value)).toMatchObject({
      ok: false,
      code: 'application_already_started',
    });

    const foreign = await applyImportReconciliation(preview, {
      executeDraft: async () => ({ status: 'applied', ok: true }),
      priorReceipt: {
        ...partial.receipt,
        sessionId: 'another-session',
      },
    });
    expect(foreign).toMatchObject({
      ok: false,
      code: 'prior_receipt_mismatch',
    });
  });

  test('does nothing without an adapter and makes stable command-envelope fields', async () => {
    const preview = await twoDraftPreview();
    const unavailable = await applyImportReconciliation(preview);
    expect(unavailable).toMatchObject({
      ok: false,
      code: 'command_adapter_unavailable',
    });
    expect(unavailable.value.applicationReceipt).toBeNull();

    const first = reconciliationDraftToCommandFields(preview.commandDrafts[0], {
      accountId: 'owner-1',
      sessionEpoch: 'epoch-7',
      importSessionId: preview.sessionId,
    });
    const second = reconciliationDraftToCommandFields(preview.commandDrafts[0], {
      accountId: 'owner-1',
      sessionEpoch: 'epoch-7',
      importSessionId: preview.sessionId,
    });
    expect(first).toEqual(second);
    expect(first.commandId).toMatch(/^cmd:import-reconciliation:/);
    expect(first.ownerRef).toEqual({ accountId: 'owner-1' });
  });
});

describe('serialized-session admission', () => {
  test('rejects future versions, duplicates, executable values, and cycles', async () => {
    const preview = await (async () => {
      const text = exportText({ settlements: [sourceSettlement('one', 'Ashford')] });
      const { session } = await admittedSession(text);
      return previewImportReconciliation(decide(session, 0, 'create')).value;
    })();

    expect(admitReconciliationSession({ ...preview, schemaVersion: 2 }).ok).toBe(false);
    expect(admitReconciliationSession({
      ...preview,
      stage: 'cancelled',
    })).toMatchObject({
      ok: false,
      code: 'session_stage_invalid',
    });
    expect(admitReconciliationSession({
      ...preview,
      proposals: [...preview.proposals, preview.proposals[0]],
    }).code).toBe('proposal_id_duplicate');
    expect(admitReconciliationSession({
      ...preview,
      commandDrafts: [...preview.commandDrafts, preview.commandDrafts[0]],
    }).code).toBe('command_draft_id_duplicate');
    expect(admitReconciliationSession({
      ...preview,
      source: { ...preview.source, execute: () => {} },
    }).ok).toBe(false);

    const cyclic = JSON.parse(JSON.stringify(preview));
    cyclic.scope.loop = cyclic;
    expect(admitReconciliationSession(cyclic).ok).toBe(false);
  });
});
