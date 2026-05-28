-- ────────────────────────────────────────────────────────────────────────────
-- 016_version_history.sql — Persist per-settlement edit snapshots.
--
-- P133 / E-5: a worldbuilder running a 6-month arc wants to see what
-- changed between session 3 and session 8, and roll back if a player
-- retconned themselves out of an event. The client already builds the
-- timeline view (VersionsTab.jsx); this migration gives it a durable
-- home so snapshots survive page reload + device switch.
--
-- Shape:
--   We add a single nullable jsonb column `version_history` to the
--   existing `settlements` table — no new table. Rationale:
--     • Settlements are already row-per-save; snapshots ride with
--       them and inherit the same RLS policies (owner-only).
--     • Average snapshot size is small (~5-30 kB) and we cap the
--       array length client-side. A separate table would add a join
--       on every settlement read for no schema-clarity win.
--     • The column is jsonb (not json) so future queries can index
--       into snapshot.kind etc. without a per-row parse.
--
-- Each snapshot inside the array follows the shape:
--   {
--     id:         text,    -- snap_<ts>_<random>
--     ts:         bigint,  -- ms epoch
--     kind:       text,    -- 'manual' | 'auto-commit' | 'pre-revert' | 'canonize'
--     label:      text,    -- short user-facing label
--     settlement: jsonb    -- frozen copy of the settlement at that ts
--   }
--
-- Migration is re-runnable: ADD COLUMN IF NOT EXISTS, no destructive
-- defaults. Existing rows get NULL until the first snapshot writes.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.settlements
  add column if not exists version_history jsonb;

comment on column public.settlements.version_history is
  'P133 / E-5: array of snapshots {id, ts, kind, label, settlement} for the version timeline. NULL until the first snapshot writes. Capped at 50 entries client-side to bound row size.';

-- Optional index on (user_id, updated_at) is already present from
-- migration 001; no new index needed — version_history is read
-- alongside the settlement row, never queried in isolation.
