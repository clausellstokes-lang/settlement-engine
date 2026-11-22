-- ────────────────────────────────────────────────────────────────────────────
-- 050_admin_least_privilege.sql — Phase A3 (1/2): tighten admin/support RLS to
-- least-privilege, redacted-by-default; gate full-PII reads behind the highest
-- role + a logged reason.
--
-- WHY THIS EXISTS
--   Migration 003 (recursion-fixed by 005) granted every developer/admin a FLAT
--   "read ALL profiles" + "read/update ALL support_messages". That exposes every
--   user's raw PII (email, etc.) to ANY elevated role with one SELECT. It is the
--   opposite of least-privilege.
--
-- WHAT THIS DOES
--   1. Introduces a `support` role tier and a recursion-safe `has_role(uid,
--      roles[])` SECURITY DEFINER helper (REUSES the 005 pattern: a definer fn
--      bypasses RLS on profiles so a profiles policy can call it without
--      recursing).
--   2. REMOVES the flat "Developers read all profiles" SELECT policy. Elevated
--      roles no longer get raw cross-user profile rows via direct table SELECT.
--      Cross-user reads now go through SECURITY DEFINER RPCs that return a
--      REDACTED shape by default (no raw email / payment ids).
--   3. Tightens support_messages: support+admin+developer get a REDACTED read
--      (masked email) via an RPC; the flat raw-email SELECT policy is removed.
--      Update-status stays role-gated (claim/triage a ticket needs no raw PII).
--   4. admin_user_summary(target)  → redacted summary, any elevated role.
--      admin_user_full(target, reason) → full PII, HIGHEST role only, AUDITED.
--      admin_support_messages(...)  → redacted ticket list, any elevated role.
--
-- ROLE MODEL (least-privilege, tiered)
--   user      — no admin access.
--   support   — claim/triage tickets + REDACTED user view. NEVER raw PII.
--   admin     — user-management + REDACTED view + full-PII WITH a logged reason.
--   developer — back-compat highest role; everything, audited (== admin powers).
--   "Highest role" (full-PII gate) = admin | developer. support is excluded.
--
-- Back-compat: existing developer/admin users keep all powers. The only change
-- they SEE is that a raw cross-user `select * from profiles` no longer returns
-- other people's rows — they must call the (audited) RPC. Their OWN row is
-- still readable via the migration-001 "Users read own profile" policy.
--
-- Re-runnable: DROP POLICY IF EXISTS + CREATE OR REPLACE throughout.
-- Depends on: 002 (role/email/support_messages), 005 (current_user_is_privileged),
--             009 (admin_actions + _audit_action). 051 adds the audit_log table
--             this migration's RPCs prefer; the RPCs degrade to admin_actions if
--             051 hasn't run yet (guarded), so file order is safe either way.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Widen the role CHECK to admit `support` ─────────────────────────────
-- The 002 constraint is ('user','developer','admin'). Add 'support' without
-- dropping the others (full back-compat). Drop-by-known-name then re-add; if
-- 002's constraint was named differently on some deployment, the ADD is still
-- idempotent via the guard.
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_check' and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles drop constraint profiles_role_check;
  end if;
  -- Also clear any anonymously-named role check (defensive — some envs).
  begin
    alter table public.profiles drop constraint if exists profiles_role_check1;
  exception when others then null;
  end;
  alter table public.profiles
    add constraint profiles_role_check
    check (role in ('user', 'support', 'developer', 'admin'));
end $$;

-- ── 2. has_role(uid, roles[]) — recursion-safe role check ──────────────────
-- SECURITY DEFINER so the inner SELECT on profiles bypasses RLS and does NOT
-- re-trigger any profiles policy that calls this (the 005 recursion fix). This
-- is the single role-check primitive every policy/RPC below shares.
create or replace function public.has_role(p_uid uuid, p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = p_uid
      and role = any(p_roles)
  );
$$;

revoke all on function public.has_role(uuid, text[]) from public;
grant execute on function public.has_role(uuid, text[]) to authenticated;

comment on function public.has_role(uuid, text[]) is
  'Recursion-safe role check (SECURITY DEFINER bypasses profiles RLS). Returns true if the given user holds any of the listed roles.';

-- current_user_has_role: convenience wrapper over has_role(auth.uid(), …).
create or replace function public.current_user_has_role(p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), p_roles);
$$;

