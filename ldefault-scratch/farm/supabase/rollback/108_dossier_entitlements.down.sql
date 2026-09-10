-- 108_dossier_entitlements.down.sql — reversal for 108 (durable dossier export rights).
--
-- Function bodies only, per the runbook: dropping the four RPCs disables every
-- grant/clawback/claim path (the two tables have no client write policies, so
-- with the RPCs gone nothing can move value). The two tables are deliberately NOT
-- dropped — dossier_entitlements holds durable rights users paid for, and
-- single_dossier_purchases holds the same-device token-claim ledger the webhook
-- keeps writing; removing either is a data migration, forward-fix only.
--
-- Run by hand during an incident:
--   psql "$DATABASE_URL" -f supabase/rollback/108_dossier_entitlements.down.sql

drop function if exists public.grant_dossier_entitlement(uuid, uuid, text, text);
drop function if exists public.clawback_dossier_entitlement(text);
drop function if exists public.has_dossier_entitlement(uuid);
drop function if exists public.claim_dossier_purchase_by_session(text, uuid, uuid);
