/**
 * believedWorldAxesDormancyFence.test.js — SP-B's FOUR-FENCE dormancy set, run THREE
 * TIMES (one per flag), plus the lit-mutant controls that prove the fences can see and
 * the three-family independence goldens that prove the flags are really separate.
 *
 * `believedScarcityEnabled`, `believedConditionsEnabled` and `believedDevotionEnabled`
 * are built DARK. The claim this file has to make good is not "nothing happened in a
 * world where nothing was going to happen anyway" — that is the vacuous green every
 * dormancy pin drifts toward. It is the harder one: on the exact fixture that DOES write
 * all three field families when the flags are lit, the dark run writes nothing and calls
 * nothing.
 *
 *   FENCE 1 — OWN-FOOTPRINT INVARIANT. Each family's whole surface is one conditional
 *     field on a belief record. Dark, the belief ledger the advance produces must be
 *     IDENTICAL to the ledger a pre-SP-B engine produces from the same input — which is
 *     measured here as the ledger produced with the host axis flag lit and no family
 *     flag set, the strictly better fence: no stored hash to rot, and no re-record ever
 *     owed for unrelated engine evolution.
 *
 *   FENCE 2 — DIFFERENTIAL, ABSENT vs EXPLICIT FALSE, over the whole projection. No
 *     fixture, so it cannot rot. Its designed blind spot is that it stays GREEN if the
 *     feature runs in BOTH configurations, which is exactly why it is never shipped
 *     alone and why the lit-mutant expects it to pass while fences 1 and 3 red.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. A strict pass-through spy counts real invocations of
 *     the two derivation entry points. State pins cannot see a feature that ran and
 *     happened to write nothing; this can.
 *
 *     THE SPY SITS ON beliefAxisSubjects.js, AND THAT IS LOAD-BEARING. The recorded
 *     WR-10 lesson is that wrapping a function in ITS OWN module's namespace counts
 *     ZERO when the caller invokes it intra-module, because the internal binding is the
 *     original. Here the caller (beliefAxes.js) IMPORTS `subjectGroundTruth` and
 *     `foldSubjectAxes` from beliefAxisSubjects.js, so mocking that module's exports
 *     really does intercept the call — the same lesson, applied the correct way round.
 *     It is also why the derivations live in a sibling leaf rather than inside
 *     beliefAxes.js: an intra-module fold would be unspyable by construction.
 *
 *   FENCE 4 — GATE-POLARITY CENSUS over the real source tree: every production read of
 *     each flag is the strict `=== true` form, so ABSENT and FALSE are identical BY
 *     CONSTRUCTION at decision sites no state pin reaches. It reuses the
 *     engine-gated-key walker's own comment/string blanker rather than a second regex,
 *     so a gate written in prose cannot be miscounted as a gate.
 *
 *   AND THE CONJUNCTION FENCE, which is SP-B's own: a family flag lit under DARK axes
 *     must be dark. Three flags whose host gate could be bypassed would be three ways to
 *     light a fold that does not exist.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../lint/engineGatedRuleKeys.walker.test.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = { groundTruth: 0, folds: 0 };

vi.mock('../../src/domain/worldPulse/beliefAxisSubjects.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // STRICT pass-through: rest-args in, the original's result out. Instrumenting the
    // module cannot perturb a byte of the runs the other fences measure.
    subjectGroundTruth: (...args) => { calls.groundTruth += 1; return actual.subjectGroundTruth(...args); },
    foldSubjectAxes: (...args) => { calls.folds += 1; return actual.foldSubjectAxes(...args); },
  };
});

const { advanceBeliefMaps } = await import('../../src/domain/worldPulse/beliefMap.js');
const { subjectAxesActive } = await import('../../src/domain/worldPulse/beliefAxes.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAGS = Object.freeze(['believedScarcityEnabled', 'believedConditionsEnabled', 'believedDevotionEnabled']);
const HOST = 'beliefAxesEnabled';

/**
 * THE ADVERSARIAL FIXTURE. Two neighbouring towns, each carrying a real economic state
 * and a real pantheon — a world that DOES write all three field families the moment the
 * flags are lit. Every dark claim below is made against this, never against an empty
 * world.
 */
