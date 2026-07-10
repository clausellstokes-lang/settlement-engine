-- ────────────────────────────────────────────────────────────────────────────
-- 125_action_velocity_guards.sql — per-USER velocity ceilings on the
-- authenticated community actions the abuse-model audit flagged as
-- economically-gated-only: add_gallery_comment / toggle_gallery_vote.
--
-- MERGE PROVENANCE (Wave-1, fusion spec C). Our former 052 rebuilt onto the
-- adopted chain, with THREE reconciliations vs a verbatim port:
--
--   1. GALLERY GUARDS FOLD INTO THEIR 059 BODIES, NOT 019. Our 052 redefined
--      toggle_gallery_vote / add_gallery_comment as "verbatim 019 body + guard".
--      But the net-current body of both is 059 (enforce_account_status_rls),
--      which inserts a `if not public.account_is_active(auth.uid()) then raise`
--      banned-account gate right after the auth check. A verbatim-052 port would
--      SILENTLY DELETE that gate — a security regression. Here the velocity guard
--      is inserted into their 059 bodies, right AFTER the account_is_active gate,
--      preserving everything else 059 established. delete_gallery_comment (059)
--      needs no guard and is deliberately NOT redefined, so 059 stays net-current
--      for it.
--
--   2. consume_narrate_rate_limit IS DROPPED (not ported). Our 052 added a second,
--      tighter hourly ceiling (40/3600s, user client) over generate-narrative on
--      top of the ECONOMIC credit gate. Their 079/087 already ship
--      consume_ai_generate_rate_limit (config-driven, default 86400s/60, service-
--      role) and their generate-narrative already calls it. Two parallel limiters
--      = two round-trips + duplicated infra for one behaviour, so the narrate
--      ceiling is retired: their consume_ai_generate_rate_limit is THE narrate
--      limiter. (If an hourly cap is ever wanted on top of their daily one, add a
--      second bucket via their ai_user_rate_limit config, not a parallel RPC.)
--      Nothing to DROP on replay — the function never existed on this chain (our
--      052 never deployed anywhere); it is simply never created.
--
--   3. The generic user_action_rate_limits infra (counter table + private
--      counting helper + cleanup fn + cron) has ZERO counterpart on their side
--      and ports cleanly — it is the substrate the two gallery guards key on.
--
-- The mechanism mirrors the proven per-IP limiters (034 email, 035 dossier-
-- verify) but keys on auth.uid() (these callers are all authenticated). One
-- shared, self-bounding counter table + one PRIVATE counting helper; the
-- server-fixed limits live at each call site (never client-overridable), so a
-- caller cannot widen its own ceiling. Fixed-window buckets; the atomic single-
-- statement upsert takes a row lock, so concurrent callers can't race past the
-- limit (no TOCTOU).
--
-- Re-runnable: create-if-not-exists / create-or-replace throughout.
-- ────────────────────────────────────────────────────────────────────────────

-- ── Shared per-user counter table ───────────────────────────────────────────
-- One row per (user, action, fixed window). Self-bounding per window; the
-- cleanup function below reclaims space once a window has rolled over.
create table if not exists public.user_action_rate_limits (
  user_key     uuid        not null,
  action       text        not null,
  window_start timestamptz not null,
  count        integer     not null default 0,
  primary key (user_key, action, window_start)
);

alter table public.user_action_rate_limits enable row level security;
-- No policies: the table is reached ONLY via the SECURITY DEFINER functions
-- below. RLS-on + no-policy denies all direct anon/authenticated access to the
-- raw counters.

create index if not exists user_action_rate_limits_window_start_idx
  on public.user_action_rate_limits (window_start);

