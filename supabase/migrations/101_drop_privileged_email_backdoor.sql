-- 101_drop_privileged_email_backdoor.sql
--
-- Remove the hardcoded-email admin backdoor from current_user_is_privileged().
--
-- WHY
--   018's current_user_is_privileged() (the net-current definition; 050 and 082
--   deliberately left the function body unchanged) treated ANY profile whose
--   email matched a hardcoded personal address as permanently privileged:
--     role in ('developer','admin') OR lower(coalesce(email,'')) = '<owner email>'
--   This function gates profile moderation writes, gallery moderation, elevated
--   (free) credit spends, and cross-user refunds — so the email clause was a
--   standing admin backdoor keyed to a mutable data value rather than to the
--   audited `role` column (e.g. anything that can land that string in
--   profiles.email becomes an instant admin).
--
-- WHAT
--   Recreate current_user_is_privileged() from its NET-CURRENT definition
--   (018 body; search_path per 094's pg_temp pinning) with the email OR clause
--   REMOVED. Everything else — sql/stable/SECURITY DEFINER, the role-list
--   ('developer','admin'), the revoke/grant pair — is preserved verbatim. 050's
--   decision that `support` stays EXCLUDED is unchanged. Idempotent: CREATE OR
--   REPLACE; safe to re-run.
--
-- ── PII SCRUB (Wave-1 merge — repo/replay hygiene, NOT a behavior change) ─────
--   The upstream 101 also re-affirmed an owner seed by a hardcoded literal:
--     `update public.profiles set role='admin' where lower(email)='<owner>'`.
--   That literal is REMOVED here (and from our already-scrubbed 018) so the repo
--   carries no personal PII and a FORK / fresh replay is fail-closed. This is
--   purely repo + fresh-replay hygiene: BOTH 018 and 101 already ran against the
--   production database (applied head 117 > 101), so scrubbing the literal does
--   NOT un-apply the prod data change that already set the owner's role — it only
--   removes the committed literal and makes fresh replays fail-closed (the owner
--   is un-privileged until self-promoted, matching our 018's posture).
--
--   Owner auto-admin, if desired, is now an OPERATOR CONFIG seam, not a committed
--   literal: the admin-actions / account-actions edge functions read an
--   `OWNER_EMAIL` env var
--     ( const OWNER_EMAIL = (Deno.env.get("OWNER_EMAIL")||"").trim().toLowerCase();
--       const ownerOverride = OWNER_EMAIL !== "" && callerEmail === OWNER_EMAIL; )
--   so an empty/unset OWNER_EMAIL disables the override entirely and privilege
--   falls back to the audited `role` column. Set OWNER_EMAIL in the environment
--   (never in source) to retain the auto-admin override.
--
-- @rollback: re-run 018's `create or replace function public.current_user_is_privileged()`
--   (NOTE: that reinstates the email backdoor — rollback only to unblock a broken
--   deploy, then re-close).

-- ── Net-current body (018) minus the hardcoded-email OR clause ────────────────
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
  'True when the caller''s profile role is developer or admin. Privilege is keyed to the audited role column ONLY — the 018 hardcoded-email clause was removed in 101. Owner auto-admin is an OWNER_EMAIL env seam in the admin-actions/account-actions edge functions (no committed literal). support is deliberately excluded (050).';