function adversarialWorld() {
  const town = (id, name, tier, tradeAccess, prosperity, months, ratio) => ({
    id,
    name,
    settlement: {
      id,
      name,
      tier,
      populationHistory: [{ delta: -20, population: 900 }, { delta: -30, population: 870 }],
      economicState: {
        tier,
        prosperity,
        tradeAccess,
        isEntrepot: tradeAccess === 'crossroads',
        localProduction: ['grain', 'iron'],
        primaryExports: ['Grain surplus'],
        primaryImports: ['Timber'],
        necessityImports: ['Salt'],
        foodSecurity: { storageMonths: months, foodRatio: ratio },
      },
    },
  });
  const byId = new Map([
    ['a', town('a', 'Aldenmoor', 'town', 'crossroads', 'Prosperous', 9, 1.2)],
    ['b', town('b', 'Thornwall', 'village', 'river', 'Poor', 2, 0.7)],
  ]);
  return {
    snapshot: {
      byId,
      settlements: [...byId.values()],
      relationships: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }],
    },
    worldState: {
      spatialCanonVersion: 1,
      relationshipStates: {},
      religionStates: {
        a: { patronRef: 'deity.vael', deities: { 'deity.vael': { deityRef: 'deity.vael', share: 70, standing: 'ascendant' } } },
        b: { patronRef: null, deities: { 'deity.orr': { deityRef: 'deity.orr', share: 20, standing: 'cult' } } },
      },
    },
  };
}

const clone = (value) => JSON.parse(JSON.stringify(value));

/**
 * THE BELIEF LAYER ITSELF MUST BE LIVE IN EVERY ARM, dark and lit alike. `infoModeOf`
 * defaults to `omniscient`, under which `advanceBeliefMaps` early-returns and writes
 * nothing whatever the SP-B flags say — so a fence run without this would be measuring
 * the belief layer's own dormancy and calling it SP-B's. It rides on EVERY drive below,
 * which is what makes the dark runs a measurement of the flags rather than of the host.
 */
const BELIEFS_LIVE = Object.freeze({ infoMode: 'unreliable' });

/** Drive one cold-start advance under the given rules and return the belief ledger. */
function drive(rules) {
  const { snapshot, worldState } = adversarialWorld();
  const out = advanceBeliefMaps({
    snapshot,
    pressureIdx: null,
    worldState: { ...worldState, simulationRules: { ...BELIEFS_LIVE, ...rules } },
    tick: 11,
  });
  return { next: out.next ? clone(out.next) : null, changed: out.changed };
}

/** Every belief record in a ledger, flattened. */
function records(ledger) {
  const out = [];
  for (const observer of Object.keys(ledger || {}).sort()) {
    const slots = ledger[observer];
    if (!slots || typeof slots !== 'object') continue;
    for (const slot of Object.keys(slots).sort()) {
      for (const subject of Object.keys(slots[slot] || {}).sort()) out.push(slots[slot][subject]);
    }
  }
  return out;
}

/** The host axis flag lit, no family lit — the pre-SP-B engine, exactly. */
const AXES_ONLY = Object.freeze({ [HOST]: true });
const ALL_LIT = Object.freeze({ [HOST]: true, ...Object.fromEntries(FLAGS.map((f) => [f, true])) });

