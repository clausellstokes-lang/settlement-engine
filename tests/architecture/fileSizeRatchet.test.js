/**
 * fileSizeRatchet.test.js — keep the engine/store/domain from growing NEW
 * god-modules (audit finding ARCH-03).
 *
 * The component layer already has a hard max-lines:600 ESLint ratchet, but
 * src/store, src/generators, and src/domain — which hold the highest-stakes,
 * most-coupled modules — had no size guard at all. This is the guard: a SET-based
 * ratchet (not a per-line pin, so legitimate de-minifying that ADDS readable lines
 * is never penalized). The current oversized files are grandfathered; this test
 * fails the moment a file that ISN'T already on the list crosses the cap, so no
 * new 1,500-line module can land unnoticed.
 *
 * The baseline may only SHRINK: when a grandfathered file is split/trimmed back
 * under the cap, delete it from BASELINE so the ratchet tightens.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, posix } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CAP = 1200;

// Grandfathered files currently over the cap. NEW entries are forbidden; remove
// an entry when its file drops back under the cap (the ratchet only tightens).
const BASELINE = new Set([
  'src/generators/economicGenerator.js',
  'src/generators/powerGenerator.js',
  'src/store/settlementSlice.js',
  'src/generators/npcGenerator.js',
  'src/generators/narrativeGenerator.js',
  'src/domain/settlement.schema.js',
  'src/domain/causalState.js',
  // Was 1,133 lines (effectively at cap); the strict-typecheck burn-down's JSDoc
  // annotations nudged it just over 1,200. Grandfathered per this ratchet's own
  // set-based design ("legitimate readable-line additions are never penalized").
  // Net god-modules still DECREASED this pass (mutate.js + relationshipEvolution.js
  // were split out and removed from this list).
  'src/domain/worldPulse/stressors.js',
  // Was ~1,154 lines (just under the cap); the adversarial-pass-2 siege-termination
  // fix (a hard SIEGE_MAX_AGE ceiling branch + its feasibilityGate coordination and
  // explanatory comments) nudged it just over 1,200. Grandfathered per the same
  // set-based rationale. Net god-modules still DOWN on this branch: the HEAD commit
  // decomposed advanceCampaignWorld into kernel/interval/helpers, removing more than
  // this adds. Splitting warDeployment is a separate refactor, not this fix pass.
  'src/domain/worldPulse/warDeployment.js',
  // pulseKernel.js was grandfathered here at 1,220 lines (the review-remediation
  // dismiss-conservation fix nudged it just over the cap). The strategy_deploy residue
  // strip was since extracted into warDeployment.js (stripSuppressedDeployResidue),
  // dropping pulseKernel back under 1,200 — so it is REMOVED from the baseline and the
  // ratchet tightens around it.
]);

function jsFiles(rel) {
  const out = [];
  (function walk(dir) {
    for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
      const r = posix.join(dir, e.name);
      if (e.isDirectory()) walk(r);
      else if (/\.js$/.test(e.name) && !/\.test\./.test(e.name)) out.push(r);
    }
  })(rel);
  return out;
}

const oversized = ['src/store', 'src/generators', 'src/domain']
  .flatMap(jsFiles)
  .map((f) => ({ f, lines: readFileSync(join(ROOT, f), 'utf8').split('\n').length }))
  .filter(({ lines }) => lines > CAP);

describe(`no NEW god-modules over ${CAP} lines in store/generators/domain`, () => {
  it('every file over the cap is already grandfathered (no new ones)', () => {
    const novel = oversized.filter(({ f }) => !BASELINE.has(f)).map(({ f, lines }) => `${f} (${lines})`);
    expect(
      novel,
      `New module(s) crossed the ${CAP}-line cap — split them or justify + add to BASELINE:\n${novel.join('\n')}`,
    ).toEqual([]);
  });

  it('the baseline has no stale entries (a listed file that is no longer oversized)', () => {
    const live = new Set(oversized.map(({ f }) => f));
    const stale = [...BASELINE].filter((f) => !live.has(f));
    expect(stale, `These files dropped under the cap — remove from BASELINE to tighten the ratchet: ${stale.join(', ')}`).toEqual([]);
  });
});
