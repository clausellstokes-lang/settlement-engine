# LANE-LAW ADDENDUM — the TE-EFF-1 efficiency instruments

- **Status:** LANDED 2026-08-30 by lane TE-EFF-1 (Opus 5 seat), chartered
  OWNER_DECISION_QUEUE §778.2 and ordered implemented §779.1.
- **Why this file exists at all, stated so nobody looks for the parent volume:**
  LANE-LAW itself is **not tracked in this repository**. It is cited by name in
  `docs/implementation/INDEX.md` and in `docs/implementation/packets/town-cartography/MF-CG2.md`
  ("as LANE-LAW §1 directs"), but a `git ls-files` sweep finds no file that
  contains it — the canonical text lives in the chair's session scratchpad and
  reaches lanes through their briefs. This addendum is therefore the **tracked**
  home for the two incantations and the one ritual that TE-EFF-1 introduced, so
  a successor who has only the repository can still run them correctly. When
  LANE-LAW is itself brought into the tree, this file folds into it.

---

## §1 · THE DOCK RITUAL (ODQ §779.2)

A **dock** is a warm lane worktree — one that already carries an installed
`node_modules` from a previously landed lane — handed to the next lane instead
of being torn down. It saves the several-minute `npm ci` that every fresh lane
worktree otherwise pays before it can run anything.

The ritual is **four steps, in order, and step 1 is not optional**:

1. **Prove the dock is clean.**
   ```sh
   git -C "$DOCK" status --porcelain      # MUST be empty
   ```
   ⛔ **If it is not empty, STOP and report.** Never reset, clean or check out
   over a dirty dock. Those paths are somebody's uncommitted work — possibly a
   sibling lane still running — and `git checkout` discards uncommitted work
   silently. A dirty dock is a finding, not an obstacle.

2. **Detach onto the build tip.**
   ```sh
   git -C "$DOCK" checkout --detach <build-tip-sha>
   ```
   Detached, always: a lane moves no ref. The chair collects.

3. **Reinstall only if the lockfile actually moved.**
   ```sh
   git diff <dock-previous-sha>..<build-tip-sha> -- package-lock.json
   ```
   Empty output ⇒ **skip `npm ci`**. That skip is the entire saving the dock
   exists to produce; taking it unconditionally is how a dock silently becomes a
   plain worktree. Non-empty ⇒ `npm ci --prefer-offline`, and re-earn every
   green afterwards.

4. **Survey before proceeding** (the 529-law): a killed agent leaves **partial
   edits**, so read the tree state before trusting it.

⚠ **Check whether the dock runs the hooks.** `npm ci` runs husky's `prepare`, so
a dock that has ever installed carries `.husky/_` and **pre-commit runs there**.
Where it runs, `eslint --fix` re-stages, which means `git diff HEAD` is blind and
every green must be re-proved **at the committed tip**, not before the commit.

---

## §2 · THE SHARED-TIER INCANTATION (`scripts/gate-mutex.sh`)

The gate mutex now has two tiers. **An undeclared caller is EXCLUSIVE and its
behaviour is exactly what it always was**, so every standing incantation —
including the bare `check:tail` and the exported `GATE_MUTEX_LOCK_DIR` idiom the
lane briefs carry — keeps working unchanged.

> ⛔ **THE PATH BELOW WAS NOT THE SCRIPT'S DEFAULT, AND FOR A WHILE THAT SPLIT THE
> POPULATION IN TWO (cured 2026-08-30, lane T9).** This section instructs every
> lane, twice, to export `/tmp/settlementforge-vitest-gate.lock`. The script's
> default has a `$(id -u)` suffix — a different directory. So `npm run check:tail`,
> which exports nothing, and every lane's targeted run, which exports the string
> below, were **not mutually excluded at all**; both printed that they had acquired
> the lock, the shared pool sat beside one path while the exclusive gate held the
> other, and a sibling lane measured load 345 on eight cores with three red gate
> runs before anyone asked which directory was being locked.
>
> **You need change nothing.** The cure is in the acquirer, not in this paragraph:
> `scripts/gate-mutex.sh` now folds every spelling of the gate's own lock family
> onto one canonical path, keyed on the FAMILY NAME rather than the directory, so
> it is independent of `TMPDIR`, of the launch context, and of which base your
> `gate-mutex.sh` came from. A lock path outside the family is left untouched, so a
> deliberately isolated lock stays isolated. `sh scripts/gate-mutex.sh
> --print-lock-dir` reports the path an invocation would take, and acquires
> nothing. `tests/scripts/gateMutex.test.js` reads the incantations **out of this
> file** and executes each one, so a future lane law that names a fourth spelling
> reds instead of silently splitting the population again.

### Exclusive (the default; the real gate)

```sh
export GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock
sh scripts/gate-tail.sh npm run check:tail
```

Unchanged. The full gate takes the lock, waits out legacy runners, and runs
alone. Raise `GATE_MUTEX_MAX_POLLS` to queue lawfully behind a live holder.

### Shared (new — targeted runs only)

```sh
export GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock
GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- \
    npx vitest run --maxWorkers=2 tests/<your files>
```

- `GATE_MUTEX_TIER=shared` is **declared, never inferred**. There is deliberately
  no heuristic that reads a command line and decides a run "looks small".
- **`--maxWorkers=N` is mandatory and N must be ≤ 2**
  (`GATE_MUTEX_SHARED_MAX_WORKERS`). A shared run without a cap is **REFUSED**
  (exit 2) before it registers, and so is one whose cap exceeds the ceiling —
  `--maxWorkers=64` satisfies "carries a cap" while defeating every reason the
  cap exists.
