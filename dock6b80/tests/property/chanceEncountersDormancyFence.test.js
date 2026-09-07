/**
 * chanceEncountersDormancyFence.test.js — ENC-3's dormancy fences.
 *
 * ⛔⛔ WHY THIS FILE EXISTS AT ALL, AND IT IS THE CITATION LAW'S MOST SERIOUS SIGHTING.
 * `src/domain/certification/subsystemRowsEncounters.js` shipped with SIX invariants whose
 * `check:` strings cited "FENCE 1", "FENCE 2", "FENCE 3" and "FENCE 4" in a file at this
 * path — and THIS PATH DID NOT EXIST. The row asserting THE PROMISE (a dark world advances
 * byte-identically) named, as its enforcement, an instrument nobody had written. Two headers
 * carried `@enforced-by` tags pointing here as well, and `tests/docs/enforcedByExists.test.js`
 * convicted all three targets. A 759-line stage that mutates four ledgers shipped with zero
 * tests of its own while reading as fully pinned. The row is now true because the fences are
 * here, not because the prose was softened.
 *
 * ── ⚠ NO BARE NEGATIVES. This file is NEW **and** generation-facing (`tests/property/**`),
 * so `negativeAssertionAnchor.walker` holds it at a HARD ceiling of zero un-anchored sites
 * with no frozen row legally available to it. None of the three scanned matchers
 * (`not.toContain`, `not.toMatch`, `not.toHaveProperty`) appears here at all: every claim
 * below is an equality, an inequality or a count.
 *
 * ── ⭐⭐ THE VACUOUS-GREEN CLASS, AND HOW EACH FENCE ESCAPES IT ───────────────────────────
 * "Nothing happened in a world where nothing was going to happen" is the green every
 * dormancy pin drifts toward. So the run these fences hash is a run that REALLY MOVES: it
 * mints a real errand through the production writer (`mintEnvoyErrand`, via the shared
 * `errandSpineFixture`) and advances the real `advanceEnvoyDiplomacyPulse` ten times. That
 * run produces THREE distinct world hashes, and that count is asserted below — so if the
 * fixture ever goes inert the fences fail loudly instead of passing vacuously.
 *
 *   FENCE 1 — BYTE-IDENTITY AGAINST HASHES MEASURED AT THE PARENT COMMIT, NEVER A SAME-TREE
 *     CALL COMPARING THE FEATURE TO ITSELF (the ES-1-R4 repair). The ten hashes below were
 *     measured by running the pulse from a `git archive` of `6c49ecbbf` — the commit BEFORE
 *     the ENC-3 stage existed — in an isolated tree. A fence that compared this tree's dark
 *     run with this tree's dark run would stay green if the stage had been wired to run in
 *     every world; these hashes were produced by code that had no stage to run.
 *
 *   FENCE 2 — EVERY NON-`true` SPELLING IS DARK. Absent, explicit `false`, and the four
 *     truthy-but-not-true spellings (`1`, `'true'`, `{}`, `'yes'`) all reproduce FENCE 1's
 *     hashes exactly, and the gate read itself is exercised on each. Paired with the POSITIVE
 *     control that `true` alone activates, so the fence cannot pass by refusing everything.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. A state pin cannot see a feature that ran and happened to
 *     write nothing; a strict pass-through spy can. The spy sits on `envoyChanceMeeting.js`,
 *     and THE DIRECTION IS LOAD-BEARING: the recorded WR-10 lesson is that wrapping a
 *     function in ITS OWN module's namespace counts zero, because the internal binding is the
 *     original. The STAGE imports `resolveChanceMeeting` from the leaf, so mocking the leaf's
 *     module really does intercept. Dark ⇒ the resolver is called ZERO times.
 *
 *   FENCE 4 — GATE-POLARITY CENSUS over the real source tree, through the shared `codeOnly`
 *     strip so a name written in a comment or a receipt string is never miscounted as a use.
 *     Exactly ONE site reads the key, and it reads it strictly against `true`.
 *
 * @enforced-by tests/property/chanceEncountersDormancyFence.test.js
 */
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';

import { codeOnly } from '../helpers/codeOnlySource.js';
import { mintOne, spineWorld } from '../helpers/errandSpineFixture.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(REPO_ROOT, 'src');
const FLAG = 'chanceEncountersEnabled';

/**
 * ⭐ THE PARENT-COMMIT HASHES. Measured at `6c49ecbbf` (the §893 tip, the commit immediately
 * before the ENC-3 stage landed) by extracting that tree with `git archive` and running its
 * own `advanceEnvoyDiplomacyPulse` over the fixture built below. Ten ticks, sha256 over
 * `JSON.stringify(worldState)`, first sixteen hex digits.
 *
 * ⛔ THESE ARE NOT RE-RECORDABLE BY A LANE. If they move, the dark path stopped being dark
 * and that is the finding — never a reason to re-measure them against the tree that broke
 * them. Re-deriving them requires the parent tree, deliberately.
 */
