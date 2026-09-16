/**
 * tests/lib/accountImport.test.js — the PURE hostile-input half of "Import my
 * data": envelope validation (fail-closed, version/size/shape) and per-record
 * hardening (migrate-forward + ownership-safe scrub).
 *
 * Locks:
 *   • Malformed / wrong-shape / newer-version files are REJECTED with a clear
 *     message (never partially accepted).
 *   • prepareSettlementEntry strips cross-settlement refs + every seed + the
 *     deity bridge, stamps provenance, and carries NO id / owner / publication
 *     field — ownership is remapped by the server on write.
 *   • A throwing record is dropped (ok:false), never aborts.
 */
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  admitRestoredLifecycle,
  importedNeighbourLinkId,
  restoreIntraEnvelopeWiring,
  validateAccountImport,
  prepareSettlementEntry,
  ensureNormalizeLoaded,
  MAX_IMPORT_SETTLEMENTS,
  MAX_IMPORT_BYTES,
} from '../../src/lib/accountImport.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// LINEAGE ADAPT (master merge W6): this lineage lazily loads the normalizer;
// prepareSettlementEntry needs it primed (mirrors the saves.js call pattern).
beforeAll(async () => { await ensureNormalizeLoaded(); });
import { ACCOUNT_EXPORT_VERSION } from '../../src/lib/accountData.js';

const envelope = (over = {}) => JSON.stringify({
  version: ACCOUNT_EXPORT_VERSION,
  exportedAt: '2026-06-23T00:00:00.000Z',
  profile: { email: 'me@x.test', displayName: 'Me', tier: 'free' },
  settlements: [],
  campaigns: [],
  ...over,
});

describe('validateAccountImport — fail-closed envelope', () => {
  it('rejects non-JSON', () => {
    const res = validateAccountImport('not json {');
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/valid JSON/i);
    expect(res.failureKind).toBe('json_boundary_invalid');
  });

  it('rejects duplicate authority keys instead of accepting last-key-wins JSON', () => {
    const res = validateAccountImport(
      `{"version":${ACCOUNT_EXPORT_VERSION},"settlements":[],"campaigns":[],"customContentArchive":null,"customContentArchive":{}}`,
    );
    expect(res).toMatchObject({
      ok: false,
      error: expect.stringMatching(/ambiguous duplicate fields/i),
      failureKind: 'json_boundary_invalid',
    });
  });

  it('rejects decoded duplicate keys nested inside an archive ledger', () => {
    const res = validateAccountImport(
      `{"version":${ACCOUNT_EXPORT_VERSION},"settlements":[],"campaigns":[],"customContentArchive":{"ledger":{"definitions":[],"def\\u0069nitions":[]}}}`,
    );
    expect(res).toMatchObject({
      ok: false,
      error: expect.stringMatching(/ambiguous duplicate fields/i),
      failureKind: 'json_boundary_invalid',
    });
  });

  it('rejects an empty string', () => {
    expect(validateAccountImport('').ok).toBe(false);
  });

  it('rejects a top-level array / primitive', () => {
    expect(validateAccountImport('[]').ok).toBe(false);
    expect(validateAccountImport('42').ok).toBe(false);
    expect(validateAccountImport('null').ok).toBe(false);
  });

  it('rejects a missing / non-numeric version', () => {
    expect(validateAccountImport(JSON.stringify({ settlements: [] })).ok).toBe(false);
    expect(validateAccountImport(JSON.stringify({ version: 'x', settlements: [] })).ok).toBe(false);
    expect(validateAccountImport(JSON.stringify({ version: 0, settlements: [] })).ok).toBe(false);
    expect(validateAccountImport(JSON.stringify({ version: 1.5, settlements: [] })).ok).toBe(false);
  });

  it('rejects a NEWER-than-this-build version (no down-migration)', () => {
    const res = validateAccountImport(envelope({ version: ACCOUNT_EXPORT_VERSION + 1 }));
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/newer version/i);
  });

  it('rejects a wrong-shape settlements / campaigns field', () => {
    expect(validateAccountImport(envelope({ settlements: { not: 'an array' } })).ok).toBe(false);
    expect(validateAccountImport(envelope({ campaigns: 'nope' })).ok).toBe(false);
    expect(validateAccountImport(envelope({ customContentArchive: [] })).ok).toBe(false);
  });

  it('rejects competing or invalid custom-content authorities', () => {
    expect(validateAccountImport(envelope({
      customContentArchive: {},
      customContentPack: {},
    })).ok).toBe(false);
    expect(validateAccountImport(envelope({
      customContentArchive: {},
    })).ok).toBe(false);
    expect(validateAccountImport(envelope({
      customContentPack: { format: 'legacy-pack-placeholder' },
    })).ok).toBe(false);
  });

  it('rejects too many settlements (DoS bound)', () => {
    const many = new Array(MAX_IMPORT_SETTLEMENTS + 1).fill({ settlement: {} });
    expect(validateAccountImport(envelope({ settlements: many })).ok).toBe(false);
  });

  it('enforces the UTF-8 envelope byte cap inside the validator', () => {
    const oversized = JSON.stringify({
      version: ACCOUNT_EXPORT_VERSION,
      settlements: [],
      campaigns: [],
      padding: 'x'.repeat(MAX_IMPORT_BYTES),
    });
    const res = validateAccountImport(oversized);
    expect(res).toMatchObject({
      ok: false,
      error: expect.stringMatching(/too large/i),
    });
  });

  it('accepts a valid envelope and defaults missing arrays', () => {
    const res = validateAccountImport(JSON.stringify({ version: ACCOUNT_EXPORT_VERSION }));
    expect(res.ok).toBe(true);
    expect(res.value.settlements).toEqual([]);
    expect(res.value.campaigns).toEqual([]);
  });

  it('does NOT surface the untrusted profile', () => {
    const res = validateAccountImport(envelope());
    expect(res.ok).toBe(true);
    expect(res.value).not.toHaveProperty('profile');
  });

  it('accepts but never imports export-only service records', () => {
    const res = validateAccountImport(envelope({
      serviceRecords: {
        schemaVersion: 1,
        importable: false,
        operatorMessages: [{ id: 'foreign-message', body: 'do not recreate' }],
        consentChanges: [{ consentKey: 'market', newValue: true }],
      },
    }));
    expect(res.ok).toBe(true);
    expectAbsentWithAnchor(
      Object.keys(res.value),
      'serviceRecords',
      'settlements',
      'export-only service records are excluded from the live import envelope',
    );
  });
});

