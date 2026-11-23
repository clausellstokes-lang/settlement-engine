READS WHOLE: this brief; `tests/security/galleryVeilHandRows.pglite.test.js`'s "VEIL-13 RULING 5" block only (from its header comment to the block's end); chain B's `um.probe.jsx`, `um-an.mjs`, `um.sh` (from origin, no checkout). NOTHING ELSE WHOLE: 212 and the registry are NOT read whole (you edit neither). WINDOW: 1,000,000; BUDGET about 350,000; you stop and report at it.

# MAPCOVERT-RED — brief (VEIL-44, chain B's second seat; the unit IMPORT-DOOR's first red; the ninth chair's N76; each ruling vetoable by the owner)

You are a BUILDER of the share veil's lane. A security lane: a slip is a leak. Measure first, red first. TESTS AND PROBES ONLY: you write
NO line of `supabase/` (no migration, no rollback), the registry, `scripts/veil/`, or `src/` (the twin). If a red can only be shown by
editing one of those: STOP and report.

## Where you work
- Worktree `/home/user/wt/mapcovert`, branch `lane/veil-44-2026-11-23-mapcovert-wip`, cut by the seat at `lane/veil-44-2026-11-23-door-wip`
  (the lane's tip 23bb8b8ae; no re-key). `node_modules` is a link to `/home/user/wip/node_modules`; the hooks are linked in.
- Every database is LOCAL: PG16 on the unix socket `/var/tmp/rv7` (`PGHOST=/var/tmp/rv7 PGUSER=postgres`), and PGlite. No hosted database,
  no production credential, no `supabase` command, no deploy.
- Every test command with the prefix `E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"`.
  Every run over a minute through `GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- <cmd>`, in the background, to a log with its
  exit code appended, waited for in pieces under ten minutes. NEVER read a gate through a pipe (`sh scripts/gate-tail.sh <cmd>`).
- Before `tests/lint`: `git fetch origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD`.
- COMMIT on your branch by explicit paths, after each step; then push it BY ITS OWN NAME: `git ls-remote origin lane/veil-44-2026-11-23-mapcovert-wip`
  first, push only when origin lacks your tip, `git push -u origin lane/veil-44-2026-11-23-mapcovert-wip`; never `--no-verify`, never a force
  push, never another name, NEVER A PULL REQUEST. A push log that shows `npm run check` or `test:ratchet` starting is killed at once and
  reported. Before any wait over ten minutes, uncommitted work is committed as "WIP, UNPROVED" and pushed. A refusal by your own permission
  check stands: report it, try nothing else in its place. Message nobody: your report goes to the seat.

## THE FAULT (CONFIRMED by the chair's read at 23bb8b8ae; chain B's U-UNMARKED, `lane/veil-42-2026-11-23-meas-wip` eb0c60920,
`docs/chair/2026-11-20/veil/out/v42/meas/U-UNMARKED.md`, which you read whole)
211 :: `get_gallery_map` (:1392-:1480; not restated in 212) builds each member's `settlement` as
`coalesce(_gallery_veil(pub.j, s.gallery_member_overrides, false) -> 'body', pub.j)` over `pub.j = _gallery_sanitize_public_json(src.j)` and
never calls 212 :: `_gallery_apply_member_overrides` (:2851), the one home of the covert CASE (VEIL-13 ruling (5): `prominentRelationship`
WHOLE where it is the copy of a tie the sanitiser drops (`covert: true`), `pressureSentence` where it tells one). The gallery read, the link
and the import each run it. `import_gallery_map` (072 :146) returns `get_gallery_map`'s payload. So at Reveal OFF a covert tie's copy is
served on the map member and the map's import, on every marker. The prepared doors-3 base (3e1115c81) does not cure it either.

