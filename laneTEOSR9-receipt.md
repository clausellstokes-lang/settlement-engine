# laneTEOSR9-receipt — the OSR schema-9 re-freeze mint, EXECUTOR lane

**Lane:** TE-OSR9 (executor). **Charter:** `<scratchpad>/draft-OSR9-MINT.md`, chair-ratified
at ODQ §349 with all six §8 judgments. **Date:** 2026-08-21/22.
**Moved no ref. Never touched the main worktree. No `git stash`. Explicit staging only.**

- **BASE:** `refs/heads/claude/composite-r4` @ `27c250f94bb7c5c799693a62985c5ddecd4b6c7c`
  — re-read at lane start; WF-1F had NOT landed, so BASE == the charter's pinned tip.
- **Worktree:** `<scratchpad>/teosr9-tree`, detached at BASE, its OWN `node_modules`
  (`npm ci`, `NPMCI_TRUE_EXIT=0`, log `laneTEOSR9-npmci.log`).
- **Schema-8 genesis referenced:** `3df85a3aa33b60be5983ebede63375d8d0fae8f5`.

---

## S0 — pin and survey (all CONFIRMED, executed in the worktree)

| check | result | receipt |
|---|---|---|
| the governed **11-path** detector universe, `3df85a3a..BASE` | exactly **2** paths moved: `package.json`, `scripts/lib/observed-shape-corpus.mjs` (+2 / +23 lines) | `git diff --name-only` over the exact `scannerToolFiles()` list |
| `package-lock.json` | **UNMOVED** — no new mint trigger | same diff |
| unscanned subject delta (`src/**.json` + `src/**.generated.js`) | exactly **1** path: `src/data/dossierStateProse/warFaith.generated.js` (of 175 changed `src/` files) | `git diff --name-status` |
| live baseline envelope | `schema 8`; `frozenAtSha == migrationReview.subjectSha == 3df85a3a` (genesis-coincident, §2.5 satisfied); `total 1998 / identities 1412`; `detectorDigest e0038740…`; `unscannedInputDigest 3d85bdee…` | `node -e` over the committed JSON |
| **the drift control** — standalone gate at BASE | **TRUE_EXIT=1**, `observed-shape detector or unscanned execution input changed since the schema-8 instrument was governed; an ordinary gate/write cannot migrate the instrument` | `laneTEOSR9-S0-gate-base.log` |

No surprise; nothing raised at S0. The charter's §2.3/§2.4 measurements reproduce at BASE.

---

## S1 — the `stresses on institutions` triage (charter §4)

Run with the **instrument's own** `writeShapesIn` / `authoredInputHistoryCommits`, over the
instrument's own `sourceFiles()` census (2,141 files). Log: `laneTEOSR9-S1-triage.log`.

**Standing at BASE:** `src/pdf/lib/viewModelBodySlices.js` carries BOTH
`stresses on institutions` : 1 and `pressures on institutions` : 1, both **untagged**
(`rowTags` for that file is `null`). The read is `:221`
`pressures: inst?.pressures || inst?.stresses || []`.

| gate | executed result |
|---|---|
| **0** — `writeShapesIn` over the institution producers (`steps/assembleInstitutions.js`, `domain/institutions/institutionRoster.js`, `institutionCatalog.js`, `worldPulse/institutionLifecycle.js`, `normalizeSettlement.js`) for BOTH keys | **NONE — gate 0 REFUSES** on every producer, for both `stresses` and `pressures` |
| **0 (estate-wide control)** | 19 files carry a write spelling of `stresses`, 27 of `pressures` — none of them an institution producer. The only `pressures:` *property* write in the estate is the read site itself (`viewModelBodySlices.js:221`), which writes the key onto the **view model**, not onto an institution record |
| **3** — closed admission lists | `FIELD_ALIASES` is TOP-LEVEL settlement-scoped (`stressors: ['stress','stresses']`) and the source states `normalizeSettlement` only rewrites top-level keys; `EDITABLE_FIELDS.institution` is `['desc']` — **no closed list names either key on institutions** |
| **1** (refusal only) | `authoredInputHistoryCommits('stresses')` = **2** commits, `('pressures')` = **7**. Non-zero, so gate 1 cannot CLOSE the M8 hypothesis — but it is a refusal gate and never opens one |

**ROUTING OUTCOME — branch 3 ("neither"): the row is a REAL untriaged debt.**
It stays untagged in the inventory exactly as it is; the mint changes nothing about it.
C1 therefore carries **exactly FOUR** M9 entries, not five.

⭐ **Stronger than the charter's advisory:** `pressures on institutions` is the SAME shape,
mechanically confirmed — **both arms of the OR-chain at `:221` are dead**. Recorded for the
chair as *"triaged: reader-side defect candidate — deliberately deferred, documented, not a
bug to re-find"*; the read repair (deleting or re-pointing the dead arms) is a follow-up
REPAIR lane and was **not** smuggled into this mint.