describe('SP-B fence 1 — the own-footprint invariant on an adversarial fixture', () => {
  test('THE LIT-MUTANT CONTROL: the same fixture lit really does write all three', () => {
    // Without this the fences below are claims about a fixture that could never produce.
    const lit = drive(ALL_LIT);
    const rows = records(lit.next);
    expect(rows.length, 'the fixture seeded no beliefs at all').toBeGreaterThan(0);
    expect(rows.every((r) => r.scarcityBands && typeof r.scarcityBands === 'object')).toBe(true);
    expect(rows.every((r) => r.conditionsBands && typeof r.conditionsBands === 'object')).toBe(true);
    expect(rows.every((r) => typeof r.devotionBand === 'string')).toBe(true);
    // …and the words are real ones, not empty containers that would satisfy a shape test.
    expect(rows.some((r) => Object.keys(r.scarcityBands).length > 0)).toBe(true);
    expect(rows.some((r) => r.conditionsBands.tierBand)).toBe(true);
  });

  test('dark, the ledger is identical to the axes-only ledger', () => {
    const base = drive(AXES_ONLY);
    for (const spelling of [{}, Object.fromEntries(FLAGS.map((f) => [f, false]))]) {
      const dark = drive({ ...AXES_ONLY, ...spelling });
      expect(dark.next, `rules=${JSON.stringify(spelling)}`).toEqual(base.next);
      expect(dark.changed).toBe(base.changed);
    }
    // anchored: the lit run above is asserted to CARRY all three families, so this
    // equality measures dormancy rather than two runs that both produced nothing.
    expect(records(base.next).every((r) => r.scarcityBands === undefined
      && r.conditionsBands === undefined && r.devotionBand === undefined)).toBe(true);
  });

  test('THE CONJUNCTION FENCE: all three families lit under DARK axes stay dark', () => {
    const familiesWithoutHost = Object.fromEntries(FLAGS.map((f) => [f, true]));
    const noHost = drive(familiesWithoutHost);
    const nothing = drive({});
    expect(noHost.next).toEqual(nothing.next);
    // A family cannot exist without the fold that carries it, so the D-1 axis fields are
    // absent here too — which is what makes this a conjunction rather than an or.
    expect(records(noHost.next).every((r) => r.populationTrendBand === undefined)).toBe(true);
  });

  test('THE DOOR ITSELF refuses under dark axes, measured directly', () => {
    // AND THE REASON THIS UNIT ASSERTION EXISTS IS AN EXECUTED MUTANT THAT SURVIVED
    // WITHOUT IT. The conjunction is guarded TWICE — once inside `subjectAxesActive` and
    // again by beliefMap's own `if (ctx.axesActive)` at the call site — so deleting the
    // door's host check left the whole state-level fence above perfectly green: the
    // second guard silently covered for the first. A guard that cannot be reddened is a
    // guard that cannot be proven, and one of the two would have rotted into decoration
    // the day a future caller reached the door without passing the call site. So the
    // door is measured on its own terms here, where severing its host check reds.
    const rules = (extra) => ({ simulationRules: { ...BELIEFS_LIVE, ...extra } });
    const allFamilies = Object.fromEntries(FLAGS.map((f) => [f, true]));
    expect(subjectAxesActive(rules(allFamilies)), 'the door opened under dark axes').toBeNull();
    expect(subjectAxesActive(rules({ [HOST]: true })), 'the door opened with no family lit').toBeNull();
    // THE CONTROL: with the host AND one family lit it really does open, so the two nulls
    // above measure the conjunction rather than a door that never opens at all.
    expect(subjectAxesActive(rules({ [HOST]: true, [FLAGS[0]]: true })))
      .toEqual({ scarcity: true, conditions: false, devotion: false });
    // …and the strict idiom holds: a truthy non-true value is dark.
    expect(subjectAxesActive(rules({ [HOST]: true, [FLAGS[0]]: 'true' }))).toBeNull();
  });
});

describe('SP-B fence 2 — absent versus explicit false, over the whole projection', () => {
  test('the two dark spellings are indistinguishable in every observable', () => {
    // No fixture to rot: this compares two runs of the SAME drive against each other.
    for (const flag of FLAGS) {
      const absent = drive(AXES_ONLY);
      const explicitFalse = drive({ ...AXES_ONLY, [flag]: false });
      expect(JSON.stringify(explicitFalse.next), `${flag} distinguishes absent from false`)
        .toBe(JSON.stringify(absent.next));
    }
    // ITS DESIGNED BLIND SPOT, STATED: this fence would stay green if the feature ran in
    // BOTH configurations. Fences 1 and 3 are what close that, which is why the set ships
    // together and never one at a time.
  });
});

describe('SP-B fence 3 — call-path dormancy at the beliefAxisSubjects boundary', () => {
  test('dark the derivations are NEVER invoked, and lit they are', () => {
    calls.groundTruth = 0;
    calls.folds = 0;
    for (const rules of [{}, AXES_ONLY, Object.fromEntries(FLAGS.map((f) => [f, false]))]) drive(rules);
    expect(calls.groundTruth, 'the subject derivation ran in a dark world').toBe(0);
    expect(calls.folds, 'the subject fold ran in a dark world').toBe(0);

    // THE CONTROL. The identical drive with the flags lit MUST reach it — otherwise the
    // zero above proves only that the spy is broken or the seam unreachable.
    drive(ALL_LIT);
    expect(calls.groundTruth).toBeGreaterThan(0);

    // And the HOST gate still dominates: no axes, no derivation, however lit the three
    // family flags are.
    calls.groundTruth = 0;
    drive(Object.fromEntries(FLAGS.map((f) => [f, true])));
    expect(calls.groundTruth).toBe(0);
  });
});

