/**
 * tests/lint/transientChooserRegistry.walker.test.js — THE TRANSIENT-CHOOSER WALKER (EM-R1b, the
 * re-entry family).
 *
 * WHAT IT HOLDS. `src/generators/pipeline.js` declares `_TRANSIENT_CHOOSERS`: the ctx keys the
 * partial-pin rule does NOT count against a record-built pin bag, because the value never lands on
 * a record and a bag built FROM a record can therefore never carry it. That declaration is a COPY
 * of a measurement that lives somewhere else — `src/domain/generation/generationForkRegistry.js ::
 * GENERATION_TIER1`, where a `provides` row whose `recordPath` is `null` says exactly that. A copy
 * of a measurement rots silently: a step gains a chooser, a chooser starts landing on the record,
 * a key is added because it "looks transient", and the rule quietly means something else. This
 * walker holds the two EQUAL IN BOTH DIRECTIONS, so the day either moves the rule reds BY NAME.
 *
 * ⛔ WHY THE DECLARATION IS A COPY AT ALL, AND WHY THAT IS NOT A DEFECT TO CURE HERE. The register
 * is PRODUCTION-UNREACHABLE by its own header's law: nothing under `src/` imports it, and a
 * generators-to-domain import edge would route its transitive closure into the eager `engine-core`
 * chunk (`vite.config.js :: computeEngineSharedDomain`). So the runner declares the set, this
 * walker is the joint, and acquiring a production importer stays a STOP rather than a refactor.
 *
 * ⛔ THREE CONSTRUCTION RULES (packet §7), each with its own instrument:
 *   1. `it` and `describe` are bound EXACTLY ONCE each and never re-bound, not even as a callback
 *      parameter: the sovereignty-lighting census resolves an opener only where the module binds
 *      the word once, and a stray `(it) =>` parks the whole file.
 *   2. BOTH SETS ARE IMPORTED FROM THEIR PRODUCERS — the declaration through `getStepMeta()`, the
 *      register from its own module — and neither is re-typed here. A local literal copy of a
 *      table is the shape `tests/lint/contractTestAntiVacuity.walker.test.js` Rule 2 convicts, and
 *      a re-typed set is how two instruments come to disagree while both report green.
 *   3. This file reads NO source, NO `dist` and spells NO repository root, so
 *      `tests/lint/moduleScopeCwdRatchet.test.js`'s banked population is unmoved by its arrival.
 *
 * AS OF THIS LANDING, MEASURED: the declaration is NINETEEN keys carried by SIX of the twenty-two
 * registered steps. Those figures are stated here as the measurement they are; the ARM is the
 * both-directions equality, which follows a lawful register change instead of convicting it.
 *
 * CANNOT-CATCH:
 * 1.  A DECLARED KEY NO REGISTERED STEP PROVIDES IS INVISIBLE TO BOTH DIRECTIONS. `getStepMeta()`
 *     computes each step's `transient` list by filtering that step's OWN `provides`, so a key in
 *     the runner's set that no step provides appears in no step's list, and the register side is
 *     built from `provides` keys too. The set can therefore carry a dead key forever and both
 *     sides stay equal. A1's equality is over LIVE choosers, never over the literal.
 * 2.  A key whose register row is MISSING ALTOGETHER is not a transient chooser here: the
 *     predicate demands at least one `provides` row, so an unmeasured key reads as record-backed
 *     and is counted against a bag. That is fail-closed, and it is not detected — the register's
 *     own totality is `tests/lint/generationForkRegistry.contract.test.js`'s arm.
 * 3.  A3 drives the leaf through an INJECTED STUB roster, so it proves that `pinsFrom` reads the
 *     channel and obeys it; it does not prove the real roster's values, which is A1's half.
 * 4.  Nothing here runs a generation. That the cured rule actually re-derives a settlement is
 *     `tests/generators/pipelinePinnedMode.test.js` and
 *     `tests/property/dmLayerGoldenIsolation.test.js` territory; this file is the joint between
 *     two declarations.
 */
import { describe, expect, it } from 'vitest';

import { getStepMeta } from '../../src/generators/pipeline.js';
// Side-effect import: the step registry is populated by the entry point, not by pipeline.js.
// Without it `getStepMeta()` returns [] and every equality below would hold on nothing.
import '../../src/generators/generateSettlementPipeline.js';
import { pinsFrom } from '../../src/domain/edit/dmLayer.js';
import { GENERATION_TIER1 } from '../../src/domain/generation/generationForkRegistry.js';

/** The live roster length, the anti-vacuity floor every set equality here rests on. */
const REGISTERED_STEPS = 22;

/** The register's `provides` rows — the only half of Tier 1 a chooser can be read from. */
const PROVIDES_ROWS = GENERATION_TIER1.filter((row) => row.via === 'provides');

/** Every register row that declares `key` as a chooser, at whatever step declares it. */
const providesRowsFor = (key) => PROVIDES_ROWS.filter((row) => row.key === key);

/**
 * THE REGISTER'S OWN ANSWER: a chooser is transient exactly when it HAS `provides` rows and every
 * one of them records `recordPath: null`. Spelled once, used by both arms and by the control.
 */
const registerCallsTransient = (key) => {
  const rows = providesRowsFor(key);
  return rows.length > 0 && rows.every((row) => row.recordPath === null);
};

