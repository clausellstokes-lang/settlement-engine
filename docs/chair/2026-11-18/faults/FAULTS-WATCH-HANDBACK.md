# FAULTS-WATCH hand-back

Seat FAULTS-WATCH of the round FAULTS (BRIEF-FAULTS, section FAULTS-WATCH; rulings FR9, BR25 (5), BR29, BR30 (3)).
Base 4288049ba (`lane/faults-base-2026-11-18`). Branch `lane/faults-watch-2026-11-18`, code tip 6bce910c9 (items 1 to 4 at dfad63083; item 5, the chair's, after). Merged nothing.

| commit | what |
|---|---|
| c5059fd60 | the hand-back's title line |
| 4041ed2a9 | item 1: the crime-type "(lawless)" row reads `lawlessRow` |
| 54919dded | item 2: a gate held is a post, not a round by day; a levy at need walks no round (FR9); `bar8Watch.test.js` re-keyed |
| b6ee0ea99 | item 3: a power with no old standing takes the final roster's sentence |
| 68328b578 | item 4 (a): `trade at work` reads the siege's stop of a house; (b) left by name; `bar8Scenes.test.js` re-keyed |
| 32e2dc76c | the guard `tests/generators/faultsWatch.test.js`; `houseStoppedBySiege` exported for it |
| dfad63083 | item 3's comment moved onto the changed line so no line of `rosterText.js` moves (see the net) |
| bf776cf28 | item 5 (the chair's, 07:09 UTC): the Legal row's prison and the desk's internal key read the live prison; the guard's arm |
| 6bce910c9 | item 5: `tests/domain/display/legalRowReadsTheRoster.test.js` re-keyed by identity |

Files touched: the four on the seat's row, the two the chair gave for item 5 (`defenseDisplay.js`, `defenseStateProse.js`),
the new guard, the three older tests re-keyed by identity (`bar8Watch.test.js`, `bar8Scenes.test.js`,
`legalRowReadsTheRoster.test.js`) and this file. No new field on the saved record. No new text (every line that moves is a line or
sentence the code already wrote elsewhere). No new atom. Nothing under the map. No stored figure re-taken.

## The rules, before and after (base corpus → tip corpus; populations: the thirty · the 150 · the 720)

| rule | thirty | 150 | 720 |
|---|---|---|---|
| 1 · "(lawless)" crime-type row says "easily outbid" beside a sitting court and a gaol | 0 → 0 | 0 → 0 | **1 → 0** (r2r-city-41) |
| 1 · "(lawless)" rows by text (outbid / slow law) | 1/0 → 1/0 | 10/3 → 10/3 | 25/1 → 24/2 |
| 2 · "on the rounds most hours of the day" beside a force whose own text walks the night and only holds a gate, or musters only at need (FR9) | 0 → 0 | **3 → 0** | **8 → 0** |
| 2 · all "most hours of the day" lines | 2 → 2 | 11 → 8 | 40 → 32 |
| 3 · a power the power step gave no standing, without the final roster's sentence | 0 → 0 | **2 → 0** | **14 → 0** (towns) |
| 4a · a house the page marks "Stopped by the siege." read "at work" by the atom (house-trade pairs) | **5 → 0** | **23 → 0** | **27 → 0** |
| 4b · `impairedUnderSiege` reads the stored chain status where the card shows another (pairs) | 0 → 0 | 4 → 4 | 1 → 1 (LEFT, below) |

The runners over the 900 (`runK.mjs`, `runJ.mjs`, `--controls`): **no rule rises.** runK: every rule the same but
`14a.descCopy.generic` 92 → 91 (item 3 made one copied description differ; politically_fractured 8 → 7); totals 331 → 330
instances, 201 towns, 198 distinct lines. `13a.court` and `13e.hours` are 0 at both (13e.hours has FR9's blind spot: it
read the gate as the day; not cured in the auditor's file, which is not this seat's). runJ: identical, every rule. The
controls tables of both runners are byte-identical at base and tip (both exit 3 at both: STANDS rows cured by earlier
rounds read "clear"). The two doors (R9), last lines identical at base and tip, no fresh line added:
`presumption-classes-door --check` "hits 1788 · banked 1938 · fresh 3 · stale 153 · ceiling 1938";
`presumed-things-door --check` "fresh 38 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107".

## Each item with its proof

**1 · THE CRIME-TYPE ROW.** `servicesGenerator.js` (the Lawlessness crime type's site) writes the row's description as
`lawlessRow(institutions, buckets).desc`, the overlay's own reading at its two other push sites (the description home
stays `serviceRollMaterialization.js`, untouched; the now unused constant's import is dropped). The entry is 388 lines
(`servicesStructure.test.js` green). r2r-city-41 (Lawlessness; a court sits, a gaol holds) now prints "The court sits and
the gaol holds, but both are slow, and coin buys a quicker answer." on the Services tab (the only surface that prints the
row, at base and tip); r2r-city-31 (no gaol) keeps "easily outbid". The guard holds both. The line itself is the
existing `SLOW_LAW_DESC`, which already printed in bar0-town-calm-rand-38, bar0-town-occupied-rand-28 and -36.

**2 · THE GATE AND THE LEVY (FR9).** `forceHours.js`: the day is `day`/`daylight` only (a gate held is a post, not a round);
`mustersOnlyAtNeed` ("musters … when danger") walks no round. Neither reading says the watch is unseen by day (no line of
the pool says so; the refused frame resolves to an admitted frame of #18). Before → after, Defense tab and PDF
DefenseSecurity alike (the journal prints no guard line at base or tip); the shared page (`toPublicSafe`) carries the
same stored line, and no "most hours of the day":

- bar0-town-calm-rand-36 (Town watch: "Part-time guards who walk the night and hold the gates."): "You will see the town
  watch on the rounds most hours of the day; it catches the careless and misses the careful." → "The town watch walks the
  usual rounds. That stops a pickpocket or a brawl; anyone who has learned the rounds can work between them."
- bar0-town-calm-rand-37 ("Part-time guards. Night patrol and gate duty."): the same → "The town watch walks the usual rounds. …"
- bar0-town-calm-rand-40 ("Part-time guards. Night patrol and gate duty."): the same → "The town watch patrols on a regular
  round, so petty theft is often caught and planned crime seldom is."

Each is true beside "Night patrol and gate duty": a round is walked (the night patrol); no hour of the day is claimed. The
sentences after the patrol frame are unchanged. bar0-town-calm-rand-39 (Barracks beside the watch) keeps the line. The
atom's flips over the 900: 86 records (Town watch's three gate texts 75, the thorp's Household levy 11); 11 of them
printed the line (all now another frame of the pool). The atom still reads the one partition's houses
(`orderForceOf(record).houses`, unchanged), so its reading with the Defense tab's Standing forces is the base's; the second
reader's 904-of-904 measure was not re-run by this seat.

**3 · THE TRUE LINE LOST (BR30 (3)).** `rosterText.js :: settleStandingToRoster`: a power whose power-step standing was
empty (13g) takes the final roster's sentence for it at its description's end, as `annotateFactionStanding` appends one.
bar0-city-under_siege+famine-rand-31: Military/Guard again prints "They and the religious authorities both keep people in
line. The garrison deals with bodies and the clergy with minds, and each wishes the other would keep quieter." (Power tab,
PDF PowerStructure, Journal Power); the Religious Authorities stand on its final roster; The Garrison Bloc's twin (no
standing) takes none. Every town where a description changes (17 towns, 18 descriptions; each sentence is the factionStanding
table's own for that power's rank on the FINAL roster, and every power it names stands on that roster):
the 150: bar0-city-under_siege+famine-rand-31 (above), bar0-town-calm-rand-34 (Military/Guard, rank 3 of 4: "They are
always at the table, but cannot set their own terms."); the 720: r2r-city-51, r2r-village-25 (2: "Behind Merchant Guilds by
too much to challenge openly, …" and "They are always at the table, …"), r2r-village-53, r2s-famine-town-2,
r2s-politically_fractured-city-2, -town-1, -village-1, -village-2, r2s-religious_conversion-city-3, -town-3,
r2s-slave_revolt-village-0, r2s-succession_void-town-3, -village-3, r2s-under_siege-metropolis-2. FOR THE SECOND READER:
two "Close enough to the two above …; they play X and The Guard against each other" sentences (r2s-politically_fractured-
city-2, r2s-succession_void-town-3) name the force as the table names it ("The Guard") where the roster's power is
"Military/Guard": the table's own wording, written the same in ordinary births.

**4 · `trade at work` UNDER A SIEGE (BR25 (5)).** (a) CURED. `houseAtWork` now also asks `houseStoppedBySiege`: the page's
"Stopped by the siege." of a house (`crisisStoppedRow.js :: rowStoppedBy`, which this leaf cannot import: its header's (a))
stated in the dependence table's own words, in `catchStopped.js`'s form: the house's dependence, GATES held where the
record keeps its work beyond the gates (SV8b), meets the siege's stops (the herds where none are kept), and no row of its
own goes on (SV7: a row `SERVICE_FREE_OF_HOUSE` frees, or a siege twin on offer). MEASURED EQUAL to the page's verdict on all
2,348 besieged houses of the 900 (0 differ; without the SV7 arm 70 differ: inns, coaching inns, stable districts, the luxury
quarter, none a house of the atom's trades); the guard holds the equality on every house of its five besieged towns.
The atom's readings that move (base → tip, the 900): `fish` true → false 39, `fish taken here` 38, `stone` 8, `cut stone` 8;
40 towns (all besieged: the city siege+famine shape's fish markets, the hamlet sieges' fisher's landings, quarries).
**No printed line moves in any of the 900** (dumps diffed whole: the 28 towns that differ differ by items 1 to 3 only), and
no stored field: the reading is made true, the scenes over these towns were already refused by their crisis declarations.
A curtailed house stays at work (bar0-hamlet-under_siege-rand-34's landing, bar0-city-under_siege+famine-rand-36's Mine).
(b) LEFT BY NAME, see below.

**5 · THE LEGAL ROW'S PRISON (the chair's item 5).** `defenseDisplay.js :: deriveSupportingCapabilities`: the Legal
Infrastructure row's status, colour and note read `defenceOf(r).prison` (the defence home, over the LIVE roster), as its
court already reads the live roster; not `compound.inst.hasPrison`, stamped from the raw roster. `defenseStateProse.js ::
defenseThreatProse`: `internalRowPoolKey`'s prison argument is the same `defenceOf(settlement).prison` (its now unread
`compound` local is replaced by a comment line, so no line of either file moves). THE GUARD'S ARM (constructed): r2r-city-41
with its prison house set ruined (the stamped flag still true, the court still sitting): the row reads "Court only", its note
is no longer "Full enforcement chain", and the desk draws "Internal Security: court without detention", the pool the row
names, in the owner's record, `toPublicSafe` and the share veil alike; the negative, the same town unruined, keeps
"Court + Prison" and the full chain in all three. At the base the positive fails in all three views, the negative passes.
PROOF OF NO MOVE: the 900 re-born and re-rendered at bf776cf28 against dfad63083: every record byte-equal (900 of 900),
every dump byte-equal whole (every tab, the Defense tab among them, the PDF, the Tonight sheet and the journal); the two
functions over the 900 records give equal output, and the stamped flag equals the live prison in every born record. 0 of
525 (the 525's generator path does not reach either file). OTHER PAGE READERS OF THE STAMPED FLAG, NAMED, NOT CHASED: they
would disagree with the row only where a prison is ruined after birth: `src/domain/display/threatAssessment.js` about line
346 (the Defense tab's Internal Security assessment: "Arrest, trial and gaol all work here." / "People are locked up without
trial." read `compound.inst.hasCourtSystem && hasPrison`), and `src/domain/display/stateProse/generalStateProse.js` about line
1305 (DS-GEN-17's key 'ADMINISTERED' on `inst.hasCourtSystem && inst.hasPrison`). The generator's own readers
(`safetyProfile.js`'s prison notes, `defenseGenerator.js`) write at birth, where stamp and roster agree.

## The guard

`tests/generators/faultsWatch.test.js`, 13 tests over 11 seeds (each seed loop collects its failures; a negative beside each
positive): at the base 8 fail (every positive and every law, item 5's constructed arm among them), the 5 negatives pass;
at the tip 13 pass.

## Declared moves (stored record, base → tip over the 900; the 525 by the golden's own hash)

- `availableServices.criminal[].desc` (item 1): 1 town, r2r-city-41 (the 720). 0 of 525.
- `economicState.safetyProfile.guardEffectivenessDesc` (item 2): 11 towns: the 150 bar0-town-calm-rand-36, -37, -40; the 720
  r2r-town-0, -6, -23, -27, -36, -57, r2s-infiltrated-town-1, r2s-religious_conversion-town-2; the thirty none.
  **2 of 525**: `town|germanic|plains|road|frontier` and `town|germanic|plains|road|plagued` (the town watch's gate text;
  "most hours of the day" → "patrols on a regular round"), field family economicState.safetyProfile only.
- `powerStructure.factions[].desc` (item 3): 17 towns (above); the thirty none. 0 of 525.
- item 4: no stored field. Total: 28 towns of the 900 move (thirty 0, the 150 5, the 720 23); 2 of 525.

## Stored figures my work moves (the close's; none re-taken)

- the golden master `tests/fixtures/generator-golden-master.json`: 2 rows move against the base (already 499 of 525 off the
  file at the base): `town|germanic|plains|road|frontier|golden-master-v3` stored 666bbb9495f1… base 882c03fc1cbe… tip
  cea4c432a2e8…; `…|plagued|golden-master-v3` stored 8310acde9c23… base 048625988de6… tip 02f4dd4ac55e….
- `sovereigntyLightingContract.walker` the estate's file count: 3690 at the base → 3691 at the tip (stored 3641): my guard file.
- `tests/build/generationWorkerLazy.test.js` (WORKER_BUNDLE_CEILING_BYTES, red at the base too: built, the base's worker is
  2,536,023 B): the generation worker 2,536,023 → 2,561,848 B (+25,825). Item 4's reading pulls the dependence table's
  `SERVICE_DEPENDENCE`, `SERVICE_FREE_OF_HOUSE` and the gate-hold rows into the worker (tree-shaken out before). The SV7 arm is
  what makes the verdict exact on the 2,348 houses; without it 70 houses differ (none of the atom's trades). Item 5 adds 0.
- `proseWiringCensus.walker` car 0f (the alias draft): "the withdrawn candidates, reported and never proposed" 46 → 48 by item
  5's two `defenceOf(...)` read paths (a census figure in the walker; not re-taken).
- `mutationCoverageManifest` (TOTALITY): the gap list 5 → 6, `tests/generators/faultsWatch.test.js` added (beside the five
  bar8 guards already there). Its cure is an entry in `scripts/mutation-coverage-manifest.json`: NOT ON MY ROW, named, left.

## The net (each alone through `gate-tail.sh`, at the base and at the tip)

Green at both: `typecheck:domain:strict` (1113, ceiling 1113), `typecheck:ratchet`, `eslint` on the four sources and the
guard, `tests/architecture` (with tradeAtWork's new imports), `tests/joins`, `servicesStructure`, `bar8Watch`, `bar8Powers`,
`power/standingAgainstFigure`, `bar8Scenes`, `bar4ScenePresumption`, ONE `npm run build`, then `vendorPdfLazy` and
`bootSmoke` (49 passed, 17 skipped). N3: `pipelineContract`, `isolatedTrade`, `publicProseEquality` green at both;
`pipelinePinnedMode` (3: "golden rows moved … expected [ …(38) ]") and `generationForkCensus` (A1 control row hash, A4 the
register disagrees on 5 rows, A6 fnv1a32 external 54 vs 23) RED AT BOTH WITH THE SAME MESSAGES. THE OLDER TESTS (every file
under `tests` naming a function, constant, key or line I changed: 57 test files by `grep -rlE`, plus the guard):
every one the same exit code and the same failures by name and message at base and tip.

`tests/lint` (JSON, compared by name AND message; the base run in a git clone at 4288049ba, since several walkers read git):
47 red at the base. At the tip, beyond the base's: (i) `noLegacyFactionReaders` 3 → 4: its exemption
`'src/generators/power/rosterText.js:126': 'a tension'` is keyed by line and item 3's two comment lines moved it to 128;
CURED in dfad63083 (the comment trails the changed line; the walker reads the base's 3 at the tip, by name and message);
(ii) the figures above (file count, mutation manifest, after item 5 the alias draft's 46 → 48); (iv) after item 5,
`negativeAssertionAnchor.walker` caught the arm's two bare `.not.toMatch`: CURED in the same push (anchored with
`expectAbsentWithAnchor`; the walker green at the tip, as at the base); item 5's 89 older test files (every test naming
the two files, their functions or the row's words) each alone at base and tip: the same by name and message but
`legalRowReadsTheRoster` (re-keyed, above), `generationWorkerLazy` (the bundle figure above; red at both once built) and
the alias draft's count; (iii) three `STACK_TRACE_ERROR`s under load
(`observedShapeSentinel` M8/M9 gate 1, `presumedThings` "the admitted instruments", `siteCoherenceRatchet` C5 determinism):
each run alone at base and tip, the same by name and message. Red at both with the same message (named, not chased): the
brief's known reds (`factLayers.walker` importsAsPrinted, `proseEntryContradiction` 3510/3501 and 2802/2794, the observed
shapes, the writers' reach, the wiring census, the registers' counts) and the rest of the 47.

Scratch merge (N5) not run: this round's prompt names no line tip to merge against.

## What I left, by name

- **4b**: `tradeAtWork.js :: impairedUnderSiege` reads the STORED chain status where the card prints the shown one
  (`display/chainStateShown.js :: chainCrisisStateShown`): 5 house-trade pairs in the 900 (the Dyer's textile chains in
  bar0-city-under_siege+famine-rand-28, -31, -38 and r2r-village-55; an Enchanter's shop in rand-38), stored "running",
  shown "impaired". Importing the reader was tried and measured: it puts `chainStateShown.js` in engine-core beside two
  lazily pinned imports (`engineCoreLazyEdge.test.js` red, two arms); the pin is `vite.config.js`'s (R5: not a seat's).
  Nothing prints falsely by it in the 900 (BR25 (5)). The brief's count was 16 (the Dyer); mine is 5 by house-trade pair.
- `scripts/mutation-coverage-manifest.json`: the guard's entry (not on my row).
- runK's 13e.hours detector reads a gate as the day (FR9's blind spot), in the auditor's file, not mine.

## FR19 / FR22 · items 6 and 7 (the chair's rulings FR19, FR22)

Base 3c19fd1d8 (cleared to land by FR19). Tip a1fb0e825. Commits: 4e9e730c9 (item 6), d99ee9635 (its guard arms), ec2ed1e01
(FR22 (2) as ruled), 6359fb44b (item 7), 7a34980a5 (FR22 (2) as measured: DS-GEN-17 back to the base; a re-key), a1fb0e825
(the guard's anchors read from the pool). Files beyond my row, each given by the ruling: `threatAssessment.js` (one hunk; no
line moves). `generalStateProse.js` is byte-equal to 3c19fd1d8 at the tip. Item 7 lives in `servicesGenerator.js` (398 lines,
ceiling 400); `institutionServices.js` is untouched.

**Item 6 · the threat assessment (FR22 (1), as built).** `buildThreatAssessment`'s internal-security line reads the court by
`defence.js :: courtHoldersOf` and the prison by `defenceOf(r).prison`, the functions the Legal Infrastructure row reads; it
reads no `compound.inst` flag now. The words are the function's own four branches, unchanged (no new text): court and gaol
"Arrest, trial and gaol all work here."; court only "Cases are heard here, but there is almost nowhere to hold anyone.";
gaol only "People are locked up without trial."; neither "No court and no gaol; order rests on whoever is armed."
DECLARED MOVES (view-time; no stored field, the golden's hash moves 0): the line in 49 of the 900 (thirty 3 · the 150 8 ·
the 720 38), each now the branch its own Legal row names, on the PDF's DefenseSecurity (the only surface that prints it):
- "Arrest, trial and gaol all work here." → "People are locked up without trial." (Legal row "Prison only"), 11: the
  thirty: bar0-town-calm-rand-46, bar0-town-occupied-rand-47; the 150: bar0-town-calm-rand-30; the 720: r2r-town-5, -15, -25,
  r2s-insurgency-town-1, r2s-mass_migration-town-2, r2s-plague_onset-town-2, r2s-under_siege-town-2, -3.
- "Cases are heard here, but there is almost nowhere to hold anyone." → "No court and no gaol; order rests on whoever is
  armed." (Legal row "None": a town hall the stamped flag called a court), 38: the thirty: bar0-town-occupied-rand-45; the 150:
  bar0-town-calm-rand-29, -32, -40, bar0-town-occupied-rand-29, -34, -37, -41; the 720: r2r-town-4, -7, -8, -20, -22, -24, -26,
  -27, -33, -36, -45, -48, -50, r2s-famine-town-2, r2s-indebted-town-1, -3, r2s-infiltrated-town-2, r2s-mass_migration-town-1,
  r2s-monster_pressure-town-0, r2s-plague_onset-town-0, -3, r2s-recently_betrayed-town-2, -3, r2s-religious_conversion-town-0,
  r2s-slave_revolt-town-3, r2s-succession_void-town-0, -1, -3, r2s-under_siege-town-1, r2s-wartime-town-3.
Read whole against each page: the new line agrees with the Legal row and its note in all 49; in 15 of them the desk's own
"X keeps no court and no gaol …", which the base line contradicted, now agrees with it. Named, not built (FR22 (4)):
`cultureProfiles.js:421`'s "Court officers, … overlap." (6 of the 49) and "Commercial disputes resolved outside the courts"
(3); the stored `guardEffectivenessDesc`. The 525: the threat assessment differs in 4 configurations (not state prose: no
manifest row).

**Item 6 · DS-GEN-17 (FR22 (2), MEASURED, A DEVIATION FOR THE CHAIR'S VETO).** As ruled (ec2ed1e01) the key read the live
prison. Measured after: DS-GEN-17's ADMINISTERED pool declares the LIVE court and prison on every variant (v1, v2 `court
sits` + `prison`; v3 `court sits`; v4 `no court sits` + `prison`; v5 `no court sits` + `no prison`), so the base prints a true
line in every state, the ruin included: r2r-city-41 with its prison ruined draws, at the base, "In Nokhoiabad the law keeps a
building of its own." (no gaol). The ruled key only swapped that true line for another ("… pays wages for its defense as well
as keeping its walls.") and reddened `tests/ui/generalDeskTabFlow.test.js` (its fixture holds no prison and draws v5 "… has
no court sitting and no gaol in use.", also true). So `generalStateProse.js` is the base's again (7a34980a5): 0 moves in the
900 and the 525 (the dossier prose manifest's DS-GEN-17 rows: 0 configurations). FR19's "keys ADMINISTERED ('keeps its own
court and its own gaol')" was the key, not the printed line: v1 is refused by its own declarations wherever no gaol stands.

**Item 7 · the Holding cells (FR22 (3)).** After the houses' rolls (the lawless row's mechanism, `courtHoldersOf({ institutions,
availableServices: buckets })`, the Legal row's court over the services drawn), the Small prison/stocks' "Holding cells" takes
the chair's twin where no court sits, exactly "Short-term detention until a fine is paid." (label kept); where a court or a
bench sits it is unchanged. NEW TEXT (the chair's words, on the owner's veto list), three towns: r2r-town-5, r2r-town-15,
bar0-town-calm-rand-30. DECLARED MOVE (stored): `availableServices.legal[].desc` in 11 of the 900 (the same 11 as the
"People are locked up without trial." towns above; thirty 2 · the 150 1 · the 720 8), every other leaf of every record equal
to 3c19fd1d8's. The row prints in 31 of the 900: the twin in exactly the 11 whose Legal row reads "Prison only", the original
in the 20 with a court or a bench ("Court + Prison" 12, "Town hall bench + Prison" 4, "Council bench + Prison" 4). 300 FRESH
(r2r-<tier>-200..249): the row in 17, the twin in exactly the 3 "Prison only" (r2r-town-221, -225, -234), the original in the
14 others; against the same 300 born at 3c19fd1d8 only those 3 leaves move. Services tab and PDF Institutions alike (2 lines a
town); `toPublicSafe` carries the twin in all 11 and nowhere else. THE 525: 1 configuration moves,
`town|germanic|mountain|random_trade|civilized|gm-seed-c`, field family `availableServices` (the row's text is stored).

**The pages, base against tip, the 900 re-born and re-rendered whole:** every record equal but those 11 leaves; exactly 49
dumps differ, by the 49 threat lines and the 11 towns' two Holding cells lines; nothing else (DS-GEN-17 unchanged).

**The guard** (19 tests over 15 seeds): the ruin arm (r2r-city-41, its prison ruined): the Legal row "Court only", the desk's
"court without detention", the atoms `court sits` true and `prison` false, the threat line "Cases are heard here, …" (no gaol),
DS-GEN-17 drawing v3, never v1 (anchors computed by `variantByVid`); unruined, the full chain everywhere. The born arm
(r2r-town-5, r2r-town-4): the threat line says what the Legal row says. Item 7's arm: the twin exactly where no court sits;
r2r-town-5's twin in the record, `toPublicSafe` and the share veil; bar0-town-calm-rand-35 and r2r-town-1 unchanged. RED at
3c19fd1d8 (4 of 19), green at the tip. MUTATIONS, each red, unmutated green: the threat line's court set back to the stamped
flag; its prison to the flag; the cells' court read without the drawn services; the twin never written. `court or gaol` (FR6)
is not on my base: the arm reads its two halves.

**The net, base 3c19fd1d8 against the tip, each alone:** strict typecheck, ratchet, eslint, `tests/architecture` (import
classes kept: `threatAssessment.js` imports `facts/defence.js`, whose two imports it already reached), `tests/joins` green at
both; the 169 older test files the same by name and message but two, RE-KEYED BY IDENTITY: `tailDisplayCivic2Batch1`
(its court-without-gaol arm from r2s-famine-town-2, Legal row "None", to r2s-famine-town-0, "Court only") and
`generalDeskTabFlow` (green again with DS-GEN-17 restored, unchanged). `tests/lint`: the same as the base by name and message
(`proseDrawnAnchors` caught the guard's literal DS-GEN-17 anchors: cured in a1fb0e825). STORED FIGURES MOVED (the close's;
none re-taken): the generation worker 2,561,848 → 2,562,117 B (+269, item 7; the ceiling 2,356,121 is exceeded at the base
too); the golden master, 1 more configuration (`…|gm-seed-c`, item 7).

## FR25 · the court's lines outside my files (the chair's rulings FR25 and its call of 19:04 UTC)

Merged first, plainly: `lane/landing-pieces-2026-11-18` at b014a7bf3 (76062553d) and at 8771c531d (28465a9e1), both clean. FR25's
base is 28465a9e1. Commits: 3ebcc5ba5 ((a) and (b)), 5df61e5db ((c)). Files: `src/data/npcData.js` (two declarations),
`src/generators/factionDynamics.js` (the standing's line and one parameter), `src/generators/power/rulingStructure.js` (the
chair's grant: one argument at the call), the guard. No line of any of the three source files moves. No new vocabulary
(`court sits` already existed, BAR6-CULTURE). No services threaded (the chair's call): each line reads `court sits` as it
reads at its draw, over the roster.

**MEASURED FIRST** (base 28465a9e1), where the final Legal row has no court (the 900 · 300 fresh):
(a) the tie "… has been appointed to judge a case in which …": 8 · 1 (the reader's 6, and r2s-recently_betrayed-town-2,
r2s-under_siege-town-1; fresh r2r-town-221). (b) "… has a witness willing to name … before a magistrate.": 1 · 1
(r2s-plague_onset-town-0; r2r-town-225). (c) "… keeps enough rights of its own (land, courts, levies) to bargain, not simply
obey.": 1 · 2 (r2s-plague_onset-town-0; r2r-town-225, -231). Where a court sits they printed 136 + 4 (a), 23 (b), 26 (c) in the
900. The magistrate's letter (`npcData.js:1787`) prints only where a court sits (4 towns): named, nothing done.

**BUILT.** (a) and (b): `needs: ["court"]` (a NAME test that takes every town hall) → `needs: ["court sits"]`, the Legal row's
court half (`defence.js :: courtHoldersOf`) as it reads at the draw; refused, the tie takes its pool's next row (description
and tension are one row; no new text). (c): `rulingStructure.js` passes `courtHoldersOf({ institutions: nativeInstitutions })
.length > 0`; `computeFactionRelationships` prints the standing's twin where it is false. THE TWIN, by the chair's wording rule
("courts" struck from the list and nothing else changed): "… keeps enough rights of its own (land, levies) to bargain, not
simply obey."; null (a caller with no roster) keeps the line.

**PROVED.** (1) None of the three prints anywhere the FINAL Legal row has no court, over the 900 and the 300 fresh; no town
held a court at the draw and none at the end. (2) THE MOVES, every one in `relationships[]` (a, b) or
`powerStructure.factionRelationships[].narrative` (c), every other leaf equal to the base:
- (a), the 8 no-court towns: bar0-town-calm-rand-30, r2s-mass_migration-town-2, r2s-plague_onset-town-2,
  r2s-recently_betrayed-town-2, r2s-succession_void-town-1, r2s-under_siege-town-1, r2s-under_siege-town-3, r2s-wartime-town-3;
  fresh r2r-town-221.
- (a), DECLARED under the chair's LR3 (a true tie passed over: the court sits by a hall's or a council's service, not on the
  roster): r2r-town-29, r2r-town-41, r2s-famine-town-3, r2s-infiltrated-town-0. NAMED: in r2r-town-41 and
  r2s-infiltrated-town-0 a SECOND tie moves too: the refused tie's next row was the row the town's next tie held, and the pool
  does not repeat a held line (no draw added: the knock-on of the no-repeat rule).
- (b): r2s-plague_onset-town-0; fresh r2r-town-225.
- (c): r2s-plague_onset-town-0; fresh r2r-town-225, r2r-town-231. The new argument moves nothing but the standing's line.
(3) THE 525: 3 configurations move (`town|south_asian|coastal|port|civilized|golden-master-v3`,
`town|germanic|mountain|random_trade|civilized|gm-seed-c`, `town|germanic|plains|road|civilized|gm-seed-c`): `relationships`,
and in one `prominentRelationship` (derived from the ties); (c) alone moves 0. (4) THE GUARD gains arm 8 and 8 (c): no line
where no court sits over the guard's towns; bar0-town-calm-rand-30 and r2s-plague_onset-town-0 keep ties of the pool in their
place; r2s-plague_onset-town-0's standing is exactly the twin; beside a courthouse (bar0-city-wartime-rand-36,
bar0-metropolis-calm-rand-40) all three still print; r2r-town-29 passes the judge over (declared). Red at 28465a9e1 (5 arms),
green at the tip. MUTANTS, each red, unmutated green: (a)'s declaration back to `court`; (b)'s; the court argument dropped
(null); the twin's test inverted.

NOT BUILT (the owner's): the stored holding-cells row after a court is ruined.

**The net, base 28465a9e1 against the tip, each alone:** strict typecheck, ratchet, `tests/architecture` green at both;
`tests/lint` the same by name and message; the 114 older test files naming the three lines, their functions or `npcData`
the same by name and message but one, `tieProseDeclared`, which holds `npcData.js`'s declarations equal to the census ledger
`docs/census/declarations/npcData.STRESS_ECONOMIC_EFFECTS.json`: the ledger's two rows follow the source (d1a8c8be3;
`mil_crim_suppression.tension#3`, `bitter_history.tension#3` → `court sits`; the letter's `econ_crim_exploitation.tension#6`
keeps `court`), as BAR6-PEOPLE wrote its own into it. ONE build at both, then the build tests: the same but the figure.
STORED FIGURES MOVED (the close's; none re-taken): the generation worker 2,574,979 → 2,575,053 B (+74; the ceiling 2,525,028
is exceeded at the base too); the driven fence's hash (`espionageDormancyFence` FENCE 1, already moved at the base:
fe4e2e1d… → f3fdbcbd…, stored cd67a3c1…); the golden master, 3 configurations (above).