---

## Gate-0 evidence for the four M9 identities (re-proven at BASE, not taken from laneMEAS)

Writer `src/domain/events/applyEvent.js`, the `logEntry` object literal at **`:52-66`**
(charter span CONFIRMED exactly):

| key | line | gate-0 spelling |
|---|---|---|
| `event` | `:53` | `shorthand` |
| `appliedAt` | `:54` | `shorthand` |
| `deltas` | `:57` | `property` |
| `narrativeSummary` | `:59` | `property` |
| `type`, `targetId` | — | **`[]` — gate 0 REFUSES** (correctly NOT banked) |

`CLASS_A_PROTECTED_IDENTITIES` holds 20 entries and **no `eventLog` row** — the class-(a)
overlap check passes.

---

## S2 — the instrument code + the C1 pin re-records

Six files, no new files, no retitles. **CH-1…CH-6 all landed as chartered**; the only
deviation from the charter's letter is naming (`RETIRED_CORPUS_COVERAGE_BASELINE_SCHEMA`,
`EPOCH_DARK_CORPUS_TARGET_SCHEMA`, `EPOCH_DARK_CORPUS_SCANNER_DELTA_PATHS`), which the
charter left to the executor.

**CH-3, re-derived at my own base rather than taken from the charter.** With the old
condition (`predecessor.schema === RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA`, i.e. 6),
an 8→9 migration has genesis=false, so a NEWLY declared identity takes the
`count > priorCount` arm and gets `reason = raiseReason = null`
(`--raise-explained-writer` is illegal with `--migrate-schema`). Null then reds twice —
the tag grammar wants a 1-240-char string, and the genesis check wants
`tag.reason === declaration.ruling`. CONFIRMED by reading both sites. The chartered fix
`genesis = predecessorBaseline?.schema !== BASELINE_SCHEMA` is behaviour-preserving for
committed history (each mint's predecessor is by construction the retired schema, and every
committed genesis already carries reason === ruling — which the A5 genesis pin enforces)
and is what makes any future declaration-adding mint expressible at all.

**CH-5 note, stated so nobody pins a vacuous arm:** the retained-input count is not an
independently reachable refusal. `equalArrays(beforePaths, inputPaths)` fixes the universe
at 11 and `equalArrays(modifiedPaths, deltaPaths)` fixes the delta, so `unchangedPaths.length`
is determined. It is a consistency assert — and the hard-coded `7` was a latent trap that
would have REFUSED any legitimate non-four-path mint, which is exactly what happened here.
The new pin asserts the OBSERVED count (6) rather than claiming to drive a refusal.

### Pin re-records riding C1 (charter §6 P1-P8)

