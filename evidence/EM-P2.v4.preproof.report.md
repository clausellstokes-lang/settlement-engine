# EM-P2 — OPUS PRE-PROOF REPORT at `ad7ddf2c9` (2026-09-19)

**Verdict: READY-able. Q-8 is ruled and applied; the packet raises ZERO validator errors of its own.**
The one remaining line is the known placement constraint — `duplicate change path across packets:
scripts/mutation-coverage-manifest.json (EM-B1d, EM-P2)` — which clears the moment EM-B1d lands.

**Deliverables** (all under `…/scratchpad/lane-preproof-EM-P2-scratch/`): `EM-P2.md` (version 4,
`DRAFT`, `__BASE__` with §0's executable revalidation checks), `EM-P2.manifest.json` (eight
`{id, case}` cases, zero open chair questions), `EM-P2.evidence.md` (appended, §E-29 … §E-40),
`EM-P2.preproof.report.md`.

**Tree discipline.** Read worktree at `ad7ddf2c9712a4f9e17a194e3ba2891bf23cc246`;
`git status --short` **empty at the start and at the end**. Nothing edited, staged or committed
anywhere; no vitest, no eslint, no npm script, no build.

---

## 0. THE CHAIR'S RULING, APPLIED — and one correction the chair needs

**Q-8 — `A3s` folded into `A3` as its static half.** Done. §9 now carries **eight** ids
(A1 … A8); A3's row holds **A3s** (static, lint) and **A3e** (executed, census) with A3s's arms
verbatim. No assertion dropped. The validator's `9 acceptance cases; maximum is 8` is gone.

### ⛔ THE TITLE DELTA IS `+10`, NOT `+12` — and the `+12` was mine

The chair's message carried forward this lane's `+12`. **It is wrong, and the error was mine**: I
derived it from the packet's own formula (`2 describe + N it`) without checking that the walker
counts that way. It does not.

```
measureCensus():
  titles      = credited.reduce((sum, { src }) => sum + liveTitlesIn(src).length, 0)      ← `it` titles ONLY
  suiteTitles = credited.reduce((sum, { src }) => sum + liveSuiteTitlesIn(src).length, 0) ← `describe` titles
```

Confirmed against a landing rather than reasoned: EM-B1e's file has **1 `describe` + 7 `it`**
(`grep -c`) and its measured delta was **`titles +7`, `suiteTitles +1`** — not `+8`.

**The arithmetic, per file, per `describe`, per straight-line literal `it`:**

| file | `describe` | straight-line literal `it` | cases |
|---|---:|---:|---|
| `tests/lint/generationForkRegistry.contract.test.js` | 1 | **3** | A2, A3s, A8s |
| `tests/generators/generationForkCensus.test.js` | 1 | **7** | A1, A3e, A4, A5, A6, A7, A8e |
| `tests/helpers/generationForkCensus.js` | 0 | 0 | not a `.test.js` — outside `TEST_FILES` |
| **DELTA** | **suiteTitles +2** | **titles +10** | **files +2 · credited +2 · parked +0** |

Carried into §7.2 as a **delta only**, with the absolute left for the chair to stamp. Version 3's
`5 it` for the census file is corrected to `7 it` — no assignment in §9 ever supported `5`.

### ⚠ THE TWO PRECEDENTS CITED FOR STEP 14b ARE REFUTED; THE RULE IS NOT

The chair wrote that *"EM-B1e's file landed parked for exactly that reason and EM-B1d's new `it`
counted nowhere because its host file uses vitest globals."* Measured at this tip:

```
$ grep -n "from 'vitest'" tests/domain/ruinInstitution.test.js
32:import { describe, it, expect } from 'vitest';
EM-B1e's own landing receipt: "one literal describe, seven straight-line it, CREDITED NOT PARKED"

$ grep -c "from 'vitest'" tests/generators/densityLaw.test.js                     → 1
$ grep -c "from 'vitest'" tests/lint/stepPresentationEngineFence.walker.test.js   → 1
$ grep -rL "from 'vitest'" $(find tests -name '*.test.js' -o -name '*.test.jsx') | wc -l  → 0
```

