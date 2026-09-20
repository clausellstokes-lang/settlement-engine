# CURE-L — RECEIPT (2026-09-20, successor chair session 4a1823e2, the lane formerly FIX-P1)

**OUTCOME: RUN 23's three reds are cured in two commits, the assigned CI cap is a third,
and `tests/lint` WHOLE at the tip reds ONLY on the lighting walker at `titles`, which is
my own declared +1.** Slot `e45c4738b` -> **`835f81812`**, tree clean.

## THE THREE SHAS

| # | sha | subject | stat |
|---|---|---|---|
| 1 | `65cbf86e1` | CURE-L: the fork-door walker reads a measurement as a measurement, and still convicts a bare id | 2 files, +102 −4 |
| 2 | `85cd9f4a8` | CURE-L: a test reads a frozen golden's pin from the freeze register, never from its own literal | 1 file, +61 −9 |
| 3 | `835f81812` | CI: the e2e job's cap follows its doubled suite (15 → 25 minutes) | 1 file, +13 −1 |

Verified before touching: status EMPTY, branch `fixes-2026-09-18-consist`, tip
`e45c4738b`, goldens `7177cd6e…8f1e` / `88983938…4084`.

## CAUSE A — the fork-door walker

RED-FIRST at `e45c4738b`, `tests/data` WHOLE:
`Test Files 1 failed | 23 passed (24)` · `Tests 2 failed | 309 passed (311)` exit 1
```
× every CALL of forkSeedFor passes an identity resolved by forkIdentity
× every door that calls forkSeedFor imports forkIdentity
```

**Cured on BOTH sides, because only one arm was satisfiable.** Arm 1 was reading a real
call, so the SOURCE changed: the ceiling probe now goes through `forkIdentity`. Arm 2
asked `anonForkSalt.js` to import a function from itself, so the WALKER learned one
predicate — `definesForkIdentity` — and the exemption is the DEFINITION, never the
filename.

**Purity precondition PROVEN, not assumed.** `forkIdentity(<non-empty>)` takes the
signed-in branch = `accountDigest` = two `fnv1a32` rounds. `kernel/proseHash.js` read
whole: no rng, no clock, no state. Demonstrated by importing the module in plain node,
where `window`/`localStorage` do not exist, and reading `FORK_SEED_MAX` off it.
**`FORK_SEED_MAX` stays 26**, probe identity width 12 = `FORK_SUFFIX_MAX`.

**The robustness is not lost:** `tests/lib/anonForkSalt.test.js:225-233` already pins
`FORK_SEED_MAX === longestCard + 1 + FORK_SUFFIX_MAX` AND the same widest measurement
recomputed through `forkIdentity`, so if `ANON_SALT_HEX` outgrew `ACCOUNT_DIGEST_HEX`
that arm reds rather than this ceiling silently going short.

**THE PLANTS — the claim is unweakened, proven twice.**

| plant | result |
|---|---|
| bare-id call INSIDE the definer | `× every CALL of forkSeedFor passes an identity resolved by forkIdentity` · `Tests 1 failed \| 311 passed (312)` — **the exemption did NOT blind the call arm** |
| a throwaway door that neither defines nor imports | **BOTH arms red** · `Tests 2 failed \| 310 passed (312)` |

Restored BY COPY from a banked pre-plant file — never `git checkout --`, which the
shared-tree protocol forbids and which would have reverted the cure with the plant.
Byte-identical: `87f7c408063196d702c67222fed6c9a7f934bcc5eb6f53d9b7ab40f296c7e2dc`
before AND after.

## CAUSE B — the stale golden literal

RED-FIRST at `e45c4738b`, `tests/domain/ruinInstitution.test.js`:
`Test Files 1 failed (1)` · `Tests 1 failed | 6 passed (7)` exit 1
```
× A4 the pulse history does not move: both goldens and the preset witness are bytewise unchanged
AssertionError: expected '88983938ddcf28341031e186d855fef950e6b…' to be '921c51cf6799ffdfdbffa3715fb496f7d15ce…'
```

A4 kept its own literal copy of three frozen shas. CURE-J's SIGNED, provenance-only
re-record moved the prose-manifest golden and its register row together; the literal did
not follow, so a LAWFUL act reddened the gate. A4 now reads the row by surface identity.

### THE CENSUS, WITH ITS DENOMINATOR

Former shas were not guessed: the register was PARSED at all **25** commits that ever
touched it, yielding **13** distinct shas (8 generator, 3 prose manifest, 2 witness).
`git grep -n -P` on each first-12, across `tests/`, `src/`, `scripts/`:

| hash (first 12) | surface | sites | disposition |
|---|---|---|---|
| `7177cd6e89eb` | generator-golden-master | 2 | A4 → (a) re-pointed; the register → (c) |
| `88983938ddcf` | dossier-prose-manifest | 1 | the register → (c) |
| `921c51cf6799` | dossier-prose-manifest | 1 | **A4, THE STALE ONE** → (a) re-pointed |
| `7f67ee8e6cda` | preset-lighting-witness | 2 | A4 → (a) re-pointed; the register → (c) |
| the other 9 | all three | **0** | no site anywhere |

**TOTAL 6 sites.** 3 register rows (class (c), untouched), 3 A4 literals (class (a),
re-pointed). **Class (b) is EMPTY** — no predecessor sha survives anywhere in the three
trees, so nothing needed an as-of annotation. The cure is confined to ONE file.

⭐ The brief's contingency does not apply: **all three artefacts have register rows with
live `sha256`**, so none had to be left as a literal with a door comment.

**No new title, deliberately** — the file's header declares "SEVEN STRAIGHT-LINE `it`
UNDER ONE LITERAL `describe` (EM preamble §P3.4)" and it still has exactly seven.

**THE COUNTERFORCE RAN THE COMMITTED CODE, NOT A COPY.** A hand copy of `pinIn` would be
the very class this commit cures, so the proof extracts the helper's source out of the
committed file by brace balance, prints it verbatim, evaluates that, and feeds it
scratch registers. All seven verdicts pass; the real register and all three real goldens
were never written (shas checked after). The last three verdicts are the vacuity guard:
an unknown surface, a null `sha256` and a non-array all yield a sentence that cannot
equal a 64-hex digest, so a reader that stopped resolving REDS instead of passing.

## THE PROOFS — every count line verbatim, exit captured from the command

| target | exit | wall | count lines |
|---|---|---|---|
| `tests/data` WHOLE (cured) | 0 | 3 s | `Test Files 24 passed (24)` · `Tests 312 passed (312)` |
| `tests/lib` WHOLE | 0 | 30 s | `Test Files 174 passed (174)` · `Tests 1800 passed (1800)` |
| `tests/domain` WHOLE | 0 | **362 s** | `Test Files 985 passed (985)` · `Tests 16646 passed (16646)` |
| `tests/domain/ruinInstitution.test.js` | 0 | 3 s | `Test Files 1 passed (1)` · `Tests 7 passed (7)` (was 1 failed \| 6 passed) |
| `ciCheckParity` + `ciGateHardening` | 0 | 0.2 s | `Test Files 2 passed (2)` · `Tests 38 passed (38)` |
| `tests/build` WHOLE | 0 | 21 s | `Test Files 59 passed (59)` · `Tests 478 passed \| 65 skipped (543)` |
| **`tests/lint` WHOLE (LAST)** | **1** | **227 s** | `Test Files 1 failed \| 176 passed (177)` · `Tests 1 failed \| 2846 passed (2847)` |

Ungated: `node scripts/check-observed-shape-readers.mjs` **exit 0**, ZERO rows naming
`src/lib/anonForkSalt.js`. `npx eslint` BARE on all four touched files — **exit 0**, no
output. Edge-shared rule checked: `src/lib/anonForkSalt.js` is an input of NONE of the
five bundle metas, so no regeneration is owed.

### THE ONE RED — the lighting walker, at `titles`, and it is MINE

```
FAIL tests/lint/sovereigntyLightingContract.walker.test.js > … > THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed
AssertionError: the live TEST-title count moved from SP-C's measured 18,471 … expected 25530 to be 25529
```

Frozen at the eighth refreeze (`measuredAtSha da5310f30`, `measuredBy chair-fable-4a1823e2`):
`files 2665 · parked 359 · credited 2306 · titles 25529 · suiteTitles 6815`.

**MY EXACT DELTA, measured by diff, not estimated:**

| figure | delta | evidence |
|---|---|---|
| files | **+0** | `--diff-filter=AD` over `tests/**` across all three commits names nothing |
| parked | **+0** | walker got PAST it |
| credited | **+0** | walker got PAST it |
| **titles** | **+1** | 2 added `it(` lines − 1 removed; the removed one is arm 2's RENAME, so the net is the counterforce arm |
| suiteTitles | **+0** | no `describe(` line added or removed |

The walker asserts in order and stopped at `titles`, so `suiteTitles` was NOT evaluated
at this tip — but it is unmoved by me. ⛔ NOT REFREEZED: that is the chair's act.

### GOLDENS — UNMOVED, first hash and last identical
```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  generator-golden-master.json
88983938ddcf28341031e186d855fef950e6b299ec4b8fc87f170ece1b994084  dossier-prose-manifest-golden.json
```
No `UPDATE_*` door was opened; no golden and no register row was written.