| # | what was done |
|---|---|
| P1 | exemption identity/mechanism/writer arrays +4 rows, declaration order kept; **plus a new pin on the single M9 ruling string** (it is stamped into every tagged row's `reason` at genesis and can never change without numeric growth) |
| P2 | gate-0 evidence identity/key arrays +4; **plus the machine-drawn-split arm** — `writeShapesIn` on `applyEvent.js` must return `[]` for `type` and `targetId`, so the pin says "these four and not those two" instead of "these four are declared" |
| P3 | `BASELINE_SCHEMA` 8→9 at both sites; A5 gains the retired-8 rung (schema 8 validates, refuses 9; 9 refuses 8) |
| P4 | baseline test: schema pins →9, `validSchema8Baseline` retargeted to the retired constant, new `validSchema9Baseline`/`mutateSchema9`, `test.each` fail-closed arm extended to 9, tag-digest binding extended to 9 |
| P5 | **the inverse pin FLIPPED**: `--target-schema=9` was pinned TO THROW and is now the live target; the refusal moved to `10` and the error-text enumeration re-recorded (`must be 9`), as did the bare-CLI default (`schema-8 object`) and the total-predicate list (`4 or 5 or 6 or 7 or 8 or 9`) |
| P6 | new target-9 transition fixtures: 5 delta paths, retained **6**, the reviewable unscanned movement with its named path, the field-absent-when-nothing-moved control, and the no-same-only-invariant arm |
| P7 | `CORPUS_COVERAGE_TARGET_SCHEMA` **stays 8** — untouched, and now pinned WITH a comment saying a retired constant a live one can move is not retired |
| P8 | derived fixtures re-ran green with no edits, except one that had to move: `observedShapeBaseline.test.js`'s malformed-envelope fixture now uses `mutateSchema9`, because a predecessor-schema envelope returns 1 at the schema rung before the envelope law is reached and would have proven the wrong refusal |

### S2 gates (in-shell TRUE_EXIT, self-named logs)

| run | result | TRUE_EXIT | log |
|---|---|---|---|
| the four code-bound OSR suites | **117 passed / 117** | **0** | `laneTEOSR9-S2-osr4b.log` |
| ESLint over all six edited files | clean | **0** | `laneTEOSR9-S2-eslint.log` |
| full `npx vitest run tests/lint` | 1672 passed / 9 failed across 123 files | **1** | `laneTEOSR9-S2-lintsweep.log` |
| the two timed-out walkers, re-run ALONE | **25 passed / 25** | **0** | `laneTEOSR9-S2-timeoutprobe.log` |

**The nine failures, attributed one by one — none is a regression:**

- **4 are BANKED** in `scripts/.test-ratchet-baseline.json` (11 entries total): `warCostKindPools.walker` ×3 and `warRulingKindPools.walker` ×1. Baseline lookup done before treating any red as blocking.
- **2 are the DECLARED DARK WINDOW** — `observedShapeReaders.walker.test.js`, exactly the two the charter predicts: `expected 8 to be 9` (the live baseline is still schema 8) and `expected 60 to be 44` (the live bank grew by the four M9 identities). ⭐ The second is also a MEASUREMENT: live `explainedWriters.banked` = **60** at my tree.
- **2 are CPU-STARVATION TIMEOUTS, proven so:** `lawBandTable.walker` and `postureNameCollision.walker` both failed with `Error: Test timed out in 20000ms` — not assertions — while the OSR walker was running two full corpus builds (223 s) in a sibling worker. Re-run in isolation: **25/25 pass, TRUE_EXIT=0.** Neither file is touched by this mint.
- (the 9th is one of the four banked warCost/warRuling rows above)

### Census — proven immobile rather than assumed

`scripts/.test-ratchet-baseline.json` carries `totalTests 28274 / totalFiles 2387 /
skippedCeiling 1 / uncollectedSuites {} / 11 entries`. My edits add assertions INSIDE
existing tests and add no `test()`/`it()` blocks. Measured against BASE, per file:

```
observedShapeSentinel.test.js   BASE=33  NOW=33
observedShapeBaseline.test.js   BASE=14  NOW=14
observedShapeMigration.test.js  BASE=23  NOW=23
observedShapeReaders.walker...  BASE=27  NOW=27
```

and a title-by-title `diff` of every `test(`/`it(` line against BASE is **identical** in all
three touched files. ⚠ I had briefly retitled two A5 tests to say "schemas 7-9"; I
**reverted both** — a title is a census key and a rename is a delete-plus-add — and moved
the statement into a comment above each. Neither title appears in the ratchet's `entries`,
so the retitle would probably have been survivable; "probably" is not the standard the
charter set (§1(d): zero retitles).

## S3 — C1 committed

**C1 = `6c3efc6a4dc59b2e2e0947ed170d13d222df33ed`**, parent `27c250f9`. Six files staged by
explicit path, never `-A`. Post-commit `git status --untracked-files=all` is **empty**;
nothing of anyone else's was staged or lost. Pre-commit ran `npx lint-staged` (eslint --fix)
only, exit 0, and made no changes.

⚠ Recorded, not touched: `git stash list` in this worktree shows ONE pre-existing entry,
`stash@{0}: On analytics-intelligence-layer: generation-tuning fixes` — **foreign, predates
this lane, left exactly as found.** lint-staged's own temporary backup stash was created and
cleaned up by the hook. This lane ran no `git stash`.

**The delta-path set, RE-MEASURED at C1 (never transcribed):** the governed 11-path diff
`3df85a3a..C1` is exactly

```
package.json
scripts/check-observed-shape-readers.mjs
scripts/lib/observed-shape-baseline.mjs
scripts/lib/observed-shape-corpus.mjs
scripts/migrate-observed-shape-readers.mjs
```

— five paths, matching the frozen constant byte-for-byte, retained count 6. The unscanned
delta is exactly `src/data/dossierStateProse/warFaith.generated.js`. `package-lock.json`
still unmoved.

## S11 method control, run EARLY so the later proof means something

Before the cure, the same harness was pointed at the disease. `git archive 3df85a3a` into a
scratch extraction with no `.git` at all, then recompute the manifests from bytes and
compare against the **committed schema-8 baseline**:

```
MATCH  scannerProvenance.detectorDigest        e00387407d19d87b89c3e3abcd09216346684c05f18c0a2a6cacf254736172b1
MATCH  scannerProvenance.scanTreeDigest        bc752b5bf9c957570831badc37bc1e398b0105cc885ace0f2d89800446075df5
MATCH  scannerProvenance.sourceTreeDigest      c0835dd4f1c0cae4ee601d1034dfcb931f6bbd64d76f6b51e2e476593b584329
MATCH  scannerProvenance.executionTreeDigest   5ea2bb0c51f595015c18aab8e5ed9bffd62091f27b13d25bfdb61c7ab6c6097f
MATCH  scannerProvenance.unscannedInputDigest  3d85bdee459303acb1201b2c4bd887da1a907c38f23ef5368416affc8ac9ccdc
MATCH  migrationReview.detectorTreeDigest      e00387407d19d87b89c3e3abcd09216346684c05f18c0a2a6cacf254736172b1
RESULT: REPRODUCES     REPRO_TRUE_EXIT=0
```

Log `laneTEOSR9-S11-control-old.log`. This is an INDEPENDENT path to the frozen numbers —
the gate proves its digests from git plumbing against a clean committed HEAD; this hashes
files on disk in a tree with no git at all. Two paths to the same number is what makes the
post-mint reproduction mean "the freeze is restored".

⭐ A structural fact the control surfaced, worth recording: the extraction of `3df85a3a`
carries a **schema-7** baseline (`frozenAtSha d081feee`). The schema-8 baseline landed at a
DESCENDANT commit. That is the same two-commit C1/C2 shape this mint uses, confirmed in the
history rather than argued — and it is why `validateBaselineHistory` looks for a committed
schema-N descendant of `subjectSha` rather than expecting it at the subject commit itself.

## S4-S7 — the governed chain, executed at C1 (`6c3efc6a`)

| step | command | result | TRUE_EXIT | log |
|---|---|---|---|---|
| S4a artifact | `--scan-only --scan-mode=legacy-leaf --json=<external>` | 1998 findings; subject == scanner == C1 | **0** | `laneTEOSR9-S4-artifact.log` |
| S4b report | `migrate --predecessor=<live baseline> --legacy=<artifact> --target-schema=9 --json --review-template` | see below | **0** | `laneTEOSR9-S4-report.log` |
| S5 ledger | `TEOSR9-complete-review.mjs` | 1413 decisions, 0 pending/rejected, 0 empty notes | **0** | `laneTEOSR9-S5-review.log` |
| S6 bundle | `migrate … --review --bundle` | 50.7 MB governed bundle | **0** | `laneTEOSR9-S6-bundle.log` |
| S7 **the migration write** | `--write --migrate-schema=9 --migration-review=<bundle>` | `froze 1998 finding(s) / 1412 identit(ies) across 387 file(s)` | **0** | `laneTEOSR9-S7-write.log` |

### ⭐ THE RECONCILIATION IS ALL-'SAME' — no growth to attribute, J2 does not fire

```
predecessorSame 1412 · predecessorNew 0 · predecessorIncreased 0
predecessorDecreased 0 · predecessorGone 0
conservation: 1412/1412 identities, 1998/1998 counts, both sides
```

The fresh scan at C1 reproduces the committed schema-8 inventory **address for address**.
laneMEAS's address-level control is independently confirmed by the instrument's own
reconciliation. Nothing was bulk-accepted because nothing grew.

### The scanner transition — CH-5 and CH-6 both firing as chartered

```
kind          observed-shape-schema-8-to-9-migration      policy schema-8-to-9-exact-scanner-transition-v1
modifiedPaths package.json, check-observed-shape-readers.mjs, observed-shape-baseline.mjs,
              observed-shape-corpus.mjs, migrate-observed-shape-readers.mjs        (5)
unchangedPaths package-lock.json, governed-artifact-io.mjs, legacy-reader-shape-scan.mjs,
              observed-shape-governance.mjs, reader-shape-scan.mjs, spatialPackFixtures.js  (6)
unscannedMovement  modified: ["src/data/dossierStateProse/warFaith.generated.js"]
                   added: []   removed: []
  predecessor unscannedInputDigest 3d85bdee459303acb1201b2c4bd887da1a907c38f23ef5368416affc8ac9ccdc
  current     unscannedInputDigest 540750a927817f35a0f562920a246419a8a372203ad487c9652889d7d84f2f4a
  predecessor detectorTreeDigest   e00387407d19d87b89c3e3abcd09216346684c05f18c0a2a6cacf254736172b1
  current     detectorTreeDigest   6434b8f9f7eef23ebadf698cf5da7ef551dc4edadbef6dfa8af2d2190c1c40df
issues: exactly 1 — the scanner transition, carrying `unscannedPaths` and naming the file
        in its human-facing message.
```

**CH-5 is load-bearing, not hygiene:** with the old hard-coded `unchangedPaths.length !== 7`
this mint would have been REFUSED outright at 6 retained inputs. **CH-6 is load-bearing too:**
with the old unconditional equality it would have been refused at the moved unscanned digest,
with no review path — the instrument would have stayed dark permanently.

`corpusCompatibility`: the four EXECUTION keys (seeds 4, configs 4, generations 16,
pulseIntervals 12) MATCH; the OBSERVATION keys moved and are RECORDED, not refused —
`simulationFlagsLit: 74 -> 76`, `shapeCount: 1321 -> 1300`.

### The new baseline

```
schema 9 · frozen 2026-08-22 · frozenAtSha == migrationReview.subjectSha == 6c3efc6a (genesis-coincident)
total 1998 · identities 1412 · files 387        — the inventory did NOT move
detectorDigest        6434b8f9f7eef23ebadf698cf5da7ef551dc4edadbef6dfa8af2d2190c1c40df
unscannedInputDigest  540750a927817f35a0f562920a246419a8a372203ad487c9652889d7d84f2f4a
```

### ⭐ THE EXEMPTION-TAGGING INVENTORY DELTA, ATTRIBUTED ROW BY ROW

RE-DERIVED from the fresh baseline, never carried from the charter (whose ~60/~40 were
estimates). **44 reads / 31 addresses → 60 reads / 40 addresses; delta +16 / +9.**

| identity | reads | addresses | attribution |
|---|---|---|---|
| `factions on locks` | 2 | 2 | unchanged (M8, CR-OSR-SCHEMA-6) |
| `neighbourNetwork on settlement` | 36 | 24 | unchanged (M9, CR-OSR-FREEZE-6-R2) |
| `stresses on settlement` | 4 | 3 | unchanged (M8, registered alias) |
| `worldPulse on campaignState` | 2 | 2 | unchanged (M9, CR-OSR-SCHEMA-6) |
| **`event on eventLog`** | **9** | **4** | NEW — mutate.js(3), chronicleFeed.js(3), NarrativeArchivePanel.jsx(2), campaignCanonRelationshipSession.js(1) |
| **`narrativeSummary on eventLog`** | **4** | **3** | NEW — mutate.js(2), chronicleFeed.js(1), NarrativeArchivePanel.jsx(1) |
| **`deltas on eventLog`** | **2** | **1** | NEW — mutate.js(2) |
| **`appliedAt on eventLog`** | **1** | **1** | NEW — chronicleFeed.js(1) |
| **TOTAL** | **60** | **40** | +16 reads / +9 addresses, all four declared, none elsewhere |

The +16/+9 equals EXACTLY the untagged eventLog footprint measured in the committed schema-8
predecessor before the mint (9 addresses / 16 reads, verified independently by reading the
predecessor inventory). No address joined the bank that was not one of the four declared
identities, and the inventory triple 1998/1412/387 is unmoved — because M8/M9 BANKS rows, it
does not clear them.

**CH-3 confirmed in the produced artifact:** all four new rows carry
`reason = 'CR-OSR-SCHEMA-9 / M9 — ODQ §346.1 Ruling-B eventLog precedent'` (the genesis arm
fired), and the four pre-existing rows KEPT their original rulings untouched. Under the old
condition every one of these nine rows would have carried `reason = null` and the write would
have thrown.

## S8 — the C2 pin re-records (walker)

P9 derives (schema pin). P10/P11 re-recorded to the MEASURED 60/40 with the full per-identity
map, plus three new arms that make the figures mean something rather than merely agree:
the genesis reason is checked against the rows it actually landed on (it is unwritable
afterwards); the 22 unbanked eventLog identities are anchored on `type`/`targetId` being
PRESENT in the live raw scan and ABSENT from the bank; and the unchanged inventory triple is
stated as the bank-not-clear claim. Walker census: BASE=27 tests, NOW=27, titles identical.
ESLint clean.

## S9-S11 — the rehearsal closed at `27c250f9`, and why it is a REHEARSAL

**C2(rehearsal) = `34b1b944eab7c7c3f914b4459e9aa4a799f27083`.**

| proof | result | TRUE_EXIT | log |
|---|---|---|---|
| S9 commit C2 | 2 files, explicit paths, tree clean after | **0** | — |
| S8 walker at C2 (gate-mutex `--run`, §352.2) | **27 passed / 27** — the dark window CLOSED | **0** | `laneTEOSR9-S8-walker.log` |
| S10 in-tree `npm run check:observed-shape-readers` | `1998 finding(s), exactly matching the frozen inventory`; M6 notice unchanged at `theta=0.8, >=8 keys`; M8/M9 notice now `8 declared identit(ies) … 60 read(s)` | **0** | `laneTEOSR9-S10-intree.log` |
| S11 digest reproduction at C2 (extraction, no `.git`) | all six digests **REPRODUCE** | **0** | `laneTEOSR9-S11-rehearsal-c2.log` |

```
MATCH  detectorDigest        6434b8f9f7eef23ebadf698cf5da7ef551dc4edadbef6dfa8af2d2190c1c40df
MATCH  scanTreeDigest        eb6080b933d03faa8ba567d7fe6a3b7056779ce6eefbbeebfd5c864702ad7171
MATCH  sourceTreeDigest      6a80b9e5ed712daa669a9712733e270840d17cadb9dc4f6ed6ee0be43e8483b5
MATCH  executionTreeDigest   cc66d2eef1b50f572ecea31c4b51de6cb5ecdc2b7faae5b6db8236ed13c8bc5c
MATCH  unscannedInputDigest  540750a927817f35a0f562920a246419a8a372203ad487c9652889d7d84f2f4a
MATCH  migrationReview.detectorTreeDigest  6434b8f9…
```

Also verified in-tree: `theta=0.8, >=8 keys` in the M6 notice — the minKeys boundary held —
and the UNREVIEWED-UI cohort unchanged at 51 files / 130 identities / 195 reads.

### ⛔ WHY THIS TIP CANNOT BE HANDED TO THE CHAIR — the slot-aware finding

The chair's advisory landed mid-lane: `claude/composite-r4` moved to `5d18b4a0` (WF-1F), and
T2E gates before me. **An OSR mint cannot be cherry-picked after the fact, and this is a
structural property of the instrument, not a preference.** `migrationReview.subjectSha` is
C1's SHA, and `validateBaselineHistory` demands three things of it: that it is a committed
ANCESTOR of HEAD; that the baseline committed AT it matches `predecessorBaselineTextSha256`;
and that `committedInputManifestsFor(subjectSha)` reconstructs the scan/source/detector/
execution digests from that commit's tree. A cherry-pick rewrites the SHA, so all three fail
at once — and the third fails even in principle, because WF-1F changed `src/` and the source
tree at a rebased C1 is a different tree. A cherry-picked mint is a permanently red gate.

**So the mint is REBUILT at the final tip, not moved to it.** C1's code cherry-picks
cleanly (it is code only); C2 must be REGENERATED — fresh artifact, report, ledger, bundle,
write — because every digest in it is bound to the subject commit.

**Pre-measured against WF-1F (`27c250f9..5d18b4a0`), so the rebuild's shape is known:**

- **zero** of the eleven governed detector paths touched → the five-path delta constant and
  the `schema-8-to-9-exact-scanner-transition-v1` policy stay exactly right;
- **zero** unscanned subject inputs touched → the CH-6 movement stays exactly
  `warFaith.generated.js`, one named path;
- two SCANNED `src/` files modified — `subsystemRowsVirtual.js` (no inventory row) and
  `realmEvents.js` (one row, `primaryDeitySnapshot on config`: 1). If either moves a row at
  the rebuild, it is attributable to WF-1F by name, which is what J2 requires; if the move is
  NOT attributable it is a STOP-RAISE, not a bulk accept.

The rehearsal is what makes the rebuild low-risk: every step of the chain is now executed
evidence rather than a plan, including the two things most likely to surprise a terminal —
that `validateBaselineHistory` accepts the C1→C2 shape, and that the new digests reproduce
from bytes.

## The negative controls — run, not assumed

The charter's §6 "must stay green, untouched" table is the proof that the mint stayed in
scope. Each was executed rather than argued.

| control | evidence | TRUE_EXIT |
|---|---|---|
| the minKeys boundary pin, BOTH sides (`observedShapeSentinel.test.js:610`/`:629`) | the four `CR-OSR-FREEZE-6` tests pass | **0** (`laneTEOSR9-NEGCTRL-minkeys.log`) |
| the byte-frozen detector blob pin | `legacyReaderShapeScan.test.js` 2/2 | **0** (`laneTEOSR9-NEGCTRL-detector.log`) |
| M11/M12 vocabulary + class-(a) erosion pins, A3/A4 banked-growth refusal | inside the green 117/117 | **0** |
| `scripts/lib/legacy-reader-shape-scan.mjs` untouched | `git diff 27c250f9..HEAD` over that path is EMPTY | — |
| no diff hunk mentions `SHAPE_FAMILY_FILTER`, `minKeys`, `theta`, `CLASS_A_PROTECTED_IDENTITIES`, `DOM_GLOBAL_RECEIVER_ROOTS`, `LANGUAGE_SURFACE_RESIDUAL_KEYS` | grep over the full diff returns nothing | — |

Balanced-paren extraction of each governed constant, base vs C1, hashed:

```
IDENTICAL  SHAPE_FAMILY_FILTER              (theta: 0.8, minKeys: 8 — byte-for-byte)
IDENTICAL  SCAN_CONFIG
IDENTICAL  CLASS_A_PROTECTED_IDENTITIES
IDENTICAL  DOM_GLOBAL_RECEIVER_ROOTS
IDENTICAL  LANGUAGE_SURFACE_RESIDUAL_KEYS
IDENTICAL  EXACT_SCAN_EXCLUDED_SCOPE
CHANGED    EXPLAINED_WRITER_EXEMPTIONS      — the one chartered change
```

⚠ **A methodology note worth keeping, because my own instrument lied first.** A quick
`awk '/^export const X = Object.freeze\(/,/^\)\;/'` range reported FOUR of these constants as
CHANGED. They were not: the terminator `^);` never matches `});`, so every range ran to
end-of-file and swept up my real edits elsewhere in the file. The balanced-paren extraction
above is the correct measurement, and it agrees with the diff-hunk grep. A shell range you
have not validated on a known-unchanged control is not a measurement — it is a guess with a
hash attached.

## Chair ruling received mid-lane (ODQ §352.2 / §353) — and its consequences

The chair re-sequenced the closing train to **T2E → WF-8 → TE-OSR9 (last)**, on grounds that
strengthen the case beyond my own raise: a fresh schema-9 freeze followed by any landing that
adds scanned reads goes stale on arrival, and WF-8 lands two new worldPulse leaves whose
reads may enter the inventory. Minting LAST captures the whole train's final truth in one
freeze, and I rebuild exactly once at WF-8's landed tip. The window from my C1 to my CAS is
protected — no GO issued to any lane, nothing landed — and C1's SHA goes on the record in my
terminal heads-up as the window's start.

Ratified by the chair: the rehearsal as METHOD PROOF; CH-3/CH-5/CH-6 as load-bearing (my
executed refusals show the instrument was un-mintable as written); the §4 triage outcome
(branch 3, four entries, both OR-chain arms dead, read repair chartered as its own lane);
and the mutex evidence (34 s locked vs 224 s bare) as §352.2's empirical validation.

## The rebuild runbook — written down before it is run, so it is auditable

Executed once, at WF-8's landed tip `T`. Same worktree, same `node_modules` (the lockfile has
not moved, so `npm ci` is not re-run unless `package-lock.json` changes at `T` — which would
itself be a NEW mint trigger and a STOP-RAISE).

