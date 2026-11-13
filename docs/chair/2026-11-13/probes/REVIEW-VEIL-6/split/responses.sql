-- REVIEW-VEIL-6: one line a share and a read, the md5 of what the read sends (the body and the served share beside
-- it), so two chains holding the same stored rows can be compared response by response.
\pset tuples_only on
\pset format unaligned
select set_config('test.uid', '', false);
select s.public_slug || '|gallery|' || coalesce((select md5(g.data::text || coalesce(g.gallery_member_overrides::text, '') || g.name || coalesce(g.tier, '')) from public.get_gallery_dossier(s.public_slug) g), 'NO ROW')
  from public.settlements s where s.public_slug is not null order by 1;
select s.public_slug || '|link|' || coalesce(md5((public.get_unlisted_dossier(s.unlisted_slug) - 'author_name')::text), 'NO ROW') from public.settlements s where s.public_slug is not null order by 1;
select s.public_slug || '|map|' || coalesce((select md5((public.get_gallery_map(m.public_slug) -> 'members')::text) from public.saved_maps m where m.map_data->'campaign'->'settlementIds' ? s.id::text limit 1), 'NO ROW')
  from public.settlements s where s.public_slug is not null and (hashtext(s.public_slug) % 4) = 0 order by 1;
select set_config('test.uid', '22222222-2222-2222-2222-222222222222', false);
select s.public_slug || '|import|' || coalesce((select md5(g.data::text) from public.import_gallery_dossier(s.public_slug) g), 'NO ROW') from public.settlements s where s.public_slug is not null order by 1;
