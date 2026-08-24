# DW-0 lane receipt — dwellings-program charter compile

STARTED 2026-08-24T07:29Z. Lane DW-0 (compile lane, no engine code changes).
Disk at start: 19,281,956 KB free on / — well over the 2 GB floor.
Worktree: scratchpad/laneDW0-tree at slot 79b78881c.

## RESUME POINT (07:29Z)
- DONE: LANE-LAW read; disk checked; worktree being created.
- NEXT: read SIGNED-BANDS-2026-08-23.md, then R-INST-6 Sigma.2 from
  `git show 029268fe5:<path>` in refs/preserve/research-dossiers-2026-08-23.
- Exact next command:
  `cd /Users/cstokes/Desktop/settlement-engine && git ls-tree -r --name-only 029268fe5 | grep -i inst`

## RESUME POINT (07:45Z)
- DONE: worktree + node_modules link; SIGNED-BANDS read; R-INST-6 §Σ.1–§Σ.5 read (16 gaps E1–E16,
  28-row verdict table 3B/1B+H/13H/11N, UC seam table); R-INST-5 §Σ.2 (G1–G8, 14 grammar requests
  R1–R14), §1.4, §15.2, §Σ.3 (32-row verdict table) read.
- FLAGGED ALREADY: brief says "seven engine defects G1–G7"; dossier §Σ.2 header says "six DEFECTS"
  and the list runs G1..G8. Three different counts. Also brief says "five charter findings";
  R-INST-5 §1 is "the seven anchor findings".
- NEXT: the seven §L ledgers, then CHARTER.md + ARCH.md structure.

## ⚠ CHAIR RULING RECEIVED (mid-lane) — CH-3 RUNS CONCURRENT WITH THIS COMPILE
Chair ruled the pickup card over CATALOG-HYGIENE-PLAN line 5; DW-0 proceeds. CH-3 has NOT landed
and will change live catalog data under me. Confirmed incoming changes:
  (a) `exclusiveGroup: 'religiousCenter'` deleted from the two city rows -> re-rolls the whole
      city/metropolis institutional roster: 81 of 420 settlements change, ~130 institution names move.
  (b) 26 redundant `minTier` declarations deleted.
  (c) UI catalog readers gain a `minTier` filter -> UI-visible set == generator-eligible set at
      every tier; 10 city rows the generator could never produce vanish from the UI.
STANDING RULE FOR THIS CHARTER: no live-catalog roster count, institution frequency, or UI-visible
set may be hardened. Each is cited PROVISIONAL-ON-CH3 with the dependency named. Dossier-derived
figures are preferred because the dossiers are frozen at 029268fe5.
DIRECT COLLISIONS I must call out in the charter:
  - R-INST-5 G2 (four `high magic` rows carry minTier metropolis inside the city block) and
    R-INST-6 D6-1 (`Smuggling network` village L865 carries minTier city) ARE members of CH-3's
    "26 redundant minTier declarations" class. G2/D6-1 may be wholly or partly absorbed by CH-3.
  - CH-3 change (c) is the CURE for G2's visible half; the four rows are candidates for the
    "10 city rows that vanish from the UI".

## RESUME POINT (08:20Z)
- DONE: all seven dossiers' §Σ + ledgers read; draft charter (237,547 B) + architecture (141,659 B)
  read to outline + all load-bearing sections; engine probes executed (powerStrata, PLAN_UNIT,
  entitlementLadder, enforcement-claims CLAIM_RE, docCounts).
