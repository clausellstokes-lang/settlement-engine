# EFF-M1A — the parallel pre-proof harness

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `954b4e0f7cfcc18426da352d6dda34ece6c2a53b`
- **Train:** `eff-1a`, member 1 of 4 — the tools half of the §74/§77 efficiency stack
- **Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` @ SHA-256
  `c4e3f531ba585ef6d033ac3deb3b88ece5648c527c6ef7f46020ef0156de38ce`
- **Authorities:** `OWNER_DECISION_QUEUE.md` §74.3 (the law), §76.2 (the draft), §83 (the
  R-EFF audit), §86.4 (the three named compile obligations) · `DESIGN_BUILD_EFFICIENCY.md`
  §2.7 (canonical law text, ledger branch) · the `laneP74` charter and the `laneREFF` audit
  with its cure-pass addendum, both non-authoritative drafts re-derived here per §63
- **Compiled and executed by:** Lane TE16

---

## §1 Scope and boundary

**This member lands ONE new script, `scripts/preproof-train.mjs`, and nothing else.** It adds
no test file, no npm script, no config, no production line, and no documentation. It is
deliberately un-wired from every npm script so the check-chain mutex can never catch it.

Its proof is an **EXECUTED RECEIPT, not a new test file** — a deliberate choice recorded at
§76.3: a new test file reds two censuses at their pinned ceiling, and the census is already at
that ceiling, so the only doors would be lock-the-win, re-point, or cure. None is warranted to
prove a harness whose whole subject matter is process behaviour (worktrees, signals, process
groups, caches) that a vitest suite cannot observe honestly from inside itself.

**Explicit non-goals.** No cap-enforcement lint (train plans are already a chair STOP
surface). No edit to `package.json`, `package-lock.json`, `vite.config.js`, `eslint.config.js`
or any CI file. No wiring into `npm run check`. No change to §2.2 per-member proof, the
terminal gate, censuses, truncate-to-green, or flag boundaries.

---

## §2 Required verified tree contract

| Role | Path and symbol | State at base (EXECUTED) |
|---|---|---|
| The deliverable | `scripts/preproof-train.mjs` | **absent** at base |
| eslint posture precedent | `scripts/base-state-capsule.mjs` | present; a landed `.mjs` under the `scripts/**/*.{js,mjs,cjs}` flat-config block |
| The lint scope | `eslint.config.js`, the `scripts/**/*.{js,mjs,cjs}` block | node globals, `sourceType: module`, `no-unused-vars` at warn |
| The typecheck scope | `tsconfig.full.json`, `tsconfig.domain-strict.json` | **neither includes `scripts/`** — a new script moves no typecheck figure |
| Vitest cache resolution | `node_modules/vite/dist/node/chunks/config.js` | `cacheDir = config.cacheDir ? resolve(resolvedRoot, config.cacheDir) : pkgDir + '/node_modules/.vite'` |
| Vitest reporter registry | `node_modules/vitest/dist/chunks/index.*.js`, `ReportersMap` | `default · agent · minimal · blob · verbose · dot · json · tap · tap-flat · junit · tree · hanging-process · github-actions` — **`basic` is absent** |
| The estate test config | `vite.config.js`, the `test` block | no `cacheDir`; `testTimeout: 20000` (in-test hangs only) |

**Forbidden files:** everything not in §4. **Forbidden alternative homes:** the harness does
not become an npm script, a vitest plugin, or a gate step.

---

## §3 Exact contracts this member settles

### 3.1 Exit semantics — the whole point of the file

- **0** — every member battery ran and passed.
- **1** — every member battery RAN and at least one was red. **This is the ONLY exit-1 class**,
  and it is the sole truncation signal.
- **2** — any setup, parse, harness, timeout, or startup failure. Battery verdicts are
  incomplete and **no truncation signal is implied**.

### 3.2 Plan shape, enforced before any worktree exists

`{repo, tmpRoot, jobs, timeoutMs, members[{name, ref, battery[]}]}`. Strings where strings are
required; `jobs` finite; `timeoutMs` a **positive finite number, REQUIRED**; member names
unique and matching `/^[A-Za-z0-9._-]+$/`; batteries non-empty lists of non-empty strings.
Every malformed plan is exit 2 **before** a worktree exists, so a crash further down can never
masquerade as a verdict.

### 3.3 Containment, on realpaths

`realpathSync` both `repo` and `tmpRoot`, then `path.relative` decides containment. This kills
both directions at once: a sibling directory sharing the repo's prefix is NOT refused, and a
symlinked `tmpRoot` pointing inside the repo IS. The member-name charset law forecloses
traversal, so no plan can steer a worktree or a log through `..` into the repo.

### 3.4 ⛔ The S5 pairing, which must not be split

ONE shared in-flight cleanup promise (`cleanupPromise`) **and** a `signalled` flag consulted
before the main path's verdict exit. Either half alone re-opens the race the laneREFF re-sweep
caught: the signal path's group-kill resolves the main path's battery awaits, the main path
resumes, and its verdict exit preempts the still-awaiting signal path — exit 1, stale
registrations, and a "truncation signal" naming a member killed by our own SIGTERM.

### 3.5 The two ADDED obligations (§86.4)

- **R-H1 — every battery is timed.** `plan.timeoutMs` is REQUIRED, not defaulted: a default
  would be an unmeasured constant inside the one artefact whose point is that every figure was
  measured, and the charter deferred the ceiling precisely because it needs real battery
  wall-clocks. Expiry SIGKILLs the process GROUP and reports `phase: 'timeout'` → exit 2.
- **R-D8 — per-worktree cache isolation.** Each member runs under a generated override config
  written OUTSIDE the worktree, re-exporting the member's own `vite.config.js` with an explicit
  `root` and an absolute per-member `cacheDir` under the run root. The `node_modules` link stays
  a PLAIN write-through symlink, exactly as the charter's harness contract requires; isolation
  is bought by the config, not by pretending the link is read-only. ⚠ Measured precisely: the
  override adds no entry to the throwaway tree's own status, but that tree is not
  porcelain-empty — `git status` there reports `?? node_modules`, because `.gitignore`'s
  `node_modules/` pattern matches a DIRECTORY and the link step creates a SYMLINK. The tree is
  removed with `--force`, so nothing survives the run.

### 3.6 A red is only a red if the battery ran

vitest exits 1 for a failing test **and** for a startup error, so the exit code alone cannot
carry the truncation signal. Each battery also writes a JSON result; a nonzero exit is graded a
battery RED only when that result exists and names at least one executed test. Anything else is
`phase: 'startup'` → exit 2.

---

## §4 Change manifest

| Action | Path | Region / symbol | Effective-line delta | Instruction |
|---|---|---|---|---|
| CREATE | `scripts/preproof-train.mjs` | whole file | 0 production (a workflow script, not a production leaf) | author per §3 |

**One handwritten file.** Zero production leaves, zero modified production files, zero
registration files, zero new persisted families, zero flags, zero user-facing surfaces, zero
test files, zero generated artifacts.

`retiredSymbols`: **NONE.**

---

## §5 Acceptance matrix — closed at 8 cases

| id | Case |
|---|---|
| **A1** | happy path: two green members exit 0, and `git worktree list` shows ZERO registrations IMMEDIATELY after exit |
| **A2** | a red battery exits 1 and names the member — the only exit-1 class |
| **A3** | every setup and crash class exits 2 with "NO truncation signal implied": bad ref, garbage `jobs`, missing `repo`, non-string battery entry, duplicate member names, no local vitest |
| **A4** | all three refusal boundaries hold: `tmpRoot` inside the repo refused, a symlinked `tmpRoot` refused, a traversal member name refused — each exit 2 with ZERO repo dirt; and a sibling-prefix `tmpRoot` is ACCEPTED |
| **A5** | SIGTERM mid-run exits 2, registrations are empty IMMEDIATELY after exit, and a DELAYED `ps` with an exact pattern shows zero surviving battery processes |
| **A6** | R-H1: a plan without `timeoutMs` (and one with `timeoutMs: 0`) is refused exit 2; a wedged battery under a live `timeoutMs` reports `phase: 'timeout'` and exits 2 instead of hanging |
| **A7** | R-D8: a real estate battery writes its vitest cache under the per-member `cacheDir` in the run root, and the executor tree's `node_modules/.vite` is byte-identical before and after |
| **A8** | the script is lint-clean under the repo's own eslint and `node --check` exits 0 |

Cases from the standard's edge-case budget that do not apply are omitted, not replaced: this
member writes no state, has no persistence, no lifecycle, no reader and no privacy boundary.

---

## §6 Mandatory implementation order

0. Preflight: branch, base, porcelain, `core.bare`.
1. Baseline evidence: the reporter registry and the cache-resolution site read from the
   installed toolchain, so §3.5/§3.6 rest on measurement rather than on the draft's claims.
2. — (inapplicable: the proof is an executed receipt, not a failing test.)
3. Author the script.
4-6. — (inapplicable: no writer, no consumer, no registration.)
7. Focused verification: A1-A8.
8. **No wave-end full gate** — under a train it moves to the terminal.

---

## §7 Focused checks (argv form, expected exit 0)

```
node --check scripts/preproof-train.mjs
npx eslint scripts/preproof-train.mjs
node scripts/implementation-packets.mjs validate
```

⛔ Every command runs bare with `; echo TRUE_EXIT=$?`. ⛔ Never wrapped in `gate-mutex.sh --run`.
The probe battery itself is an executed receipt and is quoted in the train receipt.

---

## §8 Mutants

**NONE as source mutants, and the reason is recorded rather than omitted.** The file has no
in-repo test to convict it; its trust comes instead from a BOTH-DIRECTIONS probe battery in
which every refusal is proven to refuse AND the adjacent lawful case is proven to be accepted
(the sibling-prefix `tmpRoot` beside the symlinked one; the timed-out battery beside the
timely one; the startup failure beside the genuine red). A probe set that only proved refusals
would be the vacuity this note exists to foreclose.

---

## §9 STOP conditions

1. The script would need an npm-script wiring, a gate step, or any `gate-mutex.sh` contact.
2. Cache isolation would require editing `vite.config.js` or any governed observed-shape path.
3. The timeout would have to be an authored constant inside the harness rather than a plan
   field.
4. Any test census, typecheck ratchet, or walker baseline moves.
5. A probe leaves repo dirt, a stale worktree registration, or a surviving process.
6. The eslint hook reds the file and the resolution would require a hook edit.

---

## §10 Completion receipt

Verified base sha and final tree state · the one changed file · A1-A8 with exact argv and
exits · the probe battery table with every exit read in-shell · the cache-isolation digests
before and after · deviations `NONE` or a STOP · judgment calls recorded in the train receipt.

---

## §11 Landing receipt

**LANDED at the `eff-1a` train's I1 commit `24688a37`.** One script, zero production lines, zero census
motion.

- **A1-A5, A6, A8** — the sixteen-probe battery re-run at this base, every exit read in-shell:
  H1 0 · H2 1 · H3 2 · H4 2 · H4b 0 · H4c 2 · H7 2 · H8 2 · H9 2 · H10 2 · H11 2 · H12 2 ·
  H13 2 · H13b 2 · H14 2 · H15 2, with registrations at ZERO after every single probe and the
  toy repo's porcelain empty at the end. H5 (SIGTERM) exited 2 with registrations empty
  immediately and a delayed `ps` showing zero surviving batteries.
- **A6** — H14 ended the wedged member at 3.1 s under a 3 000 ms ceiling with `phase=timeout`,
  against the 300 s hang it would otherwise have held.
- **A7** — a real estate battery (`tests/domain/canonSave.test.js` at this base) exited 0 in
  2.9 s; its cache landed at `<runRoot>/E1.vite-cache/vitest/…` and the executor tree's
  `node_modules/.vite` digest was `9c558ab63421b5d6debea15a4f936fa2ceca7726` both before and
  after the run.
- ⭐ **ONE DRAFT CLAIM WAS REFUTED BY EXECUTION AND IS CURED HERE, NOT CARRIED.** The draft
  passed `--reporter=basic`, which vitest 4 removed; against the estate that produced a
  STARTUP error, exit 1, and the harness reporting "1 RED — early truncation signal" for a
  reporter typo — R-D6's own class, surviving in a new form the audit's toy could not see
  because its stub ignored the flag. The cure is §3.6's verdict-evidence gate plus a live
  reporter pair, and `phase: 'startup'` is proven in both directions (H15 versus H2).

⚠ **ONE WORDING CORRECTION, MADE WHILE THE CHAIN WAS UNEXPOSED.** §3.5 and the script header
first said the generated config keeps the throwaway worktree "porcelain-clean". Measured in a
temp worktree: the tree reports `?? node_modules`, because `.gitignore`'s `node_modules/`
pattern matches a directory and the link step creates a symlink. The CODE is unchanged and
correct — the config is still written outside the tree — and both sentences now state exactly
what was measured. The three focused checks were re-executed at the terminal commit against the
corrected file.
