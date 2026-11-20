# R3-CURE-3 HAND-BACK (VEIL-24's builder; worktree `/home/user/wt/r3c2`, branch `v24-r3c2`, one commit on b907c75c9)

Order worked: the brief's unit 1, then the chair's rulings of 10:21 (A, B, C, D) and 10:28 (D1, D2), which override the brief.

## The bytes
- 211 unchanged: `eface6d0…0b01`, rollback `ce8474ff…712f`. 212 unchanged: `cde846131969c93a094ef518a1ce8dec74d33dff1532b91f3e3dca5310ad79e2`,
  rollback `40357bed…65b1` (`sha256.txt`; `git diff b907c75c9 -- supabase` empty). No engine rule changed.
- Files COMMITTED: `tests/domain/display/publicSafe.test.js` (ruling B), `src/domain/display/galleryRosterChoices.js` (a ONE-LINE TYPE
  FIX, no behaviour: b907c75c9 fails both typechecks, TS2339 at 328 `s.simulationTrace.length` on unknown; now a local `kept`), `out/v24/r3c3/`.
- NOT COMMITTED (RED; saved whole as `UNCOMMITTED-red-arms.patch`, apply with `git apply`): the leak check and tooth in
  `galleryServerVeil.pglite.test.js` and ruling A's `hand-forms` plant in `galleryRosterChoices.pglite.test.js`. Both are RED AT b907c75c9
  ON REAL FINDINGS (below); they are the red-first halves of the next cure. Run log: `pglite-with-red-arms.txt` (61 of 64; the 3 reds are these arms).

## TWO FINDINGS, NEITHER CURED (the mark): FOR THE SEAT, AT ONCE
1. A LEAK (the goal HUSK), both engines, Reveal DM, default veil: server-veil-city-2 (npc_merchant_guilds_15_40, npc_mint_official,
   npc_stone_quarry) and server-veil-metropolis-7 (npc_multiple_garrisons, npc_workhouse, npc_professional_city_watch); 24 faults
   (`pglite-with-red-arms.txt`; detail `measure/leak-city-2.jsonl`). Stored: `long: "Bring Thieves' Guild under the sway of Merchant
   oligarchy, one member at a time."`, `intent.long.target = { kind: 'power', id: "Thieves' Guild" }`. SERVED (gallery page, and 212's
   own response `data`): the goal with that sentence and the target's `id` removed, the rest kept:
   `{"short":"Find out whether …","intent":{"long":{"family":"POWER","key":"expand_influence","kind":"tense","target":{"kind":"power"}}, …}}`.
   A string-level sweep (the hidden-name sweep, PLAUSIBLE: not traced) strips the strings first, so the goal rule then finds no target id
   and no sentence to match, and the goal stays as a husk aimed at an unnamed power: "leaves whole" is broken. The 210 page carries the
   same husk (law (2) is green), so only the new leak check sees it. CURE PROPOSED (not made): the goal rule judges each person's goal on
   the PRE-SWEEP projection (`pub`, by person id) and deletes the served goal whole, in 212 and the twin; red first = the patch above.
