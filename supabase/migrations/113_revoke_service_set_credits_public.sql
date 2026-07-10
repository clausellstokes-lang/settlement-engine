-- 113_revoke_service_set_credits_public.sql
--
-- Close a grant asymmetry on the credit-mutation RPCs: service_set_credits
-- ("set the balance to exactly N") never received an explicit
-- REVOKE ALL ... FROM PUBLIC, unlike its two siblings in the family —
-- service_adjust_credits (103:145) and get_credit_balance (110:113).
--
-- WHY
--   A function's EXECUTE privilege defaults to PUBLIC at CREATE time. Every
--   recreation of service_set_credits (017:368, then net-current at 103:152)
--   only added `grant execute ... to service_role` — the inherited PUBLIC grant
--   was never dropped. So anon/authenticated retain the DEFAULT EXECUTE and the
--   function is reachable over PostgREST by any caller.
--
--   This is DEFENSE-IN-DEPTH, not a live money hole: the body's FIRST statement
--   is `perform public._assert_service_admin_actor(actor_user)` (103:168), which
--   raises 'service role required' unless the JWT role is service_role AND raises
--   'actor is not privileged' unless actor_user is developer/admin — so a
--   forged direct call aborts before any credit_ledger/profiles write. The
--   missing revoke leaves a callable-but-inert surface, not a mutation path. We
--   still close it: the two siblings are locked to service_role and the internal
--   assert should not be the only thing standing between PUBLIC and a
--   real-money RPC.
--
-- WHAT
--   REVOKE ALL ON the exact signature FROM PUBLIC (also anon, authenticated —
--   named explicitly so the intent survives a future re-grant of PUBLIC), then
--   re-GRANT EXECUTE to service_role only, matching the sibling 103 pattern
--   exactly. Grant-only change: the function body, search_path (111), and every
--   caller are untouched — the sole legitimate caller is the admin-actions edge
--   function's service-role client (update_user_credits), which is unaffected.
--
-- Depends on: 017/103 (service_set_credits definition + its service_role grant).
-- Re-runnable: revoke/grant are idempotent.
-- @rollback: grant tightening — NOT auto-scripted. Reversing it re-opens the
--            PUBLIC reach this migration exists to close (per the rollback
--            runbook: a security tightening is reversed by hand, eyes open, never
--            as a blanket down). If a deploy is genuinely broken by the revoke
--            (it should not be — the sole caller is the service-role edge
--            client), restore the pre-113 default BY HAND, then re-apply 113:
--              grant execute on function
--                public.service_set_credits(uuid, uuid, integer, text) to public;

revoke all on function public.service_set_credits(uuid, uuid, integer, text)
  from public, anon, authenticated;

grant execute on function public.service_set_credits(uuid, uuid, integer, text)
  to service_role;

comment on function public.service_set_credits(uuid, uuid, integer, text) is
  'Service-role-only admin credit set. Verifies actor_user is elevated, locks the profile row, computes the delta from the ledger (get_credit_balance), writes credit_ledger/credit_transactions/profiles atomically, and audits admin_actions. (Recreated by 103 from 017 with the lock + ledger-truth prev; EXECUTE locked to service_role by 113.)';
