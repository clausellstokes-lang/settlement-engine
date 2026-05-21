-- ────────────────────────────────────────────────────────────────────────────
-- 013_settlements_campaign_state.sql — Add the campaign_state column.
--
-- The client (src/lib/saves.js line 65) has been requesting / writing a
-- `campaign_state` JSONB column on the settlements table since the
-- campaign-state lifecycle work landed, but the column was never added
-- by a migration. Result: every save attempt errors with
--   "Could not find the 'campaign_state' column of 'settlements'
--    in the schema cache"
--
-- This migration adds the column as nullable JSONB. The client treats
-- NULL as "no canon yet" (line 123: `campaignState: row.campaign_state
-- || null`), so existing rows continue to round-trip cleanly.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.settlements
  add column if not exists campaign_state jsonb;

comment on column public.settlements.campaign_state is
  'Per-settlement campaign lifecycle state: phase (draft / preplay / canon), event timeline, derived system state, contradictions snapshot. NULL when the settlement has not been promoted past draft. Owned by the row owner; same RLS policies as the rest of the table.';

-- The existing settlements RLS policies (migration 001) already cover
-- the new column — they grant the owner full access and the public
-- gallery policy (migration 008) only exposes is_public=true rows
-- with a narrow column projection that doesn't include campaign_state.
-- Nothing else to do.
