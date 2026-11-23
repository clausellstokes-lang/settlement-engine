# ITEM O — THE TONIGHT SHEET'S "ORDER" STOP (R4I-PAGE-2, VEIL-38). A MEASURE: NO CURE (the chair's terms, 00:25 UTC).

## (1) THE CAUSE — CONFIRMED by execution (below), the site by reading
- SITE: `src/domain/summary/tonightSheet.js :: castWantOf`, line 167:
  `const start = Math.floor(castHash(personId, crisis, role) * pool.length);`
  called from `peopleOf` (line ~591) as `castWantOf(role, row.id, kind, ...)`, `row.id` = the crisis cast role's person id.
- KEY: `crisisCast.js :: castHash(seed, crisisId, role)` (FNV-1a over `${personId}|${crisis}|${role}`) — a hash of the
  SERVED person id. The re-key (VR10) spells that id anew on every read, so the hash picks another line of the role's pool
  per read: a cast person with no goal of their own "Wants to keep the pressure on ..." on one read and "Wants to be the one
  people turn to when the seat fails" on the next.
- NOT A SORT: the people are ordered by `peopleOf`'s `.sort` on `powerOf(npc)` then served index (no id); the served order
  is equal on two reads (3). What moves is WHICH want line each cast person is given; with two cast people of one pool the
  two lines can read as swapped, which is what shareRenderTwice's diff shows as "a different order".

## (2) THE PAGE'S READERS THAT KEY ON A PERSON'S ID (grep, then EXECUTED)
Grep over src/components, src/pdf, src/domain/dossier, src/domain/display, src/domain/summary (and src/domain/crisis,
src/domain/people) for sorts, localeCompare, hashes (castHash, fnv1a32, ...) and Maps keyed by id:
| file :: symbol | key | moves between two reads (executed, 140 towns, both engines) |
|---|---|---|
| summary/tonightSheet.js :: castWantOf | castHash(served person id, crisis, role) | YES: the Tonight sheet, 39 of 140 (twin), 44 of 140 (server) |
| summary/tonightSheet.js :: peopleOf | powerOf, then served index | no (the sheet's other lines equal once the want line is set aside: not separately measured) |
| crisis/crisisCast.js :: deriveCrisisCast (castHash(seed, kind, role)) | the settlement's seed, not a person id | no |
| dossier/hookLines.js :: createConflictHookDraw (fnv1a32) | the two powers' record keys and the issue | no |
| display/discourseKernel.js :: pick, causeConjunctionContent.js :: conjunctionContent (fnv1a32 over seedId) | world/discourse seeds | no |
| map/AutoplacementConsent.jsx, PantheonPanel.jsx, RealmDashboard.jsx, RelationshipEdges.jsx; display/warStatus.js, worldSnapshotPublic.js, chronicle*.js, politicsRead.js, timelineTrack.js ... (sort by id, codepoint) | settlement, deity, route, war, node ids: no person id | no (not on the dossier page) |
EXECUTION: `order.probe.jsx` renders the whole dossier page (every group, sub-tab and disclosure, and the session sheet,
shareRenderTwice's walk and mocks) twice per town per engine, each view's HTML normalised for React's ids and for every
re-keyed person or tie id by first appearance in that view. ONLY `SHEET/Tonight (Table View)` moves; no other of the 19-20
views moves on any of the 140 towns, on either engine. CONFIRMED for those views at desktop width, Reveal off, the default
veil (phone width, Reveal on and other settings not run).

## (3) THE SERVED ARRAYS' ORDER — CONFIRMED
The served document is EQUAL on two reads modulo the read's person-id bijection (`canonPeople`: names by first appearance
in one fixed walk, so array ORDER is compared): twin 140 of 140, server (get_gallery_dossier on PG16 `v28tpl`) 140 of 140;
twin vs server (first reads) 140 of 140. No served person array moves (npcs, relationships, both roster copies,
npcs[].relationships, the casts). So "keep the served order" is ALREADY TRUE and is NOT the cure: the order is kept; the
sheet's reader derives a choice from the id. Candidate cures, for the chair (none applied): key castWantOf's hash on
something a read keeps (the person's served position in npcs[], or the name), or have the server/twin serve the chosen line.

## (4) THE PROBE — RUN on the 92 + 48
`sh docs/chair/2026-11-20/veil/out/v38/r4ip2/order.sh <worktree> <outdir> [template, '' = twin only] [pooldir]`
(four shards of `order.probe.jsx`, then `order-an.mjs`; a pool directory's pool-shard*.json and poolb-shard*.json seeds in
pool.sh's shape). Run here: `order.sh /home/user/wt/r4ip2 .../order-140 v28tpl`, the 140 births, ended 00:52 UTC.
Table: `order-table-140.txt`. Printed views moved, by surface: twin {SHEET/Tonight: 39}, server {SHEET/Tonight: 44} of 140
(the two engines' second reads draw independent salts, so the counts are two samples of one rate, not a twin/server gap).
