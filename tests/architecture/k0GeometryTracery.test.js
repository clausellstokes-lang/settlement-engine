/**
 * k0GeometryTracery.test.js -- K-0 SPIKE gate (a): tracery-without-trig, proven executable.
 *
 * The grammar-less arch/ spike (src/domain/townMap/arch) hand-constructs a traceried gothic
 * window in pure rational JS. These pins prove the load-bearing claim of the kernel doc's K-0
 * gate (a): the full gothic curve vocabulary -- pointed arches, cusped foils, and a
 * NON-constructible septfoil oculus -- builds and serializes with ZERO runtime trigonometry
 * and using ONLY cubic Beziers (never the SVG arc `A` command).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { buildGothicWindow } from '../../src/domain/townMap/arch/gothicWindow.js';
import { HEPTA_DIRS } from '../../src/domain/townMap/arch/rationalTables.js';
import { toEngravingSvg, buildScene } from '../../src/domain/townMap/arch/spike.js';

const ARCH_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../src/domain/townMap/arch');
const PLACE = { ox: 180, oy: 0, oz: 120 };

describe('gothic window geometry builds and is well-formed', () => {
  it('produces glass, stone and bar regions', () => {
    const { regions } = buildGothicWindow(PLACE);
    const roles = new Set(regions.map((r) => r.role));
    expect(roles.has('glass')).toBe(true);
    expect(roles.has('stone')).toBe(true);
    expect(roles.has('bar')).toBe(true);
    expect(regions.filter((r) => r.role === 'glass').length).toBe(3); // 2 lights + oculus
  });

  it('every curved segment is a cubic Bezier -- there is no arc primitive', () => {
    const { regions } = buildGothicWindow(PLACE);
    for (const r of regions) {
      for (const seg of r.sub.segs) {
        expect(seg.t === 'L' || seg.t === 'C').toBe(true);
      }
    }
  });
});

describe('the septfoil oculus is placed from the pinned non-constructible table', () => {
  it('HEPTA_DIRS is a 7-entry unit ring (integer literals, scaled 1e4)', () => {
    expect(HEPTA_DIRS.length).toBe(7);
    for (const [cx, cy] of HEPTA_DIRS) {
      const mag = Math.sqrt(cx * cx + cy * cy);
      expect(Math.abs(mag - 10000)).toBeLessThan(2); // unit within rounding of the literals
    }
  });

  it('the window carries a 7-lobe cusped foil ring (the septfoil), all cubic', () => {
    const { regions } = buildGothicWindow(PLACE);
    const foil = regions.find((r) => r.role === 'bar' && r.sub.closed && r.sub.segs.length === 7);
    expect(foil, 'a closed 7-segment (septfoil) bar region must exist').toBeTruthy();
    for (const seg of foil.sub.segs) expect(seg.t).toBe('C');
  });
});

describe('the projected engraving uses no arc command', () => {
  it('every path `d` is composed only of M / L / C / Z commands', () => {
    const svg = toEngravingSvg(buildScene({ width: 720, height: 720 }));
    const ds = [...svg.matchAll(/ d="([^"]*)"/g)].map((m) => m[1]);
    expect(ds.length).toBeGreaterThan(0);
    for (const d of ds) {
      const commands = d.match(/[A-Za-z]/g) || [];
      for (const c of commands) expect('MLCZ'.includes(c), `unexpected path command "${c}" in d`).toBe(true);
    }
  });
});

describe('geometry determinism + source purity', () => {
  it('same placement -> byte-identical geometry (JSON)', () => {
    expect(JSON.stringify(buildGothicWindow(PLACE))).toBe(JSON.stringify(buildGothicWindow(PLACE)));
  });

  it('no arch/ source file calls a transcendental (Math.cos/sin/tan/pow/exp/log or **)', () => {
    for (const f of readdirSync(ARCH_DIR)) {
      if (!f.endsWith('.js')) continue;
      const src = readFileSync(join(ARCH_DIR, f), 'utf8');
      // strip block + line comments so the doc prose (which names these) does not trip the scan
      const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
      expect(code, `${f} calls Math.cos/sin/tan`).not.toMatch(/Math\s*\.\s*(cos|sin|tan|acos|asin|atan|atan2)\b/);
      expect(code, `${f} calls Math.pow/exp/log`).not.toMatch(/Math\s*\.\s*(pow|exp|log|cbrt|hypot|sinh|cosh|tanh)\b/);
      expect(code, `${f} uses the ** operator`).not.toMatch(/\*\*/);
    }
  });
});