```
R0  re-read the tip; confirm package-lock.json unmoved; confirm the C1 file set still has
    ZERO overlap with everything landed since (measured now against 5d18b4a0: zero overlap,
    so the cherry-pick cannot conflict — re-measured at T)
R1  git checkout <T>            (tree is clean; the rehearsal commits stay reachable by SHA)
R2  git cherry-pick 6c3efc6a    -> C1'   (code only; the walker's C2 pins are NOT in it)
R3  re-derive at C1': the governed 11-path delta (expect the same five), the unscanned delta
    (expect the same one file), package-lock unmoved
R4  --scan-only --scan-mode=legacy-leaf --json=<external>          (fresh artifact)
R5  migrate --target-schema=9 --json --review-template
    ⛔ CHECK THE RECONCILIATION FIRST. Non-'same' rows are triaged per the rule sent to the
       chair: attributable+benign -> individually reasoned accept; attributable but a genuine
       reader-with-no-writer defect -> STOP-RAISE before writing; unattributable -> STOP-RAISE.
R6  complete the ledger; build the bundle
R7  --write --migrate-schema=9 --migration-review=<bundle>         (the freeze)
R8  RE-DERIVE the walker figures from the NEW baseline and re-record P10/P11 — never carry
    60/40 forward, it is a measurement at a tip that no longer exists
R9  commit C2'                                                     (the tip for CAS)
R10 in-tree `npm run check:observed-shape-readers` (bare, fresh shell, TRUE_EXIT captured)
R11 DETACHED: fresh worktree at C2', own node_modules, standalone gate -> TRUE_EXIT=0
    plus the digest reproduction BOTH ways (3df85a3a extraction -> old digests;
    C2' extraction -> new digests)
R12 heads-up to the chair naming BOTH SHAs, WAIT for GO, then the ONE full `npm run check`
    (bare — never wrapped in the mutex, per the self-deadlock law)
```

