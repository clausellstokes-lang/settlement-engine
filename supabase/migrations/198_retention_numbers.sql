-- ────────────────────────────────────────────────────────────────────────────
-- 198_retention_numbers.sql — the concrete retention numbers (§359.7, chair-signed
-- at ODQ §402 C2).
--
-- THE RULING: "the shortest retention consistent with product function, privacy-
-- preserving default". §359.7's detail died with the §187 document; the principle
-- outlived it and the website train's charter compiled the numbers FROM it. This
-- migration is the server half of that table.
--
-- THE NUMBERS THIS FILE MOVES
--   analytics_events (raw, person-adjacent)  400 days → 90 days
--   retention cohorts   full-refresh MV → durable incremental table
--   edit_events + settlement_snapshots  never pruned → export-then-prune,
--                                       400-day ceiling, FAIL CLOSED
-- THE NUMBERS THIS FILE DELIBERATELY LEAVES ALONE, so the absences read as
-- decisions rather than oversights:
--   ingest_rate_buckets     2 days — ephemeral by nature; unchanged.
--   client_error_events    30 days (081) — already the shortest ops triage window.
--   world_sim_metrics    indefinite (196) — RE-AFFIRMED. 196's own three reasons are
--     this principle already applied: no row is attributable to a person, the rows
--     ARE the tuning evidence, and volume is operator-bounded. No prune touches it,
--     and tests/security/retentionNumbers.pglite.test.js pins that structurally.
--   consent_change_records, money_events, ai_usage_events, audit rows — compliance
--     and books. Account-lifetime is a legal question, not a product one; out of
--     scope of this migration and unmentioned by every statement below.
--
-- ── THE COUPLING THAT MAKES THE ORDER MANDATORY ─────────────────────────────
-- 038's mv_retention_cohorts recomputes `first_seen` from RAW analytics_events at
-- every refresh. Pruning raw events to N days therefore TRUNCATES every cohort
-- curve at N and re-mints phantom later cohorts for old actors. 400 days of raw
-- person-adjacent rows exist today BECAUSE the aggregate is derived destructively.
-- So the order inside this file is mandatory and is also enforced at RUNTIME:
--   1. the durable table is created,
--   2. it is backfilled ONCE from the MV,
--   3. and only then does the prune shorten — and it shortens ONLY IF the table is
--      non-empty (GATE 1 below). An empty aggregate keeps the old 400-day window.
-- A prune that could shorten before the aggregate is durable is the STOP condition
-- the charter names; the runtime gate is what makes that unreachable rather than
-- merely un-authored.
--
-- ── HOW THE APPEND STAYS CORRECT AFTER THE RAW WINDOW SHORTENS ──────────────
-- The nightly append needs each of yesterday's active actors' COHORT DAY, which is
-- exactly the fact a 90-day raw window no longer holds for an older actor. It does
-- NOT get a new actor→cohort map: 036 already mints one at first contact. The single
-- writer (supabase/functions/ingest-events/actorLinks.ts, resolveDeviceActor /
-- resolveUserActor) claims a row in analytics_device_links or analytics_identity_links
-- on the FIRST request that carries the actor, so `min(created_at)` across those two
-- tables IS the actor's first-contact day. Those tables are never pruned, and
-- purge_analytics_for_user() (036) already deletes from BOTH — so this migration adds
-- no person-adjacent store and changes no deletion path.
--   RESIDUAL, stated: actorLinks.ts's documented FAIL-SOFT path can attribute a batch
--   to an actor with no mapping row. Such an actor has no cohort day and is simply
--   excluded from the append (fail closed) — the same population that ages out today.
--
-- ── THE EXPORT RECEIPT IS ALREADY IN THE SCHEMA ─────────────────────────────
-- No new receipt shape and no edge-function change. 038's export_cursors (name,
-- last_id, updated_at) is written by exactly ONE writer — the analytics-export edge
-- function — and its last_id is the high-water id successfully uploaded for that leg.
-- 037 defines research.snapshots and research.edits over the BASE tables' own identity
-- columns, so `id <= last_id` IS "this row was exported".
--   ⚠ SOUNDNESS LIMIT, and GATE 2 honours it: research.snapshots excludes
--   consent_tier='product', so for a product-tier snapshot `id <= last_id` does NOT
--   mean exported. Deleting a row a receipt does not cover is the fail-OPEN mistake,
--   so the snapshot arm is restricted to consent_tier='research'. Product-tier
--   snapshots are consequently NOT pruned here — a recorded residual for a later
--   ruling, not a silent gap. edit_events has no such limit (036's check constraint
--   makes it research-only by construction and research.edits is the whole table).
--
-- House security: RLS on with zero policies (deny-all), API-role grants revoked, every
-- function SECURITY DEFINER with search_path pinned pg_temp LAST, execute granted to
-- service_role only. Re-runnable. WRITTEN, NOT DEPLOYED — `supabase db push` stays the
-- owner's step.
-- ────────────────────────────────────────────────────────────────────────────

