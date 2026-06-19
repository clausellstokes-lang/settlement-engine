-- ────────────────────────────────────────────────────────────────────────────
-- 048_gallery_import_dossier.sql — server-gated "import this dossier" read.
--
-- Pairs with the gallery_importable opt-in (047). A signed-in user may clone a
-- public dossier into their OWN library only when the owner opted in. This RPC
-- is the server-authoritative gate: it returns the clone-ready payload ONLY for
-- a dossier that is is_public AND gallery_importable, and ONLY to an
-- authenticated caller. The client then inserts the clone through the normal
-- save path, where the per-tier save-limit trigger (014) enforces the cap.
--
-- PRIVACY: the returned `data` is the SAME server-sanitized projection the
-- public viewer already sees (full DM view only when the owner set
-- gallery_share_dm; otherwise _gallery_sanitize_public_json) — never raw s.data.
-- Importing therefore cannot expose anything the gallery page didn't already
-- show. Crucially this RPC does NOT return the generation `seed` (a separate
-- column it never selects), so an imported clone cannot regenerate the
-- unsanitized original via the deterministic engine.
--
-- `language sql`: a non-importable / non-public / missing slug, or an
-- unauthenticated caller, yields ZERO rows (the WHERE filters them out) — the
-- client surfaces a friendly "not available to import" message. The gate is the
-- WHERE clause, enforced server-side regardless of the client.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.import_gallery_dossier(dossier_slug text)
returns table (
  id uuid,
  name text,
  tier text,
  data jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.name,
    s.tier,
    case
      when s.gallery_share_dm then public._gallery_dm_full_json(base.j)
      else public._gallery_sanitize_public_json(base.j)
    end as data
  from public.settlements s
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  where s.public_slug = dossier_slug
    and s.is_public = true
    and s.gallery_importable = true
    and auth.uid() is not null
  limit 1;
$$;

revoke execute on function public.import_gallery_dossier(text) from public;
grant execute on function public.import_gallery_dossier(text) to authenticated;

comment on function public.import_gallery_dossier(text) is
  'Authenticated clone-for-import read: returns {id,name,tier,data} ONLY for a public, gallery_importable dossier, and ONLY to a signed-in caller. Data is the same server-sanitized projection the public viewer sees (DM-full only when gallery_share_dm); never the raw row and never the generation seed. The client inserts the clone through the normal save path (save-limit trigger 014 enforces the cap).';
