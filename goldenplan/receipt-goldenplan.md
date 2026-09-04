# receipt-goldenplan.md — **COMPLETE** (lane GOLDENPLAN, seat Opus 5)

**STATUS: COMPLETE.** Supersedes the PARTIAL header written at lane open.
Date: 2026-09-04. Scope: **measurement and plan only.**

**What this lane did NOT do**, per its hard rules: no edit, commit, stage, rebase, push, checkout,
reset, clean, or ref write; **no test command of any kind**; no subagents; no worktree created; no
`node_modules` materialised. Writes confined to this scratch directory. Two `git merge-tree
--write-tree` calls wrote loose objects to the object database — no ref, index, or worktree was
touched, and those objects are unreferenced and GC-able.

Anchors: product `claude/composite-r4` = `ca651d54b`; golden
`refs/preserve/golden-build-2026-09-02` = `ba08939d7`; merge base = `8b07ce45f179b583c6a152412a23777cb1a15a38`.

---

## 1. The chair's measurement, re-derived independently — **CONFIRMED**

I did not take the 50/1 figures on trust. Derived from scratch:

```
$ git rev-list --count 8b07ce45f..refs/preserve/golden-build-2026-09-02   →  7
$ git rev-list --count 8b07ce45f..claude/composite-r4                     →  197
$ git diff --name-only 8b07ce45f refs/preserve/golden-build-2026-09-02 | wc -l   →  50
$ git diff --name-only 8b07ce45f claude/composite-r4 | wc -l                     →  316
$ comm -12 <golden-files> <product-files>
tests/property/generatorGoldenMaster.test.js
   → intersection count: 1
```

**CONFIRMED: seven cars, 197 behind, 50 files, exactly one file moved by both sides.** The chair's
figures are correct in every particular.

⭐ **One thing the chair's summary did not say, and it is the load-bearing fact:** the consist
touches **zero `src/` files and zero `package.json`**. Verified by
`git diff --name-only … | grep -E '^(src/|package)'` returning empty. This is what discharges the
entire `src`-scoped register surface at a stroke (receipt §5), and it is why the fear was
misplaced in a stronger sense than "only one file collides".

## 2. The collision is not a conflict — **CONFIRMED**

Two independent read-only three-way inspections:

```
$ git merge-tree --write-tree --name-only claude/composite-r4 refs/preserve/golden-build-2026-09-02
ef0f30de54d541bfe14846c8db8464d18b69190f          ← bare tree oid, exit 0, no conflict list

$ git merge-tree fdb2ea62f^ claude/composite-r4 fdb2ea62f | grep -c -E '^(<<<<<<<|>>>>>>>|=======)$'
0                                                  ← zero conflict markers
```

Git prints `changed in both` for the file and then emits a **merged** result whose hunk headers show
car 6 rebasing by a uniform +108 lines (`@@ -650` → `@@ -758`, `@@ -761` → `@@ -869`) — exactly the
length of the product's T13 doc block inserted at lines 18–131. Golden edits lines ~650/~761;
product edits lines 18–131. **~600 lines apart. Resolves mechanically. No judgment call exists here.**

This is the honest answer, and it is better than the brief anticipated: I was asked to say so even
if the answer were "one hunk needs a human decision". It is not.

⚠ **PLAUSIBLE, not confirmed:** that a `git rebase` (rather than a merge) is equally clean. I could
not simulate the sequential replay — Apple Git 2.39.5 lacks `merge-tree --merge-base`, so a true
per-step simulation was unavailable. The inference is strong: only one of the seven commits touches
the shared file, and its hunks are textually disjoint from the product's. Basis stated; not executed.

## 3. Supersession — **7 of 7 STILL NEEDED, 0 SUPERSEDED** — CONFIRMED

