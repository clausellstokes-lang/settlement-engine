# TOOL-2 — the dist-gated silent skip: MEASURED, then PROPOSED. Nothing built.

Lane `TOOL-A`, base `58fcfe614`. Measured 2026-09-19. **No edit was made for TOOL-2.**

---

## 1 · The measurement

### 1.1 · Every dist-gated suite (CONFIRMED — `node` scan of the stripped-of-comments source)

29 files under `tests/` carry a dist or `VERIFY_DIST` gate; **246 tests live in them**.

| | count |
|---|---:|
| files carrying a dist / `VERIFY_DIST` gate | **29** (28 in `tests/build/`, 1 is `tests/lint/testRatchet.test.js`, which only *describes* the mechanism) |
| `describe.*If(<dist gate>)` suites | **27** |
| tests inside those suites | **76** |
| per-test `it.skipIf(<dist gate>)` | **41** |
| **tests that do not run in a focused run with no `dist/` and no `VERIFY_DIST`** | **≈117** (76 + 41; per-test gates counted once) |
| files WITH an ungated anti-vacuity guard | **9** |
| files WITHOUT one | **20** |

Per-file table (tests / gated describes / tests inside them / per-test gates / anti-vacuity):
`archKernelLazy 5/1/2/1/YES` · `bootSmoke 9/2/2/0/YES` · `campaignRuntimeLazy 10/1/3/0/YES` ·
`cultureProfilesLazy 5/1/2/1/NO` · `customContentPreviewLazy 3/1/2/1/NO` ·
`customRegistryLazy 11/1/6/4/NO` · `engineChunkLazy 15/2/7/1/YES` ·
`envoyPersistenceHydrationLazy 5/1/2/0/YES` · `factionRenameDoorLazy 3/1/3/2/NO` ·
`firstPaintNonJs 8/1/8/3/NO` · `gatheredAdjudicationLazy 7/1/3/2/NO` ·
`generationWorkerLazy 11/1/5/0/YES` · `heraldRegisterDoorsLazy 6/1/3/2/NO` ·
`heraldWanderersLazy 7/1/3/2/NO` · `iconChunkSplit 3/0/0/1/NO` · `interiorLazy 1/1/1/0/NO` ·
`loadingJourneyLazy 2/2/2/0/YES` · `metaShell 19/0/0/1/NO` · `pendingEditProseLazy 2/1/2/1/NO` ·
`prerenderRoutes 12/0/0/5/NO` · `previewPersonaAbsent 3/0/0/2/YES` · `sourcemapAbsence 5/1/2/2/NO` ·
`surveyorPanelsLazy 4/1/2/1/NO` · `tableClerkLazy 10/1/2/1/YES` · `townMapLazy 3/1/3/1/NO` ·
`userRouteIdentityLeaf 8/1/3/2/NO` · `vendorPdfLazy 24/1/5/3/NO` · `versionDiffLazy 3/1/3/2/NO`.

**`firstPaintNonJs.test.js` is the worst case: all 8 of its tests are inside the gated suite and
it has NO anti-vacuity guard — a focused run with no `dist/` executes zero of its assertions.**

### 1.2 · The helpers that compute the gate — THREE spellings, not one (CONFIRMED)

| spelling | occurrences | behaviour with no `dist/` |
|---|---:|---|
| `describe.runIf(distExists)` | 20 | suite skipped |
| `describe.runIf(DIST_EXISTS)` | 2 | suite skipped |
| `describe.runIf(REQUIRE_DIST && DIST_EXISTS)` | 2 | suite skipped **even when `dist/` exists**, unless `VERIFY_DIST=1` |
| `describe.runIf(requireDist)` | 3 | skipped unless `VERIFY_DIST=1` |
| `it.skipIf(!requireDistRead)` / `!requireDist` / `!REQUIRE_DIST` / `!process.env.VERIFY_DIST` | 21 | test skipped |
| `it.skipIf(!requireDistRead \|\| !distExists)` | 1 | test skipped |

The gate value itself is always local, never shared:
`const distExists = existsSync(distDir) && existsSync(assetsDir)` (most files) or
`existsSync(join(DIST,'index.html')) && existsSync(ASSETS)` (`campaignRuntimeLazy`,
`envoyPersistenceHydrationLazy`). **There is no shared helper** — 29 independent re-spellings,
which is itself why a cure in one file cannot fix the class.

### 1.3 · Where `npm run check` meets these files (CONFIRMED — read from `package.json` and `scripts/check-test-ratchet.mjs`)

`npm run check` is a 17-step `&&` chain. Steps 15-17 are the relevant ones:

