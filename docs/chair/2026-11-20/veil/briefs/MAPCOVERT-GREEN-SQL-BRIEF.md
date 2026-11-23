READS WHOLE, AS ITS FIRST ACT: `supabase/migrations/212_share_veil_later_cures.sql` and the registry (`scripts/veil/rosterChoiceRegistry.mjs` with the registry file it reads, and its `--check`'s source); then this brief. NOTHING ELSE WHOLE (211 :: `get_gallery_map` only, :1391-:1492; the rollback's tail). WINDOW: 1,000,000; BUDGET about 350,000.

# MAPCOVERT-GREEN-SQL — brief (VEIL-44; IMPORT-DOOR's first green, NARROW; the chair's N76, N84, N95; each vetoable by the owner)

You are THE SQL BUILDER of the share veil's lane (the two-builder split: you edit 212, its rollback, the registry BY ITS DOOR and the
recorded hashes, AND NOTHING ELSE: no test file, no `src/`, no twin). A security lane: a slip is a leak; a failure falls toward
WITHHOLDING. NOTHING OF THIS IS MERGED INTO THE LANE BEFORE THE CHAIR'S "R4-IDS MERGED": you build on a -wip branch.

## Where you work
- Worktree `/home/user/wt/mcsql`, branch `lane/veil-44-2026-11-23-mcsql-wip`, cut by the seat at `lane/veil-44-2026-11-23-door-wip`
  (6c7bf0b97 or later: the lane's tip b58abc48b + MAPCOVERT-RED's red test `tests/security/galleryMapCovert.pglite.test.js`).
- THE LAWS of `briefs/MAPCOVERT-RED-BRIEF.md` "Where you work" bind you (read that section only): every database local (PG16 on
  `/var/tmp/rv7`, PGlite); the `E=` prefix; runs over a minute through the mutex with `GATE_MUTEX_MAX_POLLS=100000`, backgrounded, exit
  appended; never a gate through a pipe; the ledger ref before `tests/lint`; commit by explicit paths; NEVER A PULL REQUEST; never
  `--no-verify`, never a force push; "WIP, UNPROVED" before a wait over ten minutes. EVERY PUSH GUARDED: push your branch by its own name
  only when `git rev-parse HEAD` differs from `git ls-remote origin lane/veil-44-2026-11-23-mcsql-wip | cut -f1`; a push log showing
  `npm run check` or `test:ratchet` is killed with its whole process tree and reported. No `supabase` command, no deploy, no credential.

## THE FAULT AND THE RULED CURE
211 :: `get_gallery_map` (not restated in 212) serves each member as `coalesce(_gallery_veil(pub.j, ov, false) -> 'body', pub.j)` over the
sanitiser and never runs 212 :: `_gallery_apply_member_overrides` (the covert CASE, VEIL-13 ruling (5)). RULED (N84 (1), N95 (2)): THE MAP
MEMBER IS THE PARTY LINK'S READ OF THE SAME TOWN, AT BOTH REVEALS: always the public projection; share-level Reveal DM never applies; an
unmarked member takes the default veil (VR23).
THE CURE, NARROW (the seat's line to the chair, 12:55): restate `get_gallery_map` ONCE in 212 (a `[212: RESTATED ...]` header comment in the
file's own form, naming N76, N84, N95, VR23), as 211's statement with exactly these changes to the member's expressions and laterals:
  (1) the member's base: `pub.j = _gallery_sanitize_public_json(src.j)` as now (the source: the narration, then the frozen copy and its bound,
      as now);
  (2) THE LINK'S SPLICE: `proj.d = _gallery_apply_member_overrides(pub.j, <dm_full>, s.gallery_member_overrides, false, s.gallery_importable,
      false)` where `<dm_full>` is built EXACTLY as 212 :: `get_unlisted_dossier` builds it: `pub.j || (the source's own relationships,
      prominentRelationship, pressureSentence, each where the source has it)`, and `pub.j` alone where the source is not an object. THE SOURCE
      HERE IS `src.j` (the narration or the frozen copy the member serves), not the live row: say so in the header;
  (3) THE LINK'S VEIL: `'settlement', vm.v -> 'body'` with `vm.v = _gallery_veil(proj.d, s.gallery_member_overrides, true)` (no `coalesce`
      to an unveiled projection: a member with no body is served with no settlement: say what that returns, and that it falls toward
      withholding);
  (4) NOTHING ELSE: the chronicle stays `_gallery_chronicle_json` as 211 has it, the member's name and tier as 211 has them, the world, the
      map state, the IDOR guard, `view_count`, the grant as 211 states it. (The doors' tiles, chronicle, world and frozen name/tier come at
      the doors' merge after R4-IDS, into THIS restatement: write nothing of them.)
WHERE: after `import_gallery_dossier`'s restatement, before section 7's revoke loop. THE ROLLBACK
(`supabase/rollback/212_share_veil_later_cures.down.sql`): restore 211's `get_gallery_map` statement VERBATIM with 211's grant (the rollback's
own form for a restated read). 001..211 + 212 + down = 001..211, REHEARSED on a local PG16 database (a catalogue dump of every public
function's definition, volatility and grants, before and after: equal; say the command).
THE HEADER LIST of 212 and the registry: add what 212's own conventions require for a restated read (read how R5-RECENT or VEIL-13 added
theirs); the registry re-made BY ITS DOOR (`node scripts/veil/rosterChoiceRegistry.mjs` and whatever it names), `--check` 0; the new sha256
of 212 and of the rollback recorded wherever the tree records them (grep the tree for the old 212 sha `ff20ed89`: every hit re-pointed by its
own door, never by hand where a door exists).

## THE PROOFS YOU RUN (the seat re-runs each)
(a) `tests/security/galleryMapCovert.pglite.test.js` GREEN (it is RED at your base: 3 failed of 8); its Reveal DM records printed (the seat's
    second builder turns them into assertions: you do not edit the test);
(b) the doors-3-free security neighbours of the map read at your tip: `tests/security/galleryMapMemberCount.pglite.test.js`,
    `galleryServerVeil.pglite.test.js`, `galleryVeilHandRows.pglite.test.js`, `gallerySanitizer.pglite.test.js` (green, or every red named
    with its cause: a test that pins 211's member expression by text is a STOP to the seat, not re-pinned by you);
(c) `--check` 0; the rollback rehearsal equal; the registry walker `tests/lint/rosterChoiceRegistry.walker.test.js` green;
(d) `tests/lint` WHOLE (the count beside the base's: MAPCOVERT-RED's figure was 48 failing files' titles at 23bb8b8ae and at 33079c5d5);
(e) the chain-B arm on the stored set: `UM_U=1 UM_ASSERT=map sh docs/chair/2026-11-20/veil/out/v44/mapcovert/um.sh <your tree> <out> <tpl>
    stored /var/tmp/v18/out/v44/stored-today` with `<tpl>` a NEW template `mcsqltpl` = `createdb -T v27x211 mcsqltpl` + YOUR 212 (lower case):
    EXIT 0 expected (it was 1: 7 of 7 per cell).
## YOUR REPORT `docs/chair/2026-11-20/veil/out/v44/mcsql/MCSQL-HANDBACK.md` (at most 60 lines): STOPS first; the diff's hunks by function;
the old and new sha256 of 212 and the rollback; each proof's command and result; CONFIRMED vs PLAUSIBLE; last line your commits and pushed tip.
Final message: at most 200 words + one table.
