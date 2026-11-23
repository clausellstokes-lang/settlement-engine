# R3-TELL HAND-BACK, UNIT 1 ONLY: MEASURE FIRST (VEIL-27's builder; worktree `/home/user/wt/r3tell`, branch `v27-r3tell`, on 72913fc86)

No line of 212 or the twin was written. 211 `eface6d0…0b01`, 212 `6260803d…0218`, rollback 212 `8cbd7d1c…`: unchanged.
One command: `sh docs/chair/2026-11-20/veil/out/v27/tell/measure/tell.sh <worktree> <outdir> <template: createdb -T x211, then 212> 2`
(about 21 minutes on this box; template here `tell_tpl`). Its table: `run2/tell-table.txt`. MEASURE ONLY: it does not gate.

## STOPS AND FIRST LINES

1. **STOP (a surprise, to the chair at once): A SERVER-TWIN PARITY BREAK, THE TWIN SENDING MORE.** On 10 of 92 towns, in every
   setting with the criminal-services grouping open (5 of the 10 settings tried), Reveal DM off and on, the twin serves
   `availableServices.criminal` rows that carry NO `institution` key, and 212 does not:
   - "Fence (stolen goods)": metropolis-politically_fractured-0-60, metropolis-insurgency-1-124, city-infiltrated-0-42,
     metropolis-politically_fractured-0-70, metropolis-wartime-1-139 (212 drops the row);
   - "Muscle for hire" and "Protection racket": town-none-0-21, town-insurgency-0-14, town-under_siege-0-18,
     town-infiltrated-0-22, town-under_siege-1-98 (212 serves the list EMPTY, `[]`; the twin serves the two rows).
   The T side (the counterfactual) never breaks. The gate's key arm cannot see it (the key reads equal). CONFIRMED (both engines,
   `run2/tell-table.txt` "PARITY BY TOWN"). Which non-owner reads project through the twin and so send these rows: PLAUSIBLE, not
   traced (unit 1 is a measure).
