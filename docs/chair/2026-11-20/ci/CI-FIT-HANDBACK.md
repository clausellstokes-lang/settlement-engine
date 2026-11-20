# CI-FIT hand-back: point 75 (pull request #75's two CI reds, by cause)

Written 2026-11-20 01:46 UTC by the CI-FIT seat of the seventh chair. Branch `lane/ci-fit-75-2026-11-20`, cut from
`origin/lane/join-2026-11-14` at 29ec255fe (read back equal). Commits, in order:

| commit | unit |
|---|---|
| 45ba3b70f | B: both browser jobs run in Playwright's image at the lockfile's version; the install step is a launch probe with a fallback |
| bf2979010 | A: the four expiries, and the 16 tests estimated within 3/4 of their budget, take measured budgets |
| b27d5f171 | the chair's added unit: the ratchet's budget reader reads a same-file constant and says "budget not read" otherwise |
| 5f161befd | the lighting census refrozen by its own door (files 3700 -> 3701, titles 31154 -> 31162) |
| (this file) | the hand-back |

## A · the four expiries

The brief's premise was corrected at 00:10 UTC and the chair confirmed it. A7 never ran against the
20 s default. It carries `SLOW` (300,000 ms), and the "20000ms budget" line came from the ratchet's
budget reader. All four ran 1.09 to 1.27 times their OWN budgets.

| test | alone here | in its shard here | CI (shard) | budget before -> after |
|---|---|---|---|---|
| livingContentPromiseBytes RATE 768 | 183.3 s | 192.2 s (6) | 304.1 s (6) | 240 -> 480 s |
| mergeLadderHeldKeys A7 | 213.9 s | 224.2 s (5) | 338.5 s (5) | 300 (SLOW) -> 540 s |
| generationForkCensus A3e | 133.1 s | 149.9 s (5) | 223.3 s (5) | 180 -> 360 s |
| metropolisTailedRoll 400 seeds | 124.8 s | 136.5 s (6) | 196.7 s (6) | 180 -> 300 s |

The last close's local serial whole check (c02735d57, on another box under load) had them at 164, 194,
131 and 110 s.

**Cause: honestly long on a runner.** Being in a shard adds 5 to 13% per test on this box: the
shard's heavy files run beside one another. Inside the same shard, the runner is 1.44 to 1.58 times
slower than this box. This answers the chair's question ("a shard a fifth slower than serial", or
"always this close") as far as the figures reach. Per-test, the shard costs 5 to 13%, not a fifth.
The four were already near their budgets on a runner, and the shard tipped them over. The serial CI
per-test figures that would settle "always this close" sit in the shard artifacts. Their download host
(productionresultssa4.blob.core.windows.net) is refused by this seat's network, so that half is
PLAUSIBLE, not executed.

Ruled out by the same figures:
- Worker oversubscription: vitest 4's default is cores - 1, so 3 workers on the runner's 4 cores.
- A shared fixture paid out of order: each file's own first test pays it alone and in the shard alike (mergeLadder A1, 66 to 75 s).
- Spawned processes and git fixtures: none of the four spawns or runs git.
- Memory: no OOM; 16 GB.

These tests are synchronous, so a budget cannot shorten them. They run to completion and are judged
afterwards, so raising a budget adds no time to any shard.

