# U — THE PRODUCTION QUESTION: what an UNMARKED share serves at Reveal off (R4I-MEASURE, VEIL-42; the chair's item of 08:45 UTC)

SUMMARY (10 lines)
1. "MAP-COVERT" (the chair's name; IMPORT-DOOR's cure), TODAY-BORN SET READ (`umtoday`, 140 places, 3 markers x Reveal off/DM):
   7 places' stored `prominentRelationship` is a covert tie's copy (the 7 of A); 0 places' `pressureSentence` tells one.
2. `get_gallery_map` member, its page (`fetchGalleryMap`) and `import_gallery_map` member SERVE THAT COPY BYTE-EQUAL on 7 of 7 places,
   EVERY marker (unmarked, default, hand), Reveal OFF (and DM): 7 of 7 reads in each of the 18 cells.
3. `get_gallery_dossier` data, its page, `import_gallery_dossier` data and its page: 0 of 7 at Reveal off on every marker (7 of 7 at
   Reveal DM, by the owner's design); `get_unlisted_dossier`: 0 everywhere; `get_unlisted_map`: hands no member dossier (0 of 140 x 6).
4. THE PRODUCTION QUESTION ANSWERED for the gallery read: the UNMARKED gallery row carries NO served marker (140 of 140, off and DM),
   its served `data` carries NO covert copy (0 of 7), and `fetchPublicDossier`'s unserved branch adds none (0 of 7): it can only keep
   what was sent. For the map doors the answer is the fault: sent, and kept by the page.
5. CAUSE (read, table (e)): the map member never runs 212 :: `_gallery_apply_member_overrides` (the covert CASE :3086-3094).
6. MASTER-BORN SET (`ummaster`, 140 places): 0 places carry a covert copy to serve: no stored tie of master's is flagged `covert`
   (0 of 140 documents; master's generator writes no such flag), so the covert CASE has nothing to drop on any door, and no door
   serves a covert copy (0 reads on every door, marker and Reveal). The unmarked gallery row: NO served marker, 140 of 140.

1. FIRST READING (a trial of two of the 7 places, today-born set, `logs/trial-U-2of7-table.txt`; the full sets below when run):
   the MAP MEMBER (`get_gallery_map` members[].settlement) SERVES THE COVERT TIE'S COPY in `prominentRelationship`, byte-equal to
   the stored copy, on 2 of 2 places whose stored copy is covert, on the UNMARKED share AND on the MARKED one (the default marker):
   2 of 2 each; `fetchGalleryMap` keeps it for the page (2 of 2: it re-derives, never projects).
2. The gallery read (`get_gallery_dossier.data`), its page (`fetchPublicDossier`), the import (`import_gallery_dossier.data`) and its
   page (`fetchDossierForImport`), and the link: 0 of 2 carry it (unmarked; the gallery marked: 0 of 2). The unmarked gallery row
   carries NO served marker (2 of 2), so its page takes the unserved branch; it keeps nothing the server did not send.
3. CAUSE, READ: 211 :: `get_gallery_map` (:1392; not restated in 212) builds each member as
   `coalesce(_gallery_veil(pub.j, s.gallery_member_overrides, false) -> 'body', pub.j)` over `pub.j = _gallery_sanitize_public_json(src.j)`:
   it never runs `_gallery_apply_member_overrides`, the one home of the covert CASE (212 :3086-3094, "VEIL-13, ruling (5)"), which
   the gallery read, the link and the import each run. The member has no client twin. A measure; no cure here.
4. STATUS: CONFIRMED on 2 places (r3m-town-wartime-0-29, r3m-city-none-1-107); the counts on both stored sets: below, when read.

## WIDENED (the seat's message of 08:55 UTC: "MAP-COVERT", the chair's; its cure IMPORT-DOOR's): THE TRIAL ON ONE PLACE
r3m-town-wartime-0-29 (its stored `prominentRelationship` a covert tie's copy, "Silent Partnership"; its `pressureSentence` not
covert-telling), three markers (unmarked `{}`, the default `writeShareVeil({}, [])`, a HAND marker: the tell probe's `own`), Reveal
off and DM, `logs/trial-U-widened-1-table.txt`. Reads carrying the stored covert copy, byte-equal (1 read each cell):
| door | unmarked off | default off | hand off | unmarked DM | default DM | hand DM |
|---|---|---|---|---|---|---|
| `get_gallery_dossier` data | 0 | 0 | 0 | 1 | 1 | 1 |
| gallery page (`fetchPublicDossier`) | 0 | 0 | 0 | 1 | 1 | 1 |
| `import_gallery_dossier` data / its page (`fetchDossierForImport`) | 0 / 0 | 0 / 0 | 0 / 0 | 1 / 1 | 1 / 1 | 1 / 1 |
| `get_gallery_map` member / its page (`fetchGalleryMap`) | **1 / 1** | **1 / 1** | **1 / 1** | 1 / 1 | 1 / 1 | 1 / 1 |
| `import_gallery_map` member | **1** | **1** | **1** | 1 | 1 | 1 |
| `get_unlisted_dossier` dossier | 0 | 0 | 0 | 0 | 0 | 0 |
| `get_unlisted_map`: hands a member dossier at all | no | no | no | no | no | no |
At Reveal DM the gallery and import doors serve the covert tie BY DESIGN (the owner's "Reveal DM content": the tie itself is kept);
the map doors serve it at Reveal OFF on every marker. `import_gallery_map` (072 :146, `return public.get_gallery_map(p_slug)` behind
its importable / signed-in gate) hands exactly `get_gallery_map`'s members. `get_unlisted_map` (168 :401) hands no member dossier
(the publish-time world snapshot only): no door. The gallery row of the unmarked share carries NO served marker (as 211 decided).

## (e) ONE TABLE, BY READING: what `get_gallery_dossier` applies to its `data` and `get_gallery_map` does not apply to its member
`get_gallery_dossier` (212 :3172-3282): data = `coalesce(vl.v -> 'body', <proj.d less incomeSources[].weight>)` (:3214) over
`vl = _gallery_veil(proj.d, overrides, false, src.copied)` (:3276) over `proj.d = _gallery_apply_member_overrides(<base>, _gallery_dm_full_json(src.j),
overrides, share_dm, importable, false)` (:3266-3271). `get_gallery_map`'s member (211 :1392-1449): `coalesce(_gallery_veil(pub.j,
overrides, false) -> 'body', pub.j)` (:1414) over `pub.j = _gallery_sanitize_public_json(src.j)` (:1436). Both take the narration
choice (`base`) and the frozen copy (`src`, the same bound). WHAT THE MAP MEMBER DOES NOT GET:
| # | what | `file :: symbol` (line) | what it carries that the member lacks |
|---|---|---|---|
| 1 | THE MEMBER-OVERRIDES SPLICE AND THE COVERT CASE | 212 :: `_gallery_apply_member_overrides` (def :3078; the covert CASE :3086-3094; called by the gallery read :3266) | each member's own revealDm / allowImport; and VEIL-13 ruling (5): `prominentRelationship` WHOLE where it is a dropped covert tie's copy, `pressureSentence` where it tells one. THE MAP-COVERT FAULT. |
| 2 | the Reveal-DM projection as base | 212 :: `get_gallery_dossier` :3267 (`_gallery_dm_full_json(src.j) - array['decrees','dmLayer','customContentRoster','customContentProvenance']`) | the owner's Reveal DM (`gallery_share_dm`): the member is always the public projection (no gap: it serves less) |
| 3 | the DM-full source of the splice | 212 :: `get_gallery_dossier` :3269 (`_gallery_dm_full_json(src.j)`, the splice's 2nd argument) | the full town the covert check reads (relationships[], prominentRelationship, pressureSentence as stored): without it no covert rule can run |
| 4 | the frozen copy's date to the veil | 212 :: `get_gallery_dossier` :3276 (`_gallery_veil(..., src.copied)`, `copy`) | the snapshot's freeze date in the served marker; the member passes the default `false` (no marker is sent with a member) |
| 5 | the unmarked fallback's weight strip | 212 :: `get_gallery_dossier` :3214 | each `economicState.incomeSources[].weight` dropped where no body; under 212 `_gallery_veil` returns a body for every object `pub`, so the fallback is reached by neither door (PLAUSIBLE, read) |
Not different: `_gallery_sanitize_public_json` (both, on Reveal off), `_gallery_veil` (both; it runs roster choices, the re-key and
withhold-always on the member too), the narration choice, the frozen copy and its bound. The twin: the member has none (named).

## THE TODAY-BORN SET (`umtoday`, 11:24-11:35 UTC, `logs/umtoday-table.txt`; 140 places x 3 markers x Reveal off/DM = 840 reads a door)
Places whose stored copy is covert: `prominentRelationship` 7 (r3m-city-none-1-107, r3m-city-infiltrated-0-42, r3m-metropolis-infiltrated-0-62,
r3m-town-wartime-0-29, r3m-city-infiltrated-1-102, r3m-city-under_siege-1-118, r3m-metropolis-none-1-137); `pressureSentence` 0.
Reads (of the 7 covert places' 7 a cell) carrying the stored covert `prominentRelationship`, byte-equal:
| door | unmarked off | default off | hand off | unmarked DM | default DM | hand DM |
|---|---|---|---|---|---|---|
| `get_gallery_dossier` data / gallery page | 0 / 0 | 0 / 0 | 0 / 0 | 7 / 7 | 7 / 7 | 7 / 7 |
| `import_gallery_dossier` data / import page | 0 / 0 | 0 / 0 | 0 / 0 | 7 / 7 | 7 / 7 | 7 / 7 |
| `get_gallery_map` member / map page | **7 / 7** | **7 / 7** | **7 / 7** | 7 / 7 | 7 / 7 | 7 / 7 |
| `import_gallery_map` member | **7** | **7** | **7** | 7 | 7 | 7 |
| `get_unlisted_dossier` dossier | 0 | 0 | 0 | 0 | 0 | 0 |
| `get_unlisted_map` (a `members` key at all, of 140) | 0 | 0 | 0 | 0 | 0 | 0 |
The gallery row's served marker: unmarked 140 of 140 NO served marker (off and DM); default and hand 140 of 140 served marker.
Example (r3m-city-none-1-107, unmarked, Reveal off, the map member): `prominentRelationship.full` = "Jaguar Claw Tut visits Xiuhcoatl Chel
after dark, by the back way, twice a season. They talk about what Xiuhcoatl Chel wants done next." (the stored covert tie's copy).

## THE MASTER-BORN SET (`ummaster`, 11:35-11:43 UTC, `logs/ummaster-table.txt`; 140 places x 3 markers x Reveal off/DM)
Places whose stored `prominentRelationship` is a covert copy by the twin's rule: 0; whose `pressureSentence` tells a dropped tie: 0.
WHY (read off the documents, node over `/var/tmp/v18/out/v42/stored-master`): 0 of 140 documents hold a tie with `covert: true`
(master's tie keys: type, typeName, description, tension, strength, npc1Id, npc2Id, npc1Name, npc2Name, npc1Role, npc2Role,
archetypeKey, proseVariant, flagDriven); the public projection drops no tie (`publicSafe.js :: sanitizePublicValue` drops `covert`
exactly true), so no copy is a dropped tie's. `prominentRelationship` is stored in 87 documents and present (as a key) on every door's
body at Reveal off, 140 of 140, the map doors and the gallery read ALIKE: no door differs from another here. MAP-COVERT: 0 reads.
The gallery row's served marker: unmarked 140 of 140 NO served marker (off and DM); default and hand 140 of 140 served marker.
