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
import { describe, expect, it } from 'vitest';
import {
  validateAccountImport,
  prepareSettlementEntry,
  MAX_IMPORT_SETTLEMENTS,
} from '../../src/lib/accountImport.js';
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
  });

  it('rejects a NEWER-than-this-build version (no down-migration)', () => {
    const res = validateAccountImport(envelope({ version: ACCOUNT_EXPORT_VERSION + 1 }));
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/newer version/i);
  });

  it('rejects a wrong-shape settlements / campaigns field', () => {
    expect(validateAccountImport(envelope({ settlements: { not: 'an array' } })).ok).toBe(false);
    expect(validateAccountImport(envelope({ campaigns: 'nope' })).ok).toBe(false);
  });

  it('rejects too many settlements (DoS bound)', () => {
    const many = new Array(MAX_IMPORT_SETTLEMENTS + 1).fill({ settlement: {} });
    expect(validateAccountImport(envelope({ settlements: many })).ok).toBe(false);
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