```
15 npm run test:ratchet     → node scripts/check-test-ratchet.mjs           (SOURCE phase)
16 npm run build
17 npm run verify:dist      → node scripts/check-test-ratchet.mjs --verify-dist  (STRICT phase)
```

- **The SOURCE phase EXCLUDES the whole corpus.** `SOURCE_TEST_EXCLUDE = 'tests/build/**'`
  (`:137`) and `runnerCommandOf` (`:194-198`) runs
  `npx vitest run --exclude="tests/build/**" …`. It goes further: `:1020-1029` FAILS the
  ratchet if any `tests/build/**` file appears in the source report at all
  ("SOURCE PHASE included tests/build/** even though that corpus belongs exclusively to
  strict post-build verification"). ⇒ **the unit step never meets a dist-gated file, before
  or after the build.**
- **`verify:dist` sets `VERIFY_DIST=1`** (`:961`) and runs `npx vitest run tests/build/`
  (`:196`). Its strict arm (`:1112-1177`) requires `report.success === true`, every discovered
  `tests/build/**` file present exactly once, no suite whose status is not `passed`, and zero
  uncollected suites. ⇒ **CI and the landing gate are already sound. The hole is not there.**

⇒ **The hazard's entire blast radius is a LANE's hand-written focused run**, which is the one
invocation the brief mandates (`npx vitest run --pool=threads --maxWorkers=2 <explicit files>`).
A lane that names `tests/build/firstPaintNonJs.test.js` with no `dist/` gets exit 0.

### 1.4 · What a focused run prints today — PLAUSIBLE, and the experiment that settles it

`dist/` does not exist in this worktree (`ls -d dist` → `No such file or directory`), so a
focused run on a gated file would report every gated suite as skipped and exit 0. Vitest 4.1.8
prints the file as `↓ … (N tests | N skipped)` with a `Tests  N skipped (N)` summary line.
**This is PLAUSIBLE — reasoned from `describe.runIf` semantics and the reporter, not executed.**
It is the one measurement I could not make without the gate. The command that settles it is in
`TOOL-A.lane-resume.md` and runs in my gated window; it is a read-only observation, not a cure.

⛔ **Why the existing "count line" law does not close this.** The brief's law is "a gate line
with no printed test count DID NOT RUN". A skipped run **does** print a count line. A lane
copying `Tests  3 skipped (3)` into a receipt has satisfied the letter of the law while
proving nothing — which is precisely the shape TOOL-2 was chartered against.

### 1.5 · What the 9 existing anti-vacuity guards actually do (CONFIRMED)

They are ungated `it`s of this shape (`loadingJourneyLazy.test.js:72-74`):

```js
it('dist/ + dist/assets exist when VERIFY_DIST=1 (a skipped post-build contract is green-on-nothing)', () => {
  expect(distExists, 'VERIFY_DIST=1 but dist/assets is absent — run `npm run build` first').toBe(true);
});
```

Some are unconditional like that one; others short-circuit (`!REQUIRE_DIST || DIST_EXISTS` in
`generationWorkerLazy:340-344`; `previewPersonaAbsent:75-80` asserts `true` and says
"unset VERIFY_DIST — the gated arms below are skipped by design"). **Every one of them is
about `verify:dist`. None of them fires for a lane's focused run, which is the case with no
`VERIFY_DIST` at all.** So the estate already has the RIGHT instinct in 9 files and it points
at the wrong threat.

---

## 2 · The proposal — two candidate shapes

Both satisfy the charter's three conditions. Neither changes a `package.json` byte.

### ⭐ SHAPE B (RECOMMENDED) — one shared setup file, zero per-file edits

**The discriminator, and why it is exact.** The source phase *excludes* `tests/build/**`
(§1.3). Therefore **any vitest process that collects a `tests/build/**` file is either
`verify:dist` (which sets `VERIFY_DIST=1`) or a hand-written focused run.** That is a total,
measured partition — no heuristic, no "was I named explicitly" guesswork.

```
tests/setup/distGateHonesty.js   (NEW, ~25 effective lines)
vite.config.js                   (MODIFY, +1 effective line: a second setupFiles entry)
```

A `beforeAll` registered in a setup file runs once per collected test file. It reads
`expect.getState().testPath` (**CONFIRMED present: `testPath?: string` in
`node_modules/@vitest/expect/dist/index.d.ts:150`**), and:

1. returns immediately unless the path is under `tests/build/`;
2. returns immediately when `process.env.VERIFY_DIST === '1'` — `verify:dist` owns this corpus
   and already has a strict arm;
3. returns immediately when `dist/` **and** `dist/assets` exist — the lane built, the arms run;
4. otherwise **throws**, which fails the whole file with a real red and a real count line
   naming `dist`, the file, and `npm run build`.

**Costs, each measured:**

| cost | value |
|---|---|
| `package.json` bytes | **ZERO** — the entry is in `vite.config.js` |
| lighting census | **ZERO move.** `TEST_FILES` filters `/\.test\.(js\|jsx)$/` (`sovereigntyLightingContract.walker.test.js:515-516`); a `tests/setup/*.js` file is invisible to it |
| mutation-coverage row | **NOT OWED.** `ENFORCER_DIRS` (`tests/lint`, `design`, `docs`, `data`, `copy`, `security`, `edgeFunctions`, `generators`) excludes `tests/setup`, and the manifest enumerates `*.test.js`/`*.test.jsx` only |
| `vite.config.js` pins | **none touched.** The only thing any test reads out of that file's `test` block is `testTimeout` (`tests/lint/testRatchet.test.js:2782-2868`); nothing in `tests/` or `scripts/` mentions `setupFiles` except the existing setup file itself. `vite.config.js` is not on the hot-file list and has no `scripts/.size-baseline.json` entry |
| runtime | one `String.includes` per collected file; one `existsSync` pair only for `tests/build/**` files |
| `npm run check` | **unaffected** — step 15 never collects the corpus, step 17 sets `VERIFY_DIST=1` |
| CI | **unaffected** — same two paths, plus the `bootSmoke` line at `ci.yml:201`, which already exports `VERIFY_DIST=1` |

**Condition (iii) satisfied:** the lane gets a FAILING test file — a red with a count line it
cannot quote as a pass.

*Variant B′ (cheaper, rejected):* put the hook inside the existing `tests/setup/fastCheckSeed.js`
— zero new files and no `vite.config.js` edit at all. **Rejected** because that file is a
single-purpose seed pin whose header says so; folding an unrelated guard into it is the
second-writer shape this estate refuses everywhere else. The chair may prefer it; the code is
identical either way.

### SHAPE A (ALTERNATIVE) — extend the existing per-file anti-vacuity `it` to all 29 files

Give every dist-gated file the ungated guard that 9 of them already have, widened from
"`VERIFY_DIST=1` implies dist" to "collected at all implies dist-or-`VERIFY_DIST`".

**Costs:** 20 files gain a new `it` and 9 change theirs ⇒ **+20 to +29 titles and +20 credited
`it` rows on the lighting census**, which is an interior red and a chair refreeze; 29 files to
lint; the guard is re-spelled 29 times, which is the same duplication that produced three
different gate spellings in the first place; and a 30th dist-gated file added later silently
has no guard — **the class is not closed, only its current members are.**

**Costs it does NOT have:** no config change, no new file, and each guard is local to the file
a reader is already looking at.

### Shapes considered and rejected without pricing

- **Make `vite.config.js`'s `test.exclude` hide `tests/build/**` unless `VERIFY_DIST=1`.** A
  focused run would then print "No test files found" and exit non-zero — a clean red. Rejected:
  the source phase passes `--exclude` on the CLI, and CLI `--exclude` replaces the config array
  in Vitest 4, so the interaction with `SOURCE_TEST_EXCLUDE` is entangled and would need its
  own proof.
- **A lane-facing wrapper script.** Process, not structure; a lane that forgets the wrapper is
  exactly the lane the guard is for.

---

## 3 · Recommendation

**Shape B.** It closes the class rather than its current members, costs one new non-test file
and one line, moves no census and no `package.json` byte, and its discriminator is a measured
partition rather than a heuristic. Shape A is the only alternative that needs no config change,
and it buys that with a census refreeze, 29 re-spellings, and an open class.

**Not built.** TOOL-2 is measure-and-propose; the chair rules.

## 4 · Noticed, not touched

- **20 of 29 dist-gated files have no anti-vacuity guard of any kind**, including
  `firstPaintNonJs.test.js`, whose 8 tests are 8-of-8 gated. Under Shape B that becomes moot;
  under Shape A it is the work.
- **Three different spellings of one gate** (`distExists`, `DIST_EXISTS`,
  `REQUIRE_DIST && DIST_EXISTS`) and two different definitions of "dist exists"
  (`dist/ + dist/assets` vs `dist/index.html + dist/assets`). Not a defect today; it is why
  no single-file cure can work. A shared `tests/helpers/distGate.js` would be the tidy
  follow-up and is NOT proposed here — it would touch all 29 files, i.e. Shape A's cost with
  none of its benefit.
