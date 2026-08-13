# Corpus Coverage / AO-6 — standing source mutants with exact red attribution

- **Status:** READY
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `ee6934e95d0c5bcea99ee68d5b1c1129e828f4ec`
- **Last revalidated:** 2026-08-13 against clean terminal AO-5.
- **Depends on:** AO-0 schema-8 genesis
  `e71beb84355666fe5508f61c0f9acdc516a97b79`, AO-2+3 zero bank
  `f0c272e894f3f4d4edbd7fd1dac4c65580f87e52`, AO-4 implementation
  `09e39ee65f8bfeccb1eb9684c15c5d06fa308ccb`, AO-5 implementation
  `72b7a87b0375d759a9e72344664c3f4b6440a35f`, terminal AO-5
  `ee6934e95d0c5bcea99ee68d5b1c1129e828f4ec`, CR-AO-1/4/7/9/10, and the
  adopted `AO-4 -> AO-5 -> AO-6` order in the owner ledger.
- **Collision group:** none. AO-6 creates no test file and changes no literal test or
  suite title, so it does not take the free estate-wide lighting-census reservation.
- **Commit authority:** the coding agent edits only the four manifest paths, leaves all
  changes unstaged and uncommitted, and does not promote. The coordinator constructs,
  proves, and old-value-CAS lands one green implementation commit, then records terminal
  packet state separately.
- **Baseline posture:** three existing mutation rationales become three standing planted
  regressions. The uncovered baseline remains exactly `198`; no gap, rationale, label, or
  target-count movement beyond the exact conversions in this packet is licensed.
- **Declared behavior shift:** **NONE.** This packet changes only the opt-in mutation harness,
  mutation-coverage registration, and two existing compatibility assertions. Product code,
  product output, persisted records, ordinary test titles, goldens, flags, tuning, and runtime
  behavior are byte-identical.
- **Census receipt:** no test registration changes. The whole live tuple remains
  `2412/365/2047/19984/5638`; `tests/lint/sovereigntyLightingContract.walker.test.js` is not
  a change path and the reservation remains free.

## 1. Reconciled authority and live preflight

The adopted charter makes AO-6 the **last** corpus-coverage wave and gives it one job:
replace prose assertions about catching power with standing source mutants whose reds are
attributed to the exact assertion that claims them. Its binding controls are:

1. deleting a live applied-headline rewrite row must red the pin that owns that row;
2. admitting a prospective/modal summary under an indicative applied home must red the
   voice contract;
3. a semantic negative control must produce zero reds; and
4. every red must name the exact full test title, not merely return nonzero.

AO-5 subsequently added the fourth durable prose-family contract and deliberately registered
its eight ordinary cases with the same sentence: *AO-6 owns the dedicated standing source-
mutant battery.* At this base exactly three invariant rows carry that delegation:

```text
tests/lint/newsVoiceContract.walker.test.js
tests/lint/newsHeadlineContract.walker.test.js
tests/lint/proseFamilyContract.walker.test.js
```

Closing all three is not a new behavior family. It is the live, post-AO-5 compilation of the
charter's final correctness wave. Leaving the newest rationale behind would make AO-6 terminal
while its own predecessor still names it as unpaid work.

The clean verified base re-derives exactly:

| Quantity | Pre-AO-6 value |
|---|---:|
| Enumerated invariant files / manifest invariant rows | `541 / 541` |
| Invariant `mutation / rationale / uncovered` | `68 / 275 / 198` |
| Meta `mutation / rationale / uncovered` | `10 / 0 / 0` |
| Total mutation claims / sweep labels / unique labels | `78 / 78 / 78` |
| In-place-or-missing mutation calls / unique target files | `67 / 53` |
| `MUTATED_FILES` rows / unique rows | `53 / 53` |
| `uncoveredBaseline` | `198` |
| Hazard classes | `29 = MACHINERY 12 + PARTIAL 11 + DOCUMENT 6` |
| Pre-mortem predicates / routed classes / uncovered classes | `28 / 23 / 6` |
| Lighting census | `2412 / 365 / 2047 / 19984 / 5638` |

Each of the four source anchors in section 3 occurs exactly once. The two positive product
targets are not in `MUTATED_FILES` yet; they are added by this packet. The negative control
uses one of those already-guarded targets and therefore does not create a third guard row.

## 2. Outcome and explicit non-goals

AO-6 makes three test-file mutation claims operational:

