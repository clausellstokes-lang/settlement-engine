# TE-CG-2 receipt — duplicate building footprints

STARTED 2026-08-24 — lane TE-CG-2, worktree
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/695a70c5-80ee-4ebd-b806-a8c102244d16/scratchpad/laneCG2-tree`
at slot base 79b78881ca86612ec312602c2e3dc6d06aa34df8 (detached). node_modules symlinked.
Disk at start: 17.8 GB free.

## RESUME POINT
- DONE: worktree created, node_modules linked, receipt opened.
- NEXT: read src/domain/townCartography/* and locate the footprint generator; Step 1 measurement harness.

## STEP 1 — MEASURED (2026-08-24, at slot base 79b78881c, BEFORE any edit)

Corpus: the CG-1b calibration corpus, `tests/fixtures/cartographyCalibrationCorpus.js`
`calibrationRows()` — 6 tiers x 12 cultures x 7 terrains = **504 settlements**, threat rotated
`i%4`, seed rotated `i%12` over `cg1-seed-00..11`. Compiled through the REAL
`generateSettlementPipeline` + `compileTownSceneManifest` with
`worldState.simulationRules.townCartographyEnabled = true`.
**504 of 504 compiled, 0 threw** — the CG-1b control is green at my base.

Denominator: every row of `manifest.cartography.buildings` = **53,420 buildings**
(institutions 29,482 + dwellings 23,938). Rate = share of buildings that share their
footprint with **at least one other building in the same settlement**.

| reading of "identical"                          | micro rate | dup/total     |
|-------------------------------------------------|-----------:|---------------|
| exact — vertex-for-vertex, same absolute coords  | **26.42%** | 14112 / 53420 |
| exact, cycle-canonical (any start vertex)        |   26.42%   | 14112 / 53420 |
| translate — same shape+size, moved               | **63.30%** | 33814 / 53420 |
| congruent — SSS, incl. rotation + reflection     | **75.44%** | 40300 / 53420 |
| area within 1%                                   |   95.08%   | 50793 / 53420 |

Macro (mean of per-settlement rates): exact 44.43% / translate 69.12% / congruent 77.88%.

By tier (exact / translate / congruent):
thorp 55.63 / 64.67 / 72.18 · hamlet 66.67 / 74.96 / 81.23 · village 66.64 / 82.09 / 86.39
town 49.05 / 80.99 / 84.27 · city 19.74 / 59.04 / 73.31 · metropolis 9.61 / 54.36 / 70.87
=> **concentrated at the SMALL tiers**, monotonically improving with tier size.

By role (exact/translate): institution 47.87 / 67.77 · dwelling 0.00 / 57.79.
Exact duplicates are institution-institution only.
Worst ward kinds by translate: other 80.45%, merchant 72.27%, industrial 65.77%.

**THE 13% IS NOT REPRODUCIBLE.** No reading, no corpus, no denominator I tested lands
near it, and no derivation of it exists anywhere in the repo (grepped docs/, src/, tests/).
The old synthetic 20-row corpus (`V2_GOLDEN_CONFIGS`) reads WORSE still: exact 82.93%,
translate 85.37%, congruent 87.80% over 820 buildings. My number for the headline
reading ("the same shape drawn twice", = translate) is **63.30%**, and for the
strictest reading ("the same triangle at the same coordinates") **26.42%**.

## STEP 2 — THE MECHANISM (CONFIRMED, executed)

TWO defects in `src/domain/townCartography/cartographyBuildings.js`, and one property of
the geometry that turns both of them into identical coordinates rather than crowding.

**M1 — the packer took a mod-4 SLOT.** `packFootprint(parcel, index, start)` built the
footprint from `[[v0,m01,m20],[v1,m12,m01],[v2,m20,m12],[m01,m12,m20]][index]`. The
footprint is a PURE FUNCTION of (parcel, slot, shrink). The flagship path took
`subcell = arrived % 4` off an uncapped counter, so the FIFTH institution bound to a
parcel was handed the cell the first one already held.

**M2 — TWO counters over one parcel.** `flagshipsAt` (round-1 institutions) and
`occupancy` (instances + dwellings). A flagship never touched `occupancy`, so instances
and dwellings started again at slot 0 on top of a flagship that had taken it.

**G1 — the medial subcells are TRANSLATES of one another.** Proved over 20,000 pseudo-
random integer triangles: subcells 0,1,2 are exact translates in **20,000 of 20,000**,
and all four are congruent in 20,000 of 20,000. So one parcel at one class shrink has a
ONE-SHAPE vocabulary; the only shape variety in a whole settlement came from the parcels.

EXECUTED EVIDENCE over the 504-row corpus at the slot base:
- exact-duplicate groups: **5,932**, of which **5,932 lay entirely inside a SINGLE
  parcel** and **0** spanned two parcels.
- parcels holding more than the four slots the old theorem afforded: **4,518**; the
  worst held **29** buildings in a parcel that affords 4.
- group composition: **1,772 flagship-only** (M1, the wrap) + **4,160
  flagship-plus-other** (M2, the two-counter split) + **0 other-only** — instances and
  dwellings alone never collide, because they share one honest counter. The two code
  defects map 1:1 onto the two group classes.

DOWNSTREAM CONSEQUENCE, not cosmetic: `cartographyProperty.js` `openGroundOf` returns
the parcel ring with member footprints as HOLES under an EVEN-ODD fill. Two identical
holes cancel, so the yard under a stacked pair renders as solid ground.

## STEP 3 — THE FIX

1. **One cell ledger.** `flagshipsAt` deleted. A flagship draws `occupancy.get(id)` and
   increments it. It stays exempt from the per-parcel BAND and the total cap — a
   canonical institution always appears — but an exemption from a density band is not a
   licence to be issued a cell another building holds.
2. **The slot became a recursive medial ADDRESS.** `cellAt(parcel, index)`: 0..3 are the
   depth-1 subcells (byte-identical to the old geometry, so a parcel holding <=4 did not
   move), 4..19 depth 2, 20..83 depth 3, to `FOOTPRINT_CELL_MAX_DEPTH = 5` (1,364 cells
   in one parcel; corpus worst case 29). Containment stays a THEOREM by induction and is
   still re-checked exactly against the parcel on every vertex and the anchor.
3. **The footprint is DRESSED, like the height and the age already are.** A size step
   (+-`FOOTPRINT_FORM_SHRINK_STEP` = 45 permille) and an optional corner truncation
   (`FOOTPRINT_CORNER_CUT_PERMILLE` = 340, giving a trapezoid whose every vertex is a
   convex combination of the cell's own), off one `sceneDigest` under its own `aspect`
   key. **TIER-BANDED**: `FOOTPRINT_FORM_VARIANTS` = 3/3/6/9/12/12.
4. `free` in the dwelling fill is clamped at zero — an over-subscribed parcel used to be
   able to borrow slots from its siblings once occupancy could exceed the band.

Files: `src/domain/townCartography/cartographyBuildings.js`,
`src/domain/townCartography/cartographyTuning.js`,
`tests/fixtures/cartographyCalibrationCorpus.js`,
`tests/domain/townCartographyCalibration.test.js`,
`tests/domain/townCartographyBuildings.test.js`,
`tests/fixtures/cartography-calibration-corpus.json` (re-recorded).

### WHERE I DRAW THE TIER LINE
- **EXACT duplication (same coordinates) is never correct at any tier.** Ceiling 0, flat,
  no headroom. It is a rendering bug (the even-odd cancel above), not low variety.
- **TRANSLATE duplication (same shape, moved) IS legitimately tier-scaled.** A thorp's
  plan unit is 10 cm to a metropolis's 80 and a thorp genuinely is a dozen of the same
  cottage, so the form vocabulary and the ceiling both band by tier.

## RESULT (same instrument, same corpus, 504/504 compiled both times)

| reading    | base 79b78881c | after   |
|------------|---------------:|--------:|
| exact      |     26.42%     | **0.00%** |
| translate  |     63.30%     | **6.07%** |
| congruent  |     75.44%     |  10.98% |
| buildings  |     53,420     |  44,293 |

Per tier after (translate): thorp 94 / hamlet 184 / village 88 / town 65 / city 49 /
metropolis 52 permille. Ceilings pinned at those readings x the declared
`CARTOGRAPHY_HEADROOM_PERMILLE` (1600) = 151/295/141/104/79/84.

**ONE-LAW CONTROL: `cartoInstitutionRefs` identical on 504 of 504 recorded rows** —
every canonical institution still draws its flagship. Throw census still 0 of 504
(CG-1b not regressed). `institutions` maxima unchanged (11/24/41/62/55/63).

**CONVICTING CONTROL, executed:** N institutions bound to ONE parcel, distinct footprints
emitted —
PRE-CG-2 `1->1 2->2 3->3 4->4 5->4 6->4 7->4 8->4 9->4 10->4 11->4 12->4` (saturates at
the wrap); POST-CG-2 `1->1 ... 12->12`. Landed as a permanent test.

## BASE-RED FOUND (not mine — reported to the chair)

`node scripts/check-observed-shape-readers.mjs` exits **1** at MY TIP with:

    observed-shape detector or unscanned execution input changed since the schema-10
    instrument was governed; an ordinary gate/write cannot migrate the instrument

and it exits **1 with the byte-identical message at the SLOT BASE, UNEDITED**, proved in a
throwaway worktree at `79b78881ca86612ec312602c2e3dc6d06aa34df8`
(`scratchpad/cg2-baseproof`). **This is a pre-existing base red, not a CG-2 regression.**

Green at my tip, run bare in a fresh shell:
- `npx eslint` over all five changed source/test files — exit 0, no output.
- `node scripts/check-full-typecheck.mjs` — exit 0, `no type regressions (173 error(s), ceiling 173)`.
- `node scripts/check-domain-strict.mjs` — exit 0, `no strict-type regressions (1134 errors, ceiling 1134)`.
- `node scripts/implementation-packets.mjs validate` — exit 0, `valid: 175 packets (0 READY)`
  (re-derived by execution, matching the LANE-LAW card).

## RESUME POINT
- DONE: measurement, diagnosis, fix (commit `4ac13157e`), calibration inputs updated
  (MAX_BUILDING_ROW_BYTES 443->450, FROZEN.maxBuildings 12/25/47/114/196/261), shift record,
  W8 pin, mechanism control test, packet doc `docs/implementation/packets/town-cartography/MF-CG2.md`,
  INDEX row drafted at `scratchpad/cg2/index-row.txt`.
- IN FLIGHT: the third corpus re-record (the writer's key projection needed the two new
  fields added — the first two re-records wrote them as `undefined`), log `/tmp/cg2-rerec3.log`.
- NEXT: source-mutation proof that W8 reds; full gate; then the packet mint as the LAST
  commit on its own (packet doc + INDEX row + PACKET_MANIFEST.json record), re-reading the
  manifest immediately before.
- NEXT COMMAND (after the re-record lands green):
  `cd <tree> && export GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock GATE_MUTEX_MAX_POLLS=960 && sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/domain/townCartographyCalibration.test.js`

## ⛔ ENVIRONMENT RE-BASE (chair instruction, 2026-08-24)

The shared `/Users/cstokes/Desktop/settlement-engine/node_modules` LANE-LAW §1 told me to symlink
carries a **36-dep** manifest against the slot's **40** (`three`, `pg`, `espree`, `@types/node`
slot-only) and was churned twice mid-run. **Every test result I reported before this line is
VOID.** Done:

    rm -f node_modules && npm ci --no-audit --no-fund     -> exit 0, "added 589 packages in 5s"
    three 0.185.1 · pg 8.22.0 · espree 11.2.0 · @types/node 25.6.0   (all four present)
    vitest 4.1.8 (the locked version; the shared tree had drifted to 4.1.11)

⚠ TWO CONSEQUENCES THE CHAIR SHOULD KNOW:
1. `npm ci` ran husky's `prepare`, so **`.husky/_` now EXISTS in this worktree** and
   `core.hooksPath=.husky/_` is repo-level: **pre-commit now RUNS here** where LANE-LAW §1 says it
   does not. It is `npx lint-staged` = `eslint --fix` on staged JS, which re-stages — so every
   green from here is re-proved AT the committed tip, not before it.
2. `cg2-baseproof` (a throwaway worktree at the slot base, for base-vs-tip controls) is symlinked
   at THIS worktree's `node_modules`; the two `package-lock.json` files hash identically, so one
   install is correct for both. Proved by execution, not assumed.

### THE MEASUREMENTS RE-RUN UNDER THE CORRECT TREE

**BASE reproduces EXACTLY** — 504/504 compiled, 53,420 buildings, exact **26.42%**, translate
**63.30%**, congruent **75.44%**, every per-tier figure identical to the pre-reinstall reading.
The measurement is pure domain code and was never dependency-sensitive.

**THE FIX re-measures at 504/504 compiled, 44,293 buildings, exact 0.00%, translate 5.93%,
congruent 10.96%.** ⚠ Translate moved 6.07% -> 5.93% against my first post-fix reading, and the
cause is MINE, not the environment: between the two runs I replaced a second digest LABEL
(`FORM_DOMAIN`) with an `aspect` FIELD on the existing one, to keep TC-2's one-label-per-leaf scan
green unedited. Different digest input, different form variants, different footprints. **5.93% is
the number of record.** Per tier, permille: **109 / 181 / 72 / 68 / 51 / 48**.

### CORPUS RE-RECORDED UNDER THE CORRECT TREE (the instrument of record)

`UPDATE_CARTOGRAPHY_CALIBRATION=1 … tests/domain/townCartographyCalibration.test.js`, 504 rows,
`Duration 85.90s`. The corpus's OWN census agrees with my harness to the row:

| tier | drawn | cartoDupExact | cartoDupTranslate | permille | ceiling @1.6x |
|---|---:|---:|---:|---:|---:|
| thorp | 709 | 0 | 77 | 109 | 175 |
| hamlet | 1500 | 0 | 271 | 181 | 290 |
| village | 3069 | 0 | 222 | 72 | 116 |
| town | 7097 | 0 | 485 | 68 | 109 |
| city | 13388 | 0 | 677 | 51 | 82 |
| metropolis | 18530 | 0 | 894 | 48 | 77 |
| **TOTAL** | **44293** | **0** | 2626 | **59 (5.93%)** | |

throws 0 of 504 · max cartoRowBytes 450 · maxBuildings 12/25/47/114/196/261.
`DUPLICATES` and the pinned ceiling vector were set FROM these readings, not the other way round.

Green at the tip after the rebuild, each captured with its own exit:
- `npx eslint` over the five changed files — exit 0, no output.
- `node scripts/check-full-typecheck.mjs` — exit 0, `no type regressions (173 error(s), ceiling 173)`.
- `node scripts/check-domain-strict.mjs` — exit 0, `no strict-type regressions (1134 errors, ceiling 1134)`.
- `node scripts/check-observed-shape-readers.mjs` — exit **1** at the tip AND exit **1** with the
  byte-identical message at the slot base, unedited, both after the rebuild. PRE-EXISTING.

## THE CONVICTING MUTATION (executed)

W8's first two arms read the FROZEN corpus, so a packer regression cannot red them until somebody
re-records — the same structural gap MF-CG1's W2 exists to close. I therefore STRENGTHENED W8 with
a LIVE arm before proving the mutation: it re-measures through the real pipeline on the six rows
carrying each tier's largest canonical roster (over-subscription is what the wrap turned into
stacking, so the argmax rows are where a regression appears first; six generations, not 504).

MUTATION APPLIED to the shipped leaf — the flagship's cell index wraps at 4 again:

    -  subcell = occupancy.get(bound.id) || 0;
    -  occupancy.set(bound.id, subcell + 1);
    +  subcell = (occupancy.get(bound.id) || 0) % 4;
    +  occupancy.set(bound.id, (occupancy.get(bound.id) || 0) + 1);

    src/domain/townCartography/cartographyBuildings.js
      before bba1f24ca6acd6a53b6b26887d25ffc86716e32d02f6082ad667c36add21add5
      after  3ca10d38acfa330c29afedc66dfbdeb6e4f1d7d3a968a5ee548e58df5760f884

RUNNING EXACTLY WHAT THE LIVE ARM RUNS, against the mutated leaf — **8 failures, verbatim**:

    measured 609
    failures (8):
      hamlet hamlet|arabic|desert|road|plagued|cg1-seed-03: 6 of 25 rows stacked LIVE
      hamlet translate live 11 vs recorded 6
      thorp thorp|celtic|hills|road|plagued|cg1-seed-03: 4 of 11 rows stacked LIVE
      thorp translate live 6 vs recorded 2
      town town|celtic|coastal|port|frontier|cg1-seed-06: 6 of 100 rows stacked LIVE
      town translate live 6 vs recorded 0
      village village|celtic|desert|road|safe|cg1-seed-08: 19 of 47 rows stacked LIVE
      village translate live 20 vs recorded 8

Four of six tiers stack again the moment the wrap returns, and the anti-vacuity floor (609 > 600)
holds, so the zeros the unmutated arm reports are measurements and not an empty loop.

### THE VITEST CONFIRMATION — LANDED, AND IT CORRECTED ME

Re-applied the same mutation at the committed tip and ran both suites through the mutex:

    ❯ tests/domain/townCartographyCalibration.test.js (32 tests | 1 failed) 6423ms
        × LIVE: each tier's argmax row re-measures at ZERO stacked buildings, and matches its record
    AssertionError: expected [ …(8) ] to deeply equal []
    +   "hamlet hamlet|arabic|desert|road|plagued|cg1-seed-03: 6 of 25 rows stacked LIVE",
    +   "thorp thorp|celtic|hills|road|plagued|cg1-seed-03: 4 of 11 rows stacked LIVE",
    +   "town town|celtic|coastal|port|frontier|cg1-seed-06: 6 of 100 rows stacked LIVE",
    +   "village village|celtic|desert|road|safe|cg1-seed-08: 19 of 47 rows stacked LIVE",
     Test Files  1 failed | 1 passed (2)
          Tests  1 failed | 55 passed (56)
    TRUE_EXIT=1

**EXACTLY ONE ARM REDS** — the ideal mutant signature. Restored, digest re-proved
`bba1f24ca6acd6a53b6b26887d25ffc86716e32d02f6082ad667c36add21add5`, `git status` clean.

⚠ **THE MUTATION CORRECTED A CLAIM I HAD WRITTEN.** I had predicted the MECHANISM control would
red too. It did not, and the reason is worth carrying: the form dress is a SECOND, INDEPENDENT
barrier — two flagships handed the same cell still draw different footprints whenever their form
variants differ, because `formOf` reads the anchor key. On the crafted six-institution probe that
is enough to hide the wrap. It is a real defence but a PROBABILISTIC one (~1-in-`variants` per
pair), which is exactly why the ADDRESS is the load-bearing fix and why the corpus-wide LIVE arm,
not the crafted probe, is what convicts. The packet's A7 was rewritten to say so; the mechanism
control still fails at the PARENT, where no form dress existed, and A5 states that separately.

## COMMITS AT THIS POINT

    4ac13157e  wave 1: the cell address, the one ledger, the dressed form
    62e0ba496  checkpoint: docblock claims corrected, re-record writer, packet drafted
    4af327eac  wave 2: the corpus records the duplicate census, W8 gains the LIVE arm

`4af327eac` is the first commit taken with the husky shim present. Pre-commit RAN
(`eslint --fix` + `validate-packets-staged.sh`, both COMPLETED) and **rewrote nothing**:
`cartographyBuildings.js` hashes `bba1f24c…` at the committed tip, the same digest as before
staging. lint-staged took and dropped its own internal `git stash`; the ONE stash entry in the
repo (`On analytics-intelligence-layer: generation-tuning fixes`) is the owner's and predates this
lane — untouched.

## RESUME POINT
- DONE: everything above, restored and committed at `4af327eac`, tree clean.
- IN FLIGHT: focused cartography suites at the committed tip, `/tmp/cg2-focused.log`.
- NEXT: mint the packet as the LAST commit (re-read `PACKET_MANIFEST.json` immediately before —
  the row draft is at `scratchpad/cg2/index-row.txt`, the packet doc is already committed and
  needs only its manifest record + INDEX row); then `npm run check:tail` BARE at the final tip;
  then pin `refs/preserve/holding-cg2`.

## FOCUSED GREEN AT THE COMMITTED TIP (verbatim)

    gate-mutex: acquired atomic lock as PID 53342 after 3 poll(s).
     RUN  v4.1.8 .../laneCG2-tree
     Test Files  11 passed (11)
          Tests  228 passed (228)
       Start at  03:30:01
       Duration  18.16s (transform 1.28s, setup 181ms, import 7.21s, tests 25.04s, environment 1.34s)
    TRUE_EXIT=0

The eleven: townCartographyCalibration · townCartographyBuildings · townCartographyParcels ·
townCartographyDeterminism · townCartographyProperty · townSceneCartography · townCartographyPaint ·
townCartographyDormancyGolden · townCartographyBlock · settlementMapPropertyLine ·
mapCartographySubTab.

## THE PACKET, MINTED AS THE LAST COMMIT

`44b83a882` — `docs/implementation/PACKET_MANIFEST.json` + `docs/implementation/INDEX.md`, nothing
else, so a concurrent manifest edit from a sibling conflicts in exactly one isolated commit.

- **Re-read at mint time by execution**, not from the card: `175 packets, 0 non-terminal`. This
  member makes 176. `node scripts/implementation-packets.mjs validate` → exit 0,
  `valid: 176 packets (0 READY)`.
- ⚠ **THE MANIFEST IS APPENDED TEXTUALLY, NOT RE-SERIALIZED.** My first attempt wrote
  `JSON.stringify(manifest, null, 2)` and produced **9,316 insertions / 5,779 deletions**: the
  committed file carries a MIXED escape style (at least one string holds `\u2014` where its
  neighbours hold a literal em dash), so a whole-document re-serialize rewrites thousands of lines
  it never needed to touch — a conflict magnet against three live lanes and a diff that hides the
  one record. Reverted and redone surgically: **+177 lines, one record**, re-parsed clean.
- ⚠ **THE INDEX TABLE HAS BLANK LINES INSIDE IT** (the known defect). "Insert after the last
  consecutive row line" landed the new row in the MIDDLE of the table, between `LANDED-22` and a
  blank line. Corrected to "the last row line before the next `##` heading" — the row now sits
  after `LANDED-31`, the true end. +1 line.

