NOT CLEAR

# REVIEW-AGREE-3 — the agreement lane at faa20bc6c, a third independent review (2026-11-13)

Lane read: `lane/coherence-agree-2026-11-11` at `faa20bc6c` ("the tip"). Its base: `lane/integration-2026-11-07`
at `3575cf061` ("the line"; the merge base; the tip is 129 commits ahead of it). The reviewer changed nothing on either.

(The verdict is the first line and the findings are under STEP 9. Step 1 below was written and committed, in
1fcbaf1c6, before any review, hand-back or record of this lane was read.)

---

## STEP 1 — COLD, AS THE OWNER READS IT (written before any review was read)

### How the pages were made

Both trees birthed and rendered by the second-wave census machinery (`origin/lane/second-wave-census-2026-11-12`,
`census.sh`, unmodified): every dossier through the tree's own `OutputContainer` as the owner (premium, not
read-only, public prose stamped), every group and sub-tab clicked and every disclosure opened. 720 births per tree
(`seeds.txt`: 6 sizes x 60 with every dial random, plus 15 forced crises x 6 sizes x 4), 0 birth errors, 720 dumps
each, both runs exit 0. From those I READ forty towns side by side, line against tip: the Economy tab (income,
trade profile, produced locally, food security, the flow cards), Resources, Defense, Services (healing),
Overview/Crisis and Outlook. The forty seeds, chosen from the corpus table for coverage:

- by access, one of each size: river `r2r-thorp-0 r2r-hamlet-18 r2r-village-35 r2r-town-3 r2r-city-8 r2r-metropolis-8`;
  port `r2r-thorp-24 r2r-hamlet-1 r2r-village-2 r2r-town-4 r2r-city-2 r2r-metropolis-10`;
  crossroads `r2r-thorp-2 r2r-hamlet-0 r2r-village-6 r2r-town-13 r2r-city-4 r2r-metropolis-3`
- on the mountains, keeping a pass: `r2r-thorp-16 r2r-thorp-32 r2r-hamlet-42`; gaining one: `r2r-village-17`;
  mountain, no pass: `r2r-city-46`, `r2r-village-0` (isolated)
- off the mountains, the pass taken away: `r2r-hamlet-9 r2r-village-1 r2r-town-2 r2r-city-0 r2r-metropolis-1 r2r-thorp-6 r2r-thorp-17`
- crises: siege `r2s-under_siege-village-0 r2s-under_siege-town-0 r2s-under_siege-city-0`; famine
  `r2s-famine-hamlet-0 r2s-famine-town-0 r2s-famine-metropolis-0`; `r2s-plague_onset-town-0`, `r2s-wartime-city-0`
- isolated: `r2r-thorp-9`

### What the tip's page gets right that the line got wrong (read, and then counted on all 720)

- **The toll's name on the Economy tab.** The line's river and port towns carry a flow card "Strategic Crossroads
  Toll — From Strategic Crossroads" (village-35, village-2, town-3, city-8, city-2, metropolis-8/10). The tip prints
  "River Toll — River traffic" and "Harbour Dues — Harbour traffic". On the tip the toll chain stands only on
  crossroads (54), port (33) and river (54) towns; it is gone from road towns (city-0 and others).
- **The pass.** The line put a Defended Pass (and with it "Mountain Pass Control", "controls mountain passes") in
  132 of 720 towns off the mountains (hills 57, forest 27, plains 26, desert 13, riverside 9). The tip: 0 of 720
  pages off the mountains name a pass; all 29 tip pass-holders are mountain towns. The replacement resource is drawn
  from the pool (an Ancient Grove most often, iron, a managed forest), and the town's exports and produced-locally
  follow it (hamlet-9, village-1, thorp-6: "Sacred wood, Ritual components").
- **"Crossroads Position" off a crossroads.** The line named it in road towns (city-0, village-17, the siege village,
  the famine metropolis); the tip drops it with the toll that stood on it.
- **Income lines that said a surplus or local ore the town lacked** are re-worded where the record contradicts them
  ("Grain Sales … it eats more than it grows, so none is left to sell" in metropolis-3, city-0; "Iron imported" where
  there is no ore).

### What the tip's page still gets wrong — the list

T1. **The catalogue's toll name still prints off a crossroads — on the NPCs tab.** In 12 of 720 tip pages (all river
or port towns) an NPC's "Wants" line reads, for example (r2r-city-8, World/NPCs, the innkeeper Sükhbaatar Yorqin):
"Wants Take on more hands for Strategic Crossroads Toll at the coaching inn, and keep them busy all season."
Others: metropolis-8/16/46/49, town-29, famine-metropolis-3, insurgency-city-0, monster_pressure-city-0/3,
politically_fractured-city-1, slave_revolt-city-1. The stored record carries it in `npcs[].goal.short` (12 towns)
and `npcs[].goal.long` (17 towns), and `goal.short` also prints on the Summary tab, the tonight sheet, the session
view and the PDF's NPC section. Source: `src/generators/people/goals.js:431,433` fills `{chain}` from `ch.label`.
The line had it too (and everywhere else); the tip cured every other surface but this one.