-- ── Private counting helper ─────────────────────────────────────────────────
-- Increments the (user, action, current-window) counter and returns the post-
-- increment count. Because the caller raises when over the limit, that raise
-- rolls back its own increment (and the caller's write) within the function
-- transaction — so the persisted count converges to the ceiling of ACCEPTED
-- actions and stays there: the (N+1)th accepted write can never commit, and
-- every further attempt re-trips + rolls back. That is exactly the desired cap
-- (at most N accepted actions per window). The upsert is a single statement
-- holding a row lock, so concurrent callers cannot race past the limit. NOT
-- granted to anon/authenticated — it is invoked
-- only from the SECURITY DEFINER wrappers below (which execute as the function
-- owner and so retain EXECUTE), meaning no client can call it directly with a
-- chosen action/window to skew another action's counter or read the raw counts.
create or replace function public._consume_action_rate_limit(
  p_uid            uuid,
  p_action         text,
  p_window_seconds integer
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window timestamptz;
  v_count  integer;
begin
  if p_window_seconds is null or p_window_seconds < 1 then
    p_window_seconds := 3600;
  end if;

  v_window := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into public.user_action_rate_limits as ual (user_key, action, window_start, count)
  values (p_uid, p_action, v_window, 1)
  on conflict (user_key, action, window_start)
    do update set count = ual.count + 1
  returning ual.count into v_count;

  return v_count;
end;
$$;

revoke all on function public._consume_action_rate_limit(uuid, text, integer) from public;

-- ── toggle_gallery_vote — THEIR 059 body + a 60/hour per-user velocity guard ──
-- Net-current body is 059 (enforce_account_status_rls): reproduced VERBATIM,
-- including the account_is_active banned-account gate, with ONLY the velocity
-- guard added right after that gate. Everything else (target check, toggle
-- semantics, return shape, grant posture) is unchanged.
create or replace function public.toggle_gallery_vote(target_settlement_id uuid)
returns table (net_votes integer, voted boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in to vote';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  -- Velocity guard (125): at most 60 accepted toggles/hour/user. Wire-speed
  -- toggling is bot behaviour; a human votes a handful of times.
  if public._consume_action_rate_limit(auth.uid(), 'gallery_vote', 3600) > 60 then
    raise exception 'You are voting too quickly — please slow down and try again shortly.';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  if exists (
    select 1 from public.gallery_votes
    where settlement_id = target_settlement_id and user_id = auth.uid()
  ) then
    delete from public.gallery_votes
      where settlement_id = target_settlement_id and user_id = auth.uid();
    return query
      select count(*)::integer, false
      from public.gallery_votes
      where settlement_id = target_settlement_id;
  else
    insert into public.gallery_votes(settlement_id, user_id)
      values (target_settlement_id, auth.uid())
      on conflict do nothing;
    return query
      select count(*)::integer, true
      from public.gallery_votes
      where settlement_id = target_settlement_id;
  end if;
end;
$$;

revoke execute on function public.toggle_gallery_vote(uuid) from public;
grant execute on function public.toggle_gallery_vote(uuid) to authenticated;

-- ── add_gallery_comment — THEIR 059 body + a 20/hour per-user velocity guard ──
-- Net-current body is 059: reproduced VERBATIM, including the account_is_active
-- banned-account gate, with ONLY the velocity guard added right after that gate.
create or replace function public.add_gallery_comment(target_settlement_id uuid, comment_body text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  comment_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in to comment';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  -- Velocity guard (125): at most 20 accepted comments/hour/user. Comment storage
  -- is otherwise unbounded (the display list caps at 100 but the rows persist);
  -- 20/hour is generous for a human and useless as a flood vector.
  if public._consume_action_rate_limit(auth.uid(), 'gallery_comment', 3600) > 20 then
    raise exception 'You are commenting too quickly — please slow down and try again shortly.';
  end if;

  if char_length(trim(coalesce(comment_body, ''))) < 1 then
    raise exception 'Comment cannot be empty';
  end if;
  if char_length(trim(comment_body)) > 2000 then
    raise exception 'Comment is too long';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  insert into public.gallery_comments(settlement_id, user_id, body)
    values (target_settlement_id, auth.uid(), trim(comment_body))
    returning id into comment_id;
  return comment_id;
end;
$$;

revoke execute on function public.add_gallery_comment(uuid, text) from public;
grant execute on function public.add_gallery_comment(uuid, text) to authenticated;

comment on function public.toggle_gallery_vote(uuid) is
  'Toggle the caller''s upvote on a public settlement. 059: rejects a non-active account. 125: 60 accepted toggles/hour/user velocity ceiling.';
comment on function public.add_gallery_comment(uuid, text) is
  'Authenticated comment on a public settlement. 059: rejects a non-active account. 125: 20 accepted comments/hour/user velocity ceiling.';

-- ── Stale-row cleanup (mirrors 035/079) ──────────────────────────────────────
create or replace function public.cleanup_user_action_rate_limits(
  p_retention_seconds integer default 86400
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_deleted integer := 0;
begin
  if p_retention_seconds is null or p_retention_seconds < 1 then
    p_retention_seconds := 86400;
  end if;
  delete from public.user_action_rate_limits
    where window_start < now() - make_interval(secs => p_retention_seconds);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.cleanup_user_action_rate_limits(integer) from public;
grant execute on function public.cleanup_user_action_rate_limits(integer) to service_role;

-- Schedule the purge (defensive pg_cron install, mirroring 034/035/079). The table
-- is self-bounding per window even without this; cleanup just reclaims space.
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception
  when insufficient_privilege then
    raise notice 'pg_cron extension could not be installed; schedule cleanup_user_action_rate_limits manually';
end;
$$;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'cleanup-user-action-rate-limits';
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule(
    'cleanup-user-action-rate-limits',
    '47 4 * * *',
    $job$select public.cleanup_user_action_rate_limits();$job$
  );
exception
  when undefined_table or invalid_schema_name or insufficient_privilege then
    raise notice 'pg_cron unavailable; schedule cleanup_user_action_rate_limits manually';
end;
$$;