Heavy focused vitest sweeps inside R-steps run under `sh scripts/gate-mutex.sh --run -- …`
per §352.2. `npm run check*` never does.

## ⭐ THE REHEARSAL PAID FOR ITSELF — an anchor-walker red, and it was MINE

Ran `vitest run tests/lint tests/build` under the mutex at the rehearsal C2 — the documented
pre-terminal sweep, precisely because five ratchets bite only at a full run.
**TRUE_EXIT=1**, 6 failures / 1994 passed (`laneTEOSR9-REHEARSAL-lintbuild.log`).

Five of the six are BANKED in the ratchet baseline (warCost ×3, warRuling ×1,
clampPrimitive ×1). **The sixth was mine:**

```
tests/lint/negativeAssertionAnchor.walker.test.js
  observedShapeReaders.walker.test.js: 1 un-anchored negative assertion(s) at line(s) 678
  (frozen ceiling 0).
```

The flagged line was an arm I had ADDED *as an anti-vacuity control* — and it was itself
un-anchored. `expect(bankedEventLog).not.toContain('type on eventLog')` is true both when the
identity is correctly refused and when the bank drifted away entirely; the control could
outlive the regression it was written to catch, one level up from the vacuity it was guarding
against. The walker is right and the estate's own machinery caught me.

