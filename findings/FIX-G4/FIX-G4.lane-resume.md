# FIX-G4 — COMPOSER-READY NOTE (batch member, not a solo gater)

**Lane** FIX-G4 (Opus 5) · **chair** Fable 5.1, session 4a1823e2 · **ruling** ODQ §934.76
**Worktree** `$SP/lane-fix-g4` · **branch** `fix-g4-golden-door-proofform-2026-09-20`
**Base** `7a4ea48e9` (the ninth lighting refreeze; `git status --short` EMPTY at start)
**Nothing is committed on this branch.** Four units are prepared, staged and patched.
`$SP = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`
`$SC = $SP/lane-fix-g4-scratch`

---

## 0. STATE OF THE WORKTREE, EXACTLY

```
git -C $SP/lane-fix-g4 status --short
M  docs/shift-records/README.md
M  tests/helpers/goldenRecordDoor.js
MM tests/lint/goldenFreeze.walker.test.js
```

⚠ **`tests/lint/goldenFreeze.walker.test.js` is `MM` ON PURPOSE — two units touch it.**
The INDEX holds commit 1's content; the WORKTREE holds commit 4's (final) content. That is the
same shape FIX-P10's note describes. Both states are also whole files in `$SC`:

| state | file | sha256 |
|---|---|---|
| base (HEAD) | `$SC/goldenFreeze.walker.PRE-CURE.txt` | `24b01b9b2281645256a47c1f6074fc3276def44ba7db2edc03a6217b78766443` |
| after commit 1 (= the index) | `$SC/walker.AFTER-C1.js` | `d72b4ecd0eca125366565769532eeed7eb0abc49ab2aeb113f0c3161788c9d12` |
| after commit 4 (= the worktree) | `$SC/walker.FINAL.js` | `75e84510d8be75e4beb61cbf91da07e171ff8d29323bdbe55081eded1c6b71ae` |
| base door | `$SC/goldenRecordDoor.PRE-CURE.mjs` | `6e6d22f5ed7fe018e49e56bc20d59a8345cd276eea51f906b1cc01b38fc582c9` |
| door after commit 2 (= worktree) | `tests/helpers/goldenRecordDoor.js` | `197f51910947107d63e145b1120a314eb4fb2c4a8a9b06f1c645723fb689d643` |
| base README | `$SC/shift-records-README.PRE-CURE.md` | `a756356dbb1131626aa7f6ad0c0b9b6514fa06d673569de7ba037e54bce0ea24` |
| README after commit 3 (= worktree) | `docs/shift-records/README.md` | `fa9a53ecf236e6d805c5a1568249e6fc63aad155e943733e846b58ff24e4c1ba` |

**Nothing under `tests/` or `src/` was committed by this lane** (the 13:08 law — the batch's full
check is that proof). Commit 3 is `docs/` only and I did **not** commit it either: see §2.

---

## 1. THE FOUR UNITS, IN ORDER

Apply in this order. Each patch is a real `git diff` with index lines, so `git apply --3way`
works. **All four were dry-run applied in order in a throwaway detached worktree cut at
`7a4ea48e9` and every resulting blob is byte-identical to mine** (see §5).

| # | pathspec (EXACT) | patch | message | sha256 of patch |
|---|---|---|---|---|
| 1 | `tests/lint/goldenFreeze.walker.test.js` | `$SC/patches/commit-1-walker-arms.patch` | `$SC/messages/commit-1.msg` | `17732f8738dc42e032b589a3cff70fa89453cb122adffba99dc19dc507161317` |
| 2 | `tests/helpers/goldenRecordDoor.js` | `$SC/patches/commit-2-door-learns.patch` | `$SC/messages/commit-2.msg` | `783bc6117e1766a755ec1308053e1aacab1ff731100c14fc4bf0ff01167ff0d8` |
| 3 | `docs/shift-records/README.md` | `$SC/patches/commit-3-readme.patch` | `$SC/messages/commit-3.msg` | `9e96770343889223a02397d88971bf1194d346f390fd3e047273a9ce8f6ac7b1` |
| 4 | `tests/lint/goldenFreeze.walker.test.js` | `$SC/patches/commit-4-historical-replay.patch` | `$SC/messages/commit-4.msg` | `119daf76d005840b0ec51c766a06f92ef4431eeed5c2ee2b61ad6e6964bd1acd` |

Commit with the explicit pathspec, never `-a`:
`git commit -F "$SC/messages/commit-N.msg" -- <the pathspec above>`

