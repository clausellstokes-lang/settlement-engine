# FAULTS-WATCH hand-back

Seat FAULTS-WATCH of the round FAULTS (BRIEF-FAULTS, section FAULTS-WATCH; rulings FR9, BR25 (5), BR29, BR30 (3)).
Base 4288049ba (`lane/faults-base-2026-11-18`). Branch `lane/faults-watch-2026-11-18`, tip dfad63083. Merged nothing.

| commit | what |
|---|---|
| c5059fd60 | the hand-back's title line |
| 4041ed2a9 | item 1: the crime-type "(lawless)" row reads `lawlessRow` |
| 54919dded | item 2: a gate held is a post, not a round by day; a levy at need walks no round (FR9); `bar8Watch.test.js` re-keyed |
| b6ee0ea99 | item 3: a power with no old standing takes the final roster's sentence |
| 68328b578 | item 4 (a): `trade at work` reads the siege's stop of a house; (b) left by name; `bar8Scenes.test.js` re-keyed |
| 32e2dc76c | the guard `tests/generators/faultsWatch.test.js`; `houseStoppedBySiege` exported for it |
| dfad63083 | item 3's comment moved onto the changed line so no line of `rosterText.js` moves (see the net) |

Files touched: the four on the seat's row, the new guard, the two older tests re-keyed by identity (`bar8Watch.test.js`,
`bar8Scenes.test.js`) and this file. No new field on the saved record. No new text (every line that moves is a line or
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

## The guard

`tests/generators/faultsWatch.test.js`, 11 tests over 11 seeds (each seed loop collects its failures; a negative beside each
positive): at the base 7 fail (every positive and every law), the 4 negatives pass; at the tip 11 pass.

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
(ii) the two figures above (file count, mutation manifest); (iii) three `STACK_TRACE_ERROR`s under load
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