- three exact source plants, each killed by one named full test title;
- one semantic no-op control, green both while planted and after restoration;
- exact dirty-tree guard totality for the two newly touched source paths;
- exact one-to-one manifest/label closure; and
- a fail-closed attribution helper that rejects an unrelated red.

Explicitly out:

- any product-source edit in the committed implementation; the two transient product targets are
  transient mutation targets only and must be byte-identical to HEAD after every probe;
- a fourth positive mutant, a second mutant for any claiming file, another manifest upgrade,
  a new test, a new title, a new suite, or a new baseline;
- changing a headline rewrite, summary-impact set, Chronicle shape, comparator, corpus builder,
  protected substrate, hazard, pre-mortem predicate, or ordinary test assertion except the two
  exact mutation-registration compatibility pins and the one-line headline-walker setup change
  expressly authorized in section 3.3;
- treating any nonzero command as sufficient attribution, using a broad filter that can select
  more than the intended title, or accepting a plant that changed zero bytes;
- parsing Vitest JSON, changing a reporter globally, adding a dependency, weakening an existing
  mutation, deleting a rationale other than the three exact rows, or moving
  `uncoveredBaseline`;
- running the sweep in the shared coding worktree. The whole sweep runs only from a clean,
  disposable detached proof worktree after the immutable implementation commit exists.

Adjacent observations are receipt-only unless they disprove a premise, which is a STOP.

## 3. Exact harness and plant law

### 3.1 `check_caught` gains exact-title attribution

Extend the existing shell function without changing the behavior of its 78 current callers:

```text
check_caught <label> <file> <check-cmd> [expected-full-title]
```

The optional fourth argument defaults to empty. Run the command under `NO_COLOR=1`; capture the
mutated command's combined stdout and stderr and its true exit code; restore the target with the
existing `git checkout --` road; then run the same command clean and capture its true exit code.
Preserve the current plant-changed check and all current `BROKEN`, `MISSED`, and `CAUGHT`
polarities.

For a caller with no fourth argument, behavior and output stay exactly as today. For a caller
with an expected title, `CAUGHT` requires all four facts:

1. the target differs from the index before the command;
2. the mutated command exits nonzero;
3. after stripping leading horizontal whitespace, exactly one physical line of its captured
   output begins with literal `FAIL ` and ends with the literal suffix
   ` > <expected-full-title>`; and
4. the restored command exits zero.

A nonzero command whose output has zero or multiple exact detailed-failure lines is `BROKEN GAP`,
with an error naming the missing or ambiguous expected failure. A line that merely lists the
title as skipped cannot satisfy this rule: verbose Vitest marks that line with `↓`, not `FAIL`.
It is not `CAUGHT`: an unrelated assertion, `beforeAll` failure, collection failure, timeout, or
moved filter does not prove the claimed guard. Scan captured output line by line and compare the
literal prefix and suffix; do not use one whole-output substring test, `eval`, a shell pipeline,
or a reporter-wide configuration edit. The three new commands use token-only `-t` filters and an
explicit verbose reporter so the claiming failure emits the required detailed line.

### 3.2 One negative-control helper

Add one local `check_clear` helper beside `check_caught`. It accepts exactly:

```text
check_clear <label> <file> <check-cmd> <expected-passed-count>
```

It requires a positive safe-integer fourth argument, runs both commands under `NO_COLOR=1`, and
captures each command's combined output and true exit. It uses the same changed-file precondition,
target restoration, and clean rerun. Normalize horizontal whitespace one physical line at a time.
It records `CLEAR ok <label>` and increments a separate `CLEAR` counter only when the planted and
restored commands both exit zero **and each captured output contains exactly one normalized
`Test Files 2 passed (2)` line and exactly one normalized
`Tests <n> passed (<n>)` line for the supplied count**. For AO-6, `<n>` is exactly `16`.

A planted red, missing/wrong/duplicate planted summary, clean red, or missing/wrong/duplicate
restored summary is
`BROKEN GAP`; exit zero alone never proves this negative control. `check_clear` labels do not
enter the mutation-manifest join and its target must already be in `MUTATED_FILES` for a positive
plant. The final summary reports `CAUGHT`, `CLEAR`, and `MISSED/BROKEN` separately.

### 3.3 The exact three positive plants

Place the three calls together after the existing corpus/certification plants and before the
results footer. Every replacement anchor must occur exactly once at implementation preflight;
the existing changed-file check remains the runtime proof that the plant actually landed.

