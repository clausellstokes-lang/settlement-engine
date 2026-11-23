-- every response of the four reads for every stored share, hashed whole (one line a share and read)
select 'G|' || public_slug || '|' || md5(coalesce((select jsonb_agg(to_jsonb(g))::text from public.get_gallery_dossier(public_slug) g), 'null')) from public.settlements order by public_slug;
select 'L|' || public_slug || '|' || md5(coalesce(public.get_unlisted_dossier(unlisted_slug)::text, 'null')) from public.settlements order by public_slug;
select set_config('test.uid', '22222222-2222-2222-2222-222222222222', false) \g /dev/null
select 'I|' || public_slug || '|' || md5(coalesce((select jsonb_agg(to_jsonb(i))::text from public.import_gallery_dossier(public_slug) i), 'null')) from public.settlements order by public_slug;
select set_config('test.uid', '', false) \g /dev/null
select 'M|' || public_slug || '|' || md5(coalesce(public.get_gallery_map(public_slug)::text, 'null')) from public.saved_maps where public_slug is not null order by public_slug;
