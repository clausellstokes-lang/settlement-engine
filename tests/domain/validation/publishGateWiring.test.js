/**
 * publishGateWiring.test.js — A+ P0.7.
 *
 * validateDossier (the cross-surface trust gate) is wired AND unit-tested, but the
 * wiring itself was unpinned — exactly the "computed but ignored" failure mode that
 * let the library filter go inert. These structural pins lock the gate so a refactor
 * can't silently drop it:
 *   - ShareToGallery (public publish) must HARD-BLOCK on blocking issues;
 *   - SettlementDetail (private PDF export) must at least RUN the validator
 *     (it deliberately warns rather than blocks — a private doc).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

describe('validateDossier is wired into the publish gate (A+ P0.7)', () => {
  const share = read('src/components/ShareToGallery.jsx');

  test('ShareToGallery imports validateDossier from the consistency module', () => {
    expect(share).toMatch(/import\s*\{[^}]*validateDossier[^}]*\}\s*from\s*['"][^'"]*validation\/consistency/);
  });

  test('publish computes blocking AND returns early before publishSettlement (hard gate)', () => {
    expect(share).toMatch(/const\s*\{\s*blocking\s*\}\s*=\s*validateDossier\(/);
    // The blocking check + early return must appear BEFORE the publishSettlement call,
    // i.e. an unresolved-issues dossier can never reach publish.
    const guardIdx = share.search(/if\s*\(\s*blocking\.length/);
    const publishIdx = share.search(/publishSettlement\(/);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(publishIdx).toBeGreaterThan(-1);
    expect(guardIdx).toBeLessThan(publishIdx);
  });
});

describe('validateDossier runs on the PDF-export path (A+ P0.7)', () => {
  const detail = read('src/components/SettlementDetail.jsx');

  test('handlePdfExport invokes validateDossier (warn-not-block by design)', () => {
    expect(detail).toMatch(/import\s*\{[^}]*validateDossier[^}]*\}\s*from\s*['"][^'"]*validation\/consistency/);
    expect(detail).toMatch(/validateDossier\(/);
  });
});
