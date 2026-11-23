# R4I-MEASURE — HAND-BACK (VEIL-42, chain B; brief `docs/chair/2026-11-20/veil/briefs/R4I-MEASURE-BRIEF.md` at caba51270)

STATUS (kept current at every commit): A on the 7 READ; C's positive control READ (it bites); the stored sets remade
(dumps, 140 + 140); the chain runs on (t140, m140, bt140, bm140, pool, bpool). MEASURES ONLY: no line under `src/`, `supabase/` or `tests/` changed; 211 and 212 read, never edited.

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
- A: `A-77.md`. THE 7: L1 differs on 0 of 168 reads (gallery and link); L2 on 84 of 168 (M's 77 + the 7 unmarked), all Reveal
  off, ONE path, `prominentRelationship` whole. Born in the client's processing of M's TWIN row: `src/lib/gallery.js ::
  sanitizeDossier`'s unserved branch never calls `gallerySecondHomes.js :: withholdCovertCopies` (the twin's and 212's covert rule).
  Not 212's, not R4-IDS's, not the gap. CONFIRMED on the 7; the 140 and the pool to follow.
- C: `C-GAP.md`. THE CONTROL BITES: on master's shape, Reveal DM, both engines (gallery server and twin, import, the gallery
  page) serve stored ids at `factions[].members[].goal.intent.short.target.id` (456 hits / 60 reads),
  `...goal.intent.long.target.id` (443 / 60) and a THIRD path, `factions[].members[].allegiance.handler` (35 / 10, unmarked DM).
  Link and map member: 0. The sets: to follow.
- A's aside (control documents only): 212 :: `_gallery_veil_roster_choices` :2318-2337 writes a `power` share onto master-shape
  top-level `factions[]` entries that carry none (a NULL comparison in its guard); the twin does not (33 reads).
- B: `B-WHOLEDOC.md` (not yet read).

## LEFT (exact commands)
- The chain: `sh docs/chair/2026-11-20/veil/out/v42/meas/chain.sh [first step]` from `/home/user/wt/meas` (steps a7 ctrl
  dumps t140 m140 bt140 bm140 pool bpool; outputs `/var/tmp/v18/out/v42/meas/<step>/table.txt`, log `chain.log`).
