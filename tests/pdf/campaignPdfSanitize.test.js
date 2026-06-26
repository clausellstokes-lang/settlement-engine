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
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { __sanitizeForPdf as s } from '../../src/utils/generateCampaignPDF.js';

const generatorSrc = readFileSync(
  fileURLToPath(new URL('../../src/utils/generateCampaignPDF.js', import.meta.url)),
  'utf8',
);

describe('generateCampaignPDF — no local binding shadows the module sanitiser s()', () => {
  // buildCover (and the map/appendix iterators) once bound `s` as the loop /
  // arrow variable, shadowing the module-level `s()` sanitiser inside that
  // scope — so any sanitiser call moved into the block would silently invoke
  // the settlement object as a function. The bindings are renamed to `save`;
  // pin that no `s`-named iteration over `settlements` reappears.
  test('settlements is never iterated with a single-letter `s` binding', () => {
    expect(generatorSrc).not.toMatch(/for\s*\(\s*const\s+s\s+of\s+settlements\s*\)/);
    expect(generatorSrc).not.toMatch(/settlements\.(?:map|filter|forEach)\(\s*s\s*=>/);
  });
});

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
