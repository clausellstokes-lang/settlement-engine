# SEALED — lane VACUITY receipt

- Lane: VACUITY — assertions that cannot fail
- Seat: Opus 5
- Read tree: `/private/tmp/claude-502/.../58f0a8e2-.../scratchpad/laneKERNELMARK-tree`
- HEAD at read: `1223489c939667c5bfde083ae60b4431b9f05b20` — CONFIRMED via `git rev-parse HEAD`
- ⚠ **HEAD MOVED MID-LANE** to `c2f80ffc957a15ab18e756e0aae2b56ceb78fc9c` (`§891 cure: the capsule battery's runtime-tests fixture stops being a green with an expiry date`) while the scan was running — a shared tree, another writer. Checked rather than assumed: the commit touches **one** file, `tests/scripts/baseStateCapsule.test.js`, and **none of the 11 finding files**. The denominator is still 2,567 at the new HEAD, and all 11 findings were **re-read verbatim at `c2f80ffc9`** — every line number and quote in this report is valid at both shas. The one changed file produced no findings in the scan; note its commit message describes curing a green with an expiry date, which is an adjacent class.
- Constraints honoured: measurement-only (no edit, delete, commit or stage); no vitest / npm test / npm run check / npm run build / any test command; no subagents; no `node_modules` materialisation; writes confined to this scratch directory.

---

## 1. Coverage denominator

| Quantity | Value | How measured |
|---|---|---|
| Test/spec files tracked at HEAD | **2,567** | `git ls-files \| grep -E '\.(test\|spec)\.[jt]sx?$'` |
| Files parsed and scanned | **2,567 (100%)** | scanner reports `scanned: 2567, parseFails: 0` |
| Parse failures | **0** | — |

Breakdown by extension: 2,145 `.test.js` · 370 `.test.jsx` · 43 `.test.ts` · 9 `.spec.js`.
Largest trees: `tests/domain` 898 · `tests/components` 244 · `tests/lib` 160 · `tests/ui` 151 · `tests/security` 143 · `tests/store` 141 · `tests/lint` 137.

**The denominator is the whole corpus, not a sample.** Every tracked test file was parsed to an AST and every `expect(...)` chain in it was examined.

---

## 2. Method

