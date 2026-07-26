import { describe, expect, test, vi } from 'vitest';
import { createCommandExecutor } from '../../../src/application/commands/executeCommand.js';
import { standardCommandRegistry } from '../../../src/application/commands/standardCommandRegistry.js';
import { canonEventCommand } from '../../../src/application/commands/adapters/canonEventApply.js';
import { partyImpactCommand } from '../../../src/application/commands/adapters/partyImpactRecord.js';
import { importReconciliationCommand } from '../../../src/application/commands/adapters/importReconciliationApply.js';

function executor() {
  return createCommandExecutor({ registry: standardCommandRegistry });
}

describe('command provenance parity', () => {
  test('both provenances reach the same canon-event adapter with identical writer input', async () => {
    const applyEvent = vi.fn(() => ({
      ok: true,
      receipts: [{ kind: 'event' }],
      persistenceOps: [{ saveId: 'save-1' }],
    }));
    const intent = {
      proposalIndex: 2,
      saveId: 'save-1',
      event: { type: 'KILL_NPC', npcId: 'npc-1' },
    };
    const surveyor = canonEventCommand(intent, {
      interpretRef: 'compile-1',
      ownerId: 'owner-1',
      revision: 'rev-1',
      provenance: 'surveyor',
    });
    const manual = canonEventCommand(intent, {
      interpretRef: 'manual-form-1',
      ownerId: 'owner-1',
      revision: 'rev-1',
      provenance: 'manual',
    });
    const run = executor();
    const live = {
      ownerId: 'owner-1',
      saveId: 'save-1',
      revision: 'rev-1',
      actions: { applyEvent },
    };

    const surveyorReceipt = await run.execute(surveyor, live);
    const manualReceipt = await run.execute(manual, live);

    expect(surveyor.commandId).not.toBe(manual.commandId);
    expect(applyEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'KILL_NPC',
        npcId: 'npc-1',
        id: expect.stringMatching(/^event:canon-event-apply:/),
      }),
    );
    expect(applyEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'KILL_NPC',
        npcId: 'npc-1',
        id: expect.stringMatching(/^event:canon-event-apply:/),
      }),
    );
    expect(surveyorReceipt.status).toBe('applied');
    expect(manualReceipt.status).toBe('applied');
  });

  test('party impact remains campaign-addressed and uses the existing writer shape', async () => {
    const recordPartyImpact = vi.fn(() => ({ pulseId: 'pulse-1' }));
    const command = partyImpactCommand({
      proposalIndex: 0,
      campaignId: 'campaign-1',
      action: { kind: 'resolve_stressor', stressorId: 'stress-1' },
    }, {
      interpretRef: 'compile-2',
      ownerId: 'owner-1',
      revision: 'campaign-rev-1',
    });
    const receipt = await executor().execute(command, {
      ownerId: 'owner-1',
      campaignId: 'campaign-1',
      revision: 'campaign-rev-1',
      actions: { recordPartyImpact },
    });
    expect(recordPartyImpact).toHaveBeenCalledWith(
      'campaign-1',
      { kind: 'resolve_stressor', stressorId: 'stress-1' },
    );
    expect(receipt.status).toBe('applied');
  });

  test('the authoritative route event carries its envelope to the store writer', async () => {
    const applyEvent = vi.fn(() => ({
      ok: true,
      receipts: [{ kind: 'event' }],
      commandPersistence: { state: 'confirmed' },
    }));
    const command = canonEventCommand({
      proposalIndex: 0,
      saveId: 'save-1',
      event: {
        id: 'event.cut-route.1',
        type: 'CUT_TRADE_ROUTE',
        targetId: 'Old North Road',
      },
    }, {
      reviewRef: 'review-1',
      ownerId: 'owner-1',
      revision: 'rev-1',
    });
    const receipt = await executor().execute(command, {
      ownerId: 'owner-1',
      saveId: 'save-1',
      revision: 'rev-1',
      actions: { applyEvent },
    });

    expect(applyEvent).toHaveBeenCalledWith(
      command.params.event,
      { applicationCommand: command },
    );
    expect(receipt).toMatchObject({
      status: 'applied',
      persistence: { state: 'confirmed' },
    });
  });

  test('a newly reviewed base revision receives a distinct durable identity', () => {
    const intent = {
      proposalIndex: 0,
      saveId: 'save-1',
      event: {
        id: 'event.cut-route.1',
        type: 'CUT_TRADE_ROUTE',
        targetId: 'Old North Road',
      },
    };
    const before = canonEventCommand(intent, {
      reviewRef: 'review-1',
      ownerId: 'owner-1',
      revision: 'rev-1',
    });
    const after = canonEventCommand(intent, {
      reviewRef: 'review-1',
      ownerId: 'owner-1',
      revision: 'rev-2',
    });
    expect(after.commandId).not.toBe(before.commandId);
  });

  test('a reviewed import draft reaches only the narrow atomic writer', async () => {
    const applyImportReconciliationCommand = vi.fn(() => ({
      ok: true,
      status: 'applied',
      persistenceState: 'confirmed',
      result: { mode: 'server-atomic', projection: 'applied' },
    }));
    const draft = {
      draftId: 'ird:one',
      proposalId: 'proposal:one',
      kind: 'import.campaign.attach-existing',
      targets: { campaignId: 'campaign-1', saveId: 'save-1' },
      expected: {
        sourceChecksum: 'sf-import-v1:source',
        membershipCampaignIds: ['campaign-old'],
      },
      params: {
        preserveExistingSettlement: true,
        membershipPolicy: 'exclusive-rehome',
      },
    };
    const command = importReconciliationCommand(draft, {
      accountId: 'owner-1',
      importSessionId: 'irs:source:target',
    });
    const receipt = await executor().execute(command, {
      ownerId: 'owner-1',
      campaignId: 'campaign-1',
      saveId: 'save-1',
      sourceFingerprint: 'sf-import-v1:source',
      actions: { applyImportReconciliationCommand },
    });

    expect(applyImportReconciliationCommand).toHaveBeenCalledWith(command);
    expect(receipt).toMatchObject({
      status: 'applied',
      persistence: { state: 'confirmed' },
      result: { mode: 'server-atomic' },
    });
  });
});