Budgets: the CI figure × 1.5, rounded up to the minute (the house's cap rule, applied to one row), in
the form `}, N); // its own budget, carrying the measured figure (...)`.

**The next ones.** CI's per-test report is unreadable here (the host above), so the class was
estimated. Each test's own budget comes from vitest's collection (`task.timeout`), set against two
figure sources:
- shards 5 and 6 here, × 1.6 (the largest CI/in-shard ratio of the four);
- the last close's serial whole check, every shard, × 1.85 (the largest CI/serial ratio).

Sixteen tests in thirteen files reach three quarters of their budget, and each takes its budget in
bf2979010 (the commit body lists them). Two serial estimates exceed 1.0 yet passed on CI
(magicBufferIntegration 1.18, siteCoherenceRatchet 1.10), so 1.85 over-reads some rows. A wider
budget costs nothing.

**Shard balance (named, not changed):** the shards took 22m32s, 16m43s, 13m28s, 30m32s, 30m52s and
36m01s. Shard 6 is at 80% of its 45-minute cap. vitest splits by a hash of the path, so the heavy files
of shards 4 to 6 sit together by chance. A duration-balanced partition would change the house's "same
split locally and on CI" contract, and that is the chair's ruling.

## B · the browser install

The cause, from the logs (run 44494042373) — apt, not the browsers:

| job | step took | apt download | browser downloads |
|---|---|---|---|
| e2e (135456581358) | 43m38s | "Fetched 123 MB in 42min 30s (48.2 kB/s)": 181 packages from us-east-2.ec2.archive.ubuntu.com, stalls up to 193 s, 21 `Ign:` re-fetches | 11 s |
| performance (135456581132) | 9m45s | "Fetched 32.1 MB in 8min 38s (61.9 kB/s)" | 7 s |

**The mechanism:** both jobs run in `container: mcr.microsoft.com/playwright:v1.60.0-noble` with
`options: --ipc=host`. That one image tag serves both jobs and carries the browsers and their
libraries. Its v1.60.0 Dockerfile also installs git, puts the browsers at a world-writable
/ms-playwright and sets no USER. The install step is `scripts/ensure-playwright-browsers.mjs`, which
LAUNCHES each browser and renders a page. If a launch fails, it falls back to `npx playwright install
--with-deps` and launches again; a second failure fails the step. The "is not vacuous" guards, the job
ids and names, the runner pins and the caps are unchanged.

**The pin:** a ciCheckParity arm holds the tag equal to `v<package-lock's @playwright/test>-noble` in
both jobs. It also requires that the three Playwright packages lock one version, that the install step
is the probe, that no step installs on the runner directly, and that each job keeps its runtime guard.

**Red first** (each plant removed after): tag drift -> red; a direct install -> red; the probe's
fallback removed -> 3 of 7 probe arms red.

**The one failure without a fallback:** an image that cannot be PULLED stops the job red at
"Initialize containers". That is loud, never a vacuous green. No in-job fallback exists for it: a
second job would change the job ids.

## The chair's added unit: the ratchet's budget reader (b27d5f171)

`numericConstantsOf` and `timeoutLiteralsOf` now read `}, NAME)` and `timeout: NAME` when the file
binds `const NAME = <numeral>;`. On A7's file at 29ec255fe: [] before, [300000] after.

`unreadBudgetNamesOf` names a budget-spelled name the file does not bind, and the line then reads
"budget not read (... which may not be this test's)". Today no row is flagged. 51 unbound upper-case
names sit in budget positions across tests/, and none is budget-spelled. The first cut flagged ROOT and
turned the ratchet test's own end-to-end arm red in shard 6, mid-edit; that red is why the spelling
filter exists.

It changes the message only, no verdict path. Red first: 1 failed of 86 on the old script. After:
86/86.

## Proof at the last commit (read by count lines)

- the 17 touched test files, 332/332;
- census walkers, 113/113;
- tests/build with tests/lint/vitestShardMerge: 62 files passed, 7 skipped; 506 tests passed, 128 skipped (the dist-reading arms, no build here);
- typecheck:ratchet: 167, ceiling 167;
- typecheck:domain:strict: 1113, ceiling 1113;
- lint: exit 0.

Every check was run at 5f161befd and read by its count lines, through gate-tail, never a pipe.

## CONFIRMED vs PLAUSIBLE

**CONFIRMED (executed here):**
- every local figure above, and the CI figures as read from the job logs;
- the tag's existence (`docker manifest inspect`);
- every test and plant named above;
- the config after each run: core.bare false, user.name Claude, authors Claude.

**PLAUSIBLE until pull request #75's own CI run:**
- the image pull time on a runner, and both browser suites inside the container (no local docker run: deferred so it could not skew the timing runs, then the mark was reached);
- the next ones' estimates;
- that serial CI ran the four under budget.

**NOT DONE:** reading CI's per-test reports (host refused). Shards 1 to 4 were not run here; their
tests were swept only through the serial figures.