-- ── PART 1 · the durable retention aggregate ────────────────────────────────
-- Counts only. No actor column, no session column, no country column — the same
-- PII-free-BY-SCHEMA posture 196 established, which is why this table's indefinite
-- life is privacy-clean and why account deletion has nothing to remove from it.
create table if not exists public.analytics_retention_cohorts (
  cohort_day  date        not null,
  day_offset  integer     not null,
  actors      bigint      not null default 0,
  updated_at  timestamptz not null default now(),
  primary key (cohort_day, day_offset)
);
alter table public.analytics_retention_cohorts enable row level security;
revoke all on table public.analytics_retention_cohorts from public, anon, authenticated;

comment on table public.analytics_retention_cohorts is
  'Durable retention cohorts (198). Counts only — no actor ids, so its indefinite life '
  'carries no deletion obligation. Replaces the destructive recompute of 038''s '
  'mv_retention_cohorts; the MV is kept ONE release for readers. NOT API-readable: RLS '
  'on with zero policies and grants revoked; reached only via report_retention().';

-- ── PART 2 · the ONE-TIME backfill, BEFORE anything shortens ────────────────
-- The MV is the historical record: it is computed from the FULL raw history that
-- exists at apply time, which is precisely the history the 90-day window is about to
-- discard. Idempotent (re-running re-states the same rows). If the MV is absent the
-- table stays empty and GATE 1 below keeps the old 400-day window — fail closed.
do $backfill$
begin
  insert into public.analytics_retention_cohorts (cohort_day, day_offset, actors, updated_at)
  select cohort_day, day_offset, actors, now()
    from public.mv_retention_cohorts
      on conflict (cohort_day, day_offset)
      do update set actors = excluded.actors, updated_at = excluded.updated_at;
exception when undefined_table then
  raise notice 'mv_retention_cohorts absent — nothing to backfill; analytics_monthly_prune() keeps the 400-day window until the cohort table is populated';
end;
$backfill$;

