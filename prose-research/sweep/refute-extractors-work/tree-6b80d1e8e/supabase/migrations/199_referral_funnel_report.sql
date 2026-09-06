-- ────────────────────────────────────────────────────────────────────────────
-- 199_referral_funnel_report.sql — the READ half of the referral funnel
-- (WEB-3, §359.8; charter ruled at ODQ §402, chair question C5 SIGNED).
--
-- OPERATOR NOTE
--   ONE read-only report function. No table, no column, no policy, no trigger,
--   no data touched. Nothing here writes anywhere, and nothing here is on the
--   money path: the referral lifecycle's only writers remain 107's RPCs and the
--   Stripe webhook that calls them, exactly as before this file existed.
--
-- WHY A REPORT FUNCTION AND NOT AN ANALYTICS EVENT (the ruled shape)
--   The client half of WEB-3 emits two funnel events (referral_intent_recorded,
--   redeem_code_checked). The CONVERSION half deliberately emits nothing. A
--   webhook-side `referral_converted` event was considered and REFUSED: it would
--   mint a second, weaker record of a money fact and put an analytics write on
--   the money path. public.referrals already holds the money-grade truth —
--   written idempotently, claim-once, replay-safe (107) — so the admin read
--   layer aggregates THAT rather than shadowing it. Single-writer money truth.
--
-- POSTURE (mirrors the 041/042 report family, which this joins)
--   * SECURITY DEFINER with `set search_path = public, pg_temp` (pg_temp LAST —
--     the 094/111/131 convention; tests/lint/migrationSearchPathPin.test.js is
--     the ratchet).
--   * REVOKE ALL from public, GRANT EXECUTE to service_role ONLY. The only
--     caller is the admin-actions edge function's privilege-gated admin client
--     (`get_referral_funnel`); anon and authenticated cannot reach it over
--     PostgREST. Named `report_*`, not `service_*`: the service_* family is a
--     mutation family pinned by exact equality in
--     tests/lint/migrationGrantPosturePin.test.js, and this function mutates
--     nothing.
--   * NO identity in the output. The function returns per-day COUNTS only —
--     never a user id, never an account number, never an invoice id. The funnel
--     an operator can read is the same shape the client events carry: structure,
--     never content.
--
-- Depends on: 107 (public.referrals and its created_at / granted_at /
--             clawed_back_at stamps).
-- @rollback: `drop function if exists public.report_referral_funnel(date, date);`
--            — cleanly and completely reversible, because this migration adds a
--            read-only function and NOTHING else: no schema shape changes, no
--            rows are written or altered, and no other object depends on it. The
--            only consequence of the drop is that the admin funnel card reports
--            its error and every other panel keeps working (the panel's requests
--            are allSettled). It is named here rather than shipped as a
--            .down.sql because it is a single statement; public.referrals is a
--            MONEY_PII_TABLES member, so this annotation is mandatory
--            (tests/docs/migrationRollbackDiscipline.test.js) and it is
--            documented-manual-reversal, not forward-only.
-- ────────────────────────────────────────────────────────────────────────────

-- report_referral_funnel — the three referral lifecycle moments, per day.
--   intents_recorded   — a referee named a referrer (107's record_referral_intent)
--   referrals_granted  — the first REAL payment claimed the reward (grant_referral)
--   referrals_clawed_back — a refund/dispute reversed it (clawback_referral)
-- One row per day on which ANY of the three happened; the three columns are
-- counted from three different timestamps, so a single referral contributes to
-- different days as it moves through its lifecycle. That is the point: the
-- intent→grant LAG is the funnel's most interesting number and a single
-- group-by on created_at would hide it.
create or replace function public.report_referral_funnel(
  p_from date default (current_date - 30),
  p_to   date default current_date
) returns table(bucket date, intents_recorded bigint, referrals_granted bigint, referrals_clawed_back bigint)
language sql security definer set search_path = public, pg_temp as $$
  with moments as (
    select created_at::date as d, 1 as recorded, 0 as granted, 0 as clawed
      from public.referrals
     where created_at >= p_from and created_at < (p_to + 1)
    union all
    select granted_at::date, 0, 1, 0
      from public.referrals
     where granted_at is not null
       and granted_at >= p_from and granted_at < (p_to + 1)
    union all
    select clawed_back_at::date, 0, 0, 1
      from public.referrals
     where clawed_back_at is not null
       and clawed_back_at >= p_from and clawed_back_at < (p_to + 1)
  )
  select d,
         sum(recorded)::bigint,
         sum(granted)::bigint,
         sum(clawed)::bigint
    from moments
   group by d
   order by d;
$$;

comment on function public.report_referral_funnel(date, date) is
  'WEB-3 read-only referral funnel: per-day intent / grant / clawback counts derived from public.referrals itself. Adds no writer to the money path and returns no identity. service_role only.';

revoke all on function public.report_referral_funnel(date, date) from public;
grant execute on function public.report_referral_funnel(date, date) to service_role;