The brief called this the highest-value part, and it is the part where a null result is most
dangerous — a broken probe and a genuine absence look identical. So every probe carries a **positive
control**. All six added paths are ABSENT on the product tip; `recordGolden` 0 hits on product
against **45** on golden; `goldenRecordDoor` 0 against **48**; `dormancy-bit-compare` 0 against **1**.
`tests/helpers/dormancyOracle.js` on the product tip is blob `116e410b7…`, **byte-identical to the
merge base**, so car 4's bit arm has no other road. A name-shape sweep for an equivalent arriving
under a different name (`recorddoor|freeze-register|shift-record|…`) returned nothing.

⭐ **The finding that inverts the framing:** the product does not merely lack this work, it is
**already written against it**. `tests/lint/tuningRegister.walker.test.js` on the product tip
carries live references to `docs/shift-records/` and `tests/fixtures/.golden-freeze-register.json`
— artifacts only this consist supplies. Landing is convergent, not additive.

I then traced whether those forward references are land-safe rather than leaving it as an open
risk. **All three arms are safe, by reading the branch conditions against the known shipped
filenames:** the records-dir arm skips non-`.json` and leading-`_` entries, and car 7 ships exactly
`README.md` and `_TEMPLATE.json` — both skipped; the `frozenAt` arm asserts `toBeFalsy()` and car 1
lands `frozenAt: null`. Labelled **CONFIRMED-by-source-reading**, not by execution.

## 4. `commitTrailerRefusal` — **DOES NOT BLOCK. R11 is a misgrade.** — CONFIRMED

Lives at `tests/helpers/goldenRecordDoor.js:210`, golden tip only, absent from product. Exactly
four references exist, all inside the consist (definition, walker import, two walker assertions).
Zero non-test callers — so "unwired" is factually accurate and normatively wrong, because the
design says so in two places:

> ⚠ NO GIT HOOK IS INSTALLED BY THIS LANE, and that is deliberate rather than unfinished.
> — `goldenRecordDoor.js`, above the function

> …the load-bearing half of the freeze lives here and the commit-trailer backstop is **merely
> advisory.** — `goldenFreeze.walker.test.js:17–21`

Nothing in the register, door, or walker gates the freeze on a caller existing; the freeze act is
gated on the tri-state `frozenAt`/`frozenAtSha`/`genesis` closure. If it stays unwired, a re-record
commit can lack an `Owner-Signed:` trailer — but the door still refuses without a parsed signed
record, and the walker still convicts on every gate run. **The claim that "the GOLDEN freeze's own
pre-flight requires it" is not supported by anything in the tree.**

## 5. Register movements — predicted in writing, with refusals

**MOVES (both owed at landing; the consist carries neither cure):**
- **Lighting census** — `files` **2510 → 2511**. `parked`/`credited`/`titles`/`suiteTitles`:
  **I REFUSE TO NAME THESE.** They are not arithmetic on 84 arms, and the baseline's own `_doc`
  forbids hand-editing the five figures. Regenerate via `LIGHTING_CENSUS_REFREEZE`.
- **`mutationCoverageManifest` TOTALITY** — owes one entry for `tests/lint/goldenFreeze.walker.test.js`
  (matches enforcer dir `tests/lint` **and** NAME_PATTERN `walker`/`golden`). `uncovered` refused
  twice; `uncoveredBaseline` **186**. Cure: a `rationale` ≥40 chars.

**DOES NOT MOVE** — all traced to a scan root, all because the consist touches no `src/`:
`sizeBaseline` (8 entries, all `src/`) · writer-reach (`src/domain/worldPulse` + `src/components`) ·
prose numerics · observed-shape/OSR (subject tree `src/`; `scannerToolFiles()` is a fixed list that
does **not** include `scripts/dormancy-bit-compare.mjs`) · dossier mounts (`src/components`) ·
test-ratchet totals (collapse **floors**, not exact pins) · docs enforcement-claims (**I ran the
live `CLAIM_RE` against the new README: zero hits**) · all three golden-register floors
(`toBeGreaterThanOrEqual`) · the `unresolvedRoster` arm (dormancy roster unchanged: 32 suites /
27 fixtures at both tips).

