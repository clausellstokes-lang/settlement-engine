import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, test, expect } from 'vitest';

/**
 * Font-registration parity (audit finding: the byte-render tests re-register fonts
 * from on-disk paths because fontkit can't open the Vite `/fonts/…?v=2` URLs, so they
 * don't exercise the production font-resolution path — and could silently drift).
 *
 * The two paths necessarily differ in HOW they name the font (Vite URL vs on-disk
 * path), so full unification isn't possible. What CAN drift is the SET of fonts: if
 * theme.js registers a family/weight the byte-render harness doesn't (or renames a
 * file), the byte-render tests would validate a document rendered with a different or
 * missing font than production, with a green suite. This pins that the font FILES are
 * identical across production, both byte-render harnesses, and the on-disk assets.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (p) => readFileSync(join(root, p), 'utf8');

// Production registers `/fonts/Name.ttf?v=N`; the byte-render harnesses register
// `join(FONT_DIR, 'Name.ttf')`. Both reduce to the bare `Name.ttf` file set.
const fontFilesIn = (src) =>
  new Set([...src.matchAll(/([A-Za-z0-9-]+\.ttf)/g)].map((m) => m[1]));

describe('PDF font registration is in lockstep across prod / test / disk', () => {
  const prod = fontFilesIn(read('src/pdf/theme.js'));
  const harnesses = {
    'fullDocByteRender': fontFilesIn(read('tests/pdf/fullDocByteRender.test.js')),
    'notableNpcsByteRender': fontFilesIn(read('tests/pdf/notableNpcsByteRender.test.js')),
  };

  test('production theme.js actually registers fonts (not vacuous)', () => {
    expect(prod.size).toBeGreaterThanOrEqual(4);
  });

  test.each(Object.entries(harnesses))('%s registers exactly the production font-file set', (name, set) => {
    expect([...set].sort(), `${name} font set drifted from theme.js`).toEqual([...prod].sort());
  });

  test('every registered font file exists in public/fonts/', () => {
    for (const file of prod) {
      expect(existsSync(join(root, 'public/fonts', file)), `missing font asset: public/fonts/${file}`).toBe(true);
    }
  });
});