**Trailer.** Every message file already ends with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`,
the spelling the chair's dispatch named. If the composer's harness appends
`Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`, KEEP BOTH (LANE-PARALLEL's
TRAILER RULING). **Never amend.**

Each message carries one line reading `BATCH GATE RECEIPT: <the chair fills this>` — that is where
the whole-directory count lines go.

---

## 2. WHAT I DID AND DID NOT COMMIT, AND WHY

I committed **nothing**, including commit 3.

Commit 3 (`docs/` only) is mechanically independent, and the chair's dispatch permitted me to land
it. I did not, on one judgment: its first corrected sentence states the `proofForm` law **as built
by commit 2**. Landing it on this branch would make it commit 1 of the lane, so a cherry-pick in
branch order would put a sentence describing a learning door into a tree whose door does not learn
— the exact class of false record this commit exists to cure. It is therefore third, after the
door. Veto by landing it first; nothing breaks, the tree is briefly wrong.

---

## 3. RED-FIRSTS: EXECUTED vs OWED

### ✅ ALREADY EXECUTED AND QUOTED (plain node, ungated — `$SC/redfirst-and-replay.log`)

The discrimination the three-case pin is about, run against the PRE-CURE decision and the CURED
one. The PRE-CURE decision is not reasoned: it is what the pre-cure door **executed** (it
completed a write and left `proofForm` null — `$SC/sandbox-learn.log`).

```
pre-cure module exports registerWriteSet: undefined
cured    module exports registerWriteSet: function

  CASE 1  null row + lawful signed form -> write set GAINS proofForm
      PRE-CURE: FAIL     CURED: PASS
  CASE 1b null row: the LEARNED value is the signed one
      PRE-CURE: FAIL     CURED: PASS
  CASE 2  set row + EQUAL form -> write set is the unchanged three
      PRE-CURE: PASS     CURED: PASS
  CASE 4  a form outside the vocabulary is never learned
      PRE-CURE: PASS     CURED: PASS
CASE 3  set row + DIFFERENT form -> PROOF_FORM_MISMATCH (the existing refusal, unmoved)
      PRE-CURE: PROOF_FORM_MISMATCH     CURED: PROOF_FORM_MISMATCH     verdicts identical: true
