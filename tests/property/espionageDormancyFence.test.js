/**
 * espionageDormancyFence.test.js — ES-0's FOUR-FENCE dormancy set, its lit-mutant
 * control, and the per-door conjunction pins.
 *
 * ⚠ READ THIS FIRST, BECAUSE THIS FENCE SET IS SHAPED DIFFERENTLY FROM ITS SIBLINGS AND
 * THE DIFFERENCE IS DELIBERATE. Every other dormancy fence in this estate guards a
 * subsystem that RUNS and is gated. ES-0's subsystem does not run at all: it lands three
 * pure leaves, one shared-vocabulary mint and the gate that will govern them, and
 * NOTHING under src/ imports any of it. That is the WR-10 dark-instrument shape, and it
 * makes the usual fence-1 (drive the engine dark, compare the world to itself) a
 * VACUOUS pin — it would compare a world to itself through a code path that does not
 * exist, and would stay green if the whole layer were deleted.
 *
 * So fence 1 is restated at the level where the claim actually lives:
 *
 *   FENCE 1 — THE IMPORT-CLOSURE CENSUS (own-footprint). No production module under
 *     src/ imports the espionage set or the two shared leaves' espionage-facing use.
 *     For a subsystem with no caller this is STRICTLY STRONGER than a state pin: a
 *     state pin passes on a quiet fixture, while this fails the moment a caller exists
 *     — which is exactly the commit that owes a real fence-1. Its guard-the-guard is a
 *     positive control: the detector must FIND the imports that do exist (this file's,
 *     and the unit tests').
 *     ⚠ ITS LIMIT, STATED: it sees static `from '…'` specifiers only. A dynamic
 *     `await import()` would cross it unseen, exactly as it crosses the coupling
 *     inclusion ratchet's own scan. When ES-1 mounts a real caller, this fence is
 *     REPLACED by a driven byte-identity golden, not extended.
 *
 *   FENCE 2 — DIFFERENTIAL, ABSENT vs EXPLICIT FALSE, over the whole door matrix. No
 *     fixture, so it cannot rot. Its designed blind spot is that it stays green if the
 *     feature runs in BOTH configurations, which is why it is never shipped alone.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. A strict pass-through spy on the espionage module set
 *     counts real invocations. State pins cannot see a feature that ran and happened to
 *     write nothing; this can. The spy sits on the espionage modules themselves and the
 *     count is asserted ZERO after a real read of the gate — which is the honest claim
 *     at ES-0: the gate is the only thing anyone can call, and calling it calls nothing
 *     else. Its guard-the-guard drives the spied exports directly and requires the count
 *     to MOVE, so a mock that silently stopped intercepting reds here instead of
 *     certifying silence.
 *
 *   FENCE 4 — GATE-POLARITY CENSUS over the real source tree: every production read of
 *     `espionageEnabled` is the strict `=== true` form, so ABSENT and FALSE are
 *     identical BY CONSTRUCTION at decision sites no state pin reaches. It reuses the
 *     engine-gated-key walker's own comment/string blanker rather than a second regex,
 *     so a gate written in prose cannot be miscounted as a gate.
 *
 *   THE PER-DOOR CONJUNCTION PINS. `espionageActive` has THREE doors and each is dropped
 *     ALONE. This estate has twice shipped a guard that a second guard silently covered
 *     for — a guard that cannot be reddened cannot be proven — so no door here is
 *     allowed to rest on a neighbour.
 *
 *   THE LIT MUTANT. A flag that can never be lit is a dead flag wearing a dormancy
 *     fence's clothes, and every assertion above would pass over it. So the set closes
 *     by satisfying all three doors and requiring the gate to open — and by requiring
 *     fences 1, 3 and 4 to STAY GREEN with it open, which is the whole content of "dark
 *     by construction": lighting a flag nothing reads moves nothing.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../lint/engineGatedRuleKeys.walker.test.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = { doctrine: 0, catchRolls: 0 };

vi.mock('../../src/domain/worldPulse/espionage/espionageDoctrine.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    // STRICT pass-through: rest-args in, the original's result out. Instrumenting the
    // module cannot perturb a byte of the runs the other fences measure.
    readEspionageDoctrine: (...args) => { calls.doctrine += 1; return actual.readEspionageDoctrine(...args); },
  };
});

vi.mock('../../src/domain/worldPulse/espionage/espionageMath.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    catchChance01: (...args) => { calls.catchRolls += 1; return actual.catchChance01(...args); },
  };
});

const { espionageActive } = await import('../../src/domain/worldPulse/espionage/espionageGate.js');
const { readEspionageDoctrine } = await import('../../src/domain/worldPulse/espionage/espionageDoctrine.js');
const { catchChance01 } = await import('../../src/domain/worldPulse/espionage/espionageMath.js');
const { ENGINE_GATED_VIRTUAL_RULE_KEYS } = await import('../../src/domain/worldPulse/simulationRules.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'espionageEnabled';
/** The module set this wave landed, as import specifiers a scan can look for. */
const ESPIONAGE_SET = Object.freeze([
  'espionage/espionageGate.js',
  'espionage/espionageDoctrine.js',
  'espionage/espionageMath.js',
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));
const TEST_FILES = walk(join(ROOT, 'tests'))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));

