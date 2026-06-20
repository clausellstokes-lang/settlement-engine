-- Settlement Generator — Migration 049
-- Feature D / R1: the `deities` custom-content bucket.
--
-- A homebrew deity is authored content (three frozen tag axes: alignment ·
-- temperament · rank) that stays INERT until a DM assigns it as a settlement's
-- primary deity. Authoring reuses the existing `custom_content` table verbatim
-- — there is NO new table and NO server-side tier predicate beyond the one
-- already inherited from 017 (D.0: the simulation is the premium gate; a free
-- user who POSTs a god can never advance time to make it act).
--
-- This migration does two things, both idempotent / guarded:
--   1. Widen `custom_content_category_check` to admit `deities` — AND backfill
--      the three categories that drifted into the application (`services`,
--      `factions`, `supplyChains`) but were never added to the DB CHECK. Until
--      now a premium user authoring any of those four would be HARD-REJECTED by
--      the CHECK. This is the documented three-way bucket drift.
--   2. Add a CHECK that, FOR deity rows ONLY, pins the three axes to their
--      frozen enums — mirroring validateDeity() / customContentSchema.js exactly
--      so a malformed deity can never persist. Non-deity rows are unaffected.
--
-- RLS: owner-scoped read/write + premium write gate are inherited unchanged from
-- 004 + 017 (they are table-level, category-agnostic) — no new policy needed.

-- 1. Widen the category CHECK (drop + re-add; the only safe way to extend a
--    named CHECK in Postgres). Guarded so a re-run is a no-op.
ALTER TABLE public.custom_content
  DROP CONSTRAINT IF EXISTS custom_content_category_check;

ALTER TABLE public.custom_content
  ADD CONSTRAINT custom_content_category_check
    CHECK (category IN (
      'institutions',
      'services',        -- backfilled (drifted: present in app, absent from 004 CHECK)
      'resources',
      'stressors',
      'tradeGoods',
      'factions',        -- backfilled
      'deities',         -- NEW (Feature D / R1)
      'supplyChains',    -- backfilled
      'tradeRoutes',
      'powerPresets',
      'defensePresets'
    ));

-- 2. Axis enums for deity rows only. The three axes mirror DEITY_ALIGNMENT_KEYS /
--    DEITY_TEMPER_KEYS / DEITY_TIER_KEYS in src/domain/customContentSchema.js.
--    The predicate is short-circuited to TRUE for every non-deity category, so
--    this constraint touches nothing else in the table.
ALTER TABLE public.custom_content
  DROP CONSTRAINT IF EXISTS custom_content_deity_axes_check;

-- NOTE the explicit NOT-NULL guards: `NULL IN (...)` yields NULL (unknown), and
-- a CHECK passes on unknown — so without these a deity row with a MISSING axis
-- would silently slip past. validateDeity() requires all three axes, so the DB
-- must too. The `IS NOT NULL` makes a missing axis a hard FALSE → rejected.
ALTER TABLE public.custom_content
  ADD CONSTRAINT custom_content_deity_axes_check
    CHECK (
      category <> 'deities'
      OR (
        (data->>'alignmentAxis')   IS NOT NULL AND (data->>'alignmentAxis')   IN ('good', 'evil', 'neutral')
        AND (data->>'temperamentAxis') IS NOT NULL AND (data->>'temperamentAxis') IN ('warlike', 'peacelike', 'neutral')
        AND (data->>'rankAxis')        IS NOT NULL AND (data->>'rankAxis')        IN ('major', 'minor', 'cult')
      )
    );

COMMENT ON CONSTRAINT custom_content_deity_axes_check ON public.custom_content IS
  'Feature D / R1: deity rows must carry valid alignment/temperament/rank axes. Mirrors validateDeity() and customContentSchema.js. Non-deity rows unaffected.';
