-- ────────────────────────────────────────────────────────────────────────────
-- 054_account_deletion_processing.sql — Phase A3 follow-up: the PROCESSOR that
-- 052 deliberately left out. 052 created `deletion_requests` + the user request
-- path; nothing ACTED on a 'requested' row. This is that job.
--
-- WHY THIS EXISTS
--   052's footer: "The actual soft-delete PROCESSING is a service-role job: read
--   'requested' rows past the grace window, anonymise/lock the profile, mark
--   'processing' then 'done', and write an audit_log row (action=
--   'process_deletion', was_destructive=true, was_reversible=false,
--   user_notified=true)." This migration delivers exactly that, as a SECURITY
--   DEFINER RPC reachable ONLY by service_role (the `account-actions` edge
--   function's `process_deletions` action, or a scheduled cron — both run with
--   the service-role key, the RLS-bypass trust boundary the rest of A3 relies on).
--
-- SOFT-DELETE, NOT HARD DELETE
--   Processing NEVER drops the auth user or the profile row. It ANONYMISES +
--   LOCKS: clears the display_name + the email mirror, stamps profiles.deleted_at
--   (and disabled_at, so the locked account can't be used), and advances the
--   request 'requested' -> 'processing' -> 'done'. The row is retained for
--   referential integrity (settlements/audit FKs) and accountability. A genuine
--   hard erasure, if ever required, is a separate operator-run step on top of this
--   anonymised state — out of scope here, by design.
--
-- GRACE WINDOW
--   Only rows whose requested_at is at/older than (now - grace_days) are touched.
--   The default grace is 7 days; a row still inside the window is SKIPPED. The
--   user filed the request themselves (deletion_requests.user_id = their own uid,
--   per 052's WITH CHECK) and the grace window is their notice/cooling-off period
--   — which is why the audit attests user_notified=true (see the RPC body).
--
-- AUDIT (one row per processed request)
--   action='process_deletion', target_user_id=the user, was_destructive=true,
--   was_reversible=false, user_notified=true, with a REDACTED before/after
--   snapshot (masked email only — never the raw address). Written through the 051
--   append-only write_audit() definer — the only insert path into audit_log.
--
-- Re-runnable: add-column-if-not-exists + CREATE OR REPLACE + DROP POLICY-free.
-- Depends on: 050 (has_role / mask_email), 051 (write_audit / audit_log),
--             052 (deletion_requests), 053 (profiles.disabled_at).
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Soft-delete (GDPR-erasure) marker on profiles ───────────────────────
-- Distinct from 053's disabled_at/banned_at (moderation flags): deleted_at marks
-- an account the USER asked to erase and the processor has anonymised. Retained,
-- never a row delete.
alter table public.profiles
  add column if not exists deleted_at timestamptz;

comment on column public.profiles.deleted_at is
  'Soft-delete (account-erasure) marker. Set by process_account_deletions() after the grace window once display_name + the email mirror have been cleared and the account locked. The row is RETAINED (referential integrity / audit) — never a hard delete.';

-- ── 2. process_account_deletions(actor, grace_days, limit) ─────────────────
-- The processor. SECURITY DEFINER so it bypasses the (intentionally strict) RLS
-- on profiles/deletion_requests — consistent with every other A3 service path.
--
-- Authorization model:
--   • p_actor IS NULL  → a scheduled/system run (cron). Reachable only because
--     the function is granted to service_role; service_role IS the trust boundary.
--   • p_actor NOT NULL → a human-triggered run (the edge function forwards the
--     verified caller). That caller MUST be the highest role (admin|developer) —
--     processing a deletion is destructive + irreversible, never a support power.
create or replace function public.process_account_deletions(
  p_actor      uuid default null,
  p_grace_days int  default 7,
  p_limit      int  default 100
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  r          record;
  v_grace    int;
  v_limit    int;
  v_cutoff   timestamptz;
  v_email    text;
  v_dname    text;
  v_before   jsonb;
  v_processed int := 0;
  v_ids      uuid[] := array[]::uuid[];
begin
  -- A human trigger must be the highest role; a null actor is a service-role /
  -- cron run (the grant to service_role is what gates that path).
  if p_actor is not null
     and not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized: processing deletions requires admin or developer';
  end if;

  v_grace  := greatest(0, coalesce(p_grace_days, 7));
  v_limit  := greatest(1, least(coalesce(p_limit, 100), 1000));
  v_cutoff := now() - make_interval(days => v_grace);

  -- Claim due rows oldest-first. SKIP LOCKED makes concurrent runs (cron + a
  -- manual trigger) safe: each grabs a disjoint batch instead of blocking.
  for r in
    select dr.id, dr.user_id
      from public.deletion_requests dr
      where dr.status = 'requested'
        and dr.requested_at <= v_cutoff
      order by dr.requested_at asc
      limit v_limit
      for update skip locked
  loop
    -- (a) claim: requested -> processing. Whole batch is one transaction; the
    -- explicit two-step also documents the lifecycle 052 specified.
    update public.deletion_requests
      set status = 'processing', processed_by = p_actor, processed_at = now()
      where id = r.id;

    -- REDACTED before-snapshot. mask_email() guarantees the raw address never
    -- reaches the audit log (a@b.com -> a***@b.com).
    v_email := null;
    v_dname := null;
    if r.user_id is not null then
      select email, display_name into v_email, v_dname
        from public.profiles where id = r.user_id;
    end if;
    v_before := jsonb_build_object(
      'email_masked',     public.mask_email(v_email),
      'had_display_name', (v_dname is not null)
    );

    -- (b) anonymise + LOCK the profile (soft-delete — never a row delete). Clear
    -- the display_name and the email mirror, stamp deleted_at, and disable the
    -- account so the anonymised shell can't be signed into.
    if r.user_id is not null then
      update public.profiles
        set display_name = null,
            email        = null,
            deleted_at   = now(),
            disabled_at  = coalesce(disabled_at, now()),
            updated_at   = now()
        where id = r.user_id;
    end if;

    -- (c) processing -> done.
    update public.deletion_requests
      set status = 'done', processed_at = now()
      where id = r.id;

    -- One audit row per processed request. DESTRUCTIVE + IRREVERSIBLE (the
    -- anonymisation can't be undone). user_notified=true: the user filed this
    -- request themselves and the grace window was their cooling-off notice.
    perform public.write_audit(
      p_action          => 'process_deletion',
      p_target_user_id  => r.user_id,
      p_target_type     => 'deletion_request',
      p_target_id       => r.id::text,
      p_reason          => 'soft-delete processed after grace window',
      p_before          => v_before,
      p_after           => jsonb_build_object(
        'anonymized', true,
        'status',     'done',
        'locked',     true
      ),
      p_was_destructive => true,
      p_was_reversible  => false,
      p_user_notified   => true,
      p_actor_id        => p_actor
    );

    v_processed := v_processed + 1;
    v_ids := array_append(v_ids, r.id);
  end loop;

  return jsonb_build_object(
    'processed', v_processed,
    'ids',       v_ids,
    'cutoff',    v_cutoff,
    'grace_days', v_grace
  );
end;
$$;

-- Service-role only: the edge function (process_deletions action) and any cron
-- run hold the service-role key. Authenticated end users / elevated callers never
-- reach this directly — they cannot forge a processor run.
revoke all on function public.process_account_deletions(uuid, int, int) from public;
grant execute on function public.process_account_deletions(uuid, int, int) to service_role;

comment on function public.process_account_deletions(uuid, int, int) is
  'Soft-delete processor (service_role only). Reads deletion_requests past the grace window, anonymises + locks each target profile (clears display_name + email mirror, stamps deleted_at/disabled_at — never a hard delete), advances requested->processing->done, and writes ONE process_deletion audit row per request (destructive, irreversible, user_notified). A null p_actor = scheduled/system run; a non-null p_actor must be admin|developer.';

-- ── 3. Optional schedule (defensive, inert without pg_cron) ─────────────────
-- Runs nightly with a null actor (system run). Mirrors 039's exception-safe
-- pattern so the migration applies cleanly where pg_cron is unavailable (local
-- dev): the operator can schedule it manually, or invoke the edge function's
-- process_deletions action instead.
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception when insufficient_privilege then
  raise notice 'pg_cron unavailable; schedule account-deletion processing manually';
end;
$$;

do $$
begin
  perform cron.unschedule(jobid) from cron.job
    where jobname = 'account-deletions-daily';
  perform cron.schedule('account-deletions-daily', '15 5 * * *',
    $job$select public.process_account_deletions(null, 7, 500);$job$);
exception when undefined_table or invalid_schema_name or insufficient_privilege then
  raise notice 'pg_cron unavailable; schedule account-deletion processing manually';
end;
$$;
