-- ────────────────────────────────────────────────────────────────────────────
-- 070_settlements_realm_arc_summary.sql — add the public-safe realm-arc digest
-- column the share write path already targets.
--
-- ROOT CAUSE: src/lib/gallery.js writes patch.gallery_realm_arc_summary (the §S4
-- realm-arc digest — a derived, sanitized scalar; war/pantheon epic, NOT the raw
-- chronicle) into public.settlements on every share/re-share, and sanitizeDossier
-- reads row.gallery_realm_arc_summary back. The column was never added, so the
-- share .update() fails with "Could not find the 'gallery_realm_arc_summary'
-- column of 'settlements' in the schema cache." This adds the missing column.
--
-- Mirrors the established gallery_* owner-data idiom (gallery_importable 047,
-- gallery_facet_* 063): a plain column on settlements, written by the existing
-- RLS-gated "Users update own settlements" .update() (migration 001), so no new
-- RLS policy is needed — an owner already controls every gallery_* column on
-- their own row. Unlike the facet columns this digest is NOT a query-time IN-list
-- filter, so no index is added; it is read for display on the dossier hero only.
--
-- The value is plain bounded text (client sanitizeRealmArcSummary strips angle
-- brackets + clamps to 600 chars before write). Nullable, defaults NULL — every
-- existing row keeps a clean empty digest until its owner next re-shares.
--
-- OPERATOR
--   • Apply via `supabase db push` (or the SQL editor). Additive + idempotent
--     (`add column if not exists`), safe to re-run. No data backfill required —
--     existing rows surface an empty digest until their owner re-shares.
--   • Rollback: `alter table public.settlements drop column if exists gallery_realm_arc_summary;`
-- ────────────────────────────────────────────────────────────────────────────

alter table public.settlements
  add column if not exists gallery_realm_arc_summary text;

comment on column public.settlements.gallery_realm_arc_summary is
  'Public-safe realm-arc digest (the §S4 war/pantheon epic) — a derived, client-sanitized scalar (plain text, <=600 chars), NOT the raw chronicle. Written at share/re-share time by the owner''s RLS-gated update; read for display on the public dossier hero. Owner-controlled; defaults NULL.';
