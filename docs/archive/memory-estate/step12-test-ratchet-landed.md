---
name: ""
metadata: 
  node_type: memory
  created: 2026-08-07
  type: milestone + hazard
  lane: S12-R (step-12 gate restoration)
  commits: "e4a71bb6, f707a905"
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-10T18:13:39.166Z
---

# ⭐⭐ STEP 12 IS A PER-TEST RATCHET — and the dark tail RAN, and verify:dist found a 65% first-paint blowout

## What landed

`npm run test` was a boolean gate at zero failures and step 12 of the 14-step `&&`
chain. It was red, so **steps 13 `build` and 14 `verify:dist` had not run in the gate
since 2026-08-02**. `scripts/check-test-ratchet.mjs` + `tests/lint/testRatchet.test.js`
replace it with the step-9 move one step later. Wired as `test:ratchet` in
package.json and `.github/workflows/ci.yml`; `npm run test` stays RAW for burn lanes.

**THE CENSUS (measured at c658fb44, integrity-counted clone, 6,182/6,182, 0 dirty):**
27,292 tests / 2,350 suites / 27,138 passed / **49 failed across 34 files** / 105
skipped / **1 suite fails at COLLECTION** (`tests/ops/migrationRehearsal.test.js`).
At f707a905 the gate printed: `OK — no test regressions (49 known failure(s) of
27339 tests, ceiling 49)` — zero regressions, zero ratchet-down, so the census is
exact.

> ⚠⚠ **STALE AS OF 2026-08-10 — "exact" was exact AT c658fb44 ONLY, and this
> paragraph read as timeless.** The denominator was later re-measured whole and the
> inherited red-set turned out to be a TWO-DIRECTORY census that read as whole-suite:
> see [[step12-measured-denominator-and-address-rot-class]] (@ 79419449) and, for the
> current banked state, [[edge-bundle-census-rows-were-staleness-not-build-order]] —
> ⚠⚠ step 15 was ALREADY RED at base e4a21360 with 51 unbanked rows. Re-measure
> before inheriting ANY figure on this page. The word "exact" here means
> "internally consistent at its own sha", never "current".

## The design, and the five laws worth reusing

1. **PER-TEST identity `<file> :: <full test name>`** — never per-file. A file-level
   allowlist hides every other test in that file, including ones that break tomorrow.
2. **THE TESTS RUN.** It reads results; it never skips/excludes/suppresses. A
   baselined test that turns up SKIPPED reds, and the suite-wide skip count is frozen
   (105) — *a skipped test is not debt, it is a hole.*
3. **`--update` is REMOVE-ONLY.** It refuses to bank a failure it has not seen, so
   adding a row is a deliberate hand edit that must carry an attribution.
4. **EVERY ENTRY ATTRIBUTED** — subsystem, cause, introducedAt, class — or the
   meta-test refuses it. 18/49 carry an exact sha; 31 carry `unbisectable:<reason>`
   (shrink-only inventory ratchets that grew by accumulation).
5. **A COLLECTION FAILURE IS DEBT TOO.** `uncollectedSuites` is a separate attributed
   allowlist; an unattributed zero-test suite still fails closed. A suite that throws
   during collection reports ZERO tests, so its banked debt silently reads as repaid.

## ⚠⚠ THE HAZARDS THIS LANE PAID FOR

- **A NEW TEST FILE RENAMES NOTHING BUT BREAKS EVERYTHING THAT READS THE CHAIN BY
  STEP NAME.** Renaming step 12 `test` → `test:ratchet` reds FIVE tests at once:
  architectureFreshness, contributingFreshness, enforcement-claims ×2,
  mutationCoverageManifest. In `tests/docs/enforcement-claims.test.js`,
  `resolveTarget` gated **every** `tests/**` @enforced-by claim in the corpus on a
  step literally named `test` — one rename made the whole corpus unresolvable. Cure:
  match the CLASS (`/^test(:|$)/`), which that file already did for `typecheck`.
- **⚠⚠ A SCOPE SENTINEL THAT ALSO FIRES UNDER `--update` WEDGES THE RATCHET.** My
  membership check's own message said "re-freeze with `test:ratchet:update`" — a
  command that would also have failed. A legitimately renamed test would have been
  unfixable except by hand-editing the census. Under `--update` a vanished row is now
  reported loudly and DROPPED; the gross case is still caught by the count floor.
  **Check every guard's error message names a command that can actually succeed.**
