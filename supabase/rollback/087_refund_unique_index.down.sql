-- PARTIAL reversal of migration 087 (review_money_hardening) — the DATA-SAFE part only.
--
-- 087 does several things; this reverses ONLY the schema-additive unique index, which
-- is safe to drop (it touches no rows). Run by hand if that index is wrongly rejecting
-- a legitimate refund insert.
--
--   drops: ux_credit_ledger_one_refund_per_spend (the partial unique index that
--          backstops one refund grant per spend). After this, the refund_credits
--          FOR UPDATE serialization is the ONLY duplicate-refund guard — do NOT leave
--          it dropped; re-apply 087's index (or a forward fix) promptly.
--
-- NOT reversed here (deliberately — see supabase/rollback/README.md):
--   • the pre-dedup that DELETED duplicate refund grant rows — irreversible by script
--     (restore from a point-in-time backup if needed);
--   • the column-pinned profiles self-update RLS policy — reversing it re-opens the
--     stripe_subscription_id forge hole; reverse per-column, reviewed, only if forced;
--   • the DROP of check_ai_spend_cap — recreate from 086's body if you must.

drop index if exists public.ux_credit_ledger_one_refund_per_spend;
