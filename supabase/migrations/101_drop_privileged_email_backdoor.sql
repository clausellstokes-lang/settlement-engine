-- 101_drop_privileged_email_backdoor.sql
--
-- Remove the hardcoded-email admin backdoor from current_user_is_privileged().
--
-- WHY
--   018's current_user_is_privileged() (the net-current definition; 050 and 082
--   deliberately left the function body unchanged) treats ANY profile whose
--   email matches a hardcoded personal address as permanently privileged:
--     role in ('developer','admin') OR lower(coalesce(email,'')) = '<owner email>'
--   This function gates profile moderation writes, gallery moderation, elevated
--   (free) credit spends, and cross-user refunds — so the email clause is a
--   standing admin backdoor keyed to a mutable data value rather than to the
--   audited `role` column. The same 018 migration ALREADY seeds that owner
--   account to role='admin', so the OR clause grants nothing the role check
--   doesn't — it is pure redundant attack surface (e.g. anything that can land
--   that string in profiles.email becomes an instant admin).
--
-- WHAT
--   1. Re-affirm the 018 owner seed (idempotent) so dropping the runtime clause
--      can never lock the owner out of admin, even on an environment where the
--      profile row was created after 018 ran.
--   2. Recreate current_user_is_privileged() from its NET-CURRENT definition
--      (018 body; search_path per 094's pg_temp pinning) with the email OR
--      clause REMOVED. Everything else — sql/stable/SECURITY DEFINER, the
--      role-list ('developer','admin'), the revoke/grant pair — is preserved
--      verbatim. 050's decision that `support` stays EXCLUDED is unchanged.
--   Idempotent: CREATE OR REPLACE + guarded UPDATE; safe to re-run.
--
-- @rollback: re-run 018's `create or replace function public.current_user_is_privileged()`
--   (NOTE: that reinstates the email backdoor — rollback only to unblock a broken
--   deploy, then re-close).

-- ── 1. Owner seed re-affirmed (018) — belt-and-braces against admin lockout ──
update public.profiles
  set role = 'admin'
  where lower(coalesce(email, '')) = 'clausellstokes@aol.com'
    and role is distinct from 'admin';

-- ── 2. Net-current body (018) minus the hardcoded-email OR clause ────────────
create or replace function public.current_user_is_privileged()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('developer', 'admin')
  );
$$;

revoke all on function public.current_user_is_privileged() from public;
grant execute on function public.current_user_is_privileged() to authenticated;

comment on function public.current_user_is_privileged() is
  'True when the caller''s profile role is developer or admin. Privilege is keyed to the audited role column ONLY — the 018 hardcoded-email clause was removed in 101 (the owner is seeded role=admin instead). support is deliberately excluded (050).';
