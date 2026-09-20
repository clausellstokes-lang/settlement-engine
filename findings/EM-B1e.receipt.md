# EM-B1e — §12 COMPLETION RECEIPT, filled BY EXECUTION

**Lane:** Opus BUILD, sealed dispatch, session 7d3418f8, 2026-09-19 EDT.
**Worktree:** `$SP/slot-2` on `fixes-2026-09-18-consist`. **Packet:** EM-B1e version 2, READY, floating.
Every row below is **CONFIRMED** (quoted command output) unless it says PLAUSIBLE.

## Base, seal, final tree state

| item | value |
|---|---|
| branch | `fixes-2026-09-18-consist` (confirmed at dispatch: `branch --show-current`) |
| base at build | `76be138a1eabd3fe251e467e969cfa21bc3aabbb` |
| packet `verifiedBase` | `fa931e5080b04795dc41ab97d952cbf2c6cd8727` (ancestor; dispatch exit 0) |
| seal digest | `4e4190e2197d40b2777fca661ad3b42d059c0a716a035301d09807cd0f78386a` |
| capsule digest | `1f101e38a477829639950cf4a659321f959055df0d014f59ae922bbf282e59a3` |
| preamble SHA-256 | `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1` — **equals the packet header** |
| **commit** | **`8f714cf3ceabef10c735f23b05783c7cddfcba34`** |
| `git show --stat HEAD` | exactly the two §7 paths, `2 files changed, 386 insertions(+), 6 deletions(-)` |
| `git status --short` | **EMPTY** |
| pre-commit hook rewrite | **NONE** — post-commit digests equal the pre-commit ones (kernel `1b1ed851…`, test `329ac872…`) |

## `max-lines` headroom, before and after

```
PRE   raw 832 · EFFECTIVE 453 · ceiling 800 · HEADROOM 347
POST  raw 867 · EFFECTIVE 457 · ceiling 800 · HEADROOM 343
CONTROL roadsKernel.js effective=838 — EXACTLY its frozen .size-baseline value of 838
```
The control proves the counter reproduces eslint's own `{skipBlankLines, skipComments}`
arithmetic. Packet predicted ≈453 → ≈463; **measured 457**. Far below the 780 STOP.

## Changed files and effective-line deltas

| file | action | raw | effective |
|---|---|---|---|
| `src/domain/worldPulse/calamityKernel.js` | MODIFY | +41 / −6 | **+4** |
| `tests/domain/ruinInstitution.test.js` | CREATE | +345 | n/a (test) |

**Why raw +41 but effective +4** — classified by execution over `git diff -U0`:
`ADDED {total:41, comment:31, code:10}` · `REMOVED {total:6, comment:0, code:6}`
⇒ net code `10 − 6 = +4`, matching eslint's arithmetic exactly. The 31 are the writer's
JSDoc block. **Budget: ≤20 effective total ⇒ +4. ≤3 per call site ⇒ +0 per site** (each
site is one line before and one line after).

## ⭐ A1 — the pre-edit and post-edit records, both quoted, proved identical, BOTH sites

Captured through the EXPORTED `advanceCalamity` (the writer and its enclosing
`applyStrikeToRoster` are module-private), driver copied from
`tests/domain/calamity.kernel.integration.test.js` (`runStrike` / `struckOf`).

```
DESTROY arm (call site :286)
 PRE  {"name":"Blacksmith","category":"crafts","status":"ruined","_worldPulseInactive":true,"_worldPulseEconomyClosed":true,"worldPulseFate":"destroyed_by_disaster","remnantReason":"Destroyed outright by the disaster."}
 POST {"name":"Blacksmith","category":"crafts","status":"ruined","_worldPulseInactive":true,"_worldPulseEconomyClosed":true,"worldPulseFate":"destroyed_by_disaster","remnantReason":"Destroyed outright by the disaster."}
COLLAPSE arm (call site :282)
 PRE  {"name":"Tavern","category":"lodging","status":"ruined","_worldPulseInactive":true,"_worldPulseEconomyClosed":true,"worldPulseFate":"destroyed_by_disaster","remnantReason":"Razed as the district collapsed to a single survivor after the disaster."}
 POST {"name":"Tavern","category":"lodging","status":"ruined","_worldPulseInactive":true,"_worldPulseEconomyClosed":true,"worldPulseFate":"destroyed_by_disaster","remnantReason":"Razed as the district collapsed to a single survivor after the disaster."}
```
**IDENTICAL, character for character, both arms.** Five keys, same values, same ORDER.

## Acceptance A1–A7 — executed

`Tests 7 passed (7)`, exit 0. All seven arms green post-implementation.

