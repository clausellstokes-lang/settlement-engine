-- 162_purge_spares_paid_entitlements.sql
--
-- Downgrade-transition audit P0 (2026-07-19): the retention purge cascade-destroys
-- PAID durable dossier rights.
--
-- THE BUG. purge_expired_plan_inactive_assets() (024) blind-DELETEs every
-- settlement in access_state inactive_plan|pending_delete whose retention window
-- has elapsed. dossier_entitlements.save_id references settlements(id) ON DELETE
-- CASCADE (108), so that DELETE ALSO destroys the owner's PURCHASED single-dossier
-- export right — a right that is explicitly NOT tier state and survives downgrade
-- (108's contract). "Deletion forfeits the right" was written for USER deletion,
-- never for a system retention purge: a user who bought a dossier and later lapsed
-- to free loses what they paid for the next time the daily cron job runs.
--
-- THE FIX. Spare any settlement whose owner still holds a LIVE (status='active')
-- dossier entitlement — storing one paid-for row is trivial next to silently
-- destroying a purchased right. Only the settlements DELETE gains the guard;
-- saved_maps carry no dossier entitlement (the entitlement FK is to settlements
-- only), so that DELETE stays 024-verbatim. A clawed_back (refunded) entitlement
-- does NOT spare — a refunded right is not a live one.
--
-- FORK DISCIPLINE (the net-current rule). Recreated from 024's net-current body
-- VERBATIM, with exactly two deltas:
--   (1) search_path pinned `public, pg_temp`. 094 ALTERed 024's bare
--       `set search_path = public` to append pg_temp on every definer function;
--       the net-current STATE of this function therefore includes pg_temp, and a
--       bare-`public` recreate would silently drop that hardening. Pin it here.
--   (2) the spare-active-entitlement guard on the settlements DELETE (above).
-- Everything else — the jsonb return, the diagnostics counts, the saved_maps
-- DELETE, the revoke/grant block — is 024 unchanged. The 024 cron schedule calls
-- this function by NAME and needs no change.
--
-- @rollback: recreate 024's net-current body verbatim (no entitlement guard),
--   re-pinning `set search_path = public, pg_temp` so 094's hardening is not lost.
--   NOTE this REINSTATES the purge-destroys-paid-rights bug — roll back only to
--   unblock a broken deploy, then re-fix.

create or replace function public.purge_expired_plan_inactive_assets()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  settlement_count integer := 0;
  campaign_count integer := 0;
begin
  delete from public.settlements
    where access_state in ('inactive_plan', 'pending_delete')
      and retention_expires_at is not null and retention_expires_at <= now()
      -- SPARE the settlement while its owner holds a live paid dossier right; the
      -- ON DELETE CASCADE would otherwise destroy that purchased entitlement.
      and not exists (
        select 1 from public.dossier_entitlements e
        where e.save_id = settlements.id and e.status = 'active'
      );
  get diagnostics settlement_count = row_count;
  delete from public.saved_maps
    where access_state in ('inactive_plan', 'pending_delete')
      and retention_expires_at is not null and retention_expires_at <= now();
  get diagnostics campaign_count = row_count;
  return jsonb_build_object('settlements', settlement_count, 'campaigns', campaign_count);
end;
$$;

revoke all on function public.purge_expired_plan_inactive_assets() from public;
grant execute on function public.purge_expired_plan_inactive_assets() to service_role;