**Cured (`f91d5de0`)** in two halves that cannot both go vacuous:

- a POSITIVE that `type on eventLog` and `targetId on eventLog` are still LIVE estate reads —
  the M9 refusal is a RULING about a real read, not an observation that the read vanished;
- `expectAbsentWithAnchor(bankedEventLog, refused, 'event on eventLog', …)` — the anchor is a
  sibling travelling the SAME filter on the SAME shape, so an emptied bank reds on the anchor
  instead of passing the exclusion;
- and the cohort-wider-than-the-bank check now compares against the bank's own length rather
  than a literal `4`.

Verified: anchor walker + OSR walker **36/36, TRUE_EXIT=0**; ESLint clean.

⚠ **Had this been left, it would have redded inside my protected CAS window** — the one place
it is most expensive, and the exact bite pattern the "five ratchets only the full gate runs"
hazard describes. The rehearsal is what converted that into a cheap fix at a throwaway tip.

⚠ **Carry-forward for the rebuild (R8):** the walker's re-recorded pins must use the ANCHORED
form. Re-deriving the figures is not enough; re-deriving them back into a bare `not.toContain`
re-creates this red.

Rehearsal head after the fix: `f91d5de0ac437303c8d15991e41f4dce2f67b311`.

## Pre-terminal reconnaissance of the full gate, done at the rehearsal tip

