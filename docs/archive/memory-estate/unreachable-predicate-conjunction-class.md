---
name: unreachable-predicate-conjunction-class
description: Bug class — a filter conjunction whose two predicates are mutually exclusive silently makes a whole feature branch dead code
metadata: 
  node_type: memory
  type: project
  originSessionId: c0eb8c59-b585-45a4-afa4-24af69125d15
  modified: 2026-08-06T19:02:31.831Z
---

A guard of the form `!isProtected(x) && matchesTarget(x)` is dead whenever
everything `matchesTarget` accepts is also something `isProtected` rejects. The
feature reads as implemented, has a code path, has comments describing its
semantics — and never executes once.

**The confirmed instance (2026-07-26, `assembleInstitutions.js` §14 custom
subsumption).** A custom institution declaring `subsumes: ['custom:…']` could
never absorb its target:
`matchesSubsumptionTarget`'s custom branch requires
`isMaterializedCustomContent(institution)`, but `AUTHORED_SOURCES` in
`src/domain/generationOwnership.js` contains `'custom'` **and**
`isAuthoredGenerationEntity` also fires on `customDefinitionId` — so every
materialized custom institution was `isProtectedGenerationEntity`. Measured:
130 of 130 materialized custom institutions protected, conjunction reachable on
**zero**. Cure: `isProtectedFromCustomSubsumption(entity, { exactTarget })` —
an exact `custom:` reference is the author's own authority over their own
definition, so custom provenance alone must not veto it, while required / forced
/ locked / pinned / event-authored records stay protected.

**Why it hid:** the test that caught it failed on only 1 of 100 seeds in the
vitest report (seed 5), because vitest aborts a loop at the first failing
assertion. The true rate was **30/100** — the absorbed institution is optional
and only materializes on ~30% of seeds. The reported failure rate of a
loop-over-seeds test is a LOWER BOUND, never the scale.

**How to apply:** when a feature's guard combines a "may I touch this?" predicate
with a "does this match?" predicate, prove the conjunction is satisfiable by
executing it over real pipeline output and counting — do not read the two
predicates and conclude they compose. And when a seeded-corpus test fails on one
seed, sweep the whole corpus before sizing the bug.

**SECOND CONFIRMED INSTANCE — UNREACHABLE AT THE DEFAULT BOUND (2026-08-06,
SP-E, `src/domain/certification/phraseRepetitionEnvelope.js`).** A different
shape of the same class, and it is the one a mutant round catches rather than a
read. `phraseRepetitionViolations` filters `row.powered && row.repeatShare >
ceiling`. Deleting `row.powered &&` left ALL SIXTEEN arms of its walker GREEN.
MEASURED CAUSE: an unpowered window holds at most 3 lines
(`POWERED_WINDOW_MINIMUM` is 4), so its repeat share caps at `(3-1)/3 = 0.667`,
which is BELOW the default `PHRASE_REPETITION_CEILING` of `0.75` — the guard's
INPUT RANGE cannot reach the BOUND it is graded against, so the conjunct is
unreachable at the shipped configuration. It is genuinely live for any ceiling
under 0.667, and the ceiling is an owner-signed tunable, so the clause is
CORRECT and was kept rather than deleted.

**Why this one is invisible to a read:** both predicates are individually
satisfiable and obviously sensible; only the ARITHMETIC RELATION between one
predicate's implied range and the other's constant makes the pair dead. Nobody
reading `powered && share > ceiling` sees it.

**How to apply (the tunable-bound corollary):** when a guard is graded against a
bound that is a TUNING CONSTANT, (a) compute the guard's input range at that
constant and prove the guard can fire there, and (b) if it cannot, pin it by
driving the predicate at a bound where it IS reachable — pass an explicit
tighter bound in the test — with a positive control at the same bound, and say
in the header why the default cannot exercise it. Do not delete the clause
because the default cannot reach it, and do not leave it pinned only at the
default. Related: [[generation-remediation-gate-state]],
[[faction-key-defect-class]], [[sp-e-narration-kit-landed]].
