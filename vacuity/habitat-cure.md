# HABITAT CURE — can a walker detect the vacuity class?

**Answer: yes for three of the five sub-classes, and one of those three can be born at EXACT ZERO.** The remaining two are not walker material and should not be built; the estate already has a better convention for them.

---

## 0. Where the cure goes (the census constraint)

⚠ A **new test file** reds three censuses, and the known-failure census is FULL at 10/10 with no headroom. So the cure must **extend an existing file**.

**Extend `tests/lint/negativeAssertionAnchor.walker.test.js`.** It is the right host on the evidence, not merely a convenient one:

- Its own header frames it as *"habitat removal for the DRIFT-NEUTERED NEGATIVE ASSERTION class (**epistemic prevention**, wave EP-1)"* — a class-level charter, not a matcher-level one.
- Its regeneration switch is already named generically: `UPDATE_EPISTEMIC_ALLOWLIST=1`. Not `UPDATE_NEGATIVES_ALLOWLIST`. The file was built to hold more than one epistemic arm.
- Its header already scopes the sibling class OUT by name, and gives the reason: *"Other negative matchers (`not.toBe`, `not.toEqual`, `not.toBeDefined`) are OUT of scope: they compare against a value the test names."* The vacuity class is exactly the case where **the value the test names is the value under test**. It is the declared gap in the existing walker's own reasoning.
- It already walks the whole `tests/` tree and already owns the two mechanisms the cure needs: a same-line/line-above comment exemption (`// anchored: <why>`), and a per-file exact-count frozen ledger.

**Feasibility receipts** (measured, this lane, HEAD `1223489c9`):
- `espree ^11.2.0` and `acorn ^8.16.0` are **declared devDependencies** in `package.json`. ⚠ Any package.json byte change is a mint trigger — the cure needs none.
- Four existing lint walkers already parse JS in-test: `tests/lint/rawColorLiteral.test.js:25` and `tests/lint/sovereigntyLightingContract.walker.test.js:489` (`import { parse } from 'espree'`), `tests/lint/allowlistRebuilderRegistry.walker.test.js:121` and `tests/lint/newsAuthoringCensus.shared.mjs:16` (`from 'acorn'`). An AST arm is precedented, not novel.
- **espree parsed 2525 of the 2567 test files** (`ecmaVersion:'latest', sourceType:'module', ecmaFeatures:{jsx:true}`). All 42 failures are `.ts`. So the arm covers every `.js`/`.jsx` file with no new dependency, and the 43 `.test.ts` files become a declared, frozen exclusion list (or are handled by the already-declared `typescript` parser if the arm is later widened).

⚠ **The implementing lane must still check** whether adding a `describe`/`test` to an existing file moves any test-count census. This lane is measurement-only and did not run a gate, so that is PLAUSIBLE-not-CONFIRMED.

---

## 1. ARM V-A — SAME-BINDING (`expect(X).toBe(X)`, no call on either side)

**Detection rule.** Parse the file. For every `expect(A).toBe(B)` / `toEqual` / `toStrictEqual`, compare the whitespace-normalised source of `A` and `B`. Flag when they are identical **and neither contains a CallExpression**.

**Why this is a proof, not a heuristic.** With no call on either side, both operands are reads of the same bindings inside one expression. No statement can intervene, no producer re-runs. The assertion is `x === x` under every possible behaviour of the code under test. There is no false-positive *class* — only the question of whether the vacuity was intended.

**False-positive risk: nil in the logical sense; 5 intentional sites in practice.** Measured population corpus-wide: **9 sites**, of which 5 are the honest `expect(true).toBe(true)` diagnostics printers and 4 are the defects V-1 through V-4.

**Shape.** Cure the 4 defects, annotate the 5 diagnostics with a marker mirroring the existing idiom —

```js
// vacuous-by-design: this test exists to print diagnostics; the body is the assertion
expect(true).toBe(true);
```

— and hold the arm at **EXACT ZERO un-annotated sites**. No frozen per-file ledger is needed at all, which is the cheapest possible ratchet: a new same-binding tautology reds on the day it lands.

---

## 2. ARM V-B — HELPER-REDUCED SELF-COMPARISON (the seed class)

**Detection rule.** Reduce each operand's source by repeatedly applying three rewrites, then compare:
1. **Helper inline** — a call to a file-local `const f = (a, b) => <expression>` or a single-`return` function declaration is replaced by its body with argument sources substituted for parameter identifiers (skipping non-computed member properties and object keys).
2. **Index fold** — `[a, b, ...c][K]` collapses to element `K`, but only when every element up to `K` is non-spread.
3. Iterate to a fixed point (cap depth ~10, source length ~4 KB).

Flag when the two reduced sources are equal and at least one reduction step fired.

**Why it is sound.** Both rewrites are purely syntactic and both operands are evaluated inside a single expression statement, so no intervening statement can mutate shared state between them. Unlike const-identifier inlining (see §5), this needs no assumption about the program.

**False-positive risk: measured at zero.** Running this arm over all 2567 files produced **exactly 2 hits, and both are the seed sites** (`rumorFallbackPhrasePools.test.js:228` and `:338`). Nothing else in the estate has this shape.

**Shape.** Because the population is 2, this arm can be born at **EXACT ZERO with no frozen list** once both are cured. That is the highest-value, lowest-maintenance arm in the proposal: it demolishes the habitat outright rather than enumerating it.

---

## 3. ARM V-C — SAME-PRODUCER, RE-INVOKED (`expect(f(x)).toBe(f(x))`)

**Detection rule.** Operand sources identical, and they DO contain a call.