describe('prepareSettlementEntry — per-record hardening', () => {
  const RAW = {
    id: 'embedded-old-id',
    user_id: 'SOMEONE-ELSES-USER-ID',
    name: 'Old Harbor',
    tier: 'town',
    public_slug: 'stolen-slug',
    is_public: true,
    settlement: {
      name: 'Old Harbor',
      tier: 'town',
      neighbourNetwork: [{ id: 'n1', name: 'Elsewhere' }],
      neighborRelationship: { name: 'Elsewhere' },
      interSettlementRelationships: [{ partnerSettlement: 'Elsewhere' }],
      _seed: 'embedded-seed',
      config: { _seed: 'config-seed', terrain: 'coastal', primaryDeityRef: 'custom:foreign', primaryDeitySnapshot: { name: 'Foreign God' } },
    },
  };

  it('drops malformed records (ok:false, never throws)', () => {
    expect(prepareSettlementEntry(null).ok).toBe(false);
    expect(prepareSettlementEntry({}).ok).toBe(false);
    expect(prepareSettlementEntry({ settlement: 'not-an-object' }).ok).toBe(false);
  });

  it('carries NO id / user_id / owner / publication field (ownership remap)', () => {
    const res = prepareSettlementEntry(RAW);
    expect(res.ok).toBe(true);
    expect(res.entry).not.toHaveProperty('id');
    expect(res.entry).not.toHaveProperty('user_id');
    expect(res.entry).not.toHaveProperty('public_slug');
    expect(res.entry).not.toHaveProperty('is_public');
    // No embedded foreign id leaks into the settlement payload either.
    expect(JSON.stringify(res.entry)).not.toMatch(/SOMEONE-ELSES-USER-ID|stolen-slug|embedded-old-id/);
  });

  it('scrubs cross-settlement refs + every seed + the deity bridge', () => {
    const { entry } = prepareSettlementEntry(RAW);
    expect(entry.settlement.neighbourNetwork).toEqual([]);
    expect(entry.settlement.neighborRelationship).toBeNull();
    expect(entry.settlement.interSettlementRelationships).toEqual([]);
    expect(entry.settlement._seed).toBeUndefined();
    expect(entry.settlement.config._seed).toBeUndefined();
    expect(entry.settlement.config.primaryDeityRef).toBeUndefined();
    expect(entry.settlement.config.primaryDeitySnapshot).toBeUndefined();
    // Non-seed config preserved.
    expect(entry.settlement.config.terrain).toBe('coastal');
    // Clean draft, provenance stamped.
    expect(entry.campaignState).toEqual({ phase: 'draft', eventLog: [] });
    expect(entry.settlement.importedFrom.source).toBe('account-export');
  });

  it('derives a safe display name', () => {
    expect(prepareSettlementEntry({ settlement: {} }).entry.name).toBe('Imported settlement');
    expect(prepareSettlementEntry({ settlement: { name: 'From Settlement' } }).entry.name).toBe('From Settlement');
    expect(prepareSettlementEntry({ name: 'From Envelope', settlement: { name: 'x' } }).entry.name).toBe('From Envelope');
  });
});

