# BRIEF: SNAP-CHRONICLE (VEIL-52's builder, unit 3 part (1)): a shared map's world stops offering and serializing `chronicle`. CLIENT ONLY.

THE RULING (the chair's V13, 2026-11-25 00:50 UTC, on VEIL-52's measure `docs/chair/2026-11-24/tenth/veil/v52/out/SNAP-CHRONICLE.txt`):
publishing a campaign map with the world's `chronicle` section ticked, which is THE SHARE EDITOR'S DEFAULT, is REFUSED by the server
("World snapshot contains a forbidden private key and cannot be shared": `publish_map` -> `_gallery_world_snapshot_is_safe`, whose deny
pattern holds `.*chronicle.*` since 089), on master and on the lane's tip alike; unticked, it publishes. THE CURE: THE CLIENT STOPS
OFFERING AND SERIALIZING THE CHRONICLE SECTION OF A SHARED MAP'S WORLD. NO migration; the server's pattern untouched; nothing new is
let through. Sending the chronicle on a shared map would be a new capability (the owner's): NOT built.

YOU WORK IN `/home/user/wt/doors`, branch `lane/veil-52-2026-11-24-doors-wip` (cut at the lane's tip dbd4cd9e5). COMMIT by explicit paths on
that branch with the hooks as configured (never `--no-verify`, never `-c core.hooksPath=...`); NEVER push; no pull request; no `supabase/`
file, no migration, no register re-frozen except by its own door (say which, if any). No hosted database; never the `supabase` command.
A refusal by your own permission check stands: stop and report it. Read every file you change WHOLE first.

THE WORK (read these first: `src/components/gallery/MapShareEditor.jsx`, `src/components/gallery/WorldSectionToggles.jsx`,
`src/domain/display/worldSnapshotPublic.js`, `src/lib/gallery.js :: publishMapParams` and its `WORLD_SECTION_KEYS`, and every other
reader of the section key `chronicle` on the share/publish path: `grep -rn "chronicle" src/components/gallery src/lib/gallery.js
src/lib/galleryUnlisted.js src/domain/display/worldSnapshotPublic.js`; the PLAYER-side readers of a stored snapshot (e.g.
CampaignPlayerView) keep tolerating an absent section):
(a) the editor no longer offers `chronicle`: `ALL_SECTION_KEYS` / the section list the toggles render and the editor's default lose it;
(b) the serializer used for a SHARED MAP never emits a `chronicle` key, WHATEVER a stored selection says (a share saved earlier with it
    ticked must publish): decide the narrowest place (the share path's options, or `publishMapParams`'s section clamp plus the snapshot's
    section opts) and SAY WHY; do not change what other callers of `serializeWorldSnapshotPublic` (e.g. worldExport, the owner's own views)
    receive unless that caller IS the shared-map path;
(c) RED FIRST: a test that drives the client's own publish path for a campaign with a chronicle at the editor's DEFAULT sections and the
    real `publish_map` + `_gallery_world_snapshot_is_safe` (net-current, loaded from `supabase/migrations` the way
    `tests/security/galleryMapMemberCount.pglite.test.js` loads net-current functions, in pglite): RED before your change (the refusal message
    quoted), GREEN after (published; the stored/served world holds no `chronicle` key at any depth);
(d) A WALKER so it cannot return: every section key the editor offers and every TOP-LEVEL key `serializeWorldSnapshotPublic` can emit (all
    sections on) is tried against the server's deny pattern READ FROM the net-current text of `_gallery_world_snapshot_is_safe` in
    `supabase/migrations` (extract the regex from the SQL text; never a copied literal): 0 refused; with a TOOTH (a scratch key
    `chronicle` reds it). Name the file by `tests/`'s rules (a walker may carry `walker` in its name and then owes its mutation-manifest row:
    follow what the manifest's own test tells you);
(e) the maker-facing copy that named the section goes with it, by `tests/copy`'s own rules (a key removed from the copy catalogue, not left
    orphaned; run `tests/copy` whole).

PROOF (each through the mutex, from `/home/user/settlement-engine`: `GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- sh -c
"cd /home/user/wt/doors && sh scripts/gate-tail.sh npx vitest run <files>"`, output to a log file under /var/tmp/v52/builder2/, never read
through a pipe): (i) the red of (c) before your change, quoted; (ii) (c) and (d) green after, and (d)'s tooth red then restored; (iii) the
existing tests that name the changed files (grep `tests/` for each changed file's basename and its changed exports) green, or each red named
with its cause; (iv) `tests/copy` WHOLE and `tests/lint` WHOLE after your last commit, each count said (fetch the ledger ref first:
`git fetch origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD` in `/home/user/settlement-engine`);
(v) `npx tsc -p tsconfig.json --noEmit` or the repo's typecheck script on the touched files, its count said.

REPORT: a file `docs/chair/2026-11-24/tenth/veil/v52/builder/SNAP-CHRONICLE-HANDBACK.md` committed on the -wip: STOPS first; each commit; each
step's command, log path and counts; CONFIRMED (you ran it) vs PLAUSIBLE (you read it). Your final message: at most 200 words.