## THE CI CAP (commit 3)

Re-measured rather than transcribed (the successor's law), and the chair's figures held
under the right denominator — `playwright.config.js:46` `testIgnore: '**/performance/**'`:

| | master `b9c494afe` | this tip |
|---|---|---|
| chromium spec files | 8 | **14** |
| `test(` declarations | 39 | **81** |
| explicitly-budgeted time | 1155 s | **1335 s** |

The branch adds exactly the two budgets the chair named (120 s `realm-herald-gate`,
60 s `arrow-header`). The 420 s and 300 s budgets in `flow-b-auth-credits-ai.spec.js`
are NOT new — they are on master too — but `retries: process.env.CI ? 1 : 0`
(`playwright.config.js:64`) means one flaky retry of the 420 s test can spend 14 minutes
inside what was a 15-minute cap. The job also runs a SECOND playwright invocation
(mobile-safari) and two browser installs under the same cap.

**Measure-first, as instructed:** `git grep -n "timeout-minutes" -- tests scripts`
returns three hits — `ciCheckParity.test.js:390` pins `check-tests` at 45 (a different
job), and `soakRegister.test.js:552,565` read `.github/workflows/soak-research.yml` (a
different workflow). **Nothing pins the e2e cap**, so nothing reds.

⚠ **The hazard this edit had to avoid:** `e2e` AND `performance` both carried
`timeout-minutes: 15`, so a bare substitution would have moved both. Anchored on the
`e2e:` job header and proven after: `performance` still 15, `check-tests` still 45,
`coverage-floors` still 60, only line 238 moved, eight job keys still parse, no tabs.

## ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

1. ⭐⭐ **THE `tests/lint` WHOLE LAW COVERS ONLY HALF THE INSTRUMENTS THAT READ `src/`.**
   Measured at this tip: **104 test files outside `tests/lint` walk the `src/` tree**,
   across **19 directories** — against 103 inside `tests/lint`. A `src/lib` lane obeying
   the current law (its own directory + `tests/lint` whole) misses **103 of them**. That
   is exactly how FIX-P1d shipped: `tests/data/sampleSettlements.test.js` is on that
   list. Eleven are explicitly named law instruments living outside the directory the
   law names: `tests/application/commands/commandRegistry.walker.test.js`,
   `tests/components/invitationOnlyTiers.census.test.jsx`, `tests/copy/tierWord.census.test.js`,
   `tests/domain/candidateTypeVoicePhrasing.walker.test.js`,
   `tests/domain/deityTemperConsumerCensus.walker.test.js`, `tests/domain/impactKindWalkers.test.js`,
   `tests/lib/spatialLedgerCoverage.walker.test.js`, `tests/security/aiSurfaceCensus.js`,
   `tests/store/advertisedUndoArming.walker.test.js`,
   `tests/store/configDirectWriterExemptions.scan.test.js`,
   `tests/store/savedSettlementPatchKeysWalker.test.js`.
   **The cheap cure is a ratchet, not a longer law:** a walker that lists every test file
   reading the `src/` tree, shrink-only, so the roster is a counted set a lane can be
   handed rather than a thing each lane rediscovers by being convicted.

2. **THE FREEZE REGISTER'S `_doc` IS FALSE AT THIS TIP.** It still opens
   "⛔ THIS REGISTER IS UNFROZEN. `frozenAt` is null, and so are `frozenAtSha` and
   `genesis`" — but `frozenAt` is `2026-09-16T13:55:10Z`, `frozenAtSha` is `d22ceff01`,
   `genesis` is a full signed block, and all **50** surface rows carry live `sha256`.
   It reads as live prose, not as a dated record. The register is class (c) and not a
   lane's to rewrite; it wants the chair's pen (an as-of mark, or the sentence updated
   by the freeze act's own door).

3. **THE CITATION BASELINE CONTRADICTS ITSELF** (carried from the previous window, still
   true): `tests/lint/.source-citation-baseline.json` `frozenAt.burnedDownBy` says
   "docsArchivalFiles 29 — the archival byRule split is unmoved" while
   `_rosterMove2026-09-20` on the next line records that same lane moving archival
   29 → 30. Both are landed records of one day; one is stale prose.

4. **THE LIGHTING WALKER'S ORDERED ASSERTION HIDES FOUR FIGURES** (carried, and it bit
   again here): it stopped at `titles`, so `suiteTitles` went unevaluated. Collect-then-
   assert-once would hand the refreeze its whole delta in one run instead of one figure
   per cycle.

**SLOT AND GATE RELEASED — tip `835f81812`.** Nothing of mine is running; no file inside
the slot was written after the last commit; `git status --short` is EMPTY.
