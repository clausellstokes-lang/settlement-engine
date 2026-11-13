# COHERENCE-UPKEEP: the hand-back (the fourth seat, COHERENCE-UPKEEP-4, 2026-11-13)

**The lane:** `lane/coherence-upkeep-2026-11-12`. The tip is the commit that adds the edge bundles (the last commit, alone); read it back from the remote. **An independent reviewer reads the whole lane next.** The third seat's record and the first two seats' are kept below this section, unchanged.

**Base for every measure below: AGREE's final tip `faa20bc6c` itself** (the agreement lane without this lane). **Tip:** `6f95af557`; the lane's `src/` is final there, and every later commit is docs, one test-free census file, or the bundles. **Corpora:** the 660 (the 360 `agree-<tier>-<i>`, 60 thorps, 60 hamlets, 180 forced births of famine, war and siege), the golden master's 525, and the espionage fence's 360. **The harness** (it births the corpora in both trees and takes every figure) is `docs/chair/2026-11-13/probes/UPKEEP-4/` (`dump.mjs`, `measures.mjs`, `fielddiff.py`, with a README). The field diff is `UPKEEP-FIELD-DIFF.json`; the draft record is `docs/chair/2026-11-11/UPKEEP-shift-record.DRAFT.json`.

## ⚠ FOR THE REVIEWER: condition (d) was RESTATED BY THE CHAIR at this seat's stop

Read it as a ruling, not as silence. **The stop (2026-11-13):** agree-city-38's criminal capture moved none → equilibrium, toward danger, while its readiness ROSE 45 → 56. That breaks (d) as the third seat held it.

**The chair's ruling:** declare it, and go on. (d) now reads: a flag toward danger where readiness did not fall is accepted ONLY when it is traced, town by town, to a change of council membership that the lane's own declared chain causes, and in at most 3 of the 660. A fourth such town, or one that cannot be traced, is a STOP.

**At this tip: 1 town (agree-city-38). The trace:**
1. The gates go to the identity at Comfortable (0.84/0.88/0.86/0.78/0.82 → 1).
2. Readiness 45 → 56 (Defensible → Well-Defended).
3. Legitimacy 58 → 65 (Tolerated → Approved).
4. The council's power 28 → 31.
5. The roster swaps Religious Authorities (10) for Merchant Guilds (9).
6. npc_merchant_guilds_15_40 takes the Merchant Guilds' rank 1 and leaves the council's rank 2.
7. castPowers re-ranks the council: npc_city_granaries, who carries a covert retainer to "Multiple criminal factions", takes rank 3.
8. `hallCapture.js :: hallCaptureOf`'s agent rung reads equilibrium.

**No person is re-dealt, shown by diff:** the 42 cards' ids, names and personalities are equal, and the granaries' allegiance is the same object at the base and at the tip.

## What this seat did, in commit order

