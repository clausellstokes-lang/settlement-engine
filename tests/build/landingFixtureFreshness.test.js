/**
 * tests/build/landingFixtureFreshness.test.js — THE LANDING'S FACTS ARE THE
 * ENGINE'S FACTS, OR THIS IS RED.
 *
 * ── WHAT THIS EXISTS FOR (ODQ §934.30 car 1, owner order 2026-09-19) ─────────
 * src/components/home/landingFixture.js is frozen real engine output: the town,
 * its arrival prose, its pressure sentence, its hooks, the RAW trace receipts,
 * the band crossings, the town's own advance events. The landing page's entire
 * claim is that none of it was written by hand. The module's own docblock has
 * always said "REGEN POLICY: regenerate this fixture whenever engine generation
 * output changes", and there was NO INSTRUMENT behind that sentence.
 *
 * So the engine moved and the page did not. Measured at the tip on 2026-09-19,
 * a plain re-derivation at the committed seed differed in EIGHT places at once:
 * a new arrival scene, a new pressure sentence, a renamed faction ("The Free
 * Alliance" → "The Grey Council"), a different conflict (a council-seat
 * succession → market licensing), a re-worded trade-route roll, a re-worded
 * depletion cause, a different institution multiplier, and two config keys
 * DEFAULT_CONFIG had gained. The landing went on printing the old town's facts
 * under the shipped engine's version markers, and the whole suite was green:
 * the existing contract test (tests/ui/homeLanding.test.jsx) asserts the fixture
 * has a SHAPE, which a stale fixture has perfectly.
 *
 * ⛔ SO SHAPE IS NOT THE QUESTION HERE. This file re-runs the derivation and
 * diffs its BYTES against the committed module. A drift that a shape assertion
 * cannot see — a changed sentence, a renamed faction, a re-rolled receipt —
 * reds here and names the cure.
 *
 * ⚠ THE DERIVATION RUNS OUT OF TREE (the tests/build/brandDerivatives.test.js
 * idiom). `--emit --out <tmpfile>` writes nowhere near src/, so this file can
 * never leave a dirty worktree behind as its "fix" and can never race a suite
 * reading the committed module.
 *
 * ⚠ AND THE ONE FIELD A MACHINE CANNOT CHECK IS NAMED, NOT ASSERTED.
 * `voice.narrated` is owner-sanctioned STOCK prose grounded in the receipts
 * beside it. A regen that changes the receipts leaves that prose STALE while
 * these arms stay green, because the bytes agree — the emitter holds the prose.
 * That is why the failure message below says "re-ground", not "re-run".
 */
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { committedProvenance, MODULE_PATH } from '../../scripts/generate-landing-fixture.mjs';
import { fixture } from '../../src/components/home/landingFixture.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = join(ROOT, 'scripts', 'generate-landing-fixture.mjs');

/** One derivation is a full 5-settlement generation + 12 world pulses. */
const RUN_MS = 180_000;

/** Run the emitter/checker, returning { status, stdout, stderr } without throwing. */
function run(args) {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { status: 0, stdout, stderr: '' };
  } catch (e) {
    return { status: e.status ?? 1, stdout: String(e.stdout || ''), stderr: String(e.stderr || '') };
  }
}

describe('the landing fixture is the engine at the committed seed', () => {
  it('the committed module carries readable provenance (anti-vacuity for the arms below)', () => {
    // ⛔ Without this, a module whose seed/weeks could not be parsed would make
    // `--check` exit 1 for a reason that has nothing to do with staleness, and
    // the byte arm below would be diffing against a run at the WRONG seed. Both
    // downstream arms read their inputs from here.
    const provenance = committedProvenance();
    expect(provenance, `no seed/weeks/settType could be read out of ${MODULE_PATH}`).toBeTruthy();
    expect(provenance.seed).toBe(fixture.seed);
    expect(provenance.weeks).toBe(fixture.weeks);
    expect(provenance.settType).toBe(fixture.forge.config.settType);
  });

  it('a fresh derivation reproduces the committed module BYTE FOR BYTE', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sf-landing-fixture-'));
    const out = join(dir, 'landingFixture.js');
    try {
      const emit = run(['--seed', fixture.seed, '--emit', '--out', out]);
      expect(emit.status, `the emitter failed:\n${emit.stderr}`).toBe(0);
      const fresh = readFileSync(out, 'utf8');
      const committed = readFileSync(MODULE_PATH, 'utf8');
      expect(
        fresh === committed,
        'THE LANDING PAGE IS SHOWING A TOWN THE ENGINE NO LONGER GENERATES.\n'
        + `  A fresh run of scripts/generate-landing-fixture.mjs at seed ${fixture.seed} does not\n`
        + `  match the committed ${MODULE_PATH.replace(ROOT + '/', '')}.\n`
        + '  Re-emit it, and then RE-GROUND the stock narration (voice.narrated lives in the\n'
        + '  emitter as STOCK_NARRATION and is grounded in voice.receipts — a regen that moves\n'
        + '  a receipt leaves that prose asserting facts the engine no longer derives):\n'
        + `    node scripts/generate-landing-fixture.mjs --seed ${fixture.seed} --emit\n`,
      ).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, RUN_MS);

  it("the script's own --check arm agrees, and is wired to say how to fix it", () => {
    // The arm above is the measurement; this one is the AFFORDANCE — the command
    // a human (or CI) runs, exercised so it cannot rot into a flag that exits 0
    // whatever it finds. It reads the seed off the module itself, so it needs no
    // arguments and cannot be pointed at the wrong run.
    const checked = run(['--check']);
    expect(checked.status, `--check reported the fixture stale:\n${checked.stdout}${checked.stderr}`).toBe(0);
    expect(checked.stdout).toMatch(/check OK/);
    expect(checked.stdout, 'the check does not name the seed it verified').toContain(fixture.seed);
  }, RUN_MS);
});