The headline walker needs one exact mechanics correction inside its already admitted path:
in `beforeAll`, assign `finalLiveness` with
`analyzeHeadlineRewriteLiveness(rawRows, APPLIED_HEADLINE_REWRITES)` instead of the strict
`measureHeadlineRewriteLiveness(...)`. Its existing A3 case already pins totals, frozen rows,
zero gaps, zero overlaps, and zero indicative matches on every ordinary/full run; A4 separately
pins that strict measurement throws on an uncovered headline. This one-line change removes no
closure. It prevents the deleted-row mutant from throwing in `beforeAll`, so filtered `-t A6`
reaches A6 and fails its own exact missing-row assertion. No other setup or A1-A6 assertion moves.

| Manifest claimant and stable label | Transient target and exact plant | Exact command and required full title |
|---|---|---|
| `tests/lint/newsHeadlineContract.walker.test.js` — `corpus-coverage/headline rewrite row deleted` | `src/domain/worldPulse/worldPulseFeedCuration.js`: delete only the complete `[/\bmay press a challenge to the government\b/, 'presses a challenge to the government'],` row from `APPLIED_HEADLINE_REWRITES` | `npx vitest run tests/lint/newsHeadlineContract.walker.test.js -t A6 --no-file-parallelism --reporter=verbose`; after left trim, exactly one output line must begin `FAIL ` and end ` > A6 closes the sole live challenge gap with the exact producer twin` |
| `tests/lint/newsVoiceContract.walker.test.js` — `corpus-coverage/modal summary admitted under indicative home` | same source file: delete only `'npc_bargain', ` from the first `APPLIED_SUMMARY_IMPACT_KINDS` row, so that one applied home retains `can advance through` | `npx vitest run tests/lint/newsVoiceContract.walker.test.js -t debt-free --no-file-parallelism --reporter=verbose`; after left trim, exactly one output line must begin `FAIL ` and end ` > contract -> cure -> bank completion is aligned and debt-free` |
| `tests/lint/proseFamilyContract.walker.test.js` — `corpus-coverage/chronicle summaryText projection deleted` | `src/lib/chronicle.js`: delete only the exact return-property line `    summaryText,` in `createChronicleEntry` | `npx vitest run tests/lint/proseFamilyContract.walker.test.js -t A7 --no-file-parallelism --reporter=verbose`; after left trim, exactly one output line must begin `FAIL ` and end ` > A7 closes the pure Chronicle create-and-append road at 7 7 7` |

Each command selects one existing title token unique within its file. The first plant proves the
producer-twin row cannot vanish; the second proves the indicative-home correction set cannot
shrink; the third proves the post-AO-5 Chronicle scalar denominator cannot silently lose a
durable field. All three targets restore byte-identically before the next control begins.

### 3.4 The exact semantic negative control

After the three positive plants, transiently swap only the first two members of
`APPLIED_SUMMARY_IMPACT_KINDS`:

```text
'npc_bargain', 'npc_exploit'
->
'npc_exploit', 'npc_bargain'
```

The set's membership is unchanged. Run exactly:

```sh
npx vitest run \
  tests/lint/newsVoiceContract.walker.test.js \
  tests/lint/newsHeadlineContract.walker.test.js \
  --no-file-parallelism
```

Call `check_clear` with expected count `16`. The planted run must exit zero and carry exactly one
each of the whitespace-normalized summaries `Test Files 2 passed (2)` and
`Tests 16 passed (16)`; restore the file; the clean rerun must independently exit zero and carry
exactly one each of those same two summaries. Record one `CLEAR` and zero reds. This control
proves the positive modal mutant is killed because membership changed, not because the source
line's order or bytes changed.

## 4. Exact mutation-manifest closure

Replace only the three existing rationale objects with mutation objects. Keep each row in place;
do not reserialize the file or edit the shared `rationales` dictionary. The required labels are
exactly the three stable labels in section 3.3. Each object also carries a nonblank `what` that
states the source deletion, the intended named red, and the green restored attribution run.

The two existing compatibility pins move mechanically:

- `tests/lint/newsHeadlineContract.walker.test.js` makes the exact one-line `beforeAll`
  strict-to-analysis change in section 3.3, leaves A3/A4 as the strict closure, and in A7
  replaces its rationale-kind/text assertions with `toMatchObject({ kind: 'mutation', label:
  'corpus-coverage/headline rewrite row deleted' })`;
- `tests/lint/proseFamilyContract.walker.test.js` A8 replaces its rationale-kind/text
  assertions with `toMatchObject({ kind: 'mutation', label:
  'corpus-coverage/chronicle summaryText projection deleted' })`.

