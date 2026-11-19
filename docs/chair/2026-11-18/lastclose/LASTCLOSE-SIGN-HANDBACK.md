# LASTCLOSE-SIGN · hand-back (the golden door's seat of the last close of 2026-11-18, then the figures that count the tree; kept current in every push)

Branch `lane/lastclose-sign-2026-11-18`, BASE **cc11c950479e218c08f47462978a1d538d26c3fe** (`lane/landing-pieces-2026-11-18` at that
commit, points 54 to 70).

AUTHORITY: the owner's word in the chair's chat, about 19:07 UTC 2026-11-18, **"Yes to both"** (the refresh of the stored reference
files again, and the golden door's signing), for this last close only. Nothing is written through the golden door before the chair's
line "SIGN".

STATUS: **PART B DONE (the chair's line SIGN, 2026-11-19 01:04 UTC, announced in the owner's chat under "Yes to both"); PART C waits for the chair's merge of LASTCLOSE-DOORS. Earlier: nothing written through the door. The draft record is committed for the chair's read:
[`docs/shift-records/2026-11-18-the-last-close-points-54-to-70.json`](../../../shift-records/2026-11-18-the-last-close-points-54-to-70.json).**

## THE MEASURE BEFORE ANY WRITE (Part A; scratch probes only, every run to a file; nothing committed but this file and the draft)

THE BASE OF THE MEASURE: **0dee69e17** (the first close's tip, the first parent of point 54). It reproduces all 525 stored golden
hashes, the fence's committed `cd67a3c1…` and all 1,050 rows of the dossier prose manifest; the four fixtures are byte-equal from
it to cc11c9504. Each corpus was born at 0dee69e17, at each of the seventeen first-parent landing commits that touch `src/`, and at
the base, hashed whole and by leaf family (array indices folded), so each row is laid to the step that moved it.

| surface | at the base | by landed point (each equal to its seat's declared count) | unexplained |
|---|---|---|---|
| THE GOLDEN (525) | **222 move** (thorp 12, hamlet 12, village 48, town 101, city 25, metropolis 24) | 54 J-INCOME-2 36 (`incomeSources[].desc`) · 48/49/57 K-WATCH 93 (`guardEffectivenessDesc`) + K-POWERS 36 (`factions[].desc` 24, `recentConflict` 12) · 50/58 K-PEOPLE 16 (ties 7, goals 9) · 61 FAULTS-NEED 13 (goals, the 13 it names) · 62 FAULTS-PEOPLE 48 (`presentation.behaviour`) · 66 FAULTS-WATCH 3 (gate text 2, holding cells 1) · 67 FR25 3 (ties; prominent tie 1) · 68 FR24 36 (`resourceAnalysis.imports` 36, `.gaps` 12) · 69 LAST-DECLARE 3 (sawyer's secret) · 70 LAST-VARIETY 13 (goals; the same 13 rows as 61) · 55, 56, 51/52/59, 60, 63, 64, 65: 0 | **none** (union 222; no person, house, tie or name in or out; only `imports.critical` and `gaps` change length) |
| THE FENCE (360) | **116 move** (thorp 11, hamlet 12, village 32, town 28, city 21, metropolis 12) | 48/49/57 20 (`recentConflict` 11 with `pressureSentence` 9, the same sentence; `factions[].desc` 9) · 50/58 42 · 56 3 (salted fish imports) · 61 12 · 62 2 (hooks) · 63 17 · 64 0 · 65 9 (`institutions[].desc`) · 66 10 · 67 11 · 68 22 · 69 9 · 70 12 | **none** |
| THE DOSSIER PROSE MANIFEST (1,050) | drift arm **832 rows** (416 configs × 2; 73,800 cells, none in or out); provenance arm red (the recorder moved: DESKS-2 A2, 95ffd9734) | 51/52/59 510 (DS-POW-5 council 426, DS-ECO-8 POOR 94, DS-DEF-2 8, DS-ECO-12 6) · 64 54 (its declared 54) · 68 24 (DS-ECO-12 follows the need list point 68 declares) · 70 432 (DS-DEF-3 Moderate v5 → new v9) | **none** |
| THE HERALD DESK | `scripts/audit/herald-stage.mjs` at the base writes the committed fixture byte for byte (475 rows) | — | not re-recorded |

### The pins that read the golden, at the base (each file alone through `sh scripts/gate-tail.sh npx vitest run <file>`, one log a file)

48 test files: those that name a golden surface or its corpus (`grep -rl` over `tests/`), plus `x46NpcBand`, `institutionBudgetPromise`,
`editWorldFactResources`: **29 green; 19 red, every red classed (C1)**:

| file · arm | the red | class · cause | whose |
|---|---|---|---|
| `generatorGoldenMaster` | 222 rows (vitest agrees with the probe) | (a): above | THE DOOR (B1) |
| `espionageDormancyFence` THE DRIVEN GOLDEN (20 of 21 green: CL5 holds) | the corpus moved | (a): above | THE DOOR (B2) |
| `dossierProseManifest` drift arm, provenance arm (18 of 20 green; the mixed-pool audience arm green) | 832 rows; the recorder's sha | (a): above | THE DOOR (B3) |
| `dmLayerGoldenIsolation` A7 | 222 | (a): reads the committed golden | cleared by B1, nothing of its own |
| `pipelinePinnedMode` A1, A2, A5 · `pipelinePinnedChoosers` A1 · `nameHeldThroughAssembly` A1 · `powerEconomyFreshness` A4 · `rosterFinalUnderHeldRoster` A1 | the same 18 sampled rows | (a): read the committed golden; no in-file figure | cleared by B1 |
| `worldFactRederive` A7 | its stride misses the old manifest (2 rows) | (a): reads the committed golden; then its two dated sha lines (the golden's, the prose manifest's) | this seat, after B1 and B3 |
| `generationForkCensus` A1 | `GOLDEN_CONTROL_HASH` 8bb20e96… (the control row `town\|germanic\|plains\|road\|civilized\|golden-master-v3`) | (a): the row moves at point 48/49/57 only (K-WATCH's gate line, `guardEffectivenessDesc`) | this seat; **A3e and A4 of the SAME FILE (the fork register 77 → 78) are LASTCLOSE-DOORS's: C6, named to the chair** |
| `editWorldFactResources` A2, A6 | row 21 (the same control row); rows 0, 42 unmoved | (a): point 48/49/57 | this seat, by the file's plant (the pre-EM-B2b2 step over a scratch copy) |
| `x46NpcBand` the dark arm | 23 of 60 | (a): by the file's own loop per landing step: 56:1 · 48/49/57:1 · 50/58:7 · 61:6 · 65:3 · 66:1 · 67:1 · 68:3 · 69:2 · 70:6 (61 and 70 the same six) | this seat |
| `institutionBudgetPromise` BEFORE | 34 of 60 | (a): the same, the factor forced to 1.0: 48/49/57:12 · 50/58:13 · 61:4 · 62:5 · 63:11 · 65:5 · 66:2 · 68:10 · 69:4 · 70:4; no step that declares no record move moves one | this seat |
| `editCorpusRatchet` A7 (7 of 8 green, A5 in 561 s) | E6 2176 → 2179 (E1 695, E5 275 unmoved) | (a): a count over the 63-row corpus, ACCUMULATED over points 54 to 70 (the re-dealt readings E6 reaches), not bisected by point (one run is 561 s), as the first close recorded its own | this seat |
| `sourceCitationIntegrity.walker` archival roster | tree 185 → 186 | (a): THIS SEAT'S OWN DRAFT RECORD (the readers ran at 3b9340d92) | this seat, with B1 |
| `engineBundleReplay` (3 arms) | the committed bundle's birth | (a): a tree-counting figure | this seat, PART C |
| `sovereigntyLightingContract.walker` the estate's file count | 3682 → 3699 | (a): a tree-counting figure | this seat, PART C |
| `proseWiringCensus.walker` (4 arms: 3054 variants, the stamp, 48 withdrawn) | the census | (a): points 61, 64, 70 | LASTCLOSE-DOORS's, not this seat's |

The 60-seed probes (`x46NpcBand`'s loop and `institutionBudgetPromise`'s, verbatim, in scratch test files under each scratch
worktree) reproduce both stored figures at 0dee69e17 (0 of 60 differ each).

## QUESTIONS FOR THE CHAIR (Part A)

- **C6, ONE FILE, TWO SEATS:** `tests/generators/generationForkCensus.test.js` holds A1's `GOLDEN_CONTROL_HASH` (the golden's control
  row: this seat's pin) and A3e/A4 (the fork register 77 → 78: LASTCLOSE-DOORS's share by the brief). Proposed: this seat writes
  only the `GOLDEN_CONTROL_HASH` line and its dated note, after the chair has merged LASTCLOSE-DOORS (or DOORS writes it from this
  seat's measured value). The chair's call.
- The herald desk does not move (the base writes its fixture byte for byte): it is NOT in the draft record.

## PART B · THE FAMILIES THROUGH THE DOOR (each door's exact command; each commit's receipt alone)

The chair's line **SIGN** came at 01:04 UTC on 2026-11-19 (announced in the owner's chat under "Yes to both"), with its C6 ruling: this
seat writes only `GOLDEN_CONTROL_HASH` and its note in `generationForkCensus.test.js` (LASTCLOSE-DOORS's 77 → 78 went to
`src/domain/generation/generationForkRegistry.js` and its contract test, 6cf4c4107). The record carries the line (1b2cb89f4).
Commit trailer `Owner-Signed: §934.105` on the signed-door commits.

| # | surface · pin | door (exact) | predicted | held | commit | receipt alone |
|---|---|---|---|---|---|---|
| B1 | the generator golden master | `GOLDEN_SHIFT_SIGNED=docs/shift-records/2026-11-18-the-last-close-points-54-to-70.json UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js`; the SHIFT RECORD row | 525 rows (222 moved) | 222; byte-equal to the probe (0 of 525 differ); d08ae44c… → 079bfce6… | a7a25bd39 | 3/3; goldenFreeze.walker 90/90 |
| B1c | `generationForkCensus` A1 `GOLDEN_CONTROL_HASH` | the file's form: a dated line (only this line, the chair's C6 ruling) | 8bb20e96 → 71ea4d5f | as predicted | e13d47f58 | A1 green; A3e, A4 red until the chair's merge of LASTCLOSE-DOORS (its register) |
| B1c | `sourceCitationIntegrity.walker` archival tree count | header and baseline | 185 → 186 (this record) | as predicted | 2d4d20dad | 18/18 |
| B1c | `worldFactRederive` A7, the golden's file sha | a dated line | d08ae44c → 079bfce6 | as predicted | b565c802c | 7/7 |
| B2 | the espionage fence's driven golden | `node scripts/audit/refence.mjs . --produce <scratch> --header <block>`; `GOLDEN_SHIFT_SIGNED=<record> node scripts/audit/door-write.mjs --surface espionage-dormancy-fence --from <scratch>` (exit 3, by design) | 1 (the fence file) | 116 of 360; cd67a3c1… → 9829e655… (the probe's); the 116th movement block; the written file byte-equal to the produced | bb20e743d | 21/21; espionageMissionDormancyFence 20/20, faithFieldDormancyFence 13/13, faithWitnessSource 35/35; goldenFreeze.walker 90/90 |
| B3 | the dossier prose manifest | `GOLDEN_SHIFT_SIGNED=<record> node scripts/prose-manifest-cells.mjs --record` | 2 | 832 of 1,050 moved, 0 differ from the probe; b0ec7651… → e4f5a46b… | e74a9cce6 | dossierProseManifest **20/20** (the mixed-pool audience arm green); bandLadders 8/8, institutionDestroyedByKind 7/7, institutionRename 6/6, ruinInstitution 7/7; goldenFreeze.walker 90/90 |
| B3c | `worldFactRederive` A7, the prose manifest's file sha | a dated line | b0ec7651 → e4f5a46b | as predicted | 45d093049 | 7/7 |
| B4 | `x46NpcBand` dark digests (`tests/fixtures/x46-npc-band-dark-digests.json`) | the file's own loop (an untracked probe, removed after), twice at the tip, equal to the step probe; the fixture in the probe's own form (byte-equal at 0dee69e17); a dated note | 23 moved | 23 of 60 | 4bd82db5d | 24/24 |
| B5 | `institutionBudgetPromise` BEFORE | the same, the factor forced to 1.0; the budget module untouched since 0dee69e17 | 34 moved | 34 of 60 | c9a0b1c14 | 1/1 |
| B6 | `editCorpusRatchet` A7 | an in-file figure, a dated note (accumulated) | [695, 275, 2176] → [695, 275, 2179] | as predicted; the ride-along it masked holds | (the commit after 478ffbc4c) | 8/8 (556 s) |
| B7 | `editWorldFactResources` PRE_CHANGE (A2, A6) | the same plant: the live `resolveResources.js` less EM-B2b2's 31 lines (and the blank before them), sha256 adfd3ba4…, over a detached worktree at c9a0b1c14; the live step twice; all six equal; A2/A6 green at 0dee69e17 against the stored six | row 21 (2 digests) | derived 8bb20e96 → 71ea4d5f (the new control), replay 93cd0cbe → c45eaea5; rows 0, 42 unmoved | 478ffbc4c | 6/6 |

NOT RE-TAKEN BY THIS SEAT (named): the herald desk (unmoved); `composeStateProse` "variants" 3033 → 3054 and
`dossierStateProseProjection.contract`'s four arms (the wiring census, the variant counts) — LASTCLOSE-DOORS's; `proseWiringCensus.walker`
(LASTCLOSE-DOORS's); `engineBundleReplay` and the estate's file count (this seat's PART C).