**`negativeAssertionAnchor`: NOT owed** — generation-root scoped. ⚠ Carried from memory, not
re-executed.

## 6. ⛔ THE BLOCKER NOBODY WAS LOOKING FOR — CONFIRMED

The docket's blocker (`commitTrailerRefusal`) is a phantom. **A real one exists and had not been
found.**

Car 2's walker enumerates by `GOLDEN_ENV_PATTERN = /^UPDATE_[A-Z_]+$/` over the **whole** `tests/`
tree. In the 197 intervening commits, `0fdbc53a0` (lane REGISTRY) minted
`process.env.UPDATE_MOUNT_BASELINE` in `tests/lint/dossierMountRegistry.walker.test.js:74`. It is
in neither the 43 enrolled `recordEnv` values nor the 7 `excludedEnvSpellings`. It is a genuine
module-scope `MemberExpression`, so the AST enumerator sees it. **Arm 2 — "every golden-adjacent
env spelling in tests is enrolled or written-excluded" — reds on landing.**

Method note: the census that found it reproduces the register's own measured figures at the base
**exactly** (`UPDATE_GOLDEN = 40`, 43 env-bearing carriers). That agreement is the positive control
that makes the one new spelling a real finding rather than a scan artifact.

⚠ This is not optional to cure. The known-failure census is **FULL at 10 entries** (verified in
`scripts/.test-ratchet-baseline.json`) and `check-test-ratchet.mjs` states *"A NEW REGRESSION IS
NEVER BASELINED."* There is no lawful disposition for an 11th red. Cure = one `excludedEnvSpellings`
entry (JSON in landing-plan.md §2), folded into car 1. **Chair act** — an exclusion is an
affirmative disposition and protection-only-grows is chair-signed; no measured field is touched.

## 7. False-report hygiene

Two moments in this lane produced output that could have become a false finding, and neither did:

1. A `git grep … | head -20 || echo "(no hits)"` construction: the `||` bound to `head`, which
   always exits 0, so the fallback never fired. Per the standing law (**a fallback branch must never
   print a finding**) I discarded it and re-ran with captured counts and a golden-tip positive
   control. **No claim in this receipt rests on the discarded form.**
2. A `/` in `claude/composite-r4` broke an output path, and `join` printed a column of `MISSING`
   against every spelling. That was a file-not-found artifact, **not** a measurement. I named it as
   such in-turn and re-ran with a sanitised tag. No conclusion was drawn from it.

Also corrected: an older note records **seven** enforcer dirs; the live
`mutationCoverage.shared.mjs` has **eight** (`tests/generators` added). The plan uses the live list.

## 8. Answers to the four questions asked

| question | answer |
|---|---|
| still needed vs superseded | **7 needed, 0 superseded** |
| what the colliding file conflicts on | **Nothing.** File-level overlap only; edits ~600 lines apart; merges clean with zero conflict markers |
| does `commitTrailerRefusal` block | **No.** Advisory by documented design; R11 should be regraded |
| recommended order | **1 → 3 → 6 → 4 → 7 → 5 → 2**, the existing chain — car 2 is last because it reads what all six others create |

---

# RETROVALIDATION ROW

**What I judged (delegated authority, all vetoable):**

1. **R11 `commitTrailerRefusal` is NOT a landing blocker and should be regraded HIGH → INFO/ACCEPTED.**
   Basis: two explicit design statements in the consist's own source. This overturns a standing
   HIGH finding, so it is the entry most deserving a veto look.
2. **`UPDATE_MOUNT_BASELINE` should be cured by EXCLUSION, not enrolment.** Basis: it governs a
   mount-registry ratchet over `src/components`, not a same-seed world fingerprint — the same class
   as two already-excluded spellings. Chair-level, not owner-gated. A reviewer could reasonably rule
   it belongs in `unresolvedRoster` for the freeze act instead; I judged that over-formal for a
   spelling whose nature is unambiguous.