T2. **A timber income line that says the timber is worked, beside "No one here works the timber" — made by the
tip in towns whose resources did not change.** r2r-thorp-32 (mountain, keeps its pass, same resources on both
trees): line "Timber Trade — Timber sourced from more distant forests …" (true: nobody works the timber); tip
"Timber Trade — Local forest provides sustainable timber revenue; managed felling and sawmilling keep production
consistent." beside, on the Resources tab, "Unexploited Mountain timber" and "No one here works the timber near
Hochsee." Cause: `src/generators/economy/economicState.js` (the Timber Trade desc) now gates on
`hasNearbyResource('managed_forest', 'timber')`, and the substring `timber` takes `mountain_timber`, worked or not.
Over 720: the pair "managed felling" + "No one here works the timber" stands in 51 tip pages and 51 line pages, but
9 towns enter and 9 leave; 6 of the 9 entrants (city-20, city-46, metropolis-38, thorp-32, town-12,
religious_conversion-thorp-1) have the same resources on both trees.

T3. **The coal line in towns with no forge.** "Iron & Metalwork — Local coal fires the forges, but the iron is bought
in" (a sentence the lane wrote, `LOCAL_COAL_LINE`) prints where the roster has no smith, forge, smelter or
metalworker (thorp-2, village-6, thorp-16 among the forty). On the line the same towns said "Local ore feeds the
smithy directly" — also false (no ore), and also with no smithy. The tip's sentence is truer about the ore and as
false about the forge. 52 towns enter this pattern, 51 of them leaving the "local ore" one.

T4. **Two store durations, newly disagreeing, in towns whose resources did not change.** r2r-thorp-37: "No granary;
two months in household stores." beside, on Defense, "household stores carry the thorp for about three months at
full rations" (line: two and two). r2s-famine-city-3: "a granary of eight months" beside "the granary would carry
the city for about nine months" (line: seven and seven). The cause is the tip's food record: a herd now counts as a
food source (thorp-37 `foodSecurity.activeChains` [] → ["Pastoral & livestock"], `storageMonths` 1.5 → 1.8), and
the two sentences round the one number differently. The mechanism stood on the line (561 of 720 line pages show
two durations); the tip moves the number and 10 more towns show it.

T5. **The gate tally beside the tip's no-gate sentence.** r2r-village-6 and r2r-hamlet-18 (palisade or earthworks):
the tip now says (Services) "The walls leave few ways in, so smugglers have to get past the citizen militia" — a
twin the lane wrote for walls with no gate of record — and drops "You come into X by a gate" from Defense, yet
Defense still prints "X is walled, and every arrival goes through a gate and into the gate tally". The kept
sentence is pool `walls PRESENT` vid 2, `src/data/dossierStateProse/defense.generated.js:3653`, marked `colour`,
not `gate`, so the gate filter does not see it. Over 720: "gate tally" and "few ways in" on one page, line 0, tip
22. The gate-tally sentence stood on the line; the no-gate sentence beside it is the tip's.

T6. **"What the land offers" says less.** The tip filters the terrain's strengths by the town's own resources
(`STRENGTH_SUPPORT`). 80 of 720 tip pages lose "✓ Agriculture" that the line printed; 38 of those 80 earn
Agricultural Rents ("Payments in kind or coin from tenant farmers") — village-35 earns 92% from it, feeds itself
(389 lbs/day against 360) and the tip's land "offers" only River trade. In town-3, siege-town-0 and city-0 the
"What the land offers" heading disappears entirely. A thorp in a forest no longer "offers" timber (true: it holds
none). Mostly truer; where the town lives by tenant farming, less.

T7. **Labels that move toward danger, read on the forty.** Only r2r-city-46 moves a label (Well-Defended →
Fortress, Approved → Endorsed: toward safety). On all 720 there are 8 danger-ward moves in 7 towns: readiness
Vulnerable → Undefended (village-22, wartime-village-3), Defensible → Lightly Defended (town-42, insurgency-town-1),
Well-Defended → Defensible (politically_fractured-town-1); legitimacy Tolerated → Contested (village-22);
prosperity Comfortable → Moderate (hamlet-20); food Import-Dependent → Deficit (under_siege-city-3). Six of the
seven are towns whose pass or crossroads position the tip took away (the refill re-draws what follows). The
seventh, politically_fractured-town-1 (a port, same resources), loses "a mercenary company provides enforcement"
because its roster holds a Hireling hall and no company: military 79 → 65, readiness 55 → 53. A reader can give
that reason; it is the defence home's answer.