const PARENT_DARK_HASHES = Object.freeze([
  '4566c86da28f90c6',
  '98efa7c906fe0ae1',
  'c6d37517dc9122c8',
  'c6d37517dc9122c8',
  'c6d37517dc9122c8',
  'c6d37517dc9122c8',
  'c6d37517dc9122c8',
  'c6d37517dc9122c8',
  'c6d37517dc9122c8',
  'c6d37517dc9122c8',
]);
const PARENT_SHA = '6c49ecbbf';

/**
 * ⛔ THE HASH COVERS WHAT THE PULSE WROTE, NOT WHAT THE CALLER DECLARED, and that
 * distinction cost this fence its first two runs. `simulationRules` is the INPUT: writing
 * `chanceEncountersEnabled: false` into it changes `JSON.stringify(worldState)` by the mere
 * presence of the key, so a whole-world hash reported every explicit spelling as a
 * dormancy breach when nothing had run at all. Stripping the declaration leaves exactly the
 * question the fence is asking — did the stage WRITE anything — and keeps ABSENT and every
 * explicit spelling comparable on one number.
 * @param {Record<string, unknown>} world
 */
function hash(world) {
  const { simulationRules: _declared, ...written } = world || {};
  return createHash('sha256').update(JSON.stringify(written) ?? 'undefined').digest('hex').slice(0, 16);
}

/**
 * The run every state fence hashes: a REAL minted errand, then ten real pulses.
 * @param {{flag?: unknown, setFlag?: boolean}} [args]
 * @returns {{hashes: string[], world: Record<string, unknown>}}
 */
function darkRun({ flag, setFlag = false } = {}) {
  const base = spineWorld({ spine: true });
  if (setFlag) {
    base.simulationRules = { ...base.simulationRules, [FLAG]: flag };
  }
  const minted = mintOne(base);
  let world = /** @type {Record<string, unknown>} */ (minted.worldState);
  /** @type {string[]} */
  const hashes = [];
  for (let tick = 10; tick < 20; tick += 1) {
    const out = advancePulse(world, tick);
    world = out;
    hashes.push(hash(world));
  }
  return { hashes, world };
}

/** @param {Record<string, unknown>} world @param {number} tick */
function advancePulse(world, tick) {
  const out = PULSE.advanceEnvoyDiplomacyPulse({
    worldState: world,
    snapshot: { settlements: [] },
    regionalGraph: null,
    settlementUpdates: [],
    tick,
    now: `w${tick}`,
    simulationRules: world.simulationRules,
  });
  return /** @type {Record<string, unknown>} */ (out && out.worldState ? out.worldState : world);
}

