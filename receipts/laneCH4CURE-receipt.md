# TE-CH4-CURE RECEIPT — in flight

## ⭐⭐ REBASE ONTO THE NEW SLOT (2026-08-24 ~11:05) — SUPERSEDES EVERY SHA BELOW
The slot MOVED mid-lane: MF-CH7 landed, `claude/composite-r4` = **479992b6e** (61 cars,
census 2525/366/2159/**21033/5849**, packets 180, ratchet 11 of 29,051).
⚠ THE CHAIR'S PICTURE OF MY STATE WAS BEHIND: all SIX bills were already committed
before the rebase order arrived, not just A-B. The whole chain was rebased.

    PRE-REBASE tip  acc40f977   (recorded in /tmp/ch4-prerebase.txt + reflog)
    POST-REBASE tip 717c5deea   onto 479992b6e
      b7e531349  CH-4 (WIP) registry + anchored den + canonical routing   [was f3d02f62c]
      2011a5e18  edge-bundle regen (SUPERSEDED — fresh regen owed)        [was dc49c6c4a]
      12ebae85f  bills C+D                                                [was 6c200edff]
      e0fce4483  bill E                                                   [was ebaa0e573]
      2f4e47c7d  bill B                                                   [was a040d3048]
      4bc221019  bill F                                                   [was 038715b1b]
      717c5deea  bill A                                                   [was acc40f977]

**CONFLICTS AND HOW THEY WERE RESOLVED**
1. `dc49c6c4a` — 6 GENERATED edge artifacts. ⛔ Never merged as text (stacked-landing
   law): took the replayed commit's side wholesale via `git show REBASE_HEAD:<path>`,
   confirmed ZERO conflict markers, and a FRESH `npm run build:edge-shared` at the
   rebased tip is owed and will supersede it. That regen is the LAST source-affecting act.
2. `acc40f977` — the lighting census tuple. Resolved on RECORDS, not text: CH-7's landed
   ledger block KEPT verbatim as history, my block APPENDED, and ONE tuple line written.
   Resolved to a syntactically valid file FIRST — conflict markers would have made the
   walker PARSE-park this file and corrupt the very census being measured.
Bills C+D, E, B, F replayed CLEANLY (no conflict).

**RE-VERIFIED AT THE REBASED TREE (all executed, none carried):**
- docs touched by my chain: **0** ⇒ no heading census owed (fourth-stack automerge law).
- BILL C any-cast `{"any":5}` = baseline `{"any":5}` ✓
- BILL B arcane pattern live at line **122**, recorded key `districtProfile.js:122` ✓
- BILL E prose baseline row **373**; live scan 413/413, deep-equal **true** ✓
- BILL A census at rebased tree **{2525,366,2159,21049,5852}** — matches the chair's
  ballpark exactly; delta from the new slot **+16/+3**, unchanged by the rebase.
  ⭐ THE DELTA SURVIVED THE REBASE; THE TUPLE DID NOT. The pre-rebase stamp was
  21042/5851 and is NOT carried — the tuple was re-walked at the tree it ships in.
  SINGLE-FILE CONTROL RE-RUN AT THE REBASED BASE: slot's districtProfile.test.js
  (6,772 B, md5 f03be4a479b7…) → census returns to **21033/5849** to the digit
  (17 titles/5 suites); car's copy restored md5-identical → **21049/5852** (33/8).

## ⭐⭐ POST-REBASE COMPLETION — FINAL CHAIN (2026-08-24 ~11:45)
**FINAL TIP: `233c35a69ccb67bb3ce2612427ad918a42fc4af8`** · tree CLEAN · onto slot 479992b6e

    479992b6e  (slot, MF-CH7)
    b7e531349  CH-4 (WIP) registry + anchored den + canonical routing
    2011a5e18  edge regen (SUPERSEDED by e7ea1cbbc — kept, not rewritten)
    12ebae85f  bills C+D   any-casts -> real types; dead power.factions deleted
    e0fce4483  bill E      prose-numerics 238 -> 373
    2f4e47c7d  bill B      arcane key 112 -> 122
    4bc221019  bill F      cartography re-record, DECLARED SHIFT
    09bfd8197  bill A      lighting census 21,033/5,849 -> 21,049/5,852 (amended post-rebase)
    e7ea1cbbc  edge-shared regen AT THE REBASED TIP (last source-affecting act)
    233c35a69  MF-CH4 minted at LANDED (docs only, last and alone)

**BILL A + F RE-PROVED AT THE REBASED TREE:**
- bill A green 33/33 exit 0; NEG titles 21049->21048 = 1 failed of 33 exit 1;
  NEG suiteTitles 5852->5851 = 1 failed of 33 exit 1; restored md5-identical.
- bill F re-measured at the rebased tree: **W8 0 failures / 0 stacked · W2 0 drift of 52.**
  ⇒ MF-CH7's npcProfile.js change and this car are INDEPENDENT on the drawn surface;
  the pre-rebase re-record stands unchanged and needed no second re-record.

**THE EDGE REGEN CAUGHT A PROVENANCE FICTION.** Taking the car's side of the six
conflicted artifacts left THREE sourceHashes describing PRE-CH7 source (a meta hashes
transitive INPUTS and npcProfile.js is in all three AI closures):
    aiGrounding    a5aebd5a14b6d0bf -> da8645a94469428c  (+ CONTENT moved, +7/-12)
    aiCharter      295fd77cf76dc76b -> 9ae9af16d8bd128b  (content == slot, checked)
    aiOutputSchema f4d2986e7ffee6cf -> 3a19ea2f38727d41  (content == slot, checked)
Only aiGroundingBundle.js moves in content — districtProfile.js is in ONE closure.

**PACKET:** 180 pre-mint → **181 (0 READY), valid, exit 0**. Three places stamped.
⭐ The INDEX join was PROVED LIVE: with manifest+packet written but no INDEX row, the
validator read "MF-CH4.packetPath is absent from index". CLAIM_RE: 0 hits in the packet,
0 in the INDEX row. Heading census on the packet: 12 headings, no duplicate heading,
no duplicate/out-of-order section number.

**FINAL-TREE RE-VERIFICATION (all executed):** census live 21049/5852 == stamped ·
arcane pattern line 122 == key 122 · prose row 373 · mutex free · disk 20.8 GB.

**REMAINING:** the full gate (`npm run check:tail`) is IN FLIGHT on the quiescent
final tree, log at /tmp/ch4-gate.log. ⛔ Expect the 11 BANKED failures as the frozen
census; only failures OUTSIDE it are red.

**⚠ NOTE FOR THE CHAIR — a stale cross-reference in a LANDED packet (not mine to edit):**
MF-CH7's changeManifest states the arcane walker "also holds TE-CH-4's
districtProfile.js:112 key". That key is now **:122**. CH-7's prose was accurate at its
own base and I have not touched a landed packet; recording it so it is not re-found as
a defect.


## ⭐ RESUME POINT (updated 2026-08-24 ~10:20, after chair RESUME message)

**WORKTREE:** /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/695a70c5-80ee-4ebd-b806-a8c102244d16/scratchpad/laneCH4-tree
(own node_modules; `.husky/_` PRESENT ⇒ pre-commit RUNS `eslint --fix` and RE-STAGES)
**TIP:** `a040d3048` — tree CLEAN
Chain: slot c3289244d → f3d02f62c (car) → dc49c6c4a (car edge-bundle) →
**6c200edff** (bills C+D) → **ebaa0e573** (bill E) → **a040d3048** (bill B)

**PRE-MEASURED FOR THE REMAINING STEPS (executed, read-only):**
- `node scripts/implementation-packets.mjs validate` → **179 packets (0 READY), exit 0**.
  MF-CH4 does NOT exist; family `catalog-hygiene` (holds CH1/CH2A/CH2B/CH3/CH5).
  ⚠ MF-CH7 (373601437) is **NOT an ancestor of my HEAD** — it is a sibling lane's
  commit, which is exactly why my surface reads 179 and not 180.
- ⚠ THE BRIEF'S PRECEDENT POINTER IS WRONG FOR BILL A: `git show 373601437 --
  tests/lint/sovereigntyLightingContract.walker.test.js` is **EMPTY**. 373601437 is the
  MF-CH7 PACKET MINT (docs only: INDEX.md, PACKET_MANIFEST.json, MF-CH7.md) — it is the
  precedent for STEP 8, not for the census re-stamp. The real re-stamp precedent is
  **c861f6c4c** (AIP-2), which carries both the tuple hunk and the single-file-revert
  attribution control. Tuple line reads
  `files: 2525, parked: 366, credited: 2159, titles: 21026, suiteTitles: 5848,`
  with a dated `== RE-RECORDED ... ==` block appended above it per landing.
- Edge-bundle closure re-confirmed BY EXECUTION at my tree:
  aiGrounding **67 HAS_DISTRICTPROFILE** · aiCharter 111 no · aiOutputSchema 112 no ·
  analyticsEvents 2 no · intentAtlas 2 no ⇒ **ONE** closure bills this car.
- Bill F lawful re-record: `UPDATE_CARTOGRAPHY_CALIBRATION=1 npx vitest run
  tests/domain/townCartographyCalibration.test.js`, and the test's header states
  "add a row above before committing — re-recording without adding a row is a deleted
  alarm". Ledger rows live at ~lines 95-155; the FOURTH RECORD (TE-STACK-5) is the
  closest precedent. W8's hard-stop class is `cartoDupExact !== 0` → "N of M rows
  stacked LIVE"; the other two W8 classes (`cartoDupTranslate`, `cartoBuildings`
  mismatch) are record mismatches, not geometry defects.

**DONE (all executed, see per-bill sections below):**
- Rescued reaped-TMPDIR ratchet report → `scratchpad/collected/ch4-ratchet-results.json`
  (11,719,957 B, sha256 `d03dfe57a2a04d8c397097d61823304bcb699f27838104c5271061c1d48c2ce5`)
- **BILL C** any-cast 7 → 5, equals baseline row exactly. Committed 6c200edff.
- **BILL D** observed-shape 1996/1410 → 1995/1409, violations 0. Committed 6c200edff.
- **BILL E** prose-numerics one pure line move 238 → 373. Committed ebaa0e573.
- **BILL B** diagnosed + edit written (112 → 122 re-point). NOT yet committed.

**REMAINING, IN ORDER:**
1. Commit bill B.
2. **BILL F** cartography (W2 32 rows / W8 8 rows). ⛔ HARD STOP if ANY W8 violation
   is a NONZERO stacked-buildings count — report verbatim, never re-record over it.
   Lawful re-record: `UPDATE_CARTOGRAPHY_CALIBRATION=1` (test W0, line ~335);
   manifest = `tests/fixtures/cartography-calibration-corpus.json`.
3. **BILL A** lighting census re-stamp in
   `tests/lint/sovereigntyLightingContract.walker.test.js`. Derive BY EXECUTION at the
   FINAL tree (gate said live 21042 vs stamped 21026). Shape precedent:
   `git show 373601437 -- tests/lint/sovereigntyLightingContract.walker.test.js`
   (⛔ never copy its numbers).
4. **EDGE-BUNDLE REGEN** after the LAST source edit: `npm run build:edge-shared`,
   commit ALL moved files under `supabase/functions/_shared/` as ONE set.
   districtProfile.js is in `aiGroundingBundle` (67 inputs) — ONE closure, not three.
5. **PACKET** `node scripts/implementation-packets.mjs validate` (expect 179), then mint
   MF-CH4 LAST and ALONE: status LANDED in THREE places (manifest + header + INDEX).
6. **FULL GATE** fresh shell, BARE: `npm run check:tail ; echo TRUE_EXIT=$?`
   ⚠ MUTEX: sibling CH7-CURE has RIGHT OF WAY. Read pid FROM THE LOCK DIR
   (`cat /tmp/settlementforge-vitest-gate.lock/pid`), `ps -p` it, poll 60s up to 2h.
   NEVER kill it.

**EXACT NEXT COMMAND:**
    cd /private/tmp/.../laneCH4-tree && git add tests/lint/arcaneClassifierCensus.walker.test.js && git commit -F <bill-B message>

**RE-VERIFY BEFORE THE GATE (line numbers are load-bearing):** bill B pins
districtProfile.js:122 and bill E pins districtProfile.js:373. No further edit to
districtProfile.js is planned, but BOTH must be re-measured at the FINAL tree.

---

## BILL C — ANY-CAST DEBT ✅ committed 6c200edff
Car added 2 casts in `canonicalArchetypesById`. Cured by REAL TYPES: imported
`FactionLike` from factionProfile.js (the module the map joins against) and declared
the two faction-bearing properties on `DistrictSettlement`.
    scripts/count-domain-any.mjs on src/domain/districtProfile.js
      slot 5 → car 7 → cured {"any":5,"suppress":0}
      baseline row          {"any":5,"suppress":0}   EQUAL
    typecheck:ratchet        173 errors, ceiling 173, exit 0   (unmoved)
    typecheck:domain:strict 1134 errors, ceiling 1134, exit 0  (unmoved)
⚠ Both sat EXACTLY at ceiling BEFORE the edit — zero headroom. Measured pre-edit.

## BILL D — OBSERVED-SHAPE READER ✅ committed 6c200edff
⭐ THE CHAIR'S FRAMING WAS OFF AND THE CORRECTION MATTERS: the chain was NOT a
speculative guess — it mirrors `deriveAllFactionProfiles` (factionProfile.js:349-351)
verbatim, which is the right instinct since the map must join that function's output.
The violation was ONE alternate: `power on settlement`, ceiling 0.
`s?.power?.factions` is DEAD (the ratchet's executed corpus observes no `power` key on
a settlement in any seed) and factionProfile.js already banks that same dead arm at
ceiling 2. Deleted it — the instrument's own first compliance path. Kept BOTH alternates
that have writers, and the load-bearing bare-string arm.
    live scan (walker's own 4-filter chain, replicated):
      before {"reads":1996,"identities":1410}  violations 1, stale 0
      after  {"reads":1995,"identities":1409}  violations 0, stale 0
      frozen {"total":1995,"identities":1409}  EXACT — no re-freeze needed
    file row back to frozen: {"criminal_opportunity on scores":1,"id on institutions":1}
Behaviour-identical: `||` falls through only on nullish, and nothing writes the key.

## BILL E — PROSE NUMERICS ✅ committed ebaa0e573
ONE pure line move, total unchanged 413 → 413:
    ONLY IN LIVE      src/domain/districtProfile.js:373 floatInterpolation
    ONLY IN BASELINE  src/domain/districtProfile.js:238 floatInterpolation
    snippet `High criminal opportunity (${crimScore}) drags safety down.` — IDENTICAL
Re-addressed (not regenerated) per the test's OWN precedents CR-FP-2 and HK-1, with a
dated note. districtProfile.js owns exactly ONE row, so nothing reordered.
⭐ THE CHAIR'S PREFERRED CURE WAS MOOT: the car's dense comment figures ("168 of 168",
3,038, 504) are NOT in this census and never could be — the detector reads numerics that
FLOW INTO A PROSE KEY, not integers in comments. Humanizing them would have deleted
reviewable evidence to satisfy an instrument that never saw it. No figure stripped.
NEGATIVE CONTROL: perturbing the row 373 → 374 returns the instrument to red; restore
verified byte-identical by `cmp` (exit 0), green again.

## ⚠ MUTEX READING — I MISREAD IT ONCE, THE LAW'S EXACT HAZARD (2026-08-24 ~10:45)
`/tmp/settlementforge-vitest-gate.lock/pid` = **75642**, and `ps -p 75642` resolves to
**MY OWN** consolidated verification command, not the sibling's. Every vitest FORK
visible in `ps` belongs to `laneCH7-tree`, which is why a glance at the process list
reads as "CH7 holds the gate". It does not: CH7's forks are running OUTSIDE the mutex.
⛔ This is precisely the recorded hazard ("a lane reported the lock is held by PID
29027; 29027 was alive but was not the holder"). The holder is decided by matching the
LOCK DIR's pid to a command line, never by which vitest processes are visible.
Consequence for this lane: nothing of mine is blocked, and I must NOT wait on CH7
before my own gate on the theory that it holds the lock — but I MUST re-read the lock
immediately before the full gate, because CH7 will take it when it reaches test:ratchet.
⚠ CH7's parallel forks are heavy contention; the OSR walker's `beforeAll` is budgeted
900 s and has historically TIMED OUT at ~306 s under full-suite contention, taking all
27 tests out as SKIPS (which the ratchet's scope sentinel refuses as vacuous). If the
consolidated run comes back with skips rather than a verdict, that is contention, not a
cure failure — re-run it, and read the collected-test count, never the exit code alone.

## BILL B — ARCANE CLASSIFIER ✅ committed a040d3048
Walker scans `src/**/*.{js,jsx}` only (2175 files) — the car's new TEST titles are
invisible to it. Exactly ONE site in districtProfile.js mixes arcane+ambiguous tokens:
    /arcane|magic|tower|college|enclave|conclave/i   category: 'arcane'
It MOVED slot:112 → tip:122; text BYTE-IDENTICAL (verified by `sed -n` on both blobs).
Both failing arms are that one move: the "NEW classifier" arm fires because :122 has no
key, the "no longer where it was recorded" arm because :112 no longer holds it.
ATTRIBUTION (diffed slot:1-111 vs tip:1-121) — all ten inserted lines are ABOVE the
table, none inside it:  +1 the car's `factionArchetype` import at line 30;
+9 MY OWN any-cast cure (FactionLike block 47-53, two properties 76-77).
⚠ FRESH-EYES CATCH ON RESUME: my first draft of the note blamed "the QUARTER_CATEGORY
registry's typedefs" — WRONG, the registry sits BELOW the pattern table. Corrected to
the measured attribution above.
CURE: re-point the key 112 → 122 with a dated note, per the walker's own two recorded
precedents (57 → 58, and 333 → 334 by TE-CH-5 yesterday). ⛔ NOT converting the arcane
spelling — that is its own measured car.

## BILL F — CARTOGRAPHY: DECOMPOSED, HARD STOP CLEARED, re-record NOT yet run
Decomposed WITHOUT vitest and WITHOUT the mutex by importing the fixture
(`tests/fixtures/cartographyCalibrationCorpus.js`) under plain node — the
"lift the classifier out of vitest" technique. Probe: `scratchpad/probe-carto.mjs`.

### ⛔ THE HARD STOP DOES NOT FIRE — checked FIRST, before anything was re-recorded
`cartoDupExact` is **live 0 / recorded 0 at ALL SIX TIERS**. Not one drawn building
stands on another. Every one of the 8 W8 failures is a RECORD MISMATCH
(`cartoDupTranslate`, `cartoBuildings`), never a stacked-geometry defect.
    city        dupExact 0/0   translate  7 vs   0   buildings 194 vs 163
    hamlet      dupExact 0/0   translate  4 vs   6   buildings  25 vs  25
    metropolis  dupExact 0/0   translate 11 vs  14   buildings 261 vs 261
    thorp       dupExact 0/0   translate  2 vs   2   buildings  11 vs  11   (no failure)
    town        dupExact 0/0   translate  2 vs   0   buildings  98 vs 100
    village     dupExact 0/0   translate  0 vs   8   buildings  46 vs  47
⇒ 8 failures, 0 with a nonzero stacked count. MF-CG2's cure is intact under this car.

### W2 — 32 of 52 sampled rows drift, and the PER-FIELD signature is the declared shift
    institutions        0 moved     districts            0 moved
    sceneBuildings      0 moved     dark                 0 moved
    outcome             0 moved     reported             0 moved
    cartoBuildings     28 moved     cartoRowBytes       28 moved
    cartoInstitutionRefs 0 moved  ← THE ONE LAW HOLDS
⭐ Only the two DRAWN-GEOMETRY fields move. `institutions` unmoved ⇒ the generator did
not move underneath the re-record. `cartoInstitutionRefs` unmoved ⇒ every canonical
institution still draws its flagship. `outcome`/`dark` unmoved ⇒ no new throws.
`districts` unmoved ⇒ the district COUNT is identical; only their CATEGORIES moved.
This is exactly the predecessor receipt's ITEM 3: 668 map rings move and 332
wall-embraces flip, so institution POSITION moves (buildings fan around a centroid
that shifts with the district's ring) while institution CLASS does not.
⇒ ALL violations trace to the declared shift. Re-record is lawful.

### ⚠ WHAT THE RE-RECORD WILL ALSO MOVE — budget it, do not be surprised
`cartoDupTranslate` moved at 5 of 6 argmax tiers, and the W8 SECOND arm reads the
MANIFEST against the `DUPLICATES[tier].permille` CONSTANT in the test file, whose
ceiling is DERIVED from it. The FOURTH RECORD precedent moved exactly this pair
(city 51 → 50, ceiling 82 → 80). After re-recording expect to re-check, per the
FOURTH RECORD's own checklist: `DUPLICATES` permille per tier + derived ceilings,
`FROZEN.maxBuildings` (12/25/47/114/196/261), `maxInstitutions` (11/24/41/62/55/63),
the throw census (0 of 504), and the worst `cartoRowBytes` (450 ⇒ byte band 720).
⚠ city rows already read 192/194/196 against a recorded max of 196 — the corpus-wide
maximum must be re-read after the re-record, not assumed.

## BILL F — RESOLVED ✅ committed 038715b1b
Re-recorded via the file's OWN mechanism `UPDATE_CARTOGRAPHY_CALIBRATION=1`, plus the
FIFTH RECORD ledger row its header demands ("re-recording without adding a row is a
deleted alarm"). Manifest md5 3b5241a2 → 4c5f7545.
CORPUS-WIDE per-field delta (all 504 rows, not just the 52-row sample):
    cartoBuildings 281 · cartoRowBytes 299 · cartoDupTranslate 321
    cartoDupExact **0** · institutions 0 · districts 0 · sceneBuildings 0 · dark 0
    outcome 0 · reported 0 · cartoInstitutionRefs 0 · tier 0     (380/504 rows changed)
    corpus cartoBuildings 44,322 → 45,868 (+1,546)
TWO CONSTANTS FORCED, both re-derived not loosened:
    FROZEN.maxBuildings  village 47→46 (LOWERED — the arm is exact both ways),
                         town 114→116, city 196→203; thorp/hamlet/metropolis unmoved
    DUPLICATES.permille  thorp 109→124, village 72→66, town 68→65, city 50→51,
                         metropolis 48→53; hamlet unmoved
    derived ceilings     175/290/116/109/80/77 → 199/290/106/104/82/85
                         (= ceil(permille×1600/1000) re-evaluated; TWO WENT DOWN)
UNMOVED, checked: maxInstitutions 11/24/41/62/55/63 · throws 0 of 504 · worst
cartoRowBytes 450 (byte band 720 holds).
    BEFORE 2 failed | 30 passed (32)   AFTER 32 passed (32), TRUE_EXIT=0

## BILL A — CENSUS RE-STAMP (in flight)
DERIVED BY EXECUTION, not carried: the walker's own machinery (lines 485-1400) LIFTED
out of vitest and run under plain node — no mutex, no gate slot, and per-file
attribution a suite run cannot give. Builder: `scratchpad/build-census-lift.mjs`.
    LIVE at my tree: {files 2525, parked 366, credited 2159, titles 21042, suiteTitles 5851}
    STAMPED at slot: {2525, 366, 2159, 21026, 5848}   ⇒ DELTA +0/+0/+0/+16/+3
SINGLE-FILE ATTRIBUTION CONTROL (the one shape that cannot be ambiguous):
    slot's tests/domain/districtProfile.test.js (6,772 B, md5 f03be4a479b7…) restored
      → census returns EXACTLY to 2525/366/2159/21026/5848, that file 17 titles/5 suites
    car's copy restored (15,805 B, md5 2ab5bd6dfe34…, compared identical)
      → 2525/366/2159/21042/5851, that file 33 titles/8 suites
THE OTHER THREE TEST FILES THE CURE TOUCHED MOVE NOTHING, measured per file:
    townCartographyCalibration 32 titles/9 suites · arcaneClassifierCensus 6/1 ·
    proseNumerics **PARKED** (0/0 — a parked file cannot contribute by construction)
⚠ The lighting walker is ITSELF in the corpus, so after writing the re-stamp comment
block into it the census was RE-MEASURED: still 21042/5851. Comments carry no titles —
confirmed by execution, not assumed.

## Instruments/probes built (outside the worktree, so they never enter a scan)
- `scratchpad/probe-osr.mjs` — replicates the observed-shape walker's live scan + filters
- `scratchpad/probe-prose.mjs` — replicates the prose-numerics live scan + baseline diff


---

# ⭐⭐ SESSION 2 — FRESH EXECUTOR, GATE-ONLY (2026-08-24 ~11:05, TE-CH4-GATE)

Predecessor was killed by a host restart with the FINAL FULL GATE unrun. This session
does survey-first verification (529-law: partial edits could exist) then the ONE gate.
**I MOVE NO REFS.** The chair validates and moves `wip-ch4`.

## SURVEY — the tree is EXACTLY as the receipt left it (all executed)
    HEAD                      233c35a69ccb67bb3ce2612427ad918a42fc4af8   ✓ as briefed
    git status --porcelain    EMPTY (zero lines)                          ✓ no partial edits
    chain 479992b6e..HEAD     9 commits, names match the receipt line-for-line ✓
      b7e531349 CH-4 (WIP) registry/den/routing · 2011a5e18 edge regen (superseded)
      12ebae85f bills C+D · e0fce4483 bill E · 2f4e47c7d bill B · 4bc221019 bill F
      09bfd8197 bill A · e7ea1cbbc edge regen at rebased tip · 233c35a69 MF-CH4 mint
    .husky/_                  PRESENT ⇒ pre-commit regime; every pin below RE-PROVED
                              at the committed tip, none carried from the receipt.
    node_modules              PRESENT, own (not symlinked); package.json 11+29 = **40**
                              deps ⇒ the SLOT manifest, not the owner's 36-dep tree.
    disk free                 19.95 GB  ·  gate mutex lock dir ABSENT (free)

## SPOT-VERIFICATION AT THE COMMITTED TIP (executed this session, nothing carried)
    (b) node scripts/implementation-packets.mjs validate
        → `[implementation-packets] valid: 181 packets (0 READY)`  PACKET_EXIT=0   ✓
    (a)+(c) ONE mutex-held run of BOTH focused suites (acquired after 0 polls):
        npx vitest run --pool=threads --maxWorkers=2 \
          tests/domain/districtProfile.test.js tests/domain/townCartographyCalibration.test.js
        → `Test Files  2 passed (2)` · `Tests  65 passed (65)` · TRUE_EXIT=0        ✓
        65 = districtProfile **33** + cartography **32**, the receipt's per-file counts.
        ⭐ Collected-test count READ, not inferred from the exit code (the standing law).
    LINE-PIN RE-PROOF (load-bearing; read from the working tree == committed tip):
        arcane pattern live at districtProfile.js:**122**;
          recorded keys in arcaneClassifierCensus.walker.test.js = ["districtProfile.js:122"]  ✓
        prose snippet `High criminal opportunity (${crimScore})...` live at :**373**;
          .prose-numerics-baseline.json row = {"path":"src/domain/districtProfile.js","line":373}  ✓
        lighting census tuple, walker line 6567 (the LIVE row, last of 12 ledger rows):
          `files: 2525, parked: 366, credited: 2159, titles: 21049, suiteTitles: 5852,`  ✓
    (d) edge-shared freshness: `git status` stayed EMPTY across every read above ⇒ nothing
        under supabase/functions/_shared/ is dirty on disk. CONTENT freshness is left to
        the gate's own `*.freshness` + `edgeSharedBundleReproducibility` arms, which are the
        only instruments that see it (LANE-LAW §4: invisible to a targeted suite run).

## RESUME POINT (2026-08-24 ~11:10)
**DONE:** survey + all four spot-verifications, all GREEN.
**IN FLIGHT:** the ONE full gate, launched BARE (never under gate-mutex — self-deadlock),
fresh shell, quiescent tree, tip 233c35a69, mutex confirmed free and disk 19.95 GB seconds
before launch. Log: `/tmp/ch4-gate-session2.log` (TRUE_EXIT + a closing `df -k /` appended
to the same file by the launching shell).
    cd <laneCH4-tree> && npm run check:tail > /tmp/ch4-gate-session2.log 2>&1 ; echo TRUE_EXIT=$?
**GREEN BAR:** TRUE_EXIT=0 AND a `[gate-tail] exit: 0` line AND a collected-test count
(expect ~29,067 = slot 29,051 + this car's **+16** titles; the EXECUTED figure wins) AND
free disk ≥ 300 MB at end. ⛔ The **11 banked failures ARE the frozen census** — not this
car's. Only a failure OUTSIDE that set is red.
**IF IT REDS:** report verbatim and STOP. One quiet re-run ONLY for a TIMEOUT-class stray
under measured load; a second stray is a STOP. Never widen a census/baseline, never add a
DECLARED_OVERRUN row, never raise testTimeout.
**NEXT AFTER GREEN:** nothing but the report. No ref moves.

## ⭐⭐ THE FULL GATE — **GREEN**, FIRST RUN, NO RE-RUN NEEDED (2026-08-24 11:09 → 11:30)
Launched BARE on the quiescent tree at `233c35a69`, 21 min wall. Verbatim verdict lines:

    [gate-tail] start: 11:09  up 20 days, 41 mins, 1 user, load averages: 5.41 48.59 46.69 · cores: 8
    [implementation-packets] valid: 181 packets (0 READY)
    [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
    [domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).
    ✖ 29 problems (0 errors, 29 warnings)                     ← eslint; warnings do not fail
    gate-mutex: acquired atomic lock as PID 9495 after 0 poll(s).
    [test-ratchet] OK — no test regressions (11 known failure(s) of 29067 tests, ceiling 11).
    ✓ built in 25.24s   ·   ✓ 3935 modules transformed.
    [prerender] wrote 314 static route documents (13 views + 15 gallery hubs + 286 compendium entries) under dist/
    gate-mutex: acquired atomic lock as PID 50259 after 0 poll(s).
    [test-ratchet] STRICT DIST OK — 53 discovered/reported file(s), 467 test(s), zero
      failed/non-run/uncollected/missing/extra/duplicate rows.
    [gate-tail] end: 11:30  up 20 days,  1:01, 1 user, load averages: 26.61 50.67 54.53
    [gate-tail] full log: /var/folders/0l/_sz6gzvd11x6sthjy1jdj0_80000gp/T//gate-tail.8720.log
    [gate-tail] exit: 0 (the gate's own status, not a pipe's)
    TRUE_EXIT=0

**GREEN BAR, ALL FOUR MET:** TRUE_EXIT=**0** · `[gate-tail] exit: 0` · collected count
**29,067** READ not inferred · free disk **18 Gi** at end (bar 300 MB).
⭐ **29,067 = slot 29,051 + this car's +16 titles, TO THE DIGIT** — the predicted figure and
the executed figure agree, which independently confirms bill A's re-stamp.
⛔ **11 known failures, ceiling 11 — the FROZEN census, unmoved.** Nothing outside it fired.
I pre-read the roster (`scripts/.test-ratchet-baseline.json`, 11 entries) BEFORE the verdict
so the classification could not be retrofitted: voiceMechanics ×4, enforcement-claims ×1,
metronomeCooldownLint ×1, clampPrimitiveBaseline ×1, warCostKindPools ×3, warRulingKindPools ×1.
**Disjoint from this car's whole surface** — no districtProfile, cartography, arcane, prose,
lighting or edge-shared arm is in the banked set, so none of the 11 can be masking this car.

**THE EDGE-BUNDLE BILL IS DISCHARGED — the only instrument that sees it says so.** The six
arms (3 `*.freshness` + 3 `edgeSharedBundleReproducibility`) live inside `test:ratchet`'s
vitest run; they are OUTSIDE the banked 11, so a green ratchet IS their pass. The predecessor's
fresh regen at the rebased tip holds.

**POST-GATE STATE:** HEAD still `233c35a69`, `git status --porcelain` still EMPTY, both mutex
lock dirs released. The gate's writes (dist/, sitemap, prerender) left the tree clean.
Full log PRESERVED against TMPDIR reaping →
`receipts/ch4-gate-session2-FULL.log` (97,237 B, sha256 be9b24216d6d9698…2e09f7d8).

**REFS: I MOVED NONE.** `wip-ch4` is the chair's to place, at `233c35a69`.

## JUDGMENT CALLS THIS SESSION (three, all small, all recorded to be vetoed)
1. **Ran the two focused suites in ONE mutex-held vitest invocation** rather than two.
   Same evidence, one lock acquisition, and the 65 collected splits unambiguously as the
   predecessor's own per-file counts 33 + 32. Cheaper and no weaker.
2. **Did not run `npm run build:edge-shared` as a freshness probe.** The brief said not to;
   I additionally confirmed the reasoning holds — running it would have WRITTEN five sidecars
   into a tree I was about to gate, i.e. manufactured the exact "edit during an in-flight
   gate" contamination LANE-LAW §2 forbids. Freshness was left to the gate's own six arms.
3. **Classified the eslint `✖ 29 problems (0 errors, 29 warnings)` as a pass, not a red.**
   The `&&` chain advanced past `lint` to `test:ratchet`, which is executed proof that eslint
   exited 0; the count is warnings-only and none of the named files is this car's.

## ⚠ ONE OBSERVATION FOR THE CHAIR — THE LANE LAW'S EXPORTED LOCK PATH IS NOT THE DEFAULT
`scripts/gate-mutex.sh:21` reads
`LOCK_DIR="${GATE_MUTEX_LOCK_DIR:-${TMPDIR:-/tmp}/settlementforge-vitest-gate.lock}"`.
A BARE `npm run check:tail` does not export the variable, so its internal `test:ratchet` and
`verify:dist` locked **`$TMPDIR/settlementforge-vitest-gate.lock`**, while LANE-LAW §2 has lanes
export **`/tmp/settlementforge-vitest-gate.lock`** for targeted runs. **These are two different
dirs and they do not mutually exclude.** It cost this lane nothing — `ps` showed no sibling — but
a lane polling `/tmp/...` before its own bare gate reads FREE while a sibling's bare gate is
mid-`test:ratchet`, and the sibling's holder is invisible to it. This is a fresh instance of the
recorded "never key a stale-lock rule to a remembered pid" family: here the wrong thing is the
**path**, not the pid. Suggested cure: have lanes export nothing for the bare gate and read BOTH
dirs when polling, or set `GATE_MUTEX_LOCK_DIR` in the repo's own env so one path governs.
⚠ Note `$TMPDIR` is per-user and REAPED — which is also why the full log was copied out.
