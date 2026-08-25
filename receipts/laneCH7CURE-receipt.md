# TE-CH7-CURE receipt — the two-act cure for MF-CH7

Successor lane to TE-CH-7 (`laneCH7-receipt.md`). Two acts only: regenerate the stale edge
sidecars and commit them as a set (ACT 1), then one clean full gate on a quiescent tree (ACT 2).
No domain code was touched. No pin was moved, created or deleted. No push. No stash.

SLOT `claude/composite-r4` = `c3289244d58b7259205d80594856e8e0cc520817`.
INHERITED TIP = `37360143707657d07f5c2e631a881392a45756dc` (= `refs/preserve/wip-ch7`).
WORKTREE `<scratch-695a70c5>/laneCH7-tree`, own `node_modules` (468 top-level entries),
`.husky/_` PRESENT so pre-commit RAN.

## ⭐⭐ RESUME POINT

TIP: `479992b6e02926f1d375a82ca6f47183b9693667`
STATUS: ⭐⭐ **BOTH ACTS DONE. THE GATE IS GREEN. THE LANE IS COMPLETE AND STOOD DOWN.**
DONE: the five edge-shared sidecars regenerated; the eight moved files committed as ONE set at
`479992b6e`; committed blobs proved byte-identical to the builder output (the pre-commit
`eslint --fix` rewrote NOTHING); one clean full gate at `TRUE_EXIT=0` / `[gate-tail] exit: 0`.
Worktree CLEAN at the tip, `git diff HEAD` empty, mutex released, 20,938,780 KB (~20 GB) free.
REMAINS: **nothing for this lane.** The only outstanding act is the chair's: `refs/preserve/wip-ch7`
still points at the INHERITED tip `37360143707657d0…` and may now be moved to
`holding-ch7 -> 479992b6e02926f1d375a82ca6f47183b9693667`. **This lane moved no ref, created none,
deleted none, and pushed nothing** — pins are the chair's.

EXACT NEXT COMMAND (fresh shell, worktree at `479992b6e`, nothing editing the tree, BARE — never
wrapped in gate-mutex, which self-deadlocks):

    cd <worktree> && npm run check:tail ; echo TRUE_EXIT=$?

GREEN means ALL of: `TRUE_EXIT=0` AND a `[gate-tail] exit: 0` line AND a collected-test count in
the output AND free disk >= 300 MB at the end. An exit code with no collected-test count is NOT a
verdict. If it reds: report the verbatim failing lines and STOP — do not widen the census, do not
add DECLARED_OVERRUN rows, do not re-run hoping for a different answer (one quiet re-run is
allowed ONLY for a TIMEOUT-class stray under heavy load; a second stray is a STOP).

## COMMITS MADE BY THIS LANE — exactly one

- `479992b6e02926f1d375a82ca6f47183b9693667` — "MF-CH7: regenerate the edge-shared sidecars
  staled by the criminal-row anchor" (8 files changed, 23 insertions(+), 17 deletions(-))

## ACT 1 — WHAT WAS MEASURED (all CONFIRMED by execution)

Pre-state captured before the build (sha256 of each `.js`, and of each `.meta.json` both whole
and with `generatedAt` deleted), so a content move could be told from a timestamp-only move.

    bundle                  sourceHash                              js content   meta minus generatedAt
    aiCharterBundle         295fd77cf76dc76b -> 9ae9af16d8bd128b    CHANGED +432 B (501193->501625)   CHANGED
    aiGroundingBundle       40141c7bb3a94f13 -> c7eac2c8e0eea46a    CHANGED +432 B (402688->403120)   CHANGED
    aiOutputSchemaBundle    f4d2986e7ffee6cf -> 3a19ea2f38727d41    CHANGED +432 B (496755->497187)   CHANGED
    analyticsEventsBundle   9416e4995620b37a  (SAME)                UNCHANGED                          UNCHANGED
    intentAtlasBundle       67975caae387dab8  (SAME)                UNCHANGED                          UNCHANGED

`inputs` counts unchanged: 111 / 67 / 112 / 2 / 2.

