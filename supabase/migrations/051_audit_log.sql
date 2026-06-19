-- ────────────────────────────────────────────────────────────────────────────
-- 051_audit_log.sql — Phase A3 (2/2): an append-only, queryable audit log for
-- every privileged read-of-full-PII and every mutating admin action.
--
-- WHY THIS EXISTS
--   migration 009's `admin_actions` captures profile WRITES, but there is no
--   single queryable audit trail that also records privileged READS (full-PII
--   unmasking) and the destructive/reversible/notified flags an admin tool needs
--   for accountability. The `admin-actions` edge function passed a `reason` that
--   went nowhere. This is that trail.
--
-- APPEND-ONLY GUARANTEE
--   RLS: elevated roles may SELECT. There is NO update policy and NO delete
--   policy, so for a non-superuser RLS denies UPDATE/DELETE by default-deny
--   (a table with RLS enabled and no permissive policy for a command rejects it).
--   INSERT is likewise NOT granted via policy — rows are written ONLY through the
--   SECURITY DEFINER `write_audit` helper (definer-owned, RLS-exempt). End-user
--   and even elevated-user code paths cannot INSERT directly.
--
-- Re-runnable: create-if-not-exists + DROP POLICY IF EXISTS.
-- Depends on: 050 (has_role / current_user_is_privileged widened to support+).
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.audit_log (
  id              uuid primary key default gen_random_uuid(),
  actor_id        uuid references auth.users(id) on delete set null,
  actor_role      text,                                  -- snapshot of actor's role at action time
  target_user_id  uuid references auth.users(id) on delete set null,
  target_type     text,                                  -- 'profile' | 'support_message' | 'deletion_request' | …
  target_id       text,                                  -- resource id (text: not always a uuid)
  action          text not null,                         -- 'read_full_pii' | 'update_user_metadata' | 'set_role' | …
  reason          text,
  before_state    jsonb,                                 -- REDACTED snapshot (never raw PII)
  after_state     jsonb,                                 -- REDACTED snapshot (never raw PII)
  was_destructive boolean not null default false,
  was_reversible  boolean not null default true,
  user_notified   boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists idx_audit_log_actor   on public.audit_log(actor_id);
create index if not exists idx_audit_log_target  on public.audit_log(target_user_id);
create index if not exists idx_audit_log_action  on public.audit_log(action);
create index if not exists idx_audit_log_recent  on public.audit_log(created_at desc);

alter table public.audit_log enable row level security;

comment on table public.audit_log is
  'Append-only audit trail: every privileged full-PII read and every mutating admin action. Written ONLY by the SECURITY DEFINER write_audit() helper. No UPDATE/DELETE policy — immutable for non-superusers.';

-- ── RLS: read-only for elevated roles; NO insert/update/delete policy ──────
-- A SELECT policy is the ONLY permissive policy. With RLS enabled and no
-- INSERT/UPDATE/DELETE policy, those commands are denied for every non-superuser
-- (default-deny) — that is the append-only enforcement.
drop policy if exists "Elevated read audit log" on public.audit_log;
create policy "Elevated read audit log" on public.audit_log
  for select
  using (public.current_user_is_support_or_higher());

-- ── write_audit(...) — the ONLY insert path (SECURITY DEFINER) ─────────────
-- Snapshots the actor's role for the row. Callers MUST pass already-redacted
-- before/after jsonb (no raw email / payment ids). Used by the admin RPCs and
-- by the admin-actions edge function (via rpc).
create or replace function public.write_audit(
  p_action          text,
  p_target_user_id  uuid    default null,
  p_target_type     text    default null,
  p_target_id       text    default null,
  p_reason          text    default null,
  p_before          jsonb   default null,
  p_after           jsonb   default null,
  p_was_destructive boolean default false,
  p_was_reversible  boolean default true,
  p_user_notified   boolean default false,
  p_actor_id        uuid    default null   -- defaults to auth.uid(); edge fn passes the verified caller
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid;
  v_role  text;
  v_id    uuid;
begin
  if p_action is null or btrim(p_action) = '' then
    raise exception 'audit action is required';
  end if;

  v_actor := coalesce(p_actor_id, auth.uid());
  select role into v_role from public.profiles where id = v_actor;

  insert into public.audit_log (
    actor_id, actor_role, target_user_id, target_type, target_id,
    action, reason, before_state, after_state,
    was_destructive, was_reversible, user_notified
  ) values (
    v_actor, v_role, p_target_user_id, p_target_type, p_target_id,
    p_action, nullif(btrim(coalesce(p_reason, '')), ''), p_before, p_after,
    coalesce(p_was_destructive, false), coalesce(p_was_reversible, true),
    coalesce(p_user_notified, false)
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.write_audit(text, uuid, text, text, text, jsonb, jsonb, boolean, boolean, boolean, uuid) from public;
-- service_role (edge functions) writes the trail; authenticated callers reach it
-- only transitively through the definer admin RPCs, never to forge an actor.
grant execute on function public.write_audit(text, uuid, text, text, text, jsonb, jsonb, boolean, boolean, boolean, uuid) to service_role;

comment on function public.write_audit is
  'Append-only audit writer (SECURITY DEFINER, the ONLY insert path into audit_log). Snapshots actor role. Callers must pass REDACTED before/after jsonb.';
