-- 006_ai_data.sql
-- AI narrative, daily-life prose, and progression chronicle storage.
--
-- Single JSONB column holds all AI-related state for a settlement. Using one
-- column (rather than one per feature) lets us evolve the AI data shape in
-- AI-2..5 (chronicle population, pinned NPCs, progression metadata) without
-- further schema migrations. The blob shape is owned by the application layer
-- and defaults to `{}` for existing rows.
--
-- Shape (as of AI-1):
--   {
--     aiSettlement:         object | null,  // refined narrative
--     aiDailyLife:          object | null,  // daily-life prose
--     narrativeMode:        'raw' | 'narrated',
--     narrativeGeneratedAt: ISO8601 string | null,
--     chronicle:            [],             // populated in AI-3+
--     pinnedNpcs:           []              // populated in AI-4+
--   }

ALTER TABLE settlements
  ADD COLUMN IF NOT EXISTS ai_data JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN settlements.ai_data IS
  'AI-generated narrative state: { aiSettlement, aiDailyLife, narrativeMode, narrativeGeneratedAt, chronicle[], pinnedNpcs[] }';

-- Index for queries that filter on narrativeMode (e.g. "show me my narrated settlements").
-- GIN is the right choice for JSONB; cost is small for a per-user column.
CREATE INDEX IF NOT EXISTS settlements_ai_data_gin_idx
  ON settlements USING gin (ai_data jsonb_path_ops);
