# REVIEW-W2-WRITE-2 · step 1, cold: every new or reworded line of the corpus lane's stage, read where it prints

**The stage.** `lane/w2-write-2026-11-13` from b5206acd3 (the last read's tip) to **70e5e7468** (the tip named; the
branch's newer commits are a later stage and were not read). Full history fetched; not shallow.

**Order kept.** This list was made from the DIFFS and the renders only. No hand-back, no statement file under
`docs/chair/` on the lane and no commit message of the range was opened before it was committed and pushed. One
exposure to declare: two git outputs printed commit subjects of the range that I did not ask for (the tail of the
integration merge's message under `git show --remerge-diff --stat`, and the subjects that git writes into the
conflict markers of the remerge diff of `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`). Both concern register files
and one mark; neither names a line, a town or a cure.

## What the stage changed (by the diff)
- **The stage's own commits** (first parent, no merges, plus the two side branches it merged,
  `w2-write-side-eco` at 4134b0882 and `w2-write-side-rest` at ddb7453e9): 133 commits. Outside `docs/chair/` they
  touch only the corpus (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` and the six `src/data/dossierStateProse/*.generated.js`),
  registers (`scripts/.prose-byte-baseline.json`, `docs/content/wiring-census.json`, `docs/content/prose-shift-register.json`,
  `tests/lint/*.register.json`, `scripts/census/page-census.register.json`, `scripts/.observed-shape-readers-baseline.json`)
  and tests. **No generator, kernel or display code.**
- **The corpus, base → tip** (`corpusdiff.json`, the last read's `corpusdiff.mjs`): 132 lines added (121 rewordings
  in the same pool and vid, 11 new), 15 rows struck, 65 lines whose conditions (marks) alone changed. 64 pools touched.
- **The merge of the integration line** (d004d56b6, second parent 976db5b19) brought one corpus change of its own
  (walls PRESENT v2 `colour` → `gate`); the remerge diff shows the resolution kept the lane's side, which already
  carries `gate` (`[ledger · gate · guardPresence · no crisis: under_siege]`): both sides kept.
- **Each block at the tip equals the branch that held it**, plus the 14 first-parent commits after the merge:
  DS-ECO = side-eco + 5 rewordings and 2 mark changes after the merge; DS-GEN/POW/SUP/CND/FTH = side-rest exactly;
  DS-DEF = the main line before the merge (892dca1b7) + 8 mark changes after it.
- **The id law** (`idlaw.mjs`): 856 pools at base and tip; no pool added or lost; **no middle row struck** (the 15
  struck rows are each its pool's last); every pool's vids contiguous from the same first id at base and tip.
- **No record field moves** (`fielddiff.mjs`, the census's 720 births): with the merged line held fixed
  (976db5b19 → 70e5e7468) all **720 records are identical**; base → tip moves 684 of 720, all of it the merged line's.

## The towns and the surfaces
- **Births in the app's own configuration shape**: 132 fresh `rv2-<size>-<crisis|calm>-<i>` (DEFAULT_CONFIG,
  `selectedStressesRandom:false`, the ticked list; 6 sizes × calm, under_siege, famine, occupied, under_siege+famine,
  wartime, indebted, monster_pressure, plague_onset, mass_migration, insurgency × 2), the SECOND-WAVE-CENSUS 720,
  the last read's 38 towns (its 30 `rww-` and the 8 `rw3-` its false reads name, reproduced: Cnocholme, Ulfset,
  Panteakra are the same towns), and 15 siege towns found by hunting (below): **905 rendered at the tip**, 852 at
  the base.
- **Three surfaces per town**: the owner's dossier on screen (every group, sub-tab and disclosure opened: the
  census render, `render.rv2.jsx`); the PDF's state-prose text (`buildPrintProse` on the normalized record, as
  `generateSettlementPDF` builds it: `pdftext.mjs`); the stored public prose (`publicProse` on the record). The
  Tonight sheet and the Foundry module import no corpus desk (read in their imports).
- **Where a line prints is taken from the kernel's own ledger** (`drawn.mjs`: `withPresumptionLedger` around
  `buildPrintProse`, which records every drawn `pool::vid`), not from text matching: the overview rungs CLIP lines at
  the first comma or semicolon ("Market day is when X fills: the roads bring buyers."; "No market or fair stands in
  X."), so a text match misses them (the last read's `whereprints.mjs` has this blind spot). Every one of the 11,342
  draws was then found on the page (`attach.mjs`), and the PDF agrees with the page for every line.
- **Never printing**: 5 lines are drawn in none of the 905, nor in **1,696 more births** hunted by the ledger alone
  (`hunt.mjs`: 360 siege/calm of every size, 1,136 calm/wartime/monster/indebted thorps to towns, 200 with the
  Trade Route set to isolated): GEN-16 LEGACY-LINKED v1, v2 (the generator writes only the three keyed clauses, so
  the LINKED fallback is reached only by an older saved annotation); ECO-10 POSTURE: vulnerable v2 (its `{access}`
  slot); GEN-13 NO-MARKET v1, v2 (no market, but a gate and a tavern). The two siege CHAIN lines (DEF-2 food trades
  working v4, failing v5) printed in none of the first 890 and were found by the hunt (15 towns, rendered and read).

## How they were read
Seven reader seats, by block (DEF-2 in two halves; the other DEF blocks; ECO-1/6/9/10 + SUP-2; ECO-11/12 + GEN-18/14
+ CND-1; GEN-13/16/17; POW-4/5/6 + FTH-4), each given the readers' scale verbatim (`probes/.../LINES-READER-BRIEF.md`),
its lines with every town each prints in, the pages, PDF texts and records, and nothing else. Each line: read **by eye
in at least three towns** (the smallest and the largest size it reaches, a siege, famine or occupation among them
where it prints under one), then **by script against the record in every town it prints in** (each reader's
scripts are in `readers/scripts-<n>/`, copied under the probes). Each of the last read's 59 false rows was read in
its own false towns: cured and true, cured by silence (and what prints in its place), or still false.

**Checked by me (EXECUTED):** the six HIGH lines below, each in its town against the record and the page; one false
MED per reader (reader 1 STRONG v12 at r2s-occupied-city-1; reader 4 DEFICIT v5 at rw3-metropolis-under_siege-1 and
C4 v3 at r2s-occupied-metropolis-1; reader 5 ECO-11 unexploited v1 at rv2-metropolis-mass_migration-1; reader 6
LEGACY-UNRESOLVED v1 at rv2-town-occupied-1; reader 7 council v1 at r2r-hamlet-24), and the 10 struck rows of the
59 in their towns. **I lowered nine readers' MED to LOW** where the record cannot settle the claim or the claim is a
habitual description under a plague closure (marked "adjudged LOW" in the table).

**Own or carried, exactly.** The stage changed only the corpus, so I built the tip tree with the base's six
generated corpus files restored (`wt/undo`, scratch, no commit) and drew every tip town through it
(`drawn-undo.json`). A false town where the base corpus draws the same line is CARRIED (if the line was reworded,
I read the old wording for the same fault); a town where only the stage's corpus draws it is THE STAGE'S OWN. (A
first pass that compared the base's own births was discarded: the merged line changes 684 of the 720 towns.)

## The result
- **207 lines** (11 new, 121 reworded, 65 conditions only, 10 unchanged rows of the 59). **202 print.**
- **62 FALSE at HIGH or MED** where they print (6 HIGH), 140 TRUE (some with LOW notes), 5 NEVER PRINT.
- **15 of the 62 are THE STAGE'S OWN** in at least one town; 47 are CARRIED, false with the base's corpus in the
  same towns, and 38 of those 47 are lines the stage reworded or re-gated and left false (9 are unchanged rows of the 59).

**HIGH (6):**
| # | line | town | as printed | against it | origin |
|---|---|---|---|---|---|
| 1 | DEF-2 neither walls nor force v9 | r2s-monster_pressure-town-2 (Velipol: the last read's H4 town) | "With trouble at hand, Velipol's watch is all the town has to send, and there is no wall to send it to." | Free company hall on the roster; same tab: "A mercenary company provides enforcement" | **OWN**: prints in 0 base pages and 4 tip pages; the stage's cure of H4 hands the row to v9, which lacks the siblings' `no mercenary` |
| 2 | DEF-12 CAPACITY: enough v3 | rv2-hamlet-famine-2, r2s-occupied-thorp-1, r2s-under_siege-thorp-2 … | "People at X make do with what they have; a good year is comfortable and a bad one is lean." | famine or siege in force: "Rationing has begun", "The winter ahead will be hungry" | **OWN in 19 of its 26 false towns**: the stage declared v1, v2 `food: ≥ pressured` and reworded v3 without it; CARRIED in 7 |
| 3 | DEF-2 neither walls nor force v7 | r2r-town-50 (Saraibuurt) | "Saraibuurt has no wall and no soldiers; its watch keeps the peace in the streets and would be no answer to an army." | Free company hall: "The free company at Saraibuurt keeps its own muster roll" | CARRIED (unchanged row of the 59) |
| 4–6 | POW-5 council v1, v2, v4 | r2r-hamlet-24 and every Headman's Authority town (19, 20, 24) | "Decisions at Jayakota are slow because the whole Headman's Authority must agree" | "A headman settles disputes and gives the orders here"; "↳1 member" | CARRIED (the stage added `no ruler: lord`, which does not take a headman); v4 is OWN in 2 more towns |

**MED, the stage's own (12 lines):** DEF-2 neither walls nor force v4 (rw3-hamlet-under_siege-1, where it replaces the
cured H2 line: "no force" beside an Adventurers' charter hall that musters the defence); DEF-2 v6 as reworded ("nobody
under arms" under the Beasts row's "people arming themselves", r2r-thorp-5); DEF-2 Economic Survival STRONG v3 as
reworded and the new v12 ("its defenders are still paid on time" beside "The occupiers take the revenue", or
"Chronically underpaid"); GEN-16 LEGACY ×6 as reworded ("The plague years is a generation old", "came through the plague years,
which is older than its bearers": the rewordings made `{calamity}` a subject with a singular verb; 61 towns); GEN-18 STALLED v3 (new: "always
bought in" beside "No recorded imports"); GEN-13 MARKET-OPEN v3 in 2 plague towns where only the stage's re-gate of its
siblings sends it ("Visitors find Weichsee's market without asking" beside "the guards turn back travellers and
traders alike": it lacks the `no crisis: plague_onset` its siblings v1, v2 now carry).

**The last read's 59 false rows** (table below): 19 cured and true; 12 cured, by rewording or by silence, with what
prints in their place true; 10 struck, with what prints in their place true (read by me); **18 still false** in their
own towns, two of them through their replacement (rw3-hamlet-under_siege-1: H2's row now prints DEF-2 v4, false;
r2s-under_siege-city-3: partiallyExploited v5's place now prints ECO-11 unexploited v3, "nobody has found it worth the
trouble" beside Carpenters, a Sawmill and a running Timber chain).

**Slots and machinery.** Catalogue labels print through slots in the stage's reworded lines: "gold/silver ore"
(ECO-12 a house needs v1, v2; ECO-11 unexploited-high v2: 47 towns) and "Military/Guard" (POW-4 Contested v1; POW-6
commander v3, v4: 36 towns), carried slot fills. No line prints a count range, an identifier or a rating's machinery.

**The clipped rungs.** The overview's market and institutions rungs print a line only to its first comma or
semicolon. So the stage's siege and plague twins in DS-GEN-13 print without their crisis clause ("Kaliburg's market
grew up on the road's trade." under siege; the clause "and with the siege closing the road it has almost nobody left
to sell to" never reaches the page). They read true as clipped, but the cure they were written for is invisible.

## The last read's 59 rows, each
| row (the last read) | its state at the tip | its false towns then | now |
|---|---|---|---|
| DS-DEF-1::readiness STRONG::v5 | REWORDED | r2s-monster_pressure-city-2 [MED], r2s-monster_pressure-metropolis-1 [MED], r2s-monster_pressure-metropolis-3 [MED] | CURED AND TRUE |
| DS-DEF-2::Invasion & War: walls with NO force::v5 | MARKS | rww-town-slave_revolt-1 [MED] | STILL FALSE (rww-town-slave_revolt-1) |
| DS-DEF-2::Invasion & War: neither walls nor force::v5 | MARKS | rww-village-under_siege-1 [MED] | CURED (true, or by silence with a true replacement) |
| DS-DEF-2::CHAIN: defence supplied::v6 | GONE | rww-city-famine-1 [MED], r2r-hamlet-16 [MED] | CURED-BY-SILENCE (v5 in its place; LOW doubt at rww-city-famine-1) |
| DS-DEF-3::COMPOUND: insurgency::v5 | GONE | r2s-insurgency-thorp-0 [MED] | CURED-BY-SILENCE (v2, true) |
| DS-DEF-8::override: MIGRATION, arrivals::v4 | GONE | r2r-city-37 [MED], r2r-metropolis-25 [MED], r2s-mass_migration-city-2 [MED] | CURED-BY-SILENCE (v1/v3, true) |
| DS-DEF-11::WALLED-STRAINED::v3 | REWORDED | r2s-under_siege-metropolis-2 [MED] | CURED (true, or by silence with a true replacement) |
| DS-DEF-11::WALLED-STRAINED::v7 | REWORDED | r2r-hamlet-18 [MED] | CURED AND TRUE |
| DS-ECO-10::POSTURE: entrepot::v4 | REWORDED | r2s-under_siege-city-0 [MED] | CURED AND TRUE |
| DS-ECO-12::INCOME WEIGHT: the religious houses::v4 | REWORDED | rw3-hamlet-under_siege-1 [HIGH] | CURED (true, or by silence with a true replacement) |
| DS-POW-5::FLAG: crimeIsGovt::v4 | REWORDED | r2s-mass_migration-town-2 [MED], r2s-slave_revolt-town-3 [MED] | CURED AND TRUE |
| DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity)::v7 | REWORDED | r2r-town-37 [MED], r2s-slave_revolt-town-3 [MED] | CURED (true, or by silence with a true replacement) |
| DS-FTH-4::FLAG: heresySuppression: preached::v3 | REWORDED | r2r-metropolis-25 [MED] | STILL FALSE (r2r-metropolis-25) |
| DS-DEF-1::readiness CRITICAL::v4 | SAME | rww-city-famine-1 [MED] | STILL FALSE (rww-city-famine-1) |
| DS-DEF-2::Beasts & Monsters: settled, nothing organized::v6 | MARKS | r2r-thorp-40 [HIGH], r2s-monster_pressure-town-2 [HIGH] | CURED (true, or by silence with a true replacement) |
| DS-DEF-2::Invasion & War: walls with NO force::v6 | MARKS | r2s-under_siege-town-3 [HIGH] | CURED (true, or by silence with a true replacement) |
| DS-DEF-2::Invasion & War: neither walls nor force::v6 | REWORDED | rww-hamlet-under_siege-1 [HIGH], rw3-hamlet-under_siege-1 [HIGH], r2r-hamlet-0 [HIGH] | STILL FALSE (rw3-hamlet-under_siege-1 via its replacement) |
| DS-DEF-2::Invasion & War: neither walls nor force::v10 | GONE | rw3-town-under_siege+famine-1 [HIGH], r2s-under_siege-town-1 [HIGH] | CURED-BY-SILENCE (v8/v9, true; v8 "danger is close at hand" under siege LOW) |
| DS-DEF-2::CHAIN: food trades failing::v3 | REWORDED | r2r-metropolis-16 [MED], r2r-metropolis-22 [MED] | CURED AND TRUE |
| DS-DEF-3::COMPOUND: political fracture::v4 | SAME | r2s-politically_fractured-hamlet-3 [MED] | CURED AND TRUE |
| DS-DEF-5::garrison PRESENT::v4 | GONE | rww-metropolis-under_siege-1 [HIGH], rw3-city-calm-1 [MED] | CURED-BY-SILENCE (v2, true) |
| DS-DEF-9::magicDependency true::v4 | SAME | rww-city-calm-1 [MED] | STILL FALSE (rww-city-calm-1) |
| DS-ECO-1::COMBINATION C4: a low rung on a working approach::v1 | REWORDED | rww-metropolis-famine-1 [MED] | CURED AND TRUE |
| DS-ECO-9::DEFICIT::v5 | SAME | rw3-metropolis-under_siege-1 [MED] | STILL FALSE (rw3-metropolis-under_siege-1) |
| DS-ECO-10::POSTURE: established::v10 | GONE | rww-city-under_siege-1 [MED], r2s-under_siege-city-2 [MED] | CURED-BY-SILENCE (v7, true) |
| DS-ECO-11::EXPLOITATION: fullyExploited::v3 | REWORDED | rww-hamlet-under_siege-1 [MED] | CURED (true, or by silence with a true replacement) |
| DS-ECO-12::CRITICAL IMPORT: the land cannot give it::v3 | REWORDED | r2r-thorp-23 [MED] | CURED AND TRUE |
| DS-FTH-4::FLAG: heresySuppression: hunted::v3 | REWORDED | r2r-metropolis-29 [MED], r2r-metropolis-46 [MED] | CURED AND TRUE |
| DS-DEF-2::Invasion & War: neither walls nor force::v7 | SAME | r2r-town-33 [MED] | STILL FALSE (r2r-town-33) |
| DS-DEF-2::Economic Survival: WEAK::v5 | SAME | r2r-hamlet-4 [MED] | STILL FALSE (r2r-hamlet-4) |
| DS-DEF-5::walls PRESENT::v7 | REWORDED | rw3-village-insurgency-1 [MED], r2r-hamlet-10 [MED], r2r-hamlet-11 [MED] | CURED AND TRUE |
| DS-DEF-5::NO organized force at all::v4 | MARKS | r2r-hamlet-5 [MED], r2r-thorp-55 [MED] | CURED (true, or by silence with a true replacement) |
| DS-DEF-8::override: ACTIVE SIEGE::v4 | GONE | r2r-hamlet-0 [MED] | CURED-BY-SILENCE (v3, true) |
| DS-DEF-8::override: UNDER TRIBUTE::v4 | SAME | rww-village-indebted-1 [MED] | STILL FALSE (rww-village-indebted-1) |
| DS-DEF-9::magicDependency true, with a NAMED dependent chain::v1 | REWORDED | rw3-metropolis-calm-1 [MED], r2r-city-2 [MED] | CURED AND TRUE |
| DS-ECO-9::IMPORT-DEPENDENT::v5 | SAME | r2s-under_siege-city-0 [MED], r2s-under_siege-metropolis-3 [MED] | STILL FALSE (r2s-under_siege-city-0, r2s-under_siege-metropolis-3) |
| DS-ECO-9::FOOD SOURCES: one source::v3 | REWORDED | rww-city-insurgency-1 [MED], rww-metropolis-under_siege-1 [MED] | CURED AND TRUE |
| DS-SUP-2::UPSTREAM WEAK: a chain the town's work draws on is failing::v2 | REWORDED | rww-city-recently_betrayed-1 [MED], rww-metropolis-calm-1 [MED], rww-metropolis-wartime-1 [MED] | CURED AND TRUE |
| DS-ECO-11::EXPLOITATION: partiallyExploited::v5 | REWORDED | rww-city-under_siege-1 [MED], r2s-under_siege-city-3 [MED], r2s-under_siege-town-3 [MED] | STILL FALSE (r2s-under_siege-city-3 via its replacement) |
| DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks::v4 | GONE | rw3-metropolis-under_siege-1 [MED], r2s-under_siege-city-0 [MED] | CURED-BY-SILENCE (pool silent; income lines true) |
| DS-ECO-12::CRITICAL IMPORT: the land cannot give it::v4 | GONE | r2r-thorp-27 [MED] | CURED-BY-SILENCE (v2, true beside Imports: Metals) |
| DS-GEN-17::GREAT HOUSE: monastery::v1 | MARKS | r2r-metropolis-14 [HIGH] | CURED (true, or by silence with a true replacement) |
| DS-GEN-18::BOUGHT-IN::v1 | REWORDED | rww-hamlet-calm-1 [MED], rww-metropolis-calm-1 [MED], rww-thorp-plague_onset-1 [MED] | CURED AND TRUE |
| DS-GEN-18::BOUGHT-IN::v9 | REWORDED | rww-hamlet-mass_migration-1 [MED], rww-village-famine-1 [MED], rww-village-indebted-1 [MED] | STILL FALSE (rww-hamlet-mass_migration-1, rww-village-famine-1, rww-village-indebted-1) |
| DS-FTH-4::FLAG: heresySuppression: hunted::v4 | REWORDED | rww-city-calm-1 [MED] | STILL FALSE (rww-city-calm-1) |
| DS-FTH-4::FLAG: heresySuppression: preached::v5 | REWORDED | r2s-wartime-hamlet-2 [MED] | STILL FALSE (r2s-wartime-hamlet-2) |
| DS-DEF-2::Beasts & Monsters: plagued, perimeter AND organized force::v4 | REWORDED | rww-thorp-under_siege-1 [MED] | CURED AND TRUE |
| DS-DEF-2::Invasion & War: walls with NO force::v4 | MARKS | rww-town-occupied-1 [HIGH] | CURED (true, or by silence with a true replacement) |
| DS-DEF-2::Invasion & War: neither walls nor force::v2 | REWORDED | rww-hamlet-famine-1 [HIGH], rww-hamlet-mass_migration-1 [MED] | CURED AND TRUE |
| DS-DEF-2::CHAIN: defence supplied::v5 | REWORDED | r2s-famine-metropolis-2 [MED] | CURED AND TRUE |
| DS-DEF-3::Moderate::v1 | REWORDED | rww-metropolis-infiltrated-1 [MED], r2r-city-12 [MED] | STILL FALSE (r2r-city-12) |
| DS-DEF-8::override: SECURITY COMPROMISED::v4 | SAME | r2s-recently_betrayed-thorp-1 [MED], r2s-recently_betrayed-village-1 [MED] | STILL FALSE (r2s-recently_betrayed-thorp-1, r2s-recently_betrayed-village-1) |
| DS-DEF-11::WALLED-STRAINED::v6 | REWORDED | r2r-thorp-24 [MED] | CURED (true, or by silence with a true replacement) |
| DS-ECO-1::COMBINATION C4: a low rung on a working approach::v4 | REWORDED | rww-metropolis-under_siege-1 [MED] | CURED AND TRUE |
| DS-ECO-9::FOOD SOURCES: one source::v4 | GONE | rw3-thorp-famine-1 [MED], r2s-famine-hamlet-2 [MED] | CURED-BY-SILENCE (v2, true) |
| DS-ECO-12::CRITICAL IMPORT: the land cannot give it::v1 | REWORDED | rww-town-calm-1 [MED] | STILL FALSE (rww-town-calm-1) |
| DS-ECO-12::INCOME WEIGHT: the religious houses::v3 | REWORDED | rw3-hamlet-plague_onset-1 [MED], r2r-hamlet-30 [MED], r2r-hamlet-46 [MED] | CURED AND TRUE |
| DS-GEN-17::GREAT HOUSE: monastery::v3 | MARKS | rww-metropolis-under_siege-1 [MED], rww-town-under_siege-1 [MED] | CURED (true, or by silence with a true replacement) |
| DS-FTH-4::FLAG: heresySuppression: hunted::v5 | SAME | r2r-metropolis-15 [MED] | STILL FALSE (r2r-metropolis-15) |

## Every line

Columns: prints = towns whose kernel ledger drew the line (of 905 rendered); sizes = smallest–largest it reaches; verdict; origin; the worst false read (town · as printed · the fact against it). The full rows (eye-read towns, the script and its counts, every false town) are in `probes/REVIEW-W2-WRITE-2/lines-read.json`.

## DS-DEF-1

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| readiness STRONG · v5 | reworded · [threat · crisis: any · no crisis: occupied · guardPresence] | 5 · city–metropolis | TRUE (script 0 false / 5) |  | Rating-level claim matches readiness in all five. |
| readiness STRONG · v6 | reworded · [threat · crisis: any · no crisis: occupied] | 2 · town–metropolis | TRUE (script 0 false / 2) |  | Only two towns print; both Fortress. |
| readiness CRITICAL · v4 | carried-59 · [crisis: any · guardPresence] | 28 · thorp–city | FALSE MED (script 1 false / 28) | CARRIED (false in the same towns with the base corpus) | rww-city-famine-1: "Megaousa has people under arms, but too few and too badly placed to hold off a serious attack for long." — same tab Invasion & War: 'Megaousa keeps paid soldiers behind its walls, so raiders keep their distance and an army would pay dearly' |

## DS-DEF-2

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| Beasts & Monsters: plagued, perimeter AND organized force · v3 | reworded · [colour] | 46 · thorp–metropolis | TRUE (script 0 false / 46) |  | True structurally; "walls" for a palisade in 26 of 46 towns (LOW). |
| Beasts & Monsters: plagued, perimeter AND organized force · v4 | reworded · [colour] | 47 · thorp–metropolis | TRUE (script 0 false / 47) |  | Reword cured the "manned day and night" claim. |
| Invasion & War: walls AND professional garrison · v1 | reworded · [no crisis: under_siege · no crisis: occupied] | 96 · town–metropolis | TRUE (script 0 false / 96) |  | "Paid soldiers" reads as professionals; 26 towns print pay trouble nearby (LOW). |
| Invasion & War: neither walls nor force · v2 | reworded · [no threat · crisis: any] | 106 · thorp–town | TRUE (script 0 false / 106) |  | LOW: 9 watch towns, 4 wartime towns. |
| Invasion & War: neither walls nor force · v4 | reworded · [threat · crisis: any · no watch · no crisis: occupied] | 32 · thorp–village | FALSE MED (script 1 false / 32) | OWN (prints there only because of the stage: 1 town(s)) | rw3-hamlet-under_siege-1: "Lidostagnum has no line and no force, and danger is close at hand." — roster: Adventurers' charter hall - "with no garrison to call on it musters the defence"; line: "no force" |
| Invasion & War: neither walls nor force · v6 | reworded · [threat · crisis: any · no watch · no crisis: under_siege · no crisis: occupied] | 8 · thorp–village | FALSE MED (script 1 false / 8) | OWN (the rewording's "nobody under arms") | r2r-thorp-5: "You find Glenburn with no wall and nobody under arms, and its people keeping close to home until the danger passes." — line directly above (Beasts row): "people arming themselves with whatever is at hand" vs "nobody under arms" |
| Invasion & War: neither walls nor force · v8 | reworded · [watch · threat · crisis: any · no crisis: occupied] | 3 · town | TRUE (script 0 false / 3) |  | All 3 true; siege understatement LOW. |
| Internal Security: full legal chain (court AND prison) · v1 | reworded · [colour] | 91 · town–metropolis | TRUE (script 0 false / 91) |  | Court and prison in all 91. |
| Internal Security: full legal chain (court AND prison) · v3 | reworded · [colour] | 103 · town–metropolis | TRUE (script 0 false / 103) |  | Court and prison in all 103. |
| Internal Security: court without detention · v1 | reworded · [] | 68 · town–city | TRUE (script 0 false / 68) |  | Court without prison in all 68; LOW workhouse/siege. |
| Internal Security: court without detention · v3 | reworded · [] | 59 · town–city | TRUE (script 0 false / 59) |  | Inference from no prison; LOW stretch where a garrison stands. |
| Internal Security: no legal infrastructure · v3 | reworded · [] | 147 · thorp–village | TRUE (script 0 false / 147) |  | LOW in 2 towns where an NPC is "appointed to judge a case". |
| Economic Survival: STRONG · v3 | reworded · [crisis · no crisis: debt] | 29 · town–metropolis | FALSE MED (script 2 false / 29) | OWN (the rewording's "defenders are still paid from it") | rv2-metropolis-occupied-2: "Svetoko had money laid by before this trouble began, and its defenders are still paid from it." — same tab: "The occupiers take the revenue" and "its defence is someone else's to order" vs "its defenders are still paid from it" |
| Economic Survival: STRONG · v6 | reworded · [crisis: debt] | 2 · city–metropolis | TRUE (script 0 false / 2) |  | Debt is serviced; consistent. |
| Economic Survival: STRONG · v9 | reworded · [crisis · no crisis: debt · no crisis: famine] | 40 · town–metropolis | TRUE (script 0 false / 40) |  | LOW under occupation (5). |
| Economic Survival: STRONG · v12 | new · [crisis · no crisis: debt · no crisis: famine] | 31 · town–metropolis | FALSE MED (script 5 false / 31) | OWN (new line) | r2s-occupied-city-1: "The city went into this trouble with money in hand, and its defenders are still paid on time." — same tab: "The occupiers take the revenue, and local offices work only under their eye" vs "defenders are still paid on time" |
| CHAIN: defence supplied · v1 | reworded · [no crisis: hunger] | 31 · village–metropolis | TRUE (script 0 false / 31) |  | True by chain modifier; phrasing near machinery. |
| CHAIN: defence supplied · v2 | reworded · [no crisis: hunger] | 36 · hamlet–metropolis | TRUE (script 0 false / 36) |  | LOW where guard text says poorly equipped (8). |
| CHAIN: defence supplied · v3 | reworded · [no crisis: hunger] | 38 · hamlet–metropolis | TRUE (script 0 false / 38) |  | Net-positive wording matches the modifier. |
| CHAIN: defence supplied · v5 | reworded · [crisis: hunger] | 20 · hamlet–metropolis | TRUE (script 0 false / 20) |  | Food short holds in all 20. |
| CHAIN: food trades working · v1 | reworded · [no crisis: under_siege · no crisis: famine] | 19 · town–metropolis | TRUE (script 0 false / 19) |  | Stores 6-15 months in all. |
| CHAIN: food trades working · v2 | reworded · [no crisis: under_siege] | 22 · village–metropolis | TRUE (script 0 false / 22) |  | Hypothetical; true. |
| CHAIN: food trades working · v3 | reworded · [no crisis: under_siege] | 39 · village–metropolis | TRUE (script 0 false / 39) |  | LOW in 3 famine towns (silent on famine). |
| CHAIN: food trades working · v4 | reworded · [crisis: under_siege · food: > famine] | 4 · city–metropolis | TRUE (script 0 false / 4) |  | True in all 4. |
| CHAIN: food trades working · v5 | new · [crisis: under_siege · food: famine] | 1 · metropolis | TRUE (script 0 false / 1) |  | Siege+famine clause; true in its one town. |
| CHAIN: food trades working · v6 | new · [crisis: under_siege · food: famine] | 1 · city | TRUE (script 0 false / 1) |  | True in its one town. |
| CHAIN: food trades failing · v1 | reworded · [no crisis: under_siege] | 20 · town–metropolis | TRUE (script 0 false / 20) |  | True; "little food put by" sits beside multi-month granary figures (relative claim, not listed). |
| CHAIN: food trades failing · v2 | reworded · [no crisis: under_siege] | 13 · city–metropolis | TRUE (script 0 false / 13) |  | True. |
| CHAIN: food trades failing · v3 | reworded · [no crisis: under_siege] | 16 · city–metropolis | TRUE (script 0 false / 16) |  | Rewording cures both prior reads. |
| CHAIN: food trades failing · v4 | reworded · [crisis: under_siege] | 2 · metropolis | TRUE (script 0 false / 2) |  | True. |
| CHAIN: food trades failing · v5 | reworded · [crisis: under_siege] | 11 · town–metropolis | TRUE (script 0 false / 11) |  | True. |
| Beasts & Monsters: plagued, perimeter AND organized force · v2 | marks · [gate · no crisis: under_siege · no crisis: occupied] | 10 · town–metropolis | FALSE MED (script 1 false / 10) | CARRIED (false in the same towns with the base corpus) | r2s-monster_pressure-city-0: "Defense at Burjmandi is not an emergency arrangement, it is the week's work: the rotations run, the gates close on time, and nobody treats a" — monster_pressure in force; same tab Military status: "The beasts give Burjmandi no rest between attacks" / "more is spent on defence, and people grow afraid" vs |
| Beasts & Monsters: settled, nothing organized · v4 | marks · [threat · crisis: any · no crisis: under_siege · no crisis: occupied · no guardPresence] | 3 · thorp–village | TRUE (script 0 false / 3) |  | True. |
| Beasts & Monsters: settled, nothing organized · v5 | marks · [threat · crisis: any · no crisis: under_siege · no crisis: occupied · no guardPresence] | 5 · thorp–village | TRUE (script 0 false / 5) |  | True. |
| Beasts & Monsters: settled, nothing organized · v6 | marks · [threat · crisis: any · no crisis: under_siege · no crisis: occupied · no guardPresence] | 1 · thorp | TRUE (script 0 false / 1) |  | True; both prior towns silenced. |
| Invasion & War: walls AND professional garrison · v2 | marks · [no crisis: under_siege · no crisis: occupied] | 80 · town–metropolis | TRUE (script 0 false / 80) |  | True; LOW page disagreement with the posture block in 5 towns. LOW: In 5 towns the posture line (overall readiness) says e.g. "Lykotion could deal with a brawl  |
| Invasion & War: walls AND professional garrison · v3 | marks · [no crisis: occupied] | 126 · town–metropolis | TRUE (script 0 false / 126) |  | True; LOW page disagreements. LOW: 13 of 126 towns carry a posture line that disagrees (7 under siege: r2s-under_siege-city-1, rv2-city-under_siege-25, rv2-city |
| Invasion & War: walls with NO force · v1 | marks · [no watch · no mercenary · no crisis: under_siege · no crisis: occupied] | 7 · thorp–village | TRUE (script 0 false / 7) |  | True; "walls" = palisade. |
| Invasion & War: walls with NO force · v2 | marks · [no watch · no mercenary · no crisis: under_siege · no crisis: occupied] | 4 · thorp–village | TRUE (script 0 false / 4) |  | True. |
| Invasion & War: walls with NO force · v3 | marks · [no watch · no mercenary · no crisis: under_siege · no crisis: occupied] | 5 · thorp–hamlet | TRUE (script 0 false / 5) |  | True. |
| Invasion & War: walls with NO force · v4 | marks · [watch · no mercenary · no crisis: under_siege · no crisis: occupied] | 24 · town | TRUE (script 0 false / 24) |  | True. |
| Invasion & War: walls with NO force · v5 | marks · [watch · no mercenary · no crisis: under_siege · no crisis: occupied] | 28 · village–town | FALSE MED (script 1 false / 28) | CARRIED (false in the same towns with the base corpus) | rww-town-slave_revolt-1: "The only people on Tarkhanörtöö's walls are the watch on their rounds, and everyone knows that would not stop an army." — same tab: "the regular patrols have stopped" / "The watch has abandoned normal patrol patterns" / "everyone who keeps order is busy containing the revolt" vs "t |
| Invasion & War: walls with NO force · v6 | marks · [no watch · no mercenary · crisis: under_siege] | 1 · thorp | TRUE (script 0 false / 1) |  | True. |
| Invasion & War: neither walls nor force · v5 | marks · [threat · crisis: any · no watch · no crisis: under_siege · no crisis: occupied] | 8 · thorp–village | FALSE MED (script 1 false / 8) | CARRIED (false in the same towns with the base corpus) | rv2-village-monster_pressure-2: "With trouble at hand, Becanche has no wall to close and nobody trained to send, and each household is deciding for itself whether to stay." — record: Adventurers' charter hall; same tab Guard assessment: "The adventurers' charter hall coordinates emergency response to threats. Effective for monster in |
| Invasion & War: neither walls nor force · v9 | marks · [watch · threat · crisis: any · no crisis: occupied] | 4 · town | FALSE HIGH (script 1 false / 4) | OWN (prints there only because of the stage: 1 town(s)) | r2s-monster_pressure-town-2: "With trouble at hand, Velipol's watch is all the town has to send, and there is no wall to send it to." — facts: mercenary=true (Free company hall); same tab: "A mercenary company provides enforcement" / "The free company at Velipol keeps its own muster roll" vs "th |
| Economic Survival: STRONG · v2 | marks · [no crisis] | 34 · town–metropolis | TRUE (script 0 false / 34) |  | True; all 34 calm, prosperity Comfortable or above. |
| Invasion & War: neither walls nor force · v7 | carried-59 · [watch · no threat · crisis: any] | 15 · village–town | FALSE HIGH (script 3 false / 15) | CARRIED (false in the same towns with the base corpus) | r2r-town-50: "Saraibuurt has no wall and no soldiers; its watch keeps the peace in the streets and would be no answer to an army." — facts: mercenary=true (Free company hall); same tab: "A mercenary company provides enforcement" / "The free company at Saraibuurt keeps its own muster roll ...  |
| Economic Survival: WEAK · v5 | carried-59 · [no guardPresence] | 43 · thorp–village | FALSE MED (script 3 false / 43) | CARRIED (false in the same towns with the base corpus) | r2r-hamlet-4: "If Gantulgaiin ever had to hire people to defend it, it would have to borrow the money first." — defenseProfile charter=[Adventurers' charter hall]; page: "It posts bounties, houses monster hunters, and takes up the local defence no garrison is here to keep |

## DS-DEF-3

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| Moderate · v1 | reworded · [guardPresence] | 27 · thorp–metropolis | FALSE MED (script 10 false / 27) | CARRIED (false in the same towns with the base corpus) | r2r-thorp-26: "Bregya keeps a working balance: the law is present, so is crime, and neither has the upper hand." — thorp of 15; Guard assessment 'Nobody here is paid to keep order'; 'there is no court'; Internal Security Critical |
| Moderate · v3 | marks · [tier: ≥ village] | 38 · village–metropolis | TRUE (script 0 false / 38) |  |  |
| COMPOUND: political fracture · v4 | carried-59 · [colour] | 5 · hamlet–village | TRUE (script 0 false / 5) |  | Neighbouring Criminal Architecture line says 'which power controls a district' in a hamlet of 49 (not this line). |

## DS-DEF-5

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| walls PRESENT · v7 | reworded · [no gate · no crisis: under_siege] | 42 · thorp–village | TRUE (script 0 false / 42) |  | Earthworks called a 'wall' is acceptable. |
| arcane defense PRESENT · v1 | reworded · [colour] | 99 · hamlet–metropolis | FALSE MED (script 13 false / 99) | CARRIED (false in the same towns with the base corpus) | r2s-famine-city-3: "Its defence is not all arms: some of what protects the city is magic." — magicDef = Alchemist quarter only; next block 'Arcane Support None: No arcane practitioners on the rolls. Wards, detection and counterspell are beyond this sett |
| arcane defense PRESENT · v2 | reworded · [gate] | 82 · town–metropolis | TRUE (script 0 false / 82) |  | LOW in 10 alchemy-only towns: r2r-city-40, r2r-metropolis-26, r2s-monster_pressure-town-1, r2s-religious_conversion-city-0, r2s-religious_conversion-metropolis- |
| arcane defense PRESENT · v3 | reworded · [colour] | 131 · hamlet–metropolis | TRUE (script 0 false / 131) |  | LOW in 24 alchemy-only towns (Arcane Support None): r2r-city-16, r2r-city-4, r2r-metropolis-10, r2r-metropolis-13, r2r-metropolis-15, r2r-metropolis-23, r2r-met |
| ARCANE: mages' guild · v1 | reworded · [] | 54 · city–metropolis | TRUE (script 0 false / 54) |  | Smallest tier reached is city. |
| ARCANE: mages' guild · v2 | reworded · [] | 64 · town–metropolis | TRUE (script 0 false / 64) |  |  |
| ARCANE: alchemists · v1 | reworded · [] | 55 · town–metropolis | TRUE (script 0 false / 55) |  | Where Arcane Support reads None the alchemy claim itself stays true. |
| ARCANE: alchemists · v2 | reworded · [] | 62 · town–metropolis | TRUE (script 0 false / 62) |  |  |
| garrison PRESENT · v3 | marks · [gate · no crisis: under_siege] | 80 · town–metropolis | TRUE (script 0 false / 80) |  | Agrees with the page's 'gate tally' lines. |
| NO organized force at all · v1 | marks · [no crisis: under_siege · no crisis: wartime · no crisis: occupied] | 83 · thorp–village | TRUE (script 0 false / 83) |  | LOW: r2s-monster_pressure-thorp-1, r2s-recently_betrayed-thorp-3, r2s-recently_betrayed-village-1. |
| NO organized force at all · v2 | marks · [no crisis: under_siege · no crisis: wartime · no crisis: occupied] | 81 · thorp–village | FALSE MED (script 8 false / 81) | CARRIED (false in the same towns with the base corpus) | r2r-hamlet-36: "If Nahrmandi were attacked, its people would fight with no leaders and no plan, each household for itself." — monster_pressure: same tab 'The beasts give Nahrmandi no rest between attacks' and 'the attackers seem to know it' — 'If Nahrmandi were attacked' presumes it is |
| NO organized force at all · v3 | marks · [no crisis: under_siege · no crisis: wartime · no crisis: occupied] | 92 · thorp–village | FALSE MED (script 3 false / 92) | CARRIED (false in the same towns with the base corpus) | r2s-recently_betrayed-village-0: "Nobody at Dawan is responsible for defending the village; ask who is, and nobody can name anyone." — same tab Military status: 'Those who keep Dawan safe are questioning everyone who could have reached what was sold' |
| NO organized force at all · v4 | marks · [crisis: under_siege] | 6 · thorp–village | TRUE (script 0 false / 6) |  | Now siege-only. |
| NO organized force at all · v5 | marks · [crisis: under_siege] | 9 · thorp–village | TRUE (script 0 false / 9) |  |  |

## DS-DEF-9

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| magicDependency true, with a NAMED dependent chain · v1 | reworded · [] | 75 · village–metropolis | TRUE (script 0 false / 75) |  | LOW: rv2-city-under_siege-24. |
| magicDependency true, with a NAMED dependent chain · v2 | reworded · [] | 69 · village–metropolis | TRUE (script 0 false / 69) |  |  |
| magicDependency true, with a NAMED dependent chain · v3 | reworded · [] | 84 · village–metropolis | TRUE (script 0 false / 84) |  |  |
| magicDependency false · v2 | reworded · [magic] | 157 · thorp–metropolis | TRUE (script 0 false / 157) |  | LOW where reliance reads Present with common roles: r2r-town-11, r2s-insurgency-village-2, rv2-town-indebted-2, rww-village-under_siege-1 |
| magicDependency true · v4 | carried-59 · [] | 37 · village–metropolis | FALSE MED (script 20 false / 37) | CARRIED (false in the same towns with the base corpus) | r2r-village-14: "Skaldaker does better than its ground and roads would explain, and the reason is the arcane work done here." — Economics: 'The village is poor, and its people say so'; Magic: 'supplied by House of worship', 'Economic role: absent' |

## DS-DEF-12

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| CAPACITY: enough · v2 | reworded · [food: ≥ pressured] | 6 · thorp–village | FALSE MED (script 3 false / 6) | CARRIED (false in the same towns with the base corpus) | r2r-thorp-23: "What Zelenosk raises covers an ordinary year and no more, so one bad harvest would leave it short before spring." — Outlook: 'Zelenosk grows less than it eats, and nothing from outside makes up the difference'; food ratio 0.93 |
| CAPACITY: enough · v3 | reworded · [] | 47 · thorp–town | FALSE HIGH (script 26 false / 47) | OWN in 19 town(s) where it prints only because of the stage; CARRIED in 7 | r2r-thorp-17: "People at Chichich make do with what they have; a good year is comfortable and a bad one is lean." — famine; 'Food: Deficit — Active Famine'; next block 'The winter ahead will be hungry' |
| CAPACITY: enough · v1 | marks · [food: ≥ pressured] | 8 · thorp–village | FALSE MED (script 8 false / 8) | CARRIED (false in the same towns with the base corpus) | r2s-succession_void-thorp-2: "No dependable road, river or port reaches Tulummal, and the thorp gets by on its own: enough for an ordinary year, with little to spare." — Outlook: 'its own land does not grow enough; the rest comes from its stores and from magic' |

## DS-DEF-11

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| WALLED-STRAINED · v3 | reworded · [no soldiers · crisis: under_siege] | 5 · thorp | TRUE (script 0 false / 5) |  | Only thorps reach it. |
| WALLED-STRAINED · v4 | reworded · [crisis: under_siege] | 43 · thorp–metropolis | TRUE (script 0 false / 43) |  |  |
| WALLED-STRAINED · v6 | reworded · [no guardPresence · no crisis: under_siege · no crisis: occupied] | 5 · thorp–village | TRUE (script 0 false / 5) |  |  |
| WALLED-STRAINED · v7 | reworded · [guardPresence · no watch · no crisis: under_siege · no crisis: occupied] | 26 · thorp–village | TRUE (script 0 false / 26) |  | LOW with charter hall: r2r-hamlet-3, r2r-hamlet-41, r2r-village-23, r2r-village-46; Power tab 'weak defences' vs 'sound' is a nuance. |
| UNWALLED-SMALL · v4 | reworded · [no threat · crisis: any] | 88 · thorp–village | TRUE (script 0 false / 88) |  | LOW (founding 'piracy and coastal raids'): r2r-hamlet-19, r2r-hamlet-4, r2s-mass_migration-thorp-0. No monster_pressure/siege/occupied town reaches it. |

## DS-ECO-1

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| COMBINATION C3: the middle rungs · v2 | reworded · [] | 40 · thorp–metropolis | TRUE (script 0 false / 40) |  | 24 of 40 are Comfortable; 'thin margin' under a Comfortable header with a high Output is a LOW stretch only |
| COMBINATION C4: a low rung on a working approach · v1 | reworded · [no crisis: under_siege · no crisis: plague_onset] | 97 · thorp–metropolis | TRUE (script 0 false / 97) |  | true everywhere |
| COMBINATION C4: a low rung on a working approach · v4 | reworded · [crisis: under_siege] | 27 · thorp–metropolis | FALSE MED (script 2 false / 27) | CARRIED (false in the same towns with the base corpus) | r2s-under_siege-city-0: "With the siege closing every way in, Bellaurbs has lost what passing trade used to leave behind, and the city feels the loss." — record economicViability.foodBalance.importCoverage=6422, importChannel 'teleportation circle'; page 'Production ... + 6,422 imported' and 'ships bring in a lit |
| COMBINATION C4: a low rung on a working approach · v5 | reworded · [crisis: under_siege] | 22 · thorp–metropolis | FALSE MED (script 1 false / 22) | CARRIED (false in the same towns with the base corpus) | rv2-metropolis-under_siege-22: "The siege has stopped Innisheath's trade moving at all, and the money that trade brought in has stopped with it." — importCoverage 10,833/43,278 via 'teleportation circle'; page '+ 10,833 imported', 'carts bring in a little of the rest': trade has not stopped 'at all' |
| COMBINATION C4: a low rung on a working approach · v7 | reworded · [crisis: under_siege] | 22 · thorp–metropolis | TRUE (script 1 false / 22) |  | the one script miss reads LOW: passing traffic has stopped; teleport food is not transit money. The 2 Defense-view hits in prints are another line matched by th |
| COMBINATION C4: a low rung on a working approach · v2 | marks · [no crisis: under_siege · no crisis: plague_onset] | 110 · thorp–metropolis | TRUE (script 0 false / 110) |  | true |
| COMBINATION C4: a low rung on a working approach · v3 | marks · [market · no crisis: under_siege · no crisis: plague_onset] | 41 · hamlet–metropolis | FALSE MED (script 16 false / 41) | CARRIED (false in the same towns with the base corpus) | r2s-occupied-metropolis-1: "Dionpetra's market sells little, though the crossroads is busy; most of the traffic does not stop, and the traders here are poor." — record: District markets (5-10), Multiple market squares, Major annual fairs; first Income line right below: 'Market Taxes 21% ... a major civic revenue stream  |
| COMBINATION C4: a low rung on a working approach · v6 | marks · [no market · no crisis: under_siege · no crisis: plague_onset] | 84 · thorp–village | TRUE (script 0 false / 84) |  | agrees with the page's 'No market or fair stands' line |

## DS-ECO-6

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| TIER: a large share off the books (≥30) · v2 | reworded · [dm-only · colour] | 29 · village–metropolis | TRUE (script 0 false / 29) |  | dm-only colour; true |
| TIER: minor shadow activity (≥3) · v0 | marks · [no organised crime · no crisis: famine · no crisis: under_siege] | 54 · thorp–town | TRUE (script 4 false / 54) |  | the 4 script misses hold only a fence or an outlaw shelter: LOW |

## DS-ECO-9

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| SECURE · v1 | reworded · [no hunger] | 233 · thorp–metropolis | TRUE (script 0 false / 233) |  | true |
| SECURE · v3 | reworded · [no hunger · stores: < 12] | 170 · thorp–city | TRUE (script 0 false / 170) |  | true |
| SECURE · v6 | new · [no hunger · stores: >= 12] | 28 · metropolis | TRUE (script 0 false / 28) |  | 18/28 pages carry the generator's 'nothing to spare against a bad year' two lines above: that sentence, not this one, misleads (LOW) |
| SECURE · v7 | new · [no hunger · stores: >= 12] | 35 · metropolis | TRUE (script 0 false / 35) |  | 25/35 pages carry the contradicting generator line above it (LOW, this line is the true one) |
| HOW THE NEED IS MET: much of it brought in · v3 | reworded · [no crisis: plague_onset] | 92 · thorp–metropolis | TRUE (script 0 false / 92) |  | true |
| HOW THE NEED IS MET: part of it by magic · v1 | reworded · [colour] | 74 · thorp–metropolis | FALSE MED (script 2 false / 74) | CARRIED (false in the same towns with the base corpus) | r2s-insurgency-thorp-2: "Not all of Uaymkin's food is grown or bought: some of what the thorp eats is provided by spell or by prayer, and the thorp would go shorter " — foodRecord.magicPct=1 but foodSecurity.magicOffset=0, magicSupplement=0; page 'Production: 17 lbs/day+ 1 importedNeed: 18' - no provision at all |
| HOW THE NEED IS MET: part of it by magic · v2 | reworded · [colour] | 46 · thorp–metropolis | FALSE MED (script 1 false / 46) | CARRIED (false in the same towns with the base corpus) | r2s-occupied-thorp-2: "Part of Shanxian's food is neither grown nor bought, and the table would be thinner without it." — magicPct=1, magicOffset=0; page 'Production: 63 lbs/day+ 3 importedNeed: 67' - nothing is neither grown nor bought |
| HOW THE NEED IS MET: part of it by magic · v3 | reworded · [colour] | 55 · thorp–metropolis | TRUE (script 0 false / 55) |  | true |
| FOOD SOURCES: one source · v1 | reworded · [no crisis: famine] | 140 · thorp–metropolis | TRUE (script 0 false / 140) |  | true |
| FOOD SOURCES: one source · v2 | reworded · [colour] | 192 · thorp–metropolis | TRUE (script 0 false / 192) |  | true; the missing famine guard matters only as tone |
| FOOD SOURCES: one source · v3 | reworded · [no crisis: famine] | 116 · thorp–metropolis | TRUE (script 0 false / 116) |  | true |
| HOW THE NEED IS MET: much of it brought in · v1 | marks · [no crisis: plague_onset] | 80 · thorp–metropolis | TRUE (script 0 false / 80) |  | 13 port towns say 'Food carts' while the food line says ships - LOW at most |
| HOW THE NEED IS MET: much of it brought in · v2 | marks · [no crisis: plague_onset] | 79 · thorp–metropolis | FALSE MED (script 9 false / 79) | CARRIED (false in the same towns with the base corpus) | rv2-thorp-famine-1: "The thorp grows only part of what it eats; the rest comes in from the farms around it and from trade." — gapPct 29: 'Many households go short' vs 'the rest comes in' |
| DEFICIT · v5 | carried-59 · [crisis: under_siege] | 22 · thorp–metropolis | FALSE MED (script 4 false / 22) | CARRIED (false in the same towns with the base corpus) | rw3-metropolis-under_siege-1: "Nothing has come into Hochfurt since the siege closed the roads, and what the metropolis can still grow is not near enough." — importCoverage 68,834 via 'airship runs (impaired by siege)'; page '+ 68,834 imported' and 'carts bring in a little of the rest' just above |
| IMPORT-DEPENDENT · v5 | carried-59 · [crisis: under_siege] | 3 · hamlet–metropolis | FALSE MED (script 2 false / 3) | CARRIED (false in the same towns with the base corpus) | r2s-under_siege-city-0: "Whatever Bellaurbs used to buy for its table, none of it has come since the siege closed the roads." — '+ 6,422 imported', 'ships bring in a little of the rest' two lines above; channel teleportation circle |

## DS-SUP-2

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| UPSTREAM WEAK: a chain the town's work draws on is failing · v1 | reworded · [colour] | 90 · town–metropolis | TRUE (script 0 false / 90) |  | 75/90 named chains are only 'vulnerable'; 'in trouble itself' is a stretch there (LOW) |
| UPSTREAM WEAK: a chain the town's work draws on is failing · v2 | reworded · [colour] | 81 · town–metropolis | TRUE (script 0 false / 81) |  | 72/81 'vulnerable' (LOW stretch) |

## DS-ECO-10

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| POSTURE: entrepot · v4 | reworded · [crisis: under_siege] | 5 · city–metropolis | TRUE (script 0 false / 5) |  | true |
| POSTURE: established · v1 | reworded · [no hunger] | 95 · thorp–metropolis | TRUE (script 0 false / 95) |  | true |
| POSTURE: established · v3 | reworded · [no crisis: under_siege · no crisis: famine] | 100 · thorp–metropolis | TRUE (script 0 false / 100) |  | true |
| POSTURE: established · v5 | reworded · [no crisis: under_siege] | 110 · thorp–metropolis | TRUE (script 0 false / 110) |  | true |
| POSTURE: established · v7 | reworded · [crisis: under_siege] | 24 · hamlet–metropolis | TRUE (script 0 false / 24) |  | true |
| POSTURE: vulnerable · v1 | marks · [no crisis: under_siege] | 8 · town–metropolis | TRUE (script 1 false / 8) |  | adjudged LOW: true of the record (isolated route); the contradicting "carts bring in" is a generator food line, itself false (teleport/airship) |
| POSTURE: vulnerable · v2 | marks · [no crisis: under_siege] | 0 ·  | NEVER PRINTS (script 0 false / 0) |  | no prints |
| POSTURE: vulnerable · v3 | marks · [no crisis: under_siege] | 9 · town–metropolis | TRUE (script 7 false / 9) |  | adjudged LOW: as v1 |

## DS-ECO-11

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| EXPLOITATION: unexploited, exportValue: high · v1 | reworded · [] | 8 · thorp–town | FALSE MED (script 4 false / 8) | CARRIED (false in the same towns with the base corpus) | r2s-famine-thorp-2: "There is iron ore in Benham's country worth real money and nothing in the thorp works it." — same Economics tab, Income: 'Iron & Metalwork Local ore feeds the smithy directly' (10%) |
| EXPLOITATION: unexploited, exportValue: high · v2 | reworded · [] | 6 · thorp–village | FALSE MED (script 2 false / 6) | CARRIED (false in the same towns with the base corpus) | r2r-village-30: "Around Celono the iron ore lies unworked, and anyone who knows its price elsewhere will want to change that." — Income: 'Iron & Metalwork Local ore feeds the smithy directly' 11% |
| EXPLOITATION: unexploited, exportValue: medium or low · v1 | reworded · [] | 59 · thorp–metropolis | FALSE MED (script 55 false / 59) | CARRIED (false in the same towns with the base corpus) | r2s-plague_onset-thorp-2: "The thorp leaves its stone unworked. It would fetch barely enough to pay for the work." — Income: 'Stone Quarrying Local quarry provides dressed stone to regional builders' |
| EXPLOITATION: unexploited, exportValue: medium or low · v3 | reworded · [] | 61 · thorp–metropolis | FALSE MED (script 58 false / 61) | CARRIED (false in the same towns with the base corpus) | rv2-metropolis-wartime-1: "For as long as Dunfield has stood, its timber has been there to take, and nobody has found it worth the trouble." — Sawmill (commercial), Carpenters (5-15); Timber & Lumber running; exports 'Milled timber' |
| EXPLOITATION: partiallyExploited · v2 | reworded · [no crisis: under_siege] | 20 · hamlet–metropolis | FALSE MED (script 2 false / 20) | CARRIED (false in the same towns with the base corpus) | r2s-politically_fractured-city-0: "It sends its wool out half-finished, and nobody in the city is troubled by it." — Weavers/Textile workers, Fuller, Dyer all present; no wool export |
| EXPLOITATION: partiallyExploited · v5 | reworded · [crisis: under_siege] | 7 · hamlet–metropolis | TRUE (script 0 false / 7) |  | new wording drops the false 'nobody here can finish it' |
| EXPLOITATION: fullyExploited · v3 | reworded · [no crisis: under_siege] | 81 · thorp–metropolis | FALSE MED (script 8 false / 81) | CARRIED (false in the same towns with the base corpus) | rv2-thorp-indebted-1: "One of Indrawadi's trades is carried through here from start to finish, from what the country gives to the finished thing." — only grain is fully exploited, via 'Subsistence farming' + 'Access to external mill': no mill, baker or brewer in the thorp |

## DS-ECO-12

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| CRITICAL IMPORT: a house needs what the land lacks · v1 | reworded · [no crisis: under_siege] | 193 · hamlet–metropolis | FALSE MED (script 26 false / 193) | CARRIED (false in the same towns with the base corpus) | r2r-metropolis-18: "Some of Víkthorpe's work cannot go on without gold/silver ore, and the country around the metropolis produces none, so the metropolis buys f" — slot prints the catalogue label 'gold/silver ore' (26 towns) |
| CRITICAL IMPORT: a house needs what the land lacks · v2 | reworded · [no crisis: under_siege] | 197 · hamlet–metropolis | FALSE MED (script 20 false / 197) | CARRIED (false in the same towns with the base corpus) | r2s-occupied-metropolis-3: "Whatever gold/silver ore Rajigarh's work uses must come from elsewhere; when none comes, that work stands idle." — catalogue label 'gold/silver ore' in the slot |
| CRITICAL IMPORT: a house needs what the land lacks · v3 | reworded · [crisis: under_siege · stores: < 6] | 6 · village–metropolis | TRUE (script 0 false / 6) |  | true in all 6 |
| CRITICAL IMPORT: the land cannot give it · v1 | reworded · [colour] | 152 · thorp–city | FALSE MED (script 16 false / 152) | CARRIED (false in the same towns with the base corpus) | rww-town-calm-1: "The country around Drumton produces no grain, so the town has none but what it buys." — same tab Imports: 'Grain (a little, beside its own harvest)'; 'Agriculture modifier: 89%' |
| CRITICAL IMPORT: the land cannot give it · v2 | reworded · [colour] | 184 · thorp–city | FALSE MED (script 11 false / 184) | CARRIED (false in the same towns with the base corpus) | r2r-city-47: "None of the luxury goods used at Dagfjord comes from the country here; the city brings in what it uses, or goes without." — Produced locally: 'Luxury manufactured goods', 'Fine metalwork and jewelry' |
| CRITICAL IMPORT: the land cannot give it · v3 | reworded · [no imports] | 12 · thorp–hamlet | TRUE (script 0 false / 12) |  | new wording no longer says nothing comes in |
| INCOME WEIGHT: the religious houses · v3 | reworded · [no sacredHouse · no crisis: under_siege] | 40 · thorp–hamlet | TRUE (script 0 false / 40) |  | true in all 40 |
| INCOME WEIGHT: the religious houses · v4 | reworded · [no sacredHouse · no crisis: under_siege] | 40 · thorp–hamlet | TRUE (script 0 false / 40) |  | true in all 40 |
| INCOME WEIGHT: the religious houses · v1 | marks · [sacredHouse · tier: ≥ village] | 120 · village–metropolis | TRUE (script 23 false / 120) |  | adjudged LOW: "the religious houses" plural for one parish church: number of a generic noun, the claim itself true |
| INCOME WEIGHT: the religious houses · v2 | marks · [sacredHouse · tier: ≥ village] | 114 · village–metropolis | TRUE (script 26 false / 114) |  | adjudged LOW: as v1 |

## DS-GEN-13

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| MARKET-OPEN · v3 | reworded · [crisis: any · no crisis: under_siege] | 87 · hamlet–metropolis | FALSE MED (script 7 false / 87) | OWN in 2 town(s) where it prints only because of the stage; CARRIED in 5 | r2s-plague_onset-hamlet-1: "Visitors find Weichsee's market without asking." — plague_onset; Defense: "Weichsee is closed against the sickness, not an army: the guards turn back travellers and traders alike" |
| MARKET-OPEN · v6 | new · [crisis: plague_onset] | 5 · city–metropolis | TRUE (script 0 false / 5) |  | Prints only under plague, city/metropolis only. |
| NO-MARKET · v4 | new · [crisis: under_siege] | 13 · thorp–village | TRUE (script 0 false / 13) |  | Overview clips the siege clause; the clipped sentence is true in all. |
| NO-MARKET · v5 | new · [crisis: under_siege] | 13 · thorp–village | TRUE (script 0 false / 13) |  | Clipped; true. |
| NO-MARKET · v6 | new · [crisis: under_siege] | 4 · thorp–hamlet | TRUE (script 0 false / 4) |  | Clipped; true. |
| MARKET-OPEN · v1 | marks · [no crisis: under_siege · no crisis: plague_onset · crisis: any · tier: ≤ town] | 27 · hamlet–town | TRUE (script 0 false / 27) |  | LOW: one famine town; one monster_pressure town ("carts stop coming"). |
| MARKET-OPEN · v2 | marks · [crisis: any · no crisis: under_siege · no crisis: plague_onset] | 97 · hamlet–metropolis | TRUE (script 0 false / 97) |  | True; through-traffic itself is not recorded (transit [] everywhere). |
| MARKET-OPEN · v4 | marks · [crisis: any · no crisis: under_siege] | 99 · hamlet–metropolis | TRUE (script 0 false / 99) |  | Historic siting; true under every crisis it reaches. |
| ENTREPOT · v1 | marks · [crisis: any · no crisis: under_siege] | 67 · hamlet–metropolis | FALSE MED (script 1 false / 67) | CARRIED (false in the same towns with the base corpus) | r2s-plague_onset-city-0: "Novono's market handles more than the city could ever use." — Defense: "Nobody comes into Novono and nobody leaves" |
| NO-MARKET · v1 | marks · [gate · institution: tavern · no crisis: under_siege] | 0 ·  | NEVER PRINTS |  | No town draws it at the tip. |
| NO-MARKET · v2 | marks · [gate · institution: tavern · no crisis: under_siege] | 0 ·  | NEVER PRINTS |  | No town draws it at the tip. |
| NO-MARKET · v3 | marks · [no crisis: under_siege] | 361 · thorp–village | TRUE (script 0 false / 361) |  | True. LOW: 4 famine towns print "The market still opens" on the same Overview (that vignette is wrong); 131 towns keep a festival named "The ... Fair" in Tradit |
| COMMERCE: a bank · v1 | marks · [no crisis: under_siege] | 52 · town–metropolis | TRUE (script 0 false / 52) |  | True. |
| COMMERCE: a merchant guild, no bank · v1 | marks · [no crisis: under_siege] | 40 · town–metropolis | TRUE (script 2 false / 40) |  | adjudged LOW: a habitual description under a plague closure |
| COMMERCE: a merchant guild, no bank · v2 | marks · [no crisis: under_siege] | 41 · town–metropolis | TRUE (script 0 false / 41) |  | True. |
| COMMERCE: a merchant guild, no bank · v4 | marks · [no crisis: under_siege] | 22 · town–metropolis | TRUE (script 0 false / 22) |  | True. |
| COMMERCE: craft guilds, no merchant guild · v4 | marks · [no crisis: under_siege] | 15 · town–metropolis | TRUE (script 0 false / 15) |  | True. |
| WAREHOUSES · v1 | marks · [no crisis: under_siege] | 84 · town–metropolis | TRUE (script 0 false / 84) |  | True; LOW in 2 sealed plague cities ("Nobody comes into X"). |
| WAREHOUSES · v3 | marks · [no crisis: under_siege] | 83 · town–metropolis | FALSE MED (script 5 false / 83) | CARRIED (false in the same towns with the base corpus) | r2s-famine-city-1: "Its warehouses fill after the harvest and empty through the year as the city trades out of them." — famine; Overview: "The crops failed, and only about a third of the usual harvest will come in"; Crisis: "lost its harvest for a second season" |
| WAREHOUSES · v4 | marks · [no crisis: under_siege] | 72 · town–metropolis | TRUE (script 3 false / 72) |  | adjudged LOW: a habitual description under a plague closure |

## DS-GEN-14

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| FOUNDED-YOUNG · v3 | reworded · [] | 33 · thorp–town | TRUE (script 0 false / 33) |  | ages 21-60 in all 33 |

## DS-GEN-16

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| LEGACY-UNRESOLVED · v1 | reworded · [] | 227 · thorp–metropolis | FALSE MED (script 14 false / 227) | OWN (the rewording's "The {calamity} is" (agreement)) | rv2-town-occupied-1: "The plague years is a generation old, and it left a legacy of trouble in Padmanand that has never been fully put right." — "The plague years is": plural event name with singular verb |
| LEGACY-UNRESOLVED · v2 | reworded · [] | 198 · thorp–metropolis | FALSE MED (script 9 false / 198) | OWN (idem) | False only on agreement (9 towns). Worst: MED. |
| LEGACY-RECOVERED · v1 | reworded · [] | 76 · thorp–metropolis | FALSE MED (script 6 false / 76) | OWN (the rewording's "which is" (agreement)) | r2r-thorp-44: "Tikalahau came through the plague years, which is older than its bearers now; its legacy is what the thorp built in answer to it, and that s" — "the plague years, which is": agreement; annotation 156y "hit the settlement hard, and it has since recovered" |
| LEGACY-RECOVERED · v2 | reworded · [] | 67 · thorp–metropolis | FALSE MED (script 5 false / 67) | OWN (idem) | r2s-politically_fractured-metropolis-2: "The plague years is older than its bearers, and its legacy is much of what stands in Xinwan now: it was built in the years after." — "The plague years is": agreement |
| LEGACY-SHIFTED · v1 | reworded · [] | 133 · thorp–metropolis | FALSE MED (script 12 false / 133) | OWN (idem) | False only on agreement (12). Worst: MED. |
| LEGACY-SHIFTED · v2 | reworded · [] | 147 · thorp–metropolis | FALSE MED (script 15 false / 147) | OWN (idem) | False only on agreement (15). Worst: MED. |
| LEGACY-LINKED · v1 | reworded · [] | 0 ·  | NEVER PRINTS |  | No town draws it at the tip. |
| LEGACY-LINKED · v2 | reworded · [] | 0 ·  | NEVER PRINTS |  | No town draws it at the tip. |

## DS-GEN-17

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| GARRISONED · v1 | reworded · [no crisis: occupied] | 107 · village–city | TRUE (script 13 false / 107) |  | adjudged LOW: a watch is people under arms; the contradiction with "no soldiers" is soft |
| GARRISONED · v2 | marks · [walls · no crisis: occupied] | 73 · town–city | TRUE (script 0 false / 73) |  | True. Spells "defense" where v1 spells "defence". |
| GREAT HOUSE: monastery · v1 | marks · [institution: monastery · no crisis: under_siege] | 27 · town–metropolis | TRUE (script 0 false / 27) |  | True. |
| GREAT HOUSE: monastery · v3 | marks · [institution: monastery · no crisis: under_siege] | 33 · town–metropolis | TRUE (script 1 false / 33) |  | adjudged LOW: a habitual description under a plague closure |

## DS-GEN-18

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| STALLED · v2 | reworded · [no crisis: under_siege] | 144 · village–metropolis | TRUE (script 0 false / 144) |  | generic and true; 40 LOW where the stalled feed is in fact made locally |
| STALLED · v3 | new · [no crisis: under_siege] | 202 · hamlet–metropolis | FALSE MED (script 1 false / 202) | OWN (new line) | r2s-succession_void-hamlet-2: "No trade at Weichturm makes what some of its work needs, so that much is always bought in." — same tab: 'Imports: No recorded imports'; 'the road in is too poor to bring anything extra'; Produced locally includes stone |
| STALLED · v4 | new · [crisis: under_siege] | 36 · village–metropolis | TRUE (script 0 false / 36) |  | true in all 36 |
| BOUGHT-IN · v1 | reworded · [no crisis: under_siege] | 107 · thorp–metropolis | TRUE (script 0 false / 107) |  | new wording true wherever the good is an import row |
| BOUGHT-IN · v4 | reworded · [no crisis: under_siege] | 106 · thorp–metropolis | FALSE MED (script 6 false / 106) | CARRIED (false in the same towns with the base corpus) | r2r-metropolis-20: "Ask where Anba gets its stone and you are pointed at the carts, not at anyone in the metropolis." — Institutions: 'Stone quarry' |
| BOUGHT-IN · v9 | reworded · [no crisis: under_siege] | 113 · thorp–metropolis | TRUE (script 41 false / 113) |  | adjudged LOW: "much ... came from elsewhere": the reader's own 2:1 threshold; the record cannot settle "much" |
| BOUGHT-IN · v5 | marks · [guild · tier: ≥ village · no crisis: under_siege] | 23 · village–metropolis | FALSE MED (script 2 false / 23) | CARRIED (false in the same towns with the base corpus) | r2r-village-25: "Much of the work in Lagosinum's workshops begins with unloading a cart." — workshops are Mill and Blacksmith on local iron ('Produced locally: iron, metalwork'); imports only Salt, Incense, Parchment |

## DS-POW-4

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| riskLabel: Holding · v3 | reworded · [] | 93 · hamlet–metropolis | FALSE MED (script 1 false / 93) | CARRIED (false in the same towns with the base corpus) | rv2-town-occupied-2: "The Church Council at Villaminus holds because no rival yet outweighs Church Council, and the weighing is done again every season." — Crisis tab: "The occupiers take the revenue, and local offices work only under their eye"; "the occupier's orders come through Aemilia Cato" - the council does  |
| riskLabel: Contested · v1 | reworded · [] | 64 · thorp–metropolis | TRUE (script 0 false / 64) |  | LOW: in 31/64 towns the challenger's displayed power bar is below the incumbent's (the weighing applies the legitimacy multiplier, page shows Collapsed/Critical |
| riskLabel: Contested · v3 | reworded · [] | 74 · thorp–metropolis | TRUE (script 0 false / 74) |  | 27/74 show the challenger with lower raw power than the incumbent; LOW only. |

## DS-POW-5

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| council · v3 | reworded · [no crisis: succession] | 229 · thorp–metropolis | TRUE (script 0 false / 229) |  | Disposition line; true by the record's lens. |
| theocracy · v3 | reworded · [] | 16 · village–metropolis | TRUE (script 0 false / 16) |  | LOW in 5 towns (r2r-metropolis-40, r2r-town-19, r2s-mass_migration-town-0, rv2-metropolis-mass_migration-1, rv2-town-insurgency-2) whose seat card carries a sec |
| FLAG: crimeIsGovt · v4 | reworded · [guardPresence] | 3 · town | TRUE (script 0 false / 3) |  | Reword cures the prior page conflict. |
| council · v1 | marks · [no ruler: lord] | 105 · thorp–metropolis | FALSE HIGH (script 19 false / 105) | CARRIED (false in the same towns with the base corpus) | r2r-hamlet-24: "Decisions at Jayakota are slow because the whole Headman's Authority must agree, and once made they are rarely undone." — Power tab: Headman's Authority "↳1 member · first Vinod Deshpande", "A headman settles disputes and gives the orders here." |
| council · v2 | marks · [no ruler: lord] | 117 · thorp–metropolis | FALSE HIGH (script 20 false / 117) | CARRIED (false in the same towns with the base corpus) | r2s-famine-village-1: "At Humen the village's business goes to the whole Headman's Authority, and everybody has learned how long the answer takes." — Headman's Authority: "A headman settles disputes and gives the orders here." |
| council · v4 | marks · [no ruler: lord] | 105 · thorp–metropolis | FALSE HIGH (script 24 false / 105) | OWN in 2 town(s) where it prints only because of the stage; CARRIED in 22 | r2r-village-21: "The Headman's Authority at Rotbrücke has left obvious decisions untaken because its members cannot agree on them." — siege village; Headman's Authority "its members cannot agree" vs "A headman ... gives the orders here" |
| FLAG: merchantArmy · v1 | marks · [no crisis: occupied] | 12 · town–metropolis | TRUE (script 1 false / 12) |  | True; LOW under siege. |
| FLAG: merchantArmy · v2 | marks · [mercenary · no crisis: occupied] | 7 · city–metropolis | FALSE MED (script 2 false / 7) | CARRIED (false in the same towns with the base corpus) | rv2-city-under_siege-4: "Order at Taigang is kept by a private army of hired swords on the trading houses' pay. They answer to whoever pays them, not to the Merchant" — Defense, under siege: "The garrison keeps order, and more harshly as the food runs down." |

## DS-POW-6

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| capture pressure ADVANCING (weak security, poor prosperity) · v6 | reworded · [dm-only · tier: ≥ village · crisis: wartime] | 6 · village–metropolis | TRUE (script 0 false / 6) |  | True. |
| capture pressure ADVANCING (weak security, poor prosperity) · v7 | reworded · [dm-only · tier: ≥ village · watch · no crisis: threat · no crisis: wartime · no crisis: insurgency · no crisis: slave_revolt] | 13 · town–metropolis | TRUE (script 0 false / 13) |  | True. |
| capture reached an AGENT of a faction · v1 | reworded · [dm-only] | 18 · hamlet–metropolis | TRUE (script 0 false / 18) |  | True (page only, dm). |
| capture reached an AGENT of a faction · v3 | reworded · [dm-only] | 20 · town–metropolis | TRUE (script 0 false / 20) |  | True. |
| operation role duty evasion · v1 | reworded · [no crisis: under_siege] | 50 · town–metropolis | TRUE (script 0 false / 50) |  | True. |
| operation role duty evasion · v3 | reworded · [no crisis: under_siege] | 67 · town–metropolis | TRUE (script 0 false / 67) |  | True. |
| GM ADVISORY: the commander is a political actor · v4 | reworded · [dm-only · colour] | 23 · village–metropolis | TRUE (script 0 false / 23) |  | True. |
| capture pressure ADVANCING (weak security, poor prosperity) · v1 | marks · [dm-only · tier: ≥ village · no crisis: threat · no crisis: wartime · no watch] | 2 · village | TRUE (script 0 false / 2) |  | True. |
| capture pressure ADVANCING (weak security, poor prosperity) · v2 | marks · [dm-only · tier: ≥ village · no crisis: threat · no crisis: wartime · no watch] | 68 · village | TRUE (script 0 false / 68) |  | "Each season it gets easier" is the ADVANCING pool reading; no change band in the record (LOW at most). |
| capture pressure ADVANCING (weak security, poor prosperity) · v5 | marks · [dm-only · tier: ≥ village · crisis: threat] | 29 · village–metropolis | FALSE MED (script 10 false / 29) | CARRIED (false in the same towns with the base corpus) | r2s-occupied-village-0: "Whoever holds Spitzfeld's streets now, nobody is watching its officials, and they are paid poorly enough to be bought." — every occupied page: "The occupiers take the revenue, and local offices work only under their eye." |
| capture pressure ADVANCING (weak security, poor prosperity) · v8 | marks · [dm-only · tier: ≥ village · watch · no crisis: threat · no crisis: wartime · no crisis: insurgency · no crisis: slave_revolt] | 27 · village–metropolis | TRUE (script 0 false / 27) |  | True. |
| capture pressure ADVANCING (weak security, poor prosperity) · v9 | marks · [dm-only · tier: ≥ village · crisis: threat] | 39 · village–metropolis | FALSE MED (script 9 false / 39) | CARRIED (false in the same towns with the base corpus) | rv2-town-occupied-2: "With everyone's mind on the present danger, nobody at Villaminus is watching its officials, and they are paid little enough to be bought." — "The occupiers take the revenue, and local offices work only under their eye." |
| operation role duty evasion · v2 | marks · [gate · no crisis: under_siege] | 66 · town–metropolis | TRUE (script 0 false / 66) |  | True. |
| GM ADVISORY: the commander is a political actor · v3 | marks · [dm-only · no crisis: occupied] | 9 · hamlet–city | TRUE (script 0 false / 9) |  | True. |

## DS-CND-1

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| DIRECTION: worsening · CRISIS: famine · v2 | reworded · [] | 10 · thorp–metropolis | TRUE (script 0 false / 10) |  | true in all 10 |

## DS-FTH-4

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| FLAG: heresySuppression: hunted · v1 | reworded · [institution: temple] | 3 · metropolis | TRUE (script 0 false / 3) |  | True; all three towns rely on arcane work, reconciled only by "against the faith" (LOW). |
| FLAG: heresySuppression: hunted · v3 | reworded · [colour] | 11 · hamlet–metropolis | TRUE (script 0 false / 11) |  | LOW in r2r-hamlet-55, r2s-succession_void-hamlet-0, rv2-town-indebted-1 (acceptance indifferent) and r2s-insurgency-town-0 (legality regulated). |
| FLAG: heresySuppression: hunted · v4 | reworded · [colour] | 10 · hamlet–metropolis | FALSE MED (script 4 false / 10) | CARRIED (false in the same towns with the base corpus) | rww-city-calm-1: "A charm worked in the open at Vysokoko is reported before nightfall, and whoever worked it is shunned by the faithful." — Magic tab: Wizard's tower (Jiri Vorobev), "Economic role: common", "Vysokoko does better than its ground and roads would explain, and the reason is the arcane w |
| FLAG: heresySuppression: preached · v3 | reworded · [colour] | 1 · metropolis | FALSE MED (script 1 false / 1) | CARRIED (false in the same towns with the base corpus) | r2r-metropolis-25: "The faithful at Mönkhköl hold that magic offends their faith, and a neighbour who works it is talked about, though not yet turned in." — Magic tab: availability common, Legality regulated, acceptance wary, Reliance Integral (Academy of magic, Mages' district, druids feed hunting/timber); Faith: " |
| FLAG: heresySuppression: preached · v5 | reworded · [colour] | 1 · hamlet | FALSE MED (script 1 false / 1) | CARRIED (false in the same towns with the base corpus) | r2s-wartime-hamlet-2: "A newcomer at Kaankin soon hears that the faithful count magic a heresy, and is watched until the neighbours are sure of them." — Magic tab: "Religious acceptance: indifferent", "Legality: regulated", availability moderate |
| FLAG: heresySuppression: hunted · v5 | carried-59 · [colour] | 8 · hamlet–metropolis | FALSE MED (script 3 false / 8) | CARRIED (false in the same towns with the base corpus) | r2s-occupied-metropolis-1: "The faithful of Dionpetra treat magic as heresy and hunt it as such: a suspicion is enough to bring the neighbours to the door." — Magic: Reliance Integral (Academy of magic, Enchanter's shop), Economic role common |

## DS-DEF-8

| line | kind · marks | prints · sizes | verdict | origin | worst false read / note |
|---|---|---|---|---|---|
| override: UNDER TRIBUTE · v4 | carried-59 · [no guardPresence] | 11 · thorp–village | FALSE MED (script 1 false / 11) | CARRIED (false in the same towns with the base corpus) | rww-village-indebted-1: "Quirigek keeps no defenders to pay, and the debt is one more reason it never will." — Guard assessment just above: 'The adventurers' charter hall exists on paper. Chronically underpaid and poorly equipped' |
| override: SECURITY COMPROMISED · v4 | carried-59 · [no guardPresence] | 4 · thorp–village | FALSE MED (script 2 false / 4) | CARRIED (false in the same towns with the base corpus) | r2s-recently_betrayed-thorp-1: "Grímberg has no defenders to reorganize after the betrayal, only households that now bar their doors and keep their own counsel." — line before: 'Those who keep Grímberg safe are questioning everyone who could have reached what was sold' |

