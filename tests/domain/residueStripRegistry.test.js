import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, test, expect } from 'vitest';

import { RESIDUE_STRIP_SITES } from '../../src/domain/worldPulse/pulseKernel.js';
import { GUARDED_RESIDUE_TYPES } from '../../src/domain/worldPulse/residueStripGuard.js';

// Machine enforcement for the residue-strip registry (L1). The pause/resume + dismiss
// byte-equivalence invariant depends on every residue-banking layer stripping its
// out-of-band residue for suppressed majors. That used to be a prose checklist in the
// kernel that could rot silently. Now:
//   1. each strip site carries an `@residue-strip: <id>` marker in the kernel, and
//   2. RESIDUE_STRIP_SITES is the machine-readable registry.
// This test fails the gate if the two drift apart (a new strip without a registry
// entry, a deleted strip, or a duplicate), and it makes coverage EXPLICIT: every site
// either names a pause/dismiss equivalence test that exercises it, or is an
// acknowledged, allowlisted coverage gap — so an uncovered strip is visible, not
// silently unverified (the exact failure mode the review flagged).

const here = dirname(fileURLToPath(import.meta.url));
const KERNEL = join(here, '../../src/domain/worldPulse/pulseKernel.js');
const kernelSrc = readFileSync(KERNEL, 'utf8');
const markers = [...kernelSrc.matchAll(/@residue-strip:\s*([a-z_]+)/g)].map((m) => m[1]);

// The ONE consciously-accepted coverage gap. Adding to this list is a deliberate
// acknowledgement (reviewed in the diff), not a silent omission. Shrink it, never grow
// it casually — a new residue site should ship WITH its equivalence test.
const KNOWN_COVERAGE_GAPS = new Set(['strategy_deploy']);

describe('residue-strip registry is machine-enforced against the kernel', () => {
  test('kernel @residue-strip markers exactly match RESIDUE_STRIP_SITES (code ↔ registry)', () => {
    const registryIds = RESIDUE_STRIP_SITES.map((s) => s.id).sort();
    expect([...new Set(markers)].sort()).toEqual(registryIds);
    // Exactly one marker per id — no duplicates, none missing.
    for (const id of registryIds) {
      expect(markers.filter((m) => m === id).length, `exactly one @residue-strip marker for "${id}"`).toBe(1);
    }
  });

  test('each site is either covered by a real equivalence test or an acknowledged gap', () => {
    for (const site of RESIDUE_STRIP_SITES) {
      if (site.coveredBy == null) {
        expect(
          KNOWN_COVERAGE_GAPS.has(site.id),
          `"${site.id}" has no coverage and is NOT an acknowledged gap — add a pause/dismiss equivalence test, or add it to KNOWN_COVERAGE_GAPS deliberately`,
        ).toBe(true);
        continue;
      }
      const testPath = join(here, site.coveredBy);
      expect(existsSync(testPath), `coverage test "${site.coveredBy}" for "${site.id}" must exist`).toBe(true);
      const testSrc = readFileSync(testPath, 'utf8');
      expect(testSrc.includes(site.id), `"${site.coveredBy}" must exercise "${site.id}"`).toBe(true);
    }
  });

  test('every registry site has a pause-path residue guard check (registry ↔ guard)', () => {
    // residueStripGuard's self-check must cover every registered residue site, so a NEW
    // residue-banking layer can't be registered + stripped yet leave the runtime guard
    // blind to it. Adding a site therefore forces a guard check too.
    const guarded = new Set(GUARDED_RESIDUE_TYPES);
    for (const site of RESIDUE_STRIP_SITES) {
      expect(guarded.has(site.id), `residueStripGuard must check "${site.id}" (add it to GUARDED_RESIDUE_TYPES + residueCheckers)`).toBe(true);
    }
  });

  test('registry entries are well-formed', () => {
    for (const site of RESIDUE_STRIP_SITES) {
      expect(typeof site.id).toBe('string');
      expect(site.banks.length, `${site.id} must describe what it banks`).toBeGreaterThan(0);
    }
  });
});
