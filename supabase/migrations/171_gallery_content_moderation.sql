-- ────────────────────────────────────────────────────────────────────────────
-- 171_gallery_content_moderation.sql — staff moderation for publicly shared
-- gallery content: settlements (dossiers) AND saved_maps (a shared campaign is a
-- saved_maps row, share_kind='map_with_campaign'), owner-ordered 2026-07-21.
--
-- Three reversible, staff-only, audited verbs per shared item — DELETE (soft),
-- SET PRIVATE (unpublish without deleting), and a new BAN flag that unpublishes
-- AND blocks re-publishing while set. Settlements already had admin soft-delete /
-- remove / revoke (053); saved_maps had NO admin takedown path at all (census
-- finding). This closes that gap and adds the ban across both tables.
--
-- THE BAN CHOKEPOINT (structural prevention). Rather than teach every current AND
-- future publish path (publish_settlement 105, publish_map 148, share_*_unlisted
-- + rotate_* 168, set_featured* 168, set_curated 011) to check a ban flag — a
-- fork-discipline hazard, and the unlisted-slug channel is easy to miss — a single
-- BEFORE INSERT/UPDATE trigger on each table refuses to let a banned row become
-- publicly reachable (is_public=true OR a non-null unlisted_slug). Every publish
-- path flows through the row write, so the trigger covers them all by
-- construction, including paths added later. Featured/curated need is_public=true
-- (which the trigger blocks), so they are covered transitively.
--
-- EXCLUSIVITY: every RPC is SECURITY DEFINER, service_role-granted, and re-checks
-- has_role(admin,developer) inside (mirrors 053). Regular users keep their
-- self-serve unpublish/delete rights (059 unpublish_*, owner RLS) untouched.
--
-- WRITTEN-NOT-DEPLOYED (standing law): applied-head.json stays behind this file.
--
-- @rollback: forward-fix only. To reverse: drop triggers
--   trg_enforce_moderation_ban on settlements + saved_maps; drop functions
--   enforce_moderation_ban, admin_soft_delete_map, admin_remove_gallery_map,
--   admin_set_content_banned; drop columns moderation_banned_at /
--   moderation_banned_by / moderation_ban_reason from settlements + saved_maps and
--   admin_deleted_at from saved_maps. Purely additive; all columns default null so
--   no data migration is needed. Reads profiles only via has_role (no profiles
--   write) — note included per the money/PII discipline.
-- ────────────────────────────────────────────────────────────────────────────

-- 1. Moderation-ban columns on both public content tables. Written ONLY by the
--    service-role RPCs below; no user policy grants them. saved_maps also gains
--    the admin_deleted_at soft-delete flag (settlements already has it from 053).
alter table public.settlements
  add column if not exists moderation_banned_at timestamptz,
  add column if not exists moderation_banned_by uuid,
  add column if not exists moderation_ban_reason text;

alter table public.saved_maps
  add column if not exists moderation_banned_at timestamptz,
  add column if not exists moderation_banned_by uuid,
  add column if not exists moderation_ban_reason text,
  add column if not exists admin_deleted_at timestamptz;

comment on column public.settlements.moderation_banned_at is
  'When set, the settlement is under a reversible staff moderation ban: unpublished AND blocked from re-publishing (enforce_moderation_ban trigger). Cleared by admin_set_content_banned unban.';
comment on column public.saved_maps.moderation_banned_at is
  'When set, the map/campaign is under a reversible staff moderation ban: unpublished AND blocked from re-publishing (enforce_moderation_ban trigger).';

-- 2. THE CHOKEPOINT — a banned row can never become publicly reachable. Covers
--    every publish/share/rotate/republish path (present + future) that writes the
--    row, plus the unlisted-slug channel. Fires on INSERT and UPDATE.
create or replace function public.enforce_moderation_ban()
returns trigger
language plpgsql
as $$
begin
  if new.moderation_banned_at is not null
     and (new.is_public = true or new.unlisted_slug is not null) then
    raise exception 'content is under moderation ban and cannot be published'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_moderation_ban on public.settlements;
create trigger trg_enforce_moderation_ban
  before insert or update on public.settlements
  for each row execute function public.enforce_moderation_ban();

drop trigger if exists trg_enforce_moderation_ban on public.saved_maps;
create trigger trg_enforce_moderation_ban
  before insert or update on public.saved_maps
  for each row execute function public.enforce_moderation_ban();