/** Static `from '…'` specifiers, comments and strings NOT blanked (a specifier is a string). */
const IMPORT_RE = /(?:^|\n)\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/g;

/** Which files import any member of the espionage set. */
function importersOf(files) {
  const hits = [];
  for (const { rel, src } of files) {
    // The espionage modules import EACH OTHER's siblings legitimately; the census is
    // about consumers OUTSIDE the set.
    if (rel.includes('/espionage/')) continue;
    for (const match of src.matchAll(IMPORT_RE)) {
      if (ESPIONAGE_SET.some((member) => match[1].endsWith(member))) { hits.push(rel); break; }
    }
  }
  return hits.sort();
}

/**
 * A world whose three doors are individually controllable.
 *
 * ⚠ `OMIT` IS A SENTINEL AND NOT `undefined`, AND THAT IS LOAD-BEARING. A default
 * parameter fires on an explicitly-passed `undefined`, so `{ espionage: undefined }`
 * would silently mean "lit" — which is precisely the absent-vs-false distinction fence 2
 * exists to measure, inverted by the harness itself. Caught by this file's own fence 2
 * on its first run.
 */
const OMIT = Symbol('omitted from the rules object');
function world({ canon = 1, infoMode = 'unreliable', spine = true, espionage = true, extra = {} } = {}) {
  return {
    spatialCanonVersion: canon,
    simulationRules: {
      infoMode,
      ...(spine === OMIT ? {} : { errandSpineEnabled: spine }),
      ...(espionage === OMIT ? {} : { [FLAG]: espionage }),
      ...extra,
    },
  };
}

describe('FENCE 1 — the import-closure census (own-footprint, for a wave with no caller)', () => {
  test('NO production module imports the espionage set', () => {
    // anchored: the positive control below proves this detector finds real importers, so
    // the emptiness here is a measurement rather than a broken scan.
    expect(importersOf(SRC_FILES), 'the espionage layer gained a caller — this fence is now the wrong fence: replace it with a driven byte-identity golden in the commit that added the caller').toEqual([]);
  });

  test('guard the guard: the detector DOES find the importers that exist', () => {
    const testImporters = importersOf(TEST_FILES);
    expect(testImporters.length, 'the scan found nothing anywhere — it is broken, not clean').toBeGreaterThan(2);
    expect(testImporters).toContain('tests/domain/espionageMath.test.js');
    expect(testImporters).toContain('tests/domain/espionageDoctrine.test.js');
    // NOTE this file is NOT in that list, and the omission is correct: it reaches the
    // set through `vi.mock` + dynamic `await import`, which is exactly the blind spot
    // fence 1's header declares. Asserting its absence keeps the limit honest.
    // anchored: the two toContain assertions above prove this very list is populated
    // with real importers, so this absence measures the dynamic-import blind spot
    // rather than an empty scan.
    // anchored: the two toContain assertions above prove this list is populated.
    expect(testImporters).not.toContain(relative(ROOT, fileURLToPath(import.meta.url)).replace(/\\/g, '/'));
    // And the scan really is scoped to consumers OUTSIDE the set: the doctrine leaf
    // imports the shared vocabulary, and that is not a consumer edge.
    expect(SRC_FILES.some((f) => f.rel.includes('/espionage/')), 'the espionage set vanished').toBe(true);
  });
});