```

Also executed and quoted: the hermetic end-to-end sandbox (first use writes the form; an equal
second use moves only `ownerRow`; an unequal second use refuses `PROOF_FORM_MISMATCH` and leaves
both register and fixture byte-unmoved), and the pre-cure/cured refusal comparison — **17 of 17
`verifyShiftRecord` verdicts identical, 5 of 5 `recordGolden`-only refusals identical, REFUSALS /
PROOF_FORMS / ACTIONS / SIGNATURE_ENV / REGISTER_REL tables identical**.

### ⛔ STILL OWED AS A GATED RUN — commit 1 at its own boundary

After applying **patch 1 only** (do not apply patch 2 yet):

```
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/goldenFreeze.walker.test.js
```

**Expected: RED.** Be precise about the shape — this is a **link-time** failure, not an assertion
failure, so there may be **no failing test title at all**: the file fails to collect and the error
names the missing export, e.g. `does not provide an export named 'registerWriteSet'`. A GREEN here
is a STOP (it would mean the door already learns). Then apply patch 2 and re-run the same command:
**expected GREEN, and it must print a count line** — a gate line with no count DID NOT RUN.

### OPTIONAL, if the chair wants a red-first with named titles
With patches 1+2 applied, change `registerWriteSet`'s `const learned = registered === null && …`
to `const learned = false;`, run the same focused command, and exactly these two titles red:
`CASE 1 — a null row and a lawful signed form: the write set GAINS proofForm` and
`DISCRIMINATION: the PRE-CURE write set is kept executable, and it cannot learn`.
Revert with `git checkout -- tests/helpers/goldenRecordDoor.js`. I did not run this; the plain-node
table above is the same discrimination, already executed.

---

## 4. THE WHOLE-DIRECTORY BATCH THIS LANE OWES (ONE DIRECTORY PER INVOCATION)

Measured with `git grep -l -F goldenRecordDoor -- tests scripts` at the base — a walker can live in
any directory, so every directory holding a file that NAMES the door runs whole:

```
tests/lint          ← mandatory always; both new arm groups live here
tests/helpers       ← the door lives here, and the directory holds three suites
tests/domain        ← ruinInstitution · routeNetworkDormancy · townCartographyCalibration
tests/property      ← 40+ capture arms, and the §6 goldens
tests/simulation    ← presetLightingWitness
```

Each as:
```
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 <ONE directory>
```
Redirect to a file and read the file; never pipe a gate (a pipeline masks the exit code).

`tests/lint/sovereigntyLightingContract.walker.test.js` runs ONCE, separately: **EXPECTED RED** by
this lane's title delta (§6). ⛔ NEVER REFREEZE.

**eslint is already discharged, bare, exit 0** on both touched source files, at commit 1's content
and at the final content. `docs/` needs none.

---

## 5. DRY-RUN APPLY — EXECUTED, NOT REASONED

`git worktree add --detach $SC/dryrun 7a4ea48e9`, then the four patches in order:

```
Applied patch to 'tests/lint/goldenFreeze.walker.test.js' cleanly.   commit-1 -> exit 0
Applied patch to 'tests/helpers/goldenRecordDoor.js' cleanly.        commit-2 -> exit 0
Applied patch to 'docs/shift-records/README.md' cleanly.             commit-3 -> exit 0
Applied patch to 'tests/lint/goldenFreeze.walker.test.js' cleanly.   commit-4 -> exit 0
```

Resulting blobs, byte-identical to this lane's:
`75e84510…` walker · `197f5191…` door · `fa9a53ec…` README. Worktree removed
(`git worktree remove --force`); `git worktree list` no longer names it.

---

## 6. REGISTER DELTAS THIS LANE MOVES

**LIGHTING CENSUS** — baseline at `835f81812` (fresh at this lane's base):
`files 2665 · parked 359 · credited 2306 · titles 25530 · suiteTitles 6815`.

| | files | parked | credited | titles | suiteTitles |
|---|---|---|---|---|---|
| commit 1 | +0 | +0 | +0 | **+6** | **+1** |
| commit 4 | +0 | +0 | +0 | **+1** | +0 |
| **lane total** | **+0** | **+0** | **+0** | **+7** | **+1** |

Counted from the AST at this tip: `it`/`test` literal titles 90 → 97, `describe` literal titles
13 → 14, in `tests/lint/goldenFreeze.walker.test.js`. No test file is created or renamed, so
`files` cannot move; the file was credited before and stays straight-line (no `it.each`, no
`for…of` at a describe/test statement position — all iteration is inside an `it` callback), so
`parked`/`credited` cannot move. **Predicted arithmetically; the measured tuple is owed from the
batch's lighting run — never refreeze.**

**mutation-coverage manifest** — no delta. `tests/lint/goldenFreeze.walker.test.js` already
carries `{"kind": "mutation", "label": "golden-freeze/the exclusion roster loses a spelling while
reading as maintained"}`, and the manifest is keyed on test FILES, none created or renamed.

**negative-assertion anchors** — no delta and no frozen row needed. The new arms use exact-equality
positives (`toEqual([...])`), never `not.toContain` / `not.toMatch` / `not.toHaveProperty`, so no
site enters the scan. (`goldenFreeze.walker.test.js` has no row in the allowlist today and gains
none.)

**source-citation roster** — no delta. `docs/shift-records/README.md` is already classified `tree`
(archival) by `ARCHIVAL_TREES`; no document joins or leaves a class, so `byRule` is unmoved.

**The freeze register itself — unmoved, byte for byte**
(`dd26029839230796bd42f5e3acc2cfba050492eb7016857d1bd61118ce9c7d44`). This lane never hand-edits it.

**The §6 goldens — unmoved**, hashed before the first edit and after the last:
`7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` (generator-golden-master) and
`88983938ddcf28341031e186d855fef950e6b299ec4b8fc87f170ece1b994084` (dossier-prose-manifest).

---

## 7. SAFETY, STATED

`UPDATE_GOLDEN`, `GOLDEN_SHIFT_SIGNED`, `LIGHTING_CENSUS_REFREEZE` and every `UPDATE_*` door were
**never set in any shell**. The one signature assignment was on `process.env` inside a single node
process, pointing at a sandbox file named `SIMULATED-fix-g4-never-signed.json` inside a scratch git
repo the harness builds and removes, and which it refuses to build outside `lane-fix-g4-scratch`.
The real register, a real fixture and a real record were never driven through the door. No stash,
reset, clean, rebase, amend, `--no-verify`, push or `--ignore-other-worktrees`. The foreign stash
was not touched. The only `git worktree` use was the dry-run, removed.

## 8. HARNESSES AND LOGS (all under `$SC`)

`measure-base.mjs` → `measure-base.log` (the register, the records, the replay inputs) ·
`sandbox-learn.mjs` → `sandbox-learn.log` (the hermetic end-to-end proof and the refusal diff) ·
`redfirst-and-replay.mjs` → `redfirst-and-replay.log` (the three-case discrimination, the replay,
the counterfactual, the parse check, the title delta) · `split-units.mjs` (the commit-1/commit-4
split, guarded) · `eslint.log`.