- **⚠⚠ NEVER RE-SERIALIZE `scripts/mutation-coverage-manifest.json`.** 248 KB, shared
  with concurrent lanes, and its serialization is NOT generically reproducible: indent
  1, non-ASCII escaped (`—` ×76, `§`, `→` …) **plus exactly one
  hand-authored `'`**. A `JSON.stringify` round-trip rewrites ~160 foreign lines.
  SPLICE RAW TEXT at anchors and verify the parse differs by exactly +N keys.
- **A CENSUS ENVIRONMENT MUST HAVE REAL GIT AND MATCH THE GATE.** A bare
  `git archive` has no `.git`; 18 tests shelled out to git and produced FALSE reds.
  Cure: `git clone --shared --no-checkout` + `git checkout -B <branch> <sha>` — a
  clone, not a worktree, so the concurrency law and the shared-index hazard are both
  sidestepped. `dist/` is gitignored, so a fresh clone matches CI's step-12
  environment (no dist) — the live worktree's stale dist is the anomaly.

## ⛔ OWNER-GATED, marked so nobody "fixes" them

Three census rows share ONE cause, attributed to **7aa43b50** (2026-08-03): migration
`195_civility_guard_and_public_identity.sql` landed past the wave-manifest head of
194. `MIGRATION_TRAIN_REPO_HEAD` is still 194, there is **no `195_*.down.sql` (the
tree carries ZERO `.down.sql` beside migrations)**, and `docs/DEPLOY.md:150` still
names 194. Rows: `deployRunbookFreshness`, `migrationRollbackDiscipline`, and the
uncollected `migrationRehearsal` suite. Migrations are an owner-gated class.

## ⚠ A BRIEF PREMISE THAT DID NOT REPRODUCE

`tests/lint/observedShapeReaders.walker.test.js` was reported as failing the full
suite under contention (a "structural timeout"). It **PASSED 21/21** in a genuine
full-suite run of all 2,350 files. Nothing was changed; a pin refuses it ever being
baselined. **Re-measure an inherited blocker before repairing it** — this is the
second recorded instance of that class (see `wr7-wiring-blocker-measured-wrong`).

## ⭐⭐ THE PAYLOAD: verify:dist ran and found a 65% first-paint blowout