`newsVoiceContract.walker.test.js` needs no compatibility edit: the estate-wide mutation-
coverage manifest test binds its exact row and label bidirectionally. Adding a fifth committed
path merely to restate that join is refused.

The only lawful post-state is:

| Quantity | Post-AO-6 value |
|---|---:|
| Enumerated invariant files / manifest rows | `541 / 541` |
| Invariant `mutation / rationale / uncovered` | `71 / 272 / 198` |
| Meta mutations | `10` |
| Total mutation claims / sweep labels / unique labels | `81 / 81 / 81` |
| In-place-or-missing mutation calls / unique target files | `70 / 55` |
| `MUTATED_FILES` rows / unique rows | `55 / 55` |
| Positive sweep result | `81 CAUGHT / 0 MISSED-or-BROKEN` |
| Negative sweep result | `1 CLEAR / 0 red` |
| `uncoveredBaseline` | `198` |

Add exactly `src/domain/worldPulse/worldPulseFeedCuration.js` and `src/lib/chronicle.js` to
`MUTATED_FILES`. No existing guard row, label, plant, command, result, or manifest claim moves.

## 5. Unchanged governance substrate

AO-6 creates no new hazard and changes no pre-mortem substrate. Re-derive and preserve:

- `HZ-CROSSHOME` has exactly ten top-level keys, status `MACHINERY`, accepted reason `null`,
  `instances: 53`, `inChain: true`, and exactly nine enforcer paths;
- the hazard registry is exactly `29 = M12/P11/D6/A0`, DOCUMENT `6/6`, OWED `17/18`,
  MACHINERY `12/9`, floor `27`;
- `cross-home-voice-substrate-touched` still has exactly two sources, the exact 23-item
  protected union, and one synthetic warning;
- the pre-mortem registry remains 28 predicates: 16 derived, 12 authored including three
  hybrids, 23/29 classes routed, and six reasoned exemptions;
- the AO-4 and AO-5 contract baselines, corpus counts, canonical byte lengths and digests are
  byte-identical; and
- the lighting census remains `2412/365/2047/19984/5638` without editing its file.

Any movement here is evidence that a plant was not fully restored or scope widened, and is a
STOP rather than an authorized reconciliation.

## 6. Hard scope and exact four-path manifest

| Limit | AO-6 budget |
|---|---:|
| Behavior families | `1` — correctness proof for the completed corpus-coverage program |
| Committed paths | exactly `4` |
| Product/persisted paths committed | `0` |
| Positive source plants | exactly `3` |
| Negative source controls | exactly `1` |
| New test files / test titles / suite titles | `0 / 0 / 0` |
| Manifest rationale-to-mutation conversions | exactly `3` |
| New sweep labels / guarded target files | exactly `3 / 2` |
| Hazard/pre-mortem/census/baseline edits | `0` |
| Acceptance cases | exactly `8` |

| Action | File | Symbol/region | Coding instruction |
|---|---|---|---|
| MODIFY | `scripts/mutation-sweep.sh` | counters, `MUTATED_FILES`, `check_caught`, new `check_clear`, AO-6 control block, results footer | Preserve all 78 existing callers; add exact-title attribution, three positive plants, one negative control, two guard rows, and exact post-count reporting. |
| MODIFY | `scripts/mutation-coverage-manifest.json` | the three exact AO invariant rows only | Convert the three rationales to mutations with exact labels and nonblank `what`; raw splice only, no reserialization or baseline movement. |
| TEST | `tests/lint/newsHeadlineContract.walker.test.js` | one-line `beforeAll` liveness assignment plus existing A7 mutation-governance assertion | Replace strict measurement with raw analysis only at setup so A6 owns the mutant red; retain A3/A4 closure; replace the old A7 rationale assertion with the exact mutation kind/label assertion. No title or other assertion moves. |
| TEST | `tests/lint/proseFamilyContract.walker.test.js` | existing A8 mutation-governance assertion only | Replace the old rationale assertion with the exact mutation kind/label assertion; no title or other case changes. |

Generated artifacts: **NONE**. No other file may be edited. A fifth committed path, fourth
positive label, second negative control, new title, or new case is a STOP and split.

## 7. Ordered coding and proof sequence

1. Dispatch and seal at the clean promotion descendant; prove 31 packets / 1 READY, exact
   four-target cleanliness, and the complete pre-state in sections 1 and 5.