2. **STOP: THE RULE AS WORDED CANNOT BE MET BY WITHHOLDING ALONE.** The owner's own setting, of 92 towns: the target page shows
   criminal CONTENT today's page lacks in 81 (Reveal off) and 83 (Reveal DM); content reachable by withholding alone: 11 and 9.
   Two causes, both CONFIRMED by measure:
   - **UNCOVERABLE** (withheld today by a ruled fail-closed rule, shown by the target under EVERY setting of the owner's
     switches, the switch-off page included): power.entry's reach, 9 towns, both reads (the "Thieves' Guild" row: the switch
     hides a criminal power's DEPTH, never its row; under Reveal DM also its goals, memberships, relations and cast stakes).
     Under Reveal DM 30 towns in all: those 9; 3 more by goals and memberships aimed at the GOVERNING "Corrupt City Council" (VR42
     keeps its row, the goal rule takes the goals); 17 by `simulationTrace` entries alone (the engine's DM-only log, which no
     switch governs: `faction.thieves_guild` 19 reads, `institution.black_market_bazaar` 14); 1 by a plot hook. To meet the rule
     there, a cure would have to REVEAL (or the switch-off page would have to hide a criminal power's row: a change to the
     owner's switch, not a cure).
   - **DRIFT** (the regenerated town's own criminal content that today's town never had; no withholding produces it): 80 of 92
     towns (own setting). E.g. the counterfactual's own covert services ("Fencing stolen goods (covert)"), crime types, a
     criminal income row (132 town-reads), power conflicts, a crime-wave tension. And the derived prose and labels differ in
     essentially every town (`sp.prose` 1,760 of 1,840 town-reads, both ways: the regenerated town's own safety sentences).
   **The tell column today: YES in 1 of 92 towns (Reveal off) and 0 of 92 (Reveal DM), own setting; 2 and 1 under the switch OFF;
   on content families alone 7 and 1.** The chair's reading of "equal field for field" decides whether the drift and the
   derived prose count; the tables below give every family apart so the ruling can pick.
3. **STOP (known, not new): R4'S HOLDERS ARE ON THE PAGE.** Under Reveal DM the person who HOLDS a hidden house is served with
   her name, role, title and `category: "criminal"`, only the house tie gone: "the gang boss" 44 towns, "the black marketeer" 41,
   "the guildmaster of thieves" 26, "the smuggler" 4 (both engines; e.g. metropolis-infiltrated-0-52, Egilbert Ihle, holder of
   "Thieves' guild (powerful)", hidden whole: `roles/roles.json`). Ruling 15 (VR9) gives them to R4, which is not in this tree
   (PART 28 section 3). They are counted in the cost below (`people.roles` 115 rows, `ties.criminal` part of 631); R4 takes them
   whatever this rule says.
4. **THE INSTRUMENT'S OWN ARTIFACT, FOUND AND REMOVED:** the counterfactual's `simulationTrace` logs a house's SELECTION before the
   probe cuts it, so B's trace names houses a truly house-free town never selected (run1: 1,510 of 1,840 "uncoverable" trace
   items named a cut house). Run2 drops trace items naming a cut house from every B surface. Audit: B's served page holds a cut
   house's name elsewhere in 4 of 92 towns, only in `simulationTrace[].causes[].reason` (4 leaves). The 14 `black_market_bazaar`
   items left may be the same artifact through a house B itself selected and the probe cut (PLAUSIBLE).
5. **THE CLUSTER (for the seat):** at 15:19 UTC the scratch PG16 at /var/tmp/rv7 was DOWN (the container restarted after 14:35;
   stale pid 577); I started it (`pg_ctl -D /var/tmp/v18pg start`). `r3c6tpl` was ABSENT (after.sh recreates it). The cost-timing
   job had NOT begun: `/var/tmp/v18/out/v27/at-8d5/steps.txt` did not exist from 15:19 to 16:30. My heavy windows (4 shards each):
   run1 15:35:15-16:02:34, run2 16:04:48-16:25:50 (`run*/window.txt`), and three short smokes. A cost timing overlapping them should
   be re-taken. Databases left: `tell_tpl`, `tell_run2_0..3`.

## THE DEFINITIONS (unit 1's two)

**THE CRIMINAL SURFACE, FOUND BY SEARCH** (`measure/search.probe.jsx`, `search-an.mjs`; `search/search-paths.txt`): over every page of
the gate's pool (140 births, 92 counterfactuals, twin, Reveal off and on: 1,112 pages), every leaf by path (an empty list or
object is a leaf: PRESENCE), four tags per normalized path: **switch** (differs between "Show" and "Hide everything criminal" on
the record: 216 paths), **house** (differs between every criminal part shown but the hideable houses, and the same with the
houses shown: 193), **word** (a criminal word in the value: 145), **key** (a criminal key in the path: 50). 288 paths in all,
grouped in `measure/tell-surface.mjs` into families, each keeping only criminal-attributed rows (a criminal house's or power's,
a criminal-worded row), people judged by what they point at, never by who they are (the counterfactual's cast differs):
- CONTENT (C; the withheld set is read from these): `svc.criminal` (presence + rows), `svc.otherCriminal` (rows of other
  categories from a criminal house or criminal-worded), `inst.criminal`, `sp.ops` and `sp.crimeTypes` (PRESENCE: absent / empty /
  list, + entries), `sp.blackMarketCapture`, `sp.plotHooks`, `income.criminal` (presence + rows), `chains.criminal`,
  `imports.criminal`, `powers.criminal`, `powers.capture` (criminalCaptureState, each captureState), `powers.relations`,
  `powers.conflicts`, `tensions.crime`, `cast.criminal` (stress/stressors stakes and levers), `trace.criminal`, `people.goals`,
  `people.memberships`, `people.allegiance`, `people.houseTies`, `people.roles`, `people.corruptKeys`, `ties.criminal`,
  `conditions.criminal`.
- DERIVED (D): each content family's figures (`*Rows`, `powers.captureValues`), `income.shares` (the other rows' re-derived
  percentages), `sp.flags`, `sp.prose` (safetyDesc, guardEffectivenessDesc, economicDragDesc), `compound.econ` and `compound.sp`
  (hasCriminalInst and its siblings, criminal names, raw.criminal), `dial` (config.priorityCriminal, priorities.criminal),
  `econ.complexity`, `powers.governing`, `prose.criminal` (the criminal prose rungs: defense:criminal.*, criminalLine, incomeMix,
  captureReading, gmAdvisory, legitimacyReading, operationReading, and any rung with a criminal word), and THE DERIVED LABELS the
  page computes from the served document after `rederiveForPage` (`factsOf`: crime, crimeWave, rivalRings, criminalIncome,
  lawBand; `deriveCriminalStructure`; `blockListsCrime`; `covertCrimeHeld`; running criminal chains; "Magical crime").
- Not in the surface: people's and ties' other fields, the rest of `publicProse`, the stored figures outside these families.

**THE SETTINGS** (computed on each record by its own Curate screen): `own` (the gate's: the three criminal groupings and the hooks
tab opened by hand, every house at its default, hidden whole); MIXED `g:<services><defense><underside>` (1 open, 0 shut; hooks
open; the seven besides `own`); `allOpen` ("Show everything criminal", then every hideable house back to hidden whole); `off`
("Hide everything criminal").