**THE STOP CONDITION WAS NOT MET.** `analyticsEventsBundle.js` and `intentAtlasBundle.js` did not
move in content at all — they do not appear in `git status` and are not in the commit. Only their
metas moved, and the whole of that move is `generatedAt`. Verified two independent ways: the
builder reprinted their sourceHash unchanged, and the sha256 of each `.js` is identical pre/post.

`git status --porcelain supabase/functions/_shared/` after the build, verbatim:

     M supabase/functions/_shared/aiCharterBundle.js
     M supabase/functions/_shared/aiCharterBundle.meta.json
     M supabase/functions/_shared/aiGroundingBundle.js
     M supabase/functions/_shared/aiGroundingBundle.meta.json
     M supabase/functions/_shared/aiOutputSchemaBundle.js
     M supabase/functions/_shared/aiOutputSchemaBundle.meta.json
     M supabase/functions/_shared/analyticsEventsBundle.meta.json
     M supabase/functions/_shared/intentAtlasBundle.meta.json

`git status --porcelain` (whole tree) held the same eight lines and nothing else, so the commit
is the complete set and no foreign WIP was present or disturbed.

### THE THREE BUNDLE DIFFS ARE EXACTLY THE CH-7 CHANGE — nothing else rode along
Each moved `.js` is 5 insertions / 3 deletions: the header `Source hash:` line, plus, in BOTH
`CATEGORY_INSTITUTION_HINTS` and `POWER_DOMAIN_HINTS`,

    -  criminal: /tavern|den|gang|black\s+market/i,
    +  criminal: /\btaverns?\b|\bdens?\b|\bgangs?\b|\bblack\s+markets?\b/i,
    +  // WORD-ANCHORED, and TWINNED with the criminal row in the other hint table: ...

The five meta diffs are `generatedAt` (+ `sourceHash` for the three) and nothing else.

### THE HOOK REWROTE NOTHING — re-proved at the COMMITTED TIP, not the pre-commit tree
`lint-staged` ran `eslint --fix` over the 3 staged `.js` files (they match `*.{js,jsx,mjs,cjs}`).
It changed no bytes: every committed blob's sha256 equals the builder's output.

    MATCH  aiCharterBundle.js        builder=f11767d57b24 committed=f11767d57b24  bytes=501625
    MATCH  aiGroundingBundle.js      builder=48ccc1472628 committed=48ccc1472628  bytes=403120
    MATCH  aiOutputSchemaBundle.js   builder=3d70962b4f67 committed=3d70962b4f67  bytes=497187
    MATCH  analyticsEventsBundle.js  builder=c64ee7ef02e9 committed=c64ee7ef02e9  bytes=19738
    MATCH  intentAtlasBundle.js      builder=9bc556f041a8 committed=9bc556f041a8  bytes=27098
    HOOK_REWROTE_BUNDLES=0

Mechanism (read from the shipped config, not assumed): `eslint.config.js` scopes every rule block
to `src/**`, `tests/**`, `scripts/**`. `supabase/functions/_shared/*.js` matches no block, so
eslint has no rule to apply there and `--fix` is a no-op. `git status --porcelain` and
`git diff HEAD` are both EMPTY at `479992b6e`.

### THE LINT-STAGED STASH IS NOT MINE AND WAS NOT LEFT BEHIND
`lint-staged` announced "Backed up original state in git stash (6521d4c3f)" and then cleaned up.
`git stash list` shows ONE entry, `stash@{0} = 21341de0ce5dc6e0e8c13ffba31134a008c8aeb7`, dated
**2026-06-15**, "On analytics-intelligence-layer: generation-tuning fixes" — the OWNER'S
pre-existing stash, identically present in the main worktree's `git stash list`. `6521d4c3f`
survives only as a dangling object; it is not on `refs/stash`. **No stash was created, applied or
dropped by this lane.**

## JUDGMENT CALLS (recorded for veto)