`npm run check` is an `&&`-chain of 17 steps, and an early red BLINDS every later one — so the
cheapest way to protect the terminal is to know which steps are already green. Everything
below was run at the rehearsal head, EXCEPT the two deliberately deferred at the bottom.

| step | TRUE_EXIT |
|---|---|
| the 11 `validate:*` steps (hazard-registry, premortem, packets, data, custom-content-manifest, migration-head, edge, map, tuning-bands, foundry-module, mcp-server) | **0** each |
| `typecheck:ratchet` | **0** |
| `typecheck:domain:strict` | **0** |
| `lint` | **0** |
| `vitest run tests/lint tests/build` (mutexed) | **1** — 5 BANKED reds, and the one that was mine, now cured |

Logs: `laneTEOSR9-PRECHECK-validates.log`, `laneTEOSR9-PRECHECK-typelint.log`.

**Deliberately deferred to the terminal, with reasons — documented, not forgotten:**

- **`test:ratchet`** (the whole 28k-test census). Deferred because running it standalone would
  hold the vitest mutex for a long stretch while siblings are actively gating — the exact
  antisocial pattern §352.2 exists to stop — and its marginal information is low: it re-runs
  `tests/lint`/`tests/build` (already swept) plus corpora this mint provably cannot reach.
- **`build` + `verify:dist`.** Deferred because the mint **cannot** move the bundle, and that is
  measured rather than assumed: the complete file list for `27c250f9..HEAD` is eight files, of
  which **zero** are under `src/`. The bundle and `sizeBaseline` are derived from `src/`, so
  there is no path from this change to either.

