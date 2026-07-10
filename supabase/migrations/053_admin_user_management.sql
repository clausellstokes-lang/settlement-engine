-- ────────────────────────────────────────────────────────────────────────────
-- 053_admin_user_management.sql — Phase A4: admin/developer user-management
-- tooling, built ON TOP of the A3 least-privilege RBAC + append-only audit
-- foundation (050/051/052). Inherits — never loosens — A3's security posture.
--
-- WHAT THIS ADDS
--   1. Soft-delete account flags on profiles: disabled_at / banned_at (reversible
--      timestamps — NO hard delete anywhere in A4).
--   2. `warnings` — issued-warning records. RLS: a user reads their OWN warnings
--      (they were told); elevated roles read all. Append-only: rows are written
--      ONLY by the SECURITY DEFINER issue_warning() RPC.
--   3. `internal_notes` — admin-private notes ABOUT a user. RLS: the SUBJECT user
--      CANNOT read notes about themselves; ONLY elevated roles read. Append-only
--      via the SECURITY DEFINER add_internal_note() RPC.
--   4. A widened (create-or-replace) `admin_user_summary` that returns the
--      REDACTED management view the A4 panel needs: masked email, account age,
--      tier, credit balance, settlement/campaign/gallery counts, ticket/warning
--      history counts, and ban/disable status. Still NO raw email / payment ids.
--   5. The A4 action RPCs — each SECURITY DEFINER, each re-checks the actor role
--      server-side, each writes EXACTLY ONE audit_log row via write_audit(), and
--      each is soft-delete-first (disable/ban/remove/revoke set reversible flags):
--        issue_warning, add_internal_note,
--        set_account_disabled, set_account_banned (both reversible),
--        soft_delete_settlement / restore_settlement,
--        admin_remove_gallery_item, admin_revoke_share_link,
--        admin_billing_summary (REDACTED Stripe summary, support+),
--        admin_full_debug_copy (FULL debug bundle — HIGHEST role + justification).
--   The credit grant/refund + email/send + create-full-debug join paths are
--   driven from the admin-actions edge function, which already holds the
--   service-role client and reuses service_set_credits (017) + write_audit (051).
--
-- ROLE MODEL (unchanged from A3 — see 050):
--   support   → REDACTED reads + ticket triage + warnings/notes READ. No PII,
--               no destructive flags, no credit writes, no full-debug.
--   admin/dev → "highest" — everything, audited.
--
-- APPEND-ONLY / SOFT-DELETE GUARANTEES
--   warnings + internal_notes have a SELECT policy only (read gating). There is
--   NO insert/update/delete policy, so for a non-superuser those commands are
--   default-denied; rows are written solely through the definer RPCs below.
--   Every destructive-looking action is a reversible FLAG + an audit row — there
--   is no DELETE of user content in this migration.
--
-- Re-runnable: add-column-if-not-exists + create-if-not-exists + DROP POLICY IF
-- EXISTS + CREATE OR REPLACE throughout.
-- Depends on: 050 (has_role / current_user_is_* / mask_email),
--             051 (write_audit / audit_log), 017 (service RPCs), 011/008 (gallery).
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Soft-delete account flags (reversible) ──────────────────────────────
alter table public.profiles
  add column if not exists disabled_at timestamptz,
  add column if not exists banned_at   timestamptz;

comment on column public.profiles.disabled_at is
  'Soft-disable flag (reversible). When set, the account is suspended; clearing it restores access. Never a hard delete.';
comment on column public.profiles.banned_at is
  'Soft-ban flag (reversible). When set, the account is banned; clearing it unbans. Never a hard delete.';