- **K1 — committed all EIGHT moved files in ONE commit, including the two `generatedAt`-only
  metas.** The brief directs it and the reproducibility arm is the reason: it hashes COMMITTED
  content, so a meta left dirty in the tree would describe content that is neither committed nor
  staged — the exact failure being cured. Cost: two metas whose only delta is a timestamp. Judged
  correct; the alternative (`git checkout` the two clean metas) would leave the tree clean but
  re-introduce a dirty-vs-committed skew the next time anyone builds.
- **K2 — did NOT `git checkout` or otherwise revert the two unchanged bundles' metas.** Same
  reason as K1, stated separately because it is the tempting "minimal diff" move.
- **K3 — checked the size ratchet BEFORE committing rather than discovering it at the gate.**
  The three bundles each grew 432 B, and `sizeBaseline` is a known exact-ceiling hazard. Read the
  SHIPPED predicate, not its comment: `tests/lint/sizeBaseline.test.js` builds its covered set from
  `walk(join(ROOT, 'src'))` and `ceilingFor()` returns null outside `src/**`, so
  `supabase/functions/_shared/**` is out of scope entirely and the growth cannot trip it.
  `scripts/.size-baseline.json` contains no `supabase` substring. CONFIRMED by reading both files.
- **K4 — did not touch anything in the domain car.** The predecessor proved the anchoring, the 7
  pins, the census re-record and the MF-CH7 mint at quiescent trees; none of the six red arms
  disputed them. Re-opening them would have invalidated its receipts for no gain.
- **K5 — did not write to the shared auto-memory index.** Concurrent-writer hazard on MEMORY.md;
  the chair aggregates. Everything durable is in this receipt and the final report.

## ACT 2 — GATE

Launched BARE (never wrapped in gate-mutex — that self-deadlocks and exit 3 means the mutex gave
up, not a red), fresh shell, at the FINAL tree. `/tmp/settlementforge-vitest-gate.lock` was
verified ABSENT before launch, so no sibling gate was waited on and none was killed.
Disk at launch: 19,724,800 KB (~18.8 GB) free on `/` — far above the 2 GB floor.

### GATE RUN #1 — 09:29:36 -> 09:52 — **RED, `TRUE_EXIT=1`, `[gate-tail] exit: 1`**

