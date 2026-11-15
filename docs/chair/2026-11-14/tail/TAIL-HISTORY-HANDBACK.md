# TAIL-HISTORY · hand-back (2026-11-15)

Seat: TAIL-HISTORY (builder). Base: the joined line `lane/join-2026-11-14` at **f663a2699**. Branch: `lane/tail-history-2026-11-14`.
Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-HISTORY.{md,json}` on the chair's lane (211 rows, read at e5b421802).

**STATE: batch 1 cured, measured and red-first, but NOT LANDED.** The cure reds 14 governing tests that are green at
the base (listed below). Closing them needs pins re-keyed, two ledgers and a file outside this group, and that is more
than my budget had left. So the batch is handed back as a patch, **`TAIL-HISTORY-batch1.patch`** beside this file
(`git apply` at f663a2699: three data files and one new test). No src change is committed on this branch.

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- **(Y1)** A hook or line a historical event writes is true of ITS event. It takes its condition (its event of that type, recent or present) in the form the file uses.
- **(Y2)** The crisis texts (stressTypes.js) that need a second power or offices take a twin true of a place with one power and no office, in the same slot. NO DRAW IS MOVED.
- **(Y3)** The culture rows (cultureProfiles.js) are each held to a declaration. `src/pdf/lib/cultureOnPage.js` is not edited.
- **(Y4)** Arrival prose under a siege, with no market, or at a size it does not fit takes twins and declarations, as the file's last cures were made.
- The brief's laws as written: silence is true; no draw moved; a twin where a state goes mute; under a siege nothing by road, gate or water; under a famine no food that failed.

## Base measure

- Census at f663a2699 (CENSUS-3, 720 towns): 29,876 distinct sentences.
- **Gone at the base:** B14754 and B14755 (EVENT_TYPE_NAMES, "…still remember the succession crisis…"): their fold is not in `before.json`.
- Every other row prints in exactly its worklist `n`.

## Batch 1: the patch (14 rows; one census before, one after)

### Measure before (false towns, by record) and after (CENSUS-3 at the patch, before the salt-fish reword below)

| id | sev | line (writer) | false before | prints before → after |
|---|---|---|---|---|
| 00169 | HIGH | "Three different powers have approached…" (stressTypes succession_void.crisisHook) | 12 (one or two powers) | 31 → 0 (reworded) |
| 04385 | MED | "…each office does as it sees fit" (succession_void.viabilityNote) | 15 (tier ≤ village) | 31 → 0 (reworded) |
| 18890 | MED | "…some offices no longer send their revenue on…" (insurgency.viabilityNote) | 19 (tier ≤ village) | 37 → 0 (reworded) |
| 22261 | MED | "…profits from wartime contracts" (historyData external_threat hook) | 74 (no war in force) | 107 → 33 |
| 02538 | MED | "…the war party is suppressing" (same) | 79 | 108 → 29 |
| B02462 | MED | the same, with a stop (a timeline event's hook) | 17 | 19 → 2 |
| 09279 | HIGH | "Food is being handed out to anyone who asks…" (ARRIVAL_PEOPLE.south_asian) | 3 (siege or famine) | 24 → 21 |
| 02866 | HIGH | "A notice of the next fair…" (ARRIVAL_PEOPLE.germanic) | 2 (siege) | 9 → 7 |
| 15806 | MED | "Porters bent under loaded frames file past…" (mesoamerican) | 2 (siege) | 19 → 17 |
| 02414 | MED | "A broker … goods from routes you have never travelled" (arabic) | 1 (siege) | 14 → 14 (−1 siege, +1 moved: see note) |
| 02470 | MED | "A clerk records every cartload…" (east_asian) | 1 (siege) | 21 → 19 (−1 siege, −1 moved: see note) |
| 02382 | MED | "A basket of fish, still flapping…" (ARRIVAL_SENSES.lines) | 3 (siege or famine) | 8 → 5 |
| 18339 | MED | "Someone has been baking since before dawn…" (lines, colour) | 1 (famine) | 2 → 1 |
| 04287 | MED | "Barrels of salt fish stand stacked for the carts…" (dominant) | 3 (siege) | see note: reworded after the run |

**The cure in the patch:**

- **Y1:** the two war hooks take `excludes: ['war: peace']`. The wartime, occupied and siege towns keep them (29 and 33).
- **Y2:** three rewords. They claim no plurality of powers and no office. The vocabulary has no atom that counts the powers or the offices.
- **Y4:**
  - `excludes: ['crisis: under_siege']` on the fair, the porters, the broker and the clerk.
  - `excludes: ['crisis: hunger']` on the food line, the fresh fish and the baking.
  - The salt fish are reworded (see the note).

**NOTE, the salt fish.** I first gave 04287 an under-siege twin as a new line in its pool. The after-run showed that this
re-drew the fish-dominant towns. The pool's length changed, so 04287 went 18 → 25, "Half of … gutting" +8 and "Racks of
drying fish" +4. It also moved r2r-hamlet-27 (the broker's +1) and r2r-village-41 (the clerk's extra −1). The patch
replaces the twin with a plain reword that names no carts. It has no condition and adds no new line. **The after-run
above predates that reword, so the next seat's first census is the true after-run of this patch.**

**Explained silence: "External Threat" as a plot-hook heading, 89 → 79.** In 10 towns a past external-threat event's
refused war hook now resolves to the tension's own remaining hook ("The threat has an agent already inside the
settlement"). The page then prints that hook once, under the event, and the tension's group heading drops. The hook
still prints, and no false line results. The towns are r2r-city-54, r2r-thorp-19, r2s-infiltrated-village-2,
r2s-monster_pressure-city-0/1/2, -thorp-3, -town-0, -town-3 and r2s-plague_onset-town-0.

**The inheritors I read** (the widest; I read none of them false):

- The three reworded crisis texts (31, 31, 37 towns).
- "The threat has an agent already inside the settlement" in its memory frames (17 + 14 + …).
- In the siege and famine towns:
  - "An apprentice hurries past…": r2s-occupied-thorp-0. It is a culture-pool sibling, but it is itself worklist row 03498 (an apprentice with no craft house).
  - "Festival banners…" and "An elder settles a quarrel…": r2r-village-43 and r2r-village-41.
  - "Nets hang drying…" (r2s-famine-thorp-0). This is a famine with a fish source; it is NOT verified against the failed source, so the next seat should read it.

### The guard, red first

`tests/data/tailHistoryBatch1.test.js` (in the patch) holds 6 tests: 4 MUST-NOT tables and 2 KEEPs.

- At the base files: **3 of 3 must-not tests red**: Y1 (4 towns), Y2 (3 towns) and Y4 (11 towns). Both KEEPs were green.
- At the cure: 5 of 5 green.
- The sixth test (the salt fish name no carts) was added with the reword and has not been run.

### Gates at the cure (gate-tail.sh)

- typecheck:domain:strict 0, typecheck:ratchet 0, eslint on the touched files 0.
- The presumed-things walker equals the base: fresh 147, stale 0. My first wording, "the would-be heirs to the empty seat", rose it by one, because "the empty seat" is the walker's succession word. The patch's wording, "The would-be successors", does not.
- Grid: 2 falls, 0 rises.

### WHY IT IS NOT LANDED: the governing tests

I ran the 133 test files that name a touched file. 28 assertions are red at the cure and 14 are red at the base. Red at
the cure and green at the base:

1. `tests/data/stressTypesMeta.test.js`: the drift check. **`src/data/stressTypesMeta.js` holds the two viabilityNotes word for word** (lines 69 and 79). It is outside this group. NAMED for its holder: it takes the same two rewords (the last cure, 85322e82b, changed both).
2. `tests/generators/hookTablesDeclared.test.js`: "the twenty declaring rows". The two war hooks make 22, so the pin is re-keyed by identity.
3. `tests/domain/facts/census2dTables.test.js` and `census2eTables.test.js`: the declared sets stand beside their ledgers. The new declarations need their ledger lines (`docs/census/declarations/…`), or the stressTypes rewords' REWORDED arm.
4. `tests/domain/facts/census2fColour.test.js` (R-AO: a colour line declares nothing). The baking line is `colour: true`, so it must not take `excludes`. Its cure is a reword or leaving the colour mark (this needs the chair).
5. `tests/domain/facts/textOf.test.js`: the arrival tables' declarations are read back to a template. A pin to re-key.
6. The births-over-seeds suites (these may follow the moved draws or the CPU load; re-run before judging):
   - `foodDiversity`
   - `incomeLinesSayTheRecord` ×2
   - `stressSummaryName`
   - `timelineVariety`
   - `urbanBandInstitutions` G3
   - `editCorpusRatchet` A5
   - `simulationSpine`

The 14 reds carried at the base are not mine: the edit-corpus and world-fact goldens, the pinned choosers, writer reach, the golden master, hallDecidesUnderOccupation and the W2-FIX-DATA-8 row.

## Rows struck (verified by record: true of their event)

For each hook I read its carrier on every printing town (`currentTensions[].plotHooks` or `historicalEvents[].plotHooks`):

- **B19364 "The crime wave is coordinated." (181).** It prints only under a crime_wave tension, which stands only where the crime signal is present. A hidden hand is the hook's own new claim, and no record field denies it.
- **18323 and 18324, "Someone destroyed the competing supply route" (182, 25).** An engineered scarcity explains the isolation the reader cited, and no field says no route ever ran.
- **B19302, B20649 and B20650 (the reformers, the reformist leader); B17445, B17446, B02863 and B02864 ("one side", "both sides"); B21358 (the vigilantes).** The tension's own factions name these parties (corruption_scandal, religious_tension, crime_wave).
- **B02619, B02620, B19874 and B19875 (the witness, the investigator).** These are the hook's own figures. Each prints only under its corruption scandal tension or event.
- **B19428 and B21356 (the leadership vacuum's hooks).** They print only under a leadership_vacuum tension (already refused under a settled power) or its event, mostly under politically_fractured.

## What is left (widest first) and its measure

**THE AFTERMATH SHAPE (Y1): 74 rows, 711 false prints. Every one comes from a current tension whose own event is absent from the timeline.**

- The types and the count of tensions with no own event:
  - plague_years 16
  - great_fire 14
  - great_flood 23
  - popular_uprising 18
  - tyranny 11
  - wild_magic 10
  - trade_collapse 11
  - market_crash 5
  - heresy_trial 14
  - pilgrimage_surge 13
- The false prints span three writers: the description (the "severity" writer rows, e.g. B02938, B03370, B27509), the factions (e.g. B21987, B06235, B15297) and the hooks (e.g. B20278, B20557, B15373, B21149, B02689).
- The rows with their towns-false/printing are in the measure at the foot of this file.
- The file's form for the tension is `byMemory.unanchored` (`historyGenerator.js :: tensionByMemory`). It replaces the description, the factions and, if given, the plotHooks when the timeline has no own event. The twin stays on the same slot, so the draw is kept.
- **THE CHAIR'S CALL NEEDED:**
  - The tension's label is its type name ("Plague Years", "Great Fire") on every surface, including the PDF and the journal, which are outside this group. Twin words must stand under that label.
  - The other route is the file's own earlier form, `TENSIONS_THAT_NEED_THEIR_OWN_EVENT`, which sets the tension aside at selection. It is a DECLARED MOVE that re-deals the slot and the stream after it.

**Other wide rows, unworked:**

- B15078 "Price regulators" (165): resource_scarcity factions.
- 16625 "Rival guilds fought…" (139): it prints despite `needs: ['guild']`. The guild home's answer is to be read against the record.
- 11894 and 28512 (culture foodways, Y3).
- B19917 and 07400 (descriptions at a size or under a settled power).
- The Y3 culture rows.
- The rest of Y4, including the plague-gathering rows. These are not a stated law, so the chair should rule on them.

**Named as left, the chair's notes:**

- **X9** (read at hand-back): the exports-only rows of this group, `read-all-3/WORKLIST3-HISTORY.{md,json}` (119 rows, 3 HIGH), are NOT worked. Its rows that remain are to be checked against `history.currentTensions` first.
- **TAIL-CRISIS's insurgency note** (18222's sibling) is cured in the patch by its reword, "some households no longer pay at all": no offices, no strong power.

**Parked:** 20031 and 20032 (the ailing ruler under a Feudal Appointee or Priestly Guidance). No atom says the ruler is hereditary.

**Named for other files:**

- `src/data/stressTypesMeta.js` (69, 79): the same two notes.
- `src/domain/crisis/crisisSummaryVantage.js` (287, 334, 353): the trade vantage lines repeat "each office does as it sees fit" and "some offices no longer send their revenue on".

## New and reworded lines (the owner's veto), with towns they print in (CENSUS-3 at the patch)

- "The would-be successors have each approached the players for support, each believing theirs is the legitimate or best claim. Each of them is partly right." This replaces 00169 in every succession_void town (31).
  - Smallest: r2s-succession_void-hamlet-1.
  - Largest: r2r-metropolis-6.
  - It is the crisis itself.
  - The after-run carried the earlier wording, "would-be heirs to the empty seat"; the patch's wording is the walker-clean one.
- "Big decisions wait for a new leader, and in the meantime the place gets by on old habit." It prints in 31 towns (the same towns).
- "Taxes are disputed, some households no longer pay at all, and the government runs on habit." It prints in 37 towns.
  - Smallest: r2r-thorp-22.
  - Largest: r2r-metropolis-26.
  - Read under an insurgency.
- "Barrels of salt fish stand stacked by the water, and the gulls have opinions about every one." It replaces 04287 in the same 18 towns: r2r-hamlet-17, r2r-thorp-58 (a siege) and r2s-under_siege-hamlet-0. **This line is not yet census-read.**

## Instruments, re-made

- From the chair's lane, by `git archive`:
  - `docs/chair/2026-11-14/probes/READ-ALL/`: `inventory.py` and `inventory_diff.py`.
  - `docs/chair/2026-11-14/probes/CENSUS-3/` (`census3.sh <tree> <out> 4`).
- The row verifier: a 30-line script over `corpus.ndjson.gz` and the inventory. It finds, for each row's fold, the event that carries the hook in each printing town (tension or timeline event, own event present or not, the stresses). It is easy to remake: read `history.currentTensions[].plotHooks` and `history.historicalEvents[].plotHooks` and the `templateType`.

## Aftermath measure (towns false / printing)

B02938(19/52) B03370(20/45) B20278(19/37) B20557(20/37) B15373(16/35) B21149(16/32) B20744(14/29) B02689(20/26)
21280(14/25) B21987(23/25) B06235(23/25) B11823(23/25) B21354(19/24) B02944(9/22) B02414(19/21) 03341(8/20) B02313(12/20)
B20687(19/20) B21980(19/20) B19069(16/19) B15297(16/19) B09823(16/19) 18940(13/18) B15372(14/18) B21951(14/18) B21347(11/18)
B14575(13/18) B15917(13/18) B02537(11/17) B19260(15/16) B17430(11/16) B19008(9/15) B17828(14/15) B22143(11/14) B06236(11/14)
B28028(11/14) B15678(11/14) B27509(9/14) B19522(10/13) B21989(11/13) B04252(11/13) B03008(10/12) B02465(3/12) B12687(3/12)
B21991(3/12) B04055(3/12) B19434(3/12) B02421(3/12) B20238(3/12) B27511(5/11) 21746(4/10) B27508(9/10) B19420(6/7) B02600(5/6)
B20279(4/5) B20558(4/5) B20181(5/5) B20745(3/4) B19259(4/4) B19499(4/4) 21101(1/3) 03621(3/3) B02690(3/3) B21355(3/3)
02493(2/2) B02351(1/2) B21348(2/2) B02538(2/2) B02983(1/2) B19275(2/2) B03501(1/1) B15374(1/1) B02415(1/1) B02314(1/1)
