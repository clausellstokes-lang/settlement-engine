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