-- 3. admin_soft_delete_map — the saved_maps twin of admin_soft_delete_settlement
--    (053). Reversible: flag + unpublish; restore clears the flag (re-publishing
--    stays the owner's choice). HIGHEST role only.
create or replace function public.admin_soft_delete_map(
  p_actor  uuid,
  p_id     uuid,
  p_delete boolean,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  before_pub boolean;
  before_del boolean;
begin
  if not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_id is null then raise exception 'map id is required'; end if;

  select is_public, (admin_deleted_at is not null)
    into before_pub, before_del
    from public.saved_maps where id = p_id;
  if not found then raise exception 'map not found'; end if;

  if p_delete then
    update public.saved_maps
      set admin_deleted_at = now(), is_public = false, is_featured = false, featured_order = null
      where id = p_id;
  else
    update public.saved_maps
      set admin_deleted_at = null
      where id = p_id;
  end if;

  perform public.write_audit(
    p_action          => case when p_delete then 'soft_delete_map' else 'restore_map' end,
    p_target_user_id  => null,
    p_target_type     => 'saved_map',
    p_target_id       => p_id::text,
    p_reason          => nullif(btrim(coalesce(p_reason, '')), ''),
    p_before          => jsonb_build_object('is_public', before_pub, 'deleted', before_del),
    p_after           => jsonb_build_object('deleted', p_delete),
    p_was_destructive => p_delete,
    p_was_reversible  => true,
    p_user_notified   => false,
    p_actor_id        => p_actor
  );

  return jsonb_build_object('deleted', p_delete);
end;
$$;

revoke all on function public.admin_soft_delete_map(uuid, uuid, boolean, text) from public;
grant execute on function public.admin_soft_delete_map(uuid, uuid, boolean, text) to service_role;

-- 4. admin_remove_gallery_map — SET PRIVATE for a map/campaign (unpublish without
--    deleting; the owner keeps their content). Twin of admin_remove_gallery_item.
create or replace function public.admin_remove_gallery_map(
  p_actor  uuid,
  p_id     uuid,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  before_pub boolean;
begin
  if not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_id is null then raise exception 'map id is required'; end if;

  select is_public into before_pub from public.saved_maps where id = p_id;
  if not found then raise exception 'map not found'; end if;

  update public.saved_maps
    set is_public = false, is_featured = false, featured_order = null
    where id = p_id;

  perform public.write_audit(
    p_action          => 'remove_gallery_map',
    p_target_user_id  => null,
    p_target_type     => 'saved_map',
    p_target_id       => p_id::text,
    p_reason          => nullif(btrim(coalesce(p_reason, '')), ''),
    p_before          => jsonb_build_object('is_public', before_pub),
    p_after           => jsonb_build_object('is_public', false),
    p_was_destructive => true,
    p_was_reversible  => true,
    p_user_notified   => false,
    p_actor_id        => p_actor
  );

  return jsonb_build_object('is_public', false);
end;
$$;

revoke all on function public.admin_remove_gallery_map(uuid, uuid, text) from public;
grant execute on function public.admin_remove_gallery_map(uuid, uuid, text) to service_role;

-- 5. admin_set_content_banned — the reversible BAN, unified across both tables via
--    p_kind. On ban: stamp the flag AND take the item down (is_public=false,
--    unlisted_slug=null, un-feature/un-curate) so the trigger permits the write
--    and no public channel survives. On unban: clear the flag (re-publishing stays
--    the owner's choice). HIGHEST role only.
create or replace function public.admin_set_content_banned(
  p_actor  uuid,
  p_kind   text,
  p_id     uuid,
  p_ban    boolean,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  before_banned boolean;
  clean_reason text := nullif(btrim(coalesce(p_reason, '')), '');
begin
  if not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_id is null then raise exception 'content id is required'; end if;
  if p_kind not in ('settlement', 'map') then raise exception 'invalid content kind'; end if;

  if p_kind = 'settlement' then
    select (moderation_banned_at is not null) into before_banned
      from public.settlements where id = p_id;
    if not found then raise exception 'settlement not found'; end if;
    if p_ban then
      update public.settlements
        set moderation_banned_at = now(), moderation_banned_by = p_actor,
            moderation_ban_reason = clean_reason,
            is_public = false, is_featured = false, is_curated = false, curated_order = null,
            unlisted_slug = null, visibility = 'public'
        where id = p_id;
    else
      update public.settlements
        set moderation_banned_at = null, moderation_banned_by = null, moderation_ban_reason = null
        where id = p_id;
    end if;
  else
    select (moderation_banned_at is not null) into before_banned
      from public.saved_maps where id = p_id;
    if not found then raise exception 'map not found'; end if;
    if p_ban then
      update public.saved_maps
        set moderation_banned_at = now(), moderation_banned_by = p_actor,
            moderation_ban_reason = clean_reason,
            is_public = false, is_featured = false, featured_order = null,
            unlisted_slug = null, visibility = 'public'
        where id = p_id;
    else
      update public.saved_maps
        set moderation_banned_at = null, moderation_banned_by = null, moderation_ban_reason = null
        where id = p_id;
    end if;
  end if;

  perform public.write_audit(
    p_action          => case when p_ban then 'ban_content' else 'unban_content' end,
    p_target_user_id  => null,
    p_target_type     => p_kind,
    p_target_id       => p_id::text,
    p_reason          => clean_reason,
    p_before          => jsonb_build_object('banned', before_banned),
    p_after           => jsonb_build_object('banned', p_ban),
    p_was_destructive => p_ban,
    p_was_reversible  => true,
    p_user_notified   => false,
    p_actor_id        => p_actor
  );

  return jsonb_build_object('banned', p_ban, 'kind', p_kind);
end;
$$;

revoke all on function public.admin_set_content_banned(uuid, text, uuid, boolean, text) from public;
grant execute on function public.admin_set_content_banned(uuid, text, uuid, boolean, text) to service_role;
