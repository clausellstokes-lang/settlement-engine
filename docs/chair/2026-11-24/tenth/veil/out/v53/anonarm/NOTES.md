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