- KEY ENGINE FINDS (executed, this lane):
  * `entitlementLadder.js:135-139` exports `VIEWING_PAYWALLS_PENDING_514` — THREE `axis:'viewing'`
    rows still claim a paywall (map-chains, change-view, fog-table). SHRINK-ONLY BY TEST: a fourth
    viewing row claiming a paywall reds the walker. This is the B16b collision, already recorded
    at ODQ §514.1b. DW inherits it and may not add a fourth.
  * the de-advertised `interiors` row: InteriorView.jsx is prop-mounted, store-free, imported by
    NOTHING in product — "UNGATED and UNSHIPPED". Directly relevant to DW-7a.
  * `PLAN_UNIT_CM_BY_TIER` confirmed at compileTownSceneManifest.js:99-108, read at :286.
  * powerStrata.js doc comment confirms coupContenders EXCLUDES the governing seat AND CRIMINAL
    factions -> the signed §519 carve-out for criminal fronts is true by construction.
  * CLAIM_RE for docs/**.md is at tests/docs/enforcement-claims.test.js:39. Avoided the vocabulary.
- NEXT: write docs/DW0-CHARTER-COMPILED.md in the worktree.

## COMPLETE — 2026-08-24T08:50Z

**Deliverable:** `docs/DW0-CHARTER-COMPILED.md`, 716 lines / 71,864 B, in the lane worktree.
**Commit (lane worktree, detached HEAD off 79b78881c):** `7c3377cd4b3c7ef749006416d82395d7e4f5ccfb`
**Engine bytes written: ZERO.** No packet minted. No push. No branch touched.
Worktree clean apart from the `node_modules` symlink, which survived the commit.
Disk at close: 17,901,964 KB free.

### VERBATIM GATE LINES
Run 1, WITH the new document (`tests/docs/enforcement-claims.test.js` + `tests/docs/docCounts.test.js`):
```
 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 39 passed (40)
```
The single failure lists SIX naked claims, none of them in the new file:
`docs/FABLE_VALIDATION_QUEUE.md:179` (machine-enforced) · `:3017` · `:3886` · `:5663` (0 problems)
· `docs/GOLDEN_SHIFT_LEDGER.md:2128` (machine-enforced)
· `docs/implementation/packets/foreign-policy/IN-0C.md:484` (machine-enforced).

Run 2, DIFFERENTIAL with the document moved out of the tree:
```
EXIT_WITHOUT=1
docs/FABLE_VALIDATION_QUEUE.md:179
docs/FABLE_VALIDATION_QUEUE.md:3017
docs/FABLE_VALIDATION_QUEUE.md:3886
docs/FABLE_VALIDATION_QUEUE.md:5663
docs/GOLDEN_SHIFT_LEDGER.md:2128
docs/implementation/packets/foreign-policy/IN-0C.md:484
```
IDENTICAL six, identical exit. **The red is pre-existing, not mine.**

CONFIRMED BANKED: `scripts/.test-ratchet-baseline.json:41-45` holds this exact test with the cause
"A completeness claim in docs/FABLE_VALIDATION_QUEUE.md:179 (the R-BLD-10 chair ruling row) carries
no resolvable @enforced-by target". It is one of the 11 banked failures. **The baseline does not move.**

Independent CLAIM_RE scan over the new file with the exact regex from
`tests/docs/enforcement-claims.test.js:39`: **CLAIM_RE_HITS=0**.
`tests/docs/docCounts.test.js` passed; it pins no doc-file count, so a new `docs/*.md` adds no debt.

### CENSUS DELTA
**ZERO.** No test file created, no test title added, no `package.json` byte changed.
The doc is the only artefact. No ratchet moves.

### SELF-CAUGHT DEFECT
An internal cross-reference audit found THREE dangling conflict ids in my own first draft
(C-13→C-12, C-14→C-13, and C-16 which pointed at no row at all → C-14). All three corrected and
re-audited: 10 inline refs, all resolving into the 15-row table. This is the same class the draft's
own AR-8 caught with its 648-reference sweep.

## ⛔ SKEPTIC PANEL — DOCKET RECEIVED, INDEPENDENTLY VERIFIED (2026-08-24 ~09:40Z)
Worktree deps REBUILT with `npm ci` (exit 0); the shared-node_modules symlink is GONE.

I re-measured every load-bearing docket claim myself rather than accepting it. ALL SOUND:
- `git merge-base 029268fe5 79b78881c` -> EXIT 1, no output. **ORPHAN REF CONFIRMED.**
- All six cars ANCESTOR of 79b78881c: CG-1 d78011665 · CG-1b 3e9d2d888 · CH-1 b2852ccc3 ·
  CH-2A 17fe89763 · UC-5 f4df874ce · MP-1 9e5059cec.
- **UC-5 EXISTS: 28,261 B.** Header carries "ONE PRODUCER PER JOIN".
  `CONNECTION_CLASSES = ['NATIVE','ADJACENCY_BREACH','FUNDED_LINK']`; the
  ADJACENCY_BREACH/SHARED_QUARTER_WITH_MOTIVE return is real. **My charter asserted its
  non-existence THREE times in the present tense and pinned it with a grep arm.** Worst error.
- **MP-1 EXISTS: 9,141 B.** Header states the DW contract verbatim incl. "the RETURN SHAPES
  below do not move" and "`PropertyLine.ownerRef` joins to a POWER".
- `interiorEdits.js` (10,238 B) three laws confirmed at :11/:14/:18-20, incl. EDITS-DELTA
  "DROPS the dangling ones (never a throw, never a ghost)".
- `prosperityScore` 3 regexes + `return 0.5`; PROSPERITY_TIERS has 7 rungs; **TWO fall through
  — `Subsistence` AND `Moderate`** (my charter said only Moderate). Docket right, I was short.
- `ownerRef` namespace collision: **17 src / 11 test files** — matches the docket exactly.
- `(high magic)` returns **3** rows (2192/2201/2210); the 4th is `Dragon resident`.
- CLAIM_RE is at enforcement-claims.test.js:**40**, not :39 as I cited.
- draft carries **AR-13**; my §A stopped at AR-12.

### TWO PLACES I MEASURED THE DOCKET AS UNDERSTATED
1. **B10's path is wrong but the blocker is sound.** The artifact is
   `src/domain/compendium/generated/compendiumData.generated.js`, NOT `src/data/...`.
   Verified: `roomKinds` has exactly **28** members and contains BOTH `stall` and `dais`;
   byte-identity pin at compendiumDataFreshness.test.js:33.
2. **B11 is bigger than 15.** Measured over the draft's own §2.2/§2.4/§2.5 spans:
   **15 CELL x STORAGE** collisions (incl. `muniment`, which the docket missed) PLUS
   **5 CELL x CIRCULATION** (`ground, lobby, parade, porch, yard`) = **20 distinct names**.
   The docket's `porch` is a circulation collision, not a storage one.

### AND ONE ERROR OF MY OWN THE PANEL DID NOT CATCH
My 8-file ESTATE lit fence has BOTH a phantom AND a miss. `git grep -ln townCartographyEnabled
79b78881c -- tests` returns 11 paths / **9 .test.js**. `townCartographyDeterminism.test.js` —
which I named — does **NOT** reference the flag. `townCartographyProperty.test.js` — which I
omitted — does. The count 8 survives by coincidence; the membership is wrong in both directions.

## SECOND PASS COMPLETE — 2026-08-24 ~10:20Z

**Commit:** `96e021b0bddd49c2f95e4baf78413815654b6815` (lane worktree, detached off 79b78881c).
**Document:** 1,043 lines / 116,581 B (was 716 / 71,864). +409 / -82.
Engine bytes: ZERO. No packet. No push. No branch touched. Worktree clean.

### PRE-COMMIT HOOK ACTUALLY RAN THIS TIME
`npm ci` installed the husky shim, so the commit was NOT the silent-bypass case LANE-LAW warns of.
Hook output: "lint-staged could not find any staged files matching configured tasks" (markdown is
not linted), so nothing was re-staged. **Re-proved AT THE COMMITTED TIP anyway**, per the standing
hazard that an `eslint --fix` re-stage makes `git diff HEAD` blind:
  worktree 1043/116581 == committed 1043/116581 · `git diff HEAD` EMPTY · CLAIM_RE_HITS_AT_TIP=0.

### VERBATIM GATE LINES (pass 2, with the repaired document)
```
TRUE_EXIT=1
 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 39 passed (40)
```
Naked claims, all six pre-existing, NONE in my file:
`docs/FABLE_VALIDATION_QUEUE.md:179 · :3017 · :3886 · :5663` ·
`docs/GOLDEN_SHIFT_LEDGER.md:2128` · `docs/implementation/packets/foreign-policy/IN-0C.md:484`.
Citations of `DW0-CHARTER-COMPILED` in the failure output: **0**.
Identical to the pass-1 differential; the test is BANKED at
`scripts/.test-ratchet-baseline.json:41-45`. Baseline does not move. Census delta: ZERO.

### BLOCKERS CLOSED: 14 of 14. DISPUTED: 0.
B1 §F.0 landed table + standing absence rule · B2 three UC-5 assertions struck, honesty clause and
its grep arm DELETED, E7 re-dispositioned as DISCHARGED, D-6 flagged homeless · B3 MP-1 named,
DW-6d re-cut as consumer · B4 PlanDelta ruled into the sidecar family + KEY-NAMING TRAP + undo
flagged · B5 the ten uncarried R/E items given a three-column table · B6 EST-5 re-blocked on CH-4,
flag home split to urbanFabricEnabled · B7 above-block class split + the permanent DW-R2 rule ·
B8 census ruled to the architecture (30) · B9 DW-1a/1b serialized (D6) · B10 compendium artifact +
declared shift · B11 the collision check made a pre-DW-1 gate · B12 A1-A9 restored, A7 re-spec'd
to §517.5 · B13 tolerance/sub-form pins + AR-13 · B14 the band closure table.
All 18 fix-and-proceed amendments folded. Chair's §541 (CH-5 Shape F, CH-6 ARCANE_INST_KW) folded
into G3's disposition.

### RULINGS I STILL NEED FROM THE CHAIR
R1/O2 the Estate anchor (owner-gated, recommendation: split anchor from relation) · C-17 `ring
table` · C-19 the DW-2b tolerance number · C-20 D-6's new home · C-21 get draft-AD-CHARTER.md into
a preserve ref · C-22 who mints `interiorKind` · O4 B4's prosperity repair (tuning signature).

## THIRD PASS — CHAIR RULINGS IMPLEMENTED + FOUR ANSWERS (2026-08-24 ~11:30Z)
**Commit `93b47f6198...`** (lane worktree). 1,085 lines / 125,907 B. Re-proved at the tip:
`git diff HEAD` empty, tip bytes == worktree bytes, CLAIM_RE hits 0, bold balanced (1936, even),
conflict ids C-1..C-25 all resolve. Gate: 39/40, the banked red only, 0 citations of my file.

IMPLEMENTED: R1 anchor approved (heldBy may be POWER | non-power institution | ANONYMOUS_FABRIC;
persisted TYPE stays owner-gated O2) · ownerRef -> **heldBy** rename with the mandatory
collision-avoidance sentence · C-21 closed at refs/preserve/ad-charter-2026-08-24 (f23e7978e) ·
holding ref refs/preserve/holding-dw0-repaired recorded · packet count 176 (175 hardened nowhere).

### TWO NEW DECAYED CLAIMS FOUND WHILE ANSWERING THE FOUR QUESTIONS
- **C-24: CH-1 shipped the \b-anchoring and NOT the `interiorKind` override.** Measured: 0
  occurrences in institutionalCatalog.js and cohesionWeave.js; CH-1's landing commit touched 4
  files (3 docs + 1 walker test). The draft's §0.6 and BOTH my earlier passes said DW "reads
  interiorKind where declared". There is nothing declared. **Same decay class as UC-5, INVERTED:**
  the dossier described work that had not landed yet rather than an absence since filled.
- **C-25: the 60-fixture list claims to be "the tranches' union, de-duplicated" and is not.**
  On R-INST-5's best-sourced passage, 8 of 21 carried / 13 missing. Broad sweep: 57 of 363 tokens
  carried (84% miss) — flagged in the charter as a SIGNAL not 306 defects, since some tokens are
  buckets/variants. **The non-arguable defect: DW-5d's arm is `furnaces <= flues +
  portableFurnaces` and `portable furnace` is NOT a fixture kind.**

### THE FOUR ANSWERS (recommendation first, all measured)
- C-17 -> SUPERSEDED by C-25; do not add ring table alone.
- C-19 -> ZERO tolerance; require the lattice. Neither engine precedent fits (withinWard `<=1` is
  point containment; SURFACE_DEPTH_TOLERANCE_CM=600 is 3-D depth).
- C-20 -> DW-1d + a separate `SURFACE_JOINT_KINDS`, respectfully NOT DW-1a. jointVocabulary.js is
  undercity-owned, minted by UC-0, 6 consumers all undercity; a joint is circulation, not a cell.
- C-22 -> SPLIT. INTERIOR_KINDS is at interiorTemplates.js:29, already DW's file (fold into
  DW-1a). The per-row declaration is a catalog `facets` key = CH's. J-CH-1's hand-back is only
  half-executable by DW.

## ⭐ LANE DW-0 CLOSED — 2026-08-24 ~12:10Z

**FINAL SHA: `8e8489bcce0ebd53448f32e6a5e98c7f79b94ff4`** (lane worktree, detached).
Document: `docs/DW0-CHARTER-COMPILED.md`, 1,102 lines / 129,030 B.
Four passes: 7c3377cd4 -> 96e021b0b -> 93b47f619 -> **8e8489bcc**.

**NOT LANDED, and proved so:** `git merge-base --is-ancestor` says NOT on
review-fixes-2026-07-08, NOT on master, NOT on claude/composite-r4; the file is MISS on all three.
`git branch --contains` shows only "* (no branch)" — the detached-HEAD marker, not a branch.
R2 (the landing path) is the chair's, once CH-3 and CG-2 are through the gate.
Engine bytes across all four passes: ZERO. No packet. No push.

### CLOSE-OUT CONTENT
- C-20 RULED DW-1d (chair withdrew the DW-1a leaning on my evidence); keeper formulation verbatim.
- C-19 RULED ZERO, **fallback STRUCK** — a lattice failure is a finding, not an epsilon.
- C-22 RULED split; INTERIOR_KINDS -> DW-1a; Warden's Lodge -> CH train; hand-back HALF-EXECUTABLE.
- C-17 RULED no; C-25's re-derivation is a NAMED PRE-DW-1b GATE owned by DW-1b's dispatch, with my
  method + the 8-of-21 / 57-of-363 evidence recorded. 82 PROVISIONAL. 84% stays a SIGNAL.
- **DW-5d arm 4 HELD, not deleted.** The charter now records why the obvious repair is wrong:
  `furnaces <= flues` would INVERT the finding and convict Boerhaave's one-chimney laboratory.
  DW-5d ships FOUR live arms / EIGHT required results until the gate delivers `portable furnace`.
- §543 decay law amended to name BOTH directions (absence since filled / presence never arrived).

### FINAL VERIFICATION (all executed at the tip)
`git diff HEAD` EMPTY · tip bytes == worktree bytes (129,030) · CLAIM_RE hits **0** ·
bold balanced outside code spans (1,976, even) · conflict ids C-1..C-25 all resolve, zero dangling ·
gate `Test Files 1 failed | 1 passed (2)` / `Tests 1 failed | 39 passed (40)`, the failure being the
BANKED enforcement-claims red naming six pre-existing claims in three other files, **0 citations of
this document** · disk 14,808,240 KB free.
Census delta: **ZERO** across all four passes (no test file, no title, no package.json byte).

### STANDING FACTS FOR THE SUCCESSOR
- Preserve refs: research `refs/preserve/research-dossiers-2026-08-23` (029268fe5, ORPHAN) ·
  AD charter `refs/preserve/ad-charter-2026-08-24` (f23e7978e) ·
  first pass `refs/preserve/holding-dw0` · repaired `refs/preserve/holding-dw0-repaired` (96e021b0b).
- Packet count **176**, not 175.
- Six cars landed between the research bundle and the slot; §F.0 of the charter is the table.