EM-B1e's file was **credited**, EM-B1d's hosts **do** import from `'vitest'`, and **none** of the
estate's 2,649 test files uses globals — the walker's own comment says the repository declares no
`globals: true`. **I adopted the rule anyway, because I verified it independently of the
precedents**: `parkReasonsFor` parks on `OPENER_UNRESOLVED:<word>` when an opener is not bound by
the file's own `'vitest'` import (three cases pinned in the walker's guard-the-guard) and on
`SUITE_NOT_STRAIGHT_LINE` otherwise, and `measureCensus` sums over **credited files only**. The
obligation is real; the two incidents are not. Recorded so the misattribution does not propagate
into the next lane's brief.

**And the packet genuinely needed it.** §6.3's code blocks show `vi.mock` and `await import` and
**never the opener import line**; the kit prototype is plain-node `.mjs` with **no test skeleton at
all** (there was nothing to check, which is the honest answer to that instruction). It is now
**§8 step 0**, both §7 CREATE notes, §7.2's `credited` row, and **STOP-13**, with the shape to copy
named: `tests/domain/ruinInstitution.test.js:32`.

⚠ **One consequence for §12.** The walker asserts `files` **first and short-circuits**, so
`parked`/`credited`/`titles`/`suiteTitles` are never evaluated while `files` is red — which it will
be. §12 now requires the receipt to report `files` as executed and the other four as derived, with
`grep -c` counts and the `from 'vitest'` line per new file as the crediting proof.

## 0b. THE OTHER FOUR ITEMS, AS FATED

- **Twin spelling** — packet keeps its own `instrumentedRoot`/`runHeadless` with a one-line comment
  naming the twin (`pipelinePinnedMode.test.js:107`, `:79`, unexported, no collision) and why
  (exporting them is a MODIFY of an EM-P0 file); consolidation slotted to **TOOL-4**. In §8 step 2.
- **EM-R0a §5.2b** — the exact sentence, for the chair's amendment: *"`generationCoherence.js:515`
  is `Object.freeze([...(context.generationRepairs || [])])` — a pure copy of an input that **never
  reaches the record**."* **The measured correction:** `generationRepairs` is indeed not a top-level
  record key (`hasOwnProperty` → `false`), **but the copy does reach the record**, at
  `record.generationCoherenceReceipt.repairs`, in **20 of 63** corpus rows — which is why both
  `generationRepairs` Tier-1 rows read `'varies'` (43 absent / 20 same). Suggested wording: *"a pure
  copy of an input that is never a top-level record key — it reaches the record only as
  `generationCoherenceReceipt.repairs`, in the rows that carry a repair."*
- **TOOL-1** — noted as composing immediately before promotion; the §7/JSON equality is printed in
  §7 of this report and in §E-33, and re-printed after every edit.
- **EM-B1h** — handed on; no action here.

## 0c. THE TWO REGISTERS — the paragraph the chair can lift

> *EM-P2's Tier 1 classifies `(step, key)` rows by **HOW a value comes to be**: whether the step drew
> for it (`drawn`), whether it moved without a draw (`label`), or whether it is a pure function of its
> inputs (`pure`) — and whether what was produced reaches the record at all (`absent · same ·
> transformed · varies`, measured twice: once for the key's FINAL value and once for what THAT step
> produced). EM-R0a classifies record **PATHS** by **WHAT THE EDITOR MAY DO WITH THEM**: `HELD ·
> WORLD · CONSTANT · READING · MIRROR · RECEIPT · HISTORY · AUTHORED`. The two vocabularies share no
> word and answer different questions, so they cannot contradict each other; they meet at exactly one
> field, EM-P2's `recordPath`, which is a POINTER INTO EM-R0a's domain and never a class of it. When
> the two are read together: **EM-R0a governs what may be done to a path; EM-P2 governs how the value
> at that path got there.** A consumer that needs provenance reads EM-P2; a consumer that needs
> permission reads EM-R0a; neither is evidence for the other's question.*

**Every key a reader could think they disagree on — the complete set is EIGHTEEN**, the Tier-1
context keys whose NAME is also a top-level record key. The full table with each row's verdict is
§6.9 of the packet. The authority split, stated per group:

| group | keys | who answers what |
|---|---|---|
| EM-R0a **HELD** | `institutions` `npcs` `factions` `relationships` `conflicts` `powerStructure` | **EM-R0a**: may the editor touch it. **EM-P2**: which of its several writers' output survives. `institutions` has six Tier-1 rows because six WRITERS, not six verdicts |
| EM-R0a **READING** | `stress` `economicState` `isolationSupport` `tier` `population` `culturalIdentity` `history` `availableServices` `economicViability` `resourceAnalysis` `settlementReason` `spatialLayout` | **EM-R0a**: derived, not editable. **EM-P2**: whether entropy was consumed. ⛔ `drawn` never makes a READING path editable, and `pure` never makes a HELD path uneditable (design §14 as amended by §21.5.3) |
| the sharpest trap | `powerStructure` (HELD + `pure` ×4), `tier` (READING + `pure`) | `pure` is an entropy fact; the power structure consumes zero draws and all five of its Tier-2 rows stay editable. `tier` is `pure` over the corpus and **DRAWN** under a wizard-reachable config (§6.4) |

The other **33** Tier-1 context keys share a name with nothing in EM-R0a — they are pipeline-internal
and land, where they land at all, under `record.config.*` or inside the receipt. **No key in the
estate is classed by both registers in the same vocabulary, so no reader ever has to break a tie.**

---

## 1. THE 75 ROWS, RE-RUN — **ZERO MOVED** (CONFIRMED)

The charter's own obligation, discharged. `EMP2_TREE=<tip> EMP2_OBJECTS_ONLY=1 node p6-onrecord-counts.mjs`:

```
ROWS=63 wall=23896 ms per-row=379.3 ms
label tally (final-context):    {"absent":19,"same":35,"transformed":15,"varies":6}
producedOnRecordClass tally:    {"absent":27,"same":18,"transformed":15,"varies":15}
class tally: {"drawn":28,"pure":46,"label":1}   (steps that draw = 13)
varies rows = 6 of 75; rows whose non-absent recordPath is NOT unanimous = 1
rows whose LABEL differs between the two comparands = 18 of 75
rows with ANY differing landing path (both non-null) = 0 of 75  => producedPath NOT NEEDED
Tier 1 rows = 75  Tier 2 rows = 10   raw 117 / EFFECTIVE 106   longest line 384
```

Every headline reproduces. **The decisive test is stronger than the tallies:**

```
diff <kit>/generationForkRegistry.SPEC.js  <mine>/generationForkRegistry.SPEC.js   → IDENTICAL
sha256 both sides: e555de980cce0faefe5dc47ad322c117e9e40f73d4d99b8e5182ea469aab3c4c
structural diff of the two p6 dumps, every field of every row:  TOTAL ROWS MOVED = 0 of 75
stepDrew identical: true
```

A byte-identical emission alone could hide a compensating pair; the structural diff compares `via`,
`keyMoves`, `run`, both `{absent,same,transformed}` triples and each row's full observed-path histogram, and
reports zero. **EM-P3, EM-B3a and EM-B1e moved no row this register reads.** The three rare tail rows landed
dead-on again (`tradeRoute` 5/63, `terrainType` 3/63, `resolvedTerrain` 3/63). Wall-clock 23,896 ms is the
fastest of four observations; the packet's "budget against ~31 s, not the best run" stands.

## 2. THE INSTRUMENT'S OWN CONTROL — green, **with its negative control** (CONFIRMED)

The chair's question was whether the mocked surface still matches the real modules at this tip. Executed, not read:

| control | required | measured |
|---|---|---|
| export parity `prng.js` | shim keys **EQUAL** actual | `[SEED_ENTROPY_LEN,SEED_SEQUENCE_LEN,SEED_SUFFIX_LEN,createPRNG,epochSuffix,generateSeed]` both sides |
| export parity `proseHash.js` | EQUAL | `[fnv1a32,pickVariant]` both sides |
| golden hash, named row | `b77b5909…c3ce` | identical |
| stride sweep | ≥ 25 rows, 0 moved | 25 checked, 0 moved |
| `generatePopulation` unpinned | 315 / 315 / 0 | 315 / 315 / 0 |
| `generatePopulation` fully pinned | 0, record reproduced | 0, `true` |
| total mints | 35–36 | **35** |
| `direct` | exactly 4 | 4 |
| `via fork` | ≥ 31 and `= 22 + subForks` | 31 = 22 + 9 |
| repeated-seed vias | `[fork\|direct\|direct\|direct]` | identical |
| foreign-prefix seeds | 0 | 0 |
| `pickVariant` | 96, pools > 1, 96 distinct | 96 / 96 / 96 |
| `fnv1a32` external | 6 | 6 |