-- ── PART 3 · the incremental append (yesterday's activity only) ─────────────
-- Idempotent by primary key: a second run for the same day re-states the same counts.
create or replace function public.append_retention_cohorts(p_day date default (now()::date - 1))
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_rows integer := 0;
begin
  insert into public.analytics_retention_cohorts (cohort_day, day_offset, actors, updated_at)
  select c.cohort_day, (p_day - c.cohort_day)::integer, count(*)::bigint, now()
    from (
      -- one row per actor active on p_day, carrying its first-contact day
      select a.actor_id, min(l.minted_at)::date as cohort_day
        from (
          select distinct e.actor_id
            from public.analytics_events e
           where e.actor_id is not null
             and e.created_at::date = p_day
        ) a
        join (
          select actor_id, created_at as minted_at from public.analytics_device_links
          union all
          select actor_id, created_at from public.analytics_identity_links
        ) l on l.actor_id = a.actor_id
       group by a.actor_id
    ) c
   where c.cohort_day <= p_day
   group by c.cohort_day
      on conflict (cohort_day, day_offset)
      do update set actors = excluded.actors, updated_at = excluded.updated_at;
  get diagnostics v_rows = row_count;
  return v_rows;
end;
$$;
revoke all on function public.append_retention_cohorts(date) from public;
grant execute on function public.append_retention_cohorts(date) to service_role;

-- ── PART 4 · nightly maintenance — latest-wins over 039/133/134 ─────────────
-- ⚠ THIS REDEFINITION MUST CARRY EVERY CALL 134's VERSION HAD, or a prior job
-- silently stops running (134's own header states the rule; this is the fourth
-- toucher). Carried verbatim: rollup_analytics_daily, rollup_analytics_v2_daily,
-- rollup_intent_atlas_daily, and all three materialized-view refreshes. ADDED:
-- append_retention_cohorts. The mv_retention_cohorts refresh STAYS — the MV is kept
-- one release so its readers re-point deliberately rather than by breakage.
-- The already-scheduled 'analytics-rollup-daily' cron picks this up on deploy.
create or replace function public.analytics_nightly_maintenance()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.rollup_analytics_daily();
  perform public.rollup_analytics_v2_daily();
  perform public.rollup_intent_atlas_daily();
  perform public.append_retention_cohorts();
  begin
    refresh materialized view concurrently public.mv_retention_cohorts;
  exception when others then null; end;
  begin
    refresh materialized view concurrently research.mv_archetype_clusters;
    refresh materialized view concurrently research.mv_edit_frequency;
  exception when others then null; end;
end;
$$;
revoke all on function public.analytics_nightly_maintenance() from public;
grant execute on function public.analytics_nightly_maintenance() to service_role;

-- ── PART 5 · report_retention() re-targets the durable table ────────────────
-- The RETURN TYPE is deliberately unchanged (`setof public.mv_retention_cohorts`), so
-- this is a CREATE OR REPLACE and not a drop-and-recreate: the grant surface is
-- untouched, no revoke/grant is re-issued, and the admin edge function's dispatch
-- (supabase/functions/admin-actions/index.ts, `retention: "report_retention"`) is
-- byte-unchanged. The release that finally drops the MV owes this function a new
-- return type; that is the one thing keeping the MV alive.
create or replace function public.report_retention()
returns setof public.mv_retention_cohorts
language sql
security definer
set search_path = public, pg_temp
as $$ select cohort_day, day_offset, actors from public.analytics_retention_cohorts order by cohort_day, day_offset $$;

-- ── PART 6 · the monthly prune ──────────────────────────────────────────────
-- Two gates, both FAIL CLOSED, because deletion is irreversible.
create or replace function public.analytics_monthly_prune()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_deleted     integer := 0;
  v_edit_cursor bigint;
  v_snap_cursor bigint;
begin
  -- GATE 1 · the 90-day window is ENABLED BY the durable aggregate and by nothing
  -- else. No aggregate ⇒ the old 400-day window stands, so the shortening can never
  -- outrun the backfill even if this function were somehow called first.
  if exists (select 1 from public.analytics_retention_cohorts) then
    delete from public.analytics_events where created_at < now() - interval '90 days';
  else
    delete from public.analytics_events where created_at < now() - interval '400 days';
  end if;
  get diagnostics v_deleted = row_count;

  delete from public.ingest_rate_buckets where window_start < now() - interval '2 days';

  -- GATE 2 · the research plane: export-then-prune at a 400-day ceiling. A row is
  -- prunable ONLY when the export receipt (038's export_cursors, written by the
  -- analytics-export edge function) covers it. No cursor row ⇒ NULL ⇒ no delete.
  -- Destroying the consented research dataset un-exported would destroy the thing the
  -- consent was FOR, so the absence of a receipt always wins.
  select last_id into v_edit_cursor from public.export_cursors where name = 'research_edits';
  if v_edit_cursor is not null then
    delete from public.edit_events
     where id <= v_edit_cursor
       and created_at < now() - interval '400 days';
  end if;

  select last_id into v_snap_cursor from public.export_cursors where name = 'research_snapshots';
  if v_snap_cursor is not null then
    delete from public.settlement_snapshots
     where consent_tier = 'research'
       and id <= v_snap_cursor
       and created_at < now() - interval '400 days';
  end if;

  return v_deleted;
end;
$$;
revoke all on function public.analytics_monthly_prune() from public;
grant execute on function public.analytics_monthly_prune() to service_role;

-- @rollback: Forward-fix first. This migration is PARTLY reversible, and the halves
--   are very different:
--   REVERSIBLE — the shape and the wiring. `drop function if exists
--     public.append_retention_cohorts(date);` and re-applying 039's
--     analytics_monthly_prune body plus 134's analytics_nightly_maintenance body and
--     038's report_retention body restores the pre-198 behaviour exactly; the new
--     table can be left in place (nothing else reads it) or dropped once no reader
--     remains. No grant is widened by any of that: every function keeps
--     service_role-only EXECUTE and RLS stays on for the new table.
--   NOT REVERSIBLE — the deletions. Once a run has pruned analytics_events to 90 days
--     or pruned an exported research row past the 400-day ceiling, those rows are
--     gone; re-lengthening the interval cannot bring them back. The retention cohort
--     curves survive that by construction, which is the entire point of PART 1/2.
--   ⚠ Rolling the SHAPE back while leaving the shortened window in place is the one
--   combination that loses data silently — it would re-establish the destructive
--   full-refresh cohort recompute over a 90-day raw window. Roll back BOTH or NEITHER.
--   The retention numbers are chair-signed (§402 C2) — roll back only on owner
--   direction.
--   PII SURFACE, named because the contract's regex reads this file: the only listed
--   tables this migration touches are public.analytics_device_links and
--   public.analytics_identity_links, and it only READS them (the cohort-day source in
--   PART 3). It writes to neither, and no compliance store — consent_change_records,
--   money_events, ai_usage_events — is read, written, or deleted by any statement here.
