/**
 * e2e/flow-d-export.spec.js — Tier 3.7 Flow D (F37).
 *
 * EXPORT path — the single canonical PDF-export journey (Flow A's filename
 * historically claimed "...-export" but never asserted one; this spec owns it).
 *
 * A signed-in free-tier user (export is a free-tier capability — TIER_GATE.free
 * .export === true) generates a settlement, saves it, opens its detail view, and
 * exports a PDF via the ExportSheet variant picker. The export is fully
 * client-side (@react-pdf/renderer → Blob → anchor download in
 * utils/generateSettlementPDF.js), so no network stubs are needed beyond the
 * mock-auth seed. We assert a real browser download event fires with a `.pdf`
 * filename and a non-trivial byte size.
 *
 * Mode: local (VITE_E2E_LOCAL_DATA=true) — same seam as Flow C.
 */

import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const MOCK_FREE_AUTH = {
  user: { id: 'mock-free-e2e', email: 'wanderer@example.test', user_metadata: {} },
  session: { access_token: 'mock-token' },
  tier: 'free',
  role: 'user',
  displayName: 'Wanderer',
  isFounder: false,
  needsVerification: false,
  emailNotifications: true,
};

const SAVES_KEY = 'dnd_settlement_saves';

function hero(page) {
  return page.locator('section[aria-label*="generator"]').first();
}
function sizeButton(scope, label) {
  return scope.locator(`button[data-settlement-size="${label.toLowerCase()}"]`);
}
function primaryCta(scope) {
  return scope.getByRole('button', { name: /Generate a|Forge a|Begin a settlement/i }).first();
}
function dossierMeta(page) {
  return page
    .locator('main')
    .getByText(/\b(thorp|hamlet|village|town|city|capital|metropolis)\b\s*·\s*pop\.?\s*\d/i)
    .first();
}
async function waitForDossier(page) {
  await page.keyboard.press('Escape').catch(() => {});
  await expect(dossierMeta(page)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Loading settlement view...')).toHaveCount(0, { timeout: 30_000 });
}

test.describe('Tier 3.7 Flow D — PDF export journey', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-safari', 'desktop-only journey');
    await page.addInitScript((auth) => {
      try { localStorage.setItem('settlement_mock_auth', JSON.stringify(auth)); } catch { /* private mode */ }
    }, MOCK_FREE_AUTH);
  });

  test('generate → save → export triggers a .pdf download of non-trivial size', async ({ page }) => {
    // PDF rendering off the main thread can take a few seconds headless.
    test.setTimeout(90_000);

    await page.goto('/create');

    // Generate a complete settlement via the real hero (guarantees every field
    // the PDF layout expects is present).
    const h = hero(page);
    await expect(h).toBeVisible({ timeout: 10_000 });
    await sizeButton(h, 'Village').click();
    await primaryCta(h).click();
    await waitForDossier(page);

    // Save it so we can open its detail view (the export affordance lives in
    // SettlementDetail, not the generate output toolbar).
    await page.getByRole('button', { name: /^Save to Library$/ }).click();
    await expect(page.getByRole('button', { name: /Saved to Library/ })).toBeVisible({ timeout: 10_000 });

    const savedId = await page.evaluate((key) => {
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      return arr[0] ? String(arr[0].id) : null;
    }, SAVES_KEY);
    expect(savedId, 'save id not found').toBeTruthy();

    // Open the detail view and launch the export variant picker.
    await page.goto(`/settlements/${encodeURIComponent(savedId)}`);
    const openExport = page.getByRole('button', { name: /Export Dossier|Building PDF/i });
    await expect(openExport).toBeVisible({ timeout: 15_000 });
    await openExport.click();

    // ExportSheet modal — pick + commit. The primary CTA reads
    // "Export {variant label}"; a draft settlement defaults to Draft Brief.
    const sheet = page.getByRole('dialog', { name: /Export/i });
    await expect(sheet).toBeVisible({ timeout: 10_000 });
    const commit = sheet.getByRole('button', { name: /^Export (Draft Brief|Canon Dossier|Timeline Packet)$/ });
    await expect(commit).toBeVisible();

    // The export runs client-side and triggers an anchor download.
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60_000 }),
      commit.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    const filePath = await download.path();
    expect(filePath, 'download produced no file').toBeTruthy();
    const { size } = fs.statSync(filePath);
    // A real dossier PDF is comfortably over a few KB; guard against a
    // zero/near-empty artifact.
    expect(size, `pdf was suspiciously small (${size} bytes)`).toBeGreaterThan(2_000);
  });
});