describe('SP-B — three flags, three footprints (the independence goldens)', () => {
  test('lighting ONE family adds ONLY its own field', () => {
    const base = records(drive(AXES_ONLY).next);
    const expected = {
      believedScarcityEnabled: 'scarcityBands',
      believedConditionsEnabled: 'conditionsBands',
      believedDevotionEnabled: 'devotionBand',
    };
    for (const flag of FLAGS) {
      const rows = records(drive({ ...AXES_ONLY, [flag]: true }).next);
      expect(rows.length).toBe(base.length);
      for (let i = 0; i < rows.length; i += 1) {
        const added = Object.keys(rows[i]).filter((k) => !(k in base[i]));
        expect(added, `${flag} moved a sibling family's field`).toEqual([expected[flag]]);
        // …and every field the base already carried is byte-identical beside it.
        for (const key of Object.keys(base[i])) expect(rows[i][key]).toEqual(base[i][key]);
      }
    }
  });
});

describe('SP-B fence 4 — gate polarity and purity, censused over the real tree', () => {
  /** @param {string} dir @param {string[]} out */
  function walk(dir, out = []) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.(js|jsx)$/.test(p)) out.push(p);
    }
    return out;
  }

  const sources = walk(join(ROOT, 'src')).map((p) => ({
    rel: relative(ROOT, p).replace(/\\/g, '/'),
    code: codeOnly(readFileSync(p, 'utf8')),
  }));

  test('every production read of every SP-B flag is the strict === true form', () => {
    for (const flag of FLAGS) {
      /** @type {string[]} */
      const offenders = [];
      let reads = 0;
      for (const { rel, code } of sources) {
        for (const line of code.split('\n')) {
          if (!line.includes(flag)) continue;
          reads += 1;
          if (!new RegExp(`${flag}\\s*===\\s*true`).test(line)) offenders.push(`${rel}: ${line.trim()}`);
        }
      }
      expect(offenders, `a permissive or negated read of ${flag} exists`).toEqual([]);
      // NON-VACUITY: the blanker must not have eaten the read. Exactly one real gate
      // exists per flag — the one door in beliefAxes.subjectAxesActive — and a BY-NAME
      // read is mandatory precisely because a frozen-list `.every()` would hide it from
      // the engine-gated-key census.
      expect(reads, `${flag} census found no reads at all`).toBeGreaterThanOrEqual(1);
    }
  });

  test('the three flags are virtual: absent from the rules DEFAULTS and every preset', async () => {
    const { DEFAULT_SIMULATION_RULES, SIMULATION_RULE_PRESETS, ENGINE_GATED_VIRTUAL_RULE_KEYS } =
      await import('../../src/domain/worldPulse/simulationRules.js');
    const presets = Object.values(SIMULATION_RULE_PRESETS);
    expect(presets.length, 'the preset catalog emptied — this absence claim would be vacuous')
      .toBeGreaterThanOrEqual(5);
    for (const flag of FLAGS) {
      expect(flag in DEFAULT_SIMULATION_RULES).toBe(false);
      for (const preset of presets) {
        expect(flag in (preset.rules || {}), `${preset.id} lit ${flag}`).toBe(false);
        // anchored: the presets DO carry rule keys, so the absence above is a measurement
        // rather than a lookup into an empty object.
        expect(Object.keys(preset.rules || {}).length, `${preset.id} carries no rules`).toBeGreaterThan(0);
      }
      // …and each IS declared, so the census that demands its certification can see it.
      // This is the CQ5 one-commit law's other half, asserted from the dormancy side.
      expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain(flag);
    }
  });

  test('the SP-B family is PRNG-free and clock-free', () => {
    // Zero PRNG is a charter law, not a style note: an axis that rolled would break
    // same-seed re-derivation and with it THE PROMISE.
    const family = sources.filter(({ rel }) => /\/(beliefAxisSubjects|outboundImpression)\.js$/.test(rel));
    expect(family.length, 'the SP-B module family emptied — re-aim this scan').toBe(2);
    /** @type {string[]} */
    const impure = [];
    for (const { rel, code } of family) {
      for (const forbidden of ['Math.random', 'Date.now', 'new Date', 'performance.now']) {
        if (code.includes(forbidden)) impure.push(`${rel}: ${forbidden}`);
      }
    }
    expect(impure).toEqual([]);
    // anchored: the scan DOES find these tokens elsewhere in the tree, so an empty result
    // for this family is a property of the family and not of a broken scan.
    expect(sources.some(({ code }) => code.includes('Math.random'))).toBe(true);
  });

  test('L3: the FOLD reads no truth, and the ONE door legitimately does', () => {
    // The epistemics law runs both ways in this file family. The ground-truth half is
    // ALLOWED to read the world -- that is what `axisGroundTruth` is for, and it is the
    // only door. The FOLD half receives derived words and must never reach back, because
    // a fold that re-read the world would silently re-anchor a belief to present truth
    // and make the whole fog-of-war seam a decoration.
    //
    // The scan is a source split at the module's own fold marker, with the GUARD-THE-GUARD
    // built in: the same token set is asserted PRESENT in the ground-truth half before its
    // absence is asserted in the fold half, so a scan that stopped matching reds instead of
    // reporting a clean fold.
    // Measured, not guessed: `worldState` was in the first draft of this list and is NOT
    // in the leaf's code at all -- the module takes a settlement and a sources record, never
    // a world. It was dropped rather than kept as a token that could never fire, which is the
    // vacuity this file's guard-the-guard exists to catch, caught on its own scan.
    const TRUTH_TOKENS = ['economicState', 'religionState', 'settlement', 'foodSecurity', 'deities'];
    const src = codeOnly(readFileSync(join(ROOT, 'src/domain/worldPulse/beliefAxisSubjects.js'), 'utf8'));
    const marker = 'export function foldSubjectAxes';
    const split = src.indexOf('function bestFidelity');
    expect(split, 'the fold section marker moved -- re-anchor this scan').toBeGreaterThan(0);
    expect(src.indexOf(marker), 'the fold export vanished').toBeGreaterThan(split);
    const groundTruthHalf = src.slice(0, split);
    const foldHalf = src.slice(split);

    const spokenInTruth = TRUTH_TOKENS.filter((t) => groundTruthHalf.includes(t));
    expect(
      spokenInTruth,
      'the ground-truth half stopped naming the world -- the scan is measuring nothing',
    ).toEqual(TRUTH_TOKENS);
    const leaked = TRUTH_TOKENS.filter((t) => foldHalf.includes(t));
    expect(
      leaked,
      'the SP-B fold reached back into truth-side state. The fold receives derived words'
      + ' and nothing else; re-reading the world there would re-anchor belief to present'
      + ' truth and abolish the staleness the whole family exists to model.',
    ).toEqual([]);
  });

  test('outboundImpression.js holds its ZERO-IMPORT contract', () => {
    // The structural half of the Law One recursion ban: a module with no imports cannot
    // reach the belief partition even by accident, so "it never reads a counterpart's
    // beliefs" is a property of the file rather than a promise in its header.
    const IMPORT_RE = /(?:^|\n)\s*import\b/;
    const src = codeOnly(readFileSync(join(ROOT, 'src/domain/worldPulse/outboundImpression.js'), 'utf8'));
    // THE POSITIVE CONTROL FIRST: the same detector, run on a sibling that DOES import,
    // proves the regex still bites before any absence is asserted from it.
    const sibling = codeOnly(readFileSync(join(ROOT, 'src/domain/worldPulse/beliefAxisSubjects.js'), 'utf8'));
    expect(IMPORT_RE.test(sibling), 'the import detector stopped matching').toBe(true);
    // anchored: the same regex is proven to BITE on the sibling one line above, and the blanked source is proven non-empty by the exported symbol below.
    expect(src).not.toMatch(IMPORT_RE);
    expect(src).toContain('outboundImpressionOf');
  });
});
