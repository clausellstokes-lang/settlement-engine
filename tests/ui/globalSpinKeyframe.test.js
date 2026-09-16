/**
 * tests/ui/globalSpinKeyframe.test.js — F28 slice 1 guard.
 *
 * The `.sf-spin` busy spinner (Button primitive busy state + map loaders)
 * used to be defined in an inline <style> inside WorldMapOverlays.jsx, so the
 * `@keyframes sf-spin` only existed while the world map was mounted. Every
 * other `.sf-spin` (e.g. the Button primitive's busy icon, app-wide) rendered
 * a frozen icon.
 *
 * The keyframe now lives once, globally, in src/index.css. These are
 * source-scan guards so a future refactor can't silently re-fork it back
 * into a component and re-break the spinner outside the map.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..', '..');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist') continue;
      walk(full, out);
    } else if (/\.(jsx?|css)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe('F28 slice 1 — global sf-spin keyframe', () => {
  test('src/index.css defines the @keyframes sf-spin', () => {
    const css = readFileSync(join(REPO, 'src', 'index.css'), 'utf8');
    expect(css).toMatch(/@keyframes\s+sf-spin\b/);
    expect(css).toMatch(/\.sf-spin\s*\{[^}]*animation:\s*sf-spin/);
  });

  test('no source file OTHER than src/index.css defines a local sf-spin keyframe', () => {
    const indexCss = join(REPO, 'src', 'index.css');
    const offenders = [];
    for (const file of walk(join(REPO, 'src'))) {
      if (file === indexCss) continue;
      const src = readFileSync(file, 'utf8');
      if (/@keyframes\s+sf-spin\b/.test(src)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });
});
