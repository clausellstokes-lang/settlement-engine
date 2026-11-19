# LASTCLOSE-DOORS — hand-back

Seat LASTCLOSE-DOORS of the last close before the deploy (2026-11-18/19), under the owner's word "Yes to both"
(2026-11-18, about 19:07 UTC). Lane `lane/lastclose-doors-2026-11-18`.
Base: `cc11c950479e218c08f47462978a1d538d26c3fe` (the first close, the five pieces, the faults round and the last small
round; points 54 to 70). Rules: C1 to C8 and C10 of `docs/chair/2026-11-18/close/BRIEF-CLOSE.md`, C9 replaced by
`docs/chair/2026-11-18/lastclose/BRIEF-LASTCLOSE.md`.

The base list was run in a detached worktree pinned at the base (`git worktree add --detach … cc11c9504`, the build of the
base copied in), with the JSON reporter, each directory through `sh scripts/gate-tail.sh`: `tests/lint`, `tests/joins`,
`tests/data`, `tests/architecture`, `tests/property`, `tests/build` (VERIFY_DIST=1, after one `npm run build`) and
`tests/domain/supplyStoryLaw.test.js`.

## 1 · THE RE-TAKES (C3): one row a figure

| file | reading test | old → new | door (verbatim) | cause |
|---|---|---|---|---|
| `docs/content/wiring-census.json` | proseWiringCensus (holder census, committed-current), dossierStateProseProjection (projector `--check`), wiringCensusDeclared | variants 3033 → 3054; producerIndexFiles 1429 → 1435; the stamp of `defenseStateProse.js`; 14 rows' mark histograms | `node scripts/wiring-census.mjs` then `--check` ("verified 861 pools / 3054 variants / 169 relation rows") | DESKS-ECO/-DEF/-2 (points 51/52/59) +9 lines; FAULTS-NEED (61) +1; FAULTS-DESKS (64) +1; LAST-VARIETY (70) +10; the stamp: FAULTS-WATCH item 5 (66, bf776cf28) |
| `docs/content/prose-shift-register.json` | dossierStateProseProjection SEAM car 4 | variant-count 3033 → 3054 + per-pool digest; face-count 3033 → 3054 + digest; vids digest | by hand in the register's own form (the row edited, a dated note, the prior note kept) | the same 21 lines, measured per pool and by vid against 0dee69e17: additions only, every new line the next vid, none renumbered or reworded |
| `tests/lint/proseComposed.walker.test.js` | GUARD THE GUARD; A0b | corpus 3033 → 3054; `OVER_CLAIM_BASE` 45 → 18 (a shrink) | the pin's own dated note | the 21 lines; over-claims read 19 = 18 + 1 OWED since FAULTS-TOOLS's matcher repair (60, d489df0a8, CL25) |
| `tests/lint/proseEntryContradiction.walker.test.js` | the corpus loaders; the anti-vacuity guard | loaders 3501 → 3522; joined rows and leaf lines 2794 → 2814; trailing-coordinate class 377 → 379 | the pins' own dated notes | the 21 lines (causal leaf 468 held); DS-GEN-3 Import-Dependent v7 joins no annex row by text (as v6); the class: DS-DEF-3 Moderate v10, Very Safe v7 (70) |
| `tests/lint/proseMoveGrammar.walker.test.js` | CONTROL 4, both halves | repeated openers 157 → 159; share 0.182 → 0.185; the arm's figure 146 → 148 | the pins' own dated notes (PM1's form) | DS-ECO-12 CRITICAL IMPORT v4, DS-POW-5 FLAG: merchantArmy v3 (51/52/59); uniform pools held at 578 |
| `tests/lint/proseWaveGate.walker.test.js` | ONE UNIT BUILDER | units 658 → 673 | the pin's own dated note | the defense section's 15 new lines (52/59 +4, 64 +1, 70 +10) |
| `tests/lint/proseWiringCensus.walker.test.js` | TOTALITY; car 0f | variants 3033 → 3054 (pin, histogram sum, per-block roll-up); mean 3.52 → 3.55; the pool-size histogram (twelve pools grew, none added); docblock reports 46 → 48 | the pins' own dated notes | the 21 lines; the two docblocks: `defenseStateProse.js:718`'s comment (FAULTS-WATCH item 5, 66), as its landing row declared |
| `tests/lint/presumedThings.widened.register.json` | presumedThings.walker ARM 1, ARM 3 | banked 4629 → 4635; strips 107 → 108 | by hand with the register's own functions, `docs/chair/2026-11-18/lastclose/tools/lastclose-presumed.mjs` (refuses unless the fresh hits are exactly the seven); new reason `after-base: lastclose-true` quoting each guarantee | the ruled ones: proof (iii): "court or gaol" (the atom's own name, 64); Moderate v10 and Unsafe v4 "no gaol" (each declares `no court or gaol`; 70, 64); the three Fish market cards' "market" (by the pool's key; 65). FR16: `needNotBroughtIn.js :: filterDeclared(…)` banked `not-a-draw`, as tradeListDisplay.js's same site (61) |
| `scripts/census/pool-dominance.register.json` | poolDominance.walker | three rows: `SUPPLY.want.short`, `SUPPLY.want.long` (70), `ORIGIN_DECLARED` (69), each top1 1 / top5 1 / 1 line; census header re-taken | the door's own `bankNew` narrowed to the three, `docs/chair/2026-11-18/lastclose/tools/lastclose-pooldom.mjs` (refuses unless the unregistered pools are exactly the base's six); NOT `--bank-new` | the last small round's new pools; after: "0 over, 3 unregistered (the base's three), 0 stale, 0 loose" |
| `tests/lint/presumptionClasses.register.json` | presumptionClasses.walker (no stale row) | 1789 → 1785 rows (ceiling) | `node scripts/presumption-classes-door.mjs --shrink` | cured lines: the fish market's three "the day's catch" lines declare `excludes: fish bought in` (65); the Elected Reeve's "under noble oversight" stands only in its noble branch (48/49/57) |
| `src/domain/generation/generationForkRegistry.js` (a generated literal) | generationForkRegistry.contract A2, A3s; generationForkCensus A3e, A4 | 77 → 78 rows: `assembleSettlement|institutions|mutates`, pure, same/same | pasted word for word from generationForkCensus A4's printed fresh literal (it differs in that row only), with a dated comment | FAULTS-ROWS (65, FR14): the late re-read's correction in place |
| `tests/lint/generationForkRegistry.contract.test.js` | A2, A3s | denominator 77 → 78; mutates-only 21 → 22; entropy pure 49 → 50; FINAL and POST-STEP tallies same +1 each (disagreements unmoved, 14) | the pins' own dated notes | the same row |
| `tests/lint/heldKeyWriterCensus.walker.test.js` | A2 | step roster 14 → 15 | DEBT-2 D2's row form | the same write; a held roster is never rewritten by the call's own gate (`assembleSettlement.js:457`, `chooseOrPin(pins, 'institutions') === UNPINNED`), read in the source, not re-measured on the 526 |
| `tests/joins/mutationOrder.test.js` | the canonical institution chain | + `assembleSettlement`, last | the canonical list, with a dated comment | the same declaration (65) |
| `tests/lint/.tuning-inventory.json` | tuningRegister.walker (exact tree) | `ALLEGIANCE_TUNING` dependents + `src/generators/power/factionStanding.js`; two goals.js table lines 68 → 69, 93 → 94 | `TUNING_INVENTORY_REFREEZE='LASTCLOSE-DOORS' TUNING_INVENTORY_NOTE='…' npx vitest run tests/lint/tuningRegister.walker.test.js` (fails by design), then the proof run 76/76 | K-POWERS (48/49/57); LAST-VARIETY (70). No tuning value moved |
| `tests/domain/supplyStoryLaw.test.js` | L5 | the venture floor 10 → 9 | the arm's floor with its dated cause (FR17) | FAULTS-BIRTH (63): the venture's pick read once and the second ring; ventures 11 → 9 (9 at the base); the odds stay |
| `.github/workflows/ci.yml` (its own commit, b5dcc371b; the push was ACCEPTED) | ciCheckParity, soakRegister (green) | Coverage floors' `timeout-minutes` 45 → 60 | the file's own rule (the longest concluded run × 1.5, up to the next 15) with a dated note | 30m38s at 19b67557d (run 44295605654) × 1.5 = 45m57s |
| `scripts/.observed-shape-readers-baseline.json` + the instrument (CL26) | observedShapeReaders.walker (3 arms); observedShapeBaseline/Migration/Sentinel | schema 44 → 45; reads 2200 → 2214, identities 1542 → 1552; bank 78/52 unchanged | act 1 (a83749b35): the rung in rungs 43/44's form; act 2 (3914d0b79): `--scan-only --scan-mode=legacy-leaf`, `migrate --target-schema=45 --review-template`, the review `docs/chair/2026-11-18/lastclose/osr-rung45-last-close-review.json` (built by `tools/osr-rung45-review-builder.py`, which refuses unless exact; negative control refused), `--review --bundle`, `--write --migrate-schema=45` | 10 new identities and 1 increased (2 -> 4 reads, CL20's row 12); 14 reads admitted; none gone (the migration report: same 1541, increased 1, new 10, gone 0, decreased 0; 1541 + 1 = 1542 old identities, + 10 = 1552): CL20's table (W 6, of which `_userEdits on settlement` is the increased row; C 4) and `name on factions` in `personHooks.js` (FAULTS-PEOPLE, 62, class C); the two N reads were struck by CLOSE-SWEEP. No defect. (Corrected 2026-11-19 on the chair's question: this row first read "11 identities, all new".) |
| `scripts/.writer-reach-baseline.json` | writerReach.walker (its own arms) | cohort 1387 → 1385; judged 12728 → 12726, dark 1427 → 1425, reviewable 400 → 399; shapesDigest 25b8a553… → a6c67e26…; detectorDigest, verdictDigest, closureSizes, scanStats and surfaceReach re-derived (the first-missing `resourceActive on activeChains` back in place) | `node scripts/check-writer-reach.mjs --write` (shrink-only) | the two banked dark identities no longer written, `animal hides on reasons` and `livestock on reasons` (FAULTS-BIRTH's follow-ups, point 68: imports' reasons re-read); the corpus's shapes (points 54 to 70; the digest moved first at 63, 25b8a553 → bd73f89e, then on); detectorDigest by act 1's bump of `observed-shape-baseline.mjs`, one of its six sources. No growth: "0 registered rows now lit", no new dark identity. writerReach.walker 52/52, no pin moved |
| `src/domain/facts/tradeAtWork.js` (comment only, C5) | — | header (b) "LEFT BY NAME … reads the STORED chain status" → "CURED (LAST-DECLARE item 3, LR5) … reads the status the card SHOWS" | Edit | point 69 |