2. AN OVER-WITHHOLDING (ruling A's other direction): the plant's SERVED power "Old Thieves' Guild Watch" (civic, not raised by any house)
   is WITHHELD WHOLE by the twin on the Reveal-DM open read (only "Harbour Board" served; the twin probe in scratch; the born arm's tooth
   0), so its goal never reaches a page. Toward withholding, but ruling A says it stays byte for byte: power.entry (or the copy pass) takes a
   power whose NAME CONTAINS the withheld one. Server not separately read (the born arm failed on its tooth first).

## Unit 1 / ruling A — THE TWO REVEAL-DM GOALS: NEITHER A LEAK NOR A FALSE POSITIVE; WITHHELD IN BOTH ENGINES BY THEIR TARGET ID — CONFIRMED
`unit1-goals.txt` (each goal's text beside every withheld name, its bare form, its id; every served power; the first cure's substring
tokens; the lane search's verdict; per read, server gallery / server link / twin, at 06e9e64b3 and b907c75c9), from `measure/goals.probe.jsx`
(the test's own dials and veil configurations) and `measure/test-dump-after.json` (the test itself, instrumented copy, deleted after).
- server-veil-city-infiltrated-0, `npc_mages_guild` (Kai Zhang): short "Keep Cheng Jung satisfied, so that what is known stays hidden.",
  long "Keep Koharu Kim in debt for as long as it is useful."; `intent.short.target = { kind: 'power', id: "Thieves' Guild" }`.
- server-veil-metropolis-3, `npc_smelter` (Pradeep Deshpande): short "Prove to Parvati Chaudhary that they are worth a bigger cut.", long
  "Rise past Mamata Prasad in Craft Guilds on their own merit, owing no one for the climb."; `intent.short.target = { kind: 'power', id: "Thieves' Guild" }`
  (Craft Guilds: SERVED).
- Withheld on the default+dm and all+dm reads: "Thieves' Guild" (bare form the same; no id); the link also "The Independent Bloc" (hidden power).
- THE PREMISE WAS A MISREAD. The targets DO carry an id (the hand-back's "{ family, key, kind }, no id" read the first three paths of a
  fault list the test truncates at three). The first cure's substring matched NOTHING in either sentence (0 tokens, every read); both
  goals left at 06e9e64b3's SERVER by the target id, and leave at b907c75c9 in BOTH engines by the same target id (the lane's search hits
  the id "Thieves' Guild"). Nothing is served: no leak. What turned the guard: at 06e9e64b3 the TWIN served both goals on default+dm
  (`goals-base.json`), so the 210 page (the current client read over 210's response) showed them and the 212 page did not: red. At
  b907c75c9 the twin withholds them too, both pages lack them, the guard is green, and `goalsLeaveWithTheirPower` removes nothing
  (control.goals 0), which is why the uncommitted tooth on `control.goals` was red. (PLAUSIBLE: which line of 06e9e64b3's twin served them; not traced.)
- Ruling A's plants (`hand-forms`, the born test; UNCOMMITTED, in the patch, server reads and the twin, Reveal off and on): "Become the Thieves' Guild's fixer" (possessive),
  "Pay off the thieves' guilds of the coast" (plural, lower case), "Never cross THE THIEVES' GUILD again" (capitals): each leaves. THE OTHER
  DIRECTION: "Stand a night shift with the Old Thieves' Guild Watch." (a SERVED power whose name holds the withheld one) stays byte for
  byte; the test names its exemption positively: the bare search hits the sentence, the containing served name is exactly
  "Old Thieves' Guild Watch", and with it cut out nothing hits. RESULT: RED at b907c75c9 on the other direction (finding 2): the Watch
  itself is withheld. The three forms' verdict was not reached in that run (the arm stops at its tooth); the twin's search was checked
  directly (`buildNameSearch`: "the Thieves' Guild's man", "thieves' guilds", "THIEVES' GUILDS", curly apostrophes: all hit; "Craft Guilds":
  no hit). Red-first runs on 411565ff9 / 06e9e64b3 were stopped at the mark (not reported).
- The cure did not need the shared search: `buildNameSearch` already folds case and takes `(?:e?s)?` and a separator ("'s") as the
  boundary (`(?:e?s)?(?![…])`); 212's `_gallery_veil_name_search` is its twin. No change there; no caller moved.
- House names are NOT open names in the goal rule (only served powers'): a goal naming a withheld power inside a served HOUSE's name is
  withheld (toward withholding). The ruling permits that exemption; I did not widen serving to take it.

## Unit 2 — THE TOOTH, COMMITTED
`galleryServerVeil`: (1) a leak check on every read, both pages: a stored goal aimed at (target id) or naming (the lane's search) a power the
page does not serve must be absent (`goalsAimedAtWithheld`); (2) the tooth arm: `control.aimedAtWithheld > 0` (the check is live) AND
`control.shownGoals > 0` (goals aimed at a SHOWN power exist, each compared byte for byte by law (2)). Measured on the two towns alone:
shownGoals 276. No plant needed (the hand rows hold such goals). RESULT: the tooth's counts bite, and the leak check is RED on
server-veil-city-2 and server-veil-metropolis-7 (finding 1): NOT COMMITTED (patch). The two original towns pass it.

## Unit 3 — THE FOUR TWIN REDS, BY COMMIT (measured; `unit3-twin-reds-by-commit.txt`)
| test | 4c753ec52 | 411565ff9 (R3) | 06e9e64b3 (R3-CURE) | turned by |
|---|---|---|---|---|
| publicSafe "criminal faction … name, category and standing stay" | green | RED | RED | 411565ff9: power.entry (a power a hidden house raised leaves whole) |
| publicSafe "Defense's criminal architecture … their data goes" | green | RED | RED | 411565ff9: power.entry's copy (the pair with the withheld guild leaves) |
| publicSafe "flipping every eye to shown reveals no DM-only field" | green | RED | RED | 411565ff9: registry `history.tension.crimeWave` (VR4 ii-7) |
| criminalVeilSwitch VR34 (b) | green | green | RED | 06e9e64b3: power.entry on master's top-level list (R3-CURE unit 1) |
All four pin behaviour a ruling overturned (the power rule, its reach to both stored shapes; the crime-wave row); none is a regression.

## Ruling B — THE THREE publicSafe PINS, RE-STATED (cause in the commit message)
Each: the old positive on Bailthwaite with NO HOUSE HIDDEN (its two hideable criminal houses shown by hand; for the third, the Fence shown),
and a new arm with the house hidden: the row leaves whole, proved by the lane's search (with a tooth: the same search finds it where served).
RED at 4c753ec52's src (`unitB-publicSafe-red-at-4c753ec52.txt`: the three new arms red), GREEN at this cure (`unitB-publicSafe-green.txt`, 59 of 59).
ONE DEPARTURE FOR THE SEAT: "standing stays byte for byte": name, category and powerLabel ('Suppressed') do; the SHARE reads 14, not 5:
R3's VR31 (`power.share`) re-derives a served share set that does not sum to 100, and this trimmed fixture's two shares sum to 35 (5 + 30).
Written into the arm with its reason; the fixture is shared and was not changed.

## Ruling C — criminalVeilSwitch VR34 (b): NOT RE-STATED
Its assertion, verbatim: `const shut = applyVeil(master, resolveVeil(d, [])); expect(shut.factions[0].members, 'the default shuts it on every copy').toBeUndefined();`
It throws (`shut.factions[0]` undefined): by default the den is hidden whole and "Red hand" leaves BOTH lists whole (power.entry), so the
row it reads is gone. Measured (`vr34b-measure.json`, twin): the owner's switch ON (every criminal part shown, the den shown): "Red hand" is
SERVED on both lists, members included (Ada). The switch on and a criminal house hidden ELSEWHERE (a second house "Smugglers' cove" hidden by
hand; the switch reads "partly"): "Red hand" is WITHHELD whole on both lists. Hiding the Mill is a no-op (not a hideable house). So the
criminal row is served only while no criminal house is hidden whole; any hidden criminal house takes it, whichever house raised it
(power.entry's reach, toward withholding). PLAUSIBLE for the server (not run there; the acceptance run holds server = twin at b907c75c9).

## Ruling D — THE R3 GATE (only D1 and D2 reached; D (i) and D (ii) LEFT)
- D1 (`D1-lower-towns.txt`): the 13 LOWER towns each assigned: `income.criminalRow` (7 towns, 4 of them also the covert service),
  the covert criminal service withheld by the chair's ruling 2 of 09:04 (6 towns), `power.entry`'s reach (3 towns:
  metropolis-insurgency-1-124, metropolis-wartime-0-59, town-none-0-23). NONE unassigned. From b907c75c9's measure (no engine changed).
  PLAUSIBLE: that `income.criminalRow` counts as a RULED rule (R3's registry row, VR14 ii).
- D2: the counterfactual is built INDEPENDENTLY of the projection: `tests/security/galleryRosterChoices.pglite.test.js :: beforeAll`'s
  `birth` (and `out/v24/r3c2/measure/keys.probe.jsx :: birth`, the same code): `generateSettlementPipeline` with an `onStep` that cuts
  every hideable house (`cardVeil.js :: isHideableHouse`) from `ctx.institutions` and `ctx.settlement.institutions` after EVERY step,
  then from the result; never a projection helper.
- LEFT: D (i) (the gate shown to fail with the re-derivation switched off in a scratch copy, on the five formerly HIGHER towns) and D (ii)
  (the control as a per-crime-dial table). Not run: the mark.

## Unit 4 — AT THIS COMMIT
- publicSafe 59 of 59 (`unitB-publicSafe-green.txt`). criminalVeilSwitch: VR34 (b) red, not re-stated (ruling C), the rest green.
- With the red arms in place (`pglite-with-red-arms.txt`): galleryRosterChoices born test whole except the new arm, galleryServerVeil
  whole except the two towns' leak-check faults, galleryVeilHandRows green. The committed test files are b907c75c9's (the patch removed),
  so at this commit galleryServerVeil is 80 of 80 as R3-CURE-2 left it (PLAUSIBLE: not re-run after removing the arms; the run above
  differs from it only by the arms).
- Registry `--check` exit 0; eslint on the four touched files exit 0; typechecks domain:strict 0 and ratchet 0 (after the type fix; both 1
  at b907c75c9). 211 and 212 unchanged; the acceptance run and harnesses NOT re-run (212 and its twin's behaviour untouched).

## CONFIRMED / PLAUSIBLE
CONFIRMED: unit 1's attribution (both goals withheld by target id in both engines at b907c75c9; 0 substring tokens at 06e9e64b3); the
four reds' turning commits; ruling B red at 4c753ec52 and green here; ruling C's measure (twin); D1's assignment from b907c75c9's measure;
finding 1 (the husk, on the test's own pages and 212's response). PLAUSIBLE: the sweep as finding 1's mechanism; ruling C on the server;
income.criminalRow as a ruled rule.

## WHAT IS LEFT
1. Finding 1 (the goal husk, a LEAK, both engines): cure red first from the patch. 2. Finding 2 (the Watch withheld). 3. Ruling A's three
forms in both engines once the arm's tooth can pass. 4. D (i) and D (ii). 5. The acceptance run and harnesses after any 212 change.

Last line: commit on `v24-r3c2` (parent b907c75c9) carrying this file; files: `src/domain/display/galleryRosterChoices.js`,
`tests/domain/display/publicSafe.test.js`, `docs/chair/2026-11-20/veil/out/v24/r3c3/`; 212 sha256 `cde846131969c93a094ef518a1ce8dec74d33dff1532b91f3e3dca5310ad79e2` (unchanged).