describe('FENCE 2 — absent and explicitly false are the same world', () => {
  test('over the whole door matrix, absent === false', () => {
    for (const canon of [0, 1]) {
      for (const infoMode of ['unreliable', 'omniscient']) {
        for (const spine of [OMIT, false, true]) {
          const absent = espionageActive(world({ canon, infoMode, spine, espionage: OMIT }));
          const explicitFalse = espionageActive(world({ canon, infoMode, spine, espionage: false }));
          expect(absent, `absent/false diverged at canon=${canon} infoMode=${infoMode} spine=${String(spine)}`)
            .toBe(explicitFalse);
          expect(absent).toBe(false);
        }
      }
    }
  });

  test('and every non-boolean truthy spelling is refused too', () => {
    // The dark-never-permissive law: `=== true`, not truthiness. A config that carried
    // the string "true" would otherwise light a subsystem the owner never enabled.
    for (const value of ['true', 1, {}, [], 'yes']) {
      expect(espionageActive(world({ espionage: /** @type {any} */ (value) }))).toBe(false);
    }
  });
});

describe('FENCE 3 — call-path dormancy', () => {
  test('reading the gate invokes NOTHING in the espionage set', () => {
    calls.doctrine = 0;
    calls.catchRolls = 0;
    for (let i = 0; i < 20; i += 1) {
      espionageActive(world({ espionage: i % 2 === 0 }));
      espionageActive(world({ espionage: OMIT }));
    }
    expect(calls.doctrine, 'the gate reached the doctrine leaf').toBe(0);
    expect(calls.catchRolls, 'the gate rolled a catch').toBe(0);
  });

  test('guard the guard: the spy MOVES when the exports are really called', () => {
    // Without this, a mock that silently stopped intercepting would certify silence.
    const before = calls.doctrine + calls.catchRolls;
    readEspionageDoctrine({ courtId: 'a', orderWord: 'lawful', natureWord: 'balanced' });
    catchChance01({ hostRung: 3 });
    expect(calls.doctrine + calls.catchRolls).toBe(before + 2);
  });
});

describe('FENCE 4 — gate-polarity census over the real source tree', () => {
  test('every production read of the flag is the strict === true form', () => {
    const strict = new RegExp(String.raw`\b(?:rules|simulationRules)\s*\)?\s*\??\.\s*${FLAG}\s*===\s*true`);
    const anyRead = new RegExp(String.raw`\.\s*${FLAG}\b`);
    const offenders = [];
    let strictReads = 0;
    for (const { rel, src } of SRC_FILES) {
      const code = codeOnly(src);
      if (!anyRead.test(code)) continue;
      for (const line of code.split('\n')) {
        if (!anyRead.test(line)) continue;
        if (strict.test(line)) { strictReads += 1; continue; }
        offenders.push(`${rel}: ${line.trim()}`);
      }
    }
    // Guard the guard, both directions: the census must have found a real read (an empty
    // scan would make the absence of offenders meaningless) and no loose one.
    expect(strictReads, 'the flag has no production gate read at all — the manifest entry is fiction').toBeGreaterThan(0);
    expect(offenders, 'a non-strict read makes ABSENT and FALSE different worlds').toEqual([]);
  });

  test('the flag is VIRTUAL — manifested, and declared in no defaults or preset', async () => {
    const { DEFAULT_SIMULATION_RULES, SIMULATION_RULE_PRESETS } =
      await import('../../src/domain/worldPulse/simulationRules.js');
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain(FLAG);
    // anchored: DEFAULT_SIMULATION_RULES is asserted non-empty on the next line, so an
    // emptied defaults object reds here instead of certifying the flag virtual.
    expect(Object.keys(DEFAULT_SIMULATION_RULES).length).toBeGreaterThan(10);
    // anchored: the length assertion above proves the defaults object is populated.
    expect(Object.keys(DEFAULT_SIMULATION_RULES)).not.toContain(FLAG);
    for (const preset of Object.values(SIMULATION_RULE_PRESETS)) {
      // anchored: each preset's rule set is proven populated first, so a catalog that
      // emptied cannot pass this loop by having nothing to contain.
      expect(Object.keys(preset?.rules || {}).length, `${preset?.id}: empty preset`).toBeGreaterThan(10);
      // anchored: the length assertion above proves each preset's rule set is populated.
      expect(Object.keys(preset?.rules || {}), `${preset?.id}: the flag stopped being virtual`).not.toContain(FLAG);
    }
  });
});

