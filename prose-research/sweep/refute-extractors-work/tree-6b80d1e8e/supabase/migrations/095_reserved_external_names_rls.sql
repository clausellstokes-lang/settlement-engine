-- 095_reserved_external_names_rls.sql
--
-- Close the one deny-by-default gap in the schema: reserved_external_names.
--
-- 075 created public.reserved_external_names (the reserved-word + best-effort
-- profanity blocklist for external display names) WITHOUT enabling RLS, so it was
-- the only table in the security surface directly SELECT-able by any authenticated
-- user. It is not a money or PII boundary, but the deny-by-default spine should be
-- uniform, and the blocklist (incl. the profanity list) need not be world-readable.
--
-- Safe to lock down: the ONLY reader is public.update_external_name (075), a
-- SECURITY DEFINER function that runs as the owner and therefore BYPASSES RLS; the
-- validation path keeps working unchanged. There are ZERO client-side reads of this
-- table (verified across src/). So we enable RLS with NO policy (deny-all to anon /
-- authenticated) and REVOKE table privileges — the strongest posture, matching how
-- 066's security_answers and the ai_spend_reservations table are locked.
--
-- Idempotent + re-runnable: enable-RLS and revoke are both no-ops on re-apply.
-- Creates no new object; alters no function body (net-current lineage untouched).

alter table public.reserved_external_names enable row level security;

-- No policy is created on purpose: with RLS on and no policy, anon/authenticated get
-- deny-by-default. The SECURITY DEFINER reader bypasses RLS, so validation is intact.
revoke all on table public.reserved_external_names from anon, authenticated;