| ID | verdict |
|---|---|
| A1 | byte-equality, both arms, with the guard-the-guard non-empty + `"status":"ruined"` checks ahead of the equality |
| A2 | decree fate and cause flow through; no disaster vocabulary in the record (anchored by the decree fate) |
| A3 | missing / empty / non-string `fate` or `reason`, and the bare call, each throw; nothing coerced |
| A4 | all three goldens bytewise unchanged |
| A5 | input unmutated vs a `structuredClone`, a NEW object, identical inputs equal, 100 calls change nothing |
| A6 | fate read as free text by the real `institutionProvenanceOf`; the leash verdict via the real `advanceCauseLifecycle`; **sufficiency arm**: with `worldPulseFate` deleted the verdict is unchanged |
| A7 | exactly one `status: 'ruined'` writer in `src/`, both controls, plus the convergence fence in both directions |

### ⚠ THE RED-FIRST DIVERGENCE, RECORDED NOT HIDDEN

The red-first run produced `Tests 4 failed | 3 passed (7)`, exit 1 — **four** arms red,
not the seven my note predicted. Every failure read `TypeError: ruinInstitution is not
a function`. Vitest resolves a missing named export to `undefined` rather than failing
the module link, so only the arms that CALL the writer red. A1, A4 and A7 are
**invariance guards**: they must be green before and after, and making them red
pre-edit would have meant asserting something false. The chair accepted this reading;
their liveness is proved below instead of by the red.

## ⭐ A7's hit list, quoted whole, with the matcher named and both controls

```
matcher: COMMENT-ONLY strip (blanks // and /* */, KEEPS string contents), /status:\s*'ruined'/
files scanned under src/ : 2246
hits : 1
 ["src/domain/worldPulse/calamityKernel.js"]
matcher fires on a PLANTED writer?  true     ← positive control, REQUIRED
matcher IGNORES a commented writer? false→ignored, i.e. test returns false  ← negative control, REQUIRED
```
⛔ The estate's shared `codeOnly` is the WRONG tool here (it blanks string contents, so
it returns **0** and the arm would be vacuously green); a raw byte scan returns **4**
(three are JSDoc prose describing the shape). Identical result pre-edit and post-edit.

## §P6 mutants — planted, convicted, restored digest-exact

Pre-mutant SHA-256 of the MODIFY path: `1b1ed8510ce5f8a97496541ba4d1aa610c7a8c774ddb53d8ba085e57a9a21ad8`.

| mutant | bytes changed | exit | title red | ambiguity | restored |
|---|---|---|---|---|---|
| **M1** key ORDER transposed (`remnantReason` before `worldPulseFate`) | `ff4218b0ebca495402a84c67c61831de44ba166aff9b200ac0f697e0364e8a33` | 1 | **`A1 BYTE-EQUALITY…`** | none — `1 failed \| 6 passed` | `1b1ed851…` ✓ |
| **M2** the `fate` guard deleted | `042c3e9f7c83966fac1831fbf1b0cfc1d80a4b463d0ad9f646bca3f8878c0b52` | 1 | **`A3 both arguments are REQUIRED…`** | none — `1 failed \| 6 passed` | `1b1ed851…` ✓ |

M1's failure output named the transposition itself (expected `…"worldPulseFate":…,"remnantReason":…`
vs received `…"remnantReason":…,"worldPulseFate":…`), which is the strongest available
proof that A1 guards key ORDER and not merely key presence. Focused green re-run after
restore: `Tests 7 passed (7)`, exit 0.

⛔ **No mutant touched a third file.** A7's liveness is its two REQUIRED in-arm controls;
A4's is a digest-sensitivity probe executed in SCRATCH (one byte flipped in a scratch
copy of the witness golden changes the digest from `7f67ee8e…` to `48d24a5b…`). A source
mutant for either would have had to write a path outside §7 — a STOP.

## Focused commands, exits and counts

| command | count line | exit |
|---|---|---|
| RED-FIRST `tests/domain/ruinInstitution.test.js` | `Tests 4 failed \| 3 passed (7)` | 1 |
| `tests/domain/ruinInstitution.test.js` | `Tests 7 passed (7)` | 0 |
| `calamity` + `calamity.kernel.integration` + `ruinFilter.probe` + `institutionStatusModel` | `Tests 95 passed (95)` | 0 |
| `tests/simulation/presetLightingWitness.test.js` | `Tests 7 passed (7)` | 0 |
| `generatorGoldenMaster` + `dossierProseManifest` | `Tests 18 passed (18)` | 0 |
| `ruinFilterRoster.walker` + `negativeAssertionAnchor.walker` + `mutationCoverageManifest` | `Tests 31 passed (31)` | 0 |
| `tests/copy/voiceMechanics.test.js` | `Tests 30 passed (30)` | 0 |
| `tests/lint/sovereigntyLightingContract.walker.test.js` (ONCE) | `Tests 1 failed \| 33 passed (34)` | 1 — **expected interior red** |
| `npx eslint` on both §7 files | — | 0 |
| `node scripts/check-observed-shape-readers.mjs` | `1964 finding(s), exactly matching the frozen inventory.` | 0 |
| `node scripts/check-writer-reach.mjs` | `judged 6537 · LIT 572 · LIT-NAME 4671 · DARK 1294` | 0 |
| `node scripts/implementation-packets.mjs validate` | `valid: 189 packets (2 READY)` | 0 |
| `npm run check:packet -- EM-B1e` | all 14 steps exit 0 | **0** |
| `npm run implementation:resume -- EM-B1e` | all 14 steps exit 0 | **0** |

