# RECEIPT — INSTR-912 REBASE: the nine code cars carried onto the product tip `f3ab08f51`

Seat: Opus 5 — Fable-unvalidated · Lane: INSTR-912 (rebase) · dock `$SC/laneINSTR2`.
A claim without its executed tail is not a claim. Every fenced block below is command output
I saw, pasted verbatim.

## 0. ARRIVAL — the three conditions, executed

```
$ date
Tue Sep  8 01:54:06 EDT 2026
$ V=vit; V2=est; pgrep -fl "$V$V2" | wc -l
       0
$ ls $SC/HOLD-VITEST
ls: .../scratchpad/HOLD-VITEST: No such file or directory
$ git -C $SC/laneINSTR2 rev-parse HEAD
f3ab08f5194201d19f99f8905068783b62fbfaf8
$ git -C $SC/laneINSTR2 status --porcelain | wc -l
       0
$ git -C $SC/laneINSTR2 status -sb | head -3
## HEAD (no branch)
```
Target dock detached at the PRODUCT TIP, porcelain 0, zero runners, no hold file.
SOURCE dock `$SC/laneINSTR` @ `ee403e8ab` — read-only for the whole of this lane.

## 1. THE NINE CODE CARS, CARRIED IN ORDER (`git cherry-pick -x`)

The four register commits (`74a1aa0e8` 7b · `27c24522c` 8b · `454d478a1` 9b · `ee403e8ab` 10b)
were SKIPPED; the census is regenerated once at the end (§3).

| # | car | source sha | new sha | conflicts |
|---|-----|-----------|---------|-----------|
| 1 | car 1 — same-entry contradiction walker | `950c0c204` | `4db3ac57b` | none (7 files, 2671 +) |
| 2 | car 2 — B-GRAMMAR walker | `d63f80207` | `05b3adc2b` | none (5 files, 1944 +) |
| 3 | car 3 — register loaders | `eb2c330dd` | `78b254938` | none (2 files, 487 +) |
| 4 | car 4 — institution table | `37833b22e` | `07121b077` | none (2 files, 482 +) |
| 5 | cars 5+6 — presence measure, D8 ledger | `9d257ca7d` | `d4b34fda9` | none (4 files, 554 +) |
| 6 | car 7 — the six ratchet debts cured | `e3e56f94a` | `fc5a198aa` | **manifest + sweep** |
| 7 | car 8 — the wiring census | `0b05e3a7a` | `6df521a36` | **manifest** (sweep auto-merged) |
| 8 | car 9 — the first fold's eighteen cures | `8c53ddef1` | `ff26fd078` | **manifest** (sweep auto-merged) |
| 9 | car 10 — the second fold's cures | `c199f0189` | `e45adbbb5` | **manifest** (sweep auto-merged) |

Cars 1–6 applied clean, additions only, exactly as the brief predicted. `git status --porcelain`
read **0** after every one of the nine. Car 7's message was diffed against the source's and is
byte-identical but for the `-x` provenance line:

```
$ diff <(git -C $SC/laneINSTR log -1 --format='%B' e3e56f94a) \
       <(git log -1 --format='%B' HEAD | sed '/^(cherry picked from commit /d')
MESSAGE IDENTICAL except the -x line
```

## 2. THE THREE CONFLICT FILES, RESOLVED BY TEXT

### H1 — `scripts/mutation-coverage-manifest.json`

The base file at `f3ab08f51` is byte-exactly `json.dumps(d, indent=2, ensure_ascii=False) + "\n"`
(measured: a re-dump reproduces all 374,257 bytes), so a 2-space text splice at the end of a
section is provably formatting-neutral. On each of the four conflicts the base side was restored
whole (`git show <base>:… > …`, `cmp` byte-identical on the first) and that car's entries were
spliced in **by text** at the end of their section by
`$SC/rebase-tools/splice_manifest.py` — the pre-existing bytes are never re-emitted.

Per car: car 7 → 5 `invariants` (20 lines) · car 8 → 1 `invariants` (5 lines) ·
car 9 → 3 `meta` (15 lines) · car 10 → 2 `meta` (10 lines).

