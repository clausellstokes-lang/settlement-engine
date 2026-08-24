# LANE LAW — standing, cite don't restate (chair, 2026-08-24, slot c3289244d)

SLOT BASE: `claude/composite-r4` = **c3289244d58b7259205d80594856e8e0cc520817** (60 cars landed).
REPO: /Users/cstokes/Desktop/settlement-engine · ledger branch review-fixes-2026-07-08 (chair only).
Census tuple at slot: files 2525 / parked 366 / credited 2159 / titles 21026 / suiteTitles 5848.
Packets: 179, 0 READY. Ratchet ceiling: 11 known failures of 29,044 tests.

## 0. SOLO
You are ONE lane. Do NOT spawn sub-agents — a sub-lane counts against the owner's cap of four
and has already caused an overrun. Do the work in your own context.

## 1. Worktree — ⛔⛔ THE SYMLINK IS FORBIDDEN (corrected 2026-08-24, it cost a full gate)
    git -C <repo> worktree add <yourdir>-tree c3289244d
    cd <yourdir>-tree && npm ci --no-audit --no-fund      # the worktree gets its OWN node_modules
⛔ **NEVER `ln -s <repo>/node_modules`.** The main worktree matches NO BRANCH and its
`package.json` declares **36** deps while the SLOT's declares **40** — `three`, `pg`,
`@types/node` and `espree` are slot-only, and the shared `node_modules` was last written
**2026-07-16**. A lane that symlinks it is testing the slot's CODE against the owner's
FIVE-WEEK-OLD DEPENDENCIES. The failure does not look like a missing module: the two affected
suites produce **ZERO collected tests**, and `test:ratchet`'s SCOPE SENTINEL correctly refuses
the run as VACUOUS — "the gate is no longer running what it was frozen to run".
⛔ And do NOT try to repair the SHARED `node_modules` with `npm install --no-save`: npm resolves
against the main worktree's 36-dep manifest, so your additions are EXTRANEOUS and the next
install PRUNES them. Two attempts took it 453 -> 448 -> 434 packages and removed the very
packages they were adding. The shared tree is not yours to fix; your worktree is.
Check disk FIRST: `df -k /` — if free < 2 GB, STOP and report; do not start. Budget ~800 MB
for your own node_modules.
⚠⚠ **REVERSED 2026-08-24 BY THE `npm ci` CORRECTION.** The old law read "a lane worktree has NO
husky `_` shim, so `git commit` there SILENTLY bypasses pre-commit". That was true only for a
SYMLINKED tree. **`npm ci` runs the `prepare` script, which INSTALLS `.husky/_`** — so a worktree
built the correct way DOES run pre-commit, and you inherit the hazard that comes with it:
⛔ **pre-commit runs `eslint --fix` via lint-staged and RE-STAGES the files it rewrites.** Your
`git diff HEAD` after committing is therefore BLIND to what the hook changed. **Re-prove at the
COMMITTED TIP**, never at the pre-commit working tree, and if your commit body quotes a gate line
measured before the hook ran, that line describes bytes that no longer exist — re-earn it or
correct it. Check which regime you are in: `ls -d .husky/_`.

## 2. The gate — the exact incantation
    export GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock
    export GATE_MUTEX_MAX_POLLS=960
    sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 <files>
    echo TRUE_EXIT=$?
⛔ NEVER wrap `npm run check*` in gate-mutex — it self-deadlocks (exit 3 = mutex gave up, NOT a red).
   Run `npm run check:tail` BARE, fresh shell, `; echo TRUE_EXIT=$?`.
⛔ `--poolOptions.threads.*` DOES NOT EXIST in vitest 4.1.8 — it exits 1 with ZERO tests collected.
⚠ **NEVER KEY A STALE-LOCK RULE TO A REMEMBERED PID.** Read the pid **out of the lock dir** and
test *that* one: `P=$(cat /tmp/settlementforge-vitest-gate.lock/pid); ps -p "$P"`. Observed
2026-08-24: a lane reported "the lock is held by PID 29027" — 29027 was alive but was **not** the
holder; the lock belonged to a different live gate. A rule keyed to the wrong pid either fails to
clear a genuinely stale lock or clears a live one. ⛔ And **never kill an in-flight gate to tidy
up** — it may hold the mutex, and a killed holder leaves a stale lock that blocks every sibling
lane. Let it drain.

⛔⛔ **THE GATE READS THE WORKING TREE, NOT A COMMIT (added 2026-08-24, TE-CH-7).** Any edit made
while a gate is IN FLIGHT splits the run across two trees — the early validators see the old one,
`test:ratchet`/`build`/`verify:dist` see the new. The result is neither a pass nor a fail but a
**verdict about a tree that never existed**. Launch a gate only when the tree is FINAL, or re-run
after the last edit. This is the sibling of the re-staging law: pre-commit's `eslint --fix` rewrites
bytes AFTER you measured them; this rewrites the tree WHILE you measure it. **Both yield a green
that describes bytes you did not ship.**
⚠ **A contaminated green is not a green** — pin such a tip as `wip-*`, never `holding-*`, so nobody
downstream reads it as landable.

GREEN means all three: `TRUE_EXIT=0` AND `[gate-tail] exit: 0` AND free disk >= 300 MB at end.
An exit code with no collected-test count is NOT a verdict.

## 3. Instruments that lie (verified, each has bitten)
- `git rev-parse "$SHA:path"` echoes and exits 0 on a miss — use `--verify -q`, and BRACE it:
  unbraced `${SHA}:tests/x` makes `:t` a zsh modifier and you get the sha of an EMPTY stream.
- A mis-spelled vitest path is dropped SILENTLY — confirm the collected-file count.
- `grep -c` exits 1 when the count is zero, which KILLS an `&&` chain. Use `grep -ac`, own statement.
- A compound ending in `grep`/`diff`/`cmp` INVERTS a green result. End on `echo` or an explicit exit.
- `git grep` is BLIND to untracked files. `git grep -E` does not honour `\b`.
- `grep` here is ugrep: bounded-repetition patterns fail printing nothing to stdout.
- zsh does not word-split unquoted lists; a variable named `path` destroys `$PATH`.
- `git log --diff-filter=A` reports the ADDING commit, not the last-touching one.
- A control that CANNOT FAIL proves nothing. Every probe needs a deliberate mutation showing it reds.

## 4. Census + packets
- Carry the **DELTA**, never the tuple, across a rebase; re-stamp from the POST-edit hash.
- A NEW test file reds THREE ratchets: two censuses + mutationCoverageManifest's E-A TOTALITY arm.
- A template-literal `it()` title inflates the census by its PARTS.
- Loop-registered / `test.each()` titles are INVISIBLE to the census — check `credited`.
- A packet reserves its change paths at EVERY non-terminal status, DRAFT included.
- The LANDED flip is THREE places: manifest status + packet header + INDEX STATUS (`indexPath`).
- Any `docs/**.md` write risks naked-claim debt: it is PER-CLAIM and reds a GREEN test.
  `0 problems` also matches "30 problems" — run the exact CLAIM_RE.
- ANY package.json byte change is a MINT TRIGGER.

## 5. Reporting
Write a receipt at `<yourdir>-receipt.md`, updated at least every 30 minutes with a
`RESUME POINT` block (what is done, what is next, exact next command) so the chair can resume you
mid-lane. Checkpoint your commits as you go; never hold one giant uncommitted edit.
Final report: the commit sha, the census delta, the verbatim gate lines, and every judgment call.
Report failures VERBATIM. "Should pass" is not a result.
