# BRIEF: MCSQL-TESTS (VEIL-52's builder, unit (2)): two test files re-pointed to the ruled map member. TEST FILES ONLY.

YOU WORK IN `/home/user/wt/mcsql`, branch `lane/veil-52-2026-11-24-mcsql-wip` (at 75a410f1b or later). You COMMIT by explicit paths on that
branch (hooks as configured: never `--no-verify`, never `-c core.hooksPath=...`); you NEVER push, never open a pull request, never touch
`supabase/`, `src/`, any register, any other test file. No hosted database, never the `supabase` command. A refusal by your own permission
check stands: stop and report it.

THE RULING (N84 (a), the chair, 2026-11-23; VR23): THE MAP MEMBER IS THE PARTY LINK'S READ OF THE SAME TOWN: always the public projection;
share-level Reveal DM never applies; an UNMARKED member takes the DEFAULT VEIL (as the link does). 212 now restates `get_gallery_map` that way
(`supabase/migrations/212_share_veil_later_cures.sql :: get_gallery_map`, its header item (36)): the member runs
`_gallery_apply_member_overrides(pub.j, <the link's dm_full>, overrides, false, s.gallery_importable, false)` then `_gallery_veil(..., true)`.

THE TWO REDS (q52b (b), 11 of 122; titles in `docs/chair/2026-11-24/tenth/veil/v52/out/MCSQL-B-REDS.txt` on `lane/veil-52-2026-11-24`):
1. `tests/security/galleryMapMemberCount.pglite.test.js` (3 tests): "column s.gallery_importable does not exist". Its hand-written
   `public.settlements` table lacks the column the restated member reads. CURE: add `gallery_importable boolean not null default false`
   (072's type and default) to that table with a one-line comment naming 212's restated get_gallery_map. NOTHING ELSE in that file.
2. `tests/security/galleryServerVeil.pglite.test.js` (8 tests): "<tag> map member lacks what the listing shows" (the arm after
   `fetchGalleryMap(`map-${n}`)`): it holds the member to the LISTING's page, 211's rule. CURE: that arm holds the member to the PARTY
   LINK's page of the SAME row and marker: "map member shows what the link hides" and "map member lacks what the link shows", the link's
   page read the way this file already reads a link (find it in the file; if the file has no link read, read `get_unlisted_dossier`'s
   `dossier` through the client's own `fetchPublicDossier` on the row's unlisted slug, inserting `unlisted_slug`/`visibility` on the row
   as the file's own inserts do). Keep "map member carries a role its card withholds". Keep the listing comparisons for the IMPORT as they
   are. If `MEMBER_CANNOT_PROVE` no longer applies (the member and the link both take the veil), remove it only if the arm is green
   without it; say which. Update the arm's comment to cite N84 (a) and 212 (36). Do NOT weaken any other assertion of the file.

PROOF (each through the mutex, from `/home/user/settlement-engine`: `GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- sh -c
"cd /home/user/wt/mcsql && sh scripts/gate-tail.sh npx vitest run <files>"`, output to a log file you name, never through a pipe):
(i) RED FIRST: before your edits, both files red as above (the counts 3 and 8); (ii) GREEN after: both files whole green; (iii) a TOOTH for
(2): temporarily make the arm compare to the LISTING again (or plant one path the link hides into the member in-test) and show it reds;
restore; (iv) `tests/lint` WHOLE after your last commit (COMMON-EIGHTH 11): report its failing-file count and titles beside the base
(fetch the ledger ref first: `git fetch origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD` in
`/home/user/settlement-engine`).

REPORT (a file, `docs/chair/2026-11-20/veil/out/v52/mcsql-tests/MCSQL-TESTS-HANDBACK.md` on the -wip, committed): STOPS first; the commit;
each step's command, log path, counts; CONFIRMED vs PLAUSIBLE. Your final message: at most 200 words.
