---
name: edge-bundle-census-rows-were-staleness-not-build-order
description: "The six edge-bundle census rows were NOT a build-ordering artifact: the four suites reference dist NOWHERE, `npm run build` is `vite build` and never regenerates an edge bundle, and the census runs the WHOLE vitest run so tests/build/ is already inside it — a test leaves the census only by SKIPPING, which the frozen skippedCeiling forbids. Relocating them post-build was provably a no-op; the cure was one clean rebuild. Also: ORDINARY_TEST_CONTROL's >=5 floor is census-bounded and must fall as ordinary debt is paid, or it vetoes the burn-down."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T15:24:30.566Z
---

2026-08-10, lane F-SURVEY-1 E7 (build branch `claude/composite-r4`, worktree
`.claude/worktrees/minifold`, base `e4a21360`). Every figure below was executed.

## ⭐⭐ THE ORDERED CURE WAS A NO-OP, AND THE PROOF IS THREE-LEGGED

Chair ruling **F-S1-E7** froze six built-artifact census rows (three edge-bundle
`*.freshness` rows + three `edgeSharedBundleReproducibility` INDEX-hash rows) on the
premise that they *"assert dist state and step 12 runs before the build step"*, and
ordered them **relocated to a post-build gate step, THEN banked**. The premise does not
hold. Measured:

1. **The four suites reference `dist` and `VERIFY_DIST` NOWHERE** — `grep` over all four
   exits 1. They read `supabase/functions/_shared/*`, `src/*`, and the **git INDEX**.
2. **`npm run build` is `vite build`** (plus a sitemap prebuild and a prerender
   postbuild). It emits to `dist/` and **never regenerates an edge bundle** — nothing in
   the build phase writes under `supabase/functions/_shared/`. So no post-build phase can
   change these six verdicts by even one bit.
3. **The census runs the WHOLE `npx vitest run`**, so `tests/build/` is *already inside
   it*. Moving a file by DIRECTORY removes nothing. **The only thing that removes a test
   from the census is SKIPPING it** — and six new skips against the frozen
   `skippedCeiling: 105` is precisely the skip-to-green move `check-test-ratchet.mjs`'s
   own header exists to refuse.

⭐ **THE CONTROL THAT SETTLES IT.** `analyticsEventsBundle` and `intentAtlasBundle` are
the same shape, in the same suite, in the same pre-build phase — and they were **GREEN
throughout**. The three reds were never phase-ordering. They were three **stale
artifacts**. Measured at base: `6 failed | 121 passed (127)`; after one rebuild:
`127 passed (127)`, same denominator, so the six **executed and flipped** rather than
vanishing.

## HOW TO APPLY

The repo had already written the correct cure down, in `scripts/hazard-registry.json`
under **HZ-DIRTYBUILD**'s `upgradePath`, verbatim: *"Recovering to MACHINERY is a
burn-down of 3 baselined rows (one rebuild from a clean committed tree), not new
design."* **Read the hazard registry's `upgradePath` before designing a cure for a
census row — the class may already have its recovery written down.**

`npm run build:edge-shared` at a clean tree regenerates **all five** bundles in one
window. Determinism verified by two consecutive runs: byte-identical `.js` and identical
`sourceHash` for all five. Edit set is **8 files** — three bundle bodies plus **all five
metas** (the two already-fresh bundles' `.js` are byte-unchanged; only their
`generatedAt` moves, which the *single build window* pin requires).

⚠ The rebuild is a **disclosed content shift** in a deployed artifact: the charter and
output-schema input closures moved 117→110 and 118→111 (eight worldPulse
envoy-errand/peace-terms modules left, `src/domain/factionRefs.js` entered), ~570 lines
out of each bundle. That is the stale artifact being corrected, not a behavior change.

## ⚠⚠ THE COUPLED PIN NOBODY EXPECTS: ORDINARY_TEST_CONTROL IS CENSUS-BOUNDED

`tests/lint/testRatchet.test.js` holds `ORDINARY_TEST_CONTROL` — the false-positive half
of the walker classifier. Two arms bind it: every named file must carry a **live census
row**, and the list must stay **`>= 5`**. Of the 23 rows, 13 were ledgered walkers and
exactly **10 were ordinary debt, held by the control's 7 files**. Burning six rows
retires **4 of those 7**, leaving 3.

**The list CANNOT be refilled** — every remaining census file is a ledgered walker, and
naming one there re-commits the 2026-08-07 error of *a control certifying a miss*. So the
floor is **bounded above by the ordinary-debt population it controls**: held at 5, it
forbids burning the census below 5 ordinary-debt files — a control's sample size vetoing
the burn-down it exists to observe. It stepped **5 → 3** with the population, and stays a
LITERAL (never `ORDINARY_TEST_CONTROL.length`, which would prove list == list).

**Expect this coupling on every future census burn-down**, and check it BEFORE removing
rows: `CEILING` (23 → 17) is the obvious edit; the control list and its floor are the one
that reds after you think you are done.

## ⚠⚠ THE BIGGER FINDING: GATE STEP 15 WAS ALREADY RED AT `e4a21360` — 51 UNBANKED ROWS

Running the FULL `npm run test:ratchet` (not just the meta-test) surfaced **51 failing
tests NOT in the frozen census**, across 14 files. **None of them is mine, and none is an
edgeFunctions row.** Proven, not assumed:

- The 14 files were re-run in an **integrity-counted `git archive` of `e4a21360`** (6,274
  tracked paths in, 6,274 files out; node_modules symlinked to the WORKTREE's own, which
  has `three` and `pg`) with **none** of the lane's edits present → `51 failed | 65 passed`.
- The failing **identities are set-identical** to the census run's 51 — not merely the same
  count.
- Arithmetic close: the base census had 23 entries, and **0 of the 51 were among them**, so
  `regressions = live − entries` contained all 51 **at base**. Step 15 was red before the
  lane started.

The census `measuredAtSha` is **36e50c73**, not HEAD. The 51 are accumulated source drift
between those shas. The tell that it is drift and not breakage: several are ratchets
failing because the code **IMPROVED** — `bare-loading debt fell to 33 — lower
BARE_LOADING_PIN to lock the win`, and the unlayered-module census shrank 182 → 179.
Others are genuine (a NEW arcane classifier; a silent Suspense boundary 41 > 40; a
`CampaignRuntimeNotReadyError`; `pinLegacyCampaignContentBindings is not a function`) and
several are the recorded **line-addressed census rot** class.

⭐ **HOW TO APPLY: never infer the census is green from the meta-test.**
`tests/lint/testRatchet.test.js` (58 tests) checks the census file's SHAPE; only
`npm run test:ratchet` runs the 27k-test suite and compares it. They disagree, and here
they disagreed by 51 rows. Budget ~20+ min for the real one and run it in the background.

## RESIDUAL, STATED AGAINST INTEREST

`edgeSharedBundleReproducibility` hashes the **git INDEX**, so in a shared tree its
verdict genuinely does move with concurrent lanes' staging — the one real environmental
sensitivity in the six. Relocating post-build would not have cured that either. Its
orthogonality to freshness was demonstrated live: an **unstaged** staleness mutant
(one appended line in `src/data/entityTags.js`) reddens the freshness rows for both
bundles whose closure contains it, and correctly leaves the reproducibility pin GREEN,
because the index is unchanged.
