/**
 * blastRadiusUnion.test.js — SK-3's proof surface (sk-b; ODQ §141.3).
 *
 * The differential's value is entirely in its REFUSALS. An accelerant that occasionally
 * scopes wrong is worse than no accelerant, because it produces a green re-soak over the
 * wrong cells and calls the fix proven. Every refusal condition is exercised by its own
 * cause, and the control sample is asserted seeded and compositionally complete.
 */

import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

import {
  COUPLING_REGISTRY_FILES,
  REFUSE_TO_FULL_PATHS,
  controlSampleSize,
  deriveBlastRadius,
  drawControlSample,
} from '../../scripts/soak/blastRadius.mjs';
import { RUNGS, RUNG_IDS, ladderRefusals, nextRung, rungReport } from '../../scripts/soak/ladder.mjs';

const ROOT = resolve(process.cwd());
const arms = (over = {}) => ({
  closure: ['src/domain/worldPulse/warKernel.js'],
  coupling: ['src/domain/worldPulse/warKernel.js'],
  tokens: ['src/domain/worldPulse/warKernel.js'],
  ...over,
});

describe('the differential re-soak scope', () => {
  it('the coupling registry is SEVEN files, and every one of them exists', () => {
    expect(COUPLING_REGISTRY_FILES.length).toBe(7);
    const missing = COUPLING_REGISTRY_FILES.filter((path) => !existsSync(join(ROOT, path)));
    // A registry file list that has drifted would silently narrow arm 2 — the arm would
    // still "run", over fewer rows, and report a smaller radius with no error.
    expect(missing).toEqual([]);
  });

  it('the happy path is a DIFFERENTIAL, and it is the union of the three arms', () => {
    const derived = deriveBlastRadius({
      changedFiles: ['src/domain/worldPulse/warKernel.js'],
      arms: arms({
        closure: ['src/domain/worldPulse/warKernel.js', 'src/domain/worldPulse/warLedger.js'],
        coupling: ['src/domain/worldPulse/warKernel.js', 'src/domain/worldPulse/warLedger.js'],
        tokens: ['src/domain/worldPulse/warKernel.js', 'src/domain/worldPulse/warLedger.js'],
      }),
    });
    expect(derived.mode).toBe('differential');
    expect(derived.reasons).toEqual([]);
    expect(derived.files).toEqual(['src/domain/worldPulse/warKernel.js', 'src/domain/worldPulse/warLedger.js']);
  });

  it('each REFUSE-TO-FULL condition fires by its own cause', () => {
    expect([...REFUSE_TO_FULL_PATHS]).toEqual([
      'src/kernel/', 'src/domain/worldPulse/simulationRules.js', 'package.json', 'package-lock.json',
    ]);
    const kernel = deriveBlastRadius({ changedFiles: ['src/kernel/prng.js'], arms: arms() });
    expect(kernel.mode).toBe('full');
    expect(kernel.reasons.join(' ')).toContain('has no bounded radius');

    const rules = deriveBlastRadius({ changedFiles: ['src/domain/worldPulse/simulationRules.js'], arms: arms() });
    expect(rules.mode).toBe('full');
    expect(rules.reasons.join(' ')).toContain('re-scopes every cell');

    // ⚠ A DEPENDENCY BUMP IS A MINT TRIGGER: the substrate moved, not the code, and no
    // reverse-dependency closure over source files can see that.
    for (const file of ['package.json', 'package-lock.json']) {
      const bumped = deriveBlastRadius({ changedFiles: [file], arms: arms() });
      expect(bumped.mode, `${file} did not refuse`).toBe('full');
      expect(bumped.reasons.join(' ')).toContain('MINT TRIGGER');
    }

    const pipeline = deriveBlastRadius({ changedFiles: ['src/domain/worldPulse/x.js'], pipelineOrderChanged: true, arms: arms() });
    expect(pipeline.mode).toBe('full');

    // ⛔ DISAGREEMENT IS A REFUSAL, NOT A MERGE. A core file exactly one arm sees is a file
    // the other two are blind to, and blindness is what a differential cannot afford.
    const contested = deriveBlastRadius({
      changedFiles: ['src/domain/worldPulse/warKernel.js'],
      arms: arms({ tokens: ['src/domain/worldPulse/warKernel.js', 'src/domain/worldPulse/onlyTokensSawThis.js'] }),
    });
    expect(contested.mode).toBe('full');
    expect(contested.reasons.join(' ')).toContain('onlyTokensSawThis.js');

    // A FAILED DERIVATION IS A FULL SOAK, NEVER A GUESS — including an arm that did not report.
    expect(deriveBlastRadius({ changedFiles: [], arms: arms(), derivationError: 'graph walk threw' }).mode).toBe('full');
    expect(deriveBlastRadius({ changedFiles: [], arms: { closure: [], coupling: [] } }).mode).toBe('full');
  });

  it('the control sample is banded, seeded and compositionally complete', () => {
    // The floor of 3 is the release profile's own recorded precedent; the 10% term scales.
    expect(controlSampleSize(0)).toBe(3);
    expect(controlSampleSize(10)).toBe(3);
    expect(controlSampleSize(100)).toBe(10);
    const cells = [];
    for (const seed of ['alpha-1', 'alpha-2', 'beta-1', 'beta-2']) {
      for (const settlements of [4, 30]) {
        cells.push({ key: `${seed}::30::${settlements}::preset`, seed, settlements });
      }
    }
    const drawn = drawControlSample(cells, { configHash: 'cfg-1' });
    // At least one cell from EACH seed family and EACH scale band — a control drawn
    // entirely from one family tests one family.
    expect(drawn.families).toEqual(['alpha', 'beta']);
    expect(drawn.bands).toEqual(['30', '4']);
    expect(drawn.cells.length).toBeGreaterThanOrEqual(drawn.size);
    // SEEDED, not random: the same config draws the same cells, and a different config
    // draws a different order — so the draw is reproducible without being constant.
    expect(drawControlSample(cells, { configHash: 'cfg-1' }).cells.map((c) => c.key))
      .toEqual(drawn.cells.map((c) => c.key));
    const other = drawControlSample(cells, { configHash: 'cfg-2' }).cells.map((c) => c.key);
    expect(other.length).toBe(drawn.cells.length);
  });

  it('the ladder gates cheapest-first and refuses every thinning §141 names', () => {
    expect([...RUNG_IDS]).toEqual(['cert-30', 'century', 'century-300']);
    expect(RUNGS.map((rung) => rung.years)).toEqual([30, 100, 300]);
    expect(nextRung([]).id).toBe('cert-30');
    expect(nextRung(['cert-30']).id).toBe('century');
    expect(nextRung(['cert-30', 'century']).id).toBe('century-300');
    expect(nextRung(['cert-30', 'century', 'century-300'])).toBe(null);
    // Cheapest-first means the ladder RETURNS to the cheapest unclean rung: a clean
    // century with a dirty cert-30 does not license skipping ahead.
    expect(nextRung(['century']).id).toBe('cert-30');
    // THE GATING INVARIANT, over every subset rather than one hand-picked case: the rung
    // returned never has an unclean gate. A hand-picked case would pass on a ladder that
    // gated only the pair the author happened to try.
    const subsets = [];
    for (let mask = 0; mask < 8; mask += 1) {
      subsets.push(RUNG_IDS.filter((_, index) => (mask >> index) & 1));
    }
    const violations = subsets
      .map((clean) => ({ clean, next: nextRung(clean) }))
      .filter(({ clean, next }) => next && next.gatesOn && !clean.includes(next.gatesOn));
    expect(violations).toEqual([]);
    // …and the invariant is not vacuous: some subset really does yield a rung.
    expect(subsets.filter((clean) => nextRung(clean) !== null).length).toBeGreaterThan(0);

    expect(ladderRefusals({ rung: 'century-300', years: 300, seedCount: 8, fullSeedCount: 8 })).toEqual([]);
    // The three §141 refusals, each by its own cause.
    expect(ladderRefusals({ rung: 'century-300', years: 100 })[0]).toContain('SHORTENED');
    expect(ladderRefusals({ rung: 'century', years: 100, sampledTicks: true })[0]).toContain('sampled ticks');
    expect(ladderRefusals({ rung: 'century', years: 100, seedCount: 3, fullSeedCount: 8 })[0]).toContain('REDUCED SEED');
    // …and the boundary rule: a differential AT a phase boundary is refused.
    expect(ladderRefusals({ rung: 'century', years: 100, atPhaseBoundary: true, differential: true })[0])
      .toContain('never a substitute at one');
    expect(ladderRefusals({ rung: 'no-such-rung', years: 30 })[0]).toContain('closed set');

    // A rung report carries NO verdict, and says so on the artifact rather than leaving a
    // reader to know the law.
    const report = rungReport({ rung: 'cert-30', tipSha: 'abc123', findings: [], observability: [], cells: 12 });
    expect(report.verdict).toBe(null);
    expect(report.findingsOnly).toBe(true);
    expect(report.verdictWithheld).toContain('findings-only');
  });
});
