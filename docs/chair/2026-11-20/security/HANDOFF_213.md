# SEC-GRANTS hand-back: deliverable two (migration 213 and the walker) is NOT started — 2026-11-20 02:14 UTC

The seat stopped at about 265k context tokens; its brief sets the hand-back at 300k, and 213 will not fit in what is
left. Deliverable one is complete and pushed (`EMERGENCY-2`, 2669d6c2d). What the next seat inherits, measured:

* **The line's chain (lane/join 001..210, this branch's base) has the same open set as 001..203.** The same 270
  non-trigger functions are executable by anon or authenticated, with none added and none removed. On 001..210,
  `EMERGENCY_REVOKE.sql` applies cleanly (exit 0), `CHECK_B` reads 0/0/0, and `CHECK_C` reads 0 (executed 2026-11-20).
  So 213's revokes are `proof/inputs/revoke_list.txt` (157 full signatures) as they stand, plus whatever 212 adds.
* **The classes are in `CATALOGUE.md` and `proof/inputs/classified.json`.**
  * 82 DELIBERATE DOOR plus 3 ADMIN DOORS (set_curated, set_featured, set_featured_map: authenticated only after the
    emergency script; 213 should fix their NULL-slippable guard with `coalesce(caller_role, '') not in (...)` or
    `is distinct from`). The allowlist's core. Meet VEIL-DOORS by full signature.
  * 1 DOOR THAT TRUSTS A PARAMETER: `account_is_active(uuid)`. RLS policies call it as `account_is_active(auth.uid())`,
    and the edge functions call it with the service key for any user. A caller check that keeps both:
    `p_uid = auth.uid() or auth.role() = 'service_role'`, else false. Verify `auth.role()` inside a definer on
    pglite. Note: the readers' scaffold's `auth.role()` falls back to `current_user`, which is the definer's owner;
    `proof/scaffold.sql` reads the JWT claim as Supabase does.
  * 12 VISITOR-NEEDED: stay granted to the visitor; allowlist them as "visitor-needed", not as doors.
  * 15 INVOKER helpers: candidates to revoke in 213, but first prove that no visitor path reaches them. Five are
    gallery helpers; check them against 212's nine so they are not revoked twice.
  * 13 trigger functions: allowlist them by return type `trigger` (Postgres refuses direct calls).
* **The share veil's 212** revokes nine gallery helpers. Read its list from that lane before writing 213, and name
  the nine in the allowlist's notes.
* **Default privileges (propose, do not assume).**
  `alter default privileges in schema public revoke execute on functions from public, anon, authenticated;`
  would close every NEW function until granted. What it would break: every future migration that defines a browser
  door must then `grant execute … to authenticated` (and `anon` for public reads) explicitly. Many of 001..210's
  doors already do, but some rely on the default. The walker catches a missing grant only if a test calls the door,
  so pair the change with a "doors are callable" list in the walker. Supabase's own default privileges come from
  `supabase_admin` as well, so a `for role supabase_admin` clause may be needed; that one is the owner's call.
* **The walker.** Read the in-process pglite chain the test suite already uses (`migrationSequenceAll` is named in
  139's header) and query `has_function_privilege('anon'|'authenticated', oid, 'execute')`. pglite has no
  anon/authenticated roles and no Supabase default privileges unless the harness creates them, so the walker must
  build them as `proof/scaffold.sql` does. Go red on any function outside the written allowlist, and go red first
  by a plant (one new definer function with no grant change).
* **Tools here:** `proof/chain.sh` and `proof/scaffold.sql` build any chain on a scratch PG16. `proof/harness.sh`
  calls every function as each role, and `proof/flows.sql` runs the product paths. Use these to prove 213 by the same
  before/after diff.

## The chair's amended ruling (received 2026-11-20 02:25 UTC; message of 02:20 UTC)
* 212 (the share veil's) now revokes only the helpers that 211 and 212 create themselves, plus `_gallery_public_tile_rows()`.
  **The eight older gallery helpers belong to 213:** `_gallery_chronicle_entry`, `_gallery_chronicle_json`,
  `_gallery_map_backdrop`, `_gallery_apply_member_overrides`, `_gallery_npc_key`, `_gallery_dm_full_json`,
  `_gallery_sanitize_public_json` and `_gallery_world_snapshot_is_safe`.
* `_gallery_world_snapshot_is_safe` is called as the VISITOR by the INVOKER trigger function
  `_saved_maps_world_snapshot_guard` on saved_maps. It either stays executable, or the trigger's path is made definer.
  This is for 213 to propose: `flows.sql`'s "MAP insert" step is the regression probe.
  `_gallery_sanitize_public_json` is also reached through the invoker `_gallery_apply_member_overrides`. Check every
  invoker caller in `CATALOGUE.md` before revoking.
* 213 is cut on 001..210 and must also apply cleanly AFTER 211 and 212. Those two create and revoke their own
  `_gallery_veil_*` / `_gallery_doors_*` helpers; the allowlist names them, and 213 does not touch them.
* The walkers meet at the close by full signature. A function passes if neither visitor role can execute it, or if it
  is on a written list naming the visitor context that needs it. VEIL-DOORS-2 is on lane/veil-doors-2-2026-11-20.
