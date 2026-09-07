/**
 * tests/design/organicMaterial.test.js — THE MATERIAL LAYER contracts
 * (Deep Craft phase 0b; Organic Craft law §5/§6/§8).
 *
 * 1. The pre-baked grain tiles exist and stay SMALL (byte ceilings — a re-baked
 *    tile that balloons is a perf regression, not a texture improvement).
 * 2. organic.css references exactly the tiles that exist (path integrity — a
 *    renamed tile would otherwise 404 into a silent no-grain).
 * 3. Ink-bite frames are DETERMINISTIC (same seed ⇒ byte-identical SVG; the
 *    seeded-ornament golden discipline) and differ across seeds (provenance,
 *    not decoration).
 * 4. THE FILTER BAN: no committed organic-layer source emits feTurbulence /
 *    feDisplacementMap — the filter evaluates at render; materials are
 *    pre-baked, permanently (law §8).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { inkBiteFrameSvg, GRAIN_TILES, MATERIAL_GRAMMAR } from '../../src/design/organic/material.js';

const ROOT = process.cwd();
const TEX_DIR = resolve(ROOT, 'public', 'textures');
const ORGANIC_CSS = resolve(ROOT, 'src', 'styles', 'organic.css');

// Measured 2026-07-18 at bake: light 3,132 B · dim 2,887 B. Ceiling = measured
// + ~30% headroom for a legitimate re-bake; a 10× tile fails loudly.
const TILE_BYTE_CEILING = 4200;

describe('the material layer', () => {
  it('both grain tiles exist under public/textures and clear the byte ceiling', () => {
    for (const rel of Object.values(GRAIN_TILES)) {
      const p = join(TEX_DIR, rel.replace('/textures/', ''));
      const size = statSync(p).size;
      expect(size, `${rel} = ${size} B — exceeds the ${TILE_BYTE_CEILING} B tile ceiling`).toBeLessThanOrEqual(TILE_BYTE_CEILING);
      expect(size).toBeGreaterThan(0);
    }
  });

  it('organic.css references exactly the committed tile paths', () => {
    const css = readFileSync(ORGANIC_CSS, 'utf-8');
    for (const rel of Object.values(GRAIN_TILES)) {
      expect(css, `organic.css must reference ${rel}`).toContain(`url('${rel}')`);
    }
  });

  it('ink-bite frames are seed-deterministic and seed-distinct', () => {
    const a1 = inkBiteFrameSvg({ seed: 'harborwatch' });
    const a2 = inkBiteFrameSvg({ seed: 'harborwatch' });
    const b = inkBiteFrameSvg({ seed: 'thornfield' });
    expect(a1).toBe(a2);
    expect(a1).not.toBe(b);
    expect(a1).toContain('fill-rule="evenodd"');
    expect(a1).toContain('aria-hidden="true"');
  });

  it('material grammar names both marks (system, not instances)', () => {
    expect(Object.keys(MATERIAL_GRAMMAR).sort()).toEqual(['grain', 'inkBite']);
  });

  it('THE FILTER BAN: no organic-layer source emits feTurbulence/feDisplacementMap', () => {
    // Tag form only (`<feTurbulence`), so a comment NAMING the ban never trips it.
    const banned = /<\s*fe(?:Turbulence|DisplacementMap)/;
    const offenders = [];
    const scan = (dir) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) scan(p);
        else if (/\.(js|jsx|css)$/.test(name) && banned.test(readFileSync(p, 'utf-8'))) offenders.push(p);
      }
    };
    scan(resolve(ROOT, 'src', 'design', 'organic'));
    scan(resolve(ROOT, 'src', 'components', 'organic'));
    if (banned.test(readFileSync(ORGANIC_CSS, 'utf-8'))) offenders.push(ORGANIC_CSS);
    expect(offenders, `runtime turbulence is banned; pre-bake instead:\n  ${offenders.join('\n  ')}`).toHaveLength(0);
  });
});