**This one cannot be held at zero, and must not be.** Measured population: **166 sites**. The overwhelming majority are legitimate and valuable determinism/replay tests — `expect(run()).toEqual(run())` for same-seed draw sequences, `expect(JSON.stringify(generate(config, seed))).toBe(...)` for byte-for-byte replay, `expect(drive(seed,'both').hash).toBe(...)` for golden re-runs. A ratchet that convicted these would be pure noise.

**The discriminator is intent, and intent must be written down.** The three findings in this tier (V-8 arcaneIdentity, V-9 negotiationPictures, V-11 hookThemeTotality) are indistinguishable from a determinism test *by shape*. What separates them is that the author did not mean to write a determinism test — V-8 meant a no-drift pin, V-9 and V-11 meant liveness anchors. That is unrecoverable from the AST and fully recoverable from a required marker.

**Shape — mirror the negative walker exactly.** Require, on the assertion line or the line immediately above:

```js
// determinism: the only claim here is that the producer is stable for a fixed input
```

Freeze the un-annotated remainder as a **per-file exact count**, shrink-only, in the same `Object.freeze({...})` form as `FROZEN_UNANCHORED_NEGATIVES`, with the same rationale the existing header already argues for per-file over per-line ("line numbers churn under every unrelated edit"). Burn it down in a later wave; a NEW un-annotated site reds immediately.

**False-positive risk of the arm itself:** zero misses, ~91% initial annotation debt (151 of 166 are genuine determinism tests). That debt is the point — writing the marker is what would have caught V-8, V-9 and V-11 at authoring time.

---

## 4. ARM V-D — EMPTY-SUBJECT LOOP (cheap add-on to V-A)

**Detection rule.** `for (const x of C)` / `C.forEach(...)` containing an `expect`, where `C` is a `const` bound to `[]` or `Object.freeze([])` **and** the identifier is never the object of a mutating method (`push`/`unshift`/`splice`/`fill`/`sort`/`length =`), never spread, never indexed, and never passed as a call argument.

**The mutation exclusions are load-bearing, and I got this wrong before adding them.** Without them the rule fired 25 times, almost all on the `const rows = []; ...; rows.push(x); for (const r of rows)` idiom — a live collection declared empty. With them: **2 hits**, both correct, both already declared-and-mitigated in prose.

**Shape.** Population 2, both benign. Fold into V-A's scan and require the same `// vacuous-by-design:` marker naming the controls that carry the arm — which is exactly what `engineTelemetryWall.walker.test.js:224` already writes in prose. Hold at exact zero un-annotated.

---

## 5. What NOT to build

**Do not ratchet `ALL_ASSERTIONS_LOOPED`.** 1,584 tests — 62% of the corpus — place every assertion inside a loop over a corpus. That is this estate's normal and correct idiom. A ledger of 1,584 rows is a nuisance gate with no signal, and per the negative walker's own reasoning about per-line pins, it would churn constantly.

**Do not ratchet `ALL_ASSERTIONS_GATED` either.** 43 tests. Spot-checking showed the idiom is usually healthy, and the four suspects cannot be convicted without executing the suite — which means a static walker would be *exposing*, not *judging*. ⛔ Per the standing rule that an instrument which would convict a world the owner has not ruled on must EXPOSE rather than JUDGE, and with the known-failure census at 10/10 and no headroom to bank a red, this must not become a gate. **Adopt the convention instead**: the estate already has the cure written, at `tests/domain/townCartographyDefenses.test.js` — a gated assertion followed by a sibling test named *"the unwalled case is actually exercised by the corpus (anti-vacuity)"* that proves the gate is taken. Make that a documented authoring rule for new gated tests; it costs no census row.

**Do not use const-identifier inlining in the reducer.** I built it, ran it, and it is unsound for this purpose. Turning `const before = cc.institutions.length; mutate(cc); expect(cc.institutions.length).toBe(before)` into `x === x` convicts a *correct* no-mutation test. Worse, inlining `let`-bound flags convicts the whole `let fired = false; for (...) fired = true; expect(fired).toBe(false)` family. With const-inlining on: 414 hits, dominated by these two false-positive shapes. With it off: 2 hits, both true. **The arm's soundness comes from refusing to reason across statements.**

---

## 6. Recommended sequencing

| Step | Act | Census cost |
|---|---|---|
| 1 | Cure the 6 LOAD-BEARING findings (V-1, V-2, V-6, V-7, V-8, V-9) — each is a one-line edit replacing a self-reference with the frozen or bound value the test meant | none |
| 2 | Cure or delete the 3 REDUNDANT ones (V-4, V-10, V-11) and the 2 PARTIAL (V-3, V-5) | none |
| 3 | Annotate the 5 diagnostics printers and the 2 declared-empty loops | none |
| 4 | Add ARM V-B to `negativeAssertionAnchor.walker.test.js` at exact zero — the seed class is demolished, not enumerated | 1 test added to an existing file |
| 5 | Add ARM V-A + V-D at exact zero | same file |
| 6 | Add ARM V-C with the `// determinism:` marker and a shrink-only per-file frozen ledger seeded at ~166 | same file |

⚠ Steps 1-2 change no runtime behaviour and no output — these are test-side edits only. But V-6/V-7 make a previously-vacuous pin **real**, so curing them may legitimately red `rumorFallbackPhrasePools.test.js` if the mutilated anchors have already drifted. That would be a genuine finding surfacing, not a regression introduced — and per the owner-gated DEFECT-1/2/3 status noted in that file's own comment, the *repair* would be owner-gated even though the *pin* is not.
