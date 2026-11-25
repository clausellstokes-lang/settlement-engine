# V53-ANONARM notes (builder, 2026-11-25), worktree /home/user/grants53 at 639d98124

## THE CALL-GRAPH READ (script /var/tmp/v53/anonarm/callgraph.mjs, output callgraph.txt)
One `bootHostedChain()`; `pg_proc` of schema public (prosecdef, prosrc), callees by name in each body (comments
stripped); roots = register classes ANYONE/USER/KEPT_OPEN plus anything anon/authenticated can execute (137 roots:
118 definer, 19 invoker) plus the 12 SECURITY INVOKER trigger functions. Walked down through invokers to NOBODY/SERVER.

| chain | first definer above the helper | executed as anon / authenticated |
|---|---|---|
| `_gallery_apply_member_overrides` -> `_gallery_veil_str` | NONE | RAISED / RAISED: `permission denied for function _gallery_veil_str` |
| `_gallery_apply_member_overrides` -> `_gallery_veil_roster_splice` (-> `_gallery_veil_roster_members` -> `_gallery_veil_member_revealed`; -> `_gallery_veil_tie_roles` -> `_gallery_veil_member_revealed`) | NONE | (same call) RAISED / RAISED |
| `_gallery_apply_member_overrides` -> `_gallery_veil_embeds` (-> `_gallery_veil_case_fold` -> `_gallery_veil_name_case`, `_gallery_veil_name_prep`; -> `_gallery_veil_pieces`) | NONE | (same call) RAISED / RAISED |
| `_gallery_apply_member_overrides` -> `_gallery_veil_pieces` | NONE | (same call) RAISED / RAISED |
| `get_gallery_dossier` -> 81 closed (veil helpers, `_gallery_public_tile_rows`, chronicle) | `get_gallery_dossier` itself | returned / returned |
| `get_unlisted_dossier` -> 77 closed | `get_unlisted_dossier` | returned / returned |
| `import_gallery_dossier` -> 78 closed | `import_gallery_dossier` | anon: EXECUTES, 0 rows (body gate) / authenticated: returned |
| `get_gallery_map` -> 76 closed | `get_gallery_map` | returned / returned |
| `import_gallery_map` -> `get_gallery_map` -> 76 closed | `import_gallery_map` | anon: EXECUTES, null (body gate) / authenticated: returned |