- Shared runs proceed **concurrently with each other**. A live exclusive holder
  excludes them, and so does a *pending* exclusive that holds the lock while it
  drains the shared pool — which is why a stream of small runs cannot hold the
  real gate off.
- Exit codes are unchanged in kind: the child's own status on success, `2` on
  refusal, `3` on GAVE UP.

⛔ **Running `npx vitest` bare — outside the wrapper — remains the thing not to
do.** Exporting `GATE_MUTEX_LOCK_DIR` without calling `gate-mutex.sh` buys
nothing: the export is read by the script, and a run that never invokes the
script never takes a lock. Two unwrapped runs were observed on 2026-08-30 doing
exactly that, both believing themselves governed. A worker-capped targeted run
now has a front door; use it.

### What this is NOT

`docs/DESIGN_BUILD_EFFICIENCY.md` §7 refuses **gate tiering or conditional
steps** permanently, and §18-22 of that volume make "amortized, never thinned"
its prime constraint. **This addendum does not touch either.** No step of
`npm run check` becomes conditional, skippable or lite. What is tiered is
*admission* — how many runs may be in flight at one moment — not what the gate
checks. The script's own header carries this paragraph too, so a reader who
arrives at the code first is not left to guess.

---

## §3 · THE CENSUS REGENERATION INCANTATION

The lighting census tuple has moved out of
`tests/lint/sovereigntyLightingContract.walker.test.js` and into
**`tests/lint/.lighting-census-baseline.json`**, which carries provenance
(`measuredAtSha`, `measuredBy`, `date`, `note`) the inline constant could not.
The walker's derivation history — every prior row, its cause, the census laws —
**stayed in the walker, byte-for-byte**. Only the five live figures moved.

⛔ **Never hand-edit the five figures.** Regenerate:

```sh
LIGHTING_CENSUS_REFREEZE='<lane or seat id>' \
LIGHTING_CENSUS_NOTE='<why the census moved>' \
    npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
```

(Wrap it in the shared tier per §2 when other lanes are live.)

Three refusals, each for a failure this program has taken:

1. **A dirty tree is refused.** The census counts the *working tree*, and in a
   shared tree that can hold another lane's uncommitted test files — measuring
   then charges their files to you and writes a figure no checkout can
   reproduce. (FP wave ES-1 was bitten by this and had to re-measure on a
   `git archive` of its own parent.) The register itself is the one permitted
   dirty path, so a refreeze is repeatable. **Consequence for sequencing: commit
   your car first, then refreeze at the clean tip, then commit the census bill.**
2. **A partial write is refused.** All five figures are measured,
   integer-checked and arithmetic-checked before anything is written, and the
   write is a temp file plus a rename — an interrupted refreeze leaves the
   previous register intact rather than a half-tuple that reads as a real
   measurement.
3. **Blank provenance is refused.** `REFREEZE=1` would record
   `measuredBy: "1"`, which is provenance in shape only.

⭐ **The refreeze run exits non-zero on success, deliberately.** A mode that both
rewrites a baseline and reports a passing test is a mode that can disarm the
guard for a whole run. The verification is a **separate, ordinary run** of the
same walker, and that green is the receipt.

---

## §4 · THE LANDING IDIOM FOR TRAIN PACKETS

This is the §3 extraction's actual payoff and it changes how a train resolves a
census collision.

**Before:** two lanes measuring the same instrument from the same base each
produced a correct tuple, and the two were *jointly meaningless* — a composed
delta is arithmetic performed on two different trees. The only lawful
resolution was to drop one block whole and re-author the other by hand, dragging
four thousand lines of derivation history through every rebase. Every landing on
the night of 2026-08-29/30 hit this.

**Now, for a rebase or a train member whose base also regenerated the register:**

1. **Take either side of `tests/lint/.lighting-census-baseline.json` whole.**
   Do not merge the two objects, and do not reconcile figures by arithmetic.
   Which side you take does not matter; step 2 overwrites all five.
2. **Regenerate at the resolved tip** with the §3 command, naming the train and
   the cause in `LIGHTING_CENSUS_NOTE`.
3. **Verify with a plain run** of the walker.
4. **The walker file itself should not conflict at all** any more — the history
   block is append-only prose and the tuple is no longer in it. If it *does*
   conflict, the conflict is real (a rule moved), not census bookkeeping.

For a train (`DESIGN_BUILD_EFFICIENCY` §2.3), the census is still re-derived
**whole at the last tests-moving member**, unchanged — this idiom only makes
that derivation cheap and makes the intermediate members conflict-free.

⚠ **A member commit may carry a knowingly stale register**, named in its own
commit body, exactly as §2.1 permits precomputed exact reds on unexposed
interior commits. The register is regenerated before the terminal exposes.

---

## §5 · WHAT IS OWED, RECORDED RATHER THAN DROPPED

- **A fold onto the ledger copy of `docs/DESIGN_BUILD_EFFICIENCY.md`.** That
  volume's own status block establishes the folded-volume convention: the LEDGER
  copy is the chair's drafting surface, and the build-branch copy is canonical at
  its base, re-folded by a build-branch docs member. This lane therefore did
  **not** amend the build copy — doing so would create precisely the divergence
  that convention exists to prevent. The chair owes a §10 there covering the two
  tiers, the census register and the dock ritual; this file is its source text.
- **An npm script row for §3's command.** Deliberately not added: any change to
  `package.json` bytes is a mint trigger, and this lane carries no mint charter.
  The command is documented here and in the register's own `_doc`. A later
  chartered mint may add `census:refreeze`.