Every vitest run went through `gate-mutex.sh --run` at SHARED tier with
`GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20`, ONE test directory per
invocation, **bare** (no shell pipe — §P7), exit captured in-shell. Every gate line
printed a test count.

⚠ **ONE GATE WAS RE-RUN.** The first batch-1 invocation was read through `| tail -20`,
which §P7 forbids and which swallowed the exit status; it was immediately re-run bare.
Both runs printed `Tests 7 passed (7)`.

⚠ **ESLINT REDDED ONCE AND WAS FIXED, NOT SUPPRESSED.** `no-useless-assignment` at
`ruinInstitution.test.js:271` — the A3 arm's `catch { leaked = null; }` re-assigned a
value already null. The catch body was emptied (with a comment) rather than disabled;
eslint then exit 0 and the acceptance file was re-run green `Tests 7 passed (7)`.

## Both typecheck configurations, by name

```
typecheck:ratchet        (tsconfig.full.json)          OK — no type regressions (167 error(s), ceiling 167)        exit 0
typecheck:domain:strict  (tsconfig.domain-strict.json) ✓ no strict-type regressions (1113 errors, ceiling 1113)   exit 0
```
Neither ceiling was raised.

## Goldens, dormancy and the preset witness digest

| fixture | before the first edit | after the last edit / post-commit |
|---|---|---|
| `generator-golden-master.json` | `7177cd6e…8f1e` | **identical** |
| `dossier-prose-manifest-golden.json` | `921c51cf…db41` | **identical** |
| ⭐ `preset-lighting-witness-golden.json` | `7f67ee8e6cda2b7e70a780090b16db20a4f8032a1746a51b2e044dd69bd98ae2` | **identical** |

`UPDATE_GOLDEN` and `GOLDEN_SHIFT_SIGNED` were **never set**. The preset witness suite —
the instrument that actually covers this path (52 interior one-week ticks, no capture
arm by design) — is green on its own run. **No behavior shift of any kind occurred**:
the calamity record is byte-identical, which is the packet's whole claim.

## Census tuple, and the interior red quoted verbatim

```
AssertionError: the estate's file count moved — re-measure, do not re-word: expected 2649 to be 2646
  - Expected 2646
  + Received 2649
```
Frozen baseline (`tests/lint/.lighting-census-baseline.json`, measuredBy EM-P0):
`2646 · 383 · 2263 · 25005 · 6671`.

| figure | live pre-CREATE | live post-CREATE | my delta | packet's stated DELTA | status |
|---|---:|---:|---:|---|---|
| files | **2648** | **2649** | **+1** | +1 | ✅ **CONFIRMED by execution** |
| parked | 383 | — | +0 | +0 | ⚠ PLAUSIBLE — not evaluated |
| credited | 2265 | — | +1 | +1 | ⚠ PLAUSIBLE — not evaluated |
| titles | 25015 | — | +7 | +7 | ⚠ PLAUSIBLE — not evaluated |
| suiteTitles | 6675 | — | +1 | +1 | ⚠ PLAUSIBLE — not evaluated |

⚠ **WHY FOUR ROWS ARE PLAUSIBLE RATHER THAN CONFIRMED.** The walker asserts `files`
FIRST and the assertion **short-circuits**, so parked / credited / titles / suiteTitles
were never evaluated on this run, and the walker may be run only ONCE. The pre-CREATE
`files` figure 2648 is my own probe, executed before the first edit, and it matches the
chair's stated live tuple. The other four deltas are derived from the CREATE's own shape
— **one literal `describe`, seven straight-line `it`, credited not parked** (grammar
verified: plain `import { describe, it, expect } from 'vitest'`, no `.each`, no `runIf`,
no nesting, no conditional registration; `grep -c` returns 1 describe and 7 it). **The
host train's terminal re-derives the tuple whole.**
⛔ `LIGHTING_CENSUS_REFREEZE` was **never set**. No refreeze was attempted.

## Base-versus-wave failure identity diff