describe('THE THREE DOORS — each dropped alone', () => {
  test('door 1: beliefs must be live', () => {
    // Two ways beliefsActive refuses, and BOTH are pinned: no spatial-canon marker, and
    // an omniscient world (where belief is not a thing that exists to be moved).
    expect(espionageActive(world({ canon: 0 })), 'the canon marker door is dead').toBe(false);
    expect(espionageActive(world({ infoMode: 'omniscient' })), 'the infoMode door is dead').toBe(false);
  });

  test('door 2: the errand spine must be lit', () => {
    expect(espionageActive(world({ spine: OMIT })), 'the spine door is dead').toBe(false);
    expect(espionageActive(world({ spine: false })), 'the spine door is dead').toBe(false);
    // AND the spine door reads the strict positive: a truthy non-true value is refused,
    // which is what keeps the lighting ORDER (spine first, then espionage) enforceable.
    expect(espionageActive(world({ spine: /** @type {any} */ ('true') }))).toBe(false);
  });

  test('door 3: the flag itself, by name', () => {
    expect(espionageActive(world({ espionage: false })), 'the flag door is dead').toBe(false);
  });

  test('a missing rules object, and a non-object world, both refuse', () => {
    expect(espionageActive(null)).toBe(false);
    expect(espionageActive(undefined)).toBe(false);
    expect(espionageActive({ spatialCanonVersion: 1 })).toBe(false);
    expect(espionageActive({ spatialCanonVersion: 1, simulationRules: 'nonsense' })).toBe(false);
  });
});

describe('THE LIT MUTANT — the gate can be opened, and opening it moves nothing', () => {
  test('all three doors satisfied opens the gate', () => {
    // A flag that can never be lit is a DEAD FLAG wearing a dormancy fence's clothes,
    // and every assertion above would pass over it unchanged.
    expect(espionageActive(world()), 'the gate cannot be opened at all').toBe(true);
    // THE LITERAL DRIVE, spelled out rather than composed. Everything above reaches the
    // flag through a computed key, which is correct for a door matrix and INVISIBLE to
    // tests/property/mechanismLitCoverage.test.js — that walker credits a flag as
    // lit-proven by finding `<flag>: true` as a literal in a test. A wave whose only
    // lit drive is computed reads to that walker as a mechanism shipped lit-unproven,
    // which is exactly the class it exists to close. So the drive is written twice: once
    // parameterised for coverage, and once literally for the census.
    expect(espionageActive({
      spatialCanonVersion: 1,
      simulationRules: { infoMode: 'unreliable', errandSpineEnabled: true, espionageEnabled: true },
    })).toBe(true);
  });

  test('with the gate OPEN, fences 1, 3 and 4 still hold — that IS dark-by-construction', () => {
    calls.doctrine = 0;
    calls.catchRolls = 0;
    const lit = world();
    expect(espionageActive(lit)).toBe(true);
    // FENCE 3, re-run lit: opening a gate nothing reads calls nothing.
    expect(calls.doctrine + calls.catchRolls).toBe(0);
    // FENCE 1, re-stated: the source tree does not change when a flag is set, and that
    // is the point — the darkness is structural, not conditional.
    expect(importersOf(SRC_FILES)).toEqual([]);
  });
});