revoke all on function public.current_user_has_role(text[]) from public;
grant execute on function public.current_user_has_role(text[]) to authenticated;

-- "Highest role" = the only roles allowed to unmask full PII (with a reason).
-- `support` is deliberately NOT here.
create or replace function public.current_user_is_highest()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), array['admin', 'developer']);
$$;

revoke all on function public.current_user_is_highest() from public;
grant execute on function public.current_user_is_highest() to authenticated;

-- Any elevated role (support OR admin OR developer) — gates the REDACTED reads.
create or replace function public.current_user_is_support_or_higher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), array['support', 'admin', 'developer']);
$$;

revoke all on function public.current_user_is_support_or_higher() from public;
grant execute on function public.current_user_is_support_or_higher() to authenticated;

-- ── 3. Email-masking helper (used by every redacted read) ──────────────────
-- a@b.com → a***@b.com ; single-char local → *@b.com ; null → null.
create or replace function public.mask_email(p_email text)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when p_email is null or position('@' in p_email) = 0 then null
    else (
      case when length(split_part(p_email, '@', 1)) <= 1
        then '*'
        else left(split_part(p_email, '@', 1), 1) || '***'
      end
    ) || '@' || split_part(p_email, '@', 2)
  end;
$$;

comment on function public.mask_email(text) is
  'Redaction helper: a@b.com -> a***@b.com. Used by redacted-by-default admin/support reads so raw email never leaves the DB without the full-PII RPC.';

-- ── 4. TIGHTEN profiles RLS: remove the flat raw-read SELECT policy ─────────
-- The flat "Developers read all profiles" SELECT policy is the PII leak. Remove
-- it; cross-user profile reads now go through the redacted RPC. The UPDATE
-- policy (003/033 "Developers update any profile", recursion-safe via
-- current_user_is_privileged) is LEFT IN PLACE — user-management writes are an
-- intended admin power and are already audited by the service RPCs / edge fn.
-- The migration-001 "Users read own profile" SELECT policy is untouched, so
-- elevated users still read THEIR OWN row directly.
drop policy if exists "Developers read all profiles" on public.profiles;

