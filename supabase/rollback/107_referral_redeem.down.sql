-- 107_referral_redeem.down.sql — reversal for 107 (referral + redeem codes).
--
-- Function bodies only, per the runbook: dropping the nine RPCs disables every
-- referral/redemption write path (the tables have no client write policies, so
-- with the RPCs gone nothing can move). The four tables are deliberately NOT
-- dropped — redemptions/referrals hold value-bearing audit rows and
-- processed_webhook_events holds idempotency claims the webhook may re-check;
-- removing them is a data migration, forward-fix only.
--
-- Run by hand during an incident:
--   psql "$DATABASE_URL" -f supabase/rollback/107_referral_redeem.down.sql

drop function if exists public.record_referral_intent(text);
drop function if exists public.grant_referral(uuid, text, integer);
drop function if exists public.record_referral_grant_detail(uuid, text, text, text);
drop function if exists public.clawback_referral(text);
drop function if exists public.validate_redeem_code(text);
drop function if exists public.reserve_redemption(text, uuid);
drop function if exists public.bind_redemption_session(uuid, text);
drop function if exists public.apply_redemption(text);
drop function if exists public.revert_redemption(text);