### Two census facts, corrected against the source rather than recalled

- `scripts/check-test-ratchet.mjs` treats `totalTests` as a **FLOOR** (`rows.length < totalTests
  * SCOPE_FLOOR_RATIO` reds), not an exact match. Test GROWTH is lawful; only a large shrink
  reds. So WF-1F's added tests are fine, and my zero-delta is trivially fine. The "census sits
  AT its pinned ceiling" hazard I carried in refers to the **banked-failure `entries` registry**
  — adding a new banked failure — not to the totals.
- `skippedCeiling` IS a ceiling and `uncollectedSuites` IS an allowlist; my mint moves neither.

### The OSR gate is standalone — re-verified at MY base, not inherited from laneMEAS

`npm run check` does not mention `observed-shape`; neither does `ci.yml`, `.husky/pre-commit`
or `.husky/pre-push`. Two consequences: the C1→C2 dark window never redded the full gate (so
the declared window cost nothing), and the terminal's `npm run check` will NOT exercise the
OSR gate — which is exactly why the in-tree and DETACHED runs are separate, named proofs.

### Also recorded: the mint writes no `docs/**.md`

Measured, not asserted: zero `docs/**.md` in the eight-file list, so there is no per-claim
naked-claim debt to service. The ODQ/ledger entries remain the chair's.

## ⚠ A watcher was KILLED, and its silence proved nothing

My branch-tip watcher terminated with `[killed]` rather than completing — consistent with the
recorded sibling-`pkill` hazard. **I re-read the tip directly rather than inferring from the
watcher's silence**; it is unchanged at `5d18b4a0`, and my worktree is intact and clean at
`f91d5de0`. Watcher re-armed. The standing lesson applies verbatim: a background watcher that
goes quiet is not evidence of no-change, and the chair's direct message remains the primary
channel for WF-8's landing.

*(the lane holds for WF-8's landed tip, then rebuilds once)*
