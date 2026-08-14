# INFRA-M2-CAPSULE — the base-state capsule generator

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `e6eb4c5d15c827133a8edcd68698f30754dd21ed`
- **Train:** `infra-1`, member 2 of 3
- **Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` @ SHA-256
  `cd04a46315c919694d6eb5a043d74fe6173ec11be359be932d40ecf04af232f5`
- **Authorities:** `DESIGN_BUILD_EFFICIENCY.md` **§3** (the capsule spec, binding) and §8 row 3
  (the slot) · `PACKET_STANDARD.md` · INFRA-PREAMBLE · `OWNER_DECISION_QUEUE.md` §30
- **Compiled by:** Lane TC3. **Executed by:** Lane TE3.

---

## §1 Scope and boundary

**Build `scripts/base-state-capsule.mjs`: one script that regenerates
`docs/implementation/BASE_STATE.json` in its exact existing shape by shelling the measurers that
already exist, inventing no measurement of its own, plus one focused test proving its output
matches an independent hand-derivation at HEAD.**

**Zero product output movement.** No `src/` byte, no simulated output, no golden, no tuning value,
no persisted game state. The only artifact the script writes is a docs-directory JSON that no
runtime path reads.

**Explicit non-goals.**
- ⛔ **No `package.json` edit** (INFRA-PREAMBLE §P2). Ratified by `OWNER_DECISION_QUEUE.md` §30:
  the generator ships no npm-script row and the alias rides the next observed-shape schema mint.
- ⛔ No new measurement spelling for any figure. Every row reads a canonical home; where none
  exists, the script **refuses** rather than inventing one.
- ⛔ No change to `BASE_STATE.json`'s schema, key set, key order, or `schemaVersion`.
- ⛔ No `check` chain edit; no CI edit; no gate step added, removed, or made conditional. The gate
  is AMORTIZED, never THINNED.
- ⛔ No edit to any measurer the script reads.

---

## §2 The two structural findings that shape this member

### 2.1 `package.json` is a governed input — the npm script is DEFERRED

The full statement is INFRA-PREAMBLE §P2 and is not restated here. Its consequence for this
member: the generator is invoked as `node scripts/base-state-capsule.mjs`.
`DESIGN_BUILD_EFFICIENCY.md` §3 requires only *"one script (`scripts/base-state-capsule.mjs`) that
shells the existing measurers"* — the npm alias is convenience, and nothing operational is lost.

> **DELIBERATELY DEFERRED — DOCUMENTED, NOT A BUG TO RE-FIND.** The
> `"capsule:base-state": "node scripts/base-state-capsule.mjs"` row is owed and is batched to ride
> the **next observed-shape schema mint**, where the detector digest is re-derived anyway and the
> row costs nothing extra.

⭐ **A new `scripts/*.mjs` file is NOT a governed input**, and A7 pins that as a measured negative
control rather than leaving it remembered.

### 2.2 Every figure has a canonical home — except one

`runtimeTests` is the source-phase row count and it has **no cheap measurer**. The gate's ratchet
writes its runner report to a temporary directory and discards it, and the baseline's stored total
is a stale FLOOR rewritten only by the bootstrap and update paths, never by the gate. Running the
suite inside the generator would mean a second full-suite run at every flip — which defeats the
exact cost model `DESIGN_BUILD_EFFICIENCY.md` §1 attacks.

⇒ **`--runtime-tests=<N>` is a REQUIRED argument**, transcribed from the flip's own executed
ratchet receipt. The generator refuses to write without it, and validates it against the
**exported** `SCOPE_FLOOR_RATIO` (imported, never re-spelled). The architecturally right cure is
filed as deferral **INFRA-M4** (§9).

---

## §3 Exact contracts this member settles

### 3.1 The artifact shape — FROZEN, byte-compatible with today's

Exactly six top-level keys in this order: `schemaVersion` (literal `1`), `stampedAt`,
`stampedDate`, `method`, `consumptionLaw`, `figures`.

`figures` carries exactly **20** keys, in the order the committed artifact already uses:
`lightingCensus` (string `a/b/c/d/e`) · `runtimeTests` (int) · `frozenKnownFailures` (int) ·
`titleCensus` (int) · `killList` (string `a/b/c/d`) · `osrFindings` (int) ·
`typecheckRatchet` (string `m/f`) · `strictDomainRatchet` (string `m/f`) ·
`hotFiles` (object of exactly the three standing paths → string `eff/ceiling`) ·
`flagManifestRows` · `grammarKindRegistryRows` · `grammarReceiptsPools` · `grammarHeraldKinds` ·
`routedTokens` · `kindPoolFloorsRegisteredKinds` · `kindPoolFloorsRegisteredMinusRouted` ·
`kindPoolFloorsUnvoicedTokens` · `kindPoolFloorsRegistries` ·
`validatePackets` (string `N packets / M READY`) · `voiceMechanicsBankedArms` (int).

⚠ **20 figure keys, 22 PROVENANCE rows.** The two extra rows are `stampedAt` and `stampedDate`,
which are top-level rather than figures. The compile draft's "22 figure keys" conflated the two
counts; the artifact is the authority and it carries 20.

⛔ **A new figure key, a removed key, a reordered key, or a `schemaVersion` bump is a STOP** — a
persisted-artifact schema change is owner-gated and outside this packet's authority.

`consumptionLaw` is emitted as a **frozen string literal** carrying today's text verbatim,
including the docs-only-descendant clause (judgment **J-T1**) and the *"rows a manifest touches are
always re-executed"* clause. `method` is composed from the run's own provenance.

### 3.2 The provenance table — the script's declarative core

The script holds ONE frozen table, `PROVENANCE`, keyed by row name. Every emitted key must have a
row and every row must emit a key (totality, pinned by A2 in both directions). Each row is
`{ kind, home, read, target }` where `kind` is one of:

- **MEASURED** — the script computes the value from the tree (a live ESM import, an eslint `Linter`
  run, or a shell-out to an existing script whose stdout it parses).
- **PINNED** — the script reads an exact-equality constant from its canonical home. That constant
  equals the tree **if and only if** the gate step asserting it is green — which, at a flip, it
  just was.
- **ARG** — supplied by the operator from an executed receipt (`runtimeTests` only).

⚠ This distinction is the mitigation for `DESIGN_BUILD_EFFICIENCY.md` §9's named risk. PINNED reads
are the restatement half; naming them keeps the capsule honest.

**JUDGMENT (vetoable, ratified by §30's silence on it): the `PROVENANCE` table lives in the
SCRIPT'S SOURCE and in this packet, not in the emitted artifact.** Emitting it would change the
artifact's schema, which is owner-gated. Filed as a deferral for a future `schemaVersion` 2.

### 3.3 The 22 provenance rows, every home EXECUTED at this base

| row | kind | home | read |
|---|---|---|---|
| `stampedAt` | MEASURED | git | `git rev-parse --short=8 HEAD` |
| `stampedDate` | MEASURED | git | `git show -s --format=%cs HEAD` |
| `lightingCensus` | **PINNED** | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` object's five literals |
| `runtimeTests` | **ARG** | the flip's ratchet receipt | `--runtime-tests=<N>`, REQUIRED |
| `frozenKnownFailures` | MEASURED | `scripts/.test-ratchet-baseline.json` | `Object.keys(entries).length` |
| `titleCensus` | **PINNED** | `tests/domain/guidanceRegistry.walker.test.js` | `TITLE_BASELINE` |
| `killList` | **PINNED** | `tests/design/deepCraftKillList.test.js` | the four ceiling literals |
| `osrFindings` | MEASURED | `scripts/check-observed-shape-readers.mjs` | shell-out; parse `observed-shape readers: (\d+) finding` |
| `typecheckRatchet` | MEASURED + PINNED | `scripts/check-full-typecheck.mjs` / `.full-typecheck-baseline.json` | shell-out; parse `(\d+) error\(s\), ceiling (\d+)`; frozen from `total` |
| `strictDomainRatchet` | MEASURED + PINNED | `scripts/check-domain-strict.mjs` / `.domain-strict-baseline.json` | shell-out; parse `(\d+) errors, ceiling (\d+)`; frozen from `total` |
| `hotFiles` | MEASURED | eslint `Linter`, `max-lines {skipBlankLines:true, skipComments:true}` | in-process, per the three standing paths |
| `flagManifestRows` | MEASURED | `src/domain/worldPulse/simulationRules.js` | live import, `ENGINE_GATED_VIRTUAL_RULE_KEYS.length` |
| `grammarKindRegistryRows` | MEASURED | `src/domain/worldPulse/grammarNews.js` | live import, `GRAMMAR_KIND_REGISTRY.length` |
| `grammarReceiptsPools` | MEASURED | `src/domain/worldPulse/grammarReceiptPools.js` | live import, `GRAMMAR_RECEIPTS.length` |
| `grammarHeraldKinds` | MEASURED | `src/domain/worldPulse/grammarNews.js` | live import, `GRAMMAR_HERALD_KINDS.length` |
| `routedTokens` | MEASURED | `src/domain/realm/heraldRouting.js` | live import, `Object.keys(EXACT_SECTION).length` |
| `kindPoolFloorsRegisteredKinds` | **PINNED** | `tests/lint/kindPoolFloors.walker.test.js` | `REGISTERED_KIND_COUNT` |
| `kindPoolFloorsRegisteredMinusRouted` | **PINNED** | same | the `toBe(7)` identity |
| `kindPoolFloorsUnvoicedTokens` | **PINNED** | same | `LEGACY_UNVOICED_TOKENS` |
| `kindPoolFloorsRegistries` | **PINNED** | same | the `toHaveLength(9)` identity |
| `validatePackets` | MEASURED | `scripts/implementation-packets.mjs validate` | shell-out; parse `valid: (\d+) packets \((\d+) READY\)` |
| `voiceMechanicsBankedArms` | MEASURED | `scripts/.test-ratchet-baseline.json` | `entries` filtered to `tests/copy/voiceMechanics.test.js` |

⭐ **`routedTokens` is deliberately MEASURED rather than PINNED.** `EXACT_SECTION`'s live key count
**is** the tree; reading the walker's constant would be the restatement. The generator prefers the
source wherever a source exists.

⛔ **How a PINNED constant is read.** By parsing the test file's source for the named identifier's
literal with `espree` (already a direct dependency and the estate's chosen parser for exactly this
job), **never by importing the test module** (importing a vitest file outside a runner throws) and
**never by a regex over text**.

### 3.4 Refusal semantics — the generator fails closed, every time

| Condition | Behaviour |
|---|---|
| `--runtime-tests` absent, non-integer, or below `baseline.totalTests * SCOPE_FLOOR_RATIO` | **THROW**, name the floor, write nothing |
| any measured path is dirty (`git status --porcelain` over `src/`, `scripts/`, `tests/`, and `docs/implementation/BASE_STATE.json`) | **THROW** — a capsule stamped at a sha whose tree it did not measure is worse than none |
| a canonical home is missing, or a PINNED identifier is absent or not a literal | **THROW**, naming the row and its home |
| a shell-out exits non-zero, or its stdout does not match the row's parse | **THROW** — ⛔ never a `0`, `null`, or `"unknown"` fallback |
| `PROVENANCE` and the emitted key set disagree in either direction | **THROW** |
| `git rev-parse HEAD` unavailable | **THROW** |

⛔ **Not one figure may ever be emitted as a default.** A silently-zeroed row in a capsule other
lanes cite as EXECUTED is the worst failure this member could ship.

`SCOPE_FLOOR_RATIO` and the baseline path are **imported** from `scripts/check-test-ratchet.mjs`,
never re-spelled.

### 3.5 The flip procedure this script slots into

Per `OWNER_DECISION_QUEUE.md` §30, **the capsule stamps at the terminal's parent content commit**,
and the consumption law's docs-only-window clause covers the terminal and later docs children.
There is no commit-then-amend step. Concretely, at the `infra-1` terminal: the content commit is
made, the terminal's docs working set is staged in the tree, the gate and boot smoke are run, and
the generator is then invoked with the runtime figure transcribed from the ratchet's own executed
line — at which point `git rev-parse HEAD` still names the content commit, the dirty-tree guard
sees `src/`, `scripts/` and `tests/` clean, and every figure the generator reads is the figure the
terminal will expose.

### 3.6 Testability contract

`main(argv, options)` accepts an optional `options.readAll` injection so the focused battery can
prove the argument guard, the totality guard and the fail-closed arms **without** paying for two
type-check shell-outs per case. The real command-line path uses the real `readAll`, and the
receipt quotes an actual end-to-end run of it. ⚠ A test may never build its expected side from the
generator's own helpers — that is the self-referential-pin class, and A3 is written against
independently coded readers for exactly this reason.

---

## §4 Change manifest

| Action | Path | Region / symbol | Max effective-line delta | Instruction |
|---|---|---|---|---|
| CREATE | `scripts/base-state-capsule.mjs` | whole file | **≤ 250** | the generator per §3.1-§3.4; exports `PROVENANCE`, `capsuleFrom(readings)` (pure), `readAll()` (impure), `main(argv, options)` |
| CREATE | `tests/scripts/baseStateCapsule.test.js` | whole file | n/a | 8 acceptance cases, **one literal `describe` and eight literal `it`** |
| DOC | `docs/implementation/BASE_STATE.json` | the artifact the generator writes | n/a | regenerated by the generator; its shape does not move |

**Two handwritten files.** One new logic-bearing leaf. **Zero** existing production files modified.
**Zero** registration files. **Zero** persisted record families (`BASE_STATE.json` already exists
and its shape is frozen). **Zero** flags. **Zero** user-facing surfaces. **Zero** direct production
consumers — nothing in `src/` imports this script, by construction.

⭐ `scripts/**` carries no `max-lines` ceiling; the ≤250 budget is this packet's own discipline.

`retiredSymbols`: **NONE.**

---

## §5 Predicted census motion

| Census | Base | After M2 | Cause |
|---|---|---|---|
| lighting | `2416/365/2051/20016/5642` | **`2417/365/2052/20024/5643`** | one new **credited** test file: `+1 file / +0 parked / +1 credited / +8 test titles / +1 suite title` |
| `runtimeTests` | 28032 | **28040** | the eight cases |
| `frozenKnownFailures` | 16 | **16** | no new debt permitted |
| `verify:dist` corpus | 50 | **50** | `tests/scripts/**` is not `tests/build/**` |
| `osrFindings` | 1998 | **1998** | no `src/` byte, no governed input |

**PARKED STAYS AT 365 AND IT MUST BE EARNED.** ⛔ In `tests/scripts/baseStateCapsule.test.js`,
`test.each`, `describe.runIf`, `it.skipIf`, looped or conditional registration, nested describes,
`skip` and `todo` are **FORBIDDEN**. A single one parks the file WHOLE.

⚠⚠ **THE NAMED INTERIOR RED THIS MEMBER CARRIES.** Under the train, the whole census is re-derived
once, later in the chain — so from this member's implementation commit until that re-record,
`tests/lint/sovereigntyLightingContract.walker.test.js` **reds on its census arm**, reporting
`expected 2417 to be 2416` on the file count and the matching motion on `credited`, `titles` and
`suiteTitles`. Exactly one file, exactly the census arm, exactly those figures. That red is lawful
under `DESIGN_BUILD_EFFICIENCY.md` §2.1 because the commit is never exposed, and it is **named
here before it exists** as §2.1 requires. Any other red, or any other figure, is a STOP.

⭐ **No mutation-coverage-manifest row is owed.** `enumerateInvariants()` picks the seven enforcer
dirs plus the `NAME_PATTERN` basename regex; `tests/scripts/` is not an enforcer dir and
`baseStateCapsule` matches no pattern token. Pinned by A6.

---

## §6 Acceptance matrix — closed at exactly 8 cases, all literal titles

| id | Case |
|---|---|
| **A1** | **SHAPE.** `capsuleFrom(readings)` emits exactly the six top-level keys in order, `schemaVersion === 1`, and exactly the 20 `figures` keys in the committed artifact's order — compared against the committed `BASE_STATE.json`, key-for-key, so a drift in either direction reds. |
| **A2** | **TOTALITY.** Every emitted key has a `PROVENANCE` row and every `PROVENANCE` row emits a key — two exact set differences, both directions. Each row's `kind` is one of `MEASURED` / `PINNED` / `ARG`. |
| **A3** | **HAND-DERIVATION.** The test independently re-derives the cheap figures from their canonical homes **by its own code**, and asserts each equals `readAll()`'s value. ⛔ The test may not call, import, or re-use any helper from the generator to produce its expected side. |
| **A4** | **THE ARG GUARD.** `main([])` throws naming `--runtime-tests`; `main(['--runtime-tests=0'])` throws naming the floor derived from `baseline.totalTests * SCOPE_FLOOR_RATIO`; a valid value succeeds. Nothing is written on either throw. |
| **A5** | **FAIL-CLOSED.** With a reader whose canonical home is missing, and again with one whose shell-out exits non-zero, the generator **throws** and names the row. Asserted by requiring the throw, never by inspecting output. |
| **A6** | **PLACEMENT.** `enumerateInvariants(ROOT)` does not contain this test file and `tests/scripts/` contributes zero rows, so no mutation-manifest entry is owed. The arm also asserts the enumeration is non-trivial so it cannot pass vacuously on a broken walk. |
| **A7** | **GOVERNED-INPUT NEGATIVE CONTROL.** `scannerToolFiles()` does not contain `scripts/base-state-capsule.mjs`, and the list still contains `package.json` — so this member moves no detector digest, and the reason the npm row was deferred is pinned rather than remembered. |
| **A8** | **DISCRIMINATION (anti-vacuity).** With one injected reading perturbed by exactly one, A3's comparison fails; with `consumptionLaw` emptied, A1's comparison fails. Proves both comparisons are real reads and not constants that always agree. |

---

## §7 Mandatory implementation order

0. Preflight: branch, ancestry to I1, porcelain clean for both targets, every required symbol
   present, and each of §3.3's homes re-read.
1. Baseline: the lighting walker green at the unchanged base tuple (M1 moved nothing).
2. The smallest failing focused test: A1 against a not-yet-existing `capsuleFrom`.
3. `capsuleFrom(readings)` — the pure assembler and the `PROVENANCE` table.
4. `readAll()` — the impure readers, each fail-closed.
5. `main(argv, options)` — arg parsing, dirty-tree refusal, the write.
6. The remaining acceptance cases. **No registration file, no guard registry, no manifest row.**
7. Focused verification (§8), then the eight mutants (§9).
8. **No wave-end full gate** — under a train it moves to the terminal.

⛔ Step 0 must not begin by changing a golden, baseline, budget, or persisted shape.

---

## §8 Focused checks (argv form, expected exit 0)

```
npx vitest run tests/scripts/baseStateCapsule.test.js
node scripts/base-state-capsule.mjs --runtime-tests=28032
node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
npx eslint scripts/base-state-capsule.mjs tests/scripts/baseStateCapsule.test.js
```

⚠ The second line **writes** `docs/implementation/BASE_STATE.json`. Run it, diff the result against
base, then restore the file — the artifact is regenerated for real only at the terminal. Record the
diff in the receipt.
⛔ Every command bare, with `; echo TRUE_EXIT=$?`. Never through a pipe. ⛔ Never wrapped in
`gate-mutex.sh --run` when the command is `npm run check*`; a focused Vitest run does hold the
canonical mutex, per INFRA-PREAMBLE §P5.
Report both typecheck configurations by name and window at the terminal, both at their exact
floors; a new path must be zero-error in both. ⛔ Never add a baseline entry.

---

## §9 Mutants — eight, disposable, in an isolated immutable candidate

Procedure and anti-vacuity law: INFRA-PREAMBLE §P6.

| # | Plant in `base-state-capsule.mjs` | Must red |
|---|---|---|
| M2-m1 | drop one `PROVENANCE` row while still emitting its key | A2 |
| M2-m2 | reorder two `figures` keys | A1 |
| M2-m3 | emit `schemaVersion: 2` | A1 |
| M2-m4 | make a missing canonical home return `0` instead of throwing | A5 |
| M2-m5 | accept a missing `--runtime-tests` and default it | A4 |
| M2-m6 | read `routedTokens` from the walker's constant instead of `EXACT_SECTION` | ⚠ **EXPECTED TO PASS at this base** — the two agree today. Planted as a **declared no-conviction control**: a mutant that passes means the assertion had a second enforcer, never that the code is safe. **Recorded, not hidden.** |
| M2-m7 | replace the frozen `consumptionLaw` literal with an empty string | A1/A8 |
| M2-m8 | make the dirty-tree check always report clean | A4 |

**DEFERRALS FILED BY THIS MEMBER (documented, not bugs to re-find):**
- **INFRA-M4** — teach `scripts/check-test-ratchet.mjs` to publish its executed totals to a
  well-known path, then delete `--runtime-tests` in favour of reading it. The architecturally
  correct cure, and a second behavior family: a MODIFY of a gate-critical script pinned by two
  walkers.
- **The `capsule:base-state` npm-script row** — batched to the next observed-shape schema mint.
- **`schemaVersion: 2` carrying the `PROVENANCE` block in the artifact** — owner-gated.

---

## §10 STOP conditions (in addition to INFRA-PREAMBLE §P8)

1. Any `package.json` or `package-lock.json` edit appears necessary. ⛔ Report; do not mint.
2. `BASE_STATE.json`'s key set, key order, or `schemaVersion` would have to move.
3. Any figure lacks a canonical home and the only way forward is a new measurement spelling.
4. The observed-shape scan reds, implicates a schema mint, or reports a new finding.
5. The lighting census moves by anything other than the named `+1/+0/+1/+8/+1`.
6. `enumerateInvariants()` picks the new test file.
7. A mutant is ambiguous, a plant is a no-op, or a restore is incomplete.
8. Either TypeScript ratchet would need a baseline entry raised for the new script.
9. A foreign lane holds the census walker dirty at dispatch, or holds either target dirty.

---

## §11 Completion receipt

Verified base sha and final tree state · the two changed files with effective-line deltas ·
A1-A8 with exact argv, exits and test counts · **the eight mutants with M2-m6's declared
no-conviction result stated plainly** · the lighting census tuple before and after, with the named
interior red quoted verbatim · both ratchets by config name · the observed-shape exit and finding
count · `validate:packets` output · **the generated `BASE_STATE.json` diff against base, quoted** ·
the three deferrals restated · deviations `NONE` or a STOP · judgment calls `NONE`.
