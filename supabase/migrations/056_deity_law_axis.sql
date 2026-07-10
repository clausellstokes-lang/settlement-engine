-- Settlement Generator — Migration 056
-- Feature D / B5: the 4th deity axis — `lawAxis` (lawful / chaotic / neutral).
--
-- B0 added the `law_order` causal variable; B5 adds the deity's 4th authoring
-- axis, which couples INTO it (a lawful patron raises law_order, a chaotic one
-- lowers it and makes corruption more tolerated — a lever DISTINCT from the
-- good/evil corruption knobs). This migration widens the deity-axes CHECK that
-- 049 established to also validate `lawAxis`, mirroring validateDeity() in
-- src/domain/customContentSchema.js exactly.
--
-- BACK-COMPAT (the key difference from the other three axes): a deity authored
-- BEFORE B5 carries NO `lawAxis` at all. That absence must be TOLERATED — read as
-- `neutral` — so legacy deity content never hard-rejects on the next write. So,
-- UNLIKE the alignment/temperament/rank guards (which are `IS NOT NULL` → a
-- missing axis is rejected), the lawAxis guard ADMITS NULL/absent and only
-- rejects a PRESENT-but-invalid value. This is exactly validateDeity's
-- `lawAxis != null && !DEITY_LAW_KEYS.includes(...)` rule.
--
-- Idempotent / guarded (drop + re-add — the only safe way to extend a named
-- CHECK in Postgres). Re-run is a no-op. No RLS change (inherited from 004/017).

ALTER TABLE public.custom_content
  DROP CONSTRAINT IF EXISTS custom_content_deity_axes_check;

ALTER TABLE public.custom_content
  ADD CONSTRAINT custom_content_deity_axes_check
    CHECK (
      category <> 'deities'
      OR (
        (data->>'alignmentAxis')   IS NOT NULL AND (data->>'alignmentAxis')   IN ('good', 'evil', 'neutral')
        AND (data->>'temperamentAxis') IS NOT NULL AND (data->>'temperamentAxis') IN ('warlike', 'peacelike', 'neutral')
        AND (data->>'rankAxis')        IS NOT NULL AND (data->>'rankAxis')        IN ('major', 'minor', 'cult')
        -- lawAxis (B5): TOLERANT — a legacy 3-axis deity has no lawAxis ⇒
        -- (data->>'lawAxis') IS NULL ⇒ this disjunct's first branch is TRUE ⇒
        -- admitted. A PRESENT value must be one of the frozen enums, else FALSE.
        AND ((data->>'lawAxis') IS NULL OR (data->>'lawAxis') IN ('lawful', 'chaotic', 'neutral'))
      )
    );

COMMENT ON CONSTRAINT custom_content_deity_axes_check ON public.custom_content IS
  'Feature D / R1 + B5: deity rows must carry valid alignment/temperament/rank axes; lawAxis (B5) is tolerated absent (legacy 3-axis ⇒ neutral) but a present value must be lawful/chaotic/neutral. Mirrors validateDeity() and customContentSchema.js. Non-deity rows unaffected.';