EVERY PHASE BEFORE `verify:dist` PASSED. Verbatim, from the full log
(`/var/folders/.../T//gate-tail.53280.log`, 99,495 B):

    [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
    [test-ratchet] OK — no test regressions (11 known failure(s) of 29051 tests, ceiling 11).

⭐⭐ **THAT SECOND LINE IS THE CURE, PROVED.** The predecessor's gate died at `test:ratchet` with
six edge-bundle failures outside the frozen census. This run carried `test:ratchet` GREEN at the
ceiling of 11 — the six are gone, and nothing was widened to make that happen. The count also
reconciles: 29,051 = the slot's 29,044 + the CH-7 car's declared **+7 TITLES**.
Phases observed passing in order: the 11 validators (hazard-registry, premortem, packets, data,
custom-content-manifest, migration-head, edge, map, tuning-bands, foundry-module, mcp-server),
`typecheck:ratchet`, `typecheck:domain:strict`, `lint`, `test:ratchet`, `prebuild`, `build`
(`✓ built in 29.67s`), `postbuild` (`[prerender] wrote 314 static route documents`).

THE RED, VERBATIM — all of it in `verify:dist`:

    [test-ratchet] STRICT DIST REFUSED: every discovered build test must run exactly once and pass.
      runner exited NON-ZERO; strict dist never banks a runner failure.
      report.success is not TRUE; strict dist requires an explicit successful report.
      suite status was not PASSED:
        tests/build/campaignRuntimeLazy.test.js [failed]
        tests/build/envoyPersistenceHydrationLazy.test.js [failed]
        tests/build/townScene3dLazy.test.js [failed]
      FAILED build-test row(s):
        tests/build/campaignRuntimeLazy.test.js :: built campaign runtime capsule boundary all three implementation bodies live only in the runtime chunk closure
          TIMEOUT · ran 25417ms against a 20000ms budget (vite.config.js testTimeout) — vitest serialises a timeout kill as `Error: STACK_TRACE_ERROR` with the stack captured at the test's own registration site
          msg: Error: STACK_TRACE_ERROR
        tests/build/envoyPersistenceHydrationLazy.test.js :: built persisted envoy hydration stays lazy the strict-validator fingerprint is absent from every entry-closure chunk
          TIMEOUT · ran 20036ms against a 20000ms budget (vite.config.js testTimeout) — ...
          msg: Error: STACK_TRACE_ERROR
        tests/build/townScene3dLazy.test.js :: town-scene promotion contract distinguishes proof classes emits an honest withhold receipt when no evidence exists
          TIMEOUT · ran 33813ms against a 20000ms budget (vite.config.js testTimeout) — ...
          msg: Error: STACK_TRACE_ERROR
        tests/build/townScene3dLazy.test.js :: town-scene promotion contract distinguishes proof classes fingerprints the complete local dependency closure, not only curated entries
          TIMEOUT · ran 20446ms against a 20000ms budget (vite.config.js testTimeout) — ...
          msg: Error: STACK_TRACE_ERROR

      ⚠ A BUDGET EXPIRY IS A COST FAILURE. Strict dist has no census to bank it in and no debt
        concept to absorb it: cut the row's per-run work or give it an explicit per-test budget
        carrying the measured figure. Raising the suite-wide testTimeout only hides the next one.
    [gate-tail] end:  9:52  up 19 days, 23:23, 1 user, load averages: 15.69 72.75 79.44
    [gate-tail] exit: 1 (the gate's own status, not a pipe's)
    TRUE_EXIT=1

Disk at end of run #1: 18,444,180 KB (~17.6 GB) free — far above the 300 MB floor.

- **K6 — took the ONE permitted quiet re-run, and only one.** The brief allows exactly one, only
  for a TIMEOUT-class stray under heavy load; a second stray is a STOP. Every one of the four rows
  is labelled `TIMEOUT` by the runner itself and is a budget expiry, not an assertion — and two of
  the four missed by 36 ms and 446 ms on a 20,000 ms budget. The machine was genuinely saturated:
  load averages measured during the run were 122.72, 145.06 and **154.61** on **8 cores**, and the
  gate's own end line records a 15-minute average of 79.44. By the time run #1 landed, load had
  fallen to 7.01 with no other vitest or gate process alive and no lock dir. Judged a load stray,
  not a defect. ⛔ I did NOT raise `testTimeout`, add a per-test budget, widen any census or add a
  DECLARED_OVERRUN row — the failure text invites exactly that and it is not this lane's call.
- **K7 — did not attribute the timeouts to this car.** They are in `tests/build/*Lazy.test.js`,
  which assert vite chunk boundaries in `dist/`. This lane's eight files are Deno edge-function
  bundles under `supabase/functions/_shared/` and are NOT inputs to the vite build; the vite build
  itself passed (`✓ built in 29.67s`), as did prerender. If run #2 reproduces them, that is a
  STOP and a finding for the chair, not something for this lane to fix.

### GATE RUN #2 — LAUNCHED 09:55:58, **KILLED AT ~10:10 WITH NO VERDICT** (not a red)

The parent Claude Code process exited and took the in-flight run with it (`Exit code 137`). It had
produced only its header — no phase output, no `[gate-tail] exit:` line, no `TRUE_EXIT`. **It is
NOT a verdict of any kind and must never be quoted as one.**
Post-mortem, verified by this lane at 10:14: worktree still CLEAN at `479992b6e`;
`/tmp/settlementforge-vitest-gate.lock` **absent** (the kill left NO stale lock to block a
sibling); `pgrep` for `gate-tail.sh` / `check-test-ratchet` empty and **0** vitest processes, so no
orphans were left contending; 21,103,672 KB (~20.1 GB) free.

CHAIR RULING (2026-08-24 ~10:15): because the killed run produced no verdict, the ONE permitted
quiet re-run is **still available**. Sibling lane CH4-CURE was told to wait for this gate to drain,
so this lane has mutex right of way.

### GATE RUN #3 — the one permitted quiet re-run, relaunched under the chair's ruling

Launched at **10:15** CDT, fresh shell, BARE, worktree FINAL and clean at `479992b6e`, no lock dir,
no sibling vitest process, load 7.09 (vs 154 during run #1's test phase), ~20.1 GB free.
⛔ **THIS IS THE LAST RUN.** Per the chair: if it reds again — even on timeout rows — that is a
STOP. Report verbatim and stand down; do not run a third time.

## ⭐⭐ VERDICT — **GREEN.** 10:15:20 -> 10:34:48 CDT, tree `479992b6e`, pre-launch status EMPTY

    [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
    [test-ratchet] OK — no test regressions (11 known failure(s) of 29051 tests, ceiling 11).
    [test-ratchet] STRICT DIST OK — 53 discovered/reported file(s), 467 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.
    [gate-tail] end: 10:34  up 20 days, 6 mins, 1 user, load averages: 22.67 88.40 84.60
    [gate-tail] exit: 0 (the gate's own status, not a pipe's)
    TRUE_EXIT=0

ALL FOUR GREEN CONDITIONS MET, each measured not assumed:
1. `TRUE_EXIT=0` — captured in-shell by the launching statement itself, not inferred from a pipe.
2. `[gate-tail] exit: 0` — the gate's own status line.
3. **COLLECTED-TEST COUNTS PRESENT** (an exit code without one is not a verdict): **29,051 tests**
   at `test:ratchet` and **467 tests across 53 files** at strict dist.
4. Free disk at end **20,938,780 KB (~20 GB)** — the floor is 300 MB.

Every phase passed in order: the 11 validators (hazard-registry, premortem, packets, data,
custom-content-manifest, migration-head, edge, map, tuning-bands, foundry-module, mcp-server),
`typecheck:ratchet`, `typecheck:domain:strict`, `lint`, `test:ratchet`, `prebuild`, `build`
(`✓ built in 27.26s`), `postbuild` (`[prerender] wrote 314 static route documents`), `verify:dist`.
The four `tests/build/*Lazy.test.js` timeout rows from run #1 did **not** recur — strict dist
reports zero failed rows — which retro-confirms K6/K7: they were load strays, not defects.

**THE CURE IS PROVED TWICE.** `test:ratchet` reported the ceiling of 11 in BOTH run #1 and this
run. The predecessor's six edge-bundle failures (3 `*.freshness` "Bundle is stale" + 3
`edgeSharedBundleReproducibility` "built from content that is neither committed nor staged") are
absent from both. **Nothing was widened to achieve it**: the ceiling is still 11, the frozen census
is still the one measured at `4deb4f026`, no DECLARED_OVERRUN row was added, and `testTimeout` was
not touched. The count reconciles arithmetically: 29,051 = the slot's 29,044 + the CH-7 car's
declared **+7 TITLES**.

## FINAL STATE, VERIFIED AFTER THE GATE

    FINAL_HEAD = 479992b6e02926f1d375a82ca6f47183b9693667
    git status --porcelain  -> EMPTY
    git diff HEAD           -> EMPTY
    commits atop the inherited tip -> exactly one:
      479992b6e MF-CH7: regenerate the edge-shared sidecars staled by the criminal-row anchor
    /tmp/settlementforge-vitest-gate.lock -> ABSENT (mutex released cleanly; no stale lock left
      for sibling lane CH4-CURE, which was told to wait on this gate)
    refs/preserve/wip-ch7 -> 37360143707657d07f5c2e631a881392a45756dc  (UNMOVED — chair's call)
    git stash list -> the owner's single 2026-06-15 entry, untouched
    free disk -> 20,938,780 KB

FORBIDDEN ACTIONS NOT TAKEN: no push; no ref/pin created, moved or deleted; no `git stash`; no edit
to the main worktree; no new test file; no census/baseline/ratchet widened; no write to the Claude
memory directory; no process killed that this lane did not start; no `npm install` anywhere.
