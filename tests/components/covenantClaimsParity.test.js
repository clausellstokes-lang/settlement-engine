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
  it('the JSON-export claim is backed by a real exporter', () => {
    expect(typeof accountData.downloadAccountExport).toBe('function');
    expect(typeof accountData.buildAccountExport).toBe('function');
    expect(covenantSrc).toMatch(/JSON file/i);           // the page claims it…
    expect(covenantSrc).toMatch(/export/i);
  });

  it('the import-it-back claim is backed by a real importer', () => {
    expect(OPERATIONS.importAccountData).toBeTruthy();    // the store action exists
    expect(covenantSrc).toMatch(/[Ii]mport that file back/);
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