describe('EM-R1b — the transient-chooser declaration is the register, both directions', () => {
  it('A1 — EM-R1b: the runner\'s declaration and the register\'s recordPath-null set are equal', () => {
    const roster = getStepMeta();
    expect(roster, 'the roster is live, or every equality below holds on nothing')
      .toHaveLength(REGISTERED_STEPS);

    const declared = [...new Set(roster.flatMap((step) => step.transient))].sort();
    const fromRegister = [...new Set(roster.flatMap((step) => step.provides))]
      .filter(registerCallsTransient)
      .sort();

    expect(declared.length, 'the declaration is empty: the runner counts every chooser again')
      .toBeGreaterThan(0);
    expect(fromRegister.length, 'the register names no recordPath-null chooser: the predicate broke')
      .toBeGreaterThan(0);
    // ⭐ THE ARM. A sorted-array equality is a set equality in BOTH directions: a key the runner
    // declares that the register does not, and a key the register measures that the runner forgot,
    // each red here by name.
    expect(declared, 'the runner\'s declaration and the register\'s measurement disagree')
      .toEqual(fromRegister);

    // Every declaring step is a step that really carries one, so the union above is not assembled
    // from an empty roster of lists.
    const carriers = roster.filter((step) => step.transient.length > 0).map((step) => step.name);
    expect(carriers.length, 'no registered step carries a transient chooser').toBeGreaterThan(0);
    expect(carriers.length, 'every step carries one, so the filter measured nothing')
      .toBeLessThan(roster.length);
  });

  it('A2 — EM-R1b: every declared key is its own step\'s chooser and lands on no record', () => {
    const roster = getStepMeta();
    const strays = [];
    const landed = [];
    for (const step of roster) {
      for (const key of step.transient) {
        if (!step.provides.includes(key)) strays.push(`${step.name} declares ${key}`);
        for (const row of providesRowsFor(key)) {
          if (row.recordPath !== null) landed.push(`${row.step}|${key}|${row.recordPath}`);
        }
      }
    }
    const declaredRows = roster.reduce((total, step) => total + step.transient.length, 0);
    expect(declaredRows, 'the walk visited no declaration at all, so both lists below are empty '
      + 'for the wrong reason').toBeGreaterThan(0);
    // anchored: the line above proves the walk really visited a non-empty declaration, so this
    // empty list measures the declaration rather than an empty loop.
    expect(strays, 'a step declares a transient chooser it does not provide').toEqual([]);
    // anchored: the same non-empty declaration feeds this list, and the control below shows the
    // identical predicate DOES convict a key the register lands on the record.
    expect(landed, 'a declared transient chooser has a non-null recordPath at one of its providers')
      .toEqual([]);

    // ⭐ THE POSITIVE CONTROL, IN THIS ARM: `powerStructure` is the chooser this member's own cure
    // pins, it sits beside a declared one on the same step, and the SAME predicate must reject it.
    // Without this, "no declared key lands on the record" could pass on a broken predicate.
    const control = providesRowsFor('powerStructure');
    expect(control.length, 'the control key has no register row, so it controls nothing')
      .toBeGreaterThan(0);
    expect(registerCallsTransient('powerStructure'),
      'the predicate accepted a record-backed chooser: it can no longer tell the two apart')
      .toBe(false);
    expect(roster.flatMap((step) => step.transient).includes('powerStructure'),
      'the runner declared a record-backed chooser transient').toBe(false);
  });

  it('A3 — EM-R1b: the leaf reads the same declaration through the injected handle', () => {
    // NO REAL REGISTRY AND NO GENERATION: a two-chooser stub step, one of whose choosers is
    // declared transient and is NOT on the record. That is the whole shape the cure turns on.
    const record = { alpha: { leaf: 'the record\'s own value' } };
    const rosterWith = [{ name: 'stubStep', provides: ['alpha', 'beta'], transient: ['beta'] }];
    const rosterWithout = [{ name: 'stubStep', provides: ['alpha', 'beta'], transient: [] }];
    const declarations = {
      declarationsFor: (cardType) => (cardType === 'stub' ? [{ field: 'leaf', outputKey: 'alpha.leaf' }] : []),
    };
    const layer = {
      roots: { 'stub:one:leaf': 'THE DM VALUE' }, worldFacts: {}, minted: {}, phantoms: {},
    };

    const read = pinsFrom(record, layer, declarations, { getStepMeta: () => rosterWith });
    expect(read.unapplied, 'a transient chooser still blocks the closure: the leaf is not reading '
      + 'the channel').toEqual([]);
    expect(Object.keys(read.pins), 'the closure pins the record-backed chooser and omits the '
      + 'transient one').toEqual(['alpha']);
    expect(read.pins.alpha.leaf, 'the DM\'s value is written at the leaf inside the CLONE')
      .toBe('THE DM VALUE');
    expect(record.alpha.leaf, 'the record itself was written through').toBe('the record\'s own value');

    // ⭐ THE CONTROL: the identical roster with the declaration REMOVED refuses by name. A leaf
    // that stopped reading the channel reds on the arm above; a leaf that ignores the roster
    // entirely reds here, because the two calls would then agree.
    const blind = pinsFrom(record, layer, declarations, { getStepMeta: () => rosterWithout });
    expect(Object.keys(blind.pins), 'without the declaration the closure must not be buildable')
      .toEqual([]);
    expect(blind.unapplied.map((row) => row.reason),
      'the undeclared run must refuse by the closed reason the leaf exports')
      .toEqual(['step_not_pinnable']);
  });
});