**`prng.js:84` is byte-for-byte the line the re-implementation rests on** (STOP-4 clear), and both mocked
modules are **untouched in the J-T1 window**, so the re-implemented `fork` still rests on what it was written
against.

**The negative control fires exactly as specified:** `EMP2_REIMPL_FORK=0` prints `total mints = 4 (direct=4,
via fork=0)` — STOP-5's signature. One discriminator sharper than §6.3a states, now recorded: under the
specified instrument the repeated seed is minted **×4 with vias `[fork|direct|direct|direct]`**; under the
naive wrapper **×3, `[direct|direct|direct]`**. The vias list alone convicts a mock that did not take.

The table above **is** what the build lane's first arm must print.

## 3. THE TWO REGISTERS — measured, and they cannot contradict (CONFIRMED)

Written into the packet as new **§6.9**, with the join in `out/register-join.json`.

**Different domains, disjoint vocabularies.** EM-R0a classes **record PATHS** by meaning
(`HELD·WORLD·CONSTANT·READING·MIRROR·RECEIPT·HISTORY·AUTHORED`). EM-P2 classes **`(step, key)` pairs** where
`key` is a pipeline **context** key, by entropy (`drawn·label·pure`) and record-reach
(`absent·same·transformed·varies`, twice). **No word appears in both sets**, so "the same key called *held* by
one and *reading* by the other" is not expressible.

**The overlap is exactly one field: EM-P2's `recordPath`.** Measured over the 75 rows:

```
distinct non-null recordPaths = 31, reaching 20 of the record's 41 top-level keys
  WORLD 20 (ten distinct record.config.* sub-paths) · HELD 16 · READING 17 · HISTORY 2
  · whole-record 1 · no landing 19
MEASURED top-level keys of a generated record = 41   (EM-R0a TABLE 1 declares 41 — independently CONFIRMED)
```

**Authority, stated so no consumer has to choose:** EM-R0a is authority on *what a record path is*; EM-P2 is
authority on *what a step did*; `recordPath` is a **pointer into EM-R0a's domain, never a class of it**.

Two facts only the join produces (both now in §6.9): **21 of the 41 top-level keys are reached by no Tier-1
`recordPath`** — but that is the ladder's granularity, not a claim about writers, since
`assembleSettlement|settlement` lands at `record` and subsumes them all, `name` (HELD) included. And **EM-P2
is finer than EM-R0a under `config`** (ten sub-paths vs one WORLD key) and coarser nowhere.

⚠ **One wording hazard, put to the chair, not adjudicated.** EM-R0a §5.2b calls `repairs` *"a pure copy of an
input that never reaches the record"*. Measured: `generationRepairs` is **not** a top-level record key
(`hasOwnProperty` → `false`, so both registers agree), **but the copy does reach the record** at
`record.generationCoherenceReceipt.repairs` in **20 of 63** rows — which is why both `generationRepairs` rows
read `'varies'` (43/20). Compatible on the narrow reading, contradictory on the broad one. EM-R0a's sentence
to sharpen; EM-P2 asserts nothing about it.

## 4. ⛔ THE SHARPEST FIND — the mutation-coverage row is **TWO** rows (CONFIRMED)

Version 3 named **one** REGISTER row, for the `tests/lint/` file. Executed:

```
ENFORCER_DIRS = ['tests/lint','tests/design','tests/docs','tests/data',
                 'tests/copy','tests/security','tests/edgeFunctions','tests/generators']
enumerateInvariants() at ad7ddf2c9 = 705    manifest.invariants keys = 705    missing today = 0
  OWES A ROW  tests/lint/generationForkRegistry.contract.test.js
  OWES A ROW  tests/generators/generationForkCensus.test.js
  no row      tests/helpers/generationForkCensus.js   (not a .test.js)
=> 705 -> 707
```

`tests/generators` **is** an enforcer directory, and both basenames independently match `NAME_PATTERN`
(`contract`, `census`). `mutationCoverageManifest.test.js`'s TOTALITY arm demands a row for each.
**Version 3 would have RED at the landing, after the 24-second census had already run.** Corrected in §7,
§7.2, §8 step 8 and the manifest: **+2, 705 → 707**.