-- IMPORTANT: current_user_is_privileged() is LEFT UNCHANGED ('developer'|'admin').
-- It gates WRITES and privileged operations across many migrations (009/018/024
-- profile/credit writes, 022 gallery moderation, 033 "Developers update any
-- profile"). Widening it to include `support` would silently grant support all
-- those user-management/refund/moderation powers — a privilege escalation. So
-- `support` reaches ONLY the redacted-read / ticket-triage / deletion-request
-- surfaces below, each gated explicitly by current_user_is_support_or_higher().
-- The profiles UPDATE policy thus continues to exclude support, by construction.

-- ── 5. TIGHTEN support_messages RLS ────────────────────────────────────────
-- Remove the flat raw-email SELECT; reads go through the redacted RPC. Keep the
-- update-status policy (claim/triage) but widen it to support_or_higher so the
-- new support role can claim tickets without seeing raw PII.
drop policy if exists "Developers read all support messages" on public.support_messages;
drop policy if exists "Developers update support messages"   on public.support_messages;

create policy "Elevated update support message status" on public.support_messages
  for update
  using (public.current_user_is_support_or_higher())
  with check (public.current_user_is_support_or_higher());

-- ── 6. admin_user_summary(target) — REDACTED, any elevated role ────────────
-- The default cross-user read. NO raw email / no payment ids. Returns masked
-- email + display name + non-PII status/counters. Available to support+.
create or replace function public.admin_user_summary(target_user uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  p record;
  settlement_count int;
begin
  if not public.current_user_is_support_or_higher() then
    raise exception 'not authorized';
  end if;
  if target_user is null then
    raise exception 'target_user is required';
  end if;

  select id, role, tier, is_founder, display_name, email, created_at
    into p
    from public.profiles
    where id = target_user;

  if not found then
    raise exception 'target profile not found';
  end if;

  select count(*)::int into settlement_count
    from public.settlements where user_id = target_user;

  -- Redacted shape: masked email, display name, status/counts. NEVER the raw
  -- email or any payment/customer id.
  return jsonb_build_object(
    'id',            p.id,
    'role',          p.role,
    'tier',          p.tier,
    'is_founder',    p.is_founder,
    'display_name',  p.display_name,
    'email_masked',  public.mask_email(p.email),
    'created_at',    p.created_at,
    'settlements',   settlement_count,
    'redacted',      true
  );
end;
$$;

revoke all on function public.admin_user_summary(uuid) from public;
grant execute on function public.admin_user_summary(uuid) to authenticated;

comment on function public.admin_user_summary(uuid) is
  'Redacted cross-user summary for support+admin+developer. Masked email, no payment ids. The DEFAULT admin read.';

-- ── 7. admin_user_full(target, reason) — FULL PII, HIGHEST role, AUDITED ───
-- The only path to a raw email. Requires admin|developer (NOT support) AND a
-- non-empty reason, and writes one audit row before returning. The audit write
-- is via public.write_audit (added in 051); if 051 hasn't run yet we fall back
-- to the 009 _audit_action so this migration is self-sufficient.
create or replace function public.admin_user_full(target_user uuid, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  p record;
  reason_clean text;
  has_write_audit boolean;
begin
  if not public.current_user_is_highest() then
    raise exception 'not authorized: full PII requires admin or developer';
  end if;
  reason_clean := nullif(btrim(coalesce(p_reason, '')), '');
  if reason_clean is null then
    raise exception 'a reason is required to read full PII';
  end if;
  if target_user is null then
    raise exception 'target_user is required';
  end if;

  select id, role, tier, is_founder, display_name, email, credits, created_at, updated_at
    into p
    from public.profiles
    where id = target_user;

  if not found then
    raise exception 'target profile not found';
  end if;

  -- Audit BEFORE returning the PII. Prefer the 051 append-only log; fall back to
  -- the 009 admin_actions audit if 051 isn't applied yet.
  select exists (
    select 1 from pg_proc pr join pg_namespace n on n.oid = pr.pronamespace
    where n.nspname = 'public' and pr.proname = 'write_audit'
  ) into has_write_audit;

  if has_write_audit then
    perform public.write_audit(
      p_action          => 'read_full_pii',
      p_target_user_id  => target_user,
      p_target_type     => 'profile',
      p_target_id       => target_user::text,
      p_reason          => reason_clean,
      p_before          => null,
      p_after           => jsonb_build_object('fields', array['email','credits'], 'email_masked', public.mask_email(p.email)),
      p_was_destructive => false,
      p_was_reversible  => true,
      p_user_notified   => false
    );
  else
    perform public._audit_action(
      auth.uid(), target_user, 'read_full_pii',
      null,
      jsonb_build_object('fields', array['email','credits']),
      reason_clean
    );
  end if;

  return jsonb_build_object(
    'id',           p.id,
    'role',         p.role,
    'tier',         p.tier,
    'is_founder',   p.is_founder,
    'display_name', p.display_name,
    'email',        p.email,         -- RAW email — the audited unmasking
    'credits',      p.credits,
    'created_at',   p.created_at,
    'updated_at',   p.updated_at,
    'redacted',     false
  );
end;
$$;

revoke all on function public.admin_user_full(uuid, text) from public;
grant execute on function public.admin_user_full(uuid, text) to authenticated;

comment on function public.admin_user_full(uuid, text) is
  'Full-PII (raw email) cross-user read. HIGHEST role only (admin|developer), requires a reason, writes one audit row. NOT available to support.';

-- ── 8. admin_support_messages(status, limit) — REDACTED ticket list ────────
-- Support+ list/triage path. Masked email, no raw sender PII. The message body
-- the user themselves submitted is shown (it's the ticket); the email is masked.
create or replace function public.admin_support_messages(p_status text default null, p_limit int default 100)
returns table (
  id uuid,
  user_id uuid,
  email_masked text,
  subject text,
  message text,
  status text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.current_user_is_support_or_higher() then
    raise exception 'not authorized';
  end if;

  return query
    select sm.id,
           sm.user_id,
           public.mask_email(sm.email) as email_masked,
           sm.subject,
           sm.message,
           sm.status,
           sm.created_at
    from public.support_messages sm
    where p_status is null or sm.status = p_status
    order by sm.created_at desc
    limit greatest(1, least(coalesce(p_limit, 100), 500));
end;
$$;

revoke all on function public.admin_support_messages(text, int) from public;
grant execute on function public.admin_support_messages(text, int) to authenticated;

comment on function public.admin_support_messages(text, int) is
  'Redacted support-ticket list for support+admin+developer. Masked sender email, no raw PII.';