**ARM (executed):**
```
$ python3  # base f3ab08f51 vs merged HEAD, by KEYS
invariants: 662 -> 668   added +6   removed 0   changed 0
    + tests/lint/institutionTable.walker.test.js
    + tests/lint/proseEntryContradiction.walker.test.js
    + tests/lint/proseMeasures.walker.test.js
    + tests/lint/proseMoveGrammar.walker.test.js
    + tests/lint/proseRegisterLoaders.walker.test.js
    + tests/lint/proseWiringCensus.walker.test.js
meta: 12 -> 17   added +5   removed 0   changed 0
    + meta:institution-table-closed-implies-sources-read
    + meta:institution-table-declared-source-actually-read
    + meta:institution-table-ruin-filter-through-columns
    + meta:prose-wiring-census-resolved-is-not-recovered
    + meta:institution-table-third-source-actually-read

other top-level key '_doc': byte-equal True
other top-level key 'uncoveredBaseline': byte-equal True
other top-level key 'rationales': byte-equal True
base key ORDER preserved in invariants: True
base key ORDER preserved in meta      : True
INSTR's 11 entries byte-equal to laneINSTR@ee403e8ab: True []

$ git diff --numstat f3ab08f51..HEAD -- scripts/mutation-coverage-manifest.json
50      0       scripts/mutation-coverage-manifest.json          # 50 insertions, ZERO deletions
```
`invariants` +6 · `meta` +5 · removed 0 · changed 0 · every other top-level key byte-equal ·
base insertion order preserved · the join stays exact. **The whole file diff is a pure
insertion**, which is the strongest available proof that nothing was re-serialized.

```
$ npx vitest run tests/lint/mutationCoverageManifest.test.js
 Test Files  1 passed (1)
      Tests  10 passed (10)
```

### H2 — `scripts/mutation-sweep.sh`

The `MUTATED_FILES` hunk auto-merged on every car (INSTR inserts at the head of the array,
§913 appends at the tail — no textual overlap), so BOTH sides are present by construction.
Only car 7's plant-block hunk conflicted; cars 8, 9 and 10 auto-merged their plant blocks
after §913's, including car 10's in-place corrections to the #79 roster and the #77 tally.
Car 7's conflict was resolved by `$SC/rebase-tools/resolve_sweep.py`: HEAD's 24 lines kept
first, a blank line, then INSTR's 40 lines with `# NN.` header numbers bumped +1. Every later
car's plants were bumped the same way, one header at a time, by
`$SC/rebase-tools/bump_plant.py` (which asserts the header it is about to change is unique
and rewrites nothing else on the line).

**Final numbering** — §913 keeps `# 74.`; INSTR's eleven run `# 75.`–`# 85.`:
```
1025:# 74. §913 L-MAT-FIX — THE LIVING-CONTENT ROSTER PUBLISHED BY ONE ALLOWLIST ROW.
1050:# 75. INSTR-912 car 1 — THE SAME-ENTRY WALKER'S TOTALITY ARM.
1061:# 76. INSTR-912 car 2 — THE SEGMENT DEFINITION.
1069:# 77. INSTR-912 car 3 — THE LOADERS' EXACTNESS.
1076:# 78. INSTR-912 car 4 — PERSONS ARE NEVER CLOSED.
1085:# 79. INSTR-912 car 5 — THE PUBLISHED LEXICON IS A PARTITION.
1093:# 80. INSTR-912 car 8 — A POOL THE CENSUS CANNOT READ MUST SAY SO.
1114:# 81. INSTR-912 car 9 — A COLUMN CLOSES ONLY WHERE EVERY SOURCE THE SPEC NAMES IS READ.
1127:# 82. INSTR-912 car 9 — A SOURCE DECLARED READ MUST ACTUALLY BE READ.
1139:# 83. INSTR-912 car 9 — THE RUIN FILTER MUST ROUTE THROUGH THE COLUMNS, NOT ONLY THE ROWS.
1152:# 84. INSTR-912 car 10 — "RESOLVED" MUST NEVER AGAIN BE READ AS "RECOVERED".
1169:# 85. INSTR-912 car 10 — A SOURCE READ ONLY INTO A STRING NOBODY ASSERTS IS NOT READ.
```

