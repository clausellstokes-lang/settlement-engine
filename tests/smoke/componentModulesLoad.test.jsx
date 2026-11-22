/** @vitest-environment jsdom */
/**
 * componentModulesLoad.test.jsx — module-eval backstop for the untyped JSX layer.
 *
 * The component / PDF JSX tree is DELIBERATELY excluded from the tsc gate
 * (tsconfig.full.json), and ESLint there only catches undefined symbols. So a
 * module-scope crash — a wrong method or property on an imported constant, e.g.
 * `const x = THEME.notAMethod().nope` — throws at import time yet sails through
 * `npm run check`, because nothing imports the module during the suite. (Exactly
 * how a planted `const _bug = GOLD.someMethodThatDoesNotExist(...)` in App.jsx
 * once passed the whole gate.)
 *
 * This evaluates every component module so any such crash fails CI, named to
 * the offending file. It is a SMOKE test (does the module load?), not a render
 * test — it deliberately doesn't mount anything, so it stays fast and provider-
 * free while still closing the "ships-green module-eval crash" gap.
 */
import { describe, it, expect } from 'vitest';

// Array-of-globs: the app entry plus the whole component tree. Lazy importers
// (eager:false default) so each module is evaluated in its own test and a
// single failure points at one file instead of failing opaquely.
const modules = import.meta.glob(['../../src/App.jsx', '../../src/components/**/*.jsx']);

describe('JSX modules evaluate without throwing (tsc-gap backstop)', () => {
  const paths = Object.keys(modules);

  it('discovers the component tree', () => {
    expect(paths.length).toBeGreaterThan(50);
  });

  for (const path of paths) {
    it(`loads ${path}`, async () => {
      await expect(modules[path]()).resolves.toBeTruthy();
    });
  }
});
