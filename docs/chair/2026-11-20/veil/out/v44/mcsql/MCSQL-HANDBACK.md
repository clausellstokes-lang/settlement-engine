# MCSQL-HANDBACK — MAPCOVERT-GREEN-SQL (VEIL-44), PAUSED by the owner's order (the chair's N116, 16:12 UTC)

STOPS: none raised. PAUSED before any test proof ran. Everything below is WIP, UNPROVED.

## Done (commit 0dbb9a169, branch lane/veil-44-2026-11-23-mcsql-wip, cut at 6c7bf0b97)
- `supabase/migrations/212_share_veil_later_cures.sql` :: get_gallery_map RESTATED (`[212: RESTATED ...]` header naming N76,
  N84, N95, VR23), after import_gallery_dossier, before section 7. 211's statement with: (1) base `pub.j` as 211; (2) new lateral
  `proj.d = _gallery_apply_member_overrides(pub.j, <dm_full as get_unlisted_dossier builds it over src.j>, overrides, false,
  importable, false)`; (3) new lateral `vm.v = _gallery_veil(proj.d, overrides, true)`, member `'settlement', vm.v -> 'body'`
  (no coalesce). Nothing else of 211 moved. Header list: item (36), the RESTATED list, "NOT CHANGED" line, @rollback line,
  the pinned-by-execution line.
- `supabase/rollback/212_share_veil_later_cures.down.sql` :: 211's get_gallery_map statement and grant, VERBATIM (sed of 211
  :1392-:1492), before section 2; one header note.
- sha256: 212 ff20ed89e3e6...6fdbf -> c6679978182dfbba2c24a920279afaf58d53c627a241541040ac40111a4c68cb; rollback
  8cbd7d1c7a6d...ded5b0 -> 62a7e609bb28734a6324e58daac2010ae0dd19b6490b4c962c335dd8e5ce7626.
- MEASURED (PG16, /var/tmp/rv7): 212 applies on `createdb -T v27x211` (exit 0). Rollback rehearsal on scratch db `mcsqlrb`
  (dropped): public functions' signature, md5(functiondef), md5(prosrc), volatility, definer, config, ACL, owner, result:
  211 = 211+212+down, `cmp` EQUAL (480 rows); get_gallery_map's ACL and settings equal 211's under 212.
  `_gallery_veil(non-object, '{}', true)` returns body `{}` (so the member falls to `{}`, never the unveiled projection).
- Registry door: `node scripts/veil/rosterChoiceRegistry.mjs` then `--check` = 0, no file changed (no row concerns the map).
- Old-sha hits (`ff20ed89`, `8cbd7d1c`): only dated handback records and hash snapshots (docs/chair/**/out/**); no door
  records 212's sha, so nothing re-pointed (a successor confirms that reading).
- Template `mcsqltpl` (v27x211 + this 212 at c6679978) EXISTS on /var/tmp/rv7, for proof (e).

## Half-done
- Nothing half-written in either file. The comment inside 211's map body ("its own listing's veil") is left as 211 wrote it.

## Not yet run (every test proof)
(a) tests/security/galleryMapCovert.pglite.test.js (queued on the mutex, killed while still WAITING: never started);
(b) galleryMapMemberCount, galleryServerVeil, galleryVeilHandRows, gallerySanitizer (.pglite); and galleryVeilCures' rollback pin;
(c) tests/lint/rosterChoiceRegistry.walker.test.js; (d) tests/lint WHOLE (base: 48 failing files); (e) the chain-B arm.

## Next steps for a successor (prefix E=, through the mutex, GATE_MUTEX_MAX_POLLS=100000, backgrounded, exit appended)
1. `sh scripts/gate-mutex.sh --run -- npx vitest run tests/security/galleryMapCovert.pglite.test.js` (expect 8 of 8; keep the
   MAPCOVERT-DM records); then (b), (c); fetch the ledger ref, then (d) beside 48.
2. Rebuild `mcsqltpl` if 212 changed since c6679978; then `UM_U=1 UM_ASSERT=map sh docs/chair/2026-11-20/veil/out/v44/mapcovert/um.sh
   /home/user/wt/mcsql <out> mcsqltpl stored /var/tmp/v18/out/v44/stored-today` (expect EXIT 0).
3. A red that pins 211's member expression by text is a STOP to the seat. Commit by paths; push guarded; never a PR.
