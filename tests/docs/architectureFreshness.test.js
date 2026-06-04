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
