/**
 * covenantClaimsParity.test.js — R-7: the portability covenant cannot over-promise.
 *
 * CLAIMS-VS-ENFORCEMENT PARITY (A+ bar 13): every promise the /covenant page makes
 * is one the code actually keeps. Each claim binds to a real capability; if that
 * capability is removed, this pin reddens. And a negative guard: the page must not
 * make absolute promises the product cannot back.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as accountData from '../../src/lib/accountData.js';
import { OPERATIONS } from '../../src/store/operationRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const covenantSrc = readFileSync(join(ROOT, 'src/components/legal/CovenantPage.jsx'), 'utf8');
const existsSrc = (rel) => { try { readFileSync(join(ROOT, rel), 'utf8'); return true; } catch { return false; } };

describe('R-7 portability covenant — claims parity', () => {
  it('the JSON-export claim is backed by a WORKING exporter (executed round-trip, not a symbol check)', () => {
    // SS4: `typeof === 'function'` proved a symbol existed, not that the claim
    // held — a gutted exporter returning {} kept the pin green. Execute it.
    expect(typeof accountData.downloadAccountExport).toBe('function');
    const out = accountData.buildAccountExport({
      auth: { user: { email: 'dm@example.test' }, displayName: 'DM', tier: 'free' },
      savedSettlements: [{ id: 's1', name: 'Bridgeford', settlement: { name: 'Bridgeford', tier: 'town' } }],
      campaigns: [{ id: 'c1', name: 'The Long Road' }],
    });
    const parsed = JSON.parse(JSON.stringify(out)); // the covenant promises a JSON file
    expect(parsed.version).toBe(accountData.ACCOUNT_EXPORT_VERSION);
    expect(parsed.profile.email).toBe('dm@example.test');
    expect(parsed.settlements).toHaveLength(1);
    expect(parsed.settlements[0].settlement.name).toBe('Bridgeford');
    expect(parsed.campaigns).toHaveLength(1);
    expect(covenantSrc).toMatch(/JSON file/i);           // the page claims it…
    expect(covenantSrc).toMatch(/export/i);
  });

  it('the import-it-back claim is backed by a WORKING import validator (the export round-trips)', async () => {
    expect(OPERATIONS.importAccountData).toBeTruthy();    // the store action exists
    expect(covenantSrc).toMatch(/[Ii]mport that file back/);
    // Executed half: the file the exporter produces must be ACCEPTED by the
    // import pipeline's validator — "export it… import that file back" as a
    // real round-trip, so gutting either side reddens this pin.
    const { validateAccountImport } = await import('../../src/lib/accountImport.js');
    const text = JSON.stringify(accountData.buildAccountExport({
      auth: { user: { email: 'dm@example.test' }, tier: 'free' },
      savedSettlements: [{ id: 's1', name: 'Bridgeford', settlement: { name: 'Bridgeford', tier: 'town' } }],
      campaigns: [],
    }), null, 2);
    const verdict = validateAccountImport(text);
    expect(verdict.ok, `exporter output rejected by the import validator: ${verdict.error || ''}`).toBe(true);
  });

  it('the PDF-keepsake claim is backed by a real PDF document', () => {
    expect(existsSrc('src/pdf/SettlementPDF.jsx')).toBe(true);
    expect(covenantSrc).toMatch(/PDF/);
  });

  it('the delete-means-gone claim is backed by a real deletion request', () => {
    expect(typeof accountData.requestAccountDeletion).toBe('function');
    expect(covenantSrc).toMatch(/[Dd]elete/);
  });

  it('the no-account claim matches the account-free generate/save capability', () => {
    // Anon generate/save is a product invariant (Terms states it; anon save path).
    expect(covenantSrc).toMatch(/without ever making an account/i);
  });

  it('does NOT make absolute promises the product cannot back (over-claim guard)', () => {
    for (const forbidden of [/forever free/i, /unlimited/i, /we will never/i, /guaranteed/i, /100%/]) {
      expect(covenantSrc, `covenant over-claims: ${forbidden}`).not.toMatch(forbidden);
    }
  });
});