12 invoker chains in all (all rooted at `_gallery_apply_member_overrides`, SQL IMMUTABLE, SECURITY INVOKER, class
ANYONE); none rooted at another invoker, none at an invoker trigger. No visitor-callable invoker CALLS
`_gallery_apply_member_overrides`: every caller is a definer door. Limits: callees by name only (no `execute format`).
`get_unlisted_map` serves no members (168: the map's own fields only), so the map member is served by `get_gallery_map`
(and `import_gallery_map` through it).

## MEASURE FIRST (probe.mjs / probe2.mjs; logs probe.log, probe2.log), seeded: published dossier "Veilmoor" with a
criminal house hidden by `$veil` delta `card:institution:h`, its unlisted share, a `map_with_campaign` map holding it.
- doors: every door returns the document (name present, house absent, served v2 marker on the two dossier reads) as both roles,
  except the USER doors as anon (below).
- FINDING 1 (the STOP): `_gallery_apply_member_overrides` called directly, the way a door calls it, RAISES without the plant,
  as anon AND as authenticated: `permission denied for function _gallery_veil_str`. It is ANYONE (granted, invoker) and its
  body calls four NOBODY veil helpers (212's restatement). No page reaches it with the caller's role (the doors are
  definers), but its ANYONE class (and `_gallery_sanitize_public_json`'s KEPT_OPEN reason, "called by the SECURITY INVOKER
  _gallery_apply_member_overrides, which a user runs") now names a call that cannot succeed for that user.
- FINDING 2: the USER doors are NOT refused to anon by grant under the hosted default: `has_function_privilege('anon',
  'import_gallery_dossier(text)')` = true, `import_gallery_map(text)` = true (211 part A closes only SERVER/NOBODY rows; the
  default privilege's by-name grant to anon stands). anon's call returns 0 rows / null by the bodies' own `auth.uid()` gates.
  The brief's "refused by their own grant" assertion would red.
- PLANT (control): `alter function public.get_gallery_dossier(text) security invoker`, as anon and as authenticated:
  `permission denied for function _gallery_veil_copy_bound`; restored to definer.
- DECISION: per the brief, COMMIT 1 (the arm) IS NOT COMMITTED. Commit 2 (the carried read) is independent and proceeds.

## COMMIT 2
(see below as it lands)
- fd5480850 committed (the carried read). RED: `expected { running_as: 'other_role', …(2) } to deeply equal { running_as:
  'other_role', …(4) }` (missing postgres_new_function_handed_to_*), 1 failed | 23 passed (24). GREEN: 24 passed (24).
  Owner files: only 0b changed; figures JSON byte-identical. Logs /var/tmp/v53/anonarm/c2-*.log.
- next: tests/lint whole (maxWorkers=1), tests/security whole (maxWorkers=2).
- tests/lint whole after fd5480850 (maxWorkers=1, /var/tmp/v53/anonarm/c2-lint.log): 66 failed | 3376 passed (3442); the
  66 titles = /var/tmp/v53/grants/lintfails.txt exactly (diff differs only by that list's truncation). No new red.
- tests/security whole running (maxWorkers=2, c2-security.log).
- tests/security whole after fd5480850 (maxWorkers=2, c2-security.log): 7 failed | 2179 passed | 1 skipped (2187): exactly the
  known seven (TRAD-2 x3, VR26 x2, migrationSequenceAll gapless, galleryVeilCures rollback). No worker lost.

## RULING V23 (coordinator, 04:20 UTC): close _gallery_apply_member_overrides in 212; commit 3 (SQL + register), commit 4 (the arm both ways)
- sanitize callers (callers.mjs/log): DEFINER get_gallery_dossier, get_unlisted_dossier, import_gallery_dossier, get_gallery_map;
  INVOKER _gallery_veil_roster_members (NOBODY), _gallery_apply_member_overrides (now closed); no trigger/policy/view/check/default;
  src comments only. VERDICT: closed too (revoke in 212; veil does not restate it, last body 210).
- USER-class count: 79 USER rows; anon can execute 59 (has_function_privilege('anon', oid, 'execute') on the joined chain).
- cca234bc7 committed (commit 3). RED 4 failed | 20 passed; GREEN 24 passed. Owner files moved: 7-standing-check.sql (two rows
  leave the values list), owner-files-figures.json (standingRows on 203/210 now list the two: part-A file lacks them).
- next: commit 4, the arm both ways (tests/security/veilDoorsHostedRoles.pglite.test.js).
- 81738f851 committed (commit 4, the arm both ways): GREEN 19 passed (19). RED = probe.log on fd5480850 (direct call raised on
  _gallery_veil_str, not its own grant). Next: tests/lint whole, tests/security whole.
- tests/lint whole after 81738f851: 67 failed = known 66 + mutationCoverageManifest TOTALITY (the new file, enumerated by
  directory). Fixed: 73a3f8743 adds its manifest row (rationale pglite-executed); that test 10 passed. Re-running both wholes.
- FINAL wholes at 73a3f8743: tests/security (maxWorkers=2, c4-security.log) 7 failed | 2198 passed | 1 skipped (2206): the known
  seven. tests/lint (maxWorkers=1, c5-lint.log) 69 failed = known 66 + 3 ledgerCitationIntegrity (ONLY-SHRINKS, alias table,
  numbering): ENVIRONMENTAL. The test reads refs/heads/review-fixes-2026-07-08, and that local ref was reset at
  2026-11-25 05:14:22 UTC ("branch: Reset to FETCH_HEAD") to ba7460c33 (the trial join), between my two lint runs, by
  something other than this builder. Left as found.
- Commits on lane/veil-53-2026-11-24-grants-wip: fd5480850 (carried read), cca234bc7 (V23 close), 81738f851 (arm),
  73a3f8743 (manifest row). Not pushed.
- Rollback: supabase/rollback/212_*.down.sql not touched; its create-or-replace keeps the V23 revokes (the rollback test was
  already red for the two 211s).

## ROLLBACK (coordinator, after VEIL-55's read): c2d9cf8a6
- Instrument veil-55 catalogue-dump.sql on bootHostedChain(upTo 211, both 211s) vs + 212 + down. RED 4 lines (the two ACLs);
  GREEN 0 lines. Down sha256 8cbd7d1c... -> 3ca5eac1... Exact order needed revoke-then-grant (plain grants append).
- galleryVeilCures rollback block (plain chain) moves: 1 ACL hunk -> 2 (null / {postgres=X} expected vs hosted ACLs). Logs /var/tmp/v53/rollback/.

## RULING V26
- term (1)/(4): c2d9cf8a6 met (1) in SQL; comment amended (why + V26 + purity). Down sha 3ca5eac1... -> 7004a1c8...; hosted diff 0.
- 79636ade9 (down comment), 8a809f298 (galleryVeilCures rollback block on bootHostedChain: red 4 ACL rows w/o re-grant; 212
  compare green; block still red at 211-down = known two-211s: 134 part-A ACLs + _guard_server_owned_columns), page commit next.
- owner page docs/chair/2026-11-24/tenth/veil/FOR-THE-OWNER-VEIL-ROLLBACK.md (none existed); its query on hosted 001..211 = expected.
