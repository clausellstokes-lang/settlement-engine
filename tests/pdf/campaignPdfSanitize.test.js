/**
 * tests/pdf/campaignPdfSanitize.test.js
 *
 * generateCampaignPDF's `s()` sanitiser strips anything outside Latin-1 because
 * jsPDF's built-in Helvetica can't render it. The old implementation replaced
 * each unrenderable char with a SPACE, which then collapsed away under the
 * trailing whitespace-collapse + trim — so a fully CJK or Cyrillic settlement
 * name silently sanitised to an EMPTY string and rendered as a blank cell.
 *
 * The fix: romanise Cyrillic (a large, common script Helvetica still can't draw)
 * and replace any remaining unrenderable run with a single visible '?' marker
 * so the DM at least sees that a name exists.
 *
 * These tests pin both behaviours and confirm the regression (blank output).
 */
import { describe, test, expect } from 'vitest';
import { __sanitizeForPdf as s } from '../../src/utils/generateCampaignPDF.js';

describe('generateCampaignPDF — Latin-1 sanitiser does not blank non-Latin names', () => {
  test('a fully CJK name no longer sanitises to an empty string', () => {
    const out = s('北京'); // 北京 (Beijing)
    expect(out).not.toBe('');
    expect(out).toBe('?'); // visible placeholder, not a blank cell
  });

  test('a fully Arabic name keeps a visible placeholder instead of blanking', () => {
    const out = s('مدينة'); // مدينة (city)
    expect(out).not.toBe('');
    expect(out).toBe('?');
  });

  test('Cyrillic is romanised, not blanked or reduced to a placeholder', () => {
    expect(s('Москва')).toBe('Moskva'); // Москва
    expect(s('Русь')).toBe('Rus'); // Русь
  });

  test('mixed Latin + CJK keeps the Latin part and marks the unrenderable run', () => {
    const out = s('Port 東京 Harbor'); // Port 東京 Harbor
    expect(out).toBe('Port ? Harbor');
  });

  test('plain ASCII and Latin-1 accented text pass through unchanged', () => {
    expect(s('Aldermoor')).toBe('Aldermoor');
    expect(s('Crèvecoeur')).toBe('Crèvecoeur'); // è is Latin-1
  });

  test('smart punctuation still folds to ASCII (existing contract preserved)', () => {
    expect(s('‘quote’ — dash…')).toBe("'quote' - dash...");
  });
});