Two riders now written in, both read from that same test file: `uncoveredBaseline` is a **number** (186)
asserted EXACTLY and only shrinking, so neither row may be `kind:'uncovered'` (both are `rationale`, as §7
already said); and a `tests/generators/` row citing `ADMITTED_TREE_REF` is re-derived — the file must
import-or-scan something under `src/` **and** assert, with `import x from '../helpers/fixture.js'` pinned as
an explicit refusal, so the census file must import the new `src/` leaf **directly**.

**The anchor, chosen against the in-flight landings.** `invariants` is **not sorted** and no test enforces an
order, so the insert anchors on key NAMES. EM-B1d v5 inserts between indices 1–2
(`dossierMountRegistry` / `stepPresentationEngineFence`); EM-B3c v2 anchors on
`tests/security/galleryScannerMirrorTotality.test.js`; EM-B1h's manifest does not spell its anchor.
**EM-P2 anchors between `tests/lint/guidanceOrigin.walker.test.js` and
`tests/domain/bespokeStyleWallContract.test.js` (indices 5–6)** — disjoint from all three, so no ordering of
those landings breaks the insert.

## 5. THREE MANIFEST DEFECTS FIXED (executed, red-first)

Run against the tree's own validator (TOOL-1's `52be5a1f2`, which adds the §7/JSON arm) over a
scratch root holding the packet, the mutation manifest, `docs/implementation/` whole and the 745
files the live manifest's rows reference.

**FIXED — `acceptanceCases` were bare strings.** Red-first: nine
`EM-P2.acceptanceCases[i] must be an object`. All 189 packets in the live manifest use
`{id, case}` objects. Converted; not one word of any case text changed.

**FIXED — the REGISTER symbol named a subscript of a scalar.**
`uncoveredBaseline['tests/lint/…']`, but `uncoveredBaseline` is the **number 186**. The container is
`invariants` (705 rows).

**FIXED — the ninth acceptance case (Q-8), on the chair's ruling.** `A3s` folded into `A3` as its
static half; eight cases; no assertion dropped; the three disagreeing title figures collapsed to one
derivable `+10`. §0 above carries the arithmetic and the correction to the formula.

**Final state:** the validator raises **no error naming EM-P2** other than the cross-packet
reservation in §6 below, and with EM-B1d flipped LANDED it raises none at all.

## 6. PLACEMENT — EM-P2 cannot be placed until EM-B1d lands (CONFIRMED)

```
EM-P2 (DRAFT) + EM-B1d (READY, as it stands):
  duplicate change path across packets: scripts/mutation-coverage-manifest.json (EM-B1d, EM-P2)
EM-P2 (DRAFT) + EM-B1d flipped LANDED:
  (gone; EM-P2's only remaining error is the 9-case budget)
```

The validator reserves a change path at **every non-terminal status** (`reservesChangePaths`). EM-B1d is
READY and REGISTERs the same file. The chair's expectation is confirmed by execution.

⛔ **And `__BASE__` must be the THEN-TIP, not `ad7ddf2c9`.** A REGISTER row is **substrate**, not a CREATE, so
`implementation-session.mjs` diffs it between the verified base and HEAD: a base older than the last landing
that touched `scripts/mutation-coverage-manifest.json` throws `verified-base descendant changed declared
substrate`. EM-B1d v5 records the same hazard. §0 carries the revalidation sentence as executable checks.

## 7. J-T1 WINDOW, requiredSymbols, and the post-edit simulation (CONFIRMED)

```
git diff --stat a41a0e109 ad7ddf2c9 -- <all 5 change paths and all 19 requiredSymbols paths>
(empty)
```

**Not one path moved.** `src/generators/steps/resolveConfig.js`, which EM-P3 *did* move, is named by no row of
this packet — version 3's claim, re-confirmed. All **19** requiredSymbols present verbatim, every declared
declaration line still correct. All four CREATE targets absent.

**`retiredSymbols`: NONE, and pre-proof step 10's simulation has an empty subject set.** The packet modifies
**zero** existing files (four CREATEs + one REGISTER of a JSON data file), so building it cannot move, rename
or delete any symbol at any path this or another packet requires, and it re-spells none of its own required
symbols.