I parsed rather than grepped. `@babel/parser` 7.29.8 (present in the tree's `node_modules`, required by absolute path — nothing materialised) handled `.js`, `.jsx` and `.ts` uniformly. Scanner at `scan.js` in this directory; raw output at `sound.json`.

Detectors, one per bullet of the brief:

1. **SELF_COMPARE_DIRECT** — `expect(A).toBe/toEqual/toStrictEqual(B)` where `A` and `B` have identical whitespace-normalised source.
2. **SELF_COMPARE_REDUCED** — the seed class. A reduction engine rewrites each operand by (a) inlining file-local single-expression arrow helpers and single-`return` function declarations, substituting argument sources for parameter identifiers at AST level; (b) folding `[a, ...b][K]` to element `K` when all elements up to `K` are non-spread; iterated to a fixed point. Flags when both operands reduce to the same source.
3. **EMPTY_LOOP / EMPTY_ITERATION / EMPTY_EACH** — loops and `it.each` over a provably-empty frozen literal.
4. **TRIVIAL_TRUTHY** — `toBeDefined`/`toBeTruthy`/`toBeInstanceOf` on a binding that is a literal or `new` expression.
5. **SWALLOWING_CATCH** — a `try` containing an `expect` whose `catch` neither rethrows nor asserts.
6. **UNAWAITED_ASYNC_MATCHER** — `expect(p).rejects/.resolves` neither awaited nor returned.
7. **IT_WITHOUT_ASSERTION** — an `it`/`test` body with no assertion vocabulary, after transitively resolving file-local assertion helpers.
8. **ALL_ASSERTIONS_GATED / ALL_ASSERTIONS_LOOPED** — every `expect` in the test sits inside an `if` (or inside a loop), so an unsatisfied gate or empty subject asserts nothing.

**Validation before use.** Run on the seed file alone, the scanner rediscovered lines 228 and 338 and nothing else — the reduction engine finds the known class without being told where it is.

**Two detector soundness bugs I found and fixed mid-lane**, both of which had been manufacturing false findings:
- The reducer inlined *any* `VariableDeclarator`, including `let`. That convicted the entire `let fired = false; for (...) fired = true; expect(fired).toBe(false)` family — live assertions, every one. Fixed by restricting to `const` and excluding any name ever reassigned or `++`'d.
- Const-identifier inlining reasons **across statements**, which is exactly what no-mutation tests are testing: `const before = cc.institutions.length; ...; expect(cc.institutions.length).toBe(before)` reduced to `x === x` and was convicted, wrongly. I split the scan into a **sound pass** (helper-inline + index-fold only, both intra-expression, no cross-statement assumption) and a **loose pass** (const-inlining on). The sound pass is what the findings rest on. Loose: 414 hits, dominated by these two false shapes. Sound: **2 hits, both true**.

The `EMPTY_LOOP`, `TRIVIAL_TRUTHY`, `IT_WITHOUT_ASSERTION` and `UNAWAITED_ASYNC_MATCHER` detectors each needed a similar tightening pass before their output was worth reading — the raw counts (25, 16, 141, 4) fell to (2, 1, 12, 0) once the estate's real idioms were accounted for, and every one of the remainder was then hand-read.

**Every hit reported below was hand-verified by reading the surrounding source.** Nothing is asserted on the scanner's word.

---

## 3. Results, by detector

| Detector | Raw hits | After hand-verification | Note |
|---|---|---|---|
| SELF_COMPARE_DIRECT | 175 | **9 defects + 5 by-design** | 151 are legitimate determinism/replay tests; 10 more were read and cleared |
| SELF_COMPARE_REDUCED (sound) | 2 | **2 defects** | both are the seeds; nothing else in the estate has this shape |
| EMPTY_LOOP | 2 | 0 defects | both declared-and-mitigated in prose |
| TRIVIAL_TRUTHY | 1 | **1 defect** (counted in the 9 above) | |
| IT_WITHOUT_ASSERTION | 12 | **0** | all explained — see §5 |
| UNAWAITED_ASYNC_MATCHER | 0 | **0** | |
| SWALLOWING_CATCH | 0 | **0** | |
| EMPTY_ITERATION / EMPTY_EACH | 0 | **0** | |
| ALL_ASSERTIONS_GATED | 43 | 4 SUSPECTED | not confirmable without running the suite |
| ALL_ASSERTIONS_LOOPED | 1,584 | 0 | the estate's normal corpus idiom |

**Total: 11 CONFIRMED vacuous assertions**, of which **6 leave a stated claim with no other guard in the file**.

Full detail, with verbatim quotes and the concrete broken-code scenario each one survives, is in `vacuous-assertions.md`. Summary:

| # | Site | Severity |
|---|---|---|
| V-1 | `tests/domain/magicSubstitutionReagents.test.js:301` | LOAD-BEARING |
| V-2 | `tests/domain/sovereigntyMarketStageWr10w.test.js:251` | LOAD-BEARING |
| V-3 | `tests/domain/npcVerdictApply.test.js:468` | PARTIAL |
| V-4 | `tests/domain/settlementMigrations.test.js:165` | REDUNDANT |
| V-5 | `tests/domain/treatyRenewalMemory.test.js:283` | PARTIAL |
| V-6 | `tests/domain/rumorFallbackPhrasePools.test.js:228` (SEED) | LOAD-BEARING |
| V-7 | `tests/domain/rumorFallbackPhrasePools.test.js:338` (SEED) | LOAD-BEARING |
| V-8 | `tests/domain/arcaneIdentity.test.js:282` | LOAD-BEARING |
| V-9 | `tests/domain/negotiationPictures.test.js:377` | LOAD-BEARING |
| V-10 | `tests/domain/brokerageServices.test.js:428` | REDUNDANT |
| V-11 | `tests/lint/hookThemeTotality.walker.test.js:145` | REDUNDANT |

---

## 4. CONFIRMED claims (executed evidence, quoted)

**C1 — Both seed sites exist as described.** CONFIRMED by `grep -n`:
```
228:      expect(livePool(kind)[0], `${kind}: index 0 must remain the mutilated slug`).toBe(whatPhrase(kind));
338:      expect(whatPhrase(kind), `${kind} drifted on the seedless path`).toBe(livePool(kind)[0]);
129:const livePool = (kind) => [whatPhrase(kind), ...(FALLBACK_PHRASE_POOLS[kind] || [])];
```
Both reduce to `whatPhrase(kind)` on both sides. Line 228 sits in `it('each mutilated anchor is still the live computed string, unrepaired')`; line 338 in `describe('THE STRICT NO-OP — a seedless call is byte-identical to before the wiring')`.

**C2 — Coverage is 2,567 of 2,567, zero parse failures.** CONFIRMED: scanner emits `scanned 2567 fails 0`.

**C3 — The helper-mediated self-comparison class has exactly two members corpus-wide.** CONFIRMED: the sound pass over all 2,567 files returns 2 `SELF_COMPARE_REDUCED` hits, both in `rumorFallbackPhrasePools.test.js`.

**C4 — Nine same-source self-comparisons with no re-invocation exist; five are honest diagnostics.** CONFIRMED by enumeration; all nine read by hand.

**C5 — No test in the corpus asserts nothing.** CONFIRMED. All 12 `IT_WITHOUT_ASSERTION` survivors were read and explained (§5). This is a clean negative result.

**C6 — No `try/catch` in the corpus swallows an assertion.** CONFIRMED: `SWALLOWING_CATCH` = 0 across 2,567 files.

**C7 — No un-awaited `rejects`/`resolves` exists.** CONFIRMED. The four raw hits are the deliberate fake-timer idiom; e.g. `tests/lib/aiStreamCompletionGuards.test.js:69-71`:
```js
const assertion = expect(p).rejects.toThrow(/empty response|retry/i);
await vi.advanceTimersByTimeAsync(10);
await assertion;
```
The promise is observed one statement later.

**C8 — An AST-based walker needs no `package.json` change.** CONFIRMED: `espree ^11.2.0` and `acorn ^8.16.0` are declared devDependencies; four existing lint walkers already `import { parse }` from one of them.

**C9 — espree covers 2,525 of 2,567 test files; all 42 failures are `.ts`.** CONFIRMED by executing an espree parse over the full file list.

## 4b. PLAUSIBLE claims (reasoning only, not executed)

**P1** — The four SUSPECTED gated assertions are vacuous *if* their gates are never taken. Confirming that requires running the suites, which this lane is forbidden to do. Listed as SUSPECTED, not confirmed.

**P2** — Adding a `describe`/`test` to an existing lint walker file does not move a test-count census. Reasoned from "a NEW FILE reds three censuses", not measured. The implementing lane must verify.

**P3** — Curing V-6/V-7 may legitimately red `rumorFallbackPhrasePools.test.js` if the mutilated anchors have already drifted. That would be a real finding surfacing, not a regression — but it is a prediction, not a measurement.

---

## 5. Every dismissed hit, explained (so the negatives are receipted, not assumed)

- **151 of 175 direct self-compares** are determinism/replay tests whose stated claim IS determinism (`'same seed ⇒ same draw sequence'`, `'replays hash-for-hash on a second pass'`, `'replays one complete specimen from every profile byte-for-byte'`). Real tests; a nondeterministic producer reds them.
- **10 further direct self-compares** were read individually and cleared, including `fidelityNoise.test.js:96` (inline comment declares the determinism intent, and the title's claim is carried by the preceding `expect(plausibleTicks).toBeGreaterThan(0)`), `eventProse.test.js:232` (redundant restatement of a real pin one line above), `anticipatedReactions.test.js:98` and `soakScriptSeams.test.js:224` (genuine reference-identity claims), `normalizeSettlementContentId.test.js:63` and `deityRefCollision.test.js:121` (structurally-equal inputs → same id, which is the stated claim), `paradigmAxisCatalog.test.js:148` (`not.toBe` on two calls — a real freshness test).
- **12 `IT_WITHOUT_ASSERTION` survivors**: 8 are `test.beforeEach` blocks in Playwright e2e specs, not tests at all (receipted: `sed -n '72p' e2e/flow-a-generate-save-export.spec.js` → `test.beforeEach(async ({ page }) => {`). Two use `mustExtract`, imported cross-file from `tests/helpers/sourceContract.js:37` so the transitive local-helper resolution could not see it. One uses `expect.soft(...)`. One uses testing-library `await screen.findByText(...)`, which throws when absent.
- **Earlier `TRIVIAL_TRUTHY` and `EMPTY_LOOP` raw hits** were detector artefacts, not findings: `[...querySelectorAll(...)].find(...)` genuinely can be `undefined`, and `const rows = []; rows.push(x); for (const r of rows)` is a live collection. Both detectors were tightened and re-run; the survivors were then read.

---

## 6. RETROVALIDATION ROW

**What I judged.**
1. That the vacuity class is real and small: **11 confirmed instances across 2,567 files**, not a pervasive rot. I decided against inflating the count with the 151 determinism tests and the 1,584 looped-assertion tests, because neither can be shown to survive a concrete broken-code scenario.
2. That **"cannot fail" has two grades**, and conflating them would mislead: same-binding (`x === x`, unfalsifiable under any code change) versus same-producer (falsifiable only by nondeterminism). I graded them separately and admitted the seeds are the second grade, not the first — while holding that they are still findings, because the claims their tests state are untested either way.
3. That a finding requires a **stated scenario in which the code is broken and the assertion passes**. Four gated assertions I believe are vacuous went to SUSPECTED because confirming them needs execution, which this lane is forbidden.
4. That **two of my own detectors were unsound** and their output had to be discarded rather than reported. I ran the loose pass anyway and kept both numbers so the discard is auditable.
5. That the cure should **extend `negativeAssertionAnchor.walker.test.js`** rather than mint a file, and that two of the five sub-classes should **not** be built at all.
6. That `ALL_ASSERTIONS_GATED` must **expose, not judge** — the known-failure census is at 10/10 with no headroom, and a static walker cannot convict these without execution.

**What a reviewer re-derives, and how.**
- Re-run the scanner: `SF_TREE=<tree> node scan.js "$SF_TREE" filelist.txt`. Expect `scanned 2567 fails 0` and the counts in §3. Read-only; runs in ~20s; **runs no test command**.
- Flip the unsound pass back on with `VAC_INLINE_CONSTS=1` and confirm it produces 414 hits dominated by `let`-flag and pre-mutation-snapshot shapes — the reason it was discarded.
- Spot-check any finding by opening the file at the quoted line; every quote in `vacuous-assertions.md` is verbatim from the tree at HEAD `1223489c9`.
- Falsify V-9 (the strongest finding) in one step: note that `JSON.stringify(null) === 'null'`, so `negotiationPictures.test.js:377` passes when `materializeCarriedTermSheet` returns null for every input — which is precisely the "dead function" the three `toBeNull()` assertions above it need excluded.

**Receipts by path.**
- `…/scratchpad/vacuity/receipt-vacuity.md` — this file
- `…/scratchpad/vacuity/vacuous-assertions.md` — one row per finding, verbatim quote, broken-code scenario, severity
- `…/scratchpad/vacuity/habitat-cure.md` — the walker proposal, detection rules, false-positive measurements, host file and feasibility receipts
- `…/scratchpad/vacuity/scan.js` — the scanner (read-only; parses, never executes, the corpus)
- `…/scratchpad/vacuity/sound.json` — full results of the sound pass
- `…/scratchpad/vacuity/loose.json` — the discarded unsound pass, kept so the discard is auditable
- `…/scratchpad/vacuity/filelist.txt` — the 2,567-file denominator

**Priority.**
1. **V-9** `negotiationPictures.test.js:377` — a liveness anchor that passes on `'null' === 'null'`, guarding three `toBeNull()` assertions. Highest: it fails in the exact scenario it exists to exclude.
2. **V-6 / V-7** `rumorFallbackPhrasePools.test.js:228, 338` — the owner-gated DEFECT-1/2/3 deferral pin and the STRICT NO-OP byte-identity claim, neither pinned. Note the *repair* of the mutilated anchors stays owner-gated; only the *pin* is a lane act.
3. **V-8** `arcaneIdentity.test.js:282` — a NO-DRIFT pin that cannot detect drift, in a file whose sibling test at line 270 shows the correct form.
4. **V-1 / V-2** — two independent no-write/dormancy identity arms, both dead, both left relying on the subject's own `changed` self-report.
5. **ARM V-B** (habitat-cure §2) — born at exact zero, no frozen ledger, demolishes the seed class rather than enumerating it. Cheapest durable win in the report.
6. **V-3, V-5** (partial), then **V-4, V-10, V-11** (redundant), then the annotation of the 5 by-design diagnostics and 2 declared-empty loops.
