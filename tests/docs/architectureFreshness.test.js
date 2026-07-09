/**
 * Lightweight freshness guard for ARCHITECTURE.md.
 *
 * The doc is the cheapest onboarding artifact in the repo, so it's also the
 * easiest to let rot. This doesn't try to verify every claim — it pins a couple
 * of facts that have already drifted (or easily could), so the same drift can't
 * silently come back.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (rel) => readFileSync(resolve(here, rel), 'utf8');
const archMd = read('../../ARCHITECTURE.md');

describe('ARCHITECTURE.md freshness', () => {
  it('does not reference nav constants that no longer exist in App.jsx', () => {
    // NAV_BASE / NAV_WITH_WORKSHOP were collapsed into a single NAV array when
    // Workshop became the Create "Custom Generate" mode. If the doc mentions
    // them again, it has drifted from App.jsx.
    expect(archMd).not.toMatch(/NAV_BASE|NAV_WITH_WORKSHOP/);
  });

  it('states the same store-slice count that store/index.js composes', () => {
    const storeIdx = read('../../src/store/index.js');
    const sliceCount = [...storeIdx.matchAll(/\.\.\.create\w+Slice\(/g)].length;
    const claim = archMd.match(/(\d+)\s+slices/);
    expect(claim, 'ARCHITECTURE.md should state the store-slice count').toBeTruthy();
    expect(Number(claim[1])).toBe(sliceCount);
  });
});

describe('ARCHITECTURE.md facts derive from the filesystem (F33)', () => {
  // The doc understated its own suite by half and described a 14-step pipeline
  // while 19 steps were registered — number drift is the exact rot class the
  // meta-pin (claim vocabulary) cannot see. These pins derive the numbers from
  // the artifacts themselves, so the doc can only be wrong loudly.

  it('lists the exact registered step order from steps/index.js', () => {
    const stepsIdx = read('../../src/generators/steps/index.js');
    const steps = [...stepsIdx.matchAll(/import '\.\/(\w+)\.js';/g)].map((m) => m[1]);
    expect(steps.length).toBeGreaterThan(0);
    // The doc claims the count…
    expect(archMd).toMatch(new RegExp(`${steps.length}-step pipeline`));
    // …and the Order list must name every registered step, in order.
    const orderBlock = archMd.match(/Order \(\d+ steps\): `([^`]+)`/);
    expect(orderBlock, 'ARCHITECTURE.md must carry the Order list').toBeTruthy();
    const docSteps = orderBlock[1].split('→').map((s) => s.trim());
    expect(docSteps).toEqual(steps);
  });

  it('states the real migration count', () => {
    const { readdirSync } = require('node:fs');
    const n = readdirSync(resolve(here, '../../supabase/migrations')).filter((f) => f.endsWith('.sql')).length;
    const claim = archMd.match(/\*\*migrations\/\*\* \((\d+)\)/);
    expect(claim, 'ARCHITECTURE.md should state the migration count').toBeTruthy();
    expect(Number(claim[1])).toBe(n);
  });

  it('does not understate the test suite by more than drift tolerance', () => {
    const { readdirSync, statSync } = require('node:fs');
    const walk = (d, out = []) => {
      for (const e of readdirSync(d)) {
        const p = resolve(d, e);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.test\.(js|jsx)$/.test(e)) out.push(p);
      }
      return out;
    };
    const files = walk(resolve(here, '../..', 'tests')).length;
    const claim = archMd.match(/~([\d,]+) tests \/ ~(\d+) files/);
    expect(claim, 'ARCHITECTURE.md should state suite size').toBeTruthy();
    // Approximate claims are fine; a 25% understatement (the drift that
    // actually shipped: "~159 files" vs 359 real) is not.
    expect(Number(claim[2])).toBeGreaterThan(files * 0.75);
    expect(Number(claim[2])).toBeLessThan(files * 1.25);
  });
});