**§7 table ↔ JSON `changeManifest`: IDENTICAL as (action, path) sets.** TOOL-1's `changeTableAgreement` finds
exactly one change-manifest table by column signature and reports `rowProblems`, `onlyInTable`,
`onlyInManifest`, `actionConflicts` all empty; 5 paths = 5 paths; actions `CREATE ×4`, `REGISTER ×1`, all in
`PACKET_ACTIONS`. A column-count audit of every table in the packet (escaped-pipe aware) reports **0
mismatches — the same figure unedited version 3 produces**, so the pre-proof's edits broke no table.
⚠ **TOOL-1 is on the tooling branch and is NOT in `ad7ddf2c9`'s validator**; the arm was run from the
extracted blob.

## 8. BUDGETS AND BUNDLE PRICING — **+0 bytes, proved, not asserted** (CONFIRMED)

```
ls src/domain/generation                → No such file or directory
git ls-files 'src/domain/generation*'   → two SIBLING files, no directory
git grep -nE "from ['\"][^'\"]*domain/generation/" -- src tests scripts supabase vite.config.js  → 0 hits
git grep -n 'domain/generation/'   (6,759 tracked paths)  → ONE hit: the EM-P2 charter line in docs/
```

| closure | value at this tip | this packet |
|---|---|---|
| generation worker | `WORKER_BUNDLE_CEILING_BYTES = 1401208` (EXACT, zero slack) | **+0 B** |
| first-paint static closure | `1_048_000` (gzip 337_000, brotli 283_000) | **+0 B** |
| data-lazy | `3_098_110` (gzip 771_897) | **+0 B** |
| eager first paint | `EAGER_FIRST_PAINT_MODULES`, static edges only | not entered |
| edge-shared (5 metas: 114/74/115/2/2 inputs) | none lists a `src/domain/generation` path | **not owed** |

`npm run build:edge-shared` → `scripts/build-edge-shared.mjs` writes **exactly ten paths** (five bundles +
five metas) and nothing under `src/`, `tests/` or `scripts/`. **EM-PREAMBLE §P2 rows 10 and 12 are NOT owed**
— the law that cost EM-B1d a build STOP, answered here by measurement. The worker's entry is
`generation.worker.js → generationRequest.js → generateSettlementPipeline.js / steps/stepMetadata.js`; the
leaf is not on it and must not be put on it (a standing sweep plant fences `generationRequest.js` against
namespace and backtick specifiers anyway).

Scope budget unchanged and re-measured: **4 handwritten files · 106 effective lines · 1 new leaf (≤250) · 0
existing logic files modified · 0 hot files** — and **9 acceptance cases against a limit of 8** (Q-8).

## 9. STALE ABSOLUTES REFRESHED (the chair's R11 rule)

