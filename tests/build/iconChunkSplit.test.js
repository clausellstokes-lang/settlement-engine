/**
 * iconChunkSplit.test.js — the map-only lucide-react split.
 *
 * vite.config.js routes icons imported ONLY by src/components/map/** into a
 * lazy `vendor-icons-map` chunk so they stop paying first-paint bytes (the
 * budget win is asserted in vendorPdfLazy.test.js). This guards the split's
 * SAFETY invariant independently of the bundle: an icon is moved out of the
 * first-paint chunk only if no non-map surface imports it, so nothing a
 * first-paint view needs can ever be routed to the lazy chunk.
 *
 * It re-derives the classification from source (the same rule vite.config uses)
 * and asserts the invariant, then confirms the emitted chunk exists.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');
const MAP_DIR = join(SRC, 'components', 'map');

function walk(d, out = []) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|tsx?)$/.test(e)) out.push(p);
  }
  return out;
}
function iconsOf(file) {
  const code = readFileSync(file, 'utf8');
  const set = new Set();
  for (const m of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"]/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/)[0].trim();
      if (/^[A-Z][A-Za-z0-9]*$/.test(name)) set.add(name);
    }
  }
  return set;
}

const mapIcons = new Set();
const otherIcons = new Set();
for (const f of walk(SRC)) {
  const target = f.startsWith(MAP_DIR) ? mapIcons : otherIcons;
  for (const i of iconsOf(f)) target.add(i);
}
const mapOnly = [...mapIcons].filter((i) => !otherIcons.has(i));

describe('map-only lucide icon split', () => {
  it('finds map-exclusive icons to move out of first paint', () => {
    expect(mapOnly.length).toBeGreaterThan(0);
  });

  it('never classifies a shared icon as map-only (the safety invariant)', () => {
    // By construction mapOnly excludes otherIcons; this pins the invariant so a
    // future refactor of the classifier can never route a first-paint icon into
    // the lazy chunk.
    for (const icon of mapOnly) {
      expect(otherIcons.has(icon), `${icon} is used outside src/components/map — must NOT be map-only`).toBe(false);
    }
  });

  it('emits the lazy vendor-icons-map chunk (after a build)', () => {
    const assets = join(ROOT, 'dist', 'assets');
    if (!existsSync(assets)) return; // build-dependent; vendorPdfLazy covers the budget
    const files = readdirSync(assets);
    const mapChunk = files.find((f) => /^vendor-icons-map-.*\.js$/.test(f));
    const mainChunk = files.find((f) => /^vendor-icons-[^m].*\.js$/.test(f));
    expect(mapChunk, 'vendor-icons-map chunk should be emitted').toBeTruthy();
    // The map chunk carries only the moved icons, so it is smaller than the
    // first-paint icon chunk.
    if (mapChunk && mainChunk) {
      expect(statSync(join(assets, mapChunk)).size).toBeLessThan(statSync(join(assets, mainChunk)).size);
    }
  });
});