2. Prove each source anchor and each expected test title occurs exactly once before editing.
3. Extend `check_caught` additively with exact detailed-line `FAIL ... > <full-title>`
   attribution and add count-verifying `check_clear`; add exactly two guard paths and the three
   positive plus one negative calls.
   Run `bash -n` before any probe.
4. Make the headline walker's exact one-line setup correction, convert exactly three manifest
   rows, and update exactly the two compatibility assertions.
5. Run focused checks in the shared coding tree. Leave exactly four paths unstaged and
   uncommitted; do **not** run the whole mutation sweep there.
6. The coordinator constructs one immutable direct child with a private index. In a fresh,
   disposable detached proof worktree, run the whole sweep. Require 81 named catches, one clear,
   zero gaps, clean target restoration, and no `mutsweep` residue.
7. In the same immutable proof tree run focused checks, both typechecks, OSR, and bare
   `npm run check:tail`. Only a fully green immutable commit may reach the branch by old-value CAS.

No red branch commit, source cure, generated genesis, or baseline bank follows AO-6.

## 8. Closed acceptance denominator

| ID | Required observation |
|---|---|
| A1 | The clean pre-state is exactly 541 invariants split 68/275/198, ten meta mutations, 78 exact one-to-one labels, 67 in-place-or-missing calls, 53 unique guarded targets, and uncovered baseline 198; all four plant anchors and three expected title tokens occur exactly once. |
| A2 | `check_caught` remains backward-compatible for all 78 old callers and the optional-title arm requires changed bytes, mutated nonzero, exactly one captured physical line that after left trim begins `FAIL ` and ends with literal ` > <expected-full-title>`, restored zero, and no whole-output shortcut/pipeline/eval; a skipped, wrong, absent, or ambiguous title is `BROKEN`, never `CAUGHT`. |
| A3 | The headline setup uses raw analysis while existing A3/A4 retain strict closure; deleting only the government-challenge rewrite row therefore reaches and fails the filtered A6 case itself, with exactly one detailed `FAIL ... > <exact-title>` line, then restores byte-identically and greens. |
| A4 | Removing only `npc_bargain` membership from the applied-summary set reds the filtered voice walker with exactly one detailed `FAIL ... > contract -> cure -> bank completion is aligned and debt-free` line; restoration is byte-identical and the clean rerun greens. |
| A5 | Deleting only Chronicle's returned `summaryText` property reds the filtered prose-family walker with exactly one detailed `FAIL ... > A7 closes the pure Chronicle create-and-append road at 7 7 7` line; restoration is byte-identical and the clean rerun greens. |
| A6 | Swapping the first two summary-kind set members changes source bytes but not semantics: both News contract walkers exit zero and emit exactly one normalized `Test Files 2 passed (2)` and one normalized `Tests 16 passed (16)` line while planted and after restoration, producing exactly one CLEAR and zero reds; exit zero without all four exact summaries is BROKEN. |
| A7 | Exactly three rationale rows become exact mutation labels; the post-state is 541 at 71/272/198 plus ten meta mutations, 81 unique claims/labels, 70 in-place-or-missing calls, 55 unique guarded targets, and baseline 198, while hazard, pre-mortem, corpus baselines, OSR and lighting census remain exact. |
| A8 | The exact four committed paths pass shell syntax, packet/hazard/pre-mortem validation, focused tests, both typechecks, OSR, the whole disposable-tree sweep at 81 CAUGHT + 1 CLEAR + 0 gaps, and the bare full gate at one clean immutable implementation commit with no residue or unrelated movement. |

No ninth case is investigated. An adjacent finding is reported without repair unless it
invalidates A1-A8, in which case stop.

## 9. Verification commands

Focused Vitest runs only through the mutex:

```sh
npm run validate:packets
bash -n scripts/mutation-sweep.sh
npm run validate:hazard-registry
npm run validate:premortem
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/mutationCoverageManifest.test.js \
  tests/lint/newsVoiceContract.walker.test.js \
  tests/lint/newsHeadlineContract.walker.test.js \
  tests/lint/proseFamilyContract.walker.test.js \
  tests/lint/hazardRegistryFailClosed.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
npx eslint \
  tests/lint/newsHeadlineContract.walker.test.js \
  tests/lint/proseFamilyContract.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run check:observed-shape-readers
npm run check:tail
```

`npm run check:tail` is bare, never mutex-wrapped or piped. In the coordinator's clean,
disposable detached proof worktree only, also run:

