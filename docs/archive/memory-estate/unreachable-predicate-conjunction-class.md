---
name: unreachable-predicate-conjunction-class
description: Bug class — a filter conjunction whose two predicates are mutually exclusive silently makes a whole feature branch dead code
metadata: 
  node_type: memory
  type: project
  originSessionId: c0eb8c59-b585-45a4-afa4-24af69125d15
  modified: 2026-07-26T09:05:42.112Z
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
seed, sweep the whole corpus before sizing the bug. Related:
[[generation-remediation-gate-state]], [[faction-key-defect-class]].