## THE UNITS
1. THE PLANT, red first, as A TEST on fixed towns: a test file (a new one: `tests/security/galleryMapCovert.pglite.test.js`, or a block
   inside an existing file if a new file needs a door you cannot open: say which and why). Build it on the ruling-5 block's own shape
   (`covertTown` in `galleryVeilHandRows.pglite.test.js`: an open tie and a covert tie whose description, tension and phrasing carry
   marked tags, a `prominentRelationship` that is the covert tie's copy, a `pressureSentence` that tells it) and the chain it runs on
   (every migration 001..212 of THIS tree, as that file loads them). For each of THREE MARKERS (unmarked `{}`; the default
   `writeShareVeil({}, [])` of `src/lib/gallery.js` or wherever that file takes it; a HAND marker, as `um.probe.jsx` builds its `hand`),
   at Reveal OFF: put the town on a shared `map_with_campaign` map (as `um.probe.jsx` does: `saved_maps` row with `gallery_share_campaign`,
   `settlementIds` holding the town, the 046 owner guard satisfied) and read, as a visitor:
   (a) `get_gallery_map(slug)` members[0].settlement; (b) `import_gallery_map(slug)` members[0].settlement as a signed-in reader (072's
   gate); (c) THE CONTROL: `get_gallery_dossier(slug)` data for the same share.
   ASSERT, for (a) and (b): no `prominentRelationship` equal to the covert copy (nor any marked tag of the covert tie anywhere in the
   member), and no `pressureSentence` that tells the covert tie; and the two keys present/absent EXACTLY as on (c). The file's own
   control (c) is GREEN today; (a) and (b) are RED today (the fault). THE TOOTH: a town with NO covert tie serves `prominentRelationship`
   on all three doors (the assertion is not passed by a member that drops the key always). Reveal DM: read and RECORDED in your report
   (what each door serves), NOT asserted: what the cured map member serves at Reveal DM is the build's ruling, not yours.
   Then the same assertions on CHAIN B's TWO PLACES, born by the app's own pipeline as the lane's tests birth places (seeds
   `r3m-town-wartime-0-29`, `r3m-city-none-1-107`: their stored `prominentRelationship` is a covert tie's copy; find how the tell probe's
   140 seeds are born, `docs/chair/2026-11-20/veil/out/v27/tell/measure/`, and say how you did it), stored as `src/store/saves.js` stores a
   document (the stored form, N5/E134) if a test can do that in reasonable time; if it cannot, the two places are taken by unit 2 alone,
   and you say so.
   RED at this commit with the failing titles named; the test NOT marked skip, todo or `fails` (it is the cure's acceptance; it stays red
   on this branch until the build). `tests/lint` WHOLE after the file is written (the ledger ref first), its count said against the same
   run at 23bb8b8ae (run it there first, in a scratch detached worktree `/home/user/wt/mc-base`): every new offender of yours cured
   (`// anchored:` on the assertion's own line or the one above for a negative assertion; a mutation-manifest row if the walker asks for
   one, named).
2. THE ARM ON BOTH STORED SETS (the lane's ONE whole-document instrument family: chain B's; you EXTEND it, you do not build a second):
   copy `um.probe.jsx`, `um-an.mjs`, `um.sh` from `origin/lane/veil-42-2026-11-23-meas-wip` (eb0c60920) into
   `docs/chair/2026-11-20/veil/out/v44/mapcovert/` on your branch, unchanged first (commit, naming the source commit), then add ONLY: an
   assertion mode (`UM_ASSERT=map`) that makes `um.sh` EXIT 1 when any map member or map import read at Reveal OFF, on any marker, carries the
   covert copy or the covert-telling sentence, and prints the count per door x marker x key. THE STORED SETS: made by
   `docs/chair/2026-11-20/veil/out/v42/meas/RECIPES.md`'s "THE STORED SETS" commands (read that file's TREES, TEMPLATES and STORED SETS
   sections; scratch worktrees `/home/user/wt/mc-tip` at 23bb8b8ae and `/home/user/wt/mc-master` at db832c892 (origin/master), detached;
   `/var/tmp/v18/out/v44/stored-today`, `/var/tmp/v18/out/v44/stored-master`; the dump script is
   `docs/chair/2026-11-20/veil/out/v33/legacy/dump.sh` on this tree; template `v28tpl`, which the seat's machine made). RUN, each through the
   mutex: `UM_U=1 UM_ASSERT=map sh um.sh /home/user/wt/mapcovert <out>/today v28tpl stored /var/tmp/v18/out/v44/stored-today` and the same on
   `stored-master`; `<out>` = `/var/tmp/v18/out/v44/mapcovert`. EXPECTED: exit 1 on the today-born set (RED: the fault), its counts beside
   chain B's trial (U-UNMARKED's widened table); the master-born set's exit and counts as they fall (say them).
   THE DOORS EACH RUN READ, BY NAME, in your report (N5): the gallery read and its page, the import and its page, the map member and its page,
   the map's import, the link, `get_unlisted_map`.
3. YOUR REPORT `docs/chair/2026-11-20/veil/out/v44/mapcovert/MAPCOVERT-RED-HANDBACK.md`: STOPS first; per unit the red with its failing
   titles or exit and counts, the green controls, the files; `tests/lint` whole at the base and at your commit; the Reveal DM cells as
   observed; what was dropped and why; CONFIRMED vs PLAUSIBLE. Last line: your commits and the pushed tip. Your final message to the seat:
   at most 200 words plus one table.

## LAWS
A failure falls toward WITHHOLDING. Cite by symbol (`file :: symbol`). No new draw, no new constant in `src/`. No golden, no stored figure
moved. `package.json` and `package-lock.json` byte-identical. Never `npm run check`. Never a whole suite. One heavy run at a time (the
mutex); the seat's pool may hold it: wait for it, do your light work meanwhile.
