/** @vitest-environment jsdom */
/**
 * Private reopen-recovery contract for structured campaign imports.
 *
 * The durable source is always the user's export file. Browser recovery may
 * retain decisions, reviewed ids, and redacted command receipts, but never a
 * normalized settlement or authored source content.
 */

import { beforeEach, describe, expect, test } from 'vitest';
import { ACCOUNT_EXPORT_VERSION } from '../../src/lib/accountData.js';
import {
  admitExistingCampaignImport,
  applyImportReconciliation,
  decideImportProposal,
  ingestSettlementForgeExport,
  previewImportReconciliation,
} from '../../src/lib/importReconciliation.js';
import {
  importRecoveryPlanMatchesSession,
  loadImportReconciliationRecovery,
  persistImportReconciliationRecovery,
  restoreImportReconciliationDecisions,
  serializeImportReconciliationRecovery,
} from '../../src/lib/importReconciliationRecovery.js';

const OWNER = '11111111-1111-4111-8111-111111111111';
const OTHER_OWNER = '22222222-2222-4222-8222-222222222222';
const TARGET = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const OLD_CAMPAIGN = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const EXISTING_SAVE = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const PRIVATE_NAME = 'Private Candleford';
const PRIVATE_PROSE = 'The hidden abbey keeps a private succession record.';

function sourceText() {
  return JSON.stringify({
    version: ACCOUNT_EXPORT_VERSION,
    settlements: [{
      id: 'source-save',
      name: PRIVATE_NAME,
      tier: 'town',
      settlement: {
        name: PRIVATE_NAME,
        tier: 'town',
        description: PRIVATE_PROSE,
        config: {},
      },
    }],
    campaigns: [],
  });
}

async function admitted(existingCampaigns) {
  const ingest = ingestSettlementForgeExport(sourceText(), {
    label: 'private-account-export.json',
    storageRef: 'private-file-handle',
  });
  const result = await admitExistingCampaignImport(ingest.value, {
    targetCampaign: existingCampaigns.find(campaign => campaign.id === TARGET),
    existingCampaigns,
    existingSettlements: [{
      id: EXISTING_SAVE,
      name: PRIVATE_NAME,
      settlement: { name: PRIVATE_NAME },
    }],
  });
  expect(result.ok).toBe(true);
  return result.value;
}

async function reviewedSession(existingCampaigns) {
  const session = await admitted(existingCampaigns);
  const proposal = session.proposals[0];
  const decided = decideImportProposal(session, proposal.proposalId, {
    action: 'match',
    targetSaveId: EXISTING_SAVE,
  });
  return previewImportReconciliation(decided).value;
}

const ORIGINAL_TOPOLOGY = [
  { id: TARGET, name: 'Target realm', settlementIds: [] },
  {
    id: OLD_CAMPAIGN,
    name: 'Old private realm',
    settlementIds: [EXISTING_SAVE],
  },
];

beforeEach(() => {
  localStorage.clear();
});

describe('import reconciliation private recovery', () => {
  test('persists only decisions, reviewed ids, and a redacted receipt', async () => {
    const preview = await reviewedSession(ORIGINAL_TOPOLOGY);
    const applied = await applyImportReconciliation(preview, {
      executeDraft: async draft => ({
        commandId: 'cmd:import-reconciliation:unknown-outcome',
        kind: draft.kind,
        status: 'reconcile_required',
        ok: false,
        needsReconciliation: true,
        targets: draft.targets,
        result: {
          saveId: EXISTING_SAVE,
          campaignId: TARGET,
          privatePayload: PRIVATE_PROSE,
        },
      }),
    });
    const record = persistImportReconciliationRecovery(
      applied.value,
      OWNER,
      { receipt: applied.receipt },
    );

    expect(record).toMatchObject({
      schemaVersion: 2,
      targetCampaignId: TARGET,
      reviewedDrafts: [{
        kind: 'import.campaign.attach-existing',
        expectedMembershipCampaignIds: [OLD_CAMPAIGN],
      }],
    });
    const rawCache = [...Array(localStorage.length)]
      .map((_, index) => localStorage.getItem(localStorage.key(index)))
      .join('\n');
    expect(rawCache).not.toContain(PRIVATE_NAME);
    expect(rawCache).not.toContain(PRIVATE_PROSE);
    expect(rawCache).not.toContain('private-account-export.json');
    expect(rawCache).not.toContain('private-file-handle');
    expect(rawCache).toContain('cmd:import-reconciliation:unknown-outcome');

    const serialized = serializeImportReconciliationRecovery(record);
    expect(serialized).not.toContain(PRIVATE_NAME);
    expect(serialized).not.toContain(PRIVATE_PROSE);
  });

  test('requires reupload, restores valid decisions, and binds receipts to the exact plan', async () => {
    const preview = await reviewedSession(ORIGINAL_TOPOLOGY);
    const applied = await applyImportReconciliation(preview, {
      executeDraft: async draft => ({
        commandId: 'cmd:import-reconciliation:reopen',
        kind: draft.kind,
        status: 'reconcile_required',
        needsReconciliation: true,
        targets: draft.targets,
      }),
    });
    const saved = persistImportReconciliationRecovery(
      applied.value,
      OWNER,
      { receipt: applied.receipt },
    );
    const fresh = await admitted(ORIGINAL_TOPOLOGY);
    const loaded = loadImportReconciliationRecovery({
      ownerId: OWNER,
      sessionId: fresh.sessionId,
      sourceChecksum: fresh.source.checksum,
      targetCampaignId: TARGET,
    });
    const restored = restoreImportReconciliationDecisions(fresh, loaded);
    const reconstructed = previewImportReconciliation(restored.session).value;

    expect(restored.restoredProposalIds).toEqual([fresh.proposals[0].proposalId]);
    expect(restored.receipt).toMatchObject({
      status: 'failed_reconcilable',
      commandReceipts: [{
        commandReceipt: {
          commandId: 'cmd:import-reconciliation:reopen',
        },
      }],
    });
    expect(importRecoveryPlanMatchesSession(reconstructed, saved)).toBe(true);

    const changed = await reviewedSession([
      { id: TARGET, name: 'Target realm', settlementIds: [EXISTING_SAVE] },
      { id: OLD_CAMPAIGN, name: 'Old private realm', settlementIds: [] },
    ]);
    expect(importRecoveryPlanMatchesSession(changed, saved)).toBe(false);
    expect(loadImportReconciliationRecovery({
      ownerId: OTHER_OWNER,
      sessionId: fresh.sessionId,
      sourceChecksum: fresh.source.checksum,
      targetCampaignId: TARGET,
    })).toBeNull();
  });
});