/** @param {string} dir @param {string[]} [acc] @returns {string[]} */
function jsFilesUnder(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) jsFilesUnder(full, acc);
    else if (/\.(js|jsx)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

const PULSE = await import('../../src/domain/worldPulse/envoyPulse.js');
const { chanceEncountersActive } = await import('../../src/domain/worldPulse/envoyChanceMeetingStage.js');

describe('ENC-3 FENCE 1 — the dark world is byte-identical to the PARENT COMMIT', () => {
  it('⭐ ten ticks of a REALLY-MOVING run reproduce the pre-stage hashes exactly', () => {
    const { hashes } = darkRun();
    // ANCHORED FIRST, so the identity below is a fact about a live run rather than about a
    // harness that quietly did nothing: the fixture really advances, and it advances into
    // more than one distinct world.
    expect(hashes).toHaveLength(10);
    expect(new Set(hashes).size).toBe(3);
    // and the run really is an ERRAND run — the thing a chance meeting would attach to
    const { world } = darkRun();
    expect(Array.isArray(world.envoyErrands)).toBe(true);
    expect(/** @type {unknown[]} */ (world.envoyErrands).length).toBeGreaterThan(0);
    // THE PROMISE, against hashes this tree cannot have produced
    expect(hashes).toEqual([...PARENT_DARK_HASHES]);
    expect(PARENT_SHA).toBe('6c49ecbbf');
  });

  it('the key really is absent by construction, so the identity is the INSTALLED-SAVE shape', () => {
    const base = spineWorld({ spine: true });
    const rules = /** @type {Record<string, unknown>} */ (base.simulationRules);
    // anchored by the positive: the rules object is real and populated, and the flag is not
    // one of its keys — an absence measured on a live object, not on an empty one.
    expect(Object.keys(rules).length).toBeGreaterThan(0);
    expect(Object.keys(rules).includes(FLAG)).toBe(false);
    expect(chanceEncountersActive(base)).toBe(false);
  });
});

describe('ENC-3 FENCE 2 — every spelling that is not `true` is DARK', () => {
  /** Absent is covered by FENCE 1; these are the refusals that could have gone loose. */
  const REFUSED = Object.freeze([
    ['explicit false', false],
    ['the number one', 1],
    ['the string "true"', 'true'],
    ['an empty object', {}],
    ['the string "yes"', 'yes'],
  ]);

  it('⭐ five non-`true` spellings each reproduce the parent hashes', () => {
    for (const [label, flag] of REFUSED) {
      const { hashes } = darkRun({ flag, setFlag: true });
      expect(hashes, label).toEqual([...PARENT_DARK_HASHES]);
    }
    // anchored: the table really was walked, so an empty table cannot report success
    expect(REFUSED.length).toBe(5);
  });

  it('and the GATE READ itself refuses each of them while accepting `true` — the polarity', () => {
    for (const [label, flag] of REFUSED) {
      expect(chanceEncountersActive({ simulationRules: { [FLAG]: flag } }), label).toBe(false);
    }
    // ⭐ THE POSITIVE CONTROL. Without this the fence would pass if the gate refused
    // everything, which is exactly how a dormancy pin outlives the feature it guards.
    expect(chanceEncountersActive({ simulationRules: { [FLAG]: true } })).toBe(true);
    // total on garbage, like every other gate read in this estate
    expect(chanceEncountersActive(null)).toBe(false);
    expect(chanceEncountersActive({})).toBe(false);
  });
});

describe('ENC-3 FENCE 3 — CALL-PATH dormancy: the resolver never executes dark', () => {
  it('⭐ resolveChanceMeeting is called ZERO times across a ten-tick dark run', async () => {
    vi.resetModules();
    const real = await import('../../src/domain/worldPulse/envoyChanceMeeting.js');
    const spy = vi.fn(real.resolveChanceMeeting);
    // ⚠ THE SPY SITS ON THE LEAF'S MODULE, NOT THE STAGE'S. The stage imports the resolver
    // FROM the leaf, so intercepting the leaf's export really does intercept the call; a
    // spy installed on the stage's own namespace would count zero for the WR-10 reason.
    vi.doMock('../../src/domain/worldPulse/envoyChanceMeeting.js', () => ({ ...real, resolveChanceMeeting: spy }));
    const pulse = await import('../../src/domain/worldPulse/envoyPulse.js');

    const minted = mintOne(spineWorld({ spine: true }));
    let world = /** @type {Record<string, unknown>} */ (minted.worldState);
    for (let tick = 10; tick < 20; tick += 1) {
      const out = pulse.advanceEnvoyDiplomacyPulse({
        worldState: world,
        snapshot: { settlements: [] },
        regionalGraph: null,
        settlementUpdates: [],
        tick,
        now: `w${tick}`,
        simulationRules: world.simulationRules,
      });
      world = /** @type {Record<string, unknown>} */ (out && out.worldState ? out.worldState : world);
    }
    // anchored: the run really happened and really advanced an errand, so a zero call count
    // is a fact about the GATE rather than about a pulse that never ran.
    expect(Array.isArray(world.envoyErrands)).toBe(true);
    expect(spy.mock.calls.length).toBe(0);
    vi.doUnmock('../../src/domain/worldPulse/envoyChanceMeeting.js');
    vi.resetModules();
  });
});

describe('ENC-3 FENCE 4 — the gate-polarity census', () => {
  it('⭐ exactly ONE site in src/ reads the key, and it reads it strictly against `true`', () => {
    const files = jsFilesUnder(SRC);
    // anchored: the tree really was walked
    expect(files.length).toBeGreaterThan(100);
    /** @type {string[]} */
    const readers = [];
    for (const file of files) {
      const code = codeOnly(readFileSync(file, 'utf8'));
      if (code.includes(FLAG)) readers.push(relative(REPO_ROOT, file));
    }
    // ⭐ ONE FILE, AND THE SECOND CANDIDATE'S ABSENCE IS THE STRIP DOING ITS JOB.
    // `simulationRules.js` carries the key in `ENGINE_GATED_VIRTUAL_RULE_KEYS` as a BARE
    // STRING LITERAL, and `codeOnly` blanks literal contents — so the roster NAMES the key
    // as data without READING it, and the census correctly does not count it. That is the
    // citation law from the measuring side: a name in a literal is not a use.
    expect(readers.sort()).toEqual(['src/domain/worldPulse/envoyChanceMeetingStage.js']);
    // anchored: the roster really does still name it, so the single reader above is a fact
    // about polarity rather than about a key that has been renamed out of the tree.
    const roster = readFileSync(join(SRC, 'domain/worldPulse/simulationRules.js'), 'utf8');
    expect(roster.includes(`'${FLAG}'`)).toBe(true);
    // THE POLARITY, quoted from the gate's own line: strict `=== true`, one site.
    const gate = codeOnly(readFileSync(join(SRC, 'domain/worldPulse/envoyChanceMeetingStage.js'), 'utf8'));
    const sites = gate.split(FLAG).length - 1;
    expect(sites).toBe(1);
    expect(gate.includes(`${FLAG} === true`)).toBe(true);
  });
});
