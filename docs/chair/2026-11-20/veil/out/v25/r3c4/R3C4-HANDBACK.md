# R3-CURE-4 HAND-BACK (VEIL-25's builder; worktree `/home/user/wt/r3c4`, branch `v25-r3c4`, on 9b18835d1)

## STOPS AND FIRST LINES
1. **UNITS 1-2 NOT GREEN, NOT COMMITTED: STOPPED AT THE MARK.** The cure is written in 212, its rollback and the twin, and is
   saved whole as `UNCOMMITTED-cure-units-1-2.patch` (also left in the worktree, uncommitted). Its last full run
   (`green-r3-born.full.txt`, `green-serverveil-handrows.full.txt`) is RED; one twin bug found and fixed AFTER that run (not re-run):
   the relation pass read `pub`'s `factionRelationships` through `recAt`, which returns null for an array, so the twin judged no
   relation pre-sweep while the server did (this is the twin/server difference at `factionRelationships[]` and galleryServerVeil's
   "page changed: factionRelationships[#5].direction" on city-2 and metropolis-7). What is left is listed under "WHAT IS LEFT".
2. **A HUSK CLASS NOT CURED (a ruling, not a cure):** KEY-LEVEL removals on a SERVED holder. A shown power's `contestsNiche`
   naming a withheld power (`powerStructure.factions[].contestsNiche` 19 server / 5 twin, `factions[].contestsNiche` 2 / 1) and a
   served person's affiliation key (`npcs[].factionAffiliation` 6 / 2) are taken as KEYS by R3-CURE's ruled rules; the holder
   stays, so the absence is a husk by the brief's definition. To cure it is to withhold a shown power or a served person whole.
   The born test's husk arm lists them (KEY_LEVEL) and does not gate them. For the seat/chair.
3. **Unit 3 (the gate instrument) NOT REACHED, and the coordinator's TELL COLUMN (12:09) NOT BUILT** (not reached; whether it is
   cheap was not measured: the security reader should build its own). Unit 5's counts not taken.
4. `observedShapeReaders.walker` (a KNOWN red) reads {2222, 1556, …} with the uncommitted cure in the tree, against PART 25's
   {2220, 1556, 448}: PLAUSIBLY +2 from the cure's new reads (`pub.npcs`, `q.memberships`); not measured at the base.

## Unit 1 — THE GOAL HUSK
- RED, COMMITTED (a9e2de44a): R3-CURE-3's patch as it stands; 3 failed of 39 (`unit1-red-at-9b18835d1.txt`, full log beside):
  server-veil-city-2 6 faults, server-veil-metropolis-7 6 faults (the goal husk), hand-forms: the Watch's tooth 0.
- THE MECHANISM, CONFIRMED (twin by execution, `measure/husk-mech.probe.jsx` wrapping each pass, `unit1-mechanism-twin.json`;
  server by reading 212): TWIN `galleryVeil.js :: applyVeil` calls `gallerySecondHomes.js :: withholdSecondHomes` (line 765),
  whose last step `sweepHiddenNames` deletes every key and string naming a HIDDEN HOUSE by the name search (the house names,
  their bare forms, their birth catalogue ids: metropolis-7's "Thieves' guild (powerful)" folds to "Thieves' guild"): it takes
  `goal.long`/`goal.short` and `goal.intent.*.target.id` (= "Thieves' Guild"); the power's own `faction` is floored (still shown at
  that moment). THEN `applyRosterChoices` (line 778): power.entry withholds the power, and `withholdPowerCopies` finds no name and no
  id left in the goal: the husk is served. The trace shows the goal changed by withholdSecondHomes and unchanged by
  applyRosterChoices for all 17 (city-2) and 22 (metropolis-7) people whose stored goal names or aims at the guild. SERVER:
  `_gallery_veil` → `_gallery_veil_apply` → `_gallery_veil_second_homes` (its last step `_gallery_veil_name_sweep`, 212 line ~1691)
  → then `_gallery_veil_roster_choices(body, pub)` (the copy pass): the same order.