**ARM (executed):**
```
$ sh -n scripts/mutation-sweep.sh   ; exit=0
$ bash -n scripts/mutation-sweep.sh ; exit=0

# every INSTR label present EXACTLY ONCE (11 labels, count printed per label)
1  institution-table/a column source declared read stops being read and the duty leaves the table
1  institution-table/a partially-filled column is closed by hand and over-licenses a quantifier
1  institution-table/the persons column closes and the Brackwater quantifier becomes licensed
1  institution-table/the ruin filter leaves the service columns and an absent institution licenses a duty
1  institution-table/the third column source stops being read and the closed flag does not notice
1  prose-entry-walker/the totality arm stops reading the column's closed flag
1  prose-move-grammar/the segment definition drifts from a sentence to a clause
1  prose-presence/a sense leaves the published lexicon and the spread stops being a partition
1  prose-register-loaders/a disclosure line leaves R4b and the exact count breaks
1  prose-wiring-census/a resolved pool loses its predicate and RESOLVED still reads as RECOVERED
1  prose-wiring-census/an unrecoverable predicate reads as RESOLVED and the census claims total coverage

# §913's label present once
1

# labels, whole file
base(3b1c0eaa5) 73 · INSTR tip 84 · merged 85 · distinct merged 85   (73 + 11 + 1 = 85)

# MUTATED_FILES
67          # 60 base + INSTR's 6 (incl. src/domain/display/heraldIntegrity.js) + §913's publicSafe.js

$ git diff --numstat f3ab08f51..HEAD -- scripts/mutation-sweep.sh
138     0       scripts/mutation-sweep.sh                        # 138 insertions, ZERO deletions
```
And the LABELS are proved byte-untouched, not merely present: INSTR's whole car-7 block was
extracted from both trees and compared with the `# NN.` numbers normalised —
```
$ diff <(src block, # NN. normalised) <(merged block, # NN. normalised)
IDENTICAL — only the # NN. comment numbers differ
```

### H3 — `tests/lint/.lighting-census-baseline.json`
Never conflicted: the four commits that touch it were skipped, so `git diff f3ab08f51..HEAD --
tests/lint/.lighting-census-baseline.json` was EMPTY through all nine carries. Regenerated in §3.

### H4 / H5 — §913's side taken whole, asserted
```
$ git -C $SC/laneINSTR diff --name-only 3b1c0eaa5..ee403e8ab | grep -E 'writer-reach|supabase/'
(no output; grep exit 1)
```
INSTR names neither `scripts/.writer-reach-baseline.json` nor any `supabase/functions/_shared`
file anywhere in its thirteen commits, so §913's are carried untouched. No build was run in
this dock and `node_modules` was left symlinked, per the brief.

## 3. AFTER THE NINE CARRIES — the file list the brief asks to be pasted

```
$ git diff --name-status f3ab08f51..HEAD          # BEFORE the register commit
M	scripts/mutation-coverage-manifest.json
M	scripts/mutation-sweep.sh
A	src/domain/institutions/institutionTable.js
A	src/domain/prose/entryGround.js
A	src/domain/prose/entryLexicons.js
A	src/domain/prose/entryWalker.js
A	src/domain/prose/grammarWalker.js
A	src/domain/prose/moveGrammar.js
A	src/domain/prose/plantLedger.js
A	src/domain/prose/presenceMeasure.js
A	src/domain/prose/proseFingerprint.js
A	src/domain/prose/wiringCensus.js
A	tests/fixtures/brackwaterTables.js
A	tests/fixtures/composedReadingSequence.js
A	tests/fixtures/grammarControls.js
A	tests/fixtures/wiringFixtures.js
A	tests/helpers/dossierComposedFill.js
A	tests/helpers/dossierCorpus.js
A	tests/lint/institutionTable.walker.test.js
A	tests/lint/proseEntryContradiction.walker.test.js
A	tests/lint/proseMeasures.walker.test.js
A	tests/lint/proseMoveGrammar.walker.test.js
A	tests/lint/proseRegisterLoaders.walker.test.js
A	tests/lint/proseWiringCensus.walker.test.js
     22 A
      2 M
```

