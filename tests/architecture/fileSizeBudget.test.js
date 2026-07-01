import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, test, expect } from 'vitest';

/**
 * File-size ratchet (review P4 — the megafile maintainability tax).
 *
 * The register's remedy for the megafiles is "extract a clean perimeter WHEN a file
 * starts churning; do NOT split the tangled core preemptively." That discipline was
 * only prose. This enforces it: every src logic file has a line ceiling. New/small
 * files share a general cap (so a NEW megafile can't appear); the existing large
 * files are grandfathered at their current size (so they can't GROW). Hitting a
 * ceiling means EXTRACT a cohesive module rather than growing the file — or, if the
 * growth is genuinely cohesive, bump that file's entry here CONSCIOUSLY (visible in
 * the diff), exactly like the bundle-budget and raw-button baselines.
 *
 * This caps the megafile problem and nudges organic decomposition without the
 * speculative churn (and regression risk) of splitting stable, golden-guarded code.
 */

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(REPO, 'src');

// General cap for any file not grandfathered below.
const GENERAL_CAP = 1200;

// Grandfathered ceilings for the files already over the cap (current LOC + a small
// buffer). SHRINK these over time; never raise one without a deliberate reason.
const GRANDFATHERED = {
  'src/generators/powerGenerator.js': 2870,
  'src/generators/economicGenerator.js': 2870,
  'src/store/settlementSlice.js': 2460,
  'src/generators/npcGenerator.js': 1700,
  'src/domain/settlement.schema.js': 1690,
  'src/pdf/lib/viewModel.js': 1330,
  'src/domain/worldPulse/warDeployment.js': 1290,
  'src/generators/narrativeGenerator.js': 1260,
  'src/domain/causalState.js': 1260,
  'src/domain/worldPulse/stressors.js': 1240,
};

// src logic tree only — data/ (hand-authored content, the moat) is exempt.
function logicFiles(dir = SRC, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    const rel = abs.slice(REPO.length + 1).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      if (rel === 'src/data') continue;
      logicFiles(abs, acc);
    } else if (/\.(js|jsx)$/.test(entry.name)) {
      acc.push(rel);
    }
  }
  return acc;
}

const FILES = logicFiles();

describe('file-size ratchet — megafiles cannot grow, no new megafiles (P4)', () => {
  test('the ratchet actually sees the source tree (not vacuous)', () => {
    expect(FILES.length).toBeGreaterThan(400);
  });

  test('every grandfathered file still exists (a rename must update this list)', () => {
    for (const f of Object.keys(GRANDFATHERED)) {
      expect(FILES, `grandfathered "${f}" is missing — update GRANDFATHERED`).toContain(f);
    }
  });

  test.each(FILES)('%s is within its line ceiling', (f) => {
    const ceiling = GRANDFATHERED[f] ?? GENERAL_CAP;
    const loc = readFileSync(join(REPO, f), 'utf8').split('\n').length;
    expect(
      loc,
      `${f} is ${loc} lines (ceiling ${ceiling}). Extract a cohesive module rather than growing it, ` +
        `or bump its ceiling in tests/architecture/fileSizeBudget.test.js if the growth is genuinely cohesive.`,
    ).toBeLessThanOrEqual(ceiling);
  });
});
