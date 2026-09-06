# RECEIPT — LANE OSR-SCHEMA18 — ⚠ **PARTIAL: PREMISES MEASURED, ACT IN FLIGHT**
⟦Seat: Opus 5 — Fable-unvalidated · Lane: OSR-SCHEMA18 · 2026-09-05 evening⟧

## OUTCOME TABLE
| # | premise (brief line) | measured at `b0cbc67a1` | verdict | sha |
|---|---|---|---|---|
| P1 | register `schema` 17, `subjectSha` `0742f8ff5…`, `simulationFlagsLit` 80 (L15) | schema **17**, subjectSha **`0742f8ff5997bb5ddb369c152cb31d587dde7121`**, flagsLit **80** | ✅ CONFIRMED | — |
| P2 | `merge-base --is-ancestor 0742f8ff5 HEAD` is FALSE (L16) | exit **1** = NOT an ancestor (object exists, exit 0) | ✅ CONFIRMED — the lane lives | — |
| P3a | plain gate → **exit 0** (L17) | **exit 1 in 0 s**, throws `observed-shape migration genesis is not a committed ancestor of current HEAD` before scanning | ⛔ **BRIEF LINE 17 IS WRONG** — see CORRECTION 1 | — |
| P3b | `--write` → REFUSED (L17) | refused by the same throw | ✅ CONFIRMED | — |
| P4 | writerReach's two arms banked; `OWED_CEILING` 5 (L18) | both rows present in `scripts/.test-ratchet-baseline.json:43,60`; `testRatchet.test.js:929` `OWED_CEILING = 5` | ✅ CONFIRMED | — |
| P5 | ninth exemption retired at §900? (L19 item 2) | **declared roster 9**, register banks **41 addresses across 8 identities**; `isCriminal on incomeSources` banks nothing | ⛔ **NOT DONE** — see FINDING F1 | — |
| P6 | walker comments `:372`/`:1254` say "roster is still nine" — stale or true? (L19) | roster **is** nine ⇒ the comments are **ACCURATE**, not stale | ✅ comments correct; F1 is the live item | — |
| P7 | `_doc` stale (L19 item 3) | `_doc[9]` "SCHEMA 10 … eight-identity M8/M9 bank"; `_doc[20]` "Schemas 4–9 are the RETIRED numeric predecessors" | ✅ CONFIRMED stale — cured in the genesis write | — |
| P8 | L-HOMES-2 rename: pure identifier swap, zero identity movement? (L20) | **NO — three consumers match the identifier as TEXT, not as a binding** | ⛔ **REFUSED with measurement** — see REFUSAL R1 | — |
| P9 | `simulationFlagsLit` moves 80 → 81 (L26) | live corpus meta **81**; the **only** one of nine fields that moves | ✅ CONFIRMED | — |
| P10 | ratchet `totalTests` = 31970 for the capsule (L28) | `scripts/.test-ratchet-baseline.json` `totalTests` **31970** | ✅ CONFIRMED | — |

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
