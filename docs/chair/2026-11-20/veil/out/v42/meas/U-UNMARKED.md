# U — THE PRODUCTION QUESTION: what an UNMARKED share serves at Reveal off (R4I-MEASURE, VEIL-42; the chair's item of 08:45 UTC)

SUMMARY (10 lines)
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
the map doors serve it at Reveal OFF on every marker. `import_gallery_map` (072 :~138, `return public.get_gallery_map(p_slug)` behind
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