Steps 13 and 14 both executed. `build` succeeded (3,850 modules, 314 prerendered
routes). **`verify:dist` failed with 8 tests across 5 files**, five of them genuinely
new (three are the in-flight layering lane's known targets):

- **first-paint static closure = 1,712,432 B vs budget 1,040,000 (+65%)**, of which
  `index-*.js` alone is **1,259,468 B**.
- **first-paint gzip transfer = 544,314 B vs 337,000**; index gzips to 401,608 B.
- engine chunk 677,023 vs 673,000; townScene3d payload 392,728 vs 350,000;
  render-blocking CSS 19,813 B vs 19,800.

> ⚠⚠ **STALE AS OF 2026-08-10 — every first-paint red above is RECLAIMED, and NO
> BUDGET WAS MOVED.** Re-measured from the built artifact: raw 1,013,926 / 1,040,000 ·
> gzip 320,925 / 337,000 · brotli 269,548 / 283,000 · render-blocking CSS 19,795 /
> 19,800. Budget constants unchanged at `tests/build/vendorPdfLazy.test.js:468-475`
> and `tests/build/firstPaintNonJs.test.js:37`, so this is a real reclaim, not a
> re-pin. Cured by `f52a7b75` (2026-08-08, "S12 closeout: reclaim the render-blocking
> CSS budget") and `6e7acc4d` (2026-08-09, "isolate campaign runtime and strict
> hydration"). ⚠⚠ **The CSS budget now has FIVE BYTES of headroom** — treat any CSS
> addition as budget-breaking until measured. CONFIRMED at the artifact; PLAUSIBLE at
> HEAD only — the dist was built from the live shared tree, not a `git archive` of
> 9df7e428, which the ARCHIVE-CENSUS LAW ([[receipt-vacuity-and-shared-ratchet-rules]])
> does not accept as census-grade. See [[first-paint-blowout-measured-at-head-2026-08-07]].

Hypothesis (PLAUSIBLE, unconfirmed): eager code that belonged in the lazy `engine`
chunk has been pulled into the entry closure — vite.config.js derives
ENGINE_SHARED_DOMAIN as the transitive closure of `src/domain` modules reachable from
`src/generators`, so a new `domain → generators` edge widens it. Diff the eager entry
closure against a pre-2026-08-02 sha. **Do not raise the budgets.**

## CR-TRFZ-1/2/4 (chair, 2026-08-10): the census re-freeze is DEFERRED behind schema-4

- **CR-TRFZ-1:** the 7699e367 re-freeze attempt measured 135 skips > ceiling 105 and was
  correctly refused (fail-closed proven; baseline byte-identical). 24 of the skips are
  observedShapeReaders.walker collapsing on the EXACT-SCANNER WALL (16385>16384 at
  src/data/constants.js) — the lane blamed mutex contention but quoted the wall's own
  error. Re-freeze rides AFTER the schema-4 walker rewiring; one re-freeze, not two.
- **CR-TRFZ-2:** skippedCeiling 105→111 APPROVED as an ATTRIBUTED HAND EDIT riding that
  re-freeze — six units named: campaignRuntimeLazy +3, envoyPersistenceHydrationLazy +2,
  vendorPdfLazy 9→10; all VERIFY_DIST-gated (env var, not disk state; step 16 RUNS them —
  deferred, not holes). `--update` can never bank this: `Math.min` shrink-only, and the
  sentinel returns before the update block. NOT a raise-to-green: each unit attributed.
- **CR-TRFZ-4:** classification gap in check-test-ratchet.mjs — a LOAD-TIME THROW whose
  suite still enumerates assertionResults becomes 24 SKIPS, not an uncollected suite
  (`uncollectedOf()` only catches zero-assertionResults). Docket for the schema-4 lane.
Live at HEAD: testRatchet.test.js 58/58 green — the stale header is hygiene, not a hole.

## ⭐ CR-TRFZ-1/2/3 EXECUTED 2026-08-11 at `c74048e4` — HEADER RE-FROZEN, THREE REDS ESCALATED

Measured in a `git clone --local` archive of `c74048e4` (6,278/6,278, path sets identical,
0 dirty, 3,106 commits of real history, node_modules APFS-CLONED not symlinked):

**27,926 tests / 2,383 files / 27,795 passed / 20 failed / 111 skipped / 0 uncollected.**

- **The skip figure is 111 — exactly CR-TRFZ-2's approved raise, measured, not assumed.**
  105 → 111 landed as the attributed hand edit (`--update`'s `Math.min` can only shrink and
  the sentinel returns before the update block). The four VERIFY_DIST-gated units and the
  one postgres unit account for all 111; the observedShapeReaders walker's former 24 skips
  are GONE (the schema-4 genesis).
- **`entries` is BYTE-UNCHANGED: 0 dropped, 0 vanished.** All 17 census rows still fail.
- **`--update` COULD NOT WRITE ANY OF IT.** Three failing identities sit OUTSIDE the census
  and `--update` refuses to bank an unseen failure, so the header was written BY HAND
  (`measuredAtSha`/`totalTests`/`totalFiles`/`skippedCeiling` only) and the three left RED
  WITH ATTRIBUTION. ⚠ The re-freeze is NOT closed — after the repairs, one
  `npm run test:ratchet:update` finishes it mechanically.
  1. `negativeAssertionAnchor.walker` — `tests/lint/testRatchet.test.js` carries 5 un-anchored
     negatives (lines 1077/1195/1214/1226/1238) against a frozen ceiling of **2**. Introduced by
     **894325ff** (the schema-4 CODE half, which self-declares gate-red); reproduces identically
     at `2a7fb033`. ⛔ Cure is a TWO-FILE edit — anchor the four new sites AND lower
     `negativeAssertionAnchor.walker.test.js:577` `'tests/lint/testRatchet.test.js': 2` to its new
     count, because the inventory-honesty arm reds on a row that offends BELOW its ceiling.
  2. `observedShapeReaders.walker` SHRINK-ONLY — `{ violations: 0, stale: 12 }`. PASSED 26/26 at
     `2a7fb033`, so **introduced by `c74048e4`**: the repair removed 12 reads the genesis froze.
     Needs an OSR baseline re-freeze, not a census row.
  3. `sovereigntyLightingContract.walker` — the estate census moved; CURED by this lane
     (see [[sovereignty-lighting-census-rerecorded-01a81a1e]]).
- VERIFICATION, replayed through the real script against the same report: with the NEW header
  the scope sentinel is CLEAN and the only red is those three; with the OLD header the SAME
  report reds `111 > 105`. Main tree `testRatchet.test.js` + the lighting walker: 94/94, exit 0.
- ⚠⚠ A first attempt at `2a7fb033` measured **182** skips. 71 of those were four files whose
  workers a sibling lane killed — see [[killed-worker-presents-as-skip-ceiling-red]]. That
  archive was destroyed and everything re-measured on a quiet tree.
