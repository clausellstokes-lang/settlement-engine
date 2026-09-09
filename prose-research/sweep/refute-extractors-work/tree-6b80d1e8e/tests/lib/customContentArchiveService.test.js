import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: { getUser: (...args) => mocks.getUser(...args) },
    rpc: (...args) => mocks.rpc(...args),
  },
}));

import {
  buildCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  exportCustomContentArchive,
  importCustomContentArchive,
} from '../../src/lib/customContentArchiveService.js';

function emptyArchive() {
  return buildCustomContentArchive({
    schemaVersion: 1,
    definitions: {},
    revisions: {},
    packs: {},
    activePacks: {},
    packEntryDefinitions: {},
    packVersionEntries: {},
    environments: {},
    activeEnvironmentRevisionId: null,
    commandReceipts: {},
  }, {
    sourceKey: 'cloud:source-owner',
    sourceType: 'cloud-account',
    exportedAt: '2026-07-25T00:00:00.000Z',
  });
}

describe('custom-content archive service authority', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'destination-owner' } },
    });
  });

  test('exports through the ownership-only RPC and re-admits its graph', async () => {
    const archive = emptyArchive();
    mocks.rpc.mockResolvedValue({ data: archive, error: null });

    const result = await exportCustomContentArchive({
      ownerId: 'destination-owner',
    });

    expect(result.archiveFingerprint).toBe(archive.archiveFingerprint);
    expect(mocks.rpc).toHaveBeenCalledWith(
      'export_custom_content_archive',
      { p_expected_owner: 'destination-owner' },
    );
  });

  test('imports one prepared bundle and preserves the server identity receipt', async () => {
    const archive = emptyArchive();
    mocks.rpc.mockImplementation(async (name, input) => {
      expect(name).toBe('import_custom_content_archive');
      expect(input).toMatchObject({
        p_expected_owner: 'destination-owner',
        p_command_id: expect.stringMatching(/^content-archive-import:/),
        p_fingerprint: expect.stringMatching(/^[a-f0-9]{64}$/),
        p_bundle: {
          sourceArchive: {
            archiveFingerprint: archive.archiveFingerprint,
          },
        },
      });
      return {
        data: {
          ok: true,
          status: 'applied',
          commandId: input.p_command_id,
          fingerprint: input.p_fingerprint,
          archiveFingerprint: archive.archiveFingerprint,
          identityMap: {
            definitionIds: [],
            revisionIds: [],
            localUids: [],
            packIds: [],
            environmentIds: [],
            environmentRevisionIds: [],
          },
          counts: {
            definitions: 0,
            revisions: 0,
            packs: 0,
            packVersions: 0,
            packEntries: 0,
            environments: 0,
          },
        },
        error: null,
      };
    });

    const receipt = await importCustomContentArchive(archive, {
      ownerId: 'destination-owner',
    });

    expect(receipt).toMatchObject({
      ok: true,
      status: 'applied',
      archiveFingerprint: archive.archiveFingerprint,
      identityMap: { definitionIds: [] },
      counts: { definitions: 0 },
      persistence: {
        state: 'confirmed',
        authority: 'supabase-transaction',
      },
    });
  });

  test('classifies a database refusal as confirmed, not reconcile-required', async () => {
    mocks.rpc.mockResolvedValue({
      data: null,
      error: {
        code: '22023',
        message: 'The archive graph failed admission.',
      },
      status: 400,
    });

    const receipt = await importCustomContentArchive(emptyArchive(), {
      ownerId: 'destination-owner',
    });

    expect(receipt).toMatchObject({
      ok: false,
      status: 'failed',
      code: '22023',
      reason: 'The archive graph failed admission.',
      needsReconciliation: false,
      persistence: {
        state: 'confirmed',
        authority: 'supabase-transaction',
      },
    });
  });

  test('reports an undeployed archive RPC as a confirmed schema failure', async () => {
    mocks.rpc.mockResolvedValue({
      data: null,
      error: {
        code: 'PGRST202',
        message: 'Function was not found.',
      },
      status: 404,
    });

    const receipt = await importCustomContentArchive(emptyArchive(), {
      ownerId: 'destination-owner',
    });

    expect(receipt).toMatchObject({
      ok: false,
      status: 'failed',
      code: 'custom_content_archive_schema_missing',
      reason: 'Full custom-content archive persistence is not deployed.',
      needsReconciliation: false,
      persistence: { state: 'confirmed' },
    });
  });

  test('reserves reconcile-required for an ambiguous transport outcome', async () => {
    mocks.rpc.mockRejectedValue(new TypeError('Failed to fetch'));

    const receipt = await importCustomContentArchive(emptyArchive(), {
      ownerId: 'destination-owner',
    });

    expect(receipt).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      reason: 'Failed to fetch',
      needsReconciliation: true,
      persistence: {
        state: 'unconfirmed',
        authority: 'supabase-transaction',
      },
    });
  });

  test('keeps PostgREST connection failures ambiguous', async () => {
    mocks.rpc.mockResolvedValue({
      data: null,
      error: {
        code: 'PGRST000',
        message: 'Database connection was lost.',
      },
      status: 503,
    });

    const receipt = await importCustomContentArchive(emptyArchive(), {
      ownerId: 'destination-owner',
    });

    expect(receipt).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      code: 'PGRST000',
      needsReconciliation: true,
      persistence: { state: 'unconfirmed' },
    });
  });

  test('treats a PostgREST request refusal as confirmed', async () => {
    mocks.rpc.mockResolvedValue({
      data: null,
      error: {
        code: 'PGRST102',
        message: 'The request body is invalid.',
      },
      status: 400,
    });

    const receipt = await importCustomContentArchive(emptyArchive(), {
      ownerId: 'destination-owner',
    });

    expect(receipt).toMatchObject({
      ok: false,
      status: 'failed',
      code: 'PGRST102',
      needsReconciliation: false,
      persistence: { state: 'confirmed' },
    });
  });

  test('fails closed on a contradictory applied receipt', async () => {
    mocks.rpc.mockResolvedValue({
      data: {
        ok: false,
        status: 'applied',
      },
      error: null,
      status: 200,
    });

    const receipt = await importCustomContentArchive(emptyArchive(), {
      ownerId: 'destination-owner',
    });

    expect(receipt).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      reason: 'custom_content_archive_receipt_mismatch',
      needsReconciliation: true,
      persistence: { state: 'unconfirmed' },
    });
  });

  test.each([
    ['failed', 'command identity', { commandId: 'wrong-command' }],
    ['failed', 'command fingerprint', { fingerprint: '0'.repeat(64) }],
    ['stale', 'command identity', { commandId: 'wrong-command' }],
    ['stale', 'command fingerprint', { fingerprint: '0'.repeat(64) }],
  ])(
    'does not confirm a %s receipt with the wrong %s',
    async (status, _label, override) => {
      mocks.rpc.mockImplementation(async (_name, input) => ({
        data: {
          ok: false,
          status,
          commandId: input.p_command_id,
          fingerprint: input.p_fingerprint,
          reason: 'reviewed archive command was refused',
          ...override,
        },
        error: null,
      }));

      const receipt = await importCustomContentArchive(emptyArchive(), {
        ownerId: 'destination-owner',
      });

      expect(receipt).toMatchObject({
        ok: false,
        status: 'reconcile-required',
        reason: 'custom_content_archive_receipt_mismatch',
        needsReconciliation: true,
        persistence: {
          state: 'unconfirmed',
          authority: 'supabase-transaction',
        },
      });
    },
  );

  test.each([
    ['command identity', { commandId: 'wrong-command' }],
    ['command fingerprint', { fingerprint: '0'.repeat(64) }],
    ['archive fingerprint', { archiveFingerprint: '0'.repeat(64) }],
    ['identity map', { identityMap: null }],
    ['result counts', { counts: null }],
  ])('does not confirm an applied receipt with the wrong %s', async (
    _label,
    override,
  ) => {
    const archive = emptyArchive();
    mocks.rpc.mockImplementation(async (_name, input) => ({
      data: {
        ok: true,
        status: 'applied',
        commandId: input.p_command_id,
        fingerprint: input.p_fingerprint,
        archiveFingerprint: archive.archiveFingerprint,
        identityMap: {
          definitionIds: [],
          revisionIds: [],
          localUids: [],
          packIds: [],
          environmentIds: [],
          environmentRevisionIds: [],
        },
        counts: {
          definitions: 0,
          revisions: 0,
          packs: 0,
          packVersions: 0,
          packEntries: 0,
          environments: 0,
        },
        ...override,
      },
      error: null,
    }));

    const receipt = await importCustomContentArchive(archive, {
      ownerId: 'destination-owner',
    });

    expect(receipt).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      reason: 'custom_content_archive_receipt_mismatch',
      needsReconciliation: true,
      persistence: {
        state: 'unconfirmed',
        authority: 'supabase-transaction',
      },
    });
  });

  test.each([
    ['command identity', { commandId: 'wrong-command' }],
    ['command fingerprint', { fingerprint: '0'.repeat(64) }],
    ['archive fingerprint', { archiveFingerprint: '0'.repeat(64) }],
    ['identity map', { identityMap: null }],
    ['result counts', { counts: null }],
  ])(
    'rejects contradictory nested %s even when the top-level receipt matches',
    async (_label, nestedOverride) => {
      const archive = emptyArchive();
      const identityMap = {
        definitionIds: [],
        revisionIds: [],
        localUids: [],
        packIds: [],
        environmentIds: [],
        environmentRevisionIds: [],
      };
      const counts = {
        definitions: 0,
        revisions: 0,
        packs: 0,
        packVersions: 0,
        packEntries: 0,
        environments: 0,
      };
      mocks.rpc.mockImplementation(async (_name, input) => ({
        data: {
          ok: true,
          status: 'applied',
          commandId: input.p_command_id,
          fingerprint: input.p_fingerprint,
          archiveFingerprint: archive.archiveFingerprint,
          identityMap,
          counts,
          result: {
            commandId: input.p_command_id,
            fingerprint: input.p_fingerprint,
            archiveFingerprint: archive.archiveFingerprint,
            identityMap,
            counts,
            ...nestedOverride,
          },
        },
        error: null,
      }));

      const receipt = await importCustomContentArchive(archive, {
        ownerId: 'destination-owner',
      });

      expect(receipt).toMatchObject({
        ok: false,
        status: 'reconcile-required',
        reason: 'custom_content_archive_receipt_mismatch',
        needsReconciliation: true,
        persistence: { state: 'unconfirmed' },
      });
    },
  );

  test('admits a bound semantic replay of an equivalent transport envelope', async () => {
    const archive = emptyArchive();
    mocks.rpc.mockImplementation(async (_name, input) => ({
      data: {
        ok: true,
        status: 'applied',
        commandId: input.p_command_id,
        fingerprint: input.p_fingerprint,
        // The server retains the first equivalent archive envelope as audit
        // provenance, so a semantic replay can truthfully return its hash.
        archiveFingerprint: 'f'.repeat(64),
        replayed: true,
        semanticReplay: true,
        identityMap: {
          definitionIds: [],
          revisionIds: [],
          localUids: [],
          packIds: [],
          environmentIds: [],
          environmentRevisionIds: [],
        },
        counts: {
          definitions: 0,
          revisions: 0,
          packs: 0,
          packVersions: 0,
          packEntries: 0,
          environments: 0,
        },
      },
      error: null,
    }));

    const receipt = await importCustomContentArchive(archive, {
      ownerId: 'destination-owner',
    });
    expect(receipt).toMatchObject({
      ok: true,
      status: 'applied',
      replayed: true,
      semanticReplay: true,
      persistence: { state: 'confirmed' },
    });
  });

  test('rejects contradictory nested semantic-replay authority', async () => {
    const archive = emptyArchive();
    const identityMap = {
      definitionIds: [],
      revisionIds: [],
      localUids: [],
      packIds: [],
      environmentIds: [],
      environmentRevisionIds: [],
    };
    const counts = {
      definitions: 0,
      revisions: 0,
      packs: 0,
      packVersions: 0,
      packEntries: 0,
      environments: 0,
    };
    mocks.rpc.mockImplementation(async (_name, input) => ({
      data: {
        ok: true,
        status: 'applied',
        commandId: input.p_command_id,
        fingerprint: input.p_fingerprint,
        archiveFingerprint: archive.archiveFingerprint,
        semanticReplay: false,
        identityMap,
        counts,
        result: {
          commandId: input.p_command_id,
          fingerprint: input.p_fingerprint,
          archiveFingerprint: archive.archiveFingerprint,
          semanticReplay: true,
          identityMap,
          counts,
        },
      },
      error: null,
    }));

    const receipt = await importCustomContentArchive(archive, {
      ownerId: 'destination-owner',
    });

    expect(receipt).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      reason: 'custom_content_archive_receipt_mismatch',
      needsReconciliation: true,
      persistence: { state: 'unconfirmed' },
    });
  });

  test('fences an account switch before either RPC', async () => {
    await expect(exportCustomContentArchive({
      ownerId: 'previous-owner',
    })).rejects.toMatchObject({ code: 'auth_session_changed' });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});
