/**
 * worldPageLazy.test.js — Vision V-13 THE SEED POST: the /world/<code> route
 * stays OUT of the first-paint graph. Source-level contracts (the foundryLazy
 * idiom) that fail with a named culprit even without a build: WorldPage is a
 * React.lazy route, and it reaches the composer/engine ONLY via dynamic import().
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');

describe('V-13 — the World page stays lazy', () => {
  it('AppViews.jsx reaches WorldPage only via lazy(() => import())', () => {
    const src = read('src/AppViews.jsx');
    expect(src).toMatch(/lazy\(\s*\(\)\s*=>\s*import\(['"][^'"]*\/WorldPage\.jsx['"]\)\s*\)/);
    // never a top-level static import of the page
    expect(src).not.toMatch(/^import\s+WorldPage\s+from/m);
  });

  it('WorldPage.jsx reaches the composer (and the engine) ONLY via dynamic import()', () => {
    const src = read('src/components/WorldPage.jsx');
    expect(src).toMatch(/import\(['"][^'"]*composeInstantWorld[^'"]*['"]\)/);
    expect(src).not.toMatch(/^import\s.*from\s+['"][^'"]*composeInstantWorld[^'"]*['"]/m);
  });

  it('eager boot modules never statically import WorldPage', () => {
    for (const p of ['src/main.jsx', 'src/App.jsx', 'src/store/index.js']) {
      expect(read(p), p).not.toMatch(/['"][^'"]*\/WorldPage\.jsx['"]/);
    }
  });
});
