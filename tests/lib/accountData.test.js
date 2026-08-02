/**
 * tests/lib/accountData.test.js — Phase A2 Data & Privacy service.
 *
 * Locks:
 *   • buildAccountExport assembles a portable snapshot of the user's OWN data
 *     (profile basics + settlements + campaigns + private custom content),
 *     versioned, with no internal grants (role/credits) leaking in.
 *   • downloadAccountExport names the file and returns it.
 *   • requestAccountDeletion is a SOFT-DELETE *request* — it routes to the
 *     server (edge function preferred, table fallback) and NEVER hard-deletes
 *     client-side. In local/mock mode it resolves queued.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  MAX_IMPORT_BYTES,
} from '../../src/lib/accountTransferContract.js';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

async function load({ isConfigured = false, supabase = null } = {}) {
  vi.resetModules();
  vi.doMock('../../src/lib/supabase.js', () => ({ isConfigured, supabase }));
  return import('../../src/lib/accountData.js');
}

function archiveFor(items = []) {
  const definitions = {};
  const revisions = {};
  for (const [index, item] of items.entries()) {
    const definitionId = item.definitionId || `definition-${index}`;
    const revisionId = item.revisionId || `revision-${index}`;
    const localUid = item.localUid || `lu_definition_${index}`;
    const data = {
      ...item,
      localUid,
    };
    delete data.definitionId;
    delete data.revisionId;
    definitions[definitionId] = {
      id: definitionId,
      category: 'institutions',
      localUid,
      headRevisionId: revisionId,
      archivedAt: null,
      createdAt: '2026-07-25T00:00:00.000Z',
      updatedAt: '2026-07-25T00:00:00.000Z',
    };
    revisions[revisionId] = {
      id: revisionId,
      definitionId,
      category: 'institutions',
      revisionNumber: 1,
      parentRevisionId: null,
      contentHash: contentRevisionHash('institutions', data),
      data,
      createdAt: '2026-07-25T00:00:00.000Z',
    };
  }
  return buildCustomContentArchive({
    schemaVersion: 1,
    definitions,
    revisions,
    packs: {},
    activePacks: {},
    packEntryDefinitions: {},
    packVersionEntries: {},
    environments: {},
    activeEnvironmentRevisionId: null,
    commandReceipts: {},
  }, {
    sourceKey: 'u1',
    sourceType: 'test',
    exportedAt: '2026-07-25T00:00:00.000Z',
  });
}

describe('buildAccountExport', () => {
  it('captures portable account state plus export-only operator/compliance records', async () => {
    const { buildAccountExport, ACCOUNT_EXPORT_VERSION } = await load();
    const customContent = {
      institutions: [{
        name: 'Haunted Glassworks',
        localUid: 'lu_glassworks',
        definitionId: 'definition-0',
        revisionId: 'revision-0',
      }],
    };
    const out = buildAccountExport({
      auth: { user: { id: 'u1', email: 'me@x.test' }, displayName: 'Me', tier: 'free', role: 'admin', credits: 999 },
      savedSettlements: [{ id: 's1' }, { id: 's2' }],
      campaigns: [{ id: 'c1' }],
      customContent,
      customContentArchive: archiveFor(customContent.institutions),
      serviceRecords: {
        schemaVersion: 1,
        importable: false,
        operatorMessages: [{ id: 'm1', subject: 'A service notice' }],
        consentChanges: [{ consentKey: 'research', priorValue: true, newValue: false }],
      },
    });

    expect(out.version).toBe(ACCOUNT_EXPORT_VERSION);
    expect(typeof out.exportedAt).toBe('string');
    expect(out.profile).toEqual({ email: 'me@x.test', displayName: 'Me', tier: 'free' });
    expect(out.settlements).toHaveLength(2);
    expect(out.campaigns).toHaveLength(1);
    expect(out.customContentArchive).toMatchObject({
      format: 'settlementforge.custom-content-ledger',
      formatVersion: 1,
      ledger: {
        definitions: [
          expect.objectContaining({ localUid: 'lu_glassworks' }),
        ],
        revisions: [
          expect.objectContaining({
            data: expect.objectContaining({ name: 'Haunted Glassworks' }),
          }),
        ],
      },
    });
    expect(out.customContentArchive.archiveFingerprint)
      .toMatch(/^[a-f0-9]{64}$/);
    expect(out.serviceRecords).toEqual({
      schemaVersion: 1,
      importable: false,
      operatorMessages: [{ id: 'm1', subject: 'A service notice' }],
      consentChanges: [{ consentKey: 'research', priorValue: true, newValue: false }],
    });
    expect(out.preflight).toMatchObject({
      status: 'portable',
      counts: {
        settlements: 2,
        campaigns: 1,
        contentDefinitions: 1,
        contentRevisions: 1,
        operatorMessages: 1,
        consentChanges: 1,
      },
      customContentArchive: {
        archiveFingerprint: out.customContentArchive.archiveFingerprint,
      },
    });
    // No privileged grants exported.
    expect(JSON.stringify(out)).not.toMatch(/credits|"role"/);
  });

  it('tolerates an empty/partial state', async () => {
    const { buildAccountExport } = await load();
    const out = buildAccountExport({});
    expect(out.profile.email).toBeNull();
    expect(out.settlements).toEqual([]);
    expect(out.campaigns).toEqual([]);
    expect(out.customContentArchive).toBeNull();
    expect(out.serviceRecords).toEqual({
      schemaVersion: 1,
      importable: false,
      operatorMessages: [],
      consentChanges: [],
    });
  });

  it('fails before download when loaded custom content lacks its authoritative archive', async () => {
    const {
      buildAccountExport,
      preflightAccountExport,
      AccountExportPreflightError,
    } = await load();
    const institutions = [{ name: 'Unarchived Hall', localUid: 'lu_hall' }];

    const preflight = preflightAccountExport({
      customContent: { institutions },
    });

    expect(preflight.ok).toBe(false);
    expect(preflight.diagnostics.errors).toContainEqual(
      expect.objectContaining({
        code: 'account_export_content_archive_required',
      }),
    );
    expect(() => buildAccountExport({
      customContent: { institutions },
    })).toThrow(AccountExportPreflightError);
  });

  it('rejects an archive whose active head differs from the loaded projection', async () => {
    const { preflightAccountExport } = await load();
    const archive = archiveFor([{
      name: 'Archived Shape',
      localUid: 'lu_same_identity',
      definitionId: 'definition-same',
      revisionId: 'revision-same',
    }]);
    const preflight = preflightAccountExport({
      customContent: {
        institutions: [{
          name: 'Loaded Shape',
          localUid: 'lu_same_identity',
          definitionId: 'definition-same',
          revisionId: 'revision-same',
        }],
      },
      customContentArchive: archive,
    });

    expect(preflight.ok).toBe(false);
    expect(preflight.diagnostics.errors).toContainEqual(
      expect.objectContaining({
        code: 'account_export_content_archive_incomplete',
      }),
    );
  });

  it('rejects a same-body stale revision after an A-B-A head cycle', async () => {
    const { preflightAccountExport } = await load();
    const data = {
      name: 'Returning Hall',
      localUid: 'lu_returning_hall',
    };
    const hash = contentRevisionHash('institutions', data);
    const revision = (id, number, parentRevisionId) => ({
      id,
      definitionId: 'definition-returning-hall',
      category: 'institutions',
      revisionNumber: number,
      parentRevisionId,
      contentHash: hash,
      data,
      createdAt: `2026-07-25T00:00:0${number}.000Z`,
    });
    const archive = buildCustomContentArchive({
      schemaVersion: 1,
      definitions: {
        'definition-returning-hall': {
          id: 'definition-returning-hall',
          category: 'institutions',
          localUid: data.localUid,
          headRevisionId: 'revision-returning-hall:r3',
          archivedAt: null,
          createdAt: '2026-07-25T00:00:00.000Z',
          updatedAt: '2026-07-25T00:00:03.000Z',
        },
      },
      revisions: {
        'revision-returning-hall:r1': revision(
          'revision-returning-hall:r1',
          1,
          null,
        ),
        'revision-returning-hall:r2': revision(
          'revision-returning-hall:r2',
          2,
          'revision-returning-hall:r1',
        ),
        'revision-returning-hall:r3': revision(
          'revision-returning-hall:r3',
          3,
          'revision-returning-hall:r2',
        ),
      },
      packs: {},
      activePacks: {},
      packEntryDefinitions: {},
      packVersionEntries: {},
      environments: {},
      activeEnvironmentRevisionId: null,
      commandReceipts: {},
    }, {
      sourceKey: 'same-body-cycle',
      sourceType: 'test',
      exportedAt: '2026-07-25T00:00:04.000Z',
    });

    const preflight = preflightAccountExport({
      customContent: {
        institutions: [{
          ...data,
          definitionId: 'definition-returning-hall',
          revisionId: 'revision-returning-hall:r1',
        }],
      },
      customContentArchive: archive,
    });

    expect(preflight.ok).toBe(false);
    expect(preflight.diagnostics.errors).toContainEqual(
      expect.objectContaining({
        code: 'account_export_content_archive_incomplete',
      }),
    );
  });

  it('uses the real archive validator and whole-envelope byte cap in preflight', async () => {
    const { preflightAccountExport } = await load();
    const invalidArchive = preflightAccountExport({
      customContentArchive: {
        format: 'settlementforge.custom-content-ledger',
      },
    });
    expect(invalidArchive.ok).toBe(false);
    expect(invalidArchive.diagnostics.errors).toContainEqual(
      expect.objectContaining({
        code: 'account_export_content_archive_rejected',
      }),
    );

    const oversizedEnvelope = preflightAccountExport({
      savedSettlements: [{
        id: 'large-save',
        settlement: {
          name: 'Large Save',
          notes: 'y'.repeat(MAX_IMPORT_BYTES + 1),
        },
      }],
    });
    expect(oversizedEnvelope.ok).toBe(false);
    expect(oversizedEnvelope.diagnostics.errors).toContainEqual(
      expect.objectContaining({
        code: 'account_export_envelope_limit_exceeded',
      }),
    );
  });

  it('splits oversized export-only service history without blocking the restorable core', async () => {
    const { preflightAccountExport, planAccountExportDownloads } = await load();
    const state = {
      auth: { user: { email: 'owner@example.test' } },
      serviceRecords: {
        schemaVersion: 1,
        importable: false,
        operatorMessages: [{ id: 'large-message', body: 'z'.repeat(MAX_IMPORT_BYTES + 1) }],
        consentChanges: [],
      },
    };
    const preflight = preflightAccountExport(state);
    expect(preflight.ok).toBe(true);
    expect(preflight.diagnostics.envelopeBytes).toBeLessThan(MAX_IMPORT_BYTES);
    expect(preflight.diagnostics.downloadBytes).toBeGreaterThan(MAX_IMPORT_BYTES);

    const downloads = planAccountExportDownloads(state);
    expect(downloads).toHaveLength(2);
    expect(downloads.map(download => download.importable)).toEqual([true, false]);
    expect(downloads[1].filename).toMatch(/-service-records\.json$/);
    expect(JSON.parse(downloads[0].json).serviceRecords.operatorMessages).toEqual([]);
    expect(JSON.parse(downloads[1].json).serviceRecords.operatorMessages[0].id).toBe('large-message');
  });
});

describe('downloadAccountExport', () => {
  it('returns a dated, slugged filename', async () => {
    const { downloadAccountExport } = await load();
    const name = downloadAccountExport({ auth: { user: { email: 'A.B@Example.test' } } });
    expect(name).toMatch(/^settlementforge-a-b-example-test-\d{4}-\d{2}-\d{2}\.json$/);
  });
});

describe('requestAccountDeletion — soft-delete request, never hard delete', () => {
  it('resolves queued in local/mock mode without any client deletion', async () => {
    const { requestAccountDeletion } = await load({ isConfigured: false, supabase: null });
    const res = await requestAccountDeletion({ id: 'u1', email: 'me@x.test' });
    expect(res.status).toBe('queued');
    expect(typeof res.requestedAt).toBe('string');
  });

  it('prefers the account-actions edge function with request_deletion', async () => {
    const invoke = vi.fn().mockResolvedValue({ data: { ok: true }, error: null });
    const insert = vi.fn();
    const supabase = { functions: { invoke }, from: () => ({ insert }) };
    const { requestAccountDeletion } = await load({ isConfigured: true, supabase });

    const res = await requestAccountDeletion({ id: 'u1', email: 'me@x.test' });

    expect(invoke).toHaveBeenCalledWith('account-actions', { body: { action: 'request_deletion' } });
    expect(insert).not.toHaveBeenCalled(); // edge function succeeded; no table fallback
    expect(res.status).toBe('queued');
  });

  it('falls back to a deletion_requests row when the edge function is unavailable', async () => {
    const invoke = vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } });
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    const supabase = { functions: { invoke }, from };
    const { requestAccountDeletion } = await load({ isConfigured: true, supabase });

    const res = await requestAccountDeletion({ id: 'u1', email: 'me@x.test' });

    expect(from).toHaveBeenCalledWith('deletion_requests');
    expect(insert).toHaveBeenCalledTimes(1);
    const row = insert.mock.calls[0][0];
    expect(row.user_id).toBe('u1');
    expect(row.email).toBe('me@x.test');
    expect(res.status).toBe('queued');
  });

  it('throws a safe message if the request cannot be filed', async () => {
    const invoke = vi.fn().mockResolvedValue({ data: null, error: { message: 'no fn' } });
    const insert = vi.fn().mockResolvedValue({ error: { message: 'rls denied' } });
    const supabase = { functions: { invoke }, from: () => ({ insert }) };
    const { requestAccountDeletion } = await load({ isConfigured: true, supabase });

    await expect(requestAccountDeletion({ id: 'u1' })).rejects.toThrow(/contact support/i);
  });
});