/**
 * §359.10 / §66.4 — THE SURFACE IS THE PROVENANCE.
 *
 * The account surface restores the user's own lived history; every other caller
 * of prepareSettlementEntry, and the gallery importer's separate module, keep
 * the distrust reset. These arms pin both halves of that split.
 */
describe('prepareSettlementEntry — restore is OPT-IN (§359.10)', () => {
  const LIVED = {
    id: 'source-1',
    name: 'Old Harbor',
    tier: 'town',
    settlement: { name: 'Old Harbor', tier: 'town' },
    aiData: { aiSettlement: { summary: 'A salt-cured harbour town.' } },
    campaignState: {
      phase: 'canon',
      eventLog: [{ id: 'ev-1', type: 'CUT_TRADE_ROUTE' }],
      systemState: { unrest: 3 },
      locks: { npcs: true },
      canonizedAt: '2026-01-15T00:00:00.000Z',
    },
    versionHistory: [{ id: 'snap-1', label: 'Before the fire' }],
  };

  it('defaults to the distrust reset, so the reconciliation caller is unmoved', () => {
    // importReconciliationAdmission.js calls prepareSettlementEntry WITHOUT the
    // flag and declares campaignState / aiData / versionHistory unsupported on
    // its own boundary; the default must therefore still be the reset triple.
    const { entry } = prepareSettlementEntry(LIVED, { importedAt: null });
    expect(entry.campaignState).toEqual({ phase: 'draft', eventLog: [] });
    expect(entry.versionHistory).toEqual([]);
    expect(entry.aiData).toEqual({});
  });

  it('restores all four lifecycle fields on the account surface', () => {
    const res = prepareSettlementEntry(LIVED, { restoreLifecycle: true });
    expect(res.ok).toBe(true);
    expect(res.entry.campaignState.phase).toBe('canon');
    expect(res.entry.campaignState.eventLog).toEqual([{ id: 'ev-1', type: 'CUT_TRADE_ROUTE' }]);
    // The rest of the block is the user's own lived history and travels whole.
    expect(res.entry.campaignState.systemState).toEqual({ unrest: 3 });
    expect(res.entry.campaignState.locks).toEqual({ npcs: true });
    expect(res.entry.campaignState.canonizedAt).toBe('2026-01-15T00:00:00.000Z');
    expect(res.entry.versionHistory).toEqual([{ id: 'snap-1', label: 'Before the fire' }]);
    expect(res.entry.aiData).toEqual({ aiSettlement: { summary: 'A salt-cured harbour town.' } });
    expect(res.restoreNotices).toBeUndefined();
  });

  it('never lets an ownership or publication field cross the restore surface', () => {
    const res = prepareSettlementEntry(
      { ...LIVED, user_id: 'SOMEONE-ELSES-USER-ID', public_slug: 'stolen-slug', is_public: true },
      { restoreLifecycle: true },
    );
    const keys = Object.keys(res.entry);
    for (const owned of ['id', 'user_id', 'public_slug', 'is_public']) {
      // `campaignState` is the key the restore arm itself writes, so an entry
      // that lost its whole key set cannot pass this as "correctly excluded".
      expectAbsentWithAnchor(keys, owned, 'campaignState', `${owned} on the restore surface`);
    }
    const serialized = JSON.stringify(res.entry);
    for (const foreign of ['SOMEONE-ELSES-USER-ID', 'stolen-slug', 'source-1']) {
      expectAbsentWithAnchor(serialized, foreign, 'Old Harbor', 'source identity after restore');
    }
    // The dormancy strip is unchanged by restore: still no wiring, no seed.
    expect(res.entry.settlement.neighbourNetwork).toEqual([]);
    expect(res.entry.settlement.interSettlementRelationships).toEqual([]);
    expect(res.entry.settlement.neighborRelationship).toBeNull();
  });

  it('keeps the gallery importer on the distrust reset, both keys', () => {
    // A PINNED-ABSENCE arm over the gallery module's own source: it writes the
    // reset triple inline and must never reach the restore machinery. The
    // anchor (`scrubImportedConfig`) is a sibling import that travels the same
    // path, so a drifted/emptied file cannot pass this as "correctly excluded".
    const gallerySource = readFileSync(
      new URL('../../src/store/galleryImportSettlement.js', import.meta.url),
      'utf8',
    );
    expect(gallerySource).toContain("campaignState: { phase: 'draft', eventLog: [] }");
    expect(gallerySource).toContain('versionHistory: []');
    expect(gallerySource).toContain('aiData: {}');
    expectAbsentWithAnchor(
      gallerySource,
      'restoreLifecycle',
      'scrubImportedConfig',
      'the gallery importer keeps the distrust reset byte-identically',
    );
    expectAbsentWithAnchor(
      gallerySource,
      'admitRestoredLifecycle',
      'scrubImportedConfig',
      'the gallery importer never reaches the account restore wall',
    );
  });
});

