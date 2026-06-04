-- ────────────────────────────────────────────────────────────────────────────
-- 010_founder_seat_counter.sql - Tier 7.6 public seat counter.
--
-- The pricing page advertises "X of 500 seats remaining" for the Founder
-- Lifetime tier. The copy string has lived in src/copy/en.js since Phase
-- 0.2 but had no live count source - it was a stub. This migration ships
-- the SECURITY DEFINER RPC that returns the current taken-seat count so
-- the pricing page can swap the {remaining} placeholder for a real
-- number.
--
-- Why an RPC instead of a direct table query:
--   - The profiles table RLS hides rows from other users. A
--     `select count(*) from profiles where is_founder` would either
--     fail the policy or return 0 (depending on PostgREST behaviour).
--   - SECURITY DEFINER lets us count without exposing any other column.
--   - One trip per page load is cheap; we don't need a materialized
--     view yet. If 500 seats churn into 50,000, revisit.
--
-- Re-runnable: every change uses CREATE OR REPLACE.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.founder_seats_taken()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::int
  from public.profiles
  where is_founder is true;
$$;

comment on function public.founder_seats_taken() is
  'Returns the count of profiles with is_founder=true. Public-callable; reveals only the aggregate count, no other column.';

-- Grant execute to anon + authenticated so the pricing page can read
-- it without a logged-in session.
grant execute on function public.founder_seats_taken() to anon, authenticated;
