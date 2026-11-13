-- REVIEW-VEIL-6 — A STALE OR MALFORMED VEIL. One share with every eye shut by hand (no DM reveal, live) is copied
-- once per variant of its stored `$veil` record; each copy is read as a non-owner and my markers are counted in the
-- gallery read, the party link and the import. The first row is the share as stored; `unmarked` is the same town with
-- no veil record at all (the count a veil that is IGNORED would give). A variant whose count is near `unmarked` is a
-- veil the server dropped: every hand hide of that share would be sent.
--   psql -d <clone of a cold run's database> -v slug=<public_slug of the share> -f stale-veil.sql
\set ON_ERROR_STOP off
\pset tuples_only on
\pset format unaligned
\set reader '22222222-2222-2222-2222-222222222222'
select set_config('test.uid', '', false);
create temp table rv6_var (k text primary key, ov jsonb);
insert into rv6_var
select v.k, v.ov from public.settlements s, lateral (values
  ('00 as stored', s.gallery_member_overrides),
  ('01 unmarked (no veil record)', s.gallery_member_overrides - '$veil'),
  ('02 v is the text "1"', jsonb_set(s.gallery_member_overrides, '{$veil,v}', '"1"')),
  ('03 v is 99', jsonb_set(s.gallery_member_overrides, '{$veil,v}', '99')),
  ('04 v is 2 (the served mark)', jsonb_set(s.gallery_member_overrides, '{$veil,v}', '2')),
  ('05 v is absent', s.gallery_member_overrides #- '{$veil,v}'),
  ('06 hidden is the text "true"', jsonb_set(s.gallery_member_overrides, '{$veil,deltas}', (select jsonb_agg(d || '{"hidden":"true"}') from jsonb_array_elements(s.gallery_member_overrides->'$veil'->'deltas') d))),
  ('07 hidden is 1', jsonb_set(s.gallery_member_overrides, '{$veil,deltas}', (select jsonb_agg(d || '{"hidden":1}') from jsonb_array_elements(s.gallery_member_overrides->'$veil'->'deltas') d))),
  ('08 hidden is null', jsonb_set(s.gallery_member_overrides, '{$veil,deltas}', (select jsonb_agg(d || '{"hidden":null}') from jsonb_array_elements(s.gallery_member_overrides->'$veil'->'deltas') d))),
  ('09 deltas is an object', jsonb_set(s.gallery_member_overrides, '{$veil,deltas}', '{"a":1}')),
  ('10 deltas is absent', s.gallery_member_overrides #- '{$veil,deltas}'),
  ('11 the veil record is null', jsonb_set(s.gallery_member_overrides, '{$veil}', 'null')),
  ('12 the veil record is a list', jsonb_set(s.gallery_member_overrides, '{$veil}', '[]')),
  ('13 the veil record is a text', jsonb_set(s.gallery_member_overrides, '{$veil}', '"x"')),
  ('14 one junk delta first', jsonb_set(s.gallery_member_overrides, '{$veil,deltas}', '[{"address":17,"hidden":true},"x",null,[1]]'::jsonb || (s.gallery_member_overrides->'$veil'->'deltas'))),
  ('15 2,500 deltas (500 junk first)', jsonb_set(s.gallery_member_overrides, '{$veil,deltas}', (select jsonb_agg(jsonb_build_object('address', 'field:npc:none' || g || ':secret', 'hidden', true)) from generate_series(1, 500 + greatest(0, 2000 - jsonb_array_length(s.gallery_member_overrides->'$veil'->'deltas'))) g) || (s.gallery_member_overrides->'$veil'->'deltas'))),
  ('16 every address in capitals', jsonb_set(s.gallery_member_overrides, '{$veil,deltas}', (select jsonb_agg(jsonb_set(d, '{address}', to_jsonb(upper(d->>'address')))) from jsonb_array_elements(s.gallery_member_overrides->'$veil'->'deltas') d))),
  ('17 mode snapshot, no copy', jsonb_set(s.gallery_member_overrides, '{$veil,mode}', '"snapshot"')),
  ('18 mode snapshot, the copy a list', jsonb_set(jsonb_set(s.gallery_member_overrides, '{$veil,mode}', '"snapshot"'), '{$veil,snapshot}', '[]')),
  ('19 mode snapshot, the copy the OWNER''s whole record', jsonb_set(jsonb_set(s.gallery_member_overrides, '{$veil,mode}', '"snapshot"'), '{$veil,snapshot}', s.data)),
  ('20 mode is junk', jsonb_set(s.gallery_member_overrides, '{$veil,mode}', '"x"')),
  ('21 a groupings list planted (the served shape)', jsonb_set(s.gallery_member_overrides, '{$veil,groupings}', '[]'))
) v(k, ov) where s.public_slug = :'slug';
insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
select gen_random_uuid(), s.user_id, s.name, s.tier, s.data, true, 'sv' || left(v.k, 2), now(), 'svl' || left(v.k, 2), 'unlisted', v.ov, :dm, true
  from public.settlements s, rv6_var v where s.public_slug = :'slug';
create temp table rv6_res (k text, read text, markers int, err text);
do $$
declare r record; n int; t text;
begin
  for r in select k, 'sv' || left(k, 2) as slug, 'svl' || left(k, 2) as link from rv6_var order by k loop
    begin select (select count(distinct m[1]) from regexp_matches(g.data::text || coalesce(g.gallery_member_overrides::text, ''), '(vq6n[0-9]+z)', 'g') m) into n from public.get_gallery_dossier(r.slug) g;
      insert into rv6_res values (r.k, 'gallery', n, case when n is null then 'NO ROW' end);
    exception when others then insert into rv6_res values (r.k, 'gallery', null, left(sqlerrm, 70)); end;
    begin select (select count(distinct m[1]) from regexp_matches(public.get_unlisted_dossier(r.link)::text, '(vq6n[0-9]+z)', 'g') m) into n;
      insert into rv6_res values (r.k, 'link', n, case when public.get_unlisted_dossier(r.link) is null then 'NO ROW' end);
    exception when others then insert into rv6_res values (r.k, 'link', null, left(sqlerrm, 70)); end;
    begin perform set_config('test.uid', '22222222-2222-2222-2222-222222222222', true);
      select (select count(distinct m[1]) from regexp_matches(g.data::text, '(vq6n[0-9]+z)', 'g') m) into n from public.import_gallery_dossier(r.slug) g;
      insert into rv6_res values (r.k, 'import', n, case when n is null then 'NO ROW' end);
    exception when others then insert into rv6_res values (r.k, 'import', null, left(sqlerrm, 70)); end;
  end loop;
end $$;
select k || ' | gallery ' || coalesce(max(markers) filter (where read = 'gallery')::text, '-') || coalesce(' (' || max(err) filter (where read = 'gallery') || ')', '')
         || ' | link ' || coalesce(max(markers) filter (where read = 'link')::text, '-') || coalesce(' (' || max(err) filter (where read = 'link') || ')', '')
         || ' | import ' || coalesce(max(markers) filter (where read = 'import')::text, '-') || coalesce(' (' || max(err) filter (where read = 'import') || ')', '')
  from rv6_res group by k order by k;
