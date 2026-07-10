-- ────────────────────────────────────────────────────────────────────────────
-- 073_publish_map_restore_account_guard.sql — forward-fix: restore the account
-- status guard that publish_map lost when 072 recreated it.
--
-- ROOT CAUSE: 072 rebuilt publish_map "from 046's body verbatim" to add the
-- p_importable opt-in — but 046 was NOT the live definition. Migration 059
-- (enforce_account_status_rls) recreated publish_map AFTER 046, adding two
-- top-of-body gates that reject a banned / disabled / soft-deleted account:
--     if auth.uid() is null then raise exception 'not authenticated'; end if;
--     if not public.account_is_active(auth.uid()) then raise ...; end if;
-- Dropping the 4-arg signature + creating the 5-arg one in 072 superseded 059 in
-- place and silently lost those gates, re-opening map publishing to non-active
-- accounts. (An authz regression — owner-only, no cross-user exposure or
-- privilege escalation, but it reopens a policy the team deliberately enforced.)
--
-- This recreates publish_map with the FULL guard set, so it is strictly stronger
-- than any prior live definition:
--   • 059's account-status gates (RESTORED here), PLUS
--   • 046's map_with_campaign member-ownership IDOR guard (which 059 had itself
--     dropped; 072 already restored it; kept here), PLUS
--   • 072's p_importable opt-in (coalesce(p_importable, current) preserves the
--     prior choice on a re-share that omits it).
--
-- OPERATOR
--   • Apply via `supabase db push` (or the SQL editor) AFTER 072. Idempotent
--     (create or replace on the 5-arg signature 072 established). No column or
--     data change. unpublish_map already keeps its 059 guards and is untouched.
--   • SECURITY: until this is applied, the live publish_map (072) lets a
--     banned/disabled account re-share its own maps. Apply promptly.
--   • Rollback: re-applying 072's publish_map reintroduces the gap — not advised.
-- ════════════════════════════════════════════════════════════════════════════

create or replace function public.publish_map(
  target_id    uuid,
  p_kind       text default 'map',
  p_description text default null,
  p_tags       text[] default null,
  p_importable boolean default null
) returns text
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  existing_slug text;
  new_slug      text;
  v_kind        text := case when p_kind = 'map_with_campaign' then 'map_with_campaign' else 'map' end;
  v_map         jsonb;
  v_unowned     int;
begin
  -- Account-status gates (migration 059): a banned / disabled / soft-deleted
  -- account may not publish. Lost in 072's recreate; restored here.
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  select map_data into v_map from public.saved_maps where id = target_id and user_id = auth.uid();
  if not found then raise exception 'Not found or not owned by caller'; end if;

  -- map_with_campaign member-ownership IDOR guard (migration 046): every member
  -- settlement must be owned by the caller.
  if v_kind = 'map_with_campaign' then
    select count(*) into v_unowned
      from jsonb_array_elements_text(coalesce(v_map->'campaign'->'settlementIds', v_map->'settlementIds', '[]'::jsonb)) as sid
      where not exists (select 1 from public.settlements s where s.id::text = sid and s.user_id = auth.uid());
    if v_unowned > 0 then
      raise exception 'Cannot share a campaign containing settlements you do not own';
    end if;
  end if;

  select public_slug into existing_slug from public.saved_maps where id = target_id;
  if existing_slug is null then
    loop
      new_slug := public._make_public_slug();
      begin
        update public.saved_maps
          set is_public = true, public_slug = new_slug, published_at = now(),
              share_kind = v_kind, gallery_share_campaign = (v_kind = 'map_with_campaign'),
              gallery_description = left(coalesce(p_description, ''), 500), gallery_tags = p_tags,
              gallery_importable = coalesce(p_importable, gallery_importable)
          where id = target_id;
        existing_slug := new_slug;
        exit;
      exception when unique_violation then /* retry */
      end;
    end loop;
  else
    update public.saved_maps
      set is_public = true, published_at = now(), share_kind = v_kind,
          gallery_share_campaign = (v_kind = 'map_with_campaign'),
          gallery_description = left(coalesce(p_description, ''), 500), gallery_tags = p_tags,
          gallery_importable = coalesce(p_importable, gallery_importable)
      where id = target_id;
  end if;
  return existing_slug;
end $$;

revoke all on function public.publish_map(uuid, text, text, text[], boolean) from public;
grant execute on function public.publish_map(uuid, text, text, text[], boolean) to authenticated;
