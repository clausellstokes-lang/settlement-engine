# RULING — CLAMP WAVE 0: the migration rule is amended to CALL-SITE-LEVEL byte-neutrality
2026-09-04 · Opus 5 · ⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧

## THE DEADLOCK, MEASURED
`tests/kernel/clampPrimitive.parity.test.js` proves **function-level** byte identity, and its own
negative controls name the divergent families. **All 16 un-baselined copies are
`byteIdenticalToKernel: false`.** So the rule as written — *migrate only a copy the parity test
proves byte-identical* — **forbids every migration**, while `BASELINE_CEILING = 62` (which may not
be raised without a recorded ruling) **requires all 16 to leave**. The two cannot both be obeyed.
MECHANICAL work alone lands at 70, eight over, on either branch.

## RULED
**The migration bar is amended from FUNCTION-LEVEL PARITY to CALL-SITE-LEVEL PROVEN
BYTE-NEUTRALITY.** A copy may migrate when, for every one of its call sites, the argument
provably cannot take a value on which the local and the kernel disagree — proved by EXECUTING both
implementations over the divergent input classes and by TRACING each argument to a bound, never by
asserting that "no caller would do that".

**Why this is the right bar and not a weakening.** Function-level parity asks a question the estate
does not care about: whether two functions agree on inputs that cannot occur. What ships is the
composition of a clamp with its callers. A copy whose divergent classes are screened off by a
`num()` wrapper at every site is, in the built artifact, *exactly* the kernel — and the parity test
cannot see that because it only ever looks at the function.

**Three fences, so the amendment cannot become a loophole:**
1. ⛔ **The `num()`-style wrappers that screen the divergent classes MUST BE KEPT.** They look
   redundant once the kernel's own guard is in place and they are not: deleting one as post-migration
   cleanup re-exposes the divergent classes on raw record reads. Migrate the definition; do not touch
   the call sites.
2. ⛔ **UNKNOWN reachability is not NO.** If an argument traces to a division, an average, a parsed
   value, or a field read off world state that cannot be followed to a bound, the file does not
   qualify for this bar.
3. ⛔ **Two sites are excluded by name and do NOT migrate under this ruling** — `warAllianceRisk`
   (migrating inverts a fail-SAFE deterrence gate to fail-OPEN on an atrocity path) and
   `conquestFeasibility` ARM 2 (the kernel cannot produce the `null` the module's own doctrine
   requires; collapsing to 0 is the flattering default it forbids).

## WHAT IS NOT RULED
The ceiling is untouched. The parity test's own **gap** — family D has no negative control — is a
finding for whoever extends that instrument, not a licence. And ⚠ **the bill in the plan is the
plan's count, not the chair's**: five times in this arc a chair ruling was right while its named
mechanism was wrong. The lane re-derives.
