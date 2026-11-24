-- ════ PART D: settlements and saved_maps, the columns the server owns (ruling G1 §5) ════
-- In plain words: an owner may no longer clear a staff ban or an admin soft-delete on their own
-- settlement or campaign, feature or curate it, set its counters, or move its retention dates. Those
-- columns are written only by the server's own functions (bans, soft-deletes, curation, view and
-- import counts, the downgrade retention window), which run as their owner and are not affected, and
-- by the service-role edge functions. A row a user inserts carries the columns' defaults.
-- The guard is SECURITY INVOKER: it reads current_user, which is the signed-in user on a direct write
-- and the function's owner inside a SECURITY DEFINER function.
-- Columns a page writes directly stay OUT (listed in the hand-back for a ruling): is_public,
-- public_slug, published_at, unlisted_slug, visibility, and every content and gallery_* column.
-- Safe to run twice. To undo:
--     drop trigger if exists trg_guard_server_owned_columns on public.settlements;
--     drop trigger if exists trg_guard_server_owned_columns on public.saved_maps;
--     drop function if exists public._guard_server_owned_columns();
create or replace function public._guard_server_owned_columns()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_defaults jsonb;
  v_new jsonb := to_jsonb(new);
  v_old jsonb;
  v_col text;
begin
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;
  v_defaults := case tg_table_name
    when 'settlements' then jsonb_build_object(
      'moderation_banned_at', null, 'moderation_banned_by', null, 'moderation_ban_reason', null,
      'admin_deleted_at', null, 'is_featured', false, 'featured_order', null, 'is_curated', false,
      'curated_order', null, 'view_count', 0, 'retention_expires_at', null, 'inactive_reason', null,
      'inactive_since', null, 'reactivated_free_at', null)
    when 'saved_maps' then jsonb_build_object(
      'moderation_banned_at', null, 'moderation_banned_by', null, 'moderation_ban_reason', null,
      'admin_deleted_at', null, 'is_featured', false, 'featured_order', null, 'view_count', 0,
      'import_count', 0, 'retention_expires_at', null, 'inactive_reason', null, 'inactive_since', null)
  end;
  if v_defaults is null then
    return new;
  end if;
  if tg_op = 'UPDATE' then
    v_old := to_jsonb(old);
  end if;
  for v_col in select jsonb_object_keys(v_defaults) loop
    if tg_op = 'UPDATE' and (v_new -> v_col) is distinct from (v_old -> v_col) then
      raise exception '%.% is written by the server alone', tg_table_name, v_col using errcode = '42501';
    elsif tg_op = 'INSERT' and (v_new -> v_col) is distinct from (v_defaults -> v_col) then
      raise exception '%.% is written by the server alone (a new row carries its default)', tg_table_name, v_col
        using errcode = '42501';
    end if;
  end loop;
  return new;
end;
$$;

revoke all on function public._guard_server_owned_columns() from public, anon, authenticated;

comment on function public._guard_server_owned_columns() is
  'GRANTS-1 (211 part D): refuses, for anon and authenticated, a change to the columns of settlements and saved_maps that the server owns (bans, soft-deletes, curation, counters, retention); a new row carries their defaults. SECURITY INVOKER, so a SECURITY DEFINER writer (running as its owner) passes.';

drop trigger if exists trg_guard_server_owned_columns on public.settlements;
create trigger trg_guard_server_owned_columns
  before insert or update on public.settlements
  for each row execute function public._guard_server_owned_columns();

drop trigger if exists trg_guard_server_owned_columns on public.saved_maps;
create trigger trg_guard_server_owned_columns
  before insert or update on public.saved_maps
  for each row execute function public._guard_server_owned_columns();
