import { describe, expect, test } from 'vitest';
import {
  CUSTOM_CONTENT_COMMAND_KIND,
  previewCustomContentCommand,
} from '../../src/domain/content/customContentCommands.js';
import {
  admitCustomContentRpcReceipt,
} from '../../src/lib/customContentServiceRuntime.js';

const DEFINITION_ID = '11111111-1111-4111-8111-111111111111';
const REVISION_ID = '22222222-2222-4222-8222-222222222222';
const COMMAND_ID = 'command:custom-content:test';

function createPreview() {
  return previewCustomContentCommand({
    kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
    entries: [{
      definitionId: DEFINITION_ID,
      category: 'institutions',
      data: {
        name: 'Receipt Hall',
        localUid: 'lu_receipt_hall',
      },
    }],
  });
}

function appliedReceipt(preview) {
  const perEntry = [{
    definitionId: DEFINITION_ID,
    revisionId: REVISION_ID,
    status: 'created',
    category: 'institutions',
    packEntryId: null,
  }];
  return {
    ok: true,
    status: 'applied',
    commandId: COMMAND_ID,
    fingerprint: preview.fingerprint,
    result: {
      items: [{
        id: DEFINITION_ID,
        definitionId: DEFINITION_ID,
        revisionId: REVISION_ID,
        name: 'Receipt Hall',
      }],
      archivedItems: [],
      pack: null,
      environment: null,
      perEntry,
    },
    perEntry,
  };
}

describe('custom-content RPC receipt admission', () => {
  test('confirms only a complete response bound to the reviewed command', () => {
    const preview = createPreview();
    expect(admitCustomContentRpcReceipt(
      appliedReceipt(preview),
      COMMAND_ID,
      preview,
    )).toMatchObject({
      ok: true,
      status: 'applied',
      commandId: COMMAND_ID,
      fingerprint: preview.fingerprint,
      persistence: { state: 'confirmed' },
      needsReconciliation: false,
    });
  });

  test.each([
    ['command id', receipt => ({ ...receipt, commandId: 'wrong-command' })],
    ['fingerprint', receipt => ({ ...receipt, fingerprint: '0'.repeat(64) })],
    ['result', receipt => ({ ...receipt, result: null })],
    [
      'entry receipt',
      receipt => ({
        ...receipt,
        perEntry: [{ ...receipt.perEntry[0], revisionId: 'wrong-revision' }],
      }),
    ],
  ])('keeps an applied response with a mismatched %s unconfirmed', (
    _label,
    mutate,
  ) => {
    const preview = createPreview();
    const receipt = admitCustomContentRpcReceipt(
      mutate(appliedReceipt(preview)),
      COMMAND_ID,
      preview,
    );
    expect(receipt).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      reason: 'custom_content_rpc_receipt_mismatch',
      persistence: { state: 'unconfirmed' },
      needsReconciliation: true,
    });
  });

  test('confirms a refusal only when it belongs to the reviewed command', () => {
    const preview = createPreview();
    const receipt = admitCustomContentRpcReceipt({
      ok: false,
      status: 'stale',
      commandId: COMMAND_ID,
      fingerprint: preview.fingerprint,
      reason: 'definition_head_changed',
    }, COMMAND_ID, preview);
    expect(receipt).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'definition_head_changed',
      persistence: { state: 'confirmed' },
      needsReconciliation: false,
    });
  });
});
