-- 100_revoke_analytics_views_from_api.sql
--
-- Close the API-side read grants on 038's analytics dashboard views/MV.
--
-- WHY
--   038 created the dashboard rollup views (v_funnel_first_gen,
--   v_settlement_preferences, v_edit_heatmap, v_ai_usage) and the retention MV
--   (mv_retention_cohorts) in the API-EXPOSED `public` schema. Supabase's default
--   privileges grant SELECT on new `public` tables/views to `anon` and
--   `authenticated`, and a plain view executes with its OWNER's rights — so any
--   signed-out visitor could `GET /rest/v1/v_funnel_first_gen` and read
--   product-wide funnel/usage/retention aggregates, bypassing the RLS on the
--   underlying analytics_events / settlement_snapshots / edit_events tables
--   entirely. 038's header says the views "are reached only through [the
--   report_* functions] or via service-role", but nothing ever revoked the
--   default grants, so that intent was never enforced.
--
-- WHAT
--   REVOKE ALL on the five 038 dashboard objects from `public`, `anon`, and
--   `authenticated`. Nothing else changes:
--     - The admin edge function reads these ONLY through the report_*
--       SECURITY DEFINER functions (service-role-execute-only per 038), which
--       run as the view owner and are unaffected by these grants. Verified: no
--       server or client path selects the views directly, so NO service_role
--       grant is needed here — service_role's own default grant is left as-is
--       for ad-hoc operator queries.
--     - The `research.*` MVs (038) live in a non-API-exposed schema and are not
--       touched.
--   Idempotent: REVOKE of an absent privilege is a no-op; safe to re-run.
--
-- @rollback: `grant select on public.v_funnel_first_gen, public.v_settlement_preferences,
--   public.v_edit_heatmap, public.v_ai_usage, public.mv_retention_cohorts to anon, authenticated;`
--   (NOTE: that reinstates the unauthenticated analytics read — rollback only to
--   unblock a broken deploy, then re-close.)

revoke all on table public.v_funnel_first_gen      from public, anon, authenticated;
revoke all on table public.v_settlement_preferences from public, anon, authenticated;
revoke all on table public.v_edit_heatmap          from public, anon, authenticated;
revoke all on table public.v_ai_usage              from public, anon, authenticated;
revoke all on table public.mv_retention_cohorts    from public, anon, authenticated;

comment on view public.v_funnel_first_gen is
  'Dashboard rollup (038). NOT API-readable: SELECT revoked from anon/authenticated (100); reached only via the service-role-only report_funnel().';
comment on view public.v_settlement_preferences is
  'Dashboard rollup (038). NOT API-readable: SELECT revoked from anon/authenticated (100); reached only via the service-role-only report_preferences().';
comment on view public.v_edit_heatmap is
  'Dashboard rollup (038). NOT API-readable: SELECT revoked from anon/authenticated (100); reached only via the service-role-only report_edit_heatmap().';
comment on view public.v_ai_usage is
  'Dashboard rollup (038). NOT API-readable: SELECT revoked from anon/authenticated (100); reached only via the service-role-only report_ai_usage().';
comment on materialized view public.mv_retention_cohorts is
  'Retention cohort MV (038, refreshed nightly). NOT API-readable: SELECT revoked from anon/authenticated (100); reached only via the service-role-only report_retention().';