| figure | version 3 | at `ad7ddf2c9` |
|---|---|---|
| preamble SHA-256 | `1cf54427…` at `816fc95e9` | **`b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1`** (§P2 gained row 12 today at `e68d913e6`; twelve rows verified) |
| `WORKER_BUNDLE_CEILING_BYTES` | `1401128` | **`1401208`** (EM-P3's build, +80 B, attributed) |
| lighting census `files` | "2,646 → 2,648" | **the baseline (2,646) is already 3 behind the live estate (2,649)** |

**The lighting rows are now DELTAS and nothing else**, per the brief's named contradiction — `EM-PREAMBLE`
§P2 row 1 governs, and a member never edits the census baseline. The +3 is **EM-B1e's and EM-B3a's**
(`ruinInstitution.test.js`, `editTravel.test.js`, `decreeRegistryPersistence.test.js`), landed between the
baseline sha `baf8ccc1d` and this tip. Version 3's VF-15 was **true at `a41a0e109`** and is stale here; it is
rewritten, and `TEST_FILES` was re-found **by symbol**, not by inherited line number.

## 10. REGISTERS THAT CAN SEE A NEW `src/domain/**` LEAF — each measured

Pre-proof step 13 is discharged with a stronger result than it asked for: **the packet modifies no `src/` file
at all**, so it cannot sit above a line-addressed baseline row in a file it edits. The whole exposure is the
new leaf's membership in three corpora, and all three were measured.

- **prose-numerics** — its corpus is `src/` **whole**, so the leaf **is** scanned; "wave 1 renders nothing" is
  about surfaces, not about a source scanner. `scanProseNumericsSource` over the emitted leaf: **0 hits, no
  parse error**, with the scanner proven **live in the same process** (2 hits on
  `src/components/InstitutionalGrid.jsx`, exactly its 2 banked rows). **No move.** ⚠ Calibration: a snippet
  copied from a real banked row and planted into the leaf *also* returned 0, so the categories are
  context-sensitive in a way this lane did not chase — the packet asserts only "this leaf adds no row", which
  is what was measured, not "nothing here could ever trip it".
- **`.tuning-inventory.json`** — declares `{p1:['src'], p2p3:['src/domain','src/generators']}`, so the leaf
  **is** walked. `discoverTables(leaf)` → `{tables:[],unclosed:[]}`; the leaf declares no `*_TUNING` binding.
  **No move.** ⭐ Worth the chair's eye: a frozen literal of 75 numeric rows in `src/domain/` is the *shape*
  this register governs and escapes only on a naming convention.
- **`.wizard-news-authoring-baseline.json`** — walks `src/domain` + `src/store`, so the leaf is walked; its
  subject is news-authoring sites. **PLAUSIBLE no-move; not executed.**
- `pulseKernelLineAddress.walker.test.js` (scans `src`+`tests`, bans one literal) passes trivially;
  `.ledger-citation-baseline.json`, `.tuning-register.json`, `scripts/hazard-registry.json` and
  `soakRulesBaseline.json` carry line addresses in prose only or are docs-scoped.

## 11. NOTICED, NOT TOUCHED — each specific enough for the chair to slot this turn

1. **`instrumentedRoot` / `runHeadless` are about to have two spellings.** Both already exist as
   **module-local, unexported** functions in `tests/generators/pipelinePinnedMode.test.js` (`:79`, `:107`; that
   file has no exports at all). No resolution collision — but the existing `instrumentedRoot` already records
   `forkLabels`, `draws`, `innerForks`, `streams`, the very observations the new helper needs. One spelling is
   available cheaply: export from `tests/helpers/generationForkCensus.js` and have `pipelinePinnedMode.test.js`
   import it. **That is a MODIFY of a file EM-P0 landed, so it is not this packet's.** Slot it as a follow-on or
   rule it deliberate duplication.
2. **EM-R0a §5.2b's sentence** *"a pure copy of an input that never reaches the record"* invites the broad
   misreading EM-P2 measures against (20/63 landings at `record.generationCoherenceReceipt.repairs`). One
   clause in EM-R0a fixes it; EM-P2 must not be the place it is fixed.
3. **TOOL-1 (`52be5a1f2`) is not in the build branch.** The §7/JSON arm this pre-proof used — and that the
   chair's brief treats as live — exists only on the tooling branch. Until it merges,
   `validate:packets` at `ad7ddf2c9` does **not** compare a packet's table with its JSON.
4. **`EM-B1h`'s mutation-coverage REGISTER row does not spell its anchor** (its manifest carries the row with
   no anchoring note). EM-B1d v5 and EM-B3c v2 both do. One line in EM-B1h's manifest closes the gap before
   three packets contend for the same unsorted object.
5. **The lighting baseline is 3 behind at the tip** and two more EM packets are in flight. The terminal
   refreeze is already load-bearing; the chair may want the running delta recorded somewhere before the
   arithmetic is reconstructed from four packets' §7.2 tables.

## 12. QUESTIONS ONLY THE CHAIR CAN ANSWER

**NONE OPEN.** Q-1 … Q-8 are all ruled and carried; `openChairQuestions` is empty in the manifest.

Two items are recorded for the chair's attention but block nothing:

1. **The `+12` I reported earlier was wrong; the figure is `+10`** — I derived it from the packet's
   own broken formula instead of the walker's. Corrected everywhere, with the derivation printed.
2. **The two precedents cited for step 14b are refuted by measurement** (EM-B1e's file was
   *credited, not parked*; no test file in the estate uses vitest globals). The rule itself is
   correct, was verified independently, and is adopted — but the misattribution should not travel
   into the next lane's brief.

Everything else that outlives this pre-proof is an **execution**, not a decision: A1's instrument
control at the build lane's first run, and — if anything lands before the slot opens — one more
75-row re-classification at the then-tip, which costs ~24 s and has a byte-comparable expected
output (`e555de980cce0faefe5dc47ad322c117e9e40f73d4d99b8e5182ea469aab3c4c`).
