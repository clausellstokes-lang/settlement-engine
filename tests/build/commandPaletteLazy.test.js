/**
 * commandPaletteLazy.test.js — the palette's eager-cost contract (Vision V-H, R-20).
 *
 * The feature's ONLY sanctioned eager cost is the tiny host (a key listener). The
 * heavy palette body must never enter the first-paint static closure: it is
 * reached solely through a dynamic import() inside the host's lazy(). This pins
 * that at the source level (no build needed), the foundryLazy idiom.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

// The eager boot modules whose STATIC import graph is the first-paint closure.
const EAGER_BOOTS = ['src/main.jsx', 'src/App.jsx', 'src/AppViews.jsx', 'src/store/index.js'];
// A STATIC import of the heavy body: `... from '<path>/CommandPalette.jsx'`. A
// dynamic `import('./CommandPalette.jsx')` uses no `from`, so it never matches.
const STATIC_BODY = /from\s+['"][^'"]*\/CommandPalette\.jsx['"]/;

describe('command palette stays lazy (Vision V-H, R-20)', () => {
  it('no eager boot statically imports the heavy palette body', () => {
    for (const rel of EAGER_BOOTS) {
      expect(STATIC_BODY.test(read(rel)), `${rel} must not statically import CommandPalette.jsx`).toBe(false);
    }
  });

  it('App eagerly imports only the tiny host (the sanctioned eager sliver)', () => {
    expect(read('src/App.jsx')).toMatch(/from\s+['"]\.\/components\/CommandPaletteHost\.jsx['"]/);
  });

  it('the host reaches the body only through a dynamic import()', () => {
    const host = read('src/components/CommandPaletteHost.jsx');
    expect(host).toMatch(/import\(\s*['"]\.\/CommandPalette\.jsx['"]\s*\)/);
    expect(STATIC_BODY.test(host)).toBe(false);
  });
});
