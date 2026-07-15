/**
 * Regression guard for the busy-button spinner keyframe (correctness bug).
 *
 * primitives/Button renders the busy spinner as `<Loader2 className="sf-spin">`
 * on every surface (checkout/save/share/export/AI). The `.sf-spin` rule and its
 * `@keyframes sf-spin` once lived ONLY in an inline <style> inside
 * map/WorldMapOverlays.jsx, which mounts only on the world-map route — so all
 * ~28 off-map busy buttons rendered a frozen, non-spinning icon.
 *
 * The fix moves the rule + keyframes into the globally-loaded src/index.css
 * (beside @keyframes sf-goldShimmer). This is a source-scan so it can't regress
 * back into a route-scoped stylesheet.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const indexCss = readFileSync(join(ROOT, 'src/index.css'), 'utf8');
const overlays = readFileSync(
  join(ROOT, 'src/components/map/WorldMapOverlays.jsx'),
  'utf8',
);

describe('busy-button spinner keyframe is globally loaded', () => {
  test('src/index.css defines the .sf-spin rule and @keyframes sf-spin', () => {
    expect(indexCss).toMatch(/\.sf-spin\s*\{[^}]*animation:[^}]*sf-spin/);
    expect(indexCss).toMatch(/@keyframes\s+sf-spin\s*\{/);
  });

  test('src/index.css honours prefers-reduced-motion for the spinner', () => {
    expect(indexCss).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });

  test('the keyframe is no longer defined in the route-scoped WorldMapOverlays', () => {
    expect(overlays).not.toMatch(/@keyframes\s+sf-spin/);
  });
});