describe('admitRestoredLifecycle — fail closed PER FIELD (§359.10)', () => {
  it('resets ONLY the field that fails, and says which', () => {
    const admitted = admitRestoredLifecycle({
      aiData: 'not-a-record',
      campaignState: {
        phase: 'canon',
        eventLog: ['not-an-event'],
        systemState: { unrest: 1 },
      },
      versionHistory: [{ id: 'snap-1' }],
    });
    // The two bad fields fell back; the two good ones came through whole.
    expect(admitted.aiData).toEqual({});
    expect(admitted.campaignState.eventLog).toEqual([]);
    expect(admitted.campaignState.phase).toBe('canon');
    expect(admitted.campaignState.systemState).toEqual({ unrest: 1 });
    expect(admitted.versionHistory).toEqual([{ id: 'snap-1' }]);
    expect(admitted.notices.map(n => n.field).sort())
      .toEqual(['aiData', 'campaignState.eventLog']);
    for (const notice of admitted.notices) expect(notice.reason).toMatch(/\S/);
  });

  it('falls the whole block back when campaignState is not a record', () => {
    const admitted = admitRestoredLifecycle({ campaignState: ['nope'] });
    expect(admitted.campaignState).toEqual({ phase: 'draft', eventLog: [] });
    expect(admitted.notices).toHaveLength(1);
    expect(admitted.notices[0].field).toBe('campaignState');
  });

  it('resets a non-string phase without losing the event history', () => {
    const admitted = admitRestoredLifecycle({
      campaignState: { phase: 7, eventLog: [{ id: 'ev-1' }] },
    });
    expect(admitted.campaignState.phase).toBe('draft');
    expect(admitted.campaignState.eventLog).toEqual([{ id: 'ev-1' }]);
    expect(admitted.notices.map(n => n.field)).toEqual(['campaignState.phase']);
  });

  it('resets a non-array versionHistory and restores the siblings whole', () => {
    const admitted = admitRestoredLifecycle({
      aiData: { aiDailyLife: ['dawn'] },
      campaignState: { phase: 'canon', eventLog: [] },
      versionHistory: { nope: true },
    });
    expect(admitted.versionHistory).toEqual([]);
    expect(admitted.aiData).toEqual({ aiDailyLife: ['dawn'] });
    expect(admitted.campaignState.phase).toBe('canon');
    expect(admitted.notices.map(n => n.field)).toEqual(['versionHistory']);
  });

  it('restores nothing and reports nothing for a row that carried nothing', () => {
    const admitted = admitRestoredLifecycle({});
    expect(admitted).toEqual({
      aiData: {},
      campaignState: { phase: 'draft', eventLog: [] },
      versionHistory: [],
      notices: [],
    });
  });
});