```sh
bash scripts/mutation-sweep.sh
```

The sweep itself is never mutex-wrapped, never run with `MUTATION_SWEEP_ALLOW_DIRTY=1`, and
never run in the shared coding worktree. Capture its true exit, complete results footer,
81/1/0 counts, final `git status`, and residue scan. A focused subset or hand-run one-off plant
does not replace this whole-sweep receipt.

## 10. Ordinary one-commit lifecycle

1. The coordinator commits this packet, index row, and manifest row as one three-document
   READY promotion from clean terminal AO-5.
2. Dispatch seals that clean promotion descendant after the exact preflight in section 7.
3. The coding agent edits exactly four paths and leaves them unstaged/uncommitted.
4. The coordinator audits scope, then uses a private index to construct one direct green child
   of the sealed promotion without moving the shared ref.
5. A fresh disposable detached worktree proves the whole sweep, focused checks, and bare full
   gate. Only then does one old-value CAS expose the implementation. A CAS mismatch discards
   the commit and recompiles against the actual parent.
6. A separate coordinator three-document commit records packet/index/manifest LANDED state and
   validates 31 packets / 0 READY. The census reservation remains free throughout.

Implementation and terminal record are not squashed. No staging by the coding agent, merge,
shared-tree checkout/reset, stash, dirty override, partial promotion, or source commit is
authorized.

## 11. Mandatory STOP conditions

STOP and report the smallest measured contradiction if:

- HEAD is not a clean admissible descendant of terminal AO-5, the manifest is not 31/1 at
  dispatch, any of the four targets is foreign-dirty, or another non-terminal packet appears;
- the 541-row population, 68/275/198 split, ten meta mutations, 78 labels, 67 mutation targets,
  53 guarded files, uncovered baseline 198, hazard/pre-mortem counts, census, or any unique
  anchor/title count differs before implementation;
- any claiming row besides the exact three delegates to AO-6, or one of the three no longer
  does; a fourth committed path/positive plant or another compatibility assertion is needed;
- a source plant changes zero bytes, changes more than its exact anchor, reds without one
  exact detailed `FAIL ... > <exact-full-title>` line, merely lists that title as skipped, emits
  multiple matching detailed lines, selects multiple
  intended titles, times out, fails collection, or stays green;
- a restored positive command stays red, the semantic no-op control reds, either negative run
  lacks true exit zero or exactly one each of the normalized `Test Files 2 passed (2)` and
  `Tests 16 passed (16)` summaries, any target is not
  restored byte-identically, or residue remains;
- any pre-existing sweep label/caller/command/result changes, any negative label enters the
  manifest join, `MUTATION_SWEEP_ALLOW_DIRTY=1` is needed, or the sweep must run in the shared
  worktree;
- invariant post-counts differ from 71/272/198, total claims/labels differ from 81/81, mutation
  target/guard counts differ from 70/55, `uncoveredBaseline` moves, or a manifest row is
  reserialized outside the exact three objects;
- `HZ-CROSSHOME`, hazard totals, the 28-predicate pre-mortem registry, two-source 23-item union,
  AO-4/AO-5 baselines or digests, OSR 1,998, lighting census
  `2412/365/2047/19984/5638`, any title count, product output, persisted shape, golden, flag,
  tuning, dependency, timeout, floor, ceiling, or unrelated baseline moves;
- any A1-A8 or required check is nonzero, the full sweep is not 81 CAUGHT / 1 CLEAR / 0 gaps,
  the shared ref moves during proof, or old-value CAS fails.

Do not repair the contradiction, edit the packet, widen scope, or continue to GR-4e. The STOP
report names exact observed and expected values and proposes the smallest split.

## 12. Completion receipt

Report sealed parent and final SHA; exact four paths and raw deltas; pre/post manifest, label,
target and guard counts; exact three manifest objects; each plant anchor and expected title;
each mutated exit/exact detailed `FAIL ... > <full-title>` match/restored exit; negative exact
normalized `Test Files 2 passed (2)` and `Tests 16 passed (16)` once per run; 81 CAUGHT / 1 CLEAR / 0 gaps;
clean restoration and residue scan; A1-A8; every command/exit/count; both typechecks; OSR;
unchanged hazard, pre-mortem union/synthetic, corpus baselines/digests and lighting census; bare
full-gate true exit; generated artifacts `NONE`; product/persisted/golden/flag/tuning/dependency/
baseline movement `NONE`; deviations and judgment calls `NONE`; and adjacent observations
without investigation.