## COMMIT CHAIN

    4ac13157e  wave 1: the cell address, the one ledger, the dressed form
    62e0ba496  checkpoint: docblock claims corrected, re-record writer, packet drafted
    4af327eac  wave 2: the corpus records the duplicate census, W8 gains the LIVE arm
    cb51e035a  the mutation corrected A7 — one arm reds; the form dress is a second barrier
    44b83a882  MF-CG2 minted: the packet record and its INDEX row, alone in this commit

Pre-commit ran on all four post-`npm ci` commits and rewrote nothing; each tip re-proved.

## RESUME POINT
- DONE: everything. Tip `44b83a882`, tree clean.
- IN FLIGHT: `npm run check:tail` BARE at the final tip, `/tmp/cg2-fullgate.log`.
- NEXT: on green, pin `git update-ref refs/preserve/holding-cg2 44b83a882` and report.

## CENSUS DELTA — MEASURED BY EXECUTION

`+0 files / +0 parked / +0 credited / +5 titles / +1 suiteTitles`. No new test FILE, so none of
the three ratchets a new file trips is in play.

- `tests/domain/townCartographyCalibration.test.js`: **28 → 32** executed titles (vitest reported
  `(32 tests | 1 failed)` on the mutation run and `32 passed` clean), **8 → 9** `describe`s (W8).
  Four new `it`s: the zero-stacking arm, the frozen-reading/derived-ceiling arm, the LIVE argmax
  arm, and the instrument control.
