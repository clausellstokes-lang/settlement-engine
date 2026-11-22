-- 120_gallery_import_premium_gate.sql
--
-- Server-gate gallery DOSSIER IMPORT behind premium — close a client-only paywall.
--
-- THE BUG. Importing a shared gallery settlement is a PREMIUM feature (the
-- entitlement ladder: sharing to the gallery is free, importing a clone is
-- premium — parity with import_gallery_map). But the gate was enforced ONLY in the
-- client (campaignSlice.importGallerySettlement throws 'Importing settlements is a
-- premium feature' for a non-premium tier). The server RPC import_gallery_dossier
-- (048, net-current body 093) returned the importable clone to ANY signed-in caller
-- — so a free account could bypass the paywall entirely by calling the RPC directly
-- (supabase.rpc('import_gallery_dossier', ...)) and saving the returned clone through
-- the normal save path. A client-side entitlement check is a UX affordance, not a
-- boundary; this makes the server authoritative, matching every other paid gate.
--
-- THE FIX. Recreate import_gallery_dossier from its NET-CURRENT body (093 — the
-- member-override projection, verbatim) and add ONE predicate to the WHERE clause:
--   and public.current_user_has_premium_access()
-- current_user_has_premium_access (024) is TRUE for tier='premium', is_founder, and
-- role in (developer, admin) — exactly the set the client gate allows (Cartographer,
-- Founder Lifetime, and elevated test roles), so a legitimate importer is unaffected
-- and a free/anon caller gets ZERO rows (the client reads that as "not available to
-- import"). Everything else — the (id, name, tier, data) shape, the share_dm /
-- narrated / member-override sanitization, the is_public + gallery_importable +
-- signed-in guards, the grant to authenticated — is 093 verbatim. `language sql`
-- returns no rows rather than raising, so the failure mode is identical to a
-- non-importable slug: a clean "not available", never a leaked payload.
--
-- SHARING STAYS FREE. This gates IMPORT (cloning) only. The public VIEW path
-- (get_gallery_dossier) and publishing are untouched — a free user can still browse
-- and read shared dossiers; they just can't clone one into their own library.
--
-- @rollback: recreate import_gallery_dossier from the 093 body WITHOUT the
--   current_user_has_premium_access() predicate (re-opening the free-import bypass).
--   Roll back only to unblock a broken deploy, then re-apply.

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
    public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(base.j) else public._gallery_sanitize_public_json(base.j) end,
      public._gallery_dm_full_json(base.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, true
    ) as data
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
    -- ── mig 120: IMPORT is premium (server-authoritative). Free/anon → 0 rows. ──
    and public.current_user_has_premium_access()
  limit 1;
$$;

revoke execute on function public.import_gallery_dossier(text) from public;
grant execute on function public.import_gallery_dossier(text) to authenticated;

comment on function public.import_gallery_dossier(text) is
  'Authenticated clone-for-import read, PREMIUM-gated server-side (120). Returns the member-override settlement projection (by gallery_share_dm) for a public + gallery_importable dossier — but ONLY to a caller with current_user_has_premium_access() (premium / founder / developer / admin). A free/anon caller gets zero rows, closing the client-only import paywall. Sharing + public viewing stay free.';