-- ── 2. warnings — user reads OWN; elevated reads all; append-only via RPC ───
create table if not exists public.warnings (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  issued_by     uuid references auth.users(id) on delete set null,
  severity      text not null default 'notice'
                  check (severity in ('notice', 'minor', 'major', 'final')),
  reason        text not null,
  user_notified boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists idx_warnings_user on public.warnings(user_id);

alter table public.warnings enable row level security;

comment on table public.warnings is
  'Issued warnings. A user reads their OWN (they were told); elevated roles read all. Written ONLY by the issue_warning() definer RPC — no insert/update/delete policy.';

drop policy if exists "Users read own warnings" on public.warnings;
create policy "Users read own warnings" on public.warnings
  for select
  using (auth.uid() = user_id or public.current_user_is_support_or_higher());

-- ── 3. internal_notes — subject CANNOT read; elevated only; append-only RPC ─
create table if not exists public.internal_notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  author_id   uuid references auth.users(id) on delete set null,
  note        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_internal_notes_user on public.internal_notes(user_id);

alter table public.internal_notes enable row level security;

comment on table public.internal_notes is
  'Admin-private notes ABOUT a user. The SUBJECT user CANNOT read notes about themselves — ONLY elevated roles read. Written ONLY by the add_internal_note() definer RPC.';

-- The subject is deliberately NOT in the USING clause: a user must never read
-- internal notes written about them. Elevated roles only.
drop policy if exists "Elevated read internal notes" on public.internal_notes;
create policy "Elevated read internal notes" on public.internal_notes
  for select
  using (public.current_user_is_support_or_higher());

-- ── 4. admin_user_summary — widened REDACTED management view ────────────────
-- create-or-replace over the 050 definition: SAME redacted posture (masked
-- email, no raw email, no payment ids) plus the counts/status the A4 panel
-- needs. support+ may call it (the default management read).
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
  public_count     int;
  campaign_count   int;
  ticket_count     int;
  warning_count    int;
begin
  if not public.current_user_is_support_or_higher() then
    raise exception 'not authorized';
  end if;
  if target_user is null then
    raise exception 'target_user is required';
  end if;

  select id, role, tier, is_founder, display_name, email, credits,
         created_at, disabled_at, banned_at
    into p
    from public.profiles
    where id = target_user;

  if not found then
    raise exception 'target profile not found';
  end if;

  select count(*)::int into settlement_count
    from public.settlements where user_id = target_user;
  -- gallery items = the user's public dossiers.
  select count(*)::int into public_count
    from public.settlements where user_id = target_user and is_public = true;
  -- campaigns: settlements carrying campaign state (column added in 013). Guard
  -- the column so this summary works even on a pre-013 schema (e.g. test rigs).
  begin
    select count(*)::int into campaign_count
      from public.settlements
      where user_id = target_user and campaign_id is not null;
  exception when undefined_column then
    campaign_count := null;
  end;
  begin
    select count(*)::int into ticket_count
      from public.support_messages where user_id = target_user;
  exception when undefined_table then
    ticket_count := null;
  end;
  select count(*)::int into warning_count
    from public.warnings where user_id = target_user;

  -- Redacted shape: masked email, status flags, counts. NEVER raw email / any
  -- payment id. account_age_days is derived (account age, not the raw ts).
  return jsonb_build_object(
    'id',              p.id,
    'role',            p.role,
    'tier',            p.tier,
    'is_founder',      p.is_founder,
    'display_name',    p.display_name,
    'email_masked',    public.mask_email(p.email),
    'credits',         p.credits,
    'created_at',      p.created_at,
    'account_age_days', greatest(0, (extract(epoch from (now() - p.created_at)) / 86400)::int),
    'settlements',     settlement_count,
    'gallery_items',   public_count,
    'campaigns',       campaign_count,
    'tickets',         ticket_count,
    'warnings',        warning_count,
    'disabled',        (p.disabled_at is not null),
    'banned',          (p.banned_at is not null),
    'disabled_at',     p.disabled_at,
    'banned_at',       p.banned_at,
    'redacted',        true
  );
end;
$$;

revoke all on function public.admin_user_summary(uuid) from public;
grant execute on function public.admin_user_summary(uuid) to authenticated;

comment on function public.admin_user_summary(uuid) is
  'A4 redacted user-management summary (support+). Masked email, status flags, counts. No raw email / payment ids. Widens the 050 summary.';

-- ── 5. A4 action RPCs ───────────────────────────────────────────────────────
-- Shared shape: SECURITY DEFINER, re-check the actor role, write EXACTLY ONE
-- audit row, soft-delete-first. All are reachable from the admin-actions edge
-- function (service-role) which forwards the verified actor id; they ALSO
-- re-gate via has_role so a forged direct call is rejected.

-- issue_warning — append a warning row + one audit row (support+ may warn).
create or replace function public.issue_warning(
  p_actor    uuid,
  p_target   uuid,
  p_severity text,
  p_reason   text,
  p_notified boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_sev text;
  v_reason text;
begin
  if not public.has_role(p_actor, array['support', 'admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_target is null then raise exception 'target is required'; end if;
  v_reason := nullif(btrim(coalesce(p_reason, '')), '');
  if v_reason is null then raise exception 'a warning reason is required'; end if;
  v_sev := coalesce(nullif(btrim(p_severity), ''), 'notice');
  if v_sev not in ('notice', 'minor', 'major', 'final') then
    raise exception 'invalid severity: %', v_sev;
  end if;

  insert into public.warnings (user_id, issued_by, severity, reason, user_notified)
    values (p_target, p_actor, v_sev, v_reason, coalesce(p_notified, false))
    returning id into v_id;

  perform public.write_audit(
    p_action          => 'issue_warning',
    p_target_user_id  => p_target,
    p_target_type     => 'warning',
    p_target_id       => v_id::text,
    p_reason          => v_reason,
    p_before          => null,
    p_after           => jsonb_build_object('severity', v_sev),
    p_was_destructive => false,
    p_was_reversible  => true,
    p_user_notified   => coalesce(p_notified, false),
    p_actor_id        => p_actor
  );

  return v_id;
end;
$$;

revoke all on function public.issue_warning(uuid, uuid, text, text, boolean) from public;
grant execute on function public.issue_warning(uuid, uuid, text, text, boolean) to service_role;

-- add_internal_note — append a private note + one audit row (support+).
create or replace function public.add_internal_note(
  p_actor  uuid,
  p_target uuid,
  p_note   text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_note text;
begin
  if not public.has_role(p_actor, array['support', 'admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_target is null then raise exception 'target is required'; end if;
  v_note := nullif(btrim(coalesce(p_note, '')), '');
  if v_note is null then raise exception 'a note body is required'; end if;

  insert into public.internal_notes (user_id, author_id, note)
    values (p_target, p_actor, v_note)
    returning id into v_id;

  -- The audit row records THAT a note was added (and its length) — never the
  -- note body (it may reference the user's own PII).
  perform public.write_audit(
    p_action          => 'add_internal_note',
    p_target_user_id  => p_target,
    p_target_type     => 'internal_note',
    p_target_id       => v_id::text,
    p_reason          => null,
    p_before          => null,
    p_after           => jsonb_build_object('length', length(v_note)),
    p_was_destructive => false,
    p_was_reversible  => true,
    p_user_notified   => false,
    p_actor_id        => p_actor
  );

  return v_id;
end;
$$;

revoke all on function public.add_internal_note(uuid, uuid, text) from public;
grant execute on function public.add_internal_note(uuid, uuid, text) to service_role;

-- set_account_disabled — REVERSIBLE soft-disable flag. HIGHEST role only.
create or replace function public.set_account_disabled(
  p_actor    uuid,
  p_target   uuid,
  p_disabled boolean,
  p_reason   text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  was_disabled boolean;
  new_ts timestamptz;
begin
  if not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized: disabling an account requires admin or developer';
  end if;
  if p_target is null then raise exception 'target is required'; end if;

  select (disabled_at is not null) into was_disabled
    from public.profiles where id = p_target;
  if not found then raise exception 'target profile not found'; end if;

  new_ts := case when p_disabled then now() else null end;
  update public.profiles
    set disabled_at = new_ts, updated_at = now()
    where id = p_target;

  perform public.write_audit(
    p_action          => case when p_disabled then 'disable_account' else 'enable_account' end,
    p_target_user_id  => p_target,
    p_target_type     => 'profile',
    p_target_id       => p_target::text,
    p_reason          => nullif(btrim(coalesce(p_reason, '')), ''),
    p_before          => jsonb_build_object('disabled', was_disabled),
    p_after           => jsonb_build_object('disabled', p_disabled),
    p_was_destructive => false,           -- a flag, not an erasure
    p_was_reversible  => true,
    p_user_notified   => false,
    p_actor_id        => p_actor
  );

  return jsonb_build_object('disabled', p_disabled);
end;
$$;

revoke all on function public.set_account_disabled(uuid, uuid, boolean, text) from public;
grant execute on function public.set_account_disabled(uuid, uuid, boolean, text) to service_role;

-- set_account_banned — REVERSIBLE soft-ban flag. HIGHEST role only.
create or replace function public.set_account_banned(
  p_actor  uuid,
  p_target uuid,
  p_banned boolean,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  was_banned boolean;
  new_ts timestamptz;
begin
  if not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized: banning an account requires admin or developer';
  end if;
  if p_target is null then raise exception 'target is required'; end if;

  select (banned_at is not null) into was_banned
    from public.profiles where id = p_target;
  if not found then raise exception 'target profile not found'; end if;

  new_ts := case when p_banned then now() else null end;
  update public.profiles
    set banned_at = new_ts, updated_at = now()
    where id = p_target;

  perform public.write_audit(
    p_action          => case when p_banned then 'ban_account' else 'unban_account' end,
    p_target_user_id  => p_target,
    p_target_type     => 'profile',
    p_target_id       => p_target::text,
    p_reason          => nullif(btrim(coalesce(p_reason, '')), ''),
    p_before          => jsonb_build_object('banned', was_banned),
    p_after           => jsonb_build_object('banned', p_banned),
    p_was_destructive => false,           -- reversible flag, not an erasure
    p_was_reversible  => true,
    p_user_notified   => false,
    p_actor_id        => p_actor
  );

  return jsonb_build_object('banned', p_banned);
end;
$$;

revoke all on function public.set_account_banned(uuid, uuid, boolean, text) from public;
grant execute on function public.set_account_banned(uuid, uuid, boolean, text) to service_role;

-- soft_delete_settlement / restore_settlement — REVERSIBLE. We do NOT delete
-- the row; we unpublish + set a reversible deleted_at flag. HIGHEST role only.
alter table public.settlements
  add column if not exists admin_deleted_at timestamptz;

comment on column public.settlements.admin_deleted_at is
  'Admin soft-delete flag (reversible). When set, the settlement is hidden/unpublished by moderation. Cleared by restore_settlement. Never a hard delete.';

create or replace function public.admin_soft_delete_settlement(
  p_actor  uuid,
  p_id     uuid,
  p_delete boolean,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  before_pub boolean;
  before_del boolean;
begin
  if not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_id is null then raise exception 'settlement id is required'; end if;

  select is_public, (admin_deleted_at is not null)
    into before_pub, before_del
    from public.settlements where id = p_id;
  if not found then raise exception 'settlement not found'; end if;

  if p_delete then
    -- Soft delete: flag + unpublish (so it leaves the gallery) — reversible.
    update public.settlements
      set admin_deleted_at = now(), is_public = false
      where id = p_id;
  else
    -- Restore: clear the flag. (Re-publishing is the owner's choice.)
    update public.settlements
      set admin_deleted_at = null
      where id = p_id;
  end if;

  perform public.write_audit(
    p_action          => case when p_delete then 'soft_delete_settlement' else 'restore_settlement' end,
    p_target_user_id  => null,
    p_target_type     => 'settlement',
    p_target_id       => p_id::text,
    p_reason          => nullif(btrim(coalesce(p_reason, '')), ''),
    p_before          => jsonb_build_object('is_public', before_pub, 'deleted', before_del),
    p_after           => jsonb_build_object('deleted', p_delete),
    p_was_destructive => p_delete,        -- hides content, but reversible
    p_was_reversible  => true,
    p_user_notified   => false,
    p_actor_id        => p_actor
  );

  return jsonb_build_object('deleted', p_delete);
end;
$$;

revoke all on function public.admin_soft_delete_settlement(uuid, uuid, boolean, text) from public;
grant execute on function public.admin_soft_delete_settlement(uuid, uuid, boolean, text) to service_role;

-- admin_remove_gallery_item — unpublish a public dossier (reversible). HIGHEST.
create or replace function public.admin_remove_gallery_item(
  p_actor  uuid,
  p_id     uuid,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  before_pub boolean;
begin
  if not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_id is null then raise exception 'settlement id is required'; end if;

  select is_public into before_pub from public.settlements where id = p_id;
  if not found then raise exception 'settlement not found'; end if;

  -- Remove from the public gallery: unpublish + un-curate. The row + content
  -- survive; the owner can re-share. Reversible.
  update public.settlements
    set is_public = false, is_curated = false, curated_order = null
    where id = p_id;

  perform public.write_audit(
    p_action          => 'remove_gallery_item',
    p_target_user_id  => null,
    p_target_type     => 'settlement',
    p_target_id       => p_id::text,
    p_reason          => nullif(btrim(coalesce(p_reason, '')), ''),
    p_before          => jsonb_build_object('is_public', before_pub),
    p_after           => jsonb_build_object('is_public', false),
    p_was_destructive => true,            -- removes from gallery, but reversible
    p_was_reversible  => true,
    p_user_notified   => false,
    p_actor_id        => p_actor
  );

  return jsonb_build_object('is_public', false);
end;
$$;

revoke all on function public.admin_remove_gallery_item(uuid, uuid, text) from public;
grant execute on function public.admin_remove_gallery_item(uuid, uuid, text) to service_role;

-- admin_revoke_share_link — clears the public slug so the share URL 404s
-- (reversible: re-sharing mints a new slug). Unpublishes too. HIGHEST role.
create or replace function public.admin_revoke_share_link(
  p_actor  uuid,
  p_id     uuid,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  had_slug boolean;
begin
  if not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_id is null then raise exception 'settlement id is required'; end if;

  select (public_slug is not null) into had_slug
    from public.settlements where id = p_id;
  if not found then raise exception 'settlement not found'; end if;

  update public.settlements
    set public_slug = null, is_public = false, is_curated = false, curated_order = null
    where id = p_id;

  perform public.write_audit(
    p_action          => 'revoke_share_link',
    p_target_user_id  => null,
    p_target_type     => 'settlement',
    p_target_id       => p_id::text,
    p_reason          => nullif(btrim(coalesce(p_reason, '')), ''),
    p_before          => jsonb_build_object('had_slug', had_slug),
    p_after           => jsonb_build_object('had_slug', false),
    p_was_destructive => true,
    p_was_reversible  => true,
    p_user_notified   => false,
    p_actor_id        => p_actor
  );

  return jsonb_build_object('revoked', true);
end;
$$;

revoke all on function public.admin_revoke_share_link(uuid, uuid, text) from public;
grant execute on function public.admin_revoke_share_link(uuid, uuid, text) to service_role;

-- admin_list_warnings — warning history for a user (support+ read).
create or replace function public.admin_list_warnings(p_target uuid)
returns table (
  id uuid, severity text, reason text, issued_by uuid,
  user_notified boolean, created_at timestamptz
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
    select w.id, w.severity, w.reason, w.issued_by, w.user_notified, w.created_at
      from public.warnings w
      where w.user_id = p_target
      order by w.created_at desc;
end;
$$;

revoke all on function public.admin_list_warnings(uuid) from public;
grant execute on function public.admin_list_warnings(uuid) to authenticated;

-- admin_list_internal_notes — private notes for a user (support+ read; the
-- subject can NEVER reach this — it re-checks the elevated role).
create or replace function public.admin_list_internal_notes(p_target uuid)
returns table (
  id uuid, note text, author_id uuid, created_at timestamptz
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
    select n.id, n.note, n.author_id, n.created_at
      from public.internal_notes n
      where n.user_id = p_target
      order by n.created_at desc;
end;
$$;

revoke all on function public.admin_list_internal_notes(uuid) from public;
grant execute on function public.admin_list_internal_notes(uuid) to authenticated;

-- admin_billing_summary — REDACTED Stripe/billing summary (support+). Returns
-- tier + a MASKED customer id (last 4) + credit balance — never the raw
-- stripe_customer_id. Reading it writes one audit row (a billing review).
create or replace function public.admin_billing_summary(p_actor uuid, p_target uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  p record;
  cust_masked text;
begin
  if not public.has_role(p_actor, array['support', 'admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_target is null then raise exception 'target is required'; end if;

  select tier, credits, is_founder, stripe_customer_id
    into p
    from public.profiles where id = p_target;
  if not found then raise exception 'target profile not found'; end if;

  -- Mask the customer id: keep only a tail so an admin can correlate with the
  -- Stripe dashboard WITHOUT the raw id leaving the DB.
  cust_masked := case
    when p.stripe_customer_id is null then null
    when length(p.stripe_customer_id) <= 4 then '***'
    else '***' || right(p.stripe_customer_id, 4)
  end;

  perform public.write_audit(
    p_action          => 'review_billing',
    p_target_user_id  => p_target,
    p_target_type     => 'profile',
    p_target_id       => p_target::text,
    p_reason          => null,
    p_before          => null,
    p_after           => jsonb_build_object('customer_masked', cust_masked),
    p_was_destructive => false,
    p_was_reversible  => true,
    p_user_notified   => false,
    p_actor_id        => p_actor
  );

  return jsonb_build_object(
    'tier',            p.tier,
    'is_founder',      p.is_founder,
    'credits',         p.credits,
    'customer_masked', cust_masked,
    'redacted',        true
  );
end;
$$;

revoke all on function public.admin_billing_summary(uuid, uuid) from public;
grant execute on function public.admin_billing_summary(uuid, uuid) to service_role;

-- admin_diagnostic_bundle — REDACTED-by-default diagnostic export (support+).
-- No raw email / no payment id. The default "give me a support bundle" read.
-- When p_full is true it is a FULL debug copy: HIGHEST role + a justification +
-- it includes the raw email; it ALWAYS writes one audit row recording which
-- variant was produced.
create or replace function public.admin_diagnostic_bundle(
  p_actor  uuid,
  p_target uuid,
  p_full   boolean default false,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  p record;
  reason_clean text;
  bundle jsonb;
begin
  -- Redacted bundle: support+. Full bundle: HIGHEST role + a reason.
  if p_full then
    if not public.has_role(p_actor, array['admin', 'developer']) then
      raise exception 'not authorized: a full debug copy requires admin or developer';
    end if;
    reason_clean := nullif(btrim(coalesce(p_reason, '')), '');
    if reason_clean is null then
      raise exception 'a justification is required for a full debug copy';
    end if;
  else
    if not public.has_role(p_actor, array['support', 'admin', 'developer']) then
      raise exception 'not authorized';
    end if;
  end if;
  if p_target is null then raise exception 'target is required'; end if;

  select id, role, tier, is_founder, display_name, email, credits,
         created_at, disabled_at, banned_at
    into p
    from public.profiles where id = p_target;
  if not found then raise exception 'target profile not found'; end if;

  if p_full then
    -- FULL: includes the raw email (the audited unmasking).
    bundle := jsonb_build_object(
      'id', p.id, 'role', p.role, 'tier', p.tier, 'is_founder', p.is_founder,
      'display_name', p.display_name, 'email', p.email, 'credits', p.credits,
      'created_at', p.created_at, 'disabled_at', p.disabled_at, 'banned_at', p.banned_at,
      'redacted', false
    );
  else
    -- REDACTED: masked email only.
    bundle := jsonb_build_object(
      'id', p.id, 'role', p.role, 'tier', p.tier, 'is_founder', p.is_founder,
      'display_name', p.display_name, 'email_masked', public.mask_email(p.email),
      'credits', p.credits, 'created_at', p.created_at,
      'disabled', (p.disabled_at is not null), 'banned', (p.banned_at is not null),
      'redacted', true
    );
  end if;

  perform public.write_audit(
    p_action          => case when p_full then 'export_full_debug' else 'export_diagnostic' end,
    p_target_user_id  => p_target,
    p_target_type     => 'profile',
    p_target_id       => p_target::text,
    p_reason          => reason_clean,
    p_before          => null,
    -- The audit row NEVER carries the raw email — only the masked form + the
    -- variant produced.
    p_after           => jsonb_build_object('full', p_full, 'email_masked', public.mask_email(p.email)),
    p_was_destructive => false,
    p_was_reversible  => true,
    p_user_notified   => false,
    p_actor_id        => p_actor
  );

  return bundle;
end;
$$;

revoke all on function public.admin_diagnostic_bundle(uuid, uuid, boolean, text) from public;
grant execute on function public.admin_diagnostic_bundle(uuid, uuid, boolean, text) to service_role;

comment on function public.admin_diagnostic_bundle(uuid, uuid, boolean, text) is
  'Diagnostic export. REDACTED by default (support+, masked email). A FULL debug copy (raw email) requires the highest role + a justification and is audited. Always writes one audit row.';
