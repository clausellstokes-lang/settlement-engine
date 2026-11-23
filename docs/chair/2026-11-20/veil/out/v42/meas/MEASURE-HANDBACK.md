# R4I-MEASURE — HAND-BACK (VEIL-42, chain B; brief `docs/chair/2026-11-20/veil/briefs/R4I-MEASURE-BRIEF.md` at caba51270)

STATUS (kept current at every commit): A on the 7 and the 140 READ; C's control and the today-born set READ; the chain runs on
IN THE SEAT'S ORDER (pool, then m140, bt140, bm140, bpool): m140 was started at 07:43 and INTERRUPTED by this builder at 07:44
(1.5 minutes in) to put A's pool first; the mutex then passed to the Tonight seat's holdA.sh before the pool. The seat's four asks (N69) answered in A-77.md (marker counts complete at m140). MEASURES ONLY: no line under `src/`, `supabase/` or `tests/` changed; 211 and 212 read, never edited.

## WHERE IT RAN
- Worktree `/home/user/wt/meas`, local branch `lane/veil-42-2026-11-23-meas-wip` cut at 9f9b819f7; `node_modules` a link
  to `/home/user/wip/node_modules`. The first commit brings `out/v38/r4it/` from `lane/veil-42-2026-11-23` (M's probe, read whole).
- Scratch worktrees (never committed to): `/home/user/wt/tip` at 23bb8b8ae1155e948bca4308e479fba7adc8639c and
  `/home/user/wt/master` at db832c8926e9b7784c607a38929629b1dbe15110; `package-lock.json` byte-identical to the -wip's in
  both (cmp), so `node_modules` LINKED to `/home/user/wip/node_modules` in both (no `npm ci`).
- Templates (local PG16, `PGHOST=/var/tmp/rv7`): `v28tpl` (the seat's: v27x211 + the -wip's 212, sha256 7a85dec3…);
  `v42tip` made by this builder at 06:22 UTC = `createdb -T v27x211 v42tip` + the TIP's 212 (sha256 ff20ed89e3e67240…,
  rc 0); 211 sha256 eface6d0… in both trees (`logs/templates.txt`).

## THE INSTRUMENT (`meas.probe.jsx`, `meas.sh`, `meas-an.mjs`, `chain.sh`)
One probe, M's harness (`/var/tmp/v18/rv9/vitest.config.mjs`, `RV6_SRC`, `RV6_PGMOD`, tell-common loaders, four shards).
Per document, Reveal off/on, per setting (M's eleven: the default marker and every family the tell probe reads but g:111;
and UNMARKED `{}`), one server row read by every door (gallery, link, import as a premium reader, one map member) and the
twins (gallery: `projectShareVeil(galleryPayloadFor(...))`; link: `linkTwinOf`, copied verbatim so the tip can run it;
equal to the -wip's file on every read so far). A: L1 (served body vs twin) and L2 (both rows through
`fetchPublicDossier`, M's level, the twin row at M's fixed salt), each by `canonPeople` (M's instrument) AND by an
independent ALIGNED instrument (both documents walked in parallel, person/tie ids mapped as a bijection by position, no
order of first appearance). C: `storedIdsServed([body, marker], document)` on every door and both twins, plus the stored
side's census (every path of the stored document holding a stored person id, the re-key's own sites apart). B: L1 and L2
value for value, no bijection, at the tip.

## RESULTS
- A IS DONE (the 7, the 140, the pool). The 7 places' stop: L1 reads 0 on the 140 and on the pool.
- A: `A-77.md`. THE 7: L1 differs on 0 of 168 reads (gallery and link); L2 on 84 of 168 (M's 77 + the 7 unmarked), all Reveal
  off, ONE path, `prominentRelationship` whole. Born in the client's processing of M's TWIN row: `src/lib/gallery.js ::
  sanitizeDossier`'s unserved branch never calls `gallerySecondHomes.js :: withholdCovertCopies` (the twin's and 212's covert rule).
  Not 212's, not R4-IDS's, not the gap. CONFIRMED on the 7 and the 140. L1 BY SET: the 7 0/168; the 140 0/3,360 gallery and
  0/3,360 link; THE POOL 0/43,392 (both instruments). L2: the 140 84/3,360 (the 7 x 12), the pool 384/43,392 (32 places x 12; M's
  352 = 32 x 11), all Reveal off; paths `prominentRelationship` (372) and `pressureSentence` (24): the covert CASE's two halves.
- THE SEAT'S ASKS (A-77.md): (1) M's (i)-(iii) were taken on both halves, the twin half over the raw unserved row; (2) a row
  without the served marker: the gallery read of an UNMARKED share (trial: 2 of 2), and import and the map member carry no marker
  field at all (full counts at m140); (3) the raw twin row is also read by r4it/tonight-arm.probe.jsx, r4ip2/order.probe.jsx and
  /home/user/wt/tonight's tonight-arm2.probe.jsx (gallery and link halves); no tests/ file does; (4) noted, no cure listed.
- C: `C-GAP.md`. THE CONTROL BITES: on master's shape, Reveal DM, both engines (gallery server and twin, import, the gallery
  page) serve stored ids at `factions[].members[].goal.intent.short.target.id` (456 hits / 60 reads),
  `...goal.intent.long.target.id` (443 / 60) and a THIRD path, `factions[].members[].allegiance.handler` (35 / 10, unmarked DM).
  Link and map member: 0. TODAY-BORN SET: 0 on every door and twin (and 0 in publicProse); its documents carry no roster copy.
  POOL (gallery door only): 0. Master-born: to follow (m140).
- A's aside (control documents only): 212 :: `_gallery_veil_roster_choices` :2318-2337 writes a `power` share onto master-shape
  top-level `factions[]` entries that carry none (a NULL comparison in its guard); the twin does not (33 reads).
- U (the chair's item, 08:45): `U-UNMARKED.md`. FIRST READING (2 of the 7, CONFIRMED there): THE MAP MEMBER SERVES THE COVERT
  TIE'S COPY in `prominentRelationship` (unmarked AND marked shares, Reveal off), and `fetchGalleryMap` keeps it; 211 ::
  `get_gallery_map` never runs `_gallery_apply_member_overrides` (the covert CASE's one home). Gallery, import, link: 0. WIDENED (08:55: "MAP-COVERT", IMPORT-DOOR's cure): `import_gallery_map` hands the same member
  (1 place: all three markers, Reveal off); `get_unlisted_map` hands no member; table (e) of what the member lacks: row 1,
  212 :: `_gallery_apply_member_overrides` (:3078; covert CASE :3086-3094). Both full sets queued (umtoday, ummaster).
- M-TWIN (the chair's item, 08:45): `um.probe.jsx` (UM_M=1); trial on 2 places: (i) 0, (ii) 0, (iii) 0, unmapped 0. Runs queued.
- B: `B-WHOLEDOC.md` (not yet read).

## LEFT (exact commands)
- The chain: `sh docs/chair/2026-11-20/veil/out/v42/meas/chain.sh [step ...]` from `/home/user/wt/meas` (steps a7 ctrl
  dumps t140 pool m140 bt140 bm140 bpool, run in the order named; outputs `/var/tmp/v18/out/v42/meas/<step>/table.txt`, log `chain.log`).
