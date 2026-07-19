/**
 * printPaletteContract.test.js — pins the PDF palette's relationship to the
 * canonical screen tokens (design/tokens.js), so the print theme can no longer
 * silently drift from the brand.
 *
 * Why this exists: pdf/theme.js used to carry a comment claiming its hexes
 * "match the on-screen UI" — they did NOT. The PDF palette is a deliberate
 * PRINT-TUNED variant (darker chromatic accents for ink density on white stock),
 * and the screen↔PDF parity contract already exempts tone COLOR as per-surface.
 * This test makes that relationship LOAD-BEARING instead of a prose claim:
 *   1. Neutrals that are meant to equal the screen token DO (a re-skin flows through).
 *   2. Each chromatic accent stays at-or-darker than its named screen token, so a
 *      re-skin can't lighten the printed product past legibility without this failing
 *      and naming the exact accent to re-tune.
 */
import { describe, test, expect } from 'vitest';
import { palette } from '../../src/pdf/theme.js';
import { legacy as L } from '../../src/design/tokens.js';

/** WCAG relative luminance (0 = black … 1 = white) of a #rrggbb hex. */
function luminance(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) throw new Error(`not a #rrggbb hex: ${hex}`);
  const chan = (h) => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * chan(m[1]) + 0.7152 * chan(m[2]) + 0.0722 * chan(m[3]);
}

describe('PDF print-palette contract (design/tokens lineage)', () => {
  test('neutrals that mirror the screen token reference it directly', () => {
    // These are wired to the token in pdf/theme.js, so this is really asserting the
    // wiring survives a refactor — a re-skin of these tokens flows into the PDF.
    expect(palette.ink).toBe(L.INK);   // ink-900
    expect(palette.card).toBe(L.CARD); // CARD (#FFFBF5)
    expect(palette.cool).toBe(L.BLUE); // patron/client/infrastructure
  });

  test('chromatic accents stay at-or-darker than their screen token (print-tuned)', () => {
    // The design intent: print accents are darker than screen accents for ink density
    // on white stock. If a re-skin darkens a screen token BELOW the print variant, this
    // fails and names the accent whose print value must be re-tuned.
    const pairs = [
      ['gold', palette.gold, L.GOLD],
      ['good', palette.good, L.GREEN],
      ['bad',  palette.bad,  L.RED],
      ['ai',   palette.ai,   L.SLATE],
    ];
    for (const [name, print, screen] of pairs) {
      expect(
        luminance(print),
        `print accent "${name}" (${print}) must be at-or-darker than its screen token (${screen})`,
      ).toBeLessThanOrEqual(luminance(screen));
    }
  });
});
