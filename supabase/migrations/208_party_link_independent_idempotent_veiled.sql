-- ════════════════════════════════════════════════════════════════════════════
-- 208 — the party link: idempotent, veiled, owner-aware, independent of the listing
-- ════════════════════════════════════════════════════════════════════════════
-- WRITTEN-NOT-DEPLOYED (standing law; applies via `supabase db push` at the deploy
-- step, never from a lane). SW-B7a PARTY-LINK (the chair's brief STYLE-2-WAVE
-- 2026-11-09, SW-B7 rows (c), (d), (f), (g); the owner's words of 2026-11-09 in the
-- running record ODQ-934.105). Recreates the five settlement party-link RPCs of
-- migration 168 and derives 168's `visibility` column from the slug. The map RPCs
-- (share/rotate/revoke/get/list_my *_map_unlisted) are untouched.
--
-- (c) THE LINK IS IDEMPOTENT. The owner: "make sure that the link persists as long
--     as the settlement does and any changes to the settlement doesn't creat a new
--     link just updates the old one." 168's share_settlement_unlisted minted a fresh
--     slug on EVERY call, so a second press of "Unlisted link" (a stale tab, a second
--     device) killed the link the players held (src/lib/saves.js guarded it on the
--     client only). Now an existing slug is returned unchanged with no write at all;
--     only rotate_settlement_unlisted_slug mints anew, only revoke_settlement_unlisted
--     ends it. get_unlisted_dossier already read the LIVE row, so the town's changes
--     show through the same link (168, unchanged in that respect).
--
-- (d) THE LINK HONOURS THE VEIL. 168's get_unlisted_dossier applied
--     _gallery_sanitize_public_json ALONE: no "Reveal DM content" (gallery_share_dm),
--     no per-member overrides, and the client's unlisted branch had no
--     gallery_member_overrides to project the veil's deltas from. Now the read builds
--     the dossier EXACTLY as get_gallery_dossier (147, 093's security model) does —
--     the settlement-level projection by gallery_share_dm, then
--     _gallery_apply_member_overrides — and returns gallery_share_dm and
--     gallery_member_overrides so src/lib/gallery.js's unlisted branch runs
--     sanitizeDossier (toPublicSafe + projectShareVeil) as the public branch does.
--
-- (f) THE OWNER IS TOLD. get_unlisted_dossier returns is_owner = (s.user_id =
--     auth.uid()), false for anon, so the client routes the owner to the library
--     view instead of the players' page (the owner's redirect).
--
-- (g) BOTH AT ONCE. The party link is a capability independent of the gallery
--     listing: share no longer touches is_public, is_featured or visibility-as-
--     listing; get_unlisted_dossier keys on unlisted_slug alone; revoke nulls the slug
--     alone; list_my_unlisted_dossiers keys on the slug's presence; rotate keys on the
--     slug's presence. publish_settlement (105) and unpublish_settlement (059) never
--     touched the slug and are NOT recreated (pinned by execution). The column
--     `visibility` is DERIVED: 'unlisted' exactly when unlisted_slug is not null, held
--     by a check constraint after a backfill; it no longer means "absent from the
--     gallery" (is_public alone says that). Its writers (these RPCs, 171's moderation
--     path) already write it in step with the slug.
--
-- Pinned by execution: tests/security/galleryUnlisted.pglite.test.js.
--
-- @rollback: re-create share_settlement_unlisted, rotate_settlement_unlisted_slug,
--   revoke_settlement_unlisted, get_unlisted_dossier and list_my_unlisted_dossiers at
--   their migration-168 bodies, and `alter table public.settlements drop constraint
--   if exists settlements_visibility_derived`. No data is lost either way: the
--   backfill only re-states visibility from unlisted_slug, and no slug is minted,
--   moved or dropped by this migration. A row that is listed AND linked under 208
--   stays both under 168's read (168's get_unlisted_dossier keys on visibility, which
--   the backfill keeps 'unlisted' for every linked row).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. visibility derived from the slug (g) ──────────────────────────────────
update public.settlements
   set visibility = case when unlisted_slug is null then 'public' else 'unlisted' end
 where visibility is distinct from (case when unlisted_slug is null then 'public' else 'unlisted' end);

alter table public.settlements drop constraint if exists settlements_visibility_derived;
alter table public.settlements
  add constraint settlements_visibility_derived
  check ((visibility = 'unlisted') = (unlisted_slug is not null));

comment on column public.settlements.visibility is
  'DERIVED (208): ''unlisted'' exactly when unlisted_slug is not null (a party link exists), else ''public''. It says nothing about the gallery listing — is_public alone governs that, and a settlement may be listed and linked at once.';

