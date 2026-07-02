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
 *
 * MONOTONIC SHRINK: a static ceiling only stops GROWTH — as a file shrinks, its
 * ceiling drifts stale-high and the ratchet slowly loses its teeth (the "parked, not
 * paid" failure mode). So the ceilings are re-baselined tight (current LOC + a small
 * buffer) AND a slack guard fails the gate if any ceiling floats more than MAX_SLACK
 * above its file's real size — forcing the ceiling DOWN whenever the file shrinks, so
 * every reclaimed line is locked in and the debt can only decrease.
 */

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(REPO, 'src');

// General cap for any file not grandfathered below.
const GENERAL_CAP = 1200;

// How far a grandfathered ceiling may float above its file's real size before the
// slack guard demands a re-baseline. Small enough that a shrink ratchets the ceiling
// down (locking in the gain), loose enough not to flake on ordinary edits.
const MAX_SLACK = 40;

// Grandfathered ceilings for the files already over the cap. Re-baselined 2026-07 to
// current LOC + ~20. SHRINK these as files shrink (the slack guard enforces it); never
// RAISE one without a deliberate, in-diff reason.
const GRANDFATHERED = {
  'src/generators/powerGenerator.js': 2857,
  'src/generators/economicGenerator.js': 2901, // + review-remediation: getUpgradeChain tier-connectivity + Stage 5/7 export re-seating
  'src/store/settlementSlice.js': 2446,
  'src/generators/npcGenerator.js': 1688,
  'src/domain/settlement.schema.js': 1677,
  'src/pdf/lib/viewModel.js': 1320,
  // NOTE: warDeployment.js is the war-economy hub and has grown across P1-F2; an extraction
  // of the pure support-edge readers + levy computation into a sibling module is overdue.
  'src/domain/worldPulse/warDeployment.js': 1686, // + review-remediation: war_exhaustion home-keying, vassal-direction levy, revertSuppressedDeployExhaustion
  'src/generators/narrativeGenerator.js': 1250,
  'src/domain/causalState.js': 1277, // + review-remediation: real-walls detection (no JSON.stringify regex) + occupation_lifted polarity
  // NOTE: pulseKernel.js crossed the cap with the war-economy dismiss-conservation fix (the
  // graduation blocker); the pure helper lives in warDeployment.js, but the strategy_deploy
  // dismiss handler's inline residue-strip + its invariant comments stay here. Extraction of
  // the dismiss handler into a sibling module is a followup.
  'src/domain/worldPulse/pulseKernel.js': 1239, // + review-remediation: strategy_deploy dismiss fully-conserving residue strip
  'src/domain/worldPulse/stressors.js': 1227,
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

  // Monotonic-shrink teeth: a grandfathered ceiling may not float far above its file's
  // real size. When a megafile shrinks (a real extraction, dead-code paydown), its
  // ceiling MUST be lowered to match — otherwise the ratchet quietly banks slack the
  // file can re-grow into for free, which is exactly the "parked, not paid" drift. This
  // turns every reclaimed line into a locked-in gain.
  test.each(Object.keys(GRANDFATHERED))('%s ceiling has not drifted stale-high above the file (re-baseline on shrink)', (f) => {
    const ceiling = GRANDFATHERED[f];
    const loc = readFileSync(join(REPO, f), 'utf8').split('\n').length;
    const slack = ceiling - loc;
    expect(
      slack,
      `${f} is ${loc} lines but its ceiling is ${ceiling} (${slack} slack > ${MAX_SLACK}). The file shrank — ` +
        `lower its ceiling toward ${loc} in tests/architecture/fileSizeBudget.test.js to lock in the reclaimed lines.`,
    ).toBeLessThanOrEqual(MAX_SLACK);
  });
});