KNOWN-WRONG WORDING, CARRIED TO THE NEXT RUNG (the chair's ruling (a), 2026-11-19; no rung for wording alone): the phrase "eleven new reads" / "11 identities, all new" stands in governed detector sources the register binds by digest (a comment edit there reds observedShapeReaders.walker's live-estate arm, measured): `scripts/migrate-observed-shape-readers.mjs`'s `LAST_CLOSE_TARGET_SCHEMA` comment (and its header's schema list), `scripts/check-observed-shape-readers.mjs` :314 and the register's `_doc` string (baselineOf), and `scripts/lib/observed-shape-baseline.mjs`'s header. The true figure: 10 new identities and 1 increased (2 -> 4 reads, CL20's row 12); 14 reads admitted; none gone. The act-1 and act-2 commit messages say the same old phrase and stay as they are (no history rewritten).

## 2 · THE CLASS OF EVERY RED OF THE LIST AT THE BASE (C1)

Base reds by name: `tests/lint` 35 tests in 21 files + 1 file that could not load; `tests/joins` 1; `tests/data` 5 (2 files);
`tests/architecture` 0; `tests/property` 6 (5 files); `tests/build` 9 (4 files); supplyStoryLaw 1.

- **(a) a stored figure moved by landed work, re-taken (§1):** generationForkRegistry.contract A2; heldKeyWriterCensus A2;
  observedShapeReaders.walker ×3 (CL26); poolDominance (its three of six; see §3); presumedThings ×2; presumptionClasses;
  proseComposed GUARD THE GUARD; proseEntryContradiction ×3; proseMoveGrammar ×2; proseWaveGate; proseWiringCensus ×4;
  tuningRegister; wiringCensusDeclared; writerReach.walker ×7; tests/joins mutationOrder; dossierStateProseProjection ×4;
  supplyStoryLaw L5.
- **(b) a stale anchor, re-keyed by identity:** `tests/data/tailHouses1Gaps` (3 of 19), THE READER'S RED: the Dairy farmer
  of r2r-hamlet-56 and r2r-hamlet-27 and the Tannery of r2s-plague_onset-village-2 no longer lack their input (measured:
  each town keeps a Common grazing land and `resourceAnalysis.gaps` holds no row for the house); point 68's declared
  move (FR21/FR23: the common proves its pasture; hides read their grounds). The claim stands: no town of the 720 or the
  150 holds either house with its gap `missing` (scanned whole), so, as the file's own TAIL-HOUSES-5 did, each pair names
  an r2r- town beyond them that prints the same two texts with the gap: r2r-hamlet-1944, r2r-hamlet-714,
  r2r-village-1472 (6,200 seeds scanned). Shown red once in scratch (texts swapped: 3 of 19), then restored. A LOW for the
  chair, no fault of this test: the three old towns still print the hedged draw-time text "whenever livestock/hides can
  be had" beside a common that now proves the pasture.
- **(c) a fault:** none found.
- **(d) the machine's own:** `tests/lint/ledgerCitationIntegrity.test.js` could not load: the checkout had no local ref
  `refs/heads/review-fixes-2026-07-08`. With the read-only ledger branch fetched to that ref: 10/10.
- **LEFT, NOT MINE, BY NAME (the golden door, LASTCLOSE-SIGN's):** `tests/property/generatorGoldenMaster` (222 rows),
  `espionageDormancyFence` (the driven golden), `dossierProseManifest` ×2 (drift, provenance), `dmLayerGoldenIsolation`
  A7 (reads the golden), `editCorpusRatchet` A7 ([695, 275, 2176] → [695, 275, 2179]; the first close gave it the
  golden seat); outside my list, `tests/generators/generationForkCensus` A1 (the golden control row's hash).
- **LEFT, NOT MINE, BY NAME (the tree-counting figures, last, LASTCLOSE-SIGN's):** `tests/lint/mutationCoverageManifest`
  TOTALITY; `sovereigntyLightingContract` (the estate's file count 3682 → 3699 at the base; my commits add files too);
  `proseCorpusBytes` RAW ×4 and GZIP (the prose byte ratchet: read as "the byte ceilings" of both prompts; the chair may
  rule it mine, see §3); `tests/build/engineBundleReplay` ×3, `engineServiceCore` (the committed engine bundle),
  `generationWorkerLazy` (worker 2,579,708 against 2,525,028: +54,680), `vendorPdfLazy` ×4 (engine chunk 909,927 against
  904,174; first paint raw 1,175,492 / 1,163,565, gzip 373,991 / 370,414, Brotli 313,957 / 310,664).

## 3 · ROWS FOR THE CHAIR (C4: only the chair banks them)

1. **Pool dominance, the base's three unregistered pools** (NOT banked; `--bank-new` would bank them), each with the door's
   own figure at the higher of the two corpora: `ledger:institutionDescVariants:DESC_VARIANT_SIBLINGS` top1 0.9916 / top5 1,
   2 lines, 3,411 draws (one line prints 99 % of the time); `ledger:safetyProfile:STANDARD_PATROL` 0.2984 / 1, 4 lines
   (K-WATCH-2, points 48/49/57, named at its landing); `ledger:trade-list:imports` 0.1344 / 0.5724, 15 lines. The lawful
   cure the walker names: a row each with its reason, the chair's.
2. **proseComposed A0b, the SHRINK-ONLY under-claims: 2103 against the ceiling 2097 (+6, none gone)**, measured line by line
   at 0dee69e17 and the base: DS-POW-5 FLAG: merchantArmy v3 +3 and DS-ECO-12 CRITICAL IMPORT v4 +2 (new lines of
   points 51/52/59); DS-GEN-13 WAREHOUSES v5 +1 (an old line: FAULTS-TOOLS's matcher, point 60, no longer credits it with
   the `{settlement}` name slot). The cure the file names: an OWED row (as CL14 let the first close do) or the lines
   reworded. LEFT RED.
3. **`proseCorpusBytes`** (RAW ×4 exact, GZIP band, the defense leaf): both prompts give "the size and byte ceilings" to
   LASTCLOSE-SIGN; if the chair reads the prose byte ratchet as a door of mine, it is one run.

### 3a · THE CHAIR'S RULINGS ON §3 (2026-11-19, after 242fc592b), each written, a commit an item

| item | the ruling | written | commit |
|---|---|---|---|
| 1 · pool dominance, the base's three | bank each by its OWN row, never `--bank-new` at large, with the chair's reasons | the door's `bankNew` narrowed to exactly the three (`tools/lastclose-pooldom-base3.mjs`, refuses otherwise): DESC_VARIANT_SIBLINGS 0.9916 / 1, 2 lines; STANDARD_PATROL 0.2984 / 1, 4 lines; trade-list:imports 0.1344 / 0.5724, 15 lines. poolDominance.walker 17/17 | b0fc8eb2c |
| 2 · proseComposed A0b, +6 under-claims | ONE OWED row in CL14's form; no line reworded before the deploy; the six on the post-deploy list | `UNDER_CLAIM_OWED` 815 → 821 with its dated row naming each line and cause; `UNDER_CLAIM_BASE` 1282 untouched. NOTE: the arm's ceiling is computed as BASE + OWED, so it now reads 2103 (= the measured tally); the shrink-only base did not move. proseComposed.walker 87/87 | (the commit before b0fc8eb2c) |
| 3 · proseCorpusBytes | the prose byte ratchet is a door figure, this seat's | four declared rows chained from the committed figures, each landing's delta read: defense 281298 → 287394 (51/52/59 +1742, 64 +558, 70 +3796), economy 195233 → 196627 (51/52/59 +905, 61 +489), general 306982 → 307568 (51/52/59 +586), power 135398 → 136414 (51/52/59 +1016); gzip moved with them; every leaf under its ceilings. proseCorpusBytes 18/18 | (two before b0fc8eb2c) |

THE POST-DEPLOY LIST (by the chair's rulings): DESC_VARIANT_SIBLINGS' variety (one line 99 %); the six under-claim lines
(DS-POW-5 merchantArmy v3, DS-ECO-12 CRITICAL IMPORT v4, DS-GEN-13 WAREHOUSES v5); this seat's LOW: the three old
towns' hedged "whenever livestock/hides can be had" (r2r-hamlet-56, r2r-hamlet-27 Dairy farmer; r2s-plague_onset-village-2
Tannery) beside a common that now proves the pasture.

After the rulings, `tests/lint` at this branch is red only on LASTCLOSE-SIGN's tree counts (mutationCoverageManifest
TOTALITY, sovereigntyLightingContract's file count).

## 4 · THE NET (C7), at 40ecbd681 (the tree of every re-take; this commit adds only this file)

The whole list again at the tip, after one fresh `npm run build`, each directory through `sh scripts/gate-tail.sh`, the
JSON reporter to files, nothing else running (the same script as the base run):

| | base cc11c9504 | tip |
|---|---|---|
| `tests/lint` | 35 red tests in 21 files + 1 file that could not load | **6 red, 3 files + the 3 below**: mutationCoverageManifest TOTALITY (the same 11 files by name at both), sovereigntyLightingContract (the same message: 3699 against 3682), proseCorpusBytes ×2 (the same messages), poolDominance (6 → 3: the base's three, §3), proseComposed A0b (2103 against 2097, §3). NONE NEW; every message of the six read at both |
| `tests/joins` | 1 | 0 (425/425) |
| `tests/data` | 5 | 0 (575/575) |
| `tests/architecture` | 0 | 0 (347/347) |
| `tests/property` | 6 | the same 6 (LASTCLOSE-SIGN's golden door) |
| `tests/build` (VERIFY_DIST=1) | 9 | the same 9 (LASTCLOSE-SIGN's: the committed engine bundle and the size ceilings; the figures unmoved by this seat) |
| `tests/domain/supplyStoryLaw.test.js` | 1 | 0 (11/11) |

- Every cleared test was also run alone, green at its commit (each commit message names the run): tailHouses1Gaps 2/2,
  presumedThings.walker 43/43, dossierStateProseProjection.contract 79/79, the six prose walkers (108/108 after the
  pins), presumptionClasses.walker 16/16, generationForkRegistry.contract 3/3 (generationForkCensus 6/7, A1 SIGN's),
  heldKeyWriterCensus.walker 7/7, mutationOrder, supplyStoryLaw L5, tuningRegister.walker 76/76,
  ledgerCitationIntegrity 10/10 (with the ref), observedShapeReaders.walker 47/47, the instrument's three files 120/120,
  writerReach.walker 52/52, ciCheckParity + soakRegister 15/15. Each was red at the base (the tables of §2), but
  ciCheckParity and soakRegister (green at both; they read the cap).
- `tests/lint` by message at base and tip: above. Files this seat ADDS (they move the estate's counts, LASTCLOSE-SIGN's, re-taken
  last): `docs/chair/2026-11-18/lastclose/LASTCLOSE-DOORS-HANDBACK.md`, `osr-rung45-last-close-review.json`,
  `tools/lastclose-presumed.mjs`, `tools/lastclose-pooldom.mjs`, `tools/osr-rung45-review-builder.py`; no test file added.
- Both type gates: `typecheck:ratchet` exit 0 (167, ceiling 167); `typecheck:domain:strict` exit 0 (1113, ceiling 1113).
- `npx eslint` on the 18 JS files this seat changed (outside `docs/`): exit 0.
- Every push ran its hooks (the lane's three fast gates); all accepted, the workflow file's included.

## 5 · WHAT I LEFT, BY NAME

- The reds of §2's two LEFT lists (LASTCLOSE-SIGN's) and §3 (the chair's).
- Scratch only, never committed: the base worktree (`/tmp/claude-0/basewt`), the first-close worktree (`/tmp/claude-0/closewt`),
  the probes and the OSR artifacts under `/tmp/claude-0/`.

## 6 · THE WHOLE CHECK'S FOLLOW-UP (the chair's message of 2026-11-19 04:21 UTC; merged f1d139667 first, a fast-forward)

| red at c02735d57 | class | proof | cure (one commit each) |
|---|---|---|---|
| `tests/domain/composeStateProse.test.js` "variants: expected 3054 to be 3033" | (a) | the same 21 lines re-taken everywhere else at this close (points 51/52/59 +9, 61 +1, 64 +1, 70 +10) | the pin 3033 → 3054 in the file's form |
| `tests/domain/display/needMetUnderAnotherName.test.js` "expected [] to include 'mountain_timber'" | (b) | r2r-village-3's need is TRULY met: point 63's second ring (5eb9f6add; measured at its parent: iron only and the need; at the merge: managed_forest proven and no need) proves its forest by its Woodcutter's camp; the Resources tab prints it, the camp tells a local story, no house is short, `imports.critical` no longer names mountain timber | re-keyed by identity to r2r-village-20 (a village, no crisis; one of the 720's four that still print it needed; no import meets it under any name); red in scratch on the old anchor |
| `tests/pdf/pdf2ReadsTheTabs.test.jsx` negatives "a proven ground: expected ['grazing_land']" | (b) | on r2r-village-0 and bar0-village-calm-rand-28 the PDF's `nearbyProven` and the tab's `impliedGroundsOnPage().there` print the same `grazing_land`, kept by a live Common grazing land (`groundsKeptOf`): point 68 (FR23), true and agreed | re-keyed to r2r-village-15 and bar0-village-calm-rand-30 (the lowest of 9 and 8 villages that print none of the faults), in CENSUS/WIDE and NEGATIVES; the file 9/9 |
| the six durations | — | — | five take `}, 120_000); // its own budget, … N s here under load` (populationBandRoll 14.1, moneyChangersTownFloor 12.3, distribution 11.0, pipeline.property 10.6, outlookIssuesSayTheWorld 10.1); the sixth, economicsFoodStores "the stores sentence has one writer", ALREADY carries `}, 120000);` (since TRIM-2 R3, 04a46ec49): unchanged |

Each file alone green; eslint clean on each; `sovereigntyLightingContract.walker` once at the end: 34/34 (no move).