⚠ **ONE BRIEF FIGURE CORRECTED BY MEASUREMENT.** Step 3 asks for "22 additions … + 3
modifications (the manifest, the sweep, and NOTHING else — the lighting baseline is not yet
touched)". Those two sentences disagree: at this point the modifications are **2**, exactly the
two the parenthetical names. **3** is the consist's own end-state figure (25 files) and is
reached only after the register commit in §4, where `git diff --name-status f3ab08f51..HEAD`
reads **22 A · 3 M**. Both are recorded so no reader has to guess which was meant.

**A STRONGER ARM THAN THE LIST.** Every one of the 22 additions was compared BLOB-FOR-BLOB
against the source dock's tip:
```
added files compared: 22  differing: 0
```
Nothing the merge touched can have altered an INSTR file: the ten `src/` island modules, the
six walkers, the four fixtures and the two helpers are byte-identical to `laneINSTR@ee403e8ab`.

## 4. THE LIGHTING CENSUS — ONE REGISTER COMMIT, REGENERATED BY ITS OWN DOOR

Pre-run gate in its own shell call: `HOLD-VITEST` absent, split-pattern runner count **0**,
porcelain **0**.

```
$ LIGHTING_CENSUS_REFREEZE='INSTR-912 rebase (Opus 5)' LIGHTING_CENSUS_NOTE='…' \
    npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
Error: census REFROZEN at e45adbbb51b8b499bfb623c5d7b84683f09086f7 by INSTR-912 rebase (Opus 5):
  files 2545 -> 2551, parked 373 -> 375, credited 2172 -> 2176,
  titles 23707 -> 23778, suiteTitles 6342 -> 6361.
  This run fails BY DESIGN so a refreeze can never be mistaken for a passing gate.
 Test Files  1 failed (1)
      Tests  1 failed | 33 passed (34)

$ npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
 Test Files  1 passed (1)
      Tests  34 passed (34)          # the plain green the ritual's docblock asks for
```

| | BEFORE (§913, `a75faa3a7`) | AFTER (this rebase, `e45adbbb5`) | Δ |
|---|---|---|---|
| files | 2545 | **2551** | +6 |
| parked | 373 | **375** | +2 |
| credited | 2172 | **2176** | +4 |
| titles | 23707 | **23778** | **+71** |
| suiteTitles | 6342 | **6361** | +19 |

Register commit `5af1a0566`, one file (`tests/lint/.lighting-census-baseline.json`), the three
trailers exactly as the brief prescribes. Every figure is the door's; none was hand-composed.

**WHICH TWO OF THE SIX WALKERS THE DOOR PARKS — an INFERENCE that reproduces both figures
exactly, not a direct read of `parkReasonsFor`.** Counting `describe(`/`it(`/`test(` openers per
file: institutionTable 5/18 · proseEntryContradiction 6/25 · proseMeasures 5/14 ·
proseMoveGrammar 12/40 · proseRegisterLoaders 3/13 · proseWiringCensus 6/26. The only pair whose
removal reproduces BOTH door deltas is **`proseMoveGrammar` + `proseEntryContradiction`**
(credited suites 5+5+3+6 = **19** ✓; credited titles 18+14+13+26 = **71** ✓). So two of the six
new instruments are PARKED — their titles are invisible to the lighting contract. Flagged for
the chair; the census gap car 10b recorded in its own note is the same phenomenon.

## 5. PROVING THE MERGED TREE

Runner count checked **before every run**; it read `0` every time. `HOLD-VITEST` absent
throughout. Porcelain 0 before and after every run.

### 5(a) The six lane walkers, the institution-table walker and the manifest test — ONE AT A TIME

