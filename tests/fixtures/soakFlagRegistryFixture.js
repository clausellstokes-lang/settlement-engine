/**
 * soakFlagRegistryFixture.js — SK-4's fixture registry (ODQ §143.2; annex SK.U4).
 *
 * ⛔⛔ SK.U4 — THE FIXTURE MUST BE ABLE TO EXECUTE ITS OWN DEFECT. The recorded
 * compile-fixture hazard: a fixture whose parameters make the defect unreachable produces
 * base ≡ cure and a green, meaningless pin. For the EFFECTIVE-PAIR credit rule, "the
 * defect" is a pair credited on a structurally dark key — so this fixture MUST contain at
 * least one `requires` pair whose parent can be OFF while the child reads ON, or the rule
 * is untestable and its pin passes for the wrong reason.
 *
 * `child` requires `parent`, and `loner` requires nothing. A row with
 * `{parent: false, child: true}` is exactly the distinguishing case: `child` is assigned
 * but NOT effective. The test's FIRST assertion is the fixture's own shape, before any
 * coverage number is read.
 *
 * ⭐ FOUR FACTORS, DELIBERATELY SMALL. The pair set is enumerable by hand here, so a
 * wrong coverage figure is visible rather than merely unequal to another computed figure —
 * which would be the self-referential pin class.
 */

export const FIXTURE_CENSUS = Object.freeze({
  governed: Object.freeze(['parent', 'loner']),
  ungoverned: Object.freeze(['child']),
  virtual: Object.freeze(['spare']),
  union: Object.freeze(['parent', 'loner', 'child', 'spare']),
  nonBoolean: Object.freeze(['fixtureMode']),
  overlap: Object.freeze([]),
});

export const FIXTURE_MANIFEST = Object.freeze([
  Object.freeze({
    kind: 'requires',
    key: 'child',
    parents: Object.freeze(['parent']),
    source: 'the fixture: a child gated on a parent, so an ineffective pair EXISTS to be measured',
    rationale: 'Without this row the effective-pair credit rule has no distinguishing case and its pin is vacuous.',
  }),
  Object.freeze({
    kind: 'excluded-with-rationale',
    key: 'spare',
    source: 'the fixture: one excluded key so the exclusion path is exercised',
    rationale: 'Proves varyingFactors actually removes an excluded key rather than returning the whole census.',
  }),
  Object.freeze({
    kind: 'non-boolean',
    key: 'fixtureMode',
    values: Object.freeze(['a', 'b']),
    source: 'the fixture: one non-boolean so the mixed-arity exclusion path is exercised',
    rationale: 'Non-boolean keys are held at their preset value; this row proves they never enter the array.',
  }),
]);

/** The row in which `child` is assigned ON but is NOT effective. */
export const INEFFECTIVE_ROW = Object.freeze({ parent: false, child: true, loner: true });

/** The same assignment made lawful — both members effective. */
export const EFFECTIVE_ROW = Object.freeze({ parent: true, child: true, loner: true });
