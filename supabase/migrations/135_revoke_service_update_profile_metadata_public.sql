-- 135_revoke_service_update_profile_metadata_public.sql
--
-- Close the SAME grant asymmetry migration 113 closed for service_set_credits,
-- now on service_update_profile_metadata — the privilege-mutation RPC that sets a
-- profile's role / tier / is_founder (017:266). It received only
-- `grant execute ... to service_role` (017:366) and never an explicit
-- REVOKE ALL ... FROM PUBLIC, so anon/authenticated retain the DEFAULT EXECUTE the
-- function inherited at CREATE time and it is reachable over PostgREST by any
-- caller (finding backend-migrations-1, round-2 review).
--
-- WHY
--   A function's EXECUTE privilege defaults to PUBLIC at CREATE time. The 113
--   family fix (service_adjust_credits 103, get_credit_balance 110, service_set_
--   credits 113) locked every credit-mutation RPC to service_role; this
--   privilege-mutation sibling — higher stakes, it can flip role/tier/is_founder —
--   was left with the inherited PUBLIC grant.
--
--   This is DEFENSE-IN-DEPTH, not a live escalation hole: the body's FIRST
--   statement is `perform public._assert_service_admin_actor(actor_user)`
--   (017:285), which raises unless the JWT role is service_role AND actor_user is
--   a developer/admin — so a forged direct call aborts before any profile write.
--   The missing revoke leaves a callable-but-inert surface, not a mutation path.
--   We still close it: a privilege-mutation RPC must not have the internal assert
--   as the only thing standing between PUBLIC and role/tier/is_founder.
--
-- WHAT
--   REVOKE ALL ON the exact signature FROM PUBLIC (also anon, authenticated —
--   named explicitly so the intent survives a future re-grant of PUBLIC), then
--   re-GRANT EXECUTE to service_role only, mirroring 113 exactly. Grant-only
--   change: the function body and its search_path are UNTOUCHED — the sole
--   legitimate caller is the admin-actions edge function's service-role client,
--   which is unaffected. (The function's bare `set search_path = public` is a
--   separate, lower-stakes item tracked by the .migration-searchpath-baseline;
--   re-pinning it would require re-CREATEing the body and is out of scope here.)
--
-- Depends on: 017 (service_update_profile_metadata definition + its service_role grant).
-- Re-runnable: revoke/grant are idempotent.
-- @rollback: grant tightening — NOT auto-scripted. Reversing it re-opens the
--            PUBLIC reach this migration exists to close (per the rollback
--            runbook: a security tightening is reversed by hand, eyes open, never
--            as a blanket down). If a deploy is genuinely broken by the revoke
--            (it should not be — the sole caller is the service-role edge client),
--            restore the pre-135 default BY HAND, then re-apply 135:
--              grant execute on function
--                public.service_update_profile_metadata(uuid, uuid, jsonb, text) to public;

revoke all on function public.service_update_profile_metadata(uuid, uuid, jsonb, text)
  from public, anon, authenticated;

grant execute on function public.service_update_profile_metadata(uuid, uuid, jsonb, text)
  to service_role;

comment on function public.service_update_profile_metadata(uuid, uuid, jsonb, text) is
  'Service-role-only admin profile-metadata patch (role/tier/display_name/is_founder). Verifies actor_user is elevated via _assert_service_admin_actor, validates the patch keys, writes profiles + audits admin_actions atomically. (Defined by 017; EXECUTE locked to service_role by 135.)';