- THE CLASS, MEASURED (red, before the cure; `unit1-husk-class-red-measures.txt`; the born test's new arm `husksOf`): 240 documents
  with a power withheld, 175,469 objects compared, projection (`galleryPayloadFor`, pre-sweep) against served body by path.
  STRUCTURED husks (server = gallery+link+import+map; twin): goal target ids (short 54/27, long 60/30), `memberships[].power` 56/28,
  `conflicts[].parties[]` 38/10 and `powerStructure.conflicts[].parties[]` 38/10, `history.currentTensions[].factions[]` 26/7,
  `powerStructure.factionRelationships[].pair[]` 10/5, and the key-level ones in STOP 2. PROSE (R5's, listed): `npcs[].goal.long`
  74/37, `.short` 60/30, `conflicts[].desc` 38/10 (both lists), `factionRelationships[].narrative` 10/5, `.dmNote` 6/3,
  `contestsNiche` (sentence values), `memberships[].power` (sentence) 4/2. NOT power copies (house labels by the fold: R3's own
  house rows): `safetyProfile.criminalInstitutions[]` 26/7, `compound.inst.names[]` 26/7 (both), `availableServices.criminal[].institution`
  twin 2 / server 0 (a twin/server difference to read).
- THE CURE (uncommitted patch): each structured copy is judged ALSO on its counterpart in `pub` (the projection the veil ran on):
  a goal leaves WHOLE where the same person's (by id) pre-sweep goal named a withheld power; a membership, a conflict (both lists),
  a tension and a power relation leave whole where a naming pre-sweep element of the same place HOLDS them (jsonb containment
  `@>`; the twin's `heldBy` mirrors it). 212: new helpers `_gallery_veil_copy_names` and `_gallery_veil_npc_copies` (revoked by name;
  dropped in the rollback), the hits read over `pub`'s copies too. Twin probe after: 0 husk goals on the two towns
  (`unit1-mechanism-twin-after.json`). Run AFTER (before the recAt fix): the goal husks gone in both engines (galleryServerVeil's
  two towns fail only on the relation difference); the husk arm left: relation pairs (twin; the bug above) and
  hand-raised dm=true `npcs[].memberships[].power` in BOTH engines (NOT traced: perhaps the Reveal-DM roster splice after R3).

## Unit 2 — THE EXEMPTION (the Watch)
- WHICH RULE: power.entry in BOTH engines (twin `entryOut`, 212 three `~* 'thie'` clauses): a non-governing power whose NAME holds
  "thie" is withheld whatever its category, so the civic "Old Thieves' Guild Watch" left whole. CONFIRMED by reading both engines.
- CURE (in the patch): the thieves' name decides only where the power carries NO category string (unsure: withheld); the category
  decides otherwise. The fold search is untouched. Measured first: 0 of 1,478 born powers (140 towns, Reveal off and on) read
  differently; every born "Thieves' Guild" carries category 'criminal' (`unit2-thie-census.json`). The born test's `crim` helper
  re-stated the same way.
- AFTER: the Watch is served; the born test's search arms then hit "Old Thieves' Guild Watch" because `searchHits` has no open names
  (TEST-SIDE, not fixed: it must take the served powers' names as opens, the ruled positive exemption), and the hand-forms arm's
  exemption reads `[Watch, Watch]` on master's shape (two lists; dedupe). The three forms: not reached green.

## Unit 4 — COMMITTED GREEN (5ef2a92b1)
criminalVeilSwitch VR34 (b) re-stated, both arms and a third (a criminal house hidden elsewhere); 9 of 9 (twin). Server: PLAUSIBLE.

## Other runs (with the uncommitted cure in the tree)
Acceptance run EXIT 0 (`acceptance-run.txt`: 37 of 37, server = twin 15 of 15). Cost (`cost-big-town.txt`, x211 vs x212, other
runs on the box): Reveal-DM gallery read of the largest town 678 ms against twice 211's Reveal-OFF 410 ms (820): within.
eslint 0; registry --check 0; typechecks strict 0 and ratchet 0; guards-twin: only observedShapeReaders red; known reds: the four
named, red. NOT RUN: guards s1/s2, harnesses, R2's born test, VR17, V10-2.

## WHAT IS LEFT (in order)
1. Re-run the born test and galleryServerVeil with the recAt fix (in the patch). 2. Trace hand-raised dm=true memberships.
3. Test-side: `searchHits` opens (served powers' names, naming the containing name); dedupe the exemption's holders.
4. Then commit units 1-2 as one cure; the guards, harnesses and cost rows. 5. Units 3 and 5; the tell column.

CONFIRMED: the mechanism (twin executed, server read); the class counts; power.entry as the Watch's rule; the census.
PLAUSIBLE: the server's membership husk cause; the observedShapeReaders +2.

Last line: commits a9e2de44a (unit 1 red: two test files + red outputs), 5ef2a92b1 (unit 4: criminalVeilSwitch.test.js + two
outputs), and the docs commit carrying this file and `out/v25/r3c4/`; 212 at HEAD unchanged
`cde846131969c93a094ef518a1ce8dec74d33dff1532b91f3e3dca5310ad79e2` (with the uncommitted cure: `70c6eb45…220a124`, rollback
`8cbd7d1c…ded5b0`); 211 `eface6d0…0b01` and rollback `ce8474ff…712f` unchanged.