-- ── 2. share — idempotent, independent of the listing (c, g) ─────────────────
create or replace function public.share_settlement_unlisted(target_id uuid)
returns text
language plpgsql security definer set search_path = public, pg_temp
as $$
declare new_slug text; existing_slug text; owns boolean;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then raise exception 'account is not active'; end if;
  select true, unlisted_slug into owns, existing_slug
    from public.settlements where id = target_id and user_id = auth.uid();
  if owns is null then raise exception 'Not found or not owned by caller'; end if;

  -- (c) The link the players hold stands: an existing slug is returned unchanged,
  -- with no write. Only rotate mints anew; only revoke ends it.
  if existing_slug is not null then return existing_slug; end if;

  -- (g) The listing is not touched: is_public, is_featured and public_slug stay as
  -- they are. Mint, retrying on the (astronomically unlikely) unique collision.
  loop
    new_slug := public._make_unlisted_slug();
    begin
      update public.settlements
        set visibility = 'unlisted', unlisted_slug = new_slug,
            published_at = coalesce(published_at, now())
        where id = target_id and user_id = auth.uid();
      exit;
    exception when unique_violation then
      -- retry with a new slug
    end;
  end loop;
  return new_slug;
end;
$$;
grant execute on function public.share_settlement_unlisted(uuid) to authenticated;

-- ── 3. rotate — keyed on the slug's presence (g) ─────────────────────────────
create or replace function public.rotate_settlement_unlisted_slug(target_id uuid)
returns text
language plpgsql security definer set search_path = public, pg_temp
as $$
declare new_slug text; has_link boolean;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then raise exception 'account is not active'; end if;
  select (unlisted_slug is not null) into has_link
    from public.settlements where id = target_id and user_id = auth.uid();
  if has_link is null then raise exception 'Not found or not owned by caller'; end if;
  if not has_link then raise exception 'Settlement is not shared as unlisted'; end if;

  loop
    new_slug := public._make_unlisted_slug();
    begin
      update public.settlements set unlisted_slug = new_slug
        where id = target_id and user_id = auth.uid();
      exit;
    exception when unique_violation then
    end;
  end loop;
  return new_slug;
end;
$$;
grant execute on function public.rotate_settlement_unlisted_slug(uuid) to authenticated;

-- ── 4. revoke — nulls the slug alone (g) ─────────────────────────────────────
-- The listing (is_public, public_slug) is untouched; visibility follows the slug.
create or replace function public.revoke_settlement_unlisted(target_id uuid)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  update public.settlements set unlisted_slug = null, visibility = 'public'
    where id = target_id and user_id = auth.uid();
  if not found then raise exception 'Not found or not owned by caller'; end if;
end;
$$;
grant execute on function public.revoke_settlement_unlisted(uuid) to authenticated;

-- ── 5. the by-slug read — the veil's twin, the owner bit, the slug alone (d, f, g) ──
-- The dossier is built EXACTLY as get_gallery_dossier (147) builds `data`: the
-- narrated copy when the owner chose it, the settlement-level projection by
-- gallery_share_dm, then the per-member overrides (093's model: a member reveal never
-- widens the settlement level). gallery_share_dm and gallery_member_overrides travel
-- so the client applies the same projection and the veil's deltas.
create or replace function public.get_unlisted_dossier(p_slug text)
returns jsonb
language sql stable security definer set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'id', s.id,
    'name', s.name,
    'tier', s.tier,
    'slug', s.unlisted_slug,
    'unlisted', true,
    'author_name', ap.external_name,
    'is_owner', coalesce(s.user_id = auth.uid(), false),
    'gallery_share_dm', coalesce(s.gallery_share_dm, false),
    'gallery_member_overrides', s.gallery_member_overrides,
    'dossier', public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(base.j)
           else public._gallery_sanitize_public_json(base.j) end,
      public._gallery_dm_full_json(base.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, false
    )
  )
  from public.settlements s
  left join public.profiles ap on ap.id = s.user_id
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  where s.unlisted_slug = p_slug
  limit 1;
$$;
grant execute on function public.get_unlisted_dossier(text) to authenticated, anon;

-- ── 6. the owner's list — keyed on the slug's presence (g) ───────────────────
create or replace function public.list_my_unlisted_dossiers()
returns table (id uuid, unlisted_slug text, name text, tier text, published_at timestamptz)
language sql stable security definer set search_path = public, pg_temp
as $$
  select id, unlisted_slug, name, tier, published_at
    from public.settlements
    where user_id = auth.uid() and unlisted_slug is not null
    order by published_at desc nulls last;
$$;
grant execute on function public.list_my_unlisted_dossiers() to authenticated;
