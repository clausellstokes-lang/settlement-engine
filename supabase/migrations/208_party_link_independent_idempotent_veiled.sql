-- ════════════════════════════════════════════════════════════════════════════
-- 208 — the party link: idempotent, veiled, owner-aware, independent of the listing
-- ════════════════════════════════════════════════════════════════════════════
-- WRITTEN-NOT-DEPLOYED (standing law; applies via `supabase db push` at the deploy
-- step, never from a lane). SW-B7a PARTY-LINK (the chair's brief STYLE-2-WAVE
-- 2026-11-09, SW-B7 rows (c), (d), (f), (g); the owner's words of 2026-11-09 in the
-- running record ODQ-934.105). Recreates settlement party-link RPCs of migration 168. The map RPCs
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
-- Pinned by execution: tests/security/galleryUnlisted.pglite.test.js.
--
-- @rollback: re-create the recreated functions at their migration-168 bodies. No data
--   is lost either way: no slug is minted, moved or dropped by this migration.
-- ════════════════════════════════════════════════════════════════════════════

-- ── 2. share — idempotent (c) ────────────────────────────────────────────────
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

  -- Mint, retrying on the (astronomically unlikely) unique collision.
  loop
    new_slug := public._make_unlisted_slug();
    begin
      update public.settlements
        set visibility = 'unlisted', is_public = false, is_featured = false,
            unlisted_slug = new_slug, published_at = coalesce(published_at, now())
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