**THE WITHHELD SET W** (per town, read, setting X): the content items the counterfactual's page B_X shows, today's page A_X does
not, AND A's own page under X with its houses shown does (a withholding by the veil). The rest of B_X minus A_X is DRIFT.

**THE NEAREST SETTING N(X, W), computable:** X plus the FEWEST criminal parts of B's own Curate screen
(`criminalVeilSwitch.js :: criminalPartsOf`: the parts a hand can see and undo) not hidden under X, such that B_N shows none of W;
searched over the union of single parts' covers, sizes 1 to 4, each candidate read; ties broken toward the setting that keeps
the MOST surface items shown (ties left: counted in `ties`). If no such set: the switch OFF. If B_off still shows part of W:
UNCOVERABLE. A target whose N leaves every criminal part hidden is counted as the switch-off page.

## TABLE 1: THE COST, PER SETTING, OF 92 TOWNS (`run2/tell-table.txt` TABLE 1; twin; server equal but for STOP 1's rows)

Target: the owner's own setting / a nearer setting / the switch-off page. Tell YES (whole surface) and YES on content alone.
Lose: rows a reader of the cured page loses beside today's page (content C, derived D: total / median per town).

| read / setting | own | nearer | off | tell YES | YES content | reachable by withholding | uncoverable | lose C | lose D |
|---|---|---|---|---|---|---|---|---|---|
| Reveal off / own | 61 | 22 | 9 | 1 | 7 | 11 | 9 | 424 / 3 | 867 / 8 |
| off / g:110 | 65 | 15 | 12 | 1 | 8 | 12 | 9 | 424 / 3 | 674 / 6 |
| off / g:101 | 77 | 6 | 9 | 1 | 9 | 15 | 9 | 321 / 3 | 713 / 7 |
| off / g:011 | 62 | 21 | 9 | 1 | 19 | 40 | 9 | 223 / 1 | 674 / 6 |
| off / g:100 | 77 | 0 | 15 | 1 | 9 | 15 | 9 | 321 / 3 | 603 / 6 |
| off / g:010 | 68 | 0 | 24 | 1 | 21 | 46 | 9 | 223 / 1 | 465 / 4 |
| off / g:001 | 83 | 0 | 9 | 2 | 26 | 56 | 9 | 120 / 1 | 504 / 4 |
| off / g:000 | 83 | 0 | 9 | 2 | 26 | 56 | 9 | 120 / 1 | 394 / 3 |
| off / allOpen | 60 | 23 | 9 | 1 | 7 | 11 | 9 | 424 / 3 | 863 / 8 |
| off / switch OFF | 83 | 0 | 9 | 2 | 26 | 56 | 9 | 120 / 1 | 394 / 3 |
| Reveal DM / own | 46 | 16 | 30 | 0 | 1 | 9 | 30 | 1391 / 13 | 1091 / 12 |
| dm / g:000 | 62 | 0 | 30 | 1 | 3 | 45 | 30 | 938 / 9 | 507 / 5 |
| dm / allOpen | 45 | 17 | 30 | 0 | 1 | 9 | 30 | 1719 / 15 | 1090 / 12 |
| dm / switch OFF | 62 | 0 | 30 | 1 | 3 | 45 | 30 | 938 / 9 | 507 / 5 |

(Every DM mixed setting is in the table file.) The more the owner shuts, the less a cure costs and the more towns it can reach.

**WHAT A READER LOSES, own setting, Reveal off (rows / towns):** the other income rows' figures re-derived 222/45; criminal prose
rungs 204/91; criminal services 201/73 (chiefly "Contraband transport (smuggling)" on 55 towns, "Arcane services (illicit)",
"Forbidden components", "Magical forgery"); safety sentences 116/88; criminal-archetype ties among shown people 85/42 ("Corrupt
Arrangement", "Active Suppression"); crime types 55/24 (crisis types: "collaboration fraud", "conscription fraud", "desperation
theft"); the "Criminal income" label 54/54; operations-list entries 48/24 ("Gambling District", "Red Light District", "Gambling
Halls": shown houses' labels); then labels, powers' rows and conflicts in single digits. **Reveal DM** adds the ties (631/87, 40
"Silent Partnership" covert ties), R4's holders (115/82), the trace (111/65), criminalCaptureState (71/46). Examples:
`run2/examples-own.txt`, `run2/examples-g000.txt`.

## THE THIRTEEN LOWER TOWNS (own setting; Reveal off | Reveal DM): target, W, content rows lost C- / target-only C+

