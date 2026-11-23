# C — "GAP": every path where a stored person id still stands after the re-key (R4I-MEASURE, VEIL-42)

SUMMARY (15 lines)
1. INSTRUMENT: `personIdBijection.shared.mjs :: storedIdsServed` as it stands at the -wip ((E) + (F)), on `[body, served marker]` of
   every door (gallery, link, import as a premium reader, a `get_gallery_map` member, and the gallery page through the client) and on
   both twins (gallery `projectShareVeil(galleryPayloadFor(...))`, link `linkTwinOf`); Reveal off and DM; 12 settings.
2. THE POSITIVE CONTROL BITES (run `ctrl`, criminalSwitchHandReach's six towns in both shapes, 288 reads a door): on MASTER'S SHAPE,
   Reveal DM, the known gap is found, BOTH ENGINES, at three paths:
   `factions[].members[].goal.intent.short.target.id` 456 hits on 60 reads; `factions[].members[].goal.intent.long.target.id` 443 on 60;
   AND A THIRD, NOT KNOWN BEFORE: `factions[].members[].allegiance.handler` 35 on 10 (the UNMARKED DM read only; e.g. `npc_veiled_5064ee784f11c849`).
   Each on: gallery server, gallery twin, import server, the gallery page (L2). NOT on the link (never Reveal DM) nor the map member
   (`_gallery_sanitize_public_json`: never DM). 0 on the current shape. 0 inside publicProse. 0 fresh-shaped stored ids.
3. CAUSE (read): 212 :: `_gallery_veil_rekey` (:2810) and its twin `galleryVeilPeople.js :: rekeyPeople` re-key a roster copy's
   `members[].id` ONLY (the last pass, "master's roster copies"); a DM projection keeps each member's WHOLE record in master's
   top-level `factions[].members[]` (goal, allegiance), whose references no rule re-keys. The same on both engines, rule for rule.
4. The sets (today-born, master-born, the pool's births): below, each the moment it is read. THE OLD 0: below, after the master-born set.

## THE CONTROL (`/var/tmp/v18/out/v42/meas/ctrl/table.txt`, copied to `logs/ctrl-table.txt`; run 07:02-07:06 UTC)
Documents: the six towns of `criminalSwitchHandReach.pglite.test.js` (v102-thorp-0, -hamlet-6, -village-3, -town-1, -city-0,
-metropolis-1), born as it bears them, each stored as born ("current") and through its `toMasterShape` (copied verbatim).
The stored side's census (every path of the stored document holding one of its stored person ids, the re-key's sites apart):
`factions[].members[].goal.intent.long.target.id` 50 in 5 documents, `.short.target.id` 53 in 5, `factions[].members[].allegiance.handler`
18 in 5: all on the master shape (the thorp has no power). Served (by door | engine :: path: hits on reads; one example):
| door, engine | `...goal.intent.short.target.id` | `...goal.intent.long.target.id` | `...allegiance.handler` |
|---|---|---|---|
| gallery, server (`get_gallery_dossier.data`) | 456 / 60 | 443 / 60 | 35 / 10 |
| gallery, twin | 456 / 60 | 443 / 60 | 35 / 10 |
| import, server (`import_gallery_dossier.data`) | 456 / 60 | 443 / 60 | 35 / 10 |
| gallery page, server row through `fetchPublicDossier` | 456 / 60 | 443 / 60 | 35 / 10 |
| link server, link twin, map member | 0 | 0 | 0 |
Examples: v102-village-3 (master), dm|default: `factions[0].members[1].goal.intent.short.target.id = "npc_charcoal_burner"`,
`factions[0].members[0].goal.intent.long.target.id = "npc_peat_cutter"`; dm|unmarked: `factions[1].members[0].allegiance.handler =
"npc_veiled_5064ee784f11c849"` (a handler served on the unmarked DM read only: the default veil withholds the field on every marked one).
60 reads = 5 master-shape towns x 12 settings, Reveal DM; 0 at Reveal off on every door.

## THE TODAY-BORN SET (`t140`: the 140 births at the -wip = the dumped `/var/tmp/v18/out/v42/stored-today` byte for byte, 140 of 140;
3,360 reads a door; `logs/t140-table.txt`)
Every door (gallery, link, import, map member, the gallery page) and both twins, Reveal off and DM, 12 settings: 0 STORED PERSON IDS
SERVED, outside publicProse and inside it. 0 fresh-shaped stored ids. The stored side's census: NO path of any of the 140 documents
holds a stored person id outside the re-key's own sites. Why (read off the documents, `logs/shape-census.txt`): today's births carry
`npcs[].goal.intent` (a re-keyed site) and NO roster copy at all (no top-level `factions[]`, no `powerStructure.factions[].members`).

## THE POOL'S BIRTHS (`pool`, 1,808 places, 43,392 reads; the gallery door only, for time: link, import and map member NOT read on the pool)
gallery server (`data` + marker), gallery twin, link twin, gallery page: 0 STORED PERSON IDS SERVED; 0 in publicProse; 0 fresh-shaped.
The stored side's census lists `stress[].cast.roles[].id` (22 in 5 places, e.g. t2b-city-none-126 `npc_veiled_f872a98fe3f51c30`) and
`stress[].cast.levers[].holderId` (14 in 4, e.g. `npc_customs_house`): THESE ARE RE-KEYED SITES (212 :: `_gallery_veil_rekey` and
`rekeyPeople` take `stress` as one crisis OR A LIST; `personIdBijection.shared.mjs :: crises` too); the census's own site list named
`stress.cast…` and `stressors[]…` but not `stress[]…`: an omission of this unit's census, not a gap (0 served at those paths).

## THE MASTER-BORN SET: THE STORED SIDE, READ BEFORE ITS SERVED RUN (`stored-census.mjs`, node over the documents, no run; 12:0x UTC)
`logs/stored-census-master.txt` (and `-today.txt`): every occurrence of a stored person id in each stored document, by path
(`storedIdsServed(doc, doc)`), each path marked SITE (one the re-key re-keys, 212 :: `_gallery_veil_rekey` / `rekeyPeople`) or OFF-SITE.
- MASTER-BORN, 140 documents, 15,002 occurrences: ALL AT SITES (`relationships[].npc1Id`/`npc2Id` 5,020 each, `npcs[].id` 2,080,
  `factions[].members[].id` 2,080, `stress`/`stressors.cast.roles[].id` 183 each, `.cast.levers[].holderId` 177 each,
  `simulationTrace[].targetId` 82). 0 OFF-SITE: master's members carry `goal` as `{ short, long }` STRINGS and no `allegiance`
  (`logs/shape-census.txt`), so the gap's three paths hold nothing to serve.
- TODAY-BORN, 140 documents, 32,608 occurrences: all at sites (no roster copy at all).
THE SERVED COUNT on the master-born set (`m140`, every door and twin): queued behind the Tonight seat's holdD (the mutex, since 11:58).
