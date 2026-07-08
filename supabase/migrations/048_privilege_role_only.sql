-- 048_privilege_role_only.sql
--
-- SECURITY fix (review finding F4): remove the hardcoded owner-email privilege
-- backdoor from current_user_is_privileged().
--
-- Migration 018 defined the function with an OR-branch that returned true for
-- `lower(email) = '<maintainer personal email>'` alongside the role check, and
-- also auto-promoted that email to 'admin'. On the deployed database that body
-- is still live, so this migration re-declares the function to derive privilege
-- from `role` ONLY — matching the fail-closed, env-var-only OWNER_EMAIL model the
-- admin-actions edge function already adopted. 018 itself has been scrubbed of
-- the literal so the repo carries no personal PII and fresh deploys are
-- fail-closed (operator self-promotes to admin explicitly).
--
-- Impact: existing privileged accounts keep access via their 'admin'/'developer'
-- role (already set). On any FORK or fresh deploy, registering the old address no
-- longer grants admin. The "Developers update any profile" policy (033) gates on
-- this function, so this also closes the un-column-frozen escalation path a
-- backdoor account would have had over every profile.

create or replace function public.current_user_is_privileged()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('developer', 'admin')
  );
$$;

revoke all on function public.current_user_is_privileged() from public;
grant execute on function public.current_user_is_privileged() to authenticated;