| Commit | What |
|---|---|
| 5e10fd07f | **Merge AGREE's final tip faa20bc6c.** Under `src/`, both sides touched two files since AGREE's line merge: `economicState.js` (both composed: the two end-of-file imports, `keep.js` and `chainYield.js`) and `holderTable.js` (no conflict). The census5b test composed: AGREE's narrowed `twinAnswersOnItsKey`, asked by the lane's `malformedRows`, with an original's crisis disjunction carried as one atom on its needs side. The mutation manifest keeps both sides' rows. The wiring census was re-taken by its writer. The lighting census and the bundles take AGREE's side (re-taken below, and last). |
| 00fc0d9ce | **P6** (red first at the merge): `garrison` on the garrison purse set and its crisis set; `mercenary` on the two hired-only purse sets (the mercenary lead is their twin) and the hired-only crisis set. `declaredSet` / `crisisSet` take `shared` atoms that both lines need. `MERCENARY_LEAD` is read off its set. No line moves (the guard-line births: 139 on the 660 and 96 golden, the third seat's figures). |
| fbdae5389 | **P1:** the gate fixtures re-keyed by identity to the label. Struggling against Prosperous over the same buildings, and the climb 10/30/50/80 as Struggling/Poor/Moderate/Comfortable, profiled as the pipeline profiles. The palisade pin moves to defense-hamlet-13 (Struggling, its one defence "Palisade or earthworks"); defense-thorp-3 is Comfortable now. Green 33/33. **The plant** (`keepOf` → identity) reds 10. |
| 6f95af557 | The lighting census through its door (files 3219 → 3221, titles 29225 → 29245). |
| 462ad5d3b | The draft record and the field diff re-taken; the harness committed as a probe. |
| c950cc823 | The page count: the census counter at both trees (below). |

**L1 at every `src/` commit:** domain-strict 1113 = ceiling; typecheck ratchet 167 = ceiling; eslint clean on the touched files. **The push gates** (c950cc823): ratchet 167 = 167, strict 1113 = 1113, lint 0 errors (37 warnings), all exit 0.

## Calls taken without the chair (they only declare or name)

1. **The census5b composition** at the merge: the lane's crisis lines are keyed on one crisis atom, so `malformedRows` hands AGREE's narrowed rule the original's crisis disjunction as one atom on its needs side.
2. **P6's reach:** `mercenary` is also declared on the hired-only crisis set, so the short purse line declares the company in both sets it stands in. `MERCENARY_LEAD` is read off its declared set instead of spelled again. Without that, the constant stayed an undeclared literal.
3. **P1's reach:** the green fixtures that drive a gate through the economy are re-keyed too: the two climbs, the floors, the thorp and the hamlet. At the identity they passed with no gate biting, so they no longer held their claim.
4. **Two people-paths, new to the declared list, declared in the record:**
   - `npcs[].allegiance`. On the 660, a covert allegiance's `power` moves for 25 cards and its `handler` for 33, in the 5 roster-changed births. 0 allegiances are gained or lost, and 0 houses, vectors or vias move. Both are draw-free functions of the roster by design (`allegiance.js :: allegiancePowerFor`, `assignHandlers`). Golden and fence: index order only.
   - `factions[].modifiers`, index order only.
5. **A slip, reported:** in the scratch worktree I ran `git stash` once by mistake. It held my own two uncommitted P5 edits. I popped it at once, and the stash list is empty, as it was before. Nothing else was touched.

## Parked (each would bank a baseline upward or touch a ruled door)

| # | Item | Recommendation |
|---|---|---|
| P5 | It cannot land as ruled. The door (`npm run gen:dossier-prose`: 169 pairs, 0 joining rows) and the four places green the contract test only after one more pin (the one-endpoint row count 10 → 11, by identity: `econOutput|economicGates.military` became `fundedGate|…` and `upkeep|…`). The regenerated file then reds two pins outside the ruling. **`proseComposed.walker.test.js:215`** pins the leaf's count, 165: a fifth place, with the same cause. **`proseCorpusBytes.test.js` RAW:** the leaf grows 28249 → 28926 raw bytes, and that ratchet's door appends a declared row and moves the number up. That is a baseline banked upward, which is barred to the lane. The built patch is `docs/chair/2026-11-13/probes/UPKEEP-4/P5-built.patch`. | The chair rules the byte row (+677 bytes, cause 07ebe8bdc: the gates' new inputs). Then P5 lands in one commit: the door, six places, and that row. |
| pool | `ledger:NPC_STRUCTURE.magic__contested__dominant` is stale on the composed tree. AGREE banked it through `--bank-new` (a62d984e1) when its re-deal first drew the pool; the composed corpus does not draw it. Its only removal door is `--tighten`. | Name it for the merge point beside `SAFETY_LINE_SIBLINGS`. |

## The measures (base faa20bc6c, tip 6f95af557)

**Readiness, the one-band law (HARD):** **0** places more than one band from base, on the 660 and on the golden 525.
- Labels moved: the 660 131 (the 360 84, thorps and hamlets 9, forced 38); golden 63.
- By stress and distance: {"360|random|-1": 25, "360|random|+1": 59, "small|random|-1": 7, "small|random|+1": 2, "forced|famine|-1": 18, "forced|famine|+1": 1, "forced|wartime|-1": 6, "forced|wartime|+1": 5, "forced|under_siege|-1": 5, "forced|under_siege|+1": 3}.
- Golden: −1 61, +1 2.

**The top two bands on the 360:**
- **Entries 24, against the line of 25.** Exits 5.
- Well-Defended+Fortress 37.8% → 43.1% (+5.3). Declared under the restated line; the entering and exiting towns are listed in the draft.

**Prosperity, food band, safety label:** 0 moves on both corpora.

**Services:**
- **0 rows added. 0 institutions newly empty:** 1218 at both, of a roster of 23548 on the 660.
- Rows removed: 981 on the 660 (313 births), 336 golden.
- **Healing by band, the 660:**
  - Struggling 1034 → 927 (−10.3%)
  - Poor 468 → 428 (−8.5%)
  - Moderate 472 → 439 (−7.0%)
  - Comfortable 747 → 729 (−2.4%)
  - Prosperous 709 → 709
  - Wealthy 274 → 274
- **Healing by band, golden:**
  - Struggling 156 → 120 (−23.1%, under the STOP at 25)
  - Poor 647 → 574 (−11.3%)
  - Moderate 203 → 190 (−6.4%)
  - Comfortable and Prosperous unmoved
- **Criminal rows: none rises** on either corpus (the 660: 371 → 368, 160 → 157, 197 → 195, 451 → 450, 304 → 304, 99 → 99).

**Magic:** every band moves one step down, all in Struggling or Poor places.
- The 660: 328 bands. Poor|broad→common 27, Poor|common→moderate 7, Poor|limited→rare 25, Poor|moderate→limited 46, Poor|pervasive→broad 6; Struggling|broad→common 49, Struggling|common→moderate 17, Struggling|limited→rare 47, Struggling|moderate→limited 81, Struggling|pervasive→broad 23.
- Golden: 250 bands. Poor|moderate→limited 179, Poor|common→moderate 11, Struggling|moderate→limited 60.

**Stores:**
- Months fall in 477 births of the 660 and 328 golden; **rise 0**.
- **The 660's crossings: 57, 0 toward more.**
  - By direction: seasonal→minimal 35, strategic→buffer 19, buffer→seasonal 3.
  - By cohort and stress: 360 21, small 3, famine 9, wartime 5, siege 19.
  - By tier: village 26, city 18, town 7, hamlet 4, thorp 1, metropolis 1.
- Golden: 60 crossings, 0 toward more.
- The famine births are listed in the draft; each keeps its food band.

**The hired counterfactual:** 9 hired-only places, **every one at or under its watch**. Hired vs watch:

| Place | Label | Hired | Watch |
|---|---|---|---|
| agree-village-28 | Struggling | 13 | 15 |
| agree-village-30 | Comfortable | 30 | 30 |
| agree-village-40 | Poor | 23 | 28 |
| agree-village-43 | Poor | 51 | 51 |
| agree-village-45 | Poor | 76 | 76 |
| agree-hamlet-5 | Poor | 29 | 32 |
| agree-hamlet-8 | Moderate | 28 | 29 |
| agree-hamlet-38 | Moderate | 34 | 34 |
| agree-force-wartime-village-7 | Struggling | 23 | 26 |

**The page:** under famine or siege on the 660, 31 births print a crisis line and 0 a purse line. Golden: 23 food-capped births keep the purse line (the third seat's 19, with AGREE's final base re-dealing five forest metropolises in and one out; the same rule, keys in the draft).

## The legitimacy chain, conditions (a) to (g)

- **(a)** The field diff, base → tip:
  - Golden 507 of 525 (145 paths).
  - The 660: 594 (232 paths).
  - The fence: 346 of 360 (198 paths).
  - Every path is in a declared family.
- **(b)** Declared with counts in the draft:
  - Legitimacy score: golden 63, the 660 115.
  - Defence term: 63 / 129.
  - Multipliers: 11 / 29.
  - Labels and flags, with their directions.
  - Governance fractured: 0 / 4, each where readiness fell.
  - Faction power: 11 / 29.
  - Roster changed: 0 / 9.
  - Relationships: 11 / 16.
  - The people: goals 85 cards in 11 births / 572 cards in 19 births, every one where a power moved; memberships 0 / 182 cards in exactly the 9 roster-changed births; allegiance as above.
  - Relationship prose: 11 / 20.
  - Condition severity: 46 / 42.
  - Stores held: 0 / 4.
- **(c) The sign:** 0 exceptions (63 golden moves, 115 on the 660).
- **(d)**
  - Who governs: **0**.
  - A danger flag where readiness did not fall: **0**.
  - The largest flag move: isTolerated **16** (line 33).
  - Stability: **0**.
  - **Capture: 5 on the 660, 0 golden.**
    - agree-city-82, agree-city-87 and agree-metropolis-27 move away from danger.
    - agree-force-wartime-metropolis-7 moves toward danger where readiness fell.
    - **agree-city-38 moves toward danger where readiness rose: RULED (above), 1 of the restated 3.**
- **(e) NO PERSON RE-DEALT:** by person id on all three corpora, 0 people added, removed or renamed and 0 personality changes.
- **(f) The receipt:** evidence moves in 4 births of the 660 (agree-city-38, -40, -43, agree-force-wartime-city-4); **0 status changes**.
- **(g)** String roots: one line each in the draft.

**Read by other lanes:**
- `castPowers.js` reads the criminal power's points (moved in 14 of the 660, 11 golden) and the roster (9 of the 660, 0 golden).
- `representatives.js` reads `factions[0]` (by name: 4 of the 660, 0 golden) and the prosperity label (0).

## The page count (the census counter; `docs/chair/2026-11-13/probes/UPKEEP-4/census/`)

`census.sh` was run at faa20bc6c and at 6f95af557 (720 dossiers each), then `compare.mjs`. **No new row.** Three rows rise. **Each is EXPOSURE:**
- the row is old;
- the class table names a later cure for it (row 4: `factionStanding.js`; row 9: `defenseStateProse.js :: beastsRowPoolKey`; NEW-1: `governanceNarrative.js :: deriveBaselineStability`, "after the powers and upkeep lanes merge");
- every entering town is one whose fact this lane changed.

| Row | Base → tip | Entering towns, and the fact the lane moved |
|---|---|---|
| 4 "almost level" vs leader far ahead | 106 → 108 | r2r-town-36 (powers 47/31/22 → 51/26/23), r2r-metropolis-53 (31/18/17 → 33/17/16), r2s-religious_conversion-city-2 (24/18/12 → 28/16/12). r2r-city-26 leaves. |
| 9 Critical over reassuring text | 148 → 149 | r2s-famine-city-0 (monster 43 → 38; readiness Defensible → Lightly Defended) |
| NEW-1 governance vs Defense | 11 → 12 | r2r-village-8 (readiness Defensible → Lightly Defended, 40 → 34) |

Every other row is equal or lower: row 2 571 → 540; row 15 720 → 717.

## The six golden surfaces (each by measure; no door run)

| Surface | Base → tip |
|---|---|
| Generator golden master | 507 of 525 rows move |
| Espionage fence | 346 of 360 move; driven hash 366d5c20 → 7b5e14b0 (banked 38a52b05) |
| Dossier prose manifest | the DRIFT arm 990 → 1024 rows; four-seed total cells 73491 → 73201; mixed-pool 177 = 177 |
| Herald desk | contentSha 02d3fa8e → 919f46cb (banked 0fa1f3ca) |
| PDF golden | `defense.scoreAvg` 41 → 42 (banked 43) |
| Preset-lighting witness | UNMOVED: green at both |

## The repetition guard

`node scripts/census/pool-dominance.mjs` (read-only), 908 pools:
- 0 over;
- 0 unregistered;
- **1 stale** (`NPC_STRUCTURE.magic__contested__dominant`, parked above);
- **1 loose** (`SAFETY_LINE_SIBLINGS` 0.8919 over its measure 0.7281: the merge seat lowers it at the merge point, as ruled).

No `--tighten` was run.

## Rows named for the merge seat

- **P2** `famineStoresOneRounding` (2). Cause: ruling 6. The third seat's values: 6 → 4 months, 12 → 9.
- **P3** `captureBirthScale`. The floor is re-measured on the merged tree; a reading under 360 there is a STOP.
- **P4** `mundaneRealmAcceptance`: services 121/124 → 116/119, ruling 4.
- **The goldens** (above).
- **`generationForkCensus`** A1, A3e, A4: red at the base with identical disagreements (AGREE's).
- **`poolDominance`**: the loose row and the stale row.

## The whole suite

Run once at c950cc823 (the lane before the bundles), 03:20–04:43 UTC, with `npx vitest run --maxWorkers=2 --reporter=json`. Results: 39,032 tests; 38,710 passed, 70 failed, 252 skipped. That makes **75 failing rows**: the 70 failed tests plus 5 files that fail at load (the news pair, proseFamilyContract, observedShapeReaders and writerReach). The class of every row is in `docs/chair/2026-11-13/probes/UPKEEP-4/FAILSET.txt`. The 11 files whose reds are new since the third seat's set were re-run at the base faa20bc6c with the same command.

| Class | Rows | What |
|---|---|---|
| A. Bundles stale against `src/` | 11 | engineBundleReplay ×4, engineServiceCore, engineServiceStoreParity ×3, aiGroundingBundle freshness, edgeSharedBundleReproducibility ×2. Cured by the last commit (below). |
| B. Red at the base faa20bc6c, re-run there | 20 | See the list below. Every message is identical at base and tip, except two figures the lane moves: the DRIFT arm (990 → 1024 rows) and editCorpusRatchet A8 (the witnessed sets [20, 32] → [22, 36], pinned at [20, 36]). |
| C. The lane's, green at the base | 2 | poolDominance's stale row and loose row (see the repetition guard). The removal door for both is `--tighten`, which is the chair's door, so neither was run. Named for the merge seat. |
| D. In the third seat's tip set, classed there | 42 | See the list below. |
| Unclassed | **0** | |

**Class B, the 20 rows:**
- mergeLadderHeldKeys A2, A3, A5, A6;
- recordMerge A6;
- foodModelSingleWriter;
- generationCertificationCorpus;
- generationForkCensus A1, A3e, A4;
- newsHeadlineContract, newsVoiceContract and proseFamilyContract, all three failing at load: AGREE's "line's known set", and proseFamilyContract's load failure is the osr-tier-14 seed;
- dossierProseManifest ×3;
- editCorpusRatchet A4, A6, A7, A8.

**Class D, the 42 rows:**
- the goldens: gm, fence, herald, PDF;
- P2 famineStoresOneRounding ×2, P3 captureBirthScale, P4 mundaneRealmAcceptance;
- P5 dossierStateProseProjection ×2;
- the phone floors ×2;
- pipelinePinnedChoosers A6 and townCartographyCalibration W8: the merge seat's;
- the pin-seam and golden-isolation rows;
- osr-tier-14: observedShapeReaders and writerReach;
- the taste towns ×6;
- siteCoherence C1;
- institutionTable;
- landingFixtureFreshness ×2;
- the other rows red at both in the third seat's set.

**Gone since the third seat (14):**
- P1, cured in fbdae5389: defenseEconomicGate ×8 and defenseWordsFindings;
- presumedThings ARM 1;
- sovereigntyLightingContract, cured in 6f95af557;
- proseComposed A13, proseWaveGate (d) "differ in exactly one way" and statecraftExposureBand: green after the AGREE merge.

## Left

- The edge bundles, the last commit, alone (`npm run build:edge-shared`).

---


# COHERENCE-UPKEEP: the hand-back (the third seat, COHERENCE-UPKEEP-3, 2026-11-12)

**The lane:** `lane/coherence-upkeep-2026-11-12`, base `65ce74ce6`. The tip is the commit that adds this text; read it back from the remote. **An independent reviewer reads the whole lane next.** The first two seats' record is kept below this section, unchanged.

**Base for every measure below:** AGREE's reviewed tip `8866a0ddd` merged with the integration line `3575cf061`, WITHOUT the lane: a scratch tree whose `src/` differs from the tip on exactly the lane's files. **Corpora:** the 660 (the 360 `agree-<tier>-<i>`, 60 thorps, 60 hamlets, 180 forced births of famine, war and siege) and the golden master's 525. The field diff is `UPKEEP-FIELD-DIFF.json`; the draft record is `docs/chair/2026-11-11/UPKEEP-shift-record.DRAFT.json`.

## Calls taken without the chair (the chair's standing rule of 2026-11-12, class (a))

1. **The record after the bundles.** The edge bundles were re-emitted once, alone (828348ba8). The commits after it touch only tests and docs, so the bundles' bytes stay true of the tip (they read `src/` alone).
2. **Two habitat walkers cured in the lane's own pins** (042227874): anchored negatives, and no bare seed loop. The pins assert what they did.
3. **Two typed register rows** (61c8d452e): `keepOf` in the held-key census's DISCOVERY_EXEMPT, and `keep.js` in the prosperity-ladder EXEMPT table. Each carries its reason, and no pin moved.
4. **The observed-shape walker** is classed as equal-failing: it cannot build its corpus at the base either.

## Parked (class (b): each would change a pin, a ruled design's fixture or a declaration rule; sent together with the hand-back)

| # | Item | Recommendation |
|---|---|---|
| P1 | `defenseEconomicGate.test.js` (8) and `defenseWordsFindings.test.js` "a palisade never pays…": fixtures that drive the economy's OUTPUT. The gates read the label now (ruling 3, B; identity at Comfortable and above), so their gates no longer bite (`fundingNote` null; scores equal). | Re-key each fixture by identity to the label (Struggling against Prosperous over the same buildings). Each pin keeps its claim; a seat of this lane does it red-first. |
| P2 | `famineStoresOneRounding.test.js` (2): the soak1k famine granaries read 4 months (6 at base), and the control 9 (12). The cause is ruling 6 (stores at the label's share). | Re-key to the kept months with the cause; the "one rounding" claim is untouched. |
| P3 | `captureBirthScale.test.js`: criminal cities at equilibrium or worse read 369, below the floor 372. The legitimacy chain is declared; the move is away from danger. | Re-measure the floor at the merged tree (a floor is a composed-tree fact, as the ceiling ruling says), by the merge seat. |
| P4 | `mundaneRealmAcceptance.test.js`: the recorded twin census, services 121/124 -> 116/119 (ruling 4). | Re-record the header line and the MG-4 block with the cause. |
| P5 | `dossierStateProseProjection.contract.test.js` (2): `src/data/dossierRelations.generated.js` is stale, and the relations count is 165 -> 169 (the gates' new inputs, 07ebe8bdc: `fundedGate` and `upkeep` replace `econOutput`). | Run its door (`npm run gen:dossier-prose`: 169 pairs, 0 joining rows, measured) and restate the count 165 -> 169 at its four places in the contract test, in one commit. |
| P6 | `presumedThings.walker.test.js` ARM 1 (AGREE's walker, new to the lane at the merge): four lines name the garrison or the hired company without declaring it (the garrison purse line, its twin, its crisis line, and the mercenary lead). | Declaring `garrison` / `mercenary` on an original makes its twin exclude a thing the twin still names, against CENSUS-5b's complement rule. Either the complement rule admits atoms an original and its twin share, or the four take declared rows. This is the chair's rule to make. |

## What this seat did, in commit order

| Commit | What |
|---|---|
| 64c370246 | Merge AGREE's reviewed tip 8866a0ddd: holderTable takes AGREE's symbol cites; economicState composes both sides; the mutation manifest keeps both sides' rows; the wiring census re-taken by its writer. |
| b4e38c922 | Merge the line 3575cf061 (points 44, 45, the hook's lane rule): generated sides only; the edge bundles stay at the line's side until the last commit. |
| 370d18804 | The lighting census refrozen through its door. |
| afadc389e | The tuning inventory refrozen through its door (KEEP_TUNING, Struggling funded 0.3). |
| 02eac6c96 / b4cba2ece | Item 2, red first then cured: under famine or siege the hired purse lines give way to crisis lines ("... paid from what the hunger leaves"), declared on `crisis: famine, under_siege`, each twin the purse line. |
| 944d2d28f / a486e24ec | CENSUS-5b's sibling-set check: a band atom is lawful where a rung of its own ladder admits it (red on the lane since 11662262e, named by no seat until now); the chair's planted controls, a mutant reds both. |
| be4eb0b44 | Two holder-table rows re-cited by symbol (`defenseGenerator.js :: computeDefenseScores`); red since the lane's defence commits. |
| aa5a30899 / a0e404d95 | The fork census re-keyed by identity: A5's second repeated seed `food.cropFortune` [fork,fork] and A6 17 -> 18 (the stores' second call: foodways); A6 18 -> 42 (the services' keep roll, 24 calls on the probe row). |
| 0aec19e77 / 636de2017 | The draft shift record and the field diff; the people family closed on the chair's ruling (A) on (e). |

The pushes ran the hook's three gates (the wrappers are installed in the scratch worktree). **L1 at every `src/` commit:** domain-strict 1113 = ceiling, typecheck ratchet 167 = ceiling (AGREE's inherited errors are gone after the merge), eslint clean on the touched files.

## The measures (the 660 unless named)

- **Readiness, the one-band law:** 0 places more than one band from base, on the 660 and the golden. By stress and distance: {"360|random|-1": 22, "360|random|+1": 56, "forced|famine|-1": 15, "forced|under_siege|-1": 6, "forced|under_siege|+1": 2, "forced|wartime|-1": 6, "forced|wartime|+1": 5, "small|random|-1": 7, "small|random|+1": 2}.
- **The 360:** 78 labels move (56 up, 22 down). Well-Defended+Fortress 36.7% -> 41.9% (+5.3). **Entries** into the top two bands: 23 at the old tip 8a5899204, 23 at the tip (the chair's line: 25). **Exits** 6 and 4. The share past five points is two of the lane's own falls that vanished under AGREE's cures: agree-town-29 and agree-city-26, each Well-Defended at base, Defensible at the old tip, Well-Defended at the tip. Ruled: declared, not a stop.
- **Prosperity, food band, safety label:** 0 moves on both corpora.
- **Services:** rows added 0; institutions newly empty 0 (of a roster of 23560); rows removed 978 in 311 births.
- **Healing by band:** Struggling 1026 -> 918 (-10.5%); Poor 471 -> 431 (-8.5%); Moderate 466 -> 435 (-6.7%); Comfortable 751 -> 734 (-2.3%); Prosperous 706 -> 706 (+0.0%); Wealthy 270 -> 270 (+0.0%).
- **Criminal rows by band (none rises):** Struggling 370 -> 367; Poor 159 -> 156; Moderate 201 -> 199; Comfortable 455 -> 454; Prosperous 299 -> 299; Wealthy 97 -> 97.
- **Magic:** 328 bands, each one step down, all Struggling or Poor: Poor|broad->common 27; Poor|common->moderate 7; Poor|limited->rare 25; Poor|moderate->limited 47; Poor|pervasive->broad 6; Struggling|broad->common 49; Struggling|common->moderate 17; Struggling|limited->rare 46; Struggling|moderate->limited 81; Struggling|pervasive->broad 23.
- **Stores:** months fall in 478 births, rise in 0. Storage-note crossings 57, toward more 0: by direction {"strategic->buffer": 19, "buffer->seasonal": 3, "seasonal->minimal": 35}; by cohort and stress {"forced|famine": 9, "small|random": 3, "forced|under_siege": 19, "forced|wartime": 5, "360|random": 21}; by tier {"town": 7, "village": 26, "metropolis": 1, "hamlet": 4, "thorp": 1, "city": 18}. Golden: 60 crossings, 0 toward more. The forced famine births are listed whole in the measure file; every one keeps its food band.
- **The hired counterfactual:** 9 hired-only places, every one at or under its watch: agree-village-28 (Struggling) 13 vs watch 15; agree-village-30 (Comfortable) 30 vs watch 30; agree-village-40 (Poor) 23 vs watch 28; agree-village-43 (Poor) 51 vs watch 51; agree-village-45 (Poor) 76 vs watch 76; agree-hamlet-5 (Poor) 29 vs watch 32; agree-hamlet-8 (Moderate) 28 vs watch 29; agree-hamlet-38 (Moderate) 34 vs watch 34; agree-force-wartime-village-7 (Struggling) 23 vs watch 26.
- **The page:** under famine or siege 31 births print a crisis line and 0 a purse line. The 19 golden births capped by their food record alone keep the purse line (the chair: their standing, not a crisis); keys in the draft.

## The legitimacy chain (the chair's conditions (a) to (g))

- **(a)** The field diff re-taken at the 0.3 ladder: golden 496 of 525 move (166 paths); the 660, 594 (266 paths); every path in a declared family (0 undeclared).
- **(b)** Declared in the draft with counts on both corpora: legitimacy score 70 / 108, defence term 70 / 119, multipliers 19 / 28, flags, governance fractured 0 / 5, faction power 19 / 28, roster 0 / 6, relationships 19 / 27, the people, relationship prose 19 / 19, condition severity 42 / 42, stores held 0 / 4.
- **(c) The sign:** 0 exceptions.
- **(d) Stops:** who governs 0; a danger flag where readiness did not fall 0; a flag in more than 33 of the 660: none (largest 16); stability 0; capture 3, two away from danger with readiness rising, one toward danger with readiness falling.
- **(e) People:** the chair's ruling (A), restated. **The lane re-deals no person:** 0 people added, removed or renamed, and 0 personality changes, in 1,185 births. Goals, ties and memberships follow power by design, in the births where power moved and no other. **The stop that stands:** a person added, removed, renamed or given another personality, or a change of who governs, anywhere.
- **(f) The receipt:** text moves in 3 births; 0 status changes.
- **(g) String roots:** one line each in the draft.

**Read by other lanes:**
- `castPowers.js` reads the criminal power's points (moved in 12 of the 660, 19 golden) and the power roster (6 of the 660).
- `representatives.js` reads `factions[0]` (moved in 4 of the 660, 0 golden) and the prosperity label (0 moves).

## The six golden surfaces (each by measure; the draft has the rows)

| Surface | Verdict | Rows moved |
|---|---|---|
| Generator golden master | MOVED | 496 of 525 |
| Espionage fence | MOVED | 346 of 360 |
| Dossier prose manifest | MOVED | 684 of 1,050 |
| Herald desk | MOVED | 444 -> 447 items (52 added, 49 removed, 80 changed) |
| PDF golden | MOVED | `defense.scoreAvg` 40 -> 41 |
| Preset-lighting witness | UNMOVED | green at base and tip |

The five red suites are red at the base too (AGREE's unsigned rows), and each reads differently at the tip.

## Found, not mine

- **goals.js: the two vantages share one stream.** On a card's own fork (`people-goals::<card id>`), a draw the short vantage skips or adds re-deals the long vantage for no reason of its own: 87 long goals in 15 births moved only so (example: agree-town-143, npc_cooper, 7 -> 6 draws on its fork). A sub-fork per vantage would cure it and would re-deal every card's long goal once: its own measured cause in another lane's file. The same question stands for the ties' forks (158 cards draw a different count where power moved). The chair: the next wave's charter takes it.
- **The observed-shape walker** (`tests/lint/observedShapeReaders.walker.test.js`) cannot build its corpus at the base or at the tip ("the tier-coverage seed osr-tier-14 minted no tier candidate in 12 intervals"): equal-failing, not the lane's. The first seat's note on the pulse's 62 vs 74 events cannot be re-read until it builds.
- **The repetition guard:** `ledger:safetyProfile:SAFETY_LINE_SIBLINGS`, ceiling 0.8919. The measure falls 0.880 -> 0.7258 (banked corpus) and 0.871 -> 0.7264 (confirm corpus); the pool grows from 14 to 21 sets (28 to 42 lines) by 11662262e and b4cba2ece. Ruled by the chair: no `--tighten` on the lane; the merge seat lowers that one row at the merge point.

## The equal-failing set and the whole suite

**The whole suite at the final code tip 828348ba8** (`npx vitest run --maxWorkers=2`, JSON reporter, ledger ref fetched, a detached scratch worktree): 3,218 files, 38,985 tests, **70 failed**, 38,661 passed, 254 skipped; 72 failing titles counting the two file-level errors. **The base** (the seven directories, the same way): 25,096 tests, 42 failed (44 titles). The full list, classed, is `UPKEEP-FAILSET-828348ba8.txt` beside this file.

**THE LAST STATEMENT, the whole suite ONCE at the final code-and-test tip 5b647aa9c** (`--maxWorkers=3`, JSON reporter): 38,985 tests, **64 failed**, 38,667 passed, 254 skipped; 66 failing titles (60 in the seven directories). That is exactly the set below, less the six titles cured in 042227874 and 61c8d452e; nothing new. The list is `UPKEEP-FAILSET-FINAL.txt`. Every remaining red is either the line's known set or AGREE's (the 44 red at base too), the merge seat's (named), or parked P1-P6.

- **Red at base and at the tip (44 titles, the seven directories): the line's known set and AGREE's unsigned golden rows.** Not this lane's. Among them: the five golden surfaces, the pinned-choosers / pinned-mode / held-roster null-change arms that read the golden corpus, the observed-shape and writer-reach walkers (their corpus cannot build), editCorpusRatchet, landingFixtureFreshness, the taste-interested fixtures.
- **Red at base, green at the tip:** none.
- **Red at the tip, green at base (22 in the seven directories, 5 outside): the lane's.** Each is classed below.

| Red | Class |
|---|---|
| `negativeAssertionAnchor` (2): upkeepHired.test.js lines 271, 286 | MINE, cured in 042227874 |
| `seedLoopTotality` (2): upkeepHired.test.js line 66 (bab22ea8a) | MINE, cured in 042227874 |
| `presumedThings` ARM 1: four page-line literals name "garrison" / the mercenary lead without declaring it | PARKED P6 |
| `heldKeyWriterCensus` A3: `keepOf` newly called in the assembly step | MINE, cured in 61c8d452e |
| `prosperityRank` "no private prosperity ladder": keep.js | MINE, cured in 61c8d452e |
| `dossierStateProseProjection` (2): dossierRelations.generated.js stale; relations 165 -> 169 (the gates' new inputs, 07ebe8bdc) | PARKED P5 |
| `defenseEconomicGate` (8) and `defenseWordsFindings` (1): pins on the gates keyed on the economy's OUTPUT; the gates read the label now (ruling 3, B), so the fixtures' gates no longer bite (`fundingNote` null) | PARKED P1 |
| `famineStoresOneRounding` (2): soak1k famine granaries 6 -> 4 months, 12 -> 9 (ruling 6) | PARKED P2 |
| `captureBirthScale`: criminal cities at equilibrium+ 369 below the floor 372 (the legitimacy chain, declared) | PARKED P3 |
| `mundaneRealmAcceptance`: the recorded twin census, services 121/124 -> 116/119 (ruling 4) | PARKED P4 |
| `pipelinePinnedChoosers` A6 (37 -> 40), `townCartographyCalibration` W2, W8 | THE MERGE SEAT'S: they re-measure generated output against frozen records |
| `dossierPhoneFloorAllViews` (2) | THE MERGE SEAT'S: the named class 1 (per-view counts), the page lines and services move what the views print |
| `poolDominance` "no ceiling sits loose" | Its own class (the chair's ruling): lowered at the merge point |

## Left

- Merge AGREE's final tip when the chair names it, then re-take the measures and the field diff.
- The edge bundles, last and alone (`npm run build:edge-shared`).

---

# The first two seats' record (kept as written)

# COHERENCE-UPKEEP: the hand-back (item 4, built)

Lane `lane/coherence-upkeep-2026-11-12`, cut from AGREE's final tip `65ce74ce6`. Built by COHERENCE-AGREE-2 to the chair's ruling of 2026-11-12 on item 4, and the chair's ruling (A) on the services STOP. The proposal it builds is `docs/chair/2026-11-11/UPKEEP-PROPOSAL.md` (on the AGREE lane).

**AN INDEPENDENT REVIEWER READS THE WHOLE LANE NEXT**, from base `65ce74ce6` to the tip, before the merge seat takes it.

## The owner's words, and the one home

> "prosperity should also scale the rest including healing, magic, etc. everything is based on what can be stockpiled, refilled, rebuilt, etc."

**The home is the prosperity label.** `src/domain/facts/keep.js` holds it:
- `KEEP_TUNING`: one table keyed by label, with two named columns. `bought` is the share of what is bought outright. `funded` is the funding of wages and works.
- `KEEP_SCALE_TUNING`: the floors for the bought families (services 0.7, stores 0.7) and magic's line (`magicBelow` 0.6).
- One reader, `keepOf(prosperity)`, plus `fundedGate` and `boughtShare`.
- The `keep` getter in `factsOf`, beside the prosperity fact.

Both tables are registered DRAFT in `tests/lint/.tuning-register.json`; the values are the owner's to sign. No vocabulary atom was added: the page lines use the existing `prosperity` band atom, because `keep.bought ≥ 0.6` is exactly `prosperity: ≥ moderate`.

**Nothing feeds back.** Prosperity reads no score, availability or months, and is written before every reader of the home. **Prosperity moves in 0 of the 360 births at every commit.**

## The corpus

The 360 births on seeds `agree-<tier>-<i>` (60 villages, 160 towns, 100 cities, 40 metropolises), every browser dial random, `grounded`: the AGREE lane's corpus. Every before and after below is on these seeds.

## The guard (d7d7f7787, red first)

1. **The home**, as above.
2. **The upkeep-reader walker**: `tests/lint/upkeepReaders.walker.test.js` with `upkeepReaders.register.json`.
   - **What it counts:** every read of the economy's OUTPUT used to gate upkeep. In the upkeep writers it counts every read. Elsewhere it counts a gate's shape, over the whole statement.
   - **The register:** shrink-only, and two-way (every live read is a row, every row is a live read). It also checks that `KEEP_TUNING` is named only in its home.
   - **Size:** 10 rows at the base, 4 at the tip. Six gate rows retired in 07ebe8bdc. The commercial demand roll's row is HELD under ruling (A), its reason saying exactly what it reads. The other three rows are the defence economic score's capacity term (`economic += econOutput × 0.2`), which is not an upkeep gate, and the two hand-offs that carry the output to it.
3. **The counterfactual** (`tests/generators/upkeepHired.test.js`), pinned on the pure score: **for every place with hired force and no standing force, its military score is not above the same place's score with a watch in the hired force's stead.** It was red at the base on all 5 hired-only corpus villages; for agree-village-45 the score was 97 against a watch's 93. The same file pins each family red first, as its own describe.

## The families: commit, before → after on the 360

| Family | Pin (red) | Cure | Before → after |
|---|---|---|---|
| Hired force (ruling 2) | d7d7f7787 | 0b5dc10b5 | The company, the charter hall and the contract chain are worth `keep.bought`, added after the wage gate. A hired-only place takes the slider term at its share, and its military is capped at a watch in its stead. **10 readiness labels move (6 up, 4 down).** 0 of 158 places without a hired force move. agree-village-45 goes 97 → 91 (its watch is 93) and Defensible → Lightly Defended; agree-village-40 37 → 26; agree-city-17 (Wealthy) is unchanged. |
| The five gates (ruling 3, B) | e55b52675 | 07ebe8bdc | `fundedGate(floor, keep)`: floors kept, identity at Comfortable and above. **86 labels move in this family (53 up, 33 down).** |
| Services (ruling 4, (A)) | 948c274af | c19e96e23 | See below. |
| Magic (ruling 5) | 4895854ad | e2ebb6447 | **99 availability bands, every one a single step down, all in Struggling (42 places) or Poor (57) places**: moderate→limited 32, broad→common 24, limited→rare 22, pervasive→broad 12, common→moderate 9. The world's magic level is never pervasive in these; a pervasive world is pinned unmoved. The profile is derived for display, so no draw moves. |
| Stores (ruling 6) | d1be3be10 | 05ec9b601 | See below. |
| The page (ruling 7) | acb2fd22d | 11662262e | See below. |

The scale table (`KEEP_SCALE_TUNING`, `boughtShare`) landed alone, with no reader, in 357f15758, and magic's line joined it in e2ebb6447.

### Readiness: the STOP, measured lane-wide

From `65ce74ce6` to the tip, **93 readiness labels move (54 up, 39 down)**. By direction:

| Before → after | Count |
|---|---|
| Defensible → Well-Defended | 22 |
| Well-Defended → Fortress | 17 |
| Defensible → Lightly Defended | 12 |
| Lightly Defended → Vulnerable | 12 |
| Lightly Defended → Defensible | 8 |
| Vulnerable → Undefended | 7 |
| Well-Defended → Defensible | 7 |
| Vulnerable → Lightly Defended | 5 |
| Undefended → Vulnerable | 1 |
| Defensible → Vulnerable | 1 |
| Defensible → Fortress | 1 |

By prosperity: Comfortable 25, Moderate 18, Poor 18, Struggling 16, Prosperous 16, Wealthy 0.

**Well-Defended plus Fortress went 36.7% → 41.1%, +4.4 points of the corpus**, inside the STOP at 5. It peaked at +4.7 after the gates; the stores then lowered it 0.3. 93 labels is inside the STOP at 120.

Safety and food labels move 0, and prosperity 0, at every commit.

### Services (ruling (A) on the STOP)

**The STOP, and how it was resolved.** As first built, the services step's seeded stream moved and 44 standing institutions were emptied, so I stopped. The chair ruled (A).

**How it is built under (A).** The commercial demand roll still reads the output, for its threshold and for whether it draws, exactly as before this lane. What a place can keep up is applied after that roll: healing, lodging, food, equipment, transport and the commercial services keep `boughtShare('services', keep)` of their rows. That decision is a draw-free roll keyed on the seed, the institution and the service, and a standing institution keeps at least one row.

The chair's five conditions, measured on the 360 (base = the tip before services, tip = with them):
1. **The walker row** says that the roll reads the output for both its threshold and whether it draws, and why it is held.
2. **Rows added: 0.** Rows removed: 439, in 175 settlements. Institutions with no rows: **565 at the base, the same 565 at the tip, so 0 newly empty**, out of a roster of 15,976. Pinned (`services are kept as far as the place can pay`: the Struggling read's rows are a subset of the full read's).
3. **Healing** by band: Struggling 183 → 161 (−12.0%), Poor 287 → 257 (−10.5%), Moderate 298 → 279 (−6.4%), Comfortable 617 → 600 (−2.8%), Prosperous and Wealthy 0. All inside the STOP at 25%.
4. **Criminal rows** by band, base → tip: Struggling 56 → 56, Poor 94 → 92, Moderate 130 → 130, Comfortable 417 → 416, Prosperous 297 → 297, Wealthy 97 → 97. None rises.
5. **The debt** (a proposal for after the release; not built and not measured). A single read would take the commercial roll's threshold from the home while holding its draw pattern. The roll would still draw where `output/50 < 1`, but compare against a home value, so that no draw moves. That needs one owner value: the home's equivalent of today's 0–2 demand scale for a commercial service. It would move rows only in the towns where the label and the output disagree: the 97 listed in `UPKEEP-ECONOMICS-PAGE-97.md`, and only for their commercial services with a roll probability below 1. Until then, the commercial roll and the home's share both apply, in that order.

### Stores (ruling 6)

**How it is built.** The full granary keeps `boughtShare('stores', keep)` of its months, at the stores' writer, on a second call after prosperity. The writer's one draw is a pure label-keyed fork, so the second call draws the same crop fortune. The first call, the one prosperity reads, lays by in full, and prosperity reads no months. The months, the food record's months, the storage note and the resilience all follow the kept months.

**What moved:**
- **Months** fall in 225 places: Comfortable 74, Poor 57, Moderate 54, Struggling 40.
- **Food bands: 0 moves. Prosperity labels: 0 moves.** The STOP holds.
- **Storage notes crossing a threshold: 22.** Seasonal buffer → minimal storage 14; strategic reserve → buffer 7; buffer → seasonal buffer 1.
- **Defence:** the economic score falls in 202 places and the disaster score in 183. 6 readiness labels fall one step: agree-village-50, agree-town-41, -65, -73, -76, agree-city-52.

**The famine towns, line by line** (all Struggling; the food band holds in each):

| Town | Months | Storage note |
|---|---|---|
| agree-village-8 | 0.1 → 0.1 | minimal, unchanged |
| agree-village-39 | 1 → 1 | minimal, unchanged |
| agree-town-66 | 3.1 → 1.9 | seasonal buffer → minimal storage |
| agree-town-99 | 4 → 2.8 | "4 months buffer" → seasonal buffer |
| agree-city-58 | 7 → 5.4 | buffer → buffer |
| agree-metropolis-5 | 11.8 → 9.1 | strategic reserve → strategic reserve |

### The page (ruling 7)

There are four lines, declared in `SAFETY_LINE_SIBLINGS` by the `prosperity` atom, each with today's line as its twin, all in the field that exists (`guardEffectivenessDesc`). The safety profile is written before prosperity, because prosperity reads its black-market figure, so the lines resolve after prosperity, draw-free (`safetyProfile.js :: keptGuardLine`).

| Line | Needs | Where it prints | On the 360 |
|---|---|---|---|
| "There is no standing guard; a hired company is paid to keep the peace, and gives what it is paid for." | `prosperity: ≥ moderate` | A hired company and no standing guard | 0 (no corpus town has one); pinned on a planted roster |
| "A hired company is on the books, but the coin to keep it runs short; it comes when called and leaves when the coin does." | `prosperity: ≤ poor` | The same | 0; pinned |
| "Hired swords back the garrison when the purse allows." | `prosperity: ≤ comfortable` | A hired company beside a garrison | 36 (Struggling 1, Poor 6, Moderate 10, Comfortable 19); its twin "Hired swords back the garrison." 48 (Prosperous 39, Wealthy 9) |
| "The adventurers' charter hall takes bounty work against threats, as far as the purse runs." | `prosperity: ≤ comfortable` | A charter hall with no garrison and no watch | 4 (Poor 3, Comfortable 1) |

The proposal put the charter line "beside the monster row (`deriveSupportingCapabilities`)". **That function has no monster row**, so the line went into the charter hall's own guard sentence, which is the monster sentence that exists.

**The 97 towns where label and output disagree.** What the Economics page prints in each is in `docs/chair/2026-11-12/UPKEEP-ECONOMICS-PAGE-97.md`. Every sentence follows the label (DS-ECO-1 and the rung are keyed on the prosperity rank), so **no sentence is a class member, and none was cured**. What disagrees is the header chip "Output N/100", which is a number and not a sentence:
- 43 Comfortable or Prosperous towns print it red.
- 7 Poor or Struggling towns print it green.

That chip is the owner's UI ruling (T2-1), so it is reported and was not changed.

## Found, and not this lane's

- **agree-village-45's 97 is not the hired slider term.** Measured by the counterfactual: its palisade is a work, and a work already earns the full slider term, so a watch in the charter hall's stead scores 93. The gap was the charter hall's +10 against a watch's +7. Under the rule, the cap at the watch holds it at 91. The slider term for a hired-only place with no works (`0.06 + 0.29 × bought` against a standing force's 0.35) is built, but no corpus place takes it.
- **The Output chip** (above).

## EQUAL-FAILING-SET

See the section appended below.

## What was banked

- **Registers:** two DRAFT tuning rows (`KEEP_TUNING`, `KEEP_SCALE_TUNING`), and the upkeep-reader register (10 rows at its first commit, 4 at the tip, one of them held by ruling (A)).
- **Re-takes:** the tuning inventory and the wiring census, each re-taken by its own writer (named below).
- **Nothing else:** no test was skipped and no pin was loosened.

## L2, the wider corpus (the chair's review laws of 2026-11-12): a STOP, sent and held

The wider corpus is the 360, plus 60 thorps and 60 hamlets (`agree-thorp-i`, `agree-hamlet-i`), plus 180 forced births (`agree-force-<famine|wartime|under_siege>-<tier>-<i>`, six tiers × 10). The base is `65ce74ce6` and the tip is this lane, both measured as archives.

**Readiness, against the STOP at 5 points of the corpus:**
- The 360: +4.4 (36.7% → 41.1%), 93 labels.
- Thorps and hamlets: 12 labels, the share unchanged.
- **Forced: 53 of 180 labels move (48 down), and Well-Defended+Fortress goes 16.7% → 8.9% (−7.8, OVER).** By stress: famine 8 → 1, siege 5 → 0, wartime 17 → 15. Of the 53 movers, 44 are Struggling: a famine or siege caps prosperity at Struggling, so `funded` = 0 and every gate stands at its floor.
- All 660: +0.3, 158 labels.

**Stores:** printed storage thresholds crossing: 58 on the 660 (the 360 22, thorps and hamlets 3, forced 33). Food bands 0 and prosperity 0 everywhere, including all 77 famine births.

**Holding on the wider corpus:**
- The hired counterfactual: 9 hired-only places (6 villages, 3 hamlets), every one at or under its watch.
- Services: 0 rows added, 0 institutions newly empty.
- Safety, food and prosperity: 0 moves.

**L1, the type gates:**
- The domain strict check reads exactly the one inherited error (`src/domain/defense/defenseFacts.js`, AGREE's).
- The typecheck ratchet: this lane's one error (`safetyProfile.js`) is cured in b95ba62e0; what remains is AGREE's first seat's (`generationCoherence.js` +3, `resourceGenerator.js` +15).
- Eslint is clean on every file the lane touched.

**STOP sent to the chair with three options for the gates (lift Struggling's `funded`, exempt stress-capped labels, or accept) and the stores choice.** The lane is held until the ruling.

**Still running when this was written:** the base-against-tip field diff over the golden 525 and the 660, and the equal-failing-set suites.
