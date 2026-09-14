# RECEIPT — LANE OSR-SCHEMA18 — ✅ **COMPLETE: the register is re-anchored and the OSR CLI is back on**
⟦Seat: Opus 5 — Fable-unvalidated · Lane: OSR-SCHEMA18 · 2026-09-05 evening⟧

## OUTCOME TABLE
| # | premise (brief line) | measured at `b0cbc67a1` | verdict | sha |
|---|---|---|---|---|
| P1 | register `schema` 17, `subjectSha` `0742f8ff5…`, `simulationFlagsLit` 80 (L15) | schema **17**, subjectSha **`0742f8ff5997bb5ddb369c152cb31d587dde7121`**, flagsLit **80** | ✅ CONFIRMED | — |
| P2 | `merge-base --is-ancestor 0742f8ff5 HEAD` is FALSE (L16) | exit **1** = NOT an ancestor (object exists, exit 0) | ✅ CONFIRMED — the lane lives | — |
| P3a | plain gate → **exit 0** (L17) | **exit 1 in 0 s**, throws `observed-shape migration genesis is not a committed ancestor of current HEAD` before scanning | ⛔ **BRIEF LINE 17 IS WRONG** — see CORRECTION 1 | — |
| P3b | `--write` → REFUSED (L17) | refused by the same throw | ✅ CONFIRMED — **cured by `a05a4646e`** | `a05a4646e` |
| P4 | writerReach's two arms banked; `OWED_CEILING` 5 (L18) | both rows present in `scripts/.test-ratchet-baseline.json:43,60`; `testRatchet.test.js:929` `OWED_CEILING = 5` | ✅ CONFIRMED | — |
| P5 | ninth exemption retired at §900? (L19 item 2) | **declared roster 9**, register banks **41 addresses across 8 identities**; `isCriminal on incomeSources` banks nothing | ⛔ **NOT DONE** — left to the chair, F1 | none (chair's) |
| P6 | walker comments `:372`/`:1254` say "roster is still nine" — stale or true? (L19) | roster **is** nine ⇒ the comments are **ACCURATE**, not stale | ✅ comments correct; F1 is the live item | — |
| P7 | `_doc` stale (L19 item 3) | `_doc[9]` "SCHEMA 10 … eight-identity M8/M9 bank"; `_doc[20]` "Schemas 4–9 are the RETIRED numeric predecessors" | ✅ **CURED** in the genesis write, surgically | `f20d5dd48` + `a05a4646e` |
| P8 | L-HOMES-2 rename: pure identifier swap, zero identity movement? (L20) | **NO — 119 sites / 44 files; NINE match the identifier as TEXT, not as a binding** | ⛔ **REFUSED with measurement (R1)** | none |
| P9 | `simulationFlagsLit` moves 80 → 81 (L26) | live corpus meta **81**; the **only** one of nine fields that moves | ✅ CONFIRMED — **frozen at 81**; both walkers now read 81 | `a05a4646e` |
| P10 | ratchet `totalTests` = 31970 for the capsule (L28) | `scripts/.test-ratchet-baseline.json` `totalTests` **31970** | ✅ CONFIRMED — capsule shell-out **exit 0**, not committed | none (chair's) |
| — | **THE ACT: the rung** | 3-path delta, fixed point; row delta 0 | ✅ minted | **`f20d5dd48`** |
| — | **THE ACT: the genesis** | `froze 1972 / 1397 / 386`, gate **exit 0** | ✅ re-anchored | **`a05a4646e`** |

## ⛔ CORRECTION 1 — BRIEF LINE 17 IS FALSE AT THIS SHA
> "`node scripts/check-observed-shape-readers.mjs` (plain) → expected exit 0"

**Measured: exit 1, in 0 seconds, without scanning at all.** `run()` calls
`validateBaselineHistory(baseline)` in the ordinary gate branch (`check-observed-shape-readers.mjs:2798`),
BEFORE the scan, and it throws on the same `git merge-base --is-ancestor` the ruling names:

```
Error: observed-shape migration genesis is not a committed ancestor of current HEAD
  [cause]: Command failed: git merge-base --is-ancestor 0742f8ff5997bb5ddb369c152cb31d587dde7121 HEAD
```

⭐ **`RULING-OSR-900-NO-WRITE.md`'s ADDENDUM already said this** — "`base-state-capsule.mjs` shells out to
`node scripts/check-observed-shape-readers.mjs`, whose default run ALSO validates history" — so the ruling is
right and only the brief's step-0 table is wrong. Nothing about the ACT changes: the refusal is broader than
the brief claimed, which makes this lane more necessary, not less. The brief's own STOP condition is attached
to P2 (ancestry), and P2 HOLDS.
⚠ Consequence for the chair: the claim "the gate is green at the §901 tip" cannot be true for the CLI — the
CLI has been dark on this lineage since the cherry-pick. Only the vitest walker was green.

## ⭐ THE REGISTER IS EXACT AT THE TIP — CONFIRMED BY EXECUTION, NOT BY THE RULING'S WORD
`--scan-only --scan-mode=legacy-leaf` bypasses the gate branch (and so the history validator) and reaches a
real scan. Exit **0**, 15 s:

| | live scan at `b0cbc67a1` | frozen register |
|---|---|---|
| findings | **1972** | 1972 |
| files | **386** | 386 |
| identities | **1397** | 1397 |
| inventory row diff | **GONE 0 · NEW 0 · COUNT-MOVED 0** | — |
| bank | "9 declared identit(ies) … banked and enforced **62** read(s) across **8** of them" | rowTags 41 addresses / 8 identities |
| filters | M6 124 · M11 11 · M12 0 | — |

⇒ **rung 18 is a VERDICT-ONLY / RE-ANCHORING rung**, the same class as 13, 14, 15 and 16 — its
reconciliation must be EMPTY. Rung 17 was the row-moving kind; this one is not.

## ⭐ EVERY REGISTER FIGURE, PREDICTED IN WRITING BEFORE ANY INSTRUMENT RUNS
(preamble rule. Measured from the pre-state scan artifact against the frozen register.)

| field | prediction |
|---|---|
| `schema` | 17 → **18** |
| `inventory` | **BYTE-IDENTICAL** — 386 files, 1397 identities |
| `total` | **1972**, unmoved |
| `identities` | **1397**, unmoved |
| `rowTags` | **UNMOVED** (41 addresses, 8 identities) |
| `minRows` / `originMinRows` | 40 / 8, unmoved |
| `corpusMeta.simulationFlagsLit` | 80 → **81** (SEAT-78's `irregularForceEnabled`) |
| `corpusMeta` — the other EIGHT fields | **UNMOVED** (seeds 4 · configs 4 · generations 16 · pulseIntervals 12 · shapeCount 1299 · steadingsMinted 12 · originCount 8560 · transitionCount 14496) |
| `scanStats` | files 2162 → **2176** · reads 124468 → **125631** · resolved 9563 → **9669** · unresolved 114905 → **115962** |
| `sentinel` | resolvedReads 9563 → **9669**; totalKeys **6532** and usableShapes **337** unmoved |
| report `predecessorGone` / `New` / `Increased` / `Decreased` | **0 / 0 / 0 / 0** |
| report `issues` | **exactly 1** — the scanner transition, naming THREE delta paths |
| `_doc` | `[9]` and `[20]` cured; every other line byte-identical |
| `migrationReview.subjectSha` | **my own rung car**, an ancestor of the dock HEAD |

⛔ **THE FENCE THAT MATTERS: `predecessorNew` must be 0 AND `predecessorGone` must be 0.** Unlike rung 17,
a single moved row in EITHER direction falsifies this rung — the tip's inventory already reconciles exactly,
so any movement would mean my own cars changed the detector's verdict, which a re-anchoring may not do.

## PROGRESS
- [x] brief, preamble, brief-17, receipt-17, both rulings read in order
- [x] step 0: every premise re-derived — 8 confirmed, 1 brief line corrected, 1 refusal
- [x] step 1: the rename car — **REFUSED with measurement (R1)**
- [ ] step 2: schema 18 rung minted
- [ ] step 3: genesis + `_doc` cure in the same write
- [ ] step 4: two-walker proof
- [ ] step 5: capsule shell-out
- [ ] step 6: cost
- [ ] RETROVALIDATION ROW

**DOCK:** `$SC/laneOSR18` HEAD `b0cbc67a15baf0997028ab501c7ee09565f93980`, porcelain **0**, detached,
453 `node_modules` symlinks, no `core.hooksPath`, `.git/hooks` samples only.
`git -C <main> rev-parse claude/composite-r4` = **the same sha** — my base IS the product tip. ✅

---

# STEPS 1–3 — LANDED. TWO CARS. **THE CLI IS BACK ON.**

| sha | car |
|---|---|
| `f20d5dd48` | the schema **17 → 18** rung is minted — the first rung whose subject is the receipt's own provenance |
| `a05a4646e` | the schema-18 **genesis**: the governed migration executed, the register re-anchored, the `_doc` cured |

⭐ **THE HEADLINE, EXECUTED:**
```
git merge-base --is-ancestor f20d5dd48 HEAD            -> EXIT 0   (was 1 at b0cbc67a1)
node scripts/check-observed-shape-readers.mjs          -> EXIT 0   15 s
   "observed-shape readers: 1972 finding(s), exactly matching the frozen inventory."
```
rows minted **0** · rows cleared **0** · rung **18** · dock porcelain **0**.

## STEP 1 — THE RENAME CAR: ⛔ **REFUSED, WITH MEASUREMENT (R1)**
The brief's test was "is the rename a pure identifier swap with ZERO identity movement?" — and it
fails at the FIRST clause, so the second never arises. `ENGINE_GATED_VIRTUAL_RULE_KEYS` has **119
sites across 44 files** (scripts 6 · src 18 · tests 20), and **nine of them match the identifier as
TEXT rather than as a binding**, which makes a rename a semantic change to those consumers, not a
swap:

| site | what it does with the literal |
|---|---|
| `scripts/check-observed-shape-readers.mjs:1892,1893` | the GOVERNED DETECTOR's clause 3 — `indexOf`/`includes` of `'ENGINE_GATED_VIRTUAL_RULE_KEYS = Object.freeze(['` in `simulationRules.js`'s RAW TEXT |
| `scripts/check-observed-shape-readers.mjs:1902` | clause 4a slices the defaults window at `indexOf('ENGINE_GATED_VIRTUAL_RULE_KEYS')` |
| `tests/property/advanceEpochDormancyFence.test.js:380` | a REGEX ALLOWLIST over source lines; a rename silently reclassifies the manifest line as a "loose" read and reds the fence |
| `tests/domain/npc/characterDrift.test.js:946` | `expect(manifest).toContain('ENGINE_GATED_VIRTUAL_RULE_KEYS')` |
| `tests/lint/observedShapeReaders.walker.test.js:794` | an ordering assertion on `lit.indexOf('ENGINE_GATED_VIRTUAL_RULE_KEYS')` |
| `scripts/base-state-capsule.mjs:91` | the MEASURED figure's ADDRESS string — a stale address is a false capsule |
| `scripts/soak/flagConstraints.mjs:72,73,74` | three rationale strings citing the identifier |

⭐ **This is L-HOMES-2's own finding, re-derived and still standing** — its receipt says clause 3
"finds nothing (`indexOf` → −1, `includes` → false) and **throws for every `VIRTUAL_DORMANT_WRITERS`
row**", so the rename is red WITH the migration and red WITHOUT it. The rung does not help: clause 3
would have to be re-spelled in the same car, which is a change to the detector's LAW, not
bookkeeping — a different act from the one the chair chartered.
⛔ **And it is unprovable inside my fences.** Proving it green needs `tests/lint/`,
`tests/property/`, `tests/domain/`, `tests/soak-harness/` and `tests/scripts/` — the preamble
forbids a full run and my brief names specific files. A half-proved all-or-nothing rename is the
worst outcome the brief itself names.
⇒ **LEFT FOR THE CHAIR, as the brief's own instruction directs on a failed measurement.**

## STEP 2 — THE RUNG (`f20d5dd48`), part by part
- `LINEAGE_REANCHOR_TARGET_SCHEMA = 18` + its rung docblock
- `LEAF_MIGRATION_PREDECESSOR[18] = 17` (the chain stays SINGLE-STEP)
- `LEAF_PREDECESSOR_VALIDATOR[17] = validateSchema17Baseline`, re-bound to its RETIRED literal
- `SCANNER_TRANSITION_BY_TARGET[18]` with the MEASURED three-path `deltaPaths`
- `LINEAGE_REANCHOR_SCANNER_TRANSITION_POLICY = 'schema-17-to-18-exact-scanner-transition-v1'`
- `RETIRED_STRESS_TOPOLOGY_BASELINE_SCHEMA = 17`, `BASELINE_SCHEMA = 18`,
  `validateSchema18Baseline` minted, the checker's three bindings moved to it
- the CLI's default target and its allowed-target law; header rationale paragraphs
- the `_doc` source literal cured (it is emitted by the genesis write, not by this car)
- test pins: `observedShapeBaseline` (schema pin, a schema-17 fixture, the pairing arm),
  `observedShapeSentinel` (two schema pins, the live-validator pairing),
  `observedShapeMigration` (the predecessor message, both out-of-table probes 18 → 19, the
  target-constant pin, the exact `LEAF_MIGRATION_PREDECESSOR` table gaining `18: 17`)

### ⭐ THE DELTA SET IS A FIXED POINT — measured twice, never listed
Each of the ELEVEN governed detector inputs hashed against the **predecessor's own recorded
`manifests.detectorTree`**. ⭐ **Before the rung was written ALL ELEVEN were BYTE-IDENTICAL**, which
is a cleaner start than any recent rung had — so the delta is exactly what the rung then touches:
```
MOVED (3):     scripts/check-observed-shape-readers.mjs      165635 -> 166097 B
               scripts/lib/observed-shape-baseline.mjs        56632 ->  57831 B
               scripts/migrate-observed-shape-readers.mjs    120342 -> 130025 B
BYTE-SAME (8): package.json · package-lock.json · governed-artifact-io.mjs ·
               legacy-reader-shape-scan.mjs · observed-shape-corpus.mjs ·
               observed-shape-governance.mjs · reader-shape-scan.mjs · spatialPackFixtures.js
```
declared == measured == **3**. `package.json`/`package-lock.json` **measured** byte-same, not
asserted. THREE rather than rung 17's four: 17's SUBJECT was `observed-shape-corpus.mjs`, a detector
input outside the bookkeeping set; this rung's subject is not a file at all.

## STEP 3 — THE GENESIS (`a05a4646e`), EVERY MOVED FIELD BY NAME
```
node scripts/check-observed-shape-readers.mjs --write --migrate-schema=18 --migration-review=<bundle>
=> froze 1972 finding(s) / 1397 identit(ies) across 386 file(s)     EXIT 0   (10 s)
```
report: `predecessorSame` **1397** · Gone **0** · New **0** · Increased **0** · Decreased **0** ·
issues **exactly 1** (the scanner transition, naming three paths) · review **1398** decisions
(1397 + 1), all `accept` with notes.

| field | moved | why |
|---|---|---|
| `schema` | 17 → **18** | the rung |
| `frozenAtSha` | `0742f8ff5` → **`f20d5dd48`** | ⭐ the point of the lane |
| `migrationReview.subjectSha` | `0742f8ff5` → **`f20d5dd48`** | ⭐ in-lineage; every other receipt digest re-derived |
| `corpusMeta.simulationFlagsLit` | 80 → **81** | SEAT-78's `irregularForceEnabled`; the ONLY one of nine |
| `scanStats` | files 2162→**2176** · reads 124468→**125631** · resolved 9563→**9669** · unresolved 114905→**115962** | the tip is 25 cars past the predecessor's freeze |
| `sentinel.resolvedReads` | 9563 → **9669** | same |
| `manifests` | scanTree 2162→2176 · sourceTree 2176→2190 · executionTree 2187→2201 entries | same |
| `_doc` | 21 → **26** lines | the cure |
| `frozen` | 2026-09-05 → **2026-09-06** | UTC date rollover during the write |

| field | **UNMOVED**, and each is load-bearing |
|---|---|
| `digests.inventory` | `40856b9ba70142af…` **byte-identical** |
| `digests.rowTags` | `820c468615ac0421…` **byte-identical** |
| `total` / `identities` | **1972** / **1397** |
| `minRows` / `originMinRows` | 40 / 8 |
| `migrationReview.scanConfigDigest` | `cef0ab59…` — thresholds untouched |
| `migrationReview.legacyAlgorithmBaseSha` | `6e7acc4d…` — the byte-frozen detector |
| `scannerProvenance.unscannedInputDigest` | `158d2a7bb5d62f1c…` |

⭐ **THE ZERO IS PROVED STRUCTURALLY, NOT COUNTED.** The receipt's own
`targetInventoryDigest` **equals** its `predecessorInventoryDigest` (`40856b9b…`) — the target
inventory IS the predecessor inventory, bit for bit — and the row-by-row walk over all 386 files
returns **GONE 0 · NEW 0 · COUNT-MOVED 0**. A row moving in either direction would break the digest
equality, so this is not a count I could have miscounted.

⭐ **THE `_doc` CURE IS SURGICAL — MEASURED.** The **sixteen** lines outside the two cured regions
are **byte-identical**. Only the SCHEMA-10 paragraph (`[9]`–`[12]`, 4 lines → 9) and the final
predecessors line (`Schemas 4–9` → `Schemas 4–17`) changed. The new paragraph names schema 18,
records the **nine-declared / eight-banking** split, and states the provenance law.

⚠ **`reviewableUnscannedMovement: true` WAS CARRIED BUT NEVER EXERCISED** —
`unscannedInputDigest` is measured UNMOVED. Recorded so the chair does not read the permission as
evidence that something moved.

⚠ **ONE EXPECTED RED, CARRIED FOR EXACTLY ONE COMMIT.** With the register written but
**uncommitted**, the plain gate threw `observed-shape migration receipt has no committed schema-18
genesis descendant` — `validateBaselineHistory` walks `rev-list --ancestry-path <subject>..HEAD --
<baseline>` for a COMMITTED schema-18 baseline. `a05a4646e` IS that commit; the gate proof is taken
at that sha, never before it. This is the governed sequence, not a surprise.

## ⭐ PREDICTIONS FOR STEP 4, WRITTEN BEFORE VITEST RUNS (so they can convict me)
1. `observedShapeReaders.walker.test.js` → **GREEN**. Nothing it pins moved: bank 62/41 unmoved,
   banked roster 8 of 9 declared unmoved, inventory byte-identical, `source`-carrying shapes 14
   unmoved. Its only schema-coupled reads go through `registerFigures()`.
2. `writerReach.walker.test.js` → its **two banked arms turn GREEN** (81 == 81), because the OSR
   register now carries `simulationFlagsLit` 81. The rest of the file was green already.
3. `testRatchet.test.js` → **EXPECTED RED on "a banked row passed"**, and that red is the SIGNAL, not
   a defect: two `WALKER_ROWS_OWED` rows no longer fail. ⛔ Retiring them (remove-only `--update`,
   `OWED_CEILING` 5 → 3) is the CHAIR's register act at the landing — **I do not take it.**
4. `observedShapeBaseline` / `observedShapeMigration` / `observedShapeSentinel` → **GREEN**; their
   pins were moved with the rung.

---

# STEP 4 — THE TWO-WALKER PROOF. GREEN, AND ONE PREDICTION OF MINE WAS WRONG.

All runs through `sh scripts/gate-mutex.sh --run --` (EXCLUSIVE tier), exits captured in-shell.
The mutex reported `FREE` and `pgrep -fl vitest` was empty before each.

| run | files | result | exit |
|---|---|---|---|
| `observedShapeReaders.walker` + `writerReach.walker` + `observedShapeBaseline` + `observedShapeMigration` + `observedShapeSentinel` | 5 | **5 passed (5) · 218 passed (218)** · 39.74 s | **0** |
| `testRatchet.test.js` | 1 | **1 passed (1) · 94 passed (94)** · 9.36 s | **0** |
| `writerReach.walker.test.js` `--reporter=verbose` | 1 | **1 passed (1) · 56 passed (56)** | **0** |
| `readerShapeResolver` + `baseStateCapsule` + `exportDateSeam` (the SIBLING sweep) | 3 | **3 passed (3) · 123 passed (123)** · 16.17 s | **0** |

⭐ **THE SIBLING SWEEP WAS NOT IN THE BRIEF AND I ADDED IT.** A grep for every file importing
`observed-shape-baseline.mjs` / `check-observed-shape-readers.mjs` / `migrate-observed-shape-readers.mjs`
or reading `.observed-shape-readers-baseline.json` returned three suites outside the brief's list —
`tests/lint/readerShapeResolver.test.js`, `tests/scripts/baseStateCapsule.test.js` and
`tests/pdf/exportDateSeam.test.js`. A schema bump that silently reds a sibling importer is exactly
the shape this program keeps getting bitten by, so they were run. All green.

**TOTAL VITEST PROOF: 10 files, 491 tests, 0 failures, every exit captured in-shell.**

## ⭐ THE TWO BANKED ARMS, PROVED BY NAME RATHER THAN BY A FILE-LEVEL GREEN
```
✓ writer-with-no-reader ratchet: the frozen register > the frozen corpusMeta EQUALS the
  observed-shape register corpusMeta — one corpus, two walkers                        0ms
✓ writer-with-no-reader ratchet: the frozen register > the frozen shapesDigest EQUALS the
  in-process digest of corpus.shapes — two executions of one builder are one corpus by
  bit, not by count                                                                   4ms
```
⇒ **THE TWO WALKERS NOW READ THE SAME FIGURE: 81 == 81.** `scripts/.writer-reach-baseline.json`
carries `simulationFlagsLit: 81`; `scripts/.observed-shape-readers-baseline.json` now carries 81.
The one-flag disagreement recorded in the ratchet baseline is **CURED**.

## ⛔ CORRECTION 2 — MY OWN PREDICTION 3 WAS WRONG, AND THE CHAIR NEEDS THE MECHANISM
I predicted `testRatchet.test.js` would red on "a banked row passed". **It is GREEN, 94/94** — and
so is every other arm. **The reason is structural, and I measured it rather than rationalised it:**
`testRatchet.test.js` reads only `scripts/.test-ratchet-baseline.json` (`baseline.entries`). It
never re-runs the suite. Its arms check the LEDGER'S SHAPE — no stale entry, the two ledgers
disjoint, ceilings monotone-down, every entry carrying a real reason — **not whether a banked row
still fails**. Nothing in that file can notice a freed row.

⚠ **AND THE LIVE DETECTOR DOES NOT RED EITHER — it reports at OK.**
`scripts/check-test-ratchet.mjs:1661` (the `npm run test:ratchet` path, which does re-run the
suite and compare live failures to `entries`):
```
[test-ratchet] OK — no regressions, and N baselined test(s) no longer fail
(<live> < <ceiling>). RATCHET DOWN: run `npm run test:ratchet:update` to bank the win.
  ✔ <id>
```
⇒ **The chair's landing ratchet run will print exactly two `✔` lines and exit 0.** It will not
fail, and it will not retire the rows on its own. ⛔ **The retirement is the chair's register act
and I did not take it**: remove-only `--update`, `OWED_CEILING` 5 → 3, and both `WALKER_ROWS_OWED`
entries deleted with their comment paragraphs (`testRatchet.test.js:820–836, 929`;
`.test-ratchet-baseline.json:43, 60`). The brief names this the chair's, and it is.

## CENSUS — NOTHING OWED
```
git diff --name-status b0cbc67a1 HEAD  ->  7 files, ALL 'M'
ADD / DELETE / RENAME under src/ or tests/:  NONE
src/ files touched:                          NONE
```
No file was added, renamed or deleted, so the preamble's `tests/lint/` DIRECTORY RUN is **not
triggered**, no census row moves, no desk leaf and no `dossierMounts.js` conflict exists.

# STEP 5 — THE CAPSULE SHELL-OUT. IT RUNS AGAIN.
```
node scripts/base-state-capsule.mjs --runtime-tests=31970
=> [base-state-capsule] wrote docs/implementation/BASE_STATE.json stamped at a05a4646
   (20 figures).                                              EXIT 0   (42 s)
```
⭐ This is the third thing the re-anchoring restores: the capsule shells out to
`node scripts/check-observed-shape-readers.mjs`, whose default run validates history, so it has
been unrunnable on this lineage. `31970` is `scripts/.test-ratchet-baseline.json`'s own
`totalTests`, re-derived (the brief's figure was right).

⛔ **NOT COMMITTED, per the brief** — its `--runtime-tests` figure belongs to the NEXT landing's
ratchet. **THE DIFF IT WOULD HAVE MADE** (`20 insertions / 20 deletions`, saved at
`$SC/osrschema18/capsule.diff`):

| figure | stamped | would become |
|---|---|---|
| `stampedAt` / `stampedDate` | `b8946403` / **2026-08-16** | `a05a4646` / 2026-09-05 |
| `lightingCensus` | 2443/364/2079/20326/5697 | 2543/373/2170/23653/6333 |
| `runtimeTests` | 28359 | 31970 |
| `frozenKnownFailures` | 11 | 5 |
| `titleCensus` | 485 | 486 |
| `killList` | 85/69/167/163 | 84/59/166/160 |
| `osrFindings` | 1998 | **1972** |
| `strictDomainRatchet` | 1134/1134 | 1120/1120 |
| `flagManifestRows` | 22 | 35 |
| `routedTokens` / `kindPoolFloorsRegisteredKinds` / `…Registries` | 378 / 112 / 10 | 381 / 115 / 12 |
| `validatePackets` | 101 packets / 0 READY | 182 packets / 0 READY |
| `voiceMechanicsBankedArms` | 4 | 1 |
| 5 `hotFiles` rows | — | all move |

⚠ **A FINDING THE BRIEF DID NOT ANTICIPATE: the capsule is stamped 2026-08-16, not §900.** The
ruling said it "cannot regenerate at §900 and is DEFERRED to rung 18"; the artifact's own stamp
says it has not regenerated for about **twenty days**, so **every one of its 20 figures is stale
and its `consumptionLaw` makes it uncitable as executed** against any current base. The
re-anchoring removes the blocker; the regeneration is the chair's car after the landing's totals.

⭐ **RESTORED WITHOUT THE CHECKOUT FAMILY**, per the preamble: `git show HEAD:<path>` extracted to
an **out-of-tree** file, verified to parse (`stampedAt b8946403`, 20 figures, 1814 B), `cp`-ed
back, then `cmp` **byte-identical** and porcelain **0**. Never `git checkout --`, never a redirect
into the tree.

# STEP 6 — THE COST. NO MEASURABLE CHANGE, AND HERE IS WHY THAT IS THE HONEST ANSWER.

⚠ **A LIKE-FOR-LIKE "BEFORE" GATE TIMING DOES NOT EXIST**, and saying so is the correction: at
`b0cbc67a1` the plain gate exited **1 in 0 s** without scanning. The only comparable pair is
`--scan-only`, which reaches a real scan on both sides.

| | command | wall | load-1 |
|---|---|---|---|
| **BEFORE** (`b0cbc67a1`) | `--scan-only --scan-mode=legacy-leaf` | **15 s** | 2.34 |
| **AFTER** (`a05a4646e`) | the same | **16 s** | 3.31 |
| AFTER | plain gate, run 1 | **15 s** | 2.31 |
| AFTER | plain gate, run 2 | **16 s** | 4.31 |
| AFTER | plain gate, run 3 | **15 s** | 3.78 |

⇒ **≈ 0 s, inside the run-to-run spread**, which is what the mechanism predicts: this rung changes
no corpus and no detector logic, only a validator binding and bookkeeping. ⛔ **I am not claiming
"+0 % measured".** The spread WITHIN one configuration (15–16 s at loads 2.3–4.3) is as large as
any difference between configurations, so the honest statement is *no cost is detectable at this
resolution on a shared machine*, not *the cost is zero*. Rung 17's **+3 s / +20 %** corpus cost is
inherited unchanged and is still what the chair pays per scan.

---

# FINDINGS THE CHAIR OWNS

## F1 ⛔⛔ THE NINTH EXEMPTION'S RETIREMENT DID NOT LAND AT §900 — AND THIS RUNG WAS ITS LAST FREE WINDOW
`RULING-OSR-SCHEMA17-DECISIONS.md` §2 ruled: *"RETIRE IT at §900 as a chair roster car."*
**MEASURED at `b0cbc67a1` and unchanged at my tip:**
- `EXPLAINED_WRITER_EXEMPTIONS.length` = **9** (roster printed in full; `isCriminal on incomeSources` first)
- the register's `rowTags` = **41 addresses across 8 identities** — `isCriminal on incomeSources` banks **nothing**
- the gate itself says so: *"9 declared identit(ies) … banked and enforced 62 read(s) across **8 of them**"*

⇒ declared **9** ≠ banked **8**, so **the item is NOT done**. And the brief's other half is answered
too: the walker comments at `observedShapeReaders.walker.test.js:372` and `:1254` saying *"whose
roster is still nine"* are **ACCURATE, not stale** — the roster really is nine.

⛔⛔ **THE CONSEQUENCE THE CHAIR MUST SEE, and it is mechanical:**
`EXPLAINED_WRITER_EXEMPTIONS` lives in `scripts/check-observed-shape-readers.mjs`, which
`isDetectorSourcePath()` returns **true** for (executed, quoted). Now that schema 18 is frozen,
**any byte in that file moves `detectorTree` and the drift classifier refuses**:
> `observed-shape DETECTOR SOURCE changed since the schema-18 instrument was governed (…); an
> ordinary gate/write cannot migrate the instrument. Build and review the governed migration
> bundle instead.`
⇒ **the ruled retirement now costs RUNG 19.** It could have ridden this rung for free.

**WHY I DID NOT TAKE IT — the brief's own asymmetry, and I read it as deliberate.** For item (3)
(`_doc`) the brief says *"cure what is stale"*; for item (2) it says only *"MEASURE whether §900's
DESK-900-CARS car already landed it … if declared already equals banked, the item is DONE and you
say so."* The chair also showed it knows how to grant a ride-this-rung permission — it granted one
explicitly for the L-HOMES-2 rename — and withheld it here, on top of a ruling that calls the
retirement *"a chair roster car … a roster change is the chair's"*. ⚠ **And taking it would have
made my genesis undroppable**: the retirement must precede the genesis (it moves the detector), so
a chair who later disagreed could not drop one car without re-taking the register.

**THE EDIT LIST, READY FOR RUNG 19** (measured, so the chair need not re-derive it): the entry in
`check-observed-shape-readers.mjs:~1073`; the `isCriminal on incomeSources: { reads: 0, addresses: 0 }`
line and its comment paragraph in **both** per-identity maps (`observedShapeReaders.walker.test.js`
`:372`, `:1254`, both built from the roster); the two roster arrays and their comment paragraphs in
`observedShapeSentinel.test.js:~1032` and `:~1129`; and `:1626`'s roster lookup.

## F2 ⛔ THE PLAIN GATE WAS DARK, NOT JUST `--write` — BRIEF LINE 17 CORRECTED
See CORRECTION 1. The whole CLI (gate, `--report`, `--write`) returned 1 in 0 s on this lineage,
because `validateBaselineHistory` sits in the ordinary gate branch ahead of the scan. ⚠ **The
lesson worth banking: the vitest walker stayed GREEN the entire time**, because it imports the
modules and never drives the CLI. A green walker is not evidence that the instrument runs.

## F3 ⚠ THE CAPSULE IS TWENTY DAYS STALE, NOT §900-STALE
`BASE_STATE.json` is stamped `b8946403` / **2026-08-16**. All 20 figures move (F-table in STEP 5);
`osrFindings` alone is 1998 vs the live 1972. Its `consumptionLaw` makes it uncitable as executed
against any current base, so anything that has cited it since 08-16 cited a stale capsule.

## F4 ⚠ NOTHING REDS WHEN A BANKED RATCHET ROW STARTS PASSING
See CORRECTION 2. `testRatchet.test.js` is ledger-shape-only; `check-test-ratchet.mjs` reports
freed rows at **OK** with a `RATCHET DOWN` suggestion and exit 0. A freed row is therefore invisible
unless somebody reads the ratchet's stdout — which is exactly how a banked row outlives its blocker.
Not mine to cure; recorded because two rows are freed as of this lane.

## F5 ⭐ `predecessorInventoryDigest == targetInventoryDigest` IS A BETTER FENCE THAN A ROW COUNT
The receipt carries both, and for a verdict-only rung they must be equal. That single equality
proves "no row moved" for all 1,397 identities at once and cannot be miscounted. Worth writing into
the next verdict-only rung's brief as the primary check.

## F6 ⚠ `reviewableUnscannedMovement` WAS CARRIED AND NEVER EXERCISED
`unscannedInputDigest` is measured **UNMOVED** (`158d2a7b…`) across the write, despite the tip being
25 cars past the predecessor's freeze. The permission is carried because the class is lawful, as at
every rung since 8 → 9 — not because anything moved.

---

# ⭐ HOW THE CHAIR SHOULD LAND THIS — the subject sha must survive

⛔ **THE CHERRY-PICK HAZARD IS THE SAME ONE THAT CREATED THIS LANE.** `migrationReview.subjectSha`
is **`f20d5dd48`**, my rung car. A REPLAY gives that car a new sha, the receipt stops reconstructing,
and the register is dark again — this lane's exact starting condition.

**(a) THE PREFERRED PATH — FAST-FORWARD.** This dock is detached at the product tip
(`b0cbc67a1` == `claude/composite-r4`, verified on arrival and again at hand-off). If nothing lands
ahead of me, the chair fast-forwards `claude/composite-r4` to `a05a4646e` and **the subject sha
survives unchanged**. Two cars, no replay, nothing to re-execute.

**(b) IF ANYTHING LANDS FIRST — re-execute the subject step in the composing dock.** Do NOT
cherry-pick and patch: replay car 1 (`f20d5dd48`, source only, no register), then re-run the
genesis from scratch in that dock so the receipt binds ITS OWN new sha. Copy-paste, in order:
```sh
# 1. car 1 replayed; note its NEW sha as $SUBJECT, tree clean, porcelain 0
# 2. predecessor OUT of the tree
cp scripts/.observed-shape-readers-baseline.json /tmp/osr18/predecessor-schema17.json
# 3. legacy artifact AT $SUBJECT  (assertAuthoritativeSnapshot needs a clean committed tree)
node scripts/check-observed-shape-readers.mjs --scan-only --scan-mode=legacy-leaf \
     --json=/tmp/osr18/legacy-artifact.json
# 4. report + review template
node scripts/migrate-observed-shape-readers.mjs \
     --predecessor=/tmp/osr18/predecessor-schema17.json \
     --legacy=/tmp/osr18/legacy-artifact.json --target-schema=18 \
     --json=/tmp/osr18/report.json --review-template=/tmp/osr18/review-template.json
# 5. complete the ledger — every decision 'accept' with a >0-length note
O=/tmp/osr18 node $SC/osrschema18/complete-review.cjs
# 6. bundle
node scripts/migrate-observed-shape-readers.mjs \
     --predecessor=/tmp/osr18/predecessor-schema17.json \
     --legacy=/tmp/osr18/legacy-artifact.json --target-schema=18 \
     --review=/tmp/osr18/review-completed.json --bundle=/tmp/osr18/bundle.json
# 7. the genesis write, then COMMIT IT — the gate stays red until the commit exists
node scripts/check-observed-shape-readers.mjs --write --migrate-schema=18 \
     --migration-review=/tmp/osr18/bundle.json
git add scripts/.observed-shape-readers-baseline.json && git commit …
# 8. the proof
node scripts/check-observed-shape-readers.mjs          # MUST be exit 0
```
`complete-review.cjs` is reusable as written (it derives everything from the template and report).
⚠ Expect `predecessorSame` to be 1397 and all four movement figures 0 **in that dock too**; if any
is nonzero, something landed that moved rows and the rung must be re-examined, not re-frozen.

---

# WHAT I DID NOT DO
No ceiling raised. **No identity minted, deleted or re-pointed — 0 moved, proved by digest equality
AND row-by-row.** No exemption added or retired. No corpus byte, no CONFIG, no `generated` change,
no topology change. No `src/` file touched. No file added, renamed or deleted. No second register
act, no `--rebank`, no `--raise-explained-writer`, no ratchet `--update`, no `OWED_CEILING` move,
no hand-edit of `subjectSha` or any digest. The regenerated capsule was **not** committed. No
rebase, no push, no ref write, no `git stash`, no `git add -A`, no `--amend`, no `--no-verify`, no
`git checkout --`, no `git show <sha>:<path> > <path>`. No `npm install`, no `npm run build`, no
unfiltered `npx vitest run`, no `node_modules` touched (453 symlinks, unchanged).

---

# RETROVALIDATION ROW
⟦**OPUS-AUTHORED — Fable retrovalidation OWED**⟧ · lane OSR-SCHEMA18 · 2026-09-05 · Seat: Opus 5.

**WHAT WAS JUDGED (the chair must re-derive these five):**
1. **That a wrong premise on brief line 17 did not stop the lane.** The brief's own STOP condition
   is attached to the ANCESTRY premise (line 16), which HOLDS; line 17's error made the refusal
   broader, not narrower. A chair who reads step 0 as all-or-nothing should say so — but the act
   would still be the same act.
2. ⭐ **That the ninth exemption's retirement was LEFT, knowing this rung was its last free window
   (F1).** My reasons: the ruling calls it a chair act; the brief says *measure*, not *cure*, and
   says *cure* explicitly for `_doc`; the chair granted a ride-this-rung permission for the rename
   and withheld one here; and taking it would have made the genesis undroppable. **This is the
   single biggest call in the lane and the one most worth vetoing** — if the chair wants it, say so
   and it becomes rung 19 with the edit list above.
3. **That the L-HOMES-2 rename is REFUSED (R1).** It fails the brief's own zero-movement test at
   the first clause: nine sites consume the identifier as TEXT, three of them inside the governed
   detector's clauses 3/4a. A chair who reads the brief's permission as broader should note that
   proving the rename needs five test directories my fences forbid.
4. **That `LINEAGE_REANCHOR_*` is the right name and 18 the right rung.** No ruling named this rung;
   `LEAF_MIGRATION_PREDECESSOR` topped out at `17: 16`, so 18 was free.
5. **That the `_doc` cure rewrote the SCHEMA-10 paragraph rather than appending a schema-18 one.**
   The header describes what the schema IS, and eight rungs of stacked paragraphs would be worse
   than one current one. The retired numbers survive in the `Schemas 4–17` line.

**RE-DERIVE THESE FIGURES:** the three-path delta as a fixed point (and that all eleven were
byte-same BEFORE the rung); `predecessorSame 1397 / Gone 0 / New 0 / Increased 0 / Decreased 0`;
`digests.inventory` and `digests.rowTags` byte-identical across the write;
`targetInventoryDigest == predecessorInventoryDigest`; `simulationFlagsLit` 80 → 81 as the only
moved corpusMeta field; declared roster **9** vs banked **8**; and the gate at **exit 0**.

**RECEIPTS BY PATH** (all under `$SC/osrschema18/`):
`gate-plain-1.out` (the line-17 refutation) · `scan-pre.json` + `scan-pre.out` (the pre-state) ·
`delta.mjs` (the delta measurer, run twice) · `rung17.diff` + `rung17.stat` (the template) ·
`predecessor-schema17.json` · `legacy-artifact.json` + `legacy-scan.out` · `report.json` +
`report.out` · `review-template.json` · `complete-review.cjs` + `review-completed.json` ·
`bundle.json` + `bundle.out` · `baseline.PRE.json` · `write.out` · `diff-baseline.cjs` +
`register-diff.out` (every field by name) · `gate-rung.out` (the expected mid-rung red) ·
`gate-FINAL.out` + `gate-t2.out` + `gate-t3.out` (the gate at exit 0, three times) ·
`vitest-walkers.out` · `vitest-ratchet.out` · `vitest-writerreach.out` (the two arms by title) ·
`capsule.out` + `capsule.diff` + `BASE_STATE.HEAD.json` (the restore source) · `eslint-rung.out` ·
`scan-post.out`.

**PRIORITY: HIGH.** This is a schema rung plus a register genesis, and it unblocks three things at
once: the OSR CLI (gate + `--write`), the writer-reach walker's two banked ratchet rows, and
`base-state-capsule.mjs`. ⚠ **The chair's ratchet retirement (`OWED_CEILING` 5 → 3) is now OWED and
is not mine.** ⚠ **Land by FAST-FORWARD if at all possible** — see the landing section.

**CONFIRMED (executed, quoted):** every row of the premise table; the delta set measured twice; the
migration report's five reconciliation figures; the write's `froze 1972 / 1397 / 386`; every field
in the register diff; the `_doc` sixteen-line byte-identity; `merge-base --is-ancestor f20d5dd48
HEAD` exit 0; the plain gate at exit 0 three times; 218 + 94 + 56 vitest passes with the two banked
arms green BY TITLE; the capsule at exit 0 and its 20-figure diff; the restore proved by `cmp`;
eslint exit 0 on all six files; the final dock state.
**PLAUSIBLE (reasoning only):** that the chair's landing `npm run test:ratchet` will print exactly
two `✔` freed-row lines (the mechanism is read from source at `check-test-ratchet.mjs:1653–1667`,
but I did not run the full ratchet); that the cost is unchanged rather than merely undetectable at
this resolution; and that a fast-forward landing is available (it depends on what else lands).

**DOCK AT HAND-OFF:** `HEAD = a05a4646e4cd41942ebd530e044197932498730a`, porcelain **0**, detached,
**two cars** over `b0cbc67a1` (which is `claude/composite-r4`, re-verified at hand-off).
`node_modules` untouched — 453 symlinks. Not rebased; nothing pushed; no ref written.
