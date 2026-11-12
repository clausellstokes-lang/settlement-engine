create schema if not exists rv;
create or replace function rv.mk(slug text, d text, ov text default '{}', dm boolean default false, ai text default null) returns void language plpgsql as $f$
begin
  delete from public.saved_maps where public_slug = 'm-' || slug;
  delete from public.settlements where public_slug = 'p-' || slug;
  insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility,
    gallery_member_overrides, gallery_share_dm, gallery_importable, gallery_share_narrated, ai_data)
  values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'T', 'town', d::jsonb, true, 'p-' || slug, now(), 'l-' || slug, 'unlisted',
    ov::jsonb, dm, true, ai is not null, case when ai is null then null else jsonb_build_object('aiSettlement', ai::jsonb) end);
  insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign)
  select gen_random_uuid(), user_id, 'm', jsonb_build_object('campaign', jsonb_build_object('settlementIds', jsonb_build_array(id::text))), true, 'm-' || slug, 'map_with_campaign', true
    from public.settlements where public_slug = 'p-' || slug;
end $f$;
create or replace function rv.reads(slug text) returns text language plpgsql as $f$
declare o text := ''; r text;
begin
  perform set_config('test.uid', '', false);
  begin perform (select data from public.get_gallery_dossier('p-' || slug)); o := o || 'gallery ok'; exception when others then o := o || 'gallery RAISE ' || sqlerrm; end;
  begin perform public.get_unlisted_dossier('l-' || slug); o := o || ' | link ok'; exception when others then o := o || ' | link RAISE ' || sqlerrm; end;
  begin perform public.get_gallery_map('m-' || slug); o := o || ' | map ok'; exception when others then o := o || ' | map RAISE ' || sqlerrm; end;
  perform set_config('test.uid', '22222222-2222-2222-2222-222222222222', false);
  begin perform (select data from public.import_gallery_dossier('p-' || slug)); o := o || ' | import ok'; exception when others then o := o || ' | import RAISE ' || sqlerrm; end;
  perform set_config('test.uid', '', false);
  return o;
end $f$;