T8. **Crisis tension re-drawn.** In r2s-under_siege-village-0 the Overview's food tension ("Settlement cannot cover
~230 lbs of food per day (41% of needs)") gives way to a sickness tension; the food deficit still prints on the
Economy tab and in the Outlook. A re-draw from the resource change (the pass and crossroads position became iron
and marshland), not a fault.

What I did not find on the forty: no flow card, export or produced-locally line on the tip names a pass or a
crossroads position the town lacks; no healing line changed; no "Strategic Crossroads" on the Economy tab of any
non-crossroads town.

---

## STEP 2 — what I read, after step 1 was committed

The second review (`docs/chair/2026-11-12/REVIEW-AGREE-8866a0ddd-2026-11-12.md` on the chair's lane, NOT CLEAR, F1–F9);
the first it names (`REVIEW-AGREE-65ce74ce6-2026-11-12.md`, NOT CLEAR, F1–F15); the hand-back
`docs/chair/2026-11-11/AGREE-HANDBACK.md`, PARTS FIVE and SIX in full, PARTS THREE and FOUR for the corpus and the
door; the one draft record `docs/chair/2026-11-11/AGREE-shift-record.DRAFT.json`.

Step 1's T1 is the second review's F1 surviving on a surface its cure did not reach; T2 and T3 are its F4 (the
sawmilling rise and the coal line, which it named "the lane's own"); T4 is the store-duration pattern the second
review listed as not the lane's, now risen by the lane's cure 6. T5–T8 are new to the record.

## THE CORPORA I RAN (all executed; nothing below is read-only unless it says so)

- **The census's 720** (`seeds.txt`), born and rendered on both trees by `census.sh` (step 1).
- **The lane's 4,141**, rebuilt from PART THREE's and PART SIX's definitions on both trees (`births.mjs` of my own,
  in my scratchpad): L2 2,866 (`agree-*` 360 at 60/160/100/40 + thorps and hamlets 60 each; `l2-<famine|wartime|
  under_siege>-<tier>-<0..11>` 216; `rvw12-*` 360; `rvw12b-*` 1,440; `rvwfam-*` 360 forced famine; `rvw-ten-0..9`
  with its five crises), the golden's 525 (born as `generatorGoldenMaster.test.js` births them, through
  `goldenMasterCorpus.js`, payloads not loaded), REVIEW-AGREE-2's 750 (`r2r` 360, `r2s` 360, `r2read` 30 with its ten
  crises). 4,141 births per tree, 0 errors. **It reproduces the seat's instrument**: 4,112 of 4,141 births move (the
  seat: 4,112); the golden 525 of 525; the label table below equals PART SIX's in every one of its 45 cells.
