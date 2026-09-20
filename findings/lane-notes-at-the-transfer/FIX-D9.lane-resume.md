# FIX-D9 — LIVE STATE AT THE COMPOSITION (REV 4, written under account-switch warning)

**Stamp:** `Sun Sep 20 13:56:24 EDT 2026`.
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

## THE COMPOSITION IS DONE. All four are committed in the slot.

**Slot:** `$SP/slot-2`, ON `fixes-2026-09-18-consist`, tip **`48450e98c`**, **tree CLEAN**.
Composed onto `532ba71cc` (DOC-4). ⛔ Nothing else in the slot was touched.

| # | composed sha | original | subject | stat |
|---|---|---|---|---|
| 1 | **`7fb4ba483`** | `dbf3d09fe` | FIX-D9: the three dark density modules dispositioned DARK-BY-DESIGN, nothing deleted | 4 files, +200 |
| 2 | **`3c9661c30`** | `3a5618ed8` | FIX-D9: foldTradeCategories RETIRED, with its test and its no-op excision row | 5 files, +13 −110 |
| 3 | **`29df790ec`** | `47197c30a` | FIX-D9: the dead-code disposition made executable by a walker that parses the doc | 2 files, +367 |
| 4 | **`48450e98c`** | (new) | FIX-B2b (by FIX-D9's lane at the composition): the two citers of vite.config.js:912 re-addressed to :1138 after FIX-B2's three moved testTimeout | 2 files, +2 −2 |

### The one resolved commit — two-parent proof, RECORDED

`git diff 3c9661c30^ 3c9661c30 --stat` and `git diff 3a5618ed8^ 3a5618ed8 --stat` are
**IDENTICAL**: same five paths, same `5 files changed, 13 insertions(+), 110 deletions(-)`;
`--name-only` sets diffed clean. The ONLY difference is the resolved hunk:

```
composed:  -    "producerIndexFiles": 1173   +    "producerIndexFiles": 1172
original:  -    "producerIndexFiles": 1172   +    "producerIndexFiles": 1171
```

Resolved by REGENERATING, never by hand: the conflicted file was restored parseable with
`git show HEAD:<path> > <path>` (never the checkout family — `buildCensus` JSON.parses the
committed file for its rate half), then `--dry` priced it — *"sections that would move: stamp ·
stamped shas that would move: (none) · candidate leaves unmoved · ROWS that would move: 0 ·
bytes 2060817 -> 2060817"* — nothing beyond the single stamp delta, so the write proceeded.
`vite.config.js` AUTO-MERGED clean (FIX-B2's 238-line change is elsewhere; my hunk's context
was byte-identical at the tip).

## PROOFS WITH PRINTED COUNTS — DONE

| proof | result |
|---|---|
| **eslint BARE** (8 files: vite.config.js, customContentSchema.js, the 3 density modules, the walker, siteCoherenceRatchet, implementationSession) | **EXIT=0**, no output |
| **census `--check`** | **EXIT=0** — `[wiring-census] verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files` |
| **`tests/lint` WHOLE** | EXIT=1 — **`Test Files  3 failed \| 174 passed (177)`** · **`Tests  4 failed \| 2835 passed (2839)`** · Duration 512.55s |

## PROOFS REMAINING — resume here

```sh
cd "$SP/slot-2"

# NEXT COMMAND:
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/build

# then:
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/scripts

# then goldens (compare against the SLOT-START values below, NOT my lane's):
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json
```

**Goldens at slot start (the baseline to match):**
- `generator-golden-master.json` `7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e`
- `dossier-prose-manifest-golden.json` `88983938ddcf28341031e186d855fef950e6b299ec4b8fc87f170ece1b994084`
  ⚠ **DIFFERENT from my lane's `921c51cf…4b41`** — CURE-J's provenance re-record landed in the
  slot. My commits touch neither golden; baseline against the SLOT's values.

## THE THREE REDS — ALL ATTRIBUTED, **NONE MINE**, each proven not assumed

### 1. `sovereigntyLightingContract.walker.test.js` — PERMITTED, and NOT my delta
```
AssertionError: the estate's file count moved — re-measure, do not re-word: expected 2665 to be 2664
```
Frozen slot tuple: **files 2664 · parked 359 · credited 2305 · titles 25501 · suiteTitles 6812**
(`measuredBy chair-fable-a9df403c`, 2026-09-20).
⛔ **PROVEN NOT MINE:** test-file count is **2665 at `532ba71cc` AND 2665 at my composed HEAD** —
unchanged by all four commits. My net is exactly **0** (+1 `tests/lint/deadCodeDisposition.walker.test.js`,
−1 `tests/domain/foldTradeCategories.test.js`), confirmed by `--diff-filter=A/D`.
⚠ **CONSEQUENCE FOR THE REFREEZE:** the walker asserts in order and stops at the FIRST miss,
which here is `files` — **so my +3 title delta was NEVER EVALUATED at this tip.** At my own lane
it measured `titles 25074 → 25077, +3`. The chair must re-measure titles/suiteTitles at the
refreeze; **the baseline file is untouched by me.**

### 2. `observedShapeReaders.walker.test.js` ×2 arms — PERMITTED (FIX-P1c's), as the chair named
Arms: *"SHRINK-ONLY: no file exceeds its frozen ceiling, and no row has vanished"* and
*"A1/A7: schema-7 filters narrow ordinary noise while explained writers stay banked live"*.
```
expected { violations: 1, stale: +0 } to deeply equal { violations: +0, stale: +0 }
```
The plain checker names the one row verbatim:
```
src/lib/anonForkSalt.js: read(s) of a key no writer produces, outside the frozen inventory:
    NEW      seed on config — 1 read(s); this file has no frozen row for it (ceiling 0)
```
Exactly the chair's pre-authorised row. Its writer `5dd5e8e68` (FIX-P1c) pre-exists my compose.

### 3. `sourceCitationIntegrity.walker.test.js` — ⛔ NOT ON THE CHAIR'S PERMITTED LIST, but PROVEN PRE-EXISTING
Arm: *"the archival exclusion is still the set this walker documents"*. **Failure text verbatim:**
```
AssertionError: the archival roster moved. Re-measure, update archivalExclusionAtFreeze in
tests/lint/.source-citation-baseline.json and the header of this file, and say in the commit
which document changed class and why.: expected { banner: 8, dated: 5, …(2) } to deeply equal
{ banner: 8, dated: 5, …(2) }
    "banner": 8,  "dated": 5,  "sha-pin": 1,
-   "tree": 16
+   "tree": 17
```
⛔ **PROVEN CURE-J's, NOT MINE.** The 17th archival-tree file is
**`docs/shift-records/2026-09-20-cure-j-provenance.json`**, added by **`0d0598a75`**
("SHIFT RECORD: 2026-09-20-cure-j-provenance — the provenance-only re-record"), and
`git merge-base --is-ancestor 0d0598a75 532ba71cc` **SUCCEEDS** — so the red existed at the tip
**before my first cherry-pick**. I added no docs file at all; my only doc change appends a
section to `docs/DEAD_CODE_DISPOSITION.md`, which is in neither `ARCHIVAL_TREES`
(`docs/review-r2/`, `docs/shift-records/`).
⭐ **The cure belongs to whoever composes CURE-J's shift record:** re-measure and update
`archivalExclusionAtFreeze.byRule.tree` 16 → 17 and `files.tree` with that path, per the arm's
own instruction ("say in the commit which document changed class and why"). **I did not touch
the baseline** — it is not my row and a shrink-only register is not mine to move.
⚠ The chair's dispatch listed "the archival exclusion" as a third ARM OF `observedShapeReaders`;
it is in fact a different walker. Only 2 of `observedShapeReaders`' arms fired.

## ⛔ NOTHING ELSE WAS RED. No finding requires a STOP.

4 failed tests = 1 lighting + 2 OSR + 1 archival. All three causes are other lanes'.

## If this session dies

The composition is COMPLETE and COMMITTED; only `tests/build`, `tests/scripts` and the golden
re-hash remain, and none of them can change the four shas. The slot is ON the branch and CLEAN
at `48450e98c`. A successor runs the three commands above and reports. Full receipt (measurement,
counterforce, findings) is at `$SP/lane-fix-d9-scratch/FIX-D9.receipt.md`; the compose plan at
`$SP/lane-fix-d9-scratch/FIX-D9.compose-plan.md`.