| file | tallied | expected (car 10's) |
|---|---|---|
| `tests/lint/proseWiringCensus.walker.test.js` | **26 passed (26)** | 26 ✓ |
| `tests/lint/proseEntryContradiction.walker.test.js` | **27 passed (27)** | 27 ✓ |
| `tests/lint/proseMoveGrammar.walker.test.js` | **50 passed (50)** | 50 ✓ |
| `tests/lint/institutionTable.walker.test.js` | **18 passed (18)** | 18 ✓ |
| `tests/lint/proseRegisterLoaders.walker.test.js` | **13 passed (13)** | 13 ✓ |
| `tests/lint/proseMeasures.walker.test.js` | **14 passed (14)** | 14 ✓ |
| `tests/lint/mutationCoverageManifest.test.js` | **10 passed (10)** | 10 ✓ |

**158 assertions, seven files, every tally on its predicted number.** This is the load-bearing
result of the whole rebase: the wiring census asserts `708 / 2266 / 318 / 390 / 185 / 185 / 59 /
65 / 140 / 99 / 78 / 118 / 29 / MISSING 34 / THIN 483 / COVERED 225` as INTEGERS and would red on
any rebase that moved a composer or a pool. It is green — **§913 moved neither.** H6 is
discharged by execution, not by re-measurement.

### 5(e) The ten-module byte fence
Inside `proseWiringCensus.walker.test.js` (green above): the arm scans the `src/` tree, finds
each of the ten island modules at its own path and asserts zero importers outside the island.
The island is still an island at the §913 tip.

### 5(b) U6 — the whole `tests/lint` directory, ONCE, on the merged tree

```
$ npx vitest run tests/lint
 Test Files  2 failed | 144 passed (146)
      Tests  5 failed | 2337 passed (2342)
   Start at  02:06:53
   Duration  101.05s (transform 16.13s, setup 4.28s, import 136.94s, tests 494.27s, environment 15ms)
```

⚠ **THE PREDICTED RED DID NOT HAPPEN AND TWO UNPREDICTED ONES DID.** No DOOR 3 timing red
appeared (nothing else was running). Instead **two REGISTERS are red, and both are the
CONSIST'S OWN INHERITED DEBT, not a rebase artefact** — proved by execution at the source tip,
which never met §913:

**RED 1 — `tests/lint/observedShapeReaders.walker.test.js`, 2 of 44.**
```
src/domain/institutions/institutionTable.js: read(s) of a key no writer produces, outside the frozen inventory:
    NEW      treasury on settlement — 1 read(s); this file has no frozen row for it (ceiling 0)
```
`src/domain/institutions/institutionTable.js:415` — `Number(settlement?.treasury?.coinFlows?.taxed)`,
introduced by **car 9** (`8c53ddef1`; the file carries 0 such reads at every earlier car) as
`whatItCounts`'s third source under §L.2 item 62. The OSR gate is saying, in its own words,
exactly what the receipt's correction row 27 already said: the ABSENT branch is taken on every
generated settlement.
```
$ node scripts/check-observed-shape-readers.mjs   # laneINSTR2 (merged)   -> exit 1
$ node scripts/check-observed-shape-readers.mjs   # laneINSTR  (source)   -> exit 1
$ diff /tmp/osr-source.txt /tmp/osr-merged.txt
IDENTICAL — the finding is the consist's own, not a rebase artefact
```
(source dock porcelain 0 → 0, HEAD `ee403e8ab` unchanged; a dry read, no `--write`.)

**RED 2 — `tests/lint/proseNumerics.test.js`, 3 of 29.**
```
+   "total 227 exceeds reviewed ceiling 225",
+   "floatInterpolation 149 exceeds reviewed ceiling 148",
+   "twoDecimalScore 12 exceeds reviewed ceiling 11",
```
ONE line leaks TWO rows: `src/domain/prose/wiringCensus.js:1100`, `(variants / total).toFixed(2)`,
counted under both `floatInterpolation` and `twoDecimalScore`. Re-run alone: the same 3 red.
Run at the SOURCE tip `ee403e8ab`, read-only: **the same three ceiling lines and the same two
`wiringCensus.js` rows** (source porcelain 0 → 0, HEAD unchanged).

Attribution is also structural: `git diff 3b1c0eaa5..f3ab08f51` touches **neither** register
(`.prose-numerics-baseline.json` and the observed-shape baseline are byte-identical at both
bases), and both leaking files are byte-identical to `laneINSTR@ee403e8ab`. The merge cannot
have caused either.

**NOT CURED HERE, DELIBERATELY.** The brief forbids any edit outside the cherry-picks, the three
conflict resolutions and the one register commit, and forbids `--write`/`--update` on any
register but the lighting door. Both cures are small and both are inside the island; both are
the chair's call. Recorded, not re-found.

### 5(c) The typecheck ratchet
```
$ npm run typecheck:ratchet
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
```
Green at its ceiling — exactly the 173/173 car 7 recorded.

### 5(d) The two dry reads
```
$ node scripts/check-writer-reach.mjs
WRWALKER HOLD — judged 6532 · LIT 560 · LIT-NAME 4646 · DARK 1326 (reviewable 526) · pending-surface
debt: isolationSupport on settlement → web-display (§12 WRW-2 …); magicDependent on isolationSupport
→ web-display (§12 WRW-2 …); requiredCapacity on isolationSupport → web-display (§12 WRW-2 …)
  exit 0
```
H4 discharged: the island grew to ten `src/` modules and gained no product importer, so the
writer-reach scan is unperturbed and its baseline needed no movement. The three pending-surface
rows are §913's own standing owner-gated debt, unchanged by this consist.

```
$ node scripts/check-observed-shape-readers.mjs
  exit 1 — the ONE finding above (3 drift lines), inherited from car 9
```

### 5(f) Fences
No build, no `vite`, no edge bundle, `node_modules` left symlinked. Never the whole suite.
No `--write`/`--update` on any register but the lighting door. No push, no stash, no
`rebase -i`, no amend, no `git add -A/-u/.` — every stage was an explicit path list. The SOURCE
dock was read only (`git show`, and two read-only script/test runs, porcelain 0 → 0 both ends,
HEAD unchanged). `laneLMAT`, `skepINSTR`, `skepINSTR2` and the main tree were never entered.
The only files written outside the dock are this receipt and three helper scripts under
`$SC/rebase-tools/`.

## 6. THE FINAL STATE

```
$ git rev-parse HEAD
5af1a056673e8173fc4f8b72aa29e77b361fc3aa
$ git rev-list --count f3ab08f51..HEAD
10                                    # nine carries + one register
$ git status --porcelain | wc -l
0
$ git status --porcelain --untracked-files=all | wc -l
0
$ git diff --name-status f3ab08f51..HEAD | awk '{print $1}' | sort | uniq -c
  22 A
   3 M                                # the manifest, the sweep, the lighting baseline
```

## 7. RESIDUES DISCLOSED (none blocking; all the chair's)

1. **Two register reds, inherited** — §5(b). The OSR's `settlement.treasury` read (car 9) and the
   two prose-numerics rows from `wiringCensus.js:1100` (car 8/10). Both reproduce at the source
   tip; neither is a rebase artefact; neither is curable inside this brief's fences.
2. **In-prose plant numbers were NOT renumbered.** The brief's instruction is COMMENT NUMBERS
   ONLY and the manifest entries are added BY TEXT, so the `what` fields and several sweep
   comment bodies still name plants by their PRE-rebase numbers (`sweep #80`–`#84`, `plant #79`,
   `#77`). No gate reads them — the manifest join is on LABELS and the numbers are documented
   as non-locators — but a reader comparing a body's `#80` with its header's `# 81` should know
   why. Left as the brief prescribes; flagged rather than improvised.
3. **Two of the six new walkers are PARKED by the lighting census** — §4. Their titles do not
   count toward the contract.
4. **`git cherry-pick --continue` was run with `GIT_EDITOR=true`** so the messages carried
   through unedited; each was verified (car 7 diffed explicitly) to be byte-identical to the
   source's but for `-x`'s provenance line.

Seat: Opus 5 — Fable-unvalidated
Lane: INSTR-912 (rebase)