- A third birth of the 720 at `525d064f1` (the seventh seat's start), to split the seats (step 5).

## STEP 3 — THE SECOND REVIEW'S FINDINGS, RE-RUN

| F | Re-run on the 4,141 (line → tip) and the 720 pages | Verdict |
|---|---|---|
| F1 the toll's name | The chain still runs off a crossroads (636: river 399, port 237; road 406 → 0). The Economy card, its "From", the PDF's flow and Services print "River Toll / River traffic", "Harbour Dues / Harbour traffic" (read on the 720 pages: 0 "Strategic Crossroads" on any Economy, Resources or Defense tab off a crossroads). **But the NPC goals carry the catalogue's name: 130 births (`npcs[].goal.short`, river 95, port 35), 219 with `goal.long` (line: 386).** On the 720 pages, 29 "Wants … Strategic Crossroads Toll …" lines in 12 towns. | **NOT CURED** (FINDING 1) |
| F2 refused goods | The export bonus, the land's goods, the raw goods and the transit branch read the leaf (plant G10 red). **A fifth writer does not: the institutional services** (`computeActiveChains.js :: INSTITUTIONAL_SERVICE_MAP`, `deriveServiceExports`): 14 births list "Financial services (letters of credit)" beside an impaired "Letters of Credit & Finance" card that reads "Normally yields: Financial services". | **NOT CURED** (FINDING 2) |
| F3 guard reach | All ten generator plants red, G2 and G5 among them (below, step 6). | cured |
| F4 income lines, no working | "Local ore … smithy" with no metal house 698 → 289; "Local coal fires the forges" with none 0 → 294 (289 of them out of the ore line); "Local quarry" with no stone house 737 → 771 (+34, every entrant a holder); "managed felling and sawmilling" with no wood house 277 → 373 (98 in, 2 out; **61 of the 98 not holders**: cure 7's gate); "Local ore … not trade-route dependent" beside the import "Iron ore" 129 → 50. Parked to W2 by the chair's ruling (P5). | parked, as ruled; see FINDING 3 |
| F5 the pass | Off the mountains: 963 → **0** holders; 0 tip pages off the mountains name a pass (720). Holders 1,458 (every one a line holder of an off-mountain pass or a crossroads position; 0 others); 0 left with nothing live (the 6 with nothing live are the same 6 on both trees); 0 replacements arrive depleted; 0 holders shrink; 0 mountain holders lose a pass. | **cured** |
| F6 directions | The record now states each family both ways; my table equals the seat's (step 4). `r2s-under_siege-city-3` still importDependent → deficit, declared. | cured by declaration |
| F7 the pin | `w0WriterAgreement` now a literal per row (e1bc84b23); plant from the hand-back not re-run. | cured (read) |
| F8 the walker | Constant-held word (W1), prison (W2), gaol (W3), infirmary (W4) all red. | cured |
| F9 | not the lane's; not re-run. | — |

**The toll at print time, in full (FINDING 1's evidence).** `src/generators/people/goals.js:431` and `:433` fill
`{chain}` from `ch.label` at birth; the stored goal prints on the NPCs tab ("Wants …"), the Summary tab
(`SummaryTab.jsx:297`), the session view and the tonight sheet (`tonightSheet.js:404`), the PDF
(`src/pdf/lib/viewModel.js:713`, `EngineSections.jsx:340`) and the Foundry export ("*Wants:*",
`foundry-module/scripts/build-journals.js:162-164`). The print-site walker (`tests/lint/chainPrintSites.walker.test.js`)
walks `src/components`, `src/pdf`, `src/foundry`, `src/lib`, `src/domain/{display,prose,summary,dossier}` and
`aiLayer.js` only; my plant W6 (`src/generators/people/zzReviewPlant.js` reading `ch.label` into a goal) stays
**green**. The receipt's member "A chain prints a resource whose row refuses the town's access" reads the chain
record, not the goals. The PART FIVE line "Printed 'Crossroads' off a crossroads: 636 -> 0" is not true of the
page. (`simulationTrace[].causes[]` also carries "Strategic Crossroads" in every off-crossroads toll town; no page
of the 720 prints it.)

## STEP 4 — THE LANE'S MOVES (my field diff, the 4,141, line → tip)

4,112 of 4,141 births move. Families (births): economicStrengths 3,872; safetyProfile 2,203; primaryImports 2,046;
defence scores 1,816; the flag bag 1,766; incomeSources 1,763; foodSecurity 1,659; plotHooks 1,617 (the seat counts
1,437 by flattened leaf; I compare the whole array); localProduction 1,466; the resource roster 1,458;
primaryExports 1,419; activeChains 1,391; strategicValue 1,140; foodways 1,110; readiness 1,080. Every figure but
plotHooks equals PART SIX's.

**In the 1,872 births that held no pass and no crossroads position on the line** (so no refill could touch them), the families are the declared text and flag families
(strengths 1,743, imports 821, hooks 790, safety 654, food 540, income 539, strategic line 473, defence scores 472,
foodways 383, the flag bag 355, viability 332, situation 329, readiness 211, exports 56, legitimacy 32, history's
current tension 29 (cure 6's failed-source line in famine towns), the golden's conditions 22, local production 17,
arrival 15). Rosters never move there. NPC goals and the order of the powers move in 9 (cure 9 and P1 re-weight the
powers; P1's three towns move toward safety; the rest are F2's export-reading text).

**Label moves by direction** (toward safety / toward danger), equal to PART SIX's table cell for cell:

| Family | L2 | R2 | Golden |
|---|---|---|---|
| Readiness | 69 / 50 | 12 / 5 | 23 / 0 |
| Legitimacy | 25 / 18 | 6 / 1 | 23 / 16 |
| Prosperity | 15 / 14 | 4 / 1 | 1 / 17 |
| Safety | 11 / 8 (3 unordered) | 3 / 0 (1) | 10 / 0 |
| Food band | 5 / 1 | 3 / 1 | 1 / 5 |

**Every move toward danger, by cause.** 137 in all. 115 are in holders (the refill's re-deal: a pass or crossroads
position the town could not have is replaced, and what follows is re-drawn), the golden's 17 prosperity and 5 food
among them. The other 22, in the 2,683 births whose resources did not change (18 readiness, 4 legitimacy, in 18 towns), are every one the defence home's mercenary atom
(cure 9): `compound.inst.hasMercenary` true → false where the roster's only "company" is a Veteran's lodge (a
drinking hall of old soldiers) or a Hireling hall ("torchbearers and porters … by the session"); military falls 1–20
points (e.g. `agree-village-34` 36 → 18, Vulnerable → Undefended). A reader can give each reason. **No move toward
danger lacks a declared cause.** One note, not the lane's: two of the 18 (`rvw12b-town-79`, `rvwfam-metropolis-0`)
hold "Hired blades" ("professional fighters … for private contracts"), which the defence home's bucket
(`defenseInstitutionBuckets.js:99`, "mercenary company / mercenary quarter / hired muscle") does not count as a hired
company, on the line or the tip.

## STEP 5 — THE PAGE COUNT (the census counter, both trees, run by me)

`census.sh` on the line 3575cf061 and on the tip, 720 dumps each, exit 0; `compare.mjs`:

| Row | Line | Tip | Δ |
|---|---|---|---|
| 11 flow source town lacks | 396 | 448 | **+52** |
| 2 two store durations | 561 | 571 | +10 |
| 3 magic tab vs Arcane None | 188 | 191 | +3 |
| 4 "almost level" vs leader far ahead | 103 | 106 | +3 |
| NEW-2 magic income, no practitioner | 3 | 6 | +3 |
| 5b, 8, 14, NEW-1 | — | — | +1 each |
| F4 income line, no working | 274 | 254 | −20 |
| 6 gap vs imports | 302 | 285 | −17 |
| 17, 7a, 5a, 10, 13, 16a | | | −10, −3, −1, −1, −1, −2 |

No new row; every verdict OLD; GLANCE towns 717 → 717. (The seat's table counts its own seat, 525d064f1 → tip, so
its "+38" and "+9" are a part of my line → tip rises.)

**Town by town, every entrant of every rising row, line → tip.** A town "changed" is one whose resource roster the
lane changed (all 218 such towns of the 720 were holders of an off-mountain pass or a crossroads position).

| Pattern | Enter | Leave | Entrants whose resources did NOT change |
|---|---|---|---|
| 11 (all its members) | 57 | 5 | **0** |
| 3, 4, 5a, 5b, 8, 14, 16a, NEW-1, NEW-2, 7a, 6, 9 | 1–5 each | | **0** |
| 2 two store durations | 10 | 0 | **6**: r2r-thorp-37, -51, -52, r2s-famine-city-3, r2s-famine-metropolis-3, r2s-religious_conversion-thorp-1 |
| F4 member saw ("managed felling and sawmilling", no wood house) | 12 | 2 | **6**: r2r-thorp-32, -47, r2r-town-12, -30, r2r-city-46, r2s-religious_conversion-thorp-1 |
| F4 member coal ("Local coal fires the forges", no forge) | 52 | 0 | **41** (51 of the 52 leave the "local ore" member in the same town) |
| F4 member quarry | 6 | 0 | 0 |

So **the seat's statement is true of its own commits and not of the lane**: at 525d064f1 every one of the 12
non-holder entrants of rows 2 and F4-saw has already entered (thorp-37's `storageMonths` 1.5 at the line, 1.8 at
525d064f1 and the tip; the six felling towns' line already false at 525d064f1). Their causes are the lane's own,
declared earlier: **cure 6** (a herd or a fishery is now a food source, so `storageMonths` moves and the two
sentences that round it disagree) and **cure 7** (the Timber Trade line's gate `hasNearbyResource('managed_forest',
'timber')` takes `mountain_timber`, worked or not, and prints "managed felling and sawmilling" beside "No one here
works the timber"). The coal member is the lane's own sentence, swapped into towns that already printed a false
"local ore" line. Against the chair's three conditions: the mechanism stood on the line (yes, all three); a named
later lane owes the cure (yes: the second-wave census plan, `SECOND-WAVE-CENSUS-2026-11-12.md`, gives row 2 to its
Lane 1b, the page battery's `stores-twice`, and the income lines to Lane 2's `income_line_vs_roster`, with W2-A/W2-B
by the chair's P5 ruling); the rise is confined to towns whose fact the lane changed (yes, if "fact" is the food
record and the timber reading; **no, if it is the replaced pass**, as PART SIX words it). See FINDING 3.

## STEP 6 — THE GUARDS (plants executed alone in a scratch tree at the tip; each reverted; the tree clean after)

The guard files: `projectionAgreement`, `coherenceAgreeCures`, `chainPrintName`, `crossroadsRequiredAccess`,
`economicsChainYieldLabel`, `chainWorking` — 77 tests, all green unplanted.

| Plant | Red |
|---|---|
| G1 `safetyProfile.js` gates read off the walls | 2 (both arm-2 seed sets) |
| G2 the company read off the garrison | 1 (the reviewer seeds' arm) |
| G3 the watch read off the militia | 2 |
| G4 the grain-surplus swap off | 2 |
| G5 the foodways market filter off | 1 |
| G6 the access refusal off (`resolveResources.js`) | 6 |
| G7 the terrain refusal off (P3 / (c)) | 3 |
| G8 the print-name leaf returns the record's own | 8 |
| G9 `chainWorking.js` without `resourceInputAvailable` | 2 |
| G10 the export bonus not asking the leaf | 2 |
| W1 a defence word held in a constant | 1 (walker) |
| W2 `includes('prison')`, W3 `/\bgaol/`, W4 `includes('infirmary')` | 1 each |
| W5 a chain's `.label` printed in `src/components` | 1 (print-site walker) |
| **W6 a chain's `.label` written into a goal in `src/generators/people`** | **0 — green** (FINDING 1) |

**The third member's register (16 lines, 14 files).** Re-counted with the walker's own `linesReading(…, readsAtoms)`
at 99bcc6944 (the lane's base), at the line 3575cf061 and at the tip: every file's count at the base is at least its
banked count, and the matched lines in the files the lane edited (`priorityHelpers.js`, `viability.js`,
`structuralValidator.js`, `aiLayer.js`) are the same lines, byte for byte. `priorityHelpers.js` read 4 at the base and
reads 1 now (the lane cured three). **Honestly banked; none is the lane's.**

**The repetition guard's one row.** `ledger:NPC_STRUCTURE.magic__contested__dominant`, top1 1, lines 1, through
`--bank-new`. `src/generators/npcStructure.js` is untouched by the lane; the pool is a one-line pool registered there
(`reg('magic','contested',…)`) and first drawn by (c)'s re-deal; its five siblings stand in the register at 1/1
already. **A new pool at its only possible reading, not a ceiling raised.** No other row moved (909 rows; the census
header re-taken).

## STEP 7 — PINS, GOLDENS, GATES, THE SUITE

**Pins the lane changed since the second review (8866a0ddd → tip), every one read:** `powerConfig` re-probed by seed
(`powercfg-leg-1` → `-4`, the assertion unchanged, as re-probed three times before: by identity); `w0WriterAgreement`
a literal per row (tighter); `coherenceAgreeCures` item 3′ (i) now also requires the goods-set import (tighter);
`defenceFactReaders` widened (members 2 and 3, constants), its court-gate register's doc only; CENSUS-5b's complement
rule narrowed to the keyed atom (the chair's commit fd10c7dc6, a rule the chair ruled; not judged here). The golden
fixtures, the freeze register and the citation baseline that differ from 8866a0ddd equal the line's (they arrived by
the merge d0f0d022b). **No pin loosened; no test skipped.**

**The three gates at the tip** (`sh scripts/gate-tail.sh npm run …`): `typecheck:ratchet` exit 0;
`typecheck:domain:strict` exit 0; `lint` exit 0.

**The whole suite, once, at the tip** (`git fetch origin review-fixes-2026-07-08:review-fixes-2026-07-08` first;
`sh scripts/gate-tail.sh npx vitest run --maxWorkers=2`, 5,387 s, exit 1): **36 failed files of 3,219; 50 failed
tests; 38,705 passed; 254 skipped**, and 5 of the 36 files fail at load with no test counted. PART SIX's 57 titles
in 40 files at 107fd0a2d, less the six bundle rows the last commit cures (three files) and powerConfig (cured,
622ed1d51), is 50 in 36: **the failing set equals it, title by title**:

- the line's known set: landingFixtureFreshness ×2; newsHeadlineContract, newsVoiceContract, proseFamilyContract (at
  load); the prose manifest's DRIFT arm;
- the instrument seeds the lane's generation moved (PART FOUR, the merge's to re-search): observedShapeReaders and
  writerReach (at load, `osr-tier-14`); proseTasteInterested ×3; proseWaveGate (d) ×2;
- the merge seat's rows of PART FIVE: generatorGoldenMaster; espionageDormancyFence; heraldKnowledgeDeskGolden; the
  prose manifest's four-seed arm; goldenViewModel; generationForkCensus A1; dmLayerGoldenIsolation A7;
  nameHeldThroughAssembly A1; pipelinePinnedChoosers A1; pipelinePinnedMode A1, A2, A5; powerEconomyFreshness A4;
  rosterFinalUnderHeldRoster A1; worldFactRederive A7; x46NpcBand; institutionBudgetPromise; editWorldFactResources
  A2, A6; editCorpusRatchet A4, A7, A8; mergeLadderHeldKeys A2, A5, A6; hookThemeDraws; institutionTable;
  siteCoherenceRatchet C1; townCartographyCalibration; undercitySewerDerivation; intentAtlasSoakDistiller;
- PART SIX's new rows, named in the draft: generationCertificationCorpus; foodModelSingleWriter;
  dossierPhoneFloorAllViews ×2; generationForkCensus A3e, A4; mergeLadderHeldKeys A3; recordMerge A6;
  pipelinePinnedChoosers A6; editCorpusRatchet A6; the prose manifest's mixed-pool arm.

No title is new. Under the hand-back's classes none is the lane's to cure (byte identities and corpus figures for
the merge's signed doors, the line's own reds, and two instrument seeds whose re-search moves a closing act's
register). The preset-lighting witness is green (7/7).

**The six golden surfaces, by my run, against the record:** generator golden master 525 of 525 rows moved (my field
diff; the record: 525 of 525); the espionage fence's driven hash `366d5c20…` against `38a52b05…` (PART SIX: 366d5c20);
the herald desk `02d3fa8e…` against `0fa1f3ca…` (PART SIX: 02d3fa8e); the PDF golden `defense.scoreAvg` 43 → 41,
`headcounts.institutions` 44 → 43, `npcs` 36 → 35 (record: the same three); the prose manifest's DRIFT arm, its
four-seed arm (gm-seed-a 408 → 410, as recorded) and its mixed-pool arm 203 → 177 (as recorded); the
preset-lighting witness green (record: unmoved). **All six hold.**

## STEP 8 — THE TWO ANSWERS THE SEAT PARKED

Re-taken on the 4,141 at the tip. **The seat's measure** (the analysis lists the resource unexploited while a chain
works it live, read by `chainWorksResource`): timber **735**, stone **245**, iron **5**; the reverse (no chain, the
analysis partial) timber **20** — the seat's four figures exactly. **On the page** (the line the reader sees,
`validationOnPage.js :: resourceGapLines`, "No one here works the X near …", which is withheld where the economy
exports the good): timber 200 (line 240), stone 245 (line 231) beside a chain that works it.

**Is `chainWorking.js` the one home of the chain model's answer?** Yes, as built: no other module answers "a chain
works this resource here" (the other readers of `resourceInputAvailable` are the chain writer itself, the receipt's
depleted-input check, the world-pulse kernel's projection and the schema); nothing imports the leaf yet (P5, as
ruled). Its premise holds: of 28,856 chains naming an input on the 4,141, 0 are working by the leaf while their
input is not live on the roster (substitute runs included). The page's "No one here works" does not read it yet;
that is the later lane's.

## STEP 9 — VERDICT AND FINDINGS

**NOT CLEAR.**

The lane does most of what it says, and I re-ran it rather than read it: its instrument reproduces to the birth
(4,112 of 4,141; the label table cell for cell; step 8's 735/245/5/20); the pass is cured with all three proofs; the
refill is confined (1,458 changed births, every one a holder; 0 others); every danger-ward label move has a cause a
reader can give; ten generator plants and five walker plants go red; the third member's register and the
repetition row are honest; no pin is loosened; the three gates exit 0. But the fact that held the release at the
second review — the toll's name off a crossroads — still prints, on the owner's page, in the PDF and in the Foundry
export, and the hand-back says it does not.

### FINDING 1 (HIGH) — The catalogue's toll name still prints off a crossroads, in the NPCs' goals. CONFIRMED (executed, page and record).

- **What.** A river or port town's NPC "Wants Take on more hands for Strategic Crossroads Toll at the coaching
  inn …" / "Get the most out of Strategic Crossroads Toll while it runs well …" / "Look for a way to do more for
  Strategic Crossroads Toll with the same hands." The Economy tab of the same town says "River Toll — River traffic".
- **Where.** `src/generators/people/goals.js:431,433` (`{ chain: str(ch.label) }`, written at birth into
  `npcs[].goal.short/long`); printed by the NPCs tab, `SummaryTab.jsx:297`, `tonightSheet.js:404`,
  `SessionMode.jsx:398`, the PDF (`src/pdf/lib/viewModel.js:713`, `EngineSections.jsx:340`) and the Foundry journal
  (`foundry-module/scripts/build-journals.js:162-164`). The walker that was to make this impossible
  (`tests/lint/chainPrintSites.walker.test.js`) does not walk `src/generators/people`; plant W6 there stays green.
- **Reproduce.** `r2r-city-8` (census 720), World/NPCs, the innkeeper Sükhbaatar Yorqin; or on the 4,141
  `agree-town-43`, `-115`, `-144`. Count: tip births with the toll chain off a crossroads whose `npcs[].goal.short`
  names "Strategic Crossroads": **130 of 4,141** (river 95, port 35); with `goal.long`, **219** (line 386). On the
  720 pages: 29 lines in 12 towns.
- **How bad.** It is the release-holding F1 of the second review, on a smaller surface; PART FIVE's "Printed
  'Crossroads' off a crossroads: 636 -> 0" is not true of the page; and the guard that claims every print site
  cannot see this one. A reader meets a crossroads toll in a river town.
- **Cure.** The goal writer names the chain through `chainPrintName(ch, config.tradeRouteAccess)` (the record's
  `activeChains` keeps the catalogue's strings, as ruled; the goal is prose); `goals.js` (and every writer that bakes
  a chain's label into stored prose at birth: search `ch.label`, `chain.label` under `src/generators`) joins the
  walker's surfaces or a second list; a receipt member or a pin reads `npcs[].goal` for a refused access; re-take the
  count on the 4,141 to 0.

### FINDING 2 (MEDIUM) — A fifth writer of the trade list does not ask the refused-goods leaf. CONFIRMED (executed, page and record).

- **What.** The Trade Profile's exports list "Financial services (letters of credit)" while the town's "Letters of
  Credit & Finance" card is Impaired and reads "Normally yields: Financial services, International banking services".
- **Where.** `src/generators/computeActiveChains.js:927` (`INSTITUTIONAL_SERVICE_MAP`, the bank's `exportLabel`)
  through `deriveServiceExports` (`:1026`; called at `economicState.js:744`): it exports a service from the
  institution, whatever the chain's state; the leaf `goodsOnlyRefusedChainsMake` is not read there.
- **Reproduce.** Census 720: `r2s-under_siege-metropolis-1` (Systems/Economics: Exports; the Letters of Credit
  card), `r2r-metropolis-14`, `r2s-under_siege-metropolis-3`. The 4,141: **14 births** (mostly besieged cities:
  `l2-under_siege-city-7`, `-9`, `-11`, `l2-under_siege-metropolis-0`), every one this good.
- **How bad.** The second review's F2 class, which the hand-back reports cured ("Exports 191 in 101 births -> 0");
  small, and in the crisis a game master is most likely to read closely.
- **Cure.** `deriveServiceExports` (or its caller) drops a service export whose chain output is in
  `goodsOnlyRefusedChainsMake(activeChains)` (matched with the label's suffix read off, as the receipt does), or the
  receipt's "A trade list carries a good only a refused chain makes" reads the service exports too and a pin holds
  these four seeds.

### FINDING 3 (LOW) — The census rise is exposure, but not of the span PART SIX states, and part of it is the lane's own sentence. CONFIRMED (executed).

- **What.** Line → tip on the 720: row 2 (two store durations) gains 10 towns, **6 of them non-holders**; row F4's
  sawmilling member gains 12, **6 non-holders**; its coal member gains 52, **41 non-holders** (51 of the 52 leave
  the "local ore" member in the same town, so the row falls). Every other rising row's entrants are holders (11: 57
  of 57).
- **Where.** Row 2: cure 6's food sources move `foodSecurity.storageMonths` (r2r-thorp-37: 1.5 → 1.8; Economy "two
  months in household stores", Defense "about three months at full rations"; r2s-famine-city-3: "a granary of eight
  months" and "about nine months"). F4-saw: `economicState.js` Timber Trade, `hasNearbyResource('managed_forest',
  'timber')` takes `mountain_timber` (r2r-thorp-32: "managed felling and sawmilling" beside "No one here works the
  timber near Hochsee"; 61 of 98 such entrants on the 4,141 are non-holders). F4-coal: `LOCAL_COAL_LINE`, the lane's
  sentence, in towns with no forge.
- **Reproduce.** `census.sh` on both trees, then per seed: entrants of each key in `counts.perseed.json` against
  `config.nearbyResources` line vs tip; the same seeds at 525d064f1 show every non-holder entrant already in.
- **How bad.** Against the chair's three conditions it is exposure: the mechanisms stood on the line, the second-wave
  plan names their cures (Lane 1b `stores-twice`; Lane 2 `income_line_vs_roster`, W2-A/W2-B), and the entrants are
  towns whose food record or timber reading the lane changed. But PART SIX's "every town that enters or leaves any
  pattern this seat is a holder" is the seventh seat's span, not the merge's, and the brief's reading of it ("every
  town that enters is one whose pass the lane replaced") is false for the lane; and two of the risen sentences are
  the lane's own choice (the felling line by its gate, the coal line by its text). The page is not worse in sum
  (row F4 falls by 20).
- **Cure.** None owed by this lane under the chair's rule; the chair records the twelve (720) and the 61 (4,141) as
  exposure owed by Lane 1b and Lane 2, and the hand-back's sentence is corrected to the lane's span.

### FINDING 4 (LOW) — "Every arrival goes through a gate" beside the lane's no-gate twin. CONFIRMED (executed, page).

- **What / where.** Defense prints `walls PRESENT` vid 2 ("… every arrival goes through a gate and into the gate
  tally …", `src/data/dossierStateProse/defense.generated.js:3653`, marked `colour`, not `gate`) in towns where the
  lane's Services twin says "The walls leave few ways in" (no gate of record). r2r-village-6, r2r-hamlet-18.
- **Count.** Both on one page: line 0, tip **22** of 720.
- **Cure.** The pool's vid 2 carries the `gate` mark (through the prose writer, `gen:dossier-prose`), or the
  palisade pool's own vid replaces it where `defence.gate` is false.

### FINDING 5 (LOW) — "What the land offers" says less than the town lives by.

- **What / where.** `resourceGenerator.js :: STRENGTH_SUPPORT` keeps a terrain strength only on the town's own
  resource or route. 80 of 720 tip pages lose "✓ Agriculture"; 38 of them earn Agricultural Rents from tenant
  farmers (r2r-village-35: 92% of its income, grows 389 lbs/day against 360, and its land "offers" only River trade).
  The heading vanishes in r2r-town-3, r2s-under_siege-town-0, r2r-city-0.
- **Cure.** A strength the income or the food record already shows (Agricultural Rents, a food chain) stands; or
  the chair accepts the narrower meaning as words.

### What I could not explain

None of the moves toward danger. The 22 outside the holders are the mercenary atom (cure 9); the 115 inside are
the refill's re-deal.
