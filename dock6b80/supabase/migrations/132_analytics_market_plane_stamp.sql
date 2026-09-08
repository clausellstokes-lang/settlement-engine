-- ────────────────────────────────────────────────────────────────────────────
-- 132_analytics_market_plane_stamp.sql — persist the market-insights consent plane
-- opt-in + the provenance corpus stamp on analytics_events, so the sellable rollups
-- (133) can FILTER on them (DESIGN_ANALYTICS_V2.md §4/§5).
--
-- WHY THIS EXISTS (the seam A1 opened, A2 closes on the read side)
--   Wave A1 stamps every ingest ENVELOPE with `market` (the plane-3 opt-in, §5) and
--   `corpus` ('production' | 'dogfood' | 'synthetic', PHASE6_DATA_LIFECYCLE §1) on the
--   CLIENT (src/lib/analyticsFlush.js buildEnvelope). But nothing persisted them
--   server-side — the ingest fn dropped both — so there was no row-level surface for
--   the market rollups to filter on. This migration adds that surface; the companion
--   ingest change (supabase/functions/ingest-events/index.ts) writes it per event row.
--
-- FAIL-CLOSED DEFAULTS (§4: "being a user does not put you in the sellable aggregate")
--   - market_opt_in DEFAULT false  → every legacy row, and every row whose actor did
--     not opt in, is structurally EXCLUDED from the sellable corpus.
--   - corpus NULL for legacy rows   → the market rollups require corpus = 'production'
--     explicitly, so unknown-provenance rows (and dogfood/synthetic) never sell.
--
-- ENDOGENEITY (§7): these columns are READ-ONLY analytics provenance. Nothing here
-- feeds back into any running world; the sim goldens are untouched (telemetry-only).
--
-- House pattern: additive only (a migration adds columns, never mutates semantics —
-- §2). analytics_events already has RLS on + zero policies (036); the only writer is
-- the service-role ingest fn. Re-runnable (IF NOT EXISTS).
-- ────────────────────────────────────────────────────────────────────────────

alter table public.analytics_events
  -- Provenance corpus: which data source this row came from. NULL = legacy/unknown
  -- (excluded from the sellable corpus by construction). 'dogfood' = owner/elevated
  -- usage; 'synthetic' = deterministic sweeps / e2e; 'production' = real users — the
  -- ONLY value the market rollups admit.
  add column if not exists corpus text
    check (corpus is null or corpus in ('production', 'dogfood', 'synthetic')),
  -- Market-insights consent plane (§5, plane 3): did this actor opt IN to the
  -- anonymous, aggregate, k-anonymous market pack? Off by default (fail-closed).
  add column if not exists market_opt_in boolean not null default false;

-- The sellable corpus is a tiny, specific slice (opted-in production rows). A PARTIAL
-- index keeps the market rollups cheap without bloating the hot analytics insert path
-- (the vast majority of rows have market_opt_in = false and never enter this index).
create index if not exists analytics_events_market_corpus
  on public.analytics_events (event, created_at)
  where market_opt_in = true and corpus = 'production';
