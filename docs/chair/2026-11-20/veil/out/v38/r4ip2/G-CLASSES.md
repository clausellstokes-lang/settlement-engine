# G — THE VR46 GUARDS, EVERY RED BY CLASS (R4I-PAGE-2, VEIL-38). PARTIAL: see "LEFT".

Classes: (i) an id pin (re-state modulo the bijection); (ii) S1's cause; (iii) the tip's own red; (iv) any other red: a STOP.

## The 34 non-security files (logs/g-other34.txt, AFTER S1): 14 red | 852 green | 1 skipped of 867 (5 files of 34 red)
Before S1 (R4I-PAGE's b-guards-other.txt): 16 red. Green after S1: curateModeCriminalSwitch "is disabled with its words on a
town with no criminal part" and "does not show (iii) on a town with no criminal parts" — class (ii), 2.
| file | title (short) | class | the line that pins | the cure |
|---|---|---|---|---|
| tests/domain/display/publicSafe.test.js | EXISTENCE IS PUBLIC | (i) | :466 `CARD_KINDS.npc.floor` of a card found by stored id (`d` undefined: TypeError reading 'id') | re-state modulo the bijection (unkeyPeople) |
| publicSafe.test.js | X-21e, THE ONE EXCEPTION | (i) | :488 `out.npcs.find(n => n.id === 'npc_11')` | same |
| publicSafe.test.js | THE IDENTITY FLOOR can never be hidden | (i) | :509 floor key `id` compared byte for byte (`npc_574b…` vs `npc_11`) | same |
| publicSafe.test.js | an institution hides its services and its people | (i) | :528 `find(n => n.id === 'npc_2')` | same |
| publicSafe.test.js | everything else is shown | (i) | :800 `expect(out.npcs).toEqual(s.npcs)` (ids) | same |
| publicSafe.test.js | PROPERTY: every path and value already sits in the projection | (i) | :892 a leaf `id` ("n1" vs the re-keyed id) | same (the id leaves by the bijection) |
| publicSafe.test.js | a master switch hides a field class | (i) | :971 `find(n => n.id === 'n1').secret` | same |
| tests/domain/display/criminalVeilSwitch.test.js | VR34 (b) | (i) | :258 `open.factions[0].members` pinned to `{ id: 'n1', ... }` | same |
| criminalVeilSwitch.test.js | VS1 (a)-(e) over twelve births | (i) | :366 (c) `mask(H) === mask(before)` (two applyVeil copies byte for byte, 24 of 24); (b) `allegiance` (the handler, a person id) vs the projection, 5 dm copies | same. NOT green after S1, against the brief's expectation |
| tests/components/people6InstitutionFaceLinks.test.jsx | the gallery veil removes the row and the door together | (i) | :159 `veiled.npcs.find(n => n.id === 'npc_mill')` | same |
| people6InstitutionFaceLinks.test.jsx | the honorific with the house | (i) | :256 `find(n => n.id === 'npc_parish-church')` | same |
| tests/lib/partyLinkClient.test.js | a planted veil hides the same rows on both reads | (i) | :72 `expect(linked.settlement).toEqual(listed.settlement)` (two reads) | same, with tooth (v) |
| partyLinkClient.test.js | a link-only town hides what the default hides | (i) | :150 two reads compared whole | same, with tooth (v) |
| tests/lib/gallery.test.js | a share marked with a veil renders through it | (iv) STOP | :620 `availableServices.criminal` has 0 rows, wanted 1 | NONE: red at af708f2fd too (S2) |
CLASSES (non-security): (i) 13, (ii) 2 (green), (iv) 1. Every (i) is CONFIRMED by its failing line naming a stored id or comparing
two re-keyed reads; NONE IS RE-STATED YET (left: see the hand-back).

## tests/security WHOLE (after S1): RUNNING (logs/g-security-run.txt; started 00:28 UTC through the mutex, --maxWorkers=2)
Partial at the hand-back: failing titles in g-security.txt (42 at 01:00 UTC). Classified so far:
| file | title | class | cause | cure |
|---|---|---|---|---|
| tests/security/pgliteHookTimeoutRatchet.test.js | every boot-bearing hook is guarded | (iv) STOP | galleryVeilIds.pglite.test.js:205, R4I-PAGE's regex literal `/...\s*\(/gim` inside the beforeAll: the ratchet's paren matcher counts its `(`, so the hook runs to end of file and reads unguarded. GREEN at af708f2fd, RED at fd7163ba6 (both run). | not applied (a STOP): `\(` written `\x28` would balance it |
| criminalSwitchHandReach (12: NOT green after S1, against the brief's expectation), galleryVeilHandRows (14), galleryServerVeil (11), galleryRosterChoices (2), galleryVeilCures (2), and the files after them | see g-security.txt | UNCLASSIFIED | the run prints failure detail only at its end | left |
