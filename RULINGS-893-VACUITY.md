# §893 — THE VACUITY RULINGS: a class found by accident, swept in full, and given a habitat cure
⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧ · lane VACUITY, 2026-09-04.

## 1. THE SWEEP — a real denominator, which is what makes the count mean anything
**2,567 of 2,567 tracked test/spec files parsed to an AST, zero parse failures.** Not a sample. Eight
detectors, one per named sub-class. **11 confirmed vacuous assertions, 6 of them load-bearing** (the
stated claim has no other guard in the file). 3 are fully redundant, 2 partial. 5 `expect(true).toBe(true)`
sites are honest, deliberately-named diagnostic printers and are NOT defects — but a walker must be
told about them.

## 2. ⛔⛔ THE TWO SHARPEST, VERIFIED BY THE CHAIR AT THE TIP
**(a) `negotiationPictures.test.js:377`** — the worst of the night.
```js
expect(JSON.stringify(materializeCarriedTermSheet({ termSheet: agreed, homeTick: 40 })))
  .toBe(JSON.stringify(materializeCarriedTermSheet({ termSheet: agreed, homeTick: 40 })));
```
Identical call on both sides. It is the LIVENESS ANCHOR for the three `toBeNull()` refusals above it,
and `JSON.stringify(null)` is the string `'null'`. **So if `materializeCarriedTermSheet` broke and
returned null for everything, all three refusals pass AND the anchor passes as `'null' === 'null'`.
The test passes in exactly the scenario it exists to exclude.** An anchor that cannot distinguish
"correctly refused" from "the producer died" is the vacuity it was written to prevent, one level up.

**(b) `arcaneIdentity.test.js:282` — and it is worse than tautology.** The test is named
*"NO-DRIFT: on the RESOLVED path the gate changes nothing"*. It builds two configs:
```js
const resolved  = cfg({ magicExists: false, priorityMagic: 0 });
const dialOnly  = cfg({ magicExists: true,  priorityMagic: 0 });
…
expect(getBaseChance(0.4, cat, name, cfg(), null), name)
  .toBe(getBaseChance(0.4, cat, name, cfg(), null));
```
**Both sides pass `cfg()` — the bare default. `resolved` and `dialOnly` are declared and never used.**
The test does not merely compare a value to itself; **it never exercises the two paths it was written
to compare.** The correct form is `getBaseChance(…, resolved, …)` against `getBaseChance(…, dialOnly, …)`,
and the sibling at `:270` already shows the pinned-literal idiom. **RULED: cure to the intended
comparison, not to a pinned literal — the local variables record the author's intent and are the
receipt for it.**

**(c) Two dormancy arms**, `magicSubstitutionReagents.test.js:301` and
`sovereigntyMarketStageWr10w.test.js:251`, both `expect(x.worldState).toBe(x.worldState)`, leaving each
no-write claim resting entirely on **the subject's own `changed` self-report**. ⚠ A dormancy claim is a
BIT claim (§713.2), and a bit that reports on itself is not evidence.

## 3. ⭐ RULED: BUILD THE HABITAT CURE, and build it where the lane says
**Extend `tests/lint/negativeAssertionAnchor.walker.test.js`.** No new test file, so no census hit —
decisive with the failure census FULL at 10/10. The lane's host argument is right on evidence: that
walker's charter is class-level *epistemic prevention*, its regeneration switch is already generically
named `UPDATE_EPISTEMIC_ALLOWLIST`, and **its own header scopes `not.toBe`/`not.toEqual` out because
"they compare against a value the test names" — the vacuity class is precisely where that named value
IS the value under test.** The cure belongs in the walker whose blind spot it is.
`espree` and `acorn` are already declared devDependencies, so **no `package.json` byte changes and no
mint trigger is armed**. ⭐ **The seed-class arm is born at EXACT ZERO with no frozen ledger**, because
its corpus-wide population is 2 and both are cured in the same act.

## 4. ⭐ RULED: THE LANE'S REFUSAL TO BUILD TWO ARMS IS UPHELD
It declined the gated- and looped-assertion arms: 1,584 looped tests are the estate's normal idiom, and
the 43 gated ones cannot be convicted without execution. **With the census at 10/10, an instrument that
would convict a world the owner has not ruled on must EXPOSE, not JUDGE.** The lane applied that law
without being handed it, and the refusal is upheld as correct rather than treated as incomplete work.

## 5. ⭐⭐ TWO PIECES OF METHOD WORTH MORE THAN THE FINDINGS
**(a) It found and DISCARDED two of its own unsound detectors.** The first reducer inlined `let`
bindings and reasoned across statements, convicting the whole `let fired = false; … expect(fired).toBe(false)`
family: **414 hits. The sound pass produces 2.** Both outputs were kept (`loose.json`, `sound.json`) so
the discard is AUDITABLE rather than asserted. That is the difference between a sweep and a scare.
**(b) The read tree's HEAD MOVED UNDER IT mid-scan** (`1223489c9` → `c2f80ffc9`, this chair's own cure
car). It CHECKED rather than assumed, established that one file changed and none of its finding files
did, and **re-read all 11 findings verbatim at the new sha** so every quote and line number is valid at
both. That is the shared-tree law honoured by a lane, unprompted.