3. **The census bill should be one commit landing on top, not folded into car 2.** Basis: the
   lighting refreeze must be measured on the post-landing tree, so it cannot exist inside the
   commit that changes that tree.
4. **The §2 cure should be amended into car 1** rather than appended, so no commit in the consist is
   ever red in isolation.
5. **I declined to create a throwaway worktree**, though permitted. Read-only inspection answered
   every question, and a gate may be running.

**What a reviewer re-derives (highest value first):**

1. **The blocker.** `git grep -n -F 'UPDATE_MOUNT_BASELINE' claude/composite-r4`, then check it
   against `excludedEnvSpellings` and the 43 `recordEnv` values in the register, then read
   `goldenFreeze.walker.test.js:98` and the arm at ~line 417. **This is the finding that changes
   the landing.**
2. **The non-conflict.** `git merge-tree fdb2ea62f^ claude/composite-r4 fdb2ea62f` and count
   conflict markers.
3. **The supersession nulls** — re-run the symbol census on **both** tips; the golden-tip column is
   the control.
4. **R11's regrade** — read `goldenRecordDoor.js:198–214` and `goldenFreeze.walker.test.js:17–21`.
5. **The census-bill scope** — confirm the eight enforcer dirs and `NAME_PATTERN` in
   `tests/lint/mutationCoverage.shared.mjs`.

**Receipts by path (all repo-relative to `/Users/cstokes/Desktop/settlement-engine`):**

- `tests/fixtures/.golden-freeze-register.json` — car 1; 48 surfaces, `frozenAt: null`, 7 exclusions, inventory `measuredAtSha 8b07ce45f`
- `tests/helpers/goldenRecordDoor.js` — car 3; `commitTrailerRefusal` at **:210**, its "deliberate, not unfinished" docblock at **:198–214**
- `tests/lint/goldenFreeze.walker.test.js` — car 2; pattern **:98**, tree walk **:112**, arm 2 **~:417**, floors **~:563–580**, "merely advisory" **:17–21**
- `tests/property/generatorGoldenMaster.test.js` — the sole shared file; product block **:18–131**, golden edits **~:650, ~:761**
- `tests/lint/dossierMountRegistry.walker.test.js:74` — **the blocker's site**
- `tests/lint/tuningRegister.walker.test.js` — the product's forward references, **:904 / :930 / :1065**; all traced land-safe
- `tests/lint/.lighting-census-baseline.json` — `files 2510 · parked 370 · credited 2140 · titles 22841 · suiteTitles 6142` @ `53fd36d2c`
- `scripts/.test-ratchet-baseline.json` — **entries: 10** (the full census), `totalTests 31141`, `totalFiles 2458`, `skippedCeiling 1`
- `scripts/mutation-coverage-manifest.json` — `invariants 656`, `rationales 41`, `uncoveredBaseline 186`
- `tests/lint/mutationCoverage.shared.mjs:36–49` — the **eight** enforcer dirs and `NAME_PATTERN`
- `scripts/.size-baseline.json` — 8 entries, **all `src/`** ⇒ untouched by this consist

**Scratch artifacts:** `cars.md`, `landing-plan.md`, `car6-mergetree.txt` (the 51 KB merge output),
`golden-files.txt`, `product-files.txt`, `env-census-8b07ce45f.txt`, `env-census-PRODUCT.txt`.

**Priority for the chair:**
**P0** — apply the `UPDATE_MOUNT_BASELINE` exclusion; without it the landing reds a full census.
**P1** — regrade R11 and stop treating it as a blocker.
**P2** — land in the built order with the census bill on top.
**P3** — before landing, re-run the env census if the product tip has moved past `ca651d54b`; that
one command is what caught the real blocker and is the cheapest guard against the next one.
