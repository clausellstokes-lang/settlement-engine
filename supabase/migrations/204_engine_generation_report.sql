-- ────────────────────────────────────────────────────────────────────────────
-- AMENDED BEFORE FIRST APPLY by the pre-deploy review of 2026-11-10 (finding 8):
--   `revoke … from public` alone leaves a hosted project's default EXECUTE grants
--   to anon and authenticated standing; the two roles are now revoked by name
--   (migration 113's idiom). Pinned: tests/security/engineGenerationReport.pglite.test.js.
-- ────────────────────────────────────────────────────────────────────────────
-- 204_engine_generation_report.sql — the READ half of the engine service's cost
-- log (ENGINE-5 unit 4; docs/DESIGN_ENGINE_SERVICE.md "Every call logged with its
-- cost; a daily total on the admin analytics panel").
--
-- OPERATOR NOTE
--   ONE read-only report function. No table, no column, no policy, no trigger,
--   no data touched. The cost log's only writer is the engine-generate edge
--   function, which inserts one `engine_generate` row into public.analytics_events
--   per metered call (generate / derive / regenSection); this file reads those
--   rows and writes nothing.
--
-- WHAT IT ANSWERS
--   Generations TODAY and THIS MONTH, by op and outcome — the admin analytics
--   panel's one line (src/components/admin/AdminAnalyticsPanel.jsx ::
--   EngineGenerationsLine), reached through admin-actions'
--   get_analytics_dashboard `engine_generations`. "Today" and "this month" are
--   date_trunc('day' | 'month', now()) in the database's time zone (UTC on
--   Supabase). The month window is inside the 90-day raw-event retention (198).
--
-- POSTURE (mirrors 199 and the 041/042 report family, which this joins)
--   * SECURITY DEFINER with `set search_path = public, pg_temp` (pg_temp LAST —
--     the 094/111/131 convention; tests/lint/migrationSearchPathPin.test.js is
--     the ratchet).
--   * REVOKE ALL from public, GRANT EXECUTE to service_role ONLY. The only
--     caller is the admin-actions edge function's privilege-gated admin client.
--     Named `report_*`, not `service_*`: it mutates nothing.
--   * NO identity in the output: counts per (op, outcome) only — never the
--     props' caller_hash, never an account, never an IP (which the log never
--     stores in the first place).
--   * Takes no argument: the two windows are fixed relative to now(), which is
--     what the line shows. admin-actions calls it with no arguments, as it calls
--     report_retention.
--
-- Depends on: 036 (public.analytics_events and its (event, created_at) index).
-- @rollback: `drop function if exists public.report_engine_generations();`
--            — cleanly and completely reversible: this migration adds a
--            read-only function and NOTHING else, no rows are written or
--            altered, and no other object depends on it. After the drop the
--            panel's engine line reports its error and every other dashboard
--            keeps working.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.report_engine_generations()
returns table(op text, outcome text, generations_today bigint, generations_month bigint)
language sql security definer set search_path = public, pg_temp as $$
  select coalesce(props->>'op', 'generate')      as op,
         coalesce(props->>'outcome', 'unknown')  as outcome,
         (count(*) filter (where created_at >= date_trunc('day', now())))::bigint as generations_today,
         count(*)::bigint                                                         as generations_month
    from public.analytics_events
   where event = 'engine_generate'
     and created_at >= date_trunc('month', now())
   group by 1, 2
   order by 1, 2;
$$;

comment on function public.report_engine_generations() is
  'ENGINE-5 read-only engine service cost line: engine_generate rows today and this month, by op and outcome, from public.analytics_events. Returns no identity. service_role only.';

revoke all on function public.report_engine_generations() from public;
revoke all on function public.report_engine_generations() from anon, authenticated;
grant execute on function public.report_engine_generations() to service_role;