| town | rule (ruling 52) | Reveal off | Reveal DM |
|---|---|---|---|
| city-none-0-31 | income.criminalRow | nearer +defense; W crimeTypes; C-6 C+3 | nearer +defense; C-18 C+3 |
| town-insurgency-1-94 | income.criminalRow | nearer +underside; W income; C-1 C+0 | nearer +underside; C-2 C+1 |
| town-under_siege-0-18 | income.criminalRow | nearer +underside; W income; C-3 C+1 | nearer +underside; C-7 C+2 |
| town-under_siege-1-88 | income.criminalRow | nearer +underside; W income; C-1 C+3 | nearer +underside; C-2 C+4 |
| city-under_siege-1-118 | income + covert | nearer +defense; W crimeTypes, income; C-4 C+5 | nearer +defense; C-13 C+5 |
| town-under_siege-0-28 | income + covert | nearer +services +underside; C-1 C+3 | same; C-9 C+4 |
| town-under_siege-1-98 | income + covert | own (W empty); C-2 C+3 | own; C-8 C+3 |
| town-wartime-0-29 | income + covert | nearer +services; C-2 C+2 | nearer +services; C-10 C+3 |
| town-none-0-17 | covert | nearer +services +defense; C-3 C+3 | same; C-12 C+4 |
| town-none-1-91 | covert | own (W empty); C-4 C+2 | own; C-11 C+3 |
| metropolis-insurgency-1-124 | power.entry | OFF, UNCOVERABLE (Thieves' Guild); C-11 C+6 | OFF, UNCOVERABLE (+goals, memberships, relations, trace); C-27 C+19 |
| metropolis-wartime-0-59 | power.entry | OFF, UNCOVERABLE (+cast stakes); C-20 C+9 | OFF, UNCOVERABLE; C-39 C+28 |
| town-none-0-23 | power.entry | OFF, UNCOVERABLE; C-6 C+4 | OFF, UNCOVERABLE; C-21 C+20 |

None of the thirteen reads YES today; none would read YES after a cure by withholding (every one keeps target-only content).

## THE 79 EQUAL TOWNS AND THE 48 CONTROL TOWNS
- **EQUAL (79):** the rule MOVES them. Own setting, Reveal off: tell NO 78 of 79; the target is nearer or the switch-off page
  (the rule withholds more) in 20; UNCOVERABLE (it would reveal) in 6 (the other six power.entry towns); content rows lost 360.
  Reveal DM: NO 79 of 79; withholds more in 35; uncoverable 27; content rows lost 1,212. Every mixed setting: TABLE 5.
- **CONTROL (48, no hideable house):** the counterfactual's own path, cutting nothing, equals the plain birth BYTE FOR BYTE in 48
  of 48, so the target page IS the served page: the rule cannot move a control town (neither reveal nor withhold).

## WHAT WOULD MAKE THE RULE REVEAL RATHER THAN WITHHOLD
1. power.entry's reach: 9 of 92 towns (Thieves' Guild; Reveal DM its goals, memberships, relations, stakes): no switch hides
   a criminal power's row. 2. Goals and memberships aimed at the governing criminal power (VR42), 3 more towns, Reveal DM.
3. `simulationTrace` (DM only), 17 more towns: no switch governs it. 4. DRIFT, 80 of 92 towns: the counterfactual's own criminal
content. 5. The derived prose and labels, every town: they are the regenerated town's own sentences.

## CONFIRMED vs PLAUSIBLE
- CONFIRMED (measured, both engines where named): every count above; the parity break (STOP 1); the holders served (STOP 3,
  three towns read by hand in `roles/roles.json`, the counts by the family); control 48/48; 211 and 212 unchanged.
- CONFIRMED (read): the switch hides a criminal power's depth eyes (`members, goals, conflicts, description`), never its row
  (`criminalVeilSwitch.js :: criminalCandidatesOf`, `galleryVeil.js :: DEFAULT_VEIL_RULES` criminal-faction).
- PLAUSIBLE: which reads send the twin's rows (STOP 1); the 14 `black_market_bazaar` trace items being an artifact; that the
  family list covers every criminal path a reader can see (288 searched paths are grouped; a path tagged only by a criminal
  WORD in non-criminal prose, e.g. `npcs[].personality.flaw` "corrupt", is not in the surface).
- NOT DONE: the import, link and public-page reads (gallery read only); the old stored shape (born pool only).

## FILES (commit below)
`measure/` tell-common.mjs, tell-surface.mjs, search.probe.jsx, search-an.mjs, tell.probe.jsx, tell-an.mjs, ex-an.mjs, tell.sh,
roles.probe.jsx; `search/search-paths.txt`; `run1/tell-table.txt` (before the artifact was removed; superseded), `run2/`
tell-table.txt, examples-own.txt, examples-g000.txt, window.txt, done.txt; `roles/roles.json`. The shards' JSON stays on disk
uncommitted (5 MB; re-made by the one command).