describe('restoreIntraEnvelopeWiring — intra-envelope only, fail closed', () => {
  const SOURCE = {
    neighbourNetwork: [
      {
        id: 'source-2',
        linkId: 'link_source-1_source-2',
        name: 'Elsewhere',
        neighbourName: 'Elsewhere',
        relationshipType: 'trade_partner',
        relationshipFrom: 'source-1',
        relationshipTo: 'source-2',
      },
      { id: 'source-99', linkId: 'link_source-1_source-99', name: 'Left Behind' },
      { id: 'generated_Elsewhere', name: 'Elsewhere', fromGeneration: true },
    ],
    interSettlementRelationships: [
      { linkId: 'link_source-1_source-2', npcName: 'Mira', partnerSettlement: 'Elsewhere' },
      { linkId: 'link_source-1_source-99', npcName: 'Ghost', partnerSettlement: 'Left Behind' },
    ],
  };

  it('re-addresses an edge whose BOTH endpoints landed from this envelope', () => {
    const wiring = restoreIntraEnvelopeWiring(SOURCE, {
      idMap: { 'source-1': 'fresh-1', 'source-2': 'fresh-2' },
      ownSaveId: 'fresh-1',
    });
    expect(wiring.neighbourNetwork).toHaveLength(1);
    const [edge] = wiring.neighbourNetwork;
    expect(edge.id).toBe('fresh-2');
    expect(edge.linkId).toBe(importedNeighbourLinkId('fresh-1', 'fresh-2'));
    // The canonical direction is stated in SAVE IDS and must travel with them.
    expect(edge.relationshipFrom).toBe('fresh-1');
    expect(edge.relationshipTo).toBe('fresh-2');
    expect(edge.relationshipType).toBe('trade_partner');
    expect(wiring.interSettlementRelationships)
      .toEqual([{ linkId: edge.linkId, npcName: 'Mira', partnerSettlement: 'Elsewhere' }]);
    // A dangling partner and the generated name-token stub both rebuild empty.
    expect(wiring.droppedNeighbours).toBe(2);
    expect(wiring.droppedRelationships).toBe(1);
    const rewired = JSON.stringify(wiring);
    for (const sourceId of ['source-1', 'source-2', 'source-99']) {
      expectAbsentWithAnchor(rewired, sourceId, 'fresh-2', 'source ids after the re-address');
    }
  });

  it('rebuilds empty when no endpoint landed', () => {
    const wiring = restoreIntraEnvelopeWiring(SOURCE, { idMap: {}, ownSaveId: 'fresh-1' });
    expect(wiring.neighbourNetwork).toEqual([]);
    expect(wiring.interSettlementRelationships).toEqual([]);
    // …and a PROTOTYPE name is not a landed partner. Every id read here comes
    // from the user-supplied file, and the map handed in here is a plain object
    // literal on purpose: the guard must hold without the caller's help, not
    // because the production caller happens to use Object.create(null).
    const hostile = restoreIntraEnvelopeWiring(
      {
        neighbourNetwork: [{ id: '__proto__' }, { id: 'constructor' }, { id: 'valueOf' }],
        interSettlementRelationships: [{ linkId: 'link_a' }],
      },
      { idMap: { 'source-2': 'fresh-2' }, ownSaveId: 'fresh-1' },
    );
    expect(hostile.neighbourNetwork).toEqual([]);
    expect(hostile.interSettlementRelationships).toEqual([]);
    expect(hostile.droppedNeighbours).toBe(3);
  });

  it('drops an edge whose canonical direction cannot be re-addressed', () => {
    const wiring = restoreIntraEnvelopeWiring(
      {
        neighbourNetwork: [{
          id: 'source-2',
          linkId: 'link_a',
          relationshipFrom: 'source-1',
          relationshipTo: 'source-404',
        }],
        interSettlementRelationships: [{ linkId: 'link_a', npcName: 'Mira' }],
      },
      { idMap: { 'source-1': 'fresh-1', 'source-2': 'fresh-2' }, ownSaveId: 'fresh-1' },
    );
    expect(wiring.neighbourNetwork).toEqual([]);
    expect(wiring.interSettlementRelationships).toEqual([]);
    expect(wiring.droppedNeighbours).toBe(1);
  });

  it('mints the SAME link id from either side of one edge', () => {
    expect(importedNeighbourLinkId('fresh-1', 'fresh-2'))
      .toBe(importedNeighbourLinkId('fresh-2', 'fresh-1'));
  });
});
