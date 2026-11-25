# V53-ANONARM: THE ANON ARM AND THE CARRIED READ (VEIL-53 unit (3), its second and third commits; RULING V1-3 point 6)

THE BUILD, one builder, on `lane/veil-53-2026-11-24-grants-wip` in the worktree `/home/user/grants53` (at 639d98124: the trial
join + the register's 79 veil rows). You COMMIT there (explicit paths, the hooks; never `--no-verify`), two commits, each with
its red and green quoted in its message; you never push, never open a pull request, never touch another branch.

## WHAT EXISTS (read whole before writing)
- `tests/security/hostedDefaultHarness.js` (THE SHARED HARNESS: `bootHostedChain`, `OWNER_DEFAULT_READ_SQL`, `standingCheckSql`):
  USED, NEVER RE-WRITTEN; the one edit allowed is commit 2's, below.
- `tests/security/hostedDefaultGrants.pglite.test.js` (its part B blocks, its owner's-read block).
- How the veil's tests seed a published dossier, an unlisted share and a published map with members: read
  `tests/security/veilChain.shared.mjs` and the seeding of `tests/security/galleryMapMemberCount.pglite.test.js`; reuse a
  shared seeding helper if one exists; never copy a whole chain-builder.
- The doors (signatures in `tests/security/functionGrantClasses.js`): `get_gallery_dossier(text)` (the gallery read, ANYONE),
  `get_unlisted_dossier(text)` (the party link, ANYONE), `import_gallery_dossier(text)` (the import, USER),
  `get_gallery_map(text)` (the map and its members, ANYONE; also `get_unlisted_map(text)` if the map member is served there),
  `import_gallery_map(text)` (the map's import, USER). Grep the migrations for the door that serves "the map member"; if it is
  another function, use it and say so.
- WHY: 211 part B closes every function 212/213 create (all 79 veil helpers: class NOBODY, SECURITY INVOKER). A door that is
  SECURITY DEFINER calls them as its owner: fine. A SECURITY INVOKER path a visitor runs (`_gallery_apply_member_overrides` is
  one: ANYONE, invoker, and the veil's version calls `_gallery_veil_roster_splice`, `_gallery_veil_str`, `_gallery_veil_embeds`,
  `_gallery_veil_pieces`) answers "permission denied" on a public page.

## COMMIT 1: THE ANON ARM (a new file `tests/security/veilDoorsHostedRoles.pglite.test.js`; avoid the mutation-manifest words
census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin
in the basename)
On ONE `bootHostedChain()` (the hosted defaults, the whole joined chain), seed one published dossier that carries a hidden house
(so the veil's helpers run: a town whose curate choices hide something; the seeding helpers above say how), its unlisted share,
and one published map holding it as a member. Then, for EACH door, as `anon` (`set role anon`) AND as `authenticated`
(`set role authenticated` with `test.uid` / `request.jwt.claim.sub` set to a seeded user; the USER doors only as
`authenticated`, and as `anon` they must be refused by their own grant, which the test asserts by name), assert the door
RETURNS ITS DOCUMENT (non-null, the dossier's name in it; the import's row inserted or its payload returned as the function
defines) and raises nothing. Reset the role after each call. ALSO: call `_gallery_apply_member_overrides` as each role the way
a door would call it, with the seeded document, and assert it returns (the invoker path).
RED FIRST BY A PLANT, IN THE TEST ITSELF AS A CONTROL `it` (plant and restore in one block; the plant's catch asserted): make
one door SECURITY INVOKER (`alter function public.get_gallery_dossier(text) security invoker`) on the same database, call it
as `anon`, and assert the call RAISES "permission denied for function _gallery_veil..." (a veil helper born closed); then
`security definer` again and the door returns. If no door or invoker path reds anywhere without the plant, the arm is green and
the control proves it can see the class. If one DOES red without the plant: STOP, do not cure, report the door, the role, the
error text and the helper; that is a finding for VEIL-53 and the chair.

## COMMIT 2: THE CARRIED READ FOR PART B (the owner's read `0b-read-part-b-default.sql`)
Today the read shows only the RUNNING role's rows. The owner's own wrong-role case: run as a role that is not the one that runs
the migrations (postgres), the read answers for that role and says nothing of postgres. THE CARRIED READ: beside `running_as`
the read shows the role postgres's two answers BY NAME (`postgres_new_function_handed_to_visitor`,
`postgres_new_function_handed_to_signed_in_user`, counting the schema row and the global row exactly as the existing columns
do). The ONE harness edit: `OWNER_DEFAULT_READ_SQL` gains those two columns (its existing columns and their names unchanged);
nothing else of the harness moves. Then regenerate the owner's files from `/home/user/grants53` with
`node docs/chair/2026-11-24/tenth/grants/measure/owner-files.mjs` (through the mutex): `0b-read-part-b-default.sql` gains the
columns (and, in its comment lines, one line saying that the postgres columns are the ones that matter); every other owner file
byte-identical (`git status` proves it); `owner-files-figures.json`'s `defacl` line may change in form only.
THE ARM, in `hostedDefaultGrants.pglite.test.js`'s owner's-read block (one new `it`): part B run as ANOTHER role (as the
existing "part B run as ANOTHER role" test does), the read RUN AS THAT OTHER ROLE shows `running_as` = that role, its own two
answers false/false where part B applied to it, and the postgres columns TRUE/TRUE: the owner sees that the migrating role is
still open. RED FIRST: the new `it` against the harness before the column edit fails on the missing columns (quote it); green
after. The existing owner's-read `it`s stay green unchanged.

## AFTER EACH COMMIT, RUN (through `sh scripts/gate-mutex.sh --run -- ...` from /home/user/grants53, never through a pipe, each
to a log under `/var/tmp/v53/anonarm/`): the new or changed test file; `tests/security/hostedDefaultGrants.pglite.test.js`;
after commit 2 also `tests/lint` WHOLE (COMMON-EIGHTH 11) with its failing titles listed, and `tests/security` WHOLE with
`--maxWorkers=2` (its failing titles listed; the trial join's own reds are known: `traditionDescriptionSharedPage` TRAD-2 x3
and `rosterChoiceInversion` VR26 x2: name any other).
NO PUSH, NO NETWORK, no hosted database, never the `supabase` command. A permission refusal: stop that line, report it.

## THE CALL-GRAPH READ (VEIL-50, 21:37 UTC): EVERY PATH A VISITOR'S CALL CAN TAKE TO A NOBODY HELPER BY AN INVOKER
Before commit 1, by a script over the joined chain's catalog (PGlite: `pg_proc.prosecdef`, `prosrc`; the callees by name in each
body), list every chain from a function `anon` or `authenticated` may execute (classes ANYONE, USER, KEPT_OPEN) down through
SECURITY INVOKER functions to any NOBODY (or SERVER) function; for each chain say whether a SECURITY DEFINER stands above the
closed helper (read in the catalog), and then EXECUTE it in the arm (the door or the invoker called as the role). The table goes
in the commit message and the report: chain | first definer above the helper or NONE | executed as anon / authenticated:
returned or raised.

## YOUR FINAL MESSAGE (at most 200 words)
The two commit hashes; for each its red (quoted) and green counts; the door/role table (5 doors x 2 roles: returned | refused by
grant | RAISED); the plant's caught error text; `tests/lint` and `tests/security` whole counts with any red outside the known.

## ADDENDUM: RULING V26 (the chair, 06:53 UTC 2026-11-25, `veil/RULING-V1.md` at afb14adb50 on the chair's branch), ON
grants-wip after c2d9cf8a6, AS COMMITS (the chair reads the 212 hunk and the down lines together at the join)
(1) The 212 down file grants BY EXACT SIGNATURE what the HOSTED 001..211 held on `_gallery_apply_member_overrides(...)` and
    `_gallery_sanitize_public_json(jsonb, text[])`, with a COMMENT saying so and why (the hosted platform's default privileges;
    RULING V26); NO conditional SQL, NO read of pg_default_acl in a rollback. (c2d9cf8a6's revoke-then-re-grant may already be this:
    check the comment and that nothing is conditional; amend in a new commit if not.)
(2) `tests/security/galleryVeilCures.pglite.test.js`'s ROLLBACK block: its WHOLE catalogue compare runs under the hosted-default
    harness (`tests/security/hostedDefaultHarness.js :: bootHostedChain`, USED, not re-written); the plain-Postgres compare of THAT
    block is RETIRED (removed, not kept with an exception); red first: the block's compare under the harness WITHOUT the down file's
    re-grant shows the two ACL lines; green with it. Say what else in the file used the plain chain and is left as it is.
(3) THE HARNESS IS A MODEL: ONE READ-ONLY QUERY for the owner's hand, written into the veil lane's owner page (find it: the
    lane tip's `FOR-THE-OWNER*` under `docs/chair/2026-11-24/tenth/veil/` or the page VEIL-55 names; if none exists on this branch,
    write `docs/chair/2026-11-24/tenth/veil/FOR-THE-OWNER-VEIL-ROLLBACK.md` and say so): the access lists (proacl) of the two
    functions on the live database, run BEFORE 212 is applied, the EXPECTED answer beside it (the hosted 001..211 ACLs you read);
    a difference corrects the down file first. No project identifier, no key, no credential in that page.
(4) Both functions are pure; 211's bodies return with the rollback (say it is so in the down file, by reading it).
