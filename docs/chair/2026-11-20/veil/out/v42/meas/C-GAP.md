# C — "GAP": every path where a stored person id still stands after the re-key (R4I-MEASURE, VEIL-42)

SUMMARY (15 lines)
1. THE MANIFEST OF SITES (R4I-SQL-2's), from the POSITIVE CONTROL only (master's shape as criminalSwitchHandReach builds it, Reveal
   DM, BOTH engines: gallery server and twin, import, the gallery page): `factions[].members[].goal.intent.short.target.id` (456 hits /
   60 reads), `factions[].members[].goal.intent.long.target.id` (443 / 60), `factions[].members[].allegiance.handler` (35 / 10, the
   unmarked DM read only). Link and map member: 0 (never Reveal DM). publicProse: 0 on every run.
2. THE SETS: today-born 140 (3,360 reads a door, 5 doors + 2 twins): 0. MASTER-BORN 140 (`m140`, the same): 0. The pool's births
   (1,808, gallery door, page and both twins, 43,392 reads): 0. Fresh-shaped stored ids: 0 everywhere.
3. CAUSE (read): 212 :: `_gallery_veil_rekey` (:2810, its last pass) and `galleryVeilPeople.js :: rekeyPeople` re-key a roster copy's
   `members[].id` ONLY; a Reveal-DM projection keeps each member's whole record in master's top-level `factions[].members[]`.
4. WHY THE OLD STORED MEASURE READ 0 (CONFIRMED): its documents hold no stored person id off the re-key's sites. Master-born: 15,002
   stored-id occurrences, ALL at sites (members' `goal` is `{ short, long }` strings, no `allegiance`: master writes no intent);
   today-born: 32,608, all at sites (no roster copy at all). The gap lives only in the HYBRID (today's people in master's top-level
   roster) that criminalSwitchHandReach's `toMasterShape` builds, in neither set. Not the mask, not the doors: this measure, with the
   import, the map member and the page added, reads 0 on both sets again and bites on the control.
5. ON THE MASTER-BORN SET, NOT A PERSON ID: the server writes a `power` share onto top-level `factions[]` (352 reads, 32 places, Reveal
   DM, every marked setting): A-77.md's aside, now on real stored documents.

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
THE SERVED COUNT: next section.

## THE MASTER-BORN SET, SERVED (`m140`, the -wip, v28tpl, 14:09-14:30 UTC; `logs/m140-table.txt`; 140 x Reveal off/DM x 12 = 3,360 reads a door)
Every door (gallery `data` + marker, link `dossier` + marker, import `data`, the map member, the gallery page) and both twins: 0 STORED
PERSON IDS SERVED; 0 inside publicProse; 0 fresh-shaped; the stored side's census (off-site paths): none. THE MASTER-BORN PATH LIST IS
EMPTY. The served marker (A's ask (2)): gallery marked 3,080 served marker, UNMARKED 280 of 280 NO served marker; link 3,360 served
marker; import and the map member: no marker field on any read (3,360 each).
ALSO READ ON THIS RUN (A's instrument, L1 gallery, not a person id): 352 of 3,360 reads differ, 32 places, Reveal DM, the 11 MARKED
settings (none unmarked, none at Reveal off): `factions[]#keys` and `factions[].power` (1,969 leaves), e.g. r3m-city-none-1-107
dm|default `factions[0]`: server `dominantCategory,members,name,power` (`power` 20) | twin `dominantCategory,members,name`. The cause:
A-77.md's aside (212 :: `_gallery_veil_roster_choices` :2318-2337, a NULL comparison in its share guard; the twin's guard
`galleryRosterChoices.js` :147). Link L1: 0. L2 the same 352 (no other path). (A different 352 from M's pool 352.)
