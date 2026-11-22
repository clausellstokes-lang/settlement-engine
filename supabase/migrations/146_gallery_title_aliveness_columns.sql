-- ────────────────────────────────────────────────────────────────────────────
-- 146_gallery_title_aliveness_columns.sql — the GALLERY-2 phase-2 columns:
-- a sharer-editable gallery title + the publish-time ALIVENESS snapshot
-- (owner-signed 2026-07-17). Column adds only; the tile-rows/list-RPC chain
-- that SURFACES them is migration 148 (the 063→071 drop-recreate precedent),
-- and the map/campaign tile projection is 149.
--
-- gallery_title (settlements)
--   Nullable display-title override for the PUBLIC gallery presentation.
--   Falls back to settlements.name — the fallback is applied at ONE chokepoint,
--   `coalesce(nullif(btrim(gallery_title), ''), name)` inside the 148 tile-rows
--   helper, so every consumer (list, dossier, more-by-creator, my-settlements,
--   OG prerender, search) inherits it without per-surface fallback code.
--   Written ONLY through the sharer edit lane (updateGalleryMetadata →
--   galleryMetadataPatch, owner-RLS-gated) — sanitized like the blurb
--   (sanitizeGalleryHtml) then reduced to plain bounded text (tags stripped,
--   120 chars): a title is a NAME, not rich text.
--
-- gallery_facet_aliveness (settlements + saved_maps)
--   The 0–100 aliveness score, SNAPSHOTTED AT PUBLISH exactly as
--   gallery_facet_at_war is (063 §"cannot be backfilled"): it derives from the
--   owning campaign's LIVE worldState (pulseHistory depth + world age band —
--   formula in src/lib/galleryAliveness.js), which the gallery row cannot
--   recompute. NULL = shared before the score existed (or no owning campaign);
--   the owner re-shares to stamp it. No backfill, mirroring at_war.
--     • settlements: written client-side under owner RLS via
--       galleryMetadataPatch (the at_war Path-A precedent).
--     • saved_maps: stamped server-side by publish_map from the p_facets bag
--       with coalesce(new, current) preservation (the 088 Path-B precedent;
--       publish_map gains the unpack/stamp lines in 149).
--
-- gallery_facet_world_age (saved_maps)
--   The campaign's age-band id at publish (this-week | this-month | this-season
--   | this-year | years-past — domain/ageBands.js), for the Campaigns-tab card
--   ("world age"). Same snapshot/preservation posture as the other 088 facets.
--
-- OPERATOR
--   • Apply via `supabase db push` — rides the end-of-cycle deploy batch.
--     Additive + idempotent (add column if not exists); no data writes.
--   • Rollback: alter table ... drop column if exists <col> (each column is
--     independent; 148/149 must be rolled back first if already applied).
-- ────────────────────────────────────────────────────────────────────────────

alter table public.settlements
  add column if not exists gallery_title text,
  add column if not exists gallery_facet_aliveness integer;

-- Bound the stored score to its contract (NULL stays allowed — "unknown").
alter table public.settlements
  drop constraint if exists settlements_gallery_facet_aliveness_range,
  add constraint settlements_gallery_facet_aliveness_range
    check (gallery_facet_aliveness is null
           or (gallery_facet_aliveness >= 0 and gallery_facet_aliveness <= 100));

-- A title is a short plain-text name; the client clamps to 120 chars — the DB
-- bound is defense in depth (4x slack, never a second source of truth).
alter table public.settlements
  drop constraint if exists settlements_gallery_title_length,
  add constraint settlements_gallery_title_length
    check (gallery_title is null or char_length(gallery_title) <= 480);

alter table public.saved_maps
  add column if not exists gallery_facet_aliveness integer,
  add column if not exists gallery_facet_world_age text;

alter table public.saved_maps
  drop constraint if exists saved_maps_gallery_facet_aliveness_range,
  add constraint saved_maps_gallery_facet_aliveness_range
    check (gallery_facet_aliveness is null
           or (gallery_facet_aliveness >= 0 and gallery_facet_aliveness <= 100));

-- The world-age facet is a bounded vocabulary (domain/ageBands.js AGE_BAND_IDS).
alter table public.saved_maps
  drop constraint if exists saved_maps_gallery_facet_world_age_vocab,
  add constraint saved_maps_gallery_facet_world_age_vocab
    check (gallery_facet_world_age is null or gallery_facet_world_age in (
      'this-week', 'this-month', 'this-season', 'this-year', 'years-past'
    ));