The only red in the whole batch is the lighting census `files` figure, which is the
packet's **declared, deferred** interior red (§7's P2.1) and was already red at this tip
before the lane started (un-refrozen landings: frozen 2646 vs live 2648). **No new
failure identity appeared.** Every other suite, walker, reader, typecheck and sealed
step exited 0.

## Registration ledger — each row's outcome

| row | verdict |
|---|---|
| P2.1 lighting census | OWED, deferred; +1 files executed; **no refreeze** |
| P2.2 mutation-coverage | NOT OWED — `tests/domain` is not an enforcer dir; `mutationCoverageManifest` walker green |
| P2.3 observed-shape exemption | NOT OWED; scan **unmoved** at 1964 findings |
| P2.4 writer-reach | **MEASURED AND RECORDED, never written.** Output byte-identical to the pre-edit baseline ⇒ no motion, **no growth** |
| P2.5 decision-fork / mechanism-coverage | NOT OWED — deterministic, total, no draw |
| P2.7 prose-numerics | NOT OWED — no figure rendered |
| edge-shared closure (§P2 row 10) | **NOT OWED**; **no `supabase/functions/_shared/**` path written**, no generator run by any declared command |
| bundle budgets (§P2 row 11) | no budgeted chunk; see the byte figure below |
| declared-command write set (§P2 row 12) | **CLEAN** — `git status --short` empty after the commit; the only paths ever written in the worktree were §7's two |

## ⭐ Measured minified byte delta, for TOOL-3's ceiling

```
PRE  whole-file minified : 13845 B
POST whole-file minified : 14282 B
DELTA                    : +437 B minified (esbuild, un-gzipped)
```
⚠ **THIS DIVERGES FROM THE PRE-PROOF'S PREDICTED +270 B AND TOOL-3 MUST USE +437 B.**
The overrun is the two diagnostic `TypeError` messages, which §6 requires as throws but
does not bound in bytes. **No budget is breached** — the file is reachable only from the
**uncapped** `advanceInterval.worker` (not the generation worker, not the lazy engine,
not the eager first-paint set). R6's recommendation (land EM-B1e before TOOL-3) held.

## `ruinFilterRoster` walker — green, with the token's new line number

The walker enrols `calamityKernel.js` as a roster reader and its ONLY compliance
evidence is the token `_worldPulseInactive`. The lift stayed **in-file**, so the token
survives: **now at `:246`** (was `:251`). Walker green in the `Tests 31 passed (31)` run.
The §11 trap (lifting to a new leaf would strip the file's last compliance token and red
this walker) was **not** taken and never became reachable — 343 lines of headroom.

## Deviations

**`NONE`** — no STOP condition was met. Three items are recorded above rather than
hidden: the red-first divergence (accepted by the chair), the one piped gate re-run
bare, and the eslint red fixed rather than suppressed.

## Judgment calls

**`NONE`** of the packet's kind — no contract was interpreted, no scope widened, no
alternative chosen where the packet named one. Two **method** calls, both recorded so
they can be vetoed:

1. **A4 pins the three golden digests as literals.** The estate's
   `.golden-freeze-register.json` is deliberately UNFROZEN (every `sha256` is null and
   filling one is expressly forbidden), so there was no register to assert against. The
   arm carries no env spelling and no capture arm, so it cannot be quietly re-recorded.
   ⚠ **Consequence the chair should note: the preset witness now has a second pin, in a
   file outside the freeze register.** A future lawful pulse shift must re-record BOTH.
2. **The census's other four figures are derivation, not execution** (above), because
   the walker short-circuits and may be run only once.

## Out-of-scope observations — noticed, NOT investigated, NOT touched

- **R7 stands and is now sharper.** 28 hand-built replicas of the ruin shape live across
  ~18 `tests/` files; `ruinFilter.probe.test.js:27` calls itself *"the exact
  calamityKernel.ruin stamp"*. None imports the writer, so none moved — but a canonical
  writer now exists for them to route through, and until they do they will drift from it.
- **R4 stands**: `institutionStatusModel.js:99` holds a FOURTH institution vocabulary
  (`['operational','impaired','shell']`), distinct from `EntityStatus` and the pulse's
  ruin set.
- **R2/EM-B1h is now load-bearing**: `worldPulseFate` still has no closed vocabulary, and
  this packet adds a ninth free spelling site's worth of surface by making the fate a
  caller-supplied argument. A6 proves the VALUE is inert at today's consumers by
  sufficiency, so nothing is owed here — but EM-B1h should land before EM-B1a makes
  `ruined_by_decree` actually producible, exactly as the chair chartered.
- **R9 stands for EM-B1a**: a decree-ruin joins an authored act to an irreversible
  consequence (a criminal leash severs through `causeLifecycle.institutionDestroyed`).
  This writer is agnostic; the undo question is EM-B1a's.