- `tests/domain/townCartographyBuildings.test.js`: **23 → 24** executed titles, describes unchanged
  at 5. One new `it`: the mechanism control.

No template-literal `it()` title was added, so nothing double-counts.

## ⚠ INSTRUMENT NOTE FOR THE CHAIR — THE gate-tail LOG PATH IS AMBIGUOUS ACROSS LANES

`scripts/gate-tail.sh` writes to `${TMPDIR}/gate-tail.$$.log`, and every lane on this box shares
one `TMPDIR`. Picking "the newest `gate-tail.*.log`" gave me **laneCH3's** log, not mine, and I
read four of its steps as my own before noticing that its lint output named
`.../laneCH3-tree/src/...`. Nothing was mis-reported (I had run those three checks directly and
independently), but the trap is live for every lane: **identify your log by grepping it for your
own worktree path, never by mtime.** Mine is `gate-tail.64236.log`; CH3's is `gate-tail.65321.log`,
created 66 seconds later.

## THE FULL GATE — VERBATIM

`npm run check:tail` BARE, from the lane worktree, at tip `44b83a882`. My log is
`${TMPDIR}/gate-tail.64236.log` (identified by grepping it for `laneCG2-tree`, not by mtime).

**GREEN, steps 1-14:**

    [hazard-registry] OK — 29 class(es): MACHINERY 12, PARTIAL 11, DOCUMENT 6, ACCEPTED 0. DOCUMENT 6/6, OWED 17/18 (shrink-only), MACHINERY 12/9 (grow-only), floor 27.
    [premortem] SELF-CHECK OK — 28 predicates (16 derived, 12 authored of which 3 hybrid), 23/29 registry classes routed to a trigger, 6 uncovered and each explicitly exempted with a reason.
    foundry-module OK — module.json valid, 3 script(s) parse, README present.
    mcp-server OK — package.json valid + dependency-free, 3 module(s) parse, read-only tool manifest, no write/network path.
    [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
    [domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).
    ✖ 29 problems (0 errors, 29 warnings)          <- lint: zero errors, all 29 warnings pre-existing

**RED, step 15 `test:ratchet` — ONE failure, and it is the DEFERRED CENSUS ROW:**

    [test-ratchet] TEST REGRESSIONS (fix them; do not widen the census):
      1 failing test(s) NOT in the frozen census:
        tests/lint/sovereigntyLightingContract.walker.test.js :: the sovereignty lighting condition — a marker is EVIDENCE only in a live title THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed
          ASSERTION · ran 51ms against a 20000ms budget (vite.config.js testTimeout; the file also declares 5000ms) — a real verdict — read the message
          msg: AssertionError: the live TEST-title count moved from SP-C's measured 18,471 — this is the evidence layer, the exact figure two cuts in a row stated wrongly in prose, and the reason it is asserted rather than described: expected 20987 to be 20982 // Object.is equality
      machine at this run: load 16.57/17.86/17.20 over 8 core(s)
    Frozen census is 11 failing test(s), measured at 4deb4f026644cba500b0efc1e051fdea2ff96041.
    [gate-tail] exit: 1 (the gate's own status, not a pipe's)
    TRUE_EXIT=1

Read off MY OWN run's report (`test-ratchet-Cp89wR/results.json` — ⚠ NOT
`test-ratchet-last-red.json`, which is a SHARED TMPDIR path and had already been overwritten by
laneCH3's run): **2,471 files / 29,034 tests / 12 failed / 1 skipped / 0 files from any other
tree.** The 12 are the ELEVEN frozen (voiceMechanics ×4 — the eleven-not-seven roster —
enforcement-claims, metronomeCooldownLint, clampPrimitiveBaseline, warCostKindPools ×3,
warRulingKindPools ×1) **plus my census row and nothing else.** No regression anywhere in the
estate.

**GREEN, steps 16-17, run separately because the ratchet red cut the `&&` chain short:**

    ✓ built in 23.00s
    [prerender] wrote 314 static route documents (13 views + 15 gallery hubs + 286 compendium entries) under dist/
    BUILD_EXIT=0
    [test-ratchet] STRICT DIST OK — 52 discovered/reported file(s), 438 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.
    VERIFY_DIST_EXIT=0

## THE CENSUS DELTA, WALKED FIGURE BY FIGURE

The walker asserts all five figures in ONE test and STOPS AT THE FIRST MISMATCH, so `titles`
redding left `suiteTitles` unreached — the TE-STACK-1 short-circuit hazard exactly. I ran the
walker's OWN documented probe (advance `CENSUS.titles` to the live value so the last assertion
becomes reachable; the file's header records the same technique) and read every figure from its
own message, in assertion order:

| figure | frozen | live | delta |
|---|---:|---:|---:|
| files | 2523 | 2523 | **PASSED UNMOVED** |
| parked | 366 | 366 | **PASSED UNMOVED** |
| credited | 2157 | 2157 | **PASSED UNMOVED** |
| titles | 20982 | 20987 | **+5** |
| suiteTitles | 5840 | 5841 | **+1** |

`expected 5841 to be 5840`, with `Tests 1 failed | 32 passed (33)` — so the last assertion is
reachable and the three before it are live-green, not silent. Probe restored, digest re-proved
`e019fdc0b5dd3aea5b897e3cf39dc1fb268a74ace154099574ddd564f27df77f`, tree clean.

**DELTA: `+0 files / +0 parked / +0 credited / +5 titles / +1 suiteTitles`** — exactly the
`censusAuthorization` the packet declared before the walk. Post-CG-2 tuple, if this lane lands
alone: `2523 / 366 / 2157 / 20987 / 5841`. **I did NOT stamp the tuple** — LANE-LAW §4 says carry
the DELTA, the packet excludes every `tests/lint/**` edit, and MF-CG1b's precedent pays the census
row in the LANDING act, where the chair sums the live lanes' deltas. Stamping it here would
guarantee a conflict with three sibling lanes.

## PIN

    refs/preserve/holding-cg2 -> 44b83a882acd71c3f199ce83eec0c1a7f154d9a0

No other ref moved. Nothing pushed. The build ref was not CAS'd and no pin was deleted.

## JUDGMENT CALLS (each recorded so it can be vetoed)

1. **The 13% is corrected UPWARD, not quietly re-stated.** No reading, corpus or denominator I
   tested lands near it and no derivation exists in the repo. My numbers: 26.42% exact, 63.30%
   translate, over 53,420 buildings in 504 settlements. If the chair has the 13%'s provenance,
   it should be reconciled — but I could not find one.
2. **Exact duplication gets a FLAT ZERO ceiling; translate duplication gets a TIER-BANDED one.**
   The line is drawn at "is this a rendering defect or is it low variety". Stacking is the
   former (the even-odd yard cancel), repetition of shape is the latter, and a thorp genuinely
   is a dozen of the same cottage.
3. **The ceiling is DERIVED at the owner-signed headroom, not authored.** Reusing
   `CARTOGRAPHY_HEADROOM_PERMILLE` rather than inventing a second parameter keeps the value
   owner-gated; I did not re-open it.
4. **`BUILDINGS_PER_PARCEL` and `PARCELS_PER_WARD` were deliberately NOT raised.** The address
   tree makes the "<= 4 always" comment false as arithmetic and I corrected the comment, but the
   VALUES are density taste and belong to the tuning pass. Raising them is the obvious next lever
   for map richness — I am flagging it, not pulling it, because this is a repair.
5. **The form dress is an `aspect` FIELD on the existing digest domain, not a second `carto:`
   label.** That keeps TC-2's one-label-per-leaf scan green UNEDITED rather than my editing a
   landed pin to accommodate my change.
6. **The corpus records the census; the pin reads the corpus.** The alternative — computing the
   rate inside an assertion — would have made the figure a property of whichever settlement I
   picked. The cost is that two of W8's arms read a frozen number, which is why the LIVE argmax
   arm exists.
7. **The census row is DEFERRED, not paid.** See above.
8. **A quad/L-shape footprint vocabulary is deferred to the estate wave** (§10 of the packet),
   with the reason: it is a design move driven by the canonical building's own footprint aspect,
   not a repair, and inventing it here would smuggle a design decision into a defect fix.

## WHAT THE ESTATE / PROPERTY-LINE WAVE INHERITS

- Every drawn building now stands in its own cell. `cartographyProperty.js`'s even-odd yard
  subtraction is sound for the first time: no two members of a parcel cancel each other's hole.
- Parcels are unchanged (TC-3b is untouched), so the property RING the wave draws around is the
  same ring.
- What it does NOT inherit: a building-shape vocabulary. Every footprint is still a triangle or a
  chamfered triangle whose angles are its parcel's. §10 of the packet states the cure.
