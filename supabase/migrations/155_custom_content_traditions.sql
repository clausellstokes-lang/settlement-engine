-- Settlement Generator — Migration 155
-- THE TRADITIONS wave (Engine Lift #4, slice T-5): the `traditions` custom-content bucket.
--
-- A declared tradition is authored content — a NAME plus an OPTIONAL typed motif
-- (element × act) — that stays INERT until the traditions layer lights
-- (traditionsEnabled at THE ONE REGEN), at which point a declared tradition can claim a
-- genesis slot (declared-over-derived, DESIGN_TRADITIONS §11). Authoring reuses the
-- existing `custom_content` table verbatim — NO new table, NO new server-side gate beyond
-- the simulation-is-premium gate inherited from 017.
--
-- ⚠ WRITTEN, NOT DEPLOYED. This migration is committed but must NOT be pushed until the
-- very-end deploy batch (the traditions layer ships DARK). Omitting it would HARD-REJECT a
-- cloud write of a `traditions` row (the category CHECK), so it must ship before the layer
-- lights — but it is a no-op against the live schema until `supabase db push`. Do NOT bump
-- supabase/applied-head.json until it is actually pushed (the migration-head gate's PENDING
-- warning is the expected, non-fatal state meanwhile).
--
-- This migration does ONE thing (idempotent / guarded): widen
-- `custom_content_category_check` to admit `traditions`, preserving the existing 11
-- categories verbatim. The motif fields are OPTIONAL and validated client-side
-- (validateTradition / customContentSchema.js) + at the S4 schema wall — a bare-name
-- tradition is valid — so NO per-row axis CHECK is added (unlike deities' 049/056).
--
-- RLS: owner-scoped read/write + premium write gate are inherited unchanged from 004 + 017
-- (table-level, category-agnostic) — no new policy needed.

-- Widen the category CHECK (drop + re-add; the only safe way to extend a named CHECK in
-- Postgres). Guarded so a re-run is a no-op. The full valid set is preserved — this is not
-- a delta.
ALTER TABLE public.custom_content
  DROP CONSTRAINT IF EXISTS custom_content_category_check;

ALTER TABLE public.custom_content
  ADD CONSTRAINT custom_content_category_check
    CHECK (category IN (
      'institutions',
      'services',
      'resources',
      'stressors',
      'tradeGoods',
      'factions',
      'deities',
      'traditions',      -- NEW (THE TRADITIONS wave / T-5)
      'supplyChains',
      'tradeRoutes',
      'powerPresets',
      'defensePresets'
    ));

COMMENT ON CONSTRAINT custom_content_category_check ON public.custom_content IS
  'Valid custom-content bucket categories. Widened in 155 to admit traditions (THE TRADITIONS wave / T-5). Mirrors customContentSlice EMPTY + contentVocabulary CONTENT_BUCKETS.';
